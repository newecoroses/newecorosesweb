'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import ThemeProvider from '@/components/ui/theme-provider';
import CartDrawer from '@/components/ui/cart-drawer';
import { CartProvider, useCart } from '@/lib/cart-context';
import ScrollRestorer from '@/components/ui/scroll-restorer';
import AddonModal from '@/components/checkout/addon-modal';

function AddonModalMount() {
    const { isAddonModalOpen, closeAddonModal } = useCart();
    return <AddonModal isOpen={isAddonModalOpen} onClose={closeAddonModal} />;
}

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
            <AddonModalMount />
            {!isCheckout && <Navbar />}
            <main className="flex-grow w-full max-w-full overflow-x-clip">
                {children}
            </main>
            {!isCheckout && <Footer />}
            {!isCheckout && <CartDrawer />}
        </CartProvider>
    );
}
