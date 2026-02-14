/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react"
import {
  X,
  Minus,
  Plus,
  User,
  Search,
  Trash2,
  UserPlus,
  ShoppingCart,
  ChevronDown,
} from "lucide-react"
import { toast } from "react-hot-toast"
import { formatCurrency, getCurrencySymbol } from "../../../utils/studio-states/selling-states"

/**
 * SidebarAreaSelling - Shopping Basket Sidebar for Selling Page
 * Contains shopping cart, member selection, payment options and checkout
 */
const SidebarAreaSelling = ({
  // Sidebar control
  isOpen,
  onClose,

  // Cart props
  cart,
  updateQuantity,
  removeFromCart,
  updateItemVatRate,

  // Payment props
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  discount,
  setDiscount,

  // Member props
  members,
  selectedMemberMain,
  setSelectedMemberMain,
  sellWithoutMember,
  setSellWithoutMember,
  memberSearchQuery,
  setMemberSearchQuery,
  showMemberResults,
  setShowMemberResults,
  filteredMembers,
  selectMember,
  setIsTempMemberModalOpen,

  // Calculated values
  subtotal,
  discountValue,
  discountAmount,
  total,

  // Actions
  handleCheckout,
}) => {
  const currencySymbol = getCurrencySymbol()
  const [isDiscountOpen, setIsDiscountOpen] = useState(false)

  return (
    <aside
      className={`
        fixed top-0 right-0 h-full text-content-primary w-full sm:w-96 bg-surface-base border-l border-border z-50
        transform transition-transform duration-500 ease-in-out flex flex-col
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
    >
      <style>{`
        .primary-check { appearance: none; -webkit-appearance: none; width: 1rem; height: 1rem; border-radius: 0.25rem; border: 1px solid var(--color-border); background: var(--color-surface-card); cursor: pointer; flex-shrink: 0; }
        .primary-check:checked { background-color: var(--color-primary); border-color: var(--color-primary); background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E"); background-size: 100% 100%; background-position: center; background-repeat: no-repeat; }
        .primary-check:focus { outline: none; box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 40%, transparent); }
      `}</style>
      <div className="p-4 md:p-5 custom-scrollbar overflow-y-auto flex-1 min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-content-primary" />
            <h2 className="text-base sm:text-lg font-semibold text-content-primary">Shopping Basket</h2>
            {cart.length > 0 && (
              <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-content-muted hover:bg-surface-hover rounded-xl"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Sell without member checkbox */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm text-content-primary cursor-pointer">
            <input
              type="checkbox"
              checked={sellWithoutMember}
              onChange={(e) => {
                setSellWithoutMember(e.target.checked)
                if (e.target.checked) {
                  setSelectedMemberMain("")
                  setMemberSearchQuery("")
                  setShowMemberResults(false)
                }
              }}
              className="primary-check"
            />
            Sell without selecting a member
          </label>
        </div>

        {/* Member Search */}
        {!sellWithoutMember && (
          <div className="mb-4 relative member-search-container">
            {selectedMemberMain ? (
              <div className="flex items-center justify-between bg-surface-dark rounded-xl px-4 py-3 border border-border">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-content-muted" />
                  <span className="text-content-primary text-sm">
                    {members.find((m) => m.id === selectedMemberMain)?.name}
                  </span>
                  <span className="text-xs bg-surface-button px-2 py-1 rounded">
                    {members.find((m) => m.id === selectedMemberMain)?.type}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedMemberMain("")
                    setMemberSearchQuery("")
                  }}
                  className="text-content-muted hover:text-content-primary transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <input
                    type="text"
                    value={memberSearchQuery}
                    onChange={(e) => {
                      setMemberSearchQuery(e.target.value)
                      setShowMemberResults(true)
                    }}
                    onFocus={() => setShowMemberResults(true)}
                    placeholder="Search for a member..."
                    className="w-full bg-surface-dark text-sm rounded-xl px-4 py-3 text-content-primary outline-none border border-transparent focus:border-primary transition-colors"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-content-muted" size={16} />
                </div>
                {showMemberResults && (
                  <div className="absolute z-10 mt-1 w-full bg-surface-dark rounded-xl shadow-lg border border-border max-h-48 overflow-y-auto">
                    <div
                      onClick={() => setIsTempMemberModalOpen()}
                      className="px-4 py-2 hover:bg-surface-base cursor-pointer text-sm border-b border-border text-primary flex items-center gap-2"
                    >
                      <UserPlus size={16} /> Create Temporary Member
                    </div>
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((member) => (
                        <div
                          key={member.id}
                          onClick={() => selectMember(member)}
                          className="px-4 py-2 hover:bg-surface-base cursor-pointer text-sm flex items-center justify-between"
                        >
                          <span>{member.name}</span>
                          <span className="text-xs bg-surface-button px-2 py-1 rounded">{member.type}</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-content-muted text-sm">No members found</div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Cart Items */}
        <div className="divide-y divide-border mb-4">
          {cart.length === 0 ? (
            <div className="text-center py-6 text-content-muted">Your basket is empty</div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 relative">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="absolute top-4 right-0 text-content-faint hover:text-red-500 transition-colors duration-200"
                >
                  <Trash2 size={14} />
                </button>
                <div className="flex gap-3">
                  {/* Image or Orange Box */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary flex items-center justify-center text-white text-xs font-medium text-center p-1">
                        <p className="line-clamp-3 leading-tight">{item.name}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="mb-1 oxanium_font truncate">{item.name}</h3>

                    {item.type === "product" && item.articalNo && (
                      <p className="text-xs text-content-faint mb-1 truncate">Art. No: {item.articalNo}</p>
                    )}

                    <p className="text-sm font-bold">{formatCurrency(item.price)}</p>

                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-surface-button px-2 py-1 rounded">
                        {item.type === "service" ? "Service" : "Product"}
                      </span>
                      <select
                        value={item.vatRate}
                        onChange={(e) => updateItemVatRate(item.id, Number(e.target.value))}
                        className="text-xs bg-surface-card hover:bg-surface-hover px-2 py-1 rounded cursor-pointer outline-none transition-colors border border-border open_sans_font"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value={19}>VAT: 19% (eat-in)</option>
                        <option value={7}>VAT: 7% (take-away)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-center mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 bg-surface-dark rounded-md hover:bg-surface-button"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 bg-surface-dark rounded-md hover:bg-surface-button"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sticky Bottom Section */}
      {cart.length > 0 && (
        <div className="flex-shrink-0 border-t border-border p-4 md:p-5">
            <div className="space-y-4 mb-4">
              {/* Payment Method */}
              <div>
                <label className="text-sm text-content-primary block mb-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    "Cash",
                    "Card",
                    ...(!sellWithoutMember &&
                      selectedMemberMain &&
                      members.find((m) => m.id === selectedMemberMain)?.type !== "Temporary Member"
                        ? ["Direct Debit"]
                        : []),
                  ].map((method) => (
                    <button
                      key={method}
                      onClick={() => setSelectedPaymentMethod(method)}
                      className={`py-2 px-3 text-sm rounded-lg border ${
                        selectedPaymentMethod === method
                          ? "border-primary bg-primary/20"
                          : "border-border hover:bg-surface-dark"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discount - Collapsible */}
              <div>
                <button
                  onClick={() => setIsDiscountOpen(!isDiscountOpen)}
                  className="flex items-center justify-between w-full text-sm text-content-primary"
                >
                  <span>Discount</span>
                  <ChevronDown size={16} className={`text-content-primary transition-transform duration-200 ${isDiscountOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDiscountOpen && (
                  <div className="relative mt-2">
                  <input
                    type="text"
                    value={discount}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === "" || (/^\d*\.?\d*$/.test(value) && Number.parseFloat(value) <= 100)) {
                        setDiscount(value)
                      }
                    }}
                    placeholder="0"
                    className="w-full bg-surface-dark text-sm rounded-xl px-4 py-3 pr-8 text-content-primary outline-none border border-transparent focus:border-primary transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-content-muted text-sm pointer-events-none">%</span>
                </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-content-muted">Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-content-muted">Incl. VAT</span>
                <span>{formatCurrency((() => {
                  const totalVat = cart.reduce((sum, item) => {
                    const itemTotal = item.price * item.quantity
                    const vatRate = Number(item.vatRate) || 19
                    const vatAmount = itemTotal * vatRate / (100 + vatRate)
                    return sum + vatAmount
                  }, 0)
                  const discountedVat = totalVat * (1 - discountValue / 100)
                  return discountedVat
                })())}</span>
              </div>
              {discountValue > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-content-muted">Discount ({discountValue}%):</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold mt-2 pt-2 border-t border-border">
                <span>To pay</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Member/No member indicator */}
            <div className="mt-4 p-3 bg-surface-dark rounded-xl">
              <div className="text-sm text-content-secondary">
                {sellWithoutMember ? (
                  <span className="text-primary">Selling without member</span>
                ) : selectedMemberMain ? (
                  <div>
                    <span className="text-content-primary">
                      Member: {members.find((m) => m.id === selectedMemberMain)?.name}
                    </span>
                    <div className="text-xs text-content-faint mt-1">
                      Type: {members.find((m) => m.id === selectedMemberMain)?.type}
                    </div>
                  </div>
                ) : (
                  <span className="text-content-muted">No member selected</span>
                )}
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={!sellWithoutMember && !selectedMemberMain}
              className={`w-full mt-4 text-sm text-white py-3 rounded-xl transition-colors ${
                !sellWithoutMember && !selectedMemberMain
                  ? "bg-primary/50 cursor-not-allowed"
                  : "bg-primary hover:bg-primary-hover"
              }`}
            >
              Checkout
            </button>
        </div>
      )}
    </aside>
  )
}

export default SidebarAreaSelling
