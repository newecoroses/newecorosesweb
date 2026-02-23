'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Truck, Package, Shield, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/product/product-card';
import WhatsAppFloat from '@/components/ui/whatsapp-float';
import WhatsappIcon from '@/components/ui/whatsapp-icon';
import { fetchProductBySlug, fetchProductsByCollection, fetchWhatsappSettings, DBProduct } from '@/lib/supabase';
import { getProductBySlug, getProductsByCollection } from '@/lib/products';

const FALLBACK_PHONE = '919936911611';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [selectedImage, setSelectedImage] = useState(0);
    const [product, setProduct] = useState<DBProduct | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<DBProduct[]>([]);
    const [whatsappLink, setWhatsappLink] = useState('');
    const [loading, setLoading] = useState(true);

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
        fetchWhatsappSettings().then(s => {
            const phone = s?.phone_number ?? FALLBACK_PHONE;
            const msg = `Hi, I'm interested in ${product.name}. Is it available for delivery today?`;
            setWhatsappLink(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
        }).catch(() => {
            const msg = `Hi, I'm interested in ${product.name}. Is it available for delivery today?`;
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
            <div className="pt-28 pb-20 bg-background min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pt-28 pb-20 min-h-screen bg-background flex flex-col items-center justify-center text-center px-6">
                <h1 className="font-serif text-3xl text-foreground mb-4">Product Not Found</h1>
                <p className="text-muted mb-8 font-light">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                <Link href="/shop" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-all">
                    <ArrowLeft size={14} /> Browse All Products
                </Link>
            </div>
        );
    }

    const images = product.images?.length > 0 ? product.images : [product.image_url];

    return (
        <div className="pt-28 pb-20 bg-background min-h-screen">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs text-muted mb-10 font-medium uppercase tracking-wider">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight size={12} />
                    <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                    <ChevronRight size={12} />
                    <Link href={`/collection/${product.collection_slug}`} className="hover:text-primary transition-colors">
                        {product.collection_name}
                    </Link>
                    <ChevronRight size={12} />
                    <span className="text-foreground">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* ── Image Gallery ── */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                        {/* Tag Badge */}
                        <div className="mb-4">
                            <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${tagColors[product.tag] ?? tagColors['Standard']}`}>
                                {product.tag}
                            </span>
                        </div>

                        {/* Main Image */}
                        <div className="relative aspect-[4/5] bg-secondary img-shimmer rounded-2xl overflow-hidden mb-4">
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
                            <div className="grid grid-cols-4 gap-3">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${selectedImage === i ? 'border-primary shadow-soft' : 'border-transparent hover:border-primary/30'}`}
                                    >
                                        <Image src={img} alt={`${product.name} view ${i + 1}`} fill className="object-cover" sizes="120px" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* ── Product Details ── */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="flex flex-col justify-center">
                        {/* Collection Link */}
                        <Link href={`/collection/${product.collection_slug}`} className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-3 hover:underline inline-block">
                            {product.collection_name}
                        </Link>

                        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 leading-tight">
                            {product.name}
                        </h1>

                        <p className="text-muted leading-relaxed font-light mb-8 text-[0.95rem] max-w-md">
                            {product.description}
                        </p>

                        {/* Item Count Display */}
                        {product.item_count && (product.item_count > 0) ? (
                            <div className="mb-6 flex items-center gap-3 bg-secondary/30 w-fit px-4 py-2 border border-gray-100 rounded-lg">
                                <span className="text-primary font-bold text-lg">{product.item_count}</span>
                                <span className="text-muted text-xs uppercase tracking-wider font-semibold">Items in arrangement</span>
                            </div>
                        ) : null}

                        {/* Perfect For */}
                        {product.relationships?.length > 0 && (
                            <div className="mb-6">
                                <p className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground mb-3">Perfect For</p>
                                <div className="flex flex-wrap gap-2">
                                    {product.relationships.map((rel) => (
                                        <Link key={rel} href={`/shop?relation=${encodeURIComponent(rel.toLowerCase())}`}
                                            className="inline-block text-xs font-medium px-4 py-2 rounded-full bg-secondary text-foreground hover:bg-primary hover:text-white transition-all duration-300 border border-gray-200 hover:border-primary">
                                            {rel}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Celebrate On */}
                        {product.celebrations?.length > 0 && (
                            <div className="mb-8">
                                <p className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground mb-3">Celebrate On</p>
                                <div className="flex flex-wrap gap-2">
                                    {product.celebrations.map((cel) => (
                                        <Link key={cel} href={`/shop?celebration=${encodeURIComponent(cel.toLowerCase())}`}
                                            className="inline-block text-xs font-medium px-4 py-2 rounded-full bg-blush text-foreground hover:bg-primary hover:text-white transition-all duration-300 border border-primary/20 hover:border-primary">
                                            🎉 {cel}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Features */}
                        <div className="space-y-4 mb-10 py-6 border-y border-gray-200">
                            {[
                                { icon: <Truck size={18} />, text: 'Same-day delivery within 10 km (order by 5 PM)' },
                                { icon: <Package size={18} />, text: 'Signature luxury packaging included' },
                                { icon: <Shield size={18} />, text: 'Freshness guaranteed or full refund' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 text-sm text-muted">
                                    <span className="text-primary">{item.icon}</span>
                                    {item.text}
                                </div>
                            ))}
                        </div>

                        {/* WhatsApp CTA */}
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-primary text-white py-4 px-8 text-center rounded-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-[0.15em] text-sm font-semibold shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 group"
                        >
                            <WhatsappIcon size={20} className="group-hover:text-[#25D366] transition-colors" />
                            Enquire via WhatsApp
                        </a>
                    </motion.div>
                </div>

                {/* ── Related Products ── */}
                {relatedProducts.length > 0 && (
                    <section className="mt-24 lg:mt-32">
                        <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-10 text-center">You May Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
