'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle, Loader2, Sparkles } from 'lucide-react';

export default function StaffLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to sign in');
                setLoading(false);
                return;
            }

            // Successfully authenticated, navigate to dashboard
            router.push('/staff');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Network error occurred');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d1117] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
            {/* Background glowing effects */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                {/* Branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-xl shadow-emerald-950/50 mb-4">
                        <div className="w-full h-full bg-[#161b22] rounded-[14px] flex items-center justify-center">
                            <ShieldCheck className="w-7 h-7 text-emerald-400" />
                        </div>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Staff Product Portal
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-400 mt-2">
                        New Eco Roses &bull; Authorized Staff Access Only
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-xl">
                    {error && (
                        <div className="mb-5 p-3.5 bg-red-950/70 border border-red-700/80 text-red-200 text-xs sm:text-sm rounded-xl flex items-start gap-2.5 animate-in fade-in">
                            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 block mb-1.5">
                                Staff Username
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className="w-full bg-[#0d1117] border border-gray-700 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 block mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    required
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-[#0d1117] border border-gray-700 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        Sign In to Portal
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 pt-5 border-t border-gray-800 text-center">
                        <p className="text-xs text-gray-500">
                            Looking for the main admin console?{' '}
                            <Link href="/admin/login" className="text-emerald-400 hover:underline">
                                Admin Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Secure footer note */}
                <div className="text-center mt-6 text-xs text-gray-600 flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500/70" />
                    <span>Real-time catalog synchronization with main website</span>
                </div>
            </div>
        </div>
    );
}
