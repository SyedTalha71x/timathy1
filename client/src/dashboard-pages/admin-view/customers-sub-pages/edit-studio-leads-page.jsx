import { useParams } from "react-router-dom"
import Leads from "../../studio-view/leads"

export default function EditStudioLeadsPage() {
  const { studioId } = useParams()

  return (
    <Leads
      studioId={studioId ? Number(studioId) : null}
      mode="admin"
      studioName={`Studio #${studioId}`}
    />
  )
}
