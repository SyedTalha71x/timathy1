import {
  X,
  Info,
  Check,
} from "lucide-react"
import CustomSelect from "../../shared/CustomSelect"

// ============================================
// Inline helper components
// ============================================

const Toggle = ({ label, checked, onChange, helpText }) => (
  <div className="flex items-start justify-between gap-4">
    <div className="flex-1">
      <span className="text-sm font-medium text-content-primary">{label}</span>
      {helpText && <p className="text-xs text-content-faint mt-0.5">{helpText}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
        checked ? "bg-primary" : "bg-surface-button"
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
    <div className={`absolute top-full mt-2 px-3 py-2 bg-surface-hover text-content-secondary text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] w-64 border border-border shadow-xl pointer-events-none ${position === "right" ? "right-0" : "left-0"}`}>
      <div className="break-words leading-relaxed">{content}</div>
    </div>
  </div>
)

// ============================================
// ContractTypeModal
// ============================================
const ContractTypeModal = ({
  isOpen,
  onClose,
  editingContractType,
  setEditingContractType,
  editingContractTypeIndex,
  contractForms,
  currency,
  onSave,
}) => {
  if (!isOpen || !editingContractType) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/50 overflow-hidden">
      <div className="bg-surface-base rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl border border-border flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <h3 className="text-lg font-semibold text-content-primary">
            {editingContractTypeIndex !== null ? 'Edit Contract Type' : 'New Contract Type'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="p-4 overflow-y-auto overflow-x-hidden flex-1 space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
              Contract Name
              <span className="text-red-400">*</span>
              <Tooltip content="The name of this contract type that members will see when signing up">
                <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
              </Tooltip>
            </label>
            <input
              type="text"
              value={editingContractType.name}
              onChange={(e) => setEditingContractType({ ...editingContractType, name: e.target.value })}
              placeholder="e.g., Premium Membership"
              className="w-full bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
            />
          </div>
          
          {/* Price & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                Cost
                <span className="text-red-400">*</span>
                <Tooltip content="The price charged to the member per billing period (weekly, monthly, or annually)">
                  <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                </Tooltip>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={editingContractType.cost}
                  onChange={(e) => setEditingContractType({ ...editingContractType, cost: Number(e.target.value) })}
                  min={0}
                  className="flex-1 min-w-0 bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                />
                <span className="text-content-muted flex-shrink-0">{currency}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                Minimum Duration
                <span className="text-red-400">*</span>
                <Tooltip content="The minimum commitment period. After this period, the contract can be renewed or terminated." position="right">
                  <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                </Tooltip>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={editingContractType.duration}
                  onChange={(e) => setEditingContractType({ ...editingContractType, duration: Number(e.target.value) })}
                  min={1} max={60}
                  className="flex-1 min-w-0 bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                />
                <span className="text-content-muted flex-shrink-0">months</span>
              </div>
            </div>
          </div>
          
          {/* Billing & Contingent */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                Billing Period
                <span className="text-red-400">*</span>
                <Tooltip content="How often the member is charged. The cost above is charged once per billing period.">
                  <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                </Tooltip>
              </label>
              <CustomSelect
                name="billingPeriod"
                value={editingContractType.billingPeriod}
                onChange={(e) => setEditingContractType({ ...editingContractType, billingPeriod: e.target.value })}
                options={[
                  { value: "weekly", label: "Weekly" },
                  { value: "monthly", label: "Monthly" },
                  { value: "annually", label: "Annually" }
                ]}
                className="bg-surface-card px-4 py-2.5 border-border"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                Contingent
                <span className="text-red-400">*</span>
                <Tooltip content="The number of appointment credits members receive per billing period. Each appointment type deducts from this contingent based on its 'Contingent Usage' setting. Set to 0 for unlimited." position="right">
                  <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                </Tooltip>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={editingContractType.userCapacity}
                  onChange={(e) => setEditingContractType({ ...editingContractType, userCapacity: Number(e.target.value) })}
                  min={0}
                  placeholder="0 = Unlimited"
                  className="flex-1 min-w-0 bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                />
                <span className="text-content-muted flex-shrink-0">credits</span>
              </div>
            </div>
          </div>
          
          {/* Contract Form */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
              Contract Form
              <span className="text-red-400">*</span>
              <Tooltip content="The document template used when a member signs this contract. Create forms in the 'Contract Forms' section.">
                <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
              </Tooltip>
            </label>
            {contractForms.length === 0 ? (
              <div className="p-3 bg-surface-card rounded-xl border border-yellow-500/30">
                <p className="text-sm text-yellow-400">No contract forms available.</p>
                <p className="text-xs text-content-faint mt-1">Please create a contract form first in the &quot;Contract Forms&quot; section.</p>
              </div>
            ) : (
              <CustomSelect
                name="contractFormId"
                value={editingContractType.contractFormId || ""}
                onChange={(e) => setEditingContractType({ ...editingContractType, contractFormId: e.target.value ? Number(e.target.value) : null })}
                options={contractForms.map(f => ({ value: f.id, label: f.name }))}
                placeholder="Select a form..."
                className="bg-surface-card px-4 py-2.5 border-border"
              />
            )}
          </div>
          
          {/* Notice Period */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
              Notice Period
              <Tooltip content="How many days before the contract end date the member must cancel. After this deadline, the contract will auto-renew (if enabled).">
                <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
              </Tooltip>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={editingContractType.cancellationPeriod}
                onChange={(e) => setEditingContractType({ ...editingContractType, cancellationPeriod: Number(e.target.value) })}
                min={0}
                className="w-20 sm:w-24 bg-surface-card text-content-primary rounded-xl px-3 sm:px-4 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
              />
              <span className="text-content-muted text-sm">days before end</span>
            </div>
          </div>
          
          {/* Auto Renewal Section */}
          <div className="p-4 bg-surface-card rounded-xl space-y-4">
            <Toggle
              label="Automatic Renewal"
              checked={editingContractType.autoRenewal}
              onChange={(v) => setEditingContractType({ ...editingContractType, autoRenewal: v })}
              helpText="Contract continues automatically after the minimum duration ends"
            />
            
            {editingContractType.autoRenewal && (
              <div className="space-y-4 pt-3 border-t border-border">
                {/* Renewal Duration */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                    Renewal Duration
                    <Tooltip content="How long the contract continues after the minimum duration. Choose 'Indefinite' for an open-ended contract that runs until cancelled.">
                      <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                    </Tooltip>
                  </label>
                  <div className="flex items-center gap-2">
                    <CustomSelect
                      name="renewalType"
                      value={editingContractType.renewalIndefinite ? "indefinite" : "fixed"}
                      onChange={(e) => setEditingContractType({ 
                        ...editingContractType, 
                        renewalIndefinite: e.target.value === "indefinite"
                      })}
                      options={[
                        { value: "fixed", label: "Fixed period" },
                        { value: "indefinite", label: "Indefinite" }
                      ]}
                      className={`bg-surface-card px-3 py-2.5 border-border ${editingContractType.renewalIndefinite ? 'flex-1' : ''}`}
                    />
                    {!editingContractType.renewalIndefinite && (
                      <>
                        <input
                          type="number"
                          value={editingContractType.renewalPeriod}
                          onChange={(e) => setEditingContractType({ ...editingContractType, renewalPeriod: Number(e.target.value) })}
                          min={1}
                          className="w-20 min-w-0 bg-surface-card text-content-primary rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                        />
                        <CustomSelect
                          name="renewalPeriodUnit"
                          value={editingContractType.renewalPeriodUnit || "months"}
                          onChange={(e) => setEditingContractType({ ...editingContractType, renewalPeriodUnit: e.target.value })}
                          options={[
                            { value: "days", label: "Days" },
                            { value: "weeks", label: "Weeks" },
                            { value: "months", label: "Months" }
                          ]}
                          className="bg-surface-card px-3 py-2.5 border-border"
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Price After Renewal */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
                    Price After Renewal
                    <Tooltip content="The new price per billing period after the contract renews.">
                      <Info className="w-3.5 h-3.5 text-content-faint hover:text-content-secondary cursor-help" />
                    </Tooltip>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={editingContractType.renewalPrice}
                      onChange={(e) => setEditingContractType({ ...editingContractType, renewalPrice: Number(e.target.value) })}
                      min={0}
                      className="w-32 bg-surface-card text-content-primary rounded-xl px-3 py-2.5 text-sm outline-none border border-border focus:border-accent-blue"
                    />
                    <span className="text-content-muted flex-shrink-0">{currency}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="flex gap-3 p-4 border-t border-border flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-surface-button text-content-primary text-sm font-medium rounded-xl hover:bg-surface-button-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            {editingContractTypeIndex !== null ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContractTypeModal
