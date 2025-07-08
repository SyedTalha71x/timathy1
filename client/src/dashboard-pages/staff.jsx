/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, createContext } from "react"
import { X, Calendar, Users, Menu, ChevronLeft, ChevronRight, History, MessageCircle, Download } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import Avatar from "../../public/default-avatar.avif"
import AddStaffModal from "../components/staff-components/add-staff-modal"
import EditStaffModal from "../components/staff-components/edit-staff-modal"
import EmployeePlanningModal from "../components/staff-components/employee-planning-modal"
import AttendanceOverviewModal from "../components/staff-components/attendance-overview-modal"
import VacationRequestModal from "../components/staff-components/vacation-request-modal"
import StaffHistoryModal from "../components/staff-components/staff-history-modal"
import { SidebarArea } from "../components/custom-sidebar"
import { useNavigate } from "react-router-dom"
import Rectangle1 from "../../public/Rectangle 1.png"


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
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [selectedStaffForHistory, setSelectedStaffForHistory] = useState(null)

  const navigate = useNavigate();
  const [staffMembers, setStaffMembers] = useState([
    {
      id: 1,
      firstName: "Natalia",
      lastName: "Brown",
      role: "Telephone operator",
      email: "natalia.brown@example.com",
      phone: "+1234567890",
      description: "Experienced telephone operator with excellent communication skills.",
      img: Avatar,
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
      img: Avatar,
      userId: "john.software-engineer",
      username: "john.doe",
      street: "456 Oak Ave",
      zipCode: "67890",
      city: "Othertown",
      vacationEntitlement: 25,
      birthday: "1992-11-20",
    },
  ])

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
    console.log(`Vacation request for staff ${staffId} from ${startDate} to ${endDate}`)
    toast.success("Vacation request submitted for approval")
  }

  const handleHistoryClick = (staff) => {
    setSelectedStaffForHistory(staff)
    setIsHistoryModalOpen(true)
  }

  const handleChatClick = (staff) => {
    // Simulate redirect to staff communication with tagged staff member
    window.location.href = `/dashboard/communication`
    // toast.success(`Redirecting to Staff Communication with @${staff.firstName} ${staff.lastName} tagged`)
  }

  const [communications, setCommunications] = useState([
    {
      id: 1,
      name: "John Doe",
      message: "Hey, how's the project going?",
      time: "2 min ago",
      avatar: Rectangle1,
    },
    {
      id: 2,
      name: "Jane Smith",
      message: "Meeting scheduled for tomorrow",
      time: "10 min ago",
      avatar: Rectangle1,
    },
  ])

  const [todos, setTodos] = useState([
    {
      id: 1,
      title: "Review project proposal",
      description: "Check the latest updates",
      assignee: "Mike",
    },
    {
      id: 2,
      title: "Update documentation",
      description: "Add new features info",
      assignee: "Sarah",
    },
  ])

  const [birthdays, setBirthdays] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      date: "Dec 15, 2024",
      avatar: Avatar,
    },
    {
      id: 2,
      name: "Bob Wilson",
      date: "Dec 20, 2024",
      avatar: Avatar,
    },
  ])

  const [customLinks, setCustomLinks] = useState([
    {
      id: 1,
      title: "Google Drive",
      url: "https://drive.google.com",
    },
    {
      id: 2,
      title: "GitHub",
      url: "https://github.com",
    },
  ])

  const [openDropdownIndex, setOpenDropdownIndex] = useState(null)
  const [editingLink, setEditingLink] = useState(null)

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }

  const closeSidebar = () => {
    setIsRightSidebarOpen(false)
  }

  const redirectToCommunication = () => {
    navigate("/dashboard/communication")
  }

  const redirectToTodos = () => {
    console.log("Redirecting to todos page")
    navigate("/dashboard/to-do")
  }

  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index)
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
              <div className="flex md:w-auto w-full justify-between items-center gap-2">

                <div></div>
                <h1 className="text-xl sm:text-2xl oxanium_font text-white">Staff management</h1>
                <button
                  onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                  className=" lg:hidden text-sm rounded-xl cursor-pointer block"
                >
                  <Menu className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center md:flex-row flex-col gap-4 w-full sm:w-auto">
                <button
                  onClick={() => setIsPlanningModalOpen(true)}
                  className="bg-black lg:w-auto w-full py-2 px-6 text-sm rounded-xl cursor-pointer flex items-center justify-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Shift planning
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
                  className=" lg:w-auto lg:block  w-full text-sm rounded-xl cursor-pointer hidden items-center justify-center gap-2"
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
                      src={staff.img || "/placeholder.svg?height=80&width=80"}
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
                  <div className="flex gap-2 mt-2 flex-wrap justify-center">
                    <button
                      onClick={() => handleEdit(staff)}
                      className="text-white border border-slate-500 bg-black rounded-xl py-1.5 px-4 sm:px-6 hover:text-white text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleHistoryClick(staff)}
                      className="text-white border border-slate-500 bg-black rounded-xl py-1.5 px-4 sm:px-6 hover:text-white text-sm flex items-center gap-1"
                    >
                      <History className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleChatClick(staff)}
                      className="text-white border border-slate-500 bg-black rounded-xl py-1.5 px-4 sm:px-6 hover:text-white text-sm flex items-center gap-1"
                    >
                      <MessageCircle className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>

        <SidebarArea
          isOpen={isRightSidebarOpen}
          onClose={closeSidebar}
          communications={communications}
          todos={todos}
          birthdays={birthdays}
          customLinks={customLinks}
          setCustomLinks={setCustomLinks}
          redirectToCommunication={redirectToCommunication}
          redirectToTodos={redirectToTodos}
          toggleDropdown={toggleDropdown}
          openDropdownIndex={openDropdownIndex}
          setEditingLink={setEditingLink}
        />

        {isRightSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={closeSidebar}></div>
        )}

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
            staffMember={staffMembers[0]}
            onClose={() => setIsVacationRequestModalOpen(false)}
            onSubmit={handleVacationRequest}
          />
        )}
        {isHistoryModalOpen && selectedStaffForHistory && (
          <StaffHistoryModal staff={selectedStaffForHistory} onClose={() => setIsHistoryModalOpen(false)} />
        )}
      </>
    </StaffContext.Provider>
  )
}








