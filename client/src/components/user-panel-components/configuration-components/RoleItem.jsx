/* eslint-disable react/prop-types */
import { Shield, Users, Copy, Trash2 } from "lucide-react"

export const RoleItem = ({ 
  role, 
  index, 
  onUpdate, 
  onDelete, 
  onCopy, 
  onOpenPermissionModal, 
  onOpenStaffAssignment,
  isAdminRole = false 
}) => {
  return (
    <div className="p-4 bg-[#141414] border border-[#333333] rounded-xl space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
        {/* Role Name Input */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Role Name"
            value={role.name}
            onChange={(e) => onUpdate(index, "name", e.target.value)}
            className="w-full bg-[#1F1F1F] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-orange-500 transition-colors"
          />
        </div>

        {/* Color Picker */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">Color:</label>
          <input
            type="color"
            value={role.color || "#FF843E"}
            onChange={(e) => onUpdate(index, "color", e.target.value)}
            className="w-10 h-10 rounded-lg border border-[#333333] bg-transparent cursor-pointer"
            style={{ padding: 2 }}
          />
        </div>

        {/* Staff Count Button */}
        <button
          onClick={() => onOpenStaffAssignment(index)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1F1F1F] border border-[#333333] rounded-xl text-sm hover:bg-[#2F2F2F] transition-colors"
          style={{ color: role.color || "#FF843E" }}
        >
          <Users className="w-4 h-4" />
          <span className="text-white">Staff</span>
          <span className="bg-[#333333] px-2 py-0.5 rounded-lg text-xs">
            {role.staffCount || 0}
          </span>
        </button>

        {/* Permissions Button */}
        <button
          onClick={() => !isAdminRole && onOpenPermissionModal(index)}
          disabled={isAdminRole}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            isAdminRole
              ? "bg-orange-500/20 text-orange-300 cursor-not-allowed border border-orange-500/30"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <Shield className="w-4 h-4" />
          Permissions
          <span className={`px-2 py-0.5 rounded-lg text-xs ${
            isAdminRole ? "bg-orange-500/30" : "bg-blue-700"
          }`}>
            {role.permissions?.length || 0}
          </span>
        </button>

        {/* Copy Button */}
        <button
          onClick={() => onCopy(index)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          <Copy className="w-4 h-4" />
          Copy
        </button>

        {/* Delete Button - Hidden for Admin */}
        {!isAdminRole && (
          <button
            onClick={() => onDelete(index)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl text-sm font-medium hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </button>
        )}
      </div>

      {/* Admin Role Notice */}
      {isAdminRole && (
        <div className="flex items-start gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
          <Shield className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-orange-300">
            This is the Admin role with all permissions. Permissions cannot be modified, 
            but you can change the role name and color.
          </p>
        </div>
      )}
    </div>
  )
}
