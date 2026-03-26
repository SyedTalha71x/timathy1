/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useLocation } from "react-router-dom"
import {
  Search,
  Building2,
  User,
  Shield,
  FileText,
  PauseCircle,
  Mail,

  Upload,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Plus,
  Trash2,
  Copy,
  X,
  Info,
  Check,
  Edit,
  Settings,
  Eye,
  EyeOff,
  History,
  Scale,
  UserPlus,
  Globe,
  Phone,
  AtSign,
  Lock,
  Send,
  Server,
  Calendar,
  Smartphone,
  Clock,
} from "lucide-react"
import { RiContractLine } from "react-icons/ri"
import { Modal, ColorPicker } from "antd"
import dayjs from "dayjs"


import defaultLogoUrl from "../../../public/gray-avatar-fotor-20250912192528.png"
import { WysiwygEditor } from "../../components/shared/WysiwygEditor"
import ContractBuilder from "../../components/shared/contract-builder/ContractBuilder"
import CreateContractFormModal from "../../components/studio-components/configuration-components/CreateContractFormModal"
import AdminContractTypeModal from "../../components/admin-dashboard-components/configuration-components/AdminContractTypeModal"
import LanguageTabs, { emptyTranslations } from "../../components/admin-dashboard-components/shared/LanguageTabs"

import { useTranslation } from "react-i18next"
import DatePickerField from "../../components/shared/DatePickerField"
import toast from "../../components/shared/SharedToast"
import { haptic } from "../../utils/haptic"
import KeyboardSpacer from "../../components/shared/KeyboardSpacer"
// Import configuration defaults from admin-panel-states (Single Source of Truth)
import {
  DEFAULT_COMMUNICATION_SETTINGS,
  DEFAULT_SMTP_CONFIG,
  DEFAULT_DEMO_EMAIL,
  DEFAULT_REGISTRATION_EMAIL,
  DEFAULT_CONTACT_DATA,
  DEFAULT_LEGAL_INFO,
  DEFAULT_CONTRACT_PAUSE_REASONS,
  DEFAULT_CONTRACT_FORMS,
  DEFAULT_CONTRACT_TYPES,
  DEFAULT_LEAD_SOURCES,
  CONFIGURATION_NAV_ITEMS,
  DEMO_MENU_ITEMS,
  MEMBER_VIEW_MENU_ITEMS,
  DEFAULT_DEMO_TEMPLATES,
  DEFAULT_CHANGELOG,
  DEFAULT_ACCOUNTS,
} from "../../utils/admin-panel-states/configuration-states"

// ============================================
// Reusable Components (matching studio design)
// ============================================

// WysiwygEditor imported from shared components (see import above)

// Section Header Component
const SectionHeader = ({ title, description, action }) => (
  <div className="hidden md:flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-white">{title}</h2>
      {description && <p className="text-xs sm:text-sm text-gray-400 mt-1">{description}</p>}
    </div>
    {action}
  </div>
)

// Collapsible Variables Row — collapsed on mobile, always visible on desktop
const VariablesRow = ({ children }) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="md:hidden flex items-center gap-1.5 text-xs text-gray-500 mb-1.5 hover:text-gray-400 transition-colors"
      >
        <ChevronRight className={`w-3 h-3 transition-transform ${open ? "rotate-90" : ""}`} />
        {t("admin.configuration.variables")}
      </button>
      <div className={`flex-wrap items-center gap-2 ${open ? "flex" : "hidden"} md:flex`}>
        {children}
      </div>
    </div>
  )
}

// Card Component
const SettingsCard = ({ children, className = "" }) => (
  <div className={`bg-[#1F1F1F] rounded-xl p-4 sm:p-6 ${className}`}>
    {children}
  </div>
)

// Input Component
const InputField = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = "text", 
  maxLength, 
  required, 
  error, 
  helpText, 
  icon: Icon,
  disabled = false,
  rows = 1
}) => (
  <div className="space-y-1.5">
    {label && (
      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
      )}
      {rows > 1 ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          rows={rows}
          className={`w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border transition-colors resize-none ${
            error ? "border-red-500" : "border-[#333333] focus:border-[#3F74FF]"
          } ${Icon ? "pl-10" : ""} ${disabled ? "text-gray-500 cursor-not-allowed" : ""}`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          className={`w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border transition-colors ${
            error ? "border-red-500" : "border-[#333333] focus:border-[#3F74FF]"
          } ${Icon ? "pl-10" : ""} ${disabled ? "text-gray-500 cursor-not-allowed" : ""}`}
        />
      )}
    </div>
    {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
)

// Select Component
const SelectField = ({ label, value, onChange, options, placeholder, required, searchable = false }) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      )
    : options

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
          {label}
          {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF] flex items-center justify-between"
        >
          <span className={selectedOption ? "text-white" : "text-gray-500"}>
            {selectedOption?.label || placeholder || t("admin.configuration.select")}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-[#1F1F1F] border border-[#333333] rounded-xl shadow-lg max-h-60 overflow-hidden">
            {searchable && (
              <div className="p-2 border-b border-[#333333]">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("common.search")}
                  className="w-full bg-[#141414] text-white rounded-lg px-3 py-2 text-sm outline-none border border-[#333333]"
                  autoFocus
                />
              </div>
            )}
            <div className="overflow-y-auto max-h-48">
              {filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value)
                    setIsOpen(false)
                    setSearch("")
                  }}
                  className={`w-full px-4 py-2.5 text-sm text-left hover:bg-[#2F2F2F] transition-colors ${
                    opt.value === value ? "bg-[#2F2F2F] text-orange-400" : "text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
              {filteredOptions.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">{t("common.noResults")}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Toggle/Switch Component
const Toggle = ({ label, checked, onChange, helpText }) => (
  <div className="flex items-start justify-between gap-4">
    <div className="flex-1">
      <span className="text-sm font-medium text-white">{label}</span>
      {helpText && <p className="text-xs text-gray-500 mt-0.5">{helpText}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
        checked ? "bg-orange-500" : "bg-[#333333]"
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  </div>
)

// Number Input Component
const NumberInput = ({ label, value, onChange, min = 0, max, step = 1, suffix, helpText }) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Math.floor(Number(e.target.value)))}
        onKeyDown={(e) => {
          if (e.key === '.' || e.key === ',') e.preventDefault()
        }}
        min={min}
        max={max}
        step={step}
        className="w-24 bg-[#141414] text-white rounded-xl px-3 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
      />
      {suffix && <span className="text-sm text-gray-400">{suffix}</span>}
    </div>
    {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
  </div>
)

// Tooltip Component
const Tooltip = ({ children, content, position = "left" }) => (
  <div className="relative group inline-flex">
    {children}
    <div className={`absolute top-full mt-2 px-3 py-2 bg-[#1F1F1F] text-gray-300 text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] w-64 border border-[#333333] shadow-xl pointer-events-none ${position === "right" ? "right-0" : "left-0"}`}>
      <div className={`absolute bottom-full border-4 border-transparent border-b-[#333333] ${position === "right" ? "right-4" : "left-4"}`} />
      <div className={`absolute bottom-full mb-[-1px] border-4 border-transparent border-b-[#1F1F1F] ${position === "right" ? "right-4" : "left-4"}`} />
      <div className="break-words leading-relaxed">{content}</div>
    </div>
  </div>
)

// Info Tooltip Component
const InfoTooltip = ({ content, position = "left" }) => (
  <Tooltip content={content} position={position}>
    <Info className="w-4 h-4 text-gray-500 hover:text-gray-300 cursor-help" />
  </Tooltip>
)

// ============================================
// Navigation Items - map iconNames from configuration-states to actual icon components
// ============================================
const iconMap = { User, Building2, RiContractLine, UserPlus, Mail, History, Shield }
const navigationItems = CONFIGURATION_NAV_ITEMS.map(item => {
  const mapped = {
    ...item,
    icon: iconMap[item.iconName] || Settings,
  }
  // Inject "Contract Forms" section into the contracts category
  if (item.id === "contracts") {
    const hasContractForms = item.sections.some(s => s.id === "contract-forms")
    if (!hasContractForms) {
      mapped.sections = [
        ...item.sections.filter(s => s.id === "contract-types" || s.id !== "contract-types"),
      ]
      // Insert contract-forms right before contract-types (or at the beginning)
      const typeIndex = mapped.sections.findIndex(s => s.id === "contract-types")
      if (typeIndex >= 0) {
        mapped.sections.splice(typeIndex, 0, { id: "contract-forms", label: "Contract Forms" })
      } else {
        mapped.sections.unshift({ id: "contract-forms", label: "Contract Forms" })
      }
    }
  }
  return mapped
})

// ============================================
// Main Configuration Page Component
// ============================================
const ConfigurationPage = () => {
  const location = useLocation()
  const [searchParams] = useSearchParams()

  // Navigation State
  const [activeCategory, setActiveCategory] = useState("account")
  const { t } = useTranslation()
  const [activeSection, setActiveSection] = useState("accounts")
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileShowContent, setMobileShowContent] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState(["account"])

  // Handle URL section parameter on mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const tabParam = queryParams.get("tab")
    
    if (tabParam === "account-management") {
      setActiveCategory("account")
      setActiveSection("accounts")
      setMobileShowContent(true)
      setExpandedCategories(prev => 
        prev.includes("account") ? prev : [...prev, "account"]
      )
    }
  }, [location.search])

  // ============================================
  // Accounts State
  // ============================================
  const [accounts, setAccounts] = useState([...DEFAULT_ACCOUNTS])
  const [editingAccountId, setEditingAccountId] = useState(null)
  const [addingAccount, setAddingAccount] = useState(false)
  const [newAccount, setNewAccount] = useState({ firstName: "", lastName: "", email: "", password: "" })
  const [logo, setLogo] = useState([])
  const [logoUrl, setLogoUrl] = useState("")
  // Password change state (for inline editing)
  const [changingPasswordId, setChangingPasswordId] = useState(null)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // ============================================
  // Platform State (initialized from configuration-states)
  // ============================================
  const [contactData, setContactData] = useState({ ...DEFAULT_CONTACT_DATA })

  const [legalInfo, setLegalInfo] = useState({ ...DEFAULT_LEGAL_INFO })
  const [legalLang, setLegalLang] = useState("de")

  // ============================================
  // Contracts State (initialized from configuration-states)
  // ============================================
  const [contractTypes, setContractTypes] = useState([...DEFAULT_CONTRACT_TYPES])
  const [contractTypeModalVisible, setContractTypeModalVisible] = useState(false)
  const [editingContractType, setEditingContractType] = useState(null)
  const [editingContractTypeIndex, setEditingContractTypeIndex] = useState(null)
  const [contractPauseReasons, setContractPauseReasons] = useState([...DEFAULT_CONTRACT_PAUSE_REASONS])
  const [contractForms, setContractForms] = useState([...DEFAULT_CONTRACT_FORMS])
  const [selectedContractForm, setSelectedContractForm] = useState(null)
  const [contractBuilderModalVisible, setContractBuilderModalVisible] = useState(false)
  const [newContractFormName, setNewContractFormName] = useState("")
  const [showCreateFormModal, setShowCreateFormModal] = useState(false)
  const [editingContractFormName, setEditingContractFormName] = useState({ id: null, value: "" })

  // ============================================
  // Resources State (initialized from configuration-states)
  // ============================================
  const [leadSources, setLeadSources] = useState([...DEFAULT_LEAD_SOURCES])

  // ============================================
  // Communication State (initialized from configuration-states)
  // ============================================
  const [demoEmail, setDemoEmail] = useState({ ...DEFAULT_DEMO_EMAIL })
  const [demoEmailLang, setDemoEmailLang] = useState("de")

  const [registrationEmail, setRegistrationEmail] = useState({ ...DEFAULT_REGISTRATION_EMAIL })
  const [registrationEmailLang, setRegistrationEmailLang] = useState("de")

  const [emailSignature, setEmailSignature] = useState(
    typeof DEFAULT_COMMUNICATION_SETTINGS.emailSignature === "object"
      ? { ...DEFAULT_COMMUNICATION_SETTINGS.emailSignature }
      : emptyTranslations()
  )
  const [emailSignatureLang, setEmailSignatureLang] = useState("de")

  const [smtpConfig, setSmtpConfig] = useState({ ...DEFAULT_SMTP_CONFIG })

  // ============================================
  // Changelog State
  // ============================================
  const [changelog, setChangelog] = useState([...DEFAULT_CHANGELOG])
  const [changelogLang, setChangelogLang] = useState("de")
  const [newChangelog, setNewChangelog] = useState({
    version: "",
    date: "",
    color: "#3b82f6",
    content: { en: "", de: "", fr: "", it: "", es: "" },
  })

  // ============================================
  // Access Templates State (from configuration-states)
  // ============================================
  const [demoTemplates, setDemoTemplates] = useState([...DEFAULT_DEMO_TEMPLATES])
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [expandedTemplatePerms, setExpandedTemplatePerms] = useState([])
  const [templatePermTab, setTemplatePermTab] = useState({}) // tracks "studio" or "member" per template id

  // ============================================
  // Helper Functions
  // ============================================

  // Password strength helpers
  const getPasswordStrength = (password) => {
    if (!password) return "None"
    if (password.length < 8) return "Weak"

    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    const strengthFactors = [hasUpper, hasLower, hasNumbers, hasSpecial].filter(Boolean).length

    if (strengthFactors >= 4 && password.length >= 12) return "Strong"
    if (strengthFactors >= 3) return "Good"
    return "Fair"
  }

  const getPasswordStrengthColor = (password) => {
    const strength = getPasswordStrength(password)
    switch (strength) {
      case "Strong": return "bg-green-500"
      case "Good": return "bg-blue-500"
      case "Fair": return "bg-yellow-500"
      case "Weak": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getPasswordStrengthPercent = (password) => {
    const strength = getPasswordStrength(password)
    switch (strength) {
      case "Strong": return 100
      case "Good": return 75
      case "Fair": return 50
      case "Weak": return 25
      default: return 0
    }
  }

  const getPasswordStrengthLabel = (password) => {
    const strength = getPasswordStrength(password)
    switch (strength) {
      case "Strong": return t("admin.configuration.accounts.passwordStrong")
      case "Good": return t("admin.configuration.accounts.passwordGood")
      case "Fair": return t("admin.configuration.accounts.passwordFair")
      case "Weak": return t("admin.configuration.accounts.passwordWeak")
      default: return ""
    }
  }

  const isPasswordFormValid = () => {
    if (!newPassword || newPassword.length < 8) return false
    if (newPassword !== confirmPassword) return false
    return true
  }

  // Navigation helpers
  const navigateToSection = (categoryId, sectionId) => {
    setActiveCategory(categoryId)
    setActiveSection(sectionId)
    if (!expandedCategories.includes(categoryId)) {
      setExpandedCategories([...expandedCategories, categoryId])
    }
    setMobileShowContent(true)
  }

  const toggleCategory = (categoryId) => {
    haptic.light()

    setExpandedCategories(prev =>
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    )
  }

  // Mobile floating + button action per section
  const getMobileAddAction = () => {
    switch (activeSection) {
      case "contract-forms":
        return null // Contract forms require desktop
      case "contract-types":
        return handleAddContractType
      case "pause-reasons":
        return handleAddPauseReason
      case "lead-sources":
        return handleAddLeadSource
      case "demo-templates":
        return handleAddDemoTemplate
      default:
        return null
    }
  }

  const getCurrentSectionTitle = () => {
    for (const cat of navigationItems) {
      const section = cat.sections.find(s => s.id === activeSection)
      if (section) return section.label
    }
    return t("nav.settings")
  }

  // Search filter
  const filteredNavItems = searchQuery
    ? navigationItems.filter(cat =>
        cat.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.sections.some(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : navigationItems

  // Auto-expand matching categories
  useEffect(() => {
    if (searchQuery) {
      const matchingCategories = navigationItems
        .filter(cat =>
          cat.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.sections.some(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .map(cat => cat.id)
      
      setExpandedCategories(prev => [...new Set([...prev, ...matchingCategories])])
    }
  }, [searchQuery])

  const matchesSearch = (text) => {
    if (!searchQuery) return false
    return text.toLowerCase().includes(searchQuery.toLowerCase())
  }

  const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  const highlightText = (text) => {
    if (!searchQuery) return text
    try {
      const escaped = escapeRegex(searchQuery)
      const regex = new RegExp(`(${escaped})`, 'gi')
      const parts = text.split(regex)
      return parts.map((part, i) => 
        part.toLowerCase() === searchQuery.toLowerCase() ? (
          <span key={i} className="bg-orange-500/30 text-orange-300 rounded px-0.5">{part}</span>
        ) : part
      )
    } catch {
      return text
    }
  }

  // ============================================
  // Handler Functions
  // ============================================

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setLogoUrl(url)
      setLogo([file])
      toast.success(t("admin.configuration.toast.logoUploaded"))
    }
  }

  const handleChangePassword = (accountId) => {
    if (!isPasswordFormValid()) {
      toast.error(t("admin.configuration.errors.fillPasswordFields"))
      return
    }
    toast.success(t("admin.configuration.toast.passwordChanged"))
    setNewPassword("")
    setConfirmPassword("")
    setChangingPasswordId(null)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
  }

  const handleAddAccount = () => {
    haptic.light()

    if (!newAccount.firstName.trim() || !newAccount.email.trim()) {
      toast.error(t("admin.configuration.errors.fillNameEmail"))
      return
    }
    setAccounts([...accounts, {
      id: Date.now(),
      firstName: newAccount.firstName.trim(),
      lastName: newAccount.lastName.trim(),
      email: newAccount.email.trim(),
      password: "",
      isPrimary: false,
      createdAt: new Date().toISOString().split("T")[0],
    }])
    setNewAccount({ firstName: "", lastName: "", email: "", password: "" })
    setAddingAccount(false)
    toast.success(t("admin.configuration.toast.accountCreated"))
  }

  const handleUpdateAccount = (id, field, value) => {
    setAccounts(accounts.map(a => a.id === id ? { ...a, [field]: value } : a))
  }

  const handleRemoveAccount = (id) => {
    haptic.warning()

    const account = accounts.find(a => a.id === id)
    if (account?.isPrimary) {
      toast.error(t("admin.configuration.errors.primaryAdminCannotRemove"))
      return
    }
    Modal.confirm({
      title: t("admin.configuration.accounts.removeAccount"),
      content: t("admin.configuration.accounts.removeAccountConfirm", { name: `${account?.firstName} ${account?.lastName}` }),
      okText: t("common.remove"),
      okType: "danger",
      onOk: () => {
        setAccounts(accounts.filter(a => a.id !== id))
        if (editingAccountId === id) setEditingAccountId(null)
        toast.success(t("admin.configuration.toast.accountRemoved"))
      },
    })
  }

  const handleAddContractType = () => {
    haptic.light()

    setEditingContractType({
      id: Date.now(),
      name: "",
      duration: 12,
      cost: 0,
      billingPeriod: "monthly",
      autoRenewal: false,
      renewalPeriod: 0,
      renewalPrice: 0,
      renewalIndefinite: false,
      cancellationPeriod: 30,
      contractFormId: null,
      accessTemplateId: null,
    })
    setEditingContractTypeIndex(null)
    setContractTypeModalVisible(true)
  }

  const handleEditContractType = (type, index) => {
    setEditingContractType({ ...type })
    setEditingContractTypeIndex(index)
    setContractTypeModalVisible(true)
  }

  const handleSaveContractType = () => {
    haptic.success()

    if (!editingContractType.name.trim()) {
      toast.error(t("admin.configuration.errors.enterContractName"))
      return
    }
    if (!editingContractType.duration || editingContractType.duration < 1) {
      toast.error(t("admin.configuration.errors.enterValidDuration"))
      return
    }
    if (!editingContractType.billingPeriod) {
      toast.error(t("admin.configuration.errors.selectBillingPeriod"))
      return
    }
    if (contractForms.length === 0) {
      toast.error(t("admin.configuration.errors.createContractFormFirst"))
      return
    }
    if (!editingContractType.contractFormId) {
      toast.error(t("admin.configuration.errors.selectContractForm"))
      return
    }
    
    if (editingContractTypeIndex !== null) {
      const updated = [...contractTypes]
      updated[editingContractTypeIndex] = editingContractType
      setContractTypes(updated)
      toast.success(t("admin.configuration.toast.contractTypeUpdated"))
    } else {
      setContractTypes([...contractTypes, editingContractType])
      toast.success(t("admin.configuration.toast.contractTypeCreated"))
    }
    
    setContractTypeModalVisible(false)
    setEditingContractType(null)
    setEditingContractTypeIndex(null)
  }

  const handleDeleteContractType = (index) => {
    haptic.warning()

    const type = contractTypes[index]
    Modal.confirm({
      title: t("admin.configuration.contracts.deleteContractType"),
      content: t("admin.configuration.contracts.deleteContractTypeConfirm", { name: type.name || t("admin.configuration.contracts.thisContractType") }),
      okText: t("common.delete"),
      okType: "danger",
      onOk: () => {
        setContractTypes(contractTypes.filter((_, i) => i !== index))
        toast.success(t("admin.configuration.toast.contractTypeDeleted"))
      }
    })
  }

  const handleAddPauseReason = () => {
    haptic.light()

    setContractPauseReasons([...contractPauseReasons, { name: "", maxDays: 30 }])
  }

  const handleRemovePauseReason = (index) => {
    haptic.warning()

    const reason = contractPauseReasons[index]
    Modal.confirm({
      title: t("admin.configuration.contracts.deletePauseReason"),
      content: t("admin.configuration.contracts.deletePauseReasonConfirm", { name: reason?.name || t("admin.configuration.contracts.thisReason") }),
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        setContractPauseReasons(contractPauseReasons.filter((_, i) => i !== index))
        toast.success(t("admin.configuration.toast.pauseReasonDeleted"))
      }
    })
  }

  const handleCreateContractForm = () => {
    haptic.light()

    if (!newContractFormName.trim()) {
      toast.error(t("admin.configuration.errors.enterName"))
      return
    }
    const newForm = {
      id: Date.now(),
      name: newContractFormName.trim(),
      pages: [{ id: 1, title: 'Contract Page 1', elements: [] }],
      createdAt: new Date().toISOString()
    }
    setContractForms([...contractForms, newForm])
    setSelectedContractForm(newForm)
    setNewContractFormName("")
    setShowCreateFormModal(false)
    setContractBuilderModalVisible(true)
    toast.success(t("admin.configuration.toast.contractFormCreated"))
  }

  const handleAddLeadSource = () => {
    haptic.light()

    setLeadSources([
      ...leadSources,
      {
        id: Date.now(),
        name: "",
        color: "#3B82F6",
      },
    ])
    toast.success(t("admin.configuration.toast.leadSourceAdded"))
  }

  const handleRemoveLeadSource = (id) => {
    haptic.warning()

    const source = leadSources.find(s => s.id === id)
    Modal.confirm({
      title: t("admin.configuration.resources.deleteLeadSource"),
      content: t("admin.configuration.resources.deleteLeadSourceConfirm", { name: source?.name || t("admin.configuration.resources.thisSource") }),
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        setLeadSources(leadSources.filter(s => s.id !== id))
        toast.success(t("admin.configuration.toast.leadSourceDeleted"))
      }
    })
  }

  const handleUpdateLeadSource = (id, field, value) => {
    setLeadSources(leadSources.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const testEmailConnection = () => {
    if (!smtpConfig.smtpServer || !smtpConfig.smtpUser) {
      toast.error(t("admin.configuration.errors.fillSmtpFields"))
      return
    }
    toast.info(t("admin.configuration.toast.testingConnection"))
    setTimeout(() => {
      toast.success(t("admin.configuration.toast.connectionSuccess"))
    }, 1500)
  }

  const addChangelogEntry = () => {
    const hasContent = Object.values(newChangelog.content).some(v => v?.trim())
    if (!newChangelog.version || !newChangelog.date || !hasContent) {
      toast.error(t("admin.configuration.errors.fillChangelogFields"))
      return
    }
    setChangelog([{ ...newChangelog, content: { ...newChangelog.content }, id: Date.now() }, ...changelog])
    setNewChangelog({ version: "", date: "", color: newChangelog.color, content: { en: "", de: "", fr: "", it: "", es: "" } })
    toast.success(t("admin.configuration.toast.changelogAdded"))
  }

  const removeChangelogEntry = (index) => {
    const entry = changelog[index]
    Modal.confirm({
      title: t("admin.configuration.changelog.deleteEntry"),
      content: t("admin.configuration.changelog.deleteEntryConfirm", { version: entry?.version || t("admin.configuration.changelog.thisEntry") }),
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        setChangelog(changelog.filter((_, i) => i !== index))
        toast.success(t("admin.configuration.toast.changelogDeleted"))
      }
    })
  }

  // ============================================
  // Access Template Handlers
  // ============================================
  const handleAddDemoTemplate = () => {
    haptic.light()

    const newTemplate = {
      id: Date.now(),
      name: "",
      description: "",
      color: "#3b82f6",
      studioPermissions: Object.fromEntries(DEMO_MENU_ITEMS.map(m => [m.key, false])),
      memberViewPermissions: Object.fromEntries(MEMBER_VIEW_MENU_ITEMS.map(m => [m.key, false])),
    }
    setDemoTemplates([...demoTemplates, newTemplate])
    setEditingTemplate(newTemplate.id)
  }

  const handleUpdateDemoTemplate = (id, field, value) => {
    setDemoTemplates(demoTemplates.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  const handleToggleTemplatePermission = (id, key, permType = "studioPermissions") => {
    setDemoTemplates(demoTemplates.map(t => {
      if (t.id !== id) return t
      return { ...t, [permType]: { ...t[permType], [key]: !t[permType][key] } }
    }))
  }

  const handleToggleAllPermissions = (id, value, permType = "studioPermissions") => {
    const menuItems = permType === "memberViewPermissions" ? MEMBER_VIEW_MENU_ITEMS : DEMO_MENU_ITEMS
    setDemoTemplates(demoTemplates.map(t => {
      if (t.id !== id) return t
      return { ...t, [permType]: Object.fromEntries(menuItems.map(m => [m.key, value])) }
    }))
  }

  const handleRemoveDemoTemplate = (id) => {
    haptic.warning()

    Modal.confirm({
      title: t("admin.configuration.templates.removeTemplate"),
      content: t("admin.configuration.templates.removeTemplateConfirm"),
      okText: t("common.remove"),
      okType: "danger",
      onOk: () => {
        setDemoTemplates(demoTemplates.filter(t => t.id !== id))
        if (editingTemplate === id) setEditingTemplate(null)
      }
    })
  }

  const handleDuplicateDemoTemplate = (template) => {
    const duplicate = {
      ...template,
      id: Date.now(),
      name: `${template.name} (${t("common.copy")})`,
      studioPermissions: { ...template.studioPermissions },
      memberViewPermissions: { ...template.memberViewPermissions },
    }
    setDemoTemplates([...demoTemplates, duplicate])
    setEditingTemplate(duplicate.id)
    toast.success(t("admin.configuration.toast.templateDuplicated"))
  }

  // ============================================
  // Render Section Content
  // ============================================
  const renderSectionContent = () => {
    switch (activeSection) {
      // ========================
      // ACCOUNTS SECTION
      // ========================
      case "accounts":
        return (
          <div className="space-y-6">
            <SectionHeader title={t("admin.configuration.accounts.title")} description={t("admin.configuration.accounts.description")} />

            {/* Logo Upload */}
            <SettingsCard>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-28 h-28 rounded-2xl overflow-hidden bg-[#141414] flex-shrink-0 shadow-lg">
                  <img 
                    src={logoUrl || defaultLogoUrl} 
                    alt={t("admin.configuration.accounts.profile")} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = defaultLogoUrl }}
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-white font-medium mb-2">{t("admin.configuration.accounts.platformLogo")}</h3>
                  <p className="text-sm text-gray-400 mb-4">{t("admin.configuration.accounts.uploadLogoDesc")}</p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <label className="px-4 py-2 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F] cursor-pointer transition-colors flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      {logo.length > 0 ? t("admin.configuration.accounts.changeLogo") : t("admin.configuration.accounts.uploadLogo")}
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                    {logo.length > 0 && (
                      <button
                        onClick={() => { setLogo([]); setLogoUrl("") }}
                        className="px-4 py-2 text-red-400 text-sm hover:bg-red-500/10 rounded-xl transition-colors"
                      >
                        {t("common.remove")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </SettingsCard>

            {/* Primary Admin */}
            {accounts.filter(a => a.isPrimary).map((account) => {
              const isEditing = editingAccountId === account.id
              const isChangingPw = changingPasswordId === account.id
              return (
                <SettingsCard key={account.id}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{t("admin.configuration.accounts.primaryAdmin")}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 font-medium">{t("admin.configuration.accounts.cannotBeRemoved")}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditingAccountId(isEditing ? null : account.id)}
                      className={`p-2 rounded-lg transition-colors ${isEditing ? "bg-orange-500/20 text-orange-400" : "text-gray-500 hover:bg-[#2F2F2F] hover:text-white"}`}
                    >
                      {isEditing ? <Check className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    </button>
                  </div>

                  {isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField
                        label={t("admin.configuration.accounts.firstName")}
                        value={account.firstName}
                        onChange={(v) => handleUpdateAccount(account.id, "firstName", v)}
                        placeholder={t("admin.configuration.accounts.firstNamePlaceholder")}
                        icon={User}
                      />
                      <InputField
                        label={t("admin.configuration.accounts.lastName")}
                        value={account.lastName}
                        onChange={(v) => handleUpdateAccount(account.id, "lastName", v)}
                        placeholder={t("admin.configuration.accounts.lastNamePlaceholder")}
                        icon={User}
                      />
                      <div className="sm:col-span-2">
                        <InputField
                          label={t("admin.configuration.accounts.email")}
                          value={account.email}
                          onChange={(v) => handleUpdateAccount(account.id, "email", v)}
                          placeholder="admin@company.com"
                          type="email"
                          icon={AtSign}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">{t("admin.configuration.accounts.name")}</span>
                        <p className="text-white text-sm mt-1">{account.firstName} {account.lastName}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">{t("admin.configuration.accounts.email")}</span>
                        <p className="text-white text-sm mt-1">{account.email}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">{t("common.created")}</span>
                        <p className="text-white text-sm mt-1">{account.createdAt ? dayjs(account.createdAt).format("MMM D, YYYY") : "—"}</p>
                      </div>
                    </div>
                  )}

                  {/* Password Change */}
                  <div className="mt-4 pt-4 border-t border-[#2F2F2F]">
                    {isChangingPw ? (
                      <div className="max-w-md space-y-3">
                        <h4 className="text-sm font-medium text-gray-300">{t("admin.configuration.accounts.changePassword")}</h4>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-gray-300">{t("admin.configuration.accounts.newPassword")}</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                              type={showNewPassword ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder={t("admin.configuration.accounts.enterNewPassword")}
                              className="w-full bg-[#141414] text-white rounded-xl pl-10 pr-12 py-2.5 text-sm outline-none border border-[#333333] focus:border-orange-500/50"
                            />
                            <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-gray-300">{t("admin.configuration.accounts.confirmPassword")}</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder={t("admin.configuration.accounts.confirmNewPassword")}
                              className="w-full bg-[#141414] text-white rounded-xl pl-10 pr-12 py-2.5 text-sm outline-none border border-[#333333] focus:border-orange-500/50"
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        {newPassword && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>{t("admin.configuration.accounts.strength")}:</span>
                              <span>{getPasswordStrengthLabel(newPassword)}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-1.5">
                              <div className={`h-1.5 rounded-full transition-all ${getPasswordStrengthColor(newPassword)}`} style={{ width: `${getPasswordStrengthPercent(newPassword)}%` }} />
                            </div>
                          </div>
                        )}
                        {confirmPassword && newPassword !== confirmPassword && (
                          <p className="text-xs text-red-400">{t("admin.configuration.accounts.passwordsDoNotMatch")}</p>
                        )}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleChangePassword(account.id)}
                            disabled={!isPasswordFormValid()}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isPasswordFormValid() ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-[#333333] text-gray-500 cursor-not-allowed"}`}
                          >
                            {t("admin.configuration.accounts.savePassword")}
                          </button>
                          <button
                            onClick={() => { setChangingPasswordId(null); setNewPassword(""); setConfirmPassword(""); setShowNewPassword(false); setShowConfirmPassword(false) }}
                            className="px-4 py-2 text-gray-400 text-sm hover:text-white transition-colors"
                          >
                            {t("common.cancel")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setChangingPasswordId(account.id)}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        <Lock className="w-4 h-4" />
                        {t("admin.configuration.accounts.changePassword")}
                      </button>
                    )}
                  </div>
                </SettingsCard>
              )
            })}

            {/* Team Accounts */}
            <SettingsCard>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-medium">{t("admin.configuration.accounts.teamAccounts")}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{t("admin.configuration.accounts.additionalAccounts", { count: accounts.filter(a => !a.isPrimary).length })}</p>
                </div>
                <button
                  onClick={() => setAddingAccount(true)}
                  className="px-3 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {t("admin.configuration.accounts.addAccount")}
                </button>
              </div>

              {/* Add Account Form */}
              {addingAccount && (
                <div className="p-4 mb-4 bg-[#141414] rounded-xl border border-orange-500/20 space-y-3">
                  <h4 className="text-sm font-medium text-white">{t("admin.configuration.accounts.newAccount")}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InputField
                      label={t("admin.configuration.accounts.firstName")}
                      value={newAccount.firstName}
                      onChange={(v) => setNewAccount({ ...newAccount, firstName: v })}
                      placeholder={t("admin.configuration.accounts.firstNamePlaceholder")}
                      required
                    />
                    <InputField
                      label={t("admin.configuration.accounts.lastName")}
                      value={newAccount.lastName}
                      onChange={(v) => setNewAccount({ ...newAccount, lastName: v })}
                      placeholder={t("admin.configuration.accounts.lastNamePlaceholder")}
                    />
                    <div className="sm:col-span-2">
                      <InputField
                        label={t("admin.configuration.accounts.email")}
                        value={newAccount.email}
                        onChange={(v) => setNewAccount({ ...newAccount, email: v })}
                        placeholder={t("admin.configuration.accounts.emailPlaceholder")}
                        type="email"
                        icon={AtSign}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleAddAccount}
                      disabled={!newAccount.firstName.trim() || !newAccount.email.trim()}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        newAccount.firstName.trim() && newAccount.email.trim()
                          ? "bg-orange-500 text-white hover:bg-orange-600"
                          : "bg-[#333333] text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {t("admin.configuration.accounts.createAccount")}
                    </button>
                    <button
                      onClick={() => { setAddingAccount(false); setNewAccount({ firstName: "", lastName: "", email: "", password: "" }) }}
                      className="px-4 py-2 text-gray-400 text-sm hover:text-white transition-colors"
                    >
                      {t("common.cancel")}
                    </button>
                  </div>
                </div>
              )}

              {/* Account List */}
              <div className="space-y-2">
                {accounts.filter(a => !a.isPrimary).length === 0 && !addingAccount ? (
                  <div className="text-center py-8 text-gray-400">
                    <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">{t("admin.configuration.accounts.noTeamAccounts")}</p>
                    <p className="text-xs text-gray-500 mt-1">{t("admin.configuration.accounts.noTeamAccountsDesc")}</p>
                  </div>
                ) : (
                  accounts.filter(a => !a.isPrimary).map((account) => {
                    const isEditing = editingAccountId === account.id
                    const isChangingPw = changingPasswordId === account.id
                    return (
                      <div key={account.id} className="p-3 bg-[#141414] rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-xs">{(account.firstName?.[0] || "").toUpperCase()}{(account.lastName?.[0] || "").toUpperCase()}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            {isEditing ? (
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <input
                                  type="text"
                                  value={account.firstName}
                                  onChange={(e) => handleUpdateAccount(account.id, "firstName", e.target.value)}
                                  placeholder={t("admin.configuration.accounts.firstNamePlaceholder")}
                                  className="bg-[#1C1C1C] text-white rounded-lg px-3 py-1.5 text-sm outline-none border border-[#333333] focus:border-orange-500/50"
                                />
                                <input
                                  type="text"
                                  value={account.lastName}
                                  onChange={(e) => handleUpdateAccount(account.id, "lastName", e.target.value)}
                                  placeholder={t("admin.configuration.accounts.lastNamePlaceholder")}
                                  className="bg-[#1C1C1C] text-white rounded-lg px-3 py-1.5 text-sm outline-none border border-[#333333] focus:border-orange-500/50"
                                />
                                <input
                                  type="email"
                                  value={account.email}
                                  onChange={(e) => handleUpdateAccount(account.id, "email", e.target.value)}
                                  placeholder={t("admin.configuration.accounts.email")}
                                  className="bg-[#1C1C1C] text-white rounded-lg px-3 py-1.5 text-sm outline-none border border-[#333333] focus:border-orange-500/50"
                                />
                              </div>
                            ) : (
                              <>
                                <p className="text-white text-sm font-medium truncate">{account.firstName} {account.lastName}</p>
                                <p className="text-xs text-gray-500 truncate">{account.email}</p>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => { setChangingPasswordId(isChangingPw ? null : account.id); if (!isChangingPw) { setNewPassword(""); setConfirmPassword("") } }}
                              className={`p-1.5 rounded-lg transition-colors ${isChangingPw ? "text-orange-400 bg-orange-500/10" : "text-gray-500 hover:text-white hover:bg-[#2F2F2F]"}`}
                              title={t("admin.configuration.accounts.changePassword")}
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingAccountId(isEditing ? null : account.id)}
                              className={`p-1.5 rounded-lg transition-colors ${isEditing ? "bg-orange-500/20 text-orange-400" : "text-gray-500 hover:bg-[#2F2F2F] hover:text-white"}`}
                            >
                              {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleRemoveAccount(account.id)}
                              className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Inline Password Change */}
                        {isChangingPw && (
                          <div className="mt-3 pt-3 border-t border-[#2F2F2F] space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-400">New Password</label>
                                <div className="relative">
                                  <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder={t("admin.configuration.accounts.minCharacters")}
                                    className="w-full bg-[#1C1C1C] text-white rounded-lg px-3 pr-9 py-1.5 text-sm outline-none border border-[#333333] focus:border-orange-500/50"
                                  />
                                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                                    {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-400">{t("admin.configuration.accounts.confirm")}</label>
                                <div className="relative">
                                  <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder={t("admin.configuration.accounts.repeatPassword")}
                                    className="w-full bg-[#1C1C1C] text-white rounded-lg px-3 pr-9 py-1.5 text-sm outline-none border border-[#333333] focus:border-orange-500/50"
                                  />
                                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              </div>
                            </div>
                            {confirmPassword && newPassword !== confirmPassword && (
                              <p className="text-xs text-red-400">Passwords do not match</p>
                            )}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleChangePassword(account.id)}
                                disabled={!isPasswordFormValid()}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isPasswordFormValid() ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-[#333333] text-gray-500 cursor-not-allowed"}`}
                              >
                                Save
                              </button>
                              <button
                                onClick={() => { setChangingPasswordId(null); setNewPassword(""); setConfirmPassword("") }}
                                className="px-3 py-1.5 text-gray-400 text-xs hover:text-white transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </SettingsCard>

            {/* Security Tips */}
            <SettingsCard className="bg-[#181818]">
              <h4 className="text-white font-medium mb-3">{t("admin.configuration.accounts.securityTips")}</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  {t("admin.configuration.accounts.securityTip1")}
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  {t("admin.configuration.accounts.securityTip2")}
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  {t("admin.configuration.accounts.securityTip3")}
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  {t("admin.configuration.accounts.securityTip4")}
                </li>
              </ul>
            </SettingsCard>
          </div>
        )

      // ========================
      // PLATFORM SECTIONS
      // ========================
      case "contact-info":
        return (
          <div className="space-y-6">
            <SectionHeader title={t("admin.configuration.contact.title")} description={t("admin.configuration.contact.description")} />
            
            <SettingsCard>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <InputField
                    label={t("admin.configuration.contact.companyName")}
                    value={contactData.companyName}
                    onChange={(v) => setContactData({ ...contactData, companyName: v })}
                    placeholder={t("admin.configuration.contact.companyNamePlaceholder")}
                    icon={Building2}
                  />
                </div>
                <div className="sm:col-span-2">
                  <InputField
                    label={t("admin.configuration.contact.address")}
                    value={contactData.address}
                    onChange={(v) => setContactData({ ...contactData, address: v })}
                    placeholder={t("admin.configuration.contact.addressPlaceholder")}
                    rows={3}
                  />
                </div>
                <InputField
                  label={t("admin.configuration.contact.phone")}
                  value={contactData.phone}
                  onChange={(v) => setContactData({ ...contactData, phone: v })}
                  placeholder="+1 (555) 123-4567"
                  icon={Phone}
                />
                <InputField
                  label={t("admin.configuration.accounts.email")}
                  value={contactData.email}
                  onChange={(v) => setContactData({ ...contactData, email: v })}
                  placeholder="contact@company.com"
                  icon={AtSign}
                  type="email"
                />
                <div className="sm:col-span-2">
                  <InputField
                    label={t("admin.configuration.contact.website")}
                    value={contactData.website}
                    onChange={(v) => setContactData({ ...contactData, website: v })}
                    placeholder="https://www.company.com"
                    icon={Globe}
                  />
                </div>
              </div>
            </SettingsCard>
          </div>
        )

      case "legal-info":
        return (
          <div className="space-y-6">
            <SectionHeader title={t("admin.configuration.legal.title")} description={t("admin.configuration.legal.description")} />
            
            <div className="mb-4">
              <LanguageTabs
                selectedLang={legalLang}
                onSelect={setLegalLang}
                translations={legalInfo.imprint}
              />
            </div>

            <SettingsCard>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">{t("admin.configuration.legal.imprint")}</label>
                  <WysiwygEditor
                    key={`imprint-${legalLang}`}
                    value={legalInfo.imprint?.[legalLang] || ""}
                    onChange={(v) => setLegalInfo({ ...legalInfo, imprint: { ...legalInfo.imprint, [legalLang]: v } })}
                    placeholder={t("admin.configuration.legal.imprintPlaceholder")}
                    showImages={true}
                    minHeight={150}
                  />
                </div>
              </div>
            </SettingsCard>

            <SettingsCard>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">{t("admin.configuration.legal.privacyPolicy")}</label>
                  <WysiwygEditor
                    key={`privacy-${legalLang}`}
                    value={legalInfo.privacyPolicy?.[legalLang] || ""}
                    onChange={(v) => setLegalInfo({ ...legalInfo, privacyPolicy: { ...legalInfo.privacyPolicy, [legalLang]: v } })}
                    placeholder={t("admin.configuration.legal.privacyPolicyPlaceholder")}
                    showImages={true}
                    minHeight={200}
                  />
                </div>
              </div>
            </SettingsCard>

            <SettingsCard>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">{t("admin.configuration.legal.termsAndConditions")}</label>
                  <WysiwygEditor
                    key={`terms-${legalLang}`}
                    value={legalInfo.termsAndConditions?.[legalLang] || ""}
                    onChange={(v) => setLegalInfo({ ...legalInfo, termsAndConditions: { ...legalInfo.termsAndConditions, [legalLang]: v } })}
                    placeholder={t("admin.configuration.legal.termsPlaceholder")}
                    showImages={true}
                    minHeight={200}
                  />
                </div>
              </div>
            </SettingsCard>
          </div>
        )

      // ========================
      // CONTRACTS SECTIONS
      // ========================
      case "contract-forms":
        return (
          <div className="space-y-6">
            {/* Mobile: show notice that contract forms require desktop */}
            <div className="lg:hidden">
              <SettingsCard>
                <div className="text-center py-12 text-gray-400">
                  <Smartphone className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-white mb-2">{t("admin.configuration.contracts.desktopRequired")}</h3>
                  <p className="text-sm">{t("admin.configuration.contracts.desktopRequiredDesc")}</p>
                </div>
              </SettingsCard>
            </div>

            {/* Desktop: full contract form management */}
            <div className="hidden lg:block space-y-6">
            <SectionHeader
              title={t("admin.configuration.contracts.contractForms.title")}
              description={t("admin.configuration.contracts.contractForms.description")}
              action={
                <button
                  onClick={() => setShowCreateFormModal(true)}
                  className="px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {t("admin.configuration.contracts.createForm")}
                </button>
              }
            />
            
            {contractForms.length === 0 ? (
              <SettingsCard>
                <div className="text-center py-12 text-gray-400">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-white mb-2">{t("admin.configuration.contracts.noContractForms")}</h3>
                  <p className="text-sm mb-6">{t("admin.configuration.contracts.noContractFormsDesc")}</p>
                  <button
                    onClick={() => setShowCreateFormModal(true)}
                    className="px-6 py-2.5 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {t("admin.configuration.contracts.createContractForm")}
                  </button>
                </div>
              </SettingsCard>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {contractForms.map((form) => (
                  <div key={form.id} className="bg-[#1F1F1F] rounded-xl overflow-hidden border border-[#333333] hover:border-[#444444] transition-colors group">
                    <div className="p-4 sm:p-5">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          {editingContractFormName.id === form.id ? (
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="text"
                                value={editingContractFormName.value}
                                onChange={(e) => setEditingContractFormName({ ...editingContractFormName, value: e.target.value })}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    setContractForms(contractForms.map(f => 
                                      f.id === form.id ? { ...f, name: editingContractFormName.value.trim() || form.name } : f
                                    ))
                                    setEditingContractFormName({ id: null, value: "" })
                                  }
                                  if (e.key === 'Escape') {
                                    setEditingContractFormName({ id: null, value: "" })
                                  }
                                }}
                                autoFocus
                                className="flex-1 bg-[#141414] text-white text-sm font-medium outline-none border border-[#3F74FF] focus:border-[#3F74FF] rounded-lg px-2 py-1"
                              />
                              <button
                                onClick={() => {
                                  setContractForms(contractForms.map(f => 
                                    f.id === form.id ? { ...f, name: editingContractFormName.value.trim() || form.name } : f
                                  ))
                                  setEditingContractFormName({ id: null, value: "" })
                                }}
                                className="p-1 text-green-400 hover:bg-green-500/10 rounded"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingContractFormName({ id: null, value: "" })}
                                className="p-1 text-red-400 hover:bg-red-500/10 rounded"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <h3 
                              className="text-white font-medium text-sm sm:text-base cursor-pointer hover:text-orange-400 transition-colors"
                              onClick={() => setEditingContractFormName({ id: form.id, value: form.name })}
                              title={t("admin.configuration.contracts.clickToEditName")}
                            >
                              {form.name}
                            </h3>
                          )}
                          <div className="flex gap-1">
                            <button
                              onClick={() => setContractForms([...contractForms, {
                                ...form,
                                id: Date.now(),
                                name: `${form.name} (${t("common.copy")})`,
                                createdAt: new Date().toISOString()
                              }])}
                              className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded transition-colors"
                              title={t("common.duplicate")}
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                Modal.confirm({
                                  title: t("admin.configuration.contracts.deleteContractForm"),
                                  content: t("admin.configuration.contracts.deleteContractFormConfirm", { name: form.name }),
                                  okText: "Delete",
                                  okType: "danger",
                                  onOk: () => {
                                    setContractForms(contractForms.filter(f => f.id !== form.id))
                                    toast.success(t("admin.configuration.toast.contractFormDeleted"))
                                  }
                                })
                              }}
                              className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                              title={t("common.delete")}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {t("common.created")}: {new Date(form.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {t("admin.configuration.contracts.pageCount", { count: form.pages?.length || 1 })}
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-[#141414] border-t border-[#333333]">
                      <button
                        onClick={() => {
                          setSelectedContractForm(form)
                          setContractBuilderModalVisible(true)
                        }}
                        className="w-full px-3 py-2 bg-[#2F2F2F] text-white text-sm rounded-lg hover:bg-[#3F3F3F] transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        {t("admin.configuration.contracts.openBuilder")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            </div>
          </div>
        )

      case "contract-types":
        return (
          <div className="space-y-6">
            <SectionHeader
              title={t("admin.configuration.contracts.contractTypes.title")}
              description={t("admin.configuration.contracts.contractTypes.description")}
              action={
                <button
                  onClick={handleAddContractType}
                  className="px-3 sm:px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("common.add")}</span> {t("admin.configuration.contracts.type")}
                </button>
              }
            />
            
            {contractTypes.length === 0 ? (
              <SettingsCard>
                <div className="text-center py-12 text-gray-400">
                  <RiContractLine className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-white mb-2">{t("admin.configuration.contracts.noContractTypes")}</h3>
                  <p className="text-sm mb-6">{t("admin.configuration.contracts.noContractTypesDesc")}</p>
                  <button
                    onClick={handleAddContractType}
                    className="px-6 py-2.5 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {t("admin.configuration.contracts.createContractType")}
                  </button>
                </div>
              </SettingsCard>
            ) : (
              <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {contractTypes.map((type, index) => (
                  <div
                    key={index}
                    className="bg-[#2A2A2A] rounded-xl overflow-hidden border border-[#333333] hover:border-[#444444] transition-colors group"
                  >
                    {/* Header */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="text-white font-medium truncate">{type.name || t("admin.configuration.contracts.untitled")}</h3>
                        {type.autoRenewal && (
                          <span className="px-2.5 py-1 bg-orange-500 text-white text-xs font-medium rounded-full flex-shrink-0">
                            {t("admin.configuration.contracts.autoRenew")}
                          </span>
                        )}
                      </div>
                      
                      {/* Price highlight */}
                      <div className="mb-4">
                        <span className="text-2xl font-bold text-white">{type.cost}€</span>
                        <span className="text-gray-500 text-sm">/{type.billingPeriod === 'monthly' ? t("admin.configuration.contracts.month") : type.billingPeriod === 'weekly' ? t("admin.configuration.contracts.week") : t("admin.configuration.contracts.year")}</span>
                      </div>
                      
                      {/* Key info */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between text-gray-400">
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {t("admin.configuration.contracts.duration")}
                          </span>
                          <span className="text-white">{t("admin.configuration.contracts.durationMonths", { count: type.duration })}</span>
                        </div>
                        <div className="flex items-center justify-between text-gray-400">
                          <span className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            {t("admin.configuration.contracts.access")}
                          </span>
                          <span className="text-white truncate max-w-[120px]">
                            {type.accessTemplateId ? demoTemplates.find(t => String(t.id) === String(type.accessTemplateId))?.name || t("admin.configuration.contracts.unknown") : t("admin.configuration.contracts.none")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-gray-400">
                          <span className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            {t("admin.configuration.contracts.form")}
                          </span>
                          <span className="text-white truncate max-w-[120px]">
                            {type.contractFormId ? contractForms.find(f => String(f.id) === String(type.contractFormId))?.name || t("admin.configuration.contracts.unknown") : t("admin.configuration.contracts.none")}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="px-4 py-3 bg-[#1F1F1F] border-t border-[#333333] flex gap-2">
                      <button
                        onClick={() => handleEditContractType(type, index)}
                        className="flex-1 px-3 py-2 bg-[#2F2F2F] text-white text-sm rounded-lg hover:bg-[#3A3A3A] transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        {t("common.edit")}
                      </button>
                      <button
                        onClick={() => handleDeleteContractType(index)}
                        className="px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <AdminContractTypeModal
              isOpen={contractTypeModalVisible}
              onClose={() => {
                setContractTypeModalVisible(false)
                setEditingContractType(null)
                setEditingContractTypeIndex(null)
              }}
              editingContractType={editingContractType}
              setEditingContractType={setEditingContractType}
              editingContractTypeIndex={editingContractTypeIndex}
              contractForms={contractForms}
              accessTemplates={demoTemplates}
              currency="€"
              onSave={handleSaveContractType}
            />
          </div>
        )

      case "pause-reasons":
        return (
          <div className="space-y-6">
            <SectionHeader
              title={t("admin.configuration.contracts.pauseReasons.title")}
              description={t("admin.configuration.contracts.pauseReasons.description")}
              action={
                <button
                  onClick={handleAddPauseReason}
                  className="px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {t("admin.configuration.contracts.addReason")}
                </button>
              }
            />
            
            <SettingsCard>
              {contractPauseReasons.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <PauseCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>{t("admin.configuration.contracts.noPauseReasons")}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contractPauseReasons.map((reason, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-[#141414] rounded-xl">
                      <input
                        type="text"
                        value={reason.name}
                        onChange={(e) => {
                          const updated = [...contractPauseReasons]
                          updated[index].name = e.target.value
                          setContractPauseReasons(updated)
                        }}
                        placeholder={t("admin.configuration.contracts.reasonNamePlaceholder")}
                        className="flex-1 bg-transparent text-white text-sm outline-none min-w-0"
                      />
                      <button
                        onClick={() => handleRemovePauseReason(index)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </SettingsCard>
          </div>
        )

      // ========================
      // RESOURCES SECTION
      // ========================
      case "lead-sources":
        return (
          <div className="space-y-6">
            <SectionHeader
              title={t("admin.configuration.resources.leadSources.title")}
              description={t("admin.configuration.resources.leadSources.description")}
              action={
                <button
                  onClick={handleAddLeadSource}
                  className="px-3 sm:px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("common.add")}</span> {t("admin.configuration.resources.source")}
                </button>
              }
            />
            <SettingsCard>
              {leadSources.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>{t("admin.configuration.resources.noLeadSources")}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leadSources.map((source) => (
                    <div key={source.id} className="flex items-center gap-3 p-3 bg-[#141414] rounded-xl">
                      <input
                        type="color"
                        value={source.color}
                        onChange={(e) => handleUpdateLeadSource(source.id, "color", e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer flex-shrink-0 border border-[#333333]"
                      />
                      <input
                        type="text"
                        value={source.name}
                        onChange={(e) => handleUpdateLeadSource(source.id, "name", e.target.value)}
                        placeholder={t("admin.configuration.resources.sourceNamePlaceholder")}
                        className="flex-1 bg-transparent text-white text-sm outline-none min-w-0"
                      />
                      <button
                        onClick={() => handleRemoveLeadSource(source.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </SettingsCard>
          </div>
        )

      // ========================
      // COMMUNICATION SECTIONS
      // ========================
      case "demo-email":
        return (
          <div className="space-y-6">
            <SectionHeader title={t("admin.configuration.communication.accessEmail.title")} description={t("admin.configuration.communication.accessEmail.description")} />
            
            <div className="mb-4">
              <LanguageTabs
                selectedLang={demoEmailLang}
                onSelect={setDemoEmailLang}
                translations={demoEmail.subject}
              />
            </div>

            <SettingsCard>
              <div className="space-y-4">
                <InputField
                  label={t("admin.configuration.communication.emailSubject")}
                  value={demoEmail.subject?.[demoEmailLang] || ""}
                  onChange={(v) => setDemoEmail({ ...demoEmail, subject: { ...demoEmail.subject, [demoEmailLang]: v } })}
                  placeholder={t("admin.configuration.communication.accessEmail.subjectPlaceholder")}
                />

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">{t("admin.configuration.communication.emailContent")}</label>
                  <VariablesRow>
                    <span className="text-xs text-gray-500">{t("admin.configuration.communication.variables")}:</span>
                    {["{Access_Link}", "{Studio_Name}", "{Studio_Owner_First_Name}", "{Studio_Owner_Last_Name}", "{Email_For_Access}", "{Expiry_Date}"].map(v => (
                      <button
                        key={v}
                        onClick={() => setDemoEmail({ ...demoEmail, content: { ...demoEmail.content, [demoEmailLang]: (demoEmail.content?.[demoEmailLang] || "") + v } })}
                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
                      >
                        {v.replace(/{|}/g, "").replace(/_/g, " ")}
                      </button>
                    ))}
                    <span className="text-xs text-gray-500 mx-2">|</span>
                    <span className="text-xs text-gray-500 mr-1">{t("admin.configuration.communication.insert")}:</span>
                    <button
                      onClick={() => {
                        const sig = typeof emailSignature === "object" ? (emailSignature[demoEmailLang] || emailSignature.en || "") : emailSignature
                        if (sig) {
                          setDemoEmail({ ...demoEmail, content: { ...demoEmail.content, [demoEmailLang]: (demoEmail.content?.[demoEmailLang] || "") + sig } })
                        } else {
                          toast.error(t("admin.configuration.toast.noSignatureConfigured"))
                        }
                      }}
                      className="px-2 py-1 bg-orange-500 text-white text-xs rounded-lg hover:bg-orange-600 flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      {t("admin.configuration.communication.emailSignature")}
                    </button>
                  </VariablesRow>
                  <WysiwygEditor
                    key={`demo-email-${demoEmailLang}`}
                    value={demoEmail.content?.[demoEmailLang] || ""}
                    onChange={(v) => setDemoEmail({ ...demoEmail, content: { ...demoEmail.content, [demoEmailLang]: v } })}
                    placeholder={t("admin.configuration.communication.accessEmail.contentPlaceholder")}
                    showImages={true}
                    minHeight={180}
                  />
                </div>

                <NumberInput
                  label={t("admin.configuration.communication.accessEmail.linkExpiry")}
                  value={demoEmail.expiryDays}
                  onChange={(v) => setDemoEmail({ ...demoEmail, expiryDays: v })}
                  min={1}
                  max={30}
                  suffix={t("admin.configuration.communication.days")}
                  helpText={t("admin.configuration.communication.accessEmail.linkExpiryHelp")}
                />

              </div>
            </SettingsCard>
          </div>
        )

      case "registration-email":
        return (
          <div className="space-y-6">
            <SectionHeader title={t("admin.configuration.communication.registrationEmail.title")} description={t("admin.configuration.communication.registrationEmail.description")} />
            
            <div className="mb-4">
              <LanguageTabs
                selectedLang={registrationEmailLang}
                onSelect={setRegistrationEmailLang}
                translations={registrationEmail.subject}
              />
            </div>

            <SettingsCard>
              <div className="space-y-4">
                <InputField
                  label={t("admin.configuration.communication.emailSubject")}
                  value={registrationEmail.subject?.[registrationEmailLang] || ""}
                  onChange={(v) => setRegistrationEmail({ ...registrationEmail, subject: { ...registrationEmail.subject, [registrationEmailLang]: v } })}
                  placeholder={t("admin.configuration.communication.registrationEmail.subjectPlaceholder")}
                />

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">{t("admin.configuration.communication.emailContent")}</label>
                  <VariablesRow>
                    <span className="text-xs text-gray-500">{t("admin.configuration.communication.variables")}:</span>
                    {["{Studio_Name}", "{Studio_Owner_First_Name}", "{Studio_Owner_Last_Name}", "{Email_For_Registration}", "{Registration_Link}", "{Expiry_Date}"].map(v => (
                      <button
                        key={v}
                        onClick={() => setRegistrationEmail({ ...registrationEmail, content: { ...registrationEmail.content, [registrationEmailLang]: (registrationEmail.content?.[registrationEmailLang] || "") + v } })}
                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
                      >
                        {v.replace(/{|}/g, "").replace(/_/g, " ")}
                      </button>
                    ))}
                    <span className="text-xs text-gray-500 mx-2">|</span>
                    <span className="text-xs text-gray-500 mr-1">{t("admin.configuration.communication.insert")}:</span>
                    <button
                      onClick={() => {
                        const sig = typeof emailSignature === "object" ? (emailSignature[registrationEmailLang] || emailSignature.en || "") : emailSignature
                        if (sig) {
                          setRegistrationEmail({ ...registrationEmail, content: { ...registrationEmail.content, [registrationEmailLang]: (registrationEmail.content?.[registrationEmailLang] || "") + sig } })
                        } else {
                          toast.error(t("admin.configuration.toast.noSignatureConfigured"))
                        }
                      }}
                      className="px-2 py-1 bg-orange-500 text-white text-xs rounded-lg hover:bg-orange-600 flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      {t("admin.configuration.communication.emailSignature")}
                    </button>
                  </VariablesRow>
                  <WysiwygEditor
                    key={`reg-email-${registrationEmailLang}`}
                    value={registrationEmail.content?.[registrationEmailLang] || ""}
                    onChange={(v) => setRegistrationEmail({ ...registrationEmail, content: { ...registrationEmail.content, [registrationEmailLang]: v } })}
                    placeholder={t("admin.configuration.communication.registrationEmail.contentPlaceholder")}
                    showImages={true}
                    minHeight={180}
                  />
                </div>

                <NumberInput
                  label={t("admin.configuration.communication.registrationEmail.linkExpiry")}
                  value={registrationEmail.expiryHours}
                  onChange={(v) => setRegistrationEmail({ ...registrationEmail, expiryHours: v })}
                  min={1}
                  max={168}
                  suffix={t("admin.configuration.communication.hours")}
                  helpText={t("admin.configuration.communication.registrationEmail.linkExpiryHelp")}
                />

              </div>
            </SettingsCard>
          </div>
        )

      case "email-signature":
        return (
          <div className="space-y-6">
            <SectionHeader title={t("admin.configuration.communication.signature.title")} description={t("admin.configuration.communication.signature.description")} />
            
            <div className="mb-4">
              <LanguageTabs
                selectedLang={emailSignatureLang}
                onSelect={setEmailSignatureLang}
                translations={emailSignature}
              />
            </div>

            <SettingsCard>
              <div className="space-y-3">
                <p className="text-sm text-gray-400">
                  {t("admin.configuration.communication.signature.helpText")}
                </p>
                <WysiwygEditor
                  key={`signature-${emailSignatureLang}`}
                  value={emailSignature[emailSignatureLang] || ""}
                  onChange={(v) => setEmailSignature(prev => ({ ...prev, [emailSignatureLang]: v }))}
                  placeholder={t("admin.configuration.communication.signature.placeholder")}
                  showImages={true}
                  minHeight={120}
                />
              </div>
            </SettingsCard>
          </div>
        )

      case "smtp-setup":
        return (
          <div className="space-y-6">
            <SectionHeader title={t("admin.configuration.communication.smtp.title")} description={t("admin.configuration.communication.smtp.description")} />
            
            <SettingsCard>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label={t("admin.configuration.communication.smtp.server")}
                    value={smtpConfig.smtpServer}
                    onChange={(v) => setSmtpConfig({ ...smtpConfig, smtpServer: v })}
                    placeholder="smtp.example.com"
                    icon={Server}
                  />
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">{t("admin.configuration.communication.smtp.port")}</label>
                    <input
                      type="number"
                      value={smtpConfig.smtpPort}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, smtpPort: Number(e.target.value) })}
                      placeholder="587"
                      className="w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                    />
                  </div>
                  <InputField
                    label={t("admin.configuration.communication.smtp.emailUsername")}
                    value={smtpConfig.smtpUser}
                    onChange={(v) => setSmtpConfig({ ...smtpConfig, smtpUser: v })}
                    placeholder="studio@example.com"
                    icon={AtSign}
                  />
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">{t("admin.configuration.communication.smtp.password")}</label>
                    <input
                      type="password"
                      value={smtpConfig.smtpPass}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, smtpPass: e.target.value })}
                      placeholder={t("admin.configuration.communication.smtp.passwordPlaceholder")}
                      className="w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                    />
                  </div>
                  <InputField
                    label={t("admin.configuration.communication.smtp.senderName")}
                    value={smtpConfig.senderName}
                    onChange={(v) => setSmtpConfig({ ...smtpConfig, senderName: v })}
                    placeholder={t("admin.configuration.communication.smtp.senderNamePlaceholder")}
                  />
                  <div className="flex items-end">
                    <Toggle
                      label={t("admin.configuration.communication.smtp.useSSL")}
                      checked={smtpConfig.useSSL}
                      onChange={(v) => setSmtpConfig({ ...smtpConfig, useSSL: v })}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={testEmailConnection}
                    className="px-4 py-2 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F] transition-colors flex items-center gap-2"
                  >
                    <Server className="w-4 h-4" />
                    {t("admin.configuration.communication.smtp.testConnection")}
                  </button>
                  <button className="px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    {t("admin.configuration.communication.smtp.sendTestEmail")}
                  </button>
                </div>
              </div>
            </SettingsCard>

            {/* SMTP Help */}
            <SettingsCard className="bg-[#181818]">
              <h4 className="text-white font-medium mb-3">{t("admin.configuration.communication.smtp.commonSettings")}</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex gap-3">
                  <span className="text-orange-400 font-medium w-24 flex-shrink-0">Gmail</span>
                  <span>smtp.gmail.com : 587 (TLS) or 465 (SSL)</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-orange-400 font-medium w-24 flex-shrink-0">Outlook</span>
                  <span>smtp.office365.com : 587 (TLS)</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-orange-400 font-medium w-24 flex-shrink-0">Yahoo</span>
                  <span>smtp.mail.yahoo.com : 587 (TLS)</span>
                </div>
              </div>
            </SettingsCard>
          </div>
        )

      // ========================
      // CHANGELOG SECTION
      // ========================
      case "version-history":
        return (
          <div className="space-y-6">
            <SectionHeader title={t("admin.configuration.changelog.title")} description={t("admin.configuration.changelog.description")} />
            
            {/* Add New Entry */}
            <SettingsCard>
              <h3 className="text-white font-medium mb-4">{t("admin.configuration.changelog.addNewEntry")}</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                  <InputField
                    label={t("admin.configuration.changelog.version")}
                    value={newChangelog.version}
                    onChange={(v) => setNewChangelog({ ...newChangelog, version: v })}
                    placeholder="e.g., 2.1.0"
                  />
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">{t("admin.configuration.changelog.releaseDate")}</label>
                    <input
                      type="date"
                      value={newChangelog.date}
                      onChange={(e) => setNewChangelog({ ...newChangelog, date: e.target.value })}
                      className="w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">{t("admin.configuration.changelog.accentColor")}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={newChangelog.color}
                        onChange={(e) => setNewChangelog({ ...newChangelog, color: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-[#333333] p-1"
                      />
                      <span className="text-xs text-gray-500 font-mono uppercase">{newChangelog.color}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">{t("admin.configuration.changelog.details")}</label>
                  <div className="mb-2">
                    <LanguageTabs
                      selectedLang={changelogLang}
                      onSelect={setChangelogLang}
                      translations={newChangelog.content}
                    />
                  </div>
                  <WysiwygEditor
                    key={`changelog-new-${changelogLang}`}
                    value={newChangelog.content?.[changelogLang] || ""}
                    onChange={(v) => setNewChangelog({ ...newChangelog, content: { ...newChangelog.content, [changelogLang]: v } })}
                    placeholder={t("admin.configuration.changelog.detailsPlaceholder")}
                    showImages={true}
                    minHeight={120}
                  />
                </div>

                <button
                  onClick={addChangelogEntry}
                  disabled={!newChangelog.version || !newChangelog.date || !Object.values(newChangelog.content).some(v => v?.trim())}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    newChangelog.version && newChangelog.date && Object.values(newChangelog.content).some(v => v?.trim())
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-[#333333] text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {t("admin.configuration.changelog.addEntry")}
                </button>
              </div>
            </SettingsCard>

            {/* Changelog Entries */}
            <SettingsCard>
              <h3 className="text-white font-medium mb-4">{t("admin.configuration.changelog.entries")}</h3>
              {changelog.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>{t("admin.configuration.changelog.noEntries")}</p>
                  <p className="text-sm mt-1">{t("admin.configuration.changelog.noEntriesDesc")}</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {changelog.map((entry, index) => (
                    <div
                      key={entry.id || index}
                      className="p-4 bg-[#141414] rounded-xl"
                      style={{ borderLeft: `4px solid ${entry.color}` }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-white font-semibold">{t("admin.configuration.changelog.version")} {entry.version}</span>
                            <span className="text-gray-500 text-sm">
                              {entry.date ? dayjs(entry.date).format("MMMM D, YYYY") : t("admin.configuration.changelog.noDate")}
                            </span>
                          </div>
                          <div
                            className="text-gray-300 text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: typeof entry.content === "object" ? (entry.content[changelogLang] || entry.content.en || Object.values(entry.content).find(v => v?.trim()) || "") : entry.content }}
                          />
                        </div>
                        <button
                          onClick={() => removeChangelogEntry(index)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SettingsCard>
          </div>
        )

      // ========================
      // ACCESS TEMPLATES SECTIONS
      // ========================
      case "demo-templates":
        return (
          <div className="space-y-6">
            <SectionHeader
              title={t("admin.configuration.templates.title")}
              description={t("admin.configuration.templates.description")}
              action={
                <button
                  onClick={handleAddDemoTemplate}
                  className="px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {t("admin.configuration.templates.newTemplate")}
                </button>
              }
            />

            {demoTemplates.length === 0 ? (
              <SettingsCard>
                <div className="text-center py-8 text-gray-400">
                  <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>{t("admin.configuration.templates.noTemplates")}</p>
                  <p className="text-sm mt-1">{t("admin.configuration.templates.noTemplatesDesc")}</p>
                </div>
              </SettingsCard>
            ) : (
              <div className="space-y-3">
                {demoTemplates.map((template) => {
                  const isEditing = editingTemplate === template.id
                  const isExpanded = expandedTemplatePerms.includes(template.id)
                  const studioEnabledCount = Object.values(template.studioPermissions || {}).filter(Boolean).length
                  const studioTotalCount = DEMO_MENU_ITEMS.length
                  const memberEnabledCount = Object.values(template.memberViewPermissions || {}).filter(Boolean).length
                  const memberTotalCount = MEMBER_VIEW_MENU_ITEMS.length
                  const activePermTab = templatePermTab[template.id] || "studio"

                  return (
                    <SettingsCard key={template.id} className="!p-4">
                      {/* Compact header row */}
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${template.color}20` }}
                        >
                          <Shield className="w-4 h-4" style={{ color: template.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-white font-medium text-sm truncate">{template.name || t("admin.configuration.templates.unnamedTemplate")}</h3>
                            <span className="text-xs px-1.5 py-0.5 rounded-md bg-[#2F2F2F] text-gray-400 flex-shrink-0" title="Studio View">S: {studioEnabledCount}/{studioTotalCount}</span>
                            <span className="text-xs px-1.5 py-0.5 rounded-md bg-[#2F2F2F] text-gray-400 flex-shrink-0" title="Member View">M: {memberEnabledCount}/{memberTotalCount}</span>
                          </div>
                          {template.description && !isEditing && (
                            <p className="text-xs text-gray-500 truncate mt-0.5">{template.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          <button
                            onClick={() => setExpandedTemplatePerms(prev => 
                              prev.includes(template.id) ? prev.filter(id => id !== template.id) : [...prev, template.id]
                            )}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isExpanded ? "text-orange-400 bg-orange-500/10" : "text-gray-500 hover:text-white hover:bg-[#2F2F2F]"
                            }`}
                            title={t("admin.configuration.templates.togglePermissions")}
                          >
                            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </button>
                          <button
                            onClick={() => setEditingTemplate(isEditing ? null : template.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isEditing ? "bg-orange-500/20 text-orange-400" : "text-gray-500 hover:bg-[#2F2F2F] hover:text-white"
                            }`}
                          >
                            {isEditing ? <Check className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDuplicateDemoTemplate(template)}
                            className="p-1.5 text-gray-500 hover:bg-[#2F2F2F] hover:text-white rounded-lg transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveDemoTemplate(template.id)}
                            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Edit fields (shown when editing) */}
                      {isEditing && (
                        <div className="mt-3 pt-3 border-t border-[#2F2F2F] space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <InputField
                              label={t("admin.configuration.templates.templateName")}
                              value={template.name}
                              onChange={(v) => handleUpdateDemoTemplate(template.id, "name", v)}
                              placeholder="e.g. Full Access, Basic View..."
                              required
                            />
                            <InputField
                              label={t("admin.configuration.templates.templateDescription")}
                              value={template.description}
                              onChange={(v) => handleUpdateDemoTemplate(template.id, "description", v)}
                              placeholder={t("admin.configuration.templates.descriptionPlaceholder")}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-300">{t("admin.configuration.templates.color")}</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={template.color}
                                onChange={(e) => handleUpdateDemoTemplate(template.id, "color", e.target.value)}
                                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-[#333333] p-0.5"
                              />
                              <span className="text-xs text-gray-500 font-mono uppercase">{template.color}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Collapsible permissions with Studio View / Member View tabs */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-[#2F2F2F]">
                          {/* Tab switcher */}
                          <div className="flex items-center gap-1 mb-3 bg-[#141414] rounded-lg p-1">
                            <button
                              onClick={() => setTemplatePermTab(prev => ({ ...prev, [template.id]: "studio" }))}
                              className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                activePermTab === "studio"
                                  ? "bg-orange-500 text-white"
                                  : "text-gray-400 hover:text-white hover:bg-[#2F2F2F]"
                              }`}
                            >
                              {t("admin.configuration.templates.studioView")}
                              <span className="ml-1.5 opacity-70">({studioEnabledCount}/{studioTotalCount})</span>
                            </button>
                            <button
                              onClick={() => setTemplatePermTab(prev => ({ ...prev, [template.id]: "member" }))}
                              className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                activePermTab === "member"
                                  ? "bg-orange-500 text-white"
                                  : "text-gray-400 hover:text-white hover:bg-[#2F2F2F]"
                              }`}
                            >
                              {t("admin.configuration.templates.memberView")}
                              <span className="ml-1.5 opacity-70">({memberEnabledCount}/{memberTotalCount})</span>
                            </button>
                          </div>

                          {/* Studio View Permissions */}
                          {activePermTab === "studio" && (
                            <>
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-medium text-gray-400">{t("admin.configuration.templates.studioViewPermissions")}</label>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleToggleAllPermissions(template.id, true, "studioPermissions")}
                                    className="text-xs text-green-400 hover:text-green-300 transition-colors"
                                  >
                                    {t("admin.configuration.templates.enableAll")}
                                  </button>
                                  <span className="text-gray-600">|</span>
                                  <button
                                    onClick={() => handleToggleAllPermissions(template.id, false, "studioPermissions")}
                                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                                  >
                                    {t("admin.configuration.templates.disableAll")}
                                  </button>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
                                {DEMO_MENU_ITEMS.map((menuItem) => {
                                  const isEnabled = template.studioPermissions?.[menuItem.key]
                                  return (
                                    <button
                                      key={menuItem.key}
                                      onClick={() => handleToggleTemplatePermission(template.id, menuItem.key, "studioPermissions")}
                                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-all text-left ${
                                        isEnabled
                                          ? "border-green-500/30 bg-green-500/10 text-green-400"
                                          : "border-[#333333] bg-[#141414] text-gray-500"
                                      }`}
                                    >
                                      <div className={`w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0 ${
                                        isEnabled ? "bg-green-500" : "border border-gray-600"
                                      }`}>
                                        {isEnabled && <Check className="w-2.5 h-2.5 text-white" />}
                                      </div>
                                      <span className="truncate">{menuItem.label}</span>
                                    </button>
                                  )
                                })}
                              </div>
                            </>
                          )}

                          {/* Member View Permissions */}
                          {activePermTab === "member" && (
                            <>
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-medium text-gray-400">{t("admin.configuration.templates.memberViewPermissions")}</label>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleToggleAllPermissions(template.id, true, "memberViewPermissions")}
                                    className="text-xs text-green-400 hover:text-green-300 transition-colors"
                                  >
                                    Enable All
                                  </button>
                                  <span className="text-gray-600">|</span>
                                  <button
                                    onClick={() => handleToggleAllPermissions(template.id, false, "memberViewPermissions")}
                                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                                  >
                                    Disable All
                                  </button>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
                                {MEMBER_VIEW_MENU_ITEMS.map((menuItem) => {
                                  const isEnabled = template.memberViewPermissions?.[menuItem.key]
                                  return (
                                    <button
                                      key={menuItem.key}
                                      onClick={() => handleToggleTemplatePermission(template.id, menuItem.key, "memberViewPermissions")}
                                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-all text-left ${
                                        isEnabled
                                          ? "border-green-500/30 bg-green-500/10 text-green-400"
                                          : "border-[#333333] bg-[#141414] text-gray-500"
                                      }`}
                                    >
                                      <div className={`w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0 ${
                                        isEnabled ? "bg-green-500" : "border border-gray-600"
                                      }`}>
                                        {isEnabled && <Check className="w-2.5 h-2.5 text-white" />}
                                      </div>
                                      <span className="truncate">{menuItem.label}</span>
                                    </button>
                                  )
                                })}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </SettingsCard>
                  )
                })}
              </div>
            )}
          </div>
        )

      default:
        return (
          <div className="text-center py-12 text-gray-400">
            <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{t("admin.configuration.selectSection")}</p>
          </div>
        )
    }
  }

  // ============================================
  // Main Render
  // ============================================
  return (
    <div className="flex flex-col lg:flex-row h-full bg-[#1C1C1C] text-white overflow-hidden rounded-3xl">
      {/* Sidebar Navigation - Desktop */}
      <div className="hidden lg:flex lg:w-72 flex-shrink-0 border-r border-[#333333] bg-[#181818] flex-col min-h-0">
        {/* Search */}
        <div className="p-4 border-b border-[#333333] flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("admin.configuration.search.placeholder")}
              className="w-full bg-[#141414] text-white rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchQuery && filteredNavItems.length === 0 && (
            <p className="text-sm text-gray-500 mt-2 text-center">{t("common.noResults")}</p>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-2 min-h-0">
          {filteredNavItems.map((category) => {
            const categoryMatches = matchesSearch(category.label)
            
            return (
              <div key={category.id} className="mb-1">
                <button
                  onClick={() => {
                    toggleCategory(category.id)
                    if (category.sections.length > 0) {
                      navigateToSection(category.id, category.sections[0].id)
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                    activeCategory === category.id
                      ? "bg-[#2F2F2F] text-white"
                      : categoryMatches
                        ? "bg-orange-500/10 text-orange-300 hover:bg-orange-500/20"
                        : "text-gray-400 hover:text-white hover:bg-[#252525]"
                  }`}
                >
                  <category.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 font-medium">{highlightText(category.label)}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    expandedCategories.includes(category.id) ? "rotate-90" : ""
                  }`} />
                </button>

                {expandedCategories.includes(category.id) && (
                  <div className="ml-8 mt-1 space-y-0.5">
                    {category.sections.map((section) => {
                      const sectionMatches = matchesSearch(section.label)
                      
                      return (
                        <button
                          key={section.id}
                          onClick={() => navigateToSection(category.id, section.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            activeSection === section.id
                              ? "text-orange-400 bg-orange-500/10"
                              : sectionMatches
                                ? "text-orange-300 bg-orange-500/10 hover:bg-orange-500/20"
                                : "text-gray-500 hover:text-white hover:bg-[#252525]"
                          }`}
                        >
                          {highlightText(section.label)}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile Navigation List - fixed fullscreen below dashboard header */}
      <div
        className={`lg:hidden fixed inset-x-0 bottom-0 flex flex-col bg-[#1C1C1C] z-20 ${mobileShowContent ? 'hidden' : 'flex'}`}
        style={{ top: "calc(3.5rem + env(safe-area-inset-top, 0px))" }}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#333333] flex-shrink-0">
          <h1 className="text-xl font-bold">{t("admin.configuration.title")}</h1>
        </div>

        {/* Mobile Search */}
        <div className="p-3 border-b border-[#333333]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("admin.configuration.search.placeholder")}
              className="w-full bg-[#141414] text-white rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Items */}
        <div className="flex-1 min-h-0 overflow-y-auto p-2">
          {filteredNavItems.map((category) => {
            const categoryMatches = matchesSearch(category.label)
            
            return (
              <div key={category.id} className="mb-1">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors ${
                    activeCategory === category.id
                      ? "bg-[#2F2F2F] text-white"
                      : categoryMatches
                        ? "bg-orange-500/10 text-orange-300"
                        : "text-gray-400 hover:text-white hover:bg-[#252525]"
                  }`}
                >
                  <category.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 font-medium">{highlightText(category.label)}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    expandedCategories.includes(category.id) ? "rotate-90" : ""
                  }`} />
                </button>

                {expandedCategories.includes(category.id) && (
                  <div className="ml-8 mt-1 space-y-0.5">
                    {category.sections.map((section) => {
                      const sectionMatches = matchesSearch(section.label)
                      
                      return (
                        <button
                          key={section.id}
                          onClick={() => navigateToSection(category.id, section.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between ${
                            sectionMatches
                              ? "text-orange-300 bg-orange-500/10"
                              : "text-gray-500 hover:text-white hover:bg-[#252525]"
                          }`}
                        >
                          <span>{highlightText(section.label)}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile Content View - fixed fullscreen below dashboard header */}
      {mobileShowContent && (
        <div
          className="lg:hidden fixed inset-x-0 bottom-0 flex flex-col bg-[#1C1C1C] z-30"
          style={{ top: "calc(3.5rem + env(safe-area-inset-top, 0px))" }}
        >
          {/* Mobile Content Header with Back Button - always visible */}
          <div className="flex items-center gap-3 p-4 border-b border-[#333333] flex-shrink-0">
            <button
              onClick={() => setMobileShowContent(false)}
              className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold truncate">{getCurrentSectionTitle()}</h1>
          </div>

          {/* Mobile Content Area */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4">
            {renderSectionContent()}
          </div>

          {/* Floating Action Button - Mobile */}
          {getMobileAddAction() && (
            <button
              onClick={getMobileAddAction()}
              className="fixed bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 z-30"
              aria-label={t("common.add")}
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Desktop Main Content */}
      <div className="hidden lg:flex flex-1 flex-col min-h-0 overflow-hidden">
        {/* Desktop Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#333333] flex-shrink-0">
          <h1 className="text-2xl font-bold">{t("admin.configuration.title")}</h1>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderSectionContent()}
          <KeyboardSpacer />
        </div>
      </div>

      {/* Create Contract Form Modal */}
      <CreateContractFormModal
        isOpen={showCreateFormModal}
        onClose={() => {
          setShowCreateFormModal(false)
          setNewContractFormName("")
        }}
        value={newContractFormName}
        onChange={setNewContractFormName}
        onSubmit={handleCreateContractForm}
      />

      {/* Contract Builder Fullscreen */}
      {contractBuilderModalVisible && selectedContractForm && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0A]">
          <ContractBuilder
            contractForm={selectedContractForm}
            onUpdate={(updatedForm) => {
              setContractForms(contractForms.map(f => f.id === selectedContractForm.id ? updatedForm : f))
            }}
            onClose={() => setContractBuilderModalVisible(false)}
            isAdmin={true}
          />
        </div>
      )}
    </div>
  )
}

export default ConfigurationPage
