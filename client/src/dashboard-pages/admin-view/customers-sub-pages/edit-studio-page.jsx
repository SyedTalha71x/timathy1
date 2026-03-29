import AdminStudioLayout from "./admin-studio-layout"
import ConfigurationPage from "../../studio-view/configuration"

/**
 * Admin wrapper for editing a studio's configuration.
 * Route: /admin-dashboard/edit-studio-configuration/:studioId
 */
export default function EditStudioPage() {
  return (
    <AdminStudioLayout pageKey="studioConfiguration">
      {({ studioId, studioName }) => (
        <ConfigurationPage studioId={studioId} mode="admin" studioName={studioName} />
      )}
    </AdminStudioLayout>
  )
}
