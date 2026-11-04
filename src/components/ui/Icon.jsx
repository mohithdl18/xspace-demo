const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
export const ArrowRight = ({ className = "arrow h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);
export const ArrowDown = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M12 4v15M6 13l6 6 6-6" />
  </svg>
);
export const Plus = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const Close = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const Menu = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);
export const Download = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
  </svg>
);
export const Check = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
export const Phone = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z" />
  </svg>
);
export const Mail = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <rect x="3" y="5" width="18" height="14" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);
export const Pin = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0119 9.5C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
export const Search = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
  </svg>
);
export const WhatsApp = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
    <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.3-.4.2-.4.7-1.3a.4.4 0 000-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.7 11.8 11.8 0 004.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 001.8-1.2 2.2 2.2 0 00.1-1.3c0-.1-.2-.2-.5-.3z" />
  </svg>
);
