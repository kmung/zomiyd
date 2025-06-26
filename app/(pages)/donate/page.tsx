// app/(pages)/donate/page.tsx
import DonationForm from '@/components/donation/DonationForm';
// import StripeElementRenderer from './StripeElementRenderer'; // Removed
import Cover from '@/components/Cover';
import coverImage from '@/public/images/herocover.png';

// Load your publishable key from environment variables
const publishableKeyFromEnv = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const fallbackKey = 'pk_test_TYooMQauvdEDq54NiTphI7jx'; // Using a common test key as fallback

const actualKeyToUse = publishableKeyFromEnv || fallbackKey;

if (!publishableKeyFromEnv) {
  console.warn("DonatePage (Server): NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY was not found in env. Using fallback test key for DonationForm.");
} else {
  // console.log(`DonatePage (Server): Passing publishableKey (length: ${actualKeyToUse.length}) to DonationForm.`);
}

const DonatePage: React.FC = () => {
  if (!actualKeyToUse) {
    // This should ideally not happen if fallbackKey is set
    return (
        <div>
            <Cover title="Support Our Cause" backgroundImage={coverImage} />
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-2xl font-bold text-red-600">Configuration Error</h1>
                    <p className="text-red-500">Stripe publishable key is not available. Donations cannot be processed at this time.</p>
                </div>
            </main>
        </div>
    )
  }
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
          {/* Pass the actual key string to the client component */}
          {/* <StripeElementRenderer publishableKey={actualKeyToUse}> */}
            <DonationForm publishableKey={actualKeyToUse} />
          {/* </StripeElementRenderer> */}
        </div>
      </main>
    </div>
  );
};

export default DonatePage;
