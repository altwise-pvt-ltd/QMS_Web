import React, { useState } from "react";
import EntryList from "./components/EntryList";
import EntryForm from "./components/EntryForm";
import LabList from "./components/LabList";
import LabDetail from "./components/LabDetail";
import DataFeedForm from "./components/DataFeedForm";
import LabForm from "./components/LabForm";
import ReceptionLog from "./components/ReceptionLog";
import { DUMMY_ENTRIES, DUMMY_LABS } from "./data/entriesData";

const EntriesManagement = () => {
  const [view, setView] = useState("list");
  const [showLabForm, setShowLabForm] = useState(false);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [entries, setEntries] = useState(DUMMY_ENTRIES);
  const [labs, setLabs] = useState(DUMMY_LABS);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedLab, setSelectedLab] = useState(null);

  const filteredEntries = entries.filter((entry) => {
    const matchesFilter = filter === "All" || entry.cycle === filter;
    const matchesSearch = entry.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans">
      <main className="">
        {view === "list" ? (
          <EntryList
            filteredEntries={filteredEntries}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filter={filter}
            setFilter={setFilter}
            onViewDetails={(entry) => {
              setSelectedEntry(entry);
              setView("labList");
            }}
            onCreateNew={() => setShowEntryForm(true)}
          />
        ) : view === "labList" ? (
          <LabList
            selectedEntry={selectedEntry}
            labs={labs}
            setLabs={setLabs}
            onBack={() => setView("list")}
            onAddLab={() => setShowLabForm(true)}
            onSelectLab={(lab) => {
              setSelectedLab(lab);
              setView("labDetail");
            }}
          />
        ) : view === "labDetail" ? (
          <LabDetail
            selectedLab={selectedLab}
            selectedEntry={selectedEntry}
            onBack={() => setView("labList")}
            onMonthlyPreview={() => setView("preview")}
            onFeedData={() => setView("feedForm")}
          />
        ) : (
          <ReceptionLog
            entry={selectedEntry}
            onBack={() => setView("labDetail")}
          />
        )}
      </main>

      {/* Entry Creation Popup */}
      {showEntryForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <EntryForm
              onSave={(newEntry) => {
                setEntries([newEntry, ...entries]);
                setShowEntryForm(false);
              }}
              onCancel={() => setShowEntryForm(false)}
            />
          </div>
        </div>
      )}

      {/* Laboratory Addition Popup */}
      {showLabForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <LabForm
              onSave={(newLabData) => {
                const newLab = {
                  id: Date.now(),
                  entryId: selectedEntry?.id || 1,
                  ...newLabData,
                };
                setLabs([newLab, ...labs]);
                setShowLabForm(false);
              }}
              onCancel={() => setShowLabForm(false)}
            />
          </div>
        </div>
      )}

      {/* Simplest Ever Popup Modal */}
      {view === "feedForm" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <DataFeedForm
              selectedLab={selectedLab}
              selectedEntry={selectedEntry}
              onSave={() => setView("labDetail")}
              onCancel={() => setView("labDetail")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EntriesManagement;
