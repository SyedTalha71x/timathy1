import { useState, useEffect } from "react"

// ============================================
// Import all static defaults (current data source)
// When backend is ready, replace loadContractsFromDefaults()
// with an API call — nothing else changes.
// ============================================
import {
  contractHistory as contractHistoryData,
  initialContracts,
  sampleLeads,
} from "../utils/studio-states/contract-states"

import { DEFAULT_CONTRACT_TYPES } from "../utils/studio-states/configuration-states"
import { leadsData } from "../utils/studio-states/leads-states"
import { membersData } from "../utils/studio-states"

import {
  studioContractsData,
  studioContractHistoryData,
  studioMembersData,
} from "../utils/admin-panel-states/customers-states"

/**
 * Loads contract data from static default files.
 * This is the ONLY function that needs to change when
 * the backend is ready.
 *
 * @param {Object} options
 * @param {number|null} options.studioId - null = own studio, number = specific studio (admin)
 * @param {string} options.mode - "studio" or "admin"
 * @returns {Object} Normalized contract data object
 */
function loadContractsFromDefaults({ studioId, mode }) {
  if (mode === "admin" && studioId !== null) {
    // ========================================
    // ADMIN MODE: Load per-studio data keyed by studioId
    // FUTURE:
    //   const res = await fetch(`/api/admin/studios/${studioId}/contracts`)
    //   return await res.json()
    // ========================================
    return {
      contracts: studioContractsData[studioId] || [],
      contractHistory: studioContractHistoryData[studioId] || [],
      leads: sampleLeads || [],
      members: studioMembersData[studioId] || [],
      contractTypes: DEFAULT_CONTRACT_TYPES || [],
    }
  }

  // ========================================
  // STUDIO MODE: Load own studio data
  // FUTURE:
  //   const res = await fetch(`/api/studio/contracts`)
  //   return await res.json()
  // ========================================
  return {
    contracts: initialContracts || [],
    contractHistory: contractHistoryData || [],
    leads: leadsData || [],
    members: membersData || [],
    contractTypes: DEFAULT_CONTRACT_TYPES || [],
  }
}

/**
 * Shared hook for loading studio contract data.
 * Used by both the Studio Panel and Admin Panel.
 *
 * @param {Object} options
 * @param {number|null} options.studioId - null = own studio, number = specific studio (admin mode)
 * @param {string} options.mode - "studio" or "admin"
 * @returns {{ data, updateData, isLoading, error, mode, studioId }}
 */
export function useStudioContracts({ studioId = null, mode = "studio" } = {}) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)

      try {
        const result = loadContractsFromDefaults({ studioId, mode })

        // Simulate tiny async delay (remove when using real API)
        await new Promise((r) => setTimeout(r, 50))

        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load contract data")
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
