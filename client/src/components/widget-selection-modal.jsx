/* eslint-disable react/prop-types */
import { X } from "lucide-react"

const widgetOptions = [
    { id: "graph", name: "Graph", type: "chart" },
    { id: "communication", name: "Communication", type: "communication" },
    { id: "todo", name: "TO-DO", type: "todo" },
    { id: "appointments", name: "Appointments", type: "appointments" },
    { id: "websiteLink", name: "Website link", type: "websiteLink" },
    { id: "birthdays", name: "Birthdays", type: "birthdays" },
  ]
  
  export function WidgetSelectionModal({ isOpen, onClose, onSelectWidget }) {
    if (!isOpen) return null
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md mx-4 p-3">
          <div className="flex justify-end items-end">
            <X onClick={onClose} size={20} className="cursor-pointer"/>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {widgetOptions.map((widget) => (
                <button
                  key={widget.id}
                  onClick={() => {
                    onSelectWidget(widget.type)
                    onClose()
                  }}
                  className="w-full p-3 text-left text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  {widget.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  