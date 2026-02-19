import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Sandra Lorden — Entrenadora Personal y Nutricionista";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #FFFAF7 0%, #FFF5F5 30%, #F5EAE1 70%, #FFFAF7 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -40,
            right: 100,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(242, 209, 209, 0.3)",
            filter: "blur(10px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -40,
            left: 60,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "rgba(232, 213, 196, 0.25)",
            filter: "blur(10px)",
          }}
        />

        {/* Top tag */}
        <div
          style={{
            fontSize: 16,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#C9A88E",
            marginBottom: 24,
          }}
        >
          Entrenadora Personal & Nutricionista
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 80,
            fontStyle: "italic",
            fontWeight: 300,
            color: "#3D2C2C",
            lineHeight: 1.1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span>Sandra</span>
          <span style={{ color: "#D4908F" }}>Lorden</span>
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 22,
            color: "#8B7E7E",
            marginTop: 32,
            maxWidth: 650,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Planes personalizados de entrenamiento y nutrición.
          Tu mejor versión empieza hoy.
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: "flex",
            gap: 60,
            marginTop: 48,
            color: "#3D2C2C",
          }}
        >
          {[
            { n: "+1000", l: "Clientes" },
            { n: "10", l: "Años de experiencia" },
            { n: "+15", l: "Medios de prensa" },
          ].map((s) => (
            <div
              key={s.l}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 36, fontWeight: 300, fontStyle: "italic" }}>
                {s.n}
              </span>
              <span style={{ fontSize: 14, color: "#8B7E7E", marginTop: 4 }}>
                {s.l}
              </span>
            </div>
          ))}
        </div>

        {/* Domain at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            fontSize: 16,
            color: "#C4B8AD",
            letterSpacing: "0.15em",
          }}
        >
          www.sandralorden.com
        </div>
      </div>
    ),
    { ...size }
  );
}
