/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { X, Upload } from "lucide-react"
import { Toaster, toast } from "react-hot-toast"
import Avatar from "../../public/avatar.png"
import DefaultAvatar from '../../public/default-avatar.avif'

export function EditLeadModal({ isVisible, onClose, onSave, leadData }) {
  const [formData, setFormData] = useState(leadData || {})
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (leadData) {
      setFormData(leadData)
      setPreviewUrl(leadData.avatar || null)
    }
  }, [leadData])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
        setFormData((prev) => ({
          ...prev,
          avatar: reader.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    setTimeout(() => {
      onClose()
    }, 200) // Slight delay before closing
  }

  if (!isVisible) return null

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-3">
        <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md my-8 relative p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Edit Lead</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6 custom-scrollbar overflow-y-auto max-h-[70vh]">
            {/* Profile Picture */}
            <div className="flex  mb-6">
              <div className="relative">
                <img
                  src={leadData?.avatar || DefaultAvatar}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-600"
                />
                <div 
                  className="absolute bottom-0 right-0 bg-[#FF5733] p-2 rounded-full cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Upload size={14} className="text-white" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            
            {/* Form Fields in Grid - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-400">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName || ""}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-xl bg-[#141414] border-gray-600 text-white text-sm outline-none p-2"
                />
              </div>
              
              <div>
                <label htmlFor="surname" className="block text-sm font-medium text-gray-400">
                  Surname
                </label>
                <input
                  type="text"
                  id="surname"
                  name="surname"
                  value={formData.surname || ""}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-xl bg-[#141414] border-gray-600 text-white text-sm outline-none p-2"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-xl bg-[#141414] border-gray-600 text-white text-sm outline-none p-2"
                />
              </div>
              
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-400">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber || ""}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-xl bg-[#141414] border-gray-600 text-white text-sm outline-none p-2"
                />
              </div>
              
              <div>
                <label htmlFor="trialPeriod" className="block text-sm font-medium text-gray-400">
                  Trial Period
                </label>
                <input
                  type="text"
                  id="trialPeriod"
                  name="trialPeriod"
                  value={formData.trialPeriod || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-xl bg-[#141414] border-gray-600 text-white text-sm outline-none p-2"
                />
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-400">
                  Prospect Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status || "passive"}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-xl outline-none bg-[#141414] border-gray-600 text-white text-sm p-2"
                >
                  <option value="active">🟢 Active prospect</option>
                  <option value="passive">🟡 Passive prospect</option>
                  <option value="uninterested">🔴 Uninterested</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hasTrialTraining"
                name="hasTrialTraining"
                checked={formData.hasTrialTraining || false}
                onChange={handleChange}
                className="rounded bg-[#141414] border-gray-600 text-[#FF5733] focus:ring-[#FF5733]"
              />
              <label htmlFor="hasTrialTraining" className="ml-2 block text-sm text-gray-400">
                Trial Training Arranged
              </label>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 mr-2 text-sm bg-gray-600 text-white rounded-xl outline-none hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-[#FF5733] text-white rounded-xl hover:bg-[#E64D2E] transition-colors duration-200"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}