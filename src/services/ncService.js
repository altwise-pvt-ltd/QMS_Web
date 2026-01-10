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
    if (!report.id) {
      report.id = crypto.randomUUID();
    }

    // NEW Logic: If evidenceImage is a File object, upload it to Cloudflare R2
    if (report.entry?.evidenceImage instanceof File) {
      try {
        console.log(
          "📸 Evidence image detected. Uploading to remote storage..."
        );
        const uploadResponse = await uploadFile(report.entry.evidenceImage);

        // Replace the File object with the remote URL for persistent storage
        report.entry.evidenceImage = uploadResponse.fileUrl;
        console.log("🔗 Image uploaded successfully:", uploadResponse.fileUrl);
      } catch (uploadError) {
        console.error(
          "⚠️ Image upload failed, storing locally instead:",
          uploadError
        );
        // Fallback: stay as File object (Dexie will store locally)
      }
    }

    console.log("💾 Saving NC report to Dexie:", report);

    try {
      await db.nc_reports.put(report);
      console.log("✅ NC report saved successfully.");
      return report.id;
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
