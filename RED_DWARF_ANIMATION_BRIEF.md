# Red Dwarf Hero — Current Animation Brief (Frozen Prototype Authority)

## Status and authority

This is the single current working brief for the Red Dwarf Hero animation on the isolated portfolio development branch.

- Portfolio identity: **Fauzan Widianto — Analytical Systems Builder**.
- Active branch: `design/editorial-systems-prototype`.
- Owner decision: the existing approximately 14-second formation animation in `prototypes/red-dwarf-animation/index.html` is approved as-is and must be preserved exactly.
- The accepted behavior includes the current timing, particles, streamlines, formation sequence, replay behavior, interaction, reduced-motion behavior, and settled renderer. This brief must not be used to shorten, redesign, or reinterpret that implementation.
- Production must remain untouched. Approval of the prototype is not approval to integrate it into `index.html`; production integration is a separate future decision.
- Current governance states remain separate: `Implemented`, `Technically validated`, and `Owner approved`.
- The former visual-board reference is superseded. `prototypes/red-dwarf-animation/red-dwarf-animation-visual-board.html` is not present and is not a dependency, authority, or proof requirement for the approved prototype. Do not recreate or repair it merely to satisfy this brief.

## Reconciliation: what is already correct

The existing Red Dwarf formation implementation and the settled object beside Fauzan's name are approved as-is. Neither may be redesigned or replaced as part of future work.

The active star already satisfies the current object direction:

- compact, warm, orange-red stellar appearance;
- volumetric/procedural active-star treatment;
- restrained flare/corona behavior;
- sparse astronomical environment;
- typography-led Hero composition;
- Red Dwarf as the dominant visual anchor;
- pointer/touch interaction and static fallback support.

The current task state is preservation of this existing animation. Any future production integration is a separate decision and is outside this brief's authorization.

### Endpoint Architecture Lock & Preservation Invariants

The final settled star is rendered strictly by the canonical WebGL Red Dwarf renderer from `index.html`, not a 2D canvas approximation, separate shader, or substitute sphere.

1. **Canonical Renderer Ownership:** The WebGL shader pipeline from `index.html` is the sole immutable source of truth for the settled star. Any former 2D canvas radial-gradient approximation at the mature stage is bypassed/removed.
2. **Strict Layer Separation:** Matter gathering, curved trajectories, protostar condensation, ignition bloom, and overshoot damping operate as isolated formation layers on a separate 2D canvas. During the final approximately 13.0s–14.0s handoff, all formation-only drawing concludes completely, handing off visible ownership to the canonical WebGL star container.
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

## Formation sequence (frozen at approximately 14 seconds)

The accepted first-experience entrance is the existing approximately **14-second** implementation. The older 8–10-second wording and 9-second proof timing are superseded and must not be used to change this sequence:

1. **Scattered inputs — 00.0s–01.4s**
   - Begin with a wide field of scattered cosmic matter and preserve a readable central negative space.
   - Vary particle size, brightness, depth, density, and distance from the center without creating dense particle wallpaper.

2. **Directed inward gathering — 01.4s–04.8s**
   - Matter gathers slowly in staggered groups and waves.
   - Curved gravitational streamlines and infalling embers guide material toward a shared center with varied start times, speeds, curvature, and depth.
   - Some material remains dispersed so the transformation reads as gradual organization rather than sudden collapse.

3. **Gravitational condensation — 04.8s–06.8s**
   - The gathered matter condenses toward a persistent central protostar core.
   - The core grows from the same formation path; it is not a replacement sphere or a generic glowing placeholder.

4. **Thermonuclear ignition — 06.8s–07.6s**
   - Ignition is a distinct but restrained energy surge with a controlled outward response.
   - The central subject remains readable and the effect does not become a generic explosion or white flash.

5. **Continuous expansion and controlled peak — 07.6s–10.2s**
   - The forming star expands continuously toward the Red Dwarf silhouette and briefly reaches the implementation's controlled peak overshoot.
   - Do not replace this with repeated spring bouncing, chaotic turbulence, or a shorter timing preset.

6. **Damped settlement — 10.2s–13.0s**
   - The overshoot settles smoothly to the exact canonical scale and state.
   - Formation-only detail reduces through continuity and handoff, not through a global fade that hides a scene cut.

7. **Stable Red Dwarf / useful system — 13.0s–14.0s**
   - The sequence resolves into the exact existing approved Red Dwarf (M3V compact star).
   - A small amount of sparse ambient matter remains for context without competing with the stable anchor.

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

## Governance and future decisions

1. Treat `prototypes/red-dwarf-animation/index.html` as the frozen, owner-approved-as-is implementation.
2. Any future inspection is a preservation check against the existing behavior; it must not alter timing, visuals, interaction, or accessibility behavior.
3. Production integration into `index.html` is a separate owner decision and is not authorized by this brief.
4. Chapter 02 work is not started or authorized by this approval.

## Canonical development artifacts

- Frozen owner-approved formation implementation: `prototypes/red-dwarf-animation/index.html`.
- Current production settled-Hero reference: `index.html`.
- Current Hero styling: `CSS/main.css`.
- Deprecated/non-authoritative standalone artifact: `red-dwarf-animation.html`. It is incomplete; do not repair or replace it as part of this governance work.

## Preservation questions

The following are preservation invariants for future review. They are not permission to reopen the accepted implementation or its timing:

- Does the same matter visibly gather into the final star?
- Does the visual metaphor move clearly from scattered inputs to patterns, structure, and a stable useful system?
- Does the sequence read as scattered matter, gravity, protostar, ignition, and stabilization?
- Does the existing approximately 14-second duration preserve the implemented phases: scattered field (0.0–1.4s), inward gathering (1.4–4.8s), condensation (4.8–6.8s), ignition (6.8–7.6s), expansion (7.6–10.2s), damping (10.2–13.0s), and final settling (13.0–14.0s)?
- Does the final state remain the current accepted Red Dwarf rather than a redesigned object?
- Does a small amount of ambient matter remain after formation to preserve context without competing with the star?
- Is the formation motion visible enough to understand without becoming theatrical?
- Does the star remain the dominant anchor beside the name?
- Is the composition mature and recruiter-facing on desktop and mobile?
- Does reduced motion preserve the final identity?
- Are `Implemented`, `Technically validated`, and `Owner approved` kept distinct?

The explicit owner approval recorded in this brief applies to the existing prototype only. A successful render must not be used to infer production integration, a new timing variant, or any additional approval.
