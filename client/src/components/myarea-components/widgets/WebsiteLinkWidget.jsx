/* eslint-disable react/prop-types */
// components/widgets/WebsiteLinksWidget.jsx
import { useState } from "react"
import { Plus, ExternalLink, MoreVertical } from "lucide-react"

const WebsiteLinksWidget = ({ 
  isEditing, 
  onRemove,
  customLinks = [],
  onAddLink,
  onEditLink,
  onRemoveLink
}) => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null)

  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index)
  }

  const truncateUrl = (url, maxLength = 40) => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength - 3) + "..."
  }

  return (
    <div className="space-y-3 p-4 rounded-xl bg-[#2F2F2F] md:h-[340px] h-auto flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Website Links</h2>
        <div className="flex items-center gap-2">
          {isEditing && (
            <button
              onClick={onRemove}
              className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              title="Remove Widget"
            >
              <MoreVertical size={16} />
            </button>
          )}
          <button
            onClick={onAddLink}
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Links List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        <div className="grid grid-cols-1 gap-3">
          {customLinks.map((link) => (
            <div
              key={link.id}
              className="p-3 bg-black rounded-xl flex items-center justify-between"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium truncate">{link.title}</h3>
                <p className="text-xs mt-1 text-zinc-400 truncate max-w-[200px]">
                  {truncateUrl(link.url)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.open(link.url, "_blank")}
                  className="p-2 hover:bg-zinc-700 rounded-lg"
                >
                  <ExternalLink size={16} />
                </button>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleDropdown(`link-${link.id}`)
                    }}
                    className="p-2 hover:bg-zinc-700 rounded-lg"
                  >
                    <MoreVertical size={16} />
                  </button>
                  {openDropdownIndex === `link-${link.id}` && (
                    <div className="absolute right-0 top-full mt-1 w-32 bg-zinc-800 rounded-lg shadow-lg z-50 py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onEditLink(link)
                          setOpenDropdownIndex(null)
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onRemoveLink(link.id)
                          setOpenDropdownIndex(null)
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-700 text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WebsiteLinksWidget