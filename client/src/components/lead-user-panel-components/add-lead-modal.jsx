import { X } from "lucide-react"
import { useState } from "react"

/* eslint-disable react/prop-types */
const AddLeadModal = ({ isVisible, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "passive",
    hasTrialTraining: false,
    note: "",
    noteImportance: "unimportant",
    noteStartDate: "",
    noteEndDate: "",
    source: "",
    street: "",
    zipCode: "",
    city: "",
    country: "",
  })
  
  
    const handleSubmit = (e) => {
      e.preventDefault()
      onSave(formData)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        status: "passive",
        hasTrialTraining: false,
        note: "",
        noteImportance: "unimportant",
        noteStartDate: "",
        noteEndDate: "",
      })
      onClose()
    }
  
    if (!isVisible) return null
  
    return (
      <div className="fixed inset-0 bg-black/50 flex p-2 justify-center items-center z-50">
        <div className="bg-[#1C1C1C] p-6 rounded-xl w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-white font-bold">Add New Lead</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-200 block mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-200 block mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-200 block mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-200 block mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-200 block mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
              >
                <option value="active">Active prospect</option>
                <option value="passive">Passive prospect</option>
                <option value="uninterested">Uninterested</option>
                <option value="missed">Missed Call</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
  <div>
    <label className="text-sm text-gray-200 block mb-2">Source</label>
    <input
      type="text"
      value={formData.source}
      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
    />
  </div>
  <div>
    <label className="text-sm text-gray-200 block mb-2">Street</label>
    <input
      type="text"
      value={formData.street}
      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
    />
  </div>
  <div>
    <label className="text-sm text-gray-200 block mb-2">ZIP Code</label>
    <input
      type="text"
      value={formData.zipCode}
      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
    />
  </div>
  <div>
    <label className="text-sm text-gray-200 block mb-2">City</label>
    <input
      type="text"
      value={formData.city}
      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
    />
  </div>
  <div>
    <label className="text-sm text-gray-200 block mb-2">Country</label>
    <input
      type="text"
      value={formData.country}
      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
    />
  </div>
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
                    className="mr-2 h-4 w-4 accent-[#FF843E]"
                  />
                  <label htmlFor="noteImportance" className="text-sm text-gray-200">
                    Important
                  </label>
                </div>
              </div>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full bg-[#101010] resize-none rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px] mb-4"
                placeholder="Enter special note..."
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-200 block mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.noteStartDate}
                    onChange={(e) => setFormData({ ...formData, noteStartDate: e.target.value })}
                    className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-200 block mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.noteEndDate}
                    onChange={(e) => setFormData({ ...formData, noteEndDate: e.target.value })}
                    className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm bg-gray-600 text-white rounded-xl hover:bg-gray-700"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 text-sm bg-[#FF5733] text-white rounded-xl hover:bg-[#E64D2E]">
                Add Lead
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  export default AddLeadModal
  