# Portfolio Agent Guardrails

This file contains the mandatory operating rules for AI agents working in this repository.

## Read First

Before proposing or changing portfolio design, content, or frontend code, read:

1. `docs/README.md`
2. `docs/homepage/HOMEPAGE_V1_FREEZE.md`
3. `docs/design/living-system-portfolio-direction.md`
4. `docs/design/public-content-curation.md`
5. `docs/design/frontend-skill-selection.md`

Read additional documents only when they are relevant to the exact task.

## Professional Identity

The portfolio identity is:

```text
Analytical Systems Builder
```

Core positioning:

```text
From problems and data to system design, insights, and AI-powered workflows.
```

Present Fauzan as someone who understands business and operational problems, structures process and data logic, builds useful reporting and workflows, and uses AI-assisted development with human judgment.

Do not present Fauzan as:

- a pure software developer;
- a generic dashboard builder;
- a flashy AI engineer;
- an autonomous-agent expert without evidence;
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

Do not lead with tools, frameworks, or AI terminology when the business problem is the real reason the work matters.

## Living System Direction

The approved renewal direction is a mature **Living System**:

- Editorial / Casebook foundation;
- Systems Canvas for relationships, flows, and reasoning;
- restrained interaction and motion;
- calm, professional, readable, and quietly distinctive;
- business-oriented rather than developer-template-like.

Avoid:

- dark neon AI styling;
- automatic dark mode or theme toggles;
- glassmorphism;
- bento-grid defaults;
- excessive gradients, glow, animation, or floating widgets;
- literal game maps or theme-park interpretations;
- generic newspaper styling;
- visual spectacle that weakens business clarity.

## Approved Public Projects

Use only these two featured projects unless the owner explicitly changes the curation:

1. **Odoo Process Control Tower**
   - This is the evolved form of the earlier Odoo ERP Analytics project.
   - Treat them as one project, never as separate portfolio entries.

2. **Telegram Codex Controller**
   - Present it as a bounded AI-workflow control and observability system.
   - Emphasise architecture, permissions, project isolation, task lifecycle, testing, and practical use.

There is no supporting project layer for now.

Do not add project cards or public links for Personal OS, MCU Vault, HS Code automation, AI ERP Intelligence Dashboard, Investment Analytics Dashboard, separate agent orchestration experiments, or unfinished prototypes unless the owner explicitly promotes them.

Professional experience may still mention factual reporting, profitability, ERP, and automation work. Do not repackage those facts as invented standalone products.

## Content Integrity

Never invent or exaggerate:

- projects;
- clients;
- employers;
- metrics;
- financial outcomes;
- user counts;
- performance improvements;
- technical sophistication;
- test results;
- completion status;
- product maturity.

Use public-safe, supported evidence only.

Never expose:

- company-confidential records;
- real ERP transactions or customer data;
- credentials, tokens, chat IDs, secrets, or private usernames;
- sensitive local paths when unnecessary;
- private prompts, logs, repositories, or Personal OS content;
- unrestricted machine-control interfaces.

## Architecture Boundary

The current site is a static HTML/CSS/JavaScript website.

- Continue from the existing implementation.
- Reuse existing assets, CSS variables, components, and conventions where appropriate.
- Do not migrate to React, Vite, Next.js, another framework, or another deployment model without explicit owner approval.
- Do not add dependencies merely to achieve a visual effect that can be implemented cleanly in the current architecture.
- Keep changes limited to the smallest number of files needed for the approved outcome.

## External Frontend Skills

The selected third-party skills for the experiment are:

- `frontend-design`
- `design-review`

from `julianoczkowski/designer-skills`.

Repository rules in this file override any conflicting skill defaults.

In particular:

- do not add automatic dark mode;
- do not redesign the whole site;
- do not invent content to fill layouts;
- do not create extra design documents unless required for the current approval gate;
- do not continue beyond the approved representative surface;
- do not publish or commit temporary screenshots and QA artifacts unless requested.

The external skill provides design and review methodology. It does not control portfolio identity, project selection, claims, or scope.

## Approval Gates

For meaningful visual work, follow this sequence:

```text
Inspect existing implementation
-> define one bounded outcome
-> create concept options
-> owner selects or revises a concept
-> freeze the approved visual specification
-> implement one representative slice locally
-> capture desktop, tablet, and mobile screenshots
-> compare rendered result with the approved concept
-> owner reviews locally
-> expand only after explicit approval
```

Do not move from concept to implementation without explicit owner approval.

Do not treat a successful build, valid HTML, or absence of console errors as visual approval.

## Current Experiment Scope

The first Living System experiment is limited to:

```text
Homepage first viewport
+ transition into the next section
```

The experiment should establish the visual language, not rebuild the full website.

Allowed during the experiment:

- inspect the current homepage and relevant styles;
- create bounded concept options using real approved content;
- implement the selected slice in an isolated local branch or worktree after approval;
- run a local static server;
- capture local responsive screenshots;
- make fixes required to match the approved concept.

Not allowed during the experiment:

- modifying or deploying the public site before local approval;
- redesigning downstream homepage sections;
- rebuilding project case studies;
- changing navigation architecture for the full website;
- installing a framework;
- creating a large project grid;
- propagating a concept before the representative slice is approved.

## Local Review

All experimental frontend work must be reviewed locally before publication.

Minimum viewports:

- desktop: approximately `1440 x 900`;
- tablet: approximately `768 x 1024`;
- mobile: approximately `390 x 844`.

Review:

- immediate positioning clarity;
- visual continuity with the existing portfolio;
- copy accuracy;
- hierarchy and typography;
- spacing and container alignment;
- responsive behaviour;
- next-section transition;
- motion purpose and reduced-motion behaviour;
- public-safety of all visible content;
- visual fidelity to the approved concept.

Keep temporary concepts, screenshots, and review artifacts local until the owner approves publishing or committing them.

## Completion Standard

A scoped task is complete only when:

- the requested visible outcome works locally;
- no unrelated page or feature was changed;
- the implementation matches the approved concept closely;
- desktop, tablet, and mobile were reviewed;
- no invented or confidential content appears;
- changed files and intentional non-changes are reported clearly;
- the agent stops at the approved boundary.

When uncertain between a minimal solution and a broader redesign, choose the minimal solution and stop.
