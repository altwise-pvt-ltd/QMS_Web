import React, { useState, useEffect } from "react";
import {
  FormHeader,
  EmployeeIdentification,
  SkillsMatrix,
  TrainingCertifications,
  AssessmentValidation,
  FormActions,
} from "./CompetenceFormComponents";

import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/slices/authSlice";
import staffCompetenceService from "../services/staffCompetenceService";

const CompetenceForm = ({ initialData }) => {
  const currentUser = useSelector(selectCurrentUser);
  const currentUserDisplayName = currentUser
    ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim()
    : "Super Admin";

  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    // Section 1: Identification
    employeeName: "",
    employeeId: "",
    jobTitle: "",
    department: "",
    mobileNumber: "",

    // Section 3: Dynamic Lists
    skills: [
      {
        staffSkillsAndCompetencyMatrixId: 0,
        skillName: "",
        requestLevel: "3",
        actualLevel: "1",
        gap: true,
      },
    ],
    certifications: [
      {
        staffTrainingAndCertificationId: 0,
        trainingOrCertificateTitle: "",
        trainingOrCertificateType: "Internal Training",
        completionDate: "",
        expiryDate: "",
        certificateFile: null,
        existingFilePath: "",
      },
    ],

    // Section 4: Assessment
    overallStatus: "Competent", // Competent, Needs Training, etc.
    skillGaps: "",
    assessorName: currentUserDisplayName,
    assessmentDate: new Date().toISOString().split("T")[0],
  });

  // --- EFFECTS ---
  // Populate form when editing existing staff
  useEffect(() => {
    if (initialData?.id) {
      loadDetailedCompetence(initialData.id);
    }
  }, [initialData]);

  const loadDetailedCompetence = async (staffId) => {
    try {
      setLoading(true);
      const data = await staffCompetenceService.getCompetenceByStaffId(staffId);

      if (data && data.staff) {
        const { staff, skills, trainings } = data;
        setFormData({
          employeeName:
            `${staff.firstName || ""} ${staff.lastName || ""}`.trim() ||
            initialData?.name ||
            "",
          employeeId:
            staff.staffId?.toString() || initialData?.id?.toString() || "",
          jobTitle: staff.jobTitle || initialData?.role || "",
          department: initialData?.dept || "",
          mobileNumber: staff.mobileNumber || initialData?.mobileNumber || "",

          overallStatus: staff.staffAssessmentCompetenceStatus || "Competent",
          skillGaps: staff.staffAssessmentRecommendations || "",
          assessorName: staff.staffAssessorName || currentUserDisplayName,
          assessmentDate:
            staff.assessmentDate?.split("T")[0] ||
            new Date().toISOString().split("T")[0],

          skills:
            skills && skills.length > 0
              ? skills.map((s) => ({
                  staffSkillsAndCompetencyMatrixId:
                    s.staffSkillsAndCompetencyMatrixId,
                  skillName: s.skillName,
                  requestLevel: s.requestLevel?.toString(),
                  actualLevel: s.actualLevel?.toString(),
                  gap: (s.actualLevel || 0) < (s.requestLevel || 0),
                }))
              : [
                  {
                    staffSkillsAndCompetencyMatrixId: 0,
                    skillName: "",
                    requestLevel: "3",
                    actualLevel: "1",
                    gap: true,
                  },
                ],

          certifications:
            trainings && trainings.length > 0
              ? trainings.map((t) => ({
                  staffTrainingAndCertificationId:
                    t.staffTrainingAndCertificationId,
                  trainingOrCertificateTitle: t.trainingOrCertificateTitle,
                  trainingOrCertificateType: t.trainingOrCertificateType,
                  completionDate: t.completionDate?.split("T")[0] || "",
                  expiryDate: t.expiryDate?.split("T")[0] || "",
                  certificateFile: null,
                  existingFilePath: t.trainingOrCertificateFilePath,
                }))
              : [
                  {
                    staffTrainingAndCertificationId: 0,
                    trainingOrCertificateTitle: "",
                    trainingOrCertificateType: "Internal Training",
                    completionDate: "",
                    expiryDate: "",
                    certificateFile: null,
                    existingFilePath: "",
                  },
                ],
        });
      }
    } catch (error) {
      console.error("Error loading detailed competence:", error);
    } finally {
      setLoading(false);
    }
  };

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
      (field === "requestLevel" || field === "actualLevel")
    ) {
      const req = parseInt(updatedList[index].requestLevel) || 0;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employeeId) {
      alert("No Staff ID found. Please select a staff first.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        staffId: formData.employeeId,
        staffName: formData.employeeName,
        staffAssessmentCompetenceStatus: formData.overallStatus,
        staffAssessorName: formData.assessorName,
        staffAssessmentRecommendations: formData.skillGaps,
        assessmentDate: formData.assessmentDate,
        skills: formData.skills.map((s) => ({
          staffSkillsAndCompetencyMatrixId:
            s.staffSkillsAndCompetencyMatrixId || 0,
          skillName: s.skillName,
          requestLevel: parseInt(s.requestLevel) || 0,
          actualLevel: parseInt(s.actualLevel) || 0,
        })),
        trainings: formData.certifications.map((c) => ({
          staffTrainingAndCertificationId:
            c.staffTrainingAndCertificationId || 0,
          trainingOrCertificateTitle: c.trainingOrCertificateTitle,
          trainingOrCertificateType: c.trainingOrCertificateType,
          certificateFile: c.certificateFile,
          existingFilePath: c.existingFilePath,
          completionDate: c.completionDate,
          expiryDate: c.expiryDate,
        })),
      };

      await staffCompetenceService.createCompetence(payload, (pct) => {
        console.log(`Saving progress: ${pct}%`);
      });

      alert("Competence record saved successfully!");
      // Optionally reload data to get new IDs
      loadDetailedCompetence(formData.employeeId);
    } catch (error) {
      console.error("Error saving competence:", error);
      alert("Failed to save competence record.");
    } finally {
      setSaving(false);
    }
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

        <FormActions
          assessmentDate={formData.assessmentDate}
          isSaving={saving}
        />
      </form>
    </div>
  );
};

export default CompetenceForm;
