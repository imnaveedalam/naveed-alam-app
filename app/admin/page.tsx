import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminGalleryUpload } from "@/components/admin-gallery-upload";
import { AdminLogin } from "@/components/admin-login";
import { AdminSignOut } from "@/components/admin-sign-out";
import { AdminTripForm } from "@/components/admin-trip-form";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { AdminQuestions } from "./questions";

export const metadata: Metadata = {
  title: "Admin",
  description: "Sign in to add trips, upload gallery photos, and read questions.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function AdminIntro({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-shell">
      <p className="kicker">Private</p>
      <h1 className="page-title">Admin</h1>
      {children}
    </div>
  );
}

function QuestionsLoading() {
  return (
    <section aria-labelledby="admin-questions-heading" aria-busy="true">
      <h2
        id="admin-questions-heading"
        className="text-lg font-semibold text-sand-50"
      >
        Questions
      </h2>
      <p className="mt-4 text-sm text-sand-300" role="status">
        Loading questions...
      </p>
    </section>
  );
}

export default async function AdminPage() {
  if (!getSupabaseEnv()) {
    return (
      <AdminIntro>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-sand-300">
          Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to
          .env.local, then restart the dev server.
        </p>
      </AdminIntro>
    );
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  const user = error ? null : data.user;

  if (!user) {
    return (
      <AdminIntro>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-sand-300">
          Sign in to add a trip, upload gallery photos, or read questions.
        </p>
        <AdminLogin />
      </AdminIntro>
    );
  }

  return (
    <AdminIntro>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-sand-300">
          Signed in as{" "}
          <span className="break-all font-medium text-sand-50">
            {user.email ?? "your account"}
          </span>
        </p>
        <AdminSignOut />
      </div>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-2">
        <AdminTripForm />
        <div className="min-w-0">
          <AdminGalleryUpload />
        </div>
        <div className="lg:col-span-2">
          <Suspense fallback={<QuestionsLoading />}>
            <AdminQuestions />
          </Suspense>
        </div>
      </div>
    </AdminIntro>
  );
}
