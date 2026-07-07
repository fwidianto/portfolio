# Odoo ERP Analytics process flow section direction

Direction approved for Codex implementation.

Placement: add after the Business Context section and before dashboard/output proof on `Projects/Odoo-ERP-Analytics.html`.

Goal: explain the business process complexity behind the dashboard with a visual-first section. The viewer should understand the flow mainly from the diagram, not from long text.

Use general labels: BOQ instead of RKB, and PR instead of ROP.

Section copy:

Eyebrow: Process Complexity

Title: The business flow behind the dashboard

Lead: Before the dashboard could become useful, the process itself had to be understood. A case could begin from Sales Order or Internal Order, then move through BOQ, stock checking, purchasing, production, delivery, and invoice.

Quick chips: Sales Order / Internal Order; BOQ; Budget Checks; Delivery to Invoice.

Diagram heading: Sales Order + Internal Order process map

Bottom explanation: In short: the flow starts from Sales Order or Internal Order, then moves into BOQ and stock checking. If stock is available, the case can continue more directly into production. If not, it branches into PR, budget checking, purchase order, approval, and material receipt before returning to production. From there, it continues to delivery and invoice, while the dashboard turns the whole flow into progress, budget, profitability, issue, and follow-up visibility.

Diagram logic:
- Estimator branches to Sales Order and Internal Order.
- Sales Order and Internal Order converge into BOQ.
- BOQ goes to Check Stock.
- If stock is enough, continue to Manufacture Order.
- If stock is not enough, go to Create PR, Compare Budget to BOQ, Purchase Order, Compare Budget with PR, Approved, Material Received, then Manufacture Order.
- Then continue to Delivery and Invoice.
- Dashboard Review sits on the right as an analytics output layer with light dashed review signals.

Dashboard Review content:
- Progress: order stage
- Budget: control check
- Profitability: margin view
- Issues: gaps / blockers
- Follow-up: next action

Small notes inside diagram:
- Mixed cases: Some cases combine order, stock, purchase, and production logic.
- Why it mattered: Each branch changes timing, control, and interpretation.

Visual style:
- Match the existing light/warm Odoo case-study page.
- Background #f7f9fc.
- Text #0f172a.
- Muted text #64748b.
- Main accent #1f4d5a.
- Operations green #2f7c67.
- Procurement green #6f91a0.
- Control amber #c0842d.
- Warm card #f6f2ea.
- White card #ffffff.
- Soft border #d7e2df.

Rules:
- Light and warm, not dark blue.
- No black canvas or black gaps.
- Rounded cards and rounded process boxes.
- Diamonds for decision/control points.
- Subtle swimlane backgrounds.
- Thin calm arrows.
- Dashboard Review should not dominate the diagram.
- Use horizontal scroll on small screens.
- Do not add a public dashboard preview CTA.
- Do not reintroduce the removed Why this page matters section.
- Update index.html Website Updates latest 3 and website-updates.html latest 10 using visitor-facing wording.
- Validate responsive layout and run git diff --check.
