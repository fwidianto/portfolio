# Homepage Documentation

Status: Active source index / homepage v1 frozen

This folder defines the accepted homepage experience, frozen homepage checkpoint, and future homepage boundaries.

The homepage should act as the public interface of the portfolio philosophy defined in [../core/portfolio-design-philosophy.md](../core/portfolio-design-philosophy.md).

## Documents

| Document | Purpose |
| --- | --- |
| [HOMEPAGE_V1_FREEZE.md](HOMEPAGE_V1_FREEZE.md) | Frozen homepage v1 checkpoint, accepted section flow, locked decisions, and allowed future changes. |
| [homepage-experience-blueprint.md](homepage-experience-blueprint.md) | Overall homepage journey and section order. |
| [homepage-skill-development-curve.md](homepage-skill-development-curve.md) | Accepted v1 source of truth for the public Skill Development Curve section. |
| [homepage-odoo-flagship-evidence.md](homepage-odoo-flagship-evidence.md) | Accepted v1 guidance for the public Odoo Flagship Evidence section. |
| [homepage-flagship-case-study.md](homepage-flagship-case-study.md) | Routing document for the Odoo ERP Analytics flagship case study. |
| [website-updates.md](website-updates.md) | Maintenance rule for the public Website Updates changelog. |
| [homepage-capability-graph.md](homepage-capability-graph.md) | Superseded historical concept document for internal capability-growth thinking. |
| [homepage-capability-graph-feature-spec.md](homepage-capability-graph-feature-spec.md) | Historical feature specification for the earlier Capability Graph direction. |
| [homepage-capability-growth-curve-v7-implementation-brief.md](homepage-capability-growth-curve-v7-implementation-brief.md) | Historical implementation brief that led to the accepted v1 Skill Development Curve. |
| [homepage-thinking-lab.md](homepage-thinking-lab.md) | Thinking Lab concept for current questions and explorations. |
| [homepage-currently-building.md](homepage-currently-building.md) | Future section that shows the portfolio is alive. |

## When to Read

Read this folder before designing or implementing homepage sections, navigation flow, homepage copy, homepage interaction behavior, or project-routing decisions.

Start with [HOMEPAGE_V1_FREEZE.md](HOMEPAGE_V1_FREEZE.md) before proposing any homepage change.

## Current Section Status

Homepage v1 is frozen at commit `67cb782`.

The accepted homepage story is:

```text
Hero
-> Professional Experience
-> Core Skills
-> Skill Development Curve
-> How I Think Through Problems
-> Flagship Project / Odoo ERP Analytics
-> Website Updates
-> Contact
```

The Skill Development Curve is accepted as homepage v1 and should be treated as frozen.

The Core Skills dynamic working path is accepted as homepage v1 and should be treated as frozen.

The Problem-Solving Engine in How I Think Through Problems is accepted as homepage v1 and should be treated as frozen.

The homepage project section is intentionally focused on one visible flagship project: Odoo ERP Analytics.

Website Updates is a maintained public changelog and should be updated when visible website changes are made.

The next priority is the Odoo ERP Analytics case study page: first-screen clarity, business story, proof strength, and public-safe evidence.

## What Should Not Be Placed Here

- Core philosophy that belongs in `../core/`.
- Visual style rules that belong in `../design/`.
- Full case-study content that belongs in `../case-studies/`.
- Implementation notes for HTML, CSS, or JavaScript, unless the document is explicitly marked as an implementation brief or historical implementation record.

## Implementation Boundary

These documents define intent, structure, and boundaries. Do not redesign frozen homepage sections unless the user explicitly requests a new strategy discussion or real visitor, recruiter, HR, or manager feedback shows that the current version is confusing or ineffective.

Do not build the Thinking Lab UI or other future homepage features until a future implementation task explicitly requests it.
