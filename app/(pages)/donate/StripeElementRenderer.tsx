'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js'; // Import loadStripe here
import { useEffect, useState, useMemo } from 'react';

interface StripeElementRendererProps {
    publishableKey: string; // Accept the key as a string
    children: React.ReactNode;
}

const StripeElementRenderer: React.FC<StripeElementRendererProps> = ({ publishableKey, children }) => {
    const [stripeLoaded, setStripeLoaded] = useState(false);
    
    // Load stripe promise here, only once, based on the publishableKey
    const stripePromise = useMemo(() => {
        if (!publishableKey) {
            console.error("StripeElementRenderer (Client): No publishable key provided from server component.");
            return null; 
        }
        // Consider not logging the full key in client-side logs in production
        console.log(`StripeElementRenderer (Client): Initializing Stripe with publishableKey (length: ${publishableKey.length})`);
        return loadStripe(publishableKey);
    }, [publishableKey]);

    // This effect ensures we only try to render Elements once Stripe is loaded client-side
    useEffect(() => {
        if (!stripePromise) {
            // This case handles if publishableKey was initially missing, or loadStripe itself returned null (though unlikely for valid key)
            console.error("StripeElementRenderer (Client): stripePromise is null, cannot proceed to load Stripe Elements.");
            setStripeLoaded(false); 
            return;
        }

        stripePromise.then(stripe => {
            if (stripe) {
                setStripeLoaded(true);
                console.log("StripeElementRenderer (Client): Stripe.js loaded successfully and Stripe object is available.");
            } else {
                // This case means loadStripe resolved, but the Stripe object is null.
                // This might happen if Stripe.js script loaded but initialization failed internally.
                console.error("StripeElementRenderer (Client): Stripe.js loaded but the Stripe object is null. This is unexpected for a valid key.");
                setStripeLoaded(false);
            }
        }).catch(error => {
            console.error("StripeElementRenderer (Client): Error loading Stripe.js or initializing Stripe:", error);
            setStripeLoaded(false);
        });
    }, [stripePromise]); // Dependency array includes stripePromise

    if (!stripePromise || !stripeLoaded) {
        // Display loading or error state
        // Might want to differentiate between "loading" and "error" here based on state
        let loadingMessage = "Loading payment form...";
        if (!publishableKey) {
            loadingMessage = "Stripe configuration error: Missing publishable key.";
        } else if (!stripePromise && publishableKey) {
            // This state implies useMemo returned null due to missing key, but somehow publishableKey is now truthy.
            // Or if loadStripe itself synchronously returned null/undefined.
            loadingMessage = "Stripe initialization failed: Could not create Stripe promise.";
        } else if (stripePromise && !stripeLoaded) {
            // Waiting for promise to resolve or for it to have failed in useEffect
            loadingMessage = "Initializing payment gateway...";
        }
        // More sophisticated error display could be added here
        return <div>{loadingMessage}</div>;
    }

    return (
        <Elements stripe={stripePromise}>
            {children}
        </Elements>
    );
};

export default StripeElementRenderer;