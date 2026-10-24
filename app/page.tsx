import type { Metadata } from "next";
import Link from "next/link";
import {
  Compass,
  Fuel,
  MapPinned,
  MessageCircle,
  Mountain,
  Motorbike,
  Route,
} from "lucide-react";
import { whatsappHref } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Naveed Alam · Motorcycle Adventure Across Pakistan",
  },
  description:
    "Naveed Alam explores Pakistan on two wheels. In the last three years he has ridden through Balochistan, Sindh, Punjab, KPK, Azad Kashmir, and Gilgit Baltistan.",
  openGraph: {
    title: "Naveed Alam · Motorcycle Adventure Across Pakistan",
    description:
      "Three years of asphalt, dust, and high passes — Balochistan to Gilgit Baltistan on a motorcycle.",
  },
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

const rideStats = [
  { label: "Years on the road", value: "3" },
  { label: "Provinces covered", value: "6" },
  { label: "Mode of travel", value: "2 wheels" },
] as const;

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
          className="pointer-events-none absolute -left-24 top-1/3 hidden h-[140%] w-40 -rotate-[18deg] bg-gradient-to-b from-flame-500/20 via-ember-500/25 to-transparent blur-2xl lg:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-[18%] h-1.5 origin-center scale-x-110"
        >
          <div className="road-stripe animate-stripe-drift mx-auto h-full max-w-4xl opacity-70" />
        </div>
        <div
          aria-hidden="true"
          className="animate-road-pulse pointer-events-none absolute inset-x-8 top-[38%] h-px bg-dash-glow sm:inset-x-16"
        />

        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-12 sm:px-6 sm:pb-12 sm:pt-20 lg:pb-14 lg:pt-24">
          <div className="animate-fade-up mx-auto max-w-3xl text-center lg:mx-0 lg:max-w-2xl lg:text-left">
            <p className="kicker justify-center lg:justify-start">
              <Motorbike className="h-4 w-4" aria-hidden="true" />
              Pakistan · Motorcycle adventure
            </p>
            <h1 className="mt-5 font-display text-[2.85rem] uppercase leading-[0.88] tracking-[0.05em] text-sand-50 sm:text-7xl lg:text-[5.5rem]">
              Naveed Alam
            </h1>
            <p className="mt-4 font-display text-[1.35rem] uppercase leading-none tracking-[0.08em] text-ember-400 sm:mt-5 sm:text-3xl">
              Exploring Pakistan on Two Wheels
            </p>
            <p className="mx-auto mt-5 max-w-xl text-[0.95rem] leading-relaxed text-sand-300 sm:mt-6 sm:text-lg lg:mx-0">
              Three years of asphalt, dust, and high passes — Balochistan to
              Gilgit Baltistan on a motorcycle.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center lg:justify-start">
              <Link href="/trips" className="btn-ember">
                <Route className="h-4 w-4" aria-hidden="true" />
                View Trips
              </Link>
              <Link href="/ask-question" className="btn-ghost">
                Ask a Question
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="relative border-y border-white/10 bg-forest-900/80 backdrop-blur-sm">
          <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {rideStats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center px-6 py-6 text-center sm:py-7"
              >
                <p className="font-display text-4xl uppercase tracking-[0.06em] text-sand-50 sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 font-display text-[0.7rem] uppercase tracking-[0.24em] text-sand-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
        aria-labelledby="provinces-heading"
      >
        <div className="max-w-2xl">
          <p className="kicker">
            <MapPinned className="h-3.5 w-3.5" aria-hidden="true" />
            The map
          </p>
          <h2 id="provinces-heading" className="section-title">
            Provinces covered
          </h2>
          <p className="mt-4 text-base leading-relaxed text-sand-300">
            From the southern coast to the high mountains — roads taken when
            the season and the bike lined up.
          </p>
        </div>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {provinces.map((province, index) => {
            const Icon = province.icon;

            return (
              <li
                key={province.name}
                className="panel panel-hover reveal p-5 sm:p-7"
                style={{ animationDelay: `${80 + index * 60}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-display text-sm tracking-[0.22em] text-ember-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center border border-white/10 bg-forest-950/70 text-ember-400">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl uppercase tracking-[0.06em] text-sand-50">
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
