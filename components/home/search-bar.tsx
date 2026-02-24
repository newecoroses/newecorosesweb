'use client';

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PHRASES = [
    'Birthday Flowers',
    'Anniversary Roses',
    'Luxury Bouquets',
    'Same Day Delivery',
    'Chocolate Bouquets',
    'Gift Hampers',
];

export default function SearchBar() {
    const router = useRouter();
    const [displayText, setDisplayText] = useState('');
    const [phraseIdx, setPhraseIdx] = useState(0);
    const [charIdx, setCharIdx] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isFocused) return; // Stop animation when user is typing

        const phrase = PHRASES[phraseIdx];
        let timeout: NodeJS.Timeout;

        if (!isDeleting) {
            if (charIdx < phrase.length) {
                timeout = setTimeout(() => {
                    setDisplayText(phrase.slice(0, charIdx + 1));
                    setCharIdx(charIdx + 1);
                }, 80);
            } else {
                timeout = setTimeout(() => setIsDeleting(true), 2000);
            }
        } else {
            if (charIdx > 0) {
                timeout = setTimeout(() => {
                    setDisplayText(phrase.slice(0, charIdx - 1));
                    setCharIdx(charIdx - 1);
                }, 40);
            } else {
                setIsDeleting(false);
                setPhraseIdx((prev) => (prev + 1) % PHRASES.length);
            }
        }

        return () => clearTimeout(timeout);
    }, [charIdx, isDeleting, phraseIdx, isFocused]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <section className="w-full px-4 md:px-8 py-5">
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <div className="relative group">
                    <Search
                        size={20}
                        className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-[#8a7a5a] transition-colors group-focus-within:text-[#5c6e4f]"
                    />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => {
                            if (!query) setIsFocused(false);
                        }}
                        placeholder={isFocused ? 'Search for flowers, gifts...' : displayText + '|'}
                        className="w-full pl-12 md:pl-14 pr-5 py-4 md:py-4.5 bg-[#faf7f2] border border-[#e8dcc8] rounded-xl md:rounded-2xl text-sm md:text-base text-[#3a3226] placeholder:text-[#b0a48a] focus:outline-none focus:ring-2 focus:ring-[#5c6e4f]/20 focus:border-[#5c6e4f]/40 transition-all duration-300 shadow-sm focus:shadow-md"
                    />
                </div>
            </form>
        </section>
    );
}
