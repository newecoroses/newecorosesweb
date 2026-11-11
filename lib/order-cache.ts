// Server-side cache and persistent in-memory store for orders
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
}

// In-memory global store to survive HMR in dev and serverless warm containers
const globalForOrders = global as unknown as {
    nerOrdersMap?: Map<string, SavedOrder>;
};

export const ordersStore = globalForOrders.nerOrdersMap || new Map<string, SavedOrder>();
if (process.env.NODE_ENV !== 'production') globalForOrders.nerOrdersMap = ordersStore;

// No demo/seed orders — store starts empty and fills with real customer orders only

export function getAllOrders(): SavedOrder[] {
    const list = Array.from(ordersStore.values());
    // Filter duplicates because orders are saved under both orderNumber and id
    const uniqueMap = new Map<string, SavedOrder>();
    for (const order of list) {
        if (!uniqueMap.has(order.orderNumber)) {
            uniqueMap.set(order.orderNumber, order);
        }
    }
    return Array.from(uniqueMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function updateOrderStatus(orderIdentifier: string, status: SavedOrder['status']): SavedOrder | null {
    const order = ordersStore.get(orderIdentifier);
    if (!order) return null;
    order.status = status;
    ordersStore.set(order.orderNumber, order);
    ordersStore.set(order.id, order);
    return order;
}
