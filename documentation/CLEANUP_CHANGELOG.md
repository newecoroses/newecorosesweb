# NEW ECO ROSES — Cleanup Changelog
**Project:** newecorosesweb  
**Organization Date:** 2026-11-22  
**Performed By:** Automated safe-archive script (`scripts/safe-archive.js`)

---

## Summary

| Action | Count |
|---|---|
| Files archived (copy → verify → remove original) | **39** |
| Files skipped (safety concern) | 0 |
| Source code files modified | **0** |
| Database changes made | **0** |
| Files permanently deleted | **0** |
| Build errors introduced | **0** |

---

## Backup Reference

- **Git backup branch:** `backup/pre-organization-2026-11-22`
- **Remote:** `origin/backup/pre-organization-2026-11-22` (pushed to GitHub)
- **To rollback:** `git checkout backup/pre-organization-2026-11-22`

---

## Files Archived

All files were copied to `storage/unused-assets/`, verified (size-matched), then originals removed.  
**Originals are preserved in the archive — nothing was permanently deleted.**

### Group 1: `duplicates/banners-hero-display-names/` — 5 files
Display-name versions of hero banners. Active code uses only kebab-case versions.

| Original Path | Archive Path | Reason |
|---|---|---|
| `public/images/banners/hero/Beauty in Every Bloom.webp` | `storage/unused-assets/duplicates/banners-hero-display-names/Beauty in Every Bloom.webp` | Duplicate of `beauty-in-every-bloom.webp` |
| `public/images/banners/hero/Colour Me Happy Floral Still Life.webp` | `...display-names/Colour Me Happy Floral Still Life.webp` | Duplicate of `colour-me-happy-floral-still-life.webp` |
| `public/images/banners/hero/Naturally Beautiful Eco Roses.webp` | `...display-names/Naturally Beautiful Eco Roses.webp` | Duplicate of `naturally-beautiful-eco-roses.webp` |
| `public/images/banners/hero/A Little More Beauty This Lakshmi Puja.webp` | `...display-names/A Little More Beauty This Lakshmi Puja.webp` | Not referenced in any code |
| `public/images/banners/hero/a-little-more-beauty-this-lakshmi-puja.webp` | `...display-names/a-little-more-beauty-this-lakshmi-puja.webp` | Not referenced in any code |

### Group 2: `duplicates/banners-hero-NEW-HEROS/` — 3 files
Subfolder that was an exact copy of the parent `banners/hero/` files.

| Original Path | Reason |
|---|---|
| `public/images/banners/hero/NEW HEROS/Beauty in Every Bloom.webp` | Exact duplicate of parent folder file |
| `public/images/banners/hero/NEW HEROS/Colour Me Happy Floral Still Life.webp` | Exact duplicate |
| `public/images/banners/hero/NEW HEROS/Naturally Beautiful Eco Roses.webp` | Exact duplicate |

### Group 3: `duplicates/banners-promo-display-names/` — 8 files
Display-name and old-name versions of promo banners. Active code uses only 4 kebab-case versions.

| Original Path | Reason |
|---|---|
| `public/images/banners/promo/Elegant Birthday Gifts That Delight.webp` | Duplicate of `elegant-birthday-gifts-that-delight.webp` |
| `public/images/banners/promo/Elegant Sage Wedding Gift Display.webp` | Duplicate of `elegant-sage-wedding-gift-display.webp` |
| `public/images/banners/promo/Luxury Rose Collection.webp` | Duplicate of `luxury-rose-collection.webp` |
| `public/images/banners/promo/Romantic Anniversary Gift Collection.webp` | Duplicate of `romantic-anniversary-gift-collection.webp` |
| `public/images/banners/promo/luxary rose collection.webp` | Typo-named duplicate (also superseded) |
| `public/images/banners/promo/annieversary specials.webp` | Old name, superseded by kebab version |
| `public/images/banners/promo/birthday gifts that delights.webp` | Old name, superseded |
| `public/images/banners/promo/wedding gifting.webp` | Old name, superseded |

### Group 4: `duplicates/celebrations-calender/` — 5 files
The `celebrations calender/` folder contained unoptimized originals of the same images in `celebrations/`.  
The optimized `celebrations/` versions are actively used. These large originals were not referenced.

| Original Path | Size | Note |
|---|---|---|
| `public/images/celebrations calender/eid.webp` | 489 KB | Optimized version at `celebrations/eid.webp` (243 KB) is active |
| `public/images/celebrations calender/holi.webp` | 3,060 KB | Unoptimized — `celebrations/holi.webp` is active |
| `public/images/celebrations calender/husband appriciation.webp` | 119 KB | `celebrations/husband-appreciation.webp` is active |
| `public/images/celebrations calender/navratri.webp` | 948 KB | `celebrations/navratri.webp` is active |
| `public/images/celebrations calender/womensday.webp` | 108 KB | `celebrations/womens-day.webp` is active |

### Group 5: `unused/remaining-pictures/` — 10 files
The `remaining pictures/` folder was not referenced anywhere in code, Supabase queries, or component files.

| Original Path |
|---|
| `public/images/remaining pictures/annieversay collection.webp` |
| `public/images/remaining pictures/bday specials.webp` |
| `public/images/remaining pictures/Garden Elegance.webp` |
| `public/images/remaining pictures/ivory dream.webp` |
| `public/images/remaining pictures/lux bouquets.webp` |
| `public/images/remaining pictures/pastel brush.webp` |
| `public/images/remaining pictures/personalized gifts.webp` |
| `public/images/remaining pictures/red romance.webp` |
| `public/images/remaining pictures/roses collection.webp` |
| `public/images/remaining pictures/why new eco roses.webp` |

### Group 6: `unused/root-loose-images/` — 8 files
Images at `public/images/` root level not referenced by any source code path.

| Original Path | Reason |
|---|---|
| `public/images/our story.webp` | Space-named duplicate; `our-story.webp` (kebab) is the active version |
| `public/images/readytomakesome.jpg` | 886 KB — old marketing image, not referenced |
| `public/images/ready to make someones day banner.webp` | Old banner, not referenced |
| `public/images/landing-hero.webp` | Not referenced in code |
| `public/images/banners/hero.webp` | Loose file inside banners/, not referenced |
| `public/images/lily.webp` | Not referenced |
| `public/images/garland.webp` | Not referenced |
| `public/images/whatsappiconforen.png` | Not referenced (WhatsApp icon served from `public/social svgs/`) |

---

## Files Left Untouched (Safety Concerns)

The following folders were identified but left untouched because their usage via Supabase database URLs could not be verified without querying the live database:

| Folder | Reason Left Untouched |
|---|---|
| `images/birthday gifts that wow/` | May be used in Supabase `featured_items` table |
| `images/collection images/` | May be in Supabase `collections.image_url` |
| `images/for every relationship/` | May be in Supabase `relationships.image_url` |
| `images/new cards/` | May be in Supabase `banners` table |
| `images/new icons/` | Unknown Supabase usage |
| `images/new-products/` | May be in Supabase `products.image_url` |
| `images/product images/` | May be in Supabase `products.image_url` |
| Other hero banners in `banners/hero/` | May be in Supabase `banners` table (admin-managed) |

---

## Verification Results

| Check | Result |
|---|---|
| `npx tsc --noEmit` | ✅ PASSED — 0 errors |
| Active hero banners intact | ✅ All 3 kebab files present |
| Active promo banners intact | ✅ All 4 kebab files present |
| CTA banner intact | ✅ `cta-banner.webp` present |
| Cart icons intact | ✅ All 4 files present |
| `our-story.webp` intact | ✅ Present |
| `celebrations/` active files | ✅ All 5 present |
| Git diff — source code changed | ✅ 0 source files modified |
| Archive contains 39 files | ✅ Confirmed |
| Machine log | `storage/unused-assets/ARCHIVE_LOG.json` |

---

## Pending — Awaiting Approval

| Item | Status |
|---|---|
| Product numbering system (001, 002...) | ⏳ Proposed SQL migration awaiting approval |
| Product search by number in admin | ⏳ Awaiting approval |
| Supabase DB query to verify uncertain folders | ⏳ Awaiting authorization |
