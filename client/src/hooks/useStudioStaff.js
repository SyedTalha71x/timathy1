import { useState, useEffect } from "react"

// ============================================
// Import all static defaults (current data source)
// When backend is ready, replace loadStaffFromDefaults()
// with an API call — nothing else changes.
// ============================================
import {
  staffMemberDataNew,
  membersData,
  communicationSettingsData,
} from "../utils/studio-states"

import {
  studioStaffData,
  studioMembersData,
} from "../utils/admin-panel-states/customers-states"

/**
 * Loads staff data from static default files.
 * This is the ONLY function that needs to change when
 * the backend is ready.
 *
 * @param {Object} options
 * @param {number|null} options.studioId - null = own studio, number = specific studio (admin)
 * @param {string} options.mode - "studio" or "admin"
 * @returns {Object} Normalized staff data object
 */
function loadStaffFromDefaults({ studioId, mode }) {
  if (mode === "admin" && studioId !== null) {
    // ========================================
    // ADMIN MODE: Load per-studio data keyed by studioId
    // FUTURE:
    //   const res = await fetch(`/api/admin/studios/${studioId}/staff`)
    //   return await res.json()
    // ========================================
    const rawStaff = studioStaffData[studioId] || []
    const normalizedStaff = rawStaff.map((s) => ({
      ...s,
      title: s.title || `${s.firstName || ""} ${s.lastName || ""}`.trim(),
      name: s.name || `${s.firstName || ""} ${s.lastName || ""}`.trim(),
    }))

    return {
      staff: normalizedStaff,
      members: studioMembersData[studioId] || [],
      communicationSettings: communicationSettingsData || {},
    }
  }

  // ========================================
  // STUDIO MODE: Load own studio data
  // FUTURE:
  //   const res = await fetch(`/api/studio/staff`)
  //   return await res.json()
  // ========================================
  return {
    staff: staffMemberDataNew || [],
    members: membersData || [],
    communicationSettings: communicationSettingsData || {},
  }
}

/**
 * Shared hook for loading studio staff data.
 * Used by both the Studio Panel and Admin Panel.
 *
 * @param {Object} options
 * @param {number|null} options.studioId - null = own studio, number = specific studio (admin mode)
 * @param {string} options.mode - "studio" or "admin"
 * @returns {{ data, updateData, isLoading, error, mode, studioId }}
 */
export function useStudioStaff({ studioId = null, mode = "studio" } = {}) {
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
        //   const res = await fetch(`/api/admin/studios/${studioId}/staff`)
        //   const json = await res.json()
        //   if (!cancelled) setData(json)
        // } else {
        //   const res = await fetch(`/api/studio/staff`)
        //   const json = await res.json()
        //   if (!cancelled) setData(json)
        // }
        // ========================================
        const result = loadStaffFromDefaults({ studioId, mode })

        // Simulate tiny async delay (remove when using real API)
        await new Promise((r) => setTimeout(r, 50))

        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load staff data")
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
