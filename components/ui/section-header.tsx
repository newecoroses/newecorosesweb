'use client';

import { motion } from 'framer-motion';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    label?: string;
    light?: boolean;
}

export default function SectionHeader({ title, subtitle, label, light }: SectionHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="text-center mb-5 md:mb-7"
        >
            {label && (
                <span className={`block text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-bold mb-1 ${light ? 'text-gray-300' : 'text-gray-400'}`}>
                    {label}
                </span>
            )}
            <h2 className={`font-sans text-base sm:text-lg md:text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-[#1c1917]'}`}>
                {title}
            </h2>
            {subtitle && (
                <p className={`max-w-md mx-auto text-xs font-normal mt-1 leading-snug ${light ? 'text-white/70' : 'text-gray-500'}`}>
                    {subtitle}
                </p>
            )}
        </motion.div>
    );
}
