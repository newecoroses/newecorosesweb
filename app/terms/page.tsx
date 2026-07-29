import Link from 'next/link';

export const metadata = {
    title: 'Terms of Service — New Eco Roses Kolkata',
    description: 'Terms of Service, Delivery Policies, and Purchasing Conditions for New Eco Roses in Kolkata.',
};

export default function TermsOfService() {
    return (
        <main className="min-h-screen bg-background pt-24 md:pt-36 pb-16 px-4 md:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-12 shadow-card border border-gray-100/80">
                {/* Header */}
                <div className="border-b border-gray-100 pb-8 mb-8">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-block mb-3">
                        Terms &amp; Conditions
                    </span>
                    <h1 className="font-serif text-3xl md:text-5xl text-foreground font-bold mb-3">
                        Terms of Service
                    </h1>
                    <p className="text-muted text-xs md:text-sm font-light">
                        Last Updated: July 2026 • New Eco Roses Kolkata
                    </p>
                </div>

                {/* Content Sections */}
                <div className="space-y-8 text-foreground/80 text-sm md:text-base leading-relaxed font-light">
                    <section>
                        <h2 className="font-serif text-xl md:text-2xl text-foreground font-semibold mb-3">1. Agreement to Terms</h2>
                        <p>
                            By accessing or purchasing from <strong>New Eco Roses</strong> (&quot;the Boutique,&quot; &quot;we,&quot; or &quot;us&quot;) through <Link href="/" className="text-primary underline font-medium">newecoroses.com</Link> or visiting our physical store outlets in Kolkata (Outlet 1 — Regent Park and Outlet 2 — New Alipore), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-xl md:text-2xl text-foreground font-semibold mb-3">2. Floral Orders &amp; Product Availability</h2>
                        <p className="mb-3">Our arrangements are handcrafted using fresh, natural flowers and premium seasonal gifts:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Natural Variations:</strong> Fresh flowers are subject to natural availability. Stem counts, shades, and blossom sizes may vary slightly from website photographs while maintaining equal or higher aesthetic value.</li>
                            <li><strong>Product Substitutions:</strong> If a specific flower variety or packaging material is temporarily out of stock, our florists reserve the right to substitute with an equivalent or superior item of equal value.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-serif text-xl md:text-2xl text-foreground font-semibold mb-3">3. Delivery Policy &amp; Same-Day Cutoff</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Service Radius:</strong> We provide local doorstep delivery within a 10 km radius of our Kolkata outlets.</li>
                            <li><strong>Same-Day Cutoff:</strong> Orders placed before <strong>5:00 PM IST</strong> qualify for guaranteed same-day delivery. Orders placed after cutoff will be fulfilled on the next business day.</li>
                            <li><strong>Recipient Availability:</strong> If the recipient is unavailable at the provided delivery address, our driver will attempt contact via phone or leave the arrangement with a building gatekeeper/receptionist upon instruction.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-serif text-xl md:text-2xl text-foreground font-semibold mb-3">4. Pricing &amp; Payments</h2>
                        <p>
                            All prices listed on our website are in Indian Rupees (INR). Payments can be completed online or directly via WhatsApp confirmation. Prices are subject to revision for peak festive seasons (e.g., Valentine&apos;s Day, Mother&apos;s Day, Durga Puja) with prior store notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-serif text-xl md:text-2xl text-foreground font-semibold mb-3">5. Cancellations &amp; Refunds</h2>
                        <p className="mb-3">Due to the perishable nature of fresh flowers and customized hand-crafted bouquets:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Cancellations:</strong> Order cancellations are accepted up to 2 hours before the scheduled dispatch time by calling customer support.</li>
                            <li><strong>Damaged / Incorrect Items:</strong> If your delivery arrives damaged or incorrect, please inform us within 2 hours of delivery with photos via WhatsApp (+91 99369 11611) for immediate replacement or store credit resolution.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-serif text-xl md:text-2xl text-foreground font-semibold mb-3">6. Governing Law &amp; Jurisdiction</h2>
                        <p>
                            These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising in connection with our services shall be subject to the exclusive jurisdiction of the competent courts in Kolkata, West Bengal.
                        </p>
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
