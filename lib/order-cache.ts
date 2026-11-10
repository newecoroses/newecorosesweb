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

// Initial seed orders for New Eco Roses store activity if store is empty
const INITIAL_SEED_ORDERS: SavedOrder[] = [
    {
        id: 'ord_101',
        orderNumber: 'NER-849201',
        items: [
            {
                id: 'prod-1',
                name: '20 Roses Luxury Velvet Bouquet',
                slug: '20-roses-bouquet',
                price: 1799,
                quantity: 1,
                image_url: '/images/products/20-roses-bouquet.jpeg',
            },
            {
                id: 'addon-cake',
                name: 'Dutch Truffle Luxury Chocolate Cake (500g)',
                slug: 'dutch-truffle-cake',
                price: 749,
                quantity: 1,
                image_url: '/images/products/cakes/Chocolate Truffle Cake.webp',
            },
        ],
        customer: {
            name: 'Priyanka Mukherjee',
            email: 'priyanka.mukh@gmail.com',
            phone: '9830145290',
        },
        shippingAddress: {
            line1: 'Flat 4B, South City Towers, Prince Anwar Shah Road',
            city: 'Kolkata',
            state: 'West Bengal',
            postalCode: '700068',
            country: 'India',
        },
        specialNote: 'Slot: Evening Celebrations (4 PM - 9 PM) | Message Card: "Happy Anniversary to the love of my life! Here is to forever."',
        paymentMethod: 'online',
        subtotal: 2548,
        discountAmount: 200,
        discountCode: 'WELCOME10',
        shippingCost: 0,
        total: 2348,
        status: 'confirmed',
        createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 min ago
    },
    {
        id: 'ord_102',
        orderNumber: 'NER-731940',
        items: [
            {
                id: 'prod-2',
                name: 'Midnight Crimson Rose Bouquet',
                slug: 'midnight-crimson-rose-bouquet',
                price: 2499,
                quantity: 1,
                image_url: '/images/products/black-crimson-rose-luxe-bouquet.webp',
            },
        ],
        customer: {
            name: 'Rahul Sen',
            email: 'rahul.sen.kolkata@outlook.com',
            phone: '9874561230',
        },
        shippingAddress: {
            line1: 'B-12, Sector 1, Salt Lake City',
            city: 'Kolkata',
            state: 'West Bengal',
            postalCode: '700064',
            country: 'India',
        },
        specialNote: 'Slot: Midnight Surprise (11 PM - 12 AM) | Message Card: "Happy Birthday Sneha! Wishing you the best day ever."',
        paymentMethod: 'online',
        subtotal: 2499,
        discountAmount: 0,
        shippingCost: 0,
        total: 2499,
        status: 'processing',
        createdAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(), // 1.8 hrs ago
    },
    {
        id: 'ord_103',
        orderNumber: 'NER-620485',
        items: [
            {
                id: 'prod-3',
                name: 'Sunflower & Baby Breath Signature Hamper',
                slug: 'sunflower-babys-breath-bouquet',
                price: 1999,
                quantity: 1,
                image_url: '/images/products/2-sunflower-babys-breath-big-bouquet.jpeg',
            },
        ],
        customer: {
            name: 'Debojyoti Ghosh',
            email: 'debojyoti.g@gmail.com',
            phone: '9123456789',
        },
        shippingAddress: {
            line1: '42/1, New Alipore Block G',
            city: 'Kolkata',
            state: 'West Bengal',
            postalCode: '700053',
            country: 'India',
        },
        specialNote: 'Slot: Standard Delivery (9 AM - 9 PM)',
        paymentMethod: 'online',
        subtotal: 1999,
        discountAmount: 50,
        discountCode: 'ROSE50',
        shippingCost: 0,
        total: 1949,
        status: 'delivered',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hrs ago
    },
    {
        id: 'ord_104',
        orderNumber: 'NER-592810',
        items: [
            {
                id: 'prod-4',
                name: 'Luxury Ferrero Rocher & Red Rose Gift Hamper',
                slug: 'anniversary-beautiful-hamper',
                price: 3299,
                quantity: 1,
                image_url: '/images/products/anniversary-beautiful-hamper.jpeg',
            },
        ],
        customer: {
            name: 'Ananya Bose',
            email: 'ananya.bose@yahoo.in',
            phone: '9903124567',
        },
        shippingAddress: {
            line1: 'Flat 12, Queens Court, Park Street',
            city: 'Kolkata',
            state: 'West Bengal',
            postalCode: '700016',
            country: 'India',
        },
        specialNote: 'Slot: Morning Fresh Delivery (8 AM - 12 PM)',
        paymentMethod: 'online',
        subtotal: 3299,
        discountAmount: 100,
        discountCode: 'LUXE100',
        shippingCost: 0,
        total: 3199,
        status: 'delivered',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hrs ago
    },
    {
        id: 'ord_105',
        orderNumber: 'NER-481923',
        items: [
            {
                id: 'prod-5',
                name: 'Air Purifying Lucky Bamboo & Floral Bloom Set',
                slug: 'lucky-bamboo-bloom',
                price: 1299,
                quantity: 2,
                image_url: '/images/products/big-mix-hamper-1.jpg',
            },
        ],
        customer: {
            name: 'Amitava Roy',
            email: 'amitava.roy@tcs.com',
            phone: '9831987654',
        },
        shippingAddress: {
            line1: 'Tower 3, Rajarhat Action Area 1',
            city: 'Kolkata',
            state: 'West Bengal',
            postalCode: '700156',
            country: 'India',
        },
        specialNote: 'Slot: Standard Delivery (9 AM - 9 PM) | Corporate appreciation gift',
        paymentMethod: 'online',
        subtotal: 2598,
        discountAmount: 0,
        shippingCost: 0,
        total: 2598,
        status: 'delivered',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
];

// Populate seed if empty
if (ordersStore.size === 0) {
    INITIAL_SEED_ORDERS.forEach(order => {
        ordersStore.set(order.orderNumber, order);
        ordersStore.set(order.id, order);
    });
}

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
