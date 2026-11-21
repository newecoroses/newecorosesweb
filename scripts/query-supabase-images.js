// Query Supabase read-only to find which image_url values are stored in DB tables
// This determines which uncertain folders are actively used in Supabase
const https = require('https');

const SUPABASE_URL = 'https://tdttgbmoaskpmmkvjenq.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkdHRnYm1vYXNrcG1ta3ZqZW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NDM4ODksImV4cCI6MjA4NzMxOTg4OX0.DXExFLSYSrtUf5636QmMvEwzNxoRCd88lVKTcHitzMM';

function query(table, select = 'id,image_url,images') {
  return new Promise((resolve, reject) => {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}&limit=1000`;
    const options = {
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { resolve({ error: e.message, raw: data.slice(0, 200) }); }
      });
    }).on('error', reject);
  });
}

async function main() {
  const results = {};
  
  // Tables that store image URLs
  const queries = [
    ['banners', 'id,title,image_url,position,is_visible'],
    ['collections', 'id,name,slug,image_url'],
    ['celebrations', 'id,name,date_label,image_url'],
    ['relationships', 'id,name,slug,image_url'],
    ['featured_items', 'id,label,image_url,section'],
    ['products', 'id,name,slug,image_url'],
  ];

  for (const [table, sel] of queries) {
    console.log(`Querying ${table}...`);
    const data = await query(table, sel);
    if (data.error || (Array.isArray(data) && data[0]?.code === 'PGRST')) {
      results[table] = { error: data };
    } else {
      results[table] = data;
    }
  }

  // Print all image URLs per table
  const allUrls = new Set();
  for (const [table, rows] of Object.entries(results)) {
    if (!Array.isArray(rows)) { 
      console.log(`\n=== ${table.toUpperCase()} ERROR ===`, rows);
      continue; 
    }
    console.log(`\n=== ${table.toUpperCase()} (${rows.length} rows) ===`);
    rows.forEach(r => {
      if (r.image_url) {
        console.log(`  ${r.id || r.label || r.name}: ${r.image_url}`);
        allUrls.add(r.image_url);
      }
      if (r.images && Array.isArray(r.images)) {
        r.images.forEach(img => { allUrls.add(img); });
      }
    });
  }

  console.log('\n=== ALL UNIQUE IMAGE URLS IN SUPABASE ===');
  [...allUrls].sort().forEach(u => console.log(u));
  
  // Save to file
  const fs = require('fs');
  fs.writeFileSync('c:/Users/thene/newecorosesweb/scripts/supabase-image-urls.json', 
    JSON.stringify({ timestamp: new Date().toISOString(), tables: results, allUrls: [...allUrls].sort() }, null, 2));
  console.log('\nSaved to scripts/supabase-image-urls.json');
}

main().catch(console.error);
