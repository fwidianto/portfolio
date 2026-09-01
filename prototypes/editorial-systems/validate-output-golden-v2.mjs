import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(here, 'output-golden-v2.html');
const manifestPath = path.join(here, 'output-golden-v2.manifest.json');
const checkpointPath = path.join(here, 'output-golden-v2-checkpoint.png');
const html = fs.readFileSync(htmlPath, 'utf8');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const fail = (message) => { throw new Error(`OUTPUT_GOLDEN_V2_FAIL: ${message}`); };
const expect = (condition, message) => { if (!condition) fail(message); };
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const geometryToken = (geometry) => Object.entries(geometry).map(([key, value]) => `${key}=${value}`).join(';');
const count = (pattern) => (html.match(pattern) || []).length;
const objectIds = [...html.matchAll(/data-object-id="([^"]+)"/g)].map((match) => match[1]);
const groupIds = [...html.matchAll(/data-group-id="([^"]+)"/g)].map((match) => match[1]);
const manifestIds = manifest.objects.map((object) => object.id);
const manifestById = new Map(manifest.objects.map((object) => [object.id, object]));
const palette = manifest.palette;

expect(manifest.manifestId === 'output-golden-v2', 'manifest id is not v2');
expect(manifest.authority.file === 'prototypes/editorial-systems/output-golden-v2.html', 'authority file drifted');
expect(manifest.authority.reference === 'prototypes/editorial-systems/output-golden-v2-checkpoint.png', 'checkpoint authority drifted');
expect(manifest.authority.runtimeAuthority === false, 'runtime output is incorrectly marked authoritative');
expect(manifest.authority.viewBox.width === 860 && manifest.authority.viewBox.height === 520, 'viewBox drifted');
expect(html.includes('viewBox="0 0 860 520"'), 'HTML viewBox drifted');
expect(fs.existsSync(checkpointPath), 'rendered checkpoint is missing from the review package');
const checkpoint = fs.readFileSync(checkpointPath);
expect(checkpoint.length >= 24 && checkpoint.readUInt32BE(16) === 860 && checkpoint.readUInt32BE(20) === 520, 'rendered checkpoint dimensions drifted');
expect(!html.includes('<script'), 'golden must remain static');
expect(!html.includes('output-golden-v1'), 'stale v1 authority is present');
expect(!/Q[1-5]/.test(html), 'stale quarterly labels are present');

expect(new Set(objectIds).size === objectIds.length, 'HTML object IDs are not unique');
expect(new Set(manifestIds).size === manifestIds.length, 'manifest object IDs are not unique');
expect(objectIds.length === manifestIds.length, `HTML object count ${objectIds.length} differs from manifest count ${manifestIds.length}`);
expect(objectIds.every((id, index) => id === manifestIds[index]), 'HTML and manifest object order differs');
expect(groupIds.includes(manifest.hierarchy.root), 'root hierarchy group is missing from HTML');
expect(manifest.hierarchy.groups.length === manifest.inventory.sectionCount, 'section count disagrees with hierarchy');

for (const group of manifest.hierarchy.groups) {
  expect(groupIds.includes(group.id), `missing hierarchy group ${group.id}`);
  for (const id of group.children) {
    const object = manifestById.get(id);
    expect(object, `hierarchy references missing object ${id}`);
    expect(object.parent === group.id, `object ${id} has inconsistent parent ${object.parent}`);
  }
}

const resolveColor = (value) => value && palette[value] ? palette[value] : value;
const objectBounds = (object) => {
  const geometry = object.geometry || {};
  if (object.tag === 'rect') return { left: geometry.x, top: geometry.y, right: geometry.x + geometry.width, bottom: geometry.y + geometry.height };
  if (object.tag === 'circle') return { left: geometry.cx - geometry.r, top: geometry.cy - geometry.r, right: geometry.cx + geometry.r, bottom: geometry.cy + geometry.r };
  if (object.tag === 'text') return { left: geometry.x, top: geometry.y, right: geometry.x, bottom: geometry.y };
  const points = [];
  const number = '-?\\d+(?:\\.\\d+)?';
  const path = String(geometry.d || '');
  for (const match of path.matchAll(new RegExp(`[ML]\\s*(${number})\\s*[ ,]\\s*(${number})`, 'g'))) points.push([Number(match[1]), Number(match[2])]);
  for (const match of path.matchAll(new RegExp(`A\\s*${number}\\s+${number}\\s+${number}\\s+[01]\\s+[01]\\s+(${number})\\s+(${number})`, 'g'))) points.push([Number(match[1]), Number(match[2])]);
  for (const match of path.matchAll(new RegExp(`H\\s*(${number})`, 'g'))) points.push([Number(match[1]), null]);
  for (const match of path.matchAll(new RegExp(`V\\s*(${number})`, 'g'))) points.push([null, Number(match[1])]);
  const xs = points.map(([x]) => x).filter((value) => value != null);
  const ys = points.map(([, y]) => y).filter((value) => value != null);
  return points.length ? { left: xs.length ? Math.min(...xs) : 0, top: ys.length ? Math.min(...ys) : 0, right: xs.length ? Math.max(...xs) : 860, bottom: ys.length ? Math.max(...ys) : 520 } : null;
};

for (const object of manifest.objects) {
  const id = escapeRegExp(object.id);
  const tagPattern = new RegExp(`<${object.tag} id="${id}" data-object-id="${id}"`);
  expect(tagPattern.test(html), `missing or wrong tag for ${object.id}`);
  expect(html.includes(`data-geometry="${geometryToken(object.geometry)}"`), `geometry drifted for ${object.id}`);
  expect(html.includes(`data-style="${object.style.token}"`), `style token drifted for ${object.id}`);
  expect(html.includes(`class="${object.style.class}"`), `style class drifted for ${object.id}`);
  if (object.text != null) {
    expect(html.includes(`data-text="${object.text}"`), `text metadata drifted for ${object.id}`);
    expect(html.includes(`>${object.text}<`), `visible text drifted for ${object.id}`);
  }
  const bounds = objectBounds(object);
  expect(bounds, `geometry is empty for ${object.id}`);
  expect(bounds.left >= 0 && bounds.top >= 0 && bounds.right <= 860 && bounds.bottom <= 520, `geometry escapes viewBox for ${object.id}`);
  if (object.style.fill && object.style.fill !== 'none') expect(resolveColor(object.style.fill) || object.style.fill, `fill is missing for ${object.id}`);
  if (object.style.stroke && object.style.stroke !== 'none') expect(resolveColor(object.style.stroke) || object.style.stroke, `stroke is missing for ${object.id}`);
}

expect(count(/data-object-id="output-v2-panel-/g) === 6, 'expected exactly six analytical panels');
expect(count(/data-object-id="output-v2-overview-[^"]*-value"/g) === 3, 'expected exactly three Overview metrics');
expect(count(/data-object-id="output-v2-distribution-ring-/g) === 4, 'expected one Distribution base ring and three accent arcs');
expect(count(/data-object-id="output-v2-distribution-legend-[^"]*-dot"/g) === 4, 'expected exactly four Distribution legend dots');
expect(count(/data-object-id="output-v2-distribution-legend-[^"]*-label"/g) === 4, 'expected exactly four Distribution legend labels');
expect(count(/data-object-id="output-v2-distribution-legend-[^"]*-line"/g) === 4, 'expected exactly four Distribution legend lines');
expect(count(/data-object-id="output-v2-performance-grid-/g) === 4, 'expected exactly four Performance grid lines');
expect(count(/data-object-id="output-v2-performance-point-/g) === 10, 'expected exactly ten Performance points');
expect(count(/data-object-id="output-v2-performance-label-/g) === 4, 'expected exactly four Performance labels');
expect(count(/data-object-id="output-v2-insights-row-/g) === 3, 'expected exactly three Insights rows');
expect(count(/data-object-id="output-v2-insights-dot-/g) === 3, 'expected exactly three Insights dots');
expect(count(/data-object-id="output-v2-insights-mark-/g) === 3, 'expected exactly three Insights marks');
expect(count(/data-object-id="output-v2-insights-copy-/g) === 6, 'expected exactly six Insights copy lines');
expect(count(/data-object-id="output-v2-variance-bar-/g) === 5, 'expected exactly five Variance bars');
expect(count(/data-object-id="output-v2-variance-connector-/g) === 4, 'expected exactly four Variance connectors');
expect(count(/data-object-id="output-v2-trends-bar-/g) === 4, 'expected exactly four Trends bars');
expect(count(/data-object-id="output-v2-trends-label-/g) === 4, 'expected exactly four Trends labels');
expect(count(/data-object-id="output-v2-system-node-/g) === 5, 'expected exactly five system nodes');
expect(count(/data-object-id="output-v2-system-line"/g) === 1, 'expected exactly one system line');

for (const text of ['$24.8M', '+18.6%', '42.7%', 'Revenue', 'Growth', 'Margin', 'Overview', 'Distribution', 'Performance', 'Insights', 'Variance', 'Trends', 'JAN', 'APR', 'JUL', 'OCT']) {
  expect(html.includes(`>${text}<`), `required text missing: ${text}`);
}

expect(manifest.inventory.panelCount === 6, 'manifest panel inventory is not six');
expect(manifest.inventory.distribution.accentArcCount === 3, 'Distribution arc inventory drifted');
expect(manifest.inventory.performance.pointCount === 10, 'Performance point inventory drifted');
expect(manifest.inventory.insights.darkTreatment === true, 'Insights dark treatment is not enabled');
expect(manifest.inventory.variance.barCount === 5, 'Variance bar inventory drifted');
expect(manifest.inventory.trends.barCount === 4, 'Trends bar inventory drifted');
expect(JSON.stringify(manifest.inventory.trends.labels) === JSON.stringify(['JAN', 'APR', 'JUL', 'OCT']), 'Trends checkpoint labels drifted');
expect(JSON.stringify(manifest.inventory.systemLayer.labels) === JSON.stringify(['SOURCE', 'RELATE', 'MODEL', 'REVIEW', 'USE']), 'system labels drifted');

console.log('OUTPUT_GOLDEN_V2_PASS');
console.log(JSON.stringify({
  html: path.relative(process.cwd(), htmlPath),
  manifest: path.relative(process.cwd(), manifestPath),
  checkpoint: path.relative(process.cwd(), checkpointPath),
  objects: manifestIds.length,
  inventory: manifest.inventory
}, null, 2));
