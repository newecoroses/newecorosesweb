const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function run() {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');

    const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
    const serviceRoleMatch = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);

    const supabase = createClient(urlMatch[1].trim(), serviceRoleMatch[1].trim());

    // try to update a test record with empty string
    const { data: cols } = await supabase.from('collections').select('*').limit(1);

    if (cols.length > 0) {
        console.log("Original:", cols[0].image_url);

        // Use the anon key to simulate admin UI update (Wait, admin UI uses anon key in browser)
        const anonKeyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
        const supabaseAnon = createClient(urlMatch[1].trim(), anonKeyMatch[1].trim());

        const { error, data } = await supabaseAnon.from('collections').update({ image_url: '' }).eq('id', cols[0].id).select();
        console.log("Anon update error:", error);
        console.log("Anon update data:", data);

        // restore
        await supabase.from('collections').update({ image_url: cols[0].image_url }).eq('id', cols[0].id);
    }
}
run();
