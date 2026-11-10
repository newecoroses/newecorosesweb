'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(m => m.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(m => m.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(m => m.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(m => m.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false });
const Cell = dynamic(() => import('recharts').then(m => m.Cell), { ssr: false });

export interface CategoryDataPoint {
    category: string;
    sales: number;
    count: number;
    color?: string;
}

interface CategoryBarChartProps {
    data?: CategoryDataPoint[];
    height?: number;
}

const DEFAULT_CATEGORIES: CategoryDataPoint[] = [
    { category: 'Fresh Roses', sales: 42, count: 184, color: '#ffffff' },
    { category: 'Bouquets', sales: 34, count: 142, color: '#e4e4e7' },
    { category: 'Hampers', sales: 28, count: 98, color: '#a1a1aa' },
    { category: 'Birthday', sales: 24, count: 86, color: '#71717a' },
    { category: 'Chocolates', sales: 18, count: 64, color: '#52525b' },
    { category: 'Plants', sales: 12, count: 45, color: '#3f3f46' },
];

function CustomTooltip({ active, payload }: any) {
    if (active && payload && payload.length) {
        const item = payload[0];
        return (
            <div className="bg-[#12141c] border border-zinc-700/80 rounded-xl p-3 shadow-xl text-xs">
                <p className="font-bold text-white mb-1">{item.payload.category}</p>
                <div className="flex items-center justify-between gap-3 text-zinc-300">
                    <span>Performance share:</span>
                    <span className="font-extrabold text-white">{item.payload.sales}%</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-zinc-400 mt-1">
                    <span>Inquiries / Orders:</span>
                    <span className="font-semibold text-white">{item.payload.count} units</span>
                </div>
            </div>
        );
    }
    return null;
}

export function CategoryBarChart({ data = DEFAULT_CATEGORIES, height = 240 }: CategoryBarChartProps) {
    return (
        <div style={{ width: '100%', height }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262833" horizontal={false} />
                    <XAxis
                        type="number"
                        stroke="#52525b"
                        tick={{ fill: '#71717a', fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        unit="%"
                    />
                    <YAxis
                        type="category"
                        dataKey="category"
                        stroke="#52525b"
                        tick={{ fill: '#d4d4d8', fontSize: 11, fontWeight: 500 }}
                        tickLine={false}
                        axisLine={false}
                        width={90}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="sales" radius={[0, 6, 6, 0]} barSize={16}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || '#e4e4e7'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
