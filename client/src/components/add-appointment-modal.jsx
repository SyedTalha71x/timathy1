/* eslint-disable no-unused-vars */

import { X } from "lucide-react";

/* eslint-disable react/prop-types */
const AddAppointmentModal = ({
  isOpen,
  onClose,
  appointmentTypes,
  onSubmit,
  setIsNotifyMemberOpen,
  setNotifyAction,
}) => {
  if (!isOpen) return null;

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

            <div className="space-y-1.5">
  <label className="text-sm text-gray-200">Date & Time</label>
  <input
    type="datetime-local"
    className="white-calendar-icon w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
  />
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
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAppointmentModal;
