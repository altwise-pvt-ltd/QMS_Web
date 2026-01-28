// Entries Management Configuration and Dummy Data

export const LOG_TYPES = {
  REFRIGERATOR: {
    id: "refrigerator",
    title: "REFRIGERATOR TEMPERATURE LOG",
    docNo: "ADC-L-04",
    rows: ["Mor. Temp.", "Eve. Temp.", "Sign"],
  },
  ROOM_TEMP: {
    id: "room_temp",
    title: "ROOM TEMPERATURE & HUMIDITY LOG",
    docNo: "ADC-L-01",
    rows: [
      "Temperature (Morning)",
      "Humidity (Morning)",
      "Time (Morning)",
      "Sign",
      "Temperature (Evening)",
      "Humidity (Evening)",
      "Time (Evening)",
      "Sign",
    ],
  },
  HYPOCHLORITE: {
    id: "hypochlorite",
    title: "1% HYPOCHLORITE PREPARATION LOG",
    docNo: "ADC-L-03",
  },
  MICROSCOPE: {
    id: "microscope",
    title: "DAILY MAINTENANCE LOG FOR MICROSCOPE",
    docNo: "ADC-LOG-09",
    tasks: [
      "Cleaning objective lens",
      "Cleaning external surface",
      "Check microscope frame",
      "Check optical axis",
      "Check left/right axis",
      "Check revolving axis",
      "Check parfocality",
      "Check Resolution",
      "Initials",
    ],
  },
  HOUSEKEEPING: {
    id: "housekeeping",
    title: "GENERAL HOUSE KEEPING LOG",
    docNo: "ADC-L-06",
    daily: ["Floor Cleaning", "Laboratory Bench", "Toilets", "Cupboards"],
    weekly: ["Refrigerator", "Furniture"],
  },
};

export const DUMMY_ENTRIES = [
  {
    id: 1,
    name: "Refrigerator Temperature Log",
    cycle: "Daily",
    type: "refrigerator",
  },
  {
    id: 2,
    name: "Room Temperature & Humidity Log",
    cycle: "Daily",
    type: "room_temp",
  },
  {
    id: 3,
    name: "1% Hypochlorite Preparation Log",
    cycle: "Daily",
    type: "hypochlorite",
  },
  {
    id: 4,
    name: "Daily Maintenance Log for Microscope",
    cycle: "Daily",
    type: "microscope",
  },
  {
    id: 5,
    name: "General House Keeping Log",
    cycle: "Weekly",
    type: "housekeeping",
  },
];

export const DUMMY_LABS = [
  { id: 101, entryId: 1, name: "Laboratory", code: "LB-01" },
  { id: 102, entryId: 1, name: "Laboratory1", code: "LB-02" },
  { id: 201, entryId: 2, name: "Laboratory2", code: "LB-03" },
  { id: 301, entryId: 3, name: "Laboratory3", code: "LB-04" },
  { id: 401, entryId: 4, name: "Laboratory4", code: "LB-05" },
  { id: 501, entryId: 5, name: "Laboratory5", code: "LB-06" },
];

export const RECORDING_CYCLES = [
  { label: "Daily", value: "Daily" },
  { label: "Weekly", value: "Weekly" },
  { label: "Alternative Days", value: "Alternative Days" },
];

// Helper for generating consistent dummy records for the history view
export const getHistoryRecords = (entryName, labName = "") => {
  const today = new Date().getDate();
  return [...Array(today)].map((_, i) => {
    const dayNum = today - i;
    const date = new Date();
    date.setDate(dayNum);

    const isTemp = entryName.toLowerCase().includes("temperature");
    const isHumidity = entryName.toLowerCase().includes("humidity");

    return {
      id: `rec-${dayNum}-${labName.replace(/\s+/g, "-")}`,
      date: date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: dayNum % 7 === 0 ? "Pending" : "Verified",
      value: isTemp
        ? (2 + Math.random() * 4).toFixed(1) + "°C"
        : isHumidity
          ? (45 + Math.random() * 10).toFixed(0) + "%"
          : "Done / OK",
      recordedBy: "Admin User",
      initials: "AD",
      lab: labName || "All Labs",
    };
  });
};
