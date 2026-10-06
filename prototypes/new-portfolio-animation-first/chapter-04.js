/**
 * CHAPTER 04: OPERATING SPINE — PT CIBUNI TEKNIK SEJAHTERA
 * Production Controller & Motion Engine
 * 
 * Frozen Visual & Motion Authority:
 * prototypes/chapter-04-operating-spine/index.html
 * 
 * Features:
 * - Direct restrained PT Cibuni identity construction & causal contraction into signal
 * - Continuous horizontal spine traversal across 7 operational stages (12.9s)
 * - Stage 04 Make dominant beat with precision blueprint accents & bilateral branches
 * - Camera world pull-back and clean settled negative space (summary bar removed)
 * - Interactive stage hover & inspection drawer
 * - IntersectionObserver viewport auto-trigger & header status updates
 * - Reduced motion accessibility support
 */

(function () {
  'use strict';

  const TOTAL_DURATION = 12.9; // seconds
  let currentTime = 0.0;
  let isPlaying = false;
  let animReq = null;
  let lastTimestamp = null;
  let hasAutoPlayed = false;
  let isDraggingScrubber = false;
  let hoveredStageIndex = null;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function easeOutQuad(t) {
    return 1 - (1 - t) * (1 - t);
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Stage Coordinates along horizontal spine y=360
  const STAGES = [
    {
      index: 0,
      id: 'ch04-stage-1',
      name: 'Customer Need',
      code: '01',
      x: 180,
      y: 360,
      time: 3.2,
      owner: 'CLIENT & SCOPING',
      desc: 'Direct interaction with clients to understand mechanical tolerances, engineering constraints, and operational operating parameters.',
      chips: ['Scope Definition', 'Technical Feasibility', 'Specification Lock']
    },
    {
      index: 1,
      id: 'ch04-stage-2',
      name: 'Quote',
      code: '02',
      x: 330,
      y: 360,
      time: 4.3,
      owner: 'COMMERCIAL & FINANCE',
      desc: 'Translating BOM requirements into commercial cost modeling, vendor quotes, machining hours, and target gross margin approvals.',
      chips: ['Cost Modeling', 'Margin Control', 'Commercial Proposals']
    },
    {
      index: 2,
      id: 'ch04-stage-3',
      name: 'Procure',
      code: '03',
      x: 480,
      y: 360,
      time: 5.5,
      owner: 'SUPPLY CHAIN & VENDORS',
      desc: 'Coordinating raw material stock (billets, shafts, seals), heat treatment vendors, and specialty hardware against project milestones.',
      chips: ['Raw Materials', 'Vendor Lead Times', 'Machining Stock']
    },
    {
      index: 3,
      id: 'ch04-stage-4',
      name: 'Make',
      code: '04',
      x: 640,
      y: 360,
      time: 6.9,
      dwellEnd: 7.9,
      owner: 'WORKSHOP OPERATIONS & MANPOWER',
      desc: 'Direct oversight of workshop operations: CNC lathe, milling, welding, dynamic balancing, and assembly manpower. Physical manifestation of engineering.',
      chips: ['Workshop Setup', 'Machining Tolerances', 'Fabrication', 'Quality QA']
    },
    {
      index: 4,
      id: 'ch04-stage-5',
      name: 'Deliver',
      code: '05',
      x: 800,
      y: 360,
      time: 8.8,
      owner: 'ADMINISTRATION & DISPATCH',
      desc: 'Pre-dispatch dimensional inspection, factory acceptance sign-off, official Delivery Order (Surat Jalan), and transport to customer site.',
      chips: ['Dimensional QA', 'Surat Jalan / DO', 'On-Site Handover']
    },
    {
      index: 5,
      id: 'ch04-stage-6',
      name: 'Bill',
      code: '06',
      x: 950,
      y: 360,
      time: 9.6,
      owner: 'COMMERCIAL FINANCE & TAX',
      desc: 'Tax invoice (Faktur Pajak) issuance, matching delivered quantities against signed delivery receipts and original purchase orders.',
      chips: ['Faktur Pajak', 'Progress Invoicing', 'PO Reconciliation']
    },
    {
      index: 6,
      id: 'ch04-stage-7',
      name: 'Collect',
      code: '07',
      x: 1100,
      y: 360,
      time: 10.4,
      owner: 'CASH CONTROL & TREASURY',
      desc: 'Active follow-up on 30/60-day payment terms, accounts receivable settlement, bank liquidity verification, and closing the business cycle.',
      chips: ['AR Follow-Up', 'Cash Settlement', 'Working Capital Cycle']
    }
  ];

  // DOM Elements Cache
  const els = {};

  function queryElements() {
    els.ch04Section = document.getElementById('chapter-04');
    els.cameraWorld = document.getElementById('ch04-camera-world');
    els.editorialHeader = document.getElementById('ch04-editorial-header');

    // PT Cibuni Identity Elements
    els.ctsLayer = document.getElementById('ch04-cts-identity-layer');
    els.ctsDatum = document.getElementById('ch04-cts-datum-line');
    els.ctsTickL = document.getElementById('ch04-cts-datum-tick-left');
    els.ctsTickR = document.getElementById('ch04-cts-datum-tick-right');
    els.ctsTextWrapper = document.getElementById('ch04-cts-title-wrapper');
    els.ctsText = document.getElementById('ch04-cts-title-text');
    els.ctsBeam = document.getElementById('ch04-cts-signal-beam');
    els.ctsBeamGlow = document.getElementById('ch04-cts-beam-glow');
    els.ctsBeamCore = document.getElementById('ch04-cts-beam-core');

    // Operating Spine System
    els.spineSystem = document.getElementById('ch04-operating-spine-system');
    els.spineBaseLine = document.getElementById('ch04-spine-base-line');
    els.spineActiveLine = document.getElementById('ch04-spine-active-line');
    els.spineActiveCore = document.getElementById('ch04-spine-active-core');
    els.luminousPulse = document.getElementById('ch04-luminous-pulse');

    // Branches
    els.branchQuoteFinance = document.getElementById('ch04-branch-quote-finance');
    els.branchProcureSuppliers = document.getElementById('ch04-branch-procure-suppliers');
    els.branchMakeOps = document.getElementById('ch04-branch-make-operations');
    els.branchMakePeople = document.getElementById('ch04-branch-make-people');
    els.makeBlueprint = document.getElementById('ch04-make-blueprint-accents');
    els.branchDeliverAdmin = document.getElementById('ch04-branch-deliver-admin');
    els.branchBillFinance = document.getElementById('ch04-branch-bill-finance');
    els.branchCollectCash = document.getElementById('ch04-branch-collect-cash');

    // Stage DOM
    els.stages = STAGES.map(s => ({
      ...s,
      el: document.getElementById(s.id),
      halo: document.querySelector('#' + s.id + ' .stage-node-halo'),
      circle: document.querySelector('#' + s.id + ' .stage-node-circle'),
      core: document.querySelector('#' + s.id + ' .stage-node-core'),
      code: document.querySelector('#' + s.id + ' .stage-code'),
      label: document.querySelector('#' + s.id + ' .stage-label'),
      sub: document.querySelector('#' + s.id + ' .stage-sub'),
      hitbox: document.querySelector('#' + s.id + ' .interactive-stage-hitbox')
    }));

    // UI & HUD
    els.statusText = document.getElementById('ch04-status-hud-text');
    els.statusDot = document.getElementById('ch04-status-hud-dot');
    els.inspector = document.getElementById('ch04-inspector-panel');
    els.inspectTag = document.getElementById('ch04-inspect-tag');
    els.inspectTitle = document.getElementById('ch04-inspect-title');
    els.inspectOwner = document.getElementById('ch04-inspect-owner');
    els.inspectDesc = document.getElementById('ch04-inspect-desc');
    els.inspectChips = document.getElementById('ch04-inspect-chips');

    // Controls
    els.playBtn = document.getElementById('ch04-play-pause-btn');
    els.playIcon = document.getElementById('ch04-play-icon');
    els.pauseIcon = document.getElementById('ch04-pause-icon');
    els.replayBtn = document.getElementById('ch04-replay-btn');
    els.timelineContainer = document.getElementById('ch04-timeline-container');
    els.timelineFill = document.getElementById('ch04-timeline-fill');
    els.timelineScrubber = document.getElementById('ch04-timeline-scrubber');
    els.timeReadout = document.getElementById('ch04-time-readout');
  }

  /**
   * Continuous Pulse Position Solver
   */
  function getPulsePosition(t) {
    if (t < 1.4) return { x: 640, y: 360, opacity: 0 };
    
    // 1.4s - 2.0s: Concentrates at center as typography collapses inward
    if (t < 2.0) {
      const u = (t - 1.4) / 0.6;
      return { x: 640, y: 360, opacity: u, scale: 1.0 + u * 0.3 };
    }
    
    // 2.0s - 2.6s: Concentrated amber core at center as Operating Spine extends
    if (t < 2.6) {
      return { x: 640, y: 360, opacity: 1, scale: 1.2 };
    }

    // 2.6s - 3.2s: Inherited pulse glides smoothly from center (640) to origin (180) across 0.6s
    if (t < 3.2) {
      const u = easeInOutQuad((t - 2.6) / 0.6);
      return { x: lerp(640, 180, u), y: 360, opacity: 1, scale: 1.0 };
    }

    // 3.2s - 4.3s: Stage 1 Customer Need (180) -> Stage 2 Quote (330)
    if (t < 4.3) {
      const u = (t - 3.2) / 1.1;
      return { x: lerp(180, 330, u), y: 360, opacity: 1 };
    }
    // Stage 2 (330) -> Stage 3 Procure (480, t=5.5)
    if (t < 5.5) {
      const u = (t - 4.3) / 1.2;
      return { x: lerp(330, 480, u), y: 360, opacity: 1 };
    }
    // Stage 3 (480) -> Stage 4 Make (640, arrives at 6.9s)
    if (t < 6.9) {
      const u = (t - 5.5) / 1.4;
      return { x: lerp(480, 640, u), y: 360, opacity: 1 };
    }
    // Stage 4 Make Dwell (6.9s - 7.9s): Pulse resonates at center
    if (t < 7.9) {
      return { x: 640, y: 360, opacity: 1, scale: 1.25 };
    }
    // Stage 4 Make (640) -> Stage 5 Deliver (800, arrives at 8.8s)
    if (t < 8.8) {
      const u = (t - 7.9) / 0.9;
      return { x: lerp(640, 800, u), y: 360, opacity: 1 };
    }
    // Stage 5 Deliver (800) -> Stage 6 Bill (950, arrives at 9.6s)
    if (t < 9.6) {
      const u = (t - 8.8) / 0.8;
      return { x: lerp(800, 950, u), y: 360, opacity: 1 };
    }
    // Stage 6 Bill (950) -> Stage 7 Collect (1100, arrives at 10.4s)
    if (t < 10.4) {
      const u = (t - 9.6) / 0.8;
      return { x: lerp(950, 1100, u), y: 360, opacity: 1 };
    }

    // Post 10.4s: Resonates at Collect endpoint, then attenuates as system settles
    const fade = clamp(1 - (t - 10.8) / 0.8, 0, 1);
    return { x: 1100, y: 360, opacity: fade };
  }

  /**
   * Core Frame Update (Driven by currentTime)
   */
  function updateAtTime(t) {
    // -----------------------------------------------------------
    // BEAT 0: PT CIBUNI TEKNIK SEJAHTERA KINETIC IDENTITY (0.0s - 1.4s)
    // -----------------------------------------------------------
    if (t < 1.4) {
      if (els.ctsLayer) els.ctsLayer.style.opacity = '1';
      if (els.ctsBeam) els.ctsBeam.style.opacity = '0';
      if (els.spineSystem) els.spineSystem.style.opacity = '0';
      if (els.editorialHeader) els.editorialHeader.style.opacity = '0';

      // Kinetic construction:
      // 0.0s - 0.45s: Datum hairline rule draws outward from center (640)
      const uLine = clamp(t / 0.45, 0, 1);
      const easeLine = easeOutQuad(uLine);
      const halfSpan = lerp(0, 175, easeLine);
      if (els.ctsDatum) {
        els.ctsDatum.setAttribute('x1', (640 - halfSpan).toFixed(1));
        els.ctsDatum.setAttribute('x2', (640 + halfSpan).toFixed(1));
        els.ctsDatum.style.opacity = (t < 0.8 ? '0.6' : '0.35');
      }
      if (els.ctsTickL && els.ctsTickR) {
        els.ctsTickL.setAttribute('x1', (640 - halfSpan).toFixed(1));
        els.ctsTickL.setAttribute('x2', (640 - halfSpan).toFixed(1));
        els.ctsTickL.style.opacity = (uLine > 0.3 ? '0.4' : '0');
        els.ctsTickR.setAttribute('x1', (640 + halfSpan).toFixed(1));
        els.ctsTickR.setAttribute('x2', (640 + halfSpan).toFixed(1));
        els.ctsTickR.style.opacity = (uLine > 0.3 ? '0.4' : '0');
      }

      // 0.2s - 0.8s: Typography constructs along the baseline
      if (t < 0.2) {
        if (els.ctsTextWrapper) {
          els.ctsTextWrapper.setAttribute('transform', 'translate(640, 360) scale(1, 1)');
          els.ctsTextWrapper.style.opacity = '0';
        }
      } else {
        const uText = clamp((t - 0.2) / 0.6, 0, 1);
        const easeText = easeOutCubic(uText);
        const yOffset = lerp(8, 0, easeText);
        const spacing = lerp(3.2, 1.2, easeText);
        if (els.ctsTextWrapper) {
          els.ctsTextWrapper.setAttribute('transform', `translate(640, ${360 + yOffset}) scale(1, 1)`);
          els.ctsTextWrapper.style.opacity = easeText.toFixed(3);
        }
        if (els.ctsText) {
          els.ctsText.setAttribute('letter-spacing', spacing.toFixed(2));
          els.ctsText.setAttribute('fill', '#f8fafc');
        }
      }

      if (els.statusText) els.statusText.textContent = 'PT CIBUNI TEKNIK SEJAHTERA';
    }

    // -----------------------------------------------------------
    // BEAT 1: CAUSAL CONTRACTION INTO AMBER SIGNAL (1.4s - 2.0s)
    // -----------------------------------------------------------
    else if (t < 2.0) {
      const u = (t - 1.4) / 0.6;
      const compEase = easeInOutCubic(u);
      const scaleX = lerp(1.0, 0.05, compEase);
      const scaleY = Math.max(0.001, lerp(1.0, 0.01, compEase));
      const textFade = clamp(1 - u * 1.3, 0, 1);

      if (els.ctsLayer) els.ctsLayer.style.opacity = '1';
      if (els.ctsBeam) els.ctsBeam.style.opacity = '0';
      if (els.spineSystem) els.spineSystem.style.opacity = '0';
      if (els.editorialHeader) els.editorialHeader.style.opacity = '0';

      // Datum contracts inward
      const halfSpan = lerp(175, 4, compEase);
      if (els.ctsDatum) {
        els.ctsDatum.setAttribute('x1', (640 - halfSpan).toFixed(1));
        els.ctsDatum.setAttribute('x2', (640 + halfSpan).toFixed(1));
        els.ctsDatum.style.opacity = textFade.toFixed(3);
      }
      if (els.ctsTickL && els.ctsTickR) {
        els.ctsTickL.style.opacity = '0';
        els.ctsTickR.style.opacity = '0';
      }

      // Typography contracts into central origin (640, 360) and shifts to warm amber
      if (els.ctsTextWrapper) {
        els.ctsTextWrapper.setAttribute('transform', `translate(640, 360) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`);
        els.ctsTextWrapper.style.opacity = textFade.toFixed(3);
      }
      if (els.ctsText) {
        els.ctsText.setAttribute('fill', '#fbbf24');
      }

      if (els.statusText) els.statusText.textContent = 'IDENTITY RESOLVING INTO SIGNAL';
    }

    // -----------------------------------------------------------
    // BEAT 2: SIGNAL EXTENDS INTO OPERATING SPINE (2.0s - 2.6s)
    // -----------------------------------------------------------
    else if (t < 2.6) {
      const uExt = (t - 2.0) / 0.6;
      const easeExt = easeOutQuad(uExt);
      const xL = lerp(640, 180, easeExt);
      const xR = lerp(640, 1100, easeExt);

      // Identity text is fully absorbed
      if (els.ctsTextWrapper) els.ctsTextWrapper.style.opacity = '0';
      if (els.ctsDatum) els.ctsDatum.style.opacity = '0';

      // Amber beam shoots horizontally outward
      if (els.ctsBeam) {
        els.ctsBeam.style.opacity = '1';
        if (els.ctsBeamGlow) {
          els.ctsBeamGlow.setAttribute('x1', xL.toFixed(1));
          els.ctsBeamGlow.setAttribute('x2', xR.toFixed(1));
        }
        if (els.ctsBeamCore) {
          els.ctsBeamCore.setAttribute('x1', xL.toFixed(1));
          els.ctsBeamCore.setAttribute('x2', xR.toFixed(1));
        }
      }

      // Spine system underlying line reveals
      if (els.spineSystem) {
        els.spineSystem.style.opacity = easeExt.toFixed(3);
      }

      if (els.editorialHeader) {
        els.editorialHeader.style.opacity = '0';
      }

      if (els.statusText) els.statusText.textContent = 'OPERATING SPINE FORMING';
    }

    // -----------------------------------------------------------
    // BEAT 3: INHERITED SIGNAL TRAVELS TO FIRST ANCHOR (2.6s - 3.2s)
    // -----------------------------------------------------------
    else if (t < 3.2) {
      if (els.ctsTextWrapper) els.ctsTextWrapper.style.opacity = '0';
      if (els.ctsDatum) els.ctsDatum.style.opacity = '0';

      // Beam fades as spine base line is established
      if (els.ctsBeam) {
        const beamFade = clamp(1 - (t - 2.6) / 0.4, 0, 1);
        els.ctsBeam.style.opacity = beamFade.toFixed(3);
      }

      if (els.spineSystem) els.spineSystem.style.opacity = '1';

      // Editorial header gently reveals
      if (els.editorialHeader) {
        const hOp = clamp((t - 2.6) / 0.6, 0, 1);
        els.editorialHeader.style.opacity = hOp.toFixed(3);
      }

      if (els.statusText) els.statusText.textContent = 'OPERATING SPINE FORMING';
    }

    // -----------------------------------------------------------
    // BEAT 4: OPERATING SPINE TRAVERSAL & SYSTEM COMPLETION (3.2s+)
    // -----------------------------------------------------------
    else {
      if (els.ctsLayer) els.ctsLayer.style.opacity = '0';
      if (els.ctsBeam) els.ctsBeam.style.opacity = '0';
      if (els.spineSystem) els.spineSystem.style.opacity = '1';
      if (els.editorialHeader) els.editorialHeader.style.opacity = '1';
    }

    // Luminous Pulse Position
    const pulsePos = getPulsePosition(t);
    if (els.luminousPulse) {
      els.luminousPulse.style.opacity = pulsePos.opacity.toFixed(3);
      const pScale = pulsePos.scale || 1.0;
      els.luminousPulse.setAttribute('transform', `translate(${pulsePos.x.toFixed(1)}, ${pulsePos.y.toFixed(1)}) scale(${pScale})`);
    }

    // Active Spine Line (Only starts growing from x=180 rightward once t >= 3.2)
    if (els.spineActiveLine && els.spineActiveCore) {
      if (t >= 3.2) {
        const activeX = clamp(pulsePos.x, 180, 1100);
        els.spineActiveLine.setAttribute('x1', '180');
        els.spineActiveLine.setAttribute('x2', activeX.toFixed(1));
        els.spineActiveLine.style.opacity = '1';
        els.spineActiveCore.setAttribute('x1', '180');
        els.spineActiveCore.setAttribute('x2', activeX.toFixed(1));
        els.spineActiveCore.style.opacity = '1';
      } else {
        els.spineActiveLine.style.opacity = '0';
        els.spineActiveCore.style.opacity = '0';
      }
    }

    // -----------------------------------------------------------
    // 7 QUIET ANCHOR POINTS & STAGE ACTIVATION (Causal Thresholds)
    // -----------------------------------------------------------
    els.stages.forEach((s) => {
      const isActivated = (t >= s.time);
      const isHovered = (hoveredStageIndex === s.index);

      // Quiet anchors resolve progressively as beam reaches their X coordinate during 2.0s - 2.6s
      const distFromCenter = Math.abs(s.x - 640);
      const thresholdTime = 2.0 + (distFromCenter / 460) * 0.55;
      const anchorFormed = (t >= thresholdTime);

      if (s.circle) {
        if (!anchorFormed) {
          s.circle.style.opacity = '0';
        } else {
          s.circle.style.opacity = '1';
          if (isHovered) {
            s.circle.setAttribute('stroke', '#fbbf24');
            s.circle.setAttribute('stroke-width', '2.2');
            s.circle.setAttribute('filter', 'url(#ch04-pulseGlow)');
          } else if (isActivated) {
            s.circle.setAttribute('stroke', '#f59e0b');
            s.circle.setAttribute('stroke-width', s.index === 3 ? '2.0' : '1.5');
            s.circle.removeAttribute('filter');
          } else {
            // Quiet dormant anchor
            s.circle.setAttribute('stroke', '#334155');
            s.circle.setAttribute('stroke-width', '1.2');
            s.circle.removeAttribute('filter');
          }
        }
      }

      if (s.core) {
        if (!anchorFormed) {
          s.core.style.opacity = '0';
        } else {
          s.core.style.opacity = '1';
          if (isHovered || isActivated) {
            s.core.setAttribute('fill', isHovered ? '#ffffff' : '#fbbf24');
          } else {
            s.core.setAttribute('fill', '#475569');
          }
        }
      }

      if (s.halo) {
        if (isHovered) {
          s.halo.style.opacity = '1';
          s.halo.setAttribute('r', s.index === 3 ? '38' : '30');
          s.halo.setAttribute('stroke', '#fbbf24');
        } else if (isActivated) {
          s.halo.style.opacity = (t >= 10.4 ? '0.4' : '0.25');
          s.halo.setAttribute('r', s.index === 3 ? '30' : '24');
          s.halo.setAttribute('stroke', '#f59e0b');
        } else {
          s.halo.style.opacity = '0';
        }
      }

      // LABELS: Never reveal simultaneously! Only when activated or hovered!
      if (s.label) {
        s.label.style.opacity = isActivated ? '1' : (isHovered ? '1' : '0');
        s.label.setAttribute('fill', isHovered ? '#ffffff' : '#f8fafc');
      }
      if (s.code) {
        s.code.style.opacity = isActivated ? '1' : (isHovered ? '1' : '0');
        s.code.setAttribute('fill', isHovered ? '#fbbf24' : '#f59e0b');
      }
      if (s.sub) {
        s.sub.style.opacity = isActivated ? '1' : (isHovered ? '1' : '0');
        s.sub.setAttribute('fill', isHovered ? '#cbd5e1' : '#94a3b8');
      }
    });

    // 1. Quote -> Finance Branch (t >= 4.3s)
    if (els.branchQuoteFinance) {
      const u = clamp((t - 4.3) / 0.5, 0, 1);
      els.branchQuoteFinance.style.opacity = u.toFixed(3);
    }

    // 2. Procure -> Suppliers Branch (t >= 5.5s)
    if (els.branchProcureSuppliers) {
      const u = clamp((t - 5.5) / 0.5, 0, 1);
      els.branchProcureSuppliers.style.opacity = u.toFixed(3);
    }

    // 3. Make -> Dominant Beat Accents + Operations & People Branches (t >= 6.9s)
    if (t >= 6.9) {
      const u = clamp((t - 6.9) / 0.6, 0, 1);
      if (els.branchMakeOps) els.branchMakeOps.style.opacity = u.toFixed(3);
      if (els.branchMakePeople) els.branchMakePeople.style.opacity = u.toFixed(3);
      if (els.makeBlueprint) {
        els.makeBlueprint.style.opacity = u.toFixed(3);
        const rot = lerp(-15, 0, u);
        els.makeBlueprint.setAttribute('transform', `translate(640, 360) rotate(${rot.toFixed(1)})`);
      }
    } else {
      if (els.branchMakeOps) els.branchMakeOps.style.opacity = '0';
      if (els.branchMakePeople) els.branchMakePeople.style.opacity = '0';
      if (els.makeBlueprint) els.makeBlueprint.style.opacity = '0';
    }

    // 4. Deliver -> Administration Branch (t >= 8.8s)
    if (els.branchDeliverAdmin) {
      const u = clamp((t - 8.8) / 0.5, 0, 1);
      els.branchDeliverAdmin.style.opacity = u.toFixed(3);
    }

    // 5. Bill -> Finance Billing & Revenue Bridge (t >= 9.6s)
    if (els.branchBillFinance) {
      const u = clamp((t - 9.6) / 0.5, 0, 1);
      els.branchBillFinance.style.opacity = u.toFixed(3);
    }

    // 6. Collect -> Cash Control Branch (t >= 10.4s)
    if (els.branchCollectCash) {
      const u = clamp((t - 10.4) / 0.5, 0, 1);
      els.branchCollectCash.style.opacity = u.toFixed(3);
    }

    // -----------------------------------------------------------
    // BEAT 5: PULL-BACK REVEAL & FOOTER SETTLE (10.4s - 12.9s)
    // -----------------------------------------------------------
    if (t >= 10.4) {
      const u = clamp((t - 10.4) / 1.6, 0, 1);
      const easeU = easeInOutCubic(u);
      const scaleVal = lerp(1.0, 0.95, easeU);

      if (els.cameraWorld) {
        els.cameraWorld.setAttribute('transform', `translate(0, -18) scale(${scaleVal.toFixed(3)})`);
      }
      if (els.statusText) els.statusText.textContent = 'SYSTEM COMPLETE // INTERACTIVE INSPECT';
    } else {
      if (els.cameraWorld) els.cameraWorld.setAttribute('transform', 'translate(0, -18) scale(1)');

      if (t >= 3.2 && t < 10.4) {
        const currentStage = STAGES.slice().reverse().find(s => t >= s.time) || STAGES[0];
        if (els.statusText) els.statusText.textContent = `TRAVERSING: STAGE ${currentStage.code} // ${currentStage.name.toUpperCase()}`;
      }
    }

    // -----------------------------------------------------------
    // TIMELINE CONTROLS UPDATE
    // -----------------------------------------------------------
    const pct = (t / TOTAL_DURATION) * 100;
    if (els.timelineFill) els.timelineFill.style.width = pct.toFixed(2) + '%';
    if (els.timelineScrubber) els.timelineScrubber.style.left = pct.toFixed(2) + '%';

    if (els.timeReadout) {
      const sec = Math.floor(t);
      const ms = Math.floor((t % 1) * 10);
      const sStr = sec < 10 ? '0' + sec : sec;
      els.timeReadout.textContent = `${sStr}.${ms}s / ${TOTAL_DURATION.toFixed(1)}s`;
    }

    // Update Timeline Stage Markers highlight
    const markers = document.querySelectorAll('.ch04-timeline-stage-marker');
    STAGES.forEach((s, idx) => {
      if (markers[idx]) {
        if (t >= s.time) markers[idx].classList.add('is-passed');
        else markers[idx].classList.remove('is-passed');
      }
    });
  }

  /**
   * Interactive Inspector Update
   */
  function showInspectorForStage(s) {
    if (!s) {
      if (els.inspector) els.inspector.classList.remove('is-active');
      hoveredStageIndex = null;
      updateAtTime(currentTime);
      return;
    }

    const stageObj = typeof s === 'number' ? STAGES[s] : (STAGES.find(st => st.code === s.code || st.id === s.id || st.index === s.index) || s);
    hoveredStageIndex = stageObj.index !== undefined ? stageObj.index : null;
    updateAtTime(currentTime);

    const subText = (els.stages && els.stages[stageObj.index] && els.stages[stageObj.index].sub)
      ? els.stages[stageObj.index].sub.textContent
      : '';

    if (els.inspectTag) els.inspectTag.textContent = `STAGE ${stageObj.code} // ${stageObj.name.toUpperCase()}`;
    if (els.inspectTitle) els.inspectTitle.textContent = subText ? `${stageObj.name} · ${subText}` : stageObj.name;
    if (els.inspectOwner) els.inspectOwner.textContent = `OWNERSHIP: ${stageObj.owner || ''}`;
    if (els.inspectDesc) els.inspectDesc.textContent = stageObj.desc || '';
    if (els.inspectChips) {
      const chips = stageObj.chips || [];
      els.inspectChips.innerHTML = chips.map(c => `<span class="ch04-inspector-chip">${c}</span>`).join('');
    }
    if (els.inspector) els.inspector.classList.add('is-active');
  }

  function hideInspector() {
    showInspectorForStage(null);
  }

  /**
   * Playback Animation Loop
   */
  function animLoop(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    currentTime += delta;
    if (currentTime >= TOTAL_DURATION) {
      currentTime = TOTAL_DURATION;
      pause();
    }

    updateAtTime(currentTime);

    if (isPlaying) {
      animReq = requestAnimationFrame(animLoop);
    }
  }

  function play() {
    if (currentTime >= TOTAL_DURATION) {
      currentTime = 0.0;
    }
    isPlaying = true;
    lastTimestamp = null;
    if (els.playIcon) els.playIcon.style.display = 'none';
    if (els.pauseIcon) els.pauseIcon.style.display = 'block';
    animReq = requestAnimationFrame(animLoop);
  }

  function pause() {
    isPlaying = false;
    if (animReq) {
      cancelAnimationFrame(animReq);
      animReq = null;
    }
    if (els.playIcon) els.playIcon.style.display = 'block';
    if (els.pauseIcon) els.pauseIcon.style.display = 'none';
  }

  function togglePlay() {
    if (isPlaying) pause();
    else play();
  }

  function setTime(targetTime) {
    pause();
    currentTime = clamp(targetTime, 0, TOTAL_DURATION);
    updateAtTime(currentTime);
  }

  function resetNarrative() {
    pause();
    currentTime = 0.0;
    updateAtTime(currentTime);
    play();
  }

  /**
   * Event Listeners Setup
   */
  function initListeners() {
    if (els.playBtn) els.playBtn.addEventListener('click', togglePlay);
    if (els.replayBtn) els.replayBtn.addEventListener('click', resetNarrative);

    // Timeline Scrubbing
    if (els.timelineContainer) {
      const seek = (e) => {
        const rect = els.timelineContainer.getBoundingClientRect();
        const pos = clamp((e.clientX - rect.left) / rect.width, 0, 1);
        setTime(pos * TOTAL_DURATION);
      };

      els.timelineContainer.addEventListener('mousedown', (e) => {
        isDraggingScrubber = true;
        seek(e);
      });

      window.addEventListener('mousemove', (e) => {
        if (isDraggingScrubber) seek(e);
      });

      window.addEventListener('mouseup', () => {
        isDraggingScrubber = false;
      });
    }

    // Stage Hover & Click Listeners
    els.stages.forEach(s => {
      if (s.hitbox) {
        s.hitbox.addEventListener('mouseenter', () => showInspectorForStage(s));
        s.hitbox.addEventListener('mouseleave', () => hideInspector());
        s.hitbox.addEventListener('click', () => {
          setTime(s.time);
          showInspectorForStage(s);
        });
      }
    });

    // Keyboard Shortcuts (only when Chapter 04 is currently in view or focused)
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      // Check if Chapter 04 is substantially visible in viewport
      if (!els.ch04Section) return;
      const rect = els.ch04Section.getBoundingClientRect();
      const inView = (rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.25);
      if (!inView) return;

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setTime(currentTime - 0.5);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setTime(currentTime + 0.5);
      } else if (e.key >= '1' && e.key <= '7') {
        const idx = parseInt(e.key, 10) - 1;
        if (STAGES[idx]) {
          setTime(STAGES[idx].time);
          showInspectorForStage(STAGES[idx]);
        }
      } else if (e.key === 'r' || e.key === 'R') {
        resetNarrative();
      }
    });
  }

  /**
   * Viewport Intersection Observer & Global Header Sync
   */
  let isCh04InView = false;

  function syncGlobalHeader() {
    if (!isCh04InView) return;
    const globalStatusText = document.querySelector('.portfolio-header__status-text');
    if (globalStatusText && globalStatusText.textContent !== '04 // OPERATING SPINE') {
      globalStatusText.textContent = '04 // OPERATING SPINE';
    }
  }

  // Guard global header against background chapter clobbering while Chapter 04 is in view
  try {
    const globalStatusText = document.querySelector('.portfolio-header__status-text');
    if (globalStatusText) {
      const headerGuard = new MutationObserver(() => {
        if (isCh04InView && globalStatusText.textContent !== '04 // OPERATING SPINE') {
          globalStatusText.textContent = '04 // OPERATING SPINE';
        }
      });
      headerGuard.observe(globalStatusText, { childList: true, characterData: true, subtree: true });
    }
  } catch (e) {
    // Graceful fallback
  }

  window.addEventListener('scroll', () => {
    if (isCh04InView) {
      requestAnimationFrame(syncGlobalHeader);
    }
  }, { passive: true });

  function initViewportObserver() {
    if (!els.ch04Section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isCh04InView = true;
          syncGlobalHeader();
          if (prefersReducedMotion) {
            setTime(12.5);
            return;
          }
          if (!hasAutoPlayed) {
            hasAutoPlayed = true;
            resetNarrative();
          } else if (!isPlaying && currentTime < TOTAL_DURATION) {
            play();
          }
        } else {
          isCh04InView = false;
          if (isPlaying) {
            pause();
          }
        }
      });
    }, {
      threshold: 0.25
    });

    observer.observe(els.ch04Section);
  }

  function init() {
    queryElements();
    initListeners();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      currentTime = 12.5;
    } else {
      currentTime = 0.0;
    }
    updateAtTime(currentTime);

    initViewportObserver();
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose controller for testing, verification & review
  window.Chapter04Controller = {
    play,
    pause,
    togglePlay,
    setTime,
    resetNarrative,
    showInspectorForStage,
    hideInspector,
    updateAtTime,
    getState: () => ({
      currentTime,
      isPlaying,
      hoveredStageIndex,
      TOTAL_DURATION,
      stages: STAGES.map(s => ({
        index: s.index,
        id: s.id,
        name: s.name,
        code: s.code,
        time: s.time,
        owner: s.owner,
        desc: s.desc,
        chips: s.chips,
        isActivated: currentTime >= s.time
      }))
    })
  };
})();
