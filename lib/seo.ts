function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) {
    return explicit;
  }

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(
    /\/$/,
    "",
  );
  if (production) {
    return production.startsWith("http")
      ? production
      : `https://${production}`;
  }

  const preview = process.env.VERCEL_URL?.replace(/\/$/, "");
  if (preview) {
    return preview.startsWith("http") ? preview : `https://${preview}`;
  }

  return "https://naveedalam.com";
}

export const siteConfig = {
  name: "Naveed Alam",
  handle: "@inaveedalam",
  title: "Naveed Alam · Motorcycle Adventure Across Pakistan",
  description:
    "Motorcycle trips, routes, distances, and road stories from Naveed Alam (@inaveedalam) — riding Balochistan, Sindh, Punjab, KPK, Azad Kashmir, and Gilgit Baltistan.",
  url: resolveSiteUrl(),
  locale: "en_PK",
  keywords: [
    "Naveed Alam",
    "inaveedalam",
    "motorcycle Pakistan",
    "bike travel Pakistan",
    "Makran Coastal Highway",
    "Karakoram Highway",
    "motorcycle adventure",
    "Pakistan road trip",
  ],
} as const;
