import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#030303",
          border: "10px solid #e85d04",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 88,
              height: 8,
              background: "#f5f2eb",
              borderRadius: 8,
            }}
          />
          <div style={{ display: "flex", gap: 36 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 34,
                border: "6px solid #e85d04",
              }}
            />
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 34,
                border: "6px solid #e85d04",
              }}
            />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
