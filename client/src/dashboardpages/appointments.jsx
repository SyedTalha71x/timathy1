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
import { useState, useEffect, useCallback } from "react";
import Avatar from "../../public/avatar.png";
// import Calendar from "../components/calender";
// import MiniCalendar from "../components/mini-calender";
import toast, { Toaster } from "react-hot-toast";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Calendar() {
  const events = [
    {
      id: "1",
      title: "Yolanda",
      start: "2025-02-03T10:00:00",
      end: "2025-02-03T14:00:00",
      backgroundColor: "#4169E1",
      borderColor: "#4169E1",
      extendedProps: {
        type: "Strength Training",
      },
    },
    {
      id: "2",
      title: "Alexandra",
      start: "2025-02-04T10:00:00",
      end: "2025-02-04T18:00:00",
      backgroundColor: "#FF6B6B",
      borderColor: "#FF6B6B",
      extendedProps: {
        type: "Cardio",
      },
    },
    {
      id: "3",
      title: "Marcus",
      start: "2025-02-05T14:00:00",
      end: "2025-02-05T16:00:00",
      backgroundColor: "#50C878",
      borderColor: "#50C878",
      extendedProps: {
        type: "Yoga",
      },
    },
    {
      id: "4",
      title: "John",
      start: "2025-02-05T14:00:00",
      end: "2025-02-05T16:00:00",
      backgroundColor: "#50C878",
      borderColor: "#50C878",
      extendedProps: {
        type: "Yoga",
      },
    },
  ];

  return (
    <div className="h-full w-full">
      <div
        className="max-w-full overflow-x-auto"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="min-w-[768px]">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            initialDate="2025-02-03"
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            height="auto"
            selectable={true}
            editable={true}
            slotMinTime="05:00:00"
            slotMaxTime="20:00:00"
            allDaySlot={false}
            nowIndicator={true}
            slotDuration="01:00:00"
            firstDay={1} // Start week on Monday
            eventContent={(eventInfo) => {
              const event = eventInfo.event;
              const startTime = event.start
                ? event.start.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                : "";
              const endTime = event.end
                ? event.end.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                : "";

              return (
                <div className="p-1 h-full overflow-hidden">
                  <div className="font-semibold text-xs sm:text-sm truncate">
                    {event.title}
                  </div>
                  <div className="text-xs opacity-90 truncate">
                    {event.extendedProps.type}
                  </div>
                  <div className="text-xs mt-1">
                    {startTime} - {endTime}
                  </div>
                </div>
              );
            }}
            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            dayHeaderFormat={{
              weekday: "short",
              month: "numeric",
              day: "numeric",
              omitCommas: true,
            }}
          />
        </div>
      </div>
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
    </div>
  );
}

function MiniCalendar({ onDateSelect }) {
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
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    onDateSelect(selectedDate);
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
          const isToday =
            day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
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
  const [selectedDate, setSelectedDate] = useState(new Date());
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
      date: "Mon | 02-01-2025",
      color: "bg-[#4169E1]",
      startTime: "10:00",
      endTime: "14:00",
      day: 0,
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
      date: "Mon | 02-01-2025",
      color: "bg-[#FF6B6B]",
      startTime: "10:00",
      endTime: "18:00",
      day: 1,
      type: "Cardio",
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
      id: 3,
      name: "Marcus",
      time: "14:00 - 16:00",
      date: "Mon | 02-01-2025",
      color: "bg-[#50C878]",
      startTime: "14:00",
      endTime: "16:00",
      day: 2,
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
      date: "Mon | 02-01-2025",
      color: "bg-[#50C878]",
      startTime: "14:00",
      endTime: "16:00",
      day: 2,
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

  const filteredAppointments = appointments.filter((appointment) =>
    selectedMember ? appointment.name === selectedMember : true
  );

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdownId(null);
      setIsViewDropdownOpen(false);
      setActiveNoteId(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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

  const handleCheckIn = (index) => {
    setAppointments((prevAppointments) => {
      const updatedAppointments = [...prevAppointments];
      updatedAppointments[index] = {
        ...updatedAppointments[index],
        isCheckedIn: true,
      };
      // Simulate backend process: automatically revert to "Check In" after 3 seconds
      setTimeout(() => {
        setAppointments((prevAppointments) => {
          const revertedAppointments = [...prevAppointments];
          revertedAppointments[index] = {
            ...revertedAppointments[index],
            isCheckedIn: false,
          };
          return revertedAppointments;
        });
      }, 3000);
      return updatedAppointments;
    });
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

  const handleDateSelect = (info) => {
    setIsModalOpen(true);
    // You can set some initial state for the new appointment here
    // For example:
    // setNewAppointment({
    //   date: info.startStr,
    //   time: info.startStr.split('T')[1].slice(0, 5),
    // })
  };

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
    start: `${appointment.date.split("|")[1].trim()}T${appointment.startTime}`,
    end: `${appointment.date.split("|")[1].trim()}T${appointment.endTime}`,
    backgroundColor: appointment.color.split("-")[1].slice(1, -1),
    borderColor: appointment.color.split("-")[1].slice(1, -1),
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
              <MiniCalendar onDateSelect={handleDateSelect} />

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
                  {filteredAppointments.map((appointment, index) => (
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
                            <p className="font-semibold">{appointment.name}</p>
                            <p className="text-sm flex gap-1 items-center opacity-80">
                              <Clock size={15} />
                              {appointment.time} | {appointment.date}
                            </p>
                            <p className="text-sm mt-1">
                              {appointment.isTrial ? "Trial - " : ""}
                              {appointment.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                          <button
                            onClick={() => handleCheckIn(index)}
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
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:w-[70%] w-full bg-[#000000] rounded-xl p-4 overflow-hidden">
              <Calendar
                events={calendarEvents}
                onEventClick={handleEventClick}
                onDateSelect={handleDateSelect}
                openingHours={openingHours}
              />
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">
                Add appointment
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <form className="space-y-4 custom-scrollbar overflow-y-auto max-h-[70vh]">
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200">Member</label>
                  <input
                    type="text"
                    placeholder="Search member..."
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200">
                    Appointment Type
                  </label>
                  <select className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]">
                    <option value="">Select type</option>
                    {appointmentTypes.map((type) => (
                      <option
                        key={type.name}
                        value={type.name}
                        className={type.color}
                      >
                        {type.name} ({type.duration} minutes)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200">Date & Time</label>
                  <input
                    type="datetime-local"
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200">Special Note</label>
                  <textarea
                    placeholder="Enter special note..."
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] min-h-[100px]"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isImportant"
                    className="rounded text-[#3F74FF] focus:ring-[#3F74FF]"
                  />
                  <label
                    htmlFor="isImportant"
                    className="text-sm text-gray-200"
                  >
                    Mark as important
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200">Note Duration</label>
                  <div className="flex space-x-2">
                    <input
                      type="date"
                      placeholder="Start Date"
                      className="w-1/2 bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                    />
                    <input
                      type="date"
                      placeholder="End Date"
                      className="w-1/2 bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
                onClick={() => {
                  setIsModalOpen(false);
                  setIsNotifyMemberOpen(true);
                  setNotifyAction("book");
                }}
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {isTrialModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
          onClick={() => setIsTrialModalOpen(false)}
        >
          <div
            className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">
                Add Trial Training
              </h2>
              <button
                onClick={() => setIsTrialModalOpen(false)}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 ">
              <form className="space-y-4 custom-scrollbar overflow-y-auto max-h-[70vh]">
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200">Lead</label>
                  <input
                    type="text"
                    placeholder="Search lead..."
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF]"
                  />
                </div>

                <button
                  type="button"
                  className="w-full px-3 py-2 bg-[#3F74FF] text-white rounded-xl text-sm font-medium hover:bg-[#3F74FF]/90 transition-colors"
                  onClick={() => {
                    // Open modal to create new lead
                  }}
                >
                  + Create New Lead
                </button>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200">Trial Type</label>
                  <select className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]">
                    <option value="">Select type</option>
                    <option value="cardio">Cardio</option>
                    <option value="strength">Strength</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200">Date & Time</label>
                  <input
                    type="datetime-local"
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200">
                    Available Slots
                  </label>
                  <select className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]">
                    <option value="">Select available time</option>
                    {freeAppointments.map((app) => (
                      <option key={app.id} value={`${app.date}T${app.time}`}>
                        {app.date} at {app.time}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
                onClick={() => {
                  setIsTrialModalOpen(false);
                  // Handle booking trial training
                }}
              >
                Book Trial Training
              </button>
              <button
                type="button"
                onClick={() => setIsTrialModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-black text-red-500 border-2 border-slate-500 rounded-xl text-sm font-medium hover:bg-slate-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedAppointment && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
          onClick={() => setSelectedAppointment(null)}
        >
          <div
            className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">
                Edit Appointment
              </h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 ">
              <form className="space-y-4 custom-scrollbar overflow-y-auto max-h-[70vh]">
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200">Member</label>
                  <input
                    type="text"
                    value={selectedAppointment.name}
                    readOnly
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200">
                    Appointment Type
                  </label>
                  <select
                    value={selectedAppointment.type}
                    onChange={(e) =>
                      handleAppointmentChange({ type: e.target.value })
                    }
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                  >
                    {appointmentTypes.map((type) => (
                      <option
                        key={type.name}
                        value={type.name}
                        className={type.color}
                      >
                        {type.name} ({type.duration} minutes)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={`${selectedAppointment.date}T${selectedAppointment.time}`}
                    onChange={(e) =>
                      handleAppointmentChange({
                        date: e.target.value.split("T")[0],
                        time: e.target.value.split("T")[1],
                      })
                    }
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200">Special Note</label>
                  <textarea
                    value={selectedAppointment.specialNote.text}
                    onChange={(e) =>
                      handleAppointmentChange({
                        specialNote: {
                          ...selectedAppointment.specialNote,
                          text: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF] min-h-[100px]"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isImportant"
                    checked={selectedAppointment.specialNote.isImportant}
                    onChange={(e) =>
                      handleAppointmentChange({
                        specialNote: {
                          ...selectedAppointment.specialNote,
                          isImportant: e.target.checked,
                        },
                      })
                    }
                    className="rounded text-[#3F74FF] focus:ring-[#3F74FF]"
                  />
                  <label
                    htmlFor="isImportant"
                    className="text-sm text-gray-200"
                  >
                    Mark as important
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200">Note Duration</label>
                  <div className="flex space-x-2">
                    <input
                      type="date"
                      value={selectedAppointment.specialNote.startDate || ""}
                      onChange={(e) =>
                        handleAppointmentChange({
                          specialNote: {
                            ...selectedAppointment.specialNote,
                            startDate: e.target.value,
                          },
                        })
                      }
                      className="w-1/2 bg-[#101010] text-sm rounded-xl px-3 py2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                    />
                    <input
                      type="date"
                      value={selectedAppointment.specialNote.endDate || ""}
                      onChange={(e) =>
                        handleAppointmentChange({
                          specialNote: {
                            ...selectedAppointment.specialNote,
                            endDate: e.target.value,
                          },
                        })
                      }
                      className="w-1/2 bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200">
                    Available Appointments
                  </label>
                  <select className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]">
                    <option value="">Select available time</option>
                    {freeAppointments.map((app) => (
                      <option key={app.id} value={`${app.date}T${app.time}`}>
                        {app.date} at {app.time}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
              <button
                onClick={() => {
                  // Save changes to the appointments list
                  const updatedAppointments = appointments.map((app) =>
                    app.id === selectedAppointment.id
                      ? selectedAppointment
                      : app
                  );
                  setAppointments(updatedAppointments);

                  // Show the notification popup
                  setIsNotifyMemberOpen(true);
                  setNotifyAction("change");

                  // Close the edit modal
                  setSelectedAppointment(null);
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="w-full sm:w-auto px-5 py-2.5 bg-black text-red-500 border-2 border-slate-500 rounded-xl text-sm font-medium hover:bg-slate-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
