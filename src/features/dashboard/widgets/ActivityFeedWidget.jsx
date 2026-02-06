import React from "react";

export const ActivityFeedWidget = () => (
  <div className="@container space-y-6 relative pl-2">
    <div className="absolute left-2.75 top-2 bottom-2 w-0.5 bg-slate-100" />
    {[
      {
        user: "Sarah C.",
        action: "released document",
        target: "SOP-Quality-01",
        time: "2h ago",
      },
      {
        user: "Mike R.",
        action: "closed CAPA",
        target: "#4402",
        time: "4h ago",
      },
      {
        user: "System",
        action: "flagged deviation",
        target: "Batch 292",
        time: "5h ago",
      },
      {
        user: "Anna L.",
        action: "updated policy",
        target: "Safety Guidelines",
        time: "1d ago",
      },
    ].map((item, i) => (
      <div
        key={i}
        className="relative flex gap-4 items-start group cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-2 rounded-lg transition-all duration-200"
      >
        <div className="relative z-10 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold ring-4 ring-white group-hover:shadow-md transition-shadow duration-200">
          {item.user.charAt(0)}
        </div>
        <div>
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-800">{item.user}</span>{" "}
            {item.action}
          </p>
          <p className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">
            {item.target}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">{item.time}</p>
        </div>
      </div>
    ))}
  </div>
);

export default ActivityFeedWidget;
