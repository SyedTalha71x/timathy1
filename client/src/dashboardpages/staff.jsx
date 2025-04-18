/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, createContext } from "react"
import { X, Calendar, Users, Menu } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import Avatar from "../../public/default-avatar.avif"

const StaffContext = createContext(null)

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
  const [leaveRequests, setLeaveRequests] = useState([])
  const [isLeaveRequestModalOpen, setIsLeaveRequestModalOpen] = useState(false)
  const [isVacationRequestModalOpen, setIsVacationRequestModalOpen] = useState(false)

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
      vacationEntitlement: 30,
      birthday: "1990-05-10",
    },
    {
      id: 2,
      firstName: "John",
      lastName: "Doe",
      role: "Software Engineer",
      email: "john.doe@example.com",
      phone: "+9876543210",
      description: "Experienced software developer with excellent communication skills.",
      img: null,
      userId: "john.software-engineer",
      username: "john.doe",
      street: "456 Oak Ave",
      zipCode: "67890",
      city: "Othertown",
      vacationEntitlement: 25,
      birthday: "1992-11-20",
    },
  ])

  const handleLeaveRequest = (staffId, startDate, endDate) => {
    const newRequest = {
      id: leaveRequests.length + 1,
      staffId,
      startDate,
      endDate,
      status: "Pending",
    }
    setLeaveRequests([...leaveRequests, newRequest])
    toast.success("Leave request submitted for approval")
  }

  const handleApproveLeave = (requestId) => {
    setLeaveRequests(
      leaveRequests.map((request) => (request.id === requestId ? { ...request, status: "Approved" } : request)),
    )
    toast.success("Leave request approved")
  }

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

  const handleVacationRequest = (staffId, startDate, endDate) => {
    // Here you would typically send this data to your backend
    console.log(`Vacation request for staff ${staffId} from ${startDate} to ${endDate}`)
    toast.success("Vacation request submitted for approval")
  }

  return (
    <StaffContext.Provider value={{ staffMembers, setStaffMembers }}>
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

              <div className="flex items-center md:flex-row flex-col gap-4 w-full sm:w-auto">
                <button
                  onClick={() => setIsPlanningModalOpen(true)}
                  className="bg-black lg:w-auto w-full py-2 px-6 text-sm rounded-xl cursor-pointer flex items-center justify-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Employee Planning
                </button>
                <button
                  onClick={() => setIsAttendanceModalOpen(true)}
                  className="bg-black lg:w-auto w-full py-2 px-6 text-sm rounded-xl cursor-pointer flex items-center justify-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Attendance Overview
                </button>
                <button
                  onClick={() => setIsVacationRequestModalOpen(true)}
                  className="bg-black lg:w-auto w-full py-2 px-6 text-sm rounded-xl cursor-pointer flex items-center justify-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Request Vacation
                </button>
              
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#FF843E] text-white lg:w-auto w-full open_sans_font px-6 sm:px-10 py-2 rounded-xl text-sm flex-1 sm:flex-none"
                >
                  + Add Staff
                </button>
                <button
                  onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                  className=" lg:w-auto lg:block hidden w-full text-sm rounded-xl cursor-pointer flex items-center justify-center gap-2"
                >
                  <Menu className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 open_sans_font md:grid-cols-2 mt-8 sm:mt-[10%] gap-4 max-w-5xl mx-auto">
              {staffMembers.map((staff) => (
                <div
                  key={staff.id}
                  className="bg-[#141414] rounded-xl p-4 sm:p-6 flex flex-col items-center text-center"
                >
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
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEdit(staff)}
                      className="text-white border border-slate-500 bg-black rounded-xl py-1.5 px-4 sm:px-6 hover:text-white text-sm"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside
            className={`
            w-80 bg-[#181818] p-6 md:rounded-3xl rounded-none fixed top-0 bottom-0 right-0 z-50
            ${isRightSidebarOpen ? "translate-x-0" : "translate-x-full"}
            transition-transform duration-500 ease-in-out
            `}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl oxanium_font font-bold">Notifications</h2>
              <button
                onClick={() => setIsRightSidebarOpen(false)}
                className=" p-2 hover:bg-black/20 rounded-full transition-colors"
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
          <AddStaffModal
            setIsModalOpen={setIsModalOpen}
            staffMembers={staffMembers}
            setStaffMembers={setStaffMembers}
          />
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

        {isVacationRequestModalOpen && (
          <VacationRequestModal
            staffMember={staffMembers[0]} // Default to first staff member
            onClose={() => setIsVacationRequestModalOpen(false)}
            onSubmit={handleVacationRequest}
          />
        )}
      </>
    </StaffContext.Provider>
  )
}

function AddStaffModal({ setIsModalOpen, staffMembers, setStaffMembers }) {
  const [showPassword, setShowPassword] = useState(false)

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
    vacationEntitlement: 30,
    birthday: "", // Added new birthday field
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
            {/* <div>
              <label className="text-sm text-gray-200 block mb-2">
                User ID
              </label>
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
            </div> */}
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
  const [showPassword, setShowPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")

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
    const updatedStaff = { ...editedStaff }
    if (isChangingPassword && newPassword) {
      updatedStaff.password = newPassword
    }
    const updatedStaffMembers = staffMembers.map((s) => (s.id === updatedStaff.id ? updatedStaff : s))
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
              />
            </div>

            <div>
              <label className="text-sm text-gray-200 block mb-2">Vacation Entitlement (Days)</label>
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
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [shifts, setShifts] = useState({})
  const [selectedDate, setSelectedDate] = useState(null)
  const [shiftPeriod, setShiftPeriod] = useState("")
  const [showShiftForm, setShowShiftForm] = useState(false)
  // New state for date range booking
  const [isRangeBooking, setIsRangeBooking] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // Generate calendar days for the current month view
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)

    const daysInMonth = lastDayOfMonth.getDate()
    const firstDayOfWeek = firstDayOfMonth.getDay() // 0 = Sunday, 1 = Monday, etc.

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const calendarDays = generateCalendarDays()

  const handleStaffSelect = (staff) => {
    setSelectedStaff(staff)
    // Load existing shifts for this staff member (in a real app, this would come from your backend)
    const staffShifts = {}
    // Example: Add some sample shifts
    const today = new Date()
    const dateStr1 = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString().split("T")[0]
    const dateStr2 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString().split("T")[0]
    staffShifts[dateStr1] = "9:00-17:00"
    staffShifts[dateStr2] = "10:00-18:00"
    setShifts(staffShifts)

    // Reset date range selection when changing staff
    setStartDate(null)
    setEndDate(null)
    setIsRangeBooking(false)
  }

  const handleDateClick = (date) => {
    if (isRangeBooking) {
      // Handle date range selection
      if (!startDate) {
        setStartDate(date)
      } else if (!endDate && date >= startDate) {
        setEndDate(date)
        // Open shift form after selecting both dates
        setSelectedDate(startDate)
        const dateStr = startDate.toISOString().split("T")[0]
        setShiftPeriod(shifts[dateStr] || "")
        setShowShiftForm(true)
      } else {
        // Reset and start new selection
        setStartDate(date)
        setEndDate(null)
      }
    } else {
      // Original single date selection
      const dateStr = date.toISOString().split("T")[0]
      setSelectedDate(date)
      setShiftPeriod(shifts[dateStr] || "")
      setShowShiftForm(true)
    }
  }

  const handleSaveShift = () => {
    if (isRangeBooking && startDate && endDate) {
      // Save shifts for the entire date range
      const newShifts = { ...shifts }
      const currentDate = new Date(startDate)

      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split("T")[0]
        newShifts[dateStr] = shiftPeriod
        currentDate.setDate(currentDate.getDate() + 1)
      }

      setShifts(newShifts)
      setShowShiftForm(false)
      toast.success(`Shifts saved from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`)

      // Reset date range selection
      setStartDate(null)
      setEndDate(null)
    } else if (!isRangeBooking && selectedDate) {
      // Original single date save
      if (!selectedDate || !shiftPeriod) return

      const dateStr = selectedDate.toISOString().split("T")[0]
      setShifts((prev) => ({
        ...prev,
        [dateStr]: shiftPeriod,
      }))
      setShowShiftForm(false)
      toast.success(`Shift saved for ${selectedDate.toLocaleDateString()}`)
    }
  }

  const handleDeleteShift = () => {
    if (isRangeBooking && startDate && endDate) {
      // Delete shifts for the entire date range
      const newShifts = { ...shifts }
      const currentDate = new Date(startDate)

      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split("T")[0]
        delete newShifts[dateStr]
        currentDate.setDate(currentDate.getDate() + 1)
      }

      setShifts(newShifts)
      setShowShiftForm(false)
      toast.success(`Shifts deleted from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`)

      // Reset date range selection
      setStartDate(null)
      setEndDate(null)
    } else if (!isRangeBooking && selectedDate) {
      // Original single date delete
      if (!selectedDate) return

      const dateStr = selectedDate.toISOString().split("T")[0]
      const newShifts = { ...shifts }
      delete newShifts[dateStr]
      setShifts(newShifts)
      setShowShiftForm(false)
      toast.success(`Shift deleted for ${selectedDate.toLocaleDateString()}`)
    }
  }

  const handleSaveAllShifts = () => {
    if (!selectedStaff) return

    console.log("Saving all shifts for", selectedStaff.firstName, shifts)
    toast.success("All shifts saved successfully")
    onClose()
  }

  // Toggle between single date and date range booking modes
  const toggleRangeBooking = () => {
    setIsRangeBooking(!isRangeBooking)
    setStartDate(null)
    setEndDate(null)
  }

  // Check if a date has a shift booked
  const hasShift = (date) => {
    const dateStr = date.toISOString().split("T")[0]
    return shifts[dateStr] !== undefined
  }

  // Check if a date is within the selected range
  const isInSelectedRange = (date) => {
    if (!startDate || !date) return false
    if (!endDate) return date.getTime() === startDate.getTime()
    return date >= startDate && date <= endDate
  }

  // Format the date for display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Format date range for display
  const formatDateRange = () => {
    if (!startDate) return "Select start date"
    if (!endDate) return `From ${formatDate(startDate)} - Select end date`
    return `From ${formatDate(startDate)} to ${formatDate(endDate)}`
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 ">
      <div className="bg-[#181818] text-white rounded-xl p-4 md:p-6 w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-4">Employee Planning</h2>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 max-h-[60vh] overflow-y-auto">
          {/* Staff List Section */}
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Staff</h3>
            <div className="bg-[#141414] rounded-xl p-2 max-h-[500px] overflow-y-auto">
              <ul className="space-y-1">
                {staffMembers.map((staff) => (
                  <li
                    key={staff.id}
                    className={`cursor-pointer p-2 rounded-lg text-sm
                      ${selectedStaff?.id === staff.id ? "bg-blue-600 text-white" : "hover:bg-gray-700"}`}
                    onClick={() => handleStaffSelect(staff)}
                  >
                    {staff.firstName} {staff.lastName}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="w-full md:w-3/4">
            {selectedStaff ? (
              showShiftForm ? (
                <div className="bg-[#141414] rounded-xl p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Book Shift</h3>
                    <button onClick={() => setShowShiftForm(false)} className="text-gray-400 hover:text-white">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-300 block mb-2">
                        {isRangeBooking ? "Date Range" : "Date"}
                      </label>
                      <div className="bg-[#1C1C1C] px-4 py-2 rounded-lg">
                        {isRangeBooking ? formatDateRange() : formatDate(selectedDate)}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-300 block mb-2">Shift Period</label>
                      <input
                        type="text"
                        value={shiftPeriod}
                        onChange={(e) => setShiftPeriod(e.target.value)}
                        placeholder="e.g. 9:00-17:00"
                        className="w-full bg-[#1C1C1C] rounded-lg px-4 py-2 text-white"
                      />
                      <p className="text-xs text-gray-400 mt-1">Format: start-end (e.g. 9:00-17:00)</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-6">
                    <button
                      onClick={handleSaveShift}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      {isRangeBooking ? "Save Shifts for Range" : "Save Shift"}
                    </button>
                    {(isRangeBooking ? startDate && endDate : hasShift(selectedDate)) && (
                      <button
                        onClick={handleDeleteShift}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        {isRangeBooking ? "Delete Shifts for Range" : "Delete Shift"}
                      </button>
                    )}
                    <button
                      onClick={() => setShowShiftForm(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm ml-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-[#141414] rounded-xl p-4">
                    <div className="flex md:justify-between md:flex-row gap-3 justify-center flex-col items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        Schedule for {selectedStaff.firstName} {selectedStaff.lastName}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <button onClick={goToPreviousMonth} className="p-1 bg-[#1C1C1C] rounded-lg hover:bg-gray-700">
                          &lt;
                        </button>
                        <span className="text-sm font-medium">
                          {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                        </span>
                        <button onClick={goToNextMonth} className="p-1 bg-[#1C1C1C] rounded-lg hover:bg-gray-700">
                          &gt;
                        </button>
                      </div>
                    </div>

                    {/* Booking mode toggle */}
                    <div className="flex justify-end mb-2">
                      <button
                        onClick={toggleRangeBooking}
                        className={`text-xs px-3 py-1 rounded-lg ${isRangeBooking ? "bg-blue-600" : "bg-[#1C1C1C] hover:bg-gray-700"
                          }`}
                      >
                        {isRangeBooking ? "Range Booking: ON" : "Range Booking: OFF"}
                      </button>
                    </div>

                    {/* Range selection info */}
                    {isRangeBooking && (
                      <div className="mb-2 text-xs text-gray-300 bg-[#1C1C1C] p-2 rounded-lg">
                        {!startDate
                          ? "Select a start date"
                          : !endDate
                            ? "Now select an end date"
                            : `Selected range: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}
                      </div>
                    )}

                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                        <div key={day} className="text-center text-xs font-medium py-1">
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((day, index) => {
                        if (!day) return <div key={`empty-${index}`} className="opacity-0"></div>

                        const dateStr = day.toISOString().split("T")[0]
                        const hasShiftBooked = shifts[dateStr] !== undefined
                        const isWeekend = day.getDay() === 0 || day.getDay() === 6
                        const isSelected = isInSelectedRange(day)

                        return (
                          <div
                            key={dateStr}
                            className={`
                              relative text-center p-2 rounded-md text-sm cursor-pointer
                              ${hasShiftBooked ? "bg-blue-600/40" : ""}
                              ${isSelected ? "bg-green-600/40 border border-green-500" : ""}
                              ${isWeekend ? "text-gray-500" : ""}
                              ${!hasShiftBooked && !isSelected ? "hover:bg-gray-700" : hasShiftBooked ? "hover:bg-blue-600/60" : ""}
                            `}
                            onClick={() => handleDateClick(day)}
                          >
                            <span>{day.getDate()}</span>

                            {hasShiftBooked && (
                              <div className="absolute bottom-0 left-0 right-0 text-[10px] text-center pb-0.5 px-0.5 truncate">
                                {shifts[dateStr]}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleSaveAllShifts}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Save All Shifts
                      </button>
                    </div>
                  </div>

                  {/* Shift List */}
                  <div className="mt-4 bg-[#141414] rounded-xl p-4">
                    <h3 className="text-lg font-semibold mb-2">Scheduled Shifts</h3>
                    {Object.keys(shifts).length > 0 ? (
                      <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {Object.entries(shifts).map(([dateStr, period]) => {
                          const date = new Date(dateStr)
                          return (
                            <div
                              key={dateStr}
                              className="flex justify-between text-sm items-center p-2 bg-[#1C1C1C] rounded-lg hover:bg-[#242424] cursor-pointer"
                              onClick={() => {
                                setSelectedDate(date)
                                setShiftPeriod(period)
                                setIsRangeBooking(false) // Switch to single date mode when editing
                                setShowShiftForm(true)
                              }}
                            >
                              <span>
                                {date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                              </span>
                              <span className="font-medium">{period}</span>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No shifts scheduled yet. Click on a date to add a shift.</p>
                    )}
                  </div>
                </>
              )
            ) : (
              <div className="bg-[#141414] rounded-xl p-6 flex items-center justify-center h-[400px]">
                <p className="text-gray-400">Select a staff member to view and edit their schedule.</p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          Close
        </button>
      </div>
    </div>
  )
}

function AttendanceOverviewModal({ staffMembers, onClose }) {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [selectedStaffId, setSelectedStaffId] = useState("all")

  const dummyAttendanceData = staffMembers.map((staff) => ({
    ...staff,
    checkIn: "09:00",
    checkOut: "17:00",
    hoursWorked: 8,
  }))

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period)
  }

  const calculateTotalHours = (staff) => {
    // Dummy calculation: Replace with actual logic based on attendance records
    const daysInPeriod = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
    return staff.hoursWorked * daysInPeriod
  }

  const filteredStaff =
    selectedStaffId === "all"
      ? dummyAttendanceData
      : dummyAttendanceData.filter((staff) => staff.id === Number.parseInt(selectedStaffId))

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
            <option value="custom">Custom</option>
          </select>
          <input
            type="date"
            value={startDate.toISOString().split("T")[0]}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            className="bg-[#141414] white-calendar-icon rounded px-3 py-2 text-sm md:text-base w-full sm:w-auto"
          />
          {selectedPeriod === "custom" && (
            <input
              type="date"
              value={endDate.toISOString().split("T")[0]}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="bg-[#141414] white-calendar-icon rounded px-3 py-2 text-sm md:text-base w-full sm:w-auto"
            />
          )}
          <select
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            className="bg-[#141414] rounded px-3 py-2 text-sm md:text-base w-full sm:w-auto"
          >
            <option value="all">All Staff Members</option>
            {staffMembers.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.firstName} {staff.lastName}
              </option>
            ))}
          </select>
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
                <th className="text-left py-2">Total Hours (Period)</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="text-sm md:text-base">
                  <td className="py-2">
                    {staff.firstName} {staff.lastName}
                  </td>
                  <td className="py-2">{staff.checkIn}</td>
                  <td className="py-2">{staff.checkOut}</td>
                  <td className="py-2">{staff.hoursWorked}</td>
                  <td className="py-2">{calculateTotalHours(staff)}</td>
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

function VacationRequestModal({ staffMember, onClose, onSubmit }) {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [showCalendar, setShowCalendar] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [vacationRequests, setVacationRequests] = useState([])
  const [showRequestForm, setShowRequestForm] = useState(false)

  // Dummy vacation data - in a real app, this would come from your backend
  const [bookedVacations, setBookedVacations] = useState([
    { id: 1, staffId: 1, startDate: new Date(2024, 0, 5), endDate: new Date(2024, 0, 10), status: "approved" },
    { id: 2, staffId: 1, startDate: new Date(2024, 1, 15), endDate: new Date(2024, 1, 20), status: "pending" },
    { id: 3, staffId: 2, startDate: new Date(2024, 3, 1), endDate: new Date(2024, 3, 5), status: "pending" },
    { id: 4, staffId: 2, startDate: new Date(2024, 0, 5), endDate: new Date(2024, 0, 10), status: "approved" },
  ])

  // Calculate remaining vacation days
  const remainingVacationDays = staffMember?.vacationEntitlement || 30 - 5 // Dummy calculation, replace with actual logic

  const handleSubmit = () => {
    const newVacation = {
      id: bookedVacations.length + 1,
      staffId: staffMember.id,
      startDate: startDate,
      endDate: endDate,
      status: "pending",
    }

    setBookedVacations([...bookedVacations, newVacation])
    onSubmit(staffMember.id, startDate, endDate)
    setShowRequestForm(false)
    toast.success("Vacation request submitted successfully")
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
    setStartDate(date)
    setEndDate(date)
    setShowRequestForm(true)
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // Check if a date has vacation bookings
  const getDateBookings = (date) => {
    return bookedVacations.filter((vacation) => {
      const vacationStart = new Date(vacation.startDate)
      const vacationEnd = new Date(vacation.endDate)
      return date >= vacationStart && date <= vacationEnd
    })
  }

  // Generate calendar days for the current month view
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)

    const daysInMonth = lastDayOfMonth.getDate()
    const firstDayOfWeek = firstDayOfMonth.getDay() // 0 = Sunday, 1 = Monday, etc.

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const calendarDays = generateCalendarDays()

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#181818] rounded-xl text-white p-4 md:p-6 w-full max-w-md">
        {showRequestForm ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Request Vacation</h2>
              <button onClick={() => setShowRequestForm(false)} className="text-gray-300 hover:text-white">
                <Calendar className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-300">
                Remaining vacation days: <span className="font-bold text-white">{remainingVacationDays}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 block mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate.toISOString().split("T")[0]}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  className="bg-[#141414] white-calendar-icon rounded px-3 py-2 text-sm md:text-base w-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 block mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate.toISOString().split("T")[0]}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                  className="bg-[#141414] white-calendar-icon rounded px-3 py-2 text-sm md:text-base w-full"
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm w-full">
                Submit
              </button>
              <button
                onClick={() => setShowRequestForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-xl text-sm w-full"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Vacation Calendar</h2>
              <button onClick={onClose} className="text-gray-300 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <button onClick={goToPreviousMonth} className="text-gray-300 hover:text-white p-1">
                  &lt;
                </button>
                <h3 className="font-medium">
                  {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </h3>
                <button onClick={goToNextMonth} className="text-gray-300 hover:text-white p-1">
                  &gt;
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div key={day} className="text-center text-xs font-medium py-1">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  if (!day) return <div key={index} className="opacity-0"></div>

                  const bookings = getDateBookings(day)
                  const myPendingBookings = bookings.filter(
                    (b) => b.staffId === staffMember.id && b.status === "pending",
                  )
                  const myApprovedBookings = bookings.filter(
                    (b) => b.staffId === staffMember.id && b.status === "approved",
                  )
                  const colleagueBookings = bookings.filter((b) => b.staffId !== staffMember.id)

                  const hasMyPending = myPendingBookings.length > 0
                  const hasMyApproved = myApprovedBookings.length > 0
                  const hasColleagueBookings = colleagueBookings.length > 0

                  return (
                    <div
                      key={index}
                      className={`
                        relative text-center p-2 rounded-md text-sm cursor-pointer
                        ${hasMyPending ? "bg-orange-500/30" : ""}
                        ${hasMyApproved ? "bg-green-500/30" : ""}
                        ${!hasMyPending && !hasMyApproved ? "hover:bg-blue-600/30" : ""}
                      `}
                      onClick={() => handleDateClick(day)}
                    >
                      <span>{day.getDate()}</span>

                      {/* Indicators for multiple bookings */}
                      {(hasMyPending || hasMyApproved || hasColleagueBookings) && (
                        <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1 pb-0.5">
                          {hasMyPending && <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>}
                          {hasMyApproved && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                          {hasColleagueBookings && <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500/30 rounded-sm mr-1"></div>
                  <span>Not Approved</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500/30 rounded-sm mr-1"></div>
                  <span>Approved</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-500/30 rounded-sm mr-1"></div>
                  <span>Colleagues</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-600/30 rounded-sm mr-1"></div>
                  <span>Selected</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

