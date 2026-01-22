export const initialVendors = [
    {
        id: 1,
        name: "Global Biotech Solutions",
        phone: "+1-555-0123",
        email: "info@globalbiotech.com",
        address: "123 Science Park, Boston, MA",
        category: "Reagents / Chemicals",
        contactPerson: "Dr. Sarah Miller",
        type: "Existing",
        evaluation: {
            quality: 40,
            delivery: 50,
            price: 30,
            equipment: 40,
            service: 50,
            totalScore: 210,
            status: "Accepted"
        }
    },
    {
        id: 2,
        name: "Precision Lab Equipments",
        phone: "+1-555-0456",
        email: "sales@precisionlab.com",
        address: "456 Industrial Way, Chicago, IL",
        category: "Equipment",
        contactPerson: "John Doe",
        type: "Existing",
        evaluation: {
            quality: 50,
            delivery: 40,
            price: 40,
            equipment: 50,
            service: 40,
            totalScore: 220,
            status: "Accepted"
        }
    },
    {
        id: 3,
        name: "MediSource Supplies",
        phone: "+1-555-0789",
        email: "contact@medisource.com",
        address: "789 Medical Plaza, Austin, TX",
        category: "Consumables",
        contactPerson: "Alice Smith",
        type: "New",
        evaluation: null
    }
];

export const evaluationCriteria = [
    { id: "quality", label: "Quality", subHeadings: ["Critical Items / Reagents", "Reference / Controls", "Validation"] },
    { id: "delivery", label: "Delivery", subHeadings: ["On-time Reliability", "Cold Chain Maintenance", "Compliance with Shipping"] },
    { id: "price", label: "Price", subHeadings: ["Price Level", "Price History"] },
    { id: "equipment", label: "Equipment", subHeadings: ["Closed System"] },
    { id: "service", label: "Service Support", subHeadings: [] }
];

export const scores = [10, 20, 30, 40, 50];
