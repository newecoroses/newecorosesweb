import { createClient } from '@supabase/supabase-js';

// Server-side cache and persistent Supabase store for orders
export interface SavedOrder {
    id: string;
    orderNumber: string;
    items: {
        id: string;
        name: string;
        slug: string;
        price: number;
        quantity: number;
        image_url: string;
    }[];
    customer: {
        name: string;
        email: string;
        phone: string;
    };
    shippingAddress: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    specialNote?: string;
    paymentMethod: string;
    subtotal: number;
    discountAmount: number;
    discountCode?: string;
    shippingCost: number;
    total: number;
    status: 'confirmed' | 'processing' | 'delivered' | 'cancelled' | 'paid';
    createdAt: string;
    assignedStore?: 'tollygunge' | 'alipore' | null;
    assignedAt?: string;
    storeAcknowledged?: boolean;
}

// In-memory global store to survive HMR in dev and warm serverless containers
const globalForOrders = global as unknown as {
    nerOrdersMap?: Map<string, SavedOrder>;
};

export const ordersStore = globalForOrders.nerOrdersMap || new Map<string, SavedOrder>();
if (process.env.NODE_ENV !== 'production') globalForOrders.nerOrdersMap = ordersStore;

// Supabase client for persistent order storage
function getDb() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return createClient(url, key, {
        auth: { persistSession: false }
    });
}

/**
 * Normalizes user-input order numbers:
 * 'NER 387233' -> 'NER-387233'
 * '387233' -> 'NER-387233'
 * '#NER-387233' -> 'NER-387233'
 * 'ner-387233' -> 'NER-387233'
 */
export function normalizeOrderNumber(input: string): string {
    const raw = (input || '').trim().toUpperCase().replace(/^#/, '');
    const digitsMatch = raw.match(/(\d{5,8})/);
    if (digitsMatch) {
        return `NER-${digitsMatch[1]}`;
    }
    return raw.replace(/\s+/g, '-');
}

/**
 * Saves order to memory AND persists to Supabase PostgreSQL table
 */
export async function saveOrder(order: SavedOrder): Promise<void> {
    // 1. In-memory save
    ordersStore.set(order.orderNumber, order);
    ordersStore.set(order.id, order);

    // 2. Persistent Supabase DB save
    try {
        const db = getDb();
        if (db) {
            await db.from('site_settings').upsert({
                key: `order:${order.orderNumber}`,
                value: JSON.stringify(order),
                label: `Order #${order.orderNumber} - ${order.customer?.name || 'Customer'} (₹${order.total})`,
                type: 'order',
                updated_at: new Date().toISOString()
            }, { onConflict: 'key' });
        }
    } catch (err) {
        console.error('Error persisting order to DB:', err);
    }
}

/**
 * Looks up an order by order number or order ID:
 * 1. Checks in-memory cache
 * 2. If not found in memory, loads from Supabase site_settings
 */
export async function findOrder(orderIdentifier: string): Promise<SavedOrder | null> {
    if (!orderIdentifier) return null;

    const raw = orderIdentifier.trim();
    const normalized = normalizeOrderNumber(raw);

    // 1. Check in-memory store
    if (ordersStore.has(normalized)) return ordersStore.get(normalized)!;
    if (ordersStore.has(raw)) return ordersStore.get(raw)!;
    if (ordersStore.has(raw.toUpperCase())) return ordersStore.get(raw.toUpperCase())!;

    // 2. Check Supabase DB
    try {
        const db = getDb();
        if (db) {
            const possibleKeys = Array.from(new Set([
                `order:${normalized}`,
                `order:${raw}`,
                `order:${raw.toUpperCase()}`,
                `order:${raw.replace(/\s+/g, '-')}`
            ]));

            const { data } = await db.from('site_settings')
                .select('value')
                .in('key', possibleKeys)
                .limit(1)
                .maybeSingle();

            if (data?.value) {
                const parsed: SavedOrder = JSON.parse(data.value);
                // Cache into memory for subsequent fast lookups
                ordersStore.set(parsed.orderNumber, parsed);
                ordersStore.set(parsed.id, parsed);
                return parsed;
            }
        }
    } catch (err) {
        console.error('Error fetching order from DB:', err);
    }

    return null;
}

/**
 * Returns all orders (from memory + DB) for admin view
 */
export async function getAllOrders(): Promise<SavedOrder[]> {
    const uniqueMap = new Map<string, SavedOrder>();

    // 1. Add memory orders
    for (const order of Array.from(ordersStore.values())) {
        if (!uniqueMap.has(order.orderNumber)) {
            uniqueMap.set(order.orderNumber, order);
        }
    }

    // 2. Load DB orders
    try {
        const db = getDb();
        if (db) {
            const { data } = await db.from('site_settings')
                .select('value')
                .like('key', 'order:%');

            if (Array.isArray(data)) {
                for (const row of data) {
                    try {
                        const parsed: SavedOrder = JSON.parse(row.value);
                        if (!uniqueMap.has(parsed.orderNumber)) {
                            uniqueMap.set(parsed.orderNumber, parsed);
                            ordersStore.set(parsed.orderNumber, parsed);
                            ordersStore.set(parsed.id, parsed);
                        }
                    } catch {}
                }
            }
        }
    } catch (err) {
        console.error('Error loading all orders from DB:', err);
    }

    return Array.from(uniqueMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

/**
 * Updates status of an order in memory and in Supabase
 */
export async function updateOrderStatus(orderIdentifier: string, status: SavedOrder['status']): Promise<SavedOrder | null> {
    const order = await findOrder(orderIdentifier);
    if (!order) return null;

    order.status = status;
    await saveOrder(order);
    return order;
}

/**
 * Assigns an order to a store outlet
 */
export async function assignOrderToStore(
    orderIdentifier: string,
    store: 'tollygunge' | 'alipore' | null
): Promise<SavedOrder | null> {
    const order = await findOrder(orderIdentifier);
    if (!order) return null;

    order.assignedStore = store;
    order.assignedAt = store ? new Date().toISOString() : undefined;
    order.storeAcknowledged = false;
    await saveOrder(order);
    return order;
}

/**
 * Marks an order as acknowledged by the store staff
 */
export async function acknowledgeOrderAtStore(orderIdentifier: string): Promise<SavedOrder | null> {
    const order = await findOrder(orderIdentifier);
    if (!order) return null;

    order.storeAcknowledged = true;
    await saveOrder(order);
    return order;
}
