export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/trips", label: "Trips" },
  { href: "/distance", label: "Distance" },
  { href: "/gallery", label: "Gallery" },
  { href: "/ask-question", label: "Ask Question" },
  { href: "/about", label: "About" },
] as const;

/** Pakistan mobile 03042199261 → international wa.me format */
export const whatsappNumber = "923042199261";

export const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  "Assalamualaikum Naveed Alam — I have a motorcycle travel question.",
)}`;

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
    href: whatsappHref,
  },
] as const;

export type SocialLabel = (typeof socialLinks)[number]["label"];

export const socialHandle = "@inaveedalam";
