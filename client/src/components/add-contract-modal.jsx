/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import { useState } from "react"

export function AddContractModal({ onClose, onSave }) {
  const [isDigital, setIsDigital] = useState(true)

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

        <div className="px-4 py-3 open_sans_font">
          <form className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-200 block pl-1">Lead</label>
                <select className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200 appearance-none">
                  <option value="">Select lead</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-200 block pl-1">Rate Type</label>
                <select className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200 appearance-none">
                  <option value="">Select rate type</option>
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
                      placeholder="Enter full name"
                      className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-200 block pl-1">Contract Term</label>
                    <input
                      type="text"
                      placeholder="Enter contract term"
                      className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-200 block pl-1">IBAN</label>
                    <input
                      type="text"
                      placeholder="Enter IBAN"
                      className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-200 block pl-1">Email</label>
                    <input
                      type="email"
                      placeholder="Enter email"
                      className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-200 block pl-1">Phone</label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-200 block pl-1">SEPA Mandate Number</label>
                    <input
                      type="text"
                      placeholder="Enter SEPA mandate number"
                      className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    type="button"
                    className="w-full px-4 py-2 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors duration-200"
                  >
                    Print Contract
                  </button>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-200 block pl-1">Upload Signed Contract</label>
                    <input
                      type="file"
                      accept=".pdf"
                      className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={onSave}
                className="w-full px-4 py-2 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors duration-200"
              >
                Save Contract
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

