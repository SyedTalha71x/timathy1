import { useState } from "react"
import { Clock, MoreVertical, ExternalLink, Plus, X } from "lucide-react"

function BirthdayWidget() {
  const birthdays = [
    { id: 1, name: "Yolanda", date: "Mon | 02-01-2025" },
    { id: 2, name: "Yolanda", date: "Mon | 02-01-2025" },
    { id: 3, name: "Yolanda", date: "Mon | 02-01-2025" },
  ]

  return (
    <div className="p-4 bg-[#2F2F2F] rounded-xl">
      <h2 className="text-lg font-semibold mb-4">Upcoming birthday</h2>
      <div className="space-y-3">
        {birthdays.map((birthday) => (
          <div key={birthday.id} className="flex items-center gap-3 bg-[#3F74FF] p-3 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-white/10">
              <img src="/placeholder.svg" alt="" className="w-full h-full rounded-full" />
            </div>
            <div>
              <h3 className="font-medium text-sm">{birthday.name}</h3>
              <p className="text-xs text-white/70 flex items-center gap-1">
                <Clock size={12} />
                {birthday.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WebsiteLinksWidget() {
  const [isEditing, setIsEditing] = useState(false)
  const [links, setLinks] = useState([
    { id: "link1", title: "Grocery website", url: "www.grocery.com" },
    { id: "link2", title: "Grocery website", url: "www.grocery.com" },
    { id: "link3", title: "Grocery website", url: "www.grocery.com" },
  ])

  const addLink = () => {
    const newLink = { id: `link${links.length + 1}`, title: "", url: "" }
    setLinks([...links, newLink])
  }

  const updateLink = (id, field, value) => {
    setLinks(links.map((link) => (link.id === id ? { ...link, [field]: value } : link)))
  }

  const removeLink = (id) => {
    setLinks(links.filter((link) => link.id !== id))
  }

  return (
    <div className="p-4 bg-[#2F2F2F] rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Website link</h2>
        <button onClick={() => setIsEditing(!isEditing)} className="p-1 hover:bg-black/20 rounded">
          <MoreVertical size={20} />
        </button>
      </div>
      <div className="space-y-3">
        {links.map((link) => (
          <div key={link.id} className="flex items-center gap-3 p-3 bg-black/25 rounded-xl">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-1">
                  <input
                    type="text"
                    value={link.title}
                    onChange={(e) => updateLink(link.id, "title", e.target.value)}
                    className="w-full bg-transparent border-none p-0 text-sm focus:ring-0"
                    placeholder="Website name"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateLink(link.id, "url", e.target.value)}
                    className="w-full bg-transparent border-none p-0 text-xs text-zinc-400 focus:ring-0"
                    placeholder="https://example.com"
                  />
                </div>
              ) : (
                <>
                  <div className="text-sm font-medium">{link.title}</div>
                  <div className="text-xs text-zinc-400">{link.url}</div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#3F74FF] rounded-xl hover:bg-[#3F74FF]/80"
              >
                <ExternalLink size={16} />
              </a>
              {isEditing && (
                <button
                  onClick={() => removeLink(link.id)}
                  className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
        {isEditing && (
          <button
            onClick={addLink}
            className="w-full p-3 flex items-center justify-center gap-2 bg-[#3F74FF]/10 text-[#3F74FF] rounded-xl hover:bg-[#3F74FF]/20"
          >
            <Plus size={16} />
            Add Website Link
          </button>
        )}
      </div>
    </div>
  )
}

function EmployeeCheckInWidget() {
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState(null)

  const handleCheckInOut = () => {
    if (isCheckedIn) {
      setIsCheckedIn(false)
      setCheckInTime(null)
    } else {
      setIsCheckedIn(true)
      setCheckInTime(new Date())
    }
  }

  return (
    <div className="p-4 bg-[#2F2F2F] rounded-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#3F74FF] flex items-center justify-center">
            <img src="/placeholder.svg" alt="" className="w-8 h-8 rounded-full" />
          </div>
          <div>
            <h3 className="text-sm font-medium">Employee Check-In</h3>
            {checkInTime && (
              <p className="text-xs text-zinc-400 flex items-center gap-1">
                <Clock size={12} />
                {checkInTime.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleCheckInOut}
          className={`px-4 py-1.5 rounded-xl text-xs font-medium ${isCheckedIn ? "bg-red-500" : "bg-[#3F74FF]"}`}
        >
          {isCheckedIn ? "Check Out" : "Check In"}
        </button>
      </div>
    </div>
  )
}

// Example usage of all widgets
export default function Widgets() {
  return (
    <div className="space-y-4 p-4 max-w-md">
      <BirthdayWidget />
      <WebsiteLinksWidget />
      <EmployeeCheckInWidget />
    </div>
  )
}

