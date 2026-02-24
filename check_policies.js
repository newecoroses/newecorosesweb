const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function run() {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
    const serviceRoleMatch = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
    const supabaseService = createClient(urlMatch[1].trim(), serviceRoleMatch[1].trim());

    // check policies
    const { data: policies, error } = await supabaseService.rpc('exec_sql', {
        query: `
        SELECT tablename, policyname, permissive, roles, cmd, qual, with_check 
        FROM pg_policies 
        WHERE tablename = 'collections';
    `});

    if (error) {
        console.log("No exec_sql RPC. Trying direct via REST");
    } else {
        console.log(policies);
    }
}
run();
