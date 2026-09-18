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
      if (typeof window.Ch02Scene01?.onComplete === "function") {
        window.Ch02Scene01.onComplete();
      }
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

        function play() {
      if (currentTime >= TIMELINE_DURATION) {
        replay();
        return;
      }
      isPlaying = true;
      startTime = performance.now() - (currentTime * 1000);
      animId = requestAnimationFrame(render);
    }

    function pause() {
      isPlaying = false;
      cancelAnimationFrame(animId);
    }

    function stop() {
      isPlaying = false;
      cancelAnimationFrame(animId);
    }

    init();

    // Export standard Chapter 02 Scene 01 Adapter interface
    window.Ch02Scene01 = {
      id: 'scene-01',
      name: '01 // UI ENTRY',
      shortName: '01 UI',
      duration: TIMELINE_DURATION,
      init: init,
      play: play,
      pause: pause,
      replay: replay,
      stop: stop,
      resize: resize,
      getCurrentTime: function () { return Math.min(currentTime, TIMELINE_DURATION); },
      onComplete: null
    };
  })();