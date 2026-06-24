/**
 * POST /api/analytics/track
 *
 * Public endpoint — receives events from the website (anonymous users).
 * Uses the Supabase service role key (server-side only) so it bypasses RLS.
 *
 * Designed for sendBeacon: returns 204 No Content as quickly as possible.
 * All writes happen after the response is sent via Promise chain.
 *
 * Performance:
 * - Single INSERT into analytics_events
 * - RPC call to upsert analytics_daily (pre-aggregated counters)
 * - RPC call to upsert analytics_product_stats (product-level tracking)
 * All three run in parallel via Promise.all.
 */

import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface TrackPayload {
    event_type: 'pageview' | 'enquiry';
    page_url?: string;
    product_id?: string;
    product_name?: string;
    session_id?: string;
    device_type?: string;
    browser?: string;
    referrer?: string;
    hour?: number;
}

export async function POST(request: Request) {
    try {
        const body: TrackPayload = await request.json();

        // Validate event type
        if (!body.event_type || !['pageview', 'enquiry'].includes(body.event_type)) {
            return new NextResponse(null, { status: 204 });
        }

        // Cast to any to bypass strict Supabase generated types
        // (new tables are not yet in the auto-generated schema)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = getSupabaseAdmin() as any;
        const today = new Date().toISOString().split('T')[0];
        const hour = body.hour ?? new Date().getHours();

        // ── Insert raw event ───────────────────────────────────────────────
        const eventInsert = db.from('analytics_events').insert({
            event_type: body.event_type,
            page_url: body.page_url?.slice(0, 2000) ?? null,
            product_id: body.product_id || null,
            product_name: body.product_name?.slice(0, 200) || null,
            session_id: body.session_id?.slice(0, 100) || null,
            device_type: body.device_type || null,
            browser: body.browser?.slice(0, 50) || null,
            referrer: body.referrer?.slice(0, 500) || null,
            hour,
        });

        // ── Upsert daily aggregates via RPC ────────────────────────────────
        const isPageview = body.event_type === 'pageview';
        const dailyUpsert = db.rpc('upsert_analytics_daily', {
            p_date: today,
            p_pageviews: isPageview ? 1 : 0,
            p_enquiries: isPageview ? 0 : 1,
        });

        // ── Upsert product stats ───────────────────────────────────────────
        const promises: Promise<unknown>[] = [
            eventInsert.then ? eventInsert : Promise.resolve(),
            dailyUpsert.then ? dailyUpsert : Promise.resolve(),
        ];

        if (body.event_type === 'enquiry' && body.product_id) {
            const rpc = db.rpc('upsert_product_stat_enquiry', {
                p_product_id: body.product_id,
                p_product_name: body.product_name || '',
            });
            if (rpc.then) promises.push(rpc);
        } else if (body.event_type === 'pageview' && body.product_id) {
            const rpc = db.rpc('upsert_product_stat_view', {
                p_product_id: body.product_id,
                p_product_name: body.product_name || '',
            });
            if (rpc.then) promises.push(rpc);
        }

        // Fire all writes in parallel without awaiting — respond immediately
        Promise.all(promises).catch(() => {});

        return new NextResponse(null, { status: 204 });
    } catch {
        return new NextResponse(null, { status: 204 });
    }
}
