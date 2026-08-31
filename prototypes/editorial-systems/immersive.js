(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('immersive') !== '1') return;

  const hero = document.querySelector('.hero');
  const motionRoot = document.querySelector('.hero-motion');
  if (!hero || !motionRoot) return;

  const NS = 'http://www.w3.org/2000/svg';
  const WIDTH = 1600;
  const HEIGHT = 720;
  const TOTAL = 18000;
  const SCALE = 18000 / 32800;
  // Clean rework baseline: approved earlier phases remain active while the
  // retired Output composition stays disabled during this Integrate pass.
  const RESET_INTEGRATE_OUTPUT = true;
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
  const shapePoints = (spec) => {
    if (!spec) return circlePoints(2.5);
    if (spec.kind === 'tile') return roundedRectPoints(spec.width || 32, spec.height || 28, spec.radius || 2);
    if (spec.kind === 'bar' || spec.kind === 'metric') return rectPoints(spec.width, spec.height);
    if (spec.kind === 'arc') return arcPoints(spec.radius, spec.startAngle, spec.endAngle, spec.thickness);
    return circlePoints(spec.radius || 3);
  };
  const phaseFor = (elapsed) => {
    let index = 0;
    schedule.forEach((entry, candidate) => { if (elapsed >= entry.start) index = candidate; });
    const entry = schedule[index];
    return { ...entry, index, progress: clamp((elapsed - entry.start) / Math.max(1, entry.end - entry.start)) };
  };
  const centerOf = (spec) => ({ x: spec.x, y: spec.y });
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
  const lineLayer = group('immersive-line-layer');
  const nodeLayer = group('immersive-node-layer');
  const detailLayer = group('immersive-detail-layer');
  const labelLayer = group('immersive-label-layer');
  canvas.append(frameLayer, boundaryLayer, linkLayer, lineLayer, nodeLayer, detailLayer, labelLayer);
  hero.prepend(canvas);

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

  const roles = new Array(50).fill('core');
  const setRole = (role, indices) => indices.forEach((index) => { roles[index] = role; });
  // Ownership is spatially coherent from Structure onward. Earlier phases
  // use only the shared positions, so this remap changes no earlier render.
  setRole('performance', [12, 13, 14, 15, 16, 17]);
  setRole('trend', [18, 19, 20, 21]);
  setRole('insights', [22, 23, 24, 25, 26, 27, 28, 29]);
  setRole('distribution', [34, 35, 36, 37]);
  setRole('overview', [0, 1, 2, 3]);
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

  const integrateBars = [
    { x: 866, y: 214, width: 13, height: 38, color: 'navy' },
    { x: 889, y: 207, width: 13, height: 52, color: 'navy' },
    { x: 912, y: 219, width: 13, height: 28, color: 'sand' },
    { x: 935, y: 211, width: 13, height: 44, color: 'navy' }
  ];
  const outputBars = [
    { x: 1270, y: 494, width: 20, height: 66, color: 'slate' },
    { x: 1310, y: 470, width: 20, height: 114, color: 'navy' },
    { x: 1350, y: 446, width: 20, height: 162, color: 'navy' },
    { x: 1390, y: 414, width: 20, height: 226, color: 'navy' },
    { x: 1430, y: 390, width: 20, height: 274, color: 'sand' },
    { x: 1470, y: 430, width: 20, height: 194, color: 'slate' }
  ];
  const integrateLine = [
    [1376, 348], [1398, 322], [1420, 336], [1442, 296], [1464, 315], [1486, 286]
  ];
  const outputLine = [
    [720, 492], [765, 454], [810, 470], [855, 420], [900, 378], [945, 398]
  ];
  const integrateInsightTargets = [
    { kind: 'dot', x: 1391, y: 360, radius: 4, color: 'sand' },
    { kind: 'metric', x: 1452, y: 360, width: 72, height: 2, color: 'grid' },
    { kind: 'dot', x: 1391, y: 374, radius: 4, color: 'sand' },
    { kind: 'metric', x: 1452, y: 374, width: 72, height: 2, color: 'grid' },
    { kind: 'dot', x: 1391, y: 388, radius: 4, color: 'sand' },
    { kind: 'metric', x: 1452, y: 388, width: 72, height: 2, color: 'grid' },
    { kind: 'dot', x: 1391, y: 402, radius: 4, color: 'sand' },
    { kind: 'metric', x: 1452, y: 402, width: 72, height: 2, color: 'grid' }
  ];
  const insightIntegrate = integrateInsightTargets.map(({ x, y }) => [x, y]);
  const insightOutput = [
    [1010, 360], [1010, 405], [1010, 450], [1010, 495], [1010, 540], [1010, 585], [1010, 630], [1010, 675]
  ];
  const integrateOverviewBars = [
    { x: 866, y: 367, width: 13, height: 30, color: 'navy' },
    { x: 889, y: 359, width: 13, height: 46, color: 'navy' },
    { x: 912, y: 372, width: 13, height: 20, color: 'sand' },
    { x: 935, y: 363, width: 13, height: 38, color: 'navy' }
  ];
  const integrateDonut = { x: 1402, y: 207 };
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
  const integrateCoreTiles = [
    [950, 1030, 1110, 1190, 1270].map((x) => ({ kind: 'tile', x, y: 365, width: 74, height: 70, radius: 4 })),
    [1030, 1110, 1190].map((x) => ({ kind: 'tile', x, y: 295, width: 74, height: 70, radius: 4 })),
    [{ kind: 'tile', x: 1110, y: 222, width: 118, height: 70, radius: 4 }]
  ].flat().map((tile, index) => ({ ...tile, color: ['navy', 'navy', 'paper', 'sand', 'slate', 'navy', 'navy', 'sand', 'navy'][index] }));
  const integrateDetailTargets = [
    [820, 540, 30], [904, 540, 30], [988, 540, 30], [1072, 540, 30], [1156, 540, 30], [1240, 540, 30],
    [904, 476, 30], [988, 476, 30], [1072, 476, 30], [1156, 476, 30], [988, 412, 30], [1072, 412, 30], [1156, 412, 30], [1072, 348, 30]
  ].map(([x, y, width], index) => ({ kind: 'metric', x, y, width, height: 2, color: index % 5 === 0 ? 'sand' : 'grid' }));
  const integrateCoreTargets = [...integrateCoreTiles, ...integrateDetailTargets];
  // Integrate is derived from the referenced static checkpoint. The first
  // pass brings every node into the central core; widget-bound nodes share
  // those visible contact points before leaving the core.
  const integrateConvergenceCenter = { x: 1110, y: 295 };
  const integrateReferenceTargetFor = Array.from({ length: 50 });
  const coreMergeTargetSlots = [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7, 8, 8];
  roleIndices('core').forEach((nodeIndex, index) => {
    integrateReferenceTargetFor[nodeIndex] = integrateCoreTiles[coreMergeTargetSlots[index]];
  });
  roleIndices('trend').forEach((nodeIndex, index) => { integrateReferenceTargetFor[nodeIndex] = { kind: 'bar', ...integrateBars[index] }; });
  roleIndices('overview').forEach((nodeIndex, index) => { integrateReferenceTargetFor[nodeIndex] = { kind: 'bar', ...integrateOverviewBars[index] }; });
  roleIndices('performance').forEach((nodeIndex, index) => { integrateReferenceTargetFor[nodeIndex] = { kind: 'dot', x: integrateLine[index][0], y: integrateLine[index][1], radius: 4, color: 'navy' }; });
  roleIndices('distribution').forEach((nodeIndex, index) => { integrateReferenceTargetFor[nodeIndex] = { kind: 'arc', x: integrateDonut.x, y: integrateDonut.y, radius: 42, thickness: 11, ...donutArcs[index] }; });
  roleIndices('insights').forEach((nodeIndex, index) => { integrateReferenceTargetFor[nodeIndex] = integrateInsightTargets[index]; });
  const integrateContactTargetFor = integrateReferenceTargetFor.slice();
  const integrateContactCoreTiles = integrateCoreTiles.map((target) => ({
    ...target,
    x: lerp(target.x, integrateConvergenceCenter.x, .34),
    y: lerp(target.y, integrateConvergenceCenter.y, .34),
    width: 52,
    height: 48
  }));
  roleIndices('core').forEach((nodeIndex, index) => {
    integrateContactTargetFor[nodeIndex] = integrateContactCoreTiles[coreMergeTargetSlots[index]];
  });
  const contactCoreSlots = {
    performance: [0, 1, 2, 3, 4, 5],
    trend: [0, 1, 2, 3],
    overview: [0, 1, 2, 3],
    insights: [3, 4, 5, 6, 7, 8, 0, 1],
    distribution: [6, 7, 8, 5]
  };
  Object.entries(contactCoreSlots).forEach(([role, slots]) => {
    roleIndices(role).forEach((nodeIndex, index) => { integrateContactTargetFor[nodeIndex] = integrateCoreTiles[slots[index]]; });
  });
  const integratePressTargetFor = integrateContactTargetFor.map((target) => ({
    ...target,
    x: lerp(target.x, integrateConvergenceCenter.x, .22),
    y: lerp(target.y, integrateConvergenceCenter.y, .22)
  }));
  const integrateWidgetRoles = new Set(['trend', 'overview', 'performance', 'distribution', 'insights']);
  const outputFrames = {
    overview: { x: 680, y: 130, width: 500, height: 180 },
    distribution: { x: 1200, y: 130, width: 300, height: 180 },
    performance: { x: 680, y: 360, width: 270, height: 250 },
    insights: { x: 970, y: 360, width: 250, height: 250 },
    trends: { x: 1240, y: 360, width: 260, height: 250 }
  };
  const integrateFrames = {
    // Integrate is an open, source-derived satellite arrangement. The large
    // closed card signature belongs to Output, not this phase.
    trend: { x: 1268, y: 320, width: 250, height: 128 },
    distribution: { x: 1210, y: 130, width: 280, height: 180 },
    performance: { x: 600, y: 350, width: 220, height: 210 },
    insights: { x: 880, y: 320, width: 230, height: 120 },
    overview: { x: 680, y: 130, width: 500, height: 180 }
  };

  // Each lane is a visible continuation of a Structure rail: role material
  // leaves the stacked tile field into its own destination before it settles
  // into the smaller Integrate module. Core material keeps a narrow spine.
  const integrateLanes = {
    trend: integrateBars.map(({ x, y }) => ({ x, y })),
    performance: integrateLine.map(([x, y]) => ({ x, y })),
    distribution: Array.from({ length: 4 }, (_, index) => ({ x: 1220 + index * 18, y: 308 })),
    insights: insightIntegrate.map(([x, y]) => ({ x, y })),
    overview: overviewMetrics.map(({ x, y }) => ({ x, y: y + 38 })),
    core: Array.from({ length: 18 }, (_, index) => ({ x: 1090 + (index % 2) * 9, y: 316 + index * 9 }))
  };
  const laneFrameFor = (role) => {
    const lane = integrateLanes[role];
    const points = lane.filter(Boolean);
    const minX = Math.min(...points.map((point) => point.x));
    const maxX = Math.max(...points.map((point) => point.x));
    const minY = Math.min(...points.map((point) => point.y));
    const maxY = Math.max(...points.map((point) => point.y));
    return {
      x: minX - 22,
      y: minY - 26,
      width: Math.max(72, maxX - minX + 44),
      height: Math.max(58, maxY - minY + 52)
    };
  };
  const integrateFrameSources = {
    trend: laneFrameFor('trend'),
    distribution: laneFrameFor('distribution'),
    performance: laneFrameFor('performance'),
    insights: laneFrameFor('insights'),
    // This envelope is derived from the visible Structure mass. Overview
    // framing must not originate from an empty future metric lane.
    overview: { x: 800, y: 390, width: 680, height: 220 }
  };

  const nodeSpecs = Array.from({ length: 50 }, (_, index) => {
    const role = roles[index];
    const slot = roleSlots[index];
    const structure = structureTargets[index];
    let integrate;
    let output;
    if (role === 'trend') {
      integrate = integrateReferenceTargetFor[index] || { ...structure };
      output = { kind: 'bar', ...outputBars[slot], color: outputBars[slot].color };
    } else if (role === 'performance') {
      integrate = integrateReferenceTargetFor[index] || { ...structure };
      output = { kind: 'dot', x: outputLine[slot][0], y: outputLine[slot][1], radius: 3, color: 'navy' };
    } else if (role === 'distribution') {
      const arc = donutArcs[slot];
      integrate = integrateReferenceTargetFor[index] || { ...structure };
      output = { kind: 'arc', x: outputDonut.x, y: outputDonut.y, radius: 46, thickness: 12, ...arc };
    } else if (role === 'insights') {
      integrate = integrateReferenceTargetFor[index] || { ...structure };
      output = { kind: 'dot', x: insightOutput[slot][0], y: insightOutput[slot][1], radius: 4, color: 'sand' };
    } else if (role === 'overview') {
      integrate = integrateReferenceTargetFor[index] || { ...structure };
      output = { kind: 'metric', ...overviewMetrics[slot], color: overviewMetrics[slot].color || 'navy' };
    } else {
      integrate = integrateReferenceTargetFor[index] || { ...structure };
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
    element.append(shape, detail);
    nodeLayer.append(element);
    return { ...spec, element, shape, detail };
  });

  const networkPairs = [];
  groups.forEach((cluster) => {
    cluster.members.forEach((member, index) => {
      if (index < cluster.members.length - 1) networkPairs.push([member, cluster.members[index + 1]]);
      if (index < cluster.members.length - 2 && index % 2 === 0) networkPairs.push([member, cluster.members[index + 2]]);
    });
  });
  const networkElements = networkPairs.map(([from, to]) => {
    const path = svgElement('path', 'immersive-link');
    linkLayer.append(path);
    return { from, to, path, crossGroup: Math.floor(from / 10) !== Math.floor(to / 10) };
  });

  const boundaryElements = groups.map((cluster) => {
    const path = svgElement('path', 'immersive-boundary');
    boundaryLayer.append(path);
    return { path, source: boundaryPoints(cluster.bounds), cluster };
  });

  const roleFrameElements = Object.entries(integrateFrames).map(([role, integrateFrame]) => {
    const path = svgElement('path', 'immersive-module-frame');
    frameLayer.append(path);
    const sourceGroup = groups[{ trend: 0, performance: 1, distribution: 2, insights: 3, overview: 4 }[role]];
    const outputFrame = outputFrames[role === 'trend' ? 'trends' : role];
    return { role, path, source: boundaryPoints(integrateFrameSources[role]), integrate: boundaryPoints(integrateFrame), output: boundaryPoints(outputFrame) };
  });

  const lineTrack = { path: svgElement('path', 'immersive-line') };
  lineLayer.append(lineTrack.path);
  const insightTracks = insightOutput.slice(0, 3).map((point, index) => {
    const path = svgElement('path', 'immersive-rail');
    lineLayer.append(path);
    return {
      path,
      source: [
        [clustered[16 + index].x, clustered[16 + index].y],
        [clustered[19 + index].x, clustered[19 + index].y]
      ],
      integrate: [[insightIntegrate[index][0], insightIntegrate[index][1]], [insightIntegrate[index][0] + 120, insightIntegrate[index][1]]],
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
    if (RESET_INTEGRATE_OUTPUT && phase.index >= 7) {
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
      const source = node.structure;
      const target = integrateReferenceTargetFor[node.index] || node.integrate;
      const contactTarget = integrateContactTargetFor[node.index] || target;
      const pressTarget = integratePressTargetFor[node.index] || contactTarget;
      const isWidget = integrateWidgetRoles.has(node.role);
      const approachAmount = easeInOut(clamp((phase.progress - .04) / .40));
      const contactAmount = easeOut(clamp((phase.progress - .38) / .14));
      const releaseAmount = easeOut(clamp((phase.progress - .50) / .14));
      const resolveAmount = isWidget ? 0 : easeInOut(clamp((phase.progress - .62) / .20));
      const departureAmount = isWidget ? easeInOut(clamp((phase.progress - .80) / .10)) : 0;
      const approach = {
        x: lerp(source.x, contactTarget.x, approachAmount),
        y: lerp(source.y, contactTarget.y, approachAmount)
      };
      const pressed = {
        x: lerp(approach.x, pressTarget.x, contactAmount),
        y: lerp(approach.y, pressTarget.y, contactAmount)
      };
      const resolvedContact = {
        x: lerp(pressed.x, contactTarget.x, releaseAmount),
        y: lerp(pressed.y, contactTarget.y, releaseAmount)
      };
      const position = isWidget
        ? {
          x: lerp(resolvedContact.x, target.x, departureAmount),
          y: lerp(resolvedContact.y, target.y, departureAmount)
        }
        : {
          x: lerp(resolvedContact.x, target.x, resolveAmount),
          y: lerp(resolvedContact.y, target.y, resolveAmount)
        };
      const contactTile = { ...contactTarget, kind: 'tile', width: 52, height: 48, radius: 3 };
      const contactAmountForShape = easeInOut(clamp((phase.progress - .42) / .16));
      const contactShape = interpolatePoints(shapePoints(source), shapePoints(contactTile), contactAmountForShape);
      const mergeAmount = easeInOut(clamp((phase.progress - .62) / .20));
      const mergedShape = isWidget
        ? contactShape
        : interpolatePoints(contactShape, shapePoints(target), mergeAmount);
      const widgetMorph = isWidget ? easeInOut(clamp((phase.progress - .90) / .09)) : 0;
      return {
        position,
        shape: isWidget ? interpolatePoints(mergedShape, shapePoints(target), widgetMorph) : mergedShape,
        fill: mixColor(color(source.color), color(target.color || contactTarget.color || source.color), isWidget ? clamp(contactAmountForShape * .35 + widgetMorph * .65) : mergeAmount),
        stroke: color('navy'),
        detail: isWidget ? lerp(1, 0, widgetMorph) : 1,
        build: Math.max(mergeAmount, departureAmount)
      };
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

  const render = (rawElapsed) => {
    const elapsed = ((rawElapsed % TOTAL) + TOTAL) % TOTAL;
    const phase = phaseFor(elapsed);
    const poses = nodeElements.map((node) => poseFor(node, phase));
    nodeElements.forEach((node, index) => {
      const pose = poses[index];
      node.element.setAttribute('transform', `translate(${pose.position.x.toFixed(2)} ${pose.position.y.toFixed(2)})`);
      node.shape.setAttribute('d', pointsToPath(pose.shape));
      node.shape.setAttribute('fill', pose.fill);
      node.shape.setAttribute('stroke', pose.stroke);
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
    });

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
        const coreish = (role) => role === 'core' || role === 'overview';
        opacity = coreish(nodeSpecs[edge.from].role) && coreish(nodeSpecs[edge.to].role) ? .08 : 0;
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
      edge.path.setAttribute('stroke', phase.index >= 5 ? palette.grid : palette.slate);
    });

    // Keep the line path owned by the six performance nodes. At the Structure
    // -> Integrate seam they remain the visible source, and the path follows
    // their live positions until they have reached the Integrate chart.
    const lineSourceIndices = phase.index >= 6 ? integratePerformanceNodeIndices : performanceNodeIndices;
    const sourceLine = lineSourceIndices.map((index) => [poses[index].position.x, poses[index].position.y]);
    const linePoints = phase.index < 7
      ? sourceLine
      : interpolatePoints(integrateLine, outputLine, easeInOut(clamp((phase.progress - .12) / .70)));
    const lineOpacity = phase.index < 3
      ? 0
      : phase.index === 3
        ? 0
        : phase.index === 4 || phase.index === 5
          ? .42
          : phase.index === 6
            ? lerp(0, .86, easeInOut(clamp((phase.progress - .90) / .08)))
            : lerp(.86, .96, easeInOut(clamp(phase.progress / .12)));
    const visibleLine = linePoints;
    lineTrack.path.setAttribute('d', linePath(visibleLine));
    lineTrack.path.style.opacity = String(lineOpacity);
    lineTrack.path.setAttribute('stroke', palette.navy);

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
      if (phase.index === 6) {
        // Integrate stays Structure-derived: closed role shells belong to
        // Output and must not appear as a premature dashboard.
        const amount = easeInOut(clamp((phase.progress - .56) / .30));
        points = interpolatePoints(frame.source, frame.integrate, amount);
        opacity = 0;
      } else if (phase.index >= 7) {
        const amount = easeInOut(clamp((phase.progress - .22) / .56));
        points = interpolatePoints(frame.integrate, frame.output, amount);
        opacity = easeOut(clamp((phase.progress - .54) / .20));
      }
      frame.path.setAttribute('d', pointsToPath(points));
      frame.path.style.opacity = String(opacity);
      frame.path.style.stroke = phase.index === 6 ? 'rgba(14,26,46,.46)' : '';
      frame.path.setAttribute('fill', phase.index >= 7 && phase.progress > .70 ? 'rgba(252,252,252,.90)' : 'none');
      frame.path.setAttribute('stroke', phase.index >= 7 ? palette.grid : palette.slate);
    });

    const outputAmount = phase.index >= 7 ? easeOut(clamp((phase.progress - .56) / .24)) : 0;
    outputLabels.forEach((label) => { label.style.opacity = String(outputAmount); });
    const metricAmount = phase.index >= 7 ? easeOut(clamp((phase.progress - .64) / .20)) : 0;
    outputMetrics.forEach((metric) => { metric.style.opacity = String(metricAmount); });

    if (RESET_INTEGRATE_OUTPUT && phase.index >= 6) {
      // Leave the retired phases visually empty of future analytical
      // geometry. Integrate keeps only its source-owned performance line;
      // Output remains the clean neutral baseline.
      networkElements.forEach(({ path }) => { path.style.opacity = '0'; });
      insightTracks.forEach(({ path }) => { path.style.opacity = '0'; });
      roleFrameElements.forEach(({ path }) => { path.style.opacity = '0'; });
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
