/* ==========================================================================
   PORTFOLIO MODERN LEFT NAVIGATION SYSTEM CONTROLLER
   Authority: Near-black glass, restrained amber accent, compact mono typography
   States: hidden -> rail -> expanded -> hidden
   ========================================================================== */

(function () {
  'use strict';

  const STATES = ['hidden', 'rail', 'expanded'];
  let currentStateIndex = 0; // Default: 'hidden'
  let isEducationExpanded = false;

  // Programmatic scroll lock (prevents scroll listener from lighting wrong logo during animated scroll)
  let isProgrammaticScroll = false;
  let scrollLockTimer = null;
  let scrollRafId = null;

  // DOM Elements
  let navEl = null;
  let edgeTriggerEl = null;
  let logoToggleBtn = null;
  let headerLogoLink = null;
  let cycleBtn = null;
  let educationToggleBtn = null;
  let educationItem = null;
  let educationLink = null;
  let mainLinks = [];
  let subLinks = [];

  function init() {
    navEl = document.getElementById('portfolio-left-nav');
    edgeTriggerEl = document.getElementById('left-nav-edge-trigger');
    logoToggleBtn = document.getElementById('left-nav-logo-toggle');
    headerLogoLink = document.querySelector('.portfolio-header__logo');
    cycleBtn = document.getElementById('left-nav-cycle-btn');
    educationToggleBtn = document.getElementById('left-nav-education-toggle');
    educationItem = document.querySelector('.portfolio-left-nav__item--expandable');
    educationLink = educationItem ? educationItem.querySelector('.portfolio-left-nav__link') : null;

    if (!navEl) return;

    // Add coexistence class to body
    document.body.classList.add('has-left-nav');

    // Read stored state if available, default to 'hidden'
    const savedState = sessionStorage.getItem('portfolio_nav_state');
    if (savedState && STATES.includes(savedState)) {
      currentStateIndex = STATES.indexOf(savedState);
    } else {
      currentStateIndex = 0; // Default to 'hidden'
    }
    applyState(STATES[currentStateIndex]);

    // Query Links
    mainLinks = Array.from(navEl.querySelectorAll('.portfolio-left-nav__link'));
    subLinks = Array.from(navEl.querySelectorAll('.portfolio-left-nav__sublink'));

    bindEvents();
    setupScrollSpy();
    hookChapter02SceneTracking();

    // Initial check on load
    updateActiveChapterFromScroll();
  }

  function applyState(state) {
    if (!navEl) return;
    navEl.setAttribute('data-nav-state', state);

    if (state === 'hidden') {
      document.body.classList.add('nav-is-hidden');
    } else {
      document.body.classList.remove('nav-is-hidden');
    }

    // Update cycle button accessible label and tooltip
    if (cycleBtn) {
      const titles = {
        rail: 'Expand rail',
        expanded: 'Hide navigation',
        hidden: 'Show rail'
      };
      cycleBtn.setAttribute('title', titles[state] || 'Toggle navigation');
      cycleBtn.setAttribute('aria-label', titles[state] || 'Toggle navigation');
    }

    sessionStorage.setItem('portfolio_nav_state', state);

    // If collapsing back to rail or hidden, collapse education submenu too
    if (state !== 'expanded' && isEducationExpanded) {
      setEducationExpanded(false);
    }
  }

  function cycleState() {
    currentStateIndex = (currentStateIndex + 1) % STATES.length;
    applyState(STATES[currentStateIndex]);
  }

  function setEducationExpanded(expanded) {
    isEducationExpanded = expanded;
    if (educationItem) {
      educationItem.classList.toggle('is-expanded', isEducationExpanded);
    }
    if (educationToggleBtn) {
      educationToggleBtn.setAttribute('aria-expanded', String(isEducationExpanded));
    }
  }

  function lockScrollTracking(chapterKey, duration = 850) {
    isProgrammaticScroll = true;
    setActiveChapter(chapterKey);
    clearTimeout(scrollLockTimer);
    scrollLockTimer = setTimeout(() => {
      isProgrammaticScroll = false;
      updateActiveChapterFromScroll();
    }, duration);
  }

  function setActiveChapter(chapterKey) {
    const items = navEl ? navEl.querySelectorAll('.portfolio-left-nav__item') : [];
    items.forEach(item => {
      const match = (item.getAttribute('data-chapter') === chapterKey);
      item.classList.toggle('is-active', match);
    });
  }

  function updateActiveChild(sceneIndex) {
    if (!subLinks || !subLinks.length) return;
    subLinks.forEach((sl, idx) => {
      const match = (idx === sceneIndex);
      sl.classList.toggle('is-child-active', match);
      sl.setAttribute('aria-current', match ? 'true' : 'false');
    });
  }

  function scrollToSection(targetId) {
    const el = document.getElementById(targetId);
    if (!el) {
      if (targetId === 'hero') window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    el.scrollIntoView({ behavior: 'smooth' });
  }

  function bindEvents() {
    // 1. Logo button in navigation rail: cycles state (rail -> expanded -> hidden)
    if (logoToggleBtn) {
      logoToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cycleState();
      });
    }

    // 2. Page Header Logo button (when navigation is hidden, clicking logo opens the rail)
    if (headerLogoLink) {
      headerLogoLink.addEventListener('click', (e) => {
        if (STATES[currentStateIndex] === 'hidden') {
          e.preventDefault();
          currentStateIndex = 1; // 'rail'
          applyState('rail');
        }
      });
    }

    // 3. Dedicated bottom cycle button
    if (cycleBtn) {
      cycleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cycleState();
      });
    }

    // 4. Discrete edge trigger button (when hidden)
    if (edgeTriggerEl) {
      edgeTriggerEl.addEventListener('click', (e) => {
        e.preventDefault();
        currentStateIndex = 1; // restore 'rail'
        applyState('rail');
      });
    }

    // 5. Main Chapter Links
    // Item 1: Home
    const homeItem = navEl ? navEl.querySelector('.portfolio-left-nav__item[data-chapter="chapter-01"] .portfolio-left-nav__link') : null;
    if (homeItem) {
      homeItem.addEventListener('click', (e) => {
        e.preventDefault();
        lockScrollTracking('chapter-01');
        scrollToSection('hero');
      });
    }

    // Item 2: Education Link & Chevron
    if (educationLink) {
      educationLink.addEventListener('click', (e) => {
        e.preventDefault();
        const state = STATES[currentStateIndex];
        lockScrollTracking('chapter-02');
        scrollToSection('chapter-02');

        if (state === 'expanded') {
          // If already expanded and already at chapter-02, toggle submenu
          const currentActive = navEl.querySelector('.portfolio-left-nav__item.is-active');
          const isAlreadyOnCh02 = currentActive && currentActive.getAttribute('data-chapter') === 'chapter-02';
          if (isAlreadyOnCh02 && isEducationExpanded) {
            setEducationExpanded(false);
          } else {
            setEducationExpanded(true);
          }
        }
      });
    }

    if (educationToggleBtn) {
      educationToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        setEducationExpanded(!isEducationExpanded);
      });
    }

    // Item 3: Experience
    const weItem = navEl ? navEl.querySelector('.portfolio-left-nav__item[data-chapter="chapter-03"] .portfolio-left-nav__link') : null;
    if (weItem) {
      weItem.addEventListener('click', (e) => {
        e.preventDefault();
        lockScrollTracking('chapter-03');
        scrollToSection('chapter-03');
      });
    }

    // 6. Child Scene Destinations (01 to 05)
    subLinks.forEach(sublink => {
      sublink.addEventListener('click', (e) => {
        e.preventDefault();
        const sceneIndex = parseInt(sublink.getAttribute('data-scene-index'), 10);
        if (!isNaN(sceneIndex)) {
          lockScrollTracking('chapter-02');
          updateActiveChild(sceneIndex);
          scrollToSection('chapter-02');

          // Trigger the specific scene in Chapter 02 orchestrator
          if (window.Chapter02Controller && typeof window.Chapter02Controller.goToScene === 'function') {
            window.Chapter02Controller.goToScene(sceneIndex, true);
          }
        }
      });
    });

    // 7. Click Outside on Mobile to collapse
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && STATES[currentStateIndex] === 'expanded') {
        if (!navEl.contains(e.target) && !edgeTriggerEl?.contains(e.target)) {
          currentStateIndex = 1; // collapse to rail
          applyState('rail');
        }
      }
    });

    // 8. Keyboard Shortcut: '[' or Alt+N to cycle nav states
    window.addEventListener('keydown', (e) => {
      if (e.key === '[' || (e.altKey && (e.key === 'n' || e.key === 'N'))) {
        e.preventDefault();
        cycleState();
      } else if (e.key === 'Escape' && STATES[currentStateIndex] === 'expanded') {
        currentStateIndex = 1; // collapse to rail
        applyState('rail');
      }
    });
  }

  // Precision Focal-Raycast Scroll Spy
  function setupScrollSpy() {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  function onScroll() {
    if (isProgrammaticScroll) return;
    if (scrollRafId) return;

    scrollRafId = requestAnimationFrame(() => {
      scrollRafId = null;
      updateActiveChapterFromScroll();
    });
  }

  function updateActiveChapterFromScroll() {
    if (isProgrammaticScroll) return;

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const vh = window.innerHeight || 800;
    const docHeight = document.documentElement.scrollHeight;

    // Edge case 1: Top of page is always Chapter 01
    if (scrollY < 120) {
      setActiveChapter('chapter-01');
      return;
    }

    // Edge case 2: Near bottom of page is always Chapter 03
    if (scrollY + vh >= docHeight - 80) {
      setActiveChapter('chapter-03');
      return;
    }

    const sections = [
      { id: 'hero', key: 'chapter-01' },
      { id: 'chapter-02', key: 'chapter-02' },
      { id: 'chapter-03', key: 'chapter-03' }
    ];

    // Primary focal anchor: 45% of viewport height
    const focalY = vh * 0.45;
    let bestKey = null;
    let maxVisibleH = -1;

    for (const sec of sections) {
      const el = document.getElementById(sec.id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();

      // Check if this section contains the focal anchor line
      if (rect.top <= focalY && rect.bottom > focalY) {
        bestKey = sec.key;
        break;
      }

      // Fallback: calculate visible vertical pixels inside the viewport
      const vTop = Math.max(0, rect.top);
      const vBottom = Math.min(vh, rect.bottom);
      const visibleH = Math.max(0, vBottom - vTop);

      if (visibleH > maxVisibleH) {
        maxVisibleH = visibleH;
        bestKey = sec.key;
      }
    }

    if (bestKey) {
      setActiveChapter(bestKey);
    }
  }

  function hookChapter02SceneTracking() {
    // 1. Listen to real-time custom event dispatched by chapter-02.js
    window.addEventListener('ch02:scenechange', (e) => {
      if (e.detail && typeof e.detail.sceneIndex === 'number') {
        updateActiveChild(e.detail.sceneIndex);
      }
    });

    // 2. Poll briefly if Chapter02Controller already initialized
    if (window.Chapter02Controller && typeof window.Chapter02Controller.getCurrentSceneIndex === 'function') {
      updateActiveChild(window.Chapter02Controller.getCurrentSceneIndex());
    } else {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (window.Chapter02Controller && typeof window.Chapter02Controller.getCurrentSceneIndex === 'function') {
          clearInterval(interval);
          updateActiveChild(window.Chapter02Controller.getCurrentSceneIndex());
        } else if (attempts > 30) {
          clearInterval(interval);
        }
      }, 200);
    }

    // 3. MutationObserver on .ch02-chip as universal fallback
    const chipContainer = document.querySelector('.ch02-scene-chips');
    if (chipContainer) {
      const chipObserver = new MutationObserver(() => {
        const activeChip = chipContainer.querySelector('.ch02-chip.is-active');
        if (activeChip) {
          const idx = parseInt(activeChip.getAttribute('data-scene'), 10);
          if (!isNaN(idx)) updateActiveChild(idx);
        }
      });
      chipObserver.observe(chipContainer, { attributes: true, subtree: true, attributeFilter: ['class'] });
    }
  }

  // Public API
  window.PortfolioLeftNav = {
    cycleState,
    applyState,
    setEducationExpanded,
    setActiveChapter,
    updateActiveChild,
    getState: () => STATES[currentStateIndex]
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
