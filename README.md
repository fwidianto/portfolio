# Fauzan Widianto Portfolio

Public portfolio website for business systems, operational analytics, ERP process understanding, reporting automation, and AI-assisted delivery.

**Live site:** https://www.fwidianto.com/

## Positioning

The portfolio presents an **Analytical Systems Builder** profile: understand the business problem, structure the process and data, turn the logic into a useful system, and communicate the evidence clearly.

## Active working tree

The repository is intentionally kept small. The active tree contains only the current public portfolio, its direct dependencies, and the latest portfolio-animation prototype.

Current public site:

- `index.html` — live homepage
- `website-updates.html` — current public changelog
- `Projects/Odoo-ERP-Analytics.html` — current flagship case study
- `CSS/` — styles required by the current public pages
- `Assets/` — public-safe site assets and CV
- `CNAME`, `robots.txt`, `sitemap.xml` — GitHub Pages / discovery files

Current animation work:

- `prototypes/editorial-systems/` — latest Analytical Systems Builder portfolio prototype and its current animation authorities
- `prototypes/editorial-systems/README.md` — exact current/compatibility file map for that animation

Maintenance:

- `AGENTS.md` — concise operating rules for AI-assisted changes
- `docs/README.md` — minimal current repository notes

Historical project pages, abandoned portfolio implementations, design experiments, superseded planning documents, and review artifacts belong in **Git history**, not the active working tree.

## Working rule

Start with `AGENTS.md`, then inspect only the page or animation files directly required by the task. Do not reconstruct old portfolio experiments or search Git history unless explicitly requested.

For animation work, treat the file map in `prototypes/editorial-systems/README.md` as the starting point and do not treat compatibility-only v1 data as current design authority.

## Architecture

The public site and current prototype use static HTML, CSS, and JavaScript. No application build step is required.

## Deployment

The public site is deployed through GitHub Pages using the custom domain in `CNAME`.
