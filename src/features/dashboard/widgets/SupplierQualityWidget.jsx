import React, { useEffect, useState } from "react";
import { getSupplierQuality } from "../services/dashboardService";

const SupplierQualityWidget = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSupplierQuality();
        setData(result);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const percentage = data?.qualityPercentage ?? 0;
  const status = data?.status || "N/A";
  const alert = data?.alertMessage || "All vendors compliant";

  return (
    <div className="@container flex flex-col h-full justify-center">
      <div className="flex justify-between items-end">
        <span className="text-3xl @xs:text-4xl font-bold text-slate-800">
          {percentage}%
        </span>
        <span
          className={`text-xs px-2 py-1 rounded-md ${
            status === "Critical"
              ? "text-rose-600 bg-rose-50"
              : status === "Warning"
                ? "text-amber-600 bg-amber-50"
                : "text-emerald-600 bg-emerald-50"
          }`}
        >
          {status}
        </span>
      </div>
      <p className="text-xs text-slate-400 mt-2 truncate">{alert}</p>
    </div>
  );
};

export default SupplierQualityWidget;
