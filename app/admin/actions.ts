"use server";

import { createClient } from "@/lib/supabase/server";
import {
  validateTrip,
  type TripFieldErrors,
  type TripFormValues,
} from "@/lib/admin-trip";

export type CreateTripResult =
  | { ok: true }
  | { ok: false; formError: string | null; fieldErrors: TripFieldErrors };

export async function createTrip(values: TripFormValues): Promise<CreateTripResult> {
  const { fieldErrors, trip } = validateTrip(values);

  if (!trip) {
    return { ok: false, formError: null, fieldErrors };
  }

  try {
    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.getUser();

    if (authError || !data.user) {
      return {
        ok: false,
        formError: "Sign in before adding a trip.",
        fieldErrors: {},
      };
    }

    const { error } = await supabase.from("trips").insert(trip);

    if (error) {
      return {
        ok: false,
        formError: "The trip could not be saved. Please try again.",
        fieldErrors: {},
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      formError: "The trip could not be saved. Please try again.",
      fieldErrors: {},
    };
  }
}
