/* eslint-disable react/prop-types */
import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { 
  X, 
  Check, 
  Plus, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  AlignLeft,
  AlignCenter,
  AlignRight
} from "lucide-react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

// Inject styles once globally - always update to latest version
const STYLE_ID = 'intro-material-editor-global-styles'
const injectStyles = () => {
  // Remove existing styles
  const existingStyle = document.getElementById(STYLE_ID)
  if (existingStyle) existingStyle.remove()
  
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    .intro-material-quill .ql-toolbar {
      border: none !important;
      background-color: #1C1C1C !important;
      border-bottom: 1px solid #333333 !important;
      padding: 12px !important;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .intro-material-quill .ql-container {
      border: none !important;
      font-family: Arial, Helvetica, sans-serif !important;
      font-size: 14px !important;
      height: 620px !important;
      min-height: 620px !important;
      max-height: 620px !important;
      overflow: hidden !important;
    }
    .intro-material-quill .ql-editor {
      background-color: #ffffff !important;
      color: #000000 !important;
      height: 580px !important;
      min-height: 580px !important;
      max-height: 580px !important;
      overflow: hidden !important;
      padding: 32px 40px !important;
      line-height: 1.5 !important;
      border-radius: 8px;
      margin: 16px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.25);
      box-sizing: border-box !important;
      resize: none !important;
    }
    .intro-material-quill .ql-editor > * {
      max-width: 100% !important;
      overflow-wrap: break-word !important;
      word-wrap: break-word !important;
    }
    .intro-material-quill .ql-editor p,
    .intro-material-quill .ql-editor h1,
    .intro-material-quill .ql-editor h2,
    .intro-material-quill .ql-editor h3,
    .intro-material-quill .ql-editor ul,
    .intro-material-quill .ql-editor ol {
      margin-bottom: 0.5em !important;
    }
    .intro-material-quill .ql-snow .ql-stroke {
      stroke: #9CA3AF !important;
    }
    .intro-material-quill .ql-snow .ql-fill {
      fill: #9CA3AF !important;
    }
    .intro-material-quill .ql-snow .ql-picker-label {
      color: #9CA3AF !important;
    }
    .intro-material-quill .ql-snow .ql-picker-label:hover,
    .intro-material-quill .ql-snow button:hover .ql-stroke,
    .intro-material-quill .ql-snow button:hover .ql-fill,
    .intro-material-quill .ql-snow button.ql-active .ql-stroke,
    .intro-material-quill .ql-snow button.ql-active .ql-fill {
      stroke: #FF843E !important;
      fill: #FF843E !important;
      color: #FF843E !important;
    }
    .intro-material-quill .ql-snow .ql-picker-options {
      background-color: #2F2F2F !important;
      border-color: #444444 !important;
      border-radius: 8px !important;
      padding: 8px !important;
    }
    .intro-material-quill .ql-snow .ql-picker-item {
      color: #ffffff !important;
    }
    .intro-material-quill .ql-snow .ql-picker-item:hover {
      color: #FF843E !important;
    }
    .intro-material-quill .ql-snow .ql-tooltip {
      position: fixed !important;
      left: 50% !important;
      top: 50% !important;
      transform: translate(-50%, -50%) !important;
      background-color: #2F2F2F !important;
      border-color: #444444 !important;
      color: #ffffff !important;
      border-radius: 12px !important;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5) !important;
      padding: 16px 20px !important;
      z-index: 9999 !important;
      white-space: nowrap !important;
    }
    .intro-material-quill .ql-snow .ql-tooltip::before {
      color: #9CA3AF !important;
      margin-right: 8px !important;
    }
    .intro-material-quill .ql-snow .ql-tooltip input[type="text"] {
      color: #000000 !important;
      background: #ffffff !important;
      border-radius: 6px !important;
      padding: 8px 12px !important;
      width: 280px !important;
      border: 1px solid #555 !important;
    }
    .intro-material-quill .ql-snow .ql-tooltip a {
      color: #FF843E !important;
      margin-left: 12px !important;
    }
    .intro-material-quill .ql-snow .ql-tooltip a.ql-action::after {
      content: 'Save' !important;
      border: none !important;
      padding: 6px 12px !important;
      background: #FF843E !important;
      border-radius: 6px !important;
      color: white !important;
      margin-left: 8px !important;
    }
    .intro-material-quill .ql-snow .ql-tooltip a.ql-remove::before {
      content: 'Remove' !important;
      margin-left: 8px !important;
    }
    .intro-material-quill .ql-editor img {
      max-width: 100%;
      max-height: 400px;
      width: auto;
      height: auto;
      cursor: pointer;
      border-radius: 6px;
      object-fit: contain;
    }
    .intro-material-quill .ql-editor img.img-selected {
      outline: 3px solid #FF843E;
      outline-offset: 2px;
    }
  `
  document.head.appendChild(style)
}

if (typeof document !== 'undefined') {
  injectStyles()
}

const IntroMaterialEditorModal = ({
  visible,
  onClose,
  material,
  onSave
}) => {
  // Core state - pages stored separately for proper management
  const [materialName, setMaterialName] = useState("")
  const [materialId, setMaterialId] = useState(null)
  const [pages, setPages] = useState([])
  const [activePageIndex, setActivePageIndex] = useState(0)
  const [editorKey, setEditorKey] = useState(0) // Key to force remount editor
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  // UI state
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imageToolbar, setImageToolbar] = useState({ visible: false, x: 0, y: 0 })
  
  // Refs
  const quillRef = useRef(null)
  const imageInputRef = useRef(null)
  const containerRef = useRef(null)
  const lastValidContent = useRef("") // Store last valid content for overflow prevention

  // Memoized modules
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: () => imageInputRef.current?.click()
      }
    },
    clipboard: { matchVisual: false }
  }), [])

  const formats = useMemo(() => [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'align',
    'link', 'image', 'width', 'height', 'style'
  ], [])

  // Get current editor content directly from Quill DOM
  const getEditorContent = useCallback(() => {
    const quill = quillRef.current?.getEditor()
    return quill ? quill.root.innerHTML : ""
  }, [])

  // Save current page content to pages array
  const saveCurrentPageContent = useCallback(() => {
    const content = getEditorContent()
    if (content && pages[activePageIndex]) {
      setPages(prev => {
        const newPages = [...prev]
        newPages[activePageIndex] = { ...newPages[activePageIndex], content }
        return newPages
      })
    }
    return content
  }, [activePageIndex, getEditorContent, pages])

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
      setEditorKey(prev => prev + 1) // Force new editor instance
      setHasUnsavedChanges(false)
      setSelectedImage(null)
      setImageToolbar({ visible: false, x: 0, y: 0 })
      lastValidContent.current = initPages[0]?.content || "" // Initialize last valid content
    }
  }, [visible, material])

  // Setup image click handlers after editor mounts
  useEffect(() => {
    if (!visible || pages.length === 0) return

    const timer = setTimeout(() => {
      const editor = document.querySelector('.intro-material-quill .ql-editor')
      if (!editor) return

      const handleClick = (e) => {
        if (e.target.tagName === 'IMG') {
          e.stopPropagation()
          editor.querySelectorAll('img.img-selected').forEach(img => img.classList.remove('img-selected'))
          e.target.classList.add('img-selected')
          setSelectedImage(e.target)
          
          const rect = e.target.getBoundingClientRect()
          const containerRect = containerRef.current?.getBoundingClientRect()
          if (containerRect) {
            setImageToolbar({
              visible: true,
              x: rect.left - containerRect.left + rect.width / 2,
              y: rect.top - containerRect.top - 50
            })
          }
        } else {
          editor.querySelectorAll('img.img-selected').forEach(img => img.classList.remove('img-selected'))
          setSelectedImage(null)
          setImageToolbar({ visible: false, x: 0, y: 0 })
        }
      }

      editor.addEventListener('click', handleClick)
      return () => editor.removeEventListener('click', handleClick)
    }, 300)

    return () => clearTimeout(timer)
  }, [visible, pages.length, editorKey])

  // Image handlers
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const quill = quillRef.current?.getEditor()
      if (quill) {
        const range = quill.getSelection(true)
        const beforeContent = quill.root.innerHTML
        quill.insertEmbed(range.index, 'image', event.target?.result)
        quill.setSelection(range.index + 1)
        
        // Check if image caused overflow
        requestAnimationFrame(() => {
          const editor = quill.root
          if (editor.scrollHeight > editor.clientHeight + 5) {
            // Image caused overflow - revert
            quill.clipboard.dangerouslyPasteHTML(beforeContent)
          } else {
            lastValidContent.current = editor.innerHTML
            setHasUnsavedChanges(true)
          }
        })
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleImageResize = (percentage) => {
    if (!selectedImage) return
    const previousWidth = selectedImage.style.width
    selectedImage.style.width = `${percentage}%`
    selectedImage.style.height = 'auto'
    
    // Check if resize caused overflow
    const quill = quillRef.current?.getEditor()
    if (quill) {
      requestAnimationFrame(() => {
        const editor = quill.root
        if (editor.scrollHeight > editor.clientHeight + 5) {
          // Revert resize
          selectedImage.style.width = previousWidth
        } else {
          lastValidContent.current = editor.innerHTML
          setHasUnsavedChanges(true)
        }
      })
    }
  }

  const handleImageAlign = (align) => {
    if (!selectedImage) return
    selectedImage.style.float = 'none'
    selectedImage.style.display = 'block'
    selectedImage.style.marginLeft = '0'
    selectedImage.style.marginRight = '0'
    
    if (align === 'left') {
      selectedImage.style.float = 'left'
      selectedImage.style.marginRight = '16px'
      selectedImage.style.marginBottom = '8px'
    } else if (align === 'center') {
      selectedImage.style.marginLeft = 'auto'
      selectedImage.style.marginRight = 'auto'
    } else if (align === 'right') {
      selectedImage.style.float = 'right'
      selectedImage.style.marginLeft = '16px'
      selectedImage.style.marginBottom = '8px'
    }
    
    const quill = quillRef.current?.getEditor()
    if (quill) {
      lastValidContent.current = quill.root.innerHTML
    }
    setHasUnsavedChanges(true)
  }

  const handleImageDelete = () => {
    if (!selectedImage) return
    selectedImage.remove()
    setSelectedImage(null)
    setImageToolbar({ visible: false, x: 0, y: 0 })
    
    const quill = quillRef.current?.getEditor()
    if (quill) {
      lastValidContent.current = quill.root.innerHTML
    }
    setHasUnsavedChanges(true)
  }

  // Content change handler - prevent overflow
  const handleContentChange = useCallback((content, delta, source) => {
    if (source !== 'user') return
    
    const quill = quillRef.current?.getEditor()
    if (!quill) return
    
    const editor = quill.root
    
    // Check if content overflows the fixed height
    // scrollHeight > clientHeight means content is larger than visible area
    requestAnimationFrame(() => {
      if (editor.scrollHeight > editor.clientHeight + 5) {
        // Content overflows - revert to last valid content
        quill.clipboard.dangerouslyPasteHTML(lastValidContent.current)
        // Move cursor to end
        quill.setSelection(quill.getLength() - 1)
      } else {
        // Content fits - save as last valid
        lastValidContent.current = editor.innerHTML
        setHasUnsavedChanges(true)
      }
    })
  }, [])

  // Page management
  const handleAddPage = () => {
    // Save current page content first
    const currentContent = getEditorContent()
    const updatedPages = [...pages]
    updatedPages[activePageIndex] = { ...updatedPages[activePageIndex], content: currentContent }
    
    const newPage = {
      id: Date.now(),
      title: `Page ${pages.length + 1}`,
      content: ""
    }
    
    setPages([...updatedPages, newPage])
    setActivePageIndex(updatedPages.length)
    setEditorKey(prev => prev + 1) // Force new editor
    setHasUnsavedChanges(true)
    setSelectedImage(null)
    setImageToolbar({ visible: false, x: 0, y: 0 })
    lastValidContent.current = "" // New page starts empty
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
      const currentContent = getEditorContent()
      updatedPages[activePageIndex] = { ...updatedPages[activePageIndex], content: currentContent }
    }
    
    const newPages = updatedPages.filter((_, i) => i !== index)
    const newActiveIndex = index <= activePageIndex 
      ? Math.max(0, activePageIndex - 1)
      : activePageIndex
    
    setPages(newPages)
    setActivePageIndex(newActiveIndex)
    setEditorKey(prev => prev + 1) // Force editor remount
    setShowDeleteConfirm(null)
    setHasUnsavedChanges(true)
    setSelectedImage(null)
    setImageToolbar({ visible: false, x: 0, y: 0 })
    lastValidContent.current = newPages[newActiveIndex]?.content || "" // Set for remaining page
  }

  const handlePageChange = (newIndex) => {
    if (newIndex === activePageIndex || newIndex < 0 || newIndex >= pages.length) return
    
    // Save current page content before switching
    const currentContent = getEditorContent()
    const updatedPages = [...pages]
    updatedPages[activePageIndex] = { ...updatedPages[activePageIndex], content: currentContent }
    
    setPages(updatedPages)
    setActivePageIndex(newIndex)
    setEditorKey(prev => prev + 1) // Force new editor with new content
    setSelectedImage(null)
    setImageToolbar({ visible: false, x: 0, y: 0 })
    lastValidContent.current = updatedPages[newIndex]?.content || "" // Set for new page
  }

  const handleMovePage = (fromIndex, direction) => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1
    if (toIndex < 0 || toIndex >= pages.length) return
    
    // Save current page content first
    const currentContent = getEditorContent()
    const updatedPages = [...pages]
    updatedPages[activePageIndex] = { ...updatedPages[activePageIndex], content: currentContent }
    
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

  // Save handler - builds final material and calls onSave
  const handleSave = () => {
    // Get current editor content (includes all image modifications)
    const currentContent = getEditorContent()
    
    // Build final pages array with current content
    const finalPages = pages.map((page, index) => {
      if (index === activePageIndex) {
        return { ...page, content: currentContent }
      }
      return page
    })
    
    // Build final material object
    const finalMaterial = {
      id: materialId,
      name: materialName,
      pages: finalPages
    }
    
    console.log('Saving material:', finalMaterial) // Debug
    
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
          <div className="flex-1 flex flex-col bg-[#0f0f0f] overflow-hidden relative" ref={containerRef}>
            <div className="p-3 border-b border-[#333333] bg-[#141414]">
              <input
                type="text"
                value={currentPage?.title || ""}
                onChange={(e) => handlePageTitleChange(e.target.value)}
                placeholder="Page Title"
                className="w-full bg-transparent text-white text-lg font-semibold outline-none placeholder-gray-600"
              />
            </div>

            {/* Image Toolbar */}
            {imageToolbar.visible && selectedImage && (
              <div 
                className="absolute z-50 bg-[#1C1C1C] rounded-xl shadow-xl border border-[#333333] p-2 flex items-center gap-1"
                style={{ 
                  left: `${Math.max(100, Math.min(imageToolbar.x, (containerRef.current?.offsetWidth || 500) - 200))}px`, 
                  top: `${Math.max(60, imageToolbar.y)}px`,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="flex items-center gap-1 pr-2 border-r border-[#333333]">
                  {[['S',25], ['M',50], ['L',75], ['XL',100]].map(([label, size]) => (
                    <button key={label} onClick={() => handleImageResize(size)} className="px-2 py-1 text-xs text-gray-300 hover:bg-[#2F2F2F] rounded">
                      {label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1 pr-2 border-r border-[#333333]">
                  <button onClick={() => handleImageAlign('left')} className="p-1.5 text-gray-300 hover:bg-[#2F2F2F] rounded"><AlignLeft className="w-4 h-4" /></button>
                  <button onClick={() => handleImageAlign('center')} className="p-1.5 text-gray-300 hover:bg-[#2F2F2F] rounded"><AlignCenter className="w-4 h-4" /></button>
                  <button onClick={() => handleImageAlign('right')} className="p-1.5 text-gray-300 hover:bg-[#2F2F2F] rounded"><AlignRight className="w-4 h-4" /></button>
                </div>
                <button onClick={handleImageDelete} className="p-1.5 text-red-400 hover:bg-red-500/20 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            )}

            {/* Quill Editor - key forces remount on page change */}
            <div className="flex-1 overflow-hidden bg-[#2a2a2a] intro-material-quill flex items-start justify-center">
              <div className="w-full max-w-4xl h-full overflow-hidden">
                <ReactQuill
                  key={`editor-${editorKey}`}
                  ref={quillRef}
                  defaultValue={currentContent}
                  onChange={handleContentChange}
                  modules={modules}
                  formats={formats}
                  theme="snow"
                  preserveWhitespace
                />
              </div>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
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
              <div className="p-2 bg-orange-500/20 rounded-xl"><AlertTriangle className="w-6 h-6 text-orange-400" /></div>
              <h3 className="text-lg font-semibold text-white">Unsaved Changes</h3>
            </div>
            <p className="text-gray-400 mb-6">You have unsaved changes. Would you like to save before leaving?</p>
            <div className="flex gap-3">
              <button onClick={() => { setShowExitConfirm(false); setHasUnsavedChanges(false); onClose() }} className="flex-1 px-4 py-2.5 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F] flex items-center justify-center gap-2">
                <X className="w-4 h-4" />Don&apos;t Save
              </button>
              <button onClick={() => setShowExitConfirm(false)} className="flex-1 px-4 py-2.5 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F]">Cancel</button>
              <button onClick={() => { setShowExitConfirm(false); handleSave() }} className="flex-1 px-4 py-2.5 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />Save
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
              <div className="p-2 bg-red-500/20 rounded-xl"><Trash2 className="w-6 h-6 text-red-400" /></div>
              <h3 className="text-lg font-semibold text-white">Delete Page</h3>
            </div>
            <p className="text-gray-400 mb-6">Are you sure you want to delete this page? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2.5 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F]">Cancel</button>
              <button onClick={confirmDeletePage} className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm rounded-xl hover:bg-red-600 flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" />Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default IntroMaterialEditorModal
