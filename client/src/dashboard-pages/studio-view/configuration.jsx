/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import { useState, useEffect, useRef, useCallback } from "react"
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
  Timer,
  ArrowRightLeft,
  RefreshCw,
  Gift,
} from "lucide-react"
import { BsPersonWorkspace } from "react-icons/bs"
import { RiContractLine } from "react-icons/ri"
import { QRCode } from "antd"
import toast from "../../components/shared/SharedToast"
import DeleteModal from "../../components/shared/DeleteModal"
import AddItemModal from "../../components/shared/AddItemModal"
import dayjs from "dayjs"
import debounce from "lodash/debounce"

import ContractBuilder from "../../components/shared/contract-builder/ContractBuilder"
import { WysiwygEditor } from "../../components/shared/WysiwygEditor"
import { PermissionModal } from "../../components/studio-components/configuration-components/PermissionModal"
import { StaffAssignmentModal } from "../../components/studio-components/configuration-components/StaffAssignmentModal"
import DatePickerField from "../../components/shared/DatePickerField"
import IntroMaterialEditorModal from "../../components/shared/IntroMaterialEditorModal"
import ColorPickerModal from "../../components/shared/ColorPickerModal"
import AppointmentTypeModal from "../../components/studio-components/configuration-components/AppointmentTypeModal"
import ClassTypeModal from "../../components/studio-components/configuration-components/ClassTypeModal"
import ContractTypeModal from "../../components/studio-components/configuration-components/ContractTypeModal"
import CreateContractFormModal from "../../components/studio-components/configuration-components/CreateContractFormModal"
import CustomSelect from "../../components/shared/CustomSelect"
import DefaultAvatar from '../../../public/gray-avatar-fotor-20250912192528.png'
import { updateLoggedInStaffThunk } from '../../features/staff/staffSlice'
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

  // Classes Config
  DEFAULT_CLASS_CATEGORIES,
  DEFAULT_CLASS_TYPES,
  DEFAULT_CLASS_CALENDAR_SETTINGS,
  DEFAULT_CLASS_NOTIFICATION_TYPES,

  // Lead Config
  DEFAULT_LEAD_SOURCES,

  // Contract Config
  DEFAULT_CONTRACT_FORMS,
  DEFAULT_CONTRACT_TYPES,
  DEFAULT_CONTRACT_SETTINGS,
  DEFAULT_CONTRACT_PAUSE_REASONS,
  DEFAULT_CONTRACT_CHANGE_REASONS,
  DEFAULT_CONTRACT_RENEW_REASONS,
  DEFAULT_CONTRACT_BONUS_TIME_REASONS,
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
import { useDispatch } from "react-redux"
import { updateStudioThunk } from "../../features/studio/studioSlice"

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
    id: "classes",
    label: "Classes",
    icon: Timer,
    adminVisible: true,
    sections: [
      { id: "classes-calendar-settings", label: "Calendar Settings" },
      { id: "class-types", label: "Class Types" },
      { id: "class-categories", label: "Categories" },
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
      { id: "change-reasons", label: "Change Reasons" },
      { id: "renew-reasons", label: "Renew Reasons" },
      { id: "bonus-time-reasons", label: "Bonus Time Reasons" },
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
      { id: "contract-renewal-template", label: "Contract Renewal", group: "Email Templates" },
      { id: "contract-change-template", label: "Contract Change", group: "Email Templates" },
      { id: "sepa-mandate-template", label: "SEPA Mandate", group: "Email Templates" },
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
]

// ============================================
// Reusable Components
// ============================================

// Section Header Component
const SectionHeader = ({ title, description, action }) => (
  <div className={`flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 ${action ? 'flex' : 'hidden md:flex'}`}>
    <div className="hidden md:block">
      <h2 className="text-lg sm:text-xl font-semibold text-content-primary">{title}</h2>
      {description && <p className="text-xs sm:text-sm text-content-muted mt-1">{description}</p>}
    </div>
    {action && <div className="hidden lg:flex">{action}</div>}
  </div>
)

// Card Component
const SettingsCard = ({ children, className = "" }) => (
  <div className={`bg-surface-hover rounded-xl p-4 sm:p-6 ${className}`}>
    {children}
  </div>
)

// Collapsible Variables Row — collapsed on mobile, always visible on desktop
const VariablesRow = ({ children }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="md:hidden flex items-center gap-1.5 text-xs text-content-faint mb-1.5 hover:text-content-muted transition-colors"
      >
        <ChevronRight className={`w-3 h-3 transition-transform ${open ? "rotate-90" : ""}`} />
        Variables
      </button>
      <div className={`flex-wrap items-center gap-2 ${open ? "flex" : "hidden"} md:flex`}>
        {children}
      </div>
    </div>
  )
}

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
        className={`w-full bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border transition-colors ${error ? "border-red-500" : "border-border focus:border-primary"
          } ${Icon ? "pl-10" : ""}`}
      />
    </div>
    {helpText && <p className="text-xs text-content-faint">{helpText}</p>}
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
)

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
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-primary" : "bg-surface-button"
        }`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${checked ? "translate-x-5" : "translate-x-0"
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
        className="w-24 bg-surface-card text-content-primary rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-primary"
      />
      {suffix && <span className="text-sm text-content-muted">{suffix}</span>}
    </div>
    {helpText && <p className="text-xs text-content-faint">{helpText}</p>}
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
      className="bg-surface-card text-content-primary rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-primary"
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
  const dispatch = useDispatch();

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
  const [isSaving, setIsSaving] = useState(false)

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
    telephone: "",
    street: "",
    zipCode: "",
    city: "",
    country: "",
    dateOfBirth: "",
    username: "",
    password: "",
    img: null,
    imgData: null
  })

  const [profilePreviewUrl, setProfilePreviewUrl] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const profileFileInputRef = useRef(null)


  // ===========================
  // Update Logged-in  user details
  // ===========================

  const handleProfileInputChange = (field, value) => {

    const updateData = {
      [field]: value
    }
    setProfileData((prev) => ({ ...prev, [field]: value }))
    dispatch(updateLoggedInStaffThunk(updateData))
    console.log('update Data', updateData)
  }

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Update local state for preview
    setProfileData(prev => ({ ...prev, img: file }))

    const reader = new FileReader()
    reader.onloadend = () => {
      setProfilePreviewUrl(reader.result)
    }
    reader.readAsDataURL(file)

    // Prepare FormData to send to backend
    const formData = new FormData()
    formData.append("img", file)

    // Dispatch thunk to update staff
    dispatch(updateLoggedInStaffThunk(formData))
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

  // Classes
  const [classTypes, setClassTypes] = useState([])
  const [classCategories, setClassCategories] = useState([])
  const [classCalendarSettings, setClassCalendarSettings] = useState({})
  const [editingClassCategory, setEditingClassCategory] = useState({ index: null, value: "" })
  const [showClassTypeModal, setShowClassTypeModal] = useState(false)
  const [editingClassType, setEditingClassType] = useState(null)
  const [classTypeForm, setClassTypeForm] = useState({
    name: "", description: "", duration: 60, maxParticipants: 12, color: "#3B82F6", category: "", image: null,
  })


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



  // Members
  const [allowMemberQRCheckIn, setAllowMemberQRCheckIn] = useState(false)
  const [memberQRCodeUrl, setMemberQRCodeUrl] = useState("")
  const [leadSources, setLeadSources] = useState([])
  const [introductoryMaterials, setIntroductoryMaterials] = useState([])
  const [introMaterialEditorVisible, setIntroMaterialEditorVisible] = useState(false)
  const [editingIntroMaterial, setEditingIntroMaterial] = useState(null)
  const [editingIntroMaterialIndex, setEditingIntroMaterialIndex] = useState(null)

  // Unified Delete Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    title: "",
    itemName: "",
    description: "",
    onConfirm: null,
  })

  const openDeleteModal = (title, itemName, description, onConfirm) => {
    setDeleteModal({ isOpen: true, title, itemName, description, onConfirm })
  }

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, title: "", itemName: "", description: "", onConfirm: null })
  }

  // Unified Add Item Modal State
  const [addItemModal, setAddItemModal] = useState({
    isOpen: false,
    title: "",
    saveText: "Add",
    fields: [],
    initialData: null,
    onSave: null,
  })

  const openAddItemModal = (title, fields, onSave, opts = {}) => {
    setAddItemModal({
      isOpen: true,
      title,
      saveText: opts.saveText || "Add",
      fields,
      initialData: opts.initialData || null,
      onSave,
    })
  }

  const closeAddItemModal = () => {
    setAddItemModal({ isOpen: false, title: "", saveText: "Add", fields: [], initialData: null, onSave: null })
  }

  // Contract Form States
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
  const [contractChangeReasons, setContractChangeReasons] = useState([])
  const [contractRenewReasons, setContractRenewReasons] = useState([])
  const [contractBonusTimeReasons, setContractBonusTimeReasons] = useState([])

  // Communication Settings
  const [settings, setSettings] = useState({})
  const [appointmentNotificationTypes, setAppointmentNotificationTypes] = useState([])
  const [classNotificationTypes, setClassNotificationTypes] = useState([])

  // Notification section collapse states
  const [collapsedNotifSections, setCollapsedNotifSections] = useState({ emailAppointments: true, emailClasses: true, appAppointments: true, appClasses: true })

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
  const [colorPickerState, setColorPickerState] = useState({ isOpen: false, currentColor: '#FF843E', title: 'Choose Color', onSelect: null })

  const openColorPicker = (currentColor, title, onSelect) => {
    setColorPickerState({ isOpen: true, currentColor, title, onSelect })
  }

  // Countries
  const [countries, setCountries] = useState([])

  // Refs for WysiwygEditors (for variable insertion via insertText)
  const birthdayEditorRef = useRef(null)
  const appointmentEditorRefs = useRef({})
  const classEditorRefs = useRef({})
  const signatureEditorRef = useRef(null)
  const einvoiceEditorRef = useRef(null)
  const cancellationEditorRef = useRef(null)
  const conclusionEditorRef = useRef(null)
  const renewalEditorRef = useRef(null)
  const changeEditorRef = useRef(null)
  const sepaMandateEditorRef = useRef(null)
  const qrCodeRef = useRef(null)
  const mobileContentRef = useRef(null)
  const desktopContentRef = useRef(null)

  // ============================================
  // Debounced Save Function
  // ============================================
  const debouncedSave = useCallback(
    debounce(async (field, value) => {
      if (!config?.studio?.id) return;

      setIsSaving(true);
      try {
        // Create update object based on field
        const updateData = {};

        // Map frontend field names to backend field names
        const fieldMapping = {
          studioName: 'studioName',
          studioOperator: 'studioOwner',
          studioOperatorEmail: 'operatorEmail',
          studioOperatorPhone: 'operatorPhone',
          studioOperatorMobile: 'operatorMobile',
          studioStreet: 'street',
          studioZipCode: 'zipCode',
          studioCity: 'city',
          studioCountry: 'country',
          studioPhoneNo: 'phone',
          studioMobileNo: 'mobile',
          studioEmail: 'email',
          studioWebsite: 'website',
          openingHours: 'openingHours',
          closingDays: 'closingDays',
          overallCapacity: 'overallCapacity',
        };

        const backendField = fieldMapping[field] || field;
        updateData[backendField] = value;

        await dispatch(updateStudioThunk({
          studioId: config.studio.id,
          data: updateData
        })).unwrap();

        toast.success(`${field} updated`, { autoClose: 2000 });
      } catch (error) {
        console.error('Save error:', error);
        toast.error(`Failed to update ${field}`);
      } finally {
        setIsSaving(false);
      }
    }, 1000),
    [config?.studio?.id, dispatch]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  // ============================================
  // Save multiple fields at once
  // ============================================
  const saveStudioChanges = async (updateData) => {
    if (!config?.studio?.id) return;

    setIsSaving(true);
    try {
      await dispatch(updateStudioThunk({
        studioId: config.studio.id,
        data: updateData
      })).unwrap();

      toast.success('Studio updated successfully');
    } catch (error) {
      toast.error('Failed to save changes');
      console.error('Update error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================
  // Studio field change handlers
  // ============================================


  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Update local state for preview
    setLogo(prev => ({ ...prev, logo: file }))

    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoUrl(reader.result)
    }
    reader.readAsDataURL(file)

    // Prepare FormData to send to backend
    const formData = new FormData()
    formData.append("img", file)

    // Dispatch thunk to update staff
    dispatch(updateStudioThunk(formData))
  }
  const handleStudioNameChange = (value) => {
    setStudioName(value);
    debouncedSave('studioName', value);
  };

  const handleStudioOperatorChange = (value) => {
    setStudioOperator(value);
    debouncedSave('studioOperator', value);
  };

  const handleStudioOperatorEmailChange = (value) => {
    setStudioOperatorEmail(value);
    debouncedSave('studioOperatorEmail', value);
  };

  const handleStudioOperatorPhoneChange = (value) => {
    setStudioOperatorPhone(value);
    debouncedSave('studioOperatorPhone', value);
  };

  const handleStudioOperatorMobileChange = (value) => {
    setStudioOperatorMobile(value);
    debouncedSave('studioOperatorMobile', value);
  };

  const handleStudioStreetChange = (value) => {
    setStudioStreet(value);
    debouncedSave('studioStreet', value);
  };

  const handleStudioZipCodeChange = (value) => {
    setStudioZipCode(value);
    debouncedSave('studioZipCode', value);
  };

  const handleStudioCityChange = (value) => {
    setStudioCity(value);
    debouncedSave('studioCity', value);
  };

  const handleStudioCountryChange = (value) => {
    setStudioCountry(value);
    debouncedSave('studioCountry', value);
  };

  const handleStudioPhoneChange = (value) => {
    setStudioPhoneNo(value);
    debouncedSave('studioPhoneNo', value);
  };

  const handleStudioMobileChange = (value) => {
    setStudioMobileNo(value);
    debouncedSave('studioMobileNo', value);
  };

  const handleStudioEmailChange = (value) => {
    setStudioEmail(value);
    debouncedSave('studioEmail', value);
  };

  const handleStudioWebsiteChange = (value) => {
    setStudioWebsite(value);
    debouncedSave('studioWebsite', value);
  };

  const handleStudioCapacityChange = (value) => {
    setStudioCapacity(value);
    debouncedSave('overallCapacity', value);
  };

  // ============================================
  // Opening hours handlers
  // ============================================
  const handleOpeningHoursChange = (day, field, value) => {
    let updatedHours;

    if (field === 'closed') {
      // Handle toggle
      if (openingHours.some(h => h.day === day)) {
        updatedHours = openingHours.map(h =>
          h.day === day ? {
            ...h,
            isClosed: value,
            open: value ? undefined : h.open || '09:00',
            close: value ? undefined : h.close || '22:00'
          } : h
        );
      } else {
        updatedHours = [...openingHours, {
          day,
          open: value ? undefined : '09:00',
          close: value ? undefined : '22:00',
          isClosed: value
        }];
      }
    } else {
      // Handle time change
      if (openingHours.some(h => h.day === day)) {
        updatedHours = openingHours.map(h =>
          h.day === day ? { ...h, [field]: value, isClosed: false } : h
        );
      } else {
        updatedHours = [...openingHours, {
          day,
          open: field === 'open' ? value : '09:00',
          close: field === 'close' ? value : '22:00',
          isClosed: false
        }];
      }
    }

    setOpeningHours(updatedHours);
    debouncedSave('openingHours', updatedHours);
  };

  // ============================================
  // Closing days handlers
  // ============================================
  const handleClosingDayChange = (index, field, value) => {
    const updatedDays = [...closingDays];
    updatedDays[index] = { ...updatedDays[index], [field]: value };
    setClosingDays(updatedDays);
    debouncedSave('closingDays', updatedDays);
  };

  const handleAddClosingDay = () => {
    const newDay = {
      date: new Date().toISOString().split('T')[0],
      reason: '',
      description: '',
      _id: Date.now().toString()
    };
    const updatedDays = [...closingDays, newDay];
    setClosingDays(updatedDays);
    saveStudioChanges({ closingDays: updatedDays });
  };

  const handleRemoveClosingDay = (index) => {
    const updatedDays = closingDays.filter((_, i) => i !== index);
    setClosingDays(updatedDays);
    saveStudioChanges({ closingDays: updatedDays });
  };

  // ============================================
  // Populate state from hook config when it loads
  // ============================================
  useEffect(() => {
    if (!config) return

    // Studio info
    setStudioName(config.studio.name || "")
    setStudioOperator(config.studio.operator || "")
    setStudioOperatorEmail(config.studio.operatorEmail || "")
    setStudioOperatorPhone(config.studio.operatorPhone || "")
    setStudioOperatorMobile(config.studio.operatorMobile || "")
    setStudioStreet(config.studio.street || "")
    setStudioZipCode(config.studio.zipCode || "")
    setStudioCity(config.studio.city || "")
    setStudioCountry(config.studio.country || "")
    setStudioPhoneNo(config.studio.phone || "")
    setStudioMobileNo(config.studio.mobile || "")
    setStudioEmail(config.studio.email || "")
    setStudioWebsite(config.studio.website || "")
    setCurrency(config.studio.currency || "EUR")

    // Format opening hours if needed
    const formattedHours = config.studio.openingHours?.map(hour => ({
      ...hour,
      isClosed: hour.isClosed || hour.closed || false
    })) || [];
    setOpeningHours(formattedHours)

    // Format closing days if needed
    const formattedDays = config.studio.closingDays?.map(day => ({
      ...day,
      description: day.description || day.reason || ""
    })) || [];
    setClosingDays(formattedDays)

    // Staff
    setRoles(config.staff?.roles || [])
    setDefaultVacationDays(config.staff?.defaultVacationDays || 0)
    setDefaultStaffRole(config.staff?.defaultStaffRole || "")
    setDefaultStaffCountry(config.staff?.defaultStaffCountry || "")
    setAllStaff(config.staff?.allStaff || [])

    // Appointments
    setAppointmentTypes(config.appointments?.types || [])
    setAppointmentCategories(config.appointments?.categories || [])
    setStudioCapacity(config.appointments?.capacity || 10)
    setTrialTraining(config.appointments?.trialTraining || {})
    setCalendarSettings(config.appointments?.calendarSettings || {})

    // Classes
    setClassTypes(DEFAULT_CLASS_TYPES)
    setClassCategories(DEFAULT_CLASS_CATEGORIES)
    setClassCalendarSettings(DEFAULT_CLASS_CALENDAR_SETTINGS)

    // Members & Leads
    setAllowMemberQRCheckIn(config.members?.allowMemberQRCheckIn || false)
    setMemberQRCodeUrl(config.members?.memberQRCodeUrl || "")
    setLeadSources(config.members?.leadSources || [])
    setIntroductoryMaterials(config.members?.introductoryMaterials || [])

    // Contracts
    setAllowMemberSelfCancellation(config.contracts?.settings?.allowMemberSelfCancellation || false)
    setNoticePeriod(config.contracts?.settings?.noticePeriod || 30)
    setExtensionPeriod(config.contracts?.settings?.extensionPeriod || 12)
    setDefaultBillingPeriod(config.contracts?.settings?.defaultBillingPeriod || "")
    setDefaultAutoRenewal(config.contracts?.settings?.defaultAutoRenewal || false)
    setDefaultRenewalIndefinite(config.contracts?.settings?.defaultRenewalIndefinite || false)
    setDefaultRenewalPeriod(config.contracts?.settings?.defaultRenewalPeriod || 0)
    setDefaultAppointmentLimit(config.contracts?.settings?.defaultAppointmentLimit || 0)
    setContractTypes(config.contracts?.types || [])
    setContractForms(config.contracts?.forms || [])
    setContractPauseReasons(config.contracts?.pauseReasons || [])
    setContractChangeReasons(config.contracts?.changeReasons || DEFAULT_CONTRACT_CHANGE_REASONS)
    setContractRenewReasons(config.contracts?.renewReasons || DEFAULT_CONTRACT_RENEW_REASONS)
    setContractBonusTimeReasons(config.contracts?.bonusTimeReasons || DEFAULT_CONTRACT_BONUS_TIME_REASONS)

    // Communication
    setSettings(config.communication?.settings || {})
    setAppointmentNotificationTypes(config.communication?.notificationTypes || [])
    setClassNotificationTypes(config.communication?.classNotificationTypes || DEFAULT_CLASS_NOTIFICATION_TYPES)

    // Finances
    setVatRates(config.finances?.vatRates || [])
    setVatNumber(config.finances?.vatNumber || "")
    setBankName(config.finances?.bankName || "")
    setCreditorId(config.finances?.creditorId || "")
    setCreditorName(config.finances?.creditorName || "")
    setIban(config.finances?.iban || "")
    setBic(config.finances?.bic || "")

    // Appearance
    setAppearance(config.appearance || {})

    // Countries
    setCountries(config.countries || COUNTRIES)
  }, [config])

  // ============================================
  // Sync configurable colors to CSS custom properties
  // ============================================
  useEffect(() => {
    if (trialTraining.color) {
      document.documentElement.style.setProperty('--color-trial', trialTraining.color)
    }
  }, [trialTraining.color])

  // ============================================
  // Live-sync appearance settings to CSS
  // ============================================

  // Sync theme (light / dark)
  useEffect(() => {
    if (!appearance.theme) return
    const root = document.documentElement

    if (appearance.theme === "light") {
      root.classList.add("light")
      root.style.setProperty("color-scheme", "light")
    } else {
      root.classList.remove("light")
      root.style.setProperty("color-scheme", "dark")
    }

    localStorage.setItem("theme", appearance.theme)
  }, [appearance.theme])

  // Sync primary color
  useEffect(() => {
    if (!appearance.primaryColor || !/^#[0-9A-Fa-f]{6}$/.test(appearance.primaryColor)) return
    const root = document.documentElement

    root.style.setProperty("--color-primary", appearance.primaryColor)

    // Compute a darker hover variant (~12% darker)
    const hex = appearance.primaryColor
    const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - 30)
    const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - 30)
    const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - 30)
    const hover = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
    root.style.setProperty("--color-primary-hover", hover)

    localStorage.setItem("primaryColor", appearance.primaryColor)
  }, [appearance.primaryColor])

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
      toast.error("Error — Could not load public holidays")
    } finally {
      setIsLoadingHolidays(false)
    }
  }

  const addPublicHolidaysToClosingDays = () => {
    if (publicHolidays.length === 0) {
      toast.error("No Holidays — Please select a country first")
      return
    }
    const existingDates = closingDays.map(d => d.date)
    const newHolidays = publicHolidays.filter(h => !existingDates.includes(h.date))
    if (newHolidays.length === 0) {
      toast.success("No New Holidays — All holidays already added")
      return
    }
    const updatedDays = [...closingDays, ...newHolidays.map(h => ({ date: h.date, description: h.name, reason: h.name }))];
    setClosingDays(updatedDays);
    saveStudioChanges({ closingDays: updatedDays });
    toast.success(`Added — Added ${newHolidays.length} holidays`)
  }

 

  // Role handlers
  const handleAddRole = () => {
    openAddItemModal(
      "Add Role",
      [
        { key: "name", label: "Role Name", type: "text", placeholder: "e.g. Trainer, Manager", required: true },
        { key: "color", label: "Color", type: "color" },
      ],
      (data) => {
        const duplicate = roles.find(r => r.name.toLowerCase() === data.name.toLowerCase())
        if (duplicate) {
          toast.error("Duplicate name — Role name already exists")
          return
        }
        setRoles([...roles, {
          id: Date.now(),
          name: data.name,
          permissions: [],
          color: data.color,
          isAdmin: false,
          staffCount: 0,
          assignedStaff: []
        }])
        closeAddItemModal()
        toast.success("Role created")
      }
    )
  }

  const handleUpdateRole = (index, field, value) => {
    const updated = [...roles]
    if (field === "name" && value.trim()) {
      const duplicate = roles.find((r, i) => i !== index && r.name.toLowerCase() === value.toLowerCase().trim())
      if (duplicate) {
        toast.error("Duplicate name — Role name already exists")
        return
      }
    }
    updated[index][field] = value
    setRoles(updated)
  }

  const handleDeleteRole = (index) => {
    if (roles[index].isAdmin) {
      toast.error("Cannot delete Admin role")
      return
    }
    if (roles[index].staffCount > 0) {
      toast.error("Reassign staff first")
      return
    }
    openDeleteModal(
      "Delete Role",
      roles[index].name || "this role",
      "This action cannot be undone.",
      () => {
        setRoles(roles.filter((_, i) => i !== index))
        closeDeleteModal()
        toast.success("Role deleted")
      }
    )
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
        toast.error("Cannot remove last admin — At least one staff member must remain in the Admin role.")
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
      toast.error("Please enter a name for the appointment type")
      return
    }
    if (!appointmentTypeForm.duration || appointmentTypeForm.duration < 5) {
      toast.error("Please enter a valid duration (min. 5 minutes)")
      return
    }
    if (!appointmentTypeForm.interval || appointmentTypeForm.interval < 5) {
      toast.error("Please enter a valid interval (min. 5 minutes)")
      return
    }
    if (appointmentTypeForm.slotsRequired === undefined || appointmentTypeForm.slotsRequired === null || appointmentTypeForm.slotsRequired === "") {
      toast.error("Please enter the slots required")
      return
    }
    if (!appointmentTypeForm.maxParallel || appointmentTypeForm.maxParallel < 1) {
      toast.error("Please enter max parallel (min. 1)")
      return
    }
    if (appointmentTypeForm.contingentUsage === undefined || appointmentTypeForm.contingentUsage === null || appointmentTypeForm.contingentUsage === "") {
      toast.error("Please enter the contingent usage")
      return
    }

    if (editingAppointmentType) {
      // Update existing
      setAppointmentTypes(appointmentTypes.map(t =>
        t.id === editingAppointmentType.id
          ? { ...t, ...appointmentTypeForm }
          : t
      ))
      toast.success("Appointment type updated")
    } else {
      // Create new
      setAppointmentTypes([...appointmentTypes, {
        id: Date.now(),
        ...appointmentTypeForm
      }])
      toast.success("Appointment type created")
    }

    setShowAppointmentTypeModal(false)
    setEditingAppointmentType(null)
  }

  const handleDeleteAppointmentType = (id) => {
    const type = appointmentTypes.find(t => t.id === id)
    openDeleteModal(
      "Delete Appointment Type",
      type?.name || "this appointment type",
      "This cannot be undone.",
      () => {
        setAppointmentTypes(appointmentTypes.filter(t => t.id !== id))
        closeDeleteModal()
        toast.success("Appointment type deleted")
      }
    )
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
    const type = appointmentTypes[index]
    openDeleteModal(
      "Remove Appointment Type",
      type?.name || "this appointment type",
      "This cannot be undone.",
      () => {
        setAppointmentTypes(appointmentTypes.filter((_, i) => i !== index))
        closeDeleteModal()
        toast.success("Appointment type removed")
      }
    )
  }

  // Category handlers
  const handleAddCategory = () => {
    openAddItemModal(
      "Add Category",
      [
        { key: "name", label: "Category Name", type: "text", placeholder: "e.g. Strength, Cardio", required: true },
      ],
      (data) => {
        const duplicate = appointmentCategories.find(c => c.toLowerCase() === data.name.toLowerCase())
        if (duplicate) {
          toast.error("Duplicate — Category already exists")
          return
        }
        setAppointmentCategories([...appointmentCategories, data.name])
        closeAddItemModal()
        toast.success("Category created")
      }
    )
  }

  const handleRemoveCategory = (index) => {
    const category = appointmentCategories[index]
    if (appointmentTypes.some(t => t.category === category)) {
      toast.error("Cannot remove — Category is in use")
      return
    }
    openDeleteModal(
      "Delete Category",
      category,
      "This cannot be undone.",
      () => {
        setAppointmentCategories(appointmentCategories.filter((_, i) => i !== index))
        closeDeleteModal()
        toast.success("Category deleted")
      }
    )
  }

  // ============================================
  // Classes Handlers
  // ============================================
  const handleOpenClassTypeModal = (type = null) => {
    if (type) {
      setEditingClassType(type)
      setClassTypeForm({
        name: type.name || "", description: type.description || "",
        duration: type.duration || 60, maxParticipants: type.maxParticipants || 12,
        color: type.color || "#3B82F6", category: type.category || "",
        image: type.image || null,
      })
    } else {
      setEditingClassType(null)
      setClassTypeForm({
        name: "", description: "", duration: 60, maxParticipants: 12,
        color: "#3B82F6", category: "", image: null,
      })
    }
    setShowClassTypeModal(true)
  }

  const handleSaveClassType = () => {
    if (!classTypeForm.name.trim()) {
      toast.error("Please enter a name for the class type")
      return
    }
    if (!classTypeForm.duration || classTypeForm.duration < 5) {
      toast.error("Please enter a valid duration (min. 5 minutes)")
      return
    }
    if (!classTypeForm.maxParticipants || classTypeForm.maxParticipants < 1) {
      toast.error("Please enter max participants (min. 1)")
      return
    }
    if (editingClassType) {
      setClassTypes(classTypes.map(t => t.id === editingClassType.id ? { ...t, ...classTypeForm } : t))
      toast.success("Class type updated")
    } else {
      setClassTypes([...classTypes, { id: Date.now(), ...classTypeForm }])
      toast.success("Class type created")
    }
    setShowClassTypeModal(false)
    setEditingClassType(null)
  }

  const handleDeleteClassType = (id) => {
    const type = classTypes.find(t => t.id === id)
    openDeleteModal(
      "Delete Class Type",
      type?.name || "this class type",
      "This cannot be undone.",
      () => {
        setClassTypes(classTypes.filter(t => t.id !== id))
        closeDeleteModal()
        toast.success("Class type deleted")
      }
    )
  }

  const handleAddClassCategory = () => {
    openAddItemModal(
      "Add Category",
      [
        { key: "name", label: "Category Name", type: "text", placeholder: "e.g. Yoga, HIIT", required: true },
      ],
      (data) => {
        const duplicate = classCategories.find(c => c.toLowerCase() === data.name.toLowerCase())
        if (duplicate) {
          toast.error("Duplicate — Category already exists")
          return
        }
        setClassCategories([...classCategories, data.name])
        closeAddItemModal()
        toast.success("Category created")
      }
    )
  }

  const handleRemoveClassCategory = (index) => {
    const category = classCategories[index]
    if (classTypes.some(t => t.category === category)) {
      toast.error("Cannot remove — Category is in use by a class type")
      return
    }
    openDeleteModal(
      "Delete Category",
      category,
      "This cannot be undone.",
      () => {
        setClassCategories(classCategories.filter((_, i) => i !== index))
        closeDeleteModal()
        toast.success("Category deleted")
      }
    )
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
      toast.error("Please enter a contract name")
      return
    }
    if (!editingContractType.duration || editingContractType.duration < 1) {
      toast.error("Please enter a valid duration")
      return
    }
    if (!editingContractType.billingPeriod) {
      toast.error("Please select a billing period")
      return
    }
    if (editingContractType.userCapacity === undefined || editingContractType.userCapacity === null || editingContractType.userCapacity === "") {
      toast.error("Please enter a contingent value (0 for unlimited)")
      return
    }
    if (contractForms.length === 0) {
      toast.error("Please create a contract form first")
      return
    }
    if (!editingContractType.contractFormId) {
      toast.error("Please select a contract form")
      return
    }

    if (editingContractTypeIndex !== null) {
      const updated = [...contractTypes]
      updated[editingContractTypeIndex] = editingContractType
      setContractTypes(updated)
      toast.success("Contract type updated")
    } else {
      setContractTypes([...contractTypes, editingContractType])
      toast.success("Contract type created")
    }

    setContractTypeModalVisible(false)
    setEditingContractType(null)
    setEditingContractTypeIndex(null)
  }

  const handleDeleteContractType = (index) => {
    const type = contractTypes[index]
    openDeleteModal(
      "Delete Contract Type",
      type.name || "this contract type",
      "This cannot be undone.",
      () => {
        setContractTypes(contractTypes.filter((_, i) => i !== index))
        closeDeleteModal()
        toast.success("Contract type deleted")
      }
    )
  }

  const handleCreateContractForm = () => {
    if (!newContractFormName.trim()) {
      toast.error("Please enter a name")
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
    toast.success("Contract form created")
  }

  // Lead source handlers
  const handleAddLeadSource = () => {
    openAddItemModal(
      "Add Lead Source",
      [
        { key: "name", label: "Source Name", type: "text", placeholder: "e.g. Instagram, Referral", required: true },
        { key: "color", label: "Color", type: "color" },
      ],
      (data) => {
        setLeadSources([...leadSources, { id: Date.now(), name: data.name, color: data.color }])
        closeAddItemModal()
        toast.success("Lead source created")
      }
    )
  }

  const handleUpdateLeadSource = (id, field, value) => {
    setLeadSources(leadSources.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const handleRemoveLeadSource = (id) => {
    const source = leadSources.find(s => s.id === id)
    openDeleteModal(
      "Delete Lead Source",
      source?.name || "this lead source",
      "This cannot be undone.",
      () => {
        setLeadSources(leadSources.filter(s => s.id !== id))
        closeDeleteModal()
        toast.success("Lead source deleted")
      }
    )
  }

  // VAT handlers
  const handleAddVatRate = () => {
    openAddItemModal(
      "Add VAT Rate",
      [
        { key: "percentage", label: "Rate", type: "number", suffix: "%", min: 0, max: 100, required: true, defaultValue: 19 },
        { key: "description", label: "Description", type: "text", placeholder: "e.g. Standard Rate, Reduced Rate" },
      ],
      (data) => {
        setVatRates([...vatRates, { name: "", percentage: data.percentage, description: data.description }])
        closeAddItemModal()
        toast.success("VAT rate created")
      }
    )
  }

  // Reason handlers (contract pause/change/renew/bonus)
  const handleAddPauseReason = () => {
    openAddItemModal(
      "Add Pause Reason",
      [
        { key: "name", label: "Reason", type: "text", placeholder: "e.g. Medical, Vacation", required: true },
        { key: "maxDays", label: "Max Pause Duration", type: "number", suffix: "days", min: 1, defaultValue: 30 },
      ],
      (data) => {
        setContractPauseReasons([...contractPauseReasons, { name: data.name, maxDays: data.maxDays }])
        closeAddItemModal()
        toast.success("Pause reason created")
      }
    )
  }

  const handleAddChangeReason = () => {
    openAddItemModal(
      "Add Change Reason",
      [
        { key: "name", label: "Reason", type: "text", placeholder: "e.g. Upgrade, Downgrade", required: true },
      ],
      (data) => {
        setContractChangeReasons([...contractChangeReasons, { id: Date.now(), name: data.name }])
        closeAddItemModal()
        toast.success("Change reason created")
      }
    )
  }

  const handleAddRenewReason = () => {
    openAddItemModal(
      "Add Renew Reason",
      [
        { key: "name", label: "Reason", type: "text", placeholder: "e.g. Satisfied, New Goals", required: true },
      ],
      (data) => {
        setContractRenewReasons([...contractRenewReasons, { id: Date.now(), name: data.name }])
        closeAddItemModal()
        toast.success("Renew reason created")
      }
    )
  }

  const handleAddBonusTimeReason = () => {
    openAddItemModal(
      "Add Bonus Time Reason",
      [
        { key: "name", label: "Reason", type: "text", placeholder: "e.g. Referral, Promotion", required: true },
      ],
      (data) => {
        setContractBonusTimeReasons([...contractBonusTimeReasons, { id: Date.now(), name: data.name }])
        closeAddItemModal()
        toast.success("Bonus time reason created")
      }
    )
  }

  // Navigate to section
  const navigateToSection = (categoryId, sectionId) => {
    setActiveCategory(categoryId)
    setActiveSection(sectionId)
    if (!expandedCategories.includes(categoryId)) {
      setExpandedCategories([...expandedCategories, categoryId])
    }
    setMobileShowContent(true)
    // Double RAF: first waits for React commit, second for browser paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mobileContentRef.current?.scrollTo(0, 0)
        desktopContentRef.current?.scrollTo(0, 0)
      })
    })
  }

  // Mobile floating + button action per section
  const getMobileAddAction = () => {
    switch (activeSection) {
      case "closing-days":
        return handleAddClosingDay
      case "appointment-types":
        return () => handleOpenAppointmentTypeModal(null)
      case "appointment-categories":
        return handleAddCategory
      case "class-types":
        return () => handleOpenClassTypeModal(null)
      case "class-categories":
        return handleAddClassCategory
      case "staff-roles":
        return handleAddRole
      case "lead-sources":
        return handleAddLeadSource
      case "intro-materials":
        return () => {
          const newMaterial = {
            id: Date.now(),
            name: "",
            pages: [{ id: Date.now(), title: "Page 1", content: "" }]
          }
          setEditingIntroMaterial(newMaterial)
          setEditingIntroMaterialIndex(null)
          setIntroMaterialEditorVisible(true)
        }
      case "contract-forms":
        return () => setShowCreateFormModal(true)
      case "contract-types":
        return handleAddContractType
      case "pause-reasons":
        return handleAddPauseReason
      case "change-reasons":
        return handleAddChangeReason
      case "renew-reasons":
        return handleAddRenewReason
      case "bonus-time-reasons":
        return handleAddBonusTimeReason
      case "vat-rates":
        return handleAddVatRate
      default:
        return null
    }
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
                      <span className={profileData.dateOfBirth ? "text-content-primary" : "text-content-faint"}>{profileData.dateOfBirth ? (() => { const [y, m, d] = profileData.dateOfBirth.split('-'); return `${d}.${m}.${y}` })() : "Select date"}</span>
                      <DatePickerField value={profileData.dateOfBirth} onChange={(val) => handleProfileInputChange("dateOfBirth", val)} />
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
                    label="Mobile Number"
                    value={profileData.phone}
                    onChange={(v) => handleProfileInputChange("phone", v)}
                    placeholder="Enter mobile number"
                  />
                  <InputField
                    label="Telephone Number"
                    value={profileData.telephone}
                    onChange={(v) => handleProfileInputChange("telephone", v)}
                    placeholder="Enter telephone number"
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
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                      Country
                    </label>
                    <CustomSelect
                      name="country"
                      value={profileData.country}
                      onChange={(e) => handleProfileInputChange("country", e.target.value)}
                      options={countries.map(c => ({ value: c.code, label: c.name }))}
                      placeholder="Select country"
                      searchable
                      className="bg-surface-card px-4 py-2.5 border-border"
                    />
                  </div>
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
                      className="w-full px-4 py-2.5 pr-12 rounded-xl bg-surface-card border border-border outline-none text-sm text-content-primary focus:border-primary"
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
            {/* Saving Indicator */}
            {isSaving && (
              <div className="fixed top-4 right-4 bg-primary text-white px-4 py-2 rounded-xl shadow-lg z-50 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            )}

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
                    value={config?.studio?.id || ""}
                    disabled
                    className="w-full bg-surface-dark text-content-faint rounded-xl px-4 py-2.5 text-sm outline-none border border-border cursor-not-allowed"
                  />
                </div>
                <InputField
                  label="Studio Name"
                  value={studioName}
                  onChange={handleStudioNameChange}
                  placeholder="Enter studio name"
                  required
                  maxLength={50}
                />
                <InputField
                  label="Telephone Number"
                  value={studioPhoneNo}
                  onChange={handleStudioPhoneChange}
                  placeholder="Enter telephone number"
                  maxLength={15}
                />
                <InputField
                  label="Mobile Number"
                  value={studioMobileNo}
                  onChange={handleStudioMobileChange}
                  placeholder="Enter mobile number"
                  maxLength={15}
                />
                <InputField
                  label="Email"
                  value={studioEmail}
                  onChange={handleStudioEmailChange}
                  placeholder="Enter email"
                  type="email"
                  maxLength={60}
                />
                <InputField
                  label="Website"
                  value={studioWebsite}
                  onChange={handleStudioWebsiteChange}
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
                  onChange={handleStudioStreetChange}
                  placeholder="Enter street address"
                  required
                  maxLength={60}
                />
                <InputField
                  label="ZIP Code"
                  value={studioZipCode}
                  onChange={handleStudioZipCodeChange}
                  placeholder="Enter ZIP code"
                  required
                  maxLength={10}
                />
                <InputField
                  label="City"
                  value={studioCity}
                  onChange={handleStudioCityChange}
                  placeholder="Enter city"
                  required
                  maxLength={40}
                />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                    Country
                    <span className="text-red-400">*</span>
                  </label>
                  <CustomSelect
                    name="studioCountry"
                    value={studioCountry}
                    onChange={(e) => handleStudioCountryChange(e.target.value)}
                    options={countries.map(c => ({ value: c.code, label: c.name }))}
                    placeholder="Select country"
                    required
                    searchable
                    className="bg-surface-card px-4 py-2.5 border-border"
                  />
                </div>
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
                    onChange={handleStudioOperatorChange}
                    placeholder="Enter operator name"
                    required
                    maxLength={50}
                  />
                </div>
                <InputField
                  label="Email"
                  value={studioOperatorEmail}
                  onChange={handleStudioOperatorEmailChange}
                  placeholder="Enter operator email"
                  type="email"
                  maxLength={60}
                />
                <InputField
                  label="Telephone Number"
                  value={studioOperatorPhone}
                  onChange={handleStudioOperatorPhoneChange}
                  placeholder="Enter telephone number"
                  maxLength={15}
                />
                <InputField
                  label="Mobile Number"
                  value={studioOperatorMobile}
                  onChange={handleStudioOperatorMobileChange}
                  placeholder="Enter mobile number"
                  maxLength={15}
                />
              </div>
            </SettingsCard>

            {/* Manual Save Button */}
            <div className="flex justify-end">
              <button
                onClick={() => saveStudioChanges({
                  studioName,
                  studioOwner: studioOperator,
                  email: studioEmail,
                  phone: studioPhoneNo,
                  street: studioStreet,
                  zipCode: studioZipCode,
                  city: studioCity,
                  country: studioCountry,
                  website: studioWebsite,
                })}
                disabled={isSaving}
                className="px-6 py-2.5 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save All Changes
                  </>
                )}
              </button>
            </div>
          </div>
        )

      case "opening-hours":
        return (
          <div className="space-y-6">
            {isSaving && (
              <div className="fixed top-4 right-4 bg-primary text-white px-4 py-2 rounded-xl shadow-lg z-50 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            )}

            <SectionHeader title="Opening Hours" description="Set your studio's weekly schedule" />
            <SettingsCard>
              <div className="space-y-3">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                  const existingHour = openingHours.find(h => h.day === day)
                  const hour = existingHour || {
                    day,
                    open: '09:00',
                    close: '22:00',
                    isClosed: day === 'Sunday'
                  }
                  const isClosed = hour.isClosed || false

                  return (
                    <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-surface-card rounded-xl">
                      <div className="flex items-center justify-between sm:w-32">
                        <span className="text-content-primary font-medium text-sm sm:text-base">{day}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-1 flex-wrap sm:flex-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpeningHoursChange(day, 'closed', !isClosed)}
                          className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${!isClosed ? "bg-primary" : "bg-surface-button"
                            }`}
                        >
                          <span
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${!isClosed ? "translate-x-5" : "translate-x-0"
                              }`}
                          />
                        </button>
                        <span className="text-sm text-content-muted w-12">{isClosed ? "Closed" : "Open"}</span>

                        {!isClosed && (
                          <>
                            <input
                              type="time"
                              value={hour.open || '09:00'}
                              onChange={(e) => handleOpeningHoursChange(day, 'open', e.target.value)}
                              className="bg-surface-hover text-content-primary rounded-lg px-2 sm:px-3 py-2 text-sm border border-border flex-1 sm:flex-none"
                            />
                            <span className="text-content-muted text-sm">to</span>
                            <input
                              type="time"
                              value={hour.close || '22:00'}
                              onChange={(e) => handleOpeningHoursChange(day, 'close', e.target.value)}
                              className="bg-surface-hover text-content-primary rounded-lg px-2 sm:px-3 py-2 text-sm border border-border flex-1 sm:flex-none"
                            />
                          </>
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
            {isSaving && (
              <div className="fixed top-4 right-4 bg-primary text-white px-4 py-2 rounded-xl shadow-lg z-50 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            )}

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
                    onClick={handleAddClosingDay}
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
                    <div key={day._id || index} className="flex flex-col sm:flex-row gap-3 p-3 bg-surface-card rounded-xl">
                      <div className="w-full sm:w-44">
                        <input
                          type="date"
                          value={day.date ? day.date.split('T')[0] : ''}
                          onChange={(e) => handleClosingDayChange(index, 'date', e.target.value)}
                          className="w-full bg-surface-hover text-content-primary rounded-lg px-3 py-2 text-sm border border-border"
                        />
                      </div>
                      <input
                        type="text"
                        value={day.reason || day.description || ''}
                        onChange={(e) => handleClosingDayChange(index, 'reason', e.target.value)}
                        placeholder="Reason (e.g., Public Holiday)"
                        className="bg-surface-hover text-content-primary rounded-lg px-3 py-2 text-sm border border-border flex-1"
                      />
                      <button
                        onClick={() => {
                          openDeleteModal(
                            "Delete Closing Day",
                            day.reason || day.description || day.date,
                            "This cannot be undone.",
                            () => {
                              handleRemoveClosingDay(index);
                              closeDeleteModal();
                            }
                          )
                        }}
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

      // ... rest of your sections remain the same ...
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
              className="w-full bg-surface-card text-content-primary rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none border border-border focus:border-primary transition-colors"
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
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${activeCategory === category.id
                    ? "bg-surface-button text-content-primary"
                    : categoryMatches
                      ? "bg-primary/10 text-orange-300 hover:bg-primary/20"
                      : "text-content-muted hover:text-content-primary hover:bg-surface-hover"
                    }`}
                >
                  <category.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 font-medium">{highlightText(category.label)}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${expandedCategories.includes(category.id) ? "rotate-90" : ""
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
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeSection === section.id
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
      <div className={`lg:hidden fixed inset-x-0 top-14 bottom-0 flex flex-col bg-surface-base z-20 ${mobileShowContent ? 'hidden' : 'flex'}`}>
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
              className="w-full bg-surface-card text-content-primary rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none border border-border focus:border-primary transition-colors"
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
        <div className="flex-1 min-h-0 overflow-y-auto p-2">
          {filteredNavItems.map((category) => {
            const categoryMatches = matchesSearch(category.label)

            return (
              <div key={category.id} className="mb-1">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors ${activeCategory === category.id
                    ? "bg-surface-button text-content-primary"
                    : categoryMatches
                      ? "bg-primary/10 text-orange-300"
                      : "text-content-muted hover:text-content-primary hover:bg-surface-hover"
                    }`}
                >
                  <category.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 font-medium">{highlightText(category.label)}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${expandedCategories.includes(category.id) ? "rotate-90" : ""
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
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between ${sectionMatches
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

      {/* Mobile Content View - fixed fullscreen below dashboard header */}
      {mobileShowContent && (
        <div className="lg:hidden fixed inset-x-0 top-14 bottom-0 flex flex-col bg-surface-base z-30">
          {/* Mobile Content Header with Back Button - always visible */}
          <div className="flex items-center gap-3 p-4 border-b border-border flex-shrink-0">
            <button
              onClick={() => setMobileShowContent(false)}
              className="p-2 -ml-2 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold truncate">{getCurrentSectionTitle()}</h1>
          </div>

          {/* Mobile Content Area */}
          <div ref={mobileContentRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4">
            {renderSectionContent()}
          </div>

          {/* Floating Action Button - Mobile */}
          {getMobileAddAction() && (
            <button
              onClick={getMobileAddAction()}
              className="fixed bottom-4 right-4 bg-primary hover:bg-primary-hover text-white p-4 rounded-xl shadow-lg transition-all active:scale-95 z-30"
              aria-label="Add"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Desktop Main Content */}
      <div className="hidden lg:flex flex-1 flex-col min-h-0 overflow-hidden">
        {/* Desktop Header */}
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <h1 className="text-2xl font-bold">Configuration</h1>
        </div>

        {/* Content Area */}
        <div ref={desktopContentRef} className="flex-1 overflow-y-auto p-6">
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

      <AppointmentTypeModal
        isOpen={showAppointmentTypeModal}
        onClose={() => setShowAppointmentTypeModal(false)}
        editingAppointmentType={editingAppointmentType}
        appointmentTypeForm={appointmentTypeForm}
        setAppointmentTypeForm={setAppointmentTypeForm}
        appointmentCategories={appointmentCategories}
        studioCapacity={studioCapacity}
        onSave={handleSaveAppointmentType}
        openColorPicker={openColorPicker}
      />

      <ClassTypeModal
        isOpen={showClassTypeModal}
        onClose={() => setShowClassTypeModal(false)}
        editingClassType={editingClassType}
        classTypeForm={classTypeForm}
        setClassTypeForm={setClassTypeForm}
        classCategories={classCategories}
        onSave={handleSaveClassType}
        openColorPicker={openColorPicker}
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
          toast.success("Material saved successfully")
        }}
      />

      {/* Shared Color Picker Modal */}
      <ColorPickerModal
        isOpen={colorPickerState.isOpen}
        onClose={() => setColorPickerState(prev => ({ ...prev, isOpen: false }))}
        onSelectColor={(color) => {
          if (colorPickerState.onSelect) colorPickerState.onSelect(color)
        }}
        currentColor={colorPickerState.currentColor}
        title={colorPickerState.title}
      />

      {/* Shared Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={deleteModal.onConfirm}
        title={deleteModal.title}
        itemName={deleteModal.itemName}
        description={deleteModal.description}
      />

      {/* Shared Add Item Modal */}
      <AddItemModal
        isOpen={addItemModal.isOpen}
        onClose={closeAddItemModal}
        onSave={addItemModal.onSave}
        title={addItemModal.title}
        saveText={addItemModal.saveText}
        fields={addItemModal.fields}
        initialData={addItemModal.initialData}
      />
    </div>
  )
}

export default ConfigurationPage