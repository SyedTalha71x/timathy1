/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { X, Shield, Check, Info, Eye, EyeOff } from "lucide-react"
import { 
  Calendar,
  CheckSquare,
  ShoppingCart,
  BadgeDollarSign,
  Settings,
  Home,
  Image,
  ClipboardList,
} from "lucide-react"
import { BsPersonWorkspace, BsFillClipboard2HeartFill } from "react-icons/bs"
import { RiContractLine } from "react-icons/ri"
import { TbBrandGoogleAnalytics, TbMessage } from "react-icons/tb"
import { CiMonitor } from "react-icons/ci"
import { CgGym } from "react-icons/cg"
import { FaPersonRays, FaNotesMedical } from "react-icons/fa6"
import { HiOutlineUsers } from "react-icons/hi2"
import { IoIosCheckmarkCircleOutline } from "react-icons/io"

// ============================================
// Permission Data
// ============================================
export const PERMISSION_GROUPS = [
  {
    group: "My Area",
    icon: Home,
    items: [
      { key: "my_area.view", label: "View My Area", isView: true },
      { key: "my_area.edit_widgets", label: "Edit Widgets", chip: "Edit Widgets" },
      { key: "my_area.manage_view", label: "Manage View", chip: "Manage View" },
    ],
  },
  {
    group: "Appointments",
    icon: Calendar,
    items: [
      { key: "appointments.view", label: "View Appointments", isView: true },
      { key: "appointments.book", label: "Book Appointments", chip: "Book" },
      { key: "appointments.book_trial", label: "Book Trial Trainings", chip: "Trial Trainings" },
      { key: "appointments.block_slots", label: "Block Time Slots", chip: "Block Slots" },
    ],
  },
  {
    group: "Messenger",
    icon: TbMessage,
    items: [
      { key: "messenger.view", label: "View Messenger", isView: true },
      { key: "messenger.member_chat", label: "Member Chat Access", chip: "Member Chat" },
      { key: "messenger.studio_chat", label: "Studio Chat Access", chip: "Studio Chat" },
      { key: "messenger.email", label: "Email Access", chip: "Email" },
      { key: "messenger.broadcast", label: "Broadcast Access", chip: "Broadcast" },
    ],
  },
  {
    group: "Bulletin Board",
    icon: ClipboardList,
    items: [
      { key: "bulletin.view", label: "View Bulletin Board", isView: true },
      { key: "bulletin.create", label: "Create Posts", chip: "Create" },
      { key: "bulletin.edit", label: "Edit Posts", chip: "Edit" },
      { key: "bulletin.delete", label: "Delete Posts", chip: "Delete" },
    ],
  },
  {
    group: "Activity Monitor",
    icon: CiMonitor,
    items: [
      { key: "activity_monitor.view", label: "View Activity Monitor", isView: true },
      { key: "activity_monitor.appointment_requests", label: "Appointment Requests", chip: "Appointments" },
      { key: "activity_monitor.expiring_contracts", label: "Expiring Contracts", chip: "Expiring Contracts" },
      { key: "activity_monitor.contract_pauses", label: "Contract Pauses", chip: "Pauses" },
      { key: "activity_monitor.member_data_change", label: "Member Data Change", chip: "Member Data" },
      { key: "activity_monitor.bank_data_change", label: "Bank Data Change", chip: "Bank Data" },
      { key: "activity_monitor.vacation_requests", label: "Vacation Requests", chip: "Vacations" },
      { key: "activity_monitor.email_errors", label: "Email Errors", chip: "Email Errors" },
    ],
  },
  {
    group: "To-Do",
    icon: CheckSquare,
    items: [
      { key: "todo.view", label: "View To-Do", isView: true },
      { key: "todo.create", label: "Create Tasks", chip: "Create" },
      { key: "todo.assign", label: "Assign Task to Staff", chip: "Assign" },
      { key: "todo.manage_others", label: "Manage Tasks from other Staff", chip: "Manage Others" },
    ],
  },
  {
    group: "Notes",
    icon: FaNotesMedical,
    items: [
      { key: "notes.view", label: "View Notes", isView: true },
      { key: "notes.create_personal", label: "Create personal Notes", chip: "Personal" },
      { key: "notes.manage_studio", label: "Manage Studio Notes", chip: "Studio Notes" },
    ],
  },
  {
    group: "Media Library",
    icon: Image,
    items: [
      { key: "media.view", label: "View Media Library", isView: true },
      { key: "media.manage_designs", label: "Manage Designs", chip: "Manage Designs" },
    ],
  },
  {
    group: "Members",
    icon: HiOutlineUsers,
    items: [
      { key: "members.view", label: "View Members", isView: true },
      { key: "members.create_temporary", label: "Create Temporary Members", chip: "Create Temp." },
      { key: "members.edit", label: "Edit Members", chip: "Edit" },
      { key: "members.archive", label: "Archive Members", chip: "Archive" },
      { key: "members.manage_history", label: "Manage History", chip: "History" },
      { key: "members.manage_documents", label: "Manage Documents", chip: "Documents" },
    ],
  },
  {
    group: "Check-In",
    icon: IoIosCheckmarkCircleOutline,
    items: [
      { key: "checkin.view", label: "View Check-In", isView: true },
      { key: "checkin.checkin_members", label: "Can Check-in Members", chip: "Check-in" },
      { key: "checkin.no_show", label: "Can mark No-Show", chip: "No-Show" },
    ],
  },
  {
    group: "Contracts",
    icon: RiContractLine,
    items: [
      { key: "contracts.view", label: "View Contracts", isView: true },
      { key: "contracts.create", label: "Create Contracts", chip: "Create" },
      { key: "contracts.pause", label: "Pause Contracts", chip: "Pause" },
      { key: "contracts.add_bonustime", label: "Add Bonustime", chip: "Bonustime" },
      { key: "contracts.renew", label: "Renew Contracts", chip: "Renew" },
      { key: "contracts.cancel", label: "Cancel Contracts", chip: "Cancel" },
      { key: "contracts.change", label: "Change Contracts", chip: "Change" },
      { key: "contracts.view_management", label: "View Contract Management", chip: "Management" },
      { key: "contracts.view_history", label: "View Contract History", chip: "History" },
    ],
  },
  {
    group: "Leads",
    icon: FaPersonRays,
    items: [
      { key: "leads.view", label: "View Leads", isView: true },
      { key: "leads.create", label: "Create Leads", chip: "Create" },
      { key: "leads.edit", label: "Edit Leads", chip: "Edit" },
      { key: "leads.delete", label: "Delete Leads", chip: "Delete" },
      { key: "leads.book_trial", label: "Book Trial Training", chip: "Book Trial" },
      { key: "leads.convert", label: "Convert Lead to Member", chip: "Convert" },
    ],
  },
  {
    group: "Staff",
    icon: BsPersonWorkspace,
    items: [
      { key: "staff.view", label: "View Staff", isView: true },
      { key: "staff.create", label: "Create Staff", chip: "Create" },
      { key: "staff.edit", label: "Edit Staff", chip: "Edit" },
      { key: "staff.delete", label: "Delete Staff", chip: "Delete" },
      { key: "staff.book_vacation", label: "Book Vacation", chip: "Vacation" },
      { key: "staff.manage_vacation_others", label: "Manage Vacation of Others", chip: "Others' Vacation" },
      { key: "staff.shift_management", label: "Shift Management", chip: "Shifts" },
    ],
  },
  {
    group: "Selling",
    icon: ShoppingCart,
    items: [
      { key: "selling.view", label: "View Selling", isView: true },
      { key: "selling.create_product", label: "Create New Product", chip: "New Product" },
      { key: "selling.create_service", label: "Create New Service", chip: "New Service" },
      { key: "selling.sell", label: "Sell Something", chip: "Sell" },
      { key: "selling.view_journal", label: "See Sales Journal", chip: "Journal" },
    ],
  },
  {
    group: "Finances",
    icon: BadgeDollarSign,
    items: [
      { key: "finances.view", label: "View Finances", isView: true },
      { key: "finances.run_payments", label: "Run Payments", chip: "Run Payments" },
      { key: "finances.check_funds", label: "Check Funds", chip: "Check Funds" },
      { key: "finances.view_payment_history", label: "View Payment Run History", chip: "Payment History" },
    ],
  },
  {
    group: "Training",
    icon: CgGym,
    items: [
      { key: "training.view", label: "View Training", isView: true },
      { key: "training.create", label: "Create Training Plans", chip: "Create" },
      { key: "training.edit", label: "Edit Training Plans", chip: "Edit" },
      { key: "training.assign", label: "Assign Training Plans", chip: "Assign" },
    ],
  },
  {
    group: "Medical History",
    icon: BsFillClipboard2HeartFill,
    items: [
      { key: "assessment.view", label: "View Medical History", isView: true },
      { key: "assessment.create", label: "Create Form", chip: "Create" },
      { key: "assessment.edit", label: "Edit Form", chip: "Edit" },
      { key: "assessment.delete", label: "Delete Form", chip: "Delete" },
    ],
  },
  {
    group: "Analytics",
    icon: TbBrandGoogleAnalytics,
    items: [
      { key: "analytics.view", label: "View Analytics", isView: true },
      { key: "analytics.appointments", label: "Appointment Analytics", chip: "Appointments" },
      { key: "analytics.members", label: "Members Analytics", chip: "Members" },
      { key: "analytics.leads", label: "Leads Analytics", chip: "Leads" },
      { key: "analytics.finances", label: "Finances Analytics", chip: "Finances" },
    ],
  },
  {
    group: "Configuration",
    icon: Settings,
    items: [
      { key: "configuration.view", label: "View Configuration", isView: true },
      { key: "configuration.studio", label: "Studio Settings", chip: "Studio" },
      { key: "configuration.appointments", label: "Appointment Settings", chip: "Appointments" },
      { key: "configuration.staff", label: "Staff & Roles Settings", chip: "Staff & Roles" },
      { key: "configuration.members", label: "Members & Leads Settings", chip: "Members & Leads" },
      { key: "configuration.contracts", label: "Contract Settings", chip: "Contracts" },
      { key: "configuration.communication", label: "Communication Settings", chip: "Communication" },
      { key: "configuration.finances", label: "Finance Settings", chip: "Finances" },
      { key: "configuration.appearance", label: "Appearance Settings", chip: "Appearance" },
      { key: "configuration.import", label: "Data Import", chip: "Import" },
    ],
  },
]

export const PERMISSION_DATA = PERMISSION_GROUPS.flatMap(g => g.items)

// ============================================
// PermissionModal Component
// ============================================
export const PermissionModal = ({ 
  visible, 
  onClose, 
  role, 
  onPermissionChange, 
  isAdminRole = false 
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (visible && role) {
      setSelectedPermissions(
        isAdminRole ? PERMISSION_DATA.map(p => p.key) : (role.permissions || [])
      )
    }
  }, [visible, role, isAdminRole])

  const getViewKey = (group) => group.items.find(item => item.isView)?.key || null

  const isGroupVisible = (group) => {
    if (isAdminRole) return true
    const viewKey = getViewKey(group)
    return viewKey ? selectedPermissions.includes(viewKey) : true
  }

  const handleVisibilityToggle = (group) => {
    if (isAdminRole) return
    const viewKey = getViewKey(group)
    if (!viewKey) return

    if (selectedPermissions.includes(viewKey)) {
      const groupKeys = group.items.map(item => item.key)
      setSelectedPermissions(prev => prev.filter(p => !groupKeys.includes(p)))
    } else {
      setSelectedPermissions(prev => [...prev, viewKey])
    }
  }

  const handleChipToggle = (permissionKey) => {
    if (isAdminRole) return
    setSelectedPermissions(prev =>
      prev.includes(permissionKey)
        ? prev.filter(p => p !== permissionKey)
        : [...prev, permissionKey]
    )
  }

  const handleSave = () => {
    onPermissionChange(isAdminRole ? PERMISSION_DATA.map(p => p.key) : selectedPermissions)
    onClose()
  }

  const handleClearAll = () => { if (!isAdminRole) setSelectedPermissions([]) }
  const handleSelectAll = () => { if (!isAdminRole) setSelectedPermissions(PERMISSION_DATA.map(p => p.key)) }

  const filteredGroups = searchQuery
    ? PERMISSION_GROUPS.filter(group =>
        group.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.items.some(item =>
          (item.chip || item.label).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : PERMISSION_GROUPS

  if (!visible) return null

  const nonViewPermissions = PERMISSION_DATA.filter(p => !p.isView)
  const selectedNonView = selectedPermissions.filter(
    p => !PERMISSION_DATA.find(d => d.key === p && d.isView)
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative bg-[#1C1C1C] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
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
                Admin role — all permissions granted and cannot be modified.
              </p>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="p-5 border-b border-[#333333]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[180px]">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#2F2F2F] border border-[#444444] rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-colors"
              />
            </div>
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
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-sm font-medium bg-[#333333] text-white">
                {selectedNonView.length}
              </span>
              <span className="text-sm text-gray-400">of {nonViewPermissions.length}</span>
            </div>
          </div>
        </div>

        {/* Permission Rows */}
        <div className="flex-1 overflow-y-auto p-5 space-y-1.5">
          {filteredGroups.map((group) => {
            const IconComponent = group.icon || Settings
            const groupVisible = isGroupVisible(group)
            const nonViewItems = group.items.filter(item => !item.isView)

            return (
              <div
                key={group.group}
                className={`rounded-xl border p-3 transition-all ${
                  groupVisible
                    ? "border-[#333333] bg-[#1F1F1F]"
                    : "border-[#2A2A2A] bg-[#191919] opacity-50"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {/* Visibility toggle */}
                  <button
                    onClick={() => handleVisibilityToggle(group)}
                    disabled={isAdminRole}
                    title={groupVisible ? "Hide menu" : "Show menu"}
                    className={`flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 transition-all mt-0.5 ${
                      isAdminRole
                        ? "text-gray-500 cursor-not-allowed"
                        : groupVisible
                          ? "text-orange-400 bg-orange-500/15 hover:bg-orange-500/25"
                          : "text-gray-600 bg-[#2A2A2A] hover:bg-[#333333] hover:text-gray-400"
                    }`}
                  >
                    {groupVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Icon + Label */}
                  <div className="flex items-center gap-2.5 min-w-[140px] flex-shrink-0 mt-1">
                    <IconComponent
                      className={`w-[18px] h-[18px] flex-shrink-0 ${
                        groupVisible ? "text-gray-300" : "text-gray-600"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium whitespace-nowrap ${
                        groupVisible ? "text-white" : "text-gray-600"
                      }`}
                    >
                      {group.group}
                    </span>
                  </div>

                  {/* Chips */}
                  {groupVisible && nonViewItems.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 flex-1">
                      {nonViewItems.map((perm) => {
                        const isSelected = isAdminRole
                          ? true
                          : selectedPermissions.includes(perm.key)
                        return (
                          <button
                            key={perm.key}
                            onClick={() => handleChipToggle(perm.key)}
                            disabled={isAdminRole}
                            title={perm.label}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                              isAdminRole
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                            } ${
                              isSelected
                                ? "bg-orange-500/15 border-orange-500/40 text-orange-300 hover:bg-orange-500/25"
                                : "bg-[#181818] border-[#333333] text-gray-500 hover:border-[#444444] hover:text-gray-300"
                            }`}
                          >
                            {perm.chip || perm.label}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* No chips state */}
                  {groupVisible && nonViewItems.length === 0 && (
                    <span className="text-xs text-gray-600 mt-1.5">View only</span>
                  )}
                </div>
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
