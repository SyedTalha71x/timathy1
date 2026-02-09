/* eslint-disable no-unused-vars */
import { useState, useRef } from "react"
import {
    X,
    List,
    ImageIcon,
    Search,
    Filter,
    Eye,
    MessageSquare,
    Calendar,
    User,
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle,
    ChevronDown,
    Download,
    RefreshCw
} from "lucide-react"
import toast from "react-hot-toast"

import AdminTicketView from "../../components/admin-dashboard-components/tickets-component/admin-ticket-view-modal"
import { adminTickets } from "../../utils/admin-panel-states/tickets-states"

const AdminTicketsSystem = () => {
    const [tickets, setTickets] = useState(adminTickets)
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [showFilters, setShowFilters] = useState(false)

    const [statusFilter, setStatusFilter] = useState(["All"])
    const [priorityFilter, setPriorityFilter] = useState(["All"])

    const statusOptions = ["All", "Open", "In Progress", "Pending Customer", "Resolved", "Closed"]
    const priorityOptions = ["All", "High", "Medium", "Low"]

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.customer.email.toLowerCase().includes(searchTerm.toLowerCase())

        // If "All" is selected or no filters, show all. Otherwise check selected filters
        const matchesStatus = statusFilter.includes("All") || statusFilter.length === 0 || statusFilter.includes(ticket.status)
        const matchesPriority = priorityFilter.includes("All") || priorityFilter.length === 0 || priorityFilter.includes(ticket.priority)

        return matchesSearch && matchesStatus && matchesPriority
    })

    const toggleFilter = (filterType, value) => {
        const setters = {
            status: setStatusFilter,
            priority: setPriorityFilter
        }

        const currentFilters = {
            status: statusFilter,
            priority: priorityFilter
        }

        const setFilter = setters[filterType]
        const filters = currentFilters[filterType]

        if (value === "All") {
            // If clicking "All", clear all other selections and select only "All"
            setFilter(["All"])
        } else {
            if (filters.includes(value)) {
                // Remove the filter
                const newFilters = filters.filter(item => item !== value)
                // If no filters left, set to ["All"]
                setFilter(newFilters.length === 0 ? ["All"] : newFilters)
            } else {
                // Add the filter and remove "All" if it's there
                const newFilters = filters.filter(item => item !== "All")
                setFilter([...newFilters, value])
            }
        }
    }

    const clearAllFilters = () => {
        setStatusFilter(["All"])
        setPriorityFilter(["All"])
    }

    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket)
    }

    const handleCloseTicketView = () => {
        setSelectedTicket(null)
    }

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

        // Create and download CSV file
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
        setStatusFilter("All")
        setPriorityFilter("All")
        setShowFilters(false)

    }

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
    return (
        <div className={`
            min-h-screen rounded-3xl bg-[#1C1C1C] text-white md:p-6 p-3
            transition-all duration-500 ease-in-out flex-1
            
          `}>
            <div className="">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex justify-between items-center w-full">
                        <h1 className="text-2xl font-bold text-white">Tickets </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={handleExport} className="flex whitespace-nowrap items-center gap-2 cursor-pointer px-4 py-2 text-sm rounded-lg bg-gray-600 ">
                            <Download size={16} />
                            Export Excel
                        </button>
                        <button onClick={handleRefresh} className="flex items-center gap-2 cursor-pointer px-4 py-2 text-sm border border-slate-400/60 rounded-lg  ">
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-3 py-4 bg-[#1C1C1C] ">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search tickets by subject, customer name, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#161616] text-gray-200 placeholder-gray-500"
                        />
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center text-sm gap-2 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 text-gray-300"
                    >
                        <Filter size={16} />
                        Filters
                        <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {showFilters && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 text-sm gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                            <div className="space-y-2">
                                {statusOptions.map(status => (
                                    <label key={status} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={statusFilter.includes(status)}
                                            onChange={() => toggleFilter('status', status)}
                                            className="rounded border-gray-600 bg-[#161616] text-blue-500 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-gray-300 text-sm">{status}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Priority Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                            <div className="space-y-2">
                                {priorityOptions.map(priority => (
                                    <label key={priority} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={priorityFilter.includes(priority)}
                                            onChange={() => toggleFilter('priority', priority)}
                                            className="rounded border-gray-600 bg-[#161616] text-blue-500 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-gray-300 text-sm">{priority}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {(statusFilter.length > 1 || priorityFilter.length > 1 ||
                            (statusFilter.length === 1 && !statusFilter.includes("All")) ||
                            (priorityFilter.length === 1 && !priorityFilter.includes("All"))) && (
                                <div className="sm:col-span-2">
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-sm text-blue-400 hover:text-blue-300 underline"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                    </div>
                )}
            </div>

            <div className="flex-1 py-3">
                <div className="bg-[#1C1C1C] rounded-lg overflow-hidden">
                    <div className="bg-[#1C1C1C] overflow-hidden">
                        <div className="space-y-2">
                            {filteredTickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    className="border border-slate-600/40 rounded-md mx-1 p-3 cursor-pointer hover:bg-[#161616] transition-colors duration-200"
                                    onClick={() => handleTicketClick(ticket)}
                                >
                                    {/* Header with ID, Studio, and Date */}
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(ticket.status)}
                                            <span className="font-semibold text-white text-sm">#{ticket.id}</span>
                                            <span className="text-sm text-gray-300 font-medium">{ticket.studioName}</span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            Created: {ticket.createdDate}
                                        </span>
                                    </div>

                                    {/* Subject Line */}
                                    <h3 className="font-medium text-white mb-2 text-sm leading-tight">
                                        {ticket.subject}
                                    </h3>

                                    {/* Status, Priority and Customer Info */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-sm text-gray-300 font-medium">
                                                {ticket.customer.name}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer with Last Updated and Action */}
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-600/30">
                                        <span className="text-xs text-gray-400">
                                            Updated: {ticket.lastUpdated}
                                        </span>
                                        {/* <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleTicketClick(ticket)
                                            }}
                                            className="text-white cursor-pointer text-sm bg-blue-600 py-1 px-3 rounded-md font-medium flex items-center gap-1 hover:bg-blue-700 transition-colors"
                                        >
                                            <Eye size={14} />
                                            View
                                        </button> */}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredTickets.length === 0 && (
                            <div className="text-center py-10">
                                <MessageSquare size={40} className="mx-auto text-gray-600 mb-3" />
                                <h3 className="text-lg font-medium text-white mb-2">No tickets found</h3>
                                <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

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