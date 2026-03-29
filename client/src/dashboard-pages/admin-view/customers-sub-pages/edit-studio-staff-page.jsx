import AdminStudioLayout from "./admin-studio-layout"
import StaffManagement from "../../studio-view/staff"

/**
 * Admin wrapper for viewing/managing a studio's staff.
 * Route: /admin-dashboard/studio-staff/:studioId
 */
export default function EditStudioStaffPage() {
  return (
    <AdminStudioLayout pageKey="staff">
      {({ studioId, studioName }) => (
        <StaffManagement studioId={studioId} mode="admin" studioName={studioName} />
      )}
    </AdminStudioLayout>
  )
}
