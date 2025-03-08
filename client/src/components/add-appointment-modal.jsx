/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X } from "lucide-react";
import { useState } from "react";

const AddAppointmentModal = ({
  isOpen,
  onClose,
  appointmentTypes = [],
  onSubmit,
  setIsNotifyMemberOpen,
  setNotifyAction,
  freeAppointments = []
}) => {
  if (!isOpen) return null;
  const [showRecurringOptions, setShowRecurringOptions] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [alternativeSlots, setAlternativeSlots] = useState([]);
  
  // Single appointment state
  const [appointmentData, setAppointmentData] = useState({
    date: "",
    timeSlot: "",
    type: "",
    member: "",
    specialNote: "",
    isImportant: false,
    noteStartDate: "",
    noteEndDate: ""
  });

  // Recurring appointment options
  const [recurringOptions, setRecurringOptions] = useState({
    frequency: "weekly", // weekly, biweekly, monthly
    dayOfWeek: "1", // 0-6 (Sunday-Saturday)
    startDate: "",
    occurrences: 5
  });

  // Update single appointment field
  const updateAppointment = (field, value) => {
    setAppointmentData({
      ...appointmentData,
      [field]: value
    });
    
    // Reset alternatives when date or time changes
    if (field === 'date' || field === 'timeSlot') {
      setShowAlternatives(false);
    }
  };

  // Update recurring options
  const updateRecurringOptions = (field, value) => {
    setRecurringOptions({
      ...recurringOptions,
      [field]: value
    });
  };

  // Check availability and show alternatives if needed
  const checkAvailability = () => {
    const { date, timeSlot } = appointmentData;
    
    // This would be replaced with actual availability logic
    // For this example, we'll just generate some alternative slots
    const isAvailable = Math.random() > 0.5; // Simulate 50% chance of unavailability
    
    if (!isAvailable) {
      // Generate alternative dates/times
      const alternatives = generateAlternativeSlots(date, timeSlot);
      setAlternativeSlots(alternatives);
      setShowAlternatives(true);
    } else {
      // Proceed with booking
      onClose();
      setIsNotifyMemberOpen(true);
      setNotifyAction("book");
    }
  };

  // Generate alternative slots (example implementation)
  const generateAlternativeSlots = (date, timeSlot) => {
    // This would use your actual appointment data
    // For demo purposes, we'll create sample alternatives
    const baseDate = new Date(date);
    const alternatives = [];
    
    // Add some time slots on the same day
    const timeOptions = ["9:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"];
    timeOptions.forEach(time => {
      if (time !== timeSlot) {
        alternatives.push({
          date: date,
          time: time,
          available: true
        });
      }
    });
    
    // Add some slots on nearby dates
    for (let i = 1; i <= 3; i++) {
      const nextDay = new Date(baseDate);
      nextDay.setDate(baseDate.getDate() + i);
      const dateString = nextDay.toISOString().split('T')[0];
      
      alternatives.push({
        date: dateString,
        time: timeSlot,
        available: true
      });
    }
    
    return alternatives;
  };

  // Select an alternative slot
  const selectAlternative = (alt) => {
    updateAppointment('date', alt.date);
    updateAppointment('timeSlot', alt.time);
    setShowAlternatives(false);
  };

  // Filter available time slots based on selected date
  const getAvailableSlots = (selectedDate) => {
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
          <form className="space-y-4 custom-scrollbar overflow-y-auto max-h-[50vh]">
            <div className="space-y-1.5">
              <label className="text-sm text-gray-200">Member</label>
              <input
                type="text"
                placeholder="Search member..."
                value={appointmentData.member}
                onChange={(e) => updateAppointment("member", e.target.value)}
                className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-gray-200">Appointment Type</label>
              <select 
                className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                value={appointmentData.type}
                onChange={(e) => updateAppointment("type", e.target.value)}
              >
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

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-200">Booking Type</label>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRecurringOptions(false)}
                  className={`px-4 py-2 text-sm rounded-xl ${
                    !showRecurringOptions 
                      ? "bg-[#3F74FF] text-white" 
                      : "bg-[#101010] text-gray-300"
                  }`}
                >
                  Single
                </button>
                <button
                  type="button"
                  onClick={() => setShowRecurringOptions(true)}
                  className={`px-4 py-2 text-sm rounded-xl ${
                    showRecurringOptions 
                      ? "bg-[#3F74FF] text-white" 
                      : "bg-[#101010] text-gray-300"
                  }`}
                >
                  Mass Booking
                </button>
              </div>
            </div>

            {!showRecurringOptions ? (
              // Single appointment
              <div className="space-y-3 p-3 bg-[#101010] rounded-xl">
                <div>
                  <label className="text-xs text-gray-400">Date</label>
                  <input
                    type="date"
                    value={appointmentData.date}
                    onChange={(e) => updateAppointment("date", e.target.value)}
                    className="w-full bg-[#181818] white-calendar-icon text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-400">Available Time Slots</label>
                  <select 
                    value={appointmentData.timeSlot}
                    onChange={(e) => updateAppointment("timeSlot", e.target.value)}
                    className="w-full bg-[#181818] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                    disabled={!appointmentData.date}
                  >
                    <option value="">Select time slot</option>
                    {getAvailableSlots(appointmentData.date).map((slot) => (
                      <option key={slot.id || `slot-${slot.time}`} value={slot.time}>
                        {slot.time}
                      </option>
                    ))}
                    {/* Show message if no time slots available */}
                    {appointmentData.date && getAvailableSlots(appointmentData.date).length === 0 && (
                      <option value="" disabled>No available slots for this date</option>
                    )}
                  </select>
                </div>
              </div>
            ) : (
              // Mass booking options
              <div className="space-y-3 p-3 bg-[#101010] rounded-xl">
                <div>
                  <label className="text-xs text-gray-400">Frequency</label>
                  <select
                    value={recurringOptions.frequency}
                    onChange={(e) => updateRecurringOptions("frequency", e.target.value)}
                    className="w-full bg-[#181818] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs text-gray-400">Day of Week</label>
                  <select
                    value={recurringOptions.dayOfWeek}
                    onChange={(e) => updateRecurringOptions("dayOfWeek", e.target.value)}
                    className="w-full bg-[#181818] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                  >
                    <option value="1">Monday</option>
                    <option value="2">Tuesday</option>
                    <option value="3">Wednesday</option>
                    <option value="4">Thursday</option>
                    <option value="5">Friday</option>
                    <option value="6">Saturday</option>
                    <option value="0">Sunday</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs text-gray-400">Start Date</label>
                  <input
                    type="date"
                    value={recurringOptions.startDate}
                    onChange={(e) => updateRecurringOptions("startDate", e.target.value)}
                    className="w-full bg-[#181818] white-calendar-icon text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-400">Number of Occurrences</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={recurringOptions.occurrences}
                    onChange={(e) => updateRecurringOptions("occurrences", e.target.value)}
                    className="w-full bg-[#181818] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-400">Time Slot</label>
                  <select 
                    value={appointmentData.timeSlot}
                    onChange={(e) => updateAppointment("timeSlot", e.target.value)}
                    className="w-full bg-[#181818] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                  >
                    <option value="">Select time slot</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                  </select>
                </div>
              </div>
            )}

            {/* Alternative slots section */}
            {showAlternatives && (
              <div className="space-y-1.5">
                <label className="text-sm text-gray-200">Alternative Appointments</label>
                <div className="bg-[#101010] rounded-xl p-3 overflow-x-auto">
                  <table className="w-full text-sm text-gray-200">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-2 px-2">Date</th>
                        <th className="text-left py-2 px-2">Time</th>
                        <th className="text-right py-2 px-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alternativeSlots.map((slot, index) => (
                        <tr key={index} className="border-b border-gray-800">
                          <td className="py-2 px-2">{new Date(slot.date).toLocaleDateString()}</td>
                          <td className="py-2 px-2">{slot.time}</td>
                          <td className="py-2 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => selectAlternative(slot)}
                              className="text-[#3F74FF] hover:text-[#5a8aff] text-xs"
                            >
                              Select
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm text-gray-200">Special Note</label>
              <textarea
                placeholder="Enter special note..."
                value={appointmentData.specialNote}
                onChange={(e) => updateAppointment("specialNote", e.target.value)}
                className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] min-h-[100px]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isImportant"
                checked={appointmentData.isImportant}
                onChange={(e) => updateAppointment("isImportant", e.target.checked)}
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
                  value={appointmentData.noteStartDate}
                  onChange={(e) => updateAppointment("noteStartDate", e.target.value)}
                  className="w-1/2 bg-[#101010] white-calendar-icon text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                />
                <input
                  type="date"
                  placeholder="End Date"
                  value={appointmentData.noteEndDate}
                  onChange={(e) => updateAppointment("noteEndDate", e.target.value)}
                  className="w-1/2 bg-[#101010] white-calendar-icon text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
            onClick={checkAvailability}
          >
            {showRecurringOptions ? "Book Mass Appointments" : "Book Appointment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAppointmentModal;