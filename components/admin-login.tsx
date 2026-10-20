"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const fieldClassName = "field";

export function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const nextEmail = email.trim();

    if (!nextEmail || !password) {
      setError("Enter your email and password.");
      return;
    }

    setSigningIn(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: nextEmail,
        password,
      });

      if (signInError) {
        setError(signInError.message || "Email or password is incorrect.");
        setSigningIn(false);
        return;
      }

      router.refresh();
      setSigningIn(false);
    } catch {
      setError("Could not sign in. Please try again.");
      setSigningIn(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="panel mt-10 max-w-md p-6 sm:p-8"
      aria-busy={signingIn}
    >
      <h2 className="text-lg font-semibold text-sand-50">Sign in</h2>
      <p className="mt-2 text-sm leading-relaxed text-sand-300">
        Use the admin email and password.
      </p>

      <div className="mt-6">
        <label className="block text-sm font-medium text-sand-100" htmlFor="admin-email">
          Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={fieldClassName}
          placeholder="you@email.com"
          required
        />
      </div>

      <div className="mt-5">
        <label
          className="block text-sm font-medium text-sand-100"
          htmlFor="admin-password"
        >
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={fieldClassName}
          required
        />
      </div>

      {error ? (
        <p className="mt-5 text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={signingIn}
        className="btn-ember mt-6"
      >
        {signingIn ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
