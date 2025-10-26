# API Design

> GraphQL schemas, REST endpoints, WebSocket events, and API contracts
> Last updated: October 26, 2025

---

## Table of Contents
1. [API Overview](#api-overview)
2. [GraphQL Schema](#graphql-schema)
3. [REST Endpoints](#rest-endpoints)
4. [WebSocket Events](#websocket-events)
5. [Request/Response Examples](#requestresponse-examples)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Authentication Flow](#authentication-flow)

---

## API Overview

### Communication Protocols

**GraphQL** (Primary for queries/mutations)
- Base URL: `https://api.chess-tutor.com/graphql`
- Used for: User data, game history, tutorial progress, settings

**WebSocket** (Real-time gameplay)
- Base URL: `wss://api.chess-tutor.com/ws`
- Used for: Live game moves, real-time hints, opponent responses

**REST** (Fallback/Simple operations)
- Base URL: `https://api.chess-tutor.com/api/v1`
- Used for: Health checks, file uploads, simple CRUD when GraphQL is overkill

---

## GraphQL Schema

### Complete Schema Definition
```graphql
# ============================================
# SCALARS
# ============================================

scalar DateTime
scalar JSON
scalar UUID

# ============================================
# ENUMS
# ============================================

enum Color {
  WHITE
  BLACK
}

enum GameResult {
  WIN
  LOSS
  DRAW
  ABANDONED
  IN_PROGRESS
}

enum ResultReason {
  CHECKMATE
  STALEMATE
  RESIGNATION
  TIME
  AGREEMENT
}

enum TutorialStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
}

enum ImprovementTrend {
  IMPROVING
  STABLE
  WORSENING
}

enum MistakeType {
  HANGING_PIECE
  MISSED_TACTIC
  WEAK_OPENING
  KING_SAFETY
  ENDGAME_BLUNDER
  TIME_PRESSURE
  OVEREXTENSION
  MATERIAL_LOSS
  POSITIONAL_WEAKNESS
}

enum Theme {
  LIGHT
  DARK
  AUTO
}

enum AnimationSpeed {
  SLOW
  NORMAL
  FAST
  INSTANT
}

# ============================================
# TYPES
# ============================================

type User {
  id: UUID!
  email: String!
  firstName: String!
  lastName: String!
  fullName: String! # Computed field
  rating: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
  lastLogin: DateTime
  isActive: Boolean!
  emailVerified: Boolean!

  # Relations
  games(
    limit: Int = 10
    offset: Int = 0
    result: GameResult
  ): [Game!]!

  tutorialProgress(phase: String): [TutorialProgress!]!
  mistakePatterns(limit: Int = 10): [MistakePattern!]!
  achievements: [Achievement!]!
  settings: UserSettings!

  # Stats (computed)
  stats: UserStats!
}

type UserStats {
  totalGames: Int!
  wins: Int!
  losses: Int!
  draws: Int!
  winRate: Float!
  currentPhase: String!
  completedModules: Int!
  averageAccuracy: Float!
  mostCommonMistake: MistakeType
  improvementScore: Float! # 0-100, based on trends
}

type Game {
  id: UUID!
  userId: UUID!
  user: User!
  opponentType: String!
  opponentStrength: Int
  userColor: Color!
  moves: [String!]!
  startingFen: String!
  finalFen: String
  result: GameResult!
  resultReason: ResultReason
  startedAt: DateTime!
  endedAt: DateTime
  totalMoves: Int!
  userTimeSpent: Int
  averageMoveTime: Float
  openingName: String
  userRatingBefore: Int
  userRatingAfter: Int
  ratingChange: Int
  analyzed: Boolean!
  analysisData: GameAnalysis
  phase: String!
  notes: String
}

type GameAnalysis {
  mistakes: [Mistake!]!
  accuracy: Float!
  brilliantMoves: Int!
  goodMoves: Int!
  inaccuracies: Int!
  mistakesCount: Int!
  blunders: Int!
}

type Mistake {
  moveNumber: Int!
  move: String!
  evaluationBefore: Float!
  evaluationAfter: Float!
  evaluationLoss: Float!
  bestMove: String!
  bestMoveEvaluation: Float!
  explanation: String!
  category: MistakeType!
  severity: String!
}

type TutorialProgress {
  id: UUID!
  userId: UUID!
  phase: String!
  moduleId: String!
  lessonId: String
  status: TutorialStatus!
  completedScreens: [String!]!
  totalScreens: Int!
  attempts: Int!
  timeSpent: Int!
  successRate: Float!
  lastScreenId: String
  startedAt: DateTime
  completedAt: DateTime
  updatedAt: DateTime!
}

type MistakePattern {
  id: UUID!
  userId: UUID!
  mistakeType: MistakeType!
  pieceType: String
  frequency: Int!
  totalOccurrences: Int!
  firstOccurred: DateTime!
  lastOccurred: DateTime!
  severityAvg: Float!
  gamesAffected: Int!
  improvementTrend: ImprovementTrend!
  lastRecommendation: String
}

type PracticeSession {
  id: UUID!
  userId: UUID!
  sessionType: String!
  focusArea: MistakeType
  puzzlesAttempted: Int!
  puzzlesSolved: Int!
  accuracy: Float!
  averageTime: Float!
  difficultyLevel: Int!
  startedAt: DateTime!
  endedAt: DateTime
  totalDuration: Int!
}

type Achievement {
  id: UUID!
  userId: UUID!
  achievementId: String!
  achievedAt: DateTime!
  gameId: UUID

  # Metadata (from definition)
  name: String!
  description: String!
  icon: String!
  rarity: String!
}

type UserSettings {
  userId: UUID!
  theme: Theme!
  boardStyle: String!
  pieceStyle: String!
  showLegalMoves: Boolean!
  showThreats: Boolean!
  enableHints: Boolean!
  hintDelay: Int!
  moveAnimationSpeed: AnimationSpeed!
  soundEnabled: Boolean!
  notationFormat: String!
  language: String!
  emailNotifications: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
}

# ============================================
# INPUTS
# ============================================

input RegisterInput {
  email: String!
  password: String!
  firstName: String!
  lastName: String!
}

input LoginInput {
  email: String!
  password: String!
}

input UpdateUserInput {
  firstName: String
  lastName: String
  email: String
}

input CreateGameInput {
  opponentType: String!
  opponentStrength: Int
  userColor: Color!
  phase: String
}

input UpdateTutorialProgressInput {
  phase: String!
  moduleId: String!
  lessonId: String
  screenId: String!
  success: Boolean!
  timeSpent: Int!
}

input UpdateSettingsInput {
  theme: Theme
  boardStyle: String
  pieceStyle: String
  showLegalMoves: Boolean
  showThreats: Boolean
  enableHints: Boolean
  hintDelay: Int
  moveAnimationSpeed: AnimationSpeed
  soundEnabled: Boolean
  notationFormat: String
  language: String
  emailNotifications: Boolean
}

# ============================================
# RESPONSES
# ============================================

type AuthResponse {
  token: String!
  user: User!
  expiresIn: Int!
}

type GameCreatedResponse {
  game: Game!
  message: String!
}

type ProgressUpdateResponse {
  progress: TutorialProgress!
  moduleCompleted: Boolean!
  phaseCompleted: Boolean!
  newAchievements: [Achievement!]!
}

# ============================================
# QUERIES
# ============================================

type Query {
  # User queries
  me: User!
  user(id: UUID!): User

  # Game queries
  game(id: UUID!): Game
  myGames(
    limit: Int = 10
    offset: Int = 0
    result: GameResult
    analyzed: Boolean
  ): [Game!]!

  recentGames(limit: Int = 5): [Game!]!

  # Tutorial queries
  myProgress(phase: String): [TutorialProgress!]!
  lessonProgress(phase: String!, moduleId: String!, lessonId: String!): TutorialProgress

  # Pattern queries
  myMistakePatterns(limit: Int = 10): [MistakePattern!]!
  topMistakes(limit: Int = 5): [MistakePattern!]!

  # Achievement queries
  myAchievements: [Achievement!]!
  availableAchievements: [Achievement!]! # Achievements not yet earned

  # Settings
  mySettings: UserSettings!

  # Stats
  myStats: UserStats!
}

# ============================================
# MUTATIONS
# ============================================

type Mutation {
  # Auth mutations
  register(input: RegisterInput!): AuthResponse!
  login(input: LoginInput!): AuthResponse!
  logout: Boolean!
  refreshToken: AuthResponse!

  # User mutations
  updateProfile(input: UpdateUserInput!): User!
  deleteAccount: Boolean!

  # Game mutations
  createGame(input: CreateGameInput!): GameCreatedResponse!
  resignGame(gameId: UUID!): Game!
  requestGameAnalysis(gameId: UUID!): Game!
  addGameNotes(gameId: UUID!, notes: String!): Game!

  # Tutorial mutations
  updateTutorialProgress(input: UpdateTutorialProgressInput!): ProgressUpdateResponse!
  resetTutorialProgress(phase: String!, moduleId: String!): Boolean!

  # Settings mutations
  updateSettings(input: UpdateSettingsInput!): UserSettings!

  # Practice mutations
  startPracticeSession(sessionType: String!, focusArea: MistakeType): PracticeSession!
  endPracticeSession(sessionId: UUID!, puzzlesSolved: Int!, accuracy: Float!): PracticeSession!
}

# ============================================
# SUBSCRIPTIONS (for real-time updates)
# ============================================

type Subscription {
  # Game subscriptions (via WebSocket in practice)
  gameUpdated(gameId: UUID!): Game!
  opponentMoved(gameId: UUID!): String! # Returns move in UCI format

  # Achievement notifications
  achievementEarned: Achievement!
}
```

---

## REST Endpoints

### Authentication

**POST** `/api/v1/auth/register`
```json
// Request
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}

// Response (201 Created)
{
  "token": "eyJ...",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "rating": 0,
    "createdAt": "2025-10-26T..."
  },
  "expiresIn": 604800
}
```

**POST** `/api/v1/auth/login`
```json
// Request
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

// Response (200 OK)
{
  "token": "eyJ...",
  "user": { ... },
  "expiresIn": 604800
}
```

**POST** `/api/v1/auth/logout`
```json
// Headers: Authorization: Bearer <token>
// Response (200 OK)
{
  "message": "Logged out successfully"
}
```

**POST** `/api/v1/auth/refresh`
```json
// Headers: Authorization: Bearer <refresh_token>
// Response (200 OK)
{
  "token": "new_token_here",
  "expiresIn": 604800
}
```

---

### Health Check

**GET** `/api/v1/health`
```json
// Response (200 OK)
{
  "status": "healthy",
  "timestamp": "2025-10-26T14:30:00Z",
  "version": "1.0.0",
  "services": {
    "database": "healthy",
    "redis": "healthy",
    "stockfish": "healthy"
  }
}
```

---

## WebSocket Events

### Connection
```typescript
// Client connects
const socket = io('wss://api.chess-tutor.com/ws', {
  auth: {
    token: 'jwt_token_here'
  }
});

// Server responds
socket.on('connected', (data) => {
  console.log(data.message); // "Connected successfully"
  console.log(data.userId);
});
```

---

### Game Events

**Client → Server: `join_game`**
```json
{
  "event": "join_game",
  "data": {
    "gameId": "game-uuid"
  }
}
```

**Server → Client: `game_joined`**
```json
{
  "event": "game_joined",
  "data": {
    "gameId": "game-uuid",
    "currentState": {
      "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      "turn": "white",
      "moves": []
    }
  }
}
```

---

**Client → Server: `make_move`**
```json
{
  "event": "make_move",
  "data": {
    "gameId": "game-uuid",
    "move": "e2e4",
    "timeSpent": 12
  }
}
```

**Server → Client: `move_validated`**
```json
{
  "event": "move_validated",
  "data": {
    "valid": true,
    "move": "e2e4",
    "newFen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
    "isCheck": false,
    "isCheckmate": false,
    "hint": "Good! You controlled the center."
  }
}
```

**Server → Client: `opponent_moved`**
```json
{
  "event": "opponent_moved",
  "data": {
    "move": "e7e5",
    "newFen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2",
    "botThinking": false
  }
}
```

---

**Server → Client: `game_ended`**
```json
{
  "event": "game_ended",
  "data": {
    "result": "win",
    "reason": "checkmate",
    "ratingChange": +15,
    "newRating": 165,
    "message": "Congratulations! You won by checkmate!"
  }
}
```

---

**Server → Client: `ai_hint`** (streamed)
```json
{
  "event": "ai_hint",
  "data": {
    "token": "Your", // First token
    "complete": false
  }
}
// ... more tokens
{
  "event": "ai_hint",
  "data": {
    "token": " position is strong.",
    "complete": true,
    "fullMessage": "Your position is strong. Continue developing pieces."
  }
}
```

---

### Error Events

**Server → Client: `error`**
```json
{
  "event": "error",
  "data": {
    "code": "INVALID_MOVE",
    "message": "That move is not legal in this position",
    "details": {
      "attemptedMove": "e2e5"
    }
  }
}
```

---

## Request/Response Examples

### GraphQL Query Examples

**Get Current User Profile**
```graphql
query GetMyProfile {
  me {
    id
    fullName
    email
    rating
    stats {
      totalGames
      winRate
      currentPhase
      mostCommonMistake
    }
    mistakePatterns(limit: 3) {
      mistakeType
      frequency
      improvementTrend
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "me": {
      "id": "user-uuid",
      "fullName": "John Doe",
      "email": "john@example.com",
      "rating": 150,
      "stats": {
        "totalGames": 15,
        "winRate": 60.0,
        "currentPhase": "Phase 0",
        "mostCommonMistake": "HANGING_PIECE"
      },
      "mistakePatterns": [
        {
          "mistakeType": "HANGING_PIECE",
          "frequency": 12,
          "improvementTrend": "IMPROVING"
        },
        {
          "mistakeType": "MISSED_TACTIC",
          "frequency": 5,
          "improvementTrend": "STABLE"
        }
      ]
    }
  }
}
```

---

**Get Game History**
```graphql
query GetMyGames($limit: Int!, $result: GameResult) {
  myGames(limit: $limit, result: $result) {
    id
    result
    resultReason
    startedAt
    totalMoves
    userColor
    ratingChange
    analysisData {
      accuracy
      mistakesCount
      blunders
    }
  }
}
```

**Variables:**
```json
{
  "limit": 10,
  "result": "WIN"
}
```

---

**Update Tutorial Progress**
```graphql
mutation UpdateProgress($input: UpdateTutorialProgressInput!) {
  updateTutorialProgress(input: $input) {
    progress {
      status
      successRate
      completedScreens
    }
    moduleCompleted
    phaseCompleted
    newAchievements {
      achievementId
      name
      icon
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "phase": "Phase 0",
    "moduleId": "piece-movement",
    "lessonId": "the-rook",
    "screenId": "rook-practice-3",
    "success": true,
    "timeSpent": 45
  }
}
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "errors": [
    {
      "message": "User not found",
      "code": "USER_NOT_FOUND",
      "path": ["user"],
      "extensions": {
        "userId": "invalid-uuid",
        "statusCode": 404
      }
    }
  ]
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHENTICATED` | 401 | No valid auth token provided |
| `UNAUTHORIZED` | 403 | User doesn't have permission |
| `USER_NOT_FOUND` | 404 | User doesn't exist |
| `GAME_NOT_FOUND` | 404 | Game doesn't exist |
| `INVALID_MOVE` | 400 | Move is not legal |
| `INVALID_INPUT` | 400 | Input validation failed |
| `EMAIL_TAKEN` | 409 | Email already registered |
| `WEAK_PASSWORD` | 400 | Password doesn't meet requirements |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limiting

### Limits by Endpoint Type

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| Auth (login/register) | 5 requests | 15 minutes |
| GraphQL queries | 100 requests | 1 minute |
| GraphQL mutations | 50 requests | 1 minute |
| WebSocket messages | 200 messages | 1 minute |
| AI hint requests | 20 requests | 5 minutes |
| Game analysis | 10 requests | 1 hour |

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1635264000
```

### Rate Limit Exceeded Response
```json
{
  "errors": [
    {
      "message": "Rate limit exceeded. Try again in 45 seconds.",
      "code": "RATE_LIMIT_EXCEEDED",
      "extensions": {
        "retryAfter": 45,
        "limit": 100,
        "window": "1 minute"
      }
    }
  ]
}
```

---

## Authentication Flow

### JWT Token Structure
```json
// Decoded JWT payload
{
  "userId": "user-uuid",
  "email": "john@example.com",
  "iat": 1635264000,  // Issued at
  "exp": 1635868800   // Expires (7 days later)
}
```

### Including Token in Requests

**GraphQL (HTTP Header):**
```
Authorization: Bearer eyJ...
```

**WebSocket (Connection Auth):**
```typescript
const socket = io(url, {
  auth: { token: 'eyJ...' }
});
```

### Token Refresh Flow
```
1. User logs in → receives access token (7 days) + refresh token (30 days)
2. Access token expires → client receives 401 error
3. Client sends refresh token to /api/v1/auth/refresh
4. Server validates refresh token → issues new access token
5. Client retries failed request with new token
```

---

## API Versioning

- Current version: `v1`
- Version specified in URL: `/api/v1/...`
- Breaking changes will increment major version: `v2`
- GraphQL schema changes are backward-compatible within same version
- Deprecation warnings provided 3 months before removal

---

## CORS Configuration
```python
# Allowed origins (backend config)
CORS_ORIGINS = [
    "http://localhost:3000",  # Local development
    "https://chess-tutor.com",  # Production frontend
    "https://www.chess-tutor.com"
]

# Allowed methods
CORS_METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]

# Allowed headers
CORS_HEADERS = ["Authorization", "Content-Type"]
```

---

## Testing the API

### Using GraphQL Playground

Development: `http://localhost:8000/graphql`
Production: `https://api.chess-tutor.com/graphql`

### Using cURL (REST)
```bash
# Register
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'

# GraphQL query
curl -X POST http://localhost:8000/graphql \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { me { fullName rating } }"
  }'
```

### Using WebSocket Client (JavaScript)
```typescript
import io from 'socket.io-client';

const socket = io('ws://localhost:8000/ws', {
  auth: { token: 'your_jwt_token' }
});

socket.on('connected', (data) => {
  console.log('Connected:', data);
});

socket.emit('join_game', { gameId: 'game-uuid' });

socket.on('move_validated', (data) => {
  console.log('Move validated:', data);
});
```

---

## Notes

**GraphQL vs REST Decision:**
- Use GraphQL for complex queries with relationships
- Use REST for simple operations, health checks, file uploads
- Both share same authentication mechanism (JWT)

**Real-time Communication:**
- WebSocket preferred for game moves (low latency critical)
- GraphQL subscriptions alternative (less tested, more overhead)
- Fallback to polling if WebSocket unavailable (rare)

**API Documentation:**
- GraphQL: Self-documenting via introspection
- REST: OpenAPI/Swagger spec (generate from code)
- Examples maintained in Postman collection

**Security:**
- All endpoints require HTTPS in production
- Sensitive operations require recent authentication (re-auth if needed)
- API keys for external services stored in environment variables
