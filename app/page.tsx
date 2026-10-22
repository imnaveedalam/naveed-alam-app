import type { Metadata } from "next";
import Link from "next/link";
import {
  Compass,
  Fuel,
  MapPinned,
  Mountain,
  Motorbike,
  Route,
} from "lucide-react";

export const metadata: Metadata = {
  description:
    "Naveed Alam explores Pakistan on two wheels. In the last three years he has ridden through Balochistan, Sindh, Punjab, KPK, Azad Kashmir, and Gilgit Baltistan.",
};

const provinces = [
  {
    name: "Balochistan",
    detail: "Desert highways, empty horizons, and the Makran coast.",
    icon: Compass,
  },
  {
    name: "Sindh",
    detail: "The Indus plain, running south toward the Arabian Sea.",
    icon: Route,
  },
  {
    name: "Punjab",
    detail: "Cities, farmland, and the long straight roads between them.",
    icon: MapPinned,
  },
  {
    name: "KPK",
    detail: "Khyber Pakhtunkhwa, from the passes into the hills.",
    icon: Mountain,
  },
  {
    name: "Azad Kashmir",
    detail: "River valleys, forested slopes, and green ridgelines.",
    icon: Mountain,
  },
  {
    name: "Gilgit Baltistan",
    detail: "High mountains and the roads beneath the Karakoram.",
    icon: Fuel,
  },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-asphalt-glow"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-road-fade"
        />
        <div
          aria-hidden="true"
          className="animate-road-pulse pointer-events-none absolute inset-x-0 top-[42%] h-px bg-gradient-to-r from-transparent via-ember-500/50 to-transparent sm:top-[48%]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 top-10 hidden h-64 w-64 rounded-full border border-ember-500/15 lg:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 top-28 hidden h-40 w-40 rounded-full border border-flame-500/20 lg:block"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1.45fr)_minmax(17rem,0.7fr)] lg:gap-14 lg:py-24">
          <div className="animate-fade-up max-w-2xl">
            <p className="kicker inline-flex items-center gap-2">
              <Motorbike className="h-4 w-4" aria-hidden="true" />
              Pakistan · Two wheels
            </p>
            <h1 className="mt-5 font-display text-[2.9rem] font-bold uppercase leading-[0.92] tracking-[0.02em] text-sand-50 sm:text-6xl lg:text-7xl">
              Naveed Alam
            </h1>
            <p className="mt-5 max-w-xl font-display text-xl font-semibold uppercase leading-snug tracking-[0.04em] text-ember-400 sm:text-2xl">
              Exploring Pakistan on Two Wheels
            </p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-sand-300 sm:text-lg">
              A motorcycle traveler who has covered Balochistan, Sindh, Punjab,
              KPK, Azad Kashmir, and Gilgit Baltistan in the last 3 years —
              asphalt, dust, and the open road.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/trips" className="btn-ember">
                <Route className="h-4 w-4" aria-hidden="true" />
                View Trips
              </Link>
              <Link href="/ask-question" className="btn-ghost">
                Ask a Question
              </Link>
            </div>
          </div>

          <aside className="panel animate-fade-up overflow-hidden p-6 sm:p-8 [animation-delay:120ms]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full border border-ember-400/20"
            />
            <div className="relative flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ember-500/15 text-ember-400">
                <Motorbike className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="kicker">The ride so far</p>
            </div>
            <dl className="relative mt-7 space-y-5">
              <div className="border-b border-white/10 pb-5">
                <dt className="text-sm text-sand-300">On the road</dt>
                <dd className="mt-1.5 font-display text-3xl font-bold uppercase tracking-wide text-sand-50">
                  3 years
                </dd>
              </div>
              <div className="border-b border-white/10 pb-5">
                <dt className="text-sm text-sand-300">Places covered</dt>
                <dd className="mt-1.5 font-display text-3xl font-bold uppercase tracking-wide text-sand-50">
                  6
                </dd>
              </div>
              <div>
                <dt className="text-sm text-sand-300">How he travels</dt>
                <dd className="mt-1.5 font-display text-3xl font-bold uppercase tracking-wide text-sand-50">
                  Two wheels
                </dd>
              </div>
            </dl>
            <div className="road-mark" />
          </aside>
        </div>
      </section>

      <section
        className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20 lg:pb-24"
        aria-labelledby="provinces-heading"
      >
        <div className="max-w-2xl">
          <p className="kicker">The map</p>
          <h2 id="provinces-heading" className="section-title">
            Provinces covered
          </h2>
          <p className="mt-4 text-base leading-relaxed text-sand-300">
            Three years of riding, from the southern coast to the high
            mountains.
          </p>
        </div>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {provinces.map((province, index) => {
            const Icon = province.icon;

            return (
              <li key={province.name} className="panel panel-hover p-6 sm:p-7">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-display text-sm font-bold tracking-[0.18em] text-ember-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-forest-950/60 text-ember-400">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl font-bold uppercase tracking-[0.04em] text-sand-50">
                  {province.name}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-sand-300">
                  {province.detail}
                </p>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
