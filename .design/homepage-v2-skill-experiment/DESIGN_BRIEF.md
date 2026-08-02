# Design Brief: Homepage V2 Skill Experiment

Status: Approved direction / implementation experiment

Date: 2026-08-02

## Experiment Purpose

Test whether the third-party `frontend-design` and `design-review` skills reduce frontend drift and produce a faithful, responsive implementation from the repository's frozen direction.

This is a workflow evaluation as much as a visual task.

## Scope

Implement only:

```text
existing navigation
+ homepage first viewport
+ visible transition into the two featured systems
```

Do not redesign or restyle the rest of the homepage.

Work only on this experimental branch. Do not deploy.

## Identity

The visitor should infer this identity from the interface, not only read it as a label:

```text
Analytical Systems Builder
```

Meaning:

```text
Analytical = find the signal and structure ambiguity
Systems = connect flows, dependencies, and decisions
Builder = turn understanding into usable outcomes
```

Visible narrative:

```text
complexity -> structure -> connection -> impact
```

## Approved Visual Direction

Use:

```text
Living System Editorial
+ precise systems visualization
+ fresh professional tone
+ restrained purposeful motion
```

The result should feel clear, intelligent, modern, human, operational, and quietly distinctive.

Avoid generic developer portfolios, dashboard-template heroes, control-room styling, game interfaces, bento grids, terminal imagery, glassmorphism, and decorative AI nodes.

## Approved Palette

Use these as the primary palette family:

```text
Mist white      #F6F9FC
Soft mist       #E7EEF6
Deep slate      #334155
Dusty blue      #64748B
System blue     #356987
Soft coral      #FF6B5E
```

The palette may be tuned slightly for accessible contrast, but do not replace it with another theme.

No dark mode or theme toggle.

## Content Direction

Use less copy and stronger visuals.

Current working hero language is provisional and may be shortened where needed for layout, but do not invent new achievements or claims.

### Identity

```text
Fauzan Widianto
Analytical Systems Builder
```

### Working headline

```text
I turn complexity into systems that create impact.
```

### Working support line

```text
Turning scattered processes and data into systems people can understand, review, and act on.
```

### Primary action

```text
Explore the systems
```

### Secondary action

```text
Download CV
```

Keep LinkedIn and GitHub available with lower visual weight.

All wording remains provisional for a later natural-language copy pass.

## Main Visual

Create one clear visual transformation sequence:

```text
Analyze -> Structure -> Connect -> Build
```

The visual should do more explanatory work than paragraphs.

Suggested semantic progression:

1. **Analyze** — scattered signals or inputs.
2. **Structure** — patterns become organised.
3. **Connect** — relationships and dependencies become visible.
4. **Build** — the system produces a practical outcome.

The visual must remain understandable without animation.

## Project Transition

Use only these two featured systems:

### Odoo Process Control Tower

```text
Business operating systems
Operational complexity -> visible process and decision support
```

### Telegram Codex Controller

```text
AI-assisted work systems
Agent work -> bounded control, observability, and review
```

The transition should communicate:

```text
Two systems, one way of thinking.
```

Do not add other projects, project grids, supporting work, or invented metrics.

## Motion

Motion must explain sequence, connection, direction, or state.

Allowed:

- staged reveal following the reading order;
- one-time path drawing through the four stages;
- state emphasis on hover or keyboard focus;
- project transition reveal;
- motion that settles into a stable state.

Reject:

- continuous floating, pulsing, glowing, rotating, or bouncing;
- animation that delays reading;
- motion used only to look modern.

Implement a complete `prefers-reduced-motion` equivalent.

## Responsive Behaviour

### Mobile first

Begin at approximately `390 x 844`.

- Use a clear vertical narrative.
- Keep body text at least 16px.
- Keep touch targets at least 44px.
- Use an intentional mobile navigation pattern.
- Simplify the systems visual without turning it into generic cards.

### Tablet

At approximately `768 x 1024`, create a deliberate intermediate composition. Do not simply shrink the desktop layout.

### Desktop

At approximately `1440 x 900`, show the full relationship between the identity, the four-stage transformation, and the two featured systems. Include a purposeful glimpse of the next section.

No horizontal overflow at any required viewport.

## Architecture Boundaries

- Continue using static HTML, CSS, and JavaScript.
- No React, Vite, Next.js, new framework, or build system.
- No new dependency unless absolutely necessary and explicitly approved.
- Reuse the current assets and accessible semantic structure where appropriate.
- Change only the smallest number of files needed.
- Expected implementation files: `index.html` and `CSS/main.css`; use existing JavaScript or one minimal script only if necessary.
- Do not modify project detail pages, analytics, deployment, or unrelated homepage sections.

## Approval Scorecard

Every category must score at least 4/5:

| Category | Approval question |
| --- | --- |
| Analytical clarity | Is the problem-solving value understandable without relying only on the title? |
| Systems coherence | Does the screen feel like one connected system? |
| Builder evidence | Does the visual clearly move toward a practical outcome? |
| Professional credibility | Is it mature enough for recruiters and managers? |
| Responsive preservation | Does each viewport preserve the same identity and narrative? |
| Motion purpose | Does every animation explain something meaningful? |

## Required Evidence

After implementation:

- run the page locally;
- capture desktop `1440 x 900`;
- capture tablet `768 x 1024`;
- capture mobile `390 x 844`;
- capture at least one keyboard-focus state;
- verify reduced motion;
- verify no horizontal overflow;
- save the review to `.design/homepage-v2-skill-experiment/DESIGN_REVIEW.md`;
- keep generated screenshots local and uncommitted unless the owner explicitly requests otherwise.

## Stop Boundary

Stop after the representative surface is implemented and reviewed.

Do not expand into the full homepage, rewrite all copy, or prepare deployment.