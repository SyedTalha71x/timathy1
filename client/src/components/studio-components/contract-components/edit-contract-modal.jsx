/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { X, Pencil, ChevronDown, ChevronUp } from "lucide-react"
import { useState, useEffect } from "react"
import { contractTypes } from "../../../utils/studio-states/contract-states"
import { toast } from "react-hot-toast"

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

export function EditContractModal({ onClose, onSave, contract }) {
  // Parse name from contract
  const parseNameFromContract = () => {
    if (!contract?.memberName) return { firstName: "", lastName: "" }
    const nameParts = contract.memberName.split(" ")
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || ""
    return { firstName, lastName }
  }

  const { firstName, lastName } = parseNameFromContract()

  const [currentPage, setCurrentPage] = useState(0)
  const [showFormView, setShowFormView] = useState(true) // Start with settings view
  const [contractData, setContractData] = useState({
    fullName: contract?.memberName || "",
    studioName: "",
    studioOwnerName: contract?.memberName || "",
    contractTerm: "",
    iban: contract?.iban || "",
    email: contract?.email || "",
    phone: contract?.phone || "",
    sepaMandate: contract?.sepaMandate || "",
    leadId: contract?.memberId || contract?.id || "",
    rateType: contract?.contractType || "",
    signedFile: null,
    // Additional fields for the contract form
    vorname: firstName,
    nachname: lastName,
    anrede: "",
    strasse: "",
    hausnummer: "",
    plz: "",
    ort: "",
    telefonnummer: contract?.phone || "",
    mobil: "",
    emailAdresse: contract?.email || "",
    geburtsdatum: "",
    mitgliedsnummer: contract?.contractNumber || "",
    tarifMindestlaufzeit: "",
    startbox: "",
    mindestlaufzeit: "",
    preisProWoche: "",
    startDerMitgliedschaft: contract?.startDate || "",
    startDesTrainings: contract?.startDate || "",
    vertragsverlaengerungsdauer: "",
    kuendigungsfrist: "",
    kreditinstitut: "",
    bic: "",
    ort_datum_unterschrift: "",
    acceptTerms: true,
    acceptPrivacy: true,
  })
  
  const [showSignatureOptions, setShowSignatureOptions] = useState(false)
  const [showPrintPrompt, setShowPrintPrompt] = useState(false)
  const [selectedContractType, setSelectedContractType] = useState(null)
  const [discount, setDiscount] = useState({
    percentage: 0,
    duration: "1",
    isPermanent: false,
  })
  // Discount section collapsed by default
  const [isDiscountExpanded, setIsDiscountExpanded] = useState(false)

  const [contractStartDate, setContractStartDate] = useState(contract?.startDate || new Date().toISOString().split('T')[0])
  const [trainingStartDate, setTrainingStartDate] = useState(contract?.startDate || new Date().toISOString().split('T')[0])
  const [contractEndDate, setContractEndDate] = useState(contract?.endDate || "")

  // Calculate final price after discount
  const calculateFinalPrice = () => {
    if (!selectedContractType || discount.percentage <= 0) {
      return null
    }

    const originalPrice = Number.parseFloat(selectedContractType.cost.replace("$", ""))
    const discountAmount = (originalPrice * discount.percentage) / 100
    const finalPrice = originalPrice - discountAmount

    return {
      originalPrice,
      discountAmount,
      finalPrice,
      currency: selectedContractType.cost.charAt(0),
    }
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

  useEffect(() => {
    if (contractStartDate && selectedContractType) {
      const endDate = calculateEndDate(contractStartDate, selectedContractType.duration)
      setContractEndDate(endDate)
    }
  }, [contractStartDate, selectedContractType])

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

  const toggleView = () => {
    setShowFormView(!showFormView)
  }

  const handleGenerateContract = () => {
    setShowSignatureOptions(true)
  }

  const handleSignatureOption = (withSignature) => {
    setShowSignatureOptions(false)
    
    const dataToSave = {
      ...contract,
      ...contractData,
      contractStartDate,
      contractEndDate,
      trainingStartDate,
      startDerMitgliedschaft: contractStartDate,
      startDesTrainings: trainingStartDate,
      startDate: contractStartDate,
      endDate: contractEndDate,
      contractType: contractData.rateType,
    }
    
    if (withSignature) {
      toast.success("Contract updated with digital signature")
      onSave({
        ...dataToSave,
        isDigital: true,
        status: "Active",
        discount: discount.percentage > 0 ? {
          percentage: discount.percentage,
          duration: discount.isPermanent ? "permanent" : discount.duration,
        } : null,
      })
      onClose()
    } else {
      setShowPrintPrompt(true)
    }
  }

  const handlePrintPrompt = (shouldPrint) => {
    setShowPrintPrompt(false)
    
    const dataToSave = {
      ...contract,
      ...contractData,
      contractStartDate,
      contractEndDate,
      trainingStartDate,
      startDerMitgliedschaft: contractStartDate,
      startDesTrainings: trainingStartDate,
      startDate: contractStartDate,
      endDate: contractEndDate,
      contractType: contractData.rateType,
    }
    
    if (shouldPrint) {
      window.print()
    }
    
    toast.success("Contract updated successfully")
    onSave({
      ...dataToSave,
      isDigital: false,
      status: "Active",
      discount: discount.percentage > 0 ? {
        percentage: discount.percentage,
        duration: discount.isPermanent ? "permanent" : discount.duration,
      } : null,
    })
    onClose()
  }

  const nextPage = () => {
    setCurrentPage(1)
  }

  const prevPage = () => {
    setCurrentPage(0)
  }

  const priceCalculation = calculateFinalPrice()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] font-sans">
      <style>{printStyles}</style>

      {/* Signature Options Modal */}
      {showSignatureOptions && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-[1001]">
          <div className="bg-[#181818] p-6 rounded-2xl max-w-md w-full mx-4">
            <h3 className="text-white text-lg font-semibold mb-4">Contract Signature Options</h3>
            <p className="text-gray-300 mb-6">How would you like the contract to be signed?</p>
            <div className="space-y-3">
              <button
                onClick={() => handleSignatureOption(true)}
                className="w-full py-3 bg-[#3F74FF] text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
              >
                Digital Signature
              </button>
              <button
                onClick={() => handleSignatureOption(false)}
                className="w-full py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
              >
                Print & Sign Manually
              </button>
              <button
                onClick={() => setShowSignatureOptions(false)}
                className="w-full py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Prompt Modal */}
      {showPrintPrompt && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-[1001]">
          <div className="bg-[#181818] p-6 rounded-2xl max-w-md w-full mx-4">
            <h3 className="text-white text-lg font-semibold mb-4">Print Contract</h3>
            <p className="text-gray-300 mb-6">Would you like to print the contract now?</p>
            <div className="space-y-3">
              <button
                onClick={() => handlePrintPrompt(true)}
                className="w-full py-3 bg-[#3F74FF] text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
              >
                Yes, Print Now
              </button>
              <button
                onClick={() => handlePrintPrompt(false)}
                className="w-full py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
              >
                Save Without Printing
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#181818] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <h2 className="text-white text-lg font-semibold">Edit Contract</h2>
            <span className="text-xs bg-gray-600 text-white px-2 py-0.5 rounded-full">
              Ongoing
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-130px)] p-4">
          {showFormView ? (
            // Settings View - EXACT SAME ORDER AS ADD-CONTRACT-MODAL
            <div>
              <div className="space-y-4 mb-4">
                {/* 1. Lead Info Header */}
                <div className="bg-[#101010]/60 p-4 rounded-xl border border-gray-800">
                  <h4 className="text-white text-sm font-medium mb-2">Lead</h4>
                  <div className="text-sm text-gray-300">
                    <p>
                      <span className="text-gray-400">Name:</span> {contractData.fullName || "Unknown"}
                    </p>
                    {contractData.email && (
                      <p>
                        <span className="text-gray-400">Email:</span> {contractData.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* 2. Rate Type Selection */}
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

                {/* 3. Date Fields - Contract Start + Training Start side by side, then End Date below */}
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
                      <label className="text-xs text-gray-200 block pl-1">Training Start Date</label>
                      <input
                        type="date"
                        value={trainingStartDate}
                        onChange={(e) => setTrainingStartDate(e.target.value)}
                        className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                      />
                    </div>
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

                {/* 4. Contract Details */}
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

                {/* 5. Discount Section - Collapsible, collapsed by default */}
                {contractData.rateType && (
                  <div className="bg-[#101010]/60 rounded-xl border border-gray-800 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setIsDiscountExpanded(!isDiscountExpanded)}
                      className="w-full p-4 flex items-center justify-between text-white hover:bg-[#1a1a1a] transition-colors"
                    >
                      <h4 className="text-sm font-medium">Discount</h4>
                      {isDiscountExpanded ? (
                        <ChevronUp size={16} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-400" />
                      )}
                    </button>
                    
                    {isDiscountExpanded && (
                      <div className="px-4 pb-4">
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
                                  : `Discount applies for ${discount.duration} billing period${discount.duration > 1 ? "s" : ""}`}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 6. Fill out Contract Button */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={toggleView}
                  disabled={!contractData.rateType}
                  className={`w-full px-4 py-2 text-sm font-medium rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 ${contractData.rateType
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  <Pencil size={16} /> Review & Sign
                </button>
              </div>
            </div>
          ) : (
            // Contract Form View - SAME AS ADD-CONTRACT-MODAL
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
                        <label className="block text-xs text-gray-600 mb-1">Email</label>
                        <input
                          type="email"
                          name="emailAdresse"
                          value={contractData.emailAdresse}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded p-2 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Date of Birth</label>
                        <input
                          type="date"
                          name="geburtsdatum"
                          value={contractData.geburtsdatum}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded p-2 text-black"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Membership Details */}
                  <div className="mb-6">
                    <h2 className="text-gray-700 font-semibold mb-2 uppercase text-sm tracking-wide">
                      MEMBERSHIP DETAILS
                    </h2>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Membership Number</label>
                          <input
                            type="text"
                            name="mitgliedsnummer"
                            value={contractData.mitgliedsnummer}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Tariff / Minimum Term</label>
                          <input
                            type="text"
                            name="tarifMindestlaufzeit"
                            value={contractData.tarifMindestlaufzeit || selectedContractType?.name || ""}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Startbox</label>
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
                            value={contractData.mindestlaufzeit || selectedContractType?.duration || ""}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Price per Week</label>
                          <input
                            type="text"
                            name="preisProWoche"
                            value={contractData.preisProWoche || selectedContractType?.cost || ""}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Membership Start</label>
                          <input
                            type="date"
                            name="startDerMitgliedschaft"
                            value={contractStartDate}
                            readOnly
                            className="w-full border border-gray-300 rounded p-2 text-black bg-gray-100"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Training Start</label>
                          <input
                            type="date"
                            name="startDesTrainings"
                            value={trainingStartDate}
                            readOnly
                            className="w-full border border-gray-300 rounded p-2 text-black bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Contract Extension Period</label>
                          <input
                            type="text"
                            name="vertragsverlaengerungsdauer"
                            value={contractData.vertragsverlaengerungsdauer}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Cancellation Period</label>
                        <input
                          type="text"
                          name="kuendigungsfrist"
                          value={contractData.kuendigungsfrist}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded p-2 text-black"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="mb-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
                    <p>The provider's terms and conditions apply, namely:</p>
                    <p className="mt-2">
                      After the minimum term expires, the contract will continue indefinitely at a price of
                      €42.90/week, unless terminated in writing within the notice period of 1 month before the end of
                      the minimum term & no individual conditions for the subsequent period are agreed in the
                      "Contract remarks" text field.
                    </p>
                  </div>

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
                  <h1 className="text-black text-xl font-bold mb-4">SEPA DIRECT DEBIT MANDATE</h1>
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
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-sm text-white rounded-xl hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          {!showFormView && (
            <button
              onClick={toggleView}
              className="px-4 py-2 bg-orange-500 text-sm text-white rounded-xl hover:bg-orange-600 transition-colors"
            >
              Back to Settings
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
