# Chess Tutor - Project Overview

## The Problem I'm Solving
Current chess learning tools (Chess.com, Lichess, etc.) assume you already know the basics.
They show analysis like "Best move was Nf6" but don't explain WHY in beginner-friendly language.
There's a gap between "here are the rules" and "here's how to play well."

**My personal pain point:**
I want to learn chess to play with my partner (2000 rating), but existing tools are confusing and don't explain why a given move is the best.
I wonder if I can use AI to learn to the point where I can play a competitive game with my partner.

## The Solution
An AI-powered chess tutor that:
- Starts from absolute zero (never touched a chess board)
- Teaches interactively (not just reading rules)
- Explains in natural language WHY moves are good/bad
- Adapts to my learning pace
- Tracks improvement over time

## Target User
**Primary:** Myself - complete beginner who knows my partner is 2000-rated
**Secondary:** Any adult/child learning chess for the first time

## Core Unique Value
"Learn chess like you have a patient human tutor sitting next to you, explaining everything in plain English."

## Success Criteria
1. **Personal goal:** I can complete Phase 0 and play a coherent game
2. **Product goal:** AI explanations feel natural and helpful, not robotic
3. **Portfolio goal:** Demonstrates full-stack, AI integration, and system design skills
4. **Learning goal:** Deep understanding of full-stack development, TDD, DevOps

## Learning Phases
- **Phase 0:** Complete beginner (board setup, piece movement, basic rules)
- **Phase 1:** Beginner (stop hanging pieces, basic tactics, simple games)
- **Phase 2:** Intermediate (strategy, openings, positional play)
- **Phase 3:** Advance (game analysis and scoring, Stockfish integration)

## Timeline
~12 weeks (3 months) of focused development
- Weeks 1-4: Core chess engine + UI
- Weeks 5-8: Backend + database + API
- Weeks 9-12: AI integration + DevOps + polish

## Tech Stack
- **Frontend:** React + TypeScript, Zustand, GraphQL Client, WebSockets
- **Backend:** FastAPI (Python), PostgreSQL, Redis (later), ElasticSearch (if needed)
- **AI:** OpenAI GPT-4 for explanations, Stockfish for analysis
- **DevOps:** Docker, GitHub Actions, Railway/Render

## Why This Project?
1. **Solves my real problem** - I actually need this to learn chess
2. **Full-stack showcase** - Frontend, backend, database, AI, real-time
3. **Learning vehicle** - Every technology choice is something I want to learn deeply
5. **Authentic story** - "I built this to solve my own problem" is compelling
