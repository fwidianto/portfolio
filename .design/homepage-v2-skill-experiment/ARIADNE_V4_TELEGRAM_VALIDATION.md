# Ariadne V4 — Telegram Codex Controller Validation

**Status:** Approved bounded validation task; concept gate first  
**Purpose:** Validate the consolidated Ariadne methodology after v1–v3. This is not approval to redesign or propagate the full homepage.

## Why this task

V1–v3 improved workflow discipline and parts of the portfolio, but persistent gaps remained:

- small geometry defects survived technical checks;
- the tested Builder route had no image vision;
- project-specific motion remained too obvious/generic;
- the builder converged too quickly on one concept;
- concept-to-render fidelity was not exercised against a frozen visual target.

The Telegram Codex Controller is deliberately chosen because its identity differs from Odoo Process Control Tower. Ariadne must prove it can create a second project-specific visual language inside the same portfolio system rather than reusing the Odoo document-flow motif.

## Runtime route for this validation

This remains **one Ariadne task** coordinated by the Global Orchestrator. It does not create a frontend sub-orchestrator.

```text
Phase A — concept / visual direction
vision-capable model or visual-generation tool
→ 3 genuinely different concepts
→ Fauzan selects one

Phase B — implementation
Ariadne Builder model
→ implement accepted concept only

Phase C — deterministic geometry QA
browser / DOM / SVG / path checks
→ prove geometric invariants

Phase D — fresh visual review
vision-capable model or Fauzan
→ direct screenshot inspection + fidelity ledger

Phase E — one bounded correction
Ariadne Builder
→ fix approved findings
→ final render
→ Fauzan
```

No model or provider may be switched silently. Record the model/tool used for each phase when available.

## Current starting point

The isolated local worktree contains the uncommitted v1–v3 implementation in `index.html` and `CSS/main.css`.

Preserve it exactly until the concept gate is approved.

The remote experiment branch contains methodology/instruction files only. Do not reset, stash, discard, clean, overwrite, or replace the local v1–v3 implementation.

## Active visual scope

The new representative surface is:

```text
existing systems transition
→ Telegram Codex Controller representative chapter
→ local transition back into the preserved lower homepage
```

The chapter should be large enough to judge as a real narrative section, roughly one major desktop screen or the amount of space genuinely required by the approved concept.

The task may make a **small continuity adjustment** at the existing systems transition if required to enter the Telegram chapter cleanly. It must not redesign the hero or Odoo chapter merely for convenience.

## Protected areas

Do not redesign or propagate changes through:

- hero / identity except an explicitly approved continuity fix;
- Odoo Process Control Tower chapter except an explicitly approved continuity fix;
- Professional Experience;
- Business Outputs;
- Thinking;
- skills evolution;
- Website Updates;
- Contact;
- footer;
- project detail pages;
- analytics / SEO / deployment;
- unrelated assets or scripts.

No framework migration. No new dependency by default.

## Approved Telegram Codex Controller truth

Use only public-safe facts already established by the project. The representative chapter may draw from these truths:

- a Python controller receives Telegram commands through long polling;
- the controller owns its Codex App Server connection over stdio;
- the system deliberately avoids inbound webhooks / inbound control ports;
- arbitrary shell and keyboard automation are outside the controller architecture;
- work is organized around bounded project workers rather than uncontrolled global execution;
- worker/task state is explicit and observable;
- queueing, deduplication, concurrency bounds, persistence, and safe restart are important behaviors;
- permissions are explicit and owner-visible;
- model selection, status, result, usage, completion reporting, and handoff are observable controller functions;
- transient startup / polling / stream failures require bounded retry or recovery rather than silent infinite retry;
- control ultimately returns to Fauzan.

Do not expose private chat IDs, tokens, credentials, private usernames, unrestricted machine-control interfaces, private logs, or confidential prompts.

If the concept needs a controller fact not established above or in an approved project authority, stop and request confirmation rather than inventing it.

# GATE 1 — Concept & Creative Direction

Load:

`.agents/skills/shared-frontend-visualization-specialist/methods/CONCEPT_AND_CREATIVE_DIRECTION.md`

**No production HTML/CSS implementation before this gate is owner-approved.**

## Concept brief

Create a Telegram chapter that communicates:

> Bounded AI-assisted work can be controlled, observed, recovered, and returned to the owner rather than becoming an invisible autonomous process.

The visual should feel like the same Living System Editorial portfolio, but the **behavioral identity must be Telegram/controller-specific**.

### Project-specificity test

The concept must not be a recolored version of the Odoo document journey.

Ask:

```text
If the project title disappeared,
would this motion still suggest
request → permission/control → worker/task → observable state → completion/return?
```

If not, reject the concept.

## Required divergence

Produce **at least 3 genuinely different visual/motion concepts** before selecting one.

Do not submit three color variants of the same diagram.

Useful identity axes to explore include, but are not limited to:

- **Command / return loop:** a request enters from Telegram, passes through controller/permission/task states, then returns as a completion/result.
- **Control-room state choreography:** project workers, active/idle/queued states, permission gates, and bounded concurrency become visible as a changing operational surface.
- **Recovery / resumability narrative:** a task encounters an interruption, preserves state, retries/reconnects within bounds, and returns a truthful completion or blocked state.

These are prompts for divergence, not mandatory layouts. Ariadne may propose a stronger truthful concept.

For each concept report:

```text
Name:
One-sentence visual thesis:
What moves:
What changes state:
What branches / waits / returns:
What the visitor learns in 5–10 seconds:
Why this would be wrong for Odoo:
How continuous motion is used:
Reduced-motion equivalent:
Geometry risk:
Implementation complexity:
```

## Concept artifact

A textual description alone is not sufficient for approval.

Produce a visual concept artifact using an available vision/design-generation path. Preferred order:

1. generated visual concept / mockup;
2. high-fidelity visual prototype or concept board;
3. another owner-visible visual artifact explicitly approved by Fauzan.

The artifact should show the complete approved Telegram chapter, not only one icon or isolated animation frame.

Fauzan selects or rejects the concept before implementation.

# GATE 2 — Geometry & Motion QA

After concept approval and implementation, load:

`.agents/skills/shared-frontend-visualization-specialist/methods/GEOMETRY_AND_MOTION_QA.md`

For every path-following signal, token, cursor, rail, connector, loop, queue path, or state transition:

```text
visible path
=
animation path
=
shared geometry source
```

whenever technically possible.

## Required geometry evidence

For each material animated path:

- identify the geometry source;
- identify the animated object center/reference point;
- confirm transform origin / coordinate space;
- sample at approximately 0%, 25%, 50%, 75%, and 100%;
- inspect loop/reset behavior;
- inspect desktop, tablet, and mobile variants;
- report maximum observed deviation when a numeric measurement is practical;
- if duplicated coordinates are unavoidable, explain why and how drift is prevented.

A line and pointer being separately `close enough` is not a pass.

Geometry QA is technical QA. It does not replace optical review.

# GATE 3 — Genuine Vision Review

For this validation:

```text
No genuine rendered-image inspection
= Visual review BLOCKED
```

Do not substitute PIL density, DOM rectangles, computed styles, or coordinate measurements for visual judgment.

Capture at minimum:

- desktop chapter at `1440 × 900` or a composition-native desktop viewport;
- tablet `768 × 1024`;
- mobile `390 × 844`;
- at least 3 meaningful motion states or a short recording/GIF when feasible;
- reduced-motion state;
- one interaction/focus state when the concept includes interaction.

A fresh vision-capable reviewer or Fauzan must inspect the images themselves.

# GATE 4 — Concept / Render Fidelity

Load:

`.agents/skills/shared-frontend-visualization-specialist/methods/VISUAL_FIDELITY_REVIEW.md`

Compare the owner-approved concept artifact directly with the latest browser render.

Keep a mismatch ledger with at least five concrete comparison points covering applicable items such as:

- macro composition;
- typography hierarchy;
- spacing and density;
- path / node geometry;
- icon/media treatment;
- surface contrast;
- motion behavior;
- responsive adaptation;
- section continuity.

Each mismatch receives one disposition:

- `FIX`;
- `INTENTIONAL DEVIATION`;
- `BLOCKED`.

One bounded correction pass is authorised after the fresh visual review. No second correction loop without Fauzan.

## Implementation constraints

- Continue the existing static HTML/CSS/JavaScript architecture.
- Prefer semantic HTML + CSS/SVG for the concept where sufficient.
- JavaScript is allowed only when the approved concept genuinely needs state/interaction/path behavior that is materially weaker or more fragile in HTML/CSS/SVG alone. Before editing JavaScript, state the exact behavior and why it is needed.
- No dependency installation without explicit approval.
- Do not invent new public claims merely to support a visual.
- Do not copy the Odoo traceable-document visual and rename its nodes.

## Validation baseline

In addition to the four gates:

- working tree and branch checked before editing;
- changed-file/scope review;
- no horizontal overflow;
- keyboard focus where interactive;
- touch targets where relevant;
- reduced-motion meaning preserved;
- no blocking console errors;
- local preview only;
- no commit/push/merge/deploy during the validation run unless Fauzan separately authorizes it.

## Completion report

```text
Outcome:
Concepts generated:
Concept selected by Fauzan:
Why selected concept is Telegram-specific:
Models/tools used by phase:
Changed files:
Protected areas unchanged:
Geometry sources and congruence evidence:
Vision reviewer used:
Screenshots / motion evidence reviewed:
Fidelity mismatch ledger:
Correction pass changes:
Scope drift: YES / NO
Status:
- Concept gate: PASS / BLOCKED
- Implementation: YES / PARTIAL / NO
- Geometry gate: PASS / BLOCKED
- Vision gate: PASS / BLOCKED
- Fidelity gate: PASS / BLOCKED
- Technical: COMPLETE / PARTIAL / BLOCKED
- Visual: UNVERIFIED until Fauzan final review
- Behavior: UNVERIFIED until Fauzan final review
Known limitations:
Stop condition reached: YES / NO
```

## Stop conditions

Stop immediately when:

- no owner-approved concept exists before implementation;
- a required controller fact is unclear;
- the local v1–v3 evidence cannot be preserved safely;
- an animated path cannot meet the geometry gate without an unapproved architecture/dependency change;
- genuine vision review is unavailable after implementation;
- a second subjective correction loop would be required;
- work would expand into the protected homepage or deployment scope.

## Owner acceptance questions

Fauzan judges:

1. Does the Telegram visual feel meaningfully different from Odoo while still belonging to the same portfolio?
2. Does the animation teach control, observability, bounded execution, or recovery rather than merely looking active?
3. Are all moving objects visibly and technically attached to the geometry they claim to follow?
4. Does the implementation match the approved concept closely enough that remaining differences are intentional rather than accidental?
5. Did the new Ariadne methodology catch defects that v1–v3 would probably have missed?
