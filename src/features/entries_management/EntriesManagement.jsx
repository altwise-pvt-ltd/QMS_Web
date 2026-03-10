import React, { useState, useCallback } from "react";
import entriesService, { seedInitialData } from "./services/entriesService";
import { Modal, TODAY } from "./components/Common";
import { DashboardScreen } from "./components/DashboardScreen";
import { EntryDetailScreen } from "./components/EntryDetailScreen";
import { ParameterScreen } from "./components/ParameterScreen";
import { EntryForm, FillRecordForm } from "./components/ManagementForms";

// Initialize data
seedInitialData();

export default function EntriesManagement() {
  const [entries, setEntries] = useState(() => entriesService.getEntries());
  const [records, setRecords] = useState(() => entriesService.getRecords());
  const [screen, setScreen] = useState("dashboard"); // dashboard | entryDetail | paramScreen
  const [selEntry, setSelEntry] = useState(null);
  const [selParam, setSelParam] = useState(null);

  // Modals
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [showFillForm, setShowFillForm] = useState(false);
  const [fillDate, setFillDate] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);

  const saveEntry = useCallback(
    (entry) => {
      const saved = entriesService.saveEntry(entry);
      setEntries(entriesService.getEntries());
      setShowEntryForm(false);
      setEditingEntry(null);
      if (selEntry?.id === entry.id) setSelEntry(saved);
    },
    [selEntry],
  );

  const saveRecord = useCallback((record) => {
    entriesService.saveRecord(record);
    setRecords(entriesService.getRecords());
    setShowFillForm(false);
    setEditingRecord(null);
    setFillDate(null);
  }, []);

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
      className="min-h-screen bg-slate-50 font-sans"
      style={{
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {screen === "dashboard" && (
          <DashboardScreen
            entries={entries}
            onSelect={(e) => {
              setSelEntry(e);
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
            onBack={() => setScreen("dashboard")}
            onSelectParam={(param) => {
              setSelParam(param);
              setScreen("paramScreen");
            }}
          />
        )}

        {screen === "paramScreen" && selEntry && selParam && (
          <ParameterScreen
            entry={selEntry}
            parameter={selParam}
            records={records}
            onBack={() => setScreen("entryDetail")}
            onFill={openFill}
            onEdit={openEdit}
          />
        )}
      </div>

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
