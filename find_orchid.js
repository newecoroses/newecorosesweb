const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Extract Supabase URL and Key from .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const supabaseUrlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const supabaseKeyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

if (!supabaseUrlMatch || !supabaseKeyMatch) {
    console.error('Supabase credentials not found in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrlMatch[1].trim(), supabaseKeyMatch[1].trim());

async function run() {
    const { data: products, error } = await supabase.from('products').select('*').ilike('name', '%orchid%');
    console.log("Matching products:");
    if (products) {
        products.forEach(p => console.log(`ID: ${p.id}, Name: ${p.name}, Image: ${p.image_url}`));
    } else {
        console.error(error);
    }
}

run();
