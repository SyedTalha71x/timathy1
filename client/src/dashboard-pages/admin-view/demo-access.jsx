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
import toast, { Toaster } from "react-hot-toast";
import DemoWizardModal from "../../components/admin-dashboard-components/demo-access-components/DemoWizardModal";
import SendEmailModal from "../../components/admin-dashboard-components/demo-access-components/SendEmailModal";
import JournalModal from "../../components/admin-dashboard-components/demo-access-components/JournalModal";

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
  const colorClass = getStatusColor(status);
  const dotClass = getStatusDot(status);
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${colorClass}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      <span className="capitalize">{status}</span>
    </div>
  );
};

const TemplateBadge = ({ template }) => {
  const color = getTemplateColor(template?.id);
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
      style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}30` }}
    >
      <Shield size={10} />
      <span>{template?.name || "Unknown"}</span>
    </div>
  );
};

const DaysRemainingBadge = ({ expiryDate, status }) => {
  if (status === "inactive") return <span className="text-xs text-red-400">Deactivated</span>;
  const days = getDaysRemaining(expiryDate);
  if (days === null) return <span className="text-xs text-gray-500">—</span>;
  if (days <= 0) return <span className="text-xs text-red-400">Expired</span>;
  if (days <= 3) return <span className="text-xs text-orange-400 font-medium">{days}d remaining</span>;
  return <span className="text-xs text-gray-400">{days}d remaining</span>;
};

// ============================================
// Demo Card
// ============================================
const DemoCard = ({ demo, onViewJournal, onEdit, onResendEmail, onToggleStatus, onDelete }) => {
  const cfg = demo.config || {};
  const { enabled, total } = getPermissionCount(demo.template?.permissions);
  const ownerFullName = [cfg.studioOwnerFirstName, cfg.studioOwnerLastName].filter(Boolean).join(" ") || "—";

  return (
    <div className="bg-[#2a2a2a] rounded-2xl overflow-hidden border border-[#333333] hover:border-[#444444] transition-colors">
      <div className="h-1" style={{ backgroundColor: getTemplateColor(demo.template?.id) }} />
      <div className="p-4 md:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm md:text-base font-semibold text-white truncate">{cfg.studioName}</h3>
            <p className="text-xs text-gray-500 truncate mt-0.5">{demo.company}</p>
          </div>
          <StatusBadge status={demo.status} />
        </div>

        {/* Info rows */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <User size={12} className="text-gray-500 flex-shrink-0" />
            <span className="truncate">{ownerFullName}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Mail size={12} className="text-gray-500 flex-shrink-0" />
            <span className="truncate">{cfg.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock size={12} className="text-gray-500 flex-shrink-0" />
            <span>{cfg.demoDuration} days</span>
            <span className="text-gray-600 mx-1">·</span>
            <DaysRemainingBadge expiryDate={demo.expiryDate} status={demo.status} />
          </div>
          <div className="flex items-center gap-2">
            <TemplateBadge template={demo.template} />
            <span className="text-[10px] text-gray-500">{enabled}/{total} features</span>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-4 py-2.5 px-3 bg-[#1A1A1A] rounded-xl mb-4 text-xs">
          <div className="flex items-center gap-1.5">
            <LogIn size={11} className="text-gray-500" />
            <span className="text-gray-400">{demo.loginCount ?? 0} <span className="hidden sm:inline">logins</span></span>
          </div>
          <div className="w-px h-3 bg-gray-700" />
          <div className="flex items-center gap-1.5">
            <CalendarDays size={11} className="text-gray-500" />
            <span className="text-gray-400">{formatDate(demo.createdAt)}</span>
          </div>
          {demo.lastLogin && (
            <>
              <div className="w-px h-3 bg-gray-700" />
              <span className="text-[10px] text-gray-500">Last: {formatDate(demo.lastLogin)}</span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button onClick={() => onViewJournal(demo)} className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 bg-[#333333] hover:bg-[#3F3F3F] text-gray-300 rounded-xl text-xs transition-colors">
            <IoIosJournal size={13} />
            <span className="hidden sm:inline">Journal</span>
          </button>
          <button onClick={() => onEdit(demo)} className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 bg-[#333333] hover:bg-[#3F3F3F] text-gray-300 rounded-xl text-xs transition-colors">
            <Pencil size={12} />
            <span className="hidden sm:inline">Edit</span>
          </button>
          <button onClick={() => onResendEmail(demo)} className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 bg-[#333333] hover:bg-[#3F3F3F] text-gray-300 rounded-xl text-xs transition-colors">
            <Send size={12} />
            <span className="hidden sm:inline">Email</span>
          </button>
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
              action: "Access Deactivated",
              timestamp: new Date().toISOString(),
              user: "System",
              details: "Access expired - status set to inactive",
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
    { value: "createdAt", label: "Created" },
    { value: "studioName", label: "Name" },
    { value: "status", label: "Status" },
    { value: "demoDuration", label: "Duration" },
    { value: "loginCount", label: "Logins" },
  ];
  const currentSortLabel = sortOptions.find((o) => o.value === sortBy)?.label || "Sort";
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
      company: lead?.company || "Unknown",
      template,
      demoDuration: config.demoDuration,
      loginCount: 0,
      lastLogin: null,
      config: { ...config, sendEmail: true },
      createdAt: new Date().toISOString(),
      status: "active",
      expiryDate: new Date(Date.now() + config.demoDuration * 24 * 60 * 60 * 1000).toISOString(),
      journal: [{
        action: "Access Created",
        timestamp: new Date().toISOString(),
        user: "Admin",
        details: `Created access for ${config.studioName}`,
      }],
    });

    setDemos((prev) => [newDemo, ...prev]);
    setLastCreatedDemo(newDemo);
    setIsWizardOpen(false);
    toast.success("Access created successfully!");
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
            action: "Access Updated",
            timestamp: new Date().toISOString(),
            user: "Admin",
            details: `Updated configuration for ${updatedConfig.studioName}`,
          }],
        };
      })
    );
    setEditingDemo(null);
    setIsWizardOpen(false);
    toast.success("Access updated successfully!");
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
              action: "Access Deactivated",
              timestamp: new Date().toISOString(),
              user: "Admin",
              details: "Access status changed to inactive",
            }],
          };
        })
      );
      toast.success("Access deactivated!");
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
            action: "Access Activated",
            timestamp: new Date().toISOString(),
            user: "Admin",
            details: `Access reactivated for ${reactivateDays} days`,
          }],
        };
      })
    );
    setIsReactivateModalOpen(false);
    setReactivateDemoId(null);
    toast.success("Access reactivated!");
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
              action: "Email Sent",
              timestamp: new Date().toISOString(),
              user: "System",
              details: `Access email sent to ${d.config?.email || d.email}${langLabel ? ` (${langLabel})` : ""}`,
            }],
          }
        )
      );
      toast.success("Access email sent!");
    } else {
      if (emailModalMode === "create") {
        toast.success("Access created without email");
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
    toast.success("Access deleted successfully!");
  };

  // =============================================
  // RENDER
  // =============================================
  const filteredDemos = getFilteredDemos();
  const emailModalDemo = demoToResend || lastCreatedDemo || null;

  return (
    <div className="min-h-screen rounded-3xl bg-[#1C1C1C] text-white p-4 md:p-6 transition-all duration-500 ease-in-out flex-1">
      <Toaster position="top-right" toastOptions={{ duration: 2000, style: { background: "#333", color: "#fff" } }} />

      {/* ======== HEADER ======== */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-white oxanium_font text-xl md:text-2xl">Access Management</h1>

          {/* Sort button (mobile) */}
          <div className="lg:hidden relative" ref={sortDropdownRef}>
            <button
              onClick={(e) => { e.stopPropagation(); setShowSortDropdown(!showSortDropdown); }}
              className="px-3 py-2 bg-[#2F2F2F] text-gray-300 rounded-xl text-xs hover:bg-[#3F3F3F] transition-colors flex items-center gap-2"
            >
              {getSortIcon()}
              <span>{currentSortLabel}</span>
            </button>
            {showSortDropdown && (
              <div className="absolute left-0 mt-1 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-lg z-50 min-w-[180px]">
                <div className="py-1">
                  <div className="px-3 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-700">Sort by</div>
                  {sortOptions.map((opt) => (
                    <button key={opt.value} onClick={(e) => { e.stopPropagation(); handleSortOptionClick(opt.value); }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition-colors flex items-center justify-between ${sortBy === opt.value ? "text-white bg-gray-800/50" : "text-gray-300"}`}>
                      <span>{opt.label}</span>
                      {sortBy === opt.value && <span className="text-gray-400">{sortDirection === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create button (desktop) */}
        <div className="hidden md:block relative group">
          <button onClick={startCreation} className="flex bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm text-white px-3 sm:px-4 py-2 rounded-xl items-center gap-2 justify-center transition-colors">
            <Plus size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Create Access</span>
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex items-center gap-2 shadow-lg pointer-events-none">
            <span className="font-medium">Create Access</span>
            <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-semibold border border-white/30 font-mono">C</span>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black/90" />
          </div>
        </div>
      </div>

      {/* ======== SEARCH ======== */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search by studio name, owner, email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#141414] outline-none text-sm text-white rounded-xl px-4 py-2.5 pl-9 sm:pl-10 border border-[#333333] focus:border-[#3F74FF] transition-colors" />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-700 rounded-lg transition-colors">
              <X size={14} className="text-gray-400 hover:text-white" />
            </button>
          )}
        </div>
      </div>

      {/* ======== FILTERS ======== */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
        <button onClick={() => { setFilterStatuses([]); setFilterTemplates([]); }}
          className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${filterStatuses.length === 0 && filterTemplates.length === 0 ? "bg-blue-600 text-white" : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"}`}>
          All ({demos.length})
        </button>
        <button onClick={() => toggleFilter(filterStatuses, setFilterStatuses, "active")}
          className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 ${filterStatuses.includes("active") ? "bg-green-600 text-white" : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${filterStatuses.includes("active") ? "bg-white" : "bg-green-400"}`} />
          Active ({activeCount})
        </button>
        <button onClick={() => toggleFilter(filterStatuses, setFilterStatuses, "inactive")}
          className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 ${filterStatuses.includes("inactive") ? "bg-red-600 text-white" : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${filterStatuses.includes("inactive") ? "bg-white" : "bg-red-400"}`} />
          Inactive ({inactiveCount})
        </button>

        <div className="hidden sm:block w-px h-8 bg-gray-700 self-center" />

        {demoTemplates.map((tmpl) => (
          <button key={tmpl.id} onClick={() => toggleFilter(filterTemplates, setFilterTemplates, tmpl.id)}
            className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 ${filterTemplates.includes(tmpl.id) ? "text-white" : "bg-[#2F2F2F] text-gray-300 hover:bg-[#3F3F3F]"}`}
            style={filterTemplates.includes(tmpl.id) ? { backgroundColor: tmpl.color } : {}}>
            <Shield size={12} />
            {tmpl.name}
          </button>
        ))}

        {/* Sort (desktop) */}
        <div className="hidden lg:block ml-auto relative" ref={sortDropdownRef}>
          <button onClick={(e) => { e.stopPropagation(); setShowSortDropdown(!showSortDropdown); }}
            className="px-3 sm:px-4 py-2 bg-[#2F2F2F] text-gray-300 rounded-xl text-xs sm:text-sm hover:bg-[#3F3F3F] transition-colors flex items-center gap-2">
            {getSortIcon()} <span>{currentSortLabel}</span>
          </button>
          {showSortDropdown && (
            <div className="absolute top-full right-0 mt-1 bg-[#1F1F1F] border border-gray-700 rounded-lg shadow-lg z-50 min-w-[180px]">
              <div className="py-1">
                <div className="px-3 py-1.5 text-xs text-gray-500 font-medium border-b border-gray-700">Sort by</div>
                {sortOptions.map((opt) => (
                  <button key={opt.value} onClick={(e) => { e.stopPropagation(); handleSortOptionClick(opt.value); }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition-colors flex items-center justify-between ${sortBy === opt.value ? "text-white bg-gray-800/50" : "text-gray-300"}`}>
                    <span>{opt.label}</span>
                    {sortBy === opt.value && <span className="text-gray-400">{sortDirection === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======== DEMO GRID ======== */}
      {filteredDemos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <Building2 size={48} className="mb-4 text-gray-600" />
          <p className="text-base font-medium mb-1">No accesses found</p>
          <p className="text-sm text-gray-600">
            {searchQuery || filterStatuses.length > 0 || filterTemplates.length > 0 ? "Try adjusting your filters or search query" : "Create your first access to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 pb-20 md:pb-4">
          {filteredDemos.map((demo) => (
            <DemoCard key={demo.id} demo={demo} onViewJournal={handleViewJournal} onEdit={handleEditDemo} onResendEmail={handleResendEmail} onToggleStatus={handleToggleDemoStatus} onDelete={handleDeleteDemo} />
          ))}
        </div>
      )}

      {/* ======== FAB (Mobile) ======== */}
      <button onClick={startCreation} className="md:hidden fixed bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 z-30" aria-label="Create Access">
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
          <div className="bg-[#1A1A1A] rounded-xl max-w-sm w-full border border-gray-800">
            <div className="p-6 border-b border-gray-800 flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Power size={20} className="text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Reactivate Access</h2>
                  <p className="text-gray-400 text-sm mt-1">Set the new access duration</p>
                </div>
              </div>
              <button
                onClick={() => { setIsReactivateModalOpen(false); setReactivateDemoId(null); }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Duration (Days)</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={reactivateDays}
                  onChange={(e) => setReactivateDays(parseInt(e.target.value) || 7)}
                  className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-green-500"
                />
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
              <p className="text-xs text-gray-500 mt-2">The access will be active for {reactivateDays} day{reactivateDays !== 1 ? "s" : ""} starting from now.</p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setIsReactivateModalOpen(false); setReactivateDemoId(null); }}
                  className="flex-1 bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReactivate}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Reactivate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Delete Confirmation */}
      {isDeleteModalOpen && demoToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] rounded-xl max-w-sm w-full border border-gray-800">
            <div className="p-6 border-b border-gray-800 flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Trash2 size={20} className="text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Delete Access</h2>
                  <p className="text-gray-400 text-sm mt-1">This action cannot be undone</p>
                </div>
              </div>
              <button
                onClick={() => { setIsDeleteModalOpen(false); setDemoToDelete(null); }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-300 mb-1">
                Are you sure you want to permanently delete the access for
              </p>
              <p className="text-sm font-semibold text-white mb-4">
                {demoToDelete.config?.studioName || "this studio"}?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setIsDeleteModalOpen(false); setDemoToDelete(null); }}
                  className="flex-1 bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
