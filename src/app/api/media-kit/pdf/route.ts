import { NextRequest, NextResponse } from "next/server";
import { getMediaKitSettings } from "@/lib/media-kit-settings";
import { generateMediaKitPdf } from "@/lib/media-kit-pdf";

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") === "en" ? "en" : "es";

  try {
    const settings = await getMediaKitSettings();
    const pdf = await generateMediaKitPdf(settings, locale);

    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="sandra-lorden-media-kit-${locale}.pdf"`,
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch (error) {
    console.error("Media kit PDF error:", error);
    return NextResponse.json({ error: "Error al generar el PDF" }, { status: 500 });
  }
}
