// components/StripeElementsWrapper.tsx
'use client'; // Stripe Elements require client-side rendering

import React from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, CardElement } from '@stripe/react-stripe-js';

// Make sure to replace with your actual publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'your_stripe_publishable_key_here');

interface StripeElementsWrapperProps {
  clientSecret?: string; // Optional: if creating PaymentIntent on page load
}

const StripeElementsWrapper: React.FC<StripeElementsWrapperProps> = ({ clientSecret }) => {
  const options: StripeElementsOptions | undefined = clientSecret ? { clientSecret } : undefined;

  const cardElementOptions = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <label htmlFor="card-element" className="block text-sm font-medium text-gray-700 mb-1">
        Card Details
      </label>
      <CardElement id="card-element" options={cardElementOptions} />
    </Elements>
  );
};

export default StripeElementsWrapper;
