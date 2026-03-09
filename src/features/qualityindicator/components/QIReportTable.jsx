import React, { forwardRef } from "react";
import QIFormFooter from "./QIFormFooter";
import { useAuth } from "../../../auth/AuthContext";
const QIReportTable = forwardRef(
  ({ selectedMonth, displayedIndicators, categories = [], metadata }, ref) => {
    const { organization } = useAuth();
    const days = Array.from({ length: 31 }, (_, i) =>
      String(i + 1).padStart(2, "0"),
    );

    const renderCategoryRows = (categoryObj) => {
      const categoryName =
        categoryObj.qualityCategoryName ||
        categoryObj.qiCategory ||
        categoryObj.name;
      const catId = categoryObj.qualityIndicatorCategoryId;
      const catKey = categoryObj.qiCategory;

      const categoryIndicators = displayedIndicators.filter((i) => {
        const indicatorCatId = String(i.qualityIndicatorCategoryId || "");
        return (
          indicatorCatId === String(catId) || indicatorCatId === String(catKey)
        );
      });

      if (categoryIndicators.length === 0) return null;

      return categoryIndicators.map((indicator, idx) => (
        <tr
          key={indicator.qualityIndicatorSubCategoryId}
          className="border-b border-slate-300 h-8"
        >
          {idx === 0 && (
            <td
              rowSpan={categoryIndicators.length}
              className="border-r border-slate-300 py-2 px-1 text-center font-bold text-[10px] bg-slate-50 [writing-mode:vertical-rl] rotate-180"
            >
              {categoryName}
            </td>
          )}
          <td className="border-r border-slate-300 px-3 text-[10px] font-medium text-slate-700 min-w-[200px]">
            {indicator.qualitySubCategoryName}
          </td>
          {days.map((day) => {
            const incident = indicator.incidents?.find((inc) =>
              inc.date.endsWith(day),
            );
            return (
              <td
                key={day}
                className="border-r border-slate-300 text-center text-[10px] font-bold w-6"
              >
                {incident ? incident.value : ""}
              </td>
            );
          })}
        </tr>
      ));
    };

    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto p-8 overflow-y-hidden printable-report">
        <div ref={ref} className="min-w-[1000px] p-4 text-black bg-white">
          {/* Report Header */}
          <div className="border-b-2 border-black mb-4">
            <div className="flex flex-row items-center px-10 py-4 text-left">
              <div className="w-[20%] flex justify-center pr-4">
                {organization?.logo ? (
                  <img
                    src={organization.logo}
                    alt="Logo"
                    className="h-16 object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center text-gray-600 font-black text-xl italic">
                    {organization?.name?.charAt(0) || "A"}
                  </div>
                )}
              </div>
              <div className="w-[80%] flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold uppercase tracking-tight text-center">
                  {organization?.name || "Your Company Name"}
                </h1>
                <p className="text-sm leading-5 mt-1 text-center font-medium">
                  {organization?.address || "Your Company Address"}
                  {organization?.phone && ` | Tel: ${organization.phone}`}
                  {organization?.websiteUrl && ` | Web: ${organization.websiteUrl}`}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center py-3 mb-4">
            <h2 className="text-lg font-bold uppercase underline decoration-1 underline-offset-4">
              {metadata.documentName || "QUALITY INDICATOR CHART FORM"}
            </h2>
          </div>

          {/* Table Body */}
          <table className="w-full border-collapse border-2 border-slate-800">
            <thead>
              <tr className="bg-slate-50 h-10">
                <td className="border border-slate-800 px-3 py-1 font-bold text-xs min-w-[30px]">
                  Month:
                </td>
                <td
                  className="border border-slate-800 px-3 py-1 font-bold text-sm text-indigo-700"
                  colSpan={2}
                >
                  {selectedMonth}
                </td>
                {days.map((day) => (
                  <td
                    key={day}
                    className="border border-slate-800 text-center font-bold text-[11px] w-6 italic"
                  >
                    {day}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => renderCategoryRows(category))}
              <tr className="h-12 border-t-2 border-slate-800">
                <td
                  colSpan={33}
                  className="px-4 py-3 italic font-medium text-slate-700 text-sm text-left"
                >
                  No major observations in {selectedMonth}{" "}
                  <span className="float-right font-bold text-slate-900 not-italic mr-20">
                    Assigned Signature / Date
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Report Footer */}
          <QIFormFooter metadata={metadata} />
        </div>
      </div>
    );
  },
);

export default QIReportTable;
