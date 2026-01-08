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
  onProceedToContract 
}) => {
  const [answers, setAnswers] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [isSigned, setIsSigned] = useState(false);
  const [signature, setSignature] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [showContractPrompt, setShowContractPrompt] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const sampleAssessmentSections = [
    {
      id: 1,
      name: "Questions before trial training",
      questions: [
        { id: 1, text: "How did you hear about us?", type: "text", number: 1 },
        { id: 2, text: "Are you ready for your EMS training today?", type: "yesno", number: 2 },
        { id: 3, text: "Are you 'sport healthy'?", type: "yesno", number: 3 },
        { id: 4, text: "What goals are you pursuing?", type: "text", number: 4 }
      ]
    },
    {
      id: 2,
      name: "Contraindications: Checklist for...",
      questions: [
        { id: 5, text: "Arteriosclerosis, arterial circulation disorders", type: "yesno", number: 5 },
        { id: 6, text: "Abdominal wall and inguinal hernias", type: "yesno", number: 6 },
        { id: 7, text: "Cancer diseases", type: "yesno", number: 7 },
        { id: 8, text: "Stents and bypasses that have been active for less than 6 months", type: "yesno", number: 8 }
      ]
    }
  ];

  // Initialize canvas for signature
  useEffect(() => {
    if (isSigned && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      canvas.style.width = `${canvas.offsetWidth}px`;
      canvas.style.height = `${canvas.offsetHeight}px`;
      
      const context = canvas.getContext("2d");
      context.scale(2, 2);
      context.lineCap = "round";
      context.strokeStyle = "white";
      context.lineWidth = 2;
      contextRef.current = context;
    }
  }, [isSigned]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const x = (e.clientX - rect.left) * (canvas.width / rect.width) / 2;
    const y = (e.clientY - rect.top) * (canvas.height / rect.height) / 2;
    
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const x = (e.clientX - rect.left) * (canvas.width / rect.width) / 2;
    const y = (e.clientY - rect.top) * (canvas.height / rect.height) / 2;
    
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      contextRef.current.closePath();
      setIsDrawing(false);
      
      // Get signature as data URL
      const canvas = canvasRef.current;
      const signatureData = canvas.toDataURL();
      setSignature(signatureData);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    setSignature('');
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const renderQuestionInput = (question) => {
    const currentAnswer = answers[question.id];

    switch (question.type) {
      case 'yesno':
        return (
          <div className="flex gap-6 text-white mt-3">
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                name={`question-${question.id}`}
                checked={currentAnswer === 'yes'}
                onChange={() => handleAnswerChange(question.id, 'yes')}
                className="w-4 h-4"
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                name={`question-${question.id}`}
                checked={currentAnswer === 'no'}
                onChange={() => handleAnswerChange(question.id, 'no')}
                className="w-4 h-4"
              />
              <span>No</span>
            </label>
          </div>
        );
      case 'text':
        return (
          <input
            type="text"
            value={currentAnswer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full bg-[#161616] border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 mt-3"
            placeholder="Enter your answer..."
          />
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
    
    const assessmentData = {
      leadId: selectedLead.id,
      assessmentId: assessment.id,
      answers,
      signature,
      completedAt: new Date().toISOString()
    };
    
    // console.log('Assessment completed:', assessmentData);
    
    onComplete(assessmentData);
    
    setShowContractPrompt(true);
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
    const currentSectionQuestions = sampleAssessmentSections[currentSection].questions;
    return currentSectionQuestions.every(question => answers[question.id]);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-[#1C1C1C] rounded-xl p-6 w-full max-w-4xl my-8 border border-gray-700 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">{assessment?.title}</h2>
              <p className="text-gray-400 text-sm">
                For: {selectedLead?.firstName} {selectedLead?.surname}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
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

          {!isSigned ? (
            /* Assessment Questions */
            <div>
              {/* Current Section */}
              <div className="bg-[#161616] border border-gray-600 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-600 pb-2">
                  {sampleAssessmentSections[currentSection].name}
                </h3>
                
                <div className="space-y-6">
                  {sampleAssessmentSections[currentSection].questions.map((question) => (
                    <div key={question.id} className="p-4 bg-[#1C1C1C] rounded-lg">
                      <p className="font-medium text-white mb-3">
                        {question.number}. {question.text}
                      </p>
                      {renderQuestionInput(question)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentSection === 0}
                  className="px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {currentSection === sampleAssessmentSections.length - 1 ? (
                  <button
                    onClick={() => setIsSigned(true)}
                    disabled={!allQuestionsAnswered()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Complete & Sign
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={!allQuestionsAnswered()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Section
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Signature Section */
            <div className="bg-[#161616] border border-gray-600 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Signature Required</h3>
              <p className="text-gray-300 mb-6">
                Please draw your signature in the box below to complete the assessment.
              </p>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-300">
                    Draw your signature
                  </label>
                  <button
                    onClick={clearSignature}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Clear signature
                  </button>
                </div>
                
                {/* Signature Canvas */}
                <div className="bg-[#1C1C1C] border-2 border-gray-600 rounded-lg overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-48 cursor-crosshair touch-none bg-transparent"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      const touch = e.touches[0];
                      startDrawing(touch);
                    }}
                    onTouchMove={(e) => {
                      e.preventDefault();
                      const touch = e.touches[0];
                      draw(touch);
                    }}
                    onTouchEnd={stopDrawing}
                  />
                </div>
                
                <p className="text-gray-400 text-xs mt-2">
                  Draw your signature using mouse/finger. On mobile, use your finger to sign.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-end">
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
                  Complete Assessment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Contract Prompt Modal */}
      {showContractPrompt && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
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