/* eslint-disable react/prop-types */
import { RiShieldKeyholeLine } from "react-icons/ri";

const TemplateSelectionModal = ({ isOpen, onClose, onSelectTemplate, templates }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Choose a Template</h2>
          <p className="text-gray-400 text-sm mt-1">Select a template with specific permissions for the demo</p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map(template => (
              <div
                key={template.id}
                onClick={() => {
                  onSelectTemplate(template);
                  onClose();
                }}
                className="border-2 border-gray-700 rounded-xl p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-500/10 transition-all group"
              >
                <RiShieldKeyholeLine size={40} className="text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                
                <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{template.description}</p>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-300">Permissions:</h4>
                  {Object.entries(template.permissions).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        value ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {value ? (
                          <span className="text-white text-xs">✓</span>
                        ) : (
                          <span className="text-white text-xs">✗</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-700">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Select Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelectionModal;