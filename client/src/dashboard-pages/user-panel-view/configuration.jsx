/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import { useState, useEffect, useRef } from "react"
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
} from "lucide-react"
import { BsPersonWorkspace } from "react-icons/bs"
import { RiContractLine } from "react-icons/ri"
import { Modal, notification, QRCode } from "antd"
import dayjs from "dayjs"

import ContractBuilder from "../../components/user-panel-components/configuration-components/ContractBuilder"
import { PERMISSION_DATA, PermissionModal } from "../../components/user-panel-components/configuration-components/PermissionModal"
import { WysiwygEditor } from "../../components/user-panel-components/configuration-components/WysiwygEditor"
import { RoleItem } from "../../components/user-panel-components/configuration-components/RoleItem"
import { StaffAssignmentModal } from "../../components/user-panel-components/configuration-components/StaffAssignmentModal"
import ImageSourceModal from "../../components/shared/ImageSourceModal"
import ImageCropModal from "../../components/shared/ImageCropModal"
import MediaLibraryPickerModal from "../../components/shared/MediaLibraryPickerModal"
import DefaultAvatar from '../../../public/gray-avatar-fotor-20250912192528.png'

// ============================================
// Navigation Items Configuration
// ============================================
const navigationItems = [
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
    label: "Members",
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
      { id: "invoice-template", label: "Invoice Template" },
    ],
  },
  {
    id: "finances",
    label: "Finances",
    icon: BadgeDollarSign,
    sections: [
      { id: "currency", label: "Currency" },
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
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
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
const InfoTooltip = ({ content }) => (
  <Tooltip content={content}>
    <Info className="w-4 h-4 text-gray-500 hover:text-gray-300 cursor-help" />
  </Tooltip>
)

// ============================================
// Main Configuration Page Component
// ============================================
const ConfigurationPage = () => {
  // Navigation State
  const [activeCategory, setActiveCategory] = useState("studio")
  const [activeSection, setActiveSection] = useState("studio-info")
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileShowContent, setMobileShowContent] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState(["studio"])

  // ============================================
  // All State Variables (preserved from original)
  // ============================================
  
  // Basic studio information
  const [studioName, setStudioName] = useState("")
  const [studioOperator, setStudioOperator] = useState("")
  const [studioOperatorEmail, setStudioOperatorEmail] = useState("")
  const [studioOperatorPhone, setStudioOperatorPhone] = useState("")
  const [studioOperatorMobile, setStudioOperatorMobile] = useState("")
  const [studioStreet, setStudioStreet] = useState("")
  const [studioZipCode, setStudioZipCode] = useState("")
  const [studioCity, setStudioCity] = useState("")
  const [studioCountry, setStudioCountry] = useState("")
  const [studioPhoneNo, setStudioPhoneNo] = useState("")
  const [studioEmail, setStudioEmail] = useState("")
  const [studioWebsite, setStudioWebsite] = useState("")
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
      defaultVacationDays: 20,
      isAdmin: true,
      staffCount: 1,
      assignedStaff: [1]
    }
  ])
  const [defaultVacationDays, setDefaultVacationDays] = useState(20)
  const [defaultStaffRole, setDefaultStaffRole] = useState(null)
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
      pages: [{ id: 1, content: "Welcome to our studio!", elements: [] }]
    }
  ])

  // Contracts
  const [allowMemberSelfCancellation, setAllowMemberSelfCancellation] = useState(true)
  const [noticePeriod, setNoticePeriod] = useState(30)
  const [extensionPeriod, setExtensionPeriod] = useState(12)
  const [contractTypes, setContractTypes] = useState([])
  const [contractForms, setContractForms] = useState([])
  const [selectedContractForm, setSelectedContractForm] = useState(null)
  const [contractBuilderModalVisible, setContractBuilderModalVisible] = useState(false)
  const [newContractFormName, setNewContractFormName] = useState("")
  const [showCreateFormModal, setShowCreateFormModal] = useState(false)
  const [contractPauseReasons, setContractPauseReasons] = useState([
    { name: "Vacation", maxDays: 30 },
    { name: "Medical", maxDays: 90 },
  ])

  // Communication Settings
  const [settings, setSettings] = useState({
    autoArchiveDuration: 30,
    emailNotificationEnabled: false,
    birthdayMessageEnabled: false,
    birthdayMessageTemplate: "",
    birthdaySendTime: "09:00",
    appointmentNotificationEnabled: false,
    appNotificationEnabled: false,
    birthdayAppNotificationEnabled: false,
    appointmentAppNotificationEnabled: false,
    notificationSubTab: "email",
    smtpHost: "",
    smtpPort: 587,
    smtpUser: "",
    smtpPass: "",
    senderName: "",
    emailSignature: "Best regards,\n{Studio_Name} Team",
    einvoiceSubject: "",
    einvoiceTemplate: "",
  })

  const [appointmentNotificationTypes, setAppointmentNotificationTypes] = useState({
    confirmation: { enabled: false, template: "", sendApp: false, sendEmail: false, hoursBefore: 24 },
    cancellation: { enabled: false, template: "", sendApp: false, sendEmail: false, hoursBefore: 24 },
    rescheduled: { enabled: false, template: "", sendApp: false, sendEmail: false, hoursBefore: 24 },
    reminder: { enabled: false, template: "", sendApp: false, sendEmail: false, hoursBefore: 24 },
    registration: { enabled: false, template: "", sendApp: false, sendEmail: false },
  })

  // Finances
  const [vatRates, setVatRates] = useState([
    { name: "Standard", percentage: 19, description: "Standard VAT rate" },
    { name: "Reduced", percentage: 7, description: "Reduced VAT rate" },
  ])
  const [vatNumber, setVatNumber] = useState("")
  const [bankName, setBankName] = useState("")
  const [creditorId, setCreditorId] = useState("")

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

  // Update currency when country changes
  useEffect(() => {
    if (studioCountry) {
      const country = countries.find(c => c.code === studioCountry)
      if (country) setCurrency(country.currency)
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
      notification.success({ message: "Holidays Loaded", description: `Loaded ${data.length} public holidays` })
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
      defaultVacationDays: defaultVacationDays,
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
    setRoles(roles.map(role => 
      role.id === roleId ? { ...role, assignedStaff: assignedStaffIds, staffCount: assignedStaffIds.length } : role
    ))
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
      })
    }
    setShowAppointmentTypeModal(true)
  }

  const handleSaveAppointmentType = () => {
    if (!appointmentTypeForm.name.trim()) {
      notification.error({ message: "Please enter a name for the appointment type" })
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
    setContractTypes([...contractTypes, {
      name: "",
      duration: 12,
      cost: 0,
      billingPeriod: "monthly",
      userCapacity: 0,
      autoRenewal: false,
      renewalPeriod: 1,
      renewalPrice: 0,
      cancellationPeriod: 30,
      contractFormId: null,
    }])
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
                <InputField
                  label="Studio Name"
                  value={studioName}
                  onChange={setStudioName}
                  placeholder="Enter studio name"
                  required
                  maxLength={50}
                />
                <InputField
                  label="Phone Number"
                  value={studioPhoneNo}
                  onChange={(v) => setStudioPhoneNo(v.replace(/\D/g, ""))}
                  placeholder="Enter phone number"
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
                  label="Phone Number"
                  value={studioOperatorPhone}
                  onChange={(v) => setStudioOperatorPhone(v.replace(/\D/g, ""))}
                  placeholder="Enter phone number"
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
                  <p>• <span className="text-gray-300">EMS Strength</span> (1 slot, max 2×) — Can run twice in parallel, uses 2 slots total</p>
                  <p>• <span className="text-gray-300">Body Check</span> (2 slots, max 1×) — Uses 2 slots, only 1 slot left for other appointments</p>
                  <p>• <span className="text-gray-300">Trial Training</span> (3 slots, max 1×) — Uses all capacity, blocks all other bookings</p>
                  <p>• <span className="text-gray-300">EMP Chair</span> (0 slots, max 1×) — Doesn't use any capacity, runs independently</p>
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
            <SettingsCard>
              <div className="space-y-6">
                <NumberInput
                  label="Default Vacation Days"
                  value={defaultVacationDays}
                  onChange={setDefaultVacationDays}
                  min={0}
                  max={365}
                  suffix="days per year"
                  helpText="Automatically assigned to new staff"
                />
                <SelectField
                  label="Default Staff Role"
                  value={defaultStaffRole}
                  onChange={setDefaultStaffRole}
                  options={roles.map(r => ({ value: r.id, label: r.name }))}
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
            <div className="space-y-4">
              {roles.map((role, index) => (
                <SettingsCard key={role.id}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: role.color }} />
                        <div>
                          <h3 className="text-white font-medium text-sm sm:text-base">
                            {role.name || "New Role"}
                            {role.isAdmin && <span className="ml-2 text-xs text-orange-400">(Admin)</span>}
                          </h3>
                          <p className="text-xs text-gray-500">{role.staffCount} staff assigned</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyRole(index)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded-lg transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {!role.isAdmin && (
                          <button
                            onClick={() => handleDeleteRole(index)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <InputField
                        label="Role Name"
                        value={role.name}
                        onChange={(v) => handleUpdateRole(index, "name", v)}
                        placeholder="Enter role name"
                      />
                      <ColorPickerField
                        label="Color"
                        value={role.color}
                        onChange={(v) => handleUpdateRole(index, "color", v)}
                      />
                      <NumberInput
                        label="Vacation Days"
                        value={role.defaultVacationDays}
                        onChange={(v) => handleUpdateRole(index, "defaultVacationDays", v)}
                        min={0}
                        max={365}
                      />
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-300">Actions</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedRoleIndex(index)
                              setPermissionModalVisible(true)
                            }}
                            className="flex-1 px-2 sm:px-3 py-2 bg-[#2F2F2F] text-white text-xs sm:text-sm rounded-xl hover:bg-[#3F3F3F] transition-colors flex items-center justify-center gap-1 sm:gap-2"
                          >
                            <Shield className="w-4 h-4" />
                            <span className="hidden sm:inline">Permissions</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRoleForAssignment(index)
                              setStaffAssignmentModalVisible(true)
                            }}
                            className="flex-1 px-2 sm:px-3 py-2 bg-[#2F2F2F] text-white text-xs sm:text-sm rounded-xl hover:bg-[#3F3F3F] transition-colors flex items-center justify-center gap-1 sm:gap-2"
                          >
                            <Users className="w-4 h-4" />
                            <span className="hidden sm:inline">Staff</span>
                          </button>
                        </div>
                      </div>
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
                  <h3 className="text-white font-medium">Member Check-In QR Code</h3>
                  <div className="p-4 bg-white rounded-xl">
                    <QRCode
                      value={memberQRCodeUrl || "https://your-studio-app.com/member-checkin"}
                      size={180}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button className="px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Download QR
                    </button>
                    <button className="px-4 py-2 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F] transition-colors">
                      Print QR
                    </button>
                  </div>
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
                  onClick={() => setIntroductoryMaterials([...introductoryMaterials, {
                    id: Date.now(),
                    name: "",
                    pages: [{ id: Date.now(), content: "", elements: [] }]
                  }])}
                  className="px-3 sm:px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span> Material
                </button>
              }
            />
            <div className="space-y-4">
              {introductoryMaterials.map((material, index) => (
                <SettingsCard key={material.id}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <InputField
                          label="Material Name"
                          value={material.name}
                          onChange={(v) => {
                            const updated = [...introductoryMaterials]
                            updated[index].name = v
                            setIntroductoryMaterials(updated)
                          }}
                          placeholder="e.g., Welcome Guide"
                        />
                      </div>
                      <button
                        onClick={() => setIntroductoryMaterials(introductoryMaterials.filter((_, i) => i !== index))}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-6"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <BookOpen className="w-4 h-4" />
                      {material.pages.length} page{material.pages.length !== 1 ? "s" : ""}
                    </div>
                    <button className="px-4 py-2 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F] transition-colors flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Edit Content
                    </button>
                  </div>
                </SettingsCard>
              ))}
            </div>
          </div>
        )

      // ========================
      // CONTRACT SECTIONS
      // ========================
      case "contract-general":
        return (
          <div className="space-y-6">
            <SectionHeader title="Contract General Settings" description="Default settings for contracts" />
            <SettingsCard>
              <div className="space-y-6">
                <Toggle
                  label="Allow Member Self-Cancellation"
                  checked={allowMemberSelfCancellation}
                  onChange={setAllowMemberSelfCancellation}
                  helpText="Members can cancel their contracts without staff assistance"
                />
                <NumberInput
                  label="Default Notice Period"
                  value={noticePeriod}
                  onChange={setNoticePeriod}
                  min={0}
                  max={365}
                  suffix="days"
                />
                <NumberInput
                  label="Default Extension Period"
                  value={extensionPeriod}
                  onChange={setExtensionPeriod}
                  min={1}
                  max={60}
                  suffix="months"
                />
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
                <div className="text-center py-8 text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No contract forms created</p>
                </div>
              </SettingsCard>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {contractForms.map((form) => (
                  <SettingsCard key={form.id}>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="text-white font-medium text-sm sm:text-base">{form.name}</h3>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setContractForms([...contractForms, {
                              ...form,
                              id: Date.now(),
                              name: `${form.name} (Copy)`,
                              createdAt: new Date().toISOString()
                            }])}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setContractForms(contractForms.filter(f => f.id !== form.id))}
                            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
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
          </div>
        )

      case "contract-types":
        return (
          <div className="space-y-6">
            <SectionHeader
              title="Contract Types"
              description="Define different membership contracts"
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
                <div className="text-center py-8 text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No contract types configured</p>
                </div>
              </SettingsCard>
            ) : (
              <div className="space-y-4">
                {contractTypes.map((type, index) => (
                  <SettingsCard key={index}>
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-white font-medium text-sm sm:text-base">{type.name || "New Contract Type"}</h3>
                        <button
                          onClick={() => setContractTypes(contractTypes.filter((_, i) => i !== index))}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InputField
                          label="Contract Name"
                          value={type.name}
                          onChange={(v) => {
                            const updated = [...contractTypes]
                            updated[index].name = v
                            setContractTypes(updated)
                          }}
                          placeholder="e.g., Monthly Membership"
                        />
                        <SelectField
                          label="Contract Form"
                          value={type.contractFormId}
                          onChange={(v) => {
                            const updated = [...contractTypes]
                            updated[index].contractFormId = v
                            setContractTypes(updated)
                          }}
                          options={[
                            { value: null, label: "No form selected" },
                            ...contractForms.map(f => ({ value: f.id, label: f.name }))
                          ]}
                        />
                        <NumberInput
                          label="Duration"
                          value={type.duration}
                          onChange={(v) => {
                            const updated = [...contractTypes]
                            updated[index].duration = v
                            setContractTypes(updated)
                          }}
                          min={1}
                          max={60}
                          suffix="months"
                        />
                        <NumberInput
                          label="Cost"
                          value={type.cost}
                          onChange={(v) => {
                            const updated = [...contractTypes]
                            updated[index].cost = v
                            setContractTypes(updated)
                          }}
                          min={0}
                          suffix={currency}
                        />
                        <SelectField
                          label="Billing Period"
                          value={type.billingPeriod}
                          onChange={(v) => {
                            const updated = [...contractTypes]
                            updated[index].billingPeriod = v
                            setContractTypes(updated)
                          }}
                          options={[
                            { value: "weekly", label: "Weekly" },
                            { value: "monthly", label: "Monthly" },
                            { value: "annually", label: "Annually" }
                          ]}
                        />
                        <NumberInput
                          label="User Contingent"
                          value={type.userCapacity}
                          onChange={(v) => {
                            const updated = [...contractTypes]
                            updated[index].userCapacity = v
                            setContractTypes(updated)
                          }}
                          min={0}
                          helpText="Max appointments per billing period"
                        />
                      </div>

                      <div className="pt-4 border-t border-[#333333]">
                        <Toggle
                          label="Automatic Renewal"
                          checked={type.autoRenewal || false}
                          onChange={(v) => {
                            const updated = [...contractTypes]
                            updated[index].autoRenewal = v
                            setContractTypes(updated)
                          }}
                        />
                        
                        {type.autoRenewal && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <NumberInput
                              label="Renewal Period"
                              value={type.renewalPeriod || 1}
                              onChange={(v) => {
                                const updated = [...contractTypes]
                                updated[index].renewalPeriod = v
                                setContractTypes(updated)
                              }}
                              min={1}
                              suffix="months"
                            />
                            <NumberInput
                              label="Renewal Price"
                              value={type.renewalPrice || 0}
                              onChange={(v) => {
                                const updated = [...contractTypes]
                                updated[index].renewalPrice = v
                                setContractTypes(updated)
                              }}
                              min={0}
                              suffix={currency}
                            />
                          </div>
                        )}
                      </div>

                      <NumberInput
                        label="Cancellation Period"
                        value={type.cancellationPeriod || 30}
                        onChange={(v) => {
                          const updated = [...contractTypes]
                          updated[index].cancellationPeriod = v
                          setContractTypes(updated)
                        }}
                        min={0}
                        suffix="days"
                      />
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
              <NumberInput
                label="Auto-Archive Duration"
                value={settings.autoArchiveDuration}
                onChange={(v) => setSettings({ ...settings, autoArchiveDuration: v })}
                min={1}
                max={365}
                suffix="days"
                helpText="Member chats are automatically archived after this period of inactivity"
              />
            </SettingsCard>
          </div>
        )

      case "email-notifications":
        return (
          <div className="space-y-6">
            <SectionHeader title="Email Notifications" description="Configure automated email notifications" />
            
            <SettingsCard>
              <Toggle
                label="Enable Email Notifications"
                checked={settings.emailNotificationEnabled}
                onChange={(v) => setSettings({ ...settings, emailNotificationEnabled: v })}
              />
            </SettingsCard>

            {settings.emailNotificationEnabled && (
              <>
                {/* Birthday Emails */}
                <SettingsCard>
                  <div className="space-y-4">
                    <Toggle
                      label="Birthday Messages"
                      checked={settings.birthdayMessageEnabled}
                      onChange={(v) => setSettings({ ...settings, birthdayMessageEnabled: v })}
                      helpText="Send automatic birthday greetings"
                    />
                    
                    {settings.birthdayMessageEnabled && (
                      <div className="space-y-4 pl-4 border-l-2 border-orange-500">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-sm text-gray-300">Send time:</span>
                          <input
                            type="time"
                            value={settings.birthdaySendTime || "09:00"}
                            onChange={(e) => setSettings({ ...settings, birthdaySendTime: e.target.value })}
                            className="bg-[#141414] text-white rounded-lg px-3 py-2 text-sm border border-[#333333]"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}"].map(v => (
                            <button
                              key={v}
                              onClick={() => setSettings({ ...settings, birthdayMessageTemplate: (settings.birthdayMessageTemplate || "") + v })}
                              className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
                            >
                              {v.replace(/{|}/g, "").replace(/_/g, " ")}
                            </button>
                          ))}
                        </div>
                        <textarea
                          value={settings.birthdayMessageTemplate || ""}
                          onChange={(e) => setSettings({ ...settings, birthdayMessageTemplate: e.target.value })}
                          placeholder="Happy Birthday, {Member_First_Name}!"
                          rows={4}
                          className="w-full bg-[#141414] text-white rounded-xl px-4 py-3 text-sm outline-none border border-[#333333] focus:border-[#3F74FF] resize-none"
                        />
                      </div>
                    )}
                  </div>
                </SettingsCard>

                {/* Appointment Emails */}
                <SettingsCard>
                  <div className="space-y-4">
                    <Toggle
                      label="Appointment Notifications"
                      checked={settings.appointmentNotificationEnabled}
                      onChange={(v) => setSettings({ ...settings, appointmentNotificationEnabled: v })}
                    />
                    
                    {settings.appointmentNotificationEnabled && (
                      <div className="space-y-4 pl-4 border-l-2 border-blue-500">
                        {["confirmation", "cancellation", "rescheduled", "reminder"].map(type => {
                          const config = appointmentNotificationTypes[type] || {}
                          return (
                            <div key={type} className="space-y-3 p-4 bg-[#141414] rounded-xl">
                              <Toggle
                                label={`Appointment ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                                checked={config.enabled || false}
                                onChange={(v) => setAppointmentNotificationTypes({
                                  ...appointmentNotificationTypes,
                                  [type]: { ...config, enabled: v }
                                })}
                              />
                              
                              {config.enabled && (
                                <div className="space-y-3 ml-4">
                                  <Toggle
                                    label="Send Email"
                                    checked={config.sendEmail || false}
                                    onChange={(v) => setAppointmentNotificationTypes({
                                      ...appointmentNotificationTypes,
                                      [type]: { ...config, sendEmail: v }
                                    })}
                                  />
                                  
                                  {config.sendEmail && (
                                    <>
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
                                            className="w-20 bg-[#1F1F1F] text-white rounded-lg px-3 py-2 text-sm border border-[#333333]"
                                          />
                                          <span className="text-sm text-gray-300">hours before</span>
                                        </div>
                                      )}
                                      <div className="flex flex-wrap gap-2">
                                        {["{Studio_Name}", "{Member_First_Name}", "{Appointment_Type}", "{Booked_Time}"].map(v => (
                                          <button
                                            key={v}
                                            onClick={() => setAppointmentNotificationTypes({
                                              ...appointmentNotificationTypes,
                                              [type]: { ...config, template: (config.template || "") + v }
                                            })}
                                            className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
                                          >
                                            {v.replace(/{|}/g, "").replace(/_/g, " ")}
                                          </button>
                                        ))}
                                      </div>
                                      <textarea
                                        value={config.template || ""}
                                        onChange={(e) => setAppointmentNotificationTypes({
                                          ...appointmentNotificationTypes,
                                          [type]: { ...config, template: e.target.value }
                                        })}
                                        placeholder={`Enter ${type} message template...`}
                                        rows={3}
                                        className="w-full bg-[#1F1F1F] text-white rounded-xl px-4 py-3 text-sm outline-none border border-[#333333] focus:border-[#3F74FF] resize-none"
                                      />
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}

                        {/* Registration Email */}
                        <div className="space-y-3 p-4 bg-[#141414] rounded-xl">
                          <Toggle
                            label="Registration Notification"
                            checked={appointmentNotificationTypes.registration?.enabled || false}
                            onChange={(v) => setAppointmentNotificationTypes({
                              ...appointmentNotificationTypes,
                              registration: { ...appointmentNotificationTypes.registration, enabled: v }
                            })}
                          />
                          
                          {appointmentNotificationTypes.registration?.enabled && (
                            <div className="space-y-3 ml-4">
                              <Toggle
                                label="Send Email"
                                checked={appointmentNotificationTypes.registration?.sendEmail || false}
                                onChange={(v) => setAppointmentNotificationTypes({
                                  ...appointmentNotificationTypes,
                                  registration: { ...appointmentNotificationTypes.registration, sendEmail: v }
                                })}
                              />
                              
                              {appointmentNotificationTypes.registration?.sendEmail && (
                                <>
                                  <div className="flex flex-wrap gap-2">
                                    {["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}", "{Registration_Link}"].map(v => (
                                      <button
                                        key={v}
                                        onClick={() => setAppointmentNotificationTypes({
                                          ...appointmentNotificationTypes,
                                          registration: {
                                            ...appointmentNotificationTypes.registration,
                                            template: (appointmentNotificationTypes.registration?.template || "") + v
                                          }
                                        })}
                                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
                                      >
                                        {v.replace(/{|}/g, "").replace(/_/g, " ")}
                                      </button>
                                    ))}
                                  </div>
                                  <textarea
                                    value={appointmentNotificationTypes.registration?.template || ""}
                                    onChange={(e) => setAppointmentNotificationTypes({
                                      ...appointmentNotificationTypes,
                                      registration: { ...appointmentNotificationTypes.registration, template: e.target.value }
                                    })}
                                    placeholder="Welcome {Member_First_Name}! Complete your registration..."
                                    rows={3}
                                    className="w-full bg-[#1F1F1F] text-white rounded-xl px-4 py-3 text-sm outline-none border border-[#333333] focus:border-[#3F74FF] resize-none"
                                  />
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </SettingsCard>
              </>
            )}
          </div>
        )

      case "app-notifications":
        return (
          <div className="space-y-6">
            <SectionHeader title="App Notifications" description="Configure push notifications" />
            
            <SettingsCard>
              <Toggle
                label="Enable App Notifications"
                checked={settings.appNotificationEnabled}
                onChange={(v) => setSettings({ ...settings, appNotificationEnabled: v })}
              />
            </SettingsCard>

            {settings.appNotificationEnabled && (
              <SettingsCard>
                <div className="space-y-4">
                  <Toggle
                    label="Birthday App Notifications"
                    checked={settings.birthdayAppNotificationEnabled}
                    onChange={(v) => setSettings({ ...settings, birthdayAppNotificationEnabled: v })}
                  />
                  <Toggle
                    label="Appointment App Notifications"
                    checked={settings.appointmentAppNotificationEnabled}
                    onChange={(v) => setSettings({ ...settings, appointmentAppNotificationEnabled: v })}
                  />
                  
                  {settings.appointmentAppNotificationEnabled && (
                    <div className="space-y-3 pl-4 border-l-2 border-purple-500">
                      {["confirmation", "cancellation", "rescheduled", "reminder", "registration"].map(type => {
                        const config = appointmentNotificationTypes[type] || {}
                        return (
                          <Toggle
                            key={type}
                            label={`${type.charAt(0).toUpperCase() + type.slice(1)} Notification`}
                            checked={config.sendApp || false}
                            onChange={(v) => setAppointmentNotificationTypes({
                              ...appointmentNotificationTypes,
                              [type]: { ...config, sendApp: v }
                            })}
                          />
                        )
                      })}
                    </div>
                  )}
                </div>
              </SettingsCard>
            )}
          </div>
        )

      case "smtp-setup":
        return (
          <div className="space-y-6">
            <SectionHeader title="SMTP Setup" description="Configure your email server" />
            <SettingsCard>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Display Name"
                  value={settings.senderName}
                  onChange={(v) => setSettings({ ...settings, senderName: v })}
                  placeholder="Your Studio Name"
                />
                <InputField
                  label="SMTP Host"
                  value={settings.smtpHost}
                  onChange={(v) => setSettings({ ...settings, smtpHost: v })}
                  placeholder="smtp.example.com"
                />
                <NumberInput
                  label="SMTP Port"
                  value={settings.smtpPort}
                  onChange={(v) => setSettings({ ...settings, smtpPort: v })}
                  min={1}
                  max={65535}
                />
                <InputField
                  label="Username"
                  value={settings.smtpUser}
                  onChange={(v) => setSettings({ ...settings, smtpUser: v })}
                  placeholder="your-email@example.com"
                />
                <div className="sm:col-span-2">
                  <InputField
                    label="Password"
                    value={settings.smtpPass}
                    onChange={(v) => setSettings({ ...settings, smtpPass: v })}
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button
                onClick={() => notification.info({ message: "Testing connection..." })}
                className="mt-4 px-4 py-2 bg-[#2F2F2F] text-white text-sm rounded-xl hover:bg-[#3F3F3F] transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Test Connection
              </button>
            </SettingsCard>
          </div>
        )

      case "email-signature":
        return (
          <div className="space-y-6">
            <SectionHeader title="Email Signature" description="Default signature for all outgoing emails" />
            <SettingsCard>
              <textarea
                value={settings.emailSignature}
                onChange={(e) => setSettings({ ...settings, emailSignature: e.target.value })}
                placeholder="Best regards,&#10;{Studio_Name} Team"
                rows={6}
                className="w-full bg-[#141414] text-white rounded-xl px-4 py-3 text-sm outline-none border border-[#333333] focus:border-[#3F74FF] resize-none"
              />
            </SettingsCard>
          </div>
        )

      case "invoice-template":
        return (
          <div className="space-y-6">
            <SectionHeader title="Invoice Email Template" description="Template for invoice emails" />
            <SettingsCard>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Subject</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {["{Invoice_Number}", "{Selling_Date}"].map(v => (
                      <button
                        key={v}
                        onClick={() => setSettings({ ...settings, einvoiceSubject: (settings.einvoiceSubject || "") + v })}
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
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Message Template</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {["{Studio_Name}", "{Member_First_Name}", "{Member_Last_Name}", "{Invoice_Number}", "{Total_Amount}", "{Selling_Date}"].map(v => (
                      <button
                        key={v}
                        onClick={() => setSettings({ ...settings, einvoiceTemplate: (settings.einvoiceTemplate || "") + v })}
                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
                      >
                        {v.replace(/{|}/g, "").replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={settings.einvoiceTemplate || ""}
                    onChange={(e) => setSettings({ ...settings, einvoiceTemplate: e.target.value })}
                    placeholder="Dear {Member_First_Name}, please find your invoice..."
                    rows={6}
                    className="w-full bg-[#141414] text-white rounded-xl px-4 py-3 text-sm outline-none border border-[#333333] focus:border-[#3F74FF] resize-none"
                  />
                </div>
              </div>
            </SettingsCard>
          </div>
        )

      // ========================
      // FINANCE SECTIONS
      // ========================
      case "currency":
        return (
          <div className="space-y-6">
            <SectionHeader title="Currency" description="Set your studio's default currency" />
            <SettingsCard>
              <SelectField
                label="Currency"
                value={currency}
                onChange={setCurrency}
                options={[
                  { value: "€", label: "€ Euro" },
                  { value: "$", label: "$ US Dollar" },
                  { value: "£", label: "£ British Pound" },
                  { value: "¥", label: "¥ Japanese Yen" },
                  { value: "Fr", label: "Fr Swiss Franc" },
                  { value: "A$", label: "A$ Australian Dollar" },
                  { value: "C$", label: "C$ Canadian Dollar" },
                  { value: "kr", label: "kr Swedish Krona" },
                ]}
              />
            </SettingsCard>
          </div>
        )

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
                <InputField
                  label="Creditor ID"
                  value={creditorId}
                  onChange={setCreditorId}
                  placeholder="Enter Creditor ID"
                  maxLength={50}
                />
                <InputField
                  label="VAT Number"
                  value={vatNumber}
                  onChange={setVatNumber}
                  placeholder="Enter VAT number"
                  maxLength={30}
                />
                <div className="sm:col-span-2">
                  <InputField
                    label="Bank Name"
                    value={bankName}
                    onChange={setBankName}
                    placeholder="Enter bank name"
                    maxLength={50}
                  />
                </div>
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
                    <ColorPickerField
                      label="Primary Color"
                      value={appearance.primaryColor}
                      onChange={(v) => setAppearance({ ...appearance, primaryColor: v })}
                    />
                    <ColorPickerField
                      label="Secondary Color"
                      value={appearance.secondaryColor}
                      onChange={(v) => setAppearance({ ...appearance, secondaryColor: v })}
                    />
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
    </div>
  )
}

export default ConfigurationPage
