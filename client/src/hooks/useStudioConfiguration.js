import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { fetchMyStudio } from "../features/studio/studioSlice"

// ============================================
// Import all static defaults (fallback data source)
// ============================================
import {
  studioData,
  COUNTRIES,
  PERMISSION_DATA,
  DEFAULT_STAFF_ROLES,
  DEFAULT_VACATION_DAYS,
  DEFAULT_STAFF_ROLE_ID,
  DEFAULT_STAFF_COUNTRY,
  DEFAULT_STAFF_MEMBERS,
  DEFAULT_STUDIO_CAPACITY,
  DEFAULT_APPOINTMENT_CATEGORIES,
  DEFAULT_APPOINTMENT_TYPES,
  DEFAULT_TRIAL_TRAINING,
  DEFAULT_CALENDAR_SETTINGS,
  DEFAULT_LEAD_SOURCES,
  DEFAULT_CONTRACT_FORMS,
  DEFAULT_CONTRACT_TYPES,
  DEFAULT_CONTRACT_SETTINGS,
  DEFAULT_CONTRACT_PAUSE_REASONS,
  DEFAULT_VAT_RATES,
  DEFAULT_COMMUNICATION_SETTINGS,
  DEFAULT_APPOINTMENT_NOTIFICATION_TYPES,
  DEFAULT_APPEARANCE_SETTINGS,
  DEFAULT_INTRODUCTORY_MATERIALS,
  DEFAULT_MEMBER_SETTINGS,
} from "../utils/studio-states/configuration-states"

/**
 * Transforms backend studio data to match the expected configuration format
 * @param {Object} backendData - The response from fetchMyStudio()
 * @returns {Object} Normalized configuration object
 */
function transformStudioResponse(backendData) {
  if (!backendData) return null

  // Handle different response formats
  let studio;

  if (backendData?.studio) {
    // Format: { studio: {...} }
    studio = backendData.studio
  } else if (backendData?._id) {
    // Format: direct studio object
    studio = backendData
  } else {
    console.warn('No studio data found')
    return null
  }

  // Helper function to format opening hours
  const formatOpeningHours = (hours) => {
    if (!hours || !Array.isArray(hours)) return []
    return hours.map(day => ({
      day: day.day,
      open: day.open || "",
      close: day.close || "",
      isClosed: day.isClosed || false
    }))
  }

  // Format closing days
  const formatClosingDays = (days) => {
    if (!days || !Array.isArray(days)) return []
    return days.map(day => ({
      date: day.date,
      reason: day.reason || "",
      description: day.reason || "",
      _id: day._id
    }))
  }

  // Transform staff data
  const transformStaff = (users) => {
    const staffMembers = users?.filter(user => user.role === 'staff') || []
    return {
      allStaff: staffMembers.map(staff => ({
        id: staff._id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        role: staff.staffRole || 'staff',
        color: staff.staffColor || '#6366f1',
        isActive: staff.isActive,
        phone: staff.phone,
        telephone: staff.telephone,
        vacationDays: staff.vacationDays || staff.vacationEntitlement || 30,
        remainingDays: staff.remainingDays,
        about: staff.about,
        notes: staff.notes || [],
        permissions: staff.permission || [],
        img: staff.img?.url || staff.img
      })),
      roles: DEFAULT_STAFF_ROLES,
      defaultVacationDays: DEFAULT_VACATION_DAYS,
      defaultStaffRole: DEFAULT_STAFF_ROLE_ID,
      defaultStaffCountry: studio.country || DEFAULT_STAFF_COUNTRY,
    }
  }

  // Transform members data
  const transformMembers = (users) => {
    const members = users?.filter(user => user.role === 'member') || []
    return {
      allMembers: members.map(member => ({
        id: member._id,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        memberNumber: member.memberNumber,
        memberType: member.memberType,
        status: member.status,
        gender: member.gender,
        dateOfBirth: member.dateOfBirth,
        phone: member.phone,
        city: member.city,
        street: member.street,
        country: member.country,
        zipCode: member.zipCode,
        about: member.about,
        checkIn: member.checkIn,
        appointments: member.appointments || [],
        relations: member.relations || [],
        img: member.img?.url || member.img,
        specialsNotes: member.specialsNotes || []
      })),
      leadSources: DEFAULT_LEAD_SOURCES,
      introductoryMaterials: DEFAULT_INTRODUCTORY_MATERIALS,
      allowMemberQRCheckIn: DEFAULT_MEMBER_SETTINGS.allowMemberQRCheckIn,
      memberQRCodeUrl: DEFAULT_MEMBER_SETTINGS.memberQRCodeUrl,
    }
  }

  return {
    studio: {
      // Core fields
      _id: studio._id,
      id: studio._id,
      studioName: studio.studioName || "",
      studioOwner: studio.studioOwner || "",
      email: studio.email || "",

      // Address
      street: studio.street || "",
      zipCode: studio.zipCode || "",
      city: studio.city || "",
      country: studio.country || "",

      // Contact
      phone: studio.phone || "",
      telephone: studio.telephone || "",

      // Owner fields
      OwnerPhone: studio.OwnerPhone || "",
      ownerEmail: studio.ownerEmail || "",
      operatorTelephone: studio.operatorTelephone || "",

      // Other
      website: studio.website || "",
      overallCapacity: studio.overallCapacity || DEFAULT_STUDIO_CAPACITY,
      registrationNumber: studio.registrationNumber || "",
      texId: studio.texId || "",
      court: studio.court || "",

      // Arrays
      openingHours: formatOpeningHours(studio.openingHours),
      closingDays: formatClosingDays(studio.closingDays),

      // Metadata
      createdAt: studio.createdAt,
      updatedAt: studio.updatedAt,

      // Legacy/compatibility fields
      name: studio.studioName || "",
      operator: studio.studioOwner || "",
      operatorEmail: studio.ownerEmail || studio.email || "",
      operatorPhone: studio.OwnerPhone || studio.phone || "",
      operatorMobile: studio.operatorTelephone || studio.telephone || studio.phone || "",
      mobile: studio.telephone || studio.phone || "",
      currency: "EUR",
    },
    staff: transformStaff(studio.users),
    members: transformMembers(studio.users),
    appointments: {
      types: DEFAULT_APPOINTMENT_TYPES,
      categories: DEFAULT_APPOINTMENT_CATEGORIES,
      capacity: studio.overallCapacity || DEFAULT_STUDIO_CAPACITY,
      trialTraining: DEFAULT_TRIAL_TRAINING,
      calendarSettings: DEFAULT_CALENDAR_SETTINGS,
    },
    contracts: {
      settings: DEFAULT_CONTRACT_SETTINGS,
      types: DEFAULT_CONTRACT_TYPES,
      forms: DEFAULT_CONTRACT_FORMS,
      pauseReasons: DEFAULT_CONTRACT_PAUSE_REASONS,
    },
    communication: {
      settings: DEFAULT_COMMUNICATION_SETTINGS,
      notificationTypes: DEFAULT_APPOINTMENT_NOTIFICATION_TYPES,
    },
    finances: {
      vatRates: DEFAULT_VAT_RATES,
      vatNumber: studio.texId || "",
      bankName: "",
      creditorId: "",
      creditorName: "",
      iban: "",
      bic: "",
    },
    services: studio.services || [],
    leads: studio.leads || [],
    notes: studio.notes || [],
    appearance: DEFAULT_APPEARANCE_SETTINGS,
    countries: COUNTRIES,
    permissions: PERMISSION_DATA,
  }
}

/**
 * Loads configuration from static default files (fallback)
 */
function loadConfigFromDefaults({ studioId = null, mode = "studio" } = {}) {
  // Create default opening hours
  const defaultOpeningHours = [
    { day: "Monday", open: "09:00", close: "22:00", isClosed: false },
    { day: "Tuesday", open: "09:00", close: "22:00", isClosed: false },
    { day: "Wednesday", open: "09:00", close: "22:00", isClosed: false },
    { day: "Thursday", open: "09:00", close: "22:00", isClosed: false },
    { day: "Friday", open: "09:00", close: "22:00", isClosed: false },
    { day: "Saturday", open: "10:00", close: "18:00", isClosed: false },
    { day: "Sunday", open: "", close: "", isClosed: true },
  ]

  return {
    studio: {
      id: studioId || "default-studio-id",
      _id: studioId || "default-studio-id",
      name: "My Studio",
      studioName: "My Studio",
      operator: "Studio Owner",
      studioOwner: "Studio Owner",
      operatorEmail: "owner@example.com",
      ownerEmail: "owner@example.com",
      operatorPhone: "",
      OwnerPhone: "",
      operatorMobile: "",
      operatorTelephone: "",
      street: "123 Main Street",
      zipCode: "12345",
      city: "Your City",
      country: "DE",
      phone: "",
      telephone: "",
      email: "studio@example.com",
      website: "https://your-studio.com",
      currency: "EUR",
      registrationNumber: "",
      taxId: "",
      texId: "",
      court: "",
      overallCapacity: DEFAULT_STUDIO_CAPACITY,
      openingHours: defaultOpeningHours,
      closingDays: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mobile: "",

    },
    staff: {
      roles: DEFAULT_STAFF_ROLES,
      defaultVacationDays: DEFAULT_VACATION_DAYS,
      defaultStaffRole: DEFAULT_STAFF_ROLE_ID,
      defaultStaffCountry: DEFAULT_STAFF_COUNTRY,
      allStaff: DEFAULT_STAFF_MEMBERS,
    },
    appointments: {
      types: DEFAULT_APPOINTMENT_TYPES,
      categories: DEFAULT_APPOINTMENT_CATEGORIES,
      capacity: DEFAULT_STUDIO_CAPACITY,
      trialTraining: DEFAULT_TRIAL_TRAINING,
      calendarSettings: DEFAULT_CALENDAR_SETTINGS,
    },
    members: {
      allowMemberQRCheckIn: DEFAULT_MEMBER_SETTINGS.allowMemberQRCheckIn,
      memberQRCodeUrl: DEFAULT_MEMBER_SETTINGS.memberQRCodeUrl,
      leadSources: DEFAULT_LEAD_SOURCES,
      introductoryMaterials: DEFAULT_INTRODUCTORY_MATERIALS,
      allMembers: [],
    },
    contracts: {
      settings: DEFAULT_CONTRACT_SETTINGS,
      types: DEFAULT_CONTRACT_TYPES,
      forms: DEFAULT_CONTRACT_FORMS,
      pauseReasons: DEFAULT_CONTRACT_PAUSE_REASONS,
    },
    communication: {
      settings: DEFAULT_COMMUNICATION_SETTINGS,
      notificationTypes: DEFAULT_APPOINTMENT_NOTIFICATION_TYPES,
    },
    finances: {
      vatRates: DEFAULT_VAT_RATES,
      vatNumber: "",
      bankName: "",
      creditorId: "",
      creditorName: "",
      iban: "",
      bic: "",
    },
    services: Array.isArray(studioId.services) ? studioId.services.map(service => ({
      _id: service._id,
      name: service.name,
      description: service.description || "",
      price: service.price,
      duration: service.duration || 60,
      interval: service.interval || 60,
      category: service.category || "",
      image: service.image?.url || service.image || null,
    })) : [],
    leads: [],
    notes: [],
    appearance: DEFAULT_APPEARANCE_SETTINGS,
    countries: COUNTRIES,
    permissions: PERMISSION_DATA,
  }
}

/**
 * Shared hook for loading studio configuration
 */
export function useStudioConfiguration({ studioId = null, mode = "studio" } = {}) {
  const [config, setConfig] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const dispatch = useDispatch()

  const loadConfig = async () => {
    setIsLoading(true)
    setError(null)

    try {
      let data

      if (mode === "admin" && studioId) {
        // Admin mode - fetch specific studio
        try {
          const res = await fetch(`/api/admin/studios/${studioId}/configuration`)
          if (!res.ok) throw new Error('Failed to fetch studio configuration')
          const json = await res.json()
          data = transformStudioResponse(json)
        } catch (adminError) {
          console.error('Admin fetch failed, using defaults:', adminError)
          data = loadConfigFromDefaults({ studioId, mode })
        }
      } else {
        // Studio mode - fetch own studio
        try {
          const result = await dispatch(fetchMyStudio()).unwrap()

          // Handle different response formats
          if (result && result._id) {
            // Direct studio object
            data = transformStudioResponse(result)
          } else if (result && result.success && result.studio) {
            // Wrapped studio object
            data = transformStudioResponse(result)
          } else {
            console.warn('Unexpected API response format')
            data = loadConfigFromDefaults({ studioId, mode })
          }
        } catch (fetchError) {
          console.error('Error fetching studio:', fetchError)
          data = loadConfigFromDefaults({ studioId, mode })
        }
      }

      setConfig(data)
    } catch (err) {
      console.error('Error in loadConfig:', err)
      const fallbackData = loadConfigFromDefaults({ studioId, mode })
      setConfig(fallbackData)
      setError(err.message || "Failed to load configuration, using defaults")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadConfig()
  }, [studioId, mode, dispatch])

  /**
   * Update a section of the config
   */
  const updateConfig = (section, data) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...(prev?.[section] || {}),
        ...data,
      },
    }))
  }

  /**
   * Manually refetch the configuration
   */
  const refetch = () => {
    loadConfig()
  }

  return {
    config,
    updateConfig,
    isLoading,
    error,
    mode,
    studioId,
    refetch,
  }
}