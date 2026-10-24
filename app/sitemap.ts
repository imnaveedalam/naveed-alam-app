import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";
import { createSupabaseClient } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const paths = [
    "",
    "/about",
    "/trips",
    "/gallery",
    "/distance",
    "/ask-question",
  ] as const;

  const entries: MetadataRoute.Sitemap = paths.map((path) => ({
    url: `${siteConfig.url}${path || "/"}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const supabase = createSupabaseClient();
  if (supabase) {
    const { data: trips } = await supabase.from("trips").select("id");
    for (const trip of trips ?? []) {
      entries.push({
        url: `${siteConfig.url}/trips/${trip.id}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }

    const { data: albums } = await supabase.from("gallery_albums").select("id");
    for (const album of albums ?? []) {
      entries.push({
        url: `${siteConfig.url}/gallery/${album.id}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
