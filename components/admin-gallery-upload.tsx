"use client";

import { FormEvent, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  fileExtension,
  sanitizeFileName,
  validateGalleryUpload,
  type GalleryUploadFieldErrors,
  type GalleryUploadValues,
} from "@/lib/admin-gallery";
import { TRIP_PHOTOS_BUCKET } from "@/lib/gallery";

const emptyValues: GalleryUploadValues = {
  place: "",
  caption: "",
};

export function AdminGalleryUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<GalleryUploadValues>(emptyValues);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<GalleryUploadFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [formNotice, setFormNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function clearPreview() {
    setPreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return null;
    });
  }

  function onFileChange(next: File | null) {
    clearPreview();
    setFile(next);
    setSaved(false);
    setFormError(null);

    if (next) {
      setPreviewUrl(URL.createObjectURL(next));
    }

    if (errors.file) {
      setErrors((current) => {
        const nextErrors = { ...current };
        delete nextErrors.file;
        return nextErrors;
      });
    }
  }

  function updateField(field: keyof GalleryUploadValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setSaved(false);

    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFormNotice(null);
    setSaved(false);

    const { fieldErrors, place, caption } = validateGalleryUpload(file, values);
    setErrors(fieldErrors);

    if (!file || Object.keys(fieldErrors).length > 0) {
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData.user) {
        setFormError("Sign in before uploading photos.");
        setSaving(false);
        return;
      }

      const path = `${Date.now()}-${sanitizeFileName(file.name)}.${fileExtension(file)}`;

      const { error: uploadError } = await supabase.storage
        .from(TRIP_PHOTOS_BUCKET)
        .upload(path, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        setFormError(
          uploadError.message.includes("Bucket not found")
            ? "The trip-photos bucket is missing. Run the Storage section in supabase/schema.sql."
            : "The photo could not be uploaded. Please try again.",
        );
        setSaving(false);
        return;
      }

      if (place || caption) {
        const { error: insertError } = await supabase
          .from("gallery_photos")
          .insert({
            storage_path: path,
            place,
            caption,
          });

        if (insertError) {
          setFormNotice(
            "Photo uploaded to Storage. Place and caption need the gallery_photos table from supabase/schema.sql.",
          );
        }
      }

      setValues(emptyValues);
      setFile(null);
      clearPreview();
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setErrors({});
      setSaved(true);
      setSaving(false);
    } catch {
      setFormError("The photo could not be uploaded. Please try again.");
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
      <h2 className="text-lg font-semibold text-sand-50">Gallery photo</h2>
      <p className="mt-2 text-sm leading-relaxed text-sand-300">
        Upload a trip photo to the public trip-photos bucket. Place and caption
        are optional.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <label
            className="block text-sm font-medium text-sand-100"
            htmlFor="gallery-file"
          >
            Photo
          </label>
          <input
            ref={inputRef}
            id="gallery-file"
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            aria-invalid={Boolean(errors.file)}
            aria-describedby={errors.file ? "gallery-file-error" : undefined}
            onChange={(event) =>
              onFileChange(event.target.files?.[0] ?? null)
            }
            className="field cursor-pointer file:mr-4 file:rounded-full file:border-0 file:bg-ember-500/20 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ember-300"
          />
          {errors.file ? (
            <p id="gallery-file-error" className="mt-2 text-sm text-red-300">
              {errors.file}
            </p>
          ) : null}
        </div>

        {previewUrl ? (
          <div className="overflow-hidden rounded-xl border border-white/10">
            <img
              src={previewUrl}
              alt="Selected gallery upload preview"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        ) : null}

        <div>
          <label
            className="block text-sm font-medium text-sand-100"
            htmlFor="gallery-place"
          >
            Place
            <span className="ml-2 font-normal text-sand-400">Optional</span>
          </label>
          <input
            id="gallery-place"
            name="place"
            type="text"
            maxLength={80}
            value={values.place}
            aria-invalid={Boolean(errors.place)}
            aria-describedby={errors.place ? "gallery-place-error" : undefined}
            onChange={(event) => updateField("place", event.target.value)}
            className={`field ${errors.place ? "border-red-400" : "border-white/10"}`}
            placeholder="Balochistan"
          />
          {errors.place ? (
            <p id="gallery-place-error" className="mt-2 text-sm text-red-300">
              {errors.place}
            </p>
          ) : null}
        </div>

        <div>
          <label
            className="block text-sm font-medium text-sand-100"
            htmlFor="gallery-caption"
          >
            Caption
            <span className="ml-2 font-normal text-sand-400">Optional</span>
          </label>
          <input
            id="gallery-caption"
            name="caption"
            type="text"
            maxLength={200}
            value={values.caption}
            aria-invalid={Boolean(errors.caption)}
            aria-describedby={
              errors.caption ? "gallery-caption-error" : undefined
            }
            onChange={(event) => updateField("caption", event.target.value)}
            className={`field ${
              errors.caption ? "border-red-400" : "border-white/10"
            }`}
            placeholder="Makran coast at dusk"
          />
          {errors.caption ? (
            <p id="gallery-caption-error" className="mt-2 text-sm text-red-300">
              {errors.caption}
            </p>
          ) : null}
        </div>
      </div>

      {formError ? (
        <p className="mt-5 text-sm text-red-300" role="alert">
          {formError}
        </p>
      ) : null}

      {saved ? (
        <p className="mt-5 text-sm font-medium text-ember-300" role="status">
          Photo added to the gallery.
        </p>
      ) : null}

      {formNotice ? (
        <p className="mt-3 text-sm text-sand-300" role="status">
          {formNotice}
        </p>
      ) : null}

      <button type="submit" disabled={saving} className="btn-ember mt-6">
        {saving ? "Uploading..." : "Upload photo"}
      </button>
    </form>
  );
}
