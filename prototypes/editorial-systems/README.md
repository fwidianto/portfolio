# Editorial Systems Animation — Current Map

This folder contains the **current portfolio prototype and latest animation implementation**. Start here instead of reconstructing animation history.

## Current runtime checkpoint

Pre-cleanup animation checkpoint:

`e204eea23f6e0c55470ea38bfe88a1a3285f05af` — `Fix Integrate to Output carrier layering`

The cleanup branch must not change rendered animation behavior.

## Current runtime

- `index.html`
- `style.css`
- `work.css`
- `about.css`
- `immersive.js`

## Current Integrate authority

- `integrate-golden-v26.html`
- `integrate-golden-v26.manifest.json`
- `integrate-live-source-bridge.json`
- `validate-integrate-golden-v26.mjs`

## Current Integrate → Output v2 authority

- `integrate-output-v2-live-bridge.json`
- `integrate-output-v2-choreography.json`
- `validate-integrate-output-v2-live-bridge.mjs`
- `validate-integrate-output-v2-choreography.mjs`

## Current Output authority

- `output-golden-v2.html`
- `output-golden-v2.manifest.json`
- `output-golden-v2-checkpoint.png`
- `validate-output-golden-v2.mjs`

## Compatibility-only data

The current v2 runtime still reads source-runtime identity information from:

- `integrate-output-live-bridge.json`
- `output-golden-v1.manifest.json`

These are retained only as compatibility data for the current implementation. **They are not current Output design authority.** Do not use them to redesign or judge the endpoint. Output Golden v2 is authoritative.

## Current owner-visible defects

Do not create a new animation. The existing structure and endpoint compositions are the baseline. Remaining visual work is focused on:

- exact visual continuity at phase boundaries;
- removing abrupt snaps/restyling inside transformations;
- more coherent pacing/rhythm across the complete sequence;
- removing redundant rapid `+`-mark transformations;
- final Output polish, especially the Distribution circle and Overview typography/alignment.

Primary continuity rule:

> The final visible state of phase N should be the initial visible state of phase N+1; transformation begins from that same state rather than from an abrupt restage.

Generated recordings and Playwright review captures are local review artifacts and should not be committed.
