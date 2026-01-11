/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { X, Plus, Minus } from "lucide-react"

const VacationContingentModal = ({ 
  isOpen, 
  onClose, 
  staff, 
  onUpdateContingent 
}) => {
  const [contingent, setContingent] = useState(staff?.vacationDays || 0)
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (staff) {
      setContingent(staff.vacationDays || 0)
      setNotes(staff.vacationNotes || "")
    }
  }, [staff])

  const handleIncrement = () => {
    setContingent(prev => prev + 1)
  }

  const handleDecrement = () => {
    if (contingent > 0) {
      setContingent(prev => prev - 1)
    }
  }

  const handleSave = () => {
    if (onUpdateContingent && staff) {
      onUpdateContingent(staff.id, contingent, notes)
    }
    onClose()
  }

  if (!isOpen || !staff) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-[#181818] w-full max-w-md rounded-xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">
            Manage Vacation Contingent
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={staff.img || "/placeholder.svg?height=60&width=60"}
              width={60}
              height={60}
              className="rounded-xl"
              alt={`${staff.firstName} ${staff.lastName}`}
            />
            <div>
              <h3 className="text-white font-medium text-lg">
                {staff.firstName} {staff.lastName}
              </h3>
              <p className="text-gray-400 text-sm">{staff.role}</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-3">
              Vacation Days Contingent
            </label>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleDecrement}
                disabled={contingent <= 0}
                className="p-2 rounded-lg bg-red-600 text-white disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
              >
                <Minus size={20} />
              </button>
              
              <div className="text-3xl font-bold text-white min-w-[60px] text-center">
                {contingent}
              </div>
              
              <button
                onClick={handleIncrement}
                className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about vacation contingent changes..."
              className="w-full bg-[#2A2A2A] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-orange-500"
              rows="3"
            />
          </div> */}
        </div>

        <div className="px-6 py-4 border-t border-gray-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-800 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 bg-orange-500 text-sm font-medium text-white rounded-xl hover:bg-orange-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default VacationContingentModal