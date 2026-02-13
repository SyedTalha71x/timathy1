/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import {
  Search,
  Building2,
  Clock,
  CalendarOff,
  Calendar,
  Users,
  Shield,
  QrCode,
  UserPlus,
  FileText,
  PauseCircle,
  Mail,
  Bell,
  Palette,
  Sun,
  Moon,
  Upload,
  Download,
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
  BookOpen,
  BadgeDollarSign,
  MessageCircle,
  Printer,
  Clipboard,
  Smartphone,
  User,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react"
import { BsPersonWorkspace } from "react-icons/bs"
import { RiContractLine } from "react-icons/ri"
import { Modal, notification, QRCode } from "antd"
import dayjs from "dayjs"

import ContractBuilder from "../../components/studio-components/configuration-components/ContractBuilder"
import { WysiwygEditor } from "../../components/shared/WysiwygEditor"
import { PermissionModal } from "../../components/studio-components/configuration-components/PermissionModal"
import { RoleItem } from "../../components/studio-components/configuration-components/RoleItem"
import { StaffAssignmentModal } from "../../components/studio-components/configuration-components/StaffAssignmentModal"
import ImageSourceModal from "../../components/shared/image-handler/ImageSourceModal"
import ImageCropModal from "../../components/shared/image-handler/ImageCropModal"
import DatePickerField from "../../components/shared/DatePickerField"
import IntroMaterialEditorModal from "../../components/shared/IntroMaterialEditorModal"
import MediaLibraryPickerModal from "../../components/shared/image-handler/MediaLibraryPickerModal"
import DefaultAvatar from '../../../public/gray-avatar-fotor-20250912192528.png'

// ============================================
// Configuration State Imports (Single Source of Truth)
// ============================================
import {
  // Studio Data
  studioData,
  COUNTRIES,
  
  // Permissions
  PERMISSION_DATA,
  
  // Staff Config
  DEFAULT_STAFF_ROLES,
  DEFAULT_VACATION_DAYS,
  DEFAULT_STAFF_ROLE_ID,
  DEFAULT_STAFF_COUNTRY,
  DEFAULT_STAFF_MEMBERS,
  
  // Appointment Config
  DEFAULT_STUDIO_CAPACITY,
  DEFAULT_APPOINTMENT_CATEGORIES,
  DEFAULT_APPOINTMENT_TYPES,
  DEFAULT_TRIAL_TRAINING,
  DEFAULT_CALENDAR_SETTINGS,
  
  // Lead Config
  DEFAULT_LEAD_SOURCES,
  
  // Contract Config
  DEFAULT_CONTRACT_FORMS,
  DEFAULT_CONTRACT_TYPES,
  DEFAULT_CONTRACT_SETTINGS,
  DEFAULT_CONTRACT_PAUSE_REASONS,
  DEFAULT_VAT_RATES,
  
  // Communication Config
  DEFAULT_COMMUNICATION_SETTINGS,
  DEFAULT_APPOINTMENT_NOTIFICATION_TYPES,
  
  // Other Settings
  DEFAULT_APPEARANCE_SETTINGS,
  DEFAULT_INTRODUCTORY_MATERIALS,
  DEFAULT_MEMBER_SETTINGS,
} from "../../utils/studio-states/configuration-states"

// ============================================
// Shared Hook for data abstraction (Admin + Studio Panel)
// ============================================
import { useStudioConfiguration } from "../../hooks/useStudioConfiguration"

// ============================================
// Navigation Items Configuration
// ============================================
const ALL_NAVIGATION_ITEMS = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
    adminVisible: false, // Profile is user-specific, hidden in admin mode
    sections: [
      { id: "profile-details", label: "Personal Details" },
      { id: "profile-access", label: "Access Data" },
    ],
  },
  {
    id: "studio",
    label: "Studio",
    icon: Building2,
    adminVisible: true,
    sections: [
      { id: "studio-info", label: "Studio Information" },
      { id: "opening-hours", label: "Opening Hours" },
      { id: "closing-days", label: "Closing Days" },
    ],
  },
  {
    id: "appointments",
    label: "Appointments",
    icon: Calendar,
    adminVisible: true,
    sections: [
      { id: "calendar-settings", label: "Calendar Settings" },
      { id: "capacity", label: "Capacity Settings" },
      { id: "appointment-types", label: "Appointment Types" },
      { id: "appointment-categories", label: "Categories" },
      { id: "trial-training", label: "Trial Training" },
    ],
  },
  {
    id: "staff",
    label: "Staff",
    icon: BsPersonWorkspace,
    adminVisible: true,
    sections: [
      { id: "staff-defaults", label: "Default Settings" },
      { id: "staff-roles", label: "Roles & Permissions" },
    ],
  },
  {
    id: "members",
    label: "Members & Leads",
    icon: Users,
    adminVisible: true,
    sections: [
      { id: "qr-checkin", label: "QR Code Check-In" },
      { id: "lead-sources", label: "Lead Sources" },
      { id: "intro-materials", label: "Introductory Materials" },
    ],
  },
  {
    id: "contracts",
    label: "Contracts",
    icon: RiContractLine,
    adminVisible: true,
    sections: [
      { id: "contract-general", label: "General Settings" },
      { id: "contract-forms", label: "Contract Forms" },
      { id: "contract-types", label: "Contract Types" },
      { id: "pause-reasons", label: "Pause Reasons" },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    icon: MessageCircle,
    adminVisible: true,
    sections: [
      { id: "comm-general", label: "General Settings", group: "General" },
      { id: "smtp-setup", label: "SMTP Setup", group: "General" },
      { id: "email-signature", label: "Email Signature", group: "General" },
      { id: "email-notifications", label: "Email Notifications", group: "Notifications" },
      { id: "app-notifications", label: "App Notifications", group: "Notifications" },
      { id: "e-invoice-template", label: "E-Invoice", group: "Email Templates" },
      { id: "contract-cancellation-template", label: "Contract Cancellation", group: "Email Templates" },
      { id: "contract-conclusion-template", label: "Conclusion of Contract", group: "Email Templates" },
    ],
  },
  {
    id: "finances",
    label: "Finances",
    icon: BadgeDollarSign,
    adminVisible: true,
    sections: [
      { id: "vat-rates", label: "VAT Rates" },
      { id: "payment-settings", label: "Payment Settings" },
    ],
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: Palette,
    adminVisible: true,
    sections: [
      { id: "theme", label: "Theme Settings" },
    ],
  },
  {
    id: "import",
    label: "Data Import",
    icon: Download,
    adminVisible: true,
    sections: [
      { id: "import-data", label: "Import Data" },
    ],
  },
]

// ============================================
// Reusable Components
// ============================================

// Section Header Component
const SectionHeader = ({ title, description, action }) => (
  <div className="hidden md:flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-content-primary">{title}</h2>
      {description && <p className="text-xs sm:text-sm text-content-muted mt-1">{description}</p>}
    </div>
    {action}
  </div>
)

// Card Component
const SettingsCard = ({ children, className = "" }) => (
  <div className={`bg-surface-hover rounded-xl p-4 sm:p-6 ${className}`}>
    {children}
  </div>
)

// Input Component
const InputField = ({ label, value, onChange, placeholder, type = "text", maxLength, required, error, helpText, icon: Icon }) => (
  <div className="space-y-1.5">
    {label && (
      <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-faint" />
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border transition-colors ${
          error ? "border-red-500" : "border-border focus:border-accent-blue"
        } ${Icon ? "pl-10" : ""}`}
      />
    </div>
    {helpText && <p className="text-xs text-content-faint">{helpText}</p>}
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
        <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
          {label}
          {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-accent-blue flex items-center justify-between"
        >
          <span className={selectedOption ? "text-content-primary" : "text-content-faint"}>
            {selectedOption?.label || placeholder || "Select..."}
          </span>
          <ChevronDown className={`w-4 h-4 text-content-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-surface-hover border border-border rounded-xl shadow-lg max-h-60 overflow-hidden">
            {searchable && (
              <div className="p-2 border-b border-border">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-surface-card text-content-primary rounded-lg px-3 py-2 text-sm outline-none border border-border"
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
                  className={`w-full px-4 py-2.5 text-sm text-left hover:bg-surface-button transition-colors ${
                    opt.value === value ? "bg-surface-button text-primary" : "text-content-primary"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
              {filteredOptions.length === 0 && (
                <div className="px-4 py-3 text-sm text-content-faint text-center">No results found</div>
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
      <span className="text-sm font-medium text-content-primary">{label}</span>
      {helpText && <p className="text-xs text-content-faint mt-0.5">{helpText}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
        checked ? "bg-primary" : "bg-surface-button"
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
    {label && <label className="text-sm font-medium text-content-secondary">{label}</label>}
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
        className="w-24 bg-surface-card text-content-primary rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
      />
      {suffix && <span className="text-sm text-content-muted">{suffix}</span>}
    </div>
    {helpText && <p className="text-xs text-content-faint">{helpText}</p>}
  </div>
)

// Color Picker Component
const ColorPickerField = ({ label, value, onChange }) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-content-secondary">{label}</label>}
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-border p-1"
      />
    </div>
  </div>
)

// Time Picker Component
const TimePickerField = ({ label, value, onChange, placeholder = "HH:MM" }) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-content-secondary">{label}</label>}
    <input
      type="time"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-surface-card text-content-primary rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
    />
  </div>
)

// Tooltip Component
const Tooltip = ({ children, content, position = "left" }) => (
  <div className="relative group inline-flex">
    {children}
    <div className={`absolute top-full mt-2 px-3 py-2 bg-surface-hover text-content-secondary text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] w-64 border border-border shadow-xl pointer-events-none ${position === "right" ? "right-0" : "left-0"}`}>
      <div className={`absolute bottom-full border-4 border-transparent border-b-[#333333] ${position === "right" ? "right-4" : "left-4"}`} />
      <div className={`absolute bottom-full mb-[-1px] border-4 border-transparent border-b-[#1F1F1F] ${position === "right" ? "right-4" : "left-4"}`} />
      <div className="break-words leading-relaxed">{content}</div>
    </div>
  </div>
)

// Info Icon with Tooltip
const InfoTooltip = ({ content, position = "left" }) => (
  <Tooltip content={content} position={position}>
    <Info className="w-4 h-4 text-content-faint hover:text-content-secondary cursor-help" />
  </Tooltip>
)

// ============================================
// Admin Banner Component
// ============================================
const AdminBanner = ({ studioName }) => (
  <div className="bg-primary/10 border border-primary/30 rounded-xl px-4 py-3 flex items-center gap-3">
    <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0" />
    <div>
      <p className="text-sm font-medium text-orange-300">
        Admin Mode — Editing: {studioName || "Studio"}
      </p>
      <p className="text-xs text-primary/70 mt-0.5">
        Changes will apply to this studio&apos;s configuration
      </p>
    </div>
  </div>
)

// ============================================
// Main Configuration Page Component
// 
// Props (for shared usage between Admin and Studio Panel):
//   studioId   - (number|null) null = own studio, number = specific studio (admin)
//   mode       - ("studio"|"admin") Controls which sections are visible
//   studioName - (string|null) Studio name to show in admin banner
// ============================================
const ConfigurationPage = ({ studioId: studioIdProp = null, mode = "studio", studioName: studioNameProp = null }) => {
  // URL Search Params
  const [searchParams] = useSearchParams()

  // ============================================
  // Load configuration via shared hook
  // ============================================
  const { config, updateConfig, isLoading, error } = useStudioConfiguration({
    studioId: studioIdProp,
    mode,
  })

  // ============================================
  // Filter navigation items based on mode
  // (e.g., hide "Profile" section in admin mode)
  // ============================================
  const navigationItems = ALL_NAVIGATION_ITEMS.filter((item) => {
    if (mode === "admin" && item.adminVisible === false) return false
    return true
  })
  
  // Navigation State - default to first available section
  const defaultCategory = navigationItems[0]?.id || "studio"
  const defaultSection = navigationItems[0]?.sections[0]?.id || "studio-info"

  const [activeCategory, setActiveCategory] = useState(defaultCategory)
  const [activeSection, setActiveSection] = useState(defaultSection)
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileShowContent, setMobileShowContent] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState([defaultCategory])

  // Handle URL section parameter on mount
  useEffect(() => {
    const sectionParam = searchParams.get("section")
    if (sectionParam) {
      // Find the category that contains this section
      const category = navigationItems.find(cat => 
        cat.sections.some(sec => sec.id === sectionParam)
      )
      if (category) {
        setActiveCategory(category.id)
        setActiveSection(sectionParam)
        setMobileShowContent(true)
        setExpandedCategories(prev => 
          prev.includes(category.id) ? prev : [...prev, category.id]
        )
      }
    }
  }, [searchParams])

  // ============================================
  // Profile State Variables
  // ============================================
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    mobile: "",
    street: "",
    zipCode: "",
    city: "",
    country: "",
    birthday: "",
    username: "",
    password: "",
    profilePicture: null,
  })
  const [profilePreviewUrl, setProfilePreviewUrl] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const profileFileInputRef = useRef(null)

  const handleProfileInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileData((prev) => ({ ...prev, profilePicture: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // ============================================
  // All State Variables - initialized empty, populated from hook config
  // ============================================
  
  // Basic studio information
  const [studioName, setStudioName] = useState("")
  const [studioId] = useState("")
  const [studioOperator, setStudioOperator] = useState("")
  const [studioOperatorEmail, setStudioOperatorEmail] = useState("")
  const [studioOperatorPhone, setStudioOperatorPhone] = useState("")
  const [studioOperatorMobile, setStudioOperatorMobile] = useState("")
  const [studioStreet, setStudioStreet] = useState("")
  const [studioZipCode, setStudioZipCode] = useState("")
  const [studioCity, setStudioCity] = useState("")
  const [studioCountry, setStudioCountry] = useState("")
  const [studioPhoneNo, setStudioPhoneNo] = useState("")
  const [studioMobileNo, setStudioMobileNo] = useState("")
  const [studioEmail, setStudioEmail] = useState("")
  const [studioWebsite, setStudioWebsite] = useState("")
  const [currency, setCurrency] = useState("")
  const [logo, setLogo] = useState([])
  const [logoUrl, setLogoUrl] = useState("")

  // Opening hours and closing days
  const [openingHours, setOpeningHours] = useState([])
  const [closingDays, setClosingDays] = useState([])
  const [publicHolidays, setPublicHolidays] = useState([])
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(false)

  // Staff & Roles
  const [roles, setRoles] = useState([])
  const [defaultVacationDays, setDefaultVacationDays] = useState(0)
  const [defaultStaffRole, setDefaultStaffRole] = useState("")
  const [defaultStaffCountry, setDefaultStaffCountry] = useState("")
  const [permissionModalVisible, setPermissionModalVisible] = useState(false)
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(null)
  const [staffAssignmentModalVisible, setStaffAssignmentModalVisible] = useState(false)
  const [selectedRoleForAssignment, setSelectedRoleForAssignment] = useState(null)
  const [allStaff, setAllStaff] = useState([])

  // Appointments
  const [appointmentTypes, setAppointmentTypes] = useState([])
  const [appointmentCategories, setAppointmentCategories] = useState([])
  const [studioCapacity, setStudioCapacity] = useState(10)
  const [trialTraining, setTrialTraining] = useState({})
  const [editingCategory, setEditingCategory] = useState({ index: null, value: "" })
  
  // Calendar Settings
  const [calendarSettings, setCalendarSettings] = useState({})
  
  // Appointment Type Modal States
  const [showAppointmentTypeModal, setShowAppointmentTypeModal] = useState(false)
  const [editingAppointmentType, setEditingAppointmentType] = useState(null)
  const [appointmentTypeForm, setAppointmentTypeForm] = useState({
    name: "",
    description: "",
    duration: 30,
    capacity: 1,
    color: "#3B82F6",
    interval: 30,
    category: "",
    image: null,
    contingentUsage: 1,
  })
  
  // Image Upload States for Appointment Types
  const [showImageSourceModal, setShowImageSourceModal] = useState(false)
  const [showImageCropModal, setShowImageCropModal] = useState(false)
  const [showMediaLibraryModal, setShowMediaLibraryModal] = useState(false)
  const [tempImage, setTempImage] = useState(null)
  const appointmentImageInputRef = useRef(null)

  // Members
  const [allowMemberQRCheckIn, setAllowMemberQRCheckIn] = useState(false)
  const [memberQRCodeUrl, setMemberQRCodeUrl] = useState("")
  const [leadSources, setLeadSources] = useState([])
  const [introductoryMaterials, setIntroductoryMaterials] = useState([])
  const [introMaterialEditorVisible, setIntroMaterialEditorVisible] = useState(false)
  const [editingIntroMaterial, setEditingIntroMaterial] = useState(null)
  const [editingIntroMaterialIndex, setEditingIntroMaterialIndex] = useState(null)
  const [deletingIntroMaterialIndex, setDeletingIntroMaterialIndex] = useState(null)

  // Contract Form States
  const [deletingContractFormId, setDeletingContractFormId] = useState(null)
  const [editingContractFormName, setEditingContractFormName] = useState({ id: null, value: "" })

  // Contract Type Modal States
  const [contractTypeModalVisible, setContractTypeModalVisible] = useState(false)
  const [editingContractType, setEditingContractType] = useState(null)
  const [editingContractTypeIndex, setEditingContractTypeIndex] = useState(null)

  // Contracts
  const [allowMemberSelfCancellation, setAllowMemberSelfCancellation] = useState(false)
  const [noticePeriod, setNoticePeriod] = useState(30)
  const [extensionPeriod, setExtensionPeriod] = useState(12)
  const [defaultBillingPeriod, setDefaultBillingPeriod] = useState("")
  const [defaultAutoRenewal, setDefaultAutoRenewal] = useState(false)
  const [defaultRenewalIndefinite, setDefaultRenewalIndefinite] = useState(false)
  const [defaultRenewalPeriod, setDefaultRenewalPeriod] = useState(0)
  const [defaultAppointmentLimit, setDefaultAppointmentLimit] = useState(0)
  const [contractTypes, setContractTypes] = useState([])
  const [contractForms, setContractForms] = useState([])
  const [selectedContractForm, setSelectedContractForm] = useState(null)
  const [contractBuilderModalVisible, setContractBuilderModalVisible] = useState(false)
  const [newContractFormName, setNewContractFormName] = useState("")
  const [showCreateFormModal, setShowCreateFormModal] = useState(false)
  const [contractPauseReasons, setContractPauseReasons] = useState([])

  // Communication Settings
  const [settings, setSettings] = useState({})
  const [appointmentNotificationTypes, setAppointmentNotificationTypes] = useState([])

  // Finances
  const [vatRates, setVatRates] = useState([])
  const [vatNumber, setVatNumber] = useState("")
  const [bankName, setBankName] = useState("")
  const [creditorId, setCreditorId] = useState("")
  const [creditorName, setCreditorName] = useState("")
  const [iban, setIban] = useState("")
  const [bic, setBic] = useState("")

  // Appearance
  const [appearance, setAppearance] = useState({})

  // Countries
  const [countries, setCountries] = useState([])

  // Refs for WysiwygEditors (for variable insertion via insertText)
  const birthdayEditorRef = useRef(null)
  const appointmentEditorRefs = useRef({})
  const signatureEditorRef = useRef(null)
  const einvoiceEditorRef = useRef(null)
  const cancellationEditorRef = useRef(null)
  const conclusionEditorRef = useRef(null)
  const qrCodeRef = useRef(null)

  // ============================================
  // Populate state from hook config when it loads
  // This replaces the old direct imports as initial values
  // ============================================
  useEffect(() => {
    if (!config) return

    // Studio info
    setStudioName(config.studio.name)
    setStudioOperator(config.studio.operator)
    setStudioOperatorEmail(config.studio.operatorEmail)
    setStudioOperatorPhone(config.studio.operatorPhone)
    setStudioOperatorMobile(config.studio.operatorMobile)
    setStudioStreet(config.studio.street)
    setStudioZipCode(config.studio.zipCode)
    setStudioCity(config.studio.city)
    setStudioCountry(config.studio.country)
    setStudioPhoneNo(config.studio.phone)
    setStudioMobileNo(config.studio.mobile)
    setStudioEmail(config.studio.email)
    setStudioWebsite(config.studio.website)
    setCurrency(config.studio.currency)
    setOpeningHours(config.studio.openingHours)
    setClosingDays(config.studio.closingDays)

    // Staff
    setRoles(config.staff.roles)
    setDefaultVacationDays(config.staff.defaultVacationDays)
    setDefaultStaffRole(config.staff.defaultStaffRole)
    setDefaultStaffCountry(config.staff.defaultStaffCountry)
    setAllStaff(config.staff.allStaff)

    // Appointments
    setAppointmentTypes(config.appointments.types)
    setAppointmentCategories(config.appointments.categories)
    setStudioCapacity(config.appointments.capacity)
    setTrialTraining(config.appointments.trialTraining)
    setCalendarSettings(config.appointments.calendarSettings)

    // Members & Leads
    setAllowMemberQRCheckIn(config.members.allowMemberQRCheckIn)
    setMemberQRCodeUrl(config.members.memberQRCodeUrl)
    setLeadSources(config.members.leadSources)
    setIntroductoryMaterials(config.members.introductoryMaterials)

    // Contracts
    setAllowMemberSelfCancellation(config.contracts.settings.allowMemberSelfCancellation)
    setNoticePeriod(config.contracts.settings.noticePeriod)
    setExtensionPeriod(config.contracts.settings.extensionPeriod)
    setDefaultBillingPeriod(config.contracts.settings.defaultBillingPeriod)
    setDefaultAutoRenewal(config.contracts.settings.defaultAutoRenewal)
    setDefaultRenewalIndefinite(config.contracts.settings.defaultRenewalIndefinite)
    setDefaultRenewalPeriod(config.contracts.settings.defaultRenewalPeriod)
    setDefaultAppointmentLimit(config.contracts.settings.defaultAppointmentLimit)
    setContractTypes(config.contracts.types)
    setContractForms(config.contracts.forms)
    setContractPauseReasons(config.contracts.pauseReasons)

    // Communication
    setSettings(config.communication.settings)
    setAppointmentNotificationTypes(config.communication.notificationTypes)

    // Finances
    setVatRates(config.finances.vatRates)
    setVatNumber(config.finances.vatNumber)
    setBankName(config.finances.bankName)
    setCreditorId(config.finances.creditorId)
    setCreditorName(config.finances.creditorName)
    setIban(config.finances.iban)
    setBic(config.finances.bic)

    // Appearance
    setAppearance(config.appearance)

    // Countries
    setCountries(config.countries)
  }, [config])

  // Create branded QR image with studio name
  const createBrandedQRImage = (callback) => {
    if (!qrCodeRef.current) return
    
    const qrCanvas = qrCodeRef.current.querySelector('canvas')
    if (!qrCanvas) return

    // Create a new canvas for the branded image
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const padding = 40
    const titleHeight = 60
    const subtitleHeight = 40
    const qrSize = qrCanvas.width
    
    canvas.width = qrSize + (padding * 2)
    canvas.height = qrSize + (padding * 2) + titleHeight + subtitleHeight
    
    // White background
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Studio name title
    ctx.fillStyle = '#1C1C1C'
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(studioName || 'Studio', canvas.width / 2, padding + 30)
    
    // Draw QR code
    ctx.drawImage(qrCanvas, padding, padding + titleHeight)
    
    // Subtitle
    ctx.fillStyle = '#666666'
    ctx.font = '16px system-ui, -apple-system, sans-serif'
    ctx.fillText('Scan to check in', canvas.width / 2, padding + titleHeight + qrSize + 30)
    
    callback(canvas)
  }

  // QR Code download handler
  const handleDownloadQRCode = () => {
    createBrandedQRImage((canvas) => {
      const url = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `${studioName || 'studio'}-checkin-qr.png`
      link.href = url
      link.click()
    })
  }

  // QR Code print handler
  const handlePrintQRCode = () => {
    createBrandedQRImage((canvas) => {
      const dataUrl = canvas.toDataURL('image/png')
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>QR Code - ${studioName || 'Studio'} Check-In</title>
              <style>
                body {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  margin: 0;
                  font-family: system-ui, -apple-system, sans-serif;
                }
                img { max-width: 400px; }
              </style>
            </head>
            <body>
              <img src="${dataUrl}" alt="Check-In QR Code" />
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.onload = () => {
          printWindow.print()
        }
      }
    })
  }

  // Get current section title for mobile header
  const getCurrentSectionTitle = () => {
    for (const cat of navigationItems) {
      const section = cat.sections.find(s => s.id === activeSection)
      if (section) return section.label
    }
    return "Settings"
  }

  // ============================================
  // Effects
  // ============================================

  // Note: Opening hours are now initialized from studioData.openingHours
  // No useEffect needed for initialization

  // Fetch countries on mount (optional - extends imported COUNTRIES with full list)
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,currencies')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        const formattedCountries = data.map(country => {
          const currencyCode = country.currencies ? Object.keys(country.currencies)[0] : 'USD'
          const symbols = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', CHF: 'Fr', CAD: 'C$', AUD: 'A$' }
          return {
            code: country.cca2,
            name: country.name.common,
            currency: symbols[currencyCode] || currencyCode
          }
        }).sort((a, b) => a.name.localeCompare(b.name))
        setCountries(formattedCountries)
      } catch (error) {
        console.error('Error fetching countries:', error)
        // Fallback: Keep imported COUNTRIES from configuration-states
      }
    }
    fetchCountries()
  }, [])

  // Fetch public holidays when country changes
  useEffect(() => {
    if (studioCountry) {
      fetchPublicHolidays(studioCountry)
    }
  }, [studioCountry])

  // ============================================
  // Handler Functions (preserved from original)
  // ============================================

  const fetchPublicHolidays = async (countryCode) => {
    if (!countryCode) return
    setIsLoadingHolidays(true)
    try {
      const currentYear = new Date().getFullYear()
      const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentYear}/${countryCode}`)
      if (!response.ok) throw new Error("Failed to fetch holidays")
      const data = await response.json()
      setPublicHolidays(data.map(h => ({ date: h.date, name: h.name, countryCode: h.countryCode })))
    } catch (error) {
      notification.error({ message: "Error", description: "Could not load public holidays" })
    } finally {
      setIsLoadingHolidays(false)
    }
  }

  const addPublicHolidaysToClosingDays = () => {
    if (publicHolidays.length === 0) {
      notification.warning({ message: "No Holidays", description: "Please select a country first" })
      return
    }
    const existingDates = closingDays.map(d => d.date)
    const newHolidays = publicHolidays.filter(h => !existingDates.includes(h.date))
    if (newHolidays.length === 0) {
      notification.info({ message: "No New Holidays", description: "All holidays already added" })
      return
    }
    setClosingDays([...closingDays, ...newHolidays.map(h => ({ date: h.date, description: h.name }))])
    notification.success({ message: "Added", description: `Added ${newHolidays.length} holidays` })
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setLogoUrl(url)
      setLogo([file])
      notification.success({ message: "Logo uploaded successfully" })
    }
  }

  // Role handlers
  const handleAddRole = () => {
    setRoles([...roles, {
      id: Date.now(),
      name: "",
      permissions: [],
      color: "#3B82F6",
      isAdmin: false,
      staffCount: 0,
      assignedStaff: []
    }])
  }

  const handleUpdateRole = (index, field, value) => {
    const updated = [...roles]
    if (field === "name" && value.trim()) {
      const duplicate = roles.find((r, i) => i !== index && r.name.toLowerCase() === value.toLowerCase().trim())
      if (duplicate) {
        notification.error({ message: "Duplicate name", description: "Role name already exists" })
        return
      }
    }
    updated[index][field] = value
    setRoles(updated)
  }

  const handleDeleteRole = (index) => {
    if (roles[index].isAdmin) {
      notification.error({ message: "Cannot delete Admin role" })
      return
    }
    if (roles[index].staffCount > 0) {
      notification.error({ message: "Reassign staff first" })
      return
    }
    setRoles(roles.filter((_, i) => i !== index))
  }

  const handleCopyRole = (index) => {
    const role = roles[index]
    setRoles([...roles, { ...role, id: Date.now(), name: `${role.name} (copy)`, staffCount: 0, assignedStaff: [], isAdmin: false }])
  }

  const handlePermissionChange = (permissions) => {
    if (selectedRoleIndex !== null) {
      const updated = [...roles]
      updated[selectedRoleIndex].permissions = permissions
      setRoles(updated)
    }
  }

  const handleStaffAssignmentChange = (roleId, assignedStaffIds) => {
    // Find the admin role
    const adminRole = roles.find(r => r.isAdmin)
    const targetRole = roles.find(r => r.id === roleId)
    
    // If we're assigning to a non-admin role, check if any of the staff are the last admin
    if (adminRole && !targetRole?.isAdmin) {
      const adminStaff = adminRole.assignedStaff || []
      const staffBeingMovedFromAdmin = assignedStaffIds.filter(id => adminStaff.includes(id))
      
      // Check if this would remove all admins
      const remainingAdmins = adminStaff.filter(id => !staffBeingMovedFromAdmin.includes(id))
      
      if (staffBeingMovedFromAdmin.length > 0 && remainingAdmins.length === 0) {
        notification.error({ 
          message: "Cannot remove last admin", 
          description: "At least one staff member must remain in the Admin role." 
        })
        return
      }
    }
    
    // Remove assigned staff from all other roles, then add to the target role
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        // This is the target role - assign the staff
        return { ...role, assignedStaff: assignedStaffIds, staffCount: assignedStaffIds.length }
      } else {
        // Remove any of the assigned staff from this role
        const filteredStaff = (role.assignedStaff || []).filter(staffId => !assignedStaffIds.includes(staffId))
        return { ...role, assignedStaff: filteredStaff, staffCount: filteredStaff.length }
      }
    }))
  }

  // Appointment handlers
  const handleOpenAppointmentTypeModal = (type = null) => {
    if (type) {
      // Editing existing
      setEditingAppointmentType(type)
      setAppointmentTypeForm({
        name: type.name || "",
        description: type.description || "",
        duration: type.duration || 30,
        maxParallel: type.maxParallel || 1,
        slotsRequired: type.slotsRequired ?? 1,
        color: type.color || "#FF843E",
        interval: type.interval || 30,
        category: type.category || "",
        image: type.image || null,
        contingentUsage: type.contingentUsage ?? 1,
      })
    } else {
      // Creating new
      setEditingAppointmentType(null)
      setAppointmentTypeForm({
        name: "",
        description: "",
        duration: 30,
        maxParallel: 1,
        slotsRequired: 1,
        color: "#FF843E",
        interval: 30,
        category: "",
        image: null,
        contingentUsage: 1,
      })
    }
    setShowAppointmentTypeModal(true)
  }

  const handleSaveAppointmentType = () => {
    if (!appointmentTypeForm.name.trim()) {
      notification.error({ message: "Please enter a name for the appointment type" })
      return
    }
    if (!appointmentTypeForm.duration || appointmentTypeForm.duration < 5) {
      notification.error({ message: "Please enter a valid duration (min. 5 minutes)" })
      return
    }
    if (!appointmentTypeForm.interval || appointmentTypeForm.interval < 5) {
      notification.error({ message: "Please enter a valid interval (min. 5 minutes)" })
      return
    }
    if (appointmentTypeForm.slotsRequired === undefined || appointmentTypeForm.slotsRequired === null || appointmentTypeForm.slotsRequired === "") {
      notification.error({ message: "Please enter the slots required" })
      return
    }
    if (!appointmentTypeForm.maxParallel || appointmentTypeForm.maxParallel < 1) {
      notification.error({ message: "Please enter max parallel (min. 1)" })
      return
    }
    if (appointmentTypeForm.contingentUsage === undefined || appointmentTypeForm.contingentUsage === null || appointmentTypeForm.contingentUsage === "") {
      notification.error({ message: "Please enter the contingent usage" })
      return
    }
    
    if (editingAppointmentType) {
      // Update existing
      setAppointmentTypes(appointmentTypes.map(t => 
        t.id === editingAppointmentType.id 
          ? { ...t, ...appointmentTypeForm }
          : t
      ))
      notification.success({ message: "Appointment type updated" })
    } else {
      // Create new
      setAppointmentTypes([...appointmentTypes, {
        id: Date.now(),
        ...appointmentTypeForm
      }])
      notification.success({ message: "Appointment type created" })
    }
    
    setShowAppointmentTypeModal(false)
    setEditingAppointmentType(null)
  }

  const handleDeleteAppointmentType = (id) => {
    Modal.confirm({
      title: "Delete Appointment Type",
      content: "Are you sure you want to delete this appointment type? This cannot be undone.",
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        setAppointmentTypes(appointmentTypes.filter(t => t.id !== id))
        notification.success({ message: "Appointment type deleted" })
      }
    })
  }

  // Image upload handlers for appointment types
  const handleAppointmentImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setTempImage(event.target.result)
        setShowImageCropModal(true)
      }
      reader.readAsDataURL(file)
    }
    // Reset input
    if (appointmentImageInputRef.current) {
      appointmentImageInputRef.current.value = ""
    }
  }

  const handleCroppedImage = (croppedImage) => {
    setAppointmentTypeForm({ ...appointmentTypeForm, image: croppedImage })
    setShowImageCropModal(false)
    setTempImage(null)
  }

  const handleMediaLibrarySelect = (imageUrl) => {
    // Set the image from media library - it will go through crop modal
    setTempImage(imageUrl)
    setShowMediaLibraryModal(false)
    setShowImageCropModal(true)
  }

  const handleAddAppointmentType = () => {
    handleOpenAppointmentTypeModal(null)
  }

  const handleUpdateAppointmentType = (index, field, value) => {
    const updated = [...appointmentTypes]
    updated[index][field] = value
    setAppointmentTypes(updated)
  }

  const handleRemoveAppointmentType = (index) => {
    Modal.confirm({
      title: "Remove Appointment Type",
      content: "Are you sure? This cannot be undone.",
      okText: "Remove",
      okType: "danger",
      onOk: () => setAppointmentTypes(appointmentTypes.filter((_, i) => i !== index))
    })
  }

  // Category handlers
  const handleAddCategory = () => {
    setAppointmentCategories([...appointmentCategories, "New Category"])
    setEditingCategory({ index: appointmentCategories.length, value: "New Category" })
  }

  const handleRemoveCategory = (index) => {
    const category = appointmentCategories[index]
    if (appointmentTypes.some(t => t.category === category)) {
      notification.error({ message: "Cannot remove", description: "Category is in use" })
      return
    }
    setAppointmentCategories(appointmentCategories.filter((_, i) => i !== index))
  }

  // Contract handlers
  const handleAddContractType = () => {
    setEditingContractType({
      id: Date.now(),
      name: "",
      duration: 12,
      cost: 0,
      billingPeriod: defaultBillingPeriod,
      userCapacity: defaultAppointmentLimit,
      autoRenewal: defaultAutoRenewal,
      renewalPeriod: defaultRenewalPeriod,
      renewalPrice: 0,
      renewalIndefinite: defaultRenewalIndefinite,
      cancellationPeriod: noticePeriod,
      contractFormId: null,
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
    if (!editingContractType.name.trim()) {
      notification.error({ message: "Please enter a contract name" })
      return
    }
    if (!editingContractType.duration || editingContractType.duration < 1) {
      notification.error({ message: "Please enter a valid duration" })
      return
    }
    if (!editingContractType.billingPeriod) {
      notification.error({ message: "Please select a billing period" })
      return
    }
    if (editingContractType.userCapacity === undefined || editingContractType.userCapacity === null || editingContractType.userCapacity === "") {
      notification.error({ message: "Please enter a contingent value (0 for unlimited)" })
      return
    }
    if (contractForms.length === 0) {
      notification.error({ message: "Please create a contract form first" })
      return
    }
    if (!editingContractType.contractFormId) {
      notification.error({ message: "Please select a contract form" })
      return
    }
    
    if (editingContractTypeIndex !== null) {
      const updated = [...contractTypes]
      updated[editingContractTypeIndex] = editingContractType
      setContractTypes(updated)
      notification.success({ message: "Contract type updated" })
    } else {
      setContractTypes([...contractTypes, editingContractType])
      notification.success({ message: "Contract type created" })
    }
    
    setContractTypeModalVisible(false)
    setEditingContractType(null)
    setEditingContractTypeIndex(null)
  }

  const handleDeleteContractType = (index) => {
    const type = contractTypes[index]
    Modal.confirm({
      title: "Delete Contract Type",
      content: `Are you sure you want to delete "${type.name || 'this contract type'}"?`,
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        setContractTypes(contractTypes.filter((_, i) => i !== index))
        notification.success({ message: "Contract type deleted" })
      }
    })
  }

  const handleCreateContractForm = () => {
    if (!newContractFormName.trim()) {
      notification.error({ message: "Please enter a name" })
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
  }

  // Lead source handlers
  const handleAddLeadSource = () => {
    setLeadSources([...leadSources, { id: Date.now(), name: "", color: "#3B82F6" }])
  }

  const handleUpdateLeadSource = (id, field, value) => {
    setLeadSources(leadSources.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const handleRemoveLeadSource = (id) => {
    setLeadSources(leadSources.filter(s => s.id !== id))
  }

  // VAT handlers
  const handleAddVatRate = () => {
    setVatRates([...vatRates, { name: "", percentage: 0, description: "" }])
  }

  // Navigate to section
  const navigateToSection = (categoryId, sectionId) => {
    setActiveCategory(categoryId)
    setActiveSection(sectionId)
    if (!expandedCategories.includes(categoryId)) {
      setExpandedCategories([...expandedCategories, categoryId])
    }
    setMobileShowContent(true)
  }

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    )
  }

  // Search filter with auto-expand
  const filteredNavItems = searchQuery
    ? navigationItems.filter(cat =>
        cat.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.sections.some(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : navigationItems

  // Auto-expand categories that match search
  useEffect(() => {
    if (searchQuery) {
      const matchingCategories = navigationItems
        .filter(cat =>
          cat.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.sections.some(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .map(cat => cat.id)
      
      setExpandedCategories(prev => {
        const newExpanded = [...new Set([...prev, ...matchingCategories])]
        return newExpanded
      })
    }
  }, [searchQuery])

  // Helper to check if text matches search query
  const matchesSearch = (text) => {
    if (!searchQuery) return false
    return text.toLowerCase().includes(searchQuery.toLowerCase())
  }

  // Helper to escape regex special characters
  const escapeRegex = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  // Helper to highlight matching text
  const highlightText = (text) => {
    if (!searchQuery) return text
    try {
      const escaped = escapeRegex(searchQuery)
      const regex = new RegExp(`(${escaped})`, 'gi')
      const parts = text.split(regex)
      return parts.map((part, i) => 
        part.toLowerCase() === searchQuery.toLowerCase() ? (
          <span key={i} className="bg-primary/30 text-orange-300 rounded px-0.5">{part}</span>
        ) : part
      )
    } catch {
      return text
    }
  }

  // ============================================
  // Render Section Content
  // ============================================
  const renderSectionContent = () => {
    switch (activeSection) {
      // ========================
      // PROFILE SECTIONS
      // ========================
      case "profile-details":
        return (
          <div className="space-y-6">
            <SectionHeader title="Personal Details" description="Manage your personal information" />
            
            {/* Profile Picture Upload */}
            <SettingsCard>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-surface-card flex-shrink-0">
                  <img src={profilePreviewUrl || DefaultAvatar} alt="Profile Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-content-primary font-medium mb-2">Profile Picture</h3>
                  <p className="text-xs sm:text-sm text-content-muted mb-4">Upload your profile picture</p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <label className="px-4 py-2 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 inline-block mr-2" />
                      Upload Picture
                      <input
                        type="file"
                        accept="image/*"
                        ref={profileFileInputRef}
                        onChange={handleProfileImageChange}
                        className="hidden"
                      />
                    </label>
                    {profilePreviewUrl && (
                      <button
                        onClick={() => { setProfileData(prev => ({ ...prev, profilePicture: null })); setProfilePreviewUrl(null) }}
                        className="px-4 py-2 text-red-400 text-sm hover:bg-red-500/10 rounded-xl transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </SettingsCard>

            {/* Personal Information */}
            <SettingsCard>
              <h3 className="text-content-primary font-medium mb-4">Personal Information</h3>
              <div className="max-w-2xl space-y-4">
                {/* First + Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="First Name"
                    value={profileData.firstName}
                    onChange={(v) => handleProfileInputChange("firstName", v)}
                    placeholder="Enter first name"
                  />
                  <InputField
                    label="Last Name"
                    value={profileData.lastName}
                    onChange={(v) => handleProfileInputChange("lastName", v)}
                    placeholder="Enter last name"
                  />
                </div>

                {/* Birthday + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-content-secondary">Birthday</label>
                    <div className="w-full flex items-center justify-between bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm border border-border">
                      <span className={profileData.birthday ? "text-content-primary" : "text-content-faint"}>{profileData.birthday ? (() => { const [y,m,d] = profileData.birthday.split('-'); return `${d}.${m}.${y}` })() : "Select date"}</span>
                      <DatePickerField value={profileData.birthday} onChange={(val) => handleProfileInputChange("birthday", val)} />
                    </div>
                  </div>
                  <InputField
                    label="Email"
                    value={profileData.email}
                    onChange={(v) => handleProfileInputChange("email", v)}
                    placeholder="Enter email"
                    type="email"
                  />
                </div>

                {/* Phone + Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Telephone Number"
                    value={profileData.phone}
                    onChange={(v) => handleProfileInputChange("phone", v)}
                    placeholder="Enter telephone number"
                  />
                  <InputField
                    label="Mobile Number"
                    value={profileData.mobile}
                    onChange={(v) => handleProfileInputChange("mobile", v)}
                    placeholder="Enter mobile number"
                  />
                </div>

                {/* Street + ZIP */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <InputField
                      label="Street"
                      value={profileData.street}
                      onChange={(v) => handleProfileInputChange("street", v)}
                      placeholder="Enter street address"
                    />
                  </div>
                  <InputField
                    label="ZIP Code"
                    value={profileData.zipCode}
                    onChange={(v) => handleProfileInputChange("zipCode", v)}
                    placeholder="ZIP"
                  />
                </div>

                {/* City + Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="City"
                    value={profileData.city}
                    onChange={(v) => handleProfileInputChange("city", v)}
                    placeholder="Enter city"
                  />
                  <SelectField
                    label="Country"
                    value={profileData.country}
                    onChange={(v) => handleProfileInputChange("country", v)}
                    options={countries.map(c => ({ value: c.code, label: c.name }))}
                    placeholder="Select country"
                    searchable
                  />
                </div>
              </div>
            </SettingsCard>
          </div>
        )

      case "profile-access":
        return (
          <div className="space-y-6">
            <SectionHeader title="Access Data" description="Manage your login credentials" />
            
            <SettingsCard>
              <div className="max-w-md space-y-4">
                <InputField
                  label="Username"
                  value={profileData.username}
                  onChange={(v) => handleProfileInputChange("username", v)}
                  placeholder="Enter username"
                />

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-content-secondary">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={profileData.password}
                      onChange={(e) => handleProfileInputChange("password", e.target.value)}
                      className="w-full px-4 py-2.5 pr-12 rounded-xl bg-surface-card border border-border outline-none text-sm text-content-primary focus:border-accent-blue"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </SettingsCard>

            <SettingsCard>
              <div className="max-w-md space-y-4">
                <h3 className="text-content-primary font-medium">Security</h3>
                <p className="text-sm text-content-muted">
                  For your security, we recommend changing your password regularly and using a strong, unique password.
                </p>
                <button className="px-4 py-2 bg-surface-button text-content-primary text-sm rounded-xl hover:bg-surface-button-hover transition-colors">
                  Change Password
                </button>
              </div>
            </SettingsCard>
          </div>
        )

      // ========================
      // STUDIO SECTIONS
      // ========================
      case "studio-info":
        return (
          <div className="space-y-6">
            <SectionHeader title="Studio Information" description="Basic information about your studio" />
            
            {/* Logo Upload */}
            <SettingsCard>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-surface-card flex-shrink-0">
                  <img src={logoUrl || DefaultAvatar} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-content-primary font-medium mb-2">Studio Logo</h3>
                  <p className="text-xs sm:text-sm text-content-muted mb-4">Upload your studio logo (recommended: 1000x1000px)</p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <label className="px-4 py-2 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 inline-block mr-2" />
                      Upload Logo
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                    {logoUrl && (
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

            {/* Studio Details */}
            <SettingsCard>
              <h3 className="text-content-primary font-medium mb-4">Studio Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-content-secondary">Studio ID</label>
                  <input
                    type="text"
                    value={studioId}
                    disabled
                    className="w-full bg-surface-dark text-content-faint rounded-xl px-4 py-2.5 text-sm outline-none border border-border cursor-not-allowed"
                  />
                </div>
                <InputField
                  label="Studio Name"
                  value={studioName}
                  onChange={setStudioName}
                  placeholder="Enter studio name"
                  required
                  maxLength={50}
                />
                <InputField
                  label="Telephone Number"
                  value={studioPhoneNo}
                  onChange={(v) => setStudioPhoneNo(v.replace(/\D/g, ""))}
                  placeholder="Enter telephone number"
                  maxLength={15}
                />
                <InputField
                  label="Mobile Number"
                  value={studioMobileNo}
                  onChange={(v) => setStudioMobileNo(v.replace(/\D/g, ""))}
                  placeholder="Enter mobile number"
                  maxLength={15}
                />
                <InputField
                  label="Email"
                  value={studioEmail}
                  onChange={setStudioEmail}
                  placeholder="Enter email"
                  type="email"
                  maxLength={60}
                />
                <InputField
                  label="Website"
                  value={studioWebsite}
                  onChange={setStudioWebsite}
                  placeholder="https://your-studio.com"
                  maxLength={50}
                />
              </div>
            </SettingsCard>

            {/* Studio Address */}
            <SettingsCard>
              <h3 className="text-content-primary font-medium mb-4">Studio Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Street & Number"
                  value={studioStreet}
                  onChange={setStudioStreet}
                  placeholder="Enter street address"
                  required
                  maxLength={60}
                />
                <InputField
                  label="ZIP Code"
                  value={studioZipCode}
                  onChange={setStudioZipCode}
                  placeholder="Enter ZIP code"
                  required
                  maxLength={10}
                />
                <InputField
                  label="City"
                  value={studioCity}
                  onChange={setStudioCity}
                  placeholder="Enter city"
                  required
                  maxLength={40}
                />
                <SelectField
                  label="Country"
                  value={studioCountry}
                  onChange={setStudioCountry}
                  options={countries.map(c => ({ value: c.code, label: c.name }))}
                  placeholder="Select country"
                  required
                  searchable
                />
              </div>
            </SettingsCard>

            {/* Studio Operator */}
            <SettingsCard>
              <h3 className="text-content-primary font-medium mb-4">Studio Operator</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <InputField
                    label="Operator Name"
                    value={studioOperator}
                    onChange={setStudioOperator}
                    placeholder="Enter operator name"
                    required
                    maxLength={50}
                  />
                </div>
                <InputField
                  label="Email"
                  value={studioOperatorEmail}
                  onChange={setStudioOperatorEmail}
                  placeholder="Enter operator email"
                  type="email"
                  maxLength={60}
                />
                <InputField
                  label="Telephone Number"
                  value={studioOperatorPhone}
                  onChange={(v) => setStudioOperatorPhone(v.replace(/\D/g, ""))}
                  placeholder="Enter telephone number"
                  maxLength={15}
                />
                <InputField
                  label="Mobile Number"
                  value={studioOperatorMobile}
                  onChange={(v) => setStudioOperatorMobile(v.replace(/\D/g, ""))}
                  placeholder="Enter mobile number"
                  maxLength={15}
                />
              </div>
            </SettingsCard>
          </div>
        )

      case "opening-hours":
        return (
          <div className="space-y-6">
            <SectionHeader title="Opening Hours" description="Set your studio's weekly schedule" />
            <SettingsCard>
              <div className="space-y-3">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                  const existingHour = openingHours.find(h => h.day === day)
                  const hour = existingHour || { day, startTime: null, endTime: null, closed: day === 'Sunday' }
                  const isClosed = hour.closed
                  
                  return (
                    <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-surface-card rounded-xl">
                      <div className="flex items-center justify-between sm:w-32">
                        <span className="text-content-primary font-medium text-sm sm:text-base">{day}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-1 flex-wrap sm:flex-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            const newClosed = !isClosed
                            if (existingHour) {
                              setOpeningHours(openingHours.map(h =>
                                h.day === day ? { ...h, closed: newClosed } : h
                              ))
                            } else {
                              setOpeningHours([...openingHours, { 
                                day, 
                                startTime: newClosed ? null : '09:00', 
                                endTime: newClosed ? null : '21:00', 
                                closed: newClosed 
                              }])
                            }
                          }}
                          className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                            !isClosed ? "bg-primary" : "bg-surface-button"
                          }`}
                        >
                          <span
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${
                              !isClosed ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span className="text-sm text-content-muted w-12">{isClosed ? "Closed" : "Open"}</span>
                        
                        {!isClosed && (
                          <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
                            <input
                              type="time"
                              value={hour.startTime || ""}
                              onChange={(e) => {
                                if (existingHour) {
                                  setOpeningHours(openingHours.map(h =>
                                    h.day === day ? { ...h, startTime: e.target.value } : h
                                  ))
                                } else {
                                  setOpeningHours([...openingHours, { 
                                    day, 
                                    startTime: e.target.value, 
                                    endTime: '21:00', 
                                    closed: false 
                                  }])
                                }
                              }}
                              className="bg-surface-hover text-content-primary rounded-lg px-2 sm:px-3 py-2 text-sm border border-border flex-1 sm:flex-none"
                            />
                            <span className="text-content-muted text-sm">to</span>
                            <input
                              type="time"
                              value={hour.endTime || ""}
                              onChange={(e) => {
                                if (existingHour) {
                                  setOpeningHours(openingHours.map(h =>
                                    h.day === day ? { ...h, endTime: e.target.value } : h
                                  ))
                                } else {
                                  setOpeningHours([...openingHours, { 
                                    day, 
                                    startTime: '09:00', 
                                    endTime: e.target.value, 
                                    closed: false 
                                  }])
                                }
                              }}
                              className="bg-surface-hover text-content-primary rounded-lg px-2 sm:px-3 py-2 text-sm border border-border flex-1 sm:flex-none"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </SettingsCard>
          </div>
        )

      case "closing-days":
        return (
          <div className="space-y-6">
            <SectionHeader
              title="Closing Days"
              description="Define days when your studio is closed"
              action={
                <div className="flex flex-col sm:flex-row gap-2">
                  {studioCountry && (
                    <button
                      onClick={addPublicHolidaysToClosingDays}
                      disabled={isLoadingHolidays}
                      className="px-3 sm:px-4 py-2 bg-surface-button text-content-primary text-sm rounded-xl hover:bg-surface-button-hover transition-colors flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Import Holidays
                    </button>
                  )}
                  <button
                    onClick={() => setClosingDays([...closingDays, { date: "", description: "" }])}
                    className="px-3 sm:px-4 py-2 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Day
                  </button>
                </div>
              }
            />
            
            {studioCountry && publicHolidays.length > 0 && (
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                <p className="text-primary text-sm">
                  <Info className="w-4 h-4 inline-block mr-2" />
                  {publicHolidays.length} public holidays available for {countries.find(c => c.code === studioCountry)?.name}
                </p>
              </div>
            )}

            <SettingsCard>
              {closingDays.length === 0 ? (
                <div className="text-center py-8 text-content-muted">
                  <CalendarOff className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No closing days configured</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {closingDays.map((day, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-3 p-3 bg-surface-card rounded-xl">
                      <div className="w-full sm:w-44">
                        <div className="w-full flex items-center justify-between bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm border border-border">
                          <span className={day.date ? "text-content-primary" : "text-content-faint"}>{day.date ? (() => { const [y,m,d] = (day.date || "").split('-'); return `${d}.${m}.${y}` })() : "Select date"}</span>
                          <DatePickerField
                            value={day.date || ""}
                            onChange={(val) => {
                              const updated = [...closingDays]
                              updated[index].date = val
                              setClosingDays(updated)
                            }}
                          />
                        </div>
                      </div>
                      <input
                        type="text"
                        value={day.description || ""}
                        onChange={(e) => {
                          const updated = [...closingDays]
                          updated[index].description = e.target.value
                          setClosingDays(updated)
                        }}
                        placeholder="Description (e.g., Public Holiday)"
                        className="bg-surface-hover text-content-primary rounded-lg px-3 py-2 text-sm border border-border flex-1"
                      />
                      <button
                        onClick={() => setClosingDays(closingDays.filter((_, i) => i !== index))}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors self-end sm:self-center"
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
      // APPOINTMENT SECTIONS
      // ========================
      case "calendar-settings":
        return (
          <div className="space-y-6">
            <SectionHeader title="Calendar Settings" description="Configure how the calendar displays appointments" />
            
            {/* Hide Closed Days - Above Preview */}
            <SettingsCard>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-content-primary block">Hide Closed Days</label>
                  <p className="text-xs text-content-faint mt-1">
                    When enabled, days marked as closed in opening hours (e.g., weekends) will not appear as columns in week/day view
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={calendarSettings.hideClosedDays}
                    onChange={(e) => setCalendarSettings({
                      ...calendarSettings,
                      hideClosedDays: e.target.checked
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-button peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              {/* Week View Preview */}
              <div className="mt-4 p-4 bg-surface-card rounded-xl overflow-x-auto">
                <p className="text-xs text-content-faint mb-3">Preview:</p>
                <div className="flex gap-1 min-w-[400px]">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                    const isWeekend = day === 'Sat' || day === 'Sun';
                    const isHidden = calendarSettings.hideClosedDays && isWeekend;
                    
                    if (isHidden) return null;
                    
                    return (
                      <div 
                        key={day}
                        className={`flex-1 min-w-[50px] text-center py-3 rounded-lg ${
                          isWeekend 
                            ? 'bg-gray-700/30 text-content-faint' 
                            : 'bg-surface-hover text-content-primary'
                        }`}
                      >
                        <span className="text-xs font-medium">{day}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-content-faint mt-3 text-center">
                  {calendarSettings.hideClosedDays 
                    ? 'Showing Monday - Friday (closed days hidden)'
                    : 'Showing all days including weekends'
                  }
                </p>
              </div>
            </SettingsCard>

            {/* Calendar Time Range */}
            <SettingsCard>
              <h4 className="text-content-primary font-medium mb-4">Calendar Time Range</h4>
              <p className="text-xs text-content-faint mb-4">
                Set the visible time range for the calendar. Times outside this range will not be displayed.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-content-muted w-16">Start</label>
                  <input
                    type="time"
                    value={calendarSettings.calendarStartTime}
                    onChange={(e) => setCalendarSettings({
                      ...calendarSettings,
                      calendarStartTime: e.target.value
                    })}
                    className="bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                  />
                </div>
                <span className="text-content-faint hidden sm:block">—</span>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-content-muted w-16">End</label>
                  <input
                    type="time"
                    value={calendarSettings.calendarEndTime}
                    onChange={(e) => setCalendarSettings({
                      ...calendarSettings,
                      calendarEndTime: e.target.value
                    })}
                    className="bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                  />
                </div>
              </div>
            </SettingsCard>

            {/* Fade Past Appointments */}
            <SettingsCard>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-content-primary block">Fade Past Appointments</label>
                  <p className="text-xs text-content-faint mt-1">
                    When enabled, past appointments will be displayed with reduced opacity to distinguish them from upcoming ones
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={calendarSettings.fadePastAppointments}
                    onChange={(e) => setCalendarSettings({
                      ...calendarSettings,
                      fadePastAppointments: e.target.checked
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-button peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              {/* Preview */}
              <div className="mt-4 p-4 bg-surface-card rounded-xl">
                <p className="text-xs text-content-faint mb-3">Preview:</p>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <p className="text-[10px] text-content-faint mb-1.5 text-center">Past</p>
                    <div 
                      className={`p-3 rounded-lg bg-accent-blue ${calendarSettings.fadePastAppointments ? 'opacity-45' : ''}`}
                    >
                      <span className="text-xs text-white font-medium">EMS Training</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-content-faint mb-1.5 text-center">Upcoming</p>
                    <div className="p-3 rounded-lg bg-accent-blue">
                      <span className="text-xs text-white font-medium">EMS Training</span>
                    </div>
                  </div>
                </div>
              </div>
            </SettingsCard>
          </div>
        )

      case "capacity":
        return (
          <div className="space-y-6">
            <SectionHeader title="Capacity Settings" description="Control how many appointments can run simultaneously" />
            
            <SettingsCard>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-content-secondary mb-2 block">Total Studio Capacity</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={studioCapacity}
                      onChange={(e) => setStudioCapacity(Math.max(1, Math.floor(parseInt(e.target.value) || 1)))}
                      onKeyDown={(e) => {
                        if (e.key === '.' || e.key === ',') e.preventDefault()
                      }}
                      min={1}
                      max={100}
                      step={1}
                      className="w-24 bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                    />
                    <span className="text-sm text-content-muted">slots</span>
                  </div>
                  <p className="text-xs text-content-faint mt-2">
                    The maximum number of slots that can be used at the same time across all appointments.
                  </p>
                </div>
              </div>
            </SettingsCard>

            <SettingsCard className="bg-surface-card">
              <h4 className="text-content-primary font-medium mb-3">How Capacity Works</h4>
              <div className="space-y-3 text-sm text-content-muted">
                <div className="flex gap-3">
                  <span className="text-primary font-medium w-32 flex-shrink-0">Slots Required</span>
                  <span>How many capacity slots each appointment uses. Set to 0 if the appointment doesn't block any capacity.</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary font-medium w-32 flex-shrink-0">Max Parallel</span>
                  <span>The maximum number of this appointment type that can run at the same time.</span>
                </div>
              </div>
              <div className="mt-4 p-4 bg-surface-card rounded-xl">
                <p className="text-sm text-content-secondary font-medium mb-2">Example with 3 total slots:</p>
                <div className="space-y-1.5 text-xs text-content-faint">
                  <p>• <span className="text-content-secondary">EMS Strength</span> (1 slot, max 2×) – Can run twice in parallel, uses 2 slots total</p>
                  <p>• <span className="text-content-secondary">Body Check</span> (2 slots, max 1×) – Uses 2 slots, only 1 slot left for other appointments</p>
                  <p>• <span className="text-content-secondary">Trial Training</span> (3 slots, max 1×) – Uses all capacity, blocks all other bookings</p>
                  <p>• <span className="text-content-secondary">EMP Chair</span> (0 slots, max 1×) – Doesn't use any capacity, runs independently</p>
                </div>
              </div>
            </SettingsCard>

            {appointmentTypes.length > 0 && (
              <SettingsCard>
                <h4 className="text-content-primary font-medium mb-4">Current Configuration</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-3 py-2 text-xs text-content-faint border-b border-border">
                    <span>Appointment Type</span>
                    <div className="flex items-center gap-8">
                      <span className="w-20 text-center">Slots</span>
                      <span className="w-20 text-center">Max Parallel</span>
                    </div>
                  </div>
                  {appointmentTypes.map((type) => (
                    <div key={type.id} className="flex items-center justify-between p-3 bg-surface-card rounded-xl">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: type.color }}
                        />
                        <span className="text-content-primary">{type.name}</span>
                      </div>
                      <div className="flex items-center gap-8 text-sm">
                        <span className="w-20 text-center text-content-muted">{type.slotsRequired ?? 1}</span>
                        <span className="w-20 text-center text-content-muted">{type.maxParallel || 1}×</span>
                      </div>
                    </div>
                  ))}
                </div>
              </SettingsCard>
            )}
          </div>
        )

      case "appointment-types":
        return (
          <div className="space-y-6">
            <SectionHeader
              title="Appointment Types"
              description="Configure the types of appointments members can book"
              action={
                <button
                  onClick={() => handleOpenAppointmentTypeModal(null)}
                  className="px-4 py-2 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Type
                </button>
              }
            />
            
            {appointmentTypes.length === 0 ? (
              <SettingsCard>
                <div className="text-center py-12 text-content-muted">
                  <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-content-primary mb-2">No appointment types yet</h3>
                  <p className="text-sm mb-6">Create your first appointment type that members can book</p>
                  <button
                    onClick={() => handleOpenAppointmentTypeModal(null)}
                    className="px-6 py-2.5 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover transition-colors inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Appointment Type
                  </button>
                </div>
              </SettingsCard>
            ) : (
              <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {appointmentTypes.map((type) => (
                  <div
                    key={type.id}
                    className="bg-surface-hover rounded-xl overflow-hidden border border-border hover:border-border transition-colors group"
                  >
                    {/* Image */}
                    <div className="relative aspect-video bg-surface-card">
                      {type.image ? (
                        <img
                          src={type.image}
                          alt={type.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Calendar className="w-12 h-12 text-content-faint" />
                        </div>
                      )}
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Category badge - blue like member view */}
                      {type.category && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-secondary backdrop-blur-sm text-white text-xs font-medium rounded-full">
                          {type.category}
                        </div>
                      )}
                      
                      {/* Info button with popup - shows on hover and click */}
                      {type.description && (
                        <div className="absolute top-3 right-3 group/info">
                          <button
                            className="flex items-center justify-center bg-primary w-7 h-7 rounded-full hover:bg-primary-hover transition-colors"
                          >
                            <Info className="w-4 h-4 text-white" />
                          </button>
                          {/* Popup - shows on hover or focus */}
                          <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-surface-hover border border-border rounded-xl shadow-xl opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible group-focus-within/info:opacity-100 group-focus-within/info:visible transition-all z-50">
                            <p className="text-content-secondary text-sm">{type.description}</p>
                            <div className="absolute -top-2 right-3 w-3 h-3 bg-surface-hover border-l border-t border-border rotate-45" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-4">
                      {/* Title with color indicator */}
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: type.color }}
                          title="Calendar color"
                        />
                        <h3 className="text-content-primary font-medium truncate">{type.name || "Untitled"}</h3>
                      </div>
                      
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-content-faint">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {type.duration} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Settings className="w-3.5 h-3.5" />
                          {type.slotsRequired ?? 1} {(type.slotsRequired ?? 1) === 1 ? 'slot' : 'slots'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {type.maxParallel || 1}× parallel
                        </span>
                        <span className="flex items-center gap-1">
                          <BadgeDollarSign className="w-3.5 h-3.5" />
                          {type.contingentUsage ?? 1} credit{(type.contingentUsage ?? 1) !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                      
                    {/* Actions */}
                    <div className="px-4 py-3 bg-surface-card border-t border-border flex gap-2">
                        <button
                          onClick={() => handleOpenAppointmentTypeModal(type)}
                          className="flex-1 px-3 py-2 bg-surface-button text-content-primary text-sm rounded-lg hover:bg-surface-button-hover transition-colors flex items-center justify-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAppointmentType(type.id)}
                          className="px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case "appointment-categories":
        return (
          <div className="space-y-6">
            <SectionHeader
              title="Appointment Categories"
              description="Organize appointment types into categories"
              action={
                <button
                  onClick={handleAddCategory}
                  className="px-3 sm:px-4 py-2 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span> Category
                </button>
              }
            />
            <SettingsCard>
              <div className="flex flex-wrap gap-2">
                {appointmentCategories.map((category, index) => (
                  <div key={index} className="group relative">
                    {editingCategory.index === index ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editingCategory.value}
                          onChange={(e) => setEditingCategory({ ...editingCategory, value: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const updated = [...appointmentCategories]
                              updated[index] = editingCategory.value.trim() || category
                              setAppointmentCategories(updated)
                              setEditingCategory({ index: null, value: "" })
                            }
                            if (e.key === 'Escape') {
                              setEditingCategory({ index: null, value: "" })
                            }
                          }}
                          autoFocus
                          className="bg-surface-card text-content-primary rounded-lg px-3 py-1.5 text-sm border border-accent-blue w-32"
                        />
                        <button
                          onClick={() => {
                            const updated = [...appointmentCategories]
                            updated[index] = editingCategory.value.trim() || category
                            setAppointmentCategories(updated)
                            setEditingCategory({ index: null, value: "" })
                          }}
                          className="p-1 text-green-400 hover:bg-green-500/10 rounded"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingCategory({ index: null, value: "" })}
                          className="p-1 text-red-400 hover:bg-red-500/10 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="flex items-center gap-1 px-3 py-1.5 bg-secondary/20 text-secondary rounded-lg text-sm cursor-pointer hover:bg-secondary/30 transition-colors"
                        onClick={() => setEditingCategory({ index, value: category })}
                      >
                        {category}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveCategory(index)
                          }}
                          className="ml-1 p-0.5 text-secondary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-content-faint mt-4">
                Click a category to edit. Categories in use cannot be deleted.
              </p>
            </SettingsCard>
          </div>
        )

      case "trial-training":
        return (
          <div className="space-y-6">
            <SectionHeader title="Trial Training" description="Configure trial training settings for new members" />
            <SettingsCard>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                    <Clock className="w-4 h-4 text-content-faint" />
                    Duration
                    <Tooltip content="How long the trial training session lasts in minutes">
                      <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                    </Tooltip>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={trialTraining.duration}
                      onChange={(e) => setTrialTraining({ ...trialTraining, duration: Math.floor(Number(e.target.value)) })}
                      onKeyDown={(e) => { if (e.key === '.' || e.key === ',') e.preventDefault() }}
                      min={15}
                      max={180}
                      className="w-24 bg-surface-card text-content-primary rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                    />
                    <span className="text-sm text-content-muted">min</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                    <Settings className="w-4 h-4 text-content-faint" />
                    Slots
                    <Tooltip content="How many capacity slots the trial training uses. Set to max to block all other bookings.">
                      <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                    </Tooltip>
                  </label>
                  <input
                    type="number"
                    value={trialTraining.slotsRequired}
                    onChange={(e) => setTrialTraining({ ...trialTraining, slotsRequired: Math.floor(Number(e.target.value)) })}
                    onKeyDown={(e) => { if (e.key === '.' || e.key === ',') e.preventDefault() }}
                    min={0}
                    max={studioCapacity}
                    className="w-24 bg-surface-card text-content-primary rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                    <Users className="w-4 h-4 text-content-faint" />
                    Max Parallel
                    <Tooltip content="Maximum number of trial trainings that can run at the same time">
                      <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                    </Tooltip>
                  </label>
                  <input
                    type="number"
                    value={trialTraining.maxParallel}
                    onChange={(e) => setTrialTraining({ ...trialTraining, maxParallel: Math.floor(Number(e.target.value)) })}
                    onKeyDown={(e) => { if (e.key === '.' || e.key === ',') e.preventDefault() }}
                    min={1}
                    max={studioCapacity}
                    className="w-24 bg-surface-card text-content-primary rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                    Calendar Color
                    <Tooltip content="The color used to display trial trainings in the calendar" position="right">
                      <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                    </Tooltip>
                  </label>
                  <input
                    type="color"
                    value={trialTraining.color}
                    onChange={(e) => setTrialTraining({ ...trialTraining, color: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-border p-1"
                  />
                </div>
              </div>
            </SettingsCard>
          </div>
        )

      // ========================
      // STAFF SECTIONS
      // ========================
      case "staff-defaults":
        return (
          <div className="space-y-6">
            <SectionHeader title="Staff Default Settings" description="Default values for new staff members" />
            
            {/* Info Box */}
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-primary">
                    These settings are automatically applied when creating new staff members. You can always adjust them individually for each staff member later.
                  </p>
                </div>
              </div>
            </div>

            <SettingsCard>
              <div className="space-y-6">
                <NumberInput
                  label="Default Vacation Days"
                  value={defaultVacationDays}
                  onChange={setDefaultVacationDays}
                  min={0}
                  max={365}
                  suffix="days per year"
                />
                <SelectField
                  label="Default Staff Role"
                  value={defaultStaffRole}
                  onChange={setDefaultStaffRole}
                  options={roles.filter(r => !r.isAdmin).map(r => ({ value: r.id, label: r.name }))}
                  placeholder="Select default role"
                />
                <SelectField
                  label="Default Staff Country"
                  value={defaultStaffCountry}
                  onChange={setDefaultStaffCountry}
                  options={[
                    { value: "studio", label: "Same as Studio Country" },
                    ...countries.map(c => ({ value: c.code, label: c.name }))
                  ]}
                  searchable
                />
              </div>
            </SettingsCard>
          </div>
        )

      case "staff-roles":
        return (
          <div className="space-y-6">
            <SectionHeader
              title="Staff Roles & Permissions"
              description="Define roles and their permissions"
              action={
                <button
                  onClick={handleAddRole}
                  className="px-3 sm:px-4 py-2 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span> Role
                </button>
              }
            />
            <div className="space-y-3">
              {roles.map((role, index) => (
                <SettingsCard key={role.id}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Color Picker */}
                    <input
                      type="color"
                      value={role.color || "#3B82F6"}
                      onChange={(e) => handleUpdateRole(index, "color", e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-border p-1 flex-shrink-0"
                    />
                    
                    {/* Role Name */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={role.name}
                          onChange={(e) => handleUpdateRole(index, "name", e.target.value)}
                          placeholder="Enter role name"
                          className="w-full bg-transparent text-content-primary text-lg font-medium outline-none border-b border-transparent hover:border-border focus:border-primary transition-colors pb-1"
                        />
                        {role.isAdmin && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded flex-shrink-0">Admin</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          setSelectedRoleIndex(index)
                          setPermissionModalVisible(true)
                        }}
                        className="px-3 py-2 bg-surface-button text-content-primary text-sm rounded-xl hover:bg-surface-button-hover transition-colors flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        <span className="hidden sm:inline">Permissions</span>
                        <span className="bg-surface-button-hover px-1.5 py-0.5 rounded text-xs">{role.permissions?.length || 0}</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRoleForAssignment(index)
                          setStaffAssignmentModalVisible(true)
                        }}
                        className="px-3 py-2 bg-surface-button text-content-primary text-sm rounded-xl hover:bg-surface-button-hover transition-colors flex items-center gap-2"
                      >
                        <Users className="w-4 h-4" />
                        <span className="hidden sm:inline">Staff</span>
                        <span className="bg-surface-button-hover px-1.5 py-0.5 rounded text-xs">{role.staffCount || 0}</span>
                      </button>
                      <button
                        onClick={() => handleCopyRole(index)}
                        className="p-2 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"
                        title="Duplicate role"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {/* Delete button - invisible placeholder for admin to keep alignment */}
                      {role.isAdmin ? (
                        <div className="w-9 h-9" />
                      ) : (
                        <button
                          onClick={() => handleDeleteRole(index)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete role"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </SettingsCard>
              ))}
            </div>
          </div>
        )

      // ========================
      // MEMBER SECTIONS
      // ========================
      case "qr-checkin":
        return (
          <div className="space-y-6">
            <SectionHeader title="QR Code Check-In" description="Allow members to check in using a QR code" />
            <SettingsCard>
              <Toggle
                label="Enable QR Code Check-In"
                checked={allowMemberQRCheckIn}
                onChange={setAllowMemberQRCheckIn}
                helpText="Members can scan a QR code to check in at your studio"
              />
            </SettingsCard>

            {allowMemberQRCheckIn && (
              <SettingsCard>
                <div className="flex flex-col items-center gap-6">
                  <h3 className="text-content-primary font-medium">{studioName || "Studio"}</h3>
                  <div ref={qrCodeRef} className="p-6 bg-white rounded-2xl shadow-lg">
                    <QRCode
                      value={memberQRCodeUrl || "https://your-studio-app.com/member-checkin"}
                      size={220}
                      icon={logoUrl || DefaultAvatar}
                      iconSize={55}
                      errorLevel="H"
                      color="#1a1a2e"
                    />
                  </div>
                  <p className="text-sm text-content-muted text-center">
                    Scan to check in
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button 
                      onClick={handleDownloadQRCode}
                      className="px-4 py-2 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button 
                      onClick={handlePrintQRCode}
                      className="px-4 py-2 bg-surface-button text-content-primary text-sm rounded-xl hover:bg-surface-button-hover transition-colors flex items-center justify-center gap-2"
                    >
                      <Printer className="w-4 h-4" />
                      Print
                    </button>
                  </div>
                  <p className="text-xs text-content-faint text-center mt-2">
                    The downloaded and printed QR code will include your studio name and branding.
                  </p>
                </div>
              </SettingsCard>
            )}
          </div>
        )

      case "lead-sources":
        return (
          <div className="space-y-6">
            <SectionHeader
              title="Lead Sources"
              description="Track where your leads come from"
              action={
                <button
                  onClick={handleAddLeadSource}
                  className="px-3 sm:px-4 py-2 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span> Source
                </button>
              }
            />
            <SettingsCard>
              {leadSources.length === 0 ? (
                <div className="text-center py-8 text-content-muted">
                  <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No lead sources configured</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leadSources.map((source) => (
                    <div key={source.id} className="flex items-center gap-3 p-3 bg-surface-card rounded-xl">
                      <input
                        type="color"
                        value={source.color}
                        onChange={(e) => handleUpdateLeadSource(source.id, "color", e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer flex-shrink-0"
                      />
                      <input
                        type="text"
                        value={source.name}
                        onChange={(e) => handleUpdateLeadSource(source.id, "name", e.target.value)}
                        placeholder="Source name"
                        className="flex-1 bg-transparent text-content-primary text-sm outline-none min-w-0"
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

      case "intro-materials":
        return (
          <div className="space-y-6">
            <SectionHeader
              title="Introductory Materials"
              description="Create welcome guides and onboarding content for new members"
              action={
                <button
                  onClick={() => {
                    const newMaterial = {
                      id: Date.now(),
                      name: "",
                      pages: [{ id: Date.now(), title: "Page 1", content: "" }]
                    }
                    // Don't add to list yet - only add when saved
                    setEditingIntroMaterial(newMaterial)
                    setEditingIntroMaterialIndex(null) // null = new material
                    setIntroMaterialEditorVisible(true)
                  }}
                  className="px-3 sm:px-4 py-2 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span> Material
                </button>
              }
            />
            
            {introductoryMaterials.length === 0 ? (
              <SettingsCard>
                <div className="text-center py-8 text-content-muted">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No introductory materials created</p>
                  <p className="text-sm mt-1">Create welcome guides for new members</p>
                </div>
              </SettingsCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {introductoryMaterials.map((material, index) => (
                  <div key={material.id} className="bg-surface-hover rounded-xl overflow-hidden border border-border hover:border-border transition-colors group">
                    <div className="p-4 sm:p-5">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-content-primary font-medium truncate">
                              {material.name || "Untitled Material"}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-content-muted mt-1">
                              <BookOpen className="w-4 h-4" />
                              {material.pages.length} page{material.pages.length !== 1 ? "s" : ""}
                            </div>
                          </div>
                          <button
                            onClick={() => setDeletingIntroMaterialIndex(index)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Page previews with content thumbnails */}
                        <div className="flex gap-1.5 overflow-x-auto pb-1">
                          {material.pages.slice(0, 4).map((page, pageIndex) => (
                            <div 
                              key={page.id} 
                              className="w-14 h-[72px] bg-white border border-border rounded-lg flex-shrink-0 overflow-hidden relative"
                            >
                              {/* Scaled content preview */}
                              <div 
                                className="w-full h-full overflow-hidden pointer-events-none"
                                style={{ 
                                  transform: 'scale(0.12)', 
                                  transformOrigin: 'top left', 
                                  width: '833%', 
                                  height: '833%',
                                  fontSize: '11px',
                                  padding: '4px',
                                  color: '#000',
                                  lineHeight: '1.3',
                                  fontFamily: 'Arial, sans-serif'
                                }}
                                dangerouslySetInnerHTML={{ 
                                  __html: page.content || `<p style="color:#ccc;text-align:center;padding-top:40px;">Page ${pageIndex + 1}</p>` 
                                }}
                              />
                              {/* Page number badge */}
                              <div className="absolute bottom-0.5 right-0.5 bg-black/60 text-white text-[8px] px-1 rounded">
                                {pageIndex + 1}
                              </div>
                            </div>
                          ))}
                          {material.pages.length > 4 && (
                            <div className="w-14 h-[72px] bg-surface-card border border-border rounded-lg flex-shrink-0 flex items-center justify-center text-xs text-content-muted font-medium">
                              +{material.pages.length - 4}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-surface-card border-t border-border">
                      <button 
                        onClick={() => {
                          const deepCopy = {
                            ...material,
                            pages: material.pages.map(p => ({ ...p }))
                          }
                          setEditingIntroMaterial(deepCopy)
                          setEditingIntroMaterialIndex(index)
                          setIntroMaterialEditorVisible(true)
                        }}
                        className="w-full px-3 py-2 bg-surface-button text-content-primary text-sm rounded-lg hover:bg-surface-button-hover transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Content
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Delete Confirmation Dialog */}
            {deletingIntroMaterialIndex !== null && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
                <div className="bg-surface-base rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-500/20 rounded-xl">
                      <Trash2 className="w-6 h-6 text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-content-primary">Delete Material</h3>
                  </div>
                  <p className="text-content-muted mb-2">
                    Are you sure you want to delete <span className="text-content-primary font-medium">&quot;{introductoryMaterials[deletingIntroMaterialIndex]?.name || "Untitled Material"}&quot;</span>?
                  </p>
                  <p className="text-content-faint text-sm mb-6">
                    This will permanently delete all {introductoryMaterials[deletingIntroMaterialIndex]?.pages?.length || 0} page(s). This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setDeletingIntroMaterialIndex(null)}
                      className="flex-1 px-4 py-2.5 bg-surface-button text-content-primary text-sm font-medium rounded-xl hover:bg-surface-button-hover transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setIntroductoryMaterials(introductoryMaterials.filter((_, i) => i !== deletingIntroMaterialIndex))
                        setDeletingIntroMaterialIndex(null)
                        notification.success({ message: "Material deleted successfully" })
                      }}
                      className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      // ========================
      // CONTRACT SECTIONS
      // ========================
      case "contract-general":
        return (
          <div className="space-y-6">
            <SectionHeader title="Contract General Settings" description="Default settings for new contracts" />
            
            {/* Member Settings */}
            <SettingsCard>
              <div className="space-y-4">
                <h3 className="text-content-primary font-medium">Member Permissions</h3>
                <Toggle
                  label="Allow Member Self-Cancellation"
                  checked={allowMemberSelfCancellation}
                  onChange={setAllowMemberSelfCancellation}
                  helpText="Members can cancel their contracts without staff assistance"
                />
              </div>
            </SettingsCard>

            {/* Contract Defaults */}
            <SettingsCard>
              <div className="space-y-6">
                <div>
                  <h3 className="text-content-primary font-medium mb-1">Contract Defaults</h3>
                  <p className="text-xs text-content-faint">Applied when creating new contract types</p>
                </div>
                
                {/* Info Box */}
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-primary">
                      These settings are automatically applied when creating new contract types. You can always adjust them individually for each contract type.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField
                    label="Default Billing Period"
                    value={defaultBillingPeriod}
                    onChange={setDefaultBillingPeriod}
                    options={[
                      { value: "weekly", label: "Weekly" },
                      { value: "monthly", label: "Monthly" },
                      { value: "annually", label: "Annually" }
                    ]}
                  />
                  <NumberInput
                    label="Default Notice Period"
                    value={noticePeriod}
                    onChange={setNoticePeriod}
                    min={0}
                    max={365}
                    suffix="days"
                    helpText="Days before contract end to cancel"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                    Default Contingent
                    <Tooltip content="The number of appointment credits members receive per billing period. Each appointment type can deduct a different amount from this contingent. Set to 0 for unlimited.">
                      <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                    </Tooltip>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={defaultAppointmentLimit}
                      onChange={(e) => setDefaultAppointmentLimit(Number(e.target.value))}
                      min={0}
                      placeholder="0 = Unlimited"
                      className="w-32 bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                    />
                    <span className="text-content-muted text-sm">credits per billing period</span>
                  </div>
                  <p className="text-xs text-content-faint">0 = Unlimited contingent</p>
                </div>
              </div>
            </SettingsCard>

            {/* Renewal Defaults */}
            <SettingsCard>
              <div className="space-y-6">
                <div>
                  <h3 className="text-content-primary font-medium mb-1">Renewal Defaults</h3>
                  <p className="text-xs text-content-faint">Settings for contract renewal after minimum duration</p>
                </div>
                
                <Toggle
                  label="Enable Automatic Renewal by Default"
                  checked={defaultAutoRenewal}
                  onChange={setDefaultAutoRenewal}
                  helpText="New contracts will have automatic renewal enabled"
                />
                
                <div className="pt-4 border-t border-border space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                      Default Renewal Duration
                      <Tooltip content="How long contracts continue after the minimum duration. Choose 'Indefinite' for open-ended contracts that run until cancelled.">
                        <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                      </Tooltip>
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      <select
                        value={defaultRenewalIndefinite ? "indefinite" : "fixed"}
                        onChange={(e) => setDefaultRenewalIndefinite(e.target.value === "indefinite")}
                        className="bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                      >
                        <option value="fixed">Fixed period</option>
                        <option value="indefinite">Indefinite</option>
                      </select>
                      {!defaultRenewalIndefinite && (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={defaultRenewalPeriod}
                            onChange={(e) => setDefaultRenewalPeriod(Number(e.target.value))}
                            min={1}
                            className="w-20 bg-surface-card text-content-primary rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                          />
                          <span className="text-content-muted">months</span>
                        </div>
                      )}
                    </div>
                    {defaultRenewalIndefinite && (
                      <p className="text-xs text-content-faint mt-1">Contracts will run indefinitely until cancelled</p>
                    )}
                  </div>
                </div>
              </div>
            </SettingsCard>
          </div>
        )

      case "contract-forms":
        return (
          <div className="space-y-6">
            <SectionHeader
              title="Contract Forms"
              description="Create and manage contract form templates"
              action={
                <button
                  onClick={() => setShowCreateFormModal(true)}
                  className="px-3 sm:px-4 py-2 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Create</span> Form
                </button>
              }
            />
            
            {contractForms.length === 0 ? (
              <SettingsCard>
                <div className="text-center py-12 text-content-muted">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-content-primary mb-2">No contract forms yet</h3>
                  <p className="text-sm mb-6">Create your first contract form template</p>
                  <button
                    onClick={() => setShowCreateFormModal(true)}
                    className="px-6 py-2.5 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover transition-colors inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Contract Form
                  </button>
                </div>
              </SettingsCard>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {contractForms.map((form) => (
                  <div key={form.id} className="bg-surface-hover rounded-xl overflow-hidden border border-border hover:border-border transition-colors group">
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
                                className="flex-1 bg-surface-card text-content-primary text-sm font-medium outline-none border border-accent-blue focus:border-primary rounded-lg px-2 py-1"
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
                              className="text-content-primary font-medium text-sm sm:text-base cursor-pointer hover:text-primary transition-colors"
                              onClick={() => setEditingContractFormName({ id: form.id, value: form.name })}
                              title="Click to edit name"
                            >
                              {form.name}
                            </h3>
                          )}
                          <div className="flex gap-1">
                            <button
                              onClick={() => setContractForms([...contractForms, {
                                ...form,
                                id: Date.now(),
                                name: `${form.name} (Copy)`,
                                createdAt: new Date().toISOString()
                              }])}
                              className="p-1.5 text-content-muted hover:text-content-primary hover:bg-surface-button rounded transition-colors"
                              title="Duplicate"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingContractFormId(form.id)}
                              className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-content-faint">
                          Created: {new Date(form.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-content-faint">
                          {form.pages?.length || 1} page{(form.pages?.length || 1) !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-surface-card border-t border-border">
                      <button
                        onClick={() => {
                          setSelectedContractForm(form)
                          setContractBuilderModalVisible(true)
                        }}
                        className="w-full px-3 py-2 bg-surface-button text-content-primary text-sm rounded-lg hover:bg-surface-button-hover transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Open Builder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Delete Contract Form Confirmation */}
            {deletingContractFormId !== null && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
                <div className="bg-surface-base rounded-2xl p-6 w-full max-w-md shadow-2xl border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-500/20 rounded-xl">
                      <Trash2 className="w-6 h-6 text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-content-primary">Delete Contract Form</h3>
                  </div>
                  <p className="text-content-muted mb-2">
                    Are you sure you want to delete <span className="text-content-primary font-medium">&quot;{contractForms.find(f => f.id === deletingContractFormId)?.name || "this form"}&quot;</span>?
                  </p>
                  <p className="text-sm text-red-400/80 mb-6">
                    This will permanently delete all pages and content. This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setDeletingContractFormId(null)}
                      className="flex-1 px-4 py-2.5 bg-surface-button text-content-primary text-sm font-medium rounded-xl hover:bg-surface-button-hover transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setContractForms(contractForms.filter(f => f.id !== deletingContractFormId))
                        setDeletingContractFormId(null)
                        notification.success({ message: "Contract form deleted" })
                      }}
                      className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case "contract-types":
        return (
          <div className="space-y-6">
            <SectionHeader
              title="Contract Types"
              description="Define different membership contracts for your studio"
              action={
                <button
                  onClick={handleAddContractType}
                  className="px-3 sm:px-4 py-2 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span> Type
                </button>
              }
            />
            
            {contractTypes.length === 0 ? (
              <SettingsCard>
                <div className="text-center py-12 text-content-muted">
                  <RiContractLine className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-content-primary mb-2">No contract types yet</h3>
                  <p className="text-sm mb-6">Create your first membership contract type</p>
                  <button
                    onClick={handleAddContractType}
                    className="px-6 py-2.5 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover transition-colors inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Contract Type
                  </button>
                </div>
              </SettingsCard>
            ) : (
              <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {contractTypes.map((type, index) => (
                  <div
                    key={index}
                    className="bg-surface-hover rounded-xl overflow-hidden border border-border hover:border-border transition-colors group"
                  >
                    {/* Header */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="text-content-primary font-medium truncate">{type.name || "Untitled"}</h3>
                        {type.autoRenewal && (
                          <span className="px-2.5 py-1 bg-primary text-white text-xs font-medium rounded-full flex-shrink-0">
                            Auto-Renew
                          </span>
                        )}
                      </div>
                      
                      {/* Price highlight */}
                      <div className="mb-4">
                        <span className="text-2xl font-bold text-content-primary">{type.cost}{currency}</span>
                        <span className="text-content-faint text-sm">/{type.billingPeriod === 'monthly' ? 'month' : type.billingPeriod === 'weekly' ? 'week' : 'year'}</span>
                      </div>
                      
                      {/* Key info */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between text-content-muted">
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Duration
                          </span>
                          <span className="text-content-primary">{type.duration} months</span>
                        </div>
                        <div className="flex items-center justify-between text-content-muted">
                          <span className="flex items-center gap-2">
                            <BadgeDollarSign className="w-4 h-4" />
                            Contingent
                          </span>
                          <span className="text-content-primary">{type.userCapacity || '∞'} credits / {type.billingPeriod === 'monthly' ? 'month' : type.billingPeriod === 'weekly' ? 'week' : 'year'}</span>
                        </div>
                        <div className="flex items-center justify-between text-content-muted">
                          <span className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Form
                          </span>
                          <span className="text-content-primary truncate max-w-[120px]">
                            {type.contractFormId ? contractForms.find(f => String(f.id) === String(type.contractFormId))?.name || 'Unknown' : 'None'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="px-4 py-3 bg-surface-card border-t border-border flex gap-2">
                      <button
                        onClick={() => handleEditContractType(type, index)}
                        className="flex-1 px-3 py-2 bg-surface-button text-content-primary text-sm rounded-lg hover:bg-surface-button-hover transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
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

            {/* Contract Type Edit Modal */}
            {contractTypeModalVisible && editingContractType && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/50 overflow-hidden">
                <div className="bg-surface-base rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl border border-border flex flex-col">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
                    <h3 className="text-lg font-semibold text-content-primary">
                      {editingContractTypeIndex !== null ? 'Edit Contract Type' : 'New Contract Type'}
                    </h3>
                    <button
                      onClick={() => {
                        setContractTypeModalVisible(false)
                        setEditingContractType(null)
                        setEditingContractTypeIndex(null)
                      }}
                      className="p-2 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Modal Content */}
                  <div className="p-4 overflow-y-auto overflow-x-hidden flex-1 space-y-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                        Contract Name
                        <span className="text-red-400">*</span>
                        <Tooltip content="The name of this contract type that members will see when signing up">
                          <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                        </Tooltip>
                      </label>
                      <input
                        type="text"
                        value={editingContractType.name}
                        onChange={(e) => setEditingContractType({ ...editingContractType, name: e.target.value })}
                        placeholder="e.g., Premium Membership"
                        className="w-full bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                      />
                    </div>
                    
                    {/* Price & Duration */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                          Cost
                          <span className="text-red-400">*</span>
                          <Tooltip content="The price charged to the member per billing period (weekly, monthly, or annually)">
                            <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                          </Tooltip>
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editingContractType.cost}
                            onChange={(e) => setEditingContractType({ ...editingContractType, cost: Number(e.target.value) })}
                            min={0}
                            className="flex-1 min-w-0 bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                          />
                          <span className="text-content-muted flex-shrink-0">{currency}</span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                          Minimum Duration
                          <span className="text-red-400">*</span>
                          <Tooltip content="The minimum commitment period. After this period, the contract can be renewed or terminated." position="right">
                            <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                          </Tooltip>
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editingContractType.duration}
                            onChange={(e) => setEditingContractType({ ...editingContractType, duration: Number(e.target.value) })}
                            min={1}
                            max={60}
                            className="flex-1 min-w-0 bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                          />
                          <span className="text-content-muted flex-shrink-0">months</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Billing & Contingent */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                          Billing Period
                          <span className="text-red-400">*</span>
                          <Tooltip content="How often the member is charged. The cost above is charged once per billing period.">
                            <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                          </Tooltip>
                        </label>
                        <select
                          value={editingContractType.billingPeriod}
                          onChange={(e) => setEditingContractType({ ...editingContractType, billingPeriod: e.target.value })}
                          className="w-full bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                        >
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="annually">Annually</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                          Contingent
                          <span className="text-red-400">*</span>
                          <Tooltip content="The number of appointment credits members receive per billing period. Each appointment type deducts from this contingent based on its 'Contingent Usage' setting. Set to 0 for unlimited." position="right">
                            <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                          </Tooltip>
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editingContractType.userCapacity}
                            onChange={(e) => setEditingContractType({ ...editingContractType, userCapacity: Number(e.target.value) })}
                            min={0}
                            placeholder="0 = Unlimited"
                            className="flex-1 min-w-0 bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                          />
                          <span className="text-content-muted flex-shrink-0">credits</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Contract Form */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                        Contract Form
                        <span className="text-red-400">*</span>
                        <Tooltip content="The document template used when a member signs this contract. Create forms in the 'Contract Forms' section.">
                          <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                        </Tooltip>
                      </label>
                      {contractForms.length === 0 ? (
                        <div className="p-3 bg-surface-card rounded-xl border border-yellow-500/30">
                          <p className="text-sm text-yellow-400">No contract forms available.</p>
                          <p className="text-xs text-content-faint mt-1">Please create a contract form first in the "Contract Forms" section.</p>
                        </div>
                      ) : (
                        <select
                          value={editingContractType.contractFormId || ""}
                          onChange={(e) => setEditingContractType({ ...editingContractType, contractFormId: e.target.value ? Number(e.target.value) : null })}
                          className="w-full bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                        >
                          <option value="">Select a form...</option>
                          {contractForms.map(f => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    
                    {/* Notice Period */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                        Notice Period
                        <Tooltip content="How many days before the contract end date the member must cancel. After this deadline, the contract will auto-renew (if enabled).">
                          <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                        </Tooltip>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={editingContractType.cancellationPeriod}
                          onChange={(e) => setEditingContractType({ ...editingContractType, cancellationPeriod: Number(e.target.value) })}
                          min={0}
                          className="w-20 sm:w-24 bg-surface-card text-content-primary rounded-xl px-3 sm:px-4 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                        />
                        <span className="text-content-muted text-sm">days before end</span>
                      </div>
                    </div>
                    
                    {/* Auto Renewal Section */}
                    <div className="p-4 bg-surface-card rounded-xl space-y-4">
                      <Toggle
                        label="Automatic Renewal"
                        checked={editingContractType.autoRenewal}
                        onChange={(v) => setEditingContractType({ ...editingContractType, autoRenewal: v })}
                        helpText="Contract continues automatically after the minimum duration ends"
                      />
                      
                      {editingContractType.autoRenewal && (
                        <div className="space-y-4 pt-3 border-t border-border">
                          {/* Renewal Duration */}
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                              Renewal Duration
                              <Tooltip content="How long the contract continues after the minimum duration. Choose 'Indefinite' for an open-ended contract that runs until cancelled.">
                                <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                              </Tooltip>
                            </label>
                            <div className="flex items-center gap-2">
                              <select
                                value={editingContractType.renewalIndefinite ? "indefinite" : "fixed"}
                                onChange={(e) => setEditingContractType({ 
                                  ...editingContractType, 
                                  renewalIndefinite: e.target.value === "indefinite"
                                })}
                                className={`${editingContractType.renewalIndefinite ? 'flex-1' : ''} bg-surface-card text-content-primary rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-accent-blue`}
                              >
                                <option value="fixed">Fixed period</option>
                                <option value="indefinite">Indefinite</option>
                              </select>
                              {!editingContractType.renewalIndefinite && (
                                <>
                                  <input
                                    type="number"
                                    value={editingContractType.renewalPeriod}
                                    onChange={(e) => setEditingContractType({ ...editingContractType, renewalPeriod: Number(e.target.value) })}
                                    min={1}
                                    className="flex-1 min-w-0 bg-surface-card text-content-primary rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                                  />
                                  <span className="text-content-muted flex-shrink-0">months</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Price After Renewal */}
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                              Price After Renewal
                              <Tooltip content="The new price per billing period after the contract renews.">
                                <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                              </Tooltip>
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editingContractType.renewalPrice}
                                onChange={(e) => setEditingContractType({ ...editingContractType, renewalPrice: Number(e.target.value) })}
                                min={0}
                                className="w-32 bg-surface-card text-content-primary rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                              />
                              <span className="text-content-muted flex-shrink-0">{currency}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Modal Footer */}
                  <div className="flex gap-3 p-4 border-t border-border flex-shrink-0">
                    <button
                      onClick={() => {
                        setContractTypeModalVisible(false)
                        setEditingContractType(null)
                        setEditingContractTypeIndex(null)
                      }}
                      className="flex-1 px-4 py-2.5 bg-surface-button text-content-primary text-sm font-medium rounded-xl hover:bg-surface-button-hover transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveContractType}
                      className="flex-1 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      {editingContractTypeIndex !== null ? 'Save' : 'Create'}
                    </button>
                  </div>
                </div>
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
                  onClick={() => setContractPauseReasons([...contractPauseReasons, { name: "", maxDays: 30 }])}
                  className="px-3 sm:px-4 py-2 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span> Reason
                </button>
              }
            />
            <SettingsCard>
              {contractPauseReasons.length === 0 ? (
                <div className="text-center py-8 text-content-muted">
                  <PauseCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No pause reasons configured</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contractPauseReasons.map((reason, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-surface-card rounded-xl">
                      <input
                        type="text"
                        value={reason.name}
                        onChange={(e) => {
                          const updated = [...contractPauseReasons]
                          updated[index].name = e.target.value
                          setContractPauseReasons(updated)
                        }}
                        placeholder="Reason name"
                        className="flex-1 bg-transparent text-content-primary text-sm outline-none min-w-0"
                      />
                      <button
                        onClick={() => setContractPauseReasons(contractPauseReasons.filter((_, i) => i !== index))}
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
      case "comm-general":
        return (
          <div className="space-y-6">
            <SectionHeader title="Communication Settings" description="General communication preferences" />
            <SettingsCard>
              <div className="space-y-4">
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl">
                  <p className="text-primary text-sm flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Archiving only affects member chats in the Messenger. Archived chats are hidden from the main view but are not deleted – they remain accessible and can be retrieved at any time.</span>
                  </p>
                </div>
                <NumberInput
                  label="Auto-Archive Duration"
                  value={settings.autoArchiveDuration}
                  onChange={(v) => setSettings({ ...settings, autoArchiveDuration: v })}
                  min={1}
                  max={365}
                  suffix="days"
                  helpText="Chats are archived after this period of inactivity"
                />
              </div>
            </SettingsCard>
          </div>
        )

      case "email-notifications":
        return (
          <div className="space-y-6">
            <SectionHeader title="Email Notifications" description="Configure automated email notifications" />
            
            {/* Birthday Email Notification */}
            <SettingsCard>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-content-primary font-medium">Birthday Email</h3>
                    <p className="text-sm text-content-muted">Automatically sends birthday greetings via email when enabled</p>
                  </div>
                  <Toggle
                    checked={settings.birthdayEmailEnabled}
                    onChange={(v) => setSettings({ ...settings, birthdayEmailEnabled: v })}
                  />
                </div>
                
                {settings.birthdayEmailEnabled && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    {/* Send Time */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm text-content-secondary">Send time:</span>
                      <input
                        type="time"
                        value={settings.birthdaySendTime || "09:00"}
                        onChange={(e) => setSettings({ ...settings, birthdaySendTime: e.target.value })}
                        className="bg-surface-card text-content-primary rounded-lg px-3 py-2 text-sm border border-border"
                      />
                    </div>
                    
                    {/* Subject */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-content-secondary">Subject</label>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs text-content-faint mr-2">Variables:</span>
                        {["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}"].map(v => (
                          <button
                            key={v}
                            onClick={() => setSettings({ ...settings, birthdayEmailSubject: (settings.birthdayEmailSubject || "") + " " + v })}
                            className="px-2 py-1 bg-secondary text-white text-xs rounded-lg hover:opacity-80"
                          >
                            {v.replace(/{|}/g, "").replace(/_/g, " ")}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={settings.birthdayEmailSubject || ""}
                        onChange={(e) => setSettings({ ...settings, birthdayEmailSubject: e.target.value })}
                        placeholder="🎂 Happy Birthday, {Member_First_Name}!"
                        className="w-full bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                      />
                    </div>
                    
                    {/* Message */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-content-secondary">Message</label>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs text-content-faint mr-1">Variables:</span>
                        {["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}"].map(v => (
                          <button
                            key={v}
                            onClick={() => birthdayEditorRef.current?.insertText(v)}
                            className="px-2 py-1 bg-secondary text-white text-xs rounded-lg hover:opacity-80"
                          >
                            {v.replace(/{|}/g, "").replace(/_/g, " ")}
                          </button>
                        ))}
                        <span className="text-xs text-content-faint mx-2">|</span>
                        <span className="text-xs text-content-faint mr-1">Insert:</span>
                        <button
                          onClick={() => {
                            if (settings.emailSignature) {
                              birthdayEditorRef.current?.insertHTML(settings.emailSignature)
                            } else {
                              notification.warning({ message: "No email signature configured", description: "Please set up your email signature first." })
                            }
                          }}
                          className="px-2 py-1 bg-primary text-white text-xs rounded-lg hover:bg-primary-hover flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          Email Signature
                        </button>
                      </div>
                      <WysiwygEditor
                        ref={birthdayEditorRef}
                        value={settings.birthdayEmailTemplate || ""}
                        onChange={(v) => setSettings({ ...settings, birthdayEmailTemplate: v })}
                        placeholder="Happy Birthday, {Member_First_Name}! We hope you have a wonderful day..."
                        minHeight={120}
                        showImages={true}
                      />
                    </div>
                  </div>
                )}
              </div>
            </SettingsCard>

            {/* Appointment Email Notifications */}
            {["confirmation", "cancellation", "rescheduled", "reminder", "registration"].map(type => {
              const config = appointmentNotificationTypes[type] || {}
              const titles = {
                confirmation: "Appointment Confirmation",
                cancellation: "Appointment Cancellation", 
                rescheduled: "Appointment Rescheduled",
                reminder: "Appointment Reminder",
                registration: "New Member Registration"
              }
              const descriptions = {
                confirmation: "Email sent when an appointment is booked",
                cancellation: "Email sent when an appointment is cancelled",
                rescheduled: "Email sent when an appointment time is changed",
                reminder: "Email sent before an upcoming appointment",
                registration: "Email sent when a new member registers"
              }
              const subjectVariables = type === "registration" 
                ? ["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}"]
                : type === "rescheduled"
                  ? ["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}", "{Appointment_Type}", "{Old_Booked_Date}", "{Old_Booked_Time}", "{New_Booked_Date}", "{New_Booked_Time}"]
                  : ["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}", "{Appointment_Type}", "{Booked_Date}", "{Booked_Time}"]
              const messageVariables = type === "registration" 
                ? ["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}", "{Registration_Link}"]
                : type === "rescheduled"
                  ? ["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}", "{Appointment_Type}", "{Old_Booked_Date}", "{Old_Booked_Time}", "{New_Booked_Date}", "{New_Booked_Time}"]
                  : ["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}", "{Appointment_Type}", "{Booked_Time}", "{Booked_Date}"]
              
              return (
                <SettingsCard key={type}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-content-primary font-medium">{titles[type]} Email</h3>
                        <p className="text-sm text-content-muted">{descriptions[type]}</p>
                      </div>
                      <Toggle
                        checked={config.emailEnabled || false}
                        onChange={(v) => setAppointmentNotificationTypes({
                          ...appointmentNotificationTypes,
                          [type]: { ...config, emailEnabled: v }
                        })}
                      />
                    </div>
                    
                    {config.emailEnabled && (
                      <div className="space-y-4 pt-4 border-t border-border">
                        {/* Reminder timing */}
                        {type === "reminder" && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-content-secondary">Send</span>
                            <input
                              type="number"
                              value={config.hoursBefore || 24}
                              onChange={(e) => setAppointmentNotificationTypes({
                                ...appointmentNotificationTypes,
                                [type]: { ...config, hoursBefore: Number(e.target.value) }
                              })}
                              className="w-20 bg-surface-card text-content-primary rounded-lg px-3 py-2 text-sm border border-border"
                            />
                            <span className="text-sm text-content-secondary">hours before appointment</span>
                          </div>
                        )}
                        
                        {/* Subject */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-content-secondary">Subject</label>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-xs text-content-faint mr-2">Variables:</span>
                            {subjectVariables.map(v => (
                              <button
                                key={v}
                                onClick={() => setAppointmentNotificationTypes({
                                  ...appointmentNotificationTypes,
                                  [type]: { ...config, emailSubject: (config.emailSubject || "") + " " + v }
                                })}
                                className="px-2 py-1 bg-secondary text-white text-xs rounded-lg hover:opacity-80"
                              >
                                {v.replace(/{|}/g, "").replace(/_/g, " ")}
                              </button>
                            ))}
                          </div>
                          <input
                            type="text"
                            value={config.emailSubject || ""}
                            onChange={(e) => setAppointmentNotificationTypes({
                              ...appointmentNotificationTypes,
                              [type]: { ...config, emailSubject: e.target.value }
                            })}
                            placeholder={`${titles[type]} - {Appointment_Type}`}
                            className="w-full bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                          />
                        </div>
                        
                        {/* Message */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-content-secondary">Message</label>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-xs text-content-faint mr-1">Variables:</span>
                            {messageVariables.map(v => (
                              <button
                                key={v}
                                onClick={() => appointmentEditorRefs.current[type]?.insertText(v)}
                                className="px-2 py-1 bg-secondary text-white text-xs rounded-lg hover:opacity-80"
                              >
                                {v.replace(/{|}/g, "").replace(/_/g, " ")}
                              </button>
                            ))}
                            <span className="text-xs text-content-faint mx-2">|</span>
                            <span className="text-xs text-content-faint mr-1">Insert:</span>
                            <button
                              onClick={() => {
                                if (settings.emailSignature) {
                                  appointmentEditorRefs.current[type]?.insertHTML(settings.emailSignature)
                                } else {
                                  notification.warning({ message: "No email signature configured", description: "Please set up your email signature first." })
                                }
                              }}
                              className="px-2 py-1 bg-primary text-white text-xs rounded-lg hover:bg-primary-hover flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3" />
                              Email Signature
                            </button>
                          </div>
                          <WysiwygEditor
                            ref={(el) => { appointmentEditorRefs.current[type] = el }}
                            value={config.emailTemplate || ""}
                            onChange={(v) => setAppointmentNotificationTypes({
                              ...appointmentNotificationTypes,
                              [type]: { ...config, emailTemplate: v }
                            })}
                            placeholder={`Enter ${type} email message...`}
                            minHeight={120}
                            showImages={true}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </SettingsCard>
              )
            })}
          </div>
        )

      case "app-notifications":
        return (
          <div className="space-y-6">
            <SectionHeader title="App Notifications" description="Configure push notifications for the mobile app" />
            
            {/* Birthday App Notification */}
            <SettingsCard>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-content-primary font-medium">Birthday Push Notification</h3>
                    <p className="text-sm text-content-muted">Automatically sends birthday greetings via app push notification when enabled</p>
                  </div>
                  <Toggle
                    checked={settings.birthdayAppEnabled}
                    onChange={(v) => setSettings({ ...settings, birthdayAppEnabled: v })}
                  />
                </div>
                
                {settings.birthdayAppEnabled && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    {/* Send Time */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm text-content-secondary">Send time:</span>
                      <input
                        type="time"
                        value={settings.birthdayAppSendTime || "09:00"}
                        onChange={(e) => setSettings({ ...settings, birthdayAppSendTime: e.target.value })}
                        className="bg-surface-card text-content-primary rounded-lg px-3 py-2 text-sm border border-border"
                      />
                    </div>
                    
                    {/* Title */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-content-secondary">Title</label>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs text-content-faint mr-2">Variables:</span>
                        {["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}"].map(v => (
                          <button
                            key={v}
                            onClick={() => setSettings({ ...settings, birthdayAppTitle: (settings.birthdayAppTitle || "") + " " + v })}
                            className="px-2 py-1 bg-secondary text-white text-xs rounded-lg hover:opacity-80"
                          >
                            {v.replace(/{|}/g, "").replace(/_/g, " ")}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={settings.birthdayAppTitle || ""}
                        onChange={(e) => setSettings({ ...settings, birthdayAppTitle: e.target.value })}
                        placeholder="🎂 Happy Birthday!"
                        className="w-full bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                      />
                    </div>
                    
                    {/* Message */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-content-secondary">Message</label>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs text-content-faint mr-2">Variables:</span>
                        {["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}"].map(v => (
                          <button
                            key={v}
                            onClick={() => setSettings({ ...settings, birthdayAppMessage: (settings.birthdayAppMessage || "") + v })}
                            className="px-2 py-1 bg-secondary text-white text-xs rounded-lg hover:opacity-80"
                          >
                            {v.replace(/{|}/g, "").replace(/_/g, " ")}
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={settings.birthdayAppMessage || ""}
                        onChange={(e) => setSettings({ ...settings, birthdayAppMessage: e.target.value })}
                        placeholder="Happy Birthday, {Member_First_Name}! We wish you a wonderful day."
                        rows={3}
                        className="w-full bg-surface-card text-content-primary rounded-xl px-4 py-3 text-sm outline-none border border-border focus:border-accent-blue resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </SettingsCard>

            {/* Appointment App Notifications - No registration */}
            {["confirmation", "cancellation", "rescheduled", "reminder"].map(type => {
              const config = appointmentNotificationTypes[type] || {}
              const titles = {
                confirmation: "Appointment Confirmation",
                cancellation: "Appointment Cancellation", 
                rescheduled: "Appointment Rescheduled",
                reminder: "Appointment Reminder"
              }
              const descriptions = {
                confirmation: "Push notification when an appointment is booked",
                cancellation: "Push notification when an appointment is cancelled",
                rescheduled: "Push notification when an appointment time is changed",
                reminder: "Push notification before an upcoming appointment"
              }
              const titleVariables = type === "rescheduled" 
                ? ["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}", "{Appointment_Type}", "{Old_Booked_Date}", "{Old_Booked_Time}", "{New_Booked_Date}", "{New_Booked_Time}"]
                : ["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}", "{Appointment_Type}", "{Booked_Time}", "{Booked_Date}"]
              const messageVariables = type === "rescheduled" 
                ? ["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}", "{Appointment_Type}", "{Old_Booked_Date}", "{Old_Booked_Time}", "{New_Booked_Date}", "{New_Booked_Time}"]
                : ["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}", "{Appointment_Type}", "{Booked_Time}", "{Booked_Date}"]
              
              return (
                <SettingsCard key={type}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-content-primary font-medium">{titles[type]} Push</h3>
                        <p className="text-sm text-content-muted">{descriptions[type]}</p>
                      </div>
                      <Toggle
                        checked={config.appEnabled || false}
                        onChange={(v) => setAppointmentNotificationTypes({
                          ...appointmentNotificationTypes,
                          [type]: { ...config, appEnabled: v }
                        })}
                      />
                    </div>
                    
                    {config.appEnabled && (
                      <div className="space-y-4 pt-4 border-t border-border">
                        {/* Reminder timing */}
                        {type === "reminder" && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-content-secondary">Send</span>
                            <input
                              type="number"
                              value={config.appHoursBefore || 24}
                              onChange={(e) => setAppointmentNotificationTypes({
                                ...appointmentNotificationTypes,
                                [type]: { ...config, appHoursBefore: Number(e.target.value) }
                              })}
                              className="w-20 bg-surface-card text-content-primary rounded-lg px-3 py-2 text-sm border border-border"
                            />
                            <span className="text-sm text-content-secondary">hours before appointment</span>
                          </div>
                        )}
                        
                        {/* Title */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-content-secondary">Title</label>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-xs text-content-faint mr-2">Variables:</span>
                            {titleVariables.map(v => (
                              <button
                                key={v}
                                onClick={() => setAppointmentNotificationTypes({
                                  ...appointmentNotificationTypes,
                                  [type]: { ...config, appTitle: (config.appTitle || "") + " " + v }
                                })}
                                className="px-2 py-1 bg-secondary text-white text-xs rounded-lg hover:opacity-80"
                              >
                                {v.replace(/{|}/g, "").replace(/_/g, " ")}
                              </button>
                            ))}
                          </div>
                          <input
                            type="text"
                            value={config.appTitle || ""}
                            onChange={(e) => setAppointmentNotificationTypes({
                              ...appointmentNotificationTypes,
                              [type]: { ...config, appTitle: e.target.value }
                            })}
                            placeholder={`${titles[type]}`}
                            className="w-full bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                          />
                        </div>
                        
                        {/* Message */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-content-secondary">Message</label>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-xs text-content-faint mr-2">Variables:</span>
                            {messageVariables.map(v => (
                              <button
                                key={v}
                                onClick={() => setAppointmentNotificationTypes({
                                  ...appointmentNotificationTypes,
                                  [type]: { ...config, appMessage: (config.appMessage || "") + v }
                                })}
                                className="px-2 py-1 bg-secondary text-white text-xs rounded-lg hover:opacity-80"
                              >
                                {v.replace(/{|}/g, "").replace(/_/g, " ")}
                              </button>
                            ))}
                          </div>
                          <textarea
                            value={config.appMessage || ""}
                            onChange={(e) => setAppointmentNotificationTypes({
                              ...appointmentNotificationTypes,
                              [type]: { ...config, appMessage: e.target.value }
                            })}
                            placeholder={`Enter ${type} push notification message...`}
                            rows={3}
                            className="w-full bg-surface-card text-content-primary rounded-xl px-4 py-3 text-sm outline-none border border-border focus:border-accent-blue resize-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </SettingsCard>
              )
            })}
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
                    label="Display Name"
                    value={settings.senderName}
                    onChange={(v) => setSettings({ ...settings, senderName: v })}
                    placeholder="Your Studio Name"
                    helpText="Name shown as sender"
                  />
                  <InputField
                    label="From Email"
                    value={settings.smtpFromEmail}
                    onChange={(v) => setSettings({ ...settings, smtpFromEmail: v })}
                    placeholder="noreply@yourstudio.com"
                    type="email"
                    helpText="Email address shown as sender"
                  />
                  <InputField
                    label="SMTP Host"
                    value={settings.smtpHost}
                    onChange={(v) => setSettings({ ...settings, smtpHost: v })}
                    placeholder="smtp.example.com"
                  />
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <NumberInput
                        label="Port"
                        value={settings.smtpPort}
                        onChange={(v) => setSettings({ ...settings, smtpPort: v })}
                        min={1}
                        max={65535}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-content-secondary mb-1.5 block">Security</label>
                      <select
                        value={settings.smtpSecure ? "tls" : "none"}
                        onChange={(e) => setSettings({ ...settings, smtpSecure: e.target.value === "tls" })}
                        className="w-full bg-surface-card text-content-primary rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                      >
                        <option value="tls">TLS/SSL</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                  <InputField
                    label="Username"
                    value={settings.smtpUser}
                    onChange={(v) => setSettings({ ...settings, smtpUser: v })}
                    placeholder="your-email@example.com"
                    helpText="Email/account for SMTP authentication"
                  />
                  <InputField
                    label="Password"
                    value={settings.smtpPass}
                    onChange={(v) => setSettings({ ...settings, smtpPass: v })}
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      if (!settings.smtpHost || !settings.smtpUser) {
                        notification.error({ message: "Missing SMTP Settings", description: "Please fill in SMTP Host and Username" })
                        return
                      }
                      notification.loading({ message: "Testing connection...", key: "smtp-test" })
                      setTimeout(() => {
                        notification.success({ 
                          message: "Connection successful!", 
                          description: `Connected to ${settings.smtpHost}:${settings.smtpPort}`,
                          key: "smtp-test"
                        })
                      }, 1500)
                    }}
                    className="px-4 py-2 bg-surface-button text-content-primary text-sm rounded-xl hover:bg-surface-button-hover transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Test Connection
                  </button>
                  <button
                    onClick={() => {
                      if (!settings.smtpHost || !settings.smtpUser || !settings.smtpFromEmail) {
                        notification.error({ message: "Missing SMTP Settings", description: "Please fill in all SMTP fields" })
                        return
                      }
                      notification.loading({ message: "Sending test email...", key: "smtp-send" })
                      setTimeout(() => {
                        notification.success({ 
                          message: "Test email sent!", 
                          description: `From: ${settings.senderName} <${settings.smtpFromEmail}>`,
                          key: "smtp-send"
                        })
                      }, 2000)
                    }}
                    className="px-4 py-2 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
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
            <SectionHeader title="Email Signature" description="Default signature appended to all outgoing emails" />
            <SettingsCard>
              <div className="space-y-3">
                <p className="text-sm text-content-muted">
                  This signature can be inserted into your email notification templates using the orange "Email Signature" button.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-content-faint mr-1">Variables:</span>
                  {["{Studio_Name}", "{Studio_Operator}", "{Studio_Phone}", "{Studio_Email}", "{Studio_Website}", "{Studio_Address}"].map(v => (
                    <button
                      key={v}
                      onClick={() => signatureEditorRef.current?.insertText(v)}
                      className="px-2 py-1 bg-secondary text-white text-xs rounded-lg hover:opacity-80"
                    >
                      {v.replace(/{|}/g, "").replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
                <WysiwygEditor
                  ref={signatureEditorRef}
                  value={settings.emailSignature || ""}
                  onChange={(v) => setSettings({ ...settings, emailSignature: v })}
                  placeholder="Best regards,&#10;{Studio_Name} Team&#10;{Studio_Phone} | {Studio_Email}"
                  minHeight={120}
                  showImages={true}
                />
              </div>
            </SettingsCard>
          </div>
        )

      case "e-invoice-template":
        return (
          <div className="space-y-6">
            <SectionHeader title="E-Invoice Template" description="Email template for sending invoices to members" />
            <SettingsCard>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-content-secondary mb-2 block">Subject</label>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs text-content-faint mr-2">Variables:</span>
                    {["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}", "{Invoice_Number}", "{Total_Amount}", "{Selling_Date}"].map(v => (
                      <button
                        key={v}
                        onClick={() => setSettings({ ...settings, einvoiceSubject: (settings.einvoiceSubject || "") + " " + v })}
                        className="px-2 py-1 bg-secondary text-white text-xs rounded-lg hover:opacity-80"
                      >
                        {v.replace(/{|}/g, "").replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={settings.einvoiceSubject || ""}
                    onChange={(e) => setSettings({ ...settings, einvoiceSubject: e.target.value })}
                    placeholder="Invoice {Invoice_Number} - {Selling_Date}"
                    className="w-full bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-content-secondary mb-2 block">Message</label>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs text-content-faint mr-1">Variables:</span>
                    {["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}", "{Invoice_Number}", "{Total_Amount}", "{Selling_Date}"].map(v => (
                      <button
                        key={v}
                        onClick={() => einvoiceEditorRef.current?.insertText(v)}
                        className="px-2 py-1 bg-secondary text-white text-xs rounded-lg hover:opacity-80"
                      >
                        {v.replace(/{|}/g, "").replace(/_/g, " ")}
                      </button>
                    ))}
                    <span className="text-xs text-content-faint mx-2">|</span>
                    <span className="text-xs text-content-faint mr-1">Insert:</span>
                    <button
                      onClick={() => {
                        if (settings.emailSignature) {
                          einvoiceEditorRef.current?.insertHTML(settings.emailSignature)
                        } else {
                          notification.warning({ message: "No email signature configured", description: "Please set up your email signature first." })
                        }
                      }}
                      className="px-2 py-1 bg-primary text-white text-xs rounded-lg hover:bg-primary-hover flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      Email Signature
                    </button>
                  </div>
                  <WysiwygEditor
                    ref={einvoiceEditorRef}
                    value={settings.einvoiceTemplate || ""}
                    onChange={(v) => setSettings({ ...settings, einvoiceTemplate: v })}
                    placeholder="Dear {Member_First_Name}, please find attached your invoice #{Invoice_Number}..."
                    minHeight={120}
                    showImages={true}
                  />
                </div>
              </div>
            </SettingsCard>
          </div>
        )

      case "contract-cancellation-template":
        return (
          <div className="space-y-6">
            <SectionHeader title="Contract Cancellation Template" description="Email template sent to members when their contract is cancelled" />
            <SettingsCard>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-content-secondary mb-2 block">Subject</label>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs text-content-faint mr-2">Variables:</span>
                    {["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}", "{Contract_Type}", "{Cancellation_Date}", "{Contract_End_Date}"].map(v => (
                      <button
                        key={v}
                        onClick={() => setSettings({ ...settings, contractCancellationSubject: (settings.contractCancellationSubject || "") + " " + v })}
                        className="px-2 py-1 bg-secondary text-white text-xs rounded-lg hover:opacity-80"
                      >
                        {v.replace(/{|}/g, "").replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={settings.contractCancellationSubject || ""}
                    onChange={(e) => setSettings({ ...settings, contractCancellationSubject: e.target.value })}
                    placeholder="Contract Cancellation Confirmation - {Contract_Type}"
                    className="w-full bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-content-secondary mb-2 block">Message</label>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs text-content-faint mr-1">Variables:</span>
                    {["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}", "{Contract_Type}", "{Cancellation_Date}", "{Contract_End_Date}"].map(v => (
                      <button
                        key={v}
                        onClick={() => cancellationEditorRef.current?.insertText(v)}
                        className="px-2 py-1 bg-secondary text-white text-xs rounded-lg hover:opacity-80"
                      >
                        {v.replace(/{|}/g, "").replace(/_/g, " ")}
                      </button>
                    ))}
                    <span className="text-xs text-content-faint mx-2">|</span>
                    <span className="text-xs text-content-faint mr-1">Insert:</span>
                    <button
                      onClick={() => {
                        if (settings.emailSignature) {
                          cancellationEditorRef.current?.insertHTML(settings.emailSignature)
                        } else {
                          notification.warning({ message: "No email signature configured", description: "Please set up your email signature first." })
                        }
                      }}
                      className="px-2 py-1 bg-primary text-white text-xs rounded-lg hover:bg-primary-hover flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      Email Signature
                    </button>
                  </div>
                  <WysiwygEditor
                    ref={cancellationEditorRef}
                    value={settings.contractCancellationTemplate || ""}
                    onChange={(v) => setSettings({ ...settings, contractCancellationTemplate: v })}
                    placeholder="Dear {Member_First_Name}, we confirm the cancellation of your {Contract_Type} contract effective {Contract_End_Date}..."
                    minHeight={120}
                    showImages={true}
                  />
                </div>
              </div>
            </SettingsCard>
          </div>
        )

      case "contract-conclusion-template":
        return (
          <div className="space-y-6">
            <SectionHeader title="Conclusion of Contract Template" description="Email template sent to members when a new contract is concluded" />
            <SettingsCard>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-content-secondary mb-2 block">Subject</label>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs text-content-faint mr-2">Variables:</span>
                    {["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}", "{Contract_Type}", "{Contract_Start_Date}", "{Contract_End_Date}", "{Monthly_Fee}"].map(v => (
                      <button
                        key={v}
                        onClick={() => setSettings({ ...settings, contractConclusionSubject: (settings.contractConclusionSubject || "") + " " + v })}
                        className="px-2 py-1 bg-secondary text-white text-xs rounded-lg hover:opacity-80"
                      >
                        {v.replace(/{|}/g, "").replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={settings.contractConclusionSubject || ""}
                    onChange={(e) => setSettings({ ...settings, contractConclusionSubject: e.target.value })}
                    placeholder="Welcome to {Studio_Name} - Your {Contract_Type} Contract"
                    className="w-full bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-content-secondary mb-2 block">Message</label>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs text-content-faint mr-1">Variables:</span>
                    {["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}", "{Contract_Type}", "{Contract_Start_Date}", "{Contract_End_Date}", "{Monthly_Fee}"].map(v => (
                      <button
                        key={v}
                        onClick={() => conclusionEditorRef.current?.insertText(v)}
                        className="px-2 py-1 bg-secondary text-white text-xs rounded-lg hover:opacity-80"
                      >
                        {v.replace(/{|}/g, "").replace(/_/g, " ")}
                      </button>
                    ))}
                    <span className="text-xs text-content-faint mx-2">|</span>
                    <span className="text-xs text-content-faint mr-1">Insert:</span>
                    <button
                      onClick={() => {
                        if (settings.emailSignature) {
                          conclusionEditorRef.current?.insertHTML(settings.emailSignature)
                        } else {
                          notification.warning({ message: "No email signature configured", description: "Please set up your email signature first." })
                        }
                      }}
                      className="px-2 py-1 bg-primary text-white text-xs rounded-lg hover:bg-primary-hover flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      Email Signature
                    </button>
                  </div>
                  <WysiwygEditor
                    ref={conclusionEditorRef}
                    value={settings.contractConclusionTemplate || ""}
                    onChange={(v) => setSettings({ ...settings, contractConclusionTemplate: v })}
                    placeholder="Dear {Member_First_Name}, welcome to {Studio_Name}! Your {Contract_Type} contract starts on {Contract_Start_Date}..."
                    minHeight={120}
                    showImages={true}
                  />
                </div>
              </div>
            </SettingsCard>
          </div>
        )

      // ========================
      // FINANCE SECTIONS
      // ========================
      case "vat-rates":
        return (
          <div className="space-y-6">
            <SectionHeader
              title="VAT Rates"
              description="Configure tax rates for your region"
              action={
                <button
                  onClick={handleAddVatRate}
                  className="px-3 sm:px-4 py-2 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span> Rate
                </button>
              }
            />
            <SettingsCard>
              <div className="space-y-3">
                {vatRates.map((rate, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-3 p-3 bg-surface-card rounded-xl">
                    <div className="flex items-center gap-2 sm:w-24">
                      <input
                        type="number"
                        value={rate.percentage}
                        onChange={(e) => {
                          const updated = [...vatRates]
                          updated[index].percentage = Number(e.target.value)
                          setVatRates(updated)
                        }}
                        className="w-16 bg-surface-hover text-content-primary rounded-lg px-3 py-2 text-sm border border-border"
                      />
                      <span className="text-content-muted">%</span>
                    </div>
                    <input
                      type="text"
                      value={rate.description}
                      onChange={(e) => {
                        const updated = [...vatRates]
                        updated[index].description = e.target.value
                        setVatRates(updated)
                      }}
                      placeholder="Description"
                      className="flex-1 bg-transparent text-content-primary text-sm outline-none min-w-0"
                    />
                    <button
                      onClick={() => setVatRates(vatRates.filter((_, i) => i !== index))}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors self-end sm:self-center flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </SettingsCard>
          </div>
        )

      case "payment-settings":
        return (
          <div className="space-y-6">
            <SectionHeader title="Payment Settings" description="Configure payment and billing information" />
            
            <SettingsCard>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Currency - Disabled/Read-only */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-content-secondary">Currency</label>
                  <input
                    type="text"
                    value={currency}
                    disabled
                    className="w-full bg-surface-card text-content-muted rounded-xl px-4 py-2.5 text-sm outline-none border border-border cursor-not-allowed"
                  />
                </div>
                <InputField
                  label="Creditor Name"
                  value={creditorName}
                  onChange={setCreditorName}
                  placeholder="Company name for invoices"
                  maxLength={100}
                />
                <InputField
                  label="Creditor ID"
                  value={creditorId}
                  onChange={setCreditorId}
                  placeholder="e.g., DE98ZZZ09999999999"
                  maxLength={50}
                  helpText="SEPA Creditor Identifier"
                />
                <InputField
                  label="VAT Number"
                  value={vatNumber}
                  onChange={setVatNumber}
                  placeholder="e.g., DE123456789"
                  maxLength={30}
                />
                <InputField
                  label="Bank Name"
                  value={bankName}
                  onChange={setBankName}
                  placeholder="Enter bank name"
                  maxLength={50}
                />
                <InputField
                  label="IBAN"
                  value={iban}
                  onChange={setIban}
                  placeholder="e.g., DE89 3704 0044 0532 0130 00"
                  maxLength={34}
                  helpText="International Bank Account Number"
                />
                <InputField
                  label="BIC"
                  value={bic}
                  onChange={setBic}
                  placeholder="e.g., COBADEFFXXX"
                  maxLength={11}
                  helpText="Bank Identifier Code"
                />
              </div>
            </SettingsCard>
          </div>
        )

      // ========================
      // APPEARANCE SECTION
      // ========================
      case "theme":
        return (
          <div className="space-y-6">
            <SectionHeader title="Theme Settings" description="Customize the look and feel" />
            
            <SettingsCard>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-content-secondary mb-3 block">Default Theme</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => setAppearance({ ...appearance, theme: "light" })}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors flex-1 sm:flex-none ${
                        appearance.theme === "light"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-border"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                        <Sun className="w-4 h-4 text-amber-500" />
                      </div>
                      <span className="text-content-primary">Light</span>
                    </button>
                    <button
                      onClick={() => setAppearance({ ...appearance, theme: "dark" })}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors flex-1 sm:flex-none ${
                        appearance.theme === "dark"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-border"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-surface-base flex items-center justify-center border border-border">
                        <Moon className="w-4 h-4 text-content-primary" />
                      </div>
                      <span className="text-content-primary">Dark</span>
                    </button>
                  </div>
                </div>

                <Toggle
                  label="Allow Staff to Toggle Theme"
                  checked={appearance.allowStaffThemeToggle}
                  onChange={(v) => setAppearance({ ...appearance, allowStaffThemeToggle: v })}
                />
                <Toggle
                  label="Allow Members to Toggle Theme"
                  checked={appearance.allowMemberThemeToggle}
                  onChange={(v) => setAppearance({ ...appearance, allowMemberThemeToggle: v })}
                />

                <div className="pt-4 border-t border-border">
                  <div className="grid grid-cols-1 gap-4">
                    {/* Color Scheme */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-content-secondary">Color Scheme</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={appearance.primaryColor}
                          onChange={(e) => setAppearance({ ...appearance, primaryColor: e.target.value })}
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-border"
                        />
                        <input
                          type="text"
                          value={appearance.primaryColor}
                          onChange={(e) => {
                            const val = e.target.value
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                              setAppearance({ ...appearance, primaryColor: val })
                            }
                          }}
                          className="flex-1 bg-surface-card text-content-primary rounded-lg px-3 py-2 text-sm font-mono border border-border uppercase"
                          maxLength={7}
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(appearance.primaryColor)
                            notification.success({ message: "Copied!", duration: 1.5 })
                          }}
                          className="p-2 bg-surface-button hover:bg-surface-button-hover rounded-lg transition-colors"
                          title="Copy color code"
                        >
                          <Clipboard className="w-4 h-4 text-content-muted" />
                        </button>
                      </div>
                    </div>
                    

                  </div>
                </div>
              </div>
            </SettingsCard>
          </div>
        )

      // ========================
      // IMPORT SECTION
      // ========================
      case "import-data":
        return (
          <div className="space-y-6">
            <SectionHeader title="Data Import" description="Import data from other platforms" />
            
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
              <p className="text-primary text-sm flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                You can import your existing data from other fitness studio platforms. Supported formats: CSV, Excel, PDF, Word
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Users, title: "Member Data", desc: "Import member profiles and contact information" },
                { icon: FileText, title: "Contracts", desc: "Import contract templates and existing contracts" },
                { icon: UserPlus, title: "Leads", desc: "Import lead information and contact details" },
                { icon: Download, title: "Additional Files", desc: "Import other documents and studio data" },
              ].map((item, index) => (
                <SettingsCard key={index}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-surface-button rounded-lg">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-content-primary font-medium text-sm sm:text-base">{item.title}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-content-muted">{item.desc}</p>
                    <label className="block">
                      <span className="px-4 py-2 bg-surface-button text-content-primary text-sm rounded-xl hover:bg-surface-button-hover cursor-pointer transition-colors inline-flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Upload File
                      </span>
                      <input type="file" className="hidden" accept=".csv,.xlsx,.xls,.pdf,.doc,.docx" />
                    </label>
                  </div>
                </SettingsCard>
              ))}
            </div>

            <SettingsCard>
              <h3 className="text-content-primary font-medium mb-3">Import Instructions</h3>
              <ul className="text-sm text-content-muted space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  Ensure your files are in supported formats (CSV, Excel, PDF, Word)
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  Backup your current data before importing
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  Large imports may take several minutes to process
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  Review imported data for accuracy after completion
                </li>
              </ul>
            </SettingsCard>
          </div>
        )

      default:
        return (
          <div className="text-center py-12 text-content-muted">
            <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Select a section from the menu</p>
          </div>
        )
    }
  }

  // ============================================
  // Loading & Error States
  // ============================================
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-surface-base text-content-primary rounded-3xl">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-content-muted">Loading configuration...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-surface-base text-content-primary rounded-3xl">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-2">Failed to load configuration</p>
          <p className="text-content-faint text-sm">{error}</p>
        </div>
      </div>
    )
  }

  // ============================================
  // Main Render
  // ============================================
  return (
    <div className="flex flex-col lg:flex-row h-full bg-surface-base text-content-primary overflow-hidden rounded-3xl">
      {/* Sidebar Navigation - Desktop */}
      <div className="hidden lg:flex lg:w-72 flex-shrink-0 border-r border-border bg-surface-card flex-col min-h-0">
        {/* Admin Banner */}
        {mode === "admin" && (
          <div className="p-3 border-b border-border flex-shrink-0">
            <AdminBanner studioName={studioNameProp || studioName} />
          </div>
        )}

        {/* Search */}
        <div className="p-4 border-b border-border flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-faint" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search settings..."
              className="w-full bg-surface-card text-content-primary rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none border border-border focus:border-accent-blue transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-content-faint hover:text-content-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchQuery && filteredNavItems.length === 0 && (
            <p className="text-sm text-content-faint mt-2 text-center">No results found</p>
          )}
          {searchQuery && filteredNavItems.length > 0 && (
            <p className="text-xs text-content-faint mt-2">
              {filteredNavItems.reduce((acc, cat) => acc + cat.sections.filter(s => matchesSearch(s.label) || matchesSearch(cat.label)).length, 0)} results found
            </p>
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
                      ? "bg-surface-button text-content-primary"
                      : categoryMatches
                        ? "bg-primary/10 text-orange-300 hover:bg-primary/20"
                        : "text-content-muted hover:text-content-primary hover:bg-surface-hover"
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
                    {category.sections.map((section, idx) => {
                      const sectionMatches = matchesSearch(section.label)
                      const prevGroup = idx > 0 ? category.sections[idx - 1].group : null
                      const showGroupHeader = section.group && section.group !== prevGroup
                      
                      return (
                        <div key={section.id}>
                          {showGroupHeader && (
                            <div className={`px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-content-faint ${idx > 0 ? 'border-t border-border-subtle mt-1.5' : ''}`}>
                              {section.group}
                            </div>
                          )}
                          <button
                            onClick={() => navigateToSection(category.id, section.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              activeSection === section.id
                                ? "text-primary bg-primary/10"
                                : sectionMatches
                                  ? "text-orange-300 bg-primary/10 hover:bg-primary/20"
                                  : "text-content-faint hover:text-content-primary hover:bg-surface-hover"
                            }`}
                          >
                            {highlightText(section.label)}
                          </button>
                        </div>
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
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <h1 className="text-xl font-bold">Configuration</h1>
        </div>

        {/* Admin Banner for Mobile */}
        {mode === "admin" && (
          <div className="px-3 pt-3">
            <AdminBanner studioName={studioNameProp || studioName} />
          </div>
        )}

        {/* Mobile Search */}
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-faint" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search settings..."
              className="w-full bg-surface-card text-content-primary rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none border border-border focus:border-accent-blue transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-content-faint hover:text-content-primary transition-colors"
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
                      ? "bg-surface-button text-content-primary"
                      : categoryMatches
                        ? "bg-primary/10 text-orange-300"
                        : "text-content-muted hover:text-content-primary hover:bg-surface-hover"
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
                    {category.sections.map((section, idx) => {
                      const sectionMatches = matchesSearch(section.label)
                      const prevGroup = idx > 0 ? category.sections[idx - 1].group : null
                      const showGroupHeader = section.group && section.group !== prevGroup
                      
                      return (
                        <div key={section.id}>
                          {showGroupHeader && (
                            <div className={`px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-content-faint ${idx > 0 ? 'border-t border-border-subtle mt-1.5' : ''}`}>
                              {section.group}
                            </div>
                          )}
                          <button
                            onClick={() => navigateToSection(category.id, section.id)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between ${
                              sectionMatches
                                ? "text-orange-300 bg-primary/10"
                                : "text-content-faint hover:text-content-primary hover:bg-surface-hover"
                            }`}
                          >
                            <span>{highlightText(section.label)}</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
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
        <div className="flex items-center gap-3 p-4 border-b border-border flex-shrink-0">
          <button
            onClick={() => setMobileShowContent(false)}
            className="p-2 -ml-2 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">{getCurrentSectionTitle()}</h1>
        </div>

        {/* Mobile Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div>
            {renderSectionContent()}
          </div>
        </div>
      </div>

      {/* Desktop Main Content */}
      <div className="hidden lg:flex flex-1 flex-col min-h-0 overflow-hidden">
        {/* Desktop Header */}
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <h1 className="text-2xl font-bold">Configuration</h1>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div>
            {renderSectionContent()}
          </div>
        </div>
      </div>

      {/* Modals */}
      <PermissionModal
        visible={permissionModalVisible}
        onClose={() => setPermissionModalVisible(false)}
        role={selectedRoleIndex !== null ? roles[selectedRoleIndex] : null}
        onPermissionChange={handlePermissionChange}
        isAdminRole={selectedRoleIndex !== null ? roles[selectedRoleIndex]?.isAdmin : false}
      />

      <StaffAssignmentModal
        visible={staffAssignmentModalVisible}
        onClose={() => setStaffAssignmentModalVisible(false)}
        role={selectedRoleForAssignment !== null ? roles[selectedRoleForAssignment] : null}
        allStaff={allStaff}
        allRoles={roles}
        onStaffAssignmentChange={handleStaffAssignmentChange}
      />

      {/* Create Contract Form Modal */}
      {showCreateFormModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-hover rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-content-primary mb-4">Create New Contract Form</h3>
            <InputField
              label="Contract Form Name"
              value={newContractFormName}
              onChange={setNewContractFormName}
              placeholder="Enter contract form name"
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateFormModal(false)
                  setNewContractFormName("")
                }}
                className="flex-1 px-4 py-2.5 bg-surface-button text-content-primary text-sm rounded-xl hover:bg-surface-button-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateContractForm}
                className="flex-1 px-4 py-2.5 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contract Builder Fullscreen */}
      {contractBuilderModalVisible && selectedContractForm && (
        <div className="fixed inset-0 z-50 bg-surface-base">
          <ContractBuilder
            contractForm={selectedContractForm}
            onUpdate={(updatedForm) => {
              // FIX: Only update the forms list, do NOT call setSelectedContractForm here.
              // Calling setSelectedContractForm would change the contractForm prop, causing
              // ContractBuilder's sync effect to fire, which triggers onUpdate again → infinite loop.
              setContractForms(contractForms.map(f => f.id === selectedContractForm.id ? updatedForm : f))
            }}
            onClose={() => setContractBuilderModalVisible(false)}
          />
        </div>
      )}

      {/* Appointment Type Modal */}
      {showAppointmentTypeModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-surface-base rounded-2xl w-full max-w-2xl my-8">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-semibold text-content-primary">
                {editingAppointmentType ? "Edit Appointment Type" : "Create Appointment Type"}
              </h2>
              <button
                onClick={() => setShowAppointmentTypeModal(false)}
                className="p-2 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden">
              {/* Image Upload */}
              <div>
                <label className="text-sm font-medium text-content-secondary mb-3 block">
                  Appointment Image <span className="text-content-faint">(16:9, shown in member app)</span>
                </label>
                <div
                  className="relative aspect-video bg-surface-card rounded-xl border-2 border-dashed border-border hover:border-border transition-colors cursor-pointer overflow-hidden group"
                  onClick={() => setShowImageSourceModal(true)}
                >
                  {appointmentTypeForm.image ? (
                    <>
                      <img
                        src={appointmentTypeForm.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Change Image</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setAppointmentTypeForm({ ...appointmentTypeForm, image: null })
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-content-faint">
                      <Upload className="w-10 h-10 mb-2" />
                      <span className="text-sm">Click to upload image</span>
                      <span className="text-xs mt-1">Recommended: 1920x1080px</span>
                    </div>
                  )}
                </div>
                <input
                  ref={appointmentImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAppointmentImageSelect}
                  className="hidden"
                />
              </div>

              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                    Name
                    <span className="text-red-400">*</span>
                    <Tooltip content="The name members will see when booking this appointment">
                      <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                    </Tooltip>
                  </label>
                  <input
                    type="text"
                    value={appointmentTypeForm.name}
                    onChange={(e) => setAppointmentTypeForm({ ...appointmentTypeForm, name: e.target.value })}
                    placeholder="e.g., Personal Training"
                    className="w-full bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                    Category
                    <Tooltip content="Group similar appointments together for easier organization">
                      <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                    </Tooltip>
                  </label>
                  <SelectField
                    value={appointmentTypeForm.category}
                    onChange={(v) => setAppointmentTypeForm({ ...appointmentTypeForm, category: v })}
                    options={appointmentCategories.map(c => ({ value: c, label: c }))}
                    placeholder="Select category"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                  Description
                  <Tooltip content="Optional details about what this appointment includes. Shown to members.">
                    <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                  </Tooltip>
                </label>
                <textarea
                  value={appointmentTypeForm.description}
                  onChange={(e) => setAppointmentTypeForm({ ...appointmentTypeForm, description: e.target.value })}
                  placeholder="Describe what this appointment includes..."
                  rows={3}
                  className="w-full bg-surface-card text-content-primary rounded-xl px-4 py-3 text-sm outline-none border border-border focus:border-accent-blue resize-none"
                />
              </div>

              {/* Duration, Slots Required, Max Parallel, Interval */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                    <Clock className="w-4 h-4 text-content-faint" />
                    Duration
                    <span className="text-red-400">*</span>
                    <Tooltip content="How long the appointment lasts in minutes">
                      <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                    </Tooltip>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={appointmentTypeForm.duration}
                      onChange={(e) => setAppointmentTypeForm({ ...appointmentTypeForm, duration: Math.floor(Number(e.target.value)) })}
                      onKeyDown={(e) => { if (e.key === '.' || e.key === ',') e.preventDefault() }}
                      min={5}
                      max={480}
                      className="w-24 bg-surface-card text-content-primary rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                    />
                    <span className="text-sm text-content-muted">min</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                    <Clock className="w-4 h-4 text-content-faint" />
                    Interval
                    <span className="text-red-400">*</span>
                    <Tooltip content="Time between available booking slots (e.g., 30 = bookings at :00 and :30)">
                      <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                    </Tooltip>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={appointmentTypeForm.interval}
                      onChange={(e) => setAppointmentTypeForm({ ...appointmentTypeForm, interval: Math.floor(Number(e.target.value)) })}
                      onKeyDown={(e) => { if (e.key === '.' || e.key === ',') e.preventDefault() }}
                      min={5}
                      max={120}
                      className="w-24 bg-surface-card text-content-primary rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                    />
                    <span className="text-sm text-content-muted">min</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                    <Settings className="w-4 h-4 text-content-faint" />
                    Slots
                    <span className="text-red-400">*</span>
                    <Tooltip content="How many capacity slots this appointment uses. Set to 0 if it doesn't block any capacity.">
                      <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                    </Tooltip>
                  </label>
                  <input
                    type="number"
                    value={appointmentTypeForm.slotsRequired}
                    onChange={(e) => setAppointmentTypeForm({ ...appointmentTypeForm, slotsRequired: Math.floor(Number(e.target.value)) })}
                    onKeyDown={(e) => { if (e.key === '.' || e.key === ',') e.preventDefault() }}
                    min={0}
                    max={studioCapacity}
                    className="w-24 bg-surface-card text-content-primary rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                    <Users className="w-4 h-4 text-content-faint" />
                    Max Parallel
                    <span className="text-red-400">*</span>
                    <Tooltip content="Maximum number of this appointment type that can run at the same time" position="right">
                      <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                    </Tooltip>
                  </label>
                  <input
                    type="number"
                    value={appointmentTypeForm.maxParallel}
                    onChange={(e) => setAppointmentTypeForm({ ...appointmentTypeForm, maxParallel: Math.floor(Number(e.target.value)) })}
                    onKeyDown={(e) => { if (e.key === '.' || e.key === ',') e.preventDefault() }}
                    min={1}
                    max={studioCapacity}
                    className="w-24 bg-surface-card text-content-primary rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                  />
                </div>
              </div>

              {/* Contingent Usage */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                  <BadgeDollarSign className="w-4 h-4 text-content-faint" />
                  Contingent Usage
                  <span className="text-red-400">*</span>
                  <Tooltip content="How many credits are deducted from the member's contract contingent when booking this appointment. For example, if set to 2, a member with 10 credits will have 8 left after booking.">
                    <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                  </Tooltip>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={appointmentTypeForm.contingentUsage}
                    onChange={(e) => setAppointmentTypeForm({ ...appointmentTypeForm, contingentUsage: Math.floor(Number(e.target.value)) })}
                    onKeyDown={(e) => { if (e.key === '.' || e.key === ',') e.preventDefault() }}
                    min={0}
                    className="w-24 bg-surface-card text-content-primary rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                  />
                  <span className="text-sm text-content-muted">per booking</span>
                </div>
                <p className="text-xs text-content-faint">0 = No deduction from member's contingent</p>
              </div>

              {/* Color */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                  Calendar Color
                  <Tooltip content="The color used to display this appointment type in the calendar">
                    <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                  </Tooltip>
                </label>
                <input
                  type="color"
                  value={appointmentTypeForm.color}
                  onChange={(e) => setAppointmentTypeForm({ ...appointmentTypeForm, color: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-border p-1"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-5 border-t border-border">
              <button
                onClick={() => setShowAppointmentTypeModal(false)}
                className="flex-1 px-4 py-2.5 bg-surface-button text-content-primary text-sm rounded-xl hover:bg-surface-button-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAppointmentType}
                className="flex-1 px-4 py-2.5 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover transition-colors"
              >
                {editingAppointmentType ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Source Modal */}
      <ImageSourceModal
        isOpen={showImageSourceModal}
        onClose={() => setShowImageSourceModal(false)}
        onSelectFile={() => appointmentImageInputRef.current?.click()}
        onSelectMediaLibrary={() => setShowMediaLibraryModal(true)}
      />

      {/* Media Library Picker Modal */}
      <MediaLibraryPickerModal
        isOpen={showMediaLibraryModal}
        onClose={() => setShowMediaLibraryModal(false)}
        onSelectImage={handleMediaLibrarySelect}
      />

      {/* Image Crop Modal */}
      <ImageCropModal
        isOpen={showImageCropModal}
        onClose={() => {
          setShowImageCropModal(false)
          setTempImage(null)
        }}
        imageSrc={tempImage}
        onCropComplete={handleCroppedImage}
        aspectRatio={16 / 9}
      />

      {/* Introductory Material Editor Modal */}
      <IntroMaterialEditorModal
        visible={introMaterialEditorVisible}
        onClose={() => {
          setIntroMaterialEditorVisible(false)
          setEditingIntroMaterial(null)
          setEditingIntroMaterialIndex(null)
        }}
        material={editingIntroMaterial}
        onSave={(updatedMaterial) => {
          if (editingIntroMaterialIndex !== null) {
            // Editing existing material
            const updated = [...introductoryMaterials]
            updated[editingIntroMaterialIndex] = updatedMaterial
            setIntroductoryMaterials(updated)
          } else {
            // Adding new material
            setIntroductoryMaterials(prev => [...prev, updatedMaterial])
          }
          setIntroMaterialEditorVisible(false)
          setEditingIntroMaterial(null)
          setEditingIntroMaterialIndex(null)
          notification.success({ message: "Material saved successfully" })
        }}
      />
    </div>
  )
}

export default ConfigurationPage
