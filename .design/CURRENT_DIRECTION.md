# Current Portfolio Direction

## Status

This file is the current design authority for active portfolio development.

- Production baseline: `main`.
- Active implementation path: `design/editorial-systems-prototype`.
- Continue this implementation path; do not create a competing redesign branch unless the current path is shown to be unsuitable.
- Frozen Hero implementation: `prototypes/red-dwarf-animation/index.html`.

## Identity

- Fauzan Widianto — **Analytical Systems Builder**.
- Positioning: business operations + ERP analytics + process improvement + BI + systems thinking, with AI as an accelerator rather than the identity.
- Public storytelling should move from business problem -> process/business logic -> technology -> evidence or usable outcome.

## Hero — approved direction

The Hero direction is frozen unless the owner explicitly reopens it.

- Primary visible identity: `Fauzan Widianto` and `Analytical Systems Builder`.
- Theme: mature, warm, restrained Red Dwarf / astronomical editorial.
- Near-black or charcoal environment with warm off-white type and sparse deep-red / burnt-orange / amber accents.
- Sparse distant stars with very restrained ambient motion; avoid dense particle fields, nebula wallpaper, cyberpunk, gaming UI, glassmorphism, generic AI gradients, or excessive glow.
- Large negative space and typography-led composition.
- Red Dwarf is the dominant visual anchor.

## Hero narrative motion

The approved formation story is:

`scattered matter -> gravity -> protostar -> stable red dwarf`

- The formation story plays once on first experience and does not auto-loop.
- The same matter should remain conceptually traceable through the transformation; avoid replacement objects, hidden scene cuts, or generic morphing.
- Ambient sky motion is separate from the formation narrative.
- Reduced-motion behavior is required.

## Current implementation rule

The existing approximately 14-second Red Dwarf formation animation in `prototypes/red-dwarf-animation/index.html` is the owner's approved-as-is Hero animation candidate. Preserve that file and its behavior exactly. The accepted timing, particles, streamlines, formation sequence, replay behavior, interaction, reduced-motion behavior, and settled renderer are frozen.

In the active prototype `prototypes/new-portfolio-animation-first/index.html`, Chapter 02 is being developed following the frozen Hero.

## Chapter 02 — Architecture and Scene Status

Chapter 02 ("College Years / Foundations to Real World") is structured into five sequential scenes:

1. **Scene 01: Universitas Indonesia Entry (Stars to Campus)**
   - Status: **Owner approved baseline** (frozen).
   - Identity: Universitas Indonesia Mechanical Engineering cohort transformation (~70 cohort -> ~11 ME subset), institutional seal, archival dossier.

2. **Scene 02: College Engineering Foundations (The Five Disciplines)**
   - Status: **Semi-approved baseline** (may be reviewed later as part of the full chapter review; preserved as-is in active prototype).
   - Identity: Laboratory experiments (Thermodynamics, Measurement, Mechanics, Control, Data/Statistics) in an arc constellation with live telemetry annotations, kinetic velocity vector, and central inquiry beacon.

3. **Scene 03: Astra Agro Lestari Palm Oil Mill Internship (2018, Central Kalimantan)**
   - Status: **Owner approved baseline** (frozen for current phase; further refinements deferred unless owner-requested).
   - Accepted Implementation Scope:
     1. **Causal Batch-Transformation Flow**: One identifiable batch traced continuously through all 6 stages (FFB intake, in-line weighing, saturated steam sterilization, twin-screw pressing, settling clarification, and CPO outflow/storage) under the governing rule *"Nothing moves unless the palm-oil process causes it to move"*.
     2. **Click-to-Restart Stage Behavior**: Clicking any process stage immediately focuses that stage and restarts playback from that point in the sequence.
     3. **Industrial Routing & Spatial Geometry**: Clean external conveyor and pipe paths that do not cut through machine bodies; physically grounded cart unload; position-coupled weighbridge deflection; realistic autoclave door sealing/discharge; auger rotation coupled to compression; and physically grounded fluid causality (clarification column and CPO receiver fill only upon actual liquid arrival).
     4. **Personal Evidence Inspect Node**: Warm amber beacon point (`#scene-03-inspect-btn`) triggering the Astra Agro Lestari archival internship dossier modal with verified metadata, authentic quote, and on-site facility photographs including Fauzan's personal on-site photo.
     5. **Process-Explainer Inspect Node**: Dedicated subtle cyan beacon point (`#scene-03-process-btn`) triggering a structured 6-stage educational walkthrough ("What Happens" and "Why It Matters"), keeping the main canvas surface completely free of always-visible explanatory text clutter.
   - Preservation Rule: All current Scene 03 implementation files in `prototypes/new-portfolio-animation-first/` are preserved exactly as the active baseline. Further Scene 03 refinements or polish are deferred unless explicitly requested by the owner. Do not proceed to Scene 04 without separate instructions.

4. **Scene 04: Journey to Tokyo / Tokyo Tech**
   - Status: **Planned** (the journey to the other side of the world, Tokyo Institute of Technology lab).

5. **Scene 05: Engineering Undergraduate Thesis / Synthesis**
   - Status: **Scene 05.1A, 05.1B-1 & 05.1B-2A Owner-approved baseline (frozen)**; 05.1B-2B (separation & condensation) planned.
   - Authority Brief: `.design/CHAPTER_02_SCENE_05_BRIEF.md`.
   - Approved Exploratory Workspace: `prototypes/scene-05-apparatus-explorations/index.html` (Study C: 2D orthographic editorial representation of Universitas Indonesia test rig with approved 05.1B-1 feed/heating/throttling approach and 05.1B-2A isenthalpic throttling restriction crossing, restrained incipient spool flashing, and flash vessel inlet onset).
   - Scope Rule: All major equipment positions, piping topology, supports, and causal motion up to the unresolved flash onset hold ($t = 24.5\,\text{s}$) are frozen baseline. Section 05.1B-2B (macroscopic vapor separation, dome rise, brine drainage, and condenser operation) has not started.

## Scope

- Root production files (`index.html`, `styles.css`, `main.js`) remain untouched.
- Chapter 02 main runtime continues in `prototypes/new-portfolio-animation-first/`.
- Scene 05 apparatus exploration is isolated in `prototypes/scene-05-apparatus-explorations/`.
- Desktop and mobile rendered evidence are required for owner acceptance of materially visual changes.
- Do not proceed to Scene 04 until separately instructed.

## Acceptance

Keep these states distinct:

- Implemented
- Technically validated
- Owner approved

- Hero (Red Dwarf): Owner approved (frozen).
- Scene 01: Owner approved (frozen).
- Scene 02: Semi-approved (retained as-is for chapter review).
- Scene 03: Owner approved baseline (frozen for current phase; further refinements deferred unless owner-requested).
- Scene 05.1A / 05.1B-1 / 05.1B-2A: Owner approved baseline (frozen; physical apparatus composition, feed/heating/throttling, and throttling crossing / flash onset in `prototypes/scene-05-apparatus-explorations/`).

