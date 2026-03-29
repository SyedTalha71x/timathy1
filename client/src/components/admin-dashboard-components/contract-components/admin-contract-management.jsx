/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { 
  X, FileText, Eye, Download, Check, Edit, 
  Copy, Building2, ChevronDown, ChevronUp, RefreshCw, ArrowRightLeft, Clock, Calendar,
  AlertTriangle, AlertCircle, Printer, Gift
} from "lucide-react"
import { toast } from "react-hot-toast"
import { pdf } from "@react-pdf/renderer"
import AdminContractPDFDocument from "./AdminContractPDFDocument"

// ============================================
// Required Libraries:
// npm install @react-pdf/renderer
// ============================================


// Status Tag Component
const ContractStatusTag = ({ status, pauseReason = null, pauseStartDate = null, pauseEndDate = null, cancelReason = null, cancelDate = null }) => {
  const { t, i18n } = useTranslation()

  const statusMap = {
    'Active': t("admin.contract.status.active"),
    'Ongoing': t("admin.contract.status.active"),
    'Paused': t("admin.contract.status.paused"),
    'Cancelled': t("admin.contract.status.cancelled"),
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-accent-green';
      case 'Ongoing': return 'bg-surface-button';
      case 'Paused': return 'bg-accent-yellow';
      case 'Cancelled': return 'bg-accent-red';
      default: return 'bg-surface-button';
    }
  };

  const hasTooltip = status === 'Paused' || status === 'Cancelled';
  const hasHoverEffect = status === 'Paused' || status === 'Cancelled';
  
  const formatD = (d) => d ? new Date(d).toLocaleDateString(i18n.language) : null;

  const renderPauseTooltip = () => {
    if (status !== 'Paused') return null;
    return (
      <>
        {pauseReason && (
          <div className="flex items-center gap-2">
            <span className="text-accent-yellow font-medium">{t("admin.contract.mgmt.reason")}</span>
            <span>{pauseReason}</span>
          </div>
        )}
        {pauseStartDate && pauseEndDate && (
          <div className="flex items-center gap-2">
            <span className="text-accent-yellow font-medium">{t("admin.contract.mgmt.period")}</span>
            <span>{formatD(pauseStartDate)} - {formatD(pauseEndDate)}</span>
          </div>
        )}
        {pauseStartDate && !pauseEndDate && (
          <div className="flex items-center gap-2">
            <span className="text-accent-yellow font-medium">{t("admin.contract.mgmt.since")}</span>
            <span>{formatD(pauseStartDate)}</span>
          </div>
        )}
        {!pauseReason && !pauseStartDate && (
          <span>{t("admin.contract.mgmt.contractPaused")}</span>
        )}
      </>
    );
  };

  const renderCancelTooltip = () => {
    if (status !== 'Cancelled') return null;
    return (
      <>
        {cancelReason && (
          <div className="flex items-center gap-2">
            <span className="text-accent-red font-medium">{t("admin.contract.mgmt.reason")}</span>
            <span>{cancelReason}</span>
          </div>
        )}
        {cancelDate && (
          <div className="flex items-center gap-2">
            <span className="text-accent-red font-medium">{t("admin.contract.mgmt.cancelled")}</span>
            <span>{formatD(cancelDate)}</span>
          </div>
        )}
        {!cancelReason && !cancelDate && (
          <span>{t("admin.contract.mgmt.contractCancelled")}</span>
        )}
      </>
    );
  };

  return (
    <div className={`relative ${hasTooltip ? 'group' : ''} inline-flex`}>
      <span className={`${getStatusColor(status)} text-white px-2 py-0.5 rounded-lg text-xs font-medium transition-transform duration-200 ${hasHoverEffect ? 'cursor-pointer hover:scale-110' : ''}`}>
        {statusMap[status] || status}
      </span>
      {hasTooltip && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-surface-dark text-content-primary px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg pointer-events-none">
          <div className="flex flex-col gap-1">
            {renderPauseTooltip()}
            {renderCancelTooltip()}
          </div>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent" style={{ borderBottomColor: 'var(--color-surface-dark)' }} />
        </div>
      )}
    </div>
  );
};

export function AdminContractManagement({ contract, onClose, studio = null }) {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  
  const displayContracts = [contract];

  const [expandedContractId, setExpandedContractId] = useState(contract.id)
  const [showEditContract, setShowEditContract] = useState(false)
  const [editingContract, setEditingContract] = useState(null)

  const [copiedField, setCopiedField] = useState(null)

  // Get studio name from contract or studio prop
  const studioName = contract.studioName || studio?.name || t("admin.contract.mgmt.contract")

  // Get initials from studio name
  const getInitials = (name) => {
    if (!name) return "?"
    const words = name.trim().split(/\s+/)
    if (words.length >= 2) return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase()
    return words[0].charAt(0).toUpperCase()
  }

  const handleCopy = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text || "")
      setCopiedField(fieldName)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString(i18n.language)
  }

  const getEffectiveEndDate = (contractItem) => {
    const isCancelledEarly = !!(contractItem.cancelToDate && contractItem.status === 'Cancelled')

    if (!contractItem.bonusTime?.bonusAmount) {
      return { date: contractItem.endDate, isExtended: false, isCancelledEarly, bonusPeriod: null }
    }
    const start = new Date(contractItem.endDate)
    const end = new Date(contractItem.endDate)
    const amount = contractItem.bonusTime.bonusAmount
    switch (contractItem.bonusTime.bonusUnit) {
      case 'days':
        end.setDate(end.getDate() + amount)
        break
      case 'weeks':
        end.setDate(end.getDate() + amount * 7)
        break
      case 'months':
        end.setMonth(end.getMonth() + amount)
        break
      default:
        break
    }
    const bonusPeriod = `${formatDate(start.toISOString().split('T')[0])} - ${formatDate(end.toISOString().split('T')[0])}`
    const isExtended = !!contractItem.bonusTime.withExtension
    return { 
      date: isExtended ? end.toISOString().split('T')[0] : contractItem.endDate, 
      isExtended, 
      isCancelledEarly,
      bonusPeriod,
      effectiveEndDate: end.toISOString().split('T')[0],
    }
  }

  const isExpiringSoon = (endDate) => {
    const today = new Date()
    const end = new Date(endDate)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return end <= thirtyDaysFromNow && end > today
  }

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date()
  }

  const shouldShowExpiring = (contractItem) => {
    if (!contractItem.autoRenewal) {
      return isExpiringSoon(contractItem.endDate)
    }
    if (contractItem.renewalIndefinite === true) {
      return false
    }
    if (contractItem.autoRenewalEndDate) {
      return isExpiringSoon(contractItem.autoRenewalEndDate)
    }
    return false
  }

  const shouldShowExpired = (contractItem) => {
    if (!contractItem.autoRenewal) {
      return isExpired(contractItem.endDate)
    }
    if (contractItem.renewalIndefinite === true) {
      return false
    }
    if (contractItem.autoRenewalEndDate) {
      return isExpired(contractItem.autoRenewalEndDate)
    }
    return false
  }

  // Navigate to studio details in admin panel
  const redirectToStudio = () => {
    onClose()
    // Navigate to the studio details in the admin panel
    navigate("/admin-dashboard/customers", { 
      state: { 
        searchQuery: studioName,
        studioId: contract.studioId,
        fromContract: true
      } 
    })
  }


  // Render a single contract card
  const renderContractCard = (contractItem, isExpanded) => {
    const isCurrent = contractItem.status === 'Active' || contractItem.status === 'Paused' || contractItem.status === 'Ongoing'
    
    const hasContractForm = !!(contractItem.contractFormSnapshot || contractItem.formData)
    
    const isOngoing = contractItem.status === 'Ongoing'
    const canPerformActions = hasContractForm && !isOngoing
    
    const contractFormData = contractItem.contractFormSnapshot?.contractFormData || contractItem.formData?.contractFormData
    const formValues = contractItem.contractFormSnapshot?.formValues || contractItem.formData?.formValues || {}
    const systemValues = contractItem.contractFormSnapshot?.systemValues || contractItem.formData?.systemValues || {}
    
    const generateContractPDF = async () => {
      if (!contractFormData) {
        throw new Error('No contract form data available for PDF generation')
      }
      
      const pdfBlob = await pdf(
        <AdminContractPDFDocument
          contractForm={contractFormData}
          formValues={formValues}
          systemValues={systemValues}
          language={i18n.language}
        />
      ).toBlob()
      
      return pdfBlob
    }
    
    const handleViewContract = async (e) => {
      e.stopPropagation()
      if (!canPerformActions) {
        if (isOngoing) {
          toast.info(t("admin.contract.mgmt.ongoingDraft"))
        } else {
          toast.info(t("admin.contract.mgmt.noFormData"))
        }
        return
      }
      if (hasContractForm && contractFormData) {
        toast.loading(t("admin.contract.mgmt.generatingPdf"), { id: 'pdf-view' })
        try {
          const pdfBlob = await generateContractPDF()
          const pdfUrl = URL.createObjectURL(pdfBlob)
          window.open(pdfUrl, '_blank')
          toast.dismiss('pdf-view')
          toast.success(t("admin.contract.mgmt.pdfOpened"))
        } catch (error) {
          toast.dismiss('pdf-view')
          toast.error(t("admin.contract.mgmt.pdfFailed"))
          console.error(error)
        }
      } else {
        toast.info(t("admin.contract.mgmt.noFormData"))
      }
    }
    
    const handleDownloadContract = async (e) => {
      e.stopPropagation()
      if (!canPerformActions) {
        if (isOngoing) {
          toast.info(t("admin.contract.mgmt.ongoingDraft"))
        } else {
          toast.info(t("admin.contract.mgmt.noFormData"))
        }
        return
      }
      if (hasContractForm && contractFormData) {
        toast.loading(t("admin.contract.mgmt.generatingPdf"), { id: 'pdf-download' })
        try {
          const pdfBlob = await generateContractPDF()
          const fileName = `Contract_${contractItem.contractNumber || contractItem.id}_${studioName?.replace(/\s+/g, '_') || 'Studio'}.pdf`
          
          const url = URL.createObjectURL(pdfBlob)
          const link = document.createElement('a')
          link.href = url
          link.download = fileName
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
          
          toast.dismiss('pdf-download')
          toast.success(t("admin.contract.mgmt.pdfDownloaded"))
        } catch (error) {
          toast.dismiss('pdf-download')
          toast.error(t("admin.contract.mgmt.pdfFailed"))
          console.error(error)
        }
      } else {
        toast.info(t("admin.contract.mgmt.noFormData"))
      }
    }
    
    const handlePrintContract = async (e) => {
      e.stopPropagation()
      if (!canPerformActions) {
        if (isOngoing) {
          toast.info(t("admin.contract.mgmt.ongoingDraft"))
        } else {
          toast.info(t("admin.contract.mgmt.noFormData"))
        }
        return
      }
      if (hasContractForm && contractFormData) {
        toast.loading(t("admin.contract.mgmt.generatingPdfPrint"), { id: 'pdf-print' })
        try {
          const pdfBlob = await generateContractPDF()
          const pdfUrl = URL.createObjectURL(pdfBlob)
          const printWindow = window.open(pdfUrl, '_blank')
          if (printWindow) {
            printWindow.onload = () => {
              setTimeout(() => {
                printWindow.print()
              }, 500)
            }
          }
          toast.dismiss('pdf-print')
        } catch (error) {
          toast.dismiss('pdf-print')
          toast.error(t("admin.contract.mgmt.pdfPrintFailed"))
          console.error(error)
        }
      } else {
        toast.info(t("admin.contract.mgmt.noFormData"))
      }
    }
    
    return (
      <div 
        key={contractItem.id} 
        className={`bg-surface-card rounded-xl overflow-hidden border ${
          isExpanded ? 'border-orange-500/50' : 'border-border'
        } transition-all duration-200`}
      >
        {/* Contract Header - Always visible */}
        <div className="p-4 flex items-center justify-between hover:bg-surface-hover transition-colors">
          <button
            onClick={() => setExpandedContractId(isExpanded ? null : contractItem.id)}
            className="flex items-center gap-4 flex-1"
          >
            <div className="w-10 h-10 bg-surface-hover rounded-xl flex items-center justify-center">
              <FileText size={20} className={isCurrent ? "text-orange-400" : "text-content-faint"} />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-content-primary font-medium">
                  {t("admin.contract.mgmt.contract")} {contractItem.contractNumber || contractItem.id}
                </span>
                <ContractStatusTag 
                  status={contractItem.status} 
                  pauseReason={contractItem.pauseReason}
                  pauseStartDate={contractItem.pauseStartDate}
                  pauseEndDate={contractItem.pauseEndDate}
                  cancelReason={contractItem.cancelReason}
                  cancelDate={contractItem.cancelDate}
                />
                {contractItem.autoRenewal && contractItem.status === 'Active' && (
                  <div className="relative group inline-flex">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 flex items-center gap-1 cursor-pointer transition-transform duration-200 hover:scale-110">
                      <RefreshCw size={10} /> {t("admin.contract.mgmt.autoRenewal")}
                    </span>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-surface-dark text-content-primary px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg pointer-events-none">
                      <div className="flex items-center gap-2">
                        <RefreshCw size={10} className="text-orange-400" />
                        <span>
                          {contractItem.renewalIndefinite === true 
                            ? t("admin.contract.mgmt.unlimitedAutoRenewal") 
                            : contractItem.autoRenewalEndDate 
                              ? t("admin.contract.mgmt.autoRenewalUntil", { date: formatDate(contractItem.autoRenewalEndDate) }) 
                              : t("admin.contract.mgmt.autoRenewalEnabled")}
                        </span>
                      </div>
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent" style={{ borderBottomColor: 'var(--color-surface-dark)' }} />
                    </div>
                  </div>
                )}
                {shouldShowExpiring(contractItem) && contractItem.status === 'Active' && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent-red/20 text-accent-red flex items-center gap-1">
                    <AlertTriangle size={10} /> {t("admin.contract.mgmt.expiring")}
                  </span>
                )}
                {shouldShowExpired(contractItem) && contractItem.status === 'Active' && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent-red/20 text-accent-red">
                    Expired
                  </span>
                )}
                {contractItem.bonusTime && (
                  <div className="relative group inline-flex">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 flex items-center gap-1 cursor-pointer transition-transform duration-200 hover:scale-110">
                      <Gift size={10} /> {t("admin.contract.mgmt.bonus")} ({contractItem.bonusTime.bonusAmount} {contractItem.bonusTime.bonusUnit})
                    </span>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-surface-dark text-content-primary px-3 py-2 rounded-lg text-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg pointer-events-none max-w-[280px]">
                      {(() => {
                        const eff = getEffectiveEndDate(contractItem)
                        return (
                          <div className="flex items-start gap-2">
                            <Gift size={10} className="text-orange-400 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0 overflow-hidden">
                              <span className="font-medium whitespace-nowrap">{contractItem.bonusTime.bonusAmount} {contractItem.bonusTime.bonusUnit}</span>
                              {contractItem.bonusTime.reason && <span className="text-content-secondary block truncate"> — {contractItem.bonusTime.reason}</span>}
                              {eff.bonusPeriod && <span className="text-content-muted block whitespace-nowrap mt-0.5">{eff.bonusPeriod}</span>}
                              {contractItem.bonusTime.withExtension 
                                ? <span className="text-accent-green block text-[10px] mt-0.5">{t("admin.contract.mgmt.contractExtension")}</span>
                                : <span className="text-content-faint block text-[10px] mt-0.5">{t("admin.contract.mgmt.withoutExtension")}</span>
                              }
                            </div>
                          </div>
                        )
                      })()}
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent" style={{ borderBottomColor: 'var(--color-surface-dark)' }} />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-content-muted mt-0.5">
                <span>{contractItem.contractType}</span>
                <span>•</span>
                <span>{formatDate(contractItem.startDate)} - {(() => {
                  const eff = getEffectiveEndDate(contractItem)
                  if (eff.isCancelledEarly) return <span className="text-accent-red font-medium">{formatDate(contractItem.endDate)}</span>
                  if (eff.isExtended) return <span className="text-orange-400 font-medium">{formatDate(eff.date)}</span>
                  return formatDate(contractItem.endDate)
                })()}</span>
              </div>
            </div>
          </button>
          
          {/* Contract Actions - Eye, Download & Print */}
          <div className="flex items-center gap-1 mr-2">
            <button
              onClick={handleViewContract}
              disabled={!canPerformActions}
              className={`p-2 rounded-lg transition-colors ${
                canPerformActions 
                  ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' 
                  : 'bg-surface-hover text-content-faint cursor-not-allowed'
              }`}
              title={isOngoing ? t("admin.contract.mgmt.ongoingDraft") : hasContractForm ? t("admin.contract.mgmt.viewContract") : t("admin.contract.mgmt.noFormData")}
            >
              <Eye size={16} />
            </button>
            <button
              onClick={handleDownloadContract}
              disabled={!canPerformActions}
              className={`p-2 rounded-lg transition-colors ${
                canPerformActions 
                  ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' 
                  : 'bg-surface-hover text-content-faint cursor-not-allowed'
              }`}
              title={isOngoing ? t("admin.contract.mgmt.ongoingDraft") : hasContractForm ? t("admin.contract.mgmt.downloadContract") : t("admin.contract.mgmt.noFormData")}
            >
              <Download size={16} />
            </button>
            <button
              onClick={handlePrintContract}
              disabled={!canPerformActions}
              className={`p-2 rounded-lg transition-colors ${
                canPerformActions 
                  ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' 
                  : 'bg-surface-hover text-content-faint cursor-not-allowed'
              }`}
              title={isOngoing ? t("admin.contract.mgmt.ongoingDraft") : hasContractForm ? t("admin.contract.mgmt.printContract") : t("admin.contract.mgmt.noFormData")}
            >
              <Printer size={16} />
            </button>
          </div>
          
          <button
            onClick={() => setExpandedContractId(isExpanded ? null : contractItem.id)}
            className="p-1"
          >
            <ChevronDown 
              size={20} 
              className={`text-content-muted transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-border">
            {/* Contract Details */}
            <div className="p-4 bg-surface-dark space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {/* Contract Number */}
                <div className="bg-surface-card rounded-lg p-3">
                  <p className="text-xs text-content-faint mb-1">{t("admin.contract.mgmt.contractNumber")}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-content-primary">{contractItem.contractNumber || contractItem.id}</span>
                    <button
                      onClick={() => handleCopy(contractItem.contractNumber || contractItem.id, `number-${contractItem.id}`)}
                      className="p-1 hover:bg-surface-button rounded transition-colors"
                    >
                      {copiedField === `number-${contractItem.id}` ? (
                        <Check size={12} className="text-orange-500" />
                      ) : (
                        <Copy size={12} className="text-content-muted" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Contract Type */}
                <div className="bg-surface-card rounded-lg p-3">
                  <p className="text-xs text-content-faint mb-1">{t("admin.contract.mgmt.contractType")}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-content-primary">{contractItem.contractType}</span>
                    <button
                      onClick={() => handleCopy(contractItem.contractType, `type-${contractItem.id}`)}
                      className="p-1 hover:bg-surface-button rounded transition-colors"
                    >
                      {copiedField === `type-${contractItem.id}` ? (
                        <Check size={12} className="text-orange-500" />
                      ) : (
                        <Copy size={12} className="text-content-muted" />
                      )}
                    </button>
                  </div>
                </div>

                {/* IBAN */}
                {contractItem.iban && (
                  <div className="bg-surface-card rounded-lg p-3">
                    <p className="text-xs text-content-faint mb-1">{t("admin.contract.mgmt.iban")}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-content-primary font-mono text-xs">{contractItem.iban}</span>
                      <button
                        onClick={() => handleCopy(contractItem.iban, `iban-${contractItem.id}`)}
                        className="p-1 hover:bg-surface-button rounded transition-colors"
                      >
                        {copiedField === `iban-${contractItem.id}` ? (
                          <Check size={12} className="text-orange-500" />
                        ) : (
                          <Copy size={12} className="text-content-muted" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* SEPA Mandate */}
                {contractItem.sepaMandate && (
                  <div className="bg-surface-card rounded-lg p-3">
                    <p className="text-xs text-content-faint mb-1">{t("admin.contract.mgmt.sepaMandate")}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-content-primary">{contractItem.sepaMandate}</span>
                      <button
                        onClick={() => handleCopy(contractItem.sepaMandate, `sepa-${contractItem.id}`)}
                        className="p-1 hover:bg-surface-button rounded transition-colors"
                      >
                        {copiedField === `sepa-${contractItem.id}` ? (
                          <Check size={12} className="text-orange-500" />
                        ) : (
                          <Copy size={12} className="text-content-muted" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Auto Renewal */}
                <div className="bg-surface-card rounded-lg p-3">
                  <p className="text-xs text-content-faint mb-1">{t("admin.contract.mgmt.autoRenewal")}</p>
                  <span className={`text-sm ${contractItem.autoRenewal ? 'text-orange-400' : 'text-content-muted'}`}>
                    {contractItem.autoRenewal ? (
                      <span className="flex items-center gap-1 flex-wrap">
                        <RefreshCw size={12} /> Yes
                        <span className="text-orange-300/70 text-xs">
                          {contractItem.renewalIndefinite === true 
                            ? t("admin.contract.mgmt.unlimited") 
                            : contractItem.autoRenewalEndDate 
                              ? t("admin.contract.mgmt.until", { date: formatDate(contractItem.autoRenewalEndDate) }) 
                              : ''}
                        </span>
                      </span>
                    ) : t("admin.contract.mgmt.no")}
                  </span>
                </div>

                {/* Monthly Cost */}
                {contractItem.cost && (
                  <div className="bg-surface-card rounded-lg p-3">
                    <p className="text-xs text-content-faint mb-1">{t("admin.contract.mgmt.monthlyCost")}</p>
                    <span className="text-sm text-content-primary font-medium">€{contractItem.cost}</span>
                  </div>
                )}

                {/* Cancel Reason (if cancelled) */}
                {contractItem.status === 'Cancelled' && contractItem.cancelReason && (
                  <div className="bg-surface-card rounded-lg p-3 col-span-2">
                    <p className="text-xs text-content-faint mb-1">{t("admin.contract.mgmt.cancelReason")}</p>
                    <span className="text-sm text-accent-red">{contractItem.cancelReason}</span>
                  </div>
                )}

                {/* Pause Info (if paused) */}
                {contractItem.status === 'Paused' && (
                  <>
                    {contractItem.pauseReason && (
                      <div className="bg-surface-card rounded-lg p-3">
                        <p className="text-xs text-content-faint mb-1">{t("admin.contract.mgmt.pauseReason")}</p>
                        <span className="text-sm text-accent-yellow">{contractItem.pauseReason}</span>
                      </div>
                    )}
                    {contractItem.pauseStartDate && contractItem.pauseEndDate && (
                      <div className="bg-surface-card rounded-lg p-3">
                        <p className="text-xs text-content-faint mb-1">{t("admin.contract.mgmt.pausePeriod")}</p>
                        <span className="text-sm text-accent-yellow">
                          {formatDate(contractItem.pauseStartDate)} - {formatDate(contractItem.pauseEndDate)}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Discount Info */}
                {contractItem.discount && (
                  <div className="bg-surface-card rounded-lg p-3">
                    <p className="text-xs text-content-faint mb-1">{t("admin.contract.mgmt.discountLabel")}</p>
                    <span className="text-sm text-accent-green">
                      {contractItem.discount.percentage}% 
                      {contractItem.discount.isPermanent ? ` ${t("admin.contract.mgmt.discountPermanent")}` : ` ${t("admin.contract.mgmt.discountForPeriods", { count: contractItem.discount.duration })}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1001]">
        <div className="bg-surface-dark rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col border border-border/50 shadow-2xl">
          {/* Header - Shows Studio Name instead of Member Name */}
          <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-semibold">
                {getInitials(studioName)}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-content-primary">{studioName}</h2>
                <p className="text-xs text-content-muted">
                  {contract.contractNumber ? `#${contract.contractNumber}` : contract.contractType}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={redirectToStudio}
                className="flex items-center gap-2 px-3 py-1.5 bg-surface-hover text-content-secondary rounded-lg hover:bg-surface-button-hover transition-colors text-sm"
              >
                <Building2 size={14} />
                {t("admin.contract.mgmt.goToStudio")}
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-content-muted" />
              </button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {displayContracts.map((contractItem) => 
              renderContractCard(contractItem, expandedContractId === contractItem.id)
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border flex justify-end flex-shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-sm text-white rounded-xl hover:bg-primary-hover transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}