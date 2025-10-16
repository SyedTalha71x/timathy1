/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const EditAppointmentModalStaff = ({
  selectedAppointmentStaff,
  setSelectedAppointmentStaff,
  appointmentTypesStaff,
  freeAppointmentsStaff,
  handleAppointmentChangeStaff,
  appointmentsStaff,
  setAppointmentsStaff,
  setIsNotifyStaffOpen,
  setNotifyActionStaff,
  onDelete,
}) => {
  if (!selectedAppointmentStaff) return null;

  const [showAlternatives, setShowAlternatives] = useState(false);
  const [alternativeSlots, setAlternativeSlots] = useState([]);
  const [showRecurringOptions, setShowRecurringOptions] = useState(false);

  const [isDeleteConfirm, setisDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(selectedAppointmentStaff.id);
    setisDeleteConfirm(false);
  };

  // Initialize recurring options
  const [recurringOptions, setRecurringOptions] = useState({
    frequency: "weekly", // weekly, biweekly, monthly
    dayOfWeek: "1", // 0-6 (Sunday-Saturday)
    startDate: selectedAppointmentStaff.date || "",
    occurrences: 5,
  });

  // Update recurring options when needed
  useEffect(() => {
    if (selectedAppointmentStaff && selectedAppointmentStaff.recurring) {
      setShowRecurringOptions(true);
      setRecurringOptions({
        ...recurringOptions,
        ...selectedAppointmentStaff.recurring,
      });
    } else {
      setShowRecurringOptions(false);
    }
  }, [selectedAppointmentStaff]);

  // Update recurring options
  const updateRecurringOptions = (field, value) => {
    setRecurringOptions({
      ...recurringOptions,
      [field]: value,
    });

    // Update the appointment with recurring options
    handleAppointmentChangeStaff({
      recurring: {
        ...recurringOptions,
        [field]: value,
      },
    });
  };

  // Filter available time slots based on selected date
  const getAvailableSlots = (selectedDate) => {
    if (!selectedDate) return [];

    const slots = freeAppointmentsStaff.filter((app) => app.date === selectedDate);

    // Add the current appointment's time to available slots if it's on this date
    if (selectedDate === selectedAppointmentStaff.date) {
      const existingTime = {
        id: "current",
        time: selectedAppointmentStaff.time,
        date: selectedAppointmentStaff.date,
      };

      // Check if the time already exists in the list
      const timeExists = slots.some((slot) => slot.time === existingTime.time);

      if (!timeExists) {
        slots.push(existingTime);
      }
    }

    return slots;
  };

  // Toggle between single and recurring appointment
  const toggleBookingType = (isRecurring) => {
    setShowRecurringOptions(isRecurring);

    // Update the appointment with recurring flag
    handleAppointmentChangeStaff({
      recurring: isRecurring ? recurringOptions : null,
    });
  };

  // Generate alternative slots when current selection is unavailable
  const checkAvailability = () => {
    // In a real app, this would check actual availability
    const isAvailable = Math.random() > 0.5; // Simulate 50% availability

    if (!isAvailable) {
      const alternatives = generateAlternativeSlots(
        selectedAppointmentStaff.date,
        selectedAppointmentStaff.time
      );
      setAlternativeSlots(alternatives);
      setShowAlternatives(true);
    } else {
      // Save changes and show notification
      saveChanges();
    }
  };

  // Generate alternative time slots
  const generateAlternativeSlots = (date, time) => {
    const baseDate = new Date(date);
    const alternatives = [];

    // Add some time slots on the same day
    const timeOptions = ["9:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"];
    timeOptions.forEach((t) => {
      if (t !== time) {
        alternatives.push({
          date: date,
          time: t,
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
        time: time,
        available: true,
      });
    }

    return alternatives;
  };

  // Select an alternative slot
  const selectAlternative = (alt) => {
    handleAppointmentChangeStaff({
      date: alt.date,
      time: alt.time,
    });
    setShowAlternatives(false);
  };

  // Save changes to the appointments list
  const saveChanges = () => {
    const updatedAppointments = appointmentsStaff.map((app) =>
      app.id === selectedAppointmentStaff.id ? selectedAppointmentStaff : app
    );

    setAppointmentsStaff(updatedAppointments);
    setIsNotifyStaffOpen(true);
    setNotifyActionStaff("change");
    setSelectedAppointmentStaff(null);
  };


  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000000] p-4"
      onClick={() => setSelectedAppointmentStaff(null)}
    >
      <div
        className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Edit Appointment</h2>
          <button
            onClick={() => setSelectedAppointmentStaff(null)}
            className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <form className="space-y-4 custom-scrollbar overflow-y-auto max-h-[50vh]">
            <div className="space-y-1.5">
              <label className="text-sm text-gray-200">Staff</label>
              <input
                type="text"
                value={selectedAppointmentStaff.name}
                readOnly
                className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-gray-200">Appointment Type</label>
              <select
                value={selectedAppointmentStaff.type}
                onChange={(e) =>
                  handleAppointmentChangeStaff({ type: e.target.value })
                }
                className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
              >
                {appointmentTypesStaff.map((type) => (
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
                  onClick={() => toggleBookingType(false)}
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
                  onClick={() => toggleBookingType(true)}
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
                    value={selectedAppointmentStaff.date}
                    onChange={(e) => {
                      handleAppointmentChangeStaff({
                        date: e.target.value,
                      });
                      setShowAlternatives(false);
                    }}
                    className="w-full bg-[#181818] white-calendar-icon text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400">
                    Available Time Slots
                  </label>
                  <select
                    value={selectedAppointmentStaff.time}
                    onChange={(e) => {
                      handleAppointmentChangeStaff({
                        time: e.target.value,
                      });
                      setShowAlternatives(false);
                    }}
                    className="w-full bg-[#181818] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                  >
                    {getAvailableSlots(selectedAppointmentStaff.date).map((slot) => (
                      <option
                        key={slot.id || `slot-${slot.time}`}
                        value={slot.time}
                      >
                        {slot.time}
                      </option>
                    ))}
                    {/* Show message if no time slots available */}
                    {selectedAppointmentStaff.date &&
                      getAvailableSlots(selectedAppointmentStaff.date).length ===
                        0 && (
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
                    value={selectedAppointmentStaff.time}
                    onChange={(e) =>
                      handleAppointmentChangeStaff({ time: e.target.value })
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
                    checked={selectedAppointmentStaff.specialNote.isImportant}
                    onChange={(e) =>
                      handleAppointmentChangeStaff({
                        specialNote: {
                          ...selectedAppointmentStaff.specialNote,
                          isImportant: e.target.checked,
                        },
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
                value={selectedAppointmentStaff.specialNote.text}
                onChange={(e) =>
                  handleAppointmentChangeStaff({
                    specialNote: {
                      ...selectedAppointmentStaff.specialNote,
                      text: e.target.value,
                    },
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
                    value={selectedAppointmentStaff.specialNote.startDate || ""}
                    onChange={(e) =>
                      handleAppointmentChangeStaff({
                        specialNote: {
                          ...selectedAppointmentStaff.specialNote,
                          startDate: e.target.value,
                        },
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
                    value={selectedAppointmentStaff.specialNote.endDate || ""}
                    onChange={(e) =>
                      handleAppointmentChangeStaff({
                        specialNote: {
                          ...selectedAppointmentStaff.specialNote,
                          endDate: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
          <button
            onClick={checkAvailability}
            className="w-full sm:w-auto px-5 py-2.5 text-sm bg-[#FF843E]  font-medium text-white rounded-xl transition-colors"
          >
            {showRecurringOptions ? "Save Mass Bookings" : "Save Changes"}
          </button>
          <button
            onClick={() => setisDeleteConfirm(true)}
            className="bg-black text-red-600 text-sm border-slate-600 py-2 px-6 rounded-xl cursor-pointer"
          >
            Delete
          </button>
        </div>

        {isDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
            <div className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">
                  Confirm Deletion
                </h2>
                <button
                  onClick={() => setisDeleteConfirm(false)}
                  className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <p className="text-white text-sm">
                  Are you sure you want to delete this appointment with{" "}
                  {selectedAppointmentStaff.name} on {selectedAppointmentStaff.date} at{" "}
                  {selectedAppointmentStaff.time}?
                </p>
              </div>

              <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
                <button
                  onClick={handleDelete}
                  className="w-full sm:w-auto px-5 py-2.5 bg-red-600 text-sm font-medium text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  Yes, Delete Appointment
                </button>
                <button
                  onClick={() => setisDeleteConfirm(false)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gray-800 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors"
                >
                  No, Keep Appointment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditAppointmentModalStaff;