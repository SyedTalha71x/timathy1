/* eslint-disable react/prop-types */
import { useState } from "react"
import { X } from "lucide-react"
import { Toaster, toast } from "react-hot-toast"

const RepeatTaskModal = ({ onClose, onRepeatTask, task }) => {
  const [frequency, setFrequency] = useState("daily")
  const [repeatDays, setRepeatDays] = useState([])
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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (frequency === "weekly" && repeatDays.length === 0) {
      toast.error("Please select at least one day for weekly repeats.")
      return
    }

    const repeatOptions = {
      frequency,
      repeatDays: frequency === "weekly" ? repeatDays : [],
      endDate: endDate || null,
      occurrences: occurrences ? Number.parseInt(occurrences, 10) : null,
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
                      className={`px-3 py-1.5 rounded-full text-xs ${
                        repeatDays.includes(day.value) ? "bg-[#3F74FF] text-white" : "bg-[#2F2F2F] text-gray-200"
                      }`}
                    >
                      {day.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className="text-sm text-gray-200">Ends</label>
              <div className="flex flex-col gap-2 mt-1">
                <label className="flex items-center gap-2 text-sm text-gray-200">
                  <input
                    type="radio"
                    name="repeatEnd"
                    value="never"
                    checked={!endDate && !occurrences}
                    onChange={() => {
                      setEndDate("")
                      setOccurrences("")
                    }}
                    className="form-radio h-4 w-4 text-[#FF843E] focus:ring-[#FF843E]"
                  />
                  Never
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-200">
                  <input
                    type="radio"
                    name="repeatEnd"
                    value="onDate"
                    checked={!!endDate}
                    onChange={() => setOccurrences("")}
                    className="form-radio h-4 w-4 text-[#FF843E] focus:ring-[#FF843E]"
                  />
                  On date:
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-[#101010] text-sm rounded-xl px-3 py-1.5 text-white outline-none"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-200">
                  <input
                    type="radio"
                    name="repeatEnd"
                    value="afterOccurrences"
                    checked={!!occurrences}
                    onChange={() => setEndDate("")}
                    className="form-radio h-4 w-4 text-[#FF843E] focus:ring-[#FF843E]"
                  />
                  After
                  <input
                    type="number"
                    value={occurrences}
                    onChange={(e) => setOccurrences(e.target.value)}
                    min="1"
                    className="w-20 bg-[#101010] text-sm rounded-xl px-3 py-1.5 text-white outline-none"
                  />
                  occurrences
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-[#2F2F2F] text-sm text-white rounded-xl hover:bg-[#2F2F2F]/90"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#3F74FF] text-sm text-white rounded-xl hover:bg-[#3F74FF]/90"
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
