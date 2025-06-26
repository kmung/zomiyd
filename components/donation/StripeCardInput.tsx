// components/donation/StripeCardInput.tsx
'use client';

import { CardElement } from '@stripe/react-stripe-js';

const cardElementOptions = {
  theme: "stripe",
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
  },
  business: {
    name: "Zomi Youth Development"
  }
};

const StripeCardInput: React.FC = () => {
  return (
    <>
      <label htmlFor="card-element" className="block text-sm font-medium text-gray-700 mb-1">
        Card Details
      </label>
      <CardElement id="card-element" options={cardElementOptions} />
    </>
  );
};

export default StripeCardInput;
