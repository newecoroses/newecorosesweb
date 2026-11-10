'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(m => m.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(m => m.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(m => m.Cell), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false });

export interface TrafficSourceItem {
    name: string;
    value: number;
    color: string;
    percent?: number;
}

interface TrafficDonutChartProps {
    data?: TrafficSourceItem[];
    height?: number;
}

const DEFAULT_SOURCES: TrafficSourceItem[] = [
    { name: 'WhatsApp Enquiries', value: 48, color: '#ffffff' },
    { name: 'Direct Storefront', value: 28, color: '#d4d4d8' },
    { name: 'Google Search', value: 16, color: '#a1a1aa' },
    { name: 'Instagram & Socials', value: 8, color: '#71717a' },
];

function CustomTooltip({ active, payload }: any) {
    if (active && payload && payload.length) {
        const item = payload[0];
        return (
            <div className="bg-[#12141c] border border-zinc-700/80 rounded-xl p-2.5 shadow-xl text-xs">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.payload.color }} />
                    <span className="font-semibold text-white">{item.name}:</span>
                    <span className="font-bold text-zinc-300">{item.value}%</span>
                </div>
            </div>
        );
    }
    return null;
}

export function TrafficDonutChart({ data = DEFAULT_SOURCES, height = 220 }: TrafficDonutChartProps) {
    const total = data.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="w-full flex flex-col items-center">
            <div style={{ width: '100%', height }} className="relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip content={<CustomTooltip />} />
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={85}
                            paddingAngle={4}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    stroke="#0f1118"
                                    strokeWidth={2}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Center text in donut hole */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-extrabold text-white tracking-tight">100%</span>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Channel</span>
                </div>
            </div>

            {/* Legend breakdown list */}
            <div className="w-full space-y-2 mt-2 pt-3 border-t border-white/[0.04]">
                {data.map((item) => {
                    const pct = Math.round((item.value / total) * 100);
                    return (
                        <div key={item.name} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                                <span className="text-zinc-400 truncate">{item.name}</span>
                            </div>
                            <span className="font-semibold text-zinc-200 tabular-nums ml-2 flex-shrink-0">
                                {pct}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
