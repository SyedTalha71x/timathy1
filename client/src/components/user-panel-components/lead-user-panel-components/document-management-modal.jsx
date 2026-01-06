/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef } from "react"
import { X, Upload, Trash, Edit2, File, FileText, FilePlus, Eye, Download, Check, Plus, Tag, FileSignature } from "lucide-react"
import { toast } from "react-hot-toast"
import { Printer } from "lucide-react"

export function LeadDocumentModal({ lead, isOpen, onClose }) {
  const [documents, setDocuments] = useState(lead?.documents || [])
  const [isUploading, setIsUploading] = useState(false)
  const [editingDocId, setEditingDocId] = useState(null)
  const [newDocName, setNewDocName] = useState("")
  const [viewingDocument, setViewingDocument] = useState(null)
  const [activeSection, setActiveSection] = useState("general")
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("#FF843E")
  const [configuredTags, setConfiguredTags] = useState([
    { id: "tag-1", name: "Contract", color: "#EF4444" },
    { id: "tag-2", name: "Proposal", color: "#F59E0B" },
    { id: "tag-3", name: "Medical History", color: "#10B981" },
    { id: "tag-4", name: "Follow-up", color: "#3B82F6" },
  ])
  const [selectedTags, setSelectedTags] = useState({})
  const [showAssessmentTemplates, setShowAssessmentTemplates] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [assessmentAnswers, setAssessmentAnswers] = useState({})
  const [showAssessmentForm, setShowAssessmentForm] = useState(false)
  const [editingAssessment, setEditingAssessment] = useState(null)
  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const fileInputRef = useRef(null)

  // Sample documents for demonstration
  const sampleDocuments = [
    {
      id: "doc-1",
      name: "Initial Proposal.pdf",
      type: "pdf",
      size: "1.2 MB",
      uploadDate: "2024-01-15",
      category: "proposal",
      section: "general",
      tags: ["tag-2"]
    },
    {
      id: "doc-2",
      name: "Contract Draft.docx",
      type: "docx",
      size: "0.8 MB",
      uploadDate: "2024-01-16",
      category: "contract",
      section: "general",
      tags: ["tag-1"]
    },
    {
      id: "doc-3",
      name: "Lead Assessment.xlsx",
      type: "xlsx",
      size: "1.5 MB",
      uploadDate: "2024-01-20",
      category: "medicalHistory",
      section: "general",
      tags: ["tag-3"]
    },
    {
      id: "doc-4",
      name: "Follow-up Notes.assess",
      type: "assess",
      size: "0.3 MB",
      uploadDate: "2024-01-25",
      category: "followup",
      section: "medicalHistory",
      templateId: "lead-assessment",
      answers: {
        question1: "Interested",
        question2: "Budget discussed",
        question3: "Follow-up scheduled"
      },
      signed: true,
      tags: ["tag-3", "tag-4"]
    }
  ]

  // Assessment templates for leads
  const assessmentTemplates = [
    {
      id: "lead-assessment",
      name: "Lead Qualification Assessment",
      description: "Comprehensive lead qualification and needs assessment",
      questions: [
        {
          id: "question1",
          type: "multiple-choice",
          question: "What is the lead's current interest level?",
          options: ["Very Interested", "Interested", "Somewhat Interested", "Not Interested"]
        },
        {
          id: "question2",
          type: "multiple-choice",
          question: "Has budget been discussed?",
          options: ["Yes, budget confirmed", "Yes, range discussed", "No, not discussed", "Budget concerns"]
        },
        {
          id: "question3",
          type: "multiple-choice",
          question: "What is the timeline for decision?",
          options: ["Immediate", "1-2 weeks", "1 month", "3+ months", "Unsure"]
        },
        {
          id: "question4",
          type: "text",
          question: "Specific requirements or concerns mentioned:"
        }
      ]
    },
    {
      id: "needs-assessment",
      name: "Needs Analysis",
      description: "Detailed analysis of lead requirements and expectations",
      questions: [
        {
          id: "question1",
          type: "multiple-choice",
          question: "Primary need or pain point?",
          options: ["Cost reduction", "Service improvement", "Feature requirements", "Other"]
        },
        {
          id: "question2",
          type: "text",
          question: "Key decision factors:"
        }
      ]
    }
  ]

  const displayDocuments = documents.length > 0 ? documents : sampleDocuments

  const documentCategories = [
    { id: "contract", label: "Contract", color: "text-red-500" },
    { id: "proposal", label: "Proposal", color: "text-orange-500" },
    { id: "medicalHistory", label: "Medical History", color: "text-green-500" },
    { id: "followup", label: "Follow-up", color: "text-blue-500" },
    { id: "correspondence", label: "Correspondence", color: "text-purple-500" },
    { id: "other", label: "Other", color: "text-gray-500" },
  ]

  // Filter documents by active section
  const filteredDocuments = displayDocuments.filter(doc => doc.section === activeSection)

  if (!isOpen || !lead) return null

  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
    ]

    const invalidFiles = files.filter((file) => !validTypes.includes(file.type))
    if (invalidFiles.length > 0) {
      toast.error(`${invalidFiles.length} file(s) have unsupported formats`)
      return
    }

    const largeFiles = files.filter((file) => file.size > 10 * 1024 * 1024)
    if (largeFiles.length > 0) {
      toast.error(`${largeFiles.length} file(s) exceed the 10MB size limit`)
      return
    }

    setIsUploading(true)
    toast.loading(`Uploading ${files.length} document(s)...`)

    setTimeout(() => {
      const newDocs = files.map((file) => ({
        id: `doc-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: getFileExtension(file.name),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split("T")[0],
        file: file,
        category: "other",
        section: activeSection,
        tags: []
      }))

      setDocuments([...displayDocuments, ...newDocs])
      setIsUploading(false)
      toast.dismiss()
      toast.success(`${files.length} document(s) uploaded successfully`)
    }, 1500)
  }

  const handleDownload = (doc) => {
    toast.success(`Downloading ${doc.name}...`)
    if (doc.file) {
      const url = URL.createObjectURL(doc.file)
      const a = document.createElement("a")
      a.href = url
      a.download = doc.name
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }
  }

  const handlePrint = (doc) => {
    toast.success(`Printing ${doc.name}...`)
    if (doc.file) {
      const url = URL.createObjectURL(doc.file)
      const printWindow = window.open(url)
      printWindow.onload = () => {
        printWindow.print()
        setTimeout(() => {
          printWindow.close()
          URL.revokeObjectURL(url)
        }, 100)
      }
    }
  }

  const handleViewDocument = (doc) => {
    setViewingDocument(doc)
    toast.success(`Viewing ${doc.name}...`)
  }

  const getFileExtension = (filename) => {
    if (!filename) return ""
    const parts = filename.split(".")
    return parts.length > 1 ? parts.pop().toLowerCase() : ""
  }

  const handleDelete = (docId) => {
    if (confirm("Are you sure you want to delete this document?")) {
      setDocuments(displayDocuments.filter((doc) => doc.id !== docId))
      toast.success("Document deleted successfully")
    }
  }

  const startEditing = (doc) => {
    const nameParts = doc.name.split(".")
    const extension = nameParts.pop()
    const nameWithoutExtension = nameParts.join(".")
    setEditingDocId(doc.id)
    setNewDocName(nameWithoutExtension)
  }

  const saveDocName = (docId) => {
    if (newDocName.trim() === "") {
      toast.error("Document name cannot be empty")
      return
    }

    const originalDoc = displayDocuments.find((doc) => doc.id === docId)
    const originalExtension = originalDoc.name.split(".").pop()
    const finalName = `${newDocName.trim()}.${originalExtension}`

    setDocuments(displayDocuments.map((doc) => (doc.id === docId ? { ...doc, name: finalName } : doc)))
    setEditingDocId(null)
    toast.success("Document renamed successfully")
  }

  const changeDocumentCategory = (docId, category) => {
    setDocuments(displayDocuments.map((doc) => (doc.id === docId ? { ...doc, category } : doc)))
    toast.success("Document category updated")
  }

  const getDocumentIcon = (type) => {
    if (!type) {
      return <File className="w-5 h-5 text-gray-400" />
    }

    const fileType = type.toLowerCase()
    switch (fileType) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />
      case "xlsx":
      case "xls":
        return <FileText className="w-5 h-5 text-green-500" />
      case "docx":
      case "doc":
        return <FileText className="w-5 h-5 text-blue-500" />
      case "jpg":
      case "jpeg":
      case "png":
        return <File className="w-5 h-5 text-purple-500" />
      case "txt":
        return <FileText className="w-5 h-5 text-gray-500" />
      case "assess":
        return <FileText className="w-5 h-5 text-orange-500" />
      default:
        return <File className="w-5 h-5 text-gray-400" />
    }
  }

  const getCategoryColor = (category) => {
    const categoryObj = documentCategories.find(cat => cat.id === category)
    return categoryObj ? categoryObj.color : "text-gray-500"
  }

  const getCategoryLabel = (category) => {
    const categoryObj = documentCategories.find(cat => cat.id === category)
    return categoryObj ? categoryObj.label : "Other"
  }

  // Tag management functions
  const addTag = () => {
    if (!newTagName.trim()) return
    
    const newTag = {
      id: `tag-${Date.now()}`,
      name: newTagName.trim(),
      color: newTagColor
    }
    
    setConfiguredTags([...configuredTags, newTag])
    setNewTagName("")
    setNewTagColor("#FF843E")
    toast.success("Tag created successfully")
  }

  const deleteTag = (tagId) => {
    setConfiguredTags(configuredTags.filter(tag => tag.id !== tagId))
    toast.success("Tag deleted successfully")
  }

  const toggleDocumentTag = (docId, tagId) => {
    const doc = displayDocuments.find(d => d.id === docId)
    if (!doc) return

    const currentTags = doc.tags || []
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId]

    setDocuments(displayDocuments.map(doc => 
      doc.id === docId ? { ...doc, tags: newTags } : doc
    ))
  }

  // Assessment functions
  const handleCreateAssessment = () => {
    setShowAssessmentTemplates(true)
  }

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template)
    setShowAssessmentTemplates(false)
    setShowAssessmentForm(true)
    setAssessmentAnswers({})
  }

  const handleAnswerChange = (questionId, value) => {
    setAssessmentAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleSaveAssessment = () => {
    if (!selectedTemplate) return

    const newAssessment = {
      id: `doc-${Date.now()}`,
      name: `${selectedTemplate.name}.assess`,
      type: "assess",
      size: "0.2 MB",
      uploadDate: new Date().toISOString().split("T")[0],
      category: "medicalHistory",
      section: "medicalHistory",
      templateId: selectedTemplate.id,
      answers: { ...assessmentAnswers },
      signed: false,
      tags: []
    }

    setDocuments([...displayDocuments, newAssessment])
    setShowAssessmentForm(false)
    setSelectedTemplate(null)
    setAssessmentAnswers({})
    toast.success("Medical History created successfully")
  }

  const handleEditAssessment = (doc) => {
    if (doc.signed) {
      setEditingAssessment(doc)
      setShowSignatureModal(true)
    } else {
      setSelectedTemplate(assessmentTemplates.find(t => t.id === doc.templateId))
      setAssessmentAnswers(doc.answers || {})
      setShowAssessmentForm(true)
      setEditingAssessment(doc)
    }
  }

  const handleSignAndUpdate = () => {
    if (!editingAssessment) return

    const updatedDoc = {
      ...editingAssessment,
      answers: assessmentAnswers,
      signed: true,
      uploadDate: new Date().toISOString().split("T")[0]
    }

    setDocuments(displayDocuments.map(doc => 
      doc.id === editingAssessment.id ? updatedDoc : doc
    ))

    setShowSignatureModal(false)
    setEditingAssessment(null)
    setShowAssessmentForm(false)
    setSelectedTemplate(null)
    setAssessmentAnswers({})
    toast.success("Assessment updated and signed successfully")
  }

  const renderQuestion = (question) => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={assessmentAnswers[question.id] === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="text-orange-500 focus:ring-orange-500"
                />
                <span className="text-white">{option}</span>
              </label>
            ))}
          </div>
        )
      case "text":
        return (
          <textarea
            value={assessmentAnswers[question.id] || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full bg-[#2a2a2a] text-white rounded-lg p-3 border border-gray-700 focus:border-orange-500 outline-none"
            rows={3}
            placeholder="Type your answer here..."
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-60 p-2 sm:p-4">
      {/* Assessment Templates Modal */}
      {showAssessmentTemplates && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-[70]">
          <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <h3 className="text-white text-lg font-medium">Select Assessment Template</h3>
              <button onClick={() => setShowAssessmentTemplates(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="grid gap-3">
                {assessmentTemplates.map(template => (
                  <div key={template.id} className="bg-[#141414] p-4 rounded-xl hover:bg-[#1a1a1a] transition-colors cursor-pointer" onClick={() => handleSelectTemplate(template)}>
                    <h4 className="text-white font-medium mb-2">{template.name}</h4>
                    <p className="text-gray-400 text-sm">{template.description}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      {template.questions.length} questions
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-800">
              <button onClick={() => setShowAssessmentTemplates(false)} className="w-full px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Form Modal */}
      {showAssessmentForm && selectedTemplate && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-[70]">
          <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <h3 className="text-white text-lg font-medium">{selectedTemplate.name}</h3>
              <button onClick={() => {
                setShowAssessmentForm(false)
                setSelectedTemplate(null)
                setAssessmentAnswers({})
                setEditingAssessment(null)
              }} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-6">
                {selectedTemplate.questions.map((question, index) => (
                  <div key={question.id} className="bg-[#141414] p-4 rounded-xl">
                    <h4 className="text-white font-medium mb-3">
                      {index + 1}. {question.question}
                    </h4>
                    {renderQuestion(question)}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-800">
              <div className="flex gap-3">
                <button onClick={() => {
                  setShowAssessmentForm(false)
                  setSelectedTemplate(null)
                  setAssessmentAnswers({})
                  setEditingAssessment(null)
                }} className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors">
                  Cancel
                </button>
                <button onClick={editingAssessment ? () => setShowSignatureModal(true) : handleSaveAssessment} className="flex-1 px-4 py-2 bg-[#3F74FF] text-white rounded-xl hover:bg-[#2F64FF] transition-colors">
                  {editingAssessment ? "Update Medical History" : "Save Medical History"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signature Modal */}
      {showSignatureModal && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-[80]">
          <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-md p-6">
            <h3 className="text-white text-lg font-medium mb-4">Sign to Update Medical History</h3>
            <p className="text-gray-400 mb-6">
              To update this medical history, you need to provide your signature confirming the changes.
            </p>
            <div className="bg-[#141414] p-4 rounded-xl mb-6">
              <div className="h-20 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Signature area</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowSignatureModal(false)} className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors">
                Cancel
              </button>
              <button onClick={handleSignAndUpdate} className="flex-1 px-4 py-2 bg-[#3F74FF] text-white rounded-xl hover:bg-[#2F64FF] transition-colors">
                Sign & Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tag Manager Modal */}
      {isTagManagerOpen && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-[70]">
          <div className="bg-[#181818] rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Manage Tags</h2>
              <button onClick={() => setIsTagManagerOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="mb-6">
              <div className="flex flex-col gap-3 mb-4">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Enter tag name"
                  className="w-full bg-[#1C1C1C] text-sm text-white px-4 py-2 rounded-lg outline-none"
                />
                <div className="flex items-center gap-3">
                  <span className="text-white text-sm">Color:</span>
                  <input
                    type="color"
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                  />
                  <span className="text-gray-300 text-sm">{newTagColor}</span>
                </div>
                <button
                  onClick={addTag}
                  className="bg-[#FF843E] text-white text-sm px-4 py-2 rounded-lg mt-2 hover:bg-[#FF843E]/90"
                  disabled={!newTagName.trim()}
                >
                  Add Tag
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto text-sm">
                {configuredTags.length > 0 ? (
                  <div className="space-y-2">
                    {configuredTags.map((tag) => (
                      <div key={tag.id} className="flex justify-between items-center bg-[#1C1C1C] px-4 py-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span
                            className="px-2 py-1 rounded-md text-xs flex items-center gap-1 text-white"
                            style={{ backgroundColor: tag.color }}
                          >
                            <Tag size={10} />
                            {tag.name}
                          </span>
                        </div>
                        <button onClick={() => deleteTag(tag.id)} className="text-red-400 hover:text-red-300">
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-4 text-sm">No tags created yet</p>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsTagManagerOpen(false)}
                className="bg-[#FF843E] text-white px-6 py-2 text-sm rounded-lg hover:bg-[#FF843E]/90"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document View Modal */}
      {viewingDocument && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-[70]">
          <div className="bg-white rounded-lg max-w-4xl max-h-[80vh] overflow-auto w-full">
            <div className="sticky top-0 bg-gray-100 p-3 flex justify-between items-center border-b">
              <h3 className="font-medium">{viewingDocument.name}</h3>
              <button onClick={() => setViewingDocument(null)} className="p-1 rounded-full hover:bg-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="bg-gray-100 p-8 rounded text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Document preview would appear here.</p>
                <p className="text-gray-500 text-sm mt-2">
                  {viewingDocument.type?.toUpperCase()} document â€¢ {viewingDocument.size}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Document Modal */}
      <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-800">
          <h3 className="text-white text-lg sm:text-xl font-medium">
            Document Management
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-800">
          <div className="flex flex-col sm:items-start gap-3">
            <p className="text-gray-300">
              Manage documents for <span className="font-medium text-white">{lead.firstName} {lead.surname}</span>
              <span className="text-gray-500 text-sm block sm:inline sm:ml-2">
                Lead #{lead.id}
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsTagManagerOpen(true)}
                className="text-sm gap-2 px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors w-full sm:w-auto flex items-center justify-center"
              >
                <Tag className="w-4 h-4 mr-2" />
                Tags
              </button>
              {activeSection === "medicalHistory" && (
                <button
                  onClick={handleCreateAssessment}
                  className="text-sm gap-2 px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors w-full sm:w-auto flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Medical History
                </button>
              )}
              <button
                onClick={handleUploadClick}
                disabled={isUploading}
                className="text-sm gap-2 px-4 py-2 bg-[#3F74FF] text-white rounded-xl transition-colors w-full sm:w-auto flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload Document"}
              </button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              multiple 
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.txt"
            />
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveSection("general")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeSection === "general" 
                ? "text-white border-b-2 border-[#3F74FF]" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            General Documents
          </button>
          <button
            onClick={() => setActiveSection("medicalHistory")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeSection === "medicalHistory" 
                ? "text-white border-b-2 border-[#3F74FF]" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            Medical History
          </button>
        </div>

        {displayDocuments.length === 0 && (
          <div className="bg-[#141414] mx-4 mb-4 p-4 rounded-xl">
            <h4 className="text-white font-medium mb-2">Document Categories:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              {documentCategories.map((category) => (
                <div key={category.id} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-current ${category.color}`}></div>
                  <span className="text-gray-400">{category.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          {isUploading && (
            <div className="bg-[#141414] p-4 rounded-xl mb-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-md flex items-center justify-center">
                  <FilePlus className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-gray-700 rounded-md"></div>
                  <div className="w-8 h-8 bg-gray-700 rounded-md"></div>
                  <div className="w-8 h-8 bg-gray-700 rounded-md"></div>
                </div>
              </div>
            </div>
          )}

          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-[#141414] p-6 rounded-xl">
                <File className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">
                  {activeSection === "general" 
                    ? `No documents uploaded yet for ${lead.firstName} ${lead.surname}`
                    : "No assessments created yet"
                  }
                </p>
                {activeSection === "general" ? (
                  <button
                    onClick={handleUploadClick}
                    className="flex items-center gap-2 px-4 py-2 bg-[#F27A30] text-white rounded-xl hover:bg-[#e06b21] transition-colors mx-auto"
                  >
                    <Upload className="w-4 h-4" />
                    Upload First Document
                  </button>
                ) : (
                  <button
                    onClick={handleCreateAssessment}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Create First Assessment
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="bg-[#141414] p-4 rounded-xl hover:bg-[#1a1a1a] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-[#2a2a2a] rounded-md flex items-center justify-center">
                        {getDocumentIcon(doc.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        {editingDocId === doc.id ? (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="flex-1 flex items-center bg-black text-white px-2 py-1 rounded border border-gray-700 w-full">
                              <input
                                type="text"
                                value={newDocName}
                                onChange={(e) => setNewDocName(e.target.value)}
                                className="bg-transparent border-none outline-none flex-1 w-full"
                                autoFocus
                              />
                              <span className="text-gray-500">.{doc.type}</span>
                            </div>
                            <div className="flex gap-2 mt-2 sm:mt-0">
                              <button
                                onClick={() => saveDocName(doc.id)}
                                className="px-2 py-1 bg-blue-500 text-white rounded flex-1 sm:flex-none"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingDocId(null)}
                                className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 flex-1 sm:flex-none"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                              <p className="text-white font-medium truncate">{doc.name}</p>
                              {doc.section === "assessment" && doc.signed && (
                                <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded-full flex items-center gap-1">
                                  <Check size={10} />
                                  Signed
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400">
                              {doc.size} • Uploaded on {doc.uploadDate}
                              {doc.section === "medicalHistory" && (
                                <span className="ml-2">
                                  • {Object.keys(doc.answers || {}).length} answers
                                </span>
                              )}
                            </p>
                            
                            {/* Tags display */}
                            {doc.tags && doc.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {doc.tags.map(tagId => {
                                  const tag = configuredTags.find(t => t.id === tagId)
                                  return tag ? (
                                    <button
                                      key={tagId}
                                      onClick={() => toggleDocumentTag(doc.id, tagId)}
                                      className="px-2 py-0.5 rounded-md text-xs flex items-center gap-1 text-white hover:opacity-80 transition-opacity cursor-pointer"
                                      style={{ backgroundColor: tag.color }}
                                      title="Click to remove tag"
                                    >
                                      <Tag size={10} />
                                      {tag.name}
                                      <X size={10} className="ml-1" />
                                    </button>
                                  ) : null
                                })}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    {editingDocId !== doc.id && (
                      <div className="flex gap-2 mt-3 sm:mt-0 justify-end">
                        {/* Tag selector */}
                        <div className="relative" title="Add tag to document">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                toggleDocumentTag(doc.id, e.target.value)
                                e.target.value = ""
                              }
                            }}
                            className="p-2 bg-[#2a2a2a] text-gray-300 rounded-md text-xs border border-gray-700 hover:bg-[#333] hover:border-[#3F74FF] transition-colors cursor-pointer"
                            title="Add tag - click existing tags to remove them"
                          >
                            <option value="">+ Tag</option>
                            {configuredTags.map((tag) => (
                              <option key={tag.id} value={tag.id} disabled={doc.tags?.includes(tag.id)}>
                                {doc.tags?.includes(tag.id) ? `✓ ${tag.name}` : tag.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        {doc.section === "medicalHistory" && (
                          <button
                            onClick={() => handleEditAssessment(doc)}
                            className="p-2 bg-[#2a2a2a] text-orange-400 rounded-md hover:bg-[#333] transition-colors"
                            title="Sign Medical History"
                          >
                            <FileSignature className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleViewDocument(doc)}
                          className="p-2 bg-[#2a2a2a] text-gray-300 rounded-md hover:bg-[#333] transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-2 bg-[#2a2a2a] text-gray-300 rounded-md hover:bg-[#333] transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePrint(doc)}
                          className="p-2 bg-[#2a2a2a] text-gray-300 rounded-md hover:bg-[#333] transition-colors"
                          title="Print"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => startEditing(doc)}
                          className="p-2 bg-[#2a2a2a] text-gray-300 rounded-md hover:bg-[#333] transition-colors"
                          title="Rename"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 bg-[#2a2a2a] text-red-400 rounded-md hover:bg-[#333] transition-colors"
                          title="Delete"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="text-xs text-gray-500">
              <p>Supported formats: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX, TXT</p>
              <p>Maximum file size: 10MB per document</p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#3F74FF] text-sm text-white border border-gray-800 rounded-xl hover:bg-gray-900 transition-colors w-full sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}