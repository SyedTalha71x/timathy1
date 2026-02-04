/* eslint-disable react/prop-types */
import { IoIosClose, IoIosJournal } from "react-icons/io";
import { FaHistory } from "react-icons/fa";

const JournalModal = ({ isOpen, onClose, demo }) => {
  if (!isOpen || !demo) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-gray-800">
        <div className="p-6 border-b border-gray-800 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <IoIosJournal size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Demo Activity Journal</h2>
              <p className="text-gray-400 text-sm mt-1">{demo.config.studioName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <IoIosClose size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {demo.journal && demo.journal.length > 0 ? (
            <div className="space-y-4">
              {demo.journal.map((entry, index) => (
                <div key={index} className="border-l-2 border-blue-500 pl-4 pb-4 relative">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-white">{entry.action}</h3>
                    <span className="text-xs text-gray-400">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-1">{entry.details}</p>
                  <div className="flex items-center gap-2">
                    <FaHistory className="text-gray-500 text-xs" />
                    <span className="text-xs text-gray-500">By: {entry.user}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <IoIosJournal size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No activity recorded yet</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JournalModal;