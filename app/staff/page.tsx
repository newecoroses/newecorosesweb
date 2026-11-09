'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Package,
    Eye,
    EyeOff,
    Sparkles,
    AlertCircle,
    TrendingUp,
    Clock,
    ChevronRight,
    Edit2,
    RefreshCw
} from 'lucide-react';

interface ProductItem {
    id: string;
    name: string;
    slug: string;
    price?: number | null;
    original_price?: number | null;
    stock: number;
    is_visible: boolean;
    is_featured: boolean;
    tag?: string;
    image_url: string;
    collection_name?: string;
    updated_at: string;
}

interface StaffSession {
    name: string;
    role: string;
}

export default function StaffDashboardPage() {
    const [staff, setStaff] = useState<StaffSession | null>(null);
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const [authRes, prodRes] = await Promise.all([
                fetch('/api/staff/auth'),
                fetch('/api/staff/products'),
            ]);

            if (authRes.ok) {
                const authData = await authRes.json();
                setStaff(authData.staff);
            }

            if (prodRes.ok) {
                const prodData = await prodRes.json();
                setProducts(prodData.products || []);
            }
        } catch (err) {
            console.error('Error loading dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const totalCount = products.length;
    const publishedCount = products.filter(p => p.is_visible).length;
    const hiddenCount = products.filter(p => !p.is_visible).length;
    const featuredCount = products.filter(p => p.is_featured).length;
    const outOfStockCount = products.filter(p => p.stock <= 0).length;
    const bestSellerCount = products.filter(p => p.tag === 'Best Seller').length;

    const STAT_CARDS = [
        { label: 'Total Products', value: totalCount, icon: Package, color: 'from-blue-500 to-blue-600', href: '/staff/products' },
        { label: 'Published (Live)', value: publishedCount, icon: Eye, color: 'from-emerald-500 to-emerald-600', href: '/staff/products' },
        { label: 'Hidden Products', value: hiddenCount, icon: EyeOff, color: 'from-amber-500 to-amber-600', href: '/staff/products' },
        { label: 'Out of Stock', value: outOfStockCount, icon: AlertCircle, color: 'from-rose-500 to-rose-600', href: '/staff/products' },
        { label: 'Featured Items', value: featuredCount, icon: Sparkles, color: 'from-purple-500 to-purple-600', href: '/staff/homepage' },
        { label: 'Best Sellers', value: bestSellerCount, icon: TrendingUp, color: 'from-zinc-200 to-zinc-400 text-zinc-900', href: '/staff/products' },
    ];

    const QUICK_LINKS = [
        { href: '/staff/products', label: 'Manage Products', desc: 'Update prices, toggle stock and visibility', icon: Package },
        { href: '/staff/homepage', label: 'Homepage Sections', desc: 'Curate Featured, Trending and New Arrivals', icon: Sparkles },
        { href: '/staff/activity', label: 'Activity Log', desc: 'Review team audit history & recent changes', icon: Clock },
    ];

    const recentlyUpdated = [...products]
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 6);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Welcome back, {staff?.name || 'Staff'}! Here is an overview of your product catalog.
                    </p>
                </div>
                <button
                    onClick={loadData}
                    className="flex items-center gap-2 bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-300 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Stats Grid matching Admin */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
                {STAT_CARDS.map(({ label, value, icon: Icon, color, href }) => (
                    <Link key={label} href={href} className="group">
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all hover:-translate-y-0.5">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-xs`}>
                                <Icon size={18} className="text-white" />
                            </div>
                            <p className="text-2xl sm:text-3xl font-bold text-white mb-1">
                                {loading ? (
                                    <span className="w-12 h-7 bg-gray-800 rounded animate-pulse inline-block" />
                                ) : (
                                    value
                                )}
                            </p>
                            <p className="text-gray-400 text-xs">{label}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions matching Admin */}
            <div className="mb-8">
                <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {QUICK_LINKS.map(({ href, label, desc, icon: Icon }) => (
                        <Link key={href} href={href} className="group">
                            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-zinc-400/30 hover:bg-gray-850 transition-all">
                                <div className="flex items-center gap-3 mb-2">
                                    <Icon size={18} className="text-zinc-100" />
                                    <p className="text-white font-medium text-sm">{label}</p>
                                    <ChevronRight size={14} className="ml-auto text-gray-600 group-hover:text-zinc-100 transition-colors" />
                                </div>
                                <p className="text-gray-500 text-xs pl-7">{desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recently Updated Products Table */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-gray-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-white font-semibold text-sm">Recently Updated Products</h2>
                        <p className="text-gray-500 text-xs mt-0.5">Products with recent modifications or price updates</p>
                    </div>
                    <Link
                        href="/staff/products"
                        className="text-xs text-zinc-300 hover:text-white flex items-center gap-1 font-medium transition-colors"
                    >
                        View All
                        <ChevronRight size={12} />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider font-medium">
                                <th className="text-left px-5 py-3.5">Product</th>
                                <th className="text-left px-5 py-3.5">Tag</th>
                                <th className="text-left px-5 py-3.5">Price</th>
                                <th className="text-left px-5 py-3.5">Status</th>
                                <th className="text-right px-5 py-3.5">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentlyUpdated.map(product => (
                                <tr key={product.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            {product.image_url ? (
                                                <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                                                    <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="36px" />
                                                </div>
                                            ) : (
                                                <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-600 text-[10px]">
                                                    No img
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-white font-medium text-xs sm:text-sm">{product.name}</p>
                                                <p className="text-gray-500 text-[11px] truncate max-w-44">/{product.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="text-xs text-gray-400">{product.tag || 'Standard'}</span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        {product.price ? (
                                            <span className="font-bold text-white text-xs sm:text-sm">₹{product.price}</span>
                                        ) : (
                                            <span className="text-xs text-gray-500 italic">No price</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium ${
                                            product.is_visible ? 'bg-green-500/10 text-green-400' : 'bg-gray-700 text-gray-400'
                                        }`}>
                                            {product.is_visible ? 'Live' : 'Hidden'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <Link
                                            href={`/staff/products`}
                                            className="text-gray-500 hover:text-zinc-100 transition-colors p-1.5 hover:bg-zinc-200/10 rounded-lg inline-flex"
                                        >
                                            <Edit2 size={14} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
