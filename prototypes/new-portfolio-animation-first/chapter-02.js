/* ==========================================================================
   CHAPTER 02: COLLEGE YEARS — MINI-PHASE 01 CONTROLLER
   Pure Motion Storytelling: UI Transformation (From Stars to Campus)
   Hero signal -> Academic Geometry -> Cohort (70) -> ME Subset (~11) -> Settle
   ========================================================================== */

(function () {
  'use strict';

  const canvas = document.querySelector('.scene-01__canvas');
  const stageWrapper = document.querySelector('.scene-01__stage-wrapper');
  const replayBtn = document.querySelector('.scene-01__replay-btn');
  const makaraArtifact = document.getElementById('makara-artifact');
  const archivalMarkerBtn = document.getElementById('archival-marker-btn');
  const archivalDossier = document.getElementById('archival-dossier');

  if (!canvas || !stageWrapper) return;

  const ctx = canvas.getContext('2d');
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isReducedMotion = reduceMotionQuery.matches;

  // Configuration Constants
  const TOTAL_COHORT = 70;
  const ME_SUBSET_COUNT = 11;
  const COSMIC_PARTICLE_COUNT = 120;
  const TIMELINE_DURATION = 8.5; // seconds

  let width = 0;
  let height = 0;
  let dpr = 1;
  let animId = 0;
  let startTime = 0;
  let isPlaying = false;
  let hasTriggered = false;

  // Animation progress in seconds (0.0 to TIMELINE_DURATION)
  let currentTime = 0;

  // Cohort and particle storage
  const cohortNodes = [];
  const cosmicParticles = [];
  const meIndices = new Set();

  // Pick 11 deterministic indices distributed across the central/forward cohort
  // To ensure visual prominence and organic balance
  const deterministicMeIndices = [18, 22, 25, 29, 32, 35, 38, 41, 45, 48, 52];
  deterministicMeIndices.forEach(idx => meIndices.add(idx));

  // Pseudo-random generator for determinism across reloads
  let seed = 20140915;
  function pseudoRandom() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  // Smooth easing functions
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function easeOutQuad(t) {
    return 1 - (1 - t) * (1 - t);
  }

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function getScaleFactor() {
    if (!width) return 1.0;
    return Math.min(1.0, Math.max(0.48, width / 960));
  }

  // Initialize nodes and particle arrays
  function setupSimulation() {
    cohortNodes.length = 0;
    cosmicParticles.length = 0;
    seed = 20140915;

    const sf = getScaleFactor();

    // 1. Cosmic Matter particles (scattered across upper stage with downward trajectories)
    for (let i = 0; i < COSMIC_PARTICLE_COUNT; i++) {
      const angle = pseudoRandom() * Math.PI * 2;
      const dist = (60 + pseudoRandom() * 320) * sf;
      cosmicParticles.push({
        originX: Math.cos(angle) * dist,
        originY: -160 * sf + Math.sin(angle) * (dist * 0.45),
        vx: (pseudoRandom() - 0.5) * 40 * sf,
        vy: (25 + pseudoRandom() * 50) * sf,
        size: (0.8 + pseudoRandom() * 1.5) * Math.max(0.8, sf),
        alpha: 0.3 + pseudoRandom() * 0.7,
        color: pseudoRandom() > 0.35 ? '#ffaa70' : '#f0f4fc',
        phaseOffset: pseudoRandom() * Math.PI * 2
      });
    }

    // 2. Cohort nodes (Structured academic grid / elliptical constellation)
    // Distributed on 4 concentric elliptical tracks
    const tracks = [
      { radiusX: 85 * sf,  radiusY: 40 * sf, count: 8 },
      { radiusX: 170 * sf, radiusY: 80 * sf, count: 16 },
      { radiusX: 255 * sf, radiusY: 120 * sf, count: 22 },
      { radiusX: 340 * sf, radiusY: 160 * sf, count: 24 }
    ];

    let nodeIndex = 0;
    tracks.forEach((track, trackIdx) => {
      for (let i = 0; i < track.count; i++) {
        if (nodeIndex >= TOTAL_COHORT) break;

        // Angle distributed across upper-forward arc with slight natural jitter
        const baseAngle = (i / track.count) * Math.PI * 2;
        const jitterR = (pseudoRandom() - 0.5) * 10 * sf;
        const targetX = Math.cos(baseAngle) * (track.radiusX + jitterR);
        const targetY = Math.sin(baseAngle) * (track.radiusY + jitterR * 0.5);

        // Initial scattered cosmic position before settling
        const initialScatterAngle = pseudoRandom() * Math.PI * 2;
        const initialScatterDist = (100 + pseudoRandom() * 260) * sf;
        const startX = Math.cos(initialScatterAngle) * initialScatterDist;
        const startY = -100 * sf + Math.sin(initialScatterAngle) * (initialScatterDist * 0.4);

        const isMe = meIndices.has(nodeIndex);

        cohortNodes.push({
          id: nodeIndex,
          isMe: isMe,
          startX: startX,
          startY: startY,
          targetX: targetX,
          targetY: targetY,
          trackIndex: trackIdx,
          size: isMe ? 4.2 * Math.max(0.85, sf) : 2.4 * Math.max(0.85, sf),
          glowSize: isMe ? 18 * sf : 6 * sf,
          color: isMe ? '#ff6b35' : 'rgba(220, 226, 235, 0.7)',
          accentColor: '#ffaa70',
          pulsePhase: pseudoRandom() * Math.PI * 2
        });

        nodeIndex++;
      }
    });
  }

  // Resize canvas to match stage dimensions and DPR
  function resize() {
    const rect = stageWrapper.getBoundingClientRect();
    const oldWidth = width;
    width = rect.width;
    height = rect.height;
    dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    if (Math.abs(oldWidth - width) > 10) {
      setupSimulation();
    }

    if (isReducedMotion || currentTime >= TIMELINE_DURATION) {
      renderStaticSettled();
    }
  }



  // Draw background academic coordinate grid & orbital tracks
  function drawAcademicGeometry(centerX, centerY, geomProgress) {
    if (geomProgress <= 0.01) return;

    ctx.save();
    ctx.translate(centerX, centerY);

    const alpha = easeOutQuad(geomProgress);

    // 1. Coordinate Axes (subtle dashed hairline crosshairs)
    ctx.beginPath();
    ctx.setLineDash([4, 8]);
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * alpha})`;
    ctx.lineWidth = 1;
    ctx.moveTo(-width * 0.45, 0);
    ctx.lineTo(width * 0.45, 0);
    ctx.moveTo(0, -height * 0.42);
    ctx.lineTo(0, height * 0.42);
    ctx.stroke();

    // 2. Concentric Academic Orbital Tracks
    const sf = getScaleFactor();
    const trackRadii = [
      { rx: 85 * sf, ry: 40 * sf },
      { rx: 170 * sf, ry: 80 * sf },
      { rx: 255 * sf, ry: 120 * sf },
      { rx: 340 * sf, ry: 160 * sf }
    ];

    ctx.setLineDash([2, 5]);
    trackRadii.forEach((tr, i) => {
      const trackAlpha = (0.12 + i * 0.03) * alpha;
      ctx.beginPath();
      ctx.ellipse(0, 0, tr.rx, tr.ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 170, 112, ${trackAlpha})`;
      ctx.stroke();
    });

    // 3. Subtle Angular Reference Ticks on outer track
    ctx.setLineDash([]);
    const outerTrack = trackRadii[3];
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * alpha})`;
    for (let deg = 0; deg < 360; deg += 30) {
      const rad = (deg * Math.PI) / 180;
      const ox = Math.cos(rad) * outerTrack.rx;
      const oy = Math.sin(rad) * outerTrack.ry;
      const ix = Math.cos(rad) * (outerTrack.rx - 5);
      const iy = Math.sin(rad) * (outerTrack.ry - 2.5);
      ctx.beginPath();
      ctx.moveTo(ix, iy);
      ctx.lineTo(ox, oy);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Draw incoming single signal vector descending from Chapter 01
  // Exact requirement: Only ONE dot/signal descends with gradual natural deceleration
  function drawHeroSignalEntry(centerX, centerY, t) {
    if (t <= 0.01) return;

    const sf = getScaleFactor();
    const descentDuration = 2.4; // seconds for single signal descent
    const u = clamp(t / descentDuration, 0, 1);

    // Gradual natural deceleration (quartic ease-out: smooth arrival at campus center)
    const easeDecel = 1 - Math.pow(1 - u, 3.4);
    const currentY = centerY * easeDecel;

    ctx.save();

    // 1. Single signal descent phase
    if (u < 1.0) {
      // Subtle vertical carrier trail
      const trailTop = Math.max(0, currentY - 110 * sf);
      const grad = ctx.createLinearGradient(centerX, trailTop, centerX, currentY);
      grad.addColorStop(0, 'rgba(255, 107, 53, 0)');
      grad.addColorStop(0.6, 'rgba(255, 170, 112, 0.35)');
      grad.addColorStop(1, 'rgba(255, 107, 53, 0.85)');

      ctx.beginPath();
      ctx.moveTo(centerX, trailTop);
      ctx.lineTo(centerX, currentY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Exactly ONE descending signal dot with warm amber halo
      const haloR = 14 * sf;
      const haloGrad = ctx.createRadialGradient(centerX, currentY, 1, centerX, currentY, haloR);
      haloGrad.addColorStop(0, 'rgba(255, 107, 53, 0.8)');
      haloGrad.addColorStop(0.45, 'rgba(255, 170, 112, 0.3)');
      haloGrad.addColorStop(1, 'rgba(255, 107, 53, 0)');

      ctx.beginPath();
      ctx.arc(centerX, currentY, haloR, 0, Math.PI * 2);
      ctx.fillStyle = haloGrad;
      ctx.fill();

      // Bright white core
      ctx.beginPath();
      ctx.arc(centerX, currentY, 3.5 * Math.max(0.85, sf), 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ff6b35';
      ctx.shadowBlur = 10;
      ctx.fill();
    } else if (t < 3.4) {
      // Touchdown arrival ripple expanding into the academic coordinate center
      const arrivalProgress = (t - descentDuration) / 1.0;
      const rippleR = 150 * sf * arrivalProgress;
      const rippleAlpha = (1 - arrivalProgress) * 0.35;

      ctx.beginPath();
      ctx.ellipse(centerX, centerY, rippleR, rippleR * 0.46, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 170, 112, ${rippleAlpha})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    ctx.restore();
  }

  // Draw cosmic particles settling into geometry
  function drawCosmicParticles(centerX, centerY, t) {
    if (t > 4.2) return;

    const fadeOut = clamp(1 - (t - 2.8) / 1.4, 0, 1);
    ctx.save();
    ctx.translate(centerX, centerY);

    cosmicParticles.forEach(p => {
      const progress = clamp(t / 2.8, 0, 1);
      const curX = p.originX + p.vx * t * (1 - progress * 0.7);
      const curY = p.originY + p.vy * t * (1 - progress * 0.7);

      ctx.beginPath();
      ctx.arc(curX, curY, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha * fadeOut;
      ctx.fill();
    });

    ctx.restore();
  }

  // Draw the 70-student academic cohort constellation
  // Broader cohort remains present but QUIETER; ME subgroup comes into focus with amber bloom
  function drawCohort(centerX, centerY, t) {
    if (t < 2.0) return;

    // Assembly progress (2.0s to 4.8s)
    const assembleProgress = clamp((t - 2.0) / 2.8, 0, 1);
    const easeAssemble = easeInOutCubic(assembleProgress);

    // Mechanical engineering resolution progress (4.8s to 6.8s)
    const meResolveProgress = clamp((t - 4.8) / 2.0, 0, 1);
    const easeMe = easeInOutCubic(meResolveProgress);

    ctx.save();
    ctx.translate(centerX, centerY);

    const mePositions = [];

    // 1. Draw nodes
    cohortNodes.forEach(node => {
      const currentX = node.startX + (node.targetX - node.startX) * easeAssemble;
      const currentY = node.startY + (node.targetY - node.startY) * easeAssemble;

      if (node.isMe) {
        mePositions.push({ x: currentX, y: currentY });

        // ME Node: blooms with warm amber halo and grows into focus
        const pulse = Math.sin(t * 2.2 + node.pulsePhase) * 0.12;
        const meScale = 1.0 + easeMe * 0.45 + pulse;
        const currentSize = node.size * meScale;

        // Radiant amber halo
        if (easeMe > 0.05) {
          const haloSize = node.glowSize * (0.8 + 0.4 * easeMe);
          const haloGrad = ctx.createRadialGradient(currentX, currentY, 1, currentX, currentY, haloSize);
          haloGrad.addColorStop(0, 'rgba(255, 107, 53, 0.75)');
          haloGrad.addColorStop(0.45, 'rgba(255, 170, 112, 0.22)');
          haloGrad.addColorStop(1, 'rgba(255, 107, 53, 0)');

          ctx.beginPath();
          ctx.arc(currentX, currentY, haloSize, 0, Math.PI * 2);
          ctx.fillStyle = haloGrad;
          ctx.globalAlpha = easeMe * 0.85;
          ctx.fill();
        }

        // Core bright node
        ctx.beginPath();
        ctx.arc(currentX, currentY, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = easeMe > 0.4 ? '#ffffff' : '#ffaa70';
        ctx.globalAlpha = 0.95;
        ctx.shadowColor = '#ff6b35';
        ctx.shadowBlur = 9 * easeMe;
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        // Broader Engineering Cohort remains active, luminous and present in the background
        // As ME comes into focus, broader cohort smoothly becomes quieter (from ~0.72 down to ~0.32)
        const quietAlpha = (0.72 - 0.40 * easeMe) * easeAssemble;
        const pulse = Math.sin(t * 1.2 + node.pulsePhase) * 0.06;

        ctx.beginPath();
        ctx.arc(currentX, currentY, node.size * (1.0 + pulse), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(210, 222, 238, 0.8)';
        ctx.globalAlpha = quietAlpha;
        ctx.fill();
      }
    });

    // 2. Draw Kinematic Linkage Vectors between ME nodes (Mechanical connection)
    if (easeMe > 0.05 && mePositions.length >= 2) {
      ctx.save();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = `rgba(255, 107, 53, ${0.55 * easeMe})`;
      ctx.setLineDash([3, 4]);

      const sf = getScaleFactor();
      ctx.beginPath();
      for (let i = 0; i < mePositions.length; i++) {
        const p1 = mePositions[i];
        for (let j = i + 1; j < mePositions.length; j++) {
          const p2 = mePositions[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 135 * sf) {
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }
      }
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  // Draw exit carrier vector preparing the next phase
  function drawSettledExitLine(centerX, centerY, t) {
    if (t < 7.0) return;

    const progress = clamp((t - 7.0) / 1.5, 0, 1);
    ctx.save();

    const sf = getScaleFactor();
    const startY = centerY + 160 * sf;
    const endY = height;

    const grad = ctx.createLinearGradient(centerX, startY, centerX, endY);
    grad.addColorStop(0, 'rgba(255, 107, 53, 0.3)');
    grad.addColorStop(1, 'rgba(255, 107, 53, 0.7)');

    ctx.beginPath();
    ctx.moveTo(centerX, startY);
    ctx.lineTo(centerX, startY + (endY - startY) * progress);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.stroke();

    ctx.restore();
  }

  // Main animation frame render loop
  function render(timestamp) {
    if (!startTime) startTime = timestamp;
    currentTime = (timestamp - startTime) / 1000;

    // Narrative milestones for centered Makara artifact
    if (currentTime >= 4.2 && makaraArtifact) {
      makaraArtifact.classList.add('is-visible');
    }
    if (currentTime >= 6.2 && makaraArtifact) {
      makaraArtifact.classList.add('is-settled');
    }

    // Clear frame
    ctx.clearRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * 0.48;

    // 1. Single Descending Hero Signal
    drawHeroSignalEntry(centerX, centerY, currentTime);

    // 2. Academic Geometry
    const geomProgress = clamp((currentTime - 1.6) / 2.2, 0, 1);
    drawAcademicGeometry(centerX, centerY, geomProgress);

    // 3. Cosmic Particles
    drawCosmicParticles(centerX, centerY, currentTime);

    // 4. Cohort Constellation (~70) & ME Focus (~11)
    drawCohort(centerX, centerY, currentTime);

    // 5. Settled Exit Trace
    drawSettledExitLine(centerX, centerY, currentTime);

    // Loop or transition into ambient breathing
    if (currentTime < TIMELINE_DURATION) {
      animId = requestAnimationFrame(render);
    } else {
      animId = requestAnimationFrame(renderIdleSettled);
    }
  }

  // Idle settled state renderer (subtle ambient harmonic breathing)
  function renderIdleSettled(timestamp) {
    ctx.clearRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * 0.48;

    const idleTime = timestamp / 1000;

    drawAcademicGeometry(centerX, centerY, 1.0);
    drawCohort(centerX, centerY, 7.5 + Math.sin(idleTime * 1.2) * 0.08);
    drawSettledExitLine(centerX, centerY, 8.5);

    animId = requestAnimationFrame(renderIdleSettled);
  }

  // Render instantaneous settled state for prefers-reduced-motion
  function renderStaticSettled() {
    cancelAnimationFrame(animId);
    ctx.clearRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * 0.48;

    drawAcademicGeometry(centerX, centerY, 1.0);
    drawCohort(centerX, centerY, 7.5);
    drawSettledExitLine(centerX, centerY, 8.5);

    if (makaraArtifact) {
      makaraArtifact.classList.add('is-visible', 'is-settled');
    }
  }

  // Dossier dialog interaction
  function openDossier() {
    if (!archivalDossier) return;
    archivalDossier.hidden = false;
    if (archivalMarkerBtn) archivalMarkerBtn.setAttribute('aria-expanded', 'true');
    const closeBtn = archivalDossier.querySelector('.archival-dossier__close');
    if (closeBtn) closeBtn.focus();
  }

  function closeDossier() {
    if (!archivalDossier) return;
    archivalDossier.hidden = true;
    if (archivalMarkerBtn) {
      archivalMarkerBtn.setAttribute('aria-expanded', 'false');
      archivalMarkerBtn.focus();
    }
  }

  // Replay animation from beginning
  function replay() {
    cancelAnimationFrame(animId);
    startTime = 0;
    currentTime = 0;
    if (makaraArtifact) {
      makaraArtifact.classList.remove('is-visible', 'is-settled');
    }
    closeDossier();
    setupSimulation();

    if (isReducedMotion) {
      renderStaticSettled();
      return;
    }

    animId = requestAnimationFrame(render);
  }

  // Handle motion preference changes
  function onMotionChange(e) {
    isReducedMotion = e.matches;
    if (isReducedMotion) {
      renderStaticSettled();
    } else {
      replay();
    }
  }

  // Initialize
  function init() {
    setupSimulation();
    resize();
    window.addEventListener('resize', resize, { passive: true });

    if (typeof reduceMotionQuery.addEventListener === 'function') {
      reduceMotionQuery.addEventListener('change', onMotionChange);
    } else if (typeof reduceMotionQuery.addListener === 'function') {
      reduceMotionQuery.addListener(onMotionChange);
    }

    if (replayBtn) {
      replayBtn.addEventListener('click', replay);
    }

    if (archivalMarkerBtn) {
      archivalMarkerBtn.addEventListener('click', openDossier);
    }

    if (archivalDossier) {
      archivalDossier.addEventListener('click', function (e) {
        if (e.target.closest('[data-close="true"]')) {
          closeDossier();
        }
      });
    }

    window.addEventListener('keydown', function (e) {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.shiftKey && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        replay();
      }
      if (e.key === 'Escape' && archivalDossier && !archivalDossier.hidden) {
        closeDossier();
      }
    });

    // Viewport scroll-trigger observer
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
      }, { threshold: 0.15 });

      observer.observe(stageWrapper);
    } else {
      replay();
    }
  }

    init();
  })();

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
    const rect = stageWrapper.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width || (window.innerWidth < 640 ? 360 : 1240);
    height = rect.height || (window.innerWidth < 640 ? 1160 : 860);
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
  }

  init();
})();

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
    const rect = stageWrapper.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width || (window.innerWidth < 640 ? 360 : 1240);
    height = rect.height || (window.innerWidth < 640 ? 1480 : 940);
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
  }

  init();
})();
