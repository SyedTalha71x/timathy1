/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { X, Check, AlertTriangle } from "lucide-react"
import { appointmentTypesData } from "../../../utils/studio-states"
import DatePickerField from '../../shared/DatePickerField'

/* 
  Modal for editing blocked time slots
*/
const EditBlockedSlotModalMain = ({ isOpen, onClose, initialBlock, onSubmit, onDelete }) => {
  // Get all appointment types (regular + trial training)
  const allAppointmentTypes = [
    ...appointmentTypesData.filter(t => !t.isTrialType),
    { id: 'trial', name: 'Trial Training', color: 'bg-trial', colorHex: '#3B82F6' }
  ];

  const [blockData, setBlockData] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    note: "",
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  // State für geblockte Terminarten
  const [blockedTypes, setBlockedTypes] = useState(() => {
    const initial = {};
    allAppointmentTypes.forEach(type => {
      initial[type.id] = true;
    });
    return initial;
  });

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

      // Set blocked types from initial block if available
      if (initialBlock.blockedTypes && Array.isArray(initialBlock.blockedTypes)) {
        const typesState = {};
        allAppointmentTypes.forEach(type => {
          typesState[type.id] = initialBlock.blockedTypes.includes(type.name);
        });
        setBlockedTypes(typesState);
      } else {
        // Default to all selected
        const initial = {};
        allAppointmentTypes.forEach(type => {
          initial[type.id] = true;
        });
        setBlockedTypes(initial);
      }
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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isFormValid) return;
    
    // Get selected type names
    const selectedTypeNames = allAppointmentTypes
      .filter(type => blockedTypes[type.id])
      .map(type => type.name);
    
    onSubmit({ 
      ...blockData, 
      blockAll: areAllSelected,
      blockedTypes: selectedTypeNames
    })
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

  // Get color hex from color string like "bg-[#EF4444]"
  const getColorHex = (type) => {
    if (type.colorHex) return type.colorHex;
    const match = type.color?.match(/#[A-Fa-f0-9]{6}/);
    return match ? match[0] : '#666666';
  };

  // Format date for display (YYYY-MM-DD → DD.MM.YYYY)
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}.${m}.${y}`;
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
              <h2 className="text-lg font-semibold text-content-primary">Edit Blocked Time Slot</h2>
              <button onClick={onClose} className="p-2 hover:bg-surface-button text-content-muted hover:text-content-primary rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="flex flex-col">
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
                  {allAppointmentTypes.map((type) => (
                    <label 
                      key={type.id} 
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-hover cursor-pointer transition-colors"
                    >
                      <div 
                        className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${
                          blockedTypes[type.id] 
                            ? 'border-primary bg-primary' 
                            : 'border-border bg-transparent'
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
                  placeholder="Add a note about this blocked time"
                  className="w-full bg-surface-dark border border-border text-content-primary resize-none rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors min-h-[80px]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex gap-3">
              <button
                type="button"
                onClick={handleDeleteClick}
                className="px-4 py-2.5 text-sm font-medium text-accent-red hover:text-accent-red hover:bg-accent-red/10 rounded-xl transition-colors"
              >
                Delete
              </button>
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
                className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                  isFormValid 
                    ? "text-white bg-primary hover:bg-primary-hover" 
                    : "text-content-faint bg-surface-button cursor-not-allowed"
                }`}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1001] p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div 
            className="bg-surface-card w-full max-w-sm rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="w-12 h-12 rounded-xl bg-accent-red/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} className="text-accent-red" />
              </div>
              <h3 className="text-lg font-semibold text-content-primary text-center mb-2">
                Delete Blocked Time Slot?
              </h3>
              <p className="text-content-muted text-sm text-center">
                Are you sure you want to delete this blocked time slot? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2.5 text-sm font-medium text-content-muted hover:text-content-primary bg-surface-button hover:bg-surface-button-hover rounded-xl transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
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
