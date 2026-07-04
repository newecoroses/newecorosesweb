/**
 * GET /api/admin/analytics/sources
 *
 * Classifies traffic by referrer into:
 * - Direct (no referrer)
 * - Google Search
 * - Social Media (Instagram, Facebook, WhatsApp, Twitter, YouTube, etc.)
 * - Referral (all other external sites)
 *
 * Reads from analytics_events for the last 30 days.
 * Limited to 10,000 rows via index scan on created_at.
 */

import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

const SOCIAL_DOMAINS = [
    'instagram.com', 'facebook.com', 'fb.com', 'twitter.com', 'x.com',
    'whatsapp.com', 'youtube.com', 'linkedin.com', 'pinterest.com',
    'tiktok.com', 'snapchat.com', 't.co',
];

const SEARCH_DOMAINS = [
    'google.', 'bing.com', 'yahoo.com', 'duckduckgo.com', 'yandex.',
];

function classifyReferrer(referrer: string | null): string {
    if (!referrer) return 'Direct';
    try {
        const url = new URL(referrer);
        const host = url.hostname.toLowerCase();
        if (SEARCH_DOMAINS.some(d => host.includes(d))) return 'Google / Search';
        if (SOCIAL_DOMAINS.some(d => host.includes(d))) return 'Social Media';
        return 'Referral';
    } catch {
        return 'Direct';
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const days = Math.min(parseInt(searchParams.get('days') ?? '30', 10), 90);
        const monthFilter = searchParams.get('month');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = getSupabaseAdmin() as any;

        let query = db
            .from('analytics_events')
            .select('referrer')
            .eq('event_type', 'pageview')
            .limit(10000);

        if (monthFilter) {
            const start = `${monthFilter}-01T00:00:00Z`;
            const [y, m] = monthFilter.split('-');
            const end = new Date(parseInt(y), parseInt(m), 1).toISOString();
            query = query.gte('created_at', start).lt('created_at', end);
        } else {
            const fromDate = new Date();
            fromDate.setDate(fromDate.getDate() - (days - 1));
            fromDate.setHours(0, 0, 0, 0);
            query = query.gte('created_at', fromDate.toISOString());
        }

        const { data, error } = await query;

        if (error) throw error;

        const counts: Record<string, number> = {
            'Direct': 0,
            'Google / Search': 0,
            'Social Media': 0,
            'Referral': 0,
        };

        for (const row of (data ?? []) as any[]) {
            const source = classifyReferrer(row.referrer as string | null);
            counts[source] = (counts[source] ?? 0) + 1;
        }

        const total = Object.values(counts).reduce((a, b) => a + b, 0);
        const result = Object.entries(counts).map(([source, count]) => ({
            source,
            count,
            percentage: total > 0 ? parseFloat(((count / total) * 100).toFixed(1)) : 0,
        })).sort((a, b) => b.count - a.count);

        return NextResponse.json(result, {
            headers: { 'Cache-Control': 's-maxage=300' },
        });
    } catch (error: unknown) {
        console.error('[analytics/sources]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
