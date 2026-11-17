'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Lock,
    ArrowRight,
    AlertCircle,
    Loader2,
    Eye,
    EyeOff,
    Shield,
    ArrowUpRight,
    ChevronDown,
    Store,
    Crown,
} from 'lucide-react';

const OUTLETS = [
    {
        id: 'atanu',
        label: 'Atanu Jana',
        sublabel: 'Boutique Director',
        icon: Crown,
        iconColor: 'text-amber-400',
        badge: 'Director',
        badgeStyle: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    },
    {
        id: 'tollygunge',
        label: 'Tollygunge Store',
        sublabel: 'Outlet Staff Login',
        icon: Store,
        iconColor: 'text-emerald-400',
        badge: 'Store',
        badgeStyle: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    {
        id: 'alipore',
        label: 'Alipore Store',
        sublabel: 'Outlet Staff Login',
        icon: Store,
        iconColor: 'text-sky-400',
        badge: 'Store',
        badgeStyle: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    },
];

export default function StaffLoginPage() {
    const router = useRouter();
    const [selectedOutlet, setSelectedOutlet] = useState(OUTLETS[0]);
    const [outletDropdownOpen, setOutletDropdownOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/staff/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: selectedOutlet.id, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to sign in. Please verify your credentials.');
                setLoading(false);
                return;
            }

            router.push('/staff');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Network error occurred. Please try again.');
            setLoading(false);
        }
    };

    const OutletIcon = selectedOutlet.icon;

    return (
        <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col justify-between items-center px-4 py-8 sm:py-12 relative overflow-hidden font-sans select-none">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-white/[0.04] via-transparent to-transparent blur-3xl pointer-events-none" />
            <div className="absolute top-1/3 -left-40 w-96 h-96 bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />

            {/* Central Login Card */}
            <div className="w-full max-w-md relative z-10 my-auto py-6">
                {/* Branding */}
                <div className="text-center mb-7">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#151824] border border-white/10 shadow-2xl flex items-center justify-center p-2 mb-4 mx-auto group">
                        <img
                            src="/favicon_io/android-chrome-512x512.png"
                            alt="New Eco Roses Logo"
                            width={64}
                            height={64}
                            className="w-full h-full object-contain rounded-xl transition-transform group-hover:scale-105"
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/favicon_io/android-chrome-192x192.png';
                            }}
                        />
                    </div>
                    <p className="font-serif font-black text-white text-base tracking-widest uppercase">
                        NEW ECO ROSES
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                        Staff &amp; Reception Portal
                    </h1>
                    <p className="text-xs text-zinc-400 mt-1.5">
                        Live order fulfilment, boutique check-in &amp; catalog controls
                    </p>
                </div>

                {/* Card Container */}
                <div className="relative bg-[#0f1118]/95 border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    {error && (
                        <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-start gap-2.5 animate-in fade-in">
                            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Outlet Selector */}
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block mb-1.5">
                                Select Account
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setOutletDropdownOpen(!outletDropdownOpen)}
                                    className="w-full bg-[#141724] border border-white/[0.08] hover:border-zinc-500 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all flex items-center gap-3 cursor-pointer"
                                >
                                    <div className={`w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0`}>
                                        <OutletIcon size={15} className={selectedOutlet.iconColor} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="font-semibold text-white text-sm leading-none">{selectedOutlet.label}</div>
                                        <div className="text-[11px] text-zinc-500 mt-0.5">{selectedOutlet.sublabel}</div>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${selectedOutlet.badgeStyle}`}>
                                        {selectedOutlet.badge}
                                    </span>
                                    <ChevronDown size={15} className={`text-zinc-400 transition-transform ${outletDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {outletDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#141724] border border-white/[0.1] rounded-xl shadow-2xl z-50 overflow-hidden">
                                        {OUTLETS.map((outlet) => {
                                            const Icon = outlet.icon;
                                            return (
                                                <button
                                                    key={outlet.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedOutlet(outlet);
                                                        setOutletDropdownOpen(false);
                                                        setPassword('');
                                                        setError(null);
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.04] transition-colors cursor-pointer ${
                                                        selectedOutlet.id === outlet.id ? 'bg-white/[0.06]' : ''
                                                    }`}
                                                >
                                                    <div className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                                                        <Icon size={14} className={outlet.iconColor} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-white text-sm">{outlet.label}</div>
                                                        <div className="text-[11px] text-zinc-500">{outlet.sublabel}</div>
                                                    </div>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${outlet.badgeStyle}`}>
                                                        {outlet.badge}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                                    Password
                                </label>
                                <span className="text-[11px] text-zinc-500">Boutique Pin</span>
                            </div>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autoFocus
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-[#141724] border border-white/[0.08] focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/20 rounded-xl pl-10 pr-12 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none transition-all font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1 cursor-pointer"
                                    title={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-white text-zinc-950 hover:bg-zinc-200 active:scale-[0.99] font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                                        <span>Authenticating...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In as {selectedOutlet.label}</span>
                                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Quick helper note */}
                    <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
                        <p className="text-xs text-zinc-500">
                            Executive or owner access?{' '}
                            <Link
                                href="/admin/login"
                                className="text-white hover:underline font-semibold inline-flex items-center gap-0.5 ml-1"
                            >
                                <span>Admin Console</span>
                                <ArrowUpRight size={12} />
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Security Tagline */}
                <div className="text-center mt-5 text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
                    <Shield size={12} className="text-zinc-400" />
                    <span>Protected staff session with role-based access control</span>
                </div>
            </div>

            {/* Footer with Attribution */}
            <div className="w-full text-center text-[10px] text-zinc-500 leading-relaxed z-10 pt-4">
                <div>Designed by{' '}<span className="text-zinc-400 font-semibold">Aditya Choudhury</span></div>
                <div className="text-zinc-500 font-semibold mt-0.5">New Eco Roses</div>
            </div>
        </div>
    );
}
