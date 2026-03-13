import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import staffService from "./services/staffService";
import {
  ArrowLeft,
  UserCheck,
  FileText,
  Briefcase,
  Shield,
  Users,
  Plus,
  LayoutDashboard,
} from "lucide-react";

// Import sub-components
import StaffList from "./components/StaffList";
import CreateStaffForm from "./components/CreateStaffForm";
import CompetenceForm from "./components/CompetenceForm";
import StaffDocuments from "./components/StaffDocuments";
import PermissionsForm from "./components/PermissionsPage";
import EmployeeDocumentsForm from "./components/EmployeeDocumentsForm";
import ImageWithFallback from "../../components/ui/ImageWithFallback";

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

  // 5. Handle "Permissions" - Shows the permissions form
  const handlePermissions = (staff) => {
    setSelectedStaff(staff);
    setActiveTab("permissions");
    setView("details");
  };

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  // --- RENDER: LIST VIEW ---
  if (view === "list") {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="p-4 md:p-8 lg:p-10 w-full min-h-screen bg-slate-50/50 space-y-8"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 ring-4 ring-indigo-50">
                <Users className="text-white" size={24} />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Staff Directory
              </h1>
            </div>
            <p className="text-slate-500 font-medium md:ml-14">
              Real-time employee management, competence tracking & documentation
            </p>
          </div>

          <button
            onClick={handleStartCreate}
            className="group flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 transition-all text-sm whitespace-nowrap"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            Add New Staff
          </button>
        </div>

        <StaffList
          onAddNew={handleStartCreate}
          onEdit={handleEditBasic}
          onCompetence={handleCompetence}
          onPermissions={handlePermissions}
        />
      </motion.div>
    );
  }

  // --- RENDER: CREATE/EDIT BASIC INFO VIEW ---
  if (view === "create") {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen bg-slate-50 flex flex-col"
      >
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-5 flex items-center gap-6 sticky top-0 z-20 shadow-sm">
          <button
            onClick={handleBackToList}
            className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-all border border-transparent hover:border-slate-200"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-none mb-1">
              {selectedStaff ? "Edit Employee Profile" : "Register New Staff"}
            </h1>
            <p className="text-sm text-slate-500 font-semibold tracking-wide uppercase opacity-70">
              {selectedStaff ? `ID: ${selectedStaff.id}` : "Step 1: Core Identification"}
            </p>
          </div>
        </div>
        <div className="flex-1 p-6 md:p-8 lg:p-12 overflow-y-auto bg-slate-50/30">
          <div className="max-w-5xl mx-auto">
            <CreateStaffForm
              initialData={selectedStaff}
              onCancel={handleBackToList}
              onSubmit={(data) => {
                console.log("Staff data saved:", data);
                handleBackToList();
              }}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  // --- RENDER: DETAILS VIEW (Competence + Documents) ---
  const tabs = [
    { id: "competence", label: "Competence", icon: UserCheck },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "staffDetails", label: "Details", icon: Briefcase },
    { id: "permissions", label: "Permissions", icon: Shield },
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="p-0 w-full min-h-screen bg-slate-50 flex flex-col"
    >
      {/* Premium Header/Top Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 sticky top-0 z-20 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <button
              onClick={handleBackToList}
              className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-all border border-transparent hover:border-slate-200"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="flex items-center gap-4">
              <div className="relative group">
                {selectedStaff?.photo ? (
                  <ImageWithFallback
                    src={selectedStaff.photo}
                    alt={selectedStaff.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-4 ring-slate-100 shadow-md group-hover:shadow-lg transition-all"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md ring-4 ring-slate-100">
                    {selectedStaff?.name?.charAt(0) || "S"}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full shadow-sm" />
              </div>

              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">
                  {selectedStaff?.name || "Staff Member"}
                </h1>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-bold uppercase tracking-wider border border-slate-200">
                    ID: {selectedStaff?.id || "N/A"}
                  </span>
                  <span className="text-indigo-600 font-bold text-sm">
                    {selectedStaff?.role || "Position Not Assigned"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Animated Tab Switcher */}
          <div className="flex bg-slate-100/80 p-1 rounded-2xl border border-slate-200 relative overflow-hidden self-start lg:self-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all z-10 ${isActive ? "text-indigo-600" : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white shadow-sm border border-slate-200 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon size={16} className="relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 md:p-8 lg:p-10">
        <div className="max-w-[1400px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "competence" && (
                <CompetenceForm initialData={selectedStaff} />
              )}

              {activeTab === "documents" && (
                <div className="max-w-5xl mx-auto">
                  <StaffDocuments
                    staffName={selectedStaff?.name}
                    staffId={selectedStaff?.id}
                  />
                </div>
              )}

              {activeTab === "staffDetails" && (
                <div className="max-w-4xl mx-auto">
                  <EmployeeDocumentsForm initialData={selectedStaff} />
                </div>
              )}

              {activeTab === "permissions" && (
                <div className="max-w-4xl mx-auto py-4">
                  <PermissionsForm staff={selectedStaff} standalone={false} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default StaffModule;
