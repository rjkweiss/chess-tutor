# Architecture Decision Record

> This document tracks all major architectural decisions, reasoning, and tradeoffs.

---

## Decision 1: Modular Monolith
**Date:** October 26, 2025
**Status:** ✅ Accepted

**Context:**
Choosing between microservices architecture vs. monolithic application.

**Decision:**
Single FastAPI application organized into clear modules.

**Structure:**
```
backend/app/
├── auth/          # Authentication & authorization
├── games/         # Game logic, storage, retrieval
├── tutorials/     # Tutorial content & progress tracking
├── ai_tutor/      # GPT integration for explanations
├── analysis/      # Stockfish integration (future)
├── shared/        # Shared utilities, models, types
└── main.py        # Application entry point
```

**Reasoning:**
- Learn separation of concerns without distributed systems complexity
- Easier debugging (single codebase, single deployment)
- Faster development (no inter-service communication overhead)
- Can extract to microservices later if needed (modules have clear boundaries)

**Tradeoffs:**
- **Accept:** Less "impressive" than microservices on resume
- **Accept:** All modules share same deployment/scaling
- **Gain:** Simpler development, faster iteration, easier learning
- **Gain:** Focus on system design, not infrastructure complexity

---

## Decision 2: Communication Protocols
**Date:** October 26, 2025
**Status:** ✅ Accepted

**Decision:**
Use multiple protocols for different use cases:

1. **GraphQL** - Standard queries/mutations
   - User profile and settings
   - Game history retrieval
   - Tutorial progress tracking
   - Mistake pattern analysis

2. **WebSocket** - Real-time game moves
   - Live gameplay (user vs. bot)
   - Instant move validation feedback
   - Future: multiplayer support

3. **Server-Sent Events / Streaming** - AI responses
   - Token-by-token AI explanations
   - Better UX than waiting for full response
   - Long-running analysis updates

**Reasoning:**
- Each protocol optimized for its use case
- GraphQL: flexible queries, learn modern API design
- WebSocket: real-time needs (chess moves can't have latency)
- Streaming: AI responses feel more natural/conversational

**Tradeoffs:**
- **Accept:** More complexity (3 protocols vs. 1)
- **Accept:** GraphQL learning curve (new to me)
- **Gain:** Optimal performance for each use case
- **Gain:** Learn multiple communication patterns

**Learning Priority:**
Week 5-6: Start with REST endpoints to get backend working
Week 7-8: Migrate to GraphQL once comfortable
Week 9: Add WebSocket for real-time features

---

## Decision 3: State Management
**Date:** October 26, 2025
**Status:** ✅ Accepted

**Decision:**
- **Global state:** Zustand
- **Local state:** useState / useReducer

**Global State (Zustand):**
- User authentication status
- User profile & preferences
- Tutorial progress (current module/lesson)
- Theme settings
- Language preferences (future)

**Local State (React hooks):**
- Current game state (board position, turn, move history)
- Tutorial screen navigation
- UI interactions (drag state, highlighted squares, modals)
- Form inputs

**Reasoning:**
- Zustand simpler than Redux, easier learning curve
- Already learning: TypeScript, GraphQL, TDD, DevOps - avoid Redux complexity
- useState sufficient for local/temporary state
- Clear separation: global = persisted/shared, local = temporary/component

**Tradeoffs:**
- **Accept:** Redux more common in job postings
- **Accept:** Might need to learn Redux separately for interviews
- **Gain:** Faster development, gentler learning curve
- **Gain:** Can migrate to Redux later if desired (similar patterns)

**Migration Path (Optional):**
If time permits after MVP, migrate one module to Redux Toolkit as learning exercise.

---

## Decision 4: Database Strategy
**Date:** October 26, 2025
**Status:** ✅ Accepted (Phased)

**Phase 1 (Weeks 5-8): PostgreSQL Only**
```sql
Tables:
- users (id, first_name, last_name, email, password_hash, created_at)
- games (id, user_id, moves, result, started_at, ended_at)
- tutorial_progress (user_id, phase, module_id, lesson_id, completed_screens)
- mistake_patterns (user_id, mistake_type, frequency, last_occurred)
```

**Phase 2 (Weeks 9-10): Add Redis**
- Session storage (JWT tokens, user sessions)
- Real-time game state cache (active games)
- Rate limiting for AI API calls
- Leaderboard caching (future)

**Phase 3 (Post-MVP): ElasticSearch (Maybe)**
- Only if complex search needed (probably won't be)

**Reasoning:**
- Start simple: PostgreSQL handles everything initially
- Add caching when performance needs arise (don't prematurely optimize)
- Redis perfect for ephemeral/real-time data
- ElasticSearch overkill for MVP

**Tradeoffs:**
- **Accept:** Initial version slightly slower (no caching)
- **Accept:** Might need to refactor when adding Redis
- **Gain:** Learn one technology at a time
- **Gain:** Understand when/why to add caching (not just cargo-culting)

---

## Decision 5: Chess Engine Architecture
**Date:** October 26, 2025
**Status:** ✅ Accepted

**Decision:**
Frontend TypeScript engine + Backend Stockfish integration

**Frontend Engine (TypeScript - My Code):**
- **Purpose:** Real-time move validation & game state management
- **Responsibilities:**
  - Validate move legality instantly
  - Generate legal moves for each piece
  - Detect check, checkmate, stalemate
  - Manage game state (board, turn, history)
  - Handle special moves (castling, en passant, promotion)
- **Why:** Instant UI feedback, no network latency, core learning goal

**Backend Analysis (Stockfish via python-chess):**
- **Purpose:** Position evaluation & deep analysis
- **Responsibilities:**
  - Evaluate position strength (+2.5 pawns, etc.)
  - Find best moves in any position
  - Analyze complete games for mistakes
  - Generate practice puzzles (future)
  - Provide AI opponent at various strengths
- **Why:** World-class chess strength, proven/reliable, free/open-source

**Integration Pattern:**
1. User makes move → Frontend validates instantly (< 10ms)
2. UI updates immediately (optimistic update)
3. Move sent to backend → Stored in database
4. Backend analyzes asynchronously → Returns evaluation (3-5 seconds)
5. GPT translates evaluation → Beginner-friendly explanation
6. Frontend displays feedback → User learns

**Reasoning:**
- Build chess engine from scratch (primary learning goal)
- Get world-class evaluation (Stockfish)
- Learn integration patterns (my code + external tools)
- Realistic architecture (mirrors Chess.com, Lichess)

**Tradeoffs:**
- **Accept:** Maintain chess logic in two places (validation vs. evaluation)
- **Accept:** My engine won't be as strong as Stockfish (that's okay!)
- **Gain:** Instant move feedback (critical for UX)
- **Gain:** Deep learning of chess mechanics
- **Gain:** Showcase both "build from scratch" and "integrate tools" skills

---

## Decision 6: Authentication
**Date:** October 26, 2025
**Status:** ✅ Accepted

**Decision:**
JWT-based authentication with secure password hashing

**Implementation:**
- User registration: name + email + password
- Password hashing: bcrypt (library - don't build crypto!)
- Token generation: PyJWT (library)
- Token storage: HTTP-only cookies (secure)
- Token refresh: Refresh token pattern (optional, add if time)

**Protected Routes:**
- All game endpoints
- Tutorial progress endpoints
- User profile endpoints

**Public Routes:**
- Tutorial content (read-only)
- Landing page
- Login/register

**Reasoning:**
- JWT industry standard, good for portfolio
- Learn authentication properly (but use libraries for crypto)
- Can add OAuth later if desired (Google, GitHub login)

---

## Decision 7: DevOps Strategy
**Date:** October 26, 2025
**Status:** ✅ Accepted (Phased)

**Phase 1 (Weeks 1-4): Foundation**
- ✅ Git + GitHub version control
- ✅ Local development environment
- ✅ npm/pip scripts for common tasks

**Phase 2 (Weeks 5-8): CI/CD Basics**
- ✅ GitHub Actions for automated testing (run tests on every PR)
- ✅ Docker containers (frontend + backend)
- ✅ Deploy to simple platform (Railway, Render, or Fly.io)
- ✅ Environment variables management

**Phase 3 (Weeks 9-12): Production Ready**
- ✅ Auto-deployment on merge to main
- ✅ Separate environments (dev, staging, prod)
- ✅ Basic monitoring (platform-provided)
- ✅ Error tracking (Sentry or similar)

**Phase 4 (Post-MVP): Advanced (Optional)**
- ⏸️ Kubernetes exploration (learn, but probably overkill)
- ⏸️ Terraform (infrastructure as code)
- ⏸️ Advanced monitoring (Prometheus + Grafana)

**Reasoning:**
- Learn DevOps progressively (not all at once)
- Get app working first, then improve deployment
- K8s impressive but overkill for portfolio project
- Focus on practical CI/CD that employers value

---

## Decision 8: Testing Strategy
**Date:** October 26, 2025
**Status:** ✅ Accepted

**Decision:**
Test-Driven Development (TDD) throughout

**Frontend Testing:**
- **Unit tests:** Chess engine logic (Jest)
  - Piece movement validation
  - Check/checkmate detection
  - FEN notation parsing
- **Component tests:** React components (React Testing Library)
  - Board rendering
  - Piece interaction
  - Tutorial screens
- **Integration tests:** User flows (Cypress - later)

**Backend Testing:**
- **Unit tests:** Business logic (pytest)
  - Game analysis
  - Mistake detection
  - User progress tracking
- **API tests:** Endpoint behavior (pytest + FastAPI TestClient)
  - Auth flows
  - CRUD operations
  - Error handling
- **Integration tests:** Database operations (pytest)

**TDD Approach:**
1. Write test first (red)
2. Write minimal code to pass (green)
3. Refactor for quality (refactor)
4. Repeat

**Coverage Goal:**
- Chess engine: 90%+ (critical logic)
- API endpoints: 80%+
- UI components: 70%+ (focus on behavior, not styling)

**Reasoning:**
- TDD is a primary learning goal
- Forces good design (testable = well-designed)
- Catches bugs early
- Documentation via tests
- Confidence to refactor

---

## Open Questions & Future Decisions

**To be decided later:**
1. Deployment platform: Railway vs. Render vs. Fly.io? (Week 8)
2. OAuth integration: Add Google/GitHub login? (Post-MVP)
3. Multiplayer: Add human vs. human mode? (Phase 2)
4. Mobile: React Native app? (Future)
5. Internationalization: Support multiple languages? (Future)

---

## Revision History
- **Oct 26, 2025:** Initial architecture decisions documented
