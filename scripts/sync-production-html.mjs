#!/usr/bin/env node

/**
 * ============================================================================
 * Production HTML Synchronizer (Deterministic Source Generator)
 * ============================================================================
 *
 * Source of Truth: prototypes/new-portfolio-animation-first/index.html
 * Target Output:   index.html (repository root, served by GitHub Pages)
 *
 * Generates the production root index.html by:
 *  1. Validating required sections and asserting absence of obsolete/dormant artifacts.
 *  2. Stripping the development-only visual editor bootstrap script.
 *  3. Injecting canonical SEO, OpenGraph, and Twitter social metadata into <head>.
 *  4. Remapping prototype-relative resource links (CSS, JS, assets) to production paths.
 *  5. Normalizing CV download path casing (Assets/Fauzan_Widianto_CV.pdf).
 *
 * Design constraints:
 *  - Native Node.js only (zero npm dependencies, zero build frameworks).
 *  - Fail-closed: aborts with non-zero exit code if source structure is ambiguous.
 *  - Supports `--check` mode to detect production drift without modifying files.
 * ============================================================================
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');
const PROTOTYPE_HTML_PATH = resolve(ROOT_DIR, 'prototypes/new-portfolio-animation-first/index.html');
const PRODUCTION_HTML_PATH = resolve(ROOT_DIR, 'index.html');

const isCheckMode = process.argv.includes('--check');

function fail(message) {
  console.error(`\x1b[31m[sync:html ERROR]\x1b[0m ${message}`);
  process.exit(1);
}

function generateProductionHtml(sourceHtml) {
  let output = sourceHtml;

  // --------------------------------------------------------------------------
  // 1. Fail-Closed Source Pre-Checks
  // --------------------------------------------------------------------------
  const requiredSections = [
    '<header class="portfolio-header"',
    '<nav class="portfolio-left-nav" id="portfolio-left-nav"',
    '<section id="hero"',
    '<aside class="hero-info-panel-container" id="hero-info-container"',
    '<section id="chapter-02"',
    '<section id="scene-01"',
    '<section id="scene-02"',
    '<section id="scene-03"',
    '<section id="scene-04"',
    '<section id="scene-05"',
    '<section id="chapter-03" class="chapter-working-experience"'
  ];

  for (const section of requiredSections) {
    const count = (output.split(section).length - 1);
    if (count !== 1) {
      fail(`Source validation failed: section marker "${section}" found ${count} times (expected exactly 1)`);
    }
  }

  // Assert that obsolete Chapter III–V artifacts or dormant templates do not appear in source
  const forbiddenSourcePatterns = [
    'id="dormant-chapter-',
    'dormant-chapter-03-content',
    'dormant-chapter-04-content',
    'dormant-chapter-05-content',
    'chapter-03.css',
    'chapter-03.js',
    'chapter-04.css',
    'chapter-04.js',
    'chapter-05.css',
    'chapter-05.js'
  ];

  for (const pattern of forbiddenSourcePatterns) {
    if (output.includes(pattern)) {
      fail(`Source validation failed: obsolete Chapter III–V artifact or dormant template found in source: "${pattern}"`);
    }
  }

  // --------------------------------------------------------------------------
  // 2. Remove Development Visual-Editor Bootstrap Script
  // --------------------------------------------------------------------------
  const devEditorRegex = /[ \t]*<!-- Development-only Visual Editing Mode:[^\n]*-->\r?\n[ \t]*<script>\r?\n[\s\S]*?window\.launchDevEditor[\s\S]*?<\/script>\r?\n(?=[ \t]*<\/body>)/;
  if (!devEditorRegex.test(output)) {
    fail('Source validation failed: development visual-editor bootstrap script block not found');
  }
  output = output.replace(devEditorRegex, '');

  // --------------------------------------------------------------------------
  // 3. Inject Canonical Production SEO / Social Metadata into <head>
  // --------------------------------------------------------------------------
  const headEndRegex = /[ \t]*<\/head>/;
  if (!headEndRegex.test(output)) {
    fail('Source validation failed: closing </head> tag not found');
  }

  const newline = output.includes('\r\n') ? '\r\n' : '\n';
  const SEO_METADATA = [
    '  <link rel="canonical" href="https://www.fwidianto.com/">',
    '  <meta property="og:type" content="website">',
    '  <meta property="og:url" content="https://www.fwidianto.com/">',
    '  <meta property="og:title" content="Fauzan Widianto | Analytical Systems Builder">',
    '  <meta property="og:description" content="Engineering systems, process analytics, and technical optimization.">',
    '  <meta property="og:image" content="https://www.fwidianto.com/prototypes/new-portfolio-animation-first/assets/fauzan-profile.jpg">',
    '  <meta name="twitter:card" content="summary_large_image">',
    '</head>'
  ].join(newline);

  output = output.replace(headEndRegex, SEO_METADATA);

  // --------------------------------------------------------------------------
  // 4. Path Transformations for Root Placement
  // --------------------------------------------------------------------------
  // Case-sensitive CV download path matching root Assets/ directory
  output = output.replace('href="assets/Fauzan_Widianto_CV.pdf"', 'href="Assets/Fauzan_Widianto_CV.pdf"');

  // Favicon icon
  output = output.replace('href="assets/favicon.svg"', 'href="prototypes/new-portfolio-animation-first/assets/favicon.svg"');

  // Internal avatar editor tool in hero-info panel
  output = output.replace('href="avatar-editor.html"', 'href="prototypes/new-portfolio-animation-first/avatar-editor.html"');

  // Modular Stylesheets
  output = output.replace(/href="(chapter-[^"]+\.css(?:\?[^"]*)?)"/g, 'href="prototypes/new-portfolio-animation-first/$1"');
  output = output.replace('href="left-nav.css"', 'href="prototypes/new-portfolio-animation-first/left-nav.css"');

  // Modular Scripts
  output = output.replace(/src="(chapter-[^"]+\.js(?:\?[^"]*)?)"/g, 'src="prototypes/new-portfolio-animation-first/$1"');
  output = output.replace('src="left-nav.js"', 'src="prototypes/new-portfolio-animation-first/left-nav.js"');

  // Static Assets / Images
  output = output.replace(/src="assets\/([^"]+)"/g, 'src="prototypes/new-portfolio-animation-first/assets/$1"');

  // --------------------------------------------------------------------------
  // 5. Fail-Closed Post-Transformation Checks
  // --------------------------------------------------------------------------
  if (output.includes('id="dormant-chapter-')) {
    fail('Post-check failed: output still contains dormant template IDs');
  }
  if (output.includes('dev-editor.js') || output.includes('window.launchDevEditor')) {
    fail('Post-check failed: output still contains development visual-editor references');
  }
  if ((output.split('https://www.fwidianto.com/').length - 1) < 2) {
    fail('Post-check failed: canonical/OpenGraph production URL missing from output');
  }
  if ((output.split('<link rel="canonical"').length - 1) !== 1) {
    fail('Post-check failed: canonical link must appear exactly once');
  }
  for (const pattern of forbiddenSourcePatterns) {
    if (output.includes(pattern)) {
      fail(`Post-check failed: output contains obsolete Chapter III–V artifact: "${pattern}"`);
    }
  }

  return output;
}

function run() {
  if (!existsSync(PROTOTYPE_HTML_PATH)) {
    fail(`Prototype source not found: ${PROTOTYPE_HTML_PATH}`);
  }

  const sourceHtml = readFileSync(PROTOTYPE_HTML_PATH, 'utf-8');
  const generatedHtml = generateProductionHtml(sourceHtml);

  if (isCheckMode) {
    if (!existsSync(PRODUCTION_HTML_PATH)) {
      fail(`Production index.html missing: ${PRODUCTION_HTML_PATH}`);
    }
    const currentProdHtml = readFileSync(PRODUCTION_HTML_PATH, 'utf-8');
    if (currentProdHtml !== generatedHtml) {
      console.error('\x1b[31m[sync:html DRIFT DETECTED]\x1b[0m Root index.html is out of sync with prototype source.');
      console.error('Run: node scripts/sync-production-html.mjs to synchronize.');
      process.exit(1);
    }
    console.log('\x1b[32m[sync:html OK]\x1b[0m Root index.html is 100% in sync with prototype source.');
    process.exit(0);
  }

  writeFileSync(PRODUCTION_HTML_PATH, generatedHtml, 'utf-8');
  const lines = generatedHtml.split('\n').length;
  const bytes = Buffer.byteLength(generatedHtml, 'utf-8');
  console.log(`\x1b[32m[sync:html SUCCESS]\x1b[0m Synchronized root index.html (${lines} lines, ${bytes} bytes).`);
}

run();
