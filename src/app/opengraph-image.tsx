import { ImageResponse } from "next/og";

export const alt = "FundForFounders — Launching soon";
export const size = { width: 1200, height: 630 };
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
          background: "#f3f3f2",
          padding: "72px 80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "-0.04em",
            color: "#1b1916",
          }}
        >
          Fund
          <span style={{ color: "#0c6b52" }}>For</span>
          Founders
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 56,
              fontWeight: 500,
              letterSpacing: "-0.035em",
              lineHeight: 1.1,
              color: "#1b1916",
              maxWidth: 900,
            }}
          >
            Finding founders before the world sees their potential.
          </div>
          <div style={{ fontSize: 22, color: "#928c86", letterSpacing: "-0.01em" }}>
            Launching soon
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
