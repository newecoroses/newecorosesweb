// Safe archive script: COPY → VERIFY → DELETE
// Run with: node scripts/safe-archive.js
const fs = require('fs');
const path = require('path');

const BASE = 'c:/Users/thene/newecorosesweb';
const PUBLIC = BASE + '/public';
const ARCHIVE = BASE + '/storage/unused-assets';

// Map: [source relative to public] -> [destination relative to ARCHIVE]
const MOVES = [
  // --- DUPLICATE: banners/hero display-name versions ---
  ['images/banners/hero/Beauty in Every Bloom.webp',                     'duplicates/banners-hero-display-names/Beauty in Every Bloom.webp'],
  ['images/banners/hero/Colour Me Happy Floral Still Life.webp',         'duplicates/banners-hero-display-names/Colour Me Happy Floral Still Life.webp'],
  ['images/banners/hero/Naturally Beautiful Eco Roses.webp',             'duplicates/banners-hero-display-names/Naturally Beautiful Eco Roses.webp'],
  ['images/banners/hero/A Little More Beauty This Lakshmi Puja.webp',    'duplicates/banners-hero-display-names/A Little More Beauty This Lakshmi Puja.webp'],
  ['images/banners/hero/a-little-more-beauty-this-lakshmi-puja.webp',    'duplicates/banners-hero-display-names/a-little-more-beauty-this-lakshmi-puja.webp'],

  // --- DUPLICATE: banners/hero/NEW HEROS subfolder ---
  ['images/banners/hero/NEW HEROS/Beauty in Every Bloom.webp',           'duplicates/banners-hero-NEW-HEROS/Beauty in Every Bloom.webp'],
  ['images/banners/hero/NEW HEROS/Colour Me Happy Floral Still Life.webp','duplicates/banners-hero-NEW-HEROS/Colour Me Happy Floral Still Life.webp'],
  ['images/banners/hero/NEW HEROS/Naturally Beautiful Eco Roses.webp',   'duplicates/banners-hero-NEW-HEROS/Naturally Beautiful Eco Roses.webp'],

  // --- DUPLICATE: banners/promo display-name versions ---
  ['images/banners/promo/Elegant Birthday Gifts That Delight.webp',      'duplicates/banners-promo-display-names/Elegant Birthday Gifts That Delight.webp'],
  ['images/banners/promo/Elegant Sage Wedding Gift Display.webp',         'duplicates/banners-promo-display-names/Elegant Sage Wedding Gift Display.webp'],
  ['images/banners/promo/Luxury Rose Collection.webp',                   'duplicates/banners-promo-display-names/Luxury Rose Collection.webp'],
  ['images/banners/promo/Romantic Anniversary Gift Collection.webp',      'duplicates/banners-promo-display-names/Romantic Anniversary Gift Collection.webp'],
  ['images/banners/promo/luxary rose collection.webp',                   'duplicates/banners-promo-display-names/luxary rose collection.webp'],
  ['images/banners/promo/annieversary specials.webp',                    'duplicates/banners-promo-display-names/annieversary specials.webp'],
  ['images/banners/promo/birthday gifts that delights.webp',             'duplicates/banners-promo-display-names/birthday gifts that delights.webp'],
  ['images/banners/promo/wedding gifting.webp',                          'duplicates/banners-promo-display-names/wedding gifting.webp'],

  // --- DUPLICATE: celebrations calender (unoptimized originals) ---
  ['images/celebrations calender/eid.webp',                              'duplicates/celebrations-calender/eid.webp'],
  ['images/celebrations calender/holi.webp',                             'duplicates/celebrations-calender/holi.webp'],
  ['images/celebrations calender/husband appriciation.webp',             'duplicates/celebrations-calender/husband appriciation.webp'],
  ['images/celebrations calender/navratri.webp',                         'duplicates/celebrations-calender/navratri.webp'],
  ['images/celebrations calender/womensday.webp',                        'duplicates/celebrations-calender/womensday.webp'],

  // --- UNUSED: remaining pictures ---
  ['images/remaining pictures/annieversay collection.webp',              'unused/remaining-pictures/annieversay collection.webp'],
  ['images/remaining pictures/bday specials.webp',                       'unused/remaining-pictures/bday specials.webp'],
  ['images/remaining pictures/Garden Elegance.webp',                     'unused/remaining-pictures/Garden Elegance.webp'],
  ['images/remaining pictures/ivory dream.webp',                         'unused/remaining-pictures/ivory dream.webp'],
  ['images/remaining pictures/lux bouquets.webp',                        'unused/remaining-pictures/lux bouquets.webp'],
  ['images/remaining pictures/pastel brush.webp',                        'unused/remaining-pictures/pastel brush.webp'],
  ['images/remaining pictures/personalized gifts.webp',                  'unused/remaining-pictures/personalized gifts.webp'],
  ['images/remaining pictures/red romance.webp',                         'unused/remaining-pictures/red romance.webp'],
  ['images/remaining pictures/roses collection.webp',                    'unused/remaining-pictures/roses collection.webp'],
  ['images/remaining pictures/why new eco roses.webp',                   'unused/remaining-pictures/why new eco roses.webp'],

  // --- UNUSED: root loose images ---
  ['images/our story.webp',                                              'unused/root-loose-images/our story.webp'],
  ['images/readytomakesome.jpg',                                         'unused/root-loose-images/readytomakesome.jpg'],
  ['images/ready to make someones day banner.webp',                      'unused/root-loose-images/ready to make someones day banner.webp'],
  ['images/landing-hero.webp',                                           'unused/root-loose-images/landing-hero.webp'],
  ['images/banners/hero.webp',                                           'unused/root-loose-images/hero.webp'],
  ['images/lily.webp',                                                   'unused/root-loose-images/lily.webp'],
  ['images/garland.webp',                                                'unused/root-loose-images/garland.webp'],
  ['images/whatsappiconforen.png',                                       'unused/root-loose-images/whatsappiconforen.png'],
];

const log = [];
let copied = 0, failed = 0, deleted = 0;

for (const [srcRel, dstRel] of MOVES) {
  const src = path.join(PUBLIC, srcRel);
  const dst = path.join(ARCHIVE, dstRel);

  // 1. Check source exists
  if (!fs.existsSync(src)) {
    log.push({ status: 'SKIP_NOT_FOUND', src: srcRel, dst: dstRel });
    console.log(`  SKIP (not found): ${srcRel}`);
    failed++;
    continue;
  }

  const srcSize = fs.statSync(src).size;

  // 2. Copy
  try {
    fs.copyFileSync(src, dst);
  } catch (e) {
    log.push({ status: 'COPY_ERROR', src: srcRel, dst: dstRel, error: e.message });
    console.log(`  ERROR copying: ${srcRel} -> ${e.message}`);
    failed++;
    continue;
  }

  // 3. Verify copy (size match)
  if (!fs.existsSync(dst)) {
    log.push({ status: 'VERIFY_FAILED', src: srcRel, dst: dstRel });
    console.log(`  VERIFY FAILED: ${srcRel}`);
    failed++;
    continue;
  }
  const dstSize = fs.statSync(dst).size;
  if (dstSize !== srcSize) {
    log.push({ status: 'SIZE_MISMATCH', src: srcRel, dst: dstRel, srcSize, dstSize });
    console.log(`  SIZE MISMATCH: ${srcRel} (${srcSize} vs ${dstSize})`);
    failed++;
    continue;
  }

  // 4. Delete original ONLY after verified copy
  try {
    fs.unlinkSync(src);
    copied++;
    deleted++;
    log.push({ status: 'SUCCESS', src: srcRel, dst: dstRel, size: srcSize });
    console.log(`  OK: ${srcRel}`);
  } catch (e) {
    log.push({ status: 'DELETE_ERROR', src: srcRel, dst: dstRel, error: e.message, note: 'Copy succeeded, original delete failed - file may be locked' });
    console.log(`  DELETE ERROR (copy is safe): ${srcRel} -> ${e.message}`);
    failed++;
  }
}

// Save operation log
fs.writeFileSync(BASE + '/storage/unused-assets/ARCHIVE_LOG.json', JSON.stringify({ timestamp: new Date().toISOString(), copied, failed, deleted, log }, null, 2));

console.log('');
console.log(`=== DONE: ${copied} archived, ${failed} failed/skipped ===`);
