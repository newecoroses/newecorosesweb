const https = require('https');
const crypto = require('crypto');

const SUPABASE_URL = 'https://tdttgbmoaskpmmkvjenq.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkdHRnYm1vYXNrcG1ta3ZqZW5xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTc0Mzg4OSwiZXhwIjoyMDg3MzE5ODg5fQ.g-q9tHew9WCXo1DkZK1O-i6cGvOZ2fvPtk0pazO1ddc';
const SETTINGS_KEY = 'staff_activity_logs';

function supabaseRequest(method, path, body) {
    return new Promise((resolve, reject) => {
        const url = new URL(SUPABASE_URL + path);
        const bodyStr = body ? JSON.stringify(body) : null;
        const req = https.request({
            hostname: url.hostname,
            path: url.pathname + url.search,
            method,
            headers: {
                'Content-Type': 'application/json',
                'apikey': SERVICE_KEY,
                'Authorization': 'Bearer ' + SERVICE_KEY,
                'Prefer': 'return=representation',
                ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}),
            }
        }, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve({ status: res.statusCode, body: data }));
        });
        req.on('error', reject);
        if (bodyStr) req.write(bodyStr);
        req.end();
    });
}

async function main() {
    console.log('Writing clean activity log entry to Supabase...');

    const cleanEntry = {
        id: crypto.randomUUID(),
        staffId: 'super-admin-aditya',
        staffName: 'Aditya Choudhury (Super Admin)',
        action: 'system_reset',
        details: 'Super Admin Aditya Choudhury cleared all demo data. The staff panel is now clean and ready for real orders, real customers, and live store operations. All demo orders, demo analytics, and placeholder data have been wiped. The store is fully live.',
        timestamp: new Date().toISOString(),
    };

    const logsJson = JSON.stringify([cleanEntry]);

    // PATCH to update existing row where key = 'staff_activity_logs'
    const result = await supabaseRequest(
        'PATCH',
        '/rest/v1/site_settings?key=eq.' + SETTINGS_KEY,
        {
            value: logsJson,
            updated_at: new Date().toISOString(),
        }
    );

    console.log('Response status:', result.status);
    console.log('Response body:', result.body.substring(0, 300));

    if (result.status >= 200 && result.status < 300) {
        console.log('\n✅ Done! Activity log cleared. Only Aditya clean-slate entry remains.');
    } else {
        console.error('\n❌ Failed.');
    }
}

main().catch(console.error);
