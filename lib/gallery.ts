import { createSupabaseClient } from "@/lib/supabase";

export const TRIP_PHOTOS_BUCKET = "trip-photos";

export type GalleryPhoto = {
  id: string;
  src: string;
  alt: string;
  place: string;
  caption: string;
};

type GalleryPhotoRow = {
  storage_path: string;
  place: string;
  caption: string;
};

export type GalleryLoadResult =
  | { status: "ready"; photos: GalleryPhoto[] }
  | { status: "missing" }
  | { status: "error" };

const imageExtensions = /\.(jpe?g|png|webp|gif)$/i;

function publicPhotoUrl(storagePath: string, supabaseUrl: string) {
  const base = supabaseUrl.replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${TRIP_PHOTOS_BUCKET}/${storagePath
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

export async function loadGalleryPhotos(): Promise<GalleryLoadResult> {
  const supabase = createSupabaseClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabase || !supabaseUrl) {
    return { status: "missing" };
  }

  const { data: files, error: listError } = await supabase.storage
    .from(TRIP_PHOTOS_BUCKET)
    .list("", {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (listError) {
    return { status: "error" };
  }

  const imageFiles = (files ?? []).filter(
    (file) =>
      Boolean(file.name) &&
      !file.name.endsWith("/") &&
      imageExtensions.test(file.name) &&
      file.id,
  );

  if (imageFiles.length === 0) {
    return { status: "ready", photos: [] };
  }

  const { data: rows } = await supabase
    .from("gallery_photos")
    .select("storage_path, place, caption");

  const metaByPath = new Map(
    ((rows as GalleryPhotoRow[] | null) ?? []).map((row) => [
      row.storage_path,
      row,
    ]),
  );

  const photos: GalleryPhoto[] = imageFiles.map((file) => {
    const meta = metaByPath.get(file.name);
    const place = meta?.place?.trim() ?? "";
    const caption = meta?.caption?.trim() ?? "";
    const label = place || caption || "Trip photo";

    return {
      id: file.id ?? file.name,
      src: publicPhotoUrl(file.name, supabaseUrl),
      alt: label,
      place,
      caption,
    };
  });

  return { status: "ready", photos };
}
