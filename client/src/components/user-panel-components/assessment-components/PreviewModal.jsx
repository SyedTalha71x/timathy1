/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */

const PreviewModal = ({ showPreviewModal, setShowPreviewModal, previewForm }) => {
    // Render question input based on type
    const renderQuestionInput = (question) => {
      switch (question.type) {
        case 'yesno':
          return (
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>No</span>
              </label>
            </div>
          );
        case 'yesnodontknow':
          return (
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>No</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>Don't know</span>
              </label>
            </div>
          );
        case 'multiple':
          return (
            <div className="space-y-2 mt-2">
              {question.options?.map((option, index) => (
                <label key={option.id} className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>{String.fromCharCode(97 + index)}). {option.text}</span>
                </label>
              ))}
            </div>
          );
        case 'text':
          return (
            <input
              type="text"
              className="w-full bg-[#161616] border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 mt-2"
              placeholder="Enter your answer..."
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
              <p className="text-gray-400 text-sm sm:text-base">Member Assessment Form</p>
            </div>
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-bold">{previewForm.title}</h1>
            </div>
          </div>
  
          <div className="space-y-6 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
            {previewForm.sections.map((section) => (
              <div key={section.id} className="bg-[#161616] border border-gray-700 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 border-b border-gray-600 pb-2">
                  {section.name}
                </h3>
                
                <div className="space-y-4">
                  {section.questions.map((question) => (
                    <div key={question.id} className="p-3 sm:p-4 bg-[#1C1C1C] rounded-lg">
                      <p className="font-medium text-sm sm:text-base mb-3">
                        {question.number}. {question.text}
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
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