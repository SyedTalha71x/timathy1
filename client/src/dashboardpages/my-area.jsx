"use client";

/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import {
  BarChart3,
  MoreVertical,
  X,
  Clock,
  ChevronDown,
  Edit,
  Check,
  ExternalLink,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import Rectangle1 from "../../public/Rectangle 1.png";
import Image10 from "../../public/image10.png";
import Avatar from "../../public/avatar.png";
import { FaArrowUp, FaEllipsisV } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";

function EmployeeCheckInWidget() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);

  const handleCheckInOut = () => {
    if (isCheckedIn) {
      setIsCheckedIn(false);
      setCheckInTime(null);
    } else {
      setIsCheckedIn(true);
      setCheckInTime(new Date());
    }
  };

  return (
    <div className="p-4 bg-[#000000] rounded-xl">
      <h2 className="text-lg font-semibold mb-3">Employee Check-In</h2>
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-sm mb-1">
            Status: {isCheckedIn ? "Checked In" : "Checked Out"}
          </p>
          {checkInTime && (
            <p className="text-xs text-zinc-400 flex items-center gap-1">
              <Clock size={14} />
              {checkInTime.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={handleCheckInOut}
          className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
            isCheckedIn ? "bg-red-600" : "bg-yellow-400 text-black"
          }`}
        >
          {isCheckedIn ? "Check Out" : "Check In"}
        </button>
      </div>
    </div>
  );
}

export default function MyArea() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [selectedMemberType, setSelectedMemberType] = useState("All members");
  const [isChartDropdownOpen, setIsChartDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const chartDropdownRef = useRef(null);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [widgets, setWidgets] = useState([
    { id: "chart", type: "chart", position: 0 },
    { id: "appointments", type: "appointments", position: 1 },
    { id: "employeeCheckIn", type: "employeeCheckIn", position: 2 },
  ]);
  const [customLinks, setCustomLinks] = useState([
    { id: "link1", url: "https://example.com", title: "Example Store" },
  ]);
  const [sidebarSections, setSidebarSections] = useState([
    { id: "communications", title: "Communications" },
    { id: "todo", title: "TO-DO" },
    { id: "birthday", title: "Upcoming Birthday" },
  ]);

  const memberTypes = {
    "All members": {
      data: [
        [50, 280, 200, 450, 250, 400, 300, 200, 450],
        [100, 150, 200, 100, 150, 300, 400, 100, 400],
      ],
      growth: "4%",
      title: "Members",
    },
    "Checked in": {
      data: [
        [30, 180, 150, 350, 200, 300, 250, 150, 350],
        [80, 120, 150, 80, 120, 250, 300, 80, 300],
      ],
      growth: "2%",
      title: "Checked In Members",
    },
    "Cancelled appointment": {
      data: [
        [20, 100, 50, 100, 50, 100, 50, 50, 100],
        [20, 30, 50, 20, 30, 50, 100, 20, 100],
      ],
      growth: "-1%",
      title: "Cancelled Appointments",
    },
  };

  const [appointments, setAppointments] = useState([
    {
      name: "Yolanda",
      time: "10:00",
      date: "Mon | 02-01-2025",
      color: "bg-[#3F74FF]",
      status: "check-in",
      isCheckedIn: false,
    },
    {
      name: "Alexandra",
      time: "12:00",
      date: "Mon | 02-01-2025",
      color: "bg-[#CE4B55]",
      status: "check-out",
      isCheckedIn: false,
    },
  ]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleRightSidebar = () => setIsRightSidebarOpen(!isRightSidebarOpen);
  const redirectToTodos = () => navigate("/dashboard/to-do");
  const redirectToCommunication = () => navigate("/dashboard/communication");
  const toggleDropdown = (index) =>
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  const toggleEditing = () => setIsEditing(!isEditing);

  const moveWidget = (id, direction) => {
    setWidgets((currentWidgets) => {
      const index = currentWidgets.findIndex((w) => w.id === id);
      if (
        (direction === "up" && index === 0) ||
        (direction === "down" && index === currentWidgets.length - 1)
      ) {
        return currentWidgets;
      }
      const newWidgets = [...currentWidgets];
      const swap = direction === "up" ? index - 1 : index + 1;
      [newWidgets[index], newWidgets[swap]] = [
        newWidgets[swap],
        newWidgets[index],
      ];
      return newWidgets.map((w, i) => ({ ...w, position: i }));
    });
  };

  const removeWidget = (id) => {
    setWidgets((currentWidgets) => currentWidgets.filter((w) => w.id !== id));
  };

  const addCustomLink = () => {
    const newLink = { id: `link${customLinks.length + 1}`, url: "", title: "" };
    setCustomLinks([...customLinks, newLink]);
  };

  const updateCustomLink = (id, field, value) => {
    setCustomLinks((currentLinks) =>
      currentLinks.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      )
    );
  };

  const removeCustomLink = (id) => {
    setCustomLinks((currentLinks) =>
      currentLinks.filter((link) => link.id !== id)
    );
  };

  const handleAction = (index, action) => {
    setAppointments((prevAppointments) => {
      const updatedAppointments = [...prevAppointments];
      updatedAppointments[index] = {
        ...updatedAppointments[index],
        isCheckedIn: !updatedAppointments[index].isCheckedIn,
      };
      return updatedAppointments;
    });
  };

  const moveSidebarSection = (id, direction) => {
    setSidebarSections((currentSections) => {
      const index = currentSections.findIndex((section) => section.id === id);
      if (
        (direction === "up" && index === 0) ||
        (direction === "down" && index === currentSections.length - 1)
      ) {
        return currentSections;
      }
      const newSections = [...currentSections];
      const swap = direction === "up" ? index - 1 : index + 1;
      [newSections[index], newSections[swap]] = [
        newSections[swap],
        newSections[index],
      ];
      return newSections;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownIndex(null);
      }
      if (
        chartDropdownRef.current &&
        !chartDropdownRef.current.contains(event.target)
      ) {
        setIsChartDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const chartOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
      background: "transparent",
      fontFamily: "Inter, sans-serif",
      zoom: { enabled: false },
    },
    colors: ["#FF6B1A", "#2E5BFF"],
    stroke: { curve: "smooth", width: 3 },
    markers: { size: 0 },
    xaxis: {
      categories: [
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: {
        style: { colors: "#999999", fontSize: "10px" },
        rotate: 0,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 500,
      tickAmount: 5,
      labels: {
        style: { colors: "#999999", fontSize: "10px" },
        formatter: (value) => Math.round(value),
      },
    },
    grid: {
      show: true,
      borderColor: "#333333",
      strokeDashArray: 5,
      position: "back",
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
      row: { opacity: 0.1 },
      column: { opacity: 0.1 },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      fontSize: "12px",
      labels: { colors: "#ffffff" },
      itemMargin: { horizontal: 10 },
      offsetY: -5,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 250,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  };

  const chartSeries = [
    { name: "Comp1", data: memberTypes[selectedMemberType].data[0] },
    { name: "Comp2", data: memberTypes[selectedMemberType].data[1] },
  ];

  return (
    <div className="flex flex-col md:flex-row rounded-3xl bg-[#1C1C1C] text-white min-h-screen">
      {isRightSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleRightSidebar}
        />
      )}

      <main className="flex-1 min-w-0 overflow-hidden">
        <div className="p-3 md:p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="p-2 text-zinc-400 hover:bg-zinc-800 rounded-lg md:hidden"
              >
                <BarChart3 />
              </button>
              <h1 className="text-xl font-bold">My Area</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="p-2 text-zinc-400 hover:bg-zinc-800 rounded-lg md:hidden"
                onClick={toggleRightSidebar}
              >
                <FaEllipsisV />
              </button>
              <button
                onClick={toggleEditing}
                className="p-2 text-zinc-400 hover:bg-zinc-800 rounded-lg"
              >
                {isEditing ? <Check /> : <Edit />}
              </button>
            </div>
          </div>

          {/* Widgets */}
          <div className="space-y-4">
            {widgets
              .sort((a, b) => a.position - b.position)
              .map((widget) => (
                <div key={widget.id} className="relative">
                  {isEditing && (
                    <div className="absolute top-2 right-2 z-10 flex gap-2">
                      <button
                        onClick={() => moveWidget(widget.id, "up")}
                        className="p-2 bg-gray-800 rounded"
                      >
                        <FaArrowUp size={12} />
                      </button>
                      <button
                        onClick={() => moveWidget(widget.id, "down")}
                        className="p-2 bg-gray-800 rounded"
                      >
                        <FaArrowDown size={12} />
                      </button>
                      <button
                        onClick={() => removeWidget(widget.id)}
                        className="p-2 bg-gray-800 rounded"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}

                  {/* Chart Widget */}
                  {widget.type === "chart" && (
                    <div className="p-4 bg-[#2F2F2F] rounded-xl">
                      <div className="relative mb-4" ref={chartDropdownRef}>
                        <button
                          onClick={() =>
                            setIsChartDropdownOpen(!isChartDropdownOpen)
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-black rounded-xl text-white text-sm"
                        >
                          {selectedMemberType}
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        {isChartDropdownOpen && (
                          <div className="absolute z-10 mt-2 w-48 bg-[#2F2F2F] rounded-xl shadow-lg">
                            {Object.keys(memberTypes).map((type) => (
                              <button
                                key={type}
                                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-black"
                                onClick={() => {
                                  setSelectedMemberType(type);
                                  setIsChartDropdownOpen(false);
                                }}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="w-full">
                        <Chart
                          options={chartOptions}
                          series={chartSeries}
                          type="line"
                          height={350}
                        />
                      </div>
                    </div>
                  )}

                  {/* Appointments Widget */}
                  {widget.type === "appointments" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">
                          Upcoming Appointments
                        </h2>
                        <Link
                          to="/dashboard/appointments"
                          className="text-sm text-blue-400 hover:underline"
                        >
                          See all
                        </Link>
                      </div>
                      <div className="space-y-3">
                        {appointments.map((appointment, index) => (
                          <div
                            key={index}
                            className={`${appointment.color} p-4 rounded-xl`}
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex-shrink-0">
                                  <img
                                    src={Avatar || "/placeholder.svg"}
                                    alt=""
                                    className="w-full h-full object-cover rounded-full"
                                  />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-sm text-white">
                                    {appointment.name}
                                  </h3>
                                  <p className="text-xs flex items-center gap-1 text-white/70 mt-1">
                                    <Clock size={12} />
                                    {appointment.time} | {appointment.date}
                                  </p>
                                  <p className="text-sm text-white mt-1">
                                    {appointment.description ||
                                      "Strength Training"}
                                  </p>
                                </div>
                              </div>

                              {/* Small screens: Check-in button below details, full width */}
                              <div className="flex  sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                                <button
                                  onClick={() =>
                                    handleAction(index, appointment.status)
                                  }
                                  className={`w-full sm:w-auto px-4 py-2 text-xs font-medium rounded-xl ${
                                    appointment.isCheckedIn
                                      ? "bg-green-600"
                                      : "bg-black"
                                  }`}
                                >
                                  {appointment.isCheckedIn
                                    ? appointment.status === "check-in"
                                      ? "Checked In"
                                      : "Checked Out"
                                    : appointment.status === "check-in"
                                    ? "Check In"
                                    : "Check Out"}
                                </button>

                                <div className="relative" ref={dropdownRef}>
                                  <button
                                    className="p-2 hover:bg-white/10 rounded-xl"
                                    onClick={() => toggleDropdown(index)}
                                  >
                                    <MoreVertical size={16} />
                                  </button>
                                  {openDropdownIndex === index && (
                                    <div className="absolute top-5 right-4 w-32 bg-[#2F2F2F]/90 backdrop-blur-sm rounded-xl shadow-lg z-10">
                                      <ul className="py-1">
                                        <li>
                                          <button
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-white/10"
                                            onClick={() => {
                                              console.log("Cancel appointment");
                                              setOpenDropdownIndex(null);
                                            }}
                                          >
                                            Cancel
                                          </button>
                                        </li>
                                        <li className="border-t border-white/10">
                                          <button
                                            className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-white/10"
                                            onClick={() => {
                                              console.log("Remove appointment");
                                              setOpenDropdownIndex(null);
                                            }}
                                          >
                                            Remove
                                          </button>
                                        </li>
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* EmployeeCheckIn Widget */}
                  {widget.type === "employeeCheckIn" && (
                    <EmployeeCheckInWidget />
                  )}
                </div>
              ))}
          </div>

          {/* Custom Links Section */}
          <div className="p-4 bg-[#181818] rounded-xl space-y-4">
            <h2 className="text-lg font-semibold">Custom Links</h2>
            {customLinks.map((link) => (
              <div key={link.id} className="flex flex-col gap-3">
                <input
                  type="text"
                  value={link.title}
                  onChange={(e) =>
                    updateCustomLink(link.id, "title", e.target.value)
                  }
                  placeholder="Link Title"
                  className="bg-[#101010] text-sm p-3 rounded-xl outline-none w-full"
                  disabled={!isEditing}
                />
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) =>
                      updateCustomLink(link.id, "url", e.target.value)
                    }
                    placeholder="https://example.com"
                    className="bg-[#101010] text-sm p-3 rounded-xl outline-none flex-1"
                    disabled={!isEditing}
                  />
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-blue-600 rounded-xl"
                  >
                    <ExternalLink size={16} />
                  </a>
                  {isEditing && (
                    <button
                      onClick={() => removeCustomLink(link.id)}
                      className="p-3 bg-red-600 rounded-xl"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isEditing && (
              <button
                onClick={addCustomLink}
                className="w-full py-2.5 text-sm bg-blue-600 rounded-xl font-medium"
              >
                Add Link
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside
        className={`
          fixed inset-y-0 right-0 z-50 w-[85vw] sm:w-80 lg:w-80 bg-[#181818] 
          transform transition-transform duration-500 ease-in-out
          ${isRightSidebarOpen ? "translate-x-0" : "translate-x-full"}
          md:relative md:translate-x-0
        `}
      >
        <div className="p-4 md:p-6 h-full overflow-y-auto">
          {/* Close button for mobile */}
          <button
            onClick={toggleRightSidebar}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:bg-zinc-700 rounded-xl md:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>

          {sidebarSections.map((section, index) => (
            <div key={section.id} className="mb-8 mt-10 md:mt-0">
              <div className="flex items-center justify-between mb-4">
                {isEditing && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveSidebarSection(section.id, "up")}
                      className="p-1 bg-zinc-700 rounded-md"
                      disabled={index === 0}
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      onClick={() => moveSidebarSection(section.id, "down")}
                      className="p-1 bg-zinc-700 rounded-md"
                      disabled={index === sidebarSections.length - 1}
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                )}
              </div>

              {section.id === "communications" && (
                <div className="space-y-4">
                  <div className="mb-8 mt-10 md:mt-0">
                    <div className="flex items-center justify-between mb-4">
                      <h2
                        className="text-lg md:text-xl open_sans_font_700 cursor-pointer"
                        onClick={redirectToCommunication}
                      >
                        Communications
                      </h2>
                    </div>
                    <div className="space-y-4">
                      {[1, 2].map((message) => (
                        <div
                          onClick={redirectToCommunication}
                          key={message}
                          className="p-3 md:p-4 cursor-pointer bg-black rounded-xl"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <img
                              src={Rectangle1 || "/placeholder.svg"}
                              alt="User"
                              className="rounded-full h-10 w-10 md:h-12 md:w-12"
                            />
                            <div>
                              <h3 className="open_sans_font text-sm md:text-base">
                                Jennifer Markus
                              </h3>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs md:text-sm open_sans_font text-zinc-400">
                              Hey! Did you think the NFT marketplace for Alice
                              app design?
                            </p>
                            <p className="text-xs mt-2 flex gap-1 items-center open_sans_font text-zinc-400">
                              <Clock size={15} />
                              Today | 05:30 PM
                            </p>
                          </div>
                        </div>
                      ))}
                      <Link
                        to={"/dashboard/communication"}
                        className="text-sm md:text-md open_sans_font text-white flex justify-center items-center text-center hover:underline"
                      >
                        See all
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {section.id === "todo" && (
                <div className="space-y-4 open_sans_font">
                  <h2
                    className="text-lg open_sans_font md:text-xl open_sans_font_700 cursor-pointer mb-4"
                    onClick={redirectToTodos}
                  >
                    TO-DO
                  </h2>
                  {[1, 2, 3].map((task) => (
                    <div
                      onClick={redirectToTodos}
                      key={task}
                      className="p-3 md:p-4 cursor-pointer bg-black rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-semibold open_sans_font text-sm md:text-base">
                          Task
                        </h3>
                        <p className="text-xs open_sans_font md:text-sm text-zinc-400">
                          Description
                        </p>
                      </div>
                      <button className="px-4 md:px-6 py-1.5 flex justify-center items-center gap-2 bg-blue-600 text-white rounded-xl text-xs md:text-sm">
                        <img
                          src={Image10 || "/placeholder.svg"}
                          alt=""
                          className="w-4 h-4"
                        />
                        Jack
                      </button>
                    </div>
                  ))}

                  <Link
                    to={"/dashboard/to-do"}
                    className="text-sm md:text-md open_sans_font text-white flex justify-center items-center text-center hover:underline"
                  >
                    See all
                  </Link>
                </div>
              )}

              {section.id === "birthday" && (
                <div className="space-y-4 open_sans_font">
                  <h2 className="text-lg open_sans_font md:text-xl open_sans_font_700 cursor-pointer mb-4">
                    Upcoming Birthday
                  </h2>
                  {[1, 2, 3].map((task) => (
                    <div
                      key={task}
                      className="p-3 md:p-4 cursor-pointer bg-black rounded-xl flex items-center gap-3"
                    >
                      <div>
                        <img
                          src={Avatar || "/placeholder.svg"}
                          className="h-10 w-10"
                          alt=""
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold open_sans_font text-md">
                          Yolando
                        </h3>
                        <p className="text-xs open_sans_font text-zinc-400">
                          Mon | 02 01 2025
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
