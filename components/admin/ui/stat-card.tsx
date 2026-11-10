import * as React from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
    return twMerge(clsx(inputs));
}

export interface StatCardProps {
    label: string;
    value: string | number | undefined;
    change?: number;
    trend?: 'up' | 'down';
    hint?: string;
    icon?: LucideIcon;
    color?: string; // gradient or accent color
    loading?: boolean;
    href?: string;
}

export function StatCard({
    label,
    value,
    change,
    trend = 'up',
    hint,
    icon: Icon,
    color = 'bg-zinc-800/80 text-zinc-200 border-zinc-700/50',
    loading = false,
    href,
}: StatCardProps) {
    const isPositive = trend === 'up';

    const content = (
        <div className="relative group p-5 rounded-2xl bg-[#0f1118] border border-white/[0.08] hover:border-zinc-700/80 transition-all duration-300 hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.6)] overflow-hidden">
            {/* Top row: Label & Icon */}
            <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    {label}
                </span>
                {Icon && (
                    <div
                        className={cn(
                            'w-9 h-9 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105',
                            color.includes('bg-') ? color : `bg-gradient-to-br ${color}`
                        )}
                    >
                        <Icon size={16} />
                    </div>
                )}
            </div>

            {/* Middle row: Big Value & Trend */}
            <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight tabular-nums">
                    {loading ? (
                        <span className="w-20 h-7 bg-zinc-800/80 rounded-md animate-pulse inline-block" />
                    ) : (
                        value ?? 0
                    )}
                </span>

                {change !== undefined && (
                    <span
                        className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold tracking-tight border',
                            isPositive
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        )}
                    >
                        {isPositive ? (
                            <TrendingUp size={12} className="stroke-[2.5]" />
                        ) : (
                            <TrendingDown size={12} className="stroke-[2.5]" />
                        )}
                        {change > 0 ? `+${change}%` : `${change}%`}
                    </span>
                )}
            </div>

            {/* Bottom row: Hint */}
            {hint && (
                <p className="text-[11px] text-zinc-500 mt-2 font-normal flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-zinc-600 inline-block" />
                    {hint}
                </p>
            )}

            {/* Subtle glow highlight on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="block cursor-pointer">
                {content}
            </Link>
        );
    }

    return content;
}
