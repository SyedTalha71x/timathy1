import React from "react"

const Calendar = () => {
    const hours = Array.from({ length: 15 }, (_, i) => {
      const hour = i + 5
      return `${hour.toString().padStart(2, "0")}:00`
    })
  
    const days = [
      { day: "Mon", date: "02" },
      { day: "Tues", date: "03" },
      { day: "Wed", date: "04" },
      { day: "Thu", date: "05" },
    ]
  
    const events = [
      {
        id: 1,
        title: "Yolanda",
        day: 0, // Monday
        startTime: "10:00",
        endTime: "14:00",
        color: "bg-[#4169E1]",
      },
      {
        id: 2,
        title: "Alexan..",
        day: 1, // Tuesday
        startTime: "10:00",
        endTime: "18:00",
        color: "bg-[#FF6B6B]",
      },
    ]
  
    const getEventPosition = (startTime, endTime) => {
      const [startHour] = startTime.split(":").map(Number)
      const [endHour] = endTime.split(":").map(Number)
      const topPosition = (startHour - 5) * 60
      const height = (endHour - startHour) * 60
      return { top: topPosition, height }
    }
  
    return (
      <div className="w-full h-[600px] bg-black rounded-2xl p-4">
        <div className="relative h-full">
          <div className="grid grid-cols-4 gap-4 mb-2 text-gray-300 text-sm">
            {days.map(({ day, date }, index) => (
              <div key={index} className="text-center">
                <div>{day}</div>
                <div className="text-xs">{date}</div>
              </div>
            ))}
          </div>
  
          <div className="relative h-[calc(100%-2rem)]">
            <div className="absolute inset-0 grid grid-cols-4 gap-4">
              {Array(4)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className="border-l border-gray-800 border-dashed h-full" />
                ))}
            </div>
  
            <div className="absolute inset-0">
              {hours.map((hour, index) => (
                <div key={hour} className="relative h-[60px] border-t border-gray-800 border-dashed">
                  <span className="absolute -top-3  text-gray-400 text-xs">{hour}</span>
                </div>
              ))}
            </div>
  
            {events.map((event) => {
              const { top, height } = getEventPosition(event.startTime, event.endTime)
              return (
                <div
                  key={event.id}
                  className={`absolute rounded-2xl ml-20 lg:w-[10%] md:w-[20%] sm:w-[30%] w-[30%] ${event.color} p-3`}
                  style={{
                    top: `${top}px`,
                    height: `${height}px`,
                    left: `${event.day * 25}%`,
                  }}
                >
                  <div className="text-white text-sm font-medium mb-1">{event.title}</div>
                  <div className="text-white/90 text-xs">
                    {event.startTime}
                    <br />
                    to
                    <br />
                    {event.endTime}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
  
  export default Calendar
  
  