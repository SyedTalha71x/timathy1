/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { X, Info, Calculator } from "lucide-react"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import Avatar from "../../../../public/gray-avatar-fotor-20250912192528.png"

function AddStaffModal({ setIsModalOpen, staffMembers, setStaffMembers }) {
  const [activeTab, setActiveTab] = useState("details")
  const [showPassword, setShowPassword] = useState(false)
  const [newStaff, setNewStaff] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
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
    vacationDaysCurrentYear: 30, // New field for current year's available days
    birthday: "",
    color: "#3F74FF", // Default color
  })

  // Calculate pro-rated vacation days when component mounts or vacationEntitlement changes
  useEffect(() => {
    const calculateProRatedVacation = () => {
      const currentYear = new Date().getFullYear()
      const currentDate = new Date()
      const startOfYear = new Date(currentYear, 0, 1) // January 1st of current year
      const endOfYear = new Date(currentYear, 11, 31) // December 31st of current year
      
      const totalDaysInYear = Math.floor((endOfYear - startOfYear) / (1000 * 60 * 60 * 24)) + 1
      const daysPassedInYear = Math.floor((currentDate - startOfYear) / (1000 * 60 * 60 * 24)) + 1
      
      // Calculate pro-rated vacation: (days remaining in year / total days) * annual entitlement
      const daysRemainingInYear = totalDaysInYear - daysPassedInYear
      const proRatedVacation = Math.round((daysRemainingInYear / totalDaysInYear) * newStaff.vacationEntitlement)
      
      return Math.max(0, proRatedVacation) // Ensure non-negative
    }

    // Only auto-calculate if we haven't manually adjusted the current year days
    // or if this is a new staff member (no manual adjustment yet)
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

  // Special handler for vacation days current year to track manual adjustments
  const handleVacationDaysCurrentYearChange = (e) => {
    const value = parseInt(e.target.value) || 0
    setNewStaff((prev) => ({ 
      ...prev, 
      vacationDaysCurrentYear: value,
      hasManualAdjustment: true // Mark as manually adjusted
    }))
  }

  // Handler for annual entitlement that also updates current year if not manually adjusted
  const handleVacationEntitlementChange = (e) => {
    const value = parseInt(e.target.value) || 0
    setNewStaff((prev) => ({ 
      ...prev, 
      vacationEntitlement: value
      // Current year will be recalculated in useEffect if not manually adjusted
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

  // Function to recalculate pro-rated vacation
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
      hasManualAdjustment: false // Reset manual adjustment flag
    }))
  }

  function createPassword() {
    return Math.random().toString(36).slice(-8)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newStaffMember = {
      ...newStaff,
      id: staffMembers.length + 1,
      userId: newStaff.username,
      description: newStaff.about,
      // Remove internal flags before saving
      hasManualAdjustment: undefined
    }
    setStaffMembers([...staffMembers, newStaffMember])
    setIsModalOpen(false)
    toast.success("Staff member added successfully")
  }

  const renderTabContent = () => {
    if (activeTab === "details") {
      return (
        <div className="space-y-3">
          <div className="flex flex-col items-start">
            <div className="w-24 h-24 rounded-xl overflow-hidden mb-4">
              <img
                src={newStaff.img || Avatar}
                alt="Profile"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <input type="file" accept="image/*" onChange={handleImgUpload} className="hidden" id="avatar-upload" />
            <label
              htmlFor="avatar-upload"
              className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 transition-colors text-white px-6 py-2 rounded-xl text-sm cursor-pointer"
            >
              Upload picture
            </label>
          </div>
          {/* Staff Identification Color Field */}
          <div>
            <label className="text-sm text-gray-200 block mb-2">Staff Identification Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="color"
                value={newStaff.color}
                onChange={handleColorChange}
                className="w-12 h-12 bg-[#101010] rounded-xl cursor-pointer border border-gray-600"
              />
              <span className="text-sm text-gray-400">{newStaff.color}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-200 block mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={newStaff.firstName}
                onChange={handleInputChange}
                placeholder="Enter first name"
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-200 block mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={newStaff.lastName}
                onChange={handleInputChange}
                placeholder="Enter last name"
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-200 block mb-2">Birthday</label>
            <input
              type="date"
              name="birthday"
              value={newStaff.birthday}
              onChange={handleInputChange}
              className="w-full bg-[#101010] white-calendar-icon text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-200 block mb-2">Gender</label>
            <select
              name="gender"
              value={newStaff.gender || ""}
              onChange={handleInputChange}
              className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-200 block mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={newStaff.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-200 block mb-2">Phone No</label>
              <input
                type="tel"
                name="phone"
                value={newStaff.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-200 block mb-2">Street</label>
            <input
              type="text"
              name="street"
              value={newStaff.street}
              onChange={handleInputChange}
              placeholder="Enter street address"
              className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-200 block mb-2">ZIP Code</label>
              <input
                type="text"
                name="zipCode"
                value={newStaff.zipCode}
                onChange={handleInputChange}
                placeholder="Enter ZIP code"
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-200 block mb-2">City</label>
              <input
                type="text"
                name="city"
                value={newStaff.city}
                onChange={handleInputChange}
                placeholder="Enter city"
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-200 block mb-2">Country</label>
            <input
              type="text"
              name="country"
              value={newStaff.country}
              onChange={handleInputChange}
              placeholder="Enter country"
              className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-200 block mb-2">Role</label>
            <select
              name="role"
              value={newStaff.role}
              onChange={handleInputChange}
              className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              required
            >
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          {/* Vacation Entitlement Section */}
          <div className="space-y-3 p-4 bg-[#101010] rounded-xl border border-gray-700">
            <div>
              <label className="text-sm text-gray-200 block mb-2 flex items-center gap-2">
                Annual Vacation Entitlement (Days)
                <div className="relative group">
                  <Info size={14} className="text-gray-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
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
                className="w-full bg-[#151515] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                required
              />
            </div>

            <div className="pt-2 border-t border-gray-700">
              <label className="text-sm text-gray-200 block mb-2 flex items-center gap-2">
                Vacation Days Available for {new Date().getFullYear()}
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
                  className="w-full bg-[#151515] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                />
                {newStaff.hasManualAdjustment && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">
                      Manual
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Automatically calculated based on current date. You can manually adjust this value.
                {newStaff.vacationDaysCurrentYear < newStaff.vacationEntitlement && (
                  <span className="block text-yellow-400">
                    Pro-rated: {newStaff.vacationDaysCurrentYear} of {newStaff.vacationEntitlement} days
                  </span>
                )}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-200 block mb-2">About</label>
            <textarea
              name="about"
              value={newStaff.about}
              onChange={handleInputChange}
              placeholder="Enter about information"
              className="w-full bg-[#101010] resize-none text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              rows={3}
            />
          </div>
        </div>
      )
    } else if (activeTab === "access") {
      return (
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-200 block mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={newStaff.username}
              onChange={handleInputChange}
              placeholder="Enter username"
              className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-200 block mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={newStaff.password}
                onChange={handleInputChange}
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              />
              <button
                type="button"
                onClick={handlePasswordToggle}
                className="absolute right-3 top-3 text-sm text-gray-400 hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="fixed inset-0 cursor-pointer open_sans_font w-full h-full bg-black/50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-[#181818] rounded-xl w-full max-w-md my-8 relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-lg open_sans_font_700">Add Staff</h2>
            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "details" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("access")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "access" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
              }`}
            >
              Access Data
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 custom-scrollbar overflow-y-auto max-h-[60vh]">
            {renderTabContent()}
            <div className="flex flex-row gap-3 pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-2.5 bg-[#3F74FF] text-sm text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddStaffModal