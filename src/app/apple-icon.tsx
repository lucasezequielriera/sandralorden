import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const fontData = await readFile(join(process.cwd(), "src/app/DancingScript.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 36,
          background: "#F5E6DC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 96,
            color: "#3D2C2C",
            fontFamily: "Dancing Script",
            marginTop: -4,
          }}
        >
          SL
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Dancing Script",
          data: fontData,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
