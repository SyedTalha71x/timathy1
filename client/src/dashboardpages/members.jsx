/* eslint-disable react/no-unescaped-entities */
"use client"

/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react"
import { X, Search, ChevronDown, Cake, Eye, FileText, Info, AlertTriangle, Calendar, Plus, Minus } from "lucide-react"
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
  const [sortBy, setSortBy] = useState("alphabetical") // "alphabetical" or "expiring"
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const [activeNoteId, setActiveNoteId] = useState(null)

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
      { id: 1, title: "Strength Training", date: "2025-04-20", time: "10:00 - 11:00" },
      { id: 2, title: "Cardio Session", date: "2025-04-22", time: "14:00 - 15:00" },
    ],
    2: [{ id: 3, title: "Yoga Class", date: "2025-04-21", time: "09:00 - 10:30" }],
  })

  const [memberCapacity, setMemberCapacity] = useState({
    1: { total: 10, used: 2 },
    2: { total: 8, used: 1 },
  })

  const [isAppointmentsModalOpen, setIsAppointmentsModalOpen] = useState(false)
  const [selectedMemberForAppointments, setSelectedMemberForAppointments] = useState(null)

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

    // Add event listener when popover is open
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

    // Sort members
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
    // In a real app, you would handle file upload here
    toast.success("Avatar update functionality would be implemented here")
  }

  const handleViewAppointments = (member) => {
    setSelectedMemberForAppointments(member)
    setIsAppointmentsModalOpen(true)
  }

  const increaseCapacity = (memberId) => {
    setMemberCapacity((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        total: prev[memberId].total + 1,
      },
    }))
    toast.success("Appointment capacity increased")
  }

  const decreaseCapacity = (memberId) => {
    if (memberCapacity[memberId].total > memberCapacity[memberId].used) {
      setMemberCapacity((prev) => ({
        ...prev,
        [memberId]: {
          ...prev[memberId],
          total: prev[memberId].total - 1,
        },
      }))
      toast.success("Appointment capacity decreased")
    } else {
      toast.error("Cannot decrease capacity below used appointments")
    }
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
                          // Handle file selection logic here
                          if (e.target.files && e.target.files[0]) {
                            // In a real app, you would handle the file upload
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
                    {/* Special note icon in top left corner */}
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
                              {/* Header section with icon and title */}
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

                              {/* Note content */}
                              <div className="p-3">
                                <p className="text-white text-sm leading-relaxed">{member.note}</p>

                                {/* Date validity section */}
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
                      <div className="flex items-center justify-center sm:justify-end gap-3 lg:flex-row md:flex-row flex-col mt-4 sm:mt-0 w-full sm:w-auto">
                        
                     
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

      {isViewDetailsModalOpen && selectedMember && (
        <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-2xl my-8 relative">
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
            </div>
          </div>
        </div>
      )}
      {isAppointmentsModalOpen && selectedMemberForAppointments && (
        <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
          <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md my-8 relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white open_sans_font_700 text-lg font-semibold">
                  {selectedMemberForAppointments.title}'s Appointments
                </h2>
                <button
                  onClick={() => {
                    setIsAppointmentsModalOpen(false)
                    setSelectedMemberForAppointments(null)
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} className="cursor-pointer" />
                </button>
              </div>

              <div className="space-y-4 text-white">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">
                    Appointment Capacity: {memberCapacity[selectedMemberForAppointments.id]?.used || 0}/
                    {memberCapacity[selectedMemberForAppointments.id]?.total || 0}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseCapacity(selectedMemberForAppointments.id)}
                      className="bg-gray-800 hover:bg-gray-700 p-1 rounded"
                      title="Decrease capacity"
                    >
                      <Minus size={16} />
                    </button>
                    <button
                      onClick={() => increaseCapacity(selectedMemberForAppointments.id)}
                      className="bg-gray-800 hover:bg-gray-700 p-1 rounded"
                      title="Increase capacity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {memberAppointments[selectedMemberForAppointments.id]?.length > 0 ? (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {memberAppointments[selectedMemberForAppointments.id].map((appointment) => (
                      <div key={appointment.id} className="bg-[#161616] rounded-xl p-4">
                        <h3 className="font-medium">{appointment.title}</h3>
                        <div className="flex justify-between mt-2 text-sm text-gray-400">
                          <p>{appointment.date}</p>
                          <p>{appointment.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 py-8">No upcoming appointments</p>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                  <p className="text-sm">
                    <span className="text-gray-400">Used:</span>{" "}
                    {memberCapacity[selectedMemberForAppointments.id]?.used || 0}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-400">Available:</span>{" "}
                    {(memberCapacity[selectedMemberForAppointments.id]?.total || 0) -
                      (memberCapacity[selectedMemberForAppointments.id]?.used || 0)}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-400">Total:</span>{" "}
                    {memberCapacity[selectedMemberForAppointments.id]?.total || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
