/* eslint-disable react/prop-types */
import { useState } from "react"
import { Calendar } from "lucide-react"

export default function EmployeeCalendar({ staffMember, onSaveSchedule }) {
  const [schedule, setSchedule] = useState(staffMember.schedule || {})

  const handleScheduleChange = (day, hours) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: hours,
    }))
  }

  const handleSave = () => {
    onSaveSchedule(schedule)
  }

  return (
    <div className="mt-6">
      <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
        <Calendar className="mr-2" size={20} />
        Work Schedule
      </h3>
      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
        <div key={day} className="mb-2 flex items-center">
          <span className="w-24 text-gray-400">{day}</span>
          <input
            type="text"
            value={schedule[day] || ""}
            onChange={(e) => handleScheduleChange(day, e.target.value)}
            placeholder="e.g. 9:00-17:00"
            className="bg-[#101010] text-sm rounded-xl px-4 py-2 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
          />
        </div>
      ))}
      <button
        onClick={handleSave}
        className="mt-4 bg-[#3F74FF] text-white px-6 py-2 rounded-xl text-sm hover:bg-[#3F74FF]/90 transition-colors"
      >
        Save Schedule
      </button>
    </div>
  )
}

