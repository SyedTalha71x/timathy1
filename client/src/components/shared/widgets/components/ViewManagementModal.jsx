/* eslint-disable react/prop-types */
import { Edit, Eye, Globe, Lock, Pin, PinOff, Save, Trash2, User, X } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

/**
 * ViewManagementModal - Unified view management modal
 * Used for both MyArea dashboard and Sidebar view management
 * 
 * @param {boolean} isOpen - Whether modal is open
 * @param {function} onClose - Close handler
 * @param {Array} savedViews - Array of saved views
 * @param {function} setSavedViews - Setter for saved views
 * @param {Object} currentView - Currently active view
 * @param {function} setCurrentView - Setter for current view
 * @param {Array} widgets - Current widgets array
 * @param {function} setWidgets - Setter for widgets
 * @param {Object} widgetSettings - Widget settings (visible items per widget)
 * @param {function} setWidgetSettings - Setter for widget settings
 * @param {string} variant - "dashboard" (default) or "sidebar" for different titles
 */
const ViewManagementModal = ({
  isOpen,
  onClose,
  savedViews,
  setSavedViews,
  currentView,
  setCurrentView,
  // Unified props - accepts either naming convention
  widgets,
  setWidgets,
  sidebarWidgets,
  setSidebarWidgets,
  // Widget settings (visible items per widget)
  widgetSettings = {},
  setWidgetSettings,
  variant = "dashboard" // "dashboard" or "sidebar"
}) => {
  const [viewName, setViewName] = useState("")
  const [isGlobalVisible, setIsGlobalVisible] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [editingView, setEditingView] = useState(null)

  // Use whichever props are provided
  const currentWidgets = widgets || sidebarWidgets || []
  const updateWidgets = setWidgets || setSidebarWidgets || (() => {})

  // Variant-specific config
  const config = {
    dashboard: {
      title: "Manage My Area Views"
    },
    sidebar: {
      title: "Manage Sidebar Views"
    }
  }

  const { title } = config[variant] || config.dashboard

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
      widgets: [...currentWidgets],
      widgetSettings: { ...widgetSettings }, // Save widget settings (visible items per widget)
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
    updateWidgets([...view.widgets])
    // Load widget settings if available and setter is provided
    if (view.widgetSettings && setWidgetSettings) {
      setWidgetSettings({ ...view.widgetSettings })
    }
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
        view.id === editingView.id 
          ? { 
              ...view, 
              name: viewName.trim(), 
              isGlobal: isGlobalVisible,
              widgets: [...currentWidgets], // Update widgets
              widgetSettings: { ...widgetSettings } // Update widget settings
            } 
          : view,
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
            <h3 className="text-lg sm:text-xl font-semibold text-white">{title}</h3>
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

export default ViewManagementModal
