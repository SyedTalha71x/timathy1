/* eslint-disable no-constant-binary-expression */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  X,
  ArrowUp,
  ArrowDown,
  Pencil,
  Send,
  Power,
  Trash2,
  Clock,
  Building2,
  Mail,
  User,
  Shield,
  CalendarDays,
  LogIn,
} from "lucide-react";
import { IoIosJournal } from "react-icons/io";
import toast from "../../components/shared/SharedToast"
import DemoWizardModal from "../../components/admin-dashboard-components/demo-access-components/DemoWizardModal";
import SendEmailModal from "../../components/admin-dashboard-components/demo-access-components/SendEmailModal";
import JournalModal from "../../components/admin-dashboard-components/demo-access-components/JournalModal";

import { useTranslation } from "react-i18next"
import KeyboardSpacer from "../../components/shared/KeyboardSpacer"
import { haptic } from "../../utils/haptic"
import PullToRefresh from "../../components/shared/PullToRefresh"
import {
  demoAccessAccounts,
  demoTemplates,
  demoLeads,
  getStatusColor,
  getStatusDot,
  getTemplateColor,
  formatDate,
  getDaysRemaining,
  getPermissionCount,
} from "../../utils/admin-panel-states/demo-access-states";

// ============================================
// Helper: every account MUST have a config sub-object
// because JournalModal reads demo.config.studioName,
// SendEmailModal reads demo.config.email, etc.
// ============================================
const ensureConfig = (demo) => {
  if (demo.config) return demo;
  return {
    ...demo,
    config: {
      studioName: demo.studioName || "",
      studioOwnerFirstName: demo.studioOwnerFirstName || "",
      studioOwnerLastName: demo.studioOwnerLastName || "",
      studioLogo: demo.studioLogo || null,
      demoDuration: demo.demoDuration || 7,
      email: demo.email || "",
      sendEmail: true,
    },
  };
};

// ============================================
// Small UI Components
// ============================================
const StatusBadge = ({ status }) => {
  const { t } = useTranslation();
  const colorClass = getStatusColor(status);
  const dotClass = getStatusDot(status);
  const statusLabel = status === "active" ? t("admin.demoAccess.filter.active") : status === "inactive" ? t("admin.demoAccess.filter.inactive") : status;
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${colorClass}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      <span className="capitalize">{statusLabel}</span>
    </div>
  );
};

const TemplateBadge = ({ template }) => {
  const { t } = useTranslation();
  const color = getTemplateColor(template?.id);
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
      style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}30` }}
    >
      <Shield size={10} />
      <span>{template?.name || t("admin.demoAccess.card.unknown")}</span>
    </div>
  );
};

const DaysRemainingBadge = ({ expiryDate, status }) => {
  const { t } = useTranslation();
  if (status === "inactive") return <span className="text-xs text-red-400">{t("admin.demoAccess.card.deactivated")}</span>;
  const days = getDaysRemaining(expiryDate);
  if (days === null) return <span className="text-xs text-content-faint">—</span>;
  if (days <= 0) return <span className="text-xs text-red-400">{t("admin.demoAccess.card.expired")}</span>;
  if (days <= 3) return <span className="text-xs text-primary font-medium">{t("admin.demoAccess.card.daysRemaining", { days })}</span>;
  return <span className="text-xs text-content-muted">{t("admin.demoAccess.card.daysRemaining", { days })}</span>;
};

// ============================================
// Demo Card
// ============================================
const DemoCard = ({ demo, onViewJournal, onEdit, onResendEmail, onToggleStatus, onDelete }) => {
  const { t } = useTranslation();
  const cfg = demo.config || {};
  const { enabled, total } = getPermissionCount(demo.template?.permissions);
  const ownerFullName = [cfg.studioOwnerFirstName, cfg.studioOwnerLastName].filter(Boolean).join(" ") || "—";

  return (
    <div className="bg-surface-button rounded-2xl overflow-hidden border border-border hover:border-[#444444] transition-colors">
      <div className="h-1" style={{ backgroundColor: getTemplateColor(demo.template?.id) }} />
      <div className="p-4 md:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm md:text-base font-semibold text-white truncate">{cfg.studioName}</h3>
            <p className="text-xs text-content-faint truncate mt-0.5">{demo.company}</p>
          </div>
          <StatusBadge status={demo.status} />
        </div>

        {/* Info rows */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-content-muted">
            <User size={12} className="text-content-faint flex-shrink-0" />
            <span className="truncate">{ownerFullName}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-content-muted">
            <Mail size={12} className="text-content-faint flex-shrink-0" />
            <span className="truncate">{cfg.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-content-muted">
            <Clock size={12} className="text-content-faint flex-shrink-0" />
            <span>{cfg.demoDuration} {t("admin.demoAccess.card.days")}</span>
            <span className="text-content-faint mx-1">·</span>
            <DaysRemainingBadge expiryDate={demo.expiryDate} status={demo.status} />
          </div>
          <div className="flex items-center gap-2">
            <TemplateBadge template={demo.template} />
            <span className="text-[10px] text-content-faint">{enabled}/{total} {t("admin.demoAccess.card.features")}</span>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-4 py-2.5 px-3 bg-surface-hover rounded-xl mb-4 text-xs">
          <div className="flex items-center gap-1.5">
            <LogIn size={11} className="text-content-faint" />
            <span className="text-content-muted">{demo.loginCount ?? 0} <span className="hidden sm:inline">{t("admin.demoAccess.card.loginsLabel")}</span></span>
          </div>
          <div className="w-px h-3 bg-gray-700" />
          <div className="flex items-center gap-1.5">
            <CalendarDays size={11} className="text-content-faint" />
            <span className="text-content-muted">{formatDate(demo.createdAt)}</span>
          </div>
          {demo.lastLogin && (
            <>
              <div className="w-px h-3 bg-gray-700" />
              <span className="text-[10px] text-content-faint">{t("admin.demoAccess.card.lastLogin")} {formatDate(demo.lastLogin)}</span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <div className="relative group flex-1">
            <button onClick={() => onViewJournal(demo)} className="w-full flex items-center justify-center gap-1.5 py-2 px-2 bg-surface-button hover:bg-surface-button-hover text-content-secondary rounded-xl text-xs transition-colors whitespace-nowrap">
              <IoIosJournal size={13} />
              <span className="hidden xl:inline truncate">{t("admin.demoAccess.card.journal")}</span>
            </button>
            <div className="xl:hidden absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-black/90 text-white px-2.5 py-1 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg pointer-events-none">
              {t("admin.demoAccess.card.journal")}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black/90" />
            </div>
          </div>
          <div className="relative group flex-1">
            <button onClick={() => onEdit(demo)} className="w-full flex items-center justify-center gap-1.5 py-2 px-2 bg-surface-button hover:bg-surface-button-hover text-content-secondary rounded-xl text-xs transition-colors whitespace-nowrap">
              <Pencil size={12} />
              <span className="hidden xl:inline truncate">{t("admin.demoAccess.card.edit")}</span>
            </button>
            <div className="xl:hidden absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-black/90 text-white px-2.5 py-1 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg pointer-events-none">
              {t("admin.demoAccess.card.edit")}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black/90" />
            </div>
          </div>
          <div className="relative group flex-1">
            <button onClick={() => onResendEmail(demo)} className="w-full flex items-center justify-center gap-1.5 py-2 px-2 bg-surface-button hover:bg-surface-button-hover text-content-secondary rounded-xl text-xs transition-colors whitespace-nowrap">
              <Send size={12} />
              <span className="hidden xl:inline truncate">{t("admin.demoAccess.card.email")}</span>
            </button>
            <div className="xl:hidden absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-black/90 text-white px-2.5 py-1 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg pointer-events-none">
              {t("admin.demoAccess.card.email")}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black/90" />
            </div>
          </div>
          <button
            onClick={() => onToggleStatus(demo.id)}
            className={`p-2 rounded-xl text-xs transition-colors ${demo.status === "active" ? "bg-green-500/10 hover:bg-green-500/20 text-green-400" : "bg-red-500/10 hover:bg-red-500/20 text-red-400"}`}
          >
            <Power size={13} />
          </button>
          <button
            onClick={() => onDelete(demo)}
            className="p-2 rounded-xl text-xs transition-colors bg-red-500/10 hover:bg-red-500/20 text-red-400"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Main Page
// ============================================
export default function DemoCreationPage() {
  const { t } = useTranslation()
  // All demos — normalized to always have config
  const [demos, setDemos] = useState(() => demoAccessAccounts.map(ensureConfig));

  // Search / filter / sort
  const [searchQuery, setSearchQuery] = useState("");

  const locationState = useLocation();
  const navigateDemo = useNavigate();

  // Pre-selected lead from navigation (e.g. from Leads page)
  const [initialLeadForWizard, setInitialLeadForWizard] = useState(null);
  const [filterStatuses, setFilterStatuses] = useState([]);
  const [filterTemplates, setFilterTemplates] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortDropdownRef = useRef(null);

  // Creation wizard: 0=off, 1=lead, 2=template, 3=configure
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardMode, setWizardMode] = useState("create"); // "create" | "edit"
  const [editingDemo, setEditingDemo] = useState(null);

  // Modal states
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailModalMode, setEmailModalMode] = useState("create"); // "create" | "resend"
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [demoToResend, setDemoToResend] = useState(null);
  const [selectedDemoForJournal, setSelectedDemoForJournal] = useState(null);
  const [lastCreatedDemo, setLastCreatedDemo] = useState(null);

  // Reactivation modal
  const [isReactivateModalOpen, setIsReactivateModalOpen] = useState(false);
  const [reactivateDemoId, setReactivateDemoId] = useState(null);
  const [reactivateDays, setReactivateDays] = useState(7);

  // Delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [demoToDelete, setDemoToDelete] = useState(null);

  // ---- Handle pre-selected lead from navigation (e.g. from Leads page) ----
  useEffect(() => {
    if (locationState.state?.preSelectedLead) {
      setInitialLeadForWizard(locationState.state.preSelectedLead);
      setWizardMode("create");
      setEditingDemo(null);
      setIsWizardOpen(true);
      // Clear the navigation state so it doesn't re-trigger
      navigateDemo(locationState.pathname, { replace: true, state: {} });
    }
  }, [locationState.state]);

  // ---- Close sort dropdown on outside click ----
  useEffect(() => {
    const handler = (e) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // ---- Auto-deactivate expired demos ----
  useEffect(() => {
    setDemos((prev) => {
      let changed = false;
      const updated = prev.map((demo) => {
        if (demo.status !== "active") return demo;
        const days = getDaysRemaining(demo.expiryDate);
        if (days !== null && days <= 0) {
          changed = true;
          return {
            ...demo,
            status: "inactive",
            expiryDate: null,
            journal: [...demo.journal, {
              action: t("admin.demoAccess.journal.accessDeactivated"),
              timestamp: new Date().toISOString(),
              user: "System",
              details: t("admin.demoAccess.journal.expiredAutoDeactivated"),
            }],
          };
        }
        return demo;
      });
      return changed ? updated : prev;
    });
  }, []);

  // ---- Sort helpers ----
  const sortOptions = [
    { value: "createdAt", label: t("admin.demoAccess.sort.created") },
    { value: "studioName", label: t("admin.demoAccess.sort.name") },
    { value: "status", label: t("admin.demoAccess.sort.status") },
    { value: "demoDuration", label: t("admin.demoAccess.sort.duration") },
    { value: "loginCount", label: t("admin.demoAccess.sort.logins") },
  ];
  const currentSortLabel = sortOptions.find((o) => o.value === sortBy)?.label || t("common.sortBy");
  const getSortIcon = () => (sortDirection === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />);
  const handleSortOptionClick = (value) => {
    if (value === sortBy) setSortDirection((p) => (p === "asc" ? "desc" : "asc"));
    else { setSortBy(value); setSortDirection("asc"); }
  };

  // ---- Filter + sort ----
  const getFilteredDemos = () => {
    let filtered = demos;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((d) =>
        (d.config?.studioName || "").toLowerCase().includes(q) ||
        (d.config?.studioOwnerFirstName || "").toLowerCase().includes(q) ||
        (d.config?.studioOwnerLastName || "").toLowerCase().includes(q) ||
        (d.config?.email || "").toLowerCase().includes(q) ||
        (d.company || "").toLowerCase().includes(q)
      );
    }
    if (filterStatuses.length > 0) filtered = filtered.filter((d) => filterStatuses.includes(d.status));
    if (filterTemplates.length > 0) filtered = filtered.filter((d) => filterTemplates.includes(d.template?.id));

    return [...filtered].sort((a, b) => {
      let aV, bV;
      if (sortBy === "studioName") { aV = (a.config?.studioName || "").toLowerCase(); bV = (b.config?.studioName || "").toLowerCase(); }
      else if (sortBy === "createdAt") { aV = new Date(a.createdAt || 0).getTime(); bV = new Date(b.createdAt || 0).getTime(); }
      else { aV = a[sortBy]; bV = b[sortBy]; if (typeof aV === "string") { aV = aV.toLowerCase(); bV = (bV || "").toLowerCase(); } }
      if (aV < bV) return sortDirection === "asc" ? -1 : 1;
      if (aV > bV) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  const activeCount = demos.filter((d) => d.status === "active").length;
  const inactiveCount = demos.filter((d) => d.status === "inactive").length;

  // Toggle helper for multi-select filter arrays
  const toggleFilter = (arr, setArr, value) => {
    setArr((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]);
  };

  // =============================================
  // CREATION FLOW (via DemoWizardModal)
  // =============================================
  const startCreation = () => {
    setWizardMode("create");
    setEditingDemo(null);
    setIsWizardOpen(true);
  };

  const handleWizardCreate = ({ lead, template, config }) => {
    const newDemo = ensureConfig({
      id: Date.now(),
      lead,
      studioName: config.studioName,
      studioOwnerFirstName: config.studioOwnerFirstName,
      studioOwnerLastName: config.studioOwnerLastName,
      email: config.email,
      company: lead?.company || t("admin.demoAccess.card.unknown"),
      template,
      demoDuration: config.demoDuration,
      loginCount: 0,
      lastLogin: null,
      config: { ...config, sendEmail: true },
      createdAt: new Date().toISOString(),
      status: "active",
      expiryDate: new Date(Date.now() + config.demoDuration * 24 * 60 * 60 * 1000).toISOString(),
      journal: [{
        action: t("admin.demoAccess.journal.accessCreated"),
        timestamp: new Date().toISOString(),
        user: "Admin",
        details: t("admin.demoAccess.journal.createdFor", { name: config.studioName }),
      }],
    });

    setDemos((prev) => [newDemo, ...prev]);
    setLastCreatedDemo(newDemo);
    setIsWizardOpen(false);
    haptic.success(); toast.success(t("admin.demoAccess.toast.created"));
    setEmailModalMode("create");
    setTimeout(() => setIsEmailModalOpen(true), 100);
  };

  // =============================================
  // EDIT (via DemoWizardModal in edit mode)
  // =============================================
  const handleEditDemo = (demo) => {
    setEditingDemo(demo);
    setWizardMode("edit");
    setIsWizardOpen(true);
  };

  const handleUpdateDemo = (updatedConfig) => {
    setDemos((prev) =>
      prev.map((demo) => {
        if (demo.id !== editingDemo.id) return demo;
        const newExpiry = demo.status === "active"
          ? new Date(Date.now() + updatedConfig.demoDuration * 24 * 60 * 60 * 1000).toISOString()
          : demo.expiryDate;
        const newTemplate = updatedConfig.template || demo.template;
        return {
          ...demo,
          template: newTemplate,
          config: { ...demo.config, ...updatedConfig, template: undefined },
          studioName: updatedConfig.studioName,
          studioOwnerFirstName: updatedConfig.studioOwnerFirstName,
          studioOwnerLastName: updatedConfig.studioOwnerLastName,
          demoDuration: updatedConfig.demoDuration,
          expiryDate: newExpiry,
          journal: [...demo.journal, {
            action: t("admin.demoAccess.journal.accessUpdated"),
            timestamp: new Date().toISOString(),
            user: "Admin",
            details: t("admin.demoAccess.journal.updatedFor", { name: updatedConfig.studioName }),
          }],
        };
      })
    );
    setEditingDemo(null);
    setIsWizardOpen(false);
    haptic.success(); toast.success(t("admin.demoAccess.toast.updated"));
  };

  // =============================================
  // TOGGLE STATUS
  // =============================================
  const handleToggleDemoStatus = (demoId) => {
    const demo = demos.find((d) => d.id === demoId);
    if (!demo) return;

    if (demo.status === "active") {
      setDemos((prev) =>
        prev.map((d) => {
          if (d.id !== demoId) return d;
          return {
            ...d,
            status: "inactive",
            expiryDate: null,
            journal: [...d.journal, {
              action: t("admin.demoAccess.journal.accessDeactivated"),
              timestamp: new Date().toISOString(),
              user: "Admin",
              details: t("admin.demoAccess.journal.statusInactive"),
            }],
          };
        })
      );
      haptic.success(); toast.success(t("admin.demoAccess.toast.deactivated"));
    } else {
      setReactivateDemoId(demoId);
      setReactivateDays(demo.config?.demoDuration || 7);
      setIsReactivateModalOpen(true);
    }
  };

  const handleConfirmReactivate = () => {
    if (!reactivateDemoId) return;
    setDemos((prev) =>
      prev.map((d) => {
        if (d.id !== reactivateDemoId) return d;
        return {
          ...d,
          status: "active",
          demoDuration: reactivateDays,
          config: { ...d.config, demoDuration: reactivateDays },
          expiryDate: new Date(Date.now() + reactivateDays * 24 * 60 * 60 * 1000).toISOString(),
          journal: [...d.journal, {
            action: t("admin.demoAccess.journal.accessActivated"),
            timestamp: new Date().toISOString(),
            user: "Admin",
            details: t("admin.demoAccess.journal.reactivatedFor", { days: reactivateDays }),
          }],
        };
      })
    );
    setIsReactivateModalOpen(false);
    setReactivateDemoId(null);
    haptic.success(); toast.success(t("admin.demoAccess.toast.reactivated"));
  };

  // =============================================
  // EMAIL
  // =============================================
  const handleSendEmail = (demoId, shouldSend, emailInfo) => {
    if (shouldSend) {
      const langLabel = emailInfo?.language
        ? { de: "Deutsch", en: "English", fr: "Français", es: "Español", it: "Italiano" }[emailInfo.language] || emailInfo.language
        : "";
      setDemos((prev) =>
        prev.map((d) =>
          d.id !== demoId ? d : {
            ...d,
            journal: [...d.journal, {
              action: t("admin.demoAccess.journal.emailSent"),
              timestamp: new Date().toISOString(),
              user: "System",
              details: t("admin.demoAccess.journal.emailSentTo", { email: d.config?.email || d.email }) + (langLabel ? ` (${langLabel})` : ""),
            }],
          }
        )
      );
      haptic.success(); toast.success(t("admin.demoAccess.toast.emailSent"));
    } else {
      if (emailModalMode === "create") {
        haptic.success(); toast.success(t("admin.demoAccess.toast.createdWithoutEmail"));
      }
    }
    setIsEmailModalOpen(false);
    setLastCreatedDemo(null);
    setDemoToResend(null);
  };

  const handleResendEmail = (demo) => {
    setDemoToResend(demo);
    setEmailModalMode("resend");
    setIsEmailModalOpen(true);
  };

  // =============================================
  // JOURNAL
  // =============================================
  const handleViewJournal = (demo) => {
    setSelectedDemoForJournal(demo);
    setIsJournalModalOpen(true);
  };

  // =============================================
  // DELETE
  // =============================================
  const handleDeleteDemo = (demo) => {
    setDemoToDelete(demo);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!demoToDelete) return;
    setDemos((prev) => prev.filter((d) => d.id !== demoToDelete.id));
    setIsDeleteModalOpen(false);
    setDemoToDelete(null);
    haptic.success(); toast.success(t("admin.demoAccess.toast.deleted"));
  };

  // =============================================
  // RENDER
  // =============================================
  const filteredDemos = getFilteredDemos();
  const emailModalDemo = demoToResend || lastCreatedDemo || null;

  return (
    <div className="min-h-screen rounded-3xl bg-surface-base text-white p-4 md:p-6 transition-all duration-500 ease-in-out flex-1">
{/* ======== HEADER ======== */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-white oxanium_font text-xl md:text-2xl">{t("admin.demoAccess.title")}</h1>

          {/* Sort button (mobile) */}
          <div className="lg:hidden relative" ref={sortDropdownRef}>
            <button
              onClick={(e) => { e.stopPropagation(); setShowSortDropdown(!showSortDropdown); }}
              className="px-3 py-2 bg-surface-button text-content-secondary rounded-xl text-xs hover:bg-surface-button-hover transition-colors flex items-center gap-2"
            >
              {getSortIcon()}
              <span>{currentSortLabel}</span>
            </button>
            {showSortDropdown && (
              <div className="absolute left-0 mt-1 bg-surface-hover border border-border rounded-lg shadow-lg z-50 min-w-[180px]">
                <div className="py-1">
                  <div className="px-3 py-1.5 text-xs text-content-faint font-medium border-b border-border">{t("admin.demoAccess.sort.sortBy")}</div>
                  {sortOptions.map((opt) => (
                    <button key={opt.value} onClick={(e) => { e.stopPropagation(); handleSortOptionClick(opt.value); }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-hover transition-colors flex items-center justify-between ${sortBy === opt.value ? "text-white bg-gray-800/50" : "text-content-secondary"}`}>
                      <span>{opt.label}</span>
                      {sortBy === opt.value && <span className="text-content-muted">{sortDirection === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create button (desktop) */}
        <div className="hidden md:block relative group">
          <button onClick={startCreation} className="flex bg-primary hover:bg-primary-hover text-xs sm:text-sm text-white px-3 sm:px-4 py-2 rounded-xl items-center gap-2 justify-center transition-colors">
            <Plus size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{t("admin.demoAccess.createAccess")}</span>
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
            <span className="font-medium">{t("admin.demoAccess.createAccess")}</span>
            <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">C</span>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
          </div>
        </div>
      </div>

      {/* ======== SEARCH ======== */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" size={16} />
          <input type="text" placeholder={t("admin.demoAccess.search.placeholder")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-card outline-none text-sm text-white rounded-xl px-4 py-2.5 pl-9 sm:pl-10 border border-border focus:border-[#3F74FF] transition-colors" />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-700 rounded-lg transition-colors">
              <X size={14} className="text-content-muted hover:text-content-primary" />
            </button>
          )}
        </div>
      </div>

      {/* ======== FILTERS ======== */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
        <button onClick={() => { setFilterStatuses([]); setFilterTemplates([]); }}
          className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${filterStatuses.length === 0 && filterTemplates.length === 0 ? "bg-blue-600 text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"}`}>
          {t("admin.demoAccess.filter.all")} ({demos.length})
        </button>
        <button onClick={() => toggleFilter(filterStatuses, setFilterStatuses, "active")}
          className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 ${filterStatuses.includes("active") ? "bg-green-600 text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${filterStatuses.includes("active") ? "bg-white" : "bg-green-400"}`} />
          {t("admin.demoAccess.filter.active")} ({activeCount})
        </button>
        <button onClick={() => toggleFilter(filterStatuses, setFilterStatuses, "inactive")}
          className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 ${filterStatuses.includes("inactive") ? "bg-red-600 text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${filterStatuses.includes("inactive") ? "bg-white" : "bg-red-400"}`} />
          {t("admin.demoAccess.filter.inactive")} ({inactiveCount})
        </button>

        <div className="hidden sm:block w-px h-8 bg-gray-700 self-center" />

        {demoTemplates.map((tmpl) => (
          <button key={tmpl.id} onClick={() => toggleFilter(filterTemplates, setFilterTemplates, tmpl.id)}
            className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 ${filterTemplates.includes(tmpl.id) ? "text-white" : "bg-surface-button text-content-secondary hover:bg-surface-button-hover"}`}
            style={filterTemplates.includes(tmpl.id) ? { backgroundColor: tmpl.color } : {}}>
            <Shield size={12} />
            {tmpl.name}
          </button>
        ))}

        {/* Sort (desktop) */}
        <div className="hidden lg:block ml-auto relative" ref={sortDropdownRef}>
          <button onClick={(e) => { e.stopPropagation(); setShowSortDropdown(!showSortDropdown); }}
            className="px-3 sm:px-4 py-2 bg-surface-button text-content-secondary rounded-xl text-xs sm:text-sm hover:bg-surface-button-hover transition-colors flex items-center gap-2">
            {getSortIcon()} <span>{currentSortLabel}</span>
          </button>
          {showSortDropdown && (
            <div className="absolute top-full right-0 mt-1 bg-surface-hover border border-border rounded-lg shadow-lg z-50 min-w-[180px]">
              <div className="py-1">
                <div className="px-3 py-1.5 text-xs text-content-faint font-medium border-b border-border">{t("admin.demoAccess.sort.sortBy")}</div>
                {sortOptions.map((opt) => (
                  <button key={opt.value} onClick={(e) => { e.stopPropagation(); handleSortOptionClick(opt.value); }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-hover transition-colors flex items-center justify-between ${sortBy === opt.value ? "text-white bg-gray-800/50" : "text-content-secondary"}`}>
                    <span>{opt.label}</span>
                    {sortBy === opt.value && <span className="text-content-muted">{sortDirection === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======== DEMO GRID ======== */}
      {filteredDemos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-content-faint">
          <Building2 size={48} className="mb-4 text-content-faint" />
          <p className="text-base font-medium mb-1">{t("admin.demoAccess.empty.title")}</p>
          <p className="text-sm text-content-faint">
            {searchQuery || filterStatuses.length > 0 || filterTemplates.length > 0 ? t("admin.demoAccess.empty.filterHint") : t("admin.demoAccess.empty.createHint")}
          </p>
        </div>
      ) : (

        <PullToRefresh onRefresh={async () => { haptic.success() }} className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 pb-20 md:pb-4">
          {filteredDemos.map((demo) => (
            <DemoCard key={demo.id} demo={demo} onViewJournal={handleViewJournal} onEdit={handleEditDemo} onResendEmail={handleResendEmail} onToggleStatus={handleToggleDemoStatus} onDelete={handleDeleteDemo} />
          ))}
        </div>
        </PullToRefresh>
      )}

      {/* ======== FAB (Mobile) ======== */}
      <button onClick={startCreation} className="md:hidden fixed bottom-4 right-4 bg-primary hover:bg-primary-hover text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 z-30" aria-label={t("admin.demoAccess.createAccess")}>
        <Plus size={22} />
      </button>

      {/* ======== MODALS ======== */}

      {/* 1. Unified Wizard (Create + Edit) */}
      <DemoWizardModal
        isOpen={isWizardOpen}
        onClose={() => { setIsWizardOpen(false); setEditingDemo(null); setInitialLeadForWizard(null); }}
        mode={wizardMode}
        leads={demoLeads}
        templates={demoTemplates}
        onCreate={handleWizardCreate}
        demo={editingDemo}
        onUpdate={handleUpdateDemo}
        initialLead={initialLeadForWizard}
      />

      {/* 4. Send Email (Create + Resend) */}
      {emailModalDemo && (
        <SendEmailModal
          isOpen={isEmailModalOpen}
          onClose={() => { setIsEmailModalOpen(false); setLastCreatedDemo(null); setDemoToResend(null); }}
          demo={emailModalDemo}
          mode={emailModalMode}
          onSend={(shouldSend, emailInfo) => handleSendEmail(emailModalDemo.id, shouldSend, emailInfo)}
        />
      )}

      {/* 6. Journal */}
      <JournalModal
        isOpen={isJournalModalOpen}
        onClose={() => { setIsJournalModalOpen(false); setSelectedDemoForJournal(null); }}
        demo={selectedDemoForJournal}
      />

      {/* 7. Reactivate — ask for days */}
      {isReactivateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-hover rounded-xl max-w-sm w-full border border-border">
            <div className="p-6 border-b border-border flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Power size={20} className="text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{t("admin.demoAccess.reactivateModal.title")}</h2>
                  <p className="text-content-muted text-sm mt-1">{t("admin.demoAccess.reactivateModal.subtitle")}</p>
                </div>
              </div>
              <button
                onClick={() => { setIsReactivateModalOpen(false); setReactivateDemoId(null); }}
                className="text-content-muted hover:text-content-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-content-secondary mb-2">{t("admin.demoAccess.reactivateModal.durationLabel")}</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={reactivateDays}
                  onChange={(e) => setReactivateDays(parseInt(e.target.value) || 7)}
                  className="w-full bg-surface-button border border-border rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-green-500"
                />
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" size={16} />
              </div>
              <p className="text-xs text-content-faint mt-2">{t("admin.demoAccess.reactivateModal.durationHint", { days: reactivateDays })}</p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setIsReactivateModalOpen(false); setReactivateDemoId(null); }}
                  className="flex-1 bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  {t("common.cancel")}
                </button>
                <button
                  onClick={handleConfirmReactivate}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  {t("admin.demoAccess.reactivateModal.confirm")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Delete Confirmation */}
      {isDeleteModalOpen && demoToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-hover rounded-xl max-w-sm w-full border border-border">
            <div className="p-6 border-b border-border flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Trash2 size={20} className="text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{t("admin.demoAccess.deleteModal.title")}</h2>
                  <p className="text-content-muted text-sm mt-1">{t("admin.demoAccess.deleteModal.subtitle")}</p>
                </div>
              </div>
              <button
                onClick={() => { setIsDeleteModalOpen(false); setDemoToDelete(null); }}
                className="text-content-muted hover:text-content-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-content-secondary mb-1">
                {t("admin.demoAccess.deleteModal.confirmMessage")}
              </p>
              <p className="text-sm font-semibold text-white mb-4">
                {demoToDelete.config?.studioName || t("admin.demoAccess.deleteModal.thisStudio")}?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setIsDeleteModalOpen(false); setDemoToDelete(null); }}
                  className="flex-1 bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  {t("common.cancel")}
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  {t("common.delete")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
