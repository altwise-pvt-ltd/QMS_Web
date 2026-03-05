import api from "../../../auth/api";

// ==================== MAPPINGS ====================

const mapEntryApiToUi = (apiEntry) => ({
  id: apiEntry.entryId,
  name: apiEntry.entryName,
  cycle: apiEntry.recordingCycle,
  parameters: typeof apiEntry.entryParameters === "string" 
    ? JSON.parse(apiEntry.entryParameters) 
    : apiEntry.entryParameters || [],
  isActive: apiEntry.isActive,
  organizationId: apiEntry.organizationId,
});

const mapEntryUiToApi = (uiEntry) => ({
  entryId: uiEntry.id || 0,
  entryName: uiEntry.name,
  recordingCycle: uiEntry.cycle,
  entryParameters: uiEntry.parameters || [],
});

const mapLabApiToUi = (apiLab) => ({
  id: apiLab.laboratoryId,
  entryId: apiLab.entryId,
  name: apiLab.laboratoryName,
  code: apiLab.laboratoryCode,
  labNumber: apiLab.laboratoryNumber,
  isActive: apiLab.isActive,
});

const mapLabUiToApi = (uiLab) => ({
  laboratoryId: uiLab.id || 0,
  entryId: uiLab.entryId,
  laboratoryName: uiLab.name,
  laboratoryCode: uiLab.code,
});

const mapRecordApiToUi = (apiRecord) => ({
  id: apiRecord.recordId,
  entryId: apiRecord.entryId,
  labId: apiRecord.laboratoryId,
  date: apiRecord.recordDate,
  status: apiRecord.status,
  value: apiRecord.reading, // Using 'reading' as the primary value for history rows
  recordedBy: apiRecord.recordedBy,
  verifiedBy: apiRecord.verifiedBy,
  verifiedDate: apiRecord.verifiedDate,
  parameterValues: typeof apiRecord.parameterValues === "string"
    ? JSON.parse(apiRecord.parameterValues)
    : apiRecord.parameterValues || {},
  remarks: apiRecord.remarks,
});

const mapRecordUiToApi = (uiRecord) => ({
  recordId: uiRecord.id || 0,
  entryId: uiRecord.entryId,
  laboratoryId: uiRecord.labId,
  recordDate: uiRecord.date,
  status: uiRecord.status || "Pending",
  reading: uiRecord.value || "",
  parameterValues: uiRecord.parameterValues || {},
  remarks: uiRecord.remarks || "",
});

// ==================== ENTRIES (Log Types) ====================

/**
 * Get all entry types (Log Categories)
 */
export const getAllEntries = async () => {
  try {
    const response = await api.get("/EntryManagement/GetAllEntries");
    return (response.data || []).map(mapEntryApiToUi);
  } catch (error) {
    console.error("Error fetching all entries:", error);
    throw error;
  }
};

/**
 * Get a specific entry type by ID
 */
export const getEntryById = async (id) => {
  try {
    const response = await api.get(`/EntryManagement/GetEntryById/${id}`);
    return mapEntryApiToUi(response.data);
  } catch (error) {
    console.error("Error fetching entry by ID:", error);
    throw error;
  }
};

/**
 * Create a new entry type
 * @param {Object} entryData - { name, cycle, parameters: [] }
 */
export const createEntry = async (entryData) => {
  try {
    const apiData = mapEntryUiToApi(entryData);
    const response = await api.post("/EntryManagement/CreateEntry", apiData);
    return mapEntryApiToUi(response.data.entry || response.data);
  } catch (error) {
    console.error("Error creating entry:", error);
    throw error;
  }
};

/**
 * Update an existing entry type
 */
export const updateEntry = async (entryData) => {
  try {
    const apiData = mapEntryUiToApi(entryData);
    const response = await api.put("/EntryManagement/UpdateEntry", apiData);
    return response.data;
  } catch (error) {
    console.error("Error updating entry:", error);
    throw error;
  }
};

// ==================== LABORATORIES ====================

/**
 * Get laboratories associated with a specific entry type
 */
export const getLaboratoriesByEntryId = async (entryId) => {
  try {
    const response = await api.get(`/EntryManagement/GetLaboratoriesByEntryId/${entryId}`);
    return (response.data || []).map(mapLabApiToUi);
  } catch (error) {
    console.error("Error fetching laboratories for entry:", error);
    throw error;
  }
};

/**
 * Create a new laboratory for an entry
 */
export const createLaboratory = async (labData) => {
  try {
    const apiData = mapLabUiToApi(labData);
    const response = await api.post("/EntryManagement/CreateLaboratory", apiData);
    return mapLabApiToUi(response.data.laboratory || response.data);
  } catch (error) {
    console.error("Error creating laboratory:", error);
    throw error;
  }
};

/**
 * Update a laboratory
 */
export const updateLaboratory = async (labData) => {
  try {
    const apiData = mapLabUiToApi(labData);
    const response = await api.put("/EntryManagement/UpdateLaboratory", apiData);
    return response.data;
  } catch (error) {
    console.error("Error updating laboratory:", error);
    throw error;
  }
};

/**
 * Delete a laboratory by ID
 */
export const deleteLaboratory = async (labId) => {
  try {
    const response = await api.delete(`/EntryManagement/DeleteLaboratory/${labId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting laboratory:", error);
    throw error;
  }
};

// ==================== RECORDS (Daily Logs) ====================

/**
 * Get records for a specific laboratory
 */
export const getRecordsByLaboratoryId = async (labId) => {
  try {
    const response = await api.get(`/EntryManagement/GetRecordsByLaboratoryId/${labId}`);
    return (response.data || []).map(mapRecordApiToUi);
  } catch (error) {
    console.error("Error fetching records for lab:", error);
    throw error;
  }
};

/**
 * Create a new daily log record
 */
export const createRecord = async (recordData) => {
  try {
    const apiData = mapRecordUiToApi(recordData);
    const response = await api.post("/EntryManagement/CreateRecord", apiData);
    return mapRecordApiToUi(response.data.record || response.data);
  } catch (error) {
    console.error("Error creating record:", error);
    throw error;
  }
};

/**
 * Update a log record
 */
export const updateRecord = async (recordData) => {
  try {
    const apiData = mapRecordUiToApi(recordData);
    const response = await api.put("/EntryManagement/UpdateRecord", apiData);
    return response.data;
  } catch (error) {
    console.error("Error updating record:", error);
    throw error;
  }
};

/**
 * Delete a record by ID
 */
export const deleteRecord = async (recordId) => {
  try {
    const response = await api.delete(`/EntryManagement/DeleteRecord/${recordId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting record:", error);
    throw error;
  }
};

const entriesService = {
  getAllEntries,
  getEntryById,
  createEntry,
  updateEntry,
  getLaboratoriesByEntryId,
  createLaboratory,
  updateLaboratory,
  deleteLaboratory,
  getRecordsByLaboratoryId,
  createRecord,
  updateRecord,
  deleteRecord,
};

export default entriesService;
