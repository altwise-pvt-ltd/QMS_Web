import React, { useState } from "react";
import CapaForm from "./components/capaform";
import FormPreview from "./components/formpreview";
import CAPAFormView from "./CAPAFormView";
import { ncService } from "../NC/services/ncService";
import { capaService } from "./services/capaService";
import { Loader2 } from "lucide-react";

const Capa = () => {
  const [view, setView] = useState("history");
  const [ncs, setNcs] = useState([]);
  const [filedCapas, setFiledCapas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNC, setSelectedNC] = useState(null);
  const [selectedFiledCapa, setSelectedFiledCapa] = useState(null);

  React.useEffect(() => {
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
        department: "Dept #" + nc.departmentId, // Could be enriched with dept name if available
        category: nc.nonConformanceCategoryName || "Quality",
        subCategory: nc.nonConformanceSubCategoryName,
        ...nc, // Preserve original for form usage
      }));

      // Map CAPAs
      const apiCAPAs =
        capaResponse?.value ||
        (Array.isArray(capaResponse) ? capaResponse : []);
      const mappedCAPAs = apiCAPAs.map((capa) => ({
        ...capa,
        id: capa.capaId || capa.id,
        issueNo: capa.nonConformanceIssueId || "N/A",
        name: capa.nonConformanceSubCategoryName || "CAPA Record",
        filedBy: capa.responsibility || "Staff",
        filedDate: (capa.date || capa.createdDate)?.split("T")[0] || "",
        department: "Dept #" + (capa.departmentId || "1"),
      }));

      setNcs(mappedNCs);
      setFiledCapas(mappedCAPAs);
    } catch (error) {
      console.error("Failed to fetch CAPA dashboard data:", error);
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

  const handleSubmitCapa = (formData) => {
    const newCapa = {
      ...formData,
      id: `CAPA-2026-${String(filedCapas.length + 1).padStart(3, "0")}`,
      ncId: selectedNC?.id || "Direct Entry",
      issueNo: selectedNC?.issueNo || "N/A",
      name: selectedNC?.name || formData.subCategory,
      filedBy: formData.responsibility, // Mapping responsibility to filedBy for the list view
      filedDate: formData.date || new Date().toISOString().split("T")[0],
      status: "Submitted",
    };

    setFiledCapas([newCapa, ...filedCapas]);

    // If it was linked to an NC, we might want to remove it from the list or mark it as filed
    if (selectedNC) {
      setNcs(ncs.filter((nc) => nc.id !== selectedNC.id));
    }

    setSelectedNC(null);
    setView("history");
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
          />
        </div>
      )}
    </div>
  );
};

export default Capa;
