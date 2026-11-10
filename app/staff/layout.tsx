'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    BarChart3,
    Users,
    Clock,
    LogOut,
    Menu,
    X,
    ChevronRight,
    ArrowUpRight,
    Search,
    ShieldCheck
} from 'lucide-react';
import { StaffPermissions } from '@/lib/staff-auth';
import { ThemeToggle } from '@/components/admin/ui/theme-toggle';

interface StaffInfo {
    id: string;
    username: string;
    name: string;
    role: 'staff' | 'supervisor';
    permissions?: StaffPermissions;
}

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

const STAFF_NAV_GROUPS: NavGroup[] = [
    {
        group: 'Overview',
        items: [
            { href: '/staff', label: 'Dashboard', icon: LayoutDashboard, exact: true },
            { href: '/staff/analytics', label: 'Analytics', icon: BarChart3 },
        ],
    },
    {
        group: 'Operations',
        items: [
            { href: '/staff/orders', label: 'Orders & Deliveries', icon: ShoppingBag, badge: 'Live' },
            { href: '/staff/customers', label: 'Customers & Reception', icon: Users },
        ],
    },
    {
        group: 'Catalog & Merchandising',
        items: [
            { href: '/staff/products', label: 'Products & Best Picks', icon: Package },
        ],
    },
    {
        group: 'Workspace',
        items: [
            { href: '/staff/activity', label: 'Activity Log', icon: Clock },
        ],
    },
];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [staff, setStaff] = useState<StaffInfo | null>(null);

    useEffect(() => {
        if (pathname === '/staff/login') {
            setLoading(false);
            return;
        }

        async function verify() {
            try {
                const res = await fetch('/api/staff/auth');
                if (!res.ok) {
                    router.push('/staff/login');
                    return;
                }
                const data = await res.json();
                if (data.authenticated && data.staff) {
                    setStaff(data.staff);
                    setLoading(false);
                } else {
                    router.push('/staff/login');
                }
            } catch {
                router.push('/staff/login');
            }
        }
        verify();
    }, [pathname, router]);

    const handleLogout = async () => {
        try {
            await fetch('/api/staff/auth', { method: 'DELETE' });
        } finally {
            router.push('/staff/login');
        }
    };

    if (pathname === '/staff/login') {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#090a0f] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const allItems = STAFF_NAV_GROUPS.flatMap(g => g.items);
    const currentItem = allItems.find(item =>
        item.exact ? pathname === item.href : pathname.startsWith(item.href)
    );

    return (
        <div className="h-screen bg-slate-50 dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 flex overflow-hidden font-sans">
            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 dark:bg-black/80 z-40 lg:hidden backdrop-blur-xs transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Modern Sidebar ────────────────────────────────────── */}
            <aside
                className={`fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-[#0d0f17] border-r border-zinc-200 dark:border-white/[0.08] z-50 flex flex-col transition-all duration-300 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 lg:static lg:z-auto`}
            >
                {/* Brand Header */}
                <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-white/[0.06] flex items-center justify-between">
                    <Link
                        href="/staff"
                        className="flex items-center gap-3 select-none group min-w-0"
                    >
                        <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-zinc-100 dark:bg-[#151824] border border-zinc-200 dark:border-zinc-700/50 flex items-center justify-center flex-shrink-0">
                            <NextImage
                                src="/favicon_io/android-chrome-192x192.png"
                                alt="New Eco Roses"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="min-w-0">
                            <p className="font-serif font-black text-zinc-950 dark:text-white text-sm tracking-wide truncate group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                                NEW ECO ROSES
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
                                    Staff Portal
                                </span>
                            </div>
                        </div>
                    </Link>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-1 rounded-lg"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 no-scrollbar">
                    {STAFF_NAV_GROUPS.map(group => (
                        <div key={group.group}>
                            <p className="text-zinc-400 dark:text-zinc-500 text-[10px] uppercase tracking-widest font-bold px-3 mb-2">
                                {group.group}
                            </p>
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
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                                                isActive
                                                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-xs'
                                                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/[0.05]'
                                            }`}
                                        >
                                            <Icon
                                                size={16}
                                                className={`flex-shrink-0 transition-transform group-hover:scale-105 ${
                                                    isActive
                                                        ? 'text-white dark:text-zinc-950 stroke-[2.5px]'
                                                        : 'text-zinc-500 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-200'
                                                }`}
                                            />
                                            <span className="truncate">{item.label}</span>
                                            {item.badge && (
                                                <span
                                                    className={`ml-auto text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                                                        isActive
                                                            ? 'bg-white/20 text-white dark:bg-zinc-900 dark:text-white'
                                                            : 'bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700'
                                                    }`}
                                                >
                                                    {item.badge}
                                                </span>
                                            )}
                                            {isActive && !item.badge && (
                                                <ChevronRight size={13} className="ml-auto opacity-70" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Footer User Profile & Logout */}
                <div className="p-3.5 border-t border-zinc-200 dark:border-white/[0.06] bg-zinc-50 dark:bg-[#0b0c13]">
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.04] shadow-xs">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 text-white dark:bg-gradient-to-br dark:from-zinc-600 dark:to-zinc-800 flex items-center justify-center font-extrabold text-xs flex-shrink-0 shadow-xs">
                            {staff?.name?.charAt(0).toUpperCase() || 'S'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-zinc-950 dark:text-white text-xs font-bold truncate">{staff?.name || 'Store Executive'}</p>
                            <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-semibold truncate tracking-wide">
                                {staff?.name?.toLowerCase().includes('atanu') || staff?.role === 'supervisor'
                                    ? 'Boutique Director'
                                    : 'Store Executive'}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            title="Sign Out"
                            className="text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors ml-auto cursor-pointer"
                        >
                            <LogOut size={15} />
                        </button>
                    </div>

                    <div className="mt-3 pt-2 border-t border-zinc-200 dark:border-white/[0.04] text-[10px] text-zinc-500 text-center leading-relaxed">
                        <div>Designed by{' '}<span className="text-zinc-800 dark:text-zinc-300 font-semibold">Aditya Choudhury</span></div>
                        <div className="text-zinc-600 dark:text-zinc-400 font-semibold mt-0.5">New Eco Roses</div>
                    </div>
                </div>
            </aside>

            {/* ── Main View Area ─────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white/90 dark:bg-[#0d0f17]/90 backdrop-blur-md border-b border-zinc-200 dark:border-white/[0.08] flex items-center justify-between px-4 sm:px-6 gap-4 sticky top-0 z-30">
                    {/* Left: Mobile hamburger + Breadcrumb */}
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                            <Menu size={20} />
                        </button>

                        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                            <Link href="/staff" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                                Staff Portal
                            </Link>
                            <ChevronRight size={13} className="text-zinc-400 dark:text-zinc-600" />
                            <span className="text-zinc-950 dark:text-white font-semibold truncate">
                                {currentItem?.label ?? 'Dashboard'}
                            </span>
                        </div>
                    </div>

                    {/* Right: Theme Toggle & Site Link */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Staff Portal Active</span>
                        </div>

                        {/* Dark / Light Mode Switch */}
                        <ThemeToggle />

                        <Link
                            href="/"
                            target="_blank"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-zinc-300 dark:hover:text-white text-xs font-semibold border border-zinc-200 dark:border-white/[0.08] transition-all cursor-pointer"
                        >
                            <span>Live Site</span>
                            <ArrowUpRight size={13} />
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-50 dark:bg-[#090a0f]">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
