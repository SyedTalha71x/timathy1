/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react"
import { X, Search, Plus, Edit, Building, MapPin } from "lucide-react"

const StudioManagementModal = ({
  isOpen,
  onClose,
  franchise,
  assignedStudios,
  unassignedStudios,
  onAssignStudio,
  onUnassignStudio,
  onEditStudio,
  toast,
}) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [unassignedSearchQuery, setUnassignedSearchQuery] = useState("")
  const [selectedStudioToAssign, setSelectedStudioToAssign] = useState(null)

  if (!isOpen || !franchise) return null

  const filteredAssignedStudios = assignedStudios.filter((studio) =>
    studio.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredUnassignedStudios = unassignedStudios.filter((studio) =>
    studio.name.toLowerCase().includes(unassignedSearchQuery.toLowerCase()),
  )

  const handleAssignStudio = (studioId) => {
    onAssignStudio(franchise.id, studioId)
    setSelectedStudioToAssign(null)
    setUnassignedSearchQuery("")
  }

  const handleUnassignStudio = (studioId) => {
    onUnassignStudio(studioId)
  }

  return (
    <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-5xl my-8 relative max-h-[70vh] overflow-y-auto custom-scrollbar">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white open_sans_font_700 text-lg font-semibold">Manage Studios - {franchise.name}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={20} className="cursor-pointer" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Assigned Studios */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-medium">Assigned Studios ({assignedStudios.length})</h3>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search assigned studios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#101010] pl-10 pr-4 py-2 text-sm outline-none rounded-xl text-white placeholder-gray-500"
                />
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                {filteredAssignedStudios.length > 0 ? (
                  filteredAssignedStudios.map((studio) => (
                    <div key={studio.id} className="bg-[#161616] rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{studio.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin size={12} className="text-gray-400" />
                            <p className="text-gray-400 text-sm">
                              {studio.city}, {studio.zipCode}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${
                                studio.isActive ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                              }`}
                            >
                              {studio.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onEditStudio(studio)}
                            className="text-gray-200 cursor-pointer bg-black  rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleUnassignStudio(studio.id)}
                            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm"
                          >
                            Unassign
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <Building size={32} className="mx-auto mb-2 text-gray-600" />
                    <p>No assigned studios found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Available Studios to Assign */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-medium">Available Studios ({unassignedStudios.length})</h3>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search available studios..."
                  value={unassignedSearchQuery}
                  onChange={(e) => setUnassignedSearchQuery(e.target.value)}
                  className="w-full bg-[#101010] pl-10 pr-4 py-2 text-sm outline-none rounded-xl text-white placeholder-gray-500"
                />
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                {filteredUnassignedStudios.length > 0 ? (
                  filteredUnassignedStudios.map((studio) => (
                    <div key={studio.id} className="bg-[#161616] rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{studio.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin size={12} className="text-gray-400" />
                            <p className="text-gray-400 text-sm">
                              {studio.city}, {studio.zipCode}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${
                                studio.isActive ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                              }`}
                            >
                              {studio.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onEditStudio(studio)}
                            className="text-gray-200 cursor-pointer bg-black  rounded-xl border border-slate-600 py-2 px-4 hover:text-white hover:border-slate-400 transition-colors text-sm flex items-center justify-center gap-2"
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleAssignStudio(studio.id)}
                            className="bg-[#FF843E] hover:bg-[#FF843E]/90 px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                          >
                            <Plus size={14} />
                            Assign
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <Building size={32} className="mx-auto mb-2 text-gray-600" />
                    <p>No available studios found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudioManagementModal
