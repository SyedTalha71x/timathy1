import { useState, useEffect } from "react"

// ============================================
// Import all static defaults (current data source)
// When backend is ready, replace loadFinancesFromDefaults()
// with an API call — nothing else changes.
// ============================================
import { financialData } from "../utils/studio-states/finance-states"

import {
  studioFinanceData,
} from "../utils/admin-panel-states/customers-states"

/**
 * Loads finance data from static default files.
 *
 * @param {Object} options
 * @param {number|null} options.studioId - null = own studio, number = specific studio (admin)
 * @param {string} options.mode - "studio" or "admin"
 * @returns {Object} Normalized finance data object
 */
function loadFinancesFromDefaults({ studioId, mode }) {
  if (mode === "admin" && studioId !== null) {
    // ========================================
    // ADMIN MODE: Load per-studio data keyed by studioId
    // FUTURE:
    //   const res = await fetch(`/api/admin/studios/${studioId}/finances`)
    //   return await res.json()
    // ========================================
    return {
      financialData: studioFinanceData[studioId] || studioFinanceData || {},
    }
  }

  // ========================================
  // STUDIO MODE: Load own studio data
  // FUTURE:
  //   const res = await fetch(`/api/studio/finances`)
  //   return await res.json()
  // ========================================
  return {
    financialData: financialData || {},
  }
}

/**
 * Shared hook for loading studio finance data.
 * Used by both the Studio Panel and Admin Panel.
 *
 * @param {Object} options
 * @param {number|null} options.studioId - null = own studio, number = specific studio (admin mode)
 * @param {string} options.mode - "studio" or "admin"
 * @returns {{ data, updateData, isLoading, error, mode, studioId }}
 */
export function useStudioFinances({ studioId = null, mode = "studio" } = {}) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)

      try {
        const result = loadFinancesFromDefaults({ studioId, mode })

        // Simulate tiny async delay (remove when using real API)
        await new Promise((r) => setTimeout(r, 50))

        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load finance data")
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
