# Red Dwarf Hero — Current Animation Brief

## Status and authority

This is the single current working brief for the Red Dwarf Hero animation on the isolated portfolio development branch.

- Portfolio identity: **Fauzan Widianto — Analytical Systems Builder**.
- Active branch: `design/editorial-systems-prototype`.
- Production must remain untouched until the owner explicitly approves a later integration step.
- Current governance states remain separate: `Implemented`, `Technically validated`, and `Owner approved`.
- Technical verification record: The visual board (`prototypes/red-dwarf-animation/red-dwarf-animation-visual-board.html`) has implemented and verified exact canonical WebGL parity with `index.html` across all 9 deterministic dimensions (renderer, silhouette, FBM surface detail, starspots, plages, coronal atmosphere/rays, alpha composition, 0.92-damped 3D motion, and `u_time = 2.5` reduced motion). Live side-by-side and split slider inspection tools are fully wired and operational. No production files were altered; owner approval remains pending.

## Reconciliation: what is already correct

The current Red Dwarf beside Fauzan's name is already the accepted visual object. Its settled appearance is not the problem and must not be redesigned or replaced as part of the animation task.

The active star already satisfies the current object direction:

- compact, warm, orange-red stellar appearance;
- volumetric/procedural active-star treatment;
- restrained flare/corona behavior;
- sparse astronomical environment;
- typography-led Hero composition;
- Red Dwarf as the dominant visual anchor;
- pointer/touch interaction and static fallback support.

The current task is only to create the animation that forms this existing star on first experience.

### Endpoint Architecture Lock & Canonical Parity Verification

The final settled star is rendered strictly by the canonical WebGL Red Dwarf renderer from `index.html`, not a 2D canvas approximation, separate shader, or substitute sphere.

1. **Canonical Renderer Ownership:** The WebGL shader pipeline from `index.html` is the sole immutable source of truth for the settled star. Any former 2D canvas radial-gradient approximation at the mature stage is bypassed/removed.
2. **Strict Layer Separation:** Matter gathering, curved trajectories, protostar condensation, ignition bloom, and overshoot damping operate as isolated formation layers on a separate 2D canvas. At 08.4s–09.0s, all formation-only drawing concludes completely, handing off visible ownership to the canonical WebGL star container.
3. **No Deformation or Residue:** The canonical star retains its exact shader constants, circular silhouette, limb darkening, and interactive drag without any residual scale, blur, filter, or color deformation from the creation sequence.
4. **Deterministic 9-Dimension Parity Verification:**
   - **Silhouette & Ratio:** Strict 1:1 circular boundary, radius `R = 0.355 * min(W, H)`, `border-radius: 50%`, spherical normal raymarching `z = sqrt(max(0.0, R*R - dist*dist))`.
   - **Size & Viewport Scaling:** Bound to responsive container dimensions, DPR capped at `Math.min(window.devicePixelRatio || 1, 1.75)`.
   - **Color & RGB Constants:** Exact RGB vectors: `c_deep_red (0.78, 0.08, 0.04)`, `c_body_red (1.00, 0.23, 0.15)`, `c_warm_amber (1.00, 0.38, 0.24)`, `c_spot (0.42, 0.04, 0.02)`, `c_plage_amber (1.00, 0.65, 0.15)`, `c_plage_gold (1.00, 0.85, 0.30)`, `c_plage_core (1.00, 0.96, 0.65)`, `c_corona_limb (1.00, 0.32, 0.20)`, `c_corona_dense (0.92, 0.12, 0.06)`, `c_corona_mid (0.65, 0.06, 0.03)`, `c_corona_outer (0.25, 0.015, 0.008)`.
   - **Surface Detail & Granulation:** 4-octave Fractional Brownian Motion (FBM) + 3D Simplex noise with convection speed `tGran = u_time * 0.04 * u_gran_speed`.
   - **Magnetic Starspots:** 2 spot depressions at `(0.18, -0.22, 0.95)` and `(-0.45, -0.30, 0.82)` with depth 1.0.
   - **Active Plages:** 4 3D vector clusters at `(-0.25, 0.12, 0.92)`, `(0.42, 0.45, 0.75)`, `(0.35, -0.48, 0.78)`, `(-0.05, 0.65, 0.72)` with intensity 1.40.
   - **Coronal Atmosphere & Rays:** Exponential falloff `exp(-max(0.0, dNorm) * 3.8)`, 18-ray & 42-ray harmonic wisps, limb factor `pow(mu, 0.16)` and rim glow `pow(1.0 - mu, 3.2) * 0.85`.
   - **Alpha Composition:** `smoothstep(R, R - 0.003, dist)` core edge, `mix(coronaAlpha, 1.0, diskMask)`, dual drop shadows `drop-shadow(0 0 36px rgba(220, 60, 15, .22)) drop-shadow(0 0 96px rgba(150, 30, 10, .16))`.
   - **Motion Dynamics & Reduced Motion:** Drag tilt with pointer capture, velocity damping (0.92), vertical clamping `[-1.0, 1.0]`, auto-spin pause during active drag, and `prefers-reduced-motion` lock to static coherent baseline `u_time = 2.5` with rotation `(0, 0)`.

## Primary animation goal

Show one continuous, understandable transformation that also reflects the analytical system-builder identity:

```text
scattered inputs -> visible patterns -> coherent structure -> ignition -> a stable useful system
```

The animation should explain how the final star is created. It should not redesign the final star, replace it with a different object, or treat the settled star as a new visual concept.

The same matter must remain conceptually traceable through the sequence. Avoid hidden scene cuts, replacement objects, generic crossfades, or an unrelated particle effect followed by a separately introduced star.

## Analytical system-builder narrative

The astronomical story is also a visual metaphor for analytical systems work:

1. **Scattered inputs** — abundant observations or materials exist, but they are not yet organized.
2. **Patterns emerge** — relationships become visible as the matter begins moving in slow, staggered curved paths.
3. **Structure forms** — the protostar gathers the material into a detailed, living center that can be understood and worked with.
4. **A useful system stabilizes** — ignition resolves into the existing Red Dwarf: a reliable visual anchor, with a small amount of ambient context still present around it.

The metaphor must remain editorial and implicit. Do not add dashboards, labels, charts, or literal business UI to the star animation.

## Formation sequence

The first-experience entrance should take approximately **8–10 seconds**. The visual board uses a 9.0-second proof timing as the working midpoint:

1. **Scattered inputs — 00.0s–01.5s**
   - Begin with a wide and abundant field of matter across the available space.
   - Vary particle size, brightness, depth, density, and distance from the center. The field feels meaningful and gently alive, not like a tight preassembled halo or dense particle wallpaper. A readable central negative space is preserved.

2. **Patterns emerge — 01.5s–04.0s**
   - Matter begins gathering slowly in staggered groups and waves.
   - Curved paths guide material toward a shared gravitational center with varied start times, speeds, path curvature, and depth while preserving a clear inward direction.
   - Some matter remains dispersed so the transformation reads as gradual organization rather than a sudden collapse.

3. **Structure develops / living protostar — 04.0s–06.2s**
   - The protostar visibly evolves with layered density, depth, volumetric form, shifting hot regions, mottled detail, internal motion, and restrained gaseous activity.
   - The protostar is never a simple glowing placeholder that merely scales up. The gathered matter remains visually traceable through the formation into the stellar core.

4. **Ignition and expansion — 06.2s–07.2s**
   - Stellar ignition is perceptually distinct from ordinary brightening: a controlled increase in energy, restrained expansion, and a clear outward response without washing out the central subject or introducing a generic explosion effect.
   - Rapid expansion reveals the characteristic Red Dwarf silhouette and coronal boundaries.

5. **Controlled overshoot — 07.2s–08.4s**
   - The forming star briefly exceeds its target scale and energetic extent, then settles smoothly into its approved proportions.
   - Avoids repeated spring bouncing, chaotic turbulence, or a cartoon-like elastic effect.

6. **Stable Red Dwarf / useful system — 08.4s–09.0s**
   - Resolves seamlessly into the exact existing approved Red Dwarf (M3V compact star).
   - The handoff is continuous with no visible jump, generic fade-in, replacement sphere, or residual deformation.
   - A small amount of sparse ambient matter remains after stabilization to preserve environmental context without competing with the stable anchor.

The formation sequence plays once on first experience and does not auto-loop.

## Settled state

After the formation sequence, the existing star remains visible with restrained life:

- slow convective surface movement;
- gentle breathing or buoyant motion if visually useful;
- subtle evolving darker regions or starspots;
- rare, irregular local magnetic flare impulses;
- a small amount of ambient matter remaining after formation;
- no metronomic or exhausting loop.

Ambient sky motion is separate from the formation narrative. It must not imply that the formation sequence is replaying continuously.

## Interaction

Interaction is secondary to identity and composition:

- pointer or touch may create restrained parallax/tilt, approximately 2 degrees;
- pointer interaction must not obscure the name or supporting copy;
- click/tap may trigger one localized flare burst if it improves the object;
- replay may be provided as a small keyboard-accessible control;
- the Hero must remain understandable without interaction.

## Visual language

Preserve the approved mature, warm, restrained astronomical editorial direction:

- near-black or charcoal environment;
- warm off-white typography;
- deep red, burnt orange, and amber accents;
- sparse distant stars;
- large negative space;
- typography-led composition;
- restrained glow and corona.

The final object should read as an original compact M3V red dwarf: gaseous, convective, warm, and magnetically active.

Do not introduce:

- an unstructured particle wallpaper; the opening field may be abundant, but must remain legible and editorial;
- cyberpunk, gaming, or dashboard styling;
- glassmorphism or generic AI gradients;
- excessive bloom or neon glow;
- a yellow-white Sun appearance;
- a generic red planet or lava ball;
- a flat disc or rigid image plane;
- a face, mascot, animal anatomy, or copied character language.

Educational flat-illustration principles may inform clarity, silhouette, anticipation, overshoot, and recovery, but the visual language must remain original and consistent with the recruiter-facing portfolio.

## Accessibility and technical boundaries

- `prefers-reduced-motion` must skip the formation and idle motion and show a stable final-star state.
- A static fallback must remain available when WebGL is unavailable.
- Preserve the current accepted star as the final-state renderer.
- Do not introduce a framework, dependency, rendering engine, or animation library unless a bounded proof demonstrates that the existing path cannot create the required formation sequence.
- Preserve the current HTML/CSS/JavaScript architecture where possible.
- Keep desktop and narrow mobile composition readable with no horizontal overflow.
- Do not alter Hero copy, navigation, unrelated sections, or deployment configuration.

## Development sequence

1. Use the visual-board artifact to align the formation concept and timing.
2. Create a bounded animation proof that leads into the existing star.
3. Capture desktop, mobile, reduced-motion, and time-separated motion evidence.
4. Obtain independent visual review.
5. Only after owner approval, consider integrating the animation into the current Hero implementation.

The current implementation target for a future integration is `index.html`, but no integration is authorized by this brief.

## Canonical development artifacts

- Current portfolio Hero implementation: `index.html`.
- Current Hero styling: `CSS/main.css`.
- Animation visual board: `prototypes/red-dwarf-animation/red-dwarf-animation-visual-board.html`.
- OpenDesign project: `Prototype Brief`.
- Existing settled-star reference: `D:/Projects/open-design/.od/projects/red-dwarf-hero-v2/red-dwarf-active-star.html`.

## Acceptance questions

Before implementation is considered conceptually aligned:

- Does the same matter visibly gather into the final star?
- Does the visual metaphor move clearly from scattered inputs to patterns, structure, and a stable useful system?
- Does the sequence read as scattered matter, gravity, protostar, ignition, and stabilization?
- Does the 8–10-second duration allow the opening abundance (0.0–1.5s), slow gathering (1.5–4.0s), living protostar (4.0–6.2s), ignition (6.2–7.2s), controlled overshoot (7.2–8.4s), and final settling (8.4–9.0s) to breathe?
- Does the final state remain the current accepted Red Dwarf rather than a redesigned object?
- Does a small amount of ambient matter remain after formation to preserve context without competing with the star?
- Is the formation motion visible enough to understand without becoming theatrical?
- Does the star remain the dominant anchor beside the name?
- Is the composition mature and recruiter-facing on desktop and mobile?
- Does reduced motion preserve the final identity?
- Are `Implemented`, `Technically validated`, and `Owner approved` kept distinct?

No production integration, commit, push, deployment, or owner-approval claim may be made solely because a proof renders successfully.
