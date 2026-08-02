# Homepage V2 Representative Experiment

Status: Frozen experiment brief / pre-concept checkpoint

Date: 2026-08-02

This document completes Phase 5 of the Living System portfolio renewal. It defines the exact representative surface that will be used to test the selected external frontend skills.

No frontend implementation is authorised by this document.

## Experiment Question

Can the selected frontend skills translate the mature Living System direction into a credible, distinctive, recruiter-friendly homepage first screen without changing Fauzan's professional identity, inventing content, or rebuilding the website?

## Current Baseline

The current homepage first screen contains:

- fixed navigation with `FW.` and links to Project, Experience, Skills, Thinking, and Contact;
- the role label `Analytical Systems Builder`;
- the headline `From problems and data to system design, insights, and AI-powered workflows.`;
- a general introduction describing curiosity, projects, tools, and AI-assisted experimentation;
- four similarly weighted actions: flagship project, CV, GitHub, and LinkedIn;
- a large profile card with portrait, name, role, and three summary metrics;
- an immediate transition into the current Odoo project section.

The current code uses static HTML, CSS, and JavaScript. The experiment must continue from this architecture.

## Baseline Weaknesses to Test

The experiment should test whether the first screen can improve these issues:

1. The current profile-card and metric treatment feels closer to a generic portfolio template than a mature business-systems identity.
2. Four similarly weighted buttons weaken the primary visitor path.
3. The introduction explains that the portfolio is a living record, but does not state Fauzan's practical professional value as directly as it could.
4. The hero does not yet express the Living System idea through relationships, movement, or connected destinations.
5. The transition introduces only the Odoo project and does not yet establish the complementary roles of the two approved featured projects.
6. The screen communicates several capabilities, but the visitor must work too hard to understand the unifying way Fauzan thinks.

## Exact Representative Surface

The experiment is limited to:

```text
existing navigation
+ homepage first viewport
+ a visible transition into the next section
```

The transition may preview the two approved projects, but it must not implement the full project section or determine the final order of the complete homepage.

The representative surface should fit approximately:

- one desktop viewport at `1440 x 900`, with a purposeful glimpse of the next section;
- one tablet view at `768 x 1024`;
- one mobile view at `390 x 844`.

## Target Visitor Understanding

### Within 5 seconds

The visitor should understand:

> Fauzan is an Analytical Systems Builder who turns complex business processes and data into understandable systems, insights, and workflows.

### Within 10-15 seconds

The visitor should understand that the portfolio has two complementary proof paths:

1. business and ERP systems;
2. controlled AI-assisted workflows.

### Desired feeling

The screen should feel:

- mature;
- calm;
- intelligent;
- credible;
- structured;
- quietly distinctive;
- human rather than machine-generated.

It should not feel like a developer template, futuristic AI dashboard, consultancy imitation, or game interface.

## Frozen Content Inventory

Both concept options must use the same content inventory so the review compares visual direction rather than unrelated copy.

### Identity

```text
Fauzan Widianto
Analytical Systems Builder
```

### Headline

```text
From problems and data to system design, insights, and AI-powered workflows.
```

### Supporting statement

```text
I work across operations, ERP, analytics, and automation—turning scattered processes and data into systems people can understand, review, and act on.
```

This replaces the more general current paragraph for the concept experiment. It may be refined only if the owner explicitly approves revised wording.

### Primary action

```text
Explore the systems
```

The action should move toward the project transition or project area.

### Secondary action

```text
Download CV
```

### Utility links

```text
LinkedIn
GitHub
```

LinkedIn and GitHub should remain available but do not need equal visual weight with the primary action.

### Project transition statement

```text
Two systems, one way of thinking.
```

### Project path 1

```text
Odoo Process Control Tower
Operational complexity -> visible process and decision support
```

This is the evolved form of the earlier Odoo ERP Analytics project, not a separate project.

### Project path 2

```text
Telegram Codex Controller
Agent work -> bounded control, observability, and review
```

No other project may appear in the representative concept.

## Elements to Preserve

Both concept options must preserve:

- Fauzan's real name and current profile photograph as a human anchor;
- the `Analytical Systems Builder` identity;
- the existing headline;
- access to CV, LinkedIn, and GitHub;
- the existing static-site architecture;
- a professional connection to the current warm, calm, business-oriented portfolio character;
- accessibility fundamentals such as readable contrast, focus states, semantic headings, and reduced-motion consideration.

The portrait does not need to remain inside the existing circular profile card. Its framing may change.

## Elements Allowed to Change

The concept may change:

- first-screen composition;
- portrait placement and framing;
- hierarchy of actions;
- use of lines, pathways, rails, or system-map motifs;
- spacing, typography scale, and container rhythm;
- header visual treatment while preserving its current labels and destinations;
- the way the next-section preview presents the two project paths;
- subtle motion or hover behaviour that explains connection or progression.

## Elements Prohibited in the First Experiment

Do not add:

- additional projects;
- supporting project cards;
- fake metrics or outcomes;
- new professional claims;
- a theme toggle or dark mode;
- a full interactive world map;
- dashboard charts in the hero;
- terminal windows or code-editor imagery as the main identity;
- decorative pills, badges, or floating widgets without information value;
- a new navigation architecture;
- a framework, build system, or deployment migration;
- full downstream homepage sections.

The existing `6+`, `ERP`, and `BI` hero metrics are not required in either concept. They should be omitted unless a concept demonstrates a clearly superior and non-template use of factual proof, and the owner explicitly approves it.

## Concept Option A — Living System Editorial

Foundation:

```text
Editorial / Casebook structure
+ Dieter Rams restraint
+ Systems Canvas connection motif
```

Expected character:

- strong, calm typography;
- generous but purposeful whitespace;
- portrait integrated as editorial evidence rather than a profile widget;
- one clear primary action;
- subtle lines or pathway logic connecting identity to the two project paths;
- visible next-section continuation;
- strongest recruiter readability.

This option should prove that the Living System can feel distinctive without looking experimental or playful.

## Concept Option B — Living World Interface

Foundation:

```text
professional editorial base
+ subtle connected-destination interface
+ restrained spatial or navigational cues
```

Expected character:

- the first screen feels like an entrance into one connected professional world;
- Odoo Process Control Tower and Telegram Codex Controller appear as two destinations within one system;
- more expressive navigation or transition than Option A;
- still calm, readable, and business-oriented;
- no literal map, game UI, futuristic control room, or neon treatment.

This option should test how far the Living World metaphor can go before it weakens credibility.

## Concept Deliverables

Before any code is changed, produce:

1. Option A desktop concept;
2. Option A mobile concept;
3. Option B desktop concept;
4. Option B mobile concept;
5. a short comparison explaining the design idea, strengths, risks, and implementation complexity of each.

Do not create concepts for the entire website.

## Owner Review Questions

The owner will evaluate:

1. Is the professional identity understandable within 5 seconds?
2. Does the design look mature enough for recruiters and managers?
3. Does it feel like one connected system rather than unrelated sections?
4. Are the two projects distinct but clearly part of one identity?
5. Is the portrait treatment credible and human?
6. Does the Living System metaphor clarify rather than decorate?
7. Is the screen distinctive without becoming flashy?
8. Does the mobile interpretation remain intentional?
9. Would the concept be practical to implement faithfully in the current static site?
10. Which option should become the approved visual specification?

## Future Implementation Boundary

After one concept is explicitly approved, the implementation phase may change only the smallest necessary files, expected to be:

- `index.html`;
- `CSS/main.css`;
- existing local assets only, unless one approved concept requires a clearly defined new asset.

Do not change project detail pages, analytics setup, deployment, or unrelated homepage sections during the representative implementation.

## Local Review Plan

The approved slice will later be implemented in an isolated local branch or worktree and reviewed through a local static server.

Minimum rendered checks:

- `1440 x 900` desktop;
- `768 x 1024` tablet;
- `390 x 844` mobile;
- navigation and primary actions;
- next-section transition;
- keyboard focus;
- reduced motion;
- no horizontal overflow;
- visual comparison with the approved concept.

Nothing is deployed until the owner approves the local result.

## Phase Status

- Phase 1 — Living System direction: complete.
- Phase 2 — Public content curation: complete.
- Phase 3 — External frontend skill selection: complete.
- Phase 4 — Repository `AGENTS.md`: complete.
- Phase 5 — Representative experiment definition: complete.
- Phase 6 — Install the two selected skills in the agent environment and generate the two bounded concept options: next.
