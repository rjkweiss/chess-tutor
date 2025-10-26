# Data Models

> Database schemas, TypeScript types, and relationships
> Last updated: October 26, 2025

---

## Table of Contents
1. [Database Schema (PostgreSQL)](#database-schema-postgresql)
2. [TypeScript Types (Frontend)](#typescript-types-frontend)
3. [Relationships & Constraints](#relationships--constraints)
4. [Data Flow Examples](#data-flow-examples)
5. [Migration Strategy](#migration-strategy)

---

## Database Schema (PostgreSQL)

### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    rating INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_rating ON users(rating);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Constraints
ALTER TABLE users ADD CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');
ALTER TABLE users ADD CONSTRAINT rating_range CHECK (rating >= 0 AND rating <= 3000);
```

**Field Descriptions:**
- `id`: Unique identifier (UUID for security)
- `email`: User's email (unique, used for login)
- `password_hash`: bcrypt hashed password (NEVER store plain text!)
- `first_name`: User's first name (for personalization)
- `last_name`: User's last name
- `rating`: Chess rating (0-3000, default 0 for beginners)
- `created_at`: Account creation timestamp
- `updated_at`: Last profile update timestamp
- `last_login`: Most recent login time
- `is_active`: Account status (for soft deletion)
- `email_verified`: Whether user verified their email

---

### games
```sql
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    opponent_type VARCHAR(20) NOT NULL, -- 'bot' or 'human' (future)
    opponent_strength INTEGER, -- Stockfish strength (1-20) if bot
    user_color VARCHAR(10) NOT NULL, -- 'white' or 'black'
    moves JSONB NOT NULL DEFAULT '[]', -- Array of moves in UCI format
    starting_fen TEXT DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    final_fen TEXT,
    result VARCHAR(20) NOT NULL, -- 'win', 'loss', 'draw', 'abandoned', 'in_progress'
    result_reason VARCHAR(50), -- 'checkmate', 'stalemate', 'resignation', 'time', 'agreement'
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE,
    total_moves INTEGER DEFAULT 0,
    user_time_spent INTEGER, -- Total time in seconds
    average_move_time DECIMAL(5,2), -- Average seconds per move
    opening_name VARCHAR(100), -- E.g., "Italian Game" (set after analysis)
    user_rating_before INTEGER,
    user_rating_after INTEGER,
    rating_change INTEGER, -- +/- rating points
    analyzed BOOLEAN DEFAULT FALSE, -- Has game been analyzed by Stockfish?
    analysis_data JSONB, -- Store analysis results (mistakes, best moves, etc.)
    phase VARCHAR(20) DEFAULT 'Phase 0', -- Which learning phase user was in
    notes TEXT -- User's personal notes about the game
);

-- Indexes
CREATE INDEX idx_games_user_id ON games(user_id);
CREATE INDEX idx_games_result ON games(result);
CREATE INDEX idx_games_started_at ON games(started_at);
CREATE INDEX idx_games_analyzed ON games(analyzed);
CREATE INDEX idx_games_phase ON games(phase);

-- Partial index for active games (performance optimization)
CREATE INDEX idx_active_games ON games(user_id, started_at) WHERE result = 'in_progress';

-- Constraints
ALTER TABLE games ADD CONSTRAINT valid_opponent_type CHECK (opponent_type IN ('bot', 'human'));
ALTER TABLE games ADD CONSTRAINT valid_user_color CHECK (user_color IN ('white', 'black'));
ALTER TABLE games ADD CONSTRAINT valid_result CHECK (result IN ('win', 'loss', 'draw', 'abandoned', 'in_progress'));
ALTER TABLE games ADD CONSTRAINT opponent_strength_range CHECK (opponent_strength BETWEEN 1 AND 20);
```

**Field Descriptions:**
- `opponent_type`: 'bot' for now, 'human' for future multiplayer
- `opponent_strength`: Stockfish skill level (1=beginner, 20=super grandmaster)
- `moves`: Array of moves in UCI notation: `["e2e4", "e7e5", "Nf3", ...]`
- `starting_fen`: Board position at game start (usually standard, but could be custom)
- `final_fen`: Board position at game end
- `result`: Game outcome from user's perspective
- `result_reason`: How the game ended
- `analysis_data`: JSON containing Stockfish analysis results
```json
  {
    "mistakes": [
      {
        "move_number": 7,
        "move": "e5",
        "evaluation_before": 1.5,
        "evaluation_after": -0.5,
        "evaluation_loss": 2.0,
        "best_move": "Nf6",
        "explanation": "AI-generated explanation..."
      }
    ],
    "accuracy": 85.5,
    "brilliant_moves": 1,
    "good_moves": 12,
    "inaccuracies": 3,
    "mistakes": 2,
    "blunders": 1
  }
```

---

### tutorial_progress
```sql
CREATE TABLE tutorial_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phase VARCHAR(20) NOT NULL, -- 'Phase 0', 'Phase 1', etc.
    module_id VARCHAR(50) NOT NULL, -- 'board-setup', 'piece-movement', etc.
    lesson_id VARCHAR(50), -- 'the-rook', 'the-bishop', etc. (null if module level)
    status VARCHAR(20) DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
    completed_screens JSONB DEFAULT '[]', -- Array of completed screen IDs
    total_screens INTEGER, -- Total screens in this lesson/module
    attempts INTEGER DEFAULT 0, -- Number of times user attempted this lesson
    time_spent INTEGER DEFAULT 0, -- Total time in seconds
    success_rate DECIMAL(5,2), -- % of practice/quiz questions correct
    last_screen_id VARCHAR(50), -- Last screen user was on (for resuming)
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Unique constraint: one progress record per user per lesson
    UNIQUE(user_id, phase, module_id, lesson_id)
);

-- Indexes
CREATE INDEX idx_progress_user_id ON tutorial_progress(user_id);
CREATE INDEX idx_progress_status ON tutorial_progress(status);
CREATE INDEX idx_progress_phase ON tutorial_progress(phase);

-- Constraints
ALTER TABLE tutorial_progress ADD CONSTRAINT valid_status CHECK (status IN ('not_started', 'in_progress', 'completed'));
ALTER TABLE tutorial_progress ADD CONSTRAINT valid_success_rate CHECK (success_rate >= 0 AND success_rate <= 100);
```

**Field Descriptions:**
- `phase`: Which learning phase (Phase 0, Phase 1, Phase 2)
- `module_id`: Which module within the phase
- `lesson_id`: Specific lesson (null if tracking module-level progress)
- `completed_screens`: Array of screen IDs user has completed
```json
  ["rook-intro", "rook-movement-demo", "rook-practice-1", "rook-practice-2"]
```
- `success_rate`: Percentage of correct answers in practice/quizzes
- `last_screen_id`: For resuming where they left off

---

### mistake_patterns
```sql
CREATE TABLE mistake_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mistake_type VARCHAR(50) NOT NULL, -- 'hanging_piece', 'missed_tactic', 'weak_opening', etc.
    piece_type VARCHAR(20), -- Which piece was involved (if applicable)
    frequency INTEGER DEFAULT 1, -- How many times this mistake occurred
    total_occurrences INTEGER DEFAULT 1, -- Total times across all games
    first_occurred TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_occurred TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    severity_avg DECIMAL(5,2), -- Average evaluation loss (in pawns)
    games_affected INTEGER DEFAULT 1, -- How many games had this mistake
    improvement_trend VARCHAR(20) DEFAULT 'stable', -- 'improving', 'stable', 'worsening'
    last_recommendation TEXT, -- Last AI recommendation for fixing this

    -- Unique constraint: one record per user per mistake type per piece
    UNIQUE(user_id, mistake_type, piece_type)
);

-- Indexes
CREATE INDEX idx_patterns_user_id ON mistake_patterns(user_id);
CREATE INDEX idx_patterns_frequency ON mistake_patterns(frequency DESC);
CREATE INDEX idx_patterns_last_occurred ON mistake_patterns(last_occurred);

-- Constraints
ALTER TABLE mistake_patterns ADD CONSTRAINT valid_improvement_trend CHECK (improvement_trend IN ('improving', 'stable', 'worsening'));
```

**Field Descriptions:**
- `mistake_type`: Category of mistake
  - `hanging_piece`: Left piece undefended
  - `missed_tactic`: Didn't see a tactical opportunity
  - `weak_opening`: Poor opening choice
  - `king_safety`: Exposed king to danger
  - `endgame_blunder`: Mistake in endgame
  - `time_pressure`: Blunder due to time
- `piece_type`: 'pawn', 'knight', 'bishop', 'rook', 'queen', 'king' (null if not piece-specific)
- `improvement_trend`: Calculated based on frequency over time
  - If frequency decreasing → 'improving'
  - If stable → 'stable'
  - If increasing → 'worsening'

---

### practice_sessions (For focused practice)
```sql
CREATE TABLE practice_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_type VARCHAR(50) NOT NULL, -- 'tactical_puzzles', 'endgame_practice', 'opening_drill', etc.
    focus_area VARCHAR(50), -- What user is practicing (e.g., 'hanging_pieces', 'forks')
    puzzles_attempted INTEGER DEFAULT 0,
    puzzles_solved INTEGER DEFAULT 0,
    accuracy DECIMAL(5,2), -- % correct
    average_time DECIMAL(5,2), -- Average seconds per puzzle
    difficulty_level INTEGER, -- 1-10 scale
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE,
    total_duration INTEGER -- Total time in seconds
);

-- Indexes
CREATE INDEX idx_practice_user_id ON practice_sessions(user_id);
CREATE INDEX idx_practice_session_type ON practice_sessions(session_type);
CREATE INDEX idx_practice_started_at ON practice_sessions(started_at);
```

**Field Descriptions:**
- `session_type`: Type of practice
- `focus_area`: Specific mistake pattern being addressed
- `accuracy`: Success rate in this session
- Used to track focused improvement on specific weaknesses

---

### user_achievements (Gamification - Optional Phase 2)
```sql
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id VARCHAR(50) NOT NULL, -- 'first_win', 'checkmate_scholar', 'no_blunders', etc.
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    game_id UUID REFERENCES games(id), -- Game where achievement was earned (if applicable)

    UNIQUE(user_id, achievement_id)
);

-- Indexes
CREATE INDEX idx_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_achievements_achieved_at ON user_achievements(achieved_at);
```

---

### user_settings (User preferences)
```sql
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'light', -- 'light', 'dark', 'auto'
    board_style VARCHAR(50) DEFAULT 'classic', -- 'classic', 'modern', 'wood', etc.
    piece_style VARCHAR(50) DEFAULT 'standard', -- 'standard', 'minimalist', etc.
    show_legal_moves BOOLEAN DEFAULT TRUE,
    show_threats BOOLEAN DEFAULT FALSE,
    enable_hints BOOLEAN DEFAULT TRUE,
    hint_delay INTEGER DEFAULT 5, -- Seconds before hint appears
    move_animation_speed VARCHAR(20) DEFAULT 'normal', -- 'slow', 'normal', 'fast', 'instant'
    sound_enabled BOOLEAN DEFAULT TRUE,
    notation_format VARCHAR(20) DEFAULT 'algebraic', -- 'algebraic', 'coordinate', 'descriptive'
    language VARCHAR(10) DEFAULT 'en', -- For i18n (future)
    email_notifications BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## TypeScript Types (Frontend)

### User Types
```typescript
// frontend/src/types/user.types.ts

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string; // Computed: firstName + lastName
  rating: number;
  createdAt: string; // ISO timestamp
  updatedAt: string;
  lastLogin?: string;
  isActive: boolean;
  emailVerified: boolean;
}

export interface UserProfile extends User {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number; // Computed
  currentPhase: string; // 'Phase 0', 'Phase 1', etc.
  completedModules: number;
  achievements: Achievement[];
  commonMistakes: MistakePattern[];
}

export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark' | 'auto';
  boardStyle: string;
  pieceStyle: string;
  showLegalMoves: boolean;
  showThreats: boolean;
  enableHints: boolean;
  hintDelay: number;
  moveAnimationSpeed: 'slow' | 'normal' | 'fast' | 'instant';
  soundEnabled: boolean;
  notationFormat: 'algebraic' | 'coordinate' | 'descriptive';
  language: string;
  emailNotifications: boolean;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number; // Seconds until token expires
}
```

---

### Game Types
```typescript
// frontend/src/types/game.types.ts

export type Color = 'white' | 'black';
export type GameResult = 'win' | 'loss' | 'draw' | 'abandoned' | 'in_progress';
export type ResultReason = 'checkmate' | 'stalemate' | 'resignation' | 'time' | 'agreement' | null;

export interface Game {
  id: string;
  userId: string;
  opponentType: 'bot' | 'human';
  opponentStrength?: number; // 1-20 for bot
  userColor: Color;
  moves: string[]; // UCI format: ['e2e4', 'e7e5', ...]
  startingFen: string;
  finalFen?: string;
  result: GameResult;
  resultReason?: ResultReason;
  startedAt: string;
  endedAt?: string;
  totalMoves: number;
  userTimeSpent?: number; // seconds
  averageMoveTime?: number; // seconds
  openingName?: string;
  userRatingBefore?: number;
  userRatingAfter?: number;
  ratingChange?: number;
  analyzed: boolean;
  analysisData?: GameAnalysis;
  phase: string;
  notes?: string;
}

export interface GameAnalysis {
  mistakes: Mistake[];
  accuracy: number; // 0-100
  brilliantMoves: number;
  goodMoves: number;
  inaccuracies: number;
  mistakesCount: number;
  blunders: number;
}

export interface Mistake {
  moveNumber: number;
  move: string; // UCI format
  evaluationBefore: number; // In pawns (+/-)
  evaluationAfter: number;
  evaluationLoss: number; // Positive number
  bestMove: string; // UCI format
  bestMoveEvaluation: number;
  explanation: string; // AI-generated explanation
  category: MistakeType;
  severity: 'inaccuracy' | 'mistake' | 'blunder';
}

export type MistakeType =
  | 'hanging_piece'
  | 'missed_tactic'
  | 'weak_opening'
  | 'king_safety'
  | 'endgame_blunder'
  | 'time_pressure'
  | 'overextension'
  | 'material_loss'
  | 'positional_weakness';

// For creating a new game
export interface CreateGameRequest {
  opponentType: 'bot';
  opponentStrength: number; // 1-20
  userColor: Color;
  phase?: string;
}

// For submitting a move
export interface MoveRequest {
  gameId: string;
  move: string; // UCI format
  timeSpent?: number; // seconds for this move
}

export interface MoveResponse {
  valid: boolean;
  gameState: GameState;
  opponentMove?: string; // Bot's response move
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  aiHint?: string; // Real-time hint if enabled
}
```

---

### Chess Engine Types
```typescript
// frontend/src/types/chess.types.ts

export type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
export type Square = string; // e.g., 'e4', 'a1', etc.

export interface Piece {
  type: PieceType;
  color: Color;
  position: Square;
  hasMoved: boolean;
  value: number; // Material value (pawn=1, knight=3, etc.)
}

export interface Move {
  from: Square;
  to: Square;
  piece: Piece;
  captured?: Piece;
  promotion?: PieceType; // If pawn promotes
  castling?: 'kingside' | 'queenside';
  enPassant?: boolean;
  isCheck: boolean;
  isCheckmate: boolean;
  notation: string; // Algebraic notation: 'Nf3', 'e4', etc.
  uci: string; // UCI format: 'e2e4', 'g1f3', etc.
}

export interface GameState {
  board: Map<Square, Piece>;
  turn: Color;
  moveHistory: Move[];
  capturedPieces: {
    white: Piece[];
    black: Piece[];
  };
  status: 'active' | 'check' | 'checkmate' | 'stalemate' | 'draw';
  castlingRights: {
    whiteKingside: boolean;
    whiteQueenside: boolean;
    blackKingside: boolean;
    blackQueenside: boolean;
  };
  enPassantTarget?: Square;
  halfMoveClock: number; // For 50-move rule
  fullMoveNumber: number;
  fen: string; // Current position in FEN notation
}

// For board rendering
export interface BoardPosition {
  [square: string]: Piece | null;
}

// For legal move highlighting
export interface LegalMovesResult {
  piece: Piece;
  legalMoves: Square[];
  attacks: Square[]; // Squares this piece attacks
  defends: Square[]; // Squares this piece defends
}
```

---

### Tutorial Types
```typescript
// frontend/src/types/tutorial.types.ts

export interface TutorialProgress {
  id: string;
  userId: string;
  phase: string;
  moduleId: string;
  lessonId?: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completedScreens: string[];
  totalScreens: number;
  attempts: number;
  timeSpent: number; // seconds
  successRate: number; // 0-100
  lastScreenId?: string;
  startedAt?: string;
  completedAt?: string;
  updatedAt: string;
}

export interface TutorialModule {
  moduleId: string;
  phase: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  lessons: Lesson[];
  prerequisites?: string[]; // moduleIds that must be completed first
}

export interface Lesson {
  lessonId: string;
  title: string;
  description: string;
  learningObjective: string;
  screens: Screen[];
  successCriteria: SuccessCriterion[];
}

export type ScreenType =
  | 'narration'
  | 'interactive'
  | 'quiz'
  | 'drag-and-drop'
  | 'animated-demo'
  | 'practice'
  | 'puzzle-challenge'
  | 'emphasis-box'
  | 'concept-preview';

export interface Screen {
  screenId: string;
  type: ScreenType;
  content: string;
  boardState?: string; // FEN notation or null
  highlights?: Square[];
  interaction: InteractionConfig;
  validation?: ValidationRule;
  hints?: string[];
  visual?: VisualConfig;
}

export interface InteractionConfig {
  type: 'click-next' | 'click-square' | 'drag-piece' | 'multiple-choice' | 'select-all' | 'move-piece' | 'free-play';
  options?: string[]; // For multiple choice
  targetSquare?: Square; // For move-piece
  requiredMoves?: Move[]; // For puzzle-challenge
  timeLimit?: number; // seconds (optional)
}

export interface ValidationRule {
  correctAnswer: any;
  feedback: {
    correct: string;
    incorrect: string;
    hint?: string;
  };
  maxAttempts?: number;
}

export interface SuccessCriterion {
  description: string;
  metric: string;
  threshold: number;
}

export interface VisualConfig {
  pieces?: string[]; // Piece types to display
  emphasis?: string; // What to emphasize
  blocked?: Square[]; // Squares to mark as blocked
  available?: Square[]; // Squares to mark as available
  animation?: AnimationConfig;
}

export interface AnimationConfig {
  type: 'show-legal-moves' | 'move-piece' | 'capture' | 'highlight';
  piece?: Square;
  from?: Square;
  to?: Square;
  duration?: number; // milliseconds
}
```

---

### Mistake Pattern Types
```typescript
// frontend/src/types/pattern.types.ts

export interface MistakePattern {
  id: string;
  userId: string;
  mistakeType: MistakeType;
  pieceType?: PieceType;
  frequency: number;
  totalOccurrences: number;
  firstOccurred: string;
  lastOccurred: string;
  severityAvg: number; // Average eval loss in pawns
  gamesAffected: number;
  improvementTrend: 'improving' | 'stable' | 'worsening';
  lastRecommendation?: string;
}

export interface PracticeSession {
  id: string;
  userId: string;
  sessionType: 'tactical_puzzles' | 'endgame_practice' | 'opening_drill' | 'mistake_correction';
  focusArea?: MistakeType;
  puzzlesAttempted: number;
  puzzlesSolved: number;
  accuracy: number;
  averageTime: number;
  difficultyLevel: number;
  startedAt: string;
  endedAt?: string;
  totalDuration: number;
}
```

---

### Achievement Types
```typescript
// frontend/src/types/achievement.types.ts

export interface Achievement {
  id: string;
  userId: string;
  achievementId: string;
  achievedAt: string;
  gameId?: string;
}

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  requirement: string;
}

// Example achievements:
export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first_win',
    name: 'First Victory',
    description: 'Win your first game',
    icon: '🏆',
    rarity: 'common',
    requirement: 'Win 1 game'
  },
  {
    id: 'checkmate_scholar',
    name: 'Scholar\'s Mate',
    description: 'Checkmate opponent in 4 moves or less',
    icon: '🎓',
    rarity: 'uncommon',
    requirement: 'Win in ≤4 moves'
  },
  {
    id: 'no_blunders',
    name: 'Flawless Game',
    description: 'Complete a game with no blunders',
    icon: '💎',
    rarity: 'rare',
    requirement: '0 blunders in a game'
  },
  {
    id: 'phase_0_complete',
    name: 'Chess Beginner',
    description: 'Complete Phase 0 tutorials',
    icon: '📚',
    rarity: 'common',
    requirement: 'Complete Phase 0'
  }
];
```

---

## Relationships & Constraints

### Entity Relationship Diagram
```
┌──────────────┐
│    users     │
│──────────────│
│ id (PK)      │◄──┐
│ email        │   │
│ password_hash│   │
│ first_name   │   │
│ last_name    │   │
│ rating       │   │
└──────────────┘   │
                   │
        ┌──────────┼─────────────────────────────┐
        │          │                             │
        │          │                             │
┌───────▼──────┐   │  ┌─────────────────┐  ┌─────▼──────────────┐
│    games     │   │  │ tutorial_       │  │ mistake_patterns   │
│──────────────│   │  │ progress        │  │────────────────────│
│ id (PK)      │   │  │─────────────────│  │ id (PK)            │
│ user_id (FK) ├───┘  │ id (PK)         │  │ user_id (FK)       │
│ moves        │      │ user_id (FK)    ├──┤ mistake_type       │
│ result       │      │ phase           │  │ frequency          │
│ analysis_data│      │ module_id       │  │ improvement_trend  │
└──────────────┘      │ lesson_id       │  └────────────────────┘
                      │ status          │         |
                      │ success_rate    │         |
        │             └─────────────────┘         |
        │                     │                   |
        │                     │                   |
┌───────▼──────────┐  ┌───────▼────────────┐      |
│ practice_        │  │ user_achievements  │      |
│ sessions         │  │────────────────────│      |
│──────────────────│  │ id (PK)            │      |
│ id (PK)          │  │ user_id (FK)       │      |
│ user_id (FK)     │  │ achievement_id     │      |
│ session_type     │  │ achieved_at        │      |
│ accuracy         │  │ game_id (FK)       │      |
└──────────────────┘  └────────────────────┘      |
                                                  │
                                                  |
                                                  |
                                                  │
                    ┌─────────────────────────────┘
                    │
            ┌───────▼──────────┐
            │ user_settings    │
            │──────────────────│
            │ user_id (PK, FK) │
            │ theme            │
            │ board_style      │
            │ show_legal_moves │
            └──────────────────┘
```

### Key Relationships

**One-to-Many:**
- User → Games (one user has many games)
- User → Tutorial Progress (one user has many progress records)
- User → Mistake Patterns (one user has many patterns)
- User → Practice Sessions (one user has many sessions)
- User → Achievements (one user has many achievements)

**One-to-One:**
- User → User Settings (one user has one settings record)

**Referential Integrity:**
- All foreign keys use `ON DELETE CASCADE` (if user deleted, their data is deleted)
- Exception: Consider `ON DELETE SET NULL` for game_id in achievements if you want to keep achievement even if game is deleted

---

## Data Flow Examples

### Example 1: User Registration
```typescript
// Frontend sends:
const registerData: RegisterData = {
  email: "john@example.com",
  password: "SecurePass123!",
  firstName: "John",
  lastName: "Doe"
};

// Backend receives and processes:
// 1. Validate email format
// 2. Check if email already exists
// 3. Hash password with bcrypt
// 4. Create user record in database

// SQL executed:
INSERT INTO users (email, password_hash, first_name, last_name, rating)
VALUES ('john@example.com', '$2b$12$...', 'John', 'Doe', 0);

// Also create default settings:
INSERT INTO user_settings (user_id, theme, board_style, ...)
VALUES ('user-uuid', 'light', 'classic', ...);

// Backend returns:
const authResponse: AuthResponse = {
  token: "eyJ...",
  user: {
    id: "uuid",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    rating: 0,
    createdAt: "2025-10-26T...",
    // ...
  },
  expiresIn: 604800 // 7 days
};
```

---

### Example 2: Starting a Game
```typescript
// Frontend requests:
const createGameRequest: CreateGameRequest = {
  opponentType: 'bot',
  opponentStrength: 5, // Beginner bot
  userColor: 'white',
  phase: 'Phase 0'
};

// Backend creates game:
INSERT INTO games (
  user_id,
  opponent_type,
  opponent_strength,
  user_color,
  result,
  phase,
  user_rating_before
) VALUES (
  'user-uuid',
  'bot',
  5,
  'white',
  'in_progress',
  'Phase 0',
  150 -- User's current rating
);

// Returns game object:
const game: Game = {
  id: "game-uuid",
  userId: "user-uuid",
  opponentType: "bot",
  opponentStrength: 5,
  userColor: "white",
  moves: [],
  startingFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  result: "in_progress",
  startedAt: "2025-10-26T14:30:00Z",
  totalMoves: 0,
  analyzed: false,
  phase: "Phase 0"
};
```

---

### Example 3: Making a Move
```typescript
// Frontend sends move:
const moveRequest: MoveRequest = {
  gameId: "game-uuid",
  move: "e2e4", // UCI format
  timeSpent: 12 // seconds
};

// Backend:
// 1. Validate move is legal (use Stockfish or your engine)
// 2. Update game record:
UPDATE games
SET
  moves = moves || '["e2e4"]'::jsonb,
  total_moves = total_moves + 1,
  user_time_spent = user_time_spent + 12
WHERE id = 'game-uuid';

// 3. Generate bot's response move (using Stockfish)
// 4. Check for checkmate/stalemate
// 5. Return updated game state:

const moveResponse: MoveResponse = {
  valid: true,
  gameState: { /* updated board state */ },
  opponentMove: "e7e5", // Bot responds
  isCheck: false,
  isCheckmate: false,
  isStalemate: false,
  isDraw: false,
  aiHint: "Good! You controlled the center with your pawn."
};
```

---

### Example 4: Completing a Tutorial Lesson
```typescript
// User completes a screen:
// Frontend sends:
const updateProgress = {
  phase: "Phase 0",
  moduleId: "piece-movement",
  lessonId: "the-rook",
  screenId: "rook-practice-3",
  success: true,
  timeSpent: 45 // seconds on this screen
};

// Backend updates or inserts:
INSERT INTO tutorial_progress (
  user_id, phase, module_id, lesson_id,
  status, completed_screens, time_spent
)
VALUES (
  'user-uuid', 'Phase 0', 'piece-movement', 'the-rook',
  'in_progress', '["rook-intro", "rook-movement-demo", "rook-practice-1", "rook-practice-2", "rook-practice-3"]',
  180
)
ON CONFLICT (user_id, phase, module_id, lesson_id)
DO UPDATE SET
  completed_screens = tutorial_progress.completed_screens || '"rook-practice-3"'::jsonb,
  time_spent = tutorial_progress.time_spent + 45,
  status = CASE
    WHEN array_length(completed_screens, 1) + 1 >= total_screens THEN 'completed'
    ELSE 'in_progress'
  END,
  updated_at = CURRENT_TIMESTAMP;
```

---

## Migration Strategy

### Phase 1: Initial Tables (Week 5)
```sql
-- migrations/001_initial_schema.sql
CREATE TABLE users (...);
CREATE TABLE user_settings (...);
CREATE TABLE games (...);
CREATE TABLE tutorial_progress (...);
```

### Phase 2: Patterns & Practice (Week 7)
```sql
-- migrations/002_patterns_and_practice.sql
CREATE TABLE mistake_patterns (...);
CREATE TABLE practice_sessions (...);
```

### Phase 3: Gamification (Week 10 - Optional)
```sql
-- migrations/003_achievements.sql
CREATE TABLE user_achievements (...);
```

### Using Alembic (Python)
```bash
# Initialize Alembic
alembic init alembic

# Create migration
alembic revision --autogenerate -m "initial schema"

# Apply migration
alembic upgrade head

# Rollback
alembic downgrade -1
```

---

## Sample Queries

### Get User Profile with Stats
```sql
SELECT
  u.*,
  COUNT(DISTINCT g.id) as total_games,
  COUNT(DISTINCT g.id) FILTER (WHERE g.result = 'win') as wins,
  COUNT(DISTINCT g.id) FILTER (WHERE g.result = 'loss') as losses,
  COUNT(DISTINCT g.id) FILTER (WHERE g.result = 'draw') as draws,
  ROUND(
    COUNT(DISTINCT g.id) FILTER (WHERE g.result = 'win')::decimal /
    NULLIF(COUNT(DISTINCT g.id), 0) * 100,
    2
  ) as win_rate,
  COUNT(DISTINCT tp.id) FILTER (WHERE tp.status = 'completed') as completed_modules
FROM users u
LEFT JOIN games g ON g.user_id = u.id
LEFT JOIN tutorial_progress tp ON tp.user_id = u.id
WHERE u.id = $1
GROUP BY u.id;
```

### Get User's Worst Mistake Patterns
```sql
SELECT
  mistake_type,
  piece_type,
  frequency,
  severity_avg,
  improvement_trend,
  last_recommendation
FROM mistake_patterns
WHERE user_id = $1
ORDER BY frequency DESC, severity_avg DESC
LIMIT 5;
```

### Get Recent Games with Analysis
```sql
SELECT
  g.*,
  g.analysis_data->>'accuracy' as accuracy,
  jsonb_array_length(g.analysis_data->'mistakes') as total_mistakes
FROM games g
WHERE g.user_id = $1
  AND g.result != 'in_progress'
  AND g.analyzed = true
ORDER BY g.ended_at DESC
LIMIT 10;
```

---

## Notes

**Data Privacy:**
- Never expose password_hash in API responses
- Use UUIDs instead of sequential IDs (prevents enumeration attacks)
- Implement row-level security when using Postgres RLS

**Performance Considerations:**
- Index frequently queried columns (user_id, created_at, result)
- Use partial indexes for common filters (WHERE result = 'in_progress')
- Consider partitioning `games` table by date if it grows very large (millions of rows)

**Data Retention:**
- Consider archiving old games after 1 year
- Keep mistake_patterns forever (valuable for long-term learning)
- Tutorial progress: keep forever (users may return after breaks)

**Backup Strategy:**
- Daily automated backups of PostgreSQL
- Keep backups for 30 days
- Test restore procedure quarterly
