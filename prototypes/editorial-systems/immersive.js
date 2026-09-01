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
  const [integrateManifest, integrateBridge] = await Promise.all([
    readRuntimeJson('integrate-golden-v26.manifest.json'),
    readRuntimeJson('integrate-live-source-bridge.json')
  ]);

  const NS = 'http://www.w3.org/2000/svg';
  const WIDTH = 1600;
  const HEIGHT = 720;
  const TOTAL = 18000;
  const SCALE = 18000 / 32800;
  // The approved Output composition is not part of this review checkpoint.
  // Hold the settled Integrate endpoint until that phase is intentionally
  // reworked.
  const HOLD_INTEGRATE_ENDPOINT = true;
  const time = (milliseconds) => milliseconds * SCALE;
  const schedule = [
    { phase: 'scatter', start: time(0), end: time(2550) },
    { phase: 'attract', start: time(2550), end: time(5100) },
    { phase: 'align', start: time(5100), end: time(7650) },
    { phase: 'connect', start: time(7650), end: time(12580) },
    { phase: 'cluster', start: time(12580), end: time(13600) },
    { phase: 'structure', start: time(13600), end: time(18000) },
    { phase: 'integrate', start: time(18000), end: time(22800) },
    { phase: 'output', start: time(22800), end: TOTAL }
  ];
  const integrateEnd = schedule[6].end;
  const structureStart = schedule[5].start;
  const integrateStart = schedule[6].start;
  const outputStart = schedule[7].start;
  const outputFormationEnd = time(26800);
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
  integrateSplitLayer.style.opacity = '0';
  integrateLabelLayer.style.opacity = '0';
  canvas.append(frameLayer, boundaryLayer, linkLayer, lineLayer, nodeLayer, detailLayer, integrateSplitLayer, integrateLabelLayer, labelLayer);
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
  window.addEventListener('resize', refreshRuntimeFrame, { passive: true });
  const runtimePoint = (x, y) => ({
    x: (referenceFrame.left + x - runtimeFrame.left) * runtimeFrame.scaleX,
    y: (referenceFrame.top + y - runtimeFrame.top) * runtimeFrame.scaleY
  });
  const runtimeSize = (value, axis = 'x') => value * (axis === 'y' ? runtimeFrame.scaleY : runtimeFrame.scaleX);
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
    if (phase.index >= 7) {
      return {
        position: node.structure,
        shape: shapePoints(node.structure),
        fill: color(node.structure.color),
        stroke: color('navy'),
        detail: 1,
        build: 0
      };
    }
    if (phase.index === 6) {
      return integrateNodePose(node, phase.progress);
    }
    const outputProgress = clamp((phase.progress * (schedule[7].end - schedule[7].start) + phase.start - outputStart) / Math.max(1, outputFormationEnd - outputStart));
    const roleStarts = { trend: .16, performance: .12, distribution: .08, insights: .20, overview: .32, core: .24 };
    const amount = easeInOut(clamp((outputProgress - roleStarts[node.role]) / .54));
    // Output must inherit the settled Integrate destination for every role,
    // including the former Structure core now condensed into Overview detail.
    const from = node.integrate;
    const detailFade = easeOut(clamp((amount - .08) / .34));
    const waypoint = outputWaypoint(node);
    const source = centerOf(from);
    const target = centerOf(node.output);
    const laneAmount = waypoint ? easeInOut(clamp(amount / .62)) : amount;
    const settleAmount = waypoint ? easeInOut(clamp((amount - .62) / .38)) : 1;
    const via = waypoint
      ? { x: lerp(source.x, waypoint.x, laneAmount), y: lerp(source.y, waypoint.y, laneAmount) }
      : target;
    const position = waypoint
      ? { x: lerp(via.x, target.x, settleAmount), y: lerp(via.y, target.y, settleAmount) }
      : { x: lerp(source.x, target.x, amount), y: lerp(source.y, target.y, amount) };
    const shapeAmount = waypoint ? easeInOut(clamp((amount - .38) / .62)) : amount;
    return {
      position,
      shape: interpolatePoints(shapePoints(from), shapePoints(node.output), shapeAmount),
      fill: mixColor(color(from.color || node.sourceColor), color(node.output.color || node.sourceColor), amount),
      stroke: color('navy'),
      detail: node.integrate.kind === 'tile' ? lerp(1, 0, detailFade) : 0,
      build: amount
    };
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

  const render = (rawElapsed) => {
    const elapsed = ((rawElapsed % TOTAL) + TOTAL) % TOTAL;
    const phase = phaseFor(elapsed);
    const poses = nodeElements.map((node) => poseFor(node, phase));
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

    networkElements.forEach((edge) => {
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
        // Output uses its own source-derived flow, traceability, and finding
        // marks. Retire the loose network links so they cannot read as
        // unexplained diagonals across the settled analytical composition.
        opacity = 0;
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
    const linePoints = phase.index < 7
      ? sourceLine
      : interpolatePoints(integratePerformanceLinePoints, outputLine, easeInOut(clamp((phase.progress - .12) / .70)));
    const lineOpacity = phase.index < 3
      ? 0
      : phase.index === 3
        ? 0
        : phase.index === 4 || phase.index === 5
          ? .42
          : phase.index === 6
            ? lerp(0, .86, easeInOut(clamp((phase.progress - .84) / .11)))
            : lerp(.86, .96, easeInOut(clamp(phase.progress / .12)));
    const visibleLine = linePoints;
    lineTrack.path.setAttribute('d', linePath(visibleLine));
    lineTrack.path.style.opacity = String(lineOpacity);
    const lineStyle = phase.index === 6 ? targetStyle(integratePerformancePolyline) : { stroke: palette.navy, strokeWidth: 1.5 };
    lineTrack.path.setAttribute('stroke', lineStyle.stroke);
    lineTrack.path.setAttribute('stroke-width', String(lineStyle.strokeWidth));
    lineTrack.path.style.stroke = phase.index === 6 ? lineStyle.stroke : '';
    lineTrack.path.style.strokeWidth = phase.index === 6 ? String(lineStyle.strokeWidth) : '';

    insightTracks.forEach((track, index) => {
      const target = phase.index >= 7 ? track.output : track.integrate;
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
        const amount = easeInOut(clamp((phase.progress - .12) / .60));
        points = interpolatePoints(track.integrate, track.output, amount);
        opacity = .28;
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
        const amount = easeInOut(clamp((phase.progress - .22) / .56));
        points = interpolatePoints(frame.integrate, frame.output, amount);
        opacity = easeOut(clamp((phase.progress - .54) / .20));
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
      // Leave the retired Output geometry hidden while Integrate remains the
      // visible endpoint for this checkpoint.
      networkElements.forEach(({ path, targetId }) => { if (!targetId) path.style.opacity = '0'; });
      insightTracks.forEach(({ path }) => { path.style.opacity = '0'; });
      roleFrameElements.forEach(({ path, targetId }) => { if (!targetId) path.style.opacity = '0'; });
      outputFlowPath.style.opacity = '0';
      outputFlowNodes.forEach((node) => { node.style.opacity = '0'; });
      outputTracePaths.forEach(({ path }) => { path.style.opacity = '0'; });
      outputFindingChevrons.forEach((path) => { path.style.opacity = '0'; });
      outputLabels.forEach((label) => { label.style.opacity = '0'; });
      outputMetrics.forEach((metric) => { metric.style.opacity = '0'; });
      if (phase.index >= 7) lineTrack.path.style.opacity = '0';
    }

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
      const value = clamp(elapsed, 0, seekMax);
      seek.value = String(value);
      seek.style.setProperty('--seek-progress', `${value / seekMax * 100}%`);
    }
  };

  let paused = false;
  let pausedAt = 0;
  let startedAt = performance.now();
  const renderAt = (elapsed) => { updateIndicator(elapsed); render(elapsed); };
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
