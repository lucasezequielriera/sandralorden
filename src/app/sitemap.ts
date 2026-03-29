import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.sandralorden.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          es: baseUrl,
          en: `${baseUrl}/en`,
        },
      },
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/formulario`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          es: `${baseUrl}/formulario`,
          en: `${baseUrl}/en/formulario`,
        },
      },
    },
    {
      url: `${baseUrl}/en/formulario`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/programa-de-90-dias`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
      alternates: {
        languages: {
          es: `${baseUrl}/programa-de-90-dias`,
          en: `${baseUrl}/en/90-days-program`,
        },
      },
    },
    {
      url: `${baseUrl}/en/90-days-program`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
  ];
}
