# Ariadne v3 — Project Identity, Semantic Economy, and Contrast Pilot

**Status:** Owner-approved bounded follow-up experiment  
**Date:** 2026-08-07  
**Primary skill:** `$shared-frontend-visualization-specialist`  
**Runtime target:** Codex App with the model selected by Fauzan before the run

## Why v3 exists

Ariadne v2 materially improved the frontend experience compared with v1.

Owner review of the rendered full-page capture found:

- the first narrative chapter feels more mature than expected;
- continuous animation is a meaningful improvement and worth keeping;
- the overall flow and page-level composition are stronger;
- Ariadne remains a useful step forward in the frontend workflow.

The owner did **not** ask for another broad redesign. The next work should preserve what improved and teach Ariadne three more mature visual principles.

### Owner feedback to address

1. **Redundant direction cues**
   - the animated flow already communicates direction;
   - static arrows/chevrons under or on the line can therefore feel unnecessary;
   - Ariadne should learn not to repeat a meaning when motion already communicates it clearly.

2. **Generic motion versus project identity**
   - the systems motion is pleasant but too generic;
   - animation around a featured project should communicate something recognisable about that project itself;
   - for Odoo Process Control Tower, prefer a moving 2D/SVG/system visual that shows traceability, document flow, branching, convergence, or another real operational relationship rather than a generic pulse that could belong to any project.

3. **Perceptual contrast**
   - some white or near-white controls sit on already light backgrounds and visually disappear unless the user pays close attention;
   - important text and controls must be discoverable at normal attention, not merely technically present or numerically compliant.

These lessons should become durable Ariadne behavior, not one-off CSS fixes.

## Experiment question

Can Ariadne v3 preserve the improved v2 composition and liveliness while making the visual language more semantically economical, more project-specific, and more perceptually legible?

## Starting state

The intended local worktree is:

```text
C:\Users\fauzan\Documents\GitHub\portofolio-ariadne-pilot
```

Expected branch:

```text
agent/portfolio-skill-experiment
```

The local worktree is expected to contain the uncommitted Ariadne v2 implementation in:

- `index.html`;
- `CSS/main.css`.

Those local changes are the approved starting evidence for v3. Do not reset, stash, discard, clean, or replace them from Git.

Before editing:

1. run `git status --short`;
2. confirm the implementation changes are the expected v2 HTML/CSS changes only;
3. fetch the latest experiment instructions only if they can be fast-forwarded without overwriting local implementation changes;
4. load the updated Ariadne skill, `AGENTS.md`, and this v3 packet;
5. preserve the original dirty `C:\Users\fauzan\Documents\GitHub\portofolio` workspace untouched.

If unrelated local changes are present or Git cannot safely preserve the v2 implementation, stop and report.

## Model boundary

Use the model already selected for this Codex thread.

For comparison continuity:

- treat this as Ariadne **Builder** tier;
- prefer the same `deepseek-v4-flash` mapping used in v1/v2 when practical;
- do not switch provider or model during the run;
- record the actual model visible to the thread;
- if the implementation model has no image vision, do not substitute geometry statistics for visual judgment.

## Bounded visual outcome

Refine the existing v2 narrative only where required to address the owner feedback.

Active surface:

```text
existing navigation
→ hero / identity
→ systems transition
→ Odoo Process Control Tower representative chapter
```

Do **not** redesign the lower half of the homepage in this run.

The v3 goal is not `more animation` or `more elements`. It is **better meaning per visual element**.

## Principle 1 — Semantic economy

Review every static direction cue in the active surface.

The existing moving signal already communicates left-to-right or top-to-bottom progression in several places.

Remove a static arrow, chevron, `next` marker, or similar cue when:

- the animation already makes direction unambiguous;
- the cue adds no accessibility or secondary meaning;
- removing it improves calmness and visual maturity.

Retain a static directional cue only when it remains necessary in the reduced-motion state or meaning would otherwise become ambiguous.

If reduced motion needs direction, prefer a restrained structural solution such as line geometry, ordered layout, or one purposeful endpoint treatment rather than restoring repeated arrows everywhere.

Report which redundant cues were removed and why any remaining cue was retained.

## Principle 2 — Odoo-specific motion identity

The Odoo chapter must contain one visual behavior that could not be copied unchanged to the Telegram project and still make equal sense.

Use the real public-safe Odoo Control Tower identity:

- operational documents are connected and traceable;
- users need to understand document relationships and operating flow;
- the system turns scattered ERP transactions into reliable business logic and management-ready visibility.

The frozen Odoo Process Map direction includes real chains such as:

```text
Sales Order
→ Manufacturing / Production
→ QC
→ Finished Goods Stock
→ Delivery
→ Invoice
→ Payment
```

and material/procurement relationships where relevant:

```text
SO / IO / MO
→ RKB / requirement
→ Check Stock
→ shortage path to ROP / Purchase Order / Receipt
→ Material Stock
→ Manufacturing
```

Do not attempt to show the entire frozen process map on the homepage.

### Preferred v3 motif: traceable document journey

Create a simplified public-safe 2D visual showing a **traceable document or demand signal** moving through a small number of recognisable operational states.

A strong interpretation could use 4–6 nodes, for example:

```text
Demand / Sales Order
→ Material / Stock decision
→ Production or Available Stock
→ Delivery
→ Invoice
→ Review-ready visibility
```

or another equally truthful simplification derived from existing approved content.

The moving signal should teach one of these ideas:

- documents are related rather than isolated;
- operational state can be followed end-to-end;
- branches or exceptions can be surfaced;
- scattered transactions become a reviewable system.

Possible implementation forms:

- inline SVG with animated path and document tokens;
- CSS-animated SVG nodes;
- small moving 2D process illustration;
- state-driven line or traceability reveal.

Do not download stock animation or use a generic looping GIF merely to add activity.

Before implementation, state in plain language:

```text
What this Odoo animation represents:
Why this belongs specifically to Odoo Process Control Tower:
What the user learns by watching it:
Reduced-motion equivalent:
```

### JavaScript boundary

Prefer HTML/CSS/SVG when clean and maintainable.

If JavaScript is genuinely needed for project-specific interaction, stop before the first JavaScript edit and request approval with:

1. exact file;
2. interaction or motion enabled;
3. why HTML/CSS/SVG alone is insufficient;
4. how reduced motion and failure fallback will behave.

No dependency installation.

## Principle 3 — Perceptual contrast

Review all buttons, links presented as controls, labels, small metadata, cards, and interactive surfaces in the active v3 region.

The goal is not simply WCAG contrast arithmetic. The goal is immediate discoverability.

Explicitly fix cases where:

- white controls disappear into near-white backgrounds;
- a border is technically present but visually negligible;
- secondary text becomes too faint to scan naturally;
- primary and secondary actions look nearly equal or nearly invisible;
- a user must hover or focus to discover that something is interactive.

Use the existing palette, but allow stronger fill, border, text weight, shadow, or surface separation where needed.

Preserve professional restraint; do not solve contrast with excessive saturation or heavy shadows.

## Preserve from v2

Do not casually undo improvements that already worked:

- hero and portrait read as one composition;
- process rail owns its endpoints;
- hero → systems → Odoo continuity;
- denser page rhythm;
- purposeful continuous liveliness;
- responsive mobile byline treatment;
- Odoo chapter narrative and case-study route;
- static HTML/CSS/JavaScript architecture;
- two-project public curation.

Changes should be evidence-driven from owner feedback.

## Protected areas

Do not redesign or propagate into:

- Professional Experience;
- Skills / business-output section;
- Thinking;
- skills-evolution chart;
- Website Updates;
- Contact;
- footer;
- project detail pages;
- deployment or analytics;
- SEO/JSON-LD except preserving existing references;
- the Telegram project beyond its existing complementary transition entry.

Do not commit, push, merge, rebase, deploy, or switch branches.

## Execution sequence

```text
1. Inspect v2 and current owner feedback
2. State which visual cues are semantically redundant
3. State the Odoo-specific animation concept and what it teaches
4. State the contrast issues to correct in the active surface
5. Implement only the v3 refinements
6. Render desktop / tablet / mobile
7. Validate running motion and reduced motion
8. Validate control discoverability and no overflow / console blockers
9. If genuine image vision is available, perform one screenshot critique
10. If image vision is not available, state that honestly and do not fake it with pixel statistics
11. Stop for Fauzan
```

This run does not authorize another broad self-directed redesign loop.

## Required rendered evidence

Minimum:

- desktop `1440 × 900` hero;
- desktop capture of systems transition + Odoo project-specific animation;
- desktop continuity capture hero → systems → Odoo;
- tablet `768 × 1024`;
- mobile `390 × 844`;
- at least three timed states of the Odoo-specific motion or a short local recording when tooling supports it;
- reduced-motion equivalent;
- keyboard-focus state for one primary and one secondary control in the active surface;
- no horizontal overflow;
- no blocking console errors.

## Owner acceptance path

Fauzan reviews four questions:

1. **Semantic economy:** Does the page say more with fewer unnecessary symbols?
2. **Project identity:** Does the Odoo motion actually communicate something about Odoo Process Control Tower rather than generic `system activity`?
3. **Contrast:** Can important controls and words be found immediately without searching for them?
4. **Preservation:** Did v3 keep the maturity and liveliness gained in v2 rather than regress into a static or overworked design?

## Completion report

Report:

```text
Outcome:
What changed from v2:
Owner feedback addressed:
Redundant static cues removed:
Static cues retained and why:
Odoo-specific animation:
- what it represents
- what the user learns
- why it belongs to this project
- reduced-motion equivalent
Perceptual contrast fixes:
What Fauzan can now see or do:
Start here:
Check first: no more than three checks
Changed files:
What stayed unchanged:
Evidence actually performed:
Visual critique capability: AVAILABLE / NOT AVAILABLE
Model actually used:
Reasoning level if visible:
Approval requests encountered:
Scope drift detected: YES / NO
Provider/model transition: NONE / DESCRIBE
Status:
- Implemented: YES / PARTIAL / NO
- Technical: COMPLETE / PARTIAL / BLOCKED
- Visual: UNVERIFIED until Fauzan reviews
- Behavior: UNVERIFIED until Fauzan reviews
Known limitations:
Stop condition reached: YES / NO
```

## Stop condition

Stop when:

- owner feedback on redundancy, Odoo-specific motion identity, and contrast has been addressed inside the bounded surface;
- responsive and motion evidence is ready;
- no protected section has been propagated;
- the result is ready for Fauzan's visual judgment.

Do not redesign the remaining homepage, build the Telegram chapter, test another model, or begin Ariadne v4 without a new routing decision.
