/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { X } from "lucide-react"

/* 
  Modal for editing blocked time slots
*/
const EditBlockedSlotModalMain = ({ isOpen, onClose, initialBlock, onSubmit, onDelete }) => {
  const [blockData, setBlockData] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    note: "",
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (initialBlock) {
      // Try to infer date parts from initial block - format "Wed | 29-01-2025"
      const todayISO = (() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      })();
      
      let parsedDate = todayISO;
      if (initialBlock.date && initialBlock.date.includes("|")) {
        // Parse "Wed | 29-01-2025" to "2025-01-29"
        const datePart = initialBlock.date.split("|")[1].trim();
        const [day, month, year] = datePart.split("-");
        parsedDate = `${year}-${month}-${day}`;
      }

      setBlockData({
        startDate: parsedDate,
        endDate: parsedDate,
        startTime: initialBlock.startTime || "",
        endTime: initialBlock.endTime || "",
        note: initialBlock?.specialNote?.text || "",
      })
    }
  }, [initialBlock])

  // Validation: start date cannot be after end date
  const isDateValid = () => {
    if (!blockData.startDate || !blockData.endDate) return true;
    return blockData.startDate <= blockData.endDate;
  };

  // Validation: if same date, start time must be before end time
  const isTimeValid = () => {
    if (!blockData.startTime || !blockData.endTime) return true;
    if (blockData.startDate !== blockData.endDate) return true;
    return blockData.startTime < blockData.endTime;
  };
  
  // Check if form is valid
  const isFormValid = blockData.startDate && blockData.endDate && 
                      blockData.startTime && blockData.endTime && 
                      isDateValid() && isTimeValid();

  const handleChange = (e) => {
    const { name, value } = e.target
    setBlockData({ ...blockData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isFormValid) return;
    onSubmit({ ...blockData, blockAll: true })
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(initialBlock.id);
    }
    setShowDeleteConfirm(false)
    onClose();
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" onClick={onClose}>
        <div
          className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Edit Blocked Time Slot</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 custom-scrollbar overflow-y-auto max-h-[70vh]">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={blockData.startDate}
                    onChange={handleChange}
                    className="w-full bg-[#0D0D0D] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={blockData.endDate}
                    onChange={handleChange}
                    min={blockData.startDate}
                    className="w-full bg-[#0D0D0D] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>
              {!isDateValid() && (
                <p className="text-red-400 text-xs">Start date cannot be after end date</p>
              )}

              <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={blockData.startTime}
                    onChange={handleChange}
                    className="w-full bg-[#0D0D0D] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={blockData.endTime}
                    onChange={handleChange}
                    className="w-full bg-[#0D0D0D] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>
              {!isTimeValid() && (
                <p className="text-red-400 text-xs">Start time must be before end time on the same day</p>
              )}

              <div>
                <label className="block text-sm font-medium text-white mb-2">Note (Optional)</label>
                <textarea
                  name="note"
                  value={blockData.note}
                  onChange={handleChange}
                  placeholder="Add a note about this blocked time"
                  className="w-full bg-[#0D0D0D] text-white resize-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[80px]"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={handleDeleteClick}
                className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
              >
                Delete
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-gray-800 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-colors ${
                    isFormValid 
                      ? "bg-orange-500 hover:bg-orange-600 cursor-pointer" 
                      : "bg-orange-500/50 cursor-not-allowed opacity-60"
                  }`}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1001] p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div 
            className="bg-[#181818] w-[90%] sm:w-[400px] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Delete Blocked Time Slot?</h3>
              <p className="text-gray-400 text-sm">Are you sure you want to delete this blocked time slot? This action cannot be undone.</p>
            </div>
            <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-800 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-sm font-medium text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default EditBlockedSlotModalMain
