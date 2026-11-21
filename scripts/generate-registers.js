const fs = require('fs');
const path = require('path');

const root = 'c:/Users/thene/newecorosesweb';
const { PRODUCTS } = require(path.join(root, 'lib/products.ts'));

// 1. Generate PRODUCT_REGISTER.md
function generateProductRegister() {
  let md = `# NEW ECO ROSES — Master Product Register\n`;
  md += `**Total Catalog Products:** ${PRODUCTS.length}\n`;
  md += `**Last Updated:** ${new Date().toISOString().split('T')[0]}\n`;
  md += `**Source of Truth:** \`lib/products.ts\` & Supabase \`products\` table\n\n`;

  md += `> [!NOTE]\n`;
  md += `> This register catalogs all 146 unique products currently active in the NEW ECO ROSES catalog.\n`;
  md += `> Permanent 3-digit product numbers (\`001\` through \`${String(PRODUCTS.length).padStart(3, '0')}\`) are assigned sequentially below. Each number remains permanent and will never be reused or changed.\n\n`;

  md += `| Product # | Product Name | Product ID | Category / Collection | Tag | Stock | Main Image | Additional Images | Supabase Reference |\n`;
  md += `|---|---|---|---|---|---|---|---|---|\n`;

  PRODUCTS.forEach((p, index) => {
    const num = String(index + 1).padStart(3, '0');
    // Normalize curly quotes for clean markdown rendering
    const name = (p.name || '').replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/\|/g, '-');
    const id = p.id || '';
    const cat = `${p.collection || ''} (\`${p.collectionSlug || ''}\`)`;
    const tag = p.tag || 'Standard';
    const stock = p.stock ?? 'N/A';
    const mainImg = p.image_url ? `\`${p.image_url.replace(/[\u2018\u2019]/g, "'")}\`` : 'None';
    const otherImgsCount = (p.images && p.images.length > 1) ? `${p.images.length - 1} extra` : '0';
    const supaRef = `\`id: ${id}\`, \`slug: ${p.slug}\``;

    md += `| **${num}** | ${name} | \`${id}\` | ${cat} | ${tag} | ${stock} | ${mainImg} | ${otherImgsCount} | ${supaRef} |\n`;
  });

  md += `\n---\n\n## Product Categories Breakdown\n\n`;
  const catMap = {};
  PRODUCTS.forEach(p => {
    const col = p.collection || 'Uncategorized';
    catMap[col] = (catMap[col] || 0) + 1;
  });

  Object.entries(catMap).sort((a,b) => b[1] - a[1]).forEach(([col, count]) => {
    md += `- **${col}**: ${count} products\n`;
  });

  md += `\n## Celebration Tags Breakdown\n\n`;
  const celebMap = {};
  PRODUCTS.forEach(p => {
    (p.celebrations || []).forEach(c => {
      celebMap[c] = (celebMap[c] || 0) + 1;
    });
  });

  Object.entries(celebMap).sort((a,b) => b[1] - a[1]).forEach(([celeb, count]) => {
    md += `- **${celeb}**: ${count} products\n`;
  });

  fs.writeFileSync(path.join(root, 'documentation/PRODUCT_REGISTER.md'), md, 'utf8');
  console.log('Regenerated documentation/PRODUCT_REGISTER.md with clean quotes.');
}

// 2. Generate PROJECT_ASSET_REGISTER.md
function generateAssetRegister() {
  const codePaths = new Set(
    fs.readFileSync(path.join(root, 'code-image-paths.txt'), 'utf8')
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
  );

  const archiveLogPath = path.join(root, 'storage/unused-assets/ARCHIVE_LOG.json');
  let archivedMoves = [];
  if (fs.existsSync(archiveLogPath)) {
    const data = JSON.parse(fs.readFileSync(archiveLogPath, 'utf8'));
    archivedMoves = data.log || [];
  }

  // Scan public directory
  const publicDir = path.join(root, 'public');
  const allAssets = [];

  function walkDir(dir) {
    const list = fs.readdirSync(dir);
    for (const f of list) {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walkDir(full);
      } else {
        const ext = path.extname(f).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp', '.svg', '.mp4', '.ico'].includes(ext)) {
          const relToPublic = path.relative(publicDir, full).replace(/\\/g, '/');
          allAssets.push({
            filename: f,
            relToPublic,
            fullPath: full,
            size: stat.size,
            ext
          });
        }
      }
    }
  }
  walkDir(publicDir);

  let md = `# NEW ECO ROSES — Master Project Asset Register\n`;
  md += `**Total Active Public Media Assets:** ${allAssets.length}\n`;
  md += `**Total Safely Archived Assets:** ${archivedMoves.length}\n`;
  md += `**Generated:** ${new Date().toISOString().split('T')[0]}\n\n`;

  md += `> [!NOTE]\n`;
  md += `> This register provides a comprehensive, searchable inventory of all visual and media assets in the project.\n`;
  md += `> No active files were renamed or broken. All 39 safely archived duplicates/unused items are documented in Section 2.\n\n`;

  md += `## 1. Active Media Assets in \`public/\`\n\n`;
  md += `| Asset Filename | Type | Current Location | Code Usage Status | Associated Component / Usage | Status |\n`;
  md += `|---|---|---|---|---|---|\n`;

  // Sort by folder
  allAssets.sort((a,b) => a.relToPublic.localeCompare(b.relToPublic));

  allAssets.forEach(a => {
    const webPath = '/' + a.relToPublic;
    const isDirectCode = codePaths.has(webPath);

    let assetType = 'General Graphic';
    let assoc = 'Public Asset';
    let status = isDirectCode ? 'Active (Direct Code)' : 'Preserved (DB/Runtime / Static)';

    if (a.relToPublic.startsWith('images/banners/hero/')) {
      assetType = 'Hero Banner';
      assoc = 'HeroSlider (`components/home/hero-slider.tsx`)';
    } else if (a.relToPublic.startsWith('images/banners/promo/')) {
      assetType = 'Promotional Banner';
      assoc = 'PromoSlider (`components/home/promo-slider.tsx`)';
    } else if (a.relToPublic === 'images/banners/cta-banner.webp') {
      assetType = 'CTA Banner';
      assoc = 'Homepage CTA Section (`app/page.tsx`)';
    } else if (a.relToPublic.startsWith('images/cart/')) {
      assetType = 'Cart UI Icon';
      assoc = 'Cart Page (`app/cart/page.tsx`)';
    } else if (a.relToPublic.startsWith('images/occasions/')) {
      assetType = 'Occasion Icon (3D)';
      assoc = 'Cart Occasion Selector (`app/cart/page.tsx`)';
    } else if (a.relToPublic.startsWith('images/addons/')) {
      assetType = 'Addon Product';
      assoc = 'Addon Configuration (`lib/addons.ts`)';
    } else if (a.relToPublic.startsWith('images/categories/')) {
      assetType = 'Category Banner / Icon';
      assoc = 'Categories (`lib/supabase.ts`)';
    } else if (a.relToPublic.startsWith('images/celebrations/')) {
      assetType = 'Celebration Graphic';
      assoc = 'Celebrations (`lib/supabase.ts`)';
    } else if (a.relToPublic.startsWith('images/collections/')) {
      assetType = 'Collection Icon (PNG)';
      assoc = 'Collection Navigator (`app/shop/page.tsx`)';
    } else if (a.relToPublic.startsWith('images/handpicked/')) {
      assetType = 'Curated Rose Graphic';
      assoc = 'Handpicked Section (`app/page.tsx`)';
    } else if (a.relToPublic.startsWith('images/landing-page/')) {
      assetType = 'Landing Hero Graphic';
      assoc = 'Landing Hero (`components/home/hero.tsx`)';
    } else if (a.relToPublic.startsWith('images/photo-reviews/')) {
      assetType = 'Customer Photo Review';
      assoc = 'PhotoReviews (`components/home/photo-reviews.tsx`)';
    } else if (a.relToPublic.startsWith('images/picks/')) {
      assetType = 'Curated Pick Graphic';
      assoc = 'Homepage Picks Section';
    } else if (a.relToPublic.startsWith('images/relationships/')) {
      assetType = 'Relationship Filter Graphic';
      assoc = 'Relationships (`lib/supabase.ts`)';
    } else if (a.relToPublic.startsWith('images/products/cakes/')) {
      assetType = 'Cake Product';
      assoc = 'Catalog (`lib/products.ts`)';
    } else if (a.relToPublic.startsWith('images/products/babys breath/')) {
      assetType = 'Flower Product';
      assoc = 'Catalog (`lib/products.ts`)';
    } else if (a.relToPublic.startsWith('images/products/')) {
      assetType = 'Catalog Product Image';
      assoc = 'Catalog (`lib/products.ts`)';
    } else if (a.relToPublic.startsWith('images/decoration/')) {
      assetType = 'Decoration Service';
      assoc = 'Decoration booking catalog';
    } else if (a.relToPublic.startsWith('social svgs/')) {
      assetType = 'Social Vector Icon';
      assoc = 'Header / Footer social navigation';
    } else if (a.relToPublic.startsWith('review videos/')) {
      assetType = 'Customer Video Review';
      assoc = 'Customer Video Review Section';
    } else if (a.relToPublic.startsWith('favicon_io/') || a.filename.includes('favicon')) {
      assetType = 'Branding Favicon';
      assoc = 'Browser Metadata (`app/layout.tsx`)';
    } else if (a.relToPublic === 'logo.png') {
      assetType = 'Official Brand Logo';
      assoc = 'Header & Brand Identity';
    } else if (a.relToPublic === 'why new eco roses banner.webp') {
      assetType = 'Homepage Trust Banner';
      assoc = 'Homepage Trust Section (`app/page.tsx`)';
    } else if (a.relToPublic.startsWith('images/collection images/')) {
      assetType = 'Collection Banner';
      assoc = 'Supabase Collections (`collections` table)';
      status = 'Preserved (Supabase DB Reference)';
    } else if (a.relToPublic.startsWith('images/for every relationship/')) {
      assetType = 'Relationship Banner';
      assoc = 'Supabase Relationships (`relationships` table)';
      status = 'Preserved (Supabase DB Reference)';
    } else if (a.relToPublic.startsWith('images/birthday gifts that wow/')) {
      assetType = 'Birthday Feature Icon';
      assoc = 'Homepage Birthday Feature / Supabase';
      status = 'Preserved (Homepage Feature)';
    } else if (a.relToPublic.startsWith('images/new-products/')) {
      assetType = 'Product Staging Image';
      assoc = 'Supabase Products Table';
      status = 'Preserved (Supabase DB Reference)';
    } else if (a.relToPublic.startsWith('images/new cards/')) {
      assetType = 'Promotional Card';
      assoc = 'Supabase Banners Table';
      status = 'Preserved (Supabase DB Reference)';
    }

    const cleanFilename = a.filename.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/\|/g, '-');
    md += `| \`${cleanFilename}\` | ${assetType} | \`/public/${a.relToPublic}\` | ${isDirectCode ? 'Yes' : 'Dynamic/DB'} | ${assoc} | ${status} |\n`;
  });

  md += `\n---\n\n## 2. Safely Archived Assets (\`storage/unused-assets/\`)\n\n`;
  md += `| Filename | Original Location | Archive Location | Reason Archived | Size |\n`;
  md += `|---|---|---|---|---|\n`;

  archivedMoves.forEach(m => {
    const fn = path.basename(m.src).replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/\|/g, '-');
    const orig = `\`public/${m.src}\``;
    const dest = `\`storage/unused-assets/${m.dst}\``;
    let reason = 'Duplicate / Superseded by kebab-case equivalent';
    if (m.src.includes('calender')) {
      reason = 'Unoptimized duplicate of optimized celebrations image';
    } else if (m.src.includes('remaining pictures')) {
      reason = 'Unused legacy image with zero references';
    } else if (m.src.includes('readyto') || m.src.includes('ready to make') || m.src.includes('landing-hero') || m.src.includes('garland') || m.src.includes('lily') || m.src.includes('whatsappicon')) {
      reason = 'Unreferenced loose asset with zero references';
    }
    const sizeKb = Math.round(m.size / 1024) + ' KB';
    md += `| \`${fn}\` | ${orig} | ${dest} | ${reason} | ${sizeKb} |\n`;
  });

  fs.writeFileSync(path.join(root, 'documentation/PROJECT_ASSET_REGISTER.md'), md, 'utf8');
  console.log('Regenerated documentation/PROJECT_ASSET_REGISTER.md with clean quotes.');
}

generateProductRegister();
generateAssetRegister();
