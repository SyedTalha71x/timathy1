import { MoreHorizontal, X } from "lucide-react";
import Avatar from "../../public/avatar.png";
import { useState } from "react";

export default function Appointments() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 to 19:00
  const [isModalOpen, setIsModalOpen] = useState(false);

  const appointments = [
    {
      id: 1,
      name: "Yolanda",
      time: "10:00",
      date: "Mon | 02-01-2025",
      color: "bg-[#3F74FF]",
      startHour: 10,
      endHour: 14,
      day: 2, // Monday
    },
    {
      id: 2,
      name: "Alexandra",
      time: "12:00",
      date: "Mon | 02-01-2025",
      color: "bg-[#CE4B55]",
      startHour: 16,
      endHour: 18,
      day: 3, // Tuesday
    },
  ];

  return (
    <div className="flex rounded-3xl bg-[#1C1C1C] p-6">
      <main className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center  mb-8">
            <h1 className="text-2xl font-bold text-white">Appointments</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#FF843E] text-white cursor-pointer px-4 py-2 mt-1 md:mt-0 rounded-lg text-sm"
            >
              + Add appointment
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-[300px] space-y-6">
              <div className="bg-[#000000] rounded-xl p-4">
                <div className="mb-4">
                  <h2 className="text-white mb-4">Month 2000</h2>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400">
                    {days.map((day) => (
                      <div key={day}>{day}</div>
                    ))}
                    {Array.from({ length: 35 }, (_, i) => (
                      <div
                        key={i}
                        className="aspect-square flex items-center justify-center text-gray-400 text-sm"
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-white mb-4">Member</h2>
                <div className="space-y-3">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className={`${appointment.color} rounded-xl p-4 flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                          <img
                            src={Avatar || "/placeholder.svg"}
                            alt=""
                            className="w-full h-full rounded-full"
                          />
                        </div>
                        <div className="text-white">
                          <p className="font-semibold">{appointment.name}</p>
                          <p className="text-sm opacity-80">
                            {appointment.time} | {appointment.date}
                          </p>
                        </div>
                      </div>
                      <button className="text-white/80 hover:text-white">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Calendar Section with improved scrolling */}
            <div className="lg:flex-1 bg-[#000000] rounded-xl p-4 overflow-hidden">
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  {/* Header - Sticky */}
                  <div className="grid grid-cols-5 gap-4 mb-4 bg-[#000000] pb-2">
                    {["Mon\n02", "Tues\n03", "Wed\n04", "Thu\n05"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center text-sm text-gray-400 whitespace-pre-line"
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>

                  {/* Calendar Content - Scrollable */}
                  <div className="overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    <div className="relative">
                      <div className="grid grid-cols-[auto,1fr,1fr,1fr,1fr] gap-4">
                        {/* Hours column */}
                        <div className="space-y-6">
                          {hours.map((hour) => (
                            <div
                              key={hour}
                              className="text-right text-sm text-gray-400 h-6"
                            >
                              {`${hour}:00`}
                            </div>
                          ))}
                        </div>

                        {/* Days columns with grid lines */}
                        {[0, 1, 2, 3].map((day) => (
                          <div key={day} className="relative">
                            <div className="absolute inset-0 border-l border-dashed border-gray-800" />
                            {hours.map((hour) => (
                              <div
                                key={hour}
                                className="h-6 border-b border-dashed border-gray-800"
                              />
                            ))}

                            {appointments
                              .filter((apt) => apt.day === day + 2)
                              .map((apt) => (
                                <div
                                  key={apt.id}
                                  className={`absolute left-1 right-1 ${apt.color} rounded-lg p-1`}
                                  style={{
                                    top: `${(apt.startHour - 8) * 1.5}rem`,
                                    height: `${
                                      (apt.endHour - apt.startHour) * 1.5
                                    }rem`,
                                  }}
                                >
                                  <div className="text-white text-xs font-semibold truncate">
                                    {apt.name}
                                  </div>
                                </div>
                              ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 w-screen h-screen bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000]">
          <div className="bg-[#181818] rounded-xl w-full max-w-md lg:p-6 md:p-6 sm:p-4 p-4 relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-lg font-semibold">
                Add appointment
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 cursor-pointer hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label htmlFor="" className="text-sm text-gray-200 ">
                  Input
                </label>
                <input
                  type="text"
                  placeholder="Input"
                  className="w-full bg-[#101010] mt-1 text-sm rounded-lg px-4 py-2.5 text-white placeholder-gray-500 outline-none"
                />
              </div>
              <div>
                <label htmlFor="" className="text-sm text-gray-200 ">
                  Input
                </label>
                <input
                  type="text"
                  placeholder="Input"
                  className="w-full bg-[#101010] mt-1 text-sm rounded-lg px-4 py-2.5 text-white placeholder-gray-500 outline-none"
                />
              </div>
              <div>
                <label htmlFor="" className="text-sm text-gray-200 ">
                  Input
                </label>
                <input
                  type="text"
                  placeholder="Input"
                  className="w-full bg-[#101010] mt-1 text-sm rounded-lg px-4 py-2.5 text-white placeholder-gray-500 outline-none"
                />
              </div>
              <div>
                <label htmlFor="" className="text-sm text-gray-200 ">
                  Input
                </label>
                <input
                  type="text"
                  placeholder="Input"
                  className="w-full bg-[#101010] mt-1 text-sm rounded-lg px-4 py-2.5 text-white placeholder-gray-500 outline-none"
                />
              </div>
              <div>
                <div>
                  <label htmlFor="" className="text-gray-200 text-sm">
                    Input
                  </label>

                  <select className="w-full bg-[#101010] text-sm rounded-lg px-4 py-2.5 text-white placeholder-gray-500 outline-none">
                    <option value="">Select</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="" className="text-gray-200 text-sm">
                  Input
                </label>

                <div className="flex gap-1">
                  <input
                    type="text"
                    placeholder="Input"
                    className="w-24 bg-[#101010] text-sm rounded-lg px-4 py-2.5 text-white placeholder-gray-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Input"
                    className="w-full bg-[#101010] text-sm rounded-lg px-4 py-2.5 text-white placeholder-gray-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-start gap-3 mt-6">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#3F74FF] text-sm text-white rounded-3xl hover:bg-[#3F74FF]/90 cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-2 bg-black text-red-500 border-slate-500 border-2  rounded-3xl text-sm cursor-pointer "
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
