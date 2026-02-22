import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── DB Types ──────────────────────────────────────────────
export interface DBProduct {
    id: string; name: string; slug: string; description: string;
    collection_name: string; collection_slug: string;
    relationships: string[]; celebrations: string[];
    tag: string; image_url: string; images: string[];
    image_scale: number; stock: number; is_visible: boolean;
    is_featured: boolean; sort_order: number;
    created_at: string; updated_at: string;
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

// ── Frontend Helpers ──────────────────────────────────────
/** Fetch all visible products from Supabase */
export async function fetchProducts(): Promise<DBProduct[]> {
    const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order');
    return (data ?? []) as DBProduct[];
}

/** Fetch visible products by tag */
export async function fetchProductsByTag(tag: string): Promise<DBProduct[]> {
    const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_visible', true)
        .eq('tag', tag)
        .order('sort_order');
    return (data ?? []) as DBProduct[];
}

/** Fetch visible products by collection slug */
export async function fetchProductsByCollection(collectionSlug: string): Promise<DBProduct[]> {
    const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_visible', true)
        .eq('collection_slug', collectionSlug)
        .order('sort_order');
    return (data ?? []) as DBProduct[];
}

/** Fetch a single product by slug */
export async function fetchProductBySlug(slug: string): Promise<DBProduct | null> {
    const { data } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();
    return data as DBProduct | null;
}

/** Fetch all visible collections */
export async function fetchCollections(): Promise<DBCollection[]> {
    const { data } = await supabase
        .from('collections')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order');
    return (data ?? []) as DBCollection[];
}

/** Fetch visible celebrations */
export async function fetchCelebrations(): Promise<DBCelebration[]> {
    const { data } = await supabase
        .from('celebrations')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order');
    return (data ?? []) as DBCelebration[];
}

/** Fetch visible relationships */
export async function fetchRelationships(): Promise<DBRelationship[]> {
    const { data } = await supabase
        .from('relationships')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order');
    return (data ?? []) as DBRelationship[];
}

/** Fetch visible testimonials */
export async function fetchTestimonials(): Promise<DBTestimonial[]> {
    const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order');
    return (data ?? []) as DBTestimonial[];
}

/** Fetch visible featured items by section */
export async function fetchFeaturedItems(section = 'handpicked'): Promise<DBFeaturedItem[]> {
    const { data } = await supabase
        .from('featured_items')
        .select('*')
        .eq('is_visible', true)
        .eq('section', section)
        .order('sort_order');
    return (data ?? []) as DBFeaturedItem[];
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
export async function fetchAllSettings(): Promise<Record<string, string>> {
    const { data } = await supabase.from('site_settings').select('key, value');
    const map: Record<string, string> = {};
    (data ?? []).forEach(s => { map[s.key] = s.value ?? ''; });
    return map;
}

/** Fetch WhatsApp settings */
export async function fetchWhatsappSettings(): Promise<DBWhatsappSettings | null> {
    const { data } = await supabase
        .from('whatsapp_settings')
        .select('*')
        .limit(1)
        .single();
    return data as DBWhatsappSettings | null;
}

/** Fetch visible announcements */
export async function fetchAnnouncements(): Promise<DBAnnouncement[]> {
    const { data } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order');
    return (data ?? []) as DBAnnouncement[];
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
