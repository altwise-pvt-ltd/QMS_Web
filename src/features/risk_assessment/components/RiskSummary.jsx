import React from "react";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";

const RiskSummary = ({ summary }) => {
  const cards = [
    {
      label: "Total Risks",
      value: summary.total,
      icon: <Info className="w-5 h-5 text-indigo-600" />,
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
      borderColor: "border-indigo-100",
    },
    {
      label: "High Risks",
      value: summary.high,
      icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
      bgColor: "bg-rose-50",
      textColor: "text-rose-700",
      borderColor: "border-rose-100",
    },
    {
      label: "Medium Risks",
      value: summary.medium,
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      borderColor: "border-amber-100",
    },
    {
      label: "Low Risks",
      value: summary.low,
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} ${card.borderColor} border rounded-xl p-4 flex items-center justify-between shadow-sm`}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              {card.label}
            </p>
            <p className={`text-2xl font-bold ${card.textColor}`}>
              {card.value}
            </p>
          </div>
          <div className="p-2 bg-white rounded-lg shadow-xs">{card.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default RiskSummary;
