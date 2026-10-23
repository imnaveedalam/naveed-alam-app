import { createSupabaseClient } from "@/lib/supabase";

export const TRIP_PHOTOS_BUCKET = "trip-photos";

export type GalleryPhoto = {
  id: string;
  path: string;
  src: string;
  alt: string;
  caption: string;
};

export type GalleryAlbum = {
  id: string;
  title: string;
  place: string;
  description: string;
  coverPath: string;
  coverSrc: string;
  photoCount: number;
  createdAt: string;
};

export type GalleryAlbumDetail = GalleryAlbum & {
  photos: GalleryPhoto[];
};

type AlbumRow = {
  id: string;
  title: string;
  place: string;
  description: string;
  cover_path: string;
  created_at: string;
};

type PhotoRow = {
  id: string;
  album_id: string;
  storage_path: string;
  caption: string;
  sort_order: number;
};

export type GalleryAlbumsResult =
  | { status: "ready"; albums: GalleryAlbum[] }
  | { status: "missing" }
  | { status: "error" };

export type GalleryAlbumResult =
  | { status: "ready"; album: GalleryAlbumDetail }
  | { status: "missing" }
  | { status: "error" }
  | { status: "not_found" };

function publicUrl(supabaseUrl: string, storagePath: string) {
  const base = supabaseUrl.replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${TRIP_PHOTOS_BUCKET}/${storagePath
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

function toAlbum(
  row: AlbumRow,
  supabaseUrl: string,
  photoCount: number,
): GalleryAlbum {
  return {
    id: row.id,
    title: row.title,
    place: row.place?.trim() ?? "",
    description: row.description?.trim() ?? "",
    coverPath: row.cover_path,
    coverSrc: publicUrl(supabaseUrl, row.cover_path),
    photoCount,
    createdAt: row.created_at,
  };
}

export async function loadGalleryAlbums(): Promise<GalleryAlbumsResult> {
  const supabase = createSupabaseClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabase || !supabaseUrl) {
    return { status: "missing" };
  }

  const { data: albums, error } = await supabase
    .from("gallery_albums")
    .select("id, title, place, description, cover_path, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return { status: "error" };
  }

  const rows = (albums as AlbumRow[] | null) ?? [];

  if (rows.length === 0) {
    return { status: "ready", albums: [] };
  }

  const { data: photos } = await supabase
    .from("gallery_photos")
    .select("album_id");

  const counts = new Map<string, number>();
  for (const photo of (photos as { album_id: string }[] | null) ?? []) {
    counts.set(photo.album_id, (counts.get(photo.album_id) ?? 0) + 1);
  }

  return {
    status: "ready",
    albums: rows.map((row) =>
      toAlbum(row, supabaseUrl, counts.get(row.id) ?? 0),
    ),
  };
}

export async function loadGalleryAlbum(
  albumId: string,
): Promise<GalleryAlbumResult> {
  const supabase = createSupabaseClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabase || !supabaseUrl) {
    return { status: "missing" };
  }

  const { data: album, error: albumError } = await supabase
    .from("gallery_albums")
    .select("id, title, place, description, cover_path, created_at")
    .eq("id", albumId)
    .maybeSingle();

  if (albumError) {
    return { status: "error" };
  }

  if (!album) {
    return { status: "not_found" };
  }

  const { data: photos, error: photosError } = await supabase
    .from("gallery_photos")
    .select("id, album_id, storage_path, caption, sort_order")
    .eq("album_id", albumId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (photosError) {
    return { status: "error" };
  }

  const photoRows = (photos as PhotoRow[] | null) ?? [];
  const albumRow = album as AlbumRow;

  return {
    status: "ready",
    album: {
      ...toAlbum(albumRow, supabaseUrl, photoRows.length),
      photos: photoRows.map((photo) => {
        const caption = photo.caption?.trim() ?? "";
        return {
          id: photo.id,
          path: photo.storage_path,
          src: publicUrl(supabaseUrl, photo.storage_path),
          alt: caption || albumRow.title,
          caption,
        };
      }),
    },
  };
}
