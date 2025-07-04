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

  console.log('[Stripe Webhook] Received request');
  const stripe = getStripe(); // Initializes Stripe with secret key from env
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET is not set.');
    return NextResponse.json({ error: 'Webhook secret not configured.' }, { status: 500 });
  }
  console.log('[Stripe Webhook] Webhook secret found.');

  try {
    const rawBody = await req.text(); // Get raw body as text
    const sig = req.headers.get('stripe-signature') as string;
    console.log(`[Stripe Webhook] Signature: ${sig ? 'Present' : 'Missing'}`);
    // console.log(`[Stripe Webhook] Raw body length: ${rawBody.length}`); // Be cautious logging full body

    let event: Stripe.Event;

    try {
      console.log('[Stripe Webhook] Attempting to construct event...');
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
      console.log(`[Stripe Webhook] Event constructed successfully. Event ID: ${event.id}, Type: ${event.type}`);
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err);
      console.error(`[Stripe Webhook] Signature verification failed: ${errMessage}`);
      return NextResponse.json({ error: `Webhook Error: Signature verification failed - ${errMessage}` }, { status: 400 });
    }

    // Handle the event
    console.log(`[Stripe Webhook] Handling event type: ${event.type}`);
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
        console.log(`[Stripe Webhook] PaymentIntent Succeeded. PI_ID: ${paymentIntentSucceeded.id}, Amount: ${paymentIntentSucceeded.amount}`);
        
        const { amount, currency, metadata } = paymentIntentSucceeded;
        const donorName = metadata.donorName || 'N/A';
        const donorEmail = metadata.donorEmail || 'N/A';
        
        console.log(`[Stripe Webhook] Donation of ${amount / 100} ${currency.toUpperCase()} received from ${donorName} (${donorEmail}).`);
        // TODO: Add actual business logic here (e.g., update database, send email)
        // Ensure this logic is wrapped in try/catch if it can fail, to still allow 200 OK response
        console.log('[Stripe Webhook] Business logic for payment_intent.succeeded would run here.');
        break;
        
      case 'payment_intent.payment_failed':
        const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
        console.log(`[Stripe Webhook] PaymentIntent Failed. PI_ID: ${paymentIntentFailed.id}, Reason: ${paymentIntentFailed.last_payment_error?.message}`);
        // TODO: Add business logic for failed payment (e.g., notify admin, update user status)
        break;
      
      case 'payment_intent.processing':
        const paymentIntentProcessing = event.data.object as Stripe.PaymentIntent;
        console.log(`[Stripe Webhook] PaymentIntent Processing. PI_ID: ${paymentIntentProcessing.id}`);
        break;

      case 'payment_intent.requires_action':
        const paymentIntentRequiresAction = event.data.object as Stripe.PaymentIntent;
        console.log(`[Stripe Webhook] PaymentIntent Requires Action. PI_ID: ${paymentIntentRequiresAction.id}`);
        break;
        
      // ... handle other event types as needed: charge.succeeded, etc.
      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}. Event ID: ${event.id}`);
    }

    console.log(`[Stripe Webhook] Event ${event.id} processed. Returning 200 OK.`);
    return NextResponse.json({ received: true });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[Stripe Webhook] Unhandled error in webhook handler: ${message}`);
    return NextResponse.json({ error: `Webhook handler error: ${message}` }, { status: 500 });
  }
}

export { handler as POST };
