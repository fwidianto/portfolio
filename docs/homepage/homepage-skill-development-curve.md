# Homepage Skill Development Curve

Status: Accepted v1 / frozen section

## Decision

The public homepage section previously called `Capability Graph` is now called:

```text
Skill Development Curve
```

The accepted public title is:

```text
How my skills evolved over time
```

The accepted public intro is:

```text
A visual map of how my skills developed from engineering foundations into business systems, ERP analytics, and AI-assisted execution.
```

## Why the wording changed

`Capability Graph` was accurate internally, but it was too abstract for public visitors.

The target audience is experienced HR, recruiters, hiring managers, business managers, and functional leaders. For this audience, `Skill Development Curve` is easier to understand quickly.

## Public vs internal language

Use this distinction going forward:

| Context | Preferred wording |
| --- | --- |
| Public homepage wording | Skill Development Curve |
| Public section title | How my skills evolved over time |
| Public y-axis label | Skill Depth |
| Internal concept | capability growth / capability compounding |
| What to avoid publicly | Capability Graph as the visible section name |

## Freeze rule

This section is accepted as homepage v1.

Do not redesign or rename this section unless there is clear evidence from real visitor, recruiter, HR, or manager feedback that the section is confusing or ineffective.

Minor fixes are allowed only for:

- broken layout,
- mobile readability,
- accessibility,
- spelling/copy errors,
- obvious visual bugs.

Avoid further polishing for taste alone.

## Accepted content model

The graph should continue to show skill development through these stages:

| Year | Main label | Sub-label |
| --- | --- | --- |
| 2019 | Engineering | Foundation |
| 2021 | Cost Control | Visibility |
| 2022 | Business Control | Judgment |
| 2023 | Manufacturing | Process Reality |
| 2024 | ERP Analytics | Systems Integration |
| 2025 | AI-Assisted | Acceleration |
| 2026 | Operating System | Portfolio System |

## Interpretation rule

The curve is a qualitative maturity metaphor.

It is not:

- a measurable skill score,
- a percentage chart,
- a self-rating chart,
- a claim of mastery,
- a career ladder.

The section should communicate how Fauzan developed skills over years, while still preserving the deeper internal idea that his experience compounds into business systems thinking.

## Current accepted implementation

Accepted implementation commit:

```text
683680316db6ae84c49c588b4c030f882e8f57be
```

Commit message:

```text
refactor: align skill development curve with v7 mockup
```

## Next homepage priority

The next homepage priority is not to redesign this section.

The next priority is the **Flagship Evidence / Odoo ERP Analytics routing** section, because after visitors understand how Fauzan's skills evolved, they need proof.

Recommended homepage journey:

```text
Identity
-> Skill Development Curve
-> Flagship Evidence / Odoo ERP Analytics
-> Supporting Projects
-> Thinking Lab / Currently Building
```
