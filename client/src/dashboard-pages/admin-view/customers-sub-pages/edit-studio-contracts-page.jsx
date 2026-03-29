import AdminStudioLayout from "./admin-studio-layout"
import ContractList from "../../studio-view/contract"

/**
 * Admin wrapper for viewing/managing a studio's contracts.
 * Route: /admin-dashboard/studio-contracts/:studioId
 */
export default function EditStudioContractsPage() {
  return (
    <AdminStudioLayout pageKey="contracts">
      {({ studioId, studioName }) => (
        <ContractList studioId={studioId} mode="admin" studioName={studioName} />
      )}
    </AdminStudioLayout>
  )
}
