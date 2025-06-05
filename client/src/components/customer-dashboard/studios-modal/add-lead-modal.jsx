/* eslint-disable react/prop-types */

import { useState, useEffect } from "react"
import { X } from "lucide-react"

export function AddLeadModal({ isVisible, onClose, onSave, leadSources = [] }) {
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    email: "",
    phone: "",
    street: "",
    zipCode: "",
    city: "",
    country: "",
    website: "",
    about: "",
    note: "",
    noteStartDate: "",
    noteEndDate: "",
    noteImportance: "unimportant",
    status: "passive",
    studioName: "",
    source: "",
  })

  const [showToast, setShowToast] = useState(false)

  // Reset form when modal becomes visible
  useEffect(() => {
    if (isVisible) {
      setFormData({
        FirstName: "",
        LastName: "",
        email: "",
        phone: "",
        street: "",
        zipCode: "",
        city: "",
        country: "",
        website: "",
        about: "",
        note: "",
        noteStartDate: "",
        noteEndDate: "",
        noteImportance: "unimportant",
        status: "passive",
        studioName: "",
        source: "",
      })
    }
  }, [isVisible])

  // Auto-hide toast
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.FirstName || !formData.LastName || !formData.email || !formData.phone || !formData.source) {
      alert("Please fill in all required fields")
      return
    }

    const newLeadData = {
      id: Date.now(), 
      firstName: formData.FirstName,
      surname: formData.LastName,
      email: formData.email,
      phoneNumber: formData.phone,
      street: formData.street,
      zipCode: formData.zipCode,
      city: formData.city,
      country: formData.country,
      website: formData.website,
      about: formData.about,
      studioName: formData.studioName,
      source: formData.source,
      specialNote: {
        text: formData.note,
        startDate: formData.noteStartDate,
        endDate: formData.noteEndDate,
        isImportant: formData.noteImportance === "important",
      },
      hasTrialTraining: formData.status === "trial",
      status: formData.status === "trial" ? "passive" : formData.status,
      createdAt: new Date().toISOString(),
    }

    onSave(newLeadData)
    setShowToast(true)
    setTimeout(() => {
      onClose()
    }, 200)
  }

  if (!isVisible) return null

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-[1001] bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
          Lead added successfully!
        </div>
      )}

      <div className="fixed inset-0 bg-black/50 flex justify-center p-3 items-center z-[1000] overflow-y-auto">
        <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md my-8 relative">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-white font-bold">Add New Lead</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 custom-scrollbar overflow-y-auto max-h-[70vh]">
              {/* First and Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-200 block mb-2">First Name</label>
                  <input
                    type="text"
                    name="FirstName"
                    value={formData.FirstName}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-200 block mb-2">Last Name</label>
                  <input
                    type="text"
                    name="LastName"
                    value={formData.LastName}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-gray-200 block mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm text-gray-200 block mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                />
              </div>

              {/* Source */}
              <div>
                <label className="text-sm text-gray-200 block mb-2">Source *</label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                >
                  <option value="">Select source</option>
                  {leadSources.map((source, index) => (
                    <option key={index} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>

              {/* Street */}
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

              {/* ZIP and City */}
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

              {/* Country */}
              <div>
                <label className="text-sm text-gray-200 block mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                />
              </div>

              {/* Website */}
              <div>
                <label className="text-sm text-gray-200 block mb-2">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  placeholder="https://example.com"
                />
              </div>

              {/* Lead Status */}
              <div>
                <label className="text-sm text-gray-200 block mb-2">Lead Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                >
                  <option value="passive">Passive</option>
                  <option value="active">Active</option>
                  <option value="converted">Converted</option>
                  <option value="trial">Trial Training arranged</option>
                </select>
              </div>

              {/* Special Note Section */}
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

              {/* About */}
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

              {/* Action Buttons */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 mr-2 text-sm bg-gray-600 text-white rounded-xl outline-none hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 text-sm bg-[#FF5733] text-white rounded-xl outline-none hover:bg-[#E64D2E] transition-colors duration-200"
                >
                  Add Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}