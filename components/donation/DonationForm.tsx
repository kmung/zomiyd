// components/DonationForm.tsx
'use client';

import { useState } from 'react';
import DonationAmountInput from './DonationAmountInput';
import DonorInfoInput from './DonorInfoInput';
import StripeCardInput from './StripeCardInput'; // This contains the Elements provider
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const DonationForm: React.FC = () => {
  const [amount, setAmount] = useState<number | null>(null);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  const stripe = useStripe();
  const elements = useElements();

  const handleAmountChange = (newAmount: number | null) => {
    setAmount(newAmount);
    if (newAmount) { // Clear previous errors when amount changes
        setError(null);
    }
  };

  const handleNameChange = (newName: string) => {
    setName(newName);
    if (newName) {
        setError(null);
    }
  }

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    if (newEmail) {
        setError(null);
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // Clear previous errors

    if (!stripe || !elements) {
      setError("Stripe.js has not yet loaded. Please try again in a moment.");
      return;
    }

    if (!amount || amount <= 0) {
      setError("Please enter a valid donation amount.");
      return;
    }
    if (!name.trim()) {
        setError("Please enter your full name.");
        return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
        setError("Please enter a valid email address.");
        return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card details are not available. Please ensure Stripe Elements loaded correctly.");
      return;
    }

    setProcessing(true);

    try {
      // 1. Create a PaymentIntent on the server
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'usd',
          donorName: name,
          donorEmail: email,
        }),
      });

      const paymentIntentData = await response.json();

      if (!response.ok || paymentIntentData.error) {
        setError(paymentIntentData.error || 'Failed to initialize payment.');
        setProcessing(false);
        return;
      }

      const clientSecret = paymentIntentData.clientSecret;

      // 2. Confirm the card payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: name,
            email: email,
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || "An unexpected error occurred during payment.");
        setProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        setPaymentSuccess(true);
        // No need to setProcessing(false) here, as we're showing the success message
      } else {
        setError(paymentIntent?.last_payment_error?.message || 'Payment failed. Please try again.');
        setProcessing(false);
      }

    } catch (err: any) {
      console.error("Donation Form Error:", err);
      setError(err.message || "An error occurred during the donation process.");
      setProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="text-center py-12 bg-white p-8 rounded-lg shadow-lg">
        <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h2 className="text-2xl font-semibold text-green-600 mb-4">Thank You for Your Donation!</h2>
        <p className="text-gray-700">We appreciate your generous support for Zomi Youth Development.</p>
        <button
          onClick={() => {
            // Reset form for another donation
            setAmount(null);
            setName('');
            setEmail('');
            setProcessing(false);
            setError(null);
            setPaymentSuccess(false);
          }}
          className="mt-6 px-6 py-3 bg-blue-primary text-white font-semibold rounded-md hover:bg-blue-dark focus:outline-none focus:ring-2 focus:ring-blue-primary focus:ring-opacity-50 transition-colors duration-150 ease-in-out"
        >Donate Again</button>
        { /* TODO: implement email sending on server-side webhook
        <p className="text-gray-600 mt-2">A confirmation for your donation of ${amount} will be sent to {email} shortly.</p>
        */ }
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 md:p-8 rounded-lg shadow-xl">
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      <div>
        <h2 className="text-xl font-semibold mb-3 text-gray-700">1. Choose Donation Amount</h2>
        <DonationAmountInput onAmountChange={handleAmountChange} currency="USD" />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-3 text-gray-700">2. Your Information</h2>
        <DonorInfoInput name={name} email={email} onNameChange={handleNameChange} onEmailChange={handleEmailChange} />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-3 text-gray-700">3. Payment Details</h2>
        <StripeCardInput />
      </div>
      <button
        type="submit"
        disabled={!stripe || processing || !amount || !name || !email}
        className="w-full px-6 py-3.5 text-lg bg-blue-primary text-white font-bold rounded-md shadow-md hover:bg-blue-dark focus:outline-none focus:ring-2 focus:ring-blue-primary focus:ring-opacity-50 transition-colors duration-150 ease-in-out
                   disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
      >
        {processing ? (
            <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
            </div>
        ) : `Donate ${amount ? '$' + amount : ''}`}
      </button>
    </form>
  );
};

export default DonationForm;
