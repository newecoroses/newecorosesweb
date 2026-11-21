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
import { fetchProductBySlug, fetchProductsByCollection, fetchWhatsappSettings, DBProduct } from '@/lib/supabase';
import { getProductBySlug, getProductsByCollection } from '@/lib/products';
import { trackEnquiry } from '@/lib/analytics';
import { useCart } from '@/lib/cart-context';

const FALLBACK_PHONE = '919936911611';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const router = useRouter();
    const { slug } = use(params);
    const [selectedImage, setSelectedImage] = useState(0);
    const [product, setProduct] = useState<DBProduct | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<DBProduct[]>([]);
    const [whatsappLink, setWhatsappLink] = useState('');
    const [loading, setLoading] = useState(true);
    const [deliveryLoc, setDeliveryLoc] = useState('Kolkata, 700001');
    const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState('6 Roses');
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeTab, setActiveTab] = useState<'about' | 'details' | 'reviews'>('about');
    const [justAdded, setJustAdded] = useState(false);

    const { addItem, openDrawer, openAddonModal } = useCart();

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
            const related = getProductsByCollection(staticProduct.collectionSlug)
                .filter(p => p.id !== staticProduct.id)
                .slice(0, 4);
            setRelatedProducts(related as unknown as DBProduct[]);
            setLoading(false);
        }

        // 2. BACKGROUND: Silently upgrade with live Supabase data
        fetchProductBySlug(slug).then(async (dbProduct) => {
            if (dbProduct) {
                setProduct(dbProduct);
                const related = await fetchProductsByCollection(dbProduct.collection_slug).catch(() => []);
                setRelatedProducts(related.filter(p => p.id !== dbProduct.id).slice(0, 4));
            }
            if (!staticProduct) setLoading(false);
        }).catch(() => {
            if (!staticProduct) setLoading(false);
        });
    }, [slug]);

    // Build WhatsApp link
    useEffect(() => {
        if (!product) return;
        const productUrl = `https://www.newecoroses.com/product/${product.slug}`;
        fetchWhatsappSettings().then(s => {
            const phone = s?.phone_number ?? FALLBACK_PHONE;
            const msg = `Hi, I'm interested in ${product.name} (${selectedVariant}). Is it available for delivery today?\n\nProduct: ${productUrl}`;
            setWhatsappLink(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
        }).catch(() => {
            const msg = `Hi, I'm interested in ${product.name} (${selectedVariant}). Is it available for delivery today?\n\nProduct: ${productUrl}`;
            setWhatsappLink(`https://wa.me/${FALLBACK_PHONE}?text=${encodeURIComponent(msg)}`);
        });
    }, [product, selectedVariant]);

    // Variant options logic
    const isCake = useMemo(() => {
        if (!product) return false;
        return product.collection_slug === 'cake' || product.name.toLowerCase().includes('cake');
    }, [product]);

    const variantOptions = useMemo(() => {
        if (isCake) {
            return [
                { label: '0.5 kg', multiplier: 1.0 },
                { label: '1 kg', multiplier: 1.8 },
                { label: '1.5 kg', multiplier: 2.6 },
                { label: '2 kg', multiplier: 3.4 },
            ];
        }
        return [
            { label: '6 Roses', multiplier: 1.0 },
            { label: '9 Roses', multiplier: 1.45 },
            { label: '12 Roses', multiplier: 1.85 },
            { label: '18 Roses', multiplier: 2.55 },
        ];
    }, [isCake]);

    // Set initial default variant
    useEffect(() => {
        if (isCake) {
            setSelectedVariant('0.5 kg');
        } else {
            setSelectedVariant('6 Roses');
        }
    }, [isCake]);

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
                            <div className="aspect-[4/3] sm:aspect-square flex-1 rounded-3xl bg-gray-200" />
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
                <h1 className="font-cormorant text-3xl sm:text-4xl text-[#1c1917] mb-4">Product Not Found</h1>
                <p className="font-dm-sans text-gray-500 mb-8 font-normal">The floral arrangement you&apos;re looking for doesn&apos;t exist or has been archived.</p>
                <Link href="/shop" className="font-dm-sans font-medium inline-flex items-center gap-2 bg-[#2d3a27] text-white px-8 py-3.5 rounded-full text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-sm">
                    <ArrowLeft size={14} /> Browse All Flowers
                </Link>
            </div>
        );
    }

    const allImages = product.images?.length > 0 ? product.images : [product.image_url];
    const images = allImages.filter(img => !img.startsWith('HIDDEN::'));

    const { hasPrice, price: rawPrice, originalPrice: rawOriginalPrice, discountPercent, rating, reviewCount } = getProductPriceInfo(product);

    // Calculate dynamic price based on selected rose quantity
    const activeMultiplier = variantOptions.find(o => o.label === selectedVariant)?.multiplier || 1.0;
    const price = Math.round(rawPrice * activeMultiplier);
    const originalPrice = rawOriginalPrice > rawPrice 
        ? Math.round(rawOriginalPrice * activeMultiplier) 
        : Math.round(price * 1.25);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addItem({
                id: `${product.id}-${selectedVariant}`,
                name: `${product.name} (${selectedVariant})`,
                slug: product.slug,
                image_url: product.image_url,
                price: price,
            });
        }
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2500);
    };

    const handleBuyNow = () => {
        if (!product) return;
        openAddonModal({
            id: `${product.id}-${selectedVariant}`,
            name: `${product.name} (${selectedVariant})`,
            slug: product.slug,
            image_url: product.image_url,
            price: price,
        });
    };

    return (
        <div className="pt-[72px] sm:pt-[76px] lg:pt-[82px] pb-16 bg-[#faf8f5] min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* ── 1. Navigation: Breadcrumb Bar (DM Sans) ── */}
                <nav className="font-dm-sans flex items-center gap-2 text-xs text-gray-500 mb-6 font-normal overflow-x-auto whitespace-nowrap py-1">
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
                            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[540px] w-full sm:w-[84px] flex-shrink-0 no-scrollbar pb-1 sm:pb-0">
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
                                            sizes="84px"
                                            unoptimized
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main Showcase Image */}
                        <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-[24px] sm:rounded-[32px] overflow-hidden bg-white border border-[#ece6de] shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center justify-center group">
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
                        
                        {/* Title & Wishlist Row */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                            {/* Product Title: Cormorant Garamond */}
                            <h1 className="font-cormorant text-3xl sm:text-4xl lg:text-[44px] font-normal sm:font-medium text-[#1c1917] leading-[1.12] tracking-tight">
                                {product.name}
                            </h1>

                            {/* Circular Wishlist Button */}
                            <button
                                type="button"
                                onClick={toggleWishlist}
                                className="font-dm-sans w-10 h-10 rounded-full border border-gray-200/90 hover:border-gray-400 bg-white flex items-center justify-center transition-all cursor-pointer shadow-2xs group flex-shrink-0 mt-1"
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

                        {/* Prices: DM Sans */}
                        <div className="font-dm-sans flex items-baseline gap-3 mb-5">
                            {hasPrice ? (
                                <>
                                    <span className="font-dm-sans text-3xl sm:text-4xl font-semibold text-[#1c1917] tracking-tight">
                                        ₹{price}
                                    </span>
                                    {originalPrice > price && (
                                        <span className="font-dm-sans text-base sm:text-lg text-gray-400 line-through font-normal">
                                            ₹{originalPrice}
                                        </span>
                                    )}
                                    {discountPercent > 0 && (
                                        <span className="font-dm-sans text-xs font-semibold text-[#8a4a36] bg-[#fbece7] px-2.5 py-0.5 rounded-full">
                                            {discountPercent}% OFF
                                        </span>
                                    )}
                                </>
                            ) : (
                                <div className="font-dm-sans flex items-center gap-2">
                                    <span className="text-2xl font-semibold text-[#1c1917]">Price on Request</span>
                                    <span className="text-xs text-gray-500 bg-white border border-gray-200 px-2.5 py-1 rounded-full">
                                        Contact florist for latest batch
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Navigation: Deliver to Pincode Bar (DM Sans) */}
                        <div className="border-t border-gray-200/70 pt-4 mb-5">
                            <button
                                type="button"
                                onClick={() => setIsDeliveryModalOpen(true)}
                                className="font-dm-sans w-full flex items-center justify-between py-2.5 px-3 sm:px-4 rounded-xl border border-gray-200/80 bg-white/70 hover:bg-white transition-all text-left shadow-2xs group cursor-pointer"
                            >
                                <div className="flex items-center gap-2.5">
                                    <MapPin size={16} className="text-gray-600 group-hover:text-black transition-colors" />
                                    <span className="font-dm-sans text-xs sm:text-sm text-gray-600 font-normal">
                                        Deliver to <strong className="font-semibold text-[#1c1917]">{deliveryLoc}</strong>
                                    </span>
                                </div>
                                <ChevronRight size={15} className="text-gray-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                            </button>
                        </div>

                        {/* ── Number of Roses / Quantity Selector (Exact Inspiration) ── */}
                        <div className="mb-5">
                            <span className="font-dm-sans text-xs sm:text-[13px] font-semibold text-[#1c1917] mb-2.5 block">
                                {isCake ? 'Select Weight' : 'Number of Roses'}
                            </span>
                            <div className="flex flex-wrap gap-2 sm:gap-2.5">
                                {variantOptions.map((opt) => {
                                    const isSelected = selectedVariant === opt.label;
                                    return (
                                        <button
                                            key={opt.label}
                                            type="button"
                                            onClick={() => setSelectedVariant(opt.label)}
                                            className={`font-dm-sans text-xs sm:text-sm py-2 px-4 sm:px-5 rounded-full transition-all cursor-pointer ${
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

                        {/* Quantity Counter Pill: DM Sans Medium */}
                        <div className="mb-6">
                            <div className="font-dm-sans font-medium inline-flex items-center justify-between w-32 bg-[#f4f2ee] rounded-full px-3 py-2 border border-gray-200/80 shadow-2xs">
                                <button
                                    type="button"
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-black transition-colors cursor-pointer select-none"
                                    aria-label="Decrease quantity"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="font-dm-sans text-sm font-medium text-[#1c1917] select-none">
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-black transition-colors cursor-pointer select-none"
                                    aria-label="Increase quantity"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Buttons: DM Sans Medium */}
                        {hasPrice ? (
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3">
                                    {/* Add to Cart: DM Sans Medium */}
                                    <button
                                        type="button"
                                        onClick={handleAddToCart}
                                        className="font-dm-sans font-medium flex-1 bg-[#2d3a27] hover:bg-[#222c1e] text-white py-3.5 px-6 rounded-full text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all duration-300 cursor-pointer active:scale-[0.99]"
                                    >
                                        {justAdded ? (
                                            <>
                                                <Check size={16} className="text-emerald-400" />
                                                <span className="font-dm-sans font-medium">Added to Cart!</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart size={16} />
                                                <span className="font-dm-sans font-medium">Add to Cart</span>
                                            </>
                                        )}
                                    </button>

                                    {/* Buy Now: DM Sans Medium */}
                                    <button
                                        type="button"
                                        onClick={handleBuyNow}
                                        className="font-dm-sans font-medium flex-1 bg-transparent hover:bg-black/[0.04] text-[#1c1917] border border-[#2d3a27] py-3.5 px-6 rounded-full text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer active:scale-[0.99]"
                                    >
                                        <span className="font-dm-sans font-medium">Buy Now</span>
                                    </button>
                                </div>

                                {/* WhatsApp Concierge Enquiry: DM Sans */}
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => trackEnquiry(product.id, product.name)}
                                    className="font-dm-sans font-medium w-full flex items-center justify-center gap-2 py-2 px-3 text-xs text-gray-500 hover:text-gray-800 transition-colors"
                                >
                                    <WhatsappIcon size={14} className="text-[#25D366]" />
                                    <span>Have a special request? Ask our florist on WhatsApp</span>
                                </a>
                            </div>
                        ) : (
                            <div className="space-y-3 mb-6">
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => trackEnquiry(product.id, product.name)}
                                    className="font-dm-sans font-medium w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#2d3a27] hover:bg-[#222c1e] text-white text-xs sm:text-sm tracking-wide shadow-sm hover:shadow transition-all"
                                >
                                    <WhatsappIcon size={18} className="text-[#25D366]" />
                                    <span className="font-dm-sans font-medium">Enquire Price &amp; Availability</span>
                                </a>
                            </div>
                        )}

                        {/* Trust Badges Strip: DM Sans */}
                        <div className="font-dm-sans grid grid-cols-3 divide-x divide-gray-200/90 pt-6 mt-2 border-t border-gray-200/70 text-center">
                            <div className="flex flex-col items-center gap-1.5 px-2">
                                <Leaf size={20} className="text-gray-700 stroke-[1.5]" />
                                <span className="font-dm-sans text-[11px] sm:text-xs font-medium text-gray-700">Fresh Flowers</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 px-2">
                                <Truck size={20} className="text-gray-700 stroke-[1.5]" />
                                <span className="font-dm-sans text-[11px] sm:text-xs font-medium text-gray-700">Same-Day Delivery</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 px-2">
                                <Gift size={20} className="text-gray-700 stroke-[1.5]" />
                                <span className="font-dm-sans text-[11px] sm:text-xs font-medium text-gray-700">Premium Packaging</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── 3. Tabs Section: About, Details, Reviews (Navigation: DM Sans, Descriptions: DM Sans) ── */}
                <div className="mt-14 sm:mt-18 pt-8 border-t border-gray-200/80">
                    
                    {/* Navigation: Tab Nav (DM Sans) */}
                    <div className="font-dm-sans flex items-center gap-8 border-b border-gray-200/90">
                        <button
                            type="button"
                            onClick={() => setActiveTab('about')}
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
                    <div className="font-dm-sans py-6">
                        {activeTab === 'about' && (
                            <div className="font-dm-sans text-sm sm:text-base text-gray-700 leading-relaxed font-normal max-w-3xl space-y-3">
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
                            <div className="font-dm-sans max-w-3xl space-y-4 text-xs sm:text-sm text-gray-700">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs">
                                        <span className="font-dm-sans font-semibold block text-[#1c1917] mb-1">Flower Care Tips</span>
                                        <p className="font-dm-sans text-gray-600 text-xs leading-relaxed font-normal">
                                            Trim stems at a 45° angle before placing in a clean vase filled with fresh water. Keep away from direct sunlight, air conditioners, and fruit bowls. Refresh water every 2 days.
                                        </p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs">
                                        <span className="font-dm-sans font-semibold block text-[#1c1917] mb-1">Vase Life &amp; Freshness</span>
                                        <p className="font-dm-sans text-gray-600 text-xs leading-relaxed font-normal">
                                            Guaranteed fresh for 5–7 days with proper hydration. Direct cold-chain air cargo from premier rose gardens ensures pristine petal texture and vibrant scent.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="font-dm-sans max-w-3xl space-y-4">
                                <div className="flex items-center gap-5 p-5 rounded-2xl bg-white border border-gray-100 shadow-2xs">
                                    <div className="text-center">
                                        <span className="font-dm-sans text-4xl font-semibold text-[#1c1917]">
                                            {rating || '4.9'}
                                        </span>
                                        <div className="flex items-center justify-center gap-0.5 mt-1.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={13} className="text-amber-500 fill-amber-500" />
                                            ))}
                                        </div>
                                        <span className="font-dm-sans text-[11px] text-gray-400 mt-1 block font-medium">
                                            {reviewCount || 144} verified ratings
                                        </span>
                                    </div>
                                    <div className="h-12 w-px bg-gray-200" />
                                    <p className="font-dm-sans text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                                        &ldquo;The flowers arrived exactly as pictured—fresh, fragrant, and exquisitely wrapped. The recipient was absolutely thrilled with the presentation!&rdquo;
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── 4. Product Titles: You May Also Like (Cormorant Garamond) ── */}
                {relatedProducts.length > 0 && (
                    <section className="mt-16 sm:mt-20 pt-10 border-t border-gray-200/80">
                        <h2 className="font-cormorant text-2xl sm:text-3xl font-semibold text-[#1c1917] tracking-tight mb-6">
                            You May Also Like
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
                            {relatedProducts.map((p, idx) => (
                                <ProductCard
                                    key={p.id}
                                    product={p as unknown as { id: string; name: string; image_url: string; slug: string; stock: number; image_scale?: number; tag?: string }}
                                    index={idx}
                                />
                            ))}
                        </div>
                    </section>
                )}
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

            <WhatsAppFloat />
        </div>
    );
}
