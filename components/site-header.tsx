"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Motorbike, X } from "lucide-react";
import { navLinks } from "@/lib/site";

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-forest-950/94 shadow-soft backdrop-blur-xl">
      <div className="h-1 bg-gradient-to-r from-flame-500 via-ember-500 to-ember-300" />
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-2 px-4 sm:gap-3 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 shrink items-center gap-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember-400"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-ember-500 text-forest-950 shadow-ember transition duration-200 hover:bg-ember-400">
            <Motorbike className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="truncate font-display text-xl tracking-[0.08em] text-sand-50 sm:text-[1.35rem]">
            Naveed Alam
          </span>
        </Link>

        <nav
          className="hidden min-w-0 items-center gap-0.5 lg:flex xl:gap-1"
          aria-label="Main"
        >
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap px-2.5 py-2 font-display text-[0.8rem] tracking-[0.16em] transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400 xl:px-3 xl:text-[0.85rem] ${
                  active
                    ? "bg-ember-500/15 text-ember-300 shadow-[inset_0_-2px_0_0_rgba(232,93,4,0.9)]"
                    : "text-sand-300 hover:bg-white/5 hover:text-sand-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-transparent text-sand-50 transition duration-200 hover:border-white/10 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Mobile"
        hidden={!open}
        className="border-t border-white/10 bg-forest-900/98 backdrop-blur-md lg:hidden"
      >
        <ul className="mx-auto flex max-h-[min(70vh,28rem)] max-w-6xl flex-col gap-0.5 overflow-y-auto overscroll-contain px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
          {navLinks.map((link, index) => {
            const active = isActive(pathname, link.href);

            return (
              <li
                key={link.href}
                className="reveal"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`block min-h-12 px-3 py-3.5 font-display text-lg tracking-[0.12em] transition-colors duration-200 active:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400 ${
                    active
                      ? "bg-ember-500/15 text-ember-300"
                      : "text-sand-100 hover:bg-white/5 hover:text-sand-50"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
