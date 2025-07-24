"use client"

/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import {
  BarChart3,
  Calendar,
  Users,
  Link,
  TrendingUp,
  Award,
  MessageSquare,
  CheckSquare,
  Gift,
  ExternalLink,
} from "lucide-react"

export function WidgetSelectionModal({ isOpen, onClose, onSelectWidget, getWidgetStatus }) {
  if (!isOpen) return null

  const widgetTypes = [
    {
      id: "chart",
      name: "Analytics Chart",
      description: "Display member statistics and analytics",
      icon: BarChart3,
    },
    {
      id: "appointments",
      name: "Appointments",
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
      id: "topSelling",
      name: "Top Selling",
      description: "Display top-selling products and services",
      icon: TrendingUp,
    },
    {
      id: "mostFrequent",
      name: "Most Frequent",
      description: "Show most frequently sold items",
      icon: Award,
    },
    {
      id: "expiringContracts",
      name: "Expiring Contracts",
      description: "Track contracts nearing expiration",
      icon: Calendar,
    },
    {
      id: "communications",
      name: "Communications",
      description: "Recent messages and communications",
      icon: MessageSquare,
    },
    {
      id: "todo",
      name: "TO-DO",
      description: "Task management and to-do items",
      icon: CheckSquare,
    },
    {
      id: "birthday",
      name: "Birthdays",
      description: "Upcoming member birthdays",
      icon: Gift,
    },
    {
      id: "websiteLinks",
      name: "Website Links (Sidebar)",
      description: "Website links for sidebar",
      icon: ExternalLink,
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#181818] rounded-xl custom-scrollbar w-full max-w-md mx-4 max-h-[70vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Add Widget</h2>
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
                  message = "Already added to your dashboard"
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
                  <span className="font-medium">{widget.name}</span>
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
