'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import ThemeProvider from '@/components/ui/theme-provider';
import CartDrawer from '@/components/ui/cart-drawer';
import { CartProvider } from '@/lib/cart-context';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) {
        return <main className="flex-grow">{children}</main>;
    }

    return (
        <CartProvider>
            <ThemeProvider />
            <Navbar />
            <main className="flex-grow w-full max-w-full overflow-x-clip">
                {children}
            </main>
            <Footer />
            <CartDrawer />
        </CartProvider>
    );
}

