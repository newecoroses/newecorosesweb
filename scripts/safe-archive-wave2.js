// Second wave archive - confirmed safe from both CODE and SUPABASE checks
const fs = require('fs');
const path = require('path');

const BASE = 'c:/Users/thene/newecorosesweb';
const PUBLIC = BASE + '/public';
const ARCHIVE = BASE + '/storage/unused-assets';

// Create new archive subdirs
const newDirs = [
  ARCHIVE + '/duplicates/banners-hero-seasonal',
  ARCHIVE + '/unused/birthday-gifts-that-wow',
  ARCHIVE + '/unused/collection-images',
  ARCHIVE + '/unused/for-every-relationship',
  ARCHIVE + '/unused/new-cards',
  ARCHIVE + '/unused/new-icons',
  ARCHIVE + '/unused/product-images-old',
];
newDirs.forEach(d => fs.mkdirSync(d, { recursive: true }));

const MOVES = [
  // --- Seasonal hero banners (not in code, not in Supabase banners table) ---
  ['images/banners/hero/anniversary.webp',              'duplicates/banners-hero-seasonal/anniversary.webp'],
  ['images/banners/hero/birthday-cakes.webp',           'duplicates/banners-hero-seasonal/birthday-cakes.webp'],
  ['images/banners/hero/durga-puja-banner-1.webp',      'duplicates/banners-hero-seasonal/durga-puja-banner-1.webp'],
  ['images/banners/hero/durga-puja.webp',               'duplicates/banners-hero-seasonal/durga-puja.webp'],
  ['images/banners/hero/ganesh-chaturthi-banner-1.webp','duplicates/banners-hero-seasonal/ganesh-chaturthi-banner-1.webp'],
  ['images/banners/hero/ganesh-chaturthi.webp',         'duplicates/banners-hero-seasonal/ganesh-chaturthi.webp'],
  ['images/banners/hero/housewarm-gifts.webp',          'duplicates/banners-hero-seasonal/housewarm-gifts.webp'],
  ['images/banners/hero/janmastami.webp',               'duplicates/banners-hero-seasonal/janmastami.webp'],
  ['images/banners/hero/plant-gifts.webp',              'duplicates/banners-hero-seasonal/plant-gifts.webp'],
  ['images/banners/hero/teachers-day.webp',             'duplicates/banners-hero-seasonal/teachers-day.webp'],
  ['images/banners/hero/viswakarma-puja-banner-1.webp', 'duplicates/banners-hero-seasonal/viswakarma-puja-banner-1.webp'],
  ['images/banners/hero/viswakarma-puja.webp',          'duplicates/banners-hero-seasonal/viswakarma-puja.webp'],
  ['images/banners/hero/wedding-gifts.webp',            'duplicates/banners-hero-seasonal/wedding-gifts.webp'],
];

// Scan entire subfolders and add all files from verified-safe folders
const safeFolders = [
  ['images/birthday gifts that wow', 'unused/birthday-gifts-that-wow'],
  ['images/collection images',       'unused/collection-images'],
  ['images/for every relationship',  'unused/for-every-relationship'],
  ['images/new cards',               'unused/new-cards'],
  ['images/new icons',               'unused/new-icons'],
  ['images/product images',          'unused/product-images-old'],
];

safeFolders.forEach(([srcFolder, dstFolder]) => {
  const fullSrc = path.join(PUBLIC, srcFolder);
  if (!fs.existsSync(fullSrc)) {
    console.log(`Folder does not exist, skipping: ${srcFolder}`);
    return;
  }
  const files = fs.readdirSync(fullSrc);
  files.forEach(f => {
    const stat = fs.statSync(path.join(fullSrc, f));
    if (stat.isFile()) {
      MOVES.push([`${srcFolder}/${f}`, `${dstFolder}/${f}`]);
    }
  });
});

const log = [];
let copied = 0, failed = 0, deleted = 0;

for (const [srcRel, dstRel] of MOVES) {
  const src = path.join(PUBLIC, srcRel);
  const dst = path.join(ARCHIVE, dstRel);

  if (!fs.existsSync(src)) {
    log.push({ status: 'SKIP_NOT_FOUND', src: srcRel });
    console.log(`  SKIP (not found): ${srcRel}`);
    failed++;
    continue;
  }

  const srcSize = fs.statSync(src).size;
  try { fs.copyFileSync(src, dst); } catch (e) {
    log.push({ status: 'COPY_ERROR', src: srcRel, error: e.message });
    console.log(`  ERROR: ${srcRel} -> ${e.message}`);
    failed++; continue;
  }

  if (!fs.existsSync(dst) || fs.statSync(dst).size !== srcSize) {
    log.push({ status: 'VERIFY_FAILED', src: srcRel });
    console.log(`  VERIFY FAILED: ${srcRel}`);
    failed++; continue;
  }

  try {
    fs.unlinkSync(src);
    copied++; deleted++;
    log.push({ status: 'SUCCESS', src: srcRel, dst: dstRel, size: srcSize });
    console.log(`  OK: ${srcRel}`);
  } catch(e) {
    log.push({ status: 'DELETE_ERROR', src: srcRel, error: e.message });
    console.log(`  DELETE ERROR (copy safe): ${srcRel}`);
    failed++;
  }
}

// Append to existing archive log
const logPath = BASE + '/storage/unused-assets/ARCHIVE_LOG.json';
const existing = JSON.parse(fs.readFileSync(logPath));
existing.wave2 = { timestamp: new Date().toISOString(), copied, failed, deleted, log };
fs.writeFileSync(logPath, JSON.stringify(existing, null, 2));

console.log(`\n=== WAVE 2 DONE: ${copied} archived, ${failed} failed ===`);
