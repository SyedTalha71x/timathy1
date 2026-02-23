/* eslint-disable react/prop-types */
import { Upload, Image as ImageIcon, X } from 'lucide-react'

/**
 * Shared ImageSourceModal - Choose between device upload or media library
 * 
 * Usage:
 * <ImageSourceModal
 *   isOpen={showSourceModal}
 *   onClose={() => setShowSourceModal(false)}
 *   onSelectFile={() => fileInputRef.current?.click()}
 *   onSelectMediaLibrary={() => setShowMediaLibrary(true)}
 * />
 */
export default function ImageSourceModal({ isOpen, onClose, onSelectFile, onSelectMediaLibrary }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[1001]">
      <div className="bg-surface-card rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-content-primary">Choose Image Source</h2>
          <button
            onClick={onClose}
            className="text-content-muted hover:text-content-primary transition-colors p-1"
          >
            <X size={22} />
          </button>
        </div>

        {/* Options */}
        <div className="p-5 space-y-3">
          {/* Upload from Device */}
          <button
            onClick={() => {
              onSelectFile()
              onClose()
            }}
            className="w-full flex items-center gap-4 p-4 border border-border rounded-xl hover:border-primary/50 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <Upload size={24} className="text-primary" />
            </div>
            <div className="text-left">
              <p className="text-content-primary font-medium">Upload from Device</p>
              <p className="text-content-faint text-sm mt-0.5">Choose an image from your files</p>
            </div>
          </button>

          {/* Select from Media Library */}
          <button
            onClick={() => {
              onSelectMediaLibrary()
              onClose()
            }}
            className="w-full flex items-center gap-4 p-4 border border-border rounded-xl hover:border-primary/50 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <ImageIcon size={24} className="text-primary" />
            </div>
            <div className="text-left">
              <p className="text-content-primary font-medium">Media Library</p>
              <p className="text-content-faint text-sm mt-0.5">Select from your saved designs</p>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-surface-button hover:bg-surface-button-hover text-content-primary rounded-xl text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
