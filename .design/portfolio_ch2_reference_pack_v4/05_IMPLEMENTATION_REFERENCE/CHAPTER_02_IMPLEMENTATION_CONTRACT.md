# Portfolio — Chapter 02 Implementation Contract

**Status:** READY FOR OWNER APPROVAL / NOT AUTHORIZED TO IMPLEMENT  
**Chapter:** College Years (2014–2019)  
**Authority inputs:** frozen Chapter 02 baseline + final visual design board + Motion Storyboard v2 + real reference assets  
**Implementation repository:** `fwidianto/portfolio`

This contract converts the approved Chapter 02 narrative and current visual/motion work into a bounded engineering specification. It does **not** authorize Chapter 02 frontend development. The existing Hero review gate remains the implementation boundary.

---

## 1. Exact visible outcome

After the Red Dwarf Hero, the visitor enters one continuous College Years chapter with four visually distinct but connected scenes:

1. Entering the International Program
2. Finding My Footing
3. 2018 — Astra → Tokyo
4. Coming Back and Finishing

The chapter must feel like one continuous journey rather than four cards or four pages.

The visitor must be able to understand the complete story by scrolling only. Motion enriches sequence and cause-and-effect; it must never be required to reveal essential facts.

---

## 2. Architecture decision

### Continue the current portfolio architecture

Use:

- semantic HTML;
- the existing `CSS/main.css`;
- plain browser JavaScript;
- inline SVG / DOM graphics for cohort, process, route, technical traces, and diagram overlays;
- normal responsive `<picture>` / `<img>` elements for real photographs.

Do **not** add:

- React;
- Vite;
- Next.js;
- GSAP;
- Three.js;
- WebGL for Chapter 02;
- Canvas for ordinary scene graphics;
- external animation libraries;
- a backend;
- a new build pipeline.

### Why

Chapter 02 is predominantly editorial, documentary, and diagrammatic. SVG + DOM are a better fit than Canvas/WebGL because they:

- preserve text and accessibility;
- scale cleanly across responsive layouts;
- allow precise line/path animation;
- remain easy to inspect and maintain in the current static site;
- avoid a new runtime dependency.

WebGL remains appropriate for the Red Dwarf Hero only. Chapter 02 should deliberately move away from literal astronomy.

---

## 3. Proposed implementation files

When implementation is later authorized, keep the change surface bounded to:

```text
index.html
CSS/main.css
JS/chapter-02.js                 # new, isolated Chapter 02 motion controller
Assets/chapter-02/
```

No other project pages or architecture should change.

A separate `JS/chapter-02.js` is preferred over adding another large inline block to `index.html`; this is one justified new file that keeps the chapter logic isolated and reversible.

---

## 4. Asset map

Canonical implementation names should remove the ambiguity present in the current reference archive.

```text
Assets/chapter-02/
  ui-makara.png
  astra-process-environment.webp
  astra-bunch-weighing.webp
  tokyo-lab-group.webp
  tokyo-bicycle.webp
  thesis-system-diagram.webp
  thesis-experiment-setup.webp
```

### Source mapping

- `astra-process-environment.webp`
  - source: authentic Astra sterilizer / process-environment image.

- `astra-bunch-weighing.webp`
  - source: authentic Fresh Fruit Bunch weighing / experimentation image.

- `tokyo-lab-group.webp`
  - source content: real Tokyo Tech group/laboratory photo.
  - current v2 filename is misleading: the group image is stored as `tokyo_bicycle_photo.jpeg`.

- `tokyo-bicycle.webp`
  - source content: real Japan bicycle photo.
  - current v2 filename is misleading: the bicycle image is stored as `tokyotech_group_photo.jpeg`.

- `thesis-system-diagram.webp`
  - source: authentic thesis system diagram.

- `thesis-experiment-setup.webp`
  - source: authentic thesis experiment/apparatus image.

Do not use generated checkpoint people, generated institutional imagery, or invented technical results as production evidence.

---

## 5. Chapter shell

Recommended DOM structure:

```html
<section id="college-years" class="chapter chapter--college">
  <div class="chapter-signal" aria-hidden="true"></div>

  <section class="college-scene college-scene--entry">...</section>
  <section class="college-scene college-scene--foundations">...</section>
  <section class="college-scene college-scene--astra-tokyo">...</section>
  <section class="college-scene college-scene--thesis">...</section>
</section>
```

Each scene contains:

1. one semantic content layer;
2. one visual/evidence layer;
3. one optional SVG motion layer;
4. no hidden essential copy.

The warm signal line is one continuous conceptual device but does not need to be literally one SVG element across the entire document. Visually continuous scene-local segments are acceptable and simpler to maintain.

---

## 6. Scroll model

### Use sticky scenes, not scroll-jacking

Each scene uses:

- normal document scrolling;
- a scene wrapper with extra vertical travel;
- one `position: sticky` visual stage on desktop/tablet where useful;
- content state derived from normalized scene scroll progress.

Do not intercept the wheel, touch, keyboard, or scrollbar.

### Motion controller

`JS/chapter-02.js` should:

- detect active scenes with `IntersectionObserver`;
- update continuous progress only for the active scene;
- throttle scroll updates through `requestAnimationFrame`;
- expose progress as a CSS custom property or scene state;
- stop updating off-screen scenes;
- respect `prefers-reduced-motion`.

Preferred pattern:

```text
IntersectionObserver
    ↓
active scene only
    ↓
requestAnimationFrame
    ↓
normalized progress 0..1
    ↓
CSS classes / custom properties / SVG stroke progress
```

Avoid hundreds of per-frame DOM writes.

---

## 7. Scene 01 — Entering the International Program

### Public content

Primary:

```text
2014
Mechanical Engineering
Universitas Indonesia — International Program
```

Supporting:

```text
~70 Engineering International Program students
~11 Mechanical Engineering International students
```

SIMAK UI / TOEFL may remain secondary and should not compete with the main frame.

### Desktop composition

Left ~42%:
- date;
- program;
- institution;
- restrained UI identity cue.

Right ~58%:
- cohort field / grid;
- larger ~70 group;
- smaller ~11 Mechanical Engineering subset resolves in warm accent.

### Motion authority

Scene progress:

```text
0.00–0.15  incoming Hero signal survives
0.15–0.32  2014 + UI identity resolves
0.32–0.60  ~70 cohort points settle into ordered grid
0.60–0.82  ~11 Mechanical Engineering subset becomes focus
0.82–1.00  cosmic residue disappears; academic geometry remains
```

### Approximate scroll travel

Desktop: `125vh–145vh`.

Mobile: no sticky requirement; use normal vertical reveal.

### Hard gates

- No emotional admissions narrative.
- No giant Makara poster.
- No literal orbit metaphor.
- No fabricated campus photography required.

---

## 8. Scene 02 — Finding My Footing

### Selected fragments only

Use exactly five initial visual fragments unless owner review later removes one:

1. Thermodynamics
2. Measurement / Metrology
3. Control Systems
4. CAD
5. Statistics

They are evidence of breadth, not a course catalogue.

### Core visual logic

The older cinematic checkpoint language is the authority:

- fragments accumulate in the visual field;
- each becomes briefly dominant;
- fragments feed a repeated problem-solving rhythm;
- earlier fragments remain quieter in the background.

Underlying sequence:

```text
observe → calculate → test → adjust
```

Do not display this as a generic corporate process diagram. It should emerge through engineering objects.

### Suggested SVG objects

- heat-flow curve;
- gauge / measurement trace;
- feedback loop;
- CAD wireframe shape;
- graph / distribution marks.

### Motion authority

```text
0.00–0.16  observe / first technical fragment
0.16–0.34  calculate / second fragment
0.34–0.52  test / control fragment
0.52–0.70  adjust / CAD + statistical marks
0.70–0.88  fragments coexist as one technical field
0.88–1.00  signal straightens into an industrial process line
```

### Approximate scroll travel

Desktop: `150vh–175vh`.

Photography is not required.

---

## 9. Scene 03 — 2018: Astra → Tokyo

This is the chapter centerpiece and gets the longest scroll travel.

### 9A. Astra

Primary frame:

```text
2018
Astra Agro Lestari
Palm Oil Mill Internship — Central Kalimantan
```

Use the authentic process-environment photo as the dominant evidence.

Use the authentic bunch-weighing photo as a smaller evidence moment.

### Mill-flow SVG

Simplify the operating process to:

```text
Fresh Fruit Bunches
→ Sterilizer
→ Press
→ Clarification
→ CPO
```

Optional small branch marks may hint at kernel / energy / by-products, but must not expand into a complete plant diagram.

### Astra motion

```text
0.00–0.12  real process environment establishes place
0.12–0.32  process nodes appear
0.32–0.44  warm flow traces through the process
```

### 9B. Astra → Tokyo transition

This transition must preserve continuity.

At the handoff:

1. process labels fade first;
2. most industrial geometry simplifies;
3. one warm path remains;
4. that same path continues across the viewport;
5. background geometry becomes cleaner academic / urban structure;
6. `April 2018` may resolve at the midpoint.

Do not use:

- airplane icon;
- world-map travel arc as the main transition;
- hard section cut;
- full-screen tourism montage.

Transition band:

```text
0.44–0.56
```

### 9C. Tokyo

Primary:

```text
Tokyo Institute of Technology
Exchange Student — Fushinobu Laboratory
Tokyo, Japan
```

#### Finding the laboratory

Create a field of small outreach/email marks.

Progressively accumulate attempts.

One connection becomes active:

```text
Fushinobu Laboratory
```

Public wording may use approximately `60–70 outreach attempts`, preserving the approximate nature of the recollection.

#### Laboratory life

Use the real Tokyo Tech group image as the main human/academic proof.

The photograph should not be heavily stylized. A restrained dark tonal treatment is acceptable, but faces and real environment must remain readable.

#### Everyday Tokyo

Use the real bicycle photo as a secondary human-scale moment:

```text
~24 km/day by bicycle
```

Use a restrained route trace, not a literal map application.

#### Technical Japan work

A small heat-transfer micro-sequence may appear:

```text
vapor → condensation → heat transfer → calculated output
```

It remains secondary.

### Tokyo motion band

```text
0.56–0.68  outreach field accumulates
0.68–0.78  accepted lab connection resolves
0.78–0.88  group/lab photo becomes dominant
0.88–0.96  bicycle / route moment
0.96–1.00  technical traces quiet before thesis
```

### Approximate scroll travel

Desktop: `250vh–290vh`.

This is the only Chapter 02 scene that should feel intentionally long.

---

## 10. Scene 04 — Coming Back and Finishing

Primary:

```text
Late 2018 — Early 2019
Undergraduate Thesis
Mechanical Engineering — Universitas Indonesia
```

Short descriptor:

```text
Throttling Process, Energy Efficiency, and Aquadest Production
```

### Composition

Treat the scene as a technical workbench assembled in sequence.

Authority sequence:

```text
system setup
→ variables
→ simulation
→ experiment
→ result
```

### Evidence hierarchy

1. authentic system diagram;
2. selected variables;
3. one restrained simulation/result graph;
4. authentic experiment setup;
5. concise conclusion.

Selected variables:

- water discharged;
- pinch point;
- energy consumption;
- aquadest production.

### Motion authority

```text
0.00–0.20  system diagram resolves
0.20–0.38  variables become explicit
0.38–0.58  one simulation graph builds
0.58–0.80  experiment apparatus becomes dominant
0.80–0.92  concise result appears
0.92–1.00  chapter settles
```

### Chapter close

Final visible state:

```text
Universitas Indonesia
Mechanical Engineering
2014–2019
```

No confetti, celebration, graduation montage, or victory animation.

### Approximate scroll travel

Desktop: `170vh–195vh`.

---

## 11. Signal-line contract

The warm red-orange signal remains continuous in meaning, but its form changes with the story:

```text
Hero            stellar trajectory
Scene 01        academic alignment
Scene 02        engineering/problem-solving trace
Astra           operating-process flow
Transition      single surviving path
Tokyo           connection / route
Thesis          technical system flow
```

It must never become a progress bar or decorative neon border.

---

## 12. Typography and copy hierarchy

Continue the portfolio's restrained editorial hierarchy.

Do not create a new design system.

Per scene:

1. chapter/scene marker — small;
2. factual date/location — small;
3. scene title / institution — dominant;
4. factual descriptor — secondary;
5. one or two small evidence annotations.

Avoid large paragraphs inside sticky stages.

Longer explanatory copy, if needed, should remain normal-flow text adjacent to or after the stage.

---

## 13. Responsive contract

### Desktop ≥ 1024px

- asymmetric compositions allowed;
- sticky stage permitted;
- photos and diagrams may coexist;
- signal may travel horizontally or diagonally.

### Tablet 768–1023px

- reduce multi-column density;
- do not shrink technical visuals until unreadable;
- preserve scene sequence;
- sticky behavior may be shortened or removed if layout becomes cramped.

### Mobile < 768px

Use normal vertical storytelling.

Do not reproduce desktop pinning mechanically.

Rules:

- one main evidence item per viewport;
- signal converts to a vertical trace;
- photos full/near-full width;
- cohort field simplified but retains ~70 → ~11 meaning;
- process flow may scroll or stack vertically;
- no hover dependency;
- text precedes or immediately accompanies the visual it explains.

---

## 14. Reduced-motion behavior

If `prefers-reduced-motion: reduce`:

- disable continuous scroll interpolation;
- remove parallax and route drawing;
- show each scene in its final readable state;
- allow only near-instant opacity/state changes if necessary;
- do not hide any information.

The chapter must remain complete and visually intentional with motion disabled.

---

## 15. Performance budget

Chapter 02 should not require a heavy animation runtime.

Before integration:

- convert photographic assets to optimized WebP (or AVIF + WebP fallback if already supported by the site);
- use responsive image widths;
- avoid loading unnecessary original-resolution files;
- lazy-load images below the first Chapter 02 scene;
- keep SVG paths simple;
- avoid large filter stacks / animated blur;
- animate primarily `transform`, `opacity`, and SVG stroke properties.

Target incremental transferred media for Chapter 02:

```text
preferred <= 2.5 MB total
hard review threshold <= 4 MB
```

This is a review budget, not permission to reduce image quality until evidence becomes unreadable.

---

## 16. Accessibility

Required:

- semantic headings;
- meaningful alt text for real evidence;
- decorative SVG marked `aria-hidden="true"`;
- no essential content only inside SVG labels;
- visible keyboard focus remains intact;
- no scroll trapping;
- sufficient contrast;
- reduced-motion support;
- touch requires no special interaction.

Suggested alt intent:

```text
Astra:
Palm-oil mill process environment during Fauzan's 2018 internship in Central Kalimantan.

Tokyo lab:
Fauzan with laboratory and exchange peers at Tokyo Institute of Technology in 2018.

Tokyo bicycle:
Bicycle used during Fauzan's exchange period in Tokyo.

Thesis experiment:
Physical undergraduate thesis experiment setup for the throttling and aquadest-production study.
```

---

## 17. Implementation phases — only after authorization

Do not build the whole chapter in one uncontrolled pass.

### C2-P0 — Asset normalization

- canonical filenames;
- optimized formats;
- dimensions / aspect ratios;
- public-safe check;
- no layout work.

**Gate:** assets visually verified.

### C2-P1 — Static chapter

- semantic HTML;
- exact copy hierarchy;
- desktop/mobile static layout;
- real evidence placed;
- no motion except simple final states.

**Gate:** owner reviews desktop + mobile renders.

### C2-P2 — Scene 01 + Scene 02 motion

- signal transition;
- cohort animation;
- engineering fragments.

**Gate:** rendered motion review + reduced-motion check.

### C2-P3 — Astra → Tokyo centerpiece

- Astra process;
- continuous transition;
- outreach field;
- Tokyo group + bicycle sequence.

**Gate:** rendered desktop/mobile motion review.

### C2-P4 — Thesis motion

- workbench sequence;
- simulation trace;
- experiment reveal;
- final settle.

**Gate:** rendered motion review.

### C2-P5 — Integration / polish

- scene-to-scene continuity;
- responsive tuning;
- reduced motion;
- overflow;
- console;
- asset loading;
- chapter exit into next career chapter.

**Gate:** owner acceptance.

Do not advance automatically across a material visual gate.

---

## 18. Verification matrix

Every implementation phase must be checked against visible evidence.

Required final validation:

```text
Desktop:
1440 × 900

Mobile:
390 × 844

Additional responsive sanity:
768px width
```

Check:

- no horizontal overflow;
- no text collision;
- photos not cropped into meaningless details;
- signal continuity remains readable;
- sticky scenes release correctly;
- browser back/forward and anchor links still work;
- no console errors;
- reduced-motion produces a complete static experience;
- ordinary scroll remains controllable;
- animations restart only when explicitly designed to do so;
- no essential information disappears if JavaScript fails.

---

## 19. Acceptance criteria

Chapter 02 is accepted only when the owner can visibly confirm:

- it feels like one journey rather than a timeline/grid;
- Scene 01 is concise;
- Scene 02 feels like engineering exploration rather than skills marketing;
- Astra → Tokyo is unmistakably the centerpiece;
- the Astra → Tokyo transition reads as one continuous transformation;
- the real photos feel evidentiary, not scrapbook-like;
- the thesis sequence clearly combines model/simulation and physical experiment;
- animation explains sequence instead of decorating;
- mobile remains understandable without desktop-style pinning;
- the chapter fits naturally after the Red Dwarf Hero;
- the final state is mature and restrained.

Passing tests alone is insufficient.

---

## 20. Explicit non-goals

This chapter implementation must not:

- redesign the Hero;
- migrate the site architecture;
- introduce a framework;
- create a generic CV timeline;
- create skill bars;
- invent impact metrics;
- invent academic facts;
- add unrelated career content;
- turn the site into a dashboard;
- add 3D objects merely because the Hero uses WebGL;
- use generated people where real owner evidence exists;
- begin until the existing Hero implementation gate is closed.

---

## 21. Current project state after this contract

### Complete / usable

- Chapter 02 narrative baseline;
- real reference pack;
- final visual design direction;
- Motion Storyboard v2;
- bounded implementation architecture and phase plan.

### Still unresolved

- owner acceptance of this implementation contract;
- current Hero review gate;
- exact integration point into the eventual approved Hero implementation;
- Chapter 02 → professional-career transition, which remains intentionally outside this build contract until the later chapter is designed.

### Single next action

**Stop Chapter 02 here. Close the existing Hero review gate.**

Only after Hero owner approval should Chapter 02 C2-P0 asset normalization begin.
