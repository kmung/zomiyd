// app/(pages)/donate/page.tsx
import DonationForm from '@/components/donation/DonationForm'; // Corrected path
import Cover from '@/components/Cover';
import coverImage from '@/public/images/herocover.png';

// Import Stripe libraries
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Load your publishable key from environment variables
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'your_stripe_publishable_key_here_backup'); // Added a backup key just in case

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
          {/* Wrap DonationForm with Elements provider */}
          <Elements stripe={stripePromise}>
            <DonationForm />
          </Elements>
        </div>
      </main>
    </div>
  );
};

export default DonatePage;
