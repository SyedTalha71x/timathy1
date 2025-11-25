/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X, Info, Calculator } from "lucide-react"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import Avatar from "../../../../../public/gray-avatar-fotor-20250912192528.png"

export default function AddStaffModal({
  isOpen,
  onClose,
  onSave
}) {
  const [activeTab, setActiveTab] = useState("details")
  const [showPassword, setShowPassword] = useState(false)
  const [newStaff, setNewStaff] = useState({
    firstName: '',
    lastName: '',
    birthday: '',
    email: '',
    phone: '',
    role: '',
    vacationEntitlement: 30,
    vacationDaysCurrentYear: 30,
    username: '',
    password: '',
    street: '',
    zipCode: '',
    city: '',
    country: '',
    description: '',
    img: '',
    gender: '',
    color: '#3F74FF'
  })

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setNewStaff({
        firstName: '',
        lastName: '',
        birthday: '',
        email: '',
        phone: '',
        role: '',
        vacationEntitlement: 30,
        vacationDaysCurrentYear: 30,
        username: '',
        password: '',
        street: '',
        zipCode: '',
        city: '',
        country: '',
        description: '',
        img: '',
        gender: '',
        color: '#3F74FF'
      })
      setShowPassword(false)
      setActiveTab('details')
    }
  }, [isOpen])

  // Calculate pro-rated vacation days
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
    
    // Prepare staff data for saving
    const staffToSave = {
      ...newStaff,
      // Remove internal flags before saving
      hasManualAdjustment: undefined
    }
    
    onSave(staffToSave)
  }

  const renderTabContent = () => {
    if (activeTab === "details") {
      return (
        <div className="space-y-4">
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
            <input type="file" accept="image/*" onChange={handleImgUpload} className="hidden" id="add-avatar-upload" />
            <label
              htmlFor="add-avatar-upload"
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
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                placeholder="Enter first name"
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
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                placeholder="Enter last name"
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
              value={newStaff.gender}
              onChange={handleInputChange}
              className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-200 block mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={newStaff.email}
              onChange={handleInputChange}
              className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              placeholder="Enter email address"
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
              className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              placeholder="Enter phone number"
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
              <option value="">Select Role</option>
              <option value="trainer">Trainer</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
              <option value="receptionist">Receptionist</option>
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
            <label className="text-sm text-gray-200 block mb-2">Street</label>
            <input
              type="text"
              name="street"
              value={newStaff.street}
              onChange={handleInputChange}
              className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              placeholder="Enter street address"
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
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                placeholder="Enter ZIP code"
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
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                placeholder="Enter city"
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
              className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              placeholder="Enter country"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-200 block mb-2">Description</label>
            <textarea
              name="description"
              value={newStaff.description}
              onChange={handleInputChange}
              className="w-full bg-[#101010] text-sm resize-none rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              rows={3}
              placeholder="Enter description (optional)"
            />
          </div>
        </div>
      )
    } else if (activeTab === "access") {
      return (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-200 block mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={newStaff.username}
              onChange={handleInputChange}
              className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              placeholder="Enter username"
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
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors pr-16"
                placeholder="Enter password"
                required
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md my-8 relative">
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="mb-6">
            <h1 className="text-white text-xl font-bold">Add New Staff</h1>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "details" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
              }`}
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("access")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "access" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
              }`}
            >
              Access Data
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 custom-scrollbar overflow-y-auto max-h-[60vh]">
            {renderTabContent()}
            
            <div className="flex flex-row gap-3 pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-2.5 bg-[#3F74FF] text-sm text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
              >
                Add Staff
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-2.5 bg-transparent text-gray-400 border-2 border-slate-500 rounded-xl text-sm hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}