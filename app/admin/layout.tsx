'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
    LayoutDashboard,
    Package,
    FolderOpen,
    Calendar,
    Users,
    Star,
    Image,
    Settings,
    MessageSquare,
    Shield,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Megaphone,
    Video,
    Sparkles,
    Palette
} from 'lucide-react';

const NAV_ITEMS = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/collections', label: 'Collections', icon: FolderOpen },
    { href: '/admin/celebrations', label: 'Celebrations', icon: Calendar },
    { href: '/admin/relationships', label: 'Relationships', icon: Users },
    { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
    { href: '/admin/banners', label: 'Banners', icon: Image },
    { href: '/admin/featured', label: 'Featured Items', icon: Sparkles },
    { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
    { href: '/admin/review-videos', label: 'Review Videos', icon: Video },
    { href: '/admin/whatsapp', label: 'WhatsApp', icon: MessageSquare },
    { href: '/admin/banned-words', label: 'Banned Words', icon: Shield },
    { href: '/admin/theme', label: 'Theme Colors', icon: Palette },
    { href: '/admin/settings', label: 'Site Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);

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

    const handleLogout = () => {
        Cookies.remove('admin_auth');
        router.push('/admin/login');
    };

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 bottom-0 w-64 bg-gray-900 border-r border-gray-800 z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 lg:static lg:z-auto`}
            >
                {/* Logo */}
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-gray-900 font-bold text-sm">
                            NER
                        </div>
                        <div>
                            <p className="font-semibold text-white text-sm">Admin Panel</p>
                            <p className="text-gray-400 text-xs">New Eco Roses</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-4 px-3">
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest font-medium px-3 mb-3">Navigation</p>
                    {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all group ${isActive
                                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                    }`}
                            >
                                <Icon size={16} className={isActive ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'} />
                                {label}
                                {isActive && <ChevronRight size={12} className="ml-auto" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* User */}
                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                            N
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-medium truncate">Admin</p>
                            <p className="text-gray-500 text-[10px]">Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-gray-400 hover:text-red-400 text-xs py-2 px-3 rounded-lg hover:bg-red-500/10 transition-all"
                    >
                        <LogOut size={14} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-4 gap-4 sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-gray-400 hover:text-white"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="flex-1">
                        <p className="text-white text-sm font-medium">
                            {NAV_ITEMS.find(n => pathname === n.href || (n.href !== '/admin' && pathname.startsWith(n.href)))?.label ?? 'Admin'}
                        </p>
                    </div>

                    <Link
                        href="/"
                        target="_blank"
                        className="text-gray-400 hover:text-yellow-400 text-xs flex items-center gap-1.5 transition-colors"
                    >
                        View Site
                        <ChevronRight size={12} />
                    </Link>
                </header>

                {/* Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
