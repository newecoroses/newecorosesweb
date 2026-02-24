'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
    Package,
    FolderOpen,
    Calendar,
    Users,
    Star,
    Settings,
    TrendingUp,
    Eye,
    EyeOff,
    ChevronRight,
    AlertCircle,
} from 'lucide-react';

interface Stats {
    products: number;
    collections: number;
    celebrations: number;
    relationships: number;
    testimonials: number;
    visibleProducts: number;
    hiddenProducts: number;
    bestSellers: number;
    newArrivals: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const [
                { count: products },
                { count: collections },
                { count: celebrations },
                { count: relationships },
                { count: testimonials },
                { count: visibleProducts },
                { count: hiddenProducts },
                { count: bestSellers },
                { count: newArrivals },
            ] = await Promise.all([
                supabase.from('products').select('*', { count: 'exact', head: true }),
                supabase.from('collections').select('*', { count: 'exact', head: true }),
                supabase.from('celebrations').select('*', { count: 'exact', head: true }),
                supabase.from('relationships').select('*', { count: 'exact', head: true }),
                supabase.from('testimonials').select('*', { count: 'exact', head: true }),
                supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_visible', true),
                supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_visible', false),
                supabase.from('products').select('*', { count: 'exact', head: true }).eq('tag', 'Best Seller'),
                supabase.from('products').select('*', { count: 'exact', head: true }).eq('tag', 'New Arrival'),
            ]);

            setStats({
                products: products ?? 0,
                collections: collections ?? 0,
                celebrations: celebrations ?? 0,
                relationships: relationships ?? 0,
                testimonials: testimonials ?? 0,
                visibleProducts: visibleProducts ?? 0,
                hiddenProducts: hiddenProducts ?? 0,
                bestSellers: bestSellers ?? 0,
                newArrivals: newArrivals ?? 0,
            });
            setLoading(false);
        };

        fetchStats();
    }, []);

    const STAT_CARDS = [
        { label: 'Total Products', value: stats?.products, icon: Package, color: 'from-blue-500 to-blue-600', href: '/admin/products' },
        { label: 'Collections', value: stats?.collections, icon: FolderOpen, color: 'from-purple-500 to-purple-600', href: '/admin/collections' },
        { label: 'Celebrations', value: stats?.celebrations, icon: Calendar, color: 'from-orange-500 to-orange-600', href: '/admin/celebrations' },
        { label: 'Relationships', value: stats?.relationships, icon: Users, color: 'from-green-500 to-green-600', href: '/admin/relationships' },
        { label: 'Testimonials', value: stats?.testimonials, icon: Star, color: 'from-zinc-200 to-zinc-400 text-zinc-900', href: '/admin/testimonials' },
        { label: 'Visible Products', value: stats?.visibleProducts, icon: Eye, color: 'from-emerald-500 to-emerald-600', href: '/admin/products' },
        { label: 'Hidden Products', value: stats?.hiddenProducts, icon: EyeOff, color: 'from-gray-500 to-gray-600', href: '/admin/products' },
        { label: 'Best Sellers', value: stats?.bestSellers, icon: TrendingUp, color: 'from-rose-500 to-rose-600', href: '/admin/products' },
    ];

    const QUICK_LINKS = [
        { href: '/admin/products', label: 'Manage Products', desc: 'Add, edit, hide or delete products', icon: Package },
        { href: '/admin/collections', label: 'Manage Collections', desc: 'Control product categories', icon: FolderOpen },
        { href: '/admin/testimonials', label: 'Manage Reviews', desc: 'Show/hide customer reviews', icon: Star },
        { href: '/admin/settings', label: 'Site Settings', desc: 'WhatsApp, delivery info, toggles', icon: Settings },
        { href: '/admin/banned-words', label: 'Banned Words', desc: 'Filter unwanted terms', icon: AlertCircle },
        { href: '/admin/celebrations', label: 'Celebrations Calendar', desc: 'Manage upcoming festivals', icon: Calendar },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400 text-sm mt-1">Welcome back! Here's an overview of your website.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {STAT_CARDS.map(({ label, value, icon: Icon, color, href }) => (
                    <Link key={label} href={href} className="group">
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all hover:-translate-y-0.5">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
                                <Icon size={18} className="text-white" />
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">
                                {loading ? (
                                    <span className="w-12 h-7 bg-gray-800 rounded animate-pulse inline-block" />
                                ) : (
                                    value ?? 0
                                )}
                            </p>
                            <p className="text-gray-400 text-xs">{label}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Links */}
            <div className="mb-6">
                <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {QUICK_LINKS.map(({ href, label, desc, icon: Icon }) => (
                        <Link key={href} href={href} className="group">
                            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-zinc-400/30 hover:bg-zinc-800 transition-all">
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

            {/* Info Box */}
            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-5">
                <div className="flex gap-3">
                    <AlertCircle size={18} className="text-zinc-100 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-zinc-300 font-medium text-sm">How the admin panel works</p>
                        <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                            All changes made here instantly update your live website. You can show/hide products, collections, testimonials, and more.
                            Product data from Supabase overrides the static data in your code. Make sure to run the SQL schema first!
                        </p>
                    </div>
                </div>
            </div>

            {/* System Branding */}
            <div className="mt-8 text-center space-y-1">
                <p className="text-gray-400 text-sm tracking-wide">
                    Secured & Managed by{' '}
                    <span className="shine-text text-sm">Oryxen Systems</span>
                </p>
                <p className="text-gray-500 text-xs tracking-wider">
                    System Authority: A. Choudhury
                </p>
            </div>
        </div>
    );
}
