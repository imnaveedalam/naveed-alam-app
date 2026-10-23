export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/trips", label: "Trips" },
  { href: "/distance", label: "Distance" },
  { href: "/gallery", label: "Gallery" },
  { href: "/ask-question", label: "Ask Question" },
  { href: "/about", label: "About" },
] as const;

export const socialLinks = [
  {
    label: "YouTube",
    href: "https://www.youtube.com/@inaveedalam",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/inaveedalam",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/inaveedalam",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@inaveedalam",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/?text=Assalamualaikum%20Naveed%20Alam%20(%40inaveedalam)",
  },
] as const;

export type SocialLabel = (typeof socialLinks)[number]["label"];

export const socialHandle = "@inaveedalam";
