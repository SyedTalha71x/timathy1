/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import { useEffect, useState } from "react"

const EditColumnModal = ({ isVisible, onClose, column, onSave }) => {
  const [title, setTitle] = useState("")
  const [color, setColor] = useState("")

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
      <div className="bg-[#1C1C1C] p-6 rounded-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-white font-bold">Edit Column</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-200 block mb-2">Column Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-200 block mb-2">Column Color</label>
            <div className="flex gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-10 p-1 bg-[#141414] border-gray-700 rounded"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full bg-[#141414] rounded-xl px-4 py-2 text-white outline-none text-sm"
                placeholder="#000000"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-600 text-white rounded-xl hover:bg-gray-700"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm bg-orange-500 text-white rounded-xl hover:bg-orange-600">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditColumnModal