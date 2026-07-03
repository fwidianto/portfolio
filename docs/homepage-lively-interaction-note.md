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

Liveliness does not mean making the page flashy. It means adding visual rhythm, guided elements, and useful interaction that help recruiters and business readers understand how Fauzan works.

A simple text accordion is not enough for the intended interaction direction. Future interaction should feel more meaningful than expanding and collapsing text.

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
- text-only interaction that does not add real value

---

## Interaction ideas for future phases

Possible interactive elements:

1. Project filter chips
   - Let users filter projects by focus such as ERP Analytics, Automation, Reporting, Market Data, or AI-assisted Workflow.
   - This is more useful than a text accordion because it helps different readers navigate the portfolio.

2. Flagship Odoo preview interaction
   - Show a small public-safe preview panel with guide chips such as Traceability, Material Tracking, Review Signals, and Output Evidence.
   - This should help readers understand the Odoo case study before opening it.

3. Working-style flow
   - Interactive or hoverable steps:
     - Understand business question
     - Map process and data
     - Validate rules
     - Build reporting logic
     - Turn into review-ready visibility
   - The interaction should support scanning and understanding, not hide important copy.

4. Skills by use-case
   - Instead of a flat tool list, show tabs or grouped cards such as ERP, Reporting, Automation, AI-assisted Delivery, and Business Review.

5. Public-safe visual preview
   - Use small static or interactive visual cards based on public-safe screenshots or recreated dashboard previews.
   - The goal is to make the homepage feel alive through evidence, not through unnecessary motion.

---

## Phase 1 decision

Phase 1 focused on positioning and copy.

Implemented Phase 1 direction:

- Updated hero positioning toward Business Systems & Operations Analytics.
- Updated role label and hero proof points.
- Rewrote About / Analytics Focus cards around business process, data validation, review-ready reporting, and AI-assisted iteration.
- Initially added a native HTML hero focus accordion.

Follow-up decision:

- The hero focus accordion was removed because it was only expandable text and did not match the intended meaning of interactive.
- Future interaction should be more useful, visual, or navigational.

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
Does this help the reader explore evidence or understand Fauzan's working logic more clearly?
```

If the interaction only expands hidden text or adds decoration, skip it.
