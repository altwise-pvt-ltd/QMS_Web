import api from "../../../auth/api";
import { mapApiToLocalVendor, mapLocalToApiVendor } from "../utils/vendorMapper";

/**
 * Vendor Service for handling Vendor-related API calls.
 */
export const vendorService = {
  /**
   * Fetch all vendors.
   */
  /**
   * Fetch all vendors.
   */
  getVendors: async () => {
    try {
      const response = await api.get("/Vendor/GetAllVendors");
      return (response.data || []).map(mapApiToLocalVendor);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      throw error;
    }
  },

  /**
   * Fetch vendors by type (e.g., Approved, New).
   * @param {string} type - The vendor type to filter by.
   */
  getVendorsByType: async (type) => {
    try {
      const response = await api.get(`/Vendor/GetVendorsByType/${type}`);
      return (response.data || []).map(mapApiToLocalVendor);
    } catch (error) {
      console.error(`Error fetching vendors by type ${type}:`, error);
      throw error;
    }
  },

  /**
   * Fetch a single vendor by ID.
   */
  getVendorById: async (id) => {
    try {
      const response = await api.get(`/Vendor/GetVendorById/${id}`);
      return mapApiToLocalVendor(response.data);
    } catch (error) {
      console.error(`Error fetching vendor ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new vendor.
   */
  createVendor: async (vendorData) => {
    try {
      const payload = mapLocalToApiVendor(vendorData);
      const response = await api.post("/Vendor/CreateVendor", payload);
      return mapApiToLocalVendor(response.data);
    } catch (error) {
      console.error("Error creating vendor:", error);
      throw error;
    }
  },

  /**
   * Update an existing vendor.
   */
  updateVendor: async (id, vendorData) => {
    try {
      const payload = mapLocalToApiVendor({ ...vendorData, id });
      const response = await api.put("/Vendor/UpdateVendor", payload);
      return mapApiToLocalVendor(response.data);
    } catch (error) {
      console.error(`Error updating vendor ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a vendor.
   */
  deleteVendor: async (id) => {
    try {
      const response = await api.delete(`/Vendor/DeleteVendor/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting vendor ${id}:`, error);
      throw error;
    }
  },
};

export default vendorService;
