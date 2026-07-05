# Capability Growth Curve v7 Implementation Brief

Status: Approved visual direction for implementation

## Purpose

Replace the current stacked-card Capability Graph on the homepage with the approved **Capability Growth Curve v7** direction.

The section should help experienced HR, recruiters, hiring managers, business managers, and functional leaders quickly understand how Fauzan's capability matured over time.

Target audience guidance is defined in:

- [../design/target-audience.md](../design/target-audience.md)

## Public section framing

Eyebrow:

```text
Capability Graph
```

Title:

```text
How my capabilities connect
```

Intro:

```text
A visual map of how business experience, systems thinking, ERP analytics, and AI-assisted execution compounded over time.
```

Legend chips:

```text
Years
Capability Depth
Foundation → Business Systems Maturity
```

## Visual concept

Use a graph-like visual, not stacked cards.

The graph should show:

- x-axis = years
- y-axis = qualitative capability depth
- an exponential / compounding curve
- plotted points directly centered on the curve
- minimal node text
- one unified explanation panel below the graph

The curve is a visual metaphor. It is not a measurable skill score, KPI, or self-rating chart.

## Graph stages

| Year | Main label | Sub-label |
| --- | --- | --- |
| 2019 | Engineering | Foundation |
| 2021 | Cost Control | Visibility |
| 2022 | Business Control | Judgment |
| 2023 | Manufacturing | Process Reality |
| 2024 | ERP Analytics | Systems Integration |
| 2025 | AI-Assisted | Acceleration |
| 2026 | Operating System | Portfolio System |

## Y-axis labels

The y-axis labels must be uniformly aligned.

Use qualitative markers:

```text
Foundation
Visibility
Judgment
Systems
Acceleration
Maturity
```

Avoid numeric values or percentages.

## Explanation panel

Do not use the heading:

```text
What each phase means
```

Do not use a separate title column for every phase.

Use one clean explanation container below the graph. Each explanation should be one sentence with the phase keyword bolded at the start.

Approved explanation copy:

```text
Foundation was shaped by mechanical engineering, where I learned to think in systems, constraints, and cause-effect relationships.

Visibility came from turning operational activity into cost, margin, inventory, and profitability visibility.

Judgment was built by connecting reports, pricing, vendors, operations, and management decisions.

Process Reality came from understanding the real meaning behind ERP transactions, materials, jobs, and operational exceptions.

Systems Integration was achieved by connecting process, data, traceability, dashboards, and business insight into one working system.

Acceleration came from using AI to build, document, test, and iterate faster while keeping judgment human-led.

Operating System means turning learning, projects, evidence, and working style into a living professional system.
```

In HTML, bold only the first phrase of each sentence:

- Foundation
- Visibility
- Judgment
- Process Reality
- Systems Integration
- Acceleration
- Operating System

## Mobile behavior

Mobile must not show the old stacked-card arrow version.

Mobile should show either:

1. a simplified SVG graph with points centered on the curve, or
2. a visually coherent vertical version where every point is clearly centered on the visual path.

Priority:

- no horizontal overflow
- y-axis labels aligned uniformly
- points centered on the line/curve
- graph remains readable on Android Chrome
- explanation block remains below the graph

## Implementation scope

Update only the homepage Capability Graph section in `index.html`.

Do not change:

- hero section
- about section
- project cards
- navigation
- analytics scripts
- SEO metadata
- Odoo case study page
- unrelated CSS

## Acceptance criteria

- Current stacked-card Capability Graph is replaced.
- New section uses the v7 graph-like visual direction.
- Desktop graph uses x-axis, y-axis, curve, points, and stage labels.
- Mobile graph is visually centered and readable.
- Y-axis labels are uniformly aligned.
- Explanation panel has no heading and no title column.
- Explanation sentences use bold phase keywords at the start.
- Final stage is `Operating System`, not `Visible Proof` or `Personal Operating System`.
- AI remains framed as an accelerator, not the identity.
- The graph remains a maturity metaphor, not a quantified skill score.
- No unrelated files are changed.

## Recommended commit message

```text
refactor: replace capability graph with growth curve
```
