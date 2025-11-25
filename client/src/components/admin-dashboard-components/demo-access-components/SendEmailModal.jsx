/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { IoIosSend, IoIosClose } from "react-icons/io";

const SendEmailModal = ({ isOpen, onClose, demo, onSend }) => {
  if (!isOpen) return null;

  const handleSend = () => {
    onSend(true);
    onClose();
  };

  const handleSkip = () => {
    onSend(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] rounded-xl max-w-md w-full border border-gray-800">
        <div className="p-6 border-b border-gray-800 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <IoIosSend size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Send Demo Access Email?</h2>
              <p className="text-gray-400 text-sm mt-1">Notify the user about their demo access</p>
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
          <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4 mb-6">
            <p className="text-blue-400 text-sm">
              An email will be sent to <strong>{demo?.config.email}</strong> with instructions 
              to set up their password and access the demo environment for <strong>{demo?.config.studioName}</strong>.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSend}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <IoIosSend />
              Yes, Send Email Now
            </button>
            
            <button
              onClick={handleSkip}
              className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Skip for Now
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-transparent text-gray-400 py-2 px-4 rounded-lg hover:text-white transition-colors text-sm"
            >
              I'll do this later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendEmailModal;