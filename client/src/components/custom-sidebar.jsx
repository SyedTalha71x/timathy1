// custom sidebar code where you have to add all samw widgets and funcitonlaity like in my area

/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import {
  X,
  Plus,
  ArrowUp,
  ArrowDown,
  Clock,
  ExternalLink,
  Bell,
  Settings,
  CheckCircle,
  AlertTriangle,
  Edit,
  Check,
  Save,
  Eye,
  Trash2,
  Pin,
  PinOff,
  Globe,
  Lock,
  User,
  ChevronDown,
  MoreVertical,
  Minus,
  MessageCircle,
} from "lucide-react"
const toast = {
  success: (message) => console.log(`✅ ${message}`),
  error: (message) => console.log(`❌ ${message}`),
}
const Image10 = "/placeholder.svg?height=20&width=20"

const DraggableWidget = ({ id, children, index, moveWidget, removeWidget, isEditing, widgets }) => {
  const ref = useRef(null)

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

const BirthdayMessageModal = ({
  isOpen,
  onClose,
  selectedPerson,
  birthdayMessage,
  setBirthdayMessage,
  onSendMessage,
}) => {
  if (!isOpen || !selectedPerson) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
      <div className="bg-[#181818] rounded-xl w-full max-w-md">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Send Birthday Message</h2>
            <button onClick={onClose} className="p-2 hover:bg-zinc-700 rounded-lg text-white">
              <X size={16} />
            </button>
          </div>
          <div className="flex items-center gap-3 p-3 bg-black rounded-xl">
            <img src={selectedPerson.avatar || "/placeholder.svg"} className="h-10 w-10 rounded-full" alt="" />
            <div>
              <h3 className="font-semibold text-sm text-white">{selectedPerson.name}</h3>
              <p className="text-xs text-zinc-400">Birthday: {selectedPerson.date}</p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm text-zinc-400">Your Message</label>
            <textarea
              value={birthdayMessage}
              onChange={(e) => setBirthdayMessage(e.target.value)}
              className="w-full p-3 bg-black rounded-xl text-sm outline-none resize-none text-white"
              rows={4}
              placeholder="Write your birthday message..."
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={onClose} className="px-4 py-2 text-sm rounded-xl hover:bg-zinc-700 text-white">
              Cancel
            </button>
            <button
              onClick={onSendMessage}
              disabled={!birthdayMessage.trim()}
              className={`px-4 py-2 text-sm rounded-xl ${
                !birthdayMessage.trim() ? "bg-blue-600/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// View Management Modal Component
const ViewManagementModal = ({
  isOpen,
  onClose,
  savedViews,
  setSavedViews,
  currentView,
  setCurrentView,
  sidebarWidgets,
  setSidebarWidgets,
}) => {
  const [viewName, setViewName] = useState("")
  const [isGlobalVisible, setIsGlobalVisible] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [editingView, setEditingView] = useState(null)

  const currentUser = { id: "user123", name: "John Doe" }

  if (!isOpen) return null

  const handleSaveCurrentView = () => {
    if (!viewName.trim()) {
      toast.error("Please enter a view name")
      return
    }

    const newView = {
      id: `view_${Date.now()}`,
      name: viewName.trim(),
      widgets: [...sidebarWidgets],
      isStandard: false,
      isGlobal: isGlobalVisible,
      createdBy: currentUser,
      createdAt: new Date().toISOString(),
    }

    setSavedViews((prev) => [...prev, newView])
    setViewName("")
    setIsGlobalVisible(false)
    setIsCreating(false)
    toast.success(`View "${newView.name}" saved successfully`)
  }

  const handleLoadView = (view) => {
    setSidebarWidgets([...view.widgets])
    setCurrentView(view)
    toast.success(`Loaded view: ${view.name}`)
    onClose()
  }

  const handleTogglePin = (viewId) => {
    setSavedViews((prev) =>
      prev.map((view) => ({
        ...view,
        isStandard: view.id === viewId ? !view.isStandard : false,
      })),
    )
    const view = savedViews.find((v) => v.id === viewId)
    toast.success(view?.isStandard ? "View unpinned" : "View pinned as standard")
  }

  const handleDeleteView = (viewId) => {
    setSavedViews((prev) => prev.filter((view) => view.id !== viewId))
    toast.success("View deleted")
  }

  const handleEditView = (view) => {
    setEditingView(view)
    setViewName(view.name)
    setIsGlobalVisible(view.isGlobal || false)
  }

  const handleUpdateView = () => {
    if (!viewName.trim()) {
      toast.error("Please enter a view name")
      return
    }

    setSavedViews((prev) =>
      prev.map((view) =>
        view.id === editingView.id ? { ...view, name: viewName.trim(), isGlobal: isGlobalVisible } : view,
      ),
    )

    setEditingView(null)
    setViewName("")
    setIsGlobalVisible(false)
    toast.success("View updated successfully")
  }

  const cancelEdit = () => {
    setEditingView(null)
    setViewName("")
    setIsGlobalVisible(false)
    setIsCreating(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
      <div className="bg-[#181818] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-white">Manage Views</h3>
            <button onClick={onClose} className="p-2 hover:bg-zinc-700 rounded-lg text-white">
              <X size={20} />
            </button>
          </div>

          {/* Save Current View Section */}
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-black rounded-xl">
            <h4 className="text-base sm:text-lg font-medium text-white mb-3">
              {editingView ? "Edit View" : "Save Current View"}
            </h4>
            {!isCreating && !editingView ? (
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm sm:text-base"
              >
                <Save size={16} />
                Save Current Layout
              </button>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={viewName}
                  onChange={(e) => setViewName(e.target.value)}
                  placeholder="Enter view name..."
                  className="w-full p-2 sm:p-3 bg-zinc-800 rounded-lg text-white text-sm outline-none"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="globalVisible"
                    checked={isGlobalVisible}
                    onChange={(e) => setIsGlobalVisible(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-zinc-800 border-zinc-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="globalVisible" className="text-sm text-white flex items-center gap-1">
                    <Globe size={14} />
                    Make globally visible to all users
                  </label>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={editingView ? handleUpdateView : handleSaveCurrentView}
                    className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                  >
                    {editingView ? "Update" : "Save"}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 sm:px-4 py-2 bg-zinc-600 hover:bg-zinc-700 text-white rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Saved Views List */}
          <div>
            <h4 className="text-base sm:text-lg font-medium text-white mb-3">Saved Views</h4>
            <div className="space-y-3 max-h-[50vh] overflow-y-auto">
              {savedViews.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-zinc-400">
                  <Eye size={40} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm sm:text-base">No saved views yet</p>
                  <p className="text-xs sm:text-sm">Save your current layout to get started</p>
                </div>
              ) : (
                savedViews.map((view) => (
                  <div
                    key={view.id}
                    className={`p-3 sm:p-4 rounded-xl border transition-colors ${
                      currentView?.id === view.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-zinc-700 hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h5 className="font-medium text-white text-sm sm:text-base truncate">{view.name}</h5>
                          {view.isStandard && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded text-xs whitespace-nowrap">
                              <Pin size={12} />
                              Pinned
                            </span>
                          )}
                          <span
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs whitespace-nowrap ${
                              view.isGlobal ? "bg-green-600/20 text-green-400" : "bg-gray-600/20 text-gray-400"
                            }`}
                          >
                            {view.isGlobal ? <Globe size={12} /> : <Lock size={12} />}
                            {view.isGlobal ? "Global" : "Private"}
                          </span>
                          {currentView?.id === view.id && (
                            <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs whitespace-nowrap">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-zinc-400">
                            {view.widgets.length} widgets • Created {new Date(view.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-zinc-500 flex items-center gap-1">
                            <User size={12} />
                            Created by {view.createdBy?.name || "Unknown"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        <button
                          onClick={() => handleLoadView(view)}
                          className="px-2 sm:px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs sm:text-sm whitespace-nowrap"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleEditView(view)}
                          className="p-1.5 sm:p-2 hover:bg-zinc-700 rounded text-blue-400"
                          title="Edit view"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleTogglePin(view.id)}
                          className={`p-1.5 sm:p-2 hover:bg-zinc-700 rounded ${
                            view.isStandard ? "text-yellow-400" : "text-zinc-400"
                          }`}
                          title={view.isStandard ? "Unpin view" : "Pin as standard view"}
                        >
                          {view.isStandard ? <Pin size={14} /> : <PinOff size={14} />}
                        </button>
                        <button
                          onClick={() => handleDeleteView(view.id)}
                          className="p-1.5 sm:p-2 hover:bg-zinc-700 rounded text-red-400"
                          title="Delete view"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const SidebarWidgetSelectionModal = ({ isOpen, onClose, onSelectWidget, canAddWidget }) => {
  if (!isOpen) return null

  const availableWidgets = [
    {
      id: "communications",
      name: "Communications",
      description: "View recent messages and communications",
      icon: "💬",
    },
    {
      id: "todo",
      name: "TO-DO",
      description: "Manage your tasks and to-do items",
      icon: "✅",
    },
    {
      id: "birthday",
      name: "Birthdays",
      description: "Upcoming member birthdays",
      icon: "🎂",
    },
    {
      id: "websiteLinks",
      name: "Website Links",
      description: "Quick access to important websites",
      icon: "🔗",
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-[#181818] rounded-xl w-full max-w-md p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-white">Add Sidebar Widget</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-700 rounded-lg text-white">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {availableWidgets.map((widget) => (
            <div
              key={widget.id}
              className={`p-3 sm:p-4 rounded-xl border cursor-pointer transition-colors ${
                canAddWidget(widget.id)
                  ? "border-zinc-700 hover:border-blue-500 hover:bg-blue-500/10"
                  : "border-zinc-800 bg-zinc-900/50 cursor-not-allowed opacity-50"
              }`}
              onClick={() => canAddWidget(widget.id) && onSelectWidget(widget.id)}
            >
              <div className="flex items-start gap-3">
                <div className="text-xl sm:text-2xl">{widget.icon}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-white">{widget.name}</h4>
                  <p className="text-xs text-zinc-400 mt-1">{widget.description}</p>
                  {!canAddWidget(widget.id) && <p className="text-xs text-red-400 mt-1">Already added</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    title: "New Member Registration",
    message: "John Doe has registered for a premium membership",
    time: "2 minutes ago",
    type: "success",
    icon: CheckCircle,
    color: "text-green-400",
  },
  {
    id: 2,
    title: "Payment Reminder",
    message: "3 members have overdue payments",
    time: "15 minutes ago",
    type: "warning",
    icon: AlertTriangle,
    color: "text-yellow-400",
  },
]

const WebsiteLinkModal = ({ link, onClose, customLinks, setCustomLinks }) => {
  const [title, setTitle] = useState(link?.title?.trim() || "")
  const [url, setUrl] = useState(link?.url?.trim() || "")

  const handleSave = () => {
    if (!title.trim() || !url.trim()) return

    if (link?.id) {
      // Update existing link
      setCustomLinks((currentLinks) =>
        currentLinks.map((l) => (l.id === link.id ? { ...l, title: title.trim(), url: url.trim() } : l)),
      )
    } else {
      // Add new link
      const newLink = {
        id: `link${Date.now()}`,
        url: url.trim(),
        title: title.trim(),
      }
      setCustomLinks((prev) => [...prev, newLink])
    }

    onClose()
    toast.success(link?.id ? "Link updated successfully" : "Link added successfully")
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
      <div className="bg-[#181818] rounded-xl w-full max-w-md">
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base sm:text-lg font-semibold text-white">Website Link</h2>
            <button onClick={onClose} className="p-2 hover:bg-zinc-700 rounded-lg text-white">
              <X size={16} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 sm:p-3 bg-black rounded-xl text-sm outline-none text-white"
                placeholder="Enter title"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-2 sm:p-3 bg-black rounded-xl text-sm outline-none text-white"
                placeholder="https://example.com"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-6">
            <button onClick={onClose} className="px-3 sm:px-4 py-2 text-sm rounded-xl hover:bg-zinc-700 text-white">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || !url.trim()}
              className={`px-3 sm:px-4 py-2 text-sm rounded-xl ${
                !title.trim() || !url.trim() ? "bg-blue-600/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const SidebarArea = ({
  isOpen,
  onClose,
  communications,
  todos,
  birthdays,
  customLinks,
  setCustomLinks,
  redirectToCommunication,
  redirectToTodos,
  toggleDropdown,
  openDropdownIndex,
  setEditingLink,
  isEditing,
}) => {
  const [activeTab, setActiveTab] = useState("widgets")

  // Default widgets configuration
  const defaultWidgets = [
    { id: "communications", type: "communications", position: 0 },
    { id: "todo", type: "todo", position: 1 },
    { id: "birthday", type: "birthday", position: 2 },
    { id: "websiteLinks", type: "websiteLinks", position: 3 },
  ]

  const [sidebarWidgets, setSidebarWidgets] = useState(defaultWidgets)
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false)
  const [editingLinkLocal, setEditingLinkLocal] = useState(null)
  const [isSidebarEditing, setIsSidebarEditing] = useState(false)

  // View management state
  const [savedViews, setSavedViews] = useState([])
  const [currentView, setCurrentView] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  const [todoFilter, setTodoFilter] = useState("all")
  const [isTodoFilterDropdownOpen, setIsTodoFilterDropdownOpen] = useState(false)
  const todoFilterDropdownRef = useRef(null)

  const [isBirthdayMessageModalOpen, setIsBirthdayMessageModalOpen] = useState(false)
  const [selectedBirthdayPerson, setSelectedBirthdayPerson] = useState(null)
  const [birthdayMessage, setBirthdayMessage] = useState("")

  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true)

  const todoFilterOptions = [
    { value: "all", label: "All" },
    { value: "ongoing", label: "Ongoing" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
  ]

  // Load saved views and standard view on component mount
  useEffect(() => {
    const savedViewsData = localStorage.getItem("sidebarViews")
    if (savedViewsData) {
      const views = JSON.parse(savedViewsData)
      setSavedViews(views)

      // Load standard view if exists
      const standardView = views.find((view) => view.isStandard)
      if (standardView) {
        setSidebarWidgets([...standardView.widgets])
        setCurrentView(standardView)
      }
    }
  }, [])

  // Save views to localStorage whenever savedViews changes
  useEffect(() => {
    if (savedViews.length > 0) {
      localStorage.setItem("sidebarViews", JSON.stringify(savedViews))
    }
  }, [savedViews])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (todoFilterDropdownRef.current && !todoFilterDropdownRef.current.contains(event.target)) {
        setIsTodoFilterDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleSidebarEditing = () => {
    setIsSidebarEditing(!isSidebarEditing)
  }

  const moveWidget = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= sidebarWidgets.length) return

    const newWidgets = [...sidebarWidgets]
    const [movedWidget] = newWidgets.splice(fromIndex, 1)
    newWidgets.splice(toIndex, 0, movedWidget)
    setSidebarWidgets(newWidgets.map((w, i) => ({ ...w, position: i })))
  }

  const removeWidget = (id) => {
    setSidebarWidgets((currentWidgets) => {
      const filtered = currentWidgets.filter((w) => w.id !== id)
      return filtered.map((widget, index) => ({
        ...widget,
        position: index,
      }))
    })
    toast.success("Widget removed successfully")
  }

  const handleAddWidget = (widgetType) => {
    const newWidget = {
      id: `sidebarWidget${Date.now()}`,
      type: widgetType,
      position: sidebarWidgets.length,
    }
    setSidebarWidgets((currentWidgets) => [...currentWidgets, newWidget])
    setIsWidgetModalOpen(false)
    toast.success(`${widgetType} widget has been added to sidebar`)
  }

  const canAddWidget = (widgetType) => {
    return !sidebarWidgets.some((widget) => widget.type === widgetType)
  }

  const addCustomLink = () => {
    setEditingLinkLocal({})
  }

  const removeCustomLink = (id) => {
    setCustomLinks((currentLinks) => currentLinks.filter((link) => link.id !== id))
    toast.success("Link removed successfully")
  }

  const moveCustomLink = (id, direction) => {
    setCustomLinks((currentLinks) => {
      const index = currentLinks.findIndex((link) => link.id === id)
      if ((direction === "up" && index === 0) || (direction === "down" && index === currentLinks.length - 1)) {
        return currentLinks
      }
      const newLinks = [...currentLinks]
      const swap = direction === "up" ? index - 1 : index + 1
      ;[newLinks[index], newLinks[swap]] = [newLinks[swap], newLinks[index]]
      return newLinks
    })
  }

  const getFilteredTodos = () => {
    if (todoFilter === "all") return todos
    return todos.filter((todo) => {
      switch (todoFilter) {
        case "ongoing":
          return todo.status === "ongoing"
        case "pending":
          return todo.status === "pending"
        case "completed":
          return todo.status === "completed"
        default:
          return true
      }
    })
  }

  const handleSendBirthdayMessage = (person) => {
    setSelectedBirthdayPerson(person)
    setBirthdayMessage(`Happy Birthday ${person.name}! 🎉 Wishing you a wonderful day filled with joy and celebration!`)
    setIsBirthdayMessageModalOpen(true)
  }

  const handleSendCustomBirthdayMessage = () => {
    if (birthdayMessage.trim()) {
      toast.success(`Birthday message sent to ${selectedBirthdayPerson.name}!`)
      setIsBirthdayMessageModalOpen(false)
      setBirthdayMessage("")
      setSelectedBirthdayPerson(null)
    }
  }

  const handleEditTask = (todo) => {
    // Handle edit task functionality
    toast.success(`Editing task: ${todo.title}`)
  }

  const handleCancelTask = (todoId) => {
    // Handle cancel task functionality
    toast.success("Task cancelled")
  }

  const handleDeleteTask = (todoId) => {
    // Handle delete task functionality
    toast.success("Task deleted")
  }

  return (
    <>
      <style jsx>{`
        @keyframes wobble {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(-1deg); }
          30% { transform: rotate(1deg); }
          45% { transform: rotate(-1deg); }
          60% { transform: rotate(1deg); }
          75% { transform: rotate(-1deg); }
          90% { transform: rotate(1deg); }
        }
        .animate-wobble {
          animation: wobble 0.5s ease-in-out infinite;
        }
        .dragging {
          opacity: 0.5;
          border: 2px dashed #fff;
        }
        .drag-over {
          border: 2px dashed #3b82f6;
          background-color: rgba(59, 130, 246, 0.1);
        }
      `}</style>

      <aside
        className={`
          fixed top-0 right-0 h-full w-full sm:w-96 lg:w-88 bg-[#181818] border-l border-gray-700 z-50
          transform transition-transform duration-500 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-3 sm:p-4 lg:p-5 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-white truncate">Sidebar</h2>
              {currentView && (
                <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs whitespace-nowrap">
                  {currentView.name}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              {!isSidebarEditing && (
                <button
                  onClick={() => setIsViewModalOpen(true)}
                  className="p-1.5 sm:p-2 bg-gray-600 text-white hover:bg-gray-700 rounded-lg cursor-pointer"
                  title="Manage Views"
                >
                  <Eye size={14} />
                </button>
              )}
              {activeTab === "widgets" && isSidebarEditing && (
                <button
                  onClick={() => setIsWidgetModalOpen(true)}
                  className="p-1.5 sm:p-2 bg-black text-white hover:bg-zinc-900 rounded-lg cursor-pointer"
                  title="Add Widget"
                >
                  <Plus size={14} />
                </button>
              )}
              {activeTab === "widgets" && (
                <button
                  onClick={toggleSidebarEditing}
                  className={`p-1.5 sm:p-2 ${
                    isSidebarEditing ? "bg-blue-600 text-white" : "text-zinc-400 hover:bg-zinc-800"
                  } rounded-lg flex items-center gap-1`}
                  title="Toggle Edit Mode"
                >
                  {isSidebarEditing ? <Check size={14} /> : <Edit size={14} />}
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 text-zinc-400 hover:bg-zinc-700 rounded-xl"
                aria-label="Close sidebar"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="flex mb-3 sm:mb-4 bg-black rounded-xl p-1">
            <button
              onClick={() => setActiveTab("widgets")}
              className={`flex-1 py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === "widgets" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Settings size={14} className="inline mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Widgets</span>
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex-1 py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors relative ${
                activeTab === "notifications" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Bell size={14} className="inline mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Notifications</span>
              {hasUnreadNotifications && (
                <span className="absolute -top-3 -right-1 w-6 h-6 text-white bg-orange-500 rounded-full">2</span>
              )}
            </button>
          </div>

          {activeTab === "widgets" && (
            <div>
              {sidebarWidgets
                .sort((a, b) => a.position - b.position)
                .map((widget, index) => (
                  <DraggableWidget
                    key={widget.id}
                    id={widget.id}
                    index={index}
                    moveWidget={moveWidget}
                    removeWidget={removeWidget}
                    isEditing={isSidebarEditing}
                    widgets={sidebarWidgets}
                  >
                    {widget.type === "communications" && (
                      <div className="mb-4 sm:mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-base sm:text-lg lg:text-xl font-bold cursor-pointer text-white">
                            Communications
                          </h2>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <div className="space-y-2">
                            {communications.slice(0, 2).map((comm) => (
                              <div
                                onClick={redirectToCommunication}
                                key={comm.id}
                                className="p-2 sm:p-3 cursor-pointer bg-black rounded-xl"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <img
                                    src={comm.avatar || "/placeholder.svg"}
                                    alt="User"
                                    className="rounded-full h-6 w-6 sm:h-8 sm:w-8"
                                  />
                                  <div>
                                    <h3 className="text-xs sm:text-sm text-white">{comm.name}</h3>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs text-zinc-400 line-clamp-2">{comm.message}</p>
                                  <p className="text-xs mt-1 flex gap-1 items-center text-zinc-400">
                                    <Clock size={10} />
                                    {comm.time}
                                  </p>
                                </div>
                              </div>
                            ))}
                            <Link
                              href={"/dashboard/communication"}
                              className="text-xs sm:text-sm text-white flex justify-center items-center text-center hover:underline"
                            >
                              See all
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {widget.type === "todo" && (
                      <div className="mb-4 sm:mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-base sm:text-lg lg:text-xl font-bold cursor-pointer text-white">TO-DO</h2>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <div className="relative mb-3" ref={todoFilterDropdownRef}>
                            <button
                              onClick={() => setIsTodoFilterDropdownOpen(!isTodoFilterDropdownOpen)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-black rounded-xl text-white text-sm"
                            >
                              {todoFilterOptions.find((option) => option.value === todoFilter)?.label}
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            {isTodoFilterDropdownOpen && (
                              <div className="absolute z-10 mt-2 w-32 bg-[#2F2F2F] rounded-xl shadow-lg">
                                {todoFilterOptions.map((option) => (
                                  <button
                                    key={option.value}
                                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-black"
                                    onClick={() => {
                                      setTodoFilter(option.value)
                                      setIsTodoFilterDropdownOpen(false)
                                    }}
                                  >
                                    {option.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          {getFilteredTodos()
                            .slice(0, 2)
                            .map((todo) => (
                              <div
                                key={todo.id}
                                className="p-2 sm:p-3 cursor-pointer bg-black rounded-xl flex items-center justify-between gap-2"
                              >
                                <div className="min-w-0 flex-1" onClick={redirectToTodos}>
                                  <h3 className="font-semibold text-xs sm:text-sm text-white truncate">{todo.title}</h3>
                                  <p className="text-xs text-zinc-400 line-clamp-1">{todo.description}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button className="px-2 sm:px-3 py-1 sm:py-1.5 flex justify-center items-center gap-1 sm:gap-2 bg-blue-600 text-white rounded-xl text-xs whitespace-nowrap">
                                    <img src={Image10 || "/placeholder.svg"} alt="" className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden sm:inline">{todo.assignee}</span>
                                  </button>
                                  <div className="relative">
                                    <button
                                      onClick={() => toggleDropdown(`main-todo-${todo.id}`)}
                                      className="p-1 hover:bg-zinc-700 rounded text-zinc-400"
                                    >
                                      <MoreVertical size={16} />
                                    </button>
                                    {openDropdownIndex === `main-todo-${todo.id}` && (
                                      <div className="absolute right-0 top-8 bg-[#2F2F2F] rounded-lg shadow-lg z-10 min-w-[120px]">
                                        <button
                                          onClick={() => {
                                            handleEditTask(todo)
                                            toggleDropdown(null)
                                          }}
                                          className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-600 rounded-t-lg text-white"
                                        >
                                          Edit Task
                                        </button>
                                        <button
                                          onClick={() => {
                                            handleCancelTask(todo.id)
                                            toggleDropdown(null)
                                          }}
                                          className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-600 text-white"
                                        >
                                          Cancel Task
                                        </button>
                                        <button
                                          onClick={() => {
                                            handleDeleteTask(todo.id)
                                            toggleDropdown(null)
                                          }}
                                          className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-600 rounded-b-lg text-red-400"
                                        >
                                          Delete Task
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          <Link
                            href={"/dashboard/to-do"}
                            className="text-xs sm:text-sm text-white flex justify-center items-center text-center hover:underline"
                          >
                            See all
                          </Link>
                        </div>
                      </div>
                    )}

                    {widget.type === "birthday" && (
                      <div className="mb-4 sm:mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-base sm:text-lg lg:text-xl font-bold cursor-pointer text-white">
                            Upcoming Birthday
                          </h2>
                        </div>
                        <div className="space-y-2">
                          {birthdays.slice(0, 2).map((birthday) => (
                            <div
                              key={birthday.id}
                              className="p-2 sm:p-3 cursor-pointer bg-black rounded-xl flex items-center gap-2"
                            >
                              <div>
                                <img
                                  src={birthday.avatar || "/placeholder.svg"}
                                  className="h-6 w-6 sm:h-8 sm:w-8 rounded-full"
                                  alt=""
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-xs sm:text-sm text-white truncate">
                                  {birthday.name}
                                </h3>
                                <p className="text-xs text-zinc-400">{birthday.date}</p>
                              </div>
                              <button
                                onClick={() => handleSendBirthdayMessage(birthday)}
                                className="p-1.5 sm:p-2 hover:bg-zinc-700 rounded-lg text-blue-400"
                                title="Send Birthday Message"
                              >
                                <MessageCircle size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {widget.type === "websiteLinks" && (
                      <div className="mb-4 sm:mb-6">
                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex justify-between items-center mb-2">
                            <h2 className="text-base sm:text-lg lg:text-xl font-bold cursor-pointer text-white">
                              Website Links
                            </h2>
                          </div>
                          <div className="max-h-[200px] sm:max-h-[250px] overflow-y-auto custom-scrollbar">
                            <div className="space-y-2 sm:space-y-3">
                              {customLinks.map((link, linkIndex) => (
                                <div key={link.id} className="p-1.5 sm:p-2 bg-black rounded-xl relative">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <h3 className="text-xs sm:text-sm font-medium text-white truncate">
                                        {link.title}
                                      </h3>
                                      <p className="text-xs mt-1 text-zinc-400 truncate">{link.url}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() =>
                                          window.open(
                                            link.url.startsWith("http") ? link.url : `https://${link.url}`,
                                            "_blank",
                                          )
                                        }
                                        className="p-1.5 sm:p-2 hover:bg-zinc-700 rounded-lg text-white"
                                      >
                                        <ExternalLink size={14} />
                                      </button>
                                      {!isSidebarEditing && (
                                        <button
                                          onClick={() => setEditingLinkLocal(link)}
                                          className="p-1.5 sm:p-2 hover:bg-zinc-700 rounded-lg text-blue-400"
                                        >
                                          <Edit size={14} />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  {isSidebarEditing && (
                                    <div className="absolute top-1 right-1 z-10 flex gap-1">
                                      <button
                                        onClick={() => moveCustomLink(link.id, "up")}
                                        className="p-1 bg-gray-800 rounded hover:bg-gray-700 text-white"
                                        disabled={linkIndex === 0}
                                        title="Move Up"
                                      >
                                        <ArrowUp size={10} />
                                      </button>
                                      <button
                                        onClick={() => moveCustomLink(link.id, "down")}
                                        className="p-1 bg-gray-800 rounded hover:bg-gray-700 text-white"
                                        disabled={linkIndex === customLinks.length - 1}
                                        title="Move Down"
                                      >
                                        <ArrowDown size={10} />
                                      </button>
                                      <button
                                        onClick={() => removeCustomLink(link.id)}
                                        className="p-1 bg-gray-800 rounded hover:bg-gray-700 text-white"
                                        title="Remove Link"
                                      >
                                        <X size={10} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={addCustomLink}
                            className="w-full p-2 bg-black rounded-xl text-xs sm:text-sm text-zinc-400 text-left hover:bg-zinc-900"
                          >
                            Add website link...
                          </button>
                        </div>
                      </div>
                    )}
                  </DraggableWidget>
                ))}
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-white">Recent Notifications</h3>
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                  {mockNotifications.length}
                </span>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {mockNotifications.map((notification) => {
                  const IconComponent = notification.icon
                  return (
                    <div key={notification.id} className="p-2 sm:p-3 bg-black rounded-xl">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className={`${notification.color} mt-1`}>
                          <IconComponent size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-medium text-white">{notification.title}</h4>
                          <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{notification.message}</p>
                          <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
                            <Clock size={10} />
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* View Management Modal */}
      <ViewManagementModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        savedViews={savedViews}
        setSavedViews={setSavedViews}
        currentView={currentView}
        setCurrentView={setCurrentView}
        sidebarWidgets={sidebarWidgets}
        setSidebarWidgets={setSidebarWidgets}
      />

      {/* Sidebar Widget Selection Modal */}
      <SidebarWidgetSelectionModal
        isOpen={isWidgetModalOpen}
        onClose={() => setIsWidgetModalOpen(false)}
        onSelectWidget={handleAddWidget}
        canAddWidget={canAddWidget}
      />

      {/* Website Link Modal */}
      {editingLinkLocal && (
        <WebsiteLinkModal
          link={editingLinkLocal}
          onClose={() => setEditingLinkLocal(null)}
          customLinks={customLinks}
          setCustomLinks={setCustomLinks}
        />
      )}

      <BirthdayMessageModal
        isOpen={isBirthdayMessageModalOpen}
        onClose={() => {
          setIsBirthdayMessageModalOpen(false)
          setBirthdayMessage("")
          setSelectedBirthdayPerson(null)
        }}
        selectedPerson={selectedBirthdayPerson}
        birthdayMessage={birthdayMessage}
        setBirthdayMessage={setBirthdayMessage}
        onSendMessage={handleSendCustomBirthdayMessage}
      />
    </>
  )
}
