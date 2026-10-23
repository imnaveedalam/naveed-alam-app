import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Camera, Images } from "lucide-react";
import { GalleryPhotoGrid } from "@/components/gallery-photo-grid";
import { loadGalleryAlbum } from "@/lib/gallery";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

type PageProps = {
  params: { id: string };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const result = await loadGalleryAlbum(params.id);

  if (result.status !== "ready") {
    return { title: "Album" };
  }

  return {
    title: result.album.title,
    description:
      result.album.description ||
      `Photos from ${result.album.title}${
        result.album.place ? ` · ${result.album.place}` : ""
      }.`,
  };
}

export default async function GalleryAlbumPage({ params }: PageProps) {
  const result = await loadGalleryAlbum(params.id);

  if (result.status === "not_found") {
    notFound();
  }

  if (result.status === "missing") {
    return (
      <div className="page-shell">
        <p className="panel px-6 py-5 text-sm text-sand-300">
          Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to
          .env.local.
        </p>
      </div>
    );
  }

  if (result.status === "error") {
    return (
      <div className="page-shell">
        <p role="alert" className="panel border-ember-500/50 px-6 py-5 text-sm text-sand-300">
          This album could not be loaded.
        </p>
        <Link href="/gallery" className="btn-ghost mt-6">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to gallery
        </Link>
      </div>
    );
  }

  const { album } = result;

  return (
    <div className="page-shell">
      <Link href="/gallery" className="text-link inline-flex items-center gap-2 text-sm">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All albums
      </Link>

      <p className="kicker mt-8">
        <Camera className="h-4 w-4" aria-hidden="true" />
        Album
      </p>
      <h1 className="page-title">{album.title}</h1>
      {album.place ? (
        <p className="mt-3 font-display text-sm tracking-[0.2em] text-ember-400">
          {album.place}
        </p>
      ) : null}
      {album.description ? (
        <p className="lede">{album.description}</p>
      ) : (
        <p className="mt-4 inline-flex items-center gap-2 text-sm text-sand-300">
          <Images className="h-4 w-4 text-ember-400" aria-hidden="true" />
          {album.photoCount} {album.photoCount === 1 ? "photo" : "photos"}
        </p>
      )}

      {album.photos.length === 0 ? (
        <p className="panel mt-10 px-6 py-5 text-sm text-sand-300">
          This album has no photos yet.
        </p>
      ) : (
        <GalleryPhotoGrid
          photos={album.photos.map((photo) => ({
            id: photo.id,
            src: photo.src,
            alt: photo.alt,
            title: photo.caption || album.title,
          }))}
          fallbackTitle={album.title}
        />
      )}
    </div>
  );
}
