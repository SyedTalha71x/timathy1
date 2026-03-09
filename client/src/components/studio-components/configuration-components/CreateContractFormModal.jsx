// ============================================
// CreateContractFormModal
// Small modal for entering a new contract form name
// ============================================
const CreateContractFormModal = ({
  isOpen,
  onClose,
  value,
  onChange,
  onSubmit,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-hover rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-lg font-bold text-content-primary mb-4">Create New Contract Form</h3>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-content-secondary flex items-center gap-2">
            Contract Form Name
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter contract form name"
            className="w-full bg-surface-card text-content-primary rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-primary"
          />
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-surface-button text-content-primary text-sm rounded-xl hover:bg-surface-button-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 px-4 py-2.5 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateContractFormModal
