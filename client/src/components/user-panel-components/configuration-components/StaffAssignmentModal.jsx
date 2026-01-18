/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { X, Search, Info, Check } from "lucide-react"

export const StaffAssignmentModal = ({
  visible,
  onClose,
  role,
  allStaff = [],
  onStaffAssignmentChange
}) => {
  const [assignedStaff, setAssignedStaff] = useState([])
  const [searchText, setSearchText] = useState("")

  // Reset assigned staff when role changes
  useEffect(() => {
    if (role) {
      setAssignedStaff(role.assignedStaff || [])
    }
  }, [role])

  // Filter staff based on search
  const filteredStaff = allStaff.filter(staff =>
    staff.name.toLowerCase().includes(searchText.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchText.toLowerCase())
  )

  const handleToggleStaff = (staffId) => {
    // Prevent removing last admin
    if (role?.isAdmin && assignedStaff.length === 1 && assignedStaff.includes(staffId)) {
      return
    }

    const newAssignedStaff = assignedStaff.includes(staffId)
      ? assignedStaff.filter(id => id !== staffId)
      : [...assignedStaff, staffId]

    setAssignedStaff(newAssignedStaff)
  }

  const handleSave = () => {
    // Ensure at least one staff remains for admin role
    if (role?.isAdmin && assignedStaff.length === 0) {
      return
    }

    onStaffAssignmentChange(role.id, assignedStaff)
    onClose()
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1C1C1C] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#333333]">
          <div>
            <h2 className="text-lg font-semibold text-white">Assign Staff</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {role?.name || "Role"} • {assignedStaff.length} assigned
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#333333] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[#333333]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full bg-[#141414] text-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        {/* Staff List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredStaff.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No staff found</p>
            </div>
          ) : (
            filteredStaff.map((staff) => {
              const isAssigned = assignedStaff.includes(staff.id)
              const isLastAdmin = role?.isAdmin && assignedStaff.length === 1 && isAssigned

              return (
                <button
                  key={staff.id}
                  onClick={() => handleToggleStaff(staff.id)}
                  disabled={isLastAdmin}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                    isLastAdmin
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer hover:border-[#444444]"
                  } ${
                    isAssigned
                      ? "bg-orange-500/10 border-orange-500/30"
                      : "bg-[#141414] border-[#333333]"
                  }`}
                >
                  {/* Checkbox */}
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    isAssigned
                      ? "bg-orange-500 border-orange-500"
                      : "border-[#444444]"
                  }`}>
                    {isAssigned && <Check className="w-3 h-3 text-white" />}
                  </div>

                  {/* Avatar */}
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-medium text-sm"
                    style={{ backgroundColor: role?.color || "#FF843E" }}
                  >
                    {staff.avatar ? (
                      <img 
                        src={staff.avatar} 
                        alt={staff.name} 
                        className="w-full h-full rounded-xl object-cover" 
                      />
                    ) : (
                      staff.name.split(' ').map(n => n[0]).join('').toUpperCase()
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{staff.name}</p>
                    <p className="text-gray-500 text-xs truncate">{staff.email}</p>
                  </div>

                  {/* Last Admin Warning */}
                  {isLastAdmin && (
                    <div className="flex-shrink-0" title="Cannot remove the last admin">
                      <Info className="w-4 h-4 text-orange-400" />
                    </div>
                  )}
                </button>
              )
            })
          )}
        </div>

        {/* Admin Notice */}
        {role?.isAdmin && (
          <div className="mx-4 mb-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-orange-300">
                At least one staff member must remain assigned to the Admin role.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-[#333333]">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-[#2F2F2F] text-white text-sm font-medium rounded-xl hover:bg-[#3F3F3F] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={role?.isAdmin && assignedStaff.length === 0}
            className="flex-1 px-4 py-2.5 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
