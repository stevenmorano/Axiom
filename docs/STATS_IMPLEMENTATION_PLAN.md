# Axiom Stats & Analytics Implementation Plan

This document outlines the step-by-step technical plan to build the "Wordle-style" hardcore analytics dashboard for Axiom.

## Phase 1: Data Layer (State & Persistence)
*Objective: Ensure game data is properly saved to the browser when a player wins.*

- [ ] **Define Schema:** Implement the JSON structure for `AxiomGameState` (stats aggregate + history dictionary).
- [ ] **Storage Utility:** Create a utility (e.g., `src/utils/statsStore.js` or integrate into existing state) to handle `loadStats()` and `saveGameResult(dailyResult)`.
- [ ] **Game Over Hook:** Update the existing game completion logic in `axiomLogic.js` or the main component to construct the daily result payload (time taken, mistakes made, date) and save it.
- [ ] **Streak Logic Engine:** Implement the date math to correctly increment `currentStreak` (if played yesterday), reset it (if a day was missed), and update `maxStreak` and `fastestSolveMs`.

## Phase 2: UI Layout (The Stats Modal)
*Objective: Build the clean, minimalist data visualization interface.*

- [ ] **Modal Shell:** Create a sleek, glassmorphic modal (`StatsModal.jsx/tsx`) that overlays the game board.
- [ ] **Section 1: Tale of the Tape:** 
  - A horizontal flex row with 4-5 clean metric boxes: *Played*, *Win %*, *Current Streak*, *Max Streak*.
- [ ] **Section 2: The Global Distribution (The Curve):**
  - Build a simple CSS/SVG bar chart representing the bell curve of all players.
  - *(Note for MVP: We will use a seeded random generation to simulate a realistic bell curve for the specific day until a real backend is connected).*
  - Highlight the user's specific tier/bar in a bright accent color.
- [ ] **Section 3: The Calendar Heatmap:**
  - A grid representing the current month or last 30 days.
  - Color-code squares by reading from the `history` object: Green (Flawless), Yellow (Mistakes), Empty (Missed).

## Phase 3: Integration & Polish
*Objective: Hook it into the app and make it feel premium.*

- [ ] **Header Button:** Add a standard stats icon (📊) to the top navigation bar to open the modal on demand.
- [ ] **Auto-Open on Win:** Ensure the Stats Modal automatically pops up after the user completes the daily puzzle and sees the winning screen.
- [ ] **Share Text Upgrade:** Enhance the "Share" clipboard text to include the user's current streak (e.g., `Axiom - May 7 | 1m 12s | 0 Mistakes 🟩 | Streak: 12 🔥`).
- [ ] **Micro-animations:** Add a smooth fill-animation to the distribution chart bars when the modal opens to make the data feel alive.
