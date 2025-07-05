/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { X } from "lucide-react"

const BlockAppointmentModal = ({ isOpen, onClose, appointmentTypes, onSubmit, selectedDate }) => {
  const [blockData, setBlockData] = useState({
    date: selectedDate ? new Date(selectedDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "10:00",
    note: "",
    blockAll: false,
    selectedTypes: [],
  })

  useEffect(() => {
    if (selectedDate) {
      setBlockData((prev) => ({
        ...prev,
        date: new Date(selectedDate).toISOString().split("T")[0],
      }))
    }
  }, [selectedDate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === "checkbox") {
      setBlockData({ ...blockData, [name]: checked })
    } else {
      setBlockData({ ...blockData, [name]: value })
    }
  }

  const handleTypeToggle = (typeName) => {
    setBlockData((prev) => {
      const isSelected = prev.selectedTypes.includes(typeName)
      let newSelectedTypes

      if (isSelected) {
        newSelectedTypes = prev.selectedTypes.filter((t) => t !== typeName)
      } else {
        newSelectedTypes = [...prev.selectedTypes, typeName]
      }

      return {
        ...prev,
        selectedTypes: newSelectedTypes,
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(blockData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" onClick={onClose}>
      <div
        className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Block Time Slot</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 custom-scrollbar overflow-y-auto max-h-[70vh]">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Date</label>
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  value={blockData.date}
                  onChange={handleChange}
                  className="w-full bg-[#0D0D0D] white-calendar-icon text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3F74FF]"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Start Time</label>
                <div className="relative">
                  <input
                    type="time"
                    name="startTime"
                    value={blockData.startTime}
                    onChange={handleChange}
                    className="w-full bg-[#0D0D0D] white-calendar-icon text-white rounded-xl px-4 py-3  text-sm focus:outline-none focus:ring-2 focus:ring-[#3F74FF]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">End Time</label>
                <div className="relative">
                  <input
                    type="time"
                    name="endTime"
                    value={blockData.endTime}
                    onChange={handleChange}
                    className="w-full bg-[#0D0D0D] white-calendar-icon text-white rounded-xl px-4 py-3  text-sm focus:outline-none focus:ring-2 focus:ring-[#3F74FF]"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Resources to Block</label>
              <div className="space-y-2 bg-[#0D0D0D] p-4 rounded-xl">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="blockAll"
                    name="blockAll"
                    checked={blockData.blockAll}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#3F74FF] focus:ring-[#3F74FF] rounded"
                  />
                  <label htmlFor="blockAll" className="ml-2 text-sm text-white">
                    Block all resources
                  </label>
                </div>

                {!blockData.blockAll && (
                  <div className="mt-3 space-y-2 pl-6">
                    {appointmentTypes.map((type) => (
                      <div key={type.name} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`type-${type.name}`}
                          checked={blockData.selectedTypes.includes(type.name)}
                          onChange={() => handleTypeToggle(type.name)}
                          className="h-4 w-4 text-[#3F74FF] focus:ring-[#3F74FF] rounded"
                        />
                        <label htmlFor={`type-${type.name}`} className="ml-2 text-sm text-white flex items-center">
                          <span className={`w-3 h-3 rounded-full ${type.color} mr-2`}></span>
                          {type.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Note (Optional)</label>
              <textarea
                name="note"
                value={blockData.note}
                onChange={handleChange}
                placeholder="Add a note about why this time is blocked"
                className="w-full bg-[#0D0D0D] resize-none text-white resize-none  rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3F74FF] min-h-[80px]"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 bg-gray-800 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-[#FF4D4F] text-sm font-medium text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              Block Time Slot
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BlockAppointmentModal