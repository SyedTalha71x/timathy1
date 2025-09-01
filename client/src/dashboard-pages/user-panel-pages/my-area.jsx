"use client"

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useCallback, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Chart from "react-apexcharts"
import {
  MoreVertical,
  X,
  Clock,
  ChevronDown,
  Edit,
  Check,
  Plus,
  AlertTriangle,
  Info,
  CalendarIcon,
  Menu,
  Users,
  Minus,
  ExternalLink,
  Eye,
  Save,
  Globe,
  Lock,
  User,
  Pin,
  PinOff,
  Trash2,
  Settings,
  MessageCircle,
} from "lucide-react"
import Rectangle1 from "../../../public/Rectangle 1.png"
import { Toaster, toast } from "react-hot-toast"
import Avatar from "../../../public/avatar.png"
import { WidgetSelectionModal } from "../../components/widget-selection-modal"
import AppointmentActionModal from "../../components/appointments-components/appointment-action-modal"
import EditAppointmentModal from "../../components/appointments-components/selected-appointment-modal"
import EditTaskModal from "../../components/task-components/edit-task-modal"

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

const ViewManagementModal = ({
  isOpen,
  onClose,
  savedViews,
  setSavedViews,
  currentView,
  setCurrentView,
  widgets,
  setWidgets,
}) => {
  const [viewName, setViewName] = useState("")
  const [isGlobalVisible, setIsGlobalVisible] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [editingView, setEditingView] = useState(null)

  const currentUser = { id: "user123", name: "John Doe" }

  if (!isOpen) return null

  const handleSaveCurrentView = () => {
    if (!viewName.trim()) {
      toast.error("Please enter a view name")
      return
    }

    const newView = {
      id: `view_${Date.now()}`,
      name: viewName.trim(),
      widgets: [...widgets],
      isStandard: false,
      isGlobal: isGlobalVisible,
      createdBy: currentUser,
      createdAt: new Date().toISOString(),
    }

    setSavedViews((prev) => [...prev, newView])
    setViewName("")
    setIsGlobalVisible(false)
    setIsCreating(false)
    toast.success(`View "${newView.name}" saved successfully`)
  }

  const handleLoadView = (view) => {
    setWidgets([...view.widgets])
    setCurrentView(view)
    toast.success(`Loaded view: ${view.name}`)
    onClose()
  }

  const handleTogglePin = (viewId) => {
    setSavedViews((prev) =>
      prev.map((view) => ({
        ...view,
        isStandard: view.id === viewId ? !view.isStandard : false,
      })),
    )
    const view = savedViews.find((v) => v.id === viewId)
    toast.success(view?.isStandard ? "View unpinned" : "View pinned as standard")
  }

  const handleDeleteView = (viewId) => {
    setSavedViews((prev) => prev.filter((view) => view.id !== viewId))
    toast.success("View deleted")
  }

  const handleEditView = (view) => {
    setEditingView(view)
    setViewName(view.name)
    setIsGlobalVisible(view.isGlobal || false)
  }

  const handleUpdateView = () => {
    if (!viewName.trim()) {
      toast.error("Please enter a view name")
      return
    }

    setSavedViews((prev) =>
      prev.map((view) =>
        view.id === editingView.id ? { ...view, name: viewName.trim(), isGlobal: isGlobalVisible } : view,
      ),
    )

    setEditingView(null)
    setViewName("")
    setIsGlobalVisible(false)
    toast.success("View updated successfully")
  }

  const cancelEdit = () => {
    setEditingView(null)
    setViewName("")
    setIsGlobalVisible(false)
    setIsCreating(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
      <div className="bg-[#181818] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-white">Manage Dashboard Views</h3>
            <button onClick={onClose} className="p-2 hover:bg-zinc-700 rounded-lg text-white">
              <X size={20} />
            </button>
          </div>

          {/* Save Current View Section */}
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-black rounded-xl">
            <h4 className="text-base sm:text-lg font-medium text-white mb-3">
              {editingView ? "Edit View" : "Save Current View"}
            </h4>
            {!isCreating && !editingView ? (
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm sm:text-base"
              >
                <Save size={16} />
                Save Current Layout
              </button>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={viewName}
                  onChange={(e) => setViewName(e.target.value)}
                  placeholder="Enter view name..."
                  className="w-full p-2 sm:p-3 bg-zinc-800 rounded-lg text-white text-sm outline-none"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="globalVisible"
                    checked={isGlobalVisible}
                    onChange={(e) => setIsGlobalVisible(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-zinc-800 border-zinc-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="globalVisible" className="text-sm text-white flex items-center gap-1">
                    <Globe size={14} />
                    Make globally visible to all users
                  </label>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={editingView ? handleUpdateView : handleSaveCurrentView}
                    className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                  >
                    {editingView ? "Update" : "Save"}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 sm:px-4 py-2 bg-zinc-600 hover:bg-zinc-700 text-white rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Saved Views List */}
          <div>
            <h4 className="text-base sm:text-lg font-medium text-white mb-3">Saved Views</h4>
            <div className="space-y-3 max-h-[50vh] overflow-y-auto">
              {savedViews.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-zinc-400">
                  <Eye size={40} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm sm:text-base">No saved views yet</p>
                  <p className="text-xs sm:text-sm">Save your current layout to get started</p>
                </div>
              ) : (
                savedViews.map((view) => (
                  <div
                    key={view.id}
                    className={`p-3 sm:p-4 rounded-xl border transition-colors ${
                      currentView?.id === view.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-zinc-700 hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h5 className="font-medium text-white text-sm sm:text-base truncate">{view.name}</h5>
                          {view.isStandard && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded text-xs whitespace-nowrap">
                              <Pin size={12} />
                              Pinned
                            </span>
                          )}
                          <span
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs whitespace-nowrap ${
                              view.isGlobal ? "bg-green-600/20 text-green-400" : "bg-gray-600/20 text-gray-400"
                            }`}
                          >
                            {view.isGlobal ? <Globe size={12} /> : <Lock size={12} />}
                            {view.isGlobal ? "Global" : "Private"}
                          </span>
                          {currentView?.id === view.id && (
                            <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs whitespace-nowrap">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-zinc-400">
                            {view.widgets.length} widgets • Created {new Date(view.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-zinc-500 flex items-center gap-1">
                            <User size={12} />
                            Created by {view.createdBy?.name || "Unknown"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        <button
                          onClick={() => handleLoadView(view)}
                          className="px-2 sm:px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs sm:text-sm whitespace-nowrap"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleEditView(view)}
                          className="p-1.5 sm:p-2 hover:bg-zinc-700 rounded text-blue-400"
                          title="Edit view"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleTogglePin(view.id)}
                          className={`p-1.5 sm:p-2 hover:bg-zinc-700 rounded ${
                            view.isStandard ? "text-yellow-400" : "text-zinc-400"
                          }`}
                          title={view.isStandard ? "Unpin view" : "Pin as standard view"}
                        >
                          {view.isStandard ? <Pin size={14} /> : <PinOff size={14} />}
                        </button>
                        <button
                          onClick={() => handleDeleteView(view.id)}
                          className="p-1.5 sm:p-2 hover:bg-zinc-700 rounded text-red-400"
                          title="Delete view"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
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

  const [showAppointmentOptionsModal, setshowAppointmentOptionsModal] = useState(false)
  const [isNotifyMemberOpen, setIsNotifyMemberOpen] = useState(false)
  const [notifyAction, setNotifyAction] = useState("change")

  const [todoFilter, setTodoFilter] = useState("all")
  const [isTodoFilterDropdownOpen, setIsTodoFilterDropdownOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [taskToCancel, setTaskToCancel] = useState(null)
  const [isBirthdayMessageModalOpen, setIsBirthdayMessageModalOpen] = useState(false)
  const [selectedBirthdayPerson, setSelectedBirthdayPerson] = useState(null)
  const [birthdayMessage, setBirthdayMessage] = useState("")

  const [savedViews, setSavedViews] = useState([])
  const [currentView, setCurrentView] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [freeAppointments, setFreeAppointments] = useState([])
  const today = new Date().toISOString().split("T")[0]

  const [widgets, setWidgets] = useState([
    { id: "chart", type: "chart", position: 0 }, // Always full width
    { id: "expiringContracts", type: "expiringContracts", position: 1 }, // Moved to start of grid
    { id: "appointments", type: "appointments", position: 2 },
    { id: "staffCheckIn", type: "staffCheckIn", position: 3 },
    { id: "websiteLink", type: "websiteLink", position: 4 },
    { id: "communications", type: "communications", position: 5 },
    { id: "todo", type: "todo", position: 6 },
    { id: "birthday", type: "birthday", position: 7 },
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
      title: "Task 1",
      assignees: ["Jack"],
      roles: "Trainer",
      tags: ["Important", "Urgent"],
      status: "ongoing",
      category: "member",
      dueDate: "2025-01-15",
      isPinned: false,
      dueTime: "10:00 AM",
      completed: false,
    },
    {
      id: 2,
      title: "Review membership applications",
      assignees: ["Sarah"],
      roles: "Manager",
      tags: ["Review"],
      status: "pending",
      category: "staff",
      dueDate: "2025-01-20",
      isPinned: false,
      dueTime: "2:00 PM",
      completed: false,
    },
    {
      id: 3,
      title: "Update equipment maintenance",
      assignees: ["Mike"],
      roles: "Technician",
      tags: ["Maintenance"],
      status: "completed",
      category: "equipment",
      dueDate: "2025-01-10",
      isPinned: false,
      dueTime: "9:00 AM",
      completed: true,
    },
    {
      id: 4,
      title: "Prepare monthly report",
      assignees: ["Admin"],
      roles: "Admin",
      tags: ["Report", "Monthly"],
      status: "ongoing",
      category: "admin",
      dueDate: "2025-01-25",
      isPinned: false,
      dueTime: "11:00 AM",
      completed: false,
    },
  ])

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

  const [birthdays, setBirthdays] = useState([
    {
      id: 1,
      name: "John Smith",
      date: today, // Today's birthday for testing
      avatar: Rectangle1,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      date: "2025-01-20",
      avatar: Rectangle1,
    },
    {
      id: 3,
      name: "Mike Wilson",
      date: "2025-01-25",
      avatar: Rectangle1,
    },
  ])

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
    "Top-selling by revenue": {
      data: [
        [40, 160, 120, 280, 180, 250, 220, 180, 300],
        [60, 100, 140, 80, 120, 200, 280, 100, 260],
      ],
      growth: "2%",
      title: "Top-selling by revenue",
    },
    "Most frequently sold": {
      data: [
        [40, 160, 120, 280, 180, 250, 220, 180, 300],
        [60, 100, 140, 80, 120, 200, 280, 100, 260],
      ],
      growth: "3%",
      title: "Most frequently sold",
    },
  }

  const toggleRightSidebar = () => setIsRightSidebarOpen(!isRightSidebarOpen)
  const redirectToTodos = () => navigate("/dashboard/to-do")
  const redirectToCommunication = () => navigate("/dashboard/communication")
  const toggleDropdown = (index) => setOpenDropdownIndex(openDropdownIndex === index ? null : index)
  const toggleEditing = () => setIsEditing(!isEditing)
  const toggleSidebarEditing = () => setIsSidebarEditing(!isSidebarEditing) // Toggle sidebar edit mode
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [editingNoteText, setEditingNoteText] = useState("")
  const todoFilterDropdownRef = useRef(null)

  const [selectedAppointment, setselectedAppointment] = useState()
  const [isEditAppointmentModalOpen, setisEditAppointmentModalOpen] = useState(false)

  const getWidgetPlacementStatus = useCallback(
    (widgetType, widgetArea = "dashboard") => {
      if (widgetArea === "dashboard") {
        // Only check main dashboard widgets for dashboard area
        const existsInMain = widgets.some((widget) => widget.type === widgetType)
        if (existsInMain) {
          return { canAdd: false, location: "dashboard" }
        }
        return { canAdd: true, location: null }
      } else if (widgetArea === "sidebar") {
        // Only check sidebar widgets for sidebar area
        const existsInSidebar = rightSidebarWidgets.some((widget) => widget.type === widgetType)
        if (existsInSidebar) {
          return { canAdd: false, location: "sidebar" }
        }
        return { canAdd: true, location: null }
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

  const isBirthdayToday = (date) => {
    return date === today
  }

  const truncateUrl = (url, maxLength = 40) => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength - 3) + "..."
  }

  const getFilteredTodos = () => {
    switch (todoFilter) {
      case "ongoing":
        return todos.filter((todo) => todo.status === "ongoing")
      case "pending":
        return todos.filter((todo) => todo.status === "pending")
      case "completed":
        return todos.filter((todo) => todo.status === "completed")
      default:
        return todos
    }
  }

  const handleTaskComplete = (taskId) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === taskId
          ? { ...todo, completed: !todo.completed, status: todo.completed ? "ongoing" : "completed" }
          : todo,
      ),
    )
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsEditTaskModalOpen(true)
  }

  const handleUpdateTask = (updatedTask) => {
    setTodos((prev) => prev.map((todo) => (todo.id === updatedTask.id ? updatedTask : todo)))
  }

  const handleDeleteTask = (taskId) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== taskId))
    setTaskToDelete(null)
  }

  const handleCancelTask = (taskId) => {
    setTodos((prev) => prev.map((todo) => (todo.id === taskId ? { ...todo, status: "cancelled" } : todo)))
    setTaskToCancel(null)
  }

  useEffect(() => {
    const savedViewsData = localStorage.getItem("dashboardViews")
    if (savedViewsData) {
      const views = JSON.parse(savedViewsData)
      setSavedViews(views)

      // Load standard view if exists
      const standardView = views.find((view) => view.isStandard)
      if (standardView) {
        setWidgets([...standardView.widgets])
        setCurrentView(standardView)
      }
    }
  }, [])

  useEffect(() => {
    if (savedViews.length > 0) {
      localStorage.setItem("dashboardViews", JSON.stringify(savedViews))
    }
  }, [savedViews])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownIndex(null)
      }
      if (chartDropdownRef.current && !chartDropdownRef.current.contains(event.target)) {
        setIsChartDropdownOpen(false)
      }
      if (todoFilterDropdownRef.current && !todoFilterDropdownRef.current.contains(event.target)) {
        setIsTodoFilterDropdownOpen(false)
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

  const handleAddWidget = (widgetType) => {
    const { canAdd, location } = getWidgetPlacementStatus(widgetType, "dashboard")
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

  const handleAddRightSidebarWidget = (widgetType) => {
    const { canAdd, location } = getWidgetPlacementStatus(widgetType, "sidebar")
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

  const handleViewMemberDetails = () => {
    toast.success("View member functionality will be implemented here later from backend")
    setshowAppointmentOptionsModal(false)
  }

  const isEventInPast = (eventStart) => {
    const now = new Date()
    const eventDate = new Date(eventStart)
    return eventDate < now
  }

  const handleAppointmentOptionsModal = (appointment) => {
    setselectedAppointment(appointment)
    setshowAppointmentOptionsModal(true)
    setisEditAppointmentModalOpen(false) // Ensure edit modal is closed
  }

  const handleCancelAppointment = () => {
    setshowAppointmentOptionsModal(false)
    setNotifyAction("cancel")
    if (selectedAppointment) {
      // Update the selected appointment's status locally for the modal
      const updatedApp = { ...selectedAppointment, status: "cancelled", isCancelled: true }
      setselectedAppointment(updatedApp)
      setIsNotifyMemberOpen(true) // Show notification modal
    }
  }

  const actuallyHandleCancelAppointment = (shouldNotify) => {
    if (!appointments || !setAppointments || !selectedAppointment) return
    const updatedAppointments = appointments.map((app) =>
      app.id === selectedAppointment.id ? { ...app, status: "cancelled", isCancelled: true } : app,
    )
    setAppointments(updatedAppointments)
    toast.success("Appointment cancelled successfully")
    if (shouldNotify) {
      console.log("Notifying member about cancellation")
    }
    setselectedAppointment(null) // Clear selected appointment after action
  }

  const handleDeleteAppointment = (id) => {
    // setMemberAppointments(memberAppointments.filter((app) => app.id !== id))
    setselectedAppointment(null)
    setisEditAppointmentModalOpen(false)
    setIsNotifyMemberOpen(true)
    setNotifyAction("delete")
    toast.success("Appointment deleted successfully")
  }

  const handleNotifyMember = (shouldNotify) => {
    setIsNotifyMemberOpen(false)
    toast.success("Member notified successfully!")
  }

  const handleSendBirthdayMessage = (person) => {
    setSelectedBirthdayPerson(person)
    setBirthdayMessage(`Happy Birthday ${person.name}! 🎉 Wishing you a wonderful day filled with joy and celebration!`)
    setIsBirthdayMessageModalOpen(true)
  }

  const handleSendCustomBirthdayMessage = () => {
    if (birthdayMessage.trim()) {
      toast.success(`Birthday message sent to ${selectedBirthdayPerson.name}!`)
      setIsBirthdayMessageModalOpen(false)
      setBirthdayMessage("")
      setSelectedBirthdayPerson(null)
    }

    setBirthdayMessage("")
    setSelectedBirthdayPerson(null)
  }

  const todoFilterOptions = [
    { value: "all", label: "All" },
    { value: "ongoing", label: "Ongoing" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
  ]

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
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden block" onClick={toggleRightSidebar} />
        )}
        <main className="flex-1 min-w-0 p-2 overflow-hidden">
          <div className="p-1 md:p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Top Row (Title + Menu on mobile, Title only on desktop) */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold">My Area</h1>
                  {currentView && (
                    <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs whitespace-nowrap">
                      {currentView.name}
                    </span>
                  )}
                </div>

                {/* Menu Icon → visible on mobile and medium screens */}
                <button
                  onClick={toggleRightSidebar}
                  className="p-3 text-zinc-400 hover:bg-zinc-800 rounded-xl lg:hidden"
                >
                  <Menu size={20} />
                </button>
              </div>

              {/* Buttons Section */}
              <div className="flex flex-wrap justify-center md:justify-end gap-2">
                <button
                  onClick={() => setIsViewModalOpen(true)}
                  className="px-4 py-2 bg-zinc-700 w-full md:w-auto text-zinc-200 rounded-xl text-sm flex justify-center items-center gap-2"
                >
                  <Settings size={16} />
                  {currentView ? currentView.name : "Standard View"}
                </button>

                {!isEditing && (
                  <button
                    onClick={() => setIsViewModalOpen(true)}
                    className="px-4 py-2 bg-zinc-700 md:w-auto w-full text-zinc-200 rounded-xl text-sm flex justify-center items-center gap-2"
                  >
                    <Settings size={16} />
                    Manage Views
                  </button>
                )}

                {isEditing && (
                  <button
                    onClick={() => setIsWidgetModalOpen(true)}
                    className="py-2 px-4 bg-black md:w-auto w-full justify-center text-white rounded-xl text-sm flex items-center gap-1"
                  >
                    <Plus size={20} />
                    <span className="hidden sm:inline">Add Widget</span>
                  </button>
                )}

                <button
                  onClick={toggleEditing}
                  className={`px-6 py-2 text-sm flex md:w-auto w-full justify-center items-center gap-2 rounded-xl transition-colors ${
                    isEditing ? "bg-blue-600 text-white" : "bg-zinc-700 text-zinc-200"
                  }`}
                >
                  {isEditing ? <Check size={18} /> : <Edit size={18} />}
                  <span className="hidden sm:inline">{isEditing ? "Done" : "Edit Dashboard"}</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                          <div className="space-y-2 max-h-[25vh] overflow-y-auto custom-scrollbar pr-1">
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
                                      handleAppointmentOptionsModal(appointment)
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
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium truncate">{link.title}</h3>
                                    <p className="text-xs mt-1 text-zinc-400 truncate max-w-[200px]">
                                      {truncateUrl(link.url)}
                                    </p>
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
                      {widget.type === "communications" && (
                        <div className="space-y-3 p-4 rounded-xl bg-[#2F2F2F] md:h-[340px] h-auto flex flex-col">
                          <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Communications</h2>
                          </div>
                          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                            <div className="space-y-2">
                              {communications.slice(0, 3).map((comm) => (
                                <div
                                  onClick={redirectToCommunication}
                                  key={comm.id}
                                  className="p-3 cursor-pointer bg-black rounded-xl"
                                >
                                  <div className="flex items-center gap-3 mb-2">
                                    <img
                                      src={comm.avatar || "/placeholder.svg"}
                                      alt="User"
                                      className="rounded-full h-10 w-10"
                                    />
                                    <div>
                                      <h3 className="text-sm font-medium">{comm.name}</h3>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-xs text-zinc-400 mb-1">{comm.message}</p>
                                    <p className="text-xs flex gap-1 items-center text-zinc-400">
                                      <Clock size={12} />
                                      {comm.time}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-center">
                            <Link to={"/dashboard/communication"} className="text-sm text-white hover:underline">
                              See all
                            </Link>
                          </div>
                        </div>
                      )}
                      {widget.type === "todo" && (
                        <div className="space-y-3 p-4 rounded-xl bg-[#2F2F2F] md:h-[340px] h-auto flex flex-col">
                          <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">TO-DO</h2>
                          </div>
                          <div className="relative mb-3" ref={todoFilterDropdownRef}>
                            <button
                              onClick={() => setIsTodoFilterDropdownOpen(!isTodoFilterDropdownOpen)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-black rounded-xl text-white text-sm"
                            >
                              {todoFilterOptions.find((option) => option.value === todoFilter)?.label}
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            {isTodoFilterDropdownOpen && (
                              <div className="absolute z-10 mt-2 w-32 bg-[#2F2F2F] rounded-xl shadow-lg">
                                {todoFilterOptions.map((option) => (
                                  <button
                                    key={option.value}
                                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-black"
                                    onClick={() => {
                                      setTodoFilter(option.value)
                                      setIsTodoFilterDropdownOpen(false)
                                    }}
                                  >
                                    {option.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                            <div className="space-y-2">
                              {getFilteredTodos()
                                .slice(0, 3)
                                .map((todo) => (
                                  <div
                                    key={todo.id}
                                    className="p-3 bg-black rounded-xl flex items-center justify-between"
                                  >
                                    <div className="flex items-center gap-2 flex-1">
                                      <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => handleTaskComplete(todo.id)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                      />
                                      <div className="flex-1">
                                        <h3
                                          className={`font-semibold text-sm ${todo.completed ? "line-through text-gray-500" : ""}`}
                                        >
                                          {todo.title}
                                        </h3>
                                        <p className="text-xs text-zinc-400">
                                          Due: {todo.dueDate} {todo.dueTime && `at ${todo.dueTime}`}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="relative">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          toggleDropdown(`main-todo-${todo.id}`)
                                        }}
                                        className="p-1 hover:bg-zinc-700 rounded"
                                      >
                                        <MoreVertical size={16} />
                                      </button>
                                      {openDropdownIndex === `main-todo-${todo.id}` && (
                                        <div className="absolute right-0 top-8 bg-[#2F2F2F] rounded-lg shadow-lg z-10 min-w-[120px]">
                                          <button
                                            onClick={() => {
                                              handleEditTask(todo)
                                              setOpenDropdownIndex(null)
                                            }}
                                            className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-600 rounded-t-lg"
                                          >
                                            Edit Task
                                          </button>
                                          <button
                                            onClick={() => {
                                              setTaskToCancel(todo.id)
                                              setOpenDropdownIndex(null)
                                            }}
                                            className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-600"
                                          >
                                            Cancel Task
                                          </button>
                                          <button
                                            onClick={() => {
                                              setTaskToDelete(todo.id)
                                              setOpenDropdownIndex(null)
                                            }}
                                            className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-600 rounded-b-lg text-red-400"
                                          >
                                            Delete Task
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                          <div className="flex justify-center">
                            <Link to={"/dashboard/to-do"} className="text-sm text-white hover:underline">
                              See all
                            </Link>
                          </div>
                        </div>
                      )}
                      {widget.type === "birthday" && (
                        <div className="space-y-3 p-4 rounded-xl bg-[#2F2F2F] md:h-[340px] h-auto flex flex-col">
                          <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Upcoming Birthday</h2>
                          </div>
                          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                            <div className="space-y-2">
                              {birthdays.slice(0, 3).map((birthday) => (
                                <div
                                  key={birthday.id}
                                  className={`p-3 cursor-pointer rounded-xl flex items-center gap-3 justify-between ${
                                    isBirthdayToday(birthday.date)
                                      ? "bg-yellow-900/30 border border-yellow-600"
                                      : "bg-black"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div>
                                      <img
                                        src={birthday.avatar || "/placeholder.svg"}
                                        className="h-10 w-10 rounded-full"
                                        alt=""
                                      />
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-sm flex items-center gap-1">
                                        {birthday.name}
                                        {isBirthdayToday(birthday.date) && <span className="text-yellow-500">🎂</span>}
                                      </h3>
                                      <p className="text-xs text-zinc-400">{birthday.date}</p>
                                    </div>
                                  </div>
                                  {isBirthdayToday(birthday.date) && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleSendBirthdayMessage(birthday)
                                      }}
                                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                                      title="Send Birthday Message"
                                    >
                                      <MessageCircle size={16} />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
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
          lg:relative lg:translate-x-0
        `}
        >
          <div className="p-4 md:p-5 h-full overflow-y-auto">
            {/* Header with close button and add widget button */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Sidebar</h2>
              <div className="flex items-center gap-2">
                {/* Only show Add Widget button when sidebar editing is active */}
                {isSidebarEditing && (
                  <button
                    onClick={() => setIsRightWidgetModalOpen(true)}
                    className="py-2 px-4 bg-black text-white rounded-xl text-sm cursor-pointer flex items-center gap-1"
                    title="Add Widget"
                  >
                    <Plus size={16} />
                    <span className="hidden sm:inline">Add Widget</span>
                  </button>
                )}
                <button
                  onClick={toggleSidebarEditing}
                  className={`px-6 py-2 text-sm ${
                    isSidebarEditing ? "bg-blue-600 text-white " : "bg-zinc-700 text-zinc-200 "
                  } rounded-xl flex items-center gap-2 transition-colors`}
                  title="Edit Sidebar"
                >
                  {isSidebarEditing ? <Check size={18} /> : <Edit size={18} />}
                  <span className="hidden sm:inline">{isSidebarEditing ? "Done" : "Edit Sidebar"}</span>
                </button>
                <button
                  onClick={toggleRightSidebar}
                  className="p-3 text-zinc-400 hover:bg-zinc-700 rounded-xl lg:hidden"
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
                      <div className="relative mb-3" ref={todoFilterDropdownRef}>
                        <button
                          onClick={() => setIsTodoFilterDropdownOpen(!isTodoFilterDropdownOpen)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-black rounded-xl text-white text-sm w-full justify-between"
                        >
                          {todoFilterOptions.find((option) => option.value === todoFilter)?.label}
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        {isTodoFilterDropdownOpen && (
                          <div className="absolute z-10 mt-2 w-full bg-[#2F2F2F] rounded-xl shadow-lg">
                            {todoFilterOptions.map((option) => (
                              <button
                                key={option.value}
                                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-black first:rounded-t-xl last:rounded-b-xl"
                                onClick={() => {
                                  setTodoFilter(option.value)
                                  setIsTodoFilterDropdownOpen(false)
                                }}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="space-y-3 open_sans_font">
                        {getFilteredTodos()
                          .slice(0, 3)
                          .map((todo) => (
                            <div key={todo.id} className="p-2 bg-black rounded-xl flex items-center justify-between">
                              <div className="flex items-center gap-2 flex-1">
                                <input
                                  type="checkbox"
                                  checked={todo.completed}
                                  onChange={() => handleTaskComplete(todo.id)}
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <div className="flex-1">
                                  <h3
                                    className={`font-semibold open_sans_font text-sm ${todo.completed ? "line-through text-gray-500" : ""}`}
                                  >
                                    {todo.title}
                                  </h3>
                                  <p className="text-xs open_sans_font text-zinc-400">
                                    Due: {todo.dueDate} {todo.dueTime && `at ${todo.dueTime}`}
                                  </p>
                                </div>
                              </div>
                              <div className="relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleDropdown(`todo-${todo.id}`)
                                  }}
                                  className="p-1 hover:bg-zinc-700 rounded"
                                >
                                  <MoreVertical size={16} />
                                </button>
                                {openDropdownIndex === `todo-${todo.id}` && (
                                  <div className="absolute right-0 top-8 bg-[#2F2F2F] rounded-lg shadow-lg z-10 min-w-[120px]">
                                    <button
                                      onClick={() => {
                                        handleEditTask(todo)
                                        setOpenDropdownIndex(null)
                                      }}
                                      className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-600 rounded-t-lg"
                                    >
                                      Edit Task
                                    </button>
                                    <button
                                      onClick={() => {
                                        setTaskToCancel(todo.id)
                                        setOpenDropdownIndex(null)
                                      }}
                                      className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-600"
                                    >
                                      Cancel Task
                                    </button>
                                    <button
                                      onClick={() => {
                                        setTaskToDelete(todo.id)
                                        setOpenDropdownIndex(null)
                                      }}
                                      className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-600 rounded-b-lg text-red-400"
                                    >
                                      Delete Task
                                    </button>
                                  </div>
                                )}
                              </div>
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
                        {birthdays.slice(0, 3).map((birthday) => (
                          <div
                            key={birthday.id}
                            className={`p-2 cursor-pointer rounded-xl flex items-center gap-2 justify-between ${
                              isBirthdayToday(birthday.date) ? "bg-yellow-900/30 border border-yellow-600" : "bg-black"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div>
                                <img
                                  src={birthday.avatar || "/placeholder.svg"}
                                  className="h-8 w-8 rounded-full"
                                  alt=""
                                />
                              </div>
                              <div>
                                <h3 className="font-semibold open_sans_font text-sm flex items-center gap-1">
                                  {birthday.name}
                                  {isBirthdayToday(birthday.date) && <span className="text-yellow-500">🎂</span>}
                                </h3>
                                <p className="text-xs open_sans_font text-zinc-400">{birthday.date}</p>
                              </div>
                            </div>
                            {isBirthdayToday(birthday.date) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSendBirthdayMessage(birthday)
                                }}
                                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                                title="Send Birthday Message"
                              >
                                <MessageCircle size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {widget.type === "websiteLinks" && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg md:text-xl open_sans_font_700 cursor-pointer">Website Links</h2>
                      </div>
                      <div className="space-y-2 open_sans_font">
                        {customLinks.map((link) => (
                          <div
                            key={link.id}
                            className="p-2 cursor-pointer bg-black rounded-xl flex items-center justify-between"
                          >
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold open_sans_font text-sm truncate">{link.title}</h3>
                              <p className="text-xs open_sans_font text-zinc-400 truncate max-w-[150px]">
                                {truncateUrl(link.url, 30)}
                              </p>
                            </div>
                            <button
                              onClick={() => window.open(link.url, "_blank")}
                              className="p-2 hover:bg-zinc-700 rounded-lg"
                            >
                              <ExternalLink size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </RightSidebarWidget>
              ))}
          </div>
        </aside>

        {isEditTaskModalOpen && editingTask && (
          <EditTaskModal
            task={editingTask}
            onClose={() => {
              setIsEditTaskModalOpen(false)
              setEditingTask(null)
            }}
            onUpdateTask={handleUpdateTask}
          />
        )}

        {taskToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#181818] rounded-xl p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Delete Task</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this task? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setTaskToDelete(null)}
                  className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#2F2F2F]/90"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteTask(taskToDelete)}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {taskToCancel && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#181818] rounded-xl p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Cancel Task</h3>
              <p className="text-gray-300 mb-6">Are you sure you want to cancel this task?</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setTaskToCancel(null)}
                  className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#2F2F2F]/90"
                >
                  No
                </button>
                <button
                  onClick={() => handleCancelTask(taskToCancel)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700"
                >
                  Cancel Task
                </button>
              </div>
            </div>
          </div>
        )}

        <AppointmentActionModal
          isOpen={showAppointmentOptionsModal}
          onClose={() => {
            setshowAppointmentOptionsModal(false)
            setselectedAppointment(null) // Reset the selected appointment when closing
          }}
          appointment={selectedAppointment}
          isEventInPast={isEventInPast}
          onEdit={() => {
            setshowAppointmentOptionsModal(false) // Close the options modal
            setisEditAppointmentModalOpen(true) // Open the edit modal
          }}
          onCancel={handleCancelAppointment}
          onViewMember={handleViewMemberDetails}
        />

        {isNotifyMemberOpen && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
            onClick={() => setIsNotifyMemberOpen(false)}
          >
            <div
              className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Notify Member</h2>
                <button
                  onClick={() => {
                    setIsNotifyMemberOpen(false)
                  }}
                  className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
                >
                  {" "}
                  <X size={20} />{" "}
                </button>
              </div>
              <div className="p-6">
                <p className="text-white text-sm">
                  {" "}
                  Do you want to notify the member about this{" "}
                  {notifyAction === "change"
                    ? "change"
                    : notifyAction === "cancel"
                      ? "cancellation"
                      : notifyAction === "delete"
                        ? "deletion"
                        : "booking"}{" "}
                  ?{" "}
                </p>
              </div>
              <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
                <button
                  onClick={() => {
                    if (notifyAction === "cancel") {
                      actuallyHandleCancelAppointment(true) // Confirm cancellation and notify
                    } else {
                      handleNotifyMember(true) // Confirm other changes and notify
                    }
                    setIsNotifyMemberOpen(false)
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
                >
                  {" "}
                  Yes, Notify Member{" "}
                </button>
                <button
                  onClick={() => {
                    if (notifyAction === "cancel") {
                      actuallyHandleCancelAppointment(false) // Confirm cancellation without notifying
                    } else {
                      handleNotifyMember(false) // Cancel other changes and don't notify (triggers revert)
                    }
                    setIsNotifyMemberOpen(false)
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gray-800 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors"
                >
                  {" "}
                  No, Don't Notify{" "}
                </button>
              </div>
            </div>
          </div>
        )}

        {isBirthdayMessageModalOpen && selectedBirthdayPerson && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Send Birthday Message</h2>
                  <button
                    onClick={() => {
                      setIsBirthdayMessageModalOpen(false)
                      setBirthdayMessage("")
                      setSelectedBirthdayPerson(null)
                    }}
                    className="p-2 hover:bg-zinc-700 rounded-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-3 p-3 bg-black rounded-xl">
                  <img
                    src={selectedBirthdayPerson.avatar || "/placeholder.svg"}
                    className="h-10 w-10 rounded-full"
                    alt=""
                  />
                  <div>
                    <h3 className="font-semibold text-sm">{selectedBirthdayPerson.name}</h3>
                    <p className="text-xs text-zinc-400">Birthday: {selectedBirthdayPerson.date}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-zinc-400">Your Message</label>
                  <textarea
                    value={birthdayMessage}
                    onChange={(e) => setBirthdayMessage(e.target.value)}
                    className="w-full p-3 bg-black rounded-xl text-sm outline-none resize-none"
                    rows={4}
                    placeholder="Write your birthday message..."
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      setIsBirthdayMessageModalOpen(false)
                      setBirthdayMessage("")
                      setSelectedBirthdayPerson(null)
                    }}
                    className="px-4 py-2 text-sm rounded-xl hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendCustomBirthdayMessage}
                    disabled={!birthdayMessage.trim()}
                    className={`px-4 py-2 text-sm rounded-xl ${
                      !birthdayMessage.trim() ? "bg-blue-600/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <ViewManagementModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          savedViews={savedViews}
          setSavedViews={setSavedViews}
          currentView={currentView}
          setCurrentView={setCurrentView}
          widgets={widgets}
          setWidgets={setWidgets}
        />

        {editingLink && <WebsiteLinkModal link={editingLink} onClose={() => setEditingLink(null)} />}
        <WidgetSelectionModal
          isOpen={isWidgetModalOpen}
          onClose={() => setIsWidgetModalOpen(false)}
          onSelectWidget={handleAddWidget}
          getWidgetStatus={(widgetType) => getWidgetPlacementStatus(widgetType, "dashboard")}
          widgetArea="dashboard"
        />
        <WidgetSelectionModal
          isOpen={isRightWidgetModalOpen}
          onClose={() => setIsRightWidgetModalOpen(false)}
          onSelectWidget={handleAddRightSidebarWidget}
          getWidgetStatus={(widgetType) => getWidgetPlacementStatus(widgetType, "sidebar")}
          widgetArea="sidebar"
        />

        {isEditAppointmentModalOpen && selectedAppointment && (
          <EditAppointmentModal
            selectedAppointment={selectedAppointment}
            setSelectedAppointment={setselectedAppointment}
            appointmentTypes={appointmentTypes}
            freeAppointments={freeAppointments}
            handleAppointmentChange={(changes) => {
              setselectedAppointment({ ...selectedAppointment, ...changes })
            }}
            appointments={appointments}
            setAppointments={setAppointments}
            setIsNotifyMemberOpen={setIsNotifyMemberOpen}
            setNotifyAction={setNotifyAction}
            onDelete={handleDeleteAppointment}
            onClose={() => {
              setisEditAppointmentModalOpen(false)
              setselectedAppointment(null) // Reset the selected appointment
            }}
          />
        )}
      </div>
    </>
  )
}
