# Ariadne Shared Frontend Specialist Pilot

**Status:** Runtime profiles prepared; discovery and execution not yet tested  
**Formal role:** Shared Frontend & Visualization Specialist  
**Codename:** Ariadne  
**Primary skill:** `shared-frontend-visualization-specialist`  
**OpenCode agent:** `@ariadne`  
**Branch:** `agent/portfolio-skill-experiment`

## Purpose

Test whether Ariadne can execute the already approved representative homepage task with less drift, clearer stopping behavior, and better visible evidence than a normal general-agent run.

This pilot does not authorize a full homepage redesign, deployment, merge, correction cycle, or continuation into another milestone.

The codename is a human-facing label only. It does not change authority, permissions, model selection, or the formal specialist role.

## Runtime choice

Use exactly one runtime for the first implementation attempt.

### Option A — OpenCode named subagent

From the repository root on the approved branch or isolated worktree:

1. Record `opencode --version`.
2. Start OpenCode with the approved Builder-tier model selected in the primary session.
3. Confirm `@ariadne` appears in agent autocomplete.
4. Invoke:

```text
@ariadne
Read `.design/homepage-v2-skill-experiment/SHARED_SPECIALIST_PILOT.md` and execute only its delegation packet.
```

The project-scoped profile is:

```text
.opencode/agents/ariadne.md
```

Ariadne inherits the invoking primary agent's model. Do not change provider or escalate to a Deep-tier model inside the run. Return control first.

### Option B — Manual Codex adapter

From a new Codex session opened at the repository root on the approved branch or isolated worktree:

```text
$shared-frontend-visualization-specialist

Act as Ariadne, the Frontend & Visualization Specialist. The codename is only a human-facing label; do not roleplay.

Read `AGENTS.md` and every document in its Read First list.
Then read:
- `.design/homepage-v2-skill-experiment/DESIGN_BRIEF.md`
- `.design/homepage-v2-skill-experiment/SHARED_SPECIALIST_PILOT.md`

Execute only the delegation packet below.
Do not choose another milestone, call another specialist, broaden scope, deploy, merge, commit, push, or independently approve your own work.
```

Record the Codex surface, selected model, and reasoning setting when visible.

## Delegation packet

```text
Project:
Portfolio Website

Current state:
The live portfolio remains unchanged. The isolated experiment branch contains an approved representative brief, repository guardrails, a shared role skill, and draft Ariadne runtime profiles. No new homepage implementation exists yet. The current architecture is static HTML, CSS, and JavaScript.

One bounded visual outcome:
Implement one representative homepage surface that clearly communicates Fauzan as an Analytical Systems Builder through structure and visible system logic.

Target screen, route, or component:
The homepage only:
- existing navigation;
- first viewport;
- visible transition into the two featured systems.

Exact viewport or device when relevant:
- desktop: 1440 x 900;
- tablet: 768 x 1024;
- mobile: 390 x 844.

Authoritative visual baseline:
1. `AGENTS.md`;
2. `docs/design/homepage-v2-representative-experiment.md`;
3. `.design/homepage-v2-skill-experiment/DESIGN_BRIEF.md`;
4. the current rendered homepage and existing static implementation.

Confirmed business rules and terminology:
- identity: Fauzan Widianto / Analytical Systems Builder;
- visible progression: Analyze -> Structure -> Connect -> Build;
- project statement: Two systems, one way of thinking.;
- featured system 1: Odoo Process Control Tower;
- featured system 2: Telegram Codex Controller;
- do not invent claims, metrics, projects, outcomes, or employers.

Relevant files or components:
Expected writable files:
- `index.html`;
- `CSS/main.css`.
An existing JavaScript file may be edited only after approval and only when necessary for approved motion or behavior.

Elements that must remain unchanged:
- static HTML, CSS, and JavaScript architecture;
- existing navigation destinations and labels;
- access to Download CV, LinkedIn, and GitHub;
- current live deployment and analytics;
- unrelated homepage sections and all project detail pages;
- public-safe factual boundaries.

Allowed reference influence:
Use the approved Living System Editorial direction, Mist Blue + Slate + Soft Coral palette family, precise systems visualization, purposeful whitespace, and restrained motion that explains sequence or connection.

Explicit non-scope:
- no React, Next.js, Vite, framework, or build system;
- no dark mode or theme toggle;
- no full-site redesign;
- no extra or supporting projects;
- no generic bento grid, control-room, game-map, terminal, or AI-node treatment;
- no deployment, commit, push, merge, or propagation to other pages;
- no unrelated cleanup or refactoring;
- no other specialist or subagent calls;
- no independent reviewer pass by the implementing specialist;
- no automatic model escalation or provider switch.

Required rendered states:
- desktop 1440 x 900;
- tablet 768 x 1024;
- mobile 390 x 844;
- one keyboard-focus state;
- reduced-motion equivalent;
- stable no-animation state after motion settles.

Validation required:
- inspect `git status --short` before editing and stop for unexpected changes;
- verify only the bounded files and surface changed;
- run the page through a local static server;
- check navigation and actions;
- check no horizontal overflow at all three viewports;
- check console for blocking errors;
- verify keyboard focus and reduced motion;
- capture rendered evidence for all required states;
- report Technical, Visual, and Behavior status separately.

Owner acceptance path:
Fauzan opens the local homepage and reviews no more than three checks:
1. first five-second identity and value impression;
2. visible Analyze -> Structure -> Connect -> Build progression and transition into both systems;
3. desktop, tablet, and mobile preservation of the same narrative.

Stop condition:
Stop when the bounded representative surface is locally implemented and rendered evidence is ready. Leave the work unmerged and undeployed for Fauzan's review. Do not begin a correction pass, design review, provider switch, or next task without a new routing decision.
```

## Provider or model failure

A transient failure may be retried no more than twice after inspecting side effects.

For capacity or usage exhaustion:

1. stop the active run;
2. inspect the diff and rendered evidence already produced;
3. record the fallback checkpoint below;
4. return control to the orchestrator;
5. do not silently continue through another provider.

```text
Original objective:
Runtime and model:
Branch, commit, and workspace:
Files changed:
Commands and tests run:
Rendered states captured:
Observed side effects:
Open assumptions:
Remaining work:
Reason for provider switch:
Required revalidation:
```

## Pilot measurement

Record after the run in the existing `EXPERIMENT_LOG.md`:

- runtime adapter: OpenCode Ariadne or manual Codex Ariadne;
- runtime version or surface;
- model and reasoning level;
- elapsed runtime;
- token or usage information available;
- permission prompts and denials;
- skills loaded;
- changed files;
- number of clarification or correction prompts;
- scope drift found;
- whether rendered evidence was complete;
- whether the completion report followed the role skill;
- owner intervention required;
- fallback or provider switch, if any;
- keep, modify, or reject recommendation for Ariadne.

Do not create another experiment log.
