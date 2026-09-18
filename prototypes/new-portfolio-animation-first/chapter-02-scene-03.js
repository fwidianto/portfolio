/* ==========================================================================
   CHAPTER 02: SCENE 03 CONTROLLER — ASTRA AGRO LESTARI PALM OIL MILL
   Batch Material Transformation Choreography (2018, Central Kalimantan)
   Governing Rule: "Nothing moves unless the palm-oil process causes it to move."
   Stages:
     01: FFB Intake (Actual fresh fruit bunch arrives & conveyor feeds batch)
     02: Weighbridge (Physical mass depresses deck, deflecting dial scale & lighting load indicator)
     03: Sterilizer Autoclave (Chamber door opens, batch enters, door seals, steam injects,
         pressure gauge deflects, fruit softens/cooks, door reopens to release cooked batch)
     04: Twin-Screw Press (Screws rotate ONLY when batch enters, compressing material
         into extruded press cake and downward crude oil slurry drainage)
     05: Clarification (Crude slurry flows into column, separating under gravity into
         bottom sludge, emulsion, and rising golden oil skimming over weir)
     06: CPO Outflow (Clarified oil flows through delivery pipe, filling storage tank
         and calibrated vertical sight-glass level gauge)
   ========================================================================== */
(function () {
  'use strict';

  const stageWrapper = document.querySelector('.scene-03__stage-wrapper');
  const canvas = document.getElementById('scene-03-canvas');
  const replayBtn = document.getElementById('scene-03-replay-btn');
  const inspectBtn = document.getElementById('scene-03-inspect-btn');
  const evidencePanel = document.getElementById('scene-03-evidence-panel');
  const processBtn = document.getElementById('scene-03-process-btn');
  const processPanel = document.getElementById('scene-03-process-panel');

  if (!stageWrapper || !canvas) return;

  const ctx = canvas.getContext('2d');
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isReducedMotion = reduceMotionQuery.matches;

  // Dimensions & DPR
  let width = 0;
  let height = 0;
  let dpr = 1;

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = stageWrapper.offsetWidth || (window.innerWidth < 640 ? 360 : 1240);
    height = stageWrapper.offsetHeight || (window.innerWidth < 640 ? 1480 : 940);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Mathematics & Interpolation Helpers
  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  // C1 smooth trapezoidal motion profile for conveyor transfers (linear cruise with smooth quadratic ramps)
  function conveyorMotion(p) {
    p = clamp(p, 0, 1);
    if (p < 0.2) return 3.125 * p * p;
    if (p <= 0.8) return 0.125 + 1.25 * (p - 0.2);
    const q = 1 - p;
    return 1 - 3.125 * q * q;
  }
  function easeInQuad(t) {
    return t * t;
  }
  function easeOutQuad(t) {
    return t * (2 - t);
  }

  // Analytical integral of screw press 4-phase speed profile for 1:1 rotation-displacement coupling
  function getPressAxialProgress(t) {
    const T0 = 22.3, T1 = 23.0, T2 = 24.3, T3 = 26.2, T4 = 27.0;
    if (t <= T0) return 0;
    if (t >= T4) return 1;

    const v0 = 0.08, v1 = 0.25, v2 = 1.0, v3 = 1.0, v4 = 0.0;
    const dt1 = T1 - T0; // 0.7
    const dt2 = T2 - T1; // 1.3
    const dt3 = T3 - T2; // 1.9
    const dt4 = T4 - T3; // 0.8

    const A1 = dt1 * (v0 + v1) / 2; // 0.1155
    const A2 = dt2 * (v1 + v2) / 2; // 0.8125
    const A3 = dt3 * 1.0;            // 1.9000
    const A4 = dt4 * (v3 + v4) / 2; // 0.4000
    const totalArea = A1 + A2 + A3 + A4; // 3.228

    if (t < T1) {
      const dt = t - T0;
      const curV = v0 + (v1 - v0) * (dt / dt1);
      const curArea = dt * (v0 + curV) / 2;
      return curArea / totalArea;
    } else if (t < T2) {
      const dt = t - T1;
      const curV = v1 + (v2 - v1) * (dt / dt2);
      const curArea = A1 + dt * (v1 + curV) / 2;
      return curArea / totalArea;
    } else if (t < T3) {
      const dt = t - T2;
      const curArea = A1 + A2 + dt * 1.0;
      return curArea / totalArea;
    } else {
      const dt = t - T3;
      const curV = v3 + (v4 - v3) * (dt / dt4);
      const curArea = A1 + A2 + A3 + dt * (v3 + curV) / 2;
      return curArea / totalArea;
    }
  }

  // Saturated steam particles for Stage 03 Autoclave (generated ONLY during active steam cycle)
  const steamParticles = [];
  for (let i = 0; i < 42; i++) {
    steamParticles.push({
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 0.9,
      vy: -0.8 - Math.random() * 1.3,
      size: 5 + Math.random() * 8,
      maxSize: 22 + Math.random() * 18,
      life: Math.random(),
      lifeSpeed: 0.009 + Math.random() * 0.013
    });
  }

  // Crude slurry droplet particles for Stage 04 Press (generated ONLY during active pressing)
  const slurryDrops = [];
  for (let i = 0; i < 28; i++) {
    slurryDrops.push({
      progress: Math.random(),
      slotFraction: Math.random(),
      size: 1.4 + Math.random() * 2.2,
      speed: 0.04 + Math.random() * 0.03
    });
  }

  // Timeline State
  let timeline = 0;
  const DURATION = 34.0; // Expanded from 20.0s for slower, highly readable mechanical pacing
  let isPlaying = false;
  let isSettled = false;
  let hasTriggered = false;
  let animFrameId = null;
  let lastTime = 0;
  let hoveredStage = 0;

  // Mechanical dynamic state accumulators
  let screwAccumAngle = 0;
  let weighbridgeConveyorOffset = 0;
  let sterilizerConveyorOffset = 0;

  // Synchronize top navigation header status text with active section
  function syncHeaderStatus() {
    const statusText = document.querySelector('.portfolio-header__status-text');
    if (!statusText) return;

    const sections = [
      { id: 'hero', label: '01 // RED DWARF' },
      { id: 'scene-01', label: '02.01 // UNIVERSITAS INDONESIA' },
      { id: 'scene-02', label: '02.02 // ENGINEERING FOUNDATIONS' },
      { id: 'scene-03', label: '02.03 // PALM OIL MILL INTERNSHIP' }
    ];

    function check() {
      const scrollY = window.scrollY || window.pageYOffset;
      const viewportMid = scrollY + window.innerHeight * 0.45;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const top = el.offsetTop;
          if (viewportMid >= top - 120) {
            if (statusText.textContent !== sections[i].label) {
              statusText.textContent = sections[i].label;
            }
            break;
          }
        }
      }
    }

    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  // Responsive stage layout coordinate mapper
  function getMillLayout() {
    const isMobile = width < 640;
    const cx = width / 2;

    if (isMobile) {
      return {
        isMobile: true,
        s1: { x: cx, y: 130, w: 290, h: 90 },    // FFB Intake
        s2: { x: cx, y: 320, w: 290, h: 90 },    // Weighbridge
        s3: { x: cx, y: 560, w: 330, h: 140 },   // Sterilizer Autoclave
        s4: { x: cx, y: 830, w: 330, h: 130 },   // Twin-Screw Press
        s5: { x: cx, y: 1110, w: 290, h: 180 },  // Clarifier Column
        s6: { x: cx, y: 1360, w: 290, h: 120 }   // CPO Storage Tank
      };
    }

    // Desktop 2-tier continuous industrial layout
    return {
      isMobile: false,
      s1: { x: cx - 490, y: 215, w: 190, h: 115 },   // FFB Intake
      s2: { x: cx - 275, y: 215, w: 180, h: 115 },   // Weighbridge
      s3: { x: cx + 165, y: 215, w: 460, h: 165 },   // Sterilizer Autoclave
      s4: { x: cx - 360, y: 640, w: 390, h: 145 },   // Twin-Screw Press
      s5: { x: cx + 60, y: 600, w: 280, h: 300 },    // Clarifier Column
      s6: { x: cx + 430, y: 640, w: 280, h: 175 }    // CPO Storage Tank
    };
  }

  /* --------------------------------------------------------------------------
     VISUAL EMPHASIS: MACHINE PROMINENCE (ATTENTION FOLLOWS MATERIAL)
     Stable baseline opacity; focus communicated by mechanical activity.
     -------------------------------------------------------------------------- */
  function getStageProminence(stageIndex, t) {
    const baseAlpha = 0.44;
    let alpha = baseAlpha;
    switch (stageIndex) {
      case 1: // FFB Intake
        if (t < 2.0) alpha = 1.0;
        else if (t < 3.5) alpha = lerp(1.0, baseAlpha, (t - 2.0) / 1.5);
        else alpha = baseAlpha;
        break;
      case 2: // Weighbridge
        if (t < 3.5) alpha = baseAlpha;
        else if (t < 4.8) alpha = lerp(baseAlpha, 1.0, (t - 3.5) / 1.3);
        else if (t < 9.5) alpha = 1.0;
        else if (t < 10.8) alpha = lerp(1.0, baseAlpha, (t - 9.5) / 1.3);
        else alpha = baseAlpha;
        break;
      case 3: // Sterilizer Autoclave
        if (t < 8.2) alpha = baseAlpha;
        else if (t < 9.5) alpha = lerp(baseAlpha, 1.0, (t - 8.2) / 1.3);
        else if (t < 18.2) alpha = 1.0;
        else if (t < 19.8) alpha = lerp(1.0, baseAlpha, (t - 18.2) / 1.6);
        else alpha = baseAlpha;
        break;
      case 4: // Twin-Screw Press
        if (t < 17.5) alpha = baseAlpha;
        else if (t < 19.0) alpha = lerp(baseAlpha, 1.0, (t - 17.5) / 1.5);
        else if (t < 27.0) alpha = 1.0;
        else if (t < 28.5) alpha = lerp(1.0, baseAlpha, (t - 27.0) / 1.5);
        else alpha = baseAlpha;
        break;
      case 5: // Clarifier Column
        if (t < 25.5) alpha = baseAlpha;
        else if (t < 27.0) alpha = lerp(baseAlpha, 1.0, (t - 25.5) / 1.5);
        else if (t < 31.0) alpha = 1.0;
        else if (t < 32.5) alpha = lerp(1.0, baseAlpha, (t - 31.0) / 1.5);
        else alpha = baseAlpha;
        break;
      case 6: // CPO Storage Tank
        if (t < 29.0) alpha = baseAlpha;
        else if (t < 30.5) alpha = lerp(baseAlpha, 1.0, (t - 29.0) / 1.5);
        else alpha = 1.0;
        break;
    }
    return alpha;
  }

  /* --------------------------------------------------------------------------
     ONE IDENTIFIABLE BATCH MATERIAL TRACKER
     Calculates coordinate and physical transformation state of the palm batch.
     Zero teleportation; fully continuous mass and kinematics.
     -------------------------------------------------------------------------- */
  function getBatchState(t, layout) {
    const { s1, s2, s3, s4, s5, s6, isMobile } = layout;

    // Phase 0: At Rest Inside FFB Cart solidly grounded on steel rails (t = 0.0 - 1.2)
    if (t < 1.2) {
      return {
        x: s1.x - 12,
        y: s1.y - 2,
        type: 'raw_ffb',
        scale: 0.95,
        visible: true,
        label: 'Fresh Harvest Batch'
      };
    }

    // Phase 0.5: Cart Gate Unlatches & Hinges Open Outward, Fruit Rolls Forward (t = 1.2 - 2.0)
    if (t < 2.0) {
      const u = (t - 1.2) / 0.8;
      return {
        x: s1.x - 12 + u * 18,
        y: s1.y - 2 + u * 2,
        type: 'raw_ffb',
        scale: 0.95,
        visible: true
      };
    }

    // Phase 1A: Gravity Roll Down Outward Gate Chute onto Slat Bed (t = 2.0 - 2.7)
    if (t < 2.7) {
      const u = (t - 2.0) / 0.7;
      const rollEase = easeInQuad(u);
      return {
        x: lerp(s1.x + 6, s1.x + 46, rollEase),
        y: lerp(s1.y, s2.y + 2, rollEase),
        type: 'raw_ffb',
        scale: 1.0,
        tumbleAngle: u * 0.35,
        visible: true
      };
    }

    // Phase 1B: Continuous Slat Cleat Conveyance to Weighbridge Center (t = 2.7 - 5.4)
    if (t < 5.4) {
      const u = (t - 2.7) / 2.7;
      return {
        x: lerp(s1.x + 46, s2.x, easeOutQuad(u)),
        y: s2.y + 2,
        type: 'raw_ffb',
        scale: 1.0,
        visible: true
      };
    }

    // Phase 2: Static Weighing on Weighbridge Deck with Damped Load Impact (t = 5.4 - 9.0)
    if (t < 9.0) {
      const loadProgress = clamp((t - 5.4) / 0.6, 0, 1);
      const landingBounce = Math.exp(-loadProgress * 4.5) * Math.sin(loadProgress * Math.PI * 2.5) * 0.8;
      const deckDepress = 2.2 * Math.sin(loadProgress * Math.PI * 0.5) + landingBounce;
      return {
        x: s2.x,
        y: s2.y + 2 + deckDepress,
        type: 'raw_ffb',
        scale: 1.0,
        visible: true
      };
    }

    // Phase 3: Transfer from Weighbridge across Deck into Sterilizer Entrance (t = 9.0 - 12.8)
    if (t < 12.8) {
      const p = (t - 9.0) / 3.8;
      const u = conveyorMotion(p);
      const entranceX = isMobile ? s3.x : s3.x - (s3.w / 2 - 45);
      const targetY = isMobile ? s3.y : s3.y + 4;
      return {
        x: lerp(s2.x, entranceX, u),
        y: lerp(s2.y + 2, targetY, u),
        type: 'raw_ffb',
        scale: 1.0,
        visible: true
      };
    }

    // Phase 4: Inside Sterilizer Autoclave — Pressure Cooking & Blowdown (t = 12.8 - 17.2)
    if (t < 17.2) {
      const startX = isMobile ? s3.x : s3.x - (s3.w / 2 - 45);
      const rearX = isMobile ? s3.x : s3.x + (s3.w / 2 - 35);
      // Gradual steady advance across autoclave during cooking (12.8 - 16.8), rests at rearX during blowdown (16.8 - 17.2)
      const uTravel = clamp((t - 12.8) / 4.0, 0, 1);
      const internalX = isMobile ? s3.x : lerp(startX, rearX, easeInOutCubic(uTravel));
      const cookProgress = clamp((t - 13.5) / 3.0, 0, 1);
      return {
        x: internalX,
        y: isMobile ? s3.y : s3.y + 4,
        type: cookProgress > 0.6 ? 'cooked_ffb' : (cookProgress > 0.1 ? 'cooking_ffb' : 'raw_ffb'),
        cookProgress,
        scale: 1.0,
        visible: true
      };
    }

    // Phase 4.5: Rear Discharge through Chute onto External Gantry (t = 17.2 - 18.2)
    if (t < 18.2) {
      const u = (t - 17.2) / 1.0;
      const rearX = isMobile ? s3.x : s3.x + (s3.w / 2 - 35);
      const pStart = isMobile
        ? { x: s3.x, y: s3.y }
        : { x: rearX, y: s3.y + 4 };
      const pGantryEntry = isMobile
        ? { x: s3.x, y: s3.y + 52 }
        : { x: s3.x + s3.w / 2 + 10, y: s3.y + 10 };
      return {
        x: lerp(pStart.x, pGantryEntry.x, easeInOutCubic(u)),
        y: lerp(pStart.y, pGantryEntry.y, easeInQuad(u)),
        type: 'cooked_ffb',
        scale: 0.98,
        tumbleAngle: u * 0.25,
        visible: true
      };
    }

    // Phase 5: Travelling on External Overhead Gantry to Press Hopper (t = 18.2 - 21.8)
    if (t < 21.8) {
      const p = (t - 18.2) / 3.6;
      const u = conveyorMotion(p);
      let bx, by;
      if (isMobile) {
        bx = s4.x;
        by = lerp(s3.y + 52, s4.y - 44, u);
      } else {
        const cornerX = s3.x + s3.w / 2 + 35;
        const gantryY = 440;
        const hopperX = s4.x - s4.w * 0.36;
        const hopperLipY = s4.y - 44;

        if (u < 0.20) {
          // Segment 1: Rightward exit & vertical descent to gantry level
          const u1 = u / 0.20;
          bx = lerp(s3.x + s3.w / 2 + 10, cornerX, Math.min(1, u1 * 1.4));
          by = lerp(s3.y + 10, gantryY, easeInOutCubic(u1));
        } else if (u < 0.85) {
          // Segment 2: Overhead horizontal gantry run across mill (above clarifier)
          const u2 = (u - 0.20) / 0.65;
          bx = lerp(cornerX, hopperX, u2);
          by = gantryY;
        } else {
          // Segment 3: Vertical drop down chute into press hopper mouth
          const u3 = (u - 0.85) / 0.15;
          bx = hopperX;
          by = lerp(gantryY, hopperLipY, easeInQuad(u3));
        }
      }
      return {
        x: bx,
        y: by,
        type: 'cooked_ffb',
        scale: 0.95,
        visible: true
      };
    }

    // Phase 5.5: Feed Hopper Gravity Funnel Ingest (Priority 1: t = 21.8 - 22.3)
    if (t < 22.3) {
      const uDrop = (t - 21.8) / 0.5;
      const dropEase = easeInQuad(uDrop);
      const hX = isMobile ? s4.x : s4.x - s4.w * 0.36;
      const hY = lerp(s4.y - 44, s4.y - 2, dropEase);
      return {
        x: hX,
        y: hY,
        type: 'cooked_ffb',
        scale: lerp(0.95, 0.90, uDrop),
        tumbleAngle: uDrop * 0.45,
        visible: true
      };
    }

    // Phase 6: Inside Twin-Screw Press — Rotation-Coupled Axial Advance (Priority 1 & 5: t = 22.3 - 27.0)
    if (t < 27.0) {
      const u = getPressAxialProgress(t);
      const startX = isMobile ? s4.x : s4.x - s4.w * 0.36;
      const endX = isMobile ? s4.x : s4.x + s4.w * 0.32;
      return {
        x: lerp(startX, endX, u),
        y: s4.y,
        type: 'pressing_mass',
        pressProgress: u,
        scale: lerp(0.90, 0.75, u),
        visible: true
      };
    }

    // Phase 7: Post-Press — Press Cake Extruded at Cone (t >= 27.0)
    const extrudeU = clamp((t - 27.0) / 0.6, 0, 1);
    const cakeStartX = isMobile ? s4.x : s4.x + s4.w * 0.32;
    const cakeFinalX = isMobile ? s4.x : s4.x + s4.w * 0.44;
    return {
      x: lerp(cakeStartX, cakeFinalX, easeOutQuad(extrudeU)),
      y: isMobile ? s4.y + 35 : s4.y,
      type: 'press_cake',
      scale: 0.75,
      visible: true
    };
  }

  /* --------------------------------------------------------------------------
     DRAW THE PHYSICAL BATCH MATERIAL
     Renders authentic fruit drupelets, softening cooked clusters, or cake.
     -------------------------------------------------------------------------- */
  function drawBatchMaterial(batch) {
    if (!batch || !batch.visible) return;

    ctx.save();
    ctx.translate(batch.x, batch.y);
    ctx.scale(batch.scale || 1, batch.scale || 1);
    if (batch.tumbleAngle) {
      ctx.rotate(batch.tumbleAngle);
    }

    if (batch.type === 'raw_ffb') {
      // 1. Fresh Harvested Palm Fruit Bunch
      // Fibrous dark stalk and spiky bracts
      ctx.fillStyle = '#3a180d';
      ctx.beginPath();
      ctx.ellipse(-14, 0, 5, 9, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Individual oil palm drupelets (crimson with sunward flame orange)
      const drupelets = [
        { dx: -10, dy: -5, r: 5.5, col: '#b83416' },
        { dx: -6, dy: 4, r: 6.0, col: '#d94b1a' },
        { dx: -2, dy: -6, r: 5.8, col: '#e85c20' },
        { dx: 3, dy: 3, r: 6.2, col: '#d94b1a' },
        { dx: 4, dy: -4, r: 5.5, col: '#b83416' },
        { dx: 10, dy: 1, r: 5.8, col: '#e85c20' },
        { dx: -1, dy: 7, r: 4.8, col: '#9c240e' },
        { dx: 8, dy: -5, r: 4.5, col: '#d94b1a' }
      ];

      drupelets.forEach(d => {
        const grad = ctx.createRadialGradient(d.dx - 1.5, d.dy - 1.5, 0.5, d.dx, d.dy, d.r);
        grad.addColorStop(0, '#f97316');
        grad.addColorStop(0.45, d.col);
        grad.addColorStop(1, '#661608');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(d.dx, d.dy, d.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Dark sepals / calyx spines between fruit
      ctx.strokeStyle = '#2d1107';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-7, -2); ctx.lineTo(-11, -4);
      ctx.moveTo(1, 1); ctx.lineTo(3, 4);
      ctx.moveTo(7, -1); ctx.lineTo(11, -2);
      ctx.stroke();

    } else if (batch.type === 'cooking_ffb' || batch.type === 'cooked_ffb') {
      // 2. Softened, Cooked Fruit Bunch (Deep Cooked Maroon / Mahogany)
      const cp = batch.cookProgress !== undefined ? batch.cookProgress : 1.0;
      const drupelets = [
        { dx: -10, dy: -5, r: 5.8 },
        { dx: -6, dy: 4, r: 6.4 },
        { dx: -2, dy: -6, r: 6.0 },
        { dx: 3, dy: 3, r: 6.5 },
        { dx: 4, dy: -4, r: 5.8 },
        { dx: 10, dy: 1, r: 6.0 },
        { dx: -1, dy: 7, r: 5.2 },
        { dx: 8, dy: -5, r: 4.8 }
      ];

      drupelets.forEach(d => {
        const grad = ctx.createRadialGradient(d.dx - 1, d.dy - 1, 0.5, d.dx, d.dy, d.r);
        // Interpolate from raw orange to dark cooked maroon
        grad.addColorStop(0, cp > 0.5 ? '#b4461e' : '#f97316');
        grad.addColorStop(0.5, cp > 0.5 ? '#6e1a12' : '#b83416');
        grad.addColorStop(1, '#2c0b06');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(d.dx, d.dy, d.r, 0, Math.PI * 2);
        ctx.fill();
      });

    } else if (batch.type === 'pressing_mass') {
      // 3. Material Undergoing Continuous Mechanical Compression in Screw Press (Priority 1)
      const p = batch.pressProgress || 0;

      // Evolving structural transformation: Drupelets flatten, coalesce, and express oil
      if (p < 0.55) {
        // Phase A: Drupelets squeezed and flattening between flight screws
        const sq = p / 0.55;
        const drupelets = [
          { dx: -10 * (1 - sq * 0.4), dy: -5 * (1 - sq * 0.5), r: 5.8 * (1 - sq * 0.25) },
          { dx: -6 * (1 - sq * 0.3), dy: 4 * (1 - sq * 0.5), r: 6.4 * (1 - sq * 0.25) },
          { dx: -2, dy: -6 * (1 - sq * 0.5), r: 6.0 * (1 - sq * 0.25) },
          { dx: 3 * (1 - sq * 0.3), dy: 3 * (1 - sq * 0.5), r: 6.5 * (1 - sq * 0.25) },
          { dx: 4 * (1 - sq * 0.4), dy: -4 * (1 - sq * 0.5), r: 5.8 * (1 - sq * 0.25) },
          { dx: 10 * (1 - sq * 0.4), dy: 1 * (1 - sq * 0.5), r: 6.0 * (1 - sq * 0.25) },
          { dx: -1, dy: 7 * (1 - sq * 0.5), r: 5.2 * (1 - sq * 0.25) },
          { dx: 8 * (1 - sq * 0.4), dy: -5 * (1 - sq * 0.5), r: 4.8 * (1 - sq * 0.25) }
        ];

        drupelets.forEach(d => {
          const grad = ctx.createRadialGradient(d.dx - 1, d.dy - 1, 0.5, d.dx, d.dy, d.r);
          grad.addColorStop(0, '#b4461e');
          grad.addColorStop(0.5, '#6e1a12');
          grad.addColorStop(1, '#2c0b06');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.ellipse(d.dx, d.dy, d.r * (1 + sq * 0.25), d.r * (1 - sq * 0.35), 0, 0, Math.PI * 2);
          ctx.fill();
        });

        // Viscous oily film emerging between drupelets
        ctx.fillStyle = `rgba(234, 88, 12, ${0.35 + sq * 0.45})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, 15 * (1 - sq * 0.1), 7 * (1 - sq * 0.2), 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ea580c';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      } else {
        // Phase B: Dense compressed fibrous pulp & nut mass
        const cp = (p - 0.55) / 0.45;
        ctx.fillStyle = `rgba(${Math.round(lerp(140, 110, cp))}, ${Math.round(lerp(50, 35, cp))}, ${Math.round(lerp(20, 15, cp))}, 0.95)`;
        ctx.beginPath();
        ctx.ellipse(0, 0, 14 * (1 - cp * 0.2), 6.5 * (1 - cp * 0.15), 0, 0, Math.PI * 2);
        ctx.fill();

        // Longitudinal fiber shear lines
        ctx.strokeStyle = '#4a240c';
        ctx.lineWidth = 1.1;
        for (let fl = -8; fl <= 8; fl += 4) {
          ctx.beginPath();
          ctx.moveTo(fl, -4);
          ctx.lineTo(fl + 2, 4);
          ctx.stroke();
        }

        // Viscous orange oil sheen envelope
        ctx.strokeStyle = `rgba(249, 115, 22, ${0.8 - cp * 0.3})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.ellipse(0, 0, 14 * (1 - cp * 0.2), 6.5 * (1 - cp * 0.15), 0, 0, Math.PI * 2);
        ctx.stroke();
      }

    } else if (batch.type === 'press_cake') {
      // 4. Extruded Solid Fibrous Press Cake & Nut Shells
      ctx.fillStyle = 'rgba(146, 92, 45, 0.9)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 12, 16, 0.15, 0, Math.PI * 2);
      ctx.fill();

      // Fiber texture lines
      ctx.strokeStyle = '#5a3416';
      ctx.lineWidth = 1.1;
      for (let f = -8; f <= 8; f += 4) {
        ctx.beginPath();
        ctx.moveTo(f, -10);
        ctx.lineTo(f + 2, 10);
        ctx.stroke();
      }

      // Cracked nut shells
      ctx.fillStyle = '#24140a';
      ctx.beginPath();
      ctx.arc(-3, -2, 3.2, 0, Math.PI * 2);
      ctx.arc(4, 3, 2.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /* --------------------------------------------------------------------------
     PHYSICAL FLUID TRANSFER STREAMS
     Drawn strictly when material causes liquid to move between units.
     -------------------------------------------------------------------------- */
  function drawFluidStreams(layout, t) {
    const { s4, s5, s6, isMobile } = layout;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 1. Crude Slurry Stream from Press to Clarifier (t = 26.5 - 30.5)
    if (t >= 26.5) {
      const flowProgress = clamp((t - 26.5) / 1.6, 0, 1);
      const pipeAlpha = clamp((t - 26.5) / 0.6, 0, 1) * (t > 30.0 ? 0.35 : 0.85);

      if (pipeAlpha > 0.05) {
        const pStart = isMobile
          ? { x: s4.x, y: s4.y + 60 }
          : { x: s4.x + s4.w / 2 - 20, y: 640 };
        const pEnd = isMobile
          ? { x: s5.x, y: s5.y - 80 }
          : { x: s5.x - s5.w / 2 + 20, y: 640 };

        const currentX = lerp(pStart.x, pEnd.x, flowProgress);
        const currentY = lerp(pStart.y, pEnd.y, flowProgress);

        // Slurry fluid core inside the pipe
        ctx.strokeStyle = `rgba(217, 85, 24, ${pipeAlpha})`;
        ctx.lineWidth = 3.8;
        ctx.beginPath();
        ctx.moveTo(pStart.x, pStart.y);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        // Inner glowing core
        ctx.strokeStyle = `rgba(255, 140, 50, ${pipeAlpha * 0.9})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }
    }

    // 2. Clarified Pure Golden CPO Stream from Clarifier Weir to Storage Tank (t >= 30.0)
    if (t >= 30.0) {
      const flowProgress = clamp((t - 30.0) / 1.5, 0, 1);
      const pipeAlpha = clamp((t - 30.0) / 0.5, 0, 1);

      if (pipeAlpha > 0.05) {
        const weirX = s5.x + s5.w / 2 - 25;
        const weirY = s5.y - 70;
        const tankTopX = s6.x - s6.w / 2 + 25;
        const tankTopY = s6.y - 15;

        if (isMobile) {
          const mStart = { x: s5.x, y: s5.y + 80 };
          const mEnd = { x: s6.x, y: s6.y - 55 };
          ctx.strokeStyle = `rgba(251, 191, 36, ${pipeAlpha * 0.95})`;
          ctx.lineWidth = 3.6;
          ctx.beginPath();
          ctx.moveTo(mStart.x, mStart.y);
          ctx.lineTo(lerp(mStart.x, mEnd.x, flowProgress), lerp(mStart.y, mEnd.y, flowProgress));
          ctx.stroke();
        } else {
          // Horizontal run across top, then vertical drop into tank
          const cornerX = tankTopX;
          const cornerY = weirY;

          ctx.strokeStyle = `rgba(245, 158, 11, ${pipeAlpha * 0.95})`;
          ctx.lineWidth = 3.8;
          ctx.beginPath();
          ctx.moveTo(weirX, weirY);

          if (flowProgress < 0.65) {
            const hProg = flowProgress / 0.65;
            ctx.lineTo(lerp(weirX, cornerX, hProg), cornerY);
          } else {
            const vProg = (flowProgress - 0.65) / 0.35;
            ctx.lineTo(cornerX, cornerY);
            ctx.lineTo(cornerX, lerp(cornerY, tankTopY, vProg));
          }
          ctx.stroke();

          // Inner gold luminescence
          ctx.strokeStyle = `rgba(254, 240, 138, ${pipeAlpha * 0.85})`;
          ctx.lineWidth = 1.6;
          ctx.stroke();

          // Pouring discharge stream into storage receiver (t >= 31.5)
          if (t >= 31.5 && !isReducedMotion) {
            const currentFill = clamp((t - 31.5) / 2.3, 0, 0.75);
            const tankHalfH = s6.h / 2 - 20;
            const surfaceGlobalY = s6.y + tankHalfH - (tankHalfH * 2 - 2) * currentFill;

            ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(cornerX, tankTopY);
            ctx.lineTo(cornerX, surfaceGlobalY);
            ctx.stroke();

            const pourY = tankTopY + ((Date.now() * 0.08) % Math.max(10, surfaceGlobalY - tankTopY));
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.arc(cornerX, pourY, 2.0, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    ctx.restore();
  }

  /* --------------------------------------------------------------------------
     PHYSICAL CONNECTING INFRASTRUCTURE (DORMANT PIPES & SUPPORTS)
     Steel guide rails, transfer chutes, and empty piping housings.
     -------------------------------------------------------------------------- */
  function drawPhysicalInfrastructure(layout) {
    const { s1, s2, s3, s4, s5, s6, isMobile } = layout;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1.4;

    if (isMobile) {
      // Mobile vertical guides
      ctx.beginPath();
      ctx.moveTo(s1.x, s1.y + 40); ctx.lineTo(s2.x, s2.y - 40);
      // s2 to s3 conveyor handled by drawWeighbridgeToSterilizerConveyor
      // s3 to s4 conveyor handled by drawSterilizerToPressConveyor
      ctx.moveTo(s4.x, s4.y + 60); ctx.lineTo(s5.x, s5.y - 80);
      ctx.moveTo(s5.x, s5.y + 80); ctx.lineTo(s6.x, s6.y - 55);
      ctx.stroke();
    } else {
      // S1 to S2 lower ground guide track
      ctx.beginPath();
      ctx.moveTo(s1.x + 36, s1.y + 28);
      ctx.lineTo(s2.x - 64, s2.y + 28);
      ctx.stroke();

      // S2 to S3 conveyor handled by drawWeighbridgeToSterilizerConveyor
      // S3 to S4 flight conveyor handled by drawSterilizerToPressConveyor

      // S4 to S5 crude slurry pipe housing (horizontal level pipe run at y = 640)
      const s4PipeStartX = s4.x + s4.w / 2 - 20;
      const s5PipeEndX = s5.x - s5.w / 2 + 20;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.lineWidth = 4.8;
      ctx.beginPath();
      ctx.moveTo(s4PipeStartX, 640);
      ctx.lineTo(s5PipeEndX, 640);
      ctx.stroke();

      // Pipe support floor stanchion midway
      const midPipeX = (s4PipeStartX + s5PipeEndX) * 0.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(midPipeX, 640);
      ctx.lineTo(midPipeX, 665);
      ctx.stroke();
      ctx.fillRect(midPipeX - 4, 663, 8, 3);

      // S5 to S6 overhead CPO delivery pipe housing
      ctx.beginPath();
      ctx.moveTo(s5.x + s5.w / 2 - 25, s5.y - 70);
      ctx.lineTo(s6.x - s6.w / 2 + 25, s5.y - 70);
      ctx.lineTo(s6.x - s6.w / 2 + 25, s6.y - 15);
      ctx.stroke();
    }

    ctx.restore();
  }

  /* --------------------------------------------------------------------------
     WEIGHBRIDGE-TO-STERILIZER CONVEYOR (TRAVELATOR)
     Visible structural 2D conveyor conveying weighed bunches from weighbridge
     flush into the horizontal autoclave front vessel mouth.
     -------------------------------------------------------------------------- */
  function drawWeighbridgeToSterilizerConveyor(layout, t) {
    const { s2, s3, isMobile } = layout;
    const isConveying = t >= 9.0 && t <= 12.8 && !isReducedMotion;

    let speedFactor = 0;
    if (t >= 9.0 && t <= 12.8) {
      const p = (t - 9.0) / 3.8;
      if (p < 0.2) speedFactor = p / 0.2;
      else if (p > 0.8) speedFactor = (1 - p) / 0.2;
      else speedFactor = 1.0;
    }
    const slatOffset = isConveying ? (weighbridgeConveyorOffset % 16) : 0;

    ctx.save();

    if (isMobile) {
      const topY = s2.y + 35;
      const botY = s3.y - 65;
      const cx = s2.x;

      // Twin side stringers
      ctx.strokeStyle = speedFactor > 0.05 ? `rgba(255, 170, 112, ${0.35 + 0.5 * speedFactor})` : 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(cx - 16, topY);
      ctx.lineTo(cx - 16, botY);
      ctx.moveTo(cx + 16, topY);
      ctx.lineTo(cx + 16, botY);
      ctx.stroke();

      // Drive sprockets
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.strokeRect(cx - 18, topY - 4, 36, 6);
      ctx.strokeRect(cx - 18, botY - 2, 36, 6);

      // Moving cross slats
      ctx.strokeStyle = speedFactor > 0.05 ? '#ffaa70' : 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1.5;
      for (let y = topY + (slatOffset % 16); y < botY; y += 16) {
        ctx.beginPath();
        ctx.moveTo(cx - 14, y);
        ctx.lineTo(cx + 14, y);
        ctx.stroke();
      }
    } else {
      // Desktop horizontal structural conveyor: runs from right scale isolation abutment to sterilizer front mouth
      const startX = s2.x + 64; // 12px clear isolation gap from scale deck edge (s2.x + 52)
      const endX = s3.x - (s3.w / 2 - 25); // Meets front entrance flange lip of autoclave
      const deckY = s2.y + 14;

      // 1. Upper and lower stringer channels
      ctx.strokeStyle = speedFactor > 0.05 ? `rgba(255, 170, 112, ${0.35 + 0.5 * speedFactor})` : 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2.0;

      ctx.beginPath();
      ctx.moveTo(startX, deckY);
      ctx.lineTo(endX, deckY);
      ctx.moveTo(startX, deckY + 12);
      ctx.lineTo(endX, deckY + 12);
      ctx.stroke();

      // 2. Vertical stanchion legs / foundation supports
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.6;
      for (let legX = startX + 35; legX < endX - 20; legX += 60) {
        ctx.beginPath();
        ctx.moveTo(legX, deckY + 12);
        ctx.lineTo(legX, deckY + 36);
        ctx.stroke();
        // Foot pad
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fillRect(legX - 4, deckY + 34, 8, 3);
      }

      // 3. Sprockets at head and tail (tail sprocket recessed inside frame, clear of scale deck)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(startX + 8, deckY + 6, 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(endX - 8, deckY + 6, 6, 0, Math.PI * 2);
      ctx.stroke();

      // 4. Moving conveyor slats / cleats
      ctx.strokeStyle = speedFactor > 0.05 ? '#ffaa70' : 'rgba(255, 255, 255, 0.32)';
      ctx.lineWidth = 1.6;
      for (let sx = startX + 4 + slatOffset; sx < endX - 4; sx += 16) {
        ctx.beginPath();
        ctx.moveTo(sx, deckY - 1);
        ctx.lineTo(sx, deckY + 13);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  /* --------------------------------------------------------------------------
     STERILIZER-TO-SCREW-PRESS FLIGHT CONVEYOR (TRAVELATOR)
     Structural steel 2D flight conveyor carrying cooked bunches from the
     autoclave rear discharge chute directly into the press feed hopper.
     Smoothed with C1 continuous velocity ramp.
     -------------------------------------------------------------------------- */
  function drawSterilizerToPressConveyor(layout, t) {
    const { s3, s4, isMobile } = layout;
    const isConveying = t >= 18.2 && t <= 22.0 && !isReducedMotion;

    let flightSpeedFactor = 0;
    if (t >= 18.2 && t <= 22.0) {
      const p = (t - 18.2) / 3.8;
      if (p < 0.2) flightSpeedFactor = p / 0.2;
      else if (p > 0.8) flightSpeedFactor = (1 - p) / 0.2;
      else flightSpeedFactor = 1.0;
    }
    const flightOffset = isConveying ? (sterilizerConveyorOffset % 24) : 0;

    ctx.save();

    if (isMobile) {
      const topY = s3.y + 52;
      const botY = s4.y - 44;
      const cx = s3.x;

      // Vertical flight conveyor truss stringers
      ctx.strokeStyle = flightSpeedFactor > 0.05 ? `rgba(255, 170, 112, ${0.35 + 0.5 * flightSpeedFactor})` : 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 2.0;

      // Left and right side guides
      ctx.beginPath();
      ctx.moveTo(cx - 18, topY);
      ctx.lineTo(cx - 18, botY);
      ctx.moveTo(cx + 18, topY);
      ctx.lineTo(cx + 18, botY);
      ctx.stroke();

      // Top and bottom sprockets / rollers
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.strokeRect(cx - 20, topY - 6, 40, 8);
      ctx.strokeRect(cx - 20, botY - 2, 40, 8);

      // Moving cross-flights (cleats)
      ctx.strokeStyle = flightSpeedFactor > 0.05 ? '#ffaa70' : 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.6;
      for (let y = topY + (flightOffset % 22); y < botY; y += 22) {
        ctx.beginPath();
        ctx.moveTo(cx - 16, y);
        ctx.lineTo(cx + 16, y);
        ctx.stroke();
      }
    } else {
      // Desktop Overhead External Gantry:
      // Routes from sterilizer rear exit -> drops to overhead gantry level (y = 440) ->
      // runs horizontally across mill safely above Clarifier (roof at y = 480) ->
      // drops vertically into press hopper lip. Zero penetration through machines!
      const pCornerX = s3.x + s3.w / 2 + 35;
      const gantryY = 440;
      const gantryUpperY = 434;
      const gantryLowerY = 446;
      const hopperX = s4.x - s4.w * 0.36;
      const hopperLipY = s4.y - 44;
      const rearExitX = s3.x + s3.w / 2 + 10;
      const rearExitY = s3.y + 10;

      // 1. Rear inclined transfer chute: from rear discharge boot to gantry corner
      ctx.strokeStyle = flightSpeedFactor > 0.05 ? `rgba(255, 170, 112, ${0.4 + 0.5 * flightSpeedFactor})` : 'rgba(255, 255, 255, 0.28)';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      // Upper rail
      ctx.moveTo(rearExitX, rearExitY);
      ctx.lineTo(pCornerX - 4, gantryUpperY);
      // Lower rail
      ctx.moveTo(rearExitX, rearExitY + 12);
      ctx.lineTo(pCornerX - 4, gantryLowerY);
      ctx.stroke();

      // Corner turn sprocket & housing at (pCornerX, gantryY)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(pCornerX, gantryY, 7, 0, Math.PI * 2);
      ctx.stroke();

      // 2. Overhead Horizontal Truss Gantry (spanning across mill above Clarifier from pCornerX to hopperX)
      // Note: runs leftward from pCornerX to hopperX
      ctx.strokeStyle = flightSpeedFactor > 0.05 ? `rgba(255, 170, 112, ${0.4 + 0.5 * flightSpeedFactor})` : 'rgba(255, 255, 255, 0.28)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      // Upper chord
      ctx.moveTo(pCornerX, gantryUpperY);
      ctx.lineTo(hopperX, gantryUpperY);
      // Lower chord
      ctx.moveTo(pCornerX, gantryLowerY);
      ctx.lineTo(hopperX, gantryLowerY);
      ctx.stroke();

      // Structural truss cross-lattice diagonals every 24px
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.0;
      for (let tx = hopperX; tx < pCornerX; tx += 24) {
        ctx.beginPath();
        ctx.moveTo(tx, gantryUpperY);
        ctx.lineTo(Math.min(pCornerX, tx + 24), gantryLowerY);
        ctx.moveTo(tx, gantryLowerY);
        ctx.lineTo(Math.min(pCornerX, tx + 24), gantryUpperY);
        ctx.stroke();
      }

      // Overhead building support columns / hanger stanchions
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.lineWidth = 1.4;
      [hopperX + 80, hopperX + 320, pCornerX - 80].forEach(sx => {
        ctx.beginPath();
        ctx.moveTo(sx, gantryLowerY);
        ctx.lineTo(sx, gantryLowerY + 36);
        ctx.stroke();
        ctx.fillRect(sx - 3, gantryLowerY + 34, 6, 2);
      });

      // 3. Drop Head Drive Drum & Vertical Drop Chute into Press Feed Hopper
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(hopperX, gantryY, 7, 0, Math.PI * 2);
      ctx.stroke();

      // Enclosed vertical gravity drop chute into press hopper mouth
      ctx.strokeStyle = flightSpeedFactor > 0.05 ? 'rgba(255, 170, 112, 0.7)' : 'rgba(255, 255, 255, 0.32)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      // Left chute wall
      ctx.moveTo(hopperX - 12, gantryLowerY);
      ctx.lineTo(hopperX - 12, hopperLipY);
      // Right chute wall
      ctx.moveTo(hopperX + 12, gantryLowerY);
      ctx.lineTo(hopperX + 12, hopperLipY);
      ctx.stroke();

      // Chute flange collar at press hopper mouth
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.strokeRect(hopperX - 16, hopperLipY - 4, 32, 4);

      // 4. Moving Scraper Flights (Cleats) along the horizontal gantry
      ctx.strokeStyle = flightSpeedFactor > 0.05 ? '#ffaa70' : 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 2.0;

      // Moving cleats on horizontal run (traveling left from pCornerX to hopperX)
      for (let fx = pCornerX - 16 - (flightOffset % 24); fx > hopperX + 8; fx -= 24) {
        ctx.beginPath();
        ctx.moveTo(fx, gantryUpperY - 1);
        ctx.lineTo(fx, gantryLowerY + 1);
        ctx.stroke();
      }

      // Moving cleats in vertical drop chute during active flow
      if (flightSpeedFactor > 0.05) {
        for (let fy = gantryLowerY + 8 + ((flightOffset * 1.5) % 20); fy < hopperLipY - 6; fy += 20) {
          ctx.beginPath();
          ctx.moveTo(hopperX - 10, fy);
          ctx.lineTo(hopperX + 10, fy);
          ctx.stroke();
        }
      }
    }

    ctx.restore();
  }

  /* --------------------------------------------------------------------------
     STAGE 01: FFB INTAKE (TRUE 2D SIDE-VIEW CART ON RAILS + PRE-DISCHARGE GATE)
     Solidly grounded on steel rails; single damped recoil upon gate release.
     Continuous slat conveyor spans unbroken into Stage 02 weighbridge deck.
     -------------------------------------------------------------------------- */
  function drawStage01_FFB(center, t, isHovered) {
    const { x, y } = center;
    const prominence = getStageProminence(1, t);

    // Damped physical recoil upon gate release (t = 1.2 - 2.2s); cart is solidly grounded otherwise
    let cartRecoil = 0;
    if (t >= 1.2 && t <= 2.2) {
      const dt = t - 1.2;
      cartRecoil = Math.sin(dt * Math.PI / 0.8) * -0.7 * Math.exp(-dt * 2.5);
    }

    // Cart pre-discharge gate mechanics:
    // t < 1.2: Cart securely latched upright
    // t = 1.2 - 2.0: Gate unlatches and hinges downward into chute position (-66 deg)
    // t >= 2.0: Gate fully locked open as angled slide chute
    let gateAngle = 0; // 0 = closed upright
    let unlatchOffset = 0;
    if (t >= 1.2 && t < 2.0) {
      const u = (t - 1.2) / 0.8;
      gateAngle = lerp(0, 1.20, easeInOutCubic(u)); // Swings outward (+ clockwise) forming angled discharge chute
      unlatchOffset = u * 8;
    } else if (t >= 2.0) {
      gateAngle = 1.20;
      unlatchOffset = 8;
    }

    // Continuous slat apron conveyor between S1 cart and S2 weighbridge:
    // Moves actively while fruit discharges and conveys (t = 2.0 - 5.4)
    const isConveying = t >= 2.0 && t <= 5.4 && !isReducedMotion;
    const slatOffset = isConveying ? ((t - 2.0) * 44) % 12 : 0;

    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = Math.max(prominence, isHovered ? 0.95 : 0.25);

    // 1. Steel Ground Track Rails (Cart rests solidly on these rails)
    const railY = 28;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(-75, railY);
    ctx.lineTo(40, railY);
    ctx.stroke();

    // Rail sleepers (ties) underneath track
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1.6;
    [-65, -45, -25, -5, 15, 35].forEach(sx => {
      ctx.beginPath();
      ctx.moveTo(sx, railY);
      ctx.lineTo(sx, railY + 7);
      ctx.stroke();
    });

    // 2. Visible Wheels Underneath Cart (Firmly grounded on rail with zero artificial floating)
    const wheelY = railY - 9; // Wheel center at y = 19, bottom edge resting on rail at y = 28
    const wheelPositions = [-28, 16];

    wheelPositions.forEach(wx => {
      // Axle bracket connecting chassis to wheel
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(wx, 8 + cartRecoil);
      ctx.lineTo(wx, wheelY);
      ctx.stroke();

      // Outer flanged wheel rim
      ctx.strokeStyle = prominence > 0.6 ? '#ffaa70' : 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(wx, wheelY, 9, 0, Math.PI * 2);
      ctx.stroke();

      // Inner tread rim
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.arc(wx, wheelY, 6.5, 0, Math.PI * 2);
      ctx.stroke();

      // Center wheel hub & axle pin
      ctx.fillStyle = '#ffaa70';
      ctx.beginPath();
      ctx.arc(wx, wheelY, 2.8, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Cart Structural Chassis & Suspension Leaf Bracket
    ctx.strokeStyle = prominence > 0.6 ? 'rgba(255, 170, 112, 0.95)' : 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-50, 8 + cartRecoil);
    ctx.lineTo(30, 8 + cartRecoil);
    ctx.stroke();

    // Rear drawbar / hitch coupling pin
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(-50, 8 + cartRecoil);
    ctx.lineTo(-58, 8 + cartRecoil);
    ctx.strokeRect(-62, 5 + cartRecoil, 5, 6);

    // 4. Cart Tub Body (2D Side-View Heavy Steel Tipper Tub)
    ctx.fillStyle = 'rgba(20, 24, 34, 0.92)';
    ctx.strokeStyle = prominence > 0.6 ? '#ffaa70' : 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.8;

    ctx.beginPath();
    ctx.moveTo(-45, 6 + cartRecoil);  // bottom-left
    ctx.lineTo(-54, -22 + cartRecoil); // top-left (slanted back wall)
    ctx.lineTo(22, -22 + cartRecoil);  // top rim
    ctx.lineTo(26, 6 + cartRecoil);   // bottom-right
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Side stiffener ribs on cart tub
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.2;
    [-24, -2].forEach(rx => {
      ctx.beginPath();
      ctx.moveTo(rx - 3, -22 + cartRecoil);
      ctx.lineTo(rx, 6 + cartRecoil);
      ctx.stroke();
    });

    // 5. Front Pre-Discharge Gate & Unlatch Linkage
    // Hinge pivot at front bottom corner (26, 6 + cartRecoil)
    ctx.save();
    ctx.translate(26, 6 + cartRecoil);
    ctx.rotate(gateAngle);

    // Discharge gate flap (swings outward into slide chute down to x = 52, y = -4)
    ctx.strokeStyle = '#ffaa70';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -28);
    ctx.stroke();

    // Gate lip flange
    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.lineTo(5, -28);
    ctx.stroke();

    // Hinge pin
    ctx.fillStyle = '#ffaa70';
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // External mechanical unlatch lever mounted on cart tub front-right wall
    // Lever unlatches and pivots outward to release dog-latch catch
    ctx.save();
    ctx.translate(24, -12 + cartRecoil);
    const leverAngle = (unlatchOffset / 8) * 0.45;
    ctx.rotate(leverAngle);
    ctx.strokeStyle = 'rgba(255, 170, 112, 0.85)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(12, -8);
    ctx.stroke();
    // Lever pivot bracket and handle knob
    ctx.fillStyle = '#ffaa70';
    ctx.beginPath();
    ctx.arc(0, 0, 2.0, 0, Math.PI * 2);
    ctx.arc(12, -8, 2.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 6. Slat Apron Conveyor Bed Leading to Weighbridge Isolation Abutment
    // Spans from cart chute exit (x = 48) to scale isolation gap (x = 151 = s2.x - 64)
    const slatStartX = 48;
    const slatEndX = 151;
    const slatDeckY = 18;

    // Upper channel and lower return guide
    ctx.strokeStyle = isConveying ? 'rgba(255, 170, 112, 0.7)' : 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(slatStartX, slatDeckY);
    ctx.lineTo(slatEndX, slatDeckY);
    ctx.moveTo(slatStartX, slatDeckY + 7);
    ctx.lineTo(slatEndX, slatDeckY + 7);
    ctx.stroke();

    // Conveyor head and tail rollers (tail at cart chute, head roller frame with scale clearance)
    ctx.strokeRect(slatStartX - 2, slatDeckY - 2, 5, 11);
    ctx.strokeRect(slatEndX - 5, slatDeckY - 2, 5, 11);

    // Intermediate foundation stanchions supporting conveyor frame
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1.4;
    [80, 120].forEach(sx => {
      ctx.beginPath();
      ctx.moveTo(sx, slatDeckY + 7);
      ctx.lineTo(sx, railY);
      ctx.stroke();
    });

    // Moving slats (cleats) across span
    ctx.strokeStyle = isConveying ? '#ffaa70' : 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.4;
    for (let lx = slatStartX + 4 + slatOffset; lx < slatEndX - 4; lx += 12) {
      ctx.beginPath();
      ctx.moveTo(lx, slatDeckY - 2);
      ctx.lineTo(lx, slatDeckY + 8);
      ctx.stroke();
    }

    // Minimal Technical Label
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = prominence > 0.6 ? '#ffaa70' : 'rgba(255, 255, 255, 0.55)';
    ctx.textAlign = 'center';
    ctx.fillText('01 FFB CART & INTAKE', 0, 48);

    ctx.restore();
  }

  /* --------------------------------------------------------------------------
     STAGE 02: WEIGHBRIDGE (PHYSICAL SCALE WITH QUALITATIVE DIAL & LOAD LED)
     Directly coupled to batch position: settles under arrival mass, holds stable,
     and returns smoothly to zero only when mass departs across deck.
     -------------------------------------------------------------------------- */
  function drawStage02_Weighbridge(center, t, isHovered, batch) {
    const { x, y } = center;
    const prominence = getStageProminence(2, t);

    // Position-coupled weighing dynamics:
    // Scale responds strictly to the mass of the batch while physically supported on deck
    let weightFraction = 0;
    if (batch && batch.visible && batch.type === 'raw_ffb') {
      if (t >= 5.4 && batch.x <= x + 5) {
        const uArrive = clamp((t - 5.4) / 0.6, 0, 1);
        const springDamp = Math.sin(uArrive * Math.PI * 2.5) * Math.exp(-uArrive * 4.0) * 0.15;
        weightFraction = clamp(easeOutQuad(uArrive) + springDamp, 0, 1);
      } else if (batch.x > x + 5 && batch.x < x + 60) {
        weightFraction = clamp(1 - (batch.x - (x + 5)) / 50, 0, 1);
      }
    }
    const isLoaded = weightFraction > 0.35;
    const deckOffset = 2.4 * weightFraction;

    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = Math.max(prominence, isHovered ? 0.95 : 0.25);

    // Scale pit foundation abutments & 12px mechanical isolation clearance gaps
    // Left approach conveyor ends at -64; right outgoing conveyor begins at +64
    const deckLeft = -52;
    const deckRight = 52;

    // Concrete scale pit walls and abutments
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    // Left pit wall & cantilevered approach shelf
    ctx.moveTo(-74, 18);
    ctx.lineTo(-64, 18);
    ctx.lineTo(-64, 30);
    // Pit floor
    ctx.lineTo(64, 30);
    // Right pit wall & discharge shelf
    ctx.lineTo(64, 18);
    ctx.lineTo(74, 18);
    ctx.stroke();

    // Cantilevered transition plates maintaining 4px air gap to floating deck
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-64, 15);
    ctx.lineTo(-56, 15); // Clear 4px air gap to deckLeft (-52)
    ctx.moveTo(64, 15);
    ctx.lineTo(56, 15);  // Clear 4px air gap to deckRight (+52)
    ctx.stroke();

    // Floating structural I-beam weighbridge deck (mechanically isolated, depresses under load)
    ctx.strokeStyle = prominence > 0.6 ? 'rgba(255, 170, 112, 0.95)' : 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(deckLeft, 14 + deckOffset);
    ctx.lineTo(deckRight, 14 + deckOffset);
    // Lower I-beam flange
    ctx.moveTo(deckLeft, 18 + deckOffset);
    ctx.lineTo(deckRight, 18 + deckOffset);
    ctx.stroke();

    // Diamond-plate surface traction ridges
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    for (let hx = deckLeft + 6; hx <= deckRight - 6; hx += 10) {
      ctx.beginPath();
      ctx.moveTo(hx, 14 + deckOffset);
      ctx.lineTo(hx + 4, 18 + deckOffset);
      ctx.stroke();
    }

    // High-precision shear-beam load-cell pillars (resting on pit floor below deck)
    [-38, 0, 38].forEach(px => {
      // Load cell body
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(px - 5, 20, 10, 10);

      // Active strain-gauge transducer element
      ctx.fillStyle = isLoaded ? 'rgba(34, 197, 94, 0.85)' : 'rgba(255, 107, 53, 0.45)';
      ctx.fillRect(px - 3, 23, 6, 4);

      // Upper loading pin transmitting force from floating deck to load cell
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px, 18 + deckOffset);
      ctx.lineTo(px, 20);
      ctx.stroke();
    });

    // Qualitative Industrial Weighing Scale Dial
    ctx.fillStyle = 'rgba(12, 16, 24, 0.92)';
    ctx.strokeStyle = prominence > 0.6 ? 'rgba(255, 170, 112, 0.6)' : 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, -18, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Dial scale graduations
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 16, -18 + Math.sin(a) * 16);
      ctx.lineTo(Math.cos(a) * 20, -18 + Math.sin(a) * 20);
      ctx.stroke();
    }

    // Green operating load sector arc
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.65)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, -18, 18, -Math.PI * 0.2, Math.PI * 0.6);
    ctx.stroke();

    // Dial Needle: Coupled directly to weightFraction (rests at -1.8, swings to 0.85 in green arc under load)
    let needleAngle = -1.8;
    if (weightFraction > 0.001) {
      needleAngle = lerp(-1.8, 0.85, weightFraction);
    }

    ctx.strokeStyle = isLoaded ? '#22c55e' : '#ff6b35';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(Math.cos(needleAngle) * 17, -18 + Math.sin(needleAngle) * 17);
    ctx.stroke();

    // Center pivot dot
    ctx.fillStyle = '#ffaa70';
    ctx.beginPath();
    ctx.arc(0, -18, 3, 0, Math.PI * 2);
    ctx.fill();

    // Active load indicator LED (Illuminates green strictly under load)
    ctx.fillStyle = isLoaded ? '#22c55e' : '#475569';
    ctx.beginPath();
    ctx.arc(38, -18, 3.5, 0, Math.PI * 2);
    ctx.fill();

    if (isLoaded) {
      ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
      ctx.beginPath();
      ctx.arc(38, -18, 7, 0, Math.PI * 2);
      ctx.fill();
    }

    // Minimal Technical Label
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = prominence > 0.6 ? '#ffaa70' : 'rgba(255, 255, 255, 0.55)';
    ctx.textAlign = 'center';
    ctx.fillText('02 WEIGHBRIDGE', 0, 48);

    ctx.restore();
  }

  /* --------------------------------------------------------------------------
     STAGE 03: STERILIZER AUTOCLAVE (MASSIVE HORIZONTAL VESSEL WITH WORKING DOOR)
     Front loading door opens for entry and locks permanently shut during steam cycle;
     rapid decompression blowdown vents steam; rear chute discharges cooked material.
     -------------------------------------------------------------------------- */
  function drawStage03_Sterilizer(center, t, isHovered) {
    const { x, y, w, h } = center;
    const prominence = getStageProminence(3, t);

    // Active steam cycle: pressurized only while sealed (t = 13.8 - 16.8)
    const isSteaming = t >= 13.8 && t <= 16.8;

    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = Math.max(prominence, isHovered ? 0.95 : 0.25);

    const halfW = w / 2 - 10;
    const halfH = h / 2 - 18;

    // Outer pressure shell silhouette
    ctx.strokeStyle = prominence > 0.6 ? 'rgba(255, 170, 112, 0.95)' : 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2.0;

    // Main vessel body with hemispherical rear dome
    ctx.fillStyle = 'rgba(16, 20, 30, 0.94)';
    ctx.beginPath();
    ctx.moveTo(-halfW + 30, -halfH);
    ctx.lineTo(halfW - 30, -halfH);
    ctx.quadraticCurveTo(halfW + 14, 0, halfW - 30, halfH);
    ctx.lineTo(-halfW + 30, halfH);
    ctx.quadraticCurveTo(-halfW - 14, 0, -halfW + 30, -halfH);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Heavy bolted flange rings
    const flangePositions = [-halfW * 0.6, -halfW * 0.2, halfW * 0.2, halfW * 0.6];
    flangePositions.forEach(fx => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(fx, -halfH);
      ctx.lineTo(fx, halfH);
      ctx.stroke();

      for (let by = -halfH + 8; by <= halfH - 8; by += 16) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(fx - 2, by - 2, 4, 4);
      }
    });

    // Massive structural foundation saddle cradles
    [-halfW + 65, halfW - 65].forEach(sx => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(sx - 20, halfH);
      ctx.lineTo(sx - 28, halfH + 26);
      ctx.lineTo(sx + 28, halfH + 26);
      ctx.lineTo(sx + 20, halfH);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 170, 112, 0.5)';
      ctx.fillRect(sx - 22, halfH + 22, 5, 4);
      ctx.fillRect(sx + 17, halfH + 22, 5, 4);
    });

    // Top Saturated Steam Manifold Supply Pipe
    ctx.strokeStyle = isSteaming ? '#ffaa70' : 'rgba(255, 170, 112, 0.5)';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(-50, -halfH - 26);
    ctx.lineTo(-50, -halfH);
    ctx.stroke();

    // Safety relief valve
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(-56, -halfH - 28, 12, 6);

    // Qualitative Bourdon Tube Pressure Gauge
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.4;
    ctx.fillStyle = 'rgba(12, 16, 24, 0.95)';
    ctx.beginPath();
    ctx.arc(35, -halfH - 18, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Operating arc band (amber)
    ctx.strokeStyle = 'rgba(255, 107, 53, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(35, -halfH - 18, 10, -Math.PI * 0.4, Math.PI * 0.3);
    ctx.stroke();

    // Pressure Needle: Deflects into amber arc during steam cycle; drops rapidly during blowdown
    let needleAngle = -1.8;
    if (t >= 13.8 && t < 16.8) {
      needleAngle = -0.3 + Math.sin(Date.now() * 0.005) * 0.08;
    } else if (t >= 16.8 && t <= 17.2) {
      needleAngle = lerp(-0.3, -1.8, (t - 16.8) / 0.4);
    }

    ctx.strokeStyle = isSteaming ? '#ff6b35' : 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(35, -halfH - 18);
    ctx.lineTo(35 + Math.cos(needleAngle) * 9, -halfH - 18 + Math.sin(needleAngle) * 9);
    ctx.stroke();

    // Top Rapid Blowdown Exhaust Silencer Stack (at x = halfW * 0.35, y = -halfH - 26)
    const blowdownX = halfW * 0.35;
    const blowdownY = -halfH - 26;
    ctx.strokeStyle = (t >= 16.8 && t <= 17.4) ? '#ffaa70' : 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(blowdownX, -halfH);
    ctx.lineTo(blowdownX, blowdownY);
    ctx.stroke();

    // Silencer diffuser nozzle atop stack
    ctx.strokeRect(blowdownX - 6, blowdownY - 4, 12, 5);

    // Rapid Blowdown Steam Exhaust Plume (t = 16.8 - 17.4)
    if (t >= 16.8 && t <= 17.4 && !isReducedMotion) {
      const blowProgress = (t - 16.8) / 0.6;
      const blowAlpha = Math.sin(blowProgress * Math.PI) * 0.55;
      const blowGrad = ctx.createRadialGradient(blowdownX + blowProgress * 15, blowdownY - blowProgress * 20, 2, blowdownX + blowProgress * 15, blowdownY - blowProgress * 20, 18 + blowProgress * 25);
      blowGrad.addColorStop(0, `rgba(242, 246, 255, ${blowAlpha})`);
      blowGrad.addColorStop(1, 'rgba(240, 245, 255, 0)');
      ctx.fillStyle = blowGrad;
      ctx.beginPath();
      ctx.arc(blowdownX + blowProgress * 15, blowdownY - blowProgress * 20, 18 + blowProgress * 25, 0, Math.PI * 2);
      ctx.fill();
    }

    // Atmospheric Steam Relief Plumes (Billow ONLY during active steaming)
    if (isSteaming && !isReducedMotion) {
      steamParticles.forEach(p => {
        p.life += p.lifeSpeed;
        if (p.life > 1) {
          p.life = 0;
          p.x = -50 + (Math.random() - 0.5) * 8;
          p.y = -halfH - 26;
          p.size = 5 + Math.random() * 8;
        }

        p.x += p.vx;
        p.y += p.vy;
        const currentSize = lerp(p.size, p.maxSize, p.life);
        const currentAlpha = Math.sin(p.life * Math.PI) * 0.32;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentSize);
        grad.addColorStop(0, `rgba(242, 246, 255, ${currentAlpha})`);
        grad.addColorStop(1, 'rgba(240, 245, 255, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Heavy Front Loading Pressure Door (Pivots open for material entry, clamps sealed thereafter)
    const doorHingeX = -halfW + 18;
    const doorHingeY = -halfH + 6;
    let frontDoorAngle = 0;
    if (t < 12.8) {
      frontDoorAngle = -1.15; // Swung open outward to receive fruit
    } else if (t < 13.8) {
      frontDoorAngle = lerp(-1.15, 0, (t - 12.8) / 1.0); // Sealing shut
    } else {
      frontDoorAngle = 0; // Firmly sealed and locked shut for remainder of cycle
    }

    // Heavy forged steel davit arm & hinge bracket anchoring door hinge to vessel shell
    ctx.strokeStyle = prominence > 0.6 ? 'rgba(255, 170, 112, 0.95)' : 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-halfW + 36, -halfH);
    ctx.lineTo(-halfW + 24, -halfH - 8);
    ctx.lineTo(doorHingeX, doorHingeY);
    ctx.stroke();

    // Hinge mounting base flange & reinforcement gusset
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(-halfW + 28, -halfH - 2, 10, 4);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-halfW + 34, -halfH);
    ctx.lineTo(doorHingeX + 2, doorHingeY);
    ctx.stroke();

    ctx.save();
    ctx.translate(doorHingeX, doorHingeY);
    ctx.rotate(frontDoorAngle);

    ctx.strokeStyle = '#ffaa70';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, halfH * 2 - 12);
    ctx.stroke();

    // Heavy door locking lugs
    if (frontDoorAngle === 0) {
      ctx.fillStyle = '#ffffff';
      [12, halfH - 6, halfH * 2 - 24].forEach(ly => {
        ctx.fillRect(-3, ly - 3, 6, 6);
      });
    }
    // Upper hinge pivot pin
    ctx.fillStyle = '#ffaa70';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Rear Dished Head Discharge Door & External Chute Boot (Opens at right end for batch transfer to gantry)
    const rearMouthX = halfW - 12;
    let rearDoorAngle = 0;
    if (t >= 17.2 && t < 18.2) {
      rearDoorAngle = lerp(0, 1.15, (t - 17.2) / 1.0); // Door swings open outward to the right
    } else if (t >= 18.2) {
      rearDoorAngle = 1.15;
    }

    // Rear dished head discharge door hinge & flap (swings open to the right)
    const rearHingeX = rearMouthX + 4;
    const rearHingeY = -halfH + 16;

    // Structural hinge arm bracket welded to rear dished head
    ctx.strokeStyle = prominence > 0.6 ? 'rgba(255, 170, 112, 0.9)' : 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(rearMouthX - 10, -halfH + 4);
    ctx.lineTo(rearHingeX, rearHingeY);
    ctx.stroke();

    // Hydraulic unlatch actuator for rear door
    const actuatorExt = (rearDoorAngle / 1.15) * 8;
    ctx.strokeStyle = 'rgba(255, 170, 112, 0.6)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(rearMouthX - 14, -halfH + 28);
    ctx.lineTo(rearMouthX + 6 + actuatorExt, -halfH + 24);
    ctx.stroke();

    // Swinging rear discharge door
    ctx.save();
    ctx.translate(rearHingeX, rearHingeY);
    ctx.rotate(rearDoorAngle);
    ctx.strokeStyle = '#ffaa70';
    ctx.lineWidth = 3.0;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, halfH * 2 - 28);
    ctx.stroke();

    // Door hinge pin
    ctx.fillStyle = '#ffaa70';
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // External receiving chute hood / boot leading to overhead gantry pickup
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(rearMouthX, halfH - 12);
    ctx.lineTo(rearMouthX + 18, halfH - 6);
    ctx.lineTo(rearMouthX + 22, 10);
    ctx.stroke();

    // Minimal Technical Label
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = prominence > 0.6 ? '#ffaa70' : 'rgba(255, 255, 255, 0.55)';
    ctx.textAlign = 'center';
    ctx.fillText('03 STERILIZATION', 0, halfH + 46);

    ctx.restore();
  }

  /* --------------------------------------------------------------------------
     STAGE 04: TWIN-SCREW PRESS (SCREWS ROTATE ONLY UNDER MATERIAL LOAD)
     Directly coupled to batch displacement: rotation angle is calculated from
     the analytical integral of the 4-phase press profile.
     -------------------------------------------------------------------------- */
  function drawStage04_Press(center, t, isHovered) {
    const { x, y, w, h } = center;
    const prominence = getStageProminence(4, t);

    // Gradual 4-phase inertial startup profile for screw rotation and compression (t = 22.3 - 27.0)
    let pressSpeed = 0;
    if (t >= 22.3 && t <= 27.0) {
      if (t < 23.0) {
        // Phase A: Initial engagement & meshing resistance
        pressSpeed = lerp(0.08, 0.25, (t - 22.3) / 0.7);
      } else if (t < 24.3) {
        // Phase B: Progressive motor torque acceleration
        pressSpeed = lerp(0.25, 1.0, (t - 23.0) / 1.3);
      } else if (t <= 26.2) {
        // Phase C: Stable full compression speed
        pressSpeed = 1.0;
      } else {
        // Phase D: Spindown deceleration
        pressSpeed = lerp(1.0, 0.0, (t - 26.2) / 0.8);
      }
    }
    const isPressing = pressSpeed > 0.02;

    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = Math.max(prominence, isHovered ? 0.95 : 0.25);

    const halfW = w / 2 - 15;
    const halfH = 44;

    // Perforated strainer cage housing
    ctx.strokeStyle = prominence > 0.6 ? 'rgba(255, 170, 112, 0.95)' : 'rgba(255, 255, 255, 0.32)';
    ctx.lineWidth = 1.8;
    ctx.strokeRect(-halfW, -halfH, halfW * 2, halfH * 2);

    // Feed Hopper atop screw press (receives material directly from flight conveyor discharge lip)
    const isMobileStage = w <= 340;
    const hopperCenter = isMobileStage ? 0 : -w * 0.36;
    ctx.strokeStyle = prominence > 0.6 ? 'rgba(255, 170, 112, 0.95)' : 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    // Top funnel rim flush with flight conveyor discharge point at s4.y - 44
    ctx.moveTo(hopperCenter - 20, -44);
    ctx.lineTo(hopperCenter + 20, -44);
    // Funnel walls taper downward into auger barrel intake
    ctx.lineTo(hopperCenter + 10, -14);
    ctx.lineTo(hopperCenter - 10, -14);
    ctx.closePath();
    ctx.stroke();

    // Motor Reduction Gearbox Drive on left
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.6;
    ctx.strokeRect(-halfW - 32, -halfH + 6, 32, halfH * 2 - 12);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fillRect(-halfW - 32, -halfH + 6, 32, halfH * 2 - 12);

    // Gearbox cooling ribs
    for (let gy = -halfH + 12; gy <= halfH - 12; gy += 8) {
      ctx.beginPath();
      ctx.moveTo(-halfW - 30, gy);
      ctx.lineTo(-halfW - 2, gy);
      ctx.stroke();
    }

    // Discharge Cone Choke Mechanism on right (Extrusion opening)
    const coneOpen = clamp((t - 23.5) / 2.0, 0, 1);
    ctx.beginPath();
    ctx.moveTo(halfW, -halfH);
    ctx.lineTo(halfW + 30 + coneOpen * 6, -halfH + 16 - coneOpen * 4);
    ctx.lineTo(halfW + 30 + coneOpen * 6, halfH - 16 + coneOpen * 4);
    ctx.lineTo(halfW, halfH);
    ctx.closePath();
    ctx.stroke();

    // Hydraulic pushrod on discharge cone
    ctx.strokeStyle = 'rgba(255, 170, 112, 0.65)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(halfW + 30 + coneOpen * 6, 0);
    ctx.lineTo(halfW + 52 + coneOpen * 6, 0);
    ctx.stroke();

    // Twin Intermeshing Helical Auger Screws (Rotation coupled 1:1 mathematically to axial displacement progress)
    const screwAngle = isReducedMotion ? 0 : (getPressAxialProgress(t) * (7 * Math.PI * 2));
    ctx.strokeStyle = isPressing ? `rgba(255, 170, 112, ${0.4 + 0.6 * pressSpeed})` : 'rgba(255, 170, 112, 0.4)';
    ctx.lineWidth = 2.2;

    const screwPitch = 22;
    for (let sx = -halfW + 18; sx < halfW - 20; sx += screwPitch) {
      const phase = (sx / screwPitch) + screwAngle;
      const yOffsetTop = Math.sin(phase) * 14 - 12;
      const yOffsetBottom = Math.sin(phase + Math.PI * 0.5) * 14 + 12;

      // Top screw flight
      ctx.beginPath();
      ctx.arc(sx, yOffsetTop, 9, 0, Math.PI);
      ctx.stroke();

      // Bottom screw flight
      ctx.beginPath();
      ctx.arc(sx, yOffsetBottom, 9, Math.PI, Math.PI * 2);
      ctx.stroke();
    }

    // Perforated Drainage Cage Slits across bottom
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 1;
    for (let slotX = -halfW + 12; slotX < halfW - 12; slotX += 8) {
      ctx.beginPath();
      ctx.moveTo(slotX, halfH - 8);
      ctx.lineTo(slotX, halfH + 6);
      ctx.stroke();
    }

    // Crude Oil Slurry Droplets trickling downward (ONLY during active pressing with rate proportional to pressSpeed)
    if (pressSpeed > 0.15 && !isReducedMotion) {
      ctx.fillStyle = '#d96522';
      slurryDrops.forEach(drop => {
        drop.progress = (drop.progress + drop.speed * pressSpeed) % 1;
        const dx = lerp(-halfW + 24, halfW - 35, drop.slotFraction);
        const dy = halfH + drop.progress * 32;

        ctx.beginPath();
        ctx.arc(dx, dy, drop.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Heavy Bottom Slurry Collection Trough Pan
    ctx.strokeStyle = prominence > 0.6 ? 'rgba(255, 107, 53, 0.6)' : 'rgba(255, 107, 53, 0.25)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(-halfW + 12, halfH + 34);
    ctx.lineTo(halfW - 12, halfH + 34);
    ctx.stroke();

    // Flanged Slurry Discharge Nozzle on right wall (matches y_global = 640)
    ctx.strokeStyle = prominence > 0.6 ? 'rgba(255, 170, 112, 0.7)' : 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.8;
    ctx.strokeRect(halfW - 5, -8, 6, 16);

    // Minimal Technical Label
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = prominence > 0.6 ? '#ffaa70' : 'rgba(255, 255, 255, 0.55)';
    ctx.textAlign = 'center';
    ctx.fillText('04 SCREW PRESS', 0, halfH + 54);

    ctx.restore();
  }

  /* --------------------------------------------------------------------------
     STAGE 05: CLARIFICATION VESSEL (TALL COLUMN WITH GRAVITY STRATIFICATION)
     -------------------------------------------------------------------------- */
  function drawStage05_Clarifier(center, t, isHovered) {
    const { x, y, w, h } = center;
    const prominence = getStageProminence(5, t);

    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = Math.max(prominence, isHovered ? 0.95 : 0.25);

    const halfW = w / 2 - 20;
    const halfH = h / 2 - 30;

    // Tall vertical cylindrical tank profile with conical bottom hopper
    ctx.strokeStyle = prominence > 0.6 ? 'rgba(255, 170, 112, 0.95)' : 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2.0;

    ctx.beginPath();
    ctx.moveTo(-halfW, -halfH);
    ctx.lineTo(halfW, -halfH);
    ctx.lineTo(halfW, halfH * 0.65);
    ctx.lineTo(0, halfH);
    ctx.lineTo(-halfW, halfH * 0.65);
    ctx.closePath();
    ctx.stroke();

    // Flanged Slurry Inlet Nozzle on left wall (matches y_global = 640, since s5.y = 600)
    ctx.strokeStyle = prominence > 0.6 ? 'rgba(255, 170, 112, 0.7)' : 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.8;
    ctx.strokeRect(-halfW - 3, 32, 6, 16);

    // Underflow Sludge Drain Pipe & Valve Wheel
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, halfH);
    ctx.lineTo(0, halfH + 20);
    ctx.stroke();
    ctx.strokeRect(-8, halfH + 10, 16, 4);

    // Weir lip position: on desktop halfH=120, -halfH + 50 = -70, exactly matching s5.y - 70!
    const weirLipY = -halfH + 50;

    // Dynamic Fluid Stratification & Separation (t >= 28.1)
    // Clarifier remains completely empty until crude slurry arrives at t = 28.1s
    if (t >= 28.1) {
      // Liquid rises from bottom apex (halfH) up to the skimming weir lip (weirLipY)
      const fillProgress = clamp((t - 28.1) / 1.9, 0, 1); // Rises from 28.1s to 30.0s
      const currentTopY = lerp(halfH, weirLipY, easeOutQuad(fillProgress));

      // Phase separation develops as slurry settles (t = 28.6 - 30.4)
      const sep = clamp((t - 28.6) / 1.8, 0, 1);

      ctx.save();
      // Clip to the exact interior contour of the clarifier vessel
      ctx.beginPath();
      ctx.moveTo(-halfW + 1, -halfH + 1);
      ctx.lineTo(halfW - 1, -halfH + 1);
      ctx.lineTo(halfW - 1, halfH * 0.65);
      ctx.lineTo(0, halfH - 1);
      ctx.lineTo(-halfW + 1, halfH * 0.65);
      ctx.closePath();
      ctx.clip();

      const liquidHeight = halfH - currentTopY;

      if (sep <= 0.05) {
        // Initial turbulent incoming raw crude slurry filling from the bottom
        const slurryGrad = ctx.createLinearGradient(0, currentTopY, 0, halfH);
        slurryGrad.addColorStop(0, 'rgba(175, 75, 25, 0.92)');
        slurryGrad.addColorStop(1, 'rgba(110, 45, 18, 0.96)');
        ctx.fillStyle = slurryGrad;
        ctx.fillRect(-halfW + 1, currentTopY, halfW * 2 - 2, liquidHeight + 2);
      } else {
        // Progressive multi-phase gravity separation:
        // 1. Bottom dense sludge / heavy sediment settling in conical hopper (halfH * 0.65 to halfH)
        const sludgeTopY = Math.max(currentTopY, halfH * 0.65 - (1 - sep) * 15);
        if (halfH > sludgeTopY) {
          ctx.fillStyle = `rgba(45, 28, 18, ${0.88 + 0.1 * sep})`;
          ctx.fillRect(-halfW + 1, sludgeTopY, halfW * 2 - 2, halfH - sludgeTopY + 2);
        }

        // 2. Middle turbid emulsion interface layer
        const emulsionTopY = Math.max(currentTopY, lerp(currentTopY, halfH * 0.65, 0.35 + 0.25 * sep));
        if (sludgeTopY > emulsionTopY) {
          ctx.fillStyle = `rgba(185, 78, 26, ${0.75 + 0.15 * sep})`;
          ctx.fillRect(-halfW + 1, emulsionTopY, halfW * 2 - 2, sludgeTopY - emulsionTopY + 1);
        }

        // 3. Top radiant clarified golden CPO layer forming upward
        if (emulsionTopY > currentTopY) {
          const cpoGrad = ctx.createLinearGradient(0, currentTopY, 0, emulsionTopY);
          cpoGrad.addColorStop(0, `rgba(255, 195, 55, ${0.88 * sep})`);
          cpoGrad.addColorStop(0.5, `rgba(245, 158, 11, ${0.82 * sep})`);
          cpoGrad.addColorStop(1, `rgba(217, 119, 6, ${0.75 * sep})`);
          ctx.fillStyle = cpoGrad;
          ctx.fillRect(-halfW + 1, currentTopY, halfW * 2 - 2, emulsionTopY - currentTopY + 1);
        }
      }

      // Convective surface ripples
      if (!isReducedMotion && fillProgress > 0.05) {
        const waveOffset = Math.sin(Date.now() * 0.004) * 2.0;
        ctx.strokeStyle = `rgba(255, 235, 160, ${0.4 + 0.5 * sep})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-halfW + 6, currentTopY + waveOffset);
        ctx.lineTo(halfW - 6, currentTopY - waveOffset);
        ctx.stroke();
      }

      ctx.restore();
    }

    // Internal Skimming Funnel Weir (Directs pure oil to outflow pipe at weirLipY)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(halfW - 44, weirLipY - 18);
    ctx.lineTo(halfW - 20, weirLipY);
    ctx.lineTo(halfW, weirLipY);
    ctx.stroke();

    // Golden clarified oil entering skimming weir funnel (t >= 30.0)
    if (t >= 30.0) {
      ctx.fillStyle = 'rgba(251, 191, 36, 0.85)';
      ctx.beginPath();
      ctx.moveTo(halfW - 42, weirLipY - 16);
      ctx.lineTo(halfW - 20, weirLipY);
      ctx.lineTo(halfW, weirLipY);
      ctx.lineTo(halfW, weirLipY - 16);
      ctx.closePath();
      ctx.fill();
    }

    // Center Stirrer Drive Shaft with Slow Sweeper Arms (rotates only when fluid is present: t >= 28.1)
    const sweeperAngle = (t >= 28.1 && !isReducedMotion) ? ((Date.now() * 0.001) % (Math.PI * 2)) : 0;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, -halfH - 16);
    ctx.lineTo(0, halfH * 0.65);
    ctx.stroke();

    const armX = Math.cos(sweeperAngle) * (halfW - 22);
    ctx.strokeStyle = 'rgba(255, 170, 112, 0.4)';
    ctx.beginPath();
    ctx.moveTo(-armX, halfH * 0.5);
    ctx.lineTo(armX, halfH * 0.5);
    ctx.stroke();

    // Minimal Technical Label
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = prominence > 0.6 ? '#ffaa70' : 'rgba(255, 255, 255, 0.55)';
    ctx.textAlign = 'center';
    ctx.fillText('05 CLARIFICATION', 0, halfH + 42);

    ctx.restore();
  }

  /* --------------------------------------------------------------------------
     STAGE 06: CPO STORAGE TANK (FINISHED PRODUCT RECEIVER & LEVEL SIGHT GAUGE)
     -------------------------------------------------------------------------- */
  function drawStage06_CPOOutput(center, t, isHovered) {
    const { x, y, w, h } = center;
    const prominence = getStageProminence(6, t);

    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = Math.max(prominence, isHovered ? 0.95 : 0.25);

    const halfW = w / 2 - 20;
    const halfH = h / 2 - 20;

    // Finished Oil Tank Shell
    ctx.strokeStyle = prominence > 0.6 ? 'rgba(255, 195, 65, 0.95)' : 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2.0;
    ctx.strokeRect(-halfW, -halfH, halfW * 2, halfH * 2);

    // Domed roof cap
    ctx.beginPath();
    ctx.moveTo(-halfW, -halfH);
    ctx.quadraticCurveTo(0, -halfH - 14, halfW, -halfH);
    ctx.stroke();

    // Calibrated Level Sight Gauge on exterior side
    const gaugeTop = -halfH + 12;
    const gaugeBottom = halfH - 12;
    const gaugeHeight = gaugeBottom - gaugeTop;

    // Fill level of golden crude palm oil (Fills strictly upon physical stream arrival: t >= 31.5)
    const fillPercent = clamp((t - 31.5) / 2.3, 0, 0.75);
    const gaugeLiquidHeight = Math.max(0, gaugeHeight * fillPercent);

    // Sight gauge tube frame
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(halfW + 10, gaugeTop, 12, gaugeHeight);

    // Sight gauge liquid column
    if (gaugeLiquidHeight > 1) {
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(halfW + 11, gaugeBottom - gaugeLiquidHeight, 10, gaugeLiquidHeight);
    }

    // Sight gauge calibration tick marks
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.0;
    for (let i = 1; i <= 3; i++) {
      const ty = gaugeBottom - (gaugeHeight * i) / 4;
      ctx.beginPath();
      ctx.moveTo(halfW + 17, ty);
      ctx.lineTo(halfW + 21, ty);
      ctx.stroke();
    }

    // Oil liquid inside main tank
    const maxLiquidHeight = halfH * 2 - 2;
    const liquidHeight = maxLiquidHeight * fillPercent;

    if (liquidHeight > 2) {
      const oilGrad = ctx.createLinearGradient(0, halfH - liquidHeight, 0, halfH);
      oilGrad.addColorStop(0, '#fbbf24');
      oilGrad.addColorStop(0.3, '#f59e0b');
      oilGrad.addColorStop(0.7, '#d97706');
      oilGrad.addColorStop(1, '#b45309');

      ctx.fillStyle = oilGrad;
      ctx.fillRect(-halfW + 1, halfH - liquidHeight, halfW * 2 - 2, liquidHeight);

      // Meniscus ripple across pool surface
      ctx.strokeStyle = 'rgba(255, 245, 190, 0.85)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-halfW + 2, halfH - liquidHeight);
      ctx.lineTo(halfW - 2, halfH - liquidHeight);
      ctx.stroke();

      // Concentric impact ripples directly under inlet nozzle (-halfW + 5)
      if (!isReducedMotion && t >= 31.5) {
        const ripplePhase = (Date.now() * 0.006) % 1;
        const rippleR = 4 + ripplePhase * 16;
        const rippleAlpha = (1 - ripplePhase) * 0.55;
        ctx.strokeStyle = `rgba(255, 240, 160, ${rippleAlpha})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(-halfW + 5, halfH - liquidHeight, rippleR, rippleR * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Qualitative status badge
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = fillPercent > 0.3 ? 'rgba(255, 235, 180, 0.95)' : 'rgba(255, 235, 180, 0.4)';
    ctx.textAlign = 'center';
    ctx.fillText('CRUDE PALM OIL', 0, -6);
    ctx.fillStyle = fillPercent > 0.3 ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.25)';
    ctx.fillText('CLARIFIED PRODUCT', 0, 10);

    // Minimal Technical Label
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = prominence > 0.6 ? '#ffaa70' : 'rgba(255, 255, 255, 0.55)';
    ctx.textAlign = 'center';
    ctx.fillText('06 CPO OUTFLOW', 0, halfH + 42);

    ctx.restore();
  }

  /* --------------------------------------------------------------------------
     MASTER RENDER LOOP
     -------------------------------------------------------------------------- */
  function renderFrame(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = Math.min((timestamp - lastTime) / 1000, 0.1);
    lastTime = timestamp;

    if (isPlaying) {
      timeline += delta;
      if (timeline >= DURATION) {
        timeline = DURATION;
        isPlaying = false;
        isSettled = true;
        if (typeof window.Ch02Scene03?.onComplete === "function") {
          window.Ch02Scene03.onComplete();
        }
      }
    }

    // Smooth mechanical dynamics integration
    if (!isReducedMotion) {
      // Weighbridge conveyor offset
      if (timeline >= 9.0 && timeline <= 12.8) {
        const p = (timeline - 9.0) / 3.8;
        let spd = 1.0;
        if (p < 0.2) spd = p / 0.2;
        else if (p > 0.8) spd = (1 - p) / 0.2;
        weighbridgeConveyorOffset += spd * delta * 55;
      }

      // Sterilizer conveyor offset
      if (timeline >= 18.2 && timeline <= 22.0) {
        const p = (timeline - 18.2) / 3.8;
        let spd = 1.0;
        if (p < 0.2) spd = p / 0.2;
        else if (p > 0.8) spd = (1 - p) / 0.2;
        sterilizerConveyorOffset += spd * delta * 50;
      }

      // Screw press speed & angle
      let pressSpeed = 0;
      if (timeline >= 22.0 && timeline <= 27.0) {
        if (timeline < 22.8) {
          pressSpeed = lerp(0.05, 0.20, (timeline - 22.0) / 0.8);
        } else if (timeline < 24.2) {
          pressSpeed = lerp(0.20, 1.0, (timeline - 22.8) / 1.4);
        } else if (timeline <= 26.2) {
          pressSpeed = 1.0;
        } else {
          pressSpeed = lerp(1.0, 0.0, (timeline - 26.2) / 0.8);
        }
      }
      screwAccumAngle += pressSpeed * delta * 7.5;
    }

    ctx.clearRect(0, 0, width, height);

    const layout = getMillLayout();
    const batch = getBatchState(timeline, layout);

    // Subtle ambient industrial atmosphere (seamless night sky background)
    const hazeGrad = ctx.createRadialGradient(width * 0.5, height * 0.45, 50, width * 0.5, height * 0.45, width * 0.65);
    hazeGrad.addColorStop(0, 'rgba(255, 107, 53, 0.024)');
    hazeGrad.addColorStop(0.65, 'rgba(20, 18, 14, 0.008)');
    hazeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = hazeGrad;
    ctx.fillRect(0, 0, width, height);

    // 1. Draw dormant connecting infrastructure (rails & empty pipe housings)
    drawPhysicalInfrastructure(layout);

    // 2. Draw 2D structural conveyor between weighbridge and sterilizer
    drawWeighbridgeToSterilizerConveyor(layout, timeline);

    // 3. Draw 2D flight conveyor travelator between sterilizer and press
    drawSterilizerToPressConveyor(layout, timeline);

    // 4. Draw physical fluid streams strictly when material causes liquid movement
    drawFluidStreams(layout, timeline);

    // 5. Draw 6 Process Stages (highlighted only when material is present)
    drawStage01_FFB(layout.s1, timeline, hoveredStage === 1);
    drawStage02_Weighbridge(layout.s2, timeline, hoveredStage === 2, batch);
    drawStage03_Sterilizer(layout.s3, timeline, hoveredStage === 3);
    drawStage04_Press(layout.s4, timeline, hoveredStage === 4);
    drawStage05_Clarifier(layout.s5, timeline, hoveredStage === 5);
    drawStage06_CPOOutput(layout.s6, timeline, hoveredStage === 6);

    // 6. Draw the identifiable physical batch material
    drawBatchMaterial(batch);

    animFrameId = requestAnimationFrame(renderFrame);
  }

  // Static settled render for prefers-reduced-motion
  function renderStaticSettled() {
    timeline = DURATION;
    isPlaying = false;
    isSettled = true;
  }

  // Replay timeline
  function replay() {
    timeline = 0;
    isPlaying = true;
    isSettled = false;
    lastTime = 0;
    screwAccumAngle = 0;
    weighbridgeConveyorOffset = 0;
    sterilizerConveyorOffset = 0;
  }

  // Stage-Click Restart Logic & Timestamps
  const STAGE_ONSETS = {
    1: 0.0,  // FFB Cart & Unload
    2: 4.2,  // Weighbridge Approach & Scale
    3: 9.0,  // Weighbridge-to-Sterilizer Conveyor & Autoclave
    4: 18.2, // Sterilizer-to-Press Conveyor & Press
    5: 26.5, // Slurry Flow & Clarifier Column
    6: 30.0  // CPO Outflow & Finished Storage
  };

  function getStageAtPoint(mx, my) {
    const layout = getMillLayout();
    const stages = [
      { id: 1, ...layout.s1 },
      { id: 2, ...layout.s2 },
      { id: 3, ...layout.s3 },
      { id: 4, ...layout.s4 },
      { id: 5, ...layout.s5 },
      { id: 6, ...layout.s6 }
    ];

    for (const s of stages) {
      const hw = (s.w || 100) / 2;
      const hh = (s.h || 80) / 2;
      if (mx >= s.x - hw && mx <= s.x + hw && my >= s.y - hh && my <= s.y + hh) {
        return s.id;
      }
    }
    return 0;
  }

  function restartAtStage(stageId) {
    if (!STAGE_ONSETS.hasOwnProperty(stageId)) return;
    timeline = STAGE_ONSETS[stageId];
    isPlaying = true;
    isSettled = false;
    lastTime = 0;
    hoveredStage = stageId;
  }

  // Evidence panel modal handlers (Personal Internship Record)
  function openEvidencePanel() {
    if (!evidencePanel) return;
    if (processPanel && !processPanel.hidden) {
      closeProcessPanel();
    }
    evidencePanel.hidden = false;
    if (inspectBtn) inspectBtn.setAttribute('aria-expanded', 'true');
    const closeBtn = evidencePanel.querySelector('.archival-dossier__close');
    if (closeBtn) closeBtn.focus();
  }

  function closeEvidencePanel() {
    if (!evidencePanel) return;
    evidencePanel.hidden = true;
    if (inspectBtn) {
      inspectBtn.setAttribute('aria-expanded', 'false');
      inspectBtn.focus();
    }
  }

  // Process explainer modal handlers (Continuous Milling System Breakdown)
  function openProcessPanel() {
    if (!processPanel) return;
    if (evidencePanel && !evidencePanel.hidden) {
      closeEvidencePanel();
    }
    processPanel.hidden = false;
    if (processBtn) processBtn.setAttribute('aria-expanded', 'true');
    const closeBtn = processPanel.querySelector('.archival-dossier__close');
    if (closeBtn) closeBtn.focus();
  }

  function closeProcessPanel() {
    if (!processPanel) return;
    processPanel.hidden = true;
    if (processBtn) {
      processBtn.setAttribute('aria-expanded', 'false');
      processBtn.focus();
    }
  }

  // Initialization & Event Listeners
  function init() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    syncHeaderStatus();

    if (inspectBtn) {
      inspectBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (evidencePanel) {
          if (evidencePanel.hidden) {
            openEvidencePanel();
          } else {
            closeEvidencePanel();
          }
        }
      });
    }

    if (processBtn) {
      processBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (processPanel) {
          if (processPanel.hidden) {
            openProcessPanel();
          } else {
            closeProcessPanel();
          }
        }
      });
    }

    if (replayBtn) {
      replayBtn.addEventListener('click', replay);
    }

    if (evidencePanel) {
      evidencePanel.addEventListener('click', (e) => {
        if (e.target.closest('[data-close="true"]')) {
          closeEvidencePanel();
        }
      });
    }

    if (processPanel) {
      processPanel.addEventListener('click', (e) => {
        if (e.target.closest('[data-close="true"]')) {
          closeProcessPanel();
        }
      });
    }

    // Keyboard shortcuts: Shift+M for mill replay, Escape for modal close
    window.addEventListener('keydown', (e) => {
      if (e.shiftKey && (e.key === 'M' || e.key === 'm')) {
        e.preventDefault();
        replay();
      }
      if (e.key === 'Escape') {
        if (evidencePanel && !evidencePanel.hidden) {
          closeEvidencePanel();
        }
        if (processPanel && !processPanel.hidden) {
          closeProcessPanel();
        }
      }
    });

    // Hover detection over stages on canvas (updates pointer cursor to indicate clickability)
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const found = getStageAtPoint(mx, my);
      hoveredStage = found;
      canvas.style.cursor = found > 0 ? 'pointer' : 'default';
    });

    canvas.addEventListener('mouseleave', () => {
      hoveredStage = 0;
      canvas.style.cursor = 'default';
    });

    // Stage-click restart behavior: Clicking a stage restarts simulation from its onset
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const stageId = getStageAtPoint(mx, my);
      if (stageId > 0) {
        restartAtStage(stageId);
      }
    });

    // Touch tap restart support on mobile
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.touches[0].clientX - rect.left;
        const my = e.touches[0].clientY - rect.top;
        const stage = getStageAtPoint(mx, my);
        if (stage > 0) {
          restartAtStage(stage);
        }
      }
    }, { passive: true });

    // Keyboard support: space for replay, 1-6 for stage jumping
    window.addEventListener('keydown', (e) => {
      if (e.key === ' ' && document.activeElement === canvas) {
        replay();
        e.preventDefault();
      }
      if (e.key >= '1' && e.key <= '6' && document.activeElement === canvas) {
        const stageNum = parseInt(e.key, 10);
        if (STAGE_ONSETS[stageNum] !== undefined) {
          restartAtStage(stageNum);
          e.preventDefault();
        }
      }
    }, { passive: false });

    // Intersection observer for automated activation
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasTriggered) {
            hasTriggered = true;
            if (isReducedMotion) {
              renderStaticSettled();
            } else {
              replay();
            }
          }
        });
      }, { threshold: [0.01, 0.08] });
      observer.observe(stageWrapper);
    } else {
      replay();
    }

    // Quick initial check if page already at Scene 03
    setTimeout(() => {
      if (!hasTriggered) {
        const rect = stageWrapper.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          hasTriggered = true;
          if (isReducedMotion) {
            renderStaticSettled();
          } else {
            replay();
          }
        }
      }
    }, 200);

    // Global testing API
    window.scene03Mill = {
      replay,
      restartAtStage,
      renderStaticSettled,
      openEvidencePanel,
      closeEvidencePanel,
      openProcessPanel,
      closeProcessPanel,
      setTimeline: (t) => {
        timeline = t;
        isPlaying = false;
        if (t >= 9.0 && t <= 12.8) {
          const p = (t - 9.0) / 3.8;
          weighbridgeConveyorOffset = conveyorMotion(p) * 200;
        }
        if (t >= 18.2 && t <= 22.0) {
          const p = (t - 18.2) / 3.8;
          sterilizerConveyorOffset = conveyorMotion(p) * 180;
        }
        if (t >= 22.0 && t <= 27.0) {
          const u = (t - 22.0) / 5.0;
          screwAccumAngle = u * Math.PI * 8;
        }
      },
      getState: () => ({ timeline, isPlaying, isSettled, hoveredStage, screwAccumAngle })
    };

        animFrameId = requestAnimationFrame(renderFrame);

    // Export standard Chapter 02 Scene 03 Adapter interface
    window.Ch02Scene03 = {
      id: 'scene-03',
      name: '03 // ASTRA MILL',
      shortName: '03 Astra',
      duration: DURATION,
      init: init,
      play: function () {
        isPlaying = true;
        lastTime = performance.now();
        if (!animFrameId) animFrameId = requestAnimationFrame(renderFrame);
      },
      pause: function () {
        isPlaying = false;
        if (animFrameId) {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
        }
      },
      replay: replay,
      stop: function () {
        isPlaying = false;
        if (animFrameId) {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
        }
      },
      resize: resizeCanvas,
      seek: function (t) {
        timeline = Math.max(0, Math.min(DURATION, t));
        isSettled = (timeline >= DURATION);
        lastTime = performance.now();
        if (!animFrameId) animFrameId = requestAnimationFrame(renderFrame);
      },
      getCurrentTime: function () { return Math.min(timeline, DURATION); },
      onComplete: null
    };
  }

  init();
})();