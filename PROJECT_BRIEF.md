# PROJECT_BRIEF: Axiom

## Core Concept
**Axiom** is a fast-paced logic sequence puzzle game. The player is presented with 5 empty slots and 5 distinct shapes (Circle, Triangle, Square, Star, Hexagon). They must drag and drop the shapes into the correct sequence based on a set of positional rules.

## Primary Mechanic
**Positional Logic Rules**: Each puzzle gives a subset of constraints dictating the relationships between shapes, such as:
- "[Shape] is immediately left/right of [Shape]"
- "[Shape] is somewhere left/right of [Shape]"
- "[Shape] is next to (or NOT next to) [Shape]"
- "[Shape] is exactly in slot [X]"

The player must satisfy all rules simultaneously to crack the sequence.

## Game Format & The Hook
**The Daily Challenge**: Axiom is structured around a single, global daily puzzle sequence. Every user in the world receives the exact same run once per day. A daily run consists of 5 back-to-back sequence puzzles with increasing difficulty (more rules). The ultimate goal is pure speed: solving all 5 puzzles with the fastest total completion time possible.

## Visual Direction
**Cyberpunk Aesthetics**: The UI embodies a sleek, futuristic identity. High-contrast neon colors (Neon Pink, Neon Blue, Deep Void) are used against dark backgrounds. Interactive elements feature dragging mechanics, smooth transitions, and distinct status indicators (e.g., error shaking, success glowing).

## Monetization
**Strictly Competitive Integrity**: Absolutely NO pay-to-win, "Watch Ad for Time", or "revive" mechanics are permitted for the core daily mode. The leaderboard must remain pure. 
- **AdMob Integration**: Intermittent ads or rewarded ads for cosmetic unlocks are allowed, but they must only appear *after* a user has successfully finished all rounds of the daily puzzle.
- **In-App Purchases (IAP)**: Premium upgrades to permanently remove ads or purchase cosmetic neon themes.

## Tech Stack & Architecture
- **Framework**: React 19 + Vite.
- **Styling**: Tailwind CSS / Vanilla CSS.
- **Persistence**: LocalStorage to handle local high scores, lifetime stats, and active puzzle state to survive refreshes.
- **Puzzle Generation**: A generator that creates rule sets based on permutation logic. (Currently standard random, will migrate to calendar-based deterministic seed for global daily parity).

---

### 🤖 Agent Handoff Notes

**Target: @LogicDev** 
Your priority is the core simulation and validation engine using JavaScript/TypeScript. 
1. Maintain the rule generation and validation engine in `axiomLogic.js`.
2. Implement a deterministic daily seed (`seedrandom(currentDate)`) to guarantee the sequences and rules are identical for all players globally each day.

**Target: @Frontend** 
Your priority is maintaining the Cyberpunk design system in React. 
1. Manage the glowing `SymbolIcon` drag-and-drop mechanics.
2. Build the HUD to display the strict count-up timer and dynamic rule cards. 
3. Ensure the UI flow strictly prohibits ads from interrupting the active solve time.
