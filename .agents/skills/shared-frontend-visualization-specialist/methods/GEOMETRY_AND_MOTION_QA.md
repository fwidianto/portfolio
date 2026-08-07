# Ariadne Method — Geometry and Motion QA

**Use when:** connectors, rails, paths, timelines, process maps, diagrams, moving pointers/tokens, animated SVG, or other geometry must coincide precisely.

## Objective

Prevent technically plausible but visibly wrong geometry. Deterministic geometry checks happen before optical review.

## Core invariant

Whenever technically possible:

```text
visible path
=
animation path
=
shared geometry definition
```

Avoid unrelated hardcoded coordinates for the same geometry. If sharing one source is impossible, document why and measure the deviation.

## Coordinate-space rules

- identify containing block or SVG viewport;
- make transform origin explicit;
- make `viewBox`, scaling, and transform-box assumptions explicit;
- do not mix page/local/SVG coordinates without conversion;
- verify responsive scaling preserves visible-path/animated-object relationship.

## Path congruence gate

For a moving object intended to sit on a visible path:

1. identify its intended anchor/center;
2. sample at minimum 0%, 25%, 50%, 75%, and 100%/just before loop reset;
3. measure perpendicular deviation from the visible path;
4. repeat at every required breakpoint when geometry changes.

Default thin-line tolerance:

- target: within 1 CSS px;
- maximum before explicit justification: 2 CSS px.

Inspect loop/reset separately.

## Connector ownership

- start terminates on the source owner;
- end terminates on the destination owner;
- no accidental stroke continuation past terminal nodes;
- arrows/markers are positioned from the path, not approximate nearby coordinates;
- no unintended crossings through labels/nodes;
- repeated connectors use coherent stroke/cap/join/marker treatment.

## Optical correction

After deterministic QA passes, render and inspect optically. If a nudge is needed, prefer adjusting shared geometry/anchors rather than separately moving only one representation.

## Semantic economy

If motion already communicates direction/progression, static arrows/chevrons must add another purpose or be removed. Reduced-motion meaning should preferably come from structural layout rather than redundant symbols.

## Responsive geometry

At desktop/tablet/mobile, confirm path ownership, path congruence, process meaning, readable labels, and intentional simplification. Horizontal flow may become vertical if semantic order is preserved.

## Evidence

```text
Geometry source:
Coordinate space:
Transform origin:
Breakpoints checked:
Progress samples checked:
Maximum measured path deviation:
Connector endpoint result:
Loop/reset behavior:
Reduced-motion geometry:
Known deviations:
```

This method is deterministic QA, not a substitute for image-based visual review.
