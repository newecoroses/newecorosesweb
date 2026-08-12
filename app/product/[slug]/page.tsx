'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Truck, Package, Shield, ChevronRight, ShoppingCart, Check, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/product/product-card';
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
    const { addItem, updateQuantity, getItemQuantity } = useCart();
    const cartQuantity = product ? getItemQuantity(product.id) : 0;

    useEffect(() => {
        // Load product from Supabase, fallback to static
        fetchProductBySlug(slug).then(async (dbProduct) => {
            if (dbProduct) {
                setProduct(dbProduct);
                // Load related products
                const related = await fetchProductsByCollection(dbProduct.collection_slug).catch(() => []);
                setRelatedProducts(related.filter(p => p.id !== dbProduct.id).slice(0, 3));
            } else {
                // Fall back to static data
                const staticProduct = getProductBySlug(slug);
                if (staticProduct) {
                    // Convert to DBProduct shape
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
                        .slice(0, 3);
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

    // Build WhatsApp link using Supabase number
    useEffect(() => {
        if (!product) return;
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const productUrl = `${origin}/product/${product.slug}`;
        fetchWhatsappSettings().then(s => {
            const phone = s?.phone_number ?? FALLBACK_PHONE;
            const msg = `Hi, I'm interested in ${product.name}. Is it available for delivery today?\n\nProduct: ${productUrl}`;
            setWhatsappLink(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
        }).catch(() => {
            const msg = `Hi, I'm interested in ${product.name}. Is it available for delivery today?\n\nProduct: ${productUrl}`;
            setWhatsappLink(`https://wa.me/${FALLBACK_PHONE}?text=${encodeURIComponent(msg)}`);
        });
    }, [product]);

    const tagColors: Record<string, string> = {
        'Best Seller': 'bg-amber-50 text-amber-700 border-amber-200',
        'New Arrival': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        'Seasonal': 'bg-purple-50 text-purple-700 border-purple-200',
        'Standard': 'bg-gray-50 text-gray-600 border-gray-200',
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

    return (
        <div className="pt-24 sm:pt-28 lg:pt-24 pb-12 bg-background min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs text-muted mb-3 lg:mb-4 font-medium uppercase tracking-wider overflow-x-auto whitespace-nowrap">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight size={12} className="flex-shrink-0" />
                    <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                    <ChevronRight size={12} className="flex-shrink-0" />
                    <Link href={`/collection/${product.collection_slug}`} className="hover:text-primary transition-colors">
                        {product.collection_name}
                    </Link>
                    <ChevronRight size={12} className="flex-shrink-0" />
                    <span className="text-foreground truncate">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
                    {/* ── Image Gallery ── */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                        {/* Tag Badge */}
                        <div className="mb-2">
                            <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${tagColors[product.tag] ?? tagColors['Standard']}`}>
                                {product.tag}
                            </span>
                        </div>

                        {/* Main Image */}
                        <div className="relative aspect-square max-h-[380px] lg:max-h-[440px] xl:max-h-[480px] bg-secondary img-shimmer rounded-2xl overflow-hidden mb-3 mx-auto w-full">
                            <Image
                                src={images[selectedImage] || '/images/placeholder.webp'}
                                alt={product.name}
                                fill
                                className="object-cover transition-all duration-500"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                priority
                            />
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2 max-w-[440px]">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${selectedImage === i ? 'border-primary shadow-soft' : 'border-transparent hover:border-primary/30'}`}
                                    >
                                        <Image src={img} alt={`${product.name} view ${i + 1}`} fill className="object-cover" sizes="100px" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* ── Product Details ── */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col justify-start">
                        {/* Collection Link */}
                        <Link href={`/collection/${product.collection_slug}`} className="text-[11px] uppercase tracking-[0.18em] text-primary font-medium mb-1 hover:underline inline-block">
                            {product.collection_name}
                        </Link>

                        <h1 className="font-serif text-2xl sm:text-3xl lg:text-3xl xl:text-4xl text-foreground mb-2 leading-tight">
                            {product.name}
                        </h1>

                        <p className="text-muted leading-relaxed font-light mb-3 text-xs sm:text-sm max-w-lg">
                            {product.description}
                        </p>

                        {/* Perfect For */}
                        {product.relationships?.length > 0 && (
                            <div className="mb-3">
                                <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-foreground mb-1.5">Perfect For</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {product.relationships.map((rel) => (
                                        <Link key={rel} href={`/shop?relation=${encodeURIComponent(rel.toLowerCase())}`}
                                            className="inline-block text-[11px] font-medium px-3 py-1 rounded-full bg-secondary text-foreground hover:bg-primary hover:text-white transition-all duration-300 border border-gray-200 hover:border-primary">
                                            {rel}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Celebrate On */}
                        {product.celebrations?.length > 0 && (
                            <div className="mb-3">
                                <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-foreground mb-1.5">Celebrate On</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {product.celebrations.map((cel) => (
                                        <Link key={cel} href={`/shop?celebration=${encodeURIComponent(cel.toLowerCase())}`}
                                            className="inline-block text-[11px] font-medium px-3 py-1 rounded-full bg-blush text-foreground hover:bg-primary hover:text-white transition-all duration-300 border border-primary/20 hover:border-primary">
                                            🎉 {cel}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Features */}
                        <div className="space-y-1.5 py-2.5 my-2.5 border-y border-gray-200 text-xs text-muted">
                            {[
                                { icon: <Truck size={16} />, text: 'Same-day delivery available' },
                                { icon: <Package size={16} />, text: 'Signature luxury packaging included' },
                                { icon: <Shield size={16} />, text: 'Freshness guaranteed or full refund' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-primary flex-shrink-0">{item.icon}</span>
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex gap-2.5 mt-1">
                            {/* Add to Cart / Stepper */}
                            {cartQuantity > 0 ? (
                                <div className="flex-1 py-2 px-3 rounded-lg border-2 border-primary bg-primary/5 flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => product && updateQuantity(product.id, cartQuantity - 1)}
                                        className="w-9 h-9 rounded-md bg-white border border-primary/20 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                        title="Decrease quantity"
                                    >
                                        <Minus size={15} />
                                    </button>
                                    <span className="text-xs sm:text-sm font-bold text-primary flex items-center gap-1.5">
                                        <Check size={15} className="text-emerald-600" />
                                        {cartQuantity} in Cart
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => product && addItem({
                                            id: product.id,
                                            name: product.name,
                                            slug: product.slug,
                                            image_url: product.image_url,
                                            price: null,
                                        })}
                                        className="w-9 h-9 rounded-md bg-primary text-white flex items-center justify-center hover:opacity-90 transition-colors"
                                        title="Increase quantity"
                                    >
                                        <Plus size={15} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (product) {
                                            addItem({
                                                id: product.id,
                                                name: product.name,
                                                slug: product.slug,
                                                image_url: product.image_url,
                                                price: null,
                                            });
                                        }
                                    }}
                                    className="flex-1 py-3 px-5 text-center rounded-lg transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-[0.12em] text-xs sm:text-sm font-semibold border-2 bg-white border-primary text-primary hover:bg-primary/5"
                                >
                                    <ShoppingCart size={17} /> Add to Cart
                                </button>
                            )}

                            {/* WhatsApp CTA */}
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-primary text-white py-3 px-5 text-center rounded-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-[0.12em] text-xs sm:text-sm font-semibold shadow-md shadow-primary/5 hover:shadow-lg hover:shadow-primary/10 group"
                                onClick={() => {
                                    if (product) trackEnquiry(product.id, product.name);
                                }}
                            >
                                <WhatsappIcon size={17} className="group-hover:text-[#25D366] transition-colors" />
                                Enquire Now
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* ── Related Products ── */}
                {relatedProducts.length > 0 && (
                    <section className="mt-24 lg:mt-32">
                        <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-10 text-center">You May Also Like</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
                            {relatedProducts.map((p, idx) => (
                                <ProductCard key={p.id} product={p as unknown as { id: string; name: string; image_url: string; slug: string; stock: number; image_scale?: number }} index={idx} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
            <WhatsAppFloat />
        </div>
    );
}
