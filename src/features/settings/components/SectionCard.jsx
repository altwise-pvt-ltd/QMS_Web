import React from "react";

const SectionCard = ({
  icon: Icon,
  title,
  subtitle,
  children,
  className = "",
}) => (
  <section
    className={`bg-white rounded-3xl border border-slate-100 shadow-sm
      shadow-slate-100/50 transition-shadow duration-300
      hover:shadow-md hover:shadow-slate-100/80 ${className}`}
  >
    <div className="px-6 py-5 md:px-8 md:py-6 border-b border-slate-50 flex items-center gap-3">
      <div className="p-2 rounded-xl bg-linear-to-br from-blue-50 to-indigo-50 text-blue-600 shrink-0">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-bold text-slate-800 tracking-wide">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
    <div className="p-6 md:p-8">{children}</div>
  </section>
);

export default SectionCard;
