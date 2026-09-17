# Chapter 02 — Scene 05 Brief: Undergraduate Thesis / Physical Synthesis

## Status
- **Scene**: Chapter 02, Scene 05 (Undergraduate Thesis / Synthesis)
- **Sub-Phase**: **05.1B-3B — Condensation Inside Condenser** (05.1A apparatus geometry frozen at commit `1b63681`, 05.1B-1 baseline frozen at `618c689`, 05.1B-2A baseline frozen at `f6a7dde`, 05.1B-2B baseline frozen at `7838d00`, 05.1B-3A baseline frozen at `42ba6b1`, current 05.1B-3B implementation approved).
- **Current Status**: **05.1B-3B — Owner-approved / frozen** (frozen for current phase; 05.1B-3C has not started).
- **Approved Workspace**: `prototypes/scene-05-apparatus-explorations/index.html` (Study C — Hybrid Technical Silhouette + Selective Process Visibility).
- **Primary Factual Authority**: `scene05-reference-pack/01_FACTUAL_ASSETS/thesis_experiment_setup.png` (Universitas Indonesia Mechanical Engineering laboratory test rig, 2018–2019).
- **Supporting Authority**: `scene05-reference-pack/01_FACTUAL_ASSETS/thesis_system_diagram.png` (system architecture and broader cycle context).

---

## Approved 05.1B-3B Baseline Scope (Condensation Inside Condenser)

1. **Scope Boundary & Fixed Stop**:
   - Covers the physical condensation sequence inside Condenser `[10]` from $t = 46.5\,\text{s}$ through $61.5\,\text{s}$:
     `vapor at condenser inlet → condenser cooling activation → illustrative cooling path entry → progressive phase transformation → distillate liquid emergence → condenser outlet ready hold`.
   - Halts strictly at the bottom outlet flange boundary ($X = 870, Y = 275$) with pure distillate liquid condensate held in an operating meniscus state.
   - Sub-phase 05.1B-3C (Extraction Pump `[11]`, Aquadest Collection Bottle `[12]`, and thesis distillate yield) has **not started**.

2. **Illustrative Cooling Path Factual Boundary**:
   - The internal serpentine route inside Condenser `[10]` is an **illustrative process visualization / cooling path**, not a verified literal construction of the internal tubes.
   - Neither exactly four passes nor specific internal bend radii are asserted as factual physical apparatus internals.
   - The external condenser cabinet, radiator fins, axial fan assembly, and relative dimensions remain physically factual; the internal fluid visualization remains an abstraction for process flow readability.

3. **Continuous Working-Fluid Material Identity**:
   - The material identity remains strictly continuous across the vapor-to-liquid phase transformation: the viewer observes the same working fluid condensing into liquid, rather than warm material disappearing and unrelated blue liquid appearing.
   - Phase transition is communicated through physical and optical behavior:
     - **Path Entry ($t = 49.0 \to 52.0\,\text{s}$, Beat 20)**: Gaseous vapor with warm-white core (`rgba(254, 243, 199, 0.65)`), soft amber thermal halo (`rgba(245, 158, 11, 0.28)`), and moving dash drift continuous with the upstream line.
     - **Progressive Condensation ($t = 52.0 \to 55.5\,\text{s}$, Beat 21)**: Heat rejection to the radiator fins causes vapor volume and diffusion to contract; the halo contracts from 6.0px to 3.2px and desaturates toward a warm off-white/pearl tone; the gaseous dash spacing tightens and fades; a coherent warm-neutral liquid core emerges.
     - **Liquid Distillate Emergence ($t = 55.5 \to 58.5\,\text{s}$, Beat 22)**: Gaseous softness fully condenses into a coherent, dense warm-neutral clear distillate liquid stream (`#f1f5f9`, width 2.2px) with a restrained specular meniscus highlight (`#ffffff`, width 0.8px).
     - **Outlet Ready Hold ($t = 58.5 \to 61.5\,\text{s}$, Beat 23)**: Pure liquid condensate reaches the bottom outlet flange ($X = 870, Y = 275$), forming an operational holding meniscus (`#f1f5f9` with `#ffffff` border).
   - Zero separate cyan mist, bright blue infographic water (`#38bdf8`), or theatrical cold auras are introduced.

4. **Restrained Mechanical Cooling Activation**:
   - The condenser axial cooling fan starts gently after a brief readiness hold ($t = 46.5 \to 47.2\,\text{s}$ pause, accelerating smoothly from $47.2 \to 49.0\,\text{s}$ to $360^\circ/\text{s}$).
   - Rendered using muted structural steel line weights (`rgba(148, 163, 184, 0.2)` to `0.35`) without theatrical vibration, glowing rings, or saturation spikes.
   - Serpentine cooling path remains completely dry until vapor physically crosses the inlet threshold at $t = 49.0\,\text{s}$.

5. **Hard Downstream Boundary (Exact Frozen Handoff State for 05.1B-3C)**:
   - Pure liquid distillate condensate is established and held at Condenser `[10]` outlet flange ($X = 870, Y = 275$);
   - Extraction line (`M 870 275 L 812 275 L 812 285`) remains **100% dry and unilluminated steel**;
   - Extraction Pump `[11]` remains **powered off** (zero impeller rotation);
   - Aquadest Collection Bottle `[12]` remains **100% empty and dry**;
   - All upstream apparatus components (feed pump, heater, throttling valve, flash vessel, brine basin, overhead vapor line) remain in steady continuous operation.

---

## Approved 05.1B-3A Baseline Scope (Vapor Transport to Condenser Inlet)

1. **Scope Boundary & Fixed Stop**:
   - Covers the physical transport of separated vapor from the Flash Vessel `[8]` top outlet nozzle ($X = 645, Y = 165$) through the overhead line up to the inlet flange of Condenser `[10]` ($X = 805, Y = 200$), spanning $t = 36.0\,\text{s}$ through $46.5\,\text{s}$.
   - Halts strictly at the condenser inlet boundary with vapor charged up to the flange interface and a soft ready wisp held.
   - Sub-phase 05.1B-3B (condenser cooling fan, internal serpentine condensation, extraction pump `[11]`, and aquadest collection bottle `[12]`) has **not started**.

2. **Transport Mechanism & Conservative Scientific Terminology**:
   - **Pressure-Driven Pipe Flow**: Once vapor enters the connected piping, transport is governed primarily as *pressure-driven vapor flow through the overhead line* driven by the process pressure differential, rather than buoyancy (buoyancy applies to in-vessel separation).
   - **Vapor Accumulation at Outlet**: The initial handoff state ($t = 36.0 \to 37.5\,\text{s}$, Beat 14) is framed conservatively as *Vapor Accumulation at Outlet / Vapor Outlet Readiness*, without implying unverified measured pressure-rise telemetry.
   - Zero visible numerical pressure values, telemetry gauges, or thermodynamic equations added to the runtime.

3. **Segment-by-Segment Pipe Population Rule**:
   - The pipe-population rule is authoritative: each pipe segment stays completely dry until the continuous vapor wavefront physically reaches it.
   - Sequence:
     - Beat 14 ($t = 36.0 \to 37.5\,\text{s}$): Vapor accumulated at dome/outlet nozzle threshold; overhead pipe 100% dry.
     - Beat 15 ($t = 37.5 \to 39.5\,\text{s}$): Vapor occupies the vertical routed pipe segment ($Y = 165 \to 135$) and rounds Upper Elbow 1.
     - Beat 16 ($t = 39.5 \to 42.0\,\text{s}$): Pressure-driven flow traverses the horizontal overhead run ($X = 655 \to 755$) and rounds Upper Elbow 2.
     - Beat 17 ($t = 42.0 \to 44.0\,\text{s}$): Vapor descends the vertical downpipe ($Y = 135 \to 190$) and rounds the bottom elbow.
     - Beat 18 ($t = 44.0 \to 46.5\,\text{s}$): Vapor arrives at the Condenser `[10]` inlet flange ($X = 805, Y = 200$) and settles into a stable readiness hold.

4. **Visual Abstraction Boundary**:
   - The warm-white core with amber-gold halo is a visual abstraction of gaseous vapor transport, not literal visible smoke.
   - The moving dash texture communicates directional gaseous flow along the pipe lumen and remains strictly clipped inside the pipe geometry, restrained, and continuous with the vapor state in Flash Vessel `[8]`.

5. **Hard Downstream Boundary (Exact Frozen Handoff State for 05.1B-3B)**:
   - Vapor has reached Condenser `[10]` inlet flange boundary ($X = 805, Y = 200$);
   - Condenser `[10]` internal serpentine and fin matrix remain 100% dry and inactive;
   - Condenser fan remains completely off;
   - Zero condensation droplets or liquid films exist inside condenser;
   - Extraction Pump `[11]` remains powered off and inactive;
   - Aquadest Bottle `[12]` remains empty and dry;
   - Brine Basin `[9]` liquid level and Flash Vessel `[8]` vapor cushion remain stable and undisturbed.

---

## Approved 05.1B-2B Baseline Scope (Flash Vessel Phase Separation)

1. **Scope Boundary & Fixed Stop**:
   - Covers the physical phase-separation sequence inside Flash Vessel `[8]` and Brine Catchment Basin `[9]` from $t = 24.5\,\text{s}$ through $36.0\,\text{s}$.
   - Halts strictly with buoyant vapor resting at the top flash-vessel outlet nozzle ($X = 645, Y = 165$) and drained brine accumulated in Basin `[9]`.
   - Sub-phase 05.1B-3 (vapor traversal through overhead line, condenser operation, distillate extraction pump, and aquadest collection) has **not started**.

2. **Approved Causal Choreography**:
   - **Existing Inlet Two-Phase State ($t = 24.5\,\text{s}$)**: Seamless continuation from the exact hold state of `f6a7dde` with plume occupying the inlet region.
   - **Horizontal Momentum Decays ($t = 24.5 \to 26.5\,\text{s}$, Beat 9)**: Plume loses forward jet velocity inside the expanded vessel chamber without unnatural wall bounce.
   - **Phase Disengagement ($t = 26.5 \to 28.5\,\text{s}$, Beat 10)**: Progressive divergence where vapor fraction expands and begins upward migration, while residual liquid loses upward momentum and settles downward under gravity.
   - **Buoyant Vapor Rise & Liquid Gravity Settling ($t = 28.5 \to 31.0\,\text{s}$, Beat 11)**:
     - Vapor cloud and subtle rising wisps ascend into the upper dome, pooling at the top outlet nozzle ($X = 645, Y = 165$).
     - Residual liquid falls down the conical hopper walls ($Y = 325 \to 365$) and pools at the apex drain.
   - **Residual Liquid Drainage ($t = 31.0 \to 33.5\,\text{s}$, Beat 12)**:
     - Bottom drain activates only after liquid physically reaches the hopper apex.
     - Falling liquid descends in a vertical gravity stream into Brine Catchment Basin `[9]`.
     - Basin `[9]` begins filling only after physical liquid impact ($t \approx 31.8\,\text{s}$), forming an amber pool with localized ripples and a rising meniscus.
   - **Vapor Outlet Readiness & Separation Hold ($t = 33.5 \to 36.0\,\text{s}$, Beat 13)**:
     - Stable separated hold: vapor charged at the vessel outlet threshold; liquid accumulated in Basin `[9]`; system holds ready for 05.1B-3 handoff.

3. **Factual Interpretation Boundary**:
   - **Vapor Abstraction Boundary**: Vapor wisps and diffuse vapor geometry are a visual abstraction of vapor-phase disengagement, not a literal claim that visible smoke exists inside the actual vessel.
   - **No Undocumented Internals**: No undocumented demister pads, trays, baffles, or internal mechanical separators are implied.
   - **Drainage Geometry**: Residual-liquid drainage is represented only through the documented lower vessel conical hopper and vertical discharge into Basin `[9]`.
   - **Basin Arrival Rule**: Basin `[9]` must remain 100% empty until actual drainage arrives and impacts the floor.

4. **Hard Downstream Boundary (Exact Frozen Handoff State for 05.1B-3)**:
   - Vapor is present at the flash-vessel outlet ($X = 645, Y = 165$);
   - Residual liquid has separated downward;
   - Drained liquid is present in Brine Basin `[9]`;
   - The overhead line beyond the vessel outlet ($Y < 165$) remains completely dry;
   - Condenser `[10]` remains inactive;
   - Condenser fan remains inactive;
   - Extraction Pump `[11]` remains inactive;
   - Aquadest Collection Bottle `[12]` remains unchanged/dry.

5. **Review Tooling Boundary**:
   - The development HUD, timeline scrubber, 13 beat selectors (`1·Feed` through `13·Hold`), keyboard controls, and `window.scene05Player` API are non-production review tooling only.
   - They must not be treated as portfolio UI.

---

## Approved 05.1B-2A Baseline Scope (Throttling Crossing & Flash Onset)

1. **Scope Boundary & Fixed Stop**:
   - Covers the physical sequence from primed valve hold ($t = 17.5\,\text{s}$), restriction node `(0, 0)` crossing ($t = 18.3\,\text{s}$), valve outlet cavity fill ($X = 540 \to 552$), incipient flashing along downstream spool ($X = 552 \to 620$), localized flash plume expansion into Flash Vessel `[8]` inlet zone ($X = 620 \to 656$), to unresolved two-phase hold ($t = 24.5\,\text{s}$).
   - Halts strictly before macroscopic vapor/liquid phase separation develops.

2. **Thermodynamic Terminology**:
   - Framed strictly as *isenthalpic throttling followed by flash onset caused by the pressure reduction*.
   - Never described as "Joule-Thomson expansion". $h_1 \approx h_2$ remains solely an internal design/engineering note, excluded from visible UI. Zero gratuitous equations or numerical telemetry.

3. **Stationary Valve Geometry**:
   - External valve body, stem, and handwheel remain physically stationary throughout the sequence.
   - Fluid crossing the restriction throat node `(0, 0)` ($X = 540$) is the causal event, eliminating artificial handwheel rotation or stem-unseating motions.

4. **Restrained Downstream Spool (Incipient Flashing)**:
   - Downstream interconnecting spool ($X = 552 \to 620$) exhibits incipient flashing rather than a fully developed two-phase stream: narrow vapor sheath ($3.6\,\text{px}$), restrained opacity ($0.45$), low micro-void density (`stroke-dasharray="1.5 6"`), and a continuous liquid core ($2.0\,\text{px}$).
   - Stronger two-phase flash plume emerges only inside Flash Vessel `[8]`'s ghosted phase-change expansion zone ($X = 625 \to 665, Y = 214 \to 242$).

5. **Strict Downstream Dry Boundary**:
   - Flash vessel upper dome ($Y = 165$), overhead vapor duct ($Y = 125$), lower funnel ($Y = 325\dots 365$), and brine catchment basin `[9]` contain zero fluid or vapor.
   - Condenser `[10]`, extraction pump `[11]`, and aquadest collection bottle `[12]` remain 100% dry and inactive.

6. **Sub-Phase 05.1B-2B Confirmation**:
   - Sub-phase 05.1B-2B (vapor rising to dome, liquid draining to funnel, condenser operation, distillate yield) has **not started**.

---

## Approved 05.1B-1 Baseline Scope (Feed, Heating & Throttling Approach)

1. **Scope Boundary & Fixed Stop**:
   - Covers the physical sequence: Feed intake → feed pump `[1]` → heated vessel `[4]` → thermal buildup → top outlet → overhead transfer → sensor response `[5, 6]` → throttling restriction `[7]`.
   - Motion halts strictly at the restriction point ($X = 540$, node `(0, 0)` of manual valve `[7]`).
   - Final state holds with pressurized/heated fluid primed immediately upstream of the restriction.

2. **Downstream-Dry Requirement**:
   - Downstream interconnecting spool (`M 552 226 L 620 226`), flash vessel `[8]`, brine catchment basin `[9]`, overhead vapor path, condenser `[10]`, extraction pump `[11]`, and aquadest collection bottle `[12]` contain zero fluid and remain 100% dry and inactive.

3. **Causal Choreography Preserved**:
   - **Inactive Starting State**: Rig begins completely settled, cold, and empty.
   - **Feed Intake Entry**: Fluid introduces only at the intake/manifold area and sight flow indicator `[3]`, not downstream.
   - **Pump Engagement Before Advance**: Pump motor visibly accelerates to operating speed before discharge fluid moves (operating head required).
   - **Bottom Vessel Fill**: Fluid enters documented bottom inlet flange `(230, 345)` and rises inside vessel `[4]`.
   - **Thermal Buildup After Presence**: Thermal addition zone activates and fluid transitions to amber-gold only after fluid physically enters and occupies the heated region ($t \ge 6.4\,\text{s}$). No unverified internal coils, baffles, or numerical temperatures.
   - **Top Outlet Continuity**: Fluid exits top dome `(243, 200)` into vertical riser seamlessly; zero gaps, jumps, or teleportation.
   - **Overhead Transfer & Sensors**: Fluid follows pipe centerline; Bourdon gauge pointer deflects $+38^\circ$ clockwise upon fluid arrival at $X = 410$; thermocouple port activates amber thermal monitoring upon hot fluid arrival at $X = 450$.
   - **Throttling Approach Deceleration**: Fluid decelerates approaching the valve, fills upstream flange, and halts right at restriction node `(0, 0)`. Upstream fluid column compresses subtly.
   - **Immutable Order**: The causal order (`feed → pump → heated vessel → thermal buildup → top outlet → overhead transfer → sensor response → throttling restriction`) is authoritative and must not be altered by later sections.

4. **Tooling Boundary (Review/Development Controls Only)**:
   - The interactive review controls (`PLAY / PAUSE`, `RESTART`, beat-stepper buttons `1·Feed` to `6·Valve`, timeline scrubber, keyboard shortcuts, and `window.scene05Player` API) are **review and verification tooling only**.
   - They are non-authoritative controls provided in the isolated exploration workspace and **must not automatically migrate into the production Scene 05 visual language**.

---

## Approved 05.1A Baseline Scope

1. **Editorial 2D Vector Representation**:
   - Clean 2D orthographic engineering elevation preserving actual equipment aspect ratios and relative physical heights.
   - Design tokens: near-black background (`#07090e`), warm off-white technical outlines (`#f1f5f9`), structural steel framing (`#334155`), restrained amber accents (`#f59e0b`), valve red (`#ef4444`), and tech cyan (`#64b5f6`).
   - Fixed $1000 \times 520\,\text{px}$ apparatus coordinate system with datum baseline at $Y = 460$.

2. **Documented Hardware Components (1–13)**:
   - `[1]` Feed / Circulation Pump (floor level, $X = 180\dots 235, Y = 420\dots 460$);
   - `[2]` Manifold & Intake Assembly ($X = 110\dots 170, Y = 435\dots 460$);
   - `[3]` Sight Flow Indicator ($X = 80\dots 94, Y = 380\dots 425$);
   - `[4]` Vertical Heated Vessel with external insulation wrap and tripod mount ($X = 220\dots 266, Y = 190\dots 460$);
   - `[5]` Apex Bourdon Dial Pressure Gauge ($X = 410, Y = 72\dots 130$);
   - `[6]` Downstream $T_{in}$ Thermocouple / Sensor Port ($X = 450, Y = 130\dots 166$);
   - `[7]` Manual Throttling Valve with prominent red circular handwheel ($X = 540, Y = 210\dots 244$);
   - `[8]` Vertical Flash Separation Vessel on elevated tripod legs ($X = 620\dots 670, Y = 190\dots 460$);
   - `[9]` Brine / Liquid Effluent Catchment Basin ($X = 605\dots 685, Y = 395\dots 460$);
   - `[10]` Air-Cooled Condenser / Radiator with aluminum fins and axial fan casing ($X = 805\dots 940, Y = 160\dots 275$);
   - `[11]` Distillate Extraction Pump ($X = 798\dots 826, Y = 285\dots 315$);
   - `[12]` Aquadest Collection Bottle with purified distillate yield ($X = 808\dots 836, Y = 385\dots 460$);
   - `[13]` Benchtop Power Supply / Instrument Controller ($X = 855\dots 920, Y = 380\dots 435$).

3. **Restrained Process Visibility (Abstracted Cutaways)**:
   - **Heated Vessel**: Restrained warm thermal addition core (`rgba(245, 158, 11, 0.07)` with faint dashed boundary); no unverified coil profile.
   - **Throttling Valve**: Manual red valve body with an abstract restriction node (`circle r="1.5"`); no unverified choke-plate geometry.
   - **Flash Vessel**: Ghosted phase-change expansion zone immediately downstream of the inlet (`stroke-dasharray="2 2"`); no unverified spray cone or atomizing nozzle.
   - **Condenser**: Simplified illustrative single-line serpentine condensation path tracing vapor-to-liquid transformation through radiator fins.
   - **Collection Bottle**: Clean, recognizable PET bottle silhouette and liquid fill level; no artificial mid-air droplet graphics.

4. **Inspection Beacon Concept**:
   - Dedicated pulsing amber beacon (`#thesis-photo-inspect-btn`) proposing future modal access to the authentic 2018–2019 laboratory photograph.
   - Preserves a clean, paragraph-free canvas surface.

---

## Explicit Factual-Integrity Boundaries

To preserve strict academic and technical credibility:
- **No literal undocumented immersion heater geometry**: The internal heating coil is abstracted to a soft thermal core.
- **No invented valve-seat construction**: The throttling valve shows only external geometry and an abstract restriction point.
- **No invented flash spray nozzle/cone**: Phase change occurs in a ghosted region without claiming an internal nozzle mechanism.
- **No unsupported internal condenser construction**: Radiator interior is shown as a simplified process path only.
- **No numerical telemetry**: No mock or unverified pressures, temperatures, flow rates, or efficiencies ($+35\%$, etc.) are displayed.
- **No equations or conclusions yet**: Mathematical models and experimental comparisons belong to later phases (05.2–05.6).

---

## Fixed Geometry Authoritative for Section 05.1B

When process flow animation begins in 05.1B, the following geometry is locked and authoritative:
- **Canvas Bounds**: $1000 \times 520\,\text{px}$ viewBox;
- **Floor Datum**: Bench reference line at $Y = 460$;
- **Process Sequence & Physical Order**:
  1. Low-pressure feed from intake `[2]` and pump `[1]` enters vessel `[4]` bottom flange ($Y = 375$);
  2. Fluid rises through heated vessel `[4]` and exits top cap ($Y = 190$);
  3. Overhead line reaches apex ($Y = 130$) across gauge `[5]` and sensor port `[6]`;
  4. Line descends vertically and enters throttling valve `[7]` ($X = 540, Y = 226$);
  5. Downstream pipe enters flash vessel `[8]` upper side ($Y = 226$);
  6. Phase separation divides flow into:
     - Overhead vapor exiting top dome ($X = 645, Y = 165$) toward condenser `[10]`;
     - Heavy unevaporated brine draining from bottom hopper ($Y = 365$) into catchment tub `[9]`;
  7. Vapor condenses across condenser `[10]` and is extracted by pump `[11]` into collection bottle `[12]`.

---

## Conservative Decisions for Section 05.1B
- **Heated Vessel**: Fluid motion enters bottom port, warms in the thermal core, and exits top port without depicting unverified internal circulation spirals or baffles.
- **Flash Vessel**: Flashing is represented as a thermodynamic transformation across the immediate post-throttling zone, not a mechanical atomizing spray.
- **Yield & Effluent**: Aquadest accumulates gradually in collection bottle `[12]`, while non-evaporated effluent drains to brine basin `[9]`.
