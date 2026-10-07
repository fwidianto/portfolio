# Chapter 01 — Owner Approved & Frozen Baseline

**Status: OWNER APPROVED AND FROZEN BASELINE (CHAPTER I HERO DESKTOP AUTHORITY)**

The refined Chapter I — Red Dwarf Hero implementation in [`prototypes/new-portfolio-animation-first/`](file:///d:/Projects/portfolio/prototypes/new-portfolio-animation-first/index.html) is **owner-approved and frozen as the accepted desktop baseline**. This document establishes the design authority for Chapter I and supersedes all prior Chapter I specifications and historical prototypes.

---

## 1. Visual Identity & Typography Architecture

The Chapter I Hero composition establishes the primary entrypoint for the portfolio. It is typography-led, spacious, and anchored by the celestial red dwarf.

### Heading Element (`h1`)
- **Text Content**: `Fauzan Widianto`
- **Font Family**: `'JetBrains Mono', monospace` (loaded via Google Fonts with `wght@300;400;500;600;700`)
- **Font Size**: `88px`
- **Font Weight**: `300` (Light)
- **Font Style**: `normal`
- **Letter Spacing**: `0.05em`
- **Line Height**: `0.92`
- **Text Color**: `#f4efe8` (warm off-white)
- **Position**: `transform: translate(var(--hero-copy-offset-x, -100px), 0px)` (where `--hero-copy-offset-x: clamp(-100px, calc(clamp(20px, 4vw, 64px) - max(5vw, calc((100vw - 1400px) / 2))), 0px)` aligns text left edge with the header logo at standard desktop widths, clamps to `-100px` at $\ge 1920\text{px}$, and resets to `none` at $\le 900\text{px}$)
- **Opacity**: `1.0`
- **White Space**: `nowrap`

### Subtitle Removal
- The former subtitle `Analytical Systems Builder` is **intentionally removed** from the Chapter I Hero surface.
- The identity of *Analytical Systems Builder* remains the core conceptual positioning of Fauzan across the portfolio narrative, technical demonstrations, and subsequent chapters, but is omitted from Chapter I display typography in favor of editorial restraint and focus.

### Sentence Element (`.hero-red-dwarf__sentence`)
- **Font Family**: `'JetBrains Mono', monospace`
- **Font Size**: `16px`
- **Font Weight**: `500` (Medium)
- **Font Style**: `normal`
- **Letter Spacing**: `0.12em`
- **Line Height**: `1.35`
- **Text Color**: `#f4efe8`
- **Opacity**: `0.90`
- **Filter**: `brightness(110%)`
- **Max Width**: `520px`
- **Fixed Area Geometry**: `min-height: 88px; display: block; word-wrap: break-word;`
  - *Stability Rationale*: Across all 8 rotating lines, wrapping varies between 2, 3, and 4 lines. Locking `min-height: 88px` fixes the container geometry, ensuring **0.000px** layout shift on the `h1` heading and overall Hero composition during rotation cycles.
- **Position**: `transform: translate(var(--hero-copy-offset-x, -100px), 250px)` (synchronized with heading X-offset)
- **Margin**: `22px 0 0`

---

## 2. Rotating Red-Dwarf Sentence Sequence & Cycle

Beneath the primary name, an editorial sentence rotates through eight owner-approved red-dwarf lines after the star has settled.

### Approved Lines & Chronological Sequence

| Index | Sentence Content |
|---|---|
| **0** | `Red dwarfs outlive brighter stars by trillions of years. A reminder that endurance matters more than burning brightest.` |
| **1** | `Red dwarfs are the most common stars in the galaxy, yet most are invisible to the naked eye. Not everything important needs to be seen.` |
| **2** | `A red dwarf uses its fuel remarkably slowly. A reminder that efficiency can matter more than intensity.` |
| **3** | `Red dwarfs are small compared with stars like the Sun, yet they can outlive them by trillions of years. Size does not decide significance.` |
| **4** | `The brightest object is not always the most interesting one. Sometimes the quieter system is the one worth understanding.` |
| **5** | `Red dwarfs burn cooler and slower than larger stars. Progress does not always have to be fast to be meaningful.` |
| **6** | `A red dwarf does more with less—less mass, less light, but vastly more time. Efficiency has its own kind of strength.` |
| **7** | `In a universe obsessed with scale, some of its smallest stars may have the longest stories.` |

### Cycle & Transition Mechanics
1. **Trigger Condition**: Rotation cycle is strictly paused during the 14-second star formation. It begins only after the star has settled (`t >= 14.0s` in `updateFormation` or immediately in reduced-motion mode).
2. **Interval**: Every `5000ms` (5 seconds).
3. **Restrained Crossfade**:
   - `450ms` opacity fade-out via `.hero-red-dwarf__sentence.is-fading { opacity: 0 !important; }` and `transition: opacity 0.45s ease-in-out;`.
   - After 450ms, the DOM text is swapped to the next index in sequence.
   - The `.is-fading` class is removed via `requestAnimationFrame` to trigger the fade-in.
   - Strictly no sliding, character typing, word scrambling, or decorative kinetic effects.
4. **Formation Replay Reset**:
   - Initiating formation replay (via <kbd>R</kbd> key or clicking the replay button) stops the rotation timer, clears active transitions, and resets the content to Line 0 (`Red dwarfs outlive brighter stars...`).
   - The cycle resumes automatically from Line 0 once the formation settles again.
5. **Accessibility**: In `prefers-reduced-motion: reduce`, `transition: none !important` is enforced, allowing immediate text swapping without motion artifacts.

---

## 3. Red Dwarf Star Engine & Atmospheric Tuning

The celestial visual anchor maintains its full interactive shader and canvas implementation while incorporating approved refinements to soften harsh contrast and glare:

1. **Formation Choreography (14.0s)**:
   `scattered dust & gas (0-4s) -> gravitational inward collapse (4-7s) -> protostar ignition & ray formation (7-11s) -> stable red dwarf (11-14s)`
   - Single-run physics simulation with canvas particle streamlines, ray gradients, and WebGL surface transition.
2. **Softened Photometric Balance**:
   - **Canvas Filter**: Dropshadow softened from harsh values to `drop-shadow(0 0 30px rgba(220, 60, 15, .16)) drop-shadow(0 0 72px rgba(150, 30, 10, .10))`.
   - **Limb / Rim Glow**: WebGL shader limb glow multiplier softened from `0.85` to `0.58` (`pow(1.0 - mu, 3.2) * 0.58`).
   - **Corona Ray Feathering**: Corona ray intensity multiplier tempered from `0.32` to `0.20`.
   - **Ray Gradients**: Formation 2D canvas ray opacity softened from `0.40 / 0.85` to `0.24 / 0.60`.
3. **Interactive Physics**:
   - Pointer dragging allows free 3D sphere rotation with fluid damping and inertia.
   - Click/pointer events on the replay button are protected from triggering canvas dragging.

---

## 4. Shell Continuity & Section Handoff

Chapter I functions as an integrated section within the multi-chapter portfolio shell:

1. **Header Status Synchronization**:
   - Default header status displays `01 // RED DWARF`.
   - A scroll listener and DOM observer dynamically ensure the global status text reads `01 // RED DWARF` when Chapter I is visible, preventing subsequent chapters from premature telemetry overwrite.
2. **Keyboard Shortcut Scoping**:
   - Keydown listener for <kbd>R</kbd> (replay) and <kbd>Space</kbd> evaluates viewport visibility: if Chapter I is in view, <kbd>R</kbd> restarts the star formation and does not leak into Chapter II scene navigation.
3. **Continuity Carrier**:
   - The bottom carrier link reads `Continue to Chapter 02` with an anchored downward telemetry line leading cleanly into `#chapter-02`.
4. **Focus & Viewport Protection**:
   - Chapter II Scene 01 dossier focus restoration is guarded with `wasOpen` and `{ preventScroll: true }`, ensuring page load cleanly displays Chapter I at `scrollY = 0` without focus stealing.

---

## 5. Integration Authority

- **Canonical Desktop Source**: [`prototypes/new-portfolio-animation-first/index.html`](file:///d:/Projects/portfolio/prototypes/new-portfolio-animation-first/index.html), [`chapter-01-hero.css`](file:///d:/Projects/portfolio/prototypes/new-portfolio-animation-first/chapter-01-hero.css), and [`chapter-01-hero.js`](file:///d:/Projects/portfolio/prototypes/new-portfolio-animation-first/chapter-01-hero.js).
- **Superseded Paths**:
  - `prototypes/red-dwarf-animation/` is superseded by this integrated baseline.
  - `prototypes/chapter-01-typography-playground/` was an exploratory sandbox and must not be used as production code.
- **Controller Interface**:
  - `window.HeroSentenceController` exposes `getLines()`, `getCurrentIndex()`, `getCurrentText()`, `isRunning()`, `start()`, `stop()`, `reset()`, `advance()`, and `setIndex(idx)`.
