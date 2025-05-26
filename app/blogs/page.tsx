import Link from 'next/link';
import { getAllNewsletters } from '@/lib/api'; // Assuming @ is configured for src path, otherwise use relative path.

// Define a simple type for Newsletter attributes for now.
// TODO: Refine this type based on actual Strapi newsletter data structure.
type NewsletterAttributes = {
  slug: string;
  title: string;
  // Add other relevant fields like 'excerpt', 'publication_date', etc.
  [key: string]: any; // Allow other attributes
};

type Newsletter = {
  id: number;
  attributes: NewsletterAttributes;
};

export default async function BlogsPage() {
  // Fetch newsletters.
  // The `getAllNewsletters` function is expected to return an array of items,
  // each with an `id` and an `attributes` object.
  const newsletters: Newsletter[] = await getAllNewsletters();

  if (!newsletters || newsletters.length === 0) {
    return <p>No newsletters found.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Newsletters</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsletters.map((newsletter) => (
          <div key={newsletter.id} className="border p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{newsletter.attributes.title || 'Untitled Newsletter'}</h2>
            {/* You might want to add an excerpt or other details here */}
            {/* <p className="text-gray-700 mb-4">{newsletter.attributes.excerpt}</p> */}
            <Link href={`/blogs/${newsletter.attributes.slug}`} className="text-blue-500 hover:underline">
              Read more
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

// Optional: Add revalidation if needed, e.g., for ISR
// export const revalidate = 60; // Revalidate every 60 seconds
