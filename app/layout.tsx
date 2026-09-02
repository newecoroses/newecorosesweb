import type { Metadata } from 'next';
import { Inter, Playfair_Display, Poppins, Montserrat } from 'next/font/google';
import './globals.css';
import LayoutWrapper from '@/components/ui/layout-wrapper';
import AnalyticsTracker from '@/components/analytics/analytics-tracker';

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

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'New Eco Roses — Premium Luxury Gifts & Flowers',
  description: 'Kolkata\'s finest luxury floral & gifting boutique. Hand-curated roses, bespoke bouquets, and personalized gifts with same-day delivery.',
  keywords: ['luxury gifts', 'roses', 'flowers', 'bouquets', 'same-day delivery', 'Kolkata', 'premium gifts', 'New Eco Roses'],
  icons: {
    icon: [
      { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon_io/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/favicon_io/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome-192x192', url: '/favicon_io/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/favicon_io/android-chrome-512x512.png' },
    ],
  },
  manifest: '/favicon_io/site.webmanifest',
  openGraph: {
    title: 'New Eco Roses — Premium Luxury Gifts & Flowers',
    description: 'Where every gift blossoms into a memory. Hand-curated roses and bespoke gifts.',
    type: 'website',
    images: [{ url: '/favicon_io/android-chrome-512x512.png', width: 512, height: 512 }],
  },
  other: {
    'theme-color': '#bfaf1a',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${poppins.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <head>
        {/* Inline script: applies cached theme synchronously before first paint to prevent color flash */}
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              var t = localStorage.getItem('ner_theme_colors');
              if (t) {
                var p = JSON.parse(t);
                var r = document.documentElement;
                if (p.primary) r.style.setProperty('--color-primary', p.primary);
                if (p.primaryDark) r.style.setProperty('--color-primary-dark', p.primaryDark);
                if (p.background) r.style.setProperty('--color-background', p.background);
                if (p.foreground) r.style.setProperty('--color-foreground', p.foreground);
              }
            } catch(e) {}
          `
        }} />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground w-full">
        {/* Analytics tracker — invisible, client-only, non-blocking */}
        <AnalyticsTracker />
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
