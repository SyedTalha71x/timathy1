/* eslint-disable react/prop-types */
import { useState, useRef, useEffect, useCallback } from "react"
import { 
  X, 
  Check, 
  Plus, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  AlertTriangle
} from "lucide-react"
import { WysiwygEditor } from "../../shared/WysiwygEditor"

/**
 * IntroMaterialEditorModal - Multi-page document editor using WysiwygEditor
 * 
 * Features from WysiwygEditor:
 * - Undo/Redo buttons
 * - Font picker (Arial, Times New Roman, Georgia, Verdana, Courier New, Trebuchet MS, Comic Sans)
 * - Size picker (10px - 36px)
 * - Image resize with drag handles
 * - Image drag & drop repositioning
 * - Link and image modals
 * - Bold, italic, underline, strike, colors, lists, alignment
 */
const IntroMaterialEditorModal = ({ visible, onClose, material, onSave }) => {
  // State
  const [materialId, setMaterialId] = useState(null)
  const [materialName, setMaterialName] = useState("")
  const [pages, setPages] = useState([])
  const [activePageIndex, setActivePageIndex] = useState(0)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [editorKey, setEditorKey] = useState(0)
  
  // Refs
  const currentContentRef = useRef("")

  // Initialize when modal opens
  useEffect(() => {
    if (visible && material) {
      const initPages = material.pages.map(p => ({
        ...p,
        id: p.id || Date.now() + Math.random(),
        title: p.title || "Untitled Page",
        content: p.content || ""
      }))
      
      setMaterialId(material.id)
      setMaterialName(material.name || "")
      setPages(initPages)
      setActivePageIndex(0)
      setEditorKey(prev => prev + 1)
      setHasUnsavedChanges(false)
      currentContentRef.current = initPages[0]?.content || ""
    }
  }, [visible, material])

  // Handle content change from WysiwygEditor
  const handleContentChange = useCallback((content) => {
    currentContentRef.current = content
    setHasUnsavedChanges(true)
  }, [])

  // Page management
  const handleAddPage = () => {
    // Save current page content first
    const updatedPages = [...pages]
    updatedPages[activePageIndex] = { 
      ...updatedPages[activePageIndex], 
      content: currentContentRef.current 
    }
    
    const newPage = {
      id: Date.now(),
      title: `Page ${pages.length + 1}`,
      content: ""
    }
    
    setPages([...updatedPages, newPage])
    setActivePageIndex(updatedPages.length)
    setEditorKey(prev => prev + 1)
    setHasUnsavedChanges(true)
    currentContentRef.current = ""
  }

  const handleDeletePage = (index) => setShowDeleteConfirm(index)

  const confirmDeletePage = () => {
    const index = showDeleteConfirm
    if (index === null || pages.length <= 1) {
      setShowDeleteConfirm(null)
      return
    }
    
    // Save current content first if not deleting current page
    let updatedPages = [...pages]
    if (index !== activePageIndex) {
      updatedPages[activePageIndex] = { 
        ...updatedPages[activePageIndex], 
        content: currentContentRef.current 
      }
    }
    
    const newPages = updatedPages.filter((_, i) => i !== index)
    const newActiveIndex = index <= activePageIndex 
      ? Math.max(0, activePageIndex - 1)
      : activePageIndex
    
    setPages(newPages)
    setActivePageIndex(newActiveIndex)
    setEditorKey(prev => prev + 1)
    setShowDeleteConfirm(null)
    setHasUnsavedChanges(true)
    currentContentRef.current = newPages[newActiveIndex]?.content || ""
  }

  const handlePageChange = (newIndex) => {
    if (newIndex === activePageIndex || newIndex < 0 || newIndex >= pages.length) return
    
    // Save current page content before switching
    const updatedPages = [...pages]
    updatedPages[activePageIndex] = { 
      ...updatedPages[activePageIndex], 
      content: currentContentRef.current 
    }
    
    setPages(updatedPages)
    setActivePageIndex(newIndex)
    setEditorKey(prev => prev + 1)
    currentContentRef.current = updatedPages[newIndex]?.content || ""
  }

  const handleMovePage = (fromIndex, direction) => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1
    if (toIndex < 0 || toIndex >= pages.length) return
    
    // Save current page content first
    const updatedPages = [...pages]
    updatedPages[activePageIndex] = { 
      ...updatedPages[activePageIndex], 
      content: currentContentRef.current 
    }
    
    // Swap pages
    const temp = updatedPages[fromIndex]
    updatedPages[fromIndex] = updatedPages[toIndex]
    updatedPages[toIndex] = temp
    
    // Update active page index if needed
    let newActiveIndex = activePageIndex
    if (activePageIndex === fromIndex) {
      newActiveIndex = toIndex
    } else if (activePageIndex === toIndex) {
      newActiveIndex = fromIndex
    }
    
    setPages(updatedPages)
    setActivePageIndex(newActiveIndex)
    setHasUnsavedChanges(true)
  }

  const handlePageTitleChange = (title) => {
    setPages(prev => {
      const newPages = [...prev]
      newPages[activePageIndex] = { ...newPages[activePageIndex], title }
      return newPages
    })
    setHasUnsavedChanges(true)
  }

  // Save handler
  const handleSave = () => {
    // Build final pages array with current content
    const finalPages = pages.map((page, index) => {
      if (index === activePageIndex) {
        return { ...page, content: currentContentRef.current }
      }
      return page
    })
    
    // Build final material object
    const finalMaterial = {
      id: materialId,
      name: materialName,
      pages: finalPages
    }
    
    onSave(finalMaterial)
    setHasUnsavedChanges(false)
    onClose()
  }

  const handleCloseAttempt = () => {
    if (hasUnsavedChanges) {
      setShowExitConfirm(true)
    } else {
      onClose()
    }
  }

  // Don't render if not visible or no pages
  if (!visible || pages.length === 0) return null

  const currentPage = pages[activePageIndex]
  const currentContent = currentPage?.content || ""

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#333333]">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCloseAttempt}
              className="p-2 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={materialName}
              onChange={(e) => {
                setMaterialName(e.target.value)
                setHasUnsavedChanges(true)
              }}
              placeholder="Untitled Material"
              className="bg-[#141414] text-white text-lg font-semibold outline-none border border-[#333333] focus:border-orange-500 rounded-lg px-3 py-1.5 min-w-[200px]"
            />
            {hasUnsavedChanges && (
              <span className="text-xs text-orange-400">Unsaved changes</span>
            )}
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Save
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Slides Sidebar */}
          <div className="w-48 bg-[#141414] border-r border-[#333333] flex flex-col">
            <div className="p-3 border-b border-[#333333]">
              <button
                onClick={handleAddPage}
                className="w-full px-3 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Page
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {pages.map((page, pageIndex) => (
                <div
                  key={page.id}
                  className={`group relative cursor-pointer rounded-lg border-2 transition-all overflow-hidden ${
                    pageIndex === activePageIndex
                      ? "border-orange-500"
                      : "border-[#333333] hover:border-[#444444]"
                  }`}
                  onClick={() => handlePageChange(pageIndex)}
                >
                  <div className="aspect-[4/3] bg-white p-1 overflow-hidden">
                    <div 
                      className="w-full h-full overflow-hidden pointer-events-none"
                      style={{ 
                        transform: 'scale(0.18)', 
                        transformOrigin: 'top left', 
                        width: '555%', 
                        height: '555%',
                        fontSize: '11px',
                        padding: '6px',
                        color: '#000',
                        lineHeight: '1.4',
                        fontFamily: 'Arial, Helvetica, sans-serif'
                      }}
                      dangerouslySetInnerHTML={{ __html: page.content || '<p style="color:#bbb">Empty</p>' }}
                    />
                  </div>
                  <div className="p-1.5 bg-[#1C1C1C] flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 truncate flex-1">
                      {pageIndex + 1}. {page.title || "Untitled"}
                    </span>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {pageIndex > 0 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMovePage(pageIndex, 'up') }}
                          className="p-0.5 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded"
                          title="Move up"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                      )}
                      {pageIndex < pages.length - 1 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMovePage(pageIndex, 'down') }}
                          className="p-0.5 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded"
                          title="Move down"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      )}
                      {pages.length > 1 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeletePage(pageIndex) }}
                          className="p-0.5 text-red-400 hover:bg-red-500/20 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-2 border-t border-[#333333] flex items-center justify-between">
              <button
                onClick={() => handlePageChange(activePageIndex - 1)}
                disabled={activePageIndex === 0}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded-lg disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-400">
                {activePageIndex + 1} / {pages.length}
              </span>
              <button
                onClick={() => handlePageChange(activePageIndex + 1)}
                disabled={activePageIndex === pages.length - 1}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded-lg disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 flex flex-col bg-[#0f0f0f] overflow-hidden">
            {/* Page Title */}
            <div className="p-3 border-b border-[#333333] bg-[#141414]">
              <input
                type="text"
                value={currentPage?.title || ""}
                onChange={(e) => handlePageTitleChange(e.target.value)}
                placeholder="Page Title"
                className="w-full bg-transparent text-white text-lg font-semibold outline-none placeholder-gray-600"
              />
            </div>

            {/* WysiwygEditor */}
            <div className="flex-1 overflow-hidden p-4">
              <WysiwygEditor
                key={`editor-${editorKey}`}
                value={currentContent}
                onChange={handleContentChange}
                placeholder="Start writing your content..."
                minHeight={500}
                maxHeight={600}
                showImages={true}
                className="h-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Exit Confirmation */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[#1C1C1C] rounded-2xl p-6 w-full max-w-md shadow-2xl border border-[#333333]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-500/20 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Unsaved Changes</h3>
            </div>
            <p className="text-gray-400 mb-6">
              You have unsaved changes. Would you like to save before leaving?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => { 
                  setShowExitConfirm(false)
                  setHasUnsavedChanges(false)
                  onClose() 
                }} 
                className="flex-1 px-4 py-2.5 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F] flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Don&apos;t Save
              </button>
              <button 
                onClick={() => setShowExitConfirm(false)} 
                className="flex-1 px-4 py-2.5 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F]"
              >
                Cancel
              </button>
              <button 
                onClick={() => { 
                  setShowExitConfirm(false)
                  handleSave() 
                }} 
                className="flex-1 px-4 py-2.5 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[#1C1C1C] rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-[#333333]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-xl">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Delete Page</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this page? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(null)} 
                className="flex-1 px-4 py-2.5 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F]"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeletePage} 
                className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm rounded-xl hover:bg-red-600 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default IntroMaterialEditorModal
