import React from "react";

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-slate-100/50">
    <td className="px-6 py-5">
      <div className="w-8 h-8 rounded-lg bg-slate-100" />
    </td>
    {[200, 100, 80, 80].map((w, i) => (
      <td key={i} className="px-6 py-5">
        <div
          className={`h-2.5 bg-slate-100 rounded-full`}
          style={{ width: w }}
        />
      </td>
    ))}
  </tr>
);

export default SkeletonRow;
