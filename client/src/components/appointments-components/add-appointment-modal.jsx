/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Search, X, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";

const AddAppointmentModal = ({
  isOpen,
  onClose,
  appointmentTypes = [],
  onSubmit,
  setIsNotifyMemberOpen,
  setNotifyAction,
  freeAppointments = [],
}) => {
  if (!isOpen) return null;
  const [showRecurringOptions, setShowRecurringOptions] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [alternativeSlots, setAlternativeSlots] = useState([]);

  // Single appointment state with support for multiple members
  const [appointmentData, setAppointmentData] = useState({
    date: "",
    timeSlot: "",
    type: "",
    members: [{ id: 1, name: "", searchValue: "" }], // Array of members
    specialNote: {
      text: "",
      isImportant: false,
      startDate: "",
      endDate: "",
    },
  });

  // Recurring appointment options
  const [recurringOptions, setRecurringOptions] = useState({
    frequency: "weekly", // weekly, biweekly, monthly
    dayOfWeek: "1", // 0-6 (Sunday-Saturday)
    startDate: "",
    occurrences: 5,
  });

  // Update single appointment field
  const updateAppointment = (field, value) => {
    setAppointmentData({
      ...appointmentData,
      [field]: value,
    });

    // Reset alternatives when date or time changes
    if (field === "date" || field === "timeSlot") {
      setShowAlternatives(false);
    }
  };

  // Add a new member to the appointment
  const addMember = () => {
    const newMember = {
      id: Date.now(), // Simple ID generation
      name: "",
      searchValue: "",
    };
    setAppointmentData({
      ...appointmentData,
      members: [...appointmentData.members, newMember],
    });
  };

  // Remove a member from the appointment
  const removeMember = (memberId) => {
    if (appointmentData.members.length > 1) {
      setAppointmentData({
        ...appointmentData,
        members: appointmentData.members.filter(member => member.id !== memberId),
      });
    }
  };

  // Update a specific member's information
  const updateMember = (memberId, field, value) => {
    setAppointmentData({
      ...appointmentData,
      members: appointmentData.members.map(member =>
        member.id === memberId ? { ...member, [field]: value } : member
      ),
    });
  };

  // Update recurring options
  const updateRecurringOptions = (field, value) => {
    setRecurringOptions({
      ...recurringOptions,
      [field]: value,
    });
  };

  // Check availability and show alternatives if needed
  const checkAvailability = () => {
    const { date, timeSlot, members } = appointmentData;
    const validMembers = members.filter(member => member.name.trim() !== "");

    if (validMembers.length === 0) {
      alert("Please add at least one member to the appointment.");
      return;
    }

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
    timeOptions.forEach((time) => {
      if (time !== timeSlot) {
        alternatives.push({
          date: date,
          time: time,
          available: true,
        });
      }
    });

    // Add some slots on nearby dates
    for (let i = 1; i <= 3; i++) {
      const nextDay = new Date(baseDate);
      nextDay.setDate(baseDate.getDate() + i);
      const dateString = nextDay.toISOString().split("T")[0];

      alternatives.push({
        date: dateString,
        time: timeSlot,
        available: true,
      });
    }

    return alternatives;
  };

  // Select an alternative slot
  const selectAlternative = (alt) => {
    updateAppointment("date", alt.date);
    updateAppointment("timeSlot", alt.time);
    setShowAlternatives(false);
  };

  // Filter available time slots based on selected date
  const getAvailableSlots = (selectedDate) => {
    if (!selectedDate || !Array.isArray(freeAppointments)) return [];
    return freeAppointments.filter((app) => app && app.date === selectedDate);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#181818] w-[90%] sm:w-[520px] rounded-xl overflow-hidden"
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
          <div className="space-y-4 custom-scrollbar overflow-y-auto max-h-[60vh]">
            {/* Members Section */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-200 flex items-center gap-2">
                  <Users size={16} />
                  Members ({appointmentData.members.length})
                </label>
                <button
                  type="button"
                  onClick={addMember}
                  className="flex items-center gap-1 px-3 py-1 bg-[#FF843E] text-white text-xs rounded-lg  transition-colors"
                >
                  <Plus size={14} />
                  Add Member
                </button>
              </div>
              
              <div className="space-y-2">
                {appointmentData.members.map((member, index) => (
                  <div key={member.id} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      />
                      <input
                        type="text"
                        placeholder={`Member ${index + 1} name...`}
                        value={member.name}
                        onChange={(e) => updateMember(member.id, "name", e.target.value)}
                        className="w-full bg-[#101010] text-sm rounded-xl px-10 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF]"
                      />
                    </div>
                    {appointmentData.members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMember(member.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
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
                      ? "bg-[#FF843E] text-white"
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
                      ? "bg-[#FF843E] text-white"
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
                  <label className="text-xs text-gray-400">
                    Available Time Slots
                  </label>
                  <select
                    value={appointmentData.timeSlot}
                    onChange={(e) =>
                      updateAppointment("timeSlot", e.target.value)
                    }
                    className="w-full bg-[#181818] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                    disabled={!appointmentData.date}
                  >
                    <option value="">Select time slot</option>
                    {getAvailableSlots(appointmentData.date).map((slot) => (
                      <option
                        key={slot.id || `slot-${slot.time}`}
                        value={slot.time}
                      >
                        {slot.time}
                      </option>
                    ))}
                    {/* Show message if no time slots available */}
                    {appointmentData.date &&
                      getAvailableSlots(appointmentData.date).length === 0 && (
                        <option value="" disabled>
                          No available slots for this date
                        </option>
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
                    onChange={(e) =>
                      updateRecurringOptions("frequency", e.target.value)
                    }
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
                    onChange={(e) =>
                      updateRecurringOptions("dayOfWeek", e.target.value)
                    }
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
                    onChange={(e) =>
                      updateRecurringOptions("startDate", e.target.value)
                    }
                    className="w-full bg-[#181818] white-calendar-icon text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400">
                    Number of Occurrences
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={recurringOptions.occurrences}
                    onChange={(e) =>
                      updateRecurringOptions("occurrences", e.target.value)
                    }
                    className="w-full bg-[#181818] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400">Time Slot</label>
                  <select
                    value={appointmentData.timeSlot}
                    onChange={(e) =>
                      updateAppointment("timeSlot", e.target.value)
                    }
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
                <label className="text-sm text-gray-200">
                  Alternative Appointments
                </label>
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
                          <td className="py-2 px-2">
                            {new Date(slot.date).toLocaleDateString()}
                          </td>
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

            <div className="border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm text-gray-200 font-medium">
                  Special Note
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isImportant"
                    checked={appointmentData.specialNote.isImportant}
                    onChange={(e) =>
                      updateAppointment("specialNote", {
                        ...appointmentData.specialNote,
                        isImportant: e.target.checked,
                      })
                    }
                    className="mr-2 h-4 w-4 accent-[#FF843E]"
                  />
                  <label
                    htmlFor="isImportant"
                    className="text-sm text-gray-200"
                  >
                    Important
                  </label>
                </div>
              </div>

              <textarea
                value={appointmentData.specialNote.text}
                onChange={(e) =>
                  updateAppointment("specialNote", {
                    ...appointmentData.specialNote,
                    text: e.target.value,
                  })
                }
                className="w-full bg-[#101010] resize-none rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px] mb-4"
                placeholder="Enter special note..."
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-200 block mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={appointmentData.specialNote.startDate || ""}
                    onChange={(e) =>
                      updateAppointment("specialNote", {
                        ...appointmentData.specialNote,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-200 block mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={appointmentData.specialNote.endDate || ""}
                    onChange={(e) =>
                      updateAppointment("specialNote", {
                        ...appointmentData.specialNote,
                        endDate: e.target.value,
                      })
                    }
                    className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-[#FF843E] text-sm font-medium text-white rounded-xl  transition-colors"
            onClick={checkAvailability}
          >
            {showRecurringOptions
              ? "Book Mass Appointments"
              : `Book Appointment${appointmentData.members.length > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAppointmentModal;