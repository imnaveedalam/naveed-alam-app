import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requireSupabaseEnv } from "@/lib/supabase/env";

export function createClient() {
  const { url, key } = requireSupabaseEnv();
  const cookieStore = cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot set cookies. Middleware refreshes the session.
        }
      },
    },
  });
}
