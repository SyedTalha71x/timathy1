import { useState, useEffect } from "react"

// ============================================
// Import all static defaults (current data source)
// When backend is ready, replace loadLeadsFromDefaults()
// with an API call — nothing else changes.
// ============================================
import {
  hardcodedLeads,
  memberRelationsLeadNew,
  DEFAULT_LEAD_SOURCES,
} from "../utils/studio-states/leads-states"

import {
  availableMembersLeadsMain,
  appointmentTypesData,
  freeAppointmentsData,
  leadsData as leadsDataMain,
} from "../utils/studio-states"

import {
  studioLeadData,
  studioLeadsRelatonData,
  studioMembersData,
} from "../utils/admin-panel-states/customers-states"

/**
 * Loads leads data from static default files.
 * This is the ONLY function that needs to change when
 * the backend is ready.
 *
 * @param {Object} options
 * @param {number|null} options.studioId - null = own studio, number = specific studio (admin)
 * @param {string} options.mode - "studio" or "admin"
 * @returns {Object} Normalized leads data object
 */
function loadLeadsFromDefaults({ studioId, mode }) {
  if (mode === "admin" && studioId !== null) {
    // ========================================
    // ADMIN MODE: Load per-studio data keyed by studioId
    // FUTURE:
    //   const res = await fetch(`/api/admin/studios/${studioId}/leads`)
    //   return await res.json()
    // ========================================
    const rawLeads = studioLeadData[studioId] || []
    const normalizedLeads = rawLeads.map((lead) => ({
      ...lead,
      // Ensure columnId is set for Kanban board
      columnId: lead.columnId || (lead.hasTrialTraining ? "trial" : lead.status || "passive"),
    }))

    return {
      leads: normalizedLeads,
      memberRelations: studioLeadsRelatonData || {},
      availableMembers: studioMembersData[studioId] || [],
      appointmentTypes: appointmentTypesData || [],
      freeAppointments: freeAppointmentsData || [],
      leadsData: leadsDataMain || [],
      leadSources: DEFAULT_LEAD_SOURCES || [],
    }
  }

  // ========================================
  // STUDIO MODE: Load own studio data
  // FUTURE:
  //   const res = await fetch(`/api/studio/leads`)
  //   return await res.json()
  // ========================================
  return {
    leads: hardcodedLeads || [],
    memberRelations: memberRelationsLeadNew || {},
    availableMembers: availableMembersLeadsMain || [],
    appointmentTypes: appointmentTypesData || [],
    freeAppointments: freeAppointmentsData || [],
    leadsData: leadsDataMain || [],
    leadSources: DEFAULT_LEAD_SOURCES || [],
  }
}

/**
 * Shared hook for loading studio leads data.
 * Used by both the Studio Panel and Admin Panel.
 *
 * @param {Object} options
 * @param {number|null} options.studioId - null = own studio, number = specific studio (admin mode)
 * @param {string} options.mode - "studio" or "admin"
 * @returns {{ data, updateData, isLoading, error, mode, studioId }}
 */
export function useStudioLeads({ studioId = null, mode = "studio" } = {}) {
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
        //   const res = await fetch(`/api/admin/studios/${studioId}/leads`)
        //   const json = await res.json()
        //   if (!cancelled) setData(json)
        // } else {
        //   const res = await fetch(`/api/studio/leads`)
        //   const json = await res.json()
        //   if (!cancelled) setData(json)
        // }
        // ========================================
        const result = loadLeadsFromDefaults({ studioId, mode })

        // Simulate tiny async delay (remove when using real API)
        await new Promise((r) => setTimeout(r, 50))

        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load leads data")
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
   */
  const updateData = (section, newData) => {
    setData((prev) => ({
      ...prev,
      [section]: Array.isArray(newData)
        ? newData
        : { ...(prev?.[section] || {}), ...newData },
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
