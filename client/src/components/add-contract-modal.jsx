/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X, FileText, Upload } from "lucide-react"
import { useState, useEffect } from "react"
import Contract1 from '../../public/contract1.png'
import Contract2 from '../../public/contract2.png'

export function AddContractModal({ onClose, onSave, leadData = null }) {
  const [isDigital, setIsDigital] = useState(true)
  const [contractData, setContractData] = useState({
    fullName: "",
    contractTerm: "",
    iban: "",
    email: "",
    phone: "",
    sepaMandate: "",
    leadId: "",
    rateType: "",
    signedFile: null,
  })
  const [showContractImage, setShowContractImage] = useState(false)

  // Pre-fill data if lead information is available
  useEffect(() => {
    if (leadData) {
      setContractData((prevData) => ({
        ...prevData,
        fullName: leadData.name || "",
        email: leadData.email || "",
        phone: leadData.phone || "",
        leadId: leadData.id || "",
        rateType: leadData.interestedIn || "",
      }))
    }
  }, [leadData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setContractData({ ...contractData, [name]: value })
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setContractData({ ...contractData, signedFile: file })
    }
  }

  const handlePrintContract = () => {
    // In a real implementation, this would generate a PDF for printing
    window.print()
  }

  const handleSaveContract = () => {
    // Save the contract with all the collected data
    onSave({
      ...contractData,
      isDigital,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex open_sans_font items-center justify-center z-[1000]">
      <div className="bg-[#181818] p-3 w-full max-w-md mx-4 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <h2 className="text-base open_sans_font_700 text-white">Add Contract</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-gray-800 rounded-xl"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {showContractImage ? (
          <div className="p-4">
            <div className="bg-white rounded-lg overflow-hidden">
              {/* Display your contract image here */}
              <img src={Contract1} alt="Contract Template" className="w-full h-auto" />
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowContractImage(false)}
                className="px-3 py-1.5 bg-black text-white rounded-xl border border-gray-800 text-sm"
              >
                Back to Form
              </button>
              <button
                onClick={handlePrintContract}
                className="px-3 py-1.5 bg-[#3F74FF] text-white rounded-xl text-sm flex items-center gap-1"
              >
                <FileText size={14} />
                Print
              </button>
            </div>
          </div>
        ) : (
          <div className="px-4 py-3 open_sans_font">
            <form className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-200 block pl-1">Lead</label>
                  <select
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200 appearance-none"
                    name="leadId"
                    value={contractData.leadId}
                    onChange={handleInputChange}
                  >
                    <option value="">Select lead</option>
                    {/* In a real implementation, you would map through available leads */}
                    {leadData && <option value={leadData.id}>{leadData.name}</option>}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-200 block pl-1">Rate Type</label>
                  <select
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200 appearance-none"
                    name="rateType"
                    value={contractData.rateType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select rate type</option>
                    <option value="Basic">Basic</option>
                    <option value="Premium">Premium</option>
                    <option value="Bronze">Bronze</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-200 block pl-1">Contract Type</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setIsDigital(true)}
                      className={`flex-1 py-2 px-4 rounded-xl text-sm ${
                        isDigital ? "bg-[#3F74FF] text-white" : "bg-black text-gray-400 border border-gray-800"
                      }`}
                    >
                      Digital
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDigital(false)}
                      className={`flex-1 py-2 px-4 rounded-xl text-sm ${
                        !isDigital ? "bg-[#3F74FF] text-white" : "bg-black text-gray-400 border border-gray-800"
                      }`}
                    >
                      Analog
                    </button>
                  </div>
                </div>

                {isDigital ? (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-200 block pl-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={contractData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter full name"
                        className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-200 block pl-1">Contract Term</label>
                      <input
                        type="text"
                        name="contractTerm"
                        value={contractData.contractTerm}
                        onChange={handleInputChange}
                        placeholder="Enter contract term"
                        className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-200 block pl-1">IBAN</label>
                      <input
                        type="text"
                        name="iban"
                        value={contractData.iban}
                        onChange={handleInputChange}
                        placeholder="Enter IBAN"
                        className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-200 block pl-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={contractData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email"
                        className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-200 block pl-1">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={contractData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-200 block pl-1">SEPA Mandate Number</label>
                      <input
                        type="text"
                        name="sepaMandate"
                        value={contractData.sepaMandate}
                        onChange={handleInputChange}
                        placeholder="Enter SEPA mandate number"
                        className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowContractImage(true)}
                      className="w-full px-4 py-2 bg-[#2F2F2F] text-sm font-medium text-white rounded-xl hover:bg-[#3a3a3a] transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <FileText size={16} />
                      Preview Contract
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={handlePrintContract}
                      className="w-full px-4 py-2 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <FileText size={16} />
                      Print Contract
                    </button>
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-200 block pl-1">Upload Signed Contract</label>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf"
                          id="contract-file"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="contract-file"
                          className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200 flex items-center justify-center gap-2 cursor-pointer border border-gray-800"
                        >
                          <Upload size={16} />
                          {contractData.signedFile ? contractData.signedFile.name : "Choose file..."}
                        </label>
                      </div>
                    </div>

                    {/* Basic contract information for paper contracts */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-200 block pl-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={contractData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter full name"
                        className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-200 block pl-1">Contract Term</label>
                      <input
                        type="text"
                        name="contractTerm"
                        value={contractData.contractTerm}
                        onChange={handleInputChange}
                        placeholder="Enter contract term"
                        className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={handleSaveContract}
                  className="w-full px-4 py-2 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors duration-200"
                  disabled={!isDigital && !contractData.signedFile}
                >
                  Save Contract
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

