/* eslint-disable react/no-unescaped-entities */
"use client"

/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react"
import {
  X,
  Search,
  ChevronDown,
  Cake,
  Eye,
  FileText,
  Info,
  AlertTriangle,
  Calendar,
  History,
  MessageCircle,
  Edit3,
  Trash2,
} from "lucide-react"
import DefaultAvatar from "../../public/default-avatar.avif"
import toast, { Toaster } from "react-hot-toast"

export default function Members() {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)
  const [sortBy, setSortBy] = useState("alphabetical")
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [activeTab, setActiveTab] = useState("details")

  // Calendar and Appointment states
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [selectedMemberForAppointments, setSelectedMemberForAppointments] = useState(null)
  const [memberContingent, setMemberContingent] = useState({
    1: { used: 2, total: 7 },
    2: { used: 1, total: 8 },
  })
  const [showContingentModal, setShowContingentModal] = useState(false)
  const [tempContingent, setTempContingent] = useState({ used: 0, total: 0 })
  const [currentBillingPeriod, setCurrentBillingPeriod] = useState("04.14.25 - 04.18.2025")

  // History states
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [historyTab, setHistoryTab] = useState("general")

  // Relations states
  const [showRelationsModal, setShowRelationsModal] = useState(false)
  const [memberRelations, setMemberRelations] = useState({
    1: {
      family: [
        { name: "Anna Doe", relation: "Mother", id: 101 },
        { name: "Peter Doe", relation: "Father", id: 102 },
        { name: "Lisa Doe", relation: "Sister", id: 103 },
      ],
      friendship: [{ name: "Max Miller", relation: "Best Friend", id: 201 }],
      relationship: [
        { name: "Marie Smith", relation: "Partner", id: 301 },
        { name: "Julia Brown", relation: "Ex-Partner", id: 302 },
      ],
      work: [
        { name: "Tom Wilson", relation: "Colleague", id: 401 },
        { name: "Mr. Johnson", relation: "Boss", id: 402 },
      ],
      other: [{ name: "Mrs. Smith", relation: "Neighbor", id: 501 }],
    },
    2: {
      family: [],
      friendship: [],
      relationship: [],
      work: [],
      other: [],
    },
  })
  const [editingRelations, setEditingRelations] = useState(false)
  const [newRelation, setNewRelation] = useState({ name: "", relation: "", category: "family" })

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    zipCode: "",
    city: "",
    dateOfBirth: "",
    about: "",
    note: "",
    noteStartDate: "",
    noteEndDate: "",
    noteImportance: "unimportant",
    contractStart: "",
    contractEnd: "",
  })

  const [memberAppointments, setMemberAppointments] = useState({
    1: [
      { id: 1, title: "Strength Training", date: "2025-04-20T10:00", status: "upcoming", type: "Training" },
      { id: 2, title: "Cardio Session", date: "2025-04-22T14:00", status: "upcoming", type: "Cardio" },
    ],
    2: [{ id: 3, title: "Yoga Class", date: "2025-04-21T09:00", status: "upcoming", type: "Yoga" }],
  })

  // History data
  const [memberHistory, setMemberHistory] = useState({
    1: {
      general: [
        {
          id: 1,
          date: "2025-01-15",
          action: "Email updated",
          details: "Changed from old@email.com to john@example.com",
          user: "Admin",
        },
        { id: 2, date: "2025-01-10", action: "Phone updated", details: "Updated phone number", user: "Admin" },
      ],
      checkins: [
        { id: 1, date: "2025-01-20T09:30", type: "Check-in", location: "Main Entrance", user: "John Doe" },
        { id: 2, date: "2025-01-20T11:45", type: "Check-out", location: "Main Entrance", user: "John Doe" },
      ],
      appointments: [
        { id: 1, date: "2025-01-18T10:00", title: "Personal Training", status: "completed", trainer: "Mike Johnson" },
        { id: 2, date: "2025-01-15T14:30", title: "Consultation", status: "completed", trainer: "Sarah Wilson" },
      ],
      finance: [
        {
          id: 1,
          date: "2025-01-01",
          type: "Payment",
          amount: "$99.99",
          description: "Monthly membership fee",
          status: "completed",
        },
        {
          id: 2,
          date: "2024-12-01",
          type: "Payment",
          amount: "$99.99",
          description: "Monthly membership fee",
          status: "completed",
        },
      ],
      contracts: [
        {
          id: 1,
          date: "2024-03-01",
          action: "Contract signed",
          details: "Initial 12-month membership contract",
          user: "Admin",
        },
        { id: 2, date: "2024-02-28", action: "Contract updated", details: "Extended contract duration", user: "Admin" },
      ],
    },
    2: {
      general: [],
      checkins: [],
      appointments: [],
      finance: [],
      contracts: [],
    },
  })

  const appointmentTypes = [
    { name: "Training", duration: 60, color: "bg-blue-700" },
    { name: "Cardio", duration: 45, color: "bg-green-700" },
    { name: "Yoga", duration: 90, color: "bg-purple-600" },
    { name: "Consultation", duration: 30, color: "bg-orange-600" },
  ]

  useEffect(() => {
    if (selectedMember) {
      setEditForm({
        firstName: selectedMember.firstName,
        lastName: selectedMember.lastName,
        email: selectedMember.email,
        phone: selectedMember.phone,
        street: selectedMember.street,
        zipCode: selectedMember.zipCode,
        city: selectedMember.city,
        dateOfBirth: selectedMember.dateOfBirth,
        about: selectedMember.about,
        note: selectedMember.note,
        noteStartDate: selectedMember.noteStartDate,
        noteEndDate: selectedMember.noteEndDate,
        noteImportance: selectedMember.noteImportance,
        contractStart: selectedMember.contractStart,
        contractEnd: selectedMember.contractEnd,
      })
    }
  }, [selectedMember])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()

    const updatedMembers = members.map((member) => {
      if (member.id === selectedMember.id) {
        return {
          ...member,
          ...editForm,
          title: `${editForm.firstName} ${editForm.lastName}`,
        }
      }
      return member
    })

    setMembers(updatedMembers)
    setIsEditModalOpen(false)
    setSelectedMember(null)
    toast.success("Member details have been updated successfully")
  }

  const notePopoverRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notePopoverRef.current && !notePopoverRef.current.contains(event.target)) {
        setActiveNoteId(null)
      }
    }

    if (activeNoteId !== null) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [activeNoteId])

  const [members, setMembers] = useState([
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      title: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      street: "123 Main St",
      zipCode: "12345",
      city: "New York",
      image: null,
      isActive: true,
      note: "Allergic to peanuts",
      noteStartDate: "2023-01-01",
      noteEndDate: "2023-12-31",
      noteImportance: "important",
      dateOfBirth: "1990-05-15",
      about: "Experienced developer with a passion for clean code.",
      joinDate: "2022-03-01",
      contractStart: "2022-03-01",
      contractEnd: "2023-03-01",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      title: "Jane Smith",
      email: "jane@example.com",
      phone: "+1234567891",
      street: "456 Oak St",
      zipCode: "67890",
      city: "Los Angeles",
      image: null,
      isActive: false,
      note: "",
      noteStartDate: "",
      noteEndDate: "",
      noteImportance: "unimportant",
      dateOfBirth: "1985-08-22",
      about: "Certified PMP with 10 years of experience in IT project management.",
      joinDate: "2021-11-15",
      contractStart: "2021-11-15",
      contractEnd: "2024-04-15",
    },
  ])

  const filterOptions = [
    { id: "all", label: `All Members (${members.length})` },
    {
      id: "active",
      label: `Active Members (${members.filter((m) => m.isActive).length})`,
    },
    {
      id: "inactive",
      label: `Inactive Members (${members.filter((m) => !m.isActive).length})`,
    },
  ]

  const sortOptions = [
    { id: "alphabetical", label: "Alphabetical" },
    { id: "expiring", label: "Contracts Expiring Soon" },
  ]

  const isContractExpiringSoon = (contractEnd) => {
    if (!contractEnd) return false

    const today = new Date()
    const endDate = new Date(contractEnd)
    const oneMonthFromNow = new Date()
    oneMonthFromNow.setMonth(today.getMonth() + 1)

    return endDate <= oneMonthFromNow && endDate >= today
  }

  const filteredAndSortedMembers = () => {
    let filtered = members.filter((member) => member.title.toLowerCase().includes(searchQuery.toLowerCase()))

    if (filterStatus !== "all") {
      filtered = filtered.filter((member) => (filterStatus === "active" ? member.isActive : !member.isActive))
    }

    if (sortBy === "alphabetical") {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === "expiring") {
      filtered.sort((a, b) => {
        if (!a.contractEnd) return 1
        if (!b.contractEnd) return -1
        return new Date(a.contractEnd) - new Date(b.contractEnd)
      })
    }

    return filtered
  }

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      heading: "Heading",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      id: 2,
      heading: "Heading",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  ])

  const handleFilterSelect = (filterId) => {
    setFilterStatus(filterId)
    setIsFilterDropdownOpen(false)
  }

  const handleSortSelect = (sortId) => {
    setSortBy(sortId)
    setIsSortDropdownOpen(false)
  }

  const removeNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const handleEditMember = (member) => {
    setSelectedMember(member)
    setIsEditModalOpen(true)
  }

  const handleViewDetails = (member) => {
    setSelectedMember(member)
    setActiveTab("details")
    setIsViewDetailsModalOpen(true)
  }

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return ""
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const isBirthday = (dateOfBirth) => {
    if (!dateOfBirth) return false
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    return today.getMonth() === birthDate.getMonth() && today.getDate() === birthDate.getDate()
  }

  const redirectToContract = () => {
    window.location.href = "/dashboard/contract"
  }

  const handleAvatarChange = (e) => {
    e.preventDefault()
    toast.success("Avatar update functionality would be implemented here")
  }

  // Calendar functions
  const handleCalendarClick = (member) => {
    setSelectedMemberForAppointments(member)
    setShowAppointmentModal(true)
  }

  const handleManageContingent = (memberId) => {
    const contingent = memberContingent[memberId] || { used: 0, total: 0 }
    setTempContingent(contingent)
    setShowContingentModal(true)
  }

  const handleSaveContingent = () => {
    if (selectedMemberForAppointments) {
      setMemberContingent((prev) => ({
        ...prev,
        [selectedMemberForAppointments.id]: tempContingent,
      }))
      toast.success("Contingent updated successfully")
    }
    setShowContingentModal(false)
  }

  // History functions
  const handleHistoryClick = (member) => {
    setSelectedMember(member)
    setShowHistoryModal(true)
  }

  // Chat function
  const handleChatClick = (member) => {
    // Redirect to communications with member selected
    window.location.href = `/dashboard/communication`
  }

  // Relations functions
  const handleAddRelation = () => {
    if (!newRelation.name || !newRelation.relation) {
      toast.error("Please fill in all fields")
      return
    }

    const relationId = Date.now()
    const updatedRelations = { ...memberRelations }

    if (!updatedRelations[selectedMember.id]) {
      updatedRelations[selectedMember.id] = {
        family: [],
        friendship: [],
        relationship: [],
        work: [],
        other: [],
      }
    }

    updatedRelations[selectedMember.id][newRelation.category].push({
      id: relationId,
      name: newRelation.name,
      relation: newRelation.relation,
    })

    setMemberRelations(updatedRelations)
    setNewRelation({ name: "", relation: "", category: "family" })
    toast.success("Relation added successfully")
  }

  const handleDeleteRelation = (category, relationId) => {
    const updatedRelations = { ...memberRelations }
    updatedRelations[selectedMember.id][category] = updatedRelations[selectedMember.id][category].filter(
      (rel) => rel.id !== relationId,
    )
    setMemberRelations(updatedRelations)
    toast.success("Relation deleted successfully")
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

      <div className="flex flex-col lg:flex-row rounded-3xl bg-[#1C1C1C] text-white relative">
        <div className="flex-1 min-w-0 md:p-6 p-4 pb-36">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6">
            <h1 className="text-xl sm:text-2xl oxanium_font text-white">Members</h1>
            <div className="flex items-center md:flex-row flex-col gap-3 w-full sm:w-auto">
              <div className="relative filter-dropdown flex-1 sm:flex-none">
                <button
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  className={`flex w-full sm:w-auto cursor-pointer items-center justify-between sm:justify-start gap-2 px-4 py-2 rounded-xl text-sm border border-slate-300/30 bg-[#000000] min-w-[160px]`}
                >
                  <span className="truncate">{filterOptions.find((opt) => opt.id === filterStatus)?.label}</span>
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform flex-shrink-0 ${
                      isFilterDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isFilterDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-full sm:w-64 rounded-lg bg-[#2F2F2F] shadow-lg z-50 border border-slate-300/30">
                    {filterOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleFilterSelect(option.id)}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-[#3F3F3F] ${
                          option.id === filterStatus ? "bg-[#000000]" : ""
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative sort-dropdown flex-1 sm:flex-none">
                <button
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className={`flex w-full sm:w-auto cursor-pointer items-center justify-between sm:justify-start gap-2 px-4 py-2 rounded-xl text-sm border border-slate-300/30 bg-[#000000] min-w-[160px]`}
                >
                  <span className="truncate">Sort: {sortOptions.find((opt) => opt.id === sortBy)?.label}</span>
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform flex-shrink-0 ${isSortDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isSortDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-full sm:w-64 rounded-lg bg-[#2F2F2F] shadow-lg z-50 border border-slate-300/30">
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleSortSelect(option.id)}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-[#3F3F3F] ${
                          option.id === sortBy ? "bg-[#000000]" : ""
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-4 mb-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#101010] pl-10 pr-4 py-3 text-sm outline-none rounded-xl text-white placeholder-gray-500 border border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Edit Modal */}
          {isEditModalOpen && selectedMember && (
            <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
              <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md my-8 relative">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-white open_sans_font_700 text-lg font-semibold">Edit Member</h2>
                    <button
                      onClick={() => {
                        setIsEditModalOpen(false)
                        setSelectedMember(null)
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <X size={20} className="cursor-pointer" />
                    </button>
                  </div>

                  <form onSubmit={handleEditSubmit} className="space-y-4 custom-scrollbar overflow-y-auto max-h-[70vh]">
                    <div className="flex flex-col items-start">
                      <div className="w-24 h-24 rounded-xl overflow-hidden mb-4">
                        <img
                          src={selectedMember.image || DefaultAvatar}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <input
                        type="file"
                        id="avatar"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            toast.success("Avatar selected successfully")
                          }
                        }}
                      />
                      <label
                        htmlFor="avatar"
                        className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 px-6 py-2 rounded-xl text-sm cursor-pointer"
                      >
                        Update picture
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-200 block mb-2">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={editForm.firstName}
                          onChange={handleInputChange}
                          className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-200 block mb-2">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={editForm.lastName}
                          onChange={handleInputChange}
                          className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleInputChange}
                        className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleInputChange}
                        className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Street</label>
                      <input
                        type="text"
                        name="street"
                        value={editForm.street}
                        onChange={handleInputChange}
                        className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-200 block mb-2">ZIP Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={editForm.zipCode}
                          onChange={handleInputChange}
                          className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-200 block mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={editForm.city}
                          onChange={handleInputChange}
                          className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={editForm.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                      />
                    </div>

                    <div className="border border-slate-700 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm text-gray-200 font-medium">Special Note</label>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="noteImportance"
                            checked={editForm.noteImportance === "important"}
                            onChange={(e) => {
                              setEditForm({
                                ...editForm,
                                noteImportance: e.target.checked ? "important" : "unimportant",
                              })
                            }}
                            className="mr-2 h-4 w-4 accent-[#FF843E]"
                          />
                          <label htmlFor="noteImportance" className="text-sm text-gray-200">
                            Important
                          </label>
                        </div>
                      </div>

                      <textarea
                        name="note"
                        value={editForm.note}
                        onChange={handleInputChange}
                        className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px] mb-4"
                        placeholder="Enter special note..."
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-200 block mb-2">Start Date</label>
                          <input
                            type="date"
                            name="noteStartDate"
                            value={editForm.noteStartDate}
                            onChange={handleInputChange}
                            className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-200 block mb-2">End Date</label>
                          <input
                            type="date"
                            name="noteEndDate"
                            value={editForm.noteEndDate}
                            onChange={handleInputChange}
                            className="w-full bg-[#101010] white-calendar-icon rounded-xl px-4 py-2 text-white outline-none text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Relations Section in Edit Modal */}
                    <div className="border border-slate-700 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm text-gray-200 font-medium">Relations</label>
                        <button
                          type="button"
                          onClick={() => setEditingRelations(!editingRelations)}
                          className="text-sm text-blue-400 hover:text-blue-300"
                        >
                          {editingRelations ? "Done" : "Edit"}
                        </button>
                      </div>

                      {editingRelations && (
                        <div className="mb-4 p-3 bg-[#101010] rounded-xl">
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <input
                              type="text"
                              placeholder="Name"
                              value={newRelation.name}
                              onChange={(e) => setNewRelation({ ...newRelation, name: e.target.value })}
                              className="bg-[#222] text-white rounded px-3 py-2 text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Relation"
                              value={newRelation.relation}
                              onChange={(e) => setNewRelation({ ...newRelation, relation: e.target.value })}
                              className="bg-[#222] text-white rounded px-3 py-2 text-sm"
                            />
                          </div>
                          <div className="flex gap-2">
                            <select
                              value={newRelation.category}
                              onChange={(e) => setNewRelation({ ...newRelation, category: e.target.value })}
                              className="bg-[#222] text-white rounded px-3 py-2 text-sm flex-1"
                            >
                              <option value="family">Family</option>
                              <option value="friendship">Friendship</option>
                              <option value="relationship">Relationship</option>
                              <option value="work">Work</option>
                              <option value="other">Other</option>
                            </select>
                            <button
                              type="button"
                              onClick={handleAddRelation}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {selectedMember &&
                          memberRelations[selectedMember.id] &&
                          Object.entries(memberRelations[selectedMember.id]).map(([category, relations]) =>
                            relations.map((relation) => (
                              <div
                                key={relation.id}
                                className="flex items-center justify-between bg-[#101010] rounded px-3 py-2"
                              >
                                <div className="text-sm">
                                  <span className="text-white">{relation.name}</span>
                                  <span className="text-gray-400 ml-2">({relation.relation})</span>
                                  <span className="text-blue-400 ml-2 capitalize">- {category}</span>
                                </div>
                                {editingRelations && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRelation(category, relation.id)}
                                    className="text-red-400 hover:text-red-300"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                            )),
                          )}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-200 block mb-2">About</label>
                      <textarea
                        name="about"
                        value={editForm.about}
                        onChange={handleInputChange}
                        className="w-full bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm min-h-[100px]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#FF843E] text-white rounded-xl py-2 text-sm cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          <div className="bg-black rounded-xl open_sans_font p-4">
            {filteredAndSortedMembers().length > 0 ? (
              <div className="space-y-3">
                {filteredAndSortedMembers().map((member) => (
                  <div key={member.id} className="bg-[#161616] rounded-xl p-6 relative">
                    {member.note && (
                      <div className="absolute p-2 top-0 left-0 z-10">
                        <div className="relative">
                          <div
                            className={`${
                              member.noteImportance === "important" ? "bg-red-500" : "bg-blue-500"
                            } rounded-full p-0.5 shadow-[0_0_0_1.5px_white] cursor-pointer`}
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveNoteId(activeNoteId === member.id ? null : member.id)
                            }}
                          >
                            {member.noteImportance === "important" ? (
                              <AlertTriangle size={18} className="text-white" />
                            ) : (
                              <Info size={18} className="text-white" />
                            )}
                          </div>

                          {activeNoteId === member.id && (
                            <div
                              ref={notePopoverRef}
                              className="absolute left-0 top-6 w-72 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-20"
                            >
                              <div className="bg-gray-800 p-3 rounded-t-lg border-b border-gray-700 flex items-center gap-2">
                                {member.noteImportance === "important" ? (
                                  <AlertTriangle className="text-yellow-500 shrink-0" size={18} />
                                ) : (
                                  <Info className="text-blue-500 shrink-0" size={18} />
                                )}
                                <h4 className="text-white flex gap-1 items-center font-medium">
                                  <div>Special Note</div>
                                  <div className="text-sm text-gray-400">
                                    {member.noteImportance === "important" ? "(Important)" : "(Unimportant)"}
                                  </div>
                                </h4>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setActiveNoteId(null)
                                  }}
                                  className="ml-auto text-gray-400 hover:text-white"
                                >
                                  <X size={16} />
                                </button>
                              </div>

                              <div className="p-3">
                                <p className="text-white text-sm leading-relaxed">{member.note}</p>

                                {member.noteStartDate && member.noteEndDate && (
                                  <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                                    <p className="text-xs text-gray-300">
                                      Valid from {member.noteStartDate} to {member.noteEndDate}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
                        <img
                          src={member.image || DefaultAvatar}
                          className="h-20 w-20 sm:h-16 sm:w-16 rounded-full flex-shrink-0 object-cover"
                          alt=""
                        />
                        <div className="flex flex-col items-center sm:items-start flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row items-center gap-2">
                            <h3 className="text-white font-medium truncate text-lg sm:text-base">
                              {member.title} ({calculateAge(member.dateOfBirth)})
                            </h3>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 text-xs rounded-full ${
                                  member.isActive ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                                }`}
                              >
                                {member.isActive ? "Active" : "Inactive"}
                              </span>
                              {isBirthday(member.dateOfBirth) && <Cake size={16} className="text-yellow-500" />}
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm truncate mt-1 text-center sm:text-left flex items-center">
                            Contract: {member.contractStart} -{" "}
                            <span className={isContractExpiringSoon(member.contractEnd) ? "text-red-500" : ""}>
                              {member.contractEnd}
                            </span>
                            {isContractExpiringSoon(member.contractEnd) && (
                              <Info size={16} className="text-red-500 ml-1" />
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center sm:justify-end gap-2 lg:flex-row md:flex-row flex-col mt-4 sm:mt-0 w-full sm:w-auto">
                        {/* Calendar Button */}
                        <button
                          onClick={() => handleCalendarClick(member)}
                          className="text-blue-500 md:w-auto w-full hover:text-blue-400 bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                          title="View Appointments"
                        >
                          <Calendar size={16} />
                        </button>

                        {/* History Button */}
                        <button
                          onClick={() => handleHistoryClick(member)}
                          className="text-purple-500 md:w-auto w-full hover:text-purple-400 bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                          title="View History"
                        >
                          <History size={16} />
                        </button>

                        {/* Chat Button */}
                        <button
                          onClick={() => handleChatClick(member)}
                          className="text-green-500 md:w-auto w-full hover:text-green-400 bg-black rounded-xl border border-slate-600 py-2 px-3 hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                          title="Start Chat"
                        >
                          <MessageCircle size={16} />
                        </button>

                        <button
                          onClick={() => handleViewDetails(member)}
                          className="text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 px-6 hover:text-white hover:border-slate-400 transition-colors text-sm w-full sm:w-auto flex items-center justify-center gap-2"
                        >
                          <Eye size={16} />
                          View Details
                        </button>
                        <button
                          onClick={() => handleEditMember(member)}
                          className="text-gray-200 cursor-pointer bg-black rounded-xl border border-slate-600 py-2 px-6 hover:text-white hover:border-slate-400 transition-colors text-sm w-full sm:w-auto"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-red-600 text-center text-sm cursor-pointer">
                <p className="text-gray-400">
                  {filterStatus === "active"
                    ? "No active members found."
                    : filterStatus === "inactive"
                      ? "No inactive members found."
                      : "No members found."}
                </p>
              </div>
            )}
          </div>
        </div>

        <aside
          className={`w-80 bg-[#181818] p-6 fixed top-0 bottom-0 right-0 z-50 lg:static lg:block ${
            isRightSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          } transition-transform duration-500 ease-in-out`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold oxanium_font">Notification</h2>
            <button onClick={() => setIsRightSidebarOpen(false)} className="text-gray-400 hover:text-white lg:hidden">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4 open_sans_font">
            {notifications.map((notification) => (
              <div key={notification.id} className="bg-[#1C1C1C] rounded-xl p-4 relative">
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="absolute top-4 right-4 text-zinc-500 hover:text-white"
                >
                  <X size={16} />
                </button>
                <h3 className="open_sans_font_700 mb-2">{notification.heading}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{notification.description}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* View Details Modal with Tabs */}
      {isViewDetailsModalOpen && selectedMember && (
        <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl my-8 relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white open_sans_font_700 text-lg font-semibold">Member Details</h2>
                <button
                  onClick={() => {
                    setIsViewDetailsModalOpen(false)
                    setSelectedMember(null)
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} className="cursor-pointer" />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-gray-700 mb-6">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "details"
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab("relations")}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "relations"
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Relations
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "details" && (
                <div className="space-y-4 text-white">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedMember.image || DefaultAvatar}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">
                        {selectedMember.title} ({calculateAge(selectedMember.dateOfBirth)})
                      </h3>
                      <p className="text-gray-400">
                        Contract: {selectedMember.contractStart} -
                        <span className={isContractExpiringSoon(selectedMember.contractEnd) ? "text-red-500" : ""}>
                          {selectedMember.contractEnd}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p>{selectedMember.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <p>{selectedMember.phone}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Address</p>
                    <p>{`${selectedMember.street}, ${selectedMember.zipCode} ${selectedMember.city}`}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Date of Birth</p>
                      <p>
                        {selectedMember.dateOfBirth} (Age: {calculateAge(selectedMember.dateOfBirth)})
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Join Date</p>
                      <p>{selectedMember.joinDate}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">About</p>
                    <p>{selectedMember.about}</p>
                  </div>

                  {selectedMember.note && (
                    <div>
                      <p className="text-sm text-gray-400">Special Note</p>
                      <p>{selectedMember.note}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Note Period: {selectedMember.noteStartDate} to {selectedMember.noteEndDate}
                      </p>
                      <p className="text-sm text-gray-400">Importance: {selectedMember.noteImportance}</p>
                    </div>
                  )}

                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      onClick={redirectToContract}
                      className="flex items-center gap-2 text-sm bg-[#3F74FF] text-white px-4 py-2 rounded-xl hover:bg-[#3F74FF]/90"
                    >
                      <FileText size={16} />
                      View Contract
                    </button>
                    <button
                      onClick={() => {
                        setIsViewDetailsModalOpen(false)
                        handleEditMember(selectedMember)
                      }}
                      className="bg-[#FF843E] text-sm text-white px-4 py-2 rounded-xl hover:bg-[#FF843E]/90"
                    >
                      Edit Member
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "relations" && (
                <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                  {/* Relations Tree Visualization */}
                  <div className="bg-[#161616] rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 text-center">Relationship Tree</h3>
                    <div className="flex flex-col items-center space-y-8">
                      {/* Central Member */}
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-lg border-2 border-blue-400 font-semibold">
                        {selectedMember.title}
                      </div>

                      {/* Connection Lines and Categories */}
                      <div className="relative w-full">
                        {/* Horizontal line */}
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-600"></div>

                        {/* Category sections */}
                        <div className="grid grid-cols-5 gap-4 pt-8">
                          {Object.entries(memberRelations[selectedMember.id] || {}).map(([category, relations]) => (
                            <div key={category} className="flex flex-col items-center space-y-4">
                              {/* Vertical line */}
                              <div className="w-0.5 h-8 bg-gray-600"></div>

                              {/* Category header */}
                              <div
                                className={`px-3 py-1 rounded-lg text-sm font-medium capitalize ${
                                  category === "family"
                                    ? "bg-yellow-600 text-yellow-100"
                                    : category === "friendship"
                                      ? "bg-green-600 text-green-100"
                                      : category === "relationship"
                                        ? "bg-red-600 text-red-100"
                                        : category === "work"
                                          ? "bg-blue-600 text-blue-100"
                                          : "bg-gray-600 text-gray-100"
                                }`}
                              >
                                {category}
                              </div>

                              {/* Relations in this category */}
                              <div className="space-y-2">
                                {relations.map((relation) => (
                                  <div
                                    key={relation.id}
                                    className="bg-[#2F2F2F] rounded-lg p-2 text-center min-w-[120px]"
                                  >
                                    <div className="text-white text-sm font-medium">{relation.name}</div>
                                    <div className="text-gray-400 text-xs">({relation.relation})</div>
                                  </div>
                                ))}
                                {relations.length === 0 && (
                                  <div className="text-gray-500 text-xs text-center">No relations</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Relations List */}
                  <div className="bg-[#161616] rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">All Relations</h3>
                    <div className="space-y-4">
                      {Object.entries(memberRelations[selectedMember.id] || {}).map(([category, relations]) => (
                        <div key={category}>
                          <h4 className="text-md font-medium text-gray-300 capitalize mb-2">{category}</h4>
                          <div className="space-y-2 ml-4">
                            {relations.length > 0 ? (
                              relations.map((relation) => (
                                <div
                                  key={relation.id}
                                  className="flex items-center justify-between bg-[#2F2F2F] rounded-lg p-3"
                                >
                                  <div>
                                    <span className="text-white font-medium">{relation.name}</span>
                                    <span className="text-gray-400 ml-2">- {relation.relation}</span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 text-sm">No {category} relations</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Appointment Calendar Modal */}
      {showAppointmentModal && selectedMemberForAppointments && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg text-white font-medium">{selectedMemberForAppointments.title}'s Appointments</h2>
                <button onClick={() => setShowAppointmentModal(false)} className="p-2 hover:bg-zinc-700 text-white rounded-lg">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <h3 className="text-sm font-medium text-gray-400">Upcoming Appointments</h3>
                {memberAppointments[selectedMemberForAppointments.id]?.length > 0 ? (
                  memberAppointments[selectedMemberForAppointments.id].map((appointment) => {
                    const appointmentType = appointmentTypes.find((type) => type.name === appointment.type)
                    const backgroundColor = appointmentType ? appointmentType.color : "bg-gray-700"

                    return (
                      <div
                        key={appointment.id}
                        className={`${backgroundColor} rounded-xl p-3 hover:opacity-90 transition-colors`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm text-white">{appointment.title}</p>
                            <div>
                              <p className="text-sm text-white/70">
                                {new Date(appointment.date).toLocaleString([], {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                              <p className="text-xs text-white/70">
                                {new Date(appointment.date).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}{" "}
                                -{" "}
                                {new Date(
                                  new Date(appointment.date).getTime() + (appointmentType?.duration || 30) * 60000,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-4 text-gray-400 bg-[#222222] rounded-xl">
                    No appointments scheduled
                  </div>
                )}
              </div>

              {/* Contingent Display */}
              <div className="flex items-center justify-between py-3 px-2 border-t border-gray-700 mb-4">
                <div className="text-sm text-gray-300">
                  Contingent ({currentBillingPeriod}): {memberContingent[selectedMemberForAppointments.id]?.used || 0} /{" "}
                  {memberContingent[selectedMemberForAppointments.id]?.total || 0}
                </div>
                <button
                  onClick={() => handleManageContingent(selectedMemberForAppointments.id)}
                  className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md text-sm"
                >
                  <Edit3 size={16} />
                  Manage
                </button>
              </div>

              {/* Remaining contingent display */}
              <div className="bg-[#222222] rounded-xl p-3 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {(memberContingent[selectedMemberForAppointments.id]?.total || 0) -
                      (memberContingent[selectedMemberForAppointments.id]?.used || 0)}
                  </div>
                  <div className="text-sm text-gray-400">Appointments Remaining</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contingent Management Modal */}
      {showContingentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg text-white font-medium">Manage Appointment Contingent</h2>
                <button onClick={() => setShowContingentModal(false)} className="p-2 hover:bg-zinc-700 text-white rounded-lg">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Billing Period: {currentBillingPeriod}
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-400 mb-1">Used Appointments</label>
                      <input
                        type="number"
                        min={0}
                        max={tempContingent.total}
                        value={tempContingent.used}
                        onChange={(e) =>
                          setTempContingent({ ...tempContingent, used: Number.parseInt(e.target.value) })
                        }
                        className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-gray-400 mb-1">Total Appointments</label>
                      <input
                        type="number"
                        min={tempContingent.used}
                        value={tempContingent.total}
                        onChange={(e) =>
                          setTempContingent({ ...tempContingent, total: Number.parseInt(e.target.value) })
                        }
                        className="w-full bg-[#222222] text-white rounded-xl px-4 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Remaining: {tempContingent.total - tempContingent.used} appointments
                  </p>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowContingentModal(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveContingent}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#181818] rounded-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex text-white justify-between items-center mb-6">
                <h2 className="text-lg font-medium">{selectedMember.title} - History & Changelog</h2>
                <button onClick={() => setShowHistoryModal(false)} className="p-2 hover:bg-zinc-700 rounded-lg">
                  <X size={16} />
                </button>
              </div>

              {/* History Tab Navigation */}
              <div className="flex border-b border-gray-700 mb-6 overflow-x-auto">
                {[
                  { id: "general", label: "General Changes" },
                  { id: "checkins", label: "Check-ins & Check-outs" },
                  { id: "appointments", label: "Past Appointments" },
                  { id: "finance", label: "Finance Transactions" },
                  { id: "contracts", label: "Contract Changes" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setHistoryTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                      historyTab === tab.id
                        ? "text-blue-400 border-b-2 border-blue-400"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* History Content */}
              <div className="space-y-4">
                {historyTab === "general" && (
                  <div>
                    <h3 className="text-md font-semibold text-white mb-4">General Changes</h3>
                    <div className="space-y-3">
                      {memberHistory[selectedMember.id]?.general?.map((item) => (
                        <div key={item.id} className="bg-[#222222] rounded-xl p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-white font-medium">{item.action}</p>
                              <p className="text-gray-400 text-sm mt-1">{item.details}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-400 text-sm">{item.date}</p>
                              <p className="text-gray-500 text-xs">by {item.user}</p>
                            </div>
                          </div>
                        </div>
                      )) || <p className="text-gray-400">No general changes recorded</p>}
                    </div>
                  </div>
                )}

                {historyTab === "checkins" && (
                  <div>
                    <h3 className="text-md font-semibold text-white mb-4">Check-ins & Check-outs History</h3>
                    <div className="space-y-3">
                      {memberHistory[selectedMember.id]?.checkins?.map((item) => (
                        <div key={item.id} className="bg-[#222222] rounded-xl p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-3 h-3 rounded-full ${item.type === "Check-in" ? "bg-green-500" : "bg-red-500"}`}
                              ></div>
                              <div>
                                <p className="text-white font-medium">{item.type}</p>
                                <p className="text-gray-400 text-sm">{item.location}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-400 text-sm">
                                {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )) || <p className="text-gray-400">No check-in/check-out history</p>}
                    </div>
                  </div>
                )}

                {historyTab === "appointments" && (
                  <div>
                    <h3 className="text-md font-semibold text-white mb-4">Past Appointments History</h3>
                    <div className="space-y-3">
                      {memberHistory[selectedMember.id]?.appointments?.map((item) => (
                        <div key={item.id} className="bg-[#222222] rounded-xl p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-white font-medium">{item.title}</p>
                              <p className="text-gray-400 text-sm">with {item.trainer}</p>
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                                  item.status === "completed"
                                    ? "bg-green-900 text-green-300"
                                    : "bg-yellow-900 text-yellow-300"
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-400 text-sm">
                                {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )) || <p className="text-gray-400">No past appointments</p>}
                    </div>
                  </div>
                )}

                {historyTab === "finance" && (
                  <div>
                    <h3 className="text-md font-semibold text-white mb-4">Finance Transactions History</h3>
                    <div className="space-y-3">
                      {memberHistory[selectedMember.id]?.finance?.map((item) => (
                        <div key={item.id} className="bg-[#222222] rounded-xl p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-white font-medium">{item.type}</p>
                              <p className="text-gray-400 text-sm">{item.description}</p>
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                                  item.status === "completed"
                                    ? "bg-green-900 text-green-300"
                                    : "bg-yellow-900 text-yellow-300"
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-green-400 font-semibold">{item.amount}</p>
                              <p className="text-gray-400 text-sm">{item.date}</p>
                            </div>
                          </div>
                        </div>
                      )) || <p className="text-gray-400">No financial transactions</p>}
                    </div>
                  </div>
                )}

                {historyTab === "contracts" && (
                  <div>
                    <h3 className="text-md font-semibold text-white mb-4">Contract Changes History</h3>
                    <div className="space-y-3">
                      {memberHistory[selectedMember.id]?.contracts?.map((item) => (
                        <div key={item.id} className="bg-[#222222] rounded-xl p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-white font-medium">{item.action}</p>
                              <p className="text-gray-400 text-sm mt-1">{item.details}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-400 text-sm">{item.date}</p>
                              <p className="text-gray-500 text-xs">by {item.user}</p>
                            </div>
                          </div>
                        </div>
                      )) || <p className="text-gray-400">No contract changes</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
