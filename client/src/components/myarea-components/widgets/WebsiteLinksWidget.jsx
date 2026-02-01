/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { Plus, ExternalLink, MoreVertical, X, Edit, Trash2 } from "lucide-react"

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
    
    if (link?.id) {
      // Edit existing link
      onSave(link.id, { title: title.trim(), url: url.trim() })
    } else {
      // Add new link
      const newLink = {
        id: `link${Date.now()}`,
        url: url.trim(),
        title: title.trim(),
      }
      onSave(null, newLink)
    }
    onClose()
  }

  return (
    <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">
            {link ? "Edit Website Link" : "Add Website Link"}
          </h2>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-zinc-700 rounded text-gray-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-black rounded-xl text-sm outline-none text-white placeholder-gray-500"
              placeholder="Enter title"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-3 bg-black rounded-xl text-sm outline-none text-white placeholder-gray-500"
              placeholder="https://example.com"
            />
          </div>
        </div>
        
        <div className="flex gap-3 justify-end mt-6">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#3F3F3F] text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || !url.trim()}
            className={`px-4 py-2 text-sm rounded-xl ${
              !title.trim() || !url.trim() 
                ? "bg-orange-600/50 cursor-not-allowed text-gray-400" 
                : "bg-orange-500 hover:bg-orange-600 text-white"
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
// Website Links Widget Component
// ============================================
const WebsiteLinksWidget = ({ 
  isEditing, 
  onRemove,
  customLinks = [],
  onAddLink,
  onEditLink,
  onRemoveLink,
  showHeader = true
}) => {
  const [openDropdownId, setOpenDropdownId] = useState(null)
  const [dropdownPosition, setDropdownPosition] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLink, setEditingLink] = useState(null)
  const [linkToDelete, setLinkToDelete] = useState(null)
  const dropdownRef = useRef(null)
  const dropdownButtonRefs = useRef({})

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
    const dropdownHeight = 80 // Approximate height of dropdown menu
    const spaceBelow = viewportHeight - rect.bottom
    const spaceAbove = rect.top

    // Determine if dropdown should open upwards
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

  const handleSaveLink = (id, linkData) => {
    if (id) {
      // Edit existing link
      onEditLink(linkData)
    } else {
      // Add new link
      onAddLink(linkData)
    }
    setIsModalOpen(false)
    setEditingLink(null)
  }

  const handleDeleteClick = (linkId) => {
    setLinkToDelete(linkId)
    setOpenDropdownId(null)
  }

  const confirmDelete = () => {
    if (linkToDelete) {
      onRemoveLink(linkToDelete)
      setLinkToDelete(null)
    }
  }

  const truncateUrl = (url, maxLength = 60) => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength - 3) + "..."
  }

  return (
    <div className="space-y-3 p-4 rounded-xl bg-[#2F2F2F] md:h-[340px] h-auto flex flex-col">
      {/* Header */}
      {showHeader && (
        <div className="flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg font-semibold">Website Links</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddClick}
              className="p-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
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
            className="p-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
            title="Add link"
          >
            <Plus size={18} />
          </button>
        </div>
      )}

      {/* Links List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-1.5">
        {customLinks.map((link) => (
          <div
            key={link.id}
            className="p-3 rounded-xl bg-[#1a1a1a] hover:bg-gray-800 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-white truncate" style={{ wordBreak: 'break-word' }}>
                  {link.title}
                </h3>
                <p className="text-xs mt-1 text-gray-400 truncate">
                  {truncateUrl(link.url)}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => window.open(link.url, "_blank")}
                  className="p-1 hover:bg-zinc-700 rounded text-gray-400 hover:text-white"
                  title="Open link"
                >
                  <ExternalLink size={14} />
                </button>
                <div className="relative" ref={openDropdownId === link.id ? dropdownRef : null}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDropdownToggle(link.id, e)
                    }}
                    className="p-1 hover:bg-zinc-700 rounded text-gray-400 hover:text-white"
                  >
                    <MoreVertical size={14} />
                  </button>
                  {openDropdownId === link.id && (
                    <div 
                      className={`absolute right-0 bg-[#2F2F2F] border border-gray-700 rounded-lg shadow-lg z-50 min-w-[120px] py-1 ${
                        dropdownPosition[link.id] === 'top' ? 'bottom-full mb-1' : 'top-6'
                      }`}
                    >
                      <button
                        onClick={() => handleEditClick(link)}
                        className="w-full px-3 py-2 text-left text-xs hover:bg-zinc-600 flex items-center gap-2 text-white"
                      >
                        <Edit size={12} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(link.id)}
                        className="w-full px-3 py-2 text-left text-xs hover:bg-zinc-600 text-red-400 flex items-center gap-2"
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
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3">
              <ExternalLink size={20} className="text-gray-600" />
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
          <div className="bg-[#181818] rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 text-white">Delete Link</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this link? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setLinkToDelete(null)}
                className="px-4 py-2 bg-[#2F2F2F] text-white rounded-xl hover:bg-[#3F3F3F]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
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
