# Axiom Development Roadmap

This document outlines the strategic plan for Axiom, breaking down development from the initial prototype into a fully monetized, globally competitive production application based on the 1x5 shape sequence mechanics.

---

## ✅ Phase 1: Core MVP (Current State)
*Objective: Build a highly responsive, rule-based sequence puzzle with a functional 5-round daily challenge mode.*

- [x] **Sequence & Validation Engine:** Engine (`axiomLogic.js`) capable of generating absolute and relative positional rules for 5 shapes across 5 slots.
- [x] **Drag & Drop UI:** Implemented custom pointer-event drag and drop for placing shapes into slots.
- [x] **Core Game Loop:** 5 back-to-back puzzles with increasing rule counts (3 to 5 rules). Mistakes track errors and cost time rather than ending the run.
- [x] **Local Persistence:** Saving active puzzle splits, rules, and completion states to `localStorage` to survive browser refreshes.
- [x] **Results Screen & Sharing:** Generation of a final results card with time splits, mistake counts, and clipboard copying for social sharing.

---

## 🚧 Phase 2: Backend & Competitive Layer
*Objective: Connect the local experience to a global ecosystem to drive competition and retention.*

- [ ] **Deterministic Daily Seed:** Implement a strict `seedrandom(YYYY-MM-DD)` implementation so the 5 puzzles generated each day are identical for every player on Earth.
- [ ] **Authentication Layer:** Anonymous guest accounts that can be upgraded to linked accounts (Google/Apple/Email) for cross-device syncing.
- [ ] **Server-Side Validation:** Move timer calculations to the backend (Score = `Server End Time - Server Start Time`) to prevent client-side memory manipulation.
- [ ] **Global Leaderboards:** Real-time daily leaderboards ranking players by pure completion time of all 5 puzzles.
- [ ] **Anti-Cheat Mechanics:** Heuristic detection for alt-account scouting and automated solving bots.

---

## 💎 Phase 3: Monetization & Meta-Progression
*Objective: Introduce sustainable revenue streams while strictly preserving competitive integrity.*

- [ ] **AdMob Integration:** Implement post-game interstitial or rewarded ads that trigger *only* after a successful 5-puzzle run. **(Strict Rule: Never interrupt the active timer)**.
- [ ] **In-App Purchases (IAP):** 
  - Premium tier to permanently remove ads.
  - Cosmetic marketplace for exclusive "Neon Themes" and alternative shape icons.
- [x] **Player Statistics Dashboard:** Track lifetime metrics, average solve times, and current/longest daily streaks.
- [ ] **Achievement System:** Unlockable badges for specific milestones (e.g., "Flawless Run" for zero mistakes on a daily challenge).

---

## ✨ Phase 4: Polish & Growth
*Objective: Elevate the user experience and drive organic growth through social mechanics.*

- [ ] **Advanced Cyberpunk Aesthetics:** Enhance the UI with particle systems, dynamic glow states, and fluid CSS transitions between puzzles.
- [ ] **Sound Design:** Add satisfying auditory feedback for dropping shapes, error buzzing, and completion chimes.
- [ ] **Alternative Game Modes (Optional):** Endless mode (procedurally generated indefinitely) or Zen mode (no timer) for casual practice.

---

*This roadmap is a living document and will be updated as project priorities evolve based on user feedback and technical requirements.*

---

## 📌 Known Issues & Backlog (To Fix Later)
*These items have been noted for future sessions:*

- **Mobile Safari UI Bug:** On iPhone Safari, the bottom navigation bar covers up the "Next" button while playing. We will likely need to adjust the viewport height (e.g., using `100dvh` instead of `100vh` or adding bottom padding) so the browser's dynamic UI doesn't obstruct critical game elements.
- **Stats Dashboard Rework:** The current win rate statistic is too vague, as most players will eventually solve the puzzle given enough time. The stats focus needs to shift toward "flawless" execution and time taken. Errors or misses should negatively impact the displayed stats, factoring in both precision and completion speed rather than just a flat win rate.
