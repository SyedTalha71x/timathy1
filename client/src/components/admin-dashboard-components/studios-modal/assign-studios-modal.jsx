/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useMemo, useRef, useEffect } from "react"
import { X, Search, ArrowRight, Check, Building, Network, ChevronDown } from "lucide-react"

// ── Avatars ──
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
    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
      <span className="text-white font-bold text-xs">{initials}</span>
    </div>
  )
}

// ════════════════════════════════════════════
// AssignStudioModal
// ════════════════════════════════════════════
const AssignStudioModal = ({
  isOpen,
  onClose,
  franchises,
  selectedFranchiseForAssignment,
  onFranchiseSelect,
  unassignedStudios,
  onAssignStudio,
  toast,
  searchQuery: _searchQuery,
  onSearchChange: _onSearchChange,
}) => {
  const [studioSearchTerm, setStudioSearchTerm] = useState("")
  const [franchiseDropdownOpen, setFranchiseDropdownOpen] = useState(false)
  const [franchiseSearch, setFranchiseSearch] = useState("")
  const [justAssigned, setJustAssigned] = useState(null)
  const dropdownRef = useRef(null)

  // Filter studios
  const filteredStudios = useMemo(() => {
    if (!studioSearchTerm) return unassignedStudios || []
    return (unassignedStudios || []).filter((s) =>
      s.name.toLowerCase().includes(studioSearchTerm.toLowerCase()) ||
      (s.city && s.city.toLowerCase().includes(studioSearchTerm.toLowerCase())) ||
      (s.zipCode && s.zipCode.toLowerCase().includes(studioSearchTerm.toLowerCase()))
    )
  }, [unassignedStudios, studioSearchTerm])

  // Filter franchises for dropdown
  const filteredFranchises = useMemo(() => {
    const active = (franchises || []).filter((f) => !f.isArchived)
    if (!franchiseSearch) return active
    return active.filter((f) => f.name.toLowerCase().includes(franchiseSearch.toLowerCase()))
  }, [franchises, franchiseSearch])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setFranchiseDropdownOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setStudioSearchTerm("")
      setFranchiseSearch("")
      setFranchiseDropdownOpen(false)
      setJustAssigned(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleAssign = (studioId) => {
    if (!selectedFranchiseForAssignment) {
      toast.error("Please select a franchise first")
      return
    }
    setJustAssigned(studioId)
    setTimeout(() => {
      onAssignStudio(selectedFranchiseForAssignment.id, studioId)
      setJustAssigned(null)
    }, 400)
  }

  const selectFranchise = (f) => {
    onFranchiseSelect(f)
    setFranchiseDropdownOpen(false)
    setFranchiseSearch("")
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000]">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-2xl max-h-[90vh] md:max-h-[85vh] my-2 md:my-8 relative flex flex-col">

        {/* Header + Step 1 */}
        <div className="p-4 md:p-6 pb-4 flex-shrink-0 border-b border-gray-700">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-white text-lg font-semibold">Assign Studios to Franchise</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={20} className="cursor-pointer" />
            </button>
          </div>

          {/* Step 1: Select Franchise */}
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold block mb-2">
              1. Select Franchise
            </label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setFranchiseDropdownOpen(!franchiseDropdownOpen)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors text-left ${
                  selectedFranchiseForAssignment
                    ? "border-blue-500/40 bg-blue-500/5"
                    : "border-[#333333] bg-[#141414] hover:border-[#444]"
                }`}
              >
                {selectedFranchiseForAssignment ? (
                  <>
                    <FranchiseAvatar name={selectedFranchiseForAssignment.name} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{selectedFranchiseForAssignment.name}</p>
                      <p className="text-xs text-gray-500">{selectedFranchiseForAssignment.city || "No location"}</p>
                    </div>
                    <Check size={16} className="text-blue-400 flex-shrink-0" />
                  </>
                ) : (
                  <>
                    <Network size={18} className="text-gray-500 flex-shrink-0" />
                    <span className="text-gray-500 text-sm flex-1">Click to select a franchise…</span>
                  </>
                )}
                <ChevronDown size={16} className={`text-gray-400 transition-transform flex-shrink-0 ${franchiseDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {franchiseDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1F1F1F] border border-[#333] rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-2 border-b border-[#333]">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search franchises…"
                        value={franchiseSearch}
                        onChange={(e) => setFranchiseSearch(e.target.value)}
                        className="w-full bg-[#141414] text-white rounded-lg pl-9 pr-3 py-2 text-sm outline-none border border-[#333]"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto custom-scrollbar">
                    {filteredFranchises.length > 0 ? filteredFranchises.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => selectFranchise(f)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#2F2F2F] transition-colors ${
                          selectedFranchiseForAssignment?.id === f.id ? "bg-blue-500/10" : ""
                        }`}
                      >
                        <FranchiseAvatar name={f.name} />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm truncate">{f.name}</p>
                          <p className="text-xs text-gray-500">{f.city || "–"}</p>
                        </div>
                        {selectedFranchiseForAssignment?.id === f.id && (
                          <Check size={14} className="text-blue-400 flex-shrink-0" />
                        )}
                      </button>
                    )) : (
                      <div className="px-4 py-4 text-sm text-gray-500 text-center">No franchises found</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 2: Studios list */}
        <div className="p-4 md:p-6 pt-4 overflow-y-auto flex-1">
          <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold block mb-3">
            2. Assign Unassigned Studios
          </label>

          {/* Studio search */}
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search studios…"
              value={studioSearchTerm}
              onChange={(e) => setStudioSearchTerm(e.target.value)}
              className="w-full bg-[#141414] text-white rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-blue-500/40"
            />
          </div>

          <div className="space-y-2">
            {filteredStudios.length > 0 ? (
              filteredStudios.map((studio) => {
                const isAssigning = justAssigned === studio.id
                return (
                  <div
                    key={studio.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      isAssigning ? "bg-green-500/10 border border-green-500/30 scale-[0.98]" : "bg-[#141414] border border-transparent"
                    }`}
                  >
                    <StudioAvatar name={studio.name} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{studio.name}</p>
                      <p className="text-xs text-gray-500">{studio.city}{studio.zipCode ? `, ${studio.zipCode}` : ""}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAssign(studio.id)}
                      disabled={!selectedFranchiseForAssignment || isAssigning}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isAssigning
                          ? "bg-green-500 text-white"
                          : selectedFranchiseForAssignment
                            ? "bg-orange-500 hover:bg-orange-600 text-white"
                            : "bg-[#2F2F2F] text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {isAssigning ? (
                        <><Check size={12} /> Assigned</>
                      ) : (
                        <><ArrowRight size={12} /> Assign</>
                      )}
                    </button>
                  </div>
                )
              })
            ) : (unassignedStudios || []).length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <Building size={36} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">All studios are already assigned to franchises.</p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                No studios match "{studioSearchTerm}"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssignStudioModal
