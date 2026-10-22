import type { Metadata } from "next";
import Link from "next/link";
import { Motorbike, Play, Route } from "lucide-react";
import { createSupabaseClient, type TripRow } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Trips",
  description:
    "Motorcycle trips across Pakistan, with routes, distances, and YouTube links.",
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

function youtubeHref(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") {
      return url.toString();
    }
  } catch {
    return null;
  }

  return null;
}

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
    .order("created_at", { ascending: false });

  if (error) {
    return { status: "error" };
  }

  return { status: "ready", trips: (data ?? []) as TripRow[] };
}

export default async function TripsPage() {
  const result = await loadTrips();

  return (
    <div className="page-shell">
      <p className="kicker inline-flex items-center gap-2">
        <Motorbike className="h-4 w-4" aria-hidden="true" />
        The road
      </p>
      <h1 className="page-title">Trips</h1>
      <p className="lede">
        Motorcycle rides across Pakistan — route, distance, and a YouTube link
        for each.{" "}
        <Link href="/distance" className="text-link">
          Add up the distances
        </Link>
        .
      </p>

      {result.status === "missing" ? (
        <p className="panel mt-10 px-6 py-5 text-sm leading-relaxed text-sand-300">
          Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to
          .env.local, then restart the dev server.
        </p>
      ) : null}

      {result.status === "error" ? (
        <p className="panel mt-10 px-6 py-5 text-sm leading-relaxed text-sand-300">
          Trips could not be loaded. Check the trips table and the anon key.
        </p>
      ) : null}

      {result.status === "ready" && result.trips.length === 0 ? (
        <p className="panel mt-10 px-6 py-5 text-sm leading-relaxed text-sand-300">
          No trips yet. Add a row in the trips table and it will show up here.
        </p>
      ) : null}

      {result.status === "ready" && result.trips.length > 0 ? (
        <ul className="mt-10 grid gap-5 md:grid-cols-2 md:gap-6">
          {result.trips.map((trip) => {
            const videoUrl = youtubeHref(trip.youtube_url);

            return (
              <li key={trip.id} className="h-full">
                <article className="panel panel-hover flex h-full flex-col p-6 sm:p-7">
                  <p className="chip">
                    <Route className="h-3.5 w-3.5" aria-hidden="true" />
                    {trip.distance_km.toLocaleString("en-PK")} km
                  </p>
                  <h2 className="mt-5 break-words font-display text-2xl font-bold uppercase tracking-[0.03em] text-sand-50">
                    {trip.title}
                  </h2>

                  <p className="mt-4 flex items-start gap-2.5 text-sm leading-relaxed text-sand-100">
                    <Route
                      className="mt-0.5 h-4 w-4 shrink-0 text-ember-400"
                      aria-hidden="true"
                    />
                    <span className="min-w-0 break-words">
                      <span className="sr-only">Route: </span>
                      {trip.route}
                    </span>
                  </p>

                  <p className="mt-4 flex-1 break-words text-sm leading-relaxed text-sand-300">
                    {trip.description}
                  </p>

                  {videoUrl ? (
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ember mt-7"
                    >
                      <Play className="h-4 w-4" aria-hidden="true" />
                      Watch on YouTube
                    </a>
                  ) : null}
                </article>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
