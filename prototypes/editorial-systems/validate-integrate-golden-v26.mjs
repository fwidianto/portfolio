import assert from 'node:assert/strict';
import fs from 'node:fs';

const here = new URL('.', import.meta.url);
const manifestPath = new URL('./integrate-golden-v26.manifest.json', here);
const goldenPath = new URL('./integrate-golden-v26.html', here);
const manifestText = fs.readFileSync(manifestPath, 'utf8');
const manifest = JSON.parse(manifestText);
const golden = fs.readFileSync(goldenPath, 'utf8');

const check = (condition, message) => assert.equal(Boolean(condition), true, message);
const deepEqual = (actual, expected, message) => assert.deepEqual(actual, expected, message);
const contains = (value, message) => check(golden.includes(value), `golden reference missing ${message}: ${value}`);
const ids = (objects) => objects.map(({ id }) => id);
const flattenVisibleObjects = () => [
  ...manifest.core.tiles.flatMap((tile) => [tile, tile.mark]),
  ...manifest.core.baseHairlines,
  ...manifest.supportGeometry,
  manifest.widgets.distribution.label,
  manifest.widgets.distribution.ring,
  ...manifest.widgets.distribution.accentArcs,
  manifest.widgets.trends.label,
  ...manifest.widgets.trends.bars,
  manifest.widgets.trends.baseline,
  manifest.widgets.performance.label,
  manifest.widgets.performance.polyline,
  ...manifest.widgets.performance.points,
  manifest.widgets.insights.label,
  ...manifest.widgets.insights.lines,
  ...manifest.widgets.insights.dots,
  manifest.widgets.overviewSystemDetail.label,
  ...manifest.widgets.overviewSystemDetail.hairlines,
  ...manifest.widgets.overviewSystemDetail.rails
];

check(manifest.id === 'integrate-golden-v26', 'manifest id');
deepEqual(manifest.authority.viewBox, [0, 0, 1000, 720], 'viewBox');
deepEqual(manifest.authority.referenceFrame, { left: 548, top: 34, width: 1000, height: 720 }, 'reference frame');
contains('<svg viewBox="0 0 1000 720"', 'locked SVG viewBox');

const coreGroup = golden.match(/<g transform="translate\(360 286\)">([\s\S]*?)<\/g>/)?.[1] || '';
const uses = [...coreGroup.matchAll(/<use href="#(tile-[^"]+)" x="(\d+)" y="(\d+)"\/>/g)].map((match) => ({
  style: match[1].replace('tile-', ''),
  x: Number(match[2]) + 360,
  y: Number(match[3]) + 286
}));
const expectedCoreStyles = [
  'navy', 'paper', 'sand', 'slate', 'navy', 'paper',
  'slate', 'navy', 'navy', 'sand',
  'navy', 'paper',
  'navy'
];
check(uses.length === 13, 'golden has exactly 13 core uses');
deepEqual(manifest.core.rowCounts, [6, 4, 2, 1], '6-4-2-1 row counts');
check(manifest.core.tiles.length === 13, 'manifest has exactly 13 core tiles');
deepEqual(manifest.core.tiles.map(({ x, y, style }) => ({ x, y, style })), uses.map(({ x, y, style }) => ({ x, y, style })), 'core geometry/style matches golden');
deepEqual(manifest.core.tiles.map(({ style }) => style), expectedCoreStyles, 'core style sequence');
deepEqual(manifest.core.tiles.map(({ width, height }) => [width, height]), Array.from({ length: 13 }, () => [52, 48]), 'core dimensions');
deepEqual(manifest.core.tiles.map(({ row }) => row), ['bottom', 'bottom', 'bottom', 'bottom', 'bottom', 'bottom', 'middle', 'middle', 'middle', 'middle', 'upper', 'upper', 'top'], 'core row ownership');
manifest.core.tiles.forEach((tile) => {
  deepEqual([tile.mark.x, tile.mark.y], [tile.x + 26, tile.y + 24], `${tile.id} plus mark position`);
  contains(`<use href="#tile-${tile.style}"`, `${tile.id} style definition`);
});

check(manifest.sourceBridge.file === 'integrate-live-source-bridge.json', 'live source bridge file');
check(manifest.sourceBridge.runtimeFile === 'prototypes/editorial-systems/immersive.js', 'live runtime source file');
check(manifest.sourceBridge.nodeCount === 50, 'live runtime node count');
deepEqual(manifest.sourceBridge.structureRowCounts, [18, 12, 8, 6, 4, 2], 'live Structure row counts');

const expectedSupportPaths = [
  'M402 300H468', 'M402 324H468', 'M700 292L662 334', 'M700 292L664 360',
  'M275 535L336 498', 'M286 560L350 510', 'M364 284L410 330', 'M364 308L410 350'
];
check(manifest.supportGeometry.length === 8, '8 approved support rail segments');
manifest.supportGeometry.forEach(({ d }, index) => contains(d, `support segment ${index + 1}`));
deepEqual(manifest.supportGeometry.map(({ d }) => d), expectedSupportPaths, 'support path order');

const expectedWidgetPaths = [
  'M724 232A42 42 0 0 1 761 294', 'M753 252A42 42 0 0 1 765 275',
  'M814 440V405M844 440V383M874 440V395M904 440V370M934 440V410', 'M814 440H942',
  'M92 610L124 584L156 596L188 550L220 520L252 538',
  'M246 276H356', 'M246 300H336', 'M246 324H364', 'M246 348H346',
  'M382 220H602M382 232H548M382 244H580', 'M412 262H464M480 262H532M548 262H600',
  'M360 478H668', 'M412 430H620', 'M464 382H568'
];
expectedWidgetPaths.forEach((path) => contains(path, 'widget/detail path'));
deepEqual(
  (({ cx, cy, radius, fill, stroke, strokeWidth }) => ({ cx, cy, radius, fill, stroke, strokeWidth }))(manifest.widgets.distribution.ring),
  { cx: 724, cy: 274, radius: 42, fill: 'none', stroke: 'slate', strokeWidth: 11 },
  'Distribution ring geometry/style'
);
deepEqual(
  manifest.widgets.distribution.accentArcs.map(({ d, stroke, strokeWidth, fill }) => ({ d, stroke, strokeWidth, fill })),
  [
    { d: 'M724 232A42 42 0 0 1 761 294', stroke: 'navy', strokeWidth: 11, fill: 'none' },
    { d: 'M753 252A42 42 0 0 1 765 275', stroke: 'sand', strokeWidth: 11, fill: 'none' }
  ],
  'Distribution accent geometry/style'
);
deepEqual(
  manifest.widgets.distribution.accentArcs.map(({ cx, cy, radius, thickness, startAngle, endAngle }) => ({ cx, cy, radius, thickness, startAngle, endAngle })),
  [
    { cx: 724, cy: 274, radius: 42, thickness: 11, startAngle: -1.5707963268, endAngle: 0.4964227534 },
    { cx: 724, cy: 274, radius: 42, thickness: 11, startAngle: -0.6483312853, endAngle: 0.0243865266 }
  ],
  'Distribution arc parameters'
);
deepEqual(
  manifest.widgets.trends.bars.map(({ x, baselineY, topY, width, height }) => ({ x, baselineY, topY, width, height })),
  [
    { x: 814, baselineY: 440, topY: 405, width: 13, height: 35 },
    { x: 844, baselineY: 440, topY: 383, width: 13, height: 57 },
    { x: 874, baselineY: 440, topY: 395, width: 13, height: 45 },
    { x: 904, baselineY: 440, topY: 370, width: 13, height: 70 },
    { x: 934, baselineY: 440, topY: 410, width: 13, height: 30 }
  ],
  'Trends bar geometry'
);
deepEqual(
  (({ x1, y1, x2, y2, width, height, className, d }) => ({ x1, y1, x2, y2, width, height, className, d }))(manifest.widgets.trends.baseline),
  { x1: 814, y1: 440, x2: 942, y2: 440, width: 128, height: 0, className: 'hairline', d: 'M814 440H942' },
  'Trends baseline geometry'
);
deepEqual(
  (({ d, stroke, strokeWidth, className }) => ({ d, stroke, strokeWidth, className }))(manifest.widgets.performance.polyline),
  { d: 'M92 610L124 584L156 596L188 550L220 520L252 538', stroke: 'navy', strokeWidth: 2, className: 'rail' },
  'Performance polyline geometry/style'
);
deepEqual(
  manifest.widgets.performance.polyline.points,
  [[92, 610], [124, 584], [156, 596], [188, 550], [220, 520], [252, 538]],
  'Performance polyline points'
);
deepEqual(
  manifest.widgets.performance.points.map(({ cx, cy, radius, fill }) => ({ cx, cy, radius, fill })),
  [[92, 610], [124, 584], [156, 596], [188, 550], [220, 520], [252, 538]].map(([cx, cy]) => ({ cx, cy, radius: 4, fill: 'navy' })),
  'Performance point geometry/style'
);
deepEqual(
  manifest.widgets.insights.lines.map(({ d, x1, y1, x2, y2, width, height, className }) => ({ d, x1, y1, x2, y2, width, height, className })),
  [
    { d: 'M246 276H356', x1: 246, y1: 276, x2: 356, y2: 276, width: 110, height: 0, className: 'rail' },
    { d: 'M246 300H336', x1: 246, y1: 300, x2: 336, y2: 300, width: 90, height: 0, className: 'rail' },
    { d: 'M246 324H364', x1: 246, y1: 324, x2: 364, y2: 324, width: 118, height: 0, className: 'rail' },
    { d: 'M246 348H346', x1: 246, y1: 348, x2: 346, y2: 348, width: 100, height: 0, className: 'rail' }
  ],
  'Insights line geometry'
);
deepEqual(
  manifest.widgets.insights.dots.map(({ cx, cy, radius, fill }) => ({ cx, cy, radius, fill })),
  [276, 300, 324, 348].map((cy) => ({ cx: 230, cy, radius: 4, fill: 'sand' })),
  'Insights dot geometry/style'
);
deepEqual(
  manifest.widgets.overviewSystemDetail.hairlines.map(({ d, x1, y1, x2, y2, width, height, className }) => ({ d, x1, y1, x2, y2, width, height, className })),
  [
    { d: 'M382 220H602', x1: 382, y1: 220, x2: 602, y2: 220, width: 220, height: 0, className: 'hairline' },
    { d: 'M382 232H548', x1: 382, y1: 232, x2: 548, y2: 232, width: 166, height: 0, className: 'hairline' },
    { d: 'M382 244H580', x1: 382, y1: 244, x2: 580, y2: 244, width: 198, height: 0, className: 'hairline' }
  ],
  'Overview hairline geometry'
);
deepEqual(
  manifest.widgets.overviewSystemDetail.rails.map(({ d, x1, y1, x2, y2, width, height, className }) => ({ d, x1, y1, x2, y2, width, height, className })),
  [
    { d: 'M412 262H464', x1: 412, y1: 262, x2: 464, y2: 262, width: 52, height: 0, className: 'rail' },
    { d: 'M480 262H532', x1: 480, y1: 262, x2: 532, y2: 262, width: 52, height: 0, className: 'rail' },
    { d: 'M548 262H600', x1: 548, y1: 262, x2: 600, y2: 262, width: 52, height: 0, className: 'rail' }
  ],
  'Overview rail geometry'
);
deepEqual(
  manifest.core.baseHairlines.map(({ d, x1, y1, x2, y2, width, height, className }) => ({ d, x1, y1, x2, y2, width, height, className })),
  [
    { d: 'M360 478H668', x1: 360, y1: 478, x2: 668, y2: 478, width: 308, height: 0, className: 'hairline' },
    { d: 'M412 430H620', x1: 412, y1: 430, x2: 620, y2: 430, width: 208, height: 0, className: 'hairline' },
    { d: 'M464 382H568', x1: 464, y1: 382, x2: 568, y2: 382, width: 104, height: 0, className: 'hairline' }
  ],
  'core base hairline geometry'
);
deepEqual(
  manifest.supportGeometry.map(({ d, from, to, width, height, length, className }) => ({ d, from, to, width, height, length, className })),
  [
    { d: 'M402 300H468', from: [402, 300], to: [468, 300], width: 66, height: 0, length: 66, className: 'rail' },
    { d: 'M402 324H468', from: [402, 324], to: [468, 324], width: 66, height: 0, length: 66, className: 'rail' },
    { d: 'M700 292L662 334', from: [700, 292], to: [662, 334], width: 38, height: 42, length: 56.64, className: 'rail sand' },
    { d: 'M700 292L664 360', from: [700, 292], to: [664, 360], width: 36, height: 68, length: 76.94, className: 'rail sand' },
    { d: 'M275 535L336 498', from: [275, 535], to: [336, 498], width: 61, height: 37, length: 71.34, className: 'rail' },
    { d: 'M286 560L350 510', from: [286, 560], to: [350, 510], width: 64, height: 50, length: 81.22, className: 'rail' },
    { d: 'M364 284L410 330', from: [364, 284], to: [410, 330], width: 46, height: 46, length: 65.05, className: 'rail' },
    { d: 'M364 308L410 350', from: [364, 308], to: [410, 350], width: 46, height: 42, length: 62.29, className: 'rail' }
  ],
  'support geometry/dimensions'
);
const expectedLabels = [
  manifest.widgets.distribution.label,
  manifest.widgets.trends.label,
  manifest.widgets.performance.label,
  manifest.widgets.insights.label,
  manifest.widgets.overviewSystemDetail.label
].map(({ x, y, text, className }) => ({ x, y, text, className }));
deepEqual(expectedLabels, [
  { x: 684, y: 214, text: 'DISTRIBUTION', className: 'micro-label' },
  { x: 808, y: 344, text: 'TRENDS', className: 'micro-label' },
  { x: 88, y: 548, text: 'PERFORMANCE', className: 'micro-label' },
  { x: 214, y: 244, text: 'INSIGHTS', className: 'micro-label' },
  { x: 380, y: 196, text: 'OVERVIEW / SYSTEM DETAIL', className: 'section-label' }
], 'label geometry/text');
check(manifest.widgets.distribution.accentArcs.length === 2, '2 Distribution accent arcs');
check(manifest.widgets.trends.bars.length === 5, '5 Trends bars');
check(manifest.widgets.performance.points.length === 6, '6 Performance points');
check(manifest.widgets.insights.dots.length === 4, '4 Insights dots');
check(manifest.widgets.insights.lines.length === 4, '4 Insights lines');
check(manifest.widgets.overviewSystemDetail.hairlines.length === 3, '3 Overview hairlines');
check(manifest.widgets.overviewSystemDetail.rails.length === 3, '3 Overview rails');
['DISTRIBUTION', 'TRENDS', 'PERFORMANCE', 'INSIGHTS', 'OVERVIEW / SYSTEM DETAIL'].forEach((label) => contains(`>${label}<`, `label ${label}`));

const visibleObjects = flattenVisibleObjects();
const visibleIds = ids(visibleObjects);
check(visibleObjects.length === 72, 'all artwork objects have explicit identities');
check(visibleObjects.every(({ id, kind }) => id && kind), 'all artwork objects have explicit kinds');
check(new Set(visibleIds).size === visibleIds.length, 'visible object identities are unique');
check(!manifestText.includes('5-3-1'), 'manifest has no legacy 5-3-1 assumption');
check(!manifestText.includes('9-tile'), 'manifest has no legacy 9-tile assumption');
check(manifest.hardGate.legacyLayoutAllowed === false, 'legacy layout is disallowed');

const bridgePath = new URL('./integrate-live-source-bridge.json', here);
const runtimePath = new URL('./immersive.js', here);
const bridge = JSON.parse(fs.readFileSync(bridgePath, 'utf8'));
const runtimeSource = fs.readFileSync(runtimePath, 'utf8');
const targetIds = new Set(visibleIds);
const requiredRuntimeExpressions = [
  'const nodeSpecs = Array.from({ length: 50 }',
  'const nodeElements = nodeSpecs.map',
  'const networkElements = networkPairs.map',
  'const boundaryElements = groups.map',
  'const roleFrameElements = Object.entries(integrateFrames).map',
  'const lineTrack = { path: svgElement(\'path\', \'immersive-line\')',
  'const insightTracks = integrateInsightLines.slice(0, 3).map',
  'const outputFlowPath = svgElement(\'path\', \'immersive-output-flow\')',
  'const outputFlowNodes = outputFlowTargets.map',
  'const outputTracePaths = overviewNodeIndices.length >= 6',
  'const outputFindingChevrons = insightOutput.slice(0, 3).map',
  'const outputLabels = [',
  'const outputMetrics = ['
];
check(bridge.targetManifest === 'integrate-golden-v26.manifest.json', 'bridge target manifest');
check(bridge.runtime.file === 'prototypes/editorial-systems/immersive.js', 'bridge runtime file');
check(bridge.runtime.nodeSource === 'nodeSpecs[index]', 'bridge node source');
check(bridge.runtime.domSource.includes('.immersive-node:nth-child'), 'bridge DOM source');
check(bridge.runtime.nodeCount === 50, 'bridge node count');
check(manifest.sourceBridge.nodeCount === bridge.runtime.nodeCount, 'manifest/bridge node count');
requiredRuntimeExpressions.forEach((expression) => check(runtimeSource.includes(expression), `live runtime source expression: ${expression}`));

const runtimeRowMatch = runtimeSource.match(/const structureTargets = \[\];\s*\[([0-9,\s]+)\]\.forEach/);
check(runtimeRowMatch, 'live Structure target row generator');
const runtimeRows = runtimeRowMatch[1].split(',').map((value) => Number(value.trim())).filter(Number.isFinite);
deepEqual(runtimeRows, bridge.runtime.structureRowCounts, 'live Structure row counts');
const runtimeRoleExpression = 'const roles = integrateBridge.liveNodes.slice().sort((left, right) => left.index - right.index).map((node) => node.role);';
check(runtimeSource.includes(runtimeRoleExpression), 'live runtime consumes bridge-defined roles');
const runtimeRoles = bridge.liveNodes.slice().sort((left, right) => left.index - right.index).map((node) => node.role);
check(runtimeRoles.length === bridge.runtime.nodeCount, 'live runtime role assignments');
const expectedRuntimeFamilies = [
  'networkElements', 'boundaryElements', 'roleFrameElements', 'lineTrack', 'insightTracks',
  'outputFlowPath', 'outputFlowNodes', 'outputTracePaths', 'outputFindingChevrons', 'outputLabels', 'outputMetrics'
];
deepEqual(
  [...new Set(bridge.runtimeObjects.families.map(({ sourceExpression }) => sourceExpression))].sort(),
  expectedRuntimeFamilies.sort(),
  'complete live runtime family set'
);
const expectedRuntimeFamilyCounts = {
  networkElements: 65,
  boundaryElements: 5,
  roleFrameElements: 5,
  lineTrack: 1,
  insightTracks: 3,
  outputFlowPath: 1,
  outputFlowNodes: 4,
  outputTracePaths: runtimeRoles.filter((role) => role === 'overview').length >= 6 ? 2 : 0,
  outputFindingChevrons: 3,
  outputLabels: 11,
  outputMetrics: 3
};

const expectedLiveNodes = [];
runtimeRows.forEach((count, row) => {
  const firstX = 1080 - ((count - 1) * 48) / 2;
  for (let column = 0; column < count; column += 1) {
    expectedLiveNodes.push({ row, column, x: firstX + column * 48, y: 602 - row * 32 });
  }
});
check(expectedLiveNodes.length === bridge.runtime.nodeCount, 'live Structure source expansion');
deepEqual(
  bridge.liveNodes.map(({ id, index, role, structure }) => ({ id, index, role, structure })),
  expectedLiveNodes.map((structure, index) => ({ id: `live-node-${String(index).padStart(2, '0')}`, index, role: runtimeRoles[index], structure })),
  'live node identity/role/Structure geometry'
);
const allowedNodeDispositions = new Set([
  'split-to-overview-detail', 'reshape-to-core-detail', 'merge-into-core-tile',
  'detach-to-performance-point', 'split-to-trends-widget', 'detach-to-trends-bar',
  'split-to-insight-row', 'detach-to-insight-line', 'detach-to-insight-dot',
  'split-to-distribution-widget', 'detach-to-distribution-arc', 'cease-after-widget-merge'
]);
const liveNodeIndices = bridge.liveNodes.map(({ index }) => index);
deepEqual([...new Set(liveNodeIndices)].sort((a, b) => a - b), Array.from({ length: bridge.runtime.nodeCount }, (_, index) => index), 'every live node has one bridge record');
bridge.liveNodes.forEach((node) => {
  check(allowedNodeDispositions.has(node.disposition), `${node.id} disposition`);
  check(Array.isArray(node.targetRefs), `${node.id} targetRefs`);
  check(new Set(node.targetRefs).size === node.targetRefs.length, `${node.id} targetRefs are unique`);
  node.targetRefs.forEach((targetId) => check(targetIds.has(targetId), `${node.id} references unknown target ${targetId}`));
  if (node.mergeInto) check(targetIds.has(node.mergeInto), `${node.id} references unknown merge target ${node.mergeInto}`);
});

const formatFamilyId = (family, index) => family.idFormat.replace('%02d', String(index).padStart(2, '0'));
const expandFamilyIds = (family) => family.explicitIds || Array.from({ length: family.count }, (_, index) => formatFamilyId(family, index));
const runtimeObjectOwners = [];
bridge.liveNodes.forEach((node) => runtimeObjectOwners.push({ id: node.id, disposition: node.disposition, targetRefs: node.targetRefs }));
bridge.runtimeObjects.families.forEach((family) => {
  check(runtimeSource.includes(family.sourceExpression), `live runtime family source: ${family.sourceExpression}`);
  const familyIds = expandFamilyIds(family);
  check(family.count === expectedRuntimeFamilyCounts[family.sourceExpression], `${family.sourceExpression} source count`);
  check(familyIds.length === family.count, `${family.sourceExpression} family count`);
  const assignedIds = [];
  family.ranges.forEach((range) => {
    const rangeIds = range.ids || Array.from({ length: range.to - range.from + 1 }, (_, offset) => formatFamilyId(family, range.from + offset));
    check(rangeIds.length > 0, `${family.sourceExpression} non-empty disposition range`);
    check(rangeIds.every((id) => familyIds.includes(id)), `${family.sourceExpression} range references its source family`);
    check(range.disposition, `${family.sourceExpression} disposition`);
    check(Array.isArray(range.targetRefs), `${family.sourceExpression} targetRefs`);
    check(new Set(rangeIds).size === rangeIds.length, `${family.sourceExpression} range ids are unique`);
    rangeIds.forEach((id) => {
      assignedIds.push(id);
      runtimeObjectOwners.push({ id, disposition: range.disposition, targetRefs: range.targetRefs });
    });
    range.targetRefs.forEach((targetId) => check(targetIds.has(targetId), `${family.sourceExpression} references unknown target ${targetId}`));
  });
  deepEqual([...new Set(assignedIds)].sort(), [...new Set(familyIds)].sort(), `${family.sourceExpression} disposition coverage`);
});
const runtimeObjectIds = runtimeObjectOwners.map(({ id }) => id);
check(new Set(runtimeObjectIds).size === runtimeObjectIds.length, 'live runtime object ids are unique');
const targetOwners = new Map();
runtimeObjectOwners.forEach(({ id, targetRefs }) => targetRefs.forEach((targetId) => {
  const owners = targetOwners.get(targetId) || [];
  owners.push(id);
  targetOwners.set(targetId, owners);
}));
bridge.liveNodes.filter(({ mergeInto }) => mergeInto).forEach(({ id, mergeInto }) => {
  const owners = targetOwners.get(mergeInto) || [];
  owners.push(id);
  targetOwners.set(mergeInto, owners);
});
const missingTargetOwners = visibleIds.filter((targetId) => !targetOwners.has(targetId));
deepEqual(missingTargetOwners, [], 'every manifest artwork target has a live source owner');
const mergeTargets = new Set(bridge.ownershipRules.mergeTargets);
targetOwners.forEach((owners, targetId) => {
  check(owners.length === 1 || mergeTargets.has(targetId), `${targetId} has inconsistent live source ownership`);
});

console.log('PASS integrate-golden-v26 manifest parity');
console.log(JSON.stringify({
  coreTiles: manifest.core.tiles.length,
  coreRows: manifest.core.rowCounts,
  liveNodes: manifest.sourceBridge.nodeCount,
  liveRuntimeObjects: runtimeObjectOwners.length,
  supportRails: manifest.supportGeometry.length,
  visibleObjects: visibleObjects.length,
  widgets: {
    distributionArcs: manifest.widgets.distribution.accentArcs.length,
    trendsBars: manifest.widgets.trends.bars.length,
    performancePoints: manifest.widgets.performance.points.length,
    insightsDots: manifest.widgets.insights.dots.length,
    insightsLines: manifest.widgets.insights.lines.length,
    overviewHairlines: manifest.widgets.overviewSystemDetail.hairlines.length,
    overviewRails: manifest.widgets.overviewSystemDetail.rails.length
  }
}, null, 2));
