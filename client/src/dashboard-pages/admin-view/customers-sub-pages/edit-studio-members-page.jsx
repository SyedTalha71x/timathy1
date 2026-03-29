import AdminStudioLayout from "./admin-studio-layout"
import Members from "../../studio-view/members"

/**
 * Admin wrapper for viewing/managing a studio's members.
 * Route: /admin-dashboard/studio-members/:studioId
 */
export default function EditStudioMembersPage() {
  return (
    <AdminStudioLayout pageKey="members">
      {({ studioId, studioName }) => (
        <Members studioId={studioId} mode="admin" studioName={studioName} />
      )}
    </AdminStudioLayout>
  )
}
