import Image from "next/image";
import { grainUrl } from "@/lib/grain";
/** One square sheet: grain face + two visible edges, in preserve-3d space. */
export function Sheet({
  tone = "birch",
  seed = 3,
  size,
  thickness,
  cross,
  className = "",
  style,
  edgeClass = "ply-edge",
  attrs,
}) {
  return (
    <div
      className={`absolute left-0 top-0 ${className}`}
      style={{ width: size, height: size, transformStyle: "preserve-3d", ...style }}
      {...attrs}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: grainUrl(tone, seed),
          backgroundSize: `${size}px ${size}px`,
          transform: cross ? "rotate(90deg)" : undefined,
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
        }}
      />
      {/* front edge (bottom of the face, dropping down) */}
      <div
        className={`absolute left-0 ${edgeClass}`}
        style={{
          top: size,
          width: size,
          height: thickness,
          transformOrigin: "top",
          transform: "rotateX(-90deg)",
          ["--ply"]: `${Math.max(1, thickness / 7)}px`,
        }}
      />
      {/* right edge */}
      <div
        className={`absolute top-0 ${edgeClass}-v`}
        style={{
          left: size,
          width: thickness,
          height: size,
          transformOrigin: "left",
          transform: "rotateY(90deg)",
          filter: "brightness(0.82)",
          ["--ply"]: `${Math.max(1, thickness / 7)}px`,
        }}
      />
    </div>
  );
}
/** Isometric stack of sheets, used as hero/product render. */
export function PlyStack({
  tone = "birch",
  count = 5,
  size = 360,
  thickness = 18,
  gap = 0,
  className = "",
  sheetClassName = "",
}) {
  return (
    <div className={`relative ${className}`} style={{ width: size * 1.45, height: size * 1.25 }} aria-hidden="true">
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2 - count * (thickness + gap) * 0.25,
          transformStyle: "preserve-3d",
          transform: "rotateX(58deg) rotateZ(-40deg)",
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <Sheet
            key={i}
            tone={tone}
            seed={i * 7 + 3}
            size={size}
            thickness={thickness}
            style={{ transform: `translateZ(${(count - 1 - i) * -(thickness + gap)}px)` }}
            className={sheetClassName}
          />
        ))}
        {/* soft floor shadow */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translateZ(${-(count * (thickness + gap)) - 2}px) translate(14px, 14px)`,
            background: "rgba(17,17,17,0.16)",
            filter: "blur(18px)",
          }}
        />
      </div>
    </div>
  );
}
/** Product visual: official photo when available, otherwise a labelled material render. */
export function ProductVisual({
  imageUrl,
  alt,
  tone,
  label = true,
  priority = false,
  sizes = "(min-width: 1024px) 40vw, 100vw",
  className = "",
}) {
  if (imageUrl) {
    return (
      <div className={`relative overflow-hidden bg-ice ${className}`}>
        <Image src={imageUrl} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }
  return (
    <div
      className={`relative overflow-hidden bg-ice ${className}`}
      role="img"
      aria-label={`${alt} — illustrative material render`}
    >
      {label && <span className="placeholder-tag">Illustrative render</span>}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="origin-center scale-[0.62] sm:scale-[0.7] lg:scale-[0.78]">
          <PlyStack tone={tone} count={4} size={300} thickness={16} />
        </div>
      </div>
    </div>
  );
}
