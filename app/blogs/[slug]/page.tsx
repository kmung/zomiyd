import { getNewsletterBySlug } from '@/lib/api'; // Assuming @ is configured, otherwise use relative path.
import { notFound } from 'next/navigation';

// Define a simple type for Newsletter attributes for now.
// TODO: Refine this type based on actual Strapi newsletter data structure.
type NewsletterAttributes = {
  slug: string;
  title: string;
  content: string; // Assuming a 'content' field for the main body
  // Add other relevant fields like 'author', 'publication_date', etc.
  [key: string]: any; // Allow other attributes
};

type Newsletter = {
  id: number;
  attributes: NewsletterAttributes;
};

type Props = {
  params: {
    slug: string;
  };
};

// Optional: Function to generate static paths if using SSG
// import { getAllNewsletters } from '@/lib/api';
// export async function generateStaticParams() {
//   const newsletters: Newsletter[] = await getAllNewsletters();
//   return newsletters.map((newsletter) => ({
//     slug: newsletter.attributes.slug,
//   }));
// }

export default async function NewsletterPage({ params }: Props) {
  const { slug } = params;
  const newsletter: Newsletter | null = await getNewsletterBySlug(slug);

  if (!newsletter) {
    notFound(); // Triggers the not-found page if newsletter isn't found
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{newsletter.attributes.title}</h1>
      {/* This is a basic rendering of content.
          If your content is Markdown or HTML, you might need a specific parser/renderer.
          For example, if it's Markdown, you might use a library like 'react-markdown'.
      */}
      <div className="prose lg:prose-xl max-w-none">
        {/* Assuming content is simple text or HTML that can be directly rendered.
            If it's HTML from a rich text editor, ensure it's sanitized if you use dangerouslySetInnerHTML.
            For Markdown, use a component like react-markdown.
        */}
        <p>{newsletter.attributes.content || 'No content available.'}</p>
      </div>
      {/* You can add more details like author, date, etc. here */}
    </div>
  );
}

// Optional: Add revalidation if needed, e.g., for ISR
// export const revalidate = 60; // Revalidate every 60 seconds
