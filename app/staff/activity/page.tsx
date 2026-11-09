'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
    Clock, Search, Filter, RefreshCw, User, Package, Shield,
    CheckCircle2, DollarSign, Eye, AlertTriangle, Sparkles
} from 'lucide-react';

interface ActivityItem {
    id: string;
    staffId: string;
    staffName: string;
    action: string;
    productId?: string;
    productName?: string;
    details: string;
    timestamp: string;
}

export default function StaffActivityPage() {
    const [logs, setLogs] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [actionFilter, setActionFilter] = useState('all');

    const loadLogs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/staff/activity?limit=300');
            if (res.ok) {
                const data = await res.json();
                setLogs(data.logs || []);
            }
        } catch (err) {
            console.error('Failed to load activity logs:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLogs();
    }, [loadLogs]);

    const filteredLogs = useMemo(() => {
        return logs.filter(item => {
            const q = search.toLowerCase();
            const matchesSearch =
                !q ||
                item.staffName.toLowerCase().includes(q) ||
                (item.productName && item.productName.toLowerCase().includes(q)) ||
                item.action.toLowerCase().includes(q) ||
                item.details.toLowerCase().includes(q);

            if (!matchesSearch) return false;

            if (actionFilter !== 'all') {
                const act = item.action.toLowerCase();
                if (actionFilter === 'price' && !act.includes('price')) return false;
                if (actionFilter === 'visibility' && !act.includes('visib')) return false;
                if (actionFilter === 'stock' && !act.includes('stock')) return false;
                if (actionFilter === 'homepage' && !act.includes('home') && !act.includes('featured') && !act.includes('reorder') && !act.includes('section')) return false;
                if (actionFilter === 'auth' && !act.includes('log')) return false;
            }

            return true;
        });
    }, [logs, search, actionFilter]);

    const getActionBadge = (action: string) => {
        const lower = action.toLowerCase();
        if (lower.includes('price')) {
            return { icon: DollarSign, color: 'bg-emerald-950 text-emerald-300 border-emerald-800' };
        }
        if (lower.includes('visib') || lower.includes('live') || lower.includes('hidden')) {
            return { icon: Eye, color: 'bg-blue-950 text-blue-300 border-blue-800' };
        }
        if (lower.includes('stock')) {
            return { icon: Package, color: 'bg-teal-950 text-teal-300 border-teal-800' };
        }
        if (lower.includes('home') || lower.includes('feature') || lower.includes('reorder') || lower.includes('section')) {
            return { icon: Sparkles, color: 'bg-purple-950 text-purple-300 border-purple-800' };
        }
        if (lower.includes('log in') || lower.includes('logged in')) {
            return { icon: CheckCircle2, color: 'bg-green-950 text-green-300 border-green-800' };
        }
        return { icon: Clock, color: 'bg-gray-800 text-gray-300 border-gray-700' };
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
                        <Clock className="w-6 h-6 text-emerald-400" />
                        Activity Audit Trail
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Comprehensive history of product updates, price changes, inventory adjustments, and homepage edits made by staff.
                    </p>
                </div>

                <button
                    onClick={loadLogs}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold self-start sm:self-auto transition-colors border border-gray-700"
                >
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                    Refresh Logs
                </button>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="w-full sm:w-80 relative">
                    <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search by staff, product, or keyword..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-[#030712] border border-gray-700 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    <span className="text-xs text-gray-500 flex items-center gap-1 font-semibold">
                        <Filter className="w-3.5 h-3.5" /> Filter:
                    </span>
                    <button
                        onClick={() => setActionFilter('all')}
                        className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                            actionFilter === 'all'
                                ? 'bg-emerald-600 text-white font-semibold shadow-md'
                                : 'bg-[#030712] text-gray-400 hover:text-white border border-gray-800'
                        }`}
                    >
                        All Actions ({logs.length})
                    </button>
                    <button
                        onClick={() => setActionFilter('price')}
                        className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                            actionFilter === 'price'
                                ? 'bg-emerald-600 text-white font-semibold shadow-md'
                                : 'bg-[#030712] text-gray-400 hover:text-white border border-gray-800'
                        }`}
                    >
                        Pricing
                    </button>
                    <button
                        onClick={() => setActionFilter('stock')}
                        className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                            actionFilter === 'stock'
                                ? 'bg-emerald-600 text-white font-semibold shadow-md'
                                : 'bg-[#030712] text-gray-400 hover:text-white border border-gray-800'
                        }`}
                    >
                        Stock
                    </button>
                    <button
                        onClick={() => setActionFilter('visibility')}
                        className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                            actionFilter === 'visibility'
                                ? 'bg-emerald-600 text-white font-semibold shadow-md'
                                : 'bg-[#030712] text-gray-400 hover:text-white border border-gray-800'
                        }`}
                    >
                        Visibility
                    </button>
                    <button
                        onClick={() => setActionFilter('homepage')}
                        className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                            actionFilter === 'homepage'
                                ? 'bg-emerald-600 text-white font-semibold shadow-md'
                                : 'bg-[#030712] text-gray-400 hover:text-white border border-gray-800'
                        }`}
                    >
                        Homepage
                    </button>
                </div>
            </div>

            {/* Activity Table */}
            {loading ? (
                <div className="py-20 text-center text-gray-400 space-y-3">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-500" />
                    <p className="text-sm">Loading audit trail...</p>
                </div>
            ) : filteredLogs.length === 0 ? (
                <div className="bg-[#111827] border border-gray-800 rounded-3xl p-12 text-center text-gray-400 space-y-2">
                    <Clock className="w-12 h-12 mx-auto text-gray-600 mb-2" />
                    <p className="text-base font-bold text-white">No activity records found</p>
                    <p className="text-xs text-gray-500">Every change made in the staff portal is recorded here automatically.</p>
                </div>
            ) : (
                <div className="bg-[#111827] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-[#030712] text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                                <tr>
                                    <th className="px-5 py-4">Timestamp</th>
                                    <th className="px-4 py-4">Staff Member</th>
                                    <th className="px-4 py-4">Action</th>
                                    <th className="px-4 py-4">Product</th>
                                    <th className="px-5 py-4">Change Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/60 font-normal text-xs">
                                {filteredLogs.map(item => {
                                    const badge = getActionBadge(item.action);
                                    const Icon = badge.icon;
                                    return (
                                        <tr key={item.id} className="hover:bg-gray-800/40 transition-colors">
                                            {/* Timestamp */}
                                            <td className="px-5 py-3.5 text-gray-400 whitespace-nowrap font-mono">
                                                <div>{new Date(item.timestamp).toLocaleDateString()}</div>
                                                <div className="text-[10px] text-gray-500">
                                                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </div>
                                            </td>

                                            {/* Staff Name */}
                                            <td className="px-4 py-3.5 font-semibold text-white whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-md bg-emerald-950 border border-emerald-800 flex items-center justify-center text-[10px] font-bold text-emerald-300">
                                                        {item.staffName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span>{item.staffName}</span>
                                                </div>
                                            </td>

                                            {/* Action badge */}
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-semibold text-[11px] ${badge.color}`}>
                                                    <Icon className="w-3 h-3" />
                                                    {item.action}
                                                </span>
                                            </td>

                                            {/* Product */}
                                            <td className="px-4 py-3.5 text-gray-200">
                                                {item.productName ? (
                                                    item.productId ? (
                                                        <Link
                                                            href={`/staff/products?edit=${encodeURIComponent(item.productId)}`}
                                                            className="hover:text-emerald-400 font-medium hover:underline flex items-center gap-1"
                                                        >
                                                            <span>{item.productName}</span>
                                                        </Link>
                                                    ) : (
                                                        <span>{item.productName}</span>
                                                    )
                                                ) : (
                                                    <span className="text-gray-600">—</span>
                                                )}
                                            </td>

                                            {/* Change details */}
                                            <td className="px-5 py-3.5 text-gray-300 max-w-md break-words font-sans">
                                                {item.details}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
