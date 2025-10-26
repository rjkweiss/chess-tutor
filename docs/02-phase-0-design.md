# Phase 0: Complete Beginner - Design Document

> Teaching chess from absolute zero to basic competence
> Target: Someone who has never touched a chess board

---

## Learning Objectives

By the end of Phase 0, the learner will be able to:
- ✅ Set up a chess board correctly
- ✅ Know how each piece moves and captures
- ✅ Understand check, checkmate, and stalemate
- ✅ Play a complete game (even if not well)
- ✅ Recognize when they've made a blunder (hanging a piece)

**Estimated Time:** 60-90 minutes

---

## Module Structure
```
Phase 0: Complete Beginner
│
├── Module 1: The Board & Setup (5-10 min)
│   ├── Lesson 1.1: Board Orientation
│   ├── Lesson 1.2: Meet the Pieces
│   └── Lesson 1.3: Setting Up
│
├── Module 2: How Pieces Move (25-35 min)
│   ├── Lesson 2.1: The Rook
│   ├── Lesson 2.2: The Bishop
│   ├── Lesson 2.3: The Queen
│   ├── Lesson 2.4: The King
│   ├── Lesson 2.5: The Knight
│   └── Lesson 2.6: The Pawn
│
├── Module 3: Check, Checkmate, Stalemate (15-20 min)
│   ├── Lesson 3.1: What is Check?
│   ├── Lesson 3.2: Escaping Check
│   ├── Lesson 3.3: What is Checkmate?
│   └── Lesson 3.4: What is Stalemate?
│
├── Module 4: Your First Games (20-30 min)
│   ├── Game 1: King + Pawns Only
│   ├── Game 2: Add Rooks
│   ├── Game 3: Add Bishops & Knights
│   └── Game 4: Full Pieces (Simplified)
│
└── Module 5: Special Moves (10 min)
    ├── Lesson 5.1: Castling
    ├── Lesson 5.2: Pawn Promotion
    └── Lesson 5.3: En Passant (Brief intro)
```

---

## Module 1: The Board & Setup

### Lesson 1.1: Board Orientation (2 min)

**Learning Objective:** Understand board layout and correct orientation

**Screen 1: Introduction**
- Type: `narration`
- Content: "Welcome to chess! Let's start by learning about the board itself."
- Visual: Empty chess board
- Interaction: Click Next

**Screen 2: Board Structure**
- Type: `interactive`
- Content: "A chess board has 8 rows and 8 columns, making 64 squares total. The squares alternate between light and dark colors."
- Visual: Empty board with edges highlighted
- Interaction: Click Next

**Screen 3: Orientation Rule**
- Type: `narration` + `visual-emphasis`
- Content: "Here's your first rule: The board should always be set up so there's a WHITE square in the bottom-right corner from your perspective."
- Visual: Board with bottom-right square highlighted in green
- Interaction: Click Next

**Screen 4: Practice Recognition**
- Type: `quiz`
- Content: "Is this board set up correctly?"
- Visual: Show 4 different board orientations (images)
- Options: Yes / No for each
- Validation:
  - Correct: "Perfect! You can recognize correct board orientation."
  - Wrong: "Not quite. Remember: white square on your right. Try again!"
- Must pass to continue

**Screen 5: Coordinates (Optional depth)**
- Type: `narration` + `interactive`
- Content: "Each square has a name using letters (a-h) and numbers (1-8). This helps us record moves."
- Visual: Board with file names (a-h) and rank names (1-8) labeled
- Interaction: "Click on square e4"
- Validation: Correct = highlight + "Great!"; Wrong = "Try again. Remember: letter first, then number"
- Repeat for 5-7 random squares

**Success Criteria:**
- ✅ Can identify correct board orientation (3/3 correct)
- ✅ Can identify at least 5/7 squares by coordinate

---

### Lesson 1.2: Meet the Pieces (3 min)

**Screen 1: The Chess Army**
- Type: `narration`
- Content: "Each player has 16 pieces: 1 King, 1 Queen, 2 Rooks, 2 Bishops, 2 Knights, and 8 Pawns."
- Visual: All pieces displayed with names
- Interaction: Click Next

**Screen 2: Piece Values**
- Type: `info-card`
- Content: "Pieces have different strengths (measured in 'points'):"
  - Pawn = 1 point
  - Knight = 3 points
  - Bishop = 3 points
  - Rook = 5 points
  - Queen = 9 points
  - King = Priceless (if you lose the King, you lose the game!)
- Visual: Pieces with point values
- Interaction: Click Next

**Screen 3: Piece Identification Quiz**
- Type: `quiz`
- Content: "Click on the Queen"
- Visual: All 6 piece types shown
- Validation: Must click correct piece
- Repeat for each piece type (randomize order)

**Success Criteria:**
- ✅ Can identify all 6 piece types correctly

---

### Lesson 1.3: Setting Up the Board (5 min)

**Screen 1: Watch Setup Demo**
- Type: `animated-demonstration`
- Content: "Watch how I set up the white pieces."
- Visual: Animated placement of white pieces
  - "Rooks go in the corners (a1 and h1)"
  - "Knights go next to the rooks (b1 and g1)"
  - "Bishops go next to the knights (c1 and f1)"
  - "Queen goes on her own color (d1 - white queen on light square)"
  - "King goes on the remaining square (e1)"
  - "Pawns fill the second rank (a2-h2)"
- Interaction: Watch, then Click Next

**Screen 2: Your Turn - Set Up Black Pieces**
- Type: `drag-and-drop`
- Content: "Now you set up the black pieces. Drag each piece to its starting position."
- Visual:
  - Board with white pieces already placed
  - Black pieces available to drag (in a sidebar or below board)
- Hints available: "Click 'Show Hint' for help"
- Validation (real-time):
  - Correct placement: Green glow + checkmark
  - Wrong placement: Red border + "Not quite. [Specific hint: e.g., 'Rooks go in corners']"
- Must complete correctly to proceed

**Screen 3: Important Rule - Queen Placement**
- Type: `emphasis` + `visual`
- Content: "Remember: Queen on her own color!"
- Visual: Show both queens
  - White Queen on d1 (light square) ✓
  - Black Queen on d8 (dark square) ✓
- Interaction: Click Next

**Screen 4: Setup Quiz**
- Type: `timed-challenge`
- Content: "Let's practice! Set up all pieces as fast as you can."
- Timer: Just for fun, not required speed
- Visual: Empty board, all pieces available
- Validation: Must place all 32 pieces correctly
- On completion: "Great job! You took [X] seconds. With practice, you'll get faster!"

**Success Criteria:**
- ✅ Successfully set up board at least once
- ✅ Can explain "Queen on her own color"

---

## Module 2: How Pieces Move

### Approach: Teach by Complexity (Simple → Complex)

**Pedagogical Order:**
1. Rook (simplest - straight lines)
2. Bishop (simple - diagonal lines)
3. Queen (combines Rook + Bishop)
4. King (like Queen but one square)
5. Knight (unique L-shape + jumping)
6. Pawn (most rules)

---

### Lesson 2.1: The Rook (4 min)

**Learning Objective:** Understand how the Rook moves and captures

**Screen 1: Introduction**
- Type: `narration`
- Content: "The Rook is a powerful piece. It's worth 5 points - more than a Knight or Bishop!"
- Visual: Rook piece (both colors)
- Interaction: Click Next

**Screen 2: Movement Pattern**
- Type: `animated-demo`
- Content: "The Rook moves in straight lines - horizontally (left-right) or vertically (up-down). It can move any number of squares."
- Visual:
  - Rook on d4
  - Animate movement to d1, d8, a4, h4 (showing it can move far)
- Highlight: All squares in straight lines from d4
- Interaction: Click Next

**Screen 3: Important Limitation**
- Type: `narration` + `visual`
- Content: "The Rook CANNOT jump over pieces. It must have a clear path."
- Visual:
  - Rook on d4
  - Pawn on d6 (blocking)
  - Show: Rook can move to d5 ✓, but NOT to d7 or d8 ✗
- Interaction: Click Next

**Screen 4: Practice - Basic Movement**
- Type: `interactive-practice`
- Content: "Move the Rook to the highlighted square."
- Visual: Board with Rook on a1, target square at a5
- Interaction: User clicks Rook, then clicks a5
- Validation:
  - Correct: "Perfect! The Rook moved vertically."
  - Wrong move attempt: "Rooks can only move in straight lines. Try again."
- Repeat 3-4 times with different positions

**Screen 5: Capturing**
- Type: `narration` + `demo`
- Content: "The Rook captures the same way it moves - by landing on an opponent's piece."
- Visual:
  - White Rook on a1
  - Black Pawn on a5
  - Animate: Rook moves to a5, removes Pawn
- Interaction: Click Next

**Screen 6: Practice - Capturing**
- Type: `interactive-practice`
- Content: "Capture the black piece with your Rook."
- Visual: White Rook on d1, Black Pawn on d7
- Interaction: User moves Rook to d7
- Validation:
  - Correct: "Excellent! You captured the pawn."
  - Wrong: "Remember: Rooks move in straight lines to capture. Try again."
- Repeat 2-3 times

**Screen 7: Mini-Puzzle**
- Type: `puzzle-challenge`
- Content: "Capture all three black pawns using just your Rook. Pawns won't move."
- Visual:
  - White Rook on a1
  - Black Pawns on a4, e1, e4
- Solution: Rook captures a4, then e4, then e1 (or other order)
- Hints available: "Think about the path your Rook needs to take."
- Validation: All pawns captured = success

**Screen 8: Knowledge Check**
- Type: `quiz-multiple-choice`
- Question: "From d4, which squares can the Rook reach in one move?"
- Visual: Rook on d4, board shown
- Options:
  - A) Only the 4 squares directly next to it
  - B) All squares in straight lines (correct)
  - C) All squares on the board
  - D) Only diagonal squares
- Validation: Must select B to proceed

**Success Criteria:**
- ✅ Can move Rook correctly (3/3 practice attempts)
- ✅ Can capture with Rook (2/2 attempts)
- ✅ Completes mini-puzzle
- ✅ Passes knowledge check

---

### Lesson 2.2: The Bishop (4 min)

**Screen 1: Introduction**
- Type: `narration`
- Content: "The Bishop is also worth 3 points, like the Knight. But it moves very differently!"
- Visual: Bishop piece (both colors)
- Interaction: Click Next

**Screen 2: Movement Pattern**
- Type: `animated-demo`
- Content: "The Bishop moves diagonally - any number of squares. Notice something special: a Bishop stays on the same color squares forever!"
- Visual:
  - Bishop on d4 (light square)
  - Highlight all diagonal squares (all light)
  - Animate movement to a1, h8, a7, g1
- Note: "This Bishop started on a light square and can only ever be on light squares."
- Interaction: Click Next

**Screen 3: Color Binding**
- Type: `emphasis`
- Content: "Each player starts with TWO Bishops - one for light squares, one for dark squares."
- Visual: Starting position showing both bishops
  - White light-square Bishop (c1)
  - White dark-square Bishop (f1)
- Interaction: Click Next

**Screen 4: Cannot Jump**
- Type: `narration` + `visual`
- Content: "Like the Rook, the Bishop cannot jump over pieces."
- Visual:
  - Bishop on d4
  - Pawn on f6 (blocking one diagonal)
  - Show: Can reach e5 ✓, cannot reach g7 ✗
- Interaction: Click Next

**Screen 5-8: Practice (same structure as Rook)**
- Movement practice (3 attempts)
- Capture practice (2 attempts)
- Mini-puzzle: "Capture all three pieces with your Bishop"
- Knowledge check: "What color squares can this Bishop reach?"

**Success Criteria:**
- ✅ Can move Bishop correctly (3/3)
- ✅ Understands color binding
- ✅ Completes puzzle
- ✅ Passes knowledge check

---

### Lesson 2.3: The Queen (5 min)

**Screen 1: The Most Powerful Piece**
- Type: `narration` + `emphasis`
- Content: "The Queen is the most powerful piece on the board - worth 9 points! She can move like a Rook AND a Bishop combined."
- Visual: Queen piece (both colors) with sparkle effect
- Interaction: Click Next

**Screen 2: Movement Pattern**
- Type: `animated-demo`
- Content: "The Queen moves in straight lines (like a Rook) AND diagonally (like a Bishop). She can move any number of squares in 8 directions!"
- Visual:
  - Queen on d4
  - Highlight ALL squares she can reach (cross pattern + X pattern)
  - Show 8 directional arrows
- Interaction: Click Next

**Screen 3: Still Cannot Jump**
- Type: `narration`
- Content: "Even though the Queen is powerful, she still cannot jump over pieces."
- Visual: Queen blocked by friendly pieces
- Interaction: Click Next

**Screen 4: Warning About the Queen**
- Type: `emphasis-box`
- Content: "⚠️ Important: Because the Queen is so valuable, losing her is a huge disadvantage. Always keep your Queen safe!"
- Visual: Example of Queen in danger (being attacked)
- Interaction: Click Next

**Screen 5-8: Practice**
- Movement practice (4 attempts - more because Queen is complex)
- Capture practice (3 attempts)
- Mini-puzzle: "Checkmate the lone King using your Queen"
- Knowledge check: "How many directions can the Queen move?"

**Success Criteria:**
- ✅ Can move Queen correctly (4/4)
- ✅ Completes checkmate puzzle
- ✅ Passes knowledge check

---

### Lesson 2.4: The King (4 min)

**Screen 1: The Most Important Piece**
- Type: `narration` + `emphasis`
- Content: "The King is the MOST IMPORTANT piece. If your King is captured (checkmated), you lose the game! The King doesn't have a point value because losing the King means losing everything."
- Visual: King piece (both colors) with crown emphasis
- Interaction: Click Next

**Screen 2: Movement Pattern**
- Type: `animated-demo`
- Content: "The King moves like the Queen, but only ONE square at a time in any direction."
- Visual:
  - King on d4
  - Highlight the 8 squares around it (d5, e5, e4, e3, d3, c3, c4, c5)
- Note: "Slow but can go anywhere nearby."
- Interaction: Click Next

**Screen 3: King Safety Rule**
- Type: `emphasis-box` + `visual`
- Content: "Critical Rule: The King can NEVER move into danger. If a square is attacked by an opponent's piece, the King cannot go there."
- Visual:
  - King on d4
  - Enemy Rook on a4 (attacking the entire 4th rank)
  - Show: King can move to d5, d3, e5, e4, e3 ✓
  - But NOT to c4 ✗ (attacked by Rook)
- Interaction: Click Next

**Screen 4-7: Practice**
- Movement practice (3 attempts)
- Safety practice: "Move the King to a SAFE square" (some squares are attacked)
- Mini-scenario: "Your King is attacked! Move it to safety."
- Knowledge check: "How many squares can the King move?"

**Success Criteria:**
- ✅ Can move King correctly (3/3)
- ✅ Understands King cannot move into danger (3/3 safety checks)
- ✅ Passes knowledge check

---

### Lesson 2.5: The Knight (6 min)

**Screen 1: The Tricky Piece**
- Type: `narration`
- Content: "The Knight is the trickiest piece to learn. It moves in a unique 'L' shape and is the ONLY piece that can jump over others!"
- Visual: Knight piece (both colors)
- Interaction: Click Next

**Screen 2: The L-Shape Movement**
- Type: `animated-demo` + `detailed-visual`
- Content: "The Knight moves in an L-shape: 2 squares in one direction, then 1 square perpendicular (90 degrees)."
- Visual:
  - Knight on d4
  - Show all 8 possible L-shaped moves with animations:
    - Up 2, Left 1 (c6)
    - Up 2, Right 1 (e6)
    - Down 2, Left 1 (c2)
    - Down 2, Right 1 (e2)
    - Left 2, Up 1 (b5)
    - Left 2, Down 1 (b3)
    - Right 2, Up 1 (f5)
    - Right 2, Down 1 (f3)
- Highlight each target square as it's mentioned
- Interaction: Click Next

**Screen 3: The Jump Ability**
- Type: `narration` + `visual`
- Content: "The Knight is special - it can jump over pieces! It doesn't matter what's in the way."
- Visual:
  - Knight on b1 (starting position)
  - Pawns on a2, b2, c2 (blocking)
  - Show: Knight jumps over them to reach d2, c3, a3
- Interaction: Click Next

**Screen 4: Practice - Finding L-Moves**
- Type: `interactive-exercise`
- Content: "Click ALL the squares the Knight can reach."
- Visual: Knight on d4, empty board
- Interaction: User clicks squares
- Validation: Must click all 8 correct squares, warns if wrong square clicked
- Repeat 2-3 times from different positions

**Screen 5: Practice - Moving the Knight**
- Type: `interactive-practice`
- Content: "Move the Knight to the highlighted square."
- Visual: Knight + target square
- Multiple attempts (5-6, since Knight is hardest)
- Validation with helpful hints: "Remember: 2 squares one way, then 1 square perpendicular"

**Screen 6: Capturing with Knight**
- Type: `demo` + `practice`
- Content: "The Knight captures by landing on an enemy piece."
- Practice: 3 capture exercises

**Screen 7: Knight Fork Introduction**
- Type: `concept-preview`
- Content: "The Knight's unique movement makes it great at attacking two pieces at once - this is called a 'fork'. You'll learn more about this later!"
- Visual: Knight forking King and Queen
- Interaction: "Cool! Click Next"

**Screen 8: Mini-Puzzle**
- Type: `puzzle-challenge`
- Content: "Use your Knight to capture all three enemy pieces. They won't move."
- Visual: Knight + 3 enemy pieces positioned strategically
- Requires planning multiple moves

**Screen 9: Knowledge Check**
- Type: `quiz`
- Question: "What makes the Knight special?"
- Options:
  - A) It's the most powerful piece
  - B) It can jump over pieces (correct)
  - C) It can move any number of squares
  - D) It can move backwards

**Success Criteria:**
- ✅ Can identify all legal Knight moves (2/2 attempts)
- ✅ Can move Knight correctly (5/6 attempts minimum)
- ✅ Completes puzzle
- ✅ Passes knowledge check

---

### Lesson 2.6: The Pawn (6 min)

**Screen 1: The Infantry**
- Type: `narration`
- Content: "Pawns are the weakest pieces (only 1 point), but they have the most complex rules! You start with 8 of them."
- Visual: All 8 white pawns on starting rank
- Interaction: Click Next

**Screen 2: Basic Movement**
- Type: `animated-demo`
- Content: "Pawns move forward ONE square at a time. They can NEVER move backwards or sideways."
- Visual:
  - Pawn on e2
  - Animate moving to e3
  - Show red X on e1 (backwards), d3, f3 (sideways), e4 (not yet)
- Interaction: Click Next

**Screen 3: First Move Special**
- Type: `emphasis` + `demo`
- Content: "On its very first move, a Pawn has a choice: move forward 1 square OR 2 squares."
- Visual:
  - Pawn on e2 (unmoved)
  - Show: Can move to e3 OR e4
  - After moving to e3: Now can only move to e4 (one square)
- Interaction: Click Next

**Screen 4: Capturing Is Different!**
- Type: `emphasis-box` + `visual`
- Content: "Here's what makes Pawns tricky: They capture DIFFERENTLY than they move. Pawns capture diagonally forward (one square)."
- Visual:
  - White Pawn on e4
  - Black Pawns on d5 and f5
  - Show: Pawn can capture either (diagonal) but cannot move to e5 if blocked
- Interaction: Click Next

**Screen 5: Pawns Block Each Other**
- Type: `narration` + `visual`
- Content: "If a Pawn is directly in front of another Pawn, neither can move forward (they block each other)."
- Visual:
  - White Pawn e4, Black Pawn e5
  - Both are stuck
- Interaction: Click Next

**Screen 6: Practice - Movement**
- Type: `interactive-practice`
- Content: "Move the Pawn forward."
- 3-4 attempts with different scenarios:
  - Unmoved pawn (can move 1 or 2)
  - Moved pawn (only 1 square)
  - Blocked pawn (no moves available)

**Screen 7: Practice - Capturing**
- Type: `interactive-practice`
- Content: "Capture an enemy piece with your Pawn."
- 3 attempts with diagonal captures
- Validation: Common mistake - "Pawns don't capture straight ahead! They capture diagonally."

**Screen 8: Pawn Promotion Preview**
- Type: `concept-preview`
- Content: "When a Pawn reaches the opposite end of the board, it promotes to any piece (usually a Queen)! We'll practice this in a real game later."
- Visual: Pawn reaching 8th rank, transforming into Queen
- Interaction: "Wow! Click Next"

**Screen 9: Mixed Practice**
- Type: `scenario-practice`
- Content: "This Pawn has multiple options. What should it do?"
- Show scenarios:
  - Can move forward OR capture
  - Must capture (no forward move)
  - Blocked (no moves)
- 4-5 attempts

**Screen 10: Knowledge Check**
- Type: `quiz-multiple-part`
- Question 1: "How do Pawns move?" → Forward
- Question 2: "How do Pawns capture?" → Diagonally forward
- Question 3: "Can Pawns move backwards?" → No
- Must answer all correctly

**Success Criteria:**
- ✅ Can move Pawn correctly (4/5 attempts)
- ✅ Can capture diagonally (3/3 attempts)
- ✅ Understands Pawn blocking
- ✅ Passes 3-part quiz

---

## Module 3: Check, Checkmate, Stalemate

[I can continue with Modules 3, 4, and 5 in the same detail. Would you like me to continue, or is this level of detail good and you want to fill in the rest yourself based on this pattern?]

---

## JSON Schema for Tutorial Content
```typescript
interface TutorialModule {
  moduleId: string;
  phase: string;
  title: string;
  estimatedMinutes: number;
  lessons: Lesson[];
}

interface Lesson {
  lessonId: string;
  title: string;
  learningObjective: string;
  screens: Screen[];
  successCriteria: SuccessCriterion[];
}

interface Screen {
  screenId: string;
  type: ScreenType;
  content: string;
  boardState?: string; // FEN notation or null
  highlights?: string[]; // Array of squares to highlight
  interaction: InteractionType;
  validation?: ValidationRule;
  hints?: string[];
}

type ScreenType =
  | 'narration'
  | 'interactive'
  | 'quiz'
  | 'drag-and-drop'
  | 'animated-demo'
  | 'practice'
  | 'puzzle-challenge'
  | 'emphasis-box'
  | 'concept-preview';

type InteractionType =
  | 'click-next'
  | 'click-square'
  | 'drag-piece'
  | 'multiple-choice'
  | 'select-all'
  | 'move-piece'
  | 'free-play';

interface ValidationRule {
  correctAnswer: any;
  feedback: {
    correct: string;
    incorrect: string;
    hint?: string;
  };
  attempts?: number; // Max attempts before showing answer
}

interface SuccessCriterion {
  description: string;
  metric: string;
  threshold: number;
}
```

---

## Sample JSON: Lesson 2.1 (The Rook)
```json
{
  "moduleId": "piece-movement",
  "lessonId": "the-rook",
  "title": "The Rook",
  "learningObjective": "Understand how the Rook moves and captures",
  "estimatedMinutes": 4,
  "screens": [
    {
      "screenId": "rook-intro",
      "type": "narration",
      "content": "The Rook is a powerful piece. It's worth 5 points - more than a Knight or Bishop!",
      "boardState": null,
      "visual": {
        "pieces": ["white-rook", "black-rook"],
        "emphasis": "rook"
      },
      "interaction": "click-next"
    },
    {
      "screenId": "rook-movement-demo",
      "type": "animated-demo",
      "content": "The Rook moves in straight lines - horizontally or vertically. It can move any number of squares.",
      "boardState": "8/8/8/8/3R4/8/8/8 w - - 0 1",
      "highlights": ["d1", "d2", "d3", "d5", "d6", "d7", "d8", "a4", "b4", "c4", "e4", "f4", "g4", "h4"],
      "animation": {
        "type": "show-legal-moves",
        "piece": "d4",
        "moves": ["d1", "d8", "a4", "h4"]
      },
      "interaction": "click-next"
    },
    {
      "screenId": "rook-cannot-jump",
      "type": "narration",
      "content": "The Rook CANNOT jump over pieces. It must have a clear path.",
      "boardState": "8/8/3p4/8/3R4/8/8/8 w - - 0 1",
      "highlights": ["d5"],
      "visual": {
        "blocked": ["d7", "d8"],
        "available": ["d5", "d3", "d2", "d1", "a4", "b4", "c4", "e4", "f4", "g4", "h4"]
      },
      "interaction": "click-next"
    },
    {
      "screenId": "rook-practice-1",
      "type": "practice",
      "content": "Move the Rook to the highlighted square.",
      "boardState": "8/8/8/8/8/8/8/R7 w - - 0 1",
      "targetSquare": "a5",
      "interaction": "move-piece",
      "validation": {
        "correctAnswer": {"from": "a1", "to": "a5"},
        "feedback": {
          "correct": "Perfect! The Rook moved vertically.",
          "incorrect": "Rooks can only move in straight lines. Try again.",
          "hint": "Remember: Rooks move horizontally or vertically."
        },
        "attempts": 3
      }
    }
  ],
  "successCriteria": [
    {
      "description": "Can move Rook correctly",
      "metric": "practice_success_rate",
      "threshold": 0.75
    },
    {
      "description": "Completes mini-puzzle",
      "metric": "puzzle_completed",
      "threshold": 1
    },
    {
      "description": "Passes knowledge check",
      "metric": "quiz_passed",
      "threshold": 1
    }
  ]
}
```

---

## Notes for Implementation

**Adaptive Difficulty:**
- Track performance on practice screens
- If user struggles (< 50% success rate), show more hints
- If user excels (100% success rate), skip some redundant practice

**Progress Persistence:**
- Save completed screens to database
- Allow resuming from last incomplete screen
- Show progress indicator (e.g., "Screen 5/12")

**AI Tutor Integration Points:**
- When user makes repeated mistakes → AI provides personalized explanation
- When user completes lesson → AI gives encouraging summary
- When user asks for help → AI explains concept in different way

**Accessibility:**
- All interactions keyboard-accessible
- Screen reader support for visually impaired
- Colorblind-friendly highlights (not just color-based)
- Adjustable difficulty/pace
