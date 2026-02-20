/**
 * Maps API vendor data to local UI data structure.
 * @param {Object} apiVendor - Vendor data from API.
 * @param {number} currentCount - Current number of vendors for fallback ID.
 * @returns {Object} Local vendor structure.
 */
export const mapApiToLocalVendor = (apiVendor, currentCount = 0) => {
  return {
    id: apiVendor.vendorManagementId || currentCount + 1,
    name: apiVendor.vendorName,
    phone: apiVendor.phoneNumber,
    email: apiVendor.emailAddress,
    category: apiVendor.itemCategoryDealt,
    contactPerson: apiVendor.contactPersonName,
    type: apiVendor.vendorType,
    address: apiVendor.address,
    status: apiVendor.status,
    evaluation: {
      quality: apiVendor.qualityScore || 0,
      delivery: apiVendor.deliveryScore || 0,
      price: apiVendor.priceScore || 0,
      equipment: apiVendor.equipmentScore || 0,
      service: apiVendor.serviceSupportScore || 0,
      totalScore: apiVendor.totalScore || 0,
      status: apiVendor.acceptanceStatus || "Pending",
    },
  };
};

/**
 * Maps local vendor data to API payload structure.
 * @param {Object} localVendor - Local vendor data from form.
 * @returns {Object} API payload.
 */
export const mapLocalToApiVendor = (localVendor) => {
  return {
    vendorManagementId: localVendor.id || 0,
    vendorName: localVendor.name,
    assessmentDate: localVendor.assessmentDate || new Date().toISOString(),
    phoneNumber: localVendor.phone,
    emailAddress: localVendor.email,
    itemCategoryDealt: localVendor.category,
    contactPersonName: localVendor.contactPerson,
    vendorType: localVendor.type,
    address: localVendor.address,
    status: localVendor.status || "Active",
    qualityScore: localVendor.evaluation?.quality || 0,
    deliveryScore: localVendor.evaluation?.delivery || 0,
    priceScore: localVendor.evaluation?.price || 0,
    equipmentScore: localVendor.evaluation?.equipment || 0,
    serviceSupportScore: localVendor.evaluation?.service || 0,
    totalScore: localVendor.evaluation?.totalScore || 0,
    acceptanceStatus: localVendor.evaluation?.status || "Pending",
  };
};
