'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Flower } from 'lucide-react';
import Cookies from 'js-cookie';

export default function AdminLogin() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Custom fixed password logic + Supabase Auth
        if (password === 'newecoroses@1209') {
            const { supabase } = await import('@/lib/supabase');
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: 'admin@newecoroses.com',
                password: password,
            });

            if (signInError) {
                setError('Authentication failed. Please check the backend.');
                setLoading(false);
                return;
            }

            // Set an authentication cookie directly
            Cookies.set('admin_auth', 'true', { expires: 7 }); // Expires in 7 days
            router.push('/admin');
        } else {
            setError('Incorrect password. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            {/* Background glow */}
            <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-zinc-100 text-zinc-900/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-200 to-zinc-400 text-zinc-900 flex items-center justify-center mb-4 shadow-lg">
                            <Flower size={28} className="text-white" />
                        </div>
                        <h1 className="text-white text-2xl font-bold">Admin Login</h1>
                        <p className="text-gray-400 text-sm mt-1">New Eco Roses Control Panel</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-2">
                                Admin Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-300/30 transition-all placeholder:text-gray-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-zinc-200 to-zinc-400 text-zinc-900 hover:from-white hover:to-zinc-200 text-gray-900 font-bold py-3 rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                                    Verifying...
                                </span>
                            ) : (
                                'Access Admin Panel'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-gray-600 text-xs mt-6">
                        Authorized access only.
                    </p>
                </div>
            </div>
        </div>
    );
}
