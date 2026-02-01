/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Minus } from "lucide-react"
import { useRef } from "react"

/**
 * DraggableWidget - Unified draggable widget wrapper
 * Used for both MyArea dashboard widgets and Sidebar widgets
 * 
 * @param {string} id - Unique widget ID
 * @param {ReactNode} children - Widget content
 * @param {number} index - Widget position index
 * @param {function} moveWidget - Function to move widget (draggedIndex, targetIndex)
 * @param {function} removeWidget - Function to remove widget (id)
 * @param {boolean} isEditing - Whether edit mode is active
 * @param {string} variant - "dashboard" (default) or "sidebar" for different styling
 */
const DraggableWidget = ({ 
  id, 
  children, 
  index, 
  moveWidget, 
  removeWidget, 
  isEditing, 
  variant = "dashboard" // "dashboard" or "sidebar"
}) => {
  const ref = useRef(null)

  // Variant-specific classes
  const variantClasses = {
    dashboard: {
      container: "mb-4 w-full draggable-widget",
      button: "w-7 h-7",
      selector: ".draggable-widget"
    },
    sidebar: {
      container: "mb-6 right-sidebar-widget",
      button: "w-6 h-6",
      selector: ".right-sidebar-widget"
    }
  }

  const classes = variantClasses[variant] || variantClasses.dashboard

  const handleDragStart = (e) => {
    e.dataTransfer.setData("widgetId", id)
    e.dataTransfer.setData("widgetIndex", index)
    e.currentTarget.classList.add("dragging")
  }

  const handleDragOver = (e) => {
    e.preventDefault()
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
    const targetWidgetIndex = index

    if (draggedWidgetId !== id) {
      moveWidget(draggedWidgetIndex, targetWidgetIndex)
    }
  }

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove("dragging")
    const allWidgets = document.querySelectorAll(classes.selector)
    allWidgets.forEach((widget) => widget.classList.remove("drag-over"))
  }

  return (
    <div
      ref={ref}
      className={`relative ${classes.container} ${isEditing ? "animate-wobble" : ""}`}
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
            className={`p-1 bg-gray-500 rounded-md cursor-pointer text-black flex items-center justify-center ${classes.button}`}
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
