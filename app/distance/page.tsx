import type { Metadata } from "next";
import { DistanceCalculator } from "@/components/distance-calculator";
import { createSupabaseClient, type TripRow } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Distance",
  description:
    "See the distance of one motorcycle trip or the total distance of every trip.",
};

export const dynamic = "force-dynamic";

async function loadTrips(): Promise<
  | { status: "ready"; trips: TripRow[] }
  | { status: "missing" }
  | { status: "error" }
> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return { status: "missing" };
  }

  const { data, error } = await supabase
    .from("trips")
    .select("id, title, route, distance_km, description, youtube_url")
    .order("created_at", { ascending: true });

  if (error) {
    return { status: "error" };
  }

  return { status: "ready", trips: (data ?? []) as TripRow[] };
}

export default async function DistancePage() {
  const result = await loadTrips();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ember-400">
        The ride
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-sand-50 sm:text-5xl">
        Distance calculator
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-sand-300">
        Pick one trip from the database, or add every ride together.
      </p>

      {result.status === "missing" ? (
        <p className="mt-10 rounded-3xl border border-white/10 bg-forest-800 px-6 py-5 text-sm leading-relaxed text-sand-300">
          Add the Supabase URL and anon key to .env.local, then restart the dev
          server.
        </p>
      ) : null}

      {result.status === "error" ? (
        <p className="mt-10 rounded-3xl border border-white/10 bg-forest-800 px-6 py-5 text-sm leading-relaxed text-sand-300">
          Trips could not be loaded, so the calculator has nothing to add up.
        </p>
      ) : null}

      {result.status === "ready" && result.trips.length === 0 ? (
        <p className="mt-10 rounded-3xl border border-white/10 bg-forest-800 px-6 py-5 text-sm leading-relaxed text-sand-300">
          No trips yet. Add rows to the trips table and their distances will
          show up here.
        </p>
      ) : null}

      {result.status === "ready" && result.trips.length > 0 ? (
        <DistanceCalculator trips={result.trips} />
      ) : null}
    </div>
  );
}
