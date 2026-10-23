export const siteConfig = {
  name: "Naveed Alam",
  handle: "@inaveedalam",
  title: "Naveed Alam · Motorcycle Adventure Across Pakistan",
  description:
    "Motorcycle trips, routes, distances, and road stories from Naveed Alam (@inaveedalam) — riding Balochistan, Sindh, Punjab, KPK, Azad Kashmir, and Gilgit Baltistan.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://naveedalam.com",
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
