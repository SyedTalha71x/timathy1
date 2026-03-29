/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { X, AlertTriangle, CreditCard, Loader2, CheckCircle2, FileText } from "lucide-react"

// ============================================
// Payment Details Modal – Customer / Studio
// ============================================
export default function PaymentDetailsModal({ studio, onClose, onSave }) {
  const { t } = useTranslation()
  const paymentData = studio?.paymentDetails || {}

  const initialForm = useRef({
    accountHolderFirstName: paymentData.accountHolderFirstName || "",
    accountHolderLastName: paymentData.accountHolderLastName || "",
    iban: paymentData.iban || studio?.iban || "",
    bic: paymentData.bic || "",
    bankName: paymentData.bankName || "",
    sepaMandateNumber: paymentData.sepaMandateNumber || "",
  })

  const [form, setForm] = useState({ ...initialForm.current })

  const [autoGenerateMandate, setAutoGenerateMandate] = useState(!paymentData.sepaMandateNumber)
  const initialAutoGenerate = useRef(!paymentData.sepaMandateNumber)
  const [bankLookupStatus, setBankLookupStatus] = useState(null)
  const lastLookedUpIban = useRef("")

  const studioName = studio?.name || ""

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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSave) return

    const formData = {
      ...form,
      sepaMandateNumber: autoGenerateMandate ? generateMandateNumber() : form.sepaMandateNumber,
    }

    onSave(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/50 flex items-center justify-center z-[1001]">
      <style>{`
        .primary-check { appearance: none; -webkit-appearance: none; width: 1rem; height: 1rem; border-radius: 0.25rem; border: 1px solid var(--color-border); background: var(--color-surface-card); cursor: pointer; flex-shrink: 0; }
        .primary-check:checked { background-color: var(--color-primary); border-color: var(--color-primary); background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E"); background-size: 100% 100%; background-position: center; background-repeat: no-repeat; }
        .primary-check:focus { outline: none; box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 40%, transparent); }
      `}</style>
      <div className="bg-surface-base rounded-2xl w-full max-w-lg relative overflow-hidden mx-4">
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <CreditCard className="text-primary" size={20} />
              </div>
              <div>
                <h3 className="text-xl text-content-primary font-semibold">{t("admin.customers.payment.title")}</h3>
                <p className="text-xs text-content-muted">{studioName}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-content-muted hover:text-content-primary transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Account Holder */}
            <div>
              <label className="block text-content-secondary text-sm mb-2">{t("admin.customers.payment.accountHolder")}</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={form.accountHolderFirstName}
                  onChange={(e) => setForm({ ...form, accountHolderFirstName: e.target.value })}
                  placeholder={t("admin.customers.payment.firstName")}
                  className="bg-surface-dark text-content-primary text-sm px-3 py-2.5 rounded-xl border border-border w-full focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  value={form.accountHolderLastName}
                  onChange={(e) => setForm({ ...form, accountHolderLastName: e.target.value })}
                  placeholder={t("admin.customers.payment.lastName")}
                  className="bg-surface-dark text-content-primary text-sm px-3 py-2.5 rounded-xl border border-border w-full focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* IBAN */}
            <div>
              <label className="block text-content-secondary text-sm mb-2">{t("admin.customers.payment.iban")}</label>
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
              <label className="block text-content-secondary text-sm mb-2">{t("admin.customers.payment.bic")}</label>
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
              <label className="block text-content-secondary text-sm mb-2">{t("admin.customers.payment.bankName")}</label>
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
              <label className="block text-content-secondary text-sm mb-2">{t("admin.customers.payment.sepaMandateNumber")}</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoGenerateMandate}
                  onChange={() => setAutoGenerateMandate(!autoGenerateMandate)}
                  className="primary-check"
                />
                <span className="text-content-secondary text-xs">{t("admin.customers.payment.autoGenerate")}</span>
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
                  {t("admin.customers.payment.sepaWarning")}
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
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                disabled={!canSave}
                className={`px-4 py-2 text-sm rounded-xl transition-colors flex items-center gap-2 ${canSave ? "bg-primary text-white hover:bg-primary-hover" : "bg-surface-dark text-content-muted border border-border cursor-not-allowed"}`}
              >
                <FileText size={14} />
                {t("admin.customers.payment.savePayment")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
