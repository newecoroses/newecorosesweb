/**
 * GET /api/admin/analytics/hourly?type=pageview|enquiry&days=7
 *
 * Returns event counts grouped by hour (0-23) for the past N days.
 * Used to power the "Peak Traffic Hours" heatmap.
 *
 * Queries analytics_events directly but uses the indexed `hour` column.
 * Limited to last 7 days by default — efficient index scan.
 */

import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const eventType = searchParams.get('type') === 'enquiry' ? 'enquiry' : 'pageview';
        const days = Math.min(parseInt(searchParams.get('days') ?? '7', 10), 30);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = getSupabaseAdmin() as any;

        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - (days - 1));
        fromDate.setHours(0, 0, 0, 0);

        const { data, error } = await db
            .from('analytics_events')
            .select('hour')
            .eq('event_type', eventType)
            .gte('created_at', fromDate.toISOString());

        if (error) throw error;

        // Aggregate by hour in JS — avoids needing a GROUP BY RPC
        const counts = new Array(24).fill(0) as number[];
        for (const row of (data ?? []) as any[]) {
            const h = row.hour as number;
            if (h >= 0 && h <= 23) counts[h]++;
        }

        const result = counts.map((count, hour) => ({ hour, count }));

        return NextResponse.json(result, {
            headers: { 'Cache-Control': 's-maxage=300' },
        });
    } catch (error: unknown) {
        console.error('[analytics/hourly]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
