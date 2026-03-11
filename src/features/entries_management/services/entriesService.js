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

import api from "../../../auth/api";
import { CYCLE_LABEL } from "../components/Common";
export const seedInitialData = () => {
  // Only initialize if completely empty, with empty arrays
  if (!localStorage.getItem("qms_entries")) {
    storage.set("qms_entries", []);
  }
  if (!localStorage.getItem("qms_records")) {
    storage.set("qms_records", []);
  }
};

const entriesService = {
  getEntries: async () => {
    try {
      const response = await api.get("/EntriesManagement/GetAllCategories");
      // Map API response to frontend structure
      // entryCategoryId -> id
      // category -> name
      // frequency -> recordingCycle
      // entities -> entryParameters (if available in API response)
      return response.data.map(item => ({
        id: item.entryCategoryId,
        name: item.category,
        recordingCycle: (item.frequency || "daily").toLowerCase(),
        entryParameters: item.entities || [] // API might return entities if we are lucky, or we handle it in detail view
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      return storage.get("qms_entries"); // Fallback to local storage
    }
  },
  getEntitiesByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/EntriesManagement/GetEntitiesByCategory/${categoryId}`);
      // Return full objects so we can use entitiesId later
      return response.data.map(item => ({
        id: item.entitiesId,
        name: item.entitiesName
      }));
    } catch (error) {
      console.error("Error fetching entities:", error);
      return [];
    }
  },
  saveEntry: async (entry) => {
    // API Call mapping
    // name ----> category
    // Recording Cycle------> frequency
    // Entry Parameters----> entities
    const payload = {
      category: entry.name,
      frequency: CYCLE_LABEL[entry.recordingCycle],
      entities: entry.entryParameters
    };

    try {
      const response = await api.post("/EntriesManagement/CreateCategory", payload);
      // If the API returns the created object, use its ID
      if (response.data && response.data.entryCategoryId) {
        entry.id = response.data.entryCategoryId;
      }
    } catch (error) {
      console.error("Error creating category:", error);
      // We still update local storage as a fallback/cache
    }

    const all = storage.get("qms_entries");
    const exists = all.find((e) => e.id === entry.id);
    const updated = exists
      ? all.map((e) => (e.id === entry.id ? entry : e))
      : [entry, ...all];
    storage.set("qms_entries", updated);
    return entry;
  },
  getRecords: () => storage.get("qms_records"),
  getTransactionsByEntity: async (entityId) => {
    if (!entityId || isNaN(Number(entityId))) return [];
    try {
      const response = await api.get(`/EntriesManagement/GetTransactionsByEntity/${entityId}`);
      // Map backend to frontend
      return response.data.map(item => ({
        id: item.entitiesTransactionId,
        parameterId: item.entitiesId,
        value: item.reading,
        remarks: item.remarks,
        date: item.date,
        time: item.time
      }));
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  },
  getRecordsByLaboratoryId: async (labId) => {
    // Dummy implementation as specified lab logic isn't fully integrated yet
    console.warn("getRecordsByLaboratoryId called with:", labId);
    return [];
  },
  saveRecord: async (record) => {
    // record.parameterId is entitiesId
    // record.value is reading
    const payload = {
      entitiesId: record.parameterId,
      reading: record.value,
      remarks: record.remarks,
      Date: record.date,
      Time: record.time
    };

    try {
      if (record.id && typeof record.id === "number" && record.id > 1000000) {
        // New record (using Date.now() logic)
        const response = await api.post("/EntriesManagement/CreateTransaction", payload);
        if (response.data && response.data.entitiesTransactionId) {
          record.id = response.data.entitiesTransactionId;
        }
      } else {
        // Update existing record
        await api.post("/EntriesManagement/UpdateTransaction", {
          ...payload,
          entitiesTransactionId: record.id
        });
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
    }

    const all = storage.get("qms_records");
    const exists = all.find((r) => r.id === record.id);
    const updated = exists
      ? all.map((r) => (r.id === record.id ? record : r))
      : [record, ...all];
    storage.set("qms_records", updated);
    return record;
  },
  getRecordsFor: (entryId, parameterId) => {
    return storage
      .get("qms_records")
      .filter((r) => r.parameterId === parameterId);
  },
};

export default entriesService;
