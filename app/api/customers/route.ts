import { NextRequest, NextResponse } from 'next/server';
import { getAllCustomers, addInStoreCustomer, generateGreetingEmailHtml } from '@/lib/customer-store';

export async function GET(req: NextRequest) {
    try {
        const customers = getAllCustomers();
        return NextResponse.json({ success: true, customers });
    } catch (err: any) {
        console.error('Error fetching customers:', err);
        return NextResponse.json({ success: false, message: 'Failed to load customers' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, phone, email, dob, specialDay, specialDayType, amountSpent, purchasedItems, notes } = body;

        if (!name || !phone) {
            return NextResponse.json(
                { success: false, message: 'Customer name and phone number are required.' },
                { status: 400 }
            );
        }

        // Add to customer store
        const newCustomer = addInStoreCustomer({
            name,
            phone,
            email,
            dob,
            specialDay,
            specialDayType,
            amountSpent,
            purchasedItems: Array.isArray(purchasedItems) ? purchasedItems : [],
            notes,
        });

        // ── Greeting Email Sending Structure ───────────────────────
        let emailResult = {
            sent: false,
            queued: true,
            note: 'Greeting email template prepared. (Configure RESEND_API_KEY or SMTP to dispatch live emails)',
        };

        if (email && email.includes('@')) {
            const emailData = generateGreetingEmailHtml(newCustomer);

            // Check if RESEND_API_KEY or custom email key is configured in process.env
            const resendApiKey = process.env.RESEND_API_KEY;

            if (resendApiKey) {
                try {
                    // Direct REST call to Resend API without requiring external SDK dependency
                    const resendRes = await fetch('https://api.resend.com/emails', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${resendApiKey}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            from: process.env.EMAIL_FROM || 'New Eco Roses <orders@newecoroses.com>',
                            to: [email],
                            subject: emailData.subject,
                            html: emailData.html,
                            text: emailData.text,
                        }),
                    });

                    if (resendRes.ok) {
                        emailResult = {
                            sent: true,
                            queued: false,
                            note: 'Greeting email successfully dispatched via Resend!',
                        };
                        newCustomer.greetingEmailStatus = {
                            sent: true,
                            queued: false,
                            couponCode: 'WELCOME15',
                            discountPercent: 15,
                            sentAt: new Date().toISOString(),
                            previewSubject: emailData.subject,
                        };
                    } else {
                        const errBody = await resendRes.text();
                        console.warn('Resend dispatch error response:', errBody);
                    }
                } catch (dispatchErr) {
                    console.error('Error during live email dispatch:', dispatchErr);
                }
            } else {
                // Production-ready logging for when developer pastes their keys
                console.log('── GREETING EMAIL PREPARED (Awaiting API Key) ──');
                console.log(`To: ${email} (${name})`);
                console.log(`Subject: ${emailData.subject}`);
                console.log(`Coupon: WELCOME15 (15% OFF Online)`);
            }
        }

        return NextResponse.json({
            success: true,
            customer: newCustomer,
            emailStatus: emailResult,
            message: 'Customer saved successfully! Greeting email structure prepared with 15% discount code.',
        });
    } catch (err: any) {
        console.error('Error creating customer:', err);
        return NextResponse.json({ success: false, message: 'Failed to create customer' }, { status: 500 });
    }
}
