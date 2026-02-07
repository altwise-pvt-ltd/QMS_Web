import React from "react";
import { X, Download, Printer } from "lucide-react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import YearlySchedulePdf from "../pdf Creations/YearlySchedulePdf";

const YearlyTrainingPreview = ({ trainings, onClose }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Yearly Training Schedule Preview
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Academic Year {currentYear}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <PDFDownloadLink
              document={
                <YearlySchedulePdf trainings={trainings} year={currentYear} />
              }
              fileName={`Yearly_Training_Schedule_${currentYear}.pdf`}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              {({ loading }) => (
                <>
                  <Download size={18} />
                  {loading ? "Preparing..." : "Download PDF"}
                </>
              )}
            </PDFDownloadLink>

            <button
              onClick={onClose}
              className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PDF Viewer Content */}
        <div className="flex-1 bg-slate-50 p-6 flex items-center justify-center min-h-0">
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner border border-slate-200 bg-white">
            <PDFViewer
              width="100%"
              height="100%"
              className="border-none"
              showToolbar={true}
            >
              <YearlySchedulePdf trainings={trainings} year={currentYear} />
            </PDFViewer>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-4 border-t border-slate-100 flex justify-end gap-3 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default YearlyTrainingPreview;
