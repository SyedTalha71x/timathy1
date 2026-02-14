/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { X, Pencil } from 'lucide-react';

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
      sections: 3,
      questions: 12,
      active: true
    },
    {
      id: 2,
      title: "Health & Fitness Assessment",
      sections: 4,
      questions: 18,
      active: true
    },
    {
      id: 3,
      title: "Trial Training Evaluation",
      sections: 2,
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[1000]">
      <div className="bg-surface-card p-6 rounded-xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-content-primary">Fill Out Medical History</h2>
          <button
            onClick={onClose}
            className="text-content-muted hover:text-content-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-content-secondary mb-4">
            Select a medical history form for {selectedLead?.firstName} {selectedLead?.surname}
          </p>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {assessments.filter(assessment => assessment.active).map((assessment) => (
              <div
                key={assessment.id}
                onClick={() => handleAssessmentSelect(assessment)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedAssessment?.id === assessment.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-border'
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-content-primary">{assessment.title}</h3>
                  <div className="text-content-muted text-sm">
                    {assessment.sections} Sections • {assessment.questions} Questions
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
              className="px-4 py-3 text-sm text-content-primary bg-surface-button rounded-xl hover:bg-surface-button-hover active:scale-95 transition-all"
            >
              Proceed to Contract
            </button>
          )}
          <button
            onClick={handleCreateAssessment}
            disabled={!selectedAssessment}
            className="px-4 py-3 text-sm bg-primary hover:bg-primary-hover text-white rounded-xl active:scale-95 transition-transform font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            Fill Out Medical History
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentSelectionModal;