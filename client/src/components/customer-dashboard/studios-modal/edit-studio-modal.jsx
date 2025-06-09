"use client"

/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import { toast } from "react-hot-toast"

const EditStudioModal = ({
  isOpen,
  onClose,
  selectedStudio,
  editForm,
  setEditForm,
  handleInputChange,
  handleEditSubmit,
  DefaultStudioImage,
}) => {
  if (!isOpen || !selectedStudio) return null

  const handleOpeningHoursChange = (day, value) => {
    setEditForm((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: value,
      },
    }))
  }

  return (
    <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[9999] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-2xl my-8 relative">
        <div className="md:p-6 p-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white open_sans_font_700 text-lg font-semibold">Edit Studio</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={20} className="cursor-pointer" />
            </button>
          </div>

          <form onSubmit={handleEditSubmit} className="space-y-6 custom-scrollbar overflow-y-auto max-h-[70vh]">
            {/* Studio Logo Section */}
            <div className="bg-[#161616] rounded-xl p-4">
              <h3 className="text-white font-medium mb-4">Studio Logo</h3>
              <div className="flex flex-col items-start">
                <div className="w-24 h-24 rounded-xl overflow-hidden mb-4">
                  <img
                    src={selectedStudio.image || DefaultStudioImage}
                    alt="Studio Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  type="file"
                  id="logo"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      toast.success("Logo selected successfully")
                    }
                  }}
                />
                <label
                  htmlFor="logo"
                  className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 px-6 py-2 rounded-xl text-sm cursor-pointer"
                >
                  Update logo
                </label>
              </div>
            </div>

            {/* Studio Configuration Section */}
            <div className="bg-[#161616] rounded-xl p-4">
              <h3 className="text-white font-medium mb-4">Studio Configuration</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Studio Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Owner Name</label>
                    <input
                      type="text"
                      name="ownerName"
                      value={editForm.ownerName}
                      onChange={handleInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Website</label>
                    <input
                      type="text"
                      name="website"
                      value={editForm.website}
                      onChange={handleInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Country</label>
                    <select
                      name="country"
                      value={editForm.country}
                      onChange={handleInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    >
                      <option value="">Select Country</option>
                      <option value="Germany">Germany</option>
                      <option value="Austria">Austria</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="Belgium">Belgium</option>
                      <option value="France">France</option>
                      <option value="Italy">Italy</option>
                      <option value="Spain">Spain</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={editForm.street}
                    onChange={handleInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={editForm.zipCode}
                      onChange={handleInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={editForm.city}
                      onChange={handleInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Tax ID</label>
                    <input
                      type="text"
                      name="taxId"
                      value={editForm.taxId}
                      onChange={handleInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-200 block mb-2">IBAN</label>
                    <input
                      type="text"
                      name="iban"
                      value={editForm.iban}
                      onChange={handleInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      placeholder="DE89 3704 0044 0532 0130 00"
                    />
                  </div>
                </div>

                <div className="border border-slate-700 rounded-xl p-4">
                  <label className="text-sm text-gray-200 block mb-3 font-medium">Opening Hours</label>
                  <div className="space-y-2">
                    {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                      <div key={day} className="grid grid-cols-2 gap-2 items-center">
                        <label className="text-xs text-gray-300 capitalize">{day}:</label>
                        <input
                          type="text"
                          value={editForm.openingHours?.[day] || ""}
                          onChange={(e) => handleOpeningHoursChange(day, e.target.value)}
                          className="bg-[#101010] rounded-lg px-3 py-1 text-white outline-none text-xs"
                          placeholder="9:00 - 22:00"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Closing Days</label>
                  <input
                    type="text"
                    name="closingDays"
                    value={editForm.closingDays}
                    onChange={handleInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    placeholder="e.g., Christmas Day, New Year's Day"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Contract Start</label>
                    <input
                      type="date"
                      name="contractStart"
                      value={editForm.contractStart}
                      onChange={handleInputChange}
                      className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Contract End</label>
                    <input
                      type="date"
                      name="contractEnd"
                      value={editForm.contractEnd}
                      onChange={handleInputChange}
                      className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-[#161616] rounded-xl p-4">
              <h3 className="text-white font-medium mb-4">About Studio</h3>
              <div>
                <label className="text-sm text-gray-200 block mb-2">Studio Description</label>
                <textarea
                  name="about"
                  value={editForm.about}
                  onChange={handleInputChange}
                  className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[120px]"
                  placeholder="Describe your studio, services, specialties, equipment, atmosphere, etc..."
                />
                <p className="text-xs text-gray-400 mt-2">
                  This information will be displayed on your studio profile and helps potential members understand what
                  makes your studio unique.
                </p>
              </div>
            </div>

            {/* Special Note Section */}
            <div className="bg-[#161616] rounded-xl p-4">
              <h3 className="text-white font-medium mb-4">Special Note</h3>
              <p className="text-xs text-gray-400 mb-4">
                Add internal notes for your team. These notes are not visible to studio members and are used for
                internal management purposes only.
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-200 font-medium">Note Content</label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="noteImportance"
                      checked={editForm.noteImportance === "important"}
                      onChange={(e) => {
                        setEditForm({
                          ...editForm,
                          noteImportance: e.target.checked ? "important" : "unimportant",
                        })
                      }}
                      className="mr-2 h-4 w-4 accent-[#FF843E]"
                    />
                    <label htmlFor="noteImportance" className="text-sm text-gray-200">
                      Mark as Important
                    </label>
                  </div>
                </div>

                <textarea
                  name="note"
                  value={editForm.note}
                  onChange={handleInputChange}
                  className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px]"
                  placeholder="Enter internal note for this studio..."
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Note Valid From</label>
                    <input
                      type="date"
                      name="noteStartDate"
                      value={editForm.noteStartDate}
                      onChange={handleInputChange}
                      className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Note Valid Until</label>
                    <input
                      type="date"
                      name="noteEndDate"
                      value={editForm.noteEndDate}
                      onChange={handleInputChange}
                      className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="bg-[#101010] rounded-lg p-3">
                  <p className="text-xs text-gray-400">
                    <strong>Note:</strong> Important notes will display with a red warning icon, while regular notes
                    show with a blue info icon. If no dates are specified, the note will be considered always valid.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white rounded-xl py-2 text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#FF843E] hover:bg-[#FF843E]/90 text-white rounded-xl py-2 text-sm cursor-pointer"
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

export default EditStudioModal
