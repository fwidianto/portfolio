# Odoo ERP Analytics — LinkedIn Polish Pass 2 Plan

Status: Pass 2 design and content plan  
Date: 2026-07-07  
Goal: define the exact direction before editing `Projects/Odoo-ERP-Analytics.html`.

This plan follows the 4-pass workflow:

1. Pass 1 — Audit against guideline
2. Pass 2 — Design and content plan
3. Pass 3 — Controlled implementation
4. Pass 4 — LinkedIn packaging

Pass 2 does not edit the live page. It decides what should change, what should remain, and what should be avoided.

---

## Target outcome

The Odoo ERP Analytics page should become a LinkedIn-post-ready project showcase.

The page should feel:

- polished enough to share publicly,
- close to the frozen homepage character,
- calm and business-oriented,
- evidence-led,
- not too technical,
- not like a generic developer portfolio,
- not like an internal documentation dump.

The visitor should leave with this message:

```text
Fauzan understands messy business processes, translates them into ERP/data logic, and builds practical dashboard views using business judgment and AI-assisted execution.
```

---

## Design principle for this pass

The work is not a redesign. It is **editorial curation and visual hierarchy polish**.

Do not add complexity unless it clarifies the story.

The page should move from:

```text
Many useful sections explaining the project
```

to:

```text
A guided case-study journey that feels intentional and shareable
```

---

## Proposed final page journey

Recommended page flow after polish:

```text
1. Hero
2. Business Context
3. My Role
4. Business Process
5. Visual Proof
6. Review Logic / How the Dashboard Reads the Process
7. Architecture / Data Flow
8. Business Value
9. What This Proves
10. Public-safe note / CTA
```

This keeps the original case-study logic:

```text
Business problem
-> Process understanding
-> Business logic
-> Technology
-> Evidence
```

but makes it more editorial and LinkedIn-ready.

---

## Section-by-section plan

### 1. Hero

**Decision:** Keep, lightly polish only.

Current hero already has a strong line:

```text
Turning scattered ERP transactions into structured business flow, data logic, and dashboard views.
```

This should remain because it is business-first and clear.

**Possible improvements for Pass 3:**

- Make the right-side snapshot card feel more premium and less dense.
- Keep tags, but consider reducing from 5 tags to 4 if the hero feels crowded.
- Make the CTA feel more polished, possibly adding a secondary anchor to dashboard evidence.

**Do not:**

- Rewrite the hero into developer-style wording.
- Add too many tool names.

---

### 2. Business Context

**Decision:** Keep and preserve the core message.

The current heading is strong:

```text
The problem was not missing data. It was a scattered business story.
```

This should stay.

**Possible improvements for Pass 3:**

- Keep the 3 cards, but make them visually lighter and less repetitive.
- Use this section as the emotional/business entry point before showing the process diagram.

---

### 3. My Role

**Decision:** Add a new section after Business Context and before Business Process.

This is the most important content addition.

Reason:

The page explains the project, but LinkedIn/recruiter visitors need a clearer answer to:

```text
What did Fauzan personally do here?
```

Use content from `docs/odoo-case-study-job-search-assets.md`.

**Suggested section copy:**

Eyebrow:

```text
MY ROLE
```

Heading:

```text
Turning ERP complexity into business-readable review logic
```

Lead:

```text
I mapped the operational flow behind sales orders and internal orders, reviewed how ERP records connect across purchasing, production, delivery, invoicing, and payment, then translated the logic into dashboard views that support operational review.
```

Cards:

1. Mapped the business flow
2. Reviewed the ERP data logic
3. Built review-oriented dashboard views
4. Used AI-assisted iteration responsibly
5. Protected confidential data

**Visual direction:**

- Use a premium card strip or compact 5-card grid.
- Keep it scannable.
- Avoid long paragraphs.

---

### 4. Business Process

**Decision:** Keep the current diagram and do not edit the SVG.

The diagram is acceptable for now and should be treated as approved-enough.

**Rename / reframe:**

Change section feeling from:

```text
Process Complexity
```

to:

```text
Business Process
```

Possible heading:

```text
The business flow behind the dashboard
```

Possible lead:

```text
Before the dashboard could become useful, the process itself had to be understood. A case could begin from Sales Order or Internal Order, then move through BOQ, stock checking, purchasing, production, delivery, and invoice.
```

**Pass 3 boundary:**

- Do not touch inline SVG.
- Do not edit diagram labels.
- Only adjust surrounding heading, copy, spacing, and framing.

---

### 5. Visual Proof

**Decision:** Upgrade as the main showcase section.

The dashboard previews are the most LinkedIn-friendly evidence. They should feel like the page's main proof, not just another content block.

**Possible improvements for Pass 3:**

- Make screenshot frame more prominent.
- Add a stronger intro line:

```text
The dashboard turns the process into reviewable visibility.
```

- Keep public-safe caption, but make it visually secondary.
- Consider making the first dashboard visual larger and cleaner.
- Keep guide chips, but ensure they look intentional and not noisy.

**Do not:**

- Add more screenshots unless they improve the story.
- Make the section too crowded.

---

### 6. Review Logic / How the Dashboard Reads the Process

**Decision:** Merge or compress repeated explanation sections.

Current sections that overlap:

- Approach / Workflow
- How the Project Was Built
- Output Evidence
- Review Signals
- Dashboard Modules
- Skills Demonstrated

These are all useful, but together they make the page feel long and documentation-like.

**Recommended curation:**

Keep the strongest parts:

- the logic translation board,
- the output evidence table,
- the review-signal screenshots,
- a small dashboard module summary if needed.

Compress or merge weaker repetition.

**Possible new framing:**

```text
How the dashboard reads the process
```

This can combine:

- ERP source / record,
- business meaning,
- review output,
- examples of review signals.

---

### 7. Architecture / Data Flow

**Decision:** Keep, but make it supporting material.

Architecture is important, but it should not dominate the LinkedIn-showcase version.

**Possible improvements for Pass 3:**

- Keep the 3-stage pipeline: Input -> Data & Logic Layer -> Review Visibility.
- Make the section more compact.
- Keep technical terms but avoid making it feel like the main identity.

---

### 8. Business Value

**Decision:** Strengthen and make more memorable.

Current before/after content is useful, but the section should connect more directly to why the project matters.

Possible heading:

```text
A dashboard is useful only when the business logic behind it is trusted
```

Possible lead:

```text
The value of this project was not only the dashboard output. The stronger value was creating a clearer review layer from messy ERP records, so operational and financial progress could be checked with better context.
```

Business value cards:

1. Clearer operational review
2. Better data interpretation
3. Improved cross-functional visibility
4. Reusable analytics foundation

---

### 9. What This Proves

**Decision:** Add or convert the current Skills Demonstrated section into a stronger final takeaway.

Current `SKILLS DEMONSTRATED` is useful, but it feels like a checklist.

For LinkedIn-post readiness, the ending should feel more confident and personal.

Suggested heading:

```text
I can bridge business operations, ERP data, and AI-assisted analytics execution
```

Suggested paragraph:

```text
This project represents the type of work I want to keep doing: understanding messy operational processes, translating them into reliable data logic, and building dashboard views that make business review easier. It combines process understanding, analytical judgment, stakeholder context, and practical technical execution.
```

Proof points:

- Business process first, not table-first.
- ERP records interpreted before becoming metrics.
- Confidential work turned into public-safe portfolio evidence.
- AI used as an accelerator while business judgment remains human-led.

---

### 10. Public-safe note / CTA

**Decision:** Keep, but do not make it the emotional endpoint.

Confidentiality is important, but the page should first end with confidence, then show the public-safe note as a trust layer.

Possible order:

```text
What This Proves
-> Public-safe case study note
-> CTA buttons
```

---

## Specific implementation recommendations for Pass 3

### Recommended changes

1. Add `MY ROLE` section after `#business-context`.
2. Rename/reframe Process Complexity copy to Business Process, without touching the SVG.
3. Make Visual Proof section more visually prominent.
4. Compress or reduce repetition between Approach / Workflow, How Project Was Built, Dashboard Modules, and Skills Demonstrated.
5. Convert Skills Demonstrated into `WHAT THIS PROVES` or add a stronger takeaway before the confidentiality CTA.
6. Keep design aligned with homepage: mature, calm, editorial, readable.

### Avoid in Pass 3

- Do not touch Website Updates.
- Do not edit the Business Process SVG.
- Do not add new decorative animation.
- Do not add many new cards.
- Do not make the page more developer-heavy.
- Do not rewrite the page into a SaaS landing page.

---

## Proposed Pass 3 implementation strategy

Use one controlled implementation pass with a small number of high-impact edits:

```text
1. Add My Role section.
2. Update section labels/headings for Business Process and What This Proves.
3. Improve Visual Proof hierarchy.
4. Reduce duplicated section weight where possible.
5. Verify no SVG changes.
```

If direct editing is risky because of the huge inline SVG, use Codex for Pass 3.

---

## Codex-safe Pass 3 prompt

```text
You are working in `fwidianto/portofolio`.

Task:
Polish `Projects/Odoo-ERP-Analytics.html` so it becomes LinkedIn-post-ready and visually closer to the frozen homepage character.

Read first:
- docs/core/portfolio-design-philosophy.md
- docs/design/visual-direction.md
- docs/design/information-architecture.md
- docs/case-studies/odoo-linkedin-polish-pass-1-audit.md
- docs/case-studies/odoo-linkedin-polish-pass-2-plan.md
- docs/odoo-case-study-job-search-assets.md

Important boundaries:
- Do NOT edit the inline Business Process SVG.
- Do NOT change diagram arrows, labels, or layout.
- Do NOT update Website Updates.
- Do NOT redesign the whole page.
- Keep the style mature, calm, business-oriented, editorial, readable, and not developer-template-like.

Required changes:
1. Add a concise `MY ROLE` section after `#business-context` and before `#process-complexity`.
2. Reframe the Process Complexity section as `Business Process` in the surrounding copy only.
3. Make `VISUAL PROOF` feel more like the showcase section.
4. Reduce repetition across Approach / Workflow, How Project Was Built, Dashboard Modules, and Skills Demonstrated where possible.
5. Strengthen the ending by converting or supplementing `SKILLS DEMONSTRATED` into `WHAT THIS PROVES`.
6. Keep the confidentiality CTA, but do not let it be the only emotional endpoint.

Validation:
- Confirm the inline SVG was not modified.
- Confirm page still loads responsively.
- Run `git diff --check`.

Commit message:
`polish: make odoo case study linkedin ready`
```
