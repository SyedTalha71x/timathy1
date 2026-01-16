/* eslint-disable react/prop-types */
import { memo, useCallback, useState, useMemo, useEffect, useRef } from 'react'
import { X, Image as ImageIcon, Crop, Tag, Calendar, Clock, Trash2 } from 'lucide-react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import ImageCropModal from '../../shared/ImageCropModal'
import PostSchedulerModal from './PostSchedulerModal'
import ImageSourceModal from '../../shared/ImageSourceModal'
import MediaLibraryPickerModal from '../../shared/MediaLibraryPickerModal'

// Quill editor configuration - compact toolbar
const QUILL_MODULES = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
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
  
  // Image source selection state
  const [showImageSourceModal, setShowImageSourceModal] = useState(false)
  const [showMediaLibraryModal, setShowMediaLibraryModal] = useState(false)
  
  // Scheduling state
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [schedule, setSchedule] = useState({
    type: 'immediate',
    startDate: '',
    startTime: '',
    hasEndDate: false,
    endDate: '',
    endTime: '',
  })

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
      setSchedule({
        type: 'immediate',
        startDate: '',
        startTime: '',
        hasEndDate: false,
        endDate: '',
        endTime: '',
      })
    }
  }, [isOpen])

  // Editor styles - compact
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .bulletin-modal-editor {
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #333333;
      }
      .bulletin-modal-editor:focus-within {
        border-color: #3F74FF;
      }
      .bulletin-modal-editor .ql-editor {
        color: #e5e7eb !important;
        background-color: #101010 !important;
        min-height: 100px;
        max-height: 150px;
        font-size: 14px;
        line-height: 1.5;
        overflow-y: auto;
      }
      .bulletin-modal-editor .ql-editor.ql-blank::before {
        color: #6b7280 !important;
        font-style: normal !important;
      }
      .bulletin-modal-editor .ql-toolbar.ql-snow {
        border: none !important;
        border-bottom: 1px solid #333333 !important;
        background-color: #101010 !important;
        padding: 6px 8px !important;
      }
      .bulletin-modal-editor .ql-container.ql-snow {
        border: none !important;
      }
      .bulletin-modal-editor .ql-snow .ql-stroke { stroke: #9ca3af !important; }
      .bulletin-modal-editor .ql-snow .ql-fill { fill: #9ca3af !important; }
      .bulletin-modal-editor .ql-snow .ql-picker-label { color: #9ca3af !important; }
      .bulletin-modal-editor .ql-snow .ql-picker-options { background-color: #1f1f1f !important; border-color: #404040 !important; }
      .bulletin-modal-editor .ql-snow .ql-picker-item { color: #e5e7eb !important; }
      .bulletin-modal-editor .ql-snow .ql-picker-item:hover { color: #3F74FF !important; }
      .bulletin-modal-editor .ql-snow button:hover .ql-stroke { stroke: #3F74FF !important; }
      .bulletin-modal-editor .ql-snow button:hover .ql-fill { fill: #3F74FF !important; }
      .bulletin-modal-editor .ql-snow button.ql-active .ql-stroke { stroke: #3F74FF !important; }
      .bulletin-modal-editor .ql-snow button.ql-active .ql-fill { fill: #3F74FF !important; }
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

  const handleScheduleSave = useCallback((newSchedule) => {
    setSchedule(newSchedule)
    setShowScheduleModal(false)
  }, [])

  const handleRemoveSchedule = useCallback(() => {
    setSchedule({
      type: 'immediate',
      startDate: '',
      startTime: '',
      hasEndDate: false,
      endDate: '',
      endTime: '',
    })
  }, [])

  const handleMediaLibrarySelect = useCallback((imageUrl) => {
    setOriginalImage(imageUrl)
    setTempImage(imageUrl)
    setShowMediaLibraryModal(false)
    setShowCropModal(true)
  }, [])

  const handleCreate = useCallback(() => {
    if (!formData.title.trim() || !stripHtmlTags(formData.content).trim()) return
    
    const postData = {
      ...formData,
      schedule: schedule.type === 'scheduled' ? schedule : null,
    }
    onCreate(postData)
    onClose()
  }, [formData, schedule, onCreate, onClose])

  const getScheduleDisplayText = useCallback(() => {
    if (schedule.type === 'immediate') {
      return 'Post will be published when created'
    }
    
    let text = `Starts: ${schedule.startDate}`
    if (schedule.startTime) text += ` at ${schedule.startTime}`
    
    if (schedule.hasEndDate && schedule.endDate) {
      text += ` | Ends: ${schedule.endDate}`
      if (schedule.endTime) text += ` at ${schedule.endTime}`
    }
    
    return text
  }, [schedule])

  const tagsDisplay = useMemo(() => {
    if (!availableTags || availableTags.length === 0) {
      return (
        <p className="text-gray-500 text-xs">No tags available. Create tags in Tag Manager.</p>
      )
    }
    return (
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => (
          <button
            key={tag.id}
            type="button"
            onClick={() => handleTagToggle(tag.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              formData.tags.includes(tag.id) 
                ? "text-white" 
                : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"
            }`}
            style={{ backgroundColor: formData.tags.includes(tag.id) ? tag.color : undefined }}
          >
            <Tag size={10} />
            {tag.name}
          </button>
        ))}
      </div>
    )
  }, [availableTags, formData.tags, handleTagToggle])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[1000]">
      <div className="bg-[#181818] rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-0 flex-shrink-0">
          <h2 className="text-white text-lg font-semibold">Create New Post</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleCreate(); }}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="space-y-3 custom-scrollbar overflow-y-auto px-6 py-4 flex-1">
            {/* Cover Image */}
            <div>
              <label className="text-sm text-gray-200 block mb-2">Cover Image</label>
              {formData.image ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-700 bg-black">
                  <div className="aspect-video">
                    <img src={formData.image} alt="Cover preview" className="w-full h-full object-contain" draggable="false" />
                  </div>
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      type="button"
                      onClick={handleReCrop}
                      className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-lg transition-colors"
                      title="Adjust crop"
                    >
                      <Crop size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-lg transition-colors"
                      title="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setShowImageSourceModal(true)}
                  className="border-2 border-dashed border-gray-700 rounded-xl aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-[#3F74FF]/50 transition-colors"
                >
                  <ImageIcon className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="text-gray-400 text-sm">Click to upload</p>
                  <p className="text-gray-500 text-xs mt-1">16:9 ratio - Max 5MB</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>

            {/* Title */}
            <div>
              <label className="text-sm text-gray-200 block mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={handleInputChange('title')}
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                placeholder="Enter post title..."
                required
              />
            </div>

            {/* Content - Rich Text Editor */}
            <div>
              <label className="text-sm text-gray-200 block mb-2">Content *</label>
              <div className="bulletin-modal-editor">
                <ReactQuill
                  value={formData.content}
                  onChange={handleContentChange}
                  modules={QUILL_MODULES}
                  formats={QUILL_FORMATS}
                  placeholder="Write your post content..."
                  theme="snow"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-200 flex items-center gap-1.5">
                  <Tag size={14} className="text-gray-400" />
                  Tags
                </label>
                <button type="button" onClick={onOpenTagManager} className="text-xs text-blue-500 hover:text-blue-400 transition-colors">
                  Manage
                </button>
              </div>
              <div className="bg-[#101010] border border-[#333333] rounded-xl p-2.5">
                {tagsDisplay}
              </div>
            </div>

            {/* Schedule Section - Compact */}
            <div>
              <label className="text-sm text-gray-200 block mb-2">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-gray-400" />
                  Schedule
                </span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(true)}
                  className="flex-1 bg-[#101010] border border-[#333333] rounded-xl px-3 py-2.5 text-left hover:border-[#3F74FF]/50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                        {schedule.type === 'immediate' ? (
                          <Clock size={14} className="text-orange-400" />
                        ) : (
                          <Calendar size={14} className="text-orange-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-orange-400">
                          {schedule.type === 'immediate' ? 'Publish Immediately' : 'Scheduled'}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">
                          {schedule.type === 'immediate' ? 'On create' : `${schedule.startDate}`}
                        </p>
                      </div>
                    </div>
                    <span className="text-gray-500 group-hover:text-blue-400 transition-colors text-xs">
                      Edit
                    </span>
                  </div>
                </button>
                {schedule.type === 'scheduled' && (
                  <button
                    type="button"
                    onClick={handleRemoveSchedule}
                    className="bg-[#101010] border border-[#333333] rounded-xl px-3 hover:border-red-500/50 hover:bg-red-500/10 transition-colors group"
                    title="Remove Schedule"
                  >
                    <Trash2 size={16} className="text-gray-500 group-hover:text-red-400 transition-colors" />
                  </button>
                )}
              </div>
            </div>

            {/* Status - Only show if immediate */}
            {schedule.type === 'immediate' && (
              <div>
                <label className="text-sm text-gray-200 block mb-2">Status</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status: prev.status === "Active" ? "Inactive" : "Active" }))}
                    className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${formData.status === "Active" ? "bg-blue-600" : "bg-gray-600"}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.status === "Active" ? "translate-x-7" : "translate-x-1"}`} />
                  </button>
                  <span className="text-sm text-gray-300">{formData.status}</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-row-reverse gap-3 p-6 pt-4 border-t border-[#333333] bg-[#181818] flex-shrink-0">
            <button
              type="submit"
              disabled={!formData.title.trim() || !stripHtmlTags(formData.content).trim() || (schedule.type === 'scheduled' && !schedule.startDate)}
              className="flex-1 sm:flex-none sm:w-auto px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-sm text-white rounded-xl transition-colors font-medium"
            >
              {schedule.type === 'immediate' ? 'Create Post' : 'Schedule Post'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none sm:w-auto px-6 py-2.5 bg-gray-600 hover:bg-gray-500 text-sm text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Image Crop Modal */}
      <ImageCropModal
        isOpen={showCropModal}
        onClose={handleCropCancel}
        imageSrc={tempImage}
        onCropComplete={handleCropComplete}
        aspectRatio={16 / 9}
      />

      {/* Post Scheduler Modal */}
      <PostSchedulerModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSave={handleScheduleSave}
        initialSchedule={schedule}
      />

      {/* Image Source Selection Modal */}
      <ImageSourceModal
        isOpen={showImageSourceModal}
        onClose={() => setShowImageSourceModal(false)}
        onSelectFile={() => fileInputRef.current?.click()}
        onSelectMediaLibrary={() => setShowMediaLibraryModal(true)}
      />

      {/* Media Library Picker Modal */}
      <MediaLibraryPickerModal
        isOpen={showMediaLibraryModal}
        onClose={() => setShowMediaLibraryModal(false)}
        onSelectImage={handleMediaLibrarySelect}
      />
    </div>
  )
})

export default OptimizedCreateBulletinModal
