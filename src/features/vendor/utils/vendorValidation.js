/**
 * Vendor Validation Rules
 */

export const vendorValidation = {
  validate: (data) => {
    const errors = {};

    // Vendor Name
    if (!data.name || data.name.trim().length < 3) {
      errors.name = "Vendor name must be at least 3 characters.";
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      errors.email = "Please enter a valid email address.";
    }

    // Phone
    const phoneRegex = /^\d{10}$/;
    if (!data.phone || !phoneRegex.test(data.phone)) {
      errors.phone = "Phone number must be exactly 10 digits.";
    }

    // Category
    if (!data.category) {
      errors.category = "Category/Item dealt is required.";
    }

    // Type
    if (!data.type) {
      errors.type = "Vendor type is required.";
    }

    // Address
    if (!data.address || data.address.trim().length < 5) {
      errors.address = "Complete business address is required.";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

export default vendorValidation;
