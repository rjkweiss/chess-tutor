## System Architecture Overview

### High-Level Architecture
```
┌────────────────────────────────────────────────────────────────────────┐
│                              USER BROWSER                              │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                    FRONTEND (React + TypeScript)               │    │
│  │                                                                │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │    │
│  │  │   UI Layer   │  │  State Mgmt  │  │   Chess Engine     │    │    │
│  │  │              │  │   (Zustand)  │  │   (TypeScript)     │    │    │
│  │  │ • Board      │  │              │  │                    │    │    │
│  │  │ • Pieces     │  │ • User auth  │  │ • Move validation  │    │    │
│  │  │ • Tutorial   │  │ • Progress   │  │ • Legal moves      │    │    │
│  │  │ • Analysis   │  │ • Settings   │  │ • Check/Checkmate  │    │    │
│  │  └──────────────┘  └──────────────┘  └────────────────────┘    │    │
│  │         │                  │                    │              │    │
│  └─────────┼──────────────────┼────────────────────┼──────────────┘    │
│            │                  │                    │                   │
└────────────┼──────────────────┼────────────────────┼───────────────────┘
             │                  │                    │
             │                  │                    │
    ┌────────▼──────────┬───────▼────────┬──────────▼──────────┐
    │   GraphQL/REST    │   WebSocket    │    Local Only       │
    │   (HTTP/HTTPS)    │   (WSS)        │   (No network)      │
    └────────┬──────────┴───────┬────────┴─────────────────────┘
             │                  │
             │                  │
┌────────────▼──────────────────▼────────────────────────────────────────┐
│                        BACKEND (FastAPI + Python)                      │
│                                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      API Gateway Layer                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │   │
│  │  │   GraphQL    │  │  WebSocket   │  │   REST Endpoints     │   │   │
│  │  │   Resolver   │  │   Handler    │  │   (Fallback/Simple)  │   │   │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────────────┘   │   │
│  └─────────┼──────────────────┼──────────────────┼─────────────────┘   │
│            │                  │                  │                     │
│  ┌─────────▼──────────────────▼──────────────────▼─────────────────┐   │
│  │                     Business Logic Layer                        │   │
│  │                                                                 │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐   │   │
│  │  │   Auth   │  │  Games   │  │ Tutorial │  │   AI Tutor     │   │   │
│  │  │  Module  │  │  Module  │  │  Module  │  │    Module      │   │   │
│  │  │          │  │          │  │          │  │                │   │   │
│  │  │ • Login  │  │ • CRUD   │  │ • Load   │  │ • Prompt GPT   │   │   │
│  │  │ • Register│ │ • Moves  │  │ • Track  │  │ • Stream resp  │   │   │
│  │  │ • JWT    │  │ • History│  │ • Progress│ │ • Context      │   │   │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───────┬────────┘   │   │
│  │       │             │             │                │            │   │
│  └───────┼─────────────┼─────────────┼────────────────┼────────────┘   │
│          │             │             │                │                │
│  ┌───────▼─────────────▼─────────────▼────────────────▼───────────┐    │
│  │                    Analysis Module                             │    │
│  │  ┌──────────────────────────────────────────────────────────┐  │    │
│  │  │              Stockfish Service                           │  │    │
│  │  │  • Position evaluation                                   │  │    │
│  │  │  • Best move calculation                                 │  │    │
│  │  │  • Game analysis                                         │  │    │
│  │  │  • Mistake detection                                     │  │    │
│  │  └──────────────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────────────┘    │
│          │             │             │                │                │
│          │             │             │                │                │
└──────────┼─────────────┼─────────────┼────────────────┼────────────────┘
           │             │             │                │
           │             │             │                │
┌──────────▼─────────────▼─────────────▼────────────────▼────────────────┐
│                        Data Layer                                      │
│                                                                        │
│  ┌────────────────────────┐    ┌──────────────────────────────────┐    │
│  │  PostgreSQL Database   │    │      Redis Cache (Phase 2)       │    │
│  │                        │    │                                  │    │
│  │  ┌──────────────────┐  │    │  ┌────────────────────────────┐  │    │
│  │  │ users            │  │    │  │ Sessions                   │  │    │
│  │  │ games            │  │    │  │ Active game states         │  │    │
│  │  │ moves            │  │    │  │ Rate limiting counters     │  │    │
│  │  │ tutorial_progress│  │    │  │ Leaderboard cache          │  │    │
│  │  │ mistake_patterns │  │    │  └────────────────────────────┘  │    │
│  │  └──────────────────┘  │    │                                  │    │
│  └────────────────────────┘    └──────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      External Services                                  │
│                                                                         │
│  ┌───────────────────────┐         ┌──────────────────────────────┐     │
│  │   OpenAI GPT-4 API    │         │   Stockfish Binary           │     │
│  │                       │         │   (Local Process)            │     │
│  │  • Generate           │         │                              │     │
│  │    explanations       │         │  • Evaluate positions        │     │
│  │  • Hints              │         │  • Calculate best moves      │     │
│  │  • Feedback           │         │  • Depth analysis            │     │
│  └───────────────────────┘         └──────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Detailed Data Flow Diagrams

#### Flow 1: User Makes a Move (Real-time Gameplay)
```
┌──────────┐
│  USER    │
└────┬─────┘
     │ 1. Drags piece from e2 to e4
     ▼
┌─────────────────────────────────────┐
│  Frontend Chess Engine              │
│  (TypeScript - Runs in Browser)     │
└────┬────────────────────────────────┘
     │ 2. Validates move instantly (<10ms)
     │
     ├─► INVALID ──► Show error message
     │
     └─► VALID
         │ 3. Update UI immediately (optimistic update)
         │    • Move piece visually
         │    • Update board state
         │    • Add to move history
         ▼
    ┌─────────────────────────────┐
    │  WebSocket Connection       │
    └────┬────────────────────────┘
         │ 4. Send move to backend
         │    { from: 'e2', to: 'e4', fen: '...' }
         ▼
    ┌─────────────────────────────────────┐
    │  Backend - Game Module              │
    └────┬────────────────────────────────┘
         │ 5. Store move in database
         │
         ├──► 6a. Async: Queue for analysis
         │         │
         │         ▼
         │    ┌─────────────────────────────┐
         │    │ Stockfish Service           │
         │    │ • Evaluate position         │
         │    │ • Find best move            │
         │    └────┬────────────────────────┘
         │         │ Returns: { eval: "+0.5", best: "Nf6" }
         │         ▼
         │    ┌─────────────────────────────┐
         │    │ AI Tutor Module (GPT)       │
         │    │ • Generate explanation      │
         │    └────┬────────────────────────┘
         │         │ 7. Stream response token by token
         │         ▼
         │    ┌─────────────────────────────┐
         │    │ WebSocket (Server → Client) │
         │    └────┬────────────────────────┘
         │         │
         └─────────┼─► 6b. Immediate: Calculate opponent move
                   │         │
                   │         ▼
                   │    ┌─────────────────────────────┐
                   │    │ Game AI (Stockfish)         │
                   │    │ • Generate move at strength │
                   │    └────┬────────────────────────┘
                   │         │ Returns opponent move
                   │         ▼
                   │    ┌─────────────────────────────┐
                   │    │ WebSocket (Server → Client) │
                   │    └────┬────────────────────────┘
                   │         │
         ┌─────────▼─────────▼──────────┐
         │  Frontend                    │
         │  • Display opponent move     │
         │  • Show AI explanation       │
         │  • Update board              │
         └──────────────────────────────┘
```

---

#### Flow 2: Tutorial Progression
```
┌──────────┐
│  USER    │
└────┬─────┘
     │ 1. Navigate to Phase 0, Module 1
     ▼
┌─────────────────────────────────────┐
│  Frontend - Tutorial Component      │
└────┬────────────────────────────────┘
     │ 2. Load tutorial content
     ▼
┌─────────────────────────────────────┐
│  Local JSON Files                   │
│  /public/tutorials/phase-0/*.json   │
└────┬────────────────────────────────┘
     │ 3. Returns tutorial screens
     │    { screens: [...], interactions: [...] }
     ▼
┌─────────────────────────────────────┐
│  Frontend Rendering                 │
│  • Display narration                │
│  • Show interactive board           │
│  • Enable user input                │
└────┬────────────────────────────────┘
     │ 4. User completes screen
     │    (e.g., correctly places piece)
     ▼
┌─────────────────────────────────────┐
│  Frontend Chess Engine              │
│  • Validates action                 │
│  • Provides feedback                │
└────┬────────────────────────────────┘
     │ 5. On success, mark complete
     ▼
┌─────────────────────────────────────┐
│  GraphQL Mutation                   │
│  mutation {                         │
│    updateTutorialProgress(          │
│      lessonId: "board-setup",       │
│      screenId: "place-rook"         │
│    )                                │
│  }                                  │
└────┬────────────────────────────────┘
     │ 6. Send to backend
     ▼
┌─────────────────────────────────────┐
│  Backend - Tutorial Module          │
└────┬────────────────────────────────┘
     │ 7. Update database
     ▼
┌─────────────────────────────────────┐
│  PostgreSQL                         │
│  UPDATE tutorial_progress           │
│  SET completed_screens = [...]      │
└─────────────────────────────────────┘
```

---

#### Flow 3: Post-Game Analysis
```
┌──────────┐
│  USER    │
└────┬─────┘
     │ 1. Game ends (checkmate/draw)
     ▼
┌─────────────────────────────────────┐
│  Frontend                           │
│  • Collect all moves                │
│  • Collect final position           │
└────┬────────────────────────────────┘
     │ 2. Request analysis
     │    POST /api/analyze/game
     │    { moves: [...], result: "checkmate" }
     ▼
┌─────────────────────────────────────┐
│  Backend - Analysis Module          │
└────┬────────────────────────────────┘
     │ 3. Iterate through each move
     │
     ├─► For each position:
     │   │
     │   ▼
     │ ┌─────────────────────────────────┐
     │ │  Stockfish Service              │
     │ │  • Evaluate position before     │
     │ │  • User makes move              │
     │ │  • Evaluate position after      │
     │ │  • Calculate evaluation drop    │
     │ └────┬────────────────────────────┘
     │      │ If drop > 1.0 (mistake!)
     │      ▼
     │ ┌─────────────────────────────────┐
     │ │  Mistake detected!              │
     │ │  • Move: e5                     │
     │ │  • Eval before: +1.5            │
     │ │  • Eval after: -0.5             │
     │ │  • Drop: -2.0                   │
     │ │  • Best move was: Nf6           │
     │ └────┬────────────────────────────┘
     │      │
     ▼      ▼
┌─────────────────────────────────────┐
│  For each mistake:                  │
│  Call AI Tutor Module               │
└────┬────────────────────────────────┘
     │ 4. Generate explanations
     ▼
┌─────────────────────────────────────┐
│  OpenAI GPT-4                       │
│  Prompt: "Explain why e5 was bad    │
│  and why Nf6 is better for a        │
│  beginner who lost 2.0 eval"        │
└────┬────────────────────────────────┘
     │ 5. Returns natural language
     │    "Moving your pawn to e5 left
     │     your knight undefended..."
     ▼
┌─────────────────────────────────────┐
│  Backend builds response            │
│  {                                  │
│    totalMistakes: 5,                │
│    mistakes: [                      │
│      { move: "e5",                  │
│        explanation: "...",          │
│        bestMove: "Nf6" }            │
│    ]                                │
│  }                                  │
└────┬────────────────────────────────┘
     │ 6. Return to frontend
     ▼
┌─────────────────────────────────────┐
│  Frontend - Analysis View           │
│  • Display mistakes chronologically │
│  • Show board at each mistake       │
│  • Highlight mistake patterns       │
│  • Track improvement over time      │
└─────────────────────────────────────┘
```

---

#### Flow 4: User Authentication
```
┌──────────┐
│  USER    │
└────┬─────┘
     │ 1. Enters email + password
     ▼
┌─────────────────────────────────────┐
│  Frontend - Login Form              │
└────┬────────────────────────────────┘
     │ 2. Submit credentials
     │    POST /api/auth/login
     │    { email: "...", password: "..." }
     ▼
┌─────────────────────────────────────┐
│  Backend - Auth Module              │
└────┬────────────────────────────────┘
     │ 3. Lookup user in database
     ▼
┌─────────────────────────────────────┐
│  PostgreSQL                         │
│  SELECT * FROM users                │
│  WHERE email = '...'                │
└────┬────────────────────────────────┘
     │ 4. Returns user record
     │    { id, email, password_hash }
     ▼
┌─────────────────────────────────────┐
│  Backend - Auth Module              │
│  • Compare password with bcrypt     │
└────┬────────────────────────────────┘
     │
     ├─► INVALID ──► 401 Unauthorized
     │
     └─► VALID
         │ 5. Generate JWT token
         │    { userId, email, exp: 7days }
         ▼
    ┌─────────────────────────────────┐
    │  PyJWT                          │
    │  jwt.encode(payload, secret)    │
    └────┬────────────────────────────┘
         │ 6. Return token
         │    { token: "eyJ...", user: {...} }
         ▼
    ┌─────────────────────────────────┐
    │  Frontend                       │
    │  • Store token (HTTP-only cookie│
    │    or localStorage)             │
    │  • Update Zustand auth state    │
    │  • Redirect to dashboard        │
    └─────────────────────────────────┘

    For subsequent requests:
    ┌─────────────────────────────────┐
    │  Frontend                       │
    │  • Attach token to headers      │
    │    Authorization: Bearer <token>│
    └────┬────────────────────────────┘
         │
         ▼
    ┌─────────────────────────────────┐
    │  Backend - Auth Middleware      │
    │  • Verify JWT signature         │
    │  • Check expiration             │
    │  • Extract user info            │
    └────┬────────────────────────────┘
         │
         ├─► VALID ──► Allow request
         │
         └─► INVALID ──► 401 Unauthorized
```

---

### Component Communication Matrix

| Component | Communicates With | Protocol | Purpose |
|-----------|------------------|----------|---------|
| **Frontend UI** | Frontend Chess Engine | Function calls | Move validation, legal moves |
| **Frontend UI** | Zustand Store | JavaScript | Read/write global state |
| **Frontend UI** | Backend GraphQL | HTTPS | Fetch user data, game history |
| **Frontend UI** | Backend WebSocket | WSS | Real-time game moves |
| **Frontend Chess Engine** | None (local only) | - | Standalone validation |
| **Backend GraphQL** | Auth Module | Function calls | Verify user permissions |
| **Backend GraphQL** | Games Module | Function calls | CRUD operations |
| **Backend GraphQL** | Tutorial Module | Function calls | Progress tracking |
| **Backend WebSocket** | Games Module | Function calls | Live game state |
| **Backend WebSocket** | Analysis Module | Function calls | Position evaluation |
| **Games Module** | PostgreSQL | SQL | Store/retrieve games |
| **Analysis Module** | Stockfish Binary | STDIN/STDOUT | Position analysis |
| **AI Tutor Module** | OpenAI API | HTTPS | Generate explanations |
| **Auth Module** | PostgreSQL | SQL | User lookup |
| **Auth Module** | bcrypt library | Function calls | Password hashing |
| **Auth Module** | PyJWT library | Function calls | Token generation |

---

### Technology Stack by Layer
```
┌─────────────────────────────────────────────────────────────────┐
│ PRESENTATION LAYER                                              │
│ • React 18+ (UI framework)                                      │
│ • TypeScript (type safety)                                      │
│ • CSS Modules (styling)                                         │
│ • React Testing Library (component tests)                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ STATE MANAGEMENT LAYER                                          │
│ • Zustand (global state)                                        │
│ • React hooks: useState, useReducer (local state)               │
│ • Apollo Client (GraphQL cache)                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ BUSINESS LOGIC LAYER (Frontend)                                 │
│ • Custom TypeScript Chess Engine                                │
│ • FEN notation parser/generator                                 │
│ • Move validation logic                                         │
│ • Game state management                                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ API LAYER                                                       │
│ • GraphQL (queries/mutations)                                   │
│ • WebSocket (real-time)                                         │
│ • REST (fallback/simple endpoints)                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ BACKEND APPLICATION LAYER                                       │
│ • FastAPI (web framework)                                       │
│ • Strawberry GraphQL (GraphQL for FastAPI)                      │
│ • python-socketio (WebSocket support)                           │
│ • Pydantic (data validation)                                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ BUSINESS LOGIC LAYER (Backend)                                  │
│ • Auth: JWT generation, password verification                   │
│ • Games: CRUD, move storage, game retrieval                     │
│ • Tutorials: Progress tracking, content serving                 │
│ • AI Tutor: GPT prompts, response streaming                     │
│ • Analysis: Stockfish integration, mistake detection            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ DATA ACCESS LAYER                                               │
│ • SQLAlchemy (ORM)                                              │
│ • Alembic (migrations)                                          │
│ • Redis client (Phase 2)                                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ DATA STORAGE LAYER                                              │
│ • PostgreSQL 15+ (primary database)                             │
│ • Redis 7+ (cache, sessions - Phase 2)                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ EXTERNAL SERVICES                                               │
│ • OpenAI GPT-4 API (AI explanations)                            │
│ • Stockfish 16+ (chess analysis)                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ INFRASTRUCTURE & DEVOPS                                         │
│ • Docker (containerization)                                     │
│ • GitHub Actions (CI/CD)                                        │
│ • Railway/Render/Fly.io (hosting)                               │
│ • GitHub (version control)                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

### Security Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│ SECURITY LAYERS                                                 │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────┐     │
│ │ 1. TRANSPORT SECURITY                                   │     │
│ │    • HTTPS/TLS for all HTTP traffic                     │     │
│ │    • WSS (WebSocket Secure) for real-time               │     │
│ └─────────────────────────────────────────────────────────┘     │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────┐     │
│ │ 2. AUTHENTICATION                                       │     │
│ │    • JWT tokens (7-day expiration)                      │     │
│ │    • HTTP-only cookies (prevent XSS)                    │     │
│ │    • Refresh token rotation                             │     │
│ └─────────────────────────────────────────────────────────┘     │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────┐     │
│ │ 3. PASSWORD SECURITY                                    │     │
│ │    • bcrypt hashing (12 rounds)                         │     │
│ │    • Password strength requirements                     │     │
│ │    • Rate limiting on login attempts                    │     │
│ └─────────────────────────────────────────────────────────┘     │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────┐     │
│ │ 4. API SECURITY                                         │     │
│ │    • CORS configuration (whitelist origins)             │     │
│ │    • Rate limiting (100 req/min per user)               │     │
│ │    • Input validation (Pydantic models)                 │     │
│ │    • SQL injection prevention (ORM)                     │     │
│ └─────────────────────────────────────────────────────────┘     │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────┐     │
│ │ 5. DATA SECURITY                                        │     │
│ │    • Environment variables for secrets                  │     │
│ │    • Encrypted database connections                     │     │
│ │    • No sensitive data in logs                          │     │
│ └─────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture (Phase 3)
```
┌───────────────────────────────────────────────────────────────────┐
│                          PRODUCTION                               │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐      │
│  │               CDN (Cloudflare or similar)               │      │
│  │               • Static assets                           │      │
│  │               • DDoS protection                         │      │
│  └────────────────────┬────────────────────────────────────┘      │
│                       │                                           │
│  ┌────────────────────▼────────────────────────────────────┐      │
│  │         Frontend Hosting (Vercel / Netlify)             │      │
│  │         • React production build                        │      │
│  │         • Automatic deployments from GitHub             │      │
│  │         • Edge functions                                │      │
│  └────────────────────┬────────────────────────────────────┘      │
│                       │                                           │
│                       │ API Calls                                 │
│                       ▼                                           │
│  ┌─────────────────────────────────────────────────────────┐      │
│  │      Backend Hosting (Railway / Render / Fly.io)        │      │
│  │                                                         │      │
│  │  ┌──────────────────────────────────────────────────┐   │      │
│  │  │  Docker Container: FastAPI App                   │   │      │
│  │  │  • Environment: production                       │   │      │
│  │  │  • Auto-scaling enabled                          │   │      │
│  │  │  • Health checks                                 │   │      │
│  │  └──────────────────────────────────────────────────┘   │      │
│  │                       │                                 │      │
│  │                       ▼                                 │      │
│  │  ┌──────────────────────────────────────────────────┐   │      │
│  │  │  Managed PostgreSQL                              │   │      │
│  │  │  • Automatic backups                             │   │      │
│  │  │  • Connection pooling                            │   │      │
│  │  └──────────────────────────────────────────────────┘   │      │
│  │                       │                                 │      │
│  │                       ▼                                 │      │
│  │  ┌──────────────────────────────────────────────────┐   │      │
│  │  │  Redis Cache (Phase 2)                           │   │      │
│  │  │  • Managed instance                              │   │      │
│  │  │  • Persistence enabled                           │   │      │
│  │  └──────────────────────────────────────────────────┘   │      │
│  └─────────────────────────────────────────────────────────┘      │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐      │
│  │                  Monitoring & Logging                   │      │
│  │  • Error tracking (Sentry)                              │      │
│  │  • Performance monitoring (built-in)                    │      │
│  │  • Log aggregation                                      │      │
│  └─────────────────────────────────────────────────────────┘      │
└───────────────────────────────────────────────────────────────────┘
```
