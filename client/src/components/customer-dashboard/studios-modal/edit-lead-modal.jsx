"use client"

/* eslint-disable react/prop-types */

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Toaster, toast } from "react-hot-toast"

export function EditLeadModal({ isVisible, onClose, onSave, leadData }) {
  const [formData, setFormData] = useState({
    studioOwnerFirstName: "",
    studioOwnerLastName: "",
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
  })

  useEffect(() => {
    if (leadData) {
      // Map leadData to formData structure
      setFormData({
        studioOwnerFirstName: leadData.firstName || "",
        studioOwnerLastName: leadData.surname || "",
        email: leadData.email || "",
        phone: leadData.phoneNumber || "",
        street: leadData.street || "",
        zipCode: leadData.zipCode || "",
        city: leadData.city || "",
        country: leadData.country || "",
        website: leadData.website || "",
        about: leadData.about || "",
        studioName: leadData.studioName || "",
        // Extract note data from specialNote object
        note: leadData.specialNote?.text || "",
        noteStartDate: leadData.specialNote?.startDate || "",
        noteEndDate: leadData.specialNote?.endDate || "",
        noteImportance: leadData.specialNote?.isImportant ? "important" : "unimportant",
        status: leadData.hasTrialTraining ? "trial" : leadData.status || "passive",
      })
    }
  }, [leadData])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Map formData back to the structure expected by the parent component
    const mappedData = {
      ...leadData,
      firstName: formData.studioOwnerFirstName,
      surname: formData.studioOwnerLastName,
      email: formData.email,
      phoneNumber: formData.phone,
      street: formData.street,
      zipCode: formData.zipCode,
      city: formData.city,
      country: formData.country,
      website: formData.website,
      about: formData.about,
      studioName: formData.studioName,
      specialNote: {
        text: formData.note,
        startDate: formData.noteStartDate,
        endDate: formData.noteEndDate,
        isImportant: formData.noteImportance === "important",
      },
      hasTrialTraining: formData.status === "trial",
      status: formData.status === "trial" ? leadData.status || "passive" : formData.status,
    }

    onSave(mappedData)
    toast.success("Lead updated successfully!")
    setTimeout(() => {
      onClose()
    }, 200)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center p-3 items-center z-[1000] overflow-y-auto">
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
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md my-8 relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-white font-bold">Edit Lead</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 custom-scrollbar overflow-y-auto max-h-[70vh]">
            {/* Form Fields */}
            <div>
              <label className="text-sm text-gray-200 block mb-2">Studio Name</label>
              <input
                type="text"
                name="studioName"
                value={formData.studioName}
                onChange={handleChange}
                className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-200 block mb-2">Studio Owner First Name</label>
                <input
                  type="text"
                  name="studioOwnerFirstName"
                  value={formData.studioOwnerFirstName}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-200 block mb-2">Studio Owner Last Name</label>
                <input
                  type="text"
                  name="studioOwnerLastName"
                  value={formData.studioOwnerLastName}
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
              <label className="text-sm text-gray-200 block mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
              />
            </div>

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
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
