import type { Metadata } from "next";
import { Gauge } from "lucide-react";
import { DistanceCalculator } from "@/components/distance-calculator";
import { createSupabaseClient, type TripRow } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Distance Calculator",
  description:
    "Add up motorcycle trip distances across Pakistan — compare rides, estimate riding days, and see routes on the map.",
  openGraph: {
    title: "Distance Calculator · Naveed Alam",
    description:
      "Total motorcycle kilometres, compare selected trips, and view routes on an interactive map.",
  },
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

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
    <div className="page-shell">
      <p className="kicker inline-flex items-center gap-2">
        <Gauge className="h-4 w-4" aria-hidden="true" />
        The ride
      </p>
      <h1 className="page-title">Distance calculator</h1>
      <p className="lede">
        Select any set of trips to total the kilometres, estimate riding days,
        and plot those routes on the map.
      </p>

      {result.status === "missing" ? (
        <div role="status" className="panel mt-8 px-5 py-5 sm:mt-10 sm:px-6">
          <p className="kicker">Setup needed</p>
          <p className="mt-2 text-sm leading-relaxed text-sand-300">
            Add the Supabase URL and anon key to .env.local, then restart the
            dev server.
          </p>
        </div>
      ) : null}

      {result.status === "error" ? (
        <div
          role="alert"
          className="panel mt-8 border-ember-500/50 px-5 py-5 sm:mt-10 sm:px-6"
        >
          <p className="kicker">Could not load trips</p>
          <p className="mt-2 text-sm leading-relaxed text-sand-300">
            Trips could not be loaded, so the calculator has nothing to add up.
          </p>
        </div>
      ) : null}

      {result.status === "ready" && result.trips.length === 0 ? (
        <div
          role="status"
          className="panel mt-8 border-dashed border-sand-400/35 px-5 py-5 sm:mt-10 sm:px-6"
        >
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-sand-300">
            Empty table
          </p>
          <p className="mt-2 text-sm leading-relaxed text-sand-300">
            No trips yet. Add rows to the trips table and their distances will
            show up here.
          </p>
        </div>
      ) : null}

      {result.status === "ready" && result.trips.length > 0 ? (
        <DistanceCalculator trips={result.trips} />
      ) : null}
    </div>
  );
}
