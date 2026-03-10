export const DUMMY_ENTRIES = [
    {
        id: 1,
        name: "Blood Refrigerator Temperature",
        recordingCycle: "daily",
        entryParameters: ["Morning", "Afternoon", "Evening"],
    },
    {
        id: 2,
        name: "Room Temperature & Humidity",
        recordingCycle: "daily",
        entryParameters: ["Temp °C", "Humidity %"],
    },
];

export const INITIAL_RECORDS = [
    {
        id: Date.now() + 1,
        entryId: 1,
        parameter: "Morning",
        date: new Date().toISOString().split("T")[0],
        time: "08:30",
        value: "4.2",
        remarks: "Steady",
    },
    {
        id: Date.now() + 2,
        entryId: 2,
        parameter: "Temp °C",
        date: new Date().toISOString().split("T")[0],
        time: "10:15",
        value: "22.5",
        remarks: "Normal",
    },
];
