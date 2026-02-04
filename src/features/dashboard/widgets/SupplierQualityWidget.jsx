import React from "react";

const SupplierQualityWidget = () => {
  return (
    <div className="@container flex flex-col h-full justify-center">
      <div className="flex justify-between items-end">
        <span className="text-3xl @xs:text-4xl font-bold text-slate-800">89%</span>
        <span className="text-xs text-amber-500 bg-amber-50 px-2 py-1 rounded-md">
          Warning
        </span>
      </div>
      <p className="text-xs text-slate-400 mt-2">
        Vendor B requires review
      </p>
    </div>
  );
};

export default SupplierQualityWidget;
