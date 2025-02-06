/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import {
  BarChart3,
  Calendar,
  Home,
  LogOut,
  MoreVertical,
  Settings,
  Users,
  CheckSquare,
  MessageCircle,
  X,
  Clock,
} from "lucide-react";
import Rectangle1 from "../../public/Rectangle 1.png";
import Image10 from "../../public/image10.png";
import Avatar from "../../public/avatar.png";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  const chartOptions = {
    chart: {
      type: "line",
      height: 300,
      toolbar: {
        show: false,
      },
      background: "transparent",
      fontFamily: "Inter, sans-serif",
    },
    colors: ["#FF843E", "#3F74FF"],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    markers: {
      size: 0,
    },
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
        style: {
          colors: "#999999",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      max: 500,
      tickAmount: 5,
      labels: {
        style: {
          colors: "#999999",
          fontSize: "12px",
        },
        formatter: (value) => Math.round(value),
      },
    },
    grid: {
      show: true,
      borderColor: "#333333",
      position: "back",
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      row: {
        opacity: 0.1,
      },
      column: {
        opacity: 0.1,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      offsetY: -60,
      offsetX: -200,
      labels: {
        colors: "#ffffff",
      },
      itemMargin: {
        horizontal: 10,
      },
    },
    title: {
      text: "User",
      align: "left",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#ffffff",
      },
    },
    subtitle: {
      text: "↑ 45% more in 2024",
      align: "left",
      style: {
        fontSize: "12px",
        color: "#ffffff",
        fontWeight: "bolder",
      },
    },
  };

  const chartSeries = [
    {
      name: "Comp1",
      data: [50, 280, 200, 450, 250, 400, 300, 200, 450],
    },
    {
      name: "Comp2",
      data: [100, 150, 200, 100, 150, 300, 400, 100, 400],
    },
  ];

  return (
    <div className="flex rounded-3xl bg-[#1C1C1C] text-white min-h-screen">
      {isRightSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleRightSidebar}
        />
      )}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <div className="p-4 md:p-6">
          <div className="grid gap-4 md:gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleSidebar}
                  className="p-2 text-zinc-400 hover:bg-zinc-800 rounded-lg md:hidden"
                >
                  <BarChart3 />
                </button>
                <h1 className="text-xl md:text-2xl oxanium_font">Dashboard</h1>
              </div>
              <button
                onClick={toggleRightSidebar}
                className="p-2 text-zinc-400 hover:bg-zinc-800 rounded-lg lg:hidden"
                aria-label="Toggle Messages"
              >
                {isRightSidebarOpen ? (
                  <X size={24} />
                ) : (
                  <MessageCircle size={24} />
                )}
              </button>
            </div>

            <div className="p-4 md:p-6 bg-[#2F2F2F] rounded-3xl overflow-hidden">
              <div className="w-full overflow-x-auto custom-scrollbar">
                <div className="min-w-[800px]">
                  <Chart
                    options={chartOptions}
                    series={chartSeries}
                    type="line"
                    height={300}
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg md:text-xl open_sans_font_700 mb-4">
                Appointment
              </h2>
              <div className="space-y-4">
                {[
                  {
                    name: "Yolanda",
                    time: "10:00",
                    date: "Mon | 02-01-2025",
                    color: "bg-[#3F74FF]",
                  },
                  {
                    name: "Alexandra",
                    time: "12:00",
                    date: "Mon | 02-01-2025",
                    color: "bg-[#CE4B55]",
                  },
                ].map((appointment) => (
                  <div
                    key={appointment.name}
                    className={`${appointment.color} p-3 md:p-4 open_sans_font rounded-xl flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center">
                        <img
                          src={Avatar}
                          alt=""
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm md:text-base">
                          {appointment.name}
                        </h3>
                        <p className="text-xs flex gap-1 items-center md:text-sm text-white/70">
                          <div>
                            <Clock size={15} />
                          </div>
                          {appointment.time} | {appointment.date}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-white/10 rounded-lg">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <aside
        className={`
        fixed top-0 right-0 bottom-0 w-[85vw] sm:w-80 lg:w-80 bg-[#181818] z-50 
        lg:static lg:block overflow-y-auto
        ${
          isRightSidebarOpen
            ? "translate-x-0"
            : "translate-x-full lg:translate-x-0"
        }
        transition-transform duration-500 ease-in-out
      `}
      >
        <div className="p-4 md:p-6 min-h-full">
          <button
            onClick={() => setIsRightSidebarOpen(false)}
            className="absolute top-4 left-4 p-2 text-zinc-400 hover:bg-zinc-700 rounded-lg lg:hidden"
            aria-label="Close Messages"
          >
            <X size={20} />
          </button>

          <div className="mb-8 mt-8 lg:mt-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl open_sans_font_700">
                Messages
              </h2>
            </div>
            <div className="space-y-4">
              {[1, 2].map((message) => (
                <div key={message} className="p-3 md:p-4 bg-black rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={Rectangle1}
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
                      Hey! Did you think the NFT marketplace for Alice app
                      design?
                    </p>
                    <p className="text-xs mt-2 flex gap-1 items-center open_sans_font text-zinc-400">
                      <div>
                        <Clock size={15} />
                      </div>
                      Today | 05:30 PM
                    </p>
                  </div>
                </div>
              ))}
              <Link
                href="#"
                className="text-sm md:text-md open_sans_font text-white flex justify-center items-center text-center hover:underline"
              >
                See all
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-lg open_sans_font md:text-xl open_sans_font_700 mb-4">
              TO-DO
            </h2>
            <div className="space-y-4 open_sans_font">
              {[1, 2, 3].map((task) => (
                <div
                  key={task}
                  className="p-3 md:p-4 bg-black rounded-xl  flex items-center justify-between"
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
                    <img src={Image10} alt="" className="w-4 h-4" />
                    Jack
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
