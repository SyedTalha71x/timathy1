""

import { FileUp, Trash2, X, Eye } from "lucide-react"
import { useState } from "react"
import Contract1 from "../../../../public/contract1.png"

/* eslint-disable react/prop-types */
export function EditContractModal({ contract, onClose, onSave }) {
  const [editedContract, setEditedContract] = useState({ ...contract })
  const [files, setFiles] = useState(contract.files || [])
  const [showContractImage, setShowContractImage] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedContract((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files)
    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles])
  }

  const handleDeleteFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    onSave({ ...editedContract, files })
    onClose()
  }

  const handleViewContract = () => {
    setShowContractImage(true)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
      <div className="bg-[#1C1C1C] p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-semibold">Edit Contract</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {showContractImage ? (
          <div className="space-y-4">
            <div className="bg-white rounded-lg overflow-hidden">
              <img src={Contract1 || "/placeholder.svg"} alt="Contract Document" className="w-full h-auto" />
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowContractImage(false)}
                className="px-3 py-1.5 bg-gray-800 text-white rounded-lg text-sm"
              >
                Back to Edit
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 custom-scrollbar overflow-y-auto max-h-[70vh]">
            <div className="space-y-2">
              <label htmlFor="studioName" className="block text-sm font-medium text-gray-400">
                Studio Name
              </label>
              <input
                type="text"
                id="studioName"
                name="studioName"
                value={editedContract.studioName || ""}
                onChange={handleInputChange}
                className="w-full bg-[#141414] text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3F74FF] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="studioOwnerName" className="block text-sm font-medium text-gray-400">
                Studio Owner Name
              </label>
              <input
                type="text"
                id="studioOwnerName"
                name="studioOwnerName"
                value={editedContract.studioOwnerName || ""}
                onChange={handleInputChange}
                className="w-full bg-[#141414] text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3F74FF] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="contractType" className="block text-sm font-medium text-gray-400">
                Contract Type
              </label>
              <select
                id="contractType"
                name="contractType"
                value={editedContract.contractType || ""}
                onChange={handleInputChange}
                className="w-full bg-[#141414] text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3F74FF] outline-none"
              >
                <option value="Premium">Premium</option>
                <option value="Basic">Basic</option>
                <option value="Bronze">Bronze</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-400">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={editedContract.startDate || ""}
                onChange={handleInputChange}
                className="w-full bg-[#141414] white-calendar-icon text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3F74FF] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-400">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={editedContract.endDate || ""}
                onChange={handleInputChange}
                className="w-full bg-[#141414] white-calendar-icon text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3F74FF] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="status" className="block text-sm font-medium text-gray-400">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={editedContract.status || ""}
                onChange={handleInputChange}
                className="w-full bg-[#141414] text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3F74FF] outline-none"
              >
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Inactive">Inactive</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Digital signed">Digital signed</option>
                <option value="Analog signed">Analog signed</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="isDigital" className="block text-sm font-medium text-gray-400">
                Contract Format
              </label>
              <select
                id="isDigital"
                name="isDigital"
                value={editedContract.isDigital ? "digital" : "analog"}
                onChange={(e) => setEditedContract((prev) => ({ ...prev, isDigital: e.target.value === "digital" }))}
                className="w-full bg-[#141414] text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3F74FF] outline-none"
              >
                <option value="digital">Digital</option>
                <option value="analog">Analog</option>
              </select>
            </div>
            {editedContract.isDigital && (
              <>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editedContract.email || ""}
                    onChange={handleInputChange}
                    className="w-full bg-[#141414] text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3F74FF] outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-400">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={editedContract.phone || ""}
                    onChange={handleInputChange}
                    className="w-full bg-[#141414] text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3F74FF] outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="iban" className="block text-sm font-medium text-gray-400">
                    IBAN
                  </label>
                  <input
                    type="text"
                    id="iban"
                    name="iban"
                    value={editedContract.iban || ""}
                    onChange={handleInputChange}
                    className="w-full bg-[#141414] text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3F74FF] outline-none"
                  />
                </div>
              </>
            )}

            <button
              type="button"
              onClick={handleViewContract}
              className="w-full px-4 py-2 bg-[#2F2F2F] text-sm font-medium text-white rounded-lg hover:bg-[#3a3a3a] transition-colors duration-200 flex items-center justify-center gap-2 mt-4"
            >
              <Eye size={16} />
              View Contract
            </button>

            <div>
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-400 mb-2">
                Upload Contract File
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf"
                multiple
              />
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-[#141414] hover:bg-[#1a1a1a] transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileUp className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
                  </div>
                </label>
              </div>
            </div>

            {files.length === 0 ? (
              <div className="bg-green-500/10 border border-green-500 rounded-lg p-4">
                <p className="text-green-500 text-sm">No files uploaded for this contract yet.</p>
              </div>
            ) : (
              <div>
                <h3 className="text-white text-lg font-semibold mb-2">Contract Files</h3>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-[#141414] p-2 rounded-lg">
                      <span className="text-gray-300 text-sm truncate">{file.name}</span>
                      <button
                        onClick={() => handleDeleteFile(index)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-[#3F74FF] text-white rounded-lg hover:bg-[#3F74FF]/90 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
