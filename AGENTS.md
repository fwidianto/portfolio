# Portfolio Agent Guardrails

## Purpose

This repository is a public recruiter-facing portfolio, not a general experimentation workspace. Preserve clarity, credibility, and the live site's stability.

## Authority

Use this order:

1. The user's current explicit request.
2. This `AGENTS.md`.
3. `docs/README.md` and only the directly relevant linked document.
4. The current tested page/code.

Do not revive superseded plans, experiments, or historical branches unless explicitly asked.

## Public identity

The portfolio identity is **Analytical Systems Builder**.

Public narratives should normally follow:

```text
business problem
-> process understanding
-> business logic
-> technology
-> evidence / usable outcome
```

Do not present Fauzan as a pure software developer, generic dashboard builder, or AI engineer. AI is an accelerator, not the identity.

## Public project boundary

Current featured direction is intentionally narrow:

1. **Odoo Process Control Tower** — evolved from the earlier Odoo ERP Analytics work.
2. **Telegram Codex Controller** — only where explicitly approved/published.

Do not create new featured projects, project grids, or public links from dormant experiments without explicit instruction.

## Content integrity

Never invent or exaggerate projects, employers, metrics, business impact, technical maturity, users, performance, or completion status.

Never expose confidential operational records, credentials, tokens, private repository content, PersonalOS material, internal prompts/logs, or unnecessary machine details.

## Architecture boundary

The site is static HTML, CSS, and JavaScript deployed through GitHub Pages.

- Preserve the existing architecture unless the user explicitly requests a migration.
- Reuse current styles/assets before adding dependencies.
- Do not introduce React, Vite, Next.js, databases, backend services, or external UI frameworks for ordinary portfolio work.
- Change the smallest number of files needed for the requested visible outcome.

## Execution rule

For each task:

1. Inspect the requested page and its direct dependencies.
2. Define one bounded visible outcome.
3. Make the smallest trustworthy change.
4. Check relevant links, responsive behavior, console/runtime errors, and obvious regressions.
5. Stop when the requested outcome works.

A new idea discovered during implementation is not automatically part of the task.

## Design rule

Preserve the approved live design unless redesign is explicitly requested. Avoid decorative complexity that weakens business clarity: neon-AI styling, glassmorphism, generic bento grids, terminal aesthetics as identity, unsupported charts/metrics, excessive glow, parallax, or motion without meaning.

If motion is used, it should explain sequence, connection, state, direction, or cause-and-effect and should respect reduced-motion preferences.

## Delivery

Use one task-specific branch for meaningful changes. Keep the diff focused. Report changed files, validation performed, and anything intentionally left unchanged.

When uncertain between a minimal solution and a broader redesign, choose the minimal solution and stop.
