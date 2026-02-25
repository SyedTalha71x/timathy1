import { useParams } from "react-router-dom"
import FinancesPage from "../../studio-view/finances"

export default function EditStudioFinancesPage() {
  const { studioId } = useParams()

  return (
    <FinancesPage
      studioId={studioId ? Number(studioId) : null}
      mode="admin"
      studioName={`Studio #${studioId}`}
    />
  )
}
