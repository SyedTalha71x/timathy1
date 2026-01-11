/* eslint-disable react/prop-types */
export default function SuccessModal({ isOpen, onClose, title, message, buttonText = "OK" }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#181818] rounded-xl p-6 max-w-md w-full mx-auto border border-gray-700">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-white text-lg font-semibold text-center mb-2">{title}</h3>
          
          <p className="text-gray-300 text-sm text-center mb-6">{message}</p>
          
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="bg-[#3F74FF] text-white px-6 py-2 rounded-xl hover:bg-[#3F74FF]/90 transition-colors text-sm font-medium"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    );
  }