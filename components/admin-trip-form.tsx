"use client";

import { FormEvent, useState } from "react";
import { createTrip } from "@/app/admin/actions";
import {
  validateTrip,
  type TripField,
  type TripFieldErrors,
  type TripFormValues,
} from "@/lib/admin-trip";

const emptyValues: TripFormValues = {
  title: "",
  route: "",
  distanceKm: "",
  description: "",
  youtubeUrl: "",
};

const fieldClassName = "field";

const fields: Array<{
  name: TripField;
  label: string;
  type: "text" | "textarea";
  maxLength: number;
  optional?: boolean;
  placeholder: string;
}> = [
  { name: "title", label: "Title", type: "text", maxLength: 120, placeholder: "Makran Coastal Highway" },
  { name: "route", label: "Route", type: "text", maxLength: 160, placeholder: "Karachi → Gwadar" },
  {
    name: "distanceKm",
    label: "Distance (km)",
    type: "text",
    maxLength: 10,
    placeholder: "750",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    maxLength: 2000,
    placeholder: "What the ride was like.",
  },
  {
    name: "youtubeUrl",
    label: "YouTube link",
    type: "text",
    maxLength: 300,
    optional: true,
    placeholder: "https://www.youtube.com/watch?v=",
  },
];

export function AdminTripForm() {
  const [values, setValues] = useState<TripFormValues>(emptyValues);
  const [errors, setErrors] = useState<TripFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateField(field: TripField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setSaved(false);

    if (Object.keys(errors).length > 0) {
      setErrors((current) => {
        if (!current[field]) {
          return current;
        }

        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSaved(false);

    const { fieldErrors } = validateTrip(values);
    setErrors(fieldErrors);

    if (Object.keys(fieldErrors).length > 0) {
      return;
    }

    setSaving(true);

    try {
      const result = await createTrip(values);

      if (!result.ok) {
        setErrors(result.fieldErrors);
        setFormError(result.formError);
        setSaving(false);
        return;
      }

      setValues(emptyValues);
      setErrors({});
      setSaved(true);
      setSaving(false);
    } catch {
      setFormError("The trip could not be saved. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="panel p-6 sm:p-8"
      aria-busy={saving}
    >
      <h2 className="text-lg font-semibold text-sand-50">New trip</h2>
      <p className="mt-2 text-sm leading-relaxed text-sand-300">
        Title, route, distance, and description are required.
      </p>

      <div className="mt-6 space-y-5">
        {fields.map((field) => {
          const error = errors[field.name];
          const errorId = `${field.name}-error`;
          const inputClassName = `${fieldClassName} ${
            error ? "border-red-400" : "border-white/10"
          }`;

          return (
            <div key={field.name}>
              <label
                className="block text-sm font-medium text-sand-100"
                htmlFor={field.name}
              >
                {field.label}
                {field.optional ? (
                  <span className="ml-2 font-normal text-sand-400">Optional</span>
                ) : null}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  rows={5}
                  maxLength={field.maxLength}
                  value={values[field.name]}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? errorId : undefined}
                  onChange={(event) => updateField(field.name, event.target.value)}
                  className={`${inputClassName} resize-y`}
                  placeholder={field.placeholder}
                />
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type="text"
                  inputMode={field.name === "distanceKm" ? "numeric" : undefined}
                  autoComplete="off"
                  maxLength={field.maxLength}
                  value={values[field.name]}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? errorId : undefined}
                  onChange={(event) => updateField(field.name, event.target.value)}
                  className={inputClassName}
                  placeholder={field.placeholder}
                />
              )}
              {error ? (
                <p id={errorId} className="mt-2 text-sm text-red-300">
                  {error}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      {formError ? (
        <p className="mt-5 text-sm text-red-300" role="alert">
          {formError}
        </p>
      ) : null}

      {saved ? (
        <p className="mt-5 text-sm font-medium text-ember-300" role="status">
          Trip saved.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={saving}
        className="btn-ember mt-6"
      >
        {saving ? "Saving..." : "Save trip"}
      </button>
    </form>
  );
}
