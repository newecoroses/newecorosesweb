'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import ThemeProvider from '@/components/ui/theme-provider';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) {
        return <main className="flex-grow">{children}</main>;
    }

    return (
        <>
            <ThemeProvider />
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </>
    );
}
