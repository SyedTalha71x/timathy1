/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X, Plus, Trash } from "lucide-react";
import { useState } from "react";

const AddAppointmentModal = ({
  isOpen,
  onClose,
  appointmentTypes = [], // Add default empty array
  onSubmit,
  setIsNotifyMemberOpen,
  setNotifyAction,
  freeAppointments = [] // Add default empty array to prevent undefined errors
}) => {
  if (!isOpen) return null;
  const [recurringAppointments, setRecurringAppointments] = useState([{ 
    date: "", 
    timeSlot: "" 
  }]);

  // Add another recurring appointment slot
  const addRecurring = () => {
    setRecurringAppointments([
      ...recurringAppointments,
      { date: "", timeSlot: "" }
    ]);
  };

  // Remove a recurring appointment slot
  const removeRecurring = (index) => {
    const updated = [...recurringAppointments];
    updated.splice(index, 1);
    setRecurringAppointments(updated);
  };

  // Update a specific recurring appointment
  const updateRecurring = (index, field, value) => {
    const updated = [...recurringAppointments];
    updated[index][field] = value;
    setRecurringAppointments(updated);
  };

  // Filter available time slots based on selected date
  const getAvailableSlots = (selectedDate) => {
    // Ensure freeAppointments exists and is an array before filtering
    if (!selectedDate || !Array.isArray(freeAppointments)) return [];
    return freeAppointments.filter(app => app && app.date === selectedDate);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Add appointment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <form className="space-y-4 custom-scrollbar overflow-y-auto max-h-[70vh]">
            <div className="space-y-1.5">
              <label className="text-sm text-gray-200">Member</label>
              <input
                type="text"
                placeholder="Search member..."
                className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-gray-200">Appointment Type</label>
              <select className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]">
                <option value="">Select type</option>
                {appointmentTypes.map((type) => (
                  <option
                    key={type.name}
                    value={type.name}
                    className={type.color}
                  >
                    {type.name} ({type.duration} minutes)
                  </option>
                ))}
              </select>
            </div>

            {/* Recurring appointments section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-200">Appointment Dates & Times</label>
                <button 
                  type="button"
                  onClick={addRecurring}
                  className="text-[#3F74FF] hover:text-[#5a8aff] text-sm flex items-center gap-1"
                >
                  <Plus size={16} /> Add another date
                </button>
              </div>
              
              {recurringAppointments.map((appointment, index) => (
                <div key={index} className="p-3 bg-[#101010] rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-200">Appointment {index + 1}</span>
                    {recurringAppointments.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => removeRecurring(index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash size={16} />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="text-xs text-gray-400">Date</label>
                      <input
                        type="date"
                        value={appointment.date}
                        onChange={(e) => updateRecurring(index, "date", e.target.value)}
                        className="w-full bg-[#181818] white-calendar-icon text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-400">Available Time Slots</label>
                      <select 
                        value={appointment.timeSlot}
                        onChange={(e) => updateRecurring(index, "timeSlot", e.target.value)}
                        className="w-full bg-[#181818] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                        disabled={!appointment.date}
                      >
                        <option value="">Select time slot</option>
                        {getAvailableSlots(appointment.date).map((slot) => (
                          <option key={slot.id || `slot-${slot.time}`} value={slot.time}>
                            {slot.time}
                          </option>
                        ))}
                        {/* Show message if no time slots available */}
                        {appointment.date && getAvailableSlots(appointment.date).length === 0 && (
                          <option value="" disabled>No available slots for this date</option>
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-gray-200">Special Note</label>
              <textarea
                placeholder="Enter special note..."
                className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] min-h-[100px]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isImportant"
                className="rounded text-[#3F74FF] focus:ring-[#3F74FF]"
              />
              <label htmlFor="isImportant" className="text-sm text-gray-200">
                Mark as important
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-gray-200">Note Duration</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  placeholder="Start Date"
                  className="w-1/2 bg-[#101010] white-calendar-icon text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                />
                <input
                  type="date"
                  placeholder="End Date"
                  className="w-1/2 bg-[#101010] white-calendar-icon text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
            onClick={() => {
              onClose();
              setIsNotifyMemberOpen(true);
              setNotifyAction("book");
            }}
          >
            Book Appointment{recurringAppointments.length > 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAppointmentModal;