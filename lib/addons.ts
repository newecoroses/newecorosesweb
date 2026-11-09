export interface AddonItem {
    id: string;
    name: string;
    category: 'all' | 'cakes' | 'chocolates' | 'cards' | 'accessories' | 'plants' | 'keepsakes';
    price: number;
    originalPrice?: number;
    image_url: string;
    description?: string;
}

export const ADDON_CATEGORIES = [
    { id: 'all', label: 'All', icon: '💌' },
    { id: 'cakes', label: 'Cakes', icon: '🎂' },
    { id: 'chocolates', label: 'Gourmet', icon: '🍫' },
    { id: 'cards', label: 'Greeting Cards', icon: '💌' },
    { id: 'accessories', label: 'Cake Accessories', icon: '⭐' },
    { id: 'plants', label: 'Plants', icon: '🪴' },
    { id: 'keepsakes', label: 'Keepsakes', icon: '🧸' },
];

export const ADDON_ITEMS: AddonItem[] = [
    {
        id: 'addon-card-occasion',
        name: 'Greeting Card As Per Occasion',
        category: 'cards',
        price: 99,
        image_url: '/images/products/celebrations-gift-box-2.jpg',
        description: 'Personalized heartfelt greeting card matching your celebration',
    },
    {
        id: 'addon-truffle-cake',
        name: '500gm Eggless Truffle Cake',
        category: 'cakes',
        price: 479,
        originalPrice: 699,
        image_url: '/images/products/cakes/chocolate-cake.webp',
        description: 'Freshly baked rich chocolate truffle cake',
    },
    {
        id: 'addon-birthday-topper',
        name: 'Happy Birthday Star Topper',
        category: 'accessories',
        price: 59,
        originalPrice: 99,
        image_url: '/images/products/Golden 50th Birthday Floral Hamper.webp',
        description: 'Golden glittering celebration cake topper',
    },
    {
        id: 'addon-flower-food',
        name: 'FloraLife Flower Food Sachet',
        category: 'accessories',
        price: 19,
        originalPrice: 49,
        image_url: '/images/products/baby-breath-bouquet.jpeg',
        description: 'Extends flower vase life & blooming freshness',
    },
    {
        id: 'addon-butterscotch-cake',
        name: '500gm Butterscotch Crunch Cake',
        category: 'cakes',
        price: 499,
        originalPrice: 649,
        image_url: '/images/products/cakes/butterscotch-cake.webp',
        description: 'Layered with crunchy caramel butterscotch praline',
    },
    {
        id: 'addon-chocolate-combo',
        name: 'Melt & Munch Chocolate Combo',
        category: 'chocolates',
        price: 209,
        originalPrice: 250,
        image_url: '/images/products/5-piece-dairy-milk-little-hamper.jpeg',
        description: 'Cadbury Dairy Milk & 5-Star assorted chocolate treat',
    },
    {
        id: 'addon-ferrero-box',
        name: 'Ferrero Rocher 4-Pack Treat',
        category: 'chocolates',
        price: 199,
        originalPrice: 249,
        image_url: '/images/products/ferrero-rocher-hamper.jpeg',
        description: 'Crisp hazelnut and milk chocolate pralines',
    },
    {
        id: 'addon-lucky-bamboo',
        name: '2-Layer Lucky Bamboo Plant',
        category: 'plants',
        price: 299,
        originalPrice: 399,
        image_url: '/images/products/lucky-bamboo-plant.jpeg',
        description: 'Good luck & prosperity indoor plant in glass bowl',
    },
    {
        id: 'addon-jade-plant',
        name: 'Jade Plant in White Ceramic Pot',
        category: 'plants',
        price: 349,
        originalPrice: 449,
        image_url: '/images/products/jade-plant-1.webp',
        description: 'Air-purifying resilient succulent',
    },
    {
        id: 'addon-plush-teddy',
        name: 'Cute Little Cuddle Teddy Bear',
        category: 'keepsakes',
        price: 149,
        originalPrice: 249,
        image_url: '/images/products/4-teddy-bouquet.jpeg',
        description: 'Soft plush mini teddy for a warm surprise',
    },
    {
        id: 'addon-scented-candle',
        name: 'Aromatic Rose Scented Candle',
        category: 'keepsakes',
        price: 199,
        originalPrice: 299,
        image_url: '/images/products/scented-candle-gift-1.jpg',
        description: 'Hand-poured soothing floral fragrance candle',
    },
    {
        id: 'addon-strawberry-cake',
        name: '500gm Strawberry Glaze Cake',
        category: 'cakes',
        price: 549,
        originalPrice: 699,
        image_url: '/images/products/cakes/strawberry-cake.webp',
        description: 'Fresh berry puree with vanilla cream layers',
    },
];
