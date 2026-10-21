# Chapter III Scene 05 — A12 release

On 21 October 2026 the owner instructed continuation to A12, following the fleet-flow and smoothness review. This authorizes promotion and release of the accepted Scene 05 development result. It does not extend the scope to other portfolio scenes.

## Runtime and route

The public route remains `/#chapter-03-scene-05`. The authoritative homepage embeds `prototypes/new-portfolio-animation-first/scene-05/warehouse/index.html?chapter=1`. Root `index.html` is generated using `scripts/sync-production-html.mjs`.

The entry retains the profitability question and **Start Game**. The 3D renderer and worker load after that action. Fleet selection, workload and revenue sliders, service placement and conditional distance, forecast staffing, and the final review remain progressive setup steps. Starting the operation enters the warehouse. Camera controls expose the connected site without resetting the operation.

The promoted `warehouse/` tree contains only the entry, shared setup, measured layout/2D fallback, live renderer, physical-operation worker and their runtime dependencies. Three.js r186 and OrbitControls retain their MIT license and source provenance. Fonts and their existing licenses remain shared portfolio assets. Review pages, inactive renderers, model fixtures, development plans, image prompts and local evidence are excluded from the release.

The existing worksheet and native Canvas comparison remain in their current paths. The shared game controller opts into the physical runtime only when the warehouse controller supplies its factory and presentation configuration. The new public controller imports a versioned shared-game URL to avoid retaining an earlier cached controller.

## Portfolio integration

The entry exposes the existing `WarehouseScene05` adapter before the game loads. Chapter navigation controls activity without starting a game or skipping setup. Leaving the scene pauses its clock; returning can resume an already running continuous operation beyond its first accounting month. A delayed initial frame-load event preserves a game already running; a slow entry image cannot silently stop it. Inspection resolves the enclosing chapter controller through the nested same-origin frames, pauses the operation, presents calculations across the viewport and restores the prior running/paused state.

Short landscape frames use a compact question/action layout, a wider single-row running control bar, and a full-frame scrollable setup panel. The existing 44-pixel primary targets remain usable within the portfolio's reserved navigation areas.

The production generator requires the accepted warehouse entry and rewrites its nested path. Replacing it with the former game entry fails validation. The Chapter III controller uses a new release query. Chapter I, Chapter II and Chapter III Scenes 01–04 retain their renderers and content.

## Model and boundaries

The promoted physical and rendering modules retain their reviewed behavior; changes during promotion are relative paths, release integration and removal of development-only links/labels. The default ten-unit scenario fills all **48 modeled storage positions**, then dispatches and refills. Physical reservations, supported loaded recovery, crew access, service/fault state and inventory ownership remain authoritative. This is a synthetic study, with shared synthetic vehicle profiles rather than certified driving physics or manufacturer load ratings.

The development accounting clock retains 2,400 seconds per month: 40 minutes at 1×, nominally five at 8× or 2.5 at 16×. The requested speed is a ceiling; worker backpressure preserves physical steps under load. Monthly contract, workforce and cost formulas retain their definitions. Ownership, financing, depreciation and insurance remain excluded.

## Release verification

Before publication, verify generated paths, complete setup, the live physical worker, six speed presets, exact paused stepping, full-viewport inspection, navigation/inactivity, continuous resume, replay, reduced motion and missing-resource retry. Render the generated homepage at desktop, phone, tablet and landscape sizes. Confirm that runtime resources are served successfully and that only the scoped runtime, integration files, tests and release documentation are staged.

Repository checks:

```sh
node scripts/sync-production-html.mjs --check
node --test tests/chapter03-publication.test.mjs
git diff --check
```

The publication check includes GitHub Pages' built commit and a live Scene 05 smoke test. Browser viewport emulation does not certify physical phones or Safari/iOS.

## Rollback

The known-good production reference preceding this release is `2f6861e722e33ff0c747b80995dcc1c9f093d7be`. Roll back by reverting only the scoped A12 release commit through normal Git history and publishing that revert. Do not reset or clean unrelated local work.

## Recorded validation

The full source, geometry, motion, continuity and publication regression run passes **79 tests**, with the tested source unchanged during execution. Production generation and its five fail-closed publication tests also pass from the staged Git contents.

Chrome walkthroughs cover 1440 × 900, 390 × 844, 360 × 800, 768 × 1024 and 844 × 390; Firefox covers desktop and phone-sized layouts. Checks include the complete guide, physical worker, speed presets, exact paused stepping, full-viewport inspection, chapter navigation and inactivity, continuous resume and replay with the same plan. Reduced motion, inspection before starting, missing-module retry and nested keyboard controls pass separately. A delayed-image regression reproduces the former frame-load pause and passes with the lifecycle correction.

The runtime audit confirms that promoted motion/model modules match the reviewed development modules after import relocation. Public adaptations are entry/lifecycle integration, responsive controls, resource paths and removal of development-only links/labels. All local module references resolve, vendor bytes match the licensed provenance, and the homepage's other scene markup is unchanged.

The release is published from GitHub Pages' existing `main` / repository-root source. The delivery record identifies the exact built commit and live smoke-test result; the rollback reference above remains independent of the new revision.
