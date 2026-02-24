'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import ProductCard from '@/components/product/product-card';
import SectionHeader from '@/components/ui/section-header';
import WhatsAppFloat from '@/components/ui/whatsapp-float';
import { fetchProductsByCollection, fetchCollections, DBProduct } from '@/lib/supabase';
import { getProductsByCollection, COLLECTIONS } from '@/lib/products';

export default function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [products, setProducts] = useState<DBProduct[]>([]);
    const [collectionName, setCollectionName] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get collection name from Supabase first, fallback to static
        fetchCollections().then(cols => {
            const found = cols.find(c => c.slug === slug);
            if (found) setCollectionName(found.name);
            else {
                const staticCol = COLLECTIONS.find(c => c.slug === slug);
                setCollectionName(staticCol?.name ?? slug);
            }
        }).catch(() => {
            const staticCol = COLLECTIONS.find(c => c.slug === slug);
            setCollectionName(staticCol?.name ?? slug);
        });

        // Get products from Supabase first, fallback to static
        fetchProductsByCollection(slug).then(prods => {
            if (prods.length > 0) {
                setProducts(prods);
            } else {
                setProducts(getProductsByCollection(slug) as unknown as DBProduct[]);
            }
            setLoading(false);
        }).catch(() => {
            setProducts(getProductsByCollection(slug) as unknown as DBProduct[]);
            setLoading(false);
        });
    }, [slug]);

    return (
        <div className="pt-28 pb-20 min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs text-muted mb-10 font-medium uppercase tracking-wider">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight size={12} />
                    <Link href="/shop" className="hover:text-primary transition-colors">Collections</Link>
                    <ChevronRight size={12} />
                    <span className="text-foreground">{collectionName}</span>
                </nav>

                <SectionHeader
                    label="Collection"
                    title={collectionName}
                    subtitle={`Explore our curated ${collectionName} — each piece crafted with love and delivered with care.`}
                />

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">
                        {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square bg-gray-100 rounded-lg animate-pulse" />)}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="font-serif text-xl text-foreground mb-4">No products found in this collection.</p>
                        <Link href="/shop" className="text-primary text-sm font-medium hover:underline">Browse All Products</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">
                        {products.map((product, idx) => (
                            <ProductCard key={product.id} product={product as unknown as { id: string; name: string; image_url: string; slug: string; stock: number; image_scale?: number; tag?: string }} index={idx} />
                        ))}
                    </div>
                )}

                <div className="mt-14 text-center">
                    <Link href="/shop" className="inline-flex items-center gap-2 text-muted hover:text-foreground text-sm transition-colors">
                        <ArrowLeft size={14} />
                        Back to All Collections
                    </Link>
                </div>
            </div>
            <WhatsAppFloat />
        </div>
    );
}
