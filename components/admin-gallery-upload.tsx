"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Images, Pencil, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  fileExtension,
  sanitizeFileName,
  storagePolicyHint,
  validateGalleryAlbumDetails,
  validateGalleryAlbumUpload,
  type GalleryUploadFieldErrors,
  type GalleryUploadValues,
} from "@/lib/admin-gallery";
import {
  loadGalleryAlbum,
  loadGalleryAlbums,
  TRIP_PHOTOS_BUCKET,
  type GalleryAlbum,
  type GalleryPhoto,
} from "@/lib/gallery";

const emptyValues: GalleryUploadValues = {
  title: "",
  place: "",
  description: "",
};

type PreviewItem = {
  id: string;
  file: File;
  url: string;
};

function newAlbumId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function AdminGalleryUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<GalleryUploadValues>(emptyValues);
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [errors, setErrors] = useState<GalleryUploadFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [formNotice, setFormNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedTitle, setSavedTitle] = useState<string | null>(null);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [listError, setListError] = useState<string | null>(null);
  const [listLoading, setListLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [existingPhotos, setExistingPhotos] = useState<GalleryPhoto[]>([]);
  const [coverPath, setCoverPath] = useState<string | null>(null);
  const [removingPhotoId, setRemovingPhotoId] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  const isEditing = Boolean(editingId);

  function clearPreviews() {
    setPreviews((current) => {
      current.forEach((item) => URL.revokeObjectURL(item.url));
      return [];
    });
  }

  function resetForm() {
    setValues(emptyValues);
    clearPreviews();
    setCoverIndex(0);
    setCoverPath(null);
    setExistingPhotos([]);
    setEditingId(null);
    setErrors({});
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function refreshAlbums() {
    setListLoading(true);
    setListError(null);

    const result = await loadGalleryAlbums();

    if (result.status === "ready") {
      setAlbums(result.albums);
    } else if (result.status === "missing") {
      setListError("Supabase env is missing.");
      setAlbums([]);
    } else {
      setListError(
        "Could not load albums. Run supabase/trip-photos.sql if tables are missing.",
      );
      setAlbums([]);
    }

    setListLoading(false);
  }

  useEffect(() => {
    void refreshAlbums();

    return () => {
      clearPreviews();
    };
  }, []);

  function onFileChange(list: FileList | null) {
    clearPreviews();
    setSavedTitle(null);
    setFormError(null);

    const next = list ? Array.from(list) : [];
    setPreviews(
      next.map((file, index) => ({
        id: `${file.name}-${file.size}-${index}`,
        file,
        url: URL.createObjectURL(file),
      })),
    );

    if (!isEditing) {
      setCoverIndex(0);
    }

    if (errors.file || errors.cover) {
      setErrors((current) => {
        const nextErrors = { ...current };
        delete nextErrors.file;
        delete nextErrors.cover;
        return nextErrors;
      });
    }
  }

  function updateField(field: keyof GalleryUploadValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setSavedTitle(null);

    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  }

  async function startEdit(album: GalleryAlbum) {
    setFormError(null);
    setFormNotice(null);
    setSavedTitle(null);
    setEditLoading(true);
    clearPreviews();
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    const result = await loadGalleryAlbum(album.id);

    if (result.status !== "ready") {
      setFormError("Could not load this album for editing.");
      setEditLoading(false);
      return;
    }

    setEditingId(result.album.id);
    setValues({
      title: result.album.title,
      place: result.album.place,
      description: result.album.description,
    });
    setExistingPhotos(result.album.photos);
    setCoverPath(result.album.coverPath);
    setCoverIndex(0);
    setErrors({});
    setEditLoading(false);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFormNotice(null);
    setSavedTitle(null);

    if (isEditing && editingId) {
      await saveEdit(editingId);
      return;
    }

    const files = previews.map((item) => item.file);
    const validated = validateGalleryAlbumUpload(files, values, coverIndex);
    setErrors(validated.fieldErrors);

    if (Object.keys(validated.fieldErrors).length > 0) {
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData.user) {
        setFormError("Sign in before uploading albums.");
        setSaving(false);
        return;
      }

      const albumId = newAlbumId();
      const uploadedPaths: string[] = [];
      const failed: string[] = [];

      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        const path = `${albumId}/${Date.now()}-${index}-${sanitizeFileName(file.name)}.${fileExtension(file)}`;

        const { error: uploadError } = await supabase.storage
          .from(TRIP_PHOTOS_BUCKET)
          .upload(path, file, {
            cacheControl: "3600",
            contentType: file.type || undefined,
            upsert: false,
          });

        if (uploadError) {
          failed.push(`${file.name}: ${storagePolicyHint(uploadError.message)}`);
          continue;
        }

        uploadedPaths.push(path);
      }

      if (uploadedPaths.length === 0) {
        setFormError(failed[0] ?? "No photos could be uploaded.");
        setSaving(false);
        return;
      }

      const nextCoverPath =
        uploadedPaths[
          Math.min(validated.coverIndex, uploadedPaths.length - 1)
        ];

      const { error: albumError } = await supabase.from("gallery_albums").insert({
        id: albumId,
        title: validated.title,
        place: validated.place,
        description: validated.description,
        cover_path: nextCoverPath,
      });

      if (albumError) {
        await supabase.storage.from(TRIP_PHOTOS_BUCKET).remove(uploadedPaths);
        setFormError(storagePolicyHint(albumError.message));
        setSaving(false);
        return;
      }

      const photoRows = uploadedPaths.map((path, index) => ({
        album_id: albumId,
        storage_path: path,
        caption: "",
        sort_order: index,
      }));

      const { error: photosError } = await supabase
        .from("gallery_photos")
        .insert(photoRows);

      if (photosError) {
        setFormNotice(
          `Album created, but some photo rows failed: ${storagePolicyHint(photosError.message)}`,
        );
      } else if (failed.length > 0) {
        setFormNotice(
          `${uploadedPaths.length} photos saved. ${failed.length} failed. ${failed[0]}`,
        );
      }

      resetForm();
      setSavedTitle(validated.title);
      setSaving(false);
      await refreshAlbums();
    } catch {
      setFormError("The album could not be uploaded. Please try again.");
      setSaving(false);
    }
  }

  async function saveEdit(albumId: string) {
    const details = validateGalleryAlbumDetails(values);
    const files = previews.map((item) => item.file);
    const fileCheck = validateGalleryAlbumUpload(files, values, 0, {
      requireFiles: false,
    });

    const fieldErrors: GalleryUploadFieldErrors = {
      ...details.fieldErrors,
    };

    if (fileCheck.fieldErrors.file) {
      fieldErrors.file = fileCheck.fieldErrors.file;
    }

    if (!coverPath && existingPhotos.length === 0 && files.length === 0) {
      fieldErrors.cover = "Album needs at least one photo and a cover.";
    } else if (coverPath) {
      const coverStillExists = existingPhotos.some(
        (photo) => photo.path === coverPath,
      );
      if (!coverStillExists && files.length === 0) {
        fieldErrors.cover = "Choose a cover from the remaining photos.";
      }
    }

    setErrors(fieldErrors);

    if (Object.keys(fieldErrors).length > 0) {
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData.user) {
        setFormError("Sign in before editing albums.");
        setSaving(false);
        return;
      }

      const uploadedPaths: string[] = [];
      const failed: string[] = [];

      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        const path = `${albumId}/${Date.now()}-${index}-${sanitizeFileName(file.name)}.${fileExtension(file)}`;

        const { error: uploadError } = await supabase.storage
          .from(TRIP_PHOTOS_BUCKET)
          .upload(path, file, {
            cacheControl: "3600",
            contentType: file.type || undefined,
            upsert: false,
          });

        if (uploadError) {
          failed.push(`${file.name}: ${storagePolicyHint(uploadError.message)}`);
          continue;
        }

        uploadedPaths.push(path);
      }

      if (uploadedPaths.length > 0) {
        const startOrder = existingPhotos.length;
        const photoRows = uploadedPaths.map((path, index) => ({
          album_id: albumId,
          storage_path: path,
          caption: "",
          sort_order: startOrder + index,
        }));

        const { error: photosError } = await supabase
          .from("gallery_photos")
          .insert(photoRows);

        if (photosError) {
          setFormError(storagePolicyHint(photosError.message));
          setSaving(false);
          return;
        }
      }

      const nextCover =
        coverPath &&
        (existingPhotos.some((photo) => photo.path === coverPath) ||
          uploadedPaths.includes(coverPath))
          ? coverPath
          : existingPhotos[0]?.path ?? uploadedPaths[0];

      if (!nextCover) {
        setFormError("Album needs a cover photo.");
        setSaving(false);
        return;
      }

      const { error: albumError } = await supabase
        .from("gallery_albums")
        .update({
          title: details.title,
          place: details.place,
          description: details.description,
          cover_path: nextCover,
        })
        .eq("id", albumId);

      if (albumError) {
        setFormError(storagePolicyHint(albumError.message));
        setSaving(false);
        return;
      }

      if (failed.length > 0) {
        setFormNotice(
          `Album updated. ${failed.length} new photo(s) failed. ${failed[0]}`,
        );
      }

      resetForm();
      setSavedTitle(details.title);
      setSaving(false);
      await refreshAlbums();
    } catch {
      setFormError("The album could not be updated. Please try again.");
      setSaving(false);
    }
  }

  async function onRemovePhoto(photo: GalleryPhoto) {
    if (!editingId) {
      return;
    }

    if (existingPhotos.length <= 1 && previews.length === 0) {
      setFormError("Keep at least one photo, or delete the whole album.");
      return;
    }

    const confirmed = window.confirm("Remove this photo from the album?");
    if (!confirmed) {
      return;
    }

    setRemovingPhotoId(photo.id);
    setFormError(null);

    try {
      const supabase = createClient();
      const { error: removeError } = await supabase.storage
        .from(TRIP_PHOTOS_BUCKET)
        .remove([photo.path]);

      if (removeError) {
        setFormError(storagePolicyHint(removeError.message));
        setRemovingPhotoId(null);
        return;
      }

      await supabase.from("gallery_photos").delete().eq("id", photo.id);

      const remaining = existingPhotos.filter((item) => item.id !== photo.id);
      setExistingPhotos(remaining);

      if (coverPath === photo.path) {
        setCoverPath(remaining[0]?.path ?? null);
      }

      setRemovingPhotoId(null);
      await refreshAlbums();
    } catch {
      setFormError("The photo could not be removed.");
      setRemovingPhotoId(null);
    }
  }

  async function onDeleteAlbum(album: GalleryAlbum) {
    const confirmed = window.confirm(
      `Delete album "${album.title}" and all of its photos?`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(album.id);
    setFormError(null);
    setFormNotice(null);

    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData.user) {
        setFormError("Sign in before deleting albums.");
        setDeletingId(null);
        return;
      }

      const { data: photoRows } = await supabase
        .from("gallery_photos")
        .select("storage_path")
        .eq("album_id", album.id);

      const paths = Array.from(
        new Set([
          album.coverPath,
          ...((photoRows as { storage_path: string }[] | null) ?? []).map(
            (row) => row.storage_path,
          ),
        ]),
      );

      if (paths.length > 0) {
        const { error: removeError } = await supabase.storage
          .from(TRIP_PHOTOS_BUCKET)
          .remove(paths);

        if (removeError) {
          setFormError(storagePolicyHint(removeError.message));
          setDeletingId(null);
          return;
        }
      }

      const { error: deleteError } = await supabase
        .from("gallery_albums")
        .delete()
        .eq("id", album.id);

      if (deleteError) {
        setFormError(storagePolicyHint(deleteError.message));
        setDeletingId(null);
        return;
      }

      if (editingId === album.id) {
        resetForm();
      }

      setAlbums((current) => current.filter((item) => item.id !== album.id));
      setDeletingId(null);
    } catch {
      setFormError("The album could not be deleted. Please try again.");
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={onSubmit}
        noValidate
        className="panel p-6 sm:p-8"
        aria-busy={saving || editLoading}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl tracking-[0.06em] text-sand-50">
              {isEditing ? "Edit album" : "New album"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-sand-300">
              {isEditing
                ? "Update title, cover, remove photos, or add more images to this album."
                : "Upload photos together as one album. Pick a cover image for the Gallery page."}
            </p>
          </div>
          {isEditing ? (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 border border-white/15 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-sand-200 transition hover:border-white/30 hover:text-sand-50"
              onClick={() => {
                resetForm();
                setFormError(null);
                setFormNotice(null);
                setSavedTitle(null);
              }}
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Cancel edit
            </button>
          ) : null}
        </div>

        {editLoading ? (
          <p className="mt-6 text-sm text-sand-300" role="status">
            Loading album...
          </p>
        ) : (
          <div className="mt-6 space-y-5">
            <div>
              <label
                className="block text-sm font-medium text-sand-100"
                htmlFor="album-title"
              >
                Album title
              </label>
              <input
                id="album-title"
                name="title"
                type="text"
                maxLength={120}
                value={values.title}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={
                  errors.title ? "album-title-error" : undefined
                }
                onChange={(event) => updateField("title", event.target.value)}
                className={`field ${
                  errors.title ? "border-red-400" : "border-white/10"
                }`}
                placeholder="Naltar Valley"
              />
              {errors.title ? (
                <p id="album-title-error" className="mt-2 text-sm text-red-300">
                  {errors.title}
                </p>
              ) : null}
            </div>

            <div>
              <label
                className="block text-sm font-medium text-sand-100"
                htmlFor="album-place"
              >
                Place
                <span className="ml-2 font-normal text-sand-400">Optional</span>
              </label>
              <input
                id="album-place"
                name="place"
                type="text"
                maxLength={80}
                value={values.place}
                aria-invalid={Boolean(errors.place)}
                onChange={(event) => updateField("place", event.target.value)}
                className={`field ${
                  errors.place ? "border-red-400" : "border-white/10"
                }`}
                placeholder="Gilgit Baltistan"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-sand-100"
                htmlFor="album-description"
              >
                Description
                <span className="ml-2 font-normal text-sand-400">Optional</span>
              </label>
              <textarea
                id="album-description"
                name="description"
                rows={3}
                maxLength={300}
                value={values.description}
                aria-invalid={Boolean(errors.description)}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                className={`field resize-y ${
                  errors.description ? "border-red-400" : "border-white/10"
                }`}
                placeholder="A short note about this ride."
              />
            </div>

            {isEditing && existingPhotos.length > 0 ? (
              <div>
                <p className="text-sm font-medium text-sand-100">
                  Current photos
                  <span className="ml-2 font-normal text-sand-400">
                    Tap cover · remove if needed
                  </span>
                </p>
                {errors.cover ? (
                  <p className="mt-2 text-sm text-red-300">{errors.cover}</p>
                ) : null}
                <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {existingPhotos.map((photo) => {
                    const selected = coverPath === photo.path;

                    return (
                      <li
                        key={photo.id}
                        className="overflow-hidden border border-white/10"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setCoverPath(photo.path);
                            setErrors((current) => {
                              const next = { ...current };
                              delete next.cover;
                              return next;
                            });
                          }}
                          className={`relative block w-full ${
                            selected ? "ring-2 ring-ember-400" : ""
                          }`}
                        >
                          <img
                            src={photo.src}
                            alt={photo.alt}
                            className="aspect-square w-full object-cover"
                          />
                          {selected ? (
                            <span className="absolute inset-x-0 bottom-0 bg-ember-500/95 px-2 py-1 text-center font-display text-[0.65rem] tracking-[0.16em] text-forest-950">
                              Cover
                            </span>
                          ) : null}
                        </button>
                        <button
                          type="button"
                          className="flex w-full items-center justify-center gap-1 border-t border-white/10 bg-forest-950/50 px-2 py-2 text-[0.65rem] font-semibold uppercase tracking-wide text-flame-400 hover:bg-flame-500/10 disabled:opacity-60"
                          disabled={removingPhotoId === photo.id}
                          onClick={() => void onRemovePhoto(photo)}
                        >
                          <Trash2 className="h-3 w-3" aria-hidden="true" />
                          {removingPhotoId === photo.id
                            ? "Removing..."
                            : "Remove"}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}

            <div>
              <label
                className="block text-sm font-medium text-sand-100"
                htmlFor="gallery-file"
              >
                {isEditing ? "Add more photos" : "Album photos"}
                {isEditing ? (
                  <span className="ml-2 font-normal text-sand-400">
                    Optional
                  </span>
                ) : null}
              </label>
              <input
                ref={inputRef}
                id="gallery-file"
                name="file"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif"
                aria-invalid={Boolean(errors.file)}
                aria-describedby={
                  errors.file ? "gallery-file-error" : undefined
                }
                onChange={(event) => onFileChange(event.target.files)}
                className="field cursor-pointer file:mr-4 file:border-0 file:bg-ember-500/20 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ember-300"
              />
              {errors.file ? (
                <p id="gallery-file-error" className="mt-2 text-sm text-red-300">
                  {errors.file}
                </p>
              ) : (
                <p className="mt-2 text-xs text-sand-400">
                  {isEditing
                    ? "Optional. New images are added to this album."
                    : "Select multiple images (max 20). Then tap one preview to set the cover."}
                </p>
              )}
            </div>

            {!isEditing && previews.length > 0 ? (
              <div>
                <p className="text-sm font-medium text-sand-100">
                  Cover photo
                  <span className="ml-2 font-normal text-sand-400">
                    Tap to choose
                  </span>
                </p>
                {errors.cover ? (
                  <p className="mt-2 text-sm text-red-300">{errors.cover}</p>
                ) : null}
                <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {previews.map((item, index) => {
                    const selected = index === coverIndex;

                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setCoverIndex(index);
                            setErrors((current) => {
                              const next = { ...current };
                              delete next.cover;
                              return next;
                            });
                          }}
                          className={`relative block w-full overflow-hidden border transition ${
                            selected
                              ? "border-ember-400 shadow-ember"
                              : "border-white/10 hover:border-white/25"
                          }`}
                        >
                          <img
                            src={item.url}
                            alt={item.file.name}
                            className="aspect-square w-full object-cover"
                          />
                          {selected ? (
                            <span className="absolute inset-x-0 bottom-0 bg-ember-500/95 px-2 py-1 text-center font-display text-[0.65rem] tracking-[0.16em] text-forest-950">
                              Cover
                            </span>
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}

            {isEditing && previews.length > 0 ? (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {previews.map((item) => (
                  <li
                    key={item.id}
                    className="overflow-hidden border border-dashed border-ember-400/40"
                  >
                    <img
                      src={item.url}
                      alt={item.file.name}
                      className="aspect-square w-full object-cover"
                    />
                    <p className="bg-ember-500/10 px-2 py-1 text-center text-[0.65rem] uppercase tracking-wide text-ember-300">
                      New
                    </p>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )}

        {formError ? (
          <p className="mt-5 text-sm text-red-300" role="alert">
            {formError}
          </p>
        ) : null}

        {savedTitle ? (
          <p className="mt-5 text-sm font-medium text-ember-300" role="status">
            Album “{savedTitle}” saved.
          </p>
        ) : null}

        {formNotice ? (
          <p className="mt-3 text-sm text-sand-300" role="status">
            {formNotice}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={saving || editLoading}
          className="btn-ember mt-6"
        >
          {saving
            ? isEditing
              ? "Saving..."
              : "Uploading album..."
            : isEditing
              ? "Save changes"
              : previews.length > 0
                ? `Upload album (${previews.length})`
                : "Upload album"}
        </button>
      </form>

      <section
        className="panel p-6 sm:p-8"
        aria-labelledby="manage-albums-heading"
      >
        <h2
          id="manage-albums-heading"
          className="font-display text-2xl tracking-[0.06em] text-sand-50"
        >
          Manage albums
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-sand-300">
          Edit album details and cover, or delete an album completely.
        </p>

        {listLoading ? (
          <p className="mt-6 text-sm text-sand-300" role="status">
            Loading albums...
          </p>
        ) : null}

        {listError ? (
          <p className="mt-6 text-sm text-red-300" role="alert">
            {listError}
          </p>
        ) : null}

        {!listLoading && !listError && albums.length === 0 ? (
          <p className="mt-6 text-sm text-sand-300">No albums yet.</p>
        ) : null}

        {albums.length > 0 ? (
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {albums.map((album) => (
              <li
                key={album.id}
                className="overflow-hidden border border-white/10 bg-forest-950/40"
              >
                <img
                  src={album.coverSrc}
                  alt={album.title}
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="border-t border-white/10 px-4 py-3">
                  <div className="min-w-0">
                    {album.place ? (
                      <p className="truncate font-display text-xs tracking-[0.16em] text-ember-400">
                        {album.place}
                      </p>
                    ) : null}
                    <p className="mt-1 truncate font-display text-lg tracking-[0.04em] text-sand-50">
                      {album.title}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-sand-400">
                      <Images className="h-3.5 w-3.5" aria-hidden="true" />
                      {album.photoCount}{" "}
                      {album.photoCount === 1 ? "photo" : "photos"}
                    </p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 border border-ember-400/40 bg-ember-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ember-300 transition hover:bg-ember-500/20 disabled:opacity-60"
                      disabled={editLoading || deletingId === album.id}
                      onClick={() => void startEdit(album)}
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      {editingId === album.id ? "Editing" : "Edit"}
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 border border-flame-400/40 bg-flame-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-flame-400 transition hover:bg-flame-500/20 disabled:opacity-60"
                      disabled={deletingId === album.id}
                      onClick={() => void onDeleteAlbum(album)}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      {deletingId === album.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  );
}
