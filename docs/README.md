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

- `../index.html` and `../CSS/` contain the active homepage/Hero implementation on the current design branch.
- `../prototypes/red-dwarf-animation/index.html` contains the existing approximately 14-second Red Dwarf formation animation. It is the single frozen, owner-approved-as-is Hero animation authority. Preserve its implementation and behavior exactly; do not shorten it to the older 8–10-second brief.
- Approval of the prototype does not authorize production integration. Integrating the formation animation into `../index.html` is a separate future decision, and Chapter 02 work is not started by this approval.
- `../Projects/Odoo-ERP-Analytics.html` is the current flagship case-study page.
- `../prototypes/editorial-systems/` is older animation work and is not Red Dwarf Hero authority by default.
- `../red-dwarf-animation.html` is an obsolete, incomplete standalone artifact. Its artifact metadata must not be treated as proof of a usable or authoritative Hero implementation. Do not repair or replace it as part of this governance scope.

The previously referenced `../prototypes/red-dwarf-animation/red-dwarf-animation-visual-board.html` is not present and is not a dependency or authority for the approved prototype. Do not recreate it merely to satisfy stale documentation.

For materially visual work, rendered evidence is required. For unfamiliar or architecture-sensitive animation work, validate the rendering approach with a bounded proof before committing to the full implementation.
