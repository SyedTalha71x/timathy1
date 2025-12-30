/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */

const PreviewModal = ({ showPreviewModal, setShowPreviewModal, previewForm }) => {
  // Render question input based on type
  const renderQuestionInput = (question) => {
    switch (question.type) {
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
            {question.options?.map((option, index) => (
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
          <input
            type="text"
            className="w-full bg-[#161616] border border-gray-600 rounded-lg px-4 py-3 text-gray-400 text-base cursor-default pointer-events-none"
            placeholder=""
            disabled
            readOnly
          />
        );
      default:
        return null;
    }
  };

  if (!showPreviewModal || !previewForm) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-lg p-4 sm:p-6 w-full max-w-6xl my-4 border border-gray-700 max-h-[calc(100vh-3rem)] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold">Form Preview</h2>
        
          <button
            onClick={() => setShowPreviewModal(false)}
            className="text-gray-400 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        <div className="bg-[#161616] border border-gray-600 rounded-lg p-4 sm:p-6 mb-6">
          <div className="text-center mb-2">
            <h3 className="text-lg sm:text-xl font-bold">Studio Name</h3>
            <p className="text-gray-400 text-sm sm:text-base">Member Medical History Form</p>
          </div>
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold break-words">{previewForm.title}</h1>
          </div>
        </div>

        <div className="space-y-6 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
          {previewForm.sections.map((section) => (
            <div key={section.id} className="bg-[#161616] border border-gray-700 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 border-b border-gray-600 pb-2 break-words">
                {section.name}
              </h3>
              
              <div className="space-y-4">
                {section.questions.map((question) => (
                  <div key={question.id} className="p-4 sm:p-4 bg-[#1C1C1C] rounded-lg">
                    <p className="font-medium text-base sm:text-base mb-3 break-words">
                      <span className="text-gray-400">{question.number}.</span> {question.text}
                    </p>
                    {renderQuestionInput(question)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-600">
          <div className="flex justify-end">
            <button
              onClick={() => setShowPreviewModal(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm transition-colors w-full sm:w-auto"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;