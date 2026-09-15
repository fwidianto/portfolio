# Chapter 02 — Scene 02 v2 Implementation Brief

## Purpose

This is the bounded implementation brief for the next approved Chapter 02 iteration on `design/editorial-systems-prototype`.

Authority order remains:

1. owner's current explicit request;
2. `AGENTS.md`;
3. `.design/CURRENT_DIRECTION.md`;
4. this brief for the bounded Scene 02 task;
5. current tested implementation.

If any older prototype, generated reference, or local implementation conflicts with the above, the higher authority wins.

## Scope boundary

Work only in the existing animation-first Chapter 02 prototype path:

`prototypes/new-portfolio-animation-first/`

Preserve the approved Red Dwarf Hero and approved Scene 01. Do not redesign or retune them. Do not touch root production files. Do not proceed into Scene 03 implementation. Stop after Scene 02 v2 is rendered and ready for owner review.

The existing single-rig Scene 02 is useful material, not a failed direction. Preserve its successful motion language and reuse/adapt it where useful instead of discarding it wholesale.

## Fixed visual continuity

Chapter 01 and Chapter 02 must share the same atmospheric background language:

- near-black / charcoal night sky;
- sparse distant stars;
- restrained asynchronous blinking / twinkling;
- large negative space;
- warm amber / burnt-orange signal accents;
- no dashboard background, card grid, nebula wallpaper, dense particles, or competing visual spectacle.

The background is continuity, not the subject. The eye should stay on the engineering objects and the traveling signal.

## Scene 02 narrative

Scene 02 is about **learning how to think like an engineer**.

It is not a curriculum list and not the story of one laboratory rig. The intended progression is:

`different engineering experiences -> repeated observation and experimentation -> a coherent engineering method -> readiness for industrial reality`

The visitor should feel that multiple engineering fragments gradually became one repeatable way of approaching problems.

## Composition — Option A: arc / constellation

Replace the single large apparatus composition with **five compact engineering experiment stations arranged as one cinematic arc / constellation**.

Do not render them as five cards, five dashboard panels, or a rigid grid. They should feel like five physical study objects sharing one scene and one visual system.

The current single thermal-fluid-mechanical rig should be reduced in scale and adapted as one of the stations if it remains visually useful. Do not simply clone the same rig five times.

Use five distinct experiment behaviors:

1. **Thermodynamics / Heat**
   - compact vessel, coil, thermal body, or equivalent;
   - visible heat pulse / gradient / energy response.

2. **Measurement / Instrumentation**
   - gauge, probe, sensor, trace, or equivalent;
   - needle / signal / measured response activates.

3. **Mechanics / Geometry**
   - linkage, lever, rotating body, mechanism, or equivalent;
   - motion plus restrained construction / geometric overlay.

4. **Control / Response**
   - a small system that can oscillate or deviate;
   - feedback / correction visibly damps and stabilizes it.

5. **Data / Statistics / Pattern**
   - compact physical or abstract measurement object;
   - scattered readings / points / trace resolve into a recognizable stable pattern.

These are visual metaphors for engineering foundations. Do not present invented numeric results, invented coursework outcomes, or generated technical values as facts from Fauzan's history.

## Traveling signal — continuity thread

Continue the **single warm node / carrier signal** established by the previous chapter transition.

The signal enters Scene 02 and travels along the arc from one experiment to another.

At each station:

- the node arrives;
- that station becomes the dominant active object;
- its characteristic experiment animation plays;
- the other four stations remain present but quiet, dimmer, and non-competing;
- the node then departs toward the next station.

Only one station should visually dominate at a time. Avoid five simultaneous hero animations.

The node is the storytelling thread: it represents experience accumulating rather than a decorative cursor.

## Interaction after the automatic sequence

After the five-station sequence settles, the experiments should remain explorable.

Each station should respond when the visitor directly interacts with it. Prefer simple, tactile behavior:

- click / tap the experiment to replay or perturb its micro-animation;
- pointer drag may manipulate a meaningful parameter when practical;
- the object itself should visibly react rather than opening a generic UI panel.

Examples:

- heat station pulses / warms / cools;
- measurement station moves its gauge and redraws a trace;
- mechanics station rotates or articulates;
- control station is disturbed and then stabilizes;
- data station scatters and reconverges.

Keep interactions bounded, understandable, performant, keyboard-accessible where applicable, and compatible with reduced-motion preferences. Do not add a framework or heavy rendering dependency unless the current static HTML/CSS/JS approach demonstrably cannot support the required interaction.

## Text and information density

The main Scene 02 surface should remain essentially textless.

Do not add:

- curriculum cards;
- explanatory paragraphs;
- five subject headings floating over the objects;
- telemetry dashboards;
- repeated labels that compete with the motion.

If a settled inspectable artifact remains useful, it may reveal concise context such as:

- `Engineering Foundations · 2015–2017`
- `Thermodynamics · Measurement · Mechanics · Control · Statistics`
- `Different subjects gradually became one way of approaching problems.`

The inspect layer is secondary. The scene must communicate its intent through motion even when that text is hidden.

## Ending — bridge to Scene 03

After all five stations have been visited:

- allow the five learned behaviors / traces to briefly feel connected;
- converge their warm accents into one coherent carrier signal;
- let one stronger signal leave the academic experiment field;
- direct it toward the next chapter: **Astra Agro Lestari palm-oil mill industrial reality**.

Do not build the palm-oil mill scene yet. A restrained destination cue / trajectory is sufficient.

Important factual guardrail: Scene 03 is the 2018 Astra Agro Lestari palm-oil mill internship in Central Kalimantan, not automotive Astra.

## Reference composition

Owner-selected visual direction: **Option A — arc / constellation**.

The reference image generated during design discussion depicts five compact experiment pedestals distributed across a broad shallow arc, connected by one dotted warm trajectory. It is a composition and attention-flow reference only, not factual or mechanical authority.

Translate that reference into the existing Red Dwarf / Chapter 02 design language rather than copying generated machinery literally. Real portfolio facts and current governing files outrank generated reference imagery.

## Responsive behavior

Desktop should preserve the broad cinematic arc and large negative space.

Mobile should preserve the same narrative order and one-active-station-at-a-time behavior, but may compress or reflow the arc into a narrower curved / vertical journey. Do not solve mobile by turning the stations into a conventional card list.

## Acceptance evidence

Render and inspect at minimum:

### Desktop — 1440x900
- Scene 02 arrival / five-station composition;
- node activating an early station;
- node activating a later station;
- settled interactive state;
- one direct interaction response;
- final converged exit signal toward Astra.

### Mobile — 390x844
- five-station responsive composition;
- active station state;
- settled state;
- one interaction response;
- exit state.

Verify syntax/runtime behavior and obvious regressions, but rendered evidence is mandatory for visual acceptance.

## Stop condition

Stop when Scene 02 v2 is implemented, technically validated, and rendered for owner review.

Do not proceed to Scene 03. Only the owner can mark the Scene 02 visual result as approved.
