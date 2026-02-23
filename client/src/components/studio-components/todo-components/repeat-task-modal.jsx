

/* eslint-disable react/prop-types */
import { useState } from "react"
import { X } from "lucide-react"
import CustomSelect from "../../shared/CustomSelect"
import DatePickerField from "../../shared/DatePickerField"


const RepeatTaskModal = ({ onClose, onRepeatTask, task }) => {
  const [frequency, setFrequency] = useState("daily")
  const [repeatDays, setRepeatDays] = useState([])
  const [endType, setEndType] = useState("never")
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

  const frequencyOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
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
      return
    }

    const repeatOptions = {
      frequency,
      repeatDays: frequency === "weekly" ? repeatDays : [],
      endDate: endType === "onDate" ? endDate : null,
      occurrences: endType === "afterOccurrences" ? Number.parseInt(occurrences, 10) : null,
    }

    onRepeatTask(task, repeatOptions)
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 open_sans_font w-screen h-screen bg-black/50 flex items-center p-3 sm:p-4 md:p-6 justify-center z-[1000]">
        <div className="bg-surface-card rounded-2xl w-full max-w-md p-4 sm:p-5 md:p-6 lg:p-6 relative">
          <div className="flex justify-between items-center mb-5 sm:mb-6">
            <h2 className="text-content-primary text-lg open_sans_font_700 font-semibold">Repeat Task: {task.title}</h2>
            <button onClick={onClose} className="text-content-muted cursor-pointer hover:text-content-primary">
              <X size={20} />
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 custom-scrollbar max-h-[calc(100vh-180px)] overflow-y-auto"
          >
            {/* Frequency */}
            <div>
              <label className="text-sm text-content-secondary mb-1 block">Repeat Frequency</label>
              <CustomSelect
                name="frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                options={frequencyOptions}
                placeholder="Select frequency"
              />
            </div>

            {/* Weekly day picker */}
            {frequency === "weekly" && (
              <div>
                <label className="text-sm text-content-secondary">Repeat on days</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => handleDayToggle(day.value)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                        repeatDays.includes(day.value) ? "bg-primary text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"
                      }`}
                    >
                      {day.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Ends */}
            <div>
              <label className="text-sm text-content-secondary block mb-2">Ends</label>
              <div className="space-y-1">
                {/* Never */}
                <label 
                  className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                    endType === "never" ? "bg-surface-dark" : "hover:bg-surface-dark/50"
                  }`}
                  onClick={() => handleEndTypeChange("never")}
                >
                  <input
                    type="radio"
                    name="repeatEnd"
                    value="never"
                    checked={endType === "never"}
                    onChange={() => handleEndTypeChange("never")}
                    className="primary-radio"
                  />
                  <span className="text-sm text-content-secondary">Never</span>
                </label>
                
                {/* On date */}
                <div 
                  className={`rounded-xl transition-colors ${
                    endType === "onDate" ? "bg-surface-dark" : "hover:bg-surface-dark/50"
                  }`}
                >
                  <label 
                    className="flex items-center gap-3 p-2.5 cursor-pointer"
                    onClick={() => handleEndTypeChange("onDate")}
                  >
                    <input
                      type="radio"
                      name="repeatEnd"
                      value="onDate"
                      checked={endType === "onDate"}
                      onChange={() => handleEndTypeChange("onDate")}
                      className="primary-radio"
                    />
                    <span className="text-sm text-content-secondary">On date</span>
                  </label>
                  {endType === "onDate" && (
                    <div className="flex items-center gap-2 px-2.5 pb-2.5 ml-7">
                      <div className="flex items-center gap-2 bg-surface-button rounded-xl px-3 py-2 border border-border flex-1">
                        <span className={`text-sm flex-1 ${endDate ? 'text-content-primary' : 'text-content-muted'}`}>
                          {endDate || "Pick a date"}
                        </span>
                        <DatePickerField
                          value={endDate}
                          onChange={(val) => {
                            setEndDate(val)
                            setEndType("onDate")
                          }}
                          iconSize={14}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* After occurrences */}
                <div 
                  className={`rounded-xl transition-colors ${
                    endType === "afterOccurrences" ? "bg-surface-dark" : "hover:bg-surface-dark/50"
                  }`}
                >
                  <label 
                    className="flex items-center gap-3 p-2.5 cursor-pointer"
                    onClick={() => handleEndTypeChange("afterOccurrences")}
                  >
                    <input
                      type="radio"
                      name="repeatEnd"
                      value="afterOccurrences"
                      checked={endType === "afterOccurrences"}
                      onChange={() => handleEndTypeChange("afterOccurrences")}
                      className="primary-radio"
                    />
                    <span className="text-sm text-content-secondary">After occurrences</span>
                  </label>
                  {endType === "afterOccurrences" && (
                    <div className="flex items-center gap-2 px-2.5 pb-2.5 ml-7">
                      <input
                        type="number"
                        value={occurrences}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || (Number.parseInt(value, 10) > 0)) {
                            setOccurrences(value);
                          }
                        }}
                        min="1"
                        placeholder="4"
                        className="w-20 bg-surface-button text-sm rounded-xl px-3 py-2 text-content-primary outline-none border border-border focus:border-primary"
                      />
                      <span className="text-sm text-content-muted">times</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-surface-button text-sm text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-sm text-white rounded-xl hover:bg-primary-hover transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .primary-radio {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          width: 1.125rem;
          height: 1.125rem;
          border-radius: 50%;
          border: 2px solid var(--color-border, #444);
          background: var(--color-surface-card, #1a1a1a);
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.15s ease;
          position: relative;
        }
        .primary-radio:checked {
          border-color: var(--color-primary, #f97316);
          background: var(--color-primary, #f97316);
        }
        .primary-radio:checked::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 0.375rem;
          height: 0.375rem;
          border-radius: 50%;
          background: white;
        }
        .primary-radio:focus {
          outline: none;
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary, #f97316) 40%, transparent);
        }
      `}</style>
    </>
  )
}

export default RepeatTaskModal