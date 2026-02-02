/* eslint-disable react/prop-types */
import { X, UserCog, Activity, LogIn, Calendar, ArrowRight, Clock, Monitor, Smartphone, Globe, CheckCircle, XCircle } from "lucide-react"
import { useState } from "react"

// Initials Avatar Component
const InitialsAvatar = ({ firstName, lastName, size = "md" }) => {
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || ""
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || ""
    return `${firstInitial}${lastInitial}` || "?"
  }

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  }

  return (
    <div className={`bg-blue-600 rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0 ${sizeClasses[size]}`}>
      {getInitials()}
    </div>
  )
}

// Tab Button Component
const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
      active
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
        : "text-gray-400 hover:text-white hover:bg-[#2F2F2F]"
    }`}
  >
    <Icon size={16} />
    <span>{label}</span>
    {count !== undefined && (
      <span className={`px-1.5 py-0.5 rounded-md text-xs ${active ? "bg-blue-500" : "bg-[#2F2F2F]"}`}>
        {count}
      </span>
    )}
  </button>
)

// Change Card Component
const ChangeCard = ({ change }) => (
  <div className="bg-[#1C1C1C] rounded-xl p-4 border border-[#2F2F2F] hover:border-[#3F3F3F] transition-colors">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500" />
        <h4 className="font-medium text-white">{change.field}</h4>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Clock size={12} />
        <span>{change.date} • {change.time}</span>
      </div>
    </div>
    
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-sm mb-3">
      <div className="flex items-center gap-2 bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg w-full sm:w-auto">
        <XCircle size={14} className="flex-shrink-0" />
        <span className="truncate">{change.oldValue}</span>
      </div>
      <ArrowRight size={16} className="text-gray-600 hidden sm:block flex-shrink-0" />
      <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-lg w-full sm:w-auto">
        <CheckCircle size={14} className="flex-shrink-0" />
        <span className="truncate">{change.newValue}</span>
      </div>
    </div>
    
    <p className="text-xs text-gray-500">
      Changed by <span className="text-gray-300">{change.changedBy}</span>
    </p>
  </div>
)

// Action Card Component
const ActionCard = ({ action }) => {
  const getActionColor = (actionType) => {
    const colors = {
      "Moved Appointment": "bg-purple-500/10 text-purple-400 border-purple-500/20",
      "Changed Member Data": "bg-blue-500/10 text-blue-400 border-blue-500/20",
      "Created To-Do List": "bg-green-500/10 text-green-400 border-green-500/20",
      "Deleted To-Do List": "bg-red-500/10 text-red-400 border-red-500/20",
      "Assigned Task": "bg-orange-500/10 text-orange-400 border-orange-500/20",
    }
    return colors[actionType] || "bg-gray-500/10 text-gray-400 border-gray-500/20"
  }

  return (
    <div className="bg-[#1C1C1C] rounded-xl p-4 border border-[#2F2F2F] hover:border-[#3F3F3F] transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border ${getActionColor(action.action)}`}>
          {action.action}
        </span>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock size={12} />
          <span>{action.date} • {action.time}</span>
        </div>
      </div>
      
      <p className="text-sm text-gray-300 mb-2">{action.details}</p>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
        <span className="text-gray-500">
          Target: <span className="text-gray-400">{action.target}</span>
        </span>
        <span className="text-gray-500">
          By: <span className="text-gray-400">{action.performedBy}</span>
        </span>
      </div>
    </div>
  )
}

// Login Activity Card Component
const LoginCard = ({ activity }) => {
  const getDeviceIcon = (device) => {
    if (device.toLowerCase().includes("iphone") || device.toLowerCase().includes("android")) {
      return <Smartphone size={14} />
    }
    if (device.toLowerCase().includes("chrome") || device.toLowerCase().includes("safari") || device.toLowerCase().includes("firefox")) {
      return <Monitor size={14} />
    }
    return <Globe size={14} />
  }

  return (
    <div className="bg-[#1C1C1C] rounded-xl p-4 border border-[#2F2F2F] hover:border-[#3F3F3F] transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            activity.action === "Login" 
              ? "bg-green-500/10 text-green-400" 
              : "bg-red-500/10 text-red-400"
          }`}>
            <LogIn size={18} className={activity.action === "Logout" ? "rotate-180" : ""} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-medium ${activity.action === "Login" ? "text-green-400" : "text-red-400"}`}>
                {activity.action}
              </span>
              <span className={`w-2 h-2 rounded-full ${activity.action === "Login" ? "bg-green-500" : "bg-red-500"}`} />
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{activity.date} • {activity.time}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-[#2F2F2F] flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs">
        <div className="flex items-center gap-2 text-gray-400">
          <Globe size={12} className="text-gray-500" />
          <span>{activity.ipAddress}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          {getDeviceIcon(activity.device)}
          <span>{activity.device}</span>
        </div>
      </div>
    </div>
  )
}

// Vacation Card Component
const VacationCard = ({ vacation }) => (
  <div className="bg-[#1C1C1C] rounded-xl p-4 border border-[#2F2F2F] hover:border-[#3F3F3F] transition-colors">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
          <Calendar size={18} className="text-purple-400" />
        </div>
        <div>
          <p className="font-medium text-white">
            {new Date(vacation.startDate).toLocaleDateString("de-DE", { day: "2-digit", month: "short" })} - {new Date(vacation.endDate).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {vacation.days} days • Requested {new Date(vacation.requestDate).toLocaleDateString("de-DE")}
          </p>
        </div>
      </div>
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${
        vacation.status === "Approved" 
          ? "bg-green-500/10 text-green-400 border border-green-500/20" 
          : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
      }`}>
        {vacation.status === "Approved" && <CheckCircle size={12} />}
        {vacation.status}
      </span>
    </div>
    
    <p className="text-xs text-gray-500">
      Approved by <span className="text-gray-400">{vacation.approvedBy}</span>
    </p>
  </div>
)

// Empty State Component
const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 rounded-2xl bg-[#2F2F2F] flex items-center justify-center mb-4">
      <Icon size={24} className="text-gray-500" />
    </div>
    <h4 className="text-white font-medium mb-1">{title}</h4>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
)

function StaffHistoryModal({ staff, onClose }) {
  const [activeTab, setActiveTab] = useState("profile")

  const profileChanges = [
    {
      id: 1,
      date: "2024-01-15",
      time: "14:30",
      field: "Role",
      oldValue: "Employee",
      newValue: "Senior Employee",
      changedBy: "Admin",
    },
    {
      id: 2,
      date: "2024-01-10",
      time: "09:15",
      field: "Vacation Entitlement",
      oldValue: "25 days",
      newValue: "30 days",
      changedBy: "HR Manager",
    },
    {
      id: 3,
      date: "2024-01-05",
      time: "16:45",
      field: "Phone",
      oldValue: "+1234567890",
      newValue: "+1234567891",
      changedBy: "Self",
    },
  ]

  const actions = [
    {
      id: 1,
      date: "2024-01-18",
      time: "10:30",
      action: "Moved Appointment",
      details: "Moved meeting with client from 14:00 to 15:30",
      target: "Meeting with ABC Corp",
      performedBy: "System",
    },
    {
      id: 2,
      date: "2024-01-17",
      time: "16:20",
      action: "Changed Member Data",
      details: "Updated contact information",
      target: "Member: John Smith",
      performedBy: "Self",
    },
    {
      id: 3,
      date: "2024-01-16",
      time: "11:15",
      action: "Created To-Do List",
      details: "Created new project task list",
      target: "Project Alpha Tasks",
      performedBy: "Self",
    },
    {
      id: 4,
      date: "2024-01-15",
      time: "09:45",
      action: "Deleted To-Do List",
      details: "Removed completed task list",
      target: "Old Project Tasks",
      performedBy: "Self",
    },
    {
      id: 5,
      date: "2024-01-14",
      time: "13:20",
      action: "Assigned Task",
      details: "Assigned new client follow-up",
      target: "Task: Client Follow-up",
      performedBy: "Manager",
    },
  ]

  const loginActivity = [
    {
      id: 1,
      date: "2024-01-20",
      time: "08:30",
      action: "Login",
      ipAddress: "192.168.1.100",
      device: "Chrome on Windows",
    },
    {
      id: 2,
      date: "2024-01-19",
      time: "17:45",
      action: "Logout",
      ipAddress: "192.168.1.100",
      device: "Chrome on Windows",
    },
    {
      id: 3,
      date: "2024-01-19",
      time: "08:15",
      action: "Login",
      ipAddress: "192.168.1.100",
      device: "Chrome on Windows",
    },
    {
      id: 4,
      date: "2024-01-18",
      time: "18:00",
      action: "Logout",
      ipAddress: "192.168.1.105",
      device: "Safari on iPhone",
    },
  ]

  const vacationHistory = [
    {
      id: 1,
      startDate: "2023-12-20",
      endDate: "2023-12-29",
      days: 8,
      status: "Approved",
      requestDate: "2023-11-15",
      approvedBy: "Manager",
    },
    {
      id: 2,
      startDate: "2023-08-15",
      endDate: "2023-08-25",
      days: 9,
      status: "Approved",
      requestDate: "2023-07-10",
      approvedBy: "Manager",
    },
    {
      id: 3,
      startDate: "2023-05-01",
      endDate: "2023-05-05",
      days: 5,
      status: "Approved",
      requestDate: "2023-04-01",
      approvedBy: "HR Manager",
    },
  ]

  const tabs = [
    { id: "profile", label: "Profile Changes", icon: UserCog, count: profileChanges.length },
    { id: "actions", label: "Actions", icon: Activity, count: actions.length },
    { id: "login", label: "Login Activity", icon: LogIn, count: loginActivity.length },
    { id: "vacation", label: "Vacation", icon: Calendar, count: vacationHistory.length },
  ]

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center">
      <div className="bg-[#181818] w-full h-[95vh] md:h-auto md:rounded-2xl md:max-w-4xl md:mx-4 md:max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 p-4 md:p-6 border-b border-[#2F2F2F]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <InitialsAvatar firstName={staff?.firstName} lastName={staff?.lastName} size="md" />
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white">
                  {staff?.firstName} {staff?.lastName}
                </h2>
                <p className="text-sm text-gray-400">Activity History</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-[#2F2F2F] rounded-xl text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs - Horizontally scrollable on mobile */}
        <div className="flex-shrink-0 border-b border-[#2F2F2F]">
          <div className="flex gap-2 p-3 md:p-4 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                icon={tab.icon}
                label={tab.label}
                count={tab.count}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeTab === "profile" && (
            <div className="space-y-3">
              {profileChanges.length > 0 ? (
                profileChanges.map((change) => (
                  <ChangeCard key={change.id} change={change} />
                ))
              ) : (
                <EmptyState 
                  icon={UserCog} 
                  title="No Profile Changes" 
                  description="No profile changes have been recorded yet."
                />
              )}
            </div>
          )}

          {activeTab === "actions" && (
            <div className="space-y-3">
              {actions.length > 0 ? (
                actions.map((action) => (
                  <ActionCard key={action.id} action={action} />
                ))
              ) : (
                <EmptyState 
                  icon={Activity} 
                  title="No Actions" 
                  description="No actions have been recorded yet."
                />
              )}
            </div>
          )}

          {activeTab === "login" && (
            <div className="space-y-3">
              {loginActivity.length > 0 ? (
                loginActivity.map((activity) => (
                  <LoginCard key={activity.id} activity={activity} />
                ))
              ) : (
                <EmptyState 
                  icon={LogIn} 
                  title="No Login Activity" 
                  description="No login activity has been recorded yet."
                />
              )}
            </div>
          )}

          {activeTab === "vacation" && (
            <div className="space-y-3">
              {vacationHistory.length > 0 ? (
                vacationHistory.map((vacation) => (
                  <VacationCard key={vacation.id} vacation={vacation} />
                ))
              ) : (
                <EmptyState 
                  icon={Calendar} 
                  title="No Vacation History" 
                  description="No vacation bookings have been recorded yet."
                />
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 md:p-6 border-t border-[#2F2F2F]">
          <button
            onClick={onClose}
            className="w-full md:w-auto px-6 py-2.5 bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white rounded-xl text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Custom scrollbar hide utility */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default StaffHistoryModal
