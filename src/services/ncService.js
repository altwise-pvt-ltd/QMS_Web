import { db } from "../db";
import { uploadFile } from "./documentService";

/**
 * NC Service
 *
 * Provides methods for interacting with the Non-Conformance (NC) reports stored in Dexie.
 */
const ncService = {
  /**
   * Saves or updates an NC report in the local database.
   * Now supporting remote image upload for traceability.
   *
   * @param {Object} report - The NC report data payload.
   * @returns {Promise<string>} The ID of the saved report.
   */
  async saveNCReport(report) {
    // Strip id if it exists but is falsy (especially if undefined) to allow ++id auto-increment
    const { id, ...reportData } = report;
    const finalReport = id ? { id, ...reportData } : reportData;

    // NEW Logic: If evidenceImage is a File object, upload it to Cloudflare R2
    if (finalReport.entry?.evidenceImage instanceof File) {
      try {
        console.log(
          "📸 Evidence image detected. Uploading to remote storage..."
        );
        const uploadResponse = await uploadFile(finalReport.entry.evidenceImage);

        // Replace the File object with the remote URL for persistent storage
        finalReport.entry.evidenceImage = uploadResponse.fileUrl;
        console.log("🔗 Image uploaded successfully:", uploadResponse.fileUrl);
      } catch (uploadError) {
        console.error(
          "⚠️ Image upload failed, storing locally instead:",
          uploadError
        );
        // Fallback: stay as File object (Dexie will store locally)
      }
    }

    console.log("💾 Saving NC report to Dexie:", finalReport);

    try {
      const savedId = await db.nc_reports.put(finalReport);
      console.log("✅ NC report saved successfully.");
      return savedId;
    } catch (error) {
      console.error("❌ Failed to save NC report:", error);
      throw error;
    }
  },

  /**
   * Retrieves all NC reports from the database, ordered by modification date.
   *
   * @returns {Promise<Array>} List of NC reports.
   */
  async getNCReports() {
    return await db.nc_reports.orderBy("lastModified").reverse().toArray();
  },

  /**
   * Deletes an NC report by ID.
   *
   * @param {string} id - The unique ID of the report to delete.
   */
  async deleteNCReport(id) {
    return await db.nc_reports.delete(id);
  },
};

export default ncService;
