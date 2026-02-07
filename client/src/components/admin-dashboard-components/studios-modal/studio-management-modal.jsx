/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react"
import { X, Search, ArrowRight, ArrowLeft, Edit, Building, Check } from "lucide-react"

// ── Avatars (same as assign-studios-modal) ──
const StudioAvatar = ({ name }) => {
  const initials = name ? name.substring(0, 2).toUpperCase() : "?"
  return (
    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
      <span className="text-white font-bold text-xs">{initials}</span>
    </div>
  )
}

const FranchiseAvatar = ({ name }) => {
  const initials = name ? name.substring(0, 2).toUpperCase() : "?"
  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
      <span className="text-white font-bold text-xs">{initials}</span>
    </div>
  )
}

// ════════════════════════════════════════════
// StudioManagementModal
// ════════════════════════════════════════════
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
  const [assignedSearch, setAssignedSearch] = useState("")
  const [unassignedSearch, setUnassignedSearch] = useState("")
  const [justAssigned, setJustAssigned] = useState(null)
  const [justUnassigned, setJustUnassigned] = useState(null)

  if (!isOpen || !franchise) return null

  const filteredAssigned = assignedStudios.filter((s) =>
    s.name.toLowerCase().includes(assignedSearch.toLowerCase()) ||
    (s.city && s.city.toLowerCase().includes(assignedSearch.toLowerCase()))
  )

  const filteredUnassigned = unassignedStudios.filter((s) =>
    s.name.toLowerCase().includes(unassignedSearch.toLowerCase()) ||
    (s.city && s.city.toLowerCase().includes(unassignedSearch.toLowerCase()))
  )

  const handleAssign = (studioId) => {
    setJustAssigned(studioId)
    setTimeout(() => {
      onAssignStudio(franchise.id, studioId)
      setJustAssigned(null)
    }, 350)
  }

  const handleUnassign = (studioId) => {
    setJustUnassigned(studioId)
    setTimeout(() => {
      onUnassignStudio(studioId)
      setJustUnassigned(null)
    }, 350)
  }

  // ── Studio Card (reused for both columns) ──
  const StudioCard = ({ studio, type }) => {
    const isAnimatingAssign = justAssigned === studio.id
    const isAnimatingUnassign = justUnassigned === studio.id
    const isAnimating = isAnimatingAssign || isAnimatingUnassign

    return (
      <div
        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
          isAnimatingAssign ? "bg-green-500/10 border border-green-500/30 scale-[0.98]"
          : isAnimatingUnassign ? "bg-red-500/10 border border-red-500/30 scale-[0.98]"
          : "bg-[#141414] border border-transparent"
        }`}
      >
        <StudioAvatar name={studio.name} />
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{studio.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-gray-500 truncate">{studio.city}{studio.zipCode ? `, ${studio.zipCode}` : ""}</p>
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
              studio.isActive !== false ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
            }`}>
              <span className={`w-1 h-1 rounded-full ${studio.isActive !== false ? "bg-green-400" : "bg-red-400"}`} />
              {studio.isActive !== false ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {type === "assigned" && (
            <>
              <button
                onClick={() => onEditStudio(studio)}
                className="p-1.5 text-gray-500 hover:text-white hover:bg-[#2F2F2F] rounded-lg transition-colors"
                title="Edit Studio"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={() => handleUnassign(studio.id)}
                disabled={isAnimating}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isAnimatingUnassign
                    ? "bg-red-500 text-white"
                    : "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                }`}
              >
                {isAnimatingUnassign ? <Check size={12} /> : <ArrowRight size={12} />}
                {isAnimatingUnassign ? "Removed" : "Remove"}
              </button>
            </>
          )}
          {type === "unassigned" && (
            <button
              onClick={() => handleAssign(studio.id)}
              disabled={isAnimating}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isAnimatingAssign
                  ? "bg-green-500 text-white"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              {isAnimatingAssign ? <Check size={12} /> : <ArrowLeft size={12} />}
              {isAnimatingAssign ? "Added" : "Assign"}
            </button>
          )}
        </div>
      </div>
    )
  }

  // ── Empty State ──
  const EmptyState = ({ message }) => (
    <div className="text-center py-10 text-gray-400">
      <Building size={32} className="mx-auto mb-3 opacity-40" />
      <p className="text-sm">{message}</p>
    </div>
  )

  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000]">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-5xl max-h-[90vh] md:max-h-[85vh] my-2 md:my-8 relative flex flex-col">

        {/* ── Sticky Header ── */}
        <div className="p-4 md:p-6 pb-4 flex-shrink-0 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FranchiseAvatar name={franchise.name} />
              <div>
                <h2 className="text-white text-lg font-semibold">Manage Studios</h2>
                <p className="text-sm text-gray-400">{franchise.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={20} className="cursor-pointer" />
            </button>
          </div>
        </div>

        {/* ── Two-Column Content ── */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-700">

          {/* Left: Assigned Studios */}
          <div className="flex flex-col min-h-0">
            <div className="p-4 md:px-6 md:pt-5 md:pb-3 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Assigned</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-md bg-blue-500/15 text-blue-400 font-medium">{assignedStudios.length}</span>
                </div>
              </div>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search assigned…"
                  value={assignedSearch}
                  onChange={(e) => setAssignedSearch(e.target.value)}
                  className="w-full bg-[#141414] text-white rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-blue-500/40"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-4 space-y-2 custom-scrollbar">
              {filteredAssigned.length > 0 ? (
                filteredAssigned.map((studio) => (
                  <StudioCard key={studio.id} studio={studio} type="assigned" />
                ))
              ) : assignedStudios.length === 0 ? (
                <EmptyState message="No studios assigned to this franchise yet." />
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No studios match "{assignedSearch}"
                </div>
              )}
            </div>
          </div>

          {/* Right: Unassigned Studios */}
          <div className="flex flex-col min-h-0">
            <div className="p-4 md:px-6 md:pt-5 md:pb-3 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Available</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-md bg-gray-500/15 text-gray-400 font-medium">{unassignedStudios.length}</span>
                </div>
              </div>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search available…"
                  value={unassignedSearch}
                  onChange={(e) => setUnassignedSearch(e.target.value)}
                  className="w-full bg-[#141414] text-white rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-blue-500/40"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-4 space-y-2 custom-scrollbar">
              {filteredUnassigned.length > 0 ? (
                filteredUnassigned.map((studio) => (
                  <StudioCard key={studio.id} studio={studio} type="unassigned" />
                ))
              ) : unassignedStudios.length === 0 ? (
                <EmptyState message="All studios are assigned to franchises." />
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No studios match "{unassignedSearch}"
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudioManagementModal
