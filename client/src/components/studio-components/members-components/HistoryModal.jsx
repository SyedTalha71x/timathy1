/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { X, UserCog, Calendar, Activity, CreditCard, FileText, ArrowRight, Clock, CheckCircle, XCircle } from "lucide-react";

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
    <div className={`bg-primary rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0 ${sizeClasses[size]}`}>
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

// Change Card Component (Profile / General Changes)
const ChangeCard = ({ change }) => (
  <div className="bg-surface-dark rounded-xl p-4">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <h4 className="font-medium text-content-primary">{change.field} Changed</h4>
      </div>
      <div className="flex items-center gap-2 text-xs text-content-faint">
        <Clock size={12} />
        <span>{change.date} • {change.time}</span>
      </div>
    </div>
    
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-sm mb-3">
      <div className="flex items-center gap-2 bg-primary/5 text-content-secondary px-3 py-1.5 rounded-lg w-full sm:w-auto">
        <XCircle size={14} className="flex-shrink-0 text-content-muted" />
        <span className="truncate">{change.oldValue}</span>
      </div>
      <ArrowRight size={16} className="text-content-faint hidden sm:block flex-shrink-0" />
      <div className="flex items-center gap-2 bg-primary/10 text-content-primary px-3 py-1.5 rounded-lg w-full sm:w-auto">
        <CheckCircle size={14} className="flex-shrink-0 text-primary" />
        <span className="truncate">{change.newValue}</span>
      </div>
    </div>
    
    <p className="text-xs text-content-faint">
      Changed by <span className="text-content-secondary">{change.changedBy}</span>
    </p>
  </div>
)

// Appointment Card Component
const AppointmentCard = ({ activity }) => (
  <div className="bg-surface-dark rounded-xl p-4">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
          <Calendar size={18} />
        </div>
        <div>
          <h4 className="font-medium text-content-primary">{activity.action}</h4>
          <p className="text-xs text-content-faint mt-0.5">{activity.date} • {activity.time}</p>
        </div>
      </div>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border bg-primary/10 text-primary border-primary/20">
        {activity.status}
      </span>
    </div>
    
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-content-faint">
      <span>Type: <span className="text-content-muted">{activity.appointmentType}</span></span>
      <span>Date: <span className="text-content-muted">{activity.appointmentDate} at {activity.appointmentTime}</span></span>
      <span>By: <span className="text-content-muted">{activity.bookedBy}</span></span>
    </div>
  </div>
)

// Check-in Card Component
const CheckinCard = ({ activity }) => (
  <div className="bg-surface-dark rounded-xl p-4">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
          <Activity size={18} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-content-primary">{activity.type}</span>
            <span className="w-2 h-2 rounded-full bg-primary" />
          </div>
          <p className="text-xs text-content-faint mt-0.5">
            {new Date(activity.date).toLocaleDateString()} • {new Date(activity.date).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
    
    <div className="mt-3 pt-3 border-t border-border text-xs text-content-faint">
      Location: <span className="text-content-muted">{activity.location}</span>
    </div>
  </div>
)

// Finance Card Component
const FinanceCard = ({ transaction }) => (
  <div className="bg-surface-dark rounded-xl p-4">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <CreditCard size={18} className="text-primary" />
        </div>
        <div>
          <h4 className="font-medium text-content-primary">{transaction.type} — {transaction.amount}</h4>
          <p className="text-xs text-content-faint mt-0.5">{transaction.date}</p>
        </div>
      </div>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border bg-primary/10 text-primary border-primary/20">
        {transaction.status === "completed" && <CheckCircle size={12} />}
        {transaction.status}
      </span>
    </div>
    
    <p className="text-sm text-content-secondary">{transaction.description}</p>
  </div>
)

// Contract Card Component
const ContractCard = ({ contract }) => (
  <div className="bg-surface-dark rounded-xl p-4">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <FileText size={18} className="text-primary" />
        </div>
        <div>
          <h4 className="font-medium text-content-primary">{contract.action}</h4>
          <p className="text-xs text-content-faint mt-0.5">{contract.date}</p>
        </div>
      </div>
    </div>
    
    <p className="text-sm text-content-secondary mb-2">{contract.details}</p>
    
    <p className="text-xs text-content-faint">
      By <span className="text-content-secondary">{contract.user}</span>
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

export default function HistoryModalMain({
  show,
  member,
  memberHistoryMain,
  historyTabMain,
  setHistoryTabMain,
  onClose
}) {
  const [activeTab, setActiveTab] = useState(historyTabMain || "general");

  if (!show || !member) return null;

  // Temporary members: no Finance & Contracts tabs
  const isTemporary = member.memberType === "temporary";

  // History data (from states, with safe fallbacks)
  const generalChanges = memberHistoryMain?.[member.id]?.general || [];
  const appointmentHistory = memberHistoryMain?.[member.id]?.appointments || [];
  const checkinHistory = memberHistoryMain?.[member.id]?.checkins || [];
  const financeHistory = memberHistoryMain?.[member.id]?.finance || [];
  const contractHistory = memberHistoryMain?.[member.id]?.contracts || [];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (setHistoryTabMain) {
      setHistoryTabMain(tab);
    }
  };

  // Build tabs: everyone gets General, Appointments, Check-ins
  // Only non-temporary get Finance & Contracts
  const tabs = [
    { id: "general", label: "General", icon: UserCog, count: generalChanges.length },
    { id: "appointments", label: "Appointments", icon: Calendar, count: appointmentHistory.length },
    { id: "checkins", label: "Check-ins", icon: Activity, count: checkinHistory.length },
    ...(!isTemporary ? [
      { id: "finance", label: "Finance", icon: CreditCard, count: financeHistory.length },
      { id: "contracts", label: "Contracts", icon: FileText, count: contractHistory.length },
    ] : []),
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex p-2 justify-center items-center z-[1000] overflow-y-auto">
      <div className="bg-surface-card p-4 md:p-6 rounded-xl w-full max-w-4xl my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              {member.image || member.img ? (
                <img
                  src={member.image || member.img}
                  alt={`${member.firstName} ${member.lastName}`}
                  className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                />
              ) : (
                <InitialsAvatar firstName={member.firstName} lastName={member.lastName} size="md" />
              )}
              <div>
                <h2 className="text-xl text-content-primary font-bold">
                  {member.firstName} {member.lastName}
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
        <div className="flex border-b border-border mb-4 overflow-x-auto scrollbar-hide flex-shrink-0">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => handleTabChange(tab.id)}
              icon={tab.icon}
              label={tab.label}
              count={tab.count}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
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
                  description="No profile changes have been recorded yet."
                />
              )}
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="space-y-3">
              {appointmentHistory.length > 0 ? (
                appointmentHistory.map((activity) => (
                  <AppointmentCard key={activity.id} activity={activity} />
                ))
              ) : (
                <EmptyState 
                  icon={Calendar} 
                  title="No Appointments" 
                  description="No appointment history has been recorded yet."
                />
              )}
            </div>
          )}

          {activeTab === "checkins" && (
            <div className="space-y-3">
              {checkinHistory.length > 0 ? (
                checkinHistory.map((activity) => (
                  <CheckinCard key={activity.id} activity={activity} />
                ))
              ) : (
                <EmptyState 
                  icon={Activity} 
                  title="No Check-ins" 
                  description="No check-in activity has been recorded yet."
                />
              )}
            </div>
          )}

          {activeTab === "finance" && !isTemporary && (
            <div className="space-y-3">
              {financeHistory.length > 0 ? (
                financeHistory.map((transaction) => (
                  <FinanceCard key={transaction.id} transaction={transaction} />
                ))
              ) : (
                <EmptyState 
                  icon={CreditCard} 
                  title="No Transactions" 
                  description="No finance transactions have been recorded yet."
                />
              )}
            </div>
          )}

          {activeTab === "contracts" && !isTemporary && (
            <div className="space-y-3">
              {contractHistory.length > 0 ? (
                contractHistory.map((contract) => (
                  <ContractCard key={contract.id} contract={contract} />
                ))
              ) : (
                <EmptyState 
                  icon={FileText} 
                  title="No Contract Changes" 
                  description="No contract changes have been recorded yet."
                />
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-surface-button text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Scrollbar hide utility */}
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
  );
}
