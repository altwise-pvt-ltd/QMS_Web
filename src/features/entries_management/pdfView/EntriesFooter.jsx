import React from "react";

const EntriesFooter = ({ metadata }) => {
    const defaultMeta = {
        documentNo: "ADC--L--22",
        documentName: "QUALITY INDICATOR CHART FORM",
        issueNo: "01",
        issueDate: "01.07.2022",
        status: "Controlled",
        page: "1 of 1",
        amendmentNo: "00",
        amendmentDate: ""
    };

    const meta = { ...defaultMeta, ...metadata };

    return (
        <div className="grid grid-cols-6 border-2 border-slate-800 text-[10px] font-black uppercase text-slate-800">
            <div className="col-span-3 p-1 border-r-2 border-b-2 border-slate-800 bg-slate-50">Document No: {meta.documentNo}</div>
            <div className="col-span-3 p-1 border-b-2 border-slate-800">Document Name: {meta.documentName}</div>
            
            {/* Row 2 */}
            <div className="col-span-2 p-1 border-r-2 border-b-2 border-slate-800 bg-slate-50">Issue No: {meta.issueNo}</div>
            <div className="col-span-2 p-1 border-r-2 border-b-2 border-slate-800">Issue Date: {meta.issueDate}</div>
            <div className="col-span-2 p-1 border-b-2 border-slate-800 bg-slate-50 text-indigo-700 italic">Status: {meta.status}</div>

            {/* Row 3 */}
            <div className="col-span-2 p-1 border-r-2 border-slate-800">Amendment No: {meta.amendmentNo}</div>
            <div className="col-span-2 p-1 border-r-2 border-slate-800 bg-slate-50">Amendment Date: {meta.amendmentDate}</div>
            <div className="col-span-2 p-1 font-black text-indigo-700">Page: {meta.page}</div>
        </div>
    );
};

export default EntriesFooter;
