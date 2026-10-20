import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type TripRow = {
  id: string;
  title: string;
  route: string;
  distance_km: number;
  description: string;
  youtube_url: string | null;
};

export type QuestionInsert = {
  name: string;
  email: string;
  question: string;
};

export function createSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    global: {
      // Next.js 14 caches fetch() for a year even on force-dynamic routes.
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
}
