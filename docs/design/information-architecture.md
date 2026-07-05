# Information Architecture

Status: Active source of truth

This document explains how the documentation, homepage, and case studies connect.

## Architecture Principle

Each major idea should have one source of truth.

The portfolio should not repeat the same philosophy across many files. Instead, each area should link back to the relevant source document.

## Documentation Flow

```text
docs/README.md
-> core/
-> homepage/
-> design/
-> case-studies/
```

`docs/README.md` is the entry point for future sessions.

## Homepage Flow

```text
Business Systems Designer identity
-> Capability Graph
-> Thinking Lab
-> Currently Building
-> Flagship Case Study
```

The homepage should route visitors from identity to evidence.

## Case-Study Flow

```text
Business problem
-> Process understanding
-> Business logic
-> Technology
-> Evidence
```

Case studies should prove the thinking described by the homepage.

## Historical Documents

Older planning files can remain as short redirects or historical logs. They should not compete with active source-of-truth files.

## Future Session Rule

Before implementing portfolio features, future ChatGPT or Codex sessions should read:

1. [../README.md](../README.md)
2. [../core/portfolio-design-philosophy.md](../core/portfolio-design-philosophy.md)
3. The specific source-of-truth file for the feature being implemented.
