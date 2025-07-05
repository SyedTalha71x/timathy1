/* eslint-disable react/prop-types */

import clsx from "clsx"; 

export function StatsCard({ count, label, className }) {
  return (
    <div className={clsx("text-center", className)}>
      <h3 className="text-4xl md:text-5xl count_font  text-white">{count}</h3>
      <p className="text-white label_font mt-2 text-sm">{label}</p>
    </div>
  );
}