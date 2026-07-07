# Odoo ERP Analytics — LinkedIn Polish Pass 1 Audit

Status: Pass 1 audit  
Date: 2026-07-07  
Goal: make the Odoo ERP Analytics case-study page ready to support a LinkedIn post and feel closer to the polished homepage character.

This document records the 4-pass workflow and the first-pass audit before any visual implementation changes.

---

## 4-pass workflow

1. **Pass 1 — Audit against guideline**
   - Check the current Odoo page against the portfolio design philosophy, information architecture, visual direction, and LinkedIn-post-ready objective.
   - Identify what feels off before editing.

2. **Pass 2 — Design and content plan**
   - Decide what to change, what to keep, and what to simplify.
   - Prioritize high-impact visual rhythm, section hierarchy, and recruiter readability.

3. **Pass 3 — Controlled implementation**
   - Apply HTML/CSS polish carefully.
   - Do not touch the approved Business Process SVG unless required.
   - Keep the implementation aligned with the homepage visual character.

4. **Pass 4 — LinkedIn packaging**
   - Prepare LinkedIn post copy, project caption, carousel/story outline, and Featured section wording.
   - Use the polished page as the destination link.

---

## Source-of-truth guidance used

### Portfolio design philosophy

The portfolio should shift from:

```text
Look at what I built.
```

to:

```text
Understand how I think.
```

The page should help visitors discover systems thinking, practical solution-building, and AI-assisted execution through evidence rather than direct claims.

### Case-study flow

Current intended case-study flow:

```text
Business problem
-> Process understanding
-> Business logic
-> Technology
-> Evidence
```

### Visual direction

The page should feel:

- mature,
- calm,
- business-oriented,
- editorial,
- readable,
- not flashy,
- not too colorful,
- not developer-template-like.

### Feature filter

Avoid:

- decorative animation,
- extra cards without story value,
- long text blocks,
- tool dumping,
- flashy SaaS-style presentation,
- clever interactions that do not clarify the experience.

---

## Current page strengths

### 1. Strong business-first hero direction

The hero already starts with a business-system statement rather than a technology-first claim:

```text
Turning scattered ERP transactions into structured business flow, data logic, and dashboard views.
```

This is aligned with the design philosophy because it explains the business transformation before listing tools.

### 2. Project Snapshot is useful

The snapshot makes the project understandable quickly: domain, system, focus, output, role, and proof. This is good for recruiters and LinkedIn visitors who scan before reading.

### 3. Business Context is clear

The section already frames the problem well:

```text
The problem was not missing data. It was a scattered business story.
```

This is one of the strongest lines on the page and should be preserved.

### 4. Business Process diagram is acceptable for now

The diagram is not perfect, but it is acceptable enough to keep. It communicates operational complexity and should not be the focus of the next polish pass.

### 5. Visual evidence exists

The page already has public-safe dashboard visuals and review-signal visuals. This is important for LinkedIn because people are more likely to open and trust a project when they see concrete evidence.

### 6. Business Value and Skills sections are present

The ending already explains before/after value and skills demonstrated. The page has enough raw material to become LinkedIn-ready without major new content.

---

## Current page issues

### 1. The page has too many explanation sections with similar meaning

Several sections repeat the same core idea:

- Business Context
- Process Complexity
- Visual Proof
- Approach / Workflow
- Architecture / Data Flow
- How the Project Was Built
- Output Evidence
- Review Signals
- Dashboard Modules
- Business Value
- Skills Demonstrated

The repetition is useful for documentation, but it may feel long and heavy for LinkedIn traffic. A visitor may understand the project before the page ends, then feel that the page continues explaining the same thing.

### 2. The strongest personal role is still indirect

The page explains the project well, but it does not yet spotlight the user's role strongly enough as a distinct section. The Project Snapshot has a role line, but the case-study body needs a clearer recruiter-readable section answering:

```text
What did Fauzan personally do here?
```

This was already prepared in `docs/odoo-case-study-job-search-assets.md` and should be used in a later pass.

### 3. The visual rhythm is still more documentation-like than editorial

Many sections use similar card grids. This creates consistency, but also makes the page feel like a long report rather than a premium project showcase.

For LinkedIn-post-readiness, the page should feel more like:

```text
hero -> clear problem -> role -> one strong process visual -> strong dashboard proof -> business value -> closing proof
```

and less like a full internal documentation page.

### 4. The Visual Proof section should become more prominent

The dashboard screenshots/previews are the main visual evidence. They should feel like the highlight, not just another section between many cards.

Potential issue:

- The Business Process diagram currently attracts attention because it is large and complex.
- The dashboard proof should compete better visually because LinkedIn visitors will care about final output evidence.

### 5. Some section names are accurate but less elegant

Current names like `REVIEW SIGNALS / EXCEPTION INSIGHTS`, `DASHBOARD MODULES`, and `SKILLS DEMONSTRATED` are clear, but they feel more like documentation labels than an editorial case-study journey.

They could be softened later, for example:

- `REVIEW SIGNALS / EXCEPTION INSIGHTS` -> `Review Logic`
- `DASHBOARD MODULES` -> `What the dashboard supports`
- `SKILLS DEMONSTRATED` -> `What this project proves`

### 6. The final CTA is practical but not emotionally strong

The final section emphasizes confidentiality, which is important, but the page may need a stronger final takeaway before or within the CTA:

```text
This project shows how I bridge business process understanding, ERP data logic, and AI-assisted dashboard execution.
```

The page should end with confidence, not only a disclaimer.

### 7. Inline CSS and page-level complexity are high

The page contains a lot of page-specific CSS and a huge inline SVG. This is manageable, but future edits should be controlled. Any broad visual polish should avoid touching the SVG and avoid rewriting too much at once.

---

## Pass 1 conclusion

The current page is already good as a portfolio case study, but not yet fully polished as a LinkedIn-post destination.

The biggest improvement is not more content. The biggest improvement is **curation**:

```text
Reduce repetition.
Make Fauzan's role clearer.
Make visual evidence more prominent.
Make the ending more memorable.
Preserve calm, mature, business-oriented homepage character.
```

---

## Recommended Pass 2 plan

Pass 2 should produce a concrete edit plan with these priorities:

1. **Add a My Role section**
   - Place after Business Context and before Business Process.
   - Use the copy from `docs/odoo-case-study-job-search-assets.md`.
   - Keep it concise and recruiter-readable.

2. **Reframe Process Complexity as Business Process**
   - Keep the current diagram.
   - Make the surrounding copy calmer and more intentional.
   - Do not edit the SVG.

3. **Upgrade Visual Proof as the showcase section**
   - Make dashboard previews feel more central.
   - Improve spacing and hierarchy around screenshots.

4. **Compress or merge repeated explanatory sections**
   - Review whether Approach / Workflow, Architecture / Data Flow, and How the Project Was Built all need to remain as separate large sections.
   - Keep the strongest parts, reduce duplication.

5. **Strengthen the ending**
   - Add or refine a final `What This Proves` message.
   - Keep confidentiality note, but do not let it be the emotional endpoint.

6. **Keep implementation conservative**
   - No major redesign.
   - No decorative animation.
   - No changes to Website Updates.
   - No changes to approved Business Process SVG.
