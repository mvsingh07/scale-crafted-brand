import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MV Singh Tech Studio — Digitalizing Businesses for the AI Era";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "90px", background: "#0A0A0A", color: "#F5F1E8",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 20, letterSpacing: 6, textTransform: "uppercase", color: "#C9A55A" }}>
          Punjab → India → Beyond
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.15, marginTop: 26 }}>
          <span>MV Singh&nbsp;</span>
          <span style={{ color: "#E0C27A" }}>Tech Studio</span>
        </div>
        <div style={{ display: "flex", fontSize: 28, marginTop: 30, color: "#B9B9B9", maxWidth: 860 }}>
          Digitalizing businesses for the AI era — websites, business systems, and automation.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 60 }}>
          <div style={{ width: 46, height: 2, background: "#C9A55A" }} />
          <div style={{ display: "flex", fontSize: 20, color: "#8B93A1" }}>studio.mvsingh.in</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
