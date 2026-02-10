import React from "react";
import { Download, Eye, FileText } from "lucide-react";
import {
  generateMRMPdf,
  generateMinutesPdf,
  previewMRMPdf,
} from "../utils/pdfUtils";

/**
 * PDF Export Buttons Component
 * Add this to your MrmList or MinutesOfMeeting page
 */
const PdfExportButtons = ({ meeting, actionItems, minutes }) => {
  const [loading, setLoading] = React.useState(false);

  const handleGenerateMRMPdf = async () => {
    setLoading(true);
    const success = await generateMRMPdf(meeting, actionItems, minutes);
    setLoading(false);
    if (success) {
      alert("PDF generated successfully!");
    } else {
      alert("Error generating PDF");
    }
  };

  const handleGenerateMinutesPdf = async () => {
    setLoading(true);
    const success = await generateMinutesPdf(meeting, actionItems, minutes);
    setLoading(false);
    if (success) {
      alert("Minutes PDF generated successfully!");
    } else {
      alert("Error generating PDF");
    }
  };

  const handlePreview = async () => {
    setLoading(true);
    await previewMRMPdf(meeting, actionItems, minutes);
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handlePreview}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors shadow-sm font-medium disabled:opacity-50"
      >
        <Eye size={18} />
        Preview PDF
      </button>

      <button
        onClick={handleGenerateMRMPdf}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium disabled:opacity-50"
      >
        <Download size={18} />
        Download MRM PDF
      </button>

      <button
        onClick={handleGenerateMinutesPdf}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium disabled:opacity-50"
      >
        <FileText size={18} />
        Download Minutes PDF
      </button>
    </div>
  );
};

export default PdfExportButtons;
