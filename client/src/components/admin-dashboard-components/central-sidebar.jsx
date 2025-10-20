/* eslint-disable no-empty */
// central sidebar for admin dashbaord
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Chart from "react-apexcharts"
import {
    MoreVertical,
    X,
    ChevronDown,
    Plus,
    ExternalLink,
} from "lucide-react"
import ViewManagementModal from "./myarea-components/sidebar-components/view-management"
import EditTaskModal from "./todo-components/edit-task-modal"
import { Check, Edit, Eye, Minus } from "react-feather"
import NotesWidget from "./myarea-components/notes-widgets"

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
            className={`relative mb-4 w-full transition-all duration-200 ${
                isEditing ? "animate-wobble cursor-move" : ""
            } ${isDragging ? "dragging opacity-50" : ""} ${
                isDragOver ? "drag-over border-2 border-dashed border-orange-500" : ""
            }`}
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

const Sidebar = ({
    isOpen,
    onClose,
    widgets,
    setWidgets,
    isEditing,
    todos,
    setTodos,
    customLinks,
    setCustomLinks,
    expiringContracts,
    selectedMemberType,
    setSelectedMemberType,
    memberTypes,
    onAddWidget,
    updateCustomLink,
    removeCustomLink,
    editingLink,
    setEditingLink,
    openDropdownIndex,
    setOpenDropdownIndex,
    onToggleEditing,
}) => {
    const navigate = useNavigate()
    const dropdownRef = useRef(null)
    const chartDropdownRef = useRef(null)
    const [isChartDropdownOpen, setIsChartDropdownOpen] = useState(false)

    const [savedViews, setSavedViews] = useState([])
    const [currentView, setCurrentView] = useState(null)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)

    const [editingTask, setEditingTask] = useState(null)
    const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false)
    const [taskToDelete, setTaskToDelete] = useState(null)
    const [taskToCancel, setTaskToCancel] = useState(null)

    const [dragIndex, setDragIndex] = useState(null)
    const [dragOverIndex, setDragOverIndex] = useState(null)

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

    const toggleDropdown = (index) => setOpenDropdownIndex(openDropdownIndex === index ? null : index)
    const redirectToTodos = () => navigate("/admin-dashboard/to-do")

    const addCustomLink = () => {
        setEditingLink({})
    }

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
    }, [setOpenDropdownIndex])

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
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
            )}

            <aside
                className={`
            fixed top-0 right-0 h-full text-white w-full sm:w-96 lg:w-88 bg-[#181818] border-l border-gray-700 z-50
            transform transition-transform duration-500 ease-in-out
            ${isOpen ? "translate-x-0" : "translate-x-full"}
          `}
            >
                <div className="p-4 lg:p-5 h-full overflow-y-auto">
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
                                                <div className="flex items-center justify-between mb-3">
                                                </div>
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
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold">To-Do</h3>
                                            </div>
                                            <div className="space-y-3">
                                                {todos.map((todo) => (
                                                    <div
                                                        onClick={redirectToTodos}
                                                        key={todo.id}
                                                        className="p-2 cursor-pointer bg-black rounded-xl"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-semibold text-sm truncate">{todo.title}</h4>
                                                                <p className="text-xs text-zinc-400 truncate">{todo.description}</p>
                                                                <span className="text-xs text-zinc-400">
                                                                    {todo.dueDate} {todo.dueTime}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button className="px-2 py-1 bg-blue-600 text-white rounded-lg text-xs flex-shrink-0 ml-2">
                                                                    To-Do
                                                                </button>

                                                                {/* Wrap dropdown in a div that stops propagation */}
                                                                <div onClick={(e) => e.stopPropagation()}>
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
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <Link
                                                    to={"/admin-dashboard/to-do"}
                                                    className="text-sm text-white flex justify-center items-center text-center hover:underline"
                                                >
                                                    See all
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                    {/* Website Links Widget */}
                                    {widget.type === "websiteLink" && (
                                        <div>
                                            <div className="flex mb-3 justify-between items-center">
                                                <h3 className="text-lg font-semibold">Website Links</h3>
                                            </div>
                                            <div className="space-y-3 p-3 rounded-xl bg-[#2F2F2F]">

                                                <div className="max-h-64 overflow-y-auto custom-scrollbar pr-1">
                                                    <div className="space-y-2">
                                                        {customLinks.map((link) => (
                                                            <div key={link.id} className="p-3 bg-black rounded-xl">
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className="text-sm font-medium truncate">{link.title}</h4>
                                                                        <p className="text-xs mt-1 text-zinc-400 truncate">{link.url}</p>
                                                                    </div>
                                                                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                                                                        <button
                                                                            onClick={() => window.open(link.url, "_blank")}
                                                                            className="p-1.5 hover:bg-zinc-700 rounded-lg"
                                                                        >
                                                                            <ExternalLink size={14} />
                                                                        </button>
                                                                        <div className="relative">
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    toggleDropdown(`sidebar-link-${link.id}`)
                                                                                }}
                                                                                className="p-1.5 hover:bg-zinc-700 rounded-lg"
                                                                            >
                                                                                <MoreVertical size={14} />
                                                                            </button>
                                                                            {openDropdownIndex === `sidebar-link-${link.id}` && (
                                                                                <div className="absolute right-0 top-full mt-1 w-24 bg-zinc-800 rounded-lg shadow-lg z-50 py-1">
                                                                                    <button
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation()
                                                                                            setEditingLink(link)
                                                                                            setOpenDropdownIndex(null)
                                                                                        }}
                                                                                        className="w-full text-left px-2 py-1.5 text-xs hover:bg-zinc-700"
                                                                                    >
                                                                                        Edit
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation()
                                                                                            removeCustomLink(link.id)
                                                                                            setOpenDropdownIndex(null)
                                                                                        }}
                                                                                        className="w-full text-left px-2 py-1.5 text-xs hover:bg-zinc-700 text-red-400"
                                                                                    >
                                                                                        Remove
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={addCustomLink}
                                                    className="w-full p-3 bg-black rounded-xl text-sm text-zinc-400 text-left hover:bg-zinc-900"
                                                >
                                                    Add website link...
                                                </button>
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
                sidebarWidgets={widgets}
                setSidebarWidgets={setWidgets}
            />
        </>
    )
}

export default Sidebar