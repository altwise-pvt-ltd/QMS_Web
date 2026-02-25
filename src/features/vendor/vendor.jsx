import React, { useState, useMemo, useEffect } from "react";
import VendorList from "./VendorList";
import VendorForm from "./VendorForm";
import VendorView from "./VendorView";
import { vendorService } from "./services/vendorService";
import {
  Store,
  Plus,
  ChevronRight,
  PencilLine,
  Eye,
} from "lucide-react";

// ── View meta config ──────────────────────────────────────────────────────────
const VIEW_CONFIG = {
  list: {
    title: "Vendor Directory",
    subtitle: "Manage and evaluate approved supply-chain partners",
    icon: Store,
    crumb: null,
  },
  add: {
    title: "New Vendor Registration",
    subtitle: "Onboard a new supplier into the QMS registry",
    icon: Plus,
    crumb: "Register",
  },
  edit: {
    title: "Refine Evaluation",
    subtitle: "Update qualification scores and vendor profile",
    icon: PencilLine,
    crumb: "Edit",
  },
  view: {
    title: "Vendor Profile",
    subtitle: "Read-only view of vendor evaluation and details",
    icon: Eye,
    crumb: "View",
  },
};

// ── Top progress bar ──────────────────────────────────────────────────────────
const ProgressBar = ({ visible }) => (
  <div
    className={`fixed top-0 left-0 w-full h-0.5 z-50 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
  >
    <div className="h-full bg-indigo-100">
      <div
        className="h-full bg-indigo-600 animate-[progress_1.4s_ease-in-out_infinite]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          animation: "shimmer 1.4s ease-in-out infinite",
          width: "40%",
          transformOrigin: "left",
        }}
      />
    </div>
    <style>{`
      @keyframes shimmer {
        0%   { transform: translateX(-100%) scaleX(1); }
        50%  { transform: translateX(150%) scaleX(2); }
        100% { transform: translateX(400%) scaleX(1); }
      }
    `}</style>
  </div>
);

// ── Breadcrumb ────────────────────────────────────────────────────────────────
const Breadcrumb = ({ view, onBack }) => (
  <nav className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-5">
    <button
      onClick={onBack}
      className="hover:text-indigo-600 transition-colors uppercase tracking-wider"
    >
      Vendor Management
    </button>
    {VIEW_CONFIG[view].crumb && (
      <>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-slate-600 uppercase tracking-wider">
          {VIEW_CONFIG[view].crumb}
        </span>
      </>
    )}
  </nav>
);

// ── Page header ───────────────────────────────────────────────────────────────
const PageHeader = ({ view, vendorName, onAdd, loading }) => {
  const cfg = VIEW_CONFIG[view];
  const Icon = cfg.icon;

  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div className="flex items-center gap-3.5">
        <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl shadow-sm shadow-indigo-200 shrink-0">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
            {cfg.title}
            {vendorName && (
              <span className="ml-2 text-indigo-600">· {vendorName}</span>
            )}
          </h1>
          <p className="text-slate-500 font-medium mt-1 text-lg">
            {cfg.subtitle}
          </p>
        </div>
      </div>

      {view === "list" && (
        <button
          onClick={onAdd}
          disabled={loading}
          className="group flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="group-hover:rotate-180 transition-transform duration-500" size={20} />
          Register Vendor
        </button>
      )}
    </div>
  );
};

// ── Main module ───────────────────────────────────────────────────────────────
const VendorModule = () => {
  const [vendors, setVendors] = useState([]);
  const [view, setView] = useState("list");
  const [filterType, setFilterType] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadVendors = async () => {
      setLoading(true);
      try {
        const data =
          filterType === "All"
            ? await vendorService.getVendors()
            : await vendorService.getVendorsByType(filterType);
        setVendors(data);
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    loadVendors();
  }, [filterType]);

  const handleSave = async (vendorData) => {
    setLoading(true);
    try {
      if (selectedVendor) {
        const updated = await vendorService.updateVendor(
          selectedVendor.id,
          vendorData,
        );
        setVendors((prev) =>
          prev.map((v) => (v.id === updated.id ? updated : v)),
        );
      } else {
        const saved = await vendorService.createVendor(vendorData);
        setVendors((prev) => [saved, ...prev]);
      }
      setView("list");
      setSelectedVendor(null);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this vendor?")) return;
    setLoading(true);
    try {
      await vendorService.deleteVendor(id);
      setVendors((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error("Deletion failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setView("list");
    setSelectedVendor(null);
  };

  const showCrumb = view !== "list";

  return (
    <div className="p-4 md:p-8 lg:p-12 w-full min-h-screen bg-white">
      <ProgressBar visible={loading} />

      <main className="w-full transition-all duration-300">
        {/* Breadcrumb — only on sub-views */}
        {showCrumb && <Breadcrumb view={view} onBack={goBack} />}

        {/* Page header */}
        <PageHeader
          view={view}
          vendorName={
            selectedVendor && view !== "list" ? selectedVendor.name : null
          }
          onAdd={() => {
            setSelectedVendor(null);
            setView("add");
          }}
          loading={loading}
        />

        {/* Divider */}
        <div className="border-t border-slate-100 mb-8" />

        {/* View content */}
        <div
          className={`transition-opacity duration-200 ${loading ? "opacity-40 pointer-events-none" : "opacity-100"
            }`}
        >
          {view === "list" && (
            <VendorList
              vendors={vendors}
              loading={loading}
              filterType={filterType}
              onFilterChange={setFilterType}
              onDelete={handleDelete}
              onAdd={() => {
                setSelectedVendor(null);
                setView("add");
              }}
              onEdit={(v) => {
                setSelectedVendor(v);
                setView("edit");
              }}
              onView={(v) => {
                setSelectedVendor(v);
                setView("view");
              }}
            />
          )}

          {(view === "add" || view === "edit") && (
            <div
              key={view}
              className="animate-[fadeSlideUp_0.25s_ease-out_both]"
            >
              <VendorForm
                vendor={selectedVendor}
                onSave={handleSave}
                onCancel={goBack}
                mode={view}
                loading={loading}
              />
            </div>
          )}

          {view === "view" && (
            <div className="animate-[fadeSlideUp_0.25s_ease-out_both]">
              <VendorView vendor={selectedVendor} onCancel={goBack} />
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default VendorModule;
