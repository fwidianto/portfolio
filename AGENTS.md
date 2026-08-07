# Portfolio Agent Guardrails

This file contains mandatory operating rules for AI agents working in this repository.

## Read First

Before proposing or changing portfolio design, content, or frontend code, read:

1. `docs/README.md`
2. `docs/homepage/HOMEPAGE_V1_FREEZE.md`
3. `docs/design/living-system-portfolio-direction.md`
4. `docs/design/analytical-systems-builder-identity-lens.md`
5. `docs/design/public-content-curation.md`
6. `docs/design/frontend-skill-selection.md`
7. `docs/design/homepage-v2-representative-experiment.md`

For the active Ariadne v3 experiment also read:

8. `.design/homepage-v2-skill-experiment/ARIADNE_V3_PROJECT_IDENTITY_PILOT.md`

Read additional documents only when relevant to the exact task.

## Professional Identity

The portfolio identity is:

```text
Analytical Systems Builder
```

This is not merely a title. Every public concept must communicate:

```text
Analytical
= investigate complexity, validate evidence, and structure ambiguity

Systems
= understand flows, dependencies, handoffs, and end-to-end consequences

Builder
= turn that understanding into useful tools, workflows, interfaces, and operating systems
```

The portfolio should make this sequence visible:

```text
messy reality
-> structured understanding
-> connected system
-> usable outcome
```

A visitor should infer this identity from the experience even if the title were hidden.

Do not present Fauzan as:

- a pure software developer;
- a generic data analyst or dashboard builder;
- a flashy AI engineer;
- an autonomous-agent expert without evidence;
- a consultant using abstract language without built outcomes;
- a collection of disconnected projects.

## Story Order

Use this order in public narratives:

```text
Business problem
-> process understanding
-> business logic
-> technology
-> evidence
```

Do not lead with tools, frameworks, AI terminology, or decorative metrics when the business problem is what makes the work meaningful.

## Mandatory Identity Test

Every concept, interaction, and implementation must pass all three dimensions.

### Analytical

- The problem-solving value is understandable quickly.
- Hierarchy reveals reasoning rather than decoration.
- Claims and evidence are credible and supported.

### Systems

- Sections and projects feel connected rather than assembled randomly.
- Relationships, flow, ownership, or sequence are visible where useful.
- Responsive changes preserve system logic.

### Builder

- Analysis clearly leads to a practical outcome.
- Projects appear as functioning systems, not abstract interests.
- The visitor has a clear route toward evidence of what was built.

If one dimension is weak, the concept is not approved.

## Living System Direction

The approved renewal direction is a mature **Living System**:

```text
Editorial / Casebook foundation
+ Systems Canvas for relationships and flow
+ purposeful systems motion
+ intentional responsive adaptation
```

The likely design interpretation is:

```text
Living System Editorial as the base
+ selected Living World connection cues
```

The editorial foundation protects clarity and professional credibility. Connection cues should make systems thinking visible without becoming a literal world map or game interface.

Avoid:

- dark neon AI styling;
- automatic dark mode or theme toggles;
- glassmorphism;
- bento-grid defaults;
- generic project-card walls;
- decorative charts or unsupported metrics;
- terminal or code-editor imagery as the main identity;
- excessive gradients, glow, parallax, or floating widgets that compete with reading;
- literal game maps, futuristic control rooms, or theme-park interpretations;
- visual spectacle that weakens business clarity.

## Motion Rules

Motion may be one-shot, interactive, state-driven, or continuous when it supports the approved experience.

Motion is useful when it communicates or creates:

- sequence;
- connection;
- state;
- direction;
- cause and effect;
- progression toward a usable result;
- ambient liveliness that makes a system feel active rather than frozen.

Continuous motion is allowed when it remains visually calm and supports atmosphere, system flow, connection, or state.

### Semantic economy

Do not repeat the same meaning through static and animated cues without a reason.

If motion already makes direction obvious, remove static arrows, chevrons, or `next` markers unless they add a second meaning or remain necessary in reduced-motion mode.

Every visible cue should answer:

```text
What information does this add that is not already clear?
```

If the answer is `none`, remove it.

### Project-specific motion

Featured-project motion should teach something about that specific system.

Do not use generic `system activity` animation that could be copied unchanged between Odoo Process Control Tower and Telegram Codex Controller.

Prefer motion derived from real approved behavior, such as document traceability, lifecycle state, branching/convergence, controller request flow, or another genuine system relationship.

Support `prefers-reduced-motion` and preserve the same meaning in the reduced-motion state.

## Perceptual Contrast

Important words and controls must be discoverable at normal attention, not merely technically present.

- white or near-white buttons must not disappear into light backgrounds;
- primary and secondary actions must have perceptible hierarchy;
- small text and metadata must remain readable without pixel-peeping;
- borders, fills, shadows, and text weights should create enough surface separation;
- hover/focus states must not be the only way a user discovers interactivity.

Numeric accessibility checks are necessary where applicable, but are not a substitute for perceptual legibility.

## Responsive Rules

Responsiveness must preserve meaning rather than merely shrink desktop.

- Desktop may show the full relationship between identity and the systems narrative.
- Tablet requires an intentional intermediate composition.
- Mobile becomes a clear vertical narrative: identity -> value -> systems -> evidence.
- Complex paths must simplify into a vertical rail or staged reveal without becoming a stack of generic cards.
- Touch targets, reading order, line length, and actions must remain intentional.

## Approved Public Projects

Use only these two featured projects unless the owner explicitly changes the curation:

1. **Odoo Process Control Tower**
   - The evolved form of the earlier Odoo ERP Analytics project.
   - Treat both names as one project, never separate entries.
   - Proves ERP analysis, connected operating flow, and a practical visibility/control system.

2. **Telegram Codex Controller**
   - A bounded AI-workflow control and observability system.
   - Emphasise architecture, permissions, project isolation, task lifecycle, testing, and practical operation.

Together they should communicate:

```text
business operating systems
+
AI-assisted work systems
=
Analytical Systems Builder
```

There is no supporting project layer for now.

Do not add project cards or public links for Personal OS, MCU Vault, HS Code automation, AI ERP Intelligence Dashboard, Investment Analytics Dashboard, separate agent orchestration experiments, or unfinished prototypes unless explicitly promoted.

Professional experience may mention factual reporting, profitability, ERP, and automation work. Do not repackage those facts as invented standalone products.

## Content Integrity

Never invent or exaggerate:

- projects, clients, or employers;
- metrics, financial outcomes, user counts, or performance improvements;
- technical sophistication or completion status;
- test results or product maturity.

Use public-safe, supported evidence only.

Never expose:

- company-confidential records or real ERP transactions;
- credentials, tokens, chat IDs, secrets, or private usernames;
- private prompts, logs, repositories, or Personal OS content;
- unnecessary sensitive local paths;
- unrestricted machine-control interfaces.

## Architecture Boundary

The current site is static HTML, CSS, and JavaScript.

- Continue from the existing implementation.
- Reuse existing assets, variables, components, and conventions where appropriate.
- Do not migrate to React, Vite, Next.js, another framework, or another deployment model without explicit approval.
- Do not add dependencies for effects that can be implemented cleanly in the current architecture.
- Change the smallest number of files required for the approved visible outcome.

## External Frontend Skills

The selected third-party skills are:

- `frontend-design`
- `design-review`

from `julianoczkowski/designer-skills`.

This file overrides conflicting skill defaults. In particular:

- no automatic dark mode;
- no invented content;
- no extra project layer;
- no coding beyond the approved surface;
- no committed temporary screenshots or QA artifacts unless requested.

The skills provide design and review methodology. They do not control identity, claims, project selection, architecture, or scope.

## Approval Gates

For meaningful visual work, follow:

```text
Inspect existing implementation and previous rendered evidence
-> define one bounded outcome
-> establish macro composition and project-specific motion concept
-> implement locally
-> capture desktop, tablet, and mobile evidence
-> apply explicit owner feedback
-> use genuine screenshot critique only when image vision exists
-> owner reviews locally
-> expand only after explicit approval
```

A successful build, valid HTML, aligned DOM coordinates, absence of console errors, or pixel-density measurement is not visual approval.

When the implementation model has no image vision, do not pretend geometry analysis is equivalent to seeing the screenshot. Report that limitation and return final optical judgment to Fauzan or a fresh vision-capable reviewer.

## Experiment History and Active Scope

### Ariadne v1 — completed local pilot

V1 successfully tested bounded execution, runtime invocation, responsive evidence, and stopping behavior. Owner review found the visual composition and micro-geometry insufficiently mature for propagation.

### Ariadne v2 — completed local pilot

V2 expanded the experiment to:

```text
existing navigation
+ hero / identity
+ systems transition
+ one full representative Odoo Process Control Tower chapter
```

Owner review found the result materially more mature and much more lively than v1. Continuous animation was a clear improvement. V2 also proved that the same Builder model could produce a substantially better result after improving the specialist workflow.

Remaining owner feedback:

- static arrows/chevrons can be redundant when animated flow already communicates direction;
- project animations should express the featured project's identity instead of generic systems motion;
- white/near-white controls on light backgrounds need stronger perceptual contrast;
- the lower half of the homepage remains intentionally outside the new visual language for now.

### Ariadne v3 — active bounded refinement

The active task is:

`.design/homepage-v2-skill-experiment/ARIADNE_V3_PROJECT_IDENTITY_PILOT.md`

The active visual surface remains:

```text
existing navigation
+ hero / identity
+ systems transition
+ Odoo Process Control Tower representative chapter
```

V3 is a refinement of the successful v2 direction, not another broad redesign.

Allowed:

- remove redundant static direction cues when animation already communicates the same meaning;
- preserve static direction only where reduced-motion comprehension genuinely needs it;
- create one Odoo-specific animated 2D/SVG/system visual based on real public-safe document/process relationships;
- strengthen control and text contrast inside the active surface;
- preserve the v2 composition and liveliness unless owner feedback justifies a change;
- use JavaScript only when HTML/CSS/SVG cannot deliver the approved interaction cleanly and the task packet's approval gate is satisfied;
- run local browser rendering and responsive/motion validation.

Not allowed:

- redesigning the remaining homepage sections;
- propagating the new language through Experience, Skills, Thinking, Contact, footer, or project detail pages;
- building the Telegram Codex Controller chapter;
- adding supporting projects;
- installing a framework or new dependency;
- modifying or deploying the public site;
- inventing claims, metrics, outcomes, or confidential evidence;
- treating Ariadne's own output as owner approval.

## Local Review

Minimum viewports:

- desktop: approximately `1440 x 900`;
- tablet: approximately `768 x 1024`;
- mobile: approximately `390 x 844`.

Review:

- Analytical clarity;
- Systems coherence;
- Builder evidence;
- professional credibility;
- composition continuity across hero -> transition -> Odoo chapter;
- semantic economy and removal of redundant cues;
- Odoo-specificity of the project motion;
- perceptual contrast and control discoverability;
- hierarchy, typography, spacing, and density rhythm;
- responsive preservation of meaning;
- motion purpose, liveliness, and reduced-motion behaviour;
- public safety.

## Completion Standard

A scoped v3 task is complete only when:

- owner feedback on redundant direction cues is addressed;
- one Odoo-specific motion/visual identity is implemented without invented process claims;
- important controls in the active surface are perceptually discoverable;
- desktop, tablet, and mobile were validated;
- motion and reduced-motion states were validated;
- no unrelated page or feature changed;
- no invented or confidential content appears;
- changed files and intentional non-changes are reported;
- visual critique capability is stated honestly;
- the agent stops at the approved boundary.

When novelty conflicts with identity, preserve the identity.

When interaction complexity conflicts with clarity, simplify the interaction.

When uncertain between another internal refinement loop and owner review, stop and return the result to Fauzan.
