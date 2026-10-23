import Link from "next/link";
import { Motorbike } from "lucide-react";
import { navLinks, socialLinks } from "@/lib/site";
import { SocialIcon } from "@/components/social-icon";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-forest-950">
      <div className="h-px bg-gradient-to-r from-transparent via-ember-500/90 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="max-w-sm shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 font-display text-xl tracking-[0.08em] text-sand-50 transition-colors duration-200 hover:text-ember-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember-400"
            >
              <span className="flex h-8 w-8 items-center justify-center bg-ember-500 text-forest-950">
                <Motorbike className="h-4 w-4" aria-hidden="true" />
              </span>
              Naveed Alam
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-sand-300">
              Motorcycle miles across Pakistan — coast roads, high passes, and
              the long way around.
            </p>
          </div>

          <div className="min-w-0 flex-1 lg:max-w-xl">
            <p className="font-display text-[0.72rem] tracking-[0.28em] text-ember-400">
              Navigate
            </p>
            <nav aria-label="Footer" className="mt-4">
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3 sm:gap-x-6">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group relative inline-flex min-h-11 w-full items-center text-sm font-medium text-sand-300 transition-colors duration-200 hover:text-sand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400"
                    >
                      <span
                        aria-hidden="true"
                        className="mr-2.5 h-px w-3 shrink-0 bg-ember-500/50 transition-[width,background-color] duration-200 group-hover:w-5 group-hover:bg-ember-400"
                      />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="shrink-0">
            <p className="font-display text-[0.72rem] tracking-[0.28em] text-ember-400">
              Follow
            </p>
            <ul className="mt-4 flex flex-wrap items-center gap-2">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    title={link.label}
                    className="inline-flex h-11 w-11 items-center justify-center border border-white/10 bg-forest-900 text-sand-100 transition duration-200 hover:-translate-y-0.5 hover:border-ember-400 hover:bg-forest-800 hover:text-ember-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400"
                  >
                    <SocialIcon name={link.label} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6">
          <p className="text-center text-xs text-sand-400 sm:text-left">
            © {year} Naveed Alam. All rights reserved.
          </p>
          <Link
            href="/admin"
            className="text-xs font-medium uppercase tracking-[0.16em] text-sand-400 transition-colors duration-200 hover:text-ember-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
