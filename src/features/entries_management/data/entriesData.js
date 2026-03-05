export const RECORDING_CYCLES = [
  { label: "Daily", value: "Daily" },
  { label: "Weekly", value: "Weekly" },
  { label: "Monthly", value: "Monthly" },
];

export const LOG_TYPES = {
  REFRIGERATOR: {
    id: "refrigerator",
    title: "REFRIGERATOR TEMPERATURE LOG",
    rows: ["Morning Temp (°C)", "Evening Temp (°C)", "Initials"],
    docNo: "QMS/LOG/REF/01",
  },
  ROOM_TEMP: {
    id: "room_temp",
    title: "ROOM TEMPERATURE & HUMIDITY LOG",
    rows: ["Temperature (°C)", "Humidity (%)", "Initials"],
    docNo: "QMS/LOG/ROOM/01",
  },
  HYPOCHLORITE: {
    id: "hypochlorite",
    title: "HYPOCHLORITE PREPARATION LOG",
    docNo: "QMS/LOG/HYPO/01",
  },
  MICROSCOPE: {
    id: "microscope",
    title: "MICROSCOPE MAINTENANCE LOG",
    tasks: ["Cleaning of Objectives", "Cleaning of Eyepieces", "Stage Cleaning", "Initials"],
    docNo: "QMS/LOG/MIC/01",
  },
  HOUSEKEEPING: {
    id: "housekeeping",
    title: "HOUSEKEEPING & SANITATION LOG",
    daily: ["Floor Cleaning", "Waste Management", "Surface Sanitation"],
    weekly: ["Equipment Deep Clean", "Inventory Check"],
    docNo: "QMS/LOG/HK/01",
  },
};
