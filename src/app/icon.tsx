import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default async function Icon() {
  const fontData = await readFile(join(process.cwd(), "src/app/DancingScript.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          background: "#F5E6DC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 26,
            color: "#3D2C2C",
            fontFamily: "Dancing Script",
            marginTop: -2,
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
