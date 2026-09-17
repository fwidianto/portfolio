# Causal Engineering Animation Skill

## Purpose

Use this skill to design, implement, review, and freeze engineering/process animations where physical causality, material continuity, geometry integrity, and factual honesty matter more than decorative motion.

This is an operating methodology, not a visual-style guide.

## Core Method

### 1. Factual grounding
Before animation work begins, classify important scene elements as:

- **Verified** — directly supported by references, photographs, documentation, measurements, or owner-provided facts.
- **Interpretive** — a reasonable abstraction needed for explanation or motion readability, but not literal factual reconstruction.
- **Unsupported** — not evidenced strongly enough to present as fact.

Never present unsupported geometry, mechanics, values, equations, internal components, results, or operating behavior as factual.

### 2. Geometry before motion
Establish stable machine/process geometry before animating behavior.

- Route pipes, conveyors, ducts, wires, ports, vessels, and material paths intentionally.
- Connections must meet clear physical interfaces.
- Avoid impossible routing, arbitrary turns, disconnected endpoints, clipping, and unexplained material movement.
- Do not use motion to hide unresolved geometry.

### 3. Smallest causally complete transformation
Animate one causally complete physical transformation at a time.

Examples:

- feed enters vessel;
- pump becomes operational and fluid begins moving;
- throttling causes flash onset;
- vapor separates from liquid;
- vapor reaches condenser;
- vapor condenses into liquid;
- liquid is extracted to collection.

If a subsection still contains several difficult transformations, split it again.

Do not ask an agent to solve a long engineering sequence in one pass unless the constituent transformations are already independently approved.

### 4. Exact inherited start state
Every subsection must begin from the precise frozen end state of the previous subsection.

Define explicitly:

- where material is physically located;
- which machines are active;
- which machines are inactive;
- which lines are charged;
- which lines are dry;
- what the viewer should already understand.

Do not reconstruct or reinterpret previous approved motion unnecessarily.

### 5. Exact end state
Define the subsection's handoff state before implementation.

State explicitly:

- where the material must end;
- which downstream interfaces have been reached;
- which downstream systems remain inactive;
- what must still be empty/dry/off;
- which next subsection inherits this state.

### 6. Downstream-empty rule
Nothing downstream becomes populated, active, filled, illuminated, or animated before the physical cause reaches it.

Examples:

- a downstream pipe remains dry until the material front reaches it;
- a collection vessel remains empty until liquid physically arrives;
- a condenser remains dry until vapor enters;
- a pump does not move fluid before it becomes operational;
- a product/result state does not appear before its process is complete.

### 7. Cause before effect
Visible causes must occur before their visible effects.

Avoid simultaneous "magic" activation.

Examples:

- pump starts, then after a plausible response delay flow begins;
- cooling begins, then vapor progressively condenses;
- heating acts on present fluid, not on an empty vessel;
- gravity/buoyancy acts after phase material exists;
- pressure-driven transport follows an established process state.

### 8. Material continuity
The same physical material must remain visually traceable through the process.

Avoid:

- teleportation;
- disappearance before equipment and reappearance afterward;
- unrelated state colors that imply a different material;
- whole-line simultaneous filling;
- independent droplets appearing without a source.

For phase changes, preserve material identity:

`same material -> changing state -> same material in new phase`

Use changes in diffusion, density, continuity, speed, opacity, spacing, texture, highlight, or movement behavior before resorting to symbolic recoloring.

### 9. Mechanism before decoration
Motion must communicate the underlying physical/process logic first.

Decorative effects are secondary.

Avoid using glow, pulse, bounce, overshoot, particle bursts, dramatic spins, cold/warm color clichés, or generic tweening as substitutes for mechanism.

### 10. Honest abstraction
When internal geometry or operating mechanics are undocumented, use restrained abstraction rather than invented detail.

Acceptable:

- illustrative process path;
- abstract transport region;
- ghosted phase region;
- thermal zone;
- generalized restriction node.

Avoid unsupported claims such as:

- exact internal impeller design;
- exact coil/pass geometry;
- undocumented trays/baffles/nozzles;
- precise RPM, pressure rise, flow rate, or temperature;
- fabricated equations or validation values.

Clearly distinguish external factual geometry from internal illustrative process visualization.

### 11. Spatial integrity
Engineering motion must respect the scene's physical space.

Check for:

- clipping through equipment or structure;
- lines that do not meet ports;
- material moving outside pipes/ducts;
- unexplained upward/downward motion;
- ambiguous source/destination;
- impossible bends or crossings;
- inconsistent scale.

### 12. Restrained physical motion
Machines should feel grounded.

Prefer:

- gradual startup;
- inertia;
- response delay;
- steady-state settling;
- low-amplitude operational cues;
- physically motivated easing.

Avoid theatrical behavior unless the real mechanism supports it.

### 13. Review motion in real time and keyframes
Review both the full sequence and representative keyframes.

Inspect:

- exact starting boundary;
- first causal action;
- intermediate transformation;
- transition between states;
- arrival at interface;
- final steady hold;
- mobile/responsive state where relevant.

A still image can hide bad choreography. Real-time review is required for causal motion.

### 14. Owner gate
Implementation is not approval.

Unless the owner explicitly requests automatic freezing, the default workflow is:

`implement -> verify -> report -> stop for owner visual review`

Do not mark a scene/subsection approved merely because it renders successfully.

### 15. Freeze after approval
Once owner-approved:

- record the approved state in governance;
- identify the exact inherited handoff state;
- create a clean checkpoint commit;
- preserve the frozen authority when developing the next subsection.

Do not casually modify frozen upstream behavior.

### 16. Separate review tooling from production UI
Stepper controls, timeline scrubbers, timecodes, debug labels, capture helpers, bounding boxes, inspection HUDs, and motion-review controls are review tooling unless explicitly approved for production.

Do not let development tooling silently become part of the final portfolio experience.

## Required Prompt Structure

A Causal Engineering Animation task should normally contain these sections:

### Frozen Authority
List the commits, files, scenes, or approved geometry that must be preserved.

### Scope
State the one transformation or bounded sequence being developed.

### Starting State
Define the exact inherited physical state.

### Ending State
Define the exact target handoff state.

### Do Not Animate Yet
Explicitly list downstream systems, results, or transformations reserved for later.

### Physical Narrative
State the causal story in plain language.

Example:

`vapor arrives -> cooling becomes active -> vapor enters cooling path -> vapor progressively condenses -> liquid reaches outlet`

### Motion Review
Specify what should be inspected before finalizing implementation: inertia, delays, path continuity, physical plausibility, easing, or phase transition behavior.

### Choreography
Define beats and approximate timing windows.

### Material Continuity
State how the material remains visually traceable across equipment and phase changes.

### Downstream-Empty Rule
Define what must remain dry, empty, off, or inactive until the correct moment.

### Factual Boundary
State which elements are literal and which are illustrative abstractions.

### Verification
List required real-time checks, keyframes, desktop/mobile checks, and failure modes.

### Deliverable
Require a concise report covering choreography, timing, corrections, evidence, final inherited state, and changed files.

### Stop Condition
Default:

> Do not freeze automatically. Stop for owner visual review.

## Definition of Mature Output

Mature does not mean more detail.

A mature engineering animation has:

- intentional geometry;
- clear causal motion;
- nothing activating early;
- continuous, traceable material;
- grounded machine behavior;
- honest abstraction;
- restrained effects;
- coherent inherited states between subsections;
- factual claims separated from illustrative visualization;
- an obvious physical reason for every meaningful movement.

## Practical Production Rule

When a long animation feels difficult or starts becoming generic, do not add more instructions to the same large task.

Split the animation into smaller causal sections, then for each section:

`design -> render -> review -> correct -> owner approve -> freeze`

Only after the constituent sections are mature should continuity and whole-sequence pacing be optimized.
