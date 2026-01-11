import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import AdminConfigurationPage from "../../components/admin-dashboard-components/studios-modal/edit-admin-configuration"
import { studioDataNew } from "../../utils/admin-panel-states/states"

export default function EditAdminPage() {
  const { studioId } = useParams()
  const [studio, setStudio] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const studioData = studioDataNew.find(s => s.id === parseInt(studioId))
    setStudio(studioData)
    setLoading(false)
  }, [studioId])


  if (loading) return <div className="p-8 text-white">Loading...</div>
  if (!studio) return <div className="p-8 text-white">Studio not found</div>

  return (
    <div className="min-h-screen bg-[#1C1C1C] text-white">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
         
            <div>
              <h1 className="md:text-2xl text-xl font-bold">Edit Admin Configuration for {studio.name}</h1>
            </div>
          </div>
         
        </div>
      </div>

      <AdminConfigurationPage studioData={studio}/>
    </div>
  )
}