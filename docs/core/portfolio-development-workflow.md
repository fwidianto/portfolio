# Portfolio Development Workflow

Status: Active source of truth

This document defines the preferred workflow for future portfolio updates. It exists to prevent implementation from starting before the strategy, story, and visitor experience are clear.

## Role Split

ChatGPT is strongest for:

- framing,
- architecture,
- visitor psychology,
- story,
- public positioning,
- feature specification,
- review.

Codex is strongest for:

- implementation,
- repository refactor,
- documentation cleanup,
- link checks,
- verification,
- commit and push workflow.

Use both deliberately. Do not ask Codex to invent the portfolio philosophy during implementation.

## Preferred Workflow

```text
ChatGPT
-> Architecture
-> Visitor psychology
-> Story
-> Feature specification
-> Codex
-> Implementation
-> Repository refactor
-> Verification
-> ChatGPT review
-> Next iteration
```

## Before Implementation

Before changing HTML, CSS, routing, or visual design, define:

- the visitor question,
- the desired discovery,
- the business story,
- the public-safe content,
- the visual metaphor,
- the interaction purpose,
- the verification path.

If these are unclear, do not implement yet.

## Feature Development Order

For major homepage sections, case studies, or design changes, use this order:

```text
Observation
-> Visitor Question
-> Desired Emotion
-> Story
-> Content
-> Visual Metaphor
-> Interaction
-> Prototype
-> Implementation
-> QA
-> Reflection
-> Documentation
```

## Codex Rules

When Codex works on this repository:

- Read [docs/README.md](../README.md) first.
- Preserve the source-of-truth ownership model.
- Keep edits scoped to the requested layer.
- Do not implement homepage features from concept docs alone.
- Do not make AI the primary identity.
- Do not publish confidential company or PersonalOS data.
- Verify links and Git status before committing.

## ChatGPT Review Rules

After a meaningful implementation, ChatGPT should review:

- whether the visitor journey improved,
- whether the wording overclaims,
- whether the business story is clear,
- whether AI is positioned as support,
- whether the design still reflects the philosophy.

## Rule of Thumb

If a feature cannot be explained in terms of what it helps visitors discover, it should not be built yet.
