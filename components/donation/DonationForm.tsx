// components/donation/DonationForm.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe, Stripe, StripeElementsOptions, Appearance } from '@stripe/stripe-js';

// Assuming these are correctly imported from their actual paths
import DonationAmountInput from './DonationAmountInput'; 
import DonorInfoInput from './DonorInfoInput';

interface DonationFormProps {
  publishableKey: string;
}

const DonationFormWrapper: React.FC<DonationFormProps> = ({ publishableKey }) => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [keyError, setKeyError] = useState<string | null>(null);

  useEffect(() => {
    if (publishableKey && publishableKey.startsWith("pk_")) {
      setKeyError(null);
      setStripePromise(loadStripe(publishableKey));
    } else {
      setKeyError("Stripe publishable key is missing or invalid. Donations cannot be processed.");
      setStripePromise(null); // Ensure promise is null if key is bad
    }
  }, [publishableKey]);

  if (keyError) {
    return <div className="text-center p-4 text-red-600 font-bold">{keyError}</div>;
  }

  if (!stripePromise) {
    return <div className="text-center p-4 text-yellow-600">Initializing Stripe...</div>;
  }
  
  // Rename SimplifiedDonationForm to DonationForm internally for clarity as we add features
  return <DonationForm stripePromise={stripePromise} />;
};


interface InnerDonationFormProps { // Renamed from SimplifiedDonationFormProps
    stripePromise: Promise<Stripe | null>;
}

// Renamed from SimplifiedDonationForm to DonationForm
const DonationForm: React.FC<InnerDonationFormProps> = ({ stripePromise }) => {
  // Stripe and PaymentIntent states (from simplified version)
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [stripeJsError, setStripeJsError] = useState<string | null>(null); // Error loading Stripe.js
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentError, setPaymentIntentError] = useState<string | null>(null); // Error fetching/updating PI

  // Application state (to be restored)
  const [amount, setAmount] = useState<number | null>(null); // Or set a default like 1 for $1
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false); // For payment submission
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [appMessage, setAppMessage] = useState<string | null>(null); // For general UI messages, validation errors, redirect statuses

  // Loading states
  const [isLoadingStripe, setIsLoadingStripe] = useState<boolean>(true); // For initial Stripe.js load
  const [isLoadingClientSecret, setIsLoadingClientSecret] = useState<boolean>(false); // For PI fetch/update
  const [isInitialClientSecretFetched, setIsInitialClientSecretFetched] = useState<boolean>(false);


  useEffect(() => {
    setIsLoadingStripe(true);
    stripePromise
      .then(stripeInstance => {
        if (stripeInstance) {
          setStripe(stripeInstance);
        } else {
          setStripeJsError("Stripe.js failed to initialize. The Stripe object is null. This may be due to an invalid publishable key, network issues, or ad-blockers.");
        }
      })
      .catch(err => {
        console.error("Error resolving stripePromise:", err);
        setStripeJsError(`An unexpected error occurred while loading Stripe.js: ${err.message}`);
      })
      .finally(() => {
        setIsLoadingStripe(false);
      });
  }, [stripePromise]);

  const fetchClientSecret = useCallback(async (currentAmount: number, currentName?: string, currentEmail?: string) => {
    if (!stripe) {
      setPaymentIntentError("Stripe is not loaded yet.");
      return;
    }
    if (currentAmount <= 0) {
      setClientSecret(null); // Clear client secret if amount is invalid
      setPaymentIntentError(null); // Clear previous PI errors
      return;
    }

    setIsLoadingClientSecret(true);
    setPaymentIntentError(null);
    setAppMessage(null); // Clear previous app messages

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: currentAmount, 
          currency: 'usd',
          donorName: currentName, // Pass name and email
          donorEmail: currentEmail,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        setPaymentIntentError(data.error || 'Failed to initialize payment intent.');
        setClientSecret(null);
      } else {
        setClientSecret(data.clientSecret);
        if (!isInitialClientSecretFetched) setIsInitialClientSecretFetched(true);
      }
    } catch (err: any) {
      console.error('Error fetching client secret:', err);
      setPaymentIntentError(`Failed to initialize payment intent: ${err.message}`);
      setClientSecret(null);
    } finally {
      setIsLoadingClientSecret(false);
    }
  }, [stripe, isInitialClientSecretFetched]);

  // Effect for initial client secret fetch (e.g., with a default amount)
  useEffect(() => {
    if (stripe && !isInitialClientSecretFetched && !clientSecret && !paymentIntentError) {
      // Set a default initial amount, e.g., $1. This will also set the `amount` state.
      const initialDonationAmount = 1;
      setAmount(initialDonationAmount); 
      fetchClientSecret(initialDonationAmount, name, email);
    }
  }, [stripe, isInitialClientSecretFetched, clientSecret, paymentIntentError, name, email, fetchClientSecret]);

  const handleAmountChange = (newAmount: number | null) => {
    setAmount(newAmount);
    setAppMessage(null); // Clear messages
    if (newAmount && newAmount > 0) {
      // Fetch new client secret when amount changes
      // Pass current name and email in case they are needed for PI earlier
      fetchClientSecret(newAmount, name, email);
    } else {
      setClientSecret(null); // Clear client secret if amount is zero or invalid
      setPaymentIntentError(null); // Clear previous PI errors
    }
  };
  
  const handleChangeAmountClick = () => {
    setAmount(null);
    setClientSecret(null);
    setPaymentIntentError(null);
    setAppMessage(null);
    setIsInitialClientSecretFetched(false); // Allow re-fetch of initial/default PI if desired, or rely on user entering new amount
                                        // For now, this will trigger the initial fetch logic again if all conditions met.
                                        // Or, more simply, just wait for user to input new amount via DonationAmountInput.
                                        // Let's keep it simple: user has to re-enter.
  };

  const handleNameChange = (newName: string) => {
    setName(newName);
    if (appMessage) setAppMessage(null); // Clear messages when user types
  };

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    if (appMessage) setAppMessage(null); // Clear messages when user types
  };

  const appearance: Appearance = { theme: 'stripe' };
  const elementsOptions: StripeElementsOptions | undefined = clientSecret ? { clientSecret, appearance } : undefined;


  // Inner component to handle payment form submission and elements
  const PaymentSection = () => {
    const stripeHook = useStripe(); // Hook from @stripe/react-stripe-js
    const elementsHook = useElements(); // Hook from @stripe/react-stripe-js

    // Effect to handle redirect from Stripe after payment confirmation (e.g., for 3D Secure)
    useEffect(() => {
      if (!stripeHook) {
        return;
      }
      const secretFromUrl = new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret"
      );
  
      if (secretFromUrl) {
        setProcessing(true); // Show processing while we retrieve the intent
        stripeHook.retrievePaymentIntent(secretFromUrl).then(({ paymentIntent }) => {
          if (paymentIntent) {
            switch (paymentIntent.status) {
              case "succeeded":
                setPaymentSuccess(true);
                setAppMessage("Payment successful! Thank you for your donation.");
                break;
              case "processing":
                setAppMessage("Your payment is processing. We will update you shortly.");
                break;
              case "requires_payment_method":
                setAppMessage("Payment failed. Please try another payment method or contact support.");
                // Maybe clear clientSecret here or prompt for new details
                break;
              default:
                setAppMessage("Something went wrong with your payment. Please contact support.");
                break;
            }
          } else {
            setAppMessage("Could not retrieve payment status after redirect. Please contact support.");
          }
          // Clean the URL
          window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
          setProcessing(false);
        }).catch(retrieveError => {
          console.error("Error retrieving PaymentIntent:", retrieveError);
          setAppMessage("Error retrieving payment status. Please contact support.");
          setProcessing(false);
        });
      }
    }, [stripeHook]);


    const internalHandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      // Deferring state updates until after elements.submit() attempt
      // setAppMessage(null); 
      // setPaymentIntentError(null);

      if (!stripeHook || !elementsHook) {
        setAppMessage("Stripe.js has not yet loaded. Please try again in a moment.");
        return;
      }

      if (!amount || amount <= 0) {
        setAppMessage("Please enter a valid donation amount.");
        return;
      }
      if (!name.trim()) {
        setAppMessage("Please enter your full name.");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim() || !emailRegex.test(email)) {
        setAppMessage("Please enter a valid email address.");
        return;
      }
      if (!clientSecret) {
        setAppMessage("Payment session not initialized. Please re-enter amount or refresh.");
        return;
      }

      // Note: setProcessing(true) will be called AFTER elements.submit() succeeds.
      // This is to avoid potential issues where a state update causing a re-render
      // might interfere with elements.submit() if PaymentElement unmounts.

      // DIAGNOSTIC: Check if PaymentElement instance can be retrieved
      const paymentElementInstance = elementsHook.getElement(PaymentElement);
      console.log("[PaymentSection] Reference to PaymentElement before submit:", paymentElementInstance);
      if (!paymentElementInstance) {
        console.error("[PaymentSection] CRITICAL: getElement(PaymentElement) returned null/undefined. Element is likely unmounted or not registered.");
        setAppMessage("Critical error: Payment form component not found. Please refresh and try again.");
        return; // Stop further execution if element isn't found
      }

      // Trigger form validation and wallet collection
      console.log("[PaymentSection] Calling elements.submit()...");
      const { error: submitError } = await elementsHook.submit();

      // Clear previous messages now, after submit() attempt
      setAppMessage(null);
      setPaymentIntentError(null); 
      
      if (submitError) {
        console.error("[PaymentSection] elements.submit() failed:", submitError);
        let detailedMessage = "Error with payment details submission.";
        if (submitError.message) {
            detailedMessage = submitError.message;
        } else if (submitError.type) {
            detailedMessage = `Error type: ${submitError.type}. Please check card details.`;
        }
        // Log the full error object for more details if needed during debugging
        // console.log(JSON.stringify(submitError, null, 2)); 
        setAppMessage(detailedMessage);
        setProcessing(false);
        return;
      }
      console.log("[PaymentSection] elements.submit() successful.");

      // If elements.submit() is successful, now set processing to true before confirmPayment
      setProcessing(true);

      // Confirm the payment
      const { error: stripeError, paymentIntent } = await stripeHook.confirmPayment({
        elements: elementsHook,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/donate?payment_return=true`, // User will be redirected here
          payment_method_data: {
            billing_details: {
              name: name,
              email: email,
            },
          },
        },
        redirect: "if_required", // Default, Stripe handles SCA via redirect
      });

      if (stripeError) {
        // This error is for payment confirmation failures (e.g., card declined, fraud, etc.)
        // It does not occur if there's a redirect for SCA.
        setAppMessage(stripeError.message || "An unexpected error occurred during payment.");
        setProcessing(false);
      } else if (paymentIntent) {
        // If redirect: "if_required" and no redirect happened, paymentIntent is available here
        switch (paymentIntent.status) {
          case 'succeeded':
            setPaymentSuccess(true);
            setAppMessage("Payment Succeeded! Thank you for your donation.");
            setProcessing(false);
            break;
          case 'processing':
            setAppMessage("Your payment is processing. We will update you shortly.");
            // setProcessing(true); // Or keep it true until webhook confirms
            break;
          case 'requires_payment_method':
            setAppMessage("Payment failed. Please try another payment method.");
            setProcessing(false);
            break;
          case 'requires_action':
            setAppMessage("Further action is required to complete your payment. Please follow the instructions from your bank.");
            // Stripe should have redirected if this was the case with redirect: 'if_required'
            setProcessing(false); // Or true if waiting for user action on Stripe's page
            break;
          default:
            setAppMessage("An unexpected payment status occurred. Please contact support.");
            setProcessing(false);
            break;
        }
      } else {
        // This case should ideally not be reached if redirect: "if_required" is used
        // and there's no error and no paymentIntent.
        // It might occur if the redirect itself fails or is blocked.
        setAppMessage("Payment confirmation is pending. You might be redirected shortly.");
        // setProcessing might remain true
      }
    };

    return (
      <form onSubmit={internalHandleSubmit} className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-700">3. Payment Details</h2>
          <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
        </div>
        <button
          type="submit"
          disabled={processing || !stripeHook || !elementsHook || !clientSecret || !amount || !name || !email || isLoadingClientSecret || isLoadingStripe}
          className="mt-6 w-full px-6 py-3.5 text-lg bg-blue-primary text-white font-bold rounded-md shadow-md hover:bg-blue-dark focus:outline-none focus:ring-2 focus:ring-blue-primary focus:ring-opacity-50 transition-colors duration-150 ease-in-out disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
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


  if (isLoadingStripe) {
    return <div className="text-center p-4">Loading Stripe.js...</div>;
  }
  if (stripeJsError) {
    return <div className="text-center p-4 text-red-600 font-bold">Error: {stripeJsError}</div>;
  }
  if (!stripe) {
    // This case should ideally be caught by stripeJsError, but as a fallback:
    return <div className="text-center p-4 text-red-600 font-bold">Stripe object is not available. Cannot proceed.</div>;
  }

  // Stripe.js is loaded, now deal with Client Secret
  if (isLoadingClientSecret) {
    // If Stripe itself is loading, that message is already shown.
    // This message is specific to client secret fetching after Stripe.js has loaded.
    if (!isLoadingStripe) return <div className="text-center p-4">Fetching payment details...</div>;
  }
  
  // Consolidated error display area at the top of the form area
  const renderErrorMessages = () => {
    if (stripeJsError) return <div className="text-center p-4 text-red-600 font-bold">Error: {stripeJsError}</div>;
    if (paymentIntentError && !clientSecret) return <div className="text-center p-4 text-red-600 font-bold">Payment Setup Error: {paymentIntentError}</div>;
    if (appMessage && (paymentIntentError || stripeJsError)) { /* Don't show appMessage if there's a more critical error */ }
    else if (appMessage) return <div className={`p-4 rounded ${paymentSuccess ? 'bg-green-100 border-l-4 border-green-500 text-green-700' : 'bg-blue-100 border-l-4 border-blue-500 text-blue-700'}`} role="alert"><p>{appMessage}</p></div>; // Later: distinguish app errors
    return null;
  };

  // If Stripe is still loading, show only that.
  if (isLoadingStripe) {
    return <div className="text-center p-4">Loading Stripe.js...</div>;
  }
  // If Stripe failed to load, show only that error.
  if (stripeJsError) {
    return renderErrorMessages();
  }
  // If Stripe object isn't available (and not loading, and no specific error yet), it's an issue.
  if (!stripe) {
    return <div className="text-center p-4 text-red-600 font-bold">Stripe object is not available. Cannot proceed.</div>;
  }

  // --- Main Form Structure ---
  // Display success message and "Donate Again" button
  if (paymentSuccess) {
    return (
      <div className="text-center py-12 bg-white p-8 rounded-lg shadow-lg">
        <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h2 className="text-2xl font-semibold text-green-600 mb-4">Thank You for Your Donation!</h2>
        <p className="text-gray-700">{appMessage || `We appreciate your generous support! Amount: $${amount}`}</p>
        <button
          onClick={() => {
            setAmount(null);
            setName('');
            setEmail('');
            setProcessing(false);
            setPaymentSuccess(false);
            setClientSecret(null);
            setAppMessage(null);
            setPaymentIntentError(null);
            // Critical: allow the initial useEffect to fetch a new default clientSecret
            setIsInitialClientSecretFetched(false); 
            // Optionally, clear Stripe redirect URL params if any were added
            // window.history.replaceState({}, document.title, window.location.pathname);
          }}
          className="mt-6 px-6 py-3 bg-blue-primary text-white font-semibold rounded-md hover:bg-blue-dark focus:outline-none focus:ring-2 focus:ring-blue-primary focus:ring-opacity-50 transition-colors duration-150 ease-in-out"
        >
          Donate Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white p-6 md:p-8 rounded-lg shadow-xl">
      {renderErrorMessages()}
      
      {!stripeJsError && !paymentSuccess && ( // Only show form elements if Stripe loaded and payment not yet successful
        <>
          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-700">1. Choose Donation Amount</h2>
            <DonationAmountInput 
              onAmountChange={(newAmount) => setAmount(newAmount)} // Placeholder
              currency="USD" 
              isDisabled={processing || isLoadingClientSecret || !!clientSecret} // Basic disabled logic for now
              initialAmount={1} // Default initial amount
            />
            {clientSecret && amount && amount > 0 && !processing && !isLoadingClientSecret && (
                 <button 
                    onClick={() => { /* TODO: Implement change amount logic */ }}
                    className="text-sm text-blue-600 hover:text-blue-800 mt-1"
                 >
                    Change amount
                 </button>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-700">2. Your Information</h2>
            <DonorInfoInput 
              name={name} 
              email={email} 
              onNameChange={handleNameChange}
              onEmailChange={handleEmailChange}
              isDisabled={processing || isLoadingClientSecret} 
            />
          </div>

          {isLoadingClientSecret && <div className="text-center p-4">Fetching payment details...</div>}
          {/* paymentIntentError is shown by renderErrorMessages now */}
          {/* {paymentIntentError && !clientSecret && <div className="text-center p-4 text-red-600 font-bold">Payment Setup Error: {paymentIntentError}</div>} */}


          {clientSecret && elementsOptions && (
            <Elements stripe={stripe} options={elementsOptions} key={clientSecret}>
              {/* PaymentComponent will render PaymentElement and submit button */}
              <PaymentSection />
            </Elements>
          )}

          {!clientSecret && !isLoadingClientSecret && !paymentIntentError && !stripeJsError && (
            <p className="text-gray-600">Please enter a donation amount to proceed to payment.</p>
          )}
        </>
      )}
    </div>
  );
};

export default DonationFormWrapper;
