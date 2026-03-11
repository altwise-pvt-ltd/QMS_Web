import React from "react";

// ─── ICONS (inline SVG) ──────────────────────────────────────────────────────
export const Icon = ({
  d,
  size = 18,
  color = "currentColor",
  strokeWidth = 2,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

export const Icons = {
  plus: "M12 5v14M5 12h14",
  back: "M19 12H5M12 5l-7 7 7 7",
  search: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  close: "M18 6L6 18M6 6l12 12",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  cal: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  check: "M20 6L9 17l-5-5",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  clock:
    "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2",
  warning:
    "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  entry:
    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
export const TODAY = new Date().toISOString().split("T")[0];
export const CYCLES = ["daily", "weekly", "monthly"];
export const CYCLE_LABEL = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};
export const CYCLE_COLOR = {
  daily: { bg: "#EEF2FF", text: "#4F46E5", border: "#C7D2FE", dot: "#6366F1" },
  weekly: { bg: "#F0FDF4", text: "#16A34A", border: "#BBF7D0", dot: "#22C55E" },
  monthly: {
    bg: "#FFF7ED",
    text: "#C2410C",
    border: "#FED7AA",
    dot: "#F97316",
  },
};

export function getDaysInMonth(year, month) {
  const days = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(year, month, i + 1);
    return d.toISOString().split("T")[0];
  });
}

export function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── STYLE TOKENS ────────────────────────────────────────────────────────────
export const css = {
  card: "bg-white rounded-2xl border border-slate-200 shadow-sm",

  input:
    "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all placeholder:text-slate-400",

  label:
    "block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5",

  btnPri:
    "flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-sm hover:shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.98] transition-all duration-200",

  btnSec:
    "flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 active:scale-[0.98] transition-all duration-200",

  // Example of how to use the 'cycle' parameter to return dynamic colors
  badge: (cycle) => {
    const baseClasses =
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide";

    // You can customize these conditions based on what 'cycle' actually represents
    switch (cycle?.toLowerCase()) {
      case "active":
        return `${baseClasses} bg-emerald-50 text-emerald-600 border border-emerald-200/50`;
      case "pending":
        return `${baseClasses} bg-amber-50 text-amber-600 border border-amber-200/50`;
      case "error":
        return `${baseClasses} bg-red-50 text-red-600 border border-red-200/50`;
      default:
        return `${baseClasses} bg-slate-100 text-slate-600 border border-slate-200`;
    }
  },
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
export function CycleBadge({ cycle }) {
  const c = CYCLE_COLOR[cycle] || CYCLE_COLOR.daily;
  return (
    <span className={css.badge(cycle)}>
      <span
        className="w-1.5 h-1.5 rounded-full inline-block"
        style={{ background: c.dot }}
      />
      {CYCLE_LABEL[cycle] || cycle}
    </span>
  );
}

export function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(15,23,42,0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        className={`${css.card} w-full max-w-lg overflow-hidden`}
        style={{ animation: "modalIn 0.2s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
      <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  );
}
