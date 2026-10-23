import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo";

export const runtime = "edge";
export const alt = siteConfig.title;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "#030303",
          backgroundImage:
            "radial-gradient(ellipse 70% 55% at 12% 8%, rgba(232,93,4,0.32), transparent 55%), radial-gradient(ellipse 55% 45% at 92% -5%, rgba(155,34,38,0.24), transparent 50%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
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
              maxWidth: 900,
              color: "#b3aa9c",
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
            borderTop: "1px solid rgba(255,255,255,0.12)",
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
    ),
    size,
  );
}
