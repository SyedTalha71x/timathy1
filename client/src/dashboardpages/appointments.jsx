import { MoreHorizontal, X } from "lucide-react";
import Avatar from "../../public/avatar.png";
import { useState } from "react";

export default function Appointments() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 12 }, (_, i) => i + 8);
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
      day: 2,
    },
    {
      id: 2,
      name: "Alexandra",
      time: "12:00",
      date: "Mon | 02-01-2025",
      color: "bg-[#CE4B55]",
      startHour: 16,
      endHour: 18,
      day: 3,
    },
  ];

  return (
    <div className="flex rounded-3xl bg-[#1C1C1C] p-6">
      <main className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Appointments
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#FF843E] text-white w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl sm:rounded-lg text-sm font-medium hover:bg-[#FF843E]/90 transition-colors duration-200"
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

            <div className="lg:flex-1 bg-[#000000] rounded-xl p-4 overflow-hidden">
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
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

                  <div className="overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    <div className="relative">
                      <div className="grid grid-cols-[auto,1fr,1fr,1fr,1fr] gap-4">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4 sm:p-6">
          <div className="bg-[#181818] w-full max-w-[90%] sm:w-[480px] rounded-xl sm:rounded-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-800">
              <div className="flex justify-between items-center">
                <h2 className="text-base sm:text-lg font-semibold text-white">
                  Add appointment
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg"
                >
                  <X size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            <div className="px-4 sm:px-6 py-4 max-h-[calc(100vh-180px)] overflow-y-auto">
              <form className="space-y-4">
                {["Input", "Input", "Input", "Input"].map((label, index) => (
                  <div key={index} className="space-y-1.5">
                    <label className="text-sm text-gray-200 block">
                      {label}
                    </label>
                    <input
                      type="text"
                      placeholder={label}
                      className="w-full bg-[#101010] text-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                    />
                  </div>
                ))}

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200 block">
                    Input
                  </label>
                  <select className="w-full bg-[#101010] text-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200 appearance-none">
                    <option value="">Select</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200 block">
                    Input
                  </label>
                  <div className="flex gap-2 sm:gap-3">
                    <input
                      type="text"
                      placeholder="Input"
                      className="w-24 sm:w-28 bg-[#101010] text-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                    />
                    <input
                      type="text"
                      placeholder="Input"
                      className="flex-1 bg-[#101010] text-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="px-4 sm:px-6 py-4 border-t border-gray-800">
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-[#3F74FF] text-sm font-medium text-white rounded-xl sm:rounded-2xl hover:bg-[#3F74FF]/90 transition-colors duration-200"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-black text-red-500 border-2 border-slate-500 rounded-xl sm:rounded-2xl text-sm font-medium hover:bg-slate-900 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}