/**
 * supabase-admin.ts — SERVER-SIDE ONLY
 *
 * Uses the Service Role key which bypasses RLS entirely.
 * NEVER import this file in client components or expose it to the browser.
 * Only use in: app/api/**, server actions, or server components.
 */

import { createClient } from '@supabase/supabase-js';

// Lazy singleton — created on first use, not at module load time.
// This prevents build-time errors when env vars aren't yet available.
let _client: ReturnType<typeof createClient> | null = null;

export function getSupabaseAdmin() {
    if (_client) return _client;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error(
            'Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your Vercel project settings.'
        );
    }

    _client = createClient(url, key, {
        auth: { autoRefreshToken: false, persistSession: false },
    });

    return _client;
}

// Convenience alias so existing imports still work
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
    get(_target, prop) {
        return (getSupabaseAdmin() as any)[prop];
    },
});
