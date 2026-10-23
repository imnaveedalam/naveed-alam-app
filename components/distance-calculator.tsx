"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  Copy,
  Gauge,
  Mountain,
  Route,
  Search,
  Timer,
} from "lucide-react";
import type { TripRow } from "@/lib/supabase";
import { routeStops } from "@/lib/places";

const TripMap = dynamic(
  () => import("@/components/trip-map").then((module) => module.TripMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[280px] items-center justify-center bg-forest-900 text-sm text-sand-300 sm:h-[420px]">
        Loading map…
      </div>
    ),
  },
);

type DistanceCalculatorProps = {
  trips: TripRow[];
};

type SortMode = "newest" | "distance-desc" | "distance-asc" | "title";

function formatKm(value: number) {
  return `${value.toLocaleString("en-PK")} km`;
}

export function DistanceCalculator({ trips }: DistanceCalculatorProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    trips.map((trip) => trip.id),
  );
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("distance-desc");
  const [copied, setCopied] = useState(false);

  const allTotal = useMemo(
    () => trips.reduce((sum, trip) => sum + Number(trip.distance_km), 0),
    [trips],
  );

  const longest = useMemo(() => {
    return trips.reduce((best, trip) =>
      Number(trip.distance_km) > Number(best.distance_km) ? trip : best,
    );
  }, [trips]);

  const average = trips.length > 0 ? Math.round(allTotal / trips.length) : 0;

  const filteredTrips = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = trips.filter((trip) => {
      if (!needle) {
        return true;
      }
      return (
        trip.title.toLowerCase().includes(needle) ||
        trip.route.toLowerCase().includes(needle)
      );
    });

    return [...list].sort((a, b) => {
      if (sortMode === "title") {
        return a.title.localeCompare(b.title);
      }
      if (sortMode === "distance-asc") {
        return Number(a.distance_km) - Number(b.distance_km);
      }
      if (sortMode === "distance-desc") {
        return Number(b.distance_km) - Number(a.distance_km);
      }
      // newest: reverse the load order (created_at ascending from the server)
      return trips.indexOf(b) - trips.indexOf(a);
    });
  }, [trips, query, sortMode]);

  const selectedTrips = trips.filter((trip) => selectedIds.includes(trip.id));
  const selectedTotal = selectedTrips.reduce(
    (sum, trip) => sum + Number(trip.distance_km),
    0,
  );
  const selectedShare =
    allTotal > 0 ? Math.round((selectedTotal / allTotal) * 100) : 0;
  const rideDays = Math.max(1, Math.ceil(selectedTotal / 250));

  const lines = selectedTrips
    .map((trip) => ({
      id: trip.id,
      title: trip.title,
      points: routeStops(trip.route)
        .map((stop) => stop.point)
        .filter((point): point is [number, number] => point !== null),
    }))
    .filter((line) => line.points.length > 0);

  const unmapped = selectedTrips.filter((trip) => {
    const stops = routeStops(trip.route);
    return stops.length < 2 || stops.some((stop) => stop.point === null);
  });

  function toggleTrip(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  }

  function selectAllVisible() {
    setSelectedIds((current) => {
      const next = new Set(current);
      filteredTrips.forEach((trip) => next.add(trip.id));
      return Array.from(next);
    });
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  async function copySummary() {
    const linesText = selectedTrips
      .map((trip) => `• ${trip.title}: ${formatKm(Number(trip.distance_km))}`)
      .join("\n");
    const summary = `Naveed Alam motorcycle distance\nSelected: ${formatKm(selectedTotal)} across ${selectedTrips.length} trip(s)\nAll trips: ${formatKm(allTotal)}\n\n${linesText}`;

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <article className="panel reveal p-4 sm:p-5">
          <p className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ember-400">
            <Route className="h-3.5 w-3.5" aria-hidden="true" />
            All trips
          </p>
          <p className="mt-3 font-display text-2xl tabular-nums text-sand-50 sm:text-3xl">
            {formatKm(allTotal)}
          </p>
        </article>
        <article className="panel reveal reveal-delay-1 p-4 sm:p-5">
          <p className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ember-400">
            <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
            Average
          </p>
          <p className="mt-3 font-display text-2xl tabular-nums text-sand-50 sm:text-3xl">
            {formatKm(average)}
          </p>
        </article>
        <article className="panel reveal reveal-delay-1 p-4 sm:p-5">
          <p className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ember-400">
            <Mountain className="h-3.5 w-3.5" aria-hidden="true" />
            Longest
          </p>
          <p className="mt-3 font-display text-2xl tabular-nums text-sand-50 sm:text-3xl">
            {formatKm(Number(longest.distance_km))}
          </p>
          <p className="mt-1 truncate text-xs text-sand-300">{longest.title}</p>
        </article>
        <article className="panel reveal reveal-delay-2 p-4 sm:p-5">
          <p className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ember-400">
            <Timer className="h-3.5 w-3.5" aria-hidden="true" />
            Selected
          </p>
          <p className="mt-3 font-display text-2xl tabular-nums text-sand-50 sm:text-3xl">
            {formatKm(selectedTotal)}
          </p>
          <p className="mt-1 text-xs text-sand-300">
            {selectedTrips.length} trip{selectedTrips.length === 1 ? "" : "s"} · ~
            {rideDays} day{rideDays === 1 ? "" : "s"} @ 250 km/day
          </p>
        </article>
      </div>

      <article className="panel p-5 sm:p-6" aria-live="polite">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="kicker">Your selection</p>
            <p className="mt-2 font-display text-3xl tabular-nums text-sand-50 sm:text-4xl">
              {formatKm(selectedTotal)}
            </p>
            <p className="mt-2 text-sm text-sand-300">
              {selectedShare}% of all logged motorcycle kilometres
            </p>
          </div>
          <button
            type="button"
            onClick={() => void copySummary()}
            className="btn-ghost"
          >
            <Copy className="h-4 w-4" aria-hidden="true" />
            {copied ? "Copied" : "Copy summary"}
          </button>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-forest-950">
          <div
            className="h-full rounded-full bg-gradient-to-r from-flame-500 via-ember-500 to-ember-400 transition-[width] duration-500 ease-out"
            style={{ width: `${Math.min(100, selectedShare)}%` }}
          />
        </div>
      </article>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:items-start lg:gap-6">
        <section className="panel p-4 sm:p-6">
          <label
            className="block text-sm font-medium text-sand-100"
            htmlFor="distance-search"
          >
            Find a trip
          </label>
          <div className="relative mt-2">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sand-400"
              aria-hidden="true"
            />
            <input
              id="distance-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title or route"
              className="field pl-10"
            />
          </div>

          <label
            className="mt-4 block text-sm font-medium text-sand-100"
            htmlFor="distance-sort"
          >
            Sort by
          </label>
          <select
            id="distance-sort"
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as SortMode)}
            className="field"
          >
            <option value="distance-desc">Distance (high to low)</option>
            <option value="distance-asc">Distance (low to high)</option>
            <option value="title">Title (A–Z)</option>
            <option value="newest">Default order</option>
          </select>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={selectAllVisible}
              className="inline-flex min-h-10 items-center border border-white/10 px-3 text-xs font-semibold uppercase tracking-wide text-sand-100 transition hover:border-ember-400 hover:text-ember-300"
            >
              Select visible
            </button>
            <button
              type="button"
              onClick={clearSelection}
              className="inline-flex min-h-10 items-center border border-white/10 px-3 text-xs font-semibold uppercase tracking-wide text-sand-100 transition hover:border-ember-400 hover:text-ember-300"
            >
              Clear
            </button>
          </div>

          <ul className="mt-5 max-h-[28rem] space-y-1.5 overflow-y-auto overscroll-contain border-t border-white/10 pt-4 sm:max-h-[36rem]">
            {filteredTrips.length === 0 ? (
              <li className="px-3 py-4 text-sm text-sand-300">
                No trips match that search.
              </li>
            ) : null}
            {filteredTrips.map((trip) => {
              const active = selectedIds.includes(trip.id);

              return (
                <li key={trip.id}>
                  <label
                    className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-sm px-3 py-3 text-sm transition duration-200 ${
                      active
                        ? "bg-forest-950 text-sand-50 shadow-[inset_0_0_0_1px_rgba(232,93,4,0.7)]"
                        : "text-sand-100 hover:bg-forest-900/90"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleTrip(trip.id)}
                      className="mt-1 h-4 w-4 shrink-0 accent-ember-500"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block leading-snug">{trip.title}</span>
                      <span className="mt-1 block text-xs text-sand-400">
                        {trip.route}
                      </span>
                    </span>
                    <span className="shrink-0 pt-0.5 font-medium tabular-nums text-ember-400">
                      {formatKm(Number(trip.distance_km))}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="panel relative z-0 min-w-0 overflow-hidden">
          <TripMap lines={lines} />
          {selectedTrips.length === 0 ? (
            <p className="border-t border-white/10 px-4 py-4 text-sm leading-relaxed text-sand-300 sm:px-5">
              Select one or more trips to total the distance and draw routes on
              the map.
            </p>
          ) : unmapped.length > 0 ? (
            <p className="border-t border-white/10 px-4 py-4 text-sm leading-relaxed text-sand-300 sm:px-5">
              {unmapped.length === selectedTrips.length
                ? "These routes are not drawn on the map yet. The kilometres above still come from the stored trip records."
                : "Some routes are not drawn because a place name could not be matched. Stored kilometres are still shown above."}
            </p>
          ) : (
            <p className="border-t border-white/10 px-4 py-4 text-sm text-sand-300 sm:px-5">
              Map shows the selected ride{selectedTrips.length === 1 ? "" : "s"}.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
