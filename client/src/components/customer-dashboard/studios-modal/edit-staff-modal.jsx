/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import Avatar from "../../../../public/default-avatar.avif"

export default function EditStaffModal({
  isOpen,
  onClose,
  onSave,
  staff,
  handleRemovalStaff
}) {
  const [editedStaff, setEditedStaff] = useState({
    id: '',
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Load staff data when modal opens or staff changes
  useEffect(() => {
    if (isOpen && staff) {
      setEditedStaff({
        id: staff.id || '',
        firstName: staff.firstName || '',
        lastName: staff.lastName || '',
        birthday: staff.birthday || '',
        email: staff.email || '',
        phone: staff.phone || '',
        role: staff.role || '',
        vacationEntitlement: staff.vacationEntitlement || 0,
        username: staff.username || '',
        password: staff.password || '',
        street: staff.street || '',
        zipCode: staff.zipCode || '',
        city: staff.city || '',
        description: staff.description || '',
        img: staff.img || ''
      })
      setShowPassword(false)
      setShowDeleteConfirm(false)
    }
  }, [isOpen, staff])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedStaff((prev) => ({ ...prev, [name]: value }))
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
    onSave(editedStaff)
  }

  const handleDelete = () => {
    if (showDeleteConfirm) {
      handleRemovalStaff(editedStaff)
    } else {
      setShowDeleteConfirm(true)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  if (!isOpen || !staff) return null

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
            <div className="flex items-center justify-between">
              <h1 className="text-white text-xl font-bold">Edit Staff</h1>
              <button
                type="button"
                onClick={handleDelete}
                className={`p-2 rounded-lg transition-colors ${
                  showDeleteConfirm 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'text-gray-400 hover:text-red-400 hover:bg-red-400/10'
                }`}
                title={showDeleteConfirm ? 'Confirm Delete' : 'Delete Staff'}
              >
                <Trash2 size={18} />
              </button>
            </div>

            {showDeleteConfirm && (
              <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
                <p className="text-red-400 text-sm mb-3">
                  Are you sure you want to delete this staff member? This action cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelDelete}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex flex-col items-start">
              <div className="w-24 h-24 rounded-xl overflow-hidden mb-4">
                <img
                  src={editedStaff.img || Avatar}
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
                Upload picture
              </label>
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
                  placeholder="Enter first name"
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
                value={editedStaff.birthday}
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
                value={editedStaff.email}
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
                value={editedStaff.phone}
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
                value={editedStaff.role}
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
                value={editedStaff.vacationEntitlement}
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
                value={editedStaff.username}
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
                  value={editedStaff.password}
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
                value={editedStaff.street}
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
                  value={editedStaff.zipCode}
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
                  value={editedStaff.city}
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
                value={editedStaff.description}
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
                Update Staff
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