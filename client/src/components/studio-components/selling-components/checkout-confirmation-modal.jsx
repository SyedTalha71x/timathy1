/* eslint-disable react/prop-types */
import { useEffect } from "react"
import { X, User, CreditCard } from "lucide-react"
import { MdOutlineProductionQuantityLimits } from "react-icons/md"
import { RiServiceFill } from "react-icons/ri"
import { formatCurrency, getCurrencySymbol } from "../../../utils/studio-states/selling-states"

const CheckoutConfirmationModal = ({
  show,
  onClose,
  onConfirm,
  cart,
  member,
  sellWithoutMember,
  paymentMethod,
  subtotal,
  discountAmount,
  discountValue,
  total,
}) => {
  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && show) {
        onClose()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [show, onClose])

  if (!show) return null

  // Group items by type
  const products = cart.filter((item) => item.type === "product")
  const services = cart.filter((item) => item.type === "service")

  // Calculate VAT breakdown
  const calculateVatBreakdown = () => {
    let totalVat19 = 0
    let totalVat7 = 0
    let totalNet = 0

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity
      const vatRate = Number(item.vatRate) || 19
      const netAmount = itemTotal / (1 + vatRate / 100)
      const vatAmount = itemTotal - netAmount

      totalNet += netAmount
      if (vatRate === 7) {
        totalVat7 += vatAmount
      } else {
        totalVat19 += vatAmount
      }
    })

    // Apply discount to VAT
    const discountMultiplier = 1 - (discountValue || 0) / 100
    return {
      totalNet: totalNet * discountMultiplier,
      totalVat19: totalVat19 * discountMultiplier,
      totalVat7: totalVat7 * discountMultiplier,
    }
  }

  const vatBreakdown = calculateVatBreakdown()

  return (
    <div className="fixed inset-0 cursor-pointer open_sans_font w-full h-full bg-black/70 flex items-center justify-center z-[1000] p-4">
      <div className="bg-surface-base rounded-xl w-full max-w-lg my-8 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-content-primary open_sans_font_700 text-xl font-semibold">
              Confirm Purchase
            </h2>
            <button
              onClick={onClose}
              className="text-content-muted hover:text-content-primary transition-colors"
            >
              <X size={24} className="cursor-pointer" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-5">
          {/* Member Info */}
          <div className="bg-surface-dark rounded-xl p-4">
            <div className="flex items-center gap-3">
              <User className="text-content-muted" size={20} />
              <div>
                <p className="text-content-muted text-xs mb-1">Member</p>
                <p className="text-content-primary font-medium">
                  {sellWithoutMember
                    ? "No Member Selected"
                    : member?.name || "No Member Selected"}
                </p>
                {member?.type && !sellWithoutMember && (
                  <p className="text-content-faint text-xs mt-0.5">{member.type}</p>
                )}
              </div>
            </div>
          </div>

          {/* Products Section */}
          {products.length > 0 && (
            <div>
              <h3 className="text-content-muted text-sm font-medium mb-3 flex items-center gap-2">
                <MdOutlineProductionQuantityLimits size={16} />
                Products ({products.length})
              </h3>
              <div className="space-y-2">
                {products.map((item) => (
                  <div
                    key={item.id}
                    className="bg-surface-dark rounded-xl p-3 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Image or Orange Box */}
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary flex items-center justify-center text-white text-[8px] font-medium text-center p-1">
                            <p className="line-clamp-2 leading-tight">
                              {item.name}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-content-primary text-sm truncate">{item.name}</p>
                        <p className="text-content-faint text-xs">
                          {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-content-primary font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <p className="text-content-faint text-xs">
                        VAT {item.vatRate || 19}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services Section */}
          {services.length > 0 && (
            <div>
              <h3 className="text-content-muted text-sm font-medium mb-3 flex items-center gap-2">
                <RiServiceFill size={16} />
                Services ({services.length})
              </h3>
              <div className="space-y-2">
                {services.map((item) => (
                  <div
                    key={item.id}
                    className="bg-surface-dark rounded-xl p-3 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Image or Orange Box */}
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary flex items-center justify-center text-white text-[8px] font-medium text-center p-1">
                            <p className="line-clamp-2 leading-tight">
                              {item.name}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-content-primary text-sm truncate">{item.name}</p>
                        <p className="text-content-faint text-xs">
                          {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-content-primary font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <p className="text-content-faint text-xs">
                        VAT {item.vatRate || 19}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="bg-surface-dark rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="text-content-muted" size={20} />
              <div>
                <p className="text-content-muted text-xs mb-1">Payment Method</p>
                <p className="text-content-primary font-medium">{paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-surface-dark rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-content-muted">Subtotal</span>
              <span className="text-content-primary">{formatCurrency(subtotal)}</span>
            </div>
            
            {discountValue > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-content-muted">Discount ({discountValue}%)</span>
                <span className="text-content-primary">-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-content-muted">Net</span>
              <span className="text-content-primary">{formatCurrency(vatBreakdown.totalNet)}</span>
            </div>
            
            {vatBreakdown.totalVat19 > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-content-muted">VAT 19%</span>
                <span className="text-content-primary">{formatCurrency(vatBreakdown.totalVat19)}</span>
              </div>
            )}
            
            {vatBreakdown.totalVat7 > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-content-muted">VAT 7%</span>
                <span className="text-content-primary">{formatCurrency(vatBreakdown.totalVat7)}</span>
              </div>
            )}
            
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span className="text-content-primary">Total</span>
                <span className="text-content-primary text-lg">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-border flex-shrink-0">
          <div className="flex flex-row-reverse gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 sm:flex-none sm:w-auto px-8 py-2.5 bg-primary hover:bg-primary-hover text-sm text-white rounded-xl transition-colors font-medium"
            >
              Confirm Purchase
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none sm:w-auto px-8 py-2.5 bg-transparent text-sm text-content-secondary rounded-xl border border-border hover:bg-surface-dark transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutConfirmationModal
