# NEW ECO ROSES — Project Structure Guide
**Last Updated:** 2026-11-22  
**Framework:** Next.js 14 (App Router) | TypeScript | Tailwind CSS | Supabase

---

## Overview

This document explains what every major folder in the project contains and where new files should go.

---

## Application Source Code

### `app/`
Next.js App Router pages. Each subfolder is a route.

| Route | Description |
|---|---|
| `app/page.tsx` | Homepage |
| `app/shop/page.tsx` | Shop product listing |
| `app/product/[slug]/page.tsx` | Individual product detail |
| `app/cart/page.tsx` | Shopping cart |
| `app/checkout/page.tsx` | Checkout & payment |
| `app/collection/[slug]/page.tsx` | Collection pages |
| `app/admin/` | Admin dashboard (20+ management sections) |
| `app/staff/` | Staff-facing dashboard |
| `app/order-confirmation/` | Post-order confirmation |
| `app/track-order/` | Order tracking |

**Do not add images here. Do not modify routes without testing.**

### `components/`
Reusable React components, organized by feature.

| Folder | Contents |
|---|---|
| `components/home/` | Homepage sections: `hero-slider.tsx`, `promo-slider.tsx`, `photo-reviews.tsx` |
| `components/cart/` | Cart drawer, auth-drawer |
| `components/checkout/` | OTP modal, checkout forms |
| `components/product/` | Product card, gallery |
| `components/ui/` | Shared UI: delivery scooter, location modal |
| `components/admin/` | Admin-only components: `single-image-upload.tsx` |

### `lib/`
Data layer and utilities.

| File | Purpose |
|---|---|
| `lib/products.ts` | **All 146 local product definitions** (name, slug, images, price, stock) |
| `lib/supabase.ts` | All Supabase queries: products, banners, collections, celebrations, relationships |
| `lib/addons.ts` | Cart add-on item definitions with image paths |
| `lib/coupons.ts` | Coupon codes and discount logic |
| `lib/kolkata-pincodes.ts` | Delivery pincode validation |
| `lib/email.ts` | Order confirmation email templates |
| `lib/razorpay.ts` | Payment gateway integration |

---

## Public Assets (`public/`)

> [!IMPORTANT]
> Never move or rename any file in `public/` without updating every code reference to that path.

### `public/` root files
| File | Purpose |
|---|---|
| `favicon.ico`, `favicon_io/` | Site favicon |
| `logo.png` | Brand logo |
| `placeholder.webp` | Fallback image for missing products |
| `why new eco roses banner.webp` | Referenced via URL-encoded path in homepage — **do not rename** |
| `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`, `next.svg` | Framework defaults, can be ignored |

### `public/images/` — Main Image Library

#### Actively used image folders (DO NOT REORGANIZE)

| Folder | Contents | Used By |
|---|---|---|
| `images/addons/` | 7 cart addon product images | `lib/addons.ts` |
| `images/banners/hero/` | 3 active hero banner webps (kebab-named) | `components/home/hero-slider.tsx` |
| `images/banners/promo/` | 4 active promo slider webps (kebab-named) | `components/home/promo-slider.tsx` |
| `images/banners/cta-banner.webp` | Full-width CTA section image | `app/page.tsx` |
| `images/cart/` | 4 cart UI icons (login, message card, make it special, recommended addons) | `app/cart/page.tsx` |
| `images/categories/` | Category icon images (slug-named .webp) | `lib/supabase.ts` (dynamic slug) |
| `images/celebrations/` | Festival/seasonal images | `lib/supabase.ts` |
| `images/collections/` | Collection icon PNGs | `app/shop/page.tsx` |
| `images/decoration/` | Decoration service images | Decoration pages |
| `images/handpicked/` | 4 handpicked rose section images | `app/page.tsx`, `staff/homepage/` |
| `images/landing-page/` | Hero slider images (desktop + mobile: slide-1/2/3, lp1/2/3mv) | `components/home/hero.tsx` |
| `images/occasions/` | 9 occasion icons (birthday, anniversary, etc.) | `app/cart/page.tsx` |
| `images/our-story.webp` | "Our Story" section image | `app/page.tsx` |
| `images/photo-reviews/` | 9 customer photo review images | `components/home/photo-reviews.tsx` |
| `images/picks/birthday/` | Birthday sub-category pick images | Picks section |
| `images/picks/flowers/` | Flower sub-category pick images | Picks section |
| `images/products/` | All product images (~160 files) | `lib/products.ts` |
| `images/products/cakes/` | Cake product images | `lib/products.ts` |
| `images/products/babys breath/` | Baby's breath product images | `lib/products.ts` |
| `images/relationships/` | Relationship filter images | `lib/supabase.ts` |

#### Folders with uncertain Supabase usage (DO NOT MOVE without DB check)

| Folder | Contents | Concern |
|---|---|---|
| `images/birthday gifts that wow/` | 4 category icon images | May be in Supabase `featured_items` |
| `images/collection images/` | 6 collection hero webps | May be in Supabase `collections.image_url` |
| `images/for every relationship/` | Relationship images | May overlap with Supabase `relationships` |
| `images/new cards/` | Promo-style images | May be in Supabase `banners` table |
| `images/new icons/` | Icon images | Unknown DB usage |
| `images/new-products/` | Product images | May be in Supabase `products.image_url` |
| `images/product images/` | Older product images | May be in Supabase `products` |

### `public/review videos/`
Customer video reviews: `review1.mp4` through `review7.mp4`. Referenced by the homepage video review section.

### `public/social svgs/`
Social media SVG icons (WhatsApp, Instagram, Google Maps, website). Referenced by footer/contact components.

### `public/favicon_io/`
Favicon variants generated for all device sizes. Referenced in `app/layout.tsx`.

---

## Where to Add New Files

### New hero banner images
→ `public/images/banners/hero/`  
→ Use kebab-case naming: `your-banner-name.webp`  
→ Add the path to `components/home/hero-slider.tsx` `ALL_BANNERS` array

### New promo slider images
→ `public/images/banners/promo/`  
→ Use kebab-case naming  
→ Add to `components/home/promo-slider.tsx` `PROMOS` array

### New product images
→ `public/images/products/` (or appropriate subfolder)  
→ Update the product entry in `lib/products.ts`

### New addon images
→ `public/images/addons/`  
→ Update `lib/addons.ts`

### New category icons
→ `public/images/categories/`  
→ Filename must match the category slug exactly (e.g., `birthday.webp` for slug `birthday`)

### New occasion icons (cart)
→ `public/images/occasions/`  
→ Update occasion list in `app/cart/page.tsx`

### New celebration images
→ `public/images/celebrations/`  
→ Update Supabase `celebrations` table with the new image URL

---

## Archive / Unused Assets

### `storage/unused-assets/`
Safe archive of files removed from `public/` during the 2026-11-22 cleanup.

| Subfolder | Contents |
|---|---|
| `duplicates/banners-hero-display-names/` | Display-name duplicates of active kebab-named hero banners |
| `duplicates/banners-hero-NEW-HEROS/` | Duplicate subfolder that was identical to parent |
| `duplicates/banners-promo-display-names/` | Display-name and old-name duplicates of active promo banners |
| `duplicates/celebrations-calender/` | Unoptimized originals of the `celebrations/` images |
| `unused/remaining-pictures/` | Uncategorized images not referenced anywhere |
| `unused/root-loose-images/` | Root-level images not referenced in code |

**Files here are NOT deleted.** To restore any file, copy it back to `public/images/` and update the relevant code reference.

---

## Database (Supabase)

The website uses Supabase for:
- Product catalogue (live Supabase products table + local `lib/products.ts`)
- Banners (admin-managed via `/admin/banners`)
- Collections, Celebrations, Relationships, Featured Items
- Orders, Customers, Analytics, Staff activity
- OTP verification and customer authentication

**All Supabase queries are in `lib/supabase.ts`.**  
**Never modify Supabase tables without reviewing `lib/supabase.ts` first.**

---

## Configuration Files

| File | Purpose |
|---|---|
| `.env.local` | Supabase keys, Razorpay keys — never commit |
| `next.config.js` / `next.config.ts` | Next.js configuration |
| `tailwind.config.ts` | Tailwind CSS theme |
| `tsconfig.json` | TypeScript configuration |
| `package.json` | Dependencies and scripts |

---

## SQL Files at Project Root

These are historical migration scripts, kept for reference:

| File | Description |
|---|---|
| `supabase_schema.sql` | Base schema |
| `supabase_schema_extras.sql` | Schema extensions |
| `setup_supabase_crud.sql` | CRUD setup |
| `add_*.sql`, `update_*.sql` | Historical product/data additions |
| `analytics_schema.sql` | Analytics table schema |

**Do not run these without understanding their impact on the existing database.**
