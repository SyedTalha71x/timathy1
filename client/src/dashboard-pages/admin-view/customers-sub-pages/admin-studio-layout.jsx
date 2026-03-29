import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ChevronLeft } from "lucide-react"

// Temporary: lookup studio name from static data
// Replace with API call when backend is ready
import { studioDataNew } from "../../../utils/admin-panel-states/states"

/**
 * Shared layout for all admin "edit studio" pages.
 *
 * Provides a consistent back-navigation header with the studio name
 * and a translated page label, then renders `children` below.
 *
 * Props:
 *  - pageKey:    translation key suffix under `admin.customers.editStudioPages`
 *                e.g. "leads" | "members" | "staff" | "contracts" | "finances" | "studioConfiguration"
 *  - children:   the page-specific content (receives { studioId, studioName } via render-prop)
 */
export default function AdminStudioLayout({ pageKey, children }) {
  const { studioId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  // Temporary: find studio name from static data
  const studio = studioDataNew.find((s) => String(s.id) === String(studioId))
  const studioName = studio?.name || `Studio #${studioId}`

  const pageLabel = t(`admin.customers.editStudioPages.${pageKey}`)

  return (
    <div className="flex flex-col h-full min-h-screen text-white">
      {/* Back navigation */}
      <div className="flex items-center gap-3 p-4 border-b border-[#333333] flex-shrink-0">
        <button
          onClick={() => navigate("/admin-dashboard/customers")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          {t("admin.customers.editStudioPages.backToStudios")}
        </button>
        <span className="text-gray-600">|</span>
        <span className="text-gray-300 text-sm font-medium">
          {studioName} — {pageLabel}
        </span>
      </div>

      {/* Page content */}
      <div className="flex-1 min-h-0">
        {typeof children === "function"
          ? children({ studioId: Number(studioId), studioName })
          : children}
      </div>
    </div>
  )
}
