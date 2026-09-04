# Fauzan Widianto Portfolio

Public portfolio website for business systems, operational analytics, ERP process understanding, reporting automation, and AI-assisted delivery.

**Live site:** https://www.fwidianto.com/

## Positioning

The portfolio presents an **Analytical Systems Builder** profile: understand the business problem, structure the process and data, turn the logic into a useful system, and communicate the evidence clearly.

## Current state

- `main` is the current production baseline.
- `design/editorial-systems-prototype` is the active implementation path for the approved Red Dwarf portfolio direction.
- `.design/CURRENT_DIRECTION.md` is the current visual/design authority for that work.
- `AGENTS.md` contains repository-specific AI working rules.
- `docs/README.md` is the minimal routing guide.

Current public/runtime files include:

- `index.html` — homepage and current Hero implementation
- `CSS/` — site styles
- `Assets/` — public-safe site assets and CV
- `Projects/Odoo-ERP-Analytics.html` — current flagship case study
- `website-updates.html` — public changelog
- `CNAME`, `robots.txt`, `sitemap.xml` — GitHub Pages/discovery files

The older `prototypes/editorial-systems/` material documents previous animation work. It is not current Red Dwarf Hero design authority unless a task explicitly targets that prototype.

Historical experiments, superseded plans, rejected design directions, and review artifacts belong in Git history rather than being reconstructed as active context.

## Working rule

Start with `AGENTS.md`. For visual/design work, read `.design/CURRENT_DIRECTION.md`, then inspect only the implementation files directly required by the task.

Continue accepted work rather than restarting from an older prototype or creating a competing implementation path.

## Architecture

The public site and active Hero implementation use static HTML, CSS, and JavaScript. No application build step is required.

For materially new animation architecture, validate the rendering approach before adding dependencies or committing to a full implementation.

## Deployment

The public site is deployed through GitHub Pages using the custom domain in `CNAME`.
