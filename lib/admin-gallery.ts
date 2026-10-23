export type GalleryUploadValues = {
  title: string;
  place: string;
  description: string;
};

export type GalleryUploadField = keyof GalleryUploadValues;
export type GalleryUploadFieldErrors = Partial<
  Record<GalleryUploadField | "file" | "cover", string>
>;

const limits = {
  title: 120,
  place: 80,
  description: 300,
  maxFiles: 20,
} as const;

const allowedTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const maxBytes = 10 * 1024 * 1024;

export function sanitizeFileName(name: string) {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return base || "trip-photo";
}

export function fileExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName) && fromName.length <= 5) {
    return fromName === "jpg" ? "jpg" : fromName;
  }

  switch (file.type) {
    case "image/jpeg":
    case "image/jpg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "jpg";
  }
}

function isAllowedImage(file: File) {
  const extensionOk = /\.(jpe?g|png|webp|gif)$/i.test(file.name);
  const typeOk = !file.type || allowedTypes.has(file.type);
  return (typeOk || extensionOk) && file.size <= maxBytes;
}

export function validateGalleryAlbumDetails(values: GalleryUploadValues): {
  fieldErrors: GalleryUploadFieldErrors;
  title: string;
  place: string;
  description: string;
} {
  const fieldErrors: GalleryUploadFieldErrors = {};
  const title = values.title.trim();
  const place = values.place.trim();
  const description = values.description.trim();

  if (!title) {
    fieldErrors.title = "Enter an album title.";
  } else if (title.length > limits.title) {
    fieldErrors.title = `Title should be ${limits.title} characters or fewer.`;
  }

  if (place.length > limits.place) {
    fieldErrors.place = `Place should be ${limits.place} characters or fewer.`;
  }

  if (description.length > limits.description) {
    fieldErrors.description = `Description should be ${limits.description} characters or fewer.`;
  }

  return { fieldErrors, title, place, description };
}

export function validateGalleryAlbumUpload(
  files: File[],
  values: GalleryUploadValues,
  coverIndex: number,
  options?: { requireFiles?: boolean },
): {
  fieldErrors: GalleryUploadFieldErrors;
  title: string;
  place: string;
  description: string;
  coverIndex: number;
} {
  const requireFiles = options?.requireFiles ?? true;
  const details = validateGalleryAlbumDetails(values);
  const fieldErrors: GalleryUploadFieldErrors = { ...details.fieldErrors };

  if (files.length === 0) {
    if (requireFiles) {
      fieldErrors.file = "Choose at least one photo for the album.";
    }
  } else if (files.length > limits.maxFiles) {
    fieldErrors.file = `Upload up to ${limits.maxFiles} photos per album.`;
  } else {
    const invalid = files.find((file) => !isAllowedImage(file));
    if (invalid) {
      fieldErrors.file =
        "Each photo must be JPG, PNG, WebP, or GIF and under 10 MB.";
    }
  }

  if (files.length > 0 && (coverIndex < 0 || coverIndex >= files.length)) {
    fieldErrors.cover = "Choose a cover photo for the album.";
  }

  return {
    fieldErrors,
    title: details.title,
    place: details.place,
    description: details.description,
    coverIndex: Math.max(0, coverIndex),
  };
}

export function storagePolicyHint(message: string) {
  const lower = message.toLowerCase();

  if (lower.includes("bucket not found")) {
    return "The trip-photos bucket is missing in Supabase Storage.";
  }

  if (
    lower.includes("row-level security") ||
    lower.includes("security policy") ||
    lower.includes("not authorized") ||
    lower.includes("unauthorized")
  ) {
    return "Blocked by Storage policy. Run supabase/trip-photos.sql in the SQL Editor.";
  }

  if (lower.includes("gallery_albums") || lower.includes("gallery_photos")) {
    return "Album tables are missing. Run supabase/trip-photos.sql in the SQL Editor.";
  }

  return message;
}
