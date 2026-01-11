

/* eslint-disable react/prop-types */
import { useState } from "react"
import { X } from "lucide-react"
import { Toaster, toast } from "react-hot-toast"

const RepeatTaskModal = ({ onClose, onRepeatTask, task }) => {
  const [frequency, setFrequency] = useState("daily")
  const [repeatDays, setRepeatDays] = useState([])
  const [endType, setEndType] = useState("never") // Add explicit end type state
  const [endDate, setEndDate] = useState("")
  const [occurrences, setOccurrences] = useState("")

  const daysOfWeek = [
    { name: "Sun", value: 0 },
    { name: "Mon", value: 1 },
    { name: "Tue", value: 2 },
    { name: "Wed", value: 3 },
    { name: "Thu", value: 4 },
    { name: "Fri", value: 5 },
    { name: "Sat", value: 6 },
  ]

  const handleDayToggle = (dayValue) => {
    setRepeatDays((prev) =>
      prev.includes(dayValue) ? prev.filter((d) => d !== dayValue) : [...prev, dayValue].sort((a, b) => a - b),
    )
  }

  const handleEndTypeChange = (type) => {
    setEndType(type)
    if (type === "never") {
      setEndDate("")
      setOccurrences("")
    } else if (type === "onDate") {
      setOccurrences("")
    } else if (type === "afterOccurrences") {
      setEndDate("")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (frequency === "weekly" && repeatDays.length === 0) {
      toast.error("Please select at least one day for weekly repeats.")
      return
    }

    const repeatOptions = {
      frequency,
      repeatDays: frequency === "weekly" ? repeatDays : [],
      endDate: endType === "onDate" ? endDate : null,
      occurrences: endType === "afterOccurrences" ? Number.parseInt(occurrences, 10) : null,
    }

    onRepeatTask(task, repeatOptions)
    toast.success("Task repeat settings saved!")
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: { background: "#333", color: "#fff" },
        }}
      />
      <div className="fixed inset-0 open_sans_font w-screen h-screen bg-black/50 flex items-center p-3 sm:p-4 md:p-6 justify-center z-[1000]">
        <div className="bg-[#181818] rounded-2xl w-full max-w-md p-4 sm:p-5 md:p-6 lg:p-6 relative">
          <div className="flex justify-between items-center mb-5 sm:mb-6">
            <h2 className="text-white text-lg open_sans_font_700 font-semibold">Repeat Task: {task.title}</h2>
            <button onClick={onClose} className="text-gray-400 cursor-pointer hover:text-white">
              <X size={20} />
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 custom-scrollbar max-h-[calc(100vh-180px)] overflow-y-auto"
          >
            <div>
              <label className="text-sm text-gray-200">Repeat Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full bg-[#101010] mt-1 text-sm rounded-xl px-4 py-2.5 text-white outline-none"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            {frequency === "weekly" && (
              <div>
                <label className="text-sm text-gray-200">Repeat on days</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => handleDayToggle(day.value)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                        repeatDays.includes(day.value) ? "bg-[#3F74FF] text-white" : "bg-[#2F2F2F] text-gray-200 hover:bg-[#3F3F3F]"
                      }`}
                    >
                      {day.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className="text-sm text-gray-200 block mb-2">Ends</label>
              <div className="space-y-3">
                {/* Never option */}
                <label className="flex items-center gap-3 text-sm text-gray-200 cursor-pointer">
                  <input
                    type="radio"
                    name="repeatEnd"
                    value="never"
                    checked={endType === "never"}
                    onChange={() => handleEndTypeChange("never")}
                    className="w-4 h-4 text-[#FF843E] bg-[#101010] border-gray-500 focus:ring-[#FF843E] focus:ring-2"
                  />
                  <span>Never</span>
                </label>
                
                {/* On date option */}
                <label className="flex items-center gap-3 text-sm text-gray-200 cursor-pointer">
                  <input
                    type="radio"
                    name="repeatEnd"
                    value="onDate"
                    checked={endType === "onDate"}
                    onChange={() => handleEndTypeChange("onDate")}
                    className="w-4 h-4 text-[#FF843E] bg-[#101010] border-gray-500 focus:ring-[#FF843E] focus:ring-2"
                  />
                  <span>On date:</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value)
                      setEndType("onDate")
                    }}
                    onClick={() => setEndType("onDate")}
                    className="bg-[#101010] text-sm rounded-xl px-3 py-1.5 text-white outline-none border border-gray-600 focus:border-[#FF843E]"
                  />
                </label>
                
                {/* After occurrences option */}
                <label className="flex items-center gap-3 text-sm text-gray-200 cursor-pointer">
                  <input
                    type="radio"
                    name="repeatEnd"
                    value="afterOccurrences"
                    checked={endType === "afterOccurrences"}
                    onChange={() => handleEndTypeChange("afterOccurrences")}
                    className="w-4 h-4 text-[#FF843E] bg-[#101010] border-gray-500 focus:ring-[#FF843E] focus:ring-2"
                  />
                  <span>After</span>
                  <input
  type="number"
  value={occurrences}
  onChange={(e) => {
    const value = e.target.value;
    if (value === "" || (Number.parseInt(value, 10) > 0)) {
      setOccurrences(value);
      setEndType("afterOccurrences");
    }
  }}
  onClick={() => setEndType("afterOccurrences")}
  min="1"
  placeholder="4"
  className="w-20 bg-[#101010] text-sm rounded-xl px-3 py-1.5 text-white outline-none border border-gray-600 focus:border-[#FF843E]"
/>
                  <span>occurrences</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-[#2F2F2F] text-sm text-white rounded-xl hover:bg-[#3F3F3F] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#3F74FF] text-sm text-white rounded-xl hover:bg-[#4F7FFF] transition-colors"
              >
                Save Repeat
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default RepeatTaskModal