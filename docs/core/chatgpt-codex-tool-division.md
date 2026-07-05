# ChatGPT and Codex Tool Division Guide

Status: Active guide

This document defines the preferred long-term division between ChatGPT and Codex for the portfolio project.

## Core Rule

Use ChatGPT for reasoning-heavy professional judgment.

Use Codex for repository-heavy execution.

The portfolio philosophy, visitor psychology, positioning, story structure, and feature specification should be created through ChatGPT first. Codex should work from approved instructions instead of inventing the strategic direction during implementation.

## Recommended Division

| Work type | Recommended tool |
| --- | --- |
| Portfolio philosophy | ChatGPT |
| Visitor psychology | ChatGPT |
| Professional positioning | ChatGPT |
| Capability Graph reasoning | ChatGPT |
| Thinking Lab reasoning | ChatGPT |
| Feature specification | ChatGPT |
| Copy and narrative direction | ChatGPT |
| Strategic document drafting | ChatGPT |
| Markdown placement in repo | Codex |
| Multi-file documentation refactor | Codex |
| UI implementation | Codex |
| HTML/CSS/JS changes | Codex |
| Repository cleanup | Codex |
| Link checking | Codex |
| Git status, commit, and push | Codex |

## Why This Matters

The portfolio is not only a website. It is the public interface of a professional operating system.

Because of that, strategic work should start from questions such as:

- What should visitors discover?
- What should they feel?
- What business story is being shown?
- What evidence supports the story?
- What should stay subtle?
- What should not be overclaimed?

These are reasoning and positioning questions. They should be handled before repository execution.

## Recommended Workflow

```text
ChatGPT
-> reasoning
-> architecture
-> document draft
-> review with Fauzan
-> final specification
-> Codex
-> place document into repo
-> implement if requested
-> verify
-> commit and push
```

## Codex Boundary

Codex is highly useful for implementation and multi-file repository work, but it should not be asked to invent the portfolio identity during implementation.

Codex should receive:

- approved specification,
- target files,
- scope boundaries,
- verification checklist,
- commit and push requirement.

Codex should not decide:

- the professional identity,
- the visitor psychology,
- the meaning of the Capability Graph,
- the role of AI in the portfolio,
- whether a section should exist.

## ChatGPT Boundary

ChatGPT should own the reasoning and review layer.

ChatGPT should not be used as the main tool for heavy repository execution when the task involves many files, implementation changes, or repeated verification steps.

## Practical Rule of Thumb

If the task is about what the portfolio should mean, use ChatGPT first.

If the task is about changing the repository, verifying files, and pushing to GitHub, use Codex.
