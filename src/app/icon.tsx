import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Simple monogram mark — F on deep green */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c6b52",
          color: "#f3f3f2",
          fontSize: 18,
          fontWeight: 600,
          fontFamily: "system-ui, sans-serif",
          letterSpacing: "-0.04em",
        }}
      >
        F
      </div>
    ),
    { ...size },
  );
}
