export default function LoadingSpinner({ label = 'Loading' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-4 py-20 text-chocolate-500"
    >
      <svg
        className="h-10 w-10 animate-spin text-gold-500"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="3"
        />
        <path
          d="M22 12a10 10 0 0 0-10-10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <p className="text-xs uppercase tracking-[0.25em]">{label}…</p>
    </div>
  );
}