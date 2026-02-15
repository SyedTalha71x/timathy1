import { useState, useRef, useEffect } from "react"
import { Search, Calendar, Clock, CheckCircle, X, ArrowUp, ArrowDown, UserX } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import DatePickerField from "../../components/shared/DatePickerField"

export default function CheckIns() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")
  const [dateFrom, setDateFrom] = useState(new Date().toISOString().split('T')[0])
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0])
  const [checkInHistory, setCheckInHistory] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('time')
  const [sortDirection, setSortDirection] = useState('asc')
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [memberFilters, setMemberFilters] = useState([])
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const sortDropdownRef = useRef(null)
  const searchDropdownRef = useRef(null)
  const searchInputRef = useRef(null)


  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      id: 1,
      memberId: 1,
      memberName: "John Doe",
      appointmentType: "Personal Training",
      scheduledTime: "10:00 AM - 10:30 AM",
      date: new Date().toISOString().split('T')[0],
      isCheckedIn: false,
      isNoShow: false,
      duration: "60 min"
    },
    {
      id: 2,
      memberId: 2,
      memberName: "Jane Smith",
      appointmentType: "Group Class",
      scheduledTime: "11:30 AM - 12:30 PM",
      date: new Date().toISOString().split('T')[0],
      isCheckedIn: false,
      isNoShow: false,
      duration: "45 min"
    },
    {
      id: 3,
      memberId: 3,
      memberName: "Mike Johnson",
      appointmentType: "Consultation",
      scheduledTime: "02:00 PM - 3:00 PM",
      date: new Date().toISOString().split('T')[0],
      isCheckedIn: true,
      isNoShow: false,
      checkInTime: "01:55 PM",
      duration: "30 min"
    },
    {
      id: 4,
      memberId: 4,
      memberName: "Sarah Wilson",
      appointmentType: "Personal Training",
      scheduledTime: "09:00 AM - 10:00 AM",
      date: new Date().toISOString().split('T')[0],
      isCheckedIn: false,
      isNoShow: true,
      duration: "60 min"
    }
  ])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false)
      }
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        setShowSearchDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCheckIn = (appointmentId) => {
    const appointment = upcomingAppointments.find(app => app.id === appointmentId)
    if (!appointment) return

    const now = new Date()
    const checkInTime = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })

    setUpcomingAppointments(prev =>
      prev.map(app =>
        app.id === appointmentId
          ? { ...app, isCheckedIn: true, isNoShow: false, checkInTime }
          : app
      )
    )

    const historyEntry = {
      id: Date.now(),
      ...appointment,
      checkInTime,
      checkInDate: now.toISOString().split('T')[0]
    }
    setCheckInHistory(prev => [historyEntry, ...prev])
  }

  const handleUndoCheckIn = (appointmentId) => {
    setUpcomingAppointments(prev =>
      prev.map(app =>
        app.id === appointmentId
          ? { ...app, isCheckedIn: false, checkInTime: undefined }
          : app
      )
    )
  }

  const handleNoShow = (appointmentId) => {
    setUpcomingAppointments(prev =>
      prev.map(app =>
        app.id === appointmentId
          ? { ...app, isNoShow: true, isCheckedIn: false }
          : app
      )
    )
  }

  const handleUndoNoShow = (appointmentId) => {
    setUpcomingAppointments(prev =>
      prev.map(app =>
        app.id === appointmentId
          ? { ...app, isNoShow: false }
          : app
      )
    )
  }

  // Sort options
  const sortOptions = [
    { value: 'time', label: 'Time' },
    { value: 'name', label: 'Name' },
    { value: 'type', label: 'Type' }
  ]

  const handleSortOptionClick = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortDirection('asc')
    }
    setShowSortDropdown(false)
  }

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Time'

  const getInitials = (name) => {
    const parts = name.split(' ')
    return (parts[0]?.charAt(0) || '') + (parts[1]?.charAt(0) || '')
  }

  const getSortIcon = () => {
    return sortDirection === 'asc' 
      ? <ArrowUp size={14} className="text-content-primary" />
      : <ArrowDown size={14} className="text-content-primary" />
  }

  // Get unique members from appointments for search suggestions
  const getSearchSuggestions = () => {
    if (!searchQuery.trim()) return []
    const seen = new Set()
    return upcomingAppointments.filter((app) => {
      if (seen.has(app.memberId)) return false
      const isAlreadyFiltered = memberFilters.some(f => f.memberId === app.memberId)
      if (isAlreadyFiltered) return false
      const matches = app.memberName.toLowerCase().includes(searchQuery.toLowerCase())
      if (matches) seen.add(app.memberId)
      return matches
    }).slice(0, 6)
  }

  const handleSelectMember = (app) => {
    setMemberFilters([...memberFilters, {
      memberId: app.memberId,
      memberName: app.memberName,
    }])
    setSearchQuery("")
    setShowSearchDropdown(false)
    searchInputRef.current?.focus()
  }

  const handleRemoveFilter = (memberId) => {
    setMemberFilters(memberFilters.filter(f => f.memberId !== memberId))
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Backspace' && !searchQuery && memberFilters.length > 0) {
      setMemberFilters(memberFilters.slice(0, -1))
    } else if (e.key === 'Escape') {
      setShowSearchDropdown(false)
    }
  }

  const isDateInRange = (dateStr) => {
    const date = new Date(dateStr)
    const from = new Date(dateFrom)
    const to = new Date(dateTo)
    return date >= from && date <= to
  }

  const getFilteredAndSortedAppointments = () => {
    let filtered = upcomingAppointments.filter(app => {
      // If member filters are active, only show those members
      if (memberFilters.length > 0) {
        const filterIds = memberFilters.map(f => f.memberId)
        if (!filterIds.includes(app.memberId)) return false
      }
      const matchesDate = isDateInRange(app.date)
      const matchesStatus = filterStatus === 'all' ||
                           (filterStatus === 'checked' && app.isCheckedIn) ||
                           (filterStatus === 'pending' && !app.isCheckedIn && !app.isNoShow) ||
                           (filterStatus === 'noshow' && app.isNoShow)
      
      return matchesDate && matchesStatus
    })

    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'time':
          comparison = a.scheduledTime.localeCompare(b.scheduledTime)
          break
        case 'name':
          comparison = a.memberName.localeCompare(b.memberName)
          break
        case 'type':
          comparison = a.appointmentType.localeCompare(b.appointmentType)
          break
        default:
          comparison = 0
      }
      
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return filtered
  }

  const filteredUpcomingAppointments = getFilteredAndSortedAppointments()

  const filteredPastCheckIns = checkInHistory.filter(checkin => {
    if (memberFilters.length > 0) {
      const filterIds = memberFilters.map(f => f.memberId)
      return filterIds.includes(checkin.memberId)
    }
    return true
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getTodayStats = () => {
    const rangeAppointments = upcomingAppointments.filter(app => isDateInRange(app.date))
    const checkedIn = rangeAppointments.filter(app => app.isCheckedIn).length
    const noShowCount = rangeAppointments.filter(app => app.isNoShow).length
    const total = rangeAppointments.length
    const pending = total - checkedIn - noShowCount
    return { checkedIn, total, pending, noShowCount }
  }

  const stats = getTodayStats()

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "var(--color-surface-dark)",
            color: "var(--color-content-primary)",
          },
        }}
      />
      <div className="min-h-screen rounded-3xl bg-surface-base text-content-primary md:p-6 p-3 transition-all duration-500 ease-in-out flex-1">
        
        {/* Header */}
        <div className="flex flex-col gap-3 mb-5">
          {/* Top Row: Title */}
          <div className="flex items-center justify-between">
            <h1 className="text-content-primary oxanium_font text-xl md:text-2xl">Check-In</h1>
          </div>

          {/* Date Range Picker - Second Row on Mobile */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1.5 bg-surface-button rounded-lg border border-border flex-1 sm:flex-none">
              <span className={`text-[11px] sm:text-xs flex-1 ${dateFrom ? 'text-content-primary' : 'text-content-muted'}`}>
                {dateFrom ? new Date(dateFrom + 'T00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'From'}
              </span>
              <DatePickerField
                value={dateFrom}
                onChange={(val) => setDateFrom(val)}
                iconSize={12}
              />
            </div>
            <span className="text-content-faint text-xs">to</span>
            <div className="flex items-center gap-1.5 px-2 py-1.5 bg-surface-button rounded-lg border border-border flex-1 sm:flex-none">
              <span className={`text-[11px] sm:text-xs flex-1 ${dateTo ? 'text-content-primary' : 'text-content-muted'}`}>
                {dateTo ? new Date(dateTo + 'T00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'To'}
              </span>
              <DatePickerField
                value={dateTo}
                onChange={(val) => setDateTo(val)}
                iconSize={12}
              />
            </div>
          </div>
        </div>

        {/* Stats Cards - 2x2 on mobile, 4 cols on larger */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div className="bg-surface-card rounded-xl p-2.5 sm:p-3 border border-border">
            <p className="text-content-muted text-[10px] sm:text-xs">Total</p>
            <p className="text-base sm:text-xl font-bold text-content-primary">{stats.total}</p>
          </div>
          <div className="bg-surface-card rounded-xl p-2.5 sm:p-3 border border-border">
            <p className="text-content-muted text-[10px] sm:text-xs">Checked-In</p>
            <p className="text-base sm:text-xl font-bold text-content-primary">{stats.checkedIn}</p>
          </div>
          <div className="bg-surface-card rounded-xl p-2.5 sm:p-3 border border-border">
            <p className="text-content-muted text-[10px] sm:text-xs">Pending</p>
            <p className="text-base sm:text-xl font-bold text-content-primary">{stats.pending}</p>
          </div>
          <div className="bg-surface-card rounded-xl p-2.5 sm:p-3 border border-border">
            <p className="text-content-muted text-[10px] sm:text-xs">No Shows</p>
            <p className="text-base sm:text-xl font-bold text-content-primary">{stats.noShowCount}</p>
          </div>
        </div>

        {/* Search Bar with Inline Filter Chips */}
        <div className="mb-3" ref={searchDropdownRef}>
          <div className="relative">
            <div 
              className="bg-surface-card rounded-xl px-3 py-2 min-h-[42px] flex flex-wrap items-center gap-1.5 border border-border focus-within:border-primary transition-colors cursor-text"
              onClick={() => searchInputRef.current?.focus()}
            >
              <Search className="text-content-muted flex-shrink-0" size={14} />
              
              {/* Filter Chips */}
              {memberFilters.map((filter) => (
                <div 
                  key={filter.memberId}
                  className="flex items-center gap-1.5 bg-primary/20 border border-primary/40 rounded-lg px-2 py-1 text-sm"
                >
                  <div className="w-5 h-5 rounded bg-primary flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                    {getInitials(filter.memberName)}
                  </div>
                  <span className="text-content-primary text-xs whitespace-nowrap">{filter.memberName}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFilter(filter.memberId)
                    }}
                    className="p-0.5 hover:bg-primary/30 rounded transition-colors"
                  >
                    <X size={12} className="text-content-muted hover:text-content-primary" />
                  </button>
                </div>
              ))}
              
              {/* Search Input */}
              <input
                ref={searchInputRef}
                type="text"
                placeholder={memberFilters.length > 0 ? "Add more..." : "Search members..."}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSearchDropdown(true)
                }}
                onFocus={() => searchQuery && setShowSearchDropdown(true)}
                onKeyDown={handleSearchKeyDown}
                className="flex-1 min-w-[100px] bg-transparent outline-none text-xs sm:text-sm text-content-primary placeholder-content-faint"
              />
              
              {/* Clear All Button */}
              {memberFilters.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setMemberFilters([])
                  }}
                  className="p-1 hover:bg-surface-button rounded-lg transition-colors flex-shrink-0"
                  title="Clear all filters"
                >
                  <X size={14} className="text-content-muted hover:text-content-primary" />
                </button>
              )}
            </div>
            
            {/* Autocomplete Dropdown */}
            {showSearchDropdown && searchQuery.trim() && getSearchSuggestions().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-surface-hover border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                {getSearchSuggestions().map((app) => (
                  <button
                    key={app.memberId}
                    onClick={() => handleSelectMember(app)}
                    className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-surface-button transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-semibold">
                      {getInitials(app.memberName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-content-primary truncate">{app.memberName}</p>
                      <p className="text-xs text-content-faint truncate">{app.appointmentType}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {/* No results message */}
            {showSearchDropdown && searchQuery.trim() && getSearchSuggestions().length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-surface-hover border border-border rounded-xl shadow-lg z-50 p-3">
                <p className="text-sm text-content-faint text-center">No members found</p>
              </div>
            )}
          </div>
        </div>

        {/* Filter Pills + Sort */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap flex-1 min-w-0">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                filterStatus === 'all'
                  ? "bg-primary text-white"
                  : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('checked')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                filterStatus === 'checked'
                  ? "bg-primary text-white"
                  : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"
              }`}
            >
              Checked-In
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                filterStatus === 'pending'
                  ? "bg-primary text-white"
                  : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('noshow')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                filterStatus === 'noshow'
                  ? "bg-primary text-white"
                  : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"
              }`}
            >
              No Shows
            </button>
          </div>

          {/* Sort Button */}
          <div className="relative flex-shrink-0" ref={sortDropdownRef}>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="px-3 py-1.5 bg-surface-button text-content-secondary rounded-lg text-xs hover:bg-surface-button-hover transition-colors flex items-center gap-2"
            >
              {getSortIcon()}
              <span>{currentSortLabel}</span>
            </button>

            {showSortDropdown && (
              <div className="absolute top-full right-0 mt-1 bg-surface-hover border border-border rounded-lg shadow-lg z-50 min-w-[120px]">
                <div className="py-1">
                  <div className="px-3 py-1.5 text-[10px] text-content-faint font-medium border-b border-border">Sort by</div>
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSortOptionClick(option.value)
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-surface-button transition-colors flex items-center justify-between ${
                        sortBy === option.value ? 'text-content-primary bg-surface-hover/50' : 'text-content-secondary'
                      }`}
                    >
                      <span>{option.label}</span>
                      {sortBy === option.value && (
                        <span className="text-content-muted">
                          {sortDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-4">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex-1 sm:flex-none px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === "upcoming"
                ? "text-content-primary border-b-2 border-primary"
                : "text-content-muted hover:text-content-primary"
            }`}
          >
            Today ({filteredUpcomingAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`flex-1 sm:flex-none px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === "past"
                ? "text-content-primary border-b-2 border-primary"
                : "text-content-muted hover:text-content-primary"
            }`}
          >
            History ({filteredPastCheckIns.length})
          </button>
        </div>

        {/* Content - Cards */}
        <div className="space-y-2">
          {activeTab === "upcoming" ? (
            filteredUpcomingAppointments.length > 0 ? (
              filteredUpcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className={`bg-surface-card rounded-xl p-3 border transition-all ${
                    appointment.isNoShow 
                      ? 'border-accent-red/30 bg-accent-red/5' 
                      : appointment.isCheckedIn 
                        ? 'border-primary/30 bg-primary/5' 
                        : 'border-border hover:border-border'
                  }`}
                >
                  {/* Mobile: Vertical layout, Desktop: Horizontal */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Top row on mobile: Avatar + Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {getInitials(appointment.memberName)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <h3 className="text-content-primary font-medium text-xs sm:text-sm truncate">{appointment.memberName}</h3>
                          <span className="text-content-faint text-[10px] hidden xs:inline">•</span>
                          <span className="text-content-muted text-[10px] sm:text-xs truncate hidden xs:inline">{appointment.appointmentType}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-content-muted text-[10px] sm:text-xs">{appointment.scheduledTime}</span>
                          {appointment.isCheckedIn && appointment.checkInTime && (
                            <>
                              <span className="text-content-faint text-[10px]">•</span>
                              <span className="text-primary text-[10px] sm:text-xs">Checked-In {appointment.checkInTime}</span>
                            </>
                          )}
                        </div>
                        {/* Show type below on very small screens */}
                        <span className="text-content-muted text-[10px] xs:hidden">{appointment.appointmentType}</span>
                      </div>
                    </div>

                    {/* Actions - Full width on mobile */}
                    <div className="flex items-center gap-2 justify-end sm:flex-shrink-0">
                      {appointment.isNoShow ? (
                        <>
                          <span className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 bg-accent-red/20 text-accent-red rounded-lg text-[10px] sm:text-xs font-medium">
                            <UserX size={10} className="sm:w-3 sm:h-3" />
                            No Show
                          </span>
                          <button
                            onClick={() => handleUndoNoShow(appointment.id)}
                            className="p-1.5 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"
                            title="Undo"
                          >
                            <X size={12} className="sm:w-3.5 sm:h-3.5" />
                          </button>
                        </>
                      ) : appointment.isCheckedIn ? (
                        <>
                          <span className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 bg-primary/20 text-primary rounded-lg text-[10px] sm:text-xs font-medium">
                            <CheckCircle size={10} className="sm:w-3 sm:h-3" />
                            Checked-In
                          </span>
                          <button
                            onClick={() => handleUndoCheckIn(appointment.id)}
                            className="p-1.5 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"
                            title="Undo"
                          >
                            <X size={12} className="sm:w-3.5 sm:h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleNoShow(appointment.id)}
                            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-surface-button hover:bg-accent-red/20 text-content-secondary hover:text-accent-red rounded-lg text-[10px] sm:text-xs transition-colors flex items-center gap-1"
                          >
                            <UserX size={12} className="sm:w-3 sm:h-3" />
                            <span className="hidden sm:inline">No Show</span>
                          </button>
                          <button
                            onClick={() => handleCheckIn(appointment.id)}
                            className="px-2.5 py-1.5 sm:px-3 bg-primary hover:bg-primary-hover text-white rounded-lg text-[10px] sm:text-xs transition-colors flex items-center gap-1"
                          >
                            <CheckCircle size={10} className="sm:w-3 sm:h-3" />
                            <span>Check-In</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <Calendar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-content-faint mb-3" strokeWidth={1} />
                <h3 className="text-base sm:text-lg font-medium text-content-secondary mb-2">No appointments found</h3>
                <p className="text-content-faint text-xs sm:text-sm">
                  {searchQuery || filterStatus !== 'all' 
                    ? "Try adjusting your search or filters" 
                    : "No appointments scheduled for this period"}
                </p>
              </div>
            )
          ) : (
            filteredPastCheckIns.length > 0 ? (
              filteredPastCheckIns.map((checkin) => (
                <div
                  key={checkin.id}
                  className="bg-surface-card rounded-xl p-3 border border-border"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {getInitials(checkin.memberName)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <h3 className="text-content-primary font-medium text-xs sm:text-sm truncate">{checkin.memberName}</h3>
                          <span className="text-content-faint text-[10px] hidden xs:inline">•</span>
                          <span className="text-content-muted text-[10px] sm:text-xs truncate hidden xs:inline">{checkin.appointmentType}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                          <span className="text-content-muted text-[10px] sm:text-xs">{formatDate(checkin.checkInDate)}</span>
                          <span className="text-content-faint text-[10px]">•</span>
                          <span className="text-content-muted text-[10px] sm:text-xs">{checkin.scheduledTime}</span>
                          <span className="text-content-faint text-[10px]">•</span>
                          <span className="text-primary text-[10px] sm:text-xs">Checked-In {checkin.checkInTime}</span>
                        </div>
                        <span className="text-content-muted text-[10px] xs:hidden">{checkin.appointmentType}</span>
                      </div>
                    </div>

                    <span className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 bg-primary/20 text-primary rounded-lg text-[10px] sm:text-xs font-medium self-end sm:self-auto flex-shrink-0">
                      <CheckCircle size={10} className="sm:w-3 sm:h-3" />
                      Completed
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <Clock className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-content-faint mb-3" strokeWidth={1} />
                <h3 className="text-base sm:text-lg font-medium text-content-secondary mb-2">No check-in history</h3>
                <p className="text-content-faint text-xs sm:text-sm">
                  {searchQuery 
                    ? "Try adjusting your search" 
                    : "Check-in history will appear here"}
                </p>
              </div>
            )
          )}
        </div>
      </div>

    </>
  )
}
