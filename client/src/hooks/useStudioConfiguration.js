import { useState, useEffect } from "react"

// ============================================
// Import all static defaults (current data source)
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
 * Loads configuration from static default files.
 * This is the ONLY function that needs to change when
 * the backend is ready.
 *
 * @param {Object} options
 * @param {number|null} options.studioId - null = own studio, number = specific studio (admin)
 * @param {string} options.mode - "studio" or "admin"
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
      settings: {
        allowMemberSelfCancellation: DEFAULT_CONTRACT_SETTINGS.allowMemberSelfCancellation,
        noticePeriod: DEFAULT_CONTRACT_SETTINGS.noticePeriod,
        extensionPeriod: DEFAULT_CONTRACT_SETTINGS.extensionPeriod,
        defaultBillingPeriod: DEFAULT_CONTRACT_SETTINGS.defaultBillingPeriod,
        defaultAutoRenewal: DEFAULT_CONTRACT_SETTINGS.defaultAutoRenewal,
        defaultRenewalIndefinite: DEFAULT_CONTRACT_SETTINGS.defaultRenewalIndefinite,
        defaultRenewalPeriod: DEFAULT_CONTRACT_SETTINGS.defaultRenewalPeriod,
        defaultAppointmentLimit: DEFAULT_CONTRACT_SETTINGS.defaultAppointmentLimit,
      },
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
      bankName: studioData.bankAccount.bankName,
      creditorId: studioData.bankAccount.creditorId,
      creditorName: studioData.bankAccount.creditorName,
      iban: studioData.bankAccount.iban,
      bic: studioData.bankAccount.bic,
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
 * @param {number|null} options.studioId - null = own studio, number = specific studio (admin mode)
 * @param {string} options.mode - "studio" or "admin"
 * @returns {{ config, updateConfig, isLoading, error, mode, studioId }}
 */
export function useStudioConfiguration({ studioId = null, mode = "studio" } = {}) {
  const [config, setConfig] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)

      try {
        // ========================================
        // CURRENT: Load from static defaults
        // FUTURE:  Replace with API call, e.g.:
        //
        // if (mode === "admin" && studioId) {
        //   const res = await fetch(`/api/admin/studios/${studioId}/configuration`)
        //   const data = await res.json()
        //   if (!cancelled) setConfig(data)
        // } else {
        //   const res = await fetch(`/api/studio/configuration`)
        //   const data = await res.json()
        //   if (!cancelled) setConfig(data)
        // }
        // ========================================
        const data = loadConfigFromDefaults({ studioId, mode })

        // Simulate tiny async delay (remove when using real API)
        await new Promise((r) => setTimeout(r, 50))

        if (!cancelled) {
          setConfig(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load configuration")
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [studioId, mode])

  /**
   * Update a section of the config (for future save-to-backend).
   * Currently a no-op placeholder.
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

  return {
    config,
    updateConfig,
    isLoading,
    error,
    mode,
    studioId,
  }
}
