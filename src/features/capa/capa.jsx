import React, { useState, useEffect } from "react";
import CapaForm from "./components/capaform";
import FormPreview from "./components/formpreview";
import CAPAFormView from "./CAPAFormView";
import { ncService } from "../NC/services/ncService";
import { capaService } from "./services/capaService";
import { Loader2 } from "lucide-react";
import AlertManager from "../../services/alert/alertService";

const Capa = () => {
  const [view, setView] = useState("history"); // Start with history/dashboard
  const [ncs, setNcs] = useState([]);
  const [filedCapas, setFiledCapas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNC, setSelectedNC] = useState(null);
  const [selectedFiledCapa, setSelectedFiledCapa] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [ncResponse, capaResponse] = await Promise.all([
        ncService.getNCs(),
        capaService.getCAPAs(),
      ]);

      // Map NCs to the structure expected by FormPreview
      const apiNCs =
        ncResponse?.value || (Array.isArray(ncResponse) ? ncResponse : []);
      const mappedNCs = apiNCs.map((nc) => ({
        id: nc.nonConformanceId,
        issueNo: nc.nonConformanceIssueId,
        name: nc.nonConformanceSubCategoryName || nc.detailsOfNonConformance,
        reportedBy: nc.responsibility || "Unknown",
        date: nc.date?.split("T")[0] || "",
        department: "Dept #" + nc.departmentId,
        category: nc.nonConformanceCategoryName || "Quality",
        subCategory: nc.nonConformanceSubCategoryName,
        ...nc,
      }));

      // CAPAs are already mapped by capaService.getCAPAs()
      setNcs(mappedNCs);
      setFiledCapas(Array.isArray(capaResponse) ? capaResponse : []);
    } catch (error) {
      console.error("Failed to fetch CAPA dashboard data:", error);
      AlertManager.error("Failed to load CAPA data", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileCapa = (nc) => {
    setSelectedNC(nc);
    setView("form");
  };

  const handleCreateNew = () => {
    setSelectedNC(null);
    setView("form");
  };

  const handleViewOriginal = (capa) => {
    setSelectedFiledCapa(capa);
    setView("preview-original");
  };

  const handleSubmitCapa = async (formData) => {
    try {
      const enrichedData = {
        ...formData,
        nonConformanceId:
          selectedNC?.nonConformanceId || selectedNC?.id || null,
        nonConformanceIssueId:
          selectedNC?.nonConformanceIssueId || selectedNC?.issueNo || null,
        supplier: selectedNC?.supplier || formData.supplier || "",
      };

      await capaService.createCAPA(enrichedData);
      AlertManager.success("CAPA created successfully", "Created");

      await fetchData();

      setSelectedNC(null);
      setView("history");
    } catch (error) {
      console.error("Error creating CAPA:", error);
      AlertManager.error(
        error?.message || "Failed to create CAPA. Please try again.",
        "Error",
      );
    }
  };

  const handleDeleteCapa = async (capaId) => {
    if (!window.confirm("Are you sure you want to delete this CAPA?")) return;

    try {
      await capaService.deleteCAPA(capaId);
      AlertManager.success("CAPA deleted successfully", "Deleted");
      await fetchData();
    } catch (error) {
      console.error("Error deleting CAPA:", error);
      AlertManager.error("Failed to delete CAPA", "Error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {view === "form" ? (
        <CapaForm
          selectedNC={selectedNC}
          onViewHistory={() => setView("history")}
          onSubmit={handleSubmitCapa}
        />
      ) : view === "preview-original" ? (
        <CAPAFormView
          capa={selectedFiledCapa}
          onBack={() => setView("history")}
        />
      ) : isLoading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <div className="p-4 md:p-8 lg:p-12 w-full">
          <FormPreview
            ncs={ncs}
            filedCapas={filedCapas}
            onFileCapa={handleFileCapa}
            onCreateNew={handleCreateNew}
            onView={handleViewOriginal}
            onDelete={handleDeleteCapa}
          />
        </div>
      )}
    </div>
  );
};

export default Capa;
