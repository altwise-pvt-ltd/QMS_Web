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
        const response = await api.post("/Department/AddDepartment", departmentData);
        return response.data;
    } catch (error) {
        console.error("Error adding department:", error);
        throw error;
    }
};
