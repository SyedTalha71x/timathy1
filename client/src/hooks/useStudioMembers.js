import { useState, useEffect } from "react"
// import { fetchAllMember } from "../features/member/memberSlice"
import { useDispatch } from "react-redux"
import { fetchMyStudio } from "../features/studio/studioSlice"

/**
 * Shared hook for loading studio member data from backend.
 * Supports studio mode (own studio) and admin mode (specific studio).
 *
 * @param {Object} options
 * @param {number|null} options.studioId - null = own studio, number = specific studio (admin)
 * @param {string} options.mode - "studio" or "admin"
 * @returns {{ data, updateData, isLoading, error, mode, studioId }}
 */
export function useStudioMembers({ studioId = null, mode = "studio" } = {}) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const dispatch = useDispatch();
  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)

      try {
        let members = []
        let services = []
        let appointments = []
        let appointmentTypes = []
        let freeAppointments = []
        let availableMembersLeads = []
        let memberHistory = []
        let memberRelations = []
        let relationOptions = []
        let staff = []
        let communicationSettings = []

        if (mode === "admin" && studioId) {
          // Admin: fetch data for a specific studio
          await fetch(`/api/admin/studios/${studioId}/members-data`)
          // const result = await res.json()
          // members = result.members || []
          // appointments = result.appointments || []
          // appointmentTypes = result.appointmentTypes || []
          // freeAppointments = result.freeAppointments || []
          // availableMembersLeads = result.availableMembersLeads || []
          // memberHistory = result.memberHistory || []
          // memberRelations = result.memberRelations || []
          // relationOptions = result.relationOptions || []
          // staff = result.staff || []
          // communicationSettings = result.communicationSettings || []
        } else {
          // Studio mode: fetch data for own studio
          const res = await dispatch(fetchMyStudio())

          members = res.members || []
          services = res.services || []
          // appointments = result.appointments || []
          // appointmentTypes = result.appointmentTypes || []
          // freeAppointments = result.freeAppointments || []
          // availableMembersLeads = result.availableMembersLeads || []
          // memberHistory = result.memberHistory || []
          // memberRelations = result.memberRelations || []
          // relationOptions = result.relationOptions || []
          // staff = result.staff || []
          // communicationSettings = result.communicationSettings || []
        }

        if (!cancelled) {
          setData({
            members,
            appointments,
            appointmentTypes,
            freeAppointments,
            availableMembersLeads,
            memberHistory,
            memberRelations,
            relationOptions,
            staff,
            services,
            communicationSettings,
          })
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load members data")
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [studioId, mode])

  /**
   * Update a section of the data for local state or future backend save.
   * Sections: "members", "appointments", "memberRelations", etc.
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