import api from "../../../auth/api";
import { uploadFile } from "../../../services/workerService";

/**
 * instrumentService.js
 *
 * Two-step upload flow:
 *   Step 1 — Each file → QMS Worker → R2 (returns fileUrl + originalName)
 *   Step 2 — JSON payload with URL strings → POST/PUT /InstrumentCalibration/*
 *
 * R2 Path Structure:
 *   qmsdocs/instrument/{instrumentName}/{subType}__{uuid}.ext
 *
 * IMPORTANT — Field name asymmetry confirmed from Postman:
 *   POST/PUT sends:  purchaseOrderFile       ← R2 URL
 *   GET returns:     purchaseOrderFilePath   ← same URL, different key
 *
 * All 7 file fields:
 *   purchaseOrderFile        / purchaseOrderFileName
 *   billReceiptFile          / billReceiptFileName
 *   installationReportFile   / installationReportFileName
 *   iqOqPqProtocolFile       / iqOqPqProtocolFileName
 *   userOperationsManualFile / userOperationsManualFileName
 *   equipmentPhotographFile  / equipmentPhotographFileName
 *   latestCalibrationCert    / latestCalibrationCertFileName  ← NOTE: no "File" suffix
 */

// ─── Instrument subType map ───────────────────────────────────────────────────
// Maps form field names → R2 subType folder name
const FILE_FIELDS = [
  { field: "purchaseOrderFile",      subType: "purchase-order"       },
  { field: "billReceiptFile",        subType: "bill-receipt"         },
  { field: "installationReportFile", subType: "installation-report"  },
  { field: "iqOqPqProtocolFile",     subType: "iqoqpq-protocol"      },
  { field: "userOperationsManualFile", subType: "operations-manual"  },
  { field: "equipmentPhotographFile",  subType: "photograph"         },
  { field: "latestCalibrationCert",    subType: "calibration-cert"   },
];

/**
 * Uploads a single instrument file to R2.
 * Returns { fileUrl, originalName } or { fileUrl: "", originalName: "" } if no file.
 *
 * @param {File|null} file
 * @param {string} instrumentName - Used for readable R2 folder name
 * @param {string} subType        - R2 subfolder e.g. "photograph"
 */
async function uploadInstrumentFile(file, instrumentName, subType) {
  if (!file || !(file instanceof File)) return { fileUrl: "", originalName: "" };

  const r2Result = await uploadFile(file, {
    module:         "instrument",
    instrumentName: instrumentName || "instrument",  // slugified by Worker
    subType,
  });

  return {
    fileUrl:      r2Result.fileUrl,
    originalName: file.name,
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const instrumentService = {

  // ── Read ────────────────────────────────────────────────────────────────────

  getInstruments: async () => {
    try {
      const response = await api.get("/InstrumentCalibration/GetAllInstrumentCalibrations");
      return response.data;
    } catch (error) {
      console.error("Error fetching instruments:", error);
      throw error;
    }
  },

  getInstrumentById: async (id) => {
    try {
      const response = await api.get(`/InstrumentCalibration/GetInstrumentCalibrationById/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching instrument ${id}:`, error);
      throw error;
    }
  },

  getInstrumentsByDepartment: async (department) => {
    try {
      const response = await api.get(`/InstrumentCalibration/GetInstrumentCalibrationsByDepartment/${encodeURIComponent(department)}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching instruments by department:", error);
      throw error;
    }
  },

  getInstrumentsByStatus: async (status) => {
    try {
      const response = await api.get(`/InstrumentCalibration/GetInstrumentCalibrationsByStatus/${status}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching instruments by status:", error);
      throw error;
    }
  },

  searchByNomenclature: async (nomenclature) => {
    try {
      const response = await api.get(`/InstrumentCalibration/SearchInstrumentCalibrationsByNomenclature/${encodeURIComponent(nomenclature)}`);
      return response.data;
    } catch (error) {
      console.error("Error searching instruments:", error);
      throw error;
    }
  },

  // ── Create ───────────────────────────────────────────────────────────────────

  /**
   * Creates a new instrument calibration record.
   * Uploads all provided files to R2 first, then POSTs JSON to backend.
   *
   * @param {Object} data - Instrument form data
   * @param {string} data.instrumentNomenclature  - Required. Used for R2 folder name.
   * @param {string} data.operatingDepartment
   * @param {string} data.expiryDate              - YYYY-MM-DD
   * @param {string} data.preventiveMaintenanceNotes
   * @param {string} data.status                  - "Active" | "Inactive"
   *
   * File fields (all optional — pass File object or null):
   * @param {File|null} data.purchaseOrderFile
   * @param {File|null} data.billReceiptFile
   * @param {File|null} data.installationReportFile
   * @param {File|null} data.iqOqPqProtocolFile
   * @param {File|null} data.userOperationsManualFile
   * @param {File|null} data.equipmentPhotographFile
   * @param {File|null} data.latestCalibrationCert
   *
   * @param {Function|null} onProgress - Progress callback (0-100)
   */
  createInstrument: async (data, onProgress = null) => {
    const report = (pct) => onProgress?.(pct);
    const instrumentName = data.instrumentNomenclature || "instrument";

    report(5);

    // Upload all files in parallel
    const uploads = await Promise.all(
      FILE_FIELDS.map(({ field, subType }) =>
        uploadInstrumentFile(data[field], instrumentName, subType)
      )
    );

    report(80);

    // Build JSON payload — file fields use URL strings
    // NOTE: latestCalibrationCert has no "File" suffix in the field name
    const [po, bill, install, iqoqpq, manual, photo, calibration] = uploads;

    const payload = {
      instrumentNomenclature:      data.instrumentNomenclature,
      operatingDepartment:         data.operatingDepartment,
      expiryDate:                  data.expiryDate,
      preventiveMaintenanceNotes:  data.preventiveMaintenanceNotes,
      status:                      data.status || "Active",

      purchaseOrderFile:           po.fileUrl,
      purchaseOrderFileName:       po.originalName,

      billReceiptFile:             bill.fileUrl,
      billReceiptFileName:         bill.originalName,

      installationReportFile:      install.fileUrl,
      installationReportFileName:  install.originalName,

      iqOqPqProtocolFile:          iqoqpq.fileUrl,
      iqOqPqProtocolFileName:      iqoqpq.originalName,

      userOperationsManualFile:    manual.fileUrl,
      userOperationsManualFileName: manual.originalName,

      equipmentPhotographFile:     photo.fileUrl,
      equipmentPhotographFileName: photo.originalName,

      latestCalibrationCert:       calibration.fileUrl,       // ← no "File" suffix
      latestCalibrationCertFileName: calibration.originalName,
    };

    report(90);

    try {
      const response = await api.post(
        "/InstrumentCalibration/CreateInstrumentCalibration",
        payload,
      );
      report(100);
      return response.data;
    } catch (error) {
      console.error("Error creating instrument:", error);
      throw error;
    }
  },

  // ── Update ───────────────────────────────────────────────────────────────────

  /**
   * Updates an instrument calibration record.
   * Re-uploads any files that are new File objects.
   * Preserves existing URLs for fields where no new file is provided.
   *
   * @param {number|string} id   - Instrument ID
   * @param {Object} data        - Same shape as createInstrument data
   *                               For unchanged files, pass the existing URL string
   *                               For new files, pass the File object
   * @param {Function|null} onProgress
   */
  updateInstrument: async (id, data, onProgress = null) => {
    const report = (pct) => onProgress?.(pct);
    const instrumentName = data.instrumentNomenclature || "instrument";

    report(5);

    // Upload only fields that are File objects — keep existing URLs for the rest
    const uploads = await Promise.all(
      FILE_FIELDS.map(({ field, subType }) => {
        const value = data[field];
        if (value instanceof File) {
          // New file selected — upload to R2
          return uploadInstrumentFile(value, instrumentName, subType);
        }
        // Existing URL string — preserve as-is
        return Promise.resolve({
          fileUrl:      typeof value === "string" ? value : "",
          originalName: data[`${field}Name`] || data[`${field.replace("File", "")}FileName`] || "",
        });
      })
    );

    report(80);

    const [po, bill, install, iqoqpq, manual, photo, calibration] = uploads;

    const payload = {
      instrumentNomenclature:      data.instrumentNomenclature,
      operatingDepartment:         data.operatingDepartment,
      expiryDate:                  data.expiryDate,
      preventiveMaintenanceNotes:  data.preventiveMaintenanceNotes,
      status:                      data.status || "Active",

      purchaseOrderFile:           po.fileUrl,
      purchaseOrderFileName:       po.originalName,

      billReceiptFile:             bill.fileUrl,
      billReceiptFileName:         bill.originalName,

      installationReportFile:      install.fileUrl,
      installationReportFileName:  install.originalName,

      iqOqPqProtocolFile:          iqoqpq.fileUrl,
      iqOqPqProtocolFileName:      iqoqpq.originalName,

      userOperationsManualFile:    manual.fileUrl,
      userOperationsManualFileName: manual.originalName,

      equipmentPhotographFile:     photo.fileUrl,
      equipmentPhotographFileName: photo.originalName,

      latestCalibrationCert:       calibration.fileUrl,
      latestCalibrationCertFileName: calibration.originalName,
    };

    report(90);

    try {
      const response = await api.put(
        `/InstrumentCalibration/UpdateInstrumentCalibration/${id}`,
        payload,
      );
      report(100);
      return response.data;
    } catch (error) {
      console.error(`Error updating instrument ${id}:`, error);
      throw error;
    }
  },

  // ── Delete ───────────────────────────────────────────────────────────────────

  deleteInstrument: async (id) => {
    try {
      const response = await api.delete(
        `/InstrumentCalibration/DeleteInstrumentCalibration/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting instrument ${id}:`, error);
      throw error;
    }
  },

  // ── URL normalizer ────────────────────────────────────────────────────────────

  /**
   * Normalizes a file path from GET response for display.
   * Handles both R2 URLs and legacy Plesk paths.
   *
   * GET response uses "FilePath" suffix — e.g. purchaseOrderFilePath
   * This helper is used in Instrument.jsx when normalizing list data.
   *
   * @param {string} path - URL or relative path from API response
   * @returns {string}
   */
  getFileUrl: (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;  // R2 URL or any full URL — use as-is
    // Legacy Plesk relative path fallback
    const clean = path.replace(/\\/g, "/").replace(/^\//, "");
    return `https://qmsapi.altwise.in/${clean}`;
  },
};

export default instrumentService;