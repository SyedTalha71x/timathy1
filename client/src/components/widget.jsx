/* eslint-disable react/prop-types */
import { useState } from "react"
import { X } from "lucide-react"

export default function Widget({ title, children, editable }) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="bg-[#2F2F2F] rounded-xl p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl open_sans_font_700">{title}</h2>
        {editable && (
          <button onClick={() => setVisible(false)} className="text-zinc-400 hover:text-zinc-200">
            <X size={20} />
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

