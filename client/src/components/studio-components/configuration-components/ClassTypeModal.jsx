import { useState, useRef } from "react"
import {
  X,
  Upload,
  Clock,
  Users,
  Info,
} from "lucide-react"
import ImageSourceModal from "../../shared/image-handler/ImageSourceModal"
import ImageCropModal from "../../shared/image-handler/ImageCropModal"
import MediaLibraryPickerModal from "../../shared/image-handler/MediaLibraryPickerModal"
import CustomSelect from "../../shared/CustomSelect"

// ============================================
// Inline helper components
// ============================================

const Tooltip = ({ children, content, position = "left" }) => (
  <div className="relative group inline-flex">
    {children}
    <div className={`absolute top-full mt-2 px-3 py-2 bg-surface-hover text-content-secondary text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] w-64 border border-border shadow-xl pointer-events-none ${position === "right" ? "right-0" : "left-0"}`}>
      <div className="break-words leading-relaxed">{content}</div>
    </div>
  </div>
)

// ============================================
// ClassTypeModal
// ============================================
const ClassTypeModal = ({
  isOpen,
  onClose,
  editingClassType,
  classTypeForm,
  setClassTypeForm,
  classCategories,
  onSave,
  openColorPicker,
}) => {
  // Local image upload states
  const [showImageSourceModal, setShowImageSourceModal] = useState(false)
  const [showImageCropModal, setShowImageCropModal] = useState(false)
  const [showMediaLibraryModal, setShowMediaLibraryModal] = useState(false)
  const [tempImage, setTempImage] = useState(null)
  const imageInputRef = useRef(null)

  const handleImageSelect = (e) => {
    const file = e?.target?.files?.[0]
    if (!file) return

    // Reset any previous temp image
    setTempImage(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      setTempImage(event.target.result)
      setShowImageCropModal(true)
    }
    reader.readAsDataURL(file)

    // Clear the input so the same file can be selected again
    if (imageInputRef.current) {
      imageInputRef.current.value = ""
    }
  }

  const handleCroppedImage = (croppedImage) => {
    setClassTypeForm({ ...classTypeForm, image: croppedImage })
    setShowImageCropModal(false)
    setTempImage(null)
  }

  const handleMediaLibrarySelect = (imageUrl) => {
    setTempImage(imageUrl)
    setShowMediaLibraryModal(false)
    setShowImageCropModal(true)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-surface-base rounded-2xl w-full max-w-2xl my-8">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="text-lg font-semibold text-content-primary">
              {editingClassType ? "Edit Class Type" : "Create Class Type"}
            </h2>
            <button onClick={onClose} className="p-2 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden">
            {/* Image Upload */}
            <div>
              <label className="text-sm font-medium text-content-secondary mb-3 block">
                Class Image <span className="text-content-faint">(16:9, shown in member app)</span>
              </label>
              <div
                className="relative aspect-video bg-surface-card rounded-xl border-2 border-dashed border-border hover:border-border transition-colors cursor-pointer overflow-hidden group"
                onClick={() => setShowImageSourceModal(true)}
              >
                {classTypeForm.image ? (
                  <>
                    <img src={classTypeForm.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium">Change Image</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setClassTypeForm({ ...classTypeForm, image: null }) }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-content-faint">
                    <Upload className="w-10 h-10 mb-2" />
                    <span className="text-sm">Click to upload image</span>
                    <span className="text-xs mt-1">Recommended: 1920x1080px</span>
                  </div>
                )}
              </div>
              <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            </div>

            {/* Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                  Name <span className="text-red-400">*</span>
                  <Tooltip content="The name members will see when viewing class schedules">
                    <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                  </Tooltip>
                </label>
                <input
                  type="text"
                  value={classTypeForm.name}
                  onChange={(e) => setClassTypeForm({ ...classTypeForm, name: e.target.value })}
                  placeholder="e.g., Yoga"
                  className="w-full bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                  Category
                  <Tooltip content="Group similar classes together for easier organization">
                    <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                  </Tooltip>
                </label>
                <CustomSelect
                  name="category"
                  value={classTypeForm.category} // should be the category _id
                  onChange={(e) => setClassTypeForm({ ...classTypeForm, category: e.target.value })}
                  options={classCategories.map(c => ({ value: c._id, label: c.categoryName }))}
                  placeholder="Select category"
                  className="bg-surface-card px-4 py-2.5 border-border"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                Description
                <Tooltip content="Optional details about what this class includes. Shown to members.">
                  <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                </Tooltip>
              </label>
              <textarea
                value={classTypeForm.description}
                onChange={(e) => setClassTypeForm({ ...classTypeForm, description: e.target.value })}
                placeholder="Describe what this class includes..."
                rows={3}
                className="w-full bg-surface-card text-content-primary rounded-xl px-4 py-3 text-sm outline-none border border-border focus:border-primary resize-none"
              />
            </div>

            {/* Duration & Max Participants */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                  <Clock className="w-4 h-4 text-content-faint" />
                  Duration
                  <span className="text-red-400">*</span>
                  <Tooltip content="How long the class lasts in minutes">
                    <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                  </Tooltip>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={classTypeForm.duration}
                    onChange={(e) => setClassTypeForm({ ...classTypeForm, duration: Math.floor(Number(e.target.value)) })}
                    onKeyDown={(e) => { if (e.key === '.' || e.key === ',') e.preventDefault() }}
                    min={5} max={480}
                    className="w-24 bg-surface-card text-content-primary rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-primary"
                  />
                  <span className="text-sm text-content-muted">min</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                  <Users className="w-4 h-4 text-content-faint" />
                  Max Participants
                  <span className="text-red-400">*</span>
                  <Tooltip content="Maximum number of members that can enroll in this class">
                    <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                  </Tooltip>
                </label>
                <input
                  type="number"
                  value={classTypeForm.maxParticipants}
                  onChange={(e) => setClassTypeForm({ ...classTypeForm, maxParticipants: Math.floor(Number(e.target.value)) })}
                  onKeyDown={(e) => { if (e.key === '.' || e.key === ',') e.preventDefault() }}
                  min={1} max={200}
                  className="w-24 bg-surface-card text-content-primary rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-primary"
                />
              </div>
            </div>

            {/* Color */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                Calendar Color
                <Tooltip content="The color used to display this class type in the calendar">
                  <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                </Tooltip>
              </label>
              <button
                onClick={() => openColorPicker(classTypeForm.color || '#3B82F6', 'Calendar Color', (color) => setClassTypeForm({ ...classTypeForm, color }))}
                className="w-10 h-10 rounded-lg border border-border flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
                style={{ backgroundColor: classTypeForm.color }}
                title="Pick a color"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-5 border-t border-border">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-surface-button text-content-primary text-sm rounded-xl hover:bg-surface-button-hover transition-colors">
              Cancel
            </button>
            <button onClick={onSave} className="flex-1 px-4 py-2.5 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover transition-colors">
              {editingClassType ? "Save Changes" : "Create"}
            </button>
          </div>
        </div>
      </div>

      {/* Image Sub-Modals */}
      <ImageSourceModal
        isOpen={showImageSourceModal}
        onClose={() => setShowImageSourceModal(false)}
        onSelectFile={() => imageInputRef.current?.click()}
        onSelectMediaLibrary={() => setShowMediaLibraryModal(true)}
      />

      <MediaLibraryPickerModal
        isOpen={showMediaLibraryModal}
        onClose={() => setShowMediaLibraryModal(false)}
        onSelectImage={handleMediaLibrarySelect}
      />

      <ImageCropModal
        isOpen={showImageCropModal}
        onClose={() => { setShowImageCropModal(false); setTempImage(null) }}
        imageSrc={tempImage}
        onCropComplete={handleCroppedImage}
        aspectRatio={16 / 9}
      />
    </>
  )
}

export default ClassTypeModal
