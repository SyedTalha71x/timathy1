/* eslint-disable react-hooks/exhaustive-deps */
"use client";

/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import {
  MoreHorizontal,
  X,
  Clock,
  Info,
  Search,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import Avatar from "../../public/avatar.png";
import toast, { Toaster } from "react-hot-toast";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TrialPlanningModal from "../components/add-trial";
import AddAppointmentModal from "../components/add-appointment-modal";
import SelectedAppointmentModal from "../components/selected-appointment-modal";

function Calendar({
  appointments,
  onEventClick,
  onDateSelect,
  searchQuery,
  selectedDate,
  setAppointments,
}) {
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const calendarRef = useRef(null);
  const [isNotifyMemberOpen, setIsNotifyMemberOpen] = useState(false);
  const [notifyAction, setNotifyAction] = useState("change");
  const [eventInfo, setEventInfo] = useState(null);
  const [isTypeSelectionOpen, setIsTypeSelectionOpen] = useState(false);
  const [selectedSlotInfo, setSelectedSlotInfo] = useState(null);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [freeAppointments, setFreeAppointments] = useState([]);

  // Sample appointment types - you can replace this with your actual data
  const appointmentTypes = [
    { name: "Regular Training", duration: 60, color: "bg-blue-500" },
    { name: "Consultation", duration: 30, color: "bg-green-500" },
    { name: "Assessment", duration: 45, color: "bg-purple-500" },
  ];

  useEffect(() => {
    if (selectedDate && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(selectedDate);

      const currentView = calendarApi.view.type;
      if (currentView.includes("timeGrid")) {
        calendarApi.changeView("timeGridDay", selectedDate);
      } else {
        calendarApi.gotoDate(selectedDate);
      }
    }
  }, [selectedDate]);

  const handleTrialSubmit = (trialData) => {
    const newTrial = {
      id: appointments.length + 1,
      ...trialData,
      status: "pending",
      isTrial: true,
    };
    setAppointments([...appointments, newTrial]);
    toast.success("Trial training booked successfully");
    setIsTrialModalOpen(false);
  };

  const handleAppointmentSubmit = (appointmentData) => {
    const newAppointment = {
      id: appointments.length + 1,
      ...appointmentData,
      status: "scheduled",
    };
    setAppointments([...appointments, newAppointment]);
    toast.success("Appointment booked successfully");
    setIsAppointmentModalOpen(false);
  };

  const handleEventDrop = (info) => {
    console.log("Event dropped:", info);
    if (confirm("Are you sure you want to move this appointment?")) {
      // Update the appointment date and time
      const updatedAppointments = appointments.map((appointment) => {
        if (appointment.id === parseInt(info.event.id)) {
          return {
            ...appointment,
            date: `${info.event.start.toLocaleDateString("en-US", {
              weekday: "short",
            })} | ${formatDate(info.event.start)}`,
            startTime: info.event.start.toTimeString().split(" ")[0],
            endTime: info.event.end.toTimeString().split(" ")[0],
            time: `${info.event.start.toTimeString().split(" ")[0]} - ${
              info.event.end.toTimeString().split(" ")[0]
            }`,
          };
        }
        return appointment;
      });

      // Update the appointments state
      setAppointments(updatedAppointments);

      // Set the event info to be used in the notify modal
      setEventInfo(info);

      // Open the notify modal
      setIsNotifyMemberOpen(true);
    } else {
      // Revert the event if the user cancels
      info.revert();
    }
  };

  const handleDateSelect = (selectInfo) => {
    setSelectedSlotInfo(selectInfo);
    setIsTypeSelectionOpen(true);
  };

  const handleTypeSelection = (type) => {
    setIsTypeSelectionOpen(false);
    if (type === "trial") {
      setIsTrialModalOpen(true);
    } else if (type === "appointment") {
      setIsAppointmentModalOpen(true);
    } else if (selectedSlotInfo && onDateSelect) {
      onDateSelect({ ...selectedSlotInfo, eventType: type });
    }
  };

  const handleNotifyMember = (shouldNotify) => {
    setIsNotifyMemberOpen(false);
    if (shouldNotify) {
      console.log("Notify member about the new time:", eventInfo.event.start);
      toast.success("Member notified successfully!");
      const updatedAppointments = appointments.map((appointment) => {
        if (appointment.id === eventInfo.event.id) {
          return {
            ...appointment,
            date: eventInfo.event.start.toISOString().split("T")[0],
            startTime: eventInfo.event.start.toTimeString().split(" ")[0],
            endTime: eventInfo.event.end.toTimeString().split(" ")[0],
          };
        }
        return appointment;
      });
      setAppointments(updatedAppointments);
    }
  };

  const calendarEvents = appointments
    .filter((appointment) => {
      // Filter by search query
      const nameMatch = appointment.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Filter by selected date
      let dateMatch = true;
      if (selectedDate) {
        const [_, datePart] = appointment.date.split("|");
        const appointmentDate = datePart.trim(); // Format: dd-mm-yyyy
        const formattedSelectedDate = formatDate(new Date(selectedDate));
        dateMatch = appointmentDate === formattedSelectedDate;
      }

      return nameMatch && dateMatch;
    })
    .map((appointment) => {
      const [_, datePart] = appointment.date.split("|");
      const [day, month, year] = datePart.trim().split("-");
      const dateStr = `${year}-${month}-${day}`; // Format: yyyy-mm-dd for FullCalendar

      return {
        id: appointment.id,
        title: appointment.name,
        start: `${dateStr}T${appointment.startTime}`,
        end: `${dateStr}T${appointment.endTime}`,
        backgroundColor: appointment.color.split("bg-[")[1].slice(0, -1),
        borderColor: appointment.color.split("bg-[")[1].slice(0, -1),
        extendedProps: {
          type: appointment.type,
        },
      };
    });

  return (
    <>
      <div className="h-full w-full">
        <div
          className="max-w-7xl overflow-x-auto"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="min-w-[768px]">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} 
              initialView="timeGridWeek"
              initialDate={selectedDate || "2025-02-03"}
              headerToolbar={{
                left: "prev,next",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={calendarEvents}
              height="auto"
              selectable={true}
              editable={true} 
              eventResizable={false}
              eventDrop={handleEventDrop} 
              slotMinTime="08:00:00"
              slotMaxTime="19:00:00"
              allDaySlot={false}
              nowIndicator={true}
              slotDuration="01:00:00"
              firstDay={1}
              eventClick={onEventClick}
              select={handleDateSelect}
              eventContent={(eventInfo) => (
                <div className="p-1 h-full overflow-hidden">
                  <div className="font-semibold text-xs sm:text-sm truncate">
                    {eventInfo.event.title}
                  </div>
                  <div className="text-xs opacity-90 truncate">
                    {eventInfo.event.extendedProps.type}
                  </div>
                  <div className="text-xs mt-1">{eventInfo.timeText}</div>
                </div>
              )}
            />
          </div>
        </div>
      </div>

      <TrialPlanningModal
        isOpen={isTrialModalOpen}
        onClose={() => setIsTrialModalOpen(false)}
        freeAppointments={freeAppointments}
        onSubmit={handleTrialSubmit}
        selectedDate={selectedSlotInfo?.start}
      />

      <AddAppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        appointmentTypes={appointmentTypes}
        onSubmit={handleAppointmentSubmit}
        setIsNotifyMemberOpen={setIsNotifyMemberOpen}
        setNotifyAction={setNotifyAction}
        selectedDate={selectedSlotInfo?.start}
      />

      {/* Type Selection Modal */}
      {isTypeSelectionOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
          onClick={() => setIsTypeSelectionOpen(false)}
        >
          <div
            className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">
                Select Event Type
              </h2>
              <button
                onClick={() => setIsTypeSelectionOpen(false)}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <button
                onClick={() => handleTypeSelection("trial")}
                className="w-full px-5 py-3 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 cursor-pointer transition-colors"
              >
                Trial Planning
              </button>
              <button
                onClick={() => handleTypeSelection("appointment")}
                className="w-full px-5 py-3 bg-[#FF843E] text-sm font-medium text-white rounded-xl hover:bg-orange-700 cursor-pointer transition-colors"
              >
                Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notify Member Modal */}
      {isNotifyMemberOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
          onClick={() => setIsNotifyMemberOpen(false)}
        >
          <div
            className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">
                Notify Member
              </h2>
              <button
                onClick={() => setIsNotifyMemberOpen(false)}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-white text-sm">
                Do you want to notify the member about this{" "}
                {notifyAction === "change"
                  ? "change"
                  : notifyAction === "cancel"
                  ? "cancellation"
                  : "booking"}
                ?
              </p>
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
              <button
                onClick={() => handleNotifyMember(true)}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
              >
                Yes, Notify Member
              </button>
              <button
                onClick={() => handleNotifyMember(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-800 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                No, Don't Notify
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster position="top-right" autoClose={3000} />
      <style>{`
        .overflow-x-auto {
          -webkit-overflow-scrolling: touch;
          overflow-x: auto;
          overflow-y: hidden;
          margin-bottom: 12px;
        }

        .overflow-x-auto::-webkit-scrollbar {
          -webkit-appearance: none;
          height: 7px;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb {
          border-radius: 4px;
          background-color: rgba(255, 255, 255, .2);
        }

        .overflow-x-auto::-webkit-scrollbar-track {
          background-color: rgba(0, 0, 0, .3);
          border-radius: 4px;
        }

        .fc {
          background-color: transparent !important;
          color: white !important;
          font-size: 0.875rem !important;
        }
        .fc-theme-standard td, 
        .fc-theme-standard th {
          border-color: #333 !important;
        }
        .fc-theme-standard .fc-scrollgrid {
          border-color: #333 !important;
        }
        .fc-timegrid-slot {
          height: 48px !important;
        }
        @media (max-width: 640px) {
          .fc-toolbar {
            flex-direction: column !important;
            gap: 0.5rem !important;
          }
          .fc-toolbar-title {
            font-size: 0.875rem !important;
          }
          .fc-button {
            padding: 0.25rem 0.5rem !important;
            font-size: 0.75rem !important;
          }
          .fc-header-toolbar {
            margin-bottom: 0.5rem !important;
          }
          .fc-event {
            min-height: 50px !important;
          }
        }
        .fc-day-today {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }
        .fc-button-primary {
          background-color: #333 !important;
          border-color: #444 !important;
          color: white !important;
        }
        .fc-button-primary:hover {
          background-color: #444 !important;
        }
        .fc-button-active {
          background-color: #555 !important;
        }
        .fc-timegrid-slot {
          background-color: transparent !important;
        }
        .fc-timegrid-slot-label {
          color: #9CA3AF !important;
          font-size: 0.75rem !important;
        }
        .fc-col-header-cell {
          background-color: transparent !important;
        }
        .fc-toolbar-title {
          color: white !important;
        }
        .fc-scrollgrid-section-header th {
          background-color: transparent !important;
        }
        .fc-event {
          border-radius: 4px !important;
          margin: 1px !important;
        }
        .fc-event-main {
          padding: 1px !important;
        }
        .fc-event-time {
          display: none !important;
        }
        .fc-col-header-cell-cushion {
          color: #9CA3AF !important;
          padding: 4px 2px !important;
        }
        .fc-scrollgrid-sync-inner {
          background-color: transparent !important;
        }
        .fc-view {
          border-radius: 8px !important;
          overflow: hidden !important;
        }
        .fc-toolbar-chunk {
          display: flex !important;
          gap: 0.25rem !important;
        }
        @media (max-width: 640px) {
          .fc-toolbar-chunk {
            justify-content: center !important;
          }
          .fc-direction-ltr .fc-toolbar > * > :not(:first-child) {
            margin-left: 0.25rem !important;
          }
        }
      `}</style>
    </>
  );
}

function MiniCalendar({ onDateSelect, selectedDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    onDateSelect(clickedDate);
  };

  // Format date to dd-mm-yyyy
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // Format: dd-mm-yyyy
  };
  const isSameDay = (date1, date2) => {
    return formatDate(date1) === formatDate(date2);
  };

  return (
    <div className="bg-[#000000] rounded-xl p-3 w-64">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={handlePrevMonth}
          className="text-white hover:text-gray-300"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-white text-sm font-semibold">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          onClick={handleNextMonth}
          className="text-white hover:text-gray-300"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {days.map((day) => (
          <div key={day} className="text-gray-400 font-medium">
            {day.charAt(0)}
          </div>
        ))}
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const currentDateObj = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
          );
          const isToday = isSameDay(currentDateObj, today);
          const isSelected =
            selectedDate && isSameDay(currentDateObj, selectedDate);

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={`aspect-square flex items-center justify-center rounded-full text-xs
                ${
                  isToday
                    ? "bg-blue-500 text-white"
                    : "text-white hover:bg-gray-700"
                }
                ${isSelected ? "bg-[#3F74FF] text-white" : ""}
                transition-all duration-200
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Appointments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [view, setView] = useState("week");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [checkedInMembers, setCheckedInMembers] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);
  const [appointmentToRemove, setAppointmentToRemove] = useState(null);
  const [isShowDetails, setisShowDetails] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [checkedOutMembers, setCheckedOutMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [isNotifyMemberOpen, setIsNotifyMemberOpen] = useState(false);
  const [notifyAction, setNotifyAction] = useState("");
  const [freeAppointments, setFreeAppointments] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([
    { name: "Strength Training", color: "bg-[#4169E1]", duration: 60 },
    { name: "Cardio", color: "bg-[#FF6B6B]", duration: 45 },
    { name: "Yoga", color: "bg-[#50C878]", duration: 90 },
  ]);
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      name: "Yolanda",
      time: "10:00 - 14:00",
      date: "Mon | 03-02-2025",
      color: "bg-[#4169E1]",
      startTime: "10:00",
      endTime: "14:00",
      type: "Strength Training",
      specialNote: {
        text: "Prefers morning sessions",
        startDate: null,
        endDate: null,
        isImportant: false,
      },
      status: "pending",
      isTrial: false,
    },
    {
      id: 2,
      name: "Alexandra",
      time: "10:00 - 18:00",
      date: "Tue | 04-02-2025",
      color: "bg-[#FF6B6B]",
      startTime: "10:00",
      endTime: "18:00",
      type: "Cardio",
      specialNote: {
        text: "",
        startDate: null,
        endDate: null,
        isImportant: false,
      },
      status: "pending",
      isTrial: true,
    },
    {
      id: 3,
      name: "Marcus",
      time: "14:00 - 16:00",
      date: "Wed | 05-02-2025",
      color: "bg-[#50C878]",
      startTime: "14:00",
      endTime: "16:00",
      type: "Yoga",
      specialNote: {
        text: "",
        startDate: null,
        endDate: null,
        isImportant: false,
      },
      status: "pending",
      isTrial: false,
    },
    {
      id: 4,
      name: "John",
      time: "14:00 - 16:00",
      date: "Thu | 06-02-2025",
      color: "bg-[#50C878]",
      startTime: "14:00",
      endTime: "16:00",
      type: "Yoga",
      specialNote: {
        text: "",
        startDate: null,
        endDate: null,
        isImportant: false,
      },
      status: "pending",
      isTrial: false,
    },
  ]);

  const [openingHours, setOpeningHours] = useState({
    start: "08:00:00",
    end: "19:00:00",
  });

  const [filteredAppointments, setFilteredAppointments] =
    useState(appointments);

  const handleDateSelect = (date) => {
    setSelectedDate(date);

    // If no date is selected, show all appointments
    if (!date) {
      setFilteredAppointments(appointments);
      return;
    }

    // Format the selected date to dd-mm-yyyy
    const formattedSelectedDate = formatDate(date);

    // Filter appointments for the selected date
    const appointmentsForDate = appointments.filter((appointment) => {
      const appointmentDate = appointment.date.split("|")[1].trim();
      return appointmentDate === formattedSelectedDate;
    });

    // Set filtered appointments
    setFilteredAppointments(
      appointmentsForDate.length > 0 ? appointmentsForDate : []
    );
  };
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatDateForDisplay = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdownId(null);
      setIsViewDropdownOpen(false);
      setActiveNoteId(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const filtered = appointments.filter((appointment) => {
      // Filter by search query
      const nameMatch = appointment.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Filter by selected date (if any)
      const dateMatch =
        !selectedDate ||
        appointment.date.split("|")[1].trim() === formatDate(selectedDate);

      return nameMatch && dateMatch;
    });
    setFilteredAppointments(filtered);
  }, [searchQuery, appointments, selectedDate, formatDate]);

  const handleCheckInOut = (appointmentId) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) => {
        if (appointment.id === appointmentId) {
          if (appointment.status === "pending") {
            toast.success("Member checked out successfully");
            return { ...appointment, status: "checked-out" };
          }
        }
        return appointment;
      })
    );
  };

  const handleAppointmentSubmit = (appointmentData) => {
    const newAppointment = {
      id: appointments.length + 1,
      ...appointmentData,
      status: "pending",
      isTrial: false,
      // Format date properly when adding new appointment
      date: `${new Date(appointmentData.date).toLocaleString("en-US", {
        weekday: "short",
      })} | ${formatDateForDisplay(new Date(appointmentData.date))}`,
    };
    setAppointments([...appointments, newAppointment]);
    toast.success("Appointment booked successfully");
  };

  const handleTrialSubmit = (trialData) => {
    const newTrial = {
      id: appointments.length + 1,
      ...trialData,
      status: "pending",
      isTrial: true,
      // Format date properly when adding new trial
      date: `${new Date(trialData.date).toLocaleString("en-US", {
        weekday: "short",
      })} | ${formatDateForDisplay(new Date(trialData.date))}`,
    };
    setAppointments([...appointments, newTrial]);
    toast.success("Trial training booked successfully");
  };

  const handleCheckIn = (appointmentId) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) => {
        if (appointment.id === appointmentId) {
          // Toggle the check-in status
          const updatedAppointment = {
            ...appointment,
            isCheckedIn: !appointment.isCheckedIn,
          };

          // If the appointment is checked in, automatically revert after 3 seconds
          if (updatedAppointment.isCheckedIn) {
            setTimeout(() => {
              setAppointments((prevAppointments) =>
                prevAppointments.map((app) =>
                  app.id === appointmentId
                    ? { ...app, isCheckedIn: false }
                    : app
                )
              );
            }, 3000);
          }

          return updatedAppointment;
        }
        return appointment;
      })
    );
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    // Fetch free appointments here
    setFreeAppointments([
      { id: "free1", date: "2025-01-03", time: "10:00" },
      { id: "free2", date: "2025-01-03", time: "11:00" },
      { id: "free3", date: "2025-01-03", time: "14:00" },
    ]);
  };

  const handleAppointmentChange = (changes) => {
    setSelectedAppointment((prev) => {
      const updatedAppointment = { ...prev, ...changes };
      if (changes.specialNote) {
        updatedAppointment.specialNote = {
          ...prev.specialNote,
          ...changes.specialNote,
        };
      }
      return updatedAppointment;
    });
  };

  const handleRemoveAppointment = (appointment) => {
    setAppointmentToRemove(appointment);
    setIsConfirmCancelOpen(true);
    setActiveDropdownId(null);
  };

  const confirmRemoveAppointment = () => {
    setIsConfirmCancelOpen(false);
    setIsNotifyMemberOpen(true);
    setNotifyAction("cancel");
    // We'll handle the actual removal after user decides on notification
  };

  const handleNotifyMember = (shouldNotify) => {
    const changes = {};
    let updatedAppointment;
    if (notifyAction === "change") {
      updatedAppointment = { ...selectedAppointment, ...changes };
      const updatedAppointments = appointments.map((app) =>
        app.id === updatedAppointment.id ? updatedAppointment : app
      );
      setAppointments(updatedAppointments);
      setSelectedAppointment(null);
      toast.success("Appointment updated successfully");
    } else if (notifyAction === "cancel") {
      setAppointments(
        appointments.filter((app) => app.id !== appointmentToRemove.id)
      );
      setAppointmentToRemove(null);
      toast.success("Appointment removed successfully");
    }

    if (shouldNotify) {
      // Here you would implement the actual notification logic
      toast.success("Member notified successfully");
    }

    setIsNotifyMemberOpen(false);
  };

  // Modified search handler to update both list and calendar
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === "") {
      setSelectedMember(null);
    } else {
      const foundMember = appointments.find((app) =>
        app.name.toLowerCase().includes(query)
      );
      setSelectedMember(foundMember ? foundMember.name : null);
    }
  };

  const handleEventClick = (info) => {
    const appointment = appointments.find((app) => app.id === info.event.id);
    if (appointment) {
      handleAppointmentClick(appointment);
    }
  };

  const renderSpecialNoteIcon = useCallback(
    (specialNote, appointmentId) => {
      if (!specialNote.text) return null;

      const isActive =
        specialNote.startDate === null ||
        (new Date() >= new Date(specialNote.startDate) &&
          new Date() <= new Date(specialNote.endDate));

      if (!isActive) return null;

      const handleMouseEnter = () => {
        setActiveNoteId(appointmentId);
      };

      const handleMouseLeave = () => {
        setActiveNoteId(null);
      };

      return (
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {specialNote.isImportant ? (
            <AlertTriangle
              size={18}
              className="text-yellow-500 cursor-pointer"
            />
          ) : (
            <Info size={18} className="text-blue-500 cursor-pointer" />
          )}
          {activeNoteId === appointmentId && (
            <div className="absolute right-0 top-6 w-64 bg-black backdrop-blur-xl rounded-lg border border-gray-800 shadow-lg p-3 z-20">
              <div className="flex items-start gap-2">
                {specialNote.isImportant ? (
                  <AlertTriangle
                    className="text-yellow-500 shrink-0 mt-0.5"
                    size={16}
                  />
                ) : (
                  <Info className="text-blue-500 shrink-0 mt-0.5" size={16} />
                )}
                <p className="text-white text-sm">{specialNote.text}</p>
              </div>
              {specialNote.startDate && specialNote.endDate && (
                <p className="text-xs text-gray-400 mt-2">
                  Valid from{" "}
                  {new Date(specialNote.startDate).toLocaleDateString()} to{" "}
                  {new Date(specialNote.endDate).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>
      );
    },
    [activeNoteId]
  );

  const calendarEvents = appointments.map((appointment) => ({
    id: appointment.id,
    title: appointment.name,
    date: appointment.date, // Keep the original date format for transformation
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    backgroundColor: appointment.color.split("bg-[")[1].replace("]", ""),
    borderColor: appointment.color.split("bg-[")[1].replace("]", ""),
    extendedProps: {
      type: appointment.type,
    },
  }));
  return (
    <div className="flex rounded-3xl bg-[#1C1C1C] p-6">
      <main className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
            <h1 className="text-xl oxanium_font sm:text-2xl font-bold text-white">
              Appointments
            </h1>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto bg-[#FF843E] text-white px-4 py-2 rounded-xl lg:text-sm text-xs font-medium hover:bg-[#FF843E]/90 transition-colors duration-200"
              >
                Add appointment
              </button>
              <button
                onClick={() => setIsTrialModalOpen(true)}
                className="w-full sm:w-auto bg-[#3F74FF] text-white px-4 py-2 rounded-xl lg:text-sm text-xs font-medium hover:bg-[#3F74FF]/90 transition-colors duration-200"
              >
                Add trial training
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-[50%] w-full space-y-6">
              <MiniCalendar
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
              />

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search member..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full bg-[#000000] text-white rounded-xl px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#3F74FF]"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>

              <div>
                <h2 className="text-white font-bold mb-4">
                  Upcoming Appointments
                </h2>
                <div className="space-y-3 custom-scrollbar overflow-y-auto max-h-[calc(100vh-300px)]">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment, index) => (
                      <div
                        key={appointment.id}
                        className={`${appointment.color} rounded-xl cursor-pointer p-4 relative`}
                      >
                        <div className="absolute top-2 right-2">
                          {renderSpecialNoteIcon(
                            appointment.specialNote,
                            appointment.id
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                              <img
                                src={Avatar || "/placeholder.svg"}
                                alt=""
                                className="w-full h-full rounded-full"
                              />
                            </div>
                            <div className="text-white flex-grow">
                              <p className="font-semibold">
                                {appointment.name}
                              </p>
                              <p className="text-sm flex gap-1 items-center opacity-80">
                                <Clock size={15} />
                                {appointment.time} | {appointment.date}
                              </p>
                              <p className="text-sm mt-1">
                                {appointment.isTrial ? (
                                  <span className="font-medium text-yellow 500">
                                    Trial Session
                                  </span>
                                ) : (
                                  appointment.type
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                            <button
                              onClick={() => handleCheckIn(appointment.id)}
                              className={`w-full sm:w-auto px-4 py-2 text-xs font-medium rounded-xl ${
                                appointment.isCheckedIn
                                  ? "bg-green-600 text-white"
                                  : "bg-black text-white"
                              }`}
                            >
                              {appointment.isCheckedIn
                                ? "Checked In"
                                : "Check In"}
                            </button>
                            <div className="relative flex flex-col items-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDropdownId(
                                    activeDropdownId === appointment.id
                                      ? null
                                      : appointment.id
                                  );
                                }}
                                className="text-white/80 hover:text-white"
                              >
                                <MoreHorizontal size={20} />
                              </button>

                              {activeDropdownId === appointment.id && (
                                <div className="absolute right-0 cursor-pointer mt-1 w-42 bg-[#1C1C1C] backdrop-blur-xl rounded-lg border border-gray-800 shadow-lg overflow-hidden z-10">
                                  <button
                                    className="w-full px-4 py-2 text-sm text-white hover:bg-gray-800 text-left"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAppointmentClick(appointment);
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <div className="h-[1px] bg-gray-800 w-full"></div>
                                  <button
                                    className="w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-800 text-left"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveAppointment(appointment);
                                    }}
                                  >
                                    Cancel Appointment
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-white text-center">
                      No appointments for this date.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:w-[70%] w-full bg-[#000000] rounded-xl p-4 overflow-hidden">
              <Calendar
                appointments={appointments}
                onDateSelect={handleDateSelect}
                searchQuery={searchQuery}
                selectedDate={selectedDate}
                setAppointments={setAppointments}
              />
            </div>
          </div>
        </div>
      </main>

      <AddAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointmentTypes={appointmentTypes}
        onSubmit={handleAppointmentSubmit}
        setIsNotifyMemberOpen={setIsNotifyMemberOpen}
        setNotifyAction={setNotifyAction}
      />

      <TrialPlanningModal
        isOpen={isTrialModalOpen}
        onClose={() => setIsTrialModalOpen(false)}
        freeAppointments={freeAppointments}
        onSubmit={handleTrialSubmit}
      />

      <SelectedAppointmentModal
        selectedAppointment={selectedAppointment}
        setSelectedAppointment={setSelectedAppointment}
        appointmentTypes={appointmentTypes}
        freeAppointments={freeAppointments}
        handleAppointmentChange={handleAppointmentChange}
        appointments={appointments}
        setAppointments={setAppointments}
        setIsNotifyMemberOpen={setIsNotifyMemberOpen}
        setNotifyAction={setNotifyAction}
      />

      {isConfirmCancelOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
          onClick={() => setIsConfirmCancelOpen(false)}
        >
          <div
            className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">
                Confirm Cancellation
              </h2>
              <button
                onClick={() => setIsConfirmCancelOpen(false)}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-white text-sm">
                Are you sure you want to cancel this appointment with{" "}
                {appointmentToRemove?.name} on {appointmentToRemove?.date} at{" "}
                {appointmentToRemove?.time}?
              </p>
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
              <button
                onClick={confirmRemoveAppointment}
                className="w-full sm:w-auto px-5 py-2.5 bg-red-600 text-sm font-medium text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Yes, Cancel Appointment
              </button>
              <button
                onClick={() => setIsConfirmCancelOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-800 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                No, Keep Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {isNotifyMemberOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
          onClick={() => setIsNotifyMemberOpen(false)}
        >
          <div
            className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">
                Notify Member
              </h2>
              <button
                onClick={() => setIsNotifyMemberOpen(false)}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-white text-sm">
                Do you want to notify the member about this{" "}
                {notifyAction === "change"
                  ? "change"
                  : notifyAction === "cancel"
                  ? "cancellation"
                  : "booking"}
                ?
              </p>
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
              <button
                onClick={() => handleNotifyMember(true)}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
              >
                Yes, Notify Member
              </button>
              <button
                onClick={() => handleNotifyMember(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-800 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                No, Don't Notify
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}
