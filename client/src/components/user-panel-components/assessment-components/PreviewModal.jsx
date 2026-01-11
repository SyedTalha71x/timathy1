/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import { X } from 'lucide-react';

const PreviewModal = ({ showPreviewModal, setShowPreviewModal, previewForm }) => {
  // Variable definitions with types and options
  const variableDefinitions = {
    firstName: { label: 'First Name', type: 'text' },
    lastName: { label: 'Last Name', type: 'text' },
    gender: { 
      label: 'Gender', 
      type: 'select', 
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'diverse', label: 'Diverse' }
      ]
    },
    birthdate: { label: 'Birthdate', type: 'date' },
    email: { label: 'Email', type: 'text' },
    telephone: { label: 'Telephone Number', type: 'text' },
    mobile: { label: 'Mobile Number', type: 'text' },
    street: { label: 'Street & Number', type: 'text' },
    zipCode: { label: 'ZIP Code', type: 'text' },
    city: { label: 'City', type: 'text' },
    country: { label: 'Country', type: 'text' },
    source: { 
      label: 'Source', 
      type: 'select',
      options: [
        { value: 'website', label: 'Website' },
        { value: 'social_media', label: 'Social Media' },
        { value: 'referral', label: 'Referral' },
        { value: 'advertisement', label: 'Advertisement' },
        { value: 'walk_in', label: 'Walk-in' },
        { value: 'other', label: 'Other' }
      ]
    }
  };

  // Get variable label
  const getVariableLabel = (variableValue) => {
    return variableDefinitions[variableValue]?.label || '';
  };

  // Get variable type
  const getVariableType = (item) => {
    if (item.variableType) return item.variableType;
    if (item.variable) {
      return variableDefinitions[item.variable]?.type || 'text';
    }
    return 'text';
  };

  // Get variable options
  const getVariableOptions = (item) => {
    if (item.variableOptions) return item.variableOptions;
    if (item.variable) {
      return variableDefinitions[item.variable]?.options || [];
    }
    return [];
  };

  // Get variable type label
  const getVariableTypeLabel = (variableType) => {
    switch (variableType) {
      case 'date':
        return 'Date';
      case 'select':
        return 'Selection';
      default:
        return 'Text';
    }
  };

  // Render the appropriate input based on variable type
  const renderVariableInput = (item) => {
    const variableType = getVariableType(item);
    const variableOptions = getVariableOptions(item);
    const variableLabel = getVariableLabel(item.variable);

    switch (variableType) {
      case 'select':
        return (
          <div className="mt-3">
            <div className="relative">
              <select
                className="w-full bg-[#161616] border border-gray-600 rounded-lg px-4 py-3 text-gray-300 text-base cursor-default appearance-none"
                disabled
              >
                <option value="">Select {variableLabel}...</option>
                {variableOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <svg 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Linked to: {variableLabel} ({getVariableTypeLabel(variableType)})
            </div>
          </div>
        );
      
      case 'date':
        return (
          <div className="mt-3">
            <div className="relative">
              <input
                type="date"
                className="w-full bg-[#161616] border border-gray-600 rounded-lg px-4 py-3 text-gray-400 text-base cursor-default pointer-events-none"
                disabled
                readOnly
              />
            </div>
            <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Linked to: {variableLabel} ({getVariableTypeLabel(variableType)})
            </div>
          </div>
        );
      
      default: // text
        return (
          <div className="mt-3">
            <input
              type="text"
              className="w-full bg-[#161616] border border-gray-600 rounded-lg px-4 py-3 text-gray-400 text-base cursor-default pointer-events-none"
              placeholder={`[${variableLabel}]`}
              disabled
              readOnly
            />
            <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Linked to: {variableLabel}
            </div>
          </div>
        );
    }
  };

  // Render question input based on type
  const renderQuestionInput = (item) => {
    switch (item.type) {
      case 'yesno':
        return (
          <div className="flex flex-wrap gap-4 mt-3">
            <label className="flex items-center gap-2 cursor-default">
              <input 
                type="checkbox" 
                className="w-5 h-5 cursor-default pointer-events-none" 
                disabled 
                readOnly
              />
              <span className="text-gray-300">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-default">
              <input 
                type="checkbox" 
                className="w-5 h-5 cursor-default pointer-events-none" 
                disabled 
                readOnly
              />
              <span className="text-gray-300">No</span>
            </label>
          </div>
        );
      case 'yesnodontknow':
        return (
          <div className="flex flex-wrap gap-4 mt-3">
            <label className="flex items-center gap-2 cursor-default">
              <input 
                type="checkbox" 
                className="w-5 h-5 cursor-default pointer-events-none" 
                disabled 
                readOnly
              />
              <span className="text-gray-300">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-default">
              <input 
                type="checkbox" 
                className="w-5 h-5 cursor-default pointer-events-none" 
                disabled 
                readOnly
              />
              <span className="text-gray-300">No</span>
            </label>
            <label className="flex items-center gap-2 cursor-default">
              <input 
                type="checkbox" 
                className="w-5 h-5 cursor-default pointer-events-none" 
                disabled 
                readOnly
              />
              <span className="text-gray-300">Don't know</span>
            </label>
          </div>
        );
      case 'multiple':
        return (
          <div className="space-y-3 mt-3">
            {item.options?.map((option, index) => (
              <label key={option.id} className="flex items-center gap-2 cursor-default">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 cursor-default pointer-events-none" 
                  disabled 
                  readOnly
                />
                <span className="text-gray-300">
                  {String.fromCharCode(97 + index)}). {option.text}
                </span>
              </label>
            ))}
          </div>
        );
      case 'text':
        return (
          <div className="mt-3">
            <input
              type="text"
              className="w-full bg-[#161616] border border-gray-600 rounded-lg px-4 py-3 text-gray-400 text-base cursor-default pointer-events-none"
              placeholder="Text input..."
              disabled
              readOnly
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (!showPreviewModal || !previewForm) return null;

  // Format date and location
  const getDateAndLocation = () => {
    const parts = [];
    
    if (previewForm.signatureSettings?.showLocation && previewForm.signatureSettings?.defaultLocation) {
      parts.push(previewForm.signatureSettings.defaultLocation);
    }
    
    if (previewForm.signatureSettings?.showDate) {
      parts.push(new Date().toLocaleDateString());
    }
    
    return parts.join(', ');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl border border-gray-700 flex flex-col max-h-[90vh]">
        {/* Fixed Header */}
        <div className="flex-shrink-0 flex justify-between items-center p-6 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-white">
              {previewForm.title}
            </h2>
            <p className="text-gray-400 text-sm">
              Form Preview
            </p>
          </div>
          <button
            onClick={() => setShowPreviewModal(false)}
            className="text-gray-400 hover:text-white text-lg p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Form Sections */}
          <div className="space-y-6">
            {previewForm.sections.map((section) => (
              <div key={section.id} className="bg-[#161616] border border-gray-600 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-600 pb-2">
                  {section.name}
                </h3>
                
                <div className="space-y-6">
                  {/* Support both old structure (questions) and new structure (items) */}
                  {(section.items || section.questions || []).map((item) => {
                    // Text block rendering
                    if (item.itemType === 'textBlock') {
                      return (
                        <div key={item.id} className="p-4 bg-[#1C1C1C] rounded-lg">
                          <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {item.text}
                          </p>
                        </div>
                      );
                    }
                    
                    // Variable field rendering
                    if (item.itemType === 'variableField') {
                      return (
                        <div key={item.id} className="p-4 bg-[#1C1C1C] rounded-lg">
                          <p className="font-medium text-white mb-1">
                            {item.number}. {item.text || 'Untitled Variable Field'}
                            {item.required !== false && <span className="text-red-500 ml-1">*</span>}
                          </p>
                          {item.variable ? (
                            renderVariableInput(item)
                          ) : (
                            <div className="mt-3 text-sm text-gray-500 italic">
                              No variable selected
                            </div>
                          )}
                        </div>
                      );
                    }
                    
                    // Question rendering (default)
                    return (
                      <div key={item.id} className="p-4 bg-[#1C1C1C] rounded-lg">
                        <p className="font-medium text-white mb-3">
                          {item.number}. {item.text}
                          {item.required !== false && <span className="text-red-500 ml-1">*</span>}
                        </p>
                        {renderQuestionInput(item)}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Signature Section */}
          <div className="mt-6 bg-[#161616] border border-gray-600 rounded-lg p-6">
            <div className="mb-4">
              {/* Signature Canvas - Smaller */}
              <div className="bg-[#1C1C1C] border-2 border-gray-600 rounded-lg overflow-hidden p-8">
                <div className="w-full h-32 flex flex-col justify-end">
                  <div className="w-full border-b-2 border-gray-600"></div>
                  {/* Date and Location under signature line */}
                  {getDateAndLocation() && (
                    <div className="text-sm text-gray-400 mt-2">
                      {getDateAndLocation()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 flex justify-end p-6 border-t border-gray-700">
          <button
            onClick={() => setShowPreviewModal(false)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
