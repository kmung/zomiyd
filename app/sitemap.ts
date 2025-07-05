import type { MetadataRoute } from 'next'

const GENERATED_AT = new Date().toISOString()  // single timestamp for when the sitemap was generated

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.zomiyouthdevelopment.org/',
      lastModified: GENERATED_AT,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://www.zomiyouthdevelopment.org/about',
      lastModified: GENERATED_AT,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.zomiyouthdevelopment.org/donate',
      lastModified: GENERATED_AT,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: 'https://www.zomiyouthdevelopment.org/what-we-do',
      lastModified: GENERATED_AT,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}