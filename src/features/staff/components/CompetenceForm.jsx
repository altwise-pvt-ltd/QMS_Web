import React, { useState, useEffect } from "react";
import {
  FormHeader,
  EmployeeIdentification,
  SkillsMatrix,
  TrainingCertifications,
  AssessmentValidation,
  FormActions,
} from "./CompetenceFormComponents";

const CompetenceForm = ({ initialData }) => {
  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    // Section 1: Identification
    employeeName: "",
    employeeId: "",
    jobTitle: "",
    department: "",
    hireDate: "",
    phoneNo: "",

    // Section 3: Dynamic Lists
    skills: [
      { id: 1, name: "", requiredLevel: "3", actualLevel: "1", gap: true },
    ],
    certifications: [
      {
        id: 1,
        title: "",
        type: "Certification",
        completionDate: "",
        expiryDate: "",
      },
    ],

    // Section 4: Assessment
    overallStatus: "", // Competent, Needs Training, etc.
    skillGaps: "",
    assessorName: "Super Admin", // Auto-filled in real app
    assessmentDate: new Date().toISOString().split("T")[0],
  });

  // --- EFFECTS ---
  // Populate form when editing existing staff
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        employeeName: initialData.name || "",
        employeeId: initialData.id?.toString() || "",
        jobTitle: initialData.role || "",
        department: initialData.dept || "",
        phoneNo: initialData.phone || "",
        overallStatus: initialData.status || "",
      }));
    }
  }, [initialData]);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Generic handler for dynamic lists (Skills/Certs)
  const handleDynamicChange = (index, field, value, listName) => {
    const updatedList = [...formData[listName]];
    updatedList[index][field] = value;

    // Auto-calculate gap for skills
    if (
      listName === "skills" &&
      (field === "requiredLevel" || field === "actualLevel")
    ) {
      const req = parseInt(updatedList[index].requiredLevel) || 0;
      const act = parseInt(updatedList[index].actualLevel) || 0;
      updatedList[index].gap = act < req;
    }

    setFormData((prev) => ({ ...prev, [listName]: updatedList }));
  };

  const addRow = (listName, template) => {
    setFormData((prev) => ({
      ...prev,
      [listName]: [...prev[listName], { ...template, id: Date.now() }],
    }));
  };

  const removeRow = (index, listName) => {
    const updatedList = formData[listName].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [listName]: updatedList }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting ISO 9001 Record:", formData);
    // Add API call here
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-linear-to-br from-slate-50 to-slate-100 min-h-screen">
      <FormHeader />

      <form onSubmit={handleSubmit} className="space-y-8">
        <EmployeeIdentification
          formData={formData}
          handleInputChange={handleInputChange}
        />

        <SkillsMatrix
          skills={formData.skills}
          handleDynamicChange={handleDynamicChange}
          addRow={addRow}
          removeRow={removeRow}
        />

        <TrainingCertifications
          certifications={formData.certifications}
          handleDynamicChange={handleDynamicChange}
          addRow={addRow}
          removeRow={removeRow}
        />

        <AssessmentValidation
          formData={formData}
          handleInputChange={handleInputChange}
        />

        <FormActions assessmentDate={formData.assessmentDate} />
      </form>
    </div>
  );
};

export default CompetenceForm;
