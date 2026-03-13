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
  Loader2,
} from "lucide-react";
import { getDepartments } from "../../department/services/departmentService";
import staffService from "../../staff/services/staffService";
import { ncService } from "../../NC/services/ncService";
import capaService from "../services/capaService";
import QuestionPopup from "./QuestionPopup";

// Import questions from quedata.js
import { CAPA_QUESTIONS } from "../quedata.js";

const CapaForm = ({ selectedNC, onViewHistory, onSubmit }) => {
  // Stable client-side ID for Cloudflare uploads
  const capaIdRef = React.useRef(crypto.randomUUID());
  
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [customSubCategory, setCustomSubCategory] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionAnswers, setQuestionAnswers] = useState({});
  const [showQuestionPopup, setShowQuestionPopup] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [targetDate, setTargetDate] = useState("");
  const [departmentId, setDepartmentId] = useState("");
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
  const [apiCategories, setApiCategories] = useState([]);
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [categoryCode, setCategoryCode] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [subCategoryCode, setSubCategoryCode] = useState("");
  const [auditMetadata, setAuditMetadata] = useState({
    suggConfig: {},
    customSuggs: {},
    fetchedApiSuggestions: {},
  });

  // Fetch staff list, departments, and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffResponse, deptData, catData] = await Promise.all([
          staffService.getAllStaff(),
          getDepartments(),
          ncService.getAllCategories(),
        ]);

        setDepartments(deptData);

        if (catData && catData.isSuccess) {
          setApiCategories(catData.value || []);
        } else if (Array.isArray(catData)) {
          setApiCategories(catData);
        }

        const sData = staffResponse.data || [];
        const mappedStaff = sData.map((s) => ({
          id: s.staffId || s.id,
          name:
            `${s.firstName || ""} ${s.lastName || ""}`.trim() ||
            s.name ||
            s.staffName ||
            "Unnamed Staff",
          role: s.jobTitle || "Staff",
          dept:
            deptData.find((d) => (d.id || d.departmentId) === s.departmentId)
              ?.name ||
            deptData.find((d) => (d.id || d.departmentId) === s.departmentId)
              ?.departmentName ||
            "General",
        }));
        setStaffList(mappedStaff);
      } catch (error) {
        console.error("Error fetching startup data:", error);
      }
    };
    fetchData();
  }, []);

  // Pre-fill if selectedNC exists
  useEffect(() => {
    if (selectedNC) {
      setCategoryId(selectedNC.nonConformanceCategoryId || "");
      setCategory(
        selectedNC.nonConformanceCategoryName || selectedNC.category || "",
      );

      let code = selectedNC.categoryCode;
      if (!code && apiCategories.length > 0) {
        const found = apiCategories.find(
          (c) =>
            String(c.nonConformanceCategoryId || c.categoryId || c.id) ===
            String(selectedNC.nonConformanceCategoryId),
        );
        if (found) code = found.categoryCode;
      }
      setCategoryCode(code || "");

      setSubCategoryId(selectedNC.nonConformanceSubCategoryId || "");
      setSubCategory(
        selectedNC.nonConformanceSubCategoryName ||
          selectedNC.subCategory ||
          "",
      );
      setDepartmentId(selectedNC.departmentId || "");
      setResponsibility(selectedNC.reportedBy || "");
      setDetails(selectedNC.name || "");
      setEffectiveness(selectedNC.effectiveness || "");

      // Link evidence file from NC if it exists
      if (selectedNC.evidenceDocumentPath) {
        setUploadedFiles([
          {
            fileName: selectedNC.evidenceDocumentName || "NC Evidence",
            fileUrl: selectedNC.evidenceDocumentPath,
          },
        ]);
      }
    }
  }, [selectedNC, apiCategories]);

  // Fetch subcategories when category changes
  useEffect(() => {
    const fetchSubCats = async () => {
      // Wait for categoryId and a valid routing code before fetching
      if (!categoryId || category === "Other" || !categoryCode) {
        setAvailableSubcategories([]);
        return;
      }
      try {
        const response = await ncService.getSubCategoriesByCategory(
          categoryId,
          categoryCode,
        );
        const raw =
          response?.data ||
          response?.value ||
          (Array.isArray(response) ? response : []);

        const isQI = !categoryCode || categoryCode.startsWith("QICategory_");
        const normalized = raw.map((sub) => {
          const id = isQI
            ? sub.qualityIndicatorSubCategoryId
            : (sub.riskIndicatorSubCategoryId ?? sub.id);
          return {
            subCategoryId: id,
            subCategoryName: isQI
              ? sub.qualitySubCategoryName
              : (sub.riskSubCategoryName ?? sub.name),
            // ── FIX: Build the subCategoryCode the API expects
            //    e.g. "QISubCategory_6" or "RiskSubCategory_3"
            subCategoryCode: isQI
              ? `QISubCategory_${id}`
              : `RiskSubCategory_${id}`,
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

  // ── FIX: Fetch questions using subCategoryCode (not subCategory name)
  //    subCategoryCode is now properly set (e.g. "QISubCategory_6")
  //    because the normalization above constructs it correctly.
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!subCategoryCode || category === "Other") {
        // No valid code yet — try hardcoded fallback or clear
        if (category && subCategory) {
          const dbQuestions = [
            ...(CAPA_QUESTIONS[category]?.[subCategory] || []),
          ];
          setQuestions(dbQuestions);
        } else {
          setQuestions([]);
        }
        setQuestionAnswers({});
        return;
      }

      try {
        const apiQuestions =
          await capaService.getQuestionsBySubCategory(subCategoryCode);

        if (apiQuestions && apiQuestions.length > 0) {
          const mapped = apiQuestions.map((q) => ({
            id: q.capaQuestionListId,
            question: q.capaQuestion,
            capaQuestionListId: q.capaQuestionListId,
            suggestionsYes: null,
            suggestionsNo: null,
            ...q,
          }));
          setQuestions(mapped);
        } else {
          // Fallback to local hardcoded questions
          const dbQuestions = [
            ...(CAPA_QUESTIONS[category]?.[subCategory] || []),
          ];
          setQuestions(dbQuestions);
        }
        setQuestionAnswers({});
      } catch (err) {
        console.error("Error fetching questions from API:", err);
        const dbQuestions = [
          ...(CAPA_QUESTIONS[category]?.[subCategory] || []),
        ];
        setQuestions(dbQuestions);
        setQuestionAnswers({});
      }
    };
    fetchQuestions();
  }, [subCategoryCode, category, subCategory]);

  const handleAddCustomQuestion = (questionObj) => {
    setQuestions((prev) => [...prev, questionObj]);
  };

  const handleSaveAudit = (
    ans,
    suggConfig,
    customSuggs = {},
    fetchedApiSuggestions = {},
  ) => {
    setQuestionAnswers(ans);
    setAuditMetadata({ suggConfig, customSuggs, fetchedApiSuggestions });

    const finalSuggestions = {
      rc: [],
      ca: [],
      pa: [],
    };

    questions.forEach((q, idx) => {
      const userAns = ans[idx];
      const userChoices = suggConfig[idx];
      const isCustom = q.isCustom === true;

      if (userAns) {
        if (!isCustom) {
          const apiSug = fetchedApiSuggestions[idx];
          const activeSuggestions =
            userAns === "yes"
              ? q.suggestionsYes || apiSug
              : userAns === "no"
                ? q.suggestionsNo || apiSug
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const missingFields = [];
    if (!category) missingFields.push("Primary Category");
    if (!subCategory && !customSubCategory) missingFields.push("Sub-Category");
    if (!departmentId) missingFields.push("Department");
    if (!responsibility) missingFields.push("Responsibility");

    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(", ")}`);
      return;
    }

    setIsSubmitting(true);
    try {
      // Build structured CapaAuditQuestions, filtering only answered ones
      const capaAuditQuestions = [];
      
      questions.forEach((q, idx) => {
        const answer = questionAnswers[idx];
        if (!answer) return; // Skip unanswered questions

        const userChoices = auditMetadata.suggConfig[idx] || {};
        const isCustom = q.isCustom === true;

        let qRC = "",
          qCA = "",
          qPA = "";

        if (!isCustom) {
          const apiSug = auditMetadata.fetchedApiSuggestions[idx];
          const activeSuggestions =
            answer === "yes"
              ? q.suggestionsYes || apiSug
              : answer === "no"
                ? q.suggestionsNo || apiSug
                : null;
          if (activeSuggestions && userChoices) {
            if (userChoices.rc) qRC = activeSuggestions.rootCause || "";
            if (userChoices.ca) qCA = activeSuggestions.correctiveAction || "";
            if (userChoices.pa) qPA = activeSuggestions.preventiveAction || "";
          }
        } else {
          const customEntry = auditMetadata.customSuggs[idx];
          if (customEntry) {
            qRC = customEntry.rootCause || "";
            qCA = customEntry.correctiveAction || "";
            qPA = customEntry.preventiveAction || "";
          }
        }

        capaAuditQuestions.push({
          Question: q.question || q,
          IsYesSelected: answer === "yes",
          RootCause: qRC,
          CorrectiveAction: qCA,
          PreventiveAction: qPA,
        });
      });

      const formData = {
        category,
        subCategory: category === "Other" ? customSubCategory : subCategory,
        questions: questions.map((q) => q.question || q),
        questionAnswers,
        capaAuditQuestions,
        date,
        targetDate,
        departmentId,
        details,
        effectiveness,
        rootCause,
        correctiveAction,
        preventiveAction,
        closureVerification,
        responsibility,
        taggedStaff,
        capaId: capaIdRef.current,
        capaIssueId: capaIdRef.current,
        capaCategoryId: categoryId,
        capaSubCategoryId: subCategoryId,
        uploadedFiles, // Raw File objects or existing URLs
        submittedAt: new Date().toISOString(),
      };

      console.log("CAPA Form Submission Started:", formData);
      if (onSubmit) {
        await onSubmit(formData);
      }
    } catch (error) {
      console.error("Submission failed:", error);
      alert(error.message || "Failed to submit form. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
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
          {/* Date and Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 block">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 block">
                Department
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all appearance-none bg-white font-medium"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option
                    key={d.id || d.departmentId}
                    value={d.id || d.departmentId}
                  >
                    {d.departmentName || d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category & Sub-Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 block">
                Primary Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => {
                  const catId = e.target.value;
                  const selectedCat = apiCategories.find(
                    (c) =>
                      String(
                        c.nonConformanceCategoryId || c.categoryId || c.id,
                      ) === String(catId),
                  );
                  setCategoryId(catId);
                  setCategory(
                    selectedCat?.categoryName || selectedCat?.name || (catId === "Other" ? "Other" : ""),
                  );
                  setCategoryCode(selectedCat?.categoryCode || "");
                  setSubCategoryId("");
                  setSubCategory("");
                  setSubCategoryCode("");
                }}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all bg-white"
              >
                <option value="">Select Category</option>
                {apiCategories.map((cat) => (
                  <option
                    key={
                      cat.nonConformanceCategoryId || cat.categoryId || cat.id
                    }
                    value={
                      cat.nonConformanceCategoryId || cat.categoryId || cat.id
                    }
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
                  value={subCategoryId}
                  onChange={(e) => {
                    const subId = e.target.value;
                    const selectedSub = availableSubcategories.find(
                      (s) => String(s.subCategoryId) === String(subId),
                    );
                    setSubCategoryId(subId);
                    setSubCategory(selectedSub?.subCategoryName || "");
                    // ── FIX: Use the properly constructed subCategoryCode
                    setSubCategoryCode(selectedSub?.subCategoryCode || "");
                  }}
                  disabled={!categoryId}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white disabled:bg-slate-50"
                >
                  <option value="">
                    {categoryId
                      ? "Select Sub-Category"
                      : "Select Category first"}
                  </option>
                  {availableSubcategories.map((sub) => (
                    <option key={sub.subCategoryId} value={sub.subCategoryId}>
                      {sub.subCategoryName}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Checklist Trigger */}
          {category && (subCategory || customSubCategory) && (
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

          {/* Details */}
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

          {/* Corrective / Preventive */}
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
            <label className="text-sm font-semibold text-slate-700 block flex items-center gap-2">
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
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all font-medium"
              />
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

          {/* File Upload */}
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
                      if (file) setUploadedFiles((prev) => [...prev, file]);
                      e.target.value = "";
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
                        {file instanceof File
                          ? file.name
                          : file.fileName || "Evidence"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase">
                        {file instanceof File
                          ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                          : "Linked file"}
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

          {/* Submit */}
          <div className="pt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-10 py-3 bg-indigo-600 text-white rounded-md font-bold text-base hover:bg-indigo-700 transition-all shadow-sm active:scale-95 flex items-center gap-2 disabled:bg-slate-400 disabled:cursor-wait"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                "Submit Form"
              )}
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
        subCategoryCode={subCategoryCode}
      />
    </div>
  );
};

export default CapaForm;
