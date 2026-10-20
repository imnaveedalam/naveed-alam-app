"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AdminSignOut() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signOut() {
    setError(null);
    setSigningOut(true);

    try {
      const supabase = createClient();
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        setError("Could not sign out. Please try again.");
        setSigningOut(false);
        return;
      }

      router.refresh();
      setSigningOut(false);
    } catch {
      setError("Could not sign out. Please try again.");
      setSigningOut(false);
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-2 sm:items-end">
      <button
        type="button"
        onClick={signOut}
        disabled={signingOut}
        className="inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-sand-50 transition-colors hover:border-ember-500 hover:text-ember-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {signingOut ? "Signing out..." : "Sign out"}
      </button>
      {error ? (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
