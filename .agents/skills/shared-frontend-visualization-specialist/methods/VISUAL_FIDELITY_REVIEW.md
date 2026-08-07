# Ariadne Method — Visual Fidelity Review

**Use when:** significant frontend work has an approved concept/baseline or when visual quality, maturity, polish, responsiveness, or fidelity is part of acceptance.

## Hard vision gate

For material visual work:

```text
No genuine rendered-image inspection
= Visual review BLOCKED
```

If the current model cannot inspect images, do not substitute DOM rectangles, computed CSS, pixel-density analysis, or geometry statistics for aesthetic judgment. Complete technical QA, then route to a vision-capable reviewer/tool through the orchestrator when available; otherwise return screenshots to Fauzan and mark visual review blocked/unverified.

## Screenshot set

Capture task-declared states. Significant responsive work normally includes desktop, tablet, mobile, relevant interaction state, running motion when material, reduced-motion equivalent, and stable/settled state.

Use readable section captures when one compressed full-page screenshot would hide geometry or typography detail.

## Concept-to-render comparison

When an approved visual concept/reference exists, inspect it and the latest browser render directly in the same review pass.

Compare at least five concrete points across composition, hierarchy, typography, spacing/rhythm, palette/contrast, geometry, assets/media, icons, container model, responsive reorganization, and motion.

## Mismatch ledger

| Mismatch | Concept/baseline evidence | Render evidence | Severity | Disposition |
| --- | --- | --- | --- | --- |
| ... | ... | ... | Must / Should / Could | Fix / Intentional deviation / Blocked |

Do not replace the ledger with a numeric fidelity score.

## Review questions

- What does the eye see first, second, third?
- Do major objects feel related or merely placed near one another?
- Is whitespace intentional or accidental?
- Are there visible 1–2 px alignment defects after deterministic QA?
- Can users discover primary/secondary controls without hunting?
- Do typography, panels, diagrams, media, icons, and controls belong to one system?
- Does mobile/tablet reorganize meaning rather than merely shrink desktop?
- Does motion teach hierarchy/state/flow/project identity, and does it remain calm over time?
- Does reduced motion preserve meaning?

## Priorities

- **Must fix:** breakage, accessibility failure, path/geometry defect, unreadable content, major concept deviation.
- **Should fix:** maturity, hierarchy, consistency, responsive, or contrast issue.
- **Could improve:** optional polish or experimentation.

## Correction boundary

Use only the task packet's allowed correction count. Default is one bounded correction pass. If review reveals a new design direction rather than an implementation defect, return to the owner/orchestrator.

## Output

```text
Vision capability: AVAILABLE / BLOCKED
Screenshots inspected:
Accepted concept/baseline inspected:
Five+ comparison points:
Mismatch ledger:
Must fix:
Should fix:
Could improve:
What works and should be preserved:
Correction performed: YES / NO
Remaining intentional deviations:
Visual status: UNVERIFIED until owner approval
```
