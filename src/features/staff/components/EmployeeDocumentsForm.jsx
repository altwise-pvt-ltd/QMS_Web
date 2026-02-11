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
import { db } from "../../../db";
import staffService from "../services/staffService";

const EmployeeDocumentsForm = ({ initialData }) => {
  const [formData, setFormData] = useState({
    // ... (rest is same until handleSubmit)
    // Personal Documents
    passportPhoto: null,
    cv: null,

    // Qualification Documents (dynamic array)
    qualifications: [{ title: "", collegeName: "", graduationYear: "", file: null }],

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
  useEffect(() => {
    if (initialData) {
      // Populate with existing data if available
      setFormData((prev) => ({
        ...prev,
        passportPhoto: initialData.photo ? { name: "Current Photo", preview: initialData.photo } : null,
      }));
    }
  }, [initialData]);

  // Handle file changes
  const handleFileChange = (e, fieldName, index = null, subField = null) => {
    const file = e.target.files?.[0];
    const value = e.target.value;

    if (!file && !value) return;

    // Handle dynamic arrays (qualifications, appointmentDocuments, medicalRecords, vaccinationRecords, trainingRecords)
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
      } else if (subField === "title" || subField === "name") {
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

          // Auto-save to DB so header updates
          if (initialData?.id) {
            try {
              await db.staff.update(initialData.id, { photo: previewUrl });
              console.log("Profile photo updated in database");
            } catch (err) {
              console.error("Failed to update profile photo:", err);
            }
          }
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
      // Handle dynamic array field changes
      const updatedArray = [...formData[fieldName]];
      updatedArray[index][subField] = value;
      setFormData((prev) => ({ ...prev, [fieldName]: updatedArray }));
    } else {
      // Handle simple field changes
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
    setIsSubmitting(true);

    try {
      const data = new FormData();

      // Append basic fields if needed (assuming they are passed or part of this form)
      if (initialData?.id) {
        data.append("StaffId", initialData.id);
      }

      // 1. Personal Documents
      if (formData.passportPhoto?.file) {
        data.append("PassportPhoto", formData.passportPhoto.file);
      }
      if (formData.cv) {
        data.append("CV", formData.cv);
      }

      // Helper to append array of objects
      const appendArray = (array, prefix, fileField = "file") => {
        array.forEach((item, index) => {
          Object.keys(item).forEach((key) => {
            if (item[key]) {
              // Ensure we use the correct indexing syntax for ASP.NET Core / Standard Model Binding
              // e.g., Qualifications[0].Title
              if (key === fileField) {
                // For files, we might need a specific naming convention or just map them
                // often it's "Qualifications[0].File"
                data.append(`${prefix}[${index}].${key}`, item[key]);
              } else {
                data.append(`${prefix}[${index}].${key}`, item[key]);
              }
            }
          });
        });
      };

      // 2. Qualifications
      // formData.qualifications: { title, collegeName, graduationYear, file }
      appendArray(formData.qualifications, "Qualifications", "file");

      // 3. Appointment Documents
      // formData.appointmentDocuments: { title, file }
      appendArray(formData.appointmentDocuments, "AppointmentDocuments", "file");

      // 4. Medical Records
      // formData.medicalRecords: { title, certificate (file), issueDate }
      appendArray(formData.medicalRecords, "MedicalRecords", "certificate");

      // 5. Vaccination Records
      // formData.vaccinationRecords: { name, date, file }
      appendArray(formData.vaccinationRecords, "VaccinationRecords", "file");

      // 6. Training Records
      // formData.trainingRecords: { title, inductionTraining (file), competencyTraining (file) }
      // specific handling since it has multiple files
      formData.trainingRecords.forEach((item, index) => {
        data.append(`TrainingRecords[${index}].title`, item.title);
        if (item.inductionTraining) {
          data.append(`TrainingRecords[${index}].inductionTraining`, item.inductionTraining);
        }
        if (item.competencyTraining) {
          data.append(`TrainingRecords[${index}].competencyTraining`, item.competencyTraining);
        }
      });

      console.log("Submitting Employee Documents Data via API...");

      const response = await staffService.submitStaffDetails(data);

      if (response.data) {
        alert("Documents submitted successfully!");
        console.log("Response:", response.data);
      }

    } catch (error) {
      console.error("Error submitting documents:", error);
      alert("Failed to submit documents. " + (error.response?.data?.message || error.message));
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
          handleFileChange={handleFileChange}
          handleFileRemove={handleFileRemove}
        />

        <QualificationDocuments
          formData={formData}
          handleFileChange={handleFileChange}
          handleFileRemove={handleFileRemove}
          handleInputChange={handleInputChange}
          addQualificationField={addQualificationField}
          removeQualificationField={removeQualificationField}
        />

        <AppointmentDocuments
          formData={formData}
          handleFileChange={handleFileChange}
          handleFileRemove={handleFileRemove}
          addAppointmentDocument={addAppointmentDocument}
          removeAppointmentDocument={removeAppointmentDocument}
        />

        <MedicalRecords
          formData={formData}
          handleFileChange={handleFileChange}
          handleFileRemove={handleFileRemove}
          handleInputChange={handleInputChange}
          addMedicalRecord={addMedicalRecord}
          removeMedicalRecord={removeMedicalRecord}
        />

        <VaccinationRecords
          formData={formData}
          handleFileChange={handleFileChange}
          handleFileRemove={handleFileRemove}
          handleInputChange={handleInputChange}
          addVaccinationRecord={addVaccinationRecord}
          removeVaccinationRecord={removeVaccinationRecord}
        />

        <TrainingRecords
          formData={formData}
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
