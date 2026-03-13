import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Upload,
  FileText,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Send,
  ClipboardList,
  Info,
  Users,
  UserPlus,
} from "lucide-react";
import { getDepartments } from "../../department/services/departmentService";
import staffService from "../../staff/services/staffService";
import { ncService } from "../../NC/services/ncService";
import { capaService } from "../services/capaService";

const SUBCATEGORY_MAP = {
  "Pre-Analytical": [
    "Vein puncture failure",
    "Typographic error",
    "Wrong sample identification",
    "Incomplete form",
    "Sample labeling error",
  ],
  Analytical: [
    "Wrong sample processed",
    "Random error",
    "Systematic error",
    "IQC failure",
    "EQAS failure",
  ],
  "Post-Analytical": [
    "Printing error",
    "Urgent sample report",
    "Critical value reporting",
    "Turnaround time (TAT)",
    "Improper report dispatch",
  ],
  others: [],
}; // Preserved for backwards compatibility with any remaining imports, though we fetch live now.

const QuestionPopup = ({
  isOpen,
  onClose,
  questions,
  onSave,
  answers,
  onAddCustomQuestion,
  onAnswerSelected,
}) => {
  const [localAnswers, setLocalAnswers] = useState({});
  const [selectedSuggestions, setSelectedSuggestions] = useState({});
  const [newQuestionText, setNewQuestionText] = useState("");
  // Stores manual entry for custom questions: { index: { rootCause, correctiveAction, preventiveAction } }
  const [customSuggestions, setCustomSuggestions] = useState({});

  useEffect(() => {
    if (isOpen) {
      setLocalAnswers(answers || {});
      // Initialize suggestions selection: if an answer is present, enable its suggestions by default
      const initialSugg = {};
      if (answers) {
        Object.keys(answers).forEach((idx) => {
          initialSugg[idx] = { rc: true, ca: true, pa: true };
        });
      }
      setSelectedSuggestions(initialSugg);
    }
  }, [isOpen]);

  const handleAnswer = (index, value) => {
    setLocalAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));

    // For pre-built questions, enable selection by default
    // For custom questions, we'll use the customSuggestions state
    setSelectedSuggestions((prev) => ({
      ...prev,
      [index]: { rc: true, ca: true, pa: true },
    }));

    // Trigger external fetch mechanism for dynamic API questions
    if (onAnswerSelected) {
      onAnswerSelected(index, value);
    }
  };

  const toggleSuggestion = (index, type) => {
    setSelectedSuggestions((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [type]: !prev[index]?.[type],
      },
    }));
  };

  const handleAddQuestionLocal = () => {
    if (newQuestionText.trim()) {
      onAddCustomQuestion({
        question: newQuestionText.trim(),
        isCustom: true,
        suggestionsYes: null,
        suggestionsNo: null,
      });
      setNewQuestionText("");
    }
  };

  const handleSave = () => {
    onSave(localAnswers, selectedSuggestions, customSuggestions, questions);
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
            <h2 className="text-xl font-bold text-slate-800">
              Audit Questionnaire
            </h2>
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
            const isCustom = question.isCustom === true;
            const activeSuggestions = isCustom
              ? null
              : answer === "yes"
                ? question.suggestionsYes
                : answer === "no"
                  ? question.suggestionsNo
                  : null;

            console.log(`[QuestionPopup Render] Index: ${index}, answer: ${answer}, suggestionsYes:`, question.suggestionsYes, `activeSuggestions:`, activeSuggestions);

            return (
              <div
                key={index}
                className="p-4 border rounded-xl bg-white shadow-sm border-slate-200"
              >
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-slate-800 font-bold">
                    {index + 1}. {question.question || question.capaQuestion || question}
                  </p>
                  {isCustom && (
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-500 rounded-full border border-indigo-100">
                      Custom
                    </span>
                  )}
                </div>
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => handleAnswer(index, "yes")}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-black transition-all border-2 ${answer === "yes"
                      ? "bg-emerald-100 text-emerald-700 border-emerald-500"
                      : "bg-white border-slate-100 text-slate-500 hover:border-emerald-500/30"
                      }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleAnswer(index, "no")}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-black transition-all border-2 ${answer === "no"
                      ? "bg-rose-100 text-rose-700 border-rose-500"
                      : "bg-white border-slate-100 text-slate-500 hover:border-rose-500/30"
                      }`}
                  >
                    No
                  </button>
                </div>

                {/* Loading state for suggestions */}
                {question.isLoadingSuggestions && (
                  <div className="flex items-center gap-2 text-indigo-500 my-2 text-sm italic">
                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    Fetching suggestions...
                  </div>
                )}

                {/* Pre-built Suggestion Section */}
                {!isCustom && answer && activeSuggestions && (
                  <div
                    className={`mt-4 p-4 rounded-lg border space-y-3 animate-in fade-in slide-in-from-top-2 duration-300 ${answer === "yes"
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-rose-50 border-rose-200"
                      }`}
                  >
                    {activeSuggestions._empty ? (
                      <div className="flex items-center gap-2 text-slate-500 italic text-sm py-2">
                        <AlertCircle className="w-4 h-4" />
                        No pre-built suggestions available for this answer.
                      </div>
                    ) : (
                      <>
                        <div
                          className={`flex items-center gap-2 mb-1 ${answer === "yes" ? "text-emerald-800" : "text-rose-800"}`}
                        >
                          <Info className="w-4 h-4" />
                          <span className="text-xs font-black uppercase tracking-wider">
                            Suggested CAPA Actions for "{answer.toUpperCase()}"
                          </span>
                        </div>

                        {[
                          {
                            type: "rc",
                            label: "Root Cause",
                            text: activeSuggestions.rootCause,
                          },
                          {
                            type: "ca",
                            label: "Corrective Action",
                            text: activeSuggestions.correctiveAction,
                          },
                          {
                            type: "pa",
                            label: "Preventive Action",
                            text: activeSuggestions.preventiveAction,
                          },
                        ].map((item) => (
                          <div
                            key={item.type}
                            onClick={() => toggleSuggestion(index, item.type)}
                            className={`p-3 rounded-md border cursor-pointer transition-all ${suggs?.[item.type]
                              ? `bg-white shadow-sm ${answer === "yes" ? "border-emerald-300" : "border-rose-300"}`
                              : "bg-slate-50/50 border-transparent opacity-60"
                              }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span
                                className={`text-[10px] font-black uppercase ${answer === "yes" ? "text-emerald-600" : "text-rose-600"}`}
                              >
                                {item.label}
                              </span>
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${suggs?.[item.type]
                                  ? `${answer === "yes" ? "bg-emerald-500 border-emerald-500" : "bg-rose-500 border-rose-500"} text-gray-600`
                                  : "border-slate-300"
                                  }`}
                              >
                                {suggs?.[item.type] && (
                                  <CheckCircle2 className="w-3 h-3" />
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed italic">
                              "{item.text}"
                            </p>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}

                {/* Custom Question Entry Section */}
                {isCustom && answer && (
                  <div
                    className={`mt-4 p-4 rounded-lg border space-y-3 animate-in fade-in slide-in-from-top-2 duration-300 ${answer === "yes"
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-rose-50 border-rose-200"
                      }`}
                  >
                    <div
                      className={`flex items-center gap-2 mb-1 ${answer === "yes" ? "text-emerald-800" : "text-rose-800"}`}
                    >
                      <Info className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-wider">
                        Enter your CAPA notes for "{answer.toUpperCase()}"
                      </span>
                    </div>

                    {[
                      {
                        key: "rootCause",
                        label: "Root Cause",
                        placeholder: "e.g., Training gap...",
                      },
                      {
                        key: "correctiveAction",
                        label: "Corrective Action",
                        placeholder: "e.g., Immediate retraining...",
                      },
                      {
                        key: "preventiveAction",
                        label: "Preventive Action",
                        placeholder: "e.g., Update SOP...",
                      },
                    ].map((item) => (
                      <div key={item.key} className="space-y-1">
                        <span
                          className={`text-[10px] font-black uppercase ${answer === "yes" ? "text-emerald-600" : "text-rose-600"}`}
                        >
                          {item.label}
                        </span>
                        <textarea
                          value={customSuggestions[index]?.[item.key] || ""}
                          onChange={(e) =>
                            setCustomSuggestions((prev) => ({
                              ...prev,
                              [index]: {
                                ...prev[index],
                                [item.key]: e.target.value,
                              },
                            }))
                          }
                          placeholder={item.placeholder}
                          rows={2}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-400 font-medium resize-none text-slate-800"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="border border-dashed border-slate-300 rounded-xl p-6 bg-slate-50/30">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">
              Add supplementary audit query
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddQuestionLocal()}
                placeholder="Type additional question here..."
                className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 font-medium"
              />
              <button
                onClick={handleAddQuestionLocal}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-black hover:bg-indigo-700 transition-colors shadow-sm active:scale-95"
              >
                Add
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 italic">
              After adding, answer Yes / No above — you'll then be prompted to
              enter Root Cause, Corrective & Preventive Actions.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-slate-50 flex justify-between items-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight italic">
            Suggestions will automatically be applied to the CAPA form upon
            saving.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-black hover:bg-blue-700 transition-all shadow-lg active:scale-95"
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
  const [categories, setCategories] = useState([]);
  const [availableSubcategories, setAvailableSubcategories] = useState([]);

  // Replace simple string category with ID/Name/Code layout typical for NC
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryCode, setCategoryCode] = useState("");

  const [subCategoryId, setSubCategoryId] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryCode, setSubCategoryCode] = useState("");

  const [customSubCategory, setCustomSubCategory] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionAnswers, setQuestionAnswers] = useState({});
  const [showQuestionPopup, setShowQuestionPopup] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [targetDate, setTargetDate] = useState("");
  const [department, setDepartment] = useState("");
  const [details, setDetails] = useState("");
  const [effectiveness, setEffectiveness] = useState("");
  const [rootCause, setRootCause] = useState("");
  const [correctiveAction, setCorrectiveAction] = useState("");
  const [preventiveAction, setPreventiveAction] = useState("");
  const [closureVerification, setClosureVerification] = useState("");
  const [responsibility, setResponsibility] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [taggedStaff, setTaggedStaff] = useState([]);
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [staffSearch, setStaffSearch] = useState("");

  // Fetch staff list
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await staffService.getAllStaff();
        const data = response.data || [];
        const mappedStaff = data.map((s) => ({
          id: s.staffId || s.id,
          name:
            `${s.firstName || ""} ${s.lastName || ""}`.trim() ||
            s.name ||
            s.staffName ||
            "Unnamed Staff",
          role: s.jobTitle || "Staff",
          dept:
            departments.find((d) => (d.id || d.departmentId) === s.departmentId)
              ?.name ||
            departments.find((d) => (d.id || d.departmentId) === s.departmentId)
              ?.departmentName ||
            "General",
        }));
        setStaffList(mappedStaff);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };
    fetchStaff();

    const fetchDepartments = async () => {
      try {
        const depts = await getDepartments();
        setDepartments(depts);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    if (departments.length === 0) {
      fetchDepartments();
    }
  }, [departments]); // Re-run when departments array changes to fix mapping

  // Pre-fill if selectedNC exists
  useEffect(() => {
    if (selectedNC) {
      setCategoryId(selectedNC.categoryId || "");
      setCategoryName(selectedNC.category || "");
      setCategoryCode(selectedNC.categoryCode || "");
      setSubCategoryId(selectedNC.subCategoryId || "");
      setSubCategoryName(selectedNC.subCategory || "");
      // Derive code if needed from NC data, or fallback string based logic if it's not present
      setSubCategoryCode(selectedNC.subCategoryCode || (selectedNC.categoryCode?.startsWith("QICategory_") ? `QISubCategory_${selectedNC.subCategoryId}` : `RiskSubCategory_${selectedNC.subCategoryId}`));

      setDepartment(selectedNC.department || "");
      setResponsibility(selectedNC.reportedBy || "");
      setDetails(selectedNC.name || "");
      setEffectiveness(selectedNC.effectiveness || "");

      // Provide linked NC evidence if available
      if (selectedNC.evidenceDocumentPath) {
        setUploadedFiles([
          {
            fileName: selectedNC.evidenceDocumentName || "NC_Evidence",
            fileUrl: selectedNC.evidenceDocumentPath,
          },
        ]);
      } else {
        setUploadedFiles([]);
      }
    }
  }, [selectedNC]);

  // Fetch Categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await ncService.getAllCategories();
        const data = response.data || response.value || (Array.isArray(response) ? response : []);
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCats();
  }, []);

  // Fetch Subcategories
  useEffect(() => {
    const fetchSubCats = async () => {
      if (!categoryId || !categoryCode) {
        setAvailableSubcategories([]);
        return;
      }
      try {
        const response = await ncService.getSubCategoriesByCategory(categoryId, categoryCode);
        const raw = response?.data || response?.value || (Array.isArray(response) ? response : []);
        const isQI = categoryCode?.startsWith("QICategory_");
        const normalized = raw.map((sub) => {
          const id = isQI ? sub.qualityIndicatorSubCategoryId : (sub.riskIndicatorSubCategoryId ?? sub.id);
          return {
            subCategoryId: id,
            subCategoryName: isQI ? sub.qualitySubCategoryName : (sub.riskSubCategoryName ?? sub.name),
            subCategoryCode: isQI ? `QISubCategory_${id}` : `RiskSubCategory_${id}`,
            ...sub,
          };
        });
        setAvailableSubcategories(normalized);
      } catch (err) {
        console.error("Error fetching subcategories:", err);
        setAvailableSubcategories([]);
      }
    };
    fetchSubCats();
  }, [categoryId, categoryCode]);

  useEffect(() => {
    const fetchDynamicQuestions = async () => {
      if (subCategoryCode && categoryName !== "Other") {
        try {
          // Use subCategoryCode (e.g., QISubCategory_6) to fetch correct DB questions mapping
          const dbQuestions = await capaService.getQuestionsBySubCategory(subCategoryCode);
          setQuestions(dbQuestions);
          setQuestionAnswers({});
        } catch (error) {
          console.error("Failed to load questions:", error);
          setQuestions([]);
        }
      } else {
        setQuestions([]);
        setQuestionAnswers({});
      }
    };
    fetchDynamicQuestions();
  }, [subCategoryCode, categoryName]);

  const handleQuestionAnswered = async (index, answer) => {
    // If it's a dynamic question (not custom) and we haven't loaded its suggestions yet
    const q = questions[index];
    console.log(`[handleQuestionAnswered] index:${index}, answer:${answer}, q:`, q);

    if (!q || q.isCustom) return;

    // We only fetch if it's "yes" or "no". Usually 'yes' means isSelected=true.
    const isSelectedTarget = answer === "yes";

    // If we already have the suggestions for this answer loaded, do nothing
    const suggKey = isSelectedTarget ? "suggestionsYes" : "suggestionsNo";
    if (q[suggKey]) return;

    try {
      // Mark as loading
      setQuestions(prev => {
        const copy = [...prev];
        copy[index] = { ...copy[index], isLoadingSuggestions: true };
        return copy;
      });

      // Fetch suggestions from API
      console.log(`[handleQuestionAnswered] Fetching suggestions for Id: ${q.capaQuestionListId}, target: ${isSelectedTarget}`);
      const suggestions = await capaService.getSuggestionsByQuestion(q.capaQuestionListId, isSelectedTarget);
      console.log(`[handleQuestionAnswered] API returned suggestions:`, suggestions);

      // We expect the API to return an array of suggestions, pick the first one for the structure
      // Also handle cases where it might return a direct object or missing data array
      const suggestionsArray = Array.isArray(suggestions)
        ? suggestions
        : (suggestions?.data && Array.isArray(suggestions.data) ? suggestions.data : [suggestions].filter(Boolean));

      const suggObj = suggestionsArray.length > 0 ? suggestionsArray[0] : { _empty: true };
      console.log(`[handleQuestionAnswered] Mapped suggObj:`, suggObj);

      setQuestions(prev => {
        const copy = [...prev];
        copy[index] = {
          ...copy[index],
          isLoadingSuggestions: false,
          [suggKey]: suggObj
        };
        return copy;
      });
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setQuestions(prev => {
        const copy = [...prev];
        copy[index] = { ...copy[index], isLoadingSuggestions: false };
        return copy;
      });
    }
  };

  const handleAddCustomQuestion = (questionObj) => {
    setQuestions((prev) => [...prev, questionObj]);
  };

  const handleSaveAudit = (ans, suggConfig, customSuggs = {}, currentQuestions) => {
    setQuestionAnswers(ans);
    // If the child component (Popup) updated the questions state with loaded suggestions, sync it back
    if (currentQuestions) {
      setQuestions(currentQuestions);
    }

    // Detailed Suggestion Flow Logic
    const finalSuggestions = {
      rc: [],
      ca: [],
      pa: [],
    };

    questions.forEach((q, idx) => {
      const userAns = ans[idx];
      const userChoices = suggConfig[idx]; // { rc: bool, ca: bool, pa: bool }
      const isCustom = q.isCustom === true;

      if (userAns) {
        if (!isCustom) {
          // Pre-built question logic
          const activeSuggestions =
            userAns === "yes"
              ? q.suggestionsYes
              : userAns === "no"
                ? q.suggestionsNo
                : null;
          if (activeSuggestions && userChoices) {
            if (userChoices.rc && activeSuggestions.rootCause)
              finalSuggestions.rc.push(activeSuggestions.rootCause);
            if (userChoices.ca && activeSuggestions.correctiveAction)
              finalSuggestions.ca.push(activeSuggestions.correctiveAction);
            if (userChoices.pa && activeSuggestions.preventiveAction)
              finalSuggestions.pa.push(activeSuggestions.preventiveAction);
          }
        } else {
          // Custom question manual entry logic
          const customEntry = customSuggs[idx];
          if (customEntry) {
            if (customEntry.rootCause)
              finalSuggestions.rc.push(customEntry.rootCause);
            if (customEntry.correctiveAction)
              finalSuggestions.ca.push(customEntry.correctiveAction);
            if (customEntry.preventiveAction)
              finalSuggestions.pa.push(customEntry.preventiveAction);
          }
        }
      }
    });

    // Smart merge: Append only unique suggestions to current form fields
    const merge = (current, additions) => {
      if (additions.length === 0) return current;
      const existing = current ? current.split("\n") : [];
      const combined = [...new Set([...existing, ...additions])].filter(
        Boolean,
      );
      return combined.join("\n");
    };

    setRootCause((prev) => merge(prev, finalSuggestions.rc));
    setCorrectiveAction((prev) => merge(prev, finalSuggestions.ca));
    setPreventiveAction((prev) => merge(prev, finalSuggestions.pa));
  };

  const handleSubmit = () => {
    if (
      !categoryId ||
      (!subCategoryId && categoryName !== "Other") ||
      (categoryName === "Other" && !customSubCategory) ||
      !department ||
      !responsibility
    ) {
      alert("Please fill in all required fields");
      return;
    }
    const formData = {
      capaCategoryId: categoryId,
      category: categoryName,
      capaSubCategoryId: categoryName === "Other" ? "" : subCategoryId,
      subCategory: categoryName === "Other" ? customSubCategory : subCategoryName,
      questions: questions.map((q) => q.question || q), // Keep backward compatibility for storage
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
      uploadedFiles: uploadedFiles.map((file) =>
        file instanceof File ? file : ({
          ...file,
          fileUrl: file.fileUrl || URL.createObjectURL(file),
        })
      ),
      submittedAt: new Date().toISOString(),
    };
    if (onSubmit) onSubmit(formData);
  };

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
              CAPA Entry {selectedNC ? `#${selectedNC.issueNo}` : ""}
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
              <label className="text-sm font-semibold text-slate-700 block">
                Date
              </label>
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
              <label className="text-sm font-semibold text-slate-700 block">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all appearance-none bg-white font-medium"
              >
                <option value="">e.g., Pathology</option>
                {departments.map((d) => (
                  <option
                    key={d.id || d.departmentId}
                    value={d.departmentName || d.name}
                  >
                    {d.departmentName || d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category & Sub-Category Selection (Professional Integration) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 block">
                Primary Category
              </label>
              <select
                value={categoryId || "Other"}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "Other") {
                    setCategoryId("");
                    setCategoryName("Other");
                    setCategoryCode("");
                    setSubCategoryId("");
                    setSubCategoryName("");
                    setSubCategoryCode("");
                  } else {
                    const selectedCat = categories.find(
                      (c) =>
                        String(c.nonConformanceCategoryId || c.categoryId || c.id) === String(val)
                    );
                    const catName = selectedCat?.categoryName || selectedCat?.name || "";
                    const catCode = selectedCat?.categoryCode || "";

                    setCategoryId(val);
                    setCategoryName(catName);
                    setCategoryCode(catCode);
                    setSubCategoryId("");
                    setSubCategoryName("");
                    setSubCategoryCode("");
                  }
                }}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all bg-white"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option
                    key={cat.nonConformanceCategoryId || cat.categoryId || cat.id}
                    value={cat.nonConformanceCategoryId || cat.categoryId || cat.id}
                  >
                    {cat.categoryName || cat.name}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 block">
                Sub-Category
              </label>
              {categoryName === "Other" ? (
                <input
                  type="text"
                  value={customSubCategory}
                  onChange={(e) => {
                    setCustomSubCategory(e.target.value);
                    setSubCategoryName(e.target.value);
                  }}
                  placeholder="Specify other category..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              ) : (
                <select
                  value={subCategoryId}
                  onChange={(e) => {
                    const subId = e.target.value;
                    const selectedSub = availableSubcategories.find(
                      (s) => String(s.subCategoryId) === String(subId)
                    );
                    setSubCategoryId(subId);
                    setSubCategoryName(selectedSub?.subCategoryName || "");
                    setSubCategoryCode(selectedSub?.subCategoryCode || "");
                  }}
                  disabled={!categoryId}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white disabled:bg-slate-50"
                >
                  <option value="">{categoryId ? "Select Sub-Category" : "Select Category first"}</option>
                  {availableSubcategories.map((sub) => (
                    <option key={sub.subCategoryId} value={sub.subCategoryId}>
                      {sub.subCategoryName}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Checklist Trigger (Simple Link style) */}
          {categoryName &&
            (questions.length > 0 || subCategoryName || customSubCategory) && (
              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-md bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium text-slate-700">
                    Audit Checklist: {answeredCount} / {questions.length}{" "}
                    completed
                  </span>
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
            <label className="text-sm font-semibold text-slate-700 block">
              Details of incident
            </label>
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
            <label className="text-sm font-semibold text-slate-700 block">
              Effectiveness
            </label>
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
            <label className="text-sm font-semibold text-slate-700 block">
              Root Cause
            </label>
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
            <label className="text-sm font-semibold text-slate-700 block">
              Corrective Action Taken
            </label>
            <textarea
              value={correctiveAction}
              onChange={(e) => setCorrectiveAction(e.target.value)}
              rows={4}
              placeholder="Describe actions taken..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 block">
              Preventive Action Taken
            </label>
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
              <div className="min-h-[45px] w-full px-4 py-1.5 border border-slate-200 rounded-md focus-within:ring-1 focus-within:ring-slate-400 transition-all bg-white flex flex-wrap gap-2 items-center">
                {taggedStaff.map((staff) => (
                  <span
                    key={staff.id}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold border border-slate-200"
                  >
                    {staff.name}
                    <button
                      onClick={() =>
                        setTaggedStaff((prev) =>
                          prev.filter((s) => s.id !== staff.id),
                        )
                      }
                      className="hover:text-rose-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder={
                    taggedStaff.length === 0 ? "Search staff to tag..." : ""
                  }
                  className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
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
                      .filter(
                        (s) =>
                          s.name
                            .toLowerCase()
                            .includes(staffSearch.toLowerCase()) &&
                          !taggedStaff.some((ts) => ts.id === s.id),
                      )
                      .map((staff) => (
                        <button
                          key={staff.id}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 flex items-center justify-between group transition-colors"
                          onClick={() => {
                            setTaggedStaff((prev) => [...prev, staff]);
                            setStaffSearch("");
                            setShowStaffDropdown(false);
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">
                              {staff.name}
                            </span>
                            <span className="text-[10px] text-slate-500 uppercase">
                              {staff.role} • {staff.dept}
                            </span>
                          </div>
                          <UserPlus className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                        </button>
                      ))}
                    {staffList.filter(
                      (s) =>
                        s.name
                          .toLowerCase()
                          .includes(staffSearch.toLowerCase()) &&
                        !taggedStaff.some((ts) => ts.id === s.id),
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
              <label className="text-sm font-semibold text-slate-700 block">
                Responsibility
              </label>
              <input
                type="text"
                value={responsibility}
                onChange={(e) => setResponsibility(e.target.value)}
                placeholder="Person responsible"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 block">
                Target Date
              </label>
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
            <label className="text-sm font-semibold text-slate-700 block">
              Closure Verification
            </label>
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
                <span className="text-xs font-normal text-slate-400">
                  (Max 3 files, PDF only)
                </span>
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
                        setUploadedFiles((prev) => [...prev, file]);
                      }
                      e.target.value = ""; // Reset input
                    }}
                  />
                </label>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3">
              {uploadedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700 truncate max-w-[200px] md:max-w-md">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setUploadedFiles((prev) =>
                        prev.filter((_, i) => i !== idx),
                      )
                    }
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
                  <p className="text-[10px] uppercase font-black mt-1">
                    Upload supporting documentation
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 mt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSubmit}
              className="group px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>Submit Form</span>
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
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
