"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { TripRow } from "@/lib/supabase";
import { routeStops } from "@/lib/places";

const TripMap = dynamic(
  () => import("@/components/trip-map").then((module) => module.TripMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center bg-forest-900 text-sm text-sand-300">
        Loading map…
      </div>
    ),
  },
);

type DistanceCalculatorProps = {
  trips: TripRow[];
};

function formatKm(value: number) {
  return `${value.toLocaleString("en-PK")} km`;
}

export function DistanceCalculator({ trips }: DistanceCalculatorProps) {
  const [selectedId, setSelectedId] = useState("all");
  const selected = trips.find((trip) => trip.id === selectedId) ?? null;
  const activeId = selected ? selected.id : "all";
  const visible = selected ? [selected] : trips;
  const allTotal = trips.reduce((sum, trip) => sum + Number(trip.distance_km), 0);
  const selectedKm = selected ? Number(selected.distance_km) : allTotal;

  const lines = visible
    .map((trip) => ({
      id: trip.id,
      title: trip.title,
      points: routeStops(trip.route)
        .map((stop) => stop.point)
        .filter((point): point is [number, number] => point !== null),
    }))
    .filter((line) => line.points.length > 0);

  const unmapped = visible.filter((trip) => {
    const stops = routeStops(trip.route);
    return stops.length < 2 || stops.some((stop) => stop.point === null);
  });

  return (
    <div className="mt-10 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <article
          className={`panel p-6 sm:p-7 ${
            activeId === "all"
              ? "border-ember-400/75 shadow-lift"
              : "panel-hover"
          }`}
        >
          <p className="kicker">All trips</p>
          <p className="mt-4 text-3xl font-semibold tabular-nums tracking-tight text-sand-50 sm:text-4xl lg:text-5xl">
            {formatKm(allTotal)}
          </p>
          <p className="mt-3.5 text-sm leading-relaxed text-sand-300">
            Combined distance of every trip in the database.
          </p>
        </article>

        <article
          className={`panel p-6 sm:p-7 ${
            selected ? "border-ember-400/75 shadow-lift" : "panel-hover"
          }`}
          aria-live="polite"
        >
          <p className="kicker">{selected ? "This trip" : "Selected"}</p>
          <p className="mt-4 break-words text-3xl font-semibold tabular-nums tracking-tight text-sand-50 sm:text-4xl lg:text-5xl">
            {formatKm(selectedKm)}
          </p>
          <p className="mt-3.5 text-sm font-medium leading-snug text-sand-100">
            {selected ? selected.title : "All trips"}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-sand-300">
            {selected
              ? selected.route
              : "Every ride is included. Pick one trip to see its own distance."}
          </p>
        </article>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start lg:gap-6">
        <section className="panel p-5 sm:p-6">
          <label className="block text-sm font-medium text-sand-100" htmlFor="trip">
            Trip
          </label>
          <select
            id="trip"
            value={activeId}
            onChange={(event) => setSelectedId(event.target.value)}
            className="field"
          >
            <option value="all">All trips</option>
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.title}
              </option>
            ))}
          </select>

          <ul className="mt-5 space-y-1.5 border-t border-white/10 pt-5">
            <li>
              <button
                type="button"
                onClick={() => setSelectedId("all")}
                aria-pressed={activeId === "all"}
                className={`flex min-h-11 w-full items-start justify-between gap-3 rounded-xl px-3 py-3 text-left text-sm transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400 ${
                  activeId === "all"
                    ? "bg-forest-950 text-sand-50 shadow-[inset_0_0_0_1px_rgba(255,159,67,0.7)]"
                    : "text-sand-100 hover:bg-forest-900/90"
                }`}
              >
                <span className="min-w-0 leading-snug">All trips</span>
                <span className="shrink-0 font-medium tabular-nums text-ember-400">
                  {formatKm(allTotal)}
                </span>
              </button>
            </li>
            {trips.map((trip) => {
              const active = trip.id === activeId;

              return (
                <li key={trip.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(trip.id)}
                    aria-pressed={active}
                    className={`flex min-h-11 w-full items-start justify-between gap-3 rounded-xl px-3 py-3 text-left text-sm transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400 ${
                      active
                        ? "bg-forest-950 text-sand-50 shadow-[inset_0_0_0_1px_rgba(255,159,67,0.7)]"
                        : "text-sand-100 hover:bg-forest-900/90"
                    }`}
                  >
                    <span className="min-w-0 leading-snug">{trip.title}</span>
                    <span className="shrink-0 pt-0.5 font-medium tabular-nums text-ember-400">
                      {formatKm(Number(trip.distance_km))}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="panel relative z-0 min-w-0 overflow-hidden">
          <TripMap lines={lines} />
          {unmapped.length > 0 ? (
            <p className="border-t border-white/10 px-5 py-4 text-sm leading-relaxed text-sand-300">
              {unmapped.length === visible.length
                ? "These routes are not drawn on the map yet. The kilometres above still come from the stored trip records."
                : "Some routes are not drawn because a place name could not be matched. Stored kilometres are still shown above."}
            </p>
          ) : (
            <p className="border-t border-white/10 px-5 py-4 text-sm text-sand-300">
              {selected
                ? "OpenStreetMap route for the selected ride."
                : "OpenStreetMap route for the selected rides."}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
