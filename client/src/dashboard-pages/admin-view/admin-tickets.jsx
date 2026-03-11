/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react"
import {
    Search,
    MessageSquare,
    AlertCircle,
    XCircle,
    Filter,
    ChevronDown,
    RefreshCw,
    ArrowUp,
    ArrowDown,
} from "lucide-react"
import toast from "react-hot-toast"

import AdminTicketView from "../../components/admin-dashboard-components/tickets-component/admin-ticket-view-modal"
import { adminTickets } from "../../utils/admin-panel-states/tickets-states"

const AdminTicketsSystem = () => {
    const [tickets, setTickets] = useState(adminTickets)
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")

    // Filter states
    const [statusFilter, setStatusFilter] = useState("all")
    const [priorityFilter, setPriorityFilter] = useState("all")

    // Sort states
    const [sortBy, setSortBy] = useState("date")
    const [sortDirection, setSortDirection] = useState("desc")
    const [showSortDropdown, setShowSortDropdown] = useState(false)
    const sortDropdownRef = useRef(null)

    // Filter collapse state
    const [filtersExpanded, setFiltersExpanded] = useState(false)

    // Expand filters on desktop, keep collapsed on mobile
    useEffect(() => {
        const isDesktop = window.innerWidth >= 768
        setFiltersExpanded(isDesktop)
    }, [])

    const sortOptions = [
        { value: "date", label: "Date" },
        { value: "subject", label: "Subject" },
        { value: "status", label: "Status" },
        { value: "priority", label: "Priority" },
    ]

    // Close sort dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setShowSortDropdown(false)
            }
        }
        document.addEventListener("click", handleClickOutside)
        return () => document.removeEventListener("click", handleClickOutside)
    }, [])

    // ── Filtering ──────────────────────────────────────────────
    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch =
            ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (ticket.studioName && ticket.studioName.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesStatus =
            statusFilter === "all" || ticket.status === statusFilter

        const matchesPriority =
            priorityFilter === "all" || ticket.priority === priorityFilter

        return matchesSearch && matchesStatus && matchesPriority
    })

    // ── Sorting ────────────────────────────────────────────────
    const priorityOrder = { High: 0, Medium: 1, Low: 2 }
    const statusOrder = { Open: 0, "Awaiting your reply": 1, Closed: 2 }

    const sortedTickets = [...filteredTickets].sort((a, b) => {
        let comparison = 0

        switch (sortBy) {
            case "subject":
                comparison = a.subject.localeCompare(b.subject)
                break
            case "status":
                comparison = (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99)
                break
            case "priority":
                comparison = (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99)
                break
            case "date":
            default: {
                const parseDate = (d) => {
                    if (!d) return 0
                    const parts = d.split("/")
                    if (parts.length === 3) return new Date(parts[2], parts[1] - 1, parts[0]).getTime()
                    return new Date(d).getTime() || 0
                }
                comparison = parseDate(a.createdDate) - parseDate(b.createdDate)
                break
            }
        }

        return sortDirection === "asc" ? comparison : -comparison
    })

    // ── Sort helpers ──────────────────────────────────────────
    const handleSortOptionClick = (value) => {
        if (value === sortBy) {
            setSortDirection(prev => (prev === "asc" ? "desc" : "asc"))
        } else {
            setSortBy(value)
            setSortDirection("desc")
        }
    }

    const getSortIcon = () => {
        return sortDirection === "asc"
            ? <ArrowUp size={14} className="text-white" />
            : <ArrowDown size={14} className="text-white" />
    }

    const currentSortLabel = sortOptions.find(o => o.value === sortBy)?.label || "Date"

    // ── Handlers ───────────────────────────────────────────────
    const handleTicketClick = (ticket) => setSelectedTicket(ticket)
    const handleCloseTicketView = () => setSelectedTicket(null)

    const handleUpdateTicket = (updatedTicket) => {
        setTickets(tickets.map(ticket =>
            ticket.id === updatedTicket.id ? updatedTicket : ticket
        ))
        setSelectedTicket(updatedTicket)
    }

    const handleRefresh = () => {
        setTickets([...adminTickets])
        setSearchTerm("")
        setStatusFilter("all")
        setPriorityFilter("all")
    }

    // ── Status — solid badges (only 3 statuses) ─────────────
    const getStatusColor = (status) => {
        switch (status) {
            case "Open":
                return "bg-green-500 text-white"
            case "Awaiting your reply":
                return "bg-yellow-500 text-white"
            case "Closed":
                return "bg-gray-500 text-white"
            default:
                return "bg-gray-400 text-white"
        }
    }

    // ── Priority — colored text (no badge) ──────────────────
    const getPriorityTextColor = (priority) => {
        switch (priority) {
            case "High": return "text-red-400"
            case "Medium": return "text-yellow-400"
            case "Low": return "text-green-400"
            default: return "text-gray-400"
        }
    }

    // ── Counts for filter badges ───────────────────────────────
    const statusCounts = tickets.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1
        return acc
    }, {})

    const priorityCounts = tickets.reduce((acc, t) => {
        acc[t.priority] = (acc[t.priority] || 0) + 1
        return acc
    }, {})

    const activeFilterCount = (statusFilter !== "all" ? 1 : 0) + (priorityFilter !== "all" ? 1 : 0)

    // ── Sort Dropdown Component ────────────────────────────────
    const SortDropdown = ({ className = "" }) => (
        <div className={`relative ${className}`} ref={sortDropdownRef}>
            <button
                onClick={(e) => { e.stopPropagation(); setShowSortDropdown(!showSortDropdown) }}
                className="px-3 sm:px-4 py-2 bg-[#2F2F2F] text-gray-300 rounded-xl text-xs sm:text-sm hover:bg-[#3F3F3F] transition-colors flex items-center gap-2"
            >
                {getSortIcon()}
                <span>{currentSortLabel}</span>
            </button>

            {showSortDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-lg z-50 min-w-[180px]">
                    <div className="py-1">
                        <div className="px-3 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-700">
                            Sort by
                        </div>
                        {sortOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={(e) => { e.stopPropagation(); handleSortOptionClick(option.value) }}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition-colors flex items-center justify-between ${
                                    sortBy === option.value ? "text-white bg-gray-800/50" : "text-gray-300"
                                }`}
                            >
                                <span>{option.label}</span>
                                {sortBy === option.value && (
                                    <span className="text-gray-400">
                                        {sortDirection === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )

    return (
        <div className="min-h-screen rounded-3xl bg-[#1C1C1C] text-white md:p-6 p-3 transition-all duration-500 ease-in-out flex-1">

            {/* ── Header ─────────────────────────────────────── */}
            <div className="flex sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-white oxanium_font text-xl md:text-2xl">Tickets</h1>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRefresh}
                        className="bg-[#2F2F2F] hover:bg-[#3F3F3F] text-gray-300 text-sm px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors font-medium"
                    >
                        <RefreshCw size={16} />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                </div>
            </div>

            {/* ── Search Bar ─────────────────────────────────── */}
            <div className="mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by subject, studio or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-9 sm:pl-10 border border-[#333333] focus:border-[#3F74FF] transition-colors"
                    />
                </div>
            </div>

            {/* ── Filters Section - Collapsible ── */}
            <div className="mb-4 sm:mb-6">
                {/* Filters Header Row - Always visible */}
                <div className="flex items-center justify-between mb-2">
                    <button
                        onClick={() => setFiltersExpanded(!filtersExpanded)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <Filter size={14} />
                        <span className="text-xs sm:text-sm font-medium">Filters</span>
                        <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${filtersExpanded ? 'rotate-180' : ''}`}
                        />
                        {!filtersExpanded && activeFilterCount > 0 && (
                            <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    {/* Sort Controls - Always visible */}
                    <SortDropdown />
                </div>

                {/* Filter Pills - Collapsible */}
                <div className={`overflow-hidden transition-all duration-300 ${filtersExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    {/* Status Pills */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-3 mb-2">
                        <button
                            onClick={() => setStatusFilter("all")}
                            className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${
                                statusFilter === "all"
                                    ? "bg-blue-600 text-white"
                                    : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                            }`}
                        >
                            All
                        </button>
                        {["Open", "Awaiting your reply", "Closed"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
                                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                                    statusFilter === status
                                        ? "bg-blue-600 text-white"
                                        : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                                }`}
                            >
                                {status}
                                {statusCounts[status] ? (
                                    <span className={`text-[11px] ${statusFilter === status ? "text-blue-200" : "text-gray-500"}`}>
                                        ({statusCounts[status]})
                                    </span>
                                ) : null}
                            </button>
                        ))}
                    </div>

                    {/* Priority Pills */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-3">
                        {["High", "Medium", "Low"].map((priority) => (
                            <button
                                key={priority}
                                onClick={() => setPriorityFilter(priorityFilter === priority ? "all" : priority)}
                                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${
                                    priorityFilter === priority
                                        ? priority === "High"
                                            ? "bg-red-600 text-white"
                                            : priority === "Medium"
                                                ? "bg-yellow-600 text-white"
                                                : "bg-green-600 text-white"
                                        : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                                }`}
                            >
                                {priority}
                                {priorityCounts[priority] ? (
                                    <span className={`text-[11px] ml-1 ${
                                        priorityFilter === priority ? "opacity-80" : "text-gray-500"
                                    }`}>
                                        ({priorityCounts[priority]})
                                    </span>
                                ) : null}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Ticket List ────────────────────────────────── */}
            <div className="space-y-2">
                {sortedTickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        onClick={() => handleTicketClick(ticket)}
                        className="bg-[#161616] rounded-lg p-3 sm:p-4 cursor-pointer transition-colors hover:bg-[#1F1F1F]"
                    >
                        {/* Row 1: Subject + #ID */}
                        <div className="flex justify-between items-start mb-1.5 min-w-0">
                            <h3 className="text-white font-medium text-sm md:text-base flex-1 min-w-0 line-clamp-2 pr-2">
                                {ticket.subject} <span className="text-blue-400 font-semibold">#{ticket.id}</span>
                            </h3>
                        </div>

                        {/* Row 2: Studio name */}
                        <p className="text-sm text-gray-400 mb-2">{ticket.studioName}</p>

                        {/* Row 3: Timestamps */}
                        <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap mb-2">
                            <span>Created: <span className="text-gray-300">{ticket.createdDate}</span></span>
                            <span>Updated: <span className="text-gray-300">{ticket.lastUpdated}</span></span>
                        </div>

                        {/* Row 4: Status badge + Priority text */}
                        <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                {ticket.status}
                            </span>
                            <span className={`text-xs font-medium ${getPriorityTextColor(ticket.priority)}`}>
                                {ticket.priority} Priority
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Empty State ────────────────────────────────── */}
            {sortedTickets.length === 0 && (
                <div className="text-center py-16">
                    <div className="text-gray-500 mb-6">
                        <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-300 mb-3">No tickets found</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria.</p>
                </div>
            )}

            {selectedTicket && (
                <AdminTicketView
                    ticket={selectedTicket}
                    onClose={handleCloseTicketView}
                    onUpdateTicket={handleUpdateTicket}
                />
            )}
        </div>
    )
}

export default AdminTicketsSystem
