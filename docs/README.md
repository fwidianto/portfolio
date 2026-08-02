# Portfolio Documentation

Status: Active source index

This folder is the entry point for future ChatGPT and Codex sessions working on the portfolio.

The portfolio direction is:

```text
Understand how I think.
```

Not:

```text
Look at what I built.
```

The public positioning is **Analytical Systems Builder**: from problems and data to system design, insights, and AI-powered workflows. The portfolio should show curiosity, business understanding, systems thinking, practical solution-building, continuous learning, and AI-assisted execution with human business judgment.

## Current Checkpoint

Homepage v1 is frozen at commit `67cb782` and remains the active public implementation.

The next renewal direction is frozen in [design/living-system-portfolio-direction.md](design/living-system-portfolio-direction.md). It defines a mature Living System experiment, external frontend-skill evaluation, local review, and approval phases. It does **not** authorise immediate changes to the live homepage.

The allowed public content set is frozen in [design/public-content-curation.md](design/public-content-curation.md).

The next concept uses two featured projects:

1. **Odoo Process Control Tower** — the evolved form of the earlier Odoo ERP Analytics project;
2. **Telegram Codex Controller** — the current Systems Lab / AI-assisted workflow project.

There is no supporting project layer for now. Other work may not be promoted merely to fill the interface.

The external frontend-skill decision is frozen in [design/frontend-skill-selection.md](design/frontend-skill-selection.md). The experiment will use only `frontend-design` and `design-review` from `julianoczkowski/designer-skills`. The full external design-flow suite is not selected.

The root [`AGENTS.md`](../AGENTS.md) is the mandatory operational authority for agents working in this repository. It applies the strategic decisions above as concrete scope, content, architecture, privacy, local-review, and approval rules.

Before proposing homepage changes, read `AGENTS.md`, the v1 freeze, Living System direction, public content curation, and frontend-skill selection. The first V2 homepage work must be an isolated local experiment limited to one representative surface.

## Read Order

1. [`../AGENTS.md`](../AGENTS.md)
2. [core/README.md](core/README.md)
3. [homepage/HOMEPAGE_V1_FREEZE.md](homepage/HOMEPAGE_V1_FREEZE.md)
4. [design/living-system-portfolio-direction.md](design/living-system-portfolio-direction.md)
5. [design/public-content-curation.md](design/public-content-curation.md)
6. [design/frontend-skill-selection.md](design/frontend-skill-selection.md)
7. [homepage/README.md](homepage/README.md)
8. [design/README.md](design/README.md)
9. [case-studies/README.md](case-studies/README.md)

## Active Documentation Areas

| Folder | Purpose |
| --- | --- |
| Repository root | Mandatory agent guardrails in `AGENTS.md`. |
| [core/](core/README.md) | Portfolio philosophy, long-term vision, working principles, and ChatGPT/Codex workflow. |
| [homepage/](homepage/README.md) | Homepage frozen checkpoint, experience architecture, and future section boundaries. |
| [design/](design/README.md) | Visitor psychology, information architecture, visual direction, Living System renewal direction, public content curation, and external frontend-skill selection. |
| [case-studies/](case-studies/README.md) | Existing case-study material, including the Odoo project history that is evolving into the Process Control Tower presentation. |

## Source-of-Truth Ownership

| Topic | Source of truth |
| --- | --- |
| Agent operating rules | [`../AGENTS.md`](../AGENTS.md) |
| Overall philosophy | [core/portfolio-design-philosophy.md](core/portfolio-design-philosophy.md) |
| Long-term 2030 direction | [core/portfolio-vision-2030.md](core/portfolio-vision-2030.md) |
| ChatGPT + Codex workflow | [core/portfolio-development-workflow.md](core/portfolio-development-workflow.md) |
| ChatGPT + Codex tool division | [core/chatgpt-codex-tool-division.md](core/chatgpt-codex-tool-division.md) |
| Portfolio working principles | [core/portfolio-working-principles.md](core/portfolio-working-principles.md) |
| Homepage v1 freeze checkpoint | [homepage/HOMEPAGE_V1_FREEZE.md](homepage/HOMEPAGE_V1_FREEZE.md) |
| Living System renewal direction and phased experiment | [design/living-system-portfolio-direction.md](design/living-system-portfolio-direction.md) |
| Public project and content curation | [design/public-content-curation.md](design/public-content-curation.md) |
| External frontend-skill selection | [design/frontend-skill-selection.md](design/frontend-skill-selection.md) |
| Homepage experience | [homepage/homepage-experience-blueprint.md](homepage/homepage-experience-blueprint.md) |
| Capability Graph concept | [homepage/homepage-capability-graph.md](homepage/homepage-capability-graph.md) |
| Capability Graph feature specification | [homepage/homepage-capability-graph-feature-spec.md](homepage/homepage-capability-graph-feature-spec.md) |
| Thinking Lab | [homepage/homepage-thinking-lab.md](homepage/homepage-thinking-lab.md) |
| Currently Building section | [homepage/homepage-currently-building.md](homepage/homepage-currently-building.md) |
| Flagship case-study routing | [homepage/homepage-flagship-case-study.md](homepage/homepage-flagship-case-study.md) |
| Existing Odoo case-study source | [case-studies/odoo-erp-analytics.md](case-studies/odoo-erp-analytics.md) |
| Visitor psychology | [design/visitor-psychology.md](design/visitor-psychology.md) |
| Information architecture | [design/information-architecture.md](design/information-architecture.md) |
| Visual direction | [design/visual-direction.md](design/visual-direction.md) |

## Rules for Future Sessions

- Follow the root `AGENTS.md` before using any frontend or design skill.
- Do not change the active public homepage from the Living System direction document alone.
- Do not implement homepage features before the relevant concept and representative surface are explicitly approved.
- Keep experimental V2 work isolated and local until review is complete.
- Use [design/public-content-curation.md](design/public-content-curation.md) as the authority for which projects may appear.
- Treat Odoo ERP Analytics and Odoo Process Control Tower as one evolving project, not separate entries.
- Use only Odoo Process Control Tower and Telegram Codex Controller as featured projects in the next concept.
- Do not create a supporting project layer unless the user explicitly revises the curation.
- Use [design/frontend-skill-selection.md](design/frontend-skill-selection.md) as the authority for the external skill experiment.
- Do not publish immature projects simply to increase project count.
- Do not build the Capability Graph UI from these docs alone.
- Do not build the Thinking Lab UI from these docs alone.
- Do not repeat the full philosophy in every document.
- Link to the source of truth instead of duplicating long sections.
- Keep AI positioned as an accelerator, not the identity.
- Keep the story order: business problem -> process understanding -> business logic -> technology -> evidence.

## Historical Notes

Older planning files may remain as short redirects or historical implementation logs. They are not the active source of truth unless this index links to them directly.
