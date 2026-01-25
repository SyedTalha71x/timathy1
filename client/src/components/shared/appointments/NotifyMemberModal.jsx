/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";

export default function NotifyMemberModalMain({ open, action, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-white">Notify Member</h2>
            <button onClick={onClose} className="p-2 hover:bg-zinc-700 text-white rounded-lg">
              <X size={16} />
            </button>
          </div>

          {/* Message */}
          <p className="text-gray-300 text-sm mb-4">
            {action === "book" && "Would you like to notify the member about their new appointment?"}
            {action === "change" && "Would you like to notify the member about changes to their appointment?"}
            {action === "delete" &&
              "Would you like to notify the member that their appointment has been cancelled?"}
          </p>

          {/* Buttons */}
          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-xl"
            >
              No
            </button>
            <button
              onClick={() => {
                toast.success("Member has been notified successfully!");
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm text-white rounded-xl"
            >
              Yes, Notify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
