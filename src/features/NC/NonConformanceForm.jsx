import React, { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "../../auth/AuthContext";
import { ncService } from "./services/ncService";
import { getDepartments } from "../department/services/departmentService";
import { NC_OPTIONS } from "./data/NcCategories";
import NCHeader from "./components/NCHeader";
import NCEntry from "./components/NCEntry";
import NCActions from "./components/NCActions";
import NCHistoryTable from "./components/NCHistoryTable";
import NCDetailsModal from "./components/NCDetailsModal";
import { Alert, Snackbar, Button } from "@mui/material";
import { History, Plus, Search, AlertTriangle } from "lucide-react";

const INITIAL_FORM_DATA = {
  documentNo: "ADC-FORM-24",
  issueNo: "01",
  amendmentNo: "00",
  issueDate: "15/03/2022",
  amendmentDate: "NA",
  documentName: "NON-CONFORMANCE FORM",
  entry: {
    id: 1,
    category: "",
    date: new Date().toISOString().split("T")[0],
    department: "",
    ncDetails: "",
    dailyNcDetails: "",
    effectiveness: "",
    rootCause: "",
    preventiveAction: "",
    correctiveAction: "",
    responsibility: "",
    taggedStaff: [],
    closureVerification: "",
    observations: "",
    evidenceImage: null, // File object — kept separate from form fields
  },
};

export default function DailyNCForm() {
  const { user } = useAuth();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [historyReports, setHistoryReports] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [departments, setDepartments] = useState([]);
  const [alertConfig, setAlertConfig] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  /**
   * Stable NCR ID for the life of this form session.
   * Generated once on mount — all evidence files for this NCR
   * go into the same R2 folder: qmsdocs/ncr/{date}/{ncrId}/
   * Reset after successful submit.
   */
  const ncrId = useRef(crypto.randomUUID());

  const handleCloseAlert = () =>
    setAlertConfig((prev) => ({ ...prev, open: false }));

  // ── Fetch Departments ─────────────────────────────────────────────────────
  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
      }
    };
    fetchDepts();
  }, []);

  // ── Autofill responsibility + department ──────────────────────────────────
  useEffect(() => {
    if (!user) return;
    setFormData((prev) => {
      const { responsibility, department } = prev.entry;
      if (responsibility && department) return prev;
      return {
        ...prev,
        entry: {
          ...prev.entry,
          responsibility: responsibility || user.name || "",
          department: department || user.department || "",
        },
      };
    });
  }, [user]);

  // ── Fetch History ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (showHistory) fetchHistory();
  }, [showHistory]);

  const fetchHistory = async () => {
    try {
      setIsHistoryLoading(true);
      const response = await ncService.getNCs();
      const apiReports = response.isSuccess
        ? response.value
        : Array.isArray(response)
          ? response
          : [];

      const mappedReports = apiReports.map((report) => {
        const catIdx = parseInt(report.nonConformanceCategoryId) - 1;
        const subIdx = parseInt(report.nonConformanceSubCategoryId) - 1;

        return {
          id: report.nonConformanceId,
          status: report.status || "Open",
          entry: {
            category: NC_OPTIONS[catIdx]?.category || "Uncategorized",
            ncDetails:
              NC_OPTIONS[catIdx]?.subcategories[subIdx] || "No description",
            date: report.date?.split("T")[0] || "",
            department:
              departments.find((d) => d.departmentId === report.departmentId)
                ?.departmentName ||
              departments.find((d) => d.id === report.departmentId)?.name ||
              `Dept #${report.departmentId}`,
            responsibility: report.responsibility,
            dailyNcDetails: report.detailsOfNonConformance,
            effectiveness: report.effectiveness,
            observations: report.observations,
            rootCause: report.rootCause,
            correctiveAction: report.correctiveActionTaken,
            preventiveAction: report.preventiveActionTaken,
            closureVerification: report.closureVerification,
            // ← Use EvidenceDocumentPath (R2 URL) directly
            evidenceImage: report.evidenceDocumentPath || null,
            taggedStaff: report.staffIdinvolvedInIncident
              ? [
                  {
                    id: report.staffIdinvolvedInIncident,
                    name: "Staff #" + report.staffIdinvolvedInIncident,
                  },
                ]
              : [],
          },
          submittedBy: {
            name: "User " + (report.createdBy || ""),
            id: report.createdBy,
          },
          documentNo: report.nonConformanceIssueId,
        };
      });

      setHistoryReports(mappedReports);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  // ── Filtered + derived data ───────────────────────────────────────────────
  const filteredReports = useMemo(() => {
    return historyReports.filter((report) => {
      const entry = report.entry || {};
      const matchesSearch =
        entry.ncDetails?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.responsibility
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        report.submittedBy?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || entry.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [historyReports, searchQuery, selectedCategory]);

  const categories = useMemo(() => {
    const set = new Set(
      historyReports.map((r) => r.entry?.category).filter(Boolean),
    );
    return ["All", ...Array.from(set).sort()];
  }, [historyReports]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateEntry = (_id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      entry: { ...prev.entry, [field]: value },
    }));
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // ── ID mapping ──────────────────────────────────────────────────────
      const deptId =
        departments.find(
          (d) => (d.departmentName || d.name) === formData.entry.department,
        )?.departmentId || "1";

      const categoryIndex = NC_OPTIONS.findIndex(
        (c) => c.category === formData.entry.category,
      );
      const categoryId =
        categoryIndex !== -1 ? (categoryIndex + 1).toString() : "1";

      const subCategoryIndex =
        categoryIndex !== -1
          ? NC_OPTIONS[categoryIndex].subcategories.indexOf(
              formData.entry.ncDetails,
            )
          : -1;
      const subCategoryId =
        subCategoryIndex !== -1 ? (subCategoryIndex + 1).toString() : "1";

      const staffId = formData.entry.taggedStaff?.[0]?.id || "1";

      // ── Build FormData payload (no binary file) ──────────────────────────
      const payload = new FormData();
      payload.append("NonConformanceId", "0");
      payload.append("NonConformanceIssueId", "NC");
      payload.append("Supplier", "Internal Dept");
      payload.append("Status", "Open");
      payload.append("NonConformanceStatus", "Under Investigation");
      payload.append("Date", formData.entry.date);
      payload.append("NonConformanceIssueDate", formData.entry.date);
      payload.append("DetailsOfNonConformance", formData.entry.dailyNcDetails);
      payload.append("DepartmentId", deptId);
      payload.append("NonConformanceCategoryId", categoryId);
      payload.append("NonConformanceSubCategoryId", subCategoryId);
      payload.append("Effectiveness", formData.entry.effectiveness);
      payload.append("Observations", formData.entry.observations);
      payload.append("RootCause", formData.entry.rootCause);
      payload.append("CorrectiveActionTaken", formData.entry.correctiveAction);
      payload.append("PreventiveActionTaken", formData.entry.preventiveAction);
      payload.append("StaffIdinvolvedInIncident", staffId);
      payload.append("Responsibility", formData.entry.responsibility);
      payload.append("ClosureVerification", formData.entry.closureVerification);
      // NOTE: EvidenceDocumentPath is appended inside ncService.createNC
      // after the R2 upload completes — do NOT append it here

      // ── Call service — evidence upload + backend save ────────────────────
      const evidenceFile = formData.entry.evidenceImage; // File object or null

      await ncService.createNC(
        payload,
        evidenceFile, // ← File object — Worker uploads this to R2
        ncrId.current, // ← stable UUID for this form session
        (progress) => setUploadProgress(progress),
      );

      setAlertConfig({
        open: true,
        severity: "success",
        message: "Non-Conformance created successfully!",
      });

      // Reset form and generate fresh ncrId for next submission
      ncrId.current = crypto.randomUUID();
      setFormData({
        ...INITIAL_FORM_DATA,
        entry: {
          ...INITIAL_FORM_DATA.entry,
          responsibility: user?.name || "",
          department: user?.department || "",
        },
      });
    } catch (err) {
      console.error("Submission failed:", err);
      setAlertConfig({
        open: true,
        severity: "error",
        message: err.message || "Failed to save the report.",
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-8 lg:p-12 w-full min-h-screen bg-gray-50">
      <div className="w-full space-y-6">
        {/* Header Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <AlertTriangle className="text-indigo-600" size={32} />
              {showHistory ? "NC History Log" : "Non-Conformance"}
            </h1>
            <p className="text-slate-500 mt-1 font-medium text-lg">
              {showHistory
                ? "Historical records of identified non-conformities"
                : "Report and document new quality incidents"}
            </p>
          </div>
          <Button
            variant="outlined"
            onClick={() => setShowHistory(!showHistory)}
            startIcon={showHistory ? <Plus size={18} /> : <History size={18} />}
            className="border-slate-200! text-slate-600! capitalize! px-6! py-2.5! rounded-xl! font-bold!"
          >
            {showHistory ? "Create New Entry" : "View History"}
          </Button>
        </div>

        {/* Upload progress bar — visible during evidence upload */}
        {isSubmitting && uploadProgress > 0 && (
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        {showHistory ? (
          <>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  size={18}
                />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search details or responsibility..."
                  className="w-full pl-10 pr-4 py-2 border rounded-xl"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-64 pl-4 pr-4 py-2 border rounded-xl"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "All" ? "All Categories" : c}
                  </option>
                ))}
              </select>
            </div>

            <NCHistoryTable
              reports={filteredReports}
              isLoading={isHistoryLoading}
              onViewDetails={setSelectedReport}
            />
          </>
        ) : (
          <div className="bg-white rounded-xl border">
            <NCHeader formData={formData} onFieldChange={handleFieldChange} />
            <div className="p-6 space-y-6">
              <NCEntry
                entry={formData.entry}
                onUpdate={updateEntry}
                departments={departments}
              />
              <NCActions
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                uploadProgress={uploadProgress}
              />
            </div>
          </div>
        )}
      </div>

      <Snackbar
        open={alertConfig.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={alertConfig.severity} variant="filled">
          {alertConfig.message}
        </Alert>
      </Snackbar>

      <NCDetailsModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  );
}
