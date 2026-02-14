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
    <div className={`bg-secondary rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0 ${sizeClasses[size]}`}>
      {getInitials()}
    </div>
  )
}

// Tab Button Component
const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
      active
        ? "text-primary border-b-2 border-primary"
        : "text-content-muted hover:text-content-primary"
    }`}
  >
    <Icon size={16} />
    <span>{label}</span>
    {count !== undefined && (
      <span className={`px-1.5 py-0.5 rounded-md text-xs ${active ? "bg-primary/20 text-primary" : "bg-surface-button text-content-muted"}`}>
        {count}
      </span>
    )}
  </button>
)

// Change Card Component
const ChangeCard = ({ change }) => (
  <div className="bg-surface-dark rounded-xl p-4">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-secondary" />
        <h4 className="font-medium text-content-primary">{change.field}</h4>
      </div>
      <div className="flex items-center gap-2 text-xs text-content-faint">
        <Clock size={12} />
        <span>{change.date} • {change.time}</span>
      </div>
    </div>
    
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-sm mb-3">
      <div className="flex items-center gap-2 bg-secondary/10 text-content-secondary px-3 py-1.5 rounded-lg w-full sm:w-auto">
        <XCircle size={14} className="flex-shrink-0 text-content-muted" />
        <span className="truncate">{change.oldValue}</span>
      </div>
      <ArrowRight size={16} className="text-content-faint hidden sm:block flex-shrink-0" />
      <div className="flex items-center gap-2 bg-secondary/10 text-content-primary px-3 py-1.5 rounded-lg w-full sm:w-auto">
        <CheckCircle size={14} className="flex-shrink-0 text-secondary" />
        <span className="truncate">{change.newValue}</span>
      </div>
    </div>
    
    <p className="text-xs text-content-faint">
      Changed by <span className="text-content-secondary">{change.changedBy}</span>
    </p>
  </div>
)

// Action Card Component
const ActionCard = ({ action }) => (
  <div className="bg-surface-dark rounded-xl p-4">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
        {action.action}
      </span>
      <div className="flex items-center gap-2 text-xs text-content-faint">
        <Clock size={12} />
        <span>{action.date} • {action.time}</span>
      </div>
    </div>
    
    <p className="text-sm text-content-secondary mb-2">{action.details}</p>
    
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
      <span className="text-content-faint">
        Target: <span className="text-content-muted">{action.target}</span>
      </span>
      <span className="text-content-faint">
        By: <span className="text-content-muted">{action.performedBy}</span>
      </span>
    </div>
  </div>
)

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
    <div className="bg-surface-dark rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/10 text-secondary">
            <LogIn size={18} className={activity.action === "Logout" ? "rotate-180" : ""} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-medium ${activity.action === "Login" ? "text-content-primary" : "text-content-secondary"}`}>
                {activity.action}
              </span>
              <span className={`w-2 h-2 rounded-full ${activity.action === "Login" ? "bg-secondary" : "bg-content-muted"}`} />
            </div>
            <p className="text-xs text-content-faint mt-0.5">{activity.date} • {activity.time}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs">
        <div className="flex items-center gap-2 text-content-muted">
          <Globe size={12} className="text-content-faint" />
          <span>{activity.ipAddress}</span>
        </div>
        <div className="flex items-center gap-2 text-content-muted">
          {getDeviceIcon(activity.device)}
          <span>{activity.device}</span>
        </div>
      </div>
    </div>
  )
}

// Vacation Card Component
const VacationCard = ({ vacation }) => (
  <div className="bg-surface-dark rounded-xl p-4">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
          <Calendar size={18} className="text-secondary" />
        </div>
        <div>
          <p className="font-medium text-content-primary">
            {new Date(vacation.startDate).toLocaleDateString("de-DE", { day: "2-digit", month: "short" })} - {new Date(vacation.endDate).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
          <p className="text-xs text-content-faint mt-0.5">
            {vacation.days} days • Requested {new Date(vacation.requestDate).toLocaleDateString("de-DE")}
          </p>
        </div>
      </div>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
        {vacation.status === "Approved" && <CheckCircle size={12} />}
        {vacation.status}
      </span>
    </div>
    
    <p className="text-xs text-content-faint">
      Approved by <span className="text-content-muted">{vacation.approvedBy}</span>
    </p>
  </div>
)

// Empty State Component
const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 rounded-2xl bg-surface-button flex items-center justify-center mb-4">
      <Icon size={24} className="text-content-faint" />
    </div>
    <h4 className="text-content-primary font-medium mb-1">{title}</h4>
    <p className="text-sm text-content-faint">{description}</p>
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
    <div className="fixed inset-0 bg-black/50 flex p-2 justify-center items-center z-[1000] overflow-y-auto">
      <div className="bg-surface-card p-6 rounded-xl w-full max-w-4xl my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <InitialsAvatar firstName={staff?.firstName} lastName={staff?.lastName} size="md" />
              <div>
                <h2 className="text-xl text-content-primary font-bold">
                  {staff?.firstName} {staff?.lastName}
                </h2>
                <p className="text-sm text-content-muted">Activity History</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-content-muted hover:text-content-primary transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-4 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                icon={tab.icon}
                label={tab.label}
                count={tab.count}
              />
            ))}</div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
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
        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-surface-button text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors"
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
