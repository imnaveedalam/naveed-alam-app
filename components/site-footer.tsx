import Link from "next/link";
import { navLinks, socialHandle, socialLinks } from "@/lib/site";
import { SocialIcon } from "@/components/social-icon";

const footerLinks = [
  ...navLinks,
  { href: "/admin", label: "Admin" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-forest-950/95">
      <div className="h-px bg-gradient-to-r from-transparent via-ember-500/80 to-transparent" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:gap-14 lg:py-16">
        <div>
          <p className="text-base font-semibold tracking-tight text-sand-50">
            Naveed Alam
          </p>
          <p className="mt-3.5 max-w-xs text-sm leading-relaxed text-sand-300">
            A personal travel journal of roads, ridgelines, and the long way
            around.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-ember-400">
            Explore
          </p>
          <ul className="mt-4 space-y-0.5">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-10 items-center text-sm text-sand-300 transition-colors duration-200 hover:text-ember-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-ember-400">
            Social
          </p>
          <p className="mt-4 text-sm font-medium text-sand-50">{socialHandle}</p>
          <ul className="mt-4 flex items-center gap-3">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${link.label} ${socialHandle}`}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-forest-900/70 text-sand-100 transition duration-200 hover:-translate-y-0.5 hover:border-ember-400 hover:bg-forest-800 hover:text-ember-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400"
                >
                  <SocialIcon name={link.label} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-1 px-4 py-4 sm:flex-row sm:justify-between sm:px-6">
          <p className="text-center text-xs text-sand-400 sm:text-left">
            © {year} Naveed Alam. All rights reserved.
          </p>
          <Link
            href="/admin"
            className="inline-flex min-h-10 items-center text-sm font-medium text-sand-300 transition-colors duration-200 hover:text-ember-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
