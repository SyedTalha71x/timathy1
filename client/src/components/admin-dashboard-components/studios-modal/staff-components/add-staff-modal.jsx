/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import Avatar from "../../../../../public/gray-avatar-fotor-20250912192528.png"

export default function AddStaffModal({
  isOpen,
  onClose,
  onSave
}) {
  const [newStaff, setNewStaff] = useState({
    firstName: '',
    lastName: '',
    birthday: '',
    email: '',
    phone: '',
    role: '',
    vacationEntitlement: 0,
    username: '',
    password: '',
    street: '',
    zipCode: '',
    city: '',
    description: '',
    img: ''
  })
  const [showPassword, setShowPassword] = useState(false)

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
        vacationEntitlement: 0,
        username: '',
        password: '',
        street: '',
        zipCode: '',
        city: '',
        description: '',
        img: ''
      })
      setShowPassword(false)
    }
  }, [isOpen])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewStaff((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword)
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

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(newStaff)
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

          <form onSubmit={handleSubmit} className="space-y-6 custom-scrollbar overflow-y-auto max-h-[70vh]">
            <div>
              <h1 className="text-white text-xl font-bold">Add New Staff</h1>
            </div>
            
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
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-200 block mb-2">Vacation Entitlement (Days)</label>
              <input
                type="number"
                name="vacationEntitlement"
                value={newStaff.vacationEntitlement}
                onChange={handleInputChange}
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                placeholder="Enter vacation days"
                required
              />
            </div>

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