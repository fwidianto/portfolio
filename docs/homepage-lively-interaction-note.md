# Homepage Liveliness and Interaction Note

Last updated: 2026-07-03  
Status: Active note for future homepage development  
Related files:
- `docs/homepage-improvement-plan.md`
- `docs/portfolio-case-study-development-template.md`
- `index.html`

---

## Purpose

The homepage should not only be clearer in positioning. It should also feel more lively, active, and guided.

Liveliness does not mean making the page flashy. It means adding small interactions, visual rhythm, and guided elements that help recruiters and business readers understand how Fauzan works.

---

## Direction

The homepage should feel:

- active
- guided
- human
- business-focused
- warm
- not static
- not too developer-like
- not like a generic resume page

The homepage should still avoid becoming:

- too animated
- too noisy
- too game-like
- too SaaS-like
- too AI-heavy

---

## Interaction ideas for future phases

Possible interactive elements:

1. Hero focus accordion
   - Shows how Fauzan works in a simple expandable flow.
   - Phase 1 already introduced a small native HTML `details` interaction.

2. Project filter chips
   - Let users filter projects by focus such as ERP Analytics, Automation, Reporting, Market Data, or AI-assisted Workflow.

3. Flagship Odoo preview interaction
   - Show a small public-safe preview panel with guide chips such as Traceability, Material Tracking, Review Signals, and Output Evidence.

4. Working-style flow
   - Interactive or hoverable steps:
     - Understand business question
     - Map process and data
     - Validate rules
     - Build reporting logic
     - Turn into review-ready visibility

5. Skills by use-case
   - Instead of a flat tool list, show tabs or grouped cards such as ERP, Reporting, Automation, AI-assisted Delivery, and Business Review.

---

## Phase 1 decision

Phase 1 should stay focused on positioning and copy, but it can include one light interactive feature.

Implemented Phase 1 direction:

- Updated hero positioning toward Business Systems & Operations Analytics.
- Updated role label and hero proof points.
- Rewrote About / Analytics Focus cards around business process, data validation, review-ready reporting, and AI-assisted iteration.
- Added a small native HTML interactive focus accordion in the hero.

This gives the homepage a more active feel without requiring JavaScript or a heavy redesign.

---

## Phase 2 decision

Phase 2 strengthened the homepage structure and added more guided movement without making the page flashy.

Implemented Phase 2 direction:

- Strengthened the `How I Work` section into a six-step workflow.
- Added hoverable workflow cards to make the working logic more active and scannable.
- Added a flagship Odoo ERP Analytics case study block before the general project grid.
- Improved project hierarchy by making Odoo the main proof point while keeping other projects as supporting examples.
- Kept interaction useful, not decorative.
- Kept the tone warm, calm, business-focused, and public-safe.

The Phase 2 interaction is intentionally simple: hoverable cards and guided proof blocks, not heavy JavaScript or carousel behavior.

---

## Future rule

For future homepage updates, every interactive feature should answer this question:

```text
Does this help the reader understand Fauzan's working logic more clearly?
```

If the interaction is only decorative, skip it.
