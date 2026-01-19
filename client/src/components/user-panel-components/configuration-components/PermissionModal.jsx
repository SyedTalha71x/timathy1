/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { X, Shield, Check, ChevronDown, ChevronUp, Info } from "lucide-react"
import { 
  Calendar,
  MessageCircle,
  CheckSquare,
  FileText,
  Users,
  ShoppingCart,
  BadgeDollarSign,
  Settings
} from "lucide-react"
import { BsPersonWorkspace } from "react-icons/bs"
import { RiContractLine } from "react-icons/ri"
import { TbBrandGoogleAnalytics } from "react-icons/tb"
import { CiMonitor } from "react-icons/ci"
import { FaUsers } from "react-icons/fa6"
import { CgGym } from "react-icons/cg"
import { PERMISSION_GROUPS, PERMISSION_DATA } from "../../../utils/user-panel-states/configuration-states"

// Icon mapping - using sidebar icons where applicable
const GROUP_ICONS = {
  CalendarOutlined: Calendar,
  MailOutlined: MessageCircle,
  MessageOutlined: MessageCircle,
  FileSearchOutlined: CiMonitor,
  CheckSquareOutlined: CheckSquare,
  FileTextOutlined: FileText,
  TeamOutlined: Users,
  UserOutlined: BsPersonWorkspace,
  UserAddOutlined: FaUsers,
  FileProtectOutlined: RiContractLine,
  ShoppingCartOutlined: ShoppingCart,
  DollarOutlined: BadgeDollarSign,
  ReadOutlined: CgGym,
  LineChartOutlined: TbBrandGoogleAnalytics,
  SettingOutlined: Settings,
}

export { PERMISSION_DATA }

export const PermissionModal = ({ 
  visible, 
  onClose, 
  role, 
  onPermissionChange, 
  isAdminRole = false 
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [expandedGroups, setExpandedGroups] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  // Initialize permissions when modal opens
  useEffect(() => {
    if (visible && role) {
      setSelectedPermissions(
        isAdminRole ? PERMISSION_DATA.map(p => p.key) : (role.permissions || [])
      )
      // Expand all groups by default
      setExpandedGroups(PERMISSION_GROUPS.map(g => g.group))
    }
  }, [visible, role, isAdminRole])

  const handlePermissionToggle = (permissionKey) => {
    if (isAdminRole) return

    const newPermissions = selectedPermissions.includes(permissionKey)
      ? selectedPermissions.filter(p => p !== permissionKey)
      : [...selectedPermissions, permissionKey]
    setSelectedPermissions(newPermissions)
  }

  const handleGroupToggle = (groupItems) => {
    if (isAdminRole) return

    const groupKeys = groupItems.map(item => item.key)
    const allGroupSelected = groupKeys.every(key =>
      selectedPermissions.includes(key)
    )

    if (allGroupSelected) {
      setSelectedPermissions(selectedPermissions.filter(
        p => !groupKeys.includes(p)
      ))
    } else {
      const newPermissions = [...selectedPermissions]
      groupKeys.forEach(key => {
        if (!newPermissions.includes(key)) {
          newPermissions.push(key)
        }
      })
      setSelectedPermissions(newPermissions)
    }
  }

  const toggleGroupExpand = (groupName) => {
    setExpandedGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    )
  }

  const handleSave = () => {
    if (isAdminRole) {
      onPermissionChange(PERMISSION_DATA.map(p => p.key))
    } else {
      onPermissionChange(selectedPermissions)
    }
    onClose()
  }

  const handleClearAll = () => {
    if (isAdminRole) return
    setSelectedPermissions([])
  }

  const handleSelectAll = () => {
    if (isAdminRole) return
    setSelectedPermissions(PERMISSION_DATA.map(p => p.key))
  }

  // Filter groups based on search
  const filteredGroups = searchQuery
    ? PERMISSION_GROUPS.map(group => ({
        ...group,
        items: group.items.filter(item =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.key.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(group => group.items.length > 0)
    : PERMISSION_GROUPS

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1C1C1C] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#333333]">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-gray-400" />
            <div>
              <h2 className="text-lg font-semibold text-white">Manage Permissions</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm text-gray-400">{role?.name || "Role"}</span>
                {isAdminRole && (
                  <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-lg">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#333333] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Notice */}
        {isAdminRole && (
          <div className="mx-5 mt-5 p-3 bg-[#2F2F2F] border border-[#444444] rounded-xl">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">
                This is the Admin role with all permissions. Permissions cannot be modified.
              </p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="p-5 border-b border-[#333333]">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleClearAll}
              disabled={isAdminRole}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                isAdminRole
                  ? "bg-[#2F2F2F] text-gray-500 cursor-not-allowed"
                  : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F] hover:text-white"
              }`}
            >
              Clear All
            </button>
            <button
              onClick={handleSelectAll}
              disabled={isAdminRole}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                isAdminRole
                  ? "bg-[#2F2F2F] text-gray-500 cursor-not-allowed"
                  : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F] hover:text-white"
              }`}
            >
              Select All
            </button>

            <div className="ml-auto flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-sm font-medium bg-[#333333] text-white">
                {selectedPermissions.length}
              </span>
              <span className="text-sm text-gray-400">of {PERMISSION_DATA.length} selected</span>
            </div>
          </div>
        </div>

        {/* Permission Groups */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {filteredGroups.map((group) => {
            const IconComponent = GROUP_ICONS[group.icon] || Settings
            const groupItems = group.items
            const groupKeys = groupItems.map(item => item.key)
            const allGroupSelected = isAdminRole ? true : groupKeys.every(key =>
              selectedPermissions.includes(key)
            )
            const someGroupSelected = isAdminRole ? false : groupKeys.some(key =>
              selectedPermissions.includes(key)
            )
            const selectedCount = isAdminRole 
              ? groupItems.length 
              : groupKeys.filter(key => selectedPermissions.includes(key)).length
            const isExpanded = expandedGroups.includes(group.group)

            return (
              <div 
                key={group.group} 
                className="border border-[#333333] rounded-xl overflow-hidden"
              >
                {/* Group Header */}
                <div className="flex items-center justify-between p-4 bg-[#1F1F1F]">
                  <button
                    onClick={() => toggleGroupExpand(group.group)}
                    className="flex items-center gap-3 flex-1"
                  >
                    <IconComponent className="w-5 h-5 text-gray-400" />
                    <div className="text-left">
                      <h3 className="text-white font-medium">{group.group}</h3>
                      <p className="text-xs text-gray-500">
                        {selectedCount} of {groupItems.length} selected
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </button>

                  <button
                    onClick={() => handleGroupToggle(groupItems)}
                    disabled={isAdminRole}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isAdminRole
                        ? "bg-[#333333] text-gray-500 cursor-not-allowed"
                        : allGroupSelected
                          ? "bg-[#444444] text-white hover:bg-[#555555]"
                          : "bg-[#333333] text-gray-300 hover:bg-[#444444]"
                    }`}
                  >
                    {allGroupSelected ? "Deselect All" : "Select All"}
                  </button>
                </div>

                {/* Permissions Grid */}
                {isExpanded && (
                  <div className="p-4 bg-[#141414]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {groupItems.map((permission) => {
                        const isSelected = isAdminRole ? true : selectedPermissions.includes(permission.key)
                        
                        return (
                          <button
                            key={permission.key}
                            onClick={() => handlePermissionToggle(permission.key)}
                            disabled={isAdminRole}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                              isAdminRole
                                ? "cursor-not-allowed"
                                : "cursor-pointer hover:border-[#444444]"
                            } ${
                              isSelected
                                ? "bg-[#1F1F1F] border-[#444444]"
                                : "bg-[#181818] border-[#333333]"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                              isSelected
                                ? "bg-orange-500 border-orange-500"
                                : "border-[#444444]"
                            }`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`text-sm ${
                              isSelected ? "text-white" : "text-gray-400"
                            }`}>
                              {permission.label}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-[#333333]">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-[#2F2F2F] text-white text-sm font-medium rounded-xl hover:bg-[#3F3F3F] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Save Permissions
          </button>
        </div>
      </div>
    </div>
  )
}
