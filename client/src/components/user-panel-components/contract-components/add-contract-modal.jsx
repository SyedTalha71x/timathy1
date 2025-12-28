/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { X, FileText, Eye, ArrowLeft, BookOpen } from "lucide-react"
import { useState, useEffect } from "react"
import { contractTypes, mediaTemplates } from "../../../utils/user-panel-states/contract-states"

// Add print-specific styles
const printStyles = `
  @media print {
    body * {
      visibility: hidden;
    }
    .bg-white, .bg-white * {
      visibility: visible;
    }
    .bg-white {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
    button, .fixed {
      display: none !important;
    }
  }`

export default function AddContractModal({ onClose, onSave, leadData = null }) {
  const [currentPage, setCurrentPage] = useState(0)
  const [showLeadSelection, setShowLeadSelection] = useState(true)
  const [contractData, setContractData] = useState({
    fullName: "",
    studioName: "",
    studioOwnerName: "",
    contractTerm: "",
    iban: "",
    email: "",
    phone: "",
    sepaMandate: "",
    leadId: "", // Initialize leadId as empty
    rateType: "",
    signedFile: null,
    // Additional fields for the contract form
    vorname: "",
    nachname: "",
    anrede: "",
    strasse: "",
    hausnummer: "",
    plz: "",
    ort: "",
    telefonnummer: "",
    mobil: "",
    emailAdresse: "",
    geburtsdatum: "",
    mitgliedsnummer: "",
    tarifMindestlaufzeit: "",
    startbox: "",
    mindestlaufzeit: "",
    preisProWoche: "",
    startDerMitgliedschaft: "",
    startDesTrainings: "",
    vertragsverlaengerungsdauer: "",
    kuendigungsfrist: "",
    kreditinstitut: "",
    bic: "",
    ort_datum_unterschrift: "",
    acceptTerms: true,
    acceptPrivacy: true,
  })
  const [showFormView, setShowFormView] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showSignatureOptions, setShowSignatureOptions] = useState(false)
  const [showPrintPrompt, setShowPrintPrompt] = useState(false)
  const [selectedContractType, setSelectedContractType] = useState(null)
  const [discount, setDiscount] = useState({
    percentage: 0,
    duration: "1",
    isPermanent: false,
  })

  const [contractStartDate, setContractStartDate] = useState(new Date().toISOString().split('T')[0])
  const [trainingStartDate, setTrainingStartDate] = useState(new Date().toISOString().split('T')[0])
  const [contractEndDate, setContractEndDate] = useState("")


  const [filteredLeads, setFilteredLeads] = useState([])
  const [showIntroductoryMaterials, setShowIntroductoryMaterials] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [currentMediaPage, setCurrentMediaPage] = useState(0)

  // Sample leads for demonstration (used if no leadData is provided)
  const sampleLeads = [
    {
      id: "lead-1",
      firstName: "Michael",
      lastName: "Brown",
      email: "michael@example.com",
      phone: "5551234567",
      interestedIn: "Premium",
      company: "Elite Fitness Studio",
    },
    {
      id: "lead-2",
      firstName: "Sarah",
      lastName: "Wilson",
      email: "sarah@example.com",
      phone: "5559876543",
      interestedIn: "Basic",
      company: "Wellness Center Pro",
    },
    {
      id: "lead-3",
      firstName: "John",
      lastName: "Davis",
      email: "john@example.com",
      phone: "5555551234",
      interestedIn: "Bronze",
      company: "FitZone Gym",
    },
  ]

  // Calculate final price after discount
  const calculateFinalPrice = () => {
    if (!selectedContractType || discount.percentage <= 0) {
      return null
    }

    // Extract numeric value from cost string (e.g., "$29.99" -> 29.99)
    const originalPrice = Number.parseFloat(selectedContractType.cost.replace("$", ""))
    const discountAmount = (originalPrice * discount.percentage) / 100
    const finalPrice = originalPrice - discountAmount

    return {
      originalPrice,
      discountAmount,
      finalPrice,
      currency: selectedContractType.cost.charAt(0), // Get currency symbol
    }
  }

  useEffect(() => {
    if (contractStartDate && selectedContractType) {
      const endDate = calculateEndDate(contractStartDate, selectedContractType.duration)
      setContractEndDate(endDate)
    }
  }, [contractStartDate, selectedContractType])

  // Filter leads based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredLeads([])
    } else {
      const filtered = sampleLeads.filter(
        (lead) =>
          `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.company.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredLeads(filtered)
    }
  }, [searchTerm])

  // Update selected contract type when rate type changes
  useEffect(() => {
    const contractType = contractTypes.find((type) => type.name === contractData.rateType)
    setSelectedContractType(contractType)
  }, [contractData.rateType])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setContractData({
      ...contractData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleDiscountChange = (e) => {
    const { name, value, type, checked } = e.target
    setDiscount({
      ...discount,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleLeadSelect = (lead) => {
    setContractData({
      ...contractData,
      leadId: lead.id,
      studioName: lead.company,
      studioOwnerName: `${lead.firstName} ${lead.lastName}`,
      fullName: `${lead.firstName} ${lead.lastName}`,
      email: lead.email,
      phone: lead.phone,
      vorname: lead.firstName,
      nachname: lead.lastName,
      emailAdresse: lead.email,
      telefonnummer: lead.phone,
      rateType: lead.interestedIn,
    })
    setSearchTerm(`${lead.firstName} ${lead.lastName}`)
    setFilteredLeads([])
    setShowLeadSelection(false)
  }

  const handleProceedWithoutLead = () => {
    setContractData((prev) => ({ ...prev, leadId: "" })) // Clear leadId when proceeding without a lead
    setShowLeadSelection(false)
  }

  const handleBackToLeadSelection = () => {
    setShowLeadSelection(true)
    setSearchTerm("")
    setFilteredLeads([])
  }

  const handleGenerateContract = () => {
    setShowSignatureOptions(true)
  }

  const calculateEndDate = (startDate, durationString) => {
    if (!startDate || !durationString) return ""

    const start = new Date(startDate)
    const end = new Date(start)

    const monthsMatch = durationString.match(/(\d+)\s*months?/i)
    const months = monthsMatch ? parseInt(monthsMatch[1], 10) : 12

    end.setMonth(end.getMonth() + months)
    return end.toISOString().split('T')[0]
  }

  const handleSignatureOption = (withSignature) => {
    setShowSignatureOptions(false)
    
    const dataToSave = {
      ...contractData,
      contractStartDate,
      contractEndDate,
      trainingStartDate,
      startDerMitgliedschaft: contractStartDate,
      startDesTrainings: trainingStartDate,
    }
    
    if (withSignature) {
      alert("Contract generated with digital signature")
      onSave({
        ...dataToSave,
        isDigital: true,
        status: "Digital signed",
        discount: discount.percentage > 0 ? {
          percentage: discount.percentage,
          duration: discount.isPermanent ? "permanent" : discount.duration,
        } : null,
      })
    } else {
      setShowPrintPrompt(true)
    }
  }

  const handlePrintPrompt = (shouldPrint) => {
    setShowPrintPrompt(false)
    
    const dataToSave = {
      ...contractData,
      contractStartDate,
      contractEndDate,
      trainingStartDate,
      startDerMitgliedschaft: contractStartDate,
      startDesTrainings: trainingStartDate,
    }
    
    if (shouldPrint) {
      window.print()
    }
    
    onSave({
      ...dataToSave,
      isDigital: false,
      status: "Analog signed",
      discount: discount.percentage > 0 ? {
        percentage: discount.percentage,
        duration: discount.isPermanent ? "permanent" : discount.duration,
      } : null,
    })
  }

  const toggleView = () => {
    setShowFormView(!showFormView)
  }

  const nextPage = () => {
    setCurrentPage(1)
  }

  const prevPage = () => {
    setCurrentPage(0)
  }

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
    setCurrentMediaPage(0)
  }

  const nextMediaPage = () => {
    if (selectedTemplate && currentMediaPage < selectedTemplate.pages.length - 1) {
      setCurrentMediaPage(currentMediaPage + 1)
    }
  }

  const prevMediaPage = () => {
    if (currentMediaPage > 0) {
      setCurrentMediaPage(currentMediaPage - 1)
    }
  }

  const priceCalculation = calculateFinalPrice()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] font-sans">
      <style>{printStyles}</style>

      {showIntroductoryMaterials && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-[1001]">
          <div className="relative bg-[#181818] p-6 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Close button */}
            <button
              onClick={() => setShowIntroductoryMaterials(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
            >
              <X size={20} />
            </button>

            {!selectedTemplate ? (
              // Template Selection View
              <div>
                <h3 className="text-white text-lg font-semibold mb-4">Select Media Template</h3>
                <p className="text-gray-300 mb-6">Choose a template for your introductory materials</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                  {mediaTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="bg-[#101010] p-4 rounded-xl border border-gray-800 hover:border-[#3F74FF] cursor-pointer transition-colors"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <h4 className="text-white font-medium mb-2">{template.name}</h4>
                      <p className="text-gray-400 text-sm mb-3">{template.description}</p>
                      <div className="text-xs text-gray-500">
                        {template.pages.length} page{template.pages.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Media Presentation View
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white text-lg font-semibold">{selectedTemplate.name}</h3>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="text-gray-400 hover:text-white text-sm flex items-center gap-1"
                  >
                    <ArrowLeft size={16} />
                    Back to Templates
                  </button>
                </div>

                {/* PowerPoint-like Presentation */}
                <div className="flex-1 bg-white rounded-lg overflow-hidden flex flex-col">
                  {/* Presentation Header */}
                  <div className="bg-gray-100 px-6 py-3 border-b flex justify-between items-center">
                    <div className="text-gray-700 font-medium">
                      Page {currentMediaPage + 1} of {selectedTemplate.pages.length}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={prevMediaPage}
                        disabled={currentMediaPage === 0}
                        className={`px-3 py-1 rounded text-sm ${currentMediaPage === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-600 text-white hover:bg-gray-700'
                          }`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={nextMediaPage}
                        disabled={currentMediaPage === selectedTemplate.pages.length - 1}
                        className={`px-3 py-1 rounded text-sm ${currentMediaPage === selectedTemplate.pages.length - 1
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-600 text-white hover:bg-gray-700'
                          }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>

                  {/* Presentation Content */}
                  <div className="flex-1 p-8 flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                      {selectedTemplate.pages[currentMediaPage].title}
                    </h2>
                    <p className="text-gray-600 mb-6 text-center max-w-2xl">
                      {selectedTemplate.pages[currentMediaPage].content}
                    </p>

                    {/* Media Display Area */}
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 w-full max-w-2xl text-center">
                      <div className="text-gray-500 mb-4">
                        Media content would be displayed here
                      </div>
                      <div className="text-sm text-gray-400">
                        Available media: {selectedTemplate.pages[currentMediaPage].media.join(', ')}
                      </div>

                      {/* Example clickable links */}
                      <div className="mt-6 flex flex-wrap gap-3 justify-center">
                        {selectedTemplate.pages[currentMediaPage].media.map((media, index) => (
                          <a
                            key={index}
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              alert(`Opening: ${media}`);
                            }}
                            className="px-4 py-2 bg-[#3F74FF] text-white rounded-lg text-sm hover:bg-[#3F74FF]/90 transition-colors"
                          >
                            Open {media.split('.').pop().toUpperCase()}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Page Navigation Dots */}
                  <div className="bg-gray-100 px-6 py-3 border-t flex justify-center gap-2">
                    {selectedTemplate.pages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentMediaPage(index)}
                        className={`w-3 h-3 rounded-full ${index === currentMediaPage ? 'bg-[#3F74FF]' : 'bg-gray-400'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showSignatureOptions && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-[1001]">
          <div className="relative bg-[#181818] p-6 rounded-2xl max-w-md w-full">
            {/* Close button */}
            <button
              onClick={() => setShowSignatureOptions(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-white text-lg font-semibold mb-4">Generate Contract</h3>
            <p className="text-gray-300 mb-6">How would you like to generate this contract?</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleSignatureOption(true)}
                className="w-full px-4 text-sm py-3 bg-[#3F74FF] text-white rounded-xl hover:bg-[#3F74FF]/90"
              >
                With Digital Signature
              </button>
              <button
                onClick={() => handleSignatureOption(false)}
                className="w-full px-4 text-sm py-3 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#3a3a3a]"
              >
                Without Signature
              </button>
            </div>
          </div>
        </div>
      )}

      {showPrintPrompt && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-[1001]">
          <div className="bg-[#181818] p-6 rounded-2xl max-w-md w-full">
            <h3 className="text-white text-lg font-semibold mb-4">Print Contract</h3>
            <p className="text-gray-300 mb-6">Would you like to print this contract?</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handlePrintPrompt(true)}
                className="w-full px-4 py-3 text-sm bg-[#3F74FF] text-white rounded-xl hover:bg-[#3F74FF]/90"
              >
                Yes, Print Contract
              </button>
              <button
                onClick={() => handlePrintPrompt(false)}
                className="w-full px-4 py-3 text-sm bg-[#2F2F2F] text-white rounded-xl hover:bg-[#3a3a3a]"
              >
                No, Skip Printing
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#181818] p-3 w-full max-w-3xl mx-4 rounded-2xl">
        <div className="px-4 py-3 border-b border-gray-800 custom-scrollbar max-h-[10vh] sm:max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">

              <h2 className="text-base font-bold text-white">Add Contract</h2>
              {/* Introductory Materials Icon */}
              <button
                type="button"
                onClick={() => setShowIntroductoryMaterials(true)}
                className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#3a3a3a] transition-colors duration-200 flex items-center justify-center gap-2"
                title="Open Introductory Materials"
              >
                <BookOpen size={16} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              {!showLeadSelection && !showFormView && (
                <button
                  onClick={toggleView}
                  className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-gray-800 rounded-xl flex items-center gap-1"
                >
                  <ArrowLeft size={16} />
                  <span className="text-xs">Form View</span>
                </button>
              )}
              {!showLeadSelection && (
                <button
                  onClick={handleBackToLeadSelection}
                  className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-gray-800 rounded-xl flex items-center gap-1"
                >
                  <ArrowLeft size={16} />
                  <span className="text-xs">Back to Lead Selection</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-gray-800 rounded-xl"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 max-h-[75vh] overflow-y-auto sm:max-h-none sm:overflow-visible">
          {showLeadSelection ? (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-white text-lg font-semibold mb-2">Select Lead</h3>
                <p className="text-gray-400 text-sm">Search for an existing lead or proceed without selecting one</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-200 block pl-1">Lead</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for lead..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                    />
                    {filteredLeads.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-[#101010] mt-1 rounded-xl z-10 shadow-lg max-h-40 overflow-y-auto border border-gray-700">
                        {filteredLeads.map((lead) => (
                          <div
                            key={lead.id}
                            className="p-3 hover:bg-[#1a1a1a] text-white cursor-pointer border-b border-gray-800 last:border-b-0"
                            onClick={() => handleLeadSelect(lead)}
                          >
                            <div className="font-medium">
                              {lead.firstName} {lead.lastName}
                            </div>
                            <div className="text-sm text-gray-400">{lead.email}</div>
                            <div className="text-xs text-gray-500">
                              {lead.company} • Interested in: {lead.interestedIn}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-center">
                <button
                  onClick={handleProceedWithoutLead}
                  className="text-gray-400 hover:text-white text-sm underline transition-colors"
                >
                  Proceed without selecting a lead
                </button>
              </div>
            </div>
          ) : showFormView ? (
            <div>
              <div className="space-y-4 mb-4">
                {contractData.leadId && ( // Only render if a lead is selected
                  <div className="bg-[#101010]/60 p-4 rounded-xl border border-gray-800">
                    <h4 className="text-white text-sm font-medium mb-2">Selected Lead</h4>
                    <div className="text-sm text-gray-300">
                      <p>
                        <span className="text-gray-400">Name:</span> {contractData.fullName}
                      </p>
                    </div>
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-200 block pl-1">Rate Type</label>
                  <select
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200 appearance-none"
                    name="rateType"
                    value={contractData.rateType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select rate type</option>
                    {contractTypes.map((type) => (
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-200 block pl-1">Contract Start Date</label>
                      <input
                        type="date"
                        value={contractStartDate}
                        onChange={(e) => setContractStartDate(e.target.value)}
                        className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-200 block pl-1">
                        Contract End Date ({selectedContractType?.duration || '12 months'})
                      </label>
                      <input
                        type="text"
                        value={contractEndDate}
                        readOnly
                        className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-gray-400 outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-200 block pl-1">Training Start Date</label>
                    <input
                      type="date"
                      value={trainingStartDate}
                      onChange={(e) => setTrainingStartDate(e.target.value)}
                      className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                    />
                  </div>
                </div>

                {selectedContractType && (
                  <div className="bg-[#101010]/60 p-4 rounded-xl border border-gray-800">
                    <h4 className="text-white text-sm font-medium mb-2">Contract Details</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="block text-gray-400 text-xs">Duration</span>
                        <span className="text-white">{selectedContractType.duration}</span>
                      </div>
                      <div>
                        <span className="block text-gray-400 text-xs">Cost</span>
                        <span className="text-white">{selectedContractType.cost}</span>
                      </div>
                      <div>
                        <span className="block text-gray-400 text-xs">Billing Period</span>
                        <span className="text-white">{selectedContractType.billingPeriod}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Discount Section - Only show when rate type is selected */}
                {contractData.rateType && (
                  <div className="bg-[#101010]/60 p-4 rounded-xl border border-gray-800">
                    <h4 className="text-white text-sm font-medium mb-2">Discount</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-400 text-xs mb-1">Percentage (%)</label>
                        <input
                          type="number"
                          name="percentage"
                          min="0"
                          max="100"
                          value={discount.percentage}
                          onChange={handleDiscountChange}
                          className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                        />
                      </div>
                      <div className={discount.isPermanent ? "opacity-50" : ""}>
                        <label className="block text-gray-400 text-xs mb-1">Billing Periods</label>
                        <input
                          type="number"
                          name="duration"
                          min="1"
                          value={discount.duration}
                          onChange={handleDiscountChange}
                          disabled={discount.isPermanent}
                          className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                        />
                      </div>
                      <div>
                        {/* Empty label to align vertically with other input labels */}
                        <label className="block text-gray-400 mt-7 text-xs mb-1"></label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="isPermanent"
                            checked={discount.isPermanent}
                            onChange={handleDiscountChange}
                            className="form-checkbox h-5 w-5 text-[#3F74FF] rounded border-gray-800 focus:ring-[#3F74FF]"
                          />
                          <span className="text-gray-400 text-xs">Till End of Contract</span>
                        </label>
                      </div>
                    </div>
                    {/* Final Price Display */}
                    {priceCalculation && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <h5 className="text-white text-sm font-medium mb-2">Price Calculation</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Original Price:</span>
                            <span className="text-white">
                              {priceCalculation.currency}
                              {priceCalculation.originalPrice.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Discount ({discount.percentage}%):</span>
                            <span className="text-red-400">
                              -{priceCalculation.currency}
                              {priceCalculation.discountAmount.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between border-t border-gray-700 pt-2">
                            <span className="text-white font-medium">Final Price:</span>
                            <span className="text-green-400 font-medium">
                              {priceCalculation.currency}
                              {priceCalculation.finalPrice.toFixed(2)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {discount.isPermanent
                              ? "Discount applies for the entire contract duration"
                              : `Discount applies for ${discount.duration} billing period${discount.duration > 1 ? "s" : ""
                              }`}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={toggleView}
                  disabled={!contractData.rateType}
                  className={`w-full px-4 py-2 text-sm font-medium rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 ${contractData.rateType
                      ? "bg-[#3F74FF] text-white hover:bg-[#3F74FF]/90"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  <Eye size={16} /> Fill out Contract
                </button>


              </div>
            </div>
          ) : (
            <div className="max-h-[70vh] overflow-y-auto">
              {currentPage === 0 ? (
                <div className="bg-white rounded-lg p-6 relative font-sans">
                  <div className="flex justify-between items-start mb-6">
                    <h1 className="text-black text-2xl font-bold">Studio Contract</h1>
                    <div className="bg-gray-700 text-white p-4 w-40 h-20 flex items-center justify-center">
                      <span className="text-2xl font-bold">LOGO</span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <h2 className="text-gray-700 font-semibold mb-2 uppercase text-sm tracking-wide">
                      STUDIO INFORMATION
                    </h2>
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Studio Name</label>
                        <input
                          type="text"
                          name="studioName"
                          value={contractData.studioName}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded p-2 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Studio Owner Name</label>
                        <input
                          type="text"
                          name="studioOwnerName"
                          value={contractData.studioOwnerName}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded p-2 text-black"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Title</label>
                          <input
                            type="text"
                            name="anrede"
                            value={contractData.anrede}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">First Name</label>
                          <input
                            type="text"
                            name="vorname"
                            value={contractData.vorname}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Last Name</label>
                          <input
                            type="text"
                            name="nachname"
                            value={contractData.nachname}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-600 mb-1">Street</label>
                          <input
                            type="text"
                            name="strasse"
                            value={contractData.strasse}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">House Number</label>
                          <input
                            type="text"
                            name="hausnummer"
                            value={contractData.hausnummer}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Postal Code</label>
                          <input
                            type="text"
                            name="plz"
                            value={contractData.plz}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-600 mb-1">City</label>
                          <input
                            type="text"
                            name="ort"
                            value={contractData.ort}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Phone</label>
                        <input
                          type="tel"
                          name="telefonnummer"
                          value={contractData.telefonnummer}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded p-2 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Mobile</label>
                        <input
                          type="tel"
                          name="mobil"
                          value={contractData.mobil}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded p-2 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Email Address</label>
                        <input
                          type="email"
                          name="emailAdresse"
                          value={contractData.emailAdresse}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded p-2 text-black"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <h2 className="text-gray-700 font-semibold mb-2 uppercase text-sm tracking-wide">
                      CONTRACT DETAILS
                    </h2>
                    <p className="text-sm text-gray-700 mb-2">I have chosen the following plan:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Plan Minimum Term</label>
                          <input
                            type="text"
                            name="tarifMindestlaufzeit"
                            value={contractData.tarifMindestlaufzeit}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Price per Week (€)</label>
                          <input
                            type="text"
                            name="preisProWoche"
                            value={contractData.preisProWoche}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Starter Box</label>
                          <input
                            type="text"
                            name="startbox"
                            value={contractData.startbox}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Minimum Term</label>
                          <input
                            type="text"
                            name="mindestlaufzeit"
                            value={contractData.mindestlaufzeit}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Contract Start (Monday)</label>
                          <input
                            type="date"
                            name="startDerMitgliedschaft"
                            value={contractData.startDerMitgliedschaft}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Service Start</label>
                          <input
                            type="date"
                            name="startDesTrainings"
                            value={contractData.startDesTrainings}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Contract Extension Period</label>
                          <input
                            type="text"
                            name="vertragsverlaengerungsdauer"
                            value={contractData.vertragsverlaengerungsdauer}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                            placeholder="1 Week"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Notice Period</label>
                          <input
                            type="text"
                            name="kuendigungsfrist"
                            value={contractData.kuendigungsfrist}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                            placeholder="1 Month"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-700">
                      <p>The provider's terms and conditions apply, namely:</p>
                      <p className="mt-2">
                        After the minimum term expires, the contract will continue indefinitely at a price of
                        €42.90/week, unless terminated in writing within the notice period of 1 month before the end of
                        the minimum term & no individual conditions for the subsequent period are agreed in the
                        "Contract remarks" text field.
                      </p>
                    </div>
                  </div>
                  <div className="mb-6">
                    <h2 className="text-gray-700 font-semibold mb-2 uppercase text-sm tracking-wide">
                      FEE ADJUSTMENTS
                    </h2>
                    <div className="grid grid-cols-3 gap-2">
                      <input type="text" className="w-full border border-gray-300 rounded p-2 text-black" />
                      <input type="text" className="w-full border border-gray-300 rounded p-2 text-black" />
                      <input type="text" className="w-full border border-gray-300 rounded p-2 text-black" />
                    </div>
                  </div>
                  {discount.percentage > 0 && (
                    <div className="mb-6">
                      <h2 className="text-gray-700 font-semibold mb-2 uppercase text-sm tracking-wide">DISCOUNT</h2>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Discount Percentage</label>
                          <input
                            type="text"
                            value={`${discount.percentage}%`}
                            readOnly
                            className="w-full border border-gray-300 rounded p-2 text-black bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Duration</label>
                          <input
                            type="text"
                            value={
                              discount.isPermanent ? "Till End of Contract" : `${discount.duration} Billing Periods`
                            }
                            readOnly
                            className="w-full border border-gray-300 rounded p-2 text-black bg-gray-50"
                          />
                        </div>
                      </div>
                      {/* Final Price in Contract Document */}
                      {priceCalculation && (
                        <div className="bg-gray-50 p-3 rounded border">
                          <h3 className="text-xs text-gray-600 font-semibold mb-2 uppercase">FINAL PRICING</h3>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <span className="block text-xs text-gray-500">Original Price</span>
                              <span className="text-black">
                                {priceCalculation.currency}
                                {priceCalculation.originalPrice.toFixed(2)}
                              </span>
                            </div>
                            <div>
                              <span className="block text-xs text-gray-500">Discount</span>
                              <span className="text-red-600">
                                -{priceCalculation.currency}
                                {priceCalculation.discountAmount.toFixed(2)}
                              </span>
                            </div>
                            <div>
                              <span className="block text-xs text-gray-500">Final Price</span>
                              <span className="text-green-600 font-semibold">
                                {priceCalculation.currency}
                                {priceCalculation.finalPrice.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="mb-6">
                    <div className="border-t border-gray-300 pt-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Place, Date/Signature of Contracting Party
                          </label>
                          <input
                            type="text"
                            name="ort_datum_unterschrift"
                            value={contractData.ort_datum_unterschrift}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">This contract is valid without signature</p>
                          <p className="text-xs text-gray-600">i.A.kom.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={nextPage}
                      className="px-4 py-2 bg-[#3F74FF] text-white rounded-xl text-sm"
                    >
                      Next: SEPA Mandate
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-6 relative font-sans">
                  <h1 className="text-black text-xl font-bold mb-4 ">SEPA DIRECT DEBIT MANDATE</h1>
                  <p className="text-sm text-gray-700 mb-4">
                    I authorize <span className="font-medium">payments from my account with creditor ID no:</span> to be
                    collected by direct debit.
                  </p>
                  <p className="text-sm text-gray-700 mb-4">
                    At the same time, I instruct my credit institution to{" "}
                    <span className="font-medium">honor the direct debits drawn on my account.</span>
                  </p>
                  <div className="grid grid-cols-1 gap-4 mb-6">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">First and Last Name (Account Holder)</label>
                      <input
                        type="text"
                        name="fullName"
                        value={contractData.fullName}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded p-2 text-black"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Credit Institution (Name)</label>
                        <input
                          type="text"
                          name="kreditinstitut"
                          value={contractData.kreditinstitut}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded p-2 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">BIC</label>
                        <input
                          type="text"
                          name="bic"
                          value={contractData.bic}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded p-2 text-black"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">IBAN</label>
                        <input
                          type="text"
                          name="iban"
                          value={contractData.iban}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded p-2 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">SEPA Mandate Reference Number</label>
                        <input
                          type="text"
                          name="sepaMandate"
                          value={contractData.sepaMandate}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded p-2 text-black"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-300 pt-4 mb-4">
                    <div className="mb-8">
                      <label className="block text-xs text-gray-600 mb-1">
                        Place, Date/Signature of Account Holder
                      </label>
                      <div className="border-b border-gray-300 mt-8"></div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="flex items-start mb-4">
                      <input
                        type="checkbox"
                        id="acceptTerms"
                        name="acceptTerms"
                        checked={contractData.acceptTerms}
                        onChange={handleInputChange}
                        className="mt-1 mr-2"
                      />
                      <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                        <span className="font-bold">SERVICE DESCRIPTION & TERMS</span>
                        <br />I hereby agree to the attached service description & general terms and conditions (GTC),
                        unless otherwise agreed in writing in the "Contract remarks" text field.
                      </label>
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="flex items-start mb-4">
                      <input
                        type="checkbox"
                        id="acceptPrivacy"
                        name="acceptPrivacy"
                        checked={contractData.acceptPrivacy}
                        onChange={handleInputChange}
                        className="mt-1 mr-2"
                      />
                      <label htmlFor="acceptPrivacy" className="text-sm text-gray-700">
                        <span className="font-bold">DATA PROTECTION AGREEMENT</span>
                        <br />I hereby consent to the collection and processing of my personal data according to the
                        attached data protection agreement.
                      </label>
                    </div>
                  </div>
                  <div className="border-t border-gray-300 pt-4 mb-4"></div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevPage}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-xl text-sm"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerateContract}
                      className="px-4 py-2 bg-[#3F74FF] text-white rounded-xl text-sm"
                    >
                      Generate Contract
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Removed the Generate Contract button from the footer */}
        </div>
      </div>
    </div>
  )
}