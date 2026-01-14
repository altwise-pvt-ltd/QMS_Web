import React, { useState } from "react";
import CapaForm from "./components/capaform";
import FormPreview from "./components/formpreview";
import CAPAFormView from "./CAPAFormView";
import { initialNCs, initialFiledCapas } from "./data";

const Capa = () => {
  const [view, setView] = useState("history"); // Start with history/dashboard
  const [ncs, setNcs] = useState(initialNCs);
  const [filedCapas, setFiledCapas] = useState(initialFiledCapas);
  const [selectedNC, setSelectedNC] = useState(null);
  const [selectedFiledCapa, setSelectedFiledCapa] = useState(null);

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
      id: `CAPA-2026-${String(filedCapas.length + 1).padStart(3, '0')}`,
      ncId: selectedNC?.id || "Direct Entry",
      issueNo: selectedNC?.issueNo || "N/A",
      name: selectedNC?.name || formData.subCategory,
      filedBy: formData.responsibility, // Mapping responsibility to filedBy for the list view
      filedDate: formData.date || new Date().toISOString().split('T')[0],
      status: "Submitted"
    };

    setFiledCapas([newCapa, ...filedCapas]);

    // If it was linked to an NC, we might want to remove it from the list or mark it as filed
    if (selectedNC) {
      setNcs(ncs.filter(nc => nc.id !== selectedNC.id));
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
      ) : (
        <div className="p-6 max-w-7xl mx-auto">
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
