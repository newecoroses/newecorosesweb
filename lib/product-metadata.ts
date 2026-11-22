import { supabaseAdmin } from './supabase-admin';

export interface ProductExtraMeta {
    pre_order?: boolean;
    same_day_delivery?: boolean;
    variants?: { label: string; price: number }[];
    updated_at?: string;
    updated_by?: string;
}

const SETTINGS_KEY = 'product_extra_metadata';

export async function getAllProductMetadata(): Promise<Record<string, ProductExtraMeta>> {
    try {
        const { data, error }: any = await (supabaseAdmin as any)
            .from('site_settings')
            .select('value')
            .eq('key', SETTINGS_KEY)
            .single();

        if (error || !data?.value) {
            return {};
        }

        const map = JSON.parse(data.value);
        return typeof map === 'object' && map !== null ? map : {};
    } catch (err) {
        console.error('Error fetching product metadata:', err);
        return {};
    }
}

export async function setProductMetadata(
    productKey: string,
    meta: Partial<ProductExtraMeta>,
    updated_by?: string
): Promise<boolean> {
    try {
        const current = await getAllProductMetadata();
        const existing = current[productKey] || {};

        const updated: Record<string, ProductExtraMeta> = {
            ...current,
            [productKey]: {
                ...existing,
                ...meta,
                updated_at: new Date().toISOString(),
                updated_by,
            },
        };

        const { error }: any = await (supabaseAdmin as any)
            .from('site_settings')
            .upsert({
                key: SETTINGS_KEY,
                value: JSON.stringify(updated),
                label: 'Product Extra Metadata',
                type: 'json',
                updated_at: new Date().toISOString(),
            }, { onConflict: 'key' });

        if (error) {
            console.error('Error saving product metadata:', error);
            return false;
        }
        return true;
    } catch (err) {
        console.error('Exception saving product metadata:', err);
        return false;
    }
}
