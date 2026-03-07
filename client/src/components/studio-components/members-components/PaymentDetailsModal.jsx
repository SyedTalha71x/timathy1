/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { X, AlertTriangle, CreditCard, Loader2, CheckCircle2, PenTool, Smartphone, FileText } from "lucide-react"

// ============================================
// Signature Modal (only sub-modal in this file)
// ============================================
function SignatureModal({ isOpen, onClose, onSignComplete, onSkip, memberName }) {
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const isDrawingRef = useRef(false)
  const [hasSignature, setHasSignature] = useState(false)

  // Canvas initialization — matches working medical-history-form-modal approach
  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const timer = setTimeout(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        // Read current CSS dimensions before changing anything
        const w = canvas.offsetWidth
        const h = canvas.offsetHeight

        // Set high-res internal resolution (2x for retina)
        canvas.width = w * 2
        canvas.height = h * 2

        // Lock CSS display size so canvas doesn't jump
        canvas.style.width = `${w}px`
        canvas.style.height = `${h}px`

        const context = canvas.getContext("2d")
        context.scale(2, 2)
        context.lineCap = "round"
        context.strokeStyle = "#000000"
        context.lineWidth = 2
        contextRef.current = context
      }, 150)
      return () => clearTimeout(timer)
    } else {
      setHasSignature(false)
      isDrawingRef.current = false
    }
  }, [isOpen])

  const getPos = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width) / 2,
      y: (clientY - rect.top) * (canvas.height / rect.height) / 2,
    }
  }

  // Use refs for drawing state so callbacks always see current value
  // (avoids React re-render race condition with useCallback + state)
  const startDrawing = (e) => {
    if (!contextRef.current) return
    const { x, y } = getPos(e)
    contextRef.current.beginPath()
    contextRef.current.moveTo(x, y)
    isDrawingRef.current = true
  }

  const draw = (e) => {
    if (!isDrawingRef.current || !contextRef.current) return
    const { x, y } = getPos(e)
    contextRef.current.lineTo(x, y)
    contextRef.current.stroke()
  }

  const stopDrawing = () => {
    if (isDrawingRef.current && contextRef.current) {
      contextRef.current.closePath()
      isDrawingRef.current = false
      if (canvasRef.current) {
        setHasSignature(true)
      }
    }
  }

  const getSignatureData = () => {
    return canvasRef.current ? canvasRef.current.toDataURL() : ""
  }

  const clearSignature = () => {
    if (!canvasRef.current) return
    const context = canvasRef.current.getContext("2d")
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    setHasSignature(false)
  }

  const handleSign = () => {
    const data = getSignatureData()
    if (data && hasSignature) {
      onSignComplete(data)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/60 flex items-center justify-center z-[1002]" style={{ backdropFilter: "blur(4px)" }}>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .sig-animate-in { animation: fadeSlideUp 0.25s ease-out; }
      `}</style>
      <div className="bg-surface-base rounded-2xl w-full max-w-lg relative overflow-hidden mx-4 sig-animate-in">
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <PenTool className="text-primary" size={20} />
              </div>
              <div>
                <h3 className="text-lg text-content-primary font-semibold">SEPA Mandate Signature</h3>
                <p className="text-xs text-content-muted">Authorize direct debit</p>
              </div>
            </div>
            <button onClick={onClose} className="text-content-muted hover:text-content-primary transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-content-secondary mb-5 leading-relaxed">
            A signature is required to authorize the new SEPA direct debit mandate for <span className="font-medium text-content-primary">{memberName}</span>.
          </p>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-content-secondary">Draw signature</label>
              {hasSignature && (
                <button onClick={clearSignature} className="text-xs text-content-muted hover:text-content-primary transition-colors">
                  Clear
                </button>
              )}
            </div>
            <div className="bg-white border-2 border-border rounded-xl overflow-hidden">
              <canvas
                ref={canvasRef}
                className="w-full h-40 cursor-crosshair touch-none"
                style={{ backgroundColor: "#ffffff" }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={(e) => { e.preventDefault(); startDrawing(e) }}
                onTouchMove={(e) => { e.preventDefault(); draw(e) }}
                onTouchEnd={stopDrawing}
              />
            </div>
            <p className="text-content-muted text-xs mt-1.5">
              Use mouse or finger to sign in the box above.
            </p>
          </div>

          <div className="flex flex-col gap-2 mt-6">
            <button
              onClick={handleSign}
              disabled={!hasSignature}
              className={`w-full py-2.5 text-sm rounded-xl transition-colors flex items-center justify-center gap-2 font-medium ${
                hasSignature
                  ? "bg-primary text-white hover:bg-primary-hover"
                  : "bg-surface-dark text-content-muted border border-border cursor-not-allowed"
              }`}
            >
              <PenTool size={15} />
              Sign &amp; Confirm
            </button>

            <button
              onClick={onSkip}
              className="w-full py-2.5 text-sm rounded-xl bg-surface-dark text-content-secondary border border-border hover:bg-surface-card transition-colors flex items-center justify-center gap-2"
            >
              <Smartphone size={15} />
              Skip – Send to Member App
            </button>
          </div>

          <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mt-4">
            <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <span className="text-xs text-content-secondary leading-relaxed">
              If you skip, the member will receive a signature request in their app. The SEPA mandate PDF will <strong>not</strong> be stored in documents until the member has signed and confirmed.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Main Payment Details Modal
// ============================================
export default function PaymentDetailsModal({ member, onClose, onSave }) {
  const paymentData = member?.paymentDetails || {}

  const initialForm = useRef({
    accountHolderFirstName: paymentData.accountHolderFirstName || member?.firstName || "",
    accountHolderLastName: paymentData.accountHolderLastName || member?.lastName || "",
    iban: paymentData.iban || "",
    bic: paymentData.bic || "",
    bankName: paymentData.bankName || "",
    sepaMandateNumber: "",
  })

  const [form, setForm] = useState({ ...initialForm.current })

  const [autoGenerateMandate, setAutoGenerateMandate] = useState(true)
  const initialAutoGenerate = useRef(true)
  const [bankLookupStatus, setBankLookupStatus] = useState(null)

  // Signature flow
  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const [pendingFormData, setPendingFormData] = useState(null)

  const memberName = `${member?.firstName || ""} ${member?.lastName || ""}`.trim()

  const isComplete = form.accountHolderFirstName.trim() &&
    form.accountHolderLastName.trim() &&
    form.iban.replace(/\s/g, "").length >= 15 &&
    form.bic.trim() &&
    form.bankName.trim() &&
    (autoGenerateMandate || form.sepaMandateNumber.trim())

  const hasChanges = Object.keys(initialForm.current).some(
    key => form[key] !== initialForm.current[key]
  ) || autoGenerateMandate !== initialAutoGenerate.current

  const canSave = isComplete && hasChanges
  const lastLookedUpIban = useRef("")

  const generateMandateNumber = () => {
    const prefix = "SEPA"
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substr(2, 5).toUpperCase()
    return `${prefix}-${timestamp}-${random}`
  }

  // Auto-fill BIC and bank name via OpenIBAN API
  useEffect(() => {
    const cleaned = form.iban.replace(/\s/g, "").toUpperCase()

    if (cleaned.length < 15 || cleaned === lastLookedUpIban.current) {
      if (cleaned.length < 15) setBankLookupStatus(null)
      return
    }

    setBankLookupStatus("loading")

    const controller = new AbortController()
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://openiban.com/validate/${encodeURIComponent(cleaned)}?getBIC=true&validateBankCode=true`,
          { signal: controller.signal }
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        lastLookedUpIban.current = cleaned
        if (data.valid && data.bankData) {
          setForm(prev => ({
            ...prev,
            bic: data.bankData.bic || prev.bic,
            bankName: data.bankData.name || prev.bankName,
          }))
          setBankLookupStatus("success")
        } else {
          setForm(prev => ({ ...prev, bic: "", bankName: "" }))
          setBankLookupStatus("error")
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.warn("Bank lookup failed:", err)
          setForm(prev => ({ ...prev, bic: "", bankName: "" }))
          setBankLookupStatus("error")
        }
      }
    }, 600)

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [form.iban])

  // Step 1: Save form → open signature modal
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSave) return

    const formData = {
      ...form,
      sepaMandateNumber: autoGenerateMandate ? generateMandateNumber() : form.sepaMandateNumber,
    }
    setPendingFormData(formData)
    setShowSignatureModal(true)
  }

  // Step 2a: Direct sign → save with signature, close, parent handles notification
  const handleSignComplete = (signatureData) => {
    const mandateDocument = {
      id: `doc-sepa-${Date.now()}`,
      name: `SEPA Mandate - ${memberName}`,
      type: "sepaMandate",
      size: "0.2 MB",
      uploadDate: new Date().toISOString().split("T")[0],
      section: "general",
      tags: [],
      signed: true,
      signature: signatureData,
      paymentDetails: pendingFormData,
      memberName,
    }

    onSave({
      ...pendingFormData,
      signatureStatus: "signed",
      signature: signatureData,
      mandatePdfGenerated: true,
      mandateDocument,
    })
    onClose()
  }

  // Step 2b: Skip signature → save without signature, close, parent handles notification
  const handleSkipSignature = () => {
    onSave({
      ...pendingFormData,
      signatureStatus: "pending",
      signature: null,
      mandatePdfGenerated: false,
    })
    onClose()
  }

  // Close signature modal without proceeding
  const handleSignatureModalClose = () => {
    setShowSignatureModal(false)
    setPendingFormData(null)
  }

  return (
    <>
      {/* Main Payment Form */}
      <div className="fixed inset-0 w-screen h-screen bg-black/50 flex items-center justify-center z-[1001]">
        <style>{`
          .primary-check { appearance: none; -webkit-appearance: none; width: 1rem; height: 1rem; border-radius: 0.25rem; border: 1px solid var(--color-border); background: var(--color-surface-card); cursor: pointer; flex-shrink: 0; }
          .primary-check:checked { background-color: var(--color-primary); border-color: var(--color-primary); background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E"); background-size: 100% 100%; background-position: center; background-repeat: no-repeat; }
          .primary-check:focus { outline: none; box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 40%, transparent); }
        `}</style>
        <div className="bg-surface-base rounded-2xl w-full max-w-lg relative overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <CreditCard className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="text-xl text-content-primary font-semibold">Payment Details</h3>
                  <p className="text-xs text-content-muted">{member?.firstName} {member?.lastName}</p>
                </div>
              </div>
              <button onClick={onClose} className="text-content-muted hover:text-content-primary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Account Holder */}
              <div>
                <label className="block text-content-secondary text-sm mb-2">Account Holder</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={form.accountHolderFirstName}
                    onChange={(e) => setForm({ ...form, accountHolderFirstName: e.target.value })}
                    placeholder="First Name"
                    className="bg-surface-dark text-content-primary text-sm px-3 py-2.5 rounded-xl border border-border w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    value={form.accountHolderLastName}
                    onChange={(e) => setForm({ ...form, accountHolderLastName: e.target.value })}
                    placeholder="Last Name"
                    className="bg-surface-dark text-content-primary text-sm px-3 py-2.5 rounded-xl border border-border w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* IBAN */}
              <div>
                <label className="block text-content-secondary text-sm mb-2">IBAN</label>
                <input
                  type="text"
                  value={form.iban}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^a-zA-Z0-9\s]/g, "").toUpperCase()
                    setBankLookupStatus(null)
                    lastLookedUpIban.current = ""
                    setForm(prev => ({ ...prev, iban: val, bic: "", bankName: "" }))
                  }}
                  placeholder=""
                  className="bg-surface-dark text-content-primary text-sm px-3 py-2.5 rounded-xl border border-border w-full focus:outline-none focus:ring-2 focus:ring-primary font-mono tracking-wider"
                />
              </div>

              {/* BIC */}
              <div>
                <label className="block text-content-secondary text-sm mb-2">BIC</label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.bic}
                    onChange={(e) => setForm({ ...form, bic: e.target.value.toUpperCase() })}
                    placeholder=""
                    disabled={bankLookupStatus === "success"}
                    className={`text-sm px-3 py-2.5 rounded-xl border border-border w-full focus:outline-none focus:ring-2 focus:ring-primary font-mono pr-8 ${bankLookupStatus === "success" ? "bg-surface-dark/50 text-content-muted cursor-not-allowed" : "bg-surface-dark text-content-primary"}`}
                  />
                  {bankLookupStatus === "loading" && (
                    <Loader2 size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-content-muted animate-spin" />
                  )}
                  {bankLookupStatus === "success" && (
                    <CheckCircle2 size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-500" />
                  )}
                </div>
              </div>

              {/* Bank Name */}
              <div>
                <label className="block text-content-secondary text-sm mb-2">Bank Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.bankName}
                    onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                    placeholder=""
                    disabled={bankLookupStatus === "success"}
                    className={`text-sm px-3 py-2.5 rounded-xl border border-border w-full focus:outline-none focus:ring-2 focus:ring-primary pr-8 ${bankLookupStatus === "success" ? "bg-surface-dark/50 text-content-muted cursor-not-allowed" : "bg-surface-dark text-content-primary"}`}
                  />
                  {bankLookupStatus === "loading" && (
                    <Loader2 size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-content-muted animate-spin" />
                  )}
                  {bankLookupStatus === "success" && (
                    <CheckCircle2 size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-500" />
                  )}
                </div>
              </div>

              {/* SEPA Mandate */}
              <div>
                <label className="block text-content-secondary text-sm mb-2">SEPA Mandate Number</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoGenerateMandate}
                    onChange={() => setAutoGenerateMandate(!autoGenerateMandate)}
                    className="primary-check"
                  />
                  <span className="text-content-secondary text-xs">Automatically generate SEPA mandate reference number</span>
                </label>
                {!autoGenerateMandate && (
                  <input
                    type="text"
                    value={form.sepaMandateNumber}
                    onChange={(e) => setForm({ ...form, sepaMandateNumber: e.target.value })}
                    placeholder=""
                    className="w-full mt-2 bg-surface-dark text-content-primary text-sm px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                )}
                <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mt-3">
                  <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-content-secondary leading-relaxed">
                    Updating bank details requires a new SEPA mandate to be issued and signed.
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end items-center gap-2 mt-8 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-surface-dark text-sm text-content-primary rounded-xl border border-border hover:bg-surface-card transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSave}
                  className={`px-4 py-2 text-sm rounded-xl transition-colors flex items-center gap-2 ${canSave ? "bg-primary text-white hover:bg-primary-hover" : "bg-surface-dark text-content-muted border border-border cursor-not-allowed"}`}
                >
                  <FileText size={14} />
                  Save &amp; Sign Mandate
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      <SignatureModal
        isOpen={showSignatureModal}
        onClose={handleSignatureModalClose}
        onSignComplete={handleSignComplete}
        onSkip={handleSkipSignature}
        memberName={memberName}
      />
    </>
  )
}
