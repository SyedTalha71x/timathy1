/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X, Copy, Check, User } from "lucide-react"
import { useState } from "react"

export function ContractDetailsModal({ contract, onClose }) {
  // Copy states
  const [copiedFirstName, setCopiedFirstName] = useState(false)
  const [copiedLastName, setCopiedLastName] = useState(false)
  const [copiedIban, setCopiedIban] = useState(false)
  const [copiedSepa, setCopiedSepa] = useState(false)
  const [copiedContractNumber, setCopiedContractNumber] = useState(false)
  const [copiedContractType, setCopiedContractType] = useState(false)
  const [copiedPeriod, setCopiedPeriod] = useState(false)

  // Helper to get first and last name from memberName
  const getFirstAndLastName = (fullName) => {
    const parts = fullName?.trim().split(" ") || []
    const firstName = parts[0] || ""
    const lastName = parts.length > 1 ? parts.slice(1).join(" ") : ""
    return { firstName, lastName }
  }

  const { firstName, lastName } = getFirstAndLastName(contract.memberName)

  // Copy handlers
  const handleCopy = async (text, setCopied) => {
    try {
      await navigator.clipboard.writeText(text || "")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const redirectToMember = () => {
    window.location.href = "/dashboard/members"
  }

  const formatPeriod = () => {
    return `${contract.startDate} - ${contract.endDate}`
  }

  return (
    <div className="fixed inset-0 w-full h-full open_sans_font bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000]">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md max-h-[90vh] md:max-h-[85vh] my-2 md:my-8 relative flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-6 pb-4 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-white text-lg font-semibold">Contract Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={20} className="cursor-pointer" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 pt-0 overflow-y-auto flex-1">
          <div className="space-y-6 text-white">
            
            {/* Contract Information */}
            <div className="space-y-4">
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Contract Information</div>
              
              <div>
                <p className="text-sm text-gray-400">Contract Number</p>
                <div className="flex items-center gap-3">
                  <p>{contract.id || "-"}</p>
                  {contract.id && (
                    <button
                      onClick={() => handleCopy(contract.id, setCopiedContractNumber)}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                      title="Copy contract number"
                    >
                      {copiedContractNumber ? (
                        <Check size={14} className="text-green-500" />
                      ) : (
                        <Copy size={14} className="text-gray-400 hover:text-white" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400">Contract Type</p>
                <div className="flex items-center gap-3">
                  <p>{contract.contractType || "-"}</p>
                  {contract.contractType && (
                    <button
                      onClick={() => handleCopy(contract.contractType, setCopiedContractType)}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                      title="Copy contract type"
                    >
                      {copiedContractType ? (
                        <Check size={14} className="text-green-500" />
                      ) : (
                        <Copy size={14} className="text-gray-400 hover:text-white" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400">Contract Period</p>
                <div className="flex items-center gap-3">
                  <p>{formatPeriod()}</p>
                  <button
                    onClick={() => handleCopy(formatPeriod(), setCopiedPeriod)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                    title="Copy contract period"
                  >
                    {copiedPeriod ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <Copy size={14} className="text-gray-400 hover:text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Member Information */}
            <div className="space-y-4">
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Member Information</div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">First Name</p>
                  <div className="flex items-center gap-3">
                    <p>{firstName || "-"}</p>
                    {firstName && (
                      <button
                        onClick={() => handleCopy(firstName, setCopiedFirstName)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        title="Copy first name"
                      >
                        {copiedFirstName ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <Copy size={14} className="text-gray-400 hover:text-white" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Last Name</p>
                  <div className="flex items-center gap-3">
                    <p>{lastName || "-"}</p>
                    {lastName && (
                      <button
                        onClick={() => handleCopy(lastName, setCopiedLastName)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        title="Copy last name"
                      >
                        {copiedLastName ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <Copy size={14} className="text-gray-400 hover:text-white" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400">IBAN</p>
                <div className="flex items-center gap-3">
                  <p>{contract.iban || "-"}</p>
                  {contract.iban && (
                    <button
                      onClick={() => handleCopy(contract.iban, setCopiedIban)}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                      title="Copy IBAN"
                    >
                      {copiedIban ? (
                        <Check size={14} className="text-green-500" />
                      ) : (
                        <Copy size={14} className="text-gray-400 hover:text-white" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400">SEPA Mandate Number</p>
                <div className="flex items-center gap-3">
                  <p>{contract.sepaMandate || "-"}</p>
                  {contract.sepaMandate && (
                    <button
                      onClick={() => handleCopy(contract.sepaMandate, setCopiedSepa)}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                      title="Copy SEPA mandate"
                    >
                      {copiedSepa ? (
                        <Check size={14} className="text-green-500" />
                      ) : (
                        <Copy size={14} className="text-gray-400 hover:text-white" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 bg-[#1C1C1C] px-4 md:px-6 py-4 border-t border-gray-700">
          <div className="flex justify-end">
            <button
              onClick={redirectToMember}
              className="bg-[#3F74FF] text-sm text-white px-4 py-2 rounded-xl hover:bg-[#3F74FF]/90 flex items-center gap-2"
            >
              <User size={16} />
              Go to Member
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
