import React, { useState, useEffect } from "react";
import { FileText, Upload, Download, Trash2, FolderOpen } from "lucide-react";
import staffService from "../services/staffService";
import { Skeleton } from "../../../components/ui/Skeleton";

const StaffDocuments = ({ staffName, staffId }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (staffId) {
      fetchDocuments();
    }
  }, [staffId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await staffService.getStaffDocuments(staffId);
      if (response.data) {
        const data = response.data;
        // Flatten the nested structure
        const allDocs = [];

        // Qualifications
        if (data.qualifications?.length) {
          data.qualifications.forEach(item => {
            allDocs.push({
              name: item.documentTitle || "Qualification",
              subtitle: `${item.collegeName} (${item.graduationYear})`,
              path: item.qualificationDocumentPath,
              type: "Qualification",
              date: null
            });
          });
        }

        // Appointments
        if (data.appointments?.length) {
          data.appointments.forEach(item => {
            allDocs.push({
              name: item.documentTitle || "Appointment Letter",
              subtitle: "Appointment Record",
              path: item.appointmentDocumentPath,
              type: "Appointment",
              date: null
            });
          });
        }

        // Medicals
        if (data.medicals?.length) {
          data.medicals.forEach(item => {
            allDocs.push({
              name: item.recordTitle || "Medical Record",
              subtitle: `Issue Date: ${item.issueDate?.split('T')[0] || 'N/A'}`,
              path: item.medicalCertificatePath,
              type: "Medical",
              date: item.issueDate
            });
          });
        }

        // Vaccinations
        if (data.vaccinations?.length) {
          data.vaccinations.forEach(item => {
            allDocs.push({
              name: item.certificateName || "Vaccination Record",
              subtitle: `Dose Date: ${item.doseDate?.split('T')[0] || 'N/A'}`,
              path: item.vaccinationDocumentPath,
              type: "Vaccination",
              date: item.doseDate
            });
          });
        }

        // Trainings
        if (data.trainings?.length) {
           data.trainings.forEach(item => {
             if (item.inductionTrainingPath) {
               allDocs.push({
                 name: `${item.trainingTitle || "Training"} - Induction`,
                 subtitle: "Induction Training Record",
                 path: item.inductionTrainingPath,
                 type: "Training",
                 date: null
               });
             }
             if (item.competencyTrainingPath) {
               allDocs.push({
                 name: `${item.trainingTitle || "Training"} - Competency`,
                 subtitle: "Competency Training Record",
                 path: item.competencyTrainingPath,
                 type: "Training",
                 date: null
               });
             }
           });
        }

        // Resume & Passport (if available and not just strings in root)
        if (data.resumePath) {
          allDocs.push({
            name: "Resume / CV",
            subtitle: "General",
            path: data.resumePath,
            type: "Resume",
            date: null
          });
        }
        if (data.passportPhotoPath) {
           // Usually displayed as avatar, but can be here too
        }

        setDocuments(allDocs);
      }
    } catch (error) {
      console.error("Error fetching staff documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (path) => {
    const url = staffService.getAssetUrl(path);
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Documents for {staffName || "Employee"}
          </h3>
          <p className="text-sm text-gray-500">
            Manage employment contracts, identification, and other records.
          </p>
        </div>
        <button className="text-sm bg-white border border-gray-300 px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm">
          <Upload size={16} /> Upload Document
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {loading ? (
           <div className="space-y-3">
             <Skeleton className="h-16 w-full rounded-lg" />
             <Skeleton className="h-16 w-full rounded-lg" />
             <Skeleton className="h-16 w-full rounded-lg" />
           </div>
        ) : documents.length > 0 ? (
          documents.map((doc, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">
                    {doc.name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {doc.subtitle} • {doc.type}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleDownload(doc.path)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="Download / View"
                >
                  <Download size={18} />
                </button>
                <button 
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <div className="p-4 bg-white rounded-full shadow-sm mb-3">
              <FolderOpen size={32} className="text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-medium">No documents found</h3>
            <p className="text-gray-500 text-sm mt-1">Upload a document to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDocuments;
