# Current Portfolio Direction

## Status

This file is the current design authority for active portfolio development.

- Production baseline: `main`.
- Active implementation path: `design/editorial-systems-prototype`.
- Current accepted state:
  - **Chapter I (Red Dwarf Hero)**: Operational and frozen as accepted desktop/mobile baseline with responsive offset positioning and zero clipping.
  - **Chapter II (Foundations to Real World)**: Accepted for publication with its complete five-scene sequence intact (01 UI Entry, 02 Foundations, 03 Astra Mill, 04 Tokyo Journey, 05 Thesis Rig).
  - **Chapters III–V**: Chapter III / Working Experience is intentionally pending a complete redesign from first principles. The current public Working Experience placeholder is the only accepted implementation. No previous Chapter III–V prototype, scene structure, visual concept, or narrative plan is authoritative.
  - **Visual Editor**: Development-only tool isolated on-demand via `?edit=1`, `#edit`, or local shortcut, completely excluded from normal public viewing.
- Verified prototype authority: `prototypes/new-portfolio-animation-first/index.html`.

## Identity

- Fauzan Widianto — **Analytical Systems Builder**.
- Positioning: business operations + ERP analytics + process improvement + BI + systems thinking, with AI as an accelerator rather than the identity.
- Public storytelling should move from business problem -> process/business logic -> technology -> evidence or usable outcome.

## Hero — approved direction

The Hero direction is frozen as the owner-approved desktop baseline (governed by `.design/CHAPTER_01_APPROVED_BASELINE.md`).

- Primary visible identity: `Fauzan Widianto` in JetBrains Mono 300 (88px, light, warm off-white `#f4efe8`, `transform: translate(-100px, 0px)`).
- Subtitle `Analytical Systems Builder` is removed from the Hero surface in favor of editorial restraint (the identity remains preserved across portfolio architecture and systems narratives).
- Rotating red-dwarf sentence area: JetBrains Mono 500 (16px), 520px max width, fixed 88px container geometry ensuring 0px layout shift. Rotates through 8 approved lines every 5 seconds after star settle via restrained 450ms crossfade.
- Softened photometric balance: canvas dropshadow softened, shader rim glow multiplier tempered (0.58), corona ray feathering tempered (0.20), formation ray gradients softened (0.24 / 0.60).
- Shell & Continuum: Header status synchronizes to `01 // RED DWARF` during Hero visibility, scoped keyboard shortcuts (<kbd>R</kbd>), clean `Continue to Chapter 02` telemetry carrier handoff, and focus-protected Scene 01 initialization.
- Theme: mature, warm, restrained Red Dwarf / astronomical editorial.
- Near-black environment with warm off-white type and softened deep-red / burnt-orange accents.
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

The refined integrated Red Dwarf Hero in `prototypes/new-portfolio-animation-first/index.html` is the owner-approved and frozen Chapter I baseline (superseding `prototypes/red-dwarf-animation/`; see `.design/CHAPTER_01_APPROVED_BASELINE.md`). The accepted 14-second formation choreography, timing, particles, streamlines, formation sequence, replay behavior, interactive dragging, reduced-motion behavior, and settled renderer are frozen.

## Chapter 02 — Architecture and Scene Status

**Chapter 02 Status: ACCEPTED FOR PUBLICATION (FIVE-SCENE SEQUENCE INTACT)**
Chapter II is accepted for publication in `prototypes/new-portfolio-animation-first/` with its complete five-scene sequence intact (Scenes 01–05). The continuous multi-scene journey, causal transitions, restrained visual canvas, and responsive behaviors are verified and approved.

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
   - Status: **ACTIVE REFINEMENT (04.A, 04.B, 04.C, 04.D & 04.E APPROVED BASELINES; FULL END-TO-END INTEGRATION AUDIT PENDING)**.
   - Scene 04.A (Outreach Field): **OWNER APPROVED — CURRENT 04.A ANIMATION BASELINE**.
     - Approved Workspace: `prototypes/scene-04-outreach-explorations/index.html`.
     - Baseline Characteristics: Pure visual text-free canvas, warm Jakarta origin beacon (0.4 Hz breathing aura), 8 anonymous cold slate celestial candidate nodes (zero Tokyo privilege, zero cyan), 6 quadratic inquiry filaments, sequential non-metronomic inquiry pulses depositing transverse ticks, 0.6s silence hold (Beat A3), and final quiet dormancy state ready for 04.B bilateral resonance.
   - Scene 04.B (Singular Connection): **OWNER APPROVED — CURRENT 04.B ANIMATION BASELINE**.
     - Approved Workspace: `prototypes/scene-04-outreach-explorations/04b-animation.html`.
     - Baseline Characteristics: 7.5s calm narrative choreography, exact inherited 04.A dormancy hold (Beat B0), gentle awakening of Tokyo Anchor (`node_3`) with concentric celestial ripple (Beat B1), inbound reciprocal signal wave traveling to Jakarta origin along illuminated cyan filament while shifting traversed ticks (Beat B2), Jakarta reception ripple triggering bilateral split into twin-rail standing wave corridor (Beat B3, representing a confirmed research opportunity / active academic connection), structural perpendicular registration gate lock and graceful background field attenuation to 8–14% (Beat B4), and poised pre-flight resting baseline ready for Scene 04.C flight departure (Beat B5). Main canvas strictly text-free.
   - Scene 04.C (Flight Journey): **OWNER APPROVED — CURRENT 04.C ANIMATION BASELINE**.
     - Approved Workspace: `prototypes/scene-04-outreach-explorations/04c-animation.html`.
     - Baseline Characteristics: 8.5s continuous motion choreography across 5 causal beats (C0 Handoff, C1 Departure & Climb, C2 Resonant Cruise, C3 Approach & Tokyo Bay Descent, C4 Touchdown & Commuter Handoff). Vector airliner with aeronautical fidelity (swept wings, winglets, turbofans, control surfaces, cockpit windshield, altitude ground shadow, 4 flashing aviation strobes), aerodynamic dual vapor contrails from engine nozzles, Natural Earth hairline starlight coastlines (Java, Philippines, Ryukyu, Honshu) along the bilateral airway, and seamless macro-to-micro bridge introducing the Tama River guide and pre-registering Takatsu residence and Tokyo Tech Ookayama campus commuter nodes. Main canvas strictly text-free.
   - Scene 04.D (Commute Integration): **OWNER APPROVED — CURRENT 04.D ANIMATION BASELINE**.
     - Approved Workspace: `prototypes/scene-04-outreach-explorations/04d-integration.html`.
     - Baseline Characteristics: Fully integrated 28.5s continuous macro-to-micro narrative sequence. True-north conformal flight atlas (Direction F2) grounded from frame 0 (`geoAlpha = 1.0`, solid slate landmasses `rgba(24, 34, 54, 0.80)`, illuminated archipelagos, authentic Great-Circle geodesic trajectory), complete elimination of premature approach aperture artifacts, continuous optical camera dive centered into Tokyo (`zReg: 1.0 → 4.5`, Tokyo Bay expansion, commute scaling `0.60 → 1.0` anchored on arrival geography with connecting amber thread to Takatsu Residence), refined editorial commute cartography (Direction C1 hydro-topographic + C2 bridge spans, grounded municipal ward tone `rgba(18, 26, 44, 0.45)`, filtered secondary/tertiary roads with soft radial vignette preventing cut wires, dominant active roadbeds/trackbeds), preserved mature bicycle and commuter rail kinematics (banking lean, wheel rotation, station platform dwells, concourse pedestrian transfer causality, elevated viaduct crossing), strictly text-free main canvas.
   - Scene 04.E (Return to Jakarta): **OWNER APPROVED — CURRENT 04.E ANIMATION BASELINE**.
     - Approved Workspace: `prototypes/scene-04-outreach-explorations/04e-return-integration.html`.
     - Baseline Characteristics: 11.5s return flight sequence concluding Scene 04 (`28.5s – 40.0s`). Lived Tokyo tenure complete with dimmed commute routes (45% resting memory) and Ookayama harmonic farewell ripple (Beat E0); smooth zero-reset optical regional ascent and continental elevation (`zReg: 4.5 → 1.0`) transitioning from local street grid into True-North conformal atlas (Beat E1); twin-engine vector airliner liftoff from Haneda south-southwest (`~220°` heading) along reverse Great-Circle corridor with twin wing contrails and active waypoint ticks (Beats E2–E4); touchdown and soft dissolution at the general Jakarta / Indonesia arrival anchor with expanding warm amber arrival pulse and resting halo (Beat E5), concluding Scene 04 and geographically re-establishing Indonesia without conflating with Universitas Indonesia (which Scene 05 will establish separately). Strictly text-free canvas.

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
- Next active focus is full Scene 04 end-to-end review (04.A → 04.B → 04.C → 04.D → 04.E).

## Acceptance

Keep these states distinct:

- Implemented
- Technically validated
- Owner approved

- Chapter 01 / Hero (Red Dwarf): **OPERATIONAL AND FROZEN BASELINE** (see `.design/CHAPTER_01_APPROVED_BASELINE.md`; responsive offset rule implemented for zero clipping at standard desktop widths).
- Chapter 02: **ACCEPTED FOR PUBLICATION** (complete five-scene sequence intact and active in the verified prototype reel).
  - Scene 01 (Universitas Indonesia Entry): Owner approved baseline (frozen).
  - Scene 02 (College Foundations): Accepted baseline (5-station constellation with telemetry).
  - Scene 03 (Astra Agro Lestari Mill): Owner approved baseline (frozen; clean industrial canvas with duplicate headers and corporate slogans hidden via `layer-text-zones` `display="none"`, causal 6-stage batch flow, and inspectable dossier modal).
  - Scene 04 (Journey to Tokyo / Tokyo Tech): Accepted baseline (04.A–04.E sequence complete).
  - Scene 05 (Thesis Rig / Synthesis): Accepted baseline (25.0s apparatus and phase separation).
- Chapters 03–05: **WORKING EXPERIENCE (PENDING REDESIGN)**.
  - Active public surface: `#chapter-03` (`#working-experience`) "Working Experience / Under Development" placeholder section with interactive cosmic dust/star field canvas and structured metadata.

## Chapter III / Working Experience — Status

Chapter III / Working Experience is intentionally pending a complete redesign from first principles. The current public Working Experience placeholder is the only accepted implementation. No previous Chapter III–V prototype, scene structure, visual concept, or narrative plan is authoritative.
