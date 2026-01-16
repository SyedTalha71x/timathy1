/* eslint-disable react/prop-types */
import { useState, useCallback, useEffect, useRef } from 'react'
import { X, Plus, Crop } from "lucide-react"
import ImageCropModal from "./ImageCropModal"

// Helper function to get dynamic text size based on content length
const getPreviewTextSize = (text) => {
  const length = text?.length || 0
  if (length <= 10) return 'text-2xl'
  if (length <= 20) return 'text-xl'
  if (length <= 35) return 'text-lg'
  if (length <= 50) return 'text-base'
  return 'text-sm'
}

const ProductServiceModal = ({
  isOpen,
  closeModal,
  modalMode,
  activeTab,
  formData,
  handleSubmit,
  handleInputChangeMain,
  selectedImage,
  currentProduct,
  handleImageUpload,
  fileInputRef,
  onRemoveImage,
  onCroppedImage,
}) => {
  const [showCropModal, setShowCropModal] = useState(false)
  const [tempImage, setTempImage] = useState(null)
  const [originalImage, setOriginalImage] = useState(null)
  const internalFileInputRef = useRef(null)
  
  // Use internal ref if external not provided
  const actualFileInputRef = fileInputRef || internalFileInputRef

  // Reset crop state when modal closes or opens with different product
  useEffect(() => {
    if (!isOpen) {
      setShowCropModal(false)
      setTempImage(null)
      setOriginalImage(null)
    }
  }, [isOpen])

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !showCropModal) {
        closeModal()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, showCropModal, closeModal])

  // Reset original image when editing a different product
  useEffect(() => {
    if (isOpen && modalMode === "edit" && currentProduct) {
      setOriginalImage(null)
    }
  }, [isOpen, modalMode, currentProduct?.id])

  // Compute values needed for callbacks (before useCallback)
  const hasImage = selectedImage || currentProduct?.image

  // Handle crop complete - useCallback must be called unconditionally
  const handleCropComplete = useCallback((croppedImage) => {
    if (onCroppedImage) {
      onCroppedImage(croppedImage)
    }
    setTempImage(null)
    setShowCropModal(false)
  }, [onCroppedImage])

  // Handle crop cancel
  const handleCropCancel = useCallback(() => {
    setTempImage(null)
    setShowCropModal(false)
    if (!hasImage && actualFileInputRef.current) {
      actualFileInputRef.current.value = ""
      setOriginalImage(null)
    }
  }, [hasImage, actualFileInputRef])

  // Handle re-crop existing image
  const handleReCrop = useCallback(() => {
    const imageToEdit = originalImage || selectedImage || currentProduct?.image
    if (imageToEdit) {
      if (!originalImage) {
        setOriginalImage(imageToEdit)
      }
      setTempImage(imageToEdit)
      setShowCropModal(true)
    }
  }, [originalImage, selectedImage, currentProduct?.image])

  // Handle remove image
  const handleRemoveImage = useCallback(() => {
    if (onRemoveImage) {
      onRemoveImage()
    }
    setOriginalImage(null)
    if (actualFileInputRef.current) {
      actualFileInputRef.current.value = ""
    }
  }, [onRemoveImage, actualFileInputRef])

  // Handle image selection - open crop modal
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

  // Early return AFTER all hooks
  if (!isOpen) return null

  const itemType = activeTab === "services" ? "Service" : "Product"
  
  // Button text: "Add Product/Service" for add mode, "Save changes" for edit mode
  const buttonText = modalMode === "add" ? `Add ${itemType}` : "Save changes"
  
  // Preview text: use formData.name if available, otherwise show appropriate placeholder
  const previewText = formData.name?.trim() || (modalMode === "edit" ? currentProduct?.name : `New ${itemType}`)

  return (
    <>
      <div className="fixed inset-0 cursor-pointer open_sans_font w-full h-full bg-black/50 flex items-center justify-center z-[1000] p-4">
        <div className="bg-[#181818] rounded-xl w-full max-w-md my-8 relative max-h-[90vh] flex flex-col">
          <div className="p-6 pb-0 flex-shrink-0">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-lg open_sans_font_700">
                {modalMode === "add"
                  ? `Add ${itemType}`
                  : `Edit ${itemType}`}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="space-y-3 custom-scrollbar overflow-y-auto px-6 flex-1">
              {/* Upload Image - Full width 16:9 aspect ratio preview */}
              <div>
                <label className="text-sm text-gray-200 block mb-2">Product image</label>
                {hasImage ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-700 bg-black">
                    <div className="aspect-video">
                      <img
                        src={selectedImage || currentProduct?.image}
                        alt={itemType}
                        className="w-full h-full object-contain"
                        draggable="false"
                      />
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
                    onClick={() => actualFileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-700 rounded-xl aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-[#3F74FF]/50 transition-colors bg-orange-500"
                  >
                    <p className={`font-bold leading-tight text-white text-center px-4 ${getPreviewTextSize(previewText)}`} style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                      {previewText}
                    </p>
                    <p className="text-white/70 text-xs mt-3">Click to upload image</p>
                  </div>
                )}
                <input
                  ref={actualFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Name */}
              <div>
                <label className="text-sm text-gray-200 block mb-2">
                  {itemType} name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChangeMain}
                  placeholder={`Enter ${itemType.toLowerCase()} name`}
                  className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                  required
                />
              </div>

              {/* Conditional Fields */}
              {activeTab === "services" ? (
                <div className="grid grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Price *</label>
                    <div className="flex items-center rounded-xl bg-[#101010] border border-transparent focus-within:border-[#3F74FF] transition-colors">
                      <span className="px-3 text-white text-sm">â‚¬</span>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChangeMain}
                        placeholder="0.00"
                        className="w-full bg-transparent text-sm py-3 pr-4 text-white placeholder-gray-500 outline-none"
                        required
                      />
                    </div>
                  </div>
                  {/* VAT */}
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">VAT Rate (%)</label>
                    <select
                      name="vatRate"
                      value={formData.vatRate}
                      onChange={handleInputChangeMain}
                      className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                    >
                      <option value={7}>7% (take-away)</option>
                      <option value={19}>19% (eat-in)</option>
                    </select>
                  </div>
                </div>
              ) : (
                <>
                  {/* Product Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Price *</label>
                      <div className="flex items-center rounded-xl bg-[#101010] border border-transparent focus-within:border-[#3F74FF] transition-colors">
                        <span className="px-3 text-white text-sm">â‚¬</span>
                        <input
                          type="text"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChangeMain}
                          placeholder="0.00"
                          className="w-full bg-transparent text-sm py-3 pr-4 text-white placeholder-gray-500 outline-none"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-200 block mb-2">Article Number</label>
                      <input
                        type="text"
                        name="articalNo"
                        value={formData.articalNo}
                        onChange={handleInputChangeMain}
                        placeholder="Enter article no"
                        className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                      />
                    </div>
                  </div>

                  {/* VAT */}
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">VAT Rate (%)</label>
                    <select
                      name="vatRate"
                      value={formData.vatRate}
                      onChange={handleInputChangeMain}
                      className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                    >
                      <option value={7}>7% (take-away)</option>
                      <option value={19}>19% (eat-in)</option>
                    </select>
                  </div>
                </>
              )}

              {/* Brand (Products Only) */}
              {activeTab === "products" && (
                <div>
                  <label className="text-sm text-gray-200 block mb-2">Brand</label>
                  <input
                    type="text"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleInputChangeMain}
                    placeholder="Enter brand name"
                    className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-gray-400 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                  />
                </div>
              )}

              {/* Link */}
              <div>
                <label className="text-sm text-gray-200 block mb-2">Link (Optional)</label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChangeMain}
                  placeholder="https://example.com"
                  className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                />
              </div>
            </div>

            {/* Buttons - Sticky Footer */}
            <div className="flex flex-row-reverse gap-3 p-6 pt-4 border-t border-[#333333] bg-[#181818] flex-shrink-0">
              <button
                type="submit"
                className="flex-1 sm:flex-none sm:w-auto px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-sm text-white rounded-xl transition-colors flex items-center justify-center gap-2 font-medium"
              >
                {modalMode === "add" && <Plus size={16} />}
                {buttonText}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 sm:flex-none sm:w-auto px-6 py-2.5 bg-gray-600 hover:bg-gray-500 text-sm text-white rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
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
    </>
  )
}

export default ProductServiceModal
