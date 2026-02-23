const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function run() {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
    const serviceRoleMatch = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
    const supabaseService = createClient(urlMatch[1].trim(), serviceRoleMatch[1].trim());

    const { data: products } = await supabaseService.from('products').select('*').limit(1);
    console.log("Found product:", products[0].name);

    console.log("Trying to update image_url to '' using service role key:");
    const { data: updateData, error: updateError } = await supabaseService.from('products').update({ image_url: '' }).eq('id', products[0].id).select();

    console.log("Data:", updateData);
    console.log("Error:", updateError);

    // restore
    await supabaseService.from('products').update({ image_url: products[0].image_url }).eq('id', products[0].id);
}
run();
