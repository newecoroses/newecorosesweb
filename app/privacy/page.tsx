import Link from 'next/link';

export const metadata = {
    title: 'Privacy Policy — New Eco Roses Kolkata',
    description: 'Privacy Policy and Data Protection guidelines for New Eco Roses customers in Kolkata.',
};

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-background pt-24 md:pt-36 pb-16 px-4 md:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-12 shadow-card border border-gray-100/80">
                {/* Header */}
                <div className="border-b border-gray-100 pb-8 mb-8">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-block mb-3">
                        Legal Information
                    </span>
                    <h1 className="font-serif text-3xl md:text-5xl text-foreground font-bold mb-3">
                        Privacy Policy
                    </h1>
                    <p className="text-muted text-xs md:text-sm font-light">
                        Last Updated: July 2026 • New Eco Roses Kolkata
                    </p>
                </div>

                {/* Content Sections */}
                <div className="space-y-8 text-foreground/80 text-sm md:text-base leading-relaxed font-light">
                    <section>
                        <h2 className="font-serif text-xl md:text-2xl text-foreground font-semibold mb-3">1. Introduction</h2>
                        <p>
                            Welcome to <strong>New Eco Roses</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We operate luxury floral and gifting boutiques in Kolkata, West Bengal (Outlet 1 — Regent Park &amp; Outlet 2 — New Alipore) and provide online ordering services via <Link href="/" className="text-primary underline font-medium">newecoroses.com</Link>. Your privacy is paramount to us, and this Privacy Policy explains how we collect, use, protect, and handle your personal information when you visit or make a purchase from our website or store locations.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-xl md:text-2xl text-foreground font-semibold mb-3">2. Information We Collect</h2>
                        <p className="mb-3">When you browse our catalog, place an order, or contact us, we may collect the following personal information:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Order &amp; Recipient Details:</strong> Your name, phone number, delivery address, recipient&apos;s name, and optional custom card note text.</li>
                            <li><strong>Communication Data:</strong> Messages, custom order requests, or feedback sent to us via WhatsApp, email, or telephone.</li>
                            <li><strong>Technical &amp; Analytics Data:</strong> IP address, device type, browser information, and pages visited to help us optimize site performance and prevent fraud.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-serif text-xl md:text-2xl text-foreground font-semibold mb-3">3. How We Use Your Information</h2>
                        <p className="mb-3">We utilize your information strictly for legitimate business operations:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Fulfilling same-day floral orders and coordinating local doorstep delivery in Kolkata.</li>
                            <li>Sending order confirmations, delivery status updates, and customer support via WhatsApp or phone.</li>
                            <li>Improving our website performance, catalog offerings, and personalized customer recommendations.</li>
                            <li>Complying with applicable legal, accounting, and tax requirements in India.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-serif text-xl md:text-2xl text-foreground font-semibold mb-3">4. Data Sharing &amp; Protection</h2>
                        <p>
                            We <strong>do not sell, rent, or trade</strong> your personal information to any third parties for marketing purposes. Your data is strictly shared only with trusted delivery partners for order fulfillment or when required by law. All data transmissions are encrypted using standard SSL security protocols, and records are stored securely within protected databases.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-xl md:text-2xl text-foreground font-semibold mb-3">5. Cookies &amp; Tracking</h2>
                        <p>
                            Our website uses cookies and anonymous analytics markers to remember user preferences, track page views for security, and maintain shopping cart functionality. You can disable cookies in your browser settings at any time, though some features of our online store may become unavailable.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-xl md:text-2xl text-foreground font-semibold mb-3">6. Contact &amp; Rights</h2>
                        <p>
                            You have the right to request access to, correction of, or deletion of your personal data stored with us. For privacy inquiries or assistance, please reach out to us:
                        </p>
                        <div className="mt-3 p-4 bg-[#faf7f2] rounded-2xl border border-amber-900/10 space-y-1 text-xs md:text-sm text-foreground">
                            <p className="font-semibold text-primary">New Eco Roses Kolkata</p>
                            <p>Email: <a href="https://mail.google.com/mail/?view=cm&fs=1&to=newecoroses@gmail.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">newecoroses@gmail.com</a></p>
                            <p>Phone: +91 99369 11611 / +91 91995 01655</p>
                            <p>Outlets: Regent Park &amp; New Alipore, Kolkata</p>
                        </div>
                    </section>
                </div>

                {/* Subtle Developer Legal Note */}
                <div className="mt-12 pt-6 border-t border-gray-100 flex justify-center">
                    <div className="inline-flex items-center gap-2 bg-[#faf7f2] border border-amber-900/10 rounded-full px-5 py-2 shadow-sm">
                        <span className="text-amber-600 text-xs">⚡</span>
                        <p className="text-xs text-gray-600 font-medium">
                            Web Architecture &amp; Experience Engineered by{' '}
                            <a
                                href="https://www.linkedin.com/in/adityabuilds/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-gray-900 hover:text-amber-700 underline underline-offset-2 decoration-amber-500/40 transition-colors inline-flex items-center gap-0.5"
                            >
                                <span>Aditya Choudhury</span>
                                <span className="text-[10px] opacity-70">↗</span>
                            </a>
                            {' '}• Freelance Full-Stack Developer
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
