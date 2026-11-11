/** Static integrity checks. Run from any directory: node scripts/check.mjs */
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const css = await readFile(resolve(root, 'assets/styles.css'), 'utf8');
const javascript = await readFile(resolve(root, 'assets/app.js'), 'utf8');
const pdfExport = await readFile(resolve(root, 'assets/pdf-export.js'), 'utf8');
const sections = [...html.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/g)];
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);

assert(sections.length > 0, 'No slides found.');
assert.equal(new Set(ids).size, ids.length, 'Duplicate HTML IDs.');

for (const [index, match] of sections.entries()) {
  const section = match[0];
  assert(section.includes(`id="slide-${index + 1}"`), 'Slide IDs must be sequential.');
  assert(/<h[12]\b/.test(section), `Slide ${index + 1} has no heading.`);
  assert(/<aside class="speaker-notes" hidden>/.test(section), 'Missing hidden notes.');
}

// External citation links are allowed; assets must remain strictly local.
for (const match of html.matchAll(/<(\w+)\b[^>]*\b(src|href)="([^"]+)"[^>]*>/g)) {
  const [, tag, attribute, reference] = match;
  if (/^https?:/.test(reference)) {
    assert(tag === 'a' && attribute === 'href', `Remote asset: ${reference}`);
    assert.equal(new URL(reference).protocol, 'https:', 'Use HTTPS citations.');
    assert(match[0].includes('rel="noopener noreferrer"'), 'Missing external link protection.');
    continue;
  }
  assert(!/^(?:\/\/|data:)/.test(reference), `Non-local asset: ${reference}`);
  if (!reference.startsWith('#')) await access(resolve(root, decodeURIComponent(reference)));
}

let speakingSeconds = 0;
for (const section of sections) {
  const duration = section[0].match(/<aside class="speaker-notes" hidden>(\d+):(\d{2})/);
  assert(duration, 'Missing speaking duration.');
  speakingSeconds += Number(duration[1]) * 60 + Number(duration[2]);
  if (/id="slide-(?:2|3|4|12|13|14)"/.test(section[0])) {
    assert(section[0].includes('<footer class="source">'), 'Missing slide attribution.');
  }
}
assert(speakingSeconds <= 15 * 60, 'Speaking plan exceeds 15 minutes.');
assert(!html.includes('class="placeholder"'), 'Unfinished theory slide.');

for (const match of javascript.matchAll(/select\('#([^']+)'\)/g)) {
  assert(ids.includes(match[1]), `Missing control: #${match[1]}`);
}

for (const match of html.matchAll(/<img\b[^>]*>/g)) {
  assert(/\balt="[^"]+"/.test(match[0]), 'Image is missing descriptive alternative text.');
}

assert(!/\bfetch\s*\(|XMLHttpRequest|WebSocket/.test(javascript), 'Unexpected network access.');
assert(!html.includes('<figcaption'), 'Image captions should remain removed.');
assert(css.includes('@media print'), 'Missing PDF / print styles.');
assert(css.includes('size: 320mm 180mm'), 'Missing 16:9 PDF page size.');
assert(css.includes('prefers-reduced-motion'), 'Missing reduced motion support.');
assert(!/window\.print\s*\(/.test(javascript + pdfExport), 'PDF button must not invoke printing.');
assert(pdfExport.includes('const PAGE_MM = [320, 180]'), 'Incorrect presentation PDF dimensions.');
assert(pdfExport.includes("pdf.save('Konflikt-na-pracovisti.pdf')"), 'Missing direct PDF download.');
for (const path of ['assets/app.js', 'assets/pdf-export.js']) {
  execFileSync(process.execPath, ['--check', resolve(root, path)]);
}
for (const path of ['assets/vendor/html2canvas.min.js', 'assets/vendor/jspdf.umd.min.js', 'assets/pdf-images.js']) {
  await access(resolve(root, path));
}
const imageScript = await readFile(resolve(root, 'assets/pdf-images.js'), 'utf8');
const embeddedImages = JSON.parse(imageScript.match(/Object\.freeze\((.*)\);/)[1]);
for (const match of html.matchAll(/<img\b[^>]*src="([^"]+)"/g)) {
  const bytes = await readFile(resolve(root, match[1]));
  assert.equal(embeddedImages[match[1]], `data:image/png;base64,${bytes.toString('base64')}`,
    'PDF image cache is stale; run node scripts/build-pdf-assets.mjs.');
}

console.log(`OK: ${sections.length} slides, local assets, unique IDs, notes, controls, PDF styles, JS syntax.`);
