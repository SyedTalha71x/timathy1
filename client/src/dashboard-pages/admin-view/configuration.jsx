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
  Palette,
  Sun,
  Moon,
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
  BadgeDollarSign,
  UserPlus,
  Globe,
  Phone,
  AtSign,
  Lock,
  Send,
  Clipboard,
  Server,
  Calendar,
} from "lucide-react"
import { RiContractLine } from "react-icons/ri"
import { Modal, notification, ColorPicker } from "antd"
import dayjs from "dayjs"


import defaultLogoUrl from "../../../public/gray-avatar-fotor-20250912192528.png"

// Import configuration defaults from admin-panel-states (Single Source of Truth)
import {
  DEFAULT_COMMUNICATION_SETTINGS,
  DEFAULT_SMTP_CONFIG,
  DEFAULT_DEMO_EMAIL,
  DEFAULT_REGISTRATION_EMAIL,
  DEFAULT_CONTACT_DATA,
  DEFAULT_LEGAL_INFO,
  DEFAULT_APPEARANCE,
  CURRENCY_OPTIONS,
  DEFAULT_CONTRACT_PAUSE_REASONS,
  DEFAULT_LEAD_SOURCES,
  CONFIGURATION_NAV_ITEMS,
} from "../../utils/admin-panel-states/configuration-states"

// ============================================
// Reusable Components (matching studio design)
// ============================================

// WYSIWYG Editor Component
const WysiwygEditor = ({ value, onChange, placeholder, minHeight = 200 }) => {
  const editorRef = useRef(null)
  
  // Simple contentEditable implementation
  const handleInput = (e) => {
    if (onChange) {
      onChange(e.target.innerHTML)
    }
  }

  return (
    <div className="relative">
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value || "" }}
        className="w-full bg-[#141414] text-white rounded-xl px-4 py-3 text-sm outline-none border border-[#333333] focus:border-[#3F74FF] transition-colors overflow-y-auto"
        style={{ minHeight: `${minHeight}px` }}
        data-placeholder={placeholder}
      />
      {!value && (
        <span className="absolute top-3 left-4 text-gray-500 pointer-events-none text-sm">
          {placeholder}
        </span>
      )}
    </div>
  )
}

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
            {selectedOption?.label || placeholder || "Select..."}
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
                  placeholder="Search..."
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
                <div className="px-4 py-3 text-sm text-gray-500 text-center">No results found</div>
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
const iconMap = { User, Building2, BadgeDollarSign, Palette, RiContractLine, UserPlus, Mail, History }
const navigationItems = CONFIGURATION_NAV_ITEMS.map(item => ({
  ...item,
  icon: iconMap[item.iconName] || Settings,
}))

// CURRENCY_OPTIONS is imported from admin-panel-states/configuration-states

// ============================================
// Main Configuration Page Component
// ============================================
const ConfigurationPage = () => {
  const location = useLocation()
  const [searchParams] = useSearchParams()

  // Navigation State
  const [activeCategory, setActiveCategory] = useState("account")
  const [activeSection, setActiveSection] = useState("account-details")
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileShowContent, setMobileShowContent] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState(["account"])

  // Handle URL section parameter on mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const tabParam = queryParams.get("tab")
    
    if (tabParam === "account-management") {
      setActiveCategory("account")
      setActiveSection("account-details")
      setMobileShowContent(true)
      setExpandedCategories(prev => 
        prev.includes("account") ? prev : [...prev, "account"]
      )
    }
  }, [location.search])

  // ============================================
  // Account State
  // ============================================
  const [logo, setLogo] = useState([])
  const [logoUrl, setLogoUrl] = useState("")
  const [accountEmail, setAccountEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [hasExistingPassword, setHasExistingPassword] = useState(false)

  // ============================================
  // Platform State (initialized from configuration-states)
  // ============================================
  const [contactData, setContactData] = useState({ ...DEFAULT_CONTACT_DATA })

  const [legalInfo, setLegalInfo] = useState({ ...DEFAULT_LEGAL_INFO })

  // ============================================
  // Finances State (initialized from configuration-states)
  // ============================================
  const [currency, setCurrency] = useState(CURRENCY_OPTIONS[0]?.value || "€")

  // ============================================
  // Appearance State (initialized from configuration-states)
  // ============================================
  const [appearance, setAppearance] = useState({ ...DEFAULT_APPEARANCE })

  // ============================================
  // Contracts State (initialized from configuration-states)
  // ============================================
  const [contractTypes, setContractTypes] = useState([])
  const [contractPauseReasons, setContractPauseReasons] = useState([...DEFAULT_CONTRACT_PAUSE_REASONS])

  // ============================================
  // Resources State (initialized from configuration-states)
  // ============================================
  const [leadSources, setLeadSources] = useState([...DEFAULT_LEAD_SOURCES])
  const [newLeadSource, setNewLeadSource] = useState("")

  // ============================================
  // Communication State (initialized from configuration-states)
  // ============================================
  const [demoEmail, setDemoEmail] = useState({ ...DEFAULT_DEMO_EMAIL })

  const [registrationEmail, setRegistrationEmail] = useState({ ...DEFAULT_REGISTRATION_EMAIL })

  const [emailSignature, setEmailSignature] = useState(DEFAULT_COMMUNICATION_SETTINGS.emailSignature || "")

  const [smtpConfig, setSmtpConfig] = useState({ ...DEFAULT_SMTP_CONFIG })

  // ============================================
  // Changelog State
  // ============================================
  const [changelog, setChangelog] = useState([])
  const [newChangelog, setNewChangelog] = useState({
    version: "",
    date: "",
    color: "#3b82f6",
    content: "",
  })

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

  const isPasswordFormValid = () => {
    if (hasExistingPassword && !currentPassword) return false
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
    setExpandedCategories(prev =>
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    )
  }

  const getCurrentSectionTitle = () => {
    for (const cat of navigationItems) {
      const section = cat.sections.find(s => s.id === activeSection)
      if (section) return section.label
    }
    return "Settings"
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
      notification.success({ message: "Logo uploaded successfully" })
    }
  }

  const handleChangePassword = () => {
    if (!isPasswordFormValid()) {
      notification.error({ message: "Please fill in all password fields correctly" })
      return
    }

    notification.success({ message: "Password changed successfully" })
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleAddContractType = () => {
    setContractTypes([
      ...contractTypes,
      {
        id: Date.now(),
        name: "",
        duration: 12,
        cost: 0,
        billingPeriod: "monthly",
        maximumMemberCapacity: 0,
      },
    ])
  }

  const handleUpdateContractType = (index, field, value) => {
    const updated = [...contractTypes]
    updated[index][field] = value
    setContractTypes(updated)
  }

  const handleRemoveContractType = (index) => {
    Modal.confirm({
      title: "Remove Contract Type",
      content: "Are you sure? This cannot be undone.",
      okText: "Remove",
      okType: "danger",
      onOk: () => setContractTypes(contractTypes.filter((_, i) => i !== index))
    })
  }

  const handleAddPauseReason = () => {
    setContractPauseReasons([...contractPauseReasons, { name: "", maxDays: 30 }])
  }

  const handleRemovePauseReason = (index) => {
    setContractPauseReasons(contractPauseReasons.filter((_, i) => i !== index))
  }

  const handleAddLeadSource = () => {
    if (!newLeadSource.trim()) return
    
    setLeadSources([
      ...leadSources,
      {
        id: Date.now(),
        name: newLeadSource.trim(),
        color: "#3B82F6",
      },
    ])
    setNewLeadSource("")
    notification.success({ message: "Lead source added" })
  }

  const handleRemoveLeadSource = (id) => {
    setLeadSources(leadSources.filter(s => s.id !== id))
  }

  const handleUpdateLeadSource = (id, field, value) => {
    setLeadSources(leadSources.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const testEmailConnection = () => {
    if (!smtpConfig.smtpServer || !smtpConfig.smtpUser) {
      notification.error({ message: "Please fill in SMTP server and username" })
      return
    }
    notification.loading({ message: "Testing connection...", key: "smtp-test" })
    setTimeout(() => {
      notification.success({ 
        message: "Connection successful!", 
        description: `Connected to ${smtpConfig.smtpServer}:${smtpConfig.smtpPort}`,
        key: "smtp-test"
      })
    }, 1500)
  }

  const addChangelogEntry = () => {
    if (!newChangelog.version || !newChangelog.date || !newChangelog.content) {
      notification.warning({ message: "Please fill in version, date, and content" })
      return
    }
    setChangelog([{ ...newChangelog, id: Date.now() }, ...changelog])
    setNewChangelog({ version: "", date: "", color: newChangelog.color, content: "" })
    notification.success({ message: "Changelog entry added" })
  }

  const removeChangelogEntry = (index) => {
    setChangelog(changelog.filter((_, i) => i !== index))
  }

  const handleSaveConfiguration = () => {
    notification.success({ message: "Configuration saved successfully!" })
  }

  // ============================================
  // Render Section Content
  // ============================================
  const renderSectionContent = () => {
    switch (activeSection) {
      // ========================
      // ACCOUNT SECTIONS
      // ========================
      case "account-details":
        return (
          <div className="space-y-6">
            <SectionHeader title="Personal Details" description="Manage your account information and profile picture" />
            
            {/* Logo Upload */}
            <SettingsCard>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-28 h-28 rounded-2xl overflow-hidden bg-[#141414] flex-shrink-0 shadow-lg">
                  <img 
                    src={logoUrl || defaultLogoUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = defaultLogoUrl }}
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-white font-medium mb-2">Profile Picture</h3>
                  <p className="text-sm text-gray-400 mb-4">Upload your profile picture or studio logo</p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <label className="px-4 py-2 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F] cursor-pointer transition-colors flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      {logo.length > 0 ? "Change Logo" : "Upload Logo"}
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                    {logo.length > 0 && (
                      <button
                        onClick={() => { setLogo([]); setLogoUrl("") }}
                        className="px-4 py-2 text-red-400 text-sm hover:bg-red-500/10 rounded-xl transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </SettingsCard>

            {/* Account Email */}
            <SettingsCard>
              <h3 className="text-white font-medium mb-4">Account Email</h3>
              <div className="max-w-md">
                <InputField
                  label="Email Address"
                  value={accountEmail}
                  onChange={setAccountEmail}
                  placeholder="admin@company.com"
                  type="email"
                  icon={AtSign}
                />
              </div>
            </SettingsCard>
          </div>
        )

      case "account-access":
        return (
          <div className="space-y-6">
            <SectionHeader title="Access Data" description="Change your password and security settings" />
            
            <SettingsCard>
              <h3 className="text-white font-medium mb-4">Change Password</h3>
              <div className="max-w-md space-y-4">
                {/* Current Password */}
                {hasExistingPassword && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full bg-[#141414] text-white rounded-xl pl-10 pr-12 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full bg-[#141414] text-white rounded-xl pl-10 pr-12 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full bg-[#141414] text-white rounded-xl pl-10 pr-12 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Password Strength:</span>
                      <span>{getPasswordStrength(newPassword)}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${getPasswordStrengthColor(newPassword)}`}
                        style={{ width: `${getPasswordStrengthPercent(newPassword)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Password mismatch warning */}
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-400">Passwords do not match</p>
                )}

                <button
                  onClick={handleChangePassword}
                  disabled={!isPasswordFormValid()}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isPasswordFormValid()
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-[#333333] text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Change Password
                </button>
              </div>
            </SettingsCard>

            {/* Security Tips */}
            <SettingsCard className="bg-[#181818]">
              <h4 className="text-white font-medium mb-3">Security Tips</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  Use at least 8 characters
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  Include uppercase and lowercase letters
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  Include numbers and special characters
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  Don't reuse passwords from other accounts
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
            <SectionHeader title="Contact Information" description="Your company's contact details displayed to users" />
            
            <SettingsCard>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <InputField
                    label="Company Name"
                    value={contactData.companyName}
                    onChange={(v) => setContactData({ ...contactData, companyName: v })}
                    placeholder="Your Company Name"
                    icon={Building2}
                  />
                </div>
                <div className="sm:col-span-2">
                  <InputField
                    label="Address"
                    value={contactData.address}
                    onChange={(v) => setContactData({ ...contactData, address: v })}
                    placeholder="Company Address"
                    rows={3}
                  />
                </div>
                <InputField
                  label="Phone"
                  value={contactData.phone}
                  onChange={(v) => setContactData({ ...contactData, phone: v })}
                  placeholder="+1 (555) 123-4567"
                  icon={Phone}
                />
                <InputField
                  label="Email"
                  value={contactData.email}
                  onChange={(v) => setContactData({ ...contactData, email: v })}
                  placeholder="contact@company.com"
                  icon={AtSign}
                  type="email"
                />
                <div className="sm:col-span-2">
                  <InputField
                    label="Website"
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
            <SectionHeader title="Legal Information" description="Imprint, privacy policy, and terms of service" />
            
            <SettingsCard>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Imprint</label>
                  <WysiwygEditor
                    value={legalInfo.imprint}
                    onChange={(v) => setLegalInfo({ ...legalInfo, imprint: v })}
                    placeholder="Enter your company's imprint information..."
                    minHeight={150}
                  />
                </div>
              </div>
            </SettingsCard>

            <SettingsCard>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Privacy Policy</label>
                  <WysiwygEditor
                    value={legalInfo.privacyPolicy}
                    onChange={(v) => setLegalInfo({ ...legalInfo, privacyPolicy: v })}
                    placeholder="Enter your privacy policy..."
                    minHeight={200}
                  />
                </div>
              </div>
            </SettingsCard>

            <SettingsCard>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Terms and Conditions</label>
                  <WysiwygEditor
                    value={legalInfo.termsAndConditions}
                    onChange={(v) => setLegalInfo({ ...legalInfo, termsAndConditions: v })}
                    placeholder="Enter your terms and conditions..."
                    minHeight={200}
                  />
                </div>
              </div>
            </SettingsCard>
          </div>
        )

      // ========================
      // FINANCES SECTION
      // ========================
      case "currency-settings":
        return (
          <div className="space-y-6">
            <SectionHeader title="Currency Settings" description="Set the default currency for your platform" />
            
            <SettingsCard>
              <div className="max-w-md">
                <SelectField
                  label="Default Currency"
                  value={currency}
                  onChange={setCurrency}
                  options={CURRENCY_OPTIONS}
                  placeholder="Select currency"
                />
                <p className="text-xs text-gray-500 mt-2">
                  This currency will be used for all pricing and financial displays across the platform.
                </p>
              </div>
            </SettingsCard>
          </div>
        )

      // ========================
      // APPEARANCE SECTION
      // ========================
      case "theme-settings":
        return (
          <div className="space-y-6">
            <SectionHeader title="Theme Settings" description="Customize the look and feel of your platform" />
            
            <SettingsCard>
              <div className="space-y-6">
                {/* Theme Selection */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-3 block">Default Theme</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => setAppearance({ ...appearance, theme: "light" })}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors flex-1 sm:flex-none ${
                        appearance.theme === "light"
                          ? "border-orange-500 bg-orange-500/10"
                          : "border-[#333333] hover:border-[#444444]"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                        <Sun className="w-4 h-4 text-gray-800" />
                      </div>
                      <span className="text-white">Light Mode</span>
                    </button>
                    <button
                      onClick={() => setAppearance({ ...appearance, theme: "dark" })}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors flex-1 sm:flex-none ${
                        appearance.theme === "dark"
                          ? "border-orange-500 bg-orange-500/10"
                          : "border-[#333333] hover:border-[#444444]"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#1C1C1C] flex items-center justify-center border border-[#333333]">
                        <Moon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white">Dark Mode</span>
                    </button>
                  </div>
                </div>

                {/* Toggle for user theme */}
                <Toggle
                  label="Allow Users to Toggle Theme"
                  checked={appearance.allowUserThemeToggle}
                  onChange={(v) => setAppearance({ ...appearance, allowUserThemeToggle: v })}
                  helpText="Users can switch between light and dark mode"
                />

                <div className="h-px bg-[#333333]" />

                {/* Color Pickers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      Primary Color
                      <InfoTooltip content="Used for buttons, links, and primary actions" />
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={appearance.primaryColor}
                        onChange={(e) => setAppearance({ ...appearance, primaryColor: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-[#333333] p-1"
                      />
                      <input
                        type="text"
                        value={appearance.primaryColor}
                        onChange={(e) => setAppearance({ ...appearance, primaryColor: e.target.value })}
                        className="flex-1 bg-[#141414] text-white rounded-lg px-3 py-2 text-sm font-mono border border-[#333333] uppercase"
                        maxLength={7}
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(appearance.primaryColor)
                          notification.success({ message: "Copied!", duration: 1.5 })
                        }}
                        className="p-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-lg transition-colors"
                      >
                        <Clipboard className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      Secondary Color
                      <InfoTooltip content="Used for accents and secondary elements" position="right" />
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={appearance.secondaryColor}
                        onChange={(e) => setAppearance({ ...appearance, secondaryColor: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-[#333333] p-1"
                      />
                      <input
                        type="text"
                        value={appearance.secondaryColor}
                        onChange={(e) => setAppearance({ ...appearance, secondaryColor: e.target.value })}
                        className="flex-1 bg-[#141414] text-white rounded-lg px-3 py-2 text-sm font-mono border border-[#333333] uppercase"
                        maxLength={7}
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(appearance.secondaryColor)
                          notification.success({ message: "Copied!", duration: 1.5 })
                        }}
                        className="p-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-lg transition-colors"
                      >
                        <Clipboard className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SettingsCard>

            {/* Theme Preview */}
            <SettingsCard>
              <h4 className="text-white font-medium mb-4">Theme Preview</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Light Mode Preview */}
                <div className="p-4 rounded-xl border border-[#333333] bg-white">
                  <h5 className="text-gray-900 font-medium mb-3">Light Mode</h5>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <button 
                      className="px-4 py-2 rounded-lg text-white text-sm"
                      style={{ backgroundColor: appearance.primaryColor }}
                    >
                      Primary Button
                    </button>
                    <button 
                      className="px-4 py-2 rounded-lg text-white text-sm"
                      style={{ backgroundColor: appearance.secondaryColor }}
                    >
                      Secondary Button
                    </button>
                  </div>
                  <p className="text-gray-700 text-sm">Sample text in light mode</p>
                  <p className="text-sm" style={{ color: appearance.primaryColor }}>Colored text using primary color</p>
                </div>

                {/* Dark Mode Preview */}
                <div className="p-4 rounded-xl border border-[#333333] bg-[#101010]">
                  <h5 className="text-white font-medium mb-3">Dark Mode</h5>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <button 
                      className="px-4 py-2 rounded-lg text-white text-sm"
                      style={{ backgroundColor: appearance.primaryColor }}
                    >
                      Primary Button
                    </button>
                    <button 
                      className="px-4 py-2 rounded-lg text-white text-sm"
                      style={{ backgroundColor: appearance.secondaryColor }}
                    >
                      Secondary Button
                    </button>
                  </div>
                  <p className="text-white text-sm">Sample text in dark mode</p>
                  <p className="text-sm" style={{ color: appearance.primaryColor }}>Colored text using primary color</p>
                </div>
              </div>
            </SettingsCard>
          </div>
        )

      // ========================
      // CONTRACTS SECTIONS
      // ========================
      case "contract-types":
        return (
          <div className="space-y-6">
            <SectionHeader
              title="Contract Types"
              description="Define different membership contract types"
              action={
                <button
                  onClick={handleAddContractType}
                  className="px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Type
                </button>
              }
            />
            
            {contractTypes.length === 0 ? (
              <SettingsCard>
                <div className="text-center py-12 text-gray-400">
                  <RiContractLine className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-white mb-2">No contract types yet</h3>
                  <p className="text-sm mb-6">Create your first contract type</p>
                  <button
                    onClick={handleAddContractType}
                    className="px-6 py-2.5 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Contract Type
                  </button>
                </div>
              </SettingsCard>
            ) : (
              <div className="space-y-4">
                {contractTypes.map((type, index) => (
                  <SettingsCard key={type.id}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-medium">{type.name || "New Contract Type"}</h3>
                        <button
                          onClick={() => handleRemoveContractType(index)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <InputField
                          label="Contract Name"
                          value={type.name}
                          onChange={(v) => handleUpdateContractType(index, "name", v)}
                          placeholder="e.g., Premium Membership"
                        />
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-gray-300">Duration (months)</label>
                          <input
                            type="number"
                            value={type.duration}
                            onChange={(e) => handleUpdateContractType(index, "duration", Number(e.target.value))}
                            min={1}
                            className="w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-gray-300">Cost ({currency})</label>
                          <input
                            type="number"
                            value={type.cost}
                            onChange={(e) => handleUpdateContractType(index, "cost", Number(e.target.value))}
                            min={0}
                            step={0.01}
                            className="w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                          />
                        </div>
                        <SelectField
                          label="Billing Period"
                          value={type.billingPeriod}
                          onChange={(v) => handleUpdateContractType(index, "billingPeriod", v)}
                          options={[
                            { value: "weekly", label: "Weekly" },
                            { value: "monthly", label: "Monthly" },
                            { value: "annually", label: "Annually" },
                          ]}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          Maximum Member Capacity
                          <InfoTooltip content="Maximum number of members that can have this contract type active" />
                        </label>
                        <input
                          type="number"
                          value={type.maximumMemberCapacity}
                          onChange={(e) => handleUpdateContractType(index, "maximumMemberCapacity", Number(e.target.value))}
                          min={0}
                          placeholder="0 = Unlimited"
                          className="w-32 bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                        />
                      </div>
                    </div>
                  </SettingsCard>
                ))}
              </div>
            )}
          </div>
        )

      case "pause-reasons":
        return (
          <div className="space-y-6">
            <SectionHeader
              title="Contract Pause Reasons"
              description="Define reasons members can pause their contracts"
              action={
                <button
                  onClick={handleAddPauseReason}
                  className="px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Reason
                </button>
              }
            />
            
            <SettingsCard>
              {contractPauseReasons.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <PauseCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No pause reasons configured</p>
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
                        placeholder="Reason name"
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
              title="Lead Sources"
              description="Track where your leads come from"
            />
            
            {/* Add New Lead Source */}
            <SettingsCard>
              <h3 className="text-white font-medium mb-4">Add New Lead Source</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newLeadSource}
                  onChange={(e) => setNewLeadSource(e.target.value)}
                  placeholder="Enter lead source name"
                  onKeyPress={(e) => e.key === "Enter" && handleAddLeadSource()}
                  className="flex-1 bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                />
                <button
                  onClick={handleAddLeadSource}
                  disabled={!newLeadSource.trim()}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    newLeadSource.trim()
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-[#333333] text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Add Source
                </button>
              </div>
            </SettingsCard>

            {/* Lead Sources List */}
            <SettingsCard>
              <h3 className="text-white font-medium mb-4">Current Lead Sources</h3>
              {leadSources.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No lead sources configured</p>
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
                        placeholder="Source name"
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
            <SectionHeader title="Demo Access Email" description="Email sent when granting demo access" />
            
            <SettingsCard>
              <div className="space-y-4">
                <InputField
                  label="Email Subject"
                  value={demoEmail.subject}
                  onChange={(v) => setDemoEmail({ ...demoEmail, subject: v })}
                  placeholder="Your Demo Access for {Studio_Name}"
                />

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Email Content</label>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500">Variables:</span>
                    {["{Link}", "{Studio_Name}", "{Recipient_Name}", "{Expiry_Date}"].map(v => (
                      <button
                        key={v}
                        onClick={() => setDemoEmail({ ...demoEmail, content: demoEmail.content + v })}
                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
                      >
                        {v.replace(/{|}/g, "").replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>
                  <WysiwygEditor
                    value={demoEmail.content}
                    onChange={(v) => setDemoEmail({ ...demoEmail, content: v })}
                    placeholder="Compose your demo access email content..."
                    minHeight={180}
                  />
                </div>

                <NumberInput
                  label="Demo Link Expiry"
                  value={demoEmail.expiryDays}
                  onChange={(v) => setDemoEmail({ ...demoEmail, expiryDays: v })}
                  min={1}
                  max={30}
                  suffix="days"
                  helpText="Number of days until the demo access link expires"
                />

                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors">
                    Save Template
                  </button>
                  <button className="px-4 py-2 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F] transition-colors flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Test Email
                  </button>
                </div>
              </div>
            </SettingsCard>
          </div>
        )

      case "registration-email":
        return (
          <div className="space-y-6">
            <SectionHeader title="Registration Email" description="Email sent when a new member registers" />
            
            <SettingsCard>
              <div className="space-y-4">
                <InputField
                  label="Email Subject"
                  value={registrationEmail.subject}
                  onChange={(v) => setRegistrationEmail({ ...registrationEmail, subject: v })}
                  placeholder="Welcome to {Studio_Name}!"
                />

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Email Content</label>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500">Variables:</span>
                    {["{Studio_Name}", "{First_Name}", "{Last_Name}", "{Registration_Link}"].map(v => (
                      <button
                        key={v}
                        onClick={() => setRegistrationEmail({ ...registrationEmail, content: registrationEmail.content + v })}
                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
                      >
                        {v.replace(/{|}/g, "").replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>
                  <WysiwygEditor
                    value={registrationEmail.content}
                    onChange={(v) => setRegistrationEmail({ ...registrationEmail, content: v })}
                    placeholder="Dear {First_Name}, welcome to {Studio_Name}!..."
                    minHeight={180}
                  />
                </div>

                <NumberInput
                  label="Registration Link Expiry"
                  value={registrationEmail.expiryHours}
                  onChange={(v) => setRegistrationEmail({ ...registrationEmail, expiryHours: v })}
                  min={1}
                  max={168}
                  suffix="hours"
                  helpText="Number of hours until the registration link expires (1-168 hours / 7 days)"
                />

                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors">
                    Save Template
                  </button>
                  <button className="px-4 py-2 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F] transition-colors flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Test Email
                  </button>
                </div>
              </div>
            </SettingsCard>
          </div>
        )

      case "email-signature":
        return (
          <div className="space-y-6">
            <SectionHeader title="Email Signature" description="Default signature for all outgoing emails" />
            
            <SettingsCard>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Signature Content</label>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500">Variables:</span>
                    {["{Studio_Name}", "{Your_Name}", "{Phone_Number}", "{Email}"].map(v => (
                      <button
                        key={v}
                        onClick={() => setEmailSignature(emailSignature + v)}
                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
                      >
                        {v.replace(/{|}/g, "").replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>
                  <WysiwygEditor
                    value={emailSignature}
                    onChange={setEmailSignature}
                    placeholder="Best regards,&#10;{Studio_Name} Team"
                    minHeight={150}
                  />
                </div>

                {/* Signature Options */}
                <div className="space-y-3 pt-4 border-t border-[#333333]">
                  <h4 className="text-white font-medium">Signature Options</h4>
                  <Toggle
                    label="Automatically append signature to all outgoing emails"
                    checked={true}
                    onChange={() => {}}
                  />
                  <Toggle
                    label="Include signature in replies and forwards"
                    checked={false}
                    onChange={() => {}}
                  />
                  <Toggle
                    label="Use HTML signature format"
                    checked={true}
                    onChange={() => {}}
                  />
                </div>
              </div>
            </SettingsCard>
          </div>
        )

      case "smtp-setup":
        return (
          <div className="space-y-6">
            <SectionHeader title="SMTP Setup" description="Configure your email server for sending notifications" />
            
            <SettingsCard>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="SMTP Server"
                    value={smtpConfig.smtpServer}
                    onChange={(v) => setSmtpConfig({ ...smtpConfig, smtpServer: v })}
                    placeholder="smtp.example.com"
                    icon={Server}
                  />
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">SMTP Port</label>
                    <input
                      type="number"
                      value={smtpConfig.smtpPort}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, smtpPort: Number(e.target.value) })}
                      placeholder="587"
                      className="w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                    />
                  </div>
                  <InputField
                    label="Email Address (Username)"
                    value={smtpConfig.smtpUser}
                    onChange={(v) => setSmtpConfig({ ...smtpConfig, smtpUser: v })}
                    placeholder="studio@example.com"
                    icon={AtSign}
                  />
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Password</label>
                    <input
                      type="password"
                      value={smtpConfig.smtpPass}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, smtpPass: e.target.value })}
                      placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                      className="w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                    />
                  </div>
                  <InputField
                    label="Default Sender Name"
                    value={smtpConfig.senderName}
                    onChange={(v) => setSmtpConfig({ ...smtpConfig, senderName: v })}
                    placeholder="Your Studio Name"
                  />
                  <div className="flex items-end">
                    <Toggle
                      label="Use SSL/TLS"
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
                    Test Connection
                  </button>
                  <button className="px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Test Email
                  </button>
                </div>
              </div>
            </SettingsCard>

            {/* SMTP Help */}
            <SettingsCard className="bg-[#181818]">
              <h4 className="text-white font-medium mb-3">Common SMTP Settings</h4>
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
            <SectionHeader title="Version History" description="Document changes and updates to your platform" />
            
            {/* Add New Entry */}
            <SettingsCard>
              <h3 className="text-white font-medium mb-4">Add New Changelog Entry</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                  <InputField
                    label="Version"
                    value={newChangelog.version}
                    onChange={(v) => setNewChangelog({ ...newChangelog, version: v })}
                    placeholder="e.g., 2.1.0"
                  />
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Release Date</label>
                    <input
                      type="date"
                      value={newChangelog.date}
                      onChange={(e) => setNewChangelog({ ...newChangelog, date: e.target.value })}
                      className="w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Accent Color</label>
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
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Details</label>
                  <WysiwygEditor
                    value={newChangelog.content}
                    onChange={(v) => setNewChangelog({ ...newChangelog, content: v })}
                    placeholder="Describe the changes in this version..."
                    minHeight={120}
                  />
                </div>

                <button
                  onClick={addChangelogEntry}
                  disabled={!newChangelog.version || !newChangelog.date || !newChangelog.content}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    newChangelog.version && newChangelog.date && newChangelog.content
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-[#333333] text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Add Changelog Entry
                </button>
              </div>
            </SettingsCard>

            {/* Changelog Entries */}
            <SettingsCard>
              <h3 className="text-white font-medium mb-4">Changelog Entries</h3>
              {changelog.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No changelog entries yet</p>
                  <p className="text-sm mt-1">Add your first entry above</p>
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
                            <span className="text-white font-semibold">Version {entry.version}</span>
                            <span className="text-gray-500 text-sm">
                              {entry.date ? dayjs(entry.date).format("MMMM D, YYYY") : "No Date"}
                            </span>
                          </div>
                          <div
                            className="text-gray-300 text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: entry.content }}
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

      default:
        return (
          <div className="text-center py-12 text-gray-400">
            <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Select a section from the menu</p>
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
              placeholder="Search settings..."
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
            <p className="text-sm text-gray-500 mt-2 text-center">No results found</p>
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

      {/* Mobile Navigation List */}
      <div className={`lg:hidden flex flex-col h-full ${mobileShowContent ? 'hidden' : 'flex'}`}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#333333] flex-shrink-0">
          <h1 className="text-xl font-bold">Configuration</h1>
        </div>

        {/* Mobile Search */}
        <div className="p-3 border-b border-[#333333]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search settings..."
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
        <div className="flex-1 overflow-y-auto p-2">
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

      {/* Mobile Content View */}
      <div className={`lg:hidden flex flex-col h-full ${mobileShowContent ? 'flex' : 'hidden'}`}>
        {/* Mobile Content Header with Back Button */}
        <div className="flex items-center gap-3 p-4 border-b border-[#333333] flex-shrink-0">
          <button
            onClick={() => setMobileShowContent(false)}
            className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">{getCurrentSectionTitle()}</h1>
        </div>

        {/* Mobile Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderSectionContent()}
        </div>
      </div>

      {/* Desktop Main Content */}
      <div className="hidden lg:flex flex-1 flex-col min-h-0 overflow-hidden">
        {/* Desktop Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#333333] flex-shrink-0">
          <h1 className="text-2xl font-bold">Configuration</h1>
          <button
            onClick={handleSaveConfiguration}
            className="px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Save Configuration
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderSectionContent()}
        </div>
      </div>

      {/* Mobile Save Button */}
      <div className={`lg:hidden fixed bottom-4 right-4 ${mobileShowContent ? 'block' : 'hidden'}`}>
        <button
          onClick={handleSaveConfiguration}
          className="px-4 py-3 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors shadow-lg flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          Save
        </button>
      </div>
    </div>
  )
}

export default ConfigurationPage
