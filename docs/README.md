# Portfolio Documentation

This repository intentionally keeps active documentation minimal.

## Current authority

Use this order for portfolio work:

1. the owner's current request;
2. `../AGENTS.md`;
3. `../.design/CURRENT_DIRECTION.md` when the task affects visual/design direction;
4. a bounded current-task brief explicitly referenced by `CURRENT_DIRECTION.md`, when present;
5. the current tested implementation and only its direct dependencies.

Do not reconstruct historical design explorations or animation authorities unless the task explicitly targets them.

## Current implementation

- `../index.html` is the root production homepage served by GitHub Pages. It is deterministically generated from `../prototypes/new-portfolio-animation-first/index.html` using `node scripts/sync-production-html.mjs` (verify with `node scripts/sync-production-html.mjs --check`). Do not edit root `index.html` manually.
- `../prototypes/red-dwarf-animation/index.html` contains the frozen, owner-approved Hero animation authority.
- `../prototypes/new-portfolio-animation-first/index.html` is the verified accepted prototype workspace:
  - **Chapter I (Red Dwarf Hero)**: Operational and frozen baseline with responsive offset positioning and zero clipping at standard desktop and mobile viewports.
  - **Chapter II**: Accepted for publication with its complete five-scene sequence intact:
    - **Scene 01**: Universitas Indonesia Entry (Approved baseline, frozen).
    - **Scene 02**: College Engineering Foundations (5-station constellation with telemetry).
    - **Scene 03**: Astra Agro Lestari Palm Oil Mill Internship (Owner-approved baseline; clean industrial canvas with duplicate headers and slogans hidden via `layer-text-zones` `display="none"`, causal 6-stage batch flow, and inspectable dossier modal).
    - **Scene 04**: Journey to Tokyo / Tokyo Tech (Integrated 04.A–04.E sequence complete).
    - **Scene 05**: Undergraduate Thesis / Synthesis (25.0s apparatus and phase separation sequence).
  - **Chapters III–V**: Intentionally represented in the public prototype by the shared **Working Experience / Under Development** placeholder (`#chapter-03` / `#working-experience`) with interactive star/dust canvas, while unfinished implementations remain preserved and dormant in standalone prototype workspaces and dormant templates.
  - **Visual Editor**: Isolated development-only workflow (`dev-editor.js` / `dev-editor.css` loaded strictly on demand via `?edit=1`, `#edit`, or local shortcut; zero runtime in normal public viewing).
- `../Projects/Odoo-ERP-Analytics.html` is the current flagship case-study page.
- `../prototypes/editorial-systems/` is older animation work and is not Red Dwarf Hero authority by default.
- `../red-dwarf-animation.html` is an obsolete, incomplete standalone artifact. Its artifact metadata must not be treated as proof of a usable or authoritative Hero implementation. Do not repair or replace it as part of this governance scope.

The previously referenced `../prototypes/red-dwarf-animation/red-dwarf-animation-visual-board.html` is not present and is not a dependency or authority for the approved prototype. Do not recreate it merely to satisfy stale documentation.

For materially visual work, rendered evidence is required. For unfamiliar or architecture-sensitive animation work, validate the rendering approach with a bounded proof before committing to the full implementation.

Current Chapter 02 work must preserve owner-approved Hero and Scene 01 decisions, maintain the shared night-sky background language, and stop at the explicit scene boundary defined by the active brief.
