/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import ColorPickerModal from "../../shared/ColorPickerModal"

const EditColumnModal = ({ isVisible, onClose, column, onSave }) => {
  const [title, setTitle] = useState("")
  const [color, setColor] = useState("")
  const [showColorPicker, setShowColorPicker] = useState(false)

  useEffect(() => {
    if (column) {
      setTitle(column.title)
      setColor(column.color)
    }
  }, [column])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ id: column.id, title, color })
  }

  if (!isVisible || !column) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex p-2 justify-center items-center z-50">
      <div className="bg-surface-card p-4 md:p-6 rounded-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-content-primary font-bold">Edit Column</h2>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary transition-colors">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-content-secondary block mb-2">Column Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
              required
            />
          </div>
          <div>
            <label className="text-sm text-content-secondary block mb-2">Column Color</label>
            <button
              type="button"
              onClick={() => setShowColorPicker(true)}
              className="w-full flex items-center gap-3 bg-surface-dark rounded-xl px-4 py-2 text-sm border border-transparent hover:border-border transition-colors"
            >
              <div className="w-6 h-6 rounded-lg border border-border flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-content-primary">{color}</span>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm bg-surface-button hover:bg-surface-button-hover text-content-primary rounded-xl transition-colors order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm bg-primary hover:bg-primary-hover text-white rounded-xl transition-colors order-1 sm:order-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <ColorPickerModal
        isOpen={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        onSelectColor={(c) => setColor(c)}
        currentColor={color}
        title="Column Color"
      />
    </div>
  )
}

export default EditColumnModal
