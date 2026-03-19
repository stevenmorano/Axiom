# Axiom: Daily Challenge Scoring Spec

## 1. Decision Summary
**Recommended Model: Approach 2 — Immediate Correctness with Time Penalty**

**Why:** 
This approach strongly favors daily retention, fair competition, and player satisfaction. By ensuring that every player who invests the effort will eventually complete the daily challenge, you guarantee the dopamine hit of "finishing" the puzzle, which brings them back tomorrow. Converting mistakes into a natural time penalty (the timer keeps running while they fix their error) is an elegant, non-destructive punishment that retains high competitiveness for hardcore players while remaining accessible to casual players. Approach 1 (Hidden Correctness) is a retention killer—spending 5 minutes on a puzzle only to be told "You failed" with zero opportunity to correct the mistake creates a catastrophic frustration loop.

## 2. Comparative Analysis

### Approach 1: Hidden Correctness Until the End
**Strengths:**
- High stakes make perfect runs feel elite.
- Marginally more resistant to guess-and-test brute forcing.

**Weaknesses:**
- **Astronomically high player frustration:** A single typo ruins an entire day's run.
- **Depressed daily retention:** Players who fail without feedback are highly likely to quit and not return the next day.
- **Low leaderboard participation:** Only perfect runs would rank, leading to sparse or discouraging leaderboards for average players.
- **Poor social sharing:** Fails to provide the nuanced flex of a "total time" metric.

### Approach 2: Immediate Correctness with Time Penalty (Recommended)
**Strengths:**
- **100% Completion Rate (for persistent players):** Everyone achieves the win state and gets to see the success screen, driving daily retention.
- **Fair but strict:** You are penalized organically by the clock. A minor misclick costs 3 seconds; a fundamental misunderstanding costs minutes. 
- **High leaderboard participation:** Everyone gets a final time and ranks on the daily board.
- **Highly shareable:** "I solved it in 2:45!" is a proven, engaging social metric.

**Weaknesses:**
- Susceptible to alt-account scouting (playing on a secondary device to get answers, then recording a blazing-fast time on the main account).
- Players might try to guess the last few moves instead of using logic. 

## 3. Final Official Rule Set

* **Pre-Start State:** The board is completely hidden/obfuscated. The timer reads `0:00.00`.
* **Pressing Start:** Immediately reveals Puzzle 1 and starts the timer. 
* **Puzzle Submission:** Players must explicitly press "Submit" (or the game auto-submits when the board is physically full, depending on specific mechanics). 
* **Incorrect Solution:** If incorrect, the board visually shakes and flashes red. An "Incorrect" indicator appears briefly (e.g., 400ms). **The timer continues to run.**
* **Board State on Incorrect:** The board does NOT reset. It remains exactly as the player left it so they can locate their error, adjust, and re-submit rapidly.
* **Advancing to Next Puzzle:** Upon a correct submission, the UI flashes a rapid success indicator and instantly loads the next puzzle. **There is NO pause, NO "Next Puzzle" button, and NO break between rounds.** This ensures players cannot stop the clock to look up answers online.
* **Ad Breaks:** Ad breaks trigger ONLY after all 5 puzzles are successfully completed, right before the final score screen, preserving the competitive speedrun flow.
* **Final Total Time Calculation:** The game records individual splits for each of the 5 puzzles, but because transitions are instantaneous, the final daily time is effectively a continuous global speedrun.
* **Run Eligibility:** All completed runs count and are placed on the leaderboard. Only the first completed run of the day per account is eligible for the competitive leaderboard.
* **Tie-Breakers:** In the event of identical times, the tie is broken by the real-world completion timestamp (first to achieve the time wins the tie). 
* **Mistake Count:** Tracked for personal statistics, but does *not* affect the primary leaderboard ranking (Time is the sole metric).
* **Perfect Runs Badge:** Players who finish all 5 puzzles with zero incorrect submissions earn a "Flawless" badge (e.g., a gold star or fire icon) next to their time on the leaderboard and their social share card.
* **Anti-Frustration UX:** Highlight the specifically incorrect cells upon a wrong submission so players aren't forced to visually hunt for typos. 

## 4. Edge Cases

* **Leaving the Puzzle Mid-Run / Backgrounding:** The timer is continuous and tied to real-world time. Because there are no pauses between puzzles, closing or backgrounding the app at *any* point after the initial "Start" will permanently add that real-world elapsed time to the player's final score.
* **Refreshing the Browser:** The start timestamp for the active puzzle is saved server-side (and locally). On refresh, the game fetches the current board state and syncs the active timer to `Current Time - Puzzle Start Time`. 
* **Abandoning a Daily Run:** If not completed before the daily midnight reset, the run is recorded as `DNF` (Did Not Finish).
* **Replaying After Completion:** Allowed via a "Practice Mode" button, but the timer is visibly distinct (e.g., grayed out) and times are not submitted to the server.
* **Accidental Submission:** Naturally penalized by the brief "Incorrect" animation and the time taken to re-focus. No extra artificial time penalty is needed.
* **Multiple Incorrect Attempts:** No artificial caps or lockouts. A player can submit 50 wrong answers. Their punishment is the sheer amount of time wasted, naturally dropping them to the bottom of the leaderboard.

## 5. Frontend Handoff Notes

* **Timer Validation:** Use a client-side `setInterval` for the visual UI clock only. For the final leaderboard submission, the backend MUST calculate each puzzle's score via `Server End Timestamp - Server Start Timestamp` and sum them to prevent browser memory manipulation hacks.
* **State Persistence:** Save board state and individual puzzle splits to `localStorage` on every player move. If the user accidentally refreshes or crashes, they should only lose the literal seconds it takes to reload the page.
* **Transitions:** Keep UI transitions between puzzles strictly under 300ms. Players should not feel like the game's animations are artificially hurting their speedrun time.
* **Input Unlocking:** Do not physically lock the board for more than a fraction of a second when an incorrect answer is submitted; allow rapid iteration. 
* **Game States:** Implement clear discrete states: `PRE_START`, `PUZZLE_N_ACTIVE`, `TRANSITIONING`, `RUN_COMPLETE`.
