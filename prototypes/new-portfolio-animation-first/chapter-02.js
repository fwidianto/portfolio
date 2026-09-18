/* ==========================================================================
   CHAPTER 02: UNIFIED FIXED-STAGE ORCHESTRATOR & SCENE CONTROLLER
   Sequential Multi-Scene Journey:
     Scene 01: Universitas Indonesia Entry (8.5s)
     Scene 02: College Foundations Constellation (17.5s)
     Scene 03: Astra Agro Lestari Palm Oil Mill (34.0s)
     Scene 04: Tokyo Commute & Return to Jakarta (40.0s)
     Scene 05: Undergraduate Thesis Apparatus (25.0s)
   Total Cumulative Runtime: 125.0s
   ========================================================================== */

(function () {
  'use strict';

  // Scene Definitions & Manifest
  const SCENE_DEFS = [
    { id: 'scene-01', globalVar: 'Ch02Scene01', name: '01 // UI ENTRY', shortName: '01 UI', duration: 8.5 },
    { id: 'scene-02', globalVar: 'Ch02Scene02', name: '02 // FOUNDATIONS', shortName: '02 Found', duration: 17.5 },
    { id: 'scene-03', globalVar: 'Ch02Scene03', name: '03 // ASTRA MILL', shortName: '03 Astra', duration: 34.0 },
    { id: 'scene-04', globalVar: 'Ch02Scene04', name: '04 // TOKYO JOURNEY', shortName: '04 Tokyo', duration: 40.0 },
    { id: 'scene-05', globalVar: 'Ch02Scene05', name: '05 // THESIS RIG', shortName: '05 Thesis', duration: 25.0 }
  ];

  const TOTAL_DURATION = SCENE_DEFS.reduce((sum, s) => sum + s.duration, 0); // 125.0s

  // Compute cumulative start offsets
  const CUMULATIVE_OFFSETS = [];
  let accum = 0;
  SCENE_DEFS.forEach(s => {
    CUMULATIVE_OFFSETS.push(accum);
    accum += s.duration;
  });

  // Orchestrator State
  let currentSceneIndex = 0;
  let isPlaying = true;
  let isTransitioning = false;
  let hasTriggeredEntry = false;
  let hudRafId = null;

  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isReducedMotion = reduceMotionQuery.matches;

  // DOM Elements
  const stageEl = document.getElementById('ch02-stage');
  const layers = Array.from(document.querySelectorAll('.ch02-scene-layer'));
  const chips = Array.from(document.querySelectorAll('.ch02-chip'));

  const btnPlayPause = document.getElementById('ch02-btn-play-pause');
  const iconPlay = document.getElementById('ch02-icon-play');
  const iconPause = document.getElementById('ch02-icon-pause');
  const btnReplay = document.getElementById('ch02-btn-replay');
  const btnPrev = document.getElementById('ch02-btn-prev');
  const btnNext = document.getElementById('ch02-btn-next');

  const timecodeDisplay = document.getElementById('ch02-timecode');
  const progressFill = document.getElementById('ch02-progress-fill');
  const progressPercent = document.getElementById('ch02-progress-percent');
  const chapterStatusText = document.getElementById('ch02-status-title');

  function getSceneAdapter(index) {
    const def = SCENE_DEFS[index];
    if (!def) return null;
    return window[def.globalVar] || null;
  }

  // Update HUD UI Elements
  function updatePlaybackUI() {
    if (iconPlay && iconPause) {
      if (isPlaying) {
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
        if (btnPlayPause) btnPlayPause.setAttribute('aria-label', 'Pause Chapter Playback');
      } else {
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
        if (btnPlayPause) btnPlayPause.setAttribute('aria-label', 'Play Chapter Playback');
      }
    }

    if (btnPrev) {
      btnPrev.disabled = (currentSceneIndex === 0);
    }
    if (btnNext) {
      btnNext.disabled = (currentSceneIndex === SCENE_DEFS.length - 1);
    }

    chips.forEach((chip, i) => {
      if (i === currentSceneIndex) {
        chip.classList.add('is-active');
        chip.setAttribute('aria-selected', 'true');
      } else {
        chip.classList.remove('is-active');
        chip.setAttribute('aria-selected', 'false');
      }
    });

    if (chapterStatusText) {
      chapterStatusText.textContent = SCENE_DEFS[currentSceneIndex].name;
    }
    const globalStatusText = document.querySelector('.portfolio-header__status-text');
    if (globalStatusText) {
      const cleanName = SCENE_DEFS[currentSceneIndex].name.replace(/^0\d\s*\/\/\s*/, '');
      globalStatusText.textContent = `02.${String(currentSceneIndex + 1).padStart(2, '0')} // ${cleanName}`;
    }
  }

  // Stage Viewport Scale Fitting (Preserves frozen scene composition and aspect ratio below controls)
  function updateStageFit() {
    if (!stageEl) return;
    const availableW = stageEl.clientWidth;
    const availableH = stageEl.clientHeight;
    const isMobile = availableW < 640;

    // Scene 02 base: desktop 1240x860, mobile 360x1180
    const s2BaseW = isMobile ? 360 : 1240;
    const s2BaseH = isMobile ? 1180 : 860;
    const s2Scale = Math.min(availableW / s2BaseW, availableH / s2BaseH, 1.0);

    // Scene 03 base: desktop 1240x940, mobile 360x1480
    const s3BaseW = isMobile ? 360 : 1240;
    const s3BaseH = isMobile ? 1480 : 940;
    const s3Scale = Math.min(availableW / s3BaseW, availableH / s3BaseH, 1.0);

    stageEl.style.setProperty('--s2-scale', s2Scale.toFixed(4));
    stageEl.style.setProperty('--s3-scale', s3Scale.toFixed(4));
  }

  // Smooth Crossfade Scene Switching
  function goToScene(targetIndex, autoPlay = true) {
    if (targetIndex < 0 || targetIndex >= SCENE_DEFS.length) return;
    updateStageFit();

    // If already on target scene
    if (targetIndex === currentSceneIndex && !isTransitioning) {
      const activeAdapter = getSceneAdapter(targetIndex);
      if (activeAdapter) {
        activeAdapter.replay();
        isPlaying = true;
        updatePlaybackUI();
      }
      return;
    }

    isTransitioning = true;
    const oldIndex = currentSceneIndex;
    const oldAdapter = getSceneAdapter(oldIndex);
    const newAdapter = getSceneAdapter(targetIndex);

    // Layer crossfade
    layers.forEach((layer, i) => {
      if (i === targetIndex) {
        layer.classList.add('is-active');
      } else {
        layer.classList.remove('is-active');
      }
    });

    currentSceneIndex = targetIndex;
    updatePlaybackUI();

    // Start new scene
    if (newAdapter) {
      if (typeof newAdapter.resize === 'function') newAdapter.resize();
      if (autoPlay && !isReducedMotion) {
        newAdapter.replay();
        isPlaying = true;
      } else {
        newAdapter.pause();
        isPlaying = false;
      }
    }

    // Stop previous scene after crossfade
    setTimeout(() => {
      if (oldAdapter && oldIndex !== currentSceneIndex) {
        oldAdapter.stop();
      }
      isTransitioning = false;
    }, 600);
  }

  // Play / Pause Toggle
  function togglePlayPause() {
    const adapter = getSceneAdapter(currentSceneIndex);
    if (!adapter) return;

    if (isPlaying) {
      isPlaying = false;
      adapter.pause();
    } else {
      isPlaying = true;
      adapter.play();
    }
    updatePlaybackUI();
  }

  // Replay Current Scene
  function replayCurrentScene() {
    const adapter = getSceneAdapter(currentSceneIndex);
    if (!adapter) return;
    adapter.replay();
    isPlaying = true;
    updatePlaybackUI();
  }

  // Continuous Progress HUD Loop
  function updateProgressTick() {
    const adapter = getSceneAdapter(currentSceneIndex);
    if (adapter) {
      const sceneTime = adapter.getCurrentTime ? adapter.getCurrentTime() : 0;
      const sceneDuration = SCENE_DEFS[currentSceneIndex].duration;

      if (timecodeDisplay) {
        timecodeDisplay.textContent = `${sceneTime.toFixed(1)}s / ${sceneDuration.toFixed(1)}s`;
      }

      const cumulativeTime = CUMULATIVE_OFFSETS[currentSceneIndex] + sceneTime;
      const percent = Math.min(100, Math.max(0, (cumulativeTime / TOTAL_DURATION) * 100));

      if (progressFill) {
        progressFill.style.width = `${percent.toFixed(1)}%`;
      }
      if (progressPercent) {
        progressPercent.textContent = `${percent.toFixed(0)}%`;
      }
    }

    hudRafId = requestAnimationFrame(updateProgressTick);
  }

  // Attach completion callbacks for auto-advancement
  function wireSceneCompletions() {
    SCENE_DEFS.forEach((def, index) => {
      const adapter = getSceneAdapter(index);
      if (adapter) {
        adapter.onComplete = function () {
          if (isPlaying && currentSceneIndex === index) {
            if (index < SCENE_DEFS.length - 1) {
              goToScene(index + 1, true);
            } else {
              // Final scene completed, remain settled
              isPlaying = false;
              updatePlaybackUI();
            }
          }
        };
      }
    });
  }

  // Setup Event Listeners
  function initEvents() {
    // Navigation Chips
    chips.forEach((chip, i) => {
      chip.addEventListener('click', () => {
        goToScene(i, true);
      });
    });

    // Control Buttons
    if (btnPlayPause) btnPlayPause.addEventListener('click', togglePlayPause);
    if (btnReplay) btnReplay.addEventListener('click', replayCurrentScene);
    if (btnPrev) btnPrev.addEventListener('click', () => goToScene(currentSceneIndex - 1, true));
    if (btnNext) btnNext.addEventListener('click', () => goToScene(currentSceneIndex + 1, true));

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'KeyR' && !e.shiftKey) {
        e.preventDefault();
        replayCurrentScene();
      } else if (e.code === 'ArrowLeft') {
        if (currentSceneIndex > 0) {
          e.preventDefault();
          goToScene(currentSceneIndex - 1, true);
        }
      } else if (e.code === 'ArrowRight') {
        if (currentSceneIndex < SCENE_DEFS.length - 1) {
          e.preventDefault();
          goToScene(currentSceneIndex + 1, true);
        }
      } else if (e.code === 'Digit1') {
        goToScene(0, true);
      } else if (e.code === 'Digit2') {
        goToScene(1, true);
      } else if (e.code === 'Digit3') {
        goToScene(2, true);
      } else if (e.code === 'Digit4') {
        goToScene(3, true);
      } else if (e.code === 'Digit5') {
        goToScene(4, true);
      }
    });

    // Window Resize
    window.addEventListener('resize', () => {
      updateStageFit();
      const adapter = getSceneAdapter(currentSceneIndex);
      if (adapter && typeof adapter.resize === 'function') {
        adapter.resize();
      }
    }, { passive: true });

    // Motion preference changes
    if (typeof reduceMotionQuery.addEventListener === 'function') {
      reduceMotionQuery.addEventListener('change', (e) => {
        isReducedMotion = e.matches;
      });
    }
  }

  // Viewport trigger when Chapter 02 enters view
  function setupViewportTrigger() {
    const chapterSection = document.getElementById('chapter-02');
    if (!chapterSection) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasTriggeredEntry) {
            hasTriggeredEntry = true;
            goToScene(0, !isReducedMotion);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(chapterSection);
    } else {
      goToScene(0, !isReducedMotion);
    }
  }

  // Bootstrap Orchestrator
  function init() {
    wireSceneCompletions();
    initEvents();
    updatePlaybackUI();

    // Immediately trigger initial scene so canvas and state are rendered right away
    currentSceneIndex = -1;
    goToScene(0, !isReducedMotion);

    // If loaded with #chapter-02 or if navigating to it, ensure alignment
    if (window.location.hash === '#chapter-02') {
      setTimeout(() => {
        const ch02 = document.getElementById('chapter-02');
        if (ch02) ch02.scrollIntoView({ behavior: 'auto' });
      }, 50);
    }

    setupViewportTrigger();

    if (!hudRafId) {
      hudRafId = requestAnimationFrame(updateProgressTick);
    }

    // Expose orchestrator globally for CDP and console inspection
    window.Chapter02Controller = {
      goToScene,
      togglePlayPause,
      replayCurrentScene,
      getCurrentSceneIndex: () => currentSceneIndex,
      isPlaying: () => isPlaying,
      getTotalDuration: () => TOTAL_DURATION,
      getSceneDefs: () => SCENE_DEFS
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 50);
  }
})();
