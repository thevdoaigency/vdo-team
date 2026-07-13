import fs from 'fs';
import path from 'path';

const repoRoot = process.cwd();
const indexPath = path.join(repoRoot, 'index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf8');

const htmlFiles = fs
  .readdirSync(repoRoot)
  .filter((f) => f.endsWith('.html') && f !== 'index.html');

const missing = htmlFiles.filter((f) => !indexHtml.includes(`href="./${f}"`));

if (missing.length === 0) {
  console.log('No new pages found. Index is current.');
  process.exit(0);
}

function titleCase(filename) {
  return filename
    .replace(/\.html$/, '')
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const detected = new Date().toISOString().slice(0, 7); // YYYY-MM

const stubs = missing
  .map(
    (f) => `
    <a class="entry" href="./${f}">
      <div class="entry-row">
        <div class="entry-title">${titleCase(f)}</div>
        <div class="entry-arrow">→</div>
      </div>
      <div class="entry-desc">New page — description not yet written. Edit this entry before merging.</div>
      <div class="entry-meta">STUB · DETECTED ${detected}</div>
    </a>`
  )
  .join('\n');

const marker = '<div class="cat-label">Coming next</div>';
let updated;

if (indexHtml.includes(marker)) {
  updated = indexHtml.replace(
    marker,
    `<div class="cat-label">Needs description</div>${stubs}\n\n    ${marker}`
  );
} else {
  updated = indexHtml.replace('</section>', `${stubs}\n  </section>`);
}

fs.writeFileSync(indexPath, updated);

console.log(
  `Added ${missing.length} stub entr${missing.length === 1 ? 'y' : 'ies'}: ${missing.join(', ')}`
);

const summary = missing.map((f) => `- \`${f}\``).join('\n');

if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `summary<<EOF\n${summary}\nEOF\n`);
}
