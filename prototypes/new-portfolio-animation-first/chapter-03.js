/**
 * CHAPTER 03: PROFESSIONAL SYSTEMS — SCENE 01 (TECHNICAL ASSEMBLY)
 * Production Controller & Motion Engine
 * 
 * Frozen Visual & Motion Authority:
 * D:\Projects\open-design\.od\projects\ch03-scene01-technical-assembly\standalone-animated.html
 * 
 * Features:
 * - Guided camera trajectory with non-linear ease curves
 * - Continuous luminous currents (repeating linearGradients, zero dashes)
 * - Kinetic typography hub upgrade (Cost Control -> Service Profitability & Business Control)
 * - Restored opening lockups: UI Makara + Traktor Nusantara
 * - Manual 4-slot barrel reel with boundary pass-through to page scroll
 * - IntersectionObserver viewport auto-trigger
 * - Reduced motion accessibility support
 */

(function () {
  'use strict';

  const TOTAL_DURATION = 17.0; // seconds
  let currentTime = 0.0;
  let isPlaying = false;
  let animReq = null;
  let lastTimestamp = null;
  let hasAutoPlayed = false;

  // DOM Elements Cache
  let ch03Section = null;
  let world = null;
  let midStars = null;
  let distStars = null;
  let replayBtn = null;

  // S1 Transition Elements
  let seq1Layer = null;
  let nodeUi = null;
  let nodeTraknus = null;

  // Conduits & Nodes
  let roleHub = null;
  let upgradedHub = null;
  let txtUpgraded1 = null;
  let txtUpgraded2 = null;
  let upgradeScanline = null;
  let scanlineBeam = null;
  let scanlineCore = null;
  let scanlinePipL = null;
  let scanlinePipR = null;

  let groupInputs = null;
  let anchorSap = null;
  let txtSap = null;
  let anchorBranch = null;
  let txtBranch = null;
  let anchorContracts = null;
  let txtContracts = null;

  let groupTools = null;
  let toolExcel = null;
  let toolSheets = null;
  let toolAppscript = null;
  let toolLooker = null;
  let txtExcel = null;
  let txtSheets = null;
  let txtAppscript = null;
  let txtLooker = null;

  let groupCross = null;
  let cardVendor = null;
  let anchorVendor = null;
  let txtVendor = null;
  let cardAccounting = null;
  let anchorAcc = null;
  let txtAcc = null;
  let cardParts = null;
  let anchorParts = null;
  let txtParts = null;
  let cardMarketing = null;
  let anchorMarketing = null;
  let txtMarketing = null;

  let groupOutputs = null;
  let reelScrollHitbox = null;
  let reelRailThumb = null;
  let outputReelItems = null;
  let reelIndicator = null;
  let reelTxt0 = null;
  let reelTxt1 = null;
  let reelTxt2 = null;
  let reelTxt3 = null;
  let reelTxt4 = null;
  let reelTxt5 = null;
  let anchorSlot0 = null;
  let anchorSlot1 = null;
  let anchorSlot2 = null;
  let anchorSlot3 = null;
  let anchorProf = null;
  let txtProf = null;
  let anchorProc = null;
  let txtProc = null;
  let anchorCont = null;
  let txtCont = null;
  let anchorPric = null;
  let txtPric = null;

  // Continuous Current Elements
  let s1_1_glow = null, s1_1_line = null, s1_1_surge = null;
  let s1_2_glow = null, s1_2_line = null, s1_2_surge = null;
  let sap_glow = null, sap_line = null, sap_surge = null;
  let branch_glow = null, branch_line = null, branch_surge = null;
  let cont_glow = null, cont_line = null, cont_surge = null;
  let acc_glow = null, acc_line = null, acc_surge = null;
  let parts_glow = null, parts_line = null, parts_surge = null;
  let vendor_glow = null, vendor_surge = null;
  let mkt_glow = null, mkt_surge = null;
  let prof_glow = null, prof_line = null, prof_surge = null;
  let proc_glow = null, proc_line = null, proc_surge = null;
  let ocont_glow = null, ocont_line = null, ocont_surge = null;
  let pric_glow = null, pric_line = null, pric_surge = null;
  let pulseSysWave = null;

  // Conduit repeat-gradient mapping
  const CONDUIT_MAP = {
    'solid-s1-1-glow': { gradId: 'stream-s1-1', cfg: { x1: 640, y1: -35, ux: 0, uy: 1, lambda: 80 } },
    'solid-s1-2-glow': { gradId: 'stream-s1-2', cfg: { x1: 640, y1: 138, ux: 0, uy: 1, lambda: 90 } },
    'solid-sap-glow': { gradId: 'stream-sap', cfg: { x1: 310, y1: 200, ux: 0.8944, uy: 0.4472, lambda: 120 } },
    'solid-branch-glow': { gradId: 'stream-branch', cfg: { x1: 310, y1: 295, ux: 1.0, uy: 0, lambda: 120 } },
    'solid-contracts-glow': { gradId: 'stream-contracts', cfg: { x1: 310, y1: 390, ux: 0.8944, uy: -0.4472, lambda: 120 } },
    'solid-acc-glow': { gradId: 'stream-acc', cfg: { x1: 640, y1: 480, ux: -0.8805, uy: 0.4741, lambda: 120 } },
    'solid-parts-glow': { gradId: 'stream-parts', cfg: { x1: 640, y1: 480, ux: 0.8805, uy: 0.4741, lambda: 120 } },
    'solid-vendor-glow': { gradId: 'stream-vendor', cfg: { x1: 640, y1: 480, ux: -0.9835, uy: 0.1811, lambda: 120 } },
    'solid-marketing-glow': { gradId: 'stream-marketing', cfg: { x1: 640, y1: 480, ux: 0.9835, uy: 0.1811, lambda: 120 } },
    'solid-prof-glow': { gradId: 'stream-prof', cfg: { x1: 780, y1: 295, ux: 0.8732, uy: -0.4875, lambda: 120 } },
    'solid-proc-glow': { gradId: 'stream-proc', cfg: { x1: 780, y1: 295, ux: 0.9828, uy: -0.1849, lambda: 120 } },
    'solid-cont-glow': { gradId: 'stream-cont', cfg: { x1: 780, y1: 295, ux: 0.9840, uy: 0.1783, lambda: 120 } },
    'solid-pric-glow': { gradId: 'stream-pric', cfg: { x1: 780, y1: 295, ux: 0.8753, uy: 0.4836, lambda: 120 } }
  };

  function queryElements() {
    ch03Section = document.getElementById('chapter-03');
    world = document.getElementById('camera-world');
    midStars = document.getElementById('layer-stars-mid');
    distStars = document.getElementById('layer-stars-distant');
    replayBtn = document.getElementById('ch03-replay-btn');

    seq1Layer = document.getElementById('seq1-layer');
    nodeUi = document.getElementById('node-ui');
    nodeTraknus = document.getElementById('node-traknus');

    roleHub = document.getElementById('center-role-hub');
    upgradedHub = document.getElementById('center-upgraded-hub');
    txtUpgraded1 = document.getElementById('txt-upgraded-1');
    txtUpgraded2 = document.getElementById('txt-upgraded-2');
    upgradeScanline = document.getElementById('hub-upgrade-scanline');
    scanlineBeam = document.getElementById('scanline-beam');
    scanlineCore = document.getElementById('scanline-core');
    scanlinePipL = document.getElementById('scanline-pip-l');
    scanlinePipR = document.getElementById('scanline-pip-r');

    groupInputs = document.getElementById('group-business-inputs');
    anchorSap = document.getElementById('anchor-sap');
    txtSap = document.getElementById('txt-sap');
    anchorBranch = document.getElementById('anchor-branch');
    txtBranch = document.getElementById('txt-branch');
    anchorContracts = document.getElementById('anchor-contracts');
    txtContracts = document.getElementById('txt-contracts');

    groupTools = document.getElementById('group-analytical-tools');
    toolExcel = document.getElementById('rect-excel');
    toolSheets = document.getElementById('rect-sheets');
    toolAppscript = document.getElementById('rect-appscript');
    toolLooker = document.getElementById('rect-looker');
    txtExcel = document.getElementById('txt-excel');
    txtSheets = document.getElementById('txt-sheets');
    txtAppscript = document.getElementById('txt-appscript');
    txtLooker = document.getElementById('txt-looker');

    groupCross = document.getElementById('group-cross-functional');
    cardVendor = document.getElementById('card-vendor');
    anchorVendor = document.getElementById('anchor-vendor');
    txtVendor = document.getElementById('txt-vendor');
    cardAccounting = document.getElementById('card-accounting');
    anchorAcc = document.getElementById('anchor-accounting');
    txtAcc = document.getElementById('txt-accounting');
    cardParts = document.getElementById('card-parts');
    anchorParts = document.getElementById('anchor-parts');
    txtParts = document.getElementById('txt-parts');
    cardMarketing = document.getElementById('card-marketing');
    anchorMarketing = document.getElementById('anchor-marketing');
    txtMarketing = document.getElementById('txt-marketing');

    groupOutputs = document.getElementById('group-operational-outputs');
    reelScrollHitbox = document.getElementById('reel-scroll-hitbox');
    reelRailThumb = document.getElementById('reel-rail-thumb');
    outputReelItems = document.getElementById('output-reel-items');
    reelIndicator = document.getElementById('reel-indicator');
    reelTxt0 = document.getElementById('reel-txt-0');
    reelTxt1 = document.getElementById('reel-txt-1');
    reelTxt2 = document.getElementById('reel-txt-2');
    reelTxt3 = document.getElementById('reel-txt-3');
    reelTxt4 = document.getElementById('reel-txt-4');
    reelTxt5 = document.getElementById('reel-txt-5');
    anchorSlot0 = document.getElementById('anchor-slot-0');
    anchorSlot1 = document.getElementById('anchor-slot-1');
    anchorSlot2 = document.getElementById('anchor-slot-2');
    anchorSlot3 = document.getElementById('anchor-slot-3');

    anchorProf = document.getElementById('anchor-prof') || anchorSlot0;
    anchorProc = document.getElementById('anchor-proc') || anchorSlot1;
    anchorCont = document.getElementById('anchor-cont') || anchorSlot2;
    anchorPric = document.getElementById('anchor-pric') || anchorSlot3;

    txtProf = document.getElementById('txt-prof') || reelTxt0;
    txtProc = document.getElementById('txt-proc') || reelTxt1;
    txtCont = document.getElementById('txt-cont') || reelTxt2;
    txtPric = document.getElementById('txt-pric') || reelTxt3;

    s1_1_glow = document.getElementById('solid-s1-1-glow');
    s1_1_line = document.getElementById('solid-s1-1-line');
    s1_1_surge = document.getElementById('surge-s1-1');

    s1_2_glow = document.getElementById('solid-s1-2-glow');
    s1_2_line = document.getElementById('solid-s1-2-line');
    s1_2_surge = document.getElementById('surge-s1-2');

    sap_glow = document.getElementById('solid-sap-glow');
    sap_line = document.getElementById('solid-sap-line');
    sap_surge = document.getElementById('surge-sap');

    branch_glow = document.getElementById('solid-branch-glow');
    branch_line = document.getElementById('solid-branch-line');
    branch_surge = document.getElementById('surge-branch');

    cont_glow = document.getElementById('solid-contracts-glow');
    cont_line = document.getElementById('solid-contracts-line');
    cont_surge = document.getElementById('surge-contracts');

    acc_glow = document.getElementById('solid-acc-glow');
    acc_line = document.getElementById('solid-acc-line');
    acc_surge = document.getElementById('surge-acc');

    parts_glow = document.getElementById('solid-parts-glow');
    parts_line = document.getElementById('solid-parts-line');
    parts_surge = document.getElementById('surge-parts');

    vendor_glow = document.getElementById('solid-vendor-glow');
    vendor_surge = document.getElementById('surge-vendor');

    mkt_glow = document.getElementById('solid-marketing-glow');
    mkt_surge = document.getElementById('surge-marketing');

    prof_glow = document.getElementById('solid-prof-glow');
    prof_line = document.getElementById('solid-prof-line');
    prof_surge = document.getElementById('surge-prof');

    proc_glow = document.getElementById('solid-proc-glow');
    proc_line = document.getElementById('solid-proc-line');
    proc_surge = document.getElementById('surge-proc');

    ocont_glow = document.getElementById('solid-cont-glow');
    ocont_line = document.getElementById('solid-cont-line');
    ocont_surge = document.getElementById('surge-cont');

    pric_glow = document.getElementById('solid-pric-glow');
    pric_line = document.getElementById('solid-pric-line');
    pric_surge = document.getElementById('surge-pric');

    pulseSysWave = document.getElementById('pulse-system-wave');
  }

  // Easing Functions
  function snapEase(u) {
    if (u <= 0.0) return 0.0;
    if (u >= 1.0) return 1.0;
    return 1 - Math.pow(1 - u, 4); // Quartic ease-out
  }

  function cameraEase(u) {
    if (u <= 0.0) return 0.0;
    if (u >= 1.0) return 1.0;
    return u < 0.5
      ? 4 * u * u * u
      : 1 - Math.pow(-2 * u + 2, 3) / 2; // Smooth cubic in-out
  }

  function pullbackEase(u) {
    if (u <= 0.0) return 0.0;
    if (u >= 1.0) return 1.0;
    const t = u - 1;
    const s = 0.22;
    return 1 + (s + 1) * t * t * t + s * t * t;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // Exact Camera Trajectory for 17.0s Sequence
  function getCameraState(t) {
    // 1. 0.0s - 1.2s: UI Origin
    if (t < 1.2) {
      return { x: 640, y: -60, zoom: 2.85, label: 'CAM: 1. ACADEMIC ORIGIN: UNIVERSITAS INDONESIA [2.85×]' };
    }
    // 2. 1.2s - 2.4s: Traktor Nusantara
    else if (t < 2.4) {
      if (t <= 1.45) {
        const u = cameraEase((t - 1.2) / 0.25);
        return {
          x: 640,
          y: lerp(-60, 110, u),
          zoom: 2.85,
          label: 'CAM: 2. DOCKING → TRAKTOR NUSANTARA'
        };
      } else {
        return { x: 640, y: 110, zoom: 2.85, label: 'CAM: 2. CORPORATE TRANSITION: TRAKTOR NUSANTARA [2.85×]' };
      }
    }
    // 3. 2.4s - 3.0s: Cost Control Hub Focus
    else if (t < 3.0) {
      if (t <= 2.65) {
        const u = cameraEase((t - 2.4) / 0.25);
        return {
          x: 640,
          y: lerp(110, 295, u),
          zoom: 2.85,
          label: 'CAM: 3. DOCKING → COST CONTROL HUB'
        };
      } else {
        return { x: 640, y: 295, zoom: 2.85, label: 'CAM: 3. BASE ROLE: COST CONTROL [2.85×]' };
      }
    }
    // 4. 3.0s - 4.2s: BUSINESS INPUTS (Fast Progressive Snaps)
    else if (t < 4.2) {
      // 4A. SAP (3.00s - 3.40s)
      if (t < 3.40) {
        if (t <= 3.16) {
          const u = snapEase((t - 3.00) / 0.16);
          return {
            x: lerp(640, 220, u),
            y: lerp(295, 200, u),
            zoom: lerp(2.85, 2.50, u),
            label: 'CAM: 4A. SNAP → SAP INPUT'
          };
        } else {
          return { x: 220, y: 200, zoom: 2.50, label: 'CAM: 4A. NODE FOCUS: SAP' };
        }
      }
      // 4B. Service Branch (3.40s - 3.80s)
      else if (t < 3.80) {
        if (t <= 3.56) {
          const u = snapEase((t - 3.40) / 0.16);
          return {
            x: 220,
            y: lerp(200, 295, u),
            zoom: 2.50,
            label: 'CAM: 4B. SNAP → SERVICE BRANCH'
          };
        } else {
          return { x: 220, y: 295, zoom: 2.50, label: 'CAM: 4B. NODE FOCUS: SERVICE BRANCH' };
        }
      }
      // 4C. Customer Contracts (3.80s - 4.20s)
      else {
        if (t <= 3.96) {
          const u = snapEase((t - 3.80) / 0.16);
          return {
            x: 220,
            y: lerp(295, 390, u),
            zoom: 2.50,
            label: 'CAM: 4C. SNAP → CUSTOMER CONTRACTS'
          };
        } else {
          return { x: 220, y: 390, zoom: 2.50, label: 'CAM: 4C. NODE FOCUS: CUSTOMER CONTRACTS' };
        }
      }
    }
    // 5. 4.2s - 5.4s: COORDINATION
    else if (t < 5.4) {
      if (t < 4.80) {
        if (t <= 4.38) {
          const u = snapEase((t - 4.20) / 0.18);
          return {
            x: lerp(220, 575, u),
            y: lerp(390, 540, u),
            zoom: lerp(2.50, 2.60, u),
            label: 'CAM: 5A. SNAP → ACCOUNTING'
          };
        } else {
          return { x: 575, y: 540, zoom: 2.60, label: 'CAM: 5A. COORDINATION: ACCOUNTING' };
        }
      } else {
        if (t <= 4.96) {
          const u = snapEase((t - 4.80) / 0.16);
          return {
            x: lerp(575, 705, u),
            y: 540,
            zoom: 2.60,
            label: 'CAM: 5B. SNAP → PARTS'
          };
        } else {
          return { x: 705, y: 540, zoom: 2.60, label: 'CAM: 5B. COORDINATION: PARTS' };
        }
      }
    }
    // 6. 5.4s - 6.6s: ANALYTICAL TOOLS
    else if (t < 6.6) {
      if (t <= 5.58) {
        const u = snapEase((t - 5.40) / 0.18);
        return {
          x: lerp(705, 205, u),
          y: lerp(540, 535, u),
          zoom: lerp(2.60, 2.20, u),
          label: 'CAM: 6. SNAP → ANALYTICAL TOOLS'
        };
      } else {
        return {
          x: 205,
          y: 535,
          zoom: 2.20,
          label: 'CAM: 6. ANALYTICAL TOOLS WORKBENCH'
        };
      }
    }
    // 7. 6.6s - 8.6s: OPERATIONAL OUTPUTS
    else if (t < 8.6) {
      if (t <= 6.80) {
        const u = snapEase((t - 6.60) / 0.20);
        return {
          x: lerp(205, 1080, u),
          y: lerp(535, 295, u),
          zoom: lerp(2.20, 2.40, u),
          label: 'CAM: 7. SNAP → OPERATIONAL OUTPUTS'
        };
      } else {
        return { x: 1080, y: 295, zoom: 2.40, label: 'CAM: 7. OPERATIONAL OUTPUTS' };
      }
    }
    // 8. 8.6s - 9.8s: PULL BACK TO FULL NETWORK
    else if (t < 9.8) {
      const u = pullbackEase((t - 8.60) / 1.20);
      return {
        x: lerp(1080, 640, u),
        y: lerp(295, 360, u),
        zoom: lerp(2.40, 1.00, u),
        label: 'CAM: 8. FULL NETWORK OVERVIEW [1.00×]'
      };
    }
    // 9. 9.8s - 11.0s: S1 EQUILIBRIUM HOLD
    else if (t < 11.0) {
      return { x: 640, y: 360, zoom: 1.00, label: 'CAM: 9. SETTLED NETWORK EQUILIBRIUM' };
    }
    // 10. 11.0s - 12.2s: ZOOM IN TO COST CONTROL HUB
    else if (t < 12.2) {
      const u = cameraEase((t - 11.0) / 1.20);
      return {
        x: 640,
        y: lerp(360, 295, u),
        zoom: lerp(1.00, 2.85, u),
        label: 'CAM: 10. HUB FOCUS: COST CONTROL [2.85×]'
      };
    }
    // 11. 12.2s - 13.6s: DISTINCTIVE HUB UPGRADE (HOLD FOR TRANSFORMATION)
    else if (t < 13.6) {
      return {
        x: 640,
        y: 295,
        zoom: 2.85,
        label: 'CAM: 11. ROLE UPGRADE: SERVICE PROFITABILITY & BUSINESS CONTROL [2.85×]'
      };
    }
    // 12. 13.6s - 15.0s: ZOOM OUT TO FULLY PRESENT EXPANDED NETWORK
    else if (t < 15.0) {
      const u = cameraEase((t - 13.6) / 1.40);
      return {
        x: 640,
        y: lerp(295, 360, u),
        zoom: lerp(2.85, 1.00, u),
        label: 'CAM: 12. EXPANDED NETWORK OVERVIEW [1.00×]'
      };
    }
    // 13. 15.0s - 17.0s: SETTLED EXPANDED SYSTEM EQUILIBRIUM
    else {
      return {
        x: 640,
        y: 360,
        zoom: 1.00,
        label: 'CAM: 13. SETTLED EXPANDED SYSTEM EQUILIBRIUM [1.00×]'
      };
    }
  }

    function applyCamera(cam) {
    const cx = cam.x;
    const cy = cam.y;
    const zoom = cam.zoom;

    if (world) {
      world.setAttribute('transform', 'translate(640, 360) scale(' + zoom + ') translate(' + (-cx) + ', ' + (-cy) + ')');
    }

    const dx = cx - 640;
    const dy = cy - 360;

    if (midStars) {
      midStars.setAttribute('transform', 'translate(' + (-dx * 0.06) + ', ' + (-dy * 0.06) + ')');
    }
    if (distStars) {
      distStars.setAttribute('transform', 'translate(' + (-dx * 0.015) + ', ' + (-dy * 0.015) + ')');
    }
  }

  // =========================================================================
  // MANUAL OUTPUT-REEL INTERACTION (Mouse-wheel / Trackpad gesture)
  // =========================================================================
  let manualReelIndex = 0; // 0: rows 01-04, 1: rows 02-05, 2: rows 03-06
  const MAX_REEL_INDEX = 2;

  function updateManualReel(index) {
    manualReelIndex = Math.max(0, Math.min(MAX_REEL_INDEX, index));
    const reelDy = -manualReelIndex * 63;

    if (outputReelItems) {
      outputReelItems.style.transition = 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)';
      outputReelItems.setAttribute('transform', 'translate(0, ' + reelDy + ')');
    }
    if (reelIndicator) {
      const startNum = (manualReelIndex + 1).toString().padStart(2, '0');
      const endNum = (manualReelIndex + 4).toString().padStart(2, '0');
      reelIndicator.textContent = startNum + '–' + endNum + ' / 06';
    }
    if (reelRailThumb) {
      const thumbY = 200 + manualReelIndex * 94; // 200, 294, 388
      reelRailThumb.style.transition = 'cy 0.32s cubic-bezier(0.16, 1, 0.3, 1)';
      reelRailThumb.setAttribute('cy', thumbY);
    }
  }

  // Intentional Gesture Handling: Wheel / Trackpad Scroll on Output-Reel Region
  let scrollAccum = 0;
  let lastScrollTime = 0;
  const SCROLL_THRESHOLD = 45; // px of accumulated scroll
  const SCROLL_COOLDOWN = 180; // ms

  function handleReelWheel(e) {
    // Determine if the reel can actually advance in the requested direction
    const isScrollingDown = e.deltaY > 0;
    const isScrollingUp = e.deltaY < 0;

    const canAdvanceDown = isScrollingDown && manualReelIndex < MAX_REEL_INDEX;
    const canAdvanceUp = isScrollingUp && manualReelIndex > 0;

    // If already at the boundary in the requested direction, allow normal page scrolling
    if (!canAdvanceDown && !canAdvanceUp) {
      scrollAccum = 0;
      return;
    }

    // Prevent page scroll only when the reel can actually advance
    e.preventDefault();

    const now = performance.now();
    if (now - lastScrollTime < SCROLL_COOLDOWN) {
      return;
    }

    scrollAccum += e.deltaY;

    if (Math.abs(scrollAccum) >= SCROLL_THRESHOLD) {
      const dir = scrollAccum > 0 ? 1 : -1;
      scrollAccum = 0;
      lastScrollTime = now;
      updateManualReel(manualReelIndex + dir);
    }
  }

  function initReelListeners() {
    if (reelScrollHitbox) {
      reelScrollHitbox.addEventListener('wheel', handleReelWheel, { passive: false });
    }
    if (groupOutputs) {
      groupOutputs.addEventListener('wheel', handleReelWheel, { passive: false });
    }
  }

  // =========================================================================
  // LIVE CONTINUOUS LUMINOUS CURRENT HELPER
  // =========================================================================
  function setSolidCurrent(glowElem, lineElem, surgeElem, timeVal, speed, opacity, direction = 1) {
    if (!surgeElem && !glowElem) return;
    if (opacity <= 0.001) {
      if (glowElem) glowElem.style.opacity = '0';
      if (surgeElem) surgeElem.style.opacity = '0';
      return;
    }
    if (glowElem) glowElem.style.opacity = (opacity * 0.85).toFixed(2);
    if (surgeElem) surgeElem.style.opacity = (opacity * 1.0).toFixed(2);

    const entry = glowElem ? CONDUIT_MAP[glowElem.id] : null;
    if (entry) {
      const grad = document.getElementById(entry.gradId);
      if (grad) {
        const cfg = entry.cfg;
        const rawPhase = (direction * timeVal * speed) % cfg.lambda;
        const phase = rawPhase < 0 ? rawPhase + cfg.lambda : rawPhase;
        const x1 = cfg.x1 + phase * cfg.ux;
        const y1 = cfg.y1 + phase * cfg.uy;
        const x2 = x1 + cfg.lambda * cfg.ux;
        const y2 = y1 + cfg.lambda * cfg.uy;
        grad.setAttribute('x1', x1.toFixed(2));
        grad.setAttribute('y1', y1.toFixed(2));
        grad.setAttribute('x2', x2.toFixed(2));
        grad.setAttribute('y2', y2.toFixed(2));
      }
    }
  }

  // Update Narrative Causal State and Progressive Reveal at time t
  function updateAtTime(t) {
    const cam = getCameraState(t);
    applyCamera(cam);

    // Progressive Group Visibilities based on Camera Narrative
    if (seq1Layer) {
      seq1Layer.style.opacity = t < 3.2 ? '1' : '0';
    }
    if (groupInputs) {
      groupInputs.style.opacity = t >= 2.4 ? '1' : '0';
    }
    if (groupCross) {
      groupCross.style.opacity = t >= 4.2 ? '1' : '0';
    }
    if (groupTools) {
      groupTools.style.opacity = t >= 5.4 ? '1' : '0';
    }
    if (groupOutputs) {
      groupOutputs.style.opacity = t >= 6.6 ? '1' : '0';
    }

    // =========================================================================
    // STAGES 1 & 2: S1 VECTOR CURRENTS (0.0s - 2.4s)
    // =========================================================================
    if (t < 0.8) {
      setSolidCurrent(s1_1_glow, s1_1_line, s1_1_surge, t, 160, 0);
      setSolidCurrent(s1_2_glow, s1_2_line, s1_2_surge, t, 160, 0);
      if (nodeTraknus) nodeTraknus.style.opacity = '0.15';
    } else if (t < 1.6) {
      setSolidCurrent(s1_1_glow, s1_1_line, s1_1_surge, t, 200, 1.0);
      setSolidCurrent(s1_2_glow, s1_2_line, s1_2_surge, t, 160, 0);
      if (nodeTraknus) nodeTraknus.style.opacity = '1';
    } else if (t < 2.4) {
      setSolidCurrent(s1_1_glow, s1_1_line, s1_1_surge, t, 120, 0.35);
      setSolidCurrent(s1_2_glow, s1_2_line, s1_2_surge, t, 220, 1.0);
      if (nodeTraknus) nodeTraknus.style.opacity = '1';
    } else {
      setSolidCurrent(s1_1_glow, s1_1_line, s1_1_surge, t, 100, 0);
      setSolidCurrent(s1_2_glow, s1_2_line, s1_2_surge, t, 100, 0);
    }

    // =========================================================================
    // STAGE 4: BUSINESS INPUTS SOLID INFLOW LINES (2.4s - 4.2s)
    // =========================================================================
    // 4A. SAP (2.40s - 3.00s)
    if (t >= 2.40 && t < 3.00) {
      if (anchorSap) { anchorSap.setAttribute('fill', '#f59e0b'); anchorSap.setAttribute('r', '3.5'); }
      if (txtSap) { txtSap.setAttribute('fill', '#fef08a'); }
      setSolidCurrent(sap_glow, sap_line, sap_surge, t, 240, 1.0);
    } else if (t >= 3.00 && t < 4.20) {
      if (anchorSap) { anchorSap.setAttribute('fill', '#64748b'); anchorSap.setAttribute('r', '2.4'); }
      if (txtSap) { txtSap.setAttribute('fill', '#f1f5f9'); }
      setSolidCurrent(sap_glow, sap_line, sap_surge, t, 160, 0.45);
    } else if (t >= 4.20 && t < 8.60) {
      if (anchorSap) { anchorSap.setAttribute('fill', '#64748b'); anchorSap.setAttribute('r', '2.4'); }
      if (txtSap) { txtSap.setAttribute('fill', '#94a3b8'); }
      setSolidCurrent(sap_glow, sap_line, sap_surge, t, 120, 0.20);
    } else if (t >= 8.60) {
      if (anchorSap) { anchorSap.setAttribute('fill', '#64748b'); anchorSap.setAttribute('r', '2.4'); }
      if (txtSap) { txtSap.setAttribute('fill', '#f1f5f9'); }
      setSolidCurrent(sap_glow, sap_line, sap_surge, t, 140, 0.70);
    } else {
      if (anchorSap) { anchorSap.setAttribute('fill', '#64748b'); anchorSap.setAttribute('r', '2.4'); }
      if (txtSap) { txtSap.setAttribute('fill', '#94a3b8'); }
      setSolidCurrent(sap_glow, sap_line, sap_surge, t, 160, 0);
    }

    // 4B. Service Branch (3.00s - 3.60s)
    if (t >= 3.00 && t < 3.60) {
      if (anchorBranch) { anchorBranch.setAttribute('fill', '#f59e0b'); anchorBranch.setAttribute('r', '3.5'); }
      if (txtBranch) { txtBranch.setAttribute('fill', '#fef08a'); }
      setSolidCurrent(branch_glow, branch_line, branch_surge, t, 240, 1.0);
    } else if (t >= 3.60 && t < 4.20) {
      if (anchorBranch) { anchorBranch.setAttribute('fill', '#64748b'); anchorBranch.setAttribute('r', '2.4'); }
      if (txtBranch) { txtBranch.setAttribute('fill', '#f1f5f9'); }
      setSolidCurrent(branch_glow, branch_line, branch_surge, t, 160, 0.45);
    } else if (t >= 4.20 && t < 8.60) {
      if (anchorBranch) { anchorBranch.setAttribute('fill', '#64748b'); anchorBranch.setAttribute('r', '2.4'); }
      if (txtBranch) { txtBranch.setAttribute('fill', '#94a3b8'); }
      setSolidCurrent(branch_glow, branch_line, branch_surge, t, 120, 0.20);
    } else if (t >= 8.60) {
      if (anchorBranch) { anchorBranch.setAttribute('fill', '#64748b'); anchorBranch.setAttribute('r', '2.4'); }
      if (txtBranch) { txtBranch.setAttribute('fill', '#f1f5f9'); }
      setSolidCurrent(branch_glow, branch_line, branch_surge, t, 140, 0.70);
    } else {
      if (anchorBranch) { anchorBranch.setAttribute('fill', '#64748b'); anchorBranch.setAttribute('r', '2.4'); }
      if (txtBranch) { txtBranch.setAttribute('fill', '#94a3b8'); }
      setSolidCurrent(branch_glow, branch_line, branch_surge, t, 160, 0);
    }

    // 4C. Customer Contracts (3.60s - 4.20s)
    if (t >= 3.60 && t < 4.20) {
      if (anchorContracts) { anchorContracts.setAttribute('fill', '#f59e0b'); anchorContracts.setAttribute('r', '3.5'); }
      if (txtContracts) { txtContracts.setAttribute('fill', '#fef08a'); }
      setSolidCurrent(cont_glow, cont_line, cont_surge, t, 240, 1.0);
    } else if (t >= 4.20 && t < 8.60) {
      if (anchorContracts) { anchorContracts.setAttribute('fill', '#64748b'); anchorContracts.setAttribute('r', '2.4'); }
      if (txtContracts) { txtContracts.setAttribute('fill', '#94a3b8'); }
      setSolidCurrent(cont_glow, cont_line, cont_surge, t, 120, 0.20);
    } else if (t >= 8.60) {
      if (anchorContracts) { anchorContracts.setAttribute('fill', '#64748b'); anchorContracts.setAttribute('r', '2.4'); }
      if (txtContracts) { txtContracts.setAttribute('fill', '#f1f5f9'); }
      setSolidCurrent(cont_glow, cont_line, cont_surge, t, 140, 0.70);
    } else {
      if (anchorContracts) { anchorContracts.setAttribute('fill', '#64748b'); anchorContracts.setAttribute('r', '2.4'); }
      if (txtContracts) { txtContracts.setAttribute('fill', '#94a3b8'); }
      setSolidCurrent(cont_glow, cont_line, cont_surge, t, 160, 0);
    }

    // =========================================================================
    // STAGE 5: COORDINATION SOLID BILATERAL CONNECTIONS (4.2s - 5.4s)
    // =========================================================================
    // 5A. Accounting (4.20s - 4.80s)
    if (t >= 4.20 && t < 4.80) {
      if (anchorAcc) { anchorAcc.setAttribute('fill', '#f59e0b'); anchorAcc.setAttribute('r', '3.5'); }
      if (txtAcc) { txtAcc.setAttribute('fill', '#fef08a'); }
      setSolidCurrent(acc_glow, acc_line, acc_surge, t, 250, 1.0);
    } else if (t >= 4.80 && t < 8.60) {
      if (anchorAcc) { anchorAcc.setAttribute('fill', '#64748b'); anchorAcc.setAttribute('r', '2.4'); }
      if (txtAcc) { txtAcc.setAttribute('fill', '#94a3b8'); }
      setSolidCurrent(acc_glow, acc_line, acc_surge, t, 110, 0.20);
    } else if (t >= 8.60) {
      if (anchorAcc) { anchorAcc.setAttribute('fill', '#64748b'); anchorAcc.setAttribute('r', '2.4'); }
      if (txtAcc) { txtAcc.setAttribute('fill', '#f1f5f9'); }
      setSolidCurrent(acc_glow, acc_line, acc_surge, t, 130, 0.65);
    } else {
      if (anchorAcc) { anchorAcc.setAttribute('fill', '#64748b'); anchorAcc.setAttribute('r', '2.4'); }
      if (txtAcc) { txtAcc.setAttribute('fill', '#94a3b8'); }
      setSolidCurrent(acc_glow, acc_line, acc_surge, t, 130, 0);
    }

    // 5B. Parts (4.80s - 5.40s)
    if (t >= 4.80 && t < 5.40) {
      if (anchorParts) { anchorParts.setAttribute('fill', '#f59e0b'); anchorParts.setAttribute('r', '3.5'); }
      if (txtParts) { txtParts.setAttribute('fill', '#fef08a'); }
      setSolidCurrent(parts_glow, parts_line, parts_surge, t, 250, 1.0);
    } else if (t >= 5.40 && t < 8.60) {
      if (anchorParts) { anchorParts.setAttribute('fill', '#64748b'); anchorParts.setAttribute('r', '2.4'); }
      if (txtParts) { txtParts.setAttribute('fill', '#94a3b8'); }
      setSolidCurrent(parts_glow, parts_line, parts_surge, t, 110, 0.20);
    } else if (t >= 8.60) {
      if (anchorParts) { anchorParts.setAttribute('fill', '#64748b'); anchorParts.setAttribute('r', '2.4'); }
      if (txtParts) { txtParts.setAttribute('fill', '#f1f5f9'); }
      setSolidCurrent(parts_glow, parts_line, parts_surge, t, 130, 0.65);
    } else {
      if (anchorParts) { anchorParts.setAttribute('fill', '#64748b'); anchorParts.setAttribute('r', '2.4'); }
      if (txtParts) { txtParts.setAttribute('fill', '#94a3b8'); }
      setSolidCurrent(parts_glow, parts_line, parts_surge, t, 130, 0);
    }

    // =========================================================================
    // STAGE 6: ANALYTICAL TOOLS GROUPED ENTRANCE (5.4s - 6.6s)
    // =========================================================================
    const isToolsLit = t >= 5.45 && t < 6.10;
    const toolStroke = isToolsLit ? '#f59e0b' : '#334155';
    const toolStrokeWidth = isToolsLit ? '1.8' : '1.2';
    const toolTextFill = isToolsLit ? '#fef08a' : '#f1f5f9';

    if (toolExcel) {
      toolExcel.setAttribute('stroke', toolStroke);
      toolExcel.setAttribute('stroke-width', toolStrokeWidth);
      if (txtExcel) txtExcel.setAttribute('fill', toolTextFill);
    }
    if (toolSheets) {
      toolSheets.setAttribute('stroke', toolStroke);
      toolSheets.setAttribute('stroke-width', toolStrokeWidth);
      if (txtSheets) txtSheets.setAttribute('fill', toolTextFill);
    }
    if (toolAppscript) {
      toolAppscript.setAttribute('stroke', toolStroke);
      toolAppscript.setAttribute('stroke-width', toolStrokeWidth);
      if (txtAppscript) txtAppscript.setAttribute('fill', toolTextFill);
    }
    if (toolLooker) {
      toolLooker.setAttribute('stroke', toolStroke);
      toolLooker.setAttribute('stroke-width', toolStrokeWidth);
      if (txtLooker) txtLooker.setAttribute('fill', toolTextFill);
    }

    // =========================================================================
    // STAGE 7: OPERATIONAL OUTPUTS SOLID OUTFLOW LINES (6.6s - 8.6s)
    // =========================================================================
    // 7A. Profitability Reporting (6.60s - 7.10s)
    if (t >= 6.60 && t < 7.10) {
      if (anchorProf) { anchorProf.setAttribute('fill', '#f59e0b'); anchorProf.setAttribute('r', '3.5'); }
      if (txtProf) { txtProf.setAttribute('fill', '#fef08a'); }
      setSolidCurrent(prof_glow, prof_line, prof_surge, t, 240, 1.0);
    } else if (t >= 7.10 && t < 8.60) {
      if (anchorProf) { anchorProf.setAttribute('fill', '#64748b'); anchorProf.setAttribute('r', '2.4'); }
      if (txtProf) { txtProf.setAttribute('fill', '#f1f5f9'); }
      setSolidCurrent(prof_glow, prof_line, prof_surge, t, 160, 0.45);
    } else if (t >= 8.60) {
      if (anchorProf) { anchorProf.setAttribute('fill', '#64748b'); anchorProf.setAttribute('r', '2.4'); }
      if (txtProf) { txtProf.setAttribute('fill', '#f1f5f9'); }
      setSolidCurrent(prof_glow, prof_line, prof_surge, t, 140, 0.70);
    } else {
      if (anchorProf) { anchorProf.setAttribute('fill', '#64748b'); anchorProf.setAttribute('r', '2.4'); }
      if (txtProf) { txtProf.setAttribute('fill', '#94a3b8'); }
      setSolidCurrent(prof_glow, prof_line, prof_surge, t, 160, 0);
    }

    // 7B. Procurement & Consumable Control (7.10s - 7.60s)
    if (t >= 7.10 && t < 7.60) {
      if (anchorProc) { anchorProc.setAttribute('fill', '#f59e0b'); anchorProc.setAttribute('r', '3.5'); }
      if (txtProc) { txtProc.setAttribute('fill', '#fef08a'); }
      setSolidCurrent(proc_glow, proc_line, proc_surge, t, 240, 1.0);
    } else if (t >= 7.60 && t < 8.60) {
      if (anchorProc) { anchorProc.setAttribute('fill', '#64748b'); anchorProc.setAttribute('r', '2.4'); }
      if (txtProc) { txtProc.setAttribute('fill', '#f1f5f9'); }
      setSolidCurrent(proc_glow, proc_line, proc_surge, t, 160, 0.45);
    } else if (t >= 8.60) {
      if (anchorProc) { anchorProc.setAttribute('fill', '#64748b'); anchorProc.setAttribute('r', '2.4'); }
      if (txtProc) { txtProc.setAttribute('fill', '#f1f5f9'); }
      setSolidCurrent(proc_glow, proc_line, proc_surge, t, 140, 0.70);
    } else {
      if (anchorProc) { anchorProc.setAttribute('fill', '#64748b'); anchorProc.setAttribute('r', '2.4'); }
      if (txtProc) { txtProc.setAttribute('fill', '#94a3b8'); }
      setSolidCurrent(proc_glow, proc_line, proc_surge, t, 160, 0);
    }

    // 7C. Contract Reporting & Forecasting (7.60s - 8.10s)
    if (t >= 7.60 && t < 8.10) {
      if (anchorCont) { anchorCont.setAttribute('fill', '#f59e0b'); anchorCont.setAttribute('r', '3.5'); }
      if (txtCont) { txtCont.setAttribute('fill', '#fef08a'); }
      setSolidCurrent(ocont_glow, ocont_line, ocont_surge, t, 240, 1.0);
    } else if (t >= 8.10 && t < 8.60) {
      if (anchorCont) { anchorCont.setAttribute('fill', '#64748b'); anchorCont.setAttribute('r', '2.4'); }
      if (txtCont) { txtCont.setAttribute('fill', '#f1f5f9'); }
      setSolidCurrent(ocont_glow, ocont_line, ocont_surge, t, 160, 0.45);
    } else if (t >= 8.60) {
      if (anchorCont) { anchorCont.setAttribute('fill', '#64748b'); anchorCont.setAttribute('r', '2.4'); }
      if (txtCont) { txtCont.setAttribute('fill', '#f1f5f9'); }
      setSolidCurrent(ocont_glow, ocont_line, ocont_surge, t, 140, 0.70);
    } else {
      if (anchorCont) { anchorCont.setAttribute('fill', '#64748b'); anchorCont.setAttribute('r', '2.4'); }
      if (txtCont) { txtCont.setAttribute('fill', '#94a3b8'); }
      setSolidCurrent(ocont_glow, ocont_line, ocont_surge, t, 160, 0);
    }

    // 7D. Cost-Based Pricing (8.10s - 8.60s)
    if (t >= 8.10 && t < 8.60) {
      if (anchorPric) { anchorPric.setAttribute('fill', '#f59e0b'); anchorPric.setAttribute('r', '3.5'); }
      if (txtPric) { txtPric.setAttribute('fill', '#fef08a'); }
      setSolidCurrent(pric_glow, pric_line, pric_surge, t, 240, 1.0);
    } else if (t >= 8.60) {
      if (anchorPric) { anchorPric.setAttribute('fill', '#64748b'); anchorPric.setAttribute('r', '2.4'); }
      if (txtPric) { txtPric.setAttribute('fill', '#f1f5f9'); }
      setSolidCurrent(pric_glow, pric_line, pric_surge, t, 140, 0.70);
    } else {
      if (anchorPric) { anchorPric.setAttribute('fill', '#64748b'); anchorPric.setAttribute('r', '2.4'); }
      if (txtPric) { txtPric.setAttribute('fill', '#94a3b8'); }
      setSolidCurrent(pric_glow, pric_line, pric_surge, t, 160, 0);
    }

    // =========================================================================
    // STAGE 8 & 9: PULLBACK & S1 EQUILIBRIUM (8.6s - 11.0s)
    // =========================================================================
    if (t >= 8.9 && t <= 10.2) {
      if (pulseSysWave) {
        pulseSysWave.setAttribute('opacity', '1');
        const waveProgress = (t - 8.9) / 1.3;
        pulseSysWave.setAttribute('r', lerp(10, 560, waveProgress));
        pulseSysWave.setAttribute('opacity', Math.max(0, 0.75 * (1 - waveProgress)).toFixed(2));
      }
    } else if (t >= 15.0 && t <= 16.4) {
      // Expanded System Resonance Wave
      if (pulseSysWave) {
        pulseSysWave.setAttribute('opacity', '1');
        const waveProgress = (t - 15.0) / 1.4;
        pulseSysWave.setAttribute('r', lerp(10, 680, waveProgress));
        pulseSysWave.setAttribute('opacity', Math.max(0, 0.85 * (1 - waveProgress)).toFixed(2));
      }
    } else {
      if (pulseSysWave) pulseSysWave.setAttribute('opacity', '0');
    }

    // =========================================================================
    // STAGE 10 & 11: HUB INSPECTION & KINETIC TYPOGRAPHY RESOLVE (11.0s - 13.6s)
    // =========================================================================
    if (t < 12.0) {
      // Pre-upgrade: Cost Control in crisp focus
      if (roleHub) {
        roleHub.style.opacity = '1';
        roleHub.setAttribute('transform', 'translate(640, 295) scale(1)');
      }
      if (upgradedHub) upgradedHub.style.opacity = '0';
      if (upgradeScanline) upgradeScanline.style.opacity = '0';
    } else if (t < 12.35) {
      // Phase 1 (12.0s - 12.35s): Cost Control dissolves with horizontal scanline expansion
      const u1 = (t - 12.0) / 0.35;
      const scaleVal = lerp(1, 1.05, u1);
      if (roleHub) {
        roleHub.style.opacity = Math.max(0, 1 - u1).toFixed(3);
        roleHub.setAttribute('transform', 'translate(640, 295) scale(' + scaleVal.toFixed(3) + ')');
      }
      if (upgradedHub) upgradedHub.style.opacity = '0';
      if (upgradeScanline) {
        const scanW = lerp(10, 120, u1);
        upgradeScanline.style.opacity = Math.min(1, u1 * 2.5).toFixed(3);
        if (scanlineBeam) {
          scanlineBeam.setAttribute('x1', (-scanW).toFixed(1));
          scanlineBeam.setAttribute('x2', scanW.toFixed(1));
        }
        if (scanlineCore) {
          scanlineCore.setAttribute('x1', (-scanW * 0.7).toFixed(1));
          scanlineCore.setAttribute('x2', (scanW * 0.7).toFixed(1));
        }
        if (scanlinePipL) scanlinePipL.setAttribute('cx', (-scanW).toFixed(1));
        if (scanlinePipR) scanlinePipR.setAttribute('cx', scanW.toFixed(1));
      }
    } else if (t < 12.9) {
      // Phase 2 (12.35s - 12.9s): Kinetic Resolve: Cost Control is 100% GONE
      if (roleHub) roleHub.style.opacity = '0';
      const u2 = (t - 12.35) / 0.55;
      const easeOut = 1 - Math.pow(1 - u2, 3);
      if (upgradedHub) {
        upgradedHub.style.opacity = Math.min(1, u2 * 1.8).toFixed(3);
      }
      if (txtUpgraded1) {
        const y1 = lerp(-12, -2, easeOut);
        txtUpgraded1.setAttribute('y', y1.toFixed(1));
      }
      if (txtUpgraded2) {
        const y2 = lerp(24, 14, easeOut);
        txtUpgraded2.setAttribute('y', y2.toFixed(1));
      }
      if (upgradeScanline) {
        const scanW = lerp(120, 150, easeOut);
        upgradeScanline.style.opacity = Math.max(0, 0.9 * (1 - u2)).toFixed(3);
        if (scanlineBeam) {
          scanlineBeam.setAttribute('x1', (-scanW).toFixed(1));
          scanlineBeam.setAttribute('x2', scanW.toFixed(1));
        }
        if (scanlineCore) {
          scanlineCore.setAttribute('x1', (-scanW * 0.7).toFixed(1));
          scanlineCore.setAttribute('x2', (scanW * 0.7).toFixed(1));
        }
        if (scanlinePipL) scanlinePipL.setAttribute('cx', (-scanW).toFixed(1));
        if (scanlinePipR) scanlinePipR.setAttribute('cx', scanW.toFixed(1));
      }
    } else {
      // Post-upgrade settled state: Clean, crisp white typography, zero scanline, zero Cost Control
      if (roleHub) roleHub.style.opacity = '0';
      if (upgradedHub) upgradedHub.style.opacity = '1';
      if (txtUpgraded1) txtUpgraded1.setAttribute('y', '-2');
      if (txtUpgraded2) txtUpgraded2.setAttribute('y', '14');
      if (upgradeScanline) upgradeScanline.style.opacity = '0';
    }

    // =========================================================================
    // STAGE 12 & 13: EXPANDED NETWORK FULLY PRESENT (13.6s - 17.0s)
    // =========================================================================
    if (t < 13.6) {
      if (cardVendor) cardVendor.style.opacity = '0';
      if (cardMarketing) cardMarketing.style.opacity = '0';
      setSolidCurrent(vendor_glow, null, vendor_surge, t, 160, 0);
      setSolidCurrent(mkt_glow, null, mkt_surge, t, 160, 0);
    } else {
      // Immediate full presence: Vendor and Sales / Marketing active
      if (cardVendor) cardVendor.style.opacity = '1';
      if (anchorVendor) { anchorVendor.setAttribute('fill', '#64748b'); anchorVendor.setAttribute('r', '2.4'); }
      if (txtVendor) { txtVendor.setAttribute('fill', '#f1f5f9'); }
      setSolidCurrent(vendor_glow, null, vendor_surge, t, 130, 0.65);

      if (cardMarketing) cardMarketing.style.opacity = '1';
      if (anchorMarketing) { anchorMarketing.setAttribute('fill', '#64748b'); anchorMarketing.setAttribute('r', '2.4'); }
      if (txtMarketing) { txtMarketing.setAttribute('fill', '#f1f5f9'); }
      setSolidCurrent(mkt_glow, null, mkt_surge, t, 130, 0.65);
    }

    // Output-Reel Deliverable Labels
    if (t < 12.0) {
      // Scene 01 base names
      if (reelTxt0) reelTxt0.textContent = 'Profitability Reporting';
      if (reelTxt1) reelTxt1.textContent = 'Procurement & Consumables';
      if (reelTxt2) reelTxt2.textContent = 'Contract Reporting & Forecasting';
      if (reelTxt3) reelTxt3.textContent = 'Cost-Based Pricing';
      if (reelIndicator) reelIndicator.textContent = 'BASE · 04 DELIVERABLES';
      if (outputReelItems) outputReelItems.setAttribute('transform', 'translate(0, 0)');
    } else {
      // Scene 02 expanded deliverables
      if (reelTxt0) reelTxt0.textContent = 'Service Profitability Analysis';
      if (reelTxt1) reelTxt1.textContent = 'Business Performance Reporting';
      if (reelTxt2) reelTxt2.textContent = 'Vendor Cost Control';
      if (reelTxt3) reelTxt3.textContent = 'Pricing & Margin Control';
      if (reelTxt4) reelTxt4.textContent = 'Procurement & Consumables';
      if (reelTxt5) reelTxt5.textContent = 'Contract Reporting & Forecasting';
      updateManualReel(manualReelIndex);
    }

    // Slot anchors and conduit currents in expanded mode (t >= 13.6s)
    if (t >= 13.6) {
      setSolidCurrent(prof_glow, null, prof_surge, t, 140, 0.70);
      setSolidCurrent(proc_glow, null, proc_surge, t, 140, 0.70);
      setSolidCurrent(ocont_glow, null, ocont_surge, t, 140, 0.70);
      setSolidCurrent(pric_glow, null, pric_surge, t, 140, 0.70);

      if (anchorSlot0) { anchorSlot0.setAttribute('fill', '#64748b'); anchorSlot0.setAttribute('r', '2.4'); }
      if (anchorSlot1) { anchorSlot1.setAttribute('fill', '#64748b'); anchorSlot1.setAttribute('r', '2.4'); }
      if (anchorSlot2) { anchorSlot2.setAttribute('fill', '#64748b'); anchorSlot2.setAttribute('r', '2.4'); }
      if (anchorSlot3) { anchorSlot3.setAttribute('fill', '#64748b'); anchorSlot3.setAttribute('r', '2.4'); }
    }
  }

  // Animation Loop
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
    if (currentTime >= TOTAL_DURATION) currentTime = 0.0;
    isPlaying = true;
    lastTimestamp = null;
    animReq = requestAnimationFrame(animLoop);
  }

  function pause() {
    isPlaying = false;
    if (animReq) {
      cancelAnimationFrame(animReq);
      animReq = null;
    }
  }

  function togglePlay() {
    if (isPlaying) pause();
    else play();
  }

  function resetNarrative() {
    pause();
    currentTime = 0.0;
    manualReelIndex = 0;
    updateAtTime(currentTime);
  }

  function jumpToStage(targetTime) {
    pause();
    currentTime = targetTime;
    updateAtTime(currentTime);
  }

  function setTime(targetTime) {
    pause();
    currentTime = Math.max(0, Math.min(TOTAL_DURATION, targetTime));
    updateAtTime(currentTime);
  }

  // IntersectionObserver for Automatic Playback on Scroll
  function initViewportObserver() {
    if (!ch03Section || !('IntersectionObserver' in window)) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const globalStatusText = document.querySelector('.portfolio-header__status-text');
          if (globalStatusText) {
            globalStatusText.textContent = '03.01 // TECHNICAL ASSEMBLY';
          }
          if (prefersReducedMotion) {
            jumpToStage(15.5);
            return;
          }
          if (!hasAutoPlayed) {
            hasAutoPlayed = true;
            resetNarrative();
            play();
          } else if (!isPlaying && currentTime < TOTAL_DURATION) {
            play();
          }
        } else {
          if (isPlaying) {
            pause();
          }
        }
      });
    }, {
      threshold: 0.25
    });

    observer.observe(ch03Section);
  }

  function init() {
    queryElements();
    initReelListeners();

    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        resetNarrative();
        play();
      });
    }

    // Default to settled state upfront so page isn't blank before scrolling/intersection
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      currentTime = 15.5;
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

  // Expose controller for verification, automated testing & external hooks
  window.Chapter03Controller = {
    play,
    pause,
    togglePlay,
    resetNarrative,
    jumpToStage,
    setTime,
    updateAtTime,
    updateManualReel,
    getState: () => ({
      currentTime,
      isPlaying,
      manualReelIndex,
      TOTAL_DURATION
    })
  };
})();
