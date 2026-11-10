import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
    return twMerge(clsx(inputs));
}

export function Card({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                'group relative flex flex-col rounded-2xl bg-white dark:bg-[#0f1118]/90 text-zinc-950 dark:text-zinc-100 border border-zinc-200 dark:border-white/[0.08] shadow-xs dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-200 overflow-hidden',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                'flex flex-col space-y-1.5 p-5 pb-3 border-b border-zinc-100 dark:border-white/[0.04]',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardTitle({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3
            className={cn(
                'text-base font-semibold tracking-tight text-zinc-950 dark:text-white leading-none',
                className
            )}
            {...props}
        >
            {children}
        </h3>
    );
}

export function CardDescription({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={cn('text-xs text-zinc-500 dark:text-zinc-400 mt-1', className)}
            {...props}
        >
            {children}
        </p>
    );
}

export function CardAction({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn('ml-auto flex items-center gap-2', className)}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardContent({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('p-5 pt-4', className)} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                'flex items-center p-5 pt-3 border-t border-zinc-100 dark:border-white/[0.04] bg-zinc-50/50 dark:bg-white/[0.01]',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
