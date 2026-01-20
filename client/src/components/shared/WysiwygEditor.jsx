/* eslint-disable react/prop-types */
import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import ReactQuill, { Quill } from "react-quill"
import "react-quill/dist/quill.snow.css"
import { X, Upload } from "lucide-react"

// Register custom fonts
const FontClass = Quill.import('formats/font')
FontClass.whitelist = ['arial', 'times-new-roman', 'georgia', 'verdana', 'courier-new', 'trebuchet-ms', 'comic-sans']
Quill.register(FontClass, true)

// Register custom sizes
const SizeStyle = Quill.import('attributors/style/size')
SizeStyle.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px']
Quill.register(SizeStyle, true)

// Editor Modal
const EditorModal = ({ show, onClose, title, children, onSubmit, submitText, submitDisabled = false }) => {
  if (!show) return null
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000]" onClick={onClose}>
      <div className="bg-[#1F1F1F] rounded-2xl p-5 w-full max-w-md mx-4 border border-[#333333] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        {children}
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-[#2F2F2F] text-white text-sm font-medium rounded-xl hover:bg-[#3F3F3F]">Cancel</button>
          <button onClick={onSubmit} disabled={submitDisabled} className="flex-1 px-4 py-2.5 bg-[#FF843E] text-white text-sm font-medium rounded-xl hover:bg-[#e0733a] disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed">{submitText}</button>
        </div>
      </div>
    </div>
  )
}

export const WysiwygEditor = ({ 
  value, 
  onChange, 
  placeholder = "Type something...", 
  minHeight = 120,
  maxHeight = 400,
  showImages = true,
  className = ""
}) => {
  const editorId = useRef(`editor-${Math.random().toString(36).substr(2, 9)}`).current
  const quillRef = useRef(null)
  const containerRef = useRef(null)
  const fileInputRef = useRef(null)
  
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [savedRange, setSavedRange] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imageRect, setImageRect] = useState(null)
  const isResizing = useRef(false)
  const isDraggingRef = useRef(false)
  
  const lastValueRef = useRef(value)
  const isInternalUpdate = useRef(false)

  // Update color indicators
  const updateColorIndicators = useCallback(() => {
    if (!containerRef.current) return
    const toolbar = containerRef.current.querySelector('.ql-toolbar')
    if (!toolbar) return

    const colorPicker = toolbar.querySelector('.ql-color .ql-picker-label')
    if (colorPicker) {
      const colorValue = colorPicker.getAttribute('data-value') || '#000000'
      let indicator = colorPicker.querySelector('.color-indicator')
      if (!indicator) {
        indicator = document.createElement('span')
        indicator.className = 'color-indicator'
        colorPicker.appendChild(indicator)
      }
      indicator.style.backgroundColor = colorValue || '#000000'
    }

    const bgPicker = toolbar.querySelector('.ql-background .ql-picker-label')
    if (bgPicker) {
      const bgValue = bgPicker.getAttribute('data-value') || '#ffff00'
      let indicator = bgPicker.querySelector('.color-indicator')
      if (!indicator) {
        indicator = document.createElement('span')
        indicator.className = 'color-indicator'
        bgPicker.appendChild(indicator)
      }
      indicator.style.backgroundColor = bgValue || '#ffff00'
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(updateColorIndicators, 100)
    if (containerRef.current) {
      const observer = new MutationObserver(updateColorIndicators)
      const toolbar = containerRef.current.querySelector('.ql-toolbar')
      if (toolbar) observer.observe(toolbar, { attributes: true, subtree: true, attributeFilter: ['data-value'] })
      return () => { clearTimeout(timer); observer.disconnect() }
    }
    return () => clearTimeout(timer)
  }, [updateColorIndicators])
  
  useEffect(() => {
    if (quillRef.current && value !== lastValueRef.current && !isInternalUpdate.current) {
      const quill = quillRef.current.getEditor()
      const selection = quill.getSelection()
      if (quill.root.innerHTML !== value) {
        quill.root.innerHTML = value || ''
        if (selection) try { quill.setSelection(selection) } catch (e) {}
      }
      lastValueRef.current = value
    }
  }, [value])
  
  const handleChange = (content, delta, source) => {
    if (source === 'user') {
      isInternalUpdate.current = true
      lastValueRef.current = content
      onChange(content)
      setTimeout(() => { isInternalUpdate.current = false; updateColorIndicators() }, 0)
    }
  }
  
  const linkHandler = useCallback(() => {
    const quill = quillRef.current?.getEditor()
    if (quill) {
      const range = quill.getSelection(true)
      setSavedRange(range)
      setLinkText(range.length > 0 ? quill.getText(range.index, range.length) : '')
      setLinkUrl('')
      setShowLinkModal(true)
    }
  }, [])

  const imageHandler = useCallback(() => {
    const quill = quillRef.current?.getEditor()
    if (quill) {
      setSavedRange(quill.getSelection(true))
      setImageUrl('')
      setShowImageModal(true)
    }
  }, [])

  const insertLink = () => {
    if (!linkUrl) return
    const quill = quillRef.current?.getEditor()
    if (quill && savedRange !== null) {
      if (savedRange.length > 0) quill.formatText(savedRange.index, savedRange.length, 'link', linkUrl)
      else if (linkText) quill.insertText(savedRange.index, linkText, 'link', linkUrl)
      else quill.insertText(savedRange.index, linkUrl, 'link', linkUrl)
      triggerOnChange(quill)
    }
    setShowLinkModal(false)
    setLinkUrl('')
    setLinkText('')
  }

  const insertImageFromUrl = () => {
    if (!imageUrl) return
    const quill = quillRef.current?.getEditor()
    if (quill && savedRange !== null) {
      quill.focus()
      quill.setSelection(savedRange.index, 0)
      quill.insertEmbed(savedRange.index, 'image', imageUrl, 'user')
      quill.setSelection(savedRange.index + 1)
      lastValueRef.current = quill.root.innerHTML
      onChange(quill.root.innerHTML)
    }
    setShowImageModal(false)
    setImageUrl('')
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const quill = quillRef.current?.getEditor()
      if (quill) {
        quill.focus()
        const range = quill.getSelection(true)
        quill.insertEmbed(range.index, 'image', reader.result, 'user')
        quill.setSelection(range.index + 1)
        lastValueRef.current = quill.root.innerHTML
        onChange(quill.root.innerHTML)
      }
    }
    reader.readAsDataURL(file)
    setShowImageModal(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const triggerOnChange = (quill) => {
    const newHtml = quill.root.innerHTML
    isInternalUpdate.current = true
    lastValueRef.current = newHtml
    onChange(newHtml)
    setTimeout(() => { isInternalUpdate.current = false }, 0)
  }

  const updateImageRect = useCallback((img) => {
    if (!img || !containerRef.current) { setImageRect(null); return }
    // Position relative to .ql-container (editor area only, not toolbar)
    const qlContainer = containerRef.current.querySelector('.ql-container')
    if (!qlContainer) { setImageRect(null); return }
    const containerRect = qlContainer.getBoundingClientRect()
    const imgRect = img.getBoundingClientRect()
    setImageRect({
      top: imgRect.top - containerRect.top,
      left: imgRect.left - containerRect.left,
      width: imgRect.width,
      height: imgRect.height
    })
  }, [])

  const handleContainerClick = (e) => {
    if (isResizing.current || isDraggingRef.current) return
    const img = e.target.closest('.ql-editor img')
    if (img && containerRef.current?.contains(img)) {
      e.preventDefault()
      e.stopPropagation()
      setSelectedImage(img)
      updateImageRect(img)
    } else if (!e.target.classList?.contains('resize-handle')) {
      setSelectedImage(null)
      setImageRect(null)
    }
  }

  const startResize = useCallback((e, direction) => {
    e.preventDefault()
    e.stopPropagation()
    const img = selectedImage
    if (!img) return
    
    isResizing.current = true
    const startX = e.clientX
    const startWidth = img.offsetWidth
    
    const overlay = document.createElement('div')
    overlay.id = 'resize-overlay'
    overlay.style.cssText = `position:fixed;inset:0;z-index:999999;cursor:ew-resize;user-select:none;`
    document.body.appendChild(overlay)
    img.style.opacity = '0.7'
    
    const doResize = (moveEvent) => {
      moveEvent.preventDefault()
      const deltaX = moveEvent.clientX - startX
      let newWidth = direction.includes('e') ? startWidth + deltaX : startWidth - deltaX
      const editor = containerRef.current?.querySelector('.ql-editor')
      const maxW = editor ? editor.clientWidth - 20 : 500
      newWidth = Math.max(50, Math.min(Math.round(newWidth), maxW))
      img.style.width = `${newWidth}px`
      img.style.height = 'auto'
      img.setAttribute('width', String(newWidth))
      img.removeAttribute('height')
      updateImageRect(img)
    }
    
    const stopResize = () => {
      overlay.remove()
      img.style.opacity = ''
      setSelectedImage(img)
      updateImageRect(img)
      setTimeout(() => { isResizing.current = false }, 100)
      if (quillRef.current) triggerOnChange(quillRef.current.getEditor())
    }
    
    overlay.addEventListener('mousemove', doResize)
    overlay.addEventListener('mouseup', stopResize)
    overlay.addEventListener('mouseleave', stopResize)
  }, [selectedImage, updateImageRect])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isResizing.current) return
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setSelectedImage(null)
        setImageRect(null)
      }
    }
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setSelectedImage(null)
        setImageRect(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  useEffect(() => {
    if (!selectedImage) return
    const handleUpdate = () => updateImageRect(selectedImage)
    window.addEventListener('resize', handleUpdate)
    window.addEventListener('scroll', handleUpdate, true)
    return () => { window.removeEventListener('resize', handleUpdate); window.removeEventListener('scroll', handleUpdate, true) }
  }, [selectedImage, updateImageRect])

  // Image drag & drop
  useEffect(() => {
    const editor = containerRef.current?.querySelector('.ql-editor')
    if (!editor) {
      const timer = setTimeout(() => {}, 100)
      return () => clearTimeout(timer)
    }

    let dragData = null

    const makeImagesDraggable = () => {
      editor.querySelectorAll('img').forEach(img => {
        if (!img.draggable) {
          img.draggable = true
          img.style.cursor = 'grab'
        }
      })
    }

    const observer = new MutationObserver(makeImagesDraggable)
    observer.observe(editor, { childList: true, subtree: true })
    makeImagesDraggable()

    const handleDragStart = (e) => {
      const img = e.target
      if (img.tagName !== 'IMG') return
      
      isDraggingRef.current = true
      setSelectedImage(null)
      setImageRect(null)
      
      dragData = {
        element: img,
        src: img.src,
        width: img.getAttribute('width') || img.offsetWidth
      }
      
      img.style.opacity = '0.4'
      img.style.cursor = 'grabbing'
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', 'image-drag')
    }

    const handleDragEnd = (e) => {
      if (e.target.tagName === 'IMG') {
        e.target.style.opacity = ''
        e.target.style.cursor = 'grab'
      }
      isDraggingRef.current = false
      dragData = null
    }

    const handleDragOver = (e) => {
      if (!dragData) return
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
    }

    const handleDrop = (e) => {
      if (!dragData) return
      e.preventDefault()
      e.stopPropagation()

      const quill = quillRef.current?.getEditor()
      if (!quill) return

      const { element, src, width } = dragData

      try {
        // Find original position
        const blot = Quill.find(element)
        if (!blot) {
          console.log('No blot found')
          return
        }
        const origIndex = quill.getIndex(blot)

        // Find drop position using caret
        let dropIndex = origIndex
        const range = document.caretRangeFromPoint(e.clientX, e.clientY)
        if (range && range.startContainer) {
          const dropBlot = Quill.find(range.startContainer, true)
          if (dropBlot) {
            dropIndex = quill.getIndex(dropBlot) + range.startOffset
          }
        }

        // Don't move if same position
        if (dropIndex === origIndex || dropIndex === origIndex + 1) {
          element.style.opacity = ''
          return
        }

        // Calculate adjusted index
        const adjustedIndex = dropIndex > origIndex ? dropIndex - 1 : dropIndex

        // Perform move
        quill.deleteText(origIndex, 1, 'silent')
        quill.insertEmbed(adjustedIndex, 'image', src, 'silent')

        // Restore width after insert
        requestAnimationFrame(() => {
          const images = editor.querySelectorAll('img')
          images.forEach(img => {
            if (img.src === src && width) {
              img.style.width = `${parseInt(width)}px`
              img.setAttribute('width', String(parseInt(width)))
              img.draggable = true
              img.style.cursor = 'grab'
            }
          })
          triggerOnChange(quill)
        })

      } catch (err) {
        console.error('Drop error:', err)
      }

      dragData = null
      isDraggingRef.current = false
    }

    editor.addEventListener('dragstart', handleDragStart)
    editor.addEventListener('dragend', handleDragEnd)
    editor.addEventListener('dragover', handleDragOver)
    editor.addEventListener('drop', handleDrop)

    return () => {
      observer.disconnect()
      editor.removeEventListener('dragstart', handleDragStart)
      editor.removeEventListener('dragend', handleDragEnd)
      editor.removeEventListener('dragover', handleDragOver)
      editor.removeEventListener('drop', handleDrop)
    }
  }, [])

  const toolbarConfig = useMemo(() => showImages 
    ? [
        ['undo', 'redo'],
        [{ 'font': ['arial', 'times-new-roman', 'georgia', 'verdana', 'courier-new', 'trebuchet-ms', 'comic-sans'] }],
        [{ 'size': ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ]
    : [
        [{ 'font': ['arial', 'times-new-roman', 'georgia', 'verdana', 'courier-new', 'trebuchet-ms', 'comic-sans'] }],
        [{ 'size': ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link'],
        ['clean']
      ], [showImages])

  const modules = useMemo(() => ({
    toolbar: {
      container: toolbarConfig,
      handlers: {
        link: linkHandler,
        image: imageHandler,
        undo: function() { this.quill.history.undo() },
        redo: function() { this.quill.history.redo() }
      }
    },
    history: { delay: 500, maxStack: 100, userOnly: false }
  }), [toolbarConfig, linkHandler, imageHandler])

  const formats = ['font', 'size', 'bold', 'italic', 'underline', 'strike', 'color', 'background', 'list', 'bullet', 'align', 'link', 'image']

  useEffect(() => {
    const style = document.createElement('style')
    style.id = `wysiwyg-style-${editorId}`
    style.textContent = `
      .wysiwyg-editor-${editorId} { position: relative; }
      .wysiwyg-editor-${editorId} .ql-container {
        border: none !important;
        background-color: #ffffff !important;
        font-family: Arial, sans-serif;
        border-radius: 0 0 12px 12px !important;
        overflow: hidden !important;
        position: relative !important;
      }
      .wysiwyg-editor-${editorId} .ql-editor {
        color: #000000 !important;
        background-color: #ffffff !important;
        min-height: ${minHeight}px;
        max-height: ${maxHeight}px;
        overflow-y: auto;
        font-size: 14px;
        line-height: 1.35;
        padding: 12px 16px;
        font-family: Arial, sans-serif;
      }
      .wysiwyg-editor-${editorId} .ql-editor.ql-blank::before { color: #9ca3af !important; font-style: normal !important; }
      .wysiwyg-editor-${editorId} .ql-editor p { margin-bottom: 0.1em; }
      .wysiwyg-editor-${editorId} .ql-editor img {
        max-width: 100%;
        height: auto;
        border-radius: 4px;
        margin: 4px 0;
        cursor: grab;
        transition: opacity 0.15s;
      }
      .wysiwyg-editor-${editorId} .ql-editor img:active { cursor: grabbing; }
      .wysiwyg-editor-${editorId} .ql-editor a { color: #2563eb; }
      
      .wysiwyg-editor-${editorId} .ql-editor .ql-font-arial { font-family: Arial, sans-serif; }
      .wysiwyg-editor-${editorId} .ql-editor .ql-font-times-new-roman { font-family: 'Times New Roman', serif; }
      .wysiwyg-editor-${editorId} .ql-editor .ql-font-georgia { font-family: Georgia, serif; }
      .wysiwyg-editor-${editorId} .ql-editor .ql-font-verdana { font-family: Verdana, sans-serif; }
      .wysiwyg-editor-${editorId} .ql-editor .ql-font-courier-new { font-family: 'Courier New', monospace; }
      .wysiwyg-editor-${editorId} .ql-editor .ql-font-trebuchet-ms { font-family: 'Trebuchet MS', sans-serif; }
      .wysiwyg-editor-${editorId} .ql-editor .ql-font-comic-sans { font-family: 'Comic Sans MS', cursive; }
      
      /* Toolbar */
      .wysiwyg-editor-${editorId} .ql-toolbar {
        border: none !important;
        border-bottom: 1px solid #333333 !important;
        background-color: #1a1a1a !important;
        padding: 6px 8px !important;
        display: flex !important;
        flex-wrap: nowrap !important;
        align-items: center !important;
        gap: 4px !important;
        min-height: 44px !important;
        overflow: visible !important;
        border-radius: 12px 12px 0 0 !important;
      }
      .wysiwyg-editor-${editorId} .ql-toolbar .ql-formats {
        margin: 0 !important;
        margin-right: 6px !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 2px !important;
        height: 36px !important;
      }
      
      /* All buttons same height as color pickers (36px) */
      .wysiwyg-editor-${editorId} .ql-snow.ql-toolbar button {
        width: 36px !important;
        height: 36px !important;
        padding: 8px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 6px !important;
        background: transparent !important;
        border: none !important;
      }
      .wysiwyg-editor-${editorId} .ql-snow.ql-toolbar button:hover { background-color: rgba(255,255,255,0.1) !important; }
      .wysiwyg-editor-${editorId} .ql-snow.ql-toolbar button.ql-active { background-color: rgba(255,132,62,0.2) !important; }
      
      /* SVG Icons */
      .wysiwyg-editor-${editorId} .ql-snow .ql-stroke { stroke: #a0a0a0 !important; stroke-width: 1.5 !important; }
      .wysiwyg-editor-${editorId} .ql-snow .ql-fill { fill: #a0a0a0 !important; }
      .wysiwyg-editor-${editorId} .ql-snow.ql-toolbar button:hover .ql-stroke { stroke: #ffffff !important; }
      .wysiwyg-editor-${editorId} .ql-snow.ql-toolbar button:hover .ql-fill { fill: #ffffff !important; }
      .wysiwyg-editor-${editorId} .ql-snow.ql-toolbar button.ql-active .ql-stroke { stroke: #FF843E !important; }
      .wysiwyg-editor-${editorId} .ql-snow.ql-toolbar button.ql-active .ql-fill { fill: #FF843E !important; }
      .wysiwyg-editor-${editorId} .ql-snow svg { width: 20px !important; height: 20px !important; }
      
      /* Undo/Redo */
      .wysiwyg-editor-${editorId} .ql-undo, .wysiwyg-editor-${editorId} .ql-redo { width: 36px !important; height: 36px !important; }
      .wysiwyg-editor-${editorId} .ql-undo::before, .wysiwyg-editor-${editorId} .ql-redo::before {
        content: ''; display: block; width: 20px; height: 20px;
        background-repeat: no-repeat; background-position: center; background-size: 20px;
      }
      .wysiwyg-editor-${editorId} .ql-undo::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a0a0a0' stroke-width='2'%3E%3Cpath d='M3 7v6h6'/%3E%3Cpath d='M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13'/%3E%3C/svg%3E");
      }
      .wysiwyg-editor-${editorId} .ql-redo::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a0a0a0' stroke-width='2'%3E%3Cpath d='M21 7v6h-6'/%3E%3Cpath d='M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7'/%3E%3C/svg%3E");
      }
      .wysiwyg-editor-${editorId} .ql-undo:hover::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2'%3E%3Cpath d='M3 7v6h6'/%3E%3Cpath d='M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13'/%3E%3C/svg%3E");
      }
      .wysiwyg-editor-${editorId} .ql-redo:hover::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2'%3E%3Cpath d='M21 7v6h-6'/%3E%3Cpath d='M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7'/%3E%3C/svg%3E");
      }
      
      /* Pickers - same height */
      .wysiwyg-editor-${editorId} .ql-snow .ql-picker {
        height: 36px !important;
        font-size: 12px !important;
        color: #a0a0a0 !important;
        display: inline-flex !important;
        align-items: center !important;
      }
      .wysiwyg-editor-${editorId} .ql-snow .ql-picker-label {
        padding: 0 6px !important;
        padding-right: 20px !important;
        border: none !important;
        border-radius: 6px !important;
        color: #a0a0a0 !important;
        display: inline-flex !important;
        align-items: center !important;
        height: 36px !important;
      }
      .wysiwyg-editor-${editorId} .ql-snow .ql-picker-label:hover { background-color: rgba(255,255,255,0.1) !important; color: #ffffff !important; }
      .wysiwyg-editor-${editorId} .ql-snow .ql-picker-label svg { width: 16px !important; height: 16px !important; right: 4px !important; }
      
      /* Picker dropdown */
      .wysiwyg-editor-${editorId} .ql-snow .ql-picker-options {
        display: none !important;
        background-color: #1f1f1f !important;
        border: 1px solid #333 !important;
        border-radius: 6px !important;
        padding: 4px !important;
        z-index: 99999 !important;
        max-height: 200px !important;
        overflow-y: auto !important;
        position: absolute !important;
        top: 100% !important;
        left: 0 !important;
        margin-top: 2px !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
      }
      .wysiwyg-editor-${editorId} .ql-snow .ql-picker.ql-expanded .ql-picker-options {
        display: block !important;
      }
      .wysiwyg-editor-${editorId} .ql-snow .ql-picker.ql-expanded { z-index: 99999 !important; }
      .wysiwyg-editor-${editorId} .ql-snow .ql-picker-item {
        color: #e5e5e5 !important;
        padding: 6px 10px !important;
        border-radius: 4px !important;
        font-size: 12px !important;
      }
      .wysiwyg-editor-${editorId} .ql-snow .ql-picker-item:hover { background-color: rgba(255,255,255,0.1) !important; }
      
      /* Font picker */
      .wysiwyg-editor-${editorId} .ql-snow .ql-font { width: 80px !important; }
      .wysiwyg-editor-${editorId} .ql-snow .ql-font .ql-picker-label::before,
      .wysiwyg-editor-${editorId} .ql-snow .ql-font .ql-picker-item::before { content: 'Arial' !important; }
      .wysiwyg-editor-${editorId} .ql-snow .ql-font [data-value="arial"]::before { content: 'Arial' !important; font-family: Arial !important; }
      .wysiwyg-editor-${editorId} .ql-snow .ql-font [data-value="times-new-roman"]::before { content: 'Times' !important; font-family: 'Times New Roman' !important; }
      .wysiwyg-editor-${editorId} .ql-snow .ql-font [data-value="georgia"]::before { content: 'Georgia' !important; font-family: Georgia !important; }
      .wysiwyg-editor-${editorId} .ql-snow .ql-font [data-value="verdana"]::before { content: 'Verdana' !important; font-family: Verdana !important; }
      .wysiwyg-editor-${editorId} .ql-snow .ql-font [data-value="courier-new"]::before { content: 'Courier' !important; font-family: 'Courier New' !important; }
      .wysiwyg-editor-${editorId} .ql-snow .ql-font [data-value="trebuchet-ms"]::before { content: 'Trebuchet' !important; font-family: 'Trebuchet MS' !important; }
      .wysiwyg-editor-${editorId} .ql-snow .ql-font [data-value="comic-sans"]::before { content: 'Comic' !important; font-family: 'Comic Sans MS' !important; }
      
      /* Size picker */
      .wysiwyg-editor-${editorId} .ql-snow .ql-size { width: 52px !important; }
      .wysiwyg-editor-${editorId} .ql-snow .ql-size .ql-picker-label::before,
      .wysiwyg-editor-${editorId} .ql-snow .ql-size .ql-picker-item::before { content: '14' !important; }
      .wysiwyg-editor-${editorId} .ql-snow .ql-size [data-value="10px"]::before { content: '10' !important; }
      .wysiwyg-editor-${editorId} .ql-snow .ql-size [data-value="12px"]::before { content: '12' !important; }
      .wysiwyg-editor-${editorId} .ql-snow .ql-size [data-value="14px"]::before { content: '14' !important; }
      .wysiwyg-editor-${editorId} .ql-snow .ql-size [data-value="16px"]::before { content: '16' !important; }
      .wysiwyg-editor-${editorId} .ql-snow .ql-size [data-value="18px"]::before { content: '18' !important; }
      .wysiwyg-editor-${editorId} .ql-snow .ql-size [data-value="20px"]::before { content: '20' !important; }
      .wysiwyg-editor-${editorId} .ql-snow .ql-size [data-value="24px"]::before { content: '24' !important; }
      .wysiwyg-editor-${editorId} .ql-snow .ql-size [data-value="28px"]::before { content: '28' !important; }
      .wysiwyg-editor-${editorId} .ql-snow .ql-size [data-value="32px"]::before { content: '32' !important; }
      .wysiwyg-editor-${editorId} .ql-snow .ql-size [data-value="36px"]::before { content: '36' !important; }
      
      /* Color pickers - 36px with icon + color bar */
      .wysiwyg-editor-${editorId} .ql-snow .ql-color-picker,
      .wysiwyg-editor-${editorId} .ql-snow .ql-background {
        width: 36px !important;
        height: 36px !important;
      }
      .wysiwyg-editor-${editorId} .ql-snow .ql-color-picker .ql-picker-label,
      .wysiwyg-editor-${editorId} .ql-snow .ql-background .ql-picker-label {
        padding: 0 !important;
        width: 36px !important;
        height: 36px !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: flex-start !important;
        padding-top: 6px !important;
        position: relative !important;
        border-radius: 6px !important;
      }
      .wysiwyg-editor-${editorId} .ql-snow .ql-color-picker .ql-picker-label svg,
      .wysiwyg-editor-${editorId} .ql-snow .ql-background .ql-picker-label svg { display: none !important; }
      
      .wysiwyg-editor-${editorId} .ql-snow .ql-color-picker .ql-picker-label::before {
        content: 'A';
        font-family: Arial, sans-serif;
        font-size: 18px;
        font-weight: 700;
        color: #a0a0a0;
        line-height: 1;
      }
      .wysiwyg-editor-${editorId} .ql-snow .ql-color-picker .ql-picker-label:hover::before { color: #ffffff; }
      
      .wysiwyg-editor-${editorId} .ql-snow .ql-background .ql-picker-label::before {
        content: '';
        width: 18px;
        height: 18px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a0a0a0' stroke-width='2'%3E%3Cpath d='m9 11-6 6v3h9l3-3'/%3E%3Cpath d='m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4'/%3E%3C/svg%3E");
        background-size: contain;
        background-repeat: no-repeat;
      }
      .wysiwyg-editor-${editorId} .ql-snow .ql-background .ql-picker-label:hover::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2'%3E%3Cpath d='m9 11-6 6v3h9l3-3'/%3E%3Cpath d='m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4'/%3E%3C/svg%3E");
      }
      
      .wysiwyg-editor-${editorId} .ql-snow .ql-color-picker .ql-picker-label .color-indicator,
      .wysiwyg-editor-${editorId} .ql-snow .ql-background .ql-picker-label .color-indicator {
        position: absolute !important;
        bottom: 5px !important;
        left: 6px !important;
        right: 6px !important;
        height: 4px !important;
        border-radius: 2px !important;
      }
      
      .wysiwyg-editor-${editorId} .ql-snow .ql-color-picker .ql-picker-options,
      .wysiwyg-editor-${editorId} .ql-snow .ql-background .ql-picker-options {
        padding: 6px !important;
        width: 168px !important;
      }
      .wysiwyg-editor-${editorId} .ql-snow .ql-color-picker .ql-picker-item,
      .wysiwyg-editor-${editorId} .ql-snow .ql-background .ql-picker-item {
        width: 20px !important;
        height: 20px !important;
        border-radius: 3px !important;
        margin: 2px !important;
        padding: 0 !important;
        border: 1px solid rgba(255,255,255,0.15) !important;
      }
      .wysiwyg-editor-${editorId} .ql-snow .ql-color-picker .ql-picker-item:hover,
      .wysiwyg-editor-${editorId} .ql-snow .ql-background .ql-picker-item:hover { border-color: #FF843E !important; }
      
      /* Align picker - same height, dropdown hidden by default */
      .wysiwyg-editor-${editorId} .ql-snow .ql-align { 
        width: 36px !important; 
        height: 36px !important; 
      }
      .wysiwyg-editor-${editorId} .ql-snow .ql-align .ql-picker-label {
        padding: 0 !important;
        width: 36px !important;
        height: 36px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding-right: 0 !important;
      }
      .wysiwyg-editor-${editorId} .ql-snow .ql-align .ql-picker-label svg { 
        width: 20px !important; 
        height: 20px !important; 
        position: static !important; 
        margin: 0 !important;
        right: auto !important;
      }
      .wysiwyg-editor-${editorId} .ql-snow .ql-align .ql-picker-options { 
        width: auto !important; 
        min-width: 120px !important;
      }
      .wysiwyg-editor-${editorId} .ql-snow .ql-align.ql-expanded .ql-picker-options {
        display: flex !important;
        flex-wrap: wrap !important;
      }
      .wysiwyg-editor-${editorId} .ql-snow .ql-align .ql-picker-item {
        width: 36px !important;
        height: 36px !important;
        padding: 8px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      .wysiwyg-editor-${editorId} .ql-snow .ql-align .ql-picker-item svg { width: 20px !important; height: 20px !important; }
      
      .wysiwyg-editor-${editorId} .ql-snow .ql-tooltip { display: none !important; }
      
      .wysiwyg-editor-${editorId} .ql-editor::-webkit-scrollbar { width: 6px; }
      .wysiwyg-editor-${editorId} .ql-editor::-webkit-scrollbar-track { background: #f0f0f0; }
      .wysiwyg-editor-${editorId} .ql-editor::-webkit-scrollbar-thumb { background: #c0c0c0; border-radius: 3px; }
    `
    document.head.appendChild(style)
    return () => { const s = document.getElementById(`wysiwyg-style-${editorId}`); if (s) document.head.removeChild(s) }
  }, [editorId, minHeight, maxHeight])

  // State for editor area bounds (for clipping the selection)
  const [editorBounds, setEditorBounds] = useState(null)
  
  // Update editor bounds when needed
  const updateEditorBounds = useCallback(() => {
    if (!containerRef.current) return
    const qlContainer = containerRef.current.querySelector('.ql-container')
    if (!qlContainer) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const qlRect = qlContainer.getBoundingClientRect()
    setEditorBounds({
      top: qlRect.top - containerRect.top,
      left: qlRect.left - containerRect.left,
      width: qlRect.width,
      height: qlRect.height
    })
  }, [])
  
  // Update editor bounds when selected image changes or on resize
  useEffect(() => {
    if (selectedImage) {
      updateEditorBounds()
    }
  }, [selectedImage, updateEditorBounds])

  // Render image selection inside a clipped container
  const renderImageSelection = () => {
    if (!selectedImage || !imageRect || !editorBounds || showLinkModal || showImageModal) return null
    
    return (
      <div 
        style={{ 
          position: 'absolute', 
          top: editorBounds.top, 
          left: editorBounds.left, 
          width: editorBounds.width, 
          height: editorBounds.height, 
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 1,
          borderRadius: '0 0 12px 12px'
        }}
      >
        <div 
          style={{ 
            position: 'absolute', 
            top: imageRect.top, 
            left: imageRect.left, 
            width: imageRect.width, 
            height: imageRect.height, 
            pointerEvents: 'none'
          }}
        >
          <div style={{ position: 'absolute', inset: 0, border: '2px solid #FF843E', borderRadius: 4 }} />
          
          {['nw', 'ne', 'sw', 'se'].map((dir) => (
            <div
              key={dir}
              className="resize-handle"
              onMouseDown={(e) => startResize(e, dir)}
              style={{
                position: 'absolute',
                width: 12, height: 12,
                backgroundColor: '#FF843E',
                border: '2px solid white',
                borderRadius: 2,
                pointerEvents: 'auto',
                cursor: dir === 'nw' || dir === 'se' ? 'nwse-resize' : 'nesw-resize',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                top: dir.includes('n') ? -6 : 'auto',
                bottom: dir.includes('s') ? -6 : 'auto',
                left: dir.includes('w') ? -6 : 'auto',
                right: dir.includes('e') ? -6 : 'auto',
              }}
            />
          ))}
          
          <div
            className="resize-handle"
            onMouseDown={(e) => startResize(e, 'e')}
            style={{ position: 'absolute', width: 8, height: 28, backgroundColor: '#FF843E', border: '2px solid white', borderRadius: 3, pointerEvents: 'auto', top: '50%', right: -5, transform: 'translateY(-50%)', cursor: 'ew-resize', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
          />
          <div
            className="resize-handle"
            onMouseDown={(e) => startResize(e, 'w')}
            style={{ position: 'absolute', width: 8, height: 28, backgroundColor: '#FF843E', border: '2px solid white', borderRadius: 3, pointerEvents: 'auto', top: '50%', left: -5, transform: 'translateY(-50%)', cursor: 'ew-resize', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
          />
          
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: -22, padding: '2px 8px', backgroundColor: '#FF843E', color: 'white', borderRadius: 4, fontSize: 10, fontWeight: 500, whiteSpace: 'nowrap', pointerEvents: 'none' }}>
            {Math.round(imageRect.width)} × {Math.round(imageRect.height)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div 
        ref={containerRef}
        className={`wysiwyg-editor-${editorId} rounded-xl border border-[#333333] ${className}`}
        onClick={handleContainerClick}
        style={{ position: 'relative', overflow: 'visible' }}
      >
        <ReactQuill
          ref={quillRef}
          defaultValue={value}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          theme="snow"
          preserveWhitespace
        />
        {renderImageSelection()}
      </div>

      <EditorModal show={showLinkModal} onClose={() => setShowLinkModal(false)} title="Insert Link" onSubmit={insertLink} submitText="Insert Link" submitDisabled={!linkUrl}>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Link Text</label>
            <input type="text" value={linkText} onChange={(e) => setLinkText(e.target.value)} placeholder="Text to display" className="w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#FF843E]" autoFocus />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">URL</label>
            <input type="text" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com" className="w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#FF843E]" />
          </div>
        </div>
      </EditorModal>

      <EditorModal show={showImageModal} onClose={() => setShowImageModal(false)} title="Insert Image" onSubmit={insertImageFromUrl} submitText="Insert from URL" submitDisabled={!imageUrl}>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Upload from device</label>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 bg-[#141414] text-gray-300 hover:text-white rounded-xl px-4 py-3 text-sm border border-[#333333] hover:border-[#FF843E]">
              <Upload className="w-4 h-4" /> Choose File
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#333333]" />
            <span className="text-xs text-gray-500">or</span>
            <div className="flex-1 h-px bg-[#333333]" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Image URL</label>
            <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#FF843E]" />
          </div>
          {imageUrl && (
            <div className="mt-2 p-2 bg-[#141414] rounded-lg border border-[#333333]">
              <p className="text-xs text-gray-500 mb-2">Preview:</p>
              <img src={imageUrl} alt="Preview" className="max-h-32 rounded object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
        </div>
      </EditorModal>
    </>
  )
}

export default WysiwygEditor
