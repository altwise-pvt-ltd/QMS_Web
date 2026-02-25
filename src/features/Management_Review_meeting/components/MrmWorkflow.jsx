// src/features/mrm/components/MrmWorkflow.jsx
import React, { useState } from "react";
import {
  Calendar,
  FileText,
  Users,
  CheckSquare,
  Save,
  PlayCircle,
  FileBarChart,
} from "lucide-react";

const MrmWorkflow = ({ initialData, onSave, onCancel }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState(
    initialData || {
      // 1. Schedule
      title: "",
      date: "",
      time: "",
      location: "",
      agenda: "",
      attendees: "", // Comma separated for demo

      // 2. Inputs (ISO 9001 Clause 9.3.2)
      inputAuditResults: "",
      inputCustomerFeedback: "",
      inputProcessPerformance: "",
      inputRisks: "",

      // 3. Execution (Minutes)
      discussionPoints: "",
      decisionsMade: "",

      // 4. Outputs (Action Items)
      actionItems: [],
    },
  );

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Helper to add Action Item
  const addActionItem = () => {
    const newItem = { id: Date.now(), task: "", owner: "", deadline: "" };
    setFormData((prev) => ({
      ...prev,
      actionItems: [...prev.actionItems, newItem],
    }));
  };

  const updateActionItem = (index, field, value) => {
    const updated = [...formData.actionItems];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, actionItems: updated }));
  };

  // --- RENDER STEPS ---

  // STEP 1: SCHEDULE
  const renderSchedule = () => (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
        Step 1: Schedule & Agenda
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Meeting Title
          </label>
          <input
            className="w-full border p-2 rounded"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="e.g. Q3 Management Review"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />
        </div>
        <div className="col-span-2">
          <label className="text-sm font-medium text-gray-700">
            Agenda Topics
          </label>
          <textarea
            className="w-full border p-2 rounded h-24"
            value={formData.agenda}
            onChange={(e) => handleChange("agenda", e.target.value)}
            placeholder="List the key topics to be discussed..."
          />
        </div>
        <div className="col-span-2">
          <label className="text-sm font-medium text-gray-700">
            Invite Attendees (Emails)
          </label>
          <input
            className="w-full border p-2 rounded"
            value={formData.attendees}
            onChange={(e) => handleChange("attendees", e.target.value)}
            placeholder="john@company.com, sarah@company.com"
          />
        </div>
      </div>
    </div>
  );

  // STEP 2: GATHER INPUTS
  const renderInputs = () => (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 mb-4">
        <strong>ISO 9001 Clause 9.3.2 Requirement:</strong> You must review
        these inputs before the meeting.
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">
            1. Audit Results Status
          </label>
          <textarea
            className="w-full border p-2 rounded h-20"
            placeholder="Summary of recent internal/external audits..."
            value={formData.inputAuditResults}
            onChange={(e) => handleChange("inputAuditResults", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">
            2. Customer Satisfaction & Feedback
          </label>
          <textarea
            className="w-full border p-2 rounded h-20"
            placeholder="Complaints trends, satisfaction survey results..."
            value={formData.inputCustomerFeedback}
            onChange={(e) =>
              handleChange("inputCustomerFeedback", e.target.value)
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">
            3. Process Performance & KPIs
          </label>
          <textarea
            className="w-full border p-2 rounded h-20"
            placeholder="Are we meeting our quality objectives?"
            value={formData.inputProcessPerformance}
            onChange={(e) =>
              handleChange("inputProcessPerformance", e.target.value)
            }
          />
        </div>
      </div>
    </div>
  );

  // STEP 3: EXECUTION (MOM)
  const renderExecution = () => (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
        Step 3: Minutes of Meeting
      </h3>
      <div>
        <label className="text-sm font-medium text-gray-700">
          Discussion Points Recorded
        </label>
        <textarea
          className="w-full border p-2 rounded h-40 font-mono text-sm"
          placeholder="- Discussed Q3 targets..."
          value={formData.discussionPoints}
          onChange={(e) => handleChange("discussionPoints", e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">
          Key Decisions Made
        </label>
        <textarea
          className="w-full border p-2 rounded h-24"
          placeholder="Decision 1: Hire two new QA staff..."
          value={formData.decisionsMade}
          onChange={(e) => handleChange("decisionsMade", e.target.value)}
        />
      </div>
    </div>
  );

  // STEP 4: OUTPUTS (ACTIONS)
  const renderOutputs = () => (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-lg font-semibold text-gray-800">
          Step 4: Action Items
        </h3>
        <button
          type="button"
          onClick={addActionItem}
          className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200"
        >
          + Add Action
        </button>
      </div>

      {formData.actionItems.length === 0 && (
        <p className="text-gray-400 text-sm italic py-4 text-center">
          No action items assigned yet.
        </p>
      )}

      {formData.actionItems.map((item, idx) => (
        <div
          key={item.id}
          className="flex gap-2 items-start bg-gray-50 p-2 rounded border"
        >
          <span className="mt-2 text-xs font-bold text-gray-500">
            {idx + 1}.
          </span>
          <input
            className="flex-1 border p-1 rounded text-sm"
            placeholder="What needs to be done?"
            value={item.task}
            onChange={(e) => updateActionItem(idx, "task", e.target.value)}
          />
          <input
            className="w-32 border p-1 rounded text-sm"
            placeholder="Owner"
            value={item.owner}
            onChange={(e) => updateActionItem(idx, "owner", e.target.value)}
          />
          <input
            type="date"
            className="w-32 border p-1 rounded text-sm"
            value={item.deadline}
            onChange={(e) => updateActionItem(idx, "deadline", e.target.value)}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 pt-6 lg:pt-10">
      {/* HEADER WITH STEPS */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-6 py-5 lg:px-12 flex flex-col gap-8 shrink-0">
        <div className="w-full flex justify-between items-center px-4 md:px-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              MRM Workspace
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Management Review Meeting Lifecycle
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 text-gray-500 font-semibold hover:text-gray-700 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onSave(formData)}
              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm font-bold flex items-center gap-2 active:scale-95"
            >
              <Save size={18} /> Save Progress
            </button>
          </div>
        </div>

        {/* WIZARD STEPS */}
        <div className="w-full px-4 md:px-8 relative pb-4">
          <div className="absolute top-6 left-0 w-full h-1 bg-gray-100 z-0 rounded-full"></div>
          <div className="flex justify-between relative px-2">
            {[
              { id: 1, label: "Schedule", icon: Calendar, color: "indigo" },
              {
                id: 2,
                label: "Gather Inputs",
                icon: FileBarChart,
                color: "blue",
              },
              { id: 3, label: "Meeting (MoM)", icon: Users, color: "purple" },
              {
                id: 4,
                label: "Outputs (Actions)",
                icon: CheckSquare,
                color: "emerald",
              },
            ].map((step) => {
              const isActive = activeStep === step.id;
              const isPast = activeStep > step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`relative z-10 flex flex-col items-center gap-3 transition-all group ${isActive
                      ? "scale-110"
                      : "grayscale opacity-70 hover:opacity-100 hover:grayscale-0"
                    }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all shadow-md ${isActive
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-indigo-200"
                        : isPast
                          ? "bg-green-100 border-green-200 text-green-600"
                          : "bg-white border-gray-200 text-gray-400"
                      }`}
                  >
                    {isPast ? <Check size={22} /> : <step.icon size={22} />}
                  </div>
                  <div className="flex flex-col items-center">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}`}
                    >
                      Step {step.id}
                    </span>
                    <span
                      className={`text-xs font-bold hidden md:block ${isActive ? "text-gray-900" : "text-gray-500"}`}
                    >
                      {step.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50">
        <div className="w-full p-6 lg:p-12">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden ring-1 ring-black/5">
            {activeStep === 1 && renderSchedule()}
            {activeStep === 2 && renderInputs()}
            {activeStep === 3 && renderExecution()}
            {activeStep === 4 && renderOutputs()}
          </div>
        </div>
      </div>

      {/* FOOTER NAV */}
      <div className="bg-white border-t border-gray-200 px-6 py-5 lg:px-12 shrink-0 shadow-xs">
        <div className="w-full flex justify-between items-center px-4 md:px-8">
          <button
            disabled={activeStep === 1}
            onClick={() => setActiveStep((prev) => prev - 1)}
            className="flex items-center gap-2 px-6 py-3 text-gray-500 font-bold hover:text-indigo-600 transition-colors disabled:opacity-30 disabled:hover:text-gray-500 group"
          >
            <Plus
              size={20}
              className="rotate-180 group-hover:-translate-x-1 transition-transform"
            />
            Previous Session
          </button>

          <div className="hidden md:flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
            Phase {activeStep} of 4
            <div className="w-24 h-1.5 bg-gray-100 rounded-full ml-4 overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${(activeStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          <button
            disabled={activeStep === 4}
            onClick={() => setActiveStep((prev) => prev + 1)}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-black rounded-2xl hover:bg-indigo-700 shadow-lg font-bold transition-all disabled:opacity-40 disabled:bg-gray-400 active:scale-95 group"
          >
            {activeStep === 4
              ? "Review Final Document"
              : "Continue to Next Phase"}
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MrmWorkflow;
