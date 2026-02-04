import React from "react";

const NextAuditWidget = () => {
  return (
    <div className="@container flex flex-col h-full justify-center items-center text-center text-white">
      <div className="text-sm opacity-80 uppercase tracking-wide">
        ISO 9001
      </div>
      <div className="text-3xl @xs:text-4xl font-bold mt-1">12 Days</div>
      <div className="text-sm opacity-80 mt-2">Oct 15, 2025</div>
    </div>
  );
};

export default NextAuditWidget;
