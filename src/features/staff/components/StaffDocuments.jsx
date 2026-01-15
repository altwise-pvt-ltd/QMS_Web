import React from "react";
import { FileText, Upload, Download, Trash2 } from "lucide-react";

const StaffDocuments = ({ staffName }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          Documents for {staffName || "Employee"}
        </h3>
        <button className="text-sm border border-gray-300 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-gray-50">
          <Upload size={14} /> Upload Document
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {["Job Description.pdf", "Offer Letter.pdf", "NDA_Signed.pdf"].map(
          (doc, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                  <FileText size={20} />
                </div>
                <span className="text-sm font-medium text-gray-700">{doc}</span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                  <Download size={16} />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default StaffDocuments;
