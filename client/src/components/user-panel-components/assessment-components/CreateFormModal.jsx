/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect, useRef } from 'react';
import { ArrowUp, ArrowDown, Trash2, Link, Pencil, ChevronDown, ChevronUp } from 'lucide-react';

const CreateFormModal = ({ 
  showModal, 
  setShowModal, 
  editingForm, 
  formTitle, 
  setFormTitle, 
  sections, 
  setSections,
  signatureSettings,
  setSignatureSettings,
  handleSaveForm 
}) => {
  const [showVariableDropdown, setShowVariableDropdown] = useState(null);
  const [deletingSectionId, setDeletingSectionId] = useState(null);
  const [showTitleOnly, setShowTitleOnly] = useState(!editingForm);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessages, setWarningMessages] = useState([]);
  const [isSignatureSettingsOpen, setIsSignatureSettingsOpen] = useState(false);
  const newSectionTitleRef = useRef(null);
  const titleInputRef = useRef(null);

  // Available variables with types for variable fields
  const availableVariables = [
    { value: 'firstName', label: 'First Name', type: 'text' },
    { value: 'lastName', label: 'Last Name', type: 'text' },
    { value: 'gender', label: 'Gender', type: 'select', options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'diverse', label: 'Diverse' }
    ]},
    { value: 'birthdate', label: 'Birthdate', type: 'date' },
    { value: 'email', label: 'Email', type: 'text' },
    { value: 'telephone', label: 'Telephone Number', type: 'text' },
    { value: 'mobile', label: 'Mobile Number', type: 'text' },
    { value: 'street', label: 'Street & Number', type: 'text' },
    { value: 'zipCode', label: 'ZIP Code', type: 'text' },
    { value: 'city', label: 'City', type: 'text' },
    { value: 'country', label: 'Country', type: 'text' },
    { value: 'source', label: 'Source', type: 'select', options: [
      { value: 'website', label: 'Website' },
      { value: 'social_media', label: 'Social Media' },
      { value: 'referral', label: 'Referral' },
      { value: 'advertisement', label: 'Advertisement' },
      { value: 'walk_in', label: 'Walk-in' },
      { value: 'other', label: 'Other' }
    ]}
  ];

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

  // Count total questions/variable fields across all sections
  const getTotalQuestionCount = () => {
    return sections.reduce((total, section) => {
      const questionCount = (section.items || []).filter(
        item => item.itemType === 'question' || item.itemType === 'variableField'
      ).length;
      return total + questionCount;
    }, 0);
  };

  // Validate form before saving
  const validateForm = () => {
    const warnings = [];
    
    // Check for empty sections (no items at all)
    const emptySections = sections.filter(section => !section.items || section.items.length === 0);
    if (emptySections.length > 0) {
      warnings.push(`${emptySections.length} section(s) have no content`);
    }
    
    // Check for items without content
    let emptyQuestions = 0;
    let emptyTextBlocks = 0;
    let variableFieldsNoText = 0;
    let variableFieldsNoVariable = 0;
    
    sections.forEach(section => {
      (section.items || []).forEach(item => {
        if (item.itemType === 'question' && !item.text?.trim()) {
          emptyQuestions++;
        } else if (item.itemType === 'textBlock' && !item.text?.trim()) {
          emptyTextBlocks++;
        } else if (item.itemType === 'variableField') {
          if (!item.text?.trim()) {
            variableFieldsNoText++;
          }
          if (!item.variable) {
            variableFieldsNoVariable++;
          }
        }
      });
    });
    
    if (emptyQuestions > 0) {
      warnings.push(`${emptyQuestions} question(s) have no text`);
    }
    if (emptyTextBlocks > 0) {
      warnings.push(`${emptyTextBlocks} text block(s) are empty`);
    }
    if (variableFieldsNoText > 0) {
      warnings.push(`${variableFieldsNoText} variable field(s) have no label text`);
    }
    if (variableFieldsNoVariable > 0) {
      warnings.push(`${variableFieldsNoVariable} variable field(s) have no variable selected`);
    }
    
    return warnings;
  };

  // Handle save with validation
  const handleSaveWithValidation = () => {
    const warnings = validateForm();
    
    if (warnings.length > 0) {
      setWarningMessages(warnings);
      setShowWarningModal(true);
    } else {
      handleSaveForm();
    }
  };

  // Confirm save despite warnings
  const confirmSaveAnyway = () => {
    setShowWarningModal(false);
    setWarningMessages([]);
    handleSaveForm();
  };

  // Reset show title only when modal opens
  useEffect(() => {
    if (showModal) {
      setShowTitleOnly(!editingForm);
    }
  }, [showModal, editingForm]);

  // Function to proceed from title to full form
  const proceedToFullForm = () => {
    if (formTitle.trim()) {
      setShowTitleOnly(false);
    }
  };

  // Function to add a new section
  const addSection = () => {
    const newSection = {
      id: Date.now(),
      name: `Section ${sections.length + 1}`,
      items: []
    };
    setSections([...sections, newSection]);
    
    setTimeout(() => {
      if (newSectionTitleRef.current) {
        newSectionTitleRef.current.focus();
        newSectionTitleRef.current.select();
      }
    }, 100);
  };

  // Function to update section name
  const updateSectionName = (sectionId, newName) => {
    setSections(sections.map(section =>
      section.id === sectionId ? { ...section, name: newName } : section
    ));
  };

  // Function to move section up
  const moveSectionUp = (index) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    setSections(newSections);
  };

  // Function to move section down
  const moveSectionDown = (index) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    setSections(newSections);
  };

  // Function to delete a section with confirmation
  const deleteSection = (sectionId) => {
    setDeletingSectionId(sectionId);
  };

  const confirmDeleteSection = () => {
    setSections(sections.filter(section => section.id !== deletingSectionId));
    setDeletingSectionId(null);
  };

  const cancelDeleteSection = () => {
    setDeletingSectionId(null);
  };

  // Function to add a question to a section
  const addQuestion = (sectionId) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const questionNumber = section.items.filter(item => item.itemType === 'question' || item.itemType === 'variableField').length + 1;
        return {
          ...section,
          items: [
            ...section.items,
            {
              id: Date.now(),
              itemType: 'question',
              text: "",
              type: "yesno",
              number: questionNumber,
              required: true
            }
          ]
        };
      }
      return section;
    }));
  };

  // Function to add a text block to a section
  const addTextBlock = (sectionId) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: [
            ...section.items,
            {
              id: Date.now(),
              itemType: 'textBlock',
              text: ""
            }
          ]
        };
      }
      return section;
    }));
  };

  // Function to add a variable field to a section
  const addVariableField = (sectionId) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const questionNumber = section.items.filter(item => item.itemType === 'question' || item.itemType === 'variableField').length + 1;
        return {
          ...section,
          items: [
            ...section.items,
            {
              id: Date.now(),
              itemType: 'variableField',
              text: "", // Question/label text
              number: questionNumber,
              variable: null,
              variableType: null,
              variableOptions: null,
              required: true
            }
          ]
        };
      }
      return section;
    }));
  };

  // Function to move item up within a section
  const moveItemUp = (sectionId, itemIndex) => {
    if (itemIndex === 0) return;
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const newItems = [...section.items];
        [newItems[itemIndex - 1], newItems[itemIndex]] = 
        [newItems[itemIndex], newItems[itemIndex - 1]];
        let questionNumber = 1;
        const renumberedItems = newItems.map(item => {
          if (item.itemType === 'question' || item.itemType === 'variableField') {
            return { ...item, number: questionNumber++ };
          }
          return item;
        });
        return { ...section, items: renumberedItems };
      }
      return section;
    }));
  };

  // Function to move item down within a section
  const moveItemDown = (sectionId, itemIndex) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        if (itemIndex === section.items.length - 1) return section;
        const newItems = [...section.items];
        [newItems[itemIndex], newItems[itemIndex + 1]] = 
        [newItems[itemIndex + 1], newItems[itemIndex]];
        let questionNumber = 1;
        const renumberedItems = newItems.map(item => {
          if (item.itemType === 'question' || item.itemType === 'variableField') {
            return { ...item, number: questionNumber++ };
          }
          return item;
        });
        return { ...section, items: renumberedItems };
      }
      return section;
    }));
  };

  // Function to update an item
  const updateItem = (sectionId, itemId, field, value) => {
    setSections(prevSections => prevSections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            items: section.items.map(item =>
              item.id === itemId
                ? { ...item, [field]: value }
                : item
            )
          }
        : section
    ));
  };

  // Function to select variable for a variable field
  const selectVariable = (sectionId, itemId, variableValue) => {
    const variableDef = availableVariables.find(v => v.value === variableValue);
    
    setSections(prevSections => prevSections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            items: section.items.map(item =>
              item.id === itemId
                ? { 
                    ...item, 
                    variable: variableValue, 
                    variableType: variableDef?.type || 'text',
                    variableOptions: variableDef?.options || null
                  }
                : item
            )
          }
        : section
    ));
    setShowVariableDropdown(null);
  };

  // Function to delete an item
  const deleteItem = (sectionId, itemId) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const updatedItems = section.items.filter(item => item.id !== itemId);
        let questionNumber = 1;
        const renumberedItems = updatedItems.map(item => {
          if (item.itemType === 'question' || item.itemType === 'variableField') {
            return { ...item, number: questionNumber++ };
          }
          return item;
        });
        return {
          ...section,
          items: renumberedItems
        };
      }
      return section;
    }));
  };

  // Function to add multiple choice option
  const addMultipleChoiceOption = (sectionId, itemId) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            items: section.items.map(item =>
              item.id === itemId
                ? {
                    ...item,
                    options: [
                      ...(item.options || []),
                      { id: Date.now(), text: "" }
                    ]
                  }
                : item
            )
          }
        : section
    ));
  };

  // Function to update multiple choice option
  const updateMultipleChoiceOption = (sectionId, itemId, optionId, value) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            items: section.items.map(item =>
              item.id === itemId
                ? {
                    ...item,
                    options: item.options?.map(option =>
                      option.id === optionId
                        ? { ...option, text: value }
                        : option
                    ) || []
                  }
                : item
            )
          }
        : section
    ));
  };

  // Function to delete multiple choice option
  const deleteMultipleChoiceOption = (sectionId, itemId, optionId) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            items: section.items.map(item =>
              item.id === itemId
                ? {
                    ...item,
                    options: item.options?.filter(opt => opt.id !== optionId) || []
                  }
                : item
            )
          }
        : section
    ));
  };

  // Render question editor (only for question types)
  const renderQuestionEditor = (sectionId, item) => {
    if (item.itemType !== 'question') return null;

    if (item.type === 'multiple') {
      return (
        <div className="mt-2 space-y-1">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Multiple Choice Options:
          </label>
          {item.options?.map((option, index) => (
            <div key={option.id} className="flex items-center gap-2">
              <span className="text-gray-400 text-sm w-4 flex-shrink-0">
                {String.fromCharCode(97 + index)}).
              </span>
              <input
                type="text"
                value={option.text}
                onChange={(e) => updateMultipleChoiceOption(sectionId, item.id, option.id, e.target.value)}
                className="flex-1 min-w-0 bg-[#161616] border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                placeholder={`Option ${index + 1}`}
              />
              <button
                onClick={() => deleteMultipleChoiceOption(sectionId, item.id, option.id)}
                className="text-gray-400 hover:text-red-500 p-2 rounded transition-colors flex-shrink-0"
                title="Delete option"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            onClick={() => addMultipleChoiceOption(sectionId, item.id)}
            className="text-blue-400 hover:text-blue-300 text-sm mt-1 px-2 py-1 rounded transition-colors"
          >
            + Add Option
          </button>
        </div>
      );
    }
    return null;
  };

  // Render variable field editor - just the preview
  const renderVariableFieldEditor = (sectionId, item) => {
    if (item.itemType !== 'variableField' || !item.variable) return null;

    return (
      <div className="mt-1">
        <div className="flex items-start gap-2">
          {item.variableType === 'select' && (
            <select 
              disabled 
              className="flex-1 min-w-0 bg-[#161616] border border-gray-600 rounded-lg px-4 py-3 text-gray-400 text-base"
            >
              <option>Select {availableVariables.find(v => v.value === item.variable)?.label}...</option>
              {item.variableOptions?.map(opt => (
                <option key={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}
          {item.variableType === 'date' && (
            <input 
              type="date" 
              disabled 
              className="flex-1 min-w-0 bg-[#161616] border border-gray-600 rounded-lg px-4 py-3 text-gray-400 text-base"
            />
          )}
          {item.variableType === 'text' && (
            <input 
              type="text" 
              disabled 
              placeholder={`Enter ${availableVariables.find(v => v.value === item.variable)?.label}...`}
              className="flex-1 min-w-0 bg-[#161616] border border-gray-600 rounded-lg px-4 py-3 text-gray-400 text-base"
            />
          )}
          {/* Invisible spacer to match delete button width */}
          <div className="p-2 flex-shrink-0 invisible" aria-hidden="true">
            <Trash2 size={18} />
          </div>
        </div>
      </div>
    );
  };

  if (!showModal) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-[#1C1C1C] rounded-lg w-full max-w-4xl border border-gray-700 flex flex-col max-h-[90vh]">
        {/* Fixed Header */}
        <div className="flex-shrink-0 border-b border-gray-700 p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            {showTitleOnly ? (
              <h2 className="text-lg sm:text-xl font-bold">
                {editingForm ? 'Edit Form' : 'Create New Form'}
              </h2>
            ) : (
              <div className="flex items-center gap-2">
                {isEditingTitle ? (
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    onBlur={() => setIsEditingTitle(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setIsEditingTitle(false);
                      }
                    }}
                    className="text-lg sm:text-xl font-bold bg-[#161616] border border-gray-600 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-blue-500 w-full max-w-[200px] sm:max-w-[400px]"
                    autoFocus
                  />
                ) : (
                  <>
                    <h2 className="text-lg sm:text-xl font-bold truncate max-w-[180px] sm:max-w-[400px]" title={formTitle || 'Untitled Form'}>
                      {formTitle || 'Untitled Form'}
                    </h2>
                    <button
                      onClick={() => {
                        setIsEditingTitle(true);
                        setTimeout(() => titleInputRef.current?.focus(), 0);
                      }}
                      className="text-gray-400 hover:text-white p-1 rounded transition-colors flex-shrink-0"
                      title="Edit title"
                    >
                      <Pencil size={16} />
                    </button>
                  </>
                )}
              </div>
            )}
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-white text-lg"
            >
              ✕
            </button>
          </div>

          {/* Form Title - Only show input in title-only mode */}
          {showTitleOnly && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Form Title
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full bg-[#161616] border border-gray-600 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                placeholder="Enter a title..."
              />
            </div>
          )}

          {!showTitleOnly && (
            <div className="flex justify-between items-center mt-4">
              <h3 className="text-base font-semibold text-white">Form Sections</h3>
              <button
                onClick={addSection}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                + Add Section
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {showTitleOnly ? (
            <div className="flex justify-end">
              <button
                onClick={proceedToFullForm}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!formTitle.trim()}
              >
                Continue
              </button>
            </div>
          ) : (
            <>
              {/* Sections */}
              <div className="space-y-4 mb-6">
                {sections.map((section, sectionIndex) => (
                  <div
                    key={section.id}
                    className="bg-[#161616] border border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {/* Move buttons */}
                        <div className="flex flex-col gap-1 flex-shrink-0">
                          <button
                            onClick={() => moveSectionUp(sectionIndex)}
                            disabled={sectionIndex === 0}
                            className={`p-1 rounded transition-colors ${
                              sectionIndex === 0 
                                ? 'text-gray-600 cursor-not-allowed' 
                                : 'text-gray-400 hover:text-white hover:bg-[#1C1C1C]'
                            }`}
                            title="Move section up"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            onClick={() => moveSectionDown(sectionIndex)}
                            disabled={sectionIndex === sections.length - 1}
                            className={`p-1 rounded transition-colors ${
                              sectionIndex === sections.length - 1 
                                ? 'text-gray-600 cursor-not-allowed' 
                                : 'text-gray-400 hover:text-white hover:bg-[#1C1C1C]'
                            }`}
                            title="Move section down"
                          >
                            <ArrowDown size={16} />
                          </button>
                        </div>

                        <input
                          ref={sectionIndex === sections.length - 1 ? newSectionTitleRef : null}
                          type="text"
                          value={section.name}
                          onChange={(e) => updateSectionName(section.id, e.target.value)}
                          className="bg-transparent text-white font-medium flex-1 min-w-0 focus:outline-none focus:border-b border-gray-600 text-base px-2 py-2"
                          placeholder="Section name"
                        />
                      </div>
                      <button
                        onClick={() => deleteSection(section.id)}
                        className="text-red-500 hover:text-red-400 text-sm px-3 py-2 rounded transition-colors flex-shrink-0 self-end sm:self-auto"
                      >
                        Delete Section
                      </button>
                    </div>

                    <div className="space-y-3">
                      {section.items?.map((item, itemIndex) => (
                        <div
                          key={item.id}
                          className="flex flex-col gap-3 p-4 bg-[#1C1C1C] rounded-lg"
                        >
                          <div className="flex flex-col sm:flex-row gap-2">
                            {/* Move buttons for items */}
                            <div className="flex sm:flex-col gap-1 sm:mt-2 order-2 sm:order-1">
                              <button
                                onClick={() => moveItemUp(section.id, itemIndex)}
                                disabled={itemIndex === 0}
                                className={`p-1 rounded transition-colors ${
                                  itemIndex === 0 
                                    ? 'text-gray-700 cursor-not-allowed' 
                                    : 'text-gray-400 hover:text-white hover:bg-[#161616]'
                                }`}
                                title="Move item up"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button
                                onClick={() => moveItemDown(section.id, itemIndex)}
                                disabled={itemIndex === section.items.length - 1}
                                className={`p-1 rounded transition-colors ${
                                  itemIndex === section.items.length - 1 
                                    ? 'text-gray-700 cursor-not-allowed' 
                                    : 'text-gray-400 hover:text-white hover:bg-[#161616]'
                                }`}
                                title="Move item down"
                              >
                                <ArrowDown size={14} />
                              </button>
                            </div>

                            {(item.itemType === 'question' || item.itemType === 'variableField') && (
                              <span className="text-gray-400 text-sm sm:mt-3 flex-shrink-0 min-w-[24px] order-1 sm:order-2">
                                {item.number}.
                              </span>
                            )}
                            
                            {/* Invisible spacer for text blocks to align with numbered items */}
                            {item.itemType === 'textBlock' && (
                              <span className="hidden sm:block flex-shrink-0 min-w-[24px] order-2" aria-hidden="true" />
                            )}
                            
                            <div className="flex-1 space-y-3 min-w-0 order-3">
                              {/* Content Input */}
                              <div className="flex items-start gap-2">
                                {item.itemType === 'textBlock' ? (
                                  <textarea
                                    value={item.text}
                                    onChange={(e) => updateItem(section.id, item.id, 'text', e.target.value)}
                                    className="flex-1 min-w-0 bg-[#161616] border border-gray-600 rounded-lg px-4 py-3 text-white text-base focus:outline-none focus:border-blue-500 resize-none"
                                    rows="3"
                                    placeholder="Enter text content..."
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    value={item.text}
                                    onChange={(e) =>
                                      updateItem(section.id, item.id, 'text', e.target.value)
                                    }
                                    className="flex-1 min-w-0 bg-[#161616] border border-gray-600 rounded-lg px-4 py-3 text-white text-base focus:outline-none focus:border-blue-500"
                                    placeholder={item.itemType === 'variableField' ? "Question/Label text..." : "Question text..."}
                                  />
                                )}
                                <button
                                  onClick={() => deleteItem(section.id, item.id)}
                                  className="text-gray-400 hover:text-red-500 p-2 rounded transition-colors mt-2 flex-shrink-0"
                                  title="Delete"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                              
                              {/* Question Type Selector - only for questions */}
                              {item.itemType === 'question' && (
                                <div className="flex gap-3 flex-wrap items-center">
                                  <select
                                    value={item.type}
                                    onChange={(e) => {
                                      const newType = e.target.value;
                                      updateItem(section.id, item.id, 'type', newType);
                                      if (newType !== 'multiple') {
                                        updateItem(section.id, item.id, 'options', undefined);
                                      }
                                    }}
                                    className="bg-[#161616] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                  >
                                    <option value="yesno">Yes/No</option>
                                    <option value="yesnodontknow">Yes/No/Don't know</option>
                                    <option value="multiple">Multiple Choice</option>
                                    <option value="text">Free Text</option>
                                  </select>
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={item.required !== false}
                                      onChange={(e) => updateItem(section.id, item.id, 'required', e.target.checked)}
                                      className="w-4 h-4 accent-blue-500 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-300">Required</span>
                                  </label>
                                </div>
                              )}

                              {/* Variable Selector and Required checkbox for variable fields */}
                              {item.itemType === 'variableField' && (
                                <div className="flex gap-3 flex-wrap items-center">
                                  <div className="relative">
                                    <button
                                      onClick={() => setShowVariableDropdown(showVariableDropdown === item.id ? null : item.id)}
                                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors border max-w-full ${
                                        item.variable 
                                          ? 'bg-[#252525] border-gray-500 text-white' 
                                          : 'bg-[#161616] border-gray-600 text-gray-400 hover:border-gray-500'
                                      }`}
                                    >
                                      <Link size={14} className="flex-shrink-0" />
                                      <span className="truncate">
                                        {item.variable 
                                          ? `${availableVariables.find(v => v.value === item.variable)?.label} (${getVariableTypeLabel(item.variableType)})`
                                          : 'Select Variable...'
                                        }
                                      </span>
                                    </button>
                                    
                                    {showVariableDropdown === item.id && (
                                      <div className="absolute z-50 mt-1 bg-[#1C1C1C] border border-gray-600 rounded-lg shadow-lg py-1 w-full sm:w-auto sm:min-w-[240px] max-w-[calc(100vw-3rem)] max-h-[300px] overflow-y-auto">
                                        {availableVariables.map(variable => (
                                          <button
                                            key={variable.value}
                                            onClick={() => selectVariable(section.id, item.id, variable.value)}
                                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#161616] transition-colors flex items-center justify-between ${
                                              item.variable === variable.value ? 'bg-[#161616] text-white' : 'text-gray-300'
                                            }`}
                                          >
                                            <span>{variable.label}</span>
                                            <span className="text-xs text-gray-500">
                                              {getVariableTypeLabel(variable.type)}
                                            </span>
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={item.required !== false}
                                      onChange={(e) => updateItem(section.id, item.id, 'required', e.target.checked)}
                                      className="w-4 h-4 accent-blue-500 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-300">Required</span>
                                  </label>
                                </div>
                              )}

                              {renderQuestionEditor(section.id, item)}
                              {renderVariableFieldEditor(section.id, item)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:flex-wrap">
                      <button
                        onClick={() => addQuestion(section.id)}
                        className="text-blue-400 hover:text-blue-300 text-sm px-3 py-2 rounded hover:bg-blue-500/10 transition-colors text-left"
                      >
                        + Add Question
                      </button>
                      <button
                        onClick={() => addVariableField(section.id)}
                        className="text-blue-400 hover:text-blue-300 text-sm px-3 py-2 rounded hover:bg-blue-500/10 transition-colors flex items-center gap-1"
                      >
                        <Link size={14} />
                        + Add Variable Question
                      </button>
                      <button
                        onClick={() => addTextBlock(section.id)}
                        className="text-gray-400 hover:text-gray-300 text-sm px-3 py-2 rounded hover:bg-gray-500/10 transition-colors text-left"
                      >
                        + Add Text Block
                      </button>
                    </div>
                  </div>
                ))}

                {sections.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-base">
                    No sections added yet. Click "Add Section" to get started.
                  </div>
                )}
              </div>

              {/* Signature Settings - Collapsible */}
              <div className="bg-[#161616] border border-gray-700 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsSignatureSettingsOpen(!isSignatureSettingsOpen)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-[#1a1a1a] transition-colors"
                >
                  <h3 className="text-base font-semibold text-white">Signature Settings</h3>
                  {isSignatureSettingsOpen ? (
                    <ChevronUp size={20} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </button>
                
                {isSignatureSettingsOpen && (
                  <div className="px-4 pb-4 space-y-3">
                    {/* Show Location Toggle */}
                    <label className="flex items-center justify-between p-3 bg-[#1C1C1C] rounded-lg cursor-pointer hover:bg-[#252525] transition-colors">
                      <span className="text-sm text-gray-300">Show Location</span>
                      <button
                        type="button"
                        onClick={() => setSignatureSettings({
                          ...signatureSettings,
                          showLocation: !signatureSettings.showLocation
                        })}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          signatureSettings.showLocation ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            signatureSettings.showLocation ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </label>

                    {/* Location Input - Only show when showLocation is true */}
                    {signatureSettings.showLocation && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Default Location
                        </label>
                        <input
                          type="text"
                          value={signatureSettings.defaultLocation || ''}
                          onChange={(e) => setSignatureSettings({
                            ...signatureSettings,
                            defaultLocation: e.target.value
                          })}
                          className="w-full bg-[#1C1C1C] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                          placeholder="e.g., Berlin, Germany"
                        />
                      </div>
                    )}

                    {/* Show Date Toggle */}
                    <label className="flex items-center justify-between p-3 bg-[#1C1C1C] rounded-lg cursor-pointer hover:bg-[#252525] transition-colors">
                      <span className="text-sm text-gray-300">Show Todays Date</span>
                      <button
                        type="button"
                        onClick={() => setSignatureSettings({
                          ...signatureSettings,
                          showDate: !signatureSettings.showDate
                        })}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          signatureSettings.showDate ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            signatureSettings.showDate ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </label>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Fixed Footer */}
        {!showTitleOnly && (
          <div className="flex-shrink-0 border-t border-gray-700 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-3 text-gray-300 text-sm hover:text-white transition-colors border border-gray-600 rounded-lg w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveWithValidation}
                className="bg-orange-500 hover:bg-orange-600 text-sm text-white px-4 py-3 rounded-lg transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!formTitle.trim() || getTotalQuestionCount() === 0}
              >
                {editingForm ? 'Save Changes' : 'Create Form'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Section Confirmation Modal */}
      {deletingSectionId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[60]">
          <div className="bg-[#1C1C1C] rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-lg font-bold mb-2">Delete Section?</h3>
            <p className="text-gray-300 text-sm mb-4">
              Are you sure you want to delete this section? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDeleteSection}
                className="px-4 py-2 text-gray-300 text-sm hover:text-white transition-colors border border-gray-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteSection}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warning Modal for incomplete content */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[60]">
          <div className="bg-[#1C1C1C] rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-lg font-bold mb-2 text-yellow-500">Incomplete Content</h3>
            <p className="text-gray-300 text-sm mb-3">
              The following issues were found:
            </p>
            <ul className="list-disc list-inside text-gray-400 text-sm mb-4 space-y-1">
              {warningMessages.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
            <p className="text-gray-300 text-sm mb-4">
              Do you want to save anyway?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowWarningModal(false);
                  setWarningMessages([]);
                }}
                className="px-4 py-2 text-gray-300 text-sm hover:text-white transition-colors border border-gray-600 rounded-lg"
              >
                Go Back
              </button>
              <button
                onClick={confirmSaveAnyway}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Save Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateFormModal;
