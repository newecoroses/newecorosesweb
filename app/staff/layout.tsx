'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    Sparkles,
    Clock,
    LogOut,
    Menu,
    X,
    ExternalLink,
    ShieldCheck,
    ChevronRight,
    User,
    CheckCircle2,
    Lock
} from 'lucide-react';
import { StaffPermissions } from '@/lib/staff-auth';

interface StaffInfo {
    id: string;
    username: string;
    name: string;
    role: 'staff' | 'supervisor';
    permissions: StaffPermissions;
}

const NAV_ITEMS = [
    { href: '/staff', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/staff/products', label: 'Product Catalog', icon: Package },
    { href: '/staff/homepage', label: 'Homepage Sections', icon: Sparkles },
    { href: '/staff/activity', label: 'Activity Audit Log', icon: Clock },
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
            <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-gray-400 font-medium">Verifying staff credentials...</p>
            </div>
        );
    }

    return (
        <div className="h-screen bg-[#0d1117] flex overflow-hidden font-sans">
            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 bottom-0 w-64 bg-[#161b22] border-r border-gray-800 z-50 flex flex-col transition-transform duration-300 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 lg:static lg:z-auto`}
            >
                {/* Brand Logo & Portal Tag */}
                <div className="h-16 border-b border-gray-800 px-5 flex items-center justify-between">
                    <Link href="/staff" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-950/40">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="font-extrabold text-white text-sm tracking-tight block">
                                New Eco Roses
                            </span>
                            <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider block">
                                Staff Portal
                            </span>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-white p-1 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Staff User Card */}
                {staff && (
                    <div className="p-4 mx-3 my-3 bg-[#0d1117] rounded-2xl border border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-300 font-bold text-sm">
                                {staff.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-white truncate">{staff.name}</div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/40">
                                        {staff.role}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation links */}
                <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                    {NAV_ITEMS.map(item => {
                        const Icon = item.icon;
                        const active = pathname === item.href || (item.href !== '/staff' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                    active
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 font-semibold'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-400'}`} />
                                <span className="flex-1">{item.label}</span>
                                {active && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-3 border-t border-gray-800 space-y-1">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center justify-between px-3.5 py-2 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800/60 rounded-xl transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                            View Live Website
                        </span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-xl transition-colors text-left"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 bg-[#161b22] border-b border-gray-800 px-4 sm:px-6 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="hidden sm:block">
                            <span className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                                Staff Portal
                            </span>
                            <span className="mx-2 text-gray-600">&bull;</span>
                            <span className="text-xs text-emerald-400 font-medium">
                                Real-time Website Sync
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            target="_blank"
                            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors border border-gray-700"
                        >
                            <span>Live Store</span>
                            <ExternalLink className="w-3 h-3 text-emerald-400" />
                        </Link>
                        {staff && (
                            <div className="flex items-center gap-2 pl-3 border-l border-gray-800">
                                <div className="text-right hidden sm:block">
                                    <div className="text-xs font-semibold text-white leading-tight">{staff.name}</div>
                                    <div className="text-[10px] text-gray-400 capitalize">{staff.role}</div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-700 flex items-center justify-center text-xs font-bold text-emerald-300">
                                    {staff.name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-[#0d1117] p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
