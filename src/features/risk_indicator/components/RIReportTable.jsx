import React, { forwardRef } from "react";
import { CATEGORIES } from "../risk_indicator_data";
import RIFormFooter from "./RIFormFooter";

const RIReportTable = forwardRef(
    ({ selectedMonth, displayedIndicators, metadata }, ref) => {
        const days = Array.from({ length: 31 }, (_, i) =>
            String(i + 1).padStart(2, "0"),
        );

        const renderCategoryRows = (category) => {
            const categoryIndicators = displayedIndicators.filter(
                (i) => i.category === category,
            );

            if (categoryIndicators.length === 0) return null;

            return categoryIndicators.map((indicator, idx) => (
                <tr key={indicator.id} className="border-b border-slate-300 h-8">
                    {idx === 0 && (
                        <td
                            rowSpan={categoryIndicators.length}
                            className="border-r border-slate-300 py-2 px-1 text-center font-bold text-[10px] bg-slate-50 [writing-mode:vertical-rl] rotate-180"
                        >
                            {category}
                        </td>
                    )}
                    <td className="border-r border-slate-300 px-3 text-[10px] font-medium text-slate-700 min-w-[200px]">
                        {indicator.name}
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
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center text-gray-600 font-black text-xl italic">
                                A
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                                    ALPINE DIAGNOSTIC CENTRE
                                </h1>
                                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                                    Risk Management Department
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-lg font-bold border-b-2 border-slate-900 inline-block px-4 py-1">
                                RISK INDICATORS
                            </h2>
                        </div>
                    </div>

                    {/* Table Body */}
                    <table className="w-full border-collapse border-2 border-slate-800">
                        <thead>
                            <tr className="bg-slate-50 h-10">
                                <td className="border border-slate-800 px-3 py-1 font-bold text-[11px] min-w-[30px]">
                                    Month:
                                </td>
                                <td
                                    className="border border-slate-800 px-3 py-1 font-bold text-[11px] text-indigo-700"
                                    colSpan={2}
                                >
                                    {selectedMonth}
                                </td>
                                {days.map((day) => (
                                    <td
                                        key={day}
                                        className="border border-slate-800 text-center font-bold text-[10px] w-6 italic"
                                    >
                                        {day}
                                    </td>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {CATEGORIES.map((category) => renderCategoryRows(category))}
                            <tr className="h-12 border-t-2 border-slate-800">
                                <td
                                    colSpan={33}
                                    className="px-4 py-2 italic font-medium text-slate-700 text-xs text-left"
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
                    <RIFormFooter metadata={metadata} />
                </div>
            </div>
        );
    },
);

export default RIReportTable;
