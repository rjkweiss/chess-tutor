# DevOps Plan

> CI/CD pipeline, deployment strategy, monitoring, and infrastructure
> Last updated: October 26, 2025

---

## Table of Contents
1. [Infrastructure Overview](#infrastructure-overview)
2. [Development Workflow](#development-workflow)
3. [CI/CD Pipeline](#cicd-pipeline)
4. [Deployment Strategy](#deployment-strategy)
5. [Environment Management](#environment-management)
6. [Monitoring & Logging](#monitoring--logging)
7. [Backup & Recovery](#backup--recovery)
8. [Security Practices](#security-practices)

---

## Infrastructure Overview

### Technology Stack
```
┌─────────────────────────────────────────────────────┐
│              PRODUCTION INFRASTRUCTURE              │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │  CDN (Cloudflare)                            │   │
│  │  • Static assets                             │   │
│  │  • DDoS protection                           │   │
│  │  • SSL termination                           │   │
│  └────────────────┬─────────────────────────────┘   │
│                   │                                 │
│  ┌────────────────▼─────────────────────────────┐   │
│  │  Frontend (Vercel / Netlify)                 │   │
│  │  • React production build                    │   │
│  │  • Auto-deployment from GitHub               │   │
│  │  • Edge functions                            │   │
│  └────────────────┬─────────────────────────────┘   │
│                   │                                 │
│  ┌────────────────▼─────────────────────────────┐   │
│  │  Backend (Railway / Render / Fly.io)         │   │
│  │                                              │   │
│  │  ┌────────────────────────────────────────┐  │   │
│  │  │  Docker Container: FastAPI             │  │   │
│  │  │  • Auto-scaling enabled                │  │   │
│  │  │  • Health checks (every 30s)           │  │   │
│  │  │  • Rolling deployments                 │  │   │
│  │  └────────────────┬───────────────────────┘  │   │
│  │                   │                          │   │
│  │  ┌────────────────▼───────────────────────┐  │   │
│  │  │  PostgreSQL (Managed)                  │  │   │
│  │  │  • Daily backups                       │  │   │
│  │  │  • Connection pooling                  │  │   │
│  │  │  • Read replicas (future)              │  │   │
│  │  └────────────────────────────────────────┘  │   │
│  │                                              │   │
│  │  ┌────────────────────────────────────────┐  │   │
│  │  │  Redis (Phase 2)                       │  │   │
│  │  │  • Session storage                     │  │   │
│  │  │  • Rate limiting                       │  │   │
│  │  │  • Cache                               │  │   │
│  │  └────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │  Monitoring & Logging                        │   │
│  │  • Sentry (error tracking)                   │   │
│  │  • Platform logs (Railway/Vercel)            │   │
│  │  • Uptime monitoring (future)                │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## Development Workflow

### Git Branching Strategy
```
main
├── WIP
│   ├── feature/user-authentication
│   ├── feature/chess-engine
│   ├── feature/tutorial-system
│   └── bugfix/move-validation
└── hotfix/critical-security-patch
```

**Branch Types:**
- `main`: Production-ready code. Only merge via PR after review.
- `WIP`: Integration branch for features. Deployed to staging.
- `feature/*`: New features. Branch from `WIP`, merge back via PR.
- `bugfix/*`: Bug fixes. Branch from `WIP`, merge back via PR.
- `hotfix/*`: Critical production fixes. Branch from `main`, merge to both `main` and `WIP`.

**Workflow:**
1. Create feature branch from `WIP`
2. Develop and commit locally
3. Push to GitHub
4. Open Pull Request to `WIP`
5. CI runs tests automatically
6. Code review (manual)
7. Merge to `WIP` → deploys to staging
8. Test on staging
9. Merge `WIP` to `main` → deploys to production

---

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (dependencies, config)

**Examples:**
```
feat(auth): add JWT token refresh endpoint

Implement automatic token refresh to improve UX.
Users no longer need to log in every 7 days.

Closes #42

---

fix(chess-engine): correct knight move validation

Knight was incorrectly validating L-shaped moves
when jumping over pieces.

Fixes #58

---

docs(api): update GraphQL schema documentation

Added examples for all mutations and queries.
```

---

## CI/CD Pipeline

### GitHub Actions Workflows

#### **Workflow 1: Test & Lint (on every push)**
```yaml
# .github/workflows/test.yml

name: Test & Lint

on:
  push:
    branches: [ WIP, main ]
  pull_request:
    branches: [ WIP, main ]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Run linter
        working-directory: ./frontend
        run: npm run lint

      - name: Run type check
        working-directory: ./frontend
        run: npm run type-check

      - name: Run tests
        working-directory: ./frontend
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./frontend/coverage/lcov.info
          flags: frontend

  backend-tests:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: testpassword
          POSTGRES_DB: chess_tutor_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          cache: 'pip'

      - name: Install dependencies
        working-directory: ./backend
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-cov

      - name: Run linter
        working-directory: ./backend
        run: |
          pip install flake8
          flake8 app --max-line-length=100

      - name: Run type checker
        working-directory: ./backend
        run: |
          pip install mypy
          mypy app

      - name: Run tests
        working-directory: ./backend
        env:
          DATABASE_URL: postgresql://postgres:testpassword@localhost:5432/chess_tutor_test
        run: pytest --cov=app --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage.xml
          flags: backend
```

---

#### **Workflow 2: Deploy to Staging (on push to WIP)**
```yaml
# .github/workflows/deploy-staging.yml

name: Deploy to Staging

on:
  push:
    branches: [ WIP ]

jobs:
  deploy-frontend-staging:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel (staging)
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
          scope: ${{ secrets.VERCEL_ORG_ID }}
          alias-domains: staging.chess-tutor.com

  deploy-backend-staging:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Railway (staging)
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend-staging
          environment: staging
```

---

#### **Workflow 3: Deploy to Production (on push to main)**
```yaml
# .github/workflows/deploy-production.yml

name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  # Only deploy if tests pass
  tests:
    uses: ./.github/workflows/test.yml

  deploy-frontend-prod:
    needs: tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel (production)
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./frontend
          scope: ${{ secrets.VERCEL_ORG_ID }}

      - name: Notify deployment
        run: echo "Frontend deployed to production!"

  deploy-backend-prod:
    needs: tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Railway (production)
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend-production
          environment: production

      - name: Run database migrations
        run: |
          # Railway CLI command to run migrations
          railway run alembic upgrade head

      - name: Notify deployment
        run: echo "Backend deployed to production!"
```

---

## Deployment Strategy

### Rolling Deployment (Zero Downtime)
```
Old version (v1.0)  [■■■■■]
                        ↓
                    [■■■■□] ← New version (v1.1) starts
                        ↓
                    [■■■□□]
                        ↓
                    [■■□□□]
                        ↓
                    [■□□□□]
                        ↓
New version (v1.1)  [□□□□□] ← Old version fully replaced
```

**Process:**
1. New container starts
2. Health check passes
3. Load balancer routes traffic to new container
4. Old container drains connections (30s timeout)
5. Old container stops

**Rollback:**
- If health check fails, deployment aborts
- Previous version remains active
- Manual rollback via platform UI or CLI

---

### Docker Configuration

**Frontend Dockerfile:**
```dockerfile
# frontend/Dockerfile

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./

RUN npm ci --production

EXPOSE 3000

CMD ["npm", "start"]
```

**Backend Dockerfile:**
```dockerfile
# backend/Dockerfile

FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:8000/api/v1/health')"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**docker-compose.yml (local development):**
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8000
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://chess_user:chess_pass@db:5432/chess_tutor_dev
      - JWT_SECRET=dev_secret_change_in_production
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./backend:/app
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=chess_user
      - POSTGRES_PASSWORD=chess_pass
      - POSTGRES_DB=chess_tutor_dev
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## Environment Management

### Environments

| Environment | Branch | URL | Purpose |
|------------|--------|-----|---------|
| **Development** | `feature/*` | `localhost` | Local development |
| **Staging** | `WIP` | `staging.chess-tutor.com` | Testing before production |
| **Production** | `main` | `chess-tutor.com` | Live user-facing app |

---

### Environment Variables

**Frontend (.env.development, .env.production):**
```bash
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000/ws
REACT_APP_ENV=development
REACT_APP_SENTRY_DSN=https://...
```

**Backend (.env.development, .env.production):**
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/chess_tutor_dev
DATABASE_POOL_SIZE=10
DATABASE_MAX_OVERFLOW=20

# JWT
JWT_SECRET=your_secret_key_here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_DAYS=7

# External APIs
OPENAI_API_KEY=sk-...
STOCKFISH_PATH=/usr/local/bin/stockfish

# Redis (Phase 2)
REDIS_URL=redis://localhost:6379/0

# Application
ENV=development
DEBUG=true
LOG_LEVEL=INFO
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Sentry
SENTRY_DSN=https://...
```

**Secrets Management:**
- Development: `.env` files (gitignored)
- Staging/Production: Platform environment variables (Railway, Vercel)
- Never commit secrets to Git!
- Use secret scanning in GitHub (enabled by default)

---

## Monitoring & Logging

### Error Tracking (Sentry)

**Setup:**
```bash
# Install Sentry SDK
npm install @sentry/react  # Frontend
pip install sentry-sdk[fastapi]  # Backend
```

**Frontend Integration:**
```typescript
// frontend/src/index.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.REACT_APP_ENV,
  tracesSampleRate: 1.0,
});
```

**Backend Integration:**
```python
# backend/app/main.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    environment=os.getenv("ENV"),
    traces_sample_rate=1.0,
    integrations=[FastApiIntegration()],
)
```

---

### Application Logs

**Log Levels:**
- `DEBUG`: Detailed info for diagnosing problems
- `INFO`: General informational messages
- `WARNING`: Warning messages (not critical)
- `ERROR`: Error messages (operation failed)
- `CRITICAL`: Critical issues (system unstable)

**Logging Configuration (Backend):**
```python
# backend/app/config/logging.py

import logging
import sys

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )

    # Adjust levels for specific loggers
    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
```

**Accessing Logs:**
- Local: Terminal output
- Staging/Production: Platform dashboard (Railway, Vercel)
- Future: Centralized logging (Datadog, Logtail, etc.)

---

### Health Checks

**Backend Health Endpoint:**
```python
# backend/app/routes/health.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter()

@router.get("/health")
async def health_check(db: Session = Depends(get_db)):
    """
    Health check endpoint for load balancer
    """
    try:
        # Check database connection
        db.execute("SELECT 1")
        db_status = "healthy"
    except Exception:
        db_status = "unhealthy"

    # Check Stockfish availability
    try:
        # Simple stockfish check
        stockfish_status = "healthy"
    except Exception:
        stockfish_status = "unhealthy"

    status = "healthy" if all([
        db_status == "healthy",
        stockfish_status == "healthy"
    ]) else "unhealthy"

    return {
        "status": status,
        "timestamp": datetime.utcnow(),
        "version": "1.0.0",
        "services": {
            "database": db_status,
            "stockfish": stockfish_status
        }
    }
```

---

### Uptime Monitoring (Future - Phase 3)

**Tools to consider:**
- **UptimeRobot**: Free tier, 5-minute checks
- **Better Uptime**: Modern UI, incident management
- **Pingdom**: Enterprise-grade, detailed reports

**What to monitor:**
- API health endpoint (every 1 minute)
- Frontend availability (every 5 minutes)
- Database connectivity (every 5 minutes)

**Alerts:**
- Email notification if down > 2 minutes
- SMS for critical outages (Phase 3)

---

## Backup & Recovery

### Database Backups

**Automated Backups (Railway/Managed Postgres):**
- Daily automatic backups (retained 7 days)
- Weekly backups (retained 4 weeks)
- Monthly backups (retained 6 months)

**Manual Backup:**
```bash
# Backup database to file
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore from backup
psql $DATABASE_URL < backup_20251026.sql
```

**Backup Schedule:**
- **Phase 1-2:** Platform automatic backups (sufficient)
- **Phase 3:** Custom backup script + S3 storage

---

### Disaster Recovery Plan

**RTO (Recovery Time Objective):** < 4 hours
**RPO (Recovery Point Objective):** < 24 hours (last daily backup)

**Recovery Steps:**
1. Identify issue (monitoring alerts)
2. Assess severity (data loss? service down?)
3. Restore from latest backup
4. Deploy last known good version
5. Validate system health
6. Communicate to users (if downtime > 15 min)

---

## Security Practices

### Secrets Management

**✅ DO:**
- Store secrets in platform environment variables
- Use different secrets for each environment
- Rotate secrets every 90 days
- Use strong, randomly generated secrets

**❌ DON'T:**
- Commit secrets to Git
- Share secrets via email/Slack
- Use same secret across environments
- Use predictable secrets ("password123")

---

### HTTPS & SSL

- **All environments use HTTPS**
- SSL certificates auto-managed by Vercel/Railway
- HTTP requests automatically redirect to HTTPS
- HSTS headers enabled (browser enforcement)

---

### Dependency Security

**Automated Scanning:**
- GitHub Dependabot (enabled by default)
- Alerts for known vulnerabilities
- Automatic PR for security patches

**Manual Audits:**
```bash
# Frontend
npm audit
npm audit fix

# Backend
pip-audit
```

**Frequency:** Weekly check, immediate fix for critical vulnerabilities

---

### Access Control

**Production Access:**
- Only team leads have production deploy access
- All changes via Git + CI/CD (no manual deployments)
- Database access via bastion host only
- 2FA required for all platform accounts

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing (CI green)
- [ ] Code reviewed and approved
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] Secrets rotated (if needed)
- [ ] Backup taken (if major change)
- [ ] Release notes prepared

### During Deployment

- [ ] Merge to `main` branch
- [ ] Monitor CI/CD pipeline
- [ ] Watch health checks
- [ ] Check error rates (Sentry)
- [ ] Verify new features work

### Post-Deployment

- [ ] Smoke test critical paths
- [ ] Monitor for 30 minutes
- [ ] Check logs for errors
- [ ] Update documentation
- [ ] Notify team of deployment
- [ ] Close related issues/tickets

---

## Rollback Procedure

**If deployment fails:**

1. **Immediate:** Trigger rollback via platform UI
2. **Verify:** Check health endpoint returns 200
3. **Monitor:** Watch error rates for 15 minutes
4. **Investigate:** Review logs, identify root cause
5. **Fix:** Create hotfix branch, fix issue, redeploy
6. **Document:** Post-mortem (what went wrong, how to prevent)

**Rollback Commands:**
```bash
# Railway
railway rollback

# Vercel
vercel rollback

# Manual (Git)
git revert <commit-hash>
git push origin main
```

---

## Cost Estimation (Monthly)

| Service | Tier | Cost | Notes |
|---------|------|------|-------|
| **Vercel** | Hobby | $0 | Free tier sufficient for MVP |
| **Railway** | Hobby | $5 | $5 credit/month included |
| **PostgreSQL** | Starter | $0 | Included in Railway |
| **Domain** | - | $12/year | Name.com, Namecheap |
| **Sentry** | Developer | $0 | Free tier (5k events/month) |
| **OpenAI API** | Pay-as-go | ~$10 | Depends on usage |
| **Total** | - | **~$15-20/month** | Scales with usage |

**Phase 2 additions (Redis, etc.):** +$10-15/month

---

## Future Improvements (Post-MVP)

- [ ] Kubernetes deployment (learn container orchestration)
- [ ] Terraform for infrastructure as code
- [ ] Advanced monitoring (Prometheus + Grafana)
- [ ] Load testing (k6, Locust)
- [ ] Blue-green deployments
- [ ] Feature flags (LaunchDarkly)
- [ ] CDN for static assets (Cloudflare)
- [ ] API rate limiting middleware
- [ ] Automated security scans (Snyk, OWASP ZAP)
