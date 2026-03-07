import React, { useEffect, useState } from "react";
import { FileText, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { getDocumentStatus } from "../services/dashboardService";

const DocumentStatusWidget = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDocumentStatus();
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

  const counts = data?.counts || { total: 0, inReview: 0, expired: 0 };
  const criticalDocuments = data?.criticalDocuments || [];

  return (
    <div className="@container flex flex-col h-full justify-between">
      {/* Top Stats Row */}
      <div className="flex justify-between items-start mb-2">
        <div className="text-center flex-1">
          <span className="block text-xl @xs:text-2xl font-bold text-slate-800">
            {counts.total}
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Total
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-100 mx-1 @xs:mx-2"></div>

        <div className="text-center flex-1">
          <span className="block text-xl @xs:text-2xl font-bold text-amber-500">
            {counts.inReview}
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Review
          </span>
        </div>

        <div className="w-px h-8 bg-slate-100 mx-1 @xs:mx-2"></div>

        <div className="text-center flex-1">
          <span className="block text-xl @xs:text-2xl font-bold text-rose-500">
            {counts.expired}
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Expired
          </span>
        </div>
      </div>

      {/* Mini List of "To-Do" Documents */}
      <div className="space-y-2 mt-1 overflow-y-auto max-h-32 pr-1">
        {criticalDocuments.length > 0 ? (
          criticalDocuments.slice(0, 3).map((doc, index) => (
            <div
              key={doc.id || index}
              className={`flex items-center justify-between text-xs p-2 rounded-lg border ${
                doc.status === "expired"
                  ? "bg-rose-50 border-rose-100 text-rose-600"
                  : "bg-amber-50 border-amber-100 text-amber-600"
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                {doc.status === "expired" ? (
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                )}
                <span className="font-medium text-slate-700 truncate">
                  {doc.title}
                </span>
              </div>
              <span className="font-semibold shrink-0">
                {doc.status === "expired"
                  ? "Expired"
                  : `Due in ${doc.daysUntilDue}d`}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-slate-400 text-xs italic">
            No critical documents
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentStatusWidget;
