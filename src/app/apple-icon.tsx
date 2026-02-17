import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 100,
          background: "linear-gradient(135deg, #FFF5F5, #F2D1D1, #D4908F)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#3D2C2C",
          fontFamily: "Georgia, serif",
          fontWeight: 300,
          fontStyle: "italic",
        }}
      >
        SL
      </div>
    ),
    { ...size }
  );
}
