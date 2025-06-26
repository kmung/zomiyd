// components/donation/DonationForm.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import DonationAmountInput from './DonationAmountInput';
import DonorInfoInput from './DonorInfoInput';
// import StripeCardInput from './StripeCardInput'; // Removed
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';

interface DonationFormProps {
  publishableKey: string;
}

const DonationFormWrapper: React.FC<DonationFormProps> = ({ publishableKey }) => {
  const [stripePromise, setStripePromise] = useState(() => loadStripe(publishableKey));
  
  // Update stripePromise if publishableKey changes (though unlikely for this setup)
  useEffect(() => {
    if (publishableKey) {
      setStripePromise(() => loadStripe(publishableKey));
    }
  }, [publishableKey]);

  if (!stripePromise) {
    // This case should ideally be handled by publishableKey check in DonatePage
    return <div className="text-center p-4 text-red-600">Initializing Stripe failed. Missing publishable key.</div>;
  }
  
  // DonationForm needs to be a child of Elements, but Elements needs clientSecret which is fetched in DonationForm.
  // So, we'll pass stripePromise and publishableKey to DonationForm and it will render Elements internally once clientSecret is ready.
  return <DonationForm stripePromise={stripePromise} publishableKey={publishableKey} />;
};


interface InnerDonationFormProps {
    stripePromise: ReturnType<typeof loadStripe>;
    publishableKey: string; // Though not directly used if stripePromise is passed, good for context or future needs
}

const DonationForm: React.FC<InnerDonationFormProps> = ({ stripePromise }) => {
  const [amount, setAmount] = useState<number | null>(null);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null); // For messages from Stripe redirect

  // Stripe hooks should be called inside a component wrapped by <Elements>
  // We will call them in PaymentComponent which will be rendered inside <Elements>
  // const stripe = useStripe();
  // const elements = useElements();

  const fetchClientSecret = useCallback(async (currentAmount: number) => {
    if (currentAmount <= 0) {
        setClientSecret(null);
        return;
    }
    setError(null); // Clear previous errors
    setProcessing(true); // Show loading state while fetching
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: currentAmount,
          currency: 'usd',
          donorName: name, // Optional: pass name/email if needed for intent creation, though usually not for client_secret stage
          donorEmail: email,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        setError(data.error || 'Failed to initialize payment.');
        setClientSecret(null);
      } else {
        setClientSecret(data.clientSecret);
      }
    } catch (err) {
      setError('Failed to initialize payment. Please check your connection.');
      setClientSecret(null);
    } finally {
      setProcessing(false); // Hide loading state
    }
  }, [name, email]); // Add dependencies if name/email are used in PI creation before payment element

  const handleAmountChange = (newAmount: number | null) => {
    setAmount(newAmount);
    setError(null); // Clear error when amount changes
    if (newAmount && newAmount > 0) {
      fetchClientSecret(newAmount);
    } else {
      setClientSecret(null); // Clear client secret if amount is invalid
    }
  };

  const handleNameChange = (newName: string) => {
    setName(newName);
    if (newName) setError(null);
  };

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    if (newEmail) setError(null);
  };

  // This component will be rendered inside <Elements>
  const PaymentComponent = () => {
    const stripe = useStripe();
    const elements = useElements();

    // Effect to handle redirect from Stripe
    useEffect(() => {
        if (!stripe) {
          return;
        }
        const secret = new URLSearchParams(window.location.search).get(
          "payment_intent_client_secret"
        );
    
        if (!secret) {
          return;
        }
    
        stripe.retrievePaymentIntent(secret).then(({ paymentIntent }) => {
          switch (paymentIntent?.status) {
            case "succeeded":
              setMessage("Payment succeeded!");
              setPaymentSuccess(true);
              setProcessing(false);
              break;
            case "processing":
              setMessage("Your payment is processing.");
              setProcessing(true);
              break;
            case "requires_payment_method":
              setMessage("Your payment was not successful, please try again.");
              setError("Payment failed. Please try another payment method.");
              setProcessing(false);
              break;
            default:
              setMessage("Something went wrong.");
              setError("An unexpected error occurred.");
              setProcessing(false);
              break;
          }
        });
      }, [stripe]);


    const internalHandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setMessage(null);
    
        if (!stripe || !elements) {
          setError("Stripe.js has not yet loaded. Please ensure you are online and try again.");
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
    
        setProcessing(true);
    
        const { error: submitError } = await elements.submit();
        if (submitError) {
          setError(submitError.message || "Error with payment details submission.");
          setProcessing(false);
          return;
        }

        // The clientSecret should have been fetched when amount was set
        if (!clientSecret) {
            setError("Payment session not initialized. Please re-enter amount.");
            setProcessing(false);
            return;
        }

        // Pass billing details directly to confirmPayment if needed, or ensure they are collected by PaymentElement
        // For PaymentElement, billing details are often collected automatically or can be pre-filled.
        // If you need to pass them explicitly:
        // payment_method_data: {
        //   billing_details: { name, email }
        // }

        const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
          elements,
          clientSecret, // This clientSecret must be for the current PaymentIntent
          confirmParams: {
            return_url: `${window.location.origin}/donate?source=stripe_confirm`, // Adjust URL as needed
            payment_method_data: { // Optional: if not collected by Payment Element or to override
                billing_details: {
                    name: name,
                    email: email,
                }
            }
          },
          redirect: "if_required", // Handle redirect yourself or let Stripe do it
        });
    
        if (stripeError) {
          // This error is for scenarios like bank declined payment, card errors etc.
          setError(stripeError.message || "An unexpected error occurred during payment.");
          setProcessing(false);
        } else if (paymentIntent) {
          // If redirect: "if_required" is used and no redirect happened, check status here
          if (paymentIntent.status === 'succeeded') {
            setPaymentSuccess(true);
            setMessage("Payment Succeeded!");
            // No need to setProcessing(false) here for success
          } else if (paymentIntent.status === 'requires_action' || paymentIntent.status === 'requires_confirmation') {
            // This should ideally be handled by Stripe's redirect or modal
            setError('Further action required to complete the payment.');
            setProcessing(false);
          } else {
            setError(paymentIntent.last_payment_error?.message || 'Payment failed. Please try again.');
            setProcessing(false);
          }
        }
      };

      return (
        <form onSubmit={internalHandleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
                </div>
            )}
            {message && !error && ( // Display general messages if no error
                <div className={`p-4 rounded ${paymentSuccess ? 'bg-green-100 border-l-4 border-green-500 text-green-700' : 'bg-blue-100 border-l-4 border-blue-500 text-blue-700'}`} role="alert">
                <p>{message}</p>
                </div>
            )}

            <PaymentElement id="payment-element" options={{layout: "tabs"}} />
            
            <button
                type="submit"
                disabled={!stripe || !elements || processing || !amount || !name || !email || !clientSecret}
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
  }


  if (paymentSuccess && !processing) { // Ensure processing is false before showing success
    return (
      <div className="text-center py-12 bg-white p-8 rounded-lg shadow-lg">
        <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h2 className="text-2xl font-semibold text-green-600 mb-4">Thank You for Your Donation!</h2>
        <p className="text-gray-700">{message || `We appreciate your generous support for Zomi Youth Development. Amount: $${amount}`}</p>
        <button
          onClick={() => {
            setAmount(null);
            setName('');
            setEmail('');
            setProcessing(false);
            setError(null);
            setPaymentSuccess(false);
            setClientSecret(null);
            setMessage(null);
            // Optionally clear URL params: window.history.replaceState({}, document.title, window.location.pathname);
          }}
          className="mt-6 px-6 py-3 bg-blue-primary text-white font-semibold rounded-md hover:bg-blue-dark focus:outline-none focus:ring-2 focus:ring-blue-primary focus:ring-opacity-50 transition-colors duration-150 ease-in-out"
        >Donate Again</button>
      </div>
    );
  }

  // Define appearance for Elements
  const appearance: StripeElementsOptions['appearance'] = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0570de',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'Ideal Sans, system-ui, sans-serif',
      spacingUnit: '2px',
      borderRadius: '4px',
      // See documentation for more options
    },
  };
  
  const elementsOptions: StripeElementsOptions | undefined = clientSecret ? {
    clientSecret,
    appearance,
    // BCP 47 language code, e.g. "en" or "de"
    // locale: 'auto' by default
  } : undefined;


  return (
    <div className="space-y-6 bg-white p-6 md:p-8 rounded-lg shadow-xl">
      {/* Error display for issues before Elements is ready (e.g. clientSecret fetch error) */}
      {error && !clientSecret && ( // Only show this top-level error if Elements isn't ready
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
       {message && !paymentSuccess && !error && ( // Display general messages if not success and no error
        <div className="p-4 rounded bg-blue-100 border-l-4 border-blue-500 text-blue-700" role="alert">
          <p>{message}</p>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-3 text-gray-700">1. Choose Donation Amount</h2>
        <DonationAmountInput onAmountChange={handleAmountChange} currency="USD" isDisabled={processing || !!clientSecret} />
         {clientSecret && <button onClick={() => { setClientSecret(null); setAmount(null); setError(null); setMessage(null); }} className="text-sm text-blue-600 hover:text-blue-800 mt-1">Change amount</button>}
      </div>
      
      {/* Only show donor info and payment form if an amount has led to a client secret */}
      {/* Or, always show DonorInfo and conditionally show Elements provider */}

      <div>
        <h2 className="text-xl font-semibold mb-3 text-gray-700">2. Your Information</h2>
        <DonorInfoInput name={name} email={email} onNameChange={handleNameChange} onEmailChange={handleEmailChange} isDisabled={processing && !!clientSecret} />
      </div>

      {stripePromise && clientSecret && elementsOptions ? (
        <Elements stripe={stripePromise} options={elementsOptions}>
          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-700">3. Payment Details</h2>
            <PaymentComponent /> {/* This component contains the form and PaymentElement */}
          </div>
        </Elements>
      ) : (
        processing && !clientSecret && !error ? ( // Show processing indicator if fetching client secret
          <div className="flex items-center justify-center py-4">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading payment form...
          </div>
        ) : (
            !error && <p className="text-gray-600">Please enter a donation amount to proceed.</p> // Prompt if no amount yet
        )
      )}
    </div>
  );
};

export default DonationFormWrapper; // Export the wrapper
