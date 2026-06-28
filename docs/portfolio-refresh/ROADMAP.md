# Portfolio Web App Refresh Roadmap

Repository: `fwidianto/portofolio`  
Working branch: `portfolio-refresh-plan`  
Target branch: `main`

## Core Rule

Do not push or merge to `main` until the portfolio refresh is complete, reviewed, and approved.

All development, commits, and testing should happen on:

`portfolio-refresh-plan`

## Project Sources

Read `docs/portfolio-refresh/SOURCES.md` first before making portfolio content or structure changes.

Official source files for this refresh:

1. `docs/portfolio-refresh/SOURCES.md` — source index and reading order.
2. `docs/portfolio-refresh/SOURCE_PROFILE.md` — professional positioning and profile copy.
3. `docs/portfolio-refresh/SOURCE_EXPERIENCE.md` — career narrative, education, and timeline source.
4. `docs/portfolio-refresh/SOURCE_PROJECTS.md` — project inventory and public-safe project content.
5. `docs/portfolio-refresh/CONTENT_IMPLEMENTATION_NOTES.md` — implementation guidance and Codex prompt seed.

These files were distilled from `fwidianto/personal-OS`, PersonalOS canonical knowledge-base files, ChatGPT memory, and the existing portfolio roadmap. They should be treated as the current source layer for this portfolio refresh.

Do not publish private PersonalOS raw notes, job application details, internal ERP records, sensitive company data, credentials, tokens, or private URLs.

## Portfolio Positioning

The portfolio should position Fauzan Widianto as a Business Operations / Data / ERP Analytics professional who uses SQL, Python, automation, dashboards, ERP data, and AI-assisted development to solve business problems.

The portfolio should not over-position him as a pure software developer.

Preferred themes:

- Business operations analytics
- ERP analytics and reporting
- Odoo and SAP experience
- SQL-based data analysis
- Dashboard and automation work
- Profitability analysis
- Business process improvement
- AI-assisted development using Codex, OpenHands, and ChatGPT

## Phase 1 - Audit and Content Accuracy

Model: GPT-5.4 mini  
Effort: Medium

### Goals

- Audit current repository structure.
- Review existing portfolio content.
- Identify outdated, inaccurate, weak, or risky content.
- Create or update planning documents.
- Correct obvious content issues.

### Tasks

- Review `index.html`, README, project pages, CSS, assets, and links.
- Update professional positioning.
- Correct experience dates.
- Fix overstatements.
- Avoid confidential company data.
- Align README with the current positioning.
- Keep changes simple and safe.

### Acceptance Criteria

- Content is accurate.
- Public-facing wording is safe.
- README and homepage tell the same story.
- No private data is exposed.

## Phase 2 - Project Structure and Detail Pages

Model: GPT-5.4 mini  
Effort: High

### Goals

- Improve proof of work.
- Make projects clearer for recruiters.
- Add or improve project detail pages.

### Priority Projects

1. Odoo ERP Analytics Platform
2. AI ERP Intelligence Dashboard
3. Business Reporting Automation
4. PersonalOS / AI Handoff Workflow
5. HS Code Trade Compliance Automation
6. Investment Analytics Dashboard

### Tasks

- Add Odoo Analytics project detail page.
- Add PersonalOS / AI Handoff concept page without exposing private notes.
- Improve AI ERP Dashboard explanation.
- Improve GitHub project section.
- Ensure each project explains:
  - business problem
  - tools used
  - method / workflow
  - business value
  - public-safe limitations

### Acceptance Criteria

- Recruiters can understand project value quickly.
- Project pages support the analytics, BI, operations, ERP reporting, and transformation direction.
- No confidential data or private PersonalOS content is published.

## Phase 3 - UI / UX Polish

Model: GPT-5.4 mini  
Effort: High

### Goals

- Improve recruiter reading experience.
- Make the site feel more professional and polished.
- Improve mobile and desktop usability.

### Tasks

- Improve hero section hierarchy.
- Improve project cards.
- Improve spacing, typography, and section flow.
- Improve navigation.
- Improve CTA buttons.
- Improve mobile responsiveness.
- Check visual consistency across homepage and project pages.
- Keep the site lightweight and maintainable.

### Acceptance Criteria

- Homepage is understandable within 30 seconds.
- Site looks clean on desktop and mobile.
- Navigation is easy.
- Project cards are scannable.
- No unnecessary framework or heavy redesign is added.

## Phase 4 - Analytics, Visitor Tracking, and Search Visibility

Model: GPT-5.4 mini  
Effort: Medium

### Goals

- Add visitor and UX tracking before the portfolio goes live on `main`.

### Tools to Prepare

- Google Analytics 4
- Microsoft Clarity
- Google Search Console
- Bing Webmaster Tools

### Tasks

- Add GA4 tracking code using a placeholder Measurement ID first.
- Add Microsoft Clarity tracking code using a placeholder Project ID first.
- Add optional Google Search Console verification meta tag placeholder.
- Add optional Bing Webmaster Tools verification meta tag placeholder.
- Document where to replace placeholder IDs.
- Do not add real tracking IDs unless provided by the user.
- Keep tracking scripts organized and easy to disable.

### Acceptance Criteria

- Analytics placeholders are documented.
- Real IDs can be inserted later safely.
- No broken scripts.
- No analytics added to unfinished or private pages by mistake.

## Phase 5 - Final Review Before Merge

Model: GPT-5.4 or GPT-5.5 if available  
Effort: Medium or High

### Goals

- Final quality review before merging to `main`.

### Tasks

- Review full git diff against `main`.
- Check homepage content.
- Check all project pages.
- Check README.
- Check links.
- Check CV download.
- Check GitHub repo links.
- Check mobile layout.
- Check analytics placeholders or real IDs.
- Check that no private or confidential data is exposed.
- Run local preview.
- Create PR from `portfolio-refresh-plan` to `main`.
- Review PR before merge.

### Acceptance Criteria

- Branch is clean.
- Site works locally.
- Content is accurate.
- UI is polished enough.
- Analytics and search setup are ready.
- No confidential information is exposed.
- User approves before merge.

## Phase 6 - Merge and Post-Merge Check

Model: GPT-5.4 or GPT-5.5  
Effort: Medium

### Goals

- Safely merge to `main` and verify the live site.

### Tasks

- Merge only after approval.
- Confirm GitHub Pages deployment.
- Open live site.
- Check homepage.
- Check project pages.
- Check CV download.
- Check analytics real-time or debug view if IDs are active.
- Check Google Search Console and Bing verification if configured.

### Acceptance Criteria

- Live portfolio is updated.
- No broken links.
- No layout issues.
- Tracking works if real IDs were added.

## Prompt Rule for Future Codex Work

Future Codex prompts should reference this file as the source of truth:

```text
Read `docs/portfolio-refresh/SOURCES.md` first.
Use the linked portfolio refresh source files as the project source of truth.
Continue only on the current phase.
Stay on branch `portfolio-refresh-plan`.
Do not switch to `main`.
Do not push to `main`.
Do not merge.
Commit and push only to `portfolio-refresh-plan` unless explicitly instructed otherwise.
Do not publish private PersonalOS content or confidential company information.
```
