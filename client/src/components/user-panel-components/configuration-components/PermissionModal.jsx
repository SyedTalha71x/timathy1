/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { X, Shield, Check, ChevronDown, ChevronUp, Info } from "lucide-react"
import { 
  Calendar,
  Mail,
  MessageCircle,
  FileSearch,
  CheckSquare,
  FileText,
  Users,
  UserPlus,
  FileCheck,
  ShoppingCart,
  DollarSign,
  BookOpen,
  BarChart3,
  Settings
} from "lucide-react"

// Icon mapping
const GROUP_ICONS = {
  CalendarOutlined: Calendar,
  MailOutlined: Mail,
  MessageOutlined: MessageCircle,
  FileSearchOutlined: FileSearch,
  CheckSquareOutlined: CheckSquare,
  FileTextOutlined: FileText,
  TeamOutlined: Users,
  UserAddOutlined: UserPlus,
  FileProtectOutlined: FileCheck,
  ShoppingCartOutlined: ShoppingCart,
  DollarOutlined: DollarSign,
  ReadOutlined: BookOpen,
  LineChartOutlined: BarChart3,
  SettingOutlined: Settings,
}

// Permission groups - this should match your existing PERMISSION_GROUPS structure
const PERMISSION_GROUPS = [
  {
    group: "Appointments",
    icon: "CalendarOutlined",
    items: ["View Appointments", "Create Appointments", "Edit Appointments", "Delete Appointments", "Manage Calendar"]
  },
  {
    group: "Communication",
    icon: "MailOutlined",
    items: ["Send Messages", "View Messages", "Manage Newsletters", "Manage Templates"]
  },
  {
    group: "Members",
    icon: "TeamOutlined",
    items: ["View Members", "Create Members", "Edit Members", "Delete Members", "Export Members"]
  },
  {
    group: "Contracts",
    icon: "FileProtectOutlined",
    items: ["View Contracts", "Create Contracts", "Edit Contracts", "Delete Contracts", "Manage Contract Types"]
  },
  {
    group: "Staff",
    icon: "UserAddOutlined",
    items: ["View Staff", "Create Staff", "Edit Staff", "Delete Staff", "Manage Roles"]
  },
  {
    group: "Finances",
    icon: "DollarOutlined",
    items: ["View Finances", "Create Invoices", "Process Payments", "Manage VAT", "Export Reports"]
  },
  {
    group: "Analytics",
    icon: "LineChartOutlined",
    items: ["View Analytics", "Export Analytics", "Manage Reports"]
  },
  {
    group: "Configuration",
    icon: "SettingOutlined",
    items: ["View Settings", "Edit Settings", "Manage Integrations", "System Administration"]
  }
]

// Generate flat permission data
export const PERMISSION_DATA = PERMISSION_GROUPS.flatMap((g) =>
  g.items.map((perm) => ({
    key: perm,
    title: perm,
    group: g.group,
    iconName: g.icon,
  }))
)

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

  const handlePermissionToggle = (permission) => {
    if (isAdminRole) return

    const newPermissions = selectedPermissions.includes(permission)
      ? selectedPermissions.filter(p => p !== permission)
      : [...selectedPermissions, permission]
    setSelectedPermissions(newPermissions)
  }

  const handleGroupToggle = (groupItems) => {
    if (isAdminRole) return

    const allGroupSelected = groupItems.every(item =>
      selectedPermissions.includes(item)
    )

    if (allGroupSelected) {
      setSelectedPermissions(selectedPermissions.filter(
        p => !groupItems.includes(p)
      ))
    } else {
      const newPermissions = [...selectedPermissions]
      groupItems.forEach(item => {
        if (!newPermissions.includes(item)) {
          newPermissions.push(item)
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
          item.toLowerCase().includes(searchQuery.toLowerCase())
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
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
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
          <div className="mx-5 mt-5 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-orange-300">
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
                  : "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
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
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
              }`}
            >
              Select All
            </button>

            <div className="ml-auto flex items-center gap-2">
              <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                isAdminRole ? "bg-orange-500" : "bg-blue-600"
              } text-white`}>
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
            const allGroupSelected = isAdminRole ? true : groupItems.every(item =>
              selectedPermissions.includes(item)
            )
            const someGroupSelected = isAdminRole ? false : groupItems.some(item =>
              selectedPermissions.includes(item)
            )
            const selectedCount = isAdminRole 
              ? groupItems.length 
              : groupItems.filter(item => selectedPermissions.includes(item)).length
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
                    <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-orange-400" />
                    </div>
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
                        ? "bg-orange-500/20 text-orange-300 cursor-not-allowed"
                        : allGroupSelected
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : someGroupSelected
                            ? "bg-yellow-600 text-white hover:bg-yellow-700"
                            : "bg-[#333333] text-gray-300 hover:bg-[#444444]"
                    }`}
                  >
                    {isAdminRole 
                      ? "Required" 
                      : allGroupSelected 
                        ? "Deselect All" 
                        : "Select All"}
                  </button>
                </div>

                {/* Permissions Grid */}
                {isExpanded && (
                  <div className="p-4 bg-[#141414]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {groupItems.map((permission) => {
                        const isSelected = isAdminRole ? true : selectedPermissions.includes(permission)
                        
                        return (
                          <button
                            key={permission}
                            onClick={() => handlePermissionToggle(permission)}
                            disabled={isAdminRole}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                              isAdminRole
                                ? "cursor-not-allowed"
                                : "cursor-pointer hover:border-[#444444]"
                            } ${
                              isSelected
                                ? isAdminRole
                                  ? "bg-orange-500/10 border-orange-500/30"
                                  : "bg-[#1F1F1F] border-[#444444]"
                                : "bg-[#181818] border-[#333333]"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                              isSelected
                                ? isAdminRole
                                  ? "bg-orange-500 border-orange-500"
                                  : "bg-blue-600 border-blue-600"
                                : "border-[#444444]"
                            }`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`text-sm ${
                              isSelected
                                ? isAdminRole
                                  ? "text-orange-300"
                                  : "text-white"
                                : "text-gray-400"
                            }`}>
                              {permission}
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
            {isAdminRole ? "Confirm" : "Save Permissions"}
          </button>
        </div>
      </div>
    </div>
  )
}
