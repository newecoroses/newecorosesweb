'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check saved theme in localStorage
        const saved = localStorage.getItem('ner_portal_theme');
        if (saved === 'light' || saved === 'dark') {
            setTheme(saved);
            applyTheme(saved);
        } else {
            // Default dark mode
            setTheme('dark');
            applyTheme('dark');
        }
    }, []);

    const applyTheme = (newTheme: 'dark' | 'light') => {
        const root = document.documentElement;
        if (newTheme === 'light') {
            root.classList.remove('dark');
            root.classList.add('light');
            root.setAttribute('data-theme', 'light');
        } else {
            root.classList.remove('light');
            root.classList.add('dark');
            root.setAttribute('data-theme', 'dark');
        }
    };

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        localStorage.setItem('ner_portal_theme', nextTheme);
        applyTheme(nextTheme);

        // Dispatch an event so layouts can respond dynamically if needed
        window.dispatchEvent(new CustomEvent('ner-theme-change', { detail: nextTheme }));
    };

    if (!mounted) {
        return (
            <button
                type="button"
                aria-label="Toggle theme"
                className={`w-9 h-9 rounded-xl flex items-center justify-center border border-white/[0.08] bg-zinc-900/60 text-zinc-400 ${className}`}
            >
                <Moon size={15} />
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                theme === 'dark'
                    ? 'border-white/[0.08] bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white'
                    : 'border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-800 shadow-xs'
            } ${className}`}
        >
            {theme === 'dark' ? (
                <Sun size={15} className="transition-transform duration-300 hover:rotate-45" />
            ) : (
                <Moon size={15} className="transition-transform duration-300 hover:-rotate-12" />
            )}
        </button>
    );
}
