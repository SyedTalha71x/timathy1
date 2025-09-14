
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, createContext } from "react"
import { X, Calendar, Users, History, MessageCircle, Grid3X3, List } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import Avatar from "../../../public/gray-avatar-fotor-20250912192528.png"
import AddStaffModal from "../../components/staff-components/add-staff-modal"
import EditStaffModal from "../../components/staff-components/edit-staff-modal"
import StaffPlanningModal from "../../components/staff-components/staff-panning-modal"
import AttendanceOverviewModal from "../../components/staff-components/attendance-overview-modal"
import VacationCalendarModal from "../../components/staff-components/vacation-calendar-modal"
import StaffHistoryModal from "../../components/staff-components/staff-history-modal"
import { SidebarArea } from "../../components/custom-sidebar"
import { useNavigate } from "react-router-dom"
import Rectangle1 from "../../../public/Rectangle 1.png"
import { IoIosMenu } from "react-icons/io"

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
  const [viewMode, setViewMode] = useState("grid")

  const navigate = useNavigate()

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
    {
      id: 3,
      firstName: "Micheal",
      lastName: "John",
      role: "System Engineer",
      email: "johnmicheal@example.com",
      phone: "+92131232323",
      description: "Experienced system engineer with excellent communication skills.",
      img: Avatar,
      userId: "john.system-engineer",
      username: "micheal.john",
      street: "456 Oak Ave",
      zipCode: "62390",
      city: "Othertown",
      vacationEntitlement: 15,
      birthday: "1992-11-27",
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
    window.location.href = `/dashboard/communication`
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid")
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

        <div
          className={`flex relative rounded-3xl transition-all duration-500 cursor-pointer bg-[#1C1C1C] text-white ${isRightSidebarOpen ? "lg:mr-89 mr-0" : "mr-0"
            }`}
        >
          <div className="flex-1 min-w-0 p-4 sm:p-6">
            <div
              className={`flex flex-col ${isRightSidebarOpen ? "lg:flex-row lg:items-center lg:justify-between" : "lg:flex-row lg:items-center lg:justify-between"
                } gap-4 mb-6 transition-all duration-500`}
            >
              <div
                className={`flex ${isRightSidebarOpen
                    ? "flex items-center gap-3 mb-13 w-full lg:w-auto"
                    : "flex-col sm:flex-row sm:items-center gap-3  w-full lg:w-auto justify-between"
                  }`}
              >
                <h1 className="text-xl sm:text-2xl lg:text-2xl oxanium_font text-white">
                  Staff
                </h1>

                <div className="flex items-center gap-1 bg-black rounded-xl p-1 w-fit">
                  <span className="text-xs text-gray-400 px-2">View</span>
                  <button
                    onClick={toggleViewMode}
                    className={`p-2 rounded-lg transition-colors ${viewMode === "grid"
                        ? "bg-[#FF843E] text-white"
                        : "text-gray-400 hover:text-white"
                      }`}
                    title="Grid View"
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={toggleViewMode}
                    className={`p-2 rounded-lg transition-colors ${viewMode === "list"
                        ? "bg-[#FF843E] text-white"
                        : "text-gray-400 hover:text-white"
                      }`}
                    title="List View"
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>

              {/* Right side - Action buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 w-full lg:w-auto">
                <button
                  onClick={() => setIsPlanningModalOpen(true)}
                  className="bg-black py-2.5 px-4 lg:px-6 text-sm rounded-xl flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Staff planning</span>
                  <span className="sm:hidden">Planning</span>
                </button>
              
                <button
                  onClick={() => setIsVacationRequestModalOpen(true)}
                  className="bg-black py-2.5 px-4 lg:px-6 text-sm rounded-xl flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Vacation Calendar</span>
                  <span className="sm:hidden">Vacation</span>
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-orange-500 text-white px-4 lg:px-10 py-2.5 rounded-xl text-sm whitespace-nowrap"
                >
                  + Add Staff
                </button>

                {/* Sidebar toggle (desktop only) */}
                <button
                  onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                  className="block text-sm rounded-xl cursor-pointer"
                >
                  <IoIosMenu size={24} />
                </button>
              </div>
            </div>

            {/* Staff cards section */}
            <div
              className={`open_sans_font mt-6 sm:mt-15 ${viewMode === "grid"
                  ? `grid grid-cols-1 sm:grid-cols-2 ${isRightSidebarOpen ? "xl:grid-cols-2" : "xl:grid-cols-3"
                  } gap-3 sm:gap-4`
                  : "flex flex-col gap-3"
                }`}
            >
              {staffMembers.map((staff) => (
                <div
                  key={staff.id}
                  className={`bg-[#141414] rounded-xl p-4 sm:p-6 ${viewMode === "grid"
                      ? "flex flex-col items-center text-center"
                      : "flex flex-col sm:flex-row items-start sm:items-center text-left gap-4"
                    }`}
                >
                  <div
                    className={`${viewMode === "grid"
                        ? "relative w-full mb-4"
                        : "flex-shrink-0 self-center sm:self-start"
                      }`}
                  >
                    <img
                      src={staff.img || "/placeholder.svg?height=80&width=80"}
                      width={80}
                      height={80}
                      className={`rounded-xl ${viewMode === "grid"
                          ? "h-16 w-16 sm:h-20 sm:w-20 mx-auto"
                          : "h-12 w-12 sm:h-16 sm:w-16"
                        }`}
                      alt={`${staff.firstName} ${staff.lastName}`}
                    />
                  </div>

                  <div
                    className={`${viewMode === "list" ? "flex-1 min-w-0" : "w-full"
                      }`}
                  >
                    <h3
                      className={`text-white font-medium text-base sm:text-lg mb-1 ${viewMode === "list"
                          ? "text-center sm:text-left"
                          : "text-center"
                        }`}
                    >
                      {staff.firstName} {staff.lastName}
                    </h3>
                    <p
                      className={`text-gray-400 text-xs sm:text-sm mb-2 ${viewMode === "list"
                          ? "text-center sm:text-left"
                          : "text-center"
                        }`}
                    >
                      {staff.role}
                    </p>
                    <p
                      className={`text-gray-400 text-xs sm:text-sm ${viewMode === "grid" ? "mb-4" : "mb-3"
                        } ${viewMode === "list"
                          ? "text-center sm:text-left"
                          : "text-center"
                        }`}
                    >
                      {staff.description}
                    </p>
                  </div>

                  <div
                    className={`flex gap-2 ${viewMode === "grid"
                        ? "flex-col sm:flex-row justify-center w-full"
                        : "flex-col sm:flex-row flex-shrink-0 w-full sm:w-auto"
                      }`}
                  >
                    <button
                      onClick={() => handleEdit(staff)}
                      className="text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 px-4 sm:px-6 hover:text-white hover:border-slate-400 transition-colors text-sm flex-1 sm:flex-none"
                    >
                      Edit
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleHistoryClick(staff)}
                        className="text-white bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center flex-1 sm:flex-none sm:w-12"
                      >
                        <History size={16} />
                      </button>
                      <button
                        onClick={() => handleChatClick(staff)}
                        className="text-white bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center flex-1 sm:flex-none sm:w-12"
                      >
                        <MessageCircle size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
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
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* ✅ Rest Modals unchanged */}
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
                <h2 className="text-base open_sans_font_700 sm:text-lg font-semibold text-white">
                  Confirm Removal
                </h2>
                <button
                  onClick={() => setIsRemoveModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg"
                >
                  <X size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>
              <div className="px-4 sm:px-6 py-4">
                <p className="text-white text-sm">
                  Are you sure you want to remove this staff member?
                </p>
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
          <StaffPlanningModal
            staffMembers={staffMembers}
            onClose={() => setIsPlanningModalOpen(false)}
          />
        )}

        {isAttendanceModalOpen && (
          <AttendanceOverviewModal
            staffMembers={staffMembers}
            onClose={() => setIsAttendanceModalOpen(false)}
          />
        )}

        {isVacationRequestModalOpen && (
          <VacationCalendarModal
            staffMember={staffMembers[0]}
            onClose={() => setIsVacationRequestModalOpen(false)}
            onSubmit={handleVacationRequest}
          />
        )}

        {isHistoryModalOpen && selectedStaffForHistory && (
          <StaffHistoryModal
            staff={selectedStaffForHistory}
            onClose={() => setIsHistoryModalOpen(false)}
          />
        )}
      </>
    </StaffContext.Provider>
  );



}
