import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";
export const runtime = "nodejs";
export const alt = "XSpace Plywood — Premium Quality. Built to Last. Since 1959.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function OG() {
  const dir = path.join(process.cwd(), "node_modules/@fontsource/poppins/files");
  const [medium, regular] = await Promise.all([
    fs.readFile(path.join(dir, "poppins-latin-500-normal.woff")),
    fs.readFile(path.join(dir, "poppins-latin-400-normal.woff")),
  ]);
  const plies = Array.from({ length: 14 });
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#FFFFFF", fontFamily: "Poppins" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72 }}>
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 8, fontWeight: 500, color: "#111" }}>
          XSPACE PLYWOOD
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, lineHeight: 1.02, letterSpacing: -2, fontWeight: 500, color: "#111" }}>
            Premium Quality.
          </div>
          <div style={{ fontSize: 76, lineHeight: 1.02, letterSpacing: -2, fontWeight: 500, color: "#111" }}>
            Built to Last.
          </div>
          <div style={{ marginTop: 28, fontSize: 24, color: "#694530" }}>
            Since 1959 · Powered by C Nanjappa Timbers
          </div>
        </div>
      </div>
      <div
        style={{
          width: 380,
          display: "flex",
          flexDirection: "column",
          background: "#EFF7FC",
          justifyContent: "center",
          padding: 48,
        }}
      >
        {plies.map((_, i) => (
          <div key={i} style={{ height: 18, background: i % 2 ? "#B98D5C" : "#E6CFA8", width: "100%" }} />
        ))}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Poppins", data: medium, weight: 500 },
        { name: "Poppins", data: regular, weight: 400 },
      ],
    },
  );
}
