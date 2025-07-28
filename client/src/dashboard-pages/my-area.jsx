/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import Chart from "react-apexcharts"
import { MoreVertical, X, Clock, ChevronDown, Edit, Check, Plus, AlertTriangle, Info, CalendarIcon, Menu, Users, Minus, ExternalLink } from 'lucide-react'
import Rectangle1 from "../../public/Rectangle 1.png"
import SelectedAppointmentModal from "../components/appointments-components/selected-appointment-modal"
import Image10 from "../../public/image10.png"
import { Toaster, toast } from "react-hot-toast"
import { WidgetSelectionModal } from "../components/widget-selection-modal"
import Avatar from "../../public/avatar.png"

const loggedInStaff = {
  id: 1,
  name: "John Smith",
  password: "staff123",
}

const staffList = [
  { id: 1, name: "John Smith", password: "staff123" },
  { id: 2, name: "Sarah Johnson", password: "sarah456" },
  { id: 3, name: "Mike Wilson", password: "mike789" },
  { id: 4, name: "Emma Davis", password: "emma321" },
]

function StaffCheckInWidget() {
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [password, setPassword] = useState("")
  const [showAdditionalStaff, setShowAdditionalStaff] = useState(false)
  const [additionalStaffCheckIns, setAdditionalStaffCheckIns] = useState({})
  const [bookingTimeout, setBookingTimeout] = useState(null)
  const [canCheckOut, setCanCheckOut] = useState(true)

  const handleCheckInOut = () => {
    setShowPasswordModal(true)
  }

  const handlePasswordSubmit = () => {
    if (password === loggedInStaff.password) {
      if (isCheckedIn) {
        if (!canCheckOut) {
          toast.error("Cannot check out yet. Please wait for the 2-minute timeout.")
          setShowPasswordModal(false)
          setPassword("")
          return
        }
        setIsCheckedIn(false)
        setCheckInTime(null)
        setBookingTimeout(null)
        setCanCheckOut(true)
        toast.success("Checked out successfully")
      } else {
        setIsCheckedIn(true)
        const now = new Date()
        setCheckInTime(now)
        setCanCheckOut(false)
        // Set 2-minute timeout
        const timeoutTime = new Date(now.getTime() + 2 * 60 * 1000)
        setBookingTimeout(timeoutTime)
        setTimeout(
          () => {
            setCanCheckOut(true)
            toast.success("You can now check out")
          },
          2 * 60 * 1000,
        )
        toast.success("Checked in successfully")
      }
      setShowPasswordModal(false)
      setPassword("")
    } else {
      toast.error("Incorrect password")
    }
  }

  const handleAdditionalStaffCheckIn = (staffId, staffPassword) => {
    const staff = staffList.find((s) => s.id === staffId)
    if (staff && staffPassword === staff.password) {
      setAdditionalStaffCheckIns((prev) => ({
        ...prev,
        [staffId]: !prev[staffId],
      }))
      toast.success(`${staff.name} ${additionalStaffCheckIns[staffId] ? "checked out" : "checked in"} successfully`)
    } else {
      toast.error("Incorrect password")
    }
  }

  return (
    <div className="p-3 bg-[#000000] rounded-xl md:h-[340px] h-auto">
      <h2 className="text-lg font-semibold mb-3">Staff Check-In</h2>
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-sm mb-1">Status: {isCheckedIn ? "Checked In" : "Checked Out"}</p>
          {checkInTime && (
            <div className="text-xs text-zinc-400">
              <p className="flex items-center gap-1">
                <Clock size={14} />
                {checkInTime.toLocaleTimeString()}
              </p>
              {bookingTimeout && !canCheckOut && (
                <p className="text-yellow-400 mt-1">Can check out after: {bookingTimeout.toLocaleTimeString()}</p>
              )}
            </div>
          )}
        </div>
        {!isCheckedIn ? (
          <button
            onClick={handleCheckInOut}
            className="w-full py-2.5 rounded-xl text-sm font-medium transition-colors bg-yellow-400 text-black"
          >
            {loggedInStaff.name} - Check In
          </button>
        ) : (
          <button
            onClick={handleCheckInOut}
            className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
              canCheckOut ? "bg-red-600 text-white" : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
            disabled={!canCheckOut}
          >
            {loggedInStaff.name} - Check Out
          </button>
        )}
        <button
          onClick={() => setShowAdditionalStaff(true)}
          className="w-full py-2 rounded-xl text-sm font-medium transition-colors bg-blue-600 text-white flex items-center justify-center gap-2"
        >
          <Users size={16} />
          Check in additional staff
        </button>
      </div>
      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Enter Password</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false)
                  setPassword("")
                }}
                className="p-2 hover:bg-zinc-700 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-black rounded-xl text-sm outline-none"
                  placeholder="Enter your password"
                  onKeyPress={(e) => e.key === "Enter" && handlePasswordSubmit()}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowPasswordModal(false)
                    setPassword("")
                  }}
                  className="px-4 py-2 text-sm rounded-xl hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  className="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Additional Staff Modal */}
      {showAdditionalStaff && (
        <AdditionalStaffModal
          staffList={staffList}
          additionalStaffCheckIns={additionalStaffCheckIns}
          onCheckIn={handleAdditionalStaffCheckIn}
          onClose={() => setShowAdditionalStaff(false)}
        />
      )}
    </div>
  )
}

function AdditionalStaffModal({ staffList, additionalStaffCheckIns, onCheckIn, onClose }) {
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [password, setPassword] = useState("")

  const handleSubmit = () => {
    if (selectedStaff && password) {
      onCheckIn(selectedStaff.id, password)
      setPassword("")
      setSelectedStaff(null)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Additional Staff Check-In</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-700 rounded-lg">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Select Staff Member</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {staffList.map((staff) => (
                <div
                  key={staff.id}
                  onClick={() => setSelectedStaff(staff)}
                  className={`p-3 rounded-xl cursor-pointer transition-colors ${
                    selectedStaff?.id === staff.id ? "bg-blue-600" : "bg-black hover:bg-zinc-800"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{staff.name}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        additionalStaffCheckIns[staff.id]
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {additionalStaffCheckIns[staff.id] ? "Checked In" : "Checked Out"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {selectedStaff && (
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Password for {selectedStaff.name}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-black rounded-xl text-sm outline-none"
                placeholder="Enter password"
                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <button onClick={onClose} className="px-4 py-2 text-sm rounded-xl hover:bg-zinc-700">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedStaff || !password}
              className={`px-4 py-2 text-sm rounded-xl ${
                selectedStaff && password ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600/50 cursor-not-allowed"
              }`}
            >
              {additionalStaffCheckIns[selectedStaff?.id] ? "Check Out" : "Check In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const DraggableWidget = ({ id, children, index, moveWidget, removeWidget, isEditing, widgets }) => {
  const ref = useRef(null)

  const handleDragStart = (e) => {
    e.dataTransfer.setData("widgetId", id)
    e.dataTransfer.setData("widgetIndex", index)
    e.currentTarget.classList.add("dragging")
  }

  const handleDragOver = (e) => {
    e.preventDefault() // Necessary to allow dropping
    if (e.currentTarget.dataset.widgetId !== id) {
      e.currentTarget.classList.add("drag-over")
    }
  }

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("drag-over")
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.currentTarget.classList.remove("drag-over")
    const draggedWidgetId = e.dataTransfer.getData("widgetId")
    const draggedWidgetIndex = Number.parseInt(e.dataTransfer.getData("widgetIndex"), 10)
    const targetWidgetIndex = index // The index of the widget being dropped ONTO

    if (draggedWidgetId !== id) {
      moveWidget(draggedWidgetIndex, targetWidgetIndex)
    }
  }

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove("dragging")
    const allWidgets = document.querySelectorAll(".draggable-widget")
    allWidgets.forEach((widget) => widget.classList.remove("drag-over"))
  }

  return (
    <div
      ref={ref}
      className={`relative mb-4 w-full draggable-widget ${isEditing ? "animate-wobble" : ""}`}
      draggable={isEditing}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      onDragEnd={handleDragEnd}
      data-widget-id={id}
      data-widget-index={index}
    >
      {isEditing && (
        <div className="absolute -top-2 -right-2 z-10 flex gap-2">
          <button
            onClick={() => removeWidget(id)}
            className="p-1 bg-gray-500 rounded-md cursor-pointer text-black flex items-center justify-center w-7 h-7"
          >
            <Minus size={25} />
          </button>
        </div>
      )}
      {children}
    </div>
  )
}

export default function MyArea() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null)
  const [selectedMemberType, setSelectedMemberType] = useState("All members")
  const [isChartDropdownOpen, setIsChartDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const chartDropdownRef = useRef(null)
  const navigate = useNavigate()
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false)
  const [isRightWidgetModalOpen, setIsRightWidgetModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSidebarEditing, setIsSidebarEditing] = useState(false) // Separate edit state for sidebar

  const [widgets, setWidgets] = useState([
    { id: "chart", type: "chart", position: 0 }, // Always full width
    { id: "expiringContracts", type: "expiringContracts", position: 1 }, // Moved to start of grid
    { id: "appointments", type: "appointments", position: 2 },
    { id: "staffCheckIn", type: "staffCheckIn", position: 3 },
    { id: "websiteLink", type: "websiteLink", position: 4 },
    // Removed topSelling and mostFrequent
  ])

  // Add right sidebar widgets state
  const [rightSidebarWidgets, setRightSidebarWidgets] = useState([
    { id: "communications", type: "communications", position: 0 },
    { id: "todo", type: "todo", position: 1 },
    { id: "birthday", type: "birthday", position: 2 },
    { id: "websiteLinks", type: "websiteLinks", position: 3 },
  ])

  const [customLinks, setCustomLinks] = useState([
    {
      id: "link1",
      url: "https://fitness-web-kappa.vercel.app/",
      title: "Timathy Fitness Town",
    },
    { id: "link2", url: "https://oxygengym.pk/", title: "Oxygen Gyms" },
    { id: "link3", url: "https://google.com", title: "Fitness Gyms" },
  ])

  const [communications, setCommunications] = useState([
    {
      id: 1,
      name: "Jennifer Markus",
      message: "Hey! Did you think the NFT marketplace for Alice app design?",
      time: "Today | 05:30 PM",
      avatar: Rectangle1,
    },
    {
      id: 2,
      name: "Alex Johnson",
      message: "The new dashboard looks great! When can we review it?",
      time: "Today | 03:15 PM",
      avatar: Rectangle1,
    },
  ])

  const [todos, setTodos] = useState([
    {
      id: 1,
      title: "Review Design",
      description: "Review the new dashboard design",
      assignee: "Jack",
    },
    {
      id: 2,
      title: "Team Meeting",
      description: "Weekly team sync",
      assignee: "Jack",
    },
  ])

  const [birthdays, setBirthdays] = useState([
    {
      id: 1,
      name: "Yolando",
      date: "Mon | 02 01 2025",
      avatar: Avatar,
    },
    {
      id: 2,
      name: "Alexandra",
      date: "Tue | 02 02 2025",
      avatar: Avatar,
    },
  ])

  // Updated member types with new statistics
  const memberTypes = {
    "All members": {
      data: [
        [50, 280, 200, 450, 250, 400, 300, 200, 450],
        [100, 150, 200, 100, 150, 300, 400, 100, 400],
      ],
      growth: "4%",
      title: "Members",
    },
    "Checked in": {
      data: [
        [30, 180, 150, 350, 200, 300, 250, 150, 350],
        [80, 120, 150, 80, 120, 250, 300, 80, 300],
      ],
      growth: "2%",
      title: "Checked In Members",
    },
    "Cancelled appointment": {
      data: [
        [20, 100, 50, 100, 50, 100, 50, 50, 100],
        [20, 30, 50, 20, 30, 50, 100, 20, 100],
      ],
      growth: "-1%",
      title: "Cancelled Appointments",
    },
    Finances: {
      data: [
        [150, 320, 280, 500, 350, 450, 380, 300, 520],
        [200, 250, 300, 200, 280, 400, 500, 200, 480],
      ],
      growth: "8%",
      title: "Financial Overview",
    },
    Selling: {
      data: [
        [80, 220, 180, 380, 280, 350, 320, 250, 400],
        [120, 180, 220, 120, 200, 320, 420, 150, 380],
      ],
      growth: "6%",
      title: "Sales Performance",
    },
    Leads: {
      data: [
        [40, 160, 120, 280, 180, 250, 220, 180, 300],
        [60, 100, 140, 80, 120, 200, 280, 100, 260],
      ],
      growth: "5%",
      title: "Lead Generation",
    },
    'Top-selling by revenue': {
      data: [
        [40, 160, 120, 280, 180, 250, 220, 180, 300],
        [60, 100, 140, 80, 120, 200, 280, 100, 260],
      ],
      growth: "2%",
      title: "Top-selling by revenue",
    },

    'Most frequently sold': {
      data: [
        [40, 160, 120, 280, 180, 250, 220, 180, 300],
        [60, 100, 140, 80, 120, 200, 280, 100, 260],
      ],
      growth: "3%",
      title: "Most frequently sold",
    },
  }

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      name: "Yolanda",
      time: "10:00 - 14:00",
      date: "Mon | 03-08-2025",
      color: "bg-[#4169E1]",
      startTime: "10:00",
      endTime: "14:00",
      type: "Strength Training",
      specialNote: {
        text: "Prefers morning sessions",
        startDate: null,
        endDate: null,
        isImportant: false,
      },
      status: "pending",
      isTrial: false,
    },
    {
      id: 2,
      name: "Alexandra",
      time: "10:00 - 18:00",
      date: "Tue | 04-02-2025",
      color: "bg-[#FF6B6B]",
      startTime: "10:00",
      endTime: "18:00",
      type: "Cardio",
      specialNote: {
        text: "",
        startDate: null,
        endDate: null,
        isImportant: false,
      },
      status: "pending",
      isTrial: true,
    },
    {
      id: 3,
      name: "Marcus",
      time: "14:00 - 16:00",
      date: "Wed | 05-02-2025",
      color: "bg-[#50C878]",
      startTime: "14:00",
      endTime: "16:00",
      type: "Yoga",
      specialNote: {
        text: "",
        startDate: null,
        endDate: null,
        isImportant: false,
      },
      status: "pending",
      isTrial: false,
    },
    {
      id: 4,
      name: "John",
      time: "14:00 - 16:00",
      date: "Thu | 06-02-2025",
      color: "bg-[#50C878]",
      startTime: "14:00",
      endTime: "16:00",
      type: "Yoga",
      specialNote: {
        text: "",
        startDate: null,
        endDate: null,
        isImportant: false,
      },
      status: "pending",
      isTrial: false,
    },
  ])

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const [freeAppointments, setFreeAppointments] = useState([])
  const toggleRightSidebar = () => setIsRightSidebarOpen(!isRightSidebarOpen)
  const redirectToTodos = () => navigate("/dashboard/to-do")
  const redirectToCommunication = () => navigate("/dashboard/communication")
  const toggleDropdown = (index) => setOpenDropdownIndex(openDropdownIndex === index ? null : index)
  const toggleEditing = () => setIsEditing(!isEditing)
  const toggleSidebarEditing = () => setIsSidebarEditing(!isSidebarEditing) // Toggle sidebar edit mode
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [isAppointmentActionModalOpen, setIsAppointmentActionModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isNotifyMemberOpen, setIsNotifyMemberOpen] = useState(false)
  const [notifyAction, setNotifyAction] = useState("change")
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [editingNoteText, setEditingNoteText] = useState("")

  // Helper function to determine widget placement status
  const getWidgetPlacementStatus = useCallback(
    (widgetType) => {
      const existsInMain = widgets.some((widget) => widget.type === widgetType)
      const existsInSidebar = rightSidebarWidgets.some((widget) => widget.type === widgetType)
      if (existsInMain) {
        return { canAdd: false, location: "dashboard" }
      }
      if (existsInSidebar) {
        return { canAdd: false, location: "sidebar" }
      }
      return { canAdd: true, location: null }
    },
    [widgets, rightSidebarWidgets],
  )

  // Fixed moveWidget function
  const moveWidget = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= widgets.length) return
    const newWidgets = [...widgets]
    const [movedWidget] = newWidgets.splice(fromIndex, 1)
    newWidgets.splice(toIndex, 0, movedWidget)
    // Update positions
    const updatedWidgets = newWidgets.map((widget, index) => ({
      ...widget,
      position: index,
    }))
    setWidgets(updatedWidgets)
  }

  const removeWidget = (id) => {
    setWidgets((currentWidgets) => {
      const filtered = currentWidgets.filter((w) => w.id !== id)
      // Update positions after removal
      return filtered.map((widget, index) => ({
        ...widget,
        position: index,
      }))
    })
  }

  // Fixed functions for right sidebar widgets
  const moveRightSidebarWidget = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= rightSidebarWidgets.length) return
    const newWidgets = [...rightSidebarWidgets]
    const [movedWidget] = newWidgets.splice(fromIndex, 1)
    newWidgets.splice(toIndex, 0, movedWidget)
    // Update positions
    const updatedWidgets = newWidgets.map((widget, index) => ({
      ...widget,
      position: index,
    }))
    setRightSidebarWidgets(updatedWidgets)
  }

  const removeRightSidebarWidget = (id) => {
    setRightSidebarWidgets((currentWidgets) => {
      const filtered = currentWidgets.filter((w) => w.id !== id)
      // Update positions after removal
      return filtered.map((widget, index) => ({
        ...widget,
        position: index,
      }))
    })
  }

  const [editingLink, setEditingLink] = useState(null)

  const addCustomLink = () => {
    setEditingLink({})
  }

  const updateCustomLink = (id, field, value) => {
    setCustomLinks((currentLinks) => currentLinks.map((link) => (link.id === id ? { ...link, [field]: value } : link)))
  }

  const removeCustomLink = (id) => {
    setCustomLinks((currentLinks) => currentLinks.filter((link) => link.id !== id))
  }

  const handleCheckIn = (appointmentId) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, isCheckedIn: !appointment.isCheckedIn } : appointment,
      ),
    )
    toast.success(
      appointments.find((app) => app.id === appointmentId)?.isCheckedIn
        ? "Member checked In successfully"
        : "Member check in successfully",
    )
  }

  const [expiringContracts, setExpiringContracts] = useState([
    {
      id: 1,
      title: "Oxygen Gym Membership",
      expiryDate: "June 30, 2025",
      status: "Expiring Soon",
    },
    {
      id: 3,
      title: "Studio Space Rental",
      expiryDate: "August 5, 2025",
      status: "Expiring Soon",
    },
    {
      id: 4,
      title: "Insurance Policy",
      expiryDate: "September 10, 2025",
      status: "Expiring Soon",
    },
    {
      id: 5,
      title: "Software License",
      expiryDate: "October 20, 2025",
      status: "Expiring Soon",
    },
  ])

  const moveCustomLink = (id, direction) => {
    setCustomLinks((currentLinks) => {
      const index = currentLinks.findIndex((link) => link.id === id)
      if ((direction === "up" && index === 0) || (direction === "down" && index === currentLinks.length - 1)) {
        return currentLinks
      }
      const newLinks = [...currentLinks]
      const swap = direction === "up" ? index - 1 : index + 1
      ;[newLinks[index], newLinks[swap]] = [newLinks[swap], newLinks[index]]
      return newLinks
    })
  }

  const handleDeleteAppointment = (appointmentId) => {
    setAppointments((prevAppointments) => prevAppointments.filter((appointment) => appointment.id !== appointmentId))
    setSelectedAppointment(null)
    toast.success("Appointment deleted successfully")
  }

  const handleEditNote = (appointmentId, currentNote) => {
    setEditingNoteId(appointmentId)
    setEditingNoteText(currentNote)
  }

  const handleSaveNote = (appointmentId) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === appointmentId ? { ...app, specialNote: { ...app.specialNote, text: editingNoteText } } : app,
      ),
    )
    setEditingNoteId(null)
    setEditingNoteText("")
    toast.success("Special note updated successfully")
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownIndex(null)
      }
      if (chartDropdownRef.current && !chartDropdownRef.current.contains(event.target)) {
        setIsChartDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const chartOptions = {
    chart: {
      type: "line",
      height: 180,
      toolbar: { show: false },
      background: "transparent",
      fontFamily: "Inter, sans-serif",
    },
    colors: ["#FF6B1A", "#2E5BFF"],
    stroke: { curve: "smooth", width: 4, opacity: 1 },
    markers: {
      size: 1,
      strokeWidth: 0,
      hover: { size: 6 },
    },
    xaxis: {
      categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: { style: { colors: "#999999", fontSize: "12px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 600,
      tickAmount: 6,
      labels: {
        style: { colors: "#999999", fontSize: "12px" },
        formatter: (value) => Math.round(value),
      },
    },
    grid: {
      show: true,
      borderColor: "#333333",
      position: "back",
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
      row: { opacity: 0.1 },
      column: { opacity: 0.1 },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      offsetY: -30,
      offsetX: -10,
      labels: { colors: "#ffffff" },
      itemMargin: { horizontal: 5 },
    },
    title: {
      text: memberTypes[selectedMemberType].title,
      align: "left",
      style: { fontSize: "16px", fontWeight: "bold", color: "#ffffff" },
    },
    subtitle: {
      text: `↑ ${memberTypes[selectedMemberType].growth} more in 2024`,
      align: "left",
      style: { fontSize: "12px", color: "#ffffff", fontWeight: "bolder" },
    },
    tooltip: {
      theme: "dark",
      style: {
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
      },
      custom: ({ series, seriesIndex, dataPointIndex, w }) =>
        '<div class="apexcharts-tooltip-box" style="background: white; color: black; padding: 8px;">' +
        '<span style="color: black;">' +
        series[seriesIndex][dataPointIndex] +
        "</span></div>",
    },
  }

  const appointmentTypes = [
    { name: "Regular Training", duration: 60, color: "bg-blue-500" },
    { name: "Consultation", duration: 30, color: "bg-green-500" },
    { name: "Assessment", duration: 45, color: "bg-purple-500" },
  ]

  const chartSeries = [
    { name: "Comp1", data: memberTypes[selectedMemberType].data[0] },
    { name: "Comp2", data: memberTypes[selectedMemberType].data[1] },
  ]

  const handleAppointmentChange = (changes) => {
    setSelectedAppointment((prev) => {
      const updatedAppointment = { ...prev, ...changes }
      if (changes.specialNote) {
        updatedAppointment.specialNote = {
          ...prev.specialNote,
          ...changes.specialNote,
        }
      }
      return updatedAppointment
    })
  }

  const WebsiteLinkModal = ({ link, onClose }) => {
    const [title, setTitle] = useState(link?.title?.trim() || "")
    const [url, setUrl] = useState(link?.url?.trim() || "")

    const handleSave = () => {
      if (!title.trim() || !url.trim()) return
      if (link?.id) {
        updateCustomLink(link.id, "title", title)
        updateCustomLink(link.id, "url", url)
      } else {
        const newLink = {
          id: `link${Date.now()}`,
          url: url.trim(),
          title: title.trim(),
        }
        setCustomLinks((prev) => [...prev, newLink])
      }
      onClose()
    }

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Website link</h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-700 rounded-lg">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-black rounded-xl text-sm outline-none"
                  placeholder="Enter title"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full p-3 bg-black rounded-xl text-sm outline-none"
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button onClick={onClose} className="px-4 py-2 text-sm rounded-xl hover:bg-zinc-700">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!title.trim() || !url.trim()}
                className={`px-4 py-2 text-sm rounded-xl ${
                  !title.trim() || !url.trim() ? "bg-blue-600/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Fixed handleAddWidget function
  const handleAddWidget = (widgetType) => {
    const { canAdd, location } = getWidgetPlacementStatus(widgetType)
    if (!canAdd) {
      toast.error(`This widget is already added to your ${location}.`)
      return
    }
    const newWidget = {
      id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: widgetType,
      position: widgets.length,
    }
    setWidgets((currentWidgets) => [...currentWidgets, newWidget])
    setIsWidgetModalOpen(false)
    toast.success(`${widgetType} widget has been added successfully`)
  }

  // Fixed handleAddRightSidebarWidget function
  const handleAddRightSidebarWidget = (widgetType) => {
    const { canAdd, location } = getWidgetPlacementStatus(widgetType)
    if (!canAdd) {
      toast.error(`This widget is already added to your ${location}.`)
      return
    }
    const newWidget = {
      id: `rightWidget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: widgetType,
      position: rightSidebarWidgets.length,
    }
    setRightSidebarWidgets((currentWidgets) => [...currentWidgets, newWidget])
    setIsRightWidgetModalOpen(false)
    toast.success(`${widgetType} widget has been added to sidebar`)
  }

  const notePopoverRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notePopoverRef.current && !notePopoverRef.current.contains(event.target)) {
        setActiveNoteId(null)
      }
    }
    if (activeNoteId !== null) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [activeNoteId])

  const renderSpecialNoteIcon = useCallback(
    (specialNote, memberId) => {
      if (!specialNote.text) return null
      const isActive =
        specialNote.startDate === null ||
        (new Date() >= new Date(specialNote.startDate) && new Date() <= new Date(specialNote.endDate))
      if (!isActive) return null

      const handleNoteClick = (e) => {
        e.stopPropagation()
        setActiveNoteId(activeNoteId === memberId ? null : memberId)
      }

      return (
        <div className="relative">
          <div
            className={`${
              specialNote.isImportant ? "bg-red-500" : "bg-blue-500"
            } rounded-full p-0.5 shadow-[0_0_0_1.5px_white] cursor-pointer`}
            onClick={handleNoteClick}
          >
            {specialNote.isImportant ? (
              <AlertTriangle size={18} className="text-white" />
            ) : (
              <Info size={18} className="text-white" />
            )}
          </div>
          {activeNoteId === memberId && (
            <div
              ref={notePopoverRef}
              className="absolute left-0 top-6 w-74 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-20"
            >
              <div className="bg-gray-800 p-3 rounded-t-lg border-b border-gray-700 flex items-center gap-2">
                {specialNote.isImportant === "important" ? (
                  <AlertTriangle className="text-yellow-500 shrink-0" size={18} />
                ) : (
                  <Info className="text-blue-500 shrink-0" size={18} />
                )}
                <h4 className="text-white flex text-sm gap-1 items-center font-medium">
                  <div>Special Note</div>
                  <div className="text-sm text-gray-400">
                    {specialNote.isImportant === "important" ? "(Important)" : "(Unimportant)"}
                  </div>
                </h4>
                <button
                  onClick={() => handleEditNote(memberId, specialNote.text)}
                  className="ml-auto text-gray-400 hover:text-white mr-2"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveNoteId(null)
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-3">
                {editingNoteId === memberId ? (
                  <div className="space-y-3">
                    <textarea
                      value={editingNoteText}
                      onChange={(e) => setEditingNoteText(e.target.value)}
                      className="w-full p-2 bg-gray-700 rounded text-white text-sm resize-none"
                      rows={3}
                      placeholder="Enter special note..."
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setEditingNoteId(null)
                          setEditingNoteText("")
                        }}
                        className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-700 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveNote(memberId)}
                        className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-white text-sm leading-relaxed">{specialNote.text}</p>
                )}
                {specialNote.startDate && specialNote.endDate ? (
                  <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                    <p className="text-xs text-gray-300 flex items-center gap-1.5">
                      <CalendarIcon size={12} />
                      Valid from {new Date(specialNote.startDate).toLocaleDateString()} to{" "}
                      {new Date(specialNote.endDate).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                    <p className="text-xs text-gray-300 flex items-center gap-1.5">
                      <CalendarIcon size={12} />
                      Always valid
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )
    },
    [activeNoteId, setActiveNoteId, editingNoteId, editingNoteText],
  )

  // Right sidebar widget component with remove functionality
  const RightSidebarWidget = ({ id, children, index, isEditing }) => {
    const ref = useRef(null)

    const handleDragStart = (e) => {
      e.dataTransfer.setData("widgetId", id)
      e.dataTransfer.setData("widgetIndex", index)
      e.currentTarget.classList.add("dragging")
    }

    const handleDragOver = (e) => {
      e.preventDefault() // Necessary to allow dropping
      if (e.currentTarget.dataset.widgetId !== id) {
        e.currentTarget.classList.add("drag-over")
      }
    }

    const handleDragLeave = (e) => {
      e.currentTarget.classList.remove("drag-over")
    }

    const handleDrop = (e) => {
      e.preventDefault()
      e.currentTarget.classList.remove("drag-over")
      const draggedWidgetId = e.dataTransfer.getData("widgetId")
      const draggedWidgetIndex = Number.parseInt(e.dataTransfer.getData("widgetIndex"), 10)
      const targetWidgetIndex = index

      if (draggedWidgetId !== id) {
        moveRightSidebarWidget(draggedWidgetIndex, targetWidgetIndex)
      }
    }

    const handleDragEnd = (e) => {
      e.currentTarget.classList.remove("dragging")
      const allWidgets = document.querySelectorAll(".right-sidebar-widget")
      allWidgets.forEach((widget) => widget.classList.remove("drag-over"))
    }

    return (
      <div
        ref={ref}
        className={`relative mb-6 right-sidebar-widget ${isEditing ? "animate-wobble" : ""}`}
        draggable={isEditing}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        onDragEnd={handleDragEnd}
        data-widget-id={id}
        data-widget-index={index}
      >
        {" "}
        {isEditing && (
          <div className="absolute -top-2 -right-2 z-10 flex gap-2">
            <button
              onClick={() => removeRightSidebarWidget(id)}
              className="p-1 bg-gray-500 rounded-md cursor-pointer text-black flex items-center justify-center w-6 h-6"
            >
              <Minus size={25} />
            </button>
          </div>
        )}
        {children}
      </div>
    )
  }

  return (
    <>
      <style>
        {`
      @keyframes wobble {
        0%, 100% { transform: rotate(0deg); }
        15% { transform: rotate(-1deg); }
        30% { transform: rotate(1deg); }
        45% { transform: rotate(-1deg); }
        60% { transform: rotate(1deg); }
        75% { transform: rotate(-1deg); }
        90% { transform: rotate(1deg); }
      }
      .animate-wobble {
        animation: wobble 0.5s ease-in-out infinite;
      }
      .dragging {
        opacity: 0.5;
        border: 2px dashed #fff;
      }
      .drag-over {
        border: 2px dashed #888;
      }
      `}
      </style>
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
      <div className="flex flex-col md:flex-row rounded-3xl bg-[#1C1C1C] text-white min-h-screen">
        {isRightSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={toggleRightSidebar} />
        )}
        <main className="flex-1 min-w-0 p-2 overflow-hidden">
          <div className="p-3 md:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h1 className="text-xl font-bold">My Area</h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsWidgetModalOpen(true)}
                  className="py-2 px-4 bg-black text-white  rounded-xl text-sm cursor-pointer flex items-center gap-1"
                >
                  <Plus size={20} />
                  <span className="hidden sm:inline">Add Widget</span>
                </button>
                <button
                  onClick={toggleEditing}
                  className={`px-6 py-2 text-sm cursor-pointer ${
                    isEditing ? "bg-blue-600 text-white " : "bg-zinc-700 text-zinc-200 "
                  } rounded-xl flex items-center gap-2 transition-colors`}
                >
                  {isEditing ? <Check size={18} /> : <Edit size={18} />}
                  <span className="hidden sm:inline">{isEditing ? "Done" : "Edit Dashboard"}</span>
                </button>
                <button
                  onClick={toggleRightSidebar}
                  className="p-3 text-zinc-400 hover:bg-zinc-800 rounded-xl md:hidden ml-auto"
                >
                  <Menu size={20} />
                </button>
              </div>
            </div>
            {/* Widgets */}
            <div className="space-y-4">
              {/* Chart Widget - Full Width (rendered separately if it's always full width) */}
              {widgets
                .filter((widget) => widget.type === "chart")
                .sort((a, b) => a.position - b.position)
                .map((widget) => (
                  <DraggableWidget
                    key={widget.id}
                    id={widget.id}
                    index={widgets.findIndex((w) => w.id === widget.id)}
                    moveWidget={moveWidget}
                    removeWidget={removeWidget}
                    isEditing={isEditing}
                    widgets={widgets}
                  >
                    <div className="p-4 bg-[#2F2F2F] rounded-xl">
                      <div className="relative mb-3" ref={chartDropdownRef}>
                        <button
                          onClick={() => setIsChartDropdownOpen(!isChartDropdownOpen)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-black rounded-xl text-white text-sm"
                        >
                          {selectedMemberType}
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        {isChartDropdownOpen && (
                          <div className="absolute z-10 mt-2 w-48 bg-[#2F2F2F] rounded-xl shadow-lg">
                            {Object.keys(memberTypes).map((type) => (
                              <button
                                key={type}
                                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-black"
                                onClick={() => {
                                  setSelectedMemberType(type)
                                  setIsChartDropdownOpen(false)
                                }}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="w-full">
                        <Chart options={chartOptions} series={chartSeries} type="line" height={300} />
                      </div>
                    </div>
                  </DraggableWidget>
                ))}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {widgets
                  .filter((widget) => widget.type !== "chart") // Filter out chart, as it's handled separately
                  .sort((a, b) => a.position - b.position)
                  .map((widget) => (
                    <DraggableWidget
                      key={widget.id}
                      id={widget.id}
                      index={widgets.findIndex((w) => w.id === widget.id)}
                      moveWidget={moveWidget}
                      removeWidget={removeWidget}
                      isEditing={isEditing}
                      widgets={widgets}
                    >
                      {widget.type === "expiringContracts" && (
                        <div className="space-y-3 p-4 rounded-xl max-h-[340px] overflow-y-auto custom-scrollbar bg-[#2F2F2F] h-full flex flex-col">
                          <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Expiring Contracts</h2>
                          </div>
                          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                            <div className="grid grid-cols-1 gap-3">
                              {expiringContracts.map((contract) => (
                                <Link to={"/dashboard/contract"} key={contract.id}>
                                  <div className="p-4 bg-black rounded-xl hover:bg-zinc-900 transition-colors">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h3 className="text-sm font-medium">{contract.title}</h3>
                                        <p className="text-xs mt-1 text-zinc-400">Expires: {contract.expiryDate}</p>
                                      </div>
                                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">
                                        {contract.status}
                                      </span>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      {widget.type === "appointments" && (
                        <div className="space-y-3 p-4 rounded-xl md:h-[340px] h-auto bg-[#2F2F2F]">
                          <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
                          </div>
                          <div className="space-y-2 max-h-[30vh] overflow-y-auto custom-scrollbar pr-1">
                            {appointments.length > 0 ? (
                              appointments.map((appointment, index) => (
                                <div
                                  key={appointment.id}
                                  className={`${appointment.color} rounded-xl cursor-pointer p-3 relative`}
                                >
                                  <div className="absolute p-2 top-0 left-0 z-10">
                                    {renderSpecialNoteIcon(appointment.specialNote, appointment.id)}
                                  </div>
                                  <div
                                    className="flex flex-col items-center justify-between gap-2 cursor-pointer"
                                    onClick={() => {
                                      setSelectedAppointment(appointment)
                                      setIsAppointmentActionModalOpen(true)
                                    }}
                                  >
                                    <div className="flex items-center gap-2 ml-5 relative w-full justify-center">
                                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center relative">
                                        <img
                                          src={Avatar || "/placeholder.svg"}
                                          alt=""
                                          className="w-full h-full rounded-full"
                                        />
                                      </div>
                                      <div className="text-white text-left">
                                        <p className="font-semibold">{appointment.name}</p>
                                        <p className="text-xs flex gap-1 items-center opacity-80">
                                          <Clock size={14} />
                                          {appointment.time} | {appointment.date.split("|")[0]}
                                        </p>
                                        <p className="text-xs opacity-80 mt-1">
                                          {appointment.isTrial ? "Trial Session" : appointment.type}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleCheckIn(appointment.id)
                                      }}
                                      className={`px-3 py-1 text-xs font-medium rounded-lg ${
                                        appointment.isCheckedIn
                                          ? " border border-white/50 text-white bg-transparent"
                                          : "bg-black text-white"
                                      }`}
                                    >
                                      {appointment.isCheckedIn ? "Checked In" : "Check In"}
                                    </button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-white text-center">No appointments scheduled for this date.</p>
                            )}
                          </div>
                          <div className="flex justify-center">
                            <Link to="/dashboard/appointments" className="text-sm text-white hover:underline">
                              See all
                            </Link>
                          </div>
                        </div>
                      )}
                      {widget.type === "staffCheckIn" && <StaffCheckInWidget />}
                      {widget.type === "websiteLink" && (
                        <div className="space-y-3 p-4 rounded-xl bg-[#2F2F2F] md:h-[340px] h-auto flex flex-col">
                          <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Website Links</h2>
                          </div>
                          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                            <div className="grid grid-cols-1 gap-3">
                              {customLinks.map((link) => (
                                <div
                                  key={link.id}
                                  className="p-5 bg-black rounded-xl flex items-center justify-between"
                                >
                                  <div>
                                    <h3 className="text-sm font-medium">{link.title}</h3>
                                    <p className="text-xs mt-1 text-zinc-400">{link.url}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => window.open(link.url, "_blank")}
                                      className="p-2 hover:bg-zinc-700 rounded-lg"
                                    >
                                      <ExternalLink size={16} />
                                    </button>
                                    <div className="relative">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          toggleDropdown(`link-${link.id}`)
                                        }}
                                        className="p-2 hover:bg-zinc-700 rounded-lg"
                                      >
                                        <MoreVertical size={16} />
                                      </button>
                                      {openDropdownIndex === `link-${link.id}` && (
                                        <div className="absolute right-0 top-full mt-1 w-32 bg-zinc-800 rounded-lg shadow-lg z-50 py-1">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              setEditingLink(link)
                                              setOpenDropdownIndex(null)
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-700"
                                          >
                                            Edit
                                          </button>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              removeCustomLink(link.id)
                                              setOpenDropdownIndex(null)
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-700 text-red-400"
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={addCustomLink}
                            className="w-full p-3 bg-black rounded-xl text-sm text-zinc-400 text-left hover:bg-zinc-900 mt-auto"
                          >
                            Add website link...
                          </button>
                        </div>
                      )}
                    </DraggableWidget>
                  ))}
              </div>
            </div>
          </div>
        </main>
        <aside
          className={`
          fixed inset-y-0 right-0 z-50 w-[85vw] sm:w-80 lg:w-80 bg-[#181818]
          transform transition-transform duration-500 ease-in-out
          ${isRightSidebarOpen ? "translate-x-0" : "translate-x-full"}
          md:relative md:translate-x-0
        `}
        >
          <div className="p-4 md:p-5 h-full overflow-y-auto">
            {/* Header with close button and add widget button */}
            <h2 className="text-lg font-semibold">Sidebar</h2>
            <div className="flex items-center md:justify-between justify-end mt-2 mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRightWidgetModalOpen(true)}
                  className="py-2 px-4 bg-black text-white  rounded-xl text-sm cursor-pointer flex items-center gap-1"
                  title="Add Widget"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Add Widget</span>
                </button>
                <button
                  onClick={toggleSidebarEditing}
                  className={`px-3 text-sm py-2 ${
                    isSidebarEditing ? "bg-blue-600 text-white " : "bg-zinc-700 text-zinc-200 "
                  } rounded-xl flex items-center gap-2 transition-colors`}
                  title="Edit Sidebar"
                >
                  {isSidebarEditing ? <Check size={18} /> : <Edit size={18} />}
                  <span className="hidden sm:inline">{isSidebarEditing ? "Done" : "Edit Sidebar"}</span>
                </button>
                <button
                  onClick={toggleRightSidebar}
                  className="p-3 text-zinc-400 hover:bg-zinc-700 rounded-xl md:hidden"
                  aria-label="Close sidebar"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            {/* Render right sidebar widgets */}
            {rightSidebarWidgets
              .sort((a, b) => a.position - b.position)
              .map((widget, index) => (
                <RightSidebarWidget key={widget.id} id={widget.id} index={index} isEditing={isSidebarEditing}>
                  {widget.type === "communications" && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg md:text-xl open_sans_font_700 cursor-pointer">Communications</h2>
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          {communications.slice(0, 2).map((comm) => (
                            <div
                              onClick={redirectToCommunication}
                              key={comm.id}
                              className="p-2 cursor-pointer bg-black rounded-xl"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <img
                                  src={comm.avatar || "/placeholder.svg"}
                                  alt="User"
                                  className="rounded-full h-8 w-8"
                                />
                                <div>
                                  <h3 className="open_sans_font text-sm">{comm.name}</h3>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs open_sans_font text-zinc-400">{comm.message}</p>
                                <p className="text-xs mt-1 flex gap-1 items-center open_sans_font text-zinc-400">
                                  <Clock size={12} />
                                  {comm.time}
                                </p>
                              </div>
                            </div>
                          ))}
                          <Link
                            to={"/dashboard/communication"}
                            className="text-sm open_sans_font text-white flex justify-center items-center text-center hover:underline"
                          >
                            See all
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                  {widget.type === "todo" && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg md:text-xl open_sans_font_700 cursor-pointer">TO-DO</h2>
                      </div>
                      <div className="space-y-3 open_sans_font">
                        {todos.slice(0, 2).map((todo) => (
                          <div
                            onClick={redirectToTodos}
                            key={todo.id}
                            className="p-2 cursor-pointer bg-black rounded-xl flex items-center justify-between"
                          >
                            <div>
                              <h3 className="font-semibold open_sans_font text-sm">{todo.title}</h3>
                              <p className="text-xs open_sans_font text-zinc-400">{todo.description}</p>
                            </div>
                            <button className="px-3 py-1.5 flex justify-center items-center gap-2 bg-blue-600 text-white rounded-xl text-xs">
                              <img src={Image10 || "/placeholder.svg"} alt="" className="w-4 h-4" />
                              {todo.assignee}
                            </button>
                          </div>
                        ))}
                        <Link
                          to={"/dashboard/to-do"}
                          className="text-sm open_sans_font text-white flex justify-center items-center text-center hover:underline"
                        >
                          See all
                        </Link>
                      </div>
                    </div>
                  )}
                  {widget.type === "birthday" && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg md:text-xl open_sans_font_700 cursor-pointer">Upcoming Birthday</h2>
                      </div>
                      <div className="space-y-2 open_sans_font">
                        {birthdays.slice(0, 2).map((birthday) => (
                          <div
                            key={birthday.id}
                            className="p-2 cursor-pointer bg-black rounded-xl flex items-center gap-2"
                          >
                            <div>
                              <img src={birthday.avatar || "/placeholder.svg"} className="h-8 w-8" alt="" />
                            </div>
                            <div>
                              <h3 className="font-semibold open_sans_font text-sm">{birthday.name}</h3>
                              <p className="text-xs open_sans_font text-zinc-400">{birthday.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {widget.type === "websiteLinks" && (
                    <div className="mb-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center mb-2">
                          <h2 className="text-lg open_sans_font md:text-xl open_sans_font_700 cursor-pointer">
                            Website Links
                          </h2>
                        </div>
                        <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                          <div className="space-y-3">
                            {customLinks.map((link, linkIndex) => (
                              <div key={link.id} className="p-1.5 bg-black rounded-xl relative">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <h3 className="text-sm font-medium">{link.title}</h3>
                                    <p className="text-xs mt-1 text-zinc-400">{link.url}</p>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() =>
                                        window.open(
                                          link.url.startsWith("http") ? link.url : `https://${link.url}`,
                                          "_blank",
                                        )
                                      }
                                      className="p-2 hover:bg-zinc-700 rounded-lg"
                                    >
                                      <ExternalLink size={16} />
                                    </button>
                                    {!isSidebarEditing && (
                                      <div className="relative">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            toggleDropdown(`sidebar-link-${link.id}`)
                                          }}
                                          className="p-2 hover:bg-zinc-700 rounded-lg"
                                        >
                                          <MoreVertical size={16} />
                                        </button>
                                        {openDropdownIndex === `sidebar-link-${link.id}` && (
                                          <div className="absolute right-0 top-full mt-1 w-32 bg-zinc-800 rounded-lg shadow-lg z-50 py-1">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                setEditingLink(link)
                                                setOpenDropdownIndex(null)
                                              }}
                                              className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-700"
                                            >
                                              Edit
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                removeCustomLink(link.id)
                                                setOpenDropdownIndex(null)
                                              }}
                                              className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-700 text-red-400"
                                            >
                                              Remove
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={addCustomLink}
                          className="w-full p-2 bg-black rounded-xl text-sm text-zinc-400 text-left hover:bg-zinc-900"
                        >
                          Add website link...
                        </button>
                      </div>
                    </div>
                  )}
                </RightSidebarWidget>
              ))}
          </div>
        </aside>
        {editingLink && <WebsiteLinkModal link={editingLink} onClose={() => setEditingLink(null)} />}
        <WidgetSelectionModal
          isOpen={isWidgetModalOpen}
          onClose={() => setIsWidgetModalOpen(false)}
          onSelectWidget={handleAddWidget}
          getWidgetStatus={getWidgetPlacementStatus}
        />
        <WidgetSelectionModal
          isOpen={isRightWidgetModalOpen}
          onClose={() => setIsRightWidgetModalOpen(false)}
          onSelectWidget={handleAddRightSidebarWidget}
          getWidgetStatus={getWidgetPlacementStatus}
        />
        <SelectedAppointmentModal
          selectedAppointment={selectedAppointment}
          setSelectedAppointment={setSelectedAppointment}
          appointmentTypes={appointmentTypes}
          freeAppointments={freeAppointments}
          handleAppointmentChange={handleAppointmentChange}
          appointments={appointments}
          setAppointments={setAppointments}
          setIsNotifyMemberOpen={setIsNotifyMemberOpen}
          setNotifyAction={setNotifyAction}
          onDelete={handleDeleteAppointment}
        />
      </div>
    </>
  )
}