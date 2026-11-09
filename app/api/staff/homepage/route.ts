import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getStaffSession } from '@/lib/staff-session';
import { logStaffActivity } from '@/lib/staff-activity';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getStaffSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: allProducts, error }: any = await (supabaseAdmin as any)
            .from('products')
            .select('id, name, slug, tag, image_url, stock, is_visible, is_featured, sort_order')
            .order('sort_order', { ascending: true });

        if (error) {
            throw error;
        }

        const products: any[] = allProducts || [];
        const featured = products.filter(p => p.is_featured);
        const newArrivals = products.filter(p => p.tag === 'New Arrival');
        const bestSellers = products.filter(p => p.tag === 'Best Seller');
        const trending = products.filter(p => p.tag === 'Trending');

        return NextResponse.json({
            featured,
            newArrivals,
            bestSellers,
            trending,
            allProducts,
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getStaffSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!session.permissions.canManageHomepage) {
            return NextResponse.json({ error: 'You do not have permission to manage homepage products.' }, { status: 403 });
        }

        const body = await request.json();
        const { action, productId, productName, is_featured, tag, items } = body;

        if (action === 'toggle_featured') {
            const { error }: any = await (supabaseAdmin as any)
                .from('products')
                .update({ is_featured: Boolean(is_featured), updated_at: new Date().toISOString() })
                .eq('id', productId);

            if (error) throw error;

            await logStaffActivity({
                staffId: session.id,
                staffName: session.name,
                action: is_featured ? 'Featured on Homepage' : 'Removed from Featured',
                productId,
                productName,
                details: is_featured ? 'Product marked as Featured on homepage' : 'Product unfeatured from homepage',
            });

            return NextResponse.json({ success: true });
        }

        if (action === 'set_tag') {
            const newTag = tag || 'Standard';
            const { error }: any = await (supabaseAdmin as any)
                .from('products')
                .update({ tag: newTag, updated_at: new Date().toISOString() })
                .eq('id', productId);

            if (error) throw error;

            await logStaffActivity({
                staffId: session.id,
                staffName: session.name,
                action: 'Homepage Section Updated',
                productId,
                productName,
                details: `Product section label set to "${newTag}"`,
            });

            return NextResponse.json({ success: true });
        }

        if (action === 'reorder') {
            if (Array.isArray(items)) {
                for (const item of items) {
                    await (supabaseAdmin as any)
                        .from('products')
                        .update({ sort_order: Number(item.sort_order), updated_at: new Date().toISOString() })
                        .eq('id', item.id);
                }

                await logStaffActivity({
                    staffId: session.id,
                    staffName: session.name,
                    action: 'Reordered Homepage Products',
                    details: `Updated homepage display order for ${items.length} products`,
                });
            }

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}
