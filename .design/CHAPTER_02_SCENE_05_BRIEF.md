# Chapter 02 — Scene 05 Brief: Undergraduate Thesis / Physical Synthesis

## Status
- **Scene**: Chapter 02, Scene 05 (Undergraduate Thesis / Synthesis)
- **Sub-Phase**: **05.1B-1 — Feed, Heating & Throttling Approach** (05.1A apparatus geometry frozen at commit `1b63681`).
- **Current Status**: **Owner-approved baseline** (frozen for current phase; 05.1B-2 flash evaporation has not started).
- **Approved Workspace**: `prototypes/scene-05-apparatus-explorations/index.html` (Study C — Hybrid Technical Silhouette + Selective Process Visibility).
- **Primary Factual Authority**: `scene05-reference-pack/01_FACTUAL_ASSETS/thesis_experiment_setup.png` (Universitas Indonesia Mechanical Engineering laboratory test rig, 2018–2019).
- **Supporting Authority**: `scene05-reference-pack/01_FACTUAL_ASSETS/thesis_system_diagram.png` (system architecture and broader cycle context).

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
