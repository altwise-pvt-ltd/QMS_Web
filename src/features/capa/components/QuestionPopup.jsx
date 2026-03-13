import React, { useState, useEffect } from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import capaService from "../services/capaService";

/**
 * QuestionPopup Component
 * renders a modal with audit questions and dynamic suggestions.
 */
const QuestionPopup = ({
  isOpen,
  onClose,
  questions,
  onSave,
  answers,
  onAddCustomQuestion,
  subCategoryCode,
}) => {
  const [localAnswers, setLocalAnswers] = useState({});
  const [selectedSuggestions, setSelectedSuggestions] = useState({});
  const [newQuestionText, setNewQuestionText] = useState("");
  // Stores manual entry for custom questions: { index: { rootCause, correctiveAction, preventiveAction } }
  const [customSuggestions, setCustomSuggestions] = useState({});
  const [apiSuggestions, setApiSuggestions] = useState({});
  const [loadingSuggestions, setLoadingSuggestions] = useState({});
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

  useEffect(() => {
    setLocalAnswers(answers || {});
    // Initialize suggestions selection: if an answer is present, enable its suggestions by default
    const initialSugg = {};
    if (answers) {
      Object.keys(answers).forEach((idx) => {
        initialSugg[idx] = { rc: true, ca: true, pa: true };

        // Also fetch suggestions for existing answers if they are API questions
        const qIdx = parseInt(idx);
        const question = questions[qIdx];
        if (
          question &&
          question.capaQuestionListId &&
          !question.suggestionsYes &&
          !question.suggestionsNo
        ) {
          fetchApiSuggestions(qIdx, answers[idx]);
        }
      });
    }
    setSelectedSuggestions(initialSugg);
  }, [answers, isOpen, questions]);

  const fetchApiSuggestions = async (index, answerValue) => {
    const question = questions[index];
    if (!question || !question.capaQuestionListId) return;

    setLoadingSuggestions((prev) => ({ ...prev, [index]: true }));
    try {
      const suggestions = await capaService.getSuggestionsByQuestion(
        question.capaQuestionListId,
        answerValue === "yes",
      );
      if (suggestions && suggestions.length > 0) {
        setApiSuggestions((prev) => ({
          ...prev,
          [index]: {
            rootCause: suggestions[0].rootCause || "",
            correctiveAction: suggestions[0].correctiveAction || "",
            preventiveAction: suggestions[0].preventiveAction || "",
          },
        }));
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    } finally {
      setLoadingSuggestions((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleAnswer = (index, value) => {
    setLocalAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));

    // Fetch API suggestions if they don't exist hardcoded
    const question = questions[index];
    if (
      question &&
      question.capaQuestionListId &&
      !question.suggestionsYes &&
      !question.suggestionsNo
    ) {
      fetchApiSuggestions(index, value);
    }

    // For pre-built questions, enable selection by default
    // For custom questions, we'll use the customSuggestions state
    setSelectedSuggestions((prev) => ({
      ...prev,
      [index]: { rc: true, ca: true, pa: true },
    }));
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

  const handleAddQuestionLocal = async () => {
    if (!newQuestionText.trim() || isAddingQuestion) return;

    setIsAddingQuestion(true);
    try {
      // Step 1: Save to Database
      const response = await capaService.createQuestion({
        qiSubCategory: subCategoryCode,
        capaQuestion: newQuestionText.trim(),
      });

      const newQ =
        response?.data || response?.value || response?.data?.data || response;

      // Step 2: Add to local form state
      onAddCustomQuestion({
        id: newQ.capaQuestionListId,
        capaQuestionListId: newQ.capaQuestionListId,
        question: newQ.capaQuestion || newQuestionText.trim(),
        isCustom: false, // It's now a DB question
        suggestionsYes: null,
        suggestionsNo: null,
      });

      setNewQuestionText("");
    } catch (err) {
      console.error("Error creating question:", err);
      alert(err.message || "Failed to create question in database.");

      // Fallback: Add as local custom question if API fails (optional, maybe better to error)
      /*
      onAddCustomQuestion({
        question: newQuestionText.trim(),
        isCustom: true,
        suggestionsYes: null,
        suggestionsNo: null,
      });
      setNewQuestionText("");
      */
    } finally {
      setIsAddingQuestion(false);
    }
  };

  const handleSave = () => {
    onSave(localAnswers, selectedSuggestions, customSuggestions, apiSuggestions);
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
            const apiSug = apiSuggestions[index];
            const activeSuggestions = isCustom
              ? null
              : answer === "yes"
                ? question.suggestionsYes || apiSug
                : answer === "no"
                  ? question.suggestionsNo || apiSug
                  : null;
            const isLoadingSug = loadingSuggestions[index];

            return (
              <div
                key={index}
                className="p-4 border rounded-xl bg-white shadow-sm border-slate-200"
              >
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-slate-800 font-bold">
                    {index + 1}. {question.question || question}
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
                    className={`flex-1 py-2.5 rounded-lg text-sm font-black transition-all border-2 ${
                      answer === "yes"
                        ? "bg-emerald-100 text-emerald-700 border-emerald-500"
                        : "bg-white border-slate-100 text-slate-500 hover:border-emerald-500/30"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleAnswer(index, "no")}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-black transition-all border-2 ${
                      answer === "no"
                        ? "bg-rose-100 text-rose-700 border-rose-500"
                        : "bg-white border-slate-100 text-slate-500 hover:border-rose-500/30"
                    }`}
                  >
                    No
                  </button>
                </div>

                {/* Pre-built Suggestion Section */}
                {!isCustom && answer && (isLoadingSug || activeSuggestions) && (
                  <div
                    className={`mt-4 p-4 rounded-lg border space-y-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                      answer === "yes"
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-rose-50 border-rose-200"
                    }`}
                  >
                    {isLoadingSug ? (
                      <div className="flex items-center gap-2 text-slate-400 py-4 justify-center">
                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs font-bold uppercase tracking-widest">
                          Fetching Suggestions...
                        </span>
                      </div>
                    ) : activeSuggestions ? (
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
                            className={`p-3 rounded-md border cursor-pointer transition-all ${
                              suggs?.[item.type]
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
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  suggs?.[item.type]
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
                              "{item.text || "No suggestion available"}"
                            </p>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400 py-4 justify-center">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">
                          No suggestions found
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Custom Question Entry Section */}
                {isCustom && answer && (
                  <div
                    className={`mt-4 p-4 rounded-lg border space-y-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                      answer === "yes"
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
                disabled={isAddingQuestion || !newQuestionText.trim()}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-black hover:bg-indigo-700 transition-colors shadow-sm active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isAddingQuestion && (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {isAddingQuestion ? "Saving..." : "Add"}
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
              className="px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-2 bg-slate-900 text-white rounded-lg text-sm font-black hover:bg-black transition-all shadow-lg active:scale-95"
            >
              Apply to Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPopup;
