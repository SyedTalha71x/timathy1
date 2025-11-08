/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
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
    <div className="min-h-screen rounded-3xl bg-[#1C1C1C] text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Assessment</h1>
        
        </div>
        <button
          onClick={handleCreateForm}
          className="bg-blue-600 text-sm hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <span>+</span>
          <span>Create Assessment</span>
        </button>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map((form) => (
          <div
            key={form.id}
            className="bg-[#161616] rounded-lg p-6 border border-gray-700 relative"
          >
            {/* Three dots dropdown */}
            <div className="absolute top-4 right-4">
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

            <div className="flex justify-between items-start mb-4 pr-8">
              <h3 className="text-lg font-semibold">{form.title}</h3>
            </div>

            <div className="text-sm text-gray-400 mb-4">
              {form.sections.length} Sections • {form.sections.reduce((acc, section) => acc + section.questions.length, 0)} Questions
            </div>

            {/* Toggle switch for active/inactive */}
            <div className="flex items-center justify-between mt-4">
            <button
                onClick={(e) => toggleFormActive(form.id, e)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  form.active ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    form.active ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
                <div></div>
                <div className="flex items-center ">
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

          
          </div>
        ))}

        {forms.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400">
            No forms created yet. Click on "Create Assessment" to get started.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1C1C1C] rounded-lg p-6 w-full max-w-4xl max-h-[90vh] custom-scrollbar overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {editingForm ? 'Edit Form' : 'Create New Form'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Form Title
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full bg-[#161616] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                placeholder="Enter a title..."
              />
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Sections</h3>
                <button
                  onClick={addSection}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  + Add Section
                </button>
              </div>

              <div className="space-y-4">
                {sections.map((section, sectionIndex) => (
                  <div
                    key={section.id}
                    className="bg-[#161616] border border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <input
                        type="text"
                        value={section.name}
                        onChange={(e) => updateSectionName(section.id, e.target.value)}
                        className="bg-transparent text-white font-medium flex-1 focus:outline-none focus:border-b border-gray-600"
                      />
                      <button
                        onClick={() => deleteSection(section.id)}
                        className="text-red-500 hover:text-red-400 ml-2"
                      >
                        Delete
                      </button>
                    </div>

                    {/* Questions */}
                    <div className="space-y-3">
                      {section.questions.map((question) => (
                        <div
                          key={question.id}
                          className="flex items-center space-x-3 p-2 bg-[#1C1C1C] rounded"
                        >
                          <input
                            type="text"
                            value={question.text}
                            onChange={(e) =>
                              updateQuestion(section.id, question.id, 'text', e.target.value)
                            }
                            className="flex-1 bg-[#161616] border border-gray-600 rounded px-3 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                          />
                          <select
                            value={question.type}
                            onChange={(e) =>
                              updateQuestion(section.id, question.id, 'type', e.target.value)
                            }
                            className="bg-[#161616] border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                          >
                            <option value="yesno">Yes/No</option>
                            <option value="multiple">Multiple Choice</option>
                            <option value="text">Text</option>
                          </select>
                          <button
                            onClick={() => deleteQuestion(section.id, question.id)}
                            className="text-red-500 hover:text-red-400 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => addQuestion(section.id)}
                      className="mt-3 text-blue-400 hover:text-blue-300 text-sm"
                    >
                      + Add Question
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-300 text-sm hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveForm}
                className="bg-blue-600 hover:bg-blue-700 text-sm text-white px-4 py-2 rounded-lg transition-colors"
              >
                {editingForm ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1C1C1C] rounded-lg p-6 w-full max-w-md border border-gray-700">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Confirm Deletion</h2>
              <p className="text-gray-300 text-sm">
                Are you sure you want to delete the form "{formToDelete?.title}"? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-gray-300 text-sm hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-sm text-white px-4 py-2 rounded-lg transition-colors"
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