(async () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('immersive') !== '1') return;

  const hero = document.querySelector('.hero');
  const motionRoot = document.querySelector('.hero-motion');
  if (!hero || !motionRoot) return;

  const runtimeScriptUrl = document.currentScript?.src || window.location.href;
  const runtimeAssetBase = new URL('.', runtimeScriptUrl);
  const readRuntimeJson = async (name) => {
    const response = await fetch(new URL(name, runtimeAssetBase));
    if (!response.ok) throw new Error(`Unable to load ${name}: ${response.status}`);
    return response.json();
  };
  const [integrateManifest, integrateBridge, outputManifest, integrateOutputBridge, outputChoreography, settledRuntimeBridge] = await Promise.all([
    readRuntimeJson('integrate-golden-v26.manifest.json'),
    readRuntimeJson('integrate-live-source-bridge.json'),
    readRuntimeJson('output-golden-v2.manifest.json'),
    readRuntimeJson('integrate-output-v2-live-bridge.json'),
    readRuntimeJson('integrate-output-v2-choreography.json'),
    readRuntimeJson('integrate-output-live-bridge.json')
  ]);

  const NS = 'http://www.w3.org/2000/svg';
  const WIDTH = 1600;
  const HEIGHT = 720;
  const PRE_OUTPUT_RUNTIME_MS = 18000;
  const SCALE = PRE_OUTPUT_RUNTIME_MS / 32800;
  const HOLD_INTEGRATE_ENDPOINT = false;
  const time = (milliseconds) => milliseconds * SCALE;
  const outputTransitionDuration = outputChoreography.timebase.transitionDurationMs;
  const outputHoldDuration = outputChoreography.timebase.finalHoldDurationMs;
  const outputStageDuration = outputTransitionDuration + outputHoldDuration;
  const outputStart = time(22800);
  const TOTAL = outputStart + outputStageDuration;
  const schedule = [
    { phase: 'scatter', start: time(0), end: time(2550) },
    { phase: 'attract', start: time(2550), end: time(5100) },
    { phase: 'align', start: time(5100), end: time(7650) },
    { phase: 'connect', start: time(7650), end: time(12580) },
    { phase: 'cluster', start: time(12580), end: time(13600) },
    { phase: 'structure', start: time(13600), end: time(18000) },
    { phase: 'integrate', start: time(18000), end: time(22800) },
    { phase: 'output', start: outputStart, end: TOTAL }
  ];
  const integrateEnd = schedule[6].end;
  const structureStart = schedule[5].start;
  const integrateStart = schedule[6].start;
  const frameDuration = 1000 / 30;
  const seekMax = TOTAL - frameDuration;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const palette = {
    navy: '#0e1a2e',
    slate: '#5a5c63',
    sand: '#cf9d63',
    paper: '#fcfcfc',
    grid: '#bcc2c9',
    ivory: '#f1ede4'
  };
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const lerp = (from, to, amount) => from + (to - from) * amount;
  const easeOut = (value) => 1 - Math.pow(1 - clamp(value), 3);
  const easeInOut = (value) => {
    const t = clamp(value);
    return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };
  const hexToRgb = (hex) => [0, 2, 4].map((index) => parseInt(hex.slice(index + 1, index + 3), 16));
  const mixColor = (from, to, amount) => {
    const a = hexToRgb(from);
    const b = hexToRgb(to);
    return `rgb(${a.map((channel, index) => Math.round(lerp(channel, b[index], clamp(amount)))).join(',')})`;
  };
  const color = (name) => palette[name] || palette.navy;
  const svgElement = (tag, className, attributes = {}) => {
    const element = document.createElementNS(NS, tag);
    if (className) element.setAttribute('class', className);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  };
  const group = (className) => svgElement('g', className);
  const pointsToPath = (points, close = true) => `M${points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join('L')}${close ? 'Z' : ''}`;
  const linePath = (points) => pointsToPath(points, false);
  const interpolatePoints = (from, to, amount) => from.map(([x, y], index) => [
    lerp(x, to[index][0], amount),
    lerp(y, to[index][1], amount)
  ]);
  const circlePoints = (radius) => Array.from({ length: 16 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 16;
    return [Math.cos(angle) * radius, Math.sin(angle) * radius];
  });
  const rectPoints = (width, height) => {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    return [
      [-halfWidth, -halfHeight], [0, -halfHeight], [halfWidth, -halfHeight], [halfWidth, 0],
      [halfWidth, halfHeight], [0, halfHeight], [-halfWidth, halfHeight], [-halfWidth, 0],
      [-halfWidth, -halfHeight], [-halfWidth, -halfHeight], [-halfWidth, -halfHeight], [-halfWidth, -halfHeight],
      [-halfWidth, -halfHeight], [-halfWidth, -halfHeight], [-halfWidth, -halfHeight], [-halfWidth, -halfHeight]
    ];
  };
  const roundedRectPoints = (width, height, radius = 4) => {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const r = Math.min(radius, halfWidth, halfHeight);
    const corners = [
      [halfWidth - r, -halfHeight + r, -.5 * Math.PI, 0],
      [halfWidth - r, halfHeight - r, 0, .5 * Math.PI],
      [-halfWidth + r, halfHeight - r, .5 * Math.PI, Math.PI],
      [-halfWidth + r, -halfHeight + r, Math.PI, 1.5 * Math.PI]
    ];
    return corners.flatMap(([centerX, centerY, startAngle, endAngle]) => Array.from({ length: 4 }, (_, index) => {
      const angle = lerp(startAngle, endAngle, index / 3);
      return [centerX + Math.cos(angle) * r, centerY + Math.sin(angle) * r];
    }));
  };
  const arcPoints = (radius, startAngle, endAngle, thickness) => {
    const outer = Array.from({ length: 8 }, (_, index) => {
      const angle = lerp(startAngle, endAngle, index / 7);
      return [Math.cos(angle) * radius, Math.sin(angle) * radius];
    });
    const inner = Array.from({ length: 8 }, (_, index) => {
      const angle = lerp(endAngle, startAngle, index / 7);
      return [Math.cos(angle) * (radius - thickness), Math.sin(angle) * (radius - thickness)];
    });
    return [...outer, ...inner];
  };
  const ellipsePoints = (radiusX, radiusY) => Array.from({ length: 16 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 16;
    return [Math.cos(angle) * radiusX, Math.sin(angle) * radiusY];
  });
  const arcPointsAniso = (radiusX, radiusY, startAngle, endAngle, innerRadiusX, innerRadiusY) => {
    const outer = Array.from({ length: 8 }, (_, index) => {
      const angle = lerp(startAngle, endAngle, index / 7);
      return [Math.cos(angle) * radiusX, Math.sin(angle) * radiusY];
    });
    const inner = Array.from({ length: 8 }, (_, index) => {
      const angle = lerp(endAngle, startAngle, index / 7);
      return [Math.cos(angle) * (radiusX - innerRadiusX), Math.sin(angle) * (radiusY - innerRadiusY)];
    });
    return [...outer, ...inner];
  };
  const segmentPoints = (from, to, thickness = 1.2) => {
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const length = Math.max(.001, Math.hypot(dx, dy));
    const nx = (-dy / length) * thickness / 2;
    const ny = (dx / length) * thickness / 2;
    const samples = Array.from({ length: 8 }, (_, index) => {
      const amount = index / 7;
      return [lerp(from[0], to[0], amount), lerp(from[1], to[1], amount)];
    });
    return [
      ...samples.map(([x, y]) => [x + nx, y + ny]),
      ...samples.reverse().map(([x, y]) => [x - nx, y - ny])
    ];
  };
  const shapePoints = (spec) => {
    if (!spec) return circlePoints(2.5);
    if (spec.kind === 'tile') return roundedRectPoints(spec.width || 32, spec.height || 28, spec.radius || 2);
    if (spec.kind === 'bar' || spec.kind === 'metric') return rectPoints(spec.width, spec.height);
    if (spec.kind === 'arc') return arcPoints(spec.radius, spec.startAngle, spec.endAngle, spec.thickness);
    return circlePoints(spec.radius || 3);
  };
  const phaseFor = (elapsed) => {
    if (HOLD_INTEGRATE_ENDPOINT && elapsed >= integrateEnd) {
      return { ...schedule[6], index: 6, progress: 1 };
    }
    let index = 0;
    schedule.forEach((entry, candidate) => { if (elapsed >= entry.start) index = candidate; });
    const entry = schedule[index];
    return { ...entry, index, progress: clamp((elapsed - entry.start) / Math.max(1, entry.end - entry.start)) };
  };
  const centerOf = (spec) => ({ x: spec.x, y: spec.y });

  const targetObjects = new Map();
  const registerTarget = (target) => {
    if (target?.id) targetObjects.set(target.id, target);
    return target;
  };
  integrateManifest.core.tiles.forEach((tile) => { registerTarget(tile); registerTarget(tile.mark); });
  integrateManifest.core.baseHairlines.forEach(registerTarget);
  integrateManifest.supportGeometry.forEach(registerTarget);
  registerTarget(integrateManifest.widgets.distribution.label);
  registerTarget(integrateManifest.widgets.distribution.ring);
  integrateManifest.widgets.distribution.accentArcs.forEach(registerTarget);
  registerTarget(integrateManifest.widgets.trends.label);
  integrateManifest.widgets.trends.bars.forEach(registerTarget);
  registerTarget(integrateManifest.widgets.trends.baseline);
  registerTarget(integrateManifest.widgets.performance.label);
  registerTarget(integrateManifest.widgets.performance.polyline);
  integrateManifest.widgets.performance.points.forEach(registerTarget);
  registerTarget(integrateManifest.widgets.insights.label);
  integrateManifest.widgets.insights.lines.forEach(registerTarget);
  integrateManifest.widgets.insights.dots.forEach(registerTarget);
  registerTarget(integrateManifest.widgets.overviewSystemDetail.label);
  integrateManifest.widgets.overviewSystemDetail.hairlines.forEach(registerTarget);
  integrateManifest.widgets.overviewSystemDetail.rails.forEach(registerTarget);
  const targetFor = (id) => targetObjects.get(id) || null;
  if (outputManifest.manifestId !== 'output-golden-v2' || outputManifest.objects.length !== 113) throw new Error('Output Golden v2 target inventory is required for Integrate -> Output.');
  if (integrateOutputBridge.id !== 'integrate-output-v2-live-bridge-v1' || integrateOutputBridge.targetAuthority?.manifest?.manifestId !== outputManifest.manifestId) throw new Error('Integrate -> Output v2 ownership bridge is required for Integrate -> Output.');
  if (outputChoreography.specId !== 'integrate-output-v2-choreography-v1' || outputChoreography.timebase.transitionDurationMs !== 9400 || outputChoreography.timebase.finalHoldDurationMs < 1800) throw new Error('Integrate -> Output v2 choreography contract is required for Integrate -> Output.');
  const outputTargetObjects = new Map(outputManifest.objects.map((object) => [object.id, object]));
  const settledRuntimeSourceObjects = new Map(settledRuntimeBridge.sourceObjects.map((object) => [object.id, object]));
  const outputSourceObjects = new Map(integrateOutputBridge.sourceObjects.map((object) => [object.id, { ...object, runtime: settledRuntimeSourceObjects.get(object.runtimeSourceId)?.runtime }]));
  const outputNetworkSourceByIndex = new Map([...outputSourceObjects.entries()]
    .filter(([, source]) => source.runtime?.family === 'networkElements')
    .map(([sourceId, source]) => [source.runtime.index, sourceId]));
  const outputTargetOwners = new Map(integrateOutputBridge.targetObjects.map((object) => [object.id, object]));
  const targetGeometryKinds = new Set(['tile', 'bar', 'circle', 'arc', 'point', 'dot', 'metric', 'line', 'hairline', 'rail', 'polyline']);
  const bridgeNodeFor = (index) => integrateBridge.liveNodes.find((node) => node.index === index) || null;
  const primaryTargetIdFor = (nodeOrIndex) => {
    const node = typeof nodeOrIndex === 'number' ? bridgeNodeFor(nodeOrIndex) : nodeOrIndex;
    return node?.targetRefs?.find((id) => targetGeometryKinds.has(targetFor(id)?.kind)) || node?.mergeInto || null;
  };
  const primaryTargetFor = (index) => targetFor(primaryTargetIdFor(bridgeNodeFor(index)));
  const coreOwnersByTarget = new Map();
  integrateBridge.liveNodes.filter((node) => node.role === 'core').forEach((node) => {
    const targetId = primaryTargetIdFor(node);
    const owners = coreOwnersByTarget.get(targetId) || [];
    owners.push(node.index);
    coreOwnersByTarget.set(targetId, owners);
  });
  const corePrimaryIndex = new Map([...coreOwnersByTarget.entries()].map(([targetId, owners]) => [targetId, owners[0]]));
  const integrateWidgetRoles = new Set(['overview', 'trend', 'performance', 'distribution', 'insights']);
  const targetPalette = integrateManifest.palette;
  const targetColor = (name) => targetPalette[name] || targetPalette.navy;
  const bridgeObjectId = (family, index) => family.idFormat.replace('%02d', String(index).padStart(2, '0'));
  const runtimeObjectTargetIds = new Map();
  integrateBridge.runtimeObjects.families.forEach((family) => {
    family.ranges.forEach((range) => {
      const ids = range.ids || Array.from({ length: range.to - range.from + 1 }, (_, offset) => bridgeObjectId(family, range.from + offset));
      ids.forEach((id) => runtimeObjectTargetIds.set(id, range.targetRefs?.[0] || null));
    });
  });
  const boundaryPoints = ({ x, y, width, height }) => {
    const points = roundedRectPoints(width, height, 12);
    return points.map(([px, py]) => [px + x + width / 2, py + y + height / 2]);
  };

  document.body.classList.add('immersive-mode');
  window.__heroStitchIndicatorOwned = true;
  motionRoot.dataset.stitchRuntime = `${TOTAL}ms`;
  motionRoot.dataset.stitchMode = 'immersive';
  motionRoot.dataset.stitchLoop = 'infinite';

  motionRoot.querySelectorAll('*').forEach((element) => {
    element.getAnimations?.().forEach((animation) => animation.cancel());
  });
  motionRoot.querySelectorAll('.motion-canvas,.lineage-runtime-layer,.static-phase-art').forEach((element) => {
    element.style.opacity = '0';
    element.style.visibility = 'hidden';
    element.style.pointerEvents = 'none';
  });

  const canvas = svgElement('svg', 'immersive-canvas', {
    viewBox: `0 0 ${WIDTH} ${HEIGHT}`,
    preserveAspectRatio: 'none',
    'aria-hidden': 'true',
    focusable: 'false'
  });
  const frameLayer = group('immersive-frame-layer');
  const boundaryLayer = group('immersive-boundary-layer');
  const linkLayer = group('immersive-link-layer');
  const integrateSplitLayer = group('immersive-integrate-splits');
  const integrateLabelLayer = group('immersive-integrate-labels');
  const lineLayer = group('immersive-line-layer');
  const nodeLayer = group('immersive-node-layer');
  const detailLayer = group('immersive-detail-layer');
  const labelLayer = group('immersive-label-layer');
  const outputShellLayer = group('immersive-output-shell-layer');
  const outputSourceCarrierLayer = group('immersive-output-source-carrier-layer');
  const outputTargetLayer = group('immersive-output-detail-layer');
  const outputShellTargetIds = new Set(['output-v2-frame', 'output-v2-panel-overview', 'output-v2-panel-distribution', 'output-v2-panel-performance', 'output-v2-panel-trends', 'output-v2-panel-variance', 'output-v2-panel-insights']);
  integrateSplitLayer.style.opacity = '0';
  integrateLabelLayer.style.opacity = '0';
  outputShellLayer.style.opacity = '0';
  outputSourceCarrierLayer.style.opacity = '0';
  outputTargetLayer.style.opacity = '0';
  canvas.append(frameLayer, boundaryLayer, linkLayer, outputShellLayer, lineLayer, nodeLayer, detailLayer, integrateSplitLayer, integrateLabelLayer, labelLayer, outputSourceCarrierLayer, outputTargetLayer);
  const outputLayerOrderPass = [
    [outputShellLayer, lineLayer], [outputShellLayer, nodeLayer], [outputShellLayer, detailLayer],
    [outputShellLayer, integrateLabelLayer], [outputShellLayer, outputSourceCarrierLayer], [outputSourceCarrierLayer, outputTargetLayer]
  ].every(([lower, higher]) => Boolean(lower.compareDocumentPosition(higher) & Node.DOCUMENT_POSITION_FOLLOWING));
  if (!outputLayerOrderPass) throw new Error('OUTPUT_LAYER_ORDER_FAIL: shell, source, and detail layers are not ordered deterministically.');
  hero.prepend(canvas);

  const referenceFrame = integrateManifest.authority.referenceFrame || { left: 548, top: 34, width: 1000, height: 720 };
  const runtimeFrame = { left: 0, top: 0, width: 1, height: 1, scaleX: 1, scaleY: 1 };
  const refreshRuntimeFrame = () => {
    const box = canvas.getBoundingClientRect();
    runtimeFrame.left = box.left;
    runtimeFrame.top = box.top;
    runtimeFrame.width = Math.max(1, box.width);
    runtimeFrame.height = Math.max(1, box.height);
    runtimeFrame.scaleX = WIDTH / runtimeFrame.width;
    runtimeFrame.scaleY = HEIGHT / runtimeFrame.height;
  };
  refreshRuntimeFrame();
  const runtimePoint = (x, y) => ({
    x: (referenceFrame.left + x - runtimeFrame.left) * runtimeFrame.scaleX,
    y: (referenceFrame.top + y - runtimeFrame.top) * runtimeFrame.scaleY
  });
  const runtimeSize = (value, axis = 'x') => value * (axis === 'y' ? runtimeFrame.scaleY : runtimeFrame.scaleX);
  const outputGoldenSize = { width: outputManifest.authority.viewBox.width, height: outputManifest.authority.viewBox.height };
  const outputLayout = { x: 0, y: 0, scaleX: 1, scaleY: 1, paddingX: 0, paddingY: 0, artwork: null };
  const refreshOutputLayout = () => {
    const canvasBox = canvas.getBoundingClientRect();
    const artworkBox = motionRoot.getBoundingClientRect();
    const copyBox = hero.querySelector('.hero-copy')?.getBoundingClientRect();
    const statusBox = motionRoot.querySelector('.motion-phase-status')?.getBoundingClientRect();
    const legendBox = motionRoot.querySelector('.motion-legend')?.getBoundingClientRect();
    const canvasScaleX = Math.max(.001, canvasBox.width / WIDTH);
    const canvasScaleY = Math.max(.001, canvasBox.height / HEIGHT);
    const padding = Math.max(12, Math.min(32, Math.min(artworkBox.width, artworkBox.height) * .04));
    let left = artworkBox.left + padding;
    let right = artworkBox.right - padding;
    let top = artworkBox.top + padding;
    let bottom = artworkBox.bottom - padding;
    const copyOverlapsArtwork = copyBox && copyBox.right > artworkBox.left && copyBox.left < artworkBox.right && copyBox.bottom > artworkBox.top && copyBox.top < artworkBox.bottom;
    if (copyOverlapsArtwork) left = Math.max(left, copyBox.right + padding);
    if (statusBox && statusBox.bottom > top && statusBox.top < bottom) top = Math.max(top, statusBox.bottom + padding * .75);
    if (legendBox && legendBox.bottom > top && legendBox.top < bottom) bottom = Math.min(bottom, legendBox.top - padding * .75);
    if (right <= left) { left = artworkBox.left + padding; right = artworkBox.right - padding; }
    if (bottom <= top) { top = artworkBox.top + padding; bottom = artworkBox.bottom - padding; }
    const regionWidth = Math.max(1, right - left);
    const regionHeight = Math.max(1, bottom - top);
    const screenScale = Math.max(.01, Math.min(regionWidth / outputGoldenSize.width, regionHeight / outputGoldenSize.height) * .8);
    const compositionWidth = outputGoldenSize.width * screenScale;
    const compositionHeight = outputGoldenSize.height * screenScale;
    const compositionLeft = left + (regionWidth - compositionWidth) / 2;
    const compositionTop = top + (regionHeight - compositionHeight) / 2;
    outputLayout.x = (compositionLeft - canvasBox.left) / canvasScaleX;
    outputLayout.y = (compositionTop - canvasBox.top) / canvasScaleY;
    outputLayout.scaleX = screenScale / canvasScaleX;
    outputLayout.scaleY = screenScale / canvasScaleY;
    outputLayout.paddingX = padding;
    outputLayout.paddingY = padding;
    outputLayout.artwork = { left: artworkBox.left, top: artworkBox.top, right: artworkBox.right, bottom: artworkBox.bottom };
  };
  refreshOutputLayout();
  const outputFinalHoldStart = outputTransitionDuration / outputStageDuration;
  const outputPalette = outputManifest.palette || {};
  const outputColor = (value) => {
    if (value == null || value === 'none') return value;
    return outputPalette[value] || value;
  };
  const outputStyleFor = (target) => {
    const style = target?.style || {};
    return {
      fill: outputColor(style.fill || 'none'),
      stroke: outputColor(style.stroke || 'none'),
      strokeWidth: style.strokeWidth == null ? 1.05 : style.strokeWidth
    };
  };
  const outputLayerTransform = () => {
    refreshOutputLayout();
    const transform = `translate(${outputLayout.x.toFixed(2)} ${outputLayout.y.toFixed(2)}) scale(${outputLayout.scaleX.toFixed(5)} ${outputLayout.scaleY.toFixed(5)})`;
    outputShellLayer.setAttribute('transform', transform);
    outputTargetLayer.setAttribute('transform', transform);
  };
  let lastRenderedElapsed = 0;
  let rerenderAfterLayout = null;
  const refreshSceneLayout = () => {
    refreshRuntimeFrame();
    outputLayerTransform();
    if (rerenderAfterLayout) outputHoldSnapshot = null;
    rerenderAfterLayout?.(lastRenderedElapsed);
  };
  window.addEventListener('resize', refreshSceneLayout, { passive: true });
  if (typeof ResizeObserver === 'function') {
    const sceneResizeObserver = new ResizeObserver(refreshSceneLayout);
    sceneResizeObserver.observe(motionRoot);
  }
  const outputPathPoints = (d = '') => {
    const points = [];
    let current = [0, 0];
    const number = '-?\\d+(?:\\.\\d+)?';
    const commandPattern = /([MLHVAZ])([^MLHVAZ]*)/gi;
    let match;
    while ((match = commandPattern.exec(d))) {
      const command = match[1].toUpperCase();
      const values = [...match[2].matchAll(new RegExp(number, 'g'))].map((value) => Number(value[0]));
      if (command === 'M' || command === 'L') {
        for (let index = 0; index + 1 < values.length; index += 2) {
          current = [values[index], values[index + 1]];
          points.push([...current]);
        }
      } else if (command === 'H') {
        for (const value of values) { current = [value, current[1]]; points.push([...current]); }
      } else if (command === 'V') {
        for (const value of values) { current = [current[0], value]; points.push([...current]); }
      } else if (command === 'A') {
        for (let index = 0; index + 6 < values.length; index += 7) {
          current = [values[index + 5], values[index + 6]];
          points.push([...current]);
        }
      }
    }
    return points;
  };
  const resampleOutputPath = (points, count = 16) => {
    if (!points.length) return [];
    if (points.length === 1) return Array.from({ length: count }, () => [...points[0]]);
    const lengths = [0];
    for (let index = 1; index < points.length; index += 1) lengths.push(lengths[index - 1] + Math.hypot(points[index][0] - points[index - 1][0], points[index][1] - points[index - 1][1]));
    const total = Math.max(.001, lengths[lengths.length - 1]);
    return Array.from({ length: count }, (_, index) => {
      const distance = (total * index) / (count - 1);
      const segment = Math.max(1, lengths.findIndex((length) => length >= distance));
      const from = points[segment - 1] || points[0];
      const to = points[segment] || from;
      const span = Math.max(.001, (lengths[segment] ?? total) - (lengths[segment - 1] ?? 0));
      const amount = clamp((distance - (lengths[segment - 1] ?? 0)) / span);
      return [lerp(from[0], to[0], amount), lerp(from[1], to[1], amount)];
    });
  };
  const outputTargetLocalCenter = (target) => {
    const geometry = target.geometry || {};
    if (target.tag === 'rect') return { x: geometry.x + geometry.width / 2, y: geometry.y + geometry.height / 2 };
    if (target.tag === 'circle') return { x: geometry.cx, y: geometry.cy };
    if (target.id.includes('distribution-ring-')) {
      const ring = outputTargetObjects.get('output-v2-distribution-ring-base');
      return { x: ring.geometry.cx, y: ring.geometry.cy };
    }
    if (target.tag === 'text') return { x: geometry.x, y: geometry.y };
    const points = outputPathPoints(geometry.d);
    if (!points.length) return { x: 0, y: 0 };
    return {
      x: (Math.min(...points.map(([x]) => x)) + Math.max(...points.map(([x]) => x))) / 2,
      y: (Math.min(...points.map(([, y]) => y)) + Math.max(...points.map(([, y]) => y))) / 2
    };
  };
  const outputTargetShapePoints = (target) => {
    const geometry = target.geometry || {};
    const scaleX = outputLayout.scaleX;
    const scaleY = outputLayout.scaleY;
    if (target.tag === 'rect') return roundedRectPoints(geometry.width * scaleX, geometry.height * scaleY, (geometry.rx || 2) * scaleX);
    if (target.tag === 'circle') return ellipsePoints(geometry.r * scaleX, geometry.r * scaleY);
    if (target.id.includes('distribution-ring-') && target.id !== 'output-v2-distribution-ring-base') {
      const ringRadius = 42;
      const points = outputPathPoints(geometry.d);
      const ring = outputTargetObjects.get('output-v2-distribution-ring-base');
      const center = { x: ring.geometry.cx, y: ring.geometry.cy };
      const start = points[0] || [center.x, center.y - ringRadius];
      const end = points[points.length - 1] || start;
      const startAngle = Math.atan2(start[1] - center.y, start[0] - center.x);
      let endAngle = Math.atan2(end[1] - center.y, end[0] - center.x);
      while (endAngle <= startAngle) endAngle += Math.PI * 2;
      const thickness = Number(target.style?.strokeWidth || 12);
      return arcPointsAniso(ringRadius * scaleX, ringRadius * scaleY, startAngle, endAngle, Math.max(1, ringRadius - thickness) * scaleX, Math.max(1, ringRadius - thickness) * scaleY);
    }
    const points = outputPathPoints(geometry.d);
    if (points.length >= 2) {
      const center = outputTargetLocalCenter(target);
      return resampleOutputPath(points, 16).map(([x, y]) => [(x - center.x) * scaleX, (y - center.y) * scaleY]);
    }
    return roundedRectPoints(10 * scaleX, 5 * scaleY, 1 * scaleX);
  };
  const outputTargetElementFor = (target) => {
    const wrapper = group('immersive-output-target-wrapper');
    wrapper.dataset.outputTargetId = target.id;
    const style = target.style || {};
    const element = svgElement(target.tag || 'path', ['immersive-output-target', style.class].filter(Boolean).join(' '), { 'data-output-target-id': target.id });
    const geometry = target.geometry || {};
    if (target.tag === 'rect') ['x', 'y', 'width', 'height', 'rx'].forEach((key) => { if (geometry[key] != null) element.setAttribute(key, String(geometry[key])); });
    if (target.tag === 'circle') ['cx', 'cy', 'r'].forEach((key) => { if (geometry[key] != null) element.setAttribute(key, String(geometry[key])); });
    if (target.tag === 'path') element.setAttribute('d', geometry.d || '');
    if (target.tag === 'text') {
      ['x', 'y'].forEach((key) => { if (geometry[key] != null) element.setAttribute(key, String(geometry[key])); });
      element.textContent = target.text || '';
    }
    element.setAttribute('fill', outputColor(style.fill || 'none'));
    element.setAttribute('stroke', outputColor(style.stroke || 'none'));
    if (style.strokeWidth != null) element.setAttribute('stroke-width', String(style.strokeWidth));
    if (target.tag === 'path') {
      element.setAttribute('stroke-linecap', 'round');
      element.setAttribute('stroke-linejoin', 'round');
    }
    if (target.tag === 'text') {
      const font = style.font || '';
      element.setAttribute('font-family', font.includes('Cormorant') ? 'Cormorant Garamond, Georgia, serif' : 'Inter, Arial, sans-serif');
      const fontSize = font.match(/(\d+(?:\.\d+)?)px/);
      const fontWeight = font.match(/\b(400|500|600|700)\b/);
      if (fontSize) element.setAttribute('font-size', fontSize[1]);
      if (fontWeight) element.setAttribute('font-weight', fontWeight[1]);
      if (style.class?.includes('system-label')) element.setAttribute('letter-spacing', '.1em');
      else if (style.class?.includes('metric-label')) element.setAttribute('letter-spacing', '.08em');
      else if (style.class?.includes('chart-label')) element.setAttribute('letter-spacing', '.04em');
      else if (style.class?.includes('panel-title')) element.setAttribute('letter-spacing', '.01em');
      if (style.class?.includes('system-label')) element.setAttribute('text-anchor', /overview-detail|variance-eyebrow|trends-eyebrow/.test(target.id) ? 'end' : 'middle');
    }
    element.style.visibility = 'hidden';
    element.style.opacity = '0';
    wrapper.append(element);
    (outputShellTargetIds.has(target.id) ? outputShellLayer : outputTargetLayer).append(wrapper);
    return { target, wrapper, element };
  };
  const outputTargetElements = new Map(outputManifest.objects.map((target) => [target.id, outputTargetElementFor(target)]));
  const outputSourceCarrierElements = new Map([
    ['trends-bar-05', { sourceId: 'trends-bar-05', targetId: 'output-v2-trends-bar-oct', element: svgElement('path', 'immersive-output-source-carrier', { 'data-output-source-id': 'trends-bar-05' }) }]
  ]);
  outputSourceCarrierElements.forEach(({ element }) => {
    element.style.visibility = 'hidden';
    element.style.opacity = '0';
    outputSourceCarrierLayer.append(element);
  });
  const outputActions = outputChoreography.stages.flatMap((stage) => (stage.sequence || []).map((action) => ({ ...action, stageId: stage.id })));
  const outputActionsByTarget = new Map();
  outputActions.forEach((action) => (action.targetIds || []).forEach((targetId) => {
    const actions = outputActionsByTarget.get(targetId) || [];
    actions.push(action);
    outputActionsByTarget.set(targetId, actions);
  }));
  const outputPersistentTargetIds = new Set(outputChoreography.persistentLabels.map(({ targetId }) => targetId));
  const outputActionForTarget = (targetId) => {
    const candidates = outputActionsByTarget.get(targetId) || [];
    if (!candidates.length || outputPersistentTargetIds.has(targetId)) return null;
    if (outputShellTargetIds.has(targetId)) return candidates.find((action) => action.handoff) || candidates[0];
    return candidates[candidates.length - 1];
  };
  const outputTargetWindowFor = (targetId) => {
    const action = outputActionForTarget(targetId);
    if (!action) return null;
    const actionTargets = action.targetIds || [];
    const targetIndex = Math.max(0, actionTargets.indexOf(targetId));
    const duration = action.windowMs[1] - action.windowMs[0];
    const stagger = action.operation?.includes('stagger') ? Math.min(42, duration / Math.max(1, actionTargets.length)) : 0;
    const start = action.windowMs[0] + targetIndex * stagger;
    return { action, start, end: Math.max(start + 1, action.windowMs[1]) };
  };
  const outputStageForElapsed = (elapsedMs) => {
    let current = outputChoreography.stages[0];
    outputChoreography.stages.forEach((stage) => { if (elapsedMs >= stage.elapsedMs[0]) current = stage; });
    return current;
  };
  const outputCanvasPointForTarget = (target) => {
    const center = outputTargetLocalCenter(target);
    return { x: outputLayout.x + center.x * outputLayout.scaleX, y: outputLayout.y + center.y * outputLayout.scaleY };
  };
  const outputCanvasPathPointsForTarget = (target, count = 6) => resampleOutputPath(outputPathPoints(target?.geometry?.d), count).map(([x, y]) => ({
    x: outputLayout.x + x * outputLayout.scaleX,
    y: outputLayout.y + y * outputLayout.scaleY
  }));
  const outputCarrierTargetByNode = new Map([
    [0, 'output-v2-overview-divider-1'], [1, 'output-v2-overview-divider-2'], [2, 'output-v2-overview-margin-value'], [3, 'output-v2-frame'],
    [4, 'output-v2-frame'], [6, 'output-v2-panel-overview'], [8, 'output-v2-panel-distribution'], [10, 'output-v2-panel-performance'],
    [30, 'output-v2-panel-overview'], [32, 'output-v2-panel-insights'], [38, 'output-v2-panel-performance'], [40, 'output-v2-panel-performance'],
    [42, 'output-v2-panel-insights'], [44, 'output-v2-panel-trends'], [46, 'output-v2-panel-trends'], [48, 'output-v2-frame'], [49, 'output-v2-panel-variance'],
    [12, 'output-v2-performance-point-1'], [13, 'output-v2-performance-point-2'], [14, 'output-v2-performance-point-3'], [15, 'output-v2-performance-point-4'],
    [16, 'output-v2-performance-point-5'], [17, 'output-v2-performance-point-6'], [18, 'output-v2-trends-bar-jan'], [19, 'output-v2-trends-bar-apr'],
    [20, 'output-v2-trends-bar-jul'], [21, 'output-v2-trends-bar-oct'], [22, 'output-v2-insights-dot-1'], [23, 'output-v2-insights-row-1'],
    [24, 'output-v2-insights-dot-2'], [25, 'output-v2-insights-row-2'], [26, 'output-v2-insights-dot-3'], [27, 'output-v2-insights-row-3'],
    [28, 'output-v2-insights-row-3'], [29, 'output-v2-insights-row-3'], [34, 'output-v2-distribution-ring-base'], [35, 'output-v2-distribution-ring-navy'],
    [36, 'output-v2-distribution-ring-sand'], [37, 'output-v2-distribution-ring-base']
  ]);
  const outputPanelCarrierByNode = new Map([
    [4, 'output-v2-frame'], [6, 'output-v2-panel-overview'], [8, 'output-v2-panel-distribution'],
    [10, 'output-v2-panel-performance'], [32, 'output-v2-panel-insights'], [44, 'output-v2-panel-trends'], [49, 'output-v2-panel-variance']
  ]);
  const nodeSourceByIndex = new Map([...outputSourceObjects.entries()]
    .filter(([, source]) => source.runtime?.family === 'nodeElements' && source.runtime.part === 'shape')
    .map(([sourceId, source]) => [source.runtime.index, sourceId]));
  const outputNodeTargetFor = (node) => outputCarrierTargetByNode.get(node.index) || outputSourceObjects.get(nodeSourceByIndex.get(node.index))?.disposition?.targetIds?.[0] || null;
  const outputTargetReveal = (target, elapsedMs) => {
    if (outputPersistentTargetIds.has(target.id)) return 0;
    if (elapsedMs >= outputTransitionDuration) return 1;
    const window = outputTargetWindowFor(target.id);
    if (!window || elapsedMs < window.start) return 0;
    const revealStart = outputShellTargetIds.has(target.id) ? window.start + (window.end - window.start) * .45 : window.start;
    return easeOut(clamp((elapsedMs - revealStart) / Math.max(1, window.end - revealStart)));
  };
  const outputSourceAnchor = (sourceId, poses) => {
    const source = outputSourceObjects.get(sourceId);
    if (!source) return { x: outputLayout.x, y: outputLayout.y };
    const runtime = source.runtime || {};
    if (runtime.family === 'nodeElements') return poses[runtime.index]?.position || targetCenter(targetFor(sourceId));
    if (runtime.family === 'lineTrack') {
      const points = integratePerformanceNodeIndices.map((index) => poses[index]?.position).filter(Boolean);
      if (points.length) return points.reduce((sum, point) => ({ x: sum.x + point.x / points.length, y: sum.y + point.y / points.length }), { x: 0, y: 0 });
    }
    if (runtime.family === 'networkElements') {
      const edge = networkElements[runtime.index];
      if (edge) return pointLerp(poses[edge.from]?.position || targetCenter(targetFor(sourceId)), poses[edge.to]?.position || targetCenter(targetFor(sourceId)), .5);
    }
    if (runtime.family === 'integrateLabelElements') {
      const label = integrateLabelElements.find(({ target }) => target.id === runtime.targetId)?.label;
      const x = Number(label?.getAttribute('x'));
      const y = Number(label?.getAttribute('y'));
      if (Number.isFinite(x) && Number.isFinite(y)) return { x, y };
    }
    return targetCenter(targetFor(runtime.targetId || sourceId));
  };
  const outputTargetAnchor = (target, poses) => {
    const sourceIds = outputTargetOwners.get(target.id)?.sourceIds || [];
    const anchors = sourceIds.map((sourceId) => outputSourceAnchor(sourceId, poses)).filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
    if (!anchors.length) return outputCanvasPointForTarget(target);
    return anchors.reduce((sum, point) => ({ x: sum.x + point.x / anchors.length, y: sum.y + point.y / anchors.length }), { x: 0, y: 0 });
  };
  const outputViewportContainmentGate = (elapsedMs) => {
    if (elapsedMs < outputTransitionDuration) {
      motionRoot.dataset.integrateOutputG5Viewport = 'PENDING';
      return;
    }
    refreshOutputLayout();
    const artwork = outputLayout.artwork || motionRoot.getBoundingClientRect();
    const safe = { left: artwork.left + outputLayout.paddingX, top: artwork.top + outputLayout.paddingY, right: artwork.right - outputLayout.paddingX, bottom: artwork.bottom - outputLayout.paddingY };
    let pass = true;
    outputTargetElements.forEach(({ target, element }) => {
      const isPersistent = outputPersistentTargetIds.has(target.id);
      if (isPersistent) return;
      const box = element.getBoundingClientRect();
      if (!box.width && !box.height) pass = false;
      if (box.left < safe.left - .5 || box.top < safe.top - .5 || box.right > safe.right + .5 || box.bottom > safe.bottom + .5) pass = false;
    });
    outputChoreography.persistentLabels.forEach(({ sourceId }) => {
      const label = integrateLabelElements.find(({ target }) => target.id === sourceId)?.label;
      const box = label?.getBoundingClientRect();
      if (!box || (!box.width && !box.height)) pass = false;
      if (box && (box.left < safe.left - .5 || box.top < safe.top - .5 || box.right > safe.right + .5 || box.bottom > safe.bottom + .5)) pass = false;
    });
    const frame = outputTargetElements.get('output-v2-frame')?.element?.getBoundingClientRect();
    if (!frame || frame.left < safe.left - .5 || frame.top < safe.top - .5 || frame.right > safe.right + .5 || frame.bottom > safe.bottom + .5) pass = false;
    motionRoot.dataset.integrateOutputG5Viewport = pass ? 'PASS' : 'FAIL';
    if (!pass) throw new Error('G5_VIEWPORT_CONTAINMENT_FAIL: Golden v2 extends outside the safe hero artwork area.');
  };
  const visibleTargetElement = (targetId) => Number(outputTargetElements.get(targetId)?.element.style.opacity || 0) > .01;
  const outputNodeVisibleForSource = (sourceId) => {
    const runtime = outputSourceObjects.get(sourceId)?.runtime;
    return runtime?.family === 'nodeElements' && Number(nodeElements[runtime.index]?.element.style.opacity || 0) > .01;
  };
  const outputLiveSourceVisible = (sourceId) => {
    const carrier = outputSourceCarrierElements.get(sourceId)?.element;
    if (carrier) return Number(carrier.style.opacity || 0) > .01 && carrier.style.visibility !== 'hidden';
    const runtime = outputSourceObjects.get(sourceId)?.runtime;
    if (!runtime) return false;
    if (runtime.family === 'nodeElements') return outputNodeVisibleForSource(sourceId);
    if (runtime.family === 'lineTrack') return Number(lineTrack.path.style.opacity || 0) > .01;
    if (runtime.family === 'networkElements') return Number(networkElements[runtime.index]?.path.style.opacity || 0) > .01;
    if (runtime.family === 'roleFrameElements') return Number(roleFrameElements.find(({ runtimeId }) => runtimeId === runtime.runtimeId)?.path.style.opacity || 0) > .01;
    if (runtime.family === 'integrateLabelElements') return Number(integrateLabelElements.find(({ target }) => target.id === runtime.targetId)?.label.style.opacity || 0) > .01;
    if (runtime.family === 'integrateSplitElements') return Number(integrateSplitElements.find(({ target }) => target.id === runtime.targetId)?.path.style.opacity || 0) > .01;
    return false;
  };
  const outputLayeringGateState = { C1: false, C2: false, C3: false, C3Handoff: false, C4: false, C6: false };
  const resetOutputLayeringGateState = () => Object.keys(outputLayeringGateState).forEach((key) => { outputLayeringGateState[key] = false; });
  const outputGateState = { G1: false, G2: false, G3: false, G4: false, G5: false, G6: false, G7: false };
  const resetOutputGateState = () => Object.keys(outputGateState).forEach((key) => { outputGateState[key] = false; });
  let outputHoldSnapshot = null;
  const outputRuntimeGates = (phase, poses) => {
    if (phase.index === 6) {
      const pass = phase.progress >= .99 && outputTargetElements.size === 113 && [...outputTargetElements.values()].every(({ element }) => Number(element.style.opacity || 0) === 0);
      motionRoot.dataset.integrateOutputG0 = pass ? 'PASS' : 'PENDING';
      motionRoot.dataset.integrateOutputLayerOrder = outputLayerOrderPass ? 'PASS' : 'FAIL';
      resetOutputLayeringGateState();
      motionRoot.dataset.integrateOutputLayerC1 = 'PENDING';
      motionRoot.dataset.integrateOutputLayerC2 = 'PENDING';
      motionRoot.dataset.integrateOutputLayerC3 = 'PENDING';
      motionRoot.dataset.integrateOutputLayerC3Handoff = 'PENDING';
      motionRoot.dataset.integrateOutputLayerC4 = 'PENDING';
      motionRoot.dataset.integrateOutputLayerC6 = 'PENDING';
      resetOutputGateState();
      motionRoot.dataset.integrateOutputG1 = 'PENDING';
      motionRoot.dataset.integrateOutputG2 = 'PENDING';
      motionRoot.dataset.integrateOutputG3 = 'PENDING';
      motionRoot.dataset.integrateOutputG4 = 'PENDING';
      motionRoot.dataset.integrateOutputG5 = 'PENDING';
      motionRoot.dataset.integrateOutputG6 = 'PENDING';
      motionRoot.dataset.integrateOutputG7 = 'PENDING';
      motionRoot.dataset.integrateOutputG8 = 'PENDING';
      outputHoldSnapshot = null;
      return;
    }
    if (phase.index < 7) return;
    const elapsedMs = phase.progress * outputStageDuration;
    outputViewportContainmentGate(elapsedMs);
    const persistentLabel = (sourceId) => outputChoreography.persistentLabels.find((label) => label.sourceId === sourceId);
    if (!outputLayeringGateState.C1 && elapsedMs >= 1650 && elapsedMs < 2000) {
      const futureSources = [
        'label-distribution', 'distribution-ring-base', 'distribution-arc-navy', 'distribution-arc-sand',
        'label-performance', 'performance-polyline', 'performance-point-01', 'performance-point-02', 'performance-point-03', 'performance-point-04', 'performance-point-05', 'performance-point-06',
        'label-trends', 'trends-bar-01', 'trends-bar-02', 'trends-bar-03', 'trends-bar-04', 'trends-bar-05',
        'label-insights', 'insights-line-01', 'insights-line-02', 'insights-line-03', 'insights-line-04', 'insights-dot-01', 'insights-dot-02', 'insights-dot-03', 'insights-dot-04',
        'support-rail-03', 'support-rail-04', 'support-rail-05', 'support-rail-06', 'support-rail-07', 'support-rail-08'
      ];
      const pass = outputLayerOrderPass && futureSources.every(outputLiveSourceVisible);
      motionRoot.dataset.integrateOutputLayerC1 = pass ? 'PASS' : 'FAIL';
      if (!pass) throw new Error('OUTPUT_LAYER_C1_SOURCE_VISIBILITY_FAIL: future Integrate modules were masked after the Overview shell handoff.');
      outputLayeringGateState.C1 = true;
    }
    if (!outputLayeringGateState.C2 && elapsedMs >= 2200 && elapsedMs < 2580) {
      const pass = outputLiveSourceVisible('label-distribution') && (outputLiveSourceVisible('distribution-ring-base') || visibleTargetElement('output-v2-distribution-ring-base'));
      motionRoot.dataset.integrateOutputLayerC2 = pass ? 'PASS' : 'FAIL';
      if (!pass) throw new Error('OUTPUT_LAYER_C2_DISTRIBUTION_CONTINUITY_FAIL: Distribution lost source visibility during travel or handoff.');
      outputLayeringGateState.C2 = true;
    }
    if (!outputLayeringGateState.C3 && elapsedMs >= 2900 && elapsedMs < 3050) {
      const points = ['01', '02', '03', '04', '05', '06'];
      const targetPoints = points.map((index) => `output-v2-performance-point-${Number(index)}`);
      const pass = outputLiveSourceVisible('label-performance') && outputLiveSourceVisible('performance-polyline') && points.every((index) => outputLiveSourceVisible(`performance-point-${index}`)) && !visibleTargetElement('output-v2-performance-line') && targetPoints.every((id) => !visibleTargetElement(id));
      motionRoot.dataset.integrateOutputLayerC3 = pass ? 'PASS' : 'FAIL';
      if (!pass) throw new Error('OUTPUT_LAYER_C3_PERFORMANCE_SOURCE_FAIL: Performance source graph was hidden or duplicated before C3.');
      outputLayeringGateState.C3 = true;
    }
    if (!outputLayeringGateState.C3Handoff && elapsedMs >= 3830 && elapsedMs < 4000) {
      const sourceLine = outputLiveSourceVisible('performance-polyline');
      const targetLine = visibleTargetElement('output-v2-performance-line');
      const sourcePoints = ['01', '02', '03', '04', '05', '06'].some((index) => outputLiveSourceVisible(`performance-point-${index}`));
      const targetPoints = [1, 2, 3, 4, 5, 6].some((index) => visibleTargetElement(`output-v2-performance-point-${index}`));
      const pass = !(sourceLine && targetLine) && !(sourcePoints && targetPoints);
      motionRoot.dataset.integrateOutputLayerC3Handoff = pass ? 'PASS' : 'FAIL';
      if (!pass) throw new Error('OUTPUT_LAYER_C3_DUPLICATE_GRAPH_FAIL: Performance source and target graphs remained simultaneously visible after handoff.');
      outputLayeringGateState.C3Handoff = true;
    }
    if (!outputLayeringGateState.C4 && elapsedMs >= 4400 && elapsedMs < 4600) {
      const sourceBars = ['01', '02', '03', '04'].every((index) => outputLiveSourceVisible(`trends-bar-${index}`));
      const pass = outputLiveSourceVisible('label-trends') && sourceBars && outputLiveSourceVisible('trends-bar-05');
      motionRoot.dataset.integrateOutputLayerC4 = pass ? 'PASS' : 'FAIL';
      if (!pass) throw new Error('OUTPUT_LAYER_C4_TRENDS_SOURCE_FAIL: Trends source bars were hidden before C4.');
      outputLayeringGateState.C4 = true;
    }
    if (!outputLayeringGateState.C6 && elapsedMs >= 6900 && elapsedMs < 7100) {
      const sourceLines = ['01', '02', '03', '04'].every((index) => outputLiveSourceVisible(`insights-line-${index}`));
      const sourceDots = ['01', '02', '03', '04'].every((index) => outputLiveSourceVisible(`insights-dot-${index}`));
      const pass = outputLiveSourceVisible('label-insights') && sourceLines && sourceDots;
      motionRoot.dataset.integrateOutputLayerC6 = pass ? 'PASS' : 'FAIL';
      if (!pass) throw new Error('OUTPUT_LAYER_C6_INSIGHTS_SOURCE_FAIL: Insights geometry was hidden before C6.');
      outputLayeringGateState.C6 = true;
    }
    if (!outputGateState.G1 && elapsedMs >= 1650 && elapsedMs < 2000) {
      const label = persistentLabel('label-overview-system-detail');
      const pass = !!label && Number(integrateLabelElements.find(({ target }) => target.id === label.sourceId)?.label.style.opacity || 0) > .01 && visibleTargetElement('output-v2-panel-overview') && !visibleTargetElement('output-v2-panel-distribution');
      motionRoot.dataset.integrateOutputG1 = pass ? 'PASS' : 'FAIL';
      if (!pass) throw new Error('G1_OVERVIEW_CONTINUITY_FAIL: Overview label/panel timing is not continuous.');
      outputGateState.G1 = true;
    }
    if (!outputGateState.G2 && elapsedMs >= 2500 && elapsedMs < 3050) {
      const legends = [...outputTargetElements.keys()].filter((id) => id.startsWith('output-v2-distribution-legend-'));
      const pass = visibleTargetElement('output-v2-distribution-ring-base') && visibleTargetElement('output-v2-distribution-ring-navy') && visibleTargetElement('output-v2-distribution-ring-sand') && legends.every((id) => !visibleTargetElement(id));
      motionRoot.dataset.integrateOutputG2 = pass ? 'PASS' : 'FAIL';
      if (!pass) throw new Error('G2_DISTRIBUTION_ORDER_FAIL: Distribution legend appeared before the ring settled.');
      outputGateState.G2 = true;
    }
    if (!outputGateState.G3 && elapsedMs >= 3900 && elapsedMs < 4600) {
      const existing = [1, 2, 3, 4, 5, 6].every((index) => visibleTargetElement(`output-v2-performance-point-${index}`));
      const earlyExtra = elapsedMs < 3830 && [7, 8, 9, 10].some((index) => visibleTargetElement(`output-v2-performance-point-${index}`));
      const pass = existing && !earlyExtra && !visibleTargetElement('output-v2-performance-point-8') && !visibleTargetElement('output-v2-performance-point-9') && !visibleTargetElement('output-v2-performance-point-10');
      motionRoot.dataset.integrateOutputG3 = pass ? 'PASS' : 'FAIL';
      if (!pass) throw new Error('G3_PERFORMANCE_EXPANSION_FAIL: Performance points were created before the established line or out of order.');
      outputGateState.G3 = true;
    }
    if (!outputGateState.G4 && elapsedMs >= 5570 && elapsedMs < 5800) {
      const pass = ['jan', 'apr', 'jul', 'oct'].every((slot) => visibleTargetElement(`output-v2-trends-bar-${slot}`)) && !JSON.stringify(outputManifest).match(/Q[1-5]/) && outputNodeVisibleForSource('trends-bar-04') && Number(outputSourceCarrierElements.get('trends-bar-05')?.element.style.opacity || 0) > .01;
      motionRoot.dataset.integrateOutputG4 = pass ? 'PASS' : 'FAIL';
      if (!pass) throw new Error('G4_TRENDS_MERGE_FAIL: Trends does not show the exact four checkpoints and OCT merge.');
      outputGateState.G4 = true;
    }
    if (!outputGateState.G5 && elapsedMs >= 6350 && elapsedMs < 7100) {
      const pass = visibleTargetElement('output-v2-panel-variance') && visibleTargetElement('output-v2-variance-bar-base');
      motionRoot.dataset.integrateOutputG5 = pass ? 'PASS' : 'FAIL';
      if (!pass) throw new Error('G5_VARIANCE_PROGRESS_FAIL: Variance did not resolve progressively from its source material.');
      outputGateState.G5 = true;
    }
    if (!outputGateState.G6 && elapsedMs >= 8070 && elapsedMs < 8250) {
      const pass = visibleTargetElement('output-v2-insights-row-3') && outputNodeVisibleForSource('insights-line-04') && outputNodeVisibleForSource('insights-dot-04');
      motionRoot.dataset.integrateOutputG6 = pass ? 'PASS' : 'FAIL';
      if (!pass) throw new Error('G6_INSIGHTS_CONSOLIDATION_FAIL: Insights row 3 or its fourth-source merge is not visible.');
      outputGateState.G6 = true;
    }
    if (!outputGateState.G7 && elapsedMs >= 9300 && elapsedMs < outputTransitionDuration) {
      const nodeIds = ['source', 'relate', 'model', 'review', 'use'].map((slot) => `output-v2-system-node-${slot}`);
      const boxes = nodeIds.map((id) => outputTargetElements.get(id)?.element.getBoundingClientRect()).filter(Boolean);
      const pass = boxes.length === 5 && boxes.every((box) => Number(outputTargetElements.get(nodeIds[boxes.indexOf(box)])?.element.style.opacity || 0) > .01) && boxes.every((box, index) => index === 0 || box.left > boxes[index - 1].left);
      motionRoot.dataset.integrateOutputG7 = pass ? 'PASS' : 'FAIL';
      if (!pass) throw new Error('G7_SYSTEM_ORDER_FAIL: System nodes are not resolving left-to-right.');
      outputGateState.G7 = true;
    }
    if (elapsedMs >= outputTransitionDuration) {
      const visibleIds = new Set([...outputTargetElements.entries()].filter(([, value]) => Number(value.element.style.opacity || 0) > .99).map(([id]) => id));
      outputChoreography.persistentLabels.forEach(({ sourceId, targetId }) => {
        const label = integrateLabelElements.find(({ target }) => target.id === sourceId)?.label;
        if (label && Number(label.style.opacity || 0) > .99) visibleIds.add(targetId);
      });
      const allTargetsVisible = visibleIds.size === outputManifest.objects.length && outputManifest.objects.every((target) => visibleIds.has(target.id));
      const noSources = nodeElements.every((node) => Number(node.element.style.opacity || 0) <= .01) && (!outputSourceCarrierElements || [...outputSourceCarrierElements.values()].every(({ element }) => Number(element.style.opacity || 0) <= .01));
      const priorGatesPassed = Object.values(outputGateState).every(Boolean);
      const layeringGatesPassed = Object.values(outputLayeringGateState).every(Boolean);
      const pass = allTargetsVisible && noSources && priorGatesPassed && layeringGatesPassed && motionRoot.dataset.integrateOutputLayerOrder === 'PASS' && motionRoot.dataset.integrateOutputG5Viewport === 'PASS' && phase.progress >= outputFinalHoldStart;
      motionRoot.dataset.integrateOutputG8 = pass ? 'PASS' : 'FAIL';
      if (!pass) throw new Error('G8_OUTPUT_HOLD_FAIL: Output v2 is not exact, source remnants remain, or the hold is not active.');
      const snapshot = JSON.stringify({
        shell: outputShellLayer.getAttribute('transform'),
        layer: outputTargetLayer.getAttribute('transform'),
        targets: [...outputTargetElements.entries()].map(([id, value]) => [id, value.wrapper.getAttribute('transform'), value.element.outerHTML, value.element.style.cssText]),
        labels: outputChoreography.persistentLabels.map(({ sourceId }) => { const label = integrateLabelElements.find(({ target }) => target.id === sourceId)?.label; return [sourceId, label?.outerHTML, label?.style.cssText]; })
      });
      const layoutBox = motionRoot.getBoundingClientRect();
      const holdLayoutSignature = `${innerWidth}x${innerHeight}|${layoutBox.width.toFixed(2)}x${layoutBox.height.toFixed(2)}|${outputTargetLayer.getAttribute('transform')}`;
      if (outputHoldSnapshot && outputHoldSnapshot.layout === holdLayoutSignature && outputHoldSnapshot.snapshot !== snapshot) throw new Error('G8_OUTPUT_HOLD_FAIL: final Output changed during the frozen hold.');
      outputHoldSnapshot = { layout: holdLayoutSignature, snapshot };
    } else {
      outputHoldSnapshot = null;
    }
  };
  const targetReferenceEndpoints = (target) => {
    if (target?.from && target?.to) return [target.from, target.to];
    if (Number.isFinite(target?.x1) && Number.isFinite(target?.y1) && Number.isFinite(target?.x2) && Number.isFinite(target?.y2)) return [[target.x1, target.y1], [target.x2, target.y2]];
    return null;
  };
  const targetCenter = (target) => {
    if (!target) return { x: 0, y: 0 };
    if (target.kind === 'tile') return runtimePoint(target.x + target.width / 2, target.y + target.height / 2);
    if (target.kind === 'bar') return runtimePoint(target.x, (target.topY + target.baselineY) / 2);
    if (target.kind === 'point' || target.kind === 'dot' || target.kind === 'circle' || target.kind === 'arc') return runtimePoint(target.cx, target.cy);
    if (target.kind === 'polyline' && target.points?.length) return runtimePoint(target.points[0][0], target.points[0][1]);
    const endpoints = targetReferenceEndpoints(target);
    if (endpoints) return runtimePoint((endpoints[0][0] + endpoints[1][0]) / 2, (endpoints[0][1] + endpoints[1][1]) / 2);
    return runtimePoint(target.x || 0, target.y || 0);
  };
  const targetShapePoints = (target) => {
    if (!target) return circlePoints(2.5);
    if (target.kind === 'tile') return roundedRectPoints(runtimeSize(target.width), runtimeSize(target.height, 'y'), runtimeSize(4, 'x'));
    if (target.kind === 'bar') return rectPoints(runtimeSize(target.width), runtimeSize(target.height, 'y'));
    if (target.kind === 'point' || target.kind === 'dot') return ellipsePoints(runtimeSize(target.radius), runtimeSize(target.radius, 'y'));
    if (target.kind === 'circle') return ellipsePoints(runtimeSize(target.radius), runtimeSize(target.radius, 'y'));
    if (target.kind === 'arc') return arcPointsAniso(runtimeSize(target.radius), runtimeSize(target.radius, 'y'), target.startAngle, target.endAngle, runtimeSize(target.thickness), runtimeSize(target.thickness, 'y'));
    const endpoints = targetReferenceEndpoints(target);
    if (endpoints) {
      const center = targetCenter(target);
      const from = runtimePoint(endpoints[0][0], endpoints[0][1]);
      const to = runtimePoint(endpoints[1][0], endpoints[1][1]);
      const thickness = target.strokeWidth || 1.2;
      return segmentPoints([from.x - center.x, from.y - center.y], [to.x - center.x, to.y - center.y], runtimeSize(thickness, 'x'));
    }
    return circlePoints(2.5);
  };
  const targetStyle = (target) => {
    const className = target?.className || '';
    if (target?.kind === 'tile') return { fill: targetColor(target.style), stroke: targetColor('navy'), strokeWidth: 1.05 };
    if (target?.kind === 'bar') return { fill: targetColor(target.stroke || 'navy'), stroke: targetColor(target.stroke || 'navy'), strokeWidth: 1.05 };
    if (target?.kind === 'point' || target?.kind === 'dot') return { fill: targetColor(target.fill || 'navy'), stroke: targetColor(target.fill || 'navy'), strokeWidth: 1 };
    if (target?.kind === 'arc' || target?.kind === 'circle') return { fill: 'none', stroke: targetColor(target.stroke || 'slate'), strokeWidth: target.strokeWidth || 11 };
    if (target?.kind === 'polyline') return { fill: 'none', stroke: targetColor(target.stroke || 'navy'), strokeWidth: target.strokeWidth || 2 };
    if (className.includes('hairline')) return { fill: 'none', stroke: 'rgba(14,26,46,.18)', strokeWidth: 1 };
    if (className.includes('sand')) return { fill: 'none', stroke: targetColor('sand'), strokeWidth: 1.2 };
    return { fill: 'none', stroke: 'rgba(14,26,46,.35)', strokeWidth: 1.2 };
  };
  const targetShapeStyle = (target) => targetStyle(target);

  // Once the network starts becoming intentional, keep every local group in
  // the open right-hand field. Scatter/Attract can pass behind the title;
  // Connect/Cluster must remain readable as separate groups.
  const groupCenters = [
    [800, 205], [1080, 190], [1360, 205], [850, 500], [1150, 500]
  ];
  const localOffsets = [
    [-72, -38], [-26, -52], [22, -43], [68, -22], [-80, 5],
    [-30, 3], [20, 10], [66, 13], [-50, 42], [15, 40]
  ];
  const scattered = Array.from({ length: 50 }, (_, index) => ({
    x: 70 + ((index * 223 + (index % 4) * 31) % 1460),
    y: 104 + ((index * 137 + (index % 5) * 23) % 510)
  }));
  const groups = groupCenters.map(([x, y], groupIndex) => ({
    index: groupIndex,
    center: { x, y },
    members: Array.from({ length: 10 }, (_, index) => groupIndex * 10 + index),
    bounds: { x: x - 112, y: y - 86, width: 224, height: 172 }
  }));
  const clustered = Array.from({ length: 50 }, (_, index) => {
    const cluster = groups[Math.floor(index / 10)];
    const offset = localOffsets[index % 10];
    return { x: cluster.center.x + offset[0], y: cluster.center.y + offset[1] };
  });
  // Attract is an editorial ordering pass, not an early cluster. Keep the
  // material in five calm, readable lanes so the viewer sees alignment before
  // any group begins to condense. The row membership remains persistent and
  // becomes the corresponding local group in Connect/Cluster.
  const attractGrid = Array.from({ length: 50 }, (_, index) => {
    const row = Math.floor(index / 10);
    const column = index % 10;
    return {
      x: 660 + column * 86 + (row % 2 ? 8 : 0),
      y: 132 + row * 106 + (column % 2 ? 2 : 0)
    };
  });
  const aligned = clustered.map((point, index) => {
    const attractPoint = attractGrid[index];
    // A light directional pull hints at the eventual group without collapsing
    // the broad alignment field too early. Connect owns the decisive move.
    const groupPull = .24;
    return {
      x: lerp(attractPoint.x, point.x, groupPull),
      y: lerp(attractPoint.y, point.y, groupPull)
    };
  });

  const structureTargets = [];
  [18, 12, 8, 6, 4, 2].forEach((count, row) => {
    const gap = 48;
    const firstX = 1080 - ((count - 1) * gap) / 2;
    for (let index = 0; index < count; index += 1) {
      structureTargets.push({
        kind: 'tile', x: firstX + index * gap, y: 602 - row * 32,
        row, color: ['navy', 'paper', 'sand', 'navy', 'slate', 'paper'][((row * 5) + index) % 6]
      });
    }
  });

  const roles = integrateBridge.liveNodes.slice().sort((left, right) => left.index - right.index).map((node) => node.role);
  if (roles.length !== 50) throw new Error('Integrate source bridge must define all 50 live node roles.');
  const roleSlots = new Array(50).fill(0);
  const roleCounts = {};
  roles.forEach((role, index) => {
    roleSlots[index] = roleCounts[role] || 0;
    roleCounts[role] = (roleCounts[role] || 0) + 1;
  });
  const roleIndices = (role) => roles.map((value, index) => value === role ? index : -1).filter((index) => index >= 0);
  const performanceNodeIndices = [10, 11, 12, 13, 14, 15];
  const integratePerformanceNodeIndices = roleIndices('performance');
  const insightNodeIndices = roleIndices('insights');
  const overviewNodeIndices = roleIndices('overview');
  const coreAndOverviewNodeIndices = [...roleIndices('core'), ...overviewNodeIndices];

  const integratePerformanceTargets = integrateManifest.widgets.performance.points;
  const integratePerformancePolyline = integrateManifest.widgets.performance.polyline;
  const integratePerformanceLinePoints = integratePerformancePolyline.points;
  const integrateInsightDots = integrateManifest.widgets.insights.dots;
  const integrateInsightLines = integrateManifest.widgets.insights.lines;
  const integrateOverviewHairlines = integrateManifest.widgets.overviewSystemDetail.hairlines;
  const integrateOverviewRails = integrateManifest.widgets.overviewSystemDetail.rails;
  const integrateTrendBars = integrateManifest.widgets.trends.bars;
  const integrateDistributionRing = integrateManifest.widgets.distribution.ring;
  const integrateDistributionArcs = integrateManifest.widgets.distribution.accentArcs;
  const outputBars = [
    { x: 1270, y: 494, width: 20, height: 66, color: 'slate' },
    { x: 1310, y: 470, width: 20, height: 114, color: 'navy' },
    { x: 1350, y: 446, width: 20, height: 162, color: 'navy' },
    { x: 1390, y: 414, width: 20, height: 226, color: 'navy' },
    { x: 1430, y: 390, width: 20, height: 274, color: 'sand' },
    { x: 1470, y: 430, width: 20, height: 194, color: 'slate' }
  ];
  const outputLine = [
    [720, 492], [765, 454], [810, 470], [855, 420], [900, 378], [945, 398]
  ];
  const insightOutput = [
    [1010, 360], [1010, 405], [1010, 450], [1010, 495], [1010, 540], [1010, 585], [1010, 630], [1010, 675]
  ];
  const outputDonut = { x: 1340, y: 165 };
  const donutArcs = [
    { startAngle: -.5 * Math.PI, endAngle: -.03 * Math.PI, color: 'navy' },
    { startAngle: -.03 * Math.PI, endAngle: .42 * Math.PI, color: 'sand' },
    { startAngle: .42 * Math.PI, endAngle: .94 * Math.PI, color: 'slate' },
    { startAngle: .94 * Math.PI, endAngle: 1.5 * Math.PI, color: 'grid' }
  ];
  const overviewMetrics = [
    { x: 760, y: 258, width: 20, height: 2, color: 'grid' }, { x: 794, y: 258, width: 20, height: 2, color: 'grid' }, { x: 828, y: 258, width: 20, height: 2, color: 'sand' },
    { x: 875, y: 258, width: 20, height: 2, color: 'grid' }, { x: 909, y: 258, width: 20, height: 2, color: 'grid' }, { x: 943, y: 258, width: 20, height: 2, color: 'sand' },
    { x: 990, y: 258, width: 20, height: 2, color: 'grid' }, { x: 1024, y: 258, width: 20, height: 2, color: 'grid' }, { x: 1058, y: 258, width: 20, height: 2, color: 'sand' },
    { x: 790, y: 266, width: 90, height: 1.5, color: 'grid' }
  ];
  const overviewDetail = Array.from({ length: 18 }, (_, index) => ({
    x: 730 + (index % 6) * 42,
    y: 276 + Math.floor(index / 6) * 6,
    width: index % 3 === 0 ? 34 : 22,
    height: 2,
    color: index % 5 === 0 ? 'sand' : 'grid'
  }));
  const referenceBoxFor = (target) => {
    if (!target) return null;
    if (target.kind === 'tile') return { x: target.x, y: target.y, width: target.width, height: target.height };
    if (target.kind === 'bar') return { x: target.x - target.width / 2, y: target.topY, width: target.width, height: target.height };
    if (target.kind === 'point' || target.kind === 'dot' || target.kind === 'circle' || target.kind === 'arc') return { x: target.cx - target.radius, y: target.cy - target.radius, width: target.radius * 2, height: target.radius * 2 };
    if (target.kind === 'polyline' && target.points?.length) {
      const xs = target.points.map(([x]) => x); const ys = target.points.map(([, y]) => y);
      return { x: Math.min(...xs), y: Math.min(...ys), width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys) };
    }
    const from = target.from || [target.x1, target.y1];
    const to = target.to || [target.x2, target.y2];
    if (from.every(Number.isFinite) && to.every(Number.isFinite)) return { x: Math.min(from[0], to[0]), y: Math.min(from[1], to[1]), width: Math.abs(to[0] - from[0]), height: Math.abs(to[1] - from[1]) };
    if (Number.isFinite(target.x) && Number.isFinite(target.y)) return { x: target.x, y: target.y, width: 0, height: 0 };
    return null;
  };
  const referenceBoundsFor = (targets, padding = 0) => {
    const boxes = targets.map(referenceBoxFor).filter(Boolean);
    const minX = Math.min(...boxes.map(({ x }) => x));
    const minY = Math.min(...boxes.map(({ y }) => y));
    const maxX = Math.max(...boxes.map(({ x, width }) => x + width));
    const maxY = Math.max(...boxes.map(({ y, height }) => y + height));
    return { x: minX - padding, y: minY - padding, width: maxX - minX + padding * 2, height: maxY - minY + padding * 2 };
  };
  const integrateCoreReferenceTiles = integrateManifest.core.tiles;
  const integrateLanes = {
    trend: integrateTrendBars.map(({ x, topY, baselineY }) => ({ x, y: (topY + baselineY) / 2 })),
    performance: integratePerformanceTargets.map(({ cx, cy }) => ({ x: cx, y: cy })),
    distribution: [{ x: integrateDistributionRing.cx, y: integrateDistributionRing.cy }],
    insights: integrateInsightDots.map(({ cx, cy }) => ({ x: cx, y: cy })),
    overview: integrateOverviewHairlines.map(({ x1, y1, x2, y2 }) => ({ x: (x1 + x2) / 2, y: (y1 + y2) / 2 })),
    core: integrateCoreReferenceTiles.map(({ x, y, width, height }) => ({ x: x + width / 2, y: y + height / 2 }))
  };
  const integrateFrames = {
    trend: referenceBoundsFor(integrateTrendBars, 18),
    distribution: referenceBoundsFor([integrateDistributionRing, ...integrateDistributionArcs], 20),
    performance: referenceBoundsFor([integratePerformancePolyline, ...integratePerformanceTargets], 20),
    insights: referenceBoundsFor([...integrateInsightDots, ...integrateInsightLines], 20),
    overview: referenceBoundsFor([...integrateOverviewHairlines, ...integrateOverviewRails], 18)
  };
  const outputFrames = {
    overview: { x: 680, y: 130, width: 500, height: 180 },
    distribution: { x: 1200, y: 130, width: 300, height: 180 },
    performance: { x: 680, y: 360, width: 270, height: 250 },
    insights: { x: 970, y: 360, width: 250, height: 250 },
    trends: { x: 1240, y: 360, width: 260, height: 250 }
  };
  const integrateFrameSources = {
    trend: integrateFrames.trend,
    distribution: integrateFrames.distribution,
    performance: integrateFrames.performance,
    insights: integrateFrames.insights,
    overview: integrateFrames.overview
  };
  const integrateCoreContactReference = (() => {
    const centers = integrateCoreReferenceTiles.map(({ x, y, width, height }) => [x + width / 2, y + height / 2]);
    return {
      x: centers.reduce((sum, [x]) => sum + x, 0) / centers.length,
      y: centers.reduce((sum, [, y]) => sum + y, 0) / centers.length
    };
  })();

  const nodeSpecs = Array.from({ length: 50 }, (_, index) => {
    const role = roles[index];
    const slot = roleSlots[index];
    const structure = structureTargets[index];
    const integrate = primaryTargetFor(index) || structure;
    let output;
    if (role === 'trend') {
      output = { kind: 'bar', ...outputBars[slot], color: outputBars[slot].color };
    } else if (role === 'performance') {
      output = { kind: 'dot', x: outputLine[slot][0], y: outputLine[slot][1], radius: 3, color: 'navy' };
    } else if (role === 'distribution') {
      const arc = donutArcs[slot];
      output = { kind: 'arc', x: outputDonut.x, y: outputDonut.y, radius: 46, thickness: 12, ...arc };
    } else if (role === 'insights') {
      output = { kind: 'dot', x: insightOutput[slot][0], y: insightOutput[slot][1], radius: 4, color: 'sand' };
    } else if (role === 'overview') {
      output = { kind: 'metric', ...overviewMetrics[slot], color: overviewMetrics[slot].color || 'navy' };
    } else {
      const detail = overviewDetail[slot] || { x: 730 + (slot % 6) * 42, y: 276 + Math.floor(slot / 6) * 6, width: 22, height: 2, color: 'grid' };
      output = { kind: 'metric', ...detail, color: detail.color || 'grid' };
    }
    return {
      index,
      role,
      scatter: scattered[index],
      attract: attractGrid[index],
      align: aligned[index],
      cluster: clustered[index],
      structure,
      integrate,
      output,
      sourceColor: ['navy', 'paper', 'sand', 'slate'][index % 4]
    };
  });

  const nodeElements = nodeSpecs.map((spec) => {
    const element = group('immersive-node');
    const shape = svgElement('path', 'immersive-node-shape');
    const detail = svgElement('path', 'immersive-node-detail');
    element.dataset.liveNodeIndex = String(spec.index);
    element.dataset.integrateTarget = primaryTargetIdFor(spec.index) || '';
    element.append(shape, detail);
    nodeLayer.append(element);
    return { ...spec, element, shape, detail };
  });

  const integrateSplitElements = [];
  const integrateLabelElements = [];
  integrateBridge.liveNodes.forEach((bridgeNode) => {
    const primaryId = primaryTargetIdFor(bridgeNode.index);
    bridgeNode.targetRefs.forEach((targetId) => {
      const target = targetFor(targetId);
      if (!target || targetId === primaryId || target.kind === 'plus') return;
      if (target.kind === 'text') {
        const label = svgElement('text', 'immersive-integrate-label', { 'data-target-id': target.id });
        label.textContent = target.text;
        integrateLabelLayer.append(label);
        integrateLabelElements.push({ label, sourceIndex: bridgeNode.index, target });
        return;
      }
      const path = svgElement('path', 'immersive-integrate-split', { 'data-target-id': target.id });
      path.style.visibility = 'hidden';
      path.style.opacity = '0';
      integrateSplitLayer.append(path);
      integrateSplitElements.push({ path, sourceIndex: bridgeNode.index, target });
    });
  });

  const networkPairs = [];
  groups.forEach((cluster) => {
    cluster.members.forEach((member, index) => {
      if (index < cluster.members.length - 1) networkPairs.push([member, cluster.members[index + 1]]);
      if (index < cluster.members.length - 2 && index % 2 === 0) networkPairs.push([member, cluster.members[index + 2]]);
    });
  });
  const networkElements = networkPairs.map(([from, to], index) => {
    const path = svgElement('path', 'immersive-link');
    linkLayer.append(path);
    const runtimeId = `network-edge-${String(index).padStart(2, '0')}`;
    return { from, to, path, runtimeId, targetId: runtimeObjectTargetIds.get(runtimeId), crossGroup: Math.floor(from / 10) !== Math.floor(to / 10) };
  });

  const boundaryElements = groups.map((cluster, index) => {
    const path = svgElement('path', 'immersive-boundary');
    boundaryLayer.append(path);
    return { path, runtimeId: `cluster-boundary-${String(index).padStart(2, '0')}`, source: boundaryPoints(cluster.bounds), cluster };
  });

  const roleFrameElements = Object.entries(integrateFrames).map(([role, integrateFrame]) => {
    const path = svgElement('path', 'immersive-module-frame');
    frameLayer.append(path);
    const sourceGroup = groups[{ trend: 0, performance: 1, distribution: 2, insights: 3, overview: 4 }[role]];
    const outputFrame = outputFrames[role === 'trend' ? 'trends' : role];
    return { role, path, runtimeId: `role-frame-${role}`, source: boundaryPoints(integrateFrameSources[role]), integrate: boundaryPoints(integrateFrame), output: boundaryPoints(outputFrame), targetId: runtimeObjectTargetIds.get(`role-frame-${role}`) };
  });

  const lineTrack = { path: svgElement('path', 'immersive-line'), runtimeId: 'performance-line', targetId: runtimeObjectTargetIds.get('performance-line') };
  lineLayer.append(lineTrack.path);
  const insightTracks = integrateInsightLines.slice(0, 3).map((line, index) => {
    const path = svgElement('path', 'immersive-rail');
    lineLayer.append(path);
    const point = insightOutput[index];
    return {
      path,
      runtimeId: `insight-track-${String(index).padStart(2, '0')}`,
      source: [
        [clustered[16 + index].x, clustered[16 + index].y],
        [clustered[19 + index].x, clustered[19 + index].y]
      ],
      integrate: [[line.x1, line.y1], [line.x2, line.y2]],
      output: [[point[0], point[1]], [point[0] + 170, point[1]]]
    };
  });
  // Output's small process trace is a visible split from the Distribution
  // instrument. It starts at the existing donut source and extends into a
  // compact dependency chain only after Output begins.
  const outputFlowTargets = [[1228, 270], [1270, 270], [1312, 270], [1354, 270]];
  const outputFlowPath = svgElement('path', 'immersive-output-flow');
  const outputFlowNodes = outputFlowTargets.map(() => svgElement('circle', 'immersive-output-flow-node', { r: 3 }));
  const outputTracePaths = overviewNodeIndices.length >= 6
    ? [
      { source: [[nodeSpecs[overviewNodeIndices[0]].structure.x, nodeSpecs[overviewNodeIndices[0]].structure.y], [nodeSpecs[overviewNodeIndices[1]].structure.x, nodeSpecs[overviewNodeIndices[1]].structure.y]], target: [[850, 198], [850, 286]] },
      { source: [[nodeSpecs[overviewNodeIndices[4]].structure.x, nodeSpecs[overviewNodeIndices[4]].structure.y], [nodeSpecs[overviewNodeIndices[5]].structure.x, nodeSpecs[overviewNodeIndices[5]].structure.y]], target: [[970, 198], [970, 286]] }
    ].map(({ source, target }) => {
      const path = svgElement('path', 'immersive-output-trace');
      detailLayer.append(path);
      return { path, source, target };
    })
    : [];
  const outputFindingChevrons = insightOutput.slice(0, 3).map(() => {
    const path = svgElement('path', 'immersive-output-finding-chevron');
    detailLayer.append(path);
    return path;
  });
  detailLayer.append(outputFlowPath, ...outputFlowNodes);

  const addText = (className, x, y, text) => {
    const element = svgElement('text', className, { x, y });
    element.textContent = text;
    labelLayer.append(element);
    return element;
  };
  const outputLabels = [
    ['immersive-output-label immersive-output-overview', 710, 166, 'OVERVIEW'],
    ['immersive-output-label', 1230, 166, 'DISTRIBUTION'],
    ['immersive-output-label', 700, 396, 'PERFORMANCE'],
    ['immersive-output-label', 990, 396, 'INSIGHTS'],
    ['immersive-output-label', 1260, 396, 'TRENDS'],
    ['immersive-output-subsection-label', 1040, 286, 'TRACEABILITY / MATERIAL'],
    ['immersive-output-subsection-label', 1230, 292, 'PROCESS FLOW'],
    ['immersive-output-subsection-label', 1090, 442, 'REVIEW FINDINGS'],
    ['immersive-output-metric-label', 760, 196, 'GROWTH'],
    ['immersive-output-metric-label', 875, 196, 'EFFICIENCY'],
    ['immersive-output-metric-label', 990, 196, 'IMPACT']
  ].map(([className, x, y, text]) => addText(className, x, y, text));
  const outputMetrics = [
    addText('immersive-output-metric', 760, 240, '128%'),
    addText('immersive-output-metric', 875, 240, '94%'),
    addText('immersive-output-metric', 990, 240, '2.4M')
  ];

  const nodePosition = (node, state) => ({ x: state.x, y: state.y });
  const integrateLanePosition = (node) => {
    const lane = integrateLanes[node.role] || integrateLanes.core;
    const laneIndex = node.role === 'core'
      ? roles.slice(0, node.index).filter((role) => role === 'core').length
      : roleSlots[node.index];
    return lane[laneIndex] || lane[0];
  };
  const trendEscapePosition = (node) => ({
    x: 1260,
    // The bottom gutter is the only clear corridor beneath the Structure
    // tile base; use it before Trend climbs the right edge.
    y: 684 - roleSlots[node.index] * 8
  });
  const outputWaypoint = (node) => {
    if (node.role === 'core') {
      const slot = roles.slice(0, node.index).filter((role) => role === 'core').length;
      return { x: 650 + (slot % 7) * 48, y: 390 + Math.floor(slot / 7) * 24 };
    }
    if (node.role === 'overview') {
      const slot = roles.slice(0, node.index).filter((role) => role === 'overview').length;
      return { x: 720 + (slot % 7) * 42, y: 350 + Math.floor(slot / 7) * 22 };
    }
    return null;
  };
  const pointLerp = (from, to, amount) => ({ x: lerp(from.x, to.x, amount), y: lerp(from.y, to.y, amount) });
  const sourcePointFor = (node) => ({ x: node.structure.x, y: node.structure.y });
  const sourceColorFor = (node) => color(node.structure.color);
  const targetFillFor = (target, sourceColor) => {
    const style = targetStyle(target);
    return style.fill === 'none' ? sourceColor : style.fill;
  };
  const integrateCoreContactFor = (targetId, target, node) => {
    const owners = coreOwnersByTarget.get(targetId) || [];
    if (!owners.length) return targetCenter(target);
    const points = owners.map((index) => sourcePointFor(nodeSpecs[index]));
    const center = points.reduce((sum, point) => ({ x: sum.x + point.x / points.length, y: sum.y + point.y / points.length }), { x: 0, y: 0 });
    if (owners.length === 1) return center;
    const first = points[0];
    const last = points[points.length - 1];
    const length = Math.max(.001, Math.hypot(last.x - first.x, last.y - first.y));
    const unit = { x: (last.x - first.x) / length, y: (last.y - first.y) / length };
    const ownerIndex = Math.max(0, owners.indexOf(node.index));
    const offset = (ownerIndex - (owners.length - 1) / 2) * (32 / (owners.length - 1));
    return { x: center.x + unit.x * offset, y: center.y + unit.y * offset };
  };
  const integrateWidgetContactReference = {
    overview: [[438, 270], [490, 270], [542, 270], [594, 270]],
    performance: [[386, 494], [438, 494], [490, 494], [542, 494], [594, 494], [646, 494]],
    trend: [[686, 342], [686, 374], [686, 406], [686, 438]],
    insights: [[328, 326], [364, 326], [328, 358], [364, 358], [328, 390], [364, 390], [328, 422], [364, 422]],
    distribution: [[594, 310], [630, 310], [630, 346], [666, 346]]
  };
  const integrateWidgetContact = (node) => {
    const points = integrateWidgetContactReference[node.role] || [];
    const point = points[roleSlots[node.index]] || [integrateCoreContactReference.x, integrateCoreContactReference.y];
    return runtimePoint(point[0], point[1]);
  };
  const integrateWidgetReleaseReference = {
    distribution: [[692, 274], [724, 242], [756, 274], [744, 306]]
  };
  const integrateWidgetRelease = (node, target) => {
    const points = integrateWidgetReleaseReference[node.role] || [];
    const point = points[roleSlots[node.index]];
    return point ? runtimePoint(point[0], point[1]) : targetCenter(target);
  };
  const integrateNodePose = (node, progress) => {
    const bridgeNode = bridgeNodeFor(node.index);
    const targetId = primaryTargetIdFor(node.index);
    const target = targetFor(targetId) || node.integrate;
    const sourcePoint = sourcePointFor(node);
    const sourceShape = shapePoints(node.structure);
    const targetShape = targetShapePoints(target);
    const targetStyleValue = targetStyle(target);
    const targetPoint = targetCenter(target);
    const isCore = node.role === 'core';
    const mergeOnly = bridgeNode?.disposition === 'cease-after-widget-merge';
    if (isCore) {
      const contactPoint = integrateCoreContactFor(targetId, target, node);
      const approachAmount = easeInOut(clamp((progress - .02) / .36));
      const contactAmount = easeOut(clamp((progress - .38) / .14));
      const pressAmount = easeInOut(clamp((progress - .50) / .16));
      const resolveAmount = easeOut(clamp((progress - .62) / .12));
      const approachPoint = pointLerp(sourcePoint, contactPoint, approachAmount);
      const pressedPoint = pointLerp(approachPoint, targetPoint, pressAmount);
      const position = progress < .50 ? approachPoint : pressedPoint;
      const contactShape = roundedRectPoints(runtimeSize(40), runtimeSize(36, 'y'), runtimeSize(3, 'x'));
      const shape = progress < .42
        ? sourceShape
        : progress < .62
          ? interpolatePoints(sourceShape, contactShape, contactAmount)
          : interpolatePoints(contactShape, targetShape, resolveAmount);
      const owners = coreOwnersByTarget.get(targetId) || [];
      const primary = corePrimaryIndex.get(targetId) === node.index;
      const opacity = primary ? 1 : 1 - easeInOut(clamp((progress - .72) / .12));
      const fill = mixColor(sourceColorFor(node), targetFillFor(target, sourceColorFor(node)), resolveAmount);
      return {
        position,
        shape,
        fill,
        stroke: targetStyleValue.stroke,
        strokeWidth: lerp(1.05, targetStyleValue.strokeWidth, resolveAmount),
        detail: opacity,
        opacity,
        build: resolveAmount,
        targetId,
        primary,
        owners
      };
    }
    const contactPoint = integrateWidgetContact(node);
    const releasePoint = integrateWidgetRelease(node, target);
    const approachAmount = easeInOut(clamp((progress - .02) / .48));
    const departAmount = easeOut(clamp((progress - .72) / .12));
    const morphAmount = easeInOut(clamp((progress - .84) / .11));
    const approachPoint = pointLerp(sourcePoint, contactPoint, approachAmount);
    const settledPoint = pointLerp(releasePoint, targetPoint, morphAmount);
    const position = progress < .72 ? approachPoint : pointLerp(contactPoint, settledPoint, departAmount);
    const shape = progress < .84 ? sourceShape : interpolatePoints(sourceShape, targetShape, morphAmount);
    const sourceFill = sourceColorFor(node);
    const targetFill = targetFillFor(target, sourceFill);
    const fill = targetStyleValue.fill === 'none' && morphAmount >= 1 ? 'none' : mixColor(sourceFill, targetFill, morphAmount);
    const opacity = mergeOnly ? 1 - easeInOut(clamp((progress - .75) / .12)) : 1;
    return {
      position,
      shape,
      fill,
      stroke: morphAmount >= 1 ? targetStyleValue.stroke : color('navy'),
      strokeWidth: lerp(1.05, targetStyleValue.strokeWidth, morphAmount),
      detail: mergeOnly ? opacity : lerp(1, 0, morphAmount),
      opacity,
      build: departAmount,
      targetId,
      primary: true,
      owners: [node.index]
    };
  };
  const outputActionsForSource = (sourceId) => outputActions.filter((action) => action.sourceIds?.includes(sourceId));
  const integrateOutputNodePose = (node, progress) => {
    const sourceId = nodeSourceByIndex.get(node.index);
    const targetId = outputNodeTargetFor(node);
    const target = outputTargetObjects.get(targetId);
    const settled = integrateNodePose(node, 1);
    if (!target || !settled.position) return { ...settled, opacity: 0, detail: 0, build: 0 };
    const elapsedMs = progress * outputStageDuration;
    const sourceActions = outputActionsForSource(sourceId);
    const targetActions = sourceActions.filter((action) => action.targetIds?.includes(targetId));
    const travelAction = targetActions.find((action) => action.operation === 'move') || targetActions.find((action) => action.handoff) || targetActions[0] || sourceActions.find((action) => action.operation === 'move') || sourceActions.find((action) => action.handoff) || sourceActions[0];
    const travelStart = travelAction?.windowMs?.[0] ?? 0;
    const travelEnd = Math.max(travelStart + 1, travelAction?.windowMs?.[1] ?? outputTransitionDuration);
    const targetPoint = outputCanvasPointForTarget(target);
    const travelAmount = easeInOut(clamp((elapsedMs - travelStart) / Math.max(1, travelEnd - travelStart)));
    const position = pointLerp(settled.position, targetPoint, travelAmount);
    const targetAction = targetActions[targetActions.length - 1] || travelAction;
    const targetWindow = targetAction ? { start: targetAction.windowMs[0], end: targetAction.windowMs[1], action: targetAction } : outputTargetWindowFor(targetId);
    const shapeStart = targetWindow?.start ?? travelStart;
    const shapeEnd = Math.max(shapeStart + 1, targetWindow?.end ?? travelEnd);
    const shapeAmount = easeInOut(clamp((elapsedMs - shapeStart) / Math.max(1, shapeEnd - shapeStart)));
    const isPanelCarrier = outputPanelCarrierByNode.has(node.index);
    const isFrameCarrier = targetId === 'output-v2-frame' && node.index === 4;
    const shape = (isPanelCarrier || node.role !== 'core' || node.index !== 3) && (targetId !== 'output-v2-frame' || isFrameCarrier)
      ? interpolatePoints(settled.shape, outputTargetShapePoints(target), shapeAmount)
      : settled.shape;
    const lastAction = sourceActions[sourceActions.length - 1];
    const fadeEnd = Math.max(travelEnd, lastAction?.windowMs?.[1] ?? outputTransitionDuration);
    const fade = elapsedMs < fadeEnd ? 1 : 1 - easeInOut(clamp((elapsedMs - fadeEnd) / 120));
    const sourceFill = sourceColorFor(node);
    const targetStyleValue = outputStyleFor(target);
    const targetFill = targetStyleValue.fill === 'none' ? sourceFill : targetStyleValue.fill;
    const fillAmount = easeInOut(clamp((elapsedMs - shapeStart) / Math.max(1, shapeEnd - shapeStart)));
    const fill = targetFill === 'none' ? sourceFill : /^#[0-9a-f]{6}$/i.test(targetFill) ? (fillAmount >= 1 ? targetFill : mixColor(sourceFill, targetFill, fillAmount)) : (fillAmount >= 1 ? targetFill : sourceFill);
    if (elapsedMs >= outputTransitionDuration) return { position: targetPoint, shape: outputTargetShapePoints(target), fill: targetStyleValue.fill, stroke: targetStyleValue.stroke || color('navy'), strokeWidth: targetStyleValue.strokeWidth || 1.05, detail: 0, opacity: 0, build: 1, targetId };
    return {
      position,
      shape,
      fill,
      stroke: targetStyleValue.stroke || color('navy'),
      strokeWidth: lerp(settled.strokeWidth || 1.05, targetStyleValue.strokeWidth || 1.05, shapeAmount),
      detail: (settled.detail || 0) * fade,
      opacity: (settled.opacity == null ? 1 : settled.opacity) * fade,
      build: travelAmount,
      targetId
    };
  };
  const poseFor = (node, phase) => {
    if (phase.index === 0) return { position: node.scatter, shape: circlePoints(2.5), fill: color(node.sourceColor), stroke: color(node.sourceColor), detail: 0, build: 0 };
    if (phase.index === 1) {
      const amount = easeInOut(phase.progress);
      return { position: { x: lerp(node.scatter.x, node.attract.x, amount), y: lerp(node.scatter.y, node.attract.y, amount) }, shape: circlePoints(lerp(2.5, 3, amount)), fill: color(node.sourceColor), stroke: color(node.sourceColor), detail: 0, build: 0 };
    }
    if (phase.index === 2) {
      const amount = easeInOut(phase.progress);
      return { position: { x: lerp(node.attract.x, node.align.x, amount), y: lerp(node.attract.y, node.align.y, amount) }, shape: interpolatePoints(circlePoints(3), roundedRectPoints(7, 7, 1), amount), fill: color(node.sourceColor), stroke: color(node.sourceColor), detail: 0, build: 0 };
    }
    if (phase.index === 3 || phase.index === 4) {
      const amount = phase.index === 3 ? easeInOut(phase.progress) : 1;
      return { position: { x: lerp(node.align.x, node.cluster.x, amount), y: lerp(node.align.y, node.cluster.y, amount) }, shape: interpolatePoints(roundedRectPoints(7, 7, 1), roundedRectPoints(9, 9, 1), amount), fill: color(node.sourceColor), stroke: color(node.sourceColor), detail: 0, build: 0 };
    }
    if (phase.index === 5) {
      const rowStarts = [.04, .17, .30, .43, .56, .68];
      const row = node.structure.row;
      const build = easeInOut(clamp((phase.progress - rowStarts[row]) / .24));
      return {
        position: { x: lerp(node.cluster.x, node.structure.x, build), y: lerp(node.cluster.y, node.structure.y, build) },
        shape: interpolatePoints(roundedRectPoints(9, 9, 1), shapePoints(node.structure), build),
        fill: mixColor(color(node.sourceColor), color(node.structure.color), build),
        stroke: color('navy'),
        detail: easeOut(clamp((build - .42) / .35)),
        build
      };
    }
    if (phase.index === 6) {
      return integrateNodePose(node, phase.progress);
    }
    return integrateOutputNodePose(node, phase.progress);
  };
  const renderIntegrateSplits = (phase) => {
    const active = phase.index === 6;
    integrateSplitLayer.style.opacity = active ? '1' : '0';
    integrateSplitElements.forEach(({ path, sourceIndex, target }) => {
      if (!active) {
        path.style.opacity = '0';
        path.style.visibility = 'hidden';
        return;
      }
      const node = nodeSpecs[sourceIndex];
      const primaryTarget = targetFor(primaryTargetIdFor(sourceIndex)) || node.integrate;
      const primaryPose = integrateNodePose(node, phase.progress);
      const targetPoint = targetCenter(target);
      const localRevealAmount = easeOut(clamp((phase.progress - .84) / .04));
      const morphAmount = easeInOut(clamp((phase.progress - .84) / .11));
      const primaryPoint = primaryPose.position;
      const splitPoint = targetCenter(primaryTarget);
      const position = phase.progress < .84
        ? primaryPoint
        : pointLerp(splitPoint, targetPoint, morphAmount);
      const sourceShape = shapePoints(node.structure);
      const targetShape = targetShapePoints(target);
      const shape = phase.progress < .84 ? sourceShape : interpolatePoints(sourceShape, targetShape, morphAmount);
      const style = targetStyle(target);
      const sourceFill = sourceColorFor(node);
      const targetFill = targetFillFor(target, sourceFill);
      const fill = style.fill === 'none' && morphAmount >= 1 ? 'none' : mixColor(sourceFill, targetFill, morphAmount);
      const opacity = localRevealAmount;
      path.setAttribute('transform', `translate(${position.x.toFixed(2)} ${position.y.toFixed(2)})`);
      path.setAttribute('d', pointsToPath(shape));
      path.setAttribute('fill', fill);
      path.setAttribute('stroke', morphAmount >= 1 ? style.stroke : color('navy'));
      path.setAttribute('stroke-width', String(lerp(1.05, style.strokeWidth, morphAmount)));
      path.style.opacity = String(opacity);
      path.style.visibility = opacity > 0 ? 'visible' : 'hidden';
    });
  };
  const renderIntegrateLabels = (phase) => {
    const active = phase.index === 6;
    integrateLabelLayer.style.opacity = active ? '1' : '0';
    integrateLabelElements.forEach(({ label, target }) => {
      if (!active) {
        label.style.opacity = '0';
        label.style.visibility = 'hidden';
        return;
      }
      const point = runtimePoint(target.x, target.y);
      const section = target.className?.includes('section-label');
      label.setAttribute('x', point.x.toFixed(2));
      label.setAttribute('y', point.y.toFixed(2));
      label.setAttribute('fill', section ? targetColor('navy') : targetColor('slate'));
      label.setAttribute('font-family', 'Inter, ui-sans-serif, system-ui, sans-serif');
      label.setAttribute('font-size', String(runtimeSize(section ? 11 : 8, 'y')));
      label.setAttribute('font-weight', '700');
      label.setAttribute('letter-spacing', section ? '.17em' : '.15em');
      const opacity = easeOut(clamp((phase.progress - .86) / .09));
      label.style.opacity = String(opacity);
      label.style.visibility = opacity > 0 ? 'visible' : 'hidden';
    });
  };
  const renderOutputPersistentLabels = (phase) => {
    const active = phase.index >= 7;
    if (!active) return;
    integrateLabelLayer.style.opacity = '1';
    const elapsedMs = phase.progress * outputStageDuration;
    outputChoreography.persistentLabels.forEach((mapping) => {
      const entry = integrateLabelElements.find(({ target }) => target.id === mapping.sourceId);
      const target = outputTargetObjects.get(mapping.targetId);
      if (!entry || !target) return;
      const sourceObject = targetFor(mapping.sourceId);
      const sourcePoint = targetCenter(sourceObject);
      const targetPoint = outputCanvasPointForTarget(target);
      const travelEnd = mapping.settleWindowMs[1];
      const amount = easeInOut(clamp((elapsedMs - mapping.travelWindowMs[0]) / Math.max(1, travelEnd - mapping.travelWindowMs[0])));
      const position = pointLerp(sourcePoint, targetPoint, amount);
      const style = target.style || {};
      const font = style.font || '';
      const fontSize = Number(font.match(/(\d+(?:\.\d+)?)px/)?.[1] || 8) * outputLayout.scaleY;
      const fontWeight = font.match(/\b(400|500|600|700)\b/)?.[1] || '500';
      const targetText = target.text || entry.target.text || '';
      entry.label.dataset.outputTargetId = mapping.targetId;
      entry.label.setAttribute('x', position.x.toFixed(2));
      entry.label.setAttribute('y', position.y.toFixed(2));
      entry.label.setAttribute('fill', outputColor(style.fill || 'navy'));
      entry.label.setAttribute('font-family', font.includes('Cormorant') ? 'Cormorant Garamond, Georgia, serif' : 'Inter, ui-sans-serif, system-ui, sans-serif');
      entry.label.setAttribute('font-size', String(fontSize));
      entry.label.setAttribute('font-weight', fontWeight);
      entry.label.setAttribute('letter-spacing', style.class?.includes('system-label') ? '.1em' : '.01em');
      entry.label.textContent = elapsedMs >= mapping.settleWindowMs[0] ? targetText : entry.target.text;
      entry.label.style.opacity = '1';
      entry.label.style.visibility = 'visible';
    });
  };
  const renderOutputSourceCarriers = (phase, poses) => {
    const active = phase.index >= 7;
    outputSourceCarrierLayer.style.opacity = active ? '1' : '0';
    const elapsedMs = active ? phase.progress * outputStageDuration : 0;
    outputSourceCarrierElements.forEach(({ sourceId, targetId, element }) => {
      const travelAction = outputActions.find((action) => action.sourceIds?.includes(sourceId) && action.operation === 'move');
      const mergeAction = outputActions.find((action) => action.id === 'trends-oct-merge');
      if (!active || !travelAction || !mergeAction || elapsedMs >= mergeAction.windowMs[1]) {
        element.style.opacity = '0';
        element.style.visibility = 'hidden';
        return;
      }
      const target = outputTargetObjects.get(targetId);
      const source = targetFor(sourceId);
      const sourcePoint = outputSourceAnchor(sourceId, poses);
      const targetPoint = outputCanvasPointForTarget(target);
      const amount = easeInOut(clamp((elapsedMs - travelAction.windowMs[0]) / Math.max(1, mergeAction.windowMs[1] - travelAction.windowMs[0])));
      const position = pointLerp(sourcePoint, targetPoint, amount);
      const fade = 1 - easeInOut(clamp((elapsedMs - mergeAction.windowMs[0]) / Math.max(1, mergeAction.windowMs[1] - mergeAction.windowMs[0])));
      const sourceStyle = targetStyle(source);
      const targetStyleValue = outputStyleFor(target);
      const shape = interpolatePoints(targetShapePoints(source), outputTargetShapePoints(target), amount);
      element.setAttribute('d', pointsToPath(shape));
      element.setAttribute('transform', `translate(${position.x.toFixed(2)} ${position.y.toFixed(2)})`);
      element.setAttribute('fill', amount >= 1 ? targetStyleValue.fill : sourceStyle.fill);
      element.setAttribute('stroke', amount >= 1 ? targetStyleValue.stroke : sourceStyle.stroke);
      element.setAttribute('stroke-width', String(amount >= 1 ? targetStyleValue.strokeWidth : sourceStyle.strokeWidth));
      element.style.opacity = String(fade);
      element.style.visibility = fade > 0 ? 'visible' : 'hidden';
    });
  };
  const renderOutputTargets = (phase, poses) => {
    const active = phase.index >= 7;
    outputShellLayer.style.opacity = active ? '1' : '0';
    outputTargetLayer.style.opacity = active ? '1' : '0';
    outputLayerTransform();
    const elapsedMs = active ? phase.progress * outputStageDuration : 0;
    const origin = { x: outputLayout.x, y: outputLayout.y };
    const scaleX = outputLayout.scaleX;
    const scaleY = outputLayout.scaleY;
    const stage = !active ? null : outputStageForElapsed(elapsedMs);
    motionRoot.dataset.integrateOutputStage = stage?.id || 'integrate';
    motionRoot.dataset.integrateOutputHold = String(active && elapsedMs >= outputTransitionDuration);
    if (active) renderOutputPersistentLabels(phase);
    outputTargetElements.forEach(({ target, wrapper, element }) => {
      if (!active) {
        wrapper.style.visibility = 'hidden';
        element.style.visibility = 'hidden';
        element.style.opacity = '0';
        return;
      }
      const targetCenter = outputTargetLocalCenter(target);
      const sourceAnchor = outputTargetAnchor(target, poses);
      const sourceLocal = {
        x: (sourceAnchor.x - origin.x) / Math.max(.001, scaleX),
        y: (sourceAnchor.y - origin.y) / Math.max(.001, scaleY)
      };
      const targetWindow = outputTargetWindowFor(target.id);
      const travelStart = targetWindow?.action?.windowMs?.[0] ?? 0;
      const travelEnd = Math.max(travelStart + 1, targetWindow?.action?.windowMs?.[1] ?? outputTransitionDuration);
      const travelAmount = easeInOut(clamp((elapsedMs - travelStart) / (travelEnd - travelStart)));
      const offsetX = lerp(sourceLocal.x - targetCenter.x, 0, travelAmount);
      const offsetY = lerp(sourceLocal.y - targetCenter.y, 0, travelAmount);
      const reveal = outputTargetReveal(target, elapsedMs);
      wrapper.setAttribute('transform', `translate(${offsetX.toFixed(2)} ${offsetY.toFixed(2)})`);
      wrapper.style.visibility = reveal > 0 ? 'visible' : 'hidden';
      element.style.visibility = reveal > 0 ? 'visible' : 'hidden';
      element.style.opacity = String(reveal);
      const style = target.style || {};
      const fill = outputColor(style.fill || 'none');
      element.style.fill = fill;
    });
    renderOutputSourceCarriers(phase, poses);
    outputRuntimeGates(phase, poses);
  };

  const render = (rawElapsed) => {
    const elapsed = ((rawElapsed % TOTAL) + TOTAL) % TOTAL;
    const phase = phaseFor(elapsed);
    const poses = nodeElements.map((node) => poseFor(node, phase));
    const outputElapsedMs = phase.index >= 7 ? phase.progress * outputStageDuration : 0;
    nodeElements.forEach((node, index) => {
      const pose = poses[index];
      node.element.setAttribute('transform', `translate(${pose.position.x.toFixed(2)} ${pose.position.y.toFixed(2)})`);
      node.element.style.opacity = String(pose.opacity == null ? 1 : pose.opacity);
      node.element.style.visibility = pose.opacity === 0 ? 'hidden' : 'visible';
      node.shape.setAttribute('d', pointsToPath(pose.shape));
      node.shape.setAttribute('fill', pose.fill);
      node.shape.setAttribute('stroke', pose.stroke);
      node.shape.setAttribute('stroke-width', String(pose.strokeWidth || 1.05));
      node.shape.style.fill = pose.fill;
      node.shape.style.stroke = pose.stroke;
      node.shape.style.strokeWidth = String(pose.strokeWidth || 1.05);
      node.detail.setAttribute('d', pointsToPath([
        [-1.6, -5], [1.6, -5], [1.6, -1.6], [5, -1.6], [5, 1.6], [1.6, 1.6],
        [1.6, 5], [-1.6, 5], [-1.6, 1.6], [-5, 1.6], [-5, -1.6], [-1.6, -1.6],
        [-1.6, -5], [-1.6, -5], [-1.6, -5], [-1.6, -5]
      ]));
      node.detail.style.opacity = String(pose.detail);
      // Keep contrast tied to the persistent source tile, not to an
      // interpolated RGB string. This prevents white '+' marks from becoming
      // muddy on paper tiles or changing brightness at a phase seam.
      node.detail.setAttribute('stroke', node.structure.color === 'paper' ? palette.navy : palette.paper);
      node.detail.style.stroke = node.structure.color === 'paper' ? palette.navy : palette.paper;
    });
    renderIntegrateSplits(phase);
    renderIntegrateLabels(phase);
    renderOutputPersistentLabels(phase);

    networkElements.forEach((edge, edgeIndex) => {
      const from = nodePosition(edge.from, poses[edge.from].position);
      const to = nodePosition(edge.to, poses[edge.to].position);
      let points = [[from.x, from.y], [to.x, to.y]];
      let opacity = phase.index === 0 ? .05 : phase.index === 1 ? .16 : phase.index === 2 ? .28 : phase.index <= 4 ? .58 : .20;
      if (edge.crossGroup) {
        // Cross-group traces explain the loose network, but release before the
        // aligned rows settle. This leaves one consistent visual language for
        // the local links and avoids an unexplained vertical chain in Align.
        if (phase.index === 1) opacity = lerp(opacity, 0, easeInOut(clamp((phase.progress - .58) / .42)));
        if (phase.index >= 2) opacity = 0;
      }
      if (phase.index === 5) {
        const railAmount = easeInOut(clamp((phase.progress - .28) / .48));
        const railFrom = nodeSpecs[edge.from].structure;
        const railTo = nodeSpecs[edge.to].structure;
        points = [[lerp(from.x, railFrom.x, railAmount), lerp(from.y, railFrom.y, railAmount)], [lerp(to.x, railTo.x, railAmount), lerp(to.y, railTo.y, railAmount)]];
        opacity = lerp(.58, .22, railAmount);
      } else if (phase.index === 6) {
        if (edge.targetId) {
          const target = targetFor(edge.targetId);
          const endpoints = targetReferenceEndpoints(target);
          const targetPoints = endpoints.map(([x, y]) => runtimePoint(x, y));
          const sourcePoints = [from, to];
          const amount = easeOut(clamp((phase.progress - .56) / .18));
          points = sourcePoints.map((point, index) => [lerp(point.x, targetPoints[index].x, amount), lerp(point.y, targetPoints[index].y, amount)]);
          opacity = amount * .72;
          const style = targetStyle(target);
          edge.path.setAttribute('stroke', style.stroke);
          edge.path.setAttribute('stroke-width', String(style.strokeWidth));
          edge.path.style.stroke = style.stroke;
          edge.path.style.strokeWidth = String(style.strokeWidth);
        } else {
          const coreish = (role) => role === 'core' || role === 'overview';
          opacity = coreish(nodeSpecs[edge.from].role) && coreish(nodeSpecs[edge.to].role) ? .08 : 0;
        }
      } else if (phase.index === 7) {
        const supportSourceId = outputNetworkSourceByIndex.get(edgeIndex);
        const supportActions = supportSourceId ? outputActionsForSource(supportSourceId) : [];
        const supportEnd = supportActions.length ? Math.max(...supportActions.map((action) => action.windowMs[1])) : 0;
        opacity = supportEnd && outputElapsedMs < supportEnd
          ? .24
          : supportEnd
            ? .24 * (1 - easeInOut(clamp((outputElapsedMs - supportEnd) / 120)))
            : 0;
      }
      // Phase-specific rail styling above must never re-enable the non-local
      // network edges. After Align, only local/support geometry should remain.
      if (edge.crossGroup && phase.index >= 2) opacity = 0;
      edge.path.setAttribute('d', linePath(points));
      edge.path.style.opacity = String(opacity);
      if (!(phase.index === 6 && edge.targetId)) {
        edge.path.setAttribute('stroke', phase.index >= 5 ? palette.grid : palette.slate);
        edge.path.style.stroke = '';
        edge.path.style.strokeWidth = '';
      }
    });

    // Keep the line path owned by the six performance nodes. At the Structure
    // -> Integrate seam they remain the visible source, and the path follows
    // their live positions until they have reached the Integrate chart.
    const lineSourceIndices = phase.index >= 6 ? integratePerformanceNodeIndices : performanceNodeIndices;
    const sourceLine = lineSourceIndices.map((index) => [poses[index].position.x, poses[index].position.y]);
    const outputLine = outputCanvasPathPointsForTarget(outputTargetObjects.get('output-v2-performance-line'), sourceLine.length).map(({ x, y }) => [x, y]);
    const lineTravelAmount = phase.index >= 7 ? easeInOut(clamp((outputElapsedMs - 3050) / 600)) : 0;
    const linePoints = phase.index >= 7
      ? sourceLine.map((point, index) => [lerp(point[0], outputLine[index][0], lineTravelAmount), lerp(point[1], outputLine[index][1], lineTravelAmount)])
      : sourceLine;
    const lineOpacity = phase.index < 3
      ? 0
      : phase.index === 3
        ? 0
        : phase.index === 4 || phase.index === 5
          ? .42
          : phase.index === 6
            ? lerp(0, .86, easeInOut(clamp((phase.progress - .84) / .11)))
            : 1 - easeInOut(clamp((outputElapsedMs - 3650) / 180));
    const visibleLine = linePoints;
    lineTrack.path.setAttribute('d', linePath(visibleLine));
    lineTrack.path.style.opacity = String(lineOpacity);
    const lineStyle = phase.index === 6 ? targetStyle(integratePerformancePolyline) : { stroke: palette.navy, strokeWidth: 1.5 };
    lineTrack.path.setAttribute('stroke', lineStyle.stroke);
    lineTrack.path.setAttribute('stroke-width', String(lineStyle.strokeWidth));
    lineTrack.path.style.stroke = phase.index === 6 ? lineStyle.stroke : '';
    lineTrack.path.style.strokeWidth = phase.index === 6 ? String(lineStyle.strokeWidth) : '';

    insightTracks.forEach((track, index) => {
      const target = track.integrate;
      let points = track.source;
      let opacity = 0;
      if (phase.index === 6) {
        const from = [
          [poses[insightNodeIndices[index]].position.x, poses[insightNodeIndices[index]].position.y],
          [poses[insightNodeIndices[index + 3]].position.x, poses[insightNodeIndices[index + 3]].position.y]
        ];
        const amount = easeInOut(clamp((phase.progress - .58) / .34));
        points = from.map((point, pointIndex) => [
          lerp(point[0], target[pointIndex][0], amount),
          lerp(point[1], target[pointIndex][1], amount)
        ]);
        opacity = .18 * easeOut(clamp((phase.progress - .68) / .16));
      } else if (phase.index >= 7) {
        opacity = 0;
      }
      track.path.setAttribute('d', linePath(points));
      track.path.style.opacity = String(opacity);
    });

    const flowAmount = phase.index >= 7 ? easeOut(clamp((phase.progress - .18) / .45)) : 0;
    const flowOrigin = poses[20].position;
    const flowPoints = outputFlowTargets.map(([x, y]) => [
      lerp(flowOrigin.x, x, flowAmount),
      lerp(flowOrigin.y, y, flowAmount)
    ]);
    outputFlowPath.setAttribute('d', linePath(flowPoints));
    outputFlowPath.style.opacity = String(flowAmount * .56);
    outputFlowNodes.forEach((node, index) => {
      const [x, y] = flowPoints[index];
      node.setAttribute('cx', x.toFixed(2));
      node.setAttribute('cy', y.toFixed(2));
      node.style.opacity = String(flowAmount);
    });

    const traceAmount = phase.index >= 7 ? easeOut(clamp((phase.progress - .28) / .42)) : 0;
    outputTracePaths.forEach(({ path, source, target }) => {
      const points = source.map((point, index) => [
        lerp(point[0], target[index][0], traceAmount),
        lerp(point[1], target[index][1], traceAmount)
      ]);
      path.setAttribute('d', linePath(points));
      path.style.opacity = String(traceAmount * .52);
    });
    const findingAmount = phase.index >= 7 ? easeOut(clamp((phase.progress - .26) / .42)) : 0;
    outputFindingChevrons.forEach((path, index) => {
      const sourceNode = poses[insightNodeIndices[index]].position;
      const targetPoint = insightOutput[index];
      const x = lerp(sourceNode.x, targetPoint[0] + 148, findingAmount);
      const y = lerp(sourceNode.y, targetPoint[1], findingAmount);
      path.setAttribute('d', linePath([[x - 5, y - 5], [x, y], [x - 5, y + 5]]));
      path.style.opacity = String(findingAmount * .82);
    });

    boundaryElements.forEach(({ path, source, cluster }) => {
      const boundaryAmount = phase.index < 3 ? 0 : phase.index === 3 ? easeOut(clamp((phase.progress - .40) / .35)) : phase.index === 4 ? 1 : phase.index === 5 ? 1 - easeInOut(clamp((phase.progress - .08) / .50)) : 0;
      const rail = [[cluster.center.x - 84, 618], [cluster.center.x + 84, 618]];
      const destination = source.map((point, index) => rail[index % 2]);
      path.setAttribute('d', linePath(interpolatePoints(source, destination, phase.index === 5 ? 1 - boundaryAmount : 0)) + 'Z');
      path.style.opacity = String(boundaryAmount * .72);
    });

    roleFrameElements.forEach((frame) => {
      let points = frame.source;
      let opacity = 0;
      let targetPath = null;
      if (phase.index === 6) {
        const target = targetFor(frame.targetId);
        const endpoints = targetReferenceEndpoints(target);
        if (target && endpoints) {
          const amount = easeOut(clamp((phase.progress - .62) / .16));
          const targetPoints = endpoints.map(([x, y]) => {
            const point = runtimePoint(x, y);
            return [point.x, point.y];
          });
          targetPath = linePath(targetPoints);
          opacity = amount * .78;
          const style = targetStyle(target);
          frame.path.setAttribute('fill', style.fill);
          frame.path.setAttribute('stroke', style.stroke);
          frame.path.setAttribute('stroke-width', String(style.strokeWidth));
        }
      } else if (phase.index >= 7) {
        opacity = 0;
      }
      frame.path.setAttribute('d', targetPath || pointsToPath(points));
      frame.path.style.opacity = String(opacity);
      if (!targetPath) {
        frame.path.style.stroke = phase.index === 6 ? 'rgba(14,26,46,.46)' : '';
        frame.path.setAttribute('fill', phase.index >= 7 && phase.progress > .70 ? 'rgba(252,252,252,.90)' : 'none');
        frame.path.setAttribute('stroke', phase.index >= 7 ? palette.grid : palette.slate);
      }
    });

    const outputAmount = phase.index >= 7 ? easeOut(clamp((phase.progress - .56) / .24)) : 0;
    outputLabels.forEach((label) => { label.style.opacity = String(outputAmount); });
    const metricAmount = phase.index >= 7 ? easeOut(clamp((phase.progress - .64) / .20)) : 0;
    outputMetrics.forEach((metric) => { metric.style.opacity = String(metricAmount); });

    if (phase.index >= 6) {
      // Retire the old Output study geometry; the manifest-backed target layer
      // owns phase 7 and the exact final endpoint.
      networkElements.forEach(({ path, targetId }) => { if (!targetId) path.style.opacity = '0'; });
      insightTracks.forEach(({ path }) => { path.style.opacity = '0'; });
      roleFrameElements.forEach(({ path, targetId }) => { if (!targetId) path.style.opacity = '0'; });
      outputFlowPath.style.opacity = '0';
      outputFlowNodes.forEach((node) => { node.style.opacity = '0'; });
      outputTracePaths.forEach(({ path }) => { path.style.opacity = '0'; });
      outputFindingChevrons.forEach((path) => { path.style.opacity = '0'; });
      outputLabels.forEach((label) => { label.style.opacity = '0'; });
      outputMetrics.forEach((metric) => { metric.style.opacity = '0'; });
    }

    renderOutputTargets(phase, poses);

    motionRoot.dataset.stitchPhase = phase.phase;
    motionRoot.dataset.stitchProgress = String(Math.round(elapsed / TOTAL * 100));
    motionRoot.dataset.immersiveProgress = String(Math.round(phase.progress * 100));
    return phase;
  };

  const updateIndicator = (elapsed) => {
    const phase = phaseFor(elapsed);
    const next = schedule[phase.index + 1];
    const localEnd = next ? next.start : TOTAL;
    const localProgress = clamp((elapsed - phase.start) / Math.max(1, localEnd - phase.start));
    const name = motionRoot.querySelector('#motion-phase-name');
    const progress = motionRoot.querySelector('#motion-phase-progress');
    if (name) name.textContent = phase.phase.toUpperCase();
    if (progress) progress.textContent = `${Math.round(elapsed / TOTAL * 100)}% · ${Math.round(localProgress * 100)}%`;
    motionRoot.querySelectorAll('[data-live-phase]').forEach((step, index) => {
      step.classList.toggle('is-active', index === phase.index);
      step.classList.toggle('is-complete', index < phase.index);
    });
    const seek = motionRoot.querySelector('#motion-seek');
    if (seek) {
      seek.max = String(seekMax);
      const value = clamp(elapsed, 0, seekMax);
      seek.value = String(value);
      seek.style.setProperty('--seek-progress', `${value / seekMax * 100}%`);
    }
  };

  let paused = false;
  let pausedAt = 0;
  let startedAt = performance.now();
  const renderAt = (elapsed) => { lastRenderedElapsed = elapsed; updateIndicator(elapsed); render(elapsed); };
  rerenderAfterLayout = renderAt;
  const pauseEarly = () => motionRoot.querySelectorAll('*').forEach((element) => element.getAnimations?.().forEach((animation) => animation.pause()));
  const toggle = () => {
    const now = performance.now();
    if (paused) {
      startedAt += Math.max(0, now - pausedAt);
      pausedAt = 0;
      paused = false;
    } else {
      pausedAt = now;
      paused = true;
      pauseEarly();
    }
    const button = motionRoot.querySelector('#motion-toggle');
    if (button) {
      button.setAttribute('aria-pressed', String(paused));
      button.setAttribute('aria-label', paused ? 'Resume animation' : 'Pause animation');
      const label = button.querySelector('[data-motion-toggle-label]');
      if (label) label.textContent = paused ? 'PLAY' : 'PAUSE';
    }
  };
  const step = (direction) => {
    const now = performance.now();
    if (!paused) { paused = true; pausedAt = now; }
    startedAt -= direction * frameDuration;
    const elapsed = clamp(pausedAt - startedAt, 0, TOTAL - frameDuration);
    renderAt(elapsed);
  };
  const seek = (value) => {
    const target = clamp(Number(value), 0, seekMax);
    const now = performance.now();
    if (!paused) { paused = true; pausedAt = now; }
    startedAt = pausedAt - target;
    renderAt(target);
    const button = motionRoot.querySelector('#motion-toggle');
    if (button) {
      button.setAttribute('aria-pressed', 'true');
      button.setAttribute('aria-label', 'Resume animation');
      const label = button.querySelector('[data-motion-toggle-label]');
      if (label) label.textContent = 'PLAY';
    }
  };
  motionRoot.querySelector('#motion-toggle')?.addEventListener('click', toggle);
  motionRoot.querySelector('#motion-step-back')?.addEventListener('click', () => step(-1));
  motionRoot.querySelector('#motion-step-forward')?.addEventListener('click', () => step(1));
  const seekControl = motionRoot.querySelector('#motion-seek');
  seekControl?.addEventListener('input', () => seek(seekControl.value));
  let pointerSeeking = false;
  const seekPointer = (event) => {
    if (!seekControl) return;
    const rect = seekControl.getBoundingClientRect();
    const ratio = clamp((event.clientX - rect.left) / Math.max(1, rect.width));
    seek(ratio * seekMax);
  };
  seekControl?.addEventListener('pointerdown', (event) => { pointerSeeking = true; seekControl.setPointerCapture?.(event.pointerId); seekPointer(event); });
  seekControl?.addEventListener('pointermove', (event) => { if (pointerSeeking || event.buttons) seekPointer(event); });
  seekControl?.addEventListener('pointerup', () => { pointerSeeking = false; });
  seekControl?.addEventListener('pointercancel', () => { pointerSeeking = false; });

  const tick = (timestamp) => {
    if (!paused) {
      const raw = Math.max(0, timestamp - startedAt);
      renderAt(raw % TOTAL);
    }
    requestAnimationFrame(tick);
  };
  if (reducedMotion) {
    paused = true;
    pausedAt = performance.now();
    startedAt = pausedAt - (TOTAL - frameDuration);
    renderAt(TOTAL - frameDuration);
  } else {
    renderAt(0);
    requestAnimationFrame(tick);
  }
})();
