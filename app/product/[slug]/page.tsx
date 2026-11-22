'use client';

import { useState, useEffect, use, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
    ArrowLeft, 
    ShoppingCart, 
    Minus, 
    Plus, 
    Star, 
    MapPin, 
    Maximize2, 
    ChevronRight, 
    X, 
    Heart, 
    Leaf, 
    Truck, 
    Gift, 
    Check 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard, { getProductPriceInfo } from '@/components/product/product-card';
import WhatsAppFloat from '@/components/ui/whatsapp-float';
import WhatsappIcon from '@/components/ui/whatsapp-icon';
import DeliveryLocationModal from '@/components/ui/delivery-location-modal';
import AnimatedDeliveryScooter, { FreeDeliveryPillButton } from '@/components/ui/animated-delivery-scooter';
import { fetchProductBySlug, fetchProductsByCollection, fetchWhatsappSettings, DBProduct } from '@/lib/supabase';
import { getProductBySlug, getProductsByCollection, PRODUCTS } from '@/lib/products';
import { trackEnquiry } from '@/lib/analytics';
import { useCart } from '@/lib/cart-context';

const FALLBACK_PHONE = '919936911611';

// Explicit inline font family styles to guarantee 100% font rendering
const FONT_CORMORANT = { fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif" };
const FONT_DM_SANS = { fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" };

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const router = useRouter();
    const { slug } = use(params);

    // Instant synchronous catalog resolution — zero network delay, instant SSR
    const initialProduct = getProductBySlug(slug);
    const initialDbProduct: DBProduct | null = initialProduct ? {
        id: initialProduct.id,
        name: initialProduct.name,
        slug: initialProduct.slug,
        description: initialProduct.description,
        collection_name: initialProduct.collection,
        collection_slug: initialProduct.collectionSlug,
        relationships: initialProduct.relationships,
        celebrations: initialProduct.celebrations,
        tag: initialProduct.tag,
        image_url: initialProduct.images[0] || initialProduct.image_url,
        images: initialProduct.images,
        image_scale: initialProduct.imageScale ?? 1,
        stock: initialProduct.stock,
        item_count: initialProduct.itemCount ?? 0,
        is_visible: true,
        is_featured: false,
        sort_order: 0,
        created_at: '',
        updated_at: '',
    } : null;

    const initialSuggestions: DBProduct[] = initialProduct ? (() => {
        const coll = getProductsByCollection(initialProduct.collectionSlug).filter(p => p.id !== initialProduct.id);
        const others = PRODUCTS.filter(p => p.id !== initialProduct.id && !coll.some(c => c.id === p.id));
        return [...coll, ...others].slice(0, 8).map(p => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description,
            collection_name: p.collection,
            collection_slug: p.collectionSlug,
            relationships: p.relationships,
            celebrations: p.celebrations,
            tag: p.tag,
            image_url: p.images[0] || p.image_url,
            images: p.images,
            image_scale: p.imageScale ?? 1,
            stock: p.stock,
            item_count: p.itemCount ?? 0,
            is_visible: true,
            is_featured: false,
            sort_order: 0,
            created_at: '',
            updated_at: '',
        }));
    })() : [];

    const [selectedImage, setSelectedImage] = useState(0);
    const [product, setProduct] = useState<DBProduct | null>(initialDbProduct);
    const [relatedProducts, setRelatedProducts] = useState<DBProduct[]>(initialSuggestions);
    const [whatsappLink, setWhatsappLink] = useState('');
    const [loading, setLoading] = useState(!initialDbProduct);
    const [deliveryLoc, setDeliveryLoc] = useState('Kolkata, 700001');
    const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState('');
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeTab, setActiveTab] = useState<'about' | 'details' | 'reviews'>('about');
    const [justAdded, setJustAdded] = useState(false);

    const { items, addItem, removeItem, updateQuantity, openDrawer, openAddonModal } = useCart();
    const [addedSuggestedId, setAddedSuggestedId] = useState<string | null>(null);

    useEffect(() => {
        setImgError(false);
    }, [selectedImage, product?.id]);

    useEffect(() => {
        const saved = localStorage.getItem('newecoroses_delivery_loc');
        if (saved) setDeliveryLoc(saved);
    }, []);

    // Check wishlist state
    useEffect(() => {
        if (!product) return;
        try {
            const saved = JSON.parse(localStorage.getItem('newecoroses_wishlist') || '[]');
            setIsWishlisted(saved.includes(product.id));
        } catch {}
    }, [product]);

    const toggleWishlist = () => {
        if (!product) return;
        try {
            const saved = JSON.parse(localStorage.getItem('newecoroses_wishlist') || '[]');
            let updated: string[];
            if (saved.includes(product.id)) {
                updated = saved.filter((id: string) => id !== product.id);
                setIsWishlisted(false);
            } else {
                updated = [...saved, product.id];
                setIsWishlisted(true);
            }
            localStorage.setItem('newecoroses_wishlist', JSON.stringify(updated));
        } catch {}
    };

    useEffect(() => {
        // 1. INSTANT: Check static catalog synchronously — zero network wait
        const staticProduct = getProductBySlug(slug);
        if (staticProduct) {
            const dbLike: DBProduct = {
                id: staticProduct.id,
                name: staticProduct.name,
                slug: staticProduct.slug,
                description: staticProduct.description,
                collection_name: staticProduct.collection,
                collection_slug: staticProduct.collectionSlug,
                relationships: staticProduct.relationships,
                celebrations: staticProduct.celebrations,
                tag: staticProduct.tag,
                image_url: staticProduct.images[0],
                images: staticProduct.images,
                image_scale: staticProduct.imageScale ?? 1,
                stock: staticProduct.stock,
                item_count: staticProduct.itemCount ?? 0,
                is_visible: true,
                is_featured: false,
                sort_order: 0,
                created_at: '',
                updated_at: '',
            };
            setProduct(dbLike);

            // Populate up to 8 rich product suggestions
            const collectionProducts = getProductsByCollection(staticProduct.collectionSlug)
                .filter(p => p.id !== staticProduct.id);
            const allStatic = PRODUCTS.filter(p => p.id !== staticProduct.id);
            const merged = [...collectionProducts];
            for (const p of allStatic) {
                if (merged.length >= 8) break;
                if (!merged.some(m => m.id === p.id)) {
                    merged.push(p);
                }
            }
            setRelatedProducts(merged.slice(0, 8) as unknown as DBProduct[]);
            setLoading(false);
        }

        // 2. BACKGROUND: Silently upgrade with live Supabase data
        fetchProductBySlug(slug).then(async (dbProduct) => {
            if (dbProduct && dbProduct.is_visible !== false) {
                setProduct(dbProduct);
                const related = await fetchProductsByCollection(dbProduct.collection_slug).catch(() => []);
                const filtered = related.filter(p => p.id !== dbProduct.id && p.is_visible !== false);
                if (filtered.length >= 8) {
                    setRelatedProducts(filtered.slice(0, 8));
                } else {
                    const fallback = PRODUCTS.filter(p => p.id !== dbProduct.id && !filtered.some(f => f.id === p.id));
                    setRelatedProducts([...filtered, ...(fallback as unknown as DBProduct[])].slice(0, 8));
                }
            } else {
                // Product is hidden or does not exist
                setProduct(null);
            }
            setLoading(false);
        }).catch(() => {
            if (!staticProduct) setLoading(false);
        });
    }, [slug]);

    // ── Smart Variant System (Bouquets & Cakes only) ──
    const variantConfig = useMemo<{
        title: string;
        options: { label: string; multiplier?: number; fixedPrice?: number }[];
    } | null>(() => {
        if (!product) return null;

        // 1. Custom variants defined by staff (e.g. from staff product edit modal)
        const customVariants = (product as any).variants as { label: string; price: number }[] | undefined;
        if (customVariants && Array.isArray(customVariants) && customVariants.length > 0) {
            const valid = customVariants.filter(v => v.label && v.label.trim());
            if (valid.length > 0) {
                const name = product.name.toLowerCase();
                const col = (product.collection_slug || '').toLowerCase();
                // Check exclusions first — crowns, garlands, etc. never get flower count labels
                const isExcluded = name.includes('crown') || name.includes('tiara') || name.includes('garland') ||
                    name.includes('box') || name.includes('vase') || name.includes('basket') || name.includes('hamper') ||
                    name.includes('mug') || name.includes('bottle') || name.includes('frame') || name.includes('candle') ||
                    name.includes('plant') || name.includes('pot');
                let title = 'Select Option';
                if (col === 'cake' || name.includes('cake')) title = 'Select Weight';
                else if (isExcluded) title = 'Select Option';
                else if (name.includes('teddy') || col === 'teddy-and-bouquet') title = 'Number of Teddies';
                else if (name.includes('kinder') || name.includes('kinderjoy')) title = 'Number of Kinder Joys';
                else if (name.includes('chocolate') || col === 'chocolate-bouquet') title = 'Number of Chocolates';
                else if (name.includes('orchid')) title = 'Number of Orchids';
                else if (name.includes('lily') || name.includes('lilies')) title = 'Number of Lilies';
                else if (name.includes('carnation')) title = 'Number of Carnations';
                else if (name.includes('rose')) title = 'Number of Roses';
                else if (name.includes('bouquet') || col.includes('bouquet')) title = 'Number of Flowers';

                return {
                    title,
                    options: valid.map(v => ({
                        label: v.label,
                        fixedPrice: Number(v.price) > 0 ? Number(v.price) : undefined,
                        multiplier: 1.0,
                    })),
                };
            }
        }

        const name = product.name.toLowerCase();
        const col = (product.collection_slug || '').toLowerCase();
        const colName = (product.collection_name || '').toLowerCase();

        // 2. Cakes: Select Weight
        if (col === 'cake' || name.includes('cake')) {
            return {
                title: 'Select Weight',
                options: [
                    { label: '0.5 kg', multiplier: 1.0 },
                    { label: '1 kg', multiplier: 1.8 },
                    { label: '1.5 kg', multiplier: 2.6 },
                    { label: '2 kg', multiplier: 3.4 },
                ],
            };
        }

        // 3. Strict non-bouquet exclusions: Crowns, Garlands, Boxes, Vases, Baskets, Hampers, etc. NEVER get flower counts
        const isExcludedNonBouquet =
            name.includes('crown') ||
            name.includes('tiara') ||
            name.includes('garland') ||
            name.includes('box') ||
            name.includes('vase') ||
            name.includes('basket') ||
            name.includes('hamper') ||
            name.includes('mug') ||
            name.includes('bottle') ||
            name.includes('frame') ||
            name.includes('candle') ||
            name.includes('plant') ||
            name.includes('pot') ||
            col === 'plants' ||
            col === 'hamper' ||
            col === 'personalized' ||
            col === 'decorations';

        if (isExcludedNonBouquet) {
            return null; // NO quantity options on crowns, boxes, hampers, gifts, decor
        }

        // 4. Bouquets only: must be an actual bouquet
        const isBouquet =
            name.includes('bouquet') ||
            col === 'chocolate-bouquet' ||
            col === 'teddy-and-bouquet' ||
            (col.includes('bouquet') && !isExcludedNonBouquet);

        if (!isBouquet) {
            return null; // NOT a bouquet -> NO quantity/flower count
        }

        // 4a. Teddy Bouquet
        if (name.includes('teddy') || col === 'teddy-and-bouquet') {
            return {
                title: 'Number of Teddies',
                options: [
                    { label: '2 Teddies', multiplier: 1.0 },
                    { label: '4 Teddies', multiplier: 1.45 },
                    { label: '6 Teddies', multiplier: 1.85 },
                    { label: '8 Teddies', multiplier: 2.35 },
                ],
            };
        }

        // 4b. Kinder Joy Bouquet
        if (name.includes('kinder') || name.includes('kinderjoy')) {
            return {
                title: 'Number of Kinder Joys',
                options: [
                    { label: '4 Kinder Joys', multiplier: 1.0 },
                    { label: '6 Kinder Joys', multiplier: 1.45 },
                    { label: '8 Kinder Joys', multiplier: 1.85 },
                    { label: '12 Kinder Joys', multiplier: 2.55 },
                ],
            };
        }

        // 4c. Chocolate Bouquet
        if (
            name.includes('chocolate') ||
            col === 'chocolate-bouquet' ||
            name.includes('ferrero') ||
            name.includes('kitkat') ||
            name.includes('cadbury') ||
            name.includes('dairy milk')
        ) {
            return {
                title: 'Number of Chocolates',
                options: [
                    { label: '6 Chocolates', multiplier: 1.0 },
                    { label: '10 Chocolates', multiplier: 1.45 },
                    { label: '15 Chocolates', multiplier: 1.95 },
                    { label: '20 Chocolates', multiplier: 2.55 },
                ],
            };
        }

        // 4d. Multi-flower Bouquet (2 or more flowers mentioned, e.g. Rose and Lily, Orchid and Carnation, Mixed)
        const flowerList = ['rose', 'lily', 'lilies', 'orchid', 'carnation', 'gerbera', 'sunflower', 'tulip', 'gypsophila', 'baby\'s breath', 'daisy', 'hydrangea', 'anthurium'];
        const matchedFlowers = flowerList.filter(f => name.includes(f));
        const isMultiFlower = matchedFlowers.length >= 2 || name.includes('mixed') || name.includes('assorted') || name.includes('rainbow') || name.includes('colorful');

        if (isMultiFlower) {
            return {
                title: 'Number of Flowers',
                options: [
                    { label: '6 Flowers', multiplier: 1.0 },
                    { label: '10 Flowers', multiplier: 1.45 },
                    { label: '15 Flowers', multiplier: 1.85 },
                    { label: '20 Flowers', multiplier: 2.55 },
                ],
            };
        }

        // 4e. Single flower type bouquets:
        if (name.includes('rose')) {
            return {
                title: 'Number of Roses',
                options: [
                    { label: '6 Roses', multiplier: 1.0 },
                    { label: '9 Roses', multiplier: 1.45 },
                    { label: '12 Roses', multiplier: 1.85 },
                    { label: '18 Roses', multiplier: 2.55 },
                ],
            };
        }

        if (name.includes('orchid')) {
            return {
                title: 'Number of Orchids',
                options: [
                    { label: '6 Orchids', multiplier: 1.0 },
                    { label: '10 Orchids', multiplier: 1.45 },
                    { label: '15 Orchids', multiplier: 1.85 },
                    { label: '20 Orchids', multiplier: 2.55 },
                ],
            };
        }

        if (name.includes('lily') || name.includes('lilies')) {
            return {
                title: 'Number of Lilies',
                options: [
                    { label: '4 Lilies', multiplier: 1.0 },
                    { label: '6 Lilies', multiplier: 1.45 },
                    { label: '8 Lilies', multiplier: 1.85 },
                    { label: '12 Lilies', multiplier: 2.55 },
                ],
            };
        }

        if (name.includes('carnation')) {
            return {
                title: 'Number of Carnations',
                options: [
                    { label: '8 Carnations', multiplier: 1.0 },
                    { label: '12 Carnations', multiplier: 1.45 },
                    { label: '16 Carnations', multiplier: 1.85 },
                    { label: '24 Carnations', multiplier: 2.55 },
                ],
            };
        }

        // 4f. General bouquet fallback
        return {
            title: 'Number of Flowers',
            options: [
                { label: '6 Flowers', multiplier: 1.0 },
                { label: '10 Flowers', multiplier: 1.45 },
                { label: '15 Flowers', multiplier: 1.85 },
                { label: '20 Flowers', multiplier: 2.55 },
            ],
        };
    }, [product]);

    // Keep selectedVariant in sync with available options
    useEffect(() => {
        if (variantConfig && variantConfig.options.length > 0) {
            setSelectedVariant(prev => {
                if (variantConfig.options.some(o => o.label === prev)) return prev;
                return variantConfig.options[0].label;
            });
        } else {
            setSelectedVariant('');
        }
    }, [variantConfig]);

    // Build WhatsApp link
    useEffect(() => {
        if (!product) return;
        const productUrl = `https://www.newecoroses.com/product/${product.slug}`;
        fetchWhatsappSettings().then(s => {
            const phone = s?.phone_number ?? FALLBACK_PHONE;
            const variantNote = variantConfig && selectedVariant ? ` (${selectedVariant})` : '';
            const msg = `Hi, I'm interested in ${product.name}${variantNote}. Is it available for delivery today?\n\nProduct: ${productUrl}`;
            setWhatsappLink(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
        }).catch(() => {
            const variantNote = variantConfig && selectedVariant ? ` (${selectedVariant})` : '';
            const msg = `Hi, I'm interested in ${product.name}${variantNote}. Is it available for delivery today?\n\nProduct: ${productUrl}`;
            setWhatsappLink(`https://wa.me/${FALLBACK_PHONE}?text=${encodeURIComponent(msg)}`);
        });
    }, [product, selectedVariant, variantConfig]);

    if (loading) {
        return (
            <div className="pt-[72px] sm:pt-[76px] lg:pt-[82px] pb-14 bg-[#faf8f5] min-h-screen animate-pulse">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="h-3 w-12 bg-gray-200 rounded" />
                        <div className="h-3 w-2 bg-gray-200 rounded" />
                        <div className="h-3 w-20 bg-gray-200 rounded" />
                        <div className="h-3 w-2 bg-gray-200 rounded" />
                        <div className="h-3 w-40 bg-gray-200 rounded" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        <div className="lg:col-span-7 flex gap-4">
                            <div className="hidden sm:flex flex-col gap-3 w-20">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="aspect-square w-full rounded-xl bg-gray-200" />
                                ))}
                            </div>
                            <div className="aspect-[4/5] flex-1 rounded-3xl bg-gray-200" />
                        </div>
                        <div className="lg:col-span-5 flex flex-col gap-5 pt-2">
                            <div className="h-4 w-28 bg-gray-200 rounded" />
                            <div className="h-10 w-3/4 bg-gray-200 rounded" />
                            <div className="h-8 w-1/2 bg-gray-200 rounded" />
                            <div className="h-12 w-full bg-gray-200 rounded-xl" />
                            <div className="h-12 w-32 bg-gray-200 rounded-full" />
                            <div className="flex gap-4">
                                <div className="h-12 flex-1 bg-gray-200 rounded-full" />
                                <div className="h-12 flex-1 bg-gray-200 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pt-32 pb-20 min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center text-center px-6">
                <h1 style={FONT_CORMORANT} className="font-cormorant text-3xl sm:text-4xl text-[#1c1917] mb-4">Product Not Found</h1>
                <p style={FONT_DM_SANS} className="font-dm-sans text-gray-500 mb-8 font-normal">The floral arrangement you&apos;re looking for doesn&apos;t exist or has been archived.</p>
                <Link href="/shop" style={FONT_DM_SANS} className="font-dm-sans font-medium inline-flex items-center gap-2 bg-[#2d3a27] text-white px-8 py-3.5 rounded-full text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-sm">
                    <ArrowLeft size={14} /> Browse All Flowers
                </Link>
            </div>
        );
    }

    const allImages = product.images?.length > 0 ? product.images : [product.image_url];
    const images = allImages.filter(img => !img.startsWith('HIDDEN::'));

    const { hasPrice, price: rawPrice, originalPrice: rawOriginalPrice, discountPercent, rating, reviewCount } = getProductPriceInfo(product);

    // Calculate dynamic price based on selected variant (if any)
    const activeOption = variantConfig?.options.find(o => o.label === selectedVariant);
    const activeMultiplier = activeOption?.multiplier ?? 1.0;
    const price = activeOption?.fixedPrice !== undefined && activeOption.fixedPrice > 0
        ? activeOption.fixedPrice
        : (variantConfig ? Math.round(rawPrice * activeMultiplier) : rawPrice);

    const originalPrice = rawOriginalPrice > rawPrice 
        ? (variantConfig ? Math.round(rawOriginalPrice * activeMultiplier) : rawOriginalPrice)
        : Math.round(price * 1.25);

    const displaySuggestions = relatedProducts.length > 0
        ? relatedProducts
        : (initialSuggestions.length > 0 ? initialSuggestions : (PRODUCTS.filter(p => p.id !== product.id).slice(0, 8) as unknown as DBProduct[]));

    // Product tag badge (Bestseller, New Arrival, etc.)
    const tagInfo = (() => {
        if (!product?.tag || product.tag === 'Standard') return null;
        const lower = product.tag.toLowerCase();
        if (lower.includes('best') || lower.includes('bestseller')) return { label: 'Bestseller', bg: 'bg-[#581c87] text-white' };
        if (lower.includes('new')) return { label: 'New Arrival', bg: 'bg-[#1d4ed8] text-white' };
        if (lower.includes('trend')) return { label: 'Trending', bg: 'bg-amber-600 text-white' };
        if (lower.includes('feature')) return { label: 'Featured', bg: 'bg-purple-700 text-white' };
        if (lower.includes('sale')) return { label: 'Sale', bg: 'bg-rose-600 text-white' };
        if (lower.includes('limit')) return { label: 'Limited Edition', bg: 'bg-emerald-700 text-white' };
        if (lower.includes('luxe') || lower.includes('luxury')) return { label: 'LUXE', bg: 'bg-[#18181b] text-white' };
        if (lower.includes('season')) return { label: 'Seasonal', bg: 'bg-[#047857] text-white' };
        return { label: product.tag, bg: 'bg-[#2d3a27] text-white' };
    })();

    // Calculate exact quantity of this specific product / variant currently in the cart
    const hasActiveVariant = Boolean(variantConfig && selectedVariant);
    const variantItemId = hasActiveVariant ? `${product.id}-${selectedVariant}` : product.id;
    const cartItem = items.find(i => i.id === variantItemId || (!hasActiveVariant && (i.slug === product.slug || i.id === product.id)));
    const currentCartQty = cartItem ? cartItem.quantity : 0;

    const handleAddToCart = () => {
        const itemName = hasActiveVariant ? `${product.name} (${selectedVariant})` : product.name;
        addItem({
            id: variantItemId,
            name: itemName,
            slug: product.slug,
            image_url: product.image_url,
            price: price,
        });
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
    };

    const handleAddSuggestedToCart = (item: DBProduct) => {
        const itemPricing = getProductPriceInfo(item);
        addItem({
            id: item.id,
            name: item.name,
            slug: item.slug,
            image_url: item.image_url,
            price: itemPricing.hasPrice ? itemPricing.price : 549,
        });
        setAddedSuggestedId(item.id);
        setTimeout(() => setAddedSuggestedId(null), 1500);
    };

    const handleBuyNow = () => {
        if (!product) return;
        const itemName = hasActiveVariant ? `${product.name} (${selectedVariant})` : product.name;
        openAddonModal({
            id: variantItemId,
            name: itemName,
            slug: product.slug,
            image_url: product.image_url,
            price: price,
        });
    };

    return (
        <div className="pt-[72px] sm:pt-[76px] lg:pt-[82px] pb-16 bg-[#faf8f5] min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* ── 1. Navigation: Breadcrumb Bar (DM Sans) ── */}
                <nav style={FONT_DM_SANS} className="font-dm-sans flex items-center gap-2 text-xs text-gray-500 mb-6 font-normal overflow-x-auto whitespace-nowrap py-1">
                    <Link href="/" className="hover:text-black transition-colors">Home</Link>
                    <span>/</span>
                    <Link href={`/shop?cat=${product.collection_slug}`} className="hover:text-black transition-colors capitalize">
                        {product.collection_name || 'Bouquets'}
                    </Link>
                    <span>/</span>
                    <span className="text-[#1c1917] font-medium truncate">{product.name}</span>
                </nav>

                {/* ── 2. Main Two-Column Showcase (Matches Inspiration) ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    
                    {/* ══ LEFT: Vertical Thumbnail Strip + Main Image Showcase (7 Cols) ══ */}
                    <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 items-start">
                        
                        {/* Vertical Thumbnail Strip */}
                        {images.length > 1 && (
                            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[560px] w-full sm:w-20 flex-shrink-0 no-scrollbar pb-1 sm:pb-0">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setSelectedImage(i)}
                                        className={`relative aspect-square w-16 sm:w-full rounded-2xl overflow-hidden transition-all duration-200 flex-shrink-0 cursor-pointer ${
                                            selectedImage === i
                                                ? 'border-2 border-[#1c1917] shadow-sm ring-1 ring-black/10'
                                                : 'border border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100 bg-white'
                                        }`}
                                    >
                                        <Image 
                                            src={img} 
                                            alt={`${product.name} thumbnail ${i + 1}`} 
                                            fill 
                                            className="object-cover" 
                                            sizes="80px"
                                            unoptimized
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* 
                          * Main Showcase Image: 
                          * Exactly 4:5 aspect ratio (`aspect-[4/5]`)
                          * Fills the left column generously (`flex-1 w-full`)
                          * with luxury rounded corners and high-res presentation matching inspiration.
                          */}
                        <div className="relative flex-1 w-full aspect-[4/5] rounded-[24px] sm:rounded-[32px] overflow-hidden bg-white border border-[#ece6de] shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center justify-center group">
                            <Image
                                src={imgError ? '/images/placeholder.webp' : (images[selectedImage] || product.image_url || '/images/placeholder.webp')}
                                onError={() => setImgError(true)}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 1024px) 100vw, 55vw"
                                priority
                                unoptimized
                            />

                            {/* Lightbox Maximize Icon */}
                            <button
                                type="button"
                                onClick={() => setIsImageModalOpen(true)}
                                className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-gray-200/80 text-gray-700 hover:text-black hover:bg-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
                                aria-label="Expand image"
                            >
                                <Maximize2 size={15} />
                            </button>
                        </div>
                    </div>

                    {/* ══ RIGHT: Product Details Panel (5 Cols) ══ */}
                    <div className="lg:col-span-5 flex flex-col justify-start">
                        
                        {/* Category Eyebrow & Wishlist Row */}
                        <div className="flex items-center justify-between mb-2">
                            <span 
                                style={FONT_DM_SANS} 
                                className="font-dm-sans text-xs uppercase tracking-[0.22em] font-medium text-[#8a8077]"
                            >
                                {product.collection_name ? product.collection_name.toUpperCase() : 'FRESH FLOWER'}
                            </span>

                            {/* Circular Wishlist Button */}
                            <button
                                type="button"
                                onClick={toggleWishlist}
                                className="w-10 h-10 rounded-full border border-gray-200/90 hover:border-gray-400 bg-white flex items-center justify-center transition-all cursor-pointer shadow-2xs group flex-shrink-0"
                                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                                title="Save to wishlist"
                            >
                                <Heart
                                    size={18}
                                    className={`transition-colors ${
                                        isWishlisted
                                            ? 'text-rose-500 fill-rose-500'
                                            : 'text-gray-500 group-hover:text-black stroke-[1.8]'
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Product Title: Cormorant Garamond */}
                        <h1 
                            style={FONT_CORMORANT} 
                            className="font-cormorant text-3xl sm:text-4xl lg:text-[44px] font-normal text-[#1c1917] leading-[1.15] tracking-tight mb-2"
                        >
                            {product.name}
                        </h1>

                        {/* Product Tag Badge */}
                        {tagInfo && (
                            <div className="mb-3">
                                <span
                                    style={FONT_DM_SANS}
                                    className={`font-dm-sans inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider select-none ${tagInfo.bg}`}
                                >
                                    {tagInfo.label}
                                </span>
                            </div>
                        )}

                        {/* Prices & Badges Row: DM Sans (Free delivery aligned with discount box) */}
                        <div style={FONT_DM_SANS} className="font-dm-sans flex items-center gap-2.5 sm:gap-3 mb-5 flex-wrap">
                            {hasPrice ? (
                                <>
                                    <span style={FONT_DM_SANS} className="font-dm-sans text-3xl sm:text-4xl font-semibold text-[#1c1917] tracking-tight">
                                        ₹{price}
                                    </span>
                                    {originalPrice > price && (
                                        <span style={FONT_DM_SANS} className="font-dm-sans text-base sm:text-lg text-gray-400 line-through font-normal">
                                            ₹{originalPrice}
                                        </span>
                                    )}
                                    {discountPercent > 0 && (
                                        <span style={FONT_DM_SANS} className="font-dm-sans text-xs font-semibold text-[#8a4a36] bg-[#fbece7] border border-[#f5d5cc] px-2.5 py-0.5 rounded-md leading-normal select-none">
                                            {discountPercent}% OFF
                                        </span>
                                    )}
                                    <FreeDeliveryPillButton onClick={() => setIsDeliveryModalOpen(true)} />
                                </>
                            ) : (
                                <div style={FONT_DM_SANS} className="font-dm-sans flex items-center gap-2.5 flex-wrap">
                                    <span className="text-2xl font-semibold text-[#1c1917]">Price on Request</span>
                                    <span className="text-xs text-gray-500 bg-white border border-gray-200 px-2.5 py-1 rounded-md">
                                        Contact florist for latest batch
                                    </span>
                                    <FreeDeliveryPillButton onClick={() => setIsDeliveryModalOpen(true)} />
                                </div>
                            )}
                        </div>

                        {/* Navigation: Deliver to Pincode Bar (DM Sans) */}
                        <div className="border-t border-gray-200/70 pt-4 mb-5">
                            <button
                                type="button"
                                onClick={() => setIsDeliveryModalOpen(true)}
                                style={FONT_DM_SANS}
                                className="font-dm-sans w-full flex items-center justify-between py-2.5 px-4 rounded-xl border border-gray-200/80 bg-white/70 hover:bg-white transition-all text-left shadow-2xs group cursor-pointer"
                            >
                                <div className="flex items-center gap-2.5">
                                    <MapPin size={16} className="text-gray-600 group-hover:text-black transition-colors" />
                                    <span style={FONT_DM_SANS} className="font-dm-sans text-xs sm:text-sm text-gray-600 font-normal">
                                        Deliver to <strong className="font-semibold text-[#1c1917]">{deliveryLoc}</strong>
                                    </span>
                                </div>
                                <ChevronRight size={15} className="text-gray-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                            </button>
                        </div>

                        {/* ── Dynamic Variant / Quantity Selector: ONLY shown for bouquets and cakes ── */}
                        {variantConfig && variantConfig.options.length > 0 && (
                            <div className="mb-5">
                                <span style={FONT_DM_SANS} className="font-dm-sans text-xs sm:text-[13px] font-semibold text-[#1c1917] mb-2.5 block">
                                    {variantConfig.title}
                                </span>
                                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                                    {variantConfig.options.map((opt) => {
                                        const isSelected = selectedVariant === opt.label;
                                        return (
                                            <button
                                                key={opt.label}
                                                type="button"
                                                onClick={() => setSelectedVariant(opt.label)}
                                                style={FONT_DM_SANS}
                                                className={`font-dm-sans text-xs sm:text-sm py-2 px-4 sm:px-5 rounded-full transition-all cursor-pointer select-none ${
                                                    isSelected
                                                        ? 'bg-[#fbf3e4] border border-[#e8c688] text-[#1c1917] font-semibold shadow-2xs'
                                                        : 'bg-white/80 border border-gray-200 text-gray-700 hover:border-gray-400 font-normal'
                                                }`}
                                            >
                                                {opt.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Buttons: DM Sans Medium (Add to Cart transforms into +/- in-cart quantity controller) */}
                        {hasPrice ? (
                            <div className="space-y-2 mb-3 mt-1">
                                <div className="flex items-center gap-3">
                                    {/* Add to Cart / Interactive In-Cart Quantity Button */}
                                    {currentCartQty === 0 ? (
                                        <button
                                            type="button"
                                            onClick={handleAddToCart}
                                            style={FONT_DM_SANS}
                                            className="font-dm-sans font-medium flex-1 bg-[#2d3a27] hover:bg-[#222c1e] text-white h-[48px] px-6 rounded-full text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all duration-300 cursor-pointer active:scale-[0.99]"
                                        >
                                            <ShoppingCart size={16} />
                                            <span>Add to Cart</span>
                                        </button>
                                    ) : (
                                        <div 
                                            style={FONT_DM_SANS} 
                                            className="font-dm-sans font-medium flex-1 h-[48px] bg-[#2d3a27] text-white rounded-full px-3 flex items-center justify-between shadow-sm transition-all select-none"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const targetId = cartItem?.id || variantItemId;
                                                    if (currentCartQty <= 1) {
                                                        removeItem(targetId);
                                                    } else {
                                                        updateQuantity(targetId, currentCartQty - 1);
                                                    }
                                                }}
                                                className="w-8 h-8 rounded-full hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer"
                                                aria-label="Decrease quantity in cart"
                                            >
                                                <Minus size={15} />
                                            </button>

                                            <div className="flex items-center gap-1.5 px-1">
                                                <span className="text-sm font-semibold">{currentCartQty}</span>
                                                <span className="text-[11px] text-white/80 font-normal">in cart</span>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const targetId = cartItem?.id || variantItemId;
                                                    updateQuantity(targetId, currentCartQty + 1);
                                                }}
                                                className="w-8 h-8 rounded-full hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer"
                                                aria-label="Increase quantity in cart"
                                            >
                                                <Plus size={15} />
                                            </button>
                                        </div>
                                    )}

                                    {/* Buy Now: DM Sans Medium */}
                                    <button
                                        type="button"
                                        onClick={handleBuyNow}
                                        style={FONT_DM_SANS}
                                        className="font-dm-sans font-medium flex-1 bg-white hover:bg-black/[0.04] text-[#1c1917] border border-[#2d3a27] h-[48px] px-6 rounded-full text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer active:scale-[0.99]"
                                    >
                                        <span style={FONT_DM_SANS} className="font-dm-sans font-medium">Buy Now</span>
                                    </button>
                                </div>

                                {/* WhatsApp Concierge Enquiry: DM Sans */}
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => trackEnquiry(product.id, product.name)}
                                    style={FONT_DM_SANS}
                                    className="font-dm-sans font-medium w-full flex items-center justify-center gap-1.5 py-1 text-[11px] sm:text-xs text-gray-500 hover:text-gray-800 transition-colors"
                                >
                                    <WhatsappIcon size={13} className="text-[#25D366]" />
                                    <span style={FONT_DM_SANS}>Have a special request? Ask our florist on WhatsApp</span>
                                </a>
                            </div>
                        ) : (
                            <div className="space-y-2 mb-2.5">
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => trackEnquiry(product.id, product.name)}
                                    style={FONT_DM_SANS}
                                    className="font-dm-sans font-medium w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#2d3a27] hover:bg-[#222c1e] text-white text-xs sm:text-sm tracking-wide shadow-sm hover:shadow transition-all"
                                >
                                    <WhatsappIcon size={18} className="text-[#25D366]" />
                                    <span style={FONT_DM_SANS} className="font-dm-sans font-medium">Enquire Price &amp; Availability</span>
                                </a>
                            </div>
                        )}

                        {/* Trust Badges Strip: DM Sans (Shifted upwards with reduced space) */}
                        <div style={FONT_DM_SANS} className="font-dm-sans grid grid-cols-3 divide-x divide-gray-200/90 pt-2 pb-2 border-t border-b border-gray-200/60 text-center">
                            <div className="flex flex-col items-center gap-1 px-1">
                                <Leaf size={15} className="text-gray-700 stroke-[1.5]" />
                                <span style={FONT_DM_SANS} className="font-dm-sans text-[10px] sm:text-[11px] font-medium text-gray-700">Fresh Flowers</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 px-1">
                                <AnimatedDeliveryScooter className="w-5.5 h-4" color="#374151" boxColor="#15803d" />
                                <span style={FONT_DM_SANS} className="font-dm-sans text-[10px] sm:text-[11px] font-medium text-gray-700">Same-Day Delivery</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 px-1">
                                <Gift size={15} className="text-gray-700 stroke-[1.5]" />
                                <span style={FONT_DM_SANS} className="font-dm-sans text-[10px] sm:text-[11px] font-medium text-gray-700">Premium Packaging</span>
                            </div>
                        </div>

                        {/* Immediate Suggested Products In-Panel Preview (Aligned perfectly with bottom of main image) */}
                        <div className="pt-2">
                            <div className="flex items-center justify-between mb-1.5">
                                <span style={FONT_DM_SANS} className="font-dm-sans text-xs font-semibold text-[#1c1917] tracking-tight">
                                    Suggested Products
                                </span>
                                <a 
                                    href="#suggested-products" 
                                    style={FONT_DM_SANS} 
                                    className="font-dm-sans text-[11px] font-medium text-[#2d3a27] hover:underline flex items-center gap-1"
                                >
                                    <span>View all ({displaySuggestions.length})</span>
                                    <span>&darr;</span>
                                </a>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {displaySuggestions.slice(0, 3).map((item) => {
                                    const isAdded = addedSuggestedId === item.id;
                                    const itemCartCount = items.filter(i => i.slug === item.slug || i.id.startsWith(item.id)).reduce((s, i) => s + i.quantity, 0);

                                    return (
                                        <div
                                            key={item.id}
                                            className="group relative block rounded-xl overflow-hidden border border-gray-200/80 hover:border-[#2d3a27] transition-all bg-white p-1 shadow-2xs hover:shadow-xs text-center"
                                        >
                                            <Link href={`/product/${item.slug}`} className="block">
                                                <div className="relative aspect-[4/5] w-full rounded-lg overflow-hidden mb-1 bg-[#faf7f2]">
                                                    <Image
                                                        src={item.image_url}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                        sizes="90px"
                                                        unoptimized
                                                    />

                                                    {/* In-cart count indicator badge on thumbnail */}
                                                    {itemCartCount > 0 && (
                                                        <span className="absolute top-1 left-1 z-10 text-[9px] font-bold bg-[#2d3a27] text-white w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                                                            {itemCartCount}
                                                        </span>
                                                    )}
                                                </div>
                                                <p style={FONT_CORMORANT} className="font-cormorant text-xs font-semibold text-[#1c1917] truncate leading-tight px-0.5">
                                                    {item.name}
                                                </p>
                                            </Link>

                                            {/* Plus button to add directly to cart (Hover on desktop, always visible on mobile) */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleAddSuggestedToCart(item);
                                                }}
                                                className={`absolute bottom-5 right-2 z-20 w-6 h-6 rounded-full flex items-center justify-center shadow-sm transition-all duration-200 cursor-pointer ${
                                                    isAdded
                                                        ? 'bg-emerald-600 text-white scale-110'
                                                        : 'bg-[#2d3a27] hover:bg-black text-white opacity-90 sm:opacity-0 sm:group-hover:opacity-100 active:scale-95'
                                                }`}
                                                title={`Add ${item.name} to cart`}
                                                aria-label={`Add ${item.name} to cart`}
                                            >
                                                {isAdded ? (
                                                    <Check size={11} className="stroke-[2.5]" />
                                                ) : (
                                                    <Plus size={12} className="stroke-[2.5]" />
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── 4. Suggested Products (You May Also Like) ── */}
                {displaySuggestions.length > 0 && (
                    <section id="suggested-products" className="mt-10 sm:mt-14 pt-8 border-t border-gray-200/80">
                        <div className="flex items-baseline justify-between mb-6">
                            <div>
                                <span style={FONT_DM_SANS} className="font-dm-sans text-[11px] uppercase tracking-[0.2em] font-semibold text-[#8a8077] block mb-1">
                                    CURATED FOR YOU
                                </span>
                                <h2 style={FONT_CORMORANT} className="font-cormorant text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1c1917] tracking-tight">
                                    Suggested Products
                                </h2>
                            </div>
                            <Link 
                                href="/shop" 
                                style={FONT_DM_SANS} 
                                className="font-dm-sans text-xs font-semibold text-[#1c1917] hover:text-gray-600 transition-colors"
                            >
                                Browse All &rarr;
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
                            {displaySuggestions.map((p, idx) => (
                                <ProductCard
                                    key={p.id}
                                    product={p as unknown as { id: string; name: string; image_url: string; slug: string; stock: number; image_scale?: number; tag?: string }}
                                    index={idx}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* ── 3. Tabs Section: About, Details, Reviews (Navigation: DM Sans, Descriptions: DM Sans) ── */}
                <div className="mt-12 sm:mt-16 pt-10 border-t border-gray-200/80">
                    
                    {/* Navigation: Tab Nav (DM Sans) */}
                    <div style={FONT_DM_SANS} className="font-dm-sans flex items-center gap-8 border-b border-gray-200/90">
                        <button
                            type="button"
                            onClick={() => setActiveTab('about')}
                            style={FONT_DM_SANS}
                            className={`font-dm-sans pb-3 text-sm sm:text-base transition-all relative cursor-pointer ${
                                activeTab === 'about'
                                    ? 'text-[#1c1917] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#2d3a27]'
                                    : 'text-gray-400 hover:text-gray-700 font-medium'
                            }`}
                        >
                            About
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('details')}
                            style={FONT_DM_SANS}
                            className={`font-dm-sans pb-3 text-sm sm:text-base transition-all relative cursor-pointer ${
                                activeTab === 'details'
                                    ? 'text-[#1c1917] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#2d3a27]'
                                    : 'text-gray-400 hover:text-gray-700 font-medium'
                            }`}
                        >
                            Details
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('reviews')}
                            style={FONT_DM_SANS}
                            className={`font-dm-sans pb-3 text-sm sm:text-base transition-all relative cursor-pointer ${
                                activeTab === 'reviews'
                                    ? 'text-[#1c1917] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#2d3a27]'
                                    : 'text-gray-400 hover:text-gray-700 font-medium'
                            }`}
                        >
                            Reviews ({reviewCount || 144})
                        </button>
                    </div>

                    {/* Product descriptions: DM Sans */}
                    <div style={FONT_DM_SANS} className="font-dm-sans py-6">
                        {activeTab === 'about' && (
                            <div style={FONT_DM_SANS} className="font-dm-sans text-sm sm:text-base text-gray-700 leading-relaxed font-normal max-w-3xl space-y-3">
                                <p>
                                    {product.description ||
                                        "A beautiful arrangement of blush pink roses complemented by delicate baby's breath."}
                                </p>
                                <p className="font-dm-sans text-xs sm:text-sm text-gray-500 font-normal">
                                    Handcrafted daily by master florists at our Kolkata floral studio using the freshest morning harvests. Delivered in signature gift presentation with personalized greeting note card.
                                </p>
                            </div>
                        )}

                        {activeTab === 'details' && (
                            <div style={FONT_DM_SANS} className="font-dm-sans max-w-3xl space-y-4 text-xs sm:text-sm text-gray-700">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs">
                                        <span style={FONT_DM_SANS} className="font-dm-sans font-semibold block text-[#1c1917] mb-1">Flower Care Tips</span>
                                        <p style={FONT_DM_SANS} className="font-dm-sans text-gray-600 text-xs leading-relaxed font-normal">
                                            Trim stems at a 45° angle before placing in a clean vase filled with fresh water. Keep away from direct sunlight, air conditioners, and fruit bowls. Refresh water every 2 days.
                                        </p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs">
                                        <span style={FONT_DM_SANS} className="font-dm-sans font-semibold block text-[#1c1917] mb-1">Vase Life &amp; Freshness</span>
                                        <p style={FONT_DM_SANS} className="font-dm-sans text-gray-600 text-xs leading-relaxed font-normal">
                                            Guaranteed fresh for 5–7 days with proper hydration. Direct cold-chain air cargo from premier rose gardens ensures pristine petal texture and vibrant scent.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div style={FONT_DM_SANS} className="font-dm-sans max-w-3xl space-y-4">
                                <div className="flex items-center gap-5 p-5 rounded-2xl bg-white border border-gray-100 shadow-2xs">
                                    <div className="text-center">
                                        <span style={FONT_DM_SANS} className="font-dm-sans text-4xl font-semibold text-[#1c1917]">
                                            {rating || '4.9'}
                                        </span>
                                        <div className="flex items-center justify-center gap-0.5 mt-1.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={13} className="text-amber-500 fill-amber-500" />
                                            ))}
                                        </div>
                                        <span style={FONT_DM_SANS} className="font-dm-sans text-[11px] text-gray-400 mt-1 block font-medium">
                                            {reviewCount || 144} verified ratings
                                        </span>
                                    </div>
                                    <div className="h-12 w-px bg-gray-200" />
                                    <p style={FONT_DM_SANS} className="font-dm-sans text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                                        &ldquo;The flowers arrived exactly as pictured—fresh, fragrant, and exquisitely wrapped. The recipient was absolutely thrilled with the presentation!&rdquo;
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Lightbox Preview Modal */}
            <AnimatePresence>
                {isImageModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setIsImageModalOpen(false)}
                    >
                        <button
                            type="button"
                            onClick={() => setIsImageModalOpen(false)}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/40 flex items-center justify-center transition-all cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                        <div className="relative max-w-3xl max-h-[85vh] w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            <Image
                                src={imgError ? '/images/placeholder.webp' : (images[selectedImage] || product.image_url || '/images/placeholder.webp')}
                                onError={() => setImgError(true)}
                                alt={product.name}
                                fill
                                className="object-contain"
                                sizes="90vw"
                                unoptimized
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Where to Deliver? Location Modal */}
            <DeliveryLocationModal
                isOpen={isDeliveryModalOpen}
                onClose={() => setIsDeliveryModalOpen(false)}
                onLocationSet={(locationName) => {
                    setDeliveryLoc(locationName);
                }}
            />

            {/* Hide floating WP icon when product has no price (inline Enquire button is already shown) */}
            {hasPrice && <WhatsAppFloat />}
        </div>
    );
}
