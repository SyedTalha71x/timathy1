import AdminStudioLayout from "./admin-studio-layout"
import FinancesPage from "../../studio-view/finances"

/**
 * Admin wrapper for viewing/managing a studio's finances.
 * Route: /admin-dashboard/studio-finances/:studioId
 */
export default function EditStudioFinancesPage() {
  return (
    <AdminStudioLayout pageKey="finances">
      {({ studioId, studioName }) => (
        <FinancesPage studioId={studioId} mode="admin" studioName={studioName} />
      )}
    </AdminStudioLayout>
  )
}
