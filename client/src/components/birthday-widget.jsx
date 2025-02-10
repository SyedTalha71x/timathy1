import { Calendar } from "lucide-react"

export default function BirthdayWidget() {
  const upcomingBirthdays = [
    { name: "John Doe", date: "2023-06-15" },
    { name: "Jane Smith", date: "2023-06-18" },
    { name: "Mike Johnson", date: "2023-06-20" },
  ]

  return (
    <div className="space-y-4">
      {upcomingBirthdays.map((birthday, index) => (
        <div key={index} className="flex items-center gap-2">
          <Calendar size={18} />
          <span>
            {birthday.name} - {birthday.date}
          </span>
        </div>
      ))}
    </div>
  )
}

