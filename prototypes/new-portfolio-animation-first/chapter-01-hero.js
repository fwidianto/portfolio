/* ==========================================================================
   CHAPTER 01: HERO (FROZEN OWNER-APPROVED RED DWARF FORMATION ENGINE)
   Source: prototypes/red-dwarf-animation/index.html
   DO NOT RETUNE, REDESIGN, SIMPLIFY, OR MODIFY BEHAVIOR
   ========================================================================== */

(function () {
  const canvas = document.querySelector('.hero-red-dwarf__canvas');
  const formationCanvas = document.querySelector('.hero-red-dwarf__formation-canvas');
  const field = document.querySelector('.hero-red-dwarf__star-field');
  const replayBtn = document.querySelector('.hero-red-dwarf__replay-btn');
  if (!canvas || !field) return;

  let gl = null;
  let program = null;
  let positionBuffer = null;
  let raf = 0;
  const loc = {};

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isReduced = reduceMotion.matches;

  // Canonical WebGL parameters & state
  const CANONICAL_FLARE_INTENSITY = 1.30;
  const CANONICAL_FLARE_RAYS = 1.20;
  const CANONICAL_PULSE_SPEED = 1.0;
  const CANONICAL_PULSE_AMP = 1.4;
  const CANONICAL_PLAGE_INTENSITY = 1.40;
  const CANONICAL_SPOT_DEPTH = 1.0;
  const CANONICAL_GRAN_SPEED = 1.0;
  const CANONICAL_SPIN_SPEED = 0.4;

  const state = {
    flareIntensity: CANONICAL_FLARE_INTENSITY,
    flareRays: CANONICAL_FLARE_RAYS,
    pulseSpeed: CANONICAL_PULSE_SPEED,
    pulseAmp: CANONICAL_PULSE_AMP,
    plageIntensity: CANONICAL_PLAGE_INTENSITY,
    spotDepth: CANONICAL_SPOT_DEPTH,
    granSpeed: CANONICAL_GRAN_SPEED,
    spinSpeed: CANONICAL_SPIN_SPEED,
    flareBurst: 0.0,
    growthScale: 1.0,
    isDragging: false
  };

  let rotX = 0;
  let rotY = 0;
  let targetRotX = 0;
  let targetRotY = 0;
  let velX = 0;
  let velY = 0;
  let autoSpin = 0;
  let simTime = 0;
  let lastTime = performance.now();
  let activePointerId = null;
  let lastPointerX = 0;
  let lastPointerY = 0;

  // ==========================================
  // 14-SECOND FORMATION TIMELINE ENGINE
  // ==========================================
  const FORMATION_DURATION = 14.0;
  let formationTime = 0;
  let isForming = !isReduced;
  let formationComplete = isReduced;
  let fCtx = formationCanvas ? formationCanvas.getContext('2d') : null;

  // Deterministic Mulberry32 PRNG (seed: 0x5F3759DF)
  function createPrng(seed) {
    let s = seed | 0;
    return function () {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const STREAMLINE_COUNT = 36;
  const PARTICLE_COUNT = 380;
  const KNOT_COUNT = 22;
  let streamlines = [];
  let particles = [];
  let knots = [];

  // Frame pacing optimization: Cached radial glow sprites (Zero per-frame gradient allocation)
  let spriteCool = null;
  let spriteWarm = null;
  let spriteHot = null;

  function createGlowSprite(r, g, b) {
    const c = document.createElement('canvas');
    c.width = 32;
    c.height = 32;
    const ctx = c.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, `rgb(${r}, ${g}, ${b})`);
    grad.addColorStop(0.35, `rgba(${r}, ${Math.floor(g * 0.7)}, ${Math.floor(b * 0.4)}, 0.65)`);
    grad.addColorStop(1, `rgba(${r}, ${Math.floor(g * 0.3)}, 0, 0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();
    return c;
  }

  // Pre-allocated render pool to eliminate per-frame garbage collection
  const renderPool = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    renderPool.push({ x: 0, y: 0, z: 0, radius: 0, alpha: 0, sprite: null, isForeground: false });
  }
  const sortIndices = new Int16Array(PARTICLE_COUNT);

  function initFormationModel() {
    const rng = createPrng(0x5F3759DF);
    streamlines = [];
    knots = [];
    particles = [];

    if (!spriteCool) {
      spriteCool = createGlowSprite(220, 100, 50);
      spriteWarm = createGlowSprite(255, 145, 45);
      spriteHot = createGlowSprite(255, 215, 80);
    }

    // 36 Gravitational Streamlines pulling inwards towards center
    for (let s = 0; s < STREAMLINE_COUNT; s++) {
      const baseAngle = (s / STREAMLINE_COUNT) * Math.PI * 2;
      const angle = baseAngle + (rng() - 0.5) * 0.18;
      const outerDist = 1.05 + rng() * 0.25;
      const spiralDirection = (s % 2 === 0 ? 1 : -1);
      const curvature = spiralDirection * (0.35 + rng() * 0.35);
      const stagger = rng() * 1.2;
      const speed = 0.85 + rng() * 0.35;
      const width = 1.0 + rng() * 1.5;
      const emberCount = 3 + Math.floor(rng() * 3);
      const embers = [];
      for (let e = 0; e < emberCount; e++) {
        embers.push({
          offset: e / emberCount + (rng() - 0.5) * 0.15,
          speedMult: 0.8 + rng() * 0.45,
          size: 1.4 + rng() * 2.2,
          heat: 0.5 + rng() * 0.5
        });
      }
      streamlines.push({
        id: s,
        angle: angle,
        outerDist: outerDist,
        curvature: curvature,
        stagger: stagger,
        speed: speed,
        width: width,
        embers: embers
      });
    }

    // 22 Primary Luminous Knots on spherical shell
    for (let k = 0; k < KNOT_COUNT; k++) {
      const y = 1 - (k / (KNOT_COUNT - 1)) * 2;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = k * 2.3999632;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      knots.push({
        id: k,
        nx: x,
        ny: y,
        nz: z,
        startDistance: 1.6 + rng() * 1.6,
        startAngle: rng() * Math.PI * 2,
        startZ: (rng() - 0.5) * 1.3,
        intensity: 0.85 + rng() * 0.65,
        size: 3.5 + rng() * 2.5,
        stagger: rng() * 0.8,
        curvature: (rng() - 0.5) * 0.35
      });
    }

    // Align knots to canonical plages
    const canonicalPlages = [
      { x: -0.25, y: 0.12, z: 0.92 },
      { x: 0.42, y: 0.45, z: 0.75 },
      { x: 0.35, y: -0.48, z: 0.78 },
      { x: -0.05, y: 0.65, z: 0.72 }
    ];
    for (let p = 0; p < canonicalPlages.length && p < knots.length; p++) {
      knots[p].nx = canonicalPlages[p].x;
      knots[p].ny = canonicalPlages[p].y;
      knots[p].nz = canonicalPlages[p].z;
      knots[p].isPlage = true;
      knots[p].intensity = 1.55;
    }

    // Align knots to canonical starspots
    const canonicalSpots = [
      { x: 0.18, y: -0.22, z: 0.95 },
      { x: -0.45, y: -0.30, z: 0.82 }
    ];
    for (let s = 0; s < canonicalSpots.length && (s + 4) < knots.length; s++) {
      knots[s + 4].nx = canonicalSpots[s].x;
      knots[s + 4].ny = canonicalSpots[s].y;
      knots[s + 4].nz = canonicalSpots[s].z;
      knots[s + 4].isSpot = true;
    }

    // 380 Particles clustered around knots & streamlines
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const knotIdx = i % KNOT_COUNT;
      const knot = knots[knotIdx];

      const jitterAngle = rng() * Math.PI * 2;
      const jitterDist = rng() * 0.26;
      const tx = knot.nx + Math.cos(jitterAngle) * jitterDist;
      const ty = knot.ny + Math.sin(jitterAngle) * jitterDist;
      const tz = knot.nz + (rng() - 0.5) * 0.2;
      const tLen = Math.hypot(tx, ty, tz) || 1;

      const initDist = 0.68 + rng() * 0.60;
      const initAngle = knot.startAngle + (rng() - 0.5) * 0.9;
      const initZ = (rng() - 0.5) * 1.4;

      particles.push({
        id: i,
        knotIdx: knotIdx,
        tx: tx / tLen,
        ty: ty / tLen,
        tz: tz / tLen,
        initDist: initDist,
        initAngle: initAngle,
        initZ: initZ,
        stagger: rng() * 1.0,
        speedFactor: 0.85 + rng() * 0.35,
        curveAmp: (rng() - 0.5) * 0.32,
        radius: 1.2 + rng() * 2.2,
        baseAlpha: 0.35 + rng() * 0.55
      });
    }
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  function smootherstep(t) {
    const c = Math.max(0, Math.min(1, t));
    return c * c * c * (c * (c * 6 - 15) + 10);
  }
  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  const R_PROTOSTAR_SCALE = 0.048;
  const TARGET_PEAK_SCALE = 1.075; // Clearly legible +7.5% overshoot

  function updateFormation(dt) {
    if (!isForming) return;
    formationTime += dt;
    const t = formationTime;

    // 14.0s Narrative Timeline:
    // Phase 0: 0.0 - 1.4s -> Prepared field (scattered cosmic matter, central negative space preserved)
    // Phase 1: 1.4 - 4.8s -> Directed inward gathering (gravitational streamlines & inward particle infall)
    // Phase 2: 4.8 - 6.8s -> Gravitational condensation into persistent protostar core at (cx, cy)
    // Phase 3: 6.8 - 7.6s -> Thermonuclear ignition (distinct, restrained surge of energy & coronal rays)
    // Phase 4: 7.6 - 10.2s -> Majestic continuous expansion to controlled peak overshoot (+7.5%)
    // Phase 5: 10.2 - 13.0s -> Controlled damped overshoot settlement to exact canonical 1.0000
    // Settled: 13.0 - 14.0s -> 100% exact canonical Red Dwarf stabilization & handoff

    if (t < 4.8) {
      canvas.style.opacity = '0';
      state.growthScale = 0.035;
      state.flareIntensity = 0.35;
      state.flareRays = 0.35;
      state.pulseSpeed = 1.0;
      state.pulseAmp = 0.0;
      state.plageIntensity = 0.0;
      state.spotDepth = 0.0;
      state.flareBurst = 0.0;
      state.spinSpeed = 0.0;
    } else if (t >= 4.8 && t < 6.8) {
      const pCollapse = clamp((t - 4.8) / 2.0, 0, 1);
      const easeCore = smootherstep(pCollapse);

      const coreAppear = clamp((t - 4.8) / 0.8, 0, 1);
      canvas.style.opacity = coreAppear.toFixed(3);

      state.growthScale = 0.035 + easeCore * (0.065 - 0.035);
      state.flareIntensity = 0.70 + easeCore * 0.30;
      state.flareRays = 0.55 + easeCore * 0.30;
      state.granSpeed = CANONICAL_GRAN_SPEED;
      state.pulseSpeed = CANONICAL_PULSE_SPEED;
      state.pulseAmp = 0.0;
      state.plageIntensity = easeCore * 0.35;
      state.spotDepth = 0.0;
      state.flareBurst = Math.sin(easeCore * Math.PI) * 0.20;
      state.spinSpeed = 0.1 * easeCore;
    } else if (t >= 6.8 && t < 7.6) {
      canvas.style.opacity = '1';
      const pIgnite = clamp((t - 6.8) / 0.8, 0, 1);
      const easeIgnite = smootherstep(pIgnite);

      state.growthScale = 0.065 + easeIgnite * 0.025;
      state.flareBurst = Math.sin(pIgnite * Math.PI) * 0.95;
      state.flareIntensity = 1.00 + Math.sin(pIgnite * Math.PI) * 0.40;
      state.flareRays = 0.85 + Math.sin(pIgnite * Math.PI) * 0.45;
      state.granSpeed = CANONICAL_GRAN_SPEED;
      state.pulseSpeed = CANONICAL_PULSE_SPEED;
      state.pulseAmp = 0.0;
      state.plageIntensity = 0.35 + easeIgnite * 0.35;
      state.spotDepth = 0.0;
      state.spinSpeed = CANONICAL_SPIN_SPEED * 0.4;
    } else if (t >= 7.6 && t < 10.2) {
      canvas.style.opacity = '1';

      const pExp = clamp((t - 7.6) / 2.6, 0, 1);
      const ep = smootherstep(pExp);

      state.growthScale = 0.090 + ep * (TARGET_PEAK_SCALE - 0.090);
      state.flareIntensity = 1.00 + ep * (1.48 - 1.00);
      state.flareRays = 0.85 + ep * (1.35 - 0.85);
      state.granSpeed = CANONICAL_GRAN_SPEED;
      state.pulseSpeed = CANONICAL_PULSE_SPEED;
      state.pulseAmp = 0.0;
      state.plageIntensity = Math.pow(ep, 1.2) * 1.55;
      state.spotDepth = Math.max(0, (ep - 0.25) / 0.75) * CANONICAL_SPOT_DEPTH;
      state.spinSpeed = CANONICAL_SPIN_SPEED;
      state.flareBurst = Math.max(0, 0.35 * (1.0 - pExp));
    } else if (t >= 10.2 && t < 13.0) {
      const pSettle = clamp((t - 10.2) / 2.8, 0, 1);
      const es = smootherstep(pSettle);
      canvas.style.opacity = '1';

      state.growthScale = TARGET_PEAK_SCALE - es * (TARGET_PEAK_SCALE - 1.000);
      state.flareIntensity = 1.48 - es * (1.48 - CANONICAL_FLARE_INTENSITY);
      state.flareRays = 1.35 - es * (1.35 - CANONICAL_FLARE_RAYS);
      state.plageIntensity = 1.55 - es * (1.55 - CANONICAL_PLAGE_INTENSITY);
      state.spotDepth = CANONICAL_SPOT_DEPTH;
      state.granSpeed = CANONICAL_GRAN_SPEED;
      state.pulseSpeed = CANONICAL_PULSE_SPEED;
      state.spinSpeed = CANONICAL_SPIN_SPEED;
      state.pulseAmp = es * CANONICAL_PULSE_AMP;
      state.flareBurst = 0.0;
    } else {
      canvas.style.opacity = '1';
      state.growthScale = 1.0;
      state.flareIntensity = CANONICAL_FLARE_INTENSITY;
      state.flareRays = CANONICAL_FLARE_RAYS;
      state.pulseSpeed = CANONICAL_PULSE_SPEED;
      state.pulseAmp = CANONICAL_PULSE_AMP;
      state.plageIntensity = CANONICAL_PLAGE_INTENSITY;
      state.spotDepth = CANONICAL_SPOT_DEPTH;
      state.granSpeed = CANONICAL_GRAN_SPEED;
      state.spinSpeed = CANONICAL_SPIN_SPEED;
      state.flareBurst = 0.0;
    }

    if (t >= FORMATION_DURATION) {
      isForming = false;
      formationComplete = true;
      if (formationCanvas) {
        formationCanvas.style.opacity = '0';
        if (fCtx) fCtx.clearRect(0, 0, formationCanvas.width, formationCanvas.height);
      }
      if (replayBtn) replayBtn.classList.add('is-visible');
    }
  }

  function renderFormation() {
    if (!fCtx || !formationCanvas || formationComplete) return;

    const w = formationCanvas.width;
    const h = formationCanvas.height;
    fCtx.clearRect(0, 0, w, h);

    const t = formationTime;
    if (t <= 0) return;

    const cx = w * 0.5;
    const cy = h * 0.5;
    const minDim = Math.min(w, h);
    const R_canonical = 0.355 * minDim;
    const currentCoreR = state.growthScale * R_canonical;

    // 1. INWARD GRAVITATIONAL STREAMLINES & EMBERS
    if (t >= 1.4 && t < 6.8) {
      let sAlpha = 0.28;
      if (t < 2.4) {
        sAlpha *= (t - 1.4) / 1.0;
      } else if (t >= 5.0) {
        sAlpha *= Math.max(0, (6.8 - t) / 1.8);
      }

      const pCollapse = t >= 4.8 ? Math.min(1.0, (t - 4.8) / 2.0) : 0.0;
      const easePull = Math.pow(pCollapse, 1.8);

      fCtx.save();
      for (let s = 0; s < streamlines.length; s++) {
        const str = streamlines[s];
        const sT = Math.max(0, t - str.stagger * 0.4);
        if (sT <= 0) continue;

        const startR = str.outerDist * R_canonical * (1.0 - easePull * 0.45);
        const endR = Math.max(currentCoreR, 0.12 * R_canonical) * (1.0 - easePull * 0.6);

        const x1 = cx + Math.cos(str.angle) * startR;
        const y1 = cy + Math.sin(str.angle) * startR;
        const midA = str.angle + str.curvature * 0.45;
        const midR = (startR + endR) * 0.52;
        const mx = cx + Math.cos(midA) * midR;
        const my = cy + Math.sin(midA) * midR;
        const endA = str.angle + str.curvature;
        const x2 = cx + Math.cos(endA) * endR;
        const y2 = cy + Math.sin(endA) * endR;

        const grad = fCtx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, `rgba(255, 90, 20, 0)`);
        grad.addColorStop(0.55, `rgba(255, 160, 50, ${sAlpha * 0.75})`);
        grad.addColorStop(1.0, `rgba(255, 230, 110, ${sAlpha * 1.35})`);

        fCtx.lineWidth = Math.max(0.7, str.width * (1.0 - easePull * 0.4));
        fCtx.strokeStyle = grad;
        fCtx.beginPath();
        fCtx.moveTo(x1, y1);
        fCtx.quadraticCurveTo(mx, my, x2, y2);
        fCtx.stroke();

        // Infalling embers along the streamline
        for (let e = 0; e < str.embers.length; e++) {
          const emb = str.embers[e];
          const embProgress = ((sT * str.speed * 0.22 * emb.speedMult + emb.offset) % 1.0);
          const tE = smootherstep(embProgress);
          const ex = (1 - tE) * (1 - tE) * x1 + 2 * (1 - tE) * tE * mx + tE * tE * x2;
          const ey = (1 - tE) * (1 - tE) * y1 + 2 * (1 - tE) * tE * my + tE * tE * y2;
          const eDist = Math.hypot(ex - cx, ey - cy);
          if (eDist <= currentCoreR * 1.05) continue;

          const embAlpha = Math.sin(embProgress * Math.PI) * sAlpha * 1.8;
          fCtx.fillStyle = `rgba(255, ${Math.floor(160 + emb.heat * 80)}, ${Math.floor(40 + emb.heat * 120)}, ${embAlpha})`;
          fCtx.beginPath();
          fCtx.arc(ex, ey, emb.size * (0.8 + tE * 0.5), 0, Math.PI * 2);
          fCtx.fill();
        }
      }
      fCtx.restore();
    }

    // 2. PARTICLES & LUMINOUS KNOTS (DEPTH SORTED)
    let activeCount = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const localT = Math.max(0, t - p.stagger * 0.5);
      let posX = 0;
      let posY = 0;
      let posZ = 0;
      let pAlpha = 0;
      let pRadius = p.radius;
      let tempR = 255;
      let tempG = 120;
      let tempB = 40;

      const radialAngle = p.initAngle;
      const isAmbientDust = (i % 6 === 0 && p.initDist > 1.5);

      if (localT < 1.4) {
        const appearP = clamp(localT / 0.9, 0, 1);
        pAlpha = p.baseAlpha * appearP;
        const curR = p.initDist * R_canonical;
        posX = cx + Math.cos(radialAngle) * curR;
        posY = cy + Math.sin(radialAngle) * curR;
        posZ = p.initZ;
        tempR = 220;
        tempG = 100;
        tempB = 50;
      } else if (isAmbientDust && localT >= 1.4) {
        const driftAngle = radialAngle + (t - 1.4) * 0.015;
        const driftR = p.initDist * R_canonical;
        posX = cx + Math.cos(driftAngle) * driftR;
        posY = cy + Math.sin(driftAngle) * driftR;
        posZ = p.initZ;
        pRadius = p.radius * 0.7;
        const fadeOut = localT >= 11.0 ? clamp((14.0 - localT) / 3.0, 0.15, 1.0) : 1.0;
        pAlpha = p.baseAlpha * 0.28 * fadeOut;
        tempR = 230;
        tempG = 120;
        tempB = 50;
      } else if (localT >= 1.4 && localT < 4.8) {
        const gatherP = clamp((localT - 1.4) / 3.4, 0, 1);
        const easeGather = smootherstep(gatherP);

        const curveAngle = radialAngle + p.curveAmp * easeGather;
        const targetR = (0.35 + (p.id % 12) * 0.05) * R_canonical;
        const curR = (p.initDist * R_canonical) * (1.0 - easeGather) + targetR * easeGather;

        posX = cx + Math.cos(curveAngle) * curR;
        posY = cy + Math.sin(curveAngle) * curR;
        posZ = p.initZ * (1.0 - easeGather) + p.tz * easeGather;

        pRadius = p.radius * (1.0 + easeGather * 0.35);
        pAlpha = clamp(p.baseAlpha * (0.8 + easeGather * 0.5), 0, 1);
        tempR = 255;
        tempG = Math.floor(90 + easeGather * 85);
        tempB = Math.floor(30 + easeGather * 45);
      } else if (localT >= 4.8 && localT < 8.2) {
        const infallDuration = 1.8 + p.stagger * 1.4;
        const pInfall = clamp((localT - 4.8) / infallDuration, 0, 1);
        const easeInfall = Math.pow(pInfall, 2.0);

        const targetR = (0.35 + (p.id % 12) * 0.05) * R_canonical;
        const curR = Math.max(0, targetR * (1.0 - easeInfall));
        const curveAngle = radialAngle + p.curveAmp * (1.0 + easeInfall * 0.5);

        posX = cx + Math.cos(curveAngle) * curR;
        posY = cy + Math.sin(curveAngle) * curR;
        posZ = p.tz * (1.0 - easeInfall);

        pRadius = Math.max(0.4, p.radius * (1.0 - easeInfall * 0.5));

        if (curR <= currentCoreR * 1.10) {
          const absorb = clamp(1.0 - curR / Math.max(1.0, currentCoreR * 1.10), 0, 1);
          pAlpha = clamp(p.baseAlpha * (1.0 - absorb), 0, 1);
        } else {
          pAlpha = clamp(p.baseAlpha * (1.0 + easeInfall * 0.25) * (1.0 - pInfall * 0.35), 0, 1);
        }

        tempR = 255;
        tempG = Math.floor(140 + easeInfall * 110);
        tempB = Math.floor(40 + easeInfall * 180);
      } else {
        pAlpha = 0;
      }

      const pDistFromCenter = Math.hypot(posX - cx, posY - cy);
      const edgeDistFade = clamp((1.35 * R_canonical - pDistFromCenter) / (0.15 * R_canonical), 0, 1);
      pAlpha *= edgeDistFade;

      if (pAlpha > 0.01 && activeCount < PARTICLE_COUNT) {
        const rp = renderPool[activeCount];
        rp.x = posX;
        rp.y = posY;
        rp.z = posZ;
        rp.radius = pRadius;
        rp.alpha = pAlpha;
        rp.r = tempR;
        rp.g = tempG;
        rp.b = tempB;
        sortIndices[activeCount] = activeCount;
        activeCount++;
      }
    }

    const activeIndices = sortIndices.subarray(0, activeCount);
    activeIndices.sort((a, b) => renderPool[a].z - renderPool[b].z);

    fCtx.save();
    for (let idx = 0; idx < activeCount; idx++) {
      const sp = renderPool[activeIndices[idx]];
      const rad = Math.max(0.8, sp.radius);
      const glowRad = rad * 2.8;
      const grad = fCtx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, glowRad);
      grad.addColorStop(0, `rgba(${sp.r}, ${sp.g}, ${sp.b}, ${sp.alpha})`);
      grad.addColorStop(0.4, `rgba(${sp.r}, ${Math.floor(sp.g * 0.7)}, ${Math.floor(sp.b * 0.4)}, ${sp.alpha * 0.65})`);
      grad.addColorStop(1, `rgba(${sp.r}, ${Math.floor(sp.g * 0.4)}, 0, 0)`);

      fCtx.fillStyle = grad;
      fCtx.beginPath();
      fCtx.arc(sp.x, sp.y, glowRad, 0, Math.PI * 2);
      fCtx.fill();

      if (sp.z > 0.2 && sp.alpha > 0.3) {
        fCtx.fillStyle = `rgba(255, 245, 210, ${sp.alpha * 0.85})`;
        fCtx.beginPath();
        fCtx.arc(sp.x, sp.y, rad * 0.45, 0, Math.PI * 2);
        fCtx.fill();
      }
    }
    fCtx.restore();

    // 3. GRAVITATIONAL ACCRETION STREAMS & IGNITION WAVE
    if (t >= 4.8 && t < 6.8) {
      fCtx.save();
      const p = (t - 4.8) / 2.0;
      const coreR = Math.max(2.0, currentCoreR);
      const singAlpha = Math.min(1.0, p * 1.6) * (1.0 - p * 0.3);

      const singGrad = fCtx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(6.0, coreR * 2.6));
      singGrad.addColorStop(0, `rgba(255, 248, 220, ${0.92 * singAlpha})`);
      singGrad.addColorStop(0.35, `rgba(255, 175, 60, ${0.55 * singAlpha})`);
      singGrad.addColorStop(0.75, `rgba(255, 90, 20, ${0.20 * singAlpha})`);
      singGrad.addColorStop(1, `rgba(255, 50, 10, 0)`);
      fCtx.fillStyle = singGrad;
      fCtx.beginPath();
      fCtx.arc(cx, cy, Math.max(6.0, coreR * 2.6), 0, Math.PI * 2);
      fCtx.fill();

      const rayFade = Math.max(0, 1.0 - p * 0.85);
      const rayCount = 12;
      fCtx.lineWidth = 1.1;
      for (let r = 0; r < rayCount; r++) {
        const rayAngle = (r / rayCount) * Math.PI * 2 + (r % 2 === 0 ? 0.08 : -0.08);
        const rayLength = coreR + (1.0 - Math.pow(p, 1.5)) * (85.0 * (minDim / 600));
        const rx1 = cx + Math.cos(rayAngle) * coreR;
        const ry1 = cy + Math.sin(rayAngle) * coreR;
        const rx2 = cx + Math.cos(rayAngle) * rayLength;
        const ry2 = cy + Math.sin(rayAngle) * rayLength;

        const rGrad = fCtx.createLinearGradient(rx2, ry2, rx1, ry1);
        rGrad.addColorStop(0, `rgba(255, 70, 20, 0)`);
        rGrad.addColorStop(0.5, `rgba(255, 155, 45, ${0.40 * rayFade})`);
        rGrad.addColorStop(1, `rgba(255, 240, 190, ${0.85 * rayFade})`);

        fCtx.strokeStyle = rGrad;
        fCtx.beginPath();
        fCtx.moveTo(rx2, ry2);
        fCtx.lineTo(rx1, ry1);
        fCtx.stroke();
      }
      fCtx.restore();
    } else if (t >= 6.8 && t < 8.2) {
      fCtx.save();
      const pIgnite = (t - 6.8) / 1.4;
      const waveAlpha = Math.sin(pIgnite * Math.PI) * 0.70;
      const coreR = currentCoreR;
      const waveR = coreR + pIgnite * 140.0 * (minDim / 600);
      const grad = fCtx.createRadialGradient(cx, cy, Math.max(0, coreR - 4), cx, cy, waveR);
      grad.addColorStop(0, `rgba(255, 235, 150, ${waveAlpha * 0.60})`);
      grad.addColorStop(0.40, `rgba(255, 150, 45, ${waveAlpha * 0.32})`);
      grad.addColorStop(0.80, `rgba(255, 80, 20, ${waveAlpha * 0.10})`);
      grad.addColorStop(1.0, `rgba(255, 50, 10, 0)`);
      fCtx.fillStyle = grad;
      fCtx.beginPath();
      fCtx.arc(cx, cy, waveR, 0, Math.PI * 2);
      fCtx.fill();
      fCtx.restore();
    }
  }

  function restartFormation() {
    if (isReduced) return;
    formationTime = 0;
    isForming = true;
    formationComplete = false;
    canvas.style.opacity = '0';
    state.growthScale = 0.035;
    state.flareBurst = 0.0;
    velX = 0;
    velY = 0;
    targetRotX = 0;
    targetRotY = 0;
    rotX = 0;
    rotY = 0;
    if (replayBtn) replayBtn.classList.remove('is-visible');
    if (formationCanvas) {
      formationCanvas.style.opacity = '1';
      if (fCtx) fCtx.clearRect(0, 0, formationCanvas.width, formationCanvas.height);
    }
    initFormationModel();
  }

  // Canonical Vertex Shader
  const vsSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  // Canonical Fragment Shader (Exact 9 dimensions preserved)
  const fsSource = `
    precision highp float;

    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_rotation;
    uniform float u_flare_intensity;
    uniform float u_flare_rays;
    uniform float u_pulse_speed;
    uniform float u_pulse_amp;
    uniform float u_plage_intensity;
    uniform float u_spot_depth;
    uniform float u_gran_speed;
    uniform float u_flare_burst;
    uniform float u_growth_scale;

    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

    float snoise(vec3 v){
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
      i = mod(i, 289.0);
      vec4 p = permute(permute(permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    float fbm(vec3 p) {
      float f = 0.0;
      f += 0.5000 * snoise(p); p = p * 2.02;
      f += 0.2500 * snoise(p); p = p * 2.03;
      f += 0.1250 * snoise(p); p = p * 2.01;
      f += 0.0625 * snoise(p);
      return f;
    }

    vec3 rotateY(vec3 p, float a) {
      float c = cos(a); float s = sin(a);
      return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
    }
    vec3 rotateX(vec3 p, float a) {
      float c = cos(a); float s = sin(a);
      return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
      float dist = length(uv);
      float angle = atan(uv.y, uv.x);

      float pulseTime = u_time * u_pulse_speed;
      float pulseCycle = sin(pulseTime * 1.4) * 0.012 + sin(pulseTime * 2.9) * 0.007 + sin(pulseTime * 0.7) * 0.005;
      float R = 0.355 * u_growth_scale * (1.0 + pulseCycle * (u_pulse_amp / 1.0));

      vec3 c_deep_red   = vec3(0.78, 0.08, 0.04);
      vec3 c_body_red   = vec3(1.00, 0.23, 0.15);
      vec3 c_warm_amber = vec3(1.00, 0.38, 0.24);
      vec3 c_spot       = vec3(0.42, 0.04, 0.02);

      vec3 c_plage_amber = vec3(1.00, 0.65, 0.15);
      vec3 c_plage_gold  = vec3(1.00, 0.85, 0.30);
      vec3 c_plage_core  = vec3(1.00, 0.96, 0.65);

      vec3 c_corona_limb  = vec3(1.00, 0.32, 0.20);
      vec3 c_corona_dense = vec3(0.92, 0.12, 0.06);
      vec3 c_corona_mid   = vec3(0.65, 0.06, 0.03);
      vec3 c_corona_outer = vec3(0.25, 0.015, 0.008);

      vec3 finalColor = vec3(0.0);

      float dNorm = (dist - R) / max(0.001, R * 0.36);
      float tCorona = u_time * 0.4 * u_gran_speed;
      vec2 polarUv = vec2(dist * 7.0 - tCorona * 0.8, angle * 5.0);
      float flameWisp1 = fbm(vec3(polarUv, tCorona * 0.3));
      float flameWisp2 = fbm(vec3(uv * 12.0 + vec2(flameWisp1 * 1.5), tCorona * 0.5));
      float flameWisp3 = snoise(vec3(uv * 24.0, tCorona * 0.7));

      float rayAngle = angle + flameWisp1 * 0.4;
      float ray1 = pow(max(0.0, sin(rayAngle * 18.0 + flameWisp2 * 2.5)), 2.0);
      float ray2 = pow(max(0.0, sin(rayAngle * 42.0 + flameWisp3 * 3.0)), 2.2);
      float rayFeather = (ray1 * 0.6 + ray2 * 0.4) * u_flare_rays;

      float prominence = smoothstep(0.35, 0.85, snoise(vec3(angle * 4.5, dist * 10.0 - u_time * 1.0, u_time * 0.3)));
      float burstProminence = smoothstep(0.30, 0.80, snoise(vec3(angle * 3.2, (dist - R) * 4.0, u_time * 0.8))) * u_flare_burst * 1.2;

      float coronaFalloff = exp(-max(0.0, dNorm) * 3.8);
      float coronaDensity = coronaFalloff * (
        0.88 +
        0.42 * flameWisp2 +
        0.32 * rayFeather +
        0.45 * prominence +
        burstProminence
      ) * u_flare_intensity;

      vec3 coronaColor = mix(c_corona_dense, c_corona_mid, smoothstep(0.0, 0.5, dNorm));
      coronaColor = mix(coronaColor, c_corona_outer, smoothstep(0.5, 1.1, dNorm));
      coronaColor *= coronaDensity * smoothstep(1.25, 0.0, dNorm);

      if (dist <= R) {
        float z = sqrt(max(0.0, R * R - dist * dist));
        vec3 normal = vec3(uv / max(0.0001, R), z / max(0.0001, R));
        float mu = normal.z;

        vec3 p = normal;
        p = rotateY(p, u_rotation.x);
        p = rotateX(p, u_rotation.y + 0.22);

        float tGran = u_time * 0.04 * u_gran_speed;
        float gran1 = snoise(p * 4.5 + vec3(0.0, 0.0, tGran));
        float gran2 = snoise(p * 10.0 + vec3(tGran, 0.0, 0.0));
        float gran = gran1 * 0.65 + gran2 * 0.35;

        vec3 surf = mix(c_deep_red, c_body_red, gran * 0.5 + 0.5);
        surf = mix(surf, c_warm_amber, smoothstep(0.2, 0.8, gran));

        float dCluster1 = length(p - vec3(-0.25, 0.12, 0.92));
        float cluster1 = smoothstep(0.35, 0.05, dCluster1) * smoothstep(0.15, 0.75, snoise(p * 12.0));

        float dCluster2 = length(p - vec3(0.42, 0.45, 0.75));
        float cluster2 = smoothstep(0.32, 0.06, dCluster2) * smoothstep(0.20, 0.80, snoise(p * 14.0 + vec3(1.2, 0.0, 0.0)));

        float dCluster3 = length(p - vec3(0.35, -0.48, 0.78));
        float cluster3 = smoothstep(0.30, 0.05, dCluster3) * smoothstep(0.18, 0.78, snoise(p * 11.0 + vec3(4.5, 2.1, 0.0)));

        float dCluster4 = length(p - vec3(-0.05, 0.65, 0.72));
        float cluster4 = smoothstep(0.22, 0.04, dCluster4) * smoothstep(0.25, 0.85, snoise(p * 15.0));

        float totalPlage = clamp((cluster1 * 1.1 + cluster2 * 1.0 + cluster3 * 0.95 + cluster4 * 0.85) * u_plage_intensity, 0.0, 1.0);

        vec3 plageColor = mix(c_plage_amber, c_plage_gold, smoothstep(0.1, 0.6, totalPlage));
        plageColor = mix(plageColor, c_plage_core, smoothstep(0.6, 0.98, totalPlage));
        surf = mix(surf, plageColor, smoothstep(0.05, 0.45, totalPlage) * 0.96);

        float dSpot1 = length(p - vec3(0.18, -0.22, 0.95));
        float spot1 = smoothstep(0.32, 0.08, dSpot1) * smoothstep(0.25, 0.70, snoise(p * 7.0));
        float dSpot2 = length(p - vec3(-0.45, -0.30, 0.82));
        float spot2 = smoothstep(0.28, 0.06, dSpot2) * smoothstep(0.25, 0.70, snoise(p * 8.0));
        float totalSpot = clamp((spot1 + spot2 * 0.8) * u_spot_depth, 0.0, 1.0);
        surf = mix(surf, c_spot, totalSpot * 0.65);

        float limbFactor = pow(mu, 0.16);
        surf *= (0.86 + 0.14 * limbFactor);

        float rimGlow = pow(1.0 - mu, 3.2) * 0.85;
        surf += c_corona_limb * rimGlow;

        float edgeAlpha = smoothstep(R, R - 0.003, dist);
        finalColor = mix(coronaColor, surf, edgeAlpha);
      } else {
        finalColor = coronaColor;
      }

      float edgeLine = smoothstep(0.007, 0.0, abs(dist - R)) * 0.75 * u_flare_intensity;
      finalColor += c_corona_limb * edgeLine;

      finalColor += vec3(1.0, 0.45, 0.22) * u_flare_burst * 0.40 * exp(-dist * 2.5);

      float outerFade = smoothstep(0.5, 0.46, dist);
      finalColor *= outerFade;

      float diskMask = smoothstep(R + 0.002, R - 0.002, dist);
      float coronaAlpha = clamp(max(finalColor.r, max(finalColor.g * 1.5, finalColor.b)), 0.0, 1.0);
      float alpha = mix(coronaAlpha, 1.0, diskMask);

      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const err = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(err);
    }
    return shader;
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const r = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(r.width * dpr));
    const height = Math.max(1, Math.floor(r.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    if (formationCanvas && (formationCanvas.width !== width || formationCanvas.height !== height)) {
      formationCanvas.width = width;
      formationCanvas.height = height;
    }
    if (formationCanvas) {
      formationCanvas.style.width = r.width + 'px';
      formationCanvas.style.height = r.height + 'px';
      formationCanvas.style.left = canvas.offsetLeft + 'px';
      formationCanvas.style.top = canvas.offsetTop + 'px';
    }
    if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function render(currentTime) {
    const dt = Math.min(0.05, (currentTime - lastTime) * 0.001);
    lastTime = currentTime;

    if (!isReduced) {
      simTime += dt;
      if (isForming) {
        updateFormation(dt);
      }
      if (!state.isDragging) {
        velX *= 0.92;
        velY *= 0.92;
        targetRotX += velX;
        targetRotY = Math.max(-1.0, Math.min(1.0, targetRotY + velY));
        autoSpin += dt * 0.12 * state.spinSpeed;
      }
      rotX += (targetRotX - rotX) * 0.25;
      rotY += (targetRotY - rotY) * 0.25;
    }

    if (!isForming) {
      if (state.flareBurst > 0.01) {
        state.flareBurst *= 0.94;
      } else {
        state.flareBurst = 0.0;
      }
    }

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.uniform2f(loc.u_resolution, canvas.width, canvas.height);
    gl.uniform1f(loc.u_time, isReduced ? 2.5 : simTime);
    gl.uniform2f(loc.u_rotation, isReduced ? 0.0 : (rotX + autoSpin), isReduced ? 0.0 : rotY);
    gl.uniform1f(loc.u_flare_intensity, state.flareIntensity);
    gl.uniform1f(loc.u_flare_rays, state.flareRays);
    gl.uniform1f(loc.u_pulse_speed, isReduced ? 0.0 : state.pulseSpeed);
    gl.uniform1f(loc.u_pulse_amp, isReduced ? 0.0 : state.pulseAmp);
    gl.uniform1f(loc.u_plage_intensity, state.plageIntensity);
    gl.uniform1f(loc.u_spot_depth, state.spotDepth);
    gl.uniform1f(loc.u_gran_speed, isReduced ? 0.0 : state.granSpeed);
    gl.uniform1f(loc.u_flare_burst, isReduced ? 0.0 : state.flareBurst);
    gl.uniform1f(loc.u_growth_scale, isReduced ? 1.0 : state.growthScale);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    if (isForming) {
      renderFormation();
    }

    if (!isReduced || state.isDragging || isForming) {
      raf = requestAnimationFrame(render);
    }
  }

  function onPointerDown(e) {
    if (isReduced) return;
    state.isDragging = true;
    activePointerId = e.pointerId;
    field.classList.add('is-dragging');
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    velX = 0;
    velY = 0;
    if (typeof field.setPointerCapture === 'function') {
      try { field.setPointerCapture(e.pointerId); } catch (_) {}
    }
  }

  function onPointerMove(e) {
    if (!state.isDragging || e.pointerId !== activePointerId || isReduced) return;
    const dx = e.clientX - lastPointerX;
    const dy = e.clientY - lastPointerY;
    velX = dx * 0.006;
    velY = dy * 0.006;
    targetRotX += velX;
    targetRotY = Math.max(-1.0, Math.min(1.0, targetRotY + velY));
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
  }

  function onPointerUp(e) {
    if (e && e.pointerId !== activePointerId && activePointerId !== null) return;
    state.isDragging = false;
    activePointerId = null;
    field.classList.remove('is-dragging');
    if (e && typeof field.releasePointerCapture === 'function') {
      try { field.releasePointerCapture(e.pointerId); } catch (_) {}
    }
  }

  function onMotionChange(e) {
    isReduced = e.matches;
    if (isReduced) {
      isForming = false;
      formationComplete = true;
      if (formationCanvas && fCtx) fCtx.clearRect(0, 0, formationCanvas.width, formationCanvas.height);
      state.isDragging = false;
      activePointerId = null;
      field.classList.remove('is-dragging');
      targetRotX = 0;
      targetRotY = 0;
      rotX = 0;
      rotY = 0;
      canvas.style.opacity = '1';
      state.flareIntensity = CANONICAL_FLARE_INTENSITY;
      state.flareRays = CANONICAL_FLARE_RAYS;
      state.pulseSpeed = CANONICAL_PULSE_SPEED;
      state.pulseAmp = CANONICAL_PULSE_AMP;
      state.plageIntensity = CANONICAL_PLAGE_INTENSITY;
      state.spotDepth = CANONICAL_SPOT_DEPTH;
      state.granSpeed = CANONICAL_GRAN_SPEED;
      state.flareBurst = 0.0;
      cancelAnimationFrame(raf);
      requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(raf);
      lastTime = performance.now();
      restartFormation();
      raf = requestAnimationFrame(render);
    }
  }

  function init() {
    try {
      gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'high-performance' })
        || canvas.getContext('experimental-webgl', { alpha: true, antialias: true });
      if (!gl) throw new Error('WebGL unavailable');

      program = gl.createProgram();
      gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vsSource));
      gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fsSource));
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program));
      }

      gl.useProgram(program);

      positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0
      ]), gl.STATIC_DRAW);

      const posAttr = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(posAttr);
      gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

      [
        'u_resolution', 'u_time', 'u_rotation', 'u_flare_intensity',
        'u_flare_rays', 'u_pulse_speed', 'u_pulse_amp', 'u_plage_intensity',
        'u_spot_depth', 'u_gran_speed', 'u_flare_burst', 'u_growth_scale'
      ].forEach(name => {
        loc[name] = gl.getUniformLocation(program, name);
      });

      initFormationModel();
      resize();
      window.addEventListener('resize', resize, { passive: true });

      field.addEventListener('pointerdown', onPointerDown, { passive: false });
      window.addEventListener('pointermove', onPointerMove, { passive: false });
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);

      if (replayBtn) {
        replayBtn.addEventListener('click', restartFormation);
      }
      window.addEventListener('keydown', function (e) {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
        if (e.key === 'r' || e.key === 'R') {
          restartFormation();
        }
      });

      if (typeof reduceMotion.addEventListener === 'function') {
        reduceMotion.addEventListener('change', onMotionChange);
      } else if (typeof reduceMotion.addListener === 'function') {
        reduceMotion.addListener(onMotionChange);
      }

      canvas.addEventListener('webglcontextlost', function (e) {
        e.preventDefault();
        cancelAnimationFrame(raf);
        document.body.classList.add('no-webgl');
      }, false);

      if (isForming) {
        canvas.style.opacity = '0';
        state.growthScale = 0.035;
      } else {
        canvas.style.opacity = '1';
        state.growthScale = 1.0;
      }

      raf = requestAnimationFrame(render);
    } catch (e) {
      document.body.classList.add('no-webgl');
    }
  }

  // Self initialize
  init();
})();
