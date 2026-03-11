import React, { useState, useEffect } from "react";
import {
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Plus,
  ChevronRight,
  FileSpreadsheet,
  Search,
  Trash2,
  Pencil,
} from "lucide-react";
import { Skeleton } from "../../components/ui/Skeleton";
import QalityIndicatorForm from "./qalityindicatorform";
import qiService from "./services/qiService";
import DeleteConfirmationModal from "../../components/ui/DeleteConfirmationModal";

const SEVERITY_LABELS = {
  0: { label: "Low", color: "bg-emerald-100 text-emerald-700" },
  1: { label: "Medium", color: "bg-amber-100 text-amber-700" },
  2: { label: "High", color: "bg-rose-100 text-rose-700" },
};

const QualityIndicator = () => {
  const [view, setView] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [indicators, setIndicators] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState(null);
  const [error, setError] = useState(null);
  const [deletingIndicator, setDeletingIndicator] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  // ... (keeping lines 37-145)

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = (indicator, e) => {
    e.stopPropagation();
    setDeletingIndicator(indicator);
  };

  const confirmDelete = async () => {
    if (!deletingIndicator) return;
    setIsDeleting(true);

    try {
      await qiService.deleteQualityIndicator(
        deletingIndicator.qualityIndicatorSubCategoryId,
      );
      setIndicators((prev) =>
        prev.filter(
          (i) =>
            i.qualityIndicatorSubCategoryId !==
            deletingIndicator.qualityIndicatorSubCategoryId,
        ),
      );
      setDeletingIndicator(null);
    } catch (err) {
      console.error("Error deleting indicator:", err);
      setError("Failed to delete indicator.");
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = (indicator, e) => {
    e.stopPropagation();
    setEditingIndicator(indicator);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIndicator(null);
    setError(null);
  };

  // ── Derived data ────────────────────────────────────────────────────────────
  // Build unique category names for filter tabs from loaded categories
  const categoryNames = [
    "All",
    ...categories
      .map((c) => c.qualityCategoryName || c.qiCategory || c.name)
      .filter(Boolean),
  ];

  const filteredIndicators = indicators.filter((indicator) => {
    const matchesSearch = (indicator.qualitySubCategoryName || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Check both ID and Name for matching category
    const matchesCategory =
      selectedCategory === "All" ||
      categories.some((c) => {
        const isSelected =
          (c.qualityCategoryName || c.qiCategory || c.name) ===
          selectedCategory;
        if (!isSelected) return false;

        const indicatorCatId = String(
          indicator.qualityIndicatorCategoryId || "",
        );
        return (
          indicatorCatId === String(c.qualityIndicatorCategoryId) ||
          indicatorCatId === String(c.qiCategory)
        );
      });

    return matchesSearch && matchesCategory;
  });

  const totalIndicators = indicators.length;
  const activeIndicators = indicators.filter(
    (i) => i.status === "Active",
  ).length;
  const highSeverity = indicators.filter(
    (i) => parseInt(i.severity) >= 2,
  ).length;

  // ── Sub-components ──────────────────────────────────────────────────────────
  const StatsCard = ({ title, value, color, icon: Icon }) => {
    const colorMap = {
      indigo: {
        bg: "bg-indigo-50",
        text: "text-indigo-600",
        border: "border-indigo-100",
      },
      rose: {
        bg: "bg-rose-50",
        text: "text-rose-600",
        border: "border-rose-100",
      },
      emerald: {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        border: "border-emerald-100",
      },
    };
    const c = colorMap[color] || colorMap.indigo;

    return (
      <div
        className={`bg-white p-6 rounded-xl border-2 ${c.border} transition-all`}
      >
        <div className={`inline-flex p-2.5 rounded-lg ${c.bg} mb-4`}>
          <Icon className={`w-5 h-5 ${c.text}`} strokeWidth={2.5} />
        </div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          {title}
        </p>
        <h3 className="text-4xl font-bold text-slate-900 tracking-tight mt-1">
          {value}
        </h3>
      </div>
    );
  };

  const IndicatorCard = ({ indicator }) => {
    const sev =
      SEVERITY_LABELS[parseInt(indicator.severity)] || SEVERITY_LABELS[0];
    const isActive = indicator.status === "Active";

    return (
      <div className="bg-white group rounded-2xl border-2 border-slate-100 hover:border-indigo-200 transition-all p-5 flex flex-col justify-between h-full hover:-translate-y-1 shadow-sm hover:shadow-xl">
        <div>
          <div className="flex justify-between items-start mb-3">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${sev.color}`}
            >
              {sev.label}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => openEditModal(indicator, e)}
                className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors"
                title="Edit"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={(e) => handleDelete(indicator, e)}
                className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <h4 className="text-slate-800 font-bold text-base mb-3 group-hover:text-indigo-600 transition-colors leading-tight">
            {indicator.qualitySubCategoryName}
          </h4>

          {indicator.thresholdPercentage !== undefined && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                Threshold
              </p>
              <p className="text-sm font-black text-slate-700">
                {indicator.thresholdPercentage}%
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
          <span
            className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
              isActive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
          <ChevronRight
            size={16}
            className="text-slate-300 group-hover:text-indigo-400 transition-colors"
          />
        </div>
      </div>
    );
  };

  if (view === "form") {
    return (
      <QalityIndicatorForm
        indicators={indicators}
        categories={categories}
        onBack={() => setView("dashboard")}
      />
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-12 w-full space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Activity className="text-indigo-600" size={32} />
            Quality Indicators
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-lg">
            Monitoring and analyzing laboratory performance metrics
          </p>
        </div>
        <button
          onClick={() => setView("form")}
          className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-100 rounded-2xl font-bold hover:shadow-md transition-all active:scale-95"
        >
          <FileSpreadsheet size={20} className="text-emerald-500" />
          Monthly Report Form
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertCircle className="text-red-500 shrink-0" size={18} />
          <p className="text-sm text-red-700 font-medium">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-600 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))
        ) : (
          <>
            <StatsCard
              title="Total Indicators"
              value={totalIndicators}
              color="indigo"
              icon={TrendingUp}
            />
            <StatsCard
              title="Active"
              value={activeIndicators}
              color="emerald"
              icon={CheckCircle2}
            />
            <StatsCard
              title="High / Critical"
              value={highSeverity}
              color="rose"
              icon={AlertCircle}
            />
          </>
        )}
      </div>

      {/* Filters + Grid */}
      <div className="bg-slate-50 min-h-[500px]">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          {/* Category tabs — from backend */}
          <div className="flex items-center bg-white p-1 rounded-2xl shadow-sm border border-slate-100 w-full md:w-auto overflow-x-auto no-scrollbar">
            {loading ? (
              <div className="flex gap-2 p-1">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-9 w-24 rounded-xl" />
                ))}
              </div>
            ) : (
              categoryNames.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-gray-900 shadow-lg shadow-indigo-200"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))
            )}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={18}
            />
            <input
              type="text"
              placeholder="Search indicators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Add card */}
          <div
            onClick={() => {
              setEditingIndicator(null);
              setIsModalOpen(true);
            }}
            className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 group hover:border-indigo-300 transition-all flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-white min-h-[220px]"
          >
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all mb-4">
              <Plus size={28} />
            </div>
            <p className="text-slate-500 font-bold group-hover:text-indigo-600 transition-colors">
              Add New Indicator
            </p>
            <p className="text-slate-400 text-xs mt-1">
              Define new quality benchmark
            </p>
          </div>

          {loading
            ? [...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-[220px] rounded-2xl" />
              ))
            : filteredIndicators.map((indicator) => (
                <IndicatorCard
                  key={indicator.qualityIndicatorSubCategoryId}
                  indicator={indicator}
                />
              ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 mb-2 italic">
                    {editingIndicator
                      ? "Update Quality Metric"
                      : "Configure Quality Metric"}
                  </h2>
                  <p className="text-slate-500 text-sm font-medium">
                    Establish benchmarks and performance thresholds for QMS
                    compliance
                  </p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                  <Activity size={24} />
                </div>
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                {/* Category select — from backend */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
                    Select Category
                  </label>
                  {loading ? (
                    <Skeleton className="h-12 rounded-2xl" />
                  ) : (
                    <select
                      value={form.qualityIndicatorCategoryId}
                      onChange={(e) =>
                        handleFieldChange(
                          "qualityIndicatorCategoryId",
                          e.target.value,
                        )
                      }
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:bg-white transition-all outline-none font-bold text-slate-800 appearance-none cursor-pointer"
                    >
                      <option value="">Select a category...</option>
                      {categories.map((cat) => (
                        <option
                          key={cat.qualityIndicatorCategoryId || cat.id}
                          value={cat.qualityIndicatorCategoryId || cat.id}
                        >
                          {cat.qualityCategoryName ||
                            cat.qiCategory ||
                            cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Indicator name */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
                    Indicator Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Turnaround Time Overrun"
                    value={form.qualitySubCategoryName}
                    onChange={(e) =>
                      handleFieldChange(
                        "qualitySubCategoryName",
                        e.target.value,
                      )
                    }
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:bg-white transition-all outline-none font-bold text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* Threshold */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
                      Threshold (%)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 10"
                      value={form.thresholdPercentage}
                      onChange={(e) =>
                        handleFieldChange("thresholdPercentage", e.target.value)
                      }
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:bg-white transition-all outline-none font-bold text-slate-800"
                    />
                  </div>

                  {/* Severity */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
                      Severity
                    </label>
                    <select
                      value={form.severity}
                      onChange={(e) =>
                        handleFieldChange("severity", e.target.value)
                      }
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:bg-white transition-all outline-none font-bold text-slate-800 appearance-none cursor-pointer"
                    >
                      <option value="0">Low</option>
                      <option value="1">Medium</option>
                      <option value="2">High</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) =>
                        handleFieldChange("status", e.target.value)
                      }
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:bg-white transition-all outline-none font-bold text-slate-800 appearance-none cursor-pointer"
                    >
                      <option value="Inactive">Inactive</option>
                      <option value="Active">Active</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={
                    !form.qualitySubCategoryName ||
                    !form.qualityIndicatorCategoryId ||
                    saving
                  }
                  className="flex-1 py-4 bg-indigo-600 text-slate-900 font-black rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                      Saving...
                    </>
                  ) : editingIndicator ? (
                    "Update Metric"
                  ) : (
                    "Define Metric"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={!!deletingIndicator}
        onClose={() => !isDeleting && setDeletingIndicator(null)}
        onConfirm={confirmDelete}
        title="Delete Quality Indicator"
        message={`Are you sure you want to delete "${deletingIndicator?.qualitySubCategoryName}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default QualityIndicator;
