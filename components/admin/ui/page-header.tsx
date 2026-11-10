import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
    return twMerge(clsx(inputs));
}

export interface PageHeaderProps {
    title: string;
    description?: string;
    tag?: string;
    children?: React.ReactNode;
    className?: string;
}

export function PageHeader({
    title,
    description,
    tag,
    children,
    className,
}: PageHeaderProps) {
    return (
        <div
            className={cn(
                'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 mb-6 border-b border-white/[0.06]',
                className
            )}
        >
            <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                        {title}
                    </h1>
                    {tag && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700/60 px-2 py-0.5 rounded-full">
                            {tag}
                        </span>
                    )}
                </div>
                {description && (
                    <p className="text-xs sm:text-sm text-zinc-400 font-normal">
                        {description}
                    </p>
                )}
            </div>

            {children && (
                <div className="flex items-center flex-wrap gap-2.5">
                    {children}
                </div>
            )}
        </div>
    );
}
