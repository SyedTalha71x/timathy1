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

  return (
    <aside
      className={`
        fixed top-0 right-0 h-full text-white w-full sm:w-96 bg-[#181818] border-l border-gray-700 z-50
        transform transition-transform duration-500 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
    >
      <div className="p-4 md:p-5 custom-scrollbar overflow-y-auto h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-white" />
            <h2 className="text-base sm:text-lg font-semibold text-white">Shopping Basket</h2>
            {cart.length > 0 && (
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:bg-zinc-700 rounded-xl"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Sell without member checkbox */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer">
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
              className="rounded border-gray-300"
            />
            Sell without selecting a member
          </label>
        </div>

        {/* Member Search */}
        {!sellWithoutMember && (
          <div className="mb-4 relative member-search-container">
            {selectedMemberMain ? (
              <div className="flex items-center justify-between bg-[#101010] rounded-xl px-4 py-3 border border-[#333333]">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  <span className="text-white text-sm">
                    {members.find((m) => m.id === selectedMemberMain)?.name}
                  </span>
                  <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                    {members.find((m) => m.id === selectedMemberMain)?.type}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedMemberMain("")
                    setMemberSearchQuery("")
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
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
                    className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
                {showMemberResults && (
                  <div className="absolute z-10 mt-1 w-full bg-[#101010] rounded-xl shadow-lg border border-[#333333] max-h-48 overflow-y-auto">
                    <div
                      onClick={() => setIsTempMemberModalOpen()}
                      className="px-4 py-2 hover:bg-[#181818] cursor-pointer text-sm border-b border-[#333333] text-[#3F74FF] flex items-center gap-2"
                    >
                      <UserPlus size={16} /> Create Temporary Member
                    </div>
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((member) => (
                        <div
                          key={member.id}
                          onClick={() => selectMember(member)}
                          className="px-4 py-2 hover:bg-[#181818] cursor-pointer text-sm flex items-center justify-between"
                        >
                          <span>{member.name}</span>
                          <span className="text-xs bg-gray-600 px-2 py-1 rounded">{member.type}</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-400 text-sm">No members found</div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Cart Items */}
        <div className="space-y-4 max-h-[40vh] overflow-y-auto mb-4">
          {cart.length === 0 ? (
            <div className="text-center py-6 text-gray-400">Your basket is empty</div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="bg-[#1C1C1C] rounded-lg p-4 relative">
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
                      <div className="w-full h-full bg-orange-500 flex items-center justify-center text-white text-xs font-medium text-center p-1">
                        <p className="line-clamp-3 leading-tight">{item.name}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="mb-1 oxanium_font truncate">{item.name}</h3>

                    {item.type === "product" && item.articalNo && (
                      <p className="text-xs text-zinc-400 mb-1 truncate">Art. No: {item.articalNo}</p>
                    )}

                    <p className="text-sm font-bold">{formatCurrency(item.price)}</p>

                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                        {item.type === "service" ? "Service" : "Product"}
                      </span>
                      <select
                        value={item.vatRate}
                        onChange={(e) => updateItemVatRate(item.id, Number(e.target.value))}
                        className="text-xs bg-[#2F2F2F] hover:bg-[#3F3F3F] px-2 py-1 rounded cursor-pointer outline-none transition-colors border border-[#404040]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value={19}>VAT: 19% (eat-in)</option>
                        <option value={7}>VAT: 7% (take-away)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 bg-[#101010] rounded-md hover:bg-[#333333]"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 bg-[#101010] rounded-md hover:bg-[#333333]"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-zinc-500 hover:text-red-500 transition-colors duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Payment Options & Summary */}
        {cart.length > 0 && (
          <>
            <div className="space-y-4 mb-4">
              {/* Payment Method */}
              <div>
                <label className="text-sm text-gray-200 block mb-2">Payment Method</label>
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
                          ? "border-[#3F74FF] bg-[#3F74FF]/20"
                          : "border-[#333333] hover:bg-[#101010]"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discount */}
              <div>
                <label className="text-sm text-gray-200 block mb-2">Discount</label>
                <div className="relative">
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
                    className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 pr-8 text-white outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">%</span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-[#333333] pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Incl. VAT</span>
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
                  <span className="text-gray-400">Discount ({discountValue}%):</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold mt-2 pt-2 border-t border-[#333333]">
                <span>To pay</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Member/No member indicator */}
            <div className="mt-4 p-3 bg-[#101010] rounded-xl">
              <div className="text-sm text-gray-300">
                {sellWithoutMember ? (
                  <span className="text-orange-400">Selling without member</span>
                ) : selectedMemberMain ? (
                  <div>
                    <span className="text-white">
                      Member: {members.find((m) => m.id === selectedMemberMain)?.name}
                    </span>
                    <div className="text-xs text-zinc-400 mt-1">
                      Type: {members.find((m) => m.id === selectedMemberMain)?.type}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400">No member selected</span>
                )}
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={!sellWithoutMember && !selectedMemberMain}
              className={`w-full mt-4 text-sm text-white py-3 rounded-xl transition-colors ${
                !sellWithoutMember && !selectedMemberMain
                  ? "bg-orange-500/50 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              Checkout
            </button>
          </>
        )}
      </div>
    </aside>
  )
}

export default SidebarAreaSelling
