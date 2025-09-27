
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { X } from "lucide-react"
import { useState } from "react"
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
    img: null,
    username: "",
    userId: "",
    street: "",
    zipCode: "",
    city: "",
    country: "",
    password: "",
    vacationEntitlement: 30,
    birthday: "",
  })

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewStaff((prev) => ({ ...prev, [name]: value }))
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

  function createPassword() {
    return Math.random().toString(36).slice(-8)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newStaffMember = {
      ...newStaff,
      id: staffMembers.length + 1,
      userId: newStaff.username,
      description: newStaff.about, // Map 'about' to 'description' for compatibility
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
            <label className="text-sm text-gray-200 block mb-2">Vacation Entitlement (Days)</label>
            <input
              type="number"
              name="vacationEntitlement"
              value={newStaff.vacationEntitlement}
              onChange={handleInputChange}
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
