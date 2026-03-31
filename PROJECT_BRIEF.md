# PROJECT_BRIEF: Axiom

## Core Concept
**Axiom** is a 5x5 grid-based puzzle game utilizing an alphanumeric tileset consisting of numbers (1-9) and letters (A-F). 

## Primary Mechanic
**Dynamic Constraints**: The core gameplay revolves around row and column rules (e.g., 'Sum to X', 'Contains Y', or unique character constraints). The player must place, swap, or arrange tiles within the grid to satisfy all intersecting dynamic constraints simultaneously.

## Game Format & The Hook
**The Daily Challenge**: Axiom is structured around a single, global daily puzzle. Every user in the world receives the exact same puzzle once per day. The ultimate goal is pure speed: solving the board with the fastest completion time possible to rank on the Daily Leaderboard. (Other game modes may be introduced later, but this is the core MVP).

## Visual Direction
**Cyberpunk Aesthetics**: The UI must embody a sleek, futuristic identity. Expect high-contrast neon pinks and vivid blues set against deep dark backgrounds (#000000 to #111111). Interactive elements should feature subtle glows, sharp geometry, and responsive kinetic typography.

## Monetization
**Strictly Competitive Integrity**: Absolutely NO pay-to-win, "Watch Ad for Time", or "revive" mechanics are permitted for the core daily mode. The leaderboard must remain pure. 
- **AdMob Integration**: Intermittent ads or rewarded ads for cosmetic unlocks are allowed, but they must only appear *after* a user has successfully finished all rounds of the daily puzzle.
- **In-App Purchases (IAP)**: Premium upgrades to permanently remove ads or purchase cosmetic neon themes.

## Tech Stack & Architecture
- **Framework**: React + Tailwind CSS.
- **Architecture**: Functional React components utilizing modern hooks for strict decoupling of grid logic and UI rendering.
- **Persistence**: LocalStorage to handle local high scores, lifetime stats, and user configuration.
- **Puzzle Generation**: A Deterministic Seed Generator (e.g., using `seedrandom`). The seed must be based strictly on the current calendar date (e.g., `YYYY-MM-DD`) so the exact same grid layout and solution is procedurally generated for everyone.

---

### 🤖 Agent Handoff Notes

**Target: @LogicDev** 
Your priority is the core simulation and validation engine using JavaScript/TypeScript. 
1. Build an `AxiomValidator` that can parse row/column constraints ("Sum to 42", "Contains C") and apply them against the 5x5 array. 
2. Build the `AxiomGenerator` utilizing a deterministic daily seed (`seedrandom(currentDate)`) to guarantee the grid and constraints are identical for all players today, ensuring it has at least one valid solution. Focus on pure, competitive speed optimization without unfair RNG mechanics.

**Target: @Frontend** 
Your priority is establishing the Cyberpunk design system in React using Tailwind CSS. 
1. Set up the color tokens (Neon Pink, Neon Blue, Deep Void) in a Tailwind configuration file. 
2. Build the responsive 5x5 `GridView` and the glowing `TileView` with drag-and-drop or tap-to-swap mechanics. 
3. Build the HUD to display the strict count-up timer. 
4. Ensure the UI flow strictly prohibits ads from interrupting the active solve time, relegating them to the post-game summary screens.
