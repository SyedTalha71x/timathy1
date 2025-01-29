/* eslint-disable react/prop-types */

import clsx from "clsx"; 

export function StatsCard({ count, label, className }) {
  return (
    <div className={clsx("text-center", className)}>
      <h3 className="text-4xl md:text-5xl font-bold text-white">{count}</h3>
      <p className="text-white mt-2 text-sm">{label}</p>
    </div>
  );
}
