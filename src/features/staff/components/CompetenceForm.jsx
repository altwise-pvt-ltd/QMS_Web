import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Save,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const CompetenceForm = ({ initialData }) => {
  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    // Section 1: Identification
    employeeName: "",
    employeeId: "",
    jobTitle: "",
    department: "",
    hireDate: "",

    // Section 2: Baseline Qualifications
    educationLevel: "",
    educationDetails: "",
    workExperienceYears: "",
    experienceSummary: "",

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
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* HEADER */}
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <FileText className="text-white" size={28} />
          </div>
          Employee Competence Record
        </h1>
        <p className="text-blue-100 mt-2 text-sm">
          ISO 9001:2015 Clause 7.2 Compliant • Documented Information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: EMPLOYEE IDENTIFICATION */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-l-4 border-blue-500 pl-3">
            1. Employee Identification
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employee Name *
              </label>
              <input
                type="text"
                name="employeeName"
                required
                value={formData.employeeName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employee ID *
              </label>
              <input
                type="text"
                name="employeeId"
                required
                value={formData.employeeId}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hire Date
              </label>
              <input
                type="date"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border bg-white"
              >
                <option value="">Select Department</option>
                <option value="IT">IT / Engineering</option>
                <option value="HR">Human Resources</option>
                <option value="QA">Quality Assurance</option>
                <option value="OPS">Operations</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Job Title / Role
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: BASELINE QUALIFICATIONS */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-l-4 border-indigo-500 pl-3">
            2. Baseline Qualifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Highest Education
              </label>
              <select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border bg-white"
              >
                <option value="">Select Level</option>
                <option value="High School">High School</option>
                <option value="Bachelor">Bachelor's Degree</option>
                <option value="Master">Master's Degree</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Prior Experience (Years)
              </label>
              <input
                type="number"
                name="workExperienceYears"
                value={formData.workExperienceYears}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Education Details
              </label>
              <textarea
                name="educationDetails"
                rows="2"
                placeholder="e.g., B.E. Computer Science, University of Pune (2020)"
                value={formData.educationDetails}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
            </div>
          </div>
        </section>

        {/* SECTION 3: SKILLS MATRIX (DYNAMIC) */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700 border-l-4 border-purple-500 pl-3">
              3. Skills & Competency Matrix
            </h2>
            <button
              type="button"
              onClick={() =>
                addRow("skills", {
                  name: "",
                  requiredLevel: "3",
                  actualLevel: "1",
                  gap: true,
                })
              }
              className="text-sm bg-purple-600 text-black px-4 py-2 rounded-lg hover:bg-purple-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 font-medium shadow-sm"
            >
              <Plus size={16} /> Add Skill
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Skill Name
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Req. Level (1-5)
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Actual Level
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formData.skills.map((skill, index) => (
                  <tr key={skill.id}>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="e.g. Java Spring Boot"
                        value={skill.name}
                        onChange={(e) =>
                          handleDynamicChange(
                            index,
                            "name",
                            e.target.value,
                            "skills"
                          )
                        }
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm border p-1"
                      />
                    </td>
                    <td className="px-3 py-2 w-24">
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={skill.requiredLevel}
                        onChange={(e) =>
                          handleDynamicChange(
                            index,
                            "requiredLevel",
                            e.target.value,
                            "skills"
                          )
                        }
                        className="w-full border-gray-300 rounded-md border p-1"
                      />
                    </td>
                    <td className="px-3 py-2 w-24">
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={skill.actualLevel}
                        onChange={(e) =>
                          handleDynamicChange(
                            index,
                            "actualLevel",
                            e.target.value,
                            "skills"
                          )
                        }
                        className="w-full border-gray-300 rounded-md border p-1"
                      />
                    </td>
                    <td className="px-3 py-2">
                      {skill.gap ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                          <AlertCircle size={12} /> Gap
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                          <CheckCircle size={12} /> Competent
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => removeRow(index, "skills")}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors"
                        title="Remove skill"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 4: TRAINING & CERTS (DYNAMIC) */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700 border-l-4 border-green-500 pl-3">
              4. Training & Certifications
            </h2>
            <button
              type="button"
              onClick={() =>
                addRow("certifications", {
                  title: "",
                  type: "Internal",
                  completionDate: "",
                  expiryDate: "",
                })
              }
              className="text-sm bg-green-600 text-black px-4 py-2 rounded-lg hover:bg-green-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 font-medium shadow-sm"
            >
              <Plus size={16} /> Add Entry
            </button>
          </div>

          <div className="space-y-4">
            {formData.certifications.map((cert, index) => (
              <div
                key={cert.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-50 p-3 rounded"
              >
                <div className="md:col-span-4">
                  <label className="text-xs text-gray-500">
                    Training/Cert Title
                  </label>
                  <input
                    type="text"
                    value={cert.title}
                    onChange={(e) =>
                      handleDynamicChange(
                        index,
                        "title",
                        e.target.value,
                        "certifications"
                      )
                    }
                    className="w-full border-gray-300 rounded border p-1.5 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-500">Type</label>
                  <select
                    value={cert.type}
                    onChange={(e) =>
                      handleDynamicChange(
                        index,
                        "type",
                        e.target.value,
                        "certifications"
                      )
                    }
                    className="w-full border-gray-300 rounded border p-1.5 text-sm bg-white"
                  >
                    <option>Internal Training</option>
                    <option>External Course</option>
                    <option>Certification</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-500">
                    Completion Date
                  </label>
                  <input
                    type="date"
                    value={cert.completionDate}
                    onChange={(e) =>
                      handleDynamicChange(
                        index,
                        "completionDate",
                        e.target.value,
                        "certifications"
                      )
                    }
                    className="w-full border-gray-300 rounded border p-1.5 text-sm"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-xs text-gray-500">
                    Expiry (If any)
                  </label>
                  <input
                    type="date"
                    value={cert.expiryDate}
                    onChange={(e) =>
                      handleDynamicChange(
                        index,
                        "expiryDate",
                        e.target.value,
                        "certifications"
                      )
                    }
                    className="w-full border-gray-300 rounded border p-1.5 text-sm"
                  />
                </div>
                <div className="md:col-span-1 text-right pb-1">
                  <button
                    type="button"
                    onClick={() => removeRow(index, "certifications")}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors"
                    title="Remove entry"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: FINAL ASSESSMENT */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-l-4 border-red-500 pl-3">
            5. Assessment & Validation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Overall Competence Status
              </label>
              <select
                name="overallStatus"
                value={formData.overallStatus}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border bg-white"
              >
                <option value="">Select Status</option>
                <option value="Fully Competent">Fully Competent</option>
                <option value="Competent with Supervision">
                  Competent with Supervision
                </option>
                <option value="Training Required">
                  Not Competent / Training Required
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Assessor Name
              </label>
              <input
                type="text"
                name="assessorName"
                readOnly
                value={formData.assessorName}
                className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 cursor-not-allowed p-2 border text-gray-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Gap Analysis & Recommendations
              </label>
              <textarea
                name="skillGaps"
                rows="3"
                placeholder="Identify specific gaps and recommended training actions (ISO 7.2c)"
                value={formData.skillGaps}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border"
              />
            </div>
          </div>
        </section>

        {/* FOOTER ACTIONS */}
        <div className="flex justify-between items-center pt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky bottom-4">
          <div className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">Assessment Date:</span>{" "}
            {formData.assessmentDate}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 border border-transparent rounded-lg text-sm font-medium text-black bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 shadow-md"
            >
              <Save size={18} /> Save Record
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompetenceForm;
