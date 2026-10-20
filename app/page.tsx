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
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_20%,rgba(240,119,26,0.26),transparent_36%),radial-gradient(ellipse_at_90%_-5%,rgba(45,106,79,0.5),transparent_44%),linear-gradient(180deg,rgba(7,20,15,0.15),rgba(7,20,15,0.55)_78%,rgba(7,20,15,0.95))]"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1.4fr)_minmax(17rem,0.7fr)] lg:gap-14 lg:py-24">
          <div className="max-w-2xl">
            <p className="kicker inline-flex items-center gap-2">
              <Motorbike className="h-4 w-4" aria-hidden="true" />
              Pakistan · Motorcycle travel
            </p>
            <h1 className="mt-5 text-[2.75rem] font-semibold leading-[0.98] tracking-tight text-sand-50 sm:text-6xl lg:text-7xl">
              Naveed Alam
            </h1>
            <p className="mt-5 max-w-xl text-xl font-medium leading-snug text-ember-300 sm:text-2xl">
              Exploring Pakistan on Two Wheels
            </p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-sand-300 sm:text-lg">
              A motorcycle traveler who has covered Balochistan, Sindh, Punjab,
              KPK, Azad Kashmir, and Gilgit Baltistan in the last 3 years.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/trips" className="btn-ember">
                View Trips
              </Link>
              <Link href="/ask-question" className="btn-ghost">
                Ask a Question
              </Link>
            </div>
          </div>

          <aside className="panel overflow-hidden p-6 sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-14 h-44 w-44 rounded-full border border-ember-400/25"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-3 -top-5 h-24 w-24 rounded-full border border-white/10"
            />
            <p className="kicker relative">The ride so far</p>
            <dl className="relative mt-7 space-y-5">
              <div className="border-b border-white/10 pb-5">
                <dt className="text-sm text-sand-300">On the road</dt>
                <dd className="mt-1.5 text-3xl font-semibold tracking-tight text-sand-50">
                  3 years
                </dd>
              </div>
              <div className="border-b border-white/10 pb-5">
                <dt className="text-sm text-sand-300">Places covered</dt>
                <dd className="mt-1.5 text-3xl font-semibold tracking-tight text-sand-50">
                  6
                </dd>
              </div>
              <div>
                <dt className="text-sm text-sand-300">How he travels</dt>
                <dd className="mt-1.5 text-3xl font-semibold tracking-tight text-sand-50">
                  Two wheels
                </dd>
              </div>
            </dl>
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
          {provinces.map((province, index) => (
            <li key={province.name} className="panel panel-hover p-6 sm:p-7">
              <span className="text-sm font-semibold tracking-[0.18em] text-ember-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3.5 text-xl font-semibold tracking-tight text-sand-50">
                {province.name}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-sand-300">
                {province.detail}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
