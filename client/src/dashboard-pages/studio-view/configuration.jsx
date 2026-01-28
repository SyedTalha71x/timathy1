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
} from "lucide-react"
import { BsPersonWorkspace } from "react-icons/bs"
import { RiContractLine } from "react-icons/ri"
import { Modal, notification, QRCode } from "antd"
import dayjs from "dayjs"

import ContractBuilder from "../../components/studio-components/configuration-components/ContractBuilder"
import { WysiwygEditor } from "../../components/shared/WysiwygEditor"
import { PERMISSION_DATA, PermissionModal } from "../../components/studio-components/configuration-components/PermissionModal"
import { RoleItem } from "../../components/studio-components/configuration-components/RoleItem"
import { StaffAssignmentModal } from "../../components/studio-components/configuration-components/StaffAssignmentModal"
import ImageSourceModal from "../../components/shared/ImageSourceModal"
import ImageCropModal from "../../components/shared/ImageCropModal"
import IntroMaterialEditorModal from "../../components/studio-components/configuration-components/IntroMaterialEditorModal"
import MediaLibraryPickerModal from "../../components/shared/MediaLibraryPickerModal"
import DefaultAvatar from '../../../public/gray-avatar-fotor-20250912192528.png'

// ============================================
// Navigation Items Configuration
// ============================================
const navigationItems = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
    sections: [
      { id: "profile-details", label: "Personal Details" },
      { id: "profile-access", label: "Access Data" },
    ],
  },
  {
    id: "studio",
    label: "Studio",
    icon: Building2,
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
    sections: [
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
    sections: [
      { id: "staff-defaults", label: "Default Settings" },
      { id: "staff-roles", label: "Roles & Permissions" },
    ],
  },
  {
    id: "members",
    label: "Members & Leads",
    icon: Users,
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
    sections: [
      { id: "comm-general", label: "General Settings" },
      { id: "email-notifications", label: "Email Notifications" },
      { id: "app-notifications", label: "App Notifications" },
      { id: "smtp-setup", label: "SMTP Setup" },
      { id: "email-signature", label: "Email Signature" },
      { id: "e-invoice-template", label: "E-Invoice Template" },
    ],
  },
  {
    id: "finances",
    label: "Finances",
    icon: BadgeDollarSign,
    sections: [
      { id: "vat-rates", label: "VAT Rates" },
      { id: "payment-settings", label: "Payment Settings" },
    ],
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: Palette,
    sections: [
      { id: "theme", label: "Theme Settings" },
    ],
  },
  {
    id: "import",
    label: "Data Import",
    icon: Download,
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
const InputField = ({ label, value, onChange, placeholder, type = "text", maxLength, required, error, helpText, icon: Icon }) => (
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
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border transition-colors ${
          error ? "border-red-500" : "border-[#333333] focus:border-[#3F74FF]"
        } ${Icon ? "pl-10" : ""}`}
      />
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

// Color Picker Component
const ColorPickerField = ({ label, value, onChange }) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-[#333333] p-1"
      />
    </div>
  </div>
)

// Time Picker Component
const TimePickerField = ({ label, value, onChange, placeholder = "HH:MM" }) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
    <input
      type="time"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-[#141414] text-white rounded-xl px-3 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
    />
  </div>
)

// Date Picker Component
const DatePickerField = ({ label, value, onChange }) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
    <input
      type="date"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="bg-[#141414] text-white rounded-xl px-3 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
    />
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

// Info Icon with Tooltip
const InfoTooltip = ({ content, position = "left" }) => (
  <Tooltip content={content} position={position}>
    <Info className="w-4 h-4 text-gray-500 hover:text-gray-300 cursor-help" />
  </Tooltip>
)

// ============================================
// Main Configuration Page Component
// ============================================
const ConfigurationPage = () => {
  // URL Search Params
  const [searchParams] = useSearchParams()
  
  // Navigation State
  const [activeCategory, setActiveCategory] = useState("profile")
  const [activeSection, setActiveSection] = useState("profile-details")
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileShowContent, setMobileShowContent] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState(["profile"])

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
  // All State Variables (preserved from original)
  // ============================================
  
  // Basic studio information
  const [studioName, setStudioName] = useState("FitnessPro Studio")
  const [studioId] = useState("STU-2024-001847") // Read-only studio ID
  const [studioOperator, setStudioOperator] = useState("Max Mustermann")
  const [studioOperatorEmail, setStudioOperatorEmail] = useState("operator@fitnesspro.de")
  const [studioOperatorPhone, setStudioOperatorPhone] = useState("+49 30 12345678")
  const [studioOperatorMobile, setStudioOperatorMobile] = useState("+49 170 1234567")
  const [studioStreet, setStudioStreet] = useState("Musterstraße 123")
  const [studioZipCode, setStudioZipCode] = useState("10115")
  const [studioCity, setStudioCity] = useState("Berlin")
  const [studioCountry, setStudioCountry] = useState("DE")
  const [studioPhoneNo, setStudioPhoneNo] = useState("+49 30 12345678")
  const [studioMobileNo, setStudioMobileNo] = useState("+49 170 1234567")
  const [studioEmail, setStudioEmail] = useState("info@fitnesspro.de")
  const [studioWebsite, setStudioWebsite] = useState("https://fitnesspro.de")
  const [currency, setCurrency] = useState("€")
  const [logo, setLogo] = useState([])
  const [logoUrl, setLogoUrl] = useState("")

  // Opening hours and closing days
  const [openingHours, setOpeningHours] = useState([])
  const [closingDays, setClosingDays] = useState([])
  const [publicHolidays, setPublicHolidays] = useState([])
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(false)

  // Staff & Roles
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: "Admin",
      permissions: PERMISSION_DATA.map(p => p.key),
      color: "#FF843E",
      isAdmin: true,
      staffCount: 1,
      assignedStaff: [1]
    },
    {
      id: 2,
      name: "Trainer",
      permissions: [
        "appointments.view",
        "appointments.create",
        "appointments.edit",
        "appointments.cancel",
        "communication.view",
        "chat.member_send",
        "members.view",
        "members.history_view",
        "notes.view",
        "notes.personal_create",
        "notes.studio_create",
        "training.view",
        "training_plans.create",
        "training_plans.assign",
        "profile.edit_own",
      ],
      color: "#10B981",
      isAdmin: false,
      staffCount: 0,
      assignedStaff: []
    },
    {
      id: 3,
      name: "Studio Operator",
      permissions: [
        "appointments.view",
        "appointments.create",
        "appointments.edit",
        "appointments.cancel",
        "appointments.manage_contingent",
        "communication.view",
        "emails.send",
        "chat.member_send",
        "chat.studio_send",
        "broadcasts.send",
        "activity_monitor.view",
        "activity_monitor.take_actions",
        "todos.view",
        "todos.create",
        "todos.edit",
        "notes.view",
        "notes.personal_create",
        "notes.studio_create",
        "members.view",
        "members.create",
        "members.edit",
        "members.history_view",
        "leads.view",
        "leads.create",
        "leads.edit",
        "contracts.view",
        "contracts.create",
        "selling.view",
        "products.manage",
        "profile.edit_own",
      ],
      color: "#3B82F6",
      isAdmin: false,
      staffCount: 0,
      assignedStaff: []
    }
  ])
  const [defaultVacationDays, setDefaultVacationDays] = useState(30)
  const [defaultStaffRole, setDefaultStaffRole] = useState(2)
  const [defaultStaffCountry, setDefaultStaffCountry] = useState("studio")
  const [permissionModalVisible, setPermissionModalVisible] = useState(false)
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(null)
  const [staffAssignmentModalVisible, setStaffAssignmentModalVisible] = useState(false)
  const [selectedRoleForAssignment, setSelectedRoleForAssignment] = useState(null)
  const [allStaff, setAllStaff] = useState([
    { id: 1, name: "John Doe", email: "john@studio.com", avatar: null },
    { id: 2, name: "Jane Smith", email: "jane@studio.com", avatar: null },
    { id: 3, name: "Mike Johnson", email: "mike@studio.com", avatar: null },
  ])

  // Appointments
  const [appointmentTypes, setAppointmentTypes] = useState([
    {
      id: 1,
      name: "EMS Strength",
      description: "High-intensity strength training with EMS technology",
      duration: 30,
      maxParallel: 2,
      slotsRequired: 1,
      color: "#FF843E",
      interval: 30,
      category: "Personal Training",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
      contingentUsage: 1,
    },
    {
      id: 2,
      name: "EMS Cardio",
      description: "Cardiovascular training enhanced with EMS",
      duration: 30,
      maxParallel: 2,
      slotsRequired: 1,
      color: "#10B981",
      interval: 30,
      category: "Personal Training",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
      contingentUsage: 1,
    },
    {
      id: 3,
      name: "EMP Chair",
      description: "Relaxing electromagnetic pulse therapy session",
      duration: 30,
      maxParallel: 1,
      slotsRequired: 0,
      color: "#8B5CF6",
      interval: 30,
      category: "Wellness",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
      contingentUsage: 0,
    },
    {
      id: 4,
      name: "Body Check",
      description: "Comprehensive body analysis and measurements",
      duration: 30,
      maxParallel: 1,
      slotsRequired: 2,
      color: "#3B82F6",
      interval: 30,
      category: "Health Check",
      image: null,
      contingentUsage: 1,
    },
  ])
  const [appointmentCategories, setAppointmentCategories] = useState([
    "Health Check", "Personal Training", "Wellness", "Recovery", "Mindfulness", "Group Class"
  ])
  const [studioCapacity, setStudioCapacity] = useState(3)
  const [trialTraining, setTrialTraining] = useState({
    name: "Trial Training",
    duration: 60,
    maxParallel: 1,
    slotsRequired: 3,
    color: "#3B82F6",
  })
  const [editingCategory, setEditingCategory] = useState({ index: null, value: "" })
  
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
  const [leadSources, setLeadSources] = useState([
    { id: 1, name: "Website", color: "#3B82F6" },
    { id: 2, name: "Referral", color: "#10B981" },
  ])
  const [introductoryMaterials, setIntroductoryMaterials] = useState([
    {
      id: 1,
      name: "Welcome Guide",
      pages: [{ id: 1, title: "Welcome", content: "<p>Welcome to our studio!</p>", elements: [] }]
    }
  ])
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
  const [allowMemberSelfCancellation, setAllowMemberSelfCancellation] = useState(true)
  const [noticePeriod, setNoticePeriod] = useState(30)
  const [extensionPeriod, setExtensionPeriod] = useState(12)
  const [defaultBillingPeriod, setDefaultBillingPeriod] = useState("monthly")
  const [defaultAutoRenewal, setDefaultAutoRenewal] = useState(true)
  const [defaultRenewalIndefinite, setDefaultRenewalIndefinite] = useState(true)
  const [defaultRenewalPeriod, setDefaultRenewalPeriod] = useState(1)
  const [defaultAppointmentLimit, setDefaultAppointmentLimit] = useState(8)
  const [contractTypes, setContractTypes] = useState([
    {
      id: 1,
      name: "Basic Monthly",
      description: "Entry-level membership with essential features",
      duration: 12,
      cost: 79,
      billingPeriod: "monthly",
      userCapacity: 4,
      autoRenewal: true,
      renewalIndefinite: true,
      renewalPeriod: null,
      renewalPrice: 79,
      cancellationPeriod: 30,
      contractFormId: 1,
    },
    {
      id: 2,
      name: "Standard Monthly",
      description: "Our most popular membership option",
      duration: 12,
      cost: 99,
      billingPeriod: "monthly",
      userCapacity: 8,
      autoRenewal: true,
      renewalIndefinite: true,
      renewalPeriod: null,
      renewalPrice: 99,
      cancellationPeriod: 30,
      contractFormId: 1,
    },
    {
      id: 3,
      name: "Premium Unlimited",
      description: "Full access with unlimited training sessions",
      duration: 12,
      cost: 149,
      billingPeriod: "monthly",
      userCapacity: 0,
      autoRenewal: true,
      renewalIndefinite: true,
      renewalPeriod: null,
      renewalPrice: 149,
      cancellationPeriod: 30,
      contractFormId: 2,
    },
    {
      id: 4,
      name: "Flex 10er Card",
      description: "10 training credits, use anytime within 6 months",
      duration: 6,
      cost: 199,
      billingPeriod: "monthly",
      userCapacity: 10,
      autoRenewal: false,
      renewalIndefinite: false,
      renewalPeriod: null,
      renewalPrice: 0,
      cancellationPeriod: 0,
      contractFormId: 1,
    },
    {
      id: 5,
      name: "Annual Premium",
      description: "Best value - pay annually, save 2 months",
      duration: 12,
      cost: 1490,
      billingPeriod: "annually",
      userCapacity: 0,
      autoRenewal: true,
      renewalIndefinite: false,
      renewalPeriod: 12,
      renewalPrice: 1490,
      cancellationPeriod: 60,
      contractFormId: 2,
    },
    {
      id: 6,
      name: "Trial Week",
      description: "7-day trial membership to experience our studio",
      duration: 1,
      cost: 29,
      billingPeriod: "weekly",
      userCapacity: 3,
      autoRenewal: false,
      renewalIndefinite: false,
      renewalPeriod: null,
      renewalPrice: 0,
      cancellationPeriod: 0,
      contractFormId: 3,
    },
  ])
  const [contractForms, setContractForms] = useState([
    {
      id: 1,
      name: "Standard Membership Agreement",
      pages: [
        {
          id: 1,
          title: "Terms & Conditions",
          elements: [
            { id: 1, type: "heading", content: "Membership Agreement" },
            { id: 2, type: "paragraph", content: "This agreement is entered into between {Studio_Name} and the member." },
          ]
        }
      ],
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: 2,
      name: "Premium Membership Contract",
      pages: [
        {
          id: 1,
          title: "Premium Terms",
          elements: [
            { id: 1, type: "heading", content: "Premium Membership Agreement" },
            { id: 2, type: "paragraph", content: "Welcome to our Premium Membership program." },
          ]
        },
        {
          id: 2,
          title: "Signatures",
          elements: [
            { id: 1, type: "field", fieldType: "signature", label: "Member Signature", required: true },
          ]
        }
      ],
      createdAt: "2024-02-01T14:30:00Z",
    },
    {
      id: 3,
      name: "Trial Membership Form",
      pages: [
        {
          id: 1,
          title: "Trial Agreement",
          elements: [
            { id: 1, type: "heading", content: "Trial Membership" },
            { id: 2, type: "paragraph", content: "This trial membership allows you to experience our studio for a limited time." },
          ]
        }
      ],
      createdAt: "2024-03-01T08:00:00Z",
    },
  ])
  const [selectedContractForm, setSelectedContractForm] = useState(null)
  const [contractBuilderModalVisible, setContractBuilderModalVisible] = useState(false)
  const [newContractFormName, setNewContractFormName] = useState("")
  const [showCreateFormModal, setShowCreateFormModal] = useState(false)
  const [contractPauseReasons, setContractPauseReasons] = useState([
    { id: 1, name: "Vacation", maxDays: 30, requiresProof: false },
    { id: 2, name: "Medical / Illness", maxDays: 90, requiresProof: true },
    { id: 3, name: "Injury / Rehabilitation", maxDays: 120, requiresProof: true },
    { id: 4, name: "Pregnancy", maxDays: 180, requiresProof: true },
    { id: 5, name: "Parental Leave", maxDays: 365, requiresProof: true },
    { id: 6, name: "Work Relocation", maxDays: 90, requiresProof: true },
    { id: 7, name: "Military / Civil Service", maxDays: 365, requiresProof: true },
    { id: 8, name: "Personal Reasons", maxDays: 30, requiresProof: false },
  ])

  // Communication Settings
  const [settings, setSettings] = useState({
    autoArchiveDuration: 30,
    // Birthday notification
    birthdayNotificationEnabled: true,
    birthdaySendEmail: true,
    birthdaySendApp: true,
    birthdaySubject: "🎂 Happy Birthday, {Member_First_Name}!",
    birthdayTemplate: "<p>Dear {Member_First_Name},</p><p>The entire team at <strong>{Studio_Name}</strong> wishes you a wonderful birthday! 🎉</p><p>As a special gift, enjoy a <strong>free training session</strong> this week.</p><p>We look forward to seeing you!</p>",
    birthdaySendTime: "09:00",
    // SMTP
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "noreply@fitnesspro.de",
    smtpPass: "",
    smtpSecure: true,
    smtpFromEmail: "noreply@fitnesspro.de",
    senderName: "FitnessPro Studio",
    // Email signature
    emailSignature: "<p>Best regards,<br><strong>FitnessPro Studio Team</strong></p><p>📞 +49 30 12345678<br>📧 info@fitnesspro.de<br>🌐 www.fitnesspro.de</p><p style=\"color: #666; font-size: 12px;\">Musterstraße 123, 10115 Berlin</p>",
    // E-Invoice
    einvoiceSubject: "Invoice {Invoice_Number} - {Selling_Date}",
    einvoiceTemplate: "<p>Dear {Member_First_Name} {Member_Last_Name},</p><p>Please find attached your invoice <strong>#{Invoice_Number}</strong> dated {Selling_Date}.</p><p><strong>Total Amount: {Total_Amount}</strong></p><p>Thank you for your continued membership!</p>",
  })

  const [appointmentNotificationTypes, setAppointmentNotificationTypes] = useState({
    confirmation: { enabled: true, subject: "✅ Appointment Confirmed - {Appointment_Type}", template: "<p>Dear {Member_First_Name},</p><p>Your appointment has been confirmed:</p><p><strong>{Appointment_Type}</strong><br>📅 {Booked_Date}<br>🕐 {Booked_Time}</p><p>We look forward to seeing you!</p>", sendApp: true, sendEmail: true, hoursBefore: 24 },
    cancellation: { enabled: true, subject: "❌ Appointment Cancelled - {Appointment_Type}", template: "<p>Dear {Member_First_Name},</p><p>Your appointment has been cancelled:</p><p><strong>{Appointment_Type}</strong><br>📅 {Booked_Date}<br>🕐 {Booked_Time}</p><p>Please book a new appointment if needed.</p>", sendApp: true, sendEmail: true, hoursBefore: 24 },
    rescheduled: { enabled: true, subject: "🔄 Appointment Rescheduled - {Appointment_Type}", template: "<p>Dear {Member_First_Name},</p><p>Your appointment has been rescheduled to:</p><p><strong>{Appointment_Type}</strong><br>📅 {Booked_Date}<br>🕐 {Booked_Time}</p>", sendApp: true, sendEmail: true, hoursBefore: 24 },
    reminder: { enabled: true, subject: "⏰ Reminder: {Appointment_Type} tomorrow", template: "<p>Dear {Member_First_Name},</p><p>This is a reminder for your upcoming appointment:</p><p><strong>{Appointment_Type}</strong><br>📅 {Booked_Date}<br>🕐 {Booked_Time}</p><p>See you soon!</p>", sendApp: true, sendEmail: true, hoursBefore: 24 },
    registration: { enabled: true, subject: "🎉 Welcome to {Studio_Name}!", template: "<p>Dear {Member_First_Name} {Member_Last_Name},</p><p>Welcome to <strong>{Studio_Name}</strong>! We're excited to have you as a member.</p><p>Click the link below to complete your registration:</p><p>{Registration_Link}</p><p>If you have any questions, feel free to contact us.</p>", sendApp: false, sendEmail: true },
  })

  // Finances
  const [vatRates, setVatRates] = useState([
    { name: "Standard", percentage: 19, description: "Standard VAT rate" },
    { name: "Reduced", percentage: 7, description: "Reduced VAT rate" },
  ])
  const [vatNumber, setVatNumber] = useState("DE123456789")
  const [bankName, setBankName] = useState("Deutsche Bank")
  const [creditorId, setCreditorId] = useState("DE98ZZZ09999999999")
  const [creditorName, setCreditorName] = useState("FitnessPro GmbH")
  const [iban, setIban] = useState("DE89 3704 0044 0532 0130 00")
  const [bic, setBic] = useState("COBADEFFXXX")

  // Appearance
  const [appearance, setAppearance] = useState({
    theme: "dark",
    primaryColor: "#FF843E",
    secondaryColor: "#1890ff",
    allowStaffThemeToggle: true,
    allowMemberThemeToggle: true
  })

  // Countries
  const [countries, setCountries] = useState([
    { code: "AT", name: "Austria", currency: "€" },
    { code: "BE", name: "Belgium", currency: "€" },
    { code: "CA", name: "Canada", currency: "$" },
    { code: "DE", name: "Germany", currency: "€" },
    { code: "FR", name: "France", currency: "€" },
    { code: "GB", name: "United Kingdom", currency: "£" },
    { code: "US", name: "United States", currency: "$" },
  ])

  // Refs for textareas (for variable insertion)
  const birthdayTextareaRef = useRef(null)
  const confirmationTextareaRef = useRef(null)
  const cancellationTextareaRef = useRef(null)
  const rescheduledTextareaRef = useRef(null)
  const reminderTextareaRef = useRef(null)
  const registrationTextareaRef = useRef(null)
  const qrCodeRef = useRef(null)

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

  // Initialize opening hours
  useEffect(() => {
    if (openingHours.length === 0) {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      const defaultHours = days.map(day => ({
        day,
        startTime: day === 'Sunday' ? null : '09:00',
        endTime: day === 'Sunday' ? null : '21:00',
        closed: day === 'Sunday'
      }))
      setOpeningHours(defaultHours)
    }
  }, [])

  // Fetch countries on mount
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
          <span key={i} className="bg-orange-500/30 text-orange-300 rounded px-0.5">{part}</span>
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
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#141414] flex-shrink-0">
                  <img src={profilePreviewUrl || DefaultAvatar} alt="Profile Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-white font-medium mb-2">Profile Picture</h3>
                  <p className="text-xs sm:text-sm text-gray-400 mb-4">Upload your profile picture</p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <label className="px-4 py-2 bg-[#3F74FF] text-white text-sm rounded-xl hover:bg-blue-600 cursor-pointer transition-colors">
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
              <h3 className="text-white font-medium mb-4">Personal Information</h3>
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
                    <label className="text-sm font-medium text-gray-300">Birthday</label>
                    <input
                      type="date"
                      value={profileData.birthday}
                      onChange={(e) => handleProfileInputChange("birthday", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#141414] border border-[#333333] outline-none text-sm text-white focus:border-[#3F74FF]"
                    />
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
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={profileData.password}
                      onChange={(e) => handleProfileInputChange("password", e.target.value)}
                      className="w-full px-4 py-2.5 pr-12 rounded-xl bg-[#141414] border border-[#333333] outline-none text-sm text-white focus:border-[#3F74FF]"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </SettingsCard>

            <SettingsCard>
              <div className="max-w-md space-y-4">
                <h3 className="text-white font-medium">Security</h3>
                <p className="text-sm text-gray-400">
                  For your security, we recommend changing your password regularly and using a strong, unique password.
                </p>
                <button className="px-4 py-2 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F] transition-colors">
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
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#141414] flex-shrink-0">
                  <img src={logoUrl || DefaultAvatar} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-white font-medium mb-2">Studio Logo</h3>
                  <p className="text-xs sm:text-sm text-gray-400 mb-4">Upload your studio logo (recommended: 1000x1000px)</p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <label className="px-4 py-2 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F] cursor-pointer transition-colors">
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
              <h3 className="text-white font-medium mb-4">Studio Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Studio ID</label>
                  <input
                    type="text"
                    value={studioId}
                    disabled
                    className="w-full bg-[#0a0a0a] text-gray-500 rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] cursor-not-allowed"
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
              <h3 className="text-white font-medium mb-4">Studio Address</h3>
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
              <h3 className="text-white font-medium mb-4">Studio Operator</h3>
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
                    <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-[#141414] rounded-xl">
                      <div className="flex items-center justify-between sm:w-32">
                        <span className="text-white font-medium text-sm sm:text-base">{day}</span>
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
                            !isClosed ? "bg-orange-500" : "bg-[#333333]"
                          }`}
                        >
                          <span
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${
                              !isClosed ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span className="text-sm text-gray-400 w-12">{isClosed ? "Closed" : "Open"}</span>
                        
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
                              className="bg-[#1F1F1F] text-white rounded-lg px-2 sm:px-3 py-2 text-sm border border-[#333333] flex-1 sm:flex-none"
                            />
                            <span className="text-gray-400 text-sm">to</span>
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
                              className="bg-[#1F1F1F] text-white rounded-lg px-2 sm:px-3 py-2 text-sm border border-[#333333] flex-1 sm:flex-none"
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
                      className="px-3 sm:px-4 py-2 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F] transition-colors flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Import Holidays
                    </button>
                  )}
                  <button
                    onClick={() => setClosingDays([...closingDays, { date: "", description: "" }])}
                    className="px-3 sm:px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Day
                  </button>
                </div>
              }
            />
            
            {studioCountry && publicHolidays.length > 0 && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-blue-400 text-sm">
                  <Info className="w-4 h-4 inline-block mr-2" />
                  {publicHolidays.length} public holidays available for {countries.find(c => c.code === studioCountry)?.name}
                </p>
              </div>
            )}

            <SettingsCard>
              {closingDays.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <CalendarOff className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No closing days configured</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {closingDays.map((day, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-3 p-3 bg-[#141414] rounded-xl">
                      <input
                        type="date"
                        value={day.date || ""}
                        onChange={(e) => {
                          const updated = [...closingDays]
                          updated[index].date = e.target.value
                          setClosingDays(updated)
                        }}
                        className="bg-[#1F1F1F] text-white rounded-lg px-3 py-2 text-sm border border-[#333333] w-full sm:w-40"
                      />
                      <input
                        type="text"
                        value={day.description || ""}
                        onChange={(e) => {
                          const updated = [...closingDays]
                          updated[index].description = e.target.value
                          setClosingDays(updated)
                        }}
                        placeholder="Description (e.g., Public Holiday)"
                        className="bg-[#1F1F1F] text-white rounded-lg px-3 py-2 text-sm border border-[#333333] flex-1"
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
      case "capacity":
        return (
          <div className="space-y-6">
            <SectionHeader title="Capacity Settings" description="Control how many appointments can run simultaneously" />
            
            <SettingsCard>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Total Studio Capacity</label>
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
                      className="w-24 bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                    />
                    <span className="text-sm text-gray-400">slots</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    The maximum number of slots that can be used at the same time across all appointments.
                  </p>
                </div>
              </div>
            </SettingsCard>

            <SettingsCard className="bg-[#181818]">
              <h4 className="text-white font-medium mb-3">How Capacity Works</h4>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex gap-3">
                  <span className="text-orange-400 font-medium w-32 flex-shrink-0">Slots Required</span>
                  <span>How many capacity slots each appointment uses. Set to 0 if the appointment doesn't block any capacity.</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-orange-400 font-medium w-32 flex-shrink-0">Max Parallel</span>
                  <span>The maximum number of this appointment type that can run at the same time.</span>
                </div>
              </div>
              <div className="mt-4 p-4 bg-[#141414] rounded-xl">
                <p className="text-sm text-gray-300 font-medium mb-2">Example with 3 total slots:</p>
                <div className="space-y-1.5 text-xs text-gray-500">
                  <p>• <span className="text-gray-300">EMS Strength</span> (1 slot, max 2×) – Can run twice in parallel, uses 2 slots total</p>
                  <p>• <span className="text-gray-300">Body Check</span> (2 slots, max 1×) – Uses 2 slots, only 1 slot left for other appointments</p>
                  <p>• <span className="text-gray-300">Trial Training</span> (3 slots, max 1×) – Uses all capacity, blocks all other bookings</p>
                  <p>• <span className="text-gray-300">EMP Chair</span> (0 slots, max 1×) – Doesn't use any capacity, runs independently</p>
                </div>
              </div>
            </SettingsCard>

            {appointmentTypes.length > 0 && (
              <SettingsCard>
                <h4 className="text-white font-medium mb-4">Current Configuration</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-3 py-2 text-xs text-gray-500 border-b border-[#333333]">
                    <span>Appointment Type</span>
                    <div className="flex items-center gap-8">
                      <span className="w-20 text-center">Slots</span>
                      <span className="w-20 text-center">Max Parallel</span>
                    </div>
                  </div>
                  {appointmentTypes.map((type) => (
                    <div key={type.id} className="flex items-center justify-between p-3 bg-[#141414] rounded-xl">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: type.color }}
                        />
                        <span className="text-white">{type.name}</span>
                      </div>
                      <div className="flex items-center gap-8 text-sm">
                        <span className="w-20 text-center text-gray-400">{type.slotsRequired ?? 1}</span>
                        <span className="w-20 text-center text-gray-400">{type.maxParallel || 1}×</span>
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
                  className="px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Type
                </button>
              }
            />
            
            {appointmentTypes.length === 0 ? (
              <SettingsCard>
                <div className="text-center py-12 text-gray-400">
                  <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-white mb-2">No appointment types yet</h3>
                  <p className="text-sm mb-6">Create your first appointment type that members can book</p>
                  <button
                    onClick={() => handleOpenAppointmentTypeModal(null)}
                    className="px-6 py-2.5 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
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
                    className="bg-[#1F1F1F] rounded-xl overflow-hidden border border-[#333333] hover:border-[#444444] transition-colors group"
                  >
                    {/* Image */}
                    <div className="relative aspect-video bg-[#141414]">
                      {type.image ? (
                        <img
                          src={type.image}
                          alt={type.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Calendar className="w-12 h-12 text-gray-600" />
                        </div>
                      )}
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Category badge - blue like member view */}
                      {type.category && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                          {type.category}
                        </div>
                      )}
                      
                      {/* Info button with popup - shows on hover and click */}
                      {type.description && (
                        <div className="absolute top-3 right-3 group/info">
                          <button
                            className="flex items-center justify-center bg-orange-500 w-7 h-7 rounded-full hover:bg-orange-600 transition-colors"
                          >
                            <Info className="w-4 h-4 text-white" />
                          </button>
                          {/* Popup - shows on hover or focus */}
                          <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-[#1F1F1F] border border-[#333333] rounded-xl shadow-xl opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible group-focus-within/info:opacity-100 group-focus-within/info:visible transition-all z-50">
                            <p className="text-gray-300 text-sm">{type.description}</p>
                            <div className="absolute -top-2 right-3 w-3 h-3 bg-[#1F1F1F] border-l border-t border-[#333333] rotate-45" />
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
                        <h3 className="text-white font-medium truncate">{type.name || "Untitled"}</h3>
                      </div>
                      
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-4">
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
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenAppointmentTypeModal(type)}
                          className="flex-1 px-3 py-2 bg-[#2F2F2F] text-white text-sm rounded-lg hover:bg-[#3F3F3F] transition-colors flex items-center justify-center gap-2"
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
                  className="px-3 sm:px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2"
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
                          className="bg-[#141414] text-white rounded-lg px-3 py-1.5 text-sm border border-[#3F74FF] w-32"
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
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm cursor-pointer hover:bg-blue-500/30 transition-colors"
                        onClick={() => setEditingCategory({ index, value: category })}
                      >
                        {category}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveCategory(index)
                          }}
                          className="ml-1 p-0.5 text-blue-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">
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
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    Duration
                    <Tooltip content="How long the trial training session lasts in minutes">
                      <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
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
                      className="w-24 bg-[#141414] text-white rounded-xl px-3 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                    />
                    <span className="text-sm text-gray-400">min</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-gray-500" />
                    Slots
                    <Tooltip content="How many capacity slots the trial training uses. Set to max to block all other bookings.">
                      <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
                    </Tooltip>
                  </label>
                  <input
                    type="number"
                    value={trialTraining.slotsRequired}
                    onChange={(e) => setTrialTraining({ ...trialTraining, slotsRequired: Math.floor(Number(e.target.value)) })}
                    onKeyDown={(e) => { if (e.key === '.' || e.key === ',') e.preventDefault() }}
                    min={0}
                    max={studioCapacity}
                    className="w-24 bg-[#141414] text-white rounded-xl px-3 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    Max Parallel
                    <Tooltip content="Maximum number of trial trainings that can run at the same time">
                      <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
                    </Tooltip>
                  </label>
                  <input
                    type="number"
                    value={trialTraining.maxParallel}
                    onChange={(e) => setTrialTraining({ ...trialTraining, maxParallel: Math.floor(Number(e.target.value)) })}
                    onKeyDown={(e) => { if (e.key === '.' || e.key === ',') e.preventDefault() }}
                    min={1}
                    max={studioCapacity}
                    className="w-24 bg-[#141414] text-white rounded-xl px-3 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    Calendar Color
                    <Tooltip content="The color used to display trial trainings in the calendar" position="right">
                      <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
                    </Tooltip>
                  </label>
                  <input
                    type="color"
                    value={trialTraining.color}
                    onChange={(e) => setTrialTraining({ ...trialTraining, color: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-[#333333] p-1"
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
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-300">
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
                  className="px-3 sm:px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2"
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
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-[#333333] p-1 flex-shrink-0"
                    />
                    
                    {/* Role Name */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={role.name}
                          onChange={(e) => handleUpdateRole(index, "name", e.target.value)}
                          placeholder="Enter role name"
                          className="w-full bg-transparent text-white text-lg font-medium outline-none border-b border-transparent hover:border-[#333333] focus:border-orange-500 transition-colors pb-1"
                        />
                        {role.isAdmin && (
                          <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded flex-shrink-0">Admin</span>
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
                        className="px-3 py-2 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F] transition-colors flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        <span className="hidden sm:inline">Permissions</span>
                        <span className="bg-[#444444] px-1.5 py-0.5 rounded text-xs">{role.permissions?.length || 0}</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRoleForAssignment(index)
                          setStaffAssignmentModalVisible(true)
                        }}
                        className="px-3 py-2 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F] transition-colors flex items-center gap-2"
                      >
                        <Users className="w-4 h-4" />
                        <span className="hidden sm:inline">Staff</span>
                        <span className="bg-[#444444] px-1.5 py-0.5 rounded text-xs">{role.staffCount || 0}</span>
                      </button>
                      <button
                        onClick={() => handleCopyRole(index)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded-lg transition-colors"
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
                  <h3 className="text-white font-medium">{studioName || "Studio"}</h3>
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
                  <p className="text-sm text-gray-400 text-center">
                    Scan to check in
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button 
                      onClick={handleDownloadQRCode}
                      className="px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button 
                      onClick={handlePrintQRCode}
                      className="px-4 py-2 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F] transition-colors flex items-center justify-center gap-2"
                    >
                      <Printer className="w-4 h-4" />
                      Print
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-2">
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
                  className="px-3 sm:px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span> Source
                </button>
              }
            />
            <SettingsCard>
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
                        className="w-8 h-8 rounded cursor-pointer flex-shrink-0"
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
                  className="px-3 sm:px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span> Material
                </button>
              }
            />
            
            {introductoryMaterials.length === 0 ? (
              <SettingsCard>
                <div className="text-center py-8 text-gray-400">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No introductory materials created</p>
                  <p className="text-sm mt-1">Create welcome guides for new members</p>
                </div>
              </SettingsCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {introductoryMaterials.map((material, index) => (
                  <SettingsCard key={material.id}>
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium truncate">
                            {material.name || "Untitled Material"}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
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
                      
                      {/* Page previews */}
                      <div className="flex gap-1 overflow-x-auto pb-1">
                        {material.pages.slice(0, 5).map((page, pageIndex) => (
                          <div 
                            key={page.id} 
                            className="w-12 h-16 bg-[#141414] border border-[#333333] rounded flex-shrink-0 flex items-center justify-center text-xs text-gray-500"
                          >
                            {pageIndex + 1}
                          </div>
                        ))}
                        {material.pages.length > 5 && (
                          <div className="w-12 h-16 bg-[#141414] border border-[#333333] rounded flex-shrink-0 flex items-center justify-center text-xs text-gray-500">
                            +{material.pages.length - 5}
                          </div>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => {
                          // Deep copy the material including pages
                          const deepCopy = {
                            ...material,
                            pages: material.pages.map(p => ({ ...p }))
                          }
                          setEditingIntroMaterial(deepCopy)
                          setEditingIntroMaterialIndex(index)
                          setIntroMaterialEditorVisible(true)
                        }}
                        className="w-full px-4 py-2 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F] transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Content
                      </button>
                    </div>
                  </SettingsCard>
                ))}
              </div>
            )}

            {/* Delete Confirmation Dialog */}
            {deletingIntroMaterialIndex !== null && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
                <div className="bg-[#1C1C1C] rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-[#333333]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-500/20 rounded-xl">
                      <Trash2 className="w-6 h-6 text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Delete Material</h3>
                  </div>
                  <p className="text-gray-400 mb-2">
                    Are you sure you want to delete <span className="text-white font-medium">&quot;{introductoryMaterials[deletingIntroMaterialIndex]?.name || "Untitled Material"}&quot;</span>?
                  </p>
                  <p className="text-gray-500 text-sm mb-6">
                    This will permanently delete all {introductoryMaterials[deletingIntroMaterialIndex]?.pages?.length || 0} page(s). This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setDeletingIntroMaterialIndex(null)}
                      className="flex-1 px-4 py-2.5 bg-[#2F2F2F] text-white text-sm font-medium rounded-xl hover:bg-[#3F3F3F] transition-colors"
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
                <h3 className="text-white font-medium">Member Permissions</h3>
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
                  <h3 className="text-white font-medium mb-1">Contract Defaults</h3>
                  <p className="text-xs text-gray-500">Applied when creating new contract types</p>
                </div>
                
                {/* Info Box */}
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-300">
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
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    Default Contingent
                    <Tooltip content="The number of appointment credits members receive per billing period. Each appointment type can deduct a different amount from this contingent. Set to 0 for unlimited.">
                      <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
                    </Tooltip>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={defaultAppointmentLimit}
                      onChange={(e) => setDefaultAppointmentLimit(Number(e.target.value))}
                      min={0}
                      placeholder="0 = Unlimited"
                      className="w-32 bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                    />
                    <span className="text-gray-400 text-sm">credits per billing period</span>
                  </div>
                  <p className="text-xs text-gray-500">0 = Unlimited contingent</p>
                </div>
              </div>
            </SettingsCard>

            {/* Renewal Defaults */}
            <SettingsCard>
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-medium mb-1">Renewal Defaults</h3>
                  <p className="text-xs text-gray-500">Settings for contract renewal after minimum duration</p>
                </div>
                
                <Toggle
                  label="Enable Automatic Renewal by Default"
                  checked={defaultAutoRenewal}
                  onChange={setDefaultAutoRenewal}
                  helpText="New contracts will have automatic renewal enabled"
                />
                
                <div className="pt-4 border-t border-[#333333] space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      Default Renewal Duration
                      <Tooltip content="How long contracts continue after the minimum duration. Choose 'Indefinite' for open-ended contracts that run until cancelled.">
                        <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
                      </Tooltip>
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      <select
                        value={defaultRenewalIndefinite ? "indefinite" : "fixed"}
                        onChange={(e) => setDefaultRenewalIndefinite(e.target.value === "indefinite")}
                        className="bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
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
                            className="w-20 bg-[#141414] text-white rounded-xl px-3 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                          />
                          <span className="text-gray-400">months</span>
                        </div>
                      )}
                    </div>
                    {defaultRenewalIndefinite && (
                      <p className="text-xs text-gray-500 mt-1">Contracts will run indefinitely until cancelled</p>
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
                  className="px-3 sm:px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Create</span> Form
                </button>
              }
            />
            
            {contractForms.length === 0 ? (
              <SettingsCard>
                <div className="text-center py-12 text-gray-400">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-white mb-2">No contract forms yet</h3>
                  <p className="text-sm mb-6">Create your first contract form template</p>
                  <button
                    onClick={() => setShowCreateFormModal(true)}
                    className="px-6 py-2.5 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Contract Form
                  </button>
                </div>
              </SettingsCard>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {contractForms.map((form) => (
                  <SettingsCard key={form.id}>
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
                              className="flex-1 bg-[#141414] text-white text-sm font-medium outline-none border border-[#3F74FF] focus:border-orange-500 rounded-lg px-2 py-1"
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
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded transition-colors"
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
                      <div className="text-xs text-gray-500">
                        Created: {new Date(form.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {form.pages?.length || 1} page{(form.pages?.length || 1) !== 1 ? "s" : ""}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedContractForm(form)
                          setContractBuilderModalVisible(true)
                        }}
                        className="w-full px-3 py-2 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F] transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Open Builder
                      </button>
                    </div>
                  </SettingsCard>
                ))}
              </div>
            )}

            {/* Delete Contract Form Confirmation */}
            {deletingContractFormId !== null && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
                <div className="bg-[#1C1C1C] rounded-2xl p-6 w-full max-w-md shadow-2xl border border-[#333333]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-500/20 rounded-xl">
                      <Trash2 className="w-6 h-6 text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Delete Contract Form</h3>
                  </div>
                  <p className="text-gray-400 mb-2">
                    Are you sure you want to delete <span className="text-white font-medium">&quot;{contractForms.find(f => f.id === deletingContractFormId)?.name || "this form"}&quot;</span>?
                  </p>
                  <p className="text-sm text-red-400/80 mb-6">
                    This will permanently delete all pages and content. This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setDeletingContractFormId(null)}
                      className="flex-1 px-4 py-2.5 bg-[#2F2F2F] text-white text-sm font-medium rounded-xl hover:bg-[#3F3F3F] transition-colors"
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
                  className="px-3 sm:px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span> Type
                </button>
              }
            />
            
            {contractTypes.length === 0 ? (
              <SettingsCard>
                <div className="text-center py-12 text-gray-400">
                  <RiContractLine className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-white mb-2">No contract types yet</h3>
                  <p className="text-sm mb-6">Create your first membership contract type</p>
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
              <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {contractTypes.map((type, index) => (
                  <div
                    key={index}
                    className="bg-[#1F1F1F] rounded-xl overflow-hidden border border-[#333333] hover:border-[#444444] transition-colors group"
                  >
                    {/* Header */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="text-white font-medium truncate">{type.name || "Untitled"}</h3>
                        {type.autoRenewal && (
                          <span className="px-2.5 py-1 bg-blue-500/90 text-white text-xs font-medium rounded-full flex-shrink-0">
                            Auto-Renew
                          </span>
                        )}
                      </div>
                      
                      {/* Price highlight */}
                      <div className="mb-4">
                        <span className="text-2xl font-bold text-white">{type.cost}{currency}</span>
                        <span className="text-gray-500 text-sm">/{type.billingPeriod === 'monthly' ? 'month' : type.billingPeriod === 'weekly' ? 'week' : 'year'}</span>
                      </div>
                      
                      {/* Key info */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between text-gray-400">
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Duration
                          </span>
                          <span className="text-white">{type.duration} months</span>
                        </div>
                        <div className="flex items-center justify-between text-gray-400">
                          <span className="flex items-center gap-2">
                            <BadgeDollarSign className="w-4 h-4" />
                            Contingent
                          </span>
                          <span className="text-white">{type.userCapacity || '∞'} credits / {type.billingPeriod === 'monthly' ? 'month' : type.billingPeriod === 'weekly' ? 'week' : 'year'}</span>
                        </div>
                        <div className="flex items-center justify-between text-gray-400">
                          <span className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Form
                          </span>
                          <span className="text-white truncate max-w-[120px]">
                            {type.contractFormId ? contractForms.find(f => String(f.id) === String(type.contractFormId))?.name || 'Unknown' : 'None'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="px-4 py-3 bg-[#141414] border-t border-[#333333] flex gap-2">
                      <button
                        onClick={() => handleEditContractType(type, index)}
                        className="flex-1 px-3 py-2 bg-[#2F2F2F] text-white text-sm rounded-lg hover:bg-[#3F3F3F] transition-colors flex items-center justify-center gap-2"
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
                <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl border border-[#333333] flex flex-col">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-4 border-b border-[#333333] flex-shrink-0">
                    <h3 className="text-lg font-semibold text-white">
                      {editingContractTypeIndex !== null ? 'Edit Contract Type' : 'New Contract Type'}
                    </h3>
                    <button
                      onClick={() => {
                        setContractTypeModalVisible(false)
                        setEditingContractType(null)
                        setEditingContractTypeIndex(null)
                      }}
                      className="p-2 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Modal Content */}
                  <div className="p-4 overflow-y-auto overflow-x-hidden flex-1 space-y-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        Contract Name
                        <span className="text-red-400">*</span>
                        <Tooltip content="The name of this contract type that members will see when signing up">
                          <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
                        </Tooltip>
                      </label>
                      <input
                        type="text"
                        value={editingContractType.name}
                        onChange={(e) => setEditingContractType({ ...editingContractType, name: e.target.value })}
                        placeholder="e.g., Premium Membership"
                        className="w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                      />
                    </div>
                    
                    {/* Price & Duration */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          Cost
                          <span className="text-red-400">*</span>
                          <Tooltip content="The price charged to the member per billing period (weekly, monthly, or annually)">
                            <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
                          </Tooltip>
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editingContractType.cost}
                            onChange={(e) => setEditingContractType({ ...editingContractType, cost: Number(e.target.value) })}
                            min={0}
                            className="flex-1 min-w-0 bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                          />
                          <span className="text-gray-400 flex-shrink-0">{currency}</span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          Minimum Duration
                          <span className="text-red-400">*</span>
                          <Tooltip content="The minimum commitment period. After this period, the contract can be renewed or terminated." position="right">
                            <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
                          </Tooltip>
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editingContractType.duration}
                            onChange={(e) => setEditingContractType({ ...editingContractType, duration: Number(e.target.value) })}
                            min={1}
                            max={60}
                            className="flex-1 min-w-0 bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                          />
                          <span className="text-gray-400 flex-shrink-0">months</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Billing & Contingent */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          Billing Period
                          <span className="text-red-400">*</span>
                          <Tooltip content="How often the member is charged. The cost above is charged once per billing period.">
                            <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
                          </Tooltip>
                        </label>
                        <select
                          value={editingContractType.billingPeriod}
                          onChange={(e) => setEditingContractType({ ...editingContractType, billingPeriod: e.target.value })}
                          className="w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                        >
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="annually">Annually</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          Contingent
                          <span className="text-red-400">*</span>
                          <Tooltip content="The number of appointment credits members receive per billing period. Each appointment type deducts from this contingent based on its 'Contingent Usage' setting. Set to 0 for unlimited." position="right">
                            <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
                          </Tooltip>
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editingContractType.userCapacity}
                            onChange={(e) => setEditingContractType({ ...editingContractType, userCapacity: Number(e.target.value) })}
                            min={0}
                            placeholder="0 = Unlimited"
                            className="flex-1 min-w-0 bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                          />
                          <span className="text-gray-400 flex-shrink-0">credits</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Contract Form */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        Contract Form
                        <span className="text-red-400">*</span>
                        <Tooltip content="The document template used when a member signs this contract. Create forms in the 'Contract Forms' section.">
                          <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
                        </Tooltip>
                      </label>
                      {contractForms.length === 0 ? (
                        <div className="p-3 bg-[#141414] rounded-xl border border-yellow-500/30">
                          <p className="text-sm text-yellow-400">No contract forms available.</p>
                          <p className="text-xs text-gray-500 mt-1">Please create a contract form first in the "Contract Forms" section.</p>
                        </div>
                      ) : (
                        <select
                          value={editingContractType.contractFormId || ""}
                          onChange={(e) => setEditingContractType({ ...editingContractType, contractFormId: e.target.value ? Number(e.target.value) : null })}
                          className="w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
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
                      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        Notice Period
                        <Tooltip content="How many days before the contract end date the member must cancel. After this deadline, the contract will auto-renew (if enabled).">
                          <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
                        </Tooltip>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={editingContractType.cancellationPeriod}
                          onChange={(e) => setEditingContractType({ ...editingContractType, cancellationPeriod: Number(e.target.value) })}
                          min={0}
                          className="w-20 sm:w-24 bg-[#141414] text-white rounded-xl px-3 sm:px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                        />
                        <span className="text-gray-400 text-sm">days before end</span>
                      </div>
                    </div>
                    
                    {/* Auto Renewal Section */}
                    <div className="p-4 bg-[#141414] rounded-xl space-y-4">
                      <Toggle
                        label="Automatic Renewal"
                        checked={editingContractType.autoRenewal}
                        onChange={(v) => setEditingContractType({ ...editingContractType, autoRenewal: v })}
                        helpText="Contract continues automatically after the minimum duration ends"
                      />
                      
                      {editingContractType.autoRenewal && (
                        <div className="space-y-4 pt-3 border-t border-[#333333]">
                          {/* Renewal Duration */}
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                              Renewal Duration
                              <Tooltip content="How long the contract continues after the minimum duration. Choose 'Indefinite' for an open-ended contract that runs until cancelled.">
                                <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
                              </Tooltip>
                            </label>
                            <div className="flex items-center gap-2">
                              <select
                                value={editingContractType.renewalIndefinite ? "indefinite" : "fixed"}
                                onChange={(e) => setEditingContractType({ 
                                  ...editingContractType, 
                                  renewalIndefinite: e.target.value === "indefinite"
                                })}
                                className={`${editingContractType.renewalIndefinite ? 'flex-1' : ''} bg-[#141414] text-white rounded-xl px-3 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]`}
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
                                    className="flex-1 min-w-0 bg-[#141414] text-white rounded-xl px-3 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                                  />
                                  <span className="text-gray-400 flex-shrink-0">months</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Price After Renewal */}
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                              Price After Renewal
                              <Tooltip content="The new price per billing period after the contract renews.">
                                <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
                              </Tooltip>
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editingContractType.renewalPrice}
                                onChange={(e) => setEditingContractType({ ...editingContractType, renewalPrice: Number(e.target.value) })}
                                min={0}
                                className="w-32 bg-[#141414] text-white rounded-xl px-3 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                              />
                              <span className="text-gray-400 flex-shrink-0">{currency}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Modal Footer */}
                  <div className="flex gap-3 p-4 border-t border-[#333333] flex-shrink-0">
                    <button
                      onClick={() => {
                        setContractTypeModalVisible(false)
                        setEditingContractType(null)
                        setEditingContractTypeIndex(null)
                      }}
                      className="flex-1 px-4 py-2.5 bg-[#2F2F2F] text-white text-sm font-medium rounded-xl hover:bg-[#3F3F3F] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveContractType}
                      className="flex-1 px-4 py-2.5 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
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
                  className="px-3 sm:px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span> Reason
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
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <p className="text-blue-400 text-sm flex items-start gap-2">
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
                    <h3 className="text-white font-medium">Birthday Email</h3>
                    <p className="text-sm text-gray-400">Send birthday greetings via email</p>
                  </div>
                  <Toggle
                    checked={settings.birthdayEmailEnabled}
                    onChange={(v) => setSettings({ ...settings, birthdayEmailEnabled: v })}
                  />
                </div>
                
                {settings.birthdayEmailEnabled && (
                  <div className="space-y-4 pt-4 border-t border-[#333333]">
                    {/* Send Time */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm text-gray-300">Send time:</span>
                      <input
                        type="time"
                        value={settings.birthdaySendTime || "09:00"}
                        onChange={(e) => setSettings({ ...settings, birthdaySendTime: e.target.value })}
                        className="bg-[#141414] text-white rounded-lg px-3 py-2 text-sm border border-[#333333]"
                      />
                    </div>
                    
                    {/* Subject */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Subject</label>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500 mr-2">Variables:</span>
                        {["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}"].map(v => (
                          <button
                            key={v}
                            onClick={() => setSettings({ ...settings, birthdayEmailSubject: (settings.birthdayEmailSubject || "") + " " + v })}
                            className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
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
                        className="w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                      />
                    </div>
                    
                    {/* Message */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Message</label>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500 mr-1">Variables:</span>
                        {["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}"].map(v => (
                          <button
                            key={v}
                            onClick={() => setSettings({ ...settings, birthdayEmailTemplate: (settings.birthdayEmailTemplate || "") + v })}
                            className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
                          >
                            {v.replace(/{|}/g, "").replace(/_/g, " ")}
                          </button>
                        ))}
                        <span className="text-xs text-gray-500 mx-2">|</span>
                        <span className="text-xs text-gray-500 mr-1">Insert:</span>
                        <button
                          onClick={() => {
                            if (settings.emailSignature) {
                              setSettings({ ...settings, birthdayEmailTemplate: (settings.birthdayEmailTemplate || "") + settings.emailSignature })
                            } else {
                              notification.warning({ message: "No email signature configured", description: "Please set up your email signature first." })
                            }
                          }}
                          className="px-2 py-1 bg-orange-500 text-white text-xs rounded-lg hover:bg-orange-600 flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          Email Signature
                        </button>
                      </div>
                      <WysiwygEditor
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
                        <h3 className="text-white font-medium">{titles[type]} Email</h3>
                        <p className="text-sm text-gray-400">{descriptions[type]}</p>
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
                      <div className="space-y-4 pt-4 border-t border-[#333333]">
                        {/* Reminder timing */}
                        {type === "reminder" && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-gray-300">Send</span>
                            <input
                              type="number"
                              value={config.hoursBefore || 24}
                              onChange={(e) => setAppointmentNotificationTypes({
                                ...appointmentNotificationTypes,
                                [type]: { ...config, hoursBefore: Number(e.target.value) }
                              })}
                              className="w-20 bg-[#141414] text-white rounded-lg px-3 py-2 text-sm border border-[#333333]"
                            />
                            <span className="text-sm text-gray-300">hours before appointment</span>
                          </div>
                        )}
                        
                        {/* Subject */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Subject</label>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-xs text-gray-500 mr-2">Variables:</span>
                            {subjectVariables.map(v => (
                              <button
                                key={v}
                                onClick={() => setAppointmentNotificationTypes({
                                  ...appointmentNotificationTypes,
                                  [type]: { ...config, emailSubject: (config.emailSubject || "") + " " + v }
                                })}
                                className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
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
                            className="w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                          />
                        </div>
                        
                        {/* Message */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Message</label>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-xs text-gray-500 mr-1">Variables:</span>
                            {messageVariables.map(v => (
                              <button
                                key={v}
                                onClick={() => setAppointmentNotificationTypes({
                                  ...appointmentNotificationTypes,
                                  [type]: { ...config, emailTemplate: (config.emailTemplate || "") + v }
                                })}
                                className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
                              >
                                {v.replace(/{|}/g, "").replace(/_/g, " ")}
                              </button>
                            ))}
                            <span className="text-xs text-gray-500 mx-2">|</span>
                            <span className="text-xs text-gray-500 mr-1">Insert:</span>
                            <button
                              onClick={() => {
                                if (settings.emailSignature) {
                                  setAppointmentNotificationTypes({
                                    ...appointmentNotificationTypes,
                                    [type]: { ...config, emailTemplate: (config.emailTemplate || "") + settings.emailSignature }
                                  })
                                } else {
                                  notification.warning({ message: "No email signature configured", description: "Please set up your email signature first." })
                                }
                              }}
                              className="px-2 py-1 bg-orange-500 text-white text-xs rounded-lg hover:bg-orange-600 flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3" />
                              Email Signature
                            </button>
                          </div>
                          <WysiwygEditor
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
                    <h3 className="text-white font-medium">Birthday Push Notification</h3>
                    <p className="text-sm text-gray-400">Send birthday greetings via app push notification</p>
                  </div>
                  <Toggle
                    checked={settings.birthdayAppEnabled}
                    onChange={(v) => setSettings({ ...settings, birthdayAppEnabled: v })}
                  />
                </div>
                
                {settings.birthdayAppEnabled && (
                  <div className="space-y-4 pt-4 border-t border-[#333333]">
                    {/* Send Time */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm text-gray-300">Send time:</span>
                      <input
                        type="time"
                        value={settings.birthdayAppSendTime || "09:00"}
                        onChange={(e) => setSettings({ ...settings, birthdayAppSendTime: e.target.value })}
                        className="bg-[#141414] text-white rounded-lg px-3 py-2 text-sm border border-[#333333]"
                      />
                    </div>
                    
                    {/* Title */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Title</label>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500 mr-2">Variables:</span>
                        {["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}"].map(v => (
                          <button
                            key={v}
                            onClick={() => setSettings({ ...settings, birthdayAppTitle: (settings.birthdayAppTitle || "") + " " + v })}
                            className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
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
                        className="w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                      />
                    </div>
                    
                    {/* Message */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Message</label>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500 mr-2">Variables:</span>
                        {["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}"].map(v => (
                          <button
                            key={v}
                            onClick={() => setSettings({ ...settings, birthdayAppMessage: (settings.birthdayAppMessage || "") + v })}
                            className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
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
                        className="w-full bg-[#141414] text-white rounded-xl px-4 py-3 text-sm outline-none border border-[#333333] focus:border-[#3F74FF] resize-none"
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
                        <h3 className="text-white font-medium">{titles[type]} Push</h3>
                        <p className="text-sm text-gray-400">{descriptions[type]}</p>
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
                      <div className="space-y-4 pt-4 border-t border-[#333333]">
                        {/* Reminder timing */}
                        {type === "reminder" && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-gray-300">Send</span>
                            <input
                              type="number"
                              value={config.appHoursBefore || 24}
                              onChange={(e) => setAppointmentNotificationTypes({
                                ...appointmentNotificationTypes,
                                [type]: { ...config, appHoursBefore: Number(e.target.value) }
                              })}
                              className="w-20 bg-[#141414] text-white rounded-lg px-3 py-2 text-sm border border-[#333333]"
                            />
                            <span className="text-sm text-gray-300">hours before appointment</span>
                          </div>
                        )}
                        
                        {/* Title */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Title</label>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-xs text-gray-500 mr-2">Variables:</span>
                            {titleVariables.map(v => (
                              <button
                                key={v}
                                onClick={() => setAppointmentNotificationTypes({
                                  ...appointmentNotificationTypes,
                                  [type]: { ...config, appTitle: (config.appTitle || "") + " " + v }
                                })}
                                className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
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
                            className="w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                          />
                        </div>
                        
                        {/* Message */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Message</label>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-xs text-gray-500 mr-2">Variables:</span>
                            {messageVariables.map(v => (
                              <button
                                key={v}
                                onClick={() => setAppointmentNotificationTypes({
                                  ...appointmentNotificationTypes,
                                  [type]: { ...config, appMessage: (config.appMessage || "") + v }
                                })}
                                className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
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
                            className="w-full bg-[#141414] text-white rounded-xl px-4 py-3 text-sm outline-none border border-[#333333] focus:border-[#3F74FF] resize-none"
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
                      <label className="text-sm font-medium text-gray-300 mb-1.5 block">Security</label>
                      <select
                        value={settings.smtpSecure ? "tls" : "none"}
                        onChange={(e) => setSettings({ ...settings, smtpSecure: e.target.value === "tls" })}
                        className="w-full bg-[#141414] text-white rounded-xl px-3 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
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
                    className="px-4 py-2 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F] transition-colors flex items-center gap-2"
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
                    className="px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2"
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
                <p className="text-sm text-gray-400">
                  This signature can be inserted into your email notification templates using the orange "Email Signature" button.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-gray-500 mr-1">Variables:</span>
                  {["{Studio_Name}", "{Studio_Operator}", "{Studio_Phone}", "{Studio_Email}", "{Studio_Website}", "{Studio_Address}"].map(v => (
                    <button
                      key={v}
                      onClick={() => setSettings({ ...settings, emailSignature: (settings.emailSignature || "") + v })}
                      className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
                    >
                      {v.replace(/{|}/g, "").replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
                <WysiwygEditor
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
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Subject</label>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500 mr-2">Variables:</span>
                    {["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}", "{Invoice_Number}", "{Total_Amount}", "{Selling_Date}"].map(v => (
                      <button
                        key={v}
                        onClick={() => setSettings({ ...settings, einvoiceSubject: (settings.einvoiceSubject || "") + " " + v })}
                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
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
                    className="w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Message</label>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500 mr-1">Variables:</span>
                    {["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}", "{Invoice_Number}", "{Total_Amount}", "{Selling_Date}"].map(v => (
                      <button
                        key={v}
                        onClick={() => setSettings({ ...settings, einvoiceTemplate: (settings.einvoiceTemplate || "") + v })}
                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
                      >
                        {v.replace(/{|}/g, "").replace(/_/g, " ")}
                      </button>
                    ))}
                    <span className="text-xs text-gray-500 mx-2">|</span>
                    <span className="text-xs text-gray-500 mr-1">Insert:</span>
                    <button
                      onClick={() => {
                        if (settings.emailSignature) {
                          setSettings({ ...settings, einvoiceTemplate: (settings.einvoiceTemplate || "") + settings.emailSignature })
                        } else {
                          notification.warning({ message: "No email signature configured", description: "Please set up your email signature first." })
                        }
                      }}
                      className="px-2 py-1 bg-orange-500 text-white text-xs rounded-lg hover:bg-orange-600 flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      Email Signature
                    </button>
                  </div>
                  <WysiwygEditor
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
                  className="px-3 sm:px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span> Rate
                </button>
              }
            />
            <SettingsCard>
              <div className="space-y-3">
                {vatRates.map((rate, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-3 p-3 bg-[#141414] rounded-xl">
                    <div className="flex items-center gap-2 sm:w-24">
                      <input
                        type="number"
                        value={rate.percentage}
                        onChange={(e) => {
                          const updated = [...vatRates]
                          updated[index].percentage = Number(e.target.value)
                          setVatRates(updated)
                        }}
                        className="w-16 bg-[#1F1F1F] text-white rounded-lg px-3 py-2 text-sm border border-[#333333]"
                      />
                      <span className="text-gray-400">%</span>
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
                      className="flex-1 bg-transparent text-white text-sm outline-none min-w-0"
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
                  <label className="text-sm font-medium text-gray-300">Currency</label>
                  <input
                    type="text"
                    value={currency}
                    disabled
                    className="w-full bg-[#141414] text-gray-400 rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] cursor-not-allowed"
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
                      <span className="text-white">Light</span>
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
                      <span className="text-white">Dark</span>
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

                <div className="pt-4 border-t border-[#333333]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Primary Color */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-300">Primary Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={appearance.primaryColor}
                          onChange={(e) => setAppearance({ ...appearance, primaryColor: e.target.value })}
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-[#333333]"
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
                          className="flex-1 bg-[#141414] text-white rounded-lg px-3 py-2 text-sm font-mono border border-[#333333] uppercase"
                          maxLength={7}
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(appearance.primaryColor)
                            notification.success({ message: "Copied!", duration: 1.5 })
                          }}
                          className="p-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-lg transition-colors"
                          title="Copy color code"
                        >
                          <Clipboard className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Secondary Color */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-300">Secondary Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={appearance.secondaryColor}
                          onChange={(e) => setAppearance({ ...appearance, secondaryColor: e.target.value })}
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-[#333333]"
                        />
                        <input
                          type="text"
                          value={appearance.secondaryColor}
                          onChange={(e) => {
                            const val = e.target.value
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                              setAppearance({ ...appearance, secondaryColor: val })
                            }
                          }}
                          className="flex-1 bg-[#141414] text-white rounded-lg px-3 py-2 text-sm font-mono border border-[#333333] uppercase"
                          maxLength={7}
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(appearance.secondaryColor)
                            notification.success({ message: "Copied!", duration: 1.5 })
                          }}
                          className="p-2 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-lg transition-colors"
                          title="Copy color code"
                        >
                          <Clipboard className="w-4 h-4 text-gray-400" />
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
            
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <p className="text-blue-400 text-sm flex items-start gap-2">
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
                      <div className="p-2 bg-[#2F2F2F] rounded-lg">
                        <item.icon className="w-5 h-5 text-orange-400" />
                      </div>
                      <h3 className="text-white font-medium text-sm sm:text-base">{item.title}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400">{item.desc}</p>
                    <label className="block">
                      <span className="px-4 py-2 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F] cursor-pointer transition-colors inline-flex items-center gap-2">
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
              <h3 className="text-white font-medium mb-3">Import Instructions</h3>
              <ul className="text-sm text-gray-400 space-y-2">
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
          {searchQuery && filteredNavItems.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">
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
          <div>
            {renderSectionContent()}
          </div>
        </div>
      </div>

      {/* Desktop Main Content */}
      <div className="hidden lg:flex flex-1 flex-col min-h-0 overflow-hidden">
        {/* Desktop Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#333333] flex-shrink-0">
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
          <div className="bg-[#1F1F1F] rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-4">Create New Contract Form</h3>
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
                className="flex-1 px-4 py-2.5 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateContractForm}
                className="flex-1 px-4 py-2.5 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contract Builder Fullscreen */}
      {contractBuilderModalVisible && selectedContractForm && (
        <div className="fixed inset-0 z-50 bg-[#1C1C1C]">
          <ContractBuilder
            contractForm={selectedContractForm}
            onUpdate={(updatedForm) => {
              setContractForms(contractForms.map(f => f.id === selectedContractForm.id ? updatedForm : f))
              setSelectedContractForm(updatedForm)
            }}
            onClose={() => setContractBuilderModalVisible(false)}
          />
        </div>
      )}

      {/* Appointment Type Modal */}
      {showAppointmentTypeModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#1C1C1C] rounded-2xl w-full max-w-2xl my-8">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#333333]">
              <h2 className="text-lg font-semibold text-white">
                {editingAppointmentType ? "Edit Appointment Type" : "Create Appointment Type"}
              </h2>
              <button
                onClick={() => setShowAppointmentTypeModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden">
              {/* Image Upload */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-3 block">
                  Appointment Image <span className="text-gray-500">(16:9, shown in member app)</span>
                </label>
                <div
                  className="relative aspect-video bg-[#141414] rounded-xl border-2 border-dashed border-[#333333] hover:border-[#444444] transition-colors cursor-pointer overflow-hidden group"
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
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
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
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    Name
                    <span className="text-red-400">*</span>
                    <Tooltip content="The name members will see when booking this appointment">
                      <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
                    </Tooltip>
                  </label>
                  <input
                    type="text"
                    value={appointmentTypeForm.name}
                    onChange={(e) => setAppointmentTypeForm({ ...appointmentTypeForm, name: e.target.value })}
                    placeholder="e.g., Personal Training"
                    className="w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    Category
                    <Tooltip content="Group similar appointments together for easier organization">
                      <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
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
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  Description
                  <Tooltip content="Optional details about what this appointment includes. Shown to members.">
                    <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
                  </Tooltip>
                </label>
                <textarea
                  value={appointmentTypeForm.description}
                  onChange={(e) => setAppointmentTypeForm({ ...appointmentTypeForm, description: e.target.value })}
                  placeholder="Describe what this appointment includes..."
                  rows={3}
                  className="w-full bg-[#141414] text-white rounded-xl px-4 py-3 text-sm outline-none border border-[#333333] focus:border-[#3F74FF] resize-none"
                />
              </div>

              {/* Duration, Slots Required, Max Parallel, Interval */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    Duration
                    <span className="text-red-400">*</span>
                    <Tooltip content="How long the appointment lasts in minutes">
                      <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
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
                      className="w-24 bg-[#141414] text-white rounded-xl px-3 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                    />
                    <span className="text-sm text-gray-400">min</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    Interval
                    <span className="text-red-400">*</span>
                    <Tooltip content="Time between available booking slots (e.g., 30 = bookings at :00 and :30)">
                      <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
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
                      className="w-24 bg-[#141414] text-white rounded-xl px-3 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                    />
                    <span className="text-sm text-gray-400">min</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-gray-500" />
                    Slots
                    <span className="text-red-400">*</span>
                    <Tooltip content="How many capacity slots this appointment uses. Set to 0 if it doesn't block any capacity.">
                      <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
                    </Tooltip>
                  </label>
                  <input
                    type="number"
                    value={appointmentTypeForm.slotsRequired}
                    onChange={(e) => setAppointmentTypeForm({ ...appointmentTypeForm, slotsRequired: Math.floor(Number(e.target.value)) })}
                    onKeyDown={(e) => { if (e.key === '.' || e.key === ',') e.preventDefault() }}
                    min={0}
                    max={studioCapacity}
                    className="w-24 bg-[#141414] text-white rounded-xl px-3 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    Max Parallel
                    <span className="text-red-400">*</span>
                    <Tooltip content="Maximum number of this appointment type that can run at the same time" position="right">
                      <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
                    </Tooltip>
                  </label>
                  <input
                    type="number"
                    value={appointmentTypeForm.maxParallel}
                    onChange={(e) => setAppointmentTypeForm({ ...appointmentTypeForm, maxParallel: Math.floor(Number(e.target.value)) })}
                    onKeyDown={(e) => { if (e.key === '.' || e.key === ',') e.preventDefault() }}
                    min={1}
                    max={studioCapacity}
                    className="w-24 bg-[#141414] text-white rounded-xl px-3 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                  />
                </div>
              </div>

              {/* Contingent Usage */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <BadgeDollarSign className="w-4 h-4 text-gray-500" />
                  Contingent Usage
                  <span className="text-red-400">*</span>
                  <Tooltip content="How many credits are deducted from the member's contract contingent when booking this appointment. For example, if set to 2, a member with 10 credits will have 8 left after booking.">
                    <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
                  </Tooltip>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={appointmentTypeForm.contingentUsage}
                    onChange={(e) => setAppointmentTypeForm({ ...appointmentTypeForm, contingentUsage: Math.floor(Number(e.target.value)) })}
                    onKeyDown={(e) => { if (e.key === '.' || e.key === ',') e.preventDefault() }}
                    min={0}
                    className="w-24 bg-[#141414] text-white rounded-xl px-3 py-2.5 text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
                  />
                  <span className="text-sm text-gray-400">per booking</span>
                </div>
                <p className="text-xs text-gray-500">0 = No deduction from member's contingent</p>
              </div>

              {/* Color */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  Calendar Color
                  <Tooltip content="The color used to display this appointment type in the calendar">
                    <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
                  </Tooltip>
                </label>
                <input
                  type="color"
                  value={appointmentTypeForm.color}
                  onChange={(e) => setAppointmentTypeForm({ ...appointmentTypeForm, color: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-[#333333] p-1"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-5 border-t border-[#333333]">
              <button
                onClick={() => setShowAppointmentTypeModal(false)}
                className="flex-1 px-4 py-2.5 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAppointmentType}
                className="flex-1 px-4 py-2.5 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors"
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
