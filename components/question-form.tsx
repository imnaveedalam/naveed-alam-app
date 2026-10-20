"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase";

type QuestionInput = {
  name: string;
  email: string;
  question: string;
};

type FieldName = keyof QuestionInput;
type FieldErrors = Partial<Record<FieldName, string>>;

const emptyValues: QuestionInput = {
  name: "",
  email: "",
  question: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: QuestionInput): FieldErrors {
  const errors: FieldErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const question = values.question.trim();

  if (!name) {
    errors.name = "Enter your name.";
  } else if (name.length < 2) {
    errors.name = "Name should be at least 2 characters.";
  } else if (name.length > 80) {
    errors.name = "Name should be 80 characters or fewer.";
  }

  if (!email) {
    errors.email = "Enter your email.";
  } else if (email.length > 120 || !emailPattern.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!question) {
    errors.question = "Enter your question.";
  } else if (question.length < 10) {
    errors.question = "Question should be at least 10 characters.";
  } else if (question.length > 1000) {
    errors.question = "Question should be 1,000 characters or fewer.";
  }

  return errors;
}

const fieldClassName =
  "mt-2 w-full rounded-xl border bg-forest-950 px-4 py-3 text-sm text-sand-50 outline-none ring-ember-500 placeholder:text-sand-400 focus:ring-2";

export function QuestionForm() {
  const [values, setValues] = useState<QuestionInput>(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [sent, setSent] = useState(false);
  const confirmationRef = useRef<HTMLHeadingElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const questionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (sent) {
      confirmationRef.current?.focus();
    }
  }, [sent]);

  function updateField(field: FieldName, value: string) {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);

    if (Object.keys(errors).length > 0) {
      setErrors(validate(nextValues));
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setFormError(null);

    const firstInvalid = (Object.keys(nextErrors) as FieldName[])[0];
    if (firstInvalid) {
      const fields = {
        name: nameRef,
        email: emailRef,
        question: questionRef,
      };
      fields[firstInvalid].current?.focus();
      return;
    }

    const supabase = createSupabaseClient();
    if (!supabase) {
      setFormError(
        "Add the Supabase URL and anon key to .env.local, then restart the dev server.",
      );
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("questions").insert({
      name: values.name.trim(),
      email: values.email.trim(),
      question: values.question.trim(),
    });

    setSaving(false);

    if (error) {
      setFormError("The question could not be saved. Please try again.");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div
        className="rounded-3xl border border-ember-500/40 bg-forest-800 p-6 sm:p-8"
        role="status"
      >
        <h2
          ref={confirmationRef}
          tabIndex={-1}
          className="text-2xl font-semibold tracking-tight text-sand-50 outline-none"
        >
          Question received
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-sand-300">
          Thanks for writing. Your question has been received.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(emptyValues);
            setErrors({});
            setFormError(null);
            setSent(false);
          }}
          className="mt-6 rounded-full bg-ember-500 px-5 py-2.5 text-sm font-semibold text-forest-950 transition-colors hover:bg-ember-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-300"
        >
          Ask another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-3xl border border-white/10 bg-forest-800 p-6 sm:p-8"
    >
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-sand-100" htmlFor="name">
            Name
          </label>
          <input
            ref={nameRef}
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={80}
            value={values.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            onChange={(event) => updateField("name", event.target.value)}
            className={`${fieldClassName} ${
              errors.name ? "border-red-400" : "border-white/10"
            }`}
            placeholder="Your name"
          />
          {errors.name ? (
            <p id="name-error" className="mt-2 text-sm text-red-300">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-sand-100" htmlFor="email">
            Email
          </label>
          <input
            ref={emailRef}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={120}
            value={values.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            onChange={(event) => updateField("email", event.target.value)}
            className={`${fieldClassName} ${
              errors.email ? "border-red-400" : "border-white/10"
            }`}
            placeholder="you@email.com"
          />
          {errors.email ? (
            <p id="email-error" className="mt-2 text-sm text-red-300">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label
            className="block text-sm font-medium text-sand-100"
            htmlFor="question"
          >
            Question
          </label>
          <textarea
            ref={questionRef}
            id="question"
            name="question"
            rows={5}
            maxLength={1000}
            value={values.question}
            aria-invalid={Boolean(errors.question)}
            aria-describedby={errors.question ? "question-error" : undefined}
            onChange={(event) => updateField("question", event.target.value)}
            className={`${fieldClassName} resize-y ${
              errors.question ? "border-red-400" : "border-white/10"
            }`}
            placeholder="Where should I start?"
          />
          {errors.question ? (
            <p id="question-error" className="mt-2 text-sm text-red-300">
              {errors.question}
            </p>
          ) : null}
        </div>
      </div>

      {formError ? (
        <p className="mt-5 text-sm text-red-300" role="alert">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={saving}
        className="mt-6 inline-flex rounded-full bg-ember-500 px-5 py-2.5 text-sm font-semibold text-forest-950 transition-colors hover:bg-ember-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Sending..." : "Send question"}
      </button>
    </form>
  );
}
