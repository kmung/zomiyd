'use client';

import { Elements } from '@stripe/react-stripe-js';
import { Stripe } from '@stripe/stripe-js';

interface StripeProviderProps {
    stripePromise: Promise<Stripe | null>;
    children: React.ReactNode;
}

const StripeProvider: React.FC<StripeProviderProps> = ({ stripePromise, children }) => {
    return (
        <Elements stripe={stripePromise}>
            {children}
        </Elements>
    );
};

export default StripeProvider;