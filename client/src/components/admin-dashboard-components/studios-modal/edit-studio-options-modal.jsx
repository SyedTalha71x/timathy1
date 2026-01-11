/* eslint-disable react/prop-types */
// components/admin-dashboard-components/studios-modal/edit-studio-options-modal.jsx
import { useState, useEffect } from "react"
import { X, Settings, UserCog } from "lucide-react"

const EditStudioOptionsModal = ({ isOpen, onClose, studio, onStudioConfig, onAdminConfig }) => {
  const [currentStudio, setCurrentStudio] = useState(null)

  // Update current studio when prop changes
  useEffect(() => {
    if (studio) {
      setCurrentStudio(studio)
    }
  }, [studio])

  if (!isOpen || !currentStudio) return null

  const handleStudioConfig = () => {
    onStudioConfig(currentStudio)
  }

  const handleAdminConfig = () => {
    onAdminConfig(currentStudio)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100000]">
      <div className="bg-[#1C1C1C] rounded-2xl p-6 md:w-[80vh] w-full cursor-pointer ">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Edit Studio Options</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-center mb-4">
            <p className="text-gray-300">Choose configuration type for</p>
            <p className="text-white font-medium">{currentStudio.name}</p>
          </div>

          <button
            onClick={handleStudioConfig}
            className="w-full p-4 bg-[#2A2A2A] hover:bg-[#363636] rounded-xl border border-gray-700 transition-all duration-200 flex items-center gap-4 group"
          >
            <div className="p-2 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition-colors">
              <Settings className="text-orange-500" size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-white font-medium">Studio Configuration</h3>
              <p className="text-gray-400 text-sm">Manage studio settings, resources, and appearance</p>
            </div>
          </button>

          <button
            onClick={handleAdminConfig}
            className="w-full p-4 bg-[#2A2A2A] hover:bg-[#363636] rounded-xl border border-gray-700 transition-all duration-200 flex items-center gap-4 group"
          >
            <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
              <UserCog className="text-blue-500" size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-white font-medium">Admin Configuration</h3>
              <p className="text-gray-400 text-sm">Manage admin settings and system configuration</p>
            </div>
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditStudioOptionsModal