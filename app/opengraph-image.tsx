import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo";

export const alt = siteConfig.title;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const photoData = await readFile(
    join(process.cwd(), "public", "og-cover.jpg"),
  );
  const photoSrc = `data:image/jpeg;base64,${photoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#030303",
        }}
      >
        <img
          src={photoSrc}
          alt=""
          width={1200}
          height={630}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.42,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(115deg, rgba(3,3,3,0.92) 18%, rgba(3,3,3,0.55) 55%, rgba(3,3,3,0.78) 100%), radial-gradient(ellipse 70% 55% at 12% 8%, rgba(232,93,4,0.28), transparent 55%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: 64,
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#ff8c2a",
              fontSize: 28,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
            }}
          >
            Motorcycle adventure
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div
              style={{
                display: "flex",
                color: "#f5f2eb",
                fontSize: 96,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                lineHeight: 0.92,
              }}
            >
              Naveed Alam
            </div>
            <div
              style={{
                display: "flex",
                maxWidth: 860,
                color: "#e8e2d6",
                fontSize: 34,
                lineHeight: 1.35,
              }}
            >
              Exploring Pakistan on two wheels — routes, distances, and road
              stories.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(255,255,255,0.16)",
              paddingTop: 28,
              color: "#ffb86c",
              fontSize: 24,
              letterSpacing: "0.08em",
            }}
          >
            <span>{siteConfig.handle}</span>
            <span
              style={{
                width: 180,
                height: 4,
                background:
                  "linear-gradient(90deg, #9b2226, #e85d04, #ff8c2a)",
              }}
            />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
