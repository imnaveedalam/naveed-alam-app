export type GalleryUploadValues = {
  place: string;
  caption: string;
};

export type GalleryUploadField = keyof GalleryUploadValues;
export type GalleryUploadFieldErrors = Partial<
  Record<GalleryUploadField | "file", string>
>;

const limits = {
  place: 80,
  caption: 200,
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

export function validateGalleryUpload(
  file: File | null,
  values: GalleryUploadValues,
): {
  fieldErrors: GalleryUploadFieldErrors;
  place: string;
  caption: string;
} {
  const fieldErrors: GalleryUploadFieldErrors = {};
  const place = values.place.trim();
  const caption = values.caption.trim();

  if (!file) {
    fieldErrors.file = "Choose a photo to upload.";
  } else {
    if (!allowedTypes.has(file.type)) {
      fieldErrors.file = "Use a JPG, PNG, WebP, or GIF image.";
    } else if (file.size > maxBytes) {
      fieldErrors.file = "Keep the photo under 10 MB.";
    }
  }

  if (place.length > limits.place) {
    fieldErrors.place = `Place should be ${limits.place} characters or fewer.`;
  }

  if (caption.length > limits.caption) {
    fieldErrors.caption = `Caption should be ${limits.caption} characters or fewer.`;
  }

  return { fieldErrors, place, caption };
}
