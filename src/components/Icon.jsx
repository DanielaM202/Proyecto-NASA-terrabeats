// Small line/solid icons (decorative: the button always carries its own accessible name).
const PATHS = {
  play: <path d="M8 5.5v13l11-6.5z" fill="currentColor" />,
  pause: <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />,
  prev: <path d="M6 5h2v14H6zM20 5.5v13L9.5 12z" fill="currentColor" />,
  next: <path d="M16 5h2v14h-2zM4 5.5v13L14.5 12z" fill="currentColor" />,
  back: <path d="M12 5a7 7 0 1 1-6.6 4.7M12 2v6H6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  fwd: <path d="M12 5a7 7 0 1 0 6.6 4.7M12 2v6h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  up: <path d="M12 6l7 10H5z" fill="currentColor" />,
  down: <path d="M12 18L5 8h14z" fill="currentColor" />,
  left: <path d="M6 12l10-7v14z" fill="currentColor" />,
  right: <path d="M18 12L8 5v14z" fill="currentColor" />,
  target: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="6" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    </g>
  ),
  stop: <rect x="6" y="6" width="12" height="12" rx="1.5" fill="currentColor" />,
  download: <path d="M12 4v10m0 0l-4-4m4 4l4-4M5 19h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
};

export default function Icon({ name, className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      {PATHS[name]}
    </svg>
  );
}
