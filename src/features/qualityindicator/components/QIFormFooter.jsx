import React from "react";

const QIFormFooter = ({ metadata }) => {
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
        <div className="mt-8 grid grid-cols-3 border-2 border-slate-800 text-[10px] font-bold uppercase">
            <div className="p-2 border-r-2 border-b-2 border-slate-800">Document No: {meta.documentNo}</div>
            <div className="p-2 border-r-2 border-b-2 border-slate-800 bg-slate-50">Document Name: {meta.documentName}</div>
            <div className="p-2 border-b-2 border-slate-800">Issue No: {meta.issueNo}</div>

            <div className="p-2 border-r-2 border-slate-800">Issue Date: {meta.issueDate}</div>
            <div className="p-2 border-r-2 border-slate-800">Status: {meta.status}</div>
            <div className="p-2">Page {meta.page}</div>

            <div className="p-2 border-t-2 border-r-2 border-slate-800">Amendment No: {meta.amendmentNo}</div>
            <div className="p-2 border-t-2 border-slate-800" colSpan={2}>Amendment Date: {meta.amendmentDate}</div>
        </div>
    );
};

export default QIFormFooter;
