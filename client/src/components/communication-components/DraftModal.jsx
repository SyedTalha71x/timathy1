/* eslint-disable react/prop-types */
import { X, Save, Trash2 } from "lucide-react"

const DraftModal = ({ showDraftModal, handleSaveDraft, handleDiscardDraft }) => {
  if (!showDraftModal) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#181818] rounded-xl p-6 max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Unsaved Changes</h3>
          <button onClick={handleDiscardDraft} className="p-2 hover:bg-zinc-700 rounded-lg">
            <X size={16} />
          </button>
        </div>
        <p className="text-gray-400 mb-6">
          You have unsaved changes in your email. Would you like to save as draft or discard?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={handleDiscardDraft}
            className="px-4 py-2 text-gray-400 hover:text-white flex items-center gap-2"
          >
            <Trash2 size={16} />
            Discard
          </button>
          <button
            onClick={handleSaveDraft}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2"
          >
            <Save size={16} />
            Save Draft
          </button>
        </div>
      </div>
    </div>
  )
}

export default DraftModal
