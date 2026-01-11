/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AssessmentSelectionModal = ({ 
  isOpen, 
  onClose, 
  onSelectAssessment, 
  onProceedToContract,
  selectedLead,
  fromDocumentManagement = false
}) => {
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  const sampleAssessments = [
    {
      id: 1,
      title: "Consultation Protocol - Prospects",
      description: "Standard assessment for new prospects",
      questions: 12,
      active: true
    },
    {
      id: 2,
      title: "Health & Fitness Assessment",
      description: "Comprehensive health and fitness evaluation",
      questions: 18,
      active: true
    },
    {
      id: 3,
      title: "Trial Training Evaluation",
      description: "Post-trial training feedback form",
      questions: 8,
      active: true
    }
  ];

  useEffect(() => {
    if (isOpen) {
      // In a real app, you would fetch assessments from an API
      setAssessments(sampleAssessments);
    }
  }, [isOpen]);

  const handleAssessmentSelect = (assessment) => {
    setSelectedAssessment(assessment);
  };

  const handleCreateAssessment = () => {
    if (selectedAssessment) {
      onSelectAssessment(selectedAssessment);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[70]">
      <div className="bg-[#1C1C1C] rounded-xl p-6 w-full max-w-2xl border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Fill Out Medical History</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            Select a medical history form for {selectedLead?.firstName} {selectedLead?.surname}
          </p>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {assessments.filter(assessment => assessment.active).map((assessment) => (
              <div
                key={assessment.id}
                onClick={() => handleAssessmentSelect(assessment)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedAssessment?.id === assessment.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white">{assessment.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{assessment.description}</p>
                  </div>
                  <div className="text-gray-400 text-sm">
                    {assessment.questions} questions
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          {!fromDocumentManagement && (
            <button
              onClick={onProceedToContract}
              className="px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Proceed to Contract
            </button>
          )}
          <button
            onClick={handleCreateAssessment}
            disabled={!selectedAssessment}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Fill Out Medical History
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentSelectionModal;