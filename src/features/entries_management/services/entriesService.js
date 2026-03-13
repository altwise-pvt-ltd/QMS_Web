import api from "../../../auth/api";
import { CYCLE_LABEL } from "../components/Common";

const entriesService = {
  getEntries: async () => {
    try {
      const response = await api.get("/EntriesManagement/GetAllCategories");
      return response.data.map(item => ({
        id: item.entryCategoryId,
        name: item.category,
        recordingCycle: (item.frequency || "daily").toLowerCase(),
        entryParameters: item.entities || []
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },
  getEntitiesByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/EntriesManagement/GetEntitiesByCategory/${categoryId}`);
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
    const payload = {
      category: entry.name,
      frequency: CYCLE_LABEL[entry.recordingCycle],
      entities: entry.entryParameters
    };

    try {
      const response = await api.post("/EntriesManagement/CreateCategory", payload);
      if (response.data && response.data.entryCategoryId) {
        entry.id = response.data.entryCategoryId;
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
    return entry;
  },
  getRecords: async () => {
    console.warn("getRecords (bulk) not supported by backend API directly yet");
    return [];
  },
  getTransactionsByEntity: async (entityId) => {
    if (!entityId || isNaN(Number(entityId))) return [];
    try {
      const response = await api.get(`/EntriesManagement/GetTransactionsByEntity/${entityId}`);
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
    return [];
  },
  saveRecord: async (record) => {
    const payload = {
      entitiesId: record.parameterId,
      reading: record.value,
      remarks: record.remarks,
      Date: record.date,
      Time: record.time
    };

    try {
      if (record.id && typeof record.id === "number" && record.id > 1000000) {
        const response = await api.post("/EntriesManagement/CreateTransaction", payload);
        if (response.data && response.data.entitiesTransactionId) {
          record.id = response.data.entitiesTransactionId;
        }
      } else {
        await api.post("/EntriesManagement/UpdateTransaction", {
          ...payload,
          entitiesTransactionId: record.id
        });
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
    return record;
  },
  getRecordsFor: (entryId, parameterId) => {
    console.warn("getRecordsFor involves fetch from API, caller should use getTransactionsByEntity");
    return [];
  },
};

export default entriesService;
