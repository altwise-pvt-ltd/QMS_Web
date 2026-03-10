// entriesService.js - Local Storage Implementation for QMS Entries
const storage = {
  get: (key, def = []) => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : def;
    } catch {
      return def;
    }
  },
  set: (key, val) => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error("Storage error:", e);
    }
  },
};

import { DUMMY_ENTRIES, INITIAL_RECORDS } from "../entry_data";

export const seedInitialData = () => {
  if (!storage.get("qms_entries", null)) {
    storage.set("qms_entries", DUMMY_ENTRIES);
  }
  if (!storage.get("qms_records", null)) {
    storage.set("qms_records", INITIAL_RECORDS);
  }
};

const entriesService = {
  getEntries: () => storage.get("qms_entries"),
  saveEntry: (entry) => {
    const all = storage.get("qms_entries");
    const exists = all.find((e) => e.id === entry.id);
    const updated = exists
      ? all.map((e) => (e.id === entry.id ? entry : e))
      : [entry, ...all];
    storage.set("qms_entries", updated);
    return entry;
  },
  getRecords: () => storage.get("qms_records"),
  saveRecord: (record) => {
    const all = storage.get("qms_records");
    const exists = all.find((r) => r.id === record.id);
    const updated = exists
      ? all.map((r) => (r.id === record.id ? record : r))
      : [record, ...all];
    storage.set("qms_records", updated);
    return record;
  },
  getRecordsFor: (entryId, parameter) => {
    return storage
      .get("qms_records")
      .filter((r) => r.entryId === entryId && r.parameter === parameter);
  },
};

export default entriesService;
