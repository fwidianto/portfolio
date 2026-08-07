# Telegram Codex Controller — Approved Concept A

**Status:** Owner-approved visual direction  
**Concept:** Message Journey Loop  
**Approved by:** Fauzan  
**Date:** 2026-08-07

## Concept thesis

A bounded request enters from Telegram, passes through explicit controller and worker/task boundaries, becomes observable work, reaches a truthful completion/result state, and returns control to the owner.

The chapter must feel like part of the same **Living System Editorial** portfolio while being behaviorally distinct from the Odoo Process Control Tower.

## Approved visual artifact

Use this as the primary frozen visual reference:

`concepts/TELEGRAM_CONCEPT_A_MESSAGE_JOURNEY_LOOP.svg`

The generated exploration board used during concept selection is not the implementation source of truth. The committed SVG intentionally removes unapproved example metrics and freezes only public-safe project meaning.

## Required composition

The Telegram chapter should use:

1. a light editorial chapter surface compatible with the surrounding portfolio;
2. one dominant dark navy controller canvas as the signature visual moment;
3. a clear chapter heading and supporting statement outside or above the controller canvas;
4. a closed-loop path inside the canvas;
5. five primary stages:
   - Telegram — request arrives;
   - Controller — permission and routing;
   - Project Worker — bounded task;
   - Codex Task — run and progress;
   - Result — completion / handoff;
6. an observability strip naming categories rather than invented numbers:
   - Permission;
   - Worker State;
   - Task State;
   - Usage / Model;
   - Completion / Handoff;
7. a clean transition from the existing systems section into this chapter and back into the preserved lower homepage.

## Motion thesis

The core motion is **one closed message journey**.

Preferred behavior:

```text
Telegram request
→ Controller
→ Project Worker
→ Codex Task
→ Result
→ Return to owner / Telegram
```

The primary moving token must derive from the exact same SVG path used for the visible loop whenever technically possible.

The token may use a restrained state change to distinguish request and return, for example:

- blue while work is entering / executing;
- green after a result or completion state;
- then continue along the return segment.

Node state emphasis may reinforce the active stage, but it must not become five unrelated animation systems.

A small bounded recovery cue is allowed only if it remains secondary to the main loop and is grounded in approved controller behavior. Do not turn recovery into a second competing visual narrative.

## Semantic economy

During running motion, the moving token owns direction.

Do not add repeated chevrons or arrows along the forward path merely to restate direction.

For reduced motion, static directional affordance may appear if needed to make the return loop unambiguous.

## Geometry invariants

For the primary loop:

```text
visible connector path
=
animation path
=
one shared SVG geometry source
```

The implementation should prefer a technique such as SVG motion referencing the actual visible path rather than duplicated CSS coordinates.

Required technical checks:

- animated-object center remains on the path;
- controller/worker/task/result node centers intersect or intentionally anchor to the loop geometry;
- loop corners and return segment do not visually drift;
- transform origin / coordinate space is explicit;
- sample approximately 0%, 25%, 50%, 75%, 100%;
- inspect loop reset/wrap;
- repeat at desktop, tablet, and mobile layouts.

Any unavoidable duplicated geometry must be documented and measured.

## Project-specificity

This concept is Telegram-specific because it communicates a **closed owner-control loop** rather than an ERP document lineage.

A visitor should understand within several seconds that:

- a command enters from Telegram;
- a controller validates/routes it;
- work is delegated to a bounded project worker;
- Codex executes as a controlled task;
- progress/state is observable;
- completion returns to the owner.

If the final animation could be relabeled as Odoo without becoming conceptually wrong, the implementation has failed the concept.

## Public-safety constraints

Do not show or invent:

- private chat IDs;
- tokens or credentials;
- usernames;
- real private logs;
- confidential prompts;
- invented success rates, worker counts, queue counts, latency, usage percentages, or other metrics;
- unrestricted shell/keyboard or machine-control behavior.

State labels/categories are allowed where grounded in approved controller truth.

## Responsive intent

### Desktop

Use the full horizontal five-stage loop and return path. The dark controller canvas should read as one deliberate visual object rather than a dashboard full of tiny widgets.

### Tablet

Preserve the closed-loop meaning. The stages may compress or use a two-row/compact arrangement if required, but the visual must remain clearly traceable.

### Mobile

Do not merely shrink the desktop loop until labels become tiny. Recompose into a vertical or staged closed journey while preserving request → controlled work → result → return.

## Reduced motion

The reduced-motion version must remain complete and understandable without the moving token.

Allowed reduced-motion cues:

- numbered/ordered stages;
- clear return-path label;
- one restrained arrow/marker on the return path if needed;
- static state emphasis.

Do not leave hidden moving objects as the only source of meaning.

## Fidelity boundary

Once implementation begins, Ariadne is implementing this concept, not designing a new one.

Material changes to:

- the closed-loop thesis;
- stage count/meaning;
- dark signature canvas;
- geometry model;
- visual hierarchy;
- project-specific motion behavior;

require owner/orchestrator approval rather than silent reinterpretation.
