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
        const monthFilter = searchParams.get('month');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = getSupabaseAdmin() as any;

        let allData: any[] = [];
        let hasMore = true;
        let offset = 0;
        const batchSize = 1000;

        while (hasMore) {
            let query = db
                .from('analytics_events')
                .select('hour')
                .eq('event_type', eventType)
                .range(offset, offset + batchSize - 1);

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

            allData = allData.concat(data || []);

            if ((data || []).length < batchSize) {
                hasMore = false;
            } else {
                offset += batchSize;
            }
        }

        // Aggregate by hour in JS — avoids needing a GROUP BY RPC
        const counts = new Array(24).fill(0) as number[];
        for (const row of allData) {
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
