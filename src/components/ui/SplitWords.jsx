/**
 * Splits a headline into masked words so they can slide up into view
 * (animated by Motion.jsx via the `data-split` attribute on the heading).
 * Rendered on the server, so the words are real text for SEO and screen
 * readers, and everything stays visible if JavaScript never runs.
 * Non-string children are rendered unchanged.
 */
export function SplitWords({ children }) {
  const text = Array.isArray(children) ? children.join("") : children;
  if (typeof text !== "string") return children;
  const words = text.trim().split(/\s+/);
  return words.map((w, i) => (
    <span key={i} className="split-mask -mb-[0.1em] inline-block overflow-hidden pb-[0.1em] align-bottom">
      <span className="split-word inline-block">
        {w}
        {i < words.length - 1 ? " " : ""}
      </span>
    </span>
  ));
}
