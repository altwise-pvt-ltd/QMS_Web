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

const EmployeeDocumentsForm = ({ initialData }) => {
  const [formData, setFormData] = useState({
    // Personal Documents
    passportPhoto: null,
    cv: null,

    // Qualification Documents (dynamic array)
    qualifications: [{ title: "", file: null }],

    // Appointment Documents (dynamic array)
    appointmentDocuments: [{ title: "", file: null }],

    // Medical Records (dynamic array)
    medicalRecords: [{ title: "", certificate: null, issueDate: "" }],

    // Vaccination Records (dynamic array)
    vaccinationRecords: [
      {
        title: "",
        covidCertificate: null,
        covidDate: "",
        hbsagCertificate: null,
        hbsagDose1Date: "",
        hbsagDose2Date: "",
        hbsagDose3Date: "",
        hbsagBoosterDate: "",
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
        // Add logic to populate from initialData when backend is ready
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
        subField === "competencyTraining" ||
        subField === "covidCertificate" ||
        subField === "hbsagCertificate"
      ) {
        updatedArray[index][subField] = file;
      } else if (subField === "title") {
        updatedArray[index].title = value;
      }
      setFormData((prev) => ({ ...prev, [fieldName]: updatedArray }));
    } else {
      // Handle single file uploads
      setFormData((prev) => ({ ...prev, [fieldName]: file }));
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
      qualifications: [...prev.qualifications, { title: "", file: null }],
    }));
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
          title: "",
          covidCertificate: null,
          covidDate: "",
          hbsagCertificate: null,
          hbsagDose1Date: "",
          hbsagDose2Date: "",
          hbsagDose3Date: "",
          hbsagBoosterDate: "",
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
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Employee Documents Data:", formData);
    // TODO: Implement API call to save documents
    // This will need to handle file uploads to your backend
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
          addQualificationField={addQualificationField}
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
          addTrainingRecord={addTrainingRecord}
          removeTrainingRecord={removeTrainingRecord}
        />

        <DocumentFormActions onSubmit={handleSubmit} />
      </form>
    </div>
  );
};

export default EmployeeDocumentsForm;
