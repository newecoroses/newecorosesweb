/**
 * Pricing utilities for New Eco Roses
 * Ensures:
 * 1. Original Price (MRP) ALWAYS ends in 99 (e.g. 1299, 1399, 1999, 2499, 3499).
 * 2. Sale / Discounted price set by staff (often ending in 99 like 999, 1499, 1999).
 * 3. Discount percentage is dynamically calculated: Math.round(((originalPrice - price) / originalPrice) * 100)
 * 4. Each product gets a DIFFERENT discount between 10% and 30% (e.g. 13%, 17%, 21%, 25%, 28%).
 */

function hashKey(key: string): number {
    let h = 5381;
    const str = String(key || 'ner-rose');
    for (let i = 0; i < str.length; i++) {
        h = ((h << 5) + h) + str.charCodeAt(i);
        h |= 0;
    }
    return Math.abs(h);
}

export interface ComputedPriceInfo {
    hasPrice: boolean;
    price: number;
    originalPrice: number;
    discountPercent: number;
}

/**
 * Calculates a valid original price (MRP) that:
 * - Strictly ends in 99 (e.g. 1299, 1599, 1999)
 * - Has an actual discount between 10% and 30%
 * - Gives different discounts to different products deterministically based on key (slug / name / id)
 */
export function computeOriginalPrice(
    salePrice: number,
    productKey?: string
): { originalPrice: number; discountPercent: number } {
    if (!salePrice || salePrice <= 0) {
        return { originalPrice: 0, discountPercent: 0 };
    }

    const minK = Math.floor((salePrice + 1) / 100) + 1;
    const maxK = Math.ceil((salePrice * 1.6) / 100) + 3;

    const candidates: { orig: number; disc: number }[] = [];

    for (let k = minK; k <= maxK; k++) {
        const candidate = k * 100 - 1; // Always ends in 99
        if (candidate > salePrice) {
            const disc = Math.round(((candidate - salePrice) / candidate) * 100);
            if (disc >= 10 && disc <= 30) {
                candidates.push({ orig: candidate, disc });
            }
        }
    }

    if (candidates.length === 0) {
        // Fallback for very small edge prices (e.g. < 100)
        let fallback = (Math.ceil(salePrice / 100) + 1) * 100 - 1;
        let disc = Math.round(((fallback - salePrice) / fallback) * 100);
        return { originalPrice: fallback, discountPercent: disc };
    }

    // Pick a candidate deterministically using product key
    const hash = hashKey(productKey || 'product');
    const chosen = candidates[hash % candidates.length];
    return { originalPrice: chosen.orig, discountPercent: chosen.disc };
}

/**
 * Validates and resolves product pricing:
 * If an original_price already exists in DB, it verifies that it ends with 99 and has a 10%-30% discount.
 * If it doesn't end with 99 or was the legacy ~13% (1.15x) calculation, it automatically generates
 * the correct original price ending in 99 and varied 10%-30% discount.
 */
export function resolveProductPricing(
    salePrice?: number | null,
    existingOriginalPrice?: number | null,
    productKey?: string
): ComputedPriceInfo {
    const hasPrice = typeof salePrice === 'number' && salePrice > 0;
    if (!hasPrice) {
        return {
            hasPrice: false,
            price: 0,
            originalPrice: 0,
            discountPercent: 0,
        };
    }

    const price = salePrice!;

    // Check if existing original price is valid (must end in 99 and be between 10% and 30% discount)
    if (
        typeof existingOriginalPrice === 'number' &&
        existingOriginalPrice > price &&
        existingOriginalPrice % 100 === 99
    ) {
        const disc = Math.round(((existingOriginalPrice - price) / existingOriginalPrice) * 100);
        if (disc >= 10 && disc <= 30) {
            return {
                hasPrice: true,
                price,
                originalPrice: existingOriginalPrice,
                discountPercent: disc,
            };
        }
    }

    // Otherwise compute a varied original price ending in 99 with 10%-30% discount
    const computed = computeOriginalPrice(price, productKey);
    return {
        hasPrice: true,
        price,
        originalPrice: computed.originalPrice,
        discountPercent: computed.discountPercent,
    };
}
