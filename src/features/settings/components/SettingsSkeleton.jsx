import React from "react";

const SettingsSkeleton = () => (
  <div className="p-4 md:p-8 lg:p-12 w-full max-w-7xl mx-auto space-y-8 animate-pulse">
    <div className="space-y-3">
      <div className="h-4 w-40 bg-slate-100 rounded-lg" />
      <div className="h-9 w-72 bg-slate-100 rounded-xl" />
      <div className="h-4 w-96 max-w-full bg-slate-50 rounded-lg" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
      <div className="lg:col-span-4 xl:col-span-3">
        <div className="h-80 bg-slate-50 rounded-3xl" />
      </div>
      <div className="lg:col-span-8 xl:col-span-9 space-y-6">
        <div className="h-52 bg-slate-50 rounded-3xl" />
        <div className="h-64 bg-slate-50 rounded-3xl" />
      </div>
    </div>
  </div>
);

export default SettingsSkeleton;
