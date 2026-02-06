import React, { useState, useEffect } from 'react';
import { X, Plus, Upload, FileText, Calendar, CheckCircle2, AlertCircle, ArrowLeft, Send, ClipboardList, Info, Users, UserPlus } from 'lucide-react';
import { db } from '../../../db';

// Import questions from quedata.js
import { CAPA_QUESTIONS } from '../quedata.js';

const SUBCATEGORY_MAP = {
  "Pre-Analytical": [
    "Vein puncture failure",
    "Typographic error",
    "Wrong sample identification",
    "Incomplete form",
    "Sample labeling error"
  ],
  "Analytical": [
    "Wrong sample processed",
    "Random error",
    "Systematic error",
    "IQC failure",
    "EQAS failure"
  ],
  "Post-Analytical": [
    "Printing error",
    "Urgent sample report",
    "Critical value reporting",
    "Turnaround time (TAT)",
    "Improper report dispatch"
  ],
  "others": []
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
  const [selectedSuggestions, setSelectedSuggestions] = useState({});
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionSuggestions, setNewQuestionSuggestions] = useState({ rootCause: '', correctiveAction: '', preventiveAction: '' });

  useEffect(() => {
    setLocalAnswers(answers || {});
    // Initialize suggestions selection: if an answer is present, enable its suggestions by default
    const initialSugg = {};
    if (answers) {
      Object.keys(answers).forEach(idx => {
        initialSugg[idx] = { rc: true, ca: true, pa: true };
      });
    }
    setSelectedSuggestions(initialSugg);
  }, [answers, isOpen, questions]);

  const handleAnswer = (index, value) => {
    setLocalAnswers(prev => ({
      ...prev,
      [index]: value
    }));

    // Always enable suggestions when an answer is selected (Yes or No)
    setSelectedSuggestions(prev => ({
      ...prev,
      [index]: { rc: true, ca: true, pa: true }
    }));
  };

  const toggleSuggestion = (index, type) => {
    setSelectedSuggestions(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [type]: !prev[index]?.[type]
      }
    }));
  };

  const handleAddQuestionLocal = () => {
    if (newQuestionText.trim()) {
      onAddCustomQuestion({
        question: newQuestionText.trim(),
        suggestionsNo: {
          rootCause: newQuestionSuggestions.rootCause.trim(),
          correctiveAction: newQuestionSuggestions.correctiveAction.trim(),
          preventiveAction: newQuestionSuggestions.preventiveAction.trim()
        }
      });
      setNewQuestionText("");
      setNewQuestionSuggestions({ rootCause: '', correctiveAction: '', preventiveAction: '' });
    }
  };

  const handleSave = () => {
    onSave(localAnswers, selectedSuggestions);
    onClose();
  };

  if (!isOpen) return null;

  const answeredCount = Object.keys(localAnswers).length;
  const totalQuestions = questions.length;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-100 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Audit Questionnaire</h2>
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {questions.map((question, index) => {
            const answer = localAnswers[index];
            const suggs = selectedSuggestions[index];
            const activeSuggestions = answer === 'yes' ? question.suggestionsYes : (answer === 'no' ? question.suggestionsNo : null);

            return (
              <div key={index} className="p-4 border rounded-xl bg-white shadow-sm border-slate-200">
                <p className="text-slate-800 font-bold mb-4">{index + 1}. {question.question || question}</p>
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => handleAnswer(index, 'yes')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-black transition-all border-2 ${answer === 'yes'
                      ? 'bg-emerald-100 text-emerald-700 border-emerald-500'
                      : 'bg-white border-slate-100 text-slate-500 hover:border-emerald-500/30'
                      }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleAnswer(index, 'no')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-black transition-all border-2 ${answer === 'no'
                      ? 'bg-rose-100 text-rose-700 border-rose-500'
                      : 'bg-white border-slate-100 text-slate-500 hover:border-rose-500/30'
                      }`}
                  >
                    No
                  </button>
                </div>

                {/* Dynamic Suggestion Section */}
                {answer && activeSuggestions && (
                  <div className={`mt-4 p-4 rounded-lg border space-y-3 animate-in fade-in slide-in-from-top-2 duration-300 ${answer === 'yes'
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-rose-50 border-rose-200'
                    }`}>
                    <div className={`flex items-center gap-2 mb-1 ${answer === 'yes' ? 'text-emerald-800' : 'text-rose-800'}`}>
                      <Info className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-wider">Suggested CAPA Actions for "{answer.toUpperCase()}"</span>
                    </div>

                    {[
                      { type: 'rc', label: 'Root Cause', text: activeSuggestions.rootCause },
                      { type: 'ca', label: 'Corrective Action', text: activeSuggestions.correctiveAction },
                      { type: 'pa', label: 'Preventive Action', text: activeSuggestions.preventiveAction }
                    ].map(item => (
                      <div
                        key={item.type}
                        onClick={() => toggleSuggestion(index, item.type)}
                        className={`p-3 rounded-md border cursor-pointer transition-all ${suggs?.[item.type]
                          ? `bg-white shadow-sm ${answer === 'yes' ? 'border-emerald-300' : 'border-rose-300'}`
                          : 'bg-slate-50/50 border-transparent opacity-60'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-black uppercase ${answer === 'yes' ? 'text-emerald-600' : 'text-rose-600'}`}>{item.label}</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${suggs?.[item.type]
                            ? `${answer === 'yes' ? 'bg-emerald-500 border-emerald-500' : 'bg-rose-500 border-rose-500'} text-white`
                            : 'border-slate-300'
                            }`}>
                            {suggs?.[item.type] && <CheckCircle2 className="w-3 h-3" />}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed italic">"{item.text}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Question Input */}
          <div className="border border-dashed border-slate-300 rounded-xl p-6 bg-slate-50/30">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Add supplementary audit query</label>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Type additional question here..."
                  className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 font-medium"
                />
                <button
                  onClick={handleAddQuestionLocal}
                  className="px-6 py-2 bg-indigo-600 text-black rounded-lg text-sm font-black hover:bg-indigo-700 transition-colors shadow-sm active:scale-95"
                >
                  Add
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Suggest Root Cause (Optional)</span>
                  <textarea
                    value={newQuestionSuggestions.rootCause}
                    onChange={(e) => setNewQuestionSuggestions(prev => ({ ...prev, rootCause: e.target.value }))}
                    placeholder="e.g., Training gap..."
                    rows={2}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 font-medium resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Suggest Corrective Action</span>
                  <textarea
                    value={newQuestionSuggestions.correctiveAction}
                    onChange={(e) => setNewQuestionSuggestions(prev => ({ ...prev, correctiveAction: e.target.value }))}
                    placeholder="e.g., Immediate retrain..."
                    rows={2}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 font-medium resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Suggest Preventive Action</span>
                  <textarea
                    value={newQuestionSuggestions.preventiveAction}
                    onChange={(e) => setNewQuestionSuggestions(prev => ({ ...prev, preventiveAction: e.target.value }))}
                    placeholder="e.g., Update SOP..."
                    rows={2}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 font-medium resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-slate-50 flex justify-between items-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight italic">
            Suggestions will automatically be applied to the CAPA form upon saving.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-2 bg-slate-900 text-black rounded-lg text-sm font-black hover:bg-black transition-all shadow-lg active:scale-95"
            >
              Apply to Form
            </button>
          </div>
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
  const [effectiveness, setEffectiveness] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [preventiveAction, setPreventiveAction] = useState('');
  const [closureVerification, setClosureVerification] = useState('');
  const [responsibility, setResponsibility] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [taggedStaff, setTaggedStaff] = useState([]);
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [staffSearch, setStaffSearch] = useState('');

  // Fetch staff list
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const staff = await db.staff.toArray();
        setStaffList(staff);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };
    fetchStaff();
  }, []);

  // Pre-fill if selectedNC exists
  useEffect(() => {
    if (selectedNC) {
      setCategory(selectedNC.category || '');
      setSubCategory(selectedNC.subCategory || '');
      setDepartment(selectedNC.department || '');
      setResponsibility(selectedNC.reportedBy || '');
      setDetails(selectedNC.name || '');
      setEffectiveness(selectedNC.effectiveness || '');
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

  const handleAddCustomQuestion = (questionObj) => {
    setQuestions(prev => [...prev, questionObj]);
  };

  const handleSaveAudit = (ans, suggConfig) => {
    setQuestionAnswers(ans);

    // Detailed Suggestion Flow Logic
    const finalSuggestions = {
      rc: [],
      ca: [],
      pa: []
    };

    questions.forEach((q, idx) => {
      const userAns = ans[idx];
      const userChoices = suggConfig[idx]; // { rc: bool, ca: bool, pa: bool }
      const activeSuggestions = userAns === 'yes' ? q.suggestionsYes : (userAns === 'no' ? q.suggestionsNo : null);

      if (userAns && activeSuggestions && userChoices) {
        if (userChoices.rc && activeSuggestions.rootCause) finalSuggestions.rc.push(activeSuggestions.rootCause);
        if (userChoices.ca && activeSuggestions.correctiveAction) finalSuggestions.ca.push(activeSuggestions.correctiveAction);
        if (userChoices.pa && activeSuggestions.preventiveAction) finalSuggestions.pa.push(activeSuggestions.preventiveAction);
      }
    });

    // Smart merge: Append only unique suggestions to current form fields
    const merge = (current, additions) => {
      if (additions.length === 0) return current;
      const existing = current ? current.split('\n') : [];
      const combined = [...new Set([...existing, ...additions])].filter(Boolean);
      return combined.join('\n');
    };

    setRootCause(prev => merge(prev, finalSuggestions.rc));
    setCorrectiveAction(prev => merge(prev, finalSuggestions.ca));
    setPreventiveAction(prev => merge(prev, finalSuggestions.pa));
  };

  const handleSubmit = () => {
    if (!category || (!subCategory && !customSubCategory) || !department || !responsibility) {
      alert('Please fill in all required fields');
      return;
    }
    const formData = {
      category,
      subCategory: category === "Other" ? customSubCategory : subCategory,
      questions: questions.map(q => q.question || q), // Keep backward compatibility for storage
      questionAnswers,
      date,
      targetDate,
      department,
      details,
      effectiveness,
      rootCause,
      correctiveAction,
      preventiveAction,
      closureVerification,
      responsibility,
      taggedStaff,
      uploadedFiles: uploadedFiles.map(file => ({
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        fileSizeMB: (file.size / (1024 * 1024)).toFixed(2)
      })),
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

          {/* Effectiveness */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 block">Effectiveness</label>
            <textarea
              value={effectiveness}
              onChange={(e) => setEffectiveness(e.target.value)}
              rows={4}
              placeholder="Describe the effectiveness..."
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

          {/* Tag Staff */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Users className="w-4 h-4" /> Tag Staff involved in incident
            </label>
            <div className="relative">
              <div className="min-h-11.25 w-full px-4 py-1.5 border border-slate-200 rounded-md focus-within:ring-1 focus-within:ring-slate-400 transition-all bg-white flex flex-wrap gap-2 items-center">
                {taggedStaff.map(staff => (
                  <span key={staff.id} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold border border-slate-200">
                    {staff.name}
                    <button
                      onClick={() => setTaggedStaff(prev => prev.filter(s => s.id !== staff.id))}
                      className="hover:text-rose-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder={taggedStaff.length === 0 ? "Search staff to tag..." : ""}
                  className="flex-1 min-w-30 outline-none text-sm bg-transparent"
                  value={staffSearch}
                  onChange={(e) => {
                    setStaffSearch(e.target.value);
                    setShowStaffDropdown(true);
                  }}
                  onFocus={() => setShowStaffDropdown(true)}
                />
              </div>

              {showStaffDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowStaffDropdown(false)}
                  ></div>
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-xl z-20 max-h-60 overflow-y-auto">
                    {staffList
                      .filter(s =>
                        s.name.toLowerCase().includes(staffSearch.toLowerCase()) &&
                        !taggedStaff.some(ts => ts.id === s.id)
                      )
                      .map(staff => (
                        <button
                          key={staff.id}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 flex items-center justify-between group transition-colors"
                          onClick={() => {
                            setTaggedStaff(prev => [...prev, staff]);
                            setStaffSearch('');
                            setShowStaffDropdown(false);
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">{staff.name}</span>
                            <span className="text-[10px] text-slate-500 uppercase">{staff.role} • {staff.dept}</span>
                          </div>
                          <UserPlus className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                        </button>
                      ))}
                    {staffList.filter(s =>
                      s.name.toLowerCase().includes(staffSearch.toLowerCase()) &&
                      !taggedStaff.some(ts => ts.id === s.id)
                    ).length === 0 && (
                        <div className="px-4 py-8 text-center text-slate-400 text-sm italic">
                          No matching staff found
                        </div>
                      )}
                  </div>
                </>
              )}
            </div>
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
                className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all font-medium"
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Upload className="w-4 h-4" /> Supporting Evidence
                <span className="text-xs font-normal text-slate-400">(Max 3 files, PDF only)</span>
              </label>
              {uploadedFiles.length < 3 && (
                <label className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md text-xs font-black cursor-pointer hover:bg-indigo-100 transition-colors uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Add File
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setUploadedFiles(prev => [...prev, file]);
                      }
                      e.target.value = ''; // Reset input
                    }}
                  />
                </label>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3">
              {uploadedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:border-slate-300 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700 truncate max-w-50 md:max-w-md">{file.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}
                    className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}

              {uploadedFiles.length === 0 && (
                <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-slate-400">
                  <Upload className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-sm font-medium">No files attached</p>
                  <p className="text-[10px] uppercase font-black mt-1">Upload supporting documentation</p>
                </div>
              )}
            </div>
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
        onSave={handleSaveAudit}
        answers={questionAnswers}
        onAddCustomQuestion={handleAddCustomQuestion}
      />
    </div>
  );
};

export default CapaForm;