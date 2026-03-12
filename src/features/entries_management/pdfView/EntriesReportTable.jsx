import React, { forwardRef } from "react";
import EntriesFooter from "./EntriesFooter";
import { useAuth } from "../../../auth/AuthContext";

const EntriesReportTable = forwardRef(
  ({ selectedMonth, displayedIndicators, categories = [], metadata }, ref) => {
    const { organization } = useAuth();
    const days = Array.from({ length: 31 }, (_, i) =>
      String(i + 1).padStart(2, "0"),
    );

    const [monthPart = "", yearPart = ""] = (selectedMonth || "").split(" ");

    const renderCategoryRows = (categoryObj) => {
      const categoryName =
        categoryObj.qualityCategoryName ||
        categoryObj.qiCategory ||
        categoryObj.name;
      const catId = categoryObj.qualityIndicatorCategoryId;
      const catKey = categoryObj.qiCategory;

      const categoryIndicators = (displayedIndicators || []).filter((i) => {
        const indicatorCatId = String(i.qualityIndicatorCategoryId || "");
        return (
          indicatorCatId === String(catId) || indicatorCatId === String(catKey)
        );
      });

      if (categoryIndicators.length === 0) return null;

      const totalRowsForCategory = categoryIndicators.length + 1;

      return (
        <React.Fragment key={catId}>
          {categoryIndicators.map((indicator, idx) => (
            <tr key={idx} className="h-8 border-b border-slate-400">
              {idx === 0 && (
                <td
                  rowSpan={totalRowsForCategory}
                  className="border-r-2 border-slate-800 py-2 px-1 text-center font-black text-[9px] bg-slate-50 [writing-mode:vertical-rl] rotate-180 uppercase tracking-widest border-l-2 w-[60px]"
                >
                  {categoryName}
                </td>
              )}
              <td className="border-r border-slate-400 px-3 text-[9px] font-black text-slate-800 uppercase bg-white w-[180px]">
                {indicator.qualitySubCategoryName || indicator.name}
              </td>
              {days.map((day) => {
                const incident = indicator.incidents?.find((inc) =>
                  inc.date.endsWith(day),
                );
                return (
                  <td
                    key={day}
                    className="border-r border-slate-400 text-center text-[10px] font-black w-6 text-indigo-700 bg-white"
                  >
                    {incident ? incident.value : ""}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr className="h-8 border-b-2 border-slate-800">
            <td className="border-r border-slate-400 px-3 text-[10px] font-black text-slate-400 bg-slate-50 uppercase italic w-[180px]">
              Sign
            </td>
            {days.map((day) => (
              <td
                key={day}
                className="border-r border-slate-400 bg-white w-7"
              ></td>
            ))}
          </tr>
        </React.Fragment>
      );
    };

    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto p-2 overflow-y-hidden">
        <div
          ref={ref}
          className="min-w-[1100px] p-8 text-black bg-white relative printable-report"
        >
          {/* Controlled Copy Watermark */}
          <div className="hidden print:flex absolute inset-0 items-center justify-center pointer-events-none opacity-[0.03] overflow-hidden">
            <span className="text-[70px] font-black uppercase rotate-[-35deg] whitespace-nowrap border-8 border-black px-8 rounded-[20px]">
              Controlled Copy
            </span>
          </div>

          {/* Report Header */}
          <div className="border-b-2 border-slate-800 mb-6 pb-2">
            <div className="flex flex-row items-center px-4 py-2">
              <div className="w-[15%]">
                {organization?.logo ? (
                  <img
                    src={organization.logo}
                    alt="Logo"
                    className="h-16 object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-2xl italic">
                    {organization?.name?.charAt(0) || "A"}
                  </div>
                )}
              </div>
              <div className="w-[85%] flex flex-col items-center justify-center pr-[15%]">
                <h1 className="text-3xl font-black uppercase tracking-tighter text-center leading-none">
                  {organization?.name || organization?.legalCompanyName || "Your Company Name"}
                </h1>
                <p className="text-[10px] leading-relaxed mt-1 text-center font-bold text-slate-700">
                  {organization?.address || organization?.registeredAddress || "Your Company Address"}
                  {(organization?.phone || organization?.businessPhone) && ` | Tel: ${organization.phone || organization.businessPhone}`}
                  {(organization?.websiteUrl || organization?.corporateWebsite) && ` | Web: ${organization.websiteUrl || organization.corporateWebsite}`}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-4">
            <h2 className="text-lg font-black uppercase underline decoration-2 underline-offset-8 tracking-widest inline-block px-4 py-1">
              {metadata?.documentName || "MONTHLY LOG FORM"}
            </h2>
          </div>

          <table className="w-full border-collapse border-slate-800">
            <thead>
              {/* Row 1: Labels */}
              <tr className="bg-slate-50 border-t-2 border-slate-800 h-8">
                <td className="border-r-2 border-slate-800 px-4 py-1 font-black text-[10px] border-l-2 uppercase bg-slate-100 italic w-[60px]">Month:</td>
                <td className="border-r-2 border-slate-800 px-4 py-1 font-black text-[10px] uppercase bg-slate-100 italic w-[180px]">Year:</td>
                <td className="border-r-2 border-slate-800 text-center font-black text-sm uppercase italic tracking-[1.5em] bg-slate-100" colSpan={31}>Date</td>
              </tr>
              {/* Row 2: Values - with separation line below */}
              <tr className="bg-white border-t border-slate-800 h-10 border-b-2">
                <td className="border-r-2 border-slate-800 px-4 py-1 font-black text-base text-indigo-700 uppercase border-l-2 text-center">{monthPart}</td>
                <td className="border-r-2 border-slate-800 px-4 py-1 font-black text-base text-indigo-700 text-center">{yearPart}</td>
                {days.map((day) => (
                  <td
                    key={day}
                    className="border-r border-slate-800 text-center font-black text-[9px] w-6 italic py-1 bg-slate-50/50"
                  >
                    {day}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => renderCategoryRows(category))}
              <tr className="h-8 border-t-2 border-slate-800 bg-slate-50">
                <td
                  colSpan={35}
                  className="px-6 py-1 italic font-black text-slate-800 text-[9px] text-left border-x-2 border-slate-800"
                >
                  <div className="flex justify-between items-center w-full">
                    <span>No major observations in {selectedMonth}</span>
                    <span className="mr-32 uppercase tracking-widest border-b border-black font-black not-italic px-4 text-[10px]">
                      Assigned Signature / Date
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4">
            <EntriesFooter metadata={metadata} />
          </div>

          <div className="mt-2 flex justify-between font-bold text-[8px] text-slate-400 uppercase tracking-widest">
            <span>ISSUED BY: QA DEPARTMENT</span>
            <span>Generated on: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  },
);

export default EntriesReportTable;
