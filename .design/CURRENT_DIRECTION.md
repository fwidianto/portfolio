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

## Chapter 02 — approved continuity rules

Chapter 02 continues directly from the frozen Hero and must feel like the same visual universe rather than a separate application surface.

### Shared background

Chapter 01 and Chapter 02 use the same atmospheric background language:

- near-black / charcoal night sky;
- sparse distant stars;
- subtle asynchronous blinking / twinkling;
- restrained warm signal accents;
- large negative space.

The sky is persistent continuity. It must not become a dense starfield, decorative spectacle, dashboard canvas, or competing visual subject.

### Scene 01 — owner approved

Scene 01, **Stars to Campus**, is approved as the current Chapter 02 baseline.

Narrative intent:

`entering a larger academic world -> gradually finding a place within Mechanical Engineering`

Approved characteristics:

- one warm signal / node descends from the Hero into Scene 01;
- the signal gradually decelerates rather than looping or multiplying;
- the broader International Engineering cohort remains present;
- the smaller Mechanical Engineering group becomes the focus without implying elimination, ranking, or winners;
- the Makara / Universitas Indonesia artifact is the institutional focal object;
- avoid duplicate standalone `Universitas Indonesia` text when the identity is already carried by the Makara artifact;
- main-scene visible text stays extremely restrained;
- inspection may reveal factual context without turning the scene into a data form or dashboard;
- preserve the same night-sky background language as the Hero.

Do not redesign Scene 01 unless the owner explicitly reopens it.

### Scene 02 — active approved direction

Scene 02 is about **learning how to think like an engineer**.

Narrative intent:

`different engineering experiences -> repeated observation and experimentation -> a coherent engineering method -> readiness for industrial reality`

The isolated five-experiment Animation Lab is now accepted as the visual material for active Scene 02 integration. Preserve the experiment concepts and their successful scientific / engineering character.

Approved five stations:

- Thermodynamics / Heat;
- Measurement / Instrumentation;
- Mechanics / Geometry;
- Control / Response;
- Data / Statistics / Pattern.

Scientific formulas, notation, gauges, traces, construction geometry, and other technical attributes may remain where they improve the visual experience. They are generic engineering animation language, not autobiographical facts or verified historical measurements, and must not be presented as such.

The active Scene 02 composition remains:

- five compact engineering experiment stations;
- arranged as a cinematic **arc / constellation**, not a card grid;
- one traveling warm node carries continuity from Scene 01 and visits the experiments sequentially;
- only one station visually dominates at a time while the other four remain quiet and present;
- click / tap / bounded drag interaction should make each experiment visibly react after the automatic sequence settles;
- main-scene prose remains near-zero;
- after all five stations are visited, their learned behaviors converge into one coherent signal that exits toward the 2018 Astra Agro Lestari palm-oil mill chapter;
- Scene 03 itself must not be implemented until owner approval of Scene 02.

The earlier single thermal-fluid-mechanical Scene 02 rig is still considered valuable motion work but is no longer the active composition. Preserve it as a runnable archived prototype rather than deleting or overwriting it. It may be reused elsewhere later if the owner chooses.

The bounded implementation instructions live in:

`.design/CHAPTER_02_SCENE_02_V2_BRIEF.md`

Generated concept imagery is composition / motion reference only and must not override factual assets, owner decisions, or repository governance.

## Current implementation rule

The existing approximately 14-second Red Dwarf formation animation in `prototypes/red-dwarf-animation/index.html` is the owner's approved-as-is Hero animation candidate. Preserve that file and its behavior exactly. The accepted timing, particles, streamlines, formation sequence, replay behavior, interaction, reduced-motion behavior, and settled renderer are frozen.

In the active prototype `prototypes/new-portfolio-animation-first/index.html`, Chapter 02 is being developed following the frozen Hero.

## Chapter 02 — Architecture and Scene Status

**Chapter 02 Status: CHAPTER 02 — OPEN / NOT YET APPROVED**
Chapter-level approval must wait until Scene 04 refinement is complete. Afterward, the owner will review Scenes 01–05 together (evaluating narrative progression, inter-scene transitions, pacing, visual consistency, and total duration) before authorizing chapter-level freeze, scene trimming, or transition changes.

The development sequence is:
`Scene 05 (approved scene baseline) -> Scene 04 (return to refinement) -> Chapter 02 (whole-sequence review)`.

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
   - Status: **ACTIVE REFINEMENT (04.A & 04.B APPROVED BASELINES; 04.C+ PENDING)**.
   - Scene 04.A (Outreach Field): **OWNER APPROVED — CURRENT 04.A ANIMATION BASELINE**.
     - Approved Workspace: `prototypes/scene-04-outreach-explorations/index.html`.
     - Baseline Characteristics: Pure visual text-free canvas, warm Jakarta origin beacon (0.4 Hz breathing aura), 8 anonymous cold slate celestial candidate nodes (zero Tokyo privilege, zero cyan), 6 quadratic inquiry filaments, sequential non-metronomic inquiry pulses depositing transverse ticks, 0.6s silence hold (Beat A3), and final quiet dormancy state ready for 04.B bilateral resonance.
   - Scene 04.B (Singular Connection): **OWNER APPROVED — CURRENT 04.B ANIMATION BASELINE**.
     - Approved Workspace: `prototypes/scene-04-outreach-explorations/04b-animation.html`.
     - Baseline Characteristics: 7.5s calm narrative choreography, exact inherited 04.A dormancy hold (Beat B0), gentle awakening of Tokyo Anchor (`node_3`) with concentric celestial ripple (Beat B1), inbound reciprocal signal wave traveling to Jakarta origin along illuminated cyan filament while shifting traversed ticks (Beat B2), Jakarta reception ripple triggering bilateral split into twin-rail standing wave corridor (Beat B3, representing a confirmed research opportunity / active academic connection), structural perpendicular registration gate lock and graceful background field attenuation to 8–14% (Beat B4), and poised pre-flight resting baseline ready for Scene 04.C flight departure (Beat B5). Main canvas strictly text-free.
     - Commute Sequence: Preserved and quarantined in `prototypes/new-portfolio-animation-first/scene-04.*`.

5. **Scene 05: Engineering Undergraduate Thesis / Synthesis**
   - Status: **APPROVED — CURRENT SCENE-LEVEL BASELINE (COMPRESSED 25.0s & COMPLETED)** (re-frozen as current scene authority; includes full physical apparatus, compressed 25.0s process flow animation across 31 discrete beats, and completed Distillate Collection Bottle [12] filling endpoint).
   - Governance Authority: `.design/CHAPTER_02_SCENE_05_BRIEF.md`; Deferred Roadmap: `.design/SCENE_05_DEFERRED_ROADMAP.md`.
   - Approved Exploratory Workspace: `prototypes/scene-05-apparatus-explorations/index.html` (Study C: 2D orthographic editorial representation of Universitas Indonesia test rig with approved 05.1A apparatus, 05.1B-1 feed/heating/throttling, 05.1B-2A throttling crossing/flash onset, 05.1B-2B flash vessel phase separation, 05.1B-3A vapor transport, 05.1B-3B condensation, 05.1B-3C-1 extraction transport, and 05.1B-3C-2 bottle filling & collection hold).
   - Stability & Duration Rule: Scene 05 is now stable and should not be modified unless explicitly reopened. The compressed 25.0s sequence is accepted as the updated scene baseline; analytical expansions (05.2–05.5) are strictly deferred to the Chapter 02 whole-sequence review.

## Scope

- Root production files (`index.html`, `styles.css`, `main.js`) remain untouched.
- Chapter 02 main runtime continues in `prototypes/new-portfolio-animation-first/`.
- Scene 05 apparatus exploration is isolated in `prototypes/scene-05-apparatus-explorations/` and is frozen.
- No production full-page redesign is currently approved.
- Historical Editorial Systems / Connect-Integrate-Output animation work is not current Hero design authority.
- Supporting visual references may inform visual judgment, but they are lessons rather than templates and do not override approved owner decisions.
- Desktop and mobile rendered evidence are required for owner acceptance of materially visual changes.
- Next active focus is Scene 04 refinement.

## Acceptance

Keep these states distinct:

- Implemented
- Technically validated
- Owner approved

- Chapter 02: **OPEN / NOT YET APPROVED** (whole-chapter review of Scenes 01–05 required before chapter-level freeze).
- Hero (Red Dwarf): Owner approved (frozen).
- Scene 01: Owner approved (frozen).
- Scene 02: Semi-approved (retained as-is for chapter review).
- Scene 03: Owner approved baseline (frozen for current phase; further refinements deferred unless owner-requested).
- Scene 04: Active refinement (Scene 04.A & 04.B: **OWNER APPROVED BASELINES**; Scene 04.C static exploration active).
- Scene 05: **APPROVED — CURRENT SCENE-LEVEL BASELINE (COMPRESSED 25.0s & COMPLETED)** (re-frozen; compressed physical apparatus, 25.0s process flow animation, and completed distillate collection in `prototypes/scene-05-apparatus-explorations/`).

