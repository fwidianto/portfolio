# Chapter 03 — Provisional Narrative & Animation Guideline

## Status

**PROVISIONAL OWNER-SELECTED DIRECTION — NOT YET FROZEN**

This document is the current conceptual authority for Chapter 03 exploration on `design/editorial-systems-prototype`.

It records the agreed narrative, scene structure, visual logic, and the bounded starting point for animation exploration. It does **not** authorize full Chapter 03 implementation and does **not** freeze any final geometry, timing, or production animation.

Development must follow:

`.design/skills/structured-animation-development/SKILL.md`

Default workflow:

`ground intent -> compare visual directions -> choose composition -> lock geometry -> define narrative/causal sequence -> animate bounded sections -> review -> owner approval -> freeze -> integrate`

Do not ask an agent to invent or animate the whole chapter in one pass.

---

## Chapter Purpose

Chapter 02 shows Fauzan learning to fit into engineering education: experiments, industrial exposure, international research, and undergraduate thesis work.

Chapter 03 begins the professional journey.

The chapter should not become an animated resume. It should show **real work and expanding responsibility** through concrete operational situations.

The current chapter arc is:

`Engineer -> Cost Analyst -> Business Controller -> Process Improver -> Operator`

The intended period is **2019–2024**:

- PT Traktor Nusantara / Astra Group — 2019–2022
- PT Cibuni Teknik Sejahtera — 2022–2024

PT Nobi Putra Angkasa / Odoo-era work is intentionally deferred to a later chapter, where the story can evolve from understanding/operating systems into deliberately building analytical and operational systems.

---

## Chapter-Level Visual Thesis

**Start with one industrial service operation and progressively widen the frame until the viewer can see an entire operating business.**

Chapter 03 should feel more professional, industrial, and analytical than Chapter 02 while remaining in the same dark astronomical/editorial visual universe.

The chapter should evolve visually from:

`one machine -> commercial economics -> inventory reality -> process movement -> whole operating system`

Main-canvas rule:

**Show what happened and what changed.**

Inspection-node rule:

**Explain where, when, how much, which tool, and the resume evidence.**

Use inspection nodes for dates, exact figures, job titles, software details, and supporting evidence rather than crowding the animation canvas.

---

# Scene Structure

## 03.01 — Entering Cost Control

### Purpose

Transition from university into Traktor Nusantara and explain what cost control meant through actual industrial service work.

### Core message

**Real industrial work consumes resources, and cost control makes that consumption visible and understandable.**

### Visual direction

**Layered Technical Plate**

Show one grounded industrial service situation first, then reveal the invisible cost and data structure underneath it.

### Required objects

- Universitas Indonesia origin trace / continuity node
- Traktor Nusantara identity cue
- one heavy machine / equipment object
- one technician
- one spare part / component
- one service action point
- parts cost
- labor cost
- operating/support cost
- total cost
- restrained SAP / structured-data layer

### Hierarchy

Primary:
1. machine / service operation
2. service action

Secondary:
3. technician
4. spare part
5. total cost

Tertiary:
6. parts / labor / operating cost signals
7. SAP / data layer
8. UI origin trace

### Composition logic

Use one frame with four zones:

- **Origin trace** — small upper-left continuity from Chapter 02.
- **Physical operation** — center / center-right; dominant machine, technician, service action.
- **Analytical reveal** — beneath / around the physical operation; Parts + Labor + Operating -> Total Cost.
- **Data capture** — deeper background or lower layer; restrained SAP / transaction structure.

The viewer should read:

`industrial work -> resources consumed -> cost becomes visible -> work becomes structured data`

### Motion sequence

1. **Transition from Chapter 02** — UI trace remains; one node leaves the university environment and reaches Traktor Nusantara / 2019.
2. **Industrial world assembles** — machine, technician, component and service point form as a coherent technical plate.
3. **Service begins** — one restrained maintenance/service action occurs.
4. **Resource consumption reveals itself** — Parts, Labor, and Operating signals emerge causally from the work.
5. **Cost assembles** — the three inputs converge into Total Cost.
6. **Data capture** — activity resolves into a restrained SAP / transaction layer and the scene settles.

### Important exclusions

Do not include yet:

- profitability / margin
- revenue
- inventory mismatch
- workforce balancing across multiple jobs
- Looker Studio dashboards
- AP automation
- multiple software logos
- large KPI panels
- multiple machines / departments

Scene 03.01 is only about:

**service work becoming cost visibility.**

---

## 03.02 — Understanding Profitability

### Purpose

Build directly on the cost structure from Scene 03.01 and introduce commercial meaning.

### Core message

**Revenue alone does not tell whether service work is good business; what matters is what remains after the work is done.**

### Narrative logic

Keep Total Cost from Scene 03.01.

Introduce service-contract / revenue value.

Resolve:

`Revenue - Cost -> Margin`

Then briefly compare a small number of service jobs/contracts with similar-looking revenue but different cost structures, producing different margins.

Avoid dashboard treatment. Keep it as a restrained industrial/commercial calculation plate.

### Inspection details

May contain:

- maintenance contracts around IDR 8–10B monthly revenue
- pricing coordination
- profitability analysis
- Service Profitability & Business Control context

---

## 03.03 — Recorded Inventory vs Reality

### Purpose

Show the difference between what the system says exists and what operational reality actually contains.

### Core message

**Recorded data must describe operational reality.**

### Narrative logic

Use a spare part from Scene 03.02 as the continuity object into an inventory / warehouse environment.

Initial state:

`SYSTEM RECORD = PHYSICAL STOCK`

Then small discrepancies appear and accumulate until two realities visibly diverge.

Represent the mismatch as a growing **gap / void**, not a giant alert.

Trace part movement through a causal path such as:

`Purchase -> Receive -> Store -> Issue -> Use`

Then introduce control logic after the mismatch is understood:

- FIFO
- min / target / max
- restrained working-capital / stock-control structure

The scene should not end only with finding a problem; it should show strengthened operational control.

### Inspection details

May contain:

- roughly IDR 10–20B inventory mismatch
- min-max control
- FIFO
- working-capital analysis
- factual context

---

## 03.04 — Improving the Process

### Purpose

Show the shift from analyzing/reporting problems toward changing how work itself moves.

### Core message

**Analysis naturally led to improving the process.**

### Preferred concrete example

Accounts-payable workflow digitization.

### Narrative logic

Begin with a document / information object moving through an inefficient chain:

`document -> spreadsheet -> email -> person -> checking -> another file -> approval -> AP`

Show repeated copying, handoffs, waiting, and duplication without exaggeration.

Then reorganize the flow around a structured common layer:

`input -> structured record -> automated routing -> review -> AP`

Google Sheets / Apps Script may be inspection evidence or restrained implementation cues; they should not dominate the canvas.

The mature ending is simply:

**fewer unnecessary movements and a cleaner process.**

### Inspection details

May contain:

- Google Sheets
- Apps Script
- AP digitization
- operational reporting
- Looker Studio
- workforce planning
- related improvement work

---

## 03.05 — Owning the Operation

### Purpose

Transition from working inside an established corporation to broad operating responsibility during entrepreneurship.

### Core message

**The role expanded from understanding parts of an operating system to helping the whole business operate.**

### Narrative logic

Let the organized process from Scene 03.04 recede inside the larger Traktor Nusantara structure.

A continuity node / operating thread leaves that established boundary.

A new industrial operation gradually assembles around the new entrepreneurial period.

The business flow should become visible as one connected chain:

`Customer -> Quotation -> Purchasing / Material -> Industrial Work -> Manpower -> Delivery -> Invoice -> Cash`

Industrial work can branch through restrained references to:

- casting
- machining
- fabrication
- pump / service

Do not present these as department cards.

Finance, manpower, purchasing, production, administration, and delivery should appear as necessary connected parts of the same operating chain.

### Chapter ending

Do not end on "resigned in 2024."

End with the wider operation functioning as an interconnected system.

The chapter should leave the viewer with the experience that operating a business requires the connections between commercial activity, materials, work, people, delivery, and money to function together.

### Inspection details

May contain:

- PT Cibuni Teknik Sejahtera
- 2022–2024
- co-founder
- casting / machining / fabrication / pump services
- legalities
- manpower
- finance
- operations
- administration
- departure in 2024

---

# Chapter Progression

The causal progression is currently:

### 03.01
`Operations -> Cost`

### 03.02
`Cost + Revenue -> Profitability`

### 03.03
`Records <-> Reality`

### 03.04
`Problem -> Better Process`

### 03.05
`Part of the Operation -> Whole Operation`

The visual progression should gradually widen the viewer's scope:

`one machine -> one service economics model -> material/warehouse reality -> workflow -> whole business`

This widening frame is part of the career story.

---

# Relationship to Later Chapter

Chapter 03 should stop before the PT Nobi Putra Angkasa / Odoo-era story.

The intended handoff is:

**Chapter 03:** experienced and operated interconnected business problems.

**Later chapter:** began deliberately building ERP, analytics, automation, process-control, and operational-intelligence systems around them.

This protects the later emergence of the **Analytical Systems Builder** identity from being rushed into Chapter 03.

---

# Visual Language

Preserve the portfolio's established universe:

- near-black / charcoal background
- warm amber / burnt orange as primary signal
- restrained cyan only where semantically earned
- sparse atmospheric stars
- elegant serif + technical mono
- strong negative space
- minimal main-canvas text
- inspection for explanation

Chapter 03 should feel more industrial / technical / professional than Chapter 02.

Prefer:

- physical industrial objects
- technical plate / cutaway logic
- material and information flows
- structured cost / process relationships
- causal transformations
- restrained data layers

Avoid:

- generic SaaS dashboards
- card grids
- floating software-logo collections
- telemetry clutter
- decorative motion without narrative meaning
- arbitrary tweening / teleporting
- literal animated resume chronology
- long explanatory text on canvas

---

# Current Animation-Exploration Entry Point

Do **not** animate the full Scene 03.01 or Chapter 03 yet.

The first bounded exploration is only:

**Scene 03.01 — Beat 01 to Beat 02**

`UI departure -> Traktor arrival -> industrial environment established`

The exploration question is:

**Can Chapter 02's visual language transform naturally into Chapter 03's industrial language without feeling gimmicky?**

Compare these motion treatments before implementation:

### A — Technical Assembly
Fine drafting / technical lines assemble the new industrial plate.

### B — Depth Reveal
The industrial environment already exists in darkness and becomes visible through restrained depth/light as the continuity node arrives.

### C — Material Transformation
Geometry / visual traces inherited from the Chapter 02 thesis apparatus transform into the new industrial service geometry.

**Current preferred exploration:** C — Material Transformation.

**Fallback:** A — Technical Assembly.

Do not animate all alternatives to completion. Compare enough to select the strongest structural direction.

---

# Owner Gate

Everything in this document is a **provisional guideline** and may still be revised through visual exploration.

Nothing becomes frozen solely because it is documented here.

For each scene:

`static direction -> owner selection -> composition/geometry lock -> bounded motion -> review -> correction -> owner approval -> freeze`

Default stop condition:

**Do not freeze automatically. Stop for owner visual review.**
