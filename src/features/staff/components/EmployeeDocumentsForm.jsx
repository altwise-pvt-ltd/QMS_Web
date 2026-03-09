import React, { useState, useEffect } from "react";
import {
  DocumentFormHeader,
  PersonalDocuments,
  QualificationDocuments,
  AppointmentDocuments,
  MedicalRecords,
  VaccinationRecords,
  TrainingRecords,
  DocumentFormActions,
} from "./EmployeeDocumentsComponents";
import staffService from "../services/staffService";

const EmployeeDocumentsForm = ({ initialData }) => {
  const [formData, setFormData] = useState({
    // Personal Documents
    passportPhoto: null,
    cv: null,

    // Qualification Documents (dynamic array)
    qualifications: [
      { title: "", collegeName: "", graduationYear: "", file: null },
    ],

    // Appointment Documents (dynamic array)
    appointmentDocuments: [{ title: "", file: null }],

    // Medical Records (dynamic array)
    medicalRecords: [{ title: "", certificate: null, issueDate: "" }],

    // Vaccination Records (dynamic array)
    vaccinationRecords: [
      {
        name: "",
        date: "",
        file: null,
      },
    ],

    // Training Records (dynamic array)
    trainingRecords: [
      {
        title: "",
        inductionTraining: null,
        competencyTraining: null,
      },
    ],
  });

  // Populate form when editing existing staff
  const [existingDocuments, setExistingDocuments] = useState({
    passportPhoto: null,
    cv: null,
    qualifications: [],
    appointmentDocuments: [],
    medicalRecords: [],
    vaccinationRecords: [],
    trainingRecords: [],
  });

  // Populate form when editing existing staff
  useEffect(() => {
    if (initialData?.id) {
      const fetchDocuments = async () => {
        try {
          const response = await staffService.getStaffDocuments(initialData.id);
          const docs = response.data;

          // Helper to create file object for existing files
          const createExistingFile = (path, name = "View Document") => {
            if (!path) return null;
            return {
              name: name,
              url: staffService.getAssetUrl(path),
              isExisting: true,
              path: path,
            };
          };

          // Set Existing Documents State (Read-only display)
          setExistingDocuments({
            passportPhoto: docs.passportPhoto
              ? createExistingFile(docs.passportPhoto, "Passport Photo")
              : null,
            cv: docs.resumePath
              ? createExistingFile(docs.resumePath, "CV / Resume")
              : null,
            qualifications:
              docs.qualifications?.map((q) => ({
                title: q.documentTitle,
                collegeName: q.collegeName || "",
                graduationYear: q.graduationYear || "",
                file: createExistingFile(q.documentPath, q.documentTitle),
              })) || [],
            appointmentDocuments:
              docs.appointments?.map((a) => ({
                title: a.documentTitle,
                file: createExistingFile(a.documentPath, a.documentTitle),
              })) || [],
            medicalRecords:
              docs.medicals?.map((m) => ({
                title: m.recordTitle,
                issueDate: m.issueDate ? m.issueDate.split("T")[0] : "",
                certificate: createExistingFile(
                  m.medicalCertificatePath,
                  m.recordTitle,
                ),
              })) || [],
            vaccinationRecords:
              docs.vaccinations?.map((v) => ({
                name: v.certificateName,
                date: v.doseDate ? v.doseDate.split("T")[0] : "",
                file: createExistingFile(
                  v.vaccinationDocumentPath,
                  v.certificateName,
                ),
              })) || [],
            trainingRecords:
              docs.trainings?.map((t) => ({
                title: t.trainingTitle,
                inductionTraining: createExistingFile(
                  t.inductionTrainingPath,
                  "Induction Training",
                ),
                competencyTraining: createExistingFile(
                  t.competencyTrainingPath,
                  "Competency Training",
                ),
              })) || [],
          });

          // Reset Form Data for new entries (keep inputs clean)
          setFormData({
            passportPhoto: null,
            cv: null,
            qualifications: [
              { title: "", collegeName: "", graduationYear: "", file: null },
            ],
            appointmentDocuments: [{ title: "", file: null }],
            medicalRecords: [{ title: "", certificate: null, issueDate: "" }],
            vaccinationRecords: [{ name: "", date: "", file: null }],
            trainingRecords: [
              {
                title: "",
                inductionTraining: null,
                competencyTraining: null,
              },
            ],
          });
        } catch (error) {
          console.error("Error fetching staff documents:", error);
        }
      };

      fetchDocuments();
    }
  }, [initialData]);

  // Handle file changes
  const handleFileChange = (e, fieldName, index = null, subField = null) => {
    const file = e.target.files?.[0];
    const value = e.target.value;

    if (!file && !value) return;

    // Handle dynamic arrays
    if (
      [
        "qualifications",
        "appointmentDocuments",
        "medicalRecords",
        "vaccinationRecords",
        "trainingRecords",
      ].includes(fieldName)
    ) {
      const updatedArray = [...formData[fieldName]];
      if (
        subField === "file" ||
        subField === "certificate" ||
        subField === "inductionTraining" ||
        subField === "competencyTraining"
      ) {
        updatedArray[index][subField] = file;
      } else if (
        subField === "title" ||
        subField === "name" ||
        subField === "collegeName" ||
        subField === "graduationYear" ||
        subField === "issueDate" ||
        subField === "date"
      ) {
        updatedArray[index][subField] = value;
      }
      setFormData((prev) => ({ ...prev, [fieldName]: updatedArray }));
    } else {
      // Handle single file uploads
      if (fieldName === "passportPhoto" && file) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const previewUrl = reader.result;
          setFormData((prev) => ({
            ...prev,
            passportPhoto: { file, name: file.name, preview: previewUrl },
          }));
        };
        reader.readAsDataURL(file);
      } else {
        setFormData((prev) => ({ ...prev, [fieldName]: file }));
      }
    }
  };

  // Handle file removal
  const handleFileRemove = (fieldName, index = null, subField = null) => {
    if (
      [
        "qualifications",
        "medicalRecords",
        "vaccinationRecords",
        "trainingRecords",
      ].includes(fieldName)
    ) {
      const updatedArray = [...formData[fieldName]];
      if (subField) {
        updatedArray[index][subField] = null;
      } else {
        updatedArray[index].file = null;
      }
      setFormData((prev) => ({ ...prev, [fieldName]: updatedArray }));
    } else {
      setFormData((prev) => ({ ...prev, [fieldName]: null }));
    }
  };

  // Handle input changes (for dates, text fields)
  const handleInputChange = (
    e,
    fieldName = null,
    index = null,
    subField = null,
  ) => {
    const { name, value } = e.target;

    if (fieldName && index !== null && subField) {
      const updatedArray = [...formData[fieldName]];
      updatedArray[index][subField] = value;
      setFormData((prev) => ({ ...prev, [fieldName]: updatedArray }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Add new qualification field
  const addQualificationField = () => {
    setFormData((prev) => ({
      ...prev,
      qualifications: [
        ...prev.qualifications,
        { title: "", collegeName: "", graduationYear: "", file: null },
      ],
    }));
  };

  // Remove qualification field
  const removeQualificationField = (index) => {
    const updatedDocs = formData.qualifications.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, qualifications: updatedDocs }));
  };

  // Add new appointment document
  const addAppointmentDocument = () => {
    setFormData((prev) => ({
      ...prev,
      appointmentDocuments: [
        ...prev.appointmentDocuments,
        { title: "", file: null },
      ],
    }));
  };

  // Remove appointment document
  const removeAppointmentDocument = (index) => {
    const updatedDocs = formData.appointmentDocuments.filter(
      (_, i) => i !== index,
    );
    setFormData((prev) => ({ ...prev, appointmentDocuments: updatedDocs }));
  };

  // Add new medical record
  const addMedicalRecord = () => {
    setFormData((prev) => ({
      ...prev,
      medicalRecords: [
        ...prev.medicalRecords,
        { title: "", certificate: null, issueDate: "" },
      ],
    }));
  };

  // Remove medical record
  const removeMedicalRecord = (index) => {
    const updatedRecords = formData.medicalRecords.filter(
      (_, i) => i !== index,
    );
    setFormData((prev) => ({ ...prev, medicalRecords: updatedRecords }));
  };

  // Add new vaccination record
  const addVaccinationRecord = () => {
    setFormData((prev) => ({
      ...prev,
      vaccinationRecords: [
        ...prev.vaccinationRecords,
        {
          name: "",
          date: "",
          file: null,
        },
      ],
    }));
  };

  // Remove vaccination record
  const removeVaccinationRecord = (index) => {
    const updatedRecords = formData.vaccinationRecords.filter(
      (_, i) => i !== index,
    );
    setFormData((prev) => ({ ...prev, vaccinationRecords: updatedRecords }));
  };

  // Add new training record
  const addTrainingRecord = () => {
    setFormData((prev) => ({
      ...prev,
      trainingRecords: [
        ...prev.trainingRecords,
        {
          title: "",
          inductionTraining: null,
          competencyTraining: null,
        },
      ],
    }));
  };

  // Remove training record
  const removeTrainingRecord = (index) => {
    const updatedRecords = formData.trainingRecords.filter(
      (_, i) => i !== index,
    );
    setFormData((prev) => ({ ...prev, trainingRecords: updatedRecords }));
  };

  // Handle form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation for required files
    if (!formData.passportPhoto?.file && !existingDocuments.passportPhoto) {
      alert("Passport Photo is required.");
      return;
    }
    if (!formData.cv && !existingDocuments.cv) {
      alert("Resume (CV) is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Helper to get either the new file or the existing path
      const getFileOrPath = (newFile, existingObj) => {
        if (newFile instanceof File) return newFile;
        // If it was already a processed object { file, name, preview } from handleFileChange
        if (newFile?.file instanceof File) return newFile.file;
        // Fallback to existing path if no new file is selected
        return existingObj?.path || "";
      };

      // Construct the data object for the service
      const submissionData = {
        staffId: initialData?.id || "",
        staffName: initialData?.name || "staff",
        passportPhoto: getFileOrPath(
          formData.passportPhoto,
          existingDocuments.passportPhoto,
        ),
        resume: getFileOrPath(formData.cv, existingDocuments.cv),

        qualifications: formData.qualifications
          .filter((q) => q.title || q.collegeName || q.graduationYear || q.file)
          .map((q, i) => ({
            documentTitle: q.title,
            collegeName: q.collegeName,
            graduationYear: q.graduationYear,
            file: getFileOrPath(q.file, existingDocuments.qualifications?.[i]),
          })),

        appointments: formData.appointmentDocuments
          .filter((a) => a.title || a.file)
          .map((a, i) => ({
            documentTitle: a.title,
            file: getFileOrPath(
              a.file,
              existingDocuments.appointmentDocuments?.[i],
            ),
          })),

        medicals: formData.medicalRecords
          .filter((m) => m.title || m.certificate || m.issueDate)
          .map((m, i) => ({
            recordTitle: m.title,
            issueDate: m.issueDate,
            file: getFileOrPath(
              m.certificate,
              existingDocuments.medicalRecords?.[i],
            ),
          })),

        vaccinations: formData.vaccinationRecords
          .filter((v) => v.name || v.date || v.file)
          .map((v, i) => ({
            certificateName: v.name,
            doseDate: v.date,
            file: getFileOrPath(
              v.file,
              existingDocuments.vaccinationRecords?.[i],
            ),
          })),

        trainings: formData.trainingRecords
          .filter((t) => t.title || t.inductionTraining || t.competencyTraining)
          .map((t, i) => ({
            trainingTitle: t.title,
            inductionFile: getFileOrPath(
              t.inductionTraining,
              existingDocuments.trainingRecords?.[i]?.inductionTraining,
            ),
            competencyFile: getFileOrPath(
              t.competencyTraining,
              existingDocuments.trainingRecords?.[i]?.competencyTraining,
            ),
          })),
      };

      console.log("Starting two-step submission flow...");
      const result = await staffService.submitStaffDocuments(submissionData);

      if (result) {
        alert("Documents submitted successfully!");
        console.log("Submission successful:", result);
      }
    } catch (error) {
      console.error("Error submitting documents:", error);
      const validationErrors = error.response?.data?.errors;
      if (validationErrors) {
        const errorMessages = Object.entries(validationErrors)
          .map(
            ([field, msgs]) =>
              `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`,
          )
          .join("\n");
        alert(`Validation errors:\n${errorMessages}`);
      } else {
        alert(
          "Failed to submit documents. " +
            (error.response?.data?.message || error.message),
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-linear-to-br from-slate-50 to-slate-100 min-h-screen">
      <DocumentFormHeader />

      <form onSubmit={handleSubmit} className="space-y-6">
        <PersonalDocuments
          formData={formData}
          existingDocuments={existingDocuments}
          handleFileChange={handleFileChange}
          handleFileRemove={handleFileRemove}
        />

        <QualificationDocuments
          formData={formData}
          existingDocuments={existingDocuments}
          handleFileChange={handleFileChange}
          handleFileRemove={handleFileRemove}
          handleInputChange={handleInputChange}
          addQualificationField={addQualificationField}
          removeQualificationField={removeQualificationField}
        />

        <AppointmentDocuments
          formData={formData}
          existingDocuments={existingDocuments}
          handleFileChange={handleFileChange}
          handleFileRemove={handleFileRemove}
          addAppointmentDocument={addAppointmentDocument}
          removeAppointmentDocument={removeAppointmentDocument}
        />

        <MedicalRecords
          formData={formData}
          existingDocuments={existingDocuments}
          handleFileChange={handleFileChange}
          handleFileRemove={handleFileRemove}
          handleInputChange={handleInputChange}
          addMedicalRecord={addMedicalRecord}
          removeMedicalRecord={removeMedicalRecord}
        />

        <VaccinationRecords
          formData={formData}
          existingDocuments={existingDocuments}
          handleFileChange={handleFileChange}
          handleFileRemove={handleFileRemove}
          handleInputChange={handleInputChange}
          addVaccinationRecord={addVaccinationRecord}
          removeVaccinationRecord={removeVaccinationRecord}
        />

        <TrainingRecords
          formData={formData}
          existingDocuments={existingDocuments}
          handleFileChange={handleFileChange}
          handleFileRemove={handleFileRemove}
          handleInputChange={handleInputChange}
          addTrainingRecord={addTrainingRecord}
          removeTrainingRecord={removeTrainingRecord}
        />

        <DocumentFormActions onSubmit={handleSubmit} loading={isSubmitting} />
      </form>
    </div>
  );
};

export default EmployeeDocumentsForm;
