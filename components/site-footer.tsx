import Link from "next/link";
import { navLinks, socialHandle, socialLinks } from "@/lib/site";
import { SocialIcon } from "@/components/social-icon";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-forest-950">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-base font-semibold text-sand-50">Naveed Alam</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-sand-300">
            A personal travel journal of roads, ridgelines, and the long way
            around.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ember-400">
            Explore
          </p>
          <ul className="mt-4 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-sand-300 transition-colors hover:text-sand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ember-400">
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
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-sand-100 transition-colors hover:border-ember-500 hover:text-ember-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400"
                >
                  <SocialIcon name={link.label} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-sand-400 sm:px-6 sm:text-left">
          © {year} Naveed Alam. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
