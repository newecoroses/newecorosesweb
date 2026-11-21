const fs = require('fs');
const path = require('path');
const root = 'c:/Users/thene/newecorosesweb';
const exts = ['.tsx', '.ts', '.js', '.jsx', '.css'];
const found = new Set();

function walk(dir) {
  let entries;
  try { entries = fs.readdirSync(dir); } catch(e) { return; }
  for (const f of entries) {
    if (f === 'node_modules' || f === '.next' || f === 'scripts') continue;
    const full = path.join(dir, f);
    let stat;
    try { stat = fs.statSync(full); } catch(e) { continue; }
    if (stat.isDirectory()) { walk(full); continue; }
    if (!exts.includes(path.extname(f))) continue;
    const content = fs.readFileSync(full, 'utf8');
    // Match /images/... paths - stop at quote, backtick, space, closing bracket/paren
    const regex = /\/images\/[^"'`\s\)\]\},]+/g;
    const matches = content.match(regex);
    if (matches) matches.forEach(m => found.add(m));
  }
}

walk(root);
const sorted = [...found].sort();
fs.writeFileSync('c:/Users/thene/newecorosesweb/code-image-paths.txt', sorted.join('\n'));
console.log('Found ' + sorted.length + ' unique /images/ paths referenced in code');
sorted.forEach(p => console.log(p));
