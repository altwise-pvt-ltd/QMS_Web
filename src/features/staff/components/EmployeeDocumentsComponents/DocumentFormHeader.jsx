import React from "react";
import { FileText, Award } from "lucide-react";

const DocumentFormHeader = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-50 rounded-lg">
          <FileText className="text-blue-600" size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Employee Documents & Records
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all employee documentation including personal documents,
            qualifications, medical records, vaccinations, and training
            certifications
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentFormHeader;
