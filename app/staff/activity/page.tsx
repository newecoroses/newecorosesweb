'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Clock, Search, RefreshCw, User, Package,
    CheckCircle2, DollarSign, Eye, Sparkles
} from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/admin/ui/card';
import { Badge } from '@/components/admin/ui/badge';

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
                if (actionFilter === 'auth' && !act.includes('log')) return false;
            }

            return true;
        });
    }, [logs, search, actionFilter]);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Activity Audit Log"
                description="Chronological audit history of staff logins, order updates & stock inspections"
                tag="Workspace Log"
            >
                <button
                    onClick={loadLogs}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
                >
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                </button>
            </PageHeader>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
                    <div>
                        <CardTitle>Recent Event History</CardTitle>
                        <CardDescription>All team interactions recorded with timestamp</CardDescription>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search activity..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 w-56"
                            />
                        </div>

                        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-xs">
                            {['all', 'price', 'visibility', 'stock', 'auth'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setActionFilter(f)}
                                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer capitalize ${
                                        actionFilter === f
                                            ? 'bg-white text-zinc-950'
                                            : 'text-zinc-400 hover:text-white'
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-0 py-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-white/[0.06] bg-white/[0.01] text-zinc-400 uppercase text-[10px] tracking-wider font-semibold">
                                    <th className="py-3 px-5">Staff Member</th>
                                    <th className="py-3 px-4">Action</th>
                                    <th className="py-3 px-4">Item / Details</th>
                                    <th className="py-3 px-5 text-right">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-zinc-500">
                                            Loading activity trail...
                                        </td>
                                    </tr>
                                ) : filteredLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-zinc-500">
                                            No activity logs matching &ldquo;{search}&rdquo;.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLogs.map(item => (
                                        <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="py-3 px-5 font-semibold text-zinc-200">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[11px] font-bold text-white">
                                                        {item.staffName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span>{item.staffName}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <Badge variant="secondary">{item.action}</Badge>
                                            </td>
                                            <td className="py-3 px-4 text-zinc-300">
                                                {item.productName && (
                                                    <span className="font-semibold text-white mr-1.5">
                                                        [{item.productName}]
                                                    </span>
                                                )}
                                                <span className="text-zinc-400">{item.details}</span>
                                            </td>
                                            <td className="py-3 px-5 text-right text-zinc-500 text-[11px] font-mono">
                                                {new Date(item.timestamp).toLocaleString('en-IN', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
