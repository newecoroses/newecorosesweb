/**
 * GET /api/admin/analytics/realtime
 * Returns count of sessions active in the last 5 minutes + their pages.
 *
 * POST /api/admin/analytics/realtime
 * Upserts a session heartbeat (called every 30s from AnalyticsTracker).
 *
 * Performance note: analytics_realtime is a tiny table.
 * The query only reads rows newer than 5 minutes — indexed on last_seen.
 */

import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET — how many sessions are active right now?
export async function GET() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = getSupabaseAdmin() as any;
        const cutoff = new Date(Date.now() - 5 * 60 * 1000).toISOString();

        const { data, error } = await db
            .from('analytics_realtime')
            .select('session_id, page_url')
            .gte('last_seen', cutoff);

        if (error) throw error;

        const sessions = (data ?? []) as any[];

        // Count unique pages
        const pageCounts = new Map<string, number>();
        for (const s of sessions) {
            const page = (s.page_url as string | null) ?? '/';
            // Strip the origin, keep only pathname
            let pathname = page;
            try { pathname = new URL(page).pathname; } catch { /* keep as-is */ }
            pageCounts.set(pathname, (pageCounts.get(pathname) ?? 0) + 1);
        }

        const activePages = Array.from(pageCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([page, count]) => ({ page, count }));

        return NextResponse.json({
            online: sessions.length,
            activePages,
        });
    } catch (error: unknown) {
        console.error('[analytics/realtime GET]', error);
        return NextResponse.json({ online: 0, activePages: [] });
    }
}

// POST — heartbeat from browser
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const sessionId = body.session_id?.slice(0, 100);
        const pageUrl = body.page_url?.slice(0, 2000);

        if (!sessionId) return new NextResponse(null, { status: 204 });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db2 = getSupabaseAdmin() as any;
        await db2.from('analytics_realtime').upsert({
            session_id: sessionId,
            page_url: pageUrl ?? null,
            last_seen: new Date().toISOString(),
        }, { onConflict: 'session_id' });

        return new NextResponse(null, { status: 204 });
    } catch (error: unknown) {
        console.error('[analytics/realtime POST]', error);
        return new NextResponse(null, { status: 204 });
    }
}
