import { useParams, useNavigate } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import Members from "../../studio-view/members"

// Temporary: lookup studio name from static data
// Replace with API call when backend is ready
import { studioDataNew } from "../../../utils/admin-panel-states/states"

/**
 * Admin wrapper for viewing/managing a studio's members.
 *
 * Route: /admin-dashboard/studio-members/:studioId
 *
 * Renders the shared Members page in "admin" mode,
 * passing the studioId so it loads studio-specific member data.
 */
export default function EditStudioMembersPage() {
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
          {studioName} — Members
        </span>
      </div>

      {/* Shared Members page in admin mode */}
      <div className="flex-1 min-h-0">
        <Members
          studioId={Number(studioId)}
          mode="admin"
          studioName={studioName}
        />
      </div>
    </div>
  )
}
