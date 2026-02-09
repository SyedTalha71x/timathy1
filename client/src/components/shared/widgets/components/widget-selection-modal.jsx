/* eslint-disable react/prop-types */
import { FileText, X } from "lucide-react"
import { BarChart3, Calendar, Users, Link, CheckSquare, Gift, Clipboard } from "lucide-react"
import { RiContractLine } from "react-icons/ri";
import { MdOutlineSchedule } from "react-icons/md";

export function WidgetSelectionModal({ isOpen, onClose, onSelectWidget, getWidgetStatus, widgetArea = "dashboard" }) {
  if (!isOpen) return null

  const dashboardWidgets = [
    {
      id: "chart",
      name: "Analytics Chart",
      description: "Display member statistics and analytics",
      icon: BarChart3,
    },
    {
      id: "expiringContracts",
      name: "Expiring Contracts",
      description: "Track contracts nearing expiration",
      icon: RiContractLine,
    },
    {
      id: "appointments",
      name: "Upcoming Appointments",
      description: "Show upcoming appointments",
      icon: Calendar,
    },
    {
      id: "staffCheckIn",
      name: "Staff Check-In",
      description: "Staff check-in/out functionality",
      icon: Users,
    },
    {
      id: "websiteLink",
      name: "Website Links",
      description: "Quick access to important websites",
      icon: Link,
    },
    {
      id: "todo",
      name: "To-Do",
      description: "Task management and to-do items",
      icon: CheckSquare,
    },
    {
      id: "birthday",
      name: "Upcoming Birthdays",
      description: "Upcoming member birthdays",
      icon: Gift,
    },
    {
      id: "bulletinBoard",
      name: "Bulletin Board",
      description: "View bulletin board posts for staff and members",
      icon: Clipboard,
    },
    {
      id: "notes",
      name: "Notes",
      description: "Create and manage personal notes",
      icon: FileText,
    },
    {
      id: "shiftSchedule",
      name: "Shift Schedule",
      description: "View and manage staff shift schedules",
      icon: MdOutlineSchedule,
    }
  ]

  const sidebarWidgets = [
    {
      id: "todo",
      name: "To-Do",
      description: "Task management and to-do items",
      icon: CheckSquare,
    },
    {
      id: "birthday",
      name: "Upcoming Birthdays",
      description: "Upcoming member birthdays",
      icon: Gift,
    },
    {
      id: "websiteLinks",
      name: "Website Links",
      description: "Quick access to important websites",
      icon: Link,
    },
  
    {
      id: "expiringContracts",
      name: "Expiring Contracts",
      description: "Track contracts nearing expiration",
      icon: RiContractLine,
    },
    {
      id: "appointments",
      name: "Upcoming Appointments",
      description: "Show upcoming appointments",
      icon: Calendar,
    },
    {
      id: "staffCheckIn",
      name: "Staff Check-In",
      description: "Staff check-in/out functionality",
      icon: Users,
    },
    {
      id: "bulletinBoard",
      name: "Bulletin Board",
      description: "View bulletin board posts for staff and members",
      icon: Clipboard,
    },
    {
      id: "notes",
      name: "Notes",
      description: "Create and manage personal notes",
      icon: FileText,
    },
    {
      id: "shiftSchedule",
      name: "Shift Schedule",
      description: "View and manage staff shift schedules",
      icon: MdOutlineSchedule,
    }
  ]

  // Select widgets based on the area
  const widgetTypes = widgetArea === "dashboard" ? dashboardWidgets : sidebarWidgets

  return (
    <div className="fixed inset-0 bg-black/50 text-white flex items-center justify-center z-50">
      <div className="bg-[#181818] rounded-xl custom-scrollbar w-full max-w-md mx-4 max-h-[70vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Add Widget to {widgetArea === "dashboard" ? "My Area" : "Sidebar"}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-zinc-700 rounded-lg">
              <X size={16} />
            </button>
          </div>
          <div className="space-y-3">
            {widgetTypes.map((widget) => {
              const { canAdd, location } = getWidgetStatus(widget.id)
              const isAlreadyAdded = !canAdd
              let message = ""
              if (isAlreadyAdded) {
                if (location === "dashboard") {
                  message = "Already added to your My Area"
                } else if (location === "sidebar") {
                  message = "Already added to your sidebar"
                }
              }

              return (
                <button
                  key={widget.id}
                  onClick={() => !isAlreadyAdded && onSelectWidget(widget.id)}
                  disabled={isAlreadyAdded}
                  className={`w-full p-3 rounded-xl text-left flex flex-col ${
                    isAlreadyAdded
                      ? "bg-black/50 cursor-not-allowed opacity-60"
                      : "bg-black hover:bg-zinc-900 cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-2 font-medium mb-1">
                    <widget.icon size={18} />
                    <span>{widget.name}</span>
                  </div>
                  <span className="text-xs text-zinc-400">{widget.description}</span>
                  {isAlreadyAdded && <span className="text-xs text-yellow-500 mt-1">{message}</span>}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
