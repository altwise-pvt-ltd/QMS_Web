
/**
 * Maps API Category response to UI Category structure.
 * @param {Object} apiCategory
 * @param {Object} config - UI configuration (icon, color) for this level
 * @returns {Object} UI Category
 */
export const transformCategory = (apiCategory, config) => {
  // Extract level number from "Level 1" string or similar
  // Assuming documentCategoryLevel is a string "Level 1" or number 1
  let levelNumber = 0;
  if (typeof apiCategory.documentCategoryLevel === 'string') {
    const match = apiCategory.documentCategoryLevel.match(/\d+/);
    levelNumber = match ? parseInt(match[0], 10) : 0;
  } else {
    levelNumber = apiCategory.documentCategoryLevel;
  }

  return {
    id: apiCategory.documentCategoryId, // Keep API ID
    level: levelNumber,
    title: apiCategory.documentCategoryTitle,
    description: apiCategory.documentCategoryDescription,
    icon: config?.icon || null, // Injected from config
    color: config?.color || "bg-gray-100 text-gray-600",
    items: [], // Will be populated when subcategories are fetched
    ...config, // Spread other config props if any (like hardcoded icon if passed)
  };
};

/**
 * Maps API SubCategory response to UI Item structure.
 * @param {Object} apiSubCategory
 * @returns {Object} UI Item
 */
export const transformSubCategory = (apiSubCategory) => {
  return {
    id: apiSubCategory.documentSubCategoryId,
    name: apiSubCategory.documentSubCategoryName,
    // Add other fields if needed for UI, e.g., link, type, etc.
  };
};