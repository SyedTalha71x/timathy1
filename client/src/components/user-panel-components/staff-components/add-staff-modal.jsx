/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { X, Info, Calculator } from "lucide-react"
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

function AddStaffModal({ setIsModalOpen, staffMembers, setStaffMembers }) {
  const { countries, loading } = useCountries();

  const [activeTab, setActiveTab] = useState("details")
  const [showPassword, setShowPassword] = useState(false)
  const [newStaff, setNewStaff] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    telephoneNumber: "",
    role: "",
    about: "",
    gender: "",
    img: null,
    username: "",
    userId: "",
    street: "",
    zipCode: "",
    city: "",
    country: "",
    password: "",
    vacationEntitlement: 30,
    vacationDaysCurrentYear: 30,
    birthday: "",
    color: "#3F74FF",
  })

  // Calculate pro-rated vacation days when component mounts or vacationEntitlement changes
  useEffect(() => {
    const calculateProRatedVacation = () => {
      const currentYear = new Date().getFullYear()
      const currentDate = new Date()
      const startOfYear = new Date(currentYear, 0, 1)
      const endOfYear = new Date(currentYear, 11, 31)

      const totalDaysInYear = Math.floor((endOfYear - startOfYear) / (1000 * 60 * 60 * 24)) + 1
      const daysPassedInYear = Math.floor((currentDate - startOfYear) / (1000 * 60 * 60 * 24)) + 1

      const daysRemainingInYear = totalDaysInYear - daysPassedInYear
      const proRatedVacation = Math.round((daysRemainingInYear / totalDaysInYear) * newStaff.vacationEntitlement)

      return Math.max(0, proRatedVacation)
    }

    if (!newStaff.hasManualAdjustment) {
      const proRatedDays = calculateProRatedVacation()
      setNewStaff(prev => ({
        ...prev,
        vacationDaysCurrentYear: proRatedDays
      }))
    }
  }, [newStaff.vacationEntitlement, newStaff.hasManualAdjustment])

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewStaff((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhoneChange = (e) => {
    const { name, value } = e.target
    // Only allow numbers and + sign
    const sanitized = value.replace(/[^0-9+]/g, '')
    setNewStaff((prev) => ({ ...prev, [name]: sanitized }))
  }

  const handleVacationDaysCurrentYearChange = (e) => {
    const value = parseInt(e.target.value) || 0
    setNewStaff((prev) => ({
      ...prev,
      vacationDaysCurrentYear: value,
      hasManualAdjustment: true
    }))
  }

  const handleVacationEntitlementChange = (e) => {
    const value = parseInt(e.target.value) || 0
    setNewStaff((prev) => ({
      ...prev,
      vacationEntitlement: value
    }))
  }

  const handleColorChange = (e) => {
    setNewStaff((prev) => ({ ...prev, color: e.target.value }))
  }

  const handleImgUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewStaff((prev) => ({ ...prev, img: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const recalculateProRatedVacation = () => {
    const currentYear = new Date().getFullYear()
    const currentDate = new Date()
    const startOfYear = new Date(currentYear, 0, 1)
    const endOfYear = new Date(currentYear, 11, 31)

    const totalDaysInYear = Math.floor((endOfYear - startOfYear) / (1000 * 60 * 60 * 24)) + 1
    const daysPassedInYear = Math.floor((currentDate - startOfYear) / (1000 * 60 * 60 * 24)) + 1
    const daysRemainingInYear = totalDaysInYear - daysPassedInYear

    const proRatedVacation = Math.round((daysRemainingInYear / totalDaysInYear) * newStaff.vacationEntitlement)

    setNewStaff(prev => ({
      ...prev,
      vacationDaysCurrentYear: Math.max(0, proRatedVacation),
      hasManualAdjustment: false
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newStaffMember = {
      ...newStaff,
      id: staffMembers.length + 1,
      userId: newStaff.username,
      description: newStaff.about,
      phone: newStaff.mobileNumber, // Keep backward compatibility
      hasManualAdjustment: undefined
    }
    setStaffMembers([...staffMembers, newStaffMember])
    setIsModalOpen(false)
    toast.success("Staff created successfully")
  }

  const tabs = [
    { id: "details", label: "Details" },
    { id: "access", label: "Access Data" },
  ]

  return (
    <div className="fixed inset-0 open_sans_font w-full h-full bg-black/50 flex items-center justify-center z-[1000] p-2 md:p-4">
      <div className="bg-[#1C1C1C] p-4 md:p-6 rounded-xl w-full max-w-md my-4 md:my-8 relative max-h-[95vh] md:max-h-[90vh] flex flex-col">
        {/* Header - No + icon */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-white font-bold">Create Staff</h2>
          <button 
            onClick={() => setIsModalOpen(false)} 
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
                    {newStaff.img ? (
                      <img
                        src={newStaff.img}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : newStaff.firstName || newStaff.lastName ? (
                      <InitialsAvatar 
                        firstName={newStaff.firstName} 
                        lastName={newStaff.lastName} 
                        size="lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#3F74FF] flex items-center justify-center">
                        <span className="text-white text-3xl font-semibold">?</span>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    id="avatar-upload" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImgUpload} 
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 px-6 py-2 rounded-xl text-sm cursor-pointer text-white"
                  >
                    Upload picture
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
                        value={newStaff.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
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
                        value={newStaff.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
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
                        value={newStaff.gender}
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
                        value={newStaff.birthday}
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
                      value={newStaff.email}
                      onChange={handleInputChange}
                      placeholder="john.doe@example.com"
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
                        value={newStaff.mobileNumber}
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
                        value={newStaff.telephoneNumber}
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
                      value={newStaff.street}
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
                        value={newStaff.zipCode}
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
                        value={newStaff.city}
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
                      value={newStaff.country}
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
                      value={newStaff.role}
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
                        value={newStaff.color}
                        onChange={handleColorChange}
                        className="w-10 h-10 bg-transparent rounded-lg cursor-pointer border-0"
                      />
                      <span className="text-sm text-gray-300">{newStaff.color}</span>
                    </div>
                  </div>

                  {/* Vacation Section */}
                  <div className="space-y-4 p-4 bg-[#141414] rounded-xl">
                    <div>
                      <label className="text-sm text-gray-200 block mb-2 flex items-center gap-2">
                        Annual Vacation Entitlement (Days)
                        <div className="relative group">
                          <Info size={14} className="text-gray-500 cursor-help" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
                            Full vacation days per complete year
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      </label>
                      <input
                        type="number"
                        name="vacationEntitlement"
                        value={newStaff.vacationEntitlement}
                        onChange={handleVacationEntitlementChange}
                        min="0"
                        max="365"
                        className="w-full bg-[#1a1a1a] text-sm rounded-xl px-4 py-2 text-white outline-none"
                        required
                      />
                    </div>

                    <div className="pt-3 border-t border-gray-700">
                      <label className="text-sm text-gray-200 block mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          Vacation Days Available for {new Date().getFullYear()}
                        </span>
                        <button
                          type="button"
                          onClick={recalculateProRatedVacation}
                          className="flex items-center gap-1 text-xs text-[#3F74FF] hover:text-[#3F74FF]/80 transition-colors"
                          title="Recalculate pro-rated vacation"
                        >
                          <Calculator size={12} />
                          Recalculate
                        </button>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="vacationDaysCurrentYear"
                          value={newStaff.vacationDaysCurrentYear}
                          onChange={handleVacationDaysCurrentYearChange}
                          min="0"
                          max={newStaff.vacationEntitlement}
                          className="w-full bg-[#1a1a1a] text-sm rounded-xl px-4 py-2 text-white outline-none"
                        />
                        {newStaff.hasManualAdjustment && (
                          <div className="absolute top-1/2 -translate-y-1/2 right-3">
                            <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded">
                              Manual
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Automatically calculated based on current date. You can manually adjust this value.
                        {newStaff.vacationDaysCurrentYear < newStaff.vacationEntitlement && (
                          <span className="block text-yellow-400/80 mt-1">
                            Pro-rated: {newStaff.vacationDaysCurrentYear} of {newStaff.vacationEntitlement} days
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4 pt-4 border-t border-gray-700">
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Additional Information</div>
                  
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">About</label>
                    <textarea
                      name="about"
                      value={newStaff.about}
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
                    value={newStaff.username}
                    onChange={handleInputChange}
                    placeholder="johndoe"
                    className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-200 block mb-2">
                    Password<span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={newStaff.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      className="w-full bg-[#141414] rounded-xl px-4 py-2 pr-16 text-white outline-none text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={handlePasswordToggle}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-white"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 mt-auto flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm bg-gray-600 text-white rounded-xl hover:bg-gray-700 order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm text-white rounded-xl bg-orange-500 hover:bg-orange-600 order-1 sm:order-2"
            >
              Create Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddStaffModal
