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
                price: override?.price ?? p.price ?? null,
                original_price: override?.original_price ?? p.original_price ?? null,
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
            image_url,
            images,
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

        // ── 1. Check Permissions ──
        if (price !== undefined || original_price !== undefined) {
            if (!session.permissions.canEditPrices) {
                return NextResponse.json({ error: 'You do not have permission to edit product prices.' }, { status: 403 });
            }
            if (price !== undefined) {
                changesList.push(`Price set to ₹${price}`);
            }
        }

        if (name !== undefined || description !== undefined) {
            if (!session.permissions.canEditDetails) {
                return NextResponse.json({ error: 'You do not have permission to edit product details.' }, { status: 403 });
            }
            if (name !== undefined) changesList.push(`Name updated`);
            if (description !== undefined) changesList.push(`Description updated`);
        }

        if (image_url !== undefined || images !== undefined) {
            if (!session.permissions.canEditImages) {
                return NextResponse.json({ error: 'You do not have permission to edit product images.' }, { status: 403 });
            }
            changesList.push(`Images updated`);
        }

        if (is_visible !== undefined) {
            if (!session.permissions.canEditVisibility) {
                return NextResponse.json({ error: 'You do not have permission to toggle product visibility.' }, { status: 403 });
            }
            changesList.push(`Visibility changed to ${is_visible ? 'Published (Live)' : 'Hidden'}`);
        }

        if (stock !== undefined) {
            if (!session.permissions.canEditStock) {
                return NextResponse.json({ error: 'You do not have permission to update stock.' }, { status: 403 });
            }
            changesList.push(`Stock updated to ${stock} (${stock > 0 ? 'In Stock' : 'Out of Stock'})`);
        }

        if (collection_name !== undefined || collection_slug !== undefined) {
            if (!session.permissions.canManageCategories) {
                return NextResponse.json({ error: 'You do not have permission to manage categories.' }, { status: 403 });
            }
            changesList.push(`Category updated to ${collection_name || collection_slug}`);
        }

        if (is_featured !== undefined || sort_order !== undefined || tag !== undefined) {
            if (!session.permissions.canManageHomepage) {
                return NextResponse.json({ error: 'You do not have permission to manage homepage / featured status.' }, { status: 403 });
            }
            if (is_featured !== undefined) changesList.push(`Homepage Featured set to ${is_featured ? 'Yes' : 'No'}`);
            if (sort_order !== undefined) changesList.push(`Homepage display order set to #${sort_order}`);
            if (tag !== undefined) changesList.push(`Tag assigned: ${tag}`);
        }

        if (changesList.length === 0) {
            return NextResponse.json({ message: 'No changes provided' });
        }

        // ── 2. Handle Price Update ──
        if (price !== undefined && price !== null) {
            const numPrice = Number(price);
            const numOrig = original_price ? Number(original_price) : Math.round(numPrice * 1.15);
            await setProductPriceOverride(productId || slug, numPrice, numOrig, session.name);
            if (slug && slug !== productId) {
                await setProductPriceOverride(slug, numPrice, numOrig, session.name);
            }
        }

        // ── 3. Handle Product DB Updates ──
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
        if (image_url !== undefined) dbUpdates.image_url = image_url;
        if (images !== undefined) dbUpdates.images = images;
        if (collection_name !== undefined) dbUpdates.collection_name = collection_name;
        if (collection_slug !== undefined) dbUpdates.collection_slug = collection_slug;

        // Check if product exists in Supabase
        const { data: existing }: any = await (supabaseAdmin as any)
            .from('products')
            .select('*')
            .or(`id.eq.${productId || 'none'},slug.eq.${slug || 'none'}`)
            .limit(1)
            .maybeSingle();

        let updatedProduct: any = existing;
        let productName = name || existing?.name || slug;

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
            // If product was only in static catalog, insert into DB with changes
            const staticMatch = PRODUCTS.find(p => p.id === productId || p.slug === slug);
            const newRow = {
                id: productId || staticMatch?.id || `prod-${Date.now()}`,
                name: name || staticMatch?.name || 'New Product',
                slug: slug || staticMatch?.slug || `prod-${Date.now()}`,
                description: description || staticMatch?.description || '',
                collection_name: collection_name || staticMatch?.collection || 'General',
                collection_slug: collection_slug || staticMatch?.collectionSlug || 'general',
                relationships: staticMatch?.relationships || [],
                celebrations: staticMatch?.celebrations || [],
                tag: tag || staticMatch?.tag || 'Standard',
                image_url: image_url || staticMatch?.image_url || '',
                images: images || staticMatch?.images || [image_url || staticMatch?.image_url || ''],
                image_scale: staticMatch?.imageScale ?? 1,
                stock: stock !== undefined ? Number(stock) : (staticMatch?.stock ?? 10),
                is_visible: is_visible !== undefined ? Boolean(is_visible) : true,
                is_featured: is_featured !== undefined ? Boolean(is_featured) : false,
                sort_order: sort_order !== undefined ? Number(sort_order) : 0,
                ...dbUpdates,
            };

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

        // ── 4. Record Activity ──
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
