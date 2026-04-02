/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
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
import toast from "../../components/shared/SharedToast"
import { haptic } from "../../utils/haptic"
import PullToRefresh from "../../components/shared/PullToRefresh"

import AdminTicketView from "../../components/admin-dashboard-components/tickets-components/admin-ticket-view-modal"
import { adminTickets } from "../../utils/admin-panel-states/tickets-states"

const AdminTicketsSystem = () => {
    const { t, i18n } = useTranslation()
    const [tickets, setTickets] = useState(adminTickets)
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")

    const [statusFilter, setStatusFilter] = useState("all")
    const [priorityFilter, setPriorityFilter] = useState("all")

    const [sortBy, setSortBy] = useState("date")
    const [sortDirection, setSortDirection] = useState("desc")
    const [showSortDropdown, setShowSortDropdown] = useState(false)
    const sortDropdownRef = useRef(null)

    const [filtersExpanded, setFiltersExpanded] = useState(false)

    const getLocale = () => {
        const lang = i18n.language
        if (lang === "de") return "de-DE"
        if (lang === "fr") return "fr-FR"
        if (lang === "es") return "es-ES"
        if (lang === "it") return "it-IT"
        return "en-GB"
    }

    // Parse date strings from dummy data (dd/mm/yyyy or ISO) and format for locale
    const formatDateString = (dateStr) => {
        if (!dateStr) return "—"
        let date
        const parts = dateStr.split("/")
        if (parts.length === 3 && parts[0].length <= 2) {
            date = new Date(parts[2], parts[1] - 1, parts[0])
        } else {
            date = new Date(dateStr)
        }
        if (isNaN(date.getTime())) return dateStr
        return date.toLocaleDateString(getLocale(), { day: "2-digit", month: "2-digit", year: "numeric" })
    }

    useEffect(() => {
        const isDesktop = window.innerWidth >= 768
        setFiltersExpanded(isDesktop)
    }, [])

    const sortOptions = [
        { value: "date", label: t("admin.tickets.sort.date") },
        { value: "subject", label: t("admin.tickets.sort.subject") },
        { value: "status", label: t("admin.tickets.sort.status") },
        { value: "priority", label: t("admin.tickets.sort.priority") },
    ]

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
        haptic.light()
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

    const currentSortLabel = sortOptions.find(o => o.value === sortBy)?.label || t("admin.tickets.sort.date")

    // ── Handlers ───────────────────────────────────────────────
    const handleTicketClick = (ticket) => {
        haptic.light()
        setSelectedTicket(ticket)
    }
    const handleCloseTicketView = () => setSelectedTicket(null)

    const handleUpdateTicket = (updatedTicket) => {
        setTickets(tickets.map(ticket =>
            ticket.id === updatedTicket.id ? updatedTicket : ticket
        ))
        setSelectedTicket(updatedTicket)
        haptic.success()
    }

    const handleRefresh = async () => {
        setTickets([...adminTickets])
        setSearchTerm("")
        setStatusFilter("all")
        setPriorityFilter("all")
        haptic.success()
    }

    // ── Status label (translated) ─────────────────────────────
    const getStatusLabel = (status) => {
        switch (status) {
            case "Open": return t("admin.tickets.status.open")
            case "Awaiting your reply": return t("admin.tickets.status.awaitingReply")
            case "Closed": return t("admin.tickets.status.closed")
            default: return status
        }
    }

    // ── Priority label (translated) ──────────────────────────
    const getPriorityLabel = (priority) => {
        switch (priority) {
            case "High": return t("admin.tickets.priority.high")
            case "Medium": return t("admin.tickets.priority.medium")
            case "Low": return t("admin.tickets.priority.low")
            default: return priority
        }
    }

    // ── Status — solid badges ─────────────────────────────────
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

    // ── Priority — colored text ──────────────────────────────
    const getPriorityTextColor = (priority) => {
        switch (priority) {
            case "High": return "text-red-400"
            case "Medium": return "text-yellow-400"
            case "Low": return "text-green-400"
            default: return "text-content-muted"
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
                onClick={(e) => { e.stopPropagation(); haptic.light(); setShowSortDropdown(!showSortDropdown) }}
                className="px-3 sm:px-4 py-2 bg-surface-button text-content-secondary rounded-xl text-xs sm:text-sm hover:bg-surface-button-hover transition-colors flex items-center gap-2"
            >
                {getSortIcon()}
                <span>{currentSortLabel}</span>
            </button>

            {showSortDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-surface-hover border border-border rounded-lg shadow-lg z-50 min-w-[180px]">
                    <div className="py-1">
                        <div className="px-3 py-1.5 text-xs text-content-faint font-medium border-b border-border">
                            {t("common.sortBy")}
                        </div>
                        {sortOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={(e) => { e.stopPropagation(); handleSortOptionClick(option.value) }}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-hover transition-colors flex items-center justify-between ${
                                    sortBy === option.value ? "text-white bg-gray-800/50" : "text-content-secondary"
                                }`}
                            >
                                <span>{option.label}</span>
                                {sortBy === option.value && (
                                    <span className="text-content-muted">
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
        <div className="min-h-screen rounded-3xl bg-surface-base text-white md:p-6 p-3 transition-all duration-500 ease-in-out flex-1">

            {/* ── Header ─────────────────────────────────────── */}
            <div className="flex sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-white oxanium_font text-xl md:text-2xl">{t("admin.tickets.title")}</h1>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRefresh}
                        className="bg-surface-button hover:bg-surface-button-hover text-content-secondary text-sm px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors font-medium"
                    >
                        <RefreshCw size={16} />
                        <span className="hidden sm:inline">{t("common.refresh")}</span>
                    </button>
                </div>
            </div>

            {/* ── Search Bar ─────────────────────────────────── */}
            <div className="mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" size={16} />
                    <input
                        type="text"
                        placeholder={t("admin.tickets.search.placeholder")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-surface-card outline-none text-sm text-white rounded-xl px-4 py-2 pl-9 sm:pl-10 border border-border focus:border-[#3F74FF] transition-colors"
                    />
                </div>
            </div>

            {/* ── Filters Section - Collapsible ── */}
            <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-2">
                    <button
                        onClick={() => { haptic.light(); setFiltersExpanded(!filtersExpanded) }}
                        className="flex items-center gap-2 text-content-muted hover:text-content-primary transition-colors"
                    >
                        <Filter size={14} />
                        <span className="text-xs sm:text-sm font-medium">{t("common.filters")}</span>
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

                    <SortDropdown />
                </div>

                <div className={`overflow-hidden transition-all duration-300 ${filtersExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    {/* Status Pills */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-3 mb-2">
                        <button
                            onClick={() => { haptic.light(); setStatusFilter("all") }}
                            className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${
                                statusFilter === "all"
                                    ? "bg-blue-600 text-white"
                                    : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"
                            }`}
                        >
                            {t("admin.tickets.status.all")}
                        </button>
                        {[
                            { key: "Open", label: t("admin.tickets.status.open") },
                            { key: "Awaiting your reply", label: t("admin.tickets.status.awaitingReply") },
                            { key: "Closed", label: t("admin.tickets.status.closed") },
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => { haptic.light(); setStatusFilter(statusFilter === key ? "all" : key) }}
                                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                                    statusFilter === key
                                        ? "bg-blue-600 text-white"
                                        : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"
                                }`}
                            >
                                {label}
                                {statusCounts[key] ? (
                                    <span className={`text-[11px] ${statusFilter === key ? "text-blue-200" : "text-content-faint"}`}>
                                        ({statusCounts[key]})
                                    </span>
                                ) : null}
                            </button>
                        ))}
                    </div>

                    {/* Priority Pills */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-3">
                        {[
                            { key: "High", label: t("admin.tickets.priority.high"), activeColor: "bg-red-600" },
                            { key: "Medium", label: t("admin.tickets.priority.medium"), activeColor: "bg-yellow-600" },
                            { key: "Low", label: t("admin.tickets.priority.low"), activeColor: "bg-green-600" },
                        ].map(({ key, label, activeColor }) => (
                            <button
                                key={key}
                                onClick={() => { haptic.light(); setPriorityFilter(priorityFilter === key ? "all" : key) }}
                                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl cursor-pointer text-[11px] sm:text-sm font-medium transition-colors ${
                                    priorityFilter === key
                                        ? `${activeColor} text-white`
                                        : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"
                                }`}
                            >
                                {label}
                                {priorityCounts[key] ? (
                                    <span className={`text-[11px] ml-1 ${
                                        priorityFilter === key ? "opacity-80" : "text-content-faint"
                                    }`}>
                                        ({priorityCounts[key]})
                                    </span>
                                ) : null}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Ticket List ────────────────────────────────── */}
            <PullToRefresh onRefresh={handleRefresh} className="flex-1 overflow-y-auto">
                <div className="space-y-2">
                    {sortedTickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            onClick={() => handleTicketClick(ticket)}
                            className="bg-surface-card rounded-lg p-3 sm:p-4 cursor-pointer transition-colors hover:bg-surface-hover"
                        >
                            <div className="flex justify-between items-start mb-1.5 min-w-0">
                                <h3 className="text-white font-medium text-sm md:text-base flex-1 min-w-0 line-clamp-2 pr-2">
                                    {ticket.subject} <span className="text-blue-400 font-semibold">#{ticket.id}</span>
                                </h3>
                            </div>

                            <p className="text-sm text-content-muted mb-2">{ticket.studioName}</p>

                            <div className="flex items-center gap-4 text-xs text-content-muted flex-wrap mb-2">
                                <span>{t("admin.tickets.list.created")}: <span className="text-content-secondary">{formatDateString(ticket.createdDate)}</span></span>
                                <span>{t("admin.tickets.list.updated")}: <span className="text-content-secondary">{formatDateString(ticket.lastUpdated)}</span></span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                    {getStatusLabel(ticket.status)}
                                </span>
                                <span className={`text-xs font-medium ${getPriorityTextColor(ticket.priority)}`}>
                                    {ticket.priority === "High" ? t("admin.tickets.priority.labelHigh") : ticket.priority === "Medium" ? t("admin.tickets.priority.labelMedium") : t("admin.tickets.priority.labelLow")}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Empty State ────────────────────────────────── */}
                {sortedTickets.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-content-faint mb-6">
                            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-content-secondary mb-3">{t("admin.tickets.empty.title")}</h3>
                        <p className="text-content-faint mb-6">{t("admin.tickets.empty.description")}</p>
                    </div>
                )}
            </PullToRefresh>

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
