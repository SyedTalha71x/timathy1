/* eslint-disable react/prop-types */
import { X } from "lucide-react"

export function WidgetSelectionModal({ isOpen, onClose, onSelectWidget, canAddWidget }) {
  if (!isOpen) return null

  const widgetOptions = [
    { id: "chart", name: "Chart", description: "Display data in a chart format" },
    { id: "todo", name: "TO-DO", description: "Tasks and to-do items" },
    { id: "websiteLink", name: "Website Links", description: "Quick access to important websites" },
    { id: "expiringContracts", name: "Expiring Contracts", description: "Contracts that are about to expire" },
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
          {widgetOptions.map((widget) => {
            const isAvailable = canAddWidget(widget.id)
            return (
              <button
                key={widget.id}
                onClick={() => isAvailable && onSelectWidget(widget.id)}
                disabled={!isAvailable}
                className={`w-full p-3 rounded-xl text-left flex flex-col ${
                  isAvailable
                    ? "bg-black hover:bg-zinc-900 cursor-pointer"
                    : "bg-black/50 cursor-not-allowed opacity-60"
                }`}
              >
                <span className="font-medium">{widget.name}</span>
                <span className="text-xs text-zinc-400">{widget.description}</span>
                {!isAvailable && (
                  <span className="text-xs text-yellow-500 mt-1">Already added to your dashboard</span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  </div>
  )
}
