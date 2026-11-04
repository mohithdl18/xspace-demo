/** Re-mounts on navigation, giving each page a restrained fade-in. */
export default function Template({ children }) {
  return <div className="page-enter">{children}</div>;
}
