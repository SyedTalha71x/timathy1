/* eslint-disable react/no-unescaped-entities */
import { Plus, Eye, Search, ArrowUpDown, ArrowUp, ArrowDown, GripVertical, Edit, Copy, Trash2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CreateFormModal from '../../components/user-panel-components/medical-history-components/CreateFormModal';
import PreviewModal from '../../components/user-panel-components/medical-history-components/PreviewModal';
import DeleteModal from '../../components/user-panel-components/medical-history-components/DeleteModal';

// Sidebar imports
import toast, { Toaster } from "react-hot-toast";
import { useSidebarSystem } from "../../hooks/useSidebarSystem";
import Sidebar from "../../components/central-sidebar";
import NotifyMemberModal from "../../components/myarea-components/NotifyMemberModal";
import { WidgetSelectionModal } from "../../components/widget-selection-modal";
import EditTaskModal from "../../components/user-panel-components/task-components/edit-task-modal";
import AppointmentActionModalV2 from "../../components/myarea-components/AppointmentActionModal";
import EditAppointmentModalV2 from "../../components/myarea-components/EditAppointmentModal";
import TrainingPlansModal from "../../components/myarea-components/TrainingPlanModal";

// Sortable Form Card Component
const SortableFormCard = ({ form, children, isDragDisabled }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: form.id,
    disabled: isDragDisabled 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {!isDragDisabled && (
        <div 
          {...attributes} 
          {...listeners}
          className="absolute top-3 left-3 md:top-4 md:left-4 cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300 p-1 rounded transition-colors z-10"
        >
          <GripVertical size={16} />
        </div>
      )}
      {children}
    </div>
  );
};


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
  const [signatureSettings, setSignatureSettings] = useState({
    showDate: true,
    showLocation: true,
    defaultLocation: ''
  });
  
  // UI states
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'name', 'questions', 'sections', 'custom'
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc', 'desc'
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortDropdownRef = useRef(null);

  // Sidebar system hook
  const sidebarSystem = useSidebarSystem();
  const {
    isRightSidebarOpen,
    isSidebarEditing,
    isRightWidgetModalOpen,
    openDropdownIndex,
    selectedMemberType,
    isChartDropdownOpen,
    isWidgetModalOpen,
    editingTask,
    todoFilter,
    isEditTaskModalOpen,
    isTodoFilterDropdownOpen,
    taskToCancel,
    taskToDelete,
    activeNoteId,
    isSpecialNoteModalOpen,
    selectedAppointmentForNote,
    isTrainingPlanModalOpen,
    selectedUserForTrainingPlan,
    selectedAppointment,
    isEditAppointmentModalOpen,
    showAppointmentOptionsModal,
    freeAppointments,
    isNotifyMemberOpen,
    notifyAction,
    rightSidebarWidgets,
    setIsRightWidgetModalOpen,
    setSelectedMemberType,
    setIsChartDropdownOpen,
    setIsWidgetModalOpen,
    setEditingTask,
    setTodoFilter,
    setIsEditTaskModalOpen,
    setIsTodoFilterDropdownOpen,
    setTaskToCancel,
    setTaskToDelete,
    setActiveNoteId,
    setIsSpecialNoteModalOpen,
    setSelectedAppointmentForNote,
    setIsTrainingPlanModalOpen,
    setSelectedUserForTrainingPlan,
    setSelectedAppointment,
    setIsEditAppointmentModalOpen,
    setShowAppointmentOptionsModal,
    setIsNotifyMemberOpen,
    setNotifyAction,
    toggleRightSidebar,
    closeSidebar,
    toggleSidebarEditing,
    toggleDropdown: toggleSidebarDropdown,
    redirectToCommunication,
    moveRightSidebarWidget,
    removeRightSidebarWidget,
    getWidgetPlacementStatus,
    handleAddRightSidebarWidget,
    handleTaskComplete,
    handleEditTask,
    handleUpdateTask,
    handleCancelTask,
    handleDeleteTask,
    isBirthdayToday,
    handleSendBirthdayMessage,
    handleEditNote,
    handleDumbbellClick,
    handleCheckIn,
    handleAppointmentOptionsModal,
    handleSaveSpecialNote,
    isEventInPast,
    handleCancelAppointment,
    actuallyHandleCancelAppointment,
    handleDeleteAppointment,
    handleViewMemberDetails,
    handleNotifyMember,
    truncateUrl,
    renderSpecialNoteIcon,
    customLinks,
    communications,
    todos,
    setTodos,
    expiringContracts,
    birthdays,
    notifications,
    appointments,
    setAppointments,
    memberTypes,
    todoFilterOptions,
    appointmentTypes,
    handleAssignTrainingPlan,
    handleRemoveTrainingPlan,
    memberTrainingPlans,
    availableTrainingPlans,
  } = sidebarSystem;

  // Wrapper functions for sidebar
  const handleTaskCompleteWrapper = (taskId) => handleTaskComplete(taskId, todos, setTodos);
  const handleUpdateTaskWrapper = (updatedTask) => handleUpdateTask(updatedTask, setTodos);
  const handleCancelTaskWrapper = (taskId) => handleCancelTask(taskId, setTodos);
  const handleDeleteTaskWrapper = (taskId) => handleDeleteTask(taskId, setTodos);
  const handleEditNoteWrapper = (appointmentId, currentNote) => handleEditNote(appointmentId, currentNote, appointments);
  const handleCheckInWrapper = (appointmentId) => handleCheckIn(appointmentId, appointments, setAppointments);
  const handleSaveSpecialNoteWrapper = (appointmentId, updatedNote) => handleSaveSpecialNote(appointmentId, updatedNote, setAppointments);
  const actuallyHandleCancelAppointmentWrapper = (shouldNotify) => actuallyHandleCancelAppointment(shouldNotify, appointments, setAppointments);
  const handleDeleteAppointmentWrapper = (id) => handleDeleteAppointment(id, appointments, setAppointments);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sample initial data
  const initialForms = [
    {
      id: 1,
      title: "Consultation Protocol - Prospects",
      active: true,
      createdAt: Date.now() - 86400000,
      signatureSettings: {
        showDate: true,
        showLocation: true,
        defaultLocation: ''
      },
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
        questions: section.questions?.map((question, index) => ({
          ...question,
          number: question.number || index + 1
        })) || []
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
    const handleClickOutside = (event) => {
      setDropdownOpen(null);
      // Close sort dropdown if clicking outside
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Form creation handler
  const handleCreateForm = () => {
    setEditingForm(null);
    setFormTitle('');
    setSections([]);
    setSignatureSettings({
      showDate: true,
      showLocation: true,
      defaultLocation: ''
    });
    setShowModal(true);
  };

  // Form editing handler
  const handleEditForm = (form) => {
    setEditingForm(form);
    setFormTitle(form.title);
    const sectionsWithNumbering = form.sections.map(section => ({
      ...section,
      items: section.items || section.questions?.map(q => ({ ...q, itemType: 'question' })) || []
    }));
    setSections(sectionsWithNumbering);
    setSignatureSettings(form.signatureSettings || {
      showDate: true,
      showLocation: true,
      defaultLocation: ''
    });
    setShowModal(true);
    setDropdownOpen(null);
  };

  // Form preview handler
  const handlePreviewForm = (form) => {
    const formWithNumbering = {
      ...form,
      sections: form.sections.map(section => ({
        ...section,
        items: section.items || section.questions?.map((q, index) => ({ ...q, itemType: 'question', number: index + 1 })) || []
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
      createdAt: editingForm ? editingForm.createdAt : Date.now(),
      signatureSettings: signatureSettings,
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

  // Duplicate form handler
  const handleDuplicateForm = (form) => {
    const duplicatedForm = {
      ...form,
      id: Date.now(),
      title: `${form.title} (Copy)`,
      createdAt: Date.now(),
      sections: form.sections.map(section => ({
        ...section,
        id: Date.now() + Math.random() * 1000,
        items: (section.items || section.questions || []).map(item => ({
          ...item,
          id: Date.now() + Math.random() * 1000
        }))
      }))
    };
    setForms([...forms, duplicatedForm]);
    setDropdownOpen(null);
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

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // Handle drag end for reordering
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      // If currently sorted by something other than custom, 
      // we need to first apply that sort order to the forms array
      if (sortBy !== 'custom') {
        // Get the currently displayed order (filtered and sorted)
        const currentOrder = getFilteredAndSortedForms();
        
        // Find indices in the current displayed order
        const oldIndex = currentOrder.findIndex((item) => item.id === active.id);
        const newIndex = currentOrder.findIndex((item) => item.id === over.id);
        
        // Create new order based on displayed order with the drag applied
        const newOrder = arrayMove(currentOrder, oldIndex, newIndex);
        
        // Update forms to match this new order (keeping any filtered-out items at the end)
        const filteredOutForms = forms.filter(f => !currentOrder.find(cf => cf.id === f.id));
        setForms([...newOrder, ...filteredOutForms]);
        setSortBy('custom');
      } else {
        setForms((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }
  };

  // Sort options
  const sortOptions = [
    { value: 'date', label: 'Creation Date' },
    { value: 'name', label: 'Name' },
    { value: 'questions', label: 'Questions' },
    { value: 'sections', label: 'Sections' },
    { value: 'custom', label: 'Custom Order' }
  ];

  // Handle sort option click
  const handleSortOptionClick = (newSortBy) => {
    if (newSortBy === 'custom') {
      setSortBy('custom');
      setShowSortDropdown(false);
    } else if (sortBy === newSortBy) {
      // If same option clicked, toggle direction
      toggleSortDirection();
    } else {
      setSortBy(newSortBy);
      setSortDirection('desc'); // Default to descending for new sort
    }
  };

  // Get current sort label
  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Creation Date';

  // Get sort icon based on current state
  const getSortIcon = () => {
    if (sortBy === 'custom') {
      return <ArrowUpDown size={14} className="text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp size={14} className="text-white" />
      : <ArrowDown size={14} className="text-white" />;
  };

  // Filter and sort forms
  const getFilteredAndSortedForms = () => {
    let filtered = forms.filter(form => {
      // Filter by search query
      const matchesSearch = form.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by status
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'active' && form.active) ||
                           (filterStatus === 'inactive' && !form.active);
      
      return matchesSearch && matchesStatus;
    });

    // Helper function to count questions (including variable fields)
    const getQuestionCount = (form) => {
      return form.sections.reduce((acc, section) => {
        const items = section.items || section.questions || [];
        const questionCount = items.filter(item => !item.itemType || item.itemType === 'question' || item.itemType === 'variableField').length;
        return acc + questionCount;
      }, 0);
    };

    // Only sort if not in custom order mode
    if (sortBy !== 'custom') {
      filtered.sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'date':
            comparison = (a.createdAt || 0) - (b.createdAt || 0);
            break;
          case 'name':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'questions':
            comparison = getQuestionCount(a) - getQuestionCount(b);
            break;
          case 'sections':
            comparison = (a.sections?.length || 0) - (b.sections?.length || 0);
            break;
          default:
            comparison = 0;
        }
        
        // Apply sort direction
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  };

  const filteredForms = getFilteredAndSortedForms();
  const formIds = filteredForms.map(form => form.id);
  const isDragDisabled = searchQuery !== '' || filterStatus !== 'all';

  // Format date helper
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <div className={`min-h-screen rounded-3xl bg-[#1C1C1C] text-white md:p-6 p-3 transition-all duration-500 ease-in-out flex-1 ${isRightSidebarOpen ? 'lg:mr-86 mr-0' : 'mr-0'}`}>
        {/* Header */}
        <div className="flex sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-white oxanium_font text-xl md:text-2xl">Medical History</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateForm}
              className="bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm text-white px-3 sm:px-4 py-2 rounded-xl flex items-center gap-2 justify-center transition-colors"
            >
              <Plus size={14} className="sm:w-4 sm:h-4" />
              <span className='hidden sm:inline'>Create Medical History</span>
            </button>

            {isRightSidebarOpen ? (
              <div onClick={toggleRightSidebar}>
                <img src='/expand-sidebar mirrored.svg' className="h-5 w-5 cursor-pointer" alt="" />
              </div>
            ) : (
              <div onClick={toggleRightSidebar}>
                <img src="/icon.svg" className="h-5 w-5 cursor-pointer" alt="" />
              </div>
            )}
          </div>
        </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search forms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-9 sm:pl-10 border border-[#333333] focus:border-[#3F74FF] transition-colors"
          />
        </div>
      </div>

      {/* Category Pills for Filters */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${
            filterStatus === 'all'
              ? "bg-blue-600 text-white"
              : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterStatus('active')}
          className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${
            filterStatus === 'active'
              ? "bg-blue-600 text-white"
              : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilterStatus('inactive')}
          className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${
            filterStatus === 'inactive'
              ? "bg-blue-600 text-white"
              : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
          }`}
        >
          Inactive
        </button>
        
        {/* Sort Controls */}
        <div className="ml-auto relative" ref={sortDropdownRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSortDropdown(!showSortDropdown);
            }}
            className="px-3 sm:px-4 py-2 bg-[#2F2F2F] text-gray-300 rounded-xl text-xs sm:text-sm hover:bg-[#3F3F3F] transition-colors flex items-center gap-2"
          >
            {getSortIcon()}
            <span>{currentSortLabel}</span>
          </button>

          {/* Sort Dropdown */}
          {showSortDropdown && (
            <div className="absolute top-full right-0 mt-1 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-lg z-50 min-w-[180px]">
              <div className="py-1">
                <div className="px-3 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-700">
                  Sort by
                </div>
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSortOptionClick(option.value);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition-colors flex items-center justify-between ${
                      sortBy === option.value 
                        ? 'text-white bg-gray-800/50' 
                        : 'text-gray-300'
                    }`}
                  >
                    <span>{option.label}</span>
                    {sortBy === option.value && option.value !== 'custom' && (
                      <span className="text-gray-400">
                        {sortDirection === 'asc' 
                          ? <ArrowUp size={14} /> 
                          : <ArrowDown size={14} />
                        }
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Forms Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={formIds} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredForms.map((form) => (
              <SortableFormCard key={form.id} form={form} isDragDisabled={isDragDisabled}>
                <div
                  className={`bg-[#161616] rounded-lg p-4 md:p-6 border border-gray-700 relative ${!isDragDisabled ? 'pl-10 md:pl-12' : ''}`}
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
                      <div className="absolute right-0 top-8 bg-[#1C1C1C] border border-gray-700 rounded-lg shadow-lg py-1 z-10 min-w-[140px]">
                        <button
                          onClick={() => handleEditForm(form)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2 transition-colors"
                        >
                          <Edit size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDuplicateForm(form)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 text-sm flex items-center gap-2 transition-colors"
                        >
                          <Copy size={14} /> Duplicate
                        </button>
                        <button
                          onClick={() => handleDeleteClick(form)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-800 text-red-500 text-sm flex items-center gap-2 transition-colors"
                        >
                          <Trash2 size={14} /> Delete
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
                    <h3 className="text-base md:text-lg font-semibold line-clamp-2" title={form.title}>{form.title}</h3>
                  </div>

                  <div className="text-xs md:text-sm text-gray-400 mb-2">
                    {form.sections.length} Sections • {form.sections.reduce((acc, section) => {
                      const items = section.items || section.questions || [];
                      const questionCount = items.filter(item => !item.itemType || item.itemType === 'question' || item.itemType === 'variableField').length;
                      return acc + questionCount;
                    }, 0)} Questions
                  </div>

                  {/* Created Date */}
                  <div className="text-xs text-gray-500 mb-4">
                    Created: {formatDate(form.createdAt)}
                  </div>

                  {/* Toggle switch for active/inactive - bulletin board style */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Status:</span>
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
                      <span className="text-xs font-medium text-gray-300 min-w-[50px]">
                        {form.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </SortableFormCard>
            ))}

            {filteredForms.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400">
                {forms.length === 0 ? (
                  <>No forms created yet. Click on "Create Medical History" to get started.</>
                ) : (
                  <>No forms match your search criteria. Try adjusting your filters.</>
                )}
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {/* Modal Components */}
      <CreateFormModal
        showModal={showModal}
        setShowModal={setShowModal}
        editingForm={editingForm}
        formTitle={formTitle}
        setFormTitle={setFormTitle}
        sections={sections}
        setSections={setSections}
        signatureSettings={signatureSettings}
        setSignatureSettings={setSignatureSettings}
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

    {/* Sidebar */}
    <Sidebar
      isRightSidebarOpen={isRightSidebarOpen}
      toggleRightSidebar={toggleRightSidebar}
      isSidebarEditing={isSidebarEditing}
      toggleSidebarEditing={toggleSidebarEditing}
      rightSidebarWidgets={rightSidebarWidgets}
      moveRightSidebarWidget={moveRightSidebarWidget}
      removeRightSidebarWidget={removeRightSidebarWidget}
      setIsRightWidgetModalOpen={setIsRightWidgetModalOpen}
      communications={communications}
      redirectToCommunication={redirectToCommunication}
      todos={todos}
      handleTaskComplete={handleTaskCompleteWrapper}
      todoFilter={todoFilter}
      setTodoFilter={setTodoFilter}
      todoFilterOptions={todoFilterOptions}
      isTodoFilterDropdownOpen={isTodoFilterDropdownOpen}
      setIsTodoFilterDropdownOpen={setIsTodoFilterDropdownOpen}
      openDropdownIndex={openDropdownIndex}
      toggleDropdown={toggleSidebarDropdown}
      handleEditTask={handleEditTask}
      setTaskToCancel={setTaskToCancel}
      setTaskToDelete={setTaskToDelete}
      birthdays={birthdays}
      isBirthdayToday={isBirthdayToday}
      handleSendBirthdayMessage={handleSendBirthdayMessage}
      customLinks={customLinks}
      truncateUrl={truncateUrl}
      appointments={appointments}
      renderSpecialNoteIcon={renderSpecialNoteIcon}
      handleDumbbellClick={handleDumbbellClick}
      handleCheckIn={handleCheckInWrapper}
      handleAppointmentOptionsModal={handleAppointmentOptionsModal}
      selectedMemberType={selectedMemberType}
      setSelectedMemberType={setSelectedMemberType}
      memberTypes={memberTypes}
      isChartDropdownOpen={isChartDropdownOpen}
      setIsChartDropdownOpen={setIsChartDropdownOpen}
      expiringContracts={expiringContracts}
      getWidgetPlacementStatus={getWidgetPlacementStatus}
      onClose={toggleRightSidebar}
      hasUnreadNotifications={2}
      setIsWidgetModalOpen={setIsWidgetModalOpen}
      handleEditNote={handleEditNoteWrapper}
      activeNoteId={activeNoteId}
      setActiveNoteId={setActiveNoteId}
      isSpecialNoteModalOpen={isSpecialNoteModalOpen}
      setIsSpecialNoteModalOpen={setIsSpecialNoteModalOpen}
      selectedAppointmentForNote={selectedAppointmentForNote}
      setSelectedAppointmentForNote={setSelectedAppointmentForNote}
      handleSaveSpecialNote={handleSaveSpecialNoteWrapper}
      onSaveSpecialNote={handleSaveSpecialNoteWrapper}
      notifications={notifications}
      setTodos={setTodos}
    />

    {/* Sidebar Modals */}
    <TrainingPlansModal
      isOpen={isTrainingPlanModalOpen}
      onClose={() => {
        setIsTrainingPlanModalOpen(false);
        setSelectedUserForTrainingPlan(null);
      }}
      selectedMember={selectedUserForTrainingPlan}
      memberTrainingPlans={memberTrainingPlans[selectedUserForTrainingPlan?.id] || []}
      availableTrainingPlans={availableTrainingPlans}
      onAssignPlan={handleAssignTrainingPlan}
      onRemovePlan={handleRemoveTrainingPlan}
    />

    <AppointmentActionModalV2
      isOpen={showAppointmentOptionsModal}
      onClose={() => {
        setShowAppointmentOptionsModal(false);
        setSelectedAppointment(null);
      }}
      appointment={selectedAppointment}
      isEventInPast={isEventInPast}
      onEdit={() => {
        setShowAppointmentOptionsModal(false);
        setIsEditAppointmentModalOpen(true);
      }}
      onCancel={handleCancelAppointment}
      onViewMember={handleViewMemberDetails}
    />

    <NotifyMemberModal
      isOpen={isNotifyMemberOpen}
      onClose={() => setIsNotifyMemberOpen(false)}
      notifyAction={notifyAction}
      actuallyHandleCancelAppointment={actuallyHandleCancelAppointmentWrapper}
      handleNotifyMember={handleNotifyMember}
    />

    {isEditAppointmentModalOpen && selectedAppointment && (
      <EditAppointmentModalV2
        selectedAppointment={selectedAppointment}
        setSelectedAppointment={setSelectedAppointment}
        appointmentTypes={appointmentTypes}
        freeAppointments={freeAppointments}
        handleAppointmentChange={(changes) => {
          setSelectedAppointment({ ...selectedAppointment, ...changes });
        }}
        appointments={appointments}
        setAppointments={setAppointments}
        setIsNotifyMemberOpen={setIsNotifyMemberOpen}
        setNotifyAction={setNotifyAction}
        onDelete={handleDeleteAppointmentWrapper}
        onClose={() => {
          setIsEditAppointmentModalOpen(false);
          setSelectedAppointment(null);
        }}
      />
    )}

    <WidgetSelectionModal
      isOpen={isRightWidgetModalOpen}
      onClose={() => setIsRightWidgetModalOpen(false)}
      onSelectWidget={handleAddRightSidebarWidget}
      getWidgetStatus={(widgetType) => getWidgetPlacementStatus(widgetType, "sidebar")}
      widgetArea="sidebar"
    />

    {isRightSidebarOpen && (
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={closeSidebar}
      />
    )}

    {isEditTaskModalOpen && editingTask && (
      <EditTaskModal
        task={editingTask}
        onClose={() => {
          setIsEditTaskModalOpen(false);
          setEditingTask(null);
        }}
        onUpdateTask={handleUpdateTaskWrapper}
      />
    )}

    {taskToDelete && (
      <div className="fixed inset-0 text-white bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#181818] rounded-xl p-6 max-w-md mx-4">
          <h3 className="text-lg font-semibold mb-4">Delete Task</h3>
          <p className="text-gray-300 mb-6">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setTaskToDelete(null)}
              className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#2F2F2F]/90"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDeleteTaskWrapper(taskToDelete)}
              className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}

    {taskToCancel && (
      <div className="fixed inset-0 bg-black/50 text-white flex items-center justify-center z-50">
        <div className="bg-[#181818] rounded-xl p-6 max-w-md mx-4">
          <h3 className="text-lg font-semibold mb-4">Cancel Task</h3>
          <p className="text-gray-300 mb-6">Are you sure you want to cancel this task?</p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setTaskToCancel(null)}
              className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#2F2F2F]/90"
            >
              No
            </button>
            <button
              onClick={() => handleCancelTaskWrapper(taskToCancel)}
              className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700"
            >
              Cancel Task
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default Assessment;
