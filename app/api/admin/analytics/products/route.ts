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
