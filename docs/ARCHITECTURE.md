# Axiom Technical Architecture

This document provides a technical overview of the Axiom frontend application, detailing how the 1x5 sequence logic, state management, and custom interactions are implemented.

## 1. High-Level Overview

Axiom is a client-side web application built with **React 19** and **Vite**. The core philosophy of the architecture is strict separation between the mathematical sequence generation/validation logic and the React UI rendering layer.

All persistent state is managed locally in the browser via `localStorage` to ensure a seamless experience that survives accidental refreshes or backgrounding.

## 2. Core Logic (`src/axiomLogic.js`)

The mathematical engine driving the game resides entirely outside of the React component tree.

*   **Symbols Array:** The core assets are `['circle', 'triangle', 'square', 'star', 'hexagon']`.
*   **Permutation Generator:** Generates all 120 possible permutations of the 5 symbols to determine valid solution boards.
*   **Rule Types:** Defined relationships (`isImmediatelyLeftOf`, `isSomewhereRightOf`, `isNextTo`, `isInSlot`, etc.).
*   **`generateAxiomPuzzle(ruleCount)`:**
    1.  Selects a random target board from the 120 permutations.
    2.  Generates all valid true statements (rules) about that specific board.
    3.  Extracts a random subset of these rules based on the requested `ruleCount`.
    4.  Verifies that the chosen subset of rules yields **exactly one** valid solution across all 120 permutations. If not, it rerolls.
*   **`checkWin(currentBoard, rules)`:** Iterates through the current board state against the active rules array. Returns `true` only if every rule is satisfied and no slots are empty.

## 3. State Management (`src/App.jsx`)

The main `App` component acts as a state machine for the game loop.

### 3.1 The State Machine (`status`)
The app progresses linearly through distinct phases:
*   `MAIN_SCREEN` (`'home'`): Landing page.
*   `PRE_PUZZLE` (`'pre_puzzle'`): Obfuscated board, waiting for the player to explicitly press start.
*   `PLAYING` (`'playing'`): Active puzzle solving. Timer is running.
*   `PUZZLE_COMPLETE` (`'puzzle_complete'`): Brief 300ms transition state after a correct submission before loading the next round.
*   `DAILY_COMPLETE` (`'daily_complete'`): Final results screen with split times, mistakes, and clipboard sharing.
*   `SYSTEM_FAILURE` (`'system_failure'`): Triggered if the player loses all lives or times out.

### 3.2 Game State Variables
*   `currentIdx`: Tracks the active puzzle round (0 to 4).
*   `board`: An array of length 5 representing the current slots. Empty slots are `null`.
*   `puzzle`: An object containing the active `rules` and the `solution`.
*   `times` / `mistakes`: Arrays of length 5 tracking the milliseconds and error counts per round.
*   `lives`: Tracks remaining integrity (starts at 10, -1 per mistake).
*   `timer`: Active millisecond count (updated every 47ms via `setInterval` for visual smoothness).
*   `lastInteraction`: Tracks the exact timestamp of the last touch/drag to power a 15-minute AFK connection timeout.

### 3.3 Persistence Layer
A strict `useEffect` hook monitors the game state. Any change to `status`, `board`, or `times` triggers a serialization of the state to `localStorage.getItem('axiom_state')`. 
On initial load, the app checks for this cache. If found, it instantly hydrates the state, re-synchronizing the timer based on `Date.now() - savedStartTime`.

## 4. Custom Drag-and-Drop Implementation

Axiom bypasses the native HTML5 Drag-and-Drop API to ensure smooth, immediate, touch-friendly interactions without ghost images or mobile long-press delays.

It utilizes a custom Pointer Events implementation:
1.  **`onPointerDown`**: Captures the initial click/touch on a `draggable-symbol`. Records the exact cursor offset relative to the symbol's top-left corner and sets the `draggedSymbol` state. If the symbol was pulled from a board slot, that slot is immediately set to `null`.
2.  **`onPointerMove` (Window Listener)**: Updates the absolute `x/y` coordinates of a floating replica of the symbol. Uses `document.elementsFromPoint` to constantly check if the cursor is currently hovering over a valid `.slot` target.
3.  **`onPointerUp` (Window Listener)**: Releases the symbol. If a `targetSlot` is active, the `board` state is updated to place the `draggedSymbol` into that specific index. All drag states are cleared.

## 5. UI and Aesthetics

*   **`SymbolIcon` Component:** An inline SVG renderer that draws the geometric shapes based on the string type, applying specific neon hex codes (e.g., `#38bdf8` for Circle).
*   **CSS Classes:** The UI relies heavily on pure CSS for the "Cyberpunk" feel:
    *   `.glass`: Translucent dark backgrounds with subtle borders and backdrop blur.
    *   `.shake` / `.error-flash`: Keyframe animations applied conditionally when an incorrect submission occurs.
    *   `.success-overlay`: A brief visual flash indicating puzzle completion.

## 6. Analytics & Habit Tracking (`src/utils/statsStore.js`)

Axiom includes a built-in gamification engine to drive retention without relying on external servers. 

*   **`calculateAxiomRating(time, lives)`**: Generates a 0-1000 score. Base is 1000, minus 50 points per lost life, and minus 2 points per elapsed second.
*   **`saveGameResult(times, livesRemaining)`**: Invoked immediately when the player completes the 5th puzzle. Updates win counts, calculates the rating, and manages streaks.
*   **`saveGameFailure(timeMs)`**: Invoked when the `SYSTEM_FAILURE` state is triggered. Resets the current streak to 0 and logs a failure status for the day.
*   **Historical Dictionary**: Performance is stored in a `history` dictionary keyed by `YYYY-MM-DD`. This powers the 30-day visual Calendar Heatmap in the UI (showing Red/Yellow/Green states), and the dynamic Rating Distribution bar chart.
