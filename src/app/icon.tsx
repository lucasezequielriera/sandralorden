import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const fontData = await readFile(join(process.cwd(), "src/app/DancingScript.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "#F5E6DC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 17,
            color: "#3D2C2C",
            fontFamily: "Dancing Script",
            marginTop: -1,
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
