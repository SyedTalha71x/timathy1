/* eslint-disable react/prop-types */
import { ArrowDown, ArrowUp } from "lucide-react"

const StatCard = ({ title, value, change, icon: Icon, prefix = "", suffix = "" }) => {
    const isPositive = change > 0
  
    return (
      <div className="bg-[#2F2F2F] rounded-xl p-3">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-black rounded-lg">
            <Icon size={24} className="text-blue-400" />
          </div>
          <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-400" : "text-red-400"}`}>
            {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            {Math.abs(change)}%
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {prefix}
            {typeof value === "number" ? value.toLocaleString() : value}
            {suffix}
          </h3>
          <p className="text-zinc-400 text-sm">{title}</p>
        </div>
      </div>
    )
  }

  export default StatCard