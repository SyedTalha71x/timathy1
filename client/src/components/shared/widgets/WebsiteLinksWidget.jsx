/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { Plus, ExternalLink, MoreVertical, X, Edit, Trash2 } from "lucide-react"
import { useSelector, useDispatch } from 'react-redux'
import { createWebsiteThunk, fetchWebsiteThunk, updateWebsiteThunk, deleteWebsiteThunk } from "../../../features/website/websiteSlice"

// ============================================
// Website Link Modal Component
// ============================================
const WebsiteLinkModal = ({
  link = null,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

  useEffect(() => {
    if (link) {
      setTitle(link.title?.trim() || "")
      setUrl(link.url?.trim() || "")
    } else {
      setTitle("")
      setUrl("")
    }
  }, [link])

  const handleSave = () => {
    if (!title.trim() || !url.trim()) return

    if (link?._id) {
      // Edit existing link - pass _id instead of id
      onSave(link._id, { title: title.trim(), url: url.trim() })
    } else {
      // Add new link
      const newLink = {
        url: url.trim(),
        title: title.trim(),
      }
      onSave(null, newLink)
    }
    onClose()
  }

  return (
    <div className="bg-surface-card rounded-xl w-full max-w-md mx-4">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-content-primary">
            {link ? "Edit Website Link" : "Add Website Link"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-surface-hover rounded text-content-muted hover:text-content-primary"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-content-muted mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-surface-base rounded-xl text-sm outline-none text-content-primary placeholder-content-faint"
              placeholder="Enter title"
            />
          </div>
          <div>
            <label className="block text-sm text-content-muted mb-2">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-3 bg-surface-base rounded-xl text-sm outline-none text-content-primary placeholder-content-faint"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-surface-button text-content-secondary rounded-xl hover:bg-surface-button-hover text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || !url.trim()}
            className={`px-4 py-2 text-sm rounded-xl ${!title.trim() || !url.trim()
              ? "bg-primary/50 cursor-not-allowed text-content-muted"
              : "bg-primary hover:bg-primary-hover text-white"
              }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Website Links Widget Component (Fixed)
// ============================================
const WebsiteLinksWidget = ({
  isEditing,
  onRemove,
  onAddLink,
  onEditLink,
  onRemoveLink,
  showHeader = true,
  maxItems = null
}) => {
  const { website = [] } = useSelector((state) => state.website) || {}
  const dispatch = useDispatch();
  const [openDropdownId, setOpenDropdownId] = useState(null)
  const [dropdownPosition, setDropdownPosition] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLink, setEditingLink] = useState(null)
  const [linkToDelete, setLinkToDelete] = useState(null)
  const dropdownRef = useRef(null)
  const listRef = useRef(null)
  const [computedMaxHeight, setComputedMaxHeight] = useState(null)

  const customLinks = Array.isArray(website) ? website : []

  useEffect(() => {
    if (!maxItems || !listRef.current) {
      setComputedMaxHeight(null)
      return
    }
    const frame = requestAnimationFrame(() => {
      const el = listRef.current
      if (!el) return
      const children = el.children
      if (children.length === 0) { setComputedMaxHeight(null); return }
      const count = Math.min(maxItems, children.length)
      const firstRect = children[0].getBoundingClientRect()
      const lastRect = children[count - 1].getBoundingClientRect()
      setComputedMaxHeight(lastRect.bottom - firstRect.top + 4)
    })
    return () => cancelAnimationFrame(frame)
  }, [maxItems, customLinks.length])

  // fetch all websites 
  useEffect(() => {
    dispatch(fetchWebsiteThunk())
  }, [dispatch])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleDropdownToggle = (linkId, event) => {
    if (openDropdownId === linkId) {
      setOpenDropdownId(null)
      return
    }

    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const dropdownHeight = 80
    const spaceBelow = viewportHeight - rect.bottom
    const spaceAbove = rect.top

    const openUpwards = spaceBelow < dropdownHeight && spaceAbove > spaceBelow

    setDropdownPosition({
      [linkId]: openUpwards ? 'top' : 'bottom'
    })
    setOpenDropdownId(linkId)
  }

  const handleAddClick = () => {
    setEditingLink(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (link) => {
    setEditingLink(link)
    setIsModalOpen(true)
    setOpenDropdownId(null)
  }

  const handleSaveLink = async (id, linkData) => {
    if (id) {
      // Edit existing link - FIXED: Proper update with id and updateData
      await dispatch(updateWebsiteThunk({ id: id, updateData: linkData }))
    } else {
      // Add new link
      await dispatch(createWebsiteThunk(linkData))
    }
    // Refresh the list after operation
    await dispatch(fetchWebsiteThunk())
    setIsModalOpen(false)
    setEditingLink(null)
  }

  const handleDeleteClick = (linkId) => {
    setLinkToDelete(linkId)
    setOpenDropdownId(null)
  }

  const confirmDelete = async () => {
    if (linkToDelete) {
      // FIXED: Delete using the correct ID
      await dispatch(deleteWebsiteThunk(linkToDelete))
      // Refresh the list after deletion
      await dispatch(fetchWebsiteThunk())
      setLinkToDelete(null)
    }
  }

  const truncateUrl = (url, maxLength = 60) => {
    if (!url) return ''
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength - 3) + "..."
  }

  return (
    <div className={`p-4 rounded-xl bg-surface-button flex flex-col space-y-3 ${showHeader ? 'h-[320px] md:h-[340px]' : ''}`}>
      {/* Header */}
      {showHeader && (
        <div className="flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg font-semibold">Website Links</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddClick}
              className="p-2 bg-primary hover:bg-primary-hover rounded-lg transition-colors text-white"
              title="Add link"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      )}
      {!showHeader && (
        <div className="flex justify-end flex-shrink-0">
          <button
            onClick={handleAddClick}
            className="p-2 bg-primary hover:bg-primary-hover rounded-lg transition-colors text-white"
            title="Add link"
          >
            <Plus size={18} />
          </button>
        </div>
      )}

      {/* Links List */}
      <div
        ref={listRef}
        className={`overflow-y-auto custom-scrollbar pr-1 space-y-1.5 ${showHeader ? 'flex-1' : ''}`}
        style={computedMaxHeight ? { maxHeight: `${computedMaxHeight}px` } : undefined}
      >
        {customLinks.map((link) => (
          <div
            key={link._id}
            className="p-3 rounded-xl bg-surface-card hover:bg-surface-hover transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-content-primary truncate" style={{ wordBreak: 'break-word' }}>
                  {link.title}
                </h3>
                <p className="text-xs mt-1 text-content-muted truncate">
                  {truncateUrl(link.url)}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => window.open(link.url, "_blank")}
                  className="p-1 hover:bg-surface-hover rounded text-content-muted hover:text-content-primary"
                  title="Open link"
                >
                  <ExternalLink size={14} />
                </button>
                <div className="relative" ref={openDropdownId === link._id ? dropdownRef : null}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDropdownToggle(link._id, e)
                    }}
                    className="p-1 hover:bg-surface-hover rounded text-content-muted hover:text-content-primary"
                  >
                    <MoreVertical size={14} />
                  </button>
                  {openDropdownId === link._id && (
                    <div
                      className={`absolute right-0 bg-surface-button border border-border rounded-lg shadow-lg z-50 min-w-[120px] py-1 ${dropdownPosition[link._id] === 'top' ? 'bottom-full mb-1' : 'top-6'
                        }`}
                    >
                      <button
                        onClick={() => handleEditClick(link)}
                        className="w-full px-3 py-2 text-left text-xs hover:bg-surface-hover flex items-center gap-2 text-content-primary"
                      >
                        <Edit size={12} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(link._id)}
                        className="w-full px-3 py-2 text-left text-xs hover:bg-surface-hover text-accent-red flex items-center gap-2"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {customLinks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-content-faint">
            <div className="w-12 h-12 rounded-full bg-surface-dark flex items-center justify-center mb-3">
              <ExternalLink size={20} className="text-content-faint" />
            </div>
            <p className="text-sm">No links yet</p>
            <p className="text-xs mt-1">Click + to add a link</p>
          </div>
        )}
      </div>

      {/* Modal - rendered via portal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[99999] p-4">
          <WebsiteLinkModal
            link={editingLink}
            onClose={() => {
              setIsModalOpen(false)
              setEditingLink(null)
            }}
            onSave={handleSaveLink}
          />
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal - rendered via portal */}
      {linkToDelete && createPortal(
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[99999]">
          <div className="bg-surface-card rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 text-content-primary">Delete Link</h3>
            <p className="text-content-secondary mb-6">
              Are you sure you want to delete this link? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setLinkToDelete(null)}
                className="px-4 py-2 bg-surface-button text-content-secondary rounded-xl hover:bg-surface-button-hover"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-accent-red text-white rounded-xl hover:bg-accent-red/90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default WebsiteLinksWidget