import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const specPath = path.join(here, 'integrate-output-v2-choreography.json');
const sourceManifestPath = path.join(here, 'integrate-golden-v26.manifest.json');
const bridgePath = path.join(here, 'integrate-output-v2-live-bridge.json');
const targetManifestPath = path.join(here, 'output-golden-v2.manifest.json');
const runtimePath = path.join(here, 'immersive.js');
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const sourceManifest = JSON.parse(fs.readFileSync(sourceManifestPath, 'utf8'));
const bridge = JSON.parse(fs.readFileSync(bridgePath, 'utf8'));
const targetManifest = JSON.parse(fs.readFileSync(targetManifestPath, 'utf8'));
const runtimeText = fs.readFileSync(runtimePath, 'utf8');

const fail = (message) => { throw new Error(`INTEGRATE_OUTPUT_V2_CHOREOGRAPHY_FAIL: ${message}`); };
const expect = (condition, message) => { if (!condition) fail(message); };
const sha256 = (filePath) => crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
const unique = (values) => new Set(values).size === values.length;
const exactArray = (actual, expected) => actual.length === expected.length && actual.every((value, index) => value === expected[index]);
const sourceIds = bridge.sourceObjects.map((source) => source.id);
const targetIds = targetManifest.objects.map((target) => target.id);
const sourceSet = new Set(sourceIds);
const targetSet = new Set(targetIds);
const sourceManifestIds = [];
const addSource = (object) => { if (object?.id) sourceManifestIds.push(object.id); };
sourceManifest.core.tiles.forEach((tile) => { addSource(tile); addSource(tile.mark); });
sourceManifest.core.baseHairlines.forEach(addSource);
sourceManifest.supportGeometry.forEach(addSource);
addSource(sourceManifest.widgets.distribution.label);
addSource(sourceManifest.widgets.distribution.ring);
sourceManifest.widgets.distribution.accentArcs.forEach(addSource);
addSource(sourceManifest.widgets.trends.label);
sourceManifest.widgets.trends.bars.forEach(addSource);
addSource(sourceManifest.widgets.trends.baseline);
addSource(sourceManifest.widgets.performance.label);
addSource(sourceManifest.widgets.performance.polyline);
sourceManifest.widgets.performance.points.forEach(addSource);
addSource(sourceManifest.widgets.insights.label);
sourceManifest.widgets.insights.lines.forEach(addSource);
sourceManifest.widgets.insights.dots.forEach(addSource);
addSource(sourceManifest.widgets.overviewSystemDetail.label);
sourceManifest.widgets.overviewSystemDetail.hairlines.forEach(addSource);
sourceManifest.widgets.overviewSystemDetail.rails.forEach(addSource);

expect(spec.specId === 'integrate-output-v2-choreography-v1', 'spec id drifted');
expect(spec.kind === 'settled-integrate-to-output-golden-v2-choreography', 'spec kind drifted');
expect(spec.authority.sourceManifest.manifestId === 'integrate-golden-v26', 'source manifest authority drifted');
expect(spec.authority.sourceManifest.sha256 === sha256(sourceManifestPath), 'source manifest hash drifted');
expect(spec.authority.ownershipBridge.bridgeId === bridge.id, 'ownership bridge authority drifted');
expect(spec.authority.ownershipBridge.sha256 === sha256(bridgePath), 'ownership bridge hash drifted');
expect(spec.authority.targetManifest.manifestId === 'output-golden-v2', 'target manifest authority drifted');
expect(spec.authority.targetManifest.sha256 === sha256(targetManifestPath), 'target manifest hash drifted');
expect(spec.authority.targetManifest.geometryAuthority === 'output-golden-v2.manifest.json#authority.viewBox', 'target geometry authority drifted');
expect(spec.authority.runtime.file === 'prototypes/editorial-systems/immersive.js', 'runtime authority drifted');
expect(spec.authority.runtime.sha256 === sha256(runtimePath), 'runtime hash drifted');
expect(spec.authority.runtime.animationImplementation === false, 'animation implementation is enabled in the choreography spec');
expect(!runtimeText.includes('output-golden-v2'), 'immersive.js contains Output v2 animation wiring');

const { timebase } = spec;
expect(timebase.transitionDurationMs === 8200, 'transition duration must be exactly 8200ms');
expect(timebase.finalHoldDurationMs === 1800, 'final hold must be exactly 1800ms');
expect(timebase.totalDurationMs === timebase.transitionDurationMs + timebase.finalHoldDurationMs, 'total duration does not equal transition plus hold');
expect(timebase.transitionProgress === 'elapsedMs / 8200' && timebase.totalProgress === 'elapsedMs / 10000', 'progress formula drifted');
expect(spec.sourceInventory.count === 72 && exactArray(spec.sourceInventory.sourceIds, sourceIds), 'choreography source inventory differs from the settled live bridge');
expect(spec.targetInventory.count === 113 && exactArray(spec.targetInventory.targetIds, targetIds), 'choreography target inventory differs from Output Golden v2');
expect(unique(spec.sourceInventory.sourceIds) && unique(spec.targetInventory.targetIds), 'choreography inventory IDs are not unique');
expect(exactArray(sourceIds, sourceManifestIds), 'settled Integrate source order differs from the approved manifest-derived inventory');
expect(bridge.sourceAuthority.runtime.settledEndpoint.phase === 'integrate' && bridge.sourceAuthority.runtime.settledEndpoint.scheduleIndex === 6, 'bridge does not start at settled Integrate');

const expectedStages = [
  ['C0', 0, 600], ['C1', 600, 1800], ['C2', 1700, 2800], ['C3', 2750, 4300],
  ['C4', 4250, 5200], ['C5', 5150, 6100], ['C6', 6050, 7200], ['C7', 7150, 8200], ['C8', 8200, 10000]
];
expect(exactArray(spec.stages.map((stage) => stage.id), expectedStages.map(([id]) => id)), 'stage IDs/order must be exactly C0-C8');
for (const [id, start, end] of expectedStages) {
  const stage = spec.stages.find((candidate) => candidate.id === id);
  expect(exactArray(stage.elapsedMs, [start, end]), `${id} elapsed window drifted`);
  expect(Math.abs(stage.transitionProgress[0] - start / 8200) < 0.000001 && Math.abs(stage.transitionProgress[1] - Math.min(end, 8200) / 8200) < 0.000001, `${id} normalized transition progress drifted`);
  expect(stage.windows && stage.hardGate?.id === `G${id.slice(1)}`, `${id} hard-gate binding is missing`);
  for (const window of Object.values(stage.windows)) {
    if (!window) continue;
    expect(Array.isArray(window) && window.length === 2 && window[0] <= window[1], `${id} contains an invalid timing window`);
    expect(window[0] >= start && window[1] <= end, `${id} contains a timing window outside its stage`);
  }
  expect(Array.isArray(stage.participatingSourceIds) && Array.isArray(stage.participatingTargetIds), `${id} lacks explicit participation IDs`);
  expect(unique(stage.participatingSourceIds) && unique(stage.participatingTargetIds), `${id} repeats participation IDs`);
  for (const sourceId of stage.participatingSourceIds) expect(sourceSet.has(sourceId), `${id} references unknown source ${sourceId}`);
  for (const targetId of stage.participatingTargetIds) expect(targetSet.has(targetId), `${id} references unknown target ${targetId}`);
  for (const action of stage.sequence || []) {
    expect(Array.isArray(action.windowMs) && action.windowMs[0] <= action.windowMs[1], `${id}/${action.id} has an invalid action window`);
    expect(action.windowMs[0] >= start && action.windowMs[1] <= end, `${id}/${action.id} action escapes the stage`);
    for (const sourceId of action.sourceIds || []) expect(sourceSet.has(sourceId), `${id}/${action.id} references unknown source ${sourceId}`);
    for (const targetId of action.targetIds || []) expect(targetSet.has(targetId), `${id}/${action.id} references unknown target ${targetId}`);
  }
}
const stageSourceUnion = new Set(spec.stages.flatMap((stage) => stage.participatingSourceIds));
const stageTargetUnion = new Set(spec.stages.flatMap((stage) => stage.participatingTargetIds));
const coversInventory = (values, inventory) => values.size === inventory.length && inventory.every((id) => values.has(id));
expect(coversInventory(stageSourceUnion, sourceIds), 'not every settled Integrate source participates in the choreography');
expect(coversInventory(stageTargetUnion, targetIds), 'not every Output v2 target participates in the choreography');
expect(spec.stages.find((stage) => stage.id === 'C8').frozen === true, 'final hold is not frozen');
expect(spec.stages.find((stage) => stage.id === 'C8').participatingSourceIds.length === 0, 'source remnants are scheduled during final hold');

const overlapWindows = spec.overlapPolicy.allowedOverlapWindowsMs;
expect(overlapWindows.length === 6, 'allowed overlap count drifted');
for (const overlap of overlapWindows) {
  const from = spec.stages.find((stage) => stage.id === overlap.fromStage);
  const to = spec.stages.find((stage) => stage.id === overlap.toStage);
  expect(from && to, `overlap references missing stage ${overlap.fromStage}/${overlap.toStage}`);
  expect(exactArray(overlap.windowMs, [to.elapsedMs[0], from.elapsedMs[1]]), `overlap window is not the exact stage seam for ${overlap.fromStage}/${overlap.toStage}`);
  expect(overlap.windowMs[1] - overlap.windowMs[0] <= 100, `overlap is too large for ${overlap.fromStage}/${overlap.toStage}`);
}
const dominantStages = spec.stages.filter((stage) => stage.dominantWindowMs && stage.dominantFamily && stage.id !== 'C8');
const events = dominantStages.flatMap((stage) => [[stage.dominantWindowMs[0], 1, stage.dominantFamily], [stage.dominantWindowMs[1], -1, stage.dominantFamily]]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
let activeDominant = 0;
let maxDominant = 0;
for (const [, delta] of events) { activeDominant += delta; maxDominant = Math.max(maxDominant, activeDominant); }
expect(maxDominant <= spec.overlapPolicy.maxConcurrentDominantFamilies, 'more than two dominant analytical families overlap');
expect(spec.overlapPolicy.noThreeFamilyDominance === true, 'three-family dominance gate is not enabled');

const expectedLabels = [
  ['label-overview-system-detail', 'output-v2-overview-title', 'C1'],
  ['label-distribution', 'output-v2-distribution-title', 'C2'],
  ['label-performance', 'output-v2-performance-title', 'C3'],
  ['label-trends', 'output-v2-trends-title', 'C4'],
  ['label-insights', 'output-v2-insights-title', 'C6']
];
expect(spec.persistentLabels.length === expectedLabels.length, 'persistent-label count drifted');
for (const [sourceId, targetId, stageId] of expectedLabels) {
  const label = spec.persistentLabels.find((candidate) => candidate.sourceId === sourceId);
  expect(label && label.targetId === targetId && label.continuousIdentity === true && label.noOpacityGap === true, `persistent label ${sourceId} is not continuous`);
  expect(label.sourcePosition?.manifest === 'integrate-golden-v26' && label.sourcePosition.objectId === sourceId, `persistent label ${sourceId} source position drifted`);
  expect(label.targetPosition?.manifest === 'output-golden-v2' && label.targetPosition.objectId === targetId, `persistent label ${sourceId} target position drifted`);
  const stage = spec.stages.find((candidate) => candidate.id === stageId);
  expect(label.travelWindowMs[0] >= stage.elapsedMs[0] && label.travelWindowMs[1] <= stage.elapsedMs[1] && label.settleWindowMs[0] >= stage.elapsedMs[0] && label.settleWindowMs[1] <= stage.elapsedMs[1], `persistent label ${sourceId} timing escapes ${stageId}`);
}

const performance = spec.stages.find((stage) => stage.id === 'C3');
expect(exactArray(spec.authority.targetManifest.manifestId === 'output-golden-v2' ? ['performance'] : [], ['performance']), 'Performance target authority drifted');
const performancePointActions = performance.sequence.filter((action) => /^performance-point-(7|8|9|10)$/.test(action.id));
expect(exactArray(performancePointActions.map((action) => action.id), ['performance-point-7', 'performance-point-8', 'performance-point-9', 'performance-point-10']), 'Performance additional-point sequence drifted');
for (const action of performancePointActions) expect(action.windowMs[0] >= 3700 && action.operation === 'split-local' && action.parentTargetId === 'output-v2-performance-line' && exactArray(action.sourceIds, ['performance-polyline']), `${action.id} is not a post-line local split`);
expect(performance.sequence.find((action) => action.id === 'performance-line-settle').windowMs[1] <= performancePointActions[0].windowMs[0], 'Performance points begin before line settlement');
expect(spec.sourceInventory.sourceIds.filter((id) => id.startsWith('performance-point-')).length === 6, 'Performance source inventory is not six existing points');
expect(spec.targetInventory.targetIds.filter((id) => /^output-v2-performance-point-/.test(id)).length === 10, 'Performance target inventory is not ten points');

const trends = spec.stages.find((stage) => stage.id === 'C4');
expect(targetManifest.inventory.trends.barCount === 4 && exactArray(targetManifest.inventory.trends.labels, ['JAN', 'APR', 'JUL', 'OCT']), 'Trends target inventory is not JAN/APR/JUL/OCT');
const trendMerge = trends.sequence.find((action) => action.id === 'trends-oct-merge');
expect(trendMerge && trendMerge.operation === 'merge-local' && exactArray(trendMerge.sourceIds, ['trends-bar-04', 'trends-bar-05']) && exactArray(trendMerge.targetIds, ['output-v2-trends-bar-oct']) && trendMerge.absorbedSourceId === 'trends-bar-05', 'Trends fifth-source merge is not explicit');
expect(!JSON.stringify(spec).match(/Q[1-5]/), 'Q1-Q5 labels remain in choreography spec');

const insights = spec.stages.find((stage) => stage.id === 'C6');
const insightsMerge = insights.sequence.find((action) => action.id === 'insights-fourth-consolidation');
expect(insightsMerge && insightsMerge.operation === 'merge-local' && exactArray(insightsMerge.sourceIds, ['insights-line-04', 'insights-dot-04']) && exactArray(insightsMerge.targetIds, ['output-v2-insights-row-3']) && exactArray(insightsMerge.absorbedSourceIds, ['insights-line-04', 'insights-dot-04']), 'Insights fourth-source consolidation is not explicit');
expect(insightsMerge.windowMs[0] >= insights.sequence.find((action) => action.id === 'insights-row-3').windowMs[1], 'Insights fourth source merges before row 3 exists');
expect(targetManifest.inventory.insights.rowCount === 3, 'Insights target inventory is not three rows');

const variance = spec.stages.find((stage) => stage.id === 'C5');
const varianceOrder = ['variance-panel', 'variance-heading-baseline', 'variance-base', 'variance-connector-1', 'variance-driver-1', 'variance-connector-2', 'variance-driver-2', 'variance-connector-3', 'variance-offset', 'variance-connector-4', 'variance-net-and-labels'];
expect(exactArray(variance.sequence.map((action) => action.id), varianceOrder), 'Variance progressive sequence drifted');
expect(targetManifest.inventory.variance.barCount === 5 && targetManifest.inventory.variance.connectorCount === 4, 'Variance target inventory drifted');

const system = spec.stages.find((stage) => stage.id === 'C7');
const systemNodes = system.sequence.filter((action) => /^system-(source-relate|model-review|use)$/.test(action.id));
expect(exactArray(systemNodes.map((action) => action.id), ['system-source-relate', 'system-model-review', 'system-use']), 'system nodes are not ordered left-to-right');
const systemLabels = system.sequence.find((action) => action.id === 'system-labels');
expect(systemLabels && exactArray(systemLabels.targetIds, ['output-v2-system-label-source', 'output-v2-system-label-relate', 'output-v2-system-label-model', 'output-v2-system-label-review', 'output-v2-system-label-use']), 'system labels are not staggered in order');
expect(targetManifest.inventory.systemLayer.nodeCount === 5 && targetManifest.inventory.systemLayer.labels.join('|') === 'SOURCE|RELATE|MODEL|REVIEW|USE', 'system-layer target inventory drifted');

const forbiddenCoordinateKeys = new Set(['x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'width', 'height', 'd', 'screenX', 'screenY', 'offset']);
const checkNoCoordinates = (value, location) => {
  if (!value || typeof value !== 'object') return;
  for (const [key, nested] of Object.entries(value)) {
    expect(!forbiddenCoordinateKeys.has(key), `${location} contains geometry/screen key ${key}`);
    checkNoCoordinates(nested, `${location}.${key}`);
  }
};
checkNoCoordinates(spec, 'choreography');

console.log('INTEGRATE_OUTPUT_V2_CHOREOGRAPHY_PASS');
console.log(JSON.stringify({
  transitionDurationMs: timebase.transitionDurationMs,
  finalHoldDurationMs: timebase.finalHoldDurationMs,
  totalDurationMs: timebase.totalDurationMs,
  stages: spec.stages.map((stage) => ({ id: stage.id, elapsedMs: stage.elapsedMs, dominantFamily: stage.dominantFamily })),
  sourceObjects: sourceIds.length,
  targetObjects: targetIds.length,
  persistentLabels: spec.persistentLabels.length,
  maxConcurrentDominantFamilies: maxDominant,
  performanceExpansion: 4,
  trendsBars: targetManifest.inventory.trends.barCount,
  insightsRows: targetManifest.inventory.insights.rowCount,
  varianceBars: targetManifest.inventory.variance.barCount,
  systemNodes: targetManifest.inventory.systemLayer.nodeCount,
  runtimeAnimationImplementation: spec.authority.runtime.animationImplementation
}, null, 2));
