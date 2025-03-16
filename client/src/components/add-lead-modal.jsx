/* eslint-disable react/prop-types */
import { useState, useRef } from "react"
import { X } from "lucide-react"
import DefaultAvatar from "../../public/default-avatar.avif"

export function AddLeadModal({ isVisible, onClose, onSave }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    zipCode: "",
    city: "",
    dateOfBirth: "",
    about: "",
    note: "",
    noteStartDate: "",
    noteEndDate: "",
    noteImportance: "unimportant",
    trialPeriod: "Trial Period",
    hasTrialTraining: false,
    avatar: null,
    status: "passive", // Default status
  })

  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)

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
    onClose()
    // Reset form data
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      street: "",
      zipCode: "",
      city: "",
      dateOfBirth: "",
      about: "",
      note: "",
      noteStartDate: "",
      noteEndDate: "",
      noteImportance: "unimportant",
      trialPeriod: "Trial Period",
      hasTrialTraining: false,
      avatar: null,
      status: "passive", // Default status
    })
    setPreviewUrl(null)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center p-3 items-center z-[1000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md my-8 relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-white font-bold">Add New Lead</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 custom-scrollbar overflow-y-auto max-h-[70vh]">
            <div className="flex flex-col items-start">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                <img src={previewUrl || DefaultAvatar} alt="Profile Preview" className="w-full h-full object-cover" />
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
              <label
                onClick={() => fileInputRef.current.click()}
                className="bg-[#FF5733] hover:bg-[#E64D2E] px-6 py-2 rounded-xl text-sm cursor-pointer text-white"
              >
                Update picture
              </label>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-200 block mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-200 block mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-200 block mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-200 block mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-200 block mb-2">Street</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-200 block mb-2">ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-200 block mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-200 block mb-2">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full bg-[#141414] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-200 block mb-2">Trial Period</label>
              <input
                type="text"
                name="trialPeriod"
                value={formData.trialPeriod}
                onChange={handleChange}
                className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-200 block mb-2">Prospect Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
              >
                <option value="active">Active prospect</option>
                <option value="passive">Passive prospect</option>
                <option value="uninterested">Uninterested</option>
              </select>
            </div>

            <div className="border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm text-gray-200 font-medium">Special Note</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="noteImportance"
                    checked={formData.noteImportance === "important"}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        noteImportance: e.target.checked ? "important" : "unimportant",
                      })
                    }}
                    className="mr-2 h-4 w-4 accent-[#FF5733]"
                  />
                  <label htmlFor="noteImportance" className="text-sm text-gray-200">
                    Important
                  </label>
                </div>
              </div>

              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px] mb-4"
                placeholder="Enter special note..."
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-200 block mb-2">Start Date</label>
                  <input
                    type="date"
                    name="noteStartDate"
                    value={formData.noteStartDate}
                    onChange={handleChange}
                    className="w-full bg-[#141414] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-200 block mb-2">End Date</label>
                  <input
                    type="date"
                    name="noteEndDate"
                    value={formData.noteEndDate}
                    onChange={handleChange}
                    className="w-full bg-[#141414] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-200 block mb-2">About</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px]"
                placeholder="Enter additional information about the lead..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="hasTrialTraining"
                name="hasTrialTraining"
                checked={formData.hasTrialTraining}
                onChange={handleChange}
                className="rounded bg-[#141414] border-gray-600 text-[#FF5733] focus:ring-[#FF5733]"
              />
              <label htmlFor="hasTrialTraining" className="ml-2 block text-sm text-gray-400">
                Trial Training Arranged
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 mr-2 text-sm bg-gray-600 text-white rounded-xl outline-none hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-[#FF5733] text-white rounded-xl outline-none hover:bg-[#E64D2E] transition-colors duration-200"
              >
                Add Lead
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

