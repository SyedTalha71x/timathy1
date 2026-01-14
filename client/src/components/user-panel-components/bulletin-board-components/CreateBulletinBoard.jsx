/* eslint-disable react/prop-types */
import { memo, useCallback, useState, useMemo, useEffect, useRef } from 'react'
import { X, Image as ImageIcon, Crop } from 'lucide-react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import ImageCropModal from './ImageCropModal'

// Quill editor configuration
const QUILL_MODULES = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link'],
    ['clean']
  ],
}

const QUILL_FORMATS = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet',
  'align',
  'link'
]

// Helper function to strip HTML tags
const stripHtmlTags = (html) => {
  if (!html) return ''
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  const text = tmp.textContent || tmp.innerText || ''
  return text.replace(/\s+/g, ' ').trim()
}

const OptimizedCreateBulletinModal = memo(function OptimizedCreateBulletinModal({
  isOpen,
  onClose,
  onCreate,
  availableTags,
  onOpenTagManager,
}) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "Active",
    image: null,
    tags: [],
  })
  const [showCropModal, setShowCropModal] = useState(false)
  const [tempImage, setTempImage] = useState(null)
  const [originalImage, setOriginalImage] = useState(null)
  const fileInputRef = useRef(null)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        content: "",
        status: "Active",
        image: null,
        tags: [],
      })
    }
  }, [isOpen])

  // Editor styles
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .bulletin-modal-editor {
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #404040;
      }
      .bulletin-modal-editor:focus-within {
        border-color: #2563eb;
      }
      .bulletin-modal-editor .ql-editor {
        color: #e5e7eb !important;
        background-color: #181818 !important;
        min-height: 180px;
        font-size: 14px;
        line-height: 1.6;
      }
      .bulletin-modal-editor .ql-editor.ql-blank::before {
        color: #6b7280 !important;
        font-style: normal !important;
      }
      .bulletin-modal-editor .ql-toolbar.ql-snow {
        border: none !important;
        border-bottom: 1px solid #404040 !important;
        background-color: #141414 !important;
      }
      .bulletin-modal-editor .ql-container.ql-snow {
        border: none !important;
      }
      .bulletin-modal-editor .ql-snow .ql-stroke { stroke: #9ca3af !important; }
      .bulletin-modal-editor .ql-snow .ql-fill { fill: #9ca3af !important; }
      .bulletin-modal-editor .ql-snow .ql-picker-label { color: #9ca3af !important; }
      .bulletin-modal-editor .ql-snow .ql-picker-options { background-color: #1f1f1f !important; border-color: #404040 !important; }
      .bulletin-modal-editor .ql-snow .ql-picker-item { color: #e5e7eb !important; }
      .bulletin-modal-editor .ql-snow .ql-picker-item:hover { color: #2563eb !important; }
      .bulletin-modal-editor .ql-snow button:hover .ql-stroke { stroke: #2563eb !important; }
      .bulletin-modal-editor .ql-snow button:hover .ql-fill { fill: #2563eb !important; }
      .bulletin-modal-editor .ql-snow button.ql-active .ql-stroke { stroke: #2563eb !important; }
      .bulletin-modal-editor .ql-snow button.ql-active .ql-fill { fill: #2563eb !important; }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setOriginalImage(reader.result)
        setTempImage(reader.result)
        setShowCropModal(true)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleCropComplete = useCallback((croppedImage) => {
    setFormData(prev => ({ ...prev, image: croppedImage }))
    setTempImage(null)
    setShowCropModal(false)
  }, [])

  const handleCropCancel = useCallback(() => {
    setTempImage(null)
    setShowCropModal(false)
    if (!formData.image && fileInputRef.current) {
      fileInputRef.current.value = ""
      setOriginalImage(null)
    }
  }, [formData.image])

  const handleReCrop = useCallback(() => {
    const imageToEdit = originalImage || formData.image
    if (imageToEdit) {
      if (!originalImage) {
        setOriginalImage(formData.image)
      }
      setTempImage(imageToEdit)
      setShowCropModal(true)
    }
  }, [originalImage, formData.image])

  const handleTagToggle = useCallback((tagId) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId) 
        ? prev.tags.filter((id) => id !== tagId) 
        : [...prev.tags, tagId],
    }))
  }, [])

  const handleInputChange = useCallback((field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }, [])

  const handleContentChange = useCallback((value) => {
    setFormData(prev => ({ ...prev, content: value }))
  }, [])

  const handleRemoveImage = useCallback(() => {
    setFormData(prev => ({ ...prev, image: null }))
    setOriginalImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [])

  const handleCreate = useCallback(() => {
    if (formData.title.trim() && stripHtmlTags(formData.content).trim()) {
      onCreate(formData)
      onClose()
    }
  }, [formData, onCreate, onClose])

  const tagsDisplay = useMemo(() => {
    if (!availableTags || availableTags.length === 0) {
      return <p className="text-gray-500 text-xs">No tags available. Create one using Manage Tags.</p>
    }
    return (
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => handleTagToggle(tag.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              formData.tags.includes(tag.id)
                ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-[#1C1C1C]"
                : "opacity-50 hover:opacity-80"
            }`}
            style={{ backgroundColor: tag.color, color: "white" }}
          >
            {tag.name}
          </button>
        ))}
      </div>
    )
  }, [availableTags, formData.tags, handleTagToggle])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1C1C1C] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Create New Post</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 custom-scrollbar">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={handleInputChange('title')}
              className="w-full bg-[#181818] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:border-blue-600 focus:outline-none transition-colors"
              placeholder="Enter post title..."
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image</label>
            {formData.image ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-700 bg-black">
                <div className="aspect-video">
                  <img src={formData.image} alt="Cover preview" className="w-full h-full object-contain" />
                </div>
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={handleReCrop}
                    className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-lg transition-colors"
                    title="Zuschnitt anpassen"
                  >
                    <Crop size={16} />
                  </button>
                  <button
                    onClick={handleRemoveImage}
                    className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-lg transition-colors"
                    title="Bild entfernen"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-blue-600/50 transition-colors"
              >
                <ImageIcon className="w-10 h-10 mx-auto mb-3 text-gray-500" />
                <p className="text-gray-400 text-sm">Click to upload cover image</p>
                <p className="text-gray-500 text-xs mt-1">Recommended: 16:9 ratio • Max 5MB</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>

          {/* Content - Rich Text Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Content <span className="text-red-400">*</span>
            </label>
            <div className="bulletin-modal-editor">
              <ReactQuill
                value={formData.content}
                onChange={handleContentChange}
                modules={QUILL_MODULES}
                formats={QUILL_FORMATS}
                placeholder="Write your post content here..."
                theme="snow"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFormData(prev => ({ ...prev, status: prev.status === "Active" ? "Inactive" : "Active" }))}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${formData.status === "Active" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formData.status === "Active" ? "translate-x-8" : "translate-x-1"}`} />
              </button>
              <span className="text-sm text-gray-300">{formData.status}</span>
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">Tags</label>
              <button onClick={onOpenTagManager} className="text-xs text-blue-500 hover:text-blue-400 transition-colors">
                Manage Tags
              </button>
            </div>
            <div className="bg-[#181818] border border-gray-700 rounded-xl p-3">
              {tagsDisplay}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
          <button onClick={onClose} className="px-5 py-2.5 bg-gray-600 hover:bg-gray-500 text-white rounded-xl text-sm font-medium transition-colors">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!formData.title.trim() || !stripHtmlTags(formData.content).trim()}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors"
          >
            Create Post
          </button>
        </div>
      </div>

      {/* Image Crop Modal */}
      <ImageCropModal
        isOpen={showCropModal}
        onClose={handleCropCancel}
        imageSrc={tempImage}
        onCropComplete={handleCropComplete}
        aspectRatio={16 / 9}
      />
    </div>
  )
})

export default OptimizedCreateBulletinModal
