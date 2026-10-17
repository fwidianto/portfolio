import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=fs.readFileSync(path.join(root,'prototypes/new-portfolio-animation-first/index.html'),'utf8');
const production=fs.readFileSync(path.join(root,'index.html'),'utf8');
const generator=fs.readFileSync(path.join(root,'scripts/sync-production-html.mjs'));
function generate(html,checking=false){
 const tempBase=fs.realpathSync(os.tmpdir()),fixture=fs.mkdtempSync(path.join(tempBase,'portfolio-ch03-'));
 try{
  fs.mkdirSync(path.join(fixture,'scripts'));fs.mkdirSync(path.join(fixture,'prototypes/new-portfolio-animation-first'),{recursive:true});
  fs.writeFileSync(path.join(fixture,'scripts/sync-production-html.mjs'),generator);
  fs.writeFileSync(path.join(fixture,'prototypes/new-portfolio-animation-first/index.html'),html);
  fs.writeFileSync(path.join(fixture,'index.html'),production);
  const run=spawnSync(process.execPath,[path.join(fixture,'scripts/sync-production-html.mjs'),...(checking?['--check']:[])],{encoding:'utf8'});
  return {...run,html:fs.readFileSync(path.join(fixture,'index.html'),'utf8')};
 }finally{
  assert.equal(path.dirname(fixture),tempBase);assert.ok(path.basename(fixture).startsWith('portfolio-ch03-'));assert.equal(fs.lstatSync(fixture).isSymbolicLink(),false);
  fs.rmSync(fixture,{recursive:true});
 }
}
test('production generation is deterministic and keeps all five chapter scenes',()=>{
 const built=generate(source);assert.equal(built.status,0,built.stderr);assert.equal(built.html,production);
 assert.equal(generate(source,true).status,0);
 for(const n of [1,2,3,4,5])assert.ok(built.html.includes(`id="ch03-layer-${n}"`));
 for(const n of [2,3,4,5])assert.ok(built.html.includes(`src="prototypes/new-portfolio-animation-first/scene-0${n}/index.html?`));
 assert.ok(built.html.includes('src="prototypes/new-portfolio-animation-first/film.js"'));
 assert.ok(built.html.includes('src="prototypes/new-portfolio-animation-first/chapter-03.js?v=ch03-20261017-2"'));
 assert.ok(built.html.includes('href="prototypes/new-portfolio-animation-first/assets/logo-traknus.png"'));
 assert.ok(built.html.includes('download="Fauzan_Widianto_CV.pdf"'));
 assert.ok(built.html.includes('src="prototypes/new-portfolio-animation-first/left-nav.js?v=ch03-20261017"'));
 assert.equal(built.html.includes('window.launchDevEditor'),false);assert.equal(built.html.includes('portfolio-ch03-integration-preview'),false);
});
test('missing and duplicated scene markers fail closed',()=>{
 for(const html of [source.replace('id="ch03-layer-5"','id="missing-scene"'),source.replace('id="ch03-layer-5"','id="ch03-layer-5" data-duplicate=\'id="ch03-layer-5"\'')]){
  const result=generate(html);assert.notEqual(result.status,0);assert.match(result.stderr,/section marker.*ch03-layer-5/);
 }
 assert.notEqual(generate(source.replace('<script src="chapter-03.js?v=ch03-20261017-2"></script>','')).status,0);
});
test('obsolete dormant chapters and obsolete chapter scripts remain rejected',()=>{
 for(const marker of ['id="dormant-chapter-03"','chapter-04.js']){
  const result=generate(source.replace('</head>',`<!-- ${marker} -->\n</head>`));assert.notEqual(result.status,0);assert.match(result.stderr,/obsolete/);
 }
});
test('duplicate canonical metadata and missing editor boundary fail closed',()=>{
 assert.notEqual(generate(source.replace('</head>','<link rel="canonical" href="https://example.invalid/">\n</head>')).status,0);
 assert.notEqual(generate(source.replace('window.launchDevEditor','window.missingEditorBoundary')).status,0);
});
