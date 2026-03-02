import { useParams } from "react-router-dom"
import ContractList from "../../studio-view/contract"

export default function EditStudioContractsPage() {
  const { studioId } = useParams()

  return (
    <ContractList
      studioId={studioId ? Number(studioId) : null}
      mode="admin"
      studioName={`Studio #${studioId}`}
    />
  )
}
