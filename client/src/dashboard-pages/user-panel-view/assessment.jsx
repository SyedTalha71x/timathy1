/* eslint-disable react/no-unescaped-entities */
import { Plus, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import CreateFormModal from '../../components/user-panel-components/assessment-components/CreateFormModal';
import PreviewModal from '../../components/user-panel-components/assessment-components/PreviewModal';
import DeleteModal from '../../components/user-panel-components/assessment-components/DeleteModal';


const Assessment = () => {
  // State for all forms
  const [forms, setForms] = useState([]);
  
  // Modal visibility states
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  
  // Form editing states
  const [editingForm, setEditingForm] = useState(null);
  const [formToDelete, setFormToDelete] = useState(null);
  const [previewForm, setPreviewForm] = useState(null);
  
  // Current form states
  const [formTitle, setFormTitle] = useState('');
  const [sections, setSections] = useState([]);
  
  // UI states
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // Sample initial data
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

  // Add numbering to questions
  const addNumberingToQuestions = (formsData) => {
    return formsData.map(form => ({
      ...form,
      sections: form.sections.map(section => ({
        ...section,
        questions: section.questions.map((question, index) => ({
          ...question,
          number: question.number || index + 1
        }))
      }))
    }));
  };

  // Initialize with sample data if empty
  useEffect(() => {
    if (forms.length === 0) {
      const formsWithNumbering = addNumberingToQuestions(initialForms);
      setForms(formsWithNumbering);
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

  // Form creation handler
  const handleCreateForm = () => {
    setEditingForm(null);
    setFormTitle('');
    setSections([]);
    setShowModal(true);
  };

  // Form editing handler
  const handleEditForm = (form) => {
    setEditingForm(form);
    setFormTitle(form.title);
    const sectionsWithNumbering = form.sections.map(section => ({
      ...section,
      questions: section.questions.map((question, index) => ({
        ...question,
        number: question.number || index + 1
      }))
    }));
    setSections(sectionsWithNumbering);
    setShowModal(true);
    setDropdownOpen(null);
  };

  // Form preview handler
  const handlePreviewForm = (form) => {
    const formWithNumbering = {
      ...form,
      sections: form.sections.map(section => ({
        ...section,
        questions: section.questions.map((question, index) => ({
          ...question,
          number: question.number || index + 1
        }))
      }))
    };
    setPreviewForm(formWithNumbering);
    setShowPreviewModal(true);
    setDropdownOpen(null);
  };

  // Form save handler
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

  // Delete form handler
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

  // Toggle form active state
  const toggleFormActive = (formId, e) => {
    if (e) e.stopPropagation();
    setForms(forms.map(f => 
      f.id === formId ? { ...f, active: !f.active } : f
    ));
  };

  // Toggle dropdown menu
  const toggleDropdown = (formId, e) => {
    if (e) e.stopPropagation();
    setDropdownOpen(dropdownOpen === formId ? null : formId);
  };

  return (
    <div className="min-h-screen rounded-3xl bg-[#1C1C1C] text-white md:p-6 p-3">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Medical History</h1>
        </div>
        <button
          onClick={handleCreateForm}
          className="bg-blue-600 text-sm hover:bg-blue-700 gap-2 text-white px-4 md:px-6 py-3 rounded-lg font-medium transition-colors flex justify-center items-center"
        >
          <span><Plus size={20}/></span>
          <span className='hidden sm:inline'>Create Medical History</span>
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

              {dropdownOpen === form.id && (
                <div className="absolute right-0 top-8 bg-[#1C1C1C] border border-gray-600 rounded-lg shadow-lg py-2 z-10 min-w-[120px]">
                  <button
                    onClick={() => handleEditForm(form)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-[#161616] transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handlePreviewForm(form)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-[#161616] transition-colors flex items-center gap-2"
                  >
                    View
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

            {/* Eye icon for quick preview */}
            <button
              onClick={() => handlePreviewForm(form)}
              className="absolute top-3 right-10 md:top-4 md:right-12 text-gray-400 hover:text-white p-1 rounded transition-colors"
              title="Preview Form"
            >
              <Eye size={18} />
            </button>

            <div className="flex justify-between items-start mb-3 pr-16">
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

      {/* Modal Components */}
      <CreateFormModal
        showModal={showModal}
        setShowModal={setShowModal}
        editingForm={editingForm}
        formTitle={formTitle}
        setFormTitle={setFormTitle}
        sections={sections}
        setSections={setSections}
        handleSaveForm={handleSaveForm}
      />

      <PreviewModal
        showPreviewModal={showPreviewModal}
        setShowPreviewModal={setShowPreviewModal}
        previewForm={previewForm}
      />

      <DeleteModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        formToDelete={formToDelete}
        handleDeleteConfirm={handleDeleteConfirm}
        handleDeleteCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default Assessment;