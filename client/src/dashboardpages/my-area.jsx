/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import Chart from "react-apexcharts"
import { BarChart3, MoreVertical, X, Clock, ChevronDown, Edit, Check, ArrowDown, ArrowUp, Plus } from "lucide-react"
import Rectangle1 from "../../public/Rectangle 1.png"
import Image10 from "../../public/image10.png"
import Avatar from "../../public/avatar.png"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { TouchBackend } from "react-dnd-touch-backend"
import { WidgetSelectionModal } from "../components/widget-selection-modal"
function EmployeeCheckInWidget() {
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState(null)

  const handleCheckInOut = () => {
    if (isCheckedIn) {
      setIsCheckedIn(false)
      setCheckInTime(null)
    } else {
      setIsCheckedIn(true)
      setCheckInTime(new Date())
    }
  }

  return (
    <div className="p-4 bg-[#000000] rounded-xl">
      <h2 className="text-lg font-semibold mb-3">Employee Check-In</h2>
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-sm mb-1">Status: {isCheckedIn ? "Checked In" : "Checked Out"}</p>
          {checkInTime && (
            <p className="text-xs text-zinc-400 flex items-center gap-1">
              <Clock size={14} />
              {checkInTime.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={handleCheckInOut}
          className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
            isCheckedIn ? "bg-red-600" : "bg-yellow-400 text-black"
          }`}
        >
          {isCheckedIn ? "Check Out" : "Check In"}
        </button>
      </div>
    </div>
  )
}

const DraggableWidget = ({ id, children, index, moveWidget, removeWidget, isEditing }) => {
  const ref = useRef(null)
  const [, drop] = useDrop({
    accept: "WIDGET",
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) {
        return
      }
      moveWidget(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: "WIDGET",
    item: () => {
      return { id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} className="relative">
      {isEditing && (
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          <button onClick={() => moveWidget(index, index - 1)} className="p-2 bg-gray-800 rounded hover:bg-gray-700">
            <ArrowUp size={12} />
          </button>
          <button onClick={() => moveWidget(index, index + 1)} className="p-2 bg-gray-800 rounded hover:bg-gray-700">
            <ArrowDown size={12} />
          </button>
          <button onClick={() => removeWidget(id)} className="p-2 bg-gray-800 rounded hover:bg-gray-700">
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
  const [selectedMemberType, setSelectedMemberType] = useState("All members")
  const [isChartDropdownOpen, setIsChartDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const chartDropdownRef = useRef(null)
  const navigate = useNavigate()
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false)

  const [isEditing, setIsEditing] = useState(false)
  const [widgets, setWidgets] = useState([
    { id: "chart", type: "chart", position: 0 },
    { id: "appointments", type: "appointments", position: 1 },
    { id: "employeeCheckIn", type: "employeeCheckIn", position: 2 },
  ])
  const [customLinks, setCustomLinks] = useState([{ id: "link1", url: "www.grocery.com", title: "Grocery Store" }])
  const [sidebarSections, setSidebarSections] = useState([
    { id: "communications", title: "Communications" },
    { id: "todo", title: "TO-DO" },
    { id: "birthday", title: "Upcoming Birthday" },
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
  }

  const [appointments, setAppointments] = useState([
    {
      name: "Yolanda",
      time: "10:00",
      date: "Mon | 02-01-2025",
      color: "bg-[#3F74FF]",
      isCheckedIn: false,
    },
    {
      name: "Alexandra",
      time: "12:00",
      date: "Mon | 02-01-2025",
      color: "bg-[#CE4B55]",
      isCheckedIn: false,
    },
  ])

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const toggleRightSidebar = () => setIsRightSidebarOpen(!isRightSidebarOpen)
  const redirectToTodos = () => navigate("/dashboard/to-do")
  const redirectToCommunication = () => navigate("/dashboard/communication")
  const toggleDropdown = (index) => setOpenDropdownIndex(openDropdownIndex === index ? null : index)
  const toggleEditing = () => setIsEditing(!isEditing)

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
    setCustomLinks((currentLinks) => currentLinks.filter((link) => link.id !== id))
  }

  const handleCheckIn = (index) => {
    setAppointments((prevAppointments) => {
      const updatedAppointments = [...prevAppointments]
      updatedAppointments[index] = {
        ...updatedAppointments[index],
        isCheckedIn: true,
      }
      // Simulate backend process: automatically revert to "Check In" after 3 seconds
      setTimeout(() => {
        setAppointments((prevAppointments) => {
          const revertedAppointments = [...prevAppointments]
          revertedAppointments[index] = {
            ...revertedAppointments[index],
            isCheckedIn: false,
          }
          return revertedAppointments
        })
      }, 3000)
      return updatedAppointments
    })
  }

  const moveSidebarSection = (id, direction) => {
    setSidebarSections((currentSections) => {
      const index = currentSections.findIndex((section) => section.id === id)
      if ((direction === "up" && index === 0) || (direction === "down" && index === currentSections.length - 1)) {
        return currentSections
      }
      const newSections = [...currentSections]
      const swap = direction === "up" ? index - 1 : index + 1
      ;[newSections[index], newSections[swap]] = [newSections[swap], newSections[index]]
      return newSections
    })
  }

  const removeSidebarSection = (id) => {
    setSidebarSections((currentSections) => currentSections.filter((section) => section.id !== id))
  }

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
      height: 300,
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
      max: 500,
      tickAmount: 5,
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
      offsetY: -60,
      offsetX: -200,
      labels: { colors: "#ffffff" },
      itemMargin: { horizontal: 10 },
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
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        return '<div class="apexcharts-tooltip-box" style="background: white; color: black; padding: 8px;">' +
          '<span style="color: black;">' + 
          series[seriesIndex][dataPointIndex] +
          '</span></div>';
      }
    },
  }

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
        // Editing existing link
        updateCustomLink(link.id, "title", title)
        updateCustomLink(link.id, "url", url)
      } else {
        // Adding new link
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

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const DndBackend = isMobile ? TouchBackend : HTML5Backend

  const handleAddWidget = (widgetType) => {
    // Define which widgets belong in the main area vs sidebar
    const mainAreaWidgets = ['chart', 'appointments', 'employeeCheckIn', 'websiteLink'];
    const sidebarWidgets = ['communication', 'todo', 'birthdays'];
  
    if (mainAreaWidgets.includes(widgetType)) {
      // Handle main area widgets
      const widgetOrder = {
        chart: 0,
        appointments: 1,
        employeeCheckIn: 2,
        websiteLink: 3
      };
  
      const newWidget = {
        id: `widget${Date.now()}`,
        type: widgetType,
        position: widgetOrder[widgetType]
      };
  
      setWidgets(currentWidgets => {
        const updatedWidgets = [...currentWidgets, newWidget];
        return updatedWidgets
          .sort((a, b) => {
            const posA = widgetOrder[a.type] ?? Number.MAX_VALUE;
            const posB = widgetOrder[b.type] ?? Number.MAX_VALUE;
            return posA - posB;
          })
          .map((widget, index) => ({
            ...widget,
            position: index
          }));
      });
    } else if (sidebarWidgets.includes(widgetType)) {
      // Handle sidebar widgets
      const sidebarOrder = {
        communication: 0,
        todo: 1,
        birthdays: 2
      };
  
      setSidebarSections(currentSections => {
        // Check if section already exists
        const sectionExists = currentSections.some(section => section.id === widgetType);
        if (sectionExists) {
          return currentSections;
        }
  
        const newSection = {
          id: widgetType,
          title: widgetType === 'todo' ? 'TO-DO' : 
                 widgetType === 'birthdays' ? 'Upcoming Birthday' : 
                 'Communications'
        };
  
        const updatedSections = [...currentSections, newSection];
        return updatedSections
          .sort((a, b) => {
            const posA = sidebarOrder[a.id] ?? Number.MAX_VALUE;
            const posB = sidebarOrder[b.id] ?? Number.MAX_VALUE;
            return posA - posB;
          });
      });
    }
  
    // Close the widget selection modal
    setIsWidgetModalOpen(false);
  };

  const canAddWidget = (widgetType) => {
    const mainAreaWidgets = ['chart', 'appointments', 'employeeCheckIn', 'websiteLink'];
    const sidebarWidgets = ['communication', 'todo', 'birthdays'];
  
    if (mainAreaWidgets.includes(widgetType)) {
      return !widgets.some(widget => widget.type === widgetType);
    } else if (sidebarWidgets.includes(widgetType)) {
      return !sidebarSections.some(section => section.id === widgetType);
    }
    return false;
  };

  return (
    <DndProvider backend={DndBackend}>
      <div className="flex flex-col md:flex-row rounded-3xl bg-[#1C1C1C] text-white min-h-screen">
        {isRightSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={toggleRightSidebar} />
        )}

        <main className="flex-1 min-w-0 overflow-hidden">
          <div className="p-3 md:p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="p-2 text-zinc-400 hover:bg-zinc-800 rounded-lg md:hidden">
                  <BarChart3 />
                </button>
                <h1 className="text-xl font-bold">My Area</h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsWidgetModalOpen(true)}
                  className="py-2 px-6 bg-black text-white hover:bg-zinc-900 rounded-xl text-sm cursor-pointer flex items-center gap-1"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Add Widget</span>
                </button>
                <button
                  onClick={toggleEditing}
                  className={`p-2 ${
                    isEditing ? "bg-blue-600 text-white" : "text-zinc-400 hover:bg-zinc-800"
                  } rounded-lg flex items-center gap-1`}
                >
                  {isEditing ? <Check size={16} /> : <Edit size={16} />}
                  {/* <span className="hidden sm:inline">{isEditing ? "Done" : "Edit"}</span> */}
                </button>
              </div>
            </div>

            {/* Widgets */}
            <div className="space-y-4">
              {widgets
                .sort((a, b) => a.position - b.position)
                .map((widget, index) => (
                  <DraggableWidget
                    key={widget.id}
                    id={widget.id}
                    index={index}
                    moveWidget={moveWidget}
                    removeWidget={removeWidget}
                    isEditing={isEditing}
                  >
                    {/* Chart Widget */}
                    {widget.type === "chart" && (
                      <div className="p-4 bg-[#2F2F2F] rounded-xl">
                        <div className="relative mb-4" ref={chartDropdownRef}>
                          <button
                            onClick={() => setIsChartDropdownOpen(!isChartDropdownOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-black rounded-xl text-white text-sm"
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
                          <Chart options={chartOptions} series={chartSeries} type="line" height={350} />
                        </div>
                      </div>
                    )}

                    {/* Appointments Widget */}
                    {widget.type === "appointments" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
                          <Link to="/dashboard/appointments" className="text-sm text-white hover:underline">
                            See all
                          </Link>
                        </div>
                        <div className="space-y-3">
                          {appointments.map((appointment, index) => (
                            <div key={index} className={`${appointment.color} p-4 rounded-xl`}>
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full flex-shrink-0">
                                    <img
                                      src={Avatar || "/placeholder.svg"}
                                      alt=""
                                      className="w-full h-full object-cover rounded-full"
                                    />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-sm text-white">{appointment.name}</h3>
                                    <p className="text-xs flex items-center gap-1 text-white/70 mt-1">
                                      <Clock size={12} />
                                      {appointment.time} | {appointment.date}
                                    </p>
                                    <p className="text-sm text-white mt-1">
                                      {appointment.description || "Strength Training"}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                                  <button
                                    onClick={() => handleCheckIn(index)}
                                    className={`w-full sm:w-auto px-4 py-2 text-xs font-medium rounded-xl ${
                                      appointment.isCheckedIn ? "bg-green-600" : "bg-black"
                                    }`}
                                  >
                                    {appointment.isCheckedIn ? "Checked In" : "Check In"}
                                  </button>

                                  <div className="relative" ref={dropdownRef}>
                                    <button
                                      className="p-2 hover:bg-white/10 rounded-xl"
                                      onClick={() => toggleDropdown(index)}
                                    >
                                      <MoreVertical size={16} />
                                    </button>
                                    {openDropdownIndex === index && (
                                      <div className="absolute top-5 right-4 w-32 bg-[#2F2F2F]/90 backdrop-blur-sm rounded-xl shadow-lg z-10">
                                        <ul className="py-1">
                                          <li>
                                            <button
                                              className="block w-full text-left px-4 py-2 text-sm hover:bg-white/10"
                                              onClick={() => {
                                                console.log("Cancel appointment")
                                                setOpenDropdownIndex(null)
                                              }}
                                            >
                                              Cancel
                                            </button>
                                          </li>
                                          <li className="border-t border-white/10">
                                            <button
                                              className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-white/10"
                                              onClick={() => {
                                                console.log("Remove appointment")
                                                setOpenDropdownIndex(null)
                                              }}
                                            >
                                              Remove
                                            </button>
                                          </li>
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* EmployeeCheckIn Widget */}
                    {widget.type === "employeeCheckIn" && <EmployeeCheckInWidget />}

                    {widget.type === "communication" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h2 className="text-lg font-semibold">Communications</h2>
                          <Link to="/dashboard/communication" className="text-sm text-white hover:underline">
                            See all
                          </Link>
                        </div>
                        <div className="space-y-3">
                          {communications.map((comm) => (
                            <div
                              key={comm.id}
                              onClick={redirectToCommunication}
                              className="p-4 bg-black rounded-xl cursor-pointer"
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <img
                                  src={comm.avatar || "/placeholder.svg"}
                                  alt=""
                                  className="rounded-full h-10 w-10"
                                />
                                <div>
                                  <h3 className="font-semibold text-sm">{comm.name}</h3>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-zinc-400">{comm.message}</p>
                                <p className="text-xs mt-2 flex gap-1 items-center text-zinc-400">
                                  <Clock size={12} />
                                  {comm.time}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {widget.type === "todo" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h2 className="text-lg font-semibold">TO-DO</h2>
                          <Link to="/dashboard/to-do" className="text-sm text-white hover:underline">
                            See all
                          </Link>
                        </div>
                        <div className="space-y-3">
                          {todos.map((todo) => (
                            <div
                              key={todo.id}
                              onClick={redirectToTodos}
                              className="p-4 bg-black rounded-xl flex items-center justify-between cursor-pointer"
                            >
                              <div>
                                <h3 className="font-semibold text-sm">{todo.title}</h3>
                                <p className="text-xs text-zinc-400">{todo.description}</p>
                              </div>
                              <button className="px-4 py-1.5 flex items-center gap-2 bg-blue-600 text-white rounded-xl text-xs">
                                <img src={Image10 || "/placeholder.svg"} alt="" className="w-4 h-4" />
                                {todo.assignee}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {widget.type === "birthdays" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h2 className="text-lg font-semibold">Upcoming Birthdays</h2>
                        </div>
                        <div className="space-y-3">
                          {birthdays.map((birthday) => (
                            <div key={birthday.id} className="p-4 bg-black rounded-xl flex items-center gap-3">
                              <img
                                src={birthday.avatar || "/placeholder.svg"}
                                alt=""
                                className="h-10 w-10 rounded-full"
                              />
                              <div>
                                <h3 className="font-semibold text-sm">{birthday.name}</h3>
                                <p className="text-xs text-zinc-400">{birthday.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {widget.type === "websiteLink" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h2 className="text-lg font-semibold">Website Links</h2>
                        </div>
                        <div className="space-y-3">
                          {customLinks.map((link) => (
                            <div key={link.id} className="p-4 bg-black rounded-xl">
                              <h3 className="text-sm font-medium">{link.title}</h3>
                              <p className="text-xs mt-1 text-zinc-400">{link.url}</p>
                            </div>
                          ))}
                          <button
                            onClick={addCustomLink}
                            className="w-full p-3 bg-black rounded-xl text-sm text-zinc-400 text-left hover:bg-zinc-900"
                          >
                            Add website link...
                          </button>
                        </div>
                      </div>
                    )}
                  </DraggableWidget>
                ))}
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside
          className={`
            fixed inset-y-0 right-0 z-50 w-[85vw] sm:w-80 lg:w-80 bg-[#181818] 
            transform transition-transform duration-500 ease-in-out
            ${isRightSidebarOpen ? "translate-x-0" : "translate-x-full"}
            md:relative md:translate-x-0
          `}
        >
          <div className="p-4 md:p-6 h-full overflow-y-auto">
            {/* Close button for mobile */}
            <button
              onClick={toggleRightSidebar}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:bg-zinc-700 rounded-xl md:hidden"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>

            {sidebarSections.map((section, index) => (
              <div key={section.id} className="mb-8 mt-10 md:mt-0 relative">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg md:text-xl open_sans_font_700 cursor-pointer">{section.title}</h2>
                  {isEditing && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => moveSidebarSection(section.id, "up")}
                        className="p-1 bg-zinc-700 rounded-md hover:bg-zinc-600"
                        disabled={index === 0}
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        onClick={() => moveSidebarSection(section.id, "down")}
                        className="p-1 bg-zinc-700 rounded-md hover:bg-zinc-600"
                        disabled={index === sidebarSections.length - 1}
                      >
                        <ArrowDown size={16} />
                      </button>
                      <button
                        onClick={() => removeSidebarSection(section.id)}
                        className="p-1 bg-zinc-700 rounded-md hover:bg-zinc-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {section.id === "communications" && (
                  <div className="space-y-4">
                    <div className="space-y-4">
                      {[1, 2].map((message) => (
                        <div
                          onClick={redirectToCommunication}
                          key={message}
                          className="p-3 md:p-4 cursor-pointer bg-black rounded-xl"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <img
                              src={Rectangle1 || "/placeholder.svg"}
                              alt="User"
                              className="rounded-full h-10 w-10 md:h-12 md:w-12"
                            />
                            <div>
                              <h3 className="open_sans_font text-sm md:text-base">Jennifer Markus</h3>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs md:text-sm open_sans_font text-zinc-400">
                              Hey! Did you think the NFT marketplace for Alice app design?
                            </p>
                            <p className="text-xs mt-2 flex gap-1 items-center open_sans_font text-zinc-400">
                              <Clock size={15} />
                              Today | 05:30 PM
                            </p>
                          </div>
                        </div>
                      ))}
                      <Link
                        to={"/dashboard/communication"}
                        className="text-sm md:text-md open_sans_font text-white flex justify-center items-center text-center hover:underline"
                      >
                        See all
                      </Link>
                    </div>
                  </div>
                )}

                {section.id === "todo" && (
                  <div className="space-y-4 open_sans_font">
                    {[1, 2, 3].map((task) => (
                      <div
                        onClick={redirectToTodos}
                        key={task}
                        className="p-3 md:p-4 cursor-pointer bg-black rounded-xl flex items-center justify-between"
                      >
                        <div>
                          <h3 className="font-semibold open_sans_font text-sm md:text-base">Task</h3>
                          <p className="text-xs open_sans_font md:text-sm text-zinc-400">Description</p>
                        </div>
                        <button className="px-4 md:px-6 py-1.5 flex justify-center items-center gap-2 bg-blue-600 text-white rounded-xl text-xs md:text-sm">
                          <img src={Image10 || "/placeholder.svg"} alt="" className="w-4 h-4" />
                          Jack
                        </button>
                      </div>
                    ))}

                    <Link
                      to={"/dashboard/to-do"}
                      className="text-sm md:text-md open_sans_font text-white flex justify-center items-center text-center hover:underline"
                    >
                      See all
                    </Link>
                  </div>
                )}

                {section.id === "birthday" && (
                  <>
                    <div className="space-y-4 open_sans_font">
                      {[1, 2, 3].map((task) => (
                        <div
                          key={task}
                          className="p-3 md:p-4 cursor-pointer bg-black rounded-xl flex items-center gap-3"
                        >
                          <div>
                            <img src={Avatar || "/placeholder.svg"} className="h-10 w-10" alt="" />
                          </div>
                          <div>
                            <h3 className="font-semibold open_sans_font text-md">Yolando</h3>
                            <p className="text-xs open_sans_font text-zinc-400">Mon | 02 01 2025</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Website Links */}
                    <div className="mt-8">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-lg open_sans_font md:text-xl open_sans_font_700 cursor-pointer mb-2">
                            Website Links
                          </h2>
                        </div>
                        {customLinks.map((link, index) => (
                          <div key={link.id} className="p-4 bg-black rounded-xl relative">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h3 className="text-md font-medium">{link.title}</h3>
                                <p className="text-xs mt-1 text-zinc-400">{link.url}</p>
                              </div>
                              <div className="relative">
                                <button
                                  onClick={() => toggleDropdown(link.id)}
                                  className="p-2 hover:bg-zinc-800 rounded-lg"
                                >
                                  <MoreVertical size={16} />
                                </button>
                                {openDropdownIndex === link.id && (
                                  <div className="absolute top-5 right-4 w-36 bg-[#2F2F2F] rounded-xl shadow-lg z-10">
                                    <div className="py-1">
                                      <button
                                        onClick={() => {
                                          setOpenDropdownIndex(null)
                                          setEditingLink(link)
                                        }}
                                        className="w-full px-4 py-2 text-sm text-left hover:bg-zinc-700"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => {
                                          removeCustomLink(link.id)
                                          setOpenDropdownIndex(null)
                                        }}
                                        className="w-full px-4 py-2 text-sm text-left text-red-500 hover:bg-zinc-700"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            {isEditing && (
                              <div className="absolute top-2 right-2 z-10 flex gap-2">
                                <button
                                  onClick={() => moveCustomLink(link.id, "up")}
                                  className="p-1 bg-gray-800 rounded hover:bg-gray-700"
                                  disabled={index === 0}
                                >
                                  <ArrowUp size={12} />
                                </button>
                                <button
                                  onClick={() => moveCustomLink(link.id, "down")}
                                  className="p-1 bg-gray-800 rounded hover:bg-gray-700"
                                  disabled={index === customLinks.length - 1}
                                >
                                  <ArrowDown size={12} />
                                </button>
                                <button
                                  onClick={() => removeCustomLink(link.id)}
                                  className="p-1 bg-gray-800 rounded hover:bg-gray-700"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={addCustomLink}
                          className="w-full p-3 bg-black rounded-xl text-sm text-zinc-400 text-left hover:bg-zinc-900"
                        >
                          Add website link...
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </aside>
        {editingLink && <WebsiteLinkModal link={editingLink} onClose={() => setEditingLink(null)} />}
        <WidgetSelectionModal
          isOpen={isWidgetModalOpen}
          onClose={() => setIsWidgetModalOpen(false)}
          onSelectWidget={handleAddWidget}
        />
      </div>
    </DndProvider>
  )
}

