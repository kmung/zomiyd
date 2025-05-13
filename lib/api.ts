// Strapi fetchers (blogs, media, newsletters, etc.)

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function getAllBlogs() {
  const res = await fetch(`${STRAPI_URL}/api/blogs?populate=*`);
  const data = await res.json();
  return data.data;
}

export async function getBlogBySlug(slug: string) {
  const res = await fetch(`${STRAPI_URL}/api/blogs?filters[slug][$eq]=${slug}&populate=*`);
  const data = await res.json();
  return data.data?.[0] || null;
}
