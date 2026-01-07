import React, { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import { db } from "../../db";

// Components
import CapaFormPopup from "../capa/components/capaformpopup";
import FormPreview from "../capa/components/formpreview";

const Capa = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [forms, setForms] = useState([]);

  // 🔹 Load forms from Dexie
  const loadForms = async () => {
    const allForms = await db.capa_forms.toArray();
    setForms(allForms);
  };

  // 🔹 Load on page open
  useEffect(() => {
    loadForms();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            CAPA & Incidents
          </h1>
          <p className="text-slate-600">
            Corrective and Preventive Action
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm shadow-sm"
            />
          </div>

          {/* Create Form */}
          <button
            onClick={() => setShowCreatePopup(true)}
            className="
              inline-flex items-center gap-2
              px-4 py-2.5
              bg-indigo-50 text-indigo-700
              border border-indigo-200
              rounded-lg
              shadow-sm
              hover:bg-indigo-100 hover:shadow-md
              focus:ring-2 focus:ring-indigo-400
              transition-all
              active:scale-95
            "
          >
            <Plus className="w-4 h-4" />
            Create New Form
          </button>
        </div>
      </div>

      {/* Created / Applied Forms */}
      <FormPreview
        forms={forms.filter((f) =>
          f.title?.toLowerCase().includes(searchTerm.toLowerCase())
        )}
      />

      {/* Popup */}
      {showCreatePopup && (
        <CapaFormPopup
          onClose={() => {
            setShowCreatePopup(false);
            loadForms(); // 🔥 refresh list after save
          }}
        />
      )}
    </div>
  );
};

export default Capa;
