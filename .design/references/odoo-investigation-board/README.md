# Odoo ERP Analytics — Investigation Board Reference

Status: **reference only**. Do not deploy or merge directly into the homepage.

## Purpose

This reference captures the approved visual direction for the homepage Odoo ERP Analytics flagship section:

- scattered ERP evidence on the left;
- a clipped `Analysis & Business Logic` sheet in the center;
- structured operational outcomes on the right;
- crossed evidence-style connector lines with pins;
- icons at every evidence, analysis, and outcome point;
- subtle relationship highlighting and automatic animation;
- desktop three-column composition with a vertical tablet/mobile fallback.

## Files

- `prototype.html` — standalone, code-native HTML/CSS/JavaScript reference.

The prototype is not production-integrated. Its copy, classes, CTA target, spacing, and responsive behavior must be adapted to the current homepage rather than pasted blindly.

## Approved content structure

### Evidence

- Sales
- Purchase
- Production
- Delivery
- Invoice
- Payment
- Status mismatch
- Missing follow-up
- Unusual cases
- References
- Delayed progress
- Profitability or revenue?

### Analysis & Business Logic

1. Connect flow
2. Validate fields
3. Review references
4. Diagnose exceptions
5. Define report logic

### Outcomes

- Order Progress
- Profitability Signals
- Exception Visibility
- Follow-up Points
- Decision Support

## Later Codex implementation boundaries

1. Read the current `main` branch before editing.
2. Replace only the existing Odoo flagship section and its related styles.
3. Preserve the current homepage hero, navigation, experience, skills, thinking-process section, analytics, and footer.
4. Keep all visible UI code-native; do not use a screenshot as the section.
5. Reuse the site's existing palette, typography, button styles, and container rhythm.
6. Preserve the reference's evidence → analysis → outcomes story.
7. Keep connector lines and icons meaningful rather than decorative.
8. On mobile, convert the board into a readable vertical sequence without horizontal scrolling.
9. Validate desktop, tablet, and mobile renders before proposing a merge.
10. Stop without deploying until the result is visually approved.
