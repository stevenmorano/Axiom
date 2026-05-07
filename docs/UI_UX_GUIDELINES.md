# Axiom UI/UX Guidelines

This document serves as the central source of truth for Axiom's visual identity. The aesthetic is "Cyberpunk Minimalist"—focusing on high-contrast neon accents, deep dark backgrounds, and smooth glassmorphic interfaces optimized for a mobile-first web experience.

## 1. Design Tokens (Color Palette)

All core colors are defined as CSS variables in `:root` inside `index.css`.

### Base & Backgrounds
*   **Background (`--bg-color`)**: `#0f172a` (Deep Void)
*   **Card Background (`--card-bg`)**: `rgba(30, 41, 59, 0.7)`
*   **Glass Border (`--glass-border`)**: `rgba(255, 255, 255, 0.1)`

### Accents & Status
*   **Primary Accent (`--accent`)**: `#6366f1` (Neon Indigo)
*   **Success (`--success`)**: `#22c55e` (Neon Green)
*   **Warning (`--warning`)**: `#eab308` (Neon Yellow)
*   **Danger (`--danger`)**: `#ef4444` (Neon Red)

### Typography Colors
*   **Primary Text (`--text`)**: `#f8fafc` (Off-white)
*   **Dim Text (`--text-dim`)**: `#94a3b8` (Slate)

### Shape Identity Colors
The 5 shapes have distinct, hardcoded neon colors to aid rapid visual processing:
*   **Circle**: `#38bdf8` (Light Blue)
*   **Triangle**: `#fb923c` (Orange)
*   **Square**: `#a78bfa` (Purple)
*   **Star**: `#facc15` (Yellow)
*   **Hexagon**: `#2dd4bf` (Teal)

## 2. Typography

*   **Primary Font (`--font-main`)**: `'Inter'`, system-ui, sans-serif. Used for all general UI, buttons, and rules.
*   **Timer Font**: `'Courier New'`, monospace. Used specifically for the active game timer to prevent character shifting (monospaced digits) as time ticks up.

## 3. Core CSS Classes

When building new React components, strictly adhere to these established utility classes:

*   **`.glass`**: Applies our standard glassmorphism effect. Uses a 12px backdrop blur and a 40% opaque dark background.
*   **`.button-primary`**: A rounded pill button featuring a gradient background (`#6366f1` to `#4f46e5`) and a deep purple box shadow. Features active transform scaling.
*   **`.slot`**: A dashed-border container representing an empty position in the 1x5 sequence.
*   **`.slot.active`**: Turns the slot border neon blue and adds a slight background tint when hovering a dragged shape over it.
*   **`.rule-card`**: A dim text block with a solid `--accent` left border used to display sequence constraints.

## 4. Animations & Micro-Interactions

Immediate, tactile feedback is critical to Axiom's fast-paced feel.

*   **Entering a Screen (`.animate-fade-in`)**: A 0.4s ease-out animation that fades opacity from 0 to 1 while shifting up 10px. Used when transitioning from the home screen to the ready screen, or to the final results.
*   **Incorrect Submission (`.shake` + `.error-flash`)**: When the user presses submit with an incorrect sequence, the `.slots-container` immediately executes a 0.4s horizontal CSS shake and flashes a red box-shadow. This penalty is purely visual and temporal; it does not lock the board.
*   **Correct Submission (`.success-overlay`)**: A brief background flash of translucent green (`rgba(34, 197, 94, 0.1)`) that covers the screen as the game instantly transitions to the next puzzle.

## 5. Mobile-First Layout Restrictions

Axiom is built to feel like a native mobile app.
*   The `#root` wrapper is constrained to `max-width: 450px`.
*   The `body` uses `overflow: hidden` to prevent rubber-banding and accidental scrolling while dragging shapes.
*   Media queries (e.g., `@media (max-height: 700px)`) automatically scale down slot sizes and draggable symbols to ensure the entire game board fits vertically on smaller screens without pushing the "Submit" button below the fold.

## 6. Gamification & Retention UI

*   **Command Center Header**: A clean, glassmorphic navigation pill (`.main-header`) on the main menu housing tertiary actions (Stats, How to Play) to keep the core interface uncluttered.
*   **The Habit Driver**: A dynamic, pulsing pill (`.habit-driver`) sitting just above the "PLAY TODAY" button. It reads the local storage stats to issue contextual taunts or encouragement (e.g., "🔥 12 Day Streak - Keep it going!") to drive click-through.
*   **The Stats Dashboard (`StatsModal.jsx`)**: A full-screen overlay featuring CSS-driven bar chart animations (to visualize a global distribution curve) and a 30-day interactive calendar heatmap, utilizing neon drop-shadows to highlight exceptional performance.
