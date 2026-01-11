/* eslint-disable react/prop-types */
import { X } from "lucide-react";
import { useState } from "react";

const CancelAppointmentModal = ({ 
    isOpen, 
    onClose, 
    appointment,
    onConfirmCancel 
  }) => {
    const [reason, setReason] = useState("");
    const [notifyMember, setNotifyMember] = useState(true);
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Cancel Appointment</h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-700 rounded-lg">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-white mb-2">
                  Are you sure you want to cancel the appointment with {appointment?.name} on {appointment?.date}?
                </p>
                <div className="mb-4">
                  <label className="block text-sm text-zinc-400 mb-2">Reason for cancellation</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-3 bg-black rounded-xl text-sm outline-none"
                    placeholder="Enter reason (optional)"
                    rows={3}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="notifyMember"
                    checked={notifyMember}
                    onChange={(e) => setNotifyMember(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="notifyMember" className="text-sm text-zinc-300">
                    Notify member about cancellation
                  </label>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-6">
                <button 
                  onClick={onClose} 
                  className="px-4 py-2 text-sm rounded-xl hover:bg-zinc-700"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    onConfirmCancel(reason, notifyMember);
                    onClose();
                  }}
                  className="px-4 py-2 text-sm rounded-xl bg-red-600 hover:bg-red-700"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default CancelAppointmentModal;