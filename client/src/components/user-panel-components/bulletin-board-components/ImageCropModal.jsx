/* eslint-disable react/prop-types */
import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react'

// Helper function to create cropped image
const createCroppedImage = (imageSrc, pixelCrop) => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    
    image.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      canvas.width = pixelCrop.width
      canvas.height = pixelCrop.height

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      )

      resolve(canvas.toDataURL('image/jpeg', 0.92))
    }
    
    image.onerror = (error) => {
      reject(error)
    }
    
    image.src = imageSrc
  })
}

export default function ImageCropModal({ isOpen, onClose, imageSrc, onCropComplete, aspectRatio = 16 / 9 }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropChange = useCallback((crop) => {
    setCrop(crop)
  }, [])

  const onZoomChange = useCallback((zoom) => {
    setZoom(zoom)
  }, [])

  const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleConfirm = async () => {
    if (croppedAreaPixels) {
      try {
        const croppedImage = await createCroppedImage(imageSrc, croppedAreaPixels)
        onCropComplete(croppedImage)
        // Reset state
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        onClose()
      } catch (error) {
        console.error('Error cropping image:', error)
      }
    }
  }

  const handleCancel = () => {
    // Reset state
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    onClose()
  }

  if (!isOpen || !imageSrc) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60]">
      <div className="bg-[#1C1C1C] rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Bildbereich auswählen</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Crop Area */}
        <div className="relative h-[400px] bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteCallback}
            cropShape="rect"
            showGrid={true}
            style={{
              containerStyle: {
                background: '#000'
              },
              cropAreaStyle: {
                border: '2px solid #2563eb'
              }
            }}
          />
        </div>

        {/* Controls */}
        <div className="p-4 border-t border-gray-700">
          {/* Zoom Control */}
          <div className="flex items-center gap-4 mb-4">
            <ZoomOut size={18} className="text-gray-400" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <ZoomIn size={18} className="text-gray-400" />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 bg-gray-600 hover:bg-gray-500 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Check size={18} />
              Übernehmen
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
