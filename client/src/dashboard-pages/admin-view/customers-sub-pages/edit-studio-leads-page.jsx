import AdminStudioLayout from "./admin-studio-layout"
import Leads from "../../studio-view/leads"

/**
 * Admin wrapper for viewing/managing a studio's leads.
 * Route: /admin-dashboard/studio-leads/:studioId
 */
export default function EditStudioLeadsPage() {
  return (
    <AdminStudioLayout pageKey="leads">
      {({ studioId, studioName }) => (
        <Leads studioId={studioId} mode="admin" studioName={studioName} />
      )}
    </AdminStudioLayout>
  )
}
