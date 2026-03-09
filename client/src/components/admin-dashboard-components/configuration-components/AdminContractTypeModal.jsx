import { useState, useEffect, useRef } from "react"
import {
  X,
  Info,
  Check,
  ChevronDown,
  Shield,
} from "lucide-react"

// ============================================
// Inline helper components (Admin dark theme)
// ============================================

const Toggle = ({ label, checked, onChange, helpText }) => (
  <div className="flex items-start justify-between gap-4">
    <div className="flex-1">
      <span className="text-sm font-medium text-white">{label}</span>
      {helpText && <p className="text-xs text-gray-500 mt-0.5">{helpText}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
        checked ? "bg-orange-500" : "bg-[#333333]"
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  </div>
)

const Tooltip = ({ children, content, position = "left" }) => (
  <div className="relative group inline-flex">
    {children}
    <div className={`absolute top-full mt-2 px-3 py-2 bg-[#2F2F2F] text-gray-300 text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] w-64 border border-[#444444] shadow-xl pointer-events-none ${position === "right" ? "right-0" : "left-0"}`}>
      <div className="break-words leading-relaxed">{content}</div>
    </div>
  </div>
)

const AdminSelect = ({ value, onChange, options, placeholder, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedOption = options.find((opt) => String(opt.value) === String(value))

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-orange-500 flex items-center justify-between ${className}`}
      >
        <span className={selectedOption ? "text-white" : "text-gray-500"}>
          {selectedOption?.label || placeholder || "Select..."}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[#1F1F1F] border border-[#333333] rounded-xl shadow-lg max-h-60 overflow-hidden">
          <div className="overflow-y-auto max-h-48">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  String(opt.value) === String(value)
                    ? "bg-orange-500/20 text-orange-400"
                    : "text-gray-300 hover:bg-[#2A2A2A] hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// AdminContractTypeModal
// ============================================
const AdminContractTypeModal = ({
  isOpen,
  onClose,
  editingContractType,
  setEditingContractType,
  editingContractTypeIndex,
  contractForms,
  accessTemplates = [],
  currency = "€",
  onSave,
}) => {
  if (!isOpen || !editingContractType) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/50 overflow-hidden">
      <div className="bg-[#1A1A1A] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl border border-[#333333] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#333333] flex-shrink-0">
          <h3 className="text-lg font-semibold text-white">
            {editingContractTypeIndex !== null ? 'Edit Contract Type' : 'New Contract Type'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="p-4 overflow-y-auto overflow-x-hidden flex-1 space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              Contract Name
              <span className="text-red-400">*</span>
              <Tooltip content="The name of this contract type that members will see when signing up">
                <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
              </Tooltip>
            </label>
            <input
              type="text"
              value={editingContractType.name}
              onChange={(e) => setEditingContractType({ ...editingContractType, name: e.target.value })}
              placeholder="e.g., Premium Membership"
              className="w-full bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-orange-500"
            />
          </div>
          
          {/* Price & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                Cost
                <span className="text-red-400">*</span>
                <Tooltip content="The price charged to the member per billing period (weekly, monthly, or annually)">
                  <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
                </Tooltip>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={editingContractType.cost}
                  onChange={(e) => setEditingContractType({ ...editingContractType, cost: Number(e.target.value) })}
                  min={0}
                  className="flex-1 min-w-0 bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-orange-500"
                />
                <span className="text-gray-400 flex-shrink-0">{currency}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                Minimum Duration
                <span className="text-red-400">*</span>
                <Tooltip content="The minimum commitment period. After this period, the contract can be renewed or terminated." position="right">
                  <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
                </Tooltip>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={editingContractType.duration}
                  onChange={(e) => setEditingContractType({ ...editingContractType, duration: Number(e.target.value) })}
                  min={1} max={60}
                  className="flex-1 min-w-0 bg-[#141414] text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-orange-500"
                />
                <span className="text-gray-400 flex-shrink-0">months</span>
              </div>
            </div>
          </div>
          
          {/* Billing Period (full width, no contingent) */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              Billing Period
              <span className="text-red-400">*</span>
              <Tooltip content="How often the member is charged. The cost above is charged once per billing period.">
                <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
              </Tooltip>
            </label>
            <AdminSelect
              value={editingContractType.billingPeriod}
              onChange={(v) => setEditingContractType({ ...editingContractType, billingPeriod: v })}
              options={[
                { value: "weekly", label: "Weekly" },
                { value: "monthly", label: "Monthly" },
                { value: "annually", label: "Annually" }
              ]}
            />
          </div>

          {/* Access Template */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              Access Template
              <Tooltip content="Link an access template to this contract type. Members with this contract will automatically receive the permissions defined in the selected template.">
                <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
              </Tooltip>
            </label>
            {accessTemplates.length === 0 ? (
              <div className="p-3 bg-[#141414] rounded-xl border border-yellow-500/30">
                <p className="text-sm text-yellow-400">No access templates available.</p>
                <p className="text-xs text-gray-500 mt-1">Create access templates in the &quot;Access Templates&quot; section first.</p>
              </div>
            ) : (
              <>
                <AdminSelect
                  value={editingContractType.accessTemplateId || ""}
                  onChange={(v) => setEditingContractType({ ...editingContractType, accessTemplateId: v ? Number(v) : null })}
                  options={[
                    { value: "", label: "No template linked" },
                    ...accessTemplates.map(t => ({ value: t.id, label: t.name }))
                  ]}
                  placeholder="Select an access template..."
                />
                {/* Show selected template info */}
                {editingContractType.accessTemplateId && (() => {
                  const linked = accessTemplates.find(t => String(t.id) === String(editingContractType.accessTemplateId))
                  if (!linked) return null
                  return (
                    <div className="flex items-center gap-2 px-3 py-2 bg-[#141414] rounded-lg border border-[#333333]">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${linked.color || '#f97316'}20` }}
                      >
                        <Shield className="w-3 h-3" style={{ color: linked.color || '#f97316' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-white font-medium">{linked.name}</span>
                        {linked.description && (
                          <p className="text-xs text-gray-500 truncate">{linked.description}</p>
                        )}
                      </div>
                    </div>
                  )
                })()}
              </>
            )}
          </div>
          
          {/* Contract Form */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              Contract Form
              <span className="text-red-400">*</span>
              <Tooltip content="The document template used when a member signs this contract. Create forms in the 'Contract Forms' section.">
                <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
              </Tooltip>
            </label>
            {contractForms.length === 0 ? (
              <div className="p-3 bg-[#141414] rounded-xl border border-yellow-500/30">
                <p className="text-sm text-yellow-400">No contract forms available.</p>
                <p className="text-xs text-gray-500 mt-1">Please create a contract form first in the &quot;Contract Forms&quot; section.</p>
              </div>
            ) : (
              <AdminSelect
                value={editingContractType.contractFormId || ""}
                onChange={(v) => setEditingContractType({ ...editingContractType, contractFormId: v ? Number(v) : null })}
                options={contractForms.map(f => ({ value: f.id, label: f.name }))}
                placeholder="Select a form..."
              />
            )}
          </div>
          
          {/* Notice Period */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              Notice Period
              <Tooltip content="How many days before the contract end date the member must cancel. After this deadline, the contract will auto-renew (if enabled).">
                <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
              </Tooltip>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={editingContractType.cancellationPeriod}
                onChange={(e) => setEditingContractType({ ...editingContractType, cancellationPeriod: Number(e.target.value) })}
                min={0}
                className="w-20 sm:w-24 bg-[#141414] text-white rounded-xl px-3 sm:px-4 py-2.5 text-sm outline-none border border-[#333333] focus:border-orange-500"
              />
              <span className="text-gray-400 text-sm">days before end</span>
            </div>
          </div>
          
          {/* Auto Renewal Section */}
          <div className="p-4 bg-[#141414] rounded-xl space-y-4">
            <Toggle
              label="Automatic Renewal"
              checked={editingContractType.autoRenewal}
              onChange={(v) => setEditingContractType({ ...editingContractType, autoRenewal: v })}
              helpText="Contract continues automatically after the minimum duration ends"
            />
            
            {editingContractType.autoRenewal && (
              <div className="space-y-4 pt-3 border-t border-[#333333]">
                {/* Renewal Duration */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    Renewal Duration
                    <Tooltip content="How long the contract continues after the minimum duration. Choose 'Indefinite' for an open-ended contract that runs until cancelled.">
                      <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
                    </Tooltip>
                  </label>
                  <div className="flex items-center gap-2">
                    <AdminSelect
                      value={editingContractType.renewalIndefinite ? "indefinite" : "fixed"}
                      onChange={(v) => setEditingContractType({ 
                        ...editingContractType, 
                        renewalIndefinite: v === "indefinite"
                      })}
                      options={[
                        { value: "fixed", label: "Fixed period" },
                        { value: "indefinite", label: "Indefinite" }
                      ]}
                    />
                    {!editingContractType.renewalIndefinite && (
                      <>
                        <input
                          type="number"
                          value={editingContractType.renewalPeriod}
                          onChange={(e) => setEditingContractType({ ...editingContractType, renewalPeriod: Number(e.target.value) })}
                          min={1}
                          className="w-20 min-w-0 bg-[#141414] text-white rounded-xl px-3 py-2.5 text-sm outline-none border border-[#333333] focus:border-orange-500"
                        />
                        <AdminSelect
                          value={editingContractType.renewalPeriodUnit || "months"}
                          onChange={(v) => setEditingContractType({ ...editingContractType, renewalPeriodUnit: v })}
                          options={[
                            { value: "days", label: "Days" },
                            { value: "weeks", label: "Weeks" },
                            { value: "months", label: "Months" }
                          ]}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Price After Renewal */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    Price After Renewal
                    <Tooltip content="The new price per billing period after the contract renews.">
                      <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
                    </Tooltip>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={editingContractType.renewalPrice}
                      onChange={(e) => setEditingContractType({ ...editingContractType, renewalPrice: Number(e.target.value) })}
                      min={0}
                      className="w-32 bg-[#141414] text-white rounded-xl px-3 py-2.5 text-sm outline-none border border-[#333333] focus:border-orange-500"
                    />
                    <span className="text-gray-400 flex-shrink-0">{currency}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="flex gap-3 p-4 border-t border-[#333333] flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-[#2F2F2F] text-white text-sm font-medium rounded-xl hover:bg-[#3A3A3A] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 px-4 py-2.5 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            {editingContractTypeIndex !== null ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminContractTypeModal
