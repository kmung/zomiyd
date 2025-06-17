// app/api/stripe-webhook/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/utils/stripe'; // Using the shared Stripe instance

// Note: bodyParser: false is not configured this way in App Router.
// We'll read the raw body for Stripe signature verification.

async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new NextResponse('Method Not Allowed', {
      status: 405,
      headers: { Allow: 'POST' },
    });
  }

  const stripe = getStripe(); // Initializes Stripe with secret key from env
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set.');
    return NextResponse.json({ error: 'Webhook secret not configured.' }, { status: 500 });
  }

  try {
    const rawBody = await req.text(); // Get raw body as text
    const sig = req.headers.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent was successful!', paymentIntentSucceeded);
        
        const { amount, currency, metadata } = paymentIntentSucceeded;
        const donorName = metadata.donorName || 'N/A';
        const donorEmail = metadata.donorEmail || 'N/A';
        
        console.log(`Donation of ${amount / 100} ${currency.toUpperCase()} received from ${donorName} (${donorEmail}).`);
        // Business logic for successful payment:
        // - Send confirmation email
        // - Update database (e.g., mark order as paid)
        // - Log the transaction etc.
        break;
        
      case 'payment_intent.payment_failed':
        const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent failed.', paymentIntentFailed.last_payment_error?.message);
        // Notify user or log for investigation
        break;
        
      // ... handle other event types as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: `Webhook handler error: ${error.message}` }, { status: 500 });
  }
}

export { handler as POST };
