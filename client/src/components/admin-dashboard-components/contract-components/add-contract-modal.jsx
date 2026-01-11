/* eslint-disable no-constant-binary-expression */

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { X, FileText, Upload, Eye, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"

const contractTypes = [
  {
    id: "basic",
    name: "Basic",
    duration: "12 months",
    cost: "$29.99",
    billingPeriod: "Monthly",
  },
  {
    id: "premium",
    name: "Premium",
    duration: "12 months",
    cost: "$49.99",
    billingPeriod: "Monthly",
  },
  {
    id: "bronze",
    name: "Bronze",
    duration: "6 months",
    cost: "$19.99",
    billingPeriod: "Monthly",
  },
]

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
  }
`

export function AddContractModal({ onClose, onSave, leadData = null }) {
  // eslint-disable-next-line no-unused-vars
  const [isDigital, setIsDigital] = useState(true)
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
    leadId: "",
    rateType: "",
    signedFile: null,
    // Additional fields for the contract forms
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
  const [filteredLeads, setFilteredLeads] = useState([])

  // Sample leads for demonstration
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

  // Pre-fill data if lead information is available, but still show lead selection first
  useEffect(() => {
    if (leadData) {
      setContractData((prevData) => ({
        ...prevData,
        studioName: leadData.company || "",
        studioOwnerName: `${leadData.firstName} ${leadData.lastName}` || "",
        fullName: `${leadData.firstName} ${leadData.lastName}` || "",
        email: leadData.email || "",
        phone: leadData.phone || "",
        leadId: leadData.id || "",
        rateType: leadData.interestedIn || "",
        vorname: leadData.firstName || "",
        nachname: leadData.lastName || "",
        emailAdresse: leadData.email || "",
        telefonnummer: leadData.phone || "",
      }))
      setSearchTerm(`${leadData.firstName} ${leadData.lastName}`)
      // Don't automatically hide lead selection - user should still see it first
    }
  }, [leadData])

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

  useEffect(() => {
    if (leadData && leadData.id) {
      setContractData((prevData) => ({
        ...prevData,
        studioName: leadData.company || "",
        studioOwnerName: `${leadData.firstName || ''} ${leadData.lastName || ''}`.trim(),
        fullName: `${leadData.firstName || ''} ${leadData.lastName || ''}`.trim(),
        email: leadData.email || "",
        phone: leadData.phone || "",
        leadId: leadData.id || "",
        rateType: leadData.interestedIn || "",
        vorname: leadData.firstName || "",
        nachname: leadData.lastName || "",
        emailAdresse: leadData.email || "",
        telefonnummer: leadData.phone || "",
      }))
      setSearchTerm(`${leadData.firstName || ''} ${leadData.lastName || ''}`.trim())
    }
  }, [leadData])

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const fileType = file.type
      const validTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"]

      if (!validTypes.includes(fileType)) {
        toast.error("Please upload a PDF or image file")
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB")
        return
      }

      toast.loading("Processing document...")

      // Simulate processing delay
      setTimeout(() => {
        setContractData({ ...contractData, signedFile: file })
        toast.dismiss()
        toast.success("Signed contract uploaded successfully")
      }, 1000)
    }
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

  const handleSignatureOption = (withSignature) => {
    setShowSignatureOptions(false)

    if (withSignature) {
      // Generate with signature
      toast.success("Contract generated with digital signature")
      onSave({
        ...contractData,
        isDigital: true,
        status: "Digital signed",
        discount:
          discount.percentage > 0
            ? {
                percentage: discount.percentage,
                duration: discount.isPermanent ? "permanent" : discount.duration,
              }
            : null,
      })
    } else {
      // Generate without signature
      setShowPrintPrompt(true)
    }
  }

  const handlePrintPrompt = (shouldPrint) => {
    setShowPrintPrompt(false)

    if (shouldPrint) {
      // Print the contract
      window.print()
    }

    // Save with analog signed status
    onSave({
      ...contractData,
      isDigital: false,
      status: "Analog signed",
      discount:
        discount.percentage > 0
          ? {
              percentage: discount.percentage,
              duration: discount.isPermanent ? "permanent" : discount.duration,
            }
          : null,
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

  const priceCalculation = calculateFinalPrice()

  return (
    <div className="fixed inset-0 bg-black/50 flex open_sans_font items-center justify-center z-[1000]">
      <style>{printStyles}</style>

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
            <h2 className="text-base open_sans_font_700 text-white">Add Contract</h2>
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

        <div className="px-4 py-3 open_sans_font max-h-[75vh] overflow-y-auto sm:max-h-none sm:overflow-visible">
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

                <div className="text-center">
                  <button
                    onClick={handleProceedWithoutLead}
                    className="text-gray-400 hover:text-white text-sm underline transition-colors"
                  >
                    Proceed without selecting a lead
                  </button>
                </div>
              </div>
            </div>
          ) : showFormView ? (
            <div>
              <div className="space-y-4 mb-4">
              {contractData.leadId && contractData.fullName && (
  <div className="bg-[#101010]/60 p-4 rounded-xl border border-gray-800">
    <h4 className="text-white text-sm font-medium mb-2">Selected Lead</h4>
    <div className="text-sm text-gray-300">
      <p>
        <span className="text-gray-400">Name:</span> {contractData.fullName}
      </p>
      <p>
        <span className="text-gray-400">Email:</span> {contractData.email}
      </p>
      <p>
        <span className="text-gray-400">Phone:</span> {contractData.phone}
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
                    <div className="flex items-end mb-2">
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
                            : `Discount applies for ${discount.duration} billing period${discount.duration > 1 ? "s" : ""}`}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={toggleView}
                className="w-full px-4 py-2 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                Fill out Contract
              </button>
            </div>
          ) : (
            <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
              {isDigital ? (
                <div>
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
                            €42.90/week, unless terminated in writing within the notice period of 1 month before the end
                            of the minimum term & no individual conditions for the subsequent period are agreed in the
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
                      <h1 className="text-black text-xl font-bold mb-4 text-[#8B4513]">SEPA DIRECT DEBIT MANDATE</h1>

                      <p className="text-sm text-gray-700 mb-4">
                        I authorize <span className="font-medium">payments from my account with creditor ID no:</span>{" "}
                        to be collected by direct debit.
                      </p>
                      <p className="text-sm text-gray-700 mb-4">
                        At the same time, I instruct my credit institution to{" "}
                        <span className="font-medium">honor the direct debits drawn on my account.</span>
                      </p>

                      <div className="grid grid-cols-1 gap-4 mb-6">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            First and Last Name (Account Holder)
                          </label>
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
                            <br />I hereby agree to the attached service description & general terms and conditions
                            (GTC), unless otherwise agreed in writing in the "Contract remarks" text field.
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
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <div className="mt-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-200 block pl-1">Upload Signed Contract</label>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          id="contract-file-analog"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="contract-file-analog"
                          className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200 flex items-center justify-center gap-2 cursor-pointer border border-gray-800"
                        >
                          <Upload size={16} />
                          {contractData.signedFile ? contractData.signedFile.name : "Choose file..."}
                        </label>
                      </div>
                      {contractData.signedFile && (
                        <div className="mt-3 bg-[#141414] p-3 rounded-xl">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[#3F74FF]" />
                            <div>
                              <p className="text-white text-sm">{contractData.signedFile.name}</p>
                              <p className="text-xs text-gray-400">
                                {(contractData.signedFile.size / 1024).toFixed(2)} KB • Uploaded just now
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="pt-4 border-t border-gray-800 mt-4">
                <button
                  type="button"
                  onClick={handleGenerateContract}
                  className="w-full px-4 py-2 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <FileText size={16} />
                  Generate Contract
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
