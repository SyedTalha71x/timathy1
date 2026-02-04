/* eslint-disable react/prop-types */
import { IoIosClose, IoIosWarning } from "react-icons/io";

const CustomConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  confirmColor = "orange"
}) => {
  if (!isOpen) return null;

  const colorClasses = {
    orange: 'bg-orange-500 hover:bg-orange-600',
    blue: 'bg-blue-500 hover:bg-blue-600',
    red: 'bg-red-500 hover:bg-red-600',
    green: 'bg-green-500 hover:bg-green-600'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] rounded-xl max-w-md w-full border border-gray-800">
        <div className="p-6 border-b border-gray-800 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <IoIosWarning size={24} className="text-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <p className="text-gray-400 text-sm mt-1">Please confirm your action</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <IoIosClose size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-300">{message}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 ${colorClasses[confirmColor]} text-white py-3 px-4 rounded-lg transition-colors font-medium`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomConfirmationModal;