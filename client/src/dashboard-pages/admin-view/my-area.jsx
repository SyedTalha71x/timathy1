/* eslint-disable no-empty */
// admin panel -- my area

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import Chart from "react-apexcharts"
import { BarChart3, MoreVertical, X, ChevronDown, Edit, Check, Plus, ExternalLink } from "lucide-react"
import { Toaster, toast } from "react-hot-toast"

import WidgetSelectionModal from "../../components/admin-dashboard-components/myarea-components/widgets"
import Sidebar from "../../components/admin-dashboard-components/myarea-components/myarea-sidebar"
import WebsiteLinkModal from "../../components/admin-dashboard-components/myarea-components/website-link-modal"
import ConfirmationModal from "../../components/admin-dashboard-components/myarea-components/confirmation-modal"
import { Eye, Minus } from "react-feather"
import ViewManagementModal from "../../components/admin-dashboard-components/myarea-components/view-management"
import NotesWidget from "../../components/admin-dashboard-components/myarea-components/notes-widgets"
import AddTaskModal from "../../components/admin-dashboard-components/myarea-components/add-task-modal"
import { configuredTagsData } from "../../utils/user-panel-states/todo-states"
import EditTaskModal from "../../components/admin-dashboard-components/myarea-components/edit-task-modal"

const DraggableWidget = ({
  id,
  children,
  index,
  moveWidget,
  removeWidget,
  isEditing,
  widgets,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
  isDragOver,
}) => {
  const ref = useRef(null)
  return (
    <div
      ref={ref}
      draggable={isEditing}
      onDragStart={(e) => onDragStart?.(index, e)} // pass event for dataTransfer
      onDragOver={(e) => onDragOver?.(index, e)}
      onDrop={(e) => onDrop?.(index, e)} // pass event for preventDefault + payload
      onDragEnd={onDragEnd}
      className={`relative mb-4 w-full ${isEditing ? "animate-wobble cursor-move" : ""} ${isDragging ? "dragging" : ""} ${isDragOver ? "drag-over" : ""}`}
    >
      {isEditing && (
        <div className="absolute top-2 right-2 z-10 flex gap-2">
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
  const [selectedMemberType, setSelectedMemberType] = useState("Studios Acquired")
  const [isChartDropdownOpen, setIsChartDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const chartDropdownRef = useRef(null)
  const navigate = useNavigate()
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false)
  const [isRightWidgetModalOpen, setIsRightWidgetModalOpen] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, linkId: null })

  const [savedViews, setSavedViews] = useState([])
  const [currentView, setCurrentView] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  const [isEditing, setIsEditing] = useState(false)
  const [isSidebarEditing, setIsSidebarEditing] = useState(false)
  const [dragIndex, setDragIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [widgets, setWidgets] = useState([
    { id: "chart", type: "chart", position: 0 },
    { id: "todo", type: "todo", position: 1 },
    { id: "websiteLink", type: "websiteLink", position: 2 },
    { id: "expiringContracts", type: "expiringContracts", position: 3 },
    { id: "notes", type: "notes", position: 4 },
  ])

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const todoFilterDropdownRef = useRef(null)
  const [configuredTags, setConfiguredTags] = useState(configuredTagsData)

  const [todoFilter, setTodoFilter] = useState("all")
  const [isTodoFilterDropdownOpen, setIsTodoFilterDropdownOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [taskToCancel, setTaskToCancel] = useState(null)

  const todoFilterOptions = [
    { value: "all", label: "All Tasks" },
    { value: "ongoing", label: "Ongoing", color: "#f59e0b" },
    { value: "completed", label: "Completed", color: "#10b981" },
    { value: "canceled", label: "Canceled", color: "#ef4444" },
  ]

  const getFilteredTodos = () => {
    switch (todoFilter) {
      case "ongoing":
        return todos.filter((todo) => todo.status === "ongoing")
      case "canceled":
        return todos.filter((todo) => todo.status === "canceled")
      case "completed":
        return todos.filter((todo) => todo.status === "completed")
      default:
        return todos
    }
  }

  // Sidebar widgets - now contains all widget types
  const [sidebarWidgets, setSidebarWidgets] = useState([
    { id: "sidebar-chart", type: "chart", position: 0 },
    { id: "sidebar-todo", type: "todo", position: 1 },
    { id: "sidebar-websiteLink", type: "websiteLink", position: 2 },
    { id: "sidebar-expiringContracts", type: "expiringContracts", position: 3 },
    { id: "sidebar-notes", type: "notes", position: 4 },
  ])

  const [customLinks, setCustomLinks] = useState([
    {
      id: "link1",
      url: "https://fitness-web-kappa.vercel.app/",
      title: "Timathy Fitness Town",
    },
    { id: "link2", url: "https://oxygengym.pk/", title: "Oxygen Gyms" },
    { id: "link3", url: "https://fitness-web-kappa.vercel.app/", title: "Timathy V1" },
  ])

  const truncateUrl = (url, maxLength = 40) => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength - 3) + "..."
  }

  const [todos, setTodos] = useState([
    {
      id: 1,
      title: "Review Design",
      description: "Review the new dashboard design",
      assignee: "Jack",
      dueDate: "2024-12-15",
      dueTime: "14:30",
      status: "ongoing",

    },
    {
      id: 2,
      title: "Team Meeting",
      description: "Weekly team sync",
      assignee: "Jack",
      dueDate: "2024-12-16",
      dueTime: "10:00",
      status: "completed",

    },
  ])

  const memberTypes = {
    "Studios Acquired": {
      data: [
        [30, 45, 60, 75, 90, 105, 120, 135, 150],
        [25, 40, 55, 70, 85, 100, 115, 130, 145],
      ],
      growth: "12%",
      title: "Studios Acquired",
    },
    Finance: {
      data: [
        [50000, 60000, 75000, 85000, 95000, 110000, 125000, 140000, 160000],
        [45000, 55000, 70000, 80000, 90000, 105000, 120000, 135000, 155000],
      ],
      growth: "8%",
      title: "Finance Statistics",
    },
    Leads: {
      data: [
        [120, 150, 180, 210, 240, 270, 300, 330, 360],
        [100, 130, 160, 190, 220, 250, 280, 310, 340],
      ],
      growth: "15%",
      title: "Leads Statistics",
    },
    Franchises: {
      data: [
        [120, 150, 180, 210, 240, 270, 300, 330, 360],
        [100, 130, 160, 190, 220, 250, 280, 310, 340],
      ],
      growth: "10%",
      title: "Franchises Acquired",
    },
  }

  const toggleDropdown = (index) => setOpenDropdownIndex(openDropdownIndex === index ? null : index)
  const toggleEditing = () => setIsEditing(!isEditing)
  const toggleSidebarEditing = () => setIsSidebarEditing(!isSidebarEditing)

  const getWidgetStatus = (widgetType) => {
    const existsInDashboard = widgets.some((widget) => widget.type === widgetType)
    if (existsInDashboard) return { canAdd: false, location: "dashboard" }
    return { canAdd: true, location: null }
  }

  const getSidebarWidgetStatus = (widgetType) => {
    const existsInSidebar = sidebarWidgets.some((widget) => widget.type === widgetType)
    if (existsInSidebar) return { canAdd: false, location: "sidebar" }
    return { canAdd: true, location: null }
  }

  const moveWidget = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= widgets.length) return
    const newWidgets = [...widgets]
    const [movedWidget] = newWidgets.splice(fromIndex, 1)
    newWidgets.splice(toIndex, 0, movedWidget)
    setWidgets(newWidgets.map((w, i) => ({ ...w, position: i })))
  }

  const removeWidget = (id) => {
    setWidgets((currentWidgets) => currentWidgets.filter((w) => w.id !== id))
  }

  const [editingLink, setEditingLink] = useState(null)

  const addCustomLink = () => {
    setEditingLink({})
  }

  const updateCustomLink = (id, field, value) => {
    setCustomLinks((currentLinks) => currentLinks.map((link) => (link.id === id ? { ...link, [field]: value } : link)))
  }

  const removeCustomLink = (id) => {
    setConfirmationModal({ isOpen: true, linkId: id })
  }

  const confirmRemoveLink = () => {
    if (confirmationModal.linkId) {
      setCustomLinks((currentLinks) => currentLinks.filter((link) => link.id !== confirmationModal.linkId))
      toast.success("Website link removed successfully")
    }
    setConfirmationModal({ isOpen: false, linkId: null })
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

  // Updated expiring contracts - all set to "Expiring Soon" with yellow status
  const [expiringContracts, setExpiringContracts] = useState([
    { id: 1, title: "Oxygen Gym Membership", expiryDate: "June 30, 2025", status: "Expiring Soon" },
    { id: 2, title: "Timathy Fitness Equipment Lease", expiryDate: "July 15, 2025", status: "Expiring Soon" },
    { id: 3, title: "Studio Space Rental", expiryDate: "August 5, 2025", status: "Expiring Soon" },
    { id: 4, title: "Insurance Policy", expiryDate: "September 10, 2025", status: "Expiring Soon" },
    { id: 5, title: "Software License", expiryDate: "October 20, 2025", status: "Expiring Soon" },
  ])

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
    markers: { size: 1, strokeWidth: 0, hover: { size: 6 } },
    xaxis: {
      categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: { style: { colors: "#999999", fontSize: "12px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: selectedMemberType === "Finance" ? 200000 : 500,
      tickAmount: 5,
      labels: {
        style: { colors: "#999999", fontSize: "12px" },
        formatter: (value) => {
          if (selectedMemberType === "Finance" && value >= 1000) return `$${(value / 1000).toFixed(0)}k`
          return Math.round(value)
        },
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
      style: { fontSize: "12px", fontFamily: "Inter, sans-serif" },
      custom: ({ series, seriesIndex, dataPointIndex }) => {
        let value = series[seriesIndex][dataPointIndex]
        if (selectedMemberType === "Finance") value = `$${value.toLocaleString()}`
        return (
          '<div class="apexcharts-tooltip-box" style="background: white; color: black; padding: 8px;">' +
          '<span style="color: black;">' +
          value +
          "</span></div>"
        )
      },
    },
  }

  const chartSeries = [
    { name: "Comp1", data: memberTypes[selectedMemberType].data[0] },
    { name: "Comp2", data: memberTypes[selectedMemberType].data[1] },
  ]

  const handleAddWidget = (widgetType) => {
    const newWidget = { id: `widget${Date.now()}`, type: widgetType, position: widgets.length }
    setWidgets((currentWidgets) => [...currentWidgets, newWidget])
    setIsWidgetModalOpen(false)
    toast.success(`${widgetType} widget has been added Successfully`)
  }

  const handleAddSidebarWidget = (widgetType) => {
    const newWidget = { id: `sidebar-widget${Date.now()}`, type: widgetType, position: sidebarWidgets.length }
    setSidebarWidgets((currentWidgets) => [...currentWidgets, newWidget])
    setIsRightWidgetModalOpen(false)
    toast.success(`${widgetType} widget has been added to sidebar Successfully`)
  }

  const handleDragStart = (index, e) => {
    if (!isEditing) return
    try {
      e.dataTransfer.effectAllowed = "move"
      e.dataTransfer.setData("text/plain", String(index))
    } catch { }
    setDragIndex(index)
  }
  const handleDragOver = (index, e) => {
    if (!isEditing) return
    e.preventDefault()
    try {
      e.dataTransfer.dropEffect = "move"
    } catch { }
    setDragOverIndex(index)
  }
  const handleDrop = (index, e) => {
    if (!isEditing) return
    e.preventDefault()
    let from = dragIndex
    if (from === null) {
      const payload = e.dataTransfer.getData("text/plain")
      if (payload) {
        const parsed = Number.parseInt(payload, 10)
        if (!Number.isNaN(parsed)) from = parsed
      }
    }
    if (from !== null && from !== index) {
      moveWidget(from, index)
    }
    setDragIndex(null)
    setDragOverIndex(null)
  }
  const handleDragEnd = () => {
    setDragIndex(null)
    setDragOverIndex(null)
  }


  const handleAddTask = (newTask) => {
    setTodos(prevTodos => [...prevTodos, newTask]) // Also add to todos if needed
    toast.success("Task added successfully!")
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

  const handleDeleteTask = (taskId) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== taskId))
    setTaskToDelete(null)
  }

  const handleCancelTask = (taskId) => {
    setTodos((prev) => prev.map((todo) => (todo.id === taskId ? { ...todo, status: "cancelled" } : todo)))
    setTaskToCancel(null)
  }

  const handleUpdateTask = (updatedTask) => {
    setTodos((prev) => prev.map((todo) => (todo.id === updatedTask.id ? updatedTask : todo)))
  }

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 2000, style: { background: "#333", color: "#fff" } }} />
      <style>{`
        @keyframes wobble {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(-1deg); }
          30% { transform: rotate(1deg); }
          45% { transform: rotate(-1deg); }
          60% { transform: rotate(1deg); }
          75% { transform: rotate(-1deg); }
          90% { transform: rotate(1deg); }
        }
          
        .animate-wobble { animation: wobble 0.5s ease-in-out infinite; }
        .dragging { opacity: 0.5; border: 2px dashed #fff; }
        .drag-over { border: 2px dashed #888; }
      `}</style>
      <div className="flex flex-col lg:flex-row rounded-3xl bg-[#1C1C1C] text-white min-h-screen">
        <main className="flex-1 min-w-0 p-2 overflow-hidden">
          <div className="p-3 md:p-5 space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">

              {/* Left Section */}
              <div className="flex items-center justify-between w-full gap-2">
                <h1 className="text-xl font-bold">My Area</h1>

                <img
                  onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                  className="h-5 w-5 md:hidden block cursor-pointer"
                  src="/icon.svg"
                  alt=""
                />
              </div>

              {/* Right Section */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:justify-end">

                {!isEditing && (
                  <button
                    onClick={() => setIsViewModalOpen(true)}
                    className="px-4 py-2 bg-zinc-700 w-full sm:w-auto text-zinc-200 rounded-xl text-sm flex justify-center items-center gap-2"
                  >
                    <Eye size={16} />
                    {currentView ? currentView.name : "Standard View"}
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
                  className={`px-6 py-2 text-sm flex md:w-auto w-full justify-center items-center gap-2 rounded-xl transition-colors ${isEditing ? "bg-blue-600 text-white" : "bg-zinc-700 text-zinc-200"
                    }`}
                >
                  {isEditing ? <Check size={18} /> : <Edit size={18} />}
                  <span className="hidden sm:inline">
                    {isEditing ? "Done" : "Edit Dashboard"}
                  </span>
                </button>

                <img
                  onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                  className="h-5 w-5 lg:hidden md:block hidden cursor-pointer mx-auto sm:mx-0"
                  src="/icon.svg"
                  alt=""
                />
              </div>
            </div>


            {/* Widgets */}
            <div className="space-y-4">
              {/* Chart Widget - Full Width */}
              {widgets
                .filter((widget) => widget.type === "chart")
                .sort((a, b) => a.position - b.position)
                .map((widget) => {
                  const idx = widgets.findIndex((w) => w.id === widget.id)
                  return (
                    <DraggableWidget
                      key={widget.id}
                      id={widget.id}
                      index={idx}
                      moveWidget={moveWidget}
                      removeWidget={removeWidget}
                      isEditing={isEditing}
                      widgets={widgets}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onDragEnd={handleDragEnd}
                      isDragging={dragIndex === idx}
                      isDragOver={dragOverIndex === idx}
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
                        <div className="overflow-x-auto">
                          <div className="min-w-[600px]">
                            <Chart options={chartOptions} series={chartSeries} type="line" height={300} />
                          </div>
                        </div>
                      </div>
                    </DraggableWidget>
                  )
                })}

              {/* Website Links and Expiring Contracts in Same Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Website Links Widget */}
                {widgets
                  .filter((widget) => widget.type === "websiteLink")
                  .sort((a, b) => a.position - b.position)
                  .map((widget) => {
                    const idx = widgets.findIndex((w) => w.id === widget.id)
                    return (
                      <DraggableWidget
                        key={widget.id}
                        id={widget.id}
                        index={idx}
                        moveWidget={moveWidget}
                        removeWidget={removeWidget}
                        isEditing={isEditing}
                        widgets={widgets}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onDragEnd={handleDragEnd}
                        isDragging={dragIndex === idx}
                        isDragOver={dragOverIndex === idx}
                      >
                        <div className="space-y-3 p-4 rounded-xl bg-[#2F2F2F] md:h-[350px] h-auto flex flex-col">
                          <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Website Links</h2>
                            <button
                              onClick={addCustomLink}
                              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition-colors"
                            >
                              <Plus size={18} />
                            </button>
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

                        </div>
                      </DraggableWidget>
                    )
                  })}

                {/* Expiring Contracts Widget */}
                {widgets
                  .filter((widget) => widget.type === "expiringContracts")
                  .sort((a, b) => a.position - b.position)
                  .map((widget) => {
                    const idx = widgets.findIndex((w) => w.id === widget.id)
                    return (
                      <DraggableWidget
                        key={widget.id}
                        id={widget.id}
                        index={idx}
                        moveWidget={moveWidget}
                        removeWidget={removeWidget}
                        isEditing={isEditing}
                        widgets={widgets}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onDragEnd={handleDragEnd}
                        isDragging={dragIndex === idx}
                        isDragOver={dragOverIndex === idx}
                      >
                        <div className="space-y-3 p-4 rounded-xl bg-[#2F2F2F] h-[350px] flex flex-col">
                          <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Expiring Contracts</h2>
                          </div>
                          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                            <div className="grid grid-cols-1 gap-3">
                              {expiringContracts.map((contract) => (
                                <Link to={"/admin-dashboard/contract"} key={contract.id}>
                                  <div className="p-4 bg-black rounded-xl">
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
                      </DraggableWidget>
                    )
                  })}

                {widgets
                  .filter((widget) => widget.type === "notes")
                  .sort((a, b) => a.position - b.position)
                  .map((widget) => {
                    const idx = widgets.findIndex((w) => w.id === widget.id)
                    return (
                      <DraggableWidget
                        key={widget.id}
                        id={widget.id}
                        index={idx}
                        moveWidget={moveWidget}
                        removeWidget={removeWidget}
                        isEditing={isEditing}
                        widgets={widgets}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onDragEnd={handleDragEnd}
                        isDragging={dragIndex === idx}
                        isDragOver={dragOverIndex === idx}
                      >
                        <NotesWidget />
                      </DraggableWidget>
                    )
                  })}

                {widgets
                  .filter((widget) => widget.type === "todo")
                  .sort((a, b) => a.position - b.position)
                  .map((widget) => {
                    const idx = widgets.findIndex((w) => w.id === widget.id)
                    return (
                      <DraggableWidget
                        key={widget.id}
                        id={widget.id}
                        index={idx}
                        moveWidget={moveWidget}
                        removeWidget={removeWidget}
                        isEditing={isEditing}
                        widgets={widgets}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onDragEnd={handleDragEnd}
                        isDragging={dragIndex === idx}
                        isDragOver={dragOverIndex === idx}
                      >
                        <div className="space-y-3 p-4 rounded-xl bg-[#2F2F2F] md:h-[340px] h-auto flex flex-col">
                          <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">To-Do</h2>
                            <button
                              onClick={() => setIsAddTaskModalOpen(true)}
                              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            >
                              <Plus size={18} />
                            </button>
                          </div>
                          <div className="relative mb-3 w-full" ref={todoFilterDropdownRef}>
                            <button
                              onClick={() => setIsTodoFilterDropdownOpen(!isTodoFilterDropdownOpen)}
                              className="flex  justify-between items-center w-full gap-2 px-3 py-1.5 bg-black rounded-xl text-white text-sm"
                            >
                              {todoFilterOptions.find((option) => option.value === todoFilter)?.label}
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            {isTodoFilterDropdownOpen && (
                              <div className="absolute z-10 mt-2 w-full bg-[#2F2F2F] rounded-xl shadow-lg">
                                {todoFilterOptions.map((option) => (
                                  <button
                                    key={option.value}
                                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-white hover:bg-black first:rounded-t-xl last:rounded-b-xl"
                                    onClick={() => {
                                      setTodoFilter(option.value)
                                      setIsTodoFilterDropdownOpen(false)
                                    }}
                                  >
                                    {option.color && (
                                      <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: option.color }}
                                      />
                                    )}
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
                      </DraggableWidget>
                    )
                  })}
              </div>
            </div>
          </div>
        </main>

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



        {/* Sidebar Component */}
        <Sidebar
          isOpen={isRightSidebarOpen}
          onClose={() => setIsRightSidebarOpen(false)}
          widgets={sidebarWidgets}
          setWidgets={setSidebarWidgets}
          isEditing={isSidebarEditing}
          todos={todos}
          setTodos={setTodos}
          customLinks={customLinks}
          setCustomLinks={setCustomLinks}
          expiringContracts={expiringContracts}
          selectedMemberType={selectedMemberType}
          setSelectedMemberType={setSelectedMemberType}
          memberTypes={memberTypes}
          onAddWidget={() => setIsRightWidgetModalOpen(true)}
          // updateCustomLink={updateCustomLink}
          // removeCustomLink={removeCustomLink}
          // editingLink={editingLink}
          // setEditingLink={setEditingLink}
          // openDropdownIndex={openDropdownIndex}
          // setOpenDropdownIndex={setOpenDropdownIndex}
          onToggleEditing={() => setIsSidebarEditing((v) => !v)} // wire up sidebar-only edit toggle
          handleTaskComplete={handleTaskComplete}
          toggleDropdown={toggleDropdown}
          openDropdownIndex={openDropdownIndex}

        />

        {isAddTaskModalOpen && <AddTaskModal
          onClose={() => setIsAddTaskModalOpen(false)}
          onAddTask={handleAddTask}
          configuredTags={configuredTags}
        />}

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

        {/* Modals */}
        {editingLink && (
          <WebsiteLinkModal
            link={editingLink}
            onClose={() => setEditingLink(null)}
            updateCustomLink={updateCustomLink}
            setCustomLinks={setCustomLinks}
          />
        )}

        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal({ isOpen: false, linkId: null })}
          onConfirm={confirmRemoveLink}
          title="Delete Website Link"
          message="Are you sure you want to delete this website link? This action cannot be undone."
        />

        <WidgetSelectionModal
          isOpen={isWidgetModalOpen}
          onClose={() => setIsWidgetModalOpen(false)}
          onSelectWidget={handleAddWidget}
          getWidgetStatus={getWidgetStatus}
          widgetArea="dashboard"
        />

        <WidgetSelectionModal
          isOpen={isRightWidgetModalOpen}
          onClose={() => setIsRightWidgetModalOpen(false)}
          onSelectWidget={handleAddSidebarWidget}
          getWidgetStatus={getSidebarWidgetStatus}
          widgetArea="sidebar"
        />
      </div>
    </>
  )
}
