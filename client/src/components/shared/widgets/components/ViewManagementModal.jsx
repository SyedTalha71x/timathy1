/* eslint-disable react/prop-types */
import { Edit, Eye, Pin, PinOff, Save, Trash2, User, X } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import DeleteModal from "../../DeleteModal"

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
  const { t } = useTranslation()
  const [viewName, setViewName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [editingView, setEditingView] = useState(null)
  const [viewToDelete, setViewToDelete] = useState(null)

  // Use whichever props are provided
  const currentWidgets = widgets || sidebarWidgets || []
  const updateWidgets = setWidgets || setSidebarWidgets || (() => {})

  // Variant-specific config
  const config = {
    dashboard: {
      title: t("myArea.viewManagement.titleDashboard")
    },
    sidebar: {
      title: t("myArea.viewManagement.titleSidebar")
    }
  }

  const { title } = config[variant] || config.dashboard

  const currentUser = { id: "user123", name: "John Doe" }

  if (!isOpen) return null

  const handleSaveCurrentView = () => {
    if (!viewName.trim()) {
      toast.error(t("myArea.viewManagement.toast.enterViewName"))
      return
    }

    const newView = {
      id: `view_${Date.now()}`,
      name: viewName.trim(),
      widgets: [...currentWidgets],
      widgetSettings: { ...widgetSettings },
      isStandard: false,
      isDefault: false,
      createdBy: currentUser,
      createdAt: new Date().toISOString(),
    }

    setSavedViews((prev) => [...prev, newView])
    setViewName("")
    setIsCreating(false)
    toast.success(t("myArea.viewManagement.toast.viewSaved", { name: newView.name }))
  }

  const handleLoadView = (view) => {
    updateWidgets([...view.widgets])
    // Load widget settings if available and setter is provided
    if (view.widgetSettings && setWidgetSettings) {
      setWidgetSettings({ ...view.widgetSettings })
    }
    setCurrentView(view)
    toast.success(t("myArea.viewManagement.toast.viewLoaded", { name: view.name }))
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
    toast.success(view?.isStandard ? t("myArea.viewManagement.toast.viewUnpinned") : t("myArea.viewManagement.toast.viewPinned"))
  }

  const handleDeleteView = (viewId) => {
    const view = savedViews.find((v) => v.id === viewId)
    if (view?.isDefault) {
      toast.error(t("myArea.viewManagement.toast.cannotDeleteDefault"))
      return
    }
    setViewToDelete(view)
  }

  const confirmDeleteView = () => {
    if (!viewToDelete) return
    setSavedViews((prev) => prev.filter((view) => view.id !== viewToDelete.id))
    toast.success(t("myArea.viewManagement.toast.viewDeleted"))
    setViewToDelete(null)
  }

  const handleEditView = (view) => {
    setEditingView(view)
    setViewName(view.name)
  }

  const handleUpdateView = () => {
    if (!viewName.trim()) {
      toast.error(t("myArea.viewManagement.toast.enterViewName"))
      return
    }

    setSavedViews((prev) =>
      prev.map((view) =>
        view.id === editingView.id 
          ? { 
              ...view, 
              name: viewName.trim(), 
              widgets: [...currentWidgets],
              widgetSettings: { ...widgetSettings }
            } 
          : view,
      ),
    )

    setEditingView(null)
    setViewName("")
    toast.success(t("myArea.viewManagement.toast.viewUpdated"))
  }

  const cancelEdit = () => {
    setEditingView(null)
    setViewName("")
    setIsCreating(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
      <div className="bg-surface-card rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-content-primary">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-surface-hover rounded-lg text-content-muted">
              <X size={20} />
            </button>
          </div>

          {/* Save Current View Section */}
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-surface-base rounded-xl">
            <h4 className="text-base sm:text-lg font-medium text-content-primary mb-3">
              {editingView ? t("myArea.viewManagement.editView") : t("myArea.viewManagement.saveCurrentView")}
            </h4>
            {!isCreating && !editingView ? (
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm sm:text-base"
              >
                <Save size={16} />
                {t("myArea.viewManagement.saveCurrentLayout")}
              </button>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={viewName}
                  onChange={(e) => setViewName(e.target.value)}
                  placeholder={t("myArea.viewManagement.enterViewName")}
                  className="w-full p-2 sm:p-3 bg-surface-dark rounded-lg text-content-primary text-sm outline-none"
                  autoFocus
                />
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={editingView ? handleUpdateView : handleSaveCurrentView}
                    className="px-3 sm:px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm"
                  >
                    {editingView ? t("myArea.viewManagement.update") : t("common.save")}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 sm:px-4 py-2 bg-surface-button hover:bg-surface-button-hover text-content-secondary rounded-lg text-sm"
                  >
                    {t("common.cancel")}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Saved Views List */}
          <div>
            <h4 className="text-base sm:text-lg font-medium text-content-primary mb-3">{t("myArea.viewManagement.savedViews")}</h4>
            <div className="space-y-3 max-h-[50vh] overflow-y-auto">
              {savedViews.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-content-muted">
                  <Eye size={40} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm sm:text-base">{t("myArea.viewManagement.noSavedViews")}</p>
                  <p className="text-xs sm:text-sm">{t("myArea.viewManagement.saveLayoutHint")}</p>
                </div>
              ) : (
                savedViews.map((view) => (
                  <div
                    key={view.id}
                    className={`p-3 sm:p-4 rounded-xl border transition-colors ${
                      currentView?.id === view.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-border"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h5 className="font-medium text-content-primary text-sm sm:text-base truncate">{view.name}</h5>
                          {view.isStandard && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-accent-yellow/20 text-accent-yellow rounded text-xs whitespace-nowrap">
                              <Pin size={12} />
                              {t("myArea.viewManagement.pinned")}
                            </span>
                          )}
                          {view.isDefault && (
                            <span className="px-2 py-1 bg-surface-button text-content-muted rounded text-xs whitespace-nowrap">
                              {t("myArea.viewManagement.default")}
                            </span>
                          )}
                          {currentView?.id === view.id && (
                            <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs whitespace-nowrap">
                              {t("myArea.viewManagement.active")}
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-content-muted">
                            {t("myArea.viewManagement.widgetsCount", { count: view.widgets.length, date: new Date(view.createdAt).toLocaleDateString("de-DE") })}
                          </p>
                          <p className="text-xs text-content-faint flex items-center gap-1">
                            <User size={12} />
                            {t("myArea.viewManagement.createdBy", { name: view.createdBy?.name || t("myArea.viewManagement.unknown") })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        <button
                          onClick={() => handleLoadView(view)}
                          className="px-2 sm:px-3 py-1.5 bg-primary hover:bg-primary-hover text-white rounded text-xs sm:text-sm whitespace-nowrap"
                        >
                          {t("myArea.viewManagement.load")}
                        </button>
                        {!view.isDefault && (
                          <button
                            onClick={() => handleEditView(view)}
                            className="p-1.5 sm:p-2 hover:bg-surface-hover rounded text-primary"
                            title={t("myArea.viewManagement.editViewTitle")}
                          >
                            <Edit size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleTogglePin(view.id)}
                          className={`p-1.5 sm:p-2 hover:bg-surface-hover rounded ${
                            view.isStandard ? "text-accent-yellow" : "text-content-muted"
                          }`}
                          title={view.isStandard ? t("myArea.viewManagement.unpinView") : t("myArea.viewManagement.pinAsStandard")}
                        >
                          {view.isStandard ? <Pin size={14} /> : <PinOff size={14} />}
                        </button>
                        {!view.isDefault && (
                          <button
                            onClick={() => handleDeleteView(view.id)}
                            className="p-1.5 sm:p-2 hover:bg-surface-hover rounded text-accent-red"
                            title={t("myArea.viewManagement.deleteView")}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!viewToDelete}
        onClose={() => setViewToDelete(null)}
        onConfirm={confirmDeleteView}
        title={t("myArea.viewManagement.deleteView")}
        itemName={viewToDelete?.name}
        description={t("myArea.viewManagement.deleteViewDescription")}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
      />
    </div>
  )
}

export default ViewManagementModal
