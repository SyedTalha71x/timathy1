import { useState, useEffect } from "react"
import { useParams } from "react-router-dom" 
import ConfigurationPage from "../../components/admin-dashboard-components/studios-modal/edit-studio-configuration"
import { studioDataNew } from "../../utils/admin-panel-states/states"

export default function EditStudioPage() {
  const { studioId } = useParams()
  const [studio, setStudio] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const studioData = studioDataNew.find(s => s.id === parseInt(studioId))
        setStudio(studioData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching studio:", error)
        setLoading(false)
      }
    }

    if (studioId) {
      fetchStudio()
    }
  }, [studioId])

  // ✅ Fixed handleSave function
  const handleSave = (updatedStudio) => {
    console.log("💾 Saving studio configuration...")
    
    // Debugging
    if (updatedStudio.roles) {
      console.log("🔐 Roles being updated:", updatedStudio.roles)
      updatedStudio.roles.forEach((role, index) => {
        console.log(`Role ${index}: ${role.name} - ${role.permissions?.length} permissions`)
      })
    }
    
    // Update state
    setStudio(prevStudio => ({
      ...prevStudio,
      ...updatedStudio,
      roles: updatedStudio.roles || prevStudio.roles
    }))
    
    // Yahan pe actual save logic (API call, etc.)
    // saveToDatabase(updatedStudio);
    
    console.log("✅ Studio configuration saved successfully!")
  }

  if (loading) {
    return <div className="p-8 text-white">Loading...</div>
  }

  if (!studio) {
    return <div className="p-8 text-white">Studio not found</div>
  }

  return (
    <div className="min-h-screen bg-[#1C1C1C] text-white">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="md:text-2xl text-xl font-bold">
                Edit Studio Configuration for {studio.name}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <ConfigurationPage
        studio={studio}
        onSave={handleSave}
      />
    </div>
  )
}