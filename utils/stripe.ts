/* stripe helper functions */

// lib/stripe.ts
import Stripe from 'stripe';

let stripe: Stripe | null = null;

export const getStripe = (): Stripe => {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables.');
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10', // Specify your desired API version
      typescript: true,
    });
  }
  return stripe;
};

// You can also export the initialized stripe instance directly if preferred
// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2024-04-10',
//   typescript: true,
// });

