import { useState, useEffect } from "react"

// ============================================
// Import static defaults (current data sources)
// When backend is ready, replace loadMembersFromDefaults()
// with an API call — nothing else changes.
// ============================================
import {
  membersData,
  appointmentsMainData,
  appointmentTypeMainData,
  availableMembersLeadsMain,
  freeAppointmentsMainData,
  memberHistoryMainData,
  memberRelationsMainData,
  relationOptionsMain,
  staffData,
  communicationSettingsData,
} from "../utils/studio-states"

import { studioMembersData } from "../utils/admin-panel-states/customers-states"

/**
 * Loads member data from static default files.
 * This is the ONLY function that needs to change when
 * the backend is ready.
 *
 * @param {Object} options
 * @param {number|null} options.studioId - null = own studio, number = specific studio (admin)
 * @param {string} options.mode - "studio" or "admin"
 * @returns {Object} Normalized members data object
 */
function loadMembersFromDefaults({ studioId, mode }) {
  // ========================================
  // Admin mode: load studio-specific members
  // Studio mode: load default (own) studio members
  // ========================================
const members =
  mode === "admin" && studioId
    ? (studioMembersData[studioId] || []).map(m => ({
        ...m,
        title: m.title || `${m.firstName || ''} ${m.lastName || ''}`.trim(),
      }))
    : membersData

  return {
    members,
    appointments: appointmentsMainData,
    appointmentTypes: appointmentTypeMainData,
    freeAppointments: freeAppointmentsMainData,
    availableMembersLeads: availableMembersLeadsMain,
    memberHistory: memberHistoryMainData,
    memberRelations: memberRelationsMainData,
    relationOptions: relationOptionsMain,
    staff: staffData,
    communicationSettings: communicationSettingsData,
  }
}

/**
 * Shared hook for loading studio member data.
 * Used by both the Studio Panel and Admin Panel.
 *
 * Follows the same pattern as useStudioConfiguration so that
 * swapping in a real API later requires changing only
 * loadMembersFromDefaults() above.
 *
 * @param {Object} options
 * @param {number|null} options.studioId - null = own studio, number = specific studio (admin mode)
 * @param {string} options.mode - "studio" or "admin"
 * @returns {{ data, updateData, isLoading, error, mode, studioId }}
 */
export function useStudioMembers({ studioId = null, mode = "studio" } = {}) {
  const [data, setData] = useState(null)
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
        //   const res = await fetch(`/api/admin/studios/${studioId}/members`)
        //   const data = await res.json()
        //   if (!cancelled) setData(data)
        // } else {
        //   const res = await fetch(`/api/studio/members`)
        //   const data = await res.json()
        //   if (!cancelled) setData(data)
        // }
        // ========================================
        const result = loadMembersFromDefaults({ studioId, mode })

        // Simulate tiny async delay (remove when using real API)
        await new Promise((r) => setTimeout(r, 50))

        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load members data")
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
   * Update a section of the data (for future save-to-backend).
   * Sections: "members", "appointments", "memberRelations", etc.
   *
   * @param {string} section - Key in the data object to update
   * @param {*} newValue - New value (replaces the section entirely)
   */
  const updateData = (section, newValue) => {
    setData((prev) => ({
      ...prev,
      [section]: newValue,
    }))
  }

  return {
    data,
    updateData,
    isLoading,
    error,
    mode,
    studioId,
  }
}
