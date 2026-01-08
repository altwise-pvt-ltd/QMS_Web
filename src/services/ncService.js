import { db } from "../db";

/**
 * NC Service
 *
 * Provides methods for interacting with the Non-Conformance (NC) reports stored in Dexie.
 */
const ncService = {
  /**
   * Saves or updates an NC report in the local database.
   *
   * @param {Object} report - The NC report data payload.
   * @returns {Promise<string>} The ID of the saved report.
   */
  async saveNCReport(report) {
    if (!report.id) {
      report.id = crypto.randomUUID();
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
