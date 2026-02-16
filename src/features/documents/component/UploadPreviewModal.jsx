import React, { useEffect, useState } from "react";
import { X, FileText, ExternalLink, ShieldAlert } from "lucide-react";
import ImageWithFallback from "../../../components/ui/ImageWithFallback";

export default function UploadPreviewModal({ file, isOpen, onClose }) {
  const [objectUrl, setObjectUrl] = useState(null);

  useEffect(() => {
    if (!file || !isOpen) return;

    const url = URL.createObjectURL(file);
    setObjectUrl(url);

    return () => {
      URL.revokeObjectURL(url);
      setObjectUrl(null);
    };
  }, [file, isOpen]);

  if (!isOpen || !file) return null;

  const isImage = file.type.startsWith("image/");
  const isPdf = file.type === "application/pdf";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
              <ExternalLink size={22} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 leading-tight tracking-tight">
                Document Preview
              </h3>
              <p className="text-xs text-slate-600 font-bold uppercase tracking-widest mt-0.5">
                {file.name} • {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Info Banner */}
        <div className="px-6 py-2 bg-amber-50 border-b border-amber-100 flex items-center gap-2 text-amber-800 text-[11px] font-medium">
          <ShieldAlert size={14} className="shrink-0 text-amber-600" />
          <span>
            This is a <strong>temporary local preview</strong>. Changes and
            metadata are not yet saved to the QMS database.
          </span>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-slate-200 relative overflow-hidden">
          {isImage && objectUrl ? (
            <div className="w-full h-full flex items-center justify-center p-8 bg-slate-300">
              <ImageWithFallback
                src={objectUrl}
                alt="Document preview"
                className="max-w-full max-h-full shadow-2xl rounded-sm object-contain border border-white/20"
              />
            </div>
          ) : isPdf && objectUrl ? (
            <iframe
              src={`${objectUrl}#toolbar=0&navpanes=0`}
              className="w-full h-full border-none"
              title="PDF Preview"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-50">
              <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 shadow-inner ring-1 ring-slate-200">
                <FileText size={40} className="text-slate-400" />
              </div>
              <h4 className="text-lg font-bold text-slate-800">
                Preview Not Available
              </h4>
              <p className="text-sm text-slate-500 mt-2 max-w-xs text-center font-medium">
                {file.type || "This file type"} cannot be previewed in the
                browser. Full metadata validation will still occur on upload.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all active:scale-95 shadow-sm"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
