/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { X, Check, AlertTriangle } from "lucide-react"
import { appointmentTypesData } from "../../../utils/studio-states"
import DatePickerField from '../../shared/DatePickerField'
import { useDispatch, useSelector } from "react-redux"
import { fetchStudioServices } from "../../../features/services/servicesSlice"

const BlockAppointmentModal = ({ isOpen, onClose, onSubmit, selectedDate, selectedTime = null }) => {

  const { services } = useSelector((state) => state.services)

  const dispatch = useDispatch()



  useEffect(() => {
    dispatch(fetchStudioServices())
  }, [dispatch])
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

  // Format date for display (YYYY-MM-DD → DD.MM.YYYY)
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}.${m}.${y}`;
  };

  const formattedSelectedDate = getFormattedDate(selectedDate);
  const initialTimes = parseSelectedTime(selectedTime);

  // Get all appointment types (regular + trial training)
  const allAppointmentTypes = [
    ...appointmentTypesData.filter(t => !t.isTrialType),
    { id: 'trial', name: 'Trial Training', color: 'bg-trial', colorHex: '#3B82F6' }
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
    const selectedServiceIds = services
      .filter(service => blockedTypes[service._id])
      .map(service => service._id);

    if (selectedServiceIds.length === 0) return;

    // Send the entire date range in ONE request, not multiple
    const blockDataForServer = {
      startDate: blockData.startDate, // Send startDate
      endDate: blockData.endDate,     // Send endDate
      timeSlot: {
        start: blockData.startTime,
        end: blockData.endTime
      },
      serviceId: selectedServiceIds[0],
      note: blockData.note || ""
    };

    console.log('Sending range block:', blockDataForServer);

    // Submit ONE block for the entire range
    onSubmit(blockDataForServer);
    setShowConfirm(false);
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
          className="bg-surface-card w-full max-w-lg rounded-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-content-primary">Block Time Slot</h2>
              <button onClick={onClose} className="p-2 hover:bg-surface-button text-content-muted hover:text-content-primary rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmitClick} className="flex flex-col">
            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-5">
              {/* Start & End Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-2">Start Date</label>
                  <div className="w-full flex items-center justify-between bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5">
                    <span className={blockData.startDate ? "text-content-primary" : "text-content-faint"}>
                      {blockData.startDate ? formatDateDisplay(blockData.startDate) : "Select date"}
                    </span>
                    <DatePickerField value={blockData.startDate} onChange={(val) => setBlockData({ ...blockData, startDate: val })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-2">End Date</label>
                  <div className="w-full flex items-center justify-between bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5">
                    <span className={blockData.endDate ? "text-content-primary" : "text-content-faint"}>
                      {blockData.endDate ? formatDateDisplay(blockData.endDate) : "Select date"}
                    </span>
                    <DatePickerField value={blockData.endDate} onChange={(val) => setBlockData({ ...blockData, endDate: val })} />
                  </div>
                </div>
              </div>
              {!isDateValid() && (
                <p className="text-accent-red text-xs">Start date cannot be after end date</p>
              )}

              {/* Start & End Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-2">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={blockData.startTime}
                    onChange={handleChange}
                    className="w-full bg-surface-dark border border-border text-content-primary text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-2">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={blockData.endTime}
                    onChange={handleChange}
                    className="w-full bg-surface-dark border border-border text-content-primary text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>
              </div>
              {!isTimeValid() && (
                <p className="text-accent-red text-xs">Start time must be before end time on the same day</p>
              )}

              {/* Appointment Types to Block */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-content-secondary">Block Appointment Types</label>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs text-primary hover:text-primary-hover transition-colors"
                  >
                    {areAllSelected ? "Deselect All" : "Select All"}
                  </button>
                </div>
                <div className="bg-surface-dark border border-border rounded-xl p-3 space-y-1">
                  {services.map((type) => (
                    <label
                      key={type._id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-hover cursor-pointer transition-colors"
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${blockedTypes[type._id]
                          ? 'border-primary bg-primary'
                          : 'border-border bg-transparent'
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleTypeToggle(type._id);
                        }}
                      >
                        {blockedTypes[type._id] && <Check size={14} className="text-white" />}
                      </div>
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getColorHex(type) }}
                      />
                      <span className="text-content-primary text-sm">{type.name}</span>
                    </label>
                  ))}
                </div>
                {!hasSelectedTypes && (
                  <p className="text-accent-red text-xs mt-2">Please select at least one appointment type</p>
                )}
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-content-secondary mb-2">Note (Optional)</label>
                <textarea
                  name="note"
                  value={blockData.note}
                  onChange={handleChange}
                  placeholder="Add a note about why this time is blocked"
                  className="w-full bg-surface-dark border border-border text-content-primary resize-none rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors min-h-[80px]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex gap-3">
              <div className="flex-1" />
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-content-muted hover:text-content-primary bg-surface-button hover:bg-surface-button-hover rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid}
                className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-colors ${isFormValid
                  ? "text-white bg-primary hover:bg-primary-hover"
                  : "text-content-faint bg-surface-button cursor-not-allowed"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1001] p-4" onClick={() => setShowConfirm(false)}>
          <div
            className="bg-surface-card w-full max-w-sm rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="w-12 h-12 rounded-xl bg-accent-yellow/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} className="text-accent-yellow" />
              </div>
              <h3 className="text-lg font-semibold text-content-primary text-center mb-2">Block this time slot?</h3>
              <p className="text-content-muted text-sm text-center mb-4">
                The selected appointment types cannot be booked during this period.
              </p>
              <div className="p-3 bg-surface-dark border border-border rounded-xl text-sm space-y-2">
                <p className="text-content-secondary">
                  <span className="text-content-faint">Date:</span>{' '}
                  {blockData.startDate === blockData.endDate
                    ? formatDateDisplay(blockData.startDate)
                    : `${formatDateDisplay(blockData.startDate)} – ${formatDateDisplay(blockData.endDate)}`}
                </p>
                <p className="text-content-secondary">
                  <span className="text-content-faint">Time:</span> {blockData.startTime} – {blockData.endTime}
                </p>
                <div className="text-content-secondary">
                  <span className="text-content-faint">Blocked Types:</span>{' '}
                  {areAllSelected ? (
                    <span className="text-primary">All Types</span>
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
                  <p className="text-content-secondary">
                    <span className="text-content-faint">Note:</span> {blockData.note}
                  </p>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-5 py-2.5 text-sm font-medium text-content-muted hover:text-content-primary bg-surface-button hover:bg-surface-button-hover rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBlock}
                className="px-5 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-xl transition-colors"
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
