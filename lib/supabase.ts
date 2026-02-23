import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── In-memory cache to prevent duplicate Supabase calls ──
// Multiple components fetch the same data (e.g., whatsapp_settings called 4x per page load)
// This caches results for 60 seconds so each query only runs once
const queryCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60_000; // 60 seconds

async function cachedQuery<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = queryCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data as T;
    }
    // If another call is already in flight for the same key, reuse its promise
    const existing = inflightQueries.get(key);
    if (existing) return existing as Promise<T>;

    const promise = fetcher().then(result => {
        queryCache.set(key, { data: result, timestamp: Date.now() });
        inflightQueries.delete(key);
        return result;
    }).catch(err => {
        inflightQueries.delete(key);
        throw err;
    });
    inflightQueries.set(key, promise);
    return promise;
}
const inflightQueries = new Map<string, Promise<unknown>>();

// ── DB Types ──────────────────────────────────────────────
export interface DBProduct {
    id: string; name: string; slug: string; description: string;
    collection_name: string; collection_slug: string;
    relationships: string[]; celebrations: string[];
    tag: string; image_url: string; images: string[];
    image_scale: number; stock: number; is_visible: boolean;
    is_featured: boolean; sort_order: number;
    created_at: string; updated_at: string;
    item_count?: number;
}

export interface DBCollection {
    id: string; name: string; slug: string; image_url: string;
    description: string; is_visible: boolean; sort_order: number; created_at: string;
}

export interface DBCelebration {
    id: string; name: string; date_label: string; image_url: string;
    is_visible: boolean; sort_order: number; created_at: string;
}

export interface DBRelationship {
    id: string; name: string; slug: string; image_url: string;
    is_visible: boolean; sort_order: number; created_at: string;
}

export interface DBTestimonial {
    id: string; customer_name: string; review_text: string;
    rating: number; is_visible: boolean; sort_order: number; created_at: string;
}

export interface DBBanner {
    id: string; title: string; subtitle: string; image_url: string;
    link_url: string; link_text: string; position: string;
    is_visible: boolean; sort_order: number; created_at: string;
}

export interface DBFeaturedItem {
    id: string; label: string; image_url: string; section: string;
    is_visible: boolean; sort_order: number; created_at: string;
}

export interface DBSiteSetting {
    id: string; key: string; value: string; label: string; type: string; updated_at: string;
}

export interface DBBannedWord {
    id: string; word: string; is_active: boolean; created_at: string;
}

export interface DBWhatsappSettings {
    id: string; phone_number: string; default_message: string;
    is_float_visible: boolean; updated_at: string;
}

export interface DBAnnouncement {
    id: string; text: string; is_visible: boolean; sort_order: number; created_at: string;
}

export interface DBReviewVideo {
    id: string; video_url: string; title: string;
    is_visible: boolean; sort_order: number; created_at: string;
}

const resolveImage = (url: string | null | undefined): string => {
    if (!url || url.startsWith('HIDDEN::')) return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    return url;
};

const resolveImages = (images: string[] | null | undefined): string[] => {
    if (!images) return [];
    return images.filter(img => img && !img.startsWith('HIDDEN::'));
};

// ── Frontend Helpers ──────────────────────────────────────
/** Fetch all visible products from Supabase */
export function fetchProducts(): Promise<DBProduct[]> {
    return cachedQuery('products:all', async () => {
        const { data } = await supabase
            .from('products')
            .select('*')
            .eq('is_visible', true)
            .order('sort_order');
        return (data ?? []).map((p: any) => ({ ...p, image_url: resolveImage(p.image_url), images: resolveImages(p.images) })) as DBProduct[];
    });
}

/** Fetch visible products by tag */
export function fetchProductsByTag(tag: string): Promise<DBProduct[]> {
    return cachedQuery(`products:tag:${tag}`, async () => {
        const { data } = await supabase
            .from('products')
            .select('*')
            .eq('is_visible', true)
            .eq('tag', tag)
            .order('sort_order');
        return (data ?? []).map((p: any) => ({ ...p, image_url: resolveImage(p.image_url), images: resolveImages(p.images) })) as DBProduct[];
    });
}

/** Fetch visible products by collection slug */
export async function fetchProductsByCollection(collectionSlug: string): Promise<DBProduct[]> {
    const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_visible', true)
        .eq('collection_slug', collectionSlug)
        .order('sort_order');
    return (data ?? []).map((p: any) => ({ ...p, image_url: resolveImage(p.image_url), images: resolveImages(p.images) })) as DBProduct[];
}

/** Fetch a single product by slug */
export async function fetchProductBySlug(slug: string): Promise<DBProduct | null> {
    const { data } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();
    if (!data) return null;
    return { ...data, image_url: resolveImage((data as any).image_url), images: resolveImages((data as any).images) } as DBProduct;
}

/** Fetch all visible collections */
export function fetchCollections(): Promise<DBCollection[]> {
    return cachedQuery('collections', async () => {
        const { data } = await supabase
            .from('collections')
            .select('*')
            .eq('is_visible', true)
            .order('sort_order');
        return (data ?? []).map((c: any) => ({ ...c, image_url: resolveImage(c.image_url) })) as DBCollection[];
    });
}

/** Fetch visible celebrations */
export function fetchCelebrations(): Promise<DBCelebration[]> {
    return cachedQuery('celebrations', async () => {
        const { data } = await supabase
            .from('celebrations')
            .select('*')
            .eq('is_visible', true)
            .order('sort_order');
        return (data ?? []).map((c: any) => ({ ...c, image_url: resolveImage(c.image_url) })) as DBCelebration[];
    });
}

/** Fetch visible relationships */
export function fetchRelationships(): Promise<DBRelationship[]> {
    return cachedQuery('relationships', async () => {
        const { data } = await supabase
            .from('relationships')
            .select('*')
            .eq('is_visible', true)
            .order('sort_order');
        return (data ?? []).map((r: any) => ({ ...r, image_url: resolveImage(r.image_url) })) as DBRelationship[];
    });
}

/** Fetch visible testimonials */
export function fetchTestimonials(): Promise<DBTestimonial[]> {
    return cachedQuery('testimonials', async () => {
        const { data } = await supabase
            .from('testimonials')
            .select('*')
            .eq('is_visible', true)
            .order('sort_order');
        return (data ?? []) as DBTestimonial[];
    });
}

/** Fetch visible featured items by section */
export async function fetchFeaturedItems(section = 'handpicked'): Promise<DBFeaturedItem[]> {
    const { data } = await supabase
        .from('featured_items')
        .select('*')
        .eq('is_visible', true)
        .eq('section', section)
        .order('sort_order');
    return (data ?? []).map((f: any) => ({ ...f, image_url: resolveImage(f.image_url) })) as DBFeaturedItem[];
}

/** Fetch site setting value by key */
export async function fetchSetting(key: string): Promise<string | null> {
    const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', key)
        .single();
    return data?.value ?? null;
}

/** Fetch all site settings as a key-value map */
export function fetchAllSettings(): Promise<Record<string, string>> {
    return cachedQuery('site_settings:all', async () => {
        const { data } = await supabase.from('site_settings').select('key, value');
        const map: Record<string, string> = {};
        (data ?? []).forEach(s => { map[s.key] = s.value ?? ''; });
        return map;
    });
}

/** Fetch WhatsApp settings */
export function fetchWhatsappSettings(): Promise<DBWhatsappSettings | null> {
    return cachedQuery('whatsapp_settings', async () => {
        const { data } = await supabase
            .from('whatsapp_settings')
            .select('*')
            .limit(1)
            .single();
        return data as DBWhatsappSettings | null;
    });
}

/** Fetch visible announcements */
export function fetchAnnouncements(): Promise<DBAnnouncement[]> {
    return cachedQuery('announcements', async () => {
        const { data } = await supabase
            .from('announcements')
            .select('*')
            .eq('is_visible', true)
            .order('sort_order');
        return (data ?? []) as DBAnnouncement[];
    });
}

/** Fetch visible review videos */
export async function fetchReviewVideos(): Promise<DBReviewVideo[]> {
    const { data } = await supabase
        .from('review_videos')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order');
    return (data ?? []) as DBReviewVideo[];
}

/** Fetch active banned words */
export async function fetchBannedWords(): Promise<string[]> {
    const { data } = await supabase
        .from('banned_words')
        .select('word')
        .eq('is_active', true);
    return (data ?? []).map(d => d.word);
}

/** Build a WhatsApp URL from Supabase settings */
export function buildWhatsappUrl(
    phone: string,
    message: string,
    productName?: string,
    productUrl?: string
): string {
    let finalMsg = message;
    if (productName) {
        finalMsg = `Hi, I'm interested in ${productName}. Is it available?${productUrl ? ` Reference: ${productUrl}` : ''}`;
    }
    return `https://wa.me/${phone}?text=${encodeURIComponent(finalMsg)}`;
}
