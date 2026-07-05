# Homepage Capability Graph Feature Specification

Status: Draft for review  
Related source of truth: [homepage-capability-graph.md](homepage-capability-graph.md)  
Implementation status: Not ready for UI implementation yet

This document defines the future Capability Graph homepage feature at the specification level. It does not authorize implementation by itself.

---

## 1. Purpose

The Capability Graph is a future homepage section that helps visitors understand how Fauzan's capabilities connect and compound over time.

It is not a resume timeline.

It is not a skill chart.

It is not a progress bar.

It is not a project gallery.

It is a guided discovery experience that shows how earlier experiences created the foundation for current business-system thinking.

The section should help visitors naturally discover:

- Fauzan understands business problems before tools.
- Fauzan learns from real operational contexts.
- Fauzan connects process, data, systems, and decisions.
- Fauzan builds practical solutions from accumulated capability.
- Fauzan uses AI as an accelerator while keeping human judgment central.

The visitor should not feel that Fauzan is claiming to be good at many things.

The visitor should feel:

```text
I can see how his experience connects.
```

---

## 2. Model Recommendation

Use ChatGPT or another strong reasoning model to define the Capability Graph strategy, content model, visitor psychology, wording, and feature specification.

Use Codex only after the specification is approved.

Recommended division:

| Work type | Recommended tool |
| --- | --- |
| Portfolio philosophy | ChatGPT |
| Visitor psychology | ChatGPT |
| Capability Graph reasoning | ChatGPT |
| Feature specification | ChatGPT |
| Copy and narrative direction | ChatGPT |
| Markdown placement in repo | Codex |
| UI implementation | Codex |
| HTML/CSS/JS changes | Codex |
| Repository refactor | Codex |
| Link checking | Codex |
| Git commit and push | Codex |

This document should be written and reviewed before Codex implements anything.

---

## 3. Reasoning Recommendation

The Capability Graph should be designed through reasoning before implementation.

Reasoning order:

1. Define what the visitor should discover.
2. Define what misconception should be avoided.
3. Define the capability nodes.
4. Define the relationship between nodes.
5. Define public-safe evidence.
6. Define interaction purpose.
7. Define visual metaphor.
8. Define responsive behavior.
9. Define implementation boundaries.
10. Only then create a Codex implementation task.

Do not ask Codex to invent the Capability Graph philosophy during implementation.

Codex should translate an approved specification into code, not decide the professional positioning.

---

## 4. Strategic Role on Homepage

The Capability Graph should appear after the initial identity section.

Suggested homepage journey:

```text
Identity
-> Capability Graph
-> Thinking Lab
-> Currently Building
-> Flagship Case Study
```

The Capability Graph answers this visitor question:

```text
How did this person become able to understand business systems?
```

It should prepare the visitor before they open the Odoo ERP Analytics case study.

The Capability Graph should create context.

The Odoo case study should provide proof.

---

## 5. Core Concept

The graph should show accumulated capability.

Main capability chain:

```text
Engineering
-> Cost Control
-> Business Control
-> Manufacturing
-> ERP Analytics
-> AI-Assisted Development
-> Portfolio Experience
```

This chain is not strictly chronological.

It is a capability system.

Each node should answer:

- What kind of thinking was developed here?
- What business context shaped that capability?
- What evidence supports it?
- How does it connect to the next capability?

Years may appear as metadata, but dates should not dominate.

Connections matter more than chronology.

---

## 6. What the Section Should Reveal

The section should reveal the following without overexplaining.

### 6.1 Curiosity

Fauzan learns by following business questions.

The graph should show that each stage started from a practical question, not from chasing technology trends.

Example discovery:

```text
He seems to learn because he wants to understand how things work.
```

### 6.2 Business Understanding

The graph should show that business process comes before tools.

Example discovery:

```text
He does not start with dashboards. He starts with the business logic behind the dashboard.
```

### 6.3 Systems Thinking

The graph should show relationships:

- engineering logic supports process thinking,
- cost control supports profitability understanding,
- business control supports management visibility,
- manufacturing supports ERP interpretation,
- ERP analytics supports operational traceability,
- AI-assisted development accelerates implementation,
- portfolio experience communicates the whole system.

Example discovery:

```text
His experiences are connected, not random.
```

### 6.4 Practical Solution-Building

The graph should show that capability becomes useful when it produces practical visibility.

Example discovery:

```text
He turns messy operations into something management can understand.
```

### 6.5 Continuous Learning

The graph should show active evolution without looking unfinished.

Example discovery:

```text
He is still building, but in a structured way.
```

---

## 7. What the Section Must Avoid

Avoid making the Capability Graph look like:

- a resume timeline,
- a skill percentage chart,
- a career ladder,
- a decorative network animation,
- a generic developer roadmap,
- a list of tools,
- an AI-first identity,
- a claim-heavy self-promotion section.

Do not use phrases like:

- Expert in everything
- Mastered AI
- Full-stack developer
- Advanced engineer
- Data wizard
- 10x builder

Preferred tone:

- calm,
- specific,
- business-first,
- reflective,
- evidence-led,
- humble but confident.

---

## 8. Visitor Experience

The visitor should experience the section in three layers.

### Layer 1: Simple First Impression

At first glance, the visitor should see a clean connected map.

They should immediately understand:

```text
This is not a normal timeline. This is a map of how capability compounds.
```

Suggested section title:

```text
How my capabilities connect
```

Alternative titles:

```text
Capability Graph
From business problems to practical systems
How experience became system thinking
```

Recommended title:

```text
How my capabilities connect
```

Reason:

It is human, clear, and less abstract than "Capability Graph."

### Layer 2: Node Exploration

Each node should have short text.

The visitor should be able to scan quickly.

Each node should include:

- capability name,
- short description,
- what it taught,
- evidence link or supporting project,
- connection to next node.

Avoid long paragraphs inside the graph.

### Layer 3: Deeper Evidence

The graph should route visitors toward deeper evidence.

Primary evidence destination:

```text
Odoo ERP Analytics Case Study
```

Secondary evidence destinations may include:

- Business Reporting Automation,
- PersonalOS / AI Handoff Workflow,
- AI ERP Intelligence Dashboard,
- HS Code Automation,
- Investment Analytics Dashboard.

The graph should not explain every project fully.

It should create curiosity and guide the next click.

---

## 9. Capability Nodes

### 9.1 Engineering

Purpose:

Show the original foundation of structured problem-solving.

Visitor should discover:

```text
Fauzan's system thinking did not begin with software. It began with engineering logic.
```

Possible copy:

```text
Engineering taught me to understand systems through constraints, inputs, outputs, and cause-effect relationships.
```

What it contributes:

- structured thinking,
- process logic,
- cause-effect reasoning,
- comfort with technical systems.

Connection to next node:

Engineering thinking made cost and operational problems easier to structure.

Evidence:

- Mechanical Engineering background,
- technical internship,
- early analytical mindset.

Avoid:

Do not overemphasize engineering as the current identity.

### 9.2 Cost Control

Purpose:

Show the transition from technical thinking into business visibility.

Visitor should discover:

```text
Fauzan learned how operational activity becomes cost, margin, and management concern.
```

Possible copy:

```text
Cost Control turned operational activity into business visibility: cost, margin, inventory, and profitability signals.
```

What it contributes:

- profitability understanding,
- cost structure,
- inventory control,
- operational reporting,
- financial impact awareness.

Connection to next node:

Cost control created the foundation for business control and management reporting.

Evidence:

- profitability dashboards,
- inventory mismatch investigation,
- AP digital flow,
- cost-control reporting.

Avoid:

Do not make this look like finance-only experience. It should show business-system interpretation.

### 9.3 Business Control

Purpose:

Show the expansion from cost visibility into business decision support.

Visitor should discover:

```text
Fauzan learned to connect reporting, pricing, operations, vendors, and management questions.
```

Possible copy:

```text
Business Control expanded the view from cost monitoring into pricing, performance, reporting, and cross-functional decision support.
```

What it contributes:

- management visibility,
- pricing coordination,
- dashboard thinking,
- stakeholder communication,
- operational decision support.

Connection to next node:

Business control made manufacturing and ERP process data more meaningful.

Evidence:

- pricing support,
- vendor price fluctuation tracking,
- management dashboards,
- cross-functional coordination.

Avoid:

Do not make this sound like a generic analyst role. Focus on connecting decisions across functions.

### 9.4 Manufacturing

Purpose:

Show the operational reality behind ERP and dashboard data.

Visitor should discover:

```text
Fauzan understands that data represents real operational processes, not just rows in a database.
```

Possible copy:

```text
Manufacturing experience made ERP data more concrete because each transaction reflects real movement, work, delay, and responsibility.
```

What it contributes:

- process reality,
- production flow understanding,
- procurement/manufacturing/service connection,
- operational constraints,
- ability to question data logic.

Connection to next node:

Manufacturing context made ERP analytics more grounded and easier to validate.

Evidence:

- workshop/company experience,
- operations oversight,
- procurement and production exposure,
- service/project profitability context.

Avoid:

Do not make this a full company story. Keep it public-safe and capability-focused.

### 9.5 ERP Analytics

Purpose:

Show the strongest current proof of business-system thinking.

Visitor should discover:

```text
Fauzan can translate messy ERP processes into reporting, traceability, and business insight.
```

Possible copy:

```text
ERP Analytics connects business questions, process logic, data models, and dashboards into practical management visibility.
```

What it contributes:

- ERP process interpretation,
- data modeling,
- dashboard structure,
- traceability,
- validation,
- profitability review.

Connection to next node:

ERP analytics created the need for faster iteration, documentation, and AI-assisted development.

Evidence:

- Odoo ERP Analytics Platform,
- SO/IO traceability,
- profitability dashboards,
- data truth-layer work,
- reporting validation.

Primary CTA:

```text
Open Odoo ERP Analytics case study
```

Avoid:

Do not lead with SQL, Python, PostgreSQL, or technical stack. Lead with the business problem.

### 9.6 AI-Assisted Development

Purpose:

Show AI as an accelerator, not the identity.

Visitor should discover:

```text
Fauzan uses AI to accelerate implementation, but business judgment still controls the direction.
```

Possible copy:

```text
AI-assisted development helps me move faster from business question to prototype, but validation and judgment remain human responsibilities.
```

What it contributes:

- faster prototyping,
- documentation handoff,
- code iteration,
- implementation support,
- structured review workflow.

Connection to next node:

AI-assisted development enables the portfolio itself to become a living professional operating system.

Evidence:

- Codex workflow,
- OpenHands exploration,
- documentation-driven development,
- AI handoff practices,
- portfolio and ERP dashboard iteration.

Avoid:

Do not position as AI Engineer or AI Developer.

### 9.7 Portfolio Experience

Purpose:

Show the portfolio as the public interface of the whole system.

Visitor should discover:

```text
The portfolio itself is becoming evidence of how Fauzan thinks, documents, learns, and communicates.
```

Possible copy:

```text
The portfolio is becoming the public interface of my professional operating system: a place where capability, thinking, evidence, and learning connect.
```

What it contributes:

- communication,
- public evidence,
- case-study storytelling,
- documentation discipline,
- continuous improvement,
- recruiter-facing clarity.

Connection to deeper sections:

This node should route to:

- Thinking Lab,
- Currently Building,
- Odoo ERP Analytics case study,
- GitHub activity or public documentation.

Avoid:

Do not make the portfolio look like a meta-project with no business value. It should connect back to evidence.

---

## 10. Edge / Connection Logic

The connections between nodes are more important than the nodes themselves.

Each edge should explain why one capability supports the next.

Suggested edge logic:

| From | To | Meaning |
| --- | --- | --- |
| Engineering | Cost Control | Structured problem-solving became useful for business cost problems. |
| Cost Control | Business Control | Cost visibility expanded into profitability, pricing, and decision support. |
| Business Control | Manufacturing | Management reporting became more grounded through operational reality. |
| Manufacturing | ERP Analytics | Process understanding made ERP data easier to interpret and validate. |
| ERP Analytics | AI-Assisted Development | Complex analytics work created the need for faster, documented iteration. |
| AI-Assisted Development | Portfolio Experience | AI-assisted workflows help turn thinking, projects, and evidence into a living public system. |

Edges should be short and meaningful.

Avoid abstract labels like:

- growth,
- progress,
- next step,
- career move.

Use specific relationship labels.

---

## 11. Content Hierarchy

Each node should have three levels of content.

### Level 1: Label

Short node name.

Example:

```text
ERP Analytics
```

### Level 2: One-line meaning

A short sentence that explains the capability.

Example:

```text
Turning ERP activity into traceability, reporting, and business visibility.
```

### Level 3: Evidence / deeper link

A project, case study, or supporting proof.

Example:

```text
Evidence: Odoo ERP Analytics Platform
```

Only Level 1 and Level 2 should appear immediately.

Level 3 may appear on hover, tap, expand, or detail panel.

---

## 12. Interaction Concept

The graph should use interaction to clarify relationships.

Recommended interaction:

1. Default view shows all nodes and connections.
2. Hover or tap a node highlights:
   - selected node,
   - previous node,
   - next node,
   - related evidence.
3. A side panel or expandable card shows:
   - what this capability means,
   - what it taught,
   - where to see evidence.
4. A primary CTA routes to the flagship case study after ERP Analytics.

Avoid:

- force-directed floating nodes,
- random graph movement,
- overly playful animation,
- complex 3D effects,
- interaction that hides the message.

The graph should feel calm and intentional.

---

## 13. Responsive Behavior

### Desktop

Recommended layout:

- horizontal or diagonal connected graph,
- supporting detail panel on the side or below,
- visible connection lines,
- hover support.

### Tablet

Recommended layout:

- simplified connected flow,
- tap-to-expand nodes,
- reduced line complexity.

### Mobile

Recommended layout:

- vertical connected sequence,
- accordion-style node details,
- simple connection labels,
- no complex graph physics.

Mobile should not try to preserve desktop complexity.

On mobile, clarity is more important than visual graph purity.

---

## 14. Visual Direction

The Capability Graph should feel:

- structured,
- calm,
- thoughtful,
- business-oriented,
- lightly interactive,
- evidence-led.

Visual metaphor:

```text
A system map of accumulated capability.
```

Not:

```text
A career timeline.
```

Not:

```text
A tech skill tree.
```

Not:

```text
A social network graph.
```

Suggested visual characteristics:

- soft cards or nodes,
- subtle connecting lines,
- warm neutral background,
- restrained accent color,
- clear typography,
- enough whitespace,
- minimal animation.

The graph should look like something a recruiter or business stakeholder can understand quickly.

---

## 15. Suggested Section Copy

### Section eyebrow

```text
Capability Graph
```

### Section title

```text
How my capabilities connect
```

### Section intro

```text
My work did not develop as separate skills. Engineering shaped how I understand systems. Cost control taught me how operations affect profitability. Business control connected reporting with decisions. Manufacturing made ERP data real. ERP analytics turned that understanding into practical visibility. AI now helps me build faster, while business judgment keeps the work grounded.
```

### Shorter intro option

```text
This graph shows how my experiences compound: from engineering logic, to cost and business control, to manufacturing process understanding, ERP analytics, AI-assisted development, and portfolio storytelling.
```

Recommended version:

Use the shorter intro on homepage.

Use the longer explanation in expanded detail or case-study context.

---

## 16. Suggested Node Copy

### Engineering

```text
Structured thinking from systems, constraints, and cause-effect relationships.
```

### Cost Control

```text
Turning operational activity into cost, margin, inventory, and profitability visibility.
```

### Business Control

```text
Connecting reports, pricing, operations, vendors, and management decisions.
```

### Manufacturing

```text
Understanding the real process behind ERP transactions and operational data.
```

### ERP Analytics

```text
Translating ERP activity into traceability, dashboards, and business insight.
```

### AI-Assisted Development

```text
Using AI to accelerate implementation while keeping validation and judgment human.
```

### Portfolio Experience

```text
Turning capability, thinking, evidence, and learning into a living public system.
```

---

## 17. Suggested Evidence Mapping

| Capability | Evidence |
| --- | --- |
| Engineering | Mechanical Engineering background, technical internship, systems foundation. |
| Cost Control | Profitability dashboards, inventory mismatch analysis, AP digital flow. |
| Business Control | Pricing support, vendor price fluctuation tracking, management reporting. |
| Manufacturing | Workshop/business operations, procurement/manufacturing/service exposure. |
| ERP Analytics | Odoo ERP Analytics Platform, SO/IO traceability, dashboard validation. |
| AI-Assisted Development | Codex/OpenHands workflow, documentation-driven development, AI handoffs. |
| Portfolio Experience | Portfolio documentation, case-study structure, living professional operating system. |

Evidence should be public-safe.

Do not expose confidential company data, private PersonalOS notes, or internal operational details.

---

## 18. Data Structure Recommendation

Future implementation may define the graph content as structured data.

Example structure:

```json
[
  {
    "id": "engineering",
    "label": "Engineering",
    "summary": "Structured thinking from systems, constraints, and cause-effect relationships.",
    "discovery": "System thinking did not begin with software. It began with engineering logic.",
    "evidence": ["Mechanical Engineering background", "technical internship"],
    "connectsTo": ["cost-control"]
  },
  {
    "id": "cost-control",
    "label": "Cost Control",
    "summary": "Turning operational activity into cost, margin, inventory, and profitability visibility.",
    "discovery": "Operational activity becomes business visibility when cost and margin logic are structured.",
    "evidence": ["profitability dashboards", "inventory mismatch analysis", "AP digital flow"],
    "connectsTo": ["business-control"]
  }
]
```

This is only a future implementation suggestion.

Do not implement until a future task explicitly requests it.

---

## 19. Acceptance Criteria for Future Implementation

A future implementation should be accepted only if:

1. It does not look like a resume timeline.
2. It does not look like a skill chart.
3. It clearly shows connected capability.
4. It keeps Business Systems Designer as the underlying identity.
5. It positions AI as an accelerator, not the identity.
6. It routes visitors toward Odoo ERP Analytics as strongest proof.
7. It works clearly on desktop and mobile.
8. It uses interaction to clarify, not decorate.
9. It avoids confidential details.
10. It makes visitors understand how Fauzan thinks before asking them to inspect projects.

---

## 20. Non-Goals

The Capability Graph should not:

- replace the About section,
- replace the CV,
- list every tool,
- list every job,
- show every project,
- become a personal diary,
- become a full case study,
- become a decorative animation,
- claim mastery without evidence.

---

## 21. Open Questions Before Implementation

Before creating the actual UI, decide:

1. Should the graph appear above or below the current project preview section?
2. Should the graph have clickable nodes or simple hover/tap details?
3. Should evidence links open project pages directly or show a small detail panel first?
4. Should the graph include years as subtle metadata or omit them entirely?
5. Should Portfolio Experience be visible now or introduced later after Thinking Lab exists?
6. Should the first implementation be static and simple before adding interaction?

Recommended answers for v1:

1. Place it after the identity/hero section and before project cards.
2. Use simple click/tap details.
3. Show a small detail panel first, then provide evidence links.
4. Include years only if they do not make it feel like a timeline.
5. Include Portfolio Experience as the final node, but keep it concise.
6. Build v1 as simple, static, and responsive before adding richer interaction.

---

## 22. Recommended Implementation Path

Do not implement immediately.

Recommended sequence:

```text
Capability Graph feature specification
-> ChatGPT review
-> final content approval
-> Codex implementation prompt
-> simple static v1
-> responsive QA
-> visual review
-> interaction refinement
-> ChatGPT review
-> GitHub push
```

First implementation should prioritize clarity over animation.

---

## 23. Codex Boundary for Future Task

When this specification is approved, Codex may be asked to:

- implement a static homepage Capability Graph v1,
- keep the implementation aligned with existing visual direction,
- verify responsiveness,
- commit and push to GitHub.

Codex should not:

- rewrite the portfolio philosophy,
- change the positioning,
- invent new capability nodes,
- make AI the central identity,
- turn the graph into a timeline,
- add heavy animation without approval.

---

## 24. Summary

The Capability Graph should help visitors discover the connection behind Fauzan's work.

The message is not:

```text
I know many tools.
```

The message is:

```text
My capabilities compound through business problems, systems thinking, practical execution, and continuous learning.
```

The strongest outcome is when visitors conclude:

```text
He understands how business systems work, and he can turn that understanding into practical visibility.
```
