/* ==========================================================================
   CHAPTER 02: SCENE 05 ADAPTER — UNDERGRADUATE THESIS APPARATUS RIG (STUDY C)
   Frozen baseline authority: 25.0s timeline, 31 discrete beats
   ========================================================================== */
(function initScene05Animation() {
      // Configuration & Timeline Timestamps (seconds)
      const DURATION = 25.0;
      const BEATS = [
        { id: 0, time: 0.0, name: 'RIG AT REST (INACTIVE)', pill: 'STATUS: RIG AT REST' },
        { id: 1, time: 0.4, name: 'BEAT 1 · FEED INTAKE & SIGHT GLASS ACTIVATION', pill: 'BEAT 1: INTAKE ACTIVE' },
        { id: 2, time: 1.2, name: 'BEAT 2 · FEED PUMP ENGAGEMENT & DISCHARGE ADVANCE', pill: 'BEAT 2: PUMP ENGAGED' },
        { id: 3, time: 1.9, name: 'BEAT 3 · HEATER VESSEL FILL & THERMAL ACCUMULATION', pill: 'BEAT 3: HEATING CORE' },
        { id: 4, time: 2.8, name: 'BEAT 4 · TOP OUTLET CONTINUOUS TRACEABLE HANDOFF', pill: 'BEAT 4: TOP OUTLET' },
        { id: 5, time: 3.5, name: 'BEAT 5 · OVERHEAD TRANSFER, GAUGE & SENSOR RESPONSE', pill: 'BEAT 5: OVERHEAD TRANSFER' },
        { id: 6, time: 4.8, name: 'BEAT 6 · THROTTLING VALVE APPROACH & PRIMED HOLD', pill: 'BEAT 6: THROTTLING PRIMED' },
        { id: 7, time: 5.5, name: 'BEAT 7 · THROTTLING RESTRICTION CROSSING & INCIPIENT FLASHING', pill: 'BEAT 7: INCIPIENT FLASHING' },
        { id: 8, time: 6.4, name: 'BEAT 8 · FLASH VESSEL INLET ONSET', pill: 'BEAT 8: FLASH ONSET ACTIVE' },
        { id: 9, time: 7.6, name: 'BEAT 9 · INLET PLUME MOMENTUM DECAY', pill: 'BEAT 9: MOMENTUM DECAY' },
        { id: 10, time: 8.4, name: 'BEAT 10 · PHASE DISENGAGEMENT (VAPOR / LIQUID)', pill: 'BEAT 10: DISENGAGEMENT' },
        { id: 11, time: 9.2, name: 'BEAT 11 · BUOYANT VAPOR RISE & LIQUID GRAVITY SETTLING', pill: 'BEAT 11: PHASE SEPARATION' },
        { id: 12, time: 9.8, name: 'BEAT 12 · RESIDUAL LIQUID DRAINAGE TO BRINE BASIN [9]', pill: 'BEAT 12: BRINE DRAINAGE' },
        { id: 13, time: 10.4, name: 'BEAT 13 · VAPOR OUTLET READINESS & SEPARATION HOLD', pill: 'BEAT 13: READINESS HOLD' },
        { id: 14, time: 10.8, name: 'BEAT 14 · VAPOR ACCUMULATION AT OUTLET', pill: 'BEAT 14: OUTLET READY' },
        { id: 15, time: 11.2, name: 'BEAT 15 · VERTICAL ROUTED SEGMENT & ELBOW 1', pill: 'BEAT 15: VERTICAL RISE' },
        { id: 16, time: 11.8, name: 'BEAT 16 · PRESSURE-DRIVEN OVERHEAD PIPE FLOW', pill: 'BEAT 16: OVERHEAD FLOW' },
        { id: 17, time: 12.5, name: 'BEAT 17 · DOWNPIPE ROUTING DROP & INLET APPROACH', pill: 'BEAT 17: INLET APPROACH' },
        { id: 18, time: 13.0, name: 'BEAT 18 · CONDENSER INLET ARRIVAL & READY HOLD', pill: 'BEAT 18: INLET READY' },
        { id: 19, time: 13.5, name: 'BEAT 19 · CONDENSER COOLING ACTIVATION & FAN STARTUP', pill: 'BEAT 19: COOLING ACTIVE' },
        { id: 20, time: 14.0, name: 'BEAT 20 · VAPOR ENTERS ILLUSTRATIVE COOLING PATH', pill: 'BEAT 20: PATH ENTRY' },
        { id: 21, time: 15.2, name: 'BEAT 21 · PROGRESSIVE CONDENSATION & TRANSITION', pill: 'BEAT 21: CONDENSATION' },
        { id: 22, time: 16.5, name: 'BEAT 22 · LIQUID DISTILLATE EMERGENCE', pill: 'BEAT 22: LIQUID DISTILLATE' },
        { id: 23, time: 17.5, name: 'BEAT 23 · CONDENSER OUTLET ARRIVAL & READY HOLD', pill: 'BEAT 23: OUTLET READY' },
        { id: 24, time: 18.0, name: 'BEAT 24 · CONDENSATE EXTRACTION READINESS', pill: 'BEAT 24: EXTRACTION READY' },
        { id: 25, time: 18.4, name: 'BEAT 25 · EXTRACTION PUMP BECOMES OPERATIONAL', pill: 'BEAT 25: PUMP ACTIVE' },
        { id: 26, time: 18.8, name: 'BEAT 26 · CONDENSATE ENTERS EXTRACTION LINE', pill: 'BEAT 26: EXTRACTION LINE' },
        { id: 27, time: 19.3, name: 'BEAT 27 · CONTINUOUS TRANSPORT THROUGH PUMP [11]', pill: 'BEAT 27: PUMP TRANSPORT' },
        { id: 28, time: 19.8, name: 'BEAT 28 · DOWNSTREAM COLLECTION-LINE TRAVEL', pill: 'BEAT 28: DOWNPIPE' },
        { id: 29, time: 20.3, name: 'BEAT 29 · LIQUID REACHES BOTTLE [12] INLET & STOPS', pill: 'BEAT 29: INLET READY' },
        { id: 30, time: 20.8, name: 'BEAT 30 · DISTILLATE ENTRY & INFLOW ACCUMULATION', pill: 'BEAT 30: BOTTLE FILL' },
        { id: 31, time: 23.4, name: 'BEAT 31 · STABLE OPERATIONAL DISTILLATE YIELD', pill: 'BEAT 31: COLLECTED YIELD' }
      ];

      // DOM Elements
      const stageSvg = document.getElementById('study-c-svg');

      // Reviewer UI Elements (Isolated behind explicit harness detection)
      const hasHarness = !!(document.getElementById('timeline-scrubber') || document.getElementById('btn-play-pause') || document.getElementById('study-c-status-pill') || document.querySelector('.beat-btn'));
      let btnPlayPause = null, playText = null, btnRestart = null, scrubber = null;
      let timecodeDisplay = null, beatLabelDisplay = null, statusPill = null, beatBtns = null;

      if (hasHarness) {
        btnPlayPause = document.getElementById('btn-play-pause');
        playText = document.getElementById('play-text');
        btnRestart = document.getElementById('btn-restart');
        scrubber = document.getElementById('timeline-scrubber');
        timecodeDisplay = document.getElementById('timecode-display');
        beatLabelDisplay = document.getElementById('beat-label-display');
        statusPill = document.getElementById('study-c-status-pill');
        beatBtns = document.querySelectorAll('.beat-btn');
      }

      // SVG Animated Elements
      const flowMeterFluid = document.getElementById('flow-meter-fluid');
      const flowBob = document.getElementById('flow-bob');
      const suctionGlow = document.getElementById('fluid-suction-glow');
      const suctionCore = document.getElementById('fluid-suction-core');
      const pumpHalo = document.getElementById('pump-active-halo');
      const pumpImpellerGroup = document.getElementById('pump-impeller-group');
      const dischargeGlow = document.getElementById('fluid-discharge-glow');
      const dischargeCore = document.getElementById('fluid-discharge-core');
      const heaterFluidFill = document.getElementById('heater-fluid-fill');
      const heaterFluidMeniscus = document.getElementById('heater-fluid-meniscus');
      const heaterThermalCore = document.getElementById('heater-thermal-core');
      const heaterThermalCross = document.getElementById('heater-thermal-cross');
      const overheadGlow = document.getElementById('fluid-overhead-glow');
      const overheadCore = document.getElementById('fluid-overhead-core');
      const overheadInner = document.getElementById('fluid-overhead-inner');
      const gaugeNeedleGroup = document.getElementById('gauge-needle-group');
      const tempSensorDot = document.getElementById('temp-sensor-dot');
      const tempSensorHalo = document.getElementById('temp-sensor-halo');
      const tempSensorStem = document.getElementById('temp-sensor-stem');
      const valveInletFluid = document.getElementById('valve-inlet-fluid');
      const valveOutletFluid = document.getElementById('valve-outlet-fluid');
      const valveRestrictionNode = document.getElementById('valve-restriction-node');
      const valveRestrictionHalo = document.getElementById('valve-restriction-halo');
      const valveHandwheel = document.getElementById('valve-handwheel');
      const valveHandwheelNotch = document.getElementById('valve-handwheel-notch');
      const valveHandwheelAssembly = document.getElementById('valve-handwheel-assembly');
      const fluidSpoolGlow = document.getElementById('fluid-spool-glow');
      const fluidSpoolCore = document.getElementById('fluid-spool-core');
      const fluidSpoolVoids = document.getElementById('fluid-spool-voids');
      const flashPhaseRegion = document.getElementById('flash-phase-region');
      const plumeClipRect = document.getElementById('plume-clip-rect');
      const flashInletPlume = document.getElementById('flash-inlet-plume');

      // Dynamic Phase Separation Elements (Beats 9 to 13)
      const flashPlumeDecay = document.getElementById('flash-plume-decay');
      const flashVaporGroup = document.getElementById('flash-vapor-group');
      const vaporCloudBody = document.getElementById('vapor-cloud-body');
      const vaporStreamline1 = document.getElementById('vapor-streamline-1');
      const vaporStreamline2 = document.getElementById('vapor-streamline-2');
      const vaporStreamlineCenter = document.getElementById('vapor-streamline-center');
      const vaporOutletThreshold = document.getElementById('vapor-outlet-threshold');
      const flashLiquidGroup = document.getElementById('flash-liquid-group');
      const liquidStreamLeft = document.getElementById('liquid-stream-left');
      const liquidStreamRight = document.getElementById('liquid-stream-right');
      const liquidStreamCenter = document.getElementById('liquid-stream-center');
      const funnelLiquidPool = document.getElementById('funnel-liquid-pool');
      const funnelLiquidMeniscus = document.getElementById('funnel-liquid-meniscus');
      const brineDrainJetGroup = document.getElementById('brine-drain-jet-group');
      const brineDrainGlow = document.getElementById('brine-drain-glow');
      const brineDrainCore = document.getElementById('brine-drain-core');
      const brineBasinPoolGroup = document.getElementById('brine-basin-pool-group');
      const brineBasinPool = document.getElementById('brine-basin-pool');
      const brineBasinMeniscus = document.getElementById('brine-basin-meniscus');
      const brineImpactRipple = document.getElementById('brine-impact-ripple');

      // Dynamic Vapor Transport Elements (Section 05.1B-3A, Beats 14 to 18)
      const vaporOverheadGroup = document.getElementById('vapor-overhead-group');
      const vaporOverheadGlow = document.getElementById('vapor-overhead-glow');
      const vaporOverheadCore = document.getElementById('vapor-overhead-core');
      const vaporOverheadStream = document.getElementById('vapor-overhead-stream');
      const vaporCondenserInletWisp = document.getElementById('vapor-condenser-inlet-wisp');

      // Dynamic Condenser Phase Transformation Elements (Section 05.1B-3B, Beats 19 to 23)
      const condenserCoolingTint = document.getElementById('condenser-cooling-tint');
      const condenserFanBlades = document.getElementById('condenser-fan-blades');
      const fanFlowRing = document.getElementById('fan-flow-ring');
      const condenserFluidGroup = document.getElementById('condenser-fluid-group');
      const condenserVaporGlow = document.getElementById('condenser-vapor-glow');
      const condenserTransCore = document.getElementById('condenser-transitional-core');
      const condenserLiquidStream = document.getElementById('condenser-liquid-stream');
      const condenserLiquidHighlight = document.getElementById('condenser-liquid-highlight');
      const condenserFluidDashes = document.getElementById('condenser-fluid-dashes');
      const condenserOutletMeniscus = document.getElementById('condenser-outlet-meniscus');

      // Dynamic Extraction & Collection Elements (Section 05.1B-3C-1, Beats 24 to 29)
      const pumpExtractionCasing = document.getElementById('pump-extraction-casing');
      const pumpExtractionIndicator = document.getElementById('pump-extraction-indicator');
      const extractionFluidGroup = document.getElementById('extraction-fluid-group');
      const extractionLiquidStream = document.getElementById('extraction-liquid-stream');
      const extractionLiquidHighlight = document.getElementById('extraction-liquid-highlight');
      const extractionLiquidDashes = document.getElementById('extraction-liquid-dashes');
      const bottleInletMeniscus = document.getElementById('bottle-inlet-meniscus');
      const bottleStaticFill = document.getElementById('bottle-static-fill');

      // Dynamic Bottle Collection Elements (Section 05.1B-3C-2, Beats 30 & 31)
      const bottleCollectionGroup = document.getElementById('bottle-collection-group');
      const bottleInflowStream = document.getElementById('bottle-inflow-stream');
      const bottleInflowHighlight = document.getElementById('bottle-inflow-highlight');
      const bottleLiquidPool = document.getElementById('bottle-liquid-pool');
      const bottlePoolMeniscusLine = document.getElementById('bottle-pool-meniscus-line');
      const bottlePoolMeniscusHighlight = document.getElementById('bottle-pool-meniscus-highlight');
      const handoffCue = document.getElementById('scene-05-handoff-cue');

      // Compute exact geometric path lengths
      const suctionLen = suctionCore.getTotalLength();
      const dischargeLen = dischargeCore.getTotalLength();
      const overheadLen = overheadCore.getTotalLength();
      const spoolLen = fluidSpoolCore.getTotalLength();
      const vaporStream1Len = vaporStreamline1.getTotalLength();
      const vaporStream2Len = vaporStreamline2.getTotalLength();
      const vaporStreamCenterLen = vaporStreamlineCenter.getTotalLength();
      const liquidStreamLeftLen = liquidStreamLeft.getTotalLength();
      const liquidStreamRightLen = liquidStreamRight.getTotalLength();
      const liquidStreamCenterLen = liquidStreamCenter.getTotalLength();
      const brineDrainLen = brineDrainCore.getTotalLength();
      const vaporOverheadLen = vaporOverheadCore.getTotalLength();
      const condenserPathLen = condenserLiquidStream.getTotalLength();
      const extractionPathLen = extractionLiquidStream.getTotalLength();

      // Initialize path dasharrays
      suctionGlow.style.strokeDasharray = `${suctionLen} ${suctionLen}`;
      suctionCore.style.strokeDasharray = `${suctionLen} ${suctionLen}`;
      dischargeGlow.style.strokeDasharray = `${dischargeLen} ${dischargeLen}`;
      dischargeCore.style.strokeDasharray = `${dischargeLen} ${dischargeLen}`;
      overheadGlow.style.strokeDasharray = `${overheadLen} ${overheadLen}`;
      overheadCore.style.strokeDasharray = `${overheadLen} ${overheadLen}`;
      overheadInner.style.strokeDasharray = `${overheadLen} ${overheadLen}`;
      fluidSpoolGlow.style.strokeDasharray = `${spoolLen} ${spoolLen}`;
      fluidSpoolCore.style.strokeDasharray = `${spoolLen} ${spoolLen}`;
      fluidSpoolVoids.style.strokeDasharray = `${spoolLen} ${spoolLen}`;
      vaporStreamline1.style.strokeDasharray = `${vaporStream1Len} ${vaporStream1Len}`;
      vaporStreamline2.style.strokeDasharray = `${vaporStream2Len} ${vaporStream2Len}`;
      vaporStreamlineCenter.style.strokeDasharray = `${vaporStreamCenterLen} ${vaporStreamCenterLen}`;
      liquidStreamLeft.style.strokeDasharray = `${liquidStreamLeftLen} ${liquidStreamLeftLen}`;
      liquidStreamRight.style.strokeDasharray = `${liquidStreamRightLen} ${liquidStreamRightLen}`;
      liquidStreamCenter.style.strokeDasharray = `${liquidStreamCenterLen} ${liquidStreamCenterLen}`;
      brineDrainGlow.style.strokeDasharray = `${brineDrainLen} ${brineDrainLen}`;
      brineDrainCore.style.strokeDasharray = `${brineDrainLen} ${brineDrainLen}`;
      vaporOverheadGlow.style.strokeDasharray = `${vaporOverheadLen} ${vaporOverheadLen}`;
      vaporOverheadCore.style.strokeDasharray = `${vaporOverheadLen} ${vaporOverheadLen}`;
      vaporOverheadStream.style.strokeDasharray = `${vaporOverheadLen} ${vaporOverheadLen}`;
      condenserVaporGlow.style.strokeDasharray = `${condenserPathLen} ${condenserPathLen}`;
      condenserTransCore.style.strokeDasharray = `${condenserPathLen} ${condenserPathLen}`;
      condenserLiquidStream.style.strokeDasharray = `${condenserPathLen} ${condenserPathLen}`;
      condenserLiquidHighlight.style.strokeDasharray = `${condenserPathLen} ${condenserPathLen}`;
      condenserFluidDashes.style.strokeDasharray = `${condenserPathLen} ${condenserPathLen}`;
      extractionLiquidStream.style.strokeDasharray = `${extractionPathLen} ${extractionPathLen}`;
      extractionLiquidHighlight.style.strokeDasharray = `${extractionPathLen} ${extractionPathLen}`;
      extractionLiquidDashes.style.strokeDasharray = `${extractionPathLen} ${extractionPathLen}`;

      // Animation State
      let currentTime = 0;
      let isPlaying = false;
      let lastRafTime = null;
      let rafId = null;

      // Mathematical Utilities
      function clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
      }
      function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      }
      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }
      function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      }

      // Impeller angle analytical integral (smooth acceleration t=1.2..1.6s, steady, smooth deceleration t=23.4..24.0s)
      function getImpellerAngle(t) {
        if (t <= 1.2) return 0;
        const steadySpeed = 720; // degrees per second
        const accelDuration = 0.4;
        const deccStart = 23.4;
        const deccDuration = 0.6;

        if (t < 1.2 + accelDuration) {
          const tau = (t - 1.2) / accelDuration;
          return steadySpeed * accelDuration * (tau / 2 - Math.sin(Math.PI * tau) / (2 * Math.PI));
        }

        const angleAtSteady = steadySpeed * accelDuration * 0.5;

        if (t < deccStart) {
          return angleAtSteady + steadySpeed * (t - (1.2 + accelDuration));
        }

        const angleAtDecc = angleAtSteady + steadySpeed * (deccStart - (1.2 + accelDuration));

        if (t < deccStart + deccDuration) {
          const tau = (t - deccStart) / deccDuration;
          return angleAtDecc + steadySpeed * deccDuration * (tau / 2 + Math.sin(Math.PI * tau) / (2 * Math.PI));
        }

        const finalAngle = angleAtDecc + steadySpeed * deccDuration * 0.5;
        return finalAngle;
      }

      // Condenser cooling fan angle analytical integral (smooth acceleration t=13.5..14.1s, steady, smooth deceleration t=23.4..24.0s)
      function getCondenserFanAngle(t) {
        if (t <= 13.5) return 0;
        const steadySpeed = 360; // degrees per second
        const accelDuration = 0.6;
        const deccStart = 23.4;
        const deccDuration = 0.6;

        if (t < 13.5 + accelDuration) {
          const tau = (t - 13.5) / accelDuration;
          return steadySpeed * accelDuration * (tau / 2 - Math.sin(Math.PI * tau) / (2 * Math.PI));
        }

        const angleAtSteady = steadySpeed * accelDuration * 0.5;

        if (t < deccStart) {
          return angleAtSteady + steadySpeed * (t - (13.5 + accelDuration));
        }

        const angleAtDecc = angleAtSteady + steadySpeed * (deccStart - (13.5 + accelDuration));

        if (t < deccStart + deccDuration) {
          const tau = (t - deccStart) / deccDuration;
          return angleAtDecc + steadySpeed * deccDuration * (tau / 2 + Math.sin(Math.PI * tau) / (2 * Math.PI));
        }

        const finalAngle = angleAtDecc + steadySpeed * deccDuration * 0.5;
        return finalAngle;
      }


      // Render Frame at Time t
      function render(t) {
        currentTime = clamp(t, 0, DURATION);
        const frozenTime = Math.min(currentTime, 23.4);

        // Pre-reset extraction & bottle elements if scrubbed before activation
        if (currentTime < 18.0) {
          pumpExtractionCasing.setAttribute('stroke', 'var(--line-steel)');
          pumpExtractionIndicator.setAttribute('fill', 'rgba(148, 163, 184, 0.25)');
          extractionFluidGroup.style.opacity = '0';
          extractionLiquidStream.style.strokeDashoffset = String(extractionPathLen);
          extractionLiquidHighlight.style.strokeDashoffset = String(extractionPathLen);
          extractionLiquidDashes.style.strokeDashoffset = String(extractionPathLen);
          bottleInletMeniscus.style.opacity = '0';
          bottleInflowStream.style.opacity = '0';
          bottleInflowHighlight.style.opacity = '0';
          bottleLiquidPool.setAttribute('height', '0');
          bottlePoolMeniscusLine.style.opacity = '0';
          bottlePoolMeniscusHighlight.style.opacity = '0';
          bottleStaticFill.style.opacity = '0';
        }

        // Handoff cue visibility
        if (handoffCue) {
          if (currentTime < 24.3) {
            handoffCue.setAttribute('opacity', '0');
            handoffCue.style.opacity = '0';
          } else {
            const pCue = clamp((currentTime - 24.3) / 0.7, 0, 1);
            const eCue = easeInOutQuad(pCue);
            const cueVal = String((0.85 * eCue).toFixed(3));
            handoffCue.setAttribute('opacity', cueVal);
            handoffCue.style.opacity = cueVal;
          }
        }

        // -------------------------------------------------------------
        // BEAT 1: Feed Intake & Sight Glass Activation (t = 0.4 .. 1.2s)
        // -------------------------------------------------------------
        if (currentTime < 0.4) {
          // Cold rig at rest
          flowMeterFluid.setAttribute('height', 0);
          flowMeterFluid.setAttribute('y', 424);
          flowBob.setAttribute('cy', 415);
          suctionGlow.style.strokeDashoffset = suctionLen;
          suctionCore.style.strokeDashoffset = suctionLen;
          suctionGlow.style.opacity = '0';
          suctionCore.style.opacity = '0';
        } else if (currentTime <= 1.2) {
          const p1 = clamp((currentTime - 0.4) / 0.8, 0, 1);
          const e1 = easeInOutQuad(p1);

          // Flow meter sight glass fluid rise
          const bobRise = e1 * 10;
          flowMeterFluid.setAttribute('height', e1 * 32);
          flowMeterFluid.setAttribute('y', 424 - (e1 * 32));
          flowBob.setAttribute('cy', 415 - bobRise);

          // Suction pipe progression to pump suction flange (180, 448)
          const offset1 = suctionLen * (1 - e1);
          suctionGlow.style.strokeDashoffset = offset1;
          suctionCore.style.strokeDashoffset = offset1;
          suctionGlow.style.opacity = '0.8';
          suctionCore.style.opacity = '1';
        } else {
          // Fully primed suction line
          flowMeterFluid.setAttribute('height', 32);
          flowMeterFluid.setAttribute('y', 392);
          flowBob.setAttribute('cy', 405);
          suctionGlow.style.strokeDashoffset = '0';
          suctionCore.style.strokeDashoffset = '0';
          suctionGlow.style.opacity = '0.8';
          suctionCore.style.opacity = '1';
        }

        // -------------------------------------------------------------
        // BEAT 2: Pump Engagement & Discharge Advance (t = 1.2 .. 1.9s)
        // -------------------------------------------------------------
        const impellerAngle = getImpellerAngle(currentTime);
        pumpImpellerGroup.setAttribute('transform', `rotate(${impellerAngle % 360} 205 440)`);

        if (currentTime < 1.2) {
          pumpHalo.style.opacity = '0';
          dischargeGlow.style.strokeDashoffset = dischargeLen;
          dischargeCore.style.strokeDashoffset = dischargeLen;
          dischargeGlow.style.opacity = '0';
          dischargeCore.style.opacity = '0';
        } else if (currentTime <= 1.5) {
          // Motor starting up, fluid waiting for operational head
          const startupP = (currentTime - 1.2) / 0.3;
          pumpHalo.style.opacity = String(0.45 * startupP);
          dischargeGlow.style.strokeDashoffset = dischargeLen;
          dischargeCore.style.strokeDashoffset = dischargeLen;
          dischargeGlow.style.opacity = '0';
          dischargeCore.style.opacity = '0';
        } else if (currentTime <= 1.9) {
          // Fluid advancing through discharge pipe to vessel bottom flange (230, 345)
          pumpHalo.style.opacity = '0.55';
          const p2 = clamp((currentTime - 1.5) / 0.4, 0, 1);
          const e2 = easeOutCubic(p2);
          const offset2 = dischargeLen * (1 - e2);
          dischargeGlow.style.strokeDashoffset = offset2;
          dischargeCore.style.strokeDashoffset = offset2;
          dischargeGlow.style.opacity = '0.8';
          dischargeCore.style.opacity = '1';
        } else {
          pumpHalo.style.opacity = '0.55';
          dischargeGlow.style.strokeDashoffset = '0';
          dischargeCore.style.strokeDashoffset = '0';
          dischargeGlow.style.opacity = '0.8';
          dischargeCore.style.opacity = '1';
        }

        // -------------------------------------------------------------
        // BEAT 3: Heater Vessel Fill & Thermal Accumulation (t = 1.9 .. 2.8s)
        // -------------------------------------------------------------
        if (currentTime < 1.9) {
          heaterFluidFill.setAttribute('height', 0);
          heaterFluidFill.setAttribute('y', 344);
          heaterFluidMeniscus.style.opacity = '0';
          heaterThermalCore.setAttribute('fill', 'rgba(245, 158, 11, 0.07)');
          heaterThermalCore.setAttribute('stroke', 'rgba(245, 158, 11, 0.22)');
          heaterThermalCross.setAttribute('stroke', 'rgba(245, 158, 11, 0.3)');
        } else if (currentTime <= 2.8) {
          // Upward fluid fill inside vessel core: reaches top outlet at t=2.8s
          const pFill = clamp((currentTime - 1.9) / 0.9, 0, 1);
          const eFill = easeInOutQuad(pFill);
          const h = 143 * eFill;
          const curY = 344 - h;
          heaterFluidFill.setAttribute('height', h);
          heaterFluidFill.setAttribute('y', curY);
          heaterFluidMeniscus.setAttribute('y1', curY);
          heaterFluidMeniscus.setAttribute('y2', curY);
          heaterFluidMeniscus.style.opacity = (pFill > 0 && pFill < 0.98) ? '0.65' : '0';

          // Thermal zone begins heating as fluid enters heating elements (t >= 2.1s)
          if (currentTime >= 2.1) {
            const pHeat = clamp((currentTime - 2.1) / 0.7, 0, 1);
            const eHeat = easeInOutQuad(pHeat);
            heaterThermalCore.setAttribute('fill', `rgba(245, 158, 11, ${0.07 + 0.22 * eHeat})`);
            heaterThermalCore.setAttribute('stroke', `rgba(245, 158, 11, ${0.22 + 0.48 * eHeat})`);
            heaterThermalCross.setAttribute('stroke', `rgba(245, 158, 11, ${0.30 + 0.55 * eHeat})`);
          } else {
            heaterThermalCore.setAttribute('fill', 'rgba(245, 158, 11, 0.07)');
            heaterThermalCore.setAttribute('stroke', 'rgba(245, 158, 11, 0.22)');
            heaterThermalCross.setAttribute('stroke', 'rgba(245, 158, 11, 0.3)');
          }
        } else {
          // Vessel full, thermal accumulation establishes steady hot operating condition
          heaterFluidFill.setAttribute('height', 143);
          heaterFluidFill.setAttribute('y', 201);
          heaterFluidMeniscus.style.opacity = '0';
          heaterThermalCore.setAttribute('fill', 'rgba(245, 158, 11, 0.29)');
          heaterThermalCore.setAttribute('stroke', 'rgba(245, 158, 11, 0.70)');
          heaterThermalCross.setAttribute('stroke', 'rgba(245, 158, 11, 0.85)');
        }

        // -------------------------------------------------------------
        // BEATS 4, 5, 6: Continuous Overhead Transfer Line & Throttling Approach (t = 2.8 .. 5.5s)
        // -------------------------------------------------------------
        if (currentTime < 2.8) {
          // Zero fluid in overhead piping
          overheadGlow.style.strokeDashoffset = overheadLen;
          overheadCore.style.strokeDashoffset = overheadLen;
          overheadInner.style.strokeDashoffset = overheadLen;
          overheadGlow.style.opacity = '0';
          overheadCore.style.opacity = '0';
          overheadInner.style.opacity = '0';

          // Instruments at rest
          gaugeNeedleGroup.setAttribute('transform', 'rotate(-50 410 92)');
          tempSensorDot.setAttribute('fill', 'var(--cyan-tech)');
          tempSensorHalo.style.opacity = '0';
          tempSensorStem.setAttribute('stroke', 'var(--line-steel)');

          // Valve clear
          valveInletFluid.setAttribute('fill', 'rgba(245, 158, 11, 0)');
          valveHandwheelNotch.setAttribute('stroke', 'rgba(255, 255, 255, 0.4)');
        } else {
          // Fluid advances continuously along overhead line from top outlet
          let overheadFraction = 0;
          if (currentTime <= 3.5) {
            // Beat 4: Top outlet handoff (243, 200) to apex (258, 130), ~78.6px
            const p4 = clamp((currentTime - 2.8) / 0.7, 0, 1);
            overheadFraction = (78.6 / overheadLen) * easeInOutQuad(p4);
          } else if (currentTime <= 4.8) {
            // Beat 5: Overhead transfer along horizontal pipe and down vertical drop
            const p5 = clamp((currentTime - 3.5) / 1.3, 0, 1);
            const apexFrac = 78.6 / overheadLen;
            const preValveFrac = (overheadLen - 24) / overheadLen;
            overheadFraction = apexFrac + (preValveFrac - apexFrac) * easeInOutQuad(p5);
          } else if (currentTime <= 5.5) {
            // Beat 6: Approach into throttling valve and reach restriction node
            const p6 = clamp((currentTime - 4.8) / 0.7, 0, 1);
            const preValveFrac = (overheadLen - 24) / overheadLen;
            overheadFraction = preValveFrac + (1 - preValveFrac) * easeOutCubic(p6);
          } else {
            overheadFraction = 1.0;
          }

          const offsetOH = overheadLen * (1 - overheadFraction);
          overheadGlow.style.strokeDashoffset = offsetOH;
          overheadCore.style.strokeDashoffset = offsetOH;
          overheadInner.style.strokeDashoffset = offsetOH;
          overheadGlow.style.opacity = '0.85';
          overheadCore.style.opacity = '1';
          overheadInner.style.opacity = '0.9';

          // Bourdon Gauge Response (fluid passes X=410 at t approx 3.8s)
          if (currentTime < 3.8) {
            gaugeNeedleGroup.setAttribute('transform', 'rotate(-50 410 92)');
          } else {
            const pGauge = clamp((currentTime - 3.8) / 0.8, 0, 1);
            const eGauge = easeOutCubic(pGauge);
            const curAngle = -50 + (38 * eGauge); // -50 deg to -12 deg (~2 o'clock)
            gaugeNeedleGroup.setAttribute('transform', `rotate(${curAngle} 410 92)`);
          }

          // Temperature Sensor Port Response (fluid passes X=450 at t approx 4.1s)
          if (currentTime < 4.1) {
            tempSensorDot.setAttribute('fill', 'var(--cyan-tech)');
            tempSensorHalo.style.opacity = '0';
            tempSensorStem.setAttribute('stroke', 'var(--line-steel)');
          } else {
            const pTemp = clamp((currentTime - 4.1) / 0.5, 0, 1);
            const eTemp = easeInOutQuad(pTemp);
            tempSensorDot.setAttribute('fill', eTemp > 0.6 ? 'var(--amber-warm)' : '#60a5fa');
            tempSensorHalo.style.opacity = String(0.75 * eTemp);
            tempSensorStem.setAttribute('stroke', `rgba(245, 158, 11, ${0.2 + 0.6 * eTemp})`);
          }

          // Throttling Valve Inlet Cavity & Upstream Compression
          if (currentTime < 4.8) {
            valveInletFluid.setAttribute('fill', 'rgba(245, 158, 11, 0)');
            valveHandwheelNotch.setAttribute('stroke', 'rgba(255, 255, 255, 0.4)');
            overheadGlow.setAttribute('stroke-width', '6');
          } else if (currentTime < 5.5) {
            const pValve = clamp((currentTime - 4.8) / 0.4, 0, 1);
            const eValve = easeOutCubic(pValve);
            valveInletFluid.setAttribute('fill', `rgba(245, 158, 11, ${0.85 * eValve})`);

            // Subtle hydraulic upstream compression as fluid approaches restriction node
            if (currentTime >= 5.1) {
              const pComp = clamp((currentTime - 5.1) / 0.4, 0, 1);
              const eComp = easeOutCubic(pComp);
              overheadGlow.setAttribute('stroke-width', String(6 + 1.2 * eComp));
              valveHandwheelNotch.setAttribute('stroke', `rgba(255, 255, 255, ${0.4 + 0.5 * eComp})`);
            } else {
              overheadGlow.setAttribute('stroke-width', '6');
              valveHandwheelNotch.setAttribute('stroke', 'rgba(255, 255, 255, 0.4)');
            }
          } else {
            // Flow has crossed restriction: upstream line at steady flowing head
            valveInletFluid.setAttribute('fill', 'rgba(245, 158, 11, 0.85)');
            overheadGlow.setAttribute('stroke-width', '6');
            valveHandwheelNotch.setAttribute('stroke', 'rgba(255, 255, 255, 0.8)');
          }
        }

        // -------------------------------------------------------------
        // BEATS 7 & 8: Throttling Crossing, Incipient Spool & Flash Onset (t = 5.5 .. 7.6s)
        // -------------------------------------------------------------
        if (currentTime < 5.5) {
          valveOutletFluid.setAttribute('fill', 'rgba(245, 158, 11, 0)');
          valveRestrictionHalo.style.opacity = '0';
          valveHandwheelAssembly.removeAttribute('transform');
          valveHandwheelNotch.removeAttribute('transform');
          fluidSpoolGlow.style.strokeDashoffset = spoolLen;
          fluidSpoolCore.style.strokeDashoffset = spoolLen;
          fluidSpoolVoids.style.strokeDashoffset = spoolLen;
          fluidSpoolGlow.style.opacity = '0';
          fluidSpoolCore.style.opacity = '0';
          fluidSpoolVoids.style.opacity = '0';
          plumeClipRect.setAttribute('width', '0');
          flashInletPlume.style.opacity = '0';
          flashPhaseRegion.setAttribute('stroke', 'rgba(255, 255, 255, 0.18)');
          flashPhaseRegion.setAttribute('fill', 'rgba(255, 255, 255, 0.03)');
        } else if (currentTime < 5.8) {
          // Beat 7A: Fluid crosses restriction throat into outlet cavity (X = 540 to 552)
          valveHandwheelAssembly.removeAttribute('transform');
          valveHandwheelNotch.removeAttribute('transform');

          // Restriction throat pulse as fluid breaches restriction node
          const pPulse = clamp((currentTime - 5.5) / 0.3, 0, 1);
          const pulseOp = Math.sin(pPulse * Math.PI);
          valveRestrictionHalo.style.opacity = String(0.7 * pulseOp);
          valveRestrictionHalo.setAttribute('r', String(2.2 + 1.6 * pPulse));

          // Fluid fills valve outlet cavity (X = 540 to 552)
          const pCross = clamp((currentTime - 5.5) / 0.3, 0, 1);
          const eCross = easeOutCubic(pCross);
          valveOutletFluid.setAttribute('fill', `rgba(245, 158, 11, ${0.85 * eCross})`);

          // Incipient spool entry: reveals initial 12px (fraction 12 / 80 = 0.15)
          const crossFrac = 0.15 * eCross;
          const offsetSpool = spoolLen * (1 - crossFrac);
          fluidSpoolGlow.style.strokeDashoffset = offsetSpool;
          fluidSpoolCore.style.strokeDashoffset = offsetSpool;
          fluidSpoolVoids.style.strokeDashoffset = offsetSpool;
          fluidSpoolGlow.style.opacity = String(0.45 * eCross);
          fluidSpoolCore.style.opacity = String(0.9 * eCross);
          fluidSpoolVoids.style.opacity = String(0.35 * eCross);

          plumeClipRect.setAttribute('width', '0');
          flashInletPlume.style.opacity = '0';
          flashPhaseRegion.setAttribute('stroke', 'rgba(255, 255, 255, 0.18)');
          flashPhaseRegion.setAttribute('fill', 'rgba(255, 255, 255, 0.03)');
        } else if (currentTime < 6.4) {
          // Beat 7B: Spool traversal (X = 552 to 620) with incipient flashing
          valveHandwheelAssembly.removeAttribute('transform');
          valveHandwheelNotch.removeAttribute('transform');
          valveRestrictionHalo.style.opacity = '0.25';
          valveRestrictionHalo.setAttribute('r', '2.2');
          valveOutletFluid.setAttribute('fill', 'rgba(245, 158, 11, 0.85)');

          const pSpool = clamp((currentTime - 5.8) / 0.6, 0, 1);
          const eSpool = easeInOutQuad(pSpool);
          const spoolFrac = 0.15 + (0.85 * eSpool);
          const offsetSpool = spoolLen * (1 - spoolFrac);

          fluidSpoolGlow.style.strokeDashoffset = offsetSpool;
          fluidSpoolCore.style.strokeDashoffset = offsetSpool;
          fluidSpoolVoids.style.strokeDashoffset = offsetSpool;
          fluidSpoolGlow.style.opacity = '0.45';
          fluidSpoolCore.style.opacity = '0.9';
          fluidSpoolVoids.style.opacity = '0.35';

          plumeClipRect.setAttribute('width', '0');
          flashInletPlume.style.opacity = '0';
          flashPhaseRegion.setAttribute('stroke', 'rgba(255, 255, 255, 0.18)');
          flashPhaseRegion.setAttribute('fill', 'rgba(255, 255, 255, 0.03)');
        } else if (currentTime < 7.6) {
          // Beat 8: Entry into flash vessel phase region & localized plume expansion
          valveHandwheelAssembly.removeAttribute('transform');
          valveHandwheelNotch.removeAttribute('transform');
          valveRestrictionHalo.style.opacity = '0.25';
          valveRestrictionHalo.setAttribute('r', '2.2');
          valveOutletFluid.setAttribute('fill', 'rgba(245, 158, 11, 0.85)');

          fluidSpoolGlow.style.strokeDashoffset = '0';
          fluidSpoolCore.style.strokeDashoffset = '0';
          fluidSpoolVoids.style.strokeDashoffset = '0';
          fluidSpoolGlow.style.opacity = '0.45';
          fluidSpoolCore.style.opacity = '0.9';
          fluidSpoolVoids.style.opacity = '0.35';

          // Plume horizontal expansion strictly inside vessel inlet region (X = 620 to 656, 36px)
          const pPlume = clamp((currentTime - 6.4) / 1.2, 0, 1);
          const ePlume = easeOutCubic(pPlume);
          plumeClipRect.setAttribute('width', String(36 * ePlume));
          flashInletPlume.style.opacity = String(0.3 + 0.7 * ePlume);

          // Flash phase region boundary subtle illumination
          flashPhaseRegion.setAttribute('stroke', `rgba(245, 158, 11, ${0.18 + 0.18 * ePlume})`);
          flashPhaseRegion.setAttribute('fill', `rgba(245, 158, 11, ${0.03 + 0.04 * ePlume})`);
        } else {
          // Flow through restriction is fully established (t >= 7.6s)
          valveHandwheelAssembly.removeAttribute('transform');
          valveHandwheelNotch.removeAttribute('transform');
          valveRestrictionHalo.style.opacity = '0.25';
          valveRestrictionHalo.setAttribute('r', '2.2');
          valveOutletFluid.setAttribute('fill', 'rgba(245, 158, 11, 0.85)');

          fluidSpoolGlow.style.strokeDashoffset = '0';
          fluidSpoolCore.style.strokeDashoffset = '0';
          fluidSpoolVoids.style.strokeDashoffset = '0';
          fluidSpoolGlow.style.opacity = '0.45';
          fluidSpoolCore.style.opacity = '0.9';
          fluidSpoolVoids.style.opacity = '0.35';

          plumeClipRect.setAttribute('width', '36');
          flashInletPlume.style.opacity = '1';
          flashPhaseRegion.setAttribute('stroke', 'rgba(245, 158, 11, 0.36)');
          flashPhaseRegion.setAttribute('fill', 'rgba(245, 158, 11, 0.07)');
        }


        // -------------------------------------------------------------
        // BEATS 9 to 13: Flash Vessel Phase Separation (t = 7.6 .. 10.4s)
        // -------------------------------------------------------------
        if (currentTime < 7.6) {
          flashPlumeDecay.style.opacity = '0';
          flashVaporGroup.style.opacity = '0';
          vaporCloudBody.style.opacity = '0';
          vaporStreamline1.style.strokeDashoffset = vaporStream1Len;
          vaporStreamline2.style.strokeDashoffset = vaporStream2Len;
          vaporStreamlineCenter.style.strokeDashoffset = vaporStreamCenterLen;
          vaporOutletThreshold.style.opacity = '0';

          flashLiquidGroup.style.opacity = '0';
          liquidStreamLeft.style.strokeDashoffset = liquidStreamLeftLen;
          liquidStreamRight.style.strokeDashoffset = liquidStreamRightLen;
          liquidStreamCenter.style.strokeDashoffset = liquidStreamCenterLen;
          funnelLiquidPool.style.opacity = '0';
          funnelLiquidMeniscus.style.opacity = '0';

          brineDrainJetGroup.style.opacity = '0';
          brineDrainGlow.style.strokeDashoffset = brineDrainLen;
          brineDrainCore.style.strokeDashoffset = brineDrainLen;

          brineBasinPoolGroup.style.opacity = '0';
          brineImpactRipple.style.opacity = '0';
        } else if (currentTime < 8.4) {
          // Beat 9: Inlet Plume Momentum Decay (X = 645 to 658)
          const pDecay = clamp((currentTime - 7.6) / 0.8, 0, 1);
          const eDecay = easeOutCubic(pDecay);

          flashPlumeDecay.style.opacity = String(0.75 * eDecay);

          flashVaporGroup.style.opacity = '0';
          vaporCloudBody.style.opacity = '0';
          vaporStreamline1.style.strokeDashoffset = vaporStream1Len;
          vaporStreamline2.style.strokeDashoffset = vaporStream2Len;
          vaporStreamlineCenter.style.strokeDashoffset = vaporStreamCenterLen;
          vaporOutletThreshold.style.opacity = '0';

          flashLiquidGroup.style.opacity = '0';
          liquidStreamLeft.style.strokeDashoffset = liquidStreamLeftLen;
          liquidStreamRight.style.strokeDashoffset = liquidStreamRightLen;
          liquidStreamCenter.style.strokeDashoffset = liquidStreamCenterLen;
          funnelLiquidPool.style.opacity = '0';
          funnelLiquidMeniscus.style.opacity = '0';

          brineDrainJetGroup.style.opacity = '0';
          brineDrainGlow.style.strokeDashoffset = brineDrainLen;
          brineDrainCore.style.strokeDashoffset = brineDrainLen;

          brineBasinPoolGroup.style.opacity = '0';
          brineImpactRipple.style.opacity = '0';
        } else if (currentTime < 9.2) {
          // Beat 10: Phase Disengagement (Divergence emerges visibly from plume)
          flashPlumeDecay.style.opacity = '0.75';

          const pSplit = clamp((currentTime - 8.4) / 0.8, 0, 1);
          const eSplit = easeOutCubic(pSplit);

          // Vapor fraction begins upward drift
          flashVaporGroup.style.opacity = String(eSplit);
          vaporCloudBody.style.opacity = String(0.35 * eSplit);
          const vaporProg10 = 0.35 * eSplit;
          vaporStreamline1.style.strokeDashoffset = String(vaporStream1Len * (1 - vaporProg10));
          vaporStreamline2.style.strokeDashoffset = String(vaporStream2Len * (1 - vaporProg10));
          vaporStreamlineCenter.style.strokeDashoffset = String(vaporStreamCenterLen * (1 - vaporProg10));
          vaporOutletThreshold.style.opacity = '0';

          // Liquid fraction begins downward curve under gravity
          flashLiquidGroup.style.opacity = String(eSplit);
          const liquidProg10 = 0.35 * eSplit;
          liquidStreamLeft.style.strokeDashoffset = String(liquidStreamLeftLen * (1 - liquidProg10));
          liquidStreamRight.style.strokeDashoffset = String(liquidStreamRightLen * (1 - liquidProg10));
          liquidStreamCenter.style.strokeDashoffset = String(liquidStreamCenterLen * (1 - liquidProg10));
          funnelLiquidPool.style.opacity = '0';
          funnelLiquidMeniscus.style.opacity = '0';

          brineDrainJetGroup.style.opacity = '0';
          brineDrainGlow.style.strokeDashoffset = brineDrainLen;
          brineDrainCore.style.strokeDashoffset = brineDrainLen;

          brineBasinPoolGroup.style.opacity = '0';
          brineImpactRipple.style.opacity = '0';
        } else if (currentTime < 9.8) {
          // Beat 11: Buoyant Vapor Rise (to outlet Y=165) & Gravity Liquid Settling (to funnel apex)
          flashPlumeDecay.style.opacity = '0.75';

          const pRise = clamp((currentTime - 9.2) / 0.6, 0, 1);
          const eRise = easeInOutQuad(pRise);

          // Vapor fills upper chamber up to outlet nozzle (Y = 165)
          flashVaporGroup.style.opacity = '1';
          vaporCloudBody.style.opacity = String(0.35 + 0.50 * eRise);
          const vaporProg11 = 0.35 + 0.65 * eRise;
          vaporStreamline1.style.strokeDashoffset = String(vaporStream1Len * (1 - vaporProg11));
          vaporStreamline2.style.strokeDashoffset = String(vaporStream2Len * (1 - vaporProg11));
          vaporStreamlineCenter.style.strokeDashoffset = String(vaporStreamCenterLen * (1 - vaporProg11));
          vaporOutletThreshold.style.opacity = String(0.85 * eRise);

          // Liquid descends through lower cylinder and pools in conical hopper apex (Y=345 to 365)
          flashLiquidGroup.style.opacity = '1';
          const liquidProg11 = 0.35 + 0.65 * eRise;
          liquidStreamLeft.style.strokeDashoffset = String(liquidStreamLeftLen * (1 - liquidProg11));
          liquidStreamRight.style.strokeDashoffset = String(liquidStreamRightLen * (1 - liquidProg11));
          liquidStreamCenter.style.strokeDashoffset = String(liquidStreamCenterLen * (1 - liquidProg11));
          funnelLiquidPool.style.opacity = String(0.85 * eRise);
          funnelLiquidMeniscus.style.opacity = String(0.9 * eRise);

          brineDrainJetGroup.style.opacity = '0';
          brineDrainGlow.style.strokeDashoffset = brineDrainLen;
          brineDrainCore.style.strokeDashoffset = brineDrainLen;

          brineBasinPoolGroup.style.opacity = '0';
          brineImpactRipple.style.opacity = '0';
        } else if (currentTime < 10.4) {
          // Beat 12: Residual Liquid Drainage to Brine Basin [9]
          flashPlumeDecay.style.opacity = '0.75';

          // Vapor remains stable in dome at Y=165
          flashVaporGroup.style.opacity = '1';
          vaporCloudBody.style.opacity = '0.85';
          vaporStreamline1.style.strokeDashoffset = '0';
          vaporStreamline2.style.strokeDashoffset = '0';
          vaporStreamlineCenter.style.strokeDashoffset = '0';
          vaporOutletThreshold.style.opacity = '0.85';

          // Liquid streams fully flowing in vessel
          flashLiquidGroup.style.opacity = '1';
          liquidStreamLeft.style.strokeDashoffset = '0';
          liquidStreamRight.style.strokeDashoffset = '0';
          liquidStreamCenter.style.strokeDashoffset = '0';
          funnelLiquidPool.style.opacity = '0.85';
          funnelLiquidMeniscus.style.opacity = '0.9';

          // Drain jet freefalls from nozzle Y=365 to Basin Y=440
          brineDrainJetGroup.style.opacity = '1';
          const pFall = clamp((currentTime - 9.8) / 0.3, 0, 1);
          const eFall = easeOutCubic(pFall);
          brineDrainGlow.style.strokeDashoffset = String(brineDrainLen * (1 - eFall));
          brineDrainCore.style.strokeDashoffset = String(brineDrainLen * (1 - eFall));

          // Brine accumulation in Catchment Basin [9]
          if (currentTime < 10.0) {
            brineBasinPoolGroup.style.opacity = '0';
            brineImpactRipple.style.opacity = '0';
          } else {
            const pPool = clamp((currentTime - 10.0) / 0.4, 0, 1);
            const ePool = easeInOutQuad(pPool);
            brineBasinPoolGroup.style.opacity = String(ePool);

            // Pool rising from Y=458 up to Y=438 (depth 20px)
            const curY = 458 - (20 * ePool);
            const curTopW = 20 + 7 * ePool;
            brineBasinPool.setAttribute('points', `616,458 674,458 ${645 + curTopW},${curY} ${645 - curTopW},${curY}`);
            brineBasinMeniscus.setAttribute('cy', String(curY));
            brineBasinMeniscus.setAttribute('rx', String(curTopW));

            // Impact ripple active at liquid surface
            brineImpactRipple.setAttribute('cy', String(curY));
            const ripplePhase = (currentTime - 10.0) * 8;
            const rippleR = 4 + 4 * (ripplePhase % 1);
            brineImpactRipple.setAttribute('rx', String(rippleR));
            brineImpactRipple.setAttribute('ry', String(rippleR * 0.25));
            brineImpactRipple.style.opacity = String(0.8 * (1 - (ripplePhase % 1)));
          }
        } else {
          // Beat 13: Vapor ready at outlet nozzle Y=165 & steady phase separation
          flashPlumeDecay.style.opacity = '0.75';
          flashVaporGroup.style.opacity = '1';
          vaporCloudBody.style.opacity = '0.85';
          vaporStreamline1.style.strokeDashoffset = '0';
          vaporStreamline2.style.strokeDashoffset = '0';
          vaporStreamlineCenter.style.strokeDashoffset = '0';
          vaporOutletThreshold.style.opacity = '1';

          flashLiquidGroup.style.opacity = '1';
          liquidStreamLeft.style.strokeDashoffset = '0';
          liquidStreamRight.style.strokeDashoffset = '0';
          liquidStreamCenter.style.strokeDashoffset = '0';
          funnelLiquidPool.style.opacity = '0.85';
          funnelLiquidMeniscus.style.opacity = '0.9';

          brineDrainJetGroup.style.opacity = '1';
          brineDrainGlow.style.strokeDashoffset = '0';
          brineDrainCore.style.strokeDashoffset = '0';

          brineBasinPoolGroup.style.opacity = '1';
          brineBasinPool.setAttribute('points', '616,458 674,458 672,438 618,438');
          brineBasinMeniscus.setAttribute('cy', '438');
          brineBasinMeniscus.setAttribute('rx', '27');
          brineImpactRipple.setAttribute('cy', '438');

          if (currentTime < 23.0) {
            const ripplePhase = (currentTime - 10.4) * 6;
            const rippleR = 4 + 4 * (ripplePhase % 1);
            brineImpactRipple.setAttribute('rx', String(rippleR));
            brineImpactRipple.setAttribute('ry', String(rippleR * 0.25));
            brineImpactRipple.style.opacity = String(0.7 * (1 - (ripplePhase % 1)));
          } else if (currentTime < 23.4) {
            const pDamp = clamp((currentTime - 23.0) / 0.4, 0, 1);
            const ripplePhase = (currentTime - 10.4) * 6;
            const rippleR = 4 + 4 * (ripplePhase % 1);
            brineImpactRipple.setAttribute('rx', String(rippleR));
            brineImpactRipple.setAttribute('ry', String(rippleR * 0.25));
            brineImpactRipple.style.opacity = String(0.7 * (1 - (ripplePhase % 1)) * (1 - pDamp));
          } else {
            brineImpactRipple.style.opacity = '0';
          }
        }

        // -------------------------------------------------------------
        // BEATS 14 to 18: Continuous Vapor Transport to Condenser (t = 10.4 .. 13.5s)
        // -------------------------------------------------------------
        if (currentTime < 10.4) {
          vaporOverheadGroup.style.opacity = '0';
          vaporOverheadGlow.style.strokeDashoffset = String(vaporOverheadLen);
          vaporOverheadCore.style.strokeDashoffset = String(vaporOverheadLen);
          vaporOverheadStream.style.strokeDashoffset = String(vaporOverheadLen);
          vaporCondenserInletWisp.style.opacity = '0';
        } else if (currentTime < 10.8) {
          // Beat 14: Vapor Accumulation at Dome Outlet & Initial Riser Breach
          vaporOverheadGroup.style.opacity = '1';
          const pBreach = clamp((currentTime - 10.4) / 0.4, 0, 1);
          const eBreach = easeInOutQuad(pBreach);
          const prog14 = (12 / vaporOverheadLen) * eBreach;
          vaporOverheadGlow.style.strokeDashoffset = String(vaporOverheadLen * (1 - prog14));
          vaporOverheadCore.style.strokeDashoffset = String(vaporOverheadLen * (1 - prog14));
          vaporOverheadStream.style.strokeDashoffset = String(vaporOverheadLen * (1 - prog14));
          vaporCondenserInletWisp.style.opacity = '0';
        } else if (currentTime < 11.4) {
          // Beat 15: Vertical Routed Segment & Elbow 1
          vaporOverheadGroup.style.opacity = '1';
          const pRise = clamp((currentTime - 10.8) / 0.6, 0, 1);
          const eRise = easeInOutQuad(pRise);
          const prog15 = (12 / vaporOverheadLen) + (0.175 - (12 / vaporOverheadLen)) * eRise;
          vaporOverheadGlow.style.strokeDashoffset = String(vaporOverheadLen * (1 - prog15));
          vaporOverheadCore.style.strokeDashoffset = String(vaporOverheadLen * (1 - prog15));
          vaporOverheadStream.style.strokeDashoffset = String(vaporOverheadLen * (1 - prog15));
          vaporCondenserInletWisp.style.opacity = '0';
        } else if (currentTime < 12.3) {
          // Beat 16: Horizontal Run to Downward Elbow
          vaporOverheadGroup.style.opacity = '1';
          const pRun = clamp((currentTime - 11.4) / 0.9, 0, 1);
          const eRun = easeInOutQuad(pRun);
          const prog16 = 0.175 + (0.616 - 0.175) * eRun;
          vaporOverheadGlow.style.strokeDashoffset = String(vaporOverheadLen * (1 - prog16));
          vaporOverheadCore.style.strokeDashoffset = String(vaporOverheadLen * (1 - prog16));
          vaporOverheadStream.style.strokeDashoffset = String(vaporOverheadLen * (1 - prog16));
          vaporCondenserInletWisp.style.opacity = '0';
        } else if (currentTime < 13.0) {
          // Beat 17: Downpipe Routing Drop & Bottom Elbow
          vaporOverheadGroup.style.opacity = '1';
          const pDrop = clamp((currentTime - 12.3) / 0.7, 0, 1);
          const eDrop = easeInOutQuad(pDrop);
          const prog17 = 0.616 + (0.886 - 0.616) * eDrop;
          vaporOverheadGlow.style.strokeDashoffset = String(vaporOverheadLen * (1 - prog17));
          vaporOverheadCore.style.strokeDashoffset = String(vaporOverheadLen * (1 - prog17));
          vaporOverheadStream.style.strokeDashoffset = String(vaporOverheadLen * (1 - prog17));
          vaporCondenserInletWisp.style.opacity = '0';
        } else if (currentTime < 13.5) {
          // Beat 18: Condenser Inlet Arrival & Ready Hold
          vaporOverheadGroup.style.opacity = '1';
          const pInlet = clamp((currentTime - 13.0) / 0.5, 0, 1);
          const eInlet = easeOutCubic(pInlet);
          const prog18 = 0.886 + (1.0 - 0.886) * eInlet;
          vaporOverheadGlow.style.strokeDashoffset = String(vaporOverheadLen * (1 - prog18));
          vaporOverheadCore.style.strokeDashoffset = String(vaporOverheadLen * (1 - prog18));
          vaporOverheadStream.style.strokeDashoffset = String(vaporOverheadLen * (1 - prog18));
          vaporCondenserInletWisp.style.opacity = String(0.85 * eInlet);
        } else {
          // Upstream overhead line maintains fully charged continuous vapor stream
          vaporOverheadGroup.style.opacity = '1';
          vaporOverheadGlow.style.strokeDashoffset = '0';
          vaporOverheadCore.style.strokeDashoffset = '0';
          vaporOverheadStream.style.strokeDashoffset = '0';
          vaporCondenserInletWisp.style.opacity = '0.85';
        }

        // -------------------------------------------------------------
        // BEATS 19 to 23: Condenser Cooling & Phase Transformation (t = 13.5 .. 18.0s)
        // -------------------------------------------------------------
        const fanAngle = getCondenserFanAngle(currentTime);
        condenserFanBlades.setAttribute('transform', `rotate(${fanAngle % 360} 0 0)`);

        // Directional dash drift stopped after t=23.4s
        const condDashDrift = Math.max(0, (frozenTime - 14.0) * 16);

        if (currentTime < 13.5) {
          condenserCoolingTint.style.opacity = '0';
          fanFlowRing.style.opacity = '0';
          condenserFluidGroup.style.opacity = '0';
          condenserVaporGlow.style.strokeDashoffset = String(condenserPathLen);
          condenserTransCore.style.strokeDashoffset = String(condenserPathLen);
          condenserLiquidStream.style.strokeDashoffset = String(condenserPathLen);
          condenserLiquidHighlight.style.strokeDashoffset = String(condenserPathLen);
          condenserFluidDashes.style.strokeDashoffset = String(condenserPathLen);
          condenserOutletMeniscus.style.opacity = '0';
        } else if (currentTime < 14.0) {
          // Beat 19: Cooling Fan Startup & Flow Ring
          const pFan = clamp((currentTime - 13.5) / 0.5, 0, 1);
          const eFan = easeInOutQuad(pFan);
          condenserCoolingTint.style.opacity = String(0.4 * eFan);
          fanFlowRing.style.opacity = String(0.35 * eFan);

          condenserFluidGroup.style.opacity = '0';
          condenserVaporGlow.style.strokeDashoffset = String(condenserPathLen);
          condenserTransCore.style.strokeDashoffset = String(condenserPathLen);
          condenserLiquidStream.style.strokeDashoffset = String(condenserPathLen);
          condenserLiquidHighlight.style.strokeDashoffset = String(condenserPathLen);
          condenserFluidDashes.style.strokeDashoffset = String(condenserPathLen);
          condenserOutletMeniscus.style.opacity = '0';
        } else {
          // Cooling active
          condenserCoolingTint.style.opacity = '0.4';
          if (currentTime >= 23.4) {
            const pDown = clamp((currentTime - 23.4) / 0.6, 0, 1);
            fanFlowRing.style.opacity = String((0.35 * (1 - pDown)).toFixed(3));
          } else {
            fanFlowRing.style.opacity = '0.35';
          }
          condenserFluidGroup.style.opacity = '1';

          if (currentTime < 15.2) {
            // Beat 20: Vapor Enters Cooling Path (prog 0 to 0.334)
            const p20 = clamp((currentTime - 14.0) / 1.2, 0, 1);
            const e20 = easeInOutQuad(p20);
            const prog20 = 0.334 * e20;
            const curOff20 = condenserPathLen * (1 - prog20);

            // Gaseous vapor styling: warm-white core, amber thermal halo
            condenserVaporGlow.style.strokeDashoffset = String(curOff20);
            condenserVaporGlow.setAttribute('stroke-width', '6.0');
            condenserVaporGlow.setAttribute('stroke', 'rgba(245, 158, 11, 0.28)');

            condenserTransCore.style.strokeDashoffset = String(curOff20);
            condenserTransCore.setAttribute('stroke-width', '3.5');
            condenserTransCore.setAttribute('stroke', 'rgba(254, 243, 199, 0.65)');

            condenserLiquidStream.style.strokeDashoffset = String(condenserPathLen);
            condenserLiquidStream.style.opacity = '0';
            condenserLiquidHighlight.style.strokeDashoffset = String(condenserPathLen);
            condenserLiquidHighlight.style.opacity = '0';

            condenserFluidDashes.style.strokeDashoffset = String(curOff20 - (condDashDrift % 8));
            condenserFluidDashes.setAttribute('stroke', 'rgba(254, 243, 199, 0.65)');
            condenserFluidDashes.style.opacity = '1';
            condenserOutletMeniscus.style.opacity = '0';
          } else if (currentTime < 16.5) {
            // Beat 21: Progressive Condensation & Transition (prog 0.334 to 0.654)
            const p21 = clamp((currentTime - 15.2) / 1.3, 0, 1);
            const e21 = easeInOutQuad(p21);
            const prog21 = 0.334 + (0.654 - 0.334) * e21;
            const curOff21 = condenserPathLen * (1 - prog21);

            // Halo contracts as diffusion drops
            const glowR = Math.round(245 + (241 - 245) * e21);
            const glowG = Math.round(158 + (245 - 158) * e21);
            const glowB = Math.round(11 + (249 - 11) * e21);
            const glowA = (0.28 - 0.12 * e21).toFixed(3);
            condenserVaporGlow.style.strokeDashoffset = String(curOff21);
            condenserVaporGlow.setAttribute('stroke-width', String(6.0 - 2.8 * e21));
            condenserVaporGlow.setAttribute('stroke', `rgba(${glowR}, ${glowG}, ${glowB}, ${glowA})`);

            // Core transitions from soft vapor into denser liquid core
            condenserTransCore.style.strokeDashoffset = String(curOff21);
            condenserTransCore.setAttribute('stroke-width', String(3.5 - 0.7 * e21));
            condenserTransCore.setAttribute('stroke', `rgba(254, 243, 199, ${0.65 + 0.15 * e21})`);

            // Distillate liquid stream begins emerging (#f1f5f9)
            condenserLiquidStream.style.strokeDashoffset = String(curOff21);
            condenserLiquidStream.style.opacity = String(0.85 * e21);
            condenserLiquidStream.setAttribute('stroke', '#f1f5f9');
            condenserLiquidHighlight.style.strokeDashoffset = String(curOff21);
            condenserLiquidHighlight.style.opacity = String(0.45 * e21);
            condenserLiquidHighlight.setAttribute('stroke', '#ffffff');

            condenserFluidDashes.style.strokeDashoffset = String(curOff21 - ((condDashDrift * (1 - 0.3 * e21)) % 8));
            condenserFluidDashes.setAttribute('stroke', `rgba(254, 243, 199, ${0.65 * (1 - 0.5 * e21)})`);
            condenserFluidDashes.style.opacity = String(1 - 0.4 * e21);
            condenserOutletMeniscus.style.opacity = '0';
          } else if (currentTime < 17.5) {
            // Beat 22: Liquid Distillate Emergence (prog 0.654 to 0.954)
            const p22 = clamp((currentTime - 16.5) / 1.0, 0, 1);
            const e22 = easeInOutQuad(p22);
            const prog22 = 0.654 + (0.954 - 0.654) * e22;
            const curOff22 = condenserPathLen * (1 - prog22);

            condenserVaporGlow.style.strokeDashoffset = String(curOff22);
            condenserVaporGlow.setAttribute('stroke-width', '2.4');
            condenserVaporGlow.setAttribute('stroke', 'rgba(254, 243, 199, 0.12)');

            condenserTransCore.style.strokeDashoffset = String(curOff22);
            condenserTransCore.setAttribute('stroke-width', '2.4');
            condenserTransCore.setAttribute('stroke', 'rgba(254, 243, 199, 0.75)');

            condenserLiquidStream.style.strokeDashoffset = String(curOff22);
            condenserLiquidStream.style.opacity = '0.95';
            condenserLiquidStream.setAttribute('stroke', '#f1f5f9');
            condenserLiquidHighlight.style.strokeDashoffset = String(curOff22);
            condenserLiquidHighlight.style.opacity = String(0.45 + 0.45 * e22);
            condenserLiquidHighlight.setAttribute('stroke', '#ffffff');

            condenserFluidDashes.style.strokeDashoffset = String(curOff22 - ((condDashDrift * 0.4) % 8));
            condenserFluidDashes.style.opacity = String(0.25 * (1 - e22));
            condenserOutletMeniscus.style.opacity = '0';
          } else if (currentTime < 18.0) {
            // Beat 23: Condenser Outlet Arrival (prog 0.954 to 1.0)
            const p23 = clamp((currentTime - 17.5) / 0.5, 0, 1);
            const e23 = easeOutCubic(p23);
            const prog23 = 0.954 + 0.046 * e23;
            const curOff23 = condenserPathLen * (1 - prog23);

            condenserVaporGlow.style.strokeDashoffset = String(curOff23);
            condenserTransCore.style.strokeDashoffset = String(curOff23);
            condenserLiquidStream.style.strokeDashoffset = String(curOff23);
            condenserLiquidHighlight.style.strokeDashoffset = String(curOff23);
            condenserFluidDashes.style.strokeDashoffset = String(curOff23);
            condenserFluidDashes.style.opacity = '0';

            condenserOutletMeniscus.setAttribute('fill', '#f1f5f9');
            condenserOutletMeniscus.setAttribute('stroke', '#ffffff');
            condenserOutletMeniscus.style.opacity = String(0.9 * e23);
          } else {
            // Steady state held across condenser
            condenserVaporGlow.style.strokeDashoffset = '0';
            condenserTransCore.style.strokeDashoffset = '0';
            condenserLiquidStream.style.strokeDashoffset = '0';
            condenserLiquidHighlight.style.strokeDashoffset = '0';
            condenserFluidDashes.style.opacity = '0';
            condenserOutletMeniscus.setAttribute('fill', '#f1f5f9');
            condenserOutletMeniscus.setAttribute('stroke', '#ffffff');
            condenserOutletMeniscus.style.opacity = '0.9';
          }
        }

        // -------------------------------------------------------------
        // BEATS 24 to 29: Condensate Extraction Line (t = 18.0 .. 20.8s)
        // -------------------------------------------------------------
        const extDashDrift = Math.max(0, (frozenTime - 18.4) * 20);
        const fracPumpInlet = 0.441;
        const fracPumpOutlet = 0.575;

        if (currentTime < 18.0) {
          pumpExtractionCasing.setAttribute('stroke', 'var(--line-steel)');
          pumpExtractionIndicator.setAttribute('fill', 'rgba(148, 163, 184, 0.25)');
          extractionFluidGroup.style.opacity = '0';
          extractionLiquidStream.style.strokeDashoffset = String(extractionPathLen);
          extractionLiquidHighlight.style.strokeDashoffset = String(extractionPathLen);
          extractionLiquidDashes.style.strokeDashoffset = String(extractionPathLen);
          bottleInletMeniscus.style.opacity = '0';
        } else if (currentTime < 18.4) {
          // Beat 25: Extraction Pump Becomes Operational (smooth indicator engagement)
          const p25 = clamp((currentTime - 18.0) / 0.4, 0, 1);
          const e25 = easeInOutQuad(p25);
          const indAlpha = (0.25 + 0.60 * e25).toFixed(2);
          pumpExtractionIndicator.setAttribute('fill', `rgba(148, 163, 184, ${indAlpha})`);
          pumpExtractionCasing.setAttribute('stroke', 'rgba(148, 163, 184, 0.45)');

          extractionFluidGroup.style.opacity = '0';
          extractionLiquidStream.style.strokeDashoffset = String(extractionPathLen);
          extractionLiquidHighlight.style.strokeDashoffset = String(extractionPathLen);
          extractionLiquidDashes.style.strokeDashoffset = String(extractionPathLen);
          bottleInletMeniscus.style.opacity = '0';
        } else if (currentTime < 19.1) {
          // Beat 26: Condensate Enters Extraction Line (outlet to pump suction)
          pumpExtractionIndicator.setAttribute('fill', 'rgba(148, 163, 184, 0.85)');
          pumpExtractionCasing.setAttribute('stroke', 'rgba(148, 163, 184, 0.45)');

          extractionFluidGroup.style.opacity = '1';
          const p26 = clamp((currentTime - 18.4) / 0.7, 0, 1);
          const e26 = easeInOutQuad(p26);
          const prog26 = fracPumpInlet * e26;
          const curOff26 = extractionPathLen * (1 - prog26);

          extractionLiquidStream.style.strokeDashoffset = String(curOff26);
          extractionLiquidHighlight.style.strokeDashoffset = String(curOff26);
          extractionLiquidDashes.style.strokeDashoffset = String(curOff26 - (extDashDrift % 6));
          bottleInletMeniscus.style.opacity = '0';
        } else if (currentTime < 19.7) {
          // Beat 27: Continuous Transport Through Pump [11] body
          pumpExtractionIndicator.setAttribute('fill', 'rgba(148, 163, 184, 0.85)');
          pumpExtractionCasing.setAttribute('stroke', 'rgba(148, 163, 184, 0.45)');

          extractionFluidGroup.style.opacity = '1';
          const p27 = clamp((currentTime - 19.1) / 0.6, 0, 1);
          const e27 = easeInOutQuad(p27);
          const prog27 = fracPumpInlet + (fracPumpOutlet - fracPumpInlet) * e27;
          const curOff27 = extractionPathLen * (1 - prog27);

          extractionLiquidStream.style.strokeDashoffset = String(curOff27);
          extractionLiquidHighlight.style.strokeDashoffset = String(curOff27);
          extractionLiquidDashes.style.strokeDashoffset = String(curOff27 - (extDashDrift % 6));
          bottleInletMeniscus.style.opacity = '0';
        } else if (currentTime < 20.3) {
          // Beat 28: Downstream Collection-Line Travel toward bottle inlet
          pumpExtractionIndicator.setAttribute('fill', 'rgba(148, 163, 184, 0.85)');
          pumpExtractionCasing.setAttribute('stroke', 'rgba(148, 163, 184, 0.45)');

          extractionFluidGroup.style.opacity = '1';
          const p28 = clamp((currentTime - 19.7) / 0.6, 0, 1);
          const e28 = easeInOutQuad(p28);
          const prog28 = fracPumpOutlet + (1.0 - fracPumpOutlet) * e28;
          const curOff28 = extractionPathLen * (1 - prog28);

          extractionLiquidStream.style.strokeDashoffset = String(curOff28);
          extractionLiquidHighlight.style.strokeDashoffset = String(curOff28);
          extractionLiquidDashes.style.strokeDashoffset = String(curOff28 - (extDashDrift % 6));
          bottleInletMeniscus.style.opacity = '0';
        } else if (currentTime < 20.8) {
          // Beat 29: Liquid Reaches Bottle [12] Inlet
          pumpExtractionIndicator.setAttribute('fill', 'rgba(148, 163, 184, 0.85)');
          pumpExtractionCasing.setAttribute('stroke', 'rgba(148, 163, 184, 0.45)');

          extractionFluidGroup.style.opacity = '1';
          extractionLiquidStream.style.strokeDashoffset = '0';
          extractionLiquidHighlight.style.strokeDashoffset = '0';
          extractionLiquidDashes.style.strokeDashoffset = String(-(extDashDrift % 6));

          const p29 = clamp((currentTime - 20.3) / 0.5, 0, 1);
          const e29 = easeOutCubic(p29);
          bottleInletMeniscus.style.opacity = String(0.9 * e29);
        } else {
          // Extraction line fully primed and steady
          if (currentTime >= 23.4) {
            const pDown = clamp((currentTime - 23.4) / 0.6, 0, 1);
            const indAlpha = (0.85 - 0.40 * pDown).toFixed(2);
            pumpExtractionIndicator.setAttribute('fill', `rgba(148, 163, 184, ${indAlpha})`);
          } else {
            pumpExtractionIndicator.setAttribute('fill', 'rgba(148, 163, 184, 0.85)');
          }
          pumpExtractionCasing.setAttribute('stroke', 'rgba(148, 163, 184, 0.45)');

          extractionFluidGroup.style.opacity = '1';
          extractionLiquidStream.style.strokeDashoffset = '0';
          extractionLiquidHighlight.style.strokeDashoffset = '0';
          extractionLiquidDashes.style.strokeDashoffset = String(-(extDashDrift % 6));
          bottleInletMeniscus.style.opacity = '0.9';
        }

        // -------------------------------------------------------------
        // BEATS 30 & 31: Distillate Entry, Bottle Accumulation & Settled Yield (t = 20.8 .. 25.0s)
        // -------------------------------------------------------------
        if (currentTime < 20.8) {
          bottleInflowStream.style.opacity = '0';
          bottleInflowHighlight.style.opacity = '0';
          bottleLiquidPool.setAttribute('height', '0');
          bottlePoolMeniscusLine.style.opacity = '0';
          bottlePoolMeniscusHighlight.style.opacity = '0';
          bottleStaticFill.style.opacity = '0';
        } else if (currentTime < 23.0) {
          // Beat 30: Distillate Entry & Inflow Accumulation (liquid rises from Y=444 to 414)
          const p30 = clamp((currentTime - 20.8) / 2.2, 0, 1);
          const e30 = easeInOutQuad(p30);
          const poolHeight = 30 * e30;
          const curY = 444 - poolHeight;

          bottleInflowStream.setAttribute('d', `M 812 368 L 812 ${curY.toFixed(1)}`);
          bottleInflowHighlight.setAttribute('d', `M 812 368 L 812 ${curY.toFixed(1)}`);
          bottleInflowStream.style.opacity = '0.85';
          bottleInflowHighlight.style.opacity = '0.50';

          bottleLiquidPool.setAttribute('y', curY.toFixed(1));
          bottleLiquidPool.setAttribute('height', poolHeight.toFixed(1));

          // Gentle micro-ripple while liquid enters
          const rippleOffset = Math.sin((currentTime - 20.8) * 16) * 0.4 * (1 - e30);
          const meniscusY = (curY + rippleOffset).toFixed(1);
          bottlePoolMeniscusLine.setAttribute('y1', meniscusY);
          bottlePoolMeniscusLine.setAttribute('y2', meniscusY);
          bottlePoolMeniscusHighlight.setAttribute('y1', meniscusY);
          bottlePoolMeniscusHighlight.setAttribute('y2', meniscusY);
          bottlePoolMeniscusLine.style.opacity = '0.95';
          bottlePoolMeniscusHighlight.style.opacity = '0.70';
          bottleStaticFill.style.opacity = '0';
        } else if (currentTime < 23.4) {
          // Inflow stream smoothly tapers off as liquid collection completes
          const pTaper = clamp((currentTime - 23.0) / 0.4, 0, 1);
          const eTaper = easeInOutQuad(pTaper);

          bottleInflowStream.setAttribute('d', 'M 812 368 L 812 414');
          bottleInflowHighlight.setAttribute('d', 'M 812 368 L 812 414');
          bottleInflowStream.style.opacity = String((0.85 * (1 - eTaper)).toFixed(2));
          bottleInflowHighlight.style.opacity = String((0.50 * (1 - eTaper)).toFixed(2));

          bottleLiquidPool.setAttribute('y', '414');
          bottleLiquidPool.setAttribute('height', '30');

          // Ripples damp out to dead calm
          const dampRipple = Math.sin((currentTime - 23.0) * 16) * 0.2 * (1 - eTaper);
          const meniscusY = (414 + dampRipple).toFixed(1);
          bottlePoolMeniscusLine.setAttribute('y1', meniscusY);
          bottlePoolMeniscusLine.setAttribute('y2', meniscusY);
          bottlePoolMeniscusHighlight.setAttribute('y1', meniscusY);
          bottlePoolMeniscusHighlight.setAttribute('y2', meniscusY);
          bottlePoolMeniscusLine.style.opacity = '0.95';
          bottlePoolMeniscusHighlight.style.opacity = '0.75';
          bottleStaticFill.style.opacity = '0';
        } else {
          // Beat 31: Stable Operational Distillate Yield & Settled Equilibrium (t = 23.4 .. 25.0s)
          // Inflow ceases completely; pool rests at clean, settled yield
          bottleInflowStream.style.opacity = '0';
          bottleInflowHighlight.style.opacity = '0';

          bottleLiquidPool.setAttribute('y', '414');
          bottleLiquidPool.setAttribute('height', '30');

          bottlePoolMeniscusLine.setAttribute('y1', '414');
          bottlePoolMeniscusLine.setAttribute('y2', '414');
          bottlePoolMeniscusHighlight.setAttribute('y1', '414');
          bottlePoolMeniscusHighlight.setAttribute('y2', '414');
          bottlePoolMeniscusLine.style.opacity = '0.95';
          bottlePoolMeniscusHighlight.style.opacity = '0.75';
          bottleStaticFill.style.opacity = '0';
        }

        // -------------------------------------------------------------
        // UI & Meta Displays Update (Reviewer Harness)
        // -------------------------------------------------------------
        if (hasHarness) {
          if (scrubber) scrubber.value = currentTime;
          const mins = Math.floor(currentTime / 60);
          const secs = (currentTime % 60).toFixed(1).padStart(4, '0');
          if (timecodeDisplay) timecodeDisplay.textContent = `0${mins}:${secs} / 00:25.0`;

          // Determine current beat
          let activeBeat = BEATS[0];
          for (let i = BEATS.length - 1; i >= 0; i--) {
            if (currentTime >= BEATS[i].time) {
              activeBeat = BEATS[i];
              break;
            }
          }
          if (beatLabelDisplay) beatLabelDisplay.textContent = activeBeat.name;
          if (statusPill) statusPill.textContent = activeBeat.pill;

          // Active state for beat stepper buttons
          if (beatBtns && beatBtns.length) {
            beatBtns.forEach(btn => {
              const bNum = parseInt(btn.dataset.beat, 10);
              if (activeBeat.id === bNum) {
                btn.classList.add('is-active');
              } else {
                btn.classList.remove('is-active');
              }
            });
          }
        }
      }

      // Playback Loop
      function tick(now) {
        if (!isPlaying) return;
        if (lastRafTime === null) lastRafTime = now;
        const delta = (now - lastRafTime) / 1000;
        lastRafTime = now;

        currentTime += delta;
        if (currentTime >= DURATION) {
          currentTime = DURATION;
          render(currentTime);
          pause();
          if (typeof window.Ch02Scene05?.onComplete === "function") {
            window.Ch02Scene05.onComplete();
          }
          return;
        }

        render(currentTime);
        rafId = requestAnimationFrame(tick);
      }

      function play() {
        if (currentTime >= DURATION) currentTime = 0;
        isPlaying = true;
        lastRafTime = null;
        if (btnPlayPause) btnPlayPause.classList.add('is-primary');
        if (playText) playText.textContent = 'PAUSE';
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        rafId = requestAnimationFrame(tick);
      }

      function pause() {
        isPlaying = false;
        if (btnPlayPause) btnPlayPause.classList.remove('is-primary');
        if (playText) playText.textContent = 'PLAY';
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        lastRafTime = null;
      }

      function restart() {
        pause();
        render(0);
        play();
      }

      function seek(timeSec) {
        pause();
        render(timeSec);
      }

      function goToBeat(beatId) {
        const beat = BEATS.find(b => b.id === beatId);
        if (beat) {
          seek(beat.time);
        }
      }

      // Event Listeners (Reviewer Harness)
      if (hasHarness) {
        if (btnPlayPause) {
          btnPlayPause.addEventListener('click', () => {
            if (isPlaying) pause();
            else play();
          });
        }

        if (btnRestart) {
          btnRestart.addEventListener('click', () => {
            restart();
          });
        }

        if (scrubber) {
          scrubber.addEventListener('input', (e) => {
            seek(parseFloat(e.target.value));
          });
        }

        if (beatBtns && beatBtns.length) {
          beatBtns.forEach(btn => {
            btn.addEventListener('click', () => {
              const bNum = parseInt(btn.dataset.beat, 10);
              goToBeat(bNum);
            });
          });
        }
      }

      // Stage Click Interaction (toggle play/pause or restart if settled)
      if (stageSvg) {
        stageSvg.addEventListener('click', () => {
          if (currentTime >= DURATION) {
            restart();
          } else if (isPlaying) {
            pause();
          } else {
            play();
          }
        });
      }

      // Expose globally for programmatic verification & inspection
      window.scene05Player = {
        play,
        pause,
        restart,
        seek,
        goToBeat,
        getState: () => ({
          currentTime,
          isPlaying,
          totalDuration: DURATION,
          activeBeat: BEATS.slice().reverse().find(b => b.time <= currentTime)
        })
      };

      // Dossier inspection panel handling for Scene 05 (Undergraduate Thesis Rig & Graduation)
      const infoBtn = document.getElementById('scene-05-inspect-btn');
      const dossierModal = document.getElementById('scene-05-dossier');

      function openDossier() {
        if (!dossierModal) return;
        dossierModal.hidden = false;
        document.body.style.overflow = 'hidden';
        if (infoBtn) infoBtn.setAttribute('aria-expanded', 'true');
        const closeBtn = dossierModal.querySelector('.archival-dossier__close');
        if (closeBtn) closeBtn.focus();
      }

      function closeDossier() {
        if (!dossierModal) return;
        dossierModal.hidden = true;
        document.body.style.overflow = '';
        if (infoBtn) {
          infoBtn.setAttribute('aria-expanded', 'false');
          infoBtn.focus();
        }
      }

      if (infoBtn) {
        infoBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (dossierModal && dossierModal.hidden) {
            openDossier();
          } else {
            closeDossier();
          }
        });
      }

      if (dossierModal) {
        dossierModal.addEventListener('click', (e) => {
          if (e.target.dataset && e.target.dataset.close === 'true') {
            closeDossier();
          }
        });
      }

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dossierModal && !dossierModal.hidden) {
          closeDossier();
        }
      });

      // Standard Chapter 02 Scene 05 Adapter interface
      window.Ch02Scene05 = {
        id: 'scene-05',
        name: '05 // THESIS RIG',
        shortName: '05 Thesis',
        duration: DURATION,
        init: function () {
          render(0);
        },
        play: play,
        pause: pause,
        replay: restart,
        stop: function () {
          pause();
          currentTime = 0;
          render(0);
        },
        resize: function () {},
        getCurrentTime: function () {
          return Math.min(currentTime, DURATION);
        },
        seek: seek,
        onComplete: null
      };

      // Initial Render at rest
      render(0);
    })();