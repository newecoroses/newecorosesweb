export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    collection: string;
    collectionSlug: string;
    relationships: string[];
    celebrations: string[];
    tag: 'Best Seller' | 'New Arrival' | 'Seasonal' | 'Standard';
    image_url: string;
    images: string[];
    imageScale?: number;
    stock: number;
    itemCount?: number;
}

export const PRODUCTS: Product[] = [
    {
            "id": "sep28-1",
            "name": "Blue & White Floral Vase Arrangement",
            "slug": "blue-white-floral-vase-arrangement",
            "description": "Exquisite Blue & White Floral Vase Arrangement handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Fresh Flower",
            "collectionSlug": "fresh-flower",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "New Arrival",
            "image_url": "/images/products/Blue & White Floral Vase Arrangement.webp",
            "images": [
                    "/images/products/Blue & White Floral Vase Arrangement.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-2",
            "name": "Blue Butterfly & Yellow Rose Floral Wreath",
            "slug": "blue-butterfly-yellow-rose-floral-wreath",
            "description": "Exquisite Blue Butterfly & Yellow Rose Floral Wreath handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Fresh Flower",
            "collectionSlug": "fresh-flower",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "Best Seller",
            "image_url": "/images/products/Blue Butterfly & Yellow Rose Floral Wreath.webp",
            "images": [
                    "/images/products/Blue Butterfly & Yellow Rose Floral Wreath.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-3",
            "name": "Classic Red Rose Bouquet in Black Premium Wrap",
            "slug": "classic-red-rose-bouquet-in-black-premium-wrap",
            "description": "Exquisite Classic Red Rose Bouquet in Black Premium Wrap handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Fresh Flower",
            "collectionSlug": "fresh-flower",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "Best Seller",
            "image_url": "/images/products/Classic Red Rose Bouquet in Black Premium Wrap.webp",
            "images": [
                    "/images/products/Classic Red Rose Bouquet in Black Premium Wrap.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-4",
            "name": "Colorful Gerbera Daisy Bouquet in Blue Premium Wrap",
            "slug": "colorful-gerbera-daisy-bouquet-in-blue-premium-wrap",
            "description": "Exquisite Colorful Gerbera Daisy Bouquet in Blue Premium Wrap handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Fresh Flower",
            "collectionSlug": "fresh-flower",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "New Arrival",
            "image_url": "/images/products/Colorful Gerbera Daisy Bouquet in Blue Premium Wrap.webp",
            "images": [
                    "/images/products/Colorful Gerbera Daisy Bouquet in Blue Premium Wrap.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-5",
            "name": "Colorful Mixed Flower Basket Hamper",
            "slug": "colorful-mixed-flower-basket-hamper",
            "description": "Exquisite Colorful Mixed Flower Basket Hamper handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Hamper",
            "collectionSlug": "hamper",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "Best Seller",
            "image_url": "/images/products/Colorful Mixed Flower Basket Hamper.webp",
            "images": [
                    "/images/products/Colorful Mixed Flower Basket Hamper.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-6",
            "name": "Elegant Birthday Floral Hamper with Balloon",
            "slug": "elegant-birthday-floral-hamper-with-balloon",
            "description": "Exquisite Elegant Birthday Floral Hamper with Balloon handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Hamper",
            "collectionSlug": "hamper",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "Best Seller",
            "image_url": "/images/products/Elegant Birthday Floral Hamper with Balloon.webp",
            "images": [
                    "/images/products/Elegant Birthday Floral Hamper with Balloon.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-7",
            "name": "Elegant Black Gift Bouquet with Message Balloon",
            "slug": "elegant-black-gift-bouquet-with-message-balloon",
            "description": "Exquisite Elegant Black Gift Bouquet with Message Balloon handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Balloon Bouquet",
            "collectionSlug": "balloon-bouquet",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "New Arrival",
            "image_url": "/images/products/Elegant Black Gift Bouquet with Message Balloon.webp",
            "images": [
                    "/images/products/Elegant Black Gift Bouquet with Message Balloon.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-8",
            "name": "Elegant Lily & Rose Floral Box Hamper",
            "slug": "elegant-lily-rose-floral-box-hamper",
            "description": "Exquisite Elegant Lily & Rose Floral Box Hamper handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Hamper",
            "collectionSlug": "hamper",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "New Arrival",
            "image_url": "/images/products/Elegant Lily & Rose Floral Box Hamper.webp",
            "images": [
                    "/images/products/Elegant Lily & Rose Floral Box Hamper.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-9",
            "name": "Elegant Pink & White Lily Floral Hamper",
            "slug": "elegant-pink-white-lily-floral-hamper",
            "description": "Exquisite Elegant Pink & White Lily Floral Hamper handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Hamper",
            "collectionSlug": "hamper",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "Best Seller",
            "image_url": "/images/products/Elegant Pink & White Lily Floral Hamper.webp",
            "images": [
                    "/images/products/Elegant Pink & White Lily Floral Hamper.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-10",
            "name": "Elegant Pink Lily & Orchid Floral Basket Hamper",
            "slug": "elegant-pink-lily-orchid-floral-basket-hamper",
            "description": "Exquisite Elegant Pink Lily & Orchid Floral Basket Hamper handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Hamper",
            "collectionSlug": "hamper",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "Best Seller",
            "image_url": "/images/products/Elegant Pink Lily & Orchid Floral Basket Hamper.webp",
            "images": [
                    "/images/products/Elegant Pink Lily & Orchid Floral Basket Hamper.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-11",
            "name": "Elegant Pink Orchid Bouquet",
            "slug": "elegant-pink-orchid-bouquet",
            "description": "Exquisite Elegant Pink Orchid Bouquet handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Fresh Flower",
            "collectionSlug": "fresh-flower",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "New Arrival",
            "image_url": "/images/products/Elegant Pink Orchid Bouquet.webp",
            "images": [
                    "/images/products/Elegant Pink Orchid Bouquet.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-12",
            "name": "Elegant White Lily & Floral Arrangement with Gold Fan",
            "slug": "elegant-white-lily-floral-arrangement-with-gold-fan",
            "description": "Exquisite Elegant White Lily & Floral Arrangement with Gold Fan handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Fresh Flower",
            "collectionSlug": "fresh-flower",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "Best Seller",
            "image_url": "/images/products/Elegant White Lily & Floral Arrangement with Gold Fan.webp",
            "images": [
                    "/images/products/Elegant White Lily & Floral Arrangement with Gold Fan.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-13",
            "name": "Elegant White Lily & Pink Rose Floral Box Hamper",
            "slug": "elegant-white-lily-pink-rose-floral-box-hamper",
            "description": "Exquisite Elegant White Lily & Pink Rose Floral Box Hamper handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Hamper",
            "collectionSlug": "hamper",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "New Arrival",
            "image_url": "/images/products/Elegant White Lily & Pink Rose Floral Box Hamper.webp",
            "images": [
                    "/images/products/Elegant White Lily & Pink Rose Floral Box Hamper.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-14",
            "name": "Elegant White Lily Bouquet in Black Wrap",
            "slug": "elegant-white-lily-bouquet-in-black-wrap",
            "description": "Exquisite Elegant White Lily Bouquet in Black Wrap handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Fresh Flower",
            "collectionSlug": "fresh-flower",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "Best Seller",
            "image_url": "/images/products/Elegant White Lily Bouquet in Black Wrap.webp",
            "images": [
                    "/images/products/Elegant White Lily Bouquet in Black Wrap.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-15",
            "name": "Elegant White Lily Bouquet in Kraft Wrap",
            "slug": "elegant-white-lily-bouquet-in-kraft-wrap",
            "description": "Exquisite Elegant White Lily Bouquet in Kraft Wrap handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Fresh Flower",
            "collectionSlug": "fresh-flower",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "New Arrival",
            "image_url": "/images/products/Elegant White Lily Bouquet in Kraft Wrap.webp",
            "images": [
                    "/images/products/Elegant White Lily Bouquet in Kraft Wrap.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-16",
            "name": "Golden 40th Birthday Floral Arrangement",
            "slug": "golden-40th-birthday-floral-arrangement",
            "description": "Exquisite Golden 40th Birthday Floral Arrangement handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Balloon Bouquet",
            "collectionSlug": "balloon-bouquet",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "Best Seller",
            "image_url": "/images/products/Golden 40th Birthday Floral Arrangement.webp",
            "images": [
                    "/images/products/Golden 40th Birthday Floral Arrangement.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-17",
            "name": "Golden 50th Birthday Floral Hamper",
            "slug": "golden-50th-birthday-floral-hamper",
            "description": "Exquisite Golden 50th Birthday Floral Hamper handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Hamper",
            "collectionSlug": "hamper",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "Best Seller",
            "image_url": "/images/products/Golden 50th Birthday Floral Hamper.webp",
            "images": [
                    "/images/products/Golden 50th Birthday Floral Hamper.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-18",
            "name": "Grand Pink & White Floral Entrance Arch",
            "slug": "grand-pink-white-floral-entrance-arch",
            "description": "Exquisite Grand Pink & White Floral Entrance Arch handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Balloon Bouquet",
            "collectionSlug": "balloon-bouquet",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "Best Seller",
            "image_url": "/images/products/Grand Pink & White Floral Entrance Arch.webp",
            "images": [
                    "/images/products/Grand Pink & White Floral Entrance Arch.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-19",
            "name": "Grand Red & Yellow Floral Tower Hamper",
            "slug": "grand-red-yellow-floral-tower-hamper",
            "description": "Exquisite Grand Red & Yellow Floral Tower Hamper handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Hamper",
            "collectionSlug": "hamper",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "New Arrival",
            "image_url": "/images/products/Grand Red & Yellow Floral Tower Hamper.webp",
            "images": [
                    "/images/products/Grand Red & Yellow Floral Tower Hamper.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-20",
            "name": "Luxury Blue & Yellow Floral Wreath",
            "slug": "luxury-blue-yellow-floral-wreath",
            "description": "Exquisite Luxury Blue & Yellow Floral Wreath handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Fresh Flower",
            "collectionSlug": "fresh-flower",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "New Arrival",
            "image_url": "/images/products/Luxury Blue & Yellow Floral Wreath.webp",
            "images": [
                    "/images/products/Luxury Blue & Yellow Floral Wreath.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-21",
            "name": "Luxury Chocolate Gift Bouquet in Red Wrap",
            "slug": "luxury-chocolate-gift-bouquet-in-red-wrap",
            "description": "Exquisite Luxury Chocolate Gift Bouquet in Red Wrap handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Chocolate Bouquet",
            "collectionSlug": "chocolate-bouquet",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "Best Seller",
            "image_url": "/images/products/Luxury Chocolate Gift Bouquet in Red Wrap.webp",
            "images": [
                    "/images/products/Luxury Chocolate Gift Bouquet in Red Wrap.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-22",
            "name": "Luxury Floral 15th Birthday Arrangement",
            "slug": "luxury-floral-15th-birthday-arrangement",
            "description": "Exquisite Luxury Floral 15th Birthday Arrangement handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Balloon Bouquet",
            "collectionSlug": "balloon-bouquet",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "Best Seller",
            "image_url": "/images/products/Luxury Floral 15th Birthday Arrangement.webp",
            "images": [
                    "/images/products/Luxury Floral 15th Birthday Arrangement.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-23",
            "name": "Luxury Mixed Flower Basket Hamper",
            "slug": "luxury-mixed-flower-basket-hamper",
            "description": "Exquisite Luxury Mixed Flower Basket Hamper handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Hamper",
            "collectionSlug": "hamper",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "Best Seller",
            "image_url": "/images/products/Luxury Mixed Flower Basket Hamper.webp",
            "images": [
                    "/images/products/Luxury Mixed Flower Basket Hamper.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-24",
            "name": "Luxury Mixed Flower Bouquet in Lavender Vase Hamper",
            "slug": "luxury-mixed-flower-bouquet-in-lavender-vase-hamper",
            "description": "Exquisite Luxury Mixed Flower Bouquet in Lavender Vase Hamper handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Hamper",
            "collectionSlug": "hamper",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "New Arrival",
            "image_url": "/images/products/Luxury Mixed Flower Bouquet in Lavender Vase Hamper.webp",
            "images": [
                    "/images/products/Luxury Mixed Flower Bouquet in Lavender Vase Hamper.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-25",
            "name": "Luxury Pastel Rose Hatbox Hamper",
            "slug": "luxury-pastel-rose-hatbox-hamper",
            "description": "Exquisite Luxury Pastel Rose Hatbox Hamper handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Hamper",
            "collectionSlug": "hamper",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "Best Seller",
            "image_url": "/images/products/Luxury Pastel Rose Hatbox Hamper.webp",
            "images": [
                    "/images/products/Luxury Pastel Rose Hatbox Hamper.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-26",
            "name": "Luxury Pink & White Rose Basket Bouquet",
            "slug": "luxury-pink-white-rose-basket-bouquet",
            "description": "Exquisite Luxury Pink & White Rose Basket Bouquet handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Fresh Flower",
            "collectionSlug": "fresh-flower",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "Best Seller",
            "image_url": "/images/products/Luxury Pink & White Rose Basket Bouquet.webp",
            "images": [
                    "/images/products/Luxury Pink & White Rose Basket Bouquet.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-27",
            "name": "Luxury Pink Lily & Rose Box Hamper",
            "slug": "luxury-pink-lily-rose-box-hamper",
            "description": "Exquisite Luxury Pink Lily & Rose Box Hamper handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Hamper",
            "collectionSlug": "hamper",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "New Arrival",
            "image_url": "/images/products/Luxury Pink Lily & Rose Box Hamper.webp",
            "images": [
                    "/images/products/Luxury Pink Lily & Rose Box Hamper.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-28",
            "name": "Luxury Pink Lily & Rose Vase Hamper",
            "slug": "luxury-pink-lily-rose-vase-hamper",
            "description": "Exquisite Luxury Pink Lily & Rose Vase Hamper handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Hamper",
            "collectionSlug": "hamper",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "Best Seller",
            "image_url": "/images/products/Luxury Pink Lily & Rose Vase Hamper.webp",
            "images": [
                    "/images/products/Luxury Pink Lily & Rose Vase Hamper.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-29",
            "name": "Luxury Pink Lily Bouquet in Premium Kraft Wrap",
            "slug": "luxury-pink-lily-bouquet-in-premium-kraft-wrap",
            "description": "Exquisite Luxury Pink Lily Bouquet in Premium Kraft Wrap handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Fresh Flower",
            "collectionSlug": "fresh-flower",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "Best Seller",
            "image_url": "/images/products/Luxury Pink Lily Bouquet in Premium Kraft Wrap.webp",
            "images": [
                    "/images/products/Luxury Pink Lily Bouquet in Premium Kraft Wrap.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-30",
            "name": "Luxury Pink Lily Bouquet in Premium Wrap",
            "slug": "luxury-pink-lily-bouquet-in-premium-wrap",
            "description": "Exquisite Luxury Pink Lily Bouquet in Premium Wrap handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Fresh Flower",
            "collectionSlug": "fresh-flower",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "New Arrival",
            "image_url": "/images/products/Luxury Pink Lily Bouquet in Premium Wrap.webp",
            "images": [
                    "/images/products/Luxury Pink Lily Bouquet in Premium Wrap.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-31",
            "name": "Luxury Pink Lily Bouquet with Lavender Wrap",
            "slug": "luxury-pink-lily-bouquet-with-lavender-wrap",
            "description": "Exquisite Luxury Pink Lily Bouquet with Lavender Wrap handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Fresh Flower",
            "collectionSlug": "fresh-flower",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "New Arrival",
            "image_url": "/images/products/Luxury Pink Lily Bouquet with Lavender Wrap.webp",
            "images": [
                    "/images/products/Luxury Pink Lily Bouquet with Lavender Wrap.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-32",
            "name": "Luxury Pink Lily Floral Arch Arrangement",
            "slug": "luxury-pink-lily-floral-arch-arrangement",
            "description": "Exquisite Luxury Pink Lily Floral Arch Arrangement handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Balloon Bouquet",
            "collectionSlug": "balloon-bouquet",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "Best Seller",
            "image_url": "/images/products/Luxury Pink Lily Floral Arch Arrangement.webp",
            "images": [
                    "/images/products/Luxury Pink Lily Floral Arch Arrangement.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-33",
            "name": "Luxury Pink Orchid Bouquet in Premium Wrap",
            "slug": "luxury-pink-orchid-bouquet-in-premium-wrap",
            "description": "Exquisite Luxury Pink Orchid Bouquet in Premium Wrap handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Fresh Flower",
            "collectionSlug": "fresh-flower",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "Best Seller",
            "image_url": "/images/products/Luxury Pink Orchid Bouquet in Premium Wrap.webp",
            "images": [
                    "/images/products/Luxury Pink Orchid Bouquet in Premium Wrap.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-34",
            "name": "Luxury Pink Rose Bouquet in Kraft Wrap",
            "slug": "luxury-pink-rose-bouquet-in-kraft-wrap",
            "description": "Exquisite Luxury Pink Rose Bouquet in Kraft Wrap handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Fresh Flower",
            "collectionSlug": "fresh-flower",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "Best Seller",
            "image_url": "/images/products/Luxury Pink Rose Bouquet in Kraft Wrap.webp",
            "images": [
                    "/images/products/Luxury Pink Rose Bouquet in Kraft Wrap.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-35",
            "name": "Luxury Sunflower Bouquet in Black Wrap",
            "slug": "luxury-sunflower-bouquet-in-black-wrap",
            "description": "Exquisite Luxury Sunflower Bouquet in Black Wrap handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Fresh Flower",
            "collectionSlug": "fresh-flower",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "Best Seller",
            "image_url": "/images/products/Luxury Sunflower Bouquet in Black Wrap.webp",
            "images": [
                    "/images/products/Luxury Sunflower Bouquet in Black Wrap.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-36",
            "name": "Pink & White Lily Bouquet in Premium Wrap",
            "slug": "pink-white-lily-bouquet-in-premium-wrap",
            "description": "Exquisite Pink & White Lily Bouquet in Premium Wrap handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Fresh Flower",
            "collectionSlug": "fresh-flower",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "New Arrival",
            "image_url": "/images/products/Pink & White Lily Bouquet in Premium Wrap.webp",
            "images": [
                    "/images/products/Pink & White Lily Bouquet in Premium Wrap.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-37",
            "name": "Premium Chocolate & Rose Gift Bouquet",
            "slug": "premium-chocolate-rose-gift-bouquet",
            "description": "Exquisite Premium Chocolate & Rose Gift Bouquet handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Chocolate Bouquet",
            "collectionSlug": "chocolate-bouquet",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "Best Seller",
            "image_url": "/images/products/Premium Chocolate & Rose Gift Bouquet.webp",
            "images": [
                    "/images/products/Premium Chocolate & Rose Gift Bouquet.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-38",
            "name": "Premium White Gerbera Bouquet in Black Wrap",
            "slug": "premium-white-gerbera-bouquet-in-black-wrap",
            "description": "Exquisite Premium White Gerbera Bouquet in Black Wrap handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Fresh Flower",
            "collectionSlug": "fresh-flower",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "New Arrival",
            "image_url": "/images/products/Premium White Gerbera Bouquet in Black Wrap.webp",
            "images": [
                    "/images/products/Premium White Gerbera Bouquet in Black Wrap.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-39",
            "name": "Red Rose & White Lily Table Centerpiece",
            "slug": "red-rose-white-lily-table-centerpiece",
            "description": "Exquisite Red Rose & White Lily Table Centerpiece handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Fresh Flower",
            "collectionSlug": "fresh-flower",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "Best Seller",
            "image_url": "/images/products/Red Rose & White Lily Table Centerpiece.webp",
            "images": [
                    "/images/products/Red Rose & White Lily Table Centerpiece.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-40",
            "name": "Traditional Floral Puja Altar Decoration",
            "slug": "traditional-floral-puja-altar-decoration",
            "description": "Exquisite Traditional Floral Puja Altar Decoration handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Balloon Bouquet",
            "collectionSlug": "balloon-bouquet",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "Best Seller",
            "image_url": "/images/products/Traditional Floral Puja Altar Decoration.webp",
            "images": [
                    "/images/products/Traditional Floral Puja Altar Decoration.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-41",
            "name": "Tropical Bird of Paradise & Lily Floral Hamper",
            "slug": "tropical-bird-of-paradise-lily-floral-hamper",
            "description": "Exquisite Tropical Bird of Paradise & Lily Floral Hamper handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Hamper",
            "collectionSlug": "hamper",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "New Arrival",
            "image_url": "/images/products/Tropical Bird of Paradise & Lily Floral Hamper.webp",
            "images": [
                    "/images/products/Tropical Bird of Paradise & Lily Floral Hamper.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-42",
            "name": "Tropical Bird of Paradise Floral Arrangement",
            "slug": "tropical-bird-of-paradise-floral-arrangement",
            "description": "Exquisite Tropical Bird of Paradise Floral Arrangement handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Fresh Flower",
            "collectionSlug": "fresh-flower",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "Best Seller",
            "image_url": "/images/products/Tropical Bird of Paradise Floral Arrangement.webp",
            "images": [
                    "/images/products/Tropical Bird of Paradise Floral Arrangement.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },
    {
            "id": "sep28-43",
            "name": "White Lily & Pink Rose Glass Vase Arrangement",
            "slug": "white-lily-pink-rose-glass-vase-arrangement",
            "description": "Exquisite White Lily & Pink Rose Glass Vase Arrangement handcrafted with fresh premium flowers and luxury presentation for special occasions.",
            "collection": "Fresh Flower",
            "collectionSlug": "fresh-flower",
            "relationships": [
                    "Family",
                    "Corporate",
                    "Friends",
                    "Her",
                    "Him"
            ],
            "celebrations": [
                    "Birthday",
                    "Anniversary",
                    "Festival",
                    "Congratulations"
            ],
            "tag": "New Arrival",
            "image_url": "/images/products/White Lily & Pink Rose Glass Vase Arrangement.webp",
            "images": [
                    "/images/products/White Lily & Pink Rose Glass Vase Arrangement.webp"
            ],
            "stock": 15,
            "itemCount": 1
    },

    // ── GANESH SPECIAL DECORATIONS (TOP FEATURED 5 DAYS) ──
    {
        id: 'dec-ganesh-1',
        name: "Elegant Ganesh Puja Mandap Decoration",
        slug: "elegant-ganesh-puja-mandap-decoration",
        description: "Stunning handcrafted Elegant Ganesh Puja Mandap Decoration specially curated for Ganesh Sthapana, temple puja, and festive celebrations. Made with fresh premium flowers and marigolds.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Corporate","Friends"],
        celebrations: ["Ganesh Chaturthi","Pooja","Festival"],
        tag: "Best Seller",
        image_url: "/images/decoration/Elegant Ganesh Puja Mandap Decoration.webp",
        images: ["/images/decoration/Elegant Ganesh Puja Mandap Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-ganesh-2',
        name: "Grand Ganesh Floral Backdrop Decoration",
        slug: "grand-ganesh-floral-backdrop-decoration",
        description: "Stunning handcrafted Grand Ganesh Floral Backdrop Decoration specially curated for Ganesh Sthapana, temple puja, and festive celebrations. Made with fresh premium flowers and marigolds.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Corporate","Friends"],
        celebrations: ["Ganesh Chaturthi","Pooja","Festival"],
        tag: "Best Seller",
        image_url: "/images/decoration/Grand Ganesh Floral Backdrop Decoration.webp",
        images: ["/images/decoration/Grand Ganesh Floral Backdrop Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-ganesh-3',
        name: "Luxury Blue & White Ganesh Floral Decoration",
        slug: "luxury-blue-white-ganesh-floral-decoration",
        description: "Stunning handcrafted Luxury Blue & White Ganesh Floral Decoration specially curated for Ganesh Sthapana, temple puja, and festive celebrations. Made with fresh premium flowers and marigolds.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Corporate","Friends"],
        celebrations: ["Ganesh Chaturthi","Pooja","Festival"],
        tag: "Best Seller",
        image_url: "/images/decoration/Luxury Blue & White Ganesh Floral Decoration.webp",
        images: ["/images/decoration/Luxury Blue & White Ganesh Floral Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-ganesh-4',
        name: "Luxury Ganesh Floral Backdrop Decoration",
        slug: "luxury-ganesh-floral-backdrop-decoration",
        description: "Stunning handcrafted Luxury Ganesh Floral Backdrop Decoration specially curated for Ganesh Sthapana, temple puja, and festive celebrations. Made with fresh premium flowers and marigolds.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Corporate","Friends"],
        celebrations: ["Ganesh Chaturthi","Pooja","Festival"],
        tag: "Best Seller",
        image_url: "/images/decoration/Luxury Ganesh Floral Backdrop Decoration.webp",
        images: ["/images/decoration/Luxury Ganesh Floral Backdrop Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-ganesh-5',
        name: "Pink, White & Blue Ganesh Floral Decoration",
        slug: "pink-white-blue-ganesh-floral-decoration",
        description: "Stunning handcrafted Pink, White & Blue Ganesh Floral Decoration specially curated for Ganesh Sthapana, temple puja, and festive celebrations. Made with fresh premium flowers and marigolds.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Corporate","Friends"],
        celebrations: ["Ganesh Chaturthi","Pooja","Festival"],
        tag: "Best Seller",
        image_url: "/images/decoration/pink white and blue ganesh decoration.webp",
        images: ["/images/decoration/pink white and blue ganesh decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-ganesh-6',
        name: "Traditional Ganesh Puja Floral Backdrop",
        slug: "traditional-ganesh-puja-floral-backdrop",
        description: "Stunning handcrafted Traditional Ganesh Puja Floral Backdrop specially curated for Ganesh Sthapana, temple puja, and festive celebrations. Made with fresh premium flowers and marigolds.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Corporate","Friends"],
        celebrations: ["Ganesh Chaturthi","Pooja","Festival"],
        tag: "Best Seller",
        image_url: "/images/decoration/Traditional Ganesh Puja Floral Backdrop.webp",
        images: ["/images/decoration/Traditional Ganesh Puja Floral Backdrop.webp"],
        stock: 10,
        itemCount: 1,
    },

    // ── DECORATIONS ──
    {
        id: 'dec-item-1',
        name: "Colorful Floral Entrance home Decoration",
        slug: "colorful-floral-entrance-home-decoration",
        description: "Bespoke Colorful Floral Entrance home Decoration for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "New Arrival",
        image_url: "/images/decoration/Colorful Floral Entrance home Decoration.webp",
        images: ["/images/decoration/Colorful Floral Entrance home Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-2',
        name: "Elegant Floral Banquet Table Decoration",
        slug: "elegant-floral-banquet-table-decoration",
        description: "Bespoke Elegant Floral Banquet Table Decoration for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "Standard",
        image_url: "/images/decoration/Elegant Floral Banquet Table Decoration.webp",
        images: ["/images/decoration/Elegant Floral Banquet Table Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-3',
        name: "Elegant Floral Console Decoration",
        slug: "elegant-floral-console-decoration",
        description: "Bespoke Elegant Floral Console Decoration for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "Standard",
        image_url: "/images/decoration/Elegant Floral Console Decoration.webp",
        images: ["/images/decoration/Elegant Floral Console Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-4',
        name: "Elegant Purple & Pink Floral Door Arch",
        slug: "elegant-purple-pink-floral-door-arch",
        description: "Bespoke Elegant Purple & Pink Floral Door Arch for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "New Arrival",
        image_url: "/images/decoration/Elegant Purple & Pink Floral Door Arch.webp",
        images: ["/images/decoration/Elegant Purple & Pink Floral Door Arch.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-5',
        name: "Elegant TV Unit Floral Decoration",
        slug: "elegant-tv-unit-floral-decoration",
        description: "Bespoke Elegant TV Unit Floral Decoration for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "Standard",
        image_url: "/images/decoration/Elegant TV Unit Floral Decoration.webp",
        images: ["/images/decoration/Elegant TV Unit Floral Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-6',
        name: "Elegant White Floral Wedding Backdrop",
        slug: "elegant-white-floral-wedding-backdrop",
        description: "Bespoke Elegant White Floral Wedding Backdrop for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "Standard",
        image_url: "/images/decoration/Elegant White Floral Wedding Backdrop.webp",
        images: ["/images/decoration/Elegant White Floral Wedding Backdrop.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-7',
        name: "Festive Living Room Floral Decoration",
        slug: "festive-living-room-floral-decoration",
        description: "Bespoke Festive Living Room Floral Decoration for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "New Arrival",
        image_url: "/images/decoration/Festive Living Room Floral Decoration.webp",
        images: ["/images/decoration/Festive Living Room Floral Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-8',
        name: "Floral & Leafy Entrance Door Decoration",
        slug: "floral-leafy-entrance-door-decoration",
        description: "Bespoke Floral & Leafy Entrance Door Decoration for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "Standard",
        image_url: "/images/decoration/Floral & Leafy Entrance Door Decoration.webp",
        images: ["/images/decoration/Floral & Leafy Entrance Door Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-9',
        name: "Floral Car Decoration",
        slug: "floral-car-decoration",
        description: "Bespoke Floral Car Decoration for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "Standard",
        image_url: "/images/decoration/Floral Car Decoration.webp",
        images: ["/images/decoration/Floral Car Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-10',
        name: "Floral Entrance Arch with Marigold Drapes",
        slug: "floral-entrance-arch-with-marigold-drapes",
        description: "Bespoke Floral Entrance Arch with Marigold Drapes for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "New Arrival",
        image_url: "/images/decoration/Floral Entrance Arch with Marigold Drapes.webp",
        images: ["/images/decoration/Floral Entrance Arch with Marigold Drapes.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-11',
        name: "Floral Mandap & Home Temple Decoration",
        slug: "floral-mandap-home-temple-decoration",
        description: "Bespoke Floral Mandap & Home Temple Decoration for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "Standard",
        image_url: "/images/decoration/Floral Mandap & Home Temple Decoration.webp",
        images: ["/images/decoration/Floral Mandap & Home Temple Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-12',
        name: "Floral Temple Entrance Arch Decoration",
        slug: "floral-temple-entrance-arch-decoration",
        description: "Bespoke Floral Temple Entrance Arch Decoration for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "Standard",
        image_url: "/images/decoration/Floral Temple Entrance Arch Decoration.webp",
        images: ["/images/decoration/Floral Temple Entrance Arch Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-13',
        name: "Floral WELCOME Floor Decoration",
        slug: "floral-welcome-floor-decoration",
        description: "Bespoke Floral WELCOME Floor Decoration for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "New Arrival",
        image_url: "/images/decoration/Floral “WELCOME” Floor Decoration.webp",
        images: ["/images/decoration/Floral “WELCOME” Floor Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-14',
        name: "Grand Marigold Entrance Decoration",
        slug: "grand-marigold-entrance-decoration",
        description: "Bespoke Grand Marigold Entrance Decoration for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "Standard",
        image_url: "/images/decoration/Grand Marigold Entrance Decoration.webp",
        images: ["/images/decoration/Grand Marigold Entrance Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-15',
        name: "Grand Marigold Floral Welcome Pathway",
        slug: "grand-marigold-floral-welcome-pathway",
        description: "Bespoke Grand Marigold Floral Welcome Pathway for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "Standard",
        image_url: "/images/decoration/Grand Marigold Floral Welcome Pathway.webp",
        images: ["/images/decoration/Grand Marigold Floral Welcome Pathway.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-16',
        name: "Grand Marigold Temple Entrance Decoration",
        slug: "grand-marigold-temple-entrance-decoration",
        description: "Bespoke Grand Marigold Temple Entrance Decoration for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "New Arrival",
        image_url: "/images/decoration/Grand Marigold Temple Entrance Decoration.webp",
        images: ["/images/decoration/Grand Marigold Temple Entrance Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-17',
        name: "Grand Red & Green Floral Entrance Decoration",
        slug: "grand-red-green-floral-entrance-decoration",
        description: "Bespoke Grand Red & Green Floral Entrance Decoration for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "Standard",
        image_url: "/images/decoration/Grand Red & Green Floral Entrance Decoration.webp",
        images: ["/images/decoration/Grand Red & Green Floral Entrance Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-18',
        name: "Luxury Floral 40th Birthday Decoration",
        slug: "luxury-floral-40th-birthday-decoration",
        description: "Bespoke Luxury Floral 40th Birthday Decoration for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "Standard",
        image_url: "/images/decoration/Luxury Floral 40th Birthday Decoration.webp",
        images: ["/images/decoration/Luxury Floral 40th Birthday Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-19',
        name: "Luxury Hanging Floral Entrance Arch",
        slug: "luxury-hanging-floral-entrance-arch",
        description: "Bespoke Luxury Hanging Floral Entrance Arch for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "New Arrival",
        image_url: "/images/decoration/Luxury Hanging Floral Entrance Arch.webp",
        images: ["/images/decoration/Luxury Hanging Floral Entrance Arch.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-20',
        name: "Luxury Pink & White Floral Backdrop",
        slug: "luxury-pink-white-floral-backdrop",
        description: "Bespoke Luxury Pink & White Floral Backdrop for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "Standard",
        image_url: "/images/decoration/Luxury Pink & White Floral Backdrop.webp",
        images: ["/images/decoration/Luxury Pink & White Floral Backdrop.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-21',
        name: "Marigold & Floral Floor Border Decoration",
        slug: "marigold-floral-floor-border-decoration",
        description: "Bespoke Marigold & Floral Floor Border Decoration for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "Standard",
        image_url: "/images/decoration/Marigold & Floral Floor Border Decoration.webp",
        images: ["/images/decoration/Marigold & Floral Floor Border Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-22',
        name: "Marigold Floral Welcome Backdrop",
        slug: "marigold-floral-welcome-backdrop",
        description: "Bespoke Marigold Floral Welcome Backdrop for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "New Arrival",
        image_url: "/images/decoration/Marigold Floral Welcome Backdrop.webp",
        images: ["/images/decoration/Marigold Floral Welcome Backdrop.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-23',
        name: "Pink & White Floral Stage Decoration",
        slug: "pink-white-floral-stage-decoration",
        description: "Bespoke Pink & White Floral Stage Decoration for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "Standard",
        image_url: "/images/decoration/Pink & White Floral Stage Decoration.webp",
        images: ["/images/decoration/Pink & White Floral Stage Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-24',
        name: "Pink & White Floral Window Decoration",
        slug: "pink-white-floral-window-decoration",
        description: "Bespoke Pink & White Floral Window Decoration for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "Standard",
        image_url: "/images/decoration/Pink & White Floral Window Decoration.webp",
        images: ["/images/decoration/Pink & White Floral Window Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-25',
        name: "Purple & White Floral Door Decoration",
        slug: "purple-white-floral-door-decoration",
        description: "Bespoke Purple & White Floral Door Decoration for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "New Arrival",
        image_url: "/images/decoration/Purple & White Floral Door Decoration.webp",
        images: ["/images/decoration/Purple & White Floral Door Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-26',
        name: "Traditional Marigold Door Entrance Decoration",
        slug: "traditional-marigold-door-entrance-decoration",
        description: "Bespoke Traditional Marigold Door Entrance Decoration for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "Standard",
        image_url: "/images/decoration/Traditional Marigold Door Entrance Decoration.webp",
        images: ["/images/decoration/Traditional Marigold Door Entrance Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-27',
        name: "Traditional Marigold Door Hanging Decoration",
        slug: "traditional-marigold-door-hanging-decoration",
        description: "Bespoke Traditional Marigold Door Hanging Decoration for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "Standard",
        image_url: "/images/decoration/Traditional Marigold Door Hanging Decoration.webp",
        images: ["/images/decoration/Traditional Marigold Door Hanging Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-28',
        name: "Traditional Marigold Welcome Door Decoration",
        slug: "traditional-marigold-welcome-door-decoration",
        description: "Bespoke Traditional Marigold Welcome Door Decoration for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "New Arrival",
        image_url: "/images/decoration/Traditional Marigold Welcome Door Decoration.webp",
        images: ["/images/decoration/Traditional Marigold Welcome Door Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-29',
        name: "Traditional Marigold Window Decoration",
        slug: "traditional-marigold-window-decoration",
        description: "Bespoke Traditional Marigold Window Decoration for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "Standard",
        image_url: "/images/decoration/Traditional Marigold Window Decoration.webp",
        images: ["/images/decoration/Traditional Marigold Window Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-30',
        name: "Traditional Yellow Floral Puja Decoration",
        slug: "traditional-yellow-floral-puja-decoration",
        description: "Bespoke Traditional Yellow Floral Puja Decoration for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "Standard",
        image_url: "/images/decoration/Traditional Yellow Floral Puja Decoration.webp",
        images: ["/images/decoration/Traditional Yellow Floral Puja Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },
    {
        id: 'dec-item-31',
        name: "White Floral Doorway Decoration",
        slug: "white-floral-doorway-decoration",
        description: "Bespoke White Floral Doorway Decoration for homes, venues, and grand celebrations. Professionally designed with fresh flowers and premium drapes.",
        collection: "Balloon Bouquet",
        collectionSlug: "balloon-bouquet",
        relationships: ["Family","Friends","Corporate"],
        celebrations: ["Wedding","Anniversary","Birthday","Pooja"],
        tag: "New Arrival",
        image_url: "/images/decoration/White Floral Doorway Decoration.webp",
        images: ["/images/decoration/White Floral Doorway Decoration.webp"],
        stock: 10,
        itemCount: 1,
    },

    // ── NEW HAMPERS ──
    {
        id: 'hamp-pink-bday-1',
        name: "Luxury Birthday Pink Hamper",
        slug: "luxury-birthday-pink-hamper",
        description: "Exquisite luxury pink birthday gift hamper filled with gourmet chocolates, personalized gifts, and beautiful floral accents.",
        collection: "Hamper",
        collectionSlug: "hamper",
        relationships: ["Her","Girlfriend","Wife","Friend"],
        celebrations: ["Birthday"],
        tag: "New Arrival",
        image_url: "/images/products/luxury-birthday-pink-hamper.webp",
        images: ["/images/products/luxury-birthday-pink-hamper.webp"],
        stock: 10,
        itemCount: 1,
    },

    // ── ROSES ──
    {
        id: '1',
        name: 'Crimson Elegance Bouquet',
        slug: 'crimson-elegance-bouquet',
        description: 'Deep red premium roses wrapped in elegant eco-style packaging. A timeless expression of love and passion, handpicked at dawn for peak freshness and arranged by our master florists.',
        collection: 'Fresh Flower',
        collectionSlug: 'fresh-flower',
        relationships: ['Girlfriend', 'Wife'],
        celebrations: ['Anniversary', "Women's Day"],
        tag: 'Best Seller',
        image_url: '/images/products/crimson-elegance-bouquet.webp',
        images: ['/images/products/crimson-elegance-bouquet.webp'],
        stock: 10,
        itemCount: 24,
    },
    {
        id: '2',
        name: 'Blush Harmony Roses',
        slug: 'blush-harmony-roses',
        description: 'Soft blush pink roses arranged in a graceful hand-tied style. Delicate and romantic, these roses are perfect for celebrating the special women in your life.',
        collection: 'Fresh Flower',
        collectionSlug: 'fresh-flower',
        relationships: ['Her', 'Wife'],
        celebrations: ["Women's Day"],
        tag: 'Standard',
        image_url: '/images/products/blush-harmony-roses.webp',
        images: ['/images/products/blush-harmony-roses.webp'],
        stock: 10,
        itemCount: 15,
    },
    {
        id: '3',
        name: 'Ivory Serenity Bloom',
        slug: 'ivory-serenity-bloom',
        description: 'Elegant white roses symbolizing purity and peace. A refined choice for friends and corporate gifting, beautifully wrapped in premium eco-packaging.',
        collection: 'Fresh Flower',
        collectionSlug: 'fresh-flower',
        relationships: ['Friend', 'Corporate'],
        celebrations: ['Eid', 'Eid Ul Fitr', 'Navratri'],
        tag: 'Standard',
        image_url: '/images/products/ivory-serenity-bloom.webp',
        images: ['/images/products/ivory-serenity-bloom.webp'],
        stock: 10,
        itemCount: 20,
    },
    {
        id: '4',
        name: 'Heart Shape Rose Box',
        slug: 'heart-shape-rose-box',
        description: 'Romantic heart-shaped box filled with fresh red roses. A stunning declaration of love, crafted to make anniversaries and special moments truly unforgettable.',
        collection: 'Fresh Flower',
        collectionSlug: 'fresh-flower',
        relationships: ['Girlfriend', 'Wife'],
        celebrations: ['Anniversary'],
        tag: 'Best Seller',
        image_url: '/images/products/heart-shape-rose-box.webp',
        images: ['/images/products/heart-shape-rose-box.webp'],
        stock: 10,
        itemCount: 30,
    },

    // ── LUXURY BOUQUETS ──
    {
        id: '5',
        name: 'Royal Crimson Symphony',
        slug: 'royal-crimson-symphony',
        description: 'A grand bouquet of red and blush roses with luxury fillers. This opulent arrangement is crafted for those who believe love deserves the grandest expression.',
        collection: 'Fresh Flower',
        collectionSlug: 'fresh-flower',
        relationships: ['Wife', 'Girlfriend'],
        celebrations: ['Anniversary'],
        tag: 'Best Seller',
        image_url: '/images/products/royal-crimson-symphony.webp',
        images: ['/images/products/royal-crimson-symphony.webp'],
        stock: 10,
        itemCount: 50,
    },
    {
        id: '6',
        name: 'Champagne Bloom Delight',
        slug: 'champagne-bloom-delight',
        description: 'Soft champagne roses in premium wrapping. A sophisticated and modern arrangement that celebrates femininity with understated luxury.',
        collection: 'Fresh Flower',
        collectionSlug: 'fresh-flower',
        relationships: ['Her'],
        celebrations: ["Women's Day"],
        tag: 'New Arrival',
        image_url: '/images/products/champagne-bloom-delight.webp',
        images: ['/images/products/champagne-bloom-delight.webp'],
        imageScale: 1.25,
        stock: 10,
        itemCount: 18,
    },
    {
        id: '7',
        name: 'Emerald Luxe Arrangement',
        slug: 'emerald-luxe-arrangement',
        description: 'A refined green-toned luxury floral composition. Sophisticated and bold, this arrangement is designed for the modern gentleman who appreciates the finer things.',
        collection: 'Fresh Flower',
        collectionSlug: 'fresh-flower',
        relationships: ['Him', 'Husband'],
        celebrations: ['Corporate Events'],
        tag: 'Standard',
        image_url: '/images/products/emerald-luxe-arrangement.webp',
        images: ['/images/products/emerald-luxe-arrangement.webp'],
        stock: 10,
        itemCount: 12,
    },
    {
        id: '8',
        name: 'Prestige Floral Ensemble',
        slug: 'prestige-floral-ensemble',
        description: 'Sophisticated floral mix crafted for celebrations. A vibrant and joyful arrangement that brings the spirit of festivity to every occasion.',
        collection: 'Fresh Flower',
        collectionSlug: 'fresh-flower',
        relationships: ['Friend'],
        celebrations: ['Holi', 'Navratri', 'Eid', 'Eid Ul Fitr'],
        tag: 'Standard',
        image_url: '/images/products/prestige-floral-ensemble.webp',
        images: ['/images/products/prestige-floral-ensemble.webp'],
        stock: 10,
        itemCount: 20,
    },

    // ── PERSONALIZED GIFTS ──
    {
        id: '9',
        name: 'Custom Name Rose Box',
        slug: 'custom-name-rose-box',
        description: 'Personalized rose box engraved with a custom name. A deeply personal and romantic gift that transforms a beautiful bouquet into a lasting keepsake.',
        collection: 'Personalized',
        collectionSlug: 'personalized',
        relationships: ['Girlfriend', 'Wife'],
        celebrations: ['Anniversary'],
        tag: 'Best Seller',
        image_url: '/images/products/custom-name-rose-box.webp',
        images: ['/images/products/custom-name-rose-box.webp'],
        stock: 10,
    },
    {
        id: '10',
        name: 'Photo Memory Gift Set',
        slug: 'photo-memory-gift-set',
        description: 'Floral gift combo paired with a custom photo frame. Celebrate your most cherished memories with a gift that combines the beauty of fresh flowers with a personalized keepsake.',
        collection: 'Personalized',
        collectionSlug: 'personalized',
        relationships: ['Husband', 'Wife'],
        celebrations: ['Anniversary'],
        tag: 'Standard',
        image_url: '/images/products/photo-memory-gift-set.webp',
        images: ['/images/products/photo-memory-gift-set.webp'],
        stock: 10,
    },
    {
        id: '11',
        name: 'Personalized Mug & Roses',
        slug: 'personalized-mug-and-roses',
        description: 'Custom printed mug paired with fresh roses. A charming and thoughtful gift that combines everyday warmth with the beauty of fresh blooms.',
        collection: 'Personalized',
        collectionSlug: 'personalized',
        relationships: ['Boyfriend', 'Girlfriend'],
        celebrations: ['Birthday'],
        tag: 'New Arrival',
        image_url: '/images/products/personalized-mug-and-roses.webp',
        images: ['/images/products/personalized-mug-and-roses.webp'],
        stock: 10,
        itemCount: 8,
    },
    {
        id: '12',
        name: 'Engraved Wooden Keepsake',
        slug: 'engraved-wooden-keepsake',
        description: 'Elegant engraved wooden gift with floral accent. A timeless and sophisticated keepsake that honors the special bond between husband and wife.',
        collection: 'Personalized',
        collectionSlug: 'personalized',
        relationships: ['Husband'],
        celebrations: ['Husband Appreciation Day'],
        tag: 'Standard',
        image_url: '/images/products/engraved-wooden-keepsake.webp',
        images: ['/images/products/engraved-wooden-keepsake.webp'],
        stock: 10,
    },

    // ── ANNIVERSARY COLLECTION ──
    {
        id: '13',
        name: 'Golden Anniversary Bloom',
        slug: 'golden-anniversary-bloom',
        description: 'Elegant floral bouquet crafted for milestone anniversaries. A golden tribute to enduring love, featuring premium blooms arranged with timeless grace.',
        collection: 'Fresh Flower',
        collectionSlug: 'fresh-flower',
        relationships: ['Wife'],
        celebrations: ['Anniversary'],
        tag: 'Best Seller',
        image_url: '/images/products/golden-anniversary-bloom.webp',
        images: ['/images/products/golden-anniversary-bloom.webp'],
        stock: 10,
        itemCount: 25,
    },
    {
        id: '14',
        name: 'Forever Together Bouquet',
        slug: 'forever-together-bouquet',
        description: 'Romantic floral arrangement celebrating eternal love. A beautifully curated bouquet that speaks the language of forever, perfect for couples celebrating their journey.',
        collection: 'Fresh Flower',
        collectionSlug: 'fresh-flower',
        relationships: ['Couple'],
        celebrations: ['Anniversary'],
        tag: 'Standard',
        image_url: '/images/products/forever-together-bouquet.webp',
        images: ['/images/products/forever-together-bouquet.webp'],
        stock: 10,
        itemCount: 40,
    },
    {
        id: '15',
        name: 'Ruby Romance Collection',
        slug: 'ruby-romance-collection',
        description: 'Deep red roses designed for romantic occasions. A passionate and bold collection that captures the intensity of love, perfect for anniversaries and romantic gestures.',
        collection: 'Fresh Flower',
        collectionSlug: 'fresh-flower',
        relationships: ['Girlfriend'],
        celebrations: ['Anniversary'],
        tag: 'Standard',
        image_url: '/images/products/ruby-romance-collection.webp',
        images: ['/images/products/ruby-romance-collection.webp'],
        stock: 10,
        itemCount: 36,
    },

    // ── CORPORATE GIFTING ──
    {
        id: '16',
        name: 'Executive Floral Hamper',
        slug: 'executive-floral-hamper',
        description: 'Premium executive hamper for business gifting. A sophisticated and thoughtfully curated hamper that makes a powerful statement in professional relationships.',
        collection: 'Hamper',
        collectionSlug: 'hamper',
        relationships: ['Him'],
        celebrations: ['Corporate Events', 'Eid', 'Eid Ul Fitr', 'Navratri'],
        tag: 'Best Seller',
        image_url: '/images/products/executive-floral-hamper.webp',
        images: ['/images/products/executive-floral-hamper.webp'],
        stock: 10,
    },
    {
        id: '17',
        name: 'Corporate Appreciation Box',
        slug: 'corporate-appreciation-box',
        description: 'Luxury thank-you gift for valued clients. An elegant and premium gift box that expresses gratitude and strengthens professional bonds with style.',
        collection: 'Hamper',
        collectionSlug: 'hamper',
        relationships: ['Corporate'],
        celebrations: ['Festive Events', 'Eid', 'Eid Ul Fitr', 'Navratri'],
        tag: 'Standard',
        image_url: '/images/products/corporate-appreciation-box.webp',
        images: ['/images/products/corporate-appreciation-box.webp'],
        stock: 10,
    },
    {
        id: '18',
        name: 'Signature Business Bloom',
        slug: 'signature-business-bloom',
        description: 'Minimalist professional floral arrangement. Clean, refined, and impactful — a floral statement that speaks volumes in any professional setting.',
        collection: 'Hamper',
        collectionSlug: 'hamper',
        relationships: ['Him'],
        celebrations: ['Office Celebrations'],
        tag: 'New Arrival',
        image_url: '/images/products/signature-business-bloom.webp',
        images: ['/images/products/signature-business-bloom.webp'],
        stock: 10,
    },

    // ── SEASONAL ──
    {
        id: '19',
        name: 'Holi Color Splash Bouquet',
        slug: 'holi-color-splash-bouquet',
        description: 'Vibrant bouquet inspired by Holi colors. A joyful and exuberant arrangement bursting with color, celebrating the festival of love and friendship.',
        collection: 'Fresh Flower',
        collectionSlug: 'fresh-flower',
        relationships: ['Friend'],
        celebrations: ['Holi'],
        tag: 'Seasonal',
        image_url: '/images/products/holi-color-splash-bouquet.webp',
        images: ['/images/products/holi-color-splash-bouquet.webp'],
        stock: 10,
        itemCount: 22,
    },
    {
        id: '20',
        name: 'Eid Mubarak Luxe Hamper',
        slug: 'eid-mubarak-luxe-hamper',
        description: 'Elegant festive hamper with premium floral touch. A beautifully curated Eid gift that combines luxury and warmth, perfect for family and corporate gifting.',
        collection: 'Hamper',
        collectionSlug: 'hamper',
        relationships: ['Family', 'Corporate'],
        celebrations: ['Eid', 'Eid Ul Fitr'],
        tag: 'Seasonal',
        image_url: '/images/products/eid-mubarak-luxe-hamper.webp',
        images: ['/images/products/eid-mubarak-luxe-hamper.webp'],
        stock: 10,
    },
    {
        id: '21',
        name: 'Divine Navratri Bloom Box',
        slug: 'divine-navratri-bloom-box',
        description: 'Festive floral arrangement inspired by Navratri. A divine and colorful bloom box that captures the spiritual energy and vibrant spirit of the festival.',
        collection: 'Fresh Flower',
        collectionSlug: 'fresh-flower',
        relationships: ['Family'],
        celebrations: ['Navratri'],
        tag: 'Seasonal',
        image_url: '/images/products/divine-navratri-bloom-box.webp',

        images: ['/images/products/divine-navratri-bloom-box.webp'],
        stock: 10,
        itemCount: 16,
    },
    {
        id: '22',
        name: "Gentleman's Luxury Gift Set",
        slug: 'gentlemans-luxury-gift-set',
        description: 'Premium curated gift box for modern gentlemen. A sophisticated and thoughtfully assembled gift set that celebrates the special men in your life with unmatched elegance.',
        collection: 'Personalized',
        collectionSlug: 'personalized',
        relationships: ['Husband', 'Boyfriend'],
        celebrations: ['Husband Appreciation Day'],
        tag: 'New Arrival',
        image_url: '/images/products/gentlemans-luxury-gift-set.webp',
        images: ['/images/products/gentlemans-luxury-gift-set.webp'],
        stock: 10,
    },

    // ── NEW PRODUCTS ──
    {
        id: '23',
        name: 'Mix Flowers',
        slug: 'mix-flowers',
        description: 'Beautiful mix flowers arrangement crafted with fresh blooms.',
        collection: 'Fresh Flower',
        collectionSlug: 'fresh-flower',
        relationships: ['Friend', 'Family'],
        celebrations: ['Birthday', 'Anniversary', 'Eid', 'Eid Ul Fitr', 'Navratri', 'Husband Appreciation Day'],
        tag: 'New Arrival',
        image_url: '/images/products/mix-flowers.webp',
        images: ['/images/products/mix-flowers.webp'],
        stock: 10,
        itemCount: 15,
    },
    {
        id: '24',
        name: 'Roses',
        slug: 'roses-new',
        description: 'Beautiful roses arrangement crafted with fresh blooms.',
        collection: 'Fresh Flower',
        collectionSlug: 'fresh-flower',
        relationships: ['Friend', 'Family'],
        celebrations: ['Birthday', 'Anniversary', 'Eid', 'Eid Ul Fitr', 'Navratri', 'Husband Appreciation Day'],
        tag: 'New Arrival',
        image_url: '/images/products/roses.webp',
        images: ['/images/products/roses.webp'],
        stock: 10,
        itemCount: 12,
    },
    {
        id: '25',
        name: 'Carnation',
        slug: 'carnation',
        description: 'Beautiful carnation arrangement crafted with fresh blooms.',
        collection: 'Fresh Flower',
        collectionSlug: 'fresh-flower',
        relationships: ['Friend', 'Family'],
        celebrations: ['Birthday', 'Anniversary'],
        tag: 'New Arrival',
        image_url: '/images/products/carnation.webp',
        images: ['/images/products/carnation.webp'],
        stock: 10,
        itemCount: 10,
    },
    {
        id: '26',
        name: 'Lily',
        slug: 'lily',
        description: 'Beautiful lily arrangement crafted with fresh blooms.',
        collection: 'Fresh Flower',
        collectionSlug: 'fresh-flower',
        relationships: ['Friend', 'Family'],
        celebrations: ['Birthday', 'Anniversary'],
        tag: 'New Arrival',
        image_url: '/images/products/lily.webp',
        images: ['/images/products/lily.webp'],
        stock: 10,
        itemCount: 5,
    },
    {
        id: '27',
        name: 'Daisy',
        slug: 'daisy',
        description: 'Beautiful daisy arrangement crafted with fresh blooms.',
        collection: 'Fresh Flower',
        collectionSlug: 'fresh-flower',
        relationships: ['Friend', 'Family'],
        celebrations: ['Birthday', 'Anniversary'],
        tag: 'New Arrival',
        image_url: '/images/products/daisy.webp',
        images: ['/images/products/daisy.webp'],
        stock: 10,
        itemCount: 20,
    },
    {
        id: '28',
        name: 'Orchids',
        slug: 'orchids',
        description: 'Beautiful orchids arrangement crafted with fresh blooms.',
        collection: 'Fresh Flower',
        collectionSlug: 'fresh-flower',
        relationships: ['Friend', 'Family'],
        celebrations: ['Birthday', 'Anniversary'],
        tag: 'New Arrival',
        image_url: '/images/products/orchids.webp',
        images: ['/images/products/orchids.webp'],
        stock: 10,
        itemCount: 10,
    },
    {
        id: '29',
        name: 'Gerbera',
        slug: 'gerbera',
        description: 'Beautiful gerbera arrangement crafted with fresh blooms.',
        collection: 'Fresh Flower',
        collectionSlug: 'fresh-flower',
        relationships: ['Friend', 'Family'],
        celebrations: ['Birthday', 'Anniversary'],
        tag: 'New Arrival',
        image_url: '/images/products/gerbera.webp',
        images: ['/images/products/gerbera.webp'],
        stock: 10,
        itemCount: 12,
    },
    {
        id: '30',
        name: 'Sunflower',
        slug: 'sunflower',
        description: 'Beautiful sunflower arrangement crafted with fresh blooms.',
        collection: 'Fresh Flower',
        collectionSlug: 'fresh-flower',
        relationships: ['Friend', 'Family'],
        celebrations: ['Birthday', 'Anniversary', 'Eid', 'Eid Ul Fitr', 'Navratri', 'Husband Appreciation Day'],
        tag: 'New Arrival',
        image_url: '/images/products/sunflower.webp',
        images: ['/images/products/sunflower.webp'],
        stock: 10,
        itemCount: 5,
    },
    // ── PLANTS ──
    {
        id: '31',
        name: 'Lucky Bamboo',
        slug: 'lucky-bamboo',
        description: 'A beautiful indoor Lucky Bamboo plant symbolizing good luck and prosperity. Perfect for gifting and home decor.',
        collection: 'Plants',
        collectionSlug: 'plants',
        relationships: ['Friend', 'Family', 'Corporate'],
        celebrations: ['Birthday', 'Anniversary'],
        tag: 'Best Seller',
        image_url: '/images/products/lucky-bamboo-1.webp',
        images: [
            '/images/products/lucky-bamboo-1.webp',
            '/images/products/lucky-bamboo-2.webp',
            '/images/products/lucky-bamboo-3.webp'
        ],
        stock: 10,
        itemCount: 3, // Number of stalks
    },
    {
        id: '32',
        name: 'Jade Plant',
        slug: 'jade-plant',
        description: 'A stunning Jade Plant known for attracting wealth and financial success. Easy to care for and highly decorative.',
        collection: 'Plants',
        collectionSlug: 'plants',
        relationships: ['Friend', 'Family', 'Corporate'],
        celebrations: ['Birthday', 'Anniversary'],
        tag: 'New Arrival',
        image_url: '/images/products/jade-plant-1.webp',
        images: [
            '/images/products/jade-plant-1.webp',
            '/images/products/jade-plant-2.webp',
            '/images/products/jade-plant-3.webp'
        ],
        stock: 10,
        itemCount: 1,
    },
    {
        id: '33',
        name: 'ZZ Plant',
        slug: 'zz-plant',
        description: 'The highly resilient ZZ plant with its glossy, dark green leaves. Perfect for modern spaces and requires very little maintenance.',
        collection: 'Plants',
        collectionSlug: 'plants',
        relationships: ['Friend', 'Family', 'Corporate'],
        celebrations: ['Birthday', 'Anniversary'],
        tag: 'Standard',
        image_url: '/images/products/zz-plant-1.webp',
        images: [
            '/images/products/zz-plant-1.webp',
            '/images/products/zz-plant-2.webp',
            '/images/products/zz-plant-3.webp',
            '/images/products/zz-plant-4.webp'
        ],
        stock: 10,
        itemCount: 1,
    },
];

// Helper functions
export function getProductBySlug(slug: string): Product | undefined {
    return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCollection(collectionSlug: string): Product[] {
    return PRODUCTS.filter((p) => p.collectionSlug === collectionSlug);
}

export function getProductsByTag(tag: Product['tag']): Product[] {
    return PRODUCTS.filter((p) => p.tag === tag);
}

export function getProductsByRelationship(relationship: string): Product[] {
    return PRODUCTS.filter((p) =>
        p.relationships.some((r) => r.toLowerCase() === relationship.toLowerCase())
    );
}

export function getProductsByCelebration(celebration: string): Product[] {
    return PRODUCTS.filter((p) =>
        p.celebrations.some((c) => c.toLowerCase() === celebration.toLowerCase())
    );
}

export const COLLECTIONS = [
    { name: 'Fresh Flower', slug: 'fresh-flower' },
    { name: 'Chocolate Bouquet', slug: 'chocolate-bouquet' },
    { name: 'Teddy and Bouquet', slug: 'teddy-and-bouquet' },
    { name: 'Personalized', slug: 'personalized' },
    { name: 'Hamper', slug: 'hamper' },
    { name: 'Plants', slug: 'plants' },
    { name: 'Cake', slug: 'cake' },
    { name: 'Balloon Bouquet', slug: 'balloon-bouquet' },
    { name: 'Decorations', slug: 'decorations' },
];
