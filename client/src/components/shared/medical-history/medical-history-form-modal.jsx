/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

const AssessmentFormModal = ({ 
  isOpen, 
  onClose, 
  assessment, 
  selectedLead,
  onComplete,
  onProceedToContract,
  fromDocumentManagement = false,
  existingDocument = null,
  isEditMode = false,
  isViewMode = false
}) => {
  const [answers, setAnswers] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [isSigned, setIsSigned] = useState(false);
  const [signature, setSignature] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [showContractPrompt, setShowContractPrompt] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  // Variable definitions (same as in CreateFormModal and PreviewModal)
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

  const sampleAssessmentSections = [
    {
      id: 1,
      name: "Questions before trial training",
      items: [
        { id: 1, itemType: 'question', text: "How did you hear about us?", type: "text", number: 1, required: true },
        { id: 2, itemType: 'question', text: "Are you ready for your EMS training today?", type: "yesno", number: 2, required: true },
        { id: 3, itemType: 'question', text: "Are you 'sport healthy'?", type: "yesno", number: 3, required: true },
        { id: 4, itemType: 'question', text: "What goals are you pursuing?", type: "text", number: 4, required: true }
      ]
    },
    {
      id: 2,
      name: "Contraindications: Checklist for...",
      items: [
        { id: 5, itemType: 'textBlock', text: "Please answer the following questions about potential contraindications honestly. This information is important for your safety during training." },
        { id: 6, itemType: 'question', text: "Arteriosclerosis, arterial circulation disorders", type: "yesno", number: 5, required: true },
        { id: 7, itemType: 'question', text: "Abdominal wall and inguinal hernias", type: "yesno", number: 6, required: true },
        { id: 8, itemType: 'question', text: "Cancer diseases", type: "yesno", number: 7, required: true },
        { id: 9, itemType: 'question', text: "Stents and bypasses that have been active for less than 6 months", type: "yesnodontknow", number: 8, required: true }
      ]
    }
  ];

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

  // Initialize answers and signature from existing document
  useEffect(() => {
    if (isOpen) {
      if ((isEditMode || isViewMode) && existingDocument) {
        setAnswers(existingDocument.answers || {});
        // Store signature but don't jump to signature section - let user navigate through questions first
        if (existingDocument.signature) {
          setSignature(existingDocument.signature);
        } else {
          setSignature('');
        }
        // Always start at section 0 (questions), not signature section
        setIsSigned(false);
      } else {
        setAnswers({});
        setSignature('');
        setIsSigned(false);
      }
      setCurrentSection(0);
    }
  }, [isOpen, isEditMode, isViewMode, existingDocument, selectedLead?.id]);

  // Initialize canvas for signature
  useEffect(() => {
    if (isSigned && canvasRef.current && !isViewMode) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      canvas.style.width = `${canvas.offsetWidth}px`;
      canvas.style.height = `${canvas.offsetHeight}px`;
      
      const context = canvas.getContext("2d");
      context.scale(2, 2);
      context.lineCap = "round";
      context.strokeStyle = "#000000"; // Black for visibility on white backgrounds
      context.lineWidth = 2;
      contextRef.current = context;
    } else if (isSigned && isViewMode && existingDocument?.signature && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = existingDocument.signature;
    }
  }, [isSigned, isViewMode, existingDocument]);

  const startDrawing = (e) => {
    if (isViewMode) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const x = (e.clientX - rect.left) * (canvas.width / rect.width) / 2;
    const y = (e.clientY - rect.top) * (canvas.height / rect.height) / 2;
    
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || isViewMode) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const x = (e.clientX - rect.left) * (canvas.width / rect.width) / 2;
    const y = (e.clientY - rect.top) * (canvas.height / rect.height) / 2;
    
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && !isViewMode) {
      contextRef.current.closePath();
      setIsDrawing(false);
      
      const canvas = canvasRef.current;
      const signatureData = canvas.toDataURL();
      setSignature(signatureData);
    }
  };

  const clearSignature = () => {
    if (isViewMode) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    setSignature('');
  };

  const handleAnswerChange = (questionId, value) => {
    if (isViewMode) return;
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Handle multiple choice answer change
  const handleMultipleChoiceChange = (questionId, optionId, checked) => {
    if (isViewMode) return;
    
    setAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      if (checked) {
        return { ...prev, [questionId]: [...currentAnswers, optionId] };
      } else {
        return { ...prev, [questionId]: currentAnswers.filter(id => id !== optionId) };
      }
    });
  };

  // Render variable field input
  const renderVariableInput = (item) => {
    const variableType = getVariableType(item);
    const variableOptions = getVariableOptions(item);
    const variableLabel = getVariableLabel(item.variable);
    const currentAnswer = answers[item.id] || '';

    switch (variableType) {
      case 'select':
        return (
          <div className="mt-3">
            <div className="relative">
              <select
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                disabled={isViewMode}
                className="w-full bg-[#161616] border border-gray-600 rounded-lg px-4 py-3 text-white text-base focus:outline-none focus:border-blue-500 appearance-none disabled:opacity-60 disabled:cursor-not-allowed"
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
          </div>
        );
      
      case 'date':
        return (
          <div className="mt-3">
            <input
              type="date"
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(item.id, e.target.value)}
              disabled={isViewMode}
              className="w-full bg-[#161616] border border-gray-600 rounded-lg px-4 py-3 text-white text-base focus:outline-none focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
        );
      
      default: // text
        return (
          <div className="mt-3">
            <input
              type="text"
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(item.id, e.target.value)}
              disabled={isViewMode}
              placeholder={isViewMode ? "" : `Enter ${variableLabel}...`}
              className="w-full bg-[#161616] border border-gray-600 rounded-lg px-4 py-3 text-white text-base focus:outline-none focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
        );
    }
  };

  // Render question input based on type
  const renderQuestionInput = (question) => {
    const currentAnswer = answers[question.id];

    switch (question.type) {
      case 'yesno':
        return (
          <div className="flex flex-wrap gap-4 mt-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name={`question-${question.id}`}
                checked={currentAnswer === 'yes'}
                onChange={() => handleAnswerChange(question.id, 'yes')}
                disabled={isViewMode}
                className="w-5 h-5 accent-blue-600"
              />
              <span className="text-gray-300">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name={`question-${question.id}`}
                checked={currentAnswer === 'no'}
                onChange={() => handleAnswerChange(question.id, 'no')}
                disabled={isViewMode}
                className="w-5 h-5 accent-blue-600"
              />
              <span className="text-gray-300">No</span>
            </label>
          </div>
        );

      case 'yesnodontknow':
        return (
          <div className="flex flex-wrap gap-4 mt-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name={`question-${question.id}`}
                checked={currentAnswer === 'yes'}
                onChange={() => handleAnswerChange(question.id, 'yes')}
                disabled={isViewMode}
                className="w-5 h-5 accent-blue-600"
              />
              <span className="text-gray-300">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name={`question-${question.id}`}
                checked={currentAnswer === 'no'}
                onChange={() => handleAnswerChange(question.id, 'no')}
                disabled={isViewMode}
                className="w-5 h-5 accent-blue-600"
              />
              <span className="text-gray-300">No</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name={`question-${question.id}`}
                checked={currentAnswer === 'dontknow'}
                onChange={() => handleAnswerChange(question.id, 'dontknow')}
                disabled={isViewMode}
                className="w-5 h-5 accent-blue-600"
              />
              <span className="text-gray-300">Don&apos;t know</span>
            </label>
          </div>
        );

      case 'multiple':
        return (
          <div className="space-y-3 mt-3">
            {question.options?.map((option, index) => (
              <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={(currentAnswer || []).includes(option.id)}
                  onChange={(e) => handleMultipleChoiceChange(question.id, option.id, e.target.checked)}
                  disabled={isViewMode}
                  className="w-5 h-5 accent-blue-600"
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
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              disabled={isViewMode}
              className="w-full bg-[#161616] border border-gray-600 rounded-lg px-4 py-3 text-white text-base focus:outline-none focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              placeholder={isViewMode ? "" : "Enter your answer..."}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentSection < sampleAssessmentSections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleCompleteAssessment = () => {
    if (!signature) {
      alert('Please provide signature before completing assessment');
      return;
    }
    
    // Get full name of lead/member
    const memberFullName = `${selectedLead?.firstName || ''} ${selectedLead?.surname || selectedLead?.lastName || ''}`.trim();
    
    // Get form title - handle cases where assessment.title might be the full filename "Form - Name"
    const rawTitleForFile = assessment?.title || 'Medical History Form';
    const formTitleForFile = rawTitleForFile.includes(' - ') ? rawTitleForFile.split(' - ')[0] : rawTitleForFile;
    
    // Preserve existing name when editing, or generate new name with format: "FormTitle - FullName"
    const documentName = isEditMode && existingDocument?.name 
      ? existingDocument.name 
      : `${formTitleForFile} - ${memberFullName || 'Unknown'}`;
    
    const documentData = {
      id: existingDocument?.id || `doc-${Date.now()}`,
      name: documentName,
      type: "medicalHistory",
      size: "0.3 MB",
      uploadDate: existingDocument?.uploadDate || new Date().toISOString().split("T")[0],
      category: "medicalHistory",
      section: "medicalHistory",
      templateId: assessment?.id || 'default',
      answers,
      signature,
      signed: true,
      tags: existingDocument?.tags || [],
      isEdit: isEditMode
    };
    
    onComplete(documentData);
    onClose();
  };

  const handleProceedToContractClick = () => {
    setShowContractPrompt(false);
    onClose();
    onProceedToContract();
  };

  const handleSkipContract = () => {
    setShowContractPrompt(false);
    onClose();
  };

  const allQuestionsAnswered = () => {
    const currentSectionItems = sampleAssessmentSections[currentSection].items || [];
    const requiredItems = currentSectionItems.filter(item => 
      (item.itemType === 'question' || item.itemType === 'variableField') && item.required !== false
    );
    return requiredItems.every(item => {
      const answer = answers[item.id];
      if (item.type === 'multiple') {
        return answer && answer.length > 0;
      }
      return answer !== undefined && answer !== '';
    });
  };

  if (!isOpen) return null;

  // Get full name of lead/member
  const fullName = `${selectedLead?.firstName || ''} ${selectedLead?.surname || selectedLead?.lastName || ''}`.trim() || 'Unknown';
  
  // Get form title - handle cases where assessment.title might be the full filename "Form - Name"
  const rawTitle = assessment?.title || existingDocument?.name || 'Medical History Form';
  const formTitle = rawTitle.includes(' - ') ? rawTitle.split(' - ')[0] : rawTitle;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[70]">
        <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl border border-gray-700 flex flex-col max-h-[90vh]">
          {/* Fixed Header */}
          <div className="flex-shrink-0 p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {formTitle}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  {isViewMode ? 'Viewing for' : isEditMode ? 'Editing for' : 'For'}: <span className="text-white font-medium">{fullName}</span>
                </p>
                {isViewMode && (
                  <p className="text-orange-400 text-xs mt-1">Read-only mode</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Section {currentSection + 1} of {sampleAssessmentSections.length}</span>
                <span>{Math.round(((currentSection + 1) / sampleAssessmentSections.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentSection + 1) / sampleAssessmentSections.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {!isSigned ? (
              /* Assessment Questions */
              <div className="bg-[#161616] border border-gray-600 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-600 pb-2">
                  {sampleAssessmentSections[currentSection].name}
                </h3>
                
                <div className="space-y-6">
                  {(sampleAssessmentSections[currentSection].items || sampleAssessmentSections[currentSection].questions || []).map((item) => {
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
                        <p className="font-medium text-white mb-1">
                          {item.number}. {item.text}
                          {item.required !== false && <span className="text-red-500 ml-1">*</span>}
                        </p>
                        {renderQuestionInput(item)}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Signature Section */
              <div className="bg-[#161616] border border-gray-600 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {isViewMode ? 'Signature' : 'Signature Required'}
                </h3>
                {!isViewMode && (
                  <p className="text-gray-300 mb-6">
                    Please draw your signature in the box below to complete the medical history form.
                  </p>
                )}
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-300">
                      {isViewMode ? 'Signed signature' : 'Draw your signature'}
                    </label>
                    {!isViewMode && (
                      <button
                        onClick={clearSignature}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        Clear signature
                      </button>
                    )}
                  </div>
                  
                  {/* Signature Display */}
                  {isViewMode && signature ? (
                    // View mode: show signature as image
                    <div className="bg-white border-2 border-gray-600 rounded-lg overflow-hidden p-4">
                      <img 
                        src={signature} 
                        alt="Signature" 
                        className="max-h-48 w-auto mx-auto block"
                        style={{ backgroundColor: '#ffffff' }}
                      />
                    </div>
                  ) : (
                    // Edit mode: canvas for drawing
                    <div className="bg-white border-2 border-gray-600 rounded-lg overflow-hidden">
                      <canvas
                        ref={canvasRef}
                        className={`w-full h-48 ${isViewMode ? 'cursor-default' : 'cursor-crosshair'} touch-none`}
                        style={{ backgroundColor: '#ffffff' }}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={(e) => {
                          if (isViewMode) return;
                          e.preventDefault();
                          const touch = e.touches[0];
                          startDrawing(touch);
                        }}
                        onTouchMove={(e) => {
                          if (isViewMode) return;
                          e.preventDefault();
                          const touch = e.touches[0];
                          draw(touch);
                        }}
                        onTouchEnd={stopDrawing}
                      />
                    </div>
                  )}
                  
                  {!isViewMode && (
                    <p className="text-gray-400 text-xs mt-2">
                      Draw your signature using mouse/finger. On mobile, use your finger to sign.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Fixed Footer */}
          <div className="flex-shrink-0 p-6 border-t border-gray-700">
            {!isSigned ? (
              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentSection === 0}
                  className="px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {currentSection === sampleAssessmentSections.length - 1 ? (
                  isViewMode ? (
                    <div className="flex gap-3">
                      {/* Show View Signature button if document has signature */}
                      {signature && (
                        <button
                          onClick={() => setIsSigned(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          View Signature
                        </button>
                      )}
                      <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsSigned(true)}
                      disabled={!allQuestionsAnswered()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Complete & Sign
                    </button>
                  )
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={!allQuestionsAnswered() && !isViewMode}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Section
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                {isViewMode ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsSigned(false)}
                      className="px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Back to Questions
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setIsSigned(false)}
                      className="px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Back to Questions
                    </button>
                    <button
                      onClick={handleCompleteAssessment}
                      disabled={!signature}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isEditMode ? 'Update Medical History' : 'Complete Medical History'}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Contract Prompt Modal */}
      {showContractPrompt && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[80] p-4">
          <div className="bg-[#1C1C1C] rounded-xl p-6 w-full max-w-md border border-gray-700">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Assessment Completed Successfully!
              </h3>
              <p className="text-gray-300">
                Would you like to proceed with creating a contract for {selectedLead?.firstName} {selectedLead?.surname}?
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleProceedToContractClick}
                className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Yes, Create Contract
              </button>
              <button
                onClick={handleSkipContract}
                className="w-full py-3 bg-[#2F2F2F] text-gray-300 border border-gray-600 rounded-lg hover:bg-[#3F3F3F] transition-colors"
              >
                No, Return to Leads
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssessmentFormModal;
