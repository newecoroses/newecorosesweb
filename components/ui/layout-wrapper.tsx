'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import ThemeProvider from '@/components/ui/theme-provider';
import CartDrawer from '@/components/ui/cart-drawer';
import { CartProvider } from '@/lib/cart-context';
import ScrollRestorer from '@/components/ui/scroll-restorer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isBarePortal = pathname?.startsWith('/admin') || pathname?.startsWith('/staff') || pathname === '/tv-marquee';
    const isCheckout = pathname?.startsWith('/checkout');

    if (isBarePortal) {
        return <main className="flex-grow">{children}</main>;
    }

    return (
        <CartProvider>
            <ThemeProvider />
            <ScrollRestorer />
            {!isCheckout && <Navbar />}
            <main className="flex-grow w-full max-w-full overflow-x-clip">
                {children}
            </main>
            {!isCheckout && <Footer />}
            {!isCheckout && <CartDrawer />}
        </CartProvider>
    );
}
