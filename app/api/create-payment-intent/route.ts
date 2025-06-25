// app/api/create-payment-intent/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Ensure your Stripe secret key is set in environment variables
// For local development, you can use a .env.local file
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
});

export async function POST(request: Request) {
  try {
    const { amount, currency = 'usd', donorName, donorEmail } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required.' }, { status: 400 });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Amount in cents
      currency: currency,
      description: 'Zomi Youth Development Donation',
      metadata: {
        donorName,
        donorEmail,
      },
      // You can add customer creation/retrieval here if needed
      // customer: customer.id, 
      // automatic_payment_methods: { enabled: true } // Consider enabling this
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });

  } catch (error: unknown) {
    console.error('Error creating PaymentIntent:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
