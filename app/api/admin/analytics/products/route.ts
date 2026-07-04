/**
 * GET /api/admin/analytics/products?sort=views|enquiries|conversion&limit=50
 *
 * Returns per-product analytics from the pre-aggregated analytics_product_stats table.
 * Computes conversion rate (enquiries / views * 100) here on the server.
 */

import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sort = searchParams.get('sort') ?? 'enquiries';
        const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 200);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = getSupabaseAdmin() as any;
        const monthFilter = searchParams.get('month');

        if (monthFilter) {
            const start = `${monthFilter}-01T00:00:00Z`;
            const [y, m] = monthFilter.split('-');
            const end = new Date(parseInt(y), parseInt(m), 1).toISOString();

            const { data: events, error } = await db
                .from('analytics_events')
                .select('event_type, product_id, product_name, created_at')
                .gte('created_at', start)
                .lt('created_at', end)
                .not('product_id', 'is', null);

            if (error) throw error;

            const prodMap = new Map<string, { product_name: string; views: number; enquiries: number; last_enquiry_at: string | null }>();
            for (const ev of (events ?? []) as any[]) {
                const pid = ev.product_id as string;
                const pName = ev.product_name as string || '—';
                const type = ev.event_type as string;
                const time = ev.created_at as string;

                const existing = prodMap.get(pid) ?? { product_name: pName, views: 0, enquiries: 0, last_enquiry_at: null };
                if (type === 'pageview') {
                    existing.views++;
                } else if (type === 'enquiry') {
                    existing.enquiries++;
                    if (!existing.last_enquiry_at || time > existing.last_enquiry_at) {
                        existing.last_enquiry_at = time;
                    }
                }
                prodMap.set(pid, existing);
            }

            let rows = Array.from(prodMap.entries()).map(([pid, val]) => ({
                product_id: pid,
                product_name: val.product_name,
                total_views: val.views,
                total_enquiries: val.enquiries,
                conversion_rate: val.views > 0
                    ? parseFloat(((val.enquiries / val.views) * 100).toFixed(1))
                    : 0,
                last_enquiry_at: val.last_enquiry_at,
            }));

            const sortField = sort === 'views' ? 'total_views' : 'total_enquiries';
            rows.sort((a: any, b: any) => b[sortField] - a[sortField]);
            if (sort === 'conversion') {
                rows.sort((a: any, b: any) => b.conversion_rate - a.conversion_rate);
            }
            rows = rows.slice(0, limit);

            return NextResponse.json(rows, {
                headers: { 'Cache-Control': 's-maxage=60' },
            });
        }

        // Determine sort column
        const sortColumn = sort === 'views' ? 'total_views' : 'total_enquiries';

        const { data, error } = await db
            .from('analytics_product_stats')
            .select('product_id, product_name, total_views, total_enquiries, last_enquiry_at, updated_at')
            .order(sortColumn, { ascending: false })
            .limit(limit);

        if (error) throw error;

        const rows = (data ?? [] as any[]).map((row: any) => ({
            product_id: row.product_id,
            product_name: row.product_name,
            total_views: row.total_views,
            total_enquiries: row.total_enquiries,
            // Conversion: enquiries / views (0 if no views)
            conversion_rate: row.total_views > 0
                ? parseFloat(((row.total_enquiries / row.total_views) * 100).toFixed(1))
                : 0,
            last_enquiry_at: row.last_enquiry_at,
        }));

        // If sort is conversion, re-sort after computing
        if (sort === 'conversion') {
            rows.sort((a: any, b: any) => b.conversion_rate - a.conversion_rate);
        }

        return NextResponse.json(rows, {
            headers: { 'Cache-Control': 's-maxage=60' },
        });
    } catch (error: unknown) {
        console.error('[analytics/products]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
