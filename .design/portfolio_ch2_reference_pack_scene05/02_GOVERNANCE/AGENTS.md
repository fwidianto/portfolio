# Portfolio Agent Instructions

## Purpose

This repository is a public recruiter-facing portfolio. Preserve credibility, clarity, and the stability of accepted work.

## Authority

Use this order:

1. the owner's current explicit request;
2. this `AGENTS.md`;
3. `.design/CURRENT_DIRECTION.md` for current visual/design authority;
4. `docs/README.md` for repository routing;
5. the current tested implementation.

Do not reconstruct superseded plans, historical branches, or old animation authorities unless explicitly needed.

## Public identity

The portfolio identity is **Analytical Systems Builder**.

Public narratives should normally follow:

```text
business problem
-> process understanding / business logic
-> technology
-> evidence / usable outcome
```

Do not present Fauzan as a pure software developer, generic dashboard builder, or AI engineer. AI is an accelerator, not the identity.

## Content integrity

Never invent or exaggerate projects, employers, metrics, business impact, technical maturity, users, performance, or completion status.

Never expose confidential operational records, credentials, tokens, private repository content, PersonalOS material, internal prompts/logs, or unnecessary machine details.

## Architecture

The portfolio is static HTML, CSS, and JavaScript deployed through GitHub Pages.

Preserve the existing architecture unless a different approach is explicitly approved. Reuse current code and assets before adding dependencies.

For unfamiliar, materially visual, or architecture-sensitive work, validate the professional tool/rendering approach and relevant browser/performance constraints with a bounded proof before committing to the full implementation. Do not add a framework, rendering engine, library, backend, agent, or other layer unless it solves a demonstrated limitation better than the existing path.

## Design and motion

Follow `.design/CURRENT_DIRECTION.md`. Approved/frozen owner decisions outrank an older live appearance when developing an explicitly approved new direction.

Motion should communicate sequence, connection, state, direction, or cause-and-effect. Materially visual work requires rendered desktop/mobile evidence; tests or DOM checks alone do not prove visual acceptance.

## Execution

For each task:

1. establish the current implementation and approved outcome;
2. continue or repair the existing path before creating a new one;
3. resolve only uncertainties that could materially change the approach;
4. make the smallest durable change that produces the requested visible result;
5. verify the actual outcome and obvious regressions;
6. stop when the acceptance condition passes.

A discovered idea is not automatically a new task. Keep `Implemented`, `Technically validated`, and `Owner approved` distinct.

## Delivery

Continue the existing task branch for ongoing work rather than creating another competing branch. Keep the diff focused and report changed files, validation performed, and anything intentionally left unchanged.
