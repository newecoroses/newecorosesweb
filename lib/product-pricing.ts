import { supabaseAdmin } from './supabase-admin';

export interface ProductPriceRecord {
    price: number;
    original_price?: number;
    updated_at: string;
    updated_by?: string;
}

const SETTINGS_KEY = 'product_prices';

export async function getProductPriceOverrides(): Promise<Record<string, ProductPriceRecord>> {
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
        console.error('Error fetching product prices:', err);
        return {};
    }
}

export async function setProductPriceOverride(
    productKey: string,
    price: number,
    original_price?: number,
    updated_by?: string
): Promise<boolean> {
    try {
        const current = await getProductPriceOverrides();

        let updated: Record<string, ProductPriceRecord>;

        // If price is 0 or less, remove the price override
        if (!price || price <= 0) {
            delete current[productKey];
            updated = { ...current };
        } else {
            updated = {
                ...current,
                [productKey]: {
                    price,
                    original_price: original_price || Math.round(price * 1.15),
                    updated_at: new Date().toISOString(),
                    updated_by,
                },
            };
        }

        const { error }: any = await (supabaseAdmin as any)
            .from('site_settings')
            .upsert({
                key: SETTINGS_KEY,
                value: JSON.stringify(updated),
                label: 'Product Prices Override',
                type: 'json',
                updated_at: new Date().toISOString(),
            }, { onConflict: 'key' });

        if (error) {
            console.error('Error saving product price override:', error);
            return false;
        }
        return true;
    } catch (err) {
        console.error('Exception saving product price override:', err);
        return false;
    }
}
