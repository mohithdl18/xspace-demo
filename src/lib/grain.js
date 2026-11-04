const TONES = {
  birch: { base: "#EBD7B4", line: "#B8915F", fx: 0.0035, fy: 0.11, strength: 0.55, label: "Light veneer" },
  oak: { base: "#D2AC7C", line: "#8E643C", fx: 0.004, fy: 0.13, strength: 0.6, label: "Oak-tone veneer" },
  walnut: { base: "#8A5D3D", line: "#3F2617", fx: 0.0045, fy: 0.12, strength: 0.65, label: "Walnut-tone veneer" },
  ember: { base: "#C79A70", line: "#7A4B2C", fx: 0.004, fy: 0.1, strength: 0.6, label: "Treated veneer" },
  pine: { base: "#E3C48E", line: "#A9783F", fx: 0.006, fy: 0.06, strength: 0.5, label: "Pine-tone face" },
  mdf: { base: "#B98E63", line: "#7D5A3A", fx: 0.6, fy: 0.6, strength: 0.25, label: "Fibre board" },
  laminate: { base: "#E9E4DC", line: "#9C8F7E", fx: 0.003, fy: 0.08, strength: 0.3, label: "Laminate surface" },
  pvc: { base: "#F2F4F5", line: "#B9C3C9", fx: 0.5, fy: 0.5, strength: 0.12, label: "PVC surface" },
  particle: { base: "#C9A57A", line: "#6F4F31", fx: 0.25, fy: 0.25, strength: 0.45, label: "Particle surface" },
};
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const cache = new Map();
export function grainUrl(tone = "birch", seed = 3) {
  const k = `${tone}-${seed}`;
  if (cache.has(k)) return cache.get(k);
  const t = TONES[tone in TONES ? tone : "birch"];
  const [r, g, b] = hex(t.line);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='640'><filter id='f' x='0' y='0'><feTurbulence type='fractalNoise' baseFrequency='${t.fx} ${t.fy}' numOctaves='4' seed='${seed}' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${r.toFixed(3)} 0 0 0 0 ${g.toFixed(3)} 0 0 0 0 ${b.toFixed(3)} ${(2.4 * t.strength).toFixed(2)} 0 0 0 ${(-0.95 * t.strength).toFixed(2)}'/></filter><rect width='100%' height='100%' fill='${t.base}'/><rect width='100%' height='100%' filter='url(%23f)'/></svg>`;
  const url = `url("data:image/svg+xml;utf8,${svg.replace(/#/g, "%23").replace(/"/g, "'")}")`;
  cache.set(k, url);
  return url;
}
export const toneBase = (tone) => (TONES[tone] ?? TONES.birch).base;
export const toneLabel = (tone) => (TONES[tone] ?? TONES.birch).label;
export const TONE_OPTIONS = Object.keys(TONES);
