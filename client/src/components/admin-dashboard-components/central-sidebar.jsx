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
    ArrowDown,
    ArrowUp,
    Plus,
    ExternalLink,
} from "lucide-react"

const DraggableSidebarWidget = ({ id, children, index, moveWidget, removeWidget, isEditing, widgets }) => {
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

const Sidebar = ({
    isOpen,
    onClose,
    widgets,
    setWidgets,
    isEditing,
    todos,
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
}) => {
    const navigate = useNavigate()
    const dropdownRef = useRef(null)
    const chartDropdownRef = useRef(null)
    const [isChartDropdownOpen, setIsChartDropdownOpen] = useState(false)

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

    return (
        <>
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
                                onClick={onAddWidget}
                                className="p-2 bg-black text-white hover:bg-zinc-900 rounded-lg text-sm cursor-pointer flex items-center gap-1"
                            >
                                <Plus size={16} />
                                <span className="hidden lg:inline">Add Widget</span>
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
                                                            <button className="px-2 py-1 bg-blue-600 text-white rounded-lg text-xs flex-shrink-0 ml-2">
                                                                To-Do
                                                            </button>
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
        </>
    )
}

export default Sidebar