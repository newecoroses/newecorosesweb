'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
    ChevronDown,
    ArrowUpRight,
    Store,
    Crown,
    BookOpen,
    Lock,
    Loader2,
    Check,
    RefreshCw,
    Shield
} from 'lucide-react';
import { StaffPermissions } from '@/lib/staff-auth';
import { ThemeToggle } from '@/components/admin/ui/theme-toggle';

interface StaffInfo {
    id: string;
    username: string;
    name: string;
    role: 'staff' | 'supervisor' | 'director';
    storeId?: 'director' | 'tollygunge' | 'alipore';
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

function AtanuDirectorIcon({ size = 15, className = "text-amber-400" }: { size?: number; className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 16.1 7.2 18.6l.9-5.3-3.8-3.7 5.3-.8L12 2z" fill="currentColor" fillOpacity="0.25" />
            <circle cx="12" cy="12" r="2.2" fill="currentColor" />
        </svg>
    );
}

const OUTLET_ACCOUNTS = [
    {
        id: 'atanu',
        name: 'Atanu',
        role: 'Boutique Director',
        badge: 'Director (Both Stores)',
        storeId: 'director' as const,
        icon: AtanuDirectorIcon,
        color: 'text-amber-400',
        badgeStyle: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        defaultPin: 'atanu123',
    },
    {
        id: 'tollygunge',
        name: 'Tollygunge Store',
        role: 'Store Counter Staff',
        badge: 'Tollygunge Outlet',
        storeId: 'tollygunge' as const,
        icon: Store,
        color: 'text-emerald-400',
        badgeStyle: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        defaultPin: 'ecorose@tolly',
    },
    {
        id: 'alipore',
        name: 'Alipore Store',
        role: 'Store Counter Staff',
        badge: 'Alipore Outlet',
        storeId: 'alipore' as const,
        icon: Store,
        color: 'text-sky-400',
        badgeStyle: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
        defaultPin: 'ecorose@alipur',
    },
];

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
            { href: '/staff/guide', label: 'User Guide', icon: BookOpen },
        ],
    },
];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [staff, setStaff] = useState<StaffInfo | null>(null);

    // Outlet switcher dropdown & modal
    const [switcherOpen, setSwitcherOpen] = useState(false);
    const [switchTarget, setSwitchTarget] = useState<typeof OUTLET_ACCOUNTS[0] | null>(null);
    const [switchPin, setSwitchPin] = useState('');
    const [switching, setSwitching] = useState(false);
    const [switchError, setSwitchError] = useState('');

    const verifySession = async () => {
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
    };

    useEffect(() => {
        if (pathname === '/staff/login') {
            setLoading(false);
            return;
        }
        verifySession();
    }, [pathname]);

    const handleLogout = async () => {
        try {
            await fetch('/api/staff/auth', { method: 'DELETE' });
        } finally {
            router.push('/staff/login');
        }
    };

    // Quick switch to account
    const triggerSwitch = (target: typeof OUTLET_ACCOUNTS[0]) => {
        setSwitcherOpen(false);
        // If director is switching, we can prefill the default pin or switch seamlessly!
        setSwitchTarget(target);
        setSwitchPin(target.defaultPin);
        setSwitchError('');
    };

    const confirmSwitch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!switchTarget) return;

        setSwitching(true);
        setSwitchError('');
        try {
            const res = await fetch('/api/staff/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: switchTarget.id,
                    password: switchPin || switchTarget.defaultPin,
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setSwitchError(data.error || 'Failed to switch account. Verify PIN.');
                setSwitching(false);
                return;
            }
            // Successfully switched persona
            setSwitchTarget(null);
            setSwitchPin('');
            window.location.reload();
        } catch (err: any) {
            setSwitchError(err.message || 'Error switching account.');
            setSwitching(false);
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

    const isDirector = staff?.role === 'director' || staff?.role === 'supervisor' || staff?.storeId === 'director' || staff?.username === 'atanu';
    const currentOutlet = OUTLET_ACCOUNTS.find(o => o.id === staff?.username || o.storeId === staff?.storeId) || OUTLET_ACCOUNTS[0];

    // Filter nav groups: store staff sees limited nav
    const visibleGroups = STAFF_NAV_GROUPS.map(group => {
        if (isDirector) return group;
        // Store staff: limited options as required
        if (group.group === 'Overview') {
            return { ...group, items: group.items.filter(i => i.href === '/staff') };
        }
        if (group.group === 'Catalog & Merchandising') return null;
        if (group.group === 'Workspace') {
            return { ...group, items: group.items.filter(i => i.href === '/staff/guide') };
        }
        return group;
    }).filter(Boolean) as NavGroup[];

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
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-zinc-100 dark:bg-[#151824] border border-zinc-200 dark:border-zinc-700/50 flex items-center justify-center flex-shrink-0">
                            <img
                                src="/favicon_io/android-chrome-512x512.png"
                                alt="New Eco Roses"
                                width={36}
                                height={36}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = '/favicon_io/android-chrome-192x192.png';
                                }}
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

                {/* 3-IDs Outlet Switcher in Sidebar */}
                <div className="p-3 border-b border-zinc-200 dark:border-white/[0.06] bg-zinc-50/70 dark:bg-white/[0.02]">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-1 mb-1.5 flex items-center justify-between">
                        <span>Active Account</span>
                        <span className="text-[9px] text-zinc-500">Switch ID ▼</span>
                    </div>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setSwitcherOpen(!switcherOpen)}
                            className="w-full flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-[#141724] border border-zinc-200 dark:border-white/[0.1] hover:border-zinc-400 dark:hover:border-zinc-500 text-left transition-all cursor-pointer shadow-2xs"
                        >
                            <div className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-white/[0.08] flex items-center justify-center flex-shrink-0">
                                <currentOutlet.icon size={13} className={currentOutlet.color} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-zinc-900 dark:text-white truncate leading-none">
                                    {currentOutlet.name}
                                </p>
                                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                                    {currentOutlet.badge}
                                </p>
                            </div>
                            <ChevronDown size={14} className={`text-zinc-400 transition-transform ${switcherOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {switcherOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-[#141724] border border-zinc-200 dark:border-white/[0.12] rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-zinc-100 dark:divide-white/[0.06]">
                                {OUTLET_ACCOUNTS.map((outlet) => {
                                    const Icon = outlet.icon;
                                    const isCurrent = outlet.id === staff?.username || outlet.storeId === staff?.storeId;
                                    return (
                                        <button
                                            key={outlet.id}
                                            type="button"
                                            onClick={() => triggerSwitch(outlet)}
                                            className={`w-full flex items-center gap-2.5 p-2.5 text-left transition-colors cursor-pointer ${
                                                isCurrent
                                                    ? 'bg-zinc-100/80 dark:bg-white/[0.08]'
                                                    : 'hover:bg-zinc-50 dark:hover:bg-white/[0.04]'
                                            }`}
                                        >
                                            <div className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-white/[0.08] flex items-center justify-center flex-shrink-0">
                                                <Icon size={13} className={outlet.color} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                                                        {outlet.name}
                                                    </span>
                                                    {isCurrent && (
                                                        <Check size={11} className="text-emerald-500 stroke-[3]" />
                                                    )}
                                                </div>
                                                <span className="text-[9.5px] text-zinc-500 block truncate">
                                                    {outlet.role}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 no-scrollbar">
                    {visibleGroups.map(group => (
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
                <div className="p-3.5 border-t border-zinc-200 dark:border-white/[0.06] bg-zinc-50 dark:bg-[#0b0c13] space-y-2">
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.04] shadow-xs">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 text-white dark:bg-gradient-to-br dark:from-zinc-600 dark:to-zinc-800 flex items-center justify-center font-extrabold text-xs flex-shrink-0 shadow-xs">
                            {staff?.name?.charAt(0).toUpperCase() || 'S'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-zinc-950 dark:text-white text-xs font-bold truncate">{staff?.name || 'Staff'}</p>
                            <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-semibold truncate tracking-wide">
                                {isDirector ? '👑 Boutique Director' : `🏪 ${currentOutlet.name}`}
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

                    <div className="mt-2 text-[10px] text-zinc-500 text-center leading-relaxed">
                        <div>Designed by <span className="text-zinc-800 dark:text-zinc-300 font-semibold">Aditya Choudhury</span></div>
                        <div className="text-zinc-600 dark:text-zinc-400 font-semibold">New Eco Roses</div>
                    </div>
                </div>
            </aside>

            {/* ── Main View Area ─────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white/90 dark:bg-[#0d0f17]/90 backdrop-blur-md border-b border-zinc-200 dark:border-white/[0.08] flex items-center justify-between px-4 sm:px-6 gap-3 sticky top-0 z-30">
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

                    {/* Right: Outlet ID Switcher + Theme + Site Link */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        {/* 3-IDs Dropdown Switcher Button in Header */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setSwitcherOpen(!switcherOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] border border-zinc-200 dark:border-white/[0.1] transition-all cursor-pointer text-xs"
                            >
                                <currentOutlet.icon size={13} className={currentOutlet.color} />
                                <span className="font-bold text-zinc-900 dark:text-white hidden md:inline">
                                    {currentOutlet.name}
                                </span>
                                <span className="font-bold text-zinc-900 dark:text-white md:hidden">
                                    {currentOutlet.id === 'atanu' ? 'Director' : currentOutlet.name.split(' ')[0]}
                                </span>
                                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${currentOutlet.badgeStyle}`}>
                                    {isDirector ? 'Director' : 'Store'}
                                </span>
                                <ChevronDown size={13} className={`text-zinc-400 transition-transform ${switcherOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown in header */}
                            {switcherOpen && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#141724] border border-zinc-200 dark:border-white/[0.12] rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-zinc-100 dark:divide-white/[0.06] animate-in fade-in">
                                    <div className="p-3 bg-zinc-50 dark:bg-white/[0.02]">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                            Switch Staff ID
                                        </p>
                                        <p className="text-[11px] text-zinc-500">
                                            Select boutique account to operate
                                        </p>
                                    </div>
                                    {OUTLET_ACCOUNTS.map((outlet) => {
                                        const Icon = outlet.icon;
                                        const isCurrent = outlet.id === staff?.username || outlet.storeId === staff?.storeId;
                                        return (
                                            <button
                                                key={outlet.id}
                                                type="button"
                                                onClick={() => triggerSwitch(outlet)}
                                                className={`w-full flex items-center gap-3 p-3 text-left transition-colors cursor-pointer ${
                                                    isCurrent
                                                        ? 'bg-zinc-100/80 dark:bg-white/[0.08]'
                                                        : 'hover:bg-zinc-50 dark:hover:bg-white/[0.04]'
                                                }`}
                                            >
                                                <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-white/[0.08] flex items-center justify-center flex-shrink-0">
                                                    <Icon size={15} className={outlet.color} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                                                            {outlet.name}
                                                        </span>
                                                        {isCurrent && (
                                                            <Check size={12} className="text-emerald-500 stroke-[3]" />
                                                        )}
                                                    </div>
                                                    <p className="text-[10.5px] text-zinc-500 truncate">
                                                        {outlet.role}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Live Site */}
                        <Link
                            href="/"
                            target="_blank"
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-zinc-300 dark:hover:text-white text-xs font-semibold border border-zinc-200 dark:border-white/[0.08] transition-all cursor-pointer"
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

            {/* Switch Account PIN Confirmation Modal */}
            {switchTarget && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in"
                    onClick={() => setSwitchTarget(null)}
                >
                    <div
                        className="w-full max-w-sm bg-[#12141c] border border-white/[0.12] rounded-3xl p-6 shadow-2xl space-y-4"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-white/[0.08] flex items-center justify-center">
                                    <switchTarget.icon size={16} className={switchTarget.color} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">Switch to {switchTarget.name}</h3>
                                    <p className="text-[11px] text-zinc-400">{switchTarget.role}</p>
                                </div>
                            </div>
                            <button onClick={() => setSwitchTarget(null)} className="text-zinc-400 hover:text-white p-1">
                                <X size={16} />
                            </button>
                        </div>

                        {switchError && (
                            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                                {switchError}
                            </div>
                        )}

                        <form onSubmit={confirmSwitch} className="space-y-3.5">
                            <div>
                                <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
                                    Account PIN / Password
                                </label>
                                <div className="relative">
                                    <Lock size={14} className="text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="password"
                                        autoFocus
                                        value={switchPin}
                                        onChange={e => setSwitchPin(e.target.value)}
                                        placeholder={`Enter PIN for ${switchTarget.name}`}
                                        className="w-full bg-[#161a26] border border-white/[0.1] focus:border-zinc-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none font-mono"
                                    />
                                </div>
                                <p className="text-[10px] text-zinc-500 mt-1">
                                    Pre-filled PIN: <span className="font-mono text-zinc-400">{switchTarget.defaultPin}</span>
                                </p>
                            </div>

                            <div className="flex gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setSwitchTarget(null)}
                                    className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={switching}
                                    className="flex-1 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                                >
                                    {switching ? (
                                        <>
                                            <Loader2 size={13} className="animate-spin" />
                                            <span>Switching...</span>
                                        </>
                                    ) : (
                                        <span>Confirm Switch</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
