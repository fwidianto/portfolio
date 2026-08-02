# Codex Runbook: Real Frontend Skill Experiment

This runbook is intentionally explicit so the experiment tests the selected skills rather than an ordinary broad prompt.

## 1. Prepare the branch

From the portfolio repository:

```powershell
git fetch origin
git switch agent/portfolio-skill-experiment
git pull
```

Confirm the working tree is clean:

```powershell
git status --short
```

Do not run the experiment from `main`.

## 2. Start Codex from the repository root

Launch a new Codex session with the current working directory set to the portfolio repository root.

The repository root matters because Codex discovers repo-scoped skills from `.agents/skills` between the current working directory and the repo root.

## 3. Install only the two selected skills

First check:

```text
/skills
```

The required skills are:

```text
frontend-design
design-review
```

If they are not present, explicitly invoke the built-in installer:

```text
$skill-installer

Install only `frontend-design` and `design-review` from
https://github.com/julianoczkowski/designer-skills
as repository-scoped skills for this portfolio.
Place them under `.agents/skills`.
Do not install the other skills from the repository.
After installation, report the exact installed paths and stop.
```

Alternative interactive installer from PowerShell:

```powershell
npx skills add julianoczkowski/designer-skills
```

In the interactive prompts choose:

- skills: `frontend-design`, `design-review` only;
- agent: Codex;
- scope: project/repository, not global.

After installing, restart Codex only if `/skills` does not refresh.

## 4. Verify the installation

The expected files are:

```text
.agents/skills/frontend-design/SKILL.md
.agents/skills/design-review/SKILL.md
```

Run:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/verify-portfolio-design-skills.ps1
```

Then use `/skills` and verify that both skills appear with repository paths.

Record the result in:

```text
.design/homepage-v2-skill-experiment/EXPERIMENT_LOG.md
```

## 5. Invoke `frontend-design` explicitly

Use a fresh Codex turn and invoke the skill by name:

```text
$frontend-design

Read `AGENTS.md` and every document in its Read First list.
Then read `.design/homepage-v2-skill-experiment/DESIGN_BRIEF.md`.

This is a controlled skill evaluation. Implement only the approved representative surface:
existing navigation + homepage first viewport + visible transition into the two featured systems.

Use the approved Mist Blue + Slate + Soft Coral direction, less copy and stronger visual storytelling, the four-stage Analyze -> Structure -> Connect -> Build transformation, and only Odoo Process Control Tower and Telegram Codex Controller.

Repository guardrails override conflicting skill defaults. In particular: no dark mode, no framework migration, no additional projects, no full-site redesign, and no deployment.

Before editing, inspect the current implementation and state:
1. existing architecture and reusable styles;
2. the aesthetic direction you will follow;
3. exact files you expect to change;
4. how the mobile-first layout will adapt at tablet and desktop.

Then implement the approved slice locally. Run relevant checks and a local static server. Stop after the representative surface works. Do not run the design review yet.

At completion report:
- changed files;
- checks run;
- intentional non-changes;
- any brief conflict or override encountered;
- whether the skill instructions materially influenced the implementation.
```

## 6. Inspect before review

Before invoking the review skill:

```powershell
git status --short
git diff --stat
git diff -- index.html CSS/main.css
```

Reject the run immediately if it:

- changes unrelated pages or sections;
- adds a framework or build system;
- adds dark mode;
- invents claims, projects, or metrics;
- modifies deployment or analytics;
- ignores the two-project boundary.

Do not commit yet.

## 7. Invoke `design-review` explicitly

Use a new Codex turn:

```text
$design-review

Review the current uncommitted homepage experiment against:
`.design/homepage-v2-skill-experiment/DESIGN_BRIEF.md`.

Repository `AGENTS.md` overrides conflicting skill defaults. Do not require or add dark mode. Temporary screenshots must remain local and uncommitted.

Run the site locally and capture at minimum:
- desktop 1440 x 900;
- tablet 768 x 1024;
- mobile 390 x 844;
- one keyboard-focus state.

Also verify:
- reduced-motion behavior;
- no horizontal overflow;
- navigation and actions;
- the four-stage visual progression;
- the transition into Odoo Process Control Tower and Telegram Codex Controller.

Score each required category from 1 to 5:
Analytical clarity, Systems coherence, Builder evidence, Professional credibility, Responsive preservation, Motion purpose.

Every category must score at least 4/5. Save the review to:
`.design/homepage-v2-skill-experiment/DESIGN_REVIEW.md`.

Do not expand scope. Report Must Fix, Should Fix, Could Improve, and What Works Well.
```

## 8. Apply only review-critical fixes

If the review identifies Must Fix or score-below-4 issues, invoke `$frontend-design` again with only the specific findings.

Do not request a general polish pass.

Then rerun `$design-review` once.

## 9. Record the experiment

Complete `.design/homepage-v2-skill-experiment/EXPERIMENT_LOG.md` with:

- Codex version and model;
- whether skills were visible in `/skills`;
- exact installed paths;
- whether invocation was explicit;
- files changed;
- number of correction passes;
- six review scores;
- examples of drift prevented or introduced;
- whether the workflow was better than the normal prompt-only process;
- recommendation: keep unchanged, wrap, modify, or reject.

## 10. Stop

Do not merge, deploy, or rewrite the full homepage.

The owner must review the local implementation first.