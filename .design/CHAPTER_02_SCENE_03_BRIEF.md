# Chapter 02 — Scene 03 Brief: Astra Agro Lestari Palm Oil Mill Internship

## Status
- **Scene**: Chapter 02, Scene 03
- **Current Status**: **Owner-approved baseline** (frozen for current phase; further refinements deferred unless owner-requested).
- **Accepted Implementation Scope**:
  1. **Causal Batch-Transformation Flow**: Single identifiable batch traced continuously across all 6 stages (FFB cart/pre-discharge, in-line weighbridge, steam autoclave sterilization, twin-screw pressing, settling clarification, and clarified CPO storage) under the strict rule *"Nothing moves unless the palm-oil process causes it to move"*.
  2. **Click-to-Restart Stage Interaction**: Clicking/tapping any stage focuses that stage and restarts playback cleanly from that point in the sequence.
  3. **Industrial Routing & Spatial Geometry**: External, non-overlapping conveyor and pipe routes that avoid penetrating machine bodies; grounded cart without perpetual levitation; position-coupled weighbridge deflection; realistic autoclave door sealing and cooked batch discharge; auger rotation coupled directly to mechanical compression; and physical fluid travel where the clarification column and CPO receiver fill only upon actual liquid arrival.
  4. **Personal Evidence Inspect Node**: Warm amber beacon point (`#scene-03-inspect-btn`) opening the Astra Agro Lestari archival internship dossier modal with verified metadata, quote, and on-site facility photographs including Fauzan's personal on-site photo.
  5. **Dedicated Process-Explainer Inspect Node**: Subtle cyan beacon point (`#scene-03-process-btn`) opening the 6-stage educational walkthrough modal ("What Happens" and "Why It Matters"), preserving a completely textless, clean main canvas surface.
- **Preservation Rule**: All current Scene 03 implementation files in `prototypes/new-portfolio-animation-first/` (`index.html`, `chapter-02.css`, `chapter-02.js`) are preserved exactly as the active baseline. Further refinements or aesthetic tuning are deferred unless owner-requested.
- **Preceded by**: Scene 02 (College Engineering Foundations — semi-approved baseline, preserved as-is).
- **Followed by**: Scene 04 (Journey to Tokyo / Tokyo Tech — planned; do not implement until separately instructed).

## Governing Rule
> **"Nothing moves unless the palm-oil process causes it to move."**
>
> Every animation must answer: *What caused this movement?*
> Smoothness is a first-class acceptance criterion: motion must feel physically continuous, intentional, and mass-grounded, avoiding abrupt keyframe snaps, robotic linear stops, or discrete PowerPoint-like transitions.
> - No decorative connecting lines.
> - No glowing process node pretending to be material.
> - No unrelated machine motion.
> - No simultaneous machine activity merely to make the scene feel busy.
> - Attention and visual emphasis follow the material: each major machine becomes visually dominant only when the material reaches it, while previous/future equipment recedes into the shared starry industrial environment.
> - Clicking a stage immediately focuses it and restarts playback from that stage.

## Historical / Biographical Reality
- **Employer**: PT Astra Agro Lestari Tbk
- **Role**: Engineering Intern (Palm Oil Mill)
- **Year / Duration**: 2018, ~2 months
- **Location**: Central Kalimantan, Indonesia
- **Core Narrative Core**: "Engineering moved from controlled experiments into a real operating process where material, machinery, and measurement had to work together."

## Narrative & Physical Material Flow (One Traceable Batch)

The narrative authority is **one traceable physical material transformation**, following a single identifiable batch of palm fruit from raw harvest to clarified oil:

1. **Stage 01: FFB Cart & Clear Pre-Discharge**
   - The FFB cart is rendered in clear 2D side-view with actual visible wheels underneath on rails.
   - Retains subtle idle realism (restrained suspension response `Math.sin(Date.now() * 0.006) * 0.45`).
   - **Pre-Discharge**: Cart is locked shut at rest. Before fruit moves, the front discharge gate unlatches and hinges downward into a slide chute.
   - Only after opening does the batch discharge onto the active slat conveyor toward the weighbridge with smooth acceleration.

2. **Stage 02: Physical Weighing & S2-to-S3 Transfer Conveyor**
   - The batch arrives on the weighbridge platform via the intake conveyor.
   - **Causality**: Physical mass depresses the scale bed ($2.2\text{px}$); the qualitative scale dial needle sweeps into the active operating arc; indicator LED illuminates green.
   - **Weighbridge-to-Sterilizer Conveyor**: An explicit, visible 2D flight/slat conveyor travelator connects the weighbridge deck to the sterilizer entry. When weighing settles, this conveyor starts advancing, carrying the batch smoothly across into the open sterilizer chamber.

3. **Stage 03: Sterilizer Autoclave**
   - The batch visibly rides the transfer conveyor into the open sterilizer chamber.
   - **Causality**:
     - Once material enters, the heavy pressure door hinges shut and seals.
     - Saturated steam injection begins only while vessel is sealed.
     - Volumetric steam relief plumes vent from the safety valve.
     - Bourdon pressure gauge needle deflects into the amber operating range.
     - Under thermal exposure and steam pressure, the batch softens and darkens to cooked maroon.
     - Pressure exhausts, gauge needle drops, and the discharge door opens.

4. **Stage 04: Sterilizer-to-Screw-Press Conveyor & Gradual Pressing**
   - **Smooth Conveyor Transfer**: The softened batch transfers continuously onto the 2D flight conveyor travelator; moving flights carry the bunch in a steady, smooth, non-teleporting arc down into the press feed hopper.
   - **Gradual Inertial Startup**: When material reaches the feed hopper, the twin intermeshing screws ramp up gradually with realistic mechanical inertia (engagement $\to$ slow rotation $\to$ progressive acceleration $\to$ stable compression speed) rather than snapping to full speed.
   - **Causality**:
     - Mechanical compression separates material into solid fibrous press cake (extruded through the hydraulic choke cone) and crude oil slurry (trickling into the collection trough).
     - When pressing completes, drive gradually spins down.

5. **Stage 05: Clarification & Phase Separation**
   - The expelled crude oil slurry physically flows along the connecting pipe into the tall clarification vessel.
   - **Causality**:
     - Liquid enters the column; the mixed suspension begins gradual gravity separation.
     - Dense sludge and sand settle to the conical bottom.
     - Emulsion stabilizes in the center.
     - A luminous warm golden clarified oil layer accumulates on top.
     - The rising oil level reaches the skimming weir funnel.

6. **Stage 06: CPO Outflow & Finished Product Storage**
   - Clarified golden oil spills over the skimming weir and flows through the delivery pipe into the finished CPO storage tank.
   - **Causality**:
     - Liquid physically drains from the weir into the storage tank.
     - Inflow causes the storage tank fluid level to rise.
     - The vertical sight-glass level gauge fills in direct response to tank volume.
     - The product settles into finished storage with qualitative status badges (`CRUDE PALM OIL` / `CLARIFIED PRODUCT`).

## Visual Emphasis & Machine States
- Equipment that has not yet received material or has finished its cycle recedes with reduced opacity/subtle line weight into the starry night sky.
- Equipment currently operating on the material is highlighted and visually dominant.
- Night-sky continuity (`#08090c` to `#0d1017`) with sparse twinkling stars is preserved across the entire scene.

## Personal Artifact: Separate Inspectable Node
- The warm personal node is completely detached from the material flow. It does **not** travel as a proxy for palm oil or fruit.
- Instead, it rests as a small, restrained inspectable artifact/beacon near the control/operations monitoring area (`#scene-03-inspect-btn`).
- Clicking/tapping the inspect node opens the archival evidence dossier modal with the existing verified metadata, authentic quote, and on-site photographs (`fauzan-astra-weighbridge.jpg`, `process_environment.jpg`, `bunch_weighing.jpg`, and `astra-agro-lestari-logo.png`).

## Process Explainer Artifact: Dedicated Educational Node
- A subtle cyan beacon point (`#scene-03-process-btn`) positioned in the upper right quadrant of the stage.
- Keeps the canvas surface free of always-visible explanatory text clutter while remaining discoverable.
- Clicking/tapping opens the 6-stage educational walkthrough modal detailing "What Happens" and "Why It Matters" across each milling phase.

## Acceptance Criteria
- Strictly causal: every moving element is caused by the material's presence and transformation.
- One identifiable batch traced through all 6 stages.
- No decorative connecting lines, no artificial process-node carrier pretending to be material, no simultaneous machine showcase.
- Machinery artwork, scientific visual details, night-sky background, personal evidence modal, and process explainer modal preserved.
- Verified with rendered desktop and mobile evidence across all causal states.
- Do not proceed to Scene 04.
