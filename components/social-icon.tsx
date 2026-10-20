type SocialIconProps = {
  name: "Instagram" | "X" | "YouTube";
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

  if (name === "X") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
        <path d="M14.7 10.3 22.2 2h-2.3l-6.5 7.4L8.2 2H2.2l8 11.3L2.2 22h2.3l7-8 5.5 8h6l-8.3-11.7Zm-2.5 2.8-.8-1.2L5.2 3.5h2.5l4.7 6.7.8 1.2 6.6 9.4h-2.5l-5.1-7.3Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
      <path d="M23 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C19.2 5.4 12 5.4 12 5.4s-7.2 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6ZM9.8 15.5v-6.6l6.2 3.3-6.2 3.3Z" />
    </svg>
  );
}
