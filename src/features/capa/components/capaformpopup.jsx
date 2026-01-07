import React, { useState } from "react";
import {
  X,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
} from "lucide-react";
import { db } from "../../../db";

/* Question Types (Google Forms style) */
const QUESTION_TYPES = [
  { label: "Short answer", value: "text" },
  { label: "Paragraph", value: "textarea" },
  { label: "Multiple choice", value: "radio" },
  { label: "Checkboxes", value: "checkbox" },
  { label: "Dropdown", value: "dropdown" },
  { label: "Date", value: "date" },
];

const DEPARTMENTS = [
  "Quality Assurance",
  "Production",
  "Laboratory",
  "Maintenance",
  "HR",
  "Admin",
];

const createNewQuestion = () => ({
  id: Date.now() + Math.random(),
  title: "",
  type: "radio",
  required: false,
  options: ["Option 1"],
});

const CapaFormPopup = ({ onClose, onCreate }) => {
  const [formTitle, setFormTitle] = useState("");
  const [departments, setDepartments] = useState([]);
  const [questions, setQuestions] = useState([]);

  /* Toggle department */
  const toggleDepartment = (dept) => {
    setDepartments((prev) =>
      prev.includes(dept)
        ? prev.filter((d) => d !== dept)
        : [...prev, dept]
    );
  };

  /* Question handlers */
  const addQuestion = () =>
    setQuestions((prev) => [...prev, createNewQuestion()]);

  const removeQuestion = (id) =>
    setQuestions((prev) => prev.filter((q) => q.id !== id));

  const updateQuestion = (index, key, value) => {
    const updated = [...questions];
    updated[index][key] = value;
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push(
      `Option ${updated[qIndex].options.length + 1}`
    );
    setQuestions(updated);
  };

  const updateOption = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const removeOption = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(optIndex, 1);
    setQuestions(updated);
  };

  /* Save */
  const handleSave = async () => {
    if (!formTitle.trim()) {
      alert("Form title is required");
      return;
    }

    if (departments.length === 0) {
      alert("Select at least one department");
      return;
    }

    const newForm = {
      id: Date.now(),
      title: formTitle,
      departments,
      questions,
      createdAt: new Date().toISOString(),
    };

    try {
      // Save to Dexie (CAPA FORMS TABLE)
      await db.capa_forms.add(newForm);

      // Notify parent component if needed
      if (onCreate) {
        onCreate(newForm);
      }

      // Close popup
      onClose();
    } catch (error) {
      console.error("Error saving CAPA form:", error);
      alert("Failed to save form: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-start overflow-y-auto py-10">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">New CAPA Form</h2>
            <p className="text-sm text-slate-500">
              Build your custom form
            </p>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8">

          {/* Form Title */}
          <div>
            <input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Form title"
              className="w-full text-xl font-medium border-b border-slate-300 focus:outline-none focus:border-blue-500 py-2"
            />
          </div>

          {/* Departments */}
          <div>
            <p className="text-sm font-medium mb-2">
              Visible to Departments
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {DEPARTMENTS.map((d) => (
                <label
                  key={d}
                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm
                    ${departments.includes(d)
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "border-slate-200"
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={departments.includes(d)}
                    onChange={() => toggleDepartment(d)}
                  />
                  {d}
                </label>
              ))}
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {questions.map((q, qIndex) => (
              <div
                key={q.id}
                className="border rounded-xl p-4 bg-slate-50 relative"
              >
                <div className="flex gap-3">
                  <GripVertical className="mt-3 text-slate-300" />

                  <div className="flex-1 space-y-4">

                    {/* Question title + type */}
                    <div className="flex gap-3">
                      <input
                        value={q.title}
                        onChange={(e) =>
                          updateQuestion(qIndex, "title", e.target.value)
                        }
                        placeholder="Question"
                        className="flex-1 border-b bg-transparent focus:outline-none py-1"
                      />

                      <div className="relative">
                        <select
                          value={q.type}
                          onChange={(e) => updateQuestion(qIndex, "type", e.target.value)}
                          className="appearance-none border rounded-lg px-3 py-1 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                          {QUESTION_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>

                        <ChevronDown className="absolute right-2 top-2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Options */}
                    {(q.type === "radio" ||
                      q.type === "checkbox" ||
                      q.type === "dropdown") && (
                        <div className="space-y-2">
                          {q.options.map((opt, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2"
                            >
                              <span className="w-4 h-4 border rounded-full" />
                              <input
                                value={opt}
                                onChange={(e) =>
                                  updateOption(qIndex, i, e.target.value)
                                }
                                className="flex-1 border-b bg-transparent focus:outline-none"
                              />
                              <button
                                onClick={() =>
                                  removeOption(qIndex, i)
                                }
                              >
                                <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                              </button>
                            </div>
                          ))}

                          <button
                            onClick={() => addOption(qIndex)}
                            className="text-blue-600 text-sm"
                          >
                            + Add option
                          </button>
                        </div>
                      )}

                    {/* Required */}
                    <div className="flex justify-end items-center gap-2">
                      <span className="text-sm text-slate-500">
                        Required
                      </span>
                      <input
                        type="checkbox"
                        checked={q.required}
                        onChange={(e) =>
                          updateQuestion(
                            qIndex,
                            "required",
                            e.target.checked
                          )
                        }
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => removeQuestion(q.id)}
                    className="border rounded-xl p-4 bg-white hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-slate-400 hover:text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Question */}
          <button
            onClick={addQuestion}
            disabled={!formTitle || departments.length === 0}
            className={`w-full py-3 rounded-xl border-2 border-dashed text-sm font-medium
              ${!formTitle || departments.length === 0
                ? "border-slate-200 text-slate-300 cursor-not-allowed"
                : "border-slate-300 hover:border-blue-500 hover:text-blue-600"
              }
            `}
          >
            <Plus className="inline w-4 h-4 mr-2" />
            Add Question
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Create Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default CapaFormPopup;