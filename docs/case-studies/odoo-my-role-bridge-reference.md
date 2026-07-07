# Odoo My Role Bridge Reference

Reference date: 2026-07-08

This file is the implementation reference for replacing the `#my-role` section in `Projects/Odoo-ERP-Analytics.html`.

## Design intent

The My Role section should visually explain that the role is a bridge between operational reality and dashboard review logic.

The required desktop composition is:

```text
             My Role
          [clean bridge]
[left container]   gap   [right container]
```

The layout must stay side-by-side as long as possible. On narrow screens, use horizontal scrolling rather than stacking too early, because the bridge metaphor depends on the two containers being visible as opposing sides.

## Current target content

Section heading:

- Eyebrow: `MY ROLE`
- Heading: `Turning ERP complexity into business-readable review logic`
- Lead: `My role was to bridge the gap between operational reality and dashboard review, so scattered ERP records could become a clearer business story.`

Left container:

- Eyebrow: `THE CHALLENGE`
- Title: `Understanding the business flow`
- Body: `The work started from real operational questions across sales, purchasing, production, delivery, invoicing, and payment.`
- Items:
  - `01` — `Business process` — `How the work actually moved across teams.`
  - `02` — `ERP records` — `Where the data appeared in Odoo.`
  - `03` — `Review questions` — `What people needed to check or follow up.`

Right container:

- Eyebrow: `THE OUTCOME`
- Title: `Delivering review visibility`
- Body: `The output needed to make interpretation easier: progress visibility, issue signals, and follow-up points that could support review.`
- Items:
  - `01` — `Dashboard rules` — `How ERP records should be classified.`
  - `02` — `Review signals` — `Progress, issue, and watchlist context.`
  - `03` — `Follow-up visibility` — `What needed action or discussion.`

Summary line:

`In short: the bridge represents the role itself — connecting operational reality with dashboard review logic.`

## Layout logic

Use a stage/grid structure similar to this:

```css
#my-role {
  --role-card-width: 370px;
  --role-bridge-gap: 250px;
  --role-bridge-overlap: 26px;
  --role-stage-min-width: calc((var(--role-card-width) * 2) + var(--role-bridge-gap));
}

#my-role .role-bridge-scroll {
  overflow-x: auto;
  overflow-y: visible;
}

#my-role .role-bridge-stage {
  position: relative;
  min-width: var(--role-stage-min-width);
  width: var(--role-stage-min-width);
  padding-top: 136px;
  margin: 0 auto;
}

#my-role .role-bridge-grid {
  display: grid;
  grid-template-columns: var(--role-card-width) var(--role-bridge-gap) var(--role-card-width);
}

#my-role .role-bridge-layer {
  position: absolute;
  top: 0;
  left: 50%;
  width: calc(var(--role-bridge-gap) + (var(--role-bridge-overlap) * 2));
  transform: translateX(-50%);
  z-index: 8;
  pointer-events: none;
}
```

Important: do not add a media query that changes the two cards to `grid-template-columns: 1fr` too early. The current preferred behavior is horizontal scroll on narrow screens.

## Bridge design requirements

Use inline SVG for the bridge. The bridge should be simple and deliberate, not decorative:

- one smooth arch
- one clean deck
- simple railings
- evenly spaced vertical posts
- two solid abutment/foot blocks at both ends
- no pagoda-style towers
- no excessive details

The bridge feet/abutments must rest fully on the top inner areas of both cards, not merely touch with their tips. The bridge should overlap the top of each card by roughly 16–28px.

## Badge requirements

Use number badges only, not icons.

```css
#my-role .role-bridge-badge {
  display: grid;
  place-items: center;
  line-height: 1;
  text-align: center;
  letter-spacing: 0;
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
}
```

Use an inner span for the number if needed to fine tune vertical centering.

## Implementation constraints

- Replace only the section beginning with `<section class="case-section role-section" id="my-role">` and ending before `<section class="case-section process-complexity" id="process-complexity">`.
- Add CSS scoped under `#my-role`.
- Do not touch `#business-context`.
- Do not touch the Business Process / Process Complexity SVG.
- Do not modify Visual Proof, Architecture, Business Value, or other unrelated sections.
- Run `git diff --check` before committing.
- Verify the Business Process SVG content remains unchanged.
