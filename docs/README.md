# Portfolio Documentation

This repository intentionally keeps active documentation minimal.

## Current authority

Use this order for portfolio work:

1. the owner's current request;
2. `../AGENTS.md`;
3. `../.design/CURRENT_DIRECTION.md` when the task affects visual/design direction;
4. the current tested implementation and only its direct dependencies.

Do not reconstruct historical design explorations or animation authorities unless the task explicitly targets them.

## Current implementation

- `../index.html` and `../CSS/` contain the root production homepage on the current design branch (kept untouched during prototype work).
- `../prototypes/red-dwarf-animation/index.html` contains the frozen, owner-approved Hero animation authority.
- `../prototypes/new-portfolio-animation-first/index.html` is the active Chapter 02 prototype workspace:
  - **Scene 01**: Universitas Indonesia Entry (Approved baseline, frozen).
  - **Scene 02**: College Engineering Foundations (Semi-approved, retained as-is for chapter review).
  - **Scene 03**: Astra Agro Lestari Palm Oil Mill Internship (Owner-approved baseline, frozen for current phase. Accepted scope: causal 6-stage palm-oil batch transformation, click-to-restart stage behavior, industrial routing and geometry cleanup, personal evidence inspect node with on-site photo, and dedicated process-explainer inspect node. Further refinements deferred unless owner-requested).
  - **Scene 04**: Journey to Tokyo / Tokyo Tech (Planned).
  - **Scene 05**: Undergraduate Thesis / Synthesis (Scene 05.1A physical apparatus composition and 05.1B-1 feed/heating/throttling motion owner-approved and frozen in isolated workspace `../prototypes/scene-05-apparatus-explorations/index.html`; governance authority in `../.design/CHAPTER_02_SCENE_05_BRIEF.md`; 05.1B-2+ planned).
- `../Projects/Odoo-ERP-Analytics.html` is the current flagship case-study page.
- `../prototypes/editorial-systems/` is older animation work and is not Red Dwarf Hero authority by default.
- `../red-dwarf-animation.html` is an obsolete, incomplete standalone artifact. Its artifact metadata must not be treated as proof of a usable or authoritative Hero implementation. Do not repair or replace it as part of this governance scope.

The previously referenced `../prototypes/red-dwarf-animation/red-dwarf-animation-visual-board.html` is not present and is not a dependency or authority for the approved prototype. Do not recreate it merely to satisfy stale documentation.

For materially visual work, rendered evidence is required. For unfamiliar or architecture-sensitive animation work, validate the rendering approach with a bounded proof before committing to the full implementation.
