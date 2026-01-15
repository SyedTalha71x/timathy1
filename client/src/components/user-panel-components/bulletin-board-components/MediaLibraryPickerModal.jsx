/* eslint-disable react/prop-types */
import { useState, useMemo } from 'react'
import { X, Search, Folder as FolderIcon, Image as ImageIcon } from 'lucide-react'
import { mediaLibraryFolders, mediaLibraryDesigns } from '../../../utils/user-panel-states/bulletin-board-states'

export default function MediaLibraryPickerModal({ isOpen, onClose, onSelectImage }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFolderId, setSelectedFolderId] = useState('all')
  const [selectedDesign, setSelectedDesign] = useState(null)

  // Filter designs based on search and folder
  const filteredDesigns = useMemo(() => {
    let designs = mediaLibraryDesigns

    if (selectedFolderId !== 'all') {
      designs = designs.filter(d => d.folderId === selectedFolderId)
    }

    if (searchQuery.trim()) {
      designs = designs.filter(d => 
        d.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return designs
  }, [searchQuery, selectedFolderId])

  const selectedFolder = mediaLibraryFolders.find(f => f.id === selectedFolderId)

  const handleSelect = () => {
    if (selectedDesign) {
      onSelectImage(selectedDesign.thumbnail)
      onClose()
      setSelectedDesign(null)
      setSearchQuery('')
      setSelectedFolderId('all')
    }
  }

  const handleClose = () => {
    onClose()
    setSelectedDesign(null)
    setSearchQuery('')
    setSelectedFolderId('all')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60]">
      <div className="bg-[#1C1C1C] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <ImageIcon className="text-orange-400" size={24} />
            <h2 className="text-lg md:text-xl font-semibold text-white">Select from Media Library</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Folders */}
          <div className="hidden md:flex flex-col w-56 border-r border-gray-700 bg-[#141414]">
            <div className="p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Folders</h3>
              <div className="space-y-1">
                {mediaLibraryFolders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolderId(folder.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      selectedFolderId === folder.id
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'text-gray-300 hover:bg-[#2F2F2F]'
                    }`}
                  >
                    <FolderIcon size={18} style={{ color: folder.color }} />
                    <span className="truncate">{folder.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search & Mobile Folder Select */}
            <div className="p-4 space-y-3 border-b border-gray-700/50">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search designs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              {/* Mobile Folder Select */}
              <div className="md:hidden">
                <select
                  value={selectedFolderId}
                  onChange={(e) => setSelectedFolderId(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-gray-700 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-orange-500"
                >
                  {mediaLibraryFolders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current folder indicator */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Showing:</span>
                <span className="text-white font-medium flex items-center gap-2">
                  <FolderIcon size={14} style={{ color: selectedFolder?.color }} />
                  {selectedFolder?.name}
                </span>
                <span className="text-gray-500">({filteredDesigns.length} designs)</span>
              </div>
            </div>

            {/* Designs Grid */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {filteredDesigns.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                  {filteredDesigns.map((design) => (
                    <button
                      key={design.id}
                      onClick={() => setSelectedDesign(design)}
                      className={`group relative rounded-xl overflow-hidden border-2 transition-all ${
                        selectedDesign?.id === design.id
                          ? 'border-orange-500 ring-2 ring-orange-500/30'
                          : 'border-transparent hover:border-gray-600'
                      }`}
                    >
                      <div className="aspect-video bg-black">
                        <img
                          src={design.thumbnail}
                          alt={design.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-white text-xs font-medium truncate opacity-0 group-hover:opacity-100 transition-opacity">
                          {design.name}
                        </p>
                      </div>
                      {selectedDesign?.id === design.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <ImageIcon size={48} className="text-gray-600 mb-4" />
                  <p className="text-gray-400 text-sm">No designs found</p>
                  <p className="text-gray-500 text-xs mt-1">Try a different search or folder</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 md:p-6 border-t border-gray-700 bg-[#141414]">
          <div className="text-sm text-gray-400">
            {selectedDesign ? (
              <span>Selected: <span className="text-white font-medium">{selectedDesign.name}</span></span>
            ) : (
              <span>Select a design to use as cover image</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2.5 bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white rounded-xl text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSelect}
              disabled={!selectedDesign}
              className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors"
            >
              Use Selected
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2F2F2F;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #555;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #777;
        }
      `}</style>
    </div>
  )
}
