import type { Metadata } from 'next';
import { Inter, Playfair_Display, Poppins } from 'next/font/google';
import './globals.css';
import LayoutWrapper from '@/components/ui/layout-wrapper';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'New Eco Roses — Premium Luxury Gifts & Flowers',
  description: 'Kolkata\'s finest luxury floral & gifting boutique. Hand-curated roses, bespoke bouquets, and personalized gifts with same-day delivery.',
  keywords: ['luxury gifts', 'roses', 'flowers', 'bouquets', 'same-day delivery', 'Kolkata', 'premium gifts', 'New Eco Roses'],
  openGraph: {
    title: 'New Eco Roses — Premium Luxury Gifts & Flowers',
    description: 'Where every gift blossoms into a memory. Hand-curated roses and bespoke gifts.',
    type: 'website',
  },
  other: {
    'theme-color': '#c9a96e',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${poppins.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
