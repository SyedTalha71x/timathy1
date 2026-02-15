/* eslint-disable react/prop-types */
import { X, UserCog, Activity, ArrowRight, Clock, CheckCircle, XCircle } from "lucide-react"
import { useState } from "react"


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

// Trial Training Card Component
const TrialCard = ({ activity }) => (
  <div className="bg-surface-dark rounded-xl p-4">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/10">
          <Activity size={18} className="text-secondary" />
        </div>
        <div>
          <p className="font-medium text-content-primary">{activity.action}</p>
          <div className="flex items-center gap-2 text-xs text-content-faint mt-0.5">
            <Clock size={12} />
            <span>{activity.date} • {activity.time}</span>
          </div>
        </div>
      </div>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
        {activity.status}
      </span>
    </div>
    
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
      <span className="text-content-faint">
        Type: <span className="text-content-muted">{activity.trialType}</span>
        {" • "}
        Trial Date: <span className="text-content-muted">{activity.trialDate} at {activity.trialTime}</span>
      </span>
      <span className="text-content-faint">
        By: <span className="text-content-muted">{activity.bookedBy}</span>
      </span>
    </div>
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

function LeadHistoryModal({ lead, onClose }) {
  const [activeTab, setActiveTab] = useState("general")

  if (!lead) {
    return null
  }

  // Dummy history data for leads
  const generalChanges = [
    {
      id: 1,
      date: "2024-01-15",
      time: "14:30",
      field: "Status",
      oldValue: "Active prospect",
      newValue: "Passive prospect",
      changedBy: "Admin",
    },
    {
      id: 2,
      date: "2024-01-10",
      time: "09:15",
      field: "Phone Number",
      oldValue: "+1234567890",
      newValue: "+1234567891",
      changedBy: "Self",
    },
    {
      id: 3,
      date: "2024-01-05",
      time: "16:45",
      field: "Email",
      oldValue: "old@email.com",
      newValue: "new@email.com",
      changedBy: "Admin",
    },
  ]

  const trialTrainingHistory = [
    {
      id: 1,
      date: "2024-01-20",
      time: "10:00",
      action: "Trial Training Booked",
      trialType: "Cardio",
      trialDate: "2024-01-25",
      trialTime: "14:00",
      status: "Scheduled",
      bookedBy: "Admin",
    },
    {
      id: 2,
      date: "2024-01-18",
      time: "15:30",
      action: "Trial Training Completed",
      trialType: "Strength",
      trialDate: "2024-01-18",
      trialTime: "15:00",
      status: "Completed",
      bookedBy: "Admin",
    },
    {
      id: 3,
      date: "2024-01-15",
      time: "11:00",
      action: "Trial Training Cancelled",
      trialType: "Flexibility",
      trialDate: "2024-01-16",
      trialTime: "09:00",
      status: "Cancelled",
      bookedBy: "Admin",
    },
  ]

  const tabs = [
    { id: "general", label: "General Changes", icon: UserCog, count: generalChanges.length },
    { id: "trial", label: "Trial Training", icon: Activity, count: trialTrainingHistory.length },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex p-2 justify-center items-center z-[1000] overflow-y-auto">
      <div className="bg-surface-card p-6 rounded-xl w-full max-w-4xl my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-xl text-content-primary font-bold">
                  {lead.firstName} {lead.surname}
                </h2>
                <p className="text-sm text-content-muted">Lead History</p>
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
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === "general" && (
            <div className="space-y-3">
              {generalChanges.length > 0 ? (
                generalChanges.map((change) => (
                  <ChangeCard key={change.id} change={change} />
                ))
              ) : (
                <EmptyState 
                  icon={UserCog} 
                  title="No General Changes" 
                  description="No changes have been recorded yet."
                />
              )}
            </div>
          )}

          {activeTab === "trial" && (
            <div className="space-y-3">
              {trialTrainingHistory.length > 0 ? (
                trialTrainingHistory.map((activity) => (
                  <TrialCard key={activity.id} activity={activity} />
                ))
              ) : (
                <EmptyState 
                  icon={Activity} 
                  title="No Trial Training History" 
                  description="No trial training activities have been recorded yet."
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

export default LeadHistoryModal
