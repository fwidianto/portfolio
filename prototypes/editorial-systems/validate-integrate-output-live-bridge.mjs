import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../..');
const resolveRepo = (relativePath) => path.join(repoRoot, relativePath.split('/').join(path.sep));
const readJson = (relativePath) => JSON.parse(fs.readFileSync(resolveRepo(relativePath), 'utf8'));
const bridge = readJson('prototypes/editorial-systems/integrate-output-live-bridge.json');
const integrateManifest = readJson('prototypes/editorial-systems/integrate-golden-v26.manifest.json');
const outputManifest = readJson('prototypes/editorial-systems/output-golden-v1.manifest.json');
const sourceBridge = readJson('prototypes/editorial-systems/integrate-live-source-bridge.json');
const runtimePath = resolveRepo(bridge.runtime.file);
const runtimeSource = fs.readFileSync(runtimePath, 'utf8');

const fail = (message) => { throw new Error(`INTEGRATE_OUTPUT_BRIDGE_FAIL: ${message}`); };
const expect = (condition, message) => { if (!condition) fail(message); };
const deepEqual = (actual, expected, message) => {
  try { assert.deepEqual(actual, expected); } catch { fail(message); }
};
const sha256 = (filePath) => crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
const pad = (value) => String(value).padStart(2, '0');
const ids = (objects) => objects.map(({ id }) => id);

const flattenIntegrateObjects = () => [
  ...integrateManifest.core.tiles.flatMap((tile) => [tile, tile.mark]),
  ...integrateManifest.core.baseHairlines,
  ...integrateManifest.supportGeometry,
  integrateManifest.widgets.distribution.label,
  integrateManifest.widgets.distribution.ring,
  ...integrateManifest.widgets.distribution.accentArcs,
  integrateManifest.widgets.trends.label,
  ...integrateManifest.widgets.trends.bars,
  integrateManifest.widgets.trends.baseline,
  integrateManifest.widgets.performance.label,
  integrateManifest.widgets.performance.polyline,
  ...integrateManifest.widgets.performance.points,
  integrateManifest.widgets.insights.label,
  ...integrateManifest.widgets.insights.lines,
  ...integrateManifest.widgets.insights.dots,
  integrateManifest.widgets.overviewSystemDetail.label,
  ...integrateManifest.widgets.overviewSystemDetail.hairlines,
  ...integrateManifest.widgets.overviewSystemDetail.rails
];

const integrateObjects = flattenIntegrateObjects();
const integrateIds = ids(integrateObjects);
const outputIds = ids(outputManifest.objects);
const integrateById = new Map(integrateObjects.map((object) => [object.id, object]));
const outputById = new Map(outputManifest.objects.map((object) => [object.id, object]));
const sourceById = new Map(bridge.sourceObjects.map((object) => [object.id, object]));
const targetById = new Map(bridge.targetObjects.map((object) => [object.id, object]));

expect(bridge.id === 'integrate-output-live-bridge-v1', 'bridge id');
expect(bridge.sourceManifest.manifestId === integrateManifest.id, 'source manifest identity');
expect(bridge.targetManifest.manifestId === outputManifest.manifestId, 'target manifest identity');
expect(sha256(resolveRepo(bridge.sourceManifest.file)) === bridge.sourceManifest.sha256, 'source Integrate manifest hash drifted');
expect(sha256(resolveRepo(bridge.targetManifest.file)) === bridge.targetManifest.sha256, 'target Output manifest hash drifted');
expect(fs.existsSync(runtimePath), 'live runtime source does not exist');
expect(sha256(runtimePath) === bridge.runtime.sha256, 'live runtime source hash drifted');
expect(sha256(resolveRepo(bridge.runtime.lockedNodeOrderDependency.file)) === bridge.runtime.lockedNodeOrderDependency.sha256, 'locked runtime node-order dependency hash drifted');

expect(integrateManifest.id === 'integrate-golden-v26', 'Integrate manifest is not v26');
expect(integrateManifest.core.tiles.length === 13, 'Integrate source target inventory is not 13 core tiles');
deepEqual(integrateManifest.core.rowCounts, [6, 4, 2, 1], 'Integrate source row ownership drifted');
expect(integrateIds.length === 72, 'Integrate source target inventory must contain 72 objects');
expect(outputManifest.manifestId === 'output-golden-v1', 'Output target inventory is not Golden v1');
expect(outputIds.length === 72, 'Output target inventory must contain 72 objects');
expect(new Set(integrateIds).size === integrateIds.length, 'Integrate manifest IDs are not unique');
expect(new Set(outputIds).size === outputIds.length, 'Output manifest IDs are not unique');
deepEqual(bridge.sourceObjects.map(({ id }) => id), integrateIds, 'bridge does not cover Integrate manifest IDs exactly');
deepEqual(bridge.targetObjects.map(({ id }) => id), outputIds, 'bridge does not cover Output manifest IDs exactly');
expect(runtimeSource.includes('const nodeSpecs = Array.from({ length: 50 }, (_, index) => {'), 'live runtime node source is not 50 persistent nodes');
expect(runtimeSource.includes('const nodeElements = nodeSpecs.map((spec) => {'), 'live runtime nodeElements collection is missing');
expect(runtimeSource.includes('const HOLD_INTEGRATE_ENDPOINT = true;'), 'settled Integrate hold is not enabled');
expect(runtimeSource.includes('if (HOLD_INTEGRATE_ENDPOINT && elapsed >= integrateEnd)'), 'runtime does not settle at Integrate endpoint');

const expectedFamilyCounts = new Map([
  ['nodeElements', 50],
  ['integrateSplitElements', 5],
  ['integrateLabelElements', 5],
  ['networkElements', 65],
  ['boundaryElements', 5],
  ['roleFrameElements', 5],
  ['lineTrack', 1],
  ['insightTracks', 3],
  ['outputFlowPath', 1],
  ['outputFlowNodes', 4],
  ['outputTracePaths', 0],
  ['outputFindingChevrons', 3],
  ['outputLabels', 11],
  ['outputMetrics', 3]
]);
const contractsByFamily = new Map(bridge.runtime.familyContracts.map((contract) => [contract.family, contract]));
deepEqual([...contractsByFamily.keys()].sort(), [...expectedFamilyCounts.keys()].sort(), 'runtime family contract inventory drifted');
for (const [family, count] of expectedFamilyCounts) {
  const contract = contractsByFamily.get(family);
  expect(contract.count === count, `${family} runtime contract count`);
  expect(runtimeSource.includes(contract.sourceExpression), `${family} source expression is absent from live runtime`);
}
const runtimeFamilyByName = new Map(bridge.runtimeObjects.families.map((family) => [family.family, family]));
deepEqual([...runtimeFamilyByName.keys()].sort(), [...expectedFamilyCounts.keys()].sort(), 'runtime family disposition inventory drifted');

const expandRange = (range) => {
  if (range.ids) return range.ids;
  return Array.from({ length: range.to - range.from + 1 }, (_, offset) => range.from + offset);
};
const endpointMemberCounts = (family) => {
  const visible = [
    ...(family.visibleIndices || []),
    ...(family.visibleTargetIds || []),
    ...(family.visibleRuntimeIds || [])
  ];
  const retired = [
    ...(family.retiredIndices || []),
    ...(family.retiredTargetIds || []),
    ...(family.retiredRuntimeIds || [])
  ];
  for (const range of family.retiredRanges || []) retired.push(...expandRange(range));
  return { visible, retired };
};
let generatedRuntimeObjects = 0;
let visibleRuntimeElements = 0;
for (const [familyName, expectedCount] of expectedFamilyCounts) {
  const family = runtimeFamilyByName.get(familyName);
  const contract = contractsByFamily.get(familyName);
  expect(family.count === expectedCount, `${familyName} runtime family count`);
  const { visible, retired } = endpointMemberCounts(family);
  expect(new Set(visible).size === visible.length, `${familyName} visible endpoint members are duplicated`);
  expect(new Set(retired).size === retired.length, `${familyName} retired endpoint members are duplicated`);
  expect(visible.every((member) => !retired.includes(member)), `${familyName} endpoint member is both visible and retired`);
  expect(visible.length + retired.length === expectedCount, `${familyName} endpoint disposition coverage`);
  if (retired.length) expect(family.retiredDisposition && family.retiredDisposition.length > 0, `${familyName} retired objects have no disposition`);
  if (contract.selectorTemplate) expect(contract.selectorTemplate.length > 0, `${familyName} selector contract is empty`);
  generatedRuntimeObjects += expectedCount;
  visibleRuntimeElements += visible.length;
}
expect(generatedRuntimeObjects === bridge.runtimeObjects.generatedCount, 'generated runtime object count');
expect(visibleRuntimeElements === bridge.runtimeObjects.visibleSettledElementCount, 'visible settled runtime element count');
expect(bridge.runtimeObjects.visibleSettledManifestPartCount === integrateIds.length, 'visible settled manifest-part count');

const sourceBridgeFamily = (sourceExpression) => sourceBridge.runtimeObjects.families.find((family) => family.sourceExpression === sourceExpression);
const familyTargetRefs = (family, runtimeId) => {
  if (!family) return [];
  const range = family.ranges.find((candidate) => {
    const candidateIds = candidate.ids || expandRange(candidate).map((index) => family.idFormat.replace('%02d', pad(index)));
    return candidateIds.includes(runtimeId);
  });
  return range?.targetRefs || [];
};
const liveNodeFor = (index) => sourceBridge.liveNodes.find((node) => node.index === index);
const runtimeContract = (family) => contractsByFamily.get(family);
const assertRuntimeIdentity = (sourceObject) => {
  const runtime = sourceObject.runtime;
  const contract = runtimeContract(runtime.family);
  expect(contract, `${sourceObject.id} uses unknown runtime family ${runtime.family}`);
  expect(typeof runtime.object === 'string' && runtime.object.length > 0, `${sourceObject.id} has no runtime object expression`);
  if (runtime.family === 'nodeElements') {
    expect(Number.isInteger(runtime.index) && runtime.index >= 0 && runtime.index < 50, `${sourceObject.id} node index is outside live runtime`);
    expect(runtime.part === 'shape' || runtime.part === 'detail', `${sourceObject.id} node part is not shape/detail`);
    expect(runtime.object === `nodeElements[${runtime.index}].${runtime.part}`, `${sourceObject.id} node object expression drifted`);
    const node = liveNodeFor(runtime.index);
    expect(node?.targetRefs?.includes(sourceObject.id), `${sourceObject.id} is not assigned to live node ${runtime.index}`);
  } else if (runtime.family === 'integrateSplitElements' || runtime.family === 'integrateLabelElements') {
    expect(runtime.targetId === sourceObject.id, `${sourceObject.id} runtime target identity drifted`);
    expect(runtime.object.includes(`target.id === '${runtime.targetId}'`), `${sourceObject.id} runtime lookup is not target-specific`);
    expect(sourceBridge.liveNodes.some((node) => node.targetRefs.includes(sourceObject.id)), `${sourceObject.id} split/label is not produced by the live runtime bridge`);
  } else if (runtime.family === 'networkElements') {
    expect(Number.isInteger(runtime.index) && runtime.index >= 0 && runtime.index < 65, `${sourceObject.id} network index is outside live runtime`);
    expect(runtime.runtimeId === `network-edge-${pad(runtime.index)}`, `${sourceObject.id} network runtime id drifted`);
    expect(runtime.object === `networkElements[${runtime.index}].path`, `${sourceObject.id} network object expression drifted`);
    expect(familyTargetRefs(sourceBridgeFamily('networkElements'), runtime.runtimeId).includes(sourceObject.id), `${sourceObject.id} is not assigned to live support network edge ${runtime.runtimeId}`);
  } else if (runtime.family === 'roleFrameElements') {
    expect(contract.runtimeIds.includes(runtime.runtimeId), `${sourceObject.id} role-frame runtime id is unknown`);
    expect(runtime.object.includes(`runtimeId === '${runtime.runtimeId}'`), `${sourceObject.id} role-frame lookup is not target-specific`);
    expect(familyTargetRefs(sourceBridgeFamily('roleFrameElements'), runtime.runtimeId).includes(sourceObject.id), `${sourceObject.id} is not assigned to live role frame ${runtime.runtimeId}`);
  } else if (runtime.family === 'lineTrack') {
    expect(sourceObject.id === 'performance-polyline', 'lineTrack is assigned to an unexpected Integrate target');
    expect(runtime.object === 'lineTrack.path', `${sourceObject.id} line-track object expression drifted`);
    expect(familyTargetRefs(sourceBridgeFamily('lineTrack'), 'performance-line').includes(sourceObject.id), `${sourceObject.id} is not assigned to the live line track`);
  } else {
    fail(`${sourceObject.id} references an unsupported visible runtime family ${runtime.family}`);
  }
};

const allowedOperations = new Set(['move', 'resize', 'reshape', 'merge', 'split', 'become']);
for (const sourceObject of bridge.sourceObjects) {
  expect(integrateById.has(sourceObject.id), `source object ${sourceObject.id} is not in Integrate manifest`);
  expect(sourceObject.visibleAtSettledEndpoint === true, `${sourceObject.id} is not marked visible at settled Integrate endpoint`);
  expect(sourceObject.disposition && allowedOperations.has(sourceObject.disposition.operation), `${sourceObject.id} has no valid disposition`);
  expect(typeof sourceObject.disposition.reason === 'string' && sourceObject.disposition.reason.length > 0, `${sourceObject.id} disposition has no reason`);
  expect(Array.isArray(sourceObject.disposition.targetIds) && sourceObject.disposition.targetIds.length > 0, `${sourceObject.id} has no Output disposition`);
  expect(sourceObject.disposition.targetIds.every((targetId) => outputById.has(targetId)), `${sourceObject.id} references an unknown Output target`);
  expect((sourceObject.disposition.operation === 'split') === (sourceObject.disposition.targetIds.length > 1), `${sourceObject.id} split declaration does not match target count`);
  assertRuntimeIdentity(sourceObject);
}

for (const targetObject of bridge.targetObjects) {
  expect(outputById.has(targetObject.id), `target object ${targetObject.id} is not in Output manifest`);
  expect(Array.isArray(targetObject.sourceIds) && targetObject.sourceIds.length > 0, `${targetObject.id} has no Integrate source`);
  expect(new Set(targetObject.sourceIds).size === targetObject.sourceIds.length, `${targetObject.id} source IDs are duplicated`);
  expect(targetObject.sourceIds.every((sourceId) => sourceById.has(sourceId)), `${targetObject.id} references an unknown Integrate source`);
  expect((targetObject.sourceIds.length > 1) === (targetObject.composition === 'merge'), `${targetObject.id} merge declaration does not match source count`);
}

const sourceTargetMap = new Map(bridge.sourceObjects.map((sourceObject) => [sourceObject.id, new Set(sourceObject.disposition.targetIds)]));
for (const targetObject of bridge.targetObjects) {
  const expectedSources = new Set([...sourceTargetMap.entries()].filter(([, targetIds]) => targetIds.has(targetObject.id)).map(([sourceId]) => sourceId));
  deepEqual([...targetObject.sourceIds].sort(), [...expectedSources].sort(), `${targetObject.id} inverse source ownership is inconsistent`);
}
for (const sourceObject of bridge.sourceObjects) {
  const expectedTargets = new Set(sourceObject.disposition.targetIds);
  const actualTargets = new Set(bridge.targetObjects.filter((targetObject) => targetObject.sourceIds.includes(sourceObject.id)).map((targetObject) => targetObject.id));
  deepEqual([...actualTargets].sort(), [...expectedTargets].sort(), `${sourceObject.id} inverse target ownership is inconsistent`);
}

const mergeTargets = bridge.targetObjects.filter((targetObject) => targetObject.composition === 'merge');
const splitSources = bridge.sourceObjects.filter((sourceObject) => sourceObject.disposition.operation === 'split');
expect(mergeTargets.length > 0, 'no explicit merge targets were declared');
expect(splitSources.length > 0, 'no explicit split sources were declared');
expect(bridge.rules.everySettledIntegrateManifestObjectRequired === true, 'source coverage rule is disabled');
expect(bridge.rules.everyOutputManifestObjectRequired === true, 'target coverage rule is disabled');
expect(bridge.rules.splitMustBeDeclaredOnSource === true, 'split rule is disabled');
expect(bridge.rules.mergeMustBeDeclaredOnTarget === true, 'merge rule is disabled');
expect(bridge.rules.hiddenRuntimeObjectsMustHaveDisposition === true, 'hidden runtime disposition rule is disabled');
expect(bridge.rules.legacyStructureInventoryAsStartingState === false, 'legacy Structure inventory is incorrectly selected as the starting state');
expect(bridge.rules.animationChangesInThisArtifact === false, 'bridge artifact claims animation changes');
expect(bridge.rules.mp4Required === false, 'bridge incorrectly requires MP4');

console.log('INTEGRATE_OUTPUT_LIVE_BRIDGE_PASS');
console.log(JSON.stringify({
  sourceManifestObjects: integrateIds.length,
  targetManifestObjects: outputIds.length,
  sourceDispositions: bridge.sourceObjects.length,
  targetDispositions: bridge.targetObjects.length,
  generatedRuntimeObjects,
  visibleRuntimeElements,
  visibleSettledManifestParts: bridge.runtimeObjects.visibleSettledManifestPartCount,
  mergeTargets: mergeTargets.length,
  splitSources: splitSources.length,
  runtimeFile: bridge.runtime.file,
  settledEndpoint: bridge.runtime.settledEndpoint
}, null, 2));
