/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Minus } from "lucide-react"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"

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
  const [isDragging, setIsDragging] = useState(false)
  const [dropPosition, setDropPosition] = useState(null) // "top" | "bottom" | null

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
    e.dataTransfer.setData("widgetIndex", index.toString())
    e.dataTransfer.effectAllowed = "move"
    setIsDragging(true)

    // Slight delay so the browser captures the element before we style it
    requestAnimationFrame(() => {
      if (ref.current) {
        ref.current.style.opacity = "0.4"
      }
    })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"

    // Determine if cursor is in top or bottom half → show drop indicator
    const rect = ref.current?.getBoundingClientRect()
    if (rect) {
      const midpoint = rect.top + rect.height / 2
      setDropPosition(e.clientY < midpoint ? "top" : "bottom")
    }
  }

  const handleDragLeave = (e) => {
    // Only clear if actually leaving this element (not entering a child)
    if (ref.current && !ref.current.contains(e.relatedTarget)) {
      setDropPosition(null)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDropPosition(null)

    const draggedWidgetId = e.dataTransfer.getData("widgetId")
    const draggedWidgetIndex = Number.parseInt(e.dataTransfer.getData("widgetIndex"), 10)
    const targetWidgetIndex = index

    if (draggedWidgetId !== id) {
      moveWidget(draggedWidgetIndex, targetWidgetIndex)
    }
  }

  const handleDragEnd = (e) => {
    setIsDragging(false)
    setDropPosition(null)

    if (ref.current) {
      ref.current.style.opacity = ""
    }

    // Clean up all elements
    const allWidgets = document.querySelectorAll(classes.selector)
    allWidgets.forEach((widget) => {
      widget.style.opacity = ""
    })
  }

  return (
    <div
      ref={ref}
      className={`relative ${classes.container} ${isEditing ? "animate-wobble" : ""}`}
      draggable={isEditing}
      onDragStart={handleDragStart}
      onDragOver={isEditing ? handleDragOver : undefined}
      onDrop={isEditing ? handleDrop : undefined}
      onDragLeave={isEditing ? handleDragLeave : undefined}
      onDragEnd={handleDragEnd}
      data-widget-id={id}
      data-widget-index={index}
      style={{
        cursor: isEditing ? "grab" : undefined,
        transition: "opacity 0.2s ease, transform 0.2s ease",
      }}
    >
      {/* Drop indicator line — top */}
      {isEditing && dropPosition === "top" && !isDragging && (
        <div 
          className="absolute -top-1.5 left-2 right-2 z-20 flex items-center gap-1"
          style={{ pointerEvents: "none" }}
        >
          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
          <div className="flex-1 h-0.5 bg-primary rounded-full" />
          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
        </div>
      )}

      {/* Drop indicator line — bottom */}
      {isEditing && dropPosition === "bottom" && !isDragging && (
        <div 
          className="absolute -bottom-1.5 left-2 right-2 z-20 flex items-center gap-1"
          style={{ pointerEvents: "none" }}
        >
          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
          <div className="flex-1 h-0.5 bg-primary rounded-full" />
          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
        </div>
      )}

      {isEditing && (
        <div className="absolute -top-2 -right-2 z-10 flex gap-2">
          <button
            onClick={() => removeWidget(id)}
            className={`p-1 bg-content-faint rounded-md cursor-pointer text-white flex items-center justify-center ${classes.button}`}
          >
            <Minus size={25} />
          </button>
        </div>
      )}

      {/* Block all interaction inside widgets during edit mode */}
      <div className={isEditing ? "pointer-events-none select-none" : ""}>
        {children}
      </div>
    </div>
  )
}

export default DraggableWidget
