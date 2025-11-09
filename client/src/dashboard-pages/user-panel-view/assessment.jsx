/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';

const Assessment = () => {
  const [forms, setForms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);
  const [editingForm, setEditingForm] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [sections, setSections] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // Sample initial data based on your image
  const initialForms = [
    {
      id: 1,
      title: "Consultation Protocol - Prospects",
      active: true,
      sections: [
        {
          id: 1,
          name: "Questions before trial training",
          questions: [
            { id: 1, text: "How did you hear about us?", type: "text" },
            { id: 2, text: "Are you ready for your EMS training today?", type: "yesno" },
            { id: 3, text: "Are you 'sport healthy'?", type: "yesno" },
            { id: 4, text: "What goals are you pursuing?", type: "text" }
          ]
        },
        {
          id: 2,
          name: "Contraindications: Checklist for...",
          questions: [
            { id: 5, text: "Arteriosclerosis, arterial circulation disorders", type: "yesno" },
            { id: 6, text: "Abdominal wall and inguinal hernias", type: "yesno" },
            { id: 7, text: "Cancer diseases", type: "yesno" },
            { id: 8, text: "Stents and bypasses that have been active for less than 6 months", type: "yesno" },
            { id: 9, text: "Acute influence of alcohol, drugs, intoxicants", type: "yesno" },
            { id: 10, text: "Neuronal diseases, epilepsy, severe sensitivity disorders", type: "yesno" },
            { id: 11, text: "Pregnancy", type: "yesno" },
            { id: 12, text: "Heart rhythm disorders", type: "yesno" }
          ]
        },
        {
          id: 3,
          name: "Conditional Contraindications: Check...",
          questions: [
            { id: 13, text: "Acute back problems without diagnosis, implants older than 6 months", type: "yesno" },
            { id: 14, text: "Motion sickness", type: "yesno" },
            { id: 15, text: "Diseases of internal organs, particularly kidney diseases", type: "yesno" },
            { id: 16, text: "Cardiovascular diseases", type: "yesno" },
            { id: 17, text: "Major fluid accumulations in the body, edema", type: "yesno" },
            { id: 18, text: "Open skin injuries, wounds, eczema, burns", type: "yesno" },
            { id: 19, text: "Taking painkillers or similar medications", type: "yesno" }
          ]
        }
      ]
    }
  ];

  // Initialize with sample data if empty
  useEffect(() => {
    if (forms.length === 0) {
      setForms(initialForms);
    }
  }, [forms.length]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleCreateForm = () => {
    setEditingForm(null);
    setFormTitle('');
    setSections([]);
    setShowModal(true);
  };

  const handleEditForm = (form) => {
    setEditingForm(form);
    setFormTitle(form.title);
    setSections([...form.sections]);
    setShowModal(true);
    setDropdownOpen(null);
  };

  const handleSaveForm = () => {
    if (!formTitle.trim()) return;

    const newForm = {
      id: editingForm ? editingForm.id : Date.now(),
      title: formTitle,
      active: editingForm ? editingForm.active : true,
      sections: sections
    };

    if (editingForm) {
      setForms(forms.map(f => f.id === editingForm.id ? newForm : f));
    } else {
      setForms([...forms, newForm]);
    }

    setShowModal(false);
  };

  const handleDeleteClick = (form) => {
    setFormToDelete(form);
    setShowDeleteModal(true);
    setDropdownOpen(null);
  };

  const handleDeleteConfirm = () => {
    if (formToDelete) {
      setForms(forms.filter(f => f.id !== formToDelete.id));
      setShowDeleteModal(false);
      setFormToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setFormToDelete(null);
  };

  const toggleFormActive = (formId, e) => {
    if (e) e.stopPropagation();
    setForms(forms.map(f => 
      f.id === formId ? { ...f, active: !f.active } : f
    ));
  };

  const toggleDropdown = (formId, e) => {
    if (e) e.stopPropagation();
    setDropdownOpen(dropdownOpen === formId ? null : formId);
  };

  const addSection = () => {
    const newSection = {
      id: Date.now(),
      name: `Section ${sections.length + 1}`,
      questions: []
    };
    setSections([...sections, newSection]);
  };

  const updateSectionName = (sectionId, newName) => {
    setSections(sections.map(section =>
      section.id === sectionId ? { ...section, name: newName } : section
    ));
  };

  const deleteSection = (sectionId) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  const addQuestion = (sectionId) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            questions: [
              ...section.questions,
              {
                id: Date.now(),
                text: "New Question",
                type: "yesno"
              }
            ]
          }
        : section
    ));
  };

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

  const deleteQuestion = (sectionId, questionId) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            questions: section.questions.filter(q => q.id !== questionId)
          }
        : section
    ));
  };

  return (
    <div className="min-h-screen rounded-3xl bg-[#1C1C1C] text-white md:p-6 p-3">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Assessment</h1>
        </div>
        <button
          onClick={handleCreateForm}
          className="bg-blue-600 text-sm hover:bg-blue-700 gap-2 text-white px-4 md:px-6 py-3 rounded-lg font-medium transition-colors flex justify-center items-center"
        >
          <span><Plus size={20}/></span>
          <span className='hidden sm:inline'>Create Assessment</span>
        </button>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {forms.map((form) => (
          <div
            key={form.id}
            className="bg-[#161616] rounded-lg p-4 md:p-6 border border-gray-700 relative"
          >
            {/* Three dots dropdown */}
            <div className="absolute top-3 right-3 md:top-4 md:right-4">
              <button
                onClick={(e) => toggleDropdown(form.id, e)}
                className="text-gray-400 hover:text-white p-1 rounded transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen === form.id && (
                <div className="absolute right-0 top-8 bg-[#1C1C1C] border border-gray-600 rounded-lg shadow-lg py-2 z-10 min-w-[120px]">
                  <button
                    onClick={() => handleEditForm(form)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-[#161616] transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(form)}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#161616] hover:text-red-300 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-between items-start mb-3 pr-8">
              <h3 className="text-base md:text-lg font-semibold line-clamp-2">{form.title}</h3>
            </div>

            <div className="text-xs md:text-sm text-gray-400 mb-3">
              {form.sections.length} Sections • {form.sections.reduce((acc, section) => acc + section.questions.length, 0)} Questions
            </div>

            {/* Toggle switch for active/inactive */}
            <div className="flex items-center justify-between mt-3">
              <button
                onClick={(e) => toggleFormActive(form.id, e)}
                className={`relative inline-flex h-5 w-9 md:h-6 md:w-11 items-center rounded-full transition-colors ${
                  form.active ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 md:h-4 md:w-4 transform rounded-full bg-white transition-transform ${
                    form.active ? 'translate-x-4 md:translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  form.active
                    ? 'bg-green-900 text-green-300'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                {form.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}

        {forms.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400">
            No forms created yet. Click on "Create Assessment" to get started.
          </div>
        )}
      </div>

      {/* Create/Edit Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-2 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-[#1C1C1C] rounded-lg p-4 sm:p-6 w-full max-w-4xl my-4 border border-gray-700 max-h-[calc(100vh-3 rem)] overflow-y-auto">
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

            <div className="mb-4 sm:mb-6">
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
                {sections.map((section, sectionIndex) => (
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

                    {/* Questions */}
                    <div className="space-y-2 sm:space-y-3">
                      {section.questions.map((question) => (
                        <div
                          key={question.id}
                          className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-[#1C1C1C] rounded"
                        >
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
                              className="bg-[#161616] border border-gray-600 rounded px-2 py-2 text-white text-sm focus:outline-none focus:border-blue-500 flex-1 sm:flex-none"
                            >
                              <option value="yesno">Yes/No</option>
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

            {/* Action Buttons */}
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
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1C1C1C] rounded-lg p-6 w-full max-w-md border border-gray-700 mx-4">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Confirm Deletion</h2>
              <p className="text-gray-300 text-sm">
                Are you sure you want to delete the form "{formToDelete?.title}"? This action cannot be undone.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-gray-300 text-sm hover:text-white transition-colors border border-gray-600 rounded-lg w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-sm text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assessment;