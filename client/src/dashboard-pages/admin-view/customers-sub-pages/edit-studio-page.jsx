import { useParams, useNavigate } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import ConfigurationPage from "../../studio-view/configuration"

// Temporary: lookup studio name from static data
// Replace with API call when backend is ready
import { studioDataNew } from "../../../utils/admin-panel-states/states"

/**
 * Admin wrapper for editing a studio's configuration.
 *
 * Route: /admin-dashboard/edit-studio-configuration/:studioId
 *
 * Renders the shared ConfigurationPage in "admin" mode,
 * which hides the Profile section and shows the admin banner.
 */
export default function EditStudioPage() {
  const { studioId } = useParams()
  const navigate = useNavigate()

  // Temporary: find studio name from static data
  const studio = studioDataNew.find((s) => String(s.id) === String(studioId))
  const studioName = studio?.name || `Studio #${studioId}`

  return (
    <div className="flex flex-col h-full min-h-screen text-white">
      {/* Back navigation */}
      <div className="flex items-center gap-3 p-4 border-b border-[#333333] flex-shrink-0">
        <button
          onClick={() => navigate("/admin-dashboard/customers")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Studios
        </button>
        <span className="text-gray-600">|</span>
        <span className="text-gray-300 text-sm font-medium">
          {studioName} — Studio Configuration
        </span>
      </div>

      {/* Shared ConfigurationPage in admin mode */}
      <div className="flex-1 min-h-0">
        <ConfigurationPage
          studioId={Number(studioId)}
          mode="admin"
          studioName={studioName}
        />
      </div>
    </div>
  )
}
