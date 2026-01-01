import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const CapaChartWidget = () => {
  // Sample / fake data for client demo
  const weekData = [
    { day: "Mon", incidents: 6 },
    { day: "Tue", incidents: 10 },
    { day: "Wed", incidents: 8 },
    { day: "Thu", incidents: 13 },
    { day: "Fri", incidents: 9 },
    { day: "Sat", incidents: 11 },
    { day: "Sun", incidents: 7 },
  ];

  const totalIncidents = weekData.reduce((sum, d) => sum + d.incidents, 0);

  const avgPerDay = (totalIncidents / weekData.length).toFixed(1);

  const maxIncidents = Math.max(...weekData.map((d) => d.incidents));

  // Directional trend only (no fake percentages)
  const isImproving = weekData.at(-1).incidents < weekData[0].incidents;

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="flex justify-between items-start gap-3 mb-2">
        <div>
          <div className="text-3xl font-bold text-slate-800">
            {totalIncidents}
          </div>
          <div className="text-[11px] text-slate-500 uppercase tracking-wide">
            Daily Incident Trend (This Week)
          </div>
        </div>

        <div className="flex items-center gap-1">
          {isImproving ? (
            <>
              <TrendingDown className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-600">
                Improving
              </span>
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4 text-rose-600" />
              <span className="text-sm font-semibold text-rose-600">
                Increasing
              </span>
            </>
          )}
        </div>

        <div className="text-right">
          <div className="text-2xl font-semibold text-slate-700">
            {avgPerDay}
          </div>
          <div className="text-[11px] text-slate-500 uppercase tracking-wide">
            Avg / Day
          </div>
        </div>
      </div>

      {/* Axis hint */}
      <div className="text-[10px] text-slate-400 mb-1">Incidents per day</div>

      {/* Chart Container */}
      <div className="flex-1 flex flex-col justify-end min-h-0">
        {/* FIX: Changed h-[120px] to h-32 to ensure height exists */}
        <div className="flex items-end gap-1.5 h-32 px-1">
          {weekData.map((d) => {
            const height = (d.incidents / maxIncidents) * 100;

            return (
              <div
                key={d.day}
                // Added h-full to ensure the gray background track fills the 120px height
                className="flex-1 relative bg-slate-100 rounded-t-lg group cursor-pointer h-full"
              >
                <div
                  className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg transition-all duration-300 group-hover:bg-indigo-600"
                  style={{ height: `${height}%` }}
                />

                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="font-bold text-center">{d.incidents}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Day labels */}
        <div className="flex justify-between text-[11px] font-medium text-slate-500 px-1 mt-1">
          {weekData.map((d) => (
            <span key={d.day} className="flex-1 text-center">
              {d.day}
            </span>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="text-[10px] text-slate-400 text-right mt-1">
          Sample data for visualization
        </div>
      </div>
    </div>
  );
};

export default CapaChartWidget;
