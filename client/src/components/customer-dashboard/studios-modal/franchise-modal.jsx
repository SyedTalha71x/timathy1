/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"
import { X, Upload, Eye, EyeOff } from "lucide-react"

const FranchiseModal = ({
  isCreateModalOpen,
  isEditModalOpen,
  onClose,
  franchiseForm,
  onInputChange,
  onSubmit,
  onLogoUpload,
}) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  if (!isCreateModalOpen && !isEditModalOpen) return null

  return (
    <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[100000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md my-8 relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white open_sans_font_700 text-lg font-semibold">
              {isCreateModalOpen ? "Create Franchise" : "Edit Franchise"}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={20} className="cursor-pointer" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 custom-scrollbar overflow-y-auto max-h-[70vh]">
            {/* Logo Upload Section */}
            <div>
              <label className="text-sm text-gray-200 block mb-2">Franchise Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center overflow-hidden">
                  {franchiseForm.logo ? (
                    <img
                      src={franchiseForm.logo || "/placeholder.svg"}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload size={20} className="text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <input type="file" accept="image/*" onChange={onLogoUpload} className="hidden" id="logo-upload" />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer bg-[#3F74FF] hover:bg-[#3F74FF]/90 px-4 py-2 rounded-lg text-sm flex items-center gap-2 w-fit"
                  >
                    <Upload size={16} />
                    Upload Logo
                  </label>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                </div>
              </div>
            </div>

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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-200 block mb-2">Owner First Name</label>
                <input
                  type="text"
                  name="ownerFirstName"
                  value={franchiseForm.ownerFirstName}
                  onChange={onInputChange}
                  className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-200 block mb-2">Owner Last Name</label>
                <input
                  type="text"
                  name="ownerLastName"
                  value={franchiseForm.ownerLastName}
                  onChange={onInputChange}
                  className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                  required
                />
              </div>
            </div>

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
              />
            </div>

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

            <div>
              <label className="text-sm text-gray-200 block mb-2">Street</label>
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

            <div>
              <label className="text-sm text-gray-200 block mb-2">About</label>
              <textarea
                name="about"
                value={franchiseForm.about}
                onChange={onInputChange}
                className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px]"
                placeholder="Describe the franchise..."
              />
            </div>

            {/* Special Note Section */}
            <div className="border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm text-gray-200 font-medium">Special Note</label>
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
                    Important
                  </label>
                </div>
              </div>

              <textarea
                name="specialNote"
                value={franchiseForm.specialNote}
                onChange={onInputChange}
                className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px] mb-4"
                placeholder="Enter special note for this franchise..."
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-200 block mb-2">Start Date</label>
                  <input
                    type="date"
                    name="noteStartDate"
                    value={franchiseForm.noteStartDate}
                    onChange={onInputChange}
                    className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-200 block mb-2">End Date</label>
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

            <div className="border border-slate-700 rounded-xl p-4">
              <h4 className="text-sm text-gray-200 font-medium mb-4">Login Credentials</h4>

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

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="loginPassword"
                      value={franchiseForm.loginPassword}
                      onChange={onInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 pr-10 text-white outline-none text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={franchiseForm.confirmPassword}
                      onChange={onInputChange}
                      className="w-full bg-[#101010] rounded-xl px-4 py-2 pr-10 text-white outline-none text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#FF843E] text-white rounded-xl py-2 text-sm cursor-pointer">
              {isCreateModalOpen ? "Create Franchise" : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FranchiseModal
