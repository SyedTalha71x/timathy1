/* eslint-disable react/prop-types */
import { X } from "lucide-react"

export default function Notification({ notification, onRemove }) {
  const getNotificationStyles = (type) => {
    switch (type) {
      case "completed":
        return "bg-[#152619]"
      case "ongoing":
        return "bg-[#1B2236]"
      case "canceled":
        return "bg-[#261515]"
      default:
        return "bg-gray-800"
    }
  }

  return (
    <div className={`${getNotificationStyles(notification.type)} rounded-xl p-4 relative`}>
      <button
        onClick={() => onRemove(notification.id)}
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
      >
        <X size={16} />
      </button>
      <h3 className="text-white open_sans_font_700 font-medium capitalize mb-2">{notification.type}</h3>
      <p className="text-gray-400 text-sm">{notification.message}</p>
    </div>
  )
}

