'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-center max-w-md"
            >
                {/* Decorative 404 */}
                <div className="relative mb-8">
                    <span className="text-[10rem] font-serif text-secondary leading-none select-none">
                        404
                    </span>
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl">
                        🌹
                    </span>
                </div>

                <h1 className="font-serif text-3xl text-foreground mb-3">
                    This Page Has Wilted
                </h1>
                <p className="text-muted font-light leading-relaxed mb-10">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved. Let us help you find something beautiful instead.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-foreground text-white px-7 py-3.5 text-xs uppercase tracking-[0.18em] font-semibold rounded-full hover:bg-primary transition-all duration-300"
                    >
                        <ArrowLeft size={14} />
                        Go Home
                    </Link>
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 border border-foreground/20 text-foreground px-7 py-3.5 text-xs uppercase tracking-[0.18em] font-medium rounded-full hover:bg-foreground hover:text-white transition-all duration-300"
                    >
                        <ShoppingBag size={14} />
                        Browse Shop
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
