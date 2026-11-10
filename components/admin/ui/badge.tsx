import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
    return twMerge(clsx(inputs));
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'destructive' | 'gold' | 'outline' | 'secondary' | 'info';
}

export function Badge({
    className,
    variant = 'default',
    children,
    ...props
}: BadgeProps) {
    const variants: Record<string, string> = {
        default: 'bg-zinc-800 text-zinc-200 border-zinc-700/60',
        secondary: 'bg-zinc-900/80 text-zinc-400 border-zinc-800',
        success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-medium',
        warning: 'bg-amber-500/10 text-amber-300 border-amber-500/30 font-medium',
        destructive: 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-medium',
        gold: 'bg-white/10 text-white border-white/20 font-semibold',
        info: 'bg-blue-500/10 text-blue-400 border-blue-500/30 font-medium',
        outline: 'border-white/15 text-zinc-300 bg-transparent',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors select-none tracking-wide',
                variants[variant] || variants.default,
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}
