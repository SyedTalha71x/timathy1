/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */
/* eslint-disable react/prop-types */
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
import AdminTicketView from "../../components/customer-dashboard/tickets-component/admin-ticket-view-modal"
import toast from "react-hot-toast"
import WebsiteLinkModal from "../../components/customer-dashboard/myarea-components/website-link-modal"
import WidgetSelectionModal from "../../components/customer-dashboard/myarea-components/widgets"
import ConfirmationModal from "../../components/customer-dashboard/myarea-components/confirmation-modal"
import Sidebar from "../../components/customer-dashboard/central-sidebar"
import { IoIosMenu } from "react-icons/io"

// Sample admin tickets data
const adminTickets = [
    {
        id: 1,
        subject: "Account is not premium",
        status: "Open",
        priority: "Medium",
        category: "Account",
        customer: {
            name: "John Doe",
            email: "john.doe@example.com",
            id: "USR001"
        },
        assignedTo: "Sarah Wilson",
        createdDate: "28/1/2025",
        lastUpdated: "28/1/2025",
        messages: [
            {
                id: 1,
                sender: "customer",
                senderName: "John Doe",
                content: "Account is not premium.",
                timestamp: "28/1/2025 10:30 AM",
                attachments: []
            },
        ],
        tags: ["premium", "account-issue"]
    },
    {
        id: 2,
        subject: "Subscription renewal issue",
        status: "In Progress",
        priority: "High",
        category: "Billing",
        customer: {
            name: "Jane Smith",
            email: "jane.smith@example.com",
            id: "USR002"
        },
        assignedTo: "Mike Johnson",
        createdDate: "27/1/2025",
        lastUpdated: "28/1/2025",
        messages: [
            {
                id: 1,
                sender: "customer",
                senderName: "Jane Smith",
                content: "Having issues with subscription renewal. Payment keeps failing.",
                timestamp: "27/1/2025 2:15 PM",
                attachments: []
            },
            {
                id: 2,
                sender: "support",
                senderName: "Mike Johnson",
                content: "I've checked your payment method and it seems there's an issue with your card. Please try updating your payment information.",
                timestamp: "27/1/2025 3:20 PM",
                attachments: []
            },
            {
                id: 3,
                sender: "support",
                senderName: "Mike Johnson",
                content: "We have updated your subscription information. Please log in to GamsGo using your personal email and click on 'Subscription' to view the latest details.",
                timestamp: "28/1/2025 9:45 AM",
                attachments: []
            },
        ],
        tags: ["subscription", "payment", "urgent"]
    },
    {
        id: 3,
        subject: "Payment processing error",
        status: "Resolved",
        priority: "Medium",
        category: "Payment",
        customer: {
            name: "Robert Brown",
            email: "robert.brown@example.com",
            id: "USR003"
        },
        assignedTo: "Sarah Wilson",
        createdDate: "25/1/2025",
        lastUpdated: "25/1/2025",
        messages: [
            {
                id: 1,
                sender: "customer",
                senderName: "Robert Brown",
                content: "Having trouble with payment processing",
                timestamp: "25/1/2025 11:00 AM",
                attachments: []
            },
            {
                id: 2,
                sender: "support",
                senderName: "Sarah Wilson",
                content: "Issue has been resolved. Your payment has been processed successfully.",
                timestamp: "25/1/2025 1:30 PM",
                attachments: []
            },
        ],
        tags: ["payment", "resolved"]
    },
    {
        id: 4,
        subject: "Widget not loading properly",
        status: "Open",
        priority: "Low",
        category: "Technical",
        customer: {
            name: "Emily Davis",
            email: "emily.davis@example.com",
            id: "USR004"
        },
        assignedTo: "Unassigned",
        createdDate: "29/1/2025",
        lastUpdated: "29/1/2025",
        messages: [
            {
                id: 1,
                sender: "customer",
                senderName: "Emily Davis",
                content: "The dashboard widget is not loading properly on my account. It shows a blank screen.",
                timestamp: "29/1/2025 8:15 AM",
                attachments: []
            },
        ],
        tags: ["widget", "technical", "dashboard"]
    },
    {
        id: 5,
        subject: "Billing discrepancy",
        status: "Pending Customer",
        priority: "High",
        category: "Billing",
        customer: {
            name: "Michael Wilson",
            email: "michael.wilson@example.com",
            id: "USR005"
        },
        assignedTo: "Lisa Chen",
        createdDate: "26/1/2025",
        lastUpdated: "27/1/2025",
        messages: [
            {
                id: 1,
                sender: "customer",
                senderName: "Michael Wilson",
                content: "I was charged twice for the same subscription. Please help resolve this.",
                timestamp: "26/1/2025 4:30 PM",
                attachments: []
            },
            {
                id: 2,
                sender: "support",
                senderName: "Lisa Chen",
                content: "I can see the duplicate charge on your account. Can you please provide the transaction IDs for both charges so I can process a refund?",
                timestamp: "27/1/2025 10:15 AM",
                attachments: []
            },
        ],
        tags: ["billing", "refund", "duplicate-charge"]
    }
]


const AdminTicketsSystem = () => {
    const [tickets, setTickets] = useState(adminTickets)
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("All")
    const [priorityFilter, setPriorityFilter] = useState("All")
    const [assigneeFilter, setAssigneeFilter] = useState("All")
    const [showFilters, setShowFilters] = useState(false)

    const statusOptions = ["All", "Open", "In Progress", "Pending Customer", "Resolved", "Closed"]
    const priorityOptions = ["All", "High", "Medium", "Low"]
    const assigneeOptions = ["All", "Unassigned", "Sarah Wilson", "Mike Johnson", "Lisa Chen", "David Rodriguez", "Emma Thompson"]



    //sidebar related logic and states 
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [selectedMemberType, setSelectedMemberType] = useState("Studios Acquired")
    const [isRightWidgetModalOpen, setIsRightWidgetModalOpen] = useState(false)
    const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, linkId: null })
    const [editingLink, setEditingLink] = useState(null)
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null)

    const [sidebarWidgets, setSidebarWidgets] = useState([
        { id: "sidebar-chart", type: "chart", position: 0 },
        { id: "sidebar-todo", type: "todo", position: 1 },
        { id: "sidebar-websiteLink", type: "websiteLink", position: 2 },
        { id: "sidebar-expiringContracts", type: "expiringContracts", position: 3 },
    ])

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

    const [customLinks, setCustomLinks] = useState([
        {
            id: "link1",
            url: "https://fitness-web-kappa.vercel.app/",
            title: "Timathy Fitness Town",
        },
        { id: "link2", url: "https://oxygengym.pk/", title: "Oxygen Gyms" },
        { id: "link3", url: "https://fitness-web-kappa.vercel.app/", title: "Timathy V1" },
    ])

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

    // -------------- end of sidebar logic


    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.customer.email.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "All" || ticket.status === statusFilter
        const matchesPriority = priorityFilter === "All" || ticket.priority === priorityFilter
        const matchesAssignee = assigneeFilter === "All" || ticket.assignedTo === assigneeFilter

        return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
    })

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
        setAssigneeFilter("All")
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



    // continue sidebar logic
    const updateCustomLink = (id, field, value) => {
        setCustomLinks((currentLinks) => currentLinks.map((link) => (link.id === id ? { ...link, [field]: value } : link)))
    }

    const removeCustomLink = (id) => {
        setConfirmationModal({ isOpen: true, linkId: id })
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

    const confirmRemoveLink = () => {
        if (confirmationModal.linkId) {
            setCustomLinks((currentLinks) => currentLinks.filter((link) => link.id !== confirmationModal.linkId))
            toast.success("Website link removed successfully")
        }
        setConfirmationModal({ isOpen: false, linkId: null })
    }

    const getSidebarWidgetStatus = (widgetType) => {
        // Check if widget exists in sidebar widgets
        const existsInSidebar = sidebarWidgets.some((widget) => widget.type === widgetType)

        if (existsInSidebar) {
            return { canAdd: false, location: "sidebar" }
        }

        return { canAdd: true, location: null }
    }

    const toggleRightSidebar = () => {
        setIsRightSidebarOpen(!isRightSidebarOpen)
    }


    return (
        <div className={`
            min-h-screen rounded-3xl bg-[#1C1C1C] text-white md:p-6 p-3
            transition-all duration-500 ease-in-out flex-1
            ${isRightSidebarOpen
                ? 'lg:mr-86 mr-0'
                : 'mr-0'
            }
          `}>
            {/* Header */}
            <div className="">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex justify-between items-center w-full">
                        <h1 className="text-2xl font-bold text-white">Tickets </h1>
                        <div onClick={toggleRightSidebar} className="cursor-pointer text-white lg:hidden md:hidden block hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md ">
                            <IoIosMenu size={26} />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={handleExport} className="flex items-center gap-2 cursor-pointer px-4 py-2 text-sm rounded-lg bg-gray-600 ">
                            <Download size={16} />
                            Export
                        </button>
                        <button onClick={handleRefresh} className="flex items-center gap-2 cursor-pointer px-4 py-2 text-sm border border-slate-400/60 rounded-lg  ">
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                        <div onClick={toggleRightSidebar} className="cursor-pointer text-white lg:block md:block hidden hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md ">
                            <IoIosMenu size={26} />
                        </div>
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

                {/* Filter Dropdowns */}
                {showFilters && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 text-sm gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full border border-gray-600 rounded-md px-3 py-2 text-sm bg-[#161616] text-gray-200"
                            >
                                {statusOptions.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="w-full border border-gray-600 rounded-md px-3 py-2 text-sm bg-[#161616] text-gray-200"
                            >
                                {priorityOptions.map(priority => (
                                    <option key={priority} value={priority}>{priority}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Assigned To</label>
                            <select
                                value={assigneeFilter}
                                onChange={(e) => setAssigneeFilter(e.target.value)}
                                className="w-full border border-gray-600 rounded-md px-3 py-2 text-sm bg-[#161616] text-gray-200"
                            >
                                {assigneeOptions.map(assignee => (
                                    <option key={assignee} value={assignee}>{assignee}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Tickets Table */}
            <div className="flex-1 px-3 py-4">
                <div className="bg-[#1C1C1C] rounded-lg  overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="">
                        <div className="bg-[#1C1C1C] rounded-lg border border-slate-400/40 overflow-hidden">
                            {/* Card View for All Screens */}
                            <div>
                                {filteredTickets.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        className="border-b border-gray-700 p-4 cursor-pointer hover:bg-[#161616]"
                                        onClick={() => handleTicketClick(ticket)}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(ticket.status)}
                                                <span className="font-medium text-white text-sm">#{ticket.id}</span>
                                            </div>
                                            <span className="text-xs text-gray-400">{ticket.createdDate}</span>
                                        </div>

                                        <h3 className="font-medium text-white mb-2 text-sm">{ticket.subject}</h3>

                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-gray-400">
                                            <div>
                                                <span className="font-medium text-gray-300">{ticket.customer.name}</span>
                                                <span className="block text-xs">{ticket.customer.email}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-xs">Assigned to:</span>
                                                <span className="font-medium text-gray-300">{ticket.assignedTo}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mt-3 pt-3 ">
                                            <span className="text-xs text-gray-400">Updated: {ticket.lastUpdated}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleTicketClick(ticket)
                                                }}
                                                className="text-white cursor-pointer text-sm bg-blue-600 py-1.5 px-4 rounded-md font-medium flex items-center gap-1"
                                            >
                                                <Eye size={14} />
                                                View
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Empty State */}
                            {filteredTickets.length === 0 && (
                                <div className="text-center py-12">
                                    <MessageSquare size={48} className="mx-auto text-gray-600 mb-4" />
                                    <h3 className="text-lg font-medium text-white mb-2">No tickets found</h3>
                                    <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {filteredTickets.length === 0 && (
                        <div className="text-center py-12">
                            <MessageSquare size={48} className="mx-auto text-gray-600 mb-4" />
                            <h3 className="text-lg font-medium text-white mb-2">No tickets found</h3>
                            <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
                        </div>
                    )}
                </div>
            </div>



            {selectedTicket && (
                <AdminTicketView
                    ticket={selectedTicket}
                    onClose={handleCloseTicketView}
                    onUpdateTicket={handleUpdateTicket}
                />
            )}

            {/* sidebar related modals */}

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

            <ConfirmationModal
                isOpen={confirmationModal.isOpen}
                onClose={() => setConfirmationModal({ isOpen: false, linkId: null })}
                onConfirm={confirmRemoveLink}
                title="Delete Website Link"
                message="Are you sure you want to delete this website link? This action cannot be undone."
            />

            <WidgetSelectionModal
                isOpen={isRightWidgetModalOpen}
                onClose={() => setIsRightWidgetModalOpen(false)}
                onSelectWidget={handleAddSidebarWidget}
                getWidgetStatus={getSidebarWidgetStatus}
                widgetArea="sidebar"
            />

            {editingLink && (
                <WebsiteLinkModal
                    link={editingLink}
                    onClose={() => setEditingLink(null)}
                    updateCustomLink={updateCustomLink}
                    setCustomLinks={setCustomLinks}
                />
            )}
        </div>
    )
}

export default AdminTicketsSystem