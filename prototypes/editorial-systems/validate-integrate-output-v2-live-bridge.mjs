import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const bridgePath = path.join(here, 'integrate-output-v2-live-bridge.json');
const sourceManifestPath = path.join(here, 'integrate-golden-v26.manifest.json');
const sourceBridgePath = path.join(here, 'integrate-output-live-bridge.json');
const targetManifestPath = path.join(here, 'output-golden-v2.manifest.json');
const runtimePath = path.join(here, 'immersive.js');
const bridge = JSON.parse(fs.readFileSync(bridgePath, 'utf8'));
const sourceManifest = JSON.parse(fs.readFileSync(sourceManifestPath, 'utf8'));
const sourceBridge = JSON.parse(fs.readFileSync(sourceBridgePath, 'utf8'));
const targetManifest = JSON.parse(fs.readFileSync(targetManifestPath, 'utf8'));
const runtimeText = fs.readFileSync(runtimePath, 'utf8');

const fail = (message) => { throw new Error(`INTEGRATE_OUTPUT_V2_LIVE_BRIDGE_FAIL: ${message}`); };
const expect = (condition, message) => { if (!condition) fail(message); };
const sha256 = (filePath) => crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
const sameIds = (actual, expected) => actual.length === expected.length && actual.every((id, index) => id === expected[index]);
const targetObjects = new Map(targetManifest.objects.map((object) => [object.id, object]));
const sourceObjects = new Map(bridge.sourceObjects.map((object) => [object.id, object]));
const runtimeSourceObjects = new Map(sourceBridge.sourceObjects.map((object) => [object.id, object]));
const targetBridgeObjects = new Map(bridge.targetObjects.map((object) => [object.id, object]));

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

expect(bridge.id === 'integrate-output-v2-live-bridge-v1', 'bridge id drifted');
expect(bridge.sourceAuthority.runtime.conceptualStartingState === 'settled-integrate-endpoint', 'starting state is not settled Integrate');
expect(bridge.sourceAuthority.runtime.notStructureInventory === true && bridge.rules.notStructureInventory === true, 'Structure inventory is incorrectly used as the conceptual source');
expect(bridge.sourceAuthority.manifest.manifestId === 'integrate-golden-v26', 'source manifest authority drifted');
expect(bridge.sourceAuthority.manifest.sha256 === sha256(sourceManifestPath), 'source manifest hash drifted');
expect(bridge.sourceAuthority.runtimeBridge.file === 'prototypes/editorial-systems/integrate-output-live-bridge.json', 'settled runtime bridge file drifted');
expect(bridge.sourceAuthority.runtimeBridge.sha256 === sha256(sourceBridgePath), 'settled runtime bridge hash drifted');
expect(bridge.sourceAuthority.runtime.file === 'prototypes/editorial-systems/immersive.js', 'live runtime file drifted');
expect(bridge.sourceAuthority.runtime.sha256 === sha256(runtimePath), 'live runtime hash drifted');
expect(bridge.sourceAuthority.runtime.entrypoint === 'URLSearchParams immersive=1', 'live runtime entrypoint drifted');
expect(bridge.sourceAuthority.runtime.settledEndpoint.scheduleIndex === 6 && bridge.sourceAuthority.runtime.settledEndpoint.phase === 'integrate' && bridge.sourceAuthority.runtime.settledEndpoint.progress === 1, 'settled endpoint contract drifted');
expect(bridge.targetAuthority.manifest.manifestId === 'output-golden-v2', 'target manifest authority drifted');
expect(bridge.targetAuthority.manifest.sha256 === sha256(targetManifestPath), 'target manifest hash drifted');
expect(bridge.targetAuthority.manifest.geometryAuthority === 'output-golden-v2.manifest.json#authority.viewBox', 'target geometry does not resolve through the v2 manifest');

expect(sourceManifestIds.length === 72, `source manifest inventory is ${sourceManifestIds.length}, expected 72`);
expect(sourceBridge.sourceObjects.length === 72, `accepted live source bridge inventory is ${sourceBridge.sourceObjects.length}, expected 72`);
expect(bridge.sourceObjects.length === sourceManifestIds.length, `bridge source inventory is ${bridge.sourceObjects.length}, expected ${sourceManifestIds.length}`);
expect(sameIds(sourceManifestIds, sourceBridge.sourceObjects.map((object) => object.id)), 'accepted live source bridge does not cover the full Integrate manifest inventory');
expect(sameIds(sourceManifestIds, bridge.sourceObjects.map((object) => object.id)), 'v2 bridge source inventory does not cover the full Integrate manifest inventory');
expect(sourceObjects.size === bridge.sourceObjects.length, 'source IDs are not unique');
expect(targetManifest.objects.length === 113, `Output v2 manifest inventory is ${targetManifest.objects.length}, expected 113`);
expect(bridge.targetObjects.length === targetManifest.objects.length, `bridge target inventory is ${bridge.targetObjects.length}, expected ${targetManifest.objects.length}`);
expect(targetBridgeObjects.size === bridge.targetObjects.length, 'target IDs are not unique');
expect(sameIds(targetManifest.objects.map((object) => object.id), bridge.targetObjects.map((object) => object.id)), 'v2 bridge target inventory/order differs from Output Golden v2');

const familyContracts = new Map((sourceBridge.runtime.familyContracts || []).map((family) => [family.family, family]));
for (const family of familyContracts.values()) expect(runtimeText.includes(family.sourceExpression), `live runtime source expression is missing for ${family.family}`);
expect(runtimeText.includes("if (params.get('immersive') !== '1') return;"), 'immersive entrypoint is missing from live runtime');
expect(runtimeText.includes("{ phase: 'integrate', start: time(18000), end: time(22800) }"), 'settled Integrate schedule entry is missing from live runtime');
expect(runtimeText.includes('const nodeSpecs = Array.from({ length: 50 }'), 'live runtime node source is not the 50-node runtime');
expect(runtimeText.includes('const nodeElements = nodeSpecs.map((spec) => {'), 'live runtime nodeElements source is missing');
expect(!runtimeText.includes('output-golden-v2'), 'Output v2 was wired into runtime animation before the mapping milestone');

for (const source of bridge.sourceObjects) {
  expect(runtimeSourceObjects.has(source.runtimeSourceId), `runtime source ${source.runtimeSourceId} does not exist in the accepted live source bridge`);
  expect(source.id === source.runtimeSourceId, `source ${source.id} has an inconsistent runtime source identity`);
  const liveSource = runtimeSourceObjects.get(source.runtimeSourceId);
  expect(liveSource.visibleAtSettledEndpoint === true, `source ${source.id} is not visible at the settled Integrate endpoint`);
  expect(liveSource.runtime?.family && familyContracts.has(liveSource.runtime.family), `source ${source.id} has an unknown live runtime family`);
  const contract = familyContracts.get(liveSource.runtime.family);
  const runtime = liveSource.runtime;
  if (runtime.family === 'nodeElements') {
    expect(Number.isInteger(runtime.index) && runtime.index >= 0 && runtime.index < contract.count, `source ${source.id} has an invalid nodeElements index`);
    expect(runtime.part === 'shape' || runtime.part === 'detail', `source ${source.id} has an invalid nodeElements part`);
  } else if (runtime.family === 'networkElements') {
    expect(Number.isInteger(runtime.index) && runtime.index >= 0 && runtime.index < contract.count, `source ${source.id} has an invalid networkElements index`);
  } else if (runtime.family === 'roleFrameElements') {
    expect(/^role-frame-(trend|distribution|performance|insights|overview)$/.test(runtime.runtimeId), `source ${source.id} has an invalid role-frame runtime ID`);
    expect(runtimeText.includes('const integrateFrames = {') && runtimeText.includes('const roleFrameElements = Object.entries(integrateFrames).map'), `source ${source.id} role frame cannot be resolved in immersive.js`);
  } else if (runtime.family === 'integrateLabelElements') {
    expect(sourceManifestIds.includes(runtime.targetId), `source ${source.id} points to an unknown Integrate label target`);
    expect(runtimeText.includes('const integrateLabelElements = [];') && runtimeText.includes('integrateLabelElements.push'), `source ${source.id} label collection cannot be resolved in immersive.js`);
  } else if (runtime.family === 'integrateSplitElements') {
    expect(sourceManifestIds.includes(runtime.targetId), `source ${source.id} points to an unknown Integrate split target`);
    expect(runtimeText.includes('const integrateSplitElements = [];') && runtimeText.includes('integrateSplitLayer.append'), `source ${source.id} split collection cannot be resolved in immersive.js`);
  } else if (runtime.family === 'lineTrack') {
    expect(runtimeText.includes('const lineTrack = {'), `source ${source.id} line track cannot be resolved in immersive.js`);
  } else {
    expect(typeof runtime.object === 'string' && runtime.object.length > 0, `source ${source.id} has no concrete runtime object identity`);
    expect(runtime.object.split(/['"]+/).some((fragment) => fragment.length > 3 && runtimeText.includes(fragment)), `source ${source.id} runtime object cannot be resolved in immersive.js`);
  }
  const disposition = source.disposition;
  expect(disposition && typeof disposition.operation === 'string', `source ${source.id} has no disposition`);
  expect(['direct', 'persist', 'resize', 'reshape', 'merge', 'split', 'move', 'become'].includes(disposition.operation), `source ${source.id} has unsupported disposition ${disposition.operation}`);
  expect(Array.isArray(disposition.targetIds) && disposition.targetIds.length > 0, `source ${source.id} has no target IDs`);
  expect(new Set(disposition.targetIds).size === disposition.targetIds.length, `source ${source.id} repeats a target ID`);
  if (disposition.operation === 'split') expect(disposition.targetIds.length > 1, `source ${source.id} uses split for ${disposition.targetIds.length} target; split requires more than one target`);
  if (disposition.targetIds.length > 1) expect(disposition.operation === 'split' || disposition.multiTarget === true && typeof disposition.multiTargetOperation === 'string', `source ${source.id} has multiple targets without an explicit multi-target operation`);
  for (const targetId of disposition.targetIds) expect(targetObjects.has(targetId), `source ${source.id} points to missing target ${targetId}`);
}

const sourceTargets = new Map(bridge.sourceObjects.map((source) => [source.id, new Set(source.disposition.targetIds)]));
for (const target of bridge.targetObjects) {
  expect(Array.isArray(target.sourceIds) && target.sourceIds.length > 0, `target ${target.id} has no source IDs`);
  expect(new Set(target.sourceIds).size === target.sourceIds.length, `target ${target.id} repeats a source ID`);
  for (const sourceId of target.sourceIds) {
    expect(sourceTargets.has(sourceId), `target ${target.id} references unknown source ${sourceId}`);
    expect(sourceTargets.get(sourceId).has(target.id), `target ${target.id} claims source ${sourceId} without a matching source disposition`);
  }
}
for (const source of bridge.sourceObjects) for (const targetId of source.disposition.targetIds) expect(targetBridgeObjects.get(targetId).sourceIds.includes(source.id), `source ${source.id} points to ${targetId} without reverse target ownership`);

const persistentLabels = [
  ['label-overview-system-detail', 'output-v2-overview-title'],
  ['label-distribution', 'output-v2-distribution-title'],
  ['label-performance', 'output-v2-performance-title'],
  ['label-trends', 'output-v2-trends-title'],
  ['label-insights', 'output-v2-insights-title']
];
expect(JSON.stringify(bridge.rules.persistentLabels.map(({ sourceId, targetId }) => [sourceId, targetId])) === JSON.stringify(persistentLabels), 'persistent label mapping list drifted');
for (const [sourceId, targetId] of persistentLabels) {
  const source = sourceObjects.get(sourceId);
  const target = targetBridgeObjects.get(targetId);
  expect(source.disposition.operation === 'persist' && source.disposition.primaryTargetId === targetId && source.disposition.identityPreserved === true, `persistent source ${sourceId} is not declared as identity-preserving`);
  if (sourceId === 'label-overview-system-detail') expect(source.disposition.multiTarget === true && source.disposition.multiTargetOperation === 'persist-primary-with-derived-system-detail', 'Overview/System Detail persistence expansion is not explicitly multi-target');
  expect(target.identity?.sourceId === sourceId && target.identity.primary === true && target.composition === 'persist', `persistent target ${targetId} is not declared as identity-preserving`);
}

const pointSourceIds = ['performance-point-01', 'performance-point-02', 'performance-point-03', 'performance-point-04', 'performance-point-05', 'performance-point-06'];
for (const [index, sourceId] of pointSourceIds.entries()) expect(JSON.stringify(targetBridgeObjects.get(`output-v2-performance-point-${index + 1}`).sourceIds) === JSON.stringify([sourceId]), `existing Performance point ${sourceId} does not map directly to v2 point ${index + 1}`);
for (const index of [7, 8, 9, 10]) {
  const target = targetBridgeObjects.get(`output-v2-performance-point-${index}`);
  expect(JSON.stringify(target.sourceIds) === JSON.stringify(['performance-polyline']), `additional Performance point ${index} is not sourced from the established line`);
  expect(target.composition === 'split-from-established-line' && target.origin?.sourceId === 'performance-polyline' && target.origin.parentTargetId === 'output-v2-performance-line' && target.origin.mode === 'local-split-after-line-settles', `additional Performance point ${index} does not declare local post-settlement origin`);
}
expect(bridge.rules.performanceExpansion.additionalPointTargetIds.length === 4 && bridge.rules.performanceExpansion.parentSourceId === 'performance-polyline' && bridge.rules.performanceExpansion.parentTargetId === 'output-v2-performance-line', 'Performance expansion rule drifted');

expect(targetManifest.inventory.trends.barCount === 4, 'Output v2 Trends inventory is not four bars');
expect(JSON.stringify(targetManifest.inventory.trends.labels) === JSON.stringify(['JAN', 'APR', 'JUL', 'OCT']), 'Output v2 Trends labels drifted');
expect(!JSON.stringify(bridge).match(/Q[1-5]/), 'stale Q1-Q5 labels remain in the v2 bridge');
expect(JSON.stringify(targetBridgeObjects.get('output-v2-trends-bar-oct').sourceIds) === JSON.stringify(['trends-bar-04', 'trends-bar-05']), 'fifth Trends source is not explicitly merged into OCT');
expect(sourceObjects.get('trends-bar-05').disposition.operation === 'merge' && sourceObjects.get('trends-bar-05').disposition.targetIds[0] === 'output-v2-trends-bar-oct', 'fifth Trends source has no explicit absorption disposition');
expect(bridge.rules.trendsCheckpointPolicy.absorbedSourceId === 'trends-bar-05' && bridge.rules.trendsCheckpointPolicy.absorbedIntoTargetId === 'output-v2-trends-bar-oct', 'Trends absorption rule drifted');

const insightsRow3 = targetBridgeObjects.get('output-v2-insights-row-3');
expect(insightsRow3.composition === 'merge-4-to-3', 'Insights row 3 is not the explicit 4-to-3 merge');
expect(insightsRow3.origin?.parentSource === 'insights-line-03' && JSON.stringify(insightsRow3.origin.absorbedSources) === JSON.stringify(['insights-line-04', 'insights-dot-04']), 'Insights fourth line/dot absorption is not explicit');
expect(sourceObjects.get('insights-line-04').disposition.operation === 'merge' && sourceObjects.get('insights-dot-04').disposition.operation === 'merge', 'Insights fourth sources do not explicitly merge');
expect(bridge.rules.insightsConsolidation.absorbedSourceIds.includes('insights-line-04') && bridge.rules.insightsConsolidation.absorbedSourceIds.includes('insights-dot-04'), 'Insights consolidation rule drifted');

const varianceIds = [
  'output-v2-panel-variance', 'output-v2-variance-title', 'output-v2-variance-eyebrow', 'output-v2-variance-baseline',
  'output-v2-variance-bar-base', 'output-v2-variance-bar-driver-1', 'output-v2-variance-bar-driver-2', 'output-v2-variance-bar-offset', 'output-v2-variance-bar-net',
  'output-v2-variance-connector-1', 'output-v2-variance-connector-2', 'output-v2-variance-connector-3', 'output-v2-variance-connector-4',
  'output-v2-variance-label-base', 'output-v2-variance-label-driver-1', 'output-v2-variance-label-driver-2', 'output-v2-variance-label-offset', 'output-v2-variance-label-net'
];
for (const id of varianceIds) expect(targetBridgeObjects.has(id) && targetBridgeObjects.get(id).sourceIds.length > 0, `Variance target ${id} lacks traceable ownership`);
expect(targetBridgeObjects.get('output-v2-panel-variance').sourceIds.some((id) => id.startsWith('core-tile-')), 'Variance panel is not sourced from core material');
expect(targetBridgeObjects.get('output-v2-variance-baseline').sourceIds.some((id) => id.startsWith('support-rail-')), 'Variance baseline is not sourced from support geometry');
expect(bridge.rules.varianceOwnership.barCount === 5 && bridge.rules.varianceOwnership.connectorCount === 4, 'Variance ownership rule drifted');

const systemIds = ['output-v2-system-line', 'output-v2-system-node-source', 'output-v2-system-node-relate', 'output-v2-system-node-model', 'output-v2-system-node-review', 'output-v2-system-node-use', 'output-v2-system-label-source', 'output-v2-system-label-relate', 'output-v2-system-label-model', 'output-v2-system-label-review', 'output-v2-system-label-use'];
for (const id of systemIds) expect(targetBridgeObjects.has(id) && targetBridgeObjects.get(id).sourceIds.length > 0, `system target ${id} lacks traceable ownership`);
expect(targetBridgeObjects.get('output-v2-system-line').sourceIds.some((id) => id.startsWith('support-rail-')), 'system line is not sourced from support rails');
expect(targetBridgeObjects.get('output-v2-system-node-source').sourceIds.some((id) => id.endsWith('-plus')), 'system source node is not sourced from core mark material');
expect(targetBridgeObjects.get('output-v2-system-label-source').sourceIds.some((id) => id.startsWith('overview-rail-')), 'system label is not sourced from settled Overview rails');
expect(bridge.rules.systemLayerOwnership.nodeCount === 5 && bridge.rules.systemLayerOwnership.labelCount === 5, 'system-layer ownership rule drifted');

const forbiddenCoordinateKeys = new Set(['x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'width', 'height', 'd', 'screenX', 'screenY', 'offset']);
const checkNoCoordinates = (value, location) => {
  if (!value || typeof value !== 'object') return;
  for (const [key, nested] of Object.entries(value)) {
    expect(!forbiddenCoordinateKeys.has(key), `${location} contains screen/geometry key ${key}`);
    checkNoCoordinates(nested, `${location}.${key}`);
  }
};
checkNoCoordinates(bridge.sourceObjects, 'sourceObjects');
checkNoCoordinates(bridge.targetObjects, 'targetObjects');

console.log('INTEGRATE_OUTPUT_V2_LIVE_BRIDGE_PASS');
console.log(JSON.stringify({
  sourceManifestObjects: sourceManifestIds.length,
  settledLiveSourceObjects: bridge.sourceObjects.length,
  targetManifestObjects: targetManifest.objects.length,
  targetOwnershipObjects: bridge.targetObjects.length,
  splitSources: bridge.sourceObjects.filter((source) => source.disposition.operation === 'split').length,
  mergeSourceDispositions: bridge.sourceObjects.filter((source) => source.disposition.operation === 'merge').length,
  mergeTargets: bridge.targetObjects.filter((target) => target.sourceIds.length > 1).length,
  persistentLabels: bridge.rules.persistentLabels.length,
  performanceExistingPoints: pointSourceIds.length,
  performanceAdditionalPoints: bridge.rules.performanceExpansion.additionalPointTargetIds.length,
  trendsBars: targetManifest.inventory.trends.barCount,
  trendsLabels: targetManifest.inventory.trends.labels,
  insightsRows: targetManifest.inventory.insights.rowCount,
  varianceBars: targetManifest.inventory.variance.barCount,
  systemNodes: targetManifest.inventory.systemLayer.nodeCount,
  runtimeFile: bridge.sourceAuthority.runtime.file,
  runtimeNodeFamilyCount: 50,
  targetGeometryAuthority: bridge.targetAuthority.manifest.geometryAuthority,
  v2RuntimeAnimationWired: false
}, null, 2));
