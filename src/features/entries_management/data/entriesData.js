export const LOG_TYPES = {
    REFRIGERATOR: {
        id: "refrigerator",
        title: "REFRIGERATOR TEMPERATURE MONITORING LOG",
        docNo: "QMS/LOG/01",
        rows: ["Temperature (Morning)", "Temperature (Evening)", "Status", "Sign"],
    },
    ROOM_TEMP: {
        id: "room_temp",
        title: "ROOM TEMPERATURE & HUMIDITY LOG",
        docNo: "QMS/LOG/02",
        rows: ["Temperature", "Humidity", "Status", "Sign"],
    },
    MICROCOPE: {
        id: "microscope",
        title: "MICROSCOPE MAINTENANCE LOG",
        docNo: "QMS/LOG/04",
        tasks: ["Lenses Cleaned", "Stage Wiped", "Light Working", "Initials"],
    },
    HYPOCHLORITE: {
        id: "hypochlorite",
        title: "HYPOCHLORITE SOLUTION PREPARATION LOG",
        docNo: "QMS/LOG/03",
    },
    HOUSEKEEPING: {
        id: "housekeeping",
        title: "HOUSEKEEPING & SANITATION LOG",
        docNo: "QMS/LOG/05",
        daily: ["Floors Cleaned", "Benches Disinfected", "Waste Disposed"],
        weekly: ["Deep Cleaning", "Shelf Wiping", "Inventory Check"],
    },
};
