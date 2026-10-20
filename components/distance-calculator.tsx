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
  const visible = selected ? [selected] : trips;
  const total = visible.reduce((sum, trip) => sum + Number(trip.distance_km), 0);

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
    <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
      <section className="rounded-3xl border border-white/10 bg-forest-800 p-6">
        <label className="block text-sm font-medium text-sand-100" htmlFor="trip">
          Trip
        </label>
        <select
          id="trip"
          value={selectedId}
          onChange={(event) => setSelectedId(event.target.value)}
          className="mt-2 w-full rounded-xl border border-white/10 bg-forest-950 px-4 py-3 text-sm text-sand-50 outline-none ring-ember-500 focus:ring-2"
        >
          <option value="all">All trips</option>
          {trips.map((trip) => (
            <option key={trip.id} value={trip.id}>
              {trip.title}
            </option>
          ))}
        </select>

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-ember-400">
          {selected ? selected.route : `${visible.length} trips`}
        </p>
        <p className="mt-2 text-5xl font-semibold tracking-tight text-sand-50">
          {formatKm(total)}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-sand-300">
          {selected
            ? "Distance recorded for this ride."
            : "Combined distance of every trip in the database."}
        </p>

        {!selected && trips.length > 0 ? (
          <ul className="mt-6 space-y-3 border-t border-white/10 pt-5">
            {trips.map((trip) => (
              <li key={trip.id} className="flex items-start justify-between gap-3 text-sm">
                <span className="text-sand-100">{trip.title}</span>
                <span className="shrink-0 font-medium text-ember-400">
                  {formatKm(Number(trip.distance_km))}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="relative z-0 overflow-hidden rounded-3xl border border-white/10 bg-forest-800">
        <TripMap lines={lines} />
        {unmapped.length > 0 ? (
          <p className="px-5 py-4 text-sm leading-relaxed text-sand-300">
            {unmapped.length === visible.length
              ? "These routes are not drawn on the map yet. The distance above still comes from the trip records."
              : "Some routes are not drawn because a place name could not be matched."}
          </p>
        ) : (
          <p className="px-5 py-4 text-sm text-sand-300">
            OpenStreetMap route for the selected ride
            {selected ? "" : "s"}.
          </p>
        )}
      </section>
    </div>
  );
}
