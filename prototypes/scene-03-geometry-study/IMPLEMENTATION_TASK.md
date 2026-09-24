# Scene 03 — Animation Finalization & Integration Task

## Mission

Take ownership of Chapter II Scene 03 from its current causal-animation prototype through a visually mature, integrated portfolio scene.

You are the **orchestrator, technical reviewer, and taste reviewer**. Use **Gemini 3.8 Flash High through AntigravityRunner** as the primary implementation worker. Do not require the owner to relay prompts, approve routine implementation choices, or review intermediate passes.

Work autonomously through implementation, correction, verification, visual refinement, integration, and final QA.

**Do not notify the owner about intermediate progress.** Surface the result only when you judge the scene mature enough for owner acceptance, or when a genuine authority-level conflict makes completion impossible without changing an accepted decision.

---

## 1. Role Architecture

### Sol — Orchestrator / Reviewer

You own:

- current-state reconstruction;
- authority interpretation;
- milestone planning;
- worker task definition;
- Git supervision;
- code review;
- rendered verification;
- causal/process verification;
- animation taste review;
- acceptance/rejection of worker output;
- deciding whether another correction pass is necessary;
- deciding when the scene is mature enough to surface to the owner.

Do not trust a worker `SUCCESS` message by itself.

After every meaningful worker pass:

1. inspect the actual Git diff;
2. inspect affected source files;
3. run or inspect relevant verification;
4. render/view the result;
5. judge causal correctness and visual maturity;
6. accept, correct, or reject the pass.

Routine implementation friction belongs to you and the worker, not the owner.

### Gemini 3.8 Flash High + AntigravityRunner — Implementation Worker

The worker owns:

- SVG/CSS/JS implementation;
- OpenDesign usage where useful;
- browser/runtime debugging;
- Python measurement where useful;
- rendering/checkpoint capture;
- deterministic tests;
- responsive fixes;
- minor refactors required by the task;
- implementation self-review.

Give the worker **bounded outcome-sized tasks**, not one giant vague instruction and not dozens of microscopic prompts.

Prefer:

`milestone → worker implementation → worker self-check → Sol review → targeted correction if needed → Sol acceptance`

Do not introduce additional agents, frameworks, rendering engines, orchestration systems, or architectural layers unless the existing path genuinely cannot achieve the required result.

---

## 2. Authority Order

Before making changes, establish the current repository state and read the relevant authority files that exist in the repository.

Authority precedence is:

1. **Frozen Scene 03 visual geometry**
   - `prototypes/scene-03-geometry-study/reference_1080p.png`
   - current accepted `prototypes/scene-03-geometry-study/scaffold.svg`

2. **Physical behavior authority**
   - any current Scene 3 Physical Behavior Contract / implementation handoff in the repo;
   - if no standalone contract exists, the governing behavior summary in this task is authoritative.

3. **Animation design authority**
   - any current Scene 3 Animation Design Specification / implementation handoff in the repo;
   - if no standalone specification exists, the animation responsibilities and sequencing in this task are authoritative.

4. **Portfolio/current art direction**
   - `.design/CURRENT_DIRECTION.md`
   - `.design/CHAPTER_02_SCENE_03_BRIEF.md`
   - `.design/skills/structured-animation-development/SKILL.md`

5. **Existing accepted repository architecture**

6. **Implementation judgment**

When an older document conflicts with the frozen six-stage Scene 03 topology, the frozen topology wins.

Do not add a weighbridge or another process stage because an older brief mentions one.

External palm-oil knowledge may clarify behavior but may not redesign the accepted illustration or process topology.

---

## 3. Frozen Process Topology

The accepted scene contains exactly six visible stations:

1. FFB intake and cart
2. sterilization
3. threshing
4. pressing
5. clarification
6. CPO storage/outflow

The process lineage is:

`FFB → sterilized bunches → loose fruit + EFB → press liquor + fibre/nut cake → oil-rich stream + sludge → stored/outflowing CPO`

The still illustration may show material at multiple places simultaneously because it is a schematic plant snapshot. The animation should follow **one traced batch lineage** and must not treat every visible material mark as another copy of that same batch.

By-products remain distinct:

- EFB leaves at Stage 03;
- fibre/nut press cake leaves at Stage 04;
- sludge leaves at Stage 05.

---

## 4. Core Design Principle

The scene follows one governing rule:

> Nothing moves unless the palm-oil process causes it to move.

Motion must communicate cause and consequence rather than merely indicate that machinery is active.

Material cannot:

- teleport;
- duplicate;
- disappear without containment or a valid outlet;
- change state without a visible cause;
- travel independently of conveyor contact, gravity, pressure, rotation, compression, settling, or connected liquid flow.

Fixed machinery should remain fixed.

Stillness is part of the animation language.

---

## 5. Global Physical Rules

Use **physically informed animation**, not numerical engineering simulation.

- Conveyors move solids through contact.
- Gravity carries material down open chutes.
- Powered rotation moves the thresher rotor and press screw only while processing.
- Sterilization happens inside a sealed vessel.
- Steam/pressure treatment must occur after sealing and before opening.
- Liquid remains inside connected pipes and vessels.
- Clarification occurs through accumulation, settling, and layer separation, not decorative stirring.
- Fixed shells, decks, supports, pipes, labels, and containment do not sway or move to suggest activity.
- Persistent state changes such as accumulated by-products, changed liquid levels, or separated layers remain after a local machine stops.

Do not introduce CFD, thermodynamics, rigid-body simulation, or detailed plant engineering unless a specific visible behavior genuinely requires it.

---

## 6. Visual Character

Maintain the existing portfolio language:

- near-black astronomical/editorial-engineering environment;
- restrained warm amber / burnt orange / bronze;
- muted machinery and structural linework;
- saturated warmth primarily for active material/process emphasis;
- cyan only when semantically earned elsewhere in the portfolio, not as generic activity decoration;
- sparse;
- cinematic;
- mature;
- technically legible;
- animation-first without becoming a simulation dashboard.

Increase **fidelity, not realism**.

Do not drift into:

- photorealistic industrial rendering;
- cartoon machinery;
- generic SaaS;
- sci-fi HUDs;
- telemetry-heavy presentation;
- excessive labels;
- decorative particles;
- travelling glow used as fake material;
- arbitrary pulsing;
- everything moving simultaneously;
- perpetual machine loops;
- visual activity without process cause.

The final integrated scene must not depend on debug UI to feel understandable.

---

## 7. Current Prototype State

A complete Stage 01 → 06 causal prototype already exists in:

`prototypes/scene-03-geometry-study/`

The prototype includes a dedicated animation entry point, CSS, JavaScript, and a semantically tagged SVG. It has already demonstrated that the complete causal sequence is implementable without replacing the existing rendering architecture.

Treat it as the implementation starting point, not as automatically accepted final output.

The static visual baseline must remain protected.

Known prior verification reported essentially zero visual geometry drift at the static initial frame, but verify the current repository yourself rather than trusting that report.

---

## 8. Mandatory First Audit

Before aesthetic tuning, inspect the **actual current implementation**, not only previous reports.

Correct the following known authority violations if still present.

### Stage 06 top fitting

Its purpose is unresolved.

It must **not** behave as a float, paddle, level sensor, agitator, or other mechanism unless accepted authority explicitly establishes that role.

Default:

**keep it completely static.**

### Stage 06 outflow arrow

The arrow is static diagrammatic artwork.

Do not animate, illuminate, pulse, translate, or otherwise use the arrow as the outflow itself.

Actual liquid/material behavior should communicate outflow.

### Stage 04 screw press

The screw may rotate.

The processed material progresses axially.

Verify that the physical screw assembly itself is not visibly translating longitudinally merely to simulate rotation.

If a texture/phase technique creates the impression of rotation while the shaft remains spatially fixed, that is acceptable.

### Prototype telemetry / debug UI

Scrubber, checkpoints, timecode, stage labels, speed controls, and similar tooling are useful in the isolated prototype.

They are **development controls**, not Chapter II art direction.

Keep diagnostic controls available where useful for development, but visually and architecturally separate them from the portfolio scene.

Do not integrate the telemetry/HUD treatment into the final Chapter II composition.

Complete this authority-compliance audit before spending time on animation polish.

---

## 9. Animation Responsibilities

Preserve the accepted six-stage process.

### Stage 01 — Intake · moderate

**Trigger:** cart is ready to unload.

**One-time machine event:** the visible gate/tipping action opens the discharge.

**Active motion:** the receiving conveyor runs only while bunches are present.

**Material response:** intact FFB fall into the receiving hopper under gravity, then travel uphill through conveyor contact.

**Handoff:** the same batch enters the sterilizer loading path.

**Still:** rails, structural deck, supports, downstream machinery.

Do not let the cart hover, leak material through a closed gate, or create unexplained fruit.

### Stage 02 — Sterilization · long / quiet

**Trigger:** the traced load is inside.

**One-time events:** doors close/seal before treatment; doors reopen only after treatment and release/depressurization.

**Contained state:** intact bunches remain inside while heating softens them and loosens their fruit attachment.

This is one of the scene's major periods of deliberate stillness.

**Handoff:** sterilized bunches leave toward the thresher.

**Still:** vessel shell, saddles, deck, downstream equipment.

Nothing crosses a sealed door. Avoid using glow alone as a substitute for process communication.

### Stage 03 — Threshing · moderate

**Trigger:** sterilized bunches reach the rotor.

**Active machine motion:** powered rotor runs only while processing material.

**Material response:** contact/tumbling separates loose fruit from stripped bunch frames.

**Split:**
- EFB falls into its established Stage 03 branch/collection;
- loose fruit follows the accepted rightward route, far-right descent, return conveyor corridor, and press feed route.

Gravity handles open drops. Conveyors handle supported travel.

Do not send EFB down the fruit route.

### Stage 04 — Pressing · moderate

**Trigger:** loose fruit reaches the press feed.

**Active machine motion:** drive and screw operate only while feed is present.

**Material response:** compression produces two causal outputs:
- press liquor;
- fibre/nut cake.

These outputs may depart concurrently because the same compression creates both.

The press liquor is not yet clarified CPO.

Do not imply an unsupported shell-cracking process.

The screw rotates; the screw body itself should remain spatially anchored.

### Stage 05 — Clarification · long / quiet

**Trigger:** press liquor actually reaches the vessel.

**Machine behavior:** vessel contains the incoming mixture. Do not animate the ambiguous central shaft merely to show activity.

**Material response:** the mixture accumulates, develops an oil-rich upper region, and a denser settling region. Sludge moves toward the bottom discharge.

Separation must feel gradual relative to inflow.

Do not instantly turn the whole tank into clean oil.

**Stage 05 → 06 causal constraint:** the depicted outlet is above the earlier illustrated liquid surface. The accepted minimal reading is that incoming material may raise the oil-rich layer until the existing outlet becomes credible before transfer begins.

If current geometry still cannot support a convincing transfer, understate or pause that handoff rather than inventing a hidden pump, siphon, pickup, or mechanism.

### Stage 06 — Storage / Outflow · brief after valid handoff

**Trigger:** oil has traversed the Stage 05 → 06 route and entered the storage tank.

The visible pool may represent existing inventory; do not imply that one traced FFB batch fills the entire tank.

**Material response:** liquid level may respond to actual inflow and actual outflow.

**Outflow:** communicate flow through liquid/material behavior, not the diagrammatic arrow.

**Still:** tank shell, supports, pipework, outflow arrow, unresolved top fitting.

Do not animate the unresolved top fitting.

---

## 10. Event Motion vs Active Motion

Maintain this distinction throughout implementation.

### One-time events

Examples:

- cart tipping/opening;
- sterilizer door closure;
- sterilizer door reopening;
- a supported valve state transition.

These occur once when caused.

### Active processing motion

Examples:

- conveyor movement while material is transported;
- thresher rotor while bunches are inside;
- press screw rotation while feed is present;
- liquid movement while connected flow exists.

These stop when the causal condition ends.

### Persistent state changes

Examples:

- accumulated by-product piles;
- changed tank level;
- settled clarification layers;
- material already transferred downstream.

Do not reset these merely because a local machine stops.

---

## 11. Cross-Stage Continuity

Use overlap only where the physical process supports it.

Examples:

- intake conveying may continue while the sterilizer is loading, but sealing waits until the traced load clears the doorway;
- sterilizer discharge may feed the thresher, but threshing cannot precede release;
- EFB can continue falling while detached fruit travels onward;
- press cake can continue dropping while press liquor begins moving to Stage 05;
- clarifier inflow and settling can coexist;
- sludge discharge and upper-oil withdrawal are distinct responses to established layers.

Wait at actual state changes:

- steam treatment requires a sealed vessel;
- opening requires treatment/release;
- pressing requires feed;
- Stage 06 response requires a valid Stage 05 handoff;
- outflow requires material at the outlet and an open route.

Inside the sterilizer, press, and pipes the traced batch may become temporarily obscured by containment, but it must enter before a downstream output appears.

---

## 12. Orchestration Milestones

Work through these milestones autonomously.

### Milestone A — Authority Compliance

Correct known conceptual violations and any equivalent violations found during inspection.

Acceptance:

- no invented mechanism;
- no animated Stage 06 top fitting;
- static diagrammatic outflow arrow;
- press screw physically anchored;
- debug/HUD layer clearly separate;
- no frozen geometry drift.

Commit only after independent Sol verification.

Suggested commit intent:

`fix(scene03): align animation with physical authority`

---

### Milestone B — Causal Motion Quality

Review the full sequence as a moving process rather than six independent demos.

Improve:

- material handoffs;
- occlusion/reappearance;
- state continuity;
- branch splits;
- motion start/stop conditions;
- conveyor contact;
- gravity;
- containment;
- flow continuity.

The viewer should not need debug labels to understand where the batch has gone.

Reject any transition that works technically but feels like teleportation or arbitrary state switching.

Suggested commit intent:

`refine(scene03): improve causal material continuity`

---

### Milestone C — Pacing and Motion Taste

Judge the animation as an experienced visual reviewer.

Do not optimize for maximum activity or maximum smoothness.

Review:

- where attention is focused;
- whether too many elements move at once;
- whether important changes have enough visual time;
- whether quiet processes feel intentional rather than dead;
- whether handoffs feel caused;
- whether motion is overly mechanical or repetitive;
- whether stage boundaries feel fragmented;
- whether the complete sequence has narrative rhythm.

Use the relative design guidance as the starting point:

- Intake — moderate
- Sterilization — long / quiet
- Threshing — moderate
- Pressing — moderate
- Clarification — long / quiet
- Storage/outflow — brief

Exact duration is **not frozen**.

The existing total runtime may change if visual judgment supports it.

Tune:

- timings;
- overlaps;
- holds;
- acceleration/deceleration;
- visibility windows;
- transition spacing;
- restrained easing.

Do not chase mathematical smoothness at the expense of causal clarity.

Suggested commit intent:

`polish(scene03): refine animation pacing and emphasis`

---

### Milestone D — Visual Fidelity During Motion

Inspect whether animation damages the quality of the frozen illustration.

Check for:

- clipping;
- temporary misalignment;
- transformed stroke-width artifacts;
- floating material;
- awkward masks;
- overly bright moving elements;
- glow overpowering structure;
- loss of machine silhouette;
- depth-order problems;
- impossible overlaps;
- visual noise during busy transitions.

Retain the accepted hierarchy:

**quiet machinery + more legible active material.**

Do not reopen static geometry merely because an animation implementation is inconvenient.

Repair the animation around the authority whenever reasonably possible.

Only reopen static geometry when a genuinely necessary articulation or material opening is missing. Keep any such change extremely local, evidence-based, and independently reviewed.

Suggested commit intent:

`polish(scene03): preserve fidelity through motion`

---

### Milestone E — Integration

Do not integrate until the isolated prototype is accepted by Sol for both causal correctness and visual maturity.

Then establish the **actual current Chapter II runtime architecture from the repository**.

Do not assume an old file path is still authoritative.

Integrate Scene 03 using the existing portfolio architecture rather than transplanting the geometry-study debug shell.

Carry over:

- accepted SVG;
- causal state logic;
- required masks/classes;
- final motion;
- replay behavior where appropriate;
- reduced-motion behavior.

Do not carry over:

- telemetry header;
- developer timecode;
- checkpoint buttons;
- speed controls;
- geometry-study debugging treatment;
- diagnostic HUD.

Preserve surrounding Chapter II navigation, layout, transitions, and accepted scene architecture.

Suggested commit intent:

`feat(chapter02): integrate mature Scene 03 mill animation`

---

### Milestone F — Integrated Taste Review

Review Scene 03 **inside the portfolio**, not only in isolation.

Judge:

- entry into Scene 03;
- first visual impression;
- scale;
- whitespace;
- hierarchy;
- typography;
- contrast;
- narrative continuity with adjacent scenes;
- whether machinery becomes too small or too dense;
- whether animation competes with surrounding content;
- whether the scene feels like the same portfolio;
- whether replay behavior is elegant;
- whether the scene works without explanatory debug UI.

This is a taste review, not merely a test pass.

If it still feels like a technical prototype inserted into a portfolio, it is **not mature**.

Delegate targeted corrections to Antigravity and repeat the review.

---

## 13. Verification

Use the existing toolchain before inventing another one.

Likely useful:

- Chromium / CDP;
- current rendering scripts;
- screenshot checkpoints;
- Python / Pillow / NumPy for deterministic comparisons;
- OpenDesign where useful;
- existing SVG/CSS/JS workflow.

At minimum verify:

- initial state;
- intake discharge;
- sealed sterilization;
- threshing split;
- press split;
- clarification;
- Stage 05 → 06 handoff;
- final storage/outflow state;
- replay;
- reduced-motion behavior;
- normal desktop portfolio viewport;
- integrated runtime.

Also inspect transition moments, not only stage snapshots.

Static baseline preservation should be checked wherever animation changes touch the frozen SVG.

Do not use a single pixel score as proof of visual quality.

Pixel/diff tests prove preservation; they do not prove maturity.

---

## 14. Worker Failure Handling

If Antigravity stalls, hangs, or reports success without sufficient evidence:

1. terminate the stalled attempt when appropriate;
2. inspect whatever state it left behind;
3. narrow the task;
4. retry with a clearer bounded instruction;
5. verify the repository rather than trusting the worker report.

Do not escalate routine failure to the owner.

If the worker repeatedly struggles with the same implementation, simplify the implementation approach before adding complexity.

A smaller robust solution is preferred over a sophisticated fragile one.

Sol may perform a very small surgical technical correction directly when doing so is clearly safer and cheaper than another worker round, but implementation should normally remain delegated to Antigravity.

---

## 15. Git Discipline

Before every milestone:

- inspect branch;
- inspect `git status`;
- identify unrelated changes;
- preserve them.

Never overwrite unrelated owner work.

After a worker pass:

- inspect `git diff`;
- confirm scope;
- reject accidental changes;
- run verification.

Commit only a milestone Sol has independently accepted.

Prefer focused commits that can be reverted individually.

Do not create commits merely because the worker finished.

At final completion, the working tree should be clean except for explicitly known unrelated owner work.

---

## 16. What Requires Owner Input

Do **not** interrupt the owner for:

- timing values;
- easing;
- masking;
- CSS details;
- minor SVG grouping;
- code organization;
- responsive fixes;
- linting;
- generated screenshots;
- browser quirks;
- worker retries;
- routine Git hygiene;
- small fidelity corrections;
- deciding whether another polish pass is necessary.

Exercise reviewer judgment yourself.

Owner input is reserved for a choice that would materially change:

- accepted visual direction;
- process topology;
- narrative meaning;
- portfolio architecture;
- scope;
- a frozen design decision.

Even then, first determine whether the issue can be resolved conservatively without reopening that decision.

---

## 17. Maturity Gate

Do not surface the scene to the owner merely because it works.

Surface it only when **you believe it is mature enough to be judged as portfolio content**.

Before notifying the owner, you should be able to answer **yes** to all of these.

### Authority

- Does it preserve the accepted visual geometry?
- Does it obey the physical behavior authority?
- Does it obey the animation design authority?
- Are invented mechanisms removed?

### Causality

- Can the traced batch be followed?
- Does every major motion and material transformation have a visible cause?
- Are by-product branches coherent?
- Are handoffs believable?
- Is containment respected?

### Motion taste

- Is there a clear locus of attention?
- Is stillness used deliberately?
- Are machines inactive when they should be?
- Does anything feel like generic looping?
- Does the scene avoid decorative animation?
- Are pacing and overlaps visually convincing?

### Visual maturity

- Does it look like a finished portfolio scene rather than a prototype?
- Does motion preserve the quality of the static illustration?
- Is contrast controlled?
- Is hierarchy clear?
- Does it remain restrained rather than flashy?
- Does it fit the established portfolio language?

### Integration

- Does it work correctly in Chapter II?
- Does it enter and exit cleanly?
- Is developer/debug UI absent from the final composition?
- Does replay behave correctly?
- Is reduced-motion behavior sensible?
- Are there no meaningful runtime errors?

### Repository quality

- Have you reviewed the final diff?
- Have you independently verified the implementation?
- Are unrelated files preserved?
- Is the accepted work committed coherently?
- Is the repository left in a maintainable state?

If several answers are merely “technically yes” but the scene still does not feel finished, continue refining.

The maturity gate is a **taste judgment supported by technical evidence**, not a checklist loophole.

---

## 18. Stop Condition

Stop autonomous implementation when:

**Scene 03 is causally correct, visually mature, integrated into the current Chapter II runtime, independently verified by Sol, and suitable for owner acceptance without requiring the owner to diagnose implementation problems.**

At that point, notify the owner once.

Do not provide a diary of intermediate attempts.

Provide a compact acceptance report containing:

- what is now complete;
- what materially changed from the first prototype;
- verification performed;
- final Git commit(s);
- how to view the result;
- any genuinely minor residual limitation;
- Sol's own taste judgment on whether it is ready to keep.

If you do **not** believe the content is mature, do not ask the owner to judge an intermediate state. Continue supervising Antigravity.

If a true authority-level blocker makes maturity impossible, report that single blocker clearly rather than presenting unfinished work as ready.

---

## Final Operating Principle

The owner should act as **creative owner**, not implementation babysitter.

You are responsible for converting accepted direction into a mature result.

Antigravity is your implementation worker.

Review the work, not the worker's confidence.

Fix routine problems autonomously.

Preserve accepted decisions.

Iterate until the scene is worth showing.
