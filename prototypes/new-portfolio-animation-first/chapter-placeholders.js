/**
 * CHAPTER PLACEHOLDERS: SHARED WORKING EXPERIENCE CONTROLLER
 * Chapters III, IV, and V Shared Loading / Under Development Placeholder.
 *
 * Visual Authority: Chapter 01 Red Dwarf Hero Asymmetric Composition
 * Design Identity: Dark Astronomical Field (#040508), Controlled Amber/Red Accretion,
 * Quiet Editorial Typography, Restrained Proto-Star Core.
 *
 * Motion Architecture: Continuous Slow-Motion Accretion Loop
 * Unequal molecular-cloud feeders carry the same material into a thick young
 * accretion structure and compact protostar. Individual grains replenish;
 * the forming system has no synchronized cycle or restart.
 */

(function () {
  'use strict';

  const globalStatusText = document.querySelector('.portfolio-header__status-text');
  const SHARED_STATUS = '03 // EXPERIENCE';

  // ==========================================================================
  // CONFIGURATION: EDITABLE STAR-FORMATION SYSTEM
  // Tune paths, speeds, particle densities, and core properties here
  // without modifying the core animation engine.
  // ==========================================================================
  const STAR_FORMATION_CONFIG = {
    // Illustrative compression, not measured astronomical timing or scale.
    coreRadius: 5.0,
    coronaRadius: 26.0,
    tiltAngleDeg: -22.0,
    speedFactor: 0.85,
    diskRadius: 116.0,
    diskFlattening: 0.40,
    // Unequal envelope feeders. Beziers guide volume; no spline is painted.
    filaments: [
      {
        id: 'long-cloud',
        p0: { x: -1.28, y: -0.68 },
        p1: { x: -0.62, y: 0.20 },
        captureAngle: 2.65,
        colorRgb: [192, 139, 83],
        width: 76, dustCount: 350, grainCount: 30,
        speed: 0.0071, phaseOffset: 0.13
      },
      {
        id: 'raised-cloud',
        p0: { x: 0.86, y: -1.30 },
        p1: { x: 0.40, y: -0.50 },
        captureAngle: -0.55,
        colorRgb: [174, 130, 89],
        width: 48, dustCount: 250, grainCount: 22,
        speed: 0.0083, phaseOffset: 0.47
      },
      {
        id: 'low-wisp',
        p0: { x: 1.05, y: 0.77 },
        p1: { x: 0.42, y: 0.76 },
        captureAngle: 1.10,
        colorRgb: [124, 128, 137],
        width: 31, dustCount: 140, grainCount: 10,
        speed: 0.0059, phaseOffset: 0.79
      }
    ],
    ambientDustCount: 90,
    hazePuffCount: 72
  };

  // ==========================================================================
  // ROUTING & GLOBAL HEADER SYNCHRONIZATION
  // ==========================================================================

  function getVisibleRatio(el) {
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const visibleH = Math.max(0, Math.min(window.innerHeight, rect.bottom) - Math.max(0, rect.top));
    return visibleH / Math.max(1, rect.height);
  }

  function syncPlaceholderHeader() {
    if (!globalStatusText) return;

    // Check if Hero or Chapter 02 are dominant in view
    const heroEl = document.getElementById('hero');
    const ch02El = document.getElementById('chapter-02');
    const heroRatio = getVisibleRatio(heroEl);
    const ch02Ratio = getVisibleRatio(ch02El);

    if (heroRatio > 0.35 || ch02Ratio > 0.35) {
      return; // Preserve Chapter 01 or Chapter 02 header status
    }

    const sharedSection = document.getElementById('chapter-03') || document.querySelector('.chapter-working-experience');
    const sharedRatio = getVisibleRatio(sharedSection);

    if (sharedRatio > 0.20) {
      if (globalStatusText.textContent !== SHARED_STATUS) {
        globalStatusText.textContent = SHARED_STATUS;
      }
    }
  }

  // Smooth click navigation & route alias resolver
  function initCarrierLinks() {
    document.querySelectorAll('.chapter-carrier, .ch02-to-ch03-carrier, .portfolio-colophon__top-link, a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          let target = document.querySelector(href);
          // If targeting ch03, ch04, ch05 or working-experience, resolve to shared placeholder
          if (href === '#chapter-03' || href === '#chapter-04' || href === '#chapter-05' || href === '#working-experience') {
            target = document.getElementById('chapter-03') || document.querySelector('.chapter-working-experience') || target;
          }
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
            history.pushState(null, '', href);
          }
        }
      });
    });
  }

  // Handle direct hash navigation on initial load or dynamic hashchange
  function handleHashNavigation() {
    const hash = window.location.hash;
    if (['#chapter-03', '#chapter-04', '#chapter-05', '#working-experience'].includes(hash)) {
      const target = document.getElementById('chapter-03') || document.querySelector('.chapter-working-experience');
      if (target) {
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 120);
      }
    }
  }

  // ==========================================================================
  // CONTINUOUS LOOPING STAR-FORMATION FIELD ENGINE
  // ==========================================================================

  function initStarFormationAnimation() {
    const canvas = document.getElementById('working-experience-canvas') || document.querySelector('.working-experience__canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const section = document.getElementById('chapter-03') || document.querySelector('.chapter-working-experience');
    const cfg = STAR_FORMATION_CONFIG;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mulberry32 PRNG (seed: 0x8C49A2D1) for deterministic, beautifully distributed particles
    function createPrng(seed) {
      let s = seed | 0;
      return function () {
        s = (s + 0x6D2B79F5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    // Cubic Bezier evaluation returning coordinates, tangent vector, and normal vector
    function evalCubicBezier(p0, p1, p2, p3, u) {
      const inv = 1 - u;
      const inv2 = inv * inv;
      const inv3 = inv2 * inv;
      const u2 = u * u;
      const u3 = u2 * u;

      const x = inv3 * p0.x + 3 * inv2 * u * p1.x + 3 * inv * u2 * p2.x + u3 * p3.x;
      const y = inv3 * p0.y + 3 * inv2 * u * p1.y + 3 * inv * u2 * p2.y + u3 * p3.y;

      const dx = 3 * inv2 * (p1.x - p0.x) + 6 * inv * u * (p2.x - p1.x) + 3 * u2 * (p3.x - p2.x);
      const dy = 3 * inv2 * (p1.y - p0.y) + 6 * inv * u * (p2.y - p1.y) + 3 * u2 * (p3.y - p2.y);
      const len = Math.hypot(dx, dy) || 1;
      const tx = dx / len;
      const ty = dy / len;
      const nx = -ty;
      const ny = tx;

      return { x, y, tx, ty, nx, ny, len };
    }

    let system = null;
    let animFrameId = null;
    let isVisible = false;
    let startTime = performance.now();

    function buildSystem(w, h) {
      const rng = createPrng(0x8C49A2D1);
      const isMobile = w <= 960;
      const fieldEl = document.querySelector('.working-experience__field');

      let cx, cy;
      if (fieldEl && !isMobile) {
        const fieldRect = fieldEl.getBoundingClientRect();
        const secRect = canvas.getBoundingClientRect();
        cx = (fieldRect.left - secRect.left) + fieldRect.width * 0.50;
        cy = (fieldRect.top - secRect.top) + fieldRect.height * 0.52;
      } else if (fieldEl && isMobile) {
        const fieldRect = fieldEl.getBoundingClientRect();
        const secRect = canvas.getBoundingClientRect();
        cx = (fieldRect.left - secRect.left) + fieldRect.width * 0.50;
        cy = (fieldRect.top - secRect.top) + fieldRect.height * 0.50;
      } else {
        cx = isMobile ? w * 0.50 : w * 0.68;
        cy = isMobile ? h * 0.62 : h * 0.52;
      }

      const maxSpan = Math.max(w, h) * 0.72;

      const sceneScale = Math.min(1, maxSpan / 900);
      const diskRadius = cfg.diskRadius * Math.max(0.72, sceneScale);

      // Each grain owns its envelope -> capture -> disk -> absorption path.
      // The cubic endpoint tangent matches the inward orbit analytically.
      const compiledFilaments = cfg.filaments.map(def => {
        const p0 = { x: def.p0.x * maxSpan, y: def.p0.y * maxSpan * 0.48 };
        const p1 = { x: def.p1.x * maxSpan, y: def.p1.y * maxSpan * 0.48 };
        const width = def.width * sceneScale;
        function makeGrain(isEmber) {
          const phase = rng();
          const lateralOffset = rng() + rng() - 1;
          const radius = diskRadius * (0.72 + rng() * 0.55);
          const theta = def.captureAngle + lateralOffset * 0.65 + (rng() - 0.5) * 0.24;
          const capture = 0.54 + rng() * 0.12;
          const contraction = Math.log(radius / (cfg.coreRadius * 0.45));
          const softening = cfg.coreRadius * 2.8;
          const turn = 0.55 + rng() * 0.18;
          const dr = 0;
          const dt = 1.1;
          const p3 = { x: Math.cos(theta) * radius, y: Math.sin(theta) * radius * cfg.diskFlattening };
          const tangentScale = capture / ((1 - capture) * 3 * 1.25);
          const p2 = {
            x: p3.x - (dr * Math.cos(theta) - radius * Math.sin(theta) * dt) * tangentScale,
            y: p3.y - (dr * Math.sin(theta) + radius * Math.cos(theta) * dt) * cfg.diskFlattening * tangentScale
          };
          return {
            phase, capture, radius, theta, contraction, softening, turn,
            speed: def.speed * cfg.speedFactor * (0.72 + rng() * 0.56),
            p0: { x: p0.x + lateralOffset * width, y: p0.y + lateralOffset * width * 1.6 },
            p1: { x: p1.x + lateralOffset * width * 0.8, y: p1.y + lateralOffset * width },
            p2, p3,
            ripplePhase: rng() * Math.PI * 2,
            rippleWidth: width * (0.25 + rng() * 0.55),
            zOffset: (rng() - 0.5) * width * 1.2,
            size: isEmber ? 0.85 + rng() * 0.55 : 0.4 + rng() * 0.5,
            baseAlpha: isEmber ? 0.32 + rng() * 0.25 : 0.10 + rng() * 0.21,
            hasStreak: isEmber && rng() > 0.72
          };
        }
        const dust = Array.from({ length: def.dustCount }, () => makeGrain(false));
        const grains = Array.from({ length: def.grainCount }, () => makeGrain(true));
        return { ...def, width, dust, grains, particles: dust.concat(grains) };
      });

      // Unspun molecular environment: small bounded drift, no radial swirl.
      const ambientDust = [];
      for (let a = 0; a < cfg.ambientDustCount; a++) {
        ambientDust.push({
          x: (rng() - 0.5) * maxSpan * 2.8,
          y: (rng() - 0.5) * maxSpan * 1.5,
          phase: rng() * Math.PI * 2,
          driftSpeed: 0.025 + rng() * 0.025,
          size: 0.3 + rng() * 0.35,
          baseAlpha: 0.035 + rng() * 0.065
        });
      }

      // Broken, unequal gas clumps follow the same capture mapping as dust.
      const hazePuffs = [];
      for (let i = 0; i < cfg.hazePuffCount; i++) {
        const filamentIndex = i % compiledFilaments.length;
        const fil = compiledFilaments[filamentIndex];
        const grain = fil.dust[Math.floor(rng() * fil.dust.length)];
        hazePuffs.push({
          filamentIndex, grain,
          puffRadius: (22 + rng() * 48) * sceneScale,
          aspect: 0.42 + rng() * 0.65,
          baseAlpha: 0.035 + rng() * 0.030
        });
      }
      return { cx, cy, maxSpan, compiledFilaments, ambientDust, hazePuffs };
    }

    function smoothRange(lo, hi, value) {
      const t = Math.max(0, Math.min(1, (value - lo) / (hi - lo)));
      return t * t * (3 - 2 * t);
    }

    function materialPoint(grain, phase) {
      let x, y, radius;
      if (phase < grain.capture) {
        const u = Math.pow(phase / grain.capture, 1.25);
        const bez = evalCubicBezier(grain.p0, grain.p1, grain.p2, grain.p3, u);
        // Broad organic deviations vanish with zero slope at capture.
        const scatter = Math.pow(1 - u, 2);
        const ripple = Math.sin(u * 10 + grain.ripplePhase) * Math.sin(u * Math.PI) ** 2 * grain.rippleWidth;
        x = bez.x + bez.nx * ripple;
        y = bez.y + bez.ny * ripple * 0.7 + grain.zOffset * scatter;
        radius = Math.hypot(x, y / cfg.diskFlattening);
      } else {
        const v = (phase - grain.capture) / (1 - grain.capture);
        radius = grain.radius * Math.exp(-grain.contraction * v * v);
        // Softened inner differential rotation accelerates close to the core.
        // Envelope bends represent infall, not a rotating outer cloud.
        const theta = grain.theta + 1.1 * v + grain.turn * (Math.pow((grain.radius + grain.softening) / (radius + grain.softening), 1.5) - 1);
        x = Math.cos(theta) * radius;
        y = Math.sin(theta) * radius * cfg.diskFlattening;
        // Young material retains thickness. Smooth at entry, buried in core.
        y += grain.zOffset * 0.18 * Math.sin(v * Math.PI) ** 2 * (radius / grain.radius);
      }
      const alpha = smoothRange(0, 0.075, phase) * smoothRange(cfg.coreRadius * 0.48, cfg.coreRadius * 0.95, radius);
      return { x, y, radius, alpha };
    }

    function render(timeSec) {
      if (!system) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = rect.width;
      const h = rect.height;
      if (w === 0 || h === 0) return;

      const expectedW = Math.round(w * dpr);
      const expectedH = Math.round(h * dpr);
      if (canvas.width !== expectedW || canvas.height !== expectedH) {
        canvas.width = expectedW;
        canvas.height = expectedH;
        system = buildSystem(w, h);
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const { cx, cy, maxSpan, compiledFilaments, ambientDust, hazePuffs } = system;

      // Steady atmosphere: restore dramatic cosmic contrast & ambient lighting
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxSpan * 1.25);
      bgGrad.addColorStop(0, 'rgba(30, 20, 15, 0.26)');
      bgGrad.addColorStop(0.35, 'rgba(14, 18, 30, 0.28)');
      bgGrad.addColorStop(0.75, 'rgba(4, 5, 8, 0.88)');
      bgGrad.addColorStop(1, '#040508');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((cfg.tiltAngleDeg * Math.PI) / 180);

      for (const pt of ambientDust) {
        const x = pt.x + Math.sin(timeSec * pt.driftSpeed + pt.phase) * 3;
        const y = pt.y + Math.cos(timeSec * pt.driftSpeed * 0.7 + pt.phase) * 2;
        ctx.beginPath();
        ctx.arc(x, y, pt.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 156, 172, ${pt.baseAlpha})`;
        ctx.fill();
      }

      for (const puff of hazePuffs) {
        const fil = compiledFilaments[puff.filamentIndex];
        const phase = (timeSec * puff.grain.speed + puff.grain.phase + fil.phaseOffset) % 1;
        const pt = materialPoint(puff.grain, phase);
        const radius = puff.puffRadius * Math.min(1, pt.radius / puff.grain.radius);
        const alpha = puff.baseAlpha * pt.alpha * smoothRange(8, 28, pt.radius);
        if (radius < 1 || alpha < 0.001) continue;
        ctx.save();
        ctx.translate(pt.x, pt.y);
        const flatten = smoothRange(puff.grain.capture * 0.72, puff.grain.capture + 0.16, phase);
        ctx.scale(1, puff.aspect + (cfg.diskFlattening + 0.12 - puff.aspect) * flatten);
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
        grad.addColorStop(0, `rgba(${fil.colorRgb.join(',')}, ${alpha})`);
        grad.addColorStop(0.45, `rgba(${fil.colorRgb.join(',')}, ${alpha * 0.42})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
        ctx.restore();
      }

      // One population, one trajectory: no painted rails or separate collar.
      for (const fil of compiledFilaments) {
        for (const grain of fil.particles) {
          const phase = (timeSec * grain.speed + grain.phase + fil.phaseOffset) % 1;
          const pt = materialPoint(grain, phase);
          if (pt.alpha < 0.001) continue;
          const heat = 1 - smoothRange(cfg.coreRadius, grain.radius * 2.8, pt.radius);
          const rgb = fil.colorRgb.map((c, i) => Math.round(c + ([231, 184, 124][i] - c) * heat));
          const alpha = grain.baseAlpha * pt.alpha;
          ctx.fillStyle = `rgba(${rgb.join(',')}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, grain.size, 0, Math.PI * 2);
          ctx.fill();
          if (grain.hasStreak && phase > grain.capture && pt.radius > cfg.coreRadius * 1.3) {
            const tail = materialPoint(grain, Math.max(0, phase - grain.speed * 0.55));
            ctx.beginPath();
            ctx.moveTo(tail.x, tail.y);
            ctx.lineTo(pt.x, pt.y);
            ctx.strokeStyle = `rgba(${rgb.join(',')}, ${alpha * 0.24})`;
            ctx.lineWidth = 0.55;
            ctx.stroke();
          }
        }
      }

      // Only the compact protostar breathes, with very little surrounding glow.
      const breath = 1 + 0.025 * Math.sin(timeSec * 0.31) + 0.012 * Math.sin(timeSec * 0.19 + 1.4);
      const rCore = cfg.coreRadius * breath;
      const coronaRad = cfg.coronaRadius * breath;
      const coronaGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, coronaRad);
      coronaGrad.addColorStop(0, 'rgba(205, 143, 70, 0.20)');
      coronaGrad.addColorStop(0.35, 'rgba(180, 111, 49, 0.065)');
      coronaGrad.addColorStop(1, 'rgba(4, 5, 8, 0)');
      ctx.fillStyle = coronaGrad;
      ctx.beginPath();
      ctx.arc(0, 0, coronaRad, 0, Math.PI * 2);
      ctx.fill();

      const coreGrad = ctx.createRadialGradient(-rCore * 0.2, -rCore * 0.2, 0, 0, 0, rCore);
      coreGrad.addColorStop(0, '#f4efe8');
      coreGrad.addColorStop(0.35, '#ebcf9b');
      coreGrad.addColorStop(0.72, '#c58e55');
      coreGrad.addColorStop(1, '#785038');
      ctx.beginPath();
      ctx.arc(0, 0, rCore, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      ctx.restore();
    }

    function animate(now) {
      if (!isVisible) {
        animFrameId = null;
        return;
      }
      const elapsedSec = (now - startTime) / 1000;
      render(elapsedSec);
      animFrameId = requestAnimationFrame(animate);
    }

    function startAnimation() {
      if (prefersReducedMotion) {
        // Reduced motion: render a single calm, high-fidelity static frame and halt loop
        render(12.0);
        return;
      }
      if (!animFrameId) {
        animFrameId = requestAnimationFrame(animate);
      }
    }

    function stopAnimation() {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    }

    // Viewport IntersectionObserver to conserve system resources
    if (window.IntersectionObserver && section) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            startAnimation();
          } else {
            stopAnimation();
          }
        });
      }, { threshold: 0.05 });
      observer.observe(section);
    } else {
      isVisible = true;
      startAnimation();
    }

    function onResize() {
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        system = buildSystem(rect.width, rect.height);
        render((performance.now() - startTime) / 1000);
      }
    }

    window.addEventListener('resize', onResize, { passive: true });

    // Initial setup
    const initialRect = canvas.getBoundingClientRect();
    if (initialRect.width > 0 && initialRect.height > 0) {
      system = buildSystem(initialRect.width, initialRect.height);
      render(0);
    } else {
      setTimeout(onResize, 60);
    }
  }

  // Setup scroll and hash listeners
  window.addEventListener('scroll', syncPlaceholderHeader, { passive: true });
  window.addEventListener('resize', syncPlaceholderHeader, { passive: true });
  window.addEventListener('hashchange', handleHashNavigation, { passive: true });

  document.addEventListener('DOMContentLoaded', () => {
    syncPlaceholderHeader();
    initCarrierLinks();
    handleHashNavigation();
    initStarFormationAnimation();
  });

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    syncPlaceholderHeader();
    initCarrierLinks();
    handleHashNavigation();
    initStarFormationAnimation();
  }
})();
