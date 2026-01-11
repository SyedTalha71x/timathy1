/* eslint-disable react/prop-types */
""
import { X, Upload } from "lucide-react"

const FranchiseModal = ({
  isCreateModalOpen,
  isEditModalOpen,
  onClose,
  franchiseForm,
  onInputChange,
  onSubmit,
  onLogoUpload,
  onArchive,
  selectedFranchise,
}) => {
  const isOpen = isCreateModalOpen || isEditModalOpen
  const isEdit = isEditModalOpen

  if (!isOpen) return null

  // const handleArchive = () => {
  //   if (
  //     window.confirm(
  //       `Are you sure you want to archive "${selectedFranchise?.name}"? This action can be reversed later.`,
  //     )
  //   ) {
  //     onArchive(selectedFranchise.id)
  //     onClose()
  //   }
  // }

  return (
    <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[10000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-2xl my-8 relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white open_sans_font_700 text-lg font-semibold">
              {isEdit ? "Edit Franchise" : "Create New Franchise"}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={20} className="cursor-pointer" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-6 custom-scrollbar overflow-y-auto max-h-[70vh]">
            {/* Logo Upload Section */}
            <div className="bg-[#161616] rounded-xl p-4">
              <h3 className="text-white font-medium mb-4">Franchise Logo</h3>
              <div className="flex flex-col items-start">
                <div className="w-24 h-24 rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  {franchiseForm.logo ? (
                    <img
                      src={franchiseForm.logo || "/placeholder.svg"}
                      alt="Franchise Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload size={24} className="text-white" />
                  )}
                </div>
                <input type="file" id="franchiseLogo" className="hidden" accept="image/*" onChange={onLogoUpload} />
                <label
                  htmlFor="franchiseLogo"
                  className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 px-6 py-2 rounded-xl text-sm cursor-pointer"
                >
                  {franchiseForm.logo ? "Change Logo" : "Upload Logo"}
                </label>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-[#161616] rounded-xl p-4">
              <h3 className="text-white font-medium mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-200 block mb-2">Franchise Name</label>
                  <input
                    type="text"
                    name="name"
                    value={franchiseForm.name}
                    onChange={onInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Owner Name</label>
                  <input
                    type="text"
                    name="ownerFirstName"
                    value={`${franchiseForm.ownerFirstName} ${franchiseForm.ownerLastName}`.trim()}
                    onChange={(e) => {
                      const fullName = e.target.value.trim()
                      const nameParts = fullName.split(" ")
                      const firstName = nameParts[0] || ""
                      const lastName = nameParts.slice(1).join(" ") || ""

                      onInputChange({
                        target: {
                          name: "ownerFirstName",
                          value: firstName,
                        },
                      })
                      onInputChange({
                        target: {
                          name: "ownerLastName",
                          value: lastName,
                        },
                      })
                    }}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    placeholder="Enter full name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={franchiseForm.email}
                      onChange={onInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={franchiseForm.phone}
                      onChange={onInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Website</label>
                    <input
                      type="text"
                      name="website"
                      value={franchiseForm.website}
                      onChange={onInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Country</label>
                    <select
                      name="country"
                      value={franchiseForm.country}
                      onChange={onInputChange}
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
                    value={franchiseForm.street}
                    onChange={onInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={franchiseForm.zipCode}
                      onChange={onInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={franchiseForm.city}
                      onChange={onInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-[#161616] rounded-xl p-4">
              <h3 className="text-white font-medium mb-4">About Franchise</h3>
              <div>
                <label className="text-sm text-gray-200 block mb-2">Franchise Description</label>
                <textarea
                  name="about"
                  value={franchiseForm.about}
                  onChange={onInputChange}
                  className="w-full bg-[#101010] resize-none rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[120px]"
                  placeholder="Describe your franchise, mission, values, services offered, etc..."
                />
                <p className="text-xs text-gray-400 mt-2">
                  This information will be displayed on your franchise profile and helps potential partners understand
                  your business.
                </p>
              </div>
            </div>

            {/* Special Note Section */}
            <div className="bg-[#161616] rounded-xl p-4">
              <h3 className="text-white font-medium mb-4">Special Note</h3>
              <p className="text-xs text-gray-400 mb-4">
                Add internal notes for your team. These notes are not visible to franchise partners and are used for
                internal management purposes only.
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-200 font-medium">Note Content</label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="franchiseNoteImportance"
                      checked={franchiseForm.noteImportance === "important"}
                      onChange={(e) => {
                        onInputChange({
                          target: {
                            name: "noteImportance",
                            value: e.target.checked ? "important" : "unimportant",
                          },
                        })
                      }}
                      className="mr-2 h-4 w-4 accent-[#FF843E]"
                    />
                    <label htmlFor="franchiseNoteImportance" className="text-sm text-gray-200">
                      Mark as Important
                    </label>
                  </div>
                </div>

                <textarea
                  name="specialNote"
                  value={franchiseForm.specialNote}
                  onChange={onInputChange}
                  className="w-full bg-[#101010] resize-none rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px]"
                  placeholder="Enter internal note for this franchise..."
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Note Valid From</label>
                    <input
                      type="date"
                      name="noteStartDate"
                      value={franchiseForm.noteStartDate}
                      onChange={onInputChange}
                      className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Note Valid Until</label>
                    <input
                      type="date"
                      name="noteEndDate"
                      value={franchiseForm.noteEndDate}
                      onChange={onInputChange}
                      className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Login Credentials */}
            <div className="bg-[#161616] rounded-xl p-4">
              <h3 className="text-white font-medium mb-4">Login Credentials</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-200 block mb-2">Login Email</label>
                  <input
                    type="email"
                    name="loginEmail"
                    value={franchiseForm.loginEmail}
                    onChange={onInputChange}
                    className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Password</label>
                    <input
                      type="password"
                      name="loginPassword"
                      value={franchiseForm.loginPassword}
                      onChange={onInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={franchiseForm.confirmPassword}
                      onChange={onInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      required
                    />
                  </div>
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
              {isEdit && (
                <button
                  type="button"
                  onClick={() => {
                    const isArchived = selectedFranchise?.isArchived
                    const action = isArchived ? "unarchive" : "archive"
                    if (
                      window.confirm(
                        `Are you sure you want to ${action} "${selectedFranchise?.name}"?`
                      )
                    ) {
                      onArchive(selectedFranchise.id, !isArchived)
                      onClose()
                    }
                  }}
                  className={`flex-1 ${selectedFranchise?.isArchived ? "bg-gray-600 " : "bg-red-600 hover:bg-red-700"
                    } text-white rounded-xl py-2 text-sm cursor-pointer`}
                >
                  {selectedFranchise?.isArchived ? "Unarchive Franchise" : "Archive Franchise"}
                </button>
              )}
              <button
                type="submit"
                className="flex-1 bg-[#FF843E] hover:bg-[#FF843E]/90 text-white rounded-xl py-2 text-sm cursor-pointer"
              >
                {isEdit ? "Save Changes" : "Create Franchise"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FranchiseModal
