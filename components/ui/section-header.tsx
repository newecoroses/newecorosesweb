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
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true, margin: '-50px' }}
            className="text-center mb-14 lg:mb-16"
        >
            {label && (
                <span className={`block text-xs uppercase tracking-[0.25em] font-accent font-medium mb-4 ${light ? 'text-primary-light' : 'text-primary'}`}>
                    {label}
                </span>
            )}
            <h2 className={`font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-4 ${light ? 'text-white' : 'text-foreground'}`}>
                {title}
            </h2>
            {subtitle && (
                <p className={`font-light max-w-xl mx-auto text-base leading-relaxed ${light ? 'text-white/60' : 'text-muted'}`}>
                    {subtitle}
                </p>
            )}
            <div className={`w-16 h-[1.5px] mx-auto mt-6 ${light ? 'bg-primary-light/50' : 'bg-primary/40'}`} />
        </motion.div>
    );
}
