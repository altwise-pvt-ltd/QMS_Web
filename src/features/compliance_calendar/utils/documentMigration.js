import { db } from "../../../db/index";

/**
 * Add expiry dates to existing documents that don't have them
 * This is a one-time migration utility
 */
export const addExpiryDatesToDocuments = async () => {
  try {
    console.log("Starting to add expiry dates to existing documents...");

    // Get all documents
    const allDocuments = await db.documents.toArray();
    console.log(`Found ${allDocuments.length} documents`);

    let updatedCount = 0;

    // Update documents that don't have expiry dates
    for (const doc of allDocuments) {
      if (!doc.expiryDate) {
        // Calculate expiry date based on document type
        let expiryDate;

        // Parse createdDate with validation
        let createdDate = new Date();
        if (doc.createdDate) {
          const parsedDate = new Date(doc.createdDate);
          // Check if the date is valid
          if (!isNaN(parsedDate.getTime())) {
            createdDate = parsedDate;
          } else {
            console.warn(
              `Invalid createdDate for document ${doc.id}: ${doc.createdDate}, using current date`,
            );
          }
        }

        // Set different expiry periods based on category
        if (
          doc.category === "Quality Manual" ||
          doc.category === "Procedures"
        ) {
          // Quality documents: 3 years
          expiryDate = new Date(createdDate);
          expiryDate.setFullYear(expiryDate.getFullYear() + 3);
        } else if (doc.category === "Forms" || doc.category === "Templates") {
          // Forms and templates: 2 years
          expiryDate = new Date(createdDate);
          expiryDate.setFullYear(expiryDate.getFullYear() + 2);
        } else if (doc.category === "Records") {
          // Records: 5 years (regulatory requirement)
          expiryDate = new Date(createdDate);
          expiryDate.setFullYear(expiryDate.getFullYear() + 5);
        } else {
          // Default: 1 year
          expiryDate = new Date(createdDate);
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        }

        // Format as YYYY-MM-DD
        const formattedExpiryDate = expiryDate.toISOString().split("T")[0];

        // Update the document
        await db.documents.update(doc.id, {
          expiryDate: formattedExpiryDate,
        });

        updatedCount++;
        console.log(
          `Updated document: ${doc.name} with expiry date: ${formattedExpiryDate}`,
        );
      }
    }

    console.log(
      `✅ Successfully added expiry dates to ${updatedCount} documents`,
    );
    return {
      success: true,
      totalDocuments: allDocuments.length,
      updatedDocuments: updatedCount,
    };
  } catch (error) {
    console.error("Error adding expiry dates:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Set custom expiry date for a specific document
 */
export const setDocumentExpiryDate = async (documentId, expiryDate) => {
  try {
    await db.documents.update(documentId, {
      expiryDate: expiryDate,
    });
    console.log(
      `✅ Updated document ${documentId} with expiry date: ${expiryDate}`,
    );
    return { success: true };
  } catch (error) {
    console.error("Error setting expiry date:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Bulk update expiry dates for multiple documents
 */
export const bulkUpdateExpiryDates = async (updates) => {
  try {
    for (const update of updates) {
      await db.documents.update(update.id, {
        expiryDate: update.expiryDate,
      });
    }
    console.log(`✅ Bulk updated ${updates.length} documents`);
    return { success: true, count: updates.length };
  } catch (error) {
    console.error("Error bulk updating expiry dates:", error);
    return { success: false, error: error.message };
  }
};
