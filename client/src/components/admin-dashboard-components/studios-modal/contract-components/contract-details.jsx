/* eslint-disable react/prop-types */
import { X } from "lucide-react";

const ContractDetailsModal = ({ isOpen, onClose, contract }) => {
  if (!isOpen || !contract) return null;

  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-2xl relative">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-lg font-semibold">Contract Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Details */}
          <div className="space-y-4 text-white">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm">Contract Type</label>
                <p className="text-white">{contract.type}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Start Date</label>
                <p className="text-white">{contract.startDate}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">End Date</label>
                <p className="text-white">{contract.endDate}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Status</label>
                <p className="text-white">{contract.status}</p>
              </div>
            </div>

            {/* Files */}
            {contract.files && contract.files.length > 0 && (
              <div>
                <label className="text-gray-400 text-sm">Attached Files</label>
                <div className="mt-2 space-y-1">
                  {contract.files.map((file, index) => (
                    <p key={index} className="text-blue-400">
                      {file}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetailsModal;
