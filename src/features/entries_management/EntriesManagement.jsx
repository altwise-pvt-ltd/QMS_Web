import React, { useState } from "react";
import EntryList from "./components/EntryList";
import EntryForm from "./components/EntryForm";
import LabList from "./components/LabList";
import LabDetail from "./components/LabDetail";
import DataFeedForm from "./components/DataFeedForm";
import LabForm from "./components/LabForm";
import ReceptionLog from "./components/ReceptionLog";
import entriesService from "./services/entriesService";

const EntriesManagement = () => {
  const [view, setView] = useState("list");
  const [showLabForm, setShowLabForm] = useState(false);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [entries, setEntries] = useState([]);
  const [labs, setLabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedLab, setSelectedLab] = useState(null);

  // Fetch all entries on mount
  React.useEffect(() => {
    const fetchEntries = async () => {
      try {
        setIsLoading(true);
        const data = await entriesService.getAllEntries();
        setEntries(data);
      } catch (err) {
        setError("Failed to fetch entries");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEntries();
  }, []);

  // Fetch labs when an entry is selected
  React.useEffect(() => {
    if (selectedEntry && view === "labList") {
      const fetchLabs = async () => {
        try {
          setIsLoading(true);
          const data = await entriesService.getLaboratoriesByEntryId(
            selectedEntry.id,
          );
          setLabs(data);
        } catch (err) {
          setError("Failed to fetch laboratories");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchLabs();
    }
  }, [selectedEntry, view]);

  const filteredEntries = entries.filter((entry) => {
    const matchesFilter = filter === "All" || entry.cycle === filter;
    const matchesSearch = entry.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-slate-100 min-h-screen text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <main className="max-w-7xl mx-auto">
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
            isLoading={isLoading}
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
            isLoading={isLoading}
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
            lab={selectedLab}
            onBack={() => setView("labDetail")}
          />
        )}
      </main>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-right-4">
          {error}
        </div>
      )}

      {/* Entry Creation Popup */}
      {showEntryForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <EntryForm
              onSave={async (newEntryData) => {
                try {
                  const savedEntry =
                    await entriesService.createEntry(newEntryData);
                  setEntries([savedEntry, ...entries]);
                  setShowEntryForm(false);
                } catch (err) {
                  console.error("Error creating entry:", err);
                }
              }}
              onCancel={() => setShowEntryForm(false)}
            />
          </div>
        </div>
      )}

      {/* Laboratory Addition Popup */}
      {showLabForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <LabForm
              onSave={async (newLabData) => {
                try {
                  const labToCreate = {
                    entryId: selectedEntry?.id,
                    ...newLabData,
                  };
                  const savedLab =
                    await entriesService.createLaboratory(labToCreate);
                  setLabs([savedLab, ...labs]);
                  setShowLabForm(false);
                } catch (err) {
                  console.error("Error creating lab:", err);
                }
              }}
              onCancel={() => setShowLabForm(false)}
            />
          </div>
        </div>
      )}

      {/* Simplest Ever Popup Modal */}
      {view === "feedForm" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
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
