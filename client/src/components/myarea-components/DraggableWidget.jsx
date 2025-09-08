/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Minus } from "lucide-react"
import { useRef } from "react"

const DraggableWidget = ({ id, children, index, moveWidget, removeWidget, isEditing, widgets }) => {
    const ref = useRef(null)
  
    const handleDragStart = (e) => {
      e.dataTransfer.setData("widgetId", id)
      e.dataTransfer.setData("widgetIndex", index)
      e.currentTarget.classList.add("dragging")
    }
  
    const handleDragOver = (e) => {
      e.preventDefault() // Necessary to allow dropping
      if (e.currentTarget.dataset.widgetId !== id) {
        e.currentTarget.classList.add("drag-over")
      }
    }
  
    const handleDragLeave = (e) => {
      e.currentTarget.classList.remove("drag-over")
    }
  
    const handleDrop = (e) => {
      e.preventDefault()
      e.currentTarget.classList.remove("drag-over")
      const draggedWidgetId = e.dataTransfer.getData("widgetId")
      const draggedWidgetIndex = Number.parseInt(e.dataTransfer.getData("widgetIndex"), 10)
      const targetWidgetIndex = index // The index of the widget being dropped ONTO
  
      if (draggedWidgetId !== id) {
        moveWidget(draggedWidgetIndex, targetWidgetIndex)
      }
    }
  
    const handleDragEnd = (e) => {
      e.currentTarget.classList.remove("dragging")
      const allWidgets = document.querySelectorAll(".draggable-widget")
      allWidgets.forEach((widget) => widget.classList.remove("drag-over"))
    }
  
    return (
      <div
        ref={ref}
        className={`relative mb-4 w-full draggable-widget ${isEditing ? "animate-wobble" : ""}`}
        draggable={isEditing}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        onDragEnd={handleDragEnd}
        data-widget-id={id}
        data-widget-index={index}
      >
        {isEditing && (
          <div className="absolute -top-2 -right-2 z-10 flex gap-2">
            <button
              onClick={() => removeWidget(id)}
              className="p-1 bg-gray-500 rounded-md cursor-pointer text-black flex items-center justify-center w-7 h-7"
            >
              <Minus size={25} />
            </button>
          </div>
        )}
        {children}
      </div>
    )
  }

  export default DraggableWidget