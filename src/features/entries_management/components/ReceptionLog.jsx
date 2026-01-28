import React, { useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { ChevronLeft, Download, Plus, Minus } from "lucide-react";
import { LOG_TYPES } from "../data/entriesData";

const ReceptionLog = ({ entry, onBack }) => {
  // Map entry name to log type if possible, otherwise default to refrigerator
  const initialLogType =
    Object.values(LOG_TYPES).find(
      (l) =>
        entry?.name?.toLowerCase().includes(l.id.toLowerCase()) ||
        l.title.toLowerCase().includes(entry?.name?.toLowerCase()),
    )?.id || LOG_TYPES.REFRIGERATOR.id;

  const [activeLog, setActiveLog] = useState(initialLogType);

  // Use array of months for multi-month logs
  const [months, setMonths] = useState([
    {
      name: new Date()
        .toLocaleString("default", { month: "long" })
        .toUpperCase(),
      year: new Date().getFullYear(),
    },
  ]);

  const addMonth = () => {
    const lastMonth = months[months.length - 1];
    const monthNames = [
      "JANUARY",
      "FEBRUARY",
      "MARCH",
      "APRIL",
      "MAY",
      "JUNE",
      "JULY",
      "AUGUST",
      "SEPTEMBER",
      "OCTOBER",
      "NOVEMBER",
      "DECEMBER",
    ];
    let nextIdx = monthNames.indexOf(lastMonth.name) + 1;
    let nextYear = lastMonth.year;
    if (nextIdx > 11) {
      nextIdx = 0;
      nextYear++;
    }
    setMonths([...months, { name: monthNames[nextIdx], year: nextYear }]);
  };

  const removeMonth = () => {
    if (months.length > 1) setMonths(months.slice(0, -1));
  };

  const printRef = useRef();

  // Helper to generate dummy data for 31 days
  const getDummyData = (type, seed = "") => {
    const seedVal = seed.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    return [...Array(31)].map((_, i) => {
      const day = i + 1;
      const isOff = (day + seedVal) % 7 === 0;
      if (isOff) return "-"; // Weekend/off
      if (type === "status" || type === "prepared")
        return (day + seedVal) % 3 === 0 ? "OK" : "Done";
      if (type === "time") return `0${8 + ((day + seedVal) % 2)}:00`;
      if (type === "sign") return "JS";
      if (type === "temp") return (2 + Math.random() * 4).toFixed(1) + "°C";
      if (type === "hum") return (40 + Math.random() * 20).toFixed(0) + "%";
      return "";
    });
  };

  // --- Download Function ---
  const handleDownload = () => {
    const element = printRef.current;
    const opt = {
      margin: 0,
      filename: `${activeLog}_Report.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 1.5 },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    };
    html2pdf().set(opt).from(element).save();
  };

  // --- Render Helpers ---
  const currentConfig = Object.values(LOG_TYPES).find(
    (l) => l.id === activeLog,
  );

  // Common styles for PDF consistency
  const s = {
    page: {
      width: "297mm",
      height: "207mm",
      padding: "8mm 10mm",
      backgroundColor: "white",
      fontFamily: "Arial, sans-serif",
      fontSize: "10px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
    },
    header: {
      textAlign: "center",
      borderBottom: "2px solid black",
      paddingBottom: "2px",
      marginBottom: "8px",
    },
    h1: { color: "#d32f2f", fontSize: "24px", margin: 0, fontWeight: "bold" },
    address: { fontSize: "9px", fontWeight: "bold", margin: "5px 0" },
    title: {
      fontSize: "15px", // Slightly smaller
      textDecoration: "underline",
      fontWeight: "bold",
      margin: "5px 0",
    },
    table: { width: "100%", borderCollapse: "collapse", fontSize: "9px" },
    th: {
      border: "1px solid black",
      padding: "2px",
      backgroundColor: "#f0f0f0",
      textAlign: "center",
    },
    td: {
      border: "1px solid #333",
      height: "24px",
      textAlign: "center",
      padding: "2px",
    },
    tdLeft: {
      border: "1px solid #333",
      height: "24px",
      textAlign: "left",
      paddingLeft: "6px",
      fontWeight: "500",
    },
    footer: {
      marginTop: "auto",
      paddingTop: "10px",
      borderTop: "1px solid black",
      display: "flex",
      justifyContent: "space-between",
      fontSize: "10px",
      fontWeight: "bold",
    },
    contentWrapper: {
      flex: "1",
      overflow: "hidden",
    },
  };

  // 1. Standard Grid (Refrigerator & Room Temp)
  const renderStandardGrid = (rows, m) => (
    <table style={s.table}>
      <thead>
        <tr>
          <th style={{ ...s.th, width: "60px" }}>Month/Year</th>
          <th style={{ ...s.th, width: "100px" }}>Parameter</th>
          {[...Array(31)].map((_, i) => (
            <th key={i} style={{ ...s.th, width: "18px" }}>
              {i + 1}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td rowSpan={rows.length + 1} style={{ ...s.td, fontWeight: "bold" }}>
            {m.name}
            <br />
            {m.year}
          </td>
        </tr>
        {rows.map((row, idx) => (
          <tr key={idx}>
            <td style={s.tdLeft}>{row}</td>
            {getDummyData(
              row.toLowerCase().includes("temp")
                ? "temp"
                : row.toLowerCase().includes("hum")
                  ? "hum"
                  : "status",
              m.name,
            ).map((val, i) => (
              <td key={i} style={s.td}>
                {val}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  // 2. Microscope Log (Task based)
  const renderMicroscopeGrid = (tasks, m) => (
    <table style={s.table}>
      <thead>
        <tr>
          <th style={{ ...s.th, width: "150px" }}>Maintenance Check</th>
          {[...Array(31)].map((_, i) => (
            <th key={i} style={{ ...s.th, width: "20px" }}>
              {i + 1}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, idx) => (
          <tr key={idx}>
            <td style={s.tdLeft}>{task}</td>
            {getDummyData(
              task.toLowerCase().includes("initials") ? "sign" : "status",
              m.name,
            ).map((val, i) => (
              <td key={i} style={s.td}>
                {val}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  // 3. Hypochlorite Log (Custom Columns)
  const renderHypochloriteGrid = (m) => (
    <table style={s.table}>
      <thead>
        <tr>
          <th style={{ ...s.th, width: "60px" }}>Month</th>
          <th style={{ ...s.th, width: "100px" }}>Details</th>
          {[...Array(15)].map((_, i) => (
            <th key={i} style={s.th}>
              {i + 1}
            </th>
          ))}
          <th style={{ ...s.th, width: "60px" }}>Month</th>
          <th style={{ ...s.th, width: "100px" }}>Details</th>
          {[...Array(16)].map((_, i) => (
            <th key={i} style={s.th}>
              {i + 16}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {["Prepared", "Time", "Sign"].map((row, rIdx) => (
          <tr key={rIdx}>
            {rIdx === 0 && (
              <td rowSpan={3} style={s.td}>
                <b>{m.name}</b>
              </td>
            )}
            <td style={s.tdLeft}>{row}</td>
            {getDummyData(row.toLowerCase(), m.name)
              .slice(0, 15)
              .map((val, i) => (
                <td key={i} style={s.td}>
                  {val}
                </td>
              ))}
            {rIdx === 0 && (
              <td rowSpan={3} style={s.td}>
                <b>{m.name}</b>
              </td>
            )}
            <td style={s.tdLeft}>{row}</td>
            {getDummyData(row.toLowerCase(), m.name)
              .slice(15, 31)
              .map((val, i) => (
                <td key={i} style={s.td}>
                  {val}
                </td>
              ))}
          </tr>
        ))}
        <tr>
          <td
            colSpan={35}
            style={{ ...s.td, textAlign: "left", padding: "5px" }}
          >
            <b>Preparation:</b> 1500ML of 4% Hypochlorite + 4500ML Tap Water =
            1% Hypochlorite Solution.
          </td>
        </tr>
      </tbody>
    </table>
  );

  // 4. Housekeeping Log (Split Daily/Weekly)
  const renderHousekeepingGrid = (config, m) => (
    <table style={s.table}>
      <thead>
        <tr>
          <th style={{ ...s.th, width: "120px" }}>Area / Item</th>
          {[...Array(31)].map((_, i) => (
            <th key={i} style={s.th}>
              {i + 1}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            colSpan={32}
            style={{
              ...s.tdLeft,
              backgroundColor: "#e0e0e0",
              fontWeight: "bold",
            }}
          >
            DAILY
          </td>
        </tr>
        {config.daily.map((item, idx) => (
          <tr key={`d-${idx}`}>
            <td style={s.tdLeft}>{item}</td>
            {getDummyData("status", m.name).map((val, i) => (
              <td key={i} style={s.td}>
                {val}
              </td>
            ))}
          </tr>
        ))}
        <tr>
          <td
            colSpan={32}
            style={{
              ...s.tdLeft,
              backgroundColor: "#e0e0e0",
              fontWeight: "bold",
            }}
          >
            WEEKLY
          </td>
        </tr>
        {config.weekly.map((item, idx) => (
          <tr key={`w-${idx}`}>
            <td style={s.tdLeft}>{item}</td>
            {getDummyData("status").map((val, i) => (
              <td
                key={i}
                style={{
                  ...s.td,
                  backgroundColor: i % 7 === 0 ? "#f9fafb" : "white",
                }}
              >
                {i % 7 === 0 ? "OK" : ""}
              </td>
            ))}
          </tr>
        ))}
        <tr>
          <td style={s.tdLeft}>Initials</td>
          {getDummyData("sign", m.name).map((val, i) => (
            <td key={i} style={s.td}>
              {val}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );

  return (
    <div className="flex flex-col bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden h-[calc(100vh-80px)] lg:h-[calc(100vh-100px)]">
      {/* Top Header Controls - Fixed at Top */}
      <div className="bg-white border-b border-slate-200 p-4 flex shrink-0 items-center justify-between gap-4 z-10 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-indigo-600 font-bold transition-all hover:bg-slate-50 rounded-xl"
        >
          <ChevronLeft size={20} />
          Back to List
        </button>

        <div className="flex items-center gap-3">
          {!entry && (
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {Object.values(LOG_TYPES).map((log) => (
                <button
                  key={log.id}
                  onClick={() => setActiveLog(log.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    activeLog === log.id
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {log.id
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </button>
              ))}
            </div>
          )}

          <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
            <button
              onClick={addMonth}
              title="Add Month"
              className="p-1.5 rounded-lg bg-white text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm flex items-center gap-1 text-[10px] font-bold"
            >
              <Plus size={14} />
              Month
            </button>
            <button
              onClick={removeMonth}
              title="Remove Last Month"
              disabled={months.length <= 1}
              className="p-1.5 rounded-lg bg-white text-rose-600 hover:bg-rose-50 transition-all shadow-sm flex items-center gap-1 text-[10px] font-bold disabled:opacity-50"
            >
              <Minus size={14} />
              Month
            </button>
          </div>

          <button
            onClick={handleDownload}
            className="bg-indigo-600 text-gray-500 px-6 py-2 rounded-xl hover:bg-indigo-700 font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            <Download size={18} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Main Preview Content - Independently Scrollable */}
      <div className="flex-1 overflow-auto bg-slate-500/10 p-4 lg:p-10 flex flex-col items-center">
        <div
          ref={printRef}
          style={s.page}
          className="shadow-2xl mb-12 shrink-0 bg-white origin-top"
        >
          <div style={s.header}>
            <h1 style={s.h1}>QMS DAILY ENTRIES LOG</h1>
            <p style={s.address}>
              PLOT NO: A232, ROAD NO: 21, Y-LANE, BEHIND CYBER TECH SOLUTION,
              <br />
              NEHERU NAGAR, WAGLE INDUSTRIAL ESTATE, THANE (W),
              MAHARASHTRA-400604
            </p>
            <div style={s.title}>{currentConfig.title}</div>
            {entry?.name && (
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "bold",
                  marginTop: "2px",
                  color: "#555",
                }}
              >
                PARAMETER/ENTITY: {entry.name.toUpperCase()}
              </div>
            )}
          </div>

          <div style={s.contentWrapper}>
            {months.map((m, idx) => (
              <div key={idx} style={{ marginBottom: "15px" }}>
                {activeLog === "refrigerator" &&
                  renderStandardGrid(currentConfig.rows, m)}
                {activeLog === "room_temp" &&
                  renderStandardGrid(currentConfig.rows, m)}
                {activeLog === "hypochlorite" && renderHypochloriteGrid(m)}
                {activeLog === "microscope" &&
                  renderMicroscopeGrid(currentConfig.tasks, m)}
                {activeLog === "housekeeping" &&
                  renderHousekeepingGrid(currentConfig, m)}
              </div>
            ))}
          </div>

          <div style={s.footer}>
            <div>Document No: {currentConfig.docNo}</div>
            <div>Issue No: 01</div>
            <div>Status: Controlled</div>
            <div>Issued By: QA Department</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionLog;

// work on the month and date
// work on the table border and cell padding
// implement data and fields from previous page (making table data dynamic)
