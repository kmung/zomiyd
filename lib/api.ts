// Strapi fetchers (blogs, media, newsletters, etc.)

// TODO: Replace with your actual Strapi API URL from .env.local
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function getAllNewsletters() {
  const res = await fetch(`${STRAPI_URL}/api/newsletters?populate=*`);
  const data = await res.json();
  return data.data;
}

export async function getNewsletterBySlug(slug: string) {
  const res = await fetch(`${STRAPI_URL}/api/newsletters?filters[slug][$eq]=${slug}&populate=*`);
  const data = await res.json();
  return data.data?.[0] || null;
}
