# External Frontend Skill Selection

Status: Frozen tool-selection decision / pre-development checkpoint

Date: 2026-08-02

This document completes Phase 3 of the Living System portfolio renewal. It records which external frontend skills will be tested, why they were selected, and which parts of larger skill suites will not be adopted.

## Goal

Test whether a mature third-party frontend skill can improve design quality and reduce drift while preserving:

- the existing static HTML/CSS architecture;
- the Analytical Systems Builder positioning;
- the mature Living System direction;
- the two-project public content boundary;
- local review before any public deployment;
- one representative implementation slice at a time.

The experiment is not intended to rebuild the website with a new framework or install a large autonomous design system.

## Candidates Reviewed

### Anthropic `frontend-design`

Source:

`anthropics/skills/skills/frontend-design`

Strengths:

- concise and widely used;
- supports HTML/CSS and existing-interface reshaping;
- explicitly rejects generic AI aesthetics;
- requires subject-specific direction, typography, palette, and one memorable signature;
- encourages self-critique and screenshots.

Risks for this project:

- prioritises distinctive creative choices and aesthetic risk;
- does not require an explicit owner approval gate before implementation;
- screenshot review is encouraged rather than a mandatory structured process;
- could move too quickly from internal planning into code.

Decision:

Not selected for the first experiment. It remains a useful reference for originality and restraint.

### Joshua D. Thomas `frontend-design-principles`

Source:

`joshuadavidthomas/agent-skills/frontend-design-principles`

Strengths:

- explicitly requires intent, domain, colour world, signature, and defaults to reject;
- requires direction confirmation before code;
- routes public websites to a dedicated marketing guide;
- strongly resists generic component and card-grid defaults;
- compatible with static sites.

Risks for this project:

- the marketing guide favours bold and memorable treatment, which may need stronger repository guardrails to remain mature and business-oriented;
- it has no complete mandatory browser-capture and review workflow;
- the repository and workflow are smaller and less end-to-end than the selected option.

Decision:

Not selected as the main implementation skill. Some of its pre-code questions may inform the experiment brief.

### Julian Oczkowski `designer-skills`

Source:

`julianoczkowski/designer-skills`

Strengths:

- inspects the existing codebase, CSS variables, fonts, layout conventions, components, and dependencies before coding;
- requires an explicit aesthetic direction;
- supports static HTML/CSS and does not require React or Vite;
- provides concrete named design philosophies, including Editorial / Magazine, Dieter Rams, Swiss, and Japanese Minimalism;
- requires mobile-first implementation and responsive adaptation;
- includes a separate `design-review` skill with mandatory screenshots of the running application;
- reviews desktop, tablet, mobile, hierarchy, spacing, typography, responsiveness, interactions, and accessibility;
- measures the result against the design brief rather than code completion alone.

Risks for this project:

- the complete eight-skill flow creates more documents and process than this experiment needs;
- its frontend skill adds dark mode by default when no design-token file exists;
- some named philosophies could produce a disconnected redesign if used without portfolio-specific rules;
- its review workflow may create screenshot and design-document folders that must remain local until approved.

Decision:

Selected, with intentionally limited installation and explicit repository overrides.

### OpenAI `frontend-app-builder`

Source:

`openai/plugins/plugins/build-web-apps/skills/frontend-app-builder`

Strengths:

- strongest concept-first and fidelity-driven workflow among the reviewed options;
- requires visual concepts before coding;
- treats the approved concept as an exact implementation specification;
- requires browser verification and direct screenshot comparison.

Reason not selected for this experiment:

- it is already available as an installed OpenAI capability rather than the external third-party test the owner requested;
- it defaults to a larger image-generation workflow that may be heavier than needed for the first representative slice;
- using it would not cleanly answer whether a third-party `SKILL.md` improves the workflow.

Decision:

Retain as a later benchmark, not the first tested skill.

## Selected Skills

Install only these two skills from `julianoczkowski/designer-skills`:

1. `frontend-design`
2. `design-review`

Do not install or invoke the full `design-flow` for the first experiment.

Do not install the other skills unless a later review shows they solve a real missing need.

## Why Two Skills

The two selected skills have separate responsibilities:

```text
frontend-design
= inspect the existing site and implement the approved visual direction

design-review
= run the website locally, capture responsive screenshots, and critique the rendered result
```

This separation lets us evaluate both creation quality and review discipline.

## Required Overrides

The repository `AGENTS.md` must override the following defaults before either skill is used:

- no automatic dark mode or theme toggle;
- no framework migration;
- no full-site redesign;
- no invented projects, metrics, outcomes, clients, or claims;
- no generic developer or AI portfolio styling;
- no large project grid;
- no production-page edits during the experiment;
- use only the two approved featured projects;
- use the mature Living System direction;
- preserve the business-first story;
- implement one representative slice and stop;
- keep design artifacts and screenshots local until owner approval.

## Aesthetic Starting Point

The first concept should not select a philosophy blindly.

The likely starting combination is:

```text
Editorial / Magazine structure
+ Dieter Rams restraint
+ Systems Canvas signature interaction
```

This is a working interpretation of the approved Living System direction, not permission to implement before concept approval.

Avoid defaulting to:

- dark mode;
- neon AI styling;
- generic editorial newspaper styling;
- oversized decorative serif typography without business purpose;
- bento grids;
- excessive motion;
- glassmorphism;
- a literal game-like world map.

## Installation Boundary

Selection does not yet authorise installation or frontend changes.

The skills should be installed only after Phase 4 creates and approves a compact repository `AGENTS.md`.

Installation should be limited to the intended agent environment or isolated experiment branch/worktree. Do not copy third-party skills into public website content.

## Evaluation Criteria

After the first representative slice, evaluate:

1. Did the skill preserve existing code and architecture?
2. Did it follow the approved direction rather than improvise a new identity?
3. Did it avoid invented content?
4. Did the local browser result match the approved concept?
5. Did desktop, tablet, and mobile behave intentionally?
6. How much correction was required?
7. Did the process reduce drift compared with previous frontend work?
8. Was the workflow proportionate to the small task?

## Phase Status

- Phase 1 — Living System direction: complete.
- Phase 2 — Public content curation: complete.
- Phase 3 — External frontend skill selection: complete.
- Phase 4 — Review and create repository guardrails in `AGENTS.md`: next.
