'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
    LayoutDashboard,
    Package,
    FolderOpen,
    Calendar,
    Users,
    Star,
    Image as ImageIcon,
    Settings,
    MessageSquare,
    Shield,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Megaphone,
    Sparkles,
    BarChart3,
    UserCheck,
    ShoppingBag,
    ArrowUpRight,
    Search,
    Tag,
    ExternalLink
} from 'lucide-react';
import { ThemeToggle } from '@/components/admin/ui/theme-toggle';

interface NavItem {
    href: string;
    label: string;
    icon: any;
    badge?: string;
    exact?: boolean;
}

interface NavGroup {
    group: string;
    items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
    {
        group: 'Overview',
        items: [
            { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
            { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
        ],
    },
    {
        group: 'E-Commerce',
        items: [
            { href: '/admin/orders', label: 'Orders', icon: ShoppingBag, badge: 'Live' },
            { href: '/admin/customers', label: 'Customers', icon: Users },
            { href: '/admin/inventory', label: 'Inventory', icon: Package },
            { href: '/admin/discounts', label: 'Discounts', icon: Tag },
        ],
    },
    {
        group: 'Catalog',
        items: [
            { href: '/admin/products', label: 'Products', icon: Package },
            { href: '/admin/collections', label: 'Collections', icon: FolderOpen },
            { href: '/admin/celebrations', label: 'Celebrations', icon: Calendar },
            { href: '/admin/relationships', label: 'Relationships', icon: Users },
            { href: '/admin/featured', label: 'Featured Picks', icon: Sparkles },
        ],
    },
    {
        group: 'Marketing',
        items: [
            { href: '/admin/banners', label: 'Banners Slider', icon: ImageIcon },
            { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
            { href: '/admin/testimonials', label: 'Customer Reviews', icon: Star },
        ],
    },
    {
        group: 'Settings',
        items: [
            { href: '/admin/staff', label: 'Staff Management', icon: UserCheck },
            { href: '/admin/whatsapp', label: 'WhatsApp Automation', icon: MessageSquare },
            { href: '/admin/banned-words', label: 'Banned Words', icon: Shield },
            { href: '/admin/settings', label: 'Site Settings', icon: Settings },
        ],
    },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const checkAuth = () => {
            const isAuth = Cookies.get('admin_auth') === 'true';

            if (!isAuth && pathname !== '/admin/login') {
                router.push('/admin/login');
            }
            setLoading(false);
        };
        checkAuth();
    }, [pathname, router]);

    // Keyboard shortcut for Cmd+K search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setSearchOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleLogout = async () => {
        Cookies.remove('admin_auth');
        const { supabase } = await import('@/lib/supabase');
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#090a0f] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Active item & breadcrumbs helper
    const allItems = NAV_GROUPS.flatMap(g => g.items);
    const currentItem = allItems.find(item =>
        item.exact ? pathname === item.href : pathname.startsWith(item.href)
    );

    // Search results for command palette
    const searchResults = allItems.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-screen bg-[#090a0f] text-zinc-100 flex overflow-hidden font-sans">
            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-xs transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── OrbynAdmin Sidebar ───────────────────────────────────── */}
            <aside
                className={`fixed top-0 left-0 bottom-0 ${collapsed ? 'w-20' : 'w-64'} bg-[#0d0f17] border-r border-white/[0.08] z-50 flex flex-col transition-all duration-300 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 lg:static lg:z-auto`}
            >
                {/* Brand Header */}
                <div className="p-4 sm:p-5 border-b border-white/[0.06] flex items-center justify-between">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 select-none group min-w-0"
                    >
                        <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-[#151824] border border-zinc-700/50 flex items-center justify-center flex-shrink-0">
                            <NextImage
                                src="/favicon_io/android-chrome-192x192.png"
                                alt="New Eco Roses"
                                fill
                                className="object-cover"
                            />
                        </div>
                        {!collapsed && (
                            <div className="min-w-0">
                                <p className="font-serif font-black text-white text-sm tracking-wide truncate group-hover:text-zinc-300 transition-colors">
                                    NEW ECO ROSES
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                                        Admin Panel
                                    </span>
                                </div>
                            </div>
                        )}
                    </Link>

                    {/* Mobile close button */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-zinc-400 hover:text-white p-1 rounded-lg"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Navigation Items (Grouped OrbynAdmin Style) */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 no-scrollbar">
                    {NAV_GROUPS.map(group => (
                        <div key={group.group}>
                            {!collapsed && (
                                <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold px-3 mb-2">
                                    {group.group}
                                </p>
                            )}
                            <div className="space-y-0.5">
                                {group.items.map(item => {
                                    const Icon = item.icon;
                                    const isActive = item.exact
                                        ? pathname === item.href
                                        : pathname.startsWith(item.href);

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            title={collapsed ? item.label : undefined}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                                                isActive
                                                    ? 'bg-white text-black shadow-md font-bold'
                                                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                                            }`}
                                        >
                                            <Icon
                                                size={16}
                                                className={`flex-shrink-0 transition-transform group-hover:scale-105 ${
                                                    isActive ? 'text-black stroke-[2.5px]' : 'text-zinc-400 group-hover:text-zinc-200'
                                                }`}
                                            />                                            {!collapsed && (
                                                <>
                                                    <span className="truncate">{item.label}</span>
                                                    {item.badge && (
                                                        <span
                                                            className={`ml-auto text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                                                                isActive
                                                                    ? 'bg-black/20 text-black'
                                                                    : 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                                                            }`}
                                                        >
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                    {isActive && !item.badge && (
                                                        <ChevronRight size={13} className="ml-auto opacity-70" />
                                                    )}
                                                </>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Footer User Profile & Logout */}
                <div className="p-3.5 border-t border-white/[0.06] bg-[#0b0c13]">
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 flex items-center justify-center text-white font-extrabold text-xs flex-shrink-0">
                            A
                        </div>
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-xs font-bold truncate">Store Admin</p>
                                <p className="text-zinc-500 text-[10px] truncate">admin@newecoroses.com</p>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            title="Sign Out"
                            className="text-zinc-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors ml-auto cursor-pointer"
                        >
                            <LogOut size={15} />
                        </button>
                    </div>

                    {!collapsed && (
                        <div className="mt-3 pt-2 border-t border-white/[0.04] text-[10px] text-zinc-500 text-center leading-relaxed">
                            <span>Designed by{' '}<span className="text-zinc-300 font-semibold">Aditya Choudhury</span></span>
                            <br />
                            <span className="text-zinc-400 font-semibold">New Eco Roses</span>
                        </div>
                    )}
                </div>
            </aside>

            {/* ── Main View Area ─────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* OrbynAdmin Header */}
                <header className="h-16 bg-[#0d0f17]/90 backdrop-blur-md border-b border-white/[0.08] flex items-center justify-between px-4 sm:px-6 gap-4 sticky top-0 z-30">
                    {/* Left: Mobile hamburger + Breadcrumb */}
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                            <Menu size={20} />
                        </button>

                        {/* Breadcrumbs */}
                        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-zinc-400">
                            <Link href="/admin" className="hover:text-zinc-200 transition-colors">
                                Admin
                            </Link>
                            <ChevronRight size={13} className="text-zinc-600" />
                            <span className="text-white font-semibold truncate">
                                {currentItem?.label ?? 'Dashboard'}
                            </span>
                        </div>
                    </div>

                    {/* Center: Quick Search Trigger */}
                    <button
                        type="button"
                        onClick={() => setSearchOpen(true)}
                        className="hidden md:flex items-center gap-3 px-3.5 py-1.5 bg-[#141724] hover:bg-[#1a1e2f] border border-white/[0.08] rounded-xl text-xs text-zinc-400 transition-all cursor-pointer w-72"
                    >
                        <Search size={14} className="text-zinc-400" />
                        <span className="truncate">Search catalog, orders, settings...</span>
                        <kbd className="ml-auto text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700 font-mono">
                            ⌘K
                        </kbd>
                    </button>

                    {/* Right: Live Status Pill & Store Link */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        {/* Live Status Indicator */}
                        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Store Live</span>
                        </div>

                        {/* Dark / Light Mode Switch */}
                        <ThemeToggle />

                        {/* View Storefront CTA */}
                        <Link
                            href="/"
                            target="_blank"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white text-xs font-semibold border border-white/[0.08] transition-all cursor-pointer"
                        >
                            <span>Live Site</span>
                            <ArrowUpRight size={13} />
                        </Link>
                    </div>
                </header>

                {/* Page Content Container */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#090a0f]">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Command Palette Modal (Cmd+K) */}
            {searchOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
                    onClick={() => setSearchOpen(false)}
                >
                    <div
                        className="relative w-full max-w-lg bg-[#12141c] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-3 border-b border-white/[0.08] flex items-center gap-2.5">
                            <Search size={16} className="text-zinc-400" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Jump to page or tool..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
                            />
                            <kbd className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700">
                                ESC
                            </kbd>
                        </div>
                        <div className="p-2 max-h-72 overflow-y-auto space-y-1">
                            {searchResults.length === 0 ? (
                                <p className="text-center py-6 text-xs text-zinc-500">
                                    No administrative pages found matching &ldquo;{searchQuery}&rdquo;
                                </p>
                            ) : (
                                searchResults.map(item => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.href}
                                            type="button"
                                            onClick={() => {
                                                setSearchOpen(false);
                                                router.push(item.href);
                                            }}
                                            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.06] text-left text-xs text-zinc-200 transition-colors cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <Icon size={15} className="text-zinc-400 group-hover:text-zinc-400" />
                                                <span className="font-semibold text-white">{item.label}</span>
                                            </div>
                                            <span className="text-[11px] text-zinc-500 font-mono">
                                                {item.href}
                                            </span>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
