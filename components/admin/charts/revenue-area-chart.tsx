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
    enquiries?: number;
}

interface RevenueAreaChartProps {
    data?: RevenueDataPoint[];
    height?: number;
}

const DEFAULT_7D_DATA: RevenueDataPoint[] = [
    { label: 'Mon', revenue: 14200, orders: 8, enquiries: 18 },
    { label: 'Tue', revenue: 19800, orders: 12, enquiries: 24 },
    { label: 'Wed', revenue: 16500, orders: 9, enquiries: 21 },
    { label: 'Thu', revenue: 24300, orders: 15, enquiries: 32 },
    { label: 'Fri', revenue: 31000, orders: 18, enquiries: 38 },
    { label: 'Sat', revenue: 42500, orders: 26, enquiries: 54 },
    { label: 'Sun', revenue: 48900, orders: 31, enquiries: 62 },
];

function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#12141c] border border-zinc-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md">
                <p className="text-xs font-bold text-zinc-300 mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={`item-${index}`} className="flex items-center justify-between gap-4 text-xs py-0.5">
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
        );
    }
    return null;
}

export function RevenueAreaChart({ data = DEFAULT_7D_DATA, height = 300 }: RevenueAreaChartProps) {
    const [activeSeries, setActiveSeries] = useState<'both' | 'revenue' | 'orders'>('both');

    return (
        <div className="w-full">
            {/* Chart series filters */}
            <div className="flex items-center justify-between gap-2 mb-4 px-1">
                <div className="flex items-center gap-2 text-xs">
                    <button
                        onClick={() => setActiveSeries('both')}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer border ${
                            activeSeries === 'both'
                                ? 'bg-zinc-800 text-white border-zinc-700'
                                : 'bg-transparent text-zinc-400 border-transparent hover:text-zinc-200'
                        }`}
                    >
                        All Metrics
                    </button>
                    <button
                        onClick={() => setActiveSeries('revenue')}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer border ${
                            activeSeries === 'revenue'
                                ? 'bg-white text-black border-white font-semibold'
                                : 'bg-transparent text-zinc-400 border-transparent hover:text-zinc-200'
                        }`}
                    >
                        Revenue Only
                    </button>
                    <button
                        onClick={() => setActiveSeries('orders')}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer border ${
                            activeSeries === 'orders'
                                ? 'bg-zinc-700 text-zinc-100 border-zinc-600 font-semibold'
                                : 'bg-transparent text-zinc-400 border-transparent hover:text-zinc-200'
                        }`}
                    >
                        Orders Only
                    </button>
                </div>

                <div className="flex items-center gap-4 text-[11px] font-medium text-zinc-400">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-white" />
                        Revenue (₹)
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-zinc-400" />
                        Orders
                    </span>
                </div>
            </div>

            {/* Recharts Area Container */}
            <div style={{ width: '100%', height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#ffffff" stopOpacity={0.01} />
                            </linearGradient>
                            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a1a1aa" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#a1a1aa" stopOpacity={0.01} />
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
                            tickFormatter={(val) => (val >= 1000 ? `₹${(val / 1000).toFixed(0)}k` : `₹${val}`)}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        {(activeSeries === 'both' || activeSeries === 'revenue') && (
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
                        {(activeSeries === 'both' || activeSeries === 'orders') && (
                            <Area
                                type="monotone"
                                dataKey="orders"
                                name="Orders"
                                stroke="#a1a1aa"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorOrders)"
                            />
                        )}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
