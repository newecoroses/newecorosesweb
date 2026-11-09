// Server-side cache for recent orders
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
    status: string;
    createdAt: string;
}

// In-memory global store to survive HMR in dev and serverless warm containers
const globalForOrders = global as unknown as {
    nerOrdersMap?: Map<string, SavedOrder>;
};

export const ordersStore = globalForOrders.nerOrdersMap || new Map<string, SavedOrder>();
if (process.env.NODE_ENV !== 'production') globalForOrders.nerOrdersMap = ordersStore;
