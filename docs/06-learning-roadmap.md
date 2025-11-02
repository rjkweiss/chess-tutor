# Learning Roadmap

> Week-by-week plan for building Chess Tutor
> Timeline: 12 weeks (~3 months)
> Last updated: October 26, 2025

---

## Overview

This roadmap balances **learning** with **building**. Each week focuses on specific skills while making tangible progress on the project.

**Total Time Estimate:** 10-15 hours per week
**Flexible:** Adjust timeline based on your pace
**Goal:** Finished, deployed portfolio project + deep full-stack knowledge

---

## Phase 1: Foundation (Weeks 1-4)

### Week 1: Setup & Planning ✅ (CURRENT)

**Focus:** Project initialization, documentation, tooling

**Tasks:**
- [x] Define project scope and goals
- [x] Make architecture decisions
- [x] Create documentation structure
- [x] Design data models
- [x] Set up GitHub repository
- [x] Initialize frontend (React + TypeScript)
- [x] Initialize backend (FastAPI)
- [x] Set up testing frameworks
- [x] Write first passing test

**Deliverables:**
- Complete `/docs` folder with all planning documents
- Project initialized with proper structure
- First test passing (Board initialization)

**Learning Goals:**
- Project planning and system design
- Documentation best practices
- TypeScript configuration
- Testing setup (Jest, pytest)

**Time Breakdown:**
- Planning & docs: 5-6 hours
- Project setup: 3-4 hours
- First test: 1-2 hours

---

### Week 2: Chess Engine - Part 1 (Board & Pieces)

**Focus:** TDD, TypeScript classes, OOP design

**Tasks:**
- [x] Implement `Board` class (with tests)
  - [x] Initialize starting position
  - [x] Get/set pieces
  - [ ] FEN notation support (reading)
- [x] Implement base `Piece` class
- [x] Implement `Rook` class with movement logic
- [x] Implement `Bishop` class with movement logic
- [x] Write comprehensive tests for each class

**Deliverables:**
- Board representation working
- Rook and Bishop move validation complete
- 30+ passing tests
- Test coverage >80%

**Learning Goals:**
- Test-Driven Development (red-green-refactor)
- TypeScript classes and inheritance
- FEN notation format
- Chess coordinate systems

**Key Concepts:**
```typescript
// Example test (TDD)
test('rook moves horizontally', () => {
  const board = new Board();
  const rook = board.getPieceAt('a1');
  const legalMoves = rook.getLegalMoves(board);

  expect(legalMoves).toContain('a2');
  expect(legalMoves).toContain('a7');
  expect(legalMoves).not.toContain('b1'); // Can't move yet (blocked)
});
```

**Resources to Study:**
- TypeScript Handbook: Classes
- Chess programming wiki (for algorithms)
- TDD by example (Kent Beck)

**Time Breakdown:**
- Board class: 3 hours
- Rook: 2 hours
- Bishop: 2 hours
- Tests: 3 hours
- Refactoring: 2 hours

---

### Week 3: Chess Engine - Part 2 (Remaining Pieces)

**Focus:** Complex movement patterns, edge cases

**Tasks:**
- [x] Implement `Queen` class (combines Rook + Bishop)
- [x] Implement `King` class (one square, cannot move into check)
- [x] Implement `Knight` class (L-shape, jumping)
- [x] Implement `Pawn` class (forward moves, diagonal captures)
- [x] Implement basic check detection
- [x] Write tests for all pieces and interactions

**Deliverables:**
- All pieces move correctly
- Check detection working
- 60+ passing tests
- Test coverage >85%

**Learning Goals:**
- Complex validation logic
- Edge case handling
- Collision detection
- State management in classes

**Challenging Parts:**
- Knight movement (L-shape calculation)
- Pawn rules (first move, captures, blocking)
- King cannot move into check (requires looking ahead)

**Time Breakdown:**
- Queen/King: 2 hours
- Knight: 3 hours (tricky!)
- Pawn: 4 hours (most complex rules)
- Check detection: 2 hours
- Tests & refactoring: 3 hours

---

### Week 4: Chess Engine - Part 3 (Game State & Special Moves)

**Focus:** Game flow, special rules, checkmate detection

**Tasks:**
- [ ] Implement `ChessGame` class (manages full game state)
- [ ] Add turn management (white/black alternating)
- [ ] Implement checkmate detection
- [ ] Implement stalemate detection
- [ ] Add special moves:
  - [ ] Castling
  - [x] Pawn promotion
  - [ ] En passant (optional - can defer)
- [ ] FEN notation support (writing)
- [ ] Move history tracking

**Deliverables:**
- Complete working chess engine
- Can play full games (moves, checkmate)
- Special moves working
- 100+ passing tests
- Ready for UI integration

**Learning Goals:**
- State machines
- Complex rule implementation
- Game loop logic
- Recursive algorithms (checkmate detection)

**Checkmate Detection Algorithm:**
```typescript
isCheckmate(): boolean {
  // 1. Is current player in check?
  if (!this.isInCheck(this.currentTurn)) {
    return false;
  }

  // 2. Try every possible move
  for (const piece of this.getPieces(this.currentTurn)) {
    for (const move of piece.getLegalMoves(this.board)) {
      // 3. Simulate move
      const tempBoard = this.board.clone();
      tempBoard.makeMove(piece.position, move);

      // 4. Still in check after move?
      if (!tempBoard.isInCheck(this.currentTurn)) {
        return false; // Found escape move!
      }
    }
  }

  // 5. No escape moves found
  return true;
}
```

**Time Breakdown:**
- ChessGame class: 3 hours
- Checkmate/stalemate: 4 hours
- Special moves: 4 hours
- Tests & debugging: 4 hours

**Milestone:** 🎉 Chess engine complete! You built a working chess game from scratch!

---

## Phase 2: User Interface (Weeks 5-6)

### Week 5: Basic Chess Board UI

**Focus:** React components, CSS, user interaction

**Tasks:**
- [ ] Design board layout (8x8 grid)
- [ ] Create `Board` component
- [ ] Create `Square` component
- [ ] Create `Piece` component (render piece images/icons)
- [ ] Implement piece selection (click to select)
- [ ] Highlight legal moves when piece selected
- [ ] Implement drag-and-drop OR click-to-move
- [ ] Connect UI to chess engine

**Deliverables:**
- Playable chess board UI
- Can make moves by clicking/dragging
- Board updates correctly after each move
- Visual feedback (highlights, selected piece)

**Learning Goals:**
- React component composition
- CSS Grid/Flexbox for layout
- Event handling (onClick, onDrag)
- State management (useState, useReducer)
- Connecting UI to business logic

**Component Structure:**
```
<Board>
  ├── <Square> (64 times, a1-h8)
  │   └── <Piece> (if square occupied)
  └── state: selectedSquare, legalMoves
```

**CSS Tricks:**
```css
/* Chessboard pattern */
.square {
  width: 60px;
  height: 60px;
}

.square.light {
  background: #f0d9b5;
}

.square.dark {
  background: #b58863;
}

.square.selected {
  background: #7fc97f;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.3);
}

.square.legal-move::after {
  content: '';
  display: block;
  width: 20px;
  height: 20px;
  margin: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.2);
}
```

**Time Breakdown:**
- Layout & styling: 4 hours
- Piece selection logic: 3 hours
- Legal move highlights: 2 hours
- Drag-and-drop: 3 hours
- Integration & debugging: 3 hours

---

### Week 6: Tutorial System UI

**Focus:** Content delivery, interactive lessons

**Tasks:**
- [ ] Create `TutorialScreen` component
- [ ] Implement screen navigation (Next/Back buttons)
- [ ] Create screen type components:
  - [ ] `Narration` (text + click next)
  - [ ] `Interactive` (highlighted board)
  - [ ] `Quiz` (multiple choice)
  - [ ] `Practice` (make correct move)
- [ ] Load tutorial content from JSON files
- [ ] Track progress (completed screens)
- [ ] Add progress indicators
- [ ] Create Module 1 content (board setup)

**Deliverables:**
- Tutorial system functioning
- Module 1: Board Setup playable
- Progress tracked locally (useState for now)
- Clean, intuitive UI

**Learning Goals:**
- Dynamic component rendering
- JSON data loading
- Complex state management
- User flow design

**Tutorial Component Architecture:**
```typescript
interface TutorialScreenProps {
  screen: Screen;
  onComplete: () => void;
  onBack: () => void;
}

// Render different components based on screen.type
function TutorialScreen({ screen, onComplete, onBack }: TutorialScreenProps) {
  switch (screen.type) {
    case 'narration':
      return <Narration {...screen} onNext={onComplete} />;
    case 'practice':
      return <PracticeScreen {...screen} onSuccess={onComplete} />;
    case 'quiz':
      return <QuizScreen {...screen} onCorrect={onComplete} />;
    default:
      return null;
  }
}
```

**Time Breakdown:**
- Screen components: 4 hours
- Navigation logic: 2 hours
- JSON loading: 2 hours
- Progress tracking: 2 hours
- Content creation: 3 hours
- Styling & polish: 2 hours

---

## Phase 3: Backend & Database (Weeks 7-8)

### Week 7: Backend Foundation

**Focus:** FastAPI, PostgreSQL, authentication

**Tasks:**
- [ ] Set up FastAPI project structure
- [ ] Configure PostgreSQL database
- [ ] Set up SQLAlchemy (ORM)
- [ ] Create database models (User, Game, etc.)
- [ ] Write initial migration (Alembic)
- [ ] Implement authentication endpoints:
  - [ ] POST /auth/register
  - [ ] POST /auth/login
  - [ ] POST /auth/refresh
- [ ] Implement JWT token generation/validation
- [ ] Create auth middleware
- [ ] Write API tests (pytest)

**Deliverables:**
- Backend server running
- Database connected and migrated
- User registration/login working
- JWT authentication functional
- 20+ backend tests passing

**Learning Goals:**
- FastAPI framework
- PostgreSQL and SQL
- SQLAlchemy ORM
- JWT authentication
- API design
- Backend testing

**FastAPI Structure:**
```python
# app/main.py
from fastapi import FastAPI
from app.routes import auth, games, users

app = FastAPI(title="Chess Tutor API")

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(games.router, prefix="/api/v1/games", tags=["games"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
```

**Auth Flow:**
```python
# app/routes/auth.py
@router.post("/register", response_model=AuthResponse)
async def register(data: RegisterInput, db: Session = Depends(get_db)):
    # 1. Validate email not taken
    # 2. Hash password with bcrypt
    # 3. Create user record
    # 4. Generate JWT token
    # 5. Return token + user data
    pass
```

**Time Breakdown:**
- FastAPI setup: 2 hours
- Database models: 3 hours
- Authentication: 5 hours
- Tests: 3 hours
- Documentation: 2 hours

---

### Week 8: Game & Tutorial APIs

**Focus:** CRUD operations, data persistence

**Tasks:**
- [ ] Implement Game endpoints:
  - [ ] POST /games (create game)
  - [ ] GET /games/:id (get game)
  - [ ] GET /games (list user's games)
  - [ ] PUT /games/:id (update game)
- [ ] Implement Tutorial Progress endpoints:
  - [ ] GET /progress (get user's progress)
  - [ ] POST /progress (update progress)
- [ ] Implement User endpoints:
  - [ ] GET /users/me (get current user)
  - [ ] PUT /users/me (update profile)
- [ ] Connect frontend to backend (replace mock data)
- [ ] Handle errors gracefully (try/catch, user feedback)

**Deliverables:**
- Full CRUD API for games
- Tutorial progress persisted to database
- Frontend successfully calling backend
- Error handling implemented

**Learning Goals:**
- RESTful API design
- Database queries with SQLAlchemy
- Frontend-backend integration
- Error handling strategies
- CORS configuration

**Example Endpoint:**
```python
@router.post("/games", response_model=Game)
async def create_game(
    data: CreateGameInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Create new game
    game = GameModel(
        user_id=current_user.id,
        opponent_type=data.opponent_type,
        opponent_strength=data.opponent_strength,
        user_color=data.user_color,
        user_rating_before=current_user.rating
    )
    db.add(game)
    db.commit()
    db.refresh(game)

    return game
```

**Frontend Integration:**
```typescript
// frontend/src/services/api.ts
async function createGame(data: CreateGameInput): Promise<Game> {
  const response = await fetch('/api/v1/games', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Failed to create game');
  }

  return response.json();
}
```

**Time Breakdown:**
- Game endpoints: 4 hours
- Tutorial endpoints: 2 hours
- User endpoints: 2 hours
- Frontend integration: 4 hours
- Error handling: 2 hours
- Testing: 2 hours

**Milestone:** 🎉 Full-stack app working! Frontend ↔ Backend connected!

---

## Phase 4: AI & Real-time Features (Weeks 9-10)

### Week 9: WebSocket & Real-time Gameplay

**Focus:** Real-time communication, game flow

**Tasks:**
- [ ] Set up WebSocket server (python-socketio)
- [ ] Implement WebSocket client (socket.io-client)
- [ ] Create WebSocket event handlers:
  - [ ] `join_game`
  - [ ] `make_move`
  - [ ] `opponent_moved`
  - [ ] `game_ended`
- [ ] Integrate Stockfish for bot opponent
- [ ] Implement bot move generation
- [ ] Add move validation on backend
- [ ] Handle disconnections gracefully

**Deliverables:**
- Real-time gameplay working
- Can play against bot via WebSocket
- Bot responds with legal moves
- Connection stable

**Learning Goals:**
- WebSocket protocol
- Real-time state synchronization
- Stockfish integration
- Async programming (Python asyncio)

**WebSocket Server:**
```python
# app/websocket.py
from socketio import AsyncServer

sio = AsyncServer(async_mode='asgi', cors_allowed_origins='*')

@sio.event
async def make_move(sid, data):
    game_id = data['gameId']
    move = data['move']

    # Validate move
    if not is_valid_move(game_id, move):
        await sio.emit('error', {'message': 'Invalid move'}, room=sid)
        return

    # Update game state
    update_game(game_id, move)

    # Confirm move
    await sio.emit('move_validated', {'move': move}, room=sid)

    # Generate bot response
    bot_move = stockfish.get_best_move(game_id)
    update_game(game_id, bot_move)

    # Send bot move
    await sio.emit('opponent_moved', {'move': bot_move}, room=sid)
```

**Time Breakdown:**
- WebSocket setup: 3 hours
- Event handlers: 3 hours
- Stockfish integration: 4 hours
- Testing & debugging: 4 hours
- Error handling: 2 hours

---

### Week 10: AI Tutor Integration (GPT)

**Focus:** AI explanations, natural language generation

**Tasks:**
- [ ] Set up OpenAI API client
- [ ] Implement game analysis endpoint
- [ ] Create prompt templates for:
  - [ ] Move explanations
  - [ ] Mistake analysis
  - [ ] General hints
  - [ ] Post-game summary
- [ ] Implement streaming responses (token-by-token)
- [ ] Add AI hint system (real-time during game)
- [ ] Create analysis UI component
- [ ] Handle rate limiting and errors

**Deliverables:**
- AI-generated explanations working
- Post-game analysis shows mistakes with AI feedback
- Hints available during gameplay
- Streaming responses for better UX

**Learning Goals:**
- OpenAI API integration
- Prompt engineering
- Streaming responses
- Rate limiting strategies
- Cost management

**Prompt Engineering:**
```python
def generate_move_explanation(move, position, evaluation_change, skill_level):
    prompt = f"""
    You are a friendly chess tutor explaining to a {skill_level} player.

    Position: {position.fen()}
    Move made: {move}
    Evaluation changed by: {evaluation_change} pawns

    Explain in 2-3 simple sentences:
    1. What the move accomplished
    2. Why it was good/bad
    3. What to remember for future

    Be encouraging and constructive.
    """

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        stream=True  # For token-by-token
    )

    return response
```

**Streaming Implementation:**
```typescript
// Frontend receives tokens one by one
socket.on('ai_hint_token', (data) => {
  if (data.complete) {
    setFullHint(data.fullMessage);
  } else {
    setCurrentHint(prev => prev + data.token);
  }
});
```

**Time Breakdown:**
- OpenAI setup: 2 hours
- Prompt engineering: 3 hours
- Streaming implementation: 3 hours
- UI components: 3 hours
- Rate limiting: 2 hours
- Testing: 2 hours

---

## Phase 5: Polish & Deploy (Weeks 11-12)

### Week 11: DevOps & Deployment

**Focus:** CI/CD, production deployment

**Tasks:**
- [ ] Create Dockerfiles (frontend + backend)
- [ ] Set up GitHub Actions workflows:
  - [ ] Test on every PR
  - [ ] Deploy to staging (develop branch)
  - [ ] Deploy to production (main branch)
- [ ] Configure environment variables
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Railway
- [ ] Set up production database
- [ ] Configure domain and SSL
- [ ] Set up Sentry (error tracking)
- [ ] Test production deployment

**Deliverables:**
- App deployed and accessible via URL
- CI/CD pipeline working
- Automatic deployments on merge
- Error tracking active

**Learning Goals:**
- Docker containerization
- GitHub Actions (CI/CD)
- Cloud deployment platforms
- Environment management
- Production configuration

**GitHub Actions Workflow:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          cd frontend && npm test
          cd backend && pytest

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy frontend
        run: vercel --prod
      - name: Deploy backend
        run: railway up
```

**Time Breakdown:**
- Docker setup: 3 hours
- GitHub Actions: 3 hours
- Deployment (frontend): 2 hours
- Deployment (backend): 2 hours
- Domain & SSL: 1 hour
- Testing: 2 hours
- Documentation: 2 hours

---

### Week 12: Polish, Testing & Documentation

**Focus:** User experience, final touches

**Tasks:**
- [ ] UI/UX polish:
  - [ ] Improve animations
  - [ ] Add loading states
  - [ ] Better error messages
  - [ ] Responsive design (mobile-friendly)
- [ ] Performance optimization:
  - [ ] Code splitting
  - [ ] Lazy loading
  - [ ] Image optimization
- [ ] Accessibility:
  - [ ] Keyboard navigation
  - [ ] Screen reader support
  - [ ] ARIA labels
- [ ] Write README.md
- [ ] Create demo video/GIF
- [ ] Comprehensive testing (E2E with Cypress)
- [ ] Fix bugs from user testing
- [ ] Prepare for showcasing

**Deliverables:**
- Polished, professional-looking app
- Fast and responsive
- Accessible to all users
- Well-documented for portfolio
- Demo video ready

**Learning Goals:**
- UI/UX best practices
- Performance optimization
- Accessibility standards
- Technical writing
- Product presentation

**README Template:**
```markdown
# Chess Tutor

AI-powered chess learning platform for complete beginners.

## Features
- Interactive tutorials
- Real-time AI hints
- Post-game analysis
- Progress tracking

## Tech Stack
- Frontend: React, TypeScript, Zustand
- Backend: FastAPI, PostgreSQL
- AI: OpenAI GPT-4, Stockfish

## Demo
[Link to deployed app]
[Link to demo video]

## What I Learned
[Your learnings here]

## Running Locally
[Setup instructions]
```

**Time Breakdown:**
- UI polish: 4 hours
- Performance: 2 hours
- Accessibility: 2 hours
- Testing: 3 hours
- Documentation: 2 hours
- Demo video: 2 hours

**Milestone:** 🎉🎉🎉 PROJECT COMPLETE! Portfolio-ready full-stack AI application!

---

## Weekly Routine

### Daily (30-60 min minimum)
- [ ] Code for at least 30 minutes
- [ ] Commit progress to GitHub
- [ ] Update progress doc

### Weekly (2-3 hours)
- [ ] Review week's accomplishments
- [ ] Update learning journal
- [ ] Plan next week's tasks
- [ ] Seek feedback (partner, online community)

### Bi-weekly (1 hour)
- [ ] Review architecture decisions
- [ ] Refactor code if needed
- [ ] Update documentation

---

## Flexibility & Adjustments

**If ahead of schedule:**
- Add extra features (multiplayer, more phases, achievements)
- Improve UI/UX
- Add advanced DevOps (Kubernetes, Terraform)

**If behind schedule:**
- Reduce scope (skip en passant, defer Phase 2 features)
- Focus on MVP
- Document what you'd add next

**If stuck:**
- Ask for help (Discord, Reddit, Stack Overflow)
- Watch tutorials on specific topic
- Simplify the problem
- Take a break, come back fresh

---

## Success Metrics

By the end of 12 weeks, you should be able to:

**Technical Skills:**
- ✅ Build a React app with TypeScript
- ✅ Design and implement a RESTful/GraphQL API
- ✅ Work with PostgreSQL databases
- ✅ Integrate third-party APIs (OpenAI, Stockfish)
- ✅ Set up CI/CD pipelines
- ✅ Deploy full-stack applications
- ✅ Write comprehensive tests
- ✅ Use Docker for containerization

**Portfolio:**
- ✅ Live, working application
- ✅ Well-documented code
- ✅ GitHub with good commit history
- ✅ Demo video showcasing features
- ✅ Technical blog post (optional but recommended)

**Interview Readiness:**
- ✅ Can explain every technical decision
- ✅ Can walk through system architecture
- ✅ Can discuss tradeoffs and alternatives
- ✅ Can demonstrate problem-solving skills
- ✅ Have war stories (challenges overcome)

---

## Resources

### Learning Resources
- **React:** Official docs, React.dev
- **TypeScript:** TypeScript Handbook
- **FastAPI:** Official tutorial
- **PostgreSQL:** PostgreSQL Tutorial
- **Testing:** Testing JavaScript (Kent C. Dodds)
- **System Design:** System Design Primer (GitHub)

### Communities
- **Discord:** Reactiflux, Python Discord
- **Reddit:** r/learnprogramming, r/webdev
- **Stack Overflow:** For specific questions
- **Dev.to:** Share progress, read articles

### Tools
- **VS Code:** Primary editor
- **Postman:** API testing
- **TablePlus:** Database GUI
- **Figma:** UI mockups (optional)
- **Excalidraw:** Architecture diagrams
