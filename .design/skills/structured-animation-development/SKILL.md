# Structured Animation Development Skill

## Purpose

Use this skill for **all substantial animation work** in the portfolio: narrative, cinematic, engineering/process, data, interface, abstract, and brand animation.

This is a **development methodology**, not a visual style and not an engineering-only rulebook.

Its core principle is:

`ground the intent -> compare design directions -> choose and lock composition/geometry -> define the causal or narrative sequence -> animate in bounded sections -> review -> owner approve -> freeze -> integrate`

The skill exists to prevent premature animation, generic motion, unresolved geometry, incoherent transitions, and large one-pass implementations that become difficult to review or repair.

---

## Core Workflow

### 0. Establish authority and intent

Before designing or animating, identify:

- the current governance / frozen authority;
- what may change and what must remain untouched;
- the scene's narrative or functional purpose;
- the desired impression;
- the owner decision being pursued;
- the exact stop condition.

Do not begin implementation while these are ambiguous.

### 1. Ground truth, references, and constraints

Separate what is known from what is interpretive.

Classify important elements as appropriate:

- **Verified / required** — supported by owner decisions, references, factual evidence, or existing approved design.
- **Interpretive / designed** — a deliberate visual abstraction or storytelling choice.
- **Unsupported / avoid** — not justified strongly enough to present as fact or authority.

For non-factual scenes, grounding still matters: define the narrative facts, visual references, interaction constraints, responsive requirements, and continuity inherited from surrounding scenes.

Do not let animation invent the scene's meaning.

### 2. Compare design directions before implementation

For any visually difficult or consequential scene, explore multiple plausible directions **before** committing to motion.

Normally compare 2–3 bounded alternatives that differ meaningfully in composition, spatial logic, hierarchy, or visual metaphor.

Examples:

- orthographic vs cinematic perspective;
- constellation vs linear journey;
- one central protagonist vs distributed field;
- literal representation vs restrained abstraction;
- spatial transition vs object transformation.

The purpose is not endless exploration. It is to expose the strongest structural choice before implementation cost rises.

Do not animate all alternatives. Select one direction first.

### 3. Choose and state the visual thesis

After comparison, explicitly state the chosen scene idea in one short sentence.

Examples:

- `One signal survives repeated outreach and becomes the path to Tokyo.`
- `The same working fluid remains traceable from feed to collected distillate.`
- `Five experiments form one coherent engineering method.`

The visual thesis is the test for later design decisions. If an element does not strengthen it, question whether it belongs.

### 4. Geometry and composition before motion

Resolve the static scene before solving animation.

Lock or intentionally define:

- major objects / subjects;
- composition and hierarchy;
- spatial relationships;
- routes / paths / anchor points;
- camera or viewport framing;
- scale;
- ports / interfaces where relevant;
- negative space;
- responsive behavior;
- factual vs illustrative geometry boundaries.

A still frame should already make structural sense.

Do not use motion to hide weak layout, ambiguous routing, poor hierarchy, clipping, or unresolved geometry.

### 5. Identify the continuity thread / protagonist

Every sequence should have something the viewer can mentally follow.

Depending on the scene, that may be:

- a physical material;
- a person;
- an opportunity / connection;
- a signal;
- a data object;
- a visual motif;
- a question;
- a state change;
- a camera journey.

Define it explicitly.

The continuity thread should not disappear and reappear without intentional narrative reason.

### 6. Decompose into the smallest meaningful transformation

Do not ask an agent to solve a long complex animation in one pass.

Break the scene into bounded transformations, each with one clear purpose.

Examples:

- attempts accumulate -> one response appears;
- response -> opportunity opens;
- departure -> travel;
- vapor -> liquid;
- closed panel -> inspected state;
- raw data -> pattern;
- scattered nodes -> coherent system.

If a subsection still contains several difficult transformations, split it again.

### 7. Define exact inherited start and end states

Before animating a subsection, state:

#### Starting State

- what is visible;
- where the continuity thread is;
- what is active / inactive;
- what the viewer already understands;
- what state is inherited from the previous approved section.

#### Ending State

- what transformation has completed;
- where the continuity thread ends;
- what newly becomes available;
- what still must **not** happen yet;
- what the next subsection will inherit.

This prevents future states from leaking into the current section.

### 8. Cause before effect / future-state-hidden rule

A result should not appear before the event that earns it.

This applies beyond engineering.

Examples:

- Tokyo does not become the destination before the meaningful connection exists;
- a collection vessel does not fill before liquid arrives;
- a result panel does not show before its data is produced;
- a transformed identity does not appear before the transition occurs;
- an emotional resolution does not arrive before narrative tension has resolved.

For physical/process scenes this includes the traditional downstream-empty rule.

For narrative scenes, think of it as:

**future states remain hidden or inactive until narratively earned.**

### 9. Preserve continuity through transformation

The viewer should be able to understand that the same thing, idea, or story thread is changing.

Avoid accidental replacement language such as:

- object disappears -> unrelated object appears;
- one material vanishes -> differently styled material appears;
- one narrative motif stops -> unrelated destination appears;
- one UI state cuts to another without a meaningful transition.

Prefer transformations where continuity is visually legible.

### 10. Mechanism / meaning before decoration

Motion must communicate what is happening before it tries to impress.

Use glow, particles, bounce, blur, camera moves, overshoot, pulses, parallax, typography motion, color shifts, or secondary effects only when they strengthen the scene's meaning.

Do not use decorative motion as a substitute for unresolved storytelling or structure.

### 11. Design the motion grammar only after geometry is stable

Once composition is approved, define:

- timing;
- pauses / holds;
- acceleration / deceleration;
- sequencing;
- overlap;
- camera movement if any;
- entrance / exit behavior;
- emphasis hierarchy;
- ambient vs narrative motion;
- reduced-motion behavior where relevant.

Motion should feel intentional rather than like generic tweening applied to static elements.

### 12. Use honest abstraction

Do not invent detail merely to make animation richer.

For factual scenes, unsupported mechanics, geometry, numbers, equipment internals, equations, routes, or outcomes must remain abstract or absent.

For narrative or conceptual scenes, abstraction should clarify the intended story rather than imply false literal facts.

Label or govern illustrative constructs where confusion is plausible.

### 13. Review motion in real time and at keyframes

A static screenshot is not enough.

Review:

- the inherited starting boundary;
- first meaningful change;
- intermediate transformation;
- difficult transitions;
- arrival / resolution;
- final hold;
- desktop and mobile when relevant;
- reduced motion when relevant.

Use representative keyframes to catch spatial errors, but always inspect the actual sequence in real time.

### 14. Owner gate: implementation is not approval

Default workflow:

`implement -> verify -> report -> stop for owner visual review`

Do not mark a section approved merely because it renders successfully or passes technical checks.

The owner decides whether the scene feels mature.

### 15. Freeze approved sections before expanding scope

After owner approval:

- record the approved state in governance;
- preserve the chosen visual thesis;
- record exact handoff state;
- create a clean checkpoint commit;
- treat approved upstream work as frozen unless explicitly reopened.

Then continue to the next bounded section.

### 16. Compress only after the long-form logic is mature

When a scene needs a shorter production cut, do not begin by rushing every beat.

First establish a mature long-form sequence where causal / narrative logic is correct.

Then compress by:

- removing redundant holds;
- combining low-information travel;
- preserving key transformations;
- preserving continuity;
- preserving cause before effect;
- retaining moments required for comprehension.

Compression is an editorial pass, not a substitute for solving the animation properly.

### 17. Separate review tooling from production experience

Stepper controls, timeline scrubbers, debug overlays, capture helpers, bounding boxes, labels, inspection HUDs, and developer controls are review tools unless explicitly approved for production.

Do not let temporary tooling silently become part of the final portfolio experience.

---

## Application Profiles

Use the same workflow, but adapt the continuity and causality rules to the scene type.

### Narrative / cinematic animation

Continuity thread may be a person, signal, relationship, opportunity, destination, question, or emotional state.

Use:

- design comparison;
- static composition lock;
- narrative cause before effect;
- future-state-hidden-until-earned;
- bounded story transformations;
- owner review per section.

### Engineering / physical-process animation

Continuity thread is often material, energy, motion, or process state.

Add stricter rules for:

- material continuity;
- ports / paths;
- physically plausible motion;
- downstream-empty state;
- mechanism integrity;
- factual equipment boundaries.

### Data / interface animation

Continuity thread may be a record, metric, query, state, selection, or user action.

Use:

- source -> transformation -> result continuity;
- no result before trigger;
- stable layout hierarchy;
- meaningful state transitions;
- avoid decorative dashboard motion without informational purpose.

### Abstract / brand animation

Continuity thread may be shape, motif, typography, color relationship, field, or camera movement.

Use:

- clear visual thesis;
- composition before motion;
- transformation continuity;
- restrained effects;
- explicit narrative or perceptual purpose for each major motion.

---

## Required Task Structure

A substantial animation task should normally define:

### Authority
What is frozen and what may change?

### Objective
What should the viewer understand or feel?

### Grounding
What facts, references, constraints, or existing decisions govern the scene?

### Design Alternatives
What 2–3 structural visual approaches should be compared before implementation?

### Selected Visual Thesis
What single direction has been chosen and why?

### Static Composition / Geometry Lock
What must be spatially correct before motion begins?

### Continuity Thread
What does the viewer follow through the sequence?

### Scope
What one bounded transformation is being developed now?

### Starting State
What exactly is inherited?

### Ending State
What exact handoff state should exist when this section finishes?

### Do Not Animate Yet
What future states remain forbidden in this pass?

### Choreography
What is the causal / narrative order of events?

### Continuity Rules
How does the protagonist / material / idea remain traceable?

### Motion Review
What timing, easing, spatial, responsive, and real-time checks are required?

### Factual / Interpretive Boundary
Which elements are literal and which are illustrative?

### Verification
What frames, states, and viewports must be inspected?

### Owner Gate
Is the output awaiting owner review or explicitly authorized for automatic freeze?

### Stop Condition
Where must the agent stop?

---

## Default Stop Condition

Unless explicitly overridden:

`Do not freeze automatically. Stop for owner visual review.`

---

## Definition of Mature Animation

Mature animation does **not** mean more effects, more detail, or more movement.

It means:

- the scene has a clear purpose;
- alternatives were considered before expensive implementation;
- geometry and composition are intentional;
- the viewer can follow one coherent thread;
- cause precedes effect;
- future states do not appear early;
- transformations preserve continuity;
- motion reinforces meaning;
- factual and interpretive boundaries are honest;
- difficult transformations are developed in bounded sections;
- real-time motion has been reviewed, not only screenshots;
- approved states are frozen before expansion;
- the final production cut preserves the logic of the mature version.

---

## Canonical Development Loop

For complex animation work, use this loop:

`ground -> compare -> select -> compose -> lock geometry -> define thread -> decompose -> animate -> review -> correct -> owner approve -> freeze -> continue -> integrate -> compress`

This workflow is intentionally universal. Do not force engineering-specific rules onto narrative scenes, and do not weaken physical-causality rules when the scene actually depicts a physical process.

---

## Supersedes

This skill supersedes the earlier repository skill:

`.design/skills/causal-engineering-animation/SKILL.md`

The earlier skill's strongest principles are retained here and generalized for all animation work.