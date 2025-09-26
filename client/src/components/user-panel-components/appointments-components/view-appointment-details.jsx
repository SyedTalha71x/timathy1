/* eslint-disable react/prop-types */
import { Copy } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

export function AppointmentDetailsModal({ isVisible, onClose, appointment }) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success("Time copied to clipboard")
  }

  if (!isVisible) return null

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <div className="fixed inset-0 z-[100]">
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

        <div className="fixed inset-0 flex items-center justify-center">
          <div className="relative w-full max-w-md bg-[#1C1C1C] rounded-xl shadow-xl p-6">
            {/* Heading and Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">{appointment.heading}</h2>
              <p className="text-gray-400 text-sm">{appointment.description}</p>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                {appointment.tags.map((tag, index) => (
                  <span key={index} className="text-gray-400 text-sm">
                    {tag}
                    {index < appointment.tags.length - 1 && <span className="ml-2">•</span>}
                  </span>
                ))}
              </div>
            </div>

            {/* Time */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Time</label>
              <div className="flex items-center justify-between bg-[#141414] rounded-lg p-3">
                <span className="text-white text-sm">{appointment.time}</span>
                <button
                  onClick={() => copyToClipboard(appointment.time)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Appointment Type */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Appointment type</label>
              <div className="bg-[#141414] rounded-lg p-3">
                <span className="text-white text-sm">{appointment.type}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

