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

const sourceIds = ids(manifest.source.structureTiles);
const coreSourceIds = manifest.core.tiles.flatMap(({ sourceTiles }) => sourceTiles);
check(manifest.source.structureTiles.length === 26, '26 locked Structure source tiles');
check(new Set(sourceIds).size === 26, 'source tile ids are unique');
check(coreSourceIds.length === 26, 'core source use count');
deepEqual([...new Set(coreSourceIds)].sort(), [...sourceIds].sort(), 'every source tile is used exactly once');
check(manifest.core.tiles.every(({ sourceTiles }) => sourceTiles.length === 2), 'each core tile has two source tiles');

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

console.log('PASS integrate-golden-v26 manifest parity');
console.log(JSON.stringify({
  coreTiles: manifest.core.tiles.length,
  coreRows: manifest.core.rowCounts,
  sourceTiles: manifest.source.structureTiles.length,
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
