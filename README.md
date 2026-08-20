# Fauzan Widianto Portfolio

Public portfolio website for business systems, operational analytics, ERP process understanding, reporting automation, and AI-assisted delivery.

**Live site:** https://www.fwidianto.com/

## Positioning

The portfolio presents an **Analytical Systems Builder** profile: understand the business problem, structure the process and data, turn the logic into a useful system, and communicate the evidence clearly.

Target roles include Data Analyst, Business Analyst, BI Analyst, Operations Analyst, Commercial Analyst, Digital Transformation Analyst, and analytics-adjacent AI workflow roles.

## Current public direction

The live homepage remains the approved v1 implementation until a later change is explicitly reviewed and approved.

Current public project direction is intentionally narrow:

- **Odoo Process Control Tower** — the evolved form of the Odoo ERP Analytics work;
- **Telegram Codex Controller** — a bounded AI-workflow control and observability system when/where explicitly published.

Older project pages may remain accessible for continuity, but they are not automatically part of the current featured portfolio.

## Repository responsibility

This repository contains the live static site, recruiter-facing case-study material, public-safe assets, and the minimum documentation required to maintain them.

Historical design experiments, refresh phases, audits, and superseded implementation plans belong in Git history rather than the active working tree.

## Structure

- `index.html` — live homepage
- `Projects/` — public project/case-study pages and supporting assets
- `CSS/` — shared styles
- `Assets/` — public site assets and CV
- `AGENTS.md` — concise operating rules for AI-assisted changes
- `docs/README.md` — current documentation index

## Working rule

For any change, start with `AGENTS.md`, then read only the documentation directly relevant to the requested page or content. Do not reconstruct old experiments unless explicitly asked.

## Local preview

The site is static HTML/CSS/JavaScript. Open `index.html` directly or serve the repository root with a simple local static server.

## Deployment

The site is deployed through GitHub Pages with the custom domain in `CNAME`. No application build step is required.
