import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(here, 'output-golden-v1.html');
const manifestPath = path.join(here, 'output-golden-v1.manifest.json');
const checkpointPath = path.join(here, 'output-golden-v1-checkpoint.png');
const html = fs.readFileSync(htmlPath, 'utf8');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const fail = (message) => { throw new Error(`OUTPUT_GOLDEN_V1_FAIL: ${message}`); };
const expect = (condition, message) => { if (!condition) fail(message); };
const geometryToken = (geometry) => Object.entries(geometry).map(([key, value]) => `${key}=${value}`).join(';');
const ids = [...html.matchAll(/data-object-id="([^"]+)"/g)].map((match) => match[1]);
const groups = [...html.matchAll(/data-group-id="([^"]+)"/g)].map((match) => match[1]);
const count = (pattern) => (html.match(pattern) || []).length;

expect(manifest.manifestId === 'output-golden-v1', 'manifest id is not v1');
expect(manifest.authority.file === 'prototypes/editorial-systems/output-golden-v1.html', 'authority file drifted');
expect(manifest.authority.runtimeAuthority === false, 'runtime output is incorrectly marked authoritative');
expect(manifest.authority.viewBox.width === 405 && manifest.authority.viewBox.height === 236, 'viewBox drifted');
expect(html.includes('viewBox="0 0 405 236"'), 'HTML viewBox drifted');
expect(fs.existsSync(checkpointPath), 'rendered checkpoint is missing from the review package');
const checkpoint = fs.readFileSync(checkpointPath);
expect(checkpoint.length >= 24 && checkpoint.readUInt32BE(16) === 405 && checkpoint.readUInt32BE(20) === 236, 'rendered checkpoint dimensions drifted');
expect(!html.includes('immersive.js') && !html.includes('integrate-output/transition.js'), 'golden references a runtime transition');
expect(!html.includes('128%') && !html.includes('94%') && !html.includes('2.4M'), 'stale Output metrics are present');
expect(!html.includes('static-output-art') && !html.includes('output-header-check'), 'stale runtime/static header geometry is present');
expect(!html.includes('<script'), 'golden must remain static');

const manifestIds = manifest.objects.map((object) => object.id);
expect(new Set(manifestIds).size === manifestIds.length, 'manifest object IDs are not unique');
expect(new Set(ids).size === ids.length, 'HTML object IDs are not unique');
expect(ids.length === manifestIds.length, `HTML object count ${ids.length} differs from manifest count ${manifestIds.length}`);
expect(ids.every((id) => manifestIds.includes(id)), 'HTML contains an object absent from the manifest');
expect(manifestIds.every((id) => ids.includes(id)), 'manifest contains an object absent from HTML');

for (const object of manifest.objects) {
  const idPattern = new RegExp(`data-object-id="${object.id.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}"`);
  expect(idPattern.test(html), `missing object ${object.id}`);
  expect(html.includes(`data-geometry="${geometryToken(object.geometry)}"`), `geometry drifted for ${object.id}`);
  if (object.text) expect(html.includes(`data-text="${object.text}"`), `text drifted for ${object.id}`);
}

const expectedGroups = ['output-root', ...manifest.hierarchy.groups.map((group) => group.id)];
expect(expectedGroups.every((id) => groups.includes(id)), 'hierarchy group is missing from HTML');
expect(manifest.hierarchy.groups.length === 5, 'hierarchy must contain exactly five panel groups');

expect(count(/data-object-id="output-panel-/g) === 5, 'expected exactly five panels');
expect(count(/data-object-id="output-overview-[^"]*-value"/g) === 3, 'expected exactly three Overview metrics');
expect(count(/class="donut-arc /g) === 3, 'expected exactly three Distribution accent arcs');
expect(count(/data-object-id="output-distribution-legend-[^"]*-dot"/g) === 4, 'expected exactly four Distribution legend dots');
expect(count(/data-object-id="output-distribution-legend-[^"]*-line"/g) === 4, 'expected exactly four Distribution legend lines');
expect(count(/data-object-id="output-performance-point-/g) === 7, 'expected exactly seven Performance points');
expect(count(/data-object-id="output-trends-bar-/g) === 5, 'expected exactly five Trends bars');
expect(count(/data-object-id="output-insights-row-/g) === 3, 'expected exactly three Insights rows');
expect(count(/data-object-id="output-insights-copy-/g) === 6, 'expected exactly six Insights detail lines');
expect(count(/data-object-id="output-trends-label-/g) === 5, 'expected exactly five Trends labels');

for (const text of ['$24.8M', '+18.6%', '42.7%', 'Revenue', 'Growth', 'Margin', 'Distribution', 'Performance', 'Insights', 'Trends', 'JAN', 'MAR', 'MAY', 'JUN', 'Q1', 'Q2', 'Q3', 'Q4', 'Q5']) {
  expect(html.includes(`>${text}<`), `required text missing: ${text}`);
}

const { inventory } = manifest;
expect(inventory.panelCount === 5, 'manifest panel inventory is not five');
expect(inventory.distribution.accentArcCount === 3, 'manifest Distribution arc inventory drifted');
expect(inventory.performance.pointCount === 7, 'manifest Performance point inventory drifted');
expect(inventory.insights.darkTreatment === true, 'manifest Insights dark treatment is not enabled');
expect(inventory.trends.barCount === 5, 'manifest Trends bar inventory drifted');

console.log('OUTPUT_GOLDEN_V1_PASS');
console.log(JSON.stringify({
  html: path.relative(process.cwd(), htmlPath),
  manifest: path.relative(process.cwd(), manifestPath),
  checkpoint: path.relative(process.cwd(), checkpointPath),
  objects: manifestIds.length,
  inventory
}, null, 2));
