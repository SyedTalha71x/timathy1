/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import Chart from "react-apexcharts"
import {
  BarChart3,
  MoreVertical,
  X,
  ChevronDown,
  Edit,
  Check,
  ArrowDown,
  ArrowUp,
  Plus,
  ExternalLink,
} from "lucide-react"
import { Toaster, toast } from "react-hot-toast"
import WidgetSelectionModal from '../../components/customer-dashboard/myarea-components/widgets'
import Sidebar from '../../components/customer-dashboard/myarea-components/myarea-sidebar'
import WebsiteLinkModal from "../../components/customer-dashboard/myarea-components/website-link-modal"
import ConfirmationModal from "../../components/customer-dashboard/myarea-components/confirmation-modal"

const DraggableWidget = ({ id, children, index, moveWidget, removeWidget, isEditing, widgets }) => {
  const ref = useRef(null)
  return (
    <div ref={ref} className="relative mb-4 w-full">
      {isEditing && (
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          <button
            onClick={() => moveWidget(index, index - 1)}
            className="p-1.5 bg-gray-800 rounded hover:bg-gray-700"
            disabled={index === 0}
          >
            <ArrowUp size={12} />
          </button>
          <button
            onClick={() => moveWidget(index, index + 1)}
            className="p-1.5 bg-gray-800 rounded hover:bg-gray-700"
            disabled={index === widgets.length - 1}
          >
            <ArrowDown size={12} />
          </button>

          <button onClick={() => removeWidget(id)} className="p-1.5 bg-gray-800 rounded hover:bg-gray-700">
            <X size={12} />
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

  const [isEditing, setIsEditing] = useState(false)
  const [widgets, setWidgets] = useState([
    { id: "chart", type: "chart", position: 0 },
    { id: "todo", type: "todo", position: 1 },
    { id: "websiteLink", type: "websiteLink", position: 2 },
    { id: "expiringContracts", type: "expiringContracts", position: 3 },
  ])

  // Sidebar widgets - now contains all widget types
  const [sidebarWidgets, setSidebarWidgets] = useState([
    { id: "sidebar-chart", type: "chart", position: 0 },
    { id: "sidebar-todo", type: "todo", position: 1 },
    { id: "sidebar-websiteLink", type: "websiteLink", position: 2 },
    { id: "sidebar-expiringContracts", type: "expiringContracts", position: 3 },
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

  const [availableWidgetTypes] = useState(["chart", "todo", "websiteLink", "expiringContracts"])

  const [todos, setTodos] = useState([
    {
      id: 1,
      title: "Review Design",
      description: "Review the new dashboard design",
      assignee: "Jack",
      dueDate: "2024-12-15",
      dueTime: "14:30",
    },
    {
      id: 2,
      title: "Team Meeting",
      description: "Weekly team sync",
      assignee: "Jack",
      dueDate: "2024-12-16",
      dueTime: "10:00",
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

  // Add this function to your MyArea component to replace the existing canAddWidget functions

  const getWidgetStatus = (widgetType) => {
    // Check if widget exists in main dashboard widgets
    const existsInDashboard = widgets.some((widget) => widget.type === widgetType)

    if (existsInDashboard) {
      return { canAdd: false, location: "dashboard" }
    }

    return { canAdd: true, location: null }
  }

  const getSidebarWidgetStatus = (widgetType) => {
    // Check if widget exists in sidebar widgets
    const existsInSidebar = sidebarWidgets.some((widget) => widget.type === widgetType)

    if (existsInSidebar) {
      return { canAdd: false, location: "sidebar" }
    }

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
    {
      id: 1,
      title: "Oxygen Gym Membership",
      expiryDate: "June 30, 2025",
      status: "Expiring Soon",
    },
    {
      id: 2,
      title: "Timathy Fitness Equipment Lease",
      expiryDate: "July 15, 2025",
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
      max: selectedMemberType === "Finance" ? 200000 : 500,
      tickAmount: 5,
      labels: {
        style: { colors: "#999999", fontSize: "12px" },
        formatter: (value) => {
          if (selectedMemberType === "Finance" && value >= 1000) {
            return `$${(value / 1000).toFixed(0)}k`
          }
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
      style: {
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
      },
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        let value = series[seriesIndex][dataPointIndex]
        if (selectedMemberType === "Finance") {
          value = `$${value.toLocaleString()}`
        }
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
    const newWidget = {
      id: `widget${Date.now()}`,
      type: widgetType,
      position: widgets.length,
    }
    setWidgets((currentWidgets) => [...currentWidgets, newWidget])
    setIsWidgetModalOpen(false)
    toast.success(`${widgetType} widget has been added Successfully`)
  }

  const handleAddSidebarWidget = (widgetType) => {
    const newWidget = {
      id: `sidebar-widget${Date.now()}`,
      type: widgetType,
      position: sidebarWidgets.length,
    }
    setSidebarWidgets((currentWidgets) => [...currentWidgets, newWidget])
    setIsRightWidgetModalOpen(false)
    toast.success(`${widgetType} widget has been added to sidebar Successfully`)
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
      <div className="flex flex-col lg:flex-row rounded-3xl bg-[#1C1C1C] text-white min-h-screen">
        <main className="flex-1 min-w-0 p-2 overflow-hidden">
          <div className="p-3 md:p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">My Area</h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsWidgetModalOpen(true)}
                  className="py-2 px-4 bg-black text-white hover:bg-zinc-900 rounded-xl text-sm cursor-pointer flex items-center gap-1"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Add Widget</span>
                </button>
                <button
                  onClick={toggleEditing}
                  className={`p-2 ${isEditing ? "bg-blue-600 text-white" : "text-zinc-400 hover:bg-zinc-800"
                    } rounded-lg flex items-center gap-1`}
                >
                  {isEditing ? <Check size={16} /> : <Edit size={16} />}
                </button>
                <button
                  onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                  className="p-2 text-zinc-400 hover:bg-zinc-800 rounded-lg lg:hidden"
                >
                  <BarChart3 className="rotate-180" />
                </button>
              </div>
            </div>

            {/* Widgets */}
            <div className="space-y-4">
              {/* Chart Widget - Full Width */}
              {widgets
                .filter((widget) => widget.type === "chart")
                .sort((a, b) => a.position - b.position)
                .map((widget, index) => (
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
                      <div className="overflow-x-auto">
                        <div className="min-w-[600px]">
                          <Chart options={chartOptions} series={chartSeries} type="line" height={300} />
                        </div>
                      </div>
                    </div>
                  </DraggableWidget>
                ))}

              {/* Website Links and Expiring Contracts in Same Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Website Links Widget */}
                {widgets
                  .filter((widget) => widget.type === "websiteLink")
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
                      <div className="space-y-3 p-4 rounded-xl bg-[#2F2F2F] h-[350px] flex flex-col">
                        <div className="flex justify-between items-center">
                          <h2 className="text-lg font-semibold">Website Links</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                          <div className="grid grid-cols-1 gap-3">
                            {customLinks.map((link) => (
                              <div key={link.id} className="p-5 bg-black rounded-xl flex items-center justify-between">
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
                    </DraggableWidget>
                  ))}

                {/* Expiring Contracts Widget */}
                {widgets
                  .filter((widget) => widget.type === "expiringContracts")
                  .sort((a, b) => a.position - b.position)
                  .map((widget) => (
                    <DraggableWidget
                      key={widget.id}
                      id={widget.id}
                      index={widgets.findIndex((w) => w.id === widget.id)}
                      moveWidget={removeWidget}
                      removeWidget={removeWidget}
                      isEditing={isEditing}
                      widgets={widgets}
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
                  ))}
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar Component */}
        <Sidebar
          isOpen={isRightSidebarOpen}
          onClose={() => setIsRightSidebarOpen(false)}
          widgets={sidebarWidgets}
          setWidgets={setSidebarWidgets}
          isEditing={isEditing}
          todos={todos}
          customLinks={customLinks}
          setCustomLinks={setCustomLinks}
          expiringContracts={expiringContracts}
          selectedMemberType={selectedMemberType}
          setSelectedMemberType={setSelectedMemberType}
          memberTypes={memberTypes}
          onAddWidget={() => setIsRightWidgetModalOpen(true)}
          updateCustomLink={updateCustomLink}
          removeCustomLink={removeCustomLink}
          editingLink={editingLink}
          setEditingLink={setEditingLink}
          openDropdownIndex={openDropdownIndex}
          setOpenDropdownIndex={setOpenDropdownIndex}
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