/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react"
import {
    Search,
    Eye,
    MessageSquare,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle,
    Download,
    RefreshCw,
    ArrowUpDown,
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

    // Filter states — simplified to single-select pills (matching bulletin board / marketplace)
    const [statusFilter, setStatusFilter] = useState("all")
    const [priorityFilter, setPriorityFilter] = useState("all")

    // Sort states — matching bulletin board / selling pattern
    const [sortBy, setSortBy] = useState("date")
    const [sortDirection, setSortDirection] = useState("desc")
    const [showSortDropdown, setShowSortDropdown] = useState(false)
    const sortDropdownRef = useRef(null)

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
    const statusOrder = { Open: 0, "In Progress": 1, "Pending Customer": 2, Resolved: 3, Closed: 4 }

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
                // Parse dd/mm/yyyy dates for proper comparison
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

    // ── Sort helpers (matching bulletin board pattern) ─────────
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

    const handleExport = () => {
        const headers = ['ID', 'Subject', 'Status', 'Priority', 'Category', 'Customer Name', 'Customer Email', 'Assigned To', 'Created Date', 'Last Updated']

        const csvContent = [
            headers.join(','),
            ...filteredTickets.map(ticket => [
                ticket.id,
                `"${ticket.subject.replace(/"/g, '""')}"`,
                ticket.status,
                ticket.priority,
                ticket.category,
                `"${ticket.customer.name.replace(/"/g, '""')}"`,
                ticket.customer.email,
                `"${ticket.assignedTo.replace(/"/g, '""')}"`,
                ticket.createdDate,
                ticket.lastUpdated
            ].join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `tickets-export-${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleRefresh = () => {
        setTickets([...adminTickets])
        setSearchTerm("")
        setStatusFilter("all")
        setPriorityFilter("all")
    }

    // ── Status / priority visuals ──────────────────────────────
    const getStatusColor = (status) => {
        switch (status) {
            case "Open":
                return "bg-green-900/20 text-green-400 border-green-700"
            case "In Progress":
                return "bg-blue-900/20 text-blue-400 border-blue-700"
            case "Pending Customer":
                return "bg-yellow-900/20 text-yellow-400 border-yellow-700"
            case "Resolved":
                return "bg-green-900/20 text-green-400 border-green-700"
            case "Closed":
                return "bg-gray-700 text-gray-400 border-gray-600"
            default:
                return "bg-gray-700 text-gray-400 border-gray-600"
        }
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "High":
                return "bg-red-900/20 text-red-400 border-red-700"
            case "Medium":
                return "bg-yellow-900/20 text-yellow-400 border-yellow-700"
            case "Low":
                return "bg-green-900/20 text-green-400 border-green-700"
            default:
                return "bg-gray-700 text-gray-400 border-gray-600"
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "Open": return <AlertCircle size={14} className="text-green-400" />
            case "In Progress": return <Clock size={14} className="text-blue-400" />
            case "Pending Customer": return <MessageSquare size={14} className="text-yellow-400" />
            case "Resolved": return <CheckCircle size={14} className="text-green-400" />
            case "Closed": return <XCircle size={14} className="text-gray-400" />
            default: return <AlertCircle size={14} className="text-gray-400" />
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

    // ── Sort Dropdown Component (reusable, matching other pages) ──
    const SortDropdown = ({ className = "" }) => (
        <div className={`relative ${className}`} ref={sortDropdownRef}>
            <button
                onClick={(e) => { e.stopPropagation(); setShowSortDropdown(!showSortDropdown) }}
                className="px-3 sm:px-4 py-2 bg-[#2F2F2F] text-gray-300 rounded-xl text-xs sm:text-sm hover:bg-[#3F3F3F] transition-colors flex items-center gap-2"
            >
                {getSortIcon()}
                <span className="hidden sm:inline">{currentSortLabel}</span>
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

                    {/* Sort Button — Mobile (next to title, like selling / bulletin board) */}
                    <div className="sm:hidden">
                        <SortDropdown />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Export Button (styled like Journal / Tags buttons) */}
                    <div className="relative group">
                        <button
                            onClick={handleExport}
                            className="bg-[#2F2F2F] hover:bg-[#3F3F3F] text-gray-300 text-sm px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors font-medium"
                        >
                            <Download size={16} />
                            <span className="hidden sm:inline">Export</span>
                        </button>
                    </div>

                    {/* Refresh Button */}
                    <div className="relative group">
                        <button
                            onClick={handleRefresh}
                            className="bg-[#2F2F2F] hover:bg-[#3F3F3F] text-gray-300 text-sm px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors font-medium"
                        >
                            <RefreshCw size={16} />
                            <span className="hidden sm:inline">Refresh</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Search Bar (matching marketplace / bulletin board / selling) ── */}
            <div className="mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by subject, customer, studio or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2 pl-9 sm:pl-10 border border-[#333333] focus:border-[#3F74FF] transition-colors"
                    />
                </div>
            </div>

            {/* ── Filter Pills — Status (matching bulletin board / marketplace style) ── */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-3">
                <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${
                        statusFilter === "all"
                            ? "bg-blue-600 text-white"
                            : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
                    }`}
                >
                    All
                </button>
                {["Open", "In Progress", "Pending Customer", "Resolved", "Closed"].map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
                        className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
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

            {/* ── Filter Pills — Priority ── */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
                {["High", "Medium", "Low"].map((priority) => (
                    <button
                        key={priority}
                        onClick={() => setPriorityFilter(priorityFilter === priority ? "all" : priority)}
                        className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${
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

                {/* Sort dropdown — Desktop (right-aligned, matching other pages) */}
                <div className="hidden sm:block ml-auto">
                    <SortDropdown />
                </div>
            </div>

            {/* ── Ticket List ────────────────────────────────── */}
            <div className="space-y-3">
                {sortedTickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        className="bg-[#1A1A1A] rounded-xl border border-gray-800 hover:border-gray-700 p-4 cursor-pointer hover:shadow-lg transition-all duration-200"
                        onClick={() => handleTicketClick(ticket)}
                    >
                        {/* Row 1: ID, Studio, Date */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                {getStatusIcon(ticket.status)}
                                <span className="font-semibold text-white text-sm">#{ticket.id}</span>
                                <span className="text-sm text-gray-400 font-medium">{ticket.studioName}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Calendar size={12} />
                                <span>{ticket.createdDate}</span>
                            </div>
                        </div>

                        {/* Row 2: Subject */}
                        <h3 className="font-medium text-white mb-3 text-sm leading-snug">
                            {ticket.subject}
                        </h3>

                        {/* Row 3: Badges + Customer */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                                    {ticket.status}
                                </span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                                    {ticket.priority}
                                </span>
                            </div>
                            <span className="text-sm text-gray-300 font-medium">
                                {ticket.customer.name}
                            </span>
                        </div>

                        {/* Row 4: Updated */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock size={12} />
                                <span>Updated: {ticket.lastUpdated}</span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleTicketClick(ticket)
                                }}
                                className="text-gray-400 hover:text-orange-400 p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                                title="View Ticket"
                            >
                                <Eye size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Empty State (matching bulletin board / selling pattern) ── */}
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

            {/* ── Ticket Detail Modal ────────────────────────── */}
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
