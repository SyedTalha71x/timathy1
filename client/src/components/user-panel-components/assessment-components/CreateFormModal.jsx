/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';

const CreateFormModal = ({ 
  showModal, 
  setShowModal, 
  editingForm, 
  formTitle, 
  setFormTitle, 
  sections, 
  setSections, 
  handleSaveForm 
}) => {
  // Function to add a new section
  const addSection = () => {
    const newSection = {
      id: Date.now(),
      name: `Section ${sections.length + 1}`,
      questions: []
    };
    setSections([...sections, newSection]);
  };

  // Function to update section name
  const updateSectionName = (sectionId, newName) => {
    setSections(sections.map(section =>
      section.id === sectionId ? { ...section, name: newName } : section
    ));
  };

  // Function to delete a section
  const deleteSection = (sectionId) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  // Function to add a question to a section
  const addQuestion = (sectionId) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const questionNumber = section.questions.length + 1;
        return {
          ...section,
          questions: [
            ...section.questions,
            {
              id: Date.now(),
              text: "",
              type: "yesno",
              number: questionNumber
            }
          ]
        };
      }
      return section;
    }));
  };

  // Function to update a question
  const updateQuestion = (sectionId, questionId, field, value) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            questions: section.questions.map(question =>
              question.id === questionId
                ? { ...question, [field]: value }
                : question
            )
          }
        : section
    ));
  };

  // Function to delete a question
  const deleteQuestion = (sectionId, questionId) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const updatedQuestions = section.questions.filter(q => q.id !== questionId);
        const renumberedQuestions = updatedQuestions.map((q, index) => ({
          ...q,
          number: index + 1
        }));
        return {
          ...section,
          questions: renumberedQuestions
        };
      }
      return section;
    }));
  };

  // Function to add multiple choice option
  const addMultipleChoiceOption = (sectionId, questionId) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            questions: section.questions.map(question =>
              question.id === questionId
                ? {
                    ...question,
                    options: [
                      ...(question.options || []),
                      { id: Date.now(), text: "" }
                    ]
                  }
                : question
            )
          }
        : section
    ));
  };

  // Function to update multiple choice option
  const updateMultipleChoiceOption = (sectionId, questionId, optionId, value) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            questions: section.questions.map(question =>
              question.id === questionId
                ? {
                    ...question,
                    options: question.options?.map(option =>
                      option.id === optionId
                        ? { ...option, text: value }
                        : option
                    ) || []
                  }
                : question
            )
          }
        : section
    ));
  };

  // Function to delete multiple choice option
  const deleteMultipleChoiceOption = (sectionId, questionId, optionId) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            questions: section.questions.map(question =>
              question.id === questionId
                ? {
                    ...question,
                    options: question.options?.filter(opt => opt.id !== optionId) || []
                  }
                : question
            )
          }
        : section
    ));
  };

  // Render question editor based on type
  const renderQuestionEditor = (sectionId, question) => {
    switch (question.type) {
      case 'multiple':
        return (
          <div className="mt-2 space-y-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Multiple Choice Options:
            </label>
            {question.options?.map((option, index) => (
              <div key={option.id} className="flex items-center gap-2">
                <span className="text-gray-400 text-sm w-4">
                  {String.fromCharCode(97 + index)}).
                </span>
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => updateMultipleChoiceOption(sectionId, question.id, option.id, e.target.value)}
                  className="flex-1 bg-[#161616] border border-gray-600 rounded px-3 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder={`Option ${index + 1}`}
                />
                <button
                  onClick={() => deleteMultipleChoiceOption(sectionId, question.id, option.id)}
                  className="text-red-500 hover:text-red-400 text-sm px-2 py-1"
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              onClick={() => addMultipleChoiceOption(sectionId, question.id)}
              className="text-blue-400 hover:text-blue-300 text-sm mt-1"
            >
              + Add Option
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-lg p-4 sm:p-6 w-full max-w-6xl my-4 border border-gray-700 max-h-[calc(100vh-3rem)] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold">
            {editingForm ? 'Edit Form' : 'Create New Form'}
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 sm:mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Form Title
          </label>
          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="w-full bg-[#161616] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm sm:text-base"
            placeholder="Enter a title..."
          />
        </div>

        <div className="mb-4 sm:mb-6 overflow-y-auto max-h-[60vh] custom-scrollbar pr-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 gap-2">
            <h3 className="text-base sm:text-lg font-semibold">Sections</h3>
            <button
              onClick={addSection}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors w-full sm:w-auto"
            >
              + Add Section
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {sections.map((section) => (
              <div
                key={section.id}
                className="bg-[#161616] border border-gray-700 rounded-lg p-3 sm:p-4"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
                  <input
                    type="text"
                    value={section.name}
                    onChange={(e) => updateSectionName(section.id, e.target.value)}
                    className="bg-transparent text-white font-medium flex-1 focus:outline-none focus:border-b border-gray-600 text-sm sm:text-base w-full"
                  />
                  <button
                    onClick={() => deleteSection(section.id)}
                    className="text-red-500 hover:text-red-400 text-sm w-full sm:w-auto sm:ml-2"
                  >
                    Delete Section
                  </button>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {section.questions.map((question) => (
                    <div
                      key={question.id}
                      className="flex flex-col gap-2 sm:gap-3 p-2 sm:p-3 bg-[#1C1C1C] rounded"
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <span className="text-gray-400 text-sm mt-2 flex-shrink-0">
                          {question.number}.
                        </span>
                        <input
                          type="text"
                          value={question.text}
                          onChange={(e) =>
                            updateQuestion(section.id, question.id, 'text', e.target.value)
                          }
                          className="flex-1 bg-[#161616] border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 w-full"
                          placeholder="Question text..."
                        />
                        <div className="flex gap-2 w-full sm:w-auto">
                          <select
                            value={question.type}
                            onChange={(e) =>
                              updateQuestion(section.id, question.id, 'type', e.target.value)
                            }
                            className="bg-[#161616] border border-gray-600 rounded px-2 py-2 text-white text-sm focus:outline-none focus:border-blue-500 flex-1 sm:flex-none min-w-[140px]"
                          >
                            <option value="yesno">Yes/No</option>
                            <option value="yesnodontknow">Yes/No/Don't know</option>
                            <option value="multiple">Multiple Choice</option>
                            <option value="text">Text</option>
                          </select>
                          <button
                            onClick={() => deleteQuestion(section.id, question.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors w-20 sm:w-auto"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      {renderQuestionEditor(section.id, question)}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => addQuestion(section.id)}
                  className="mt-3 text-blue-400 hover:text-blue-300 text-sm w-full sm:w-auto text-center block"
                >
                  + Add Question to this Section
                </button>
              </div>
            ))}
          </div>

          {sections.length === 0 && (
            <div className="text-center py-6 text-gray-400 text-sm">
              No sections added yet. Click "Add Section" to get started.
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 sm:space-x-3">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-3 text-gray-300 text-sm hover:text-white transition-colors border border-gray-600 rounded-lg w-full sm:w-auto order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveForm}
            className="bg-blue-600 hover:bg-blue-700 text-sm text-white px-4 py-3 rounded-lg transition-colors w-full sm:w-auto order-1 sm:order-2"
            disabled={!formTitle.trim()}
          >
            {editingForm ? 'Save Changes' : 'Create Form'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFormModal;