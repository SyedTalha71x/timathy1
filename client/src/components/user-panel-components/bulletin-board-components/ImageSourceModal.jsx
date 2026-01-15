/* eslint-disable react/prop-types */
import { Upload, Image as ImageIcon, X } from 'lucide-react'

export default function ImageSourceModal({ isOpen, onClose, onSelectFile, onSelectMediaLibrary }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[55]">
      <div className="bg-[#1C1C1C] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Choose Image Source</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
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
            className="w-full flex items-center gap-4 p-4 bg-[#141414] border border-gray-700 rounded-xl hover:border-orange-500/50 hover:bg-[#1a1a1a] transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
              <Upload size={24} className="text-blue-400" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium">Upload from Device</p>
              <p className="text-gray-500 text-sm mt-0.5">Choose an image from your files</p>
            </div>
          </button>

          {/* Select from Media Library */}
          <button
            onClick={() => {
              onSelectMediaLibrary()
              onClose()
            }}
            className="w-full flex items-center gap-4 p-4 bg-[#141414] border border-gray-700 rounded-xl hover:border-orange-500/50 hover:bg-[#1a1a1a] transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
              <ImageIcon size={24} className="text-orange-400" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium">Media Library</p>
              <p className="text-gray-500 text-sm mt-0.5">Select from your saved designs</p>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white rounded-xl text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
