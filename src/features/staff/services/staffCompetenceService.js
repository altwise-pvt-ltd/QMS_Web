import api from "../../../auth/api";
import { uploadFile } from "../../../services/workerService";

/**
 * staffCompetenceService.js
 *
 * Handles Staff Competence & Skills API calls.
 *
 * POST flow (two-step for training files):
 *   Step 1 — Each training certificate file → QMS Worker → R2
 *             Path: qmsdocs/staff/{staffname}_{staffId}/trainings/{uuid}.pdf
 *   Step 2 — JSON payload with R2 URL strings → POST /Staff/createStaffCompetence
 *
 * Confirmed POST payload shape (from Postman):
 * {
 *   staffId: number,
 *   staffAssessmentCompetenceStatus: string,
 *   staffAssessorName: string,
 *   staffAssessmentRecommendations: string,
 *   assessmentDate: string,               // "2026-03-05T00:00:00"
 *   skills: [{
 *     staffSkillsAndCompetencyMatrixId: 0,
 *     staffId: number,
 *     skillName: string,
 *     requestLevel: number,
 *     actualLevel: number,
 *     staffSkillsAndCompetencyMatrixStatus: string
 *   }],
 *   trainings: [{
 *     staffTrainingAndCertificationId: 0,
 *     staffId: number,
 *     trainingOrCertificateTitle: string,
 *     trainingOrCertificateType: string,
 *     trainingOrCertificateFilePath: string,   ← R2 URL
 *     completionDate: string,
 *     expiryDate: string | null
 *   }]
 * }
 *
 * Skill status derivation:
 *   actualLevel < requestLevel  → "Gap"
 *   actualLevel === requestLevel → "Competent"
 *   actualLevel > requestLevel  → "Competent"
 *   (caller can override via explicit status field)
 */

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Derives staffSkillsAndCompetencyMatrixStatus from levels.
 * Matches backend enum values confirmed in Postman.
 */
function deriveSkillStatus(requestLevel, actualLevel) {
  const req = Number(requestLevel) || 0;
  const act = Number(actualLevel)  || 0;
  if (act < req) return "Gap";
  return "Competent";
}

/**
 * Uploads a single training certificate file to R2.
 * Returns R2 URL string, or "" if no file.
 *
 * @param {File|null} file
 * @param {number|string} staffId
 * @param {string} staffName  - e.g. "Rudra Indurkar" → slugified to "rudra-indurkar"
 */
async function uploadTrainingFile(file, staffId, staffName) {
  if (!file || !(file instanceof File)) return "";

  const r2Result = await uploadFile(file, {
    module:    "staff",
    staffId:   String(staffId),
    staffName: staffName || "staff",
    subType:   "trainings",
  });

  return r2Result.fileUrl;
}

// ─── Service ──────────────────────────────────────────────────────────────────

const staffCompetenceService = {

  // ── Create / Upsert ─────────────────────────────────────────────────────────

  /**
   * Creates (or updates) a staff competence record.
   * Uploads any training certificate files to R2 first.
   *
   * @param {Object} data
   * @param {number|string} data.staffId                        - Required
   * @param {string}        data.staffName                      - Required (for R2 path)
   * @param {string}        data.staffAssessmentCompetenceStatus - "Competent" | "Needs Training" | "Gap"
   * @param {string}        data.staffAssessorName
   * @param {string}        data.staffAssessmentRecommendations
   * @param {string}        data.assessmentDate                 - "YYYY-MM-DD" or ISO
   *
   * @param {Array} data.skills - [{
   *   skillName: string,
   *   requestLevel: number,   // 1-5
   *   actualLevel: number,    // 1-5
   *   status?: string         // optional override — auto-derived if omitted
   * }]
   *
   * @param {Array} data.trainings - [{
   *   trainingOrCertificateTitle: string,
   *   trainingOrCertificateType: "Certification" | "Training",
   *   certificateFile: File | null,        // uploaded to R2
   *   existingFilePath?: string,           // used if no new file (edit mode)
   *   completionDate: string,              // "YYYY-MM-DD"
   *   expiryDate: string | null
   * }]
   *
   * @param {Function|null} onProgress - Progress callback (0-100)
   */
  createCompetence: async (data, onProgress = null) => {
    const report = (pct) => onProgress?.(pct);
    const { staffId, staffName } = data;

    if (!staffId)   throw new Error("staffId is required");
    if (!staffName) throw new Error("staffName is required");

    report(5);

    // ── Step 1: Upload training certificate files in parallel ─────────────────
    const trainings = data.trainings || [];
    const fileUrls = await Promise.all(
      trainings.map((t) => {
        if (t.certificateFile instanceof File) {
          return uploadTrainingFile(t.certificateFile, staffId, staffName);
        }
        // Preserve existing URL in edit mode
        return Promise.resolve(t.existingFilePath || "");
      })
    );

    report(70);

    // ── Step 2: Build JSON payload ────────────────────────────────────────────

    // Ensure assessmentDate is ISO datetime format backend expects
    const assessmentDate = data.assessmentDate
      ? data.assessmentDate.includes("T")
        ? data.assessmentDate
        : `${data.assessmentDate}T00:00:00`
      : new Date().toISOString().split(".")[0];

    const payload = {
      staffId:                          Number(staffId),
      staffAssessmentCompetenceStatus:  data.staffAssessmentCompetenceStatus || "Competent",
      staffAssessorName:                data.staffAssessorName || "",
      staffAssessmentRecommendations:   data.staffAssessmentRecommendations || "",
      assessmentDate,

      skills: (data.skills || []).map((skill) => ({
        staffSkillsAndCompetencyMatrixId: Number(skill.staffSkillsAndCompetencyMatrixId) || 0,
        staffId:                          Number(staffId),
        skillName:                        skill.skillName || "",
        requestLevel:                     Number(skill.requestLevel) || 0,
        actualLevel:                      Number(skill.actualLevel)  || 0,
        // Use explicit status if provided, otherwise auto-derive
        staffSkillsAndCompetencyMatrixStatus:
          skill.status || deriveSkillStatus(skill.requestLevel, skill.actualLevel),
      })),

      trainings: trainings.map((t, i) => ({
        staffTrainingAndCertificationId: Number(t.staffTrainingAndCertificationId) || 0,
        staffId:                         Number(staffId),
        trainingOrCertificateTitle:      t.trainingOrCertificateTitle || "",
        trainingOrCertificateType:       t.trainingOrCertificateType  || "Training",
        trainingOrCertificateFilePath:   fileUrls[i] || "",  // R2 URL
        // Ensure ISO datetime format
        completionDate: t.completionDate
          ? t.completionDate.includes("T") ? t.completionDate : `${t.completionDate}T00:00:00`
          : null,
        expiryDate: t.expiryDate
          ? t.expiryDate.includes("T") ? t.expiryDate : `${t.expiryDate}T00:00:00`
          : null,
      })),
    };

    report(85);

    // ── Step 3: POST JSON to backend ──────────────────────────────────────────
    try {
      const response = await api.post(
        "/Staff/createStaffCompetence",
        payload,
      );
      report(100);
      return response.data;
    } catch (error) {
      console.error("Error creating staff competence:", error);
      throw error;
    }
  },

  // ── Read ─────────────────────────────────────────────────────────────────────

  /**
   * Returns all staff with their competence summary.
   * Used for listing/overview screens.
   *
   * Response: [{staffId, firstName, lastName, jobTitle,
   *             staffAssessmentCompetenceStatus, assessmentDate, organizationId}]
   */
  getAllCompetence: async () => {
    try {
      const response = await api.get("/Staff/getAllStaffCompetence");
      return response.data;
    } catch (error) {
      console.error("Error fetching all staff competence:", error);
      throw error;
    }
  },

  /**
   * Returns full competence record for one staff member.
   * Used for the edit/detail view.
   *
   * Response: {
   *   staff: { staffId, firstName, lastName, staffAssessmentCompetenceStatus,
   *             staffAssessorName, staffAssessmentRecommendations, assessmentDate, organizationId },
   *   skills: [{ staffSkillsAndCompetencyMatrixId, skillName, requestLevel,
   *               actualLevel, staffSkillsAndCompetencyMatrixStatus, staffId, ... }],
   *   trainings: [{ staffTrainingAndCertificationId, staffId, trainingOrCertificateTitle,
   *                  trainingOrCertificateType, trainingOrCertificateFilePath,
   *                  completionDate, expiryDate, ... }]
   * }
   *
   * @param {number|string} staffId
   */
  getCompetenceByStaffId: async (staffId) => {
    try {
      const response = await api.get(`/Staff/getStaffCompetenceByStaffId/${staffId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching competence for staff ${staffId}:`, error);
      throw error;
    }
  },
};

export default staffCompetenceService;