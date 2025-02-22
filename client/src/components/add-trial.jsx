import { X } from "lucide-react";

/* eslint-disable react/prop-types */
const TrialPlanningModal = ({ isOpen, onClose, freeAppointments }) => {
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
          <h2 className="text-lg font-semibold text-white">
            Add Trial Training
          </h2>
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
              <label className="text-sm text-gray-200">Lead</label>
              <input
                type="text"
                placeholder="Search lead..."
                className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF]"
              />
            </div>

            <button
              type="button"
              className="w-full px-3 py-2 bg-[#3F74FF] text-white rounded-xl text-sm font-medium hover:bg-[#3F74FF]/90 transition-colors"
            >
              + Create New Lead
            </button>

            <div className="space-y-1.5">
              <label className="text-sm text-gray-200">Trial Type</label>
              <select className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]">
                <option value="">Select type</option>
                <option value="cardio">Cardio</option>
                <option value="strength">Strength</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-gray-200">Date & Time</label>
              <input
                type="datetime-local"
                className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-gray-200">Available Slots</label>
              <select className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]">
                <option value="">Select available time</option>
                {freeAppointments.map((app) => (
                  <option key={app.id} value={`${app.date}T${app.time}`}>
                    {app.date} at {app.time}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
            onClick={onClose}
          >
            Book Trial Training
          </button>
          {/* <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-black text-red-500 border-2 border-slate-500 rounded-xl text-sm font-medium hover:bg-slate-900 transition-colors"
          >
            Cancel
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default TrialPlanningModal;
