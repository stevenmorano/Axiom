# Axiom

**Live Demo:** [https://axiom-v8sl.vercel.app/](https://axiom-v8sl.vercel.app/)

**Axiom** is a high-performance, daily-challenge logic sequence puzzle. Players race against the clock to arrange 5 distinct shapes into the correct order across 5 slots, guided by a set of strict positional rules.

Built with competitive integrity and daily retention in mind, Axiom features a 5-round back-to-back speedrun where mistakes cost you seconds, not your entire run.

## 🌟 Key Features

* **The Daily Challenge:** One global run per day consisting of 5 back-to-back puzzles. Pure speed. May the fastest solver win.
* **Positional Logic:** Rules like "Square is next to Circle" or "Star is somewhere right of Hexagon" dictate the exact sequence of the 5 shapes.
* **Immediate Correctness System:** Time is the only penalty. Mistakes trigger a brief visual shake and error tracking, but the timer keeps running, ensuring high completion rates for persistent players.
* **Cyberpunk Aesthetic:** Sleek, high-contrast neon design with smooth drag-and-drop interactions.

## 🚀 Tech Stack

* **Frontend:** React 19 + Vite
* **Persistence:** LocalStorage for state recovery, active puzzle caching, and lifetime stats
* **Architecture:** Functional components with strict decoupling of sequence logic (`axiomLogic.js`) and UI rendering (`App.jsx`).

## 📂 Project Structure

```text
Axiom/
├── docs/               # Architecture, game design, and scoring specifications
├── web/                # The React frontend application
└── PROJECT_BRIEF.md    # High-level overview and agent handoff notes
```

## 🎮 How to Play Locally

1. **Navigate to the web application:**
   ```bash
   cd web
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```

## 📜 Documentation

* [Project Roadmap](ROADMAP.md)
* [Scoring & Mechanics Spec](docs/axiom_scoring_spec.md)
* [Project Brief](PROJECT_BRIEF.md)

## ⚖️ Monetization & Integrity Philosophy

Axiom maintains strict competitive integrity. **No pay-to-win, "Watch Ad for Time", or revive mechanics.** 
Any planned ad integration strictly occurs *post-game* to ensure speedruns remain uninterrupted. Future IAP plans include cosmetic neon themes and ad-removal only.
