/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Chart from "react-apexcharts"
import { MoreVertical, X, ChevronDown, Edit, Check, ArrowDown, ArrowUp, Plus, ExternalLink } from "lucide-react"
import { Eye, Minus } from "react-feather"
import ViewManagementModal from "./sidebar-components/view-management"
import NotesWidget from "./notes-widgets"
import WebsiteLinkModal from "./website-link-modal"
import ConfirmationModal from "./confirmation-modal"
import { toast } from "react-hot-toast"
import AddTaskModal from "./add-task-modal"
import { configuredTagsData } from "../../../utils/user-panel-states/todo-states"
import EditTaskModal from "./edit-task-modal"

const DraggableSidebarWidget = ({
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
      onDragStart={(e) => onDragStart?.(index, e)}
      onDragOver={(e) => onDragOver?.(index, e)}
      onDrop={(e) => onDrop?.(index, e)}
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

const Sidebar = ({
  isOpen,
  onClose,
  widgets,
  setWidgets,
  isEditing,
  todos,
  setTodos,
  customLinks, // Same data from main area - READ ONLY
  setCustomLinks,
  expiringContracts,
  selectedMemberType,
  setSelectedMemberType,
  memberTypes,
  onAddWidget,
  onToggleEditing,

  handleTaskComplete,
  toggleDropdown,
  openDropdownIndex
}) => {
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  const chartDropdownRef = useRef(null)
  const [isChartDropdownOpen, setIsChartDropdownOpen] = useState(false)

  const todoFilterDropdownRef = useRef(null)

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [configuredTags, setConfiguredTags] = useState(configuredTagsData)

  const [todoFilter, setTodoFilter] = useState("all")
  const [isTodoFilterDropdownOpen, setIsTodoFilterDropdownOpen] = useState(false)

  const todoFilterOptions = [
    { value: "all", label: "All Tasks" },
    { value: "ongoing", label: "Ongoing", color: "#f59e0b" },
    { value: "completed", label: "Completed", color: "#10b981" },
    { value: "canceled", label: "Canceled", color: "#ef4444" },
  ]


  const [savedViews, setSavedViews] = useState([])
  const [currentView, setCurrentView] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  const [editingTask, setEditingTask] = useState(null)
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [taskToCancel, setTaskToCancel] = useState(null)

  const handleAddTask = (newTask) => {
    setTodos((prevTodos) => [...prevTodos, newTask]) // Also add to todos if needed
    toast.success("Task added successfully!")
  }

  // Sidebar-specific states for website links operations
  const [sidebarEditingLink, setSidebarEditingLink] = useState(null)
  const [sidebarConfirmationModal, setSidebarConfirmationModal] = useState({ isOpen: false, linkId: null })
  const [sidebarOpenDropdownIndex, setSidebarOpenDropdownIndex] = useState(null)

  const [dragIndex, setDragIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

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


  // Sidebar-specific website links functions

  const addSidebarCustomLink = () => {
    setSidebarEditingLink({})
  }

  const updateSidebarCustomLink = (id, field, value) => {
    console.log("updateSidebarCustomLink called:", { id, field, value }); // DEBUG

    setCustomLinks(currentLinks => {
      console.log("Current links before update:", currentLinks); // DEBUG
      const updatedLinks = currentLinks.map(link =>
        link.id === id ? { ...link, [field]: value } : link
      );
      console.log("Links after update:", updatedLinks); // DEBUG
      return updatedLinks;
    });

    toast.success("Website link updated successfully");
  }
  const removeSidebarCustomLink = (id) => {
    setSidebarConfirmationModal({ isOpen: true, linkId: id })
  }

  const confirmRemoveSidebarLink = () => {
    if (sidebarConfirmationModal.linkId) {
      setCustomLinks(currentLinks =>
        currentLinks.filter(link => link.id !== sidebarConfirmationModal.linkId)
      )
      toast.success("Website link removed successfully")
    }
    setSidebarConfirmationModal({ isOpen: false, linkId: null })
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

  const truncateUrl = (url, maxLength = 40) => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength - 3) + "..."
  }


  // Chart options for sidebar (smaller version)
  const chartOptions = {
    chart: {
      type: "line",
      height: 200,
      toolbar: { show: false },
      background: "transparent",
      fontFamily: "Inter, sans-serif",
    },
    colors: ["#FF6B1A", "#2E5BFF"],
    stroke: { curve: "smooth", width: 3, opacity: 1 },
    markers: {
      size: 1,
      strokeWidth: 0,
      hover: { size: 4 },
    },
    xaxis: {
      categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: { style: { colors: "#999999", fontSize: "10px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: selectedMemberType === "Finance" ? 200000 : 500,
      tickAmount: 4,
      labels: {
        style: { colors: "#999999", fontSize: "10px" },
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
      offsetY: -20,
      offsetX: -10,
      labels: { colors: "#ffffff" },
      itemMargin: { horizontal: 5 },
      fontSize: "10px",
    },
    title: {
      text: memberTypes[selectedMemberType].title,
      align: "left",
      style: { fontSize: "14px", fontWeight: "bold", color: "#ffffff" },
    },
    subtitle: {
      text: `↑ ${memberTypes[selectedMemberType].growth} more in 2024`,
      align: "left",
      style: { fontSize: "10px", color: "#ffffff", fontWeight: "bolder" },
    },
    tooltip: {
      theme: "dark",
      style: {
        fontSize: "10px",
        fontFamily: "Inter, sans-serif",
      },
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        let value = series[seriesIndex][dataPointIndex]
        if (selectedMemberType === "Finance") {
          value = `$${value.toLocaleString()}`
        }
        return (
          '<div class="apexcharts-tooltip-box" style="background: white; color: black; padding: 6px;">' +
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSidebarOpenDropdownIndex(null)
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

  return (
    <>
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
      `}</style>

      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      <aside
        className={`
          fixed inset-y-0 right-0 z-50 w-[85vw] sm:w-96 lg:w-96 bg-[#181818] 
          transform transition-transform duration-500 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          lg:relative lg:translate-x-0
        `}
      >
        <div className="p-4 lg:p-5 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Sidebar</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleEditing}
                className={`p-2 ${isEditing ? "bg-blue-600 text-white" : "text-zinc-400 hover:bg-zinc-800"} rounded-lg flex items-center gap-1`}
                title={isEditing ? "Done (Sidebar)" : "Edit Sidebar"}
              >
                {isEditing ? <Check size={16} /> : <Edit size={16} />}
              </button>
              {!isEditing && (
                <button
                  onClick={() => setIsViewModalOpen(true)}
                  className="p-1.5 sm:p-2 flex items-center text-sm gap-2 bg-gray-600 text-white hover:bg-gray-700 rounded-lg cursor-pointer"
                  title="Manage Sidebar Views"
                >
                  <Eye size={14} />
                  {currentView ? currentView.name : ""}
                </button>
              )}

              <button
                onClick={onAddWidget}
                className="p-2 bg-black text-white hover:bg-zinc-900 rounded-lg text-sm cursor-pointer flex items-center gap-1"
              >
                <Plus size={16} />
              </button>

              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:bg-zinc-700 rounded-xl lg:hidden"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Widgets */}
          <div className="space-y-4">
            {widgets
              .sort((a, b) => a.position - b.position)
              .map((widget, index) => (
                <DraggableSidebarWidget
                  key={widget.id}
                  id={widget.id}
                  index={index}
                  moveWidget={moveWidget}
                  removeWidget={removeWidget}
                  isEditing={isEditing}
                  widgets={widgets}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  isDragging={dragIndex === index}
                  isDragOver={dragOverIndex === index}
                >
                  {/* Chart Widget */}
                  {widget.type === "chart" && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Analytics</h3>
                      <div className="p-3 bg-[#2F2F2F] rounded-xl">
                        <div className="flex items-center justify-between mb-3" />
                        <div className="relative mb-3" ref={chartDropdownRef}>
                          <button
                            onClick={() => setIsChartDropdownOpen(!isChartDropdownOpen)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-black rounded-xl text-white text-xs"
                          >
                            {selectedMemberType}
                            <ChevronDown className="w-3 h-3" />
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
                          <Chart options={chartOptions} series={chartSeries} type="line" height={200} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TODO Widget */}
                  {widget.type === "todo" && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg md:text-xl open_sans_font_700 cursor-pointer">To-Do</h2>

                        <button
                          onClick={() => setIsAddTaskModalOpen(true)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                          <Plus size={18} />
                        </button>
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
                                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-white hover:bg-black first:rounded-t-xl last:rounded-b-xl"
                                onClick={() => {
                                  setTodoFilter(option.value)
                                  setIsTodoFilterDropdownOpen(false)
                                }}
                              >
                                {option.color && (
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: option.color }} />
                                )}
                                {option.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Todo Items */}
                      <div className="space-y-3 open_sans_font">
                        {getFilteredTodos().length > 0 ? (
                          <>
                            {getFilteredTodos()
                              .slice(0, 3)
                              .map((todo) => (
                                <div
                                  key={todo.id}
                                  className="p-2 bg-black rounded-xl flex items-center justify-between"
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
                                          }}
                                          className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-600 rounded-t-lg"
                                        >
                                          Edit Task
                                        </button>
                                        <button
                                          onClick={() => {
                                            setTaskToCancel(todo.id)
                                          }}
                                          className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-600"
                                        >
                                          Cancel Task
                                        </button>
                                        <button
                                          onClick={() => {
                                            setTaskToDelete(todo.id)
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
                          </>
                        ) : (
                          <div className="text-center py-4 text-gray-400">
                            <p className="text-sm">No tasks in this category</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Website Links Widget */}
                  {widget.type === "websiteLink" && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg md:text-xl open_sans_font_700 cursor-pointer">Website Links</h2>
                        <button
                          onClick={addSidebarCustomLink}
                          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition-colors"
                        >
                          <Plus size={18} />
                        </button>
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
                                    setSidebarOpenDropdownIndex(
                                      sidebarOpenDropdownIndex === `link-${link.id}` ? null : `link-${link.id}`,
                                    )
                                  }}
                                  className="p-2 hover:bg-zinc-700 rounded-lg"
                                >
                                  <MoreVertical size={16} />
                                </button>
                                {sidebarOpenDropdownIndex === `link-${link.id}` && (
                                  <div className="absolute right-0 top-full mt-1 w-32 bg-zinc-800 rounded-lg shadow-lg z-50 py-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setSidebarEditingLink(link)
                                        setSidebarOpenDropdownIndex(null)
                                      }}
                                      className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-700"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        removeSidebarCustomLink(link.id)
                                        setSidebarOpenDropdownIndex(null)
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
                  )}

                  {/* Expiring Contracts Widget */}
                  {widget.type === "expiringContracts" && (
                    <div>
                      <div className="flex justify-between mb-3 items-center">
                        <h3 className="text-lg font-semibold">Expiring Contracts</h3>
                      </div>

                      <div className="space-y-3 p-3 rounded-xl bg-[#2F2F2F]">
                        <div className="max-h-64 overflow-y-auto custom-scrollbar pr-1">
                          <div className="space-y-2">
                            {expiringContracts.map((contract) => (
                              <Link to={"/admin-dashboard/contract"} key={contract.id}>
                                <div className="p-3 bg-black rounded-xl m-2 hover:bg-zinc-900 transition-colors">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-sm font-medium truncate">{contract.title}</h4>
                                      <p className="text-xs mt-1 text-zinc-400">Expires: {contract.expiryDate}</p>
                                    </div>
                                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400 flex-shrink-0 ml-2">
                                      {contract.status}
                                    </span>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {widget.type === "notes" && <NotesWidget />}
                </DraggableSidebarWidget>
              ))}

            {widgets.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-zinc-400">
                <p className="mb-4">No widgets added to sidebar</p>
                <button
                  onClick={onAddWidget}
                  className="py-2 px-4 bg-black text-white hover:bg-zinc-900 rounded-xl text-sm cursor-pointer flex items-center gap-1"
                >
                  <Plus size={16} />
                  <span>Add Widget</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Sidebar-specific Modals */}
      {sidebarEditingLink && (
        <WebsiteLinkModal
          link={sidebarEditingLink}
          onClose={() => setSidebarEditingLink(null)}
          updateCustomLink={updateSidebarCustomLink} // Make sure it's this function
          setCustomLinks={setCustomLinks}
        />
      )}



      {sidebarConfirmationModal.isOpen && (
        <ConfirmationModal
          isOpen={sidebarConfirmationModal.isOpen}
          onClose={() => setSidebarConfirmationModal({ isOpen: false, linkId: null })}
          onConfirm={confirmRemoveSidebarLink}
          title="Delete Website Link"
          message="Are you sure you want to delete this website link? This action cannot be undone."
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

      {isAddTaskModalOpen && (
        <AddTaskModal
          onClose={() => setIsAddTaskModalOpen(false)}
          onAddTask={handleAddTask}
          configuredTags={configuredTags}
        />
      )}
      {isEditTaskModalOpen && editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => {
            setIsEditTaskModalOpen(false)
            setEditingTask(null)
          }}
          onUpdateTask={handleUpdateTask}
          configuredTags={configuredTags}
        />
      )}




      <ViewManagementModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        savedViews={savedViews}
        setSavedViews={setSavedViews}
        currentView={currentView}
        setCurrentView={setCurrentView}
        sidebarWidgets={widgets}
        setSidebarWidgets={setWidgets}
      />
    </>
  )
}

export default Sidebar