const fs = require('fs');
const path = require('path');

const root = 'c:/Users/thene/newecorosesweb';
const { PRODUCTS } = require(path.join(root, 'lib/products.ts'));

const dbData = JSON.parse(fs.readFileSync(path.join(root, 'scripts/supabase-image-urls.json')));
const dbProds = dbData.tables.products;

function cleanStr(s) {
  return (s || '').replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/\|/g, '-');
}

function generateProductRegister() {
  let md = `# NEW ECO ROSES — Master Product Register\n`;
  md += `**Last Updated:** ${new Date().toISOString().split('T')[0]}\n`;
  md += `**Source:** \`lib/products.ts\` (local catalog) + Supabase DB\n\n`;

  // ---- Section 1: Local catalog with permanent numbers ----
  md += `---\n\n## Section 1: Local Catalog — 146 Products (Permanent Numbers 001–146)\n\n`;
  md += `> [!NOTE]\n`;
  md += `> These are the 146 products defined in \`lib/products.ts\`. Each has a permanent sequential number assigned here. Numbers never change, are never reused.\n\n`;

  md += `| # | Product Name | Product ID | Collection | Tag | Stock | Main Image |\n`;
  md += `|---|---|---|---|---|---|---|\n`;

  PRODUCTS.forEach((p, i) => {
    const num = String(i + 1).padStart(3, '0');
    const name = cleanStr(p.name);
    const img = cleanStr(p.image_url || '');
    md += `| **${num}** | ${name} | \`${p.id}\` | ${p.collection} | ${p.tag} | ${p.stock} | \`${img}\` |\n`;
  });

  // Category breakdown
  md += `\n### Local Catalog — Category Breakdown\n\n`;
  const catMap = {};
  PRODUCTS.forEach(p => { const c = p.collection || 'Unknown'; catMap[c] = (catMap[c] || 0) + 1; });
  Object.entries(catMap).sort((a,b) => b[1] - a[1]).forEach(([c, n]) => { md += `- **${c}**: ${n} products\n`; });

  // ---- Section 2: Supabase-only products ----
  md += `\n---\n\n## Section 2: Supabase Database — Full Product Catalogue (319 total)\n\n`;
  md += `> [!IMPORTANT]\n`;
  md += `> Supabase contains **319 products** total — this includes the 146 from \`lib/products.ts\` (which also exist in Supabase) plus **173 additional Supabase-only products** (uploaded via admin dashboard). These products use either local \`/images/\` paths or **Supabase Storage URLs** for their images.\n\n`;

  md += `### 2a. Products Using Supabase Storage URLs (38 products)\n`;
  md += `These products store their images in Supabase Storage — they are completely independent of \`public/images/\`.\n\n`;
  md += `| Supabase ID | Product Name | Image URL |\n`;
  md += `|---|---|---|\n`;
  const storageProds = dbProds.filter(p => p.image_url && p.image_url.startsWith('https://'));
  storageProds.forEach(p => {
    md += `| \`${p.id}\` | ${cleanStr(p.name)} | Supabase Storage |\n`;
  });

  md += `\n### 2b. Products Using /new-products/ Local Path (13 products — ACTIVE, do not move folder)\n\n`;
  md += `| Supabase ID | Product Name | Image Path |\n`;
  md += `|---|---|---|\n`;
  const newProdProds = dbProds.filter(p => p.image_url && p.image_url.includes('/new-products/'));
  newProdProds.forEach(p => {
    md += `| \`${p.id}\` | ${cleanStr(p.name)} | \`${cleanStr(p.image_url)}\` |\n`;
  });

  // ---- Section 3: Product numbering plan ----
  md += `\n---\n\n## Section 3: Product Numbering System — Proposed (Awaiting Approval)\n\n`;
  md += `> [!WARNING]\n`;
  md += `> The following SQL migration would add a permanent \`product_number\` column to the Supabase \`products\` table.\n> **This has NOT been applied.** It requires explicit approval before execution.\n\n`;
  md += `\`\`\`sql\n`;
  md += `-- Add product_number column to Supabase products table\n`;
  md += `ALTER TABLE products ADD COLUMN IF NOT EXISTS product_number INTEGER UNIQUE;\n\n`;
  md += `-- Create a sequence for safe auto-increment\n`;
  md += `CREATE SEQUENCE IF NOT EXISTS product_number_seq START 1;\n\n`;
  md += `-- Function to auto-assign on insert\n`;
  md += `CREATE OR REPLACE FUNCTION allocate_product_number()\n`;
  md += `RETURNS TRIGGER AS $$\n`;
  md += `BEGIN\n`;
  md += `  IF NEW.product_number IS NULL THEN\n`;
  md += `    NEW.product_number := nextval('product_number_seq');\n`;
  md += `  END IF;\n`;
  md += `  RETURN NEW;\n`;
  md += `END;\n`;
  md += `$$ LANGUAGE plpgsql;\n\n`;
  md += `-- Trigger on every new product insert\n`;
  md += `CREATE TRIGGER auto_product_number\n`;
  md += `  BEFORE INSERT ON products\n`;
  md += `  FOR EACH ROW EXECUTE FUNCTION allocate_product_number();\n\n`;
  md += `-- Backfill existing 319 products with sequential numbers\n`;
  md += `UPDATE products p\n`;
  md += `SET product_number = sub.rn\n`;
  md += `FROM (\n`;
  md += `  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC NULLS LAST) AS rn\n`;
  md += `  FROM products\n`;
  md += `) sub\n`;
  md += `WHERE p.id = sub.id;\n`;
  md += `\`\`\`\n`;
  md += `\n**To approve:** Reply "APPROVE PRODUCT NUMBERING MIGRATION" and it will be applied.\n`;

  fs.writeFileSync(path.join(root, 'documentation/PRODUCT_REGISTER.md'), md, 'utf8');
  console.log('Generated PRODUCT_REGISTER.md with Supabase data included.');
}

generateProductRegister();
