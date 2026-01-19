import React, { useState } from "react";
import { ArrowLeft, UserCheck, FileText, Briefcase } from "lucide-react";

// Import sub-components
import StaffList from "./components/StaffList";
import CreateStaffForm from "./components/CreateStaffForm";
import CompetenceForm from "./components/CompetenceForm";
import StaffDocuments from "./components/StaffDocuments";
import EmployeeDocumentsForm from "./components/EmployeeDocumentsForm";

const StaffModule = () => {
  const [view, setView] = useState("list"); // 'list', 'create', or 'details'
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [activeTab, setActiveTab] = useState("competence"); // 'competence' or 'documents'

  // 1. Handle "Add New" - Shows create form
  const handleStartCreate = () => {
    setSelectedStaff(null);
    setView("create");
  };

  // 2. Handle "Edit" (Basic Info) - Re-use create form in edit mode
  const handleEditBasic = (staff) => {
    setSelectedStaff(staff);
    setView("create");
  };

  // 3. Handle "Competence" - Shows the big competence form
  const handleCompetence = (staff) => {
    setSelectedStaff(staff);
    setActiveTab("competence");
    setView("details");
  };

  // 4. Handle "Back to List"
  const handleBackToList = () => {
    setView("list");
    setSelectedStaff(null);
  };

  // --- RENDER: LIST VIEW ---
  if (view === "list") {
    return (
      <div className="p-6 min-h-screen bg-slate-50">
        <StaffList
          onAddNew={handleStartCreate}
          onEdit={handleEditBasic}
          onCompetence={handleCompetence}
        />
      </div>
    );
  }

  // --- RENDER: CREATE/EDIT BASIC INFO VIEW ---
  if (view === "create") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
          <button
            onClick={handleBackToList}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-[16px] font-bold text-gray-800">
              {selectedStaff ? "Edit Staff Info" : "Add New Staff"}
            </h1>
            <p className="text-[14px] text-gray-500">
              {selectedStaff
                ? `Update basic information for ${selectedStaff.name}`
                : "Enter basic employment details"}
            </p>
          </div>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          <CreateStaffForm
            initialData={selectedStaff}
            onCancel={handleBackToList}
            onSubmit={(data) => {
              console.log("Staff data:", data);
              handleBackToList();
            }}
          />
        </div>
      </div>
    );
  }

  // --- RENDER: DETAILS VIEW (Competence + Documents) ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Bar for Detail View */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToList}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-[16px] font-bold text-gray-800 ">
              {selectedStaff?.name || "Staff Member"}
            </h1>
            <p className="text-[14px] text-gray-500">
              {selectedStaff
                ? `ID: ${selectedStaff.id} • ${selectedStaff.role}`
                : "Competence & Documents"}
            </p>
          </div>
        </div>

        {/* Tabs Switcher */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("competence")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === "competence"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <UserCheck size={14} />
            Competence
          </button>

          <button
            onClick={() => setActiveTab("documents")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-all ${
              activeTab === "documents"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FileText size={14} />
            Documents
          </button>

          <button
            onClick={() => setActiveTab("staffDetails")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-all ${
              activeTab === "staffDetails"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Briefcase size={14} />
            Staff Details
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === "competence" && (
          <CompetenceForm initialData={selectedStaff} />
        )}

        {activeTab === "documents" && (
          <div className="max-w-4xl mx-auto">
            <StaffDocuments staffName={selectedStaff?.name} />
          </div>
        )}

        {activeTab === "staffDetails" && (
          <EmployeeDocumentsForm initialData={selectedStaff} />
        )}
      </div>
    </div>
  );
};

export default StaffModule;
