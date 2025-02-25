/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
"use client"

import { useState } from "react"
import { X } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import Avatar from "../../public/default-avatar.avif"

export default function StaffManagement() {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [isShowDetails, setIsShowDetails] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [staffToRemove, setStaffToRemove] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false)
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false)

  const openModal = () => setIsModalVisible(true)
  const closeModal = () => setIsModalVisible(false)

  const [staffMembers, setStaffMembers] = useState([
    {
      id: 1,
      firstName: "Natalia",
      lastName: "Brown",
      role: "Telephone operator",
      email: "natalia.brown@example.com",
      phone: "+1234567890",
      description: "Experienced telephone operator with excellent communication skills.",
      img: null,
      userId: "natalia.telephone-operator",
      username: "natalia.brown",
      street: "123 Main St",
      zipCode: "12345",
      city: "Anytown",
    },
    // Add more staff members here...
  ])

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      heading: "New Staff Member",
      description: "John Doe has been added to the staff.",
    },
    {
      id: 2,
      heading: "Schedule Update",
      description: "Sarah's work hours have been updated for next week.",
    },
  ])

  const removeNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const handleEdit = (staff) => {
    setSelectedStaff(staff)
    setIsShowDetails(true)
  }

  const handleRemovalStaff = (staff) => {
    setStaffToRemove(staff)
    setIsRemoveModalOpen(true)
  }

  const confirmRemoveStaff = () => {
    setStaffMembers(staffMembers.filter((member) => member.id !== staffToRemove.id))
    setIsRemoveModalOpen(false)
    setStaffToRemove(null)
    setIsShowDetails(false)
    toast.success("Staff member deleted successfully")
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <div className="flex relative rounded-3xl cursor-pointer bg-[#1C1C1C] text-white">
        <div className="flex-1 min-w-0 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
            <h1 className="text-xl sm:text-2xl oxanium_font text-white">Staff management</h1>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#FF843E] text-white open_sans_font px-6 sm:px-10 py-2 rounded-xl text-sm flex-1 sm:flex-none"
              >
                + Add Staff
              </button>
            </div>
          </div>

          <div className="flex justify-end flex-col lg:flex-row items-end max-w-4xl mx-auto mr-0 gap-2">
            <button
              onClick={() => setIsPlanningModalOpen(true)}
              className="bg-black lg:w-auto w-full py-2 px-6 text-sm rounded-xl cursor-pointer"
            >
              Employee Planning
            </button>
            <button
              onClick={() => setIsAttendanceModalOpen(true)}
              className="bg-black lg:w-auto w-full py-2 px-6 text-sm rounded-xl cursor-pointer"
            >
              Attendance Overview
            </button>
          </div>

          <div className="grid grid-cols-1 open_sans_font md:grid-cols-2 mt-8 sm:mt-[10%] gap-4 max-w-5xl mx-auto">
            {staffMembers.map((staff) => (
              <div key={staff.id} className="bg-[#141414] rounded-xl p-4 sm:p-6 flex flex-col items-center text-center">
                <div className="relative w-full mb-4">
                  <img
                    src={staff.img || Avatar}
                    width={80}
                    height={80}
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-full mx-auto"
                    alt={`${staff.firstName} ${staff.lastName}`}
                  />
                </div>
                <h3 className="text-white font-medium text-base sm:text-lg mb-1">
                  {staff.firstName} {staff.lastName}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-2">{staff.role}</p>
                <p className="text-gray-400 text-xs sm:text-sm mb-4">{staff.description}</p>
                <button
                  onClick={() => handleEdit(staff)}
                  className="text-white border border-slate-500 bg-black rounded-xl py-1.5 px-6 sm:px-8 hover:text-white text-sm w-fit"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>

        <aside
          className={`
          w-80 bg-[#181818] p-6 md:rounded-3xl rounded-none fixed top-0 bottom-0 right-0 z-50 lg:static lg:block
          ${isRightSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          transition-transform duration-500 ease-in-out
          `}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl oxanium_font font-bold">Notifications</h2>
            <button
              onClick={() => setIsRightSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-black/20 rounded-full transition-colors"
              aria-label="Close notifications"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4 open_sans_font">
            {notifications.map((notification) => (
              <div key={notification.id} className="bg-[#1C1C1C] rounded-xl  p-4 relative">
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="absolute top-4 right-4 text-zinc-500 hover:text-white"
                >
                  <X size={16} />
                </button>
                <h3 className="font-semibold open_sans_font_700 mb-2">{notification.heading}</h3>
                <p className="text-sm text-zinc-400">{notification.description}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {isModalOpen && (
        <AddStaffModal setIsModalOpen={setIsModalOpen} staffMembers={staffMembers} setStaffMembers={setStaffMembers} />
      )}

      {isShowDetails && selectedStaff && (
        <EditStaffModal
          staff={selectedStaff}
          setIsShowDetails={setIsShowDetails}
          setSelectedStaff={setSelectedStaff}
          staffMembers={staffMembers}
          setStaffMembers={setStaffMembers}
          handleRemovalStaff={handleRemovalStaff}
        />
      )}

      {isRemoveModalOpen && (
        <div
          className="fixed inset-0 open_sans_font cursor-pointer bg-black/50 flex items-center justify-center z-[1000] p-4 sm:p-6"
          onClick={() => setIsRemoveModalOpen(false)}
        >
          <div
            className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl sm:rounded-2xl overflow-hidden animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-base open_sans_font_700 sm:text-lg font-semibold text-white">Confirm Removal</h2>
              <button
                onClick={() => setIsRemoveModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="px-4 sm:px-6 py-4">
              <p className="text-white text-sm">Are you sure you want to remove this staff member?</p>
            </div>

            <div className="px-4 sm:px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={confirmRemoveStaff}
                className="w-full sm:w-auto px-5 py-2.5 bg-red-600 text-sm font-medium text-white rounded-xl hover:bg-red-700 transition-colors duration-200"
              >
                Yes, Remove
              </button>
              <button
                onClick={() => setIsRemoveModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-800 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isPlanningModalOpen && (
        <EmployeePlanningModal staffMembers={staffMembers} onClose={() => setIsPlanningModalOpen(false)} />
      )}

      {isAttendanceModalOpen && (
        <AttendanceOverviewModal staffMembers={staffMembers} onClose={() => setIsAttendanceModalOpen(false)} />
      )}
    </>
  )
}


function AddStaffModal({ setIsModalOpen, staffMembers, setStaffMembers }) {
  const [newStaff, setNewStaff] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    description: "",
    img: null,
    username: "",
    userId: "",
    street: "",
    zipCode: "",
    city: "",
    password: "",
  })

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
    }
    setStaffMembers([...staffMembers, newStaffMember])
    setIsModalOpen(false)
    toast.success("Staff member added successfully")
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

          <form onSubmit={handleSubmit} className="space-y-3 custom-scrollbar overflow-y-auto max-h-[70vh]">
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
              <input type="file" accept="img/*" onChange={handleImgUpload} className="hidden" id="avatar-upload" />
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
              <input
                type="password"
                name="password"
                value={newStaff.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-200 block mb-2">User ID</label>
              <input
                type="text"
                name="userId"
                value={newStaff.userId}
                onChange={handleInputChange}
                placeholder="Enter user ID"
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                required
                disabled
              />
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
              <label className="text-sm text-gray-200 block mb-2">Description</label>
              <textarea
                name="description"
                value={newStaff.description}
                onChange={handleInputChange}
                placeholder="Enter description"
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                rows={3}
              />
            </div>

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

function EditStaffModal({
  staff,
  setIsShowDetails,
  setSelectedStaff,
  staffMembers,
  setStaffMembers,
  handleRemovalStaff,
}) {
  const [editedStaff, setEditedStaff] = useState(staff)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedStaff((prev) => ({ ...prev, [name]: value }))
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
    const updatedStaffMembers = staffMembers.map((s) => (s.id === editedStaff.id ? editedStaff : s))
    setStaffMembers(updatedStaffMembers)
    setIsShowDetails(false)
    setSelectedStaff(null)
    toast.success("Staff member updated successfully")
  }

  return (
    <div className="fixed open_sans_font inset-0 w-full h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md my-8 relative">
        <div className="p-6">
          <button
            onClick={() => {
              setIsShowDetails(false)
              setSelectedStaff(null)
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <form onSubmit={handleSubmit} className="space-y-6 custom-scrollbar overflow-y-auto max-h-[70vh]">
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
              <input type="file" accept="img/*" onChange={handleImgUpload} className="hidden" id="edit-avatar-upload" />
              <label
                htmlFor="edit-avatar-upload"
                className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 transition-colors text-white px-6 py-2 rounded-xl text-sm cursor-pointer"
              >
                Change picture
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
              <label className="text-sm text-gray-200 block mb-2">Role</label>
              <select
                name="role"
                value={editedStaff.role}
                onChange={handleInputChange}
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                required
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
            </div>

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
              <label className="text-sm text-gray-200 block mb-2">User ID</label>
              <input
                type="text"
                name="userId"
                value={editedStaff.userId}
                onChange={handleInputChange}
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Note: User ID can only be changed in the Configuration tab.</p>

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
              <label className="text-sm text-gray-200 block mb-2">Description</label>
              <textarea
                name="description"
                value={editedStaff.description}
                onChange={handleInputChange}
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                rows={3}
              />
            </div>

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

function EmployeePlanningModal({ staffMembers, onClose }) {
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [schedule, setSchedule] = useState({})

  const handleStaffSelect = (staff) => {
    setSelectedStaff(staff)
    setSchedule({
      Monday: "9:00-17:00",
      Tuesday: "9:00-17:00",
      Wednesday: "9:00-17:00",
      Thursday: "9:00-17:00",
      Friday: "9:00-17:00",
    })
  }

  const handleScheduleChange = (day, value) => {
    setSchedule((prev) => ({ ...prev, [day]: value }))
  }

  const handleSave = () => {
    console.log("Saving schedule for", selectedStaff.firstName, schedule)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#181818] text-white rounded-xl p-4 md:p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Employee Planning</h2>
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          {/* Staff List Section */}
          <div className="w-full md:w-1/3">
            <h3 className="text-lg font-semibold mb-2">Staff</h3>
            <ul className="space-y-2 max-h-48 md:max-h-96 overflow-y-auto">
              {staffMembers.map((staff) => (
                <li
                  key={staff.id}
                  className={`cursor-pointer p-2 rounded text-sm md:text-base
                    ${selectedStaff?.id === staff.id ? "bg-blue-500" : "hover:bg-gray-700"}`}
                  onClick={() => handleStaffSelect(staff)}
                >
                  {staff.firstName} {staff.lastName}
                </li>
              ))}
            </ul>
          </div>

          {/* Schedule Section */}
          <div className="w-full md:w-2/3">
            <h3 className="text-lg font-semibold mb-2">Schedule</h3>
            {selectedStaff ? (
              <div className="space-y-2">
                {Object.entries(schedule).map(([day, hours]) => (
                  <div
                    key={day}
                    className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2"
                  >
                    <span className="w-24 text-sm md:text-base">{day}</span>
                    <input
                      type="text"
                      value={hours}
                      onChange={(e) => handleScheduleChange(day, e.target.value)}
                      className="bg-[#141414] rounded px-3 py-2 text-sm md:text-base w-full sm:flex-grow"
                    />
                  </div>
                ))}
                <button
                  onClick={handleSave}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded text-sm md:text-base w-full sm:w-auto"
                >
                  Save Schedule
                </button>
              </div>
            ) : (
              <p className="text-sm md:text-base">Select a staff member to view and edit their schedule.</p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-6 bg-gray-500 text-white px-4 py-2 rounded text-sm md:text-base w-full sm:w-auto"
        >
          Close
        </button>
      </div>
    </div>
  )
}

function AttendanceOverviewModal({ staffMembers, onClose }) {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedDate, setSelectedDate] = useState(new Date())

  const dummyAttendanceData = staffMembers.map((staff) => ({
    ...staff,
    checkIn: "09:00",
    checkOut: "17:00",
    hoursWorked: 8,
  }))

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period)
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#181818] rounded-xl text-white p-4 md:p-6 w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-4">Attendance Overview</h2>

        {/* Controls */}
        <div className="mb-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => handlePeriodChange(e.target.value)}
            className="bg-[#141414] rounded px-3 py-2 text-sm md:text-base w-full sm:w-auto"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
          <input
            type="date"
            value={selectedDate.toISOString().split("T")[0]}
            onChange={(e) => handleDateChange(new Date(e.target.value))}
            className="bg-[#141414] rounded px-3 py-2 text-sm md:text-base w-full sm:w-auto"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="text-sm md:text-base">
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Check In</th>
                <th className="text-left py-2">Check Out</th>
                <th className="text-left py-2">Hours Worked</th>
              </tr>
            </thead>
            <tbody>
              {dummyAttendanceData.map((staff) => (
                <tr key={staff.id} className="text-sm md:text-base">
                  <td className="py-2">
                    {staff.firstName} {staff.lastName}
                  </td>
                  <td className="py-2">{staff.checkIn}</td>
                  <td className="py-2">{staff.checkOut}</td>
                  <td className="py-2">{staff.hoursWorked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={onClose}
          className="mt-6 bg-gray-500 cursor-pointer text-white px-8 py-2 rounded-xl text-sm w-full sm:w-auto"
        >
          Close
        </button>
      </div>
    </div>
  )
}

