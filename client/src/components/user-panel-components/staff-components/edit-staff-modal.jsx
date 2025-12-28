/* eslint-disable react/prop-types */
import { X, Info } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import useCountries from "../../../hooks/useCountries";

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
    about: staff.description || staff.about || "", // Handle both field names
    color: staff.color || "#3F74FF", // Default color
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedStaff((prev) => ({ ...prev, [name]: value }))
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
      description: editedStaff.about, // Map 'about' back to 'description' for compatibility
    }
    if (isChangingPassword && newPassword) {
      updatedStaff.password = newPassword
    }
    const updatedStaffMembers = staffMembers.map((s) => (s.id === updatedStaff.id ? updatedStaff : s))
    setStaffMembers(updatedStaffMembers)
    setIsShowDetails(false)
    setSelectedStaff(null)
    toast.success("Staff member updated successfully")
  }

  const renderTabContent = () => {
    if (activeTab === "details") {
      return (
        <div className="space-y-3">
          <div className="flex flex-col items-start">
            <div className="w-24 h-24 rounded-xl overflow-hidden mb-4">
              <img
                src={editedStaff.img || "/placeholder.svg?height=96&width=96"}
                alt="Profile"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <input type="file" accept="image/*" onChange={handleImgUpload} className="hidden" id="edit-avatar-upload" />
            <label
              htmlFor="edit-avatar-upload"
              className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 transition-colors text-white px-6 py-2 rounded-xl text-sm cursor-pointer"
            >
              Change picture
            </label>
          </div>
          {/* Staff Identification Color Field */}
          <div>
            <label className="text-sm text-gray-200 block mb-2">Staff Identification Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="color"
                value={editedStaff.color}
                onChange={handleColorChange}
                className="w-12 h-12 bg-[#101010] rounded-xl cursor-pointer border border-gray-600"
              />
              <span className="text-sm text-gray-400">{editedStaff.color}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-200 block mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={editedStaff.firstName}
                onChange={handleInputChange}
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-200 block mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={editedStaff.lastName}
                onChange={handleInputChange}
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
              value={editedStaff.birthday}
              onChange={handleInputChange}
              className="w-full bg-[#101010] white-calendar-icon text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-200 block mb-2">Gender</label>
            <select
              name="gender"
              value={editedStaff.gender || ""}
              onChange={handleInputChange}
              className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              required
            >
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
              value={editedStaff.email}
              onChange={handleInputChange}
              className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-200 block mb-2">Phone No</label>
            <input
              type="tel"
              name="phone"
              value={editedStaff.phone}
              onChange={handleInputChange}
              className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-200 block mb-2">Street</label>
            <input
              type="text"
              name="street"
              value={editedStaff.street}
              onChange={handleInputChange}
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
                value={editedStaff.zipCode}
                onChange={handleInputChange}
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-200 block mb-2">City</label>
              <input
                type="text"
                name="city"
                value={editedStaff.city}
                onChange={handleInputChange}
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-200 block mb-2">Country</label>
            <select
              name="country"
              value={editedStaff.country}
              onChange={handleInputChange}
              className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              required
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
          <div>
            <label className="text-sm text-gray-200 block mb-2">Role</label>
            <select
              name="role"
              value={editedStaff.role}
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



          {/* Vacation Entitlement with Info Icon */}
          <div>
            <label className="text-sm text-gray-200 block mb-2 flex items-center gap-2">
              Vacation Entitlement per Year (Days)
              <div className="relative group">
                <Info size={14} className="text-gray-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  Changes will take effect next year
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            </label>
            <input
              type="number"
              name="vacationEntitlement"
              value={editedStaff.vacationEntitlement}
              onChange={handleInputChange}
              className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-200 block mb-2">About</label>
            <textarea
              name="about"
              value={editedStaff.about}
              onChange={handleInputChange}
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
              value={editedStaff.username}
              onChange={handleInputChange}
              className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-200 block mb-2">Password</label>
            <div className="relative">
              {isChangingPassword ? (
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={handlePasswordToggle}
                    className="absolute right-3 top-3 text-sm text-gray-400 hover:text-white"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              ) : (
                <input
                  type="password"
                  value="********"
                  disabled
                  className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none"
                />
              )}
              <button
                type="button"
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="absolute right-3 top-3 text-sm text-blue-500 hover:text-blue-400"
                style={{ right: isChangingPassword ? "60px" : "3px" }}
              >
                {isChangingPassword ? "Cancel" : "Change"}
              </button>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="fixed open_sans_font inset-0 w-full h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
      <div className="bg-[#181818] rounded-xl w-full max-w-md my-8 relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-lg open_sans_font_700">Edit Staff</h2>
            <button
              onClick={() => {
                setIsShowDetails(false)
                setSelectedStaff(null)
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex border-b border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "details" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
                }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("access")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "access" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
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
              <button
                type="button"
                onClick={() => handleRemovalStaff(editedStaff)}
                className="w-full sm:w-auto px-8 py-2.5 bg-transparent text-red-500 border-2 border-slate-500 rounded-xl text-sm hover:bg-slate-800 transition-colors"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditStaffModal