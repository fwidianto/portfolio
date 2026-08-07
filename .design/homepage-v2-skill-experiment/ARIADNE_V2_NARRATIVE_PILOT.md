# Ariadne v2 — Narrative, Composition, and Motion Pilot

**Status:** Owner-approved bounded follow-up experiment  
**Date:** 2026-08-07  
**Primary skill:** `$shared-frontend-visualization-specialist`  
**Runtime target for this run:** Codex App with the model selected by Fauzan before the run

## Why v2 exists

Ariadne v1 proved that the shared frontend specialist could:

- load the correct project authorities;
- work in an isolated worktree;
- preserve scope;
- avoid unnecessary dependencies and JavaScript;
- produce responsive and reduced-motion evidence;
- stop at the owner-review boundary.

Owner review of the rendered v1 result found that the **workflow discipline was useful but the visual result was not mature enough**.

The main observed problems were:

1. The process rail looked mechanically valid but optically unresolved: the line extended before the first badge and after the last badge.
2. Arrows sat too close to the line and did not feel deliberately composed.
3. The hero read as several separate components — headline, portrait card, and process rail — rather than one resolved composition.
4. Large areas of whitespace felt unused rather than intentionally rhythmic.
5. The visual system felt safe and static; Fauzan wants more liveliness and is open to purposeful continuous motion, moving media, or other memorable system behavior.
6. A hero-only slice was too narrow to judge whether the design language can sustain a mature page experience.

Do not merely patch the line and arrows. Treat these as evidence of a broader composition and art-direction gap.

## Experiment question

Can Ariadne v2 produce a more mature, lively, and coherent **narrative chapter** while preserving the disciplined scope and evidence behavior that worked in v1?

## Starting state

The intended local worktree is:

```text
C:\Users\fauzan\Documents\GitHub\portofolio-ariadne-pilot
```

Expected branch:

```text
agent/portfolio-skill-experiment
```

The current local worktree is expected to contain the uncommitted Ariadne v1 changes in:

- `index.html`;
- `CSS/main.css`.

Those v1 changes are **comparative evidence and the starting implementation**, not protected final design authority.

Before editing:

1. inspect `git status --short`;
2. confirm the only existing local changes are the expected v1 frontend changes;
3. do not reset, stash, discard, or overwrite them from Git;
4. inspect the current v1 rendered page and the owner feedback recorded above;
5. fetch current experiment instructions only if doing so does not overwrite the local v1 HTML/CSS work.

If the expected v1 state is absent or unrelated local changes are present, stop and report.

## Model boundary

Use the model already selected for the Codex thread.

For the controlled comparison:

- treat this as Ariadne **Builder** tier;
- do not switch provider or model during the run;
- do not attribute improvement to a model change if the model is unchanged;
- record the exact model actually used when visible.

## One bounded visual outcome

Create one coherent, mature, lively narrative chapter spanning approximately the first **two to three screen heights**:

```text
existing navigation
→ hero / identity
→ systems transition
→ one full representative Odoo Process Control Tower chapter
```

The result should feel like the beginning of one designed website experience rather than a hero followed by unrelated sections.

## Content and identity contract

Preserve:

- `Fauzan Widianto`;
- `Analytical Systems Builder`;
- the broader thinking sequence `Analyze → Structure → Connect → Build` when useful;
- the approved public role of **Odoo Process Control Tower**;
- the existence of **Telegram Codex Controller** as the second featured system, but do not build its full chapter in this run;
- public-safe factual boundaries from `docs/design/public-content-curation.md`;
- static HTML/CSS/JavaScript architecture.

Do not invent metrics, employers, client claims, user counts, financial outcomes, project maturity, or confidential ERP evidence.

## Composition objective

The v2 page must address the maturity failures visible in v1.

### Macro composition

Create a deliberate relationship between:

- identity/headline;
- portrait or human anchor;
- systems-thinking visual;
- the transition into the Odoo chapter.

The eye should move through one composition rather than jump between independent blocks.

Evaluate:

- visual center of gravity;
- left/right balance;
- vertical rhythm;
- density changes;
- whitespace that creates grouping rather than emptiness;
- continuity across section boundaries;
- whether the first viewport and the next two sections feel authored as one system.

### Micro geometry

Explicitly inspect:

- connector start and end ownership;
- line termination at badges/nodes;
- arrow-to-line spacing;
- icon optical centering;
- label and caption spacing;
- border radii and stroke weights;
- alignment of repeated nodes;
- edge distances;
- portrait/media framing relative to the rest of the system.

Do not claim quality because coordinates are mathematically aligned. Judge the screenshot optically.

## Motion intent — Balanced Lively

Target **balanced liveliness**, not minimal motion and not a spectacle demo.

Continuous motion is allowed and encouraged when it makes the page feel active, connected, or evolving.

Good candidates include:

- subtle ambient background drift;
- a recurring path or signal moving through Analyze → Structure → Connect → Build;
- slow system-state pulses;
- a connection that visually continues from the hero into the systems transition;
- restrained media depth or movement;
- an Odoo process visualization with slow, meaningful flow;
- hover or focus interactions that reveal relationships rather than merely change color.

Do not run several unrelated animation systems at once.

Every continuous motion must answer:

```text
What does this movement mean?
Why does it improve the experience?
What is the reduced-motion equivalent?
```

If a motion does not have a good answer, remove it.

## Odoo representative chapter

Build only one full featured-system chapter for **Odoo Process Control Tower**.

The public narrative should follow:

```text
business problem
→ process understanding
→ connected operating flow / traceability
→ usable visibility or review system
→ route to evidence / case study
```

Use existing public-safe project content and assets when available. The chapter may include a simplified process map, sanitised visual, system-flow composition, or other meaningful visual representation, but must not fabricate live ERP data or unsupported counts.

Treat older `Odoo ERP Analytics` wording as project lineage, not a separate project. Prefer the current public name `Odoo Process Control Tower`.

Do not build the Telegram controller chapter yet. Its transition entry may remain visible as the complementary second system.

## Allowed implementation surface

Primary files:

- `index.html`;
- `CSS/main.css`.

JavaScript:

- may be used only when it materially improves approved motion or interaction and HTML/CSS alone would be awkward or brittle;
- before the **first JavaScript edit**, stop and request approval with the exact file, purpose, and why CSS/HTML is insufficient;
- no dependency installation.

Assets:

- reuse existing public-safe repository assets where appropriate;
- one small local SVG or equivalent visual asset may be created if it is directly required by the bounded chapter and contains no invented evidence;
- do not download stock imagery or introduce a media library merely for decoration.

## Protected areas

Do not redesign or propagate into:

- Experience;
- Skills;
- Thinking;
- Contact;
- footer;
- project detail pages;
- deployment configuration;
- analytics configuration;
- SEO/JSON-LD except where an existing reference must remain intact;
- the original dirty `C:\Users\fauzan\Documents\GitHub\portofolio` workspace.

Do not commit, push, merge, rebase, deploy, or switch branches.

## Required v2 execution sequence

```text
1. Inspect v1 and authorities
2. State the intended macro composition in plain language
3. State the motion concept and what each motion means
4. Implement the bounded narrative chapter
5. Render desktop / tablet / mobile
6. Inspect the screenshots as images, not only DOM geometry
7. Name the 3–5 highest-impact visual defects
8. Perform ONE bounded refinement pass
9. Render final evidence again
10. Stop for Fauzan
```

Do not perform repeated self-polish loops after the single refinement pass.

## Required rendered evidence

Minimum:

- desktop `1440 × 900` first viewport;
- desktop view showing hero → transition → Odoo chapter continuity;
- tablet `768 × 1024`;
- mobile `390 × 844`;
- keyboard-focus state;
- reduced-motion state;
- running continuous-motion state;
- stable/readable state while motion is active;
- no horizontal overflow;
- no blocking console errors.

For motion evidence, prefer a short local recording when the available browser tooling supports it. Otherwise capture at least three timed states showing how the motion progresses.

## Owner acceptance path

Fauzan reviews the result as a user, not as a frontend developer.

Primary questions:

1. **Maturity:** Does the composition feel deliberate, resolved, and professionally finished rather than prototype-like?
2. **Liveliness:** Does the page feel alive and memorable without becoming noisy or gimmicky?
3. **Continuity:** Does hero → systems transition → Odoo chapter feel like one coherent website experience?
4. **Identity:** Does the experience feel recognisably aligned with how Fauzan thinks and works?

Technical correctness is necessary but does not answer these questions.

## Completion report

Report:

```text
Outcome:
What changed from Ariadne v1:
Macro composition chosen:
Motion system and meaning:
What Fauzan can now see or do:
Start here:
Check first: no more than three checks
Changed files:
What stayed unchanged:
Evidence actually performed:
Initial visual defects found after first render:
Defects corrected in the one refinement pass:
Remaining visual concerns:
Model actually used:
Reasoning level if visible:
Approval requests encountered:
Scope drift detected: YES / NO
Provider/model transition: NONE / DESCRIBE
Status:
- Implemented: YES / PARTIAL / NO
- Technical: COMPLETE / PARTIAL / BLOCKED
- Visual: UNVERIFIED until Fauzan reviews
- Behavior: UNVERIFIED until Fauzan reviews
Stop condition reached: YES / NO
```

## Stop condition

Stop when:

- the expanded narrative chapter is locally implemented;
- one screenshot-based critique and one bounded refinement pass are complete;
- final responsive and motion evidence is ready;
- no protected area has been propagated;
- the result is ready for Fauzan's visual judgment.

Do not start Ariadne v3, build the Telegram chapter, redesign the rest of the homepage, or perform another correction pass without a new routing decision.
