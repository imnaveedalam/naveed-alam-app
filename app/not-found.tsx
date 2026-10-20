import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ember-400">
        Off the map
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-sand-50">
        This page is off the route.
      </h1>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-ember-500 px-5 py-3 text-sm font-semibold text-forest-950 transition-colors hover:bg-ember-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-300"
      >
        Back home
      </Link>
    </div>
  );
}
