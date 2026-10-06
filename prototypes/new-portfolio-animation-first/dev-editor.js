/**
 * DEVELOPMENT-ONLY VISUAL EDITING MODE
 * Lightweight in-browser typography, copy & spacing editor for Fauzan's portfolio.
 * Works like a document editor directly on live page elements.
 */

(function () {
  'use strict';

  // State management
  let isEditMode = false;
  let activeElement = null;
  let hoveredElement = null;
  const sessionEdits = new Map(); // Element -> { selector, originalText, originalStyles, currentText, currentStyles }

  // Drag state for inspector
  let isDraggingInspector = false;
  let dragOffset = { x: 0, y: 0 };

  // Common font families
  const FONT_OPTIONS = [
    { label: 'Inherit / Default', value: '' },
    { label: 'Newsreader (Serif)', value: "'Newsreader', Georgia, serif" },
    { label: 'Inter (Sans-serif)', value: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
    { label: 'JetBrains Mono (Monospace)', value: "'JetBrains Mono', monospace" },
    { label: 'Playfair Display (Serif)', value: "'Playfair Display', Georgia, serif" }
  ];

  // Utility: Generate a durable, concise CSS selector
  function getDurableSelector(el) {
    if (!el || el === document.body || el === document.documentElement) return '';
    if (el.id) return `#${el.id}`;

    const parentSection = el.closest('section[id], header[id], footer[id], #hero');
    const classNames = Array.from(el.classList || [])
      .filter(c => !c.startsWith('dev-editable') && !c.startsWith('is-'))
      .join('.');

    let elPart = classNames ? `.${classNames}` : el.tagName.toLowerCase();

    if (parentSection && parentSection !== el) {
      const sectionId = parentSection.id ? `#${parentSection.id}` : parentSection.tagName.toLowerCase();
      return `${sectionId} ${elPart}`;
    }

    return elPart;
  }

  // Utility: Parse number and unit
  function parseCssValue(val, defaultVal = 0) {
    if (!val || val === 'normal') return defaultVal;
    const num = parseFloat(val);
    return isNaN(num) ? defaultVal : num;
  }

  // Toast notification
  function showToast(message, duration = 2500) {
    let toast = document.getElementById('dev-editor-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'dev-editor-toast';
      toast.className = 'dev-editor-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, duration);
  }

  function isRecordModified(record) {
    if (!record) return false;
    if (record.currentText && record.currentText !== record.originalText) return true;
    return Object.values(record.currentStyles || {}).some(v => v !== undefined && v !== '');
  }

  function getModifiedCount() {
    let count = 0;
    sessionEdits.forEach(rec => {
      if (isRecordModified(rec)) count++;
    });
    return count;
  }

  // Create UI Root
  let editorRoot = null;
  let dock = null;
  let inspector = null;
  let exportOverlay = null;

  function createEditorUI() {
    if (editorRoot) return;

    editorRoot = document.createElement('div');
    editorRoot.id = 'dev-editor-root';

    editorRoot.innerHTML = `
      <!-- Dock Pill in Bottom Right -->
      <aside class="dev-editor-dock" role="toolbar" aria-label="Visual Editor Controls">
        <div class="dev-editor-dock__badge">
          <span class="dev-editor-dock__pulse" aria-hidden="true"></span>
          <span>Edit Mode</span>
        </div>
        <span class="dev-editor-dock__counter" id="dev-dock-counter">0 edited</span>
        <button type="button" class="dev-editor-dock__btn dev-editor-dock__btn--primary" id="dev-btn-export">
          Export / Apply
        </button>
        <button type="button" class="dev-editor-dock__btn" id="dev-btn-reset-all" title="Reset all edits made in this session">
          Reset All
        </button>
        <button type="button" class="dev-editor-dock__btn dev-editor-dock__btn--close" id="dev-btn-exit" title="Exit Edit Mode (Alt+E)">
          ✕
        </button>
      </aside>

      <!-- Contextual Floating Inspector -->
      <section class="dev-inspector" id="dev-inspector" aria-label="Contextual Typography Inspector">
        <header class="dev-inspector__header" id="dev-inspector-header">
          <span class="dev-inspector__target-badge" id="dev-inspector-target">No selection</span>
          <div class="dev-inspector__actions">
            <button type="button" class="dev-inspector__action-btn dev-inspector__action-btn--revert" id="dev-btn-revert-el" title="Revert this element">
              Revert
            </button>
            <button type="button" class="dev-inspector__action-btn dev-inspector__action-btn--close" id="dev-btn-close-inspector" title="Deselect element">
              ✕
            </button>
          </div>
        </header>

        <div class="dev-inspector__body">
          <!-- Text Content -->
          <div class="dev-inspector__group">
            <span class="dev-inspector__group-label">Copy / Text Content</span>
            <textarea class="dev-inspector__textarea" id="dev-ctrl-text" placeholder="Edit copy directly on page or here..."></textarea>
          </div>

          <!-- Typography Group -->
          <div class="dev-inspector__group">
            <span class="dev-inspector__group-label">Typography</span>

            <!-- Font Family -->
            <div class="dev-inspector__row">
              <span class="dev-inspector__label">Family</span>
              <div class="dev-inspector__input-group">
                <select id="dev-ctrl-font-family">
                  ${FONT_OPTIONS.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
                </select>
              </div>
            </div>

            <!-- Font Size -->
            <div class="dev-inspector__row">
              <span class="dev-inspector__label">Size</span>
              <div class="dev-inspector__input-group">
                <input type="range" id="dev-ctrl-font-size-range" min="9" max="96" step="1">
                <input type="number" id="dev-ctrl-font-size-num" min="9" max="96">
                <span class="dev-inspector__unit">px</span>
              </div>
            </div>

            <!-- Font Weight -->
            <div class="dev-inspector__row">
              <span class="dev-inspector__label">Weight</span>
              <div class="dev-inspector__segmented" id="dev-ctrl-font-weight">
                <button type="button" class="dev-inspector__seg-btn" data-weight="300">300</button>
                <button type="button" class="dev-inspector__seg-btn" data-weight="400">400</button>
                <button type="button" class="dev-inspector__seg-btn" data-weight="500">500</button>
                <button type="button" class="dev-inspector__seg-btn" data-weight="600">600</button>
                <button type="button" class="dev-inspector__seg-btn" data-weight="700">700</button>
              </div>
            </div>

            <!-- Line Height -->
            <div class="dev-inspector__row">
              <span class="dev-inspector__label">Line Height</span>
              <div class="dev-inspector__input-group">
                <input type="range" id="dev-ctrl-line-height-range" min="0.8" max="2.6" step="0.05">
                <input type="number" id="dev-ctrl-line-height-num" min="0.8" max="2.6" step="0.05">
              </div>
            </div>

            <!-- Letter Spacing -->
            <div class="dev-inspector__row">
              <span class="dev-inspector__label">Spacing</span>
              <div class="dev-inspector__input-group">
                <input type="range" id="dev-ctrl-letter-spacing-range" min="-0.08" max="0.30" step="0.01">
                <input type="number" id="dev-ctrl-letter-spacing-num" min="-0.08" max="0.30" step="0.01">
                <span class="dev-inspector__unit">em</span>
              </div>
            </div>

            <!-- Alignment -->
            <div class="dev-inspector__row">
              <span class="dev-inspector__label">Alignment</span>
              <div class="dev-inspector__segmented" id="dev-ctrl-alignment">
                <button type="button" class="dev-inspector__seg-btn" data-align="left" title="Align Left">Left</button>
                <button type="button" class="dev-inspector__seg-btn" data-align="center" title="Align Center">Center</button>
                <button type="button" class="dev-inspector__seg-btn" data-align="right" title="Align Right">Right</button>
                <button type="button" class="dev-inspector__seg-btn" data-align="justify" title="Justify">Justify</button>
              </div>
            </div>
          </div>

          <!-- Position & Spacing Group -->
          <div class="dev-inspector__group">
            <span class="dev-inspector__group-label">Position &amp; Spacing</span>

            <!-- Margin Top -->
            <div class="dev-inspector__row">
              <span class="dev-inspector__label">Margin Top</span>
              <div class="dev-inspector__input-group">
                <input type="range" id="dev-ctrl-margin-top-range" min="-40" max="120" step="1">
                <input type="number" id="dev-ctrl-margin-top-num" min="-40" max="120">
                <span class="dev-inspector__unit">px</span>
              </div>
            </div>

            <!-- Margin Bottom -->
            <div class="dev-inspector__row">
              <span class="dev-inspector__label">Margin Btm</span>
              <div class="dev-inspector__input-group">
                <input type="range" id="dev-ctrl-margin-bottom-range" min="-40" max="120" step="1">
                <input type="number" id="dev-ctrl-margin-bottom-num" min="-40" max="120">
                <span class="dev-inspector__unit">px</span>
              </div>
            </div>

            <!-- Offset X / Y -->
            <div class="dev-inspector__row">
              <span class="dev-inspector__label">Nudge X / Y</span>
              <div class="dev-inspector__input-group">
                <input type="number" id="dev-ctrl-offset-x" placeholder="X" min="-200" max="200" style="width: 48px;">
                <span class="dev-inspector__unit">X</span>
                <input type="number" id="dev-ctrl-offset-y" placeholder="Y" min="-200" max="200" style="width: 48px;">
                <span class="dev-inspector__unit">Y</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Export / Apply Modal -->
      <div class="dev-export-overlay" id="dev-export-overlay" role="dialog" aria-modal="true" aria-labelledby="dev-export-title">
        <div class="dev-export-modal">
          <header class="dev-export-modal__header">
            <span class="dev-export-modal__title" id="dev-export-title">Export / Apply Changes</span>
            <button type="button" class="dev-inspector__action-btn dev-inspector__action-btn--close" id="dev-btn-close-export">✕</button>
          </header>

          <nav class="dev-export-modal__tabs" role="tablist">
            <button type="button" class="dev-export-tab is-active" data-tab="css">CSS Rules</button>
            <button type="button" class="dev-export-tab" data-tab="diff">HTML Diff</button>
            <button type="button" class="dev-export-tab" data-tab="json">JSON Changelog</button>
          </nav>

          <div class="dev-export-modal__content">
            <textarea class="dev-export-modal__code" id="dev-export-code" readonly></textarea>
          </div>

          <footer class="dev-export-modal__footer">
            <span class="dev-export-modal__status" id="dev-export-status">Ready</span>
            <div class="dev-export-modal__buttons">
              <button type="button" class="dev-editor-dock__btn" id="dev-btn-copy-code">Copy to Clipboard</button>
              <button type="button" class="dev-editor-dock__btn dev-editor-dock__btn--primary" id="dev-btn-apply-source">
                Apply to Source Files
              </button>
            </div>
          </footer>
        </div>
      </div>
    `;

    document.body.appendChild(editorRoot);

    dock = editorRoot.querySelector('.dev-editor-dock');
    inspector = editorRoot.querySelector('#dev-inspector');
    exportOverlay = editorRoot.querySelector('#dev-export-overlay');

    bindUIEvents();
  }

  // Bind inspector UI events
  function bindUIEvents() {
    // Dock buttons
    document.getElementById('dev-btn-exit').addEventListener('click', () => setEditMode(false));
    document.getElementById('dev-btn-reset-all').addEventListener('click', resetAllEdits);
    document.getElementById('dev-btn-export').addEventListener('click', openExportModal);

    // Inspector close / revert
    document.getElementById('dev-btn-close-inspector').addEventListener('click', deselectElement);
    document.getElementById('dev-btn-revert-el').addEventListener('click', revertActiveElement);

    // Export modal close & tabs
    document.getElementById('dev-btn-close-export').addEventListener('click', closeExportModal);
    exportOverlay.addEventListener('click', (e) => {
      if (e.target === exportOverlay) closeExportModal();
    });

    document.querySelectorAll('.dev-export-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.dev-export-tab').forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        renderExportTab(tab.dataset.tab);
      });
    });

    document.getElementById('dev-btn-copy-code').addEventListener('click', copyExportCode);
    document.getElementById('dev-btn-apply-source').addEventListener('click', applyEditsToSourceFiles);

    // Inspector Dragging
    const header = document.getElementById('dev-inspector-header');
    header.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button')) return;
      isDraggingInspector = true;
      const rect = inspector.getBoundingClientRect();
      dragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      header.setPointerCapture(e.pointerId);
    });

    header.addEventListener('pointermove', (e) => {
      if (!isDraggingInspector) return;
      const left = Math.max(10, Math.min(window.innerWidth - inspector.offsetWidth - 10, e.clientX - dragOffset.x));
      const top = Math.max(10, Math.min(window.innerHeight - inspector.offsetHeight - 10, e.clientY - dragOffset.y));
      inspector.style.left = `${left}px`;
      inspector.style.top = `${top}px`;
      inspector.style.right = 'auto';
      inspector.style.bottom = 'auto';
    });

    header.addEventListener('pointerup', (e) => {
      if (isDraggingInspector) {
        isDraggingInspector = false;
        try { header.releasePointerCapture(e.pointerId); } catch (_) {}
      }
    });

    // Inspector Form Controls Change Bindings
    bindInspectorInput('dev-ctrl-text', 'input', val => {
      if (!activeElement) return;
      if (activeElement.tagName === 'text') {
        activeElement.textContent = val;
      } else {
        activeElement.innerText = val;
      }
      recordCurrentEdit();
    });

    bindInspectorInput('dev-ctrl-font-family', 'change', val => applyStyle('fontFamily', val));

    // Font size synced range + num
    syncRangeAndNum('dev-ctrl-font-size-range', 'dev-ctrl-font-size-num', val => applyStyle('fontSize', `${val}px`));

    // Font weight segmented buttons
    document.querySelectorAll('#dev-ctrl-font-weight .dev-inspector__seg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#dev-ctrl-font-weight .dev-inspector__seg-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        applyStyle('fontWeight', btn.dataset.weight);
      });
    });

    // Line height synced range + num
    syncRangeAndNum('dev-ctrl-line-height-range', 'dev-ctrl-line-height-num', val => applyStyle('lineHeight', `${val}`));

    // Letter spacing synced range + num
    syncRangeAndNum('dev-ctrl-letter-spacing-range', 'dev-ctrl-letter-spacing-num', val => applyStyle('letterSpacing', `${val}em`));

    // Text alignment segmented buttons
    document.querySelectorAll('#dev-ctrl-alignment .dev-inspector__seg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#dev-ctrl-alignment .dev-inspector__seg-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        applyStyle('textAlign', btn.dataset.align);
      });
    });

    // Margin top synced range + num
    syncRangeAndNum('dev-ctrl-margin-top-range', 'dev-ctrl-margin-top-num', val => applyStyle('marginTop', `${val}px`));

    // Margin bottom synced range + num
    syncRangeAndNum('dev-ctrl-margin-bottom-range', 'dev-ctrl-margin-bottom-num', val => applyStyle('marginBottom', `${val}px`));

    // Offset X / Y
    const offsetXInput = document.getElementById('dev-ctrl-offset-x');
    const offsetYInput = document.getElementById('dev-ctrl-offset-y');
    const updateOffset = () => {
      const x = parseFloat(offsetXInput.value) || 0;
      const y = parseFloat(offsetYInput.value) || 0;
      applyStyle('transform', (x !== 0 || y !== 0) ? `translate(${x}px, ${y}px)` : '');
    };
    offsetXInput.addEventListener('input', updateOffset);
    offsetYInput.addEventListener('input', updateOffset);
  }

  function bindInspectorInput(id, eventType, handler) {
    const el = document.getElementById(id);
    if (el) el.addEventListener(eventType, e => handler(e.target.value));
  }

  function syncRangeAndNum(rangeId, numId, handler) {
    const range = document.getElementById(rangeId);
    const num = document.getElementById(numId);
    if (!range || !num) return;

    range.addEventListener('input', () => {
      num.value = range.value;
      handler(range.value);
    });

    num.addEventListener('input', () => {
      range.value = num.value;
      handler(num.value);
    });
  }

  // Apply style to active element
  function applyStyle(property, value) {
    if (!activeElement) return;
    activeElement.style[property] = value;
    recordCurrentEdit();
  }

  // Record active edit into session map
  function recordCurrentEdit() {
    if (!activeElement) return;

    let record = sessionEdits.get(activeElement);
    if (!record) {
      const computed = window.getComputedStyle(activeElement);
      record = {
        element: activeElement,
        selector: getDurableSelector(activeElement),
        originalText: activeElement.textContent.trim(),
        originalStyles: {
          fontFamily: activeElement.style.fontFamily || computed.fontFamily,
          fontSize: activeElement.style.fontSize || computed.fontSize,
          fontWeight: activeElement.style.fontWeight || computed.fontWeight,
          lineHeight: activeElement.style.lineHeight || computed.lineHeight,
          letterSpacing: activeElement.style.letterSpacing || computed.letterSpacing,
          textAlign: activeElement.style.textAlign || computed.textAlign,
          marginTop: activeElement.style.marginTop || computed.marginTop,
          marginBottom: activeElement.style.marginBottom || computed.marginBottom,
          transform: activeElement.style.transform || ''
        },
        currentStyles: {}
      };
      sessionEdits.set(activeElement, record);
    }

    record.currentText = activeElement.textContent.trim();
    record.currentStyles = {
      fontFamily: activeElement.style.fontFamily,
      fontSize: activeElement.style.fontSize,
      fontWeight: activeElement.style.fontWeight,
      lineHeight: activeElement.style.lineHeight,
      letterSpacing: activeElement.style.letterSpacing,
      textAlign: activeElement.style.textAlign,
      marginTop: activeElement.style.marginTop,
      marginBottom: activeElement.style.marginBottom,
      transform: activeElement.style.transform
    };

    updateDockCounter();
  }

  function updateDockCounter() {
    const counter = document.getElementById('dev-dock-counter');
    if (counter) {
      const count = getModifiedCount();
      counter.textContent = `${count} edited`;
      counter.style.color = count > 0 ? '#fbbf24' : '#94a3b8';
    }
  }

  // Select an element
  function selectElement(el) {
    if (activeElement === el) {
      // Ensure record exists
      if (!sessionEdits.has(activeElement)) {
        initSessionRecord(activeElement);
      }
      return;
    }
    deselectElement();

    if (!el || el.closest('#dev-editor-root')) return;

    activeElement = el;
    activeElement.classList.add('dev-editable-selected');

    // Capture initial state BEFORE any typing or editing occurs
    if (!sessionEdits.has(activeElement)) {
      initSessionRecord(activeElement);
    }

    // Make element contenteditable for direct document editing
    if (activeElement.tagName !== 'text' && !activeElement.isContentEditable) {
      activeElement.contentEditable = 'true';
      activeElement.spellcheck = false;

      activeElement._onInput = () => {
        const textarea = document.getElementById('dev-ctrl-text');
        if (textarea) textarea.value = activeElement.textContent.trim();
        recordCurrentEdit();
      };
      activeElement.addEventListener('input', activeElement._onInput);
    }

    // Populate Inspector
    populateInspector(activeElement);

    // Position Inspector
    positionInspectorNear(activeElement);

    inspector.classList.add('is-visible');
  }

  function initSessionRecord(el) {
    const computed = window.getComputedStyle(el);
    sessionEdits.set(el, {
      element: el,
      selector: getDurableSelector(el),
      originalText: el.textContent.trim(),
      originalStyles: {
        fontFamily: el.style.fontFamily || computed.fontFamily,
        fontSize: el.style.fontSize || computed.fontSize,
        fontWeight: el.style.fontWeight || computed.fontWeight,
        lineHeight: el.style.lineHeight || computed.lineHeight,
        letterSpacing: el.style.letterSpacing || computed.letterSpacing,
        textAlign: el.style.textAlign || computed.textAlign,
        marginTop: el.style.marginTop || computed.marginTop,
        marginBottom: el.style.marginBottom || computed.marginBottom,
        transform: el.style.transform || ''
      },
      currentText: el.textContent.trim(),
      currentStyles: {}
    });
  }

  function deselectElement() {
    if (!activeElement) return;

    activeElement.classList.remove('dev-editable-selected');
    if (activeElement.isContentEditable) {
      activeElement.contentEditable = 'false';
      if (activeElement._onInput) {
        activeElement.removeEventListener('input', activeElement._onInput);
        delete activeElement._onInput;
      }
    }

    activeElement = null;
    if (inspector) inspector.classList.remove('is-visible');
  }

  function populateInspector(el) {
    const selector = getDurableSelector(el);
    document.getElementById('dev-inspector-target').textContent = selector;
    document.getElementById('dev-inspector-target').title = selector;

    // Text Content
    document.getElementById('dev-ctrl-text').value = el.textContent.trim();

    const computed = window.getComputedStyle(el);

    // Font Family
    const ffSelect = document.getElementById('dev-ctrl-font-family');
    const currentFf = el.style.fontFamily || computed.fontFamily;
    let matched = false;
    for (const opt of ffSelect.options) {
      if (opt.value && currentFf.toLowerCase().includes(opt.text.split(' ')[0].toLowerCase())) {
        ffSelect.value = opt.value;
        matched = true;
        break;
      }
    }
    if (!matched) ffSelect.value = '';

    // Font Size
    const fsVal = parseCssValue(el.style.fontSize || computed.fontSize, 16);
    document.getElementById('dev-ctrl-font-size-range').value = fsVal;
    document.getElementById('dev-ctrl-font-size-num').value = fsVal;

    // Font Weight
    const fwVal = computed.fontWeight || '400';
    document.querySelectorAll('#dev-ctrl-font-weight .dev-inspector__seg-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.weight === fwVal);
    });

    // Line Height
    let lhVal = computed.lineHeight;
    if (lhVal.endsWith('px')) {
      lhVal = (parseFloat(lhVal) / fsVal).toFixed(2);
    } else {
      lhVal = parseCssValue(lhVal, 1.4);
    }
    document.getElementById('dev-ctrl-line-height-range').value = lhVal;
    document.getElementById('dev-ctrl-line-height-num').value = lhVal;

    // Letter Spacing
    let lsVal = computed.letterSpacing;
    if (lsVal === 'normal') lsVal = 0;
    else if (lsVal.endsWith('px')) {
      lsVal = (parseFloat(lsVal) / fsVal).toFixed(3);
    } else {
      lsVal = parseCssValue(lsVal, 0);
    }
    document.getElementById('dev-ctrl-letter-spacing-range').value = lsVal;
    document.getElementById('dev-ctrl-letter-spacing-num').value = lsVal;

    // Alignment
    const taVal = el.style.textAlign || computed.textAlign || 'left';
    document.querySelectorAll('#dev-ctrl-alignment .dev-inspector__seg-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.align === taVal);
    });

    // Margin Top / Bottom
    const mtVal = parseCssValue(el.style.marginTop || computed.marginTop, 0);
    document.getElementById('dev-ctrl-margin-top-range').value = mtVal;
    document.getElementById('dev-ctrl-margin-top-num').value = mtVal;

    const mbVal = parseCssValue(el.style.marginBottom || computed.marginBottom, 0);
    document.getElementById('dev-ctrl-margin-bottom-range').value = mbVal;
    document.getElementById('dev-ctrl-margin-bottom-num').value = mbVal;

    // Offset X / Y
    let ox = 0, oy = 0;
    const transform = el.style.transform;
    if (transform && transform.includes('translate')) {
      const match = transform.match(/translate\(([-0-9.]+)px,\s*([-0-9.]+)px\)/);
      if (match) {
        ox = parseFloat(match[1]);
        oy = parseFloat(match[2]);
      }
    }
    document.getElementById('dev-ctrl-offset-x').value = ox || '';
    document.getElementById('dev-ctrl-offset-y').value = oy || '';
  }

  function positionInspectorNear(el) {
    if (!inspector) return;
    const rect = el.getBoundingClientRect();
    const inspectorW = 320;
    const inspectorH = 460;

    // Default: Place to right of element, or left if not enough space
    let left = rect.right + 24;
    let top = rect.top;

    if (left + inspectorW > window.innerWidth - 20) {
      left = rect.left - inspectorW - 24;
    }
    if (left < 20) {
      left = Math.max(20, (window.innerWidth - inspectorW) / 2);
    }

    if (top + inspectorH > window.innerHeight - 20) {
      top = Math.max(20, window.innerHeight - inspectorH - 20);
    }
    if (top < 20) top = 20;

    inspector.style.left = `${left}px`;
    inspector.style.top = `${top}px`;
    inspector.style.right = 'auto';
    inspector.style.bottom = 'auto';
  }

  // Revert active element
  function revertActiveElement() {
    if (!activeElement) return;
    const record = sessionEdits.get(activeElement);
    if (!record) {
      showToast('No edits recorded for this element');
      return;
    }

    // Restore text
    if (activeElement.tagName === 'text') {
      activeElement.textContent = record.originalText;
    } else {
      activeElement.innerText = record.originalText;
    }

    // Restore inline styles
    const styles = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'textAlign', 'marginTop', 'marginBottom', 'transform'];
    styles.forEach(s => {
      activeElement.style[s] = '';
    });

    record.currentText = record.originalText;
    record.currentStyles = {};

    updateDockCounter();
    populateInspector(activeElement);
    showToast('Reverted element to original state');
  }

  // Reset all edits
  function resetAllEdits() {
    if (sessionEdits.size === 0) {
      showToast('No active edits to reset');
      return;
    }

    sessionEdits.forEach((record, el) => {
      if (el.tagName === 'text') {
        el.textContent = record.originalText;
      } else {
        el.innerText = record.originalText;
      }
      const styles = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'textAlign', 'marginTop', 'marginBottom', 'transform'];
      styles.forEach(s => {
        el.style[s] = '';
      });
      record.currentText = record.originalText;
      record.currentStyles = {};
    });

    updateDockCounter();
    if (activeElement) {
      populateInspector(activeElement);
    }
    showToast('All session edits reset');
  }

  // Export Modal Rendering
  let currentExportTab = 'css';

  function openExportModal() {
    renderExportTab(currentExportTab);
    exportOverlay.classList.add('is-visible');
  }

  function closeExportModal() {
    exportOverlay.classList.remove('is-visible');
  }

  function renderExportTab(tabName) {
    currentExportTab = tabName;
    const codeArea = document.getElementById('dev-export-code');
    const status = document.getElementById('dev-export-status');
    const count = getModifiedCount();
    status.textContent = `${count} elements modified`;

    if (tabName === 'css') {
      let css = '/* Generated by Portfolio Visual Editor */\n\n';
      sessionEdits.forEach((record) => {
        if (!isRecordModified(record)) return;
        css += `${record.selector} {\n`;
        for (const [prop, val] of Object.entries(record.currentStyles)) {
          if (val) {
            const kebab = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
            css += `  ${kebab}: ${val};\n`;
          }
        }
        css += '}\n\n';
      });
      if (count === 0) css += '/* (No elements modified yet) */\n';
      codeArea.value = css;
    } else if (tabName === 'diff') {
      let diff = '/* HTML Text & Markup Changes */\n\n';
      sessionEdits.forEach((record) => {
        if (!isRecordModified(record)) return;
        diff += `Target: ${record.selector}\n`;
        diff += `- Original: "${record.originalText}"\n`;
        diff += `+ Updated:  "${record.currentText || record.originalText}"\n\n`;
      });
      if (count === 0) diff += '/* (No elements modified yet) */\n';
      codeArea.value = diff;
    } else if (tabName === 'json') {
      const payload = [];
      sessionEdits.forEach((record) => {
        if (!isRecordModified(record)) return;
        payload.push({
          selector: record.selector,
          originalText: record.originalText,
          updatedText: record.currentText || record.originalText,
          styles: record.currentStyles
        });
      });
      codeArea.value = JSON.stringify(payload, null, 2);
    }
  }

  function copyExportCode() {
    const codeArea = document.getElementById('dev-export-code');
    codeArea.select();
    navigator.clipboard.writeText(codeArea.value)
      .then(() => showToast('Copied to clipboard!'))
      .catch(() => {
        document.execCommand('copy');
        showToast('Copied to clipboard!');
      });
  }

  // Apply Edits directly to local server source files
  async function applyEditsToSourceFiles() {
    const status = document.getElementById('dev-export-status');
    const applyBtn = document.getElementById('dev-btn-apply-source');

    const payload = [];
    sessionEdits.forEach((record) => {
      if (!isRecordModified(record)) return;
      payload.push({
        selector: record.selector,
        originalText: record.originalText,
        updatedText: record.currentText || record.originalText,
        styles: record.currentStyles
      });
    });

    if (payload.length === 0) {
      showToast('No edits to apply');
      return;
    }

    status.textContent = 'Applying to source files...';
    applyBtn.disabled = true;

    try {
      const res = await fetch('/api/dev-apply-edits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ edits: payload })
      });

      if (res.ok) {
        const data = await res.json();
        status.textContent = `✓ Successfully applied ${data.appliedCount || payload.length} changes to disk!`;
        showToast('Changes saved to source files!');
      } else {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
    } catch (err) {
      status.textContent = 'Server endpoint not found. Use "Copy to Clipboard" instead.';
      showToast('Copy code below to update files manually', 3500);
    } finally {
      applyBtn.disabled = false;
    }
  }

  // Page interaction listeners in Edit Mode
  function isEditableCandidate(target) {
    if (!target || target === document.body || target === document.documentElement) return false;
    if (target.closest('#dev-editor-root') || target.closest('#dev-editor-toast')) return false;

    const tag = target.tagName.toLowerCase();
    const textTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'div', 'button', 'text', 'li', 'cite', 'output', 'label'];
    if (!textTags.includes(tag)) return false;

    const hasDirectText = Array.from(target.childNodes).some(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0);
    return hasDirectText || tag === 'text' || target.classList.contains('chapter-placeholder__title') || target.classList.contains('chapter-placeholder__desc');
  }

  function onPointerOver(e) {
    if (!isEditMode) return;
    const target = e.target.closest('h1, h2, h3, h4, p, span, a, div.chapter-placeholder__subtitle, div.chapter-placeholder__desc, text');
    if (target && isEditableCandidate(target) && target !== activeElement) {
      if (hoveredElement && hoveredElement !== target) {
        hoveredElement.classList.remove('dev-editable-hover');
      }
      hoveredElement = target;
      hoveredElement.classList.add('dev-editable-hover');
    }
  }

  function onPointerOut(e) {
    if (!isEditMode) return;
    if (hoveredElement && (e.relatedTarget === null || !hoveredElement.contains(e.relatedTarget))) {
      hoveredElement.classList.remove('dev-editable-hover');
      hoveredElement = null;
    }
  }

  function onPointerDown(e) {
    if (!isEditMode) return;
    if (e.target.closest('#dev-editor-root') || e.target.closest('#dev-editor-toast')) return;

    const target = e.target.closest('h1, h2, h3, h4, p, span, a, div.chapter-placeholder__subtitle, div.chapter-placeholder__desc, text');
    if (target && isEditableCandidate(target)) {
      e.preventDefault();
      e.stopPropagation();
      selectElement(target);
    } else {
      deselectElement();
    }
  }

  // Enable / Disable Edit Mode
  function setEditMode(active) {
    if (isEditMode === active) return;
    isEditMode = active;

    if (isEditMode) {
      createEditorUI();
      document.body.classList.add('dev-editor-active');
      sessionStorage.setItem('portfolio_dev_editor', 'true');

      document.addEventListener('pointerover', onPointerOver, true);
      document.addEventListener('pointerout', onPointerOut, true);
      document.addEventListener('pointerdown', onPointerDown, true);

      showToast('Visual Edit Mode Active (Alt+E to toggle)');
    } else {
      deselectElement();
      document.body.classList.remove('dev-editor-active');
      sessionStorage.removeItem('portfolio_dev_editor');

      document.removeEventListener('pointerover', onPointerOver, true);
      document.removeEventListener('pointerout', onPointerOut, true);
      document.removeEventListener('pointerdown', onPointerDown, true);

      if (hoveredElement) {
        hoveredElement.classList.remove('dev-editable-hover');
        hoveredElement = null;
      }

      if (editorRoot) {
        editorRoot.remove();
        editorRoot = null;
      }

      showToast('Exited Edit Mode');
    }
  }

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if ((e.altKey && (e.key === 'e' || e.key === 'E')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'e' || e.key === 'E'))) {
      e.preventDefault();
      setEditMode(!isEditMode);
      return;
    }

    if (e.key === 'Escape' && isEditMode) {
      if (exportOverlay && exportOverlay.classList.contains('is-visible')) {
        closeExportModal();
      } else if (activeElement) {
        deselectElement();
      } else {
        setEditMode(false);
      }
    }
  });

  // Check URL query param ?edit=1 or ?edit=true or sessionStorage
  function checkAutoActivation() {
    const urlParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    const shouldActivate = urlParams.get('edit') === '1' ||
                           urlParams.get('edit') === 'true' ||
                           urlParams.get('dev') === '1' ||
                           hash === '#edit' ||
                           sessionStorage.getItem('portfolio_dev_editor') === 'true';

    if (shouldActivate) {
      setEditMode(true);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAutoActivation);
  } else {
    checkAutoActivation();
  }

  // Expose Dev API to window for programmatic testing / scripting
  window.__DEV_VISUAL_EDITOR__ = {
    setEditMode,
    isEditMode: () => isEditMode,
    selectElement,
    deselectElement,
    getActiveElement: () => activeElement,
    applyStyle,
    revertActiveElement,
    resetAllEdits,
    getSessionEdits: () => Array.from(sessionEdits.values()),
    getModifiedEdits: () => Array.from(sessionEdits.values()).filter(isRecordModified),
    applyEditsToSourceFiles
  };
})();
