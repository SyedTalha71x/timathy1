import { MoreHorizontal } from "lucide-react"
import Avatar from "../../public/avatar.png"

export default function Appointments() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8:00 to 19:00

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
  ]

  return (
    <div className="flex rounded-3xl bg-[#1C1C1C] p-6">
      <main className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white">Appointments</h1>
            <button className="bg-[#FF843E] text-white px-4 py-2 rounded-lg text-sm">+ Add appointment</button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Schedule Grid - Now on the left */}
            <div className="lg:w-[300px] space-y-6">
              <div className="bg-[#101010] rounded-xl p-4">
                <div className="mb-4">
                  <h2 className="text-white mb-4">Month 2000</h2>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400">
                    {days.map((day) => (
                      <div key={day}>{day}</div>
                    ))}
                    {Array.from({ length: 35 }, (_, i) => (
                      <div key={i} className="aspect-square flex items-center justify-center text-gray-400 text-sm">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Member Section */}
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
                          <img src={Avatar || "/placeholder.svg"} alt="" className="w-full h-full rounded-full" />
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

            {/* Calendar Grid - Fixed height */}
            <div className="lg:flex-1 bg-[#101010] rounded-xl p-4 overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-5 gap-4 mb-4">
                  {["Mon\n02", "Tues\n03", "Wed\n04", "Thu\n05"].map((day) => (
                    <div key={day} className="text-center text-sm text-gray-400 whitespace-pre-line">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="relative">
                  <div className="grid grid-cols-[auto,1fr,1fr,1fr,1fr] gap-4">
                    {/* Hours column */}
                    <div className="space-y-4">
                      {hours.map((hour) => (
                        <div key={hour} className="text-right text-sm text-gray-400 h-4">
                          {`${hour}:00`}
                        </div>
                      ))}
                    </div>

                    {/* Days columns with grid lines */}
                    {[0, 1, 2, 3].map((day) => (
                      <div key={day} className="relative">
                        <div className="absolute inset-0 border-l border-dashed border-gray-800" />
                        {hours.map((hour) => (
                          <div key={hour} className="h-4 border-b border-dashed border-gray-800" />
                        ))}

                        {/* Appointments */}
                        {appointments
                          .filter((apt) => apt.day === day + 2)
                          .map((apt) => (
                            <div
                              key={apt.id}
                              className={`absolute left-1 right-1 ${apt.color} rounded-lg p-1`}
                              style={{
                                top: `${(apt.startHour - 8) * 1}rem`,
                                height: `${(apt.endHour - apt.startHour) * 1}rem`,
                              }}
                            >
                              <div className="text-white text-xs font-semibold truncate">{apt.name}</div>
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
      </main>
    </div>
  )
}