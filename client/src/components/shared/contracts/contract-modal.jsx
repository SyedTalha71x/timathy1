/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { X, FileText, Pencil, ArrowLeft, BookOpen, ChevronDown, ChevronUp, Eye } from "lucide-react"
import { useState, useEffect } from "react"
import { DEFAULT_CONTRACT_TYPES, DEFAULT_INTRODUCTORY_MATERIALS, DEFAULT_CONTRACT_FORMS, studioData } from "../../../utils/studio-states/configuration-states"
import { leadsData } from "../../../utils/studio-states/leads-states"
import { membersData } from "../../../utils/studio-states/members-states"
import IntroMaterialEditorModal from "../../shared/IntroMaterialEditorModal"
import { ContractFormFillModal } from "./ContractFormFillModal"
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

/**
 * Unified Contract Modal - Handles both Add and Edit modes
 * 
 * Props:
 * - onClose: function - Close handler
 * - onSave: function - Save handler
 * - contract: object (optional) - Existing contract data for edit mode
 * - leadData: object (optional) - Pre-selected lead data for add mode
 * 
 * Mode Detection:
 * - If `contract` prop is provided -> Edit Mode
 * - Otherwise -> Add Mode
 */
export function ContractModal({ onClose, onSave, contract = null, leadData = null }) {
  // Mode detection
  const isEditMode = contract !== null
  const isLeadPreSelected = leadData !== null
  const currency = studioData?.currency || "€"

  // Parse name helper
  const parseName = (fullName) => {
    if (!fullName) return { firstName: "", lastName: "" }
    const parts = fullName.split(" ")
    return { firstName: parts[0] || "", lastName: parts.slice(1).join(" ") || "" }
  }

  // Get initial name based on mode
  const getInitialName = () => {
    if (isEditMode && contract?.memberName) {
      return parseName(contract.memberName)
    }
    if (leadData?.name) {
      return parseName(leadData.name)
    }
    if (leadData?.firstName) {
      return { firstName: leadData.firstName, lastName: leadData.lastName || "" }
    }
    return { firstName: "", lastName: "" }
  }

  const { firstName: initialFirstName, lastName: initialLastName } = getInitialName()

  const [currentPage, setCurrentPage] = useState(0)
  const [showLeadSelection, setShowLeadSelection] = useState(!isEditMode && !isLeadPreSelected)
  const [showFormView, setShowFormView] = useState(true)
  const [contractData, setContractData] = useState({
    fullName: isEditMode ? (contract?.memberName || "") : (leadData?.name || `${initialFirstName} ${initialLastName}`.trim()),
    studioName: leadData?.company || "",
    studioOwnerName: isEditMode ? (contract?.memberName || "") : "",
    contractTerm: "",
    iban: isEditMode ? (contract?.iban || "") : "",
    email: isEditMode ? (contract?.email || "") : (leadData?.email || ""),
    phone: isEditMode ? (contract?.phone || "") : (leadData?.phone || leadData?.phoneNumber || ""),
    sepaMandate: isEditMode ? (contract?.sepaMandate || "") : "",
    leadId: isEditMode ? (contract?.memberId || contract?.id || "") : (leadData?.id || ""),
    rateType: isEditMode ? (contract?.contractType || "") : (leadData?.interestedIn || ""),
    signedFile: null,
    // Additional fields for the contract form
    vorname: initialFirstName,
    nachname: initialLastName,
    anrede: "",
    strasse: "",
    plz: "",
    ort: "",
    telefonnummer: isEditMode ? (contract?.phone || "") : (leadData?.phone || leadData?.phoneNumber || ""),
    mobil: "",
    emailAdresse: isEditMode ? (contract?.email || "") : (leadData?.email || ""),
    geburtsdatum: "",
    mitgliedsnummer: isEditMode ? (contract?.contractNumber || "") : "",
    tarifMindestlaufzeit: "",
    startbox: "",
    mindestlaufzeit: "",
    preisProWoche: "",
    startDerMitgliedschaft: isEditMode ? (contract?.startDate || "") : "",
    startDesTrainings: isEditMode ? (contract?.startDate || "") : "",
    vertragsverlaengerungsdauer: "",
    kuendigungsfrist: "",
    kreditinstitut: "",
    bic: "",
    ort_datum_unterschrift: "",
    acceptTerms: true,
    acceptPrivacy: true,
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [filteredResults, setFilteredResults] = useState([])
  const [filteredLeads, setFilteredLeads] = useState([])
  const [showSignatureOptions, setShowSignatureOptions] = useState(false)
  const [showPrintPrompt, setShowPrintPrompt] = useState(false)
  const [selectedContractType, setSelectedContractType] = useState(null)
  
  const [discount, setDiscount] = useState({
    percentage: 0,
    duration: "1",
    isPermanent: false,
  })
  const [isDiscountExpanded, setIsDiscountExpanded] = useState(false)

  const [contractStartDate, setContractStartDate] = useState(new Date().toISOString().split('T')[0])
  const [trainingStartDate, setTrainingStartDate] = useState(new Date().toISOString().split('T')[0])
  const [contractEndDate, setContractEndDate] = useState("")

  const [showIntroductoryMaterials, setShowIntroductoryMaterials] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [showMaterialPreview, setShowMaterialPreview] = useState(false)

  // NEW: Contract Form Fill Modal state
  const [showContractFormFillModal, setShowContractFormFillModal] = useState(false)
  const [filledFormData, setFilledFormData] = useState(null)

  // Initialize with lead data if provided (from leads menu)
  useEffect(() => {
    if (leadData) {
      let firstName = ""
      let lastName = ""
      
      if (leadData.name) {
        const nameParts = leadData.name.split(" ")
        firstName = nameParts[0] || ""
        lastName = nameParts.slice(1).join(" ") || ""
      } else {
        firstName = leadData.firstName || ""
        lastName = leadData.lastName || leadData.surname || ""
      }

      // Map gender to salutation (Herr/Frau), skip "other"
      let salutation = ""
      const gender = (leadData.gender || "").toLowerCase()
      if (gender === "male" || gender === "männlich" || gender === "m") {
        salutation = "Herr"
      } else if (gender === "female" || gender === "weiblich" || gender === "f") {
        salutation = "Frau"
      }

      setContractData((prev) => ({
        ...prev,
        leadId: leadData.id,
        studioName: leadData.company || "",
        studioOwnerName: leadData.name || `${firstName} ${lastName}`.trim(),
        fullName: leadData.name || `${firstName} ${lastName}`.trim(),
        email: leadData.email || "",
        phone: leadData.phone || leadData.phoneNumber || "",
        vorname: firstName,
        nachname: lastName,
        emailAdresse: leadData.email || "",
        telefonnummer: leadData.phone || leadData.phoneNumber || "",
        rateType: leadData.interestedIn || "",
        strasse: leadData.street || "",
        plz: leadData.zipCode || "",
        ort: leadData.city || "",
        anrede: salutation,
        mobil: leadData.mobile || "",
      }))
      setSearchTerm(leadData.name || `${firstName} ${lastName}`.trim())
    }
  }, [leadData])

  // Initialize with contract data for edit mode
  useEffect(() => {
    if (isEditMode && contract) {
      const { firstName, lastName } = parseName(contract.memberName)
      setContractData((prev) => ({
        ...prev,
        fullName: contract.memberName || "",
        email: contract.email || "",
        phone: contract.phone || "",
        vorname: firstName,
        nachname: lastName,
        emailAdresse: contract.email || "",
        telefonnummer: contract.phone || "",
        iban: contract.iban || "",
        sepaMandate: contract.sepaMandate || "",
        rateType: contract.contractType || "",
        mitgliedsnummer: contract.contractNumber || "",
        strasse: contract.address?.street || "",
        plz: contract.address?.zipCode || "",
        ort: contract.address?.city || "",
      }))
      setContractStartDate(contract.startDate || new Date().toISOString().split('T')[0])
      setTrainingStartDate(contract.startDate || new Date().toISOString().split('T')[0])
      
      if (contract.discount) {
        setDiscount({
          percentage: contract.discount.percentage || 0,
          duration: contract.discount.duration === "permanent" ? "1" : (contract.discount.duration || "1"),
          isPermanent: contract.discount.duration === "permanent",
        })
      }
    }
  }, [isEditMode, contract])

  // Calculate final price after discount
  const calculateFinalPrice = () => {
    if (!selectedContractType || discount.percentage <= 0) {
      return null
    }

    const originalPrice = selectedContractType.cost || 0
    const discountAmount = (originalPrice * discount.percentage) / 100
    const finalPrice = originalPrice - discountAmount

    return {
      originalPrice,
      discountAmount,
      finalPrice,
      currency: currency,
    }
  }

  // Calculate end date based on start date and duration
  const calculateEndDate = (startDate, durationString) => {
    if (!startDate || !durationString) return ""

    const start = new Date(startDate)
    const end = new Date(start)

    // Handle both "12 months" string format and number
    let months = 12
    if (typeof durationString === 'string') {
      const monthsMatch = durationString.match(/(\d+)\s*months?/i)
      months = monthsMatch ? parseInt(monthsMatch[1], 10) : 12
    } else if (typeof durationString === 'number') {
      months = durationString
    }

    end.setMonth(end.getMonth() + months)
    return end.toISOString().split('T')[0]
  }

  // Calculate auto-renewal end date based on contract end date and renewal settings
  // Uses existing fields: autoRenewal, renewalIndefinite, renewalPeriod
  // Returns null for unlimited renewal, or a date string for limited renewal
  const calculateAutoRenewalEndDate = (endDate, contractType) => {
    if (!contractType?.autoRenewal) return null
    
    // If renewalIndefinite is true, renewal is unlimited
    if (contractType.renewalIndefinite === true) {
      return null // Unlimited renewal
    }
    
    // If renewalPeriod is set, calculate the maximum end date
    const renewalDuration = contractType.renewalPeriod || contractType.autoRenewalDuration
    if (!renewalDuration || !endDate) return null
    
    const end = new Date(endDate)
    end.setMonth(end.getMonth() + renewalDuration)
    return end.toISOString().split('T')[0]
  }

  useEffect(() => {
    if (contractStartDate && selectedContractType) {
      const duration = selectedContractType.duration
      const endDate = calculateEndDate(contractStartDate, duration)
      setContractEndDate(endDate)
    }
  }, [contractStartDate, selectedContractType])

  // Filter leads AND members based on search term (only when not pre-selected)
  useEffect(() => {
    if (!isLeadPreSelected && !isEditMode) {
      if (searchTerm.trim() === "") {
        setFilteredResults([])
        setFilteredLeads([])
      } else {
        const term = searchTerm.toLowerCase()
        
        // Search leads
        const matchedLeads = leadsData.filter(
          (lead) =>
            (lead.name && lead.name.toLowerCase().includes(term)) ||
            (`${lead.firstName} ${lead.lastName}`.toLowerCase().includes(term)) ||
            lead.email?.toLowerCase().includes(term) ||
            lead.company?.toLowerCase().includes(term) ||
            lead.phoneNumber?.includes(searchTerm),
        ).map(lead => ({ ...lead, _type: "lead" }))
        
        // Search members
        const matchedMembers = membersData.filter(
          (member) =>
            (member.title && member.title.toLowerCase().includes(term)) ||
            (`${member.firstName} ${member.lastName}`.toLowerCase().includes(term)) ||
            member.email?.toLowerCase().includes(term) ||
            member.phone?.includes(searchTerm) ||
            member.memberNumber?.toLowerCase().includes(term),
        ).map(member => ({ ...member, _type: "member" }))
        
        const combined = [...matchedLeads, ...matchedMembers]
        setFilteredResults(combined)
        setFilteredLeads(matchedLeads) // keep for backward compat
      }
    }
  }, [searchTerm, isLeadPreSelected, isEditMode])

  // Update selected contract type when rate type changes
  useEffect(() => {
    const contractType = DEFAULT_CONTRACT_TYPES.find((type) => type.name === contractData.rateType)
    setSelectedContractType(contractType || null)
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
    const isMember = lead._type === "member"
    const firstName = lead.firstName || (lead.name ? lead.name.split(" ")[0] : "")
    const lastName = lead.lastName || (lead.name ? lead.name.split(" ").slice(1).join(" ") : "")
    
    // Map gender to salutation (Herr/Frau), skip "other"
    let salutation = ""
    const gender = (lead.gender || "").toLowerCase()
    if (gender === "male" || gender === "männlich" || gender === "m") {
      salutation = "Herr"
    } else if (gender === "female" || gender === "weiblich" || gender === "f") {
      salutation = "Frau"
    }

    const fullName = lead.name || lead.title || `${firstName} ${lastName}`

    setContractData({
      ...contractData,
      leadId: lead.id,
      studioName: lead.company || "",
      studioOwnerName: fullName,
      fullName: fullName,
      email: lead.email || "",
      phone: lead.phoneNumber || lead.phone || "",
      vorname: firstName,
      nachname: lastName,
      emailAdresse: lead.email || "",
      telefonnummer: lead.phoneNumber || lead.phone || "",
      rateType: lead.interestedIn || "",
      strasse: lead.street || "",
      plz: lead.zipCode || "",
      ort: lead.city || "",
      anrede: salutation,
      mobil: lead.mobile || "",
      geburtsdatum: lead.dateOfBirth || lead.birthday || "",
      // Track whether the selected person is a lead or member
      selectedType: isMember ? "member" : "lead",
    })
    setSearchTerm(fullName)
    setFilteredResults([])
    setFilteredLeads([])
    setShowLeadSelection(false)
  }

  const handleProceedWithoutLead = () => {
    setContractData((prev) => ({ ...prev, leadId: "" }))
    setShowLeadSelection(false)
  }

  const handleBackToLeadSelection = () => {
    if (!isLeadPreSelected && !isEditMode) {
      setShowLeadSelection(true)
      setSearchTerm("")
      setFilteredResults([])
      setFilteredLeads([])
    }
  }

  const handleGenerateContract = () => {
    setShowSignatureOptions(true)
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
      toast.success("Contract generated with digital signature")
      saveContract({
        ...dataToSave,
        isDigital: true,
        status: "Digital signed",
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
    
    saveContract({
      ...dataToSave,
      isDigital: false,
      status: "Analog signed",
    })
  }

  const saveContract = (dataToSave) => {
    const endDate = dataToSave.contractEndDate || contractEndDate
    const newContract = {
      id: isEditMode ? contract.id : Date.now(),
      memberName: `${dataToSave.vorname} ${dataToSave.nachname}`.trim() || dataToSave.fullName,
      memberId: dataToSave.leadId || `M-${Date.now()}`,
      contractType: selectedContractType?.name || dataToSave.rateType,
      contractNumber: dataToSave.mitgliedsnummer || `C-${Date.now()}`,
      status: dataToSave.status || (isEditMode ? contract.status : "Pending"),
      startDate: dataToSave.contractStartDate || contractStartDate,
      endDate: endDate,
      autoRenewal: selectedContractType?.autoRenewal || false,
      renewalIndefinite: selectedContractType?.renewalIndefinite ?? true,
      autoRenewalEndDate: calculateAutoRenewalEndDate(endDate, selectedContractType),
      cost: calculateFinalPrice()?.finalPrice || selectedContractType?.cost,
      billingPeriod: selectedContractType?.billingPeriod,
      email: dataToSave.emailAdresse || dataToSave.email,
      phone: dataToSave.telefonnummer || dataToSave.phone,
      iban: dataToSave.iban,
      sepaMandate: dataToSave.sepaMandate,
      discount: discount.percentage > 0 ? {
        percentage: discount.percentage,
        duration: discount.isPermanent ? "permanent" : discount.duration,
      } : null,
      address: {
        street: dataToSave.strasse,
        zipCode: dataToSave.plz,
        city: dataToSave.ort,
      },
      formData: filledFormData,
      isDigital: dataToSave.isDigital,
    }

    onSave(newContract)
    toast.success(isEditMode ? "Contract updated!" : "Contract created!")
    onClose()
  }

  const toggleView = () => {
    setShowFormView(!showFormView)
  }

  // Handle opening the ContractFormFillModal
  const handleFillOutContract = () => {
    setShowContractFormFillModal(true)
  }

  // Handle contract form submission from ContractFormFillModal
  // This creates and saves the contract directly
  const handleFormFillComplete = (formData) => {
    setFilledFormData(formData)
    setShowContractFormFillModal(false)
    
    // Get form values
    const fv = formData?.formValues || {}
    const sv = formData?.systemValues || {}
    
    // Determine status - use formData status if provided, otherwise default
    // "Active" for completed contracts, "Pending" for drafts
    const contractStatus = formData?.status || (formData?.completedAt ? "Active" : "Pending")
    const isDraft = formData?.isDraft || false
    
    // Merge form data into local variables for contract creation
    const firstName = fv.firstName || contractData.vorname
    const lastName = fv.lastName || contractData.nachname
    const memberName = `${firstName} ${lastName}`.trim()
    
    // Create the full contract object
    const newContract = {
      id: isEditMode ? contract.id : Date.now(),
      contractNumber: contractData.mitgliedsnummer || `C-${Date.now()}`,
      memberName: memberName,
      memberId: contractData.leadId || `M-${Date.now()}`,
      contractType: selectedContractType?.name || contractData.rateType,
      startDate: contractStartDate,
      endDate: contractEndDate,
      trainingStartDate: trainingStartDate,
      status: isEditMode ? contract.status : contractStatus,
      autoRenewal: selectedContractType?.autoRenewal || false,
      renewalIndefinite: selectedContractType?.renewalIndefinite ?? true,
      autoRenewalEndDate: calculateAutoRenewalEndDate(contractEndDate, selectedContractType),
      cost: calculateFinalPrice()?.finalPrice || selectedContractType?.cost,
      billingPeriod: selectedContractType?.billingPeriod,
      email: fv.email || contractData.emailAdresse,
      phone: fv.telephone || contractData.telefonnummer,
      iban: fv.iban || contractData.iban,
      bic: fv.bic || contractData.bic,
      sepaMandate: contractData.sepaMandate || sv.sepaReference,
      address: {
        street: fv.street || contractData.strasse,
        zipCode: fv.zipCode || contractData.plz,
        city: fv.city || contractData.ort,
      },
      discount: discount.percentage > 0 ? {
        percentage: discount.percentage,
        duration: discount.isPermanent ? "permanent" : discount.duration,
      } : null,
      // Store the complete form data for PDF generation with @react-pdf/renderer
      formData: formData,
      contractFormSnapshot: {
        formId: formData?.contractFormId,
        formName: formData?.contractFormName,
        formValues: fv,
        systemValues: sv,
        completedAt: formData?.completedAt,
        contractFormData: formData?.contractFormData, // Full form structure for PDF generation
      },
      isDigital: true,
      isDraft: isDraft,
      dateOfBirth: fv.dateOfBirth || contractData.geburtsdatum,
      bankName: fv.bankName || contractData.kreditinstitut,
      salutation: fv.salutation || contractData.anrede,
    }

    // Call onSave to pass contract to parent component
    onSave(newContract)
    
    // Show appropriate message based on status
    if (isDraft) {
      toast.success("Contract saved as draft (Pending)")
    } else {
      toast.success(isEditMode ? "Contract updated!" : "Contract created successfully!")
    }
    onClose()
  }

  const nextPage = () => {
    setCurrentPage(1)
  }

  const prevPage = () => {
    setCurrentPage(0)
  }

  const priceCalculation = calculateFinalPrice()

  // Get duration display text
  const getDurationDisplay = () => {
    if (!selectedContractType) return '12 months'
    const duration = selectedContractType.duration
    if (typeof duration === 'number') return `${duration} months`
    return duration
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] font-sans">
      <style>{printStyles}</style>

      {/* Introductory Materials Selection Modal */}
      {showIntroductoryMaterials && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-[1001]">
          <div className="relative bg-[#1C1C1C] p-6 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-white text-lg font-semibold">Introductory Materials</h3>
                <p className="text-gray-400 text-sm mt-1">Select a material to preview</p>
              </div>
              <button
                onClick={() => setShowIntroductoryMaterials(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Materials Grid */}
            {DEFAULT_INTRODUCTORY_MATERIALS.length === 0 ? (
              <div className="bg-[#141414] rounded-xl p-8 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                <p className="text-gray-400">No introductory materials available</p>
                <p className="text-sm text-gray-500 mt-1">Materials can be created in Settings â†’ Introductory Materials</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                {DEFAULT_INTRODUCTORY_MATERIALS.map((material) => (
                  <div 
                    key={material.id} 
                    className="bg-[#141414] rounded-xl p-4 border border-[#333333] hover:border-blue-500 transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate">
                            {material.name || "Untitled Material"}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                            <BookOpen className="w-4 h-4" />
                            {material.pages?.length || 0} page{(material.pages?.length || 0) !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      
                      {/* Page previews */}
                      {material.pages && material.pages.length > 0 && (
                        <div className="flex gap-1 overflow-x-auto pb-1">
                          {material.pages.slice(0, 5).map((page) => (
                            <div 
                              key={page.id} 
                              className="w-10 h-14 bg-white border border-[#333333] rounded flex-shrink-0 overflow-hidden"
                            >
                              <div 
                                className="w-full h-full overflow-hidden pointer-events-none"
                                style={{ 
                                  transform: 'scale(0.1)', 
                                  transformOrigin: 'top left', 
                                  width: '1000%', 
                                  height: '1000%',
                                  fontSize: '10px',
                                  padding: '4px',
                                  color: '#000',
                                  lineHeight: '1.2',
                                  fontFamily: 'Arial, sans-serif'
                                }}
                                dangerouslySetInnerHTML={{ __html: page.content || '<p style="color:#ccc">Empty</p>' }}
                              />
                            </div>
                          ))}
                          {material.pages.length > 5 && (
                            <div className="w-10 h-14 bg-[#1C1C1C] border border-[#333333] rounded flex-shrink-0 flex items-center justify-center text-xs text-gray-500">
                              +{material.pages.length - 5}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <button 
                        onClick={() => {
                          setSelectedMaterial(material)
                          setShowMaterialPreview(true)
                          setShowIntroductoryMaterials(false)
                        }}
                        className="w-full px-4 py-2 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F] transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Material Preview Modal */}
      <IntroMaterialEditorModal
        visible={showMaterialPreview}
        onClose={() => {
          setShowMaterialPreview(false)
          setSelectedMaterial(null)
        }}
        material={selectedMaterial}
        previewMode={true}
      />

      {/* Signature Options Modal */}
      {showSignatureOptions && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-[1001]">
          <div className="relative bg-[#181818] p-6 rounded-2xl max-w-md w-full">
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

      {/* Print Prompt Modal */}
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

      {/* Main Modal */}
      <div className="bg-[#181818] p-3 w-full max-w-3xl mx-4 rounded-2xl">
        <div className="px-4 py-3 border-b border-gray-800 custom-scrollbar max-h-[10vh] sm:max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                {isEditMode ? "Edit Contract" : "Add Contract"}
              </h2>
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
              {/* Show "Back to Lead Selection" in form view, but NOT in contract document view */}
              {!showLeadSelection && !isLeadPreSelected && !isEditMode && showFormView && (
                <button
                  onClick={handleBackToLeadSelection}
                  className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-gray-800 rounded-xl flex items-center gap-1"
                >
                  <ArrowLeft size={16} />
                  <span className="text-xs">Back to Selection</span>
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
          {/* Lead Selection View */}
          {showLeadSelection ? (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-white text-lg font-semibold mb-2">Select Lead or Member</h3>
                <p className="text-gray-400 text-sm">Search for an existing lead or member, or proceed without selecting one</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-200 block pl-1">Lead / Member</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for lead or member..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                    />
                    {filteredResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-[#101010] mt-1 rounded-xl z-10 shadow-lg max-h-40 overflow-y-auto border border-gray-700">
                        {filteredResults.map((item) => (
                          <div
                            key={`${item._type}-${item.id}`}
                            className="p-3 hover:bg-[#1a1a1a] text-white cursor-pointer border-b border-gray-800 last:border-b-0"
                            onClick={() => handleLeadSelect(item)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {item.name || item.title || `${item.firstName} ${item.lastName}`}
                              </span>
                              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                                item._type === "member" 
                                  ? "bg-blue-500/20 text-blue-400" 
                                  : "bg-orange-500/20 text-orange-400"
                              }`}>
                                {item._type === "member" ? "Member" : "Lead"}
                              </span>
                            </div>
                            <div className="text-sm text-gray-400">{item.email}</div>
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
                  Proceed without selecting a lead or member
                </button>
              </div>
            </div>
          ) : showFormView ? (
            /* Form View - Contract Settings */
            <div>
              <div className="space-y-4 mb-4">
                {/* Show selected lead info */}
                {contractData.leadId && (
                  <div className="bg-[#101010]/60 p-4 rounded-xl border border-gray-800">
                    <h4 className="text-white text-sm font-medium mb-2 flex items-center gap-2">
                      {isLeadPreSelected ? "Lead" : (contractData.selectedType === "member" ? "Selected Member" : "Selected Lead")}
                      {!isLeadPreSelected && contractData.selectedType && (
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                          contractData.selectedType === "member"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-orange-500/20 text-orange-400"
                        }`}>
                          {contractData.selectedType === "member" ? "Member" : "Lead"}
                        </span>
                      )}
                    </h4>
                    <div className="text-sm text-gray-300">
                      <p>
                        <span className="text-gray-400">Name:</span> {contractData.fullName}
                      </p>
                      {contractData.email && (
                        <p>
                          <span className="text-gray-400">Email:</span> {contractData.email}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Contract Type Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-200 block pl-1">Contract Type</label>
                  <select
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200 appearance-none"
                    name="rateType"
                    value={contractData.rateType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select contract type</option>
                    {DEFAULT_CONTRACT_TYPES.map((type) => (
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Fields - only show when contract type is selected */}
                {selectedContractType && (
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
                        Contract End Date ({getDurationDisplay()})
                      </label>
                      <input
                        type="text"
                        value={contractEndDate}
                        readOnly
                        disabled
                        className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-gray-400 outline-none cursor-not-allowed pointer-events-none"
                      />
                    </div>
                  </div>
                )}

                {/* Contract Details Box */}
                {selectedContractType && (
                  <div className="bg-[#101010]/60 p-4 rounded-xl border border-gray-800">
                    <h4 className="text-white text-sm font-medium mb-2">Contract Details</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="block text-gray-400 text-xs">Duration</span>
                        <span className="text-white">{getDurationDisplay()}</span>
                      </div>
                      <div>
                        <span className="block text-gray-400 text-xs">Cost</span>
                        <span className="text-white">{currency}{selectedContractType.cost}</span>
                      </div>
                      <div>
                        <span className="block text-gray-400 text-xs">Billing Period</span>
                        <span className="text-white">{selectedContractType.billingPeriod}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Discount Section - Collapsible, only show when contract type is selected */}
                {selectedContractType && (
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
                                  : `Discount applies for ${discount.duration} billing period${Number(discount.duration) > 1 ? "s" : ""}`}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Fill out Contract Button */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleFillOutContract}
                  disabled={!selectedContractType}
                  className={`w-full px-4 py-2 text-sm font-medium rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 ${
                    selectedContractType
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Pencil size={16} /> Fill out Contract
                </button>
              </div>
            </div>
          ) : (
            /* Contract Document View (Legacy - keeping for backwards compatibility) */
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
                        <div className="col-span-3">
                          <label className="block text-xs text-gray-600 mb-1">Street & Number</label>
                          <input
                            type="text"
                            name="strasse"
                            value={contractData.strasse}
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
                      {isEditMode ? "Update Contract" : "Generate Contract"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Contract Form Fill Modal */}
      <ContractFormFillModal
        isOpen={showContractFormFillModal}
        onClose={() => setShowContractFormFillModal(false)}
        onSubmit={handleFormFillComplete}
        contractType={selectedContractType}
        contractData={{
          memberId: contractData.leadId,
          startDate: contractStartDate,
          endDate: contractEndDate,
          trainingStartDate: trainingStartDate,
          sepaReference: contractData.sepaMandate,
        }}
        leadData={{
          firstName: contractData.vorname,
          lastName: contractData.nachname,
          email: contractData.emailAdresse,
          phone: contractData.telefonnummer,
          street: contractData.strasse,
          zipCode: contractData.plz,
          city: contractData.ort,
          dateOfBirth: contractData.geburtsdatum,
          iban: contractData.iban,
          bic: contractData.bic,
          bankName: contractData.kreditinstitut,
          salutation: contractData.anrede,
        }}
        existingFormData={filledFormData?.formValues}
      />
    </div>
  )
}

// Backwards compatible exports
export function AddContractModal({ onClose, onSave, leadData = null }) {
  return <ContractModal onClose={onClose} onSave={onSave} leadData={leadData} contract={null} />
}

export function EditContractModal({ onClose, onSave, contract }) {
  return <ContractModal onClose={onClose} onSave={onSave} contract={contract} leadData={null} />
}

export default ContractModal
