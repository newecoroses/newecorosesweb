'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ShoppingCart, Check, Minus, Plus, Star, MapPin, Maximize2, Flame, Info, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard, { getProductPriceInfo } from '@/components/product/product-card';
import WhatsAppFloat from '@/components/ui/whatsapp-float';
import WhatsappIcon from '@/components/ui/whatsapp-icon';
import { fetchProductBySlug, fetchProductsByCollection, fetchWhatsappSettings, DBProduct } from '@/lib/supabase';
import { getProductBySlug, getProductsByCollection } from '@/lib/products';
import { trackEnquiry } from '@/lib/analytics';
import { useCart } from '@/lib/cart-context';

const FALLBACK_PHONE = '919936911611';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [selectedImage, setSelectedImage] = useState(0);
    const [product, setProduct] = useState<DBProduct | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<DBProduct[]>([]);
    const [whatsappLink, setWhatsappLink] = useState('');
    const [loading, setLoading] = useState(true);
    const [pincode, setPincode] = useState('');
    const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const { addItem, updateQuantity, getItemQuantity } = useCart();
    const cartQuantity = product ? getItemQuantity(product.id) : 0;

    useEffect(() => {
        // Load product from Supabase, fallback to static
        fetchProductBySlug(slug).then(async (dbProduct) => {
            if (dbProduct) {
                setProduct(dbProduct);
                // Load related products
                const related = await fetchProductsByCollection(dbProduct.collection_slug).catch(() => []);
                setRelatedProducts(related.filter(p => p.id !== dbProduct.id).slice(0, 4));
            } else {
                const staticProduct = getProductBySlug(slug);
                if (staticProduct) {
                    setProduct({
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
                    });
                    const related = getProductsByCollection(staticProduct.collectionSlug)
                        .filter(p => p.id !== staticProduct.id)
                        .slice(0, 4);
                    setRelatedProducts(related as unknown as DBProduct[]);
                }
            }
            setLoading(false);
        }).catch(() => {
            const staticProduct = getProductBySlug(slug);
            if (staticProduct) {
                setProduct({
                    id: staticProduct.id, name: staticProduct.name, slug: staticProduct.slug,
                    description: staticProduct.description, collection_name: staticProduct.collection,
                    collection_slug: staticProduct.collectionSlug, relationships: staticProduct.relationships,
                    celebrations: staticProduct.celebrations, tag: staticProduct.tag,
                    image_url: staticProduct.images[0], images: staticProduct.images,
                    image_scale: staticProduct.imageScale ?? 1, stock: staticProduct.stock,
                    item_count: staticProduct.itemCount ?? 0,
                    is_visible: true, is_featured: false, sort_order: 0, created_at: '', updated_at: '',
                });
            }
            setLoading(false);
        });
    }, [slug]);

    // Build WhatsApp link
    useEffect(() => {
        if (!product) return;
        const productUrl = `https://www.newecoroses.com/product/${product.slug}`;
        fetchWhatsappSettings().then(s => {
            const phone = s?.phone_number ?? FALLBACK_PHONE;
            const msg = `Hi, I'm interested in ${product.name}. Is it available for delivery today?\n\nProduct: ${productUrl}`;
            setWhatsappLink(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
        }).catch(() => {
            const msg = `Hi, I'm interested in ${product.name}. Is it available for delivery today?\n\nProduct: ${productUrl}`;
            setWhatsappLink(`https://wa.me/${FALLBACK_PHONE}?text=${encodeURIComponent(msg)}`);
        });
    }, [product]);

    const handleCheckPincode = () => {
        if (!pincode.trim()) return;
        if (pincode.startsWith('700') || pincode.toLowerCase().includes('kolkata')) {
            setPincodeStatus('Available for Same-Day & Midnight Delivery in Kolkata! 🎉');
        } else {
            setPincodeStatus('Delivery available! Standard and Express delivery options supported.');
        }
    };

    if (loading) {
        return (
            <div className="pt-32 pb-20 bg-background min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pt-32 pb-20 min-h-screen bg-background flex flex-col items-center justify-center text-center px-6">
                <h1 className="font-serif text-3xl text-foreground mb-4">Product Not Found</h1>
                <p className="text-muted mb-8 font-light">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                <Link href="/shop" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-all">
                    <ArrowLeft size={14} /> Browse All Products
                </Link>
            </div>
        );
    }

    const allImages = product.images?.length > 0 ? product.images : [product.image_url];
    const images = allImages.filter(img => !img.startsWith('HIDDEN::'));

    const { price, originalPrice, discountPercent, rating, reviewCount, ordersPastMonth } = getProductPriceInfo(product);

    const tagInfo = (() => {
        if (!product.tag || product.tag === 'Standard') return { label: 'Bestseller', bg: 'bg-[#581c87] text-white' };
        if (product.tag.toLowerCase().includes('best') || product.tag.toLowerCase().includes('bestseller')) {
            return { label: 'Bestseller', bg: 'bg-[#581c87] text-white' };
        }
        if (product.tag.toLowerCase().includes('new')) {
            return { label: 'New Arrival', bg: 'bg-[#1d4ed8] text-white' };
        }
        if (product.tag.toLowerCase().includes('luxe') || product.tag.toLowerCase().includes('luxury')) {
            return { label: 'LUXE', bg: 'bg-[#18181b] text-white' };
        }
        if (product.tag.toLowerCase().includes('season')) {
            return { label: 'Seasonal', bg: 'bg-[#047857] text-white' };
        }
        return { label: product.tag, bg: 'bg-rose-100 text-rose-800' };
    })();

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            slug: product.slug,
            image_url: product.image_url,
            price: price,
        });
    };

    const handleBuyNow = () => {
        handleAddToCart();
        if (typeof window !== 'undefined') {
            window.location.href = whatsappLink;
        }
    };

    return (
        <div className="pt-[100px] sm:pt-[110px] lg:pt-[140px] pb-14 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ── Breadcrumb Bar ── */}
                <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4 font-normal overflow-x-auto whitespace-nowrap py-0.5">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <span>/</span>
                    <Link href={`/shop?cat=${product.collection_slug}`} className="hover:text-primary transition-colors">
                        {product.collection_name || 'Flowers'}
                    </Link>
                    <span>/</span>
                    <span className="text-[#1c1917] font-medium truncate">{product.name}</span>
                </nav>

                {/* ── 2-Column Main Section (Perfect FNP Alignment) ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
                    
                    {/* ══ LEFT: Vertical Thumbnails Strip + Main Showcase Image (7 cols) ══ */}
                    <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-3.5 items-start">
                        {/* Vertical Thumbnail Strip */}
                        {images.length > 1 && (
                            <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[500px] w-full sm:w-20 flex-shrink-0 no-scrollbar">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`relative aspect-square w-16 sm:w-full rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 cursor-pointer ${
                                            selectedImage === i
                                                ? 'border-[#2a2420] ring-1 ring-[#2a2420] shadow-xs'
                                                : 'border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100'
                                        }`}
                                    >
                                        <Image src={img} alt={`${product.name} view ${i + 1}`} fill className="object-cover" sizes="80px" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main Showcase Image */}
                        <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-2xl md:rounded-3xl overflow-hidden bg-[#faf7f2] border border-gray-100 shadow-xs flex items-center justify-center group">
                            <Image
                                src={images[selectedImage] || product.image_url}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 1024px) 100vw, 55vw"
                                priority
                            />

                            {/* Expand Fullscreen Icon */}
                            <button
                                type="button"
                                onClick={() => setIsImageModalOpen(true)}
                                className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/85 backdrop-blur-md border border-gray-200 text-gray-700 hover:text-black hover:bg-white flex items-center justify-center transition-all shadow-xs cursor-pointer"
                                aria-label="Expand Image"
                            >
                                <Maximize2 size={14} />
                            </button>
                        </div>
                    </div>

                    {/* ══ RIGHT: Product Details Panel (5 cols) ══ */}
                    <div className="lg:col-span-5 flex flex-col justify-start">
                        
                        {/* Title & Rating Header */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <h1 className="text-xl sm:text-2xl lg:text-[25px] font-bold text-[#1c1917] leading-snug">
                                {product.name}
                            </h1>

                            {/* Star Rating Pill Badge */}
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex-shrink-0 shadow-2xs mt-0.5">
                                <Star size={12} className="text-amber-500 fill-amber-500" />
                                <span>{rating}</span>
                                <span className="text-gray-300 font-light">|</span>
                                <span className="text-gray-600 font-normal">{reviewCount}</span>
                            </div>
                        </div>

                        {/* Tag Pill (e.g. Bestseller / New Arrival) */}
                        <div className="mb-2">
                            <span className={`inline-block px-2.5 py-0.5 rounded-[4px] text-[11px] font-bold uppercase tracking-wider ${tagInfo.bg}`}>
                                {tagInfo.label}
                            </span>
                        </div>

                        {/* Urgency / Social Proof Banner */}
                        <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-amber-700 mb-3.5">
                            <Flame size={15} className="text-amber-600 fill-amber-500 flex-shrink-0" />
                            <span>Ordered {ordersPastMonth}+ times in Past Month</span>
                        </div>

                        <div className="h-px bg-gray-100 mb-3.5" />

                        {/* ── Choose Delivery Preference ── */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1c1917]">
                                <MapPin size={14} className="text-primary flex-shrink-0" />
                                <span>Choose Delivery Preference</span>
                            </div>

                            {/* Location Input Box with India Flag */}
                            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 bg-white shadow-2xs">
                                <div className="flex items-center gap-1.5 px-3 py-2.5 border-r border-gray-200 bg-gray-50/60 flex-shrink-0 cursor-default">
                                    {/* India Flag */}
                                    <div className="w-5 h-3 rounded-[2px] overflow-hidden border border-black/10 flex-shrink-0">
                                        <svg className="w-full h-full" viewBox="0 0 36 24" fill="none">
                                            <rect width="36" height="8" fill="#FF9933" />
                                            <rect y="8" width="36" height="8" fill="#FFFFFF" />
                                            <rect y="16" width="36" height="8" fill="#138808" />
                                            <circle cx="18" cy="12" r="3" fill="none" stroke="#000080" strokeWidth="0.8" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-bold text-[#2a2420]">IND</span>
                                    <ChevronDown size={12} className="text-gray-400" />
                                </div>

                                <input
                                    type="text"
                                    placeholder="Enter pincode, locality, etc"
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCheckPincode()}
                                    className="w-full px-3 py-2.5 text-xs sm:text-sm text-[#1c1917] focus:outline-none placeholder:text-gray-400"
                                />

                                <button
                                    type="button"
                                    onClick={handleCheckPincode}
                                    className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/5 transition-colors cursor-pointer flex-shrink-0"
                                >
                                    Check
                                </button>
                            </div>

                            {pincodeStatus && (
                                <p className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 py-1.5 px-2.5 rounded-lg mt-1.5">
                                    {pincodeStatus}
                                </p>
                            )}
                        </div>

                        {/* ── Explore More Options (Proper Square Proportions) ── */}
                        {relatedProducts.length > 0 && (
                            <div className="space-y-2 mb-5">
                                <p className="text-xs sm:text-sm font-bold text-[#1c1917]">
                                    Explore more options
                                </p>
                                <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                                    {relatedProducts.slice(0, 3).map((item) => (
                                        <Link
                                            key={item.id}
                                            href={`/product/${item.slug}`}
                                            className="group block rounded-xl overflow-hidden border border-gray-100 hover:border-primary/40 transition-all bg-[#faf7f2] p-1.5 shadow-2xs hover:shadow-xs"
                                        >
                                            <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-1.5">
                                                <Image
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    sizes="(max-width: 768px) 30vw, 120px"
                                                />
                                            </div>
                                            <p className="text-[11px] font-semibold text-[#1c1917] truncate px-1 text-center group-hover:text-primary transition-colors">
                                                {item.name}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Action CTA Buttons ── */}
                        <div className="flex gap-3 mb-3">
                            {/* Add To Cart */}
                            {cartQuantity > 0 ? (
                                <div className="flex-1 py-2 px-3 rounded-xl border-2 border-primary bg-primary/5 flex items-center justify-between shadow-xs">
                                    <button
                                        type="button"
                                        onClick={() => updateQuantity(product.id, cartQuantity - 1)}
                                        className="w-8 h-8 rounded-lg bg-white border border-primary/20 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer"
                                    >
                                        <Minus size={13} />
                                    </button>
                                    <span className="text-xs sm:text-sm font-bold text-primary flex items-center gap-1">
                                        <Check size={14} className="text-emerald-600" /> {cartQuantity} in Cart
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleAddToCart}
                                        className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:opacity-90 transition-colors cursor-pointer"
                                    >
                                        <Plus size={13} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-white hover:bg-gray-50 text-[#1c1917] border-2 border-gray-800 py-3.5 px-4 text-center rounded-xl shadow-xs hover:shadow-sm transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider cursor-pointer"
                                >
                                    <ShoppingCart size={16} />
                                    <span>Add To Cart</span>
                                </button>
                            )}

                            {/* Buy Now (Sleek Black Pill) */}
                            <button
                                type="button"
                                onClick={handleBuyNow}
                                className="flex-1 bg-[#1c1917] hover:bg-black text-white py-3.5 px-4 text-center rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                            >
                                <ShoppingCart size={16} />
                                <span>Buy Now</span>
                            </button>
                        </div>

                        {/* WhatsApp Fast Enquiry link */}
                        <div className="text-center">
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackEnquiry(product.id, product.name)}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                            >
                                <WhatsappIcon size={14} className="text-emerald-600" />
                                <span>Order via WhatsApp &amp; Chat with our florist ↗</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* ── You May Also Like Section (Down page for deeper browsing) ── */}
                {relatedProducts.length > 0 && (
                    <section className="mt-16 lg:mt-20 pt-10 border-t border-gray-100">
                        <h2 className="font-sans text-base sm:text-lg md:text-xl font-extrabold text-[#1c1917] tracking-tight mb-6">
                            You May Also Like
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
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

            {/* Fullscreen Image Preview Lightbox Modal */}
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
                                src={images[selectedImage] || product.image_url}
                                alt={product.name}
                                fill
                                className="object-contain"
                                sizes="90vw"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <WhatsAppFloat />
        </div>
    );
}

