import React, { useState, useMemo, useEffect } from "react";
import VendorList from "./VendorList";
import VendorForm from "./VendorForm";
import VendorView from "./VendorView";
import { vendorService } from "./services/vendorService";

const VendorModule = () => {
  const [vendors, setVendors] = useState([]);
  const [view, setView] = useState("list");
  const [filterType, setFilterType] = useState("All"); // All, Approved, New
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initial Data Procurement
  useEffect(() => {
    const loadVendors = async () => {
      setLoading(true);
      try {
        let data;
        if (filterType === "All") {
          data = await vendorService.getVendors();
        } else {
          data = await vendorService.getVendorsByType(filterType);
        }
        setVendors(data);
      } catch (error) {
        console.error("Fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };
    loadVendors();
  }, [filterType]);

  // Computed value: determines title/context for the header
  const viewConfig = useMemo(() => {
    switch (view) {
      case "add":
        return { title: "New Vendor Registration", icon: "➕" };
      case "edit":
        return { title: "Refine Evaluation", icon: "📝" };
      case "view":
        return { title: "Vendor Profile", icon: "🏢" };
      default:
        return { title: "Vendor Directory", icon: "📋" };
    }
  }, [view]);

  const handleSave = async (vendorData) => {
    setLoading(true);
    try {
      if (selectedVendor) {
        // Update Lifecycle
        const updated = await vendorService.updateVendor(
          selectedVendor.id,
          vendorData,
        );
        setVendors((prev) =>
          prev.map((v) => (v.id === updated.id ? updated : v)),
        );
      } else {
        // Creation Lifecycle
        const saved = await vendorService.createVendor(vendorData);
        setVendors((prev) => [saved, ...prev]);
      }
      setView("list");
    } catch (error) {
      console.error("Save transaction failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to dismiss this vendor?"))
      return;

    setLoading(true);
    try {
      await vendorService.deleteVendor(id);
      setVendors((prev) => prev.filter((v) => v.id !== id));
    } catch (error) {
      console.error("Deletion failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Progress Indicator (Global UX) */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-indigo-100 z-50 overflow-hidden">
          <div className="h-full bg-indigo-600 animate-progress-bar"></div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8 transition-all duration-300">
        <div
          className={`transition-opacity duration-300 ${loading ? "opacity-50" : "opacity-100"}`}
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
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <VendorForm
                vendor={selectedVendor}
                onSave={handleSave}
                onCancel={() => setView("list")}
                mode={view}
                loading={loading}
              />
            </div>
          )}

          {view === "view" && (
            <div className="animate-in fade-in duration-500">
              <VendorView
                vendor={selectedVendor}
                onCancel={() => setView("list")}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VendorModule;
