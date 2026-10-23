import type { SocialLabel } from "@/lib/site";

type SocialIconProps = {
  name: SocialLabel;
};

export function SocialIcon({ name }: SocialIconProps) {
  if (name === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none">
        <rect
          x="3.5"
          y="3.5"
          width="17"
          height="17"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" />
      </svg>
    );
  }

  if (name === "YouTube") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
        <path d="M23 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C19.2 5.4 12 5.4 12 5.4s-7.2 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6ZM9.8 15.5v-6.6l6.2 3.3-6.2 3.3Z" />
      </svg>
    );
  }

  if (name === "Facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
        <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1Z" />
      </svg>
    );
  }

  if (name === "TikTok") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
        <path d="M19.6 7.4c-1.5-.1-2.9-.7-4-1.7v8.1c0 3.1-2.5 5.6-5.6 5.6S4.4 16.9 4.4 13.8s2.5-5.6 5.6-5.6c.3 0 .6 0 .9.1v2.8c-.3-.1-.6-.2-.9-.2-1.5 0-2.8 1.2-2.8 2.8s1.2 2.8 2.8 2.8 2.8-1.2 2.8-2.8V2.5h2.7c.2 1.8 1.4 3.4 3.1 4.1v.8Z" />
      </svg>
    );
  }

  // WhatsApp
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
      <path d="M12 2.1C6.6 2.1 2.2 6.4 2.2 11.7c0 1.9.5 3.7 1.5 5.3L2 22l5.2-1.4c1.5.8 3.2 1.3 4.8 1.3 5.4 0 9.8-4.3 9.8-9.6S17.4 2.1 12 2.1Zm0 17.5c-1.5 0-2.9-.4-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3c-.8-1.3-1.2-2.8-1.2-4.3 0-4.4 3.6-8 8.1-8s8.1 3.6 8.1 8-3.5 8.1-8 8.1Zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.2-.3.2-.5.1-.2-.1-.9-.3-1.8-1.1-.7-.6-1.1-1.3-1.2-1.6-.1-.2 0-.4.1-.5l.4-.5c.1-.1.2-.3.2-.4 0-.1 0-.3-.1-.4-.1-.1-.5-1.3-.7-1.8-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.4 2.3.9 2.3.6 2.7.6.4 0 1.3-.5 1.5-1 .2-.5.2-.9.1-1 0-.1-.2-.1-.4-.2Z" />
    </svg>
  );
}
