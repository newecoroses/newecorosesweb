'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(m => m.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(m => m.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(m => m.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(m => m.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false });

export interface RevenueDataPoint {
    label: string;
    revenue: number;
    orders: number;
    enquiries: number; // WhatsApp enquiries
    clicks?: number;   // Website visits/clicks
}

interface RevenueAreaChartProps {
    data?: RevenueDataPoint[];
    height?: number;
}

const DEFAULT_7D_DATA: RevenueDataPoint[] = [
    { label: 'Mon', revenue: 14200, orders: 8, enquiries: 18, clicks: 85 },
    { label: 'Tue', revenue: 19800, orders: 12, enquiries: 26, clicks: 112 },
    { label: 'Wed', revenue: 16500, orders: 9, enquiries: 22, clicks: 96 },
    { label: 'Thu', revenue: 24300, orders: 15, enquiries: 34, clicks: 140 },
    { label: 'Fri', revenue: 31000, orders: 18, enquiries: 41, clicks: 175 },
    { label: 'Sat', revenue: 42500, orders: 26, enquiries: 58, clicks: 230 },
    { label: 'Sun', revenue: 48900, orders: 31, enquiries: 64, clicks: 265 },
];

function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#12141c] border border-zinc-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-md min-w-[170px]">
                <p className="text-xs font-bold text-zinc-300 mb-2 border-b border-zinc-800 pb-1">{label}</p>
                <div className="space-y-1.5">
                    {payload.map((entry: any, index: number) => (
                        <div key={`item-${index}`} className="flex items-center justify-between gap-4 text-xs">
                            <span className="flex items-center gap-1.5 font-medium" style={{ color: entry.color }}>
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                {entry.name}:
                            </span>
                            <span className="font-bold text-white tabular-nums">
                                {entry.dataKey === 'revenue' ? `₹${entry.value.toLocaleString('en-IN')}` : entry.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
}

export function RevenueAreaChart({ data = DEFAULT_7D_DATA, height = 300 }: RevenueAreaChartProps) {
    const [activeFilter, setActiveFilter] = useState<'all' | 'whatsapp' | 'clicks' | 'orders' | 'revenue'>('all');

    return (
        <div className="w-full">
            {/* Chart series filters */}
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs flex-wrap">
                    <button
                        onClick={() => setActiveFilter('all')}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer border ${
                            activeFilter === 'all'
                                ? 'bg-zinc-800 text-white border-zinc-600 font-semibold'
                                : 'bg-transparent text-zinc-400 border-transparent hover:text-zinc-200'
                        }`}
                    >
                        All Activity
                    </button>
                    <button
                        onClick={() => setActiveFilter('whatsapp')}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer border ${
                            activeFilter === 'whatsapp'
                                ? 'bg-[#25D366]/20 text-[#25D366] border-[#25D366]/50 font-semibold'
                                : 'bg-transparent text-zinc-400 border-transparent hover:text-[#25D366]'
                        }`}
                    >
                        🟢 WhatsApp Enquiries
                    </button>
                    <button
                        onClick={() => setActiveFilter('clicks')}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer border ${
                            activeFilter === 'clicks'
                                ? 'bg-sky-500/20 text-sky-400 border-sky-500/50 font-semibold'
                                : 'bg-transparent text-zinc-400 border-transparent hover:text-sky-300'
                        }`}
                    >
                        🔵 Website Clicks
                    </button>
                    <button
                        onClick={() => setActiveFilter('orders')}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer border ${
                            activeFilter === 'orders'
                                ? 'bg-purple-500/20 text-purple-400 border-purple-500/50 font-semibold'
                                : 'bg-transparent text-zinc-400 border-transparent hover:text-purple-300'
                        }`}
                    >
                        🟣 Orders
                    </button>
                    <button
                        onClick={() => setActiveFilter('revenue')}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer border ${
                            activeFilter === 'revenue'
                                ? 'bg-white text-black border-white font-semibold'
                                : 'bg-transparent text-zinc-400 border-transparent hover:text-zinc-200'
                        }`}
                    >
                        Revenue (₹)
                    </button>
                </div>

                {/* Legend with matching colors */}
                <div className="flex items-center gap-4 text-[11px] font-medium text-zinc-400 flex-wrap">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] shadow-[0_0_8px_#25D366]" />
                        <span className="text-zinc-300">WhatsApp Enquiry</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
                        <span className="text-zinc-300">Website Clicks</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" />
                        <span className="text-zinc-300">Orders</span>
                    </span>
                </div>
            </div>

            {/* Recharts Area Container */}
            <div style={{ width: '100%', height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            {/* WhatsApp Green Gradient */}
                            <linearGradient id="colorWhatsapp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#25D366" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#25D366" stopOpacity={0.01} />
                            </linearGradient>
                            {/* Website Clicks Sky Blue Gradient */}
                            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.01} />
                            </linearGradient>
                            {/* Orders Purple Gradient */}
                            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.01} />
                            </linearGradient>
                            {/* Revenue White Gradient */}
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#ffffff" stopOpacity={0.01} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#262833" vertical={false} />
                        <XAxis
                            dataKey="label"
                            stroke="#52525b"
                            tick={{ fill: '#71717a', fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#52525b"
                            tick={{ fill: '#71717a', fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => {
                                if (activeFilter === 'revenue') {
                                    return val >= 1000 ? `₹${(val / 1000).toFixed(0)}k` : `₹${val}`;
                                }
                                return val >= 1000 ? `${(val / 1000).toFixed(1)}k` : `${val}`;
                            }}
                        />
                        <Tooltip content={<CustomTooltip />} />

                        {/* WhatsApp Enquiries (Green) */}
                        {(activeFilter === 'all' || activeFilter === 'whatsapp') && (
                            <Area
                                type="monotone"
                                dataKey="enquiries"
                                name="WhatsApp Enquiries"
                                stroke="#25D366"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#colorWhatsapp)"
                            />
                        )}

                        {/* Website Clicks (Sky Blue) */}
                        {(activeFilter === 'all' || activeFilter === 'clicks') && (
                            <Area
                                type="monotone"
                                dataKey="clicks"
                                name="Website Clicks"
                                stroke="#38bdf8"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#colorClicks)"
                            />
                        )}

                        {/* Orders (Purple) */}
                        {(activeFilter === 'all' || activeFilter === 'orders') && (
                            <Area
                                type="monotone"
                                dataKey="orders"
                                name="Orders"
                                stroke="#a855f7"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorOrders)"
                            />
                        )}

                        {/* Revenue (White) */}
                        {activeFilter === 'revenue' && (
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                name="Revenue"
                                stroke="#ffffff"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                            />
                        )}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
