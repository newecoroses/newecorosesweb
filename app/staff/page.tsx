'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Package,
    Eye,
    EyeOff,
    Sparkles,
    AlertTriangle,
    CheckCircle2,
    ArrowRight,
    RefreshCw,
    TrendingUp,
    Shield,
    Clock,
    Search,
    Edit3
} from 'lucide-react';
import { StaffPermissions } from '@/lib/staff-auth';

interface ProductItem {
    id: string;
    name: string;
    slug: string;
    price?: number;
    original_price?: number;
    stock: number;
    is_visible: boolean;
    is_featured: boolean;
    tag?: string;
    image_url: string;
    collection_name?: string;
    updated_at: string;
}

interface ActivityItem {
    id: string;
    staffName: string;
    action: string;
    productName?: string;
    details: string;
    timestamp: string;
}

interface StaffSession {
    name: string;
    role: string;
    permissions: StaffPermissions;
}

export default function StaffDashboardPage() {
    const [staff, setStaff] = useState<StaffSession | null>(null);
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            // Fetch session
            const authRes = await fetch('/api/staff/auth');
            if (authRes.ok) {
                const authData = await authRes.json();
                setStaff(authData.staff);
            }

            // Fetch products
            const prodRes = await fetch('/api/staff/products');
            if (prodRes.ok) {
                const prodData = await prodRes.json();
                setProducts(prodData.products || []);
            }

            // Fetch recent activities
            const actRes = await fetch('/api/staff/activity?limit=6');
            if (actRes.ok) {
                const actData = await actRes.json();
                setRecentActivities(actData.logs || []);
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

    // Metric Calculations
    const totalCount = products.length;
    const publishedCount = products.filter(p => p.is_visible).length;
    const hiddenCount = products.filter(p => !p.is_visible).length;
    const featuredCount = products.filter(p => p.is_featured).length;
    const outOfStockCount = products.filter(p => p.stock <= 0).length;
    const inStockCount = products.filter(p => p.stock > 0).length;

    // Sort by recent updates
    const recentlyUpdated = [...products]
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 8);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
                <p className="text-sm text-gray-400">Loading catalog stats...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome banner */}
            <div className="bg-gradient-to-r from-[#161b22] to-[#1c2430] border border-gray-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Staff Product Management</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Welcome back, {staff?.name || 'Staff Member'}!
                    </h1>
                    <p className="text-sm text-gray-400 max-w-xl">
                        Monitor your inventory, update pricing, toggle visibility, and manage homepage featured products with automatic instant website sync.
                    </p>
                </div>

                <div className="relative z-10 flex flex-wrap gap-3">
                    <Link
                        href="/staff/products"
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-950/40"
                    >
                        <Package className="w-4 h-4" />
                        Manage Products
                    </Link>
                    <Link
                        href="/staff/homepage"
                        className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-all border border-gray-700"
                    >
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        Homepage Sections
                    </Link>
                </div>
            </div>

            {/* Dashboard Stat Cards */}
            <div>
                <h2 className="text-sm uppercase tracking-wider font-bold text-gray-400 mb-4">
                    Catalog Overview
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
                    {/* Total Products */}
                    <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-gray-400">
                            <span className="text-xs font-semibold uppercase tracking-wider">Total</span>
                            <Package className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="mt-3">
                            <span className="text-2xl sm:text-3xl font-extrabold text-white">{totalCount}</span>
                            <span className="text-xs text-gray-500 block mt-0.5">All products</span>
                        </div>
                    </div>

                    {/* Published Products */}
                    <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-emerald-400">
                            <span className="text-xs font-semibold uppercase tracking-wider">Published</span>
                            <Eye className="w-4 h-4" />
                        </div>
                        <div className="mt-3">
                            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{publishedCount}</span>
                            <span className="text-xs text-gray-500 block mt-0.5">Live on website</span>
                        </div>
                    </div>

                    {/* Hidden Products */}
                    <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-amber-400">
                            <span className="text-xs font-semibold uppercase tracking-wider">Hidden</span>
                            <EyeOff className="w-4 h-4" />
                        </div>
                        <div className="mt-3">
                            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">{hiddenCount}</span>
                            <span className="text-xs text-gray-500 block mt-0.5">Draft / Hidden</span>
                        </div>
                    </div>

                    {/* Featured Products */}
                    <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-purple-400">
                            <span className="text-xs font-semibold uppercase tracking-wider">Featured</span>
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="mt-3">
                            <span className="text-2xl sm:text-3xl font-extrabold text-purple-400">{featuredCount}</span>
                            <span className="text-xs text-gray-500 block mt-0.5">On Homepage</span>
                        </div>
                    </div>

                    {/* Out of Stock Products */}
                    <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-red-400">
                            <span className="text-xs font-semibold uppercase tracking-wider">Out of Stock</span>
                            <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div className="mt-3">
                            <span className="text-2xl sm:text-3xl font-extrabold text-red-400">{outOfStockCount}</span>
                            <span className="text-xs text-gray-500 block mt-0.5">Stock = 0</span>
                        </div>
                    </div>

                    {/* In Stock Products */}
                    <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-teal-400">
                            <span className="text-xs font-semibold uppercase tracking-wider">In Stock</span>
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div className="mt-3">
                            <span className="text-2xl sm:text-3xl font-extrabold text-teal-400">{inStockCount}</span>
                            <span className="text-xs text-gray-500 block mt-0.5">Available</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main 2-column layout: Recently Updated Products & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recently Updated Products (2 Cols) */}
                <div className="lg:col-span-2 bg-[#161b22] border border-gray-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                        <div>
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                <Clock className="w-4 h-4 text-emerald-400" />
                                Recently Updated Products
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Items edited most recently across the catalog
                            </p>
                        </div>
                        <Link
                            href="/staff/products"
                            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                        >
                            View All <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="divide-y divide-gray-800/60">
                        {recentlyUpdated.map(p => (
                            <div key={p.id} className="py-3 flex items-center justify-between gap-3 hover:bg-gray-800/30 px-2 rounded-xl transition-colors">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="relative w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 overflow-hidden flex-shrink-0">
                                        {p.image_url ? (
                                            <Image
                                                src={p.image_url}
                                                alt={p.name}
                                                fill
                                                className="object-cover"
                                                sizes="48px"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600">No img</div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
                                            {p.name}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                                            {p.price ? (
                                                <span className="font-bold text-emerald-400">₹{p.price}</span>
                                            ) : (
                                                <span className="text-gray-500">Auto price</span>
                                            )}
                                            <span>&bull;</span>
                                            <span className={p.stock > 0 ? 'text-teal-400' : 'text-red-400'}>
                                                {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                                            </span>
                                            {p.tag && p.tag !== 'Standard' && (
                                                <>
                                                    <span>&bull;</span>
                                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800">
                                                        {p.tag}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                        p.is_visible ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-amber-950/60 text-amber-400 border border-amber-800'
                                    }`}>
                                        {p.is_visible ? 'Live' : 'Hidden'}
                                    </span>
                                    <Link
                                        href={`/staff/products?edit=${encodeURIComponent(p.id)}`}
                                        className="p-1.5 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                                        title="Quick Edit"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right side: Staff Profile & Recent Activity Feed */}
                <div className="space-y-6">
                    {/* Permissions summary */}
                    {staff && (
                        <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-5 shadow-xl space-y-3">
                            <div className="flex items-center gap-2 text-sm font-bold text-white">
                                <Shield className="w-4 h-4 text-emerald-400" />
                                My Active Permissions
                            </div>
                            <div className="space-y-1.5 text-xs text-gray-300">
                                <div className="flex items-center justify-between py-1 border-b border-gray-800/60">
                                    <span>Product Pricing</span>
                                    <span className={staff.permissions.canEditPrices ? 'text-emerald-400 font-semibold' : 'text-gray-500'}>
                                        {staff.permissions.canEditPrices ? 'Granted' : 'Locked'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-1 border-b border-gray-800/60">
                                    <span>Product Details</span>
                                    <span className={staff.permissions.canEditDetails ? 'text-emerald-400 font-semibold' : 'text-gray-500'}>
                                        {staff.permissions.canEditDetails ? 'Granted' : 'Locked'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-1 border-b border-gray-800/60">
                                    <span>Image Upload & Edit</span>
                                    <span className={staff.permissions.canEditImages ? 'text-emerald-400 font-semibold' : 'text-gray-500'}>
                                        {staff.permissions.canEditImages ? 'Granted' : 'Locked'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-1 border-b border-gray-800/60">
                                    <span>Visibility (Live/Hidden)</span>
                                    <span className={staff.permissions.canEditVisibility ? 'text-emerald-400 font-semibold' : 'text-gray-500'}>
                                        {staff.permissions.canEditVisibility ? 'Granted' : 'Locked'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-1 border-b border-gray-800/60">
                                    <span>Stock Management</span>
                                    <span className={staff.permissions.canEditStock ? 'text-emerald-400 font-semibold' : 'text-gray-500'}>
                                        {staff.permissions.canEditStock ? 'Granted' : 'Locked'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <span>Homepage Curation</span>
                                    <span className={staff.permissions.canManageHomepage ? 'text-emerald-400 font-semibold' : 'text-gray-500'}>
                                        {staff.permissions.canManageHomepage ? 'Granted' : 'Locked'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recent Activity mini feed */}
                    <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-5 shadow-xl space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Clock className="w-4 h-4 text-emerald-400" />
                                Recent Staff Activity
                            </h3>
                            <Link href="/staff/activity" className="text-xs text-emerald-400 hover:underline">
                                Full Log
                            </Link>
                        </div>

                        {recentActivities.length === 0 ? (
                            <p className="text-xs text-gray-500 py-4 text-center">No recent activities recorded.</p>
                        ) : (
                            <div className="space-y-3">
                                {recentActivities.map(item => (
                                    <div key={item.id} className="text-xs space-y-0.5">
                                        <div className="flex items-center justify-between text-gray-400">
                                            <span className="font-semibold text-white">{item.staffName}</span>
                                            <span className="text-[10px] text-gray-500">
                                                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="text-emerald-400 font-medium">
                                            {item.action} {item.productName ? `• ${item.productName}` : ''}
                                        </div>
                                        <div className="text-gray-400 text-[11px] line-clamp-2">
                                            {item.details}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
