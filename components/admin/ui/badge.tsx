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
        default: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700/60 font-semibold',
        secondary: 'bg-zinc-50 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800',
        success: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 font-medium',
        warning: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30 font-medium',
        destructive: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30 font-medium',
        gold: 'bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white border-zinc-300 dark:border-white/20 font-semibold',
        info: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30 font-medium',
        outline: 'border-zinc-200 dark:border-white/15 text-zinc-700 dark:text-zinc-300 bg-transparent',
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
