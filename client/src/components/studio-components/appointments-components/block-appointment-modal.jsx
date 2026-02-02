/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { X, Check } from "lucide-react"
import { appointmentTypesData } from "../../../utils/studio-states"

const BlockAppointmentModal = ({ isOpen, onClose, onSubmit, selectedDate, selectedTime = null }) => {
  // Format date to YYYY-MM-DD string using local timezone (not UTC)
  const getFormattedDate = (date) => {
    if (!date) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Parse selectedTime and calculate start/end times
  const parseSelectedTime = (time) => {
    if (!time) return { start: "", end: "" };
    
    // If it's a range like "09:00 - 09:30"
    if (time.includes("-")) {
      const parts = time.split("-").map(t => t.trim());
      return { start: parts[0], end: parts[1] || "" };
    }
    
    // If it's just a start time like "09:00", add 30 minutes for end time
    const startTime = time.trim();
    const [hours, minutes] = startTime.split(":").map(Number);
    const endDate = new Date(2000, 0, 1, hours, minutes + 30);
    const endTime = `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;
    
    return { start: startTime, end: endTime };
  };

  const formattedSelectedDate = getFormattedDate(selectedDate);
  const initialTimes = parseSelectedTime(selectedTime);

  // Get all appointment types (regular + trial training)
  const allAppointmentTypes = [
    ...appointmentTypesData.filter(t => !t.isTrialType),
    { id: 'trial', name: 'Trial Training', color: 'bg-[#3B82F6]', colorHex: '#3B82F6' }
  ];

  const [blockData, setBlockData] = useState({
    startDate: formattedSelectedDate,
    endDate: formattedSelectedDate,
    startTime: initialTimes.start,
    endTime: initialTimes.end,
    note: "",
  })
  const [showConfirm, setShowConfirm] = useState(false)
  
  // State für geblockte Terminarten - standardmäßig alle ausgewählt
  const [blockedTypes, setBlockedTypes] = useState(() => {
    const initial = {};
    allAppointmentTypes.forEach(type => {
      initial[type.id] = true;
    });
    return initial;
  });

  useEffect(() => {
    if (selectedDate || selectedTime) {
      const formatted = getFormattedDate(selectedDate);
      const times = parseSelectedTime(selectedTime);
      setBlockData((prev) => ({
        ...prev,
        startDate: formatted,
        endDate: formatted,
        startTime: times.start || prev.startTime,
        endTime: times.end || prev.endTime,
      }))
    }
  }, [selectedDate, selectedTime])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      const initial = {};
      allAppointmentTypes.forEach(type => {
        initial[type.id] = true;
      });
      setBlockedTypes(initial);
    }
  }, [isOpen])

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

  // Check if at least one type is selected
  const hasSelectedTypes = Object.values(blockedTypes).some(v => v);
  
  // Check if form is valid
  const isFormValid = blockData.startDate && blockData.endDate && 
                      blockData.startTime && blockData.endTime && 
                      isDateValid() && isTimeValid() && hasSelectedTypes;

  const handleChange = (e) => {
    const { name, value } = e.target
    setBlockData({ ...blockData, [name]: value })
  }

  const handleTypeToggle = (typeId) => {
    setBlockedTypes(prev => ({
      ...prev,
      [typeId]: !prev[typeId]
    }));
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(blockedTypes).every(v => v);
    const newState = {};
    allAppointmentTypes.forEach(type => {
      newState[type.id] = !allSelected;
    });
    setBlockedTypes(newState);
  };

  const areAllSelected = Object.values(blockedTypes).every(v => v);

  const handleSubmitClick = (e) => {
    e.preventDefault()
    if (!isFormValid) return;
    setShowConfirm(true)
  }

  const handleConfirmBlock = () => {
    // Get selected type names
    const selectedTypeNames = allAppointmentTypes
      .filter(type => blockedTypes[type.id])
      .map(type => type.name);
    
    onSubmit({ 
      ...blockData, 
      blockAll: areAllSelected,
      blockedTypes: selectedTypeNames
    })
    setShowConfirm(false)
  }

  // Get color hex from color string like "bg-[#EF4444]"
  const getColorHex = (type) => {
    if (type.colorHex) return type.colorHex;
    const match = type.color?.match(/#[A-Fa-f0-9]{6}/);
    return match ? match[0] : '#666666';
  };

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" onClick={onClose}>
        <div
          className="bg-[#181818] w-[90%] sm:w-[520px] rounded-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Block Time Slot</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmitClick} className="p-6 space-y-6 custom-scrollbar overflow-y-auto max-h-[70vh]">
            <div className="space-y-4">
              {/* Start & End Date */}
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

              {/* Start & End Time */}
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

              {/* Appointment Types to Block */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-white">Block Appointment Types</label>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    {areAllSelected ? "Deselect All" : "Select All"}
                  </button>
                </div>
                <div className="bg-[#0D0D0D] rounded-xl p-3 space-y-2">
                  {allAppointmentTypes.map((type) => (
                    <label 
                      key={type.id} 
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer transition-colors"
                    >
                      <div 
                        className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${
                          blockedTypes[type.id] 
                            ? 'border-orange-500 bg-orange-500' 
                            : 'border-gray-600 bg-transparent'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleTypeToggle(type.id);
                        }}
                      >
                        {blockedTypes[type.id] && <Check size={14} className="text-white" />}
                      </div>
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: getColorHex(type) }}
                      />
                      <span className="text-white text-sm">{type.name}</span>
                    </label>
                  ))}
                </div>
                {!hasSelectedTypes && (
                  <p className="text-red-400 text-xs mt-2">Please select at least one appointment type</p>
                )}
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Note (Optional)</label>
                <textarea
                  name="note"
                  value={blockData.note}
                  onChange={handleChange}
                  placeholder="Add a note about why this time is blocked"
                  className="w-full bg-[#0D0D0D] text-white resize-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[80px]"
                />
              </div>
            </div>

            {/* Buttons */}
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
                disabled={!isFormValid}
                className={`w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-colors ${
                  isFormValid 
                    ? "bg-orange-500 hover:bg-orange-600 cursor-pointer" 
                    : "bg-orange-500/50 cursor-not-allowed opacity-60"
                }`}
              >
                Block Time Slot
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1001] p-4" onClick={() => setShowConfirm(false)}>
          <div 
            className="bg-[#181818] w-[90%] sm:w-[420px] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Block this time slot?</h3>
              <p className="text-gray-400 text-sm">
                Are you sure you want to block this time slot? The selected appointment types cannot be booked during this period.
              </p>
              <div className="mt-4 p-3 bg-[#0D0D0D] rounded-xl text-sm space-y-2">
                <p className="text-gray-300">
                  <span className="text-gray-500">Date:</span> {blockData.startDate === blockData.endDate 
                    ? blockData.startDate 
                    : `${blockData.startDate} - ${blockData.endDate}`}
                </p>
                <p className="text-gray-300">
                  <span className="text-gray-500">Time:</span> {blockData.startTime} - {blockData.endTime}
                </p>
                <div className="text-gray-300">
                  <span className="text-gray-500">Blocked Types:</span>{' '}
                  {areAllSelected ? (
                    <span className="text-orange-400">All Types</span>
                  ) : (
                    <span>
                      {allAppointmentTypes
                        .filter(type => blockedTypes[type.id])
                        .map(type => type.name)
                        .join(', ')}
                    </span>
                  )}
                </div>
                {blockData.note && (
                  <p className="text-gray-300">
                    <span className="text-gray-500">Note:</span> {blockData.note}
                  </p>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-800 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBlock}
                className="px-4 py-2 bg-orange-500 text-sm font-medium text-white rounded-xl hover:bg-orange-600 transition-colors"
              >
                Block Time
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BlockAppointmentModal
