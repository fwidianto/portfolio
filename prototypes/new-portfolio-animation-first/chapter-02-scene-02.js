  /* ==========================================================================
   CHAPTER 02: SCENE 02 CONTROLLER — THE ENGINEERING CONSTELLATION
   Five Core Disciplines Traversal & Convergence into Astra Process Line
   Stations:
     01: Thermodynamics (Q · T)
     02: Measurement (P · t)
     03: Mechanics (v · I)
     04: Control (ζ · e(t))
     05: Data & Statistics (μ · σ)
   Convergence:
     5 rays unite into Astra Agro Lestari process stream (2018)
   ========================================================================== */
(function () {
  'use strict';

  const stageWrapper = document.querySelector('.scene-02__constellation-wrapper');
  const canvas = document.getElementById('scene-02-constellation-canvas');
  const replayBtn = document.getElementById('scene-02-replay-btn');
  const globalNode = document.getElementById('constellation-global-node');
  const globalInspectBtn = document.getElementById('global-inspect-btn');
  const scene02Dossier = document.getElementById('scene-02-dossier');
  const dossierTitle = document.getElementById('scene02-dossier-title');
  const dossierYear = document.getElementById('scene02-dossier-year');
  const dossierTag = document.getElementById('scene02-dossier-tag');
  const dossierSubtitle = document.getElementById('scene02-dossier-subtitle');
  const dossierText = document.getElementById('scene02-dossier-text');

  if (!stageWrapper || !canvas) return;

  const ctx = canvas.getContext('2d');
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isReducedMotion = reduceMotionQuery.matches;

  // Station interactive action buttons & dedicated inspect buttons
  const stationActionBtns = [
    document.getElementById('station-btn-1'),
    document.getElementById('station-btn-2'),
    document.getElementById('station-btn-3'),
    document.getElementById('station-btn-4'),
    document.getElementById('station-btn-5')
  ];
  const stationBtns = stationActionBtns;

  const stationInspectBtns = [
    document.getElementById('station-inspect-1'),
    document.getElementById('station-inspect-2'),
    document.getElementById('station-inspect-3'),
    document.getElementById('station-inspect-4'),
    document.getElementById('station-inspect-5')
  ];

  /* --------------------------------------------------------------------------
     DOSSIER ARCHIVE CONTENT (5 EXPERIMENTS + GLOBAL STORY)
     Real college mechanical engineering learning journey at Universitas Indonesia
     -------------------------------------------------------------------------- */
  const DOSSIER_ENTRIES = {
    global: {
      year: '2015–2017',
      title: 'Foundations of Engineering Inquiry',
      tag: 'Undergraduate Curriculum',
      subtitle: 'Universitas Indonesia · Mechanical Engineering',
      text: 'Across laboratory benches and lecture halls, distinct physical principles converged into a unified way of seeing the world. Engineering was learned not through abstract formulas alone, but through the rigorous cycle of physical experiment, precision measurement, and system modeling.'
    },
    1: {
      year: '2015–2016',
      title: 'Thermodynamic Cycles & Heat Transfer',
      tag: 'Experiment 01 · Thermal Physics',
      subtitle: 'Heat Flux & Energy Conservation (Q · T)',
      text: 'Grounding in energy conservation, thermal flux, and enthalpy. Understanding how invisible temperature differentials and phase changes govern the capacity to do mechanical work in physical machinery.'
    },
    2: {
      year: '2015–2016',
      title: 'Instrumentation & Dynamic Response',
      tag: 'Experiment 02 · Experimental Measurement',
      subtitle: 'Sensor Dynamics & Transducer Lag (P · t)',
      text: 'Sensor calibration, transducer lag, and transient pressure response. Learning that every physical measurement is shaped by the dynamic response characteristics and latency of the instrument itself.'
    },
    3: {
      year: '2016–2017',
      title: 'Kinematics & Machine Dynamics',
      tag: 'Experiment 03 · Mechanics & Geometry',
      subtitle: 'Constraint Geometry & Instant Centers (v · I)',
      text: 'Constraint geometry, velocity vectors, and instantaneous centers of rotation. Mapping how rigid four-bar linkages translate rotational power into constrained planar mechanical motion.'
    },
    4: {
      year: '2016–2017',
      title: 'Feedback Dynamics & Stability',
      tag: 'Experiment 04 · Control Systems',
      subtitle: 'Closed-Loop Damping & Error Rejection (ζ · e)',
      text: 'Closed-loop feedback, second-order damping ratios (ζ), and disturbance rejection. Exploring how dynamical systems maintain equilibrium when perturbed from their setpoint.'
    },
    5: {
      year: '2016–2017',
      title: 'Experimental Variance & Distributions',
      tag: 'Experiment 05 · Engineering Statistics',
      subtitle: 'Stochastic Sampling & Confidence Limits (μ · σ)',
      text: 'Stochastic sampling, Gaussian distributions, and measurement variance (μ ± σ). Learning to separate genuine physical signal from experimental noise across repeated trials.'
    }
  };

  // Canvas size and DPR management
  let width = 0;
  let height = 0;
  let dpr = 1;

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = stageWrapper.offsetWidth || (window.innerWidth < 640 ? 360 : 1240);
    height = stageWrapper.offsetHeight || (window.innerWidth < 640 ? 1180 : 860);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function boxMuller() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  /* --------------------------------------------------------------------------
     SIMULATION STATE FOR 5 STATIONS
     -------------------------------------------------------------------------- */
  // Station 1: Thermodynamics
  const thermal = {
    energy: 0,
    time: 0,
    particles: []
  };
  for (let i = 0; i < 24; i++) {
    thermal.particles.push({
      x: (Math.random() - 0.5) * 80,
      y: (Math.random() * 30 - 15),
      vy: 0.4 + Math.random() * 0.6,
      vx: (Math.random() - 0.5) * 0.3,
      alpha: 0.15 + Math.random() * 0.35,
      size: 1.0 + Math.random() * 1.5,
      life: Math.random()
    });
  }

  // Station 2: Measurement
  const measure = {
    target: 40.0,
    current: 40.0,
    velocity: 0,
    follower: 40.0,
    history: new Array(80).fill(40.0),
    time: 0
  };

  // Station 3: Mechanics
  const mechanics = {
    crankAngle: 0,
    crankSpeed: 1.5,
    targetSpeed: 1.5,
    impulseTimer: 0,
    trail: []
  };

  // Station 4: Control
  const control = {
    theta: 0,
    thetaVel: 0,
    cartX: 0,
    cartVel: 0,
    phaseHistory: [],
    time: 0
  };

  // Station 5: Data & Statistics
  const dataStats = {
    points: [],
    factor: 1.0,
    time: 0
  };
  for (let i = 0; i < 48; i++) {
    dataStats.points.push({
      z: boxMuller() * 0.95,
      scatterX: 0,
      scatterY: 0,
      size: 1.8 + Math.random() * 1.4,
      jitterOffset: Math.random() * Math.PI * 2
    });
  }

  /* --------------------------------------------------------------------------
     TRAVERSAL TIMELINE STATE
     -------------------------------------------------------------------------- */
  let timeline = 0;
  const DURATION = 17.5;
  let isPlaying = false;
  let isSettled = false;
  let hasTriggered = false;
  let animFrameId = null;
  let lastTime = 0;

  function getStationCoords() {
    const isMobile = width < 640;
    const cx = width / 2;

    if (isMobile) {
      return {
        topEntry: { x: cx, y: 15 },
        s1: { x: cx, y: 160 },
        s2: { x: cx, y: 360 },
        s3: { x: cx, y: 595 },
        s4: { x: cx, y: 815 },
        s5: { x: cx, y: 1030 },
        core: { x: cx, y: 1100 }
      };
    }

    return {
      topEntry: { x: cx, y: 15 },
      s1: { x: cx - 320, y: 180 },
      s2: { x: cx + 320, y: 180 },
      core: { x: cx, y: 325 },
      s3: { x: cx - 330, y: 575 },
      s4: { x: cx + 330, y: 575 },
      s5: { x: cx, y: 700 }
    };
  }

  function getTraversingSignalPos(t) {
    const coords = getStationCoords();
    if (t < 2.5) {
      const u = t / 2.5;
      const ease = u * u * (3 - 2 * u);
      return {
        x: lerp(coords.topEntry.x, coords.s1.x, ease),
        y: lerp(coords.topEntry.y, coords.s1.y, ease),
        active: 0
      };
    } else if (t < 5.0) {
      return { x: coords.s1.x, y: coords.s1.y, active: 1 };
    } else if (t < 7.5) {
      const u = (t - 5.0) / 2.5;
      const ease = u * u * (3 - 2 * u);
      return {
        x: lerp(coords.s1.x, coords.s2.x, ease),
        y: lerp(coords.s1.y, coords.s2.y, ease),
        active: 2
      };
    } else if (t < 10.0) {
      const u = (t - 7.5) / 2.5;
      if (u < 0.5) {
        const u2 = u * 2;
        return {
          x: lerp(coords.s2.x, coords.core.x, u2),
          y: lerp(coords.s2.y, coords.core.y, u2),
          active: 2
        };
      } else {
        const u2 = (u - 0.5) * 2;
        return {
          x: lerp(coords.core.x, coords.s3.x, u2),
          y: lerp(coords.core.y, coords.s3.y, u2),
          active: 3
        };
      }
    } else if (t < 12.5) {
      const u = (t - 10.0) / 2.5;
      const ease = u * u * (3 - 2 * u);
      return {
        x: lerp(coords.s3.x, coords.s4.x, ease),
        y: lerp(coords.s3.y, coords.s4.y, ease),
        active: 4
      };
    } else if (t < 15.0) {
      const u = (t - 12.5) / 2.5;
      const ease = u * u * (3 - 2 * u);
      return {
        x: lerp(coords.s4.x, coords.s5.x, ease),
        y: lerp(coords.s4.y, coords.s5.y, ease),
        active: 5
      };
    } else if (t < 17.5) {
      const u = (t - 15.0) / 2.5;
      const ease = u * u * (3 - 2 * u);
      return {
        x: lerp(coords.s5.x, coords.core.x, ease),
        y: lerp(coords.s5.y, coords.core.y, ease),
        active: 6
      };
    } else {
      return {
        x: coords.core.x,
        y: coords.core.y,
        active: 6
      };
    }
  }

  /* --------------------------------------------------------------------------
     STATION MICRO-INTERACTIONS
     -------------------------------------------------------------------------- */
  function triggerStation1() {
    thermal.energy = 1.0;
    if (stationActionBtns[0]) {
      stationActionBtns[0].classList.add('is-active');
      setTimeout(() => stationActionBtns[0] && stationActionBtns[0].classList.remove('is-active'), 1200);
    }
  }

  function triggerStation2() {
    measure.target = measure.target > 55 ? 24.0 : 86.0;
    measure.velocity += (measure.target > 55 ? 45 : -45);
    if (stationActionBtns[1]) {
      stationActionBtns[1].classList.add('is-active');
      setTimeout(() => stationActionBtns[1] && stationActionBtns[1].classList.remove('is-active'), 1200);
    }
  }

  function triggerStation3() {
    mechanics.crankSpeed = 5.5;
    mechanics.impulseTimer = 2.2;
    if (stationActionBtns[2]) {
      stationActionBtns[2].classList.add('is-active');
      setTimeout(() => stationActionBtns[2] && stationActionBtns[2].classList.remove('is-active'), 1200);
    }
  }

  function triggerStation4() {
    control.theta = 0.75;
    control.thetaVel = 1.4;
    control.cartVel = -160;
    control.phaseHistory.length = 0;
    if (stationActionBtns[3]) {
      stationActionBtns[3].classList.add('is-active');
      setTimeout(() => stationActionBtns[3] && stationActionBtns[3].classList.remove('is-active'), 1200);
    }
  }

  function triggerStation5() {
    dataStats.factor = 0.0;
    dataStats.points.forEach(p => {
      p.scatterX = (Math.random() - 0.5) * 320;
      p.scatterY = (Math.random() - 0.5) * 90;
    });
    if (stationActionBtns[4]) {
      stationActionBtns[4].classList.add('is-active');
      setTimeout(() => stationActionBtns[4] && stationActionBtns[4].classList.remove('is-active'), 1200);
    }
  }

  let t1Triggered = false;
  let t2Triggered = false;
  let t3Triggered = false;
  let t4Triggered = false;
  let t5Triggered = false;

  function updateTimelineTriggers(t) {
    if (t >= 2.5 && !t1Triggered) {
      t1Triggered = true;
      triggerStation1();
    }
    if (t >= 7.5 && !t2Triggered) {
      t2Triggered = true;
      triggerStation2();
    }
    if (t >= 10.0 && !t3Triggered) {
      t3Triggered = true;
      triggerStation3();
    }
    if (t >= 12.5 && !t4Triggered) {
      t4Triggered = true;
      triggerStation4();
    }
    if (t >= 15.0 && !t5Triggered) {
      t5Triggered = true;
      triggerStation5();
    }
  }

  /* --------------------------------------------------------------------------
     PHYSICS & SIMULATION STEPPERS
     -------------------------------------------------------------------------- */
  function updatePhysics(dt) {
    // 1. Thermodynamics
    thermal.time += dt;
    if (thermal.energy > 0.005) {
      thermal.energy *= Math.exp(-dt * 0.95);
      if (thermal.energy <= 0.005) {
        thermal.energy = 0;
        if (stationBtns[0]) stationBtns[0].classList.remove('is-active');
      }
    }
    thermal.particles.forEach(p => {
      p.y -= (p.vy + thermal.energy * 1.8) * (60 * dt);
      p.x += Math.sin(thermal.time * 3 + p.y * 0.05) * 0.25;
      p.life += dt * 0.5;
      if (p.y < -55 || p.life > 1) {
        p.x = (Math.random() - 0.5) * 80;
        p.y = (Math.random() * 12 - 4);
        p.life = 0;
      }
    });

    // 2. Measurement
    measure.time += dt;
    const omegaN2 = 14.0;
    const zeta2 = 0.38;
    const accel2 = -2 * zeta2 * omegaN2 * measure.velocity - omegaN2 * omegaN2 * (measure.current - measure.target);
    measure.velocity += accel2 * dt;
    measure.current += measure.velocity * dt;
    measure.follower += (measure.current - measure.follower) * (6.0 * dt);

    const jitter = (Math.sin(measure.time * 22) + Math.sin(measure.time * 37)) * 0.35;
    measure.history.push(measure.current + jitter);
    if (measure.history.length > 80) measure.history.shift();

    if (Math.abs(measure.current - measure.target) < 0.5 && Math.abs(measure.velocity) < 0.5) {
      if (stationBtns[1]) stationBtns[1].classList.remove('is-active');
    }

    // 3. Mechanics
    if (mechanics.impulseTimer > 0) {
      mechanics.impulseTimer -= dt;
      mechanics.crankSpeed += (mechanics.targetSpeed - mechanics.crankSpeed) * (2.2 * dt);
      if (mechanics.impulseTimer <= 0) {
        mechanics.crankSpeed = mechanics.targetSpeed;
        if (stationBtns[2]) stationBtns[2].classList.remove('is-active');
      }
    }
    mechanics.crankAngle += mechanics.crankSpeed * dt;

    // 4. Control
    control.time += dt;
    const omegaN4 = 5.6;
    const zeta4 = 0.28;
    const thetaAcc = -2 * zeta4 * omegaN4 * control.thetaVel - (omegaN4 * omegaN4) * control.theta;
    control.thetaVel += thetaAcc * dt;
    control.theta += control.thetaVel * dt;

    const cartTarget = -control.theta * 45;
    control.cartVel += (cartTarget - control.cartX) * 12 * dt - control.cartVel * 3 * dt;
    control.cartX += control.cartVel * dt;

    control.phaseHistory.push({ x: control.theta, y: control.thetaVel });
    if (control.phaseHistory.length > 60) control.phaseHistory.shift();

    if (Math.abs(control.theta) < 0.015 && Math.abs(control.thetaVel) < 0.02) {
      control.theta = 0;
      control.thetaVel = 0;
      control.cartX += (0 - control.cartX) * 4 * dt;
      if (stationBtns[3]) stationBtns[3].classList.remove('is-active');
    }

    // 5. Data & Statistics
    dataStats.time += dt;
    if (dataStats.factor < 1.0) {
      dataStats.factor += dt * 0.45;
      if (dataStats.factor >= 1.0) {
        dataStats.factor = 1.0;
        if (stationBtns[4]) stationBtns[4].classList.remove('is-active');
      }
    }
  }

  /* --------------------------------------------------------------------------
     CANVAS RENDERING: FIVE STATIONS WITH FULL INSTRUMENTATION & ANNOTATIONS
     -------------------------------------------------------------------------- */
  function renderStation1(ox, oy, sf) {
    ctx.save();
    ctx.translate(ox, oy);

    // 1. Base Datum Line & Millimeter Ticks
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-75 * sf, 34 * sf);
    ctx.lineTo(75 * sf, 34 * sf);
    ctx.stroke();

    for (let x = -65; x <= 65; x += 13) {
      ctx.beginPath();
      ctx.moveTo(x * sf, 34 * sf);
      ctx.lineTo(x * sf, 38 * sf);
      ctx.stroke();
    }

    // 2. Insulator Stanchions with Cooling Ribs
    [-46, 46].forEach(sx => {
      ctx.fillStyle = 'rgba(18, 24, 38, 0.9)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath();
      ctx.rect((sx - 6) * sf, 8 * sf, 12 * sf, 26 * sf);
      ctx.fill();
      ctx.stroke();

      for (let ry = 14; ry <= 26; ry += 6) {
        ctx.beginPath();
        ctx.moveTo((sx - 8) * sf, ry * sf);
        ctx.lineTo((sx + 8) * sf, ry * sf);
        ctx.stroke();
      }
    });

    // 3. Thermal Diffusion Field (Radial Gradient & Expanding Hairline Wavefront Rings)
    if (thermal.energy > 0.02) {
      const rad = (42 + (1 - thermal.energy) * 62) * sf;
      const grad = ctx.createRadialGradient(0, 0, 5 * sf, 0, 0, rad);
      grad.addColorStop(0, `rgba(255, 170, 112, ${0.45 * thermal.energy})`);
      grad.addColorStop(0.4, `rgba(255, 85, 34, ${0.22 * thermal.energy})`);
      grad.addColorStop(1, 'rgba(255, 85, 34, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, rad, 0, Math.PI * 2);
      ctx.fill();

      // Expanding hairline thermal wavefront rings
      for (let ring = 1; ring <= 3; ring++) {
        const rRadius = ((thermal.time * 65 * ring) % 95 + 20) * sf;
        const rAlpha = Math.max(0, (1 - rRadius / (95 * sf)) * thermal.energy * 0.42);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 170, 112, ${rAlpha})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 5]);
        ctx.arc(0, 0, rRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // 4. Convection Warmth Micro-Particles
    thermal.particles.forEach(p => {
      const pAlpha = Math.max(0, (1 - (-p.y) / (55 * sf)) * (0.15 + thermal.energy * 0.65));
      ctx.fillStyle = thermal.energy > 0.3
        ? `rgba(255, 230, 200, ${pAlpha})`
        : `rgba(255, 130, 60, ${pAlpha * 0.5})`;
      ctx.beginPath();
      ctx.arc(p.x * sf, p.y * sf, p.size * (1 + thermal.energy * 0.6) * sf, 0, Math.PI * 2);
      ctx.fill();
    });

    // 5. Electrical Resistance Helical Heating Coil
    const turns = 8;
    const coilW = 92 * sf;
    const step = coilW / turns;
    const coilLeft = -coilW / 2;

    if (thermal.energy > 0.05) {
      ctx.shadowColor = '#ff5522';
      ctx.shadowBlur = 14 * thermal.energy * sf;
    }

    ctx.beginPath();
    ctx.moveTo(coilLeft, 0);
    for (let i = 0; i < turns; i++) {
      const x1 = coilLeft + i * step;
      const x2 = x1 + step;
      const mid = (x1 + x2) / 2;
      const amp = (i % 2 === 0 ? -13 : 13) * sf;
      ctx.quadraticCurveTo(mid, amp, x2, 0);
    }
    const coilColor = thermal.energy > 0.4
      ? `rgba(255, 245, 230, ${0.85 + thermal.energy * 0.15})`
      : `rgba(255, 120, 50, ${0.4 + thermal.energy * 0.5})`;
    ctx.strokeStyle = coilColor;
    ctx.lineWidth = (2.0 + thermal.energy * 1.6) * sf;
    ctx.lineCap = 'round';
    ctx.stroke();

    if (thermal.energy > 0.2) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.0 * sf;
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

    // 6. Thermocouple Stem & Tip Bead
    const probeTopY = -48 * sf;
    const probeTipY = -2 * sf;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(0, probeTopY);
    ctx.lineTo(0, probeTipY);
    ctx.stroke();

    ctx.fillStyle = thermal.energy > 0.1 ? '#ffe8d0' : 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(0, probeTipY, (thermal.energy > 0.2 ? 3.8 : 2.6) * sf, 0, Math.PI * 2);
    ctx.fill();

    // 7. Dynamic Temperature Readout HUD Text (Annotated T in °C)
    const currentTemp = 24.5 + thermal.energy * 68.2;
    ctx.font = `600 ${Math.round(10 * sf)}px var(--ch02-font-mono)`;
    ctx.fillStyle = thermal.energy > 0.2 ? '#ffaa70' : 'rgba(255, 255, 255, 0.65)';
    ctx.textAlign = 'center';
    ctx.fillText(`T: ${currentTemp.toFixed(1)}°C`, 0, probeTopY - 6 * sf);

    ctx.restore();
  }

  function renderStation2(ox, oy, sf) {
    ctx.save();
    ctx.translate(ox, oy);

    const dialR = 36 * sf;
    const dialCx = -40 * sf;
    const dialCy = 2 * sf;

    // 1. Dial Gauge Outer Housing
    ctx.fillStyle = 'rgba(12, 16, 26, 0.95)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1.2 * sf;
    ctx.beginPath();
    ctx.arc(dialCx, dialCy, dialR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Scale Arc graduations (-140 deg to +40 deg)
    const startAngle = (140 * Math.PI) / 180;
    const endAngle = (400 * Math.PI) / 180;

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]);
    ctx.arc(dialCx, dialCy, dialR - 9 * sf, startAngle, endAngle);
    ctx.stroke();
    ctx.setLineDash([]);

    // Radial Ticks (0 to 100)
    for (let val = 0; val <= 100; val += 20) {
      const u = val / 100;
      const rad = startAngle + u * (endAngle - startAngle);
      const rInner = dialR - 10 * sf;
      const rOuter = dialR - 4 * sf;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.moveTo(dialCx + Math.cos(rad) * rInner, dialCy + Math.sin(rad) * rInner);
      ctx.lineTo(dialCx + Math.cos(rad) * rOuter, dialCy + Math.sin(rad) * rOuter);
      ctx.stroke();
    }

    // Gauge Pressure Label (kPa)
    ctx.font = `600 ${Math.round(8.5 * sf)}px var(--ch02-font-mono)`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.textAlign = 'center';
    ctx.fillText('kPa', dialCx, dialCy + 16 * sf);

    // Follower Viscous Needle (Trails behind)
    const uFollow = clamp(measure.follower / 100, 0, 1);
    const radFollow = startAngle + uFollow * (endAngle - startAngle);
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.1 * sf;
    ctx.moveTo(dialCx, dialCy);
    ctx.lineTo(dialCx + Math.cos(radFollow) * (dialR - 10 * sf), dialCy + Math.sin(radFollow) * (dialR - 10 * sf));
    ctx.stroke();

    // Primary Dynamic Needle (Amber with glow)
    const uNeedle = clamp(measure.current / 100, 0, 1);
    const radNeedle = startAngle + uNeedle * (endAngle - startAngle);
    ctx.beginPath();
    ctx.strokeStyle = '#ffaa70';
    ctx.lineWidth = 1.6 * sf;
    ctx.lineCap = 'round';
    ctx.shadowColor = '#ff6b35';
    ctx.shadowBlur = 5 * sf;
    ctx.moveTo(dialCx, dialCy);
    ctx.lineTo(dialCx + Math.cos(radNeedle) * (dialR - 7 * sf), dialCy + Math.sin(radNeedle) * (dialR - 7 * sf));
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Needle Center Pivot
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(dialCx, dialCy, 2.6 * sf, 0, Math.PI * 2);
    ctx.fill();

    // Dynamic Pressure Readout HUD Text (P in kPa)
    ctx.font = `600 ${Math.round(9.5 * sf)}px var(--ch02-font-mono)`;
    ctx.fillStyle = '#ffaa70';
    ctx.textAlign = 'center';
    ctx.fillText(`P: ${measure.current.toFixed(1)} kPa`, dialCx, dialCy - dialR - 6 * sf);

    // 2. Micro-Oscilloscope Sparkline Display (Right flank)
    const scW = 68 * sf;
    const scH = 46 * sf;
    const scX = 12 * sf;
    const scY = -21 * sf;

    // Frame
    ctx.fillStyle = 'rgba(8, 12, 20, 0.9)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(scX, scY, scW, scH);
    ctx.fill();
    ctx.stroke();

    // Grid division lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(scX, scY + scH / 2);
    ctx.lineTo(scX + scW, scY + scH / 2);
    ctx.moveTo(scX + scW / 2, scY);
    ctx.lineTo(scX + scW / 2, scY + scH);
    ctx.stroke();

    // Scope HUD Label: ΔP(t)
    ctx.font = `500 ${Math.round(8 * sf)}px var(--ch02-font-mono)`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.textAlign = 'left';
    ctx.fillText('ΔP(t)', scX + 5 * sf, scY + 11 * sf);

    // Live waveform trace
    ctx.save();
    ctx.beginPath();
    ctx.rect(scX + 1, scY + 1, scW - 2, scH - 2);
    ctx.clip();

    ctx.beginPath();
    ctx.strokeStyle = '#ffaa70';
    ctx.lineWidth = 1.3 * sf;
    ctx.lineJoin = 'round';
    for (let i = 0; i < measure.history.length; i++) {
      const hVal = measure.history[i];
      const hx = scX + (i / (measure.history.length - 1)) * scW;
      const hy = scY + scH - 5 * sf - (hVal / 100) * (scH - 10 * sf);
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.stroke();

    // Leading beam head dot
    const lastX = scX + scW - 2;
    const lastY = scY + scH - 5 * sf - (measure.current / 100) * (scH - 10 * sf);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(lastX, lastY, 1.8 * sf, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  function renderStation3(ox, oy, sf) {
    ctx.save();
    ctx.translate(ox, oy);

    const L1 = 26 * sf;
    const L2 = 78 * sf;
    const L3 = 52 * sf;
    const L0 = 90 * sf;

    const Ax = -L0 / 2;
    const Ay = 18 * sf;
    const Dx = L0 / 2;
    const Dy = 18 * sf;

    const Bx = Ax + L1 * Math.cos(mechanics.crankAngle);
    const By = Ay - L1 * Math.sin(mechanics.crankAngle);

    const dBD = Math.hypot(Dx - Bx, Dy - By);
    const angleBD = Math.atan2(Dy - By, Dx - Bx);
    const cosAngleCBD = clamp((L2 * L2 + dBD * dBD - L3 * L3) / (2 * L2 * dBD), -1, 1);
    const angleCBD = Math.acos(cosAngleCBD);
    const angleBC = angleBD - angleCBD;

    const Cx = Bx + L2 * Math.cos(angleBC);
    const Cy = By + L2 * Math.sin(angleBC);

    // Coupler tracer point P (rigid triangle extending off link BC)
    const Px = Bx + L2 * 0.55 * Math.cos(angleBC) - 22 * sf * Math.sin(angleBC);
    const Py = By + L2 * 0.55 * Math.sin(angleBC) + 22 * sf * Math.cos(angleBC);

    mechanics.trail.push({ x: Px, y: Py });
    if (mechanics.trail.length > 55) mechanics.trail.shift();

    // 1. Ground Datum & Hatching at A and D
    [{ x: Ax, y: Ay }, { x: Dx, y: Dy }].forEach(p => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x - 9 * sf, p.y + 8 * sf);
      ctx.lineTo(p.x + 9 * sf, p.y + 8 * sf);
      ctx.stroke();

      for (let h = -6; h <= 6; h += 4) {
        ctx.beginPath();
        ctx.moveTo((p.x + h) * sf, p.y + 8 * sf);
        ctx.lineTo((p.x + h - 3) * sf, p.y + 12 * sf);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - 7 * sf, p.y + 8 * sf);
      ctx.lineTo(p.x + 7 * sf, p.y + 8 * sf);
      ctx.closePath();
      ctx.stroke();
    });

    // 2. CAD Pitch Circle of Crank (dashed)
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]);
    ctx.arc(Ax, Ay, L1, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Instantaneous Center of Rotation (I_13) Construction Lines
    const mAB = (By - Ay) / (Bx - Ax);
    const mDC = (Cy - Dy) / (Cx - Dx);
    if (Math.abs(mAB - mDC) > 0.08) {
      const Ix = (mAB * Ax - mDC * Dx + Dy - Ay) / (mAB - mDC);
      const Iy = Ay + mAB * (Ix - Ax);
      if (Math.abs(Ix) < 170 * sf && Math.abs(Iy) < 135 * sf) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 170, 112, 0.2)';
        ctx.lineWidth = 0.8;
        ctx.setLineDash([2, 3]);
        ctx.moveTo(Ax, Ay);
        ctx.lineTo(Ix, Iy);
        ctx.moveTo(Dx, Dy);
        ctx.lineTo(Ix, Iy);
        ctx.stroke();
        ctx.setLineDash([]);

        // I13 Crosshair
        ctx.strokeStyle = 'rgba(255, 170, 112, 0.65)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(Ix - 4 * sf, Iy);
        ctx.lineTo(Ix + 4 * sf, Iy);
        ctx.moveTo(Ix, Iy - 4 * sf);
        ctx.lineTo(Ix, Iy + 4 * sf);
        ctx.stroke();

        ctx.font = `500 ${Math.round(8 * sf)}px var(--ch02-font-mono)`;
        ctx.fillStyle = 'rgba(255, 170, 112, 0.75)';
        ctx.textAlign = 'left';
        ctx.fillText('I₁₃', Ix + 5 * sf, Iy - 3 * sf);
      }
    }

    // 4. Coupler Phosphor Trail
    if (mechanics.trail.length > 2) {
      ctx.beginPath();
      for (let i = 0; i < mechanics.trail.length; i++) {
        const pt = mechanics.trail[i];
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = 'rgba(255, 170, 112, 0.32)';
      ctx.lineWidth = 1.1 * sf;
      ctx.stroke();
    }

    // 5. Mechanical Links
    // Crank AB (drive link)
    ctx.beginPath();
    ctx.moveTo(Ax, Ay);
    ctx.lineTo(Bx, By);
    ctx.strokeStyle = '#ffaa70';
    ctx.lineWidth = 2.2 * sf;
    ctx.stroke();

    // Coupler BC and rigid tracer triangle to P
    ctx.beginPath();
    ctx.moveTo(Bx, By);
    ctx.lineTo(Cx, Cy);
    ctx.lineTo(Px, Py);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 1.6 * sf;
    ctx.stroke();

    // Rocker CD
    ctx.beginPath();
    ctx.moveTo(Cx, Cy);
    ctx.lineTo(Dx, Dy);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 1.6 * sf;
    ctx.stroke();

    // 6. KINETIC VELOCITY VECTOR AT B (v_B)
    const vScale = 16 * sf * (mechanics.crankSpeed / 1.5);
    const vBx = -Math.sin(mechanics.crankAngle) * vScale;
    const vBy = -Math.cos(mechanics.crankAngle) * vScale;

    ctx.beginPath();
    ctx.moveTo(Bx, By);
    ctx.lineTo(Bx + vBx, By + vBy);
    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth = 1.5 * sf;
    ctx.stroke();

    // Vector Arrowhead
    const vBHeadAngle = Math.atan2(vBy, vBx);
    ctx.beginPath();
    ctx.moveTo(Bx + vBx, By + vBy);
    ctx.lineTo(Bx + vBx - 5 * sf * Math.cos(vBHeadAngle - 0.45), By + vBy - 5 * sf * Math.sin(vBHeadAngle - 0.45));
    ctx.lineTo(Bx + vBx - 5 * sf * Math.cos(vBHeadAngle + 0.45), By + vBy - 5 * sf * Math.sin(vBHeadAngle + 0.45));
    ctx.closePath();
    ctx.fillStyle = '#ff6b35';
    ctx.fill();

    // Vector Label: v_B
    ctx.font = `600 ${Math.round(8.5 * sf)}px var(--ch02-font-mono)`;
    ctx.fillStyle = '#ffaa70';
    ctx.textAlign = 'left';
    ctx.fillText('v_B', Bx + vBx + 4 * sf, By + vBy - 2 * sf);

    // 7. Link Pins (A, B, C, D, P)
    [{ x: Ax, y: Ay }, { x: Bx, y: By }, { x: Cx, y: Cy }, { x: Dx, y: Dy }, { x: Px, y: Py }].forEach((pin, i) => {
      ctx.fillStyle = i === 4 ? '#ffaa70' : '#ffffff';
      ctx.beginPath();
      ctx.arc(pin.x, pin.y, (i === 4 ? 3.2 : 2.5) * sf, 0, Math.PI * 2);
      ctx.fill();
    });

    // 8. Dynamic Angular Speed HUD Text
    ctx.font = `600 ${Math.round(9.5 * sf)}px var(--ch02-font-mono)`;
    ctx.fillStyle = mechanics.crankSpeed > 2.0 ? '#ffaa70' : 'rgba(255, 255, 255, 0.65)';
    ctx.textAlign = 'center';
    ctx.fillText(`ω: ${mechanics.crankSpeed.toFixed(1)} rad/s`, (Ax + Dx) / 2, Ay + 25 * sf);

    ctx.restore();
  }

  function renderStation4(ox, oy, sf) {
    ctx.save();
    ctx.translate(ox, oy);

    const railY = 22 * sf;
    const railW = 124 * sf;

    // 1. Horizontal Linear Guide Rail & Millimeter Graduations
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-railW / 2, railY);
    ctx.lineTo(railW / 2, railY);
    ctx.stroke();

    for (let rx = -railW / 2 + 8 * sf; rx <= railW / 2 - 8 * sf; rx += 8 * sf) {
      ctx.beginPath();
      ctx.moveTo(rx, railY);
      ctx.lineTo(rx, railY + 3 * sf);
      ctx.stroke();
    }

    // End stops
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-railW / 2, railY - 6 * sf);
    ctx.lineTo(-railW / 2, railY + 6 * sf);
    ctx.moveTo(railW / 2, railY - 6 * sf);
    ctx.lineTo(railW / 2, railY + 6 * sf);
    ctx.stroke();

    // Target Zero-Datum Centerline (dashed)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 0.9;
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.moveTo(0, railY - 65 * sf);
    ctx.lineTo(0, railY + 8 * sf);
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Moving Servo Carriage with Precision Wheels
    const curCartX = control.cartX * sf * 0.7;
    const cartW = 34 * sf;
    const cartH = 14 * sf;
    const cartY = railY - cartH - 2 * sf;

    ctx.fillStyle = 'rgba(18, 24, 38, 0.95)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(curCartX - cartW / 2, cartY, cartW, cartH, 2);
    ctx.fill();
    ctx.stroke();

    // Carriage wheels
    ctx.fillStyle = '#6b7280';
    [-10, 10].forEach(wx => {
      ctx.beginPath();
      ctx.arc(curCartX + wx * sf, railY - 2.5 * sf, 2.8 * sf, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Inverted Pendulum Rod & Tip Inertia Bob
    const pivotX = curCartX;
    const pivotY = cartY + 3 * sf;
    const rodL = 54 * sf;
    const tipX = pivotX + rodL * Math.sin(control.theta);
    const tipY = pivotY - rodL * Math.cos(control.theta);

    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(tipX, tipY);
    ctx.strokeStyle = '#f5f2eb';
    ctx.lineWidth = 1.6 * sf;
    ctx.stroke();

    ctx.fillStyle = Math.abs(control.theta) > 0.05 ? '#ffaa70' : '#ffffff';
    if (Math.abs(control.theta) > 0.05) {
      ctx.shadowColor = '#ff6b35';
      ctx.shadowBlur = 6 * sf;
    }
    ctx.beginPath();
    ctx.arc(tipX, tipY, 4.8 * sf, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Pivot Pin
    ctx.fillStyle = '#ffaa70';
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 2.2 * sf, 0, Math.PI * 2);
    ctx.fill();

    // 4. Phase-Plane Error Trajectory Monitor (e vs ė)
    const pW = 54 * sf;
    const pH = 44 * sf;
    const pX = 36 * sf;
    const pY = -42 * sf;

    ctx.fillStyle = 'rgba(6, 10, 16, 0.88)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(pX, pY, pW, pH);
    ctx.fill();
    ctx.stroke();

    // Crosshairs
    const pMidX = pX + pW / 2;
    const pMidY = pY + pH / 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.beginPath();
    ctx.moveTo(pX, pMidY);
    ctx.lineTo(pX + pW, pMidY);
    ctx.moveTo(pMidX, pY);
    ctx.lineTo(pMidX, pY + pH);
    ctx.stroke();

    // Monitor HUD label
    ctx.font = `500 ${Math.round(7.5 * sf)}px var(--ch02-font-mono)`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.textAlign = 'left';
    ctx.fillText('e vs ė', pX + 4 * sf, pY + 9 * sf);

    // Live spiral trajectory
    if (control.phaseHistory.length > 2) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 170, 112, 0.75)';
      ctx.lineWidth = 1.1;
      ctx.lineJoin = 'round';
      for (let i = 0; i < control.phaseHistory.length; i++) {
        const pt = control.phaseHistory[i];
        const hx = pMidX + pt.x * (pW * 0.55);
        const hy = pMidY - pt.y * (pH * 0.2);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.stroke();
    }

    // 5. Dynamic Deflection Angle HUD Text (θ in degrees)
    const deg = (control.theta * 180 / Math.PI);
    ctx.font = `600 ${Math.round(9.5 * sf)}px var(--ch02-font-mono)`;
    ctx.fillStyle = Math.abs(deg) > 2 ? '#ffaa70' : 'rgba(255, 255, 255, 0.65)';
    ctx.textAlign = 'center';
    ctx.fillText(`θ: ${deg.toFixed(1)}°`, -28 * sf, -38 * sf);

    ctx.restore();
  }

  function renderStation5(ox, oy, sf) {
    ctx.save();
    ctx.translate(ox, oy);

    const baseY = 28 * sf;
    const axisW = 180 * sf;
    const sigmaW = 32 * sf;
    const peakH = 48 * sf;

    // 1. Horizontal Scale Axis
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-axisW / 2, baseY);
    ctx.lineTo(axisW / 2, baseY);
    ctx.stroke();

    // Standard deviation datum markers: μ, ±1σ, ±2σ
    const sigmas = [
      { m: 0, l: 'μ' },
      { m: -1, l: '-1σ' },
      { m: 1, l: '+1σ' },
      { m: -2, l: '-2σ' },
      { m: 2, l: '+2σ' }
    ];

    sigmas.forEach(sig => {
      const sx = sig.m * sigmaW;
      ctx.strokeStyle = sig.m === 0 ? '#ffaa70' : 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath();
      ctx.moveTo(sx, baseY - 4 * sf);
      ctx.lineTo(sx, baseY + 4 * sf);
      ctx.stroke();

      ctx.font = `500 ${Math.round(8.5 * sf)}px var(--ch02-font-mono)`;
      ctx.fillStyle = sig.m === 0 ? '#ffaa70' : 'rgba(255, 255, 255, 0.45)';
      ctx.textAlign = 'center';
      ctx.fillText(sig.l, sx, baseY + 13 * sf);
    });

    // 2. Theoretical Gaussian Normal Distribution Bell Curve Envelope
    ctx.beginPath();
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const u = -3.0 + (i / steps) * 6.0;
      const x = u * sigmaW;
      const yVal = Math.exp(-0.5 * u * u);
      const y = baseY - yVal * peakH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(255, 170, 112, ${0.35 + dataStats.factor * 0.45})`;
    ctx.lineWidth = 1.6 * sf;
    ctx.stroke();

    // Fill area under curve with warm gradient
    ctx.lineTo(3.0 * sigmaW, baseY);
    ctx.lineTo(-3.0 * sigmaW, baseY);
    ctx.closePath();
    const curveGrad = ctx.createLinearGradient(0, baseY - peakH, 0, baseY);
    curveGrad.addColorStop(0, `rgba(255, 107, 53, ${0.12 * dataStats.factor})`);
    curveGrad.addColorStop(1, 'rgba(255, 107, 53, 0)');
    ctx.fillStyle = curveGrad;
    ctx.fill();

    // 3. Discrete Sample Points with Convergence Dynamics
    const smoothEase = 1 - Math.pow(1 - dataStats.factor, 3);
    dataStats.points.forEach((p, idx) => {
      const targetX = p.z * sigmaW;
      const targetBellY = baseY - Math.exp(-0.5 * p.z * p.z) * peakH;
      const floatRatio = 0.15 + (idx % 5) * 0.15;
      const targetY = baseY - (baseY - targetBellY) * floatRatio;

      const jitX = Math.sin(dataStats.time * 2 + p.jitterOffset) * 1.5 * sf;
      const jitY = Math.cos(dataStats.time * 2.5 + p.jitterOffset) * 1.2 * sf;

      const curX = p.scatterX + (targetX + jitX - p.scatterX) * smoothEase;
      const curY = p.scatterY + (targetY + jitY - p.scatterY) * smoothEase;

      // Attractor ray during active convergence
      if (dataStats.factor > 0.05 && dataStats.factor < 0.95) {
        ctx.strokeStyle = 'rgba(255, 170, 112, 0.15)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(p.scatterX, p.scatterY);
        ctx.lineTo(curX, curY);
        ctx.stroke();
      }

      ctx.fillStyle = Math.abs(p.z) < 1.0 ? '#ffaa70' : '#ffffff';
      ctx.beginPath();
      ctx.arc(curX, curY, p.size * sf, 0, Math.PI * 2);
      ctx.fill();
    });

    // 4. Dynamic Distribution Readout HUD Text (μ and σ)
    const currentSigma = (1.0 + (1 - dataStats.factor) * 2.5).toFixed(2);
    ctx.font = `600 ${Math.round(9.5 * sf)}px var(--ch02-font-mono)`;
    ctx.fillStyle = dataStats.factor < 0.95 ? '#ffaa70' : 'rgba(255, 255, 255, 0.65)';
    ctx.textAlign = 'center';
    ctx.fillText(`μ = 0.0 · σ = ${currentSigma}`, 0, baseY - peakH - 10 * sf);

    ctx.restore();
  }

  /* --------------------------------------------------------------------------
     CONSTELLATION NETWORKS & SETTLED HARMONY
     -------------------------------------------------------------------------- */
  function renderConstellationNet(coords, t) {
    const cx = coords.core.x;
    const cy = coords.core.y;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 5]);

    ctx.beginPath();
    ctx.moveTo(coords.topEntry.x, coords.topEntry.y);
    ctx.lineTo(coords.s1.x, coords.s1.y);
    ctx.moveTo(coords.topEntry.x, coords.topEntry.y);
    ctx.lineTo(coords.s2.x, coords.s2.y);

    ctx.moveTo(coords.s1.x, coords.s1.y);
    ctx.lineTo(cx, cy);
    ctx.moveTo(coords.s2.x, coords.s2.y);
    ctx.lineTo(cx, cy);

    ctx.moveTo(cx, cy);
    ctx.lineTo(coords.s3.x, coords.s3.y);
    ctx.moveTo(cx, cy);
    ctx.lineTo(coords.s4.x, coords.s4.y);

    ctx.moveTo(coords.s3.x, coords.s3.y);
    ctx.lineTo(coords.s5.x, coords.s5.y);
    ctx.moveTo(coords.s4.x, coords.s4.y);
    ctx.lineTo(coords.s5.x, coords.s5.y);

    ctx.moveTo(coords.s5.x, coords.s5.y);
    ctx.lineTo(cx, cy);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Signal Node: Traversing through experiments or settled at central core
    const isSettledAtCore = t >= DURATION || isSettled;

    ctx.save();
    if (isSettledAtCore) {
      // Warm, living ambient pulse at central College Foundations node
      const now = performance.now();
      const breath = 0.5 + 0.5 * Math.sin(now * 0.0028);
      const haloR = 10 + 4 * breath;
      const haloAlpha = 0.25 + 0.2 * breath;

      ctx.fillStyle = `rgba(255, 107, 53, ${haloAlpha})`;
      ctx.beginPath();
      ctx.arc(cx, cy, haloR, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowColor = '#ff6b35';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#ffaa70';
      ctx.beginPath();
      ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy, 2.2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const sig = getTraversingSignalPos(t);
      ctx.shadowColor = '#ff6b35';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#ffe8d0';
      ctx.beginPath();
      ctx.arc(sig.x, sig.y, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 107, 53, 0.25)';
      ctx.beginPath();
      ctx.arc(sig.x, sig.y, 11, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  /* --------------------------------------------------------------------------
     MASTER RENDER & ANIMATION LOOP
     -------------------------------------------------------------------------- */
  function renderFrame(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;

    if (isPlaying && !isSettled) {
      timeline += dt;
      updateTimelineTriggers(timeline);

      if (timeline >= DURATION) {
        timeline = DURATION;
        isSettled = true;
        isPlaying = false;
        if (typeof window.Ch02Scene02?.onComplete === "function") {
          window.Ch02Scene02.onComplete();
        }
      }
    }

    updatePhysics(dt);

    ctx.clearRect(0, 0, width, height);

    const coords = getStationCoords();
    const isMobile = width < 640;
    const sf = isMobile ? 0.92 : 1.05;

    renderConstellationNet(coords, isSettled ? DURATION : timeline);

    renderStation1(coords.s1.x, coords.s1.y, sf);
    renderStation2(coords.s2.x, coords.s2.y, sf);
    renderStation3(coords.s3.x, coords.s3.y, sf);
    renderStation4(coords.s4.x, coords.s4.y, sf);
    renderStation5(coords.s5.x, coords.s5.y, sf);

    animFrameId = requestAnimationFrame(renderFrame);
  }

  /* --------------------------------------------------------------------------
     CONTROLS & REPLAY
     -------------------------------------------------------------------------- */
  function resetAll() {
    timeline = 0;
    isSettled = false;
    isPlaying = true;
    t1Triggered = false;
    t2Triggered = false;
    t3Triggered = false;
    t4Triggered = false;
    t5Triggered = false;

    thermal.energy = 0;
    measure.target = 40.0;
    measure.current = 40.0;
    mechanics.crankSpeed = 1.5;
    control.theta = 0;
    control.thetaVel = 0;
    control.cartX = 0;
    dataStats.factor = 1.0;

    stationActionBtns.forEach(btn => btn && btn.classList.remove('is-active'));
  }

  function replay() {
    resetAll();
    lastTime = performance.now();
  }

  function renderStaticSettled() {
    timeline = DURATION;
    isSettled = true;
    isPlaying = false;
  }

  /* --------------------------------------------------------------------------
     DYNAMIC DOSSIER MODAL (5 EXPERIMENTS + GLOBAL STORY)
     -------------------------------------------------------------------------- */
  let currentOpenDossierTrigger = null;

  function openDossier(key, triggerBtn) {
    const data = DOSSIER_ENTRIES[key] || DOSSIER_ENTRIES.global;
    if (!scene02Dossier) return;

    if (dossierYear) dossierYear.textContent = data.year;
    if (dossierTitle) dossierTitle.textContent = data.title;
    if (dossierTag) dossierTag.textContent = data.tag;
    if (dossierSubtitle) dossierSubtitle.textContent = data.subtitle;
    if (dossierText) dossierText.textContent = data.text;

    scene02Dossier.hidden = false;
    document.body.style.overflow = 'hidden';

    currentOpenDossierTrigger = triggerBtn;
    if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'true');

    const closeBtn = scene02Dossier.querySelector('.archival-dossier__close');
    if (closeBtn) closeBtn.focus();
  }

  function closeDossier() {
    if (!scene02Dossier) return;
    scene02Dossier.hidden = true;
    document.body.style.overflow = '';
    if (currentOpenDossierTrigger) {
      currentOpenDossierTrigger.setAttribute('aria-expanded', 'false');
      currentOpenDossierTrigger.focus();
      currentOpenDossierTrigger = null;
    }
  }

  /* --------------------------------------------------------------------------
     INITIALIZATION & EVENT LISTENERS
     -------------------------------------------------------------------------- */
  function init() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 1. Station action buttons: clicking badge triggers physical reaction!
    stationActionBtns.forEach((btn, idx) => {
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (idx === 0) triggerStation1();
          else if (idx === 1) triggerStation2();
          else if (idx === 2) triggerStation3();
          else if (idx === 3) triggerStation4();
          else if (idx === 4) triggerStation5();
        });
      }
    });

    // 2. Station dedicated inspect buttons: clicking beacon opens learning dossier
    stationInspectBtns.forEach((btn, idx) => {
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          openDossier(idx + 1, btn);
        });
      }
    });

    // 3. Central global inspect beacon: clicking opens College Foundations dossier
    if (globalInspectBtn) {
      globalInspectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openDossier('global', globalInspectBtn);
      });
    }

    // 4. Direct canvas / physical apparatus hit testing: clicking on any apparatus triggers reaction
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const coords = getStationCoords();
      const isMobile = width < 640;
      const hitR = isMobile ? 65 : 75;

      const stations = [
        { id: 1, x: coords.s1.x, y: coords.s1.y },
        { id: 2, x: coords.s2.x, y: coords.s2.y },
        { id: 3, x: coords.s3.x, y: coords.s3.y },
        { id: 4, x: coords.s4.x, y: coords.s4.y },
        { id: 5, x: coords.s5.x, y: coords.s5.y }
      ];

      for (const st of stations) {
        const dx = clickX - st.x;
        const dy = clickY - st.y;
        if (Math.sqrt(dx * dx + dy * dy) < hitR) {
          if (st.id === 1) triggerStation1();
          else if (st.id === 2) triggerStation2();
          else if (st.id === 3) triggerStation3();
          else if (st.id === 4) triggerStation4();
          else if (st.id === 5) triggerStation5();
          return;
        }
      }

      // Central beacon click
      const dCoreX = clickX - coords.core.x;
      const dCoreY = clickY - coords.core.y;
      if (Math.sqrt(dCoreX * dCoreX + dCoreY * dCoreY) < 32) {
        openDossier('global', globalInspectBtn);
      }
    });

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const coords = getStationCoords();
      const isMobile = width < 640;
      const hitR = isMobile ? 65 : 75;

      let isOver = false;
      const targets = [
        coords.s1, coords.s2, coords.s3, coords.s4, coords.s5, coords.core
      ];
      for (const tgt of targets) {
        const dx = mx - tgt.x;
        const dy = my - tgt.y;
        if (Math.sqrt(dx * dx + dy * dy) < hitR) {
          isOver = true;
          break;
        }
      }
      canvas.style.cursor = isOver ? 'pointer' : 'default';
    });

    if (replayBtn) replayBtn.addEventListener('click', replay);

    if (scene02Dossier) {
      scene02Dossier.addEventListener('click', (e) => {
        if (e.target.closest('[data-close="true"]')) {
          closeDossier();
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        replay();
      }
      if (e.key === 'Escape' && scene02Dossier && !scene02Dossier.hidden) {
        closeDossier();
      }
    });

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

    // Immediate viewport check if page loaded already scrolled to Scene 02
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
    }, 150);

    window.scene02Constellation = {
      replay,
      renderStaticSettled,
      openDossier,
      closeDossier,
      getState: () => ({ timeline, isPlaying, isSettled })
    };

        animFrameId = requestAnimationFrame(renderFrame);

    // Export standard Chapter 02 Scene 02 Adapter interface
    window.Ch02Scene02 = {
      id: 'scene-02',
      name: '02 // FOUNDATIONS',
      shortName: '02 Found',
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
        updateTimelineTriggers(timeline);
        lastTime = performance.now();
        if (!animFrameId) animFrameId = requestAnimationFrame(renderFrame);
      },
      getCurrentTime: function () { return Math.min(timeline, DURATION); },
      onComplete: null
    };
  }

  init();
})();