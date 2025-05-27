// app/(pages)/donate/page.tsx
import React from 'react';
import DonationForm from '@/components/DonationForm';
import Cover from '@/components/Cover'; // Optional: for a consistent page header
// You might want to add a specific cover image for the donation page
import coverImage from '@/public/images/herocover.png'; // Placeholder, replace with a relevant image

const DonatePage: React.FC = () => {
  return (
    <div>
      <Cover title="Support Our Cause" backgroundImage={coverImage} />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
            Make a Donation
          </h1>
          <p className="text-lg text-gray-700 mb-8 text-center">
            Your generous contribution helps us empower Zomi youths worldwide. Thank you for your support!
          </p>
          {/* 
            The Stripe Elements provider should be an ancestor of any component using useStripe or useElements.
            In this setup, DonationForm imports StripeElementsWrapper, which contains the <Elements> provider.
            So, we can directly use DonationForm here.
          */}
          <DonationForm />
        </div>
      </main>
    </div>
  );
};

export default DonatePage;
