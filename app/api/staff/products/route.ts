import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getStaffSession } from '@/lib/staff-session';
import { logStaffActivity } from '@/lib/staff-activity';
import { getProductPriceOverrides, setProductPriceOverride } from '@/lib/product-pricing';
import { PRODUCTS, COLLECTIONS } from '@/lib/products';

export const dynamic = 'force-dynamic';

const AVAILABLE_TAGS = [
    'Standard',
    'New Arrival',
    'Best Seller',
    'Trending',
    'Featured',
    'Sale',
    'Limited Edition',
];

const isUUID = (val?: string | null) =>
    typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

export async function GET() {
    try {
        const session = await getStaffSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Fetch DB products
        let dbProds: any[] = [];
        try {
            const { data }: any = await (supabaseAdmin as any)
                .from('products')
                .select('*')
                .order('sort_order', { ascending: true });
            dbProds = data || [];
        } catch (e) {
            console.error('Error fetching DB products:', e);
        }

        // 2. Fetch price overrides
        const priceOverrides = await getProductPriceOverrides();

        // 3. Merge with static products if not in DB
        const dbSlugs = new Set(dbProds.map(p => p.slug));
        const extraStatic = PRODUCTS.filter(p => !dbSlugs.has(p.slug)).map((p, idx) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description || '',
            collection_name: p.collection || 'General',
            collection_slug: p.collectionSlug || 'general',
            relationships: p.relationships || [],
            celebrations: p.celebrations || [],
            tag: p.tag || 'Standard',
            image_url: p.image_url || '',
            images: p.images || [p.image_url],
            image_scale: p.imageScale ?? 1,
            stock: p.stock ?? 10,
            is_visible: true,
            is_featured: p.tag === 'Best Seller' || p.tag === 'New Arrival',
            sort_order: 1000 + idx,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            item_count: p.itemCount ?? 1,
        }));

        const allProducts = [...dbProds, ...extraStatic].map(p => {
            const override = priceOverrides[p.id] || priceOverrides[p.slug];
            return {
                ...p,
                price: override?.price !== undefined ? override.price : (p.price ?? null),
                original_price: override?.original_price !== undefined ? override.original_price : (p.original_price ?? null),
            };
        });

        // 4. Fetch collections
        let collections: any[] = [];
        try {
            const { data: dbCols }: any = await (supabaseAdmin as any)
                .from('collections')
                .select('*')
                .order('sort_order', { ascending: true });
            collections = dbCols || [];
        } catch (_) {}

        if (collections.length === 0) {
            collections = COLLECTIONS.map((c, i) => ({
                id: `col-${i}`,
                name: c.name,
                slug: c.slug,
                sort_order: i,
            }));
        }

        return NextResponse.json({
            products: allProducts,
            collections,
            tags: AVAILABLE_TAGS,
        });
    } catch (err: any) {
        console.error('Products GET error:', err);
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getStaffSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            productId,
            slug,
            name,
            description,
            price,
            original_price,
            stock,
            is_visible,
            is_featured,
            sort_order,
            tag,
            collection_name,
            collection_slug,
        } = body;

        if (!productId && !slug) {
            return NextResponse.json({ error: 'Product ID or Slug is required' }, { status: 400 });
        }

        const changesList: string[] = [];

        // ── 1. Handle Price Update ──
        if (price !== undefined) {
            const numPrice = price === null || price === '' ? 0 : Number(price);
            const numOrig = original_price ? Number(original_price) : (numPrice > 0 ? Math.round(numPrice * 1.15) : 0);
            
            if (productId) {
                await setProductPriceOverride(productId, numPrice, numOrig, session.name);
            }
            if (slug && slug !== productId) {
                await setProductPriceOverride(slug, numPrice, numOrig, session.name);
            }
            changesList.push(numPrice > 0 ? `Price updated to ₹${numPrice}` : 'Price removed');
        }

        // ── 2. Check if DB columns are being updated ──
        const hasDbColumnChanges =
            name !== undefined ||
            description !== undefined ||
            stock !== undefined ||
            is_visible !== undefined ||
            is_featured !== undefined ||
            sort_order !== undefined ||
            tag !== undefined ||
            collection_name !== undefined ||
            collection_slug !== undefined;

        let updatedProduct: any = null;
        let productName = name || slug || productId;

        // If no DB column changes, we're done with just the price update!
        if (!hasDbColumnChanges) {
            await logStaffActivity({
                staffId: session.id,
                staffName: session.name,
                action: 'Updated Product Price',
                productId: productId || slug,
                productName: productName,
                details: changesList.join('; '),
            });

            return NextResponse.json({
                success: true,
                price,
                original_price,
                changes: changesList,
            });
        }

        // ── 3. Validate permissions for other fields ──
        if (name !== undefined || description !== undefined) {
            if (!session.permissions.canEditDetails) {
                return NextResponse.json({ error: 'Permission denied: Cannot edit product details' }, { status: 403 });
            }
            if (name !== undefined) changesList.push('Name updated');
            if (description !== undefined) changesList.push('Description updated');
        }

        if (is_visible !== undefined) {
            if (!session.permissions.canEditVisibility) {
                return NextResponse.json({ error: 'Permission denied: Cannot toggle visibility' }, { status: 403 });
            }
            changesList.push(`Visibility set to ${is_visible ? 'Visible' : 'Hidden'}`);
        }

        if (stock !== undefined) {
            if (!session.permissions.canEditStock) {
                return NextResponse.json({ error: 'Permission denied: Cannot edit stock' }, { status: 403 });
            }
            changesList.push(`Stock set to ${stock}`);
        }

        if (collection_name !== undefined || collection_slug !== undefined) {
            if (!session.permissions.canManageCategories) {
                return NextResponse.json({ error: 'Permission denied: Cannot manage categories' }, { status: 403 });
            }
            changesList.push(`Category updated to ${collection_name || collection_slug}`);
        }

        if (is_featured !== undefined || sort_order !== undefined || tag !== undefined) {
            if (!session.permissions.canManageHomepage) {
                return NextResponse.json({ error: 'Permission denied: Cannot manage homepage/tags' }, { status: 403 });
            }
            if (is_featured !== undefined) changesList.push(`Featured set to ${is_featured}`);
            if (tag !== undefined) changesList.push(`Tag set to ${tag}`);
        }

        // ── 4. Safely query existing DB product without causing UUID cast errors ──
        let existing: any = null;

        if (isUUID(productId)) {
            const { data } = await (supabaseAdmin as any)
                .from('products')
                .select('*')
                .eq('id', productId)
                .maybeSingle();
            existing = data;
        }

        if (!existing && slug) {
            const { data } = await (supabaseAdmin as any)
                .from('products')
                .select('*')
                .eq('slug', slug)
                .maybeSingle();
            existing = data;
        }

        if (!existing && productId && !isUUID(productId)) {
            const { data } = await (supabaseAdmin as any)
                .from('products')
                .select('*')
                .eq('slug', productId)
                .maybeSingle();
            existing = data;
        }

        const dbUpdates: Record<string, any> = {
            updated_at: new Date().toISOString(),
        };
        if (name !== undefined) dbUpdates.name = name;
        if (description !== undefined) dbUpdates.description = description;
        if (stock !== undefined) dbUpdates.stock = Number(stock);
        if (is_visible !== undefined) dbUpdates.is_visible = Boolean(is_visible);
        if (is_featured !== undefined) dbUpdates.is_featured = Boolean(is_featured);
        if (sort_order !== undefined) dbUpdates.sort_order = Number(sort_order);
        if (tag !== undefined) dbUpdates.tag = tag;
        if (collection_name !== undefined) dbUpdates.collection_name = collection_name;
        if (collection_slug !== undefined) dbUpdates.collection_slug = collection_slug;

        if (existing) {
            const { data, error }: any = await (supabaseAdmin as any)
                .from('products')
                .update(dbUpdates)
                .eq('id', existing.id)
                .select()
                .single();

            if (error) {
                console.error('Error updating product in Supabase:', error);
                throw error;
            }
            updatedProduct = data;
            productName = data.name;
        } else {
            // Static product: Insert into DB, ensuring valid UUID
            const staticMatch = PRODUCTS.find(p => p.id === productId || p.slug === slug);
            const newRow: Record<string, any> = {
                name: name || staticMatch?.name || 'Product',
                slug: slug || staticMatch?.slug || `prod-${Date.now()}`,
                description: description || staticMatch?.description || '',
                collection_name: collection_name || staticMatch?.collection || 'General',
                collection_slug: collection_slug || staticMatch?.collectionSlug || 'general',
                relationships: staticMatch?.relationships || [],
                celebrations: staticMatch?.celebrations || [],
                tag: tag || staticMatch?.tag || 'Standard',
                image_url: staticMatch?.image_url || '',
                images: staticMatch?.images || (staticMatch?.image_url ? [staticMatch.image_url] : []),
                image_scale: staticMatch?.imageScale ?? 1,
                stock: stock !== undefined ? Number(stock) : (staticMatch?.stock ?? 10),
                is_visible: is_visible !== undefined ? Boolean(is_visible) : true,
                is_featured: is_featured !== undefined ? Boolean(is_featured) : false,
                sort_order: sort_order !== undefined ? Number(sort_order) : 0,
                ...dbUpdates,
            };

            // ONLY provide `id` if it's a valid UUID; otherwise let Postgres generate one
            if (isUUID(productId)) {
                newRow.id = productId;
            }

            const { data, error }: any = await (supabaseAdmin as any)
                .from('products')
                .insert(newRow)
                .select()
                .single();

            if (error) {
                console.error('Error inserting product in Supabase:', error);
                throw error;
            }
            updatedProduct = data;
            productName = data.name;
        }

        // ── 5. Record Activity ──
        await logStaffActivity({
            staffId: session.id,
            staffName: session.name,
            action: 'Updated Product',
            productId: updatedProduct?.id || productId,
            productName,
            details: changesList.join('; '),
        });

        return NextResponse.json({
            success: true,
            product: updatedProduct,
            changes: changesList,
        });
    } catch (err: any) {
        console.error('Products PATCH error:', err);
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}
