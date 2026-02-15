/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { X, Trash2 } from "lucide-react"
import DatePickerField from "../../shared/DatePickerField"
import CustomSelect from "../../shared/CustomSelect"

export function BonusTimeModal({ contract, onClose, onSubmit, onDelete }) {
  const existingBonus = contract?.bonusTime
  const isEditMode = !!existingBonus

  const [bonusAmount, setBonusAmount] = useState(existingBonus?.bonusAmount || 1)
  const [bonusUnit, setBonusUnit] = useState(existingBonus?.bonusUnit || "days")
  const [withExtension, setWithExtension] = useState(
    existingBonus
      ? (existingBonus.withExtension ? "With Contract extension" : "Without Contract extension")
      : "Without Contract extension"
  )
  const [reason, setReason] = useState(existingBonus?.reason || "")
  const [startOption, setStartOption] = useState(existingBonus?.startOption || "current_contract_period")
  const [startDate, setStartDate] = useState(existingBonus?.startDate || "")
  const [bonusPeriod, setBonusPeriod] = useState(existingBonus?.bonusPeriod || "")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Calculate and update bonus period whenever relevant values change
  useEffect(() => {
    setBonusPeriod(calculateBonusPeriod())
  }, [startOption, startDate, bonusAmount, bonusUnit])

  // Calculate bonus period end date
  const calculateBonusPeriod = () => {
    if (startOption === "fixed_time" && startDate) {
      // For fixed time option
      const start = new Date(startDate)
      const end = new Date(start)

      // Add bonus duration based on amount and unit
      applyDurationToDate(end, bonusAmount, bonusUnit)

      // Format dates to local date string
      return `${formatDate(start)} - ${formatDate(end)}`
    } else if (startOption === "current_contract_period" && contract?.endDate) {
      // For end of contract period option
      const start = new Date(contract.endDate)
      const end = new Date(start)

      // Add bonus duration based on amount and unit
      applyDurationToDate(end, bonusAmount, bonusUnit)

      // Format dates to local date string
      return `${formatDate(start)} - ${formatDate(end)}`
    }

    return ""
  }

  // Helper function to apply duration to a date
  const applyDurationToDate = (date, amount, unit) => {
    switch (unit) {
      case "days":
        date.setDate(date.getDate() + amount)
        break
      case "weeks":
        date.setDate(date.getDate() + amount * 7)
        break
      case "months":
        date.setMonth(date.getMonth() + amount)
        break
    }
    return date
  }

  // Format date helper
  const formatDate = (date) =>
    date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      id: existingBonus?.id || `bt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      contractId: contract.id,
      bonusAmount,
      bonusUnit,
      withExtension: withExtension === "With Contract extension",
      reason,
      startOption,
      startDate: startOption === "fixed_time" ? startDate : null,
      bonusPeriod: bonusPeriod || "",
      createdAt: existingBonus?.createdAt || new Date().toISOString().split("T")[0],
    })
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
          <div className="bg-surface-card rounded-2xl w-full max-w-sm p-6 mx-4 shadow-xl border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent-red/20 rounded-xl flex items-center justify-center">
                <Trash2 className="text-accent-red" size={20} />
              </div>
              <div>
                <h3 className="text-content-primary text-lg font-semibold">Remove Bonus Time</h3>
              </div>
            </div>
            <p className="text-content-secondary mb-6 text-sm">
              Are you sure you want to remove the bonus time from this contract?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-surface-dark text-sm text-content-primary rounded-xl border border-border hover:bg-surface-dark transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-accent-red text-sm text-white rounded-xl hover:bg-accent-red/80 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-surface-base rounded-2xl w-full max-w-lg relative overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl text-content-primary font-semibold">
              {isEditMode ? "Edit Bonus Time" : "Add Bonus Time"}
            </h3>
            <button onClick={onClose} className="text-content-muted hover:text-content-primary transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-content-secondary text-sm mb-2">Reason for Bonus Time</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for bonus time"
                className="bg-surface-dark text-content-primary text-sm px-3 py-2 rounded-xl border border-border w-full focus:outline-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-content-secondary text-sm mb-2">Start of Bonus Time</label>
              <CustomSelect
                name="startOption"
                value={startOption}
                onChange={(e) => setStartOption(e.target.value)}
                options={[
                  { value: "current_contract_period", label: "End of the current Contract period" },
                  { value: "fixed_time", label: "Fixed time" },
                ]}
                className="mb-2"
              />

              {startOption === "fixed_time" && (
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <div className="flex items-center bg-surface-dark rounded-xl px-3 py-2 border border-border">
                      <span className={`flex-1 text-sm ${startDate ? 'text-content-primary' : 'text-content-muted'}`}>
                        {startDate ? new Date(startDate + 'T00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Select date'}
                      </span>
                      <DatePickerField
                        value={startDate}
                        onChange={(val) => setStartDate(val)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 w-1/2">
                    <input
                      type="number"
                      min="1"
                      value={bonusAmount}
                      onChange={(e) => setBonusAmount(Number.parseInt(e.target.value))}
                      className="bg-surface-dark text-content-primary text-sm px-3 py-2 rounded-xl border border-border w-1/3 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <CustomSelect
                      name="bonusUnit"
                      value={bonusUnit}
                      onChange={(e) => setBonusUnit(e.target.value)}
                      options={[
                        { value: "days", label: "Days" },
                        { value: "weeks", label: "Weeks" },
                        { value: "months", label: "Months" },
                      ]}
                      className="w-2/3"
                    />
                  </div>
                </div>
              )}

              {/* Duration selection for "End of the current Contract period" */}
              {startOption === "current_contract_period" && (
                <div className="flex gap-2 mt-2">
                  <div className="flex gap-2 w-full">
                    <input
                      type="number"
                      min="1"
                      value={bonusAmount}
                      onChange={(e) => setBonusAmount(Number.parseInt(e.target.value))}
                      className="bg-surface-dark text-content-primary text-sm px-3 py-2 rounded-xl border border-border w-1/3 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <CustomSelect
                      name="bonusUnit"
                      value={bonusUnit}
                      onChange={(e) => setBonusUnit(e.target.value)}
                      options={[
                        { value: "days", label: "Days" },
                        { value: "weeks", label: "Weeks" },
                        { value: "months", label: "Months" },
                      ]}
                      className="w-2/3"
                    />
                  </div>
                </div>
              )}

              {/* Show bonus period for both options when available */}
              {bonusPeriod && <div className="mt-2 text-sm text-content-muted">Bonus Period: {bonusPeriod}</div>}
            </div>
            <div>
              <label className="block text-content-secondary text-sm mb-2">Contract Extension</label>
              <CustomSelect
                name="withExtension"
                value={withExtension}
                onChange={(e) => setWithExtension(e.target.value)}
                options={[
                  { value: "Without Contract extension", label: "Without Contract extension" },
                  { value: "With Contract extension", label: "With Contract extension" },
                ]}
              />
            </div>
            <div className="flex justify-between items-center gap-2 mt-8 pt-4 border-t border-border">
              {/* Delete button - only shown in edit mode */}
              {isEditMode ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-surface-dark text-sm text-accent-red rounded-xl border border-border hover:bg-accent-red/10 hover:border-accent-red/50 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              ) : (
                <div />
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-surface-dark text-sm text-content-primary rounded-xl border border-border hover:bg-surface-dark transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-sm text-white rounded-xl hover:bg-primary-hover transition-colors"
                >
                  {isEditMode ? "Update Bonus Time" : "Add Bonus Time"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
