import api from "../../../auth/api";

/**
 * Service for handling department-related API calls.
 */
export const getDepartments = async () => {
    try {
        const response = await api.get("/Department/GetAllDepartments");
        return response.data;
    } catch (error) {
        console.error("Error fetching departments:", error);
        throw error;
    }
};

/**
 * Service for adding a new department.
 * @param {Object} departmentData - The department data to save.
 */
export const addDepartment = async (departmentData) => {
    try {
        const response = await api.post("/Department/CreateDepartment", departmentData);
        return response.data;
    } catch (error) {
        console.error("Error adding department:", error);
        throw error;
    }
};

/**
 * Service for updating an existing department.
 * @param {Object} departmentData - The department data to update.
 */
export const updateDepartment = async (departmentData) => {
    try {
        const response = await api.put("/Department/UpdateDepartment", departmentData);
        return response.data;
    } catch (error) {
        console.error("Error updating department:", error);
        throw error;
    }
};

/**
 * Service for fetching a single department by ID.
 * @param {number|string} id - The department ID.
 */
export const getDepartmentById = async (id) => {
    try {
        const response = await api.get(`/Department/GetDepartmentById/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching department by ID:", error);
        throw error;
    }
};

/**
 * Service for deleting a department.
 * @param {number|string} id - The department ID to delete.
 */
export const deleteDepartment = async (id) => {
    try {
        const response = await api.delete(`/Department/DeleteDepartment/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting department:", error);
        throw error;
    }
};

/**
 * Service for fetching staff member by department ID.
 * @param {number|string} departmentId - The ID of the department.
 */
export const getDepartmentWiseStaff = async (departmentId) => {
    try {
        const response = await api.get(`/Department/GetDepartmentWiseStaff`, {
            params: { departmentId }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching department staff:", error);
        throw error;
    }
};

/**
 * Service for fetching staff member by department name.
 * @param {string} name - The name of the department.
 */
export const getStaffByDepartmentName = async (name) => {
    try {
        const response = await api.get(`/Department/GetStaffByDepartmentName/${name}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching staff by department name:", error);
        throw error;
    }
};
