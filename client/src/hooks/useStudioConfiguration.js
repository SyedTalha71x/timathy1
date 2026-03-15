import { useState, useEffect } from "react"
import { useDispatch } from "react-redux" // Assuming you're using Redux
import { fetchMyStudio } from "../features/studio/studioSlice" // Update path as needed

// ============================================
// Import all static defaults (fallback data source)
// When backend is ready, replace loadConfigFromDefaults()
// with an API call — nothing else changes.
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
  if (!backendData || !backendData.studio) {
    return null
  }

  const { studio } = backendData

  // Helper function to format opening hours
  const formatOpeningHours = (hours) => {
    return hours.map(day => ({
      ...day,
      // Ensure consistent time format if needed
      open: day.open,
      close: day.close
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
        vacationDays: staff.vacationDays || 30,
        remainingDays: staff.remainingDays,
        about: staff.about,
        notes: staff.notes || [],
        permissions: staff.permission || [],
        img: staff.img
      })),
      roles: DEFAULT_STAFF_ROLES, // Keep defaults or transform from backend if available
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
        img: member.img,
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
      id: studio._id,
      name: studio.studioName,
      studioId: studio._id,
      operator: studio.studioOwner,
      operatorEmail: studio.email,
      operatorPhone: studio.phone, // Note: This might need to be added to your backend
      operatorMobile: studio.telephone, // Note: This might need to be added to your backend
      street: studio.street,
      zipCode: studio.zipCode,
      city: studio.city,
      country: studio.country,
      phone: studio.phone, // You might need to add this to your backend
      mobile: studio.mobile, // You might need to add this to your backend
      email: studio.email,
      website: studio.website,
      currency: "EUR", // Default or add to backend
      registrationNumber: studio.registrationNumber,
      taxId: studio.texId,
      court: studio.court,
      overallCapacity: studio.overallCapacity,
      openingHours: formatOpeningHours(studio.openingHours || []),
      closingDays: studio.closingDays || [],
      createdAt: studio.createdAt,
      updatedAt: studio.updatedAt,
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
      vatNumber: studio.texId,
      // Bank details - you might need to add these to your backend
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
 * Loads configuration from static default files (fallback).
 * @param {Object} options
 * @param {number|null} options.studioId
 * @param {string} options.mode
 * @returns {Object} Normalized configuration object
 */
function loadConfigFromDefaults(/* { studioId, mode } */) {
  return {
    studio: {
      name: studioData.name,
      studioId: studioData.studioId,
      operator: studioData.operator,
      operatorEmail: studioData.operatorEmail,
      operatorPhone: studioData.operatorPhone,
      operatorMobile: studioData.operatorMobile,
      street: studioData.street,
      zipCode: studioData.zipCode,
      city: studioData.city,
      country: studioData.country,
      phone: studioData.phone,
      mobile: studioData.mobile,
      email: studioData.email,
      website: studioData.website,
      currency: studioData.currency,
      openingHours: studioData.openingHours,
      closingDays: studioData.closingDays || [],
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
      vatNumber: studioData.taxId,
      bankName: studioData.bankAccount?.bankName,
      creditorId: studioData.bankAccount?.creditorId,
      creditorName: studioData.bankAccount?.creditorName,
      iban: studioData.bankAccount?.iban,
      bic: studioData.bankAccount?.bic,
    },
    appearance: DEFAULT_APPEARANCE_SETTINGS,
    countries: COUNTRIES,
    permissions: PERMISSION_DATA,
  }
}

/**
 * Shared hook for loading studio configuration.
 * Used by both the Studio Panel and Admin Panel.
 *
 * @param {Object} options
 * @param {string|null} options.studioId - null = own studio, string = specific studio (admin mode)
 * @param {string} options.mode - "studio" or "admin"
 * @returns {{ config, updateConfig, isLoading, error, mode, studioId, refetch }}
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
        // Replace with your admin API endpoint
        const res = await fetch(`/api/admin/studios/${studioId}/configuration`)
        if (!res.ok) throw new Error('Failed to fetch studio configuration')
        const json = await res.json()
        data = transformStudioResponse(json)
      } else {
        // Studio mode - fetch own studio using Redux action
        const result = await dispatch(fetchMyStudio()).unwrap()

        // Check if the API call was successful
        if (result && result.success && result.studio) {
          // Transform the backend data to match our config structure
          data = transformStudioResponse(result)
        } else {
          // Fallback to defaults if API fails or returns unexpected data
          console.warn('Using default configuration as fallback')
          data = loadConfigFromDefaults({ studioId, mode })
        }
      }

      setConfig(data)
    } catch (err) {
      console.error('Error loading configuration:', err)

      // Fallback to defaults on error
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
   * Update a section of the config (optimistic update).
   * In a real implementation, this would also save to backend.
   */
  const updateConfig = (section, data) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...(prev?.[section] || {}),
        ...data,
      },
    }))

    // Here you would also trigger a save to backend
    // e.g., dispatch(updateStudioConfiguration({ section, data }))
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