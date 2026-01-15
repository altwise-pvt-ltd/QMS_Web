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
    }
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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-[600px]">
      {/* HEADER WITH STEPS */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">MRM Workspace</h2>
          <div className="space-x-2">
            <button onClick={onCancel} className="px-4 py-2 text-gray-600">
              Close
            </button>
            <button
              onClick={() => onSave(formData)}
              className="px-4 py-2 bg-blue-600 text-black rounded flex items-center gap-2"
            >
              <Save size={16} /> Save Progress
            </button>
          </div>
        </div>
        {/* WIZARD STEPS */}
        <div className="flex justify-between px-10 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 z-0"></div>
          {[
            { id: 1, label: "Schedule", icon: Calendar },
            { id: 2, label: "Gather Inputs", icon: FileBarChart },
            { id: 3, label: "Meeting (MoM)", icon: Users },
            { id: 4, label: "Outputs (Actions)", icon: CheckSquare },
          ].map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`relative z-10 flex flex-col items-center gap-1 bg-white px-2 ${
                activeStep === step.id
                  ? "text-blue-600 font-bold"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  activeStep === step.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <step.icon size={18} />
              </div>
              <span className="text-xs">{step.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-8">
        {activeStep === 1 && renderSchedule()}
        {activeStep === 2 && renderInputs()}
        {activeStep === 3 && renderExecution()}
        {activeStep === 4 && renderOutputs()}
      </div>

      {/* FOOTER NAV */}
      <div className="p-4 border-t flex justify-between bg-gray-50">
        <button
          disabled={activeStep === 1}
          onClick={() => setActiveStep((prev) => prev - 1)}
          className="px-4 py-2 text-gray-600 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={activeStep === 4}
          onClick={() => setActiveStep((prev) => prev + 1)}
          className="px-6 py-2 bg-indigo-600 text-black rounded hover:bg-indigo-700 disabled:opacity-50 disabled:bg-gray-400"
        >
          Next Step
        </button>
      </div>
    </div>
  );
};

export default MrmWorkflow;
