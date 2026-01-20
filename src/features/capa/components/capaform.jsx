import React, { useState, useEffect } from 'react';
import { X, Plus, Upload, FileText, Calendar, CheckCircle2, AlertCircle, ArrowLeft, Send, ClipboardList, Info } from 'lucide-react';

// Import questions from quedata.js
import { CAPA_QUESTIONS } from '../quedata.js';

const SUBCATEGORY_MAP = {
  "Pre-Analytical": [
    "Sample rejection rate",
    "Patient identification errors",
    "Improper sample container / additive",
    "Sample integrity loss (hemolysis, clotting, leakage)",
    "Inadequate sample quantity",
    "Improper sample handling and transport",
    "Improper request / incomplete documentation"
  ],

  "Analytical": [
    "Internal Quality Control (IQC) failure",
    "Coefficient of Variation (CV%) outside limits",
    "External Quality Assessment (EQA / PT) failure",
    "Analyzer downtime",
    "Calibration overdue or failure",
    "Reagent lot-to-lot variation",
    "Repeat testing rate",
    "Delta check failures"
  ],

  "Post-Analytical": [
    "Turnaround Time (TAT) breach",
    "Critical value reporting delay",
    "Incorrect report issued",
    "Report amendments / corrections",
    "Transcription / data entry errors",
    "Report delivery delay",
    "Customer complaints",
    "Recall / corrective reports"
  ],
  "others": [

  ]

};


const DEPARTMENTS = [
  "Quality Assurance",
  "Pre-Analytical",
  "Analytical - Clinical Chemistry",
  "Analytical - Hematology",
  "Analytical - Microbiology",
  "Analytical - Immunology",
  "Post-Analytical",
  "Phlebotomy",
  "Sample Reception",
  "IT Support",
  "Management"
];

const QuestionPopup = ({ isOpen, onClose, questions, onSave, answers, onAddCustomQuestion }) => {
  const [localAnswers, setLocalAnswers] = useState({});
  const [newQuestionText, setNewQuestionText] = useState("");

  useEffect(() => {
    setLocalAnswers(answers || {});
  }, [answers, isOpen]);

  const handleAnswer = (index, value) => {
    setLocalAnswers(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const handleAddQuestionLocal = () => {
    if (newQuestionText.trim()) {
      onAddCustomQuestion(newQuestionText.trim());
      setNewQuestionText("");
    }
  };

  const handleSave = () => {
    onSave(localAnswers);
    onClose();
  };

  if (!isOpen) return null;

  const answeredCount = Object.keys(localAnswers).length;
  const totalQuestions = questions.length;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Add more questions</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Progress: {answeredCount} / {totalQuestions} answered
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-md transition-colors text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {questions.map((question, index) => (
            <div key={index} className="p-4 border rounded-lg bg-slate-50/50">
              <p className="text-slate-700 font-semibold mb-3">{index + 1}. {question}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleAnswer(index, 'yes')}
                  className={`flex-1 py-2 rounded-md text-sm font-bold transition-all border ${localAnswers[index] === 'yes'
                    ? 'bg-emerald-600 text-black border-emerald-600'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-500'
                    }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleAnswer(index, 'no')}
                  className={`flex-1 py-2 rounded-md text-sm font-bold transition-all border ${localAnswers[index] === 'no'
                    ? 'bg-rose-600 text-black border-rose-600'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-rose-500'
                    }`}
                >
                  No
                </button>
              </div>
            </div>
          ))}

          {/* Add Question Input */}
          <div className="border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50/30">
            <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Add custom question</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Type question here..."
                className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleAddQuestionLocal}
                className="px-4 py-2 bg-indigo-600 text-black rounded-md text-sm font-bold hover:bg-indigo-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-slate-900 text-black rounded-md text-sm font-bold hover:bg-black transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const CapaForm = ({ selectedNC, onViewHistory, onSubmit }) => {
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [customSubCategory, setCustomSubCategory] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionAnswers, setQuestionAnswers] = useState({});
  const [showQuestionPopup, setShowQuestionPopup] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetDate, setTargetDate] = useState('');
  const [department, setDepartment] = useState('');
  const [details, setDetails] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [preventiveAction, setPreventiveAction] = useState('');
  const [closureVerification, setClosureVerification] = useState('');
  const [responsibility, setResponsibility] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  // Pre-fill if selectedNC exists
  useEffect(() => {
    if (selectedNC) {
      setCategory(selectedNC.category || '');
      setSubCategory(selectedNC.subCategory || '');
      setDepartment(selectedNC.department || '');
      setResponsibility(selectedNC.reportedBy || '');
      setDetails(selectedNC.name || '');
    }
  }, [selectedNC]);

  useEffect(() => {
    if (category && subCategory && category !== "Other") {
      const dbQuestions = [...(CAPA_QUESTIONS[category]?.[subCategory] || [])];
      setQuestions(dbQuestions);
      setQuestionAnswers({});
    } else {
      setQuestions([]);
      setQuestionAnswers({});
    }
  }, [category, subCategory]);

  const handleAddCustomQuestion = (text) => {
    setQuestions(prev => [...prev, text]);
  };

  const handleSubmit = () => {
    if (!category || (!subCategory && !customSubCategory) || !department || !responsibility) {
      alert('Please fill in all required fields');
      return;
    }
    const formData = {
      category,
      subCategory: category === "Other" ? customSubCategory : subCategory,
      questions,
      questionAnswers,
      date,
      targetDate,
      department,
      details,
      rootCause,
      correctiveAction,
      preventiveAction,
      closureVerification,
      responsibility,
      uploadedFile: uploadedFile ? {
        fileName: uploadedFile.name,
        fileUrl: URL.createObjectURL(uploadedFile),
        fileSizeMB: (uploadedFile.size / (1024 * 1024)).toFixed(2)
      } : null,
      submittedAt: new Date().toISOString()
    };
    if (onSubmit) onSubmit(formData);
  };

  const subCategories = SUBCATEGORY_MAP[category] || [];
  const answeredCount = Object.keys(questionAnswers).length;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="w-full bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">

        {/* Header Bar */}
        <div className="px-8 py-5 border-b flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={onViewHistory}
              className="p-2 hover:bg-slate-100 rounded-md transition-colors text-slate-500"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-slate-800">
              CAPA Entry {selectedNC ? `#${selectedNC.issueNo}` : ''}
            </h1>
          </div>
          <button
            onClick={onViewHistory}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-md text-sm font-bold text-slate-600 transition-colors"
          >
            View History
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Top Row: Date and Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 block">Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 block">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all appearance-none bg-white font-medium"
              >
                <option value="">e.g., Pathology</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Category & Sub-Category Selection (Professional Integration) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 block">Primary Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all bg-white"
              >
                <option value="">Select Category</option>
                <option value="Pre-Analytical">Pre-Analytical</option>
                <option value="Analytical">Analytical</option>
                <option value="Post-Analytical">Post-Analytical</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 block">Sub-Category</label>
              {category === "Other" ? (
                <input
                  type="text"
                  value={customSubCategory}
                  onChange={(e) => setCustomSubCategory(e.target.value)}
                  placeholder="Specify other category..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              ) : (
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  disabled={!category}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white disabled:bg-slate-50"
                >
                  <option value="">Select Sub-Category</option>
                  {subCategories.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Checklist Trigger (Simple Link style) */}
          {category && (questions.length > 0 || subCategory || customSubCategory) && (
            <div className="flex items-center justify-between p-4 border border-slate-100 rounded-md bg-slate-50/50">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-slate-700">Audit Checklist: {answeredCount} / {questions.length} completed</span>
              </div>
              <button
                onClick={() => setShowQuestionPopup(true)}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-4"
              >
                Open Audit Evaluation
              </button>
            </div>
          )}

          {/* Details of Daily N.C. */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 block">Details of incident</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              placeholder="Describe the non-conformance..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none transition-all"
            />
          </div>

          {/* Root Cause */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 block">Root Cause</label>
            <textarea
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              rows={4}
              placeholder="Identify the root cause..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none transition-all"
            />
          </div>

          {/* Corrective / Preventive Action Taken */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 block">Corrective Action Taken</label>
            <textarea
              value={correctiveAction}
              onChange={(e) => setCorrectiveAction(e.target.value)}
              rows={4}
              placeholder="Describe actions taken..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 block">Preventive Action Taken</label>
            <textarea
              value={preventiveAction}
              onChange={(e) => setPreventiveAction(e.target.value)}
              rows={4}
              placeholder="Describe actions taken..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none transition-all"
            />
          </div>

          {/* Responsibility and Target Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 block">Responsibility</label>
              <input
                type="text"
                value={responsibility}
                onChange={(e) => setResponsibility(e.target.value)}
                placeholder="Person responsible"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 block">Target Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* Closure Verification */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 block">Closure Verification</label>
            <textarea
              value={closureVerification}
              onChange={(e) => setClosureVerification(e.target.value)}
              rows={4}
              placeholder="Verification details..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none transition-all"
            />
          </div>

          {/* File Upload Attachment */}
          <div className="flex items-center justify-between p-6 border border-slate-200 rounded-md bg-white border-dashed">
            <div className="flex items-center gap-4">
              <Upload className="w-6 h-6 text-slate-400" />
              <div>
                <p className="text-sm font-bold text-slate-700">{uploadedFile ? uploadedFile.name : 'No file attached'}</p>
                <p className="text-xs text-slate-400">Upload supporting evidence (PDF max 5MB)</p>
              </div>
            </div>
            <label className="px-4 py-2 border border-slate-300 rounded-md text-xs font-bold text-slate-600 cursor-pointer hover:bg-slate-50 transition-colors uppercase tracking-wider">
              {uploadedFile ? 'Change File' : 'Browse Files'}
              <input type="file" accept=".pdf" className="hidden" onChange={(e) => setUploadedFile(e.target.files[0])} />
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-10 py-3 bg-slate-900 text-black rounded-md font-bold text-base hover:bg-black transition-all shadow-sm active:scale-95 flex items-center gap-2"
            >
              Submit Form
            </button>
          </div>

        </div>
      </div>

      <QuestionPopup
        isOpen={showQuestionPopup}
        onClose={() => setShowQuestionPopup(false)}
        questions={questions}
        onSave={(ans) => setQuestionAnswers(ans)}
        answers={questionAnswers}
        onAddCustomQuestion={handleAddCustomQuestion}
      />
    </div>
  );
};

export default CapaForm;