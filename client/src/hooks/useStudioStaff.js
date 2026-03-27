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
// import { fetchAllStaffThunk } from "../features/staff/staffSlice"
import { useDispatch } from "react-redux"
import { fetchMyStudio } from "../features/studio/studioSlice"

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
  // ========================================
  return {
    staff: staffMemberDataNew || [],
    members: membersData || [],
    communicationSettings: communicationSettingsData || {},
  }
}

/**
 * Transforms studio API response to match the expected data structure
 */
function transformStudioData(studioData) {
  // Add debug logging to see the actual structure
  // console.log("transformStudioData received:", studioData)
  // console.log("transformStudioData received:", studioData)

  // Handle case when studioData is undefined or null
  if (!studioData) {
    // console.warn("studioData is undefined or null")
    return {
      studio: null,
      staff: [],
      members: [],
      leads: [],
      services: [],
      communicationSettings: communicationSettingsData || {},
    }
  }

  // If studioData is already the studio object (not wrapped)
  // This happens if your thunk returns res.studio directly
  const data = studioData.studio ? studioData : { studio: studioData }

  const studio = data.studio || data

  // Safe access with optional chaining and fallbacks
  const users = studio?.users || []
  const leads = studio?.leads || []
  const services = studio?.services || []

  // Filter users by role
  const staff = users.filter(user => user?.role === "staff") || []
  const members = users.filter(user => user?.role === "member") || []

  return {
    studio: data,
    staff: staff.map(s => ({
      id: s?._id,
      firstName: s?.firstName || "",
      lastName: s?.lastName || "",
      name: `${s?.firstName || ""} ${s?.lastName || ""}`.trim() || "Unknown Staff",
      email: s?.email || "",
      phone: s?.phone || "",
      telephone: s?.telephone || "",
      role: s?.role,
      staffRole: s?.staffRole,
      title: s?.title || `Staff Member`,
      gender: s?.gender,
      dateOfBirth: s?.dateOfBirth,
      street: s?.street,
      country: s?.country,
      zipCode: s?.zipCode,
      city: s?.city,
      username: s?.username,
      staffColor: s?.staffColor,
      img: s?.img?.url,
      vacationDays: s?.vacationDays,
      remainingDays: s?.remainingDays,
      staffId: s?.staffId,
      about: s?.about,
      loginHistory: s?.loginHistory
    })),
    members: members.map(m => ({
      id: m?._id,
      firstName: m?.firstName || "",
      lastName: m?.lastName || "",
      name: `${m?.firstName || ""} ${m?.lastName || ""}`.trim() || "Unknown Member",
      email: m?.email || "",
      phone: m?.phone || "",
      telephone: m?.telephone || "",
      role: m?.role || "member",
      gender: m?.gender,
      dateOfBirth: m?.dateOfBirth,
      street: m?.street,
      country: m?.country,
      city: m?.city,
      zipCode: m?.zipCode,
      username: m?.username
    })),
    leads: leads.map(l => ({
      id: l?._id,
      firstName: l?.firstName || "",
      lastName: l?.lastName || "",
      name: `${l?.firstName || ""} ${l?.lastName || ""}`.trim() || "Unknown Lead",
      email: l?.email || "",
      phone: l?.phone || "",
      gender: l?.gender,
      dateOfBirth: l?.dateOfBirth,
      street: l?.street,
      country: l?.country,
      zipCode: l?.zipCode,
      username: l?.username
    })),
    services: services.map(s => ({
      _id: s?._id,
      name: s?.name || "",
      description: s?.description || "",
      price: s?.price || 0,
      duration: s?.duration || ""
    })),
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
  const dispatch = useDispatch()

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)

      try {
        let result;

        // ========================================
        // USING REAL API WITH REDUX
        // ========================================
        if (mode === "admin" && studioId) {
          // Admin mode: fetch specific studio staff
          const res = await fetch(`/api/admin/studios/${studioId}/staff`)
          const json = await res.json()
          result = json
        } else {
          // Studio mode: fetch own studio data using Redux
          // console.log("Dispatching fetchMyStudio...")
          const actionResult = await dispatch(fetchMyStudio())

          // console.log("fetchMyStudio result:", actionResult)

          if (fetchMyStudio.fulfilled.match(actionResult)) {
            // The payload might be the studio data directly or nested
            const payload = actionResult.payload
            // console.log("Action payload:", payload)

            // Transform the API response to match expected structure
            result = transformStudioData(payload)
          } else {
            // console.error("fetchMyStudio failed:", actionResult)
            throw new Error(actionResult.payload || "Failed to fetch studio data")
          }
        }

        // ========================================
        // FALLBACK TO STATIC DEFAULTS IF NEEDED
        // Comment this out once your API is stable
        // ========================================
        if (!result || !result.staff) {
          console.warn("Using static fallback data")
          result = loadStaffFromDefaults({ studioId, mode })
        }

        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        console.error("Error loading staff data:", err)

        // ========================================
        // FALLBACK ON ERROR
        // Remove this once your API is stable
        // ========================================
        if (!cancelled) {
          const fallbackData = loadStaffFromDefaults({ studioId, mode })
          setData(fallbackData)
          setError(err.message || "Failed to load staff data, using fallback")
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
  }, [studioId, mode, dispatch])

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