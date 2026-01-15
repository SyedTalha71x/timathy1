/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Clock, Calendar, CalendarOff, CalendarCheck } from 'lucide-react'

const PostSchedulerModal = ({
  isOpen,
  onClose,
  onSave,
  initialSchedule = null,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  // Schedule type: 'immediate' or 'scheduled'
  const [scheduleType, setScheduleType] = useState('immediate')
  
  // Start date/time
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')
  
  // End date settings
  const [hasEndDate, setHasEndDate] = useState(false)
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialSchedule) {
        setScheduleType(initialSchedule.type || 'immediate')
        setStartDate(initialSchedule.startDate || '')
        setStartTime(initialSchedule.startTime || '')
        setHasEndDate(initialSchedule.hasEndDate || false)
        setEndDate(initialSchedule.endDate || '')
        setEndTime(initialSchedule.endTime || '')
        
        // Set calendar view to start date if it exists
        if (initialSchedule.startDate) {
          const dateParts = initialSchedule.startDate.split('-')
          if (dateParts.length === 3) {
            setCurrentDate(new Date(
              parseInt(dateParts[0]),
              parseInt(dateParts[1]) - 1,
              parseInt(dateParts[2])
            ))
          }
        }
      } else {
        // Default values
        setScheduleType('immediate')
        setStartDate('')
        setStartTime('')
        setHasEndDate(false)
        setEndDate('')
        setEndTime('')
        setCurrentDate(new Date())
      }
    }
  }, [isOpen, initialSchedule])

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const getDayClassName = (day, isForEndDate = false) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const today = new Date().toISOString().split('T')[0]
    const isPast = dateStr < today
    const isPastForEnd = isForEndDate ? dateStr <= today : isPast
    
    // Check selections
    const isStartSelected = !isForEndDate && startDate === dateStr
    const isEndSelected = isForEndDate && endDate === dateStr
    const isToday = dateStr === today
    
    // Check if this date is in the range between start and end (only for scheduled view)
    const isInRange = !isForEndDate && scheduleType === 'scheduled' && startDate && endDate && dateStr > startDate && dateStr < endDate
    
    // For end date calendar, check if before start date
    const isBeforeStart = isForEndDate && startDate && dateStr < startDate

    let className = "w-8 h-8 text-sm rounded-lg flex items-center justify-center transition-all duration-200 "

    if (isPastForEnd || isBeforeStart) {
      className += "text-gray-600 cursor-not-allowed"
    } else if (isStartSelected || isEndSelected) {
      className += "bg-orange-500 text-white font-medium"
    } else if (isInRange) {
      className += "bg-orange-500/20 text-orange-300"
    } else if (isToday) {
      className += "bg-blue-500/30 text-blue-400 font-medium hover:bg-blue-500/40"
    } else if (!isForEndDate && endDate === dateStr) {
      // Show end date marker in start calendar
      className += "bg-gray-500/30 text-gray-400 font-medium"
    } else {
      className += "text-gray-300 hover:bg-[#2F2F2F]"
    }

    return className
  }

  const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        options.push(timeString)
      }
    }
    return options
  }

  const formatTime = (time) => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const formattedHour = hour % 12 || 12
    return `${formattedHour}:${minutes} ${ampm}`
  }

  const handleDateClick = (day, isForEndDate = false) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const today = new Date().toISOString().split('T')[0]
    
    if (isForEndDate) {
      // Don't allow past dates or dates before start
      if (dateStr <= today) return
      if (startDate && dateStr < startDate) return
      setEndDate(dateStr)
    } else {
      // Don't allow past dates for start
      if (dateStr < today) return
      setStartDate(dateStr)
      // If end date is before new start date, clear it
      if (endDate && dateStr > endDate) {
        setEndDate('')
        setEndTime('')
      }
    }
  }

  const handleSave = () => {
    // Bei immediate posts kein End Date erlaubt
    const effectiveHasEndDate = scheduleType === 'scheduled' ? hasEndDate : false
    const result = {
      type: scheduleType,
      startDate: scheduleType === 'scheduled' ? startDate : '',
      startTime: scheduleType === 'scheduled' ? startTime : '',
      hasEndDate: effectiveHasEndDate,
      endDate: effectiveHasEndDate ? endDate : '',
      endTime: effectiveHasEndDate ? endTime : '',
    }
    onSave(result)
    onClose()
  }

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  // Render calendar component
  const renderCalendar = (isForEndDate = false) => (
    <div className="bg-[#101010] rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
          className="text-gray-400 hover:text-white p-1.5 hover:bg-[#2F2F2F] rounded-lg transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-white font-medium text-sm">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </span>
        <button
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
          className="text-gray-400 hover:text-white p-1.5 hover:bg-[#2F2F2F] rounded-lg transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, idx) => (
          <div key={idx} className="text-center text-gray-500 text-xs font-medium py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="w-8 h-8"></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1
          const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
          const today = new Date().toISOString().split('T')[0]
          const isPast = isForEndDate ? dateStr <= today : dateStr < today
          const isBeforeStart = isForEndDate && startDate && dateStr < startDate
          
          return (
            <button
              key={day}
              onClick={() => handleDateClick(day, isForEndDate)}
              disabled={isPast || isBeforeStart}
              className={getDayClassName(day, isForEndDate)}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start md:items-center justify-center z-[60] p-2 md:p-4 pt-8 md:pt-4">
      <div className="bg-[#181818] rounded-xl shadow-lg w-full max-w-md max-h-[95vh] md:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 md:p-6 pb-4 md:pb-5 flex-shrink-0 border-b border-gray-700">
          <h2 className="text-white text-lg font-semibold">Schedule Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 pt-4">
          {/* Schedule Type Selection */}
          <div className="mb-5">
            <label className="text-sm text-gray-200 mb-3 block">Publish</label>
            <div className="flex gap-2">
              <button
                onClick={() => setScheduleType('immediate')}
                className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  scheduleType === 'immediate'
                    ? 'bg-orange-500 text-white'
                    : 'bg-[#101010] text-gray-300 hover:bg-[#1a1a1a]'
                }`}
              >
                Immediately
              </button>
              <button
                onClick={() => setScheduleType('scheduled')}
                className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  scheduleType === 'scheduled'
                    ? 'bg-orange-500 text-white'
                    : 'bg-[#101010] text-gray-300 hover:bg-[#1a1a1a]'
                }`}
              >
                Schedule
              </button>
            </div>
          </div>

          {/* Scheduled Date/Time Section */}
          {scheduleType === 'scheduled' && (
            <>
              {/* Start Date Section */}
              <div className="mb-5">
                <label className="text-sm text-gray-200 flex items-center gap-2 mb-3">
                  <CalendarCheck size={16} className="text-orange-400" />
                  Start Date
                  {startDate && (
                    <span className="text-xs text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded-full ml-auto">
                      {formatDisplayDate(startDate)}
                    </span>
                  )}
                </label>
                {renderCalendar(false)}
                
                {/* Start Time */}
                <div className="mt-3">
                  <label className="text-sm text-gray-200 flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-gray-400" />
                    Start Time
                  </label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-[#101010] text-sm rounded-xl px-4 py-2.5 text-white outline-none border border-transparent focus:border-orange-500 transition-colors"
                  >
                    <option value="">Select time</option>
                    {generateTimeOptions().map((time) => (
                      <option key={time} value={time}>
                        {formatTime(time)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* End Date Toggle */}
              <div className="border-t border-gray-700 pt-4">
                <label className="flex items-center justify-between cursor-pointer mb-3">
                  <span className="text-sm text-gray-200 flex items-center gap-2">
                    <CalendarOff size={16} className="text-gray-400" />
                    Set End Date (Auto-deactivate)
                  </span>
                  <button
                    onClick={() => {
                      setHasEndDate(!hasEndDate)
                      if (hasEndDate) {
                        setEndDate('')
                        setEndTime('')
                      }
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      hasEndDate ? 'bg-orange-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        hasEndDate ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Post will automatically become inactive after this date
                </p>

                {/* End Date Calendar */}
                {hasEndDate && (
                  <div className="space-y-3">
                    <label className="text-sm text-gray-200 flex items-center gap-2">
                      <CalendarOff size={16} className="text-gray-400" />
                      End Date
                      {endDate && (
                        <span className="text-xs text-gray-400 bg-gray-500/20 px-2 py-0.5 rounded-full ml-auto">
                          {formatDisplayDate(endDate)}
                        </span>
                      )}
                    </label>
                    {renderCalendar(true)}
                    
                    {/* End Time */}
                    <div>
                      <label className="text-sm text-gray-200 flex items-center gap-2 mb-2">
                        <Clock size={16} className="text-gray-400" />
                        End Time
                      </label>
                      <select
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full bg-[#101010] text-sm rounded-xl px-4 py-2.5 text-white outline-none border border-transparent focus:border-orange-500 transition-colors"
                      >
                        <option value="">Select time</option>
                        {generateTimeOptions().map((time) => (
                          <option key={time} value={time}>
                            {formatTime(time)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Immediate posting info */}
          {scheduleType === 'immediate' && (
            <div className="bg-[#101010] rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <Calendar size={20} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Post Immediately</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Your post will be published as soon as you save it.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Schedule Summary - nur für scheduled posts */}
          {scheduleType === 'scheduled' && startDate && (
            <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
              <p className="text-orange-400 text-xs font-medium mb-2">Schedule Summary</p>
              <div className="text-sm text-gray-300 space-y-1">
                <div className="flex items-center gap-2">
                  <CalendarCheck size={14} className="text-orange-400" />
                  <span>Starts: {formatDisplayDate(startDate)} {startTime && `at ${formatTime(startTime)}`}</span>
                </div>
                {hasEndDate && endDate && (
                  <div className="flex items-center gap-2">
                    <CalendarOff size={14} className="text-gray-400" />
                    <span>Ends: {formatDisplayDate(endDate)} {endTime && `at ${formatTime(endTime)}`}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex-shrink-0 p-4 md:p-6 pt-4 border-t border-gray-700 bg-[#181818] rounded-b-xl">
          <div className="flex gap-2 md:gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#2F2F2F] text-sm text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={scheduleType === 'scheduled' && !startDate}
              className="px-4 py-2 bg-orange-500 text-sm text-white rounded-xl hover:bg-orange-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Apply Schedule
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2F2F2F;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #555;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #777;
        }
      `}</style>
    </div>
  )
}

export default PostSchedulerModal
