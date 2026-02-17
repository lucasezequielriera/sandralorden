import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: "linear-gradient(135deg, #F2D1D1, #D4908F)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: 6,
          fontFamily: "Georgia, serif",
          fontWeight: 700,
          fontStyle: "italic",
        }}
      >
        S
      </div>
    ),
    { ...size }
  );
}
