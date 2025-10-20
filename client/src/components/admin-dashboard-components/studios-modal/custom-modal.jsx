/* eslint-disable react/prop-types */
// components/CustomModal.jsx
export default function CustomModal({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    footer,
    width = "90%",
    maxWidth = "1400px" 
  }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50 ">
        <div 
          className="bg-[#1C1C1C] rounded-lg shadow-2xl border border-[#303030] flex flex-col max-h-[90vh]"
          style={{ width, maxWidth }}
        >
          <div className="flex items-center justify-between p-6 border-b border-[#303030]">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl font-bold transition-colors"
            >
              ×
            </button>
          </div>
  
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
  
          {footer && (
            <div className="flex justify-end gap-3 p-6 border-t border-[#303030] bg-[#252525]">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  }