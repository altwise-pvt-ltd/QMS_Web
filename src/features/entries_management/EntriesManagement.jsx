import React, { useState, useCallback } from "react";
import entriesService from "./services/entriesService";
import { Modal, TODAY } from "./components/Common";
import { DashboardScreen } from "./components/DashboardScreen";
import { EntryDetailScreen } from "./components/EntryDetailScreen";
import { ParameterScreen } from "./components/ParameterScreen";
import { EntryForm, FillRecordForm } from "./components/ManagementForms";
import EntriesPdfView from "./pdfView/index";



export default function EntriesManagement() {
  const [entries, setEntries] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState("dashboard"); // dashboard | entryDetail | paramScreen
  const [selEntry, setSelEntry] = useState(null);
  const [selParam, setSelParam] = useState(null);

  // Modals
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [showFillForm, setShowFillForm] = useState(false);
  const [fillDate, setFillDate] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    const data = await entriesService.getEntries();
    setEntries(data);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const saveEntry = useCallback(
    async (entry) => {
      const saved = await entriesService.saveEntry(entry);
      fetchEntries(); // Refresh list after save
      setShowEntryForm(false);
      setEditingEntry(null);
      if (selEntry?.id === entry.id) setSelEntry(saved);
    },
    [selEntry, fetchEntries],
  );

  const fetchAllEntryRecords = useCallback(async (params) => {
    setLoading(true);
    try {
      const all = [];
      for (const p of params) {
        const data = await entriesService.getTransactionsByEntity(p.id);
        all.push(...data);
      }
      setRecords(all);
    } catch (error) {
      console.error("Error fetching all records:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async (parameterId) => {
    if (!parameterId || typeof parameterId === 'string' && parameterId.includes('pdf')) return;
    setLoading(true);
    try {
      const data = await entriesService.getTransactionsByEntity(parameterId);
      setRecords(data);
    } catch (err) {
      console.error("Fetch records failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveRecord = useCallback(async (record) => {
    await entriesService.saveRecord(record);
    if (selEntry?.entryParameters) {
      await fetchAllEntryRecords(selEntry.entryParameters);
    }
    setShowFillForm(false);
    setEditingRecord(null);
    setFillDate(null);
  }, [selEntry, fetchAllEntryRecords]);

  const openFill = (date) => {
    setFillDate(date || TODAY);
    setEditingRecord(null);
    setShowFillForm(true);
  };

  const openEdit = (record) => {
    setEditingRecord(record);
    setFillDate(record.date);
    setShowFillForm(true);
  };

  return (
    <div
      className="p-4 md:p-8 lg:p-12 w-full min-h-screen bg-slate-50/30 font-sans space-y-8 animate-in fade-in duration-700"
      style={{
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      {screen === "dashboard" && (
          <DashboardScreen
            entries={entries}
            loading={loading}
            onSelect={async (e) => {
              setLoading(true);
              const entities = await entriesService.getEntitiesByCategory(e.id);
              const updatedEntry = { ...e, entryParameters: entities };
              setSelEntry(updatedEntry);
              await fetchAllEntryRecords(entities);
              setScreen("entryDetail");
            }}
            onCreateNew={() => {
              setEditingEntry(null);
              setShowEntryForm(true);
            }}
            onEditEntry={(e) => {
              setEditingEntry(e);
              setShowEntryForm(true);
            }}
          />
        )}

        {screen === "entryDetail" && selEntry && (
          <EntryDetailScreen
            entry={selEntry}
            records={records}
            loading={loading}
            onBack={() => setScreen("dashboard")}
            onSelectParam={async (param) => {
              if (param?.id === 'pdf-view') {
                setScreen("pdfView");
                return;
              }
              if (param?.id) {
                setSelParam(param);
                await fetchTransactions(param.id);
                setScreen("paramScreen");
              }
            }}
          />
        )}

        {screen === "paramScreen" && selEntry && selParam && (
          <ParameterScreen
            entry={selEntry}
            parameter={selParam}
            records={records}
            loading={loading}
            onBack={async () => {
              if (selEntry?.entryParameters) {
                await fetchAllEntryRecords(selEntry.entryParameters);
              }
              setScreen("entryDetail");
            }}
            onFill={openFill}
            onEdit={openEdit}
          />
        )}

        {screen === "pdfView" && selEntry && (
          <EntriesPdfView
            entry={selEntry}
            onBack={() => setScreen("entryDetail")}
          />
        )}

      {/* Entry Create/Edit Modal */}
      <Modal
        open={showEntryForm}
        onClose={() => {
          setShowEntryForm(false);
          setEditingEntry(null);
        }}
      >
        <EntryForm
          initial={editingEntry}
          onSave={saveEntry}
          onCancel={() => {
            setShowEntryForm(false);
            setEditingEntry(null);
          }}
        />
      </Modal>

      {/* Fill/Edit Record Modal */}
      <Modal
        open={showFillForm}
        onClose={() => {
          setShowFillForm(false);
          setEditingRecord(null);
          setFillDate(null);
        }}
      >
        {selEntry && selParam && (
          <FillRecordForm
            entry={selEntry}
            parameter={selParam}
            existingRecord={
              editingRecord
                ? editingRecord
                : fillDate
                  ? { date: fillDate }
                  : null
            }
            onSave={saveRecord}
            onCancel={() => {
              setShowFillForm(false);
              setEditingRecord(null);
              setFillDate(null);
            }}
            TODAY={TODAY}
          />
        )}
      </Modal>
    </div>
  );
}
