import React from "react";

const BentoCard = ({ children, className = "", title, icon: Icon, action }) => (
  <div
    className={`bg-white p-6 rounded-3xl border border-slate-200
    shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-indigo-200
    transition-all duration-300 flex flex-col ${className}`}
  >
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-indigo-500" />}
        {title && <h3 className={`font-semibold ${className.includes('text-gray-600') ? 'text-inherit' : 'text-slate-800'}`}>{title}</h3>}
      </div>
      {action && <div>{action}</div>}
    </div>

    <div className="flex-1 overflow-hidden relative">{children}</div>
  </div>
);

export default BentoCard;

