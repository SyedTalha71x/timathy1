/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import {
  X, UserCog, Calendar, Activity, CreditCard, FileText,
  ArrowRight, Clock, CheckCircle, XCircle, Mail, Bell,
  ChevronDown, ChevronUp, Send, LogIn, Monitor, Smartphone, Globe
} from "lucide-react"


// ─── Shared UI Components ────────────────────────────────────────────────────

const InitialsAvatar = ({ firstName, lastName, size = "md", accent = "primary" }) => {
  const initials = `${firstName?.charAt(0)?.toUpperCase() || ""}${lastName?.charAt(0)?.toUpperCase() || ""}` || "?"
  const sizeClasses = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" }
  const accentClasses = { primary: "bg-primary", secondary: "bg-secondary" }

  return (
    <div className={`${accentClasses[accent] || "bg-primary"} rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0 ${sizeClasses[size]}`}>
      {initials}
    </div>
  )
}

const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
  <button
    onClick={onClick}
    data-active={active}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
      active ? "text-primary border-b-2 border-primary" : "text-content-muted hover:text-content-primary"
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

const FilterPill = ({ active, onClick, label, count }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
      active ? "bg-primary text-white" : "bg-surface-button text-content-muted hover:text-content-primary"
    }`}
  >
    {label}{count !== undefined ? ` (${count})` : ""}
  </button>
)

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 rounded-2xl bg-surface-button flex items-center justify-center mb-4">
      <Icon size={24} className="text-content-faint" />
    </div>
    <h4 className="text-content-primary font-medium mb-1">{title}</h4>
    <p className="text-sm text-content-faint">{description}</p>
  </div>
)


// ─── Card Components ─────────────────────────────────────────────────────────

// Used by: member (general), staff (profile), lead (general)
const ChangeCard = ({ change }) => {
  const { t } = useTranslation()
  return (
  <div className="bg-surface-dark rounded-xl p-4">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <h4 className="font-medium text-content-primary">{change.field}{change.field && !change.field.includes("Changed") ? ` ${t("shared.history.labels.changed")}` : ""}</h4>
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
      {t("shared.history.labels.changedBy", { name: change.changedBy })}
    </p>
  </div>
  )
}

// Used by: member (appointments)
const AppointmentCard = ({ item }) => {
  const { t } = useTranslation()
  return (
  <div className="bg-surface-dark rounded-xl p-4">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
          <Calendar size={18} />
        </div>
        <div>
          <h4 className="font-medium text-content-primary">{item.action}</h4>
          <p className="text-xs text-content-faint mt-0.5">{item.date} • {item.time}</p>
        </div>
      </div>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border bg-primary/10 text-primary border-primary/20">
        {item.status}
      </span>
    </div>
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-content-faint">
      <span>{t("shared.history.labels.type")}: <span className="text-content-muted">{item.appointmentType}</span></span>
      <span>{t("shared.history.labels.date")}: <span className="text-content-muted">{item.appointmentDate} {t("shared.history.labels.at")} {item.appointmentTime}</span></span>
      <span>{t("shared.history.labels.by")}: <span className="text-content-muted">{item.bookedBy}</span></span>
    </div>
  </div>
  )
}

// Used by: member (check-ins)
const CheckinCard = ({ item }) => {
  const { t } = useTranslation()
  return (
  <div className="bg-surface-dark rounded-xl p-4">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
          <Activity size={18} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-content-primary">{item.type}</span>
            <span className="w-2 h-2 rounded-full bg-primary" />
          </div>
          <p className="text-xs text-content-faint mt-0.5">
            {new Date(item.date).toLocaleDateString()} • {new Date(item.date).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
    <div className="mt-3 pt-3 border-t border-border text-xs text-content-faint">
      {t("shared.history.labels.location")}: <span className="text-content-muted">{item.location}</span>
    </div>
  </div>
  )
}

// Used by: member (finance)
const FinanceCard = ({ item }) => (
  <div className="bg-surface-dark rounded-xl p-4">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <CreditCard size={18} className="text-primary" />
        </div>
        <div>
          <h4 className="font-medium text-content-primary">{item.type} — {item.amount}</h4>
          <p className="text-xs text-content-faint mt-0.5">{item.date}</p>
        </div>
      </div>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border bg-primary/10 text-primary border-primary/20">
        {item.status === "completed" && <CheckCircle size={12} />}
        {item.status}
      </span>
    </div>
    <p className="text-sm text-content-secondary">{item.description}</p>
  </div>
)

// Used by: member (contracts tab), contract variant
const ContractChangeCard = ({ item }) => {
  const { t } = useTranslation()
  return (
  <div className="bg-surface-dark rounded-xl p-4">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <FileText size={18} className="text-primary" />
        </div>
        <div>
          <h4 className="font-medium text-content-primary">{item.action}</h4>
          <p className="text-xs text-content-faint mt-0.5">{item.date}</p>
        </div>
      </div>
    </div>
    <p className="text-sm text-content-secondary mb-2">{item.details}</p>
    {item.oldValue && item.newValue && (
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-sm mb-3">
        <div className="flex items-center gap-2 bg-primary/5 text-content-secondary px-3 py-1.5 rounded-lg w-full sm:w-auto">
          <XCircle size={14} className="flex-shrink-0 text-content-muted" />
          <span className="truncate">{item.oldValue}</span>
        </div>
        <ArrowRight size={16} className="text-content-faint hidden sm:block flex-shrink-0" />
        <div className="flex items-center gap-2 bg-primary/10 text-content-primary px-3 py-1.5 rounded-lg w-full sm:w-auto">
          <CheckCircle size={14} className="flex-shrink-0 text-primary" />
          <span className="truncate">{item.newValue}</span>
        </div>
      </div>
    )}
    <p className="text-xs text-content-faint">
      {t("shared.history.labels.by")}: <span className="text-content-secondary">{item.user || item.performedBy}</span>
    </p>
  </div>
  )
}

// Used by: member (communication)
const CommunicationCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false)
  const { t } = useTranslation()
  const isEmail = item.channel === "email"

  return (
    <div className="bg-surface-dark rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left hover:bg-surface-hover/50 transition-colors"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isEmail ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-500"}`}>
              {isEmail ? <Mail size={18} /> : <Bell size={18} />}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-content-primary">{item.subject || item.title}</h4>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${isEmail ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-500"}`}>
                  {isEmail ? t("shared.history.labels.emails") : t("shared.history.labels.push")}
                </span>
              </div>
              <p className="text-xs text-content-faint mt-0.5">{item.date} • {item.time}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {item.status && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                item.status === "sent" || item.status === "delivered"
                  ? "bg-primary/10 text-primary border-primary/20"
                  : item.status === "failed"
                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                    : "bg-surface-button text-content-muted border-border"
              }`}>
                {(item.status === "sent" || item.status === "delivered") && <CheckCircle size={12} />}
                {item.status === "failed" && <XCircle size={12} />}
                {item.status}
              </span>
            )}
            {expanded ? <ChevronUp size={16} className="text-content-muted" /> : <ChevronDown size={16} className="text-content-muted" />}
          </div>
        </div>
        {!expanded && item.preview && (
          <p className="text-xs text-content-muted truncate pl-[52px]">{item.preview}</p>
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border">
          {isEmail && item.to && (
            <div className="flex items-center gap-2 text-xs text-content-faint pt-3 pb-2">
              <Send size={12} />
              <span>{t("shared.history.labels.to")}: <span className="text-content-muted">{item.to}</span></span>
            </div>
          )}
          <div
            className="text-sm text-content-secondary leading-relaxed pt-2 prose-sm max-w-none [&_a]:text-primary [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: item.body || item.content || `<p>${t("shared.history.labels.noContent")}</p>` }}
          />
          {item.sentBy && (
            <p className="text-xs text-content-faint mt-3 pt-3 border-t border-border">
              {t("shared.history.labels.sentBy", { name: item.sentBy })}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// Used by: staff (actions)
const ActionCard = ({ item }) => {
  const { t } = useTranslation()
  return (
  <div className="bg-surface-dark rounded-xl p-4">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20">
        {item.action}
      </span>
      <div className="flex items-center gap-2 text-xs text-content-faint">
        <Clock size={12} />
        <span>{item.date} • {item.time}</span>
      </div>
    </div>
    <p className="text-sm text-content-secondary mb-2">{item.details}</p>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
      <span className="text-content-faint">{t("shared.history.labels.target")}: <span className="text-content-muted">{item.target}</span></span>
      <span className="text-content-faint">{t("shared.history.labels.by")}: <span className="text-content-muted">{item.performedBy}</span></span>
    </div>
  </div>
  )
}

// Used by: staff (login activity)
const LoginCard = ({ item }) => {
  const getDeviceIcon = (device) => {
    const d = device?.toLowerCase() || ""
    if (d.includes("iphone") || d.includes("android")) return <Smartphone size={14} />
    if (d.includes("chrome") || d.includes("safari") || d.includes("firefox")) return <Monitor size={14} />
    return <Globe size={14} />
  }

  return (
    <div className="bg-surface-dark rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
            <LogIn size={18} className={item.action === "Logout" ? "rotate-180" : ""} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-medium ${item.action === "Login" ? "text-content-primary" : "text-content-secondary"}`}>
                {item.action}
              </span>
              <span className={`w-2 h-2 rounded-full ${item.action === "Login" ? "bg-primary" : "bg-content-muted"}`} />
            </div>
            <p className="text-xs text-content-faint mt-0.5">{item.date} • {item.time}</p>
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs">
        <div className="flex items-center gap-2 text-content-muted">
          <Globe size={12} className="text-content-faint" />
          <span>{item.ipAddress}</span>
        </div>
        <div className="flex items-center gap-2 text-content-muted">
          {getDeviceIcon(item.device)}
          <span>{item.device}</span>
        </div>
      </div>
    </div>
  )
}

// Used by: staff (vacation)
const VacationCard = ({ item }) => {
  const { t } = useTranslation()
  return (
  <div className="bg-surface-dark rounded-xl p-4">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Calendar size={18} className="text-primary" />
        </div>
        <div>
          <p className="font-medium text-content-primary">
            {new Date(item.startDate).toLocaleDateString("de-DE", { day: "2-digit", month: "short" })} - {new Date(item.endDate).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
          <p className="text-xs text-content-faint mt-0.5">
            {t("shared.history.labels.days", { count: item.days })} • {t("shared.history.labels.requested", { date: new Date(item.requestDate).toLocaleDateString("de-DE") })}
          </p>
        </div>
      </div>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20">
        {item.status === "Approved" && <CheckCircle size={12} />}
        {item.status}
      </span>
    </div>
    <p className="text-xs text-content-faint">
      {t("shared.history.labels.approvedBy", { name: item.approvedBy })}
    </p>
  </div>
  )
}

// Used by: lead (trial training)
const TrialCard = ({ item }) => {
  const { t } = useTranslation()
  return (
  <div className="bg-surface-dark rounded-xl p-4">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10">
          <Activity size={18} className="text-primary" />
        </div>
        <div>
          <p className="font-medium text-content-primary">{item.action}</p>
          <div className="flex items-center gap-2 text-xs text-content-faint mt-0.5">
            <Clock size={12} />
            <span>{item.date} • {item.time}</span>
          </div>
        </div>
      </div>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20">
        {item.status}
      </span>
    </div>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
      <span className="text-content-faint">
        {t("shared.history.labels.type")}: <span className="text-content-muted">{item.trialType}</span>
        {" • "}
        {t("shared.history.labels.trialDate")}: <span className="text-content-muted">{item.trialDate} {t("shared.history.labels.at")} {item.trialTime}</span>
      </span>
      <span className="text-content-faint">
        {t("shared.history.labels.by")}: <span className="text-content-muted">{item.bookedBy}</span>
      </span>
    </div>
  </div>
  )
}


// Used by: studio (tickets)
const TicketCard = ({ item }) => (
  <div className="bg-surface-dark rounded-xl p-4">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <FileText size={18} className="text-primary" />
        </div>
        <div>
          <h4 className="font-medium text-content-primary">{item.title}</h4>
          <p className="text-xs text-content-faint mt-0.5">{item.date}</p>
        </div>
      </div>
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${
        item.status === "resolved" || item.status === "closed"
          ? "bg-primary/10 text-primary border-primary/20"
          : item.status === "open"
            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
            : "bg-surface-button text-content-muted border-border"
      }`}>
        {(item.status === "resolved" || item.status === "closed") && <CheckCircle size={12} />}
        {item.status}
      </span>
    </div>
    <p className="text-sm text-content-secondary">{item.description}</p>
  </div>
)


// ─── Communication Tab (with filter logic) ───────────────────────────────────

const CommunicationTab = ({ data, hidePush = false }) => {
  const { t } = useTranslation()
  const [filter, setFilter] = useState("all")
  const filteredData = hidePush ? data.filter(m => m.channel !== "push") : data
  const filtered = filter === "all" ? filteredData : filteredData.filter(m => m.channel === filter)
  const emailCount = filteredData.filter(m => m.channel === "email").length
  const pushCount = filteredData.filter(m => m.channel === "push").length

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <FilterPill active={filter === "all"} onClick={() => setFilter("all")} label={t("shared.history.labels.all")} count={filteredData.length} />
        <FilterPill active={filter === "email"} onClick={() => setFilter("email")} label={t("shared.history.labels.emails")} count={emailCount} />
        {!hidePush && (
          <FilterPill active={filter === "push"} onClick={() => setFilter("push")} label={t("shared.history.labels.push")} count={pushCount} />
        )}
      </div>
      {filtered.length > 0 ? (
        filtered.map((msg) => <CommunicationCard key={msg.id} item={msg} />)
      ) : (
        <EmptyState
          icon={Mail}
          title={t("shared.history.empty.noMessages")}
          description={filter === "all" ? t("shared.history.empty.noMessagesDesc") : t("shared.history.empty.noFilterMessages", { filter })}
        />
      )}
    </div>
  )
}


// ─── Tab & Variant Configuration ─────────────────────────────────────────────

// Each tab definition: { id, label, icon, dataKey, Card, emptyTitle, emptyDesc, custom? }
const TAB_REGISTRY = (t) => ({
  // Member tabs
  general:       { label: t("shared.history.tabs.general"),        icon: UserCog,    Card: ChangeCard,         emptyTitle: t("shared.history.empty.noGeneralChanges"),   emptyDesc: t("shared.history.empty.noGeneralChangesDesc") },
  communication: { label: t("shared.history.tabs.communication"),  icon: Mail,       Card: null,               emptyTitle: t("shared.history.empty.noMessages"),          emptyDesc: t("shared.history.empty.noMessagesDesc"), custom: true },
  appointments:  { label: t("shared.history.tabs.appointments"),   icon: Calendar,   Card: AppointmentCard,    emptyTitle: t("shared.history.empty.noAppointments"),      emptyDesc: t("shared.history.empty.noAppointmentsDesc") },
  checkins:      { label: t("shared.history.tabs.checkins"),       icon: Activity,   Card: CheckinCard,        emptyTitle: t("shared.history.empty.noCheckins"),          emptyDesc: t("shared.history.empty.noCheckinsDesc") },
  finance:       { label: t("shared.history.tabs.finance"),        icon: CreditCard, Card: FinanceCard,        emptyTitle: t("shared.history.empty.noTransactions"),      emptyDesc: t("shared.history.empty.noTransactionsDesc") },
  contracts:     { label: t("shared.history.tabs.contracts"),      icon: FileText,   Card: ContractChangeCard,  emptyTitle: t("shared.history.empty.noContractChanges"),  emptyDesc: t("shared.history.empty.noContractChangesDesc") },
  // Staff tabs
  profile:       { label: t("shared.history.tabs.general"),          icon: UserCog,  Card: ChangeCard,         emptyTitle: t("shared.history.empty.noGeneralChanges"),   emptyDesc: t("shared.history.empty.noGeneralChangesDesc") },
  actions:       { label: t("shared.history.tabs.actions"),          icon: Activity,  Card: ActionCard,         emptyTitle: t("shared.history.empty.noActions"),           emptyDesc: t("shared.history.empty.noActionsDesc") },
  login:         { label: t("shared.history.tabs.loginActivity"),    icon: LogIn,     Card: LoginCard,          emptyTitle: t("shared.history.empty.noLoginActivity"),    emptyDesc: t("shared.history.empty.noLoginActivityDesc") },
  vacation:      { label: t("shared.history.tabs.vacation"),         icon: Calendar,  Card: VacationCard,       emptyTitle: t("shared.history.empty.noVacation"),         emptyDesc: t("shared.history.empty.noVacationDesc") },
  // Lead tabs
  trial:         { label: t("shared.history.tabs.trialTraining"),    icon: Activity,  Card: TrialCard,          emptyTitle: t("shared.history.empty.noTrialTraining"),    emptyDesc: t("shared.history.empty.noTrialTrainingDesc") },
  demoAccess:    { label: t("shared.history.tabs.demoAccess"),       icon: Activity,  Card: TrialCard,          emptyTitle: t("shared.history.empty.noDemoAccess"),       emptyDesc: t("shared.history.empty.noDemoAccessDesc") },
  // Studio tabs
  tickets:       { label: t("shared.history.tabs.tickets"),          icon: FileText,  Card: TicketCard,         emptyTitle: t("shared.history.empty.noTickets"),           emptyDesc: t("shared.history.empty.noTicketsDesc") },
})

const VARIANT_TABS = {
  member:   ["general", "communication", "appointments", "checkins", "finance", "contracts"],
  staff:    ["profile", "communication", "actions", "login", "vacation"],
  lead:     ["general", "demoAccess"],
  contract: ["contracts"],
  studio:   ["general", "contracts", "finance", "tickets"],
}

const VARIANT_SUBTITLES = (t) => ({
  member:   t("shared.history.subtitles.activityHistory"),
  staff:    t("shared.history.subtitles.activityHistory"),
  lead:     t("shared.history.subtitles.leadHistory"),
  contract: t("shared.history.subtitles.contractHistory"),
  studio:   t("shared.history.subtitles.studioHistory"),
})

const VARIANT_ACCENT = {
  member:   "primary",
  staff:    "secondary",
  lead:     "primary",
  contract: "primary",
  studio:   "primary",
}


// ─── Main Component ──────────────────────────────────────────────────────────

/**
 * SharedHistoryModal — unified history modal for all entity types.
 *
 * @param {string}   variant       - "member" | "staff" | "lead" | "contract"
 * @param {object}   person        - Entity data. Supports { firstName, lastName, image?, img?, memberType? }
 *                                   or { memberName } for contract variant.
 * @param {object}   history   - Object keyed by tab id (e.g. { general: [], communication: [] }).
 *                                For contract variant: { contracts: [] }.
 * @param {function} onClose       - Close handler.
 * @param {string}   [initialTab]  - Optional initial active tab id.
 * @param {function} [onTabChange] - Optional callback when tab changes (for external state sync).
 */
export default function SharedHistoryModal({
  variant = "member",
  person,
  history,
  onClose,
  initialTab,
  onTabChange,
}) {
  const { t } = useTranslation()
  const isTemporary = person?.memberType === "temporary"
  const accent = VARIANT_ACCENT[variant] || "primary"

  // Resolve person name
  const firstName = person?.firstName || person?.name || person?.memberName?.split(" ")[0] || ""
  const lastName = person?.lastName || person?.surname || (person?.firstName ? "" : "") || person?.memberName?.split(" ").slice(1).join(" ") || ""

  // Build tabs for this variant
  const variantTabIds = VARIANT_TABS[variant] || []
  const tabDefs = variantTabIds
    .filter(id => {
      // Member: hide finance & contracts for temporary members
      if (variant === "member" && isTemporary && (id === "finance" || id === "contracts")) return false
      return true
    })
    .map(id => ({
      id,
      ...TAB_REGISTRY(t)[id],
      count: (history?.[id] || []).length,
    }))

  const defaultTab = initialTab || tabDefs[0]?.id || "general"
  const [activeTab, setActiveTab] = useState(defaultTab)
  const tabsRef = useRef(null)

  // Auto-scroll tab bar to active tab
  useEffect(() => {
    if (!tabsRef.current) return
    const container = tabsRef.current
    const activeButton = container.querySelector('[data-active="true"]')
    if (activeButton) {
      const containerRect = container.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()
      const scrollLeft = activeButton.offsetLeft - containerRect.width / 2 + buttonRect.width / 2
      container.scrollTo({ left: scrollLeft, behavior: "smooth" })
    }
  }, [activeTab])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    onTabChange?.(tabId)
  }

  if (!person) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex p-2 justify-center items-center z-[1000] overflow-y-auto">
      <div className="bg-surface-card p-4 md:p-6 rounded-xl w-full max-w-6xl my-8 max-h-[90vh] flex flex-col">

        {/* ── Header ── */}
        <div className="flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              {variant !== "lead" && variant !== "contract" && (
                <>
                  {(person.image || person.img) ? (
                    <img
                      src={person.image || person.img}
                      alt={`${firstName} ${lastName}`}
                      className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <InitialsAvatar firstName={firstName} lastName={lastName} size="md" accent={accent} />
                  )}
                </>
              )}
              <div>
                <h2 className="text-xl text-content-primary font-bold">
                  {firstName} {lastName}
                </h2>
                <p className="text-sm text-content-muted">{VARIANT_SUBTITLES(t)[variant]}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-content-muted hover:text-content-primary transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* ── Tabs (hidden if only one tab) ── */}
        {tabDefs.length > 1 && (
          <div ref={tabsRef} className="flex border-b border-border mb-4 overflow-x-auto scrollbar-hide flex-shrink-0">
            {tabDefs.map((tab) => (
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
        )}

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
          {tabDefs.map((tab) => {
            if (activeTab !== tab.id) return null
            const data = history?.[tab.id] || []

            // Communication tab has custom rendering (filters)
            if (tab.custom && tab.id === "communication") {
              return <CommunicationTab key={tab.id} data={data} hidePush={variant === "lead"} />
            }

            // Standard tab rendering
            const CardComponent = tab.Card
            return (
              <div key={tab.id} className="space-y-3">
                {data.length > 0 ? (
                  data.map((item) => <CardComponent key={item.id} item={item} change={item} />)
                ) : (
                  <EmptyState icon={tab.icon} title={tab.emptyTitle} description={tab.emptyDesc} />
                )}
              </div>
            )
          })}
        </div>

        {/* ── Footer ── */}
        <div className="flex justify-end pt-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-surface-button text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors"
          >
            {t("common.close")}
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
  )
}
