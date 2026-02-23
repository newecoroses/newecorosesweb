const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function run() {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
    const anonMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
    const supabase = createClient(urlMatch[1].trim(), anonMatch[1].trim());

    const { data: cols } = await supabase.from('collections').select('*').limit(1);
    console.log("Found collection:", cols[0].name);

    console.log("Trying to update sort_order to 999 using anon key:");
    const { data, error } = await supabase.from('collections').update({ sort_order: 999 }).eq('id', cols[0].id).select();
    console.log("Data:", data);
    console.log("Error:", error);

    // restore
    await supabase.from('collections').update({ sort_order: cols[0].sort_order }).eq('id', cols[0].id);
}
run();
