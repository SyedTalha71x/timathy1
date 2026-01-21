/* eslint-disable react/prop-types */
import { X, Info, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import useCountries from "../../../hooks/useCountries";

// Initials Avatar Component - Blue background with initials (like members)
const InitialsAvatar = ({ firstName, lastName, size = "md", className = "" }) => {
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || ""
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || ""
    return `${firstInitial}${lastInitial}` || "?"
  }

  const sizeClasses = {
    sm: "w-9 h-9 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-24 h-24 text-3xl",
  }

  return (
    <div 
      className={`bg-[#3F74FF] rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0 ${sizeClasses[size]} ${className}`}
      style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
    >
      {getInitials()}
    </div>
  )
}

function EditStaffModal({
  staff,
  setIsShowDetails,
  setSelectedStaff,
  staffMembers,
  setStaffMembers,
  handleRemovalStaff,
}) {
  const [activeTab, setActiveTab] = useState("details")
  const { countries, loading } = useCountries();
  const [editedStaff, setEditedStaff] = useState({
    ...staff,
    about: staff.description || staff.about || "",
    color: staff.color || "#3F74FF",
    mobileNumber: staff.mobileNumber || staff.phone || "",
    telephoneNumber: staff.telephoneNumber || "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")

  // Reset state when staff changes
  useEffect(() => {
    if (staff) {
      setEditedStaff({
        ...staff,
        about: staff.description || staff.about || "",
        color: staff.color || "#3F74FF",
        mobileNumber: staff.mobileNumber || staff.phone || "",
        telephoneNumber: staff.telephoneNumber || "",
      })
      setActiveTab("details")
      setIsChangingPassword(false)
      setNewPassword("")
    }
  }, [staff])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedStaff((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhoneChange = (e) => {
    const { name, value } = e.target
    // Only allow numbers and + sign
    const sanitized = value.replace(/[^0-9+]/g, '')
    setEditedStaff((prev) => ({ ...prev, [name]: sanitized }))
  }

  const handleColorChange = (e) => {
    setEditedStaff((prev) => ({ ...prev, color: e.target.value }))
  }

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword)
  }

  const handleImgUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditedStaff((prev) => ({ ...prev, img: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const updatedStaff = {
      ...editedStaff,
      description: editedStaff.about,
      phone: editedStaff.mobileNumber, // Keep backward compatibility
    }
    if (isChangingPassword && newPassword) {
      updatedStaff.password = newPassword
    }
    const updatedStaffMembers = staffMembers.map((s) => (s.id === updatedStaff.id ? updatedStaff : s))
    setStaffMembers(updatedStaffMembers)
    setIsShowDetails(false)
    setSelectedStaff(null)
    toast.success("Staff updated successfully")
  }

  const handleClose = () => {
    setIsShowDetails(false)
    setSelectedStaff(null)
  }

  const tabs = [
    { id: "details", label: "Details" },
    { id: "access", label: "Access Data" },
  ]

  return (
    <div className="fixed open_sans_font inset-0 w-full h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
      <div className="bg-[#1C1C1C] p-4 md:p-6 rounded-xl w-full max-w-md my-4 md:my-8 relative max-h-[95vh] md:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-white font-bold">Edit Staff</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? "text-blue-400 border-b-2 border-blue-400" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
            {activeTab === "details" && (
              <>
                {/* Avatar Upload */}
                <div className="flex flex-col items-start">
                  <div className="w-24 h-24 rounded-xl overflow-hidden mb-4">
                    {editedStaff.img ? (
                      <img
                        src={editedStaff.img}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <InitialsAvatar 
                        firstName={editedStaff.firstName} 
                        lastName={editedStaff.lastName} 
                        size="lg"
                      />
                    )}
                  </div>
                  <input 
                    type="file" 
                    id="edit-avatar" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImgUpload} 
                  />
                  <label
                    htmlFor="edit-avatar"
                    className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 px-6 py-2 rounded-xl text-sm cursor-pointer text-white"
                  >
                    Update picture
                  </label>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Personal Information</div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">
                        First Name<span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={editedStaff.firstName}
                        onChange={handleInputChange}
                        className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">
                        Last Name<span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={editedStaff.lastName}
                        onChange={handleInputChange}
                        className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Gender</label>
                      <select
                        name="gender"
                        value={editedStaff.gender || ""}
                        onChange={handleInputChange}
                        className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Birthday</label>
                      <input
                        type="date"
                        name="birthday"
                        value={editedStaff.birthday || ""}
                        onChange={handleInputChange}
                        className="w-full bg-[#141414] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4 pt-4 border-t border-gray-700">
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Contact Information</div>
                  
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">
                      Email<span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editedStaff.email}
                      onChange={handleInputChange}
                      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Mobile Number</label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={editedStaff.mobileNumber || ""}
                        onChange={handlePhoneChange}
                        placeholder="+49 123 456789"
                        className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Telephone Number</label>
                      <input
                        type="tel"
                        name="telephoneNumber"
                        value={editedStaff.telephoneNumber || ""}
                        onChange={handlePhoneChange}
                        placeholder="030 12345678"
                        className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4 pt-4 border-t border-gray-700">
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Address</div>
                  
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Street & Number</label>
                    <input
                      type="text"
                      name="street"
                      value={editedStaff.street || ""}
                      onChange={handleInputChange}
                      placeholder="Main Street 123"
                      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={editedStaff.zipCode || ""}
                        onChange={handleInputChange}
                        placeholder="12345"
                        className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={editedStaff.city || ""}
                        onChange={handleInputChange}
                        placeholder="Berlin"
                        className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Country</label>
                    <select
                      name="country"
                      value={editedStaff.country || ""}
                      onChange={handleInputChange}
                      className="w-full bg-[#141414] text-sm rounded-xl px-4 py-2 text-white outline-none"
                    >
                      <option value="">Select a country</option>
                      {loading ? (
                        <option value="" disabled>Loading countries...</option>
                      ) : (
                        countries.map((country) => (
                          <option key={country.code} value={country.name}>
                            {country.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {/* Employment */}
                <div className="space-y-4 pt-4 border-t border-gray-700">
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Employment</div>
                  
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">
                      Role<span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      name="role"
                      value={editedStaff.role || ""}
                      onChange={handleInputChange}
                      className="w-full bg-[#141414] text-sm rounded-xl px-4 py-2 text-white outline-none"
                      required
                    >
                      <option value="">Select role</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="employee">Employee</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Staff Identification Color</label>
                    <div className="flex items-center gap-3 bg-[#141414] rounded-xl p-3">
                      <input
                        type="color"
                        name="color"
                        value={editedStaff.color}
                        onChange={handleColorChange}
                        className="w-10 h-10 bg-transparent rounded-lg cursor-pointer border-0"
                      />
                      <span className="text-sm text-gray-300">{editedStaff.color}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-200 block mb-2 flex items-center gap-2">
                      Vacation Entitlement per Year (Days)
                      <div className="relative group">
                        <Info size={14} className="text-gray-500 cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
                          Changes will take effect next year
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                      </div>
                    </label>
                    <input
                      type="number"
                      name="vacationEntitlement"
                      value={editedStaff.vacationEntitlement || 30}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full bg-[#141414] text-sm rounded-xl px-4 py-2 text-white outline-none"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4 pt-4 border-t border-gray-700">
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Additional Information</div>
                  
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">About</label>
                    <textarea
                      name="about"
                      value={editedStaff.about || ""}
                      onChange={handleInputChange}
                      placeholder="Enter more details..."
                      className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm resize-none min-h-[100px]"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === "access" && (
              <div className="space-y-4">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Login Credentials</div>
                
                <div>
                  <label className="text-sm text-gray-200 block mb-2">
                    Username<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={editedStaff.username || ""}
                    onChange={handleInputChange}
                    className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">Password</label>
                  <div className="relative">
                    {isChangingPassword ? (
                      <div className="space-y-2">
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-[#141414] rounded-xl px-4 py-2 pr-20 text-white outline-none text-sm border border-blue-500"
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={handlePasswordToggle}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-white"
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsChangingPassword(false)
                            setNewPassword("")
                          }}
                          className="text-sm text-gray-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <input
                          type="password"
                          value="********"
                          disabled
                          className="flex-1 bg-[#141414] rounded-xl px-4 py-2 text-gray-500 outline-none text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setIsChangingPassword(true)}
                          className="text-sm text-blue-400 hover:text-blue-300 whitespace-nowrap"
                        >
                          Change Password
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer - Delete button on the left */}
          <div className="flex flex-col-reverse sm:flex-row justify-between gap-2 pt-4 mt-auto flex-shrink-0">
            <button
              type="button"
              onClick={() => handleRemovalStaff(editedStaff)}
              className="px-4 py-2.5 sm:py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors flex items-center justify-center sm:justify-start gap-1"
            >
              <Trash2 size={16} />
              Delete
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 text-sm bg-gray-600 text-white rounded-xl hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 text-sm text-white rounded-xl bg-orange-500 hover:bg-orange-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditStaffModal
