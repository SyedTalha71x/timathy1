/* eslint-disable react/prop-types */
import { X, BarChart3, ListTodo, Link, CalendarDays } from "lucide-react"

export default function WidgetSelectionModal({ 
  isOpen, 
  onClose, 
  onSelectWidget, 
  getWidgetStatus, 
  widgetArea = "dashboard" 
}) {
  if (!isOpen) return null

  const dashboardWidgets = [
    {
      id: "chart",
      name: "Analytics Chart",
      description: "Display member statistics and analytics",
      icon: BarChart3,
    },
    {
      id: "todo",
      name: "To-Do",
      description: "Task management and to-do items",
      icon: ListTodo,
    },
    {
      id: "websiteLink",
      name: "Website Links",
      description: "Quick access to important websites",
      icon: Link,
    },
    {
      id: "expiringContracts",
      name: "Expiring Contracts",
      description: "Track contracts nearing expiration",
      icon: CalendarDays,
    },
   
  ]

  const sidebarWidgets = [
    {
      id: "chart",
      name: "Analytics Chart",
      description: "Display member statistics and analytics",
      icon: BarChart3,
    },
    {
      id: "todo",
      name: "To-Do",
      description: "Task management and to-do items",
      icon: ListTodo,
    },
    {
      id: "websiteLink",
      name: "Website Links",
      description: "Quick access to important websites",
      icon: Link,
    },
    {
      id: "expiringContracts",
      name: "Expiring Contracts",
      description: "Track contracts nearing expiration",
      icon: CalendarDays,
    }
  ]

  // Select widgets based on the area
  const widgetTypes = widgetArea === "dashboard" ? dashboardWidgets : sidebarWidgets

  return (
    <div className="fixed inset-0 bg-black/50 text-white flex items-center justify-center z-50">
      <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
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
              const { canAdd, location } = getWidgetStatus ? getWidgetStatus(widget.id) : { canAdd: true, location: null }
              const isAlreadyAdded = !canAdd
              let message = ""
              
              if (isAlreadyAdded) {
                if (location === "dashboard") {
                  message = "Already added to My Area"
                } else if (location === "sidebar") {
                  message = "Already added to Sidebar"
                }
              }

              return (
                <button
                  key={widget.id}
                  onClick={() => !isAlreadyAdded && onSelectWidget(widget.id)}
                  disabled={isAlreadyAdded}
                  className={`w-full p-4 rounded-xl text-left flex items-start gap-3 transition-colors ${
                    isAlreadyAdded
                      ? "bg-black/50 cursor-not-allowed opacity-60"
                      : "bg-black hover:bg-zinc-900 cursor-pointer"
                  }`}
                >
                  <div className="mt-0.5">
                    <widget.icon size={20} className="text-zinc-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white mb-1">{widget.name}</div>
                    <div className="text-sm text-zinc-400">{widget.description}</div>
                    {isAlreadyAdded && (
                      <div className="text-xs text-yellow-500 mt-1">{message}</div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}