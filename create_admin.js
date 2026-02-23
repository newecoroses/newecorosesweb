const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function run() {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
    const serviceRoleMatch = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
    const supabaseService = createClient(urlMatch[1].trim(), serviceRoleMatch[1].trim());

    // Create a new auth user
    const { data, error } = await supabaseService.auth.admin.createUser({
        email: 'admin@newecoroses.com',
        password: 'newecoroses@1209',
        email_confirm: true
    });

    console.log("Create user data:", data);
    console.log("Create user error:", error);
}
run();
