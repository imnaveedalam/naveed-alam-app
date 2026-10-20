import type { Metadata } from "next";
import Link from "next/link";
import { Motorbike } from "lucide-react";

export const metadata: Metadata = {
  description:
    "Naveed Alam explores Pakistan on two wheels. In the last three years he has ridden through Balochistan, Sindh, Punjab, KPK, Azad Kashmir, and Gilgit Baltistan.",
};

const provinces = [
  {
    name: "Balochistan",
    detail: "Desert highways, empty horizons, and the Makran coast.",
  },
  {
    name: "Sindh",
    detail: "The Indus plain, running south toward the Arabian Sea.",
  },
  {
    name: "Punjab",
    detail: "Cities, farmland, and the long straight roads between them.",
  },
  {
    name: "KPK",
    detail: "Khyber Pakhtunkhwa, from the passes into the hills.",
  },
  {
    name: "Azad Kashmir",
    detail: "River valleys, forested slopes, and green ridgelines.",
  },
  {
    name: "Gilgit Baltistan",
    detail: "High mountains and the roads beneath the Karakoram.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(240,119,26,0.24),transparent_32%),radial-gradient(circle_at_88%_8%,rgba(45,106,79,0.5),transparent_40%)]"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)] lg:py-28">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-ember-400">
              <Motorbike className="h-4 w-4" aria-hidden="true" />
              Pakistan · Motorcycle travel
            </p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-sand-50 sm:text-7xl">
              Naveed Alam
            </h1>
            <p className="mt-4 max-w-xl text-xl font-medium text-ember-300 sm:text-2xl">
              Exploring Pakistan on Two Wheels
            </p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-sand-300 sm:text-lg">
              A motorcycle traveler who has covered Balochistan, Sindh, Punjab,
              KPK, Azad Kashmir, and Gilgit Baltistan in the last 3 years.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/trips"
                className="inline-flex items-center justify-center rounded-full bg-ember-500 px-6 py-3 text-sm font-semibold text-forest-950 transition-colors hover:bg-ember-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-300"
              >
                View Trips
              </Link>
              <Link
                href="/ask-question"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-sand-50 transition-colors hover:border-ember-500 hover:text-ember-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400"
              >
                Ask a Question
              </Link>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-forest-800/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ember-400">
              The ride so far
            </p>
            <dl className="mt-6 space-y-5">
              <div className="border-b border-white/10 pb-5">
                <dt className="text-sm text-sand-300">On the road</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-sand-50">
                  3 years
                </dd>
              </div>
              <div className="border-b border-white/10 pb-5">
                <dt className="text-sm text-sand-300">Places covered</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-sand-50">
                  6
                </dd>
              </div>
              <div>
                <dt className="text-sm text-sand-300">How he travels</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-sand-50">
                  Two wheels
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6" aria-labelledby="provinces-heading">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ember-400">
            The map
          </p>
          <h2
            id="provinces-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-sand-50 sm:text-4xl"
          >
            Provinces covered
          </h2>
          <p className="mt-4 text-base leading-relaxed text-sand-300">
            Three years of riding, from the southern coast to the high
            mountains.
          </p>
        </div>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {provinces.map((province, index) => (
            <li
              key={province.name}
              className="rounded-3xl border border-white/10 bg-forest-800/80 p-6"
            >
              <span className="text-sm font-semibold tracking-[0.16em] text-ember-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-xl font-semibold text-sand-50">
                {province.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-sand-300">
                {province.detail}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
