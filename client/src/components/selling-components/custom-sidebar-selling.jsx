"use client"

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useRef, useCallback } from "react"
import { Link } from "react-router-dom"
import Chart from "react-apexcharts"
import {
  X,
  Clock,
  ChevronDown,
  Edit,
  Check,
  Plus,
  MessageCircle,
  ExternalLink,
  MoreVertical,
  Dumbbell,
  Eye,
  Bell,
  Settings,
  AlertTriangle,
  Info,
  CalendarIcon,
  ShoppingCart,
  Minus,
  Trash2,
  User,
  Search,
  Percent,
  Receipt,
  UserPlus,
} from "lucide-react"
import { toast } from "react-hot-toast"
import Avatar from "../../../public/gray-avatar-fotor-20250912192528.png"
import RightSidebarWidget from "../myarea-components/sidebar-components/RightSidebarWidget"
import StaffCheckInWidget from "../myarea-components/StaffWidgetCheckIn"
import { SpecialNoteEditModal } from "../myarea-components/SpecialNoteEditModal"
import ViewManagementModal from "../myarea-components/sidebar-components/ViewManagementModal"
import { bulletinBoardData } from "../../utils/user-panel-states/myarea-states"

const ChartWithLocalState = ({
  selectedMemberType,
  setSelectedMemberType,
  isChartDropdownOpen,
  setIsChartDropdownOpen,
  memberTypes,
  chartOptions,
  chartSeries,
}) => {
  const chartDropdownRef = useRef(null)
  const memberTypeKeys = Object.keys(memberTypes)

  return (
    <>
      <div className="relative mb-3" ref={chartDropdownRef}>
        <button
          onClick={() => setIsChartDropdownOpen(!isChartDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#2F2F2F] rounded-xl text-white text-sm w-full justify-between"
        >
          {selectedMemberType}
          <ChevronDown className="w-4 h-4" />
        </button>
        {isChartDropdownOpen && (
          <div className="absolute z-10 mt-2 w-full bg-[#2F2F2F] rounded-xl shadow-lg">
            {memberTypeKeys.map((typeKey) => (
              <button
                key={typeKey}
                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-black first:rounded-t-xl last:rounded-b-xl"
                onClick={() => {
                  setSelectedMemberType(typeKey)
                  setIsChartDropdownOpen(false)
                }}
              >
                {typeKey}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="w-full">
        <Chart options={chartOptions} series={chartSeries} type="line" height={250} />
      </div>
    </>
  )
}

const SidebarAreaSelling = ({
  isOpen,
  onClose,

  // SHOPPING TAB LOGIC - Cart and payment props
  cart,
  updateQuantity,
  removeFromCart,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  discount,
  setDiscount,
  selectedVat,
  setSelectedVat,
  selectedMemberMain,
  setSelectedMemberMain,
  memberSearchQuery,
  setMemberSearchQuery,
  showMemberResults,
  setShowMemberResults,
  members,
  sellWithoutMember,
  setSellWithoutMember,
  setIsTempMemberModalOpen,
  filteredMembers,
  selectMember,
  subtotal,
  discountValue,
  discountAmount,
  afterDiscount,
  vatAmount,
  total,
  handleCheckout,

  // WIDGETS TAB LOGIC - Widget system props
  isSidebarEditing,
  toggleSidebarEditing,
  rightSidebarWidgets,
  moveRightSidebarWidget,
  removeRightSidebarWidget,
  setIsRightWidgetModalOpen,
  communications,
  redirectToCommunication,
  todos,
  handleTaskComplete,
  todoFilter,
  setTodoFilter,
  todoFilterOptions,
  isTodoFilterDropdownOpen,
  setIsTodoFilterDropdownOpen,
  openDropdownIndex,
  toggleDropdown,
  handleEditTask,
  setTaskToCancel,
  setTaskToDelete,
  birthdays,
  isBirthdayToday,
  handleSendBirthdayMessage,
  customLinks,
  truncateUrl,
  appointments,
  renderSpecialNoteIcon,
  handleDumbbellClick,
  handleCheckIn,
  handleAppointmentOptionsModal,
  selectedMemberType,
  setSelectedMemberType,
  memberTypes,
  isChartDropdownOpen,
  setIsChartDropdownOpen,
  chartOptions,
  chartSeries,
  expiringContracts,
  getWidgetPlacementStatus,
  onSaveSpecialNote,

  // NOTIFICATIONS TAB LOGIC - Notification props
  notifications,
  hasUnreadNotifications,
}) => {
  const todoFilterDropdownRef = useRef(null)
  const chartDropdownRef = useRef(null)
  const notePopoverRef = useRef(null)

  // Widget tab states
  const [savedViews, setSavedViews] = useState([])
  const [currentView, setCurrentView] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("shopping") // Default to shopping for selling page

  const [sidebarActiveNoteId, setSidebarActiveNoteId] = useState(null)
  const [isSidebarSpecialNoteModalOpen, setIsSidebarSpecialNoteModalOpen] = useState(false)
  const [selectedSidebarAppointmentForNote, setSelectedSidebarAppointmentForNote] = useState(null)

  const [sidebarBulletinFilter, setSidebarBulletinFilter] = useState("all")

  // Todo filter functions for widgets tab
  const getFilteredTodos = () => {
    switch (todoFilter) {
      case "ongoing":
        return todos.filter((todo) => todo.status === "ongoing")
      case "pending":
        return todos.filter((todo) => todo.status === "pending")
      case "completed":
        return todos.filter((todo) => todo.status === "completed")
      default:
        return todos
    }
  }

  const handleSidebarBulletinFilterChange = (filter) => {
    setSidebarBulletinFilter(filter)
  }

  const getSidebarFilteredBulletinPosts = () => {
    if (sidebarBulletinFilter === "all") {
      return bulletinBoardData
    }
    return bulletinBoardData.filter((post) => post.category === sidebarBulletinFilter)
  }

  const handleSidebarEditNote = (appointmentId, currentNote) => {
    const appointment = appointments.find((app) => app.id === appointmentId)
    if (appointment) {
      setIsSidebarSpecialNoteModalOpen(false)
      setSelectedSidebarAppointmentForNote(null)

      setTimeout(() => {
        setSelectedSidebarAppointmentForNote(appointment)
        setIsSidebarSpecialNoteModalOpen(true)
      }, 10)
    }
  }

  const handleSaveSidebarSpecialNote = (appointmentId, updatedNote) => {
    if (typeof onSaveSpecialNote === "function") {
      onSaveSpecialNote(appointmentId, updatedNote)
    }
    toast.success("Special note updated successfully")
  }

  const renderSidebarSpecialNoteIcon = useCallback(
    (specialNote, memberId) => {
      if (!specialNote.text) return null
      const isActive =
        specialNote.startDate === null ||
        (new Date() >= new Date(specialNote.startDate) && new Date() <= new Date(specialNote.endDate))
      if (!isActive) return null

      const handleNoteClick = (e) => {
        e.stopPropagation()
        setSidebarActiveNoteId(sidebarActiveNoteId === memberId ? null : memberId)
      }

      return (
        <div className="relative">
          <div
            className={`${
              specialNote.isImportant ? "bg-red-500" : "bg-blue-500"
            } rounded-full p-0.5 shadow-[0_0_0_1.5px_white] cursor-pointer`}
            onClick={handleNoteClick}
          >
            {specialNote.isImportant ? (
              <AlertTriangle size={18} className="text-white" />
            ) : (
              <Info size={18} className="text-white" />
            )}
          </div>

          {sidebarActiveNoteId === memberId && (
            <div
              ref={notePopoverRef}
              className="absolute left-0 top-6 w-74 bg-black/90 backdrop-blur-xl rounded-lg border border-gray-700 shadow-lg z-20"
            >
              <div className="bg-gray-800 p-3 rounded-t-lg border-b border-gray-700 flex items-center gap-2">
                {specialNote.isImportant ? (
                  <AlertTriangle className="text-red-500 shrink-0" size={18} />
                ) : (
                  <Info className="text-blue-500 shrink-0" size={18} />
                )}
                <h4 className="text-white flex text-sm gap-1 items-center font-medium">
                  <div>Special Note</div>
                  <div className="text-sm text-gray-400">
                    {specialNote.isImportant ? "(Important)" : "(Unimportant)"}
                  </div>
                </h4>
                <button
                  onClick={() => handleSidebarEditNote(memberId, specialNote)}
                  className="ml-auto text-gray-400 hover:text-white mr-2"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSidebarActiveNoteId(null)
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-3">
                <p className="text-white text-sm leading-relaxed">{specialNote.text}</p>
                {specialNote.startDate && specialNote.endDate ? (
                  <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                    <p className="text-xs text-gray-300 flex items-center gap-1.5">
                      <CalendarIcon size={12} />
                      Valid from {new Date(specialNote.startDate).toLocaleDateString()} to{" "}
                      {new Date(specialNote.endDate).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 bg-gray-800/50 p-2 rounded-md border-l-2 border-blue-500">
                    <p className="text-xs text-gray-300 flex items-center gap-1.5">
                      <CalendarIcon size={12} />
                      Always valid
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )
    },
    [sidebarActiveNoteId, appointments],
  )

  return (
    <>
      <aside
        className={`
            fixed top-0 right-0 h-full text-white w-full md:w-[30%] bg-[#181818] border-l border-gray-700 z-50
            transform transition-transform duration-500 ease-in-out
            ${isOpen ? "translate-x-0" : "translate-x-full"}
          `}
      >
        <div className="p-4 md:p-5 custom-scrollbar overflow-y-auto h-full">
          {/* Header with close button and controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-between w-full mb-3 sm:mb-4">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <h2 className="text-base sm:text-lg font-semibold text-white truncate">Selling Sidebar</h2>
                  {currentView && (
                    <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs whitespace-nowrap">
                      {currentView.name}
                    </span>
                  )}
                </div>
              </div>
              <div></div>
              <div className="flex items-center gap-1 sm:gap-2">
                {/* WIDGETS TAB LOGIC - View management and widget controls */}
                {!isSidebarEditing && activeTab === "widgets" && (
                  <button
                    onClick={() => setIsViewModalOpen(true)}
                    className="p-1.5 sm:p-2 bg-gray-600 text-white hover:bg-gray-700 rounded-lg cursor-pointer"
                    title="Manage Sidebar Views"
                  >
                    <Eye size={14} />
                  </button>
                )}
                {activeTab === "widgets" && isSidebarEditing && (
                  <button
                    onClick={() => setIsRightWidgetModalOpen(true)}
                    className="p-1.5 sm:p-2 bg-black text-white hover:bg-zinc-900 rounded-lg cursor-pointer"
                    title="Add Widget"
                  >
                    <Plus size={14} />
                  </button>
                )}
                {activeTab === "widgets" && (
                  <button
                    onClick={toggleSidebarEditing}
                    className={`p-1.5 sm:p-2 ${
                      isSidebarEditing ? "bg-blue-600 text-white" : "text-zinc-400 hover:bg-zinc-800"
                    } rounded-lg flex items-center gap-1`}
                    title="Toggle Edit Mode"
                  >
                    {isSidebarEditing ? <Check size={14} /> : <Edit size={14} />}
                  </button>
                )}
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="p-1.5 sm:p-2 text-zinc-400 hover:bg-zinc-700 rounded-xl lg:hidden"
                  aria-label="Close sidebar"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation - Shopping, Widgets, Notifications */}
          <div className="flex mb-3 sm:mb-4 bg-black rounded-xl p-1">
            {/* SHOPPING TAB LOGIC - Shopping cart tab */}
            <button
              onClick={() => setActiveTab("shopping")}
              className={`flex-1 py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors relative ${
                activeTab === "shopping" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              <ShoppingCart size={14} className="inline mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Shopping</span>
              {cart?.length > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            {/* WIDGETS TAB LOGIC - Widgets management tab */}
            <button
              onClick={() => setActiveTab("widgets")}
              className={`flex-1 py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === "widgets" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Settings size={14} className="inline mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Widgets</span>
            </button>

            {/* NOTIFICATIONS TAB LOGIC - Notifications tab */}
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex-1 py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors relative ${
                activeTab === "notifications" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Bell size={14} className="inline mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Notifications</span>

              {hasUnreadNotifications && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-orange-500 rounded-full">
                  {notifications?.length || 0}
                </span>
              )}
            </button>
          </div>

          {/* SHOPPING TAB LOGIC - Shopping Cart Content */}
          {/* Shopping Tab */}
          {activeTab === "shopping" && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold oxanium_font mb-6">Shopping Basket</h2>
              <div className="mt-3">
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
                  />{" "}
                  Sell without selecting a member
                </label>
              </div>
              {!sellWithoutMember && (
                <div className="mb-4 relative member-search-container mt-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={memberSearchQuery}
                      onChange={(e) => {
                        setMemberSearchQuery(e.target.value)
                        setShowMemberResults(true)
                        setSellWithoutMember(false)
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
                            <div className="flex gap-2">
                              {member.isTemp && <span className="text-xs bg-orange-500 px-2 py-1 rounded">Temp</span>}
                              <span className="text-xs bg-blue-500 px-2 py-1 rounded">{member.type}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-400 text-sm">No members found</div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Cart items */}
              <div className="space-y-4 max-h-[40vh] overflow-y-auto mb-4">
                {cart.length === 0 ? (
                  <div className="text-center py-6 text-gray-400">Your basket is empty</div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="bg-[#1C1C1C] rounded-lg p-4 relative">
                      <div className="flex gap-3">
                        {item.image && (
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="mb-1 oxanium_font">{item.name}</h3>
                          {item.type === "product" && item.articalNo && (
                            <p className="text-xs text-zinc-400 mb-1">Art. No: {item.articalNo}</p>
                          )}
                          <p className="text-sm font-bold">${item.price.toFixed(2)}</p>
                          <div className="flex gap-2 mt-1">
                            <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                              {item.type === "service" ? "Service" : "Product"}
                            </span>
                            {item.vatRate && (
                              <span className="text-xs bg-blue-600 px-2 py-1 rounded">VAT: {item.vatRate}%</span>
                            )}
                          </div>
                        </div>
                      </div>
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

              {/* Payment options */}
              {cart.length > 0 && (
                <>
                  <div className="space-y-4 mb-4">
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
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-200 block mb-2">Discount (%)</label>
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
                          className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-200 block mb-2">VAT (%)</label>
                        <select
                          value={selectedVat}
                          onChange={(e) => setSelectedVat(Number(e.target.value))}
                          className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                        >
                          <option value="19">19%</option>
                          <option value="7">7%</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#333333] pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discountValue > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Discount ({discountValue}%):</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-zinc-500">
                      <span className="text-gray-400">VAT ({selectedVat}%) - Info Only:</span>
                      <span>${vatAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold mt-2 pt-2 border-t border-[#333333]">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    
                  </div>

                  {/* Member/No member indicator */}
                  <div className="mt-4 p-3 bg-[#101010] rounded-xl">
                    <div className="text-sm text-gray-300">
                      {sellWithoutMember ? (
                        <span className="text-orange-400">Selling without member</span>
                      ) : selectedMemberMain ? (
                        <div>
                          <span className="text-green-400">
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

                  {/* Checkout button */}
                  <button
                    onClick={handleCheckout}
                    className="w-full mt-4 bg-[#FF843E] text-sm text-white py-3 rounded-xl hover:bg-[#FF843E]/90 transition-colors"
                  >
                    Checkout
                  </button>
                </>
              )}
            </div>
          )}

          {/* NOTIFICATIONS TAB LOGIC - Notification Content */}
          {activeTab === "notifications" && (
            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-bold">Notifications</h2>
              {notifications && notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div key={notification.id} className="p-3 bg-black rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <Bell size={16} className="text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-white">{notification.title}</h3>
                        <p className="text-xs text-zinc-400 mt-1">{notification.message}</p>
                        <p className="text-xs mt-2 flex items-center gap-1 text-zinc-500">
                          <Clock size={12} />
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-zinc-400">
                  <Bell size={40} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No notifications</p>
                </div>
              )}
            </div>
          )}

          {/* WIDGETS TAB LOGIC - Widgets Content */}
          {activeTab === "widgets" && (
            <>
              {rightSidebarWidgets
                .sort((a, b) => a.position - b.position)
                .map((widget, index) => (
                  <RightSidebarWidget
                    key={widget.id}
                    id={widget.id}
                    index={index}
                    isEditing={isSidebarEditing}
                    moveRightSidebarWidget={moveRightSidebarWidget}
                    removeRightSidebarWidget={removeRightSidebarWidget}
                  >
                    {/* Communications Widget */}
                    {widget.type === "communications" && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-lg md:text-xl font-bold cursor-pointer">Communications</h2>
                        </div>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            {communications?.slice(0, 2).map((comm) => (
                              <div
                                onClick={redirectToCommunication}
                                key={comm.id}
                                className="p-2 cursor-pointer bg-black rounded-xl"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <img
                                    src={comm.avatar || "/placeholder.svg"}
                                    alt="User"
                                    className="rounded-full h-8 w-8"
                                  />
                                  <div>
                                    <h3 className="text-sm">{comm.name}</h3>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs text-zinc-400">{comm.message}</p>
                                  <p className="text-xs mt-1 flex gap-1 items-center text-zinc-400">
                                    <Clock size={12} />
                                    {comm.time}
                                  </p>
                                </div>
                              </div>
                            ))}
                            <Link
                              to={"/dashboard/communication"}
                              className="text-sm text-white flex justify-center items-center text-center hover:underline"
                            >
                              See all
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Todo Widget */}
                    {widget.type === "todo" && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-lg md:text-xl font-bold cursor-pointer">To-Do</h2>
                        </div>
                        <div className="relative mb-3" ref={todoFilterDropdownRef}>
                          <button
                            onClick={() => setIsTodoFilterDropdownOpen(!isTodoFilterDropdownOpen)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-black rounded-xl text-white text-sm w-full justify-between"
                          >
                            {todoFilterOptions?.find((option) => option.value === todoFilter)?.label}
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          {isTodoFilterDropdownOpen && (
                            <div className="absolute z-10 mt-2 w-full bg-[#2F2F2F] rounded-xl shadow-lg">
                              {todoFilterOptions?.map((option) => (
                                <button
                                  key={option.value}
                                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-black first:rounded-t-xl last:rounded-b-xl"
                                  onClick={() => {
                                    setTodoFilter(option.value)
                                    setIsTodoFilterDropdownOpen(false)
                                  }}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          {getFilteredTodos()
                            ?.slice(0, 3)
                            .map((todo) => (
                              <div key={todo.id} className="p-2 bg-black rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-2 flex-1">
                                  <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => handleTaskComplete(todo.id)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                  />
                                  <div className="flex-1">
                                    <h3
                                      className={`font-semibold text-sm ${todo.completed ? "line-through text-gray-500" : ""}`}
                                    >
                                      {todo.title}
                                    </h3>
                                    <p className="text-xs text-zinc-400">
                                      Due: {todo.dueDate} {todo.dueTime && `at ${todo.dueTime}`}
                                    </p>
                                  </div>
                                </div>
                                <div className="relative">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleDropdown(`todo-${todo.id}`)
                                    }}
                                    className="p-1 hover:bg-zinc-700 rounded"
                                  >
                                    <MoreVertical size={16} />
                                  </button>
                                  {openDropdownIndex === `todo-${todo.id}` && (
                                    <div className="absolute right-0 top-8 bg-[#2F2F2F] rounded-lg shadow-lg z-10 min-w-[120px]">
                                      <button
                                        onClick={() => {
                                          handleEditTask(todo)
                                        }}
                                        className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-600 rounded-t-lg"
                                      >
                                        Edit Task
                                      </button>
                                      <button
                                        onClick={() => {
                                          setTaskToCancel(todo.id)
                                        }}
                                        className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-600"
                                      >
                                        Cancel Task
                                      </button>
                                      <button
                                        onClick={() => {
                                          setTaskToDelete(todo.id)
                                        }}
                                        className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-600 rounded-b-lg text-red-400"
                                      >
                                        Delete Task
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          <Link
                            to={"/dashboard/to-do"}
                            className="text-sm text-white flex justify-center items-center text-center hover:underline"
                          >
                            See all
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Birthday Widget */}
                    {widget.type === "birthday" && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-lg md:text-xl font-bold cursor-pointer">Upcoming Birthday</h2>
                        </div>
                        <div className="space-y-2">
                          {birthdays?.slice(0, 3).map((birthday) => (
                            <div
                              key={birthday.id}
                              className={`p-2 cursor-pointer rounded-xl flex items-center gap-2 justify-between ${
                                isBirthdayToday(birthday.date)
                                  ? "bg-yellow-900/30 border border-yellow-600"
                                  : "bg-black"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div>
                                  <img
                                    src={birthday.avatar || "/placeholder.svg"}
                                    className="h-8 w-8 rounded-full"
                                    alt=""
                                  />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-sm flex items-center gap-1">
                                    {birthday.name}
                                    {isBirthdayToday(birthday.date) && <span className="text-yellow-500">🎂</span>}
                                  </h3>
                                  <p className="text-xs text-zinc-400">{birthday.date}</p>
                                </div>
                              </div>
                              {isBirthdayToday(birthday.date) && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleSendBirthdayMessage(birthday)
                                  }}
                                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                                  title="Send Birthday Message"
                                >
                                  <MessageCircle size={16} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Website Links Widget */}
                    {widget.type === "websiteLinks" && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-lg md:text-xl font-bold cursor-pointer">Website Links</h2>
                        </div>
                        <div className="space-y-2">
                          {customLinks?.map((link) => (
                            <div
                              key={link.id}
                              className="p-2 cursor-pointer bg-black rounded-xl flex items-center justify-between"
                            >
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm truncate">{link.title}</h3>
                                <p className="text-xs text-zinc-400 truncate max-w-[150px]">
                                  {truncateUrl(link.url, 30)}
                                </p>
                              </div>
                              <button
                                onClick={() => window.open(link.url, "_blank")}
                                className="p-2 hover:bg-zinc-700 rounded-lg"
                              >
                                <ExternalLink size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Appointments Widget */}
                    {widget.type === "appointments" && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-lg md:text-xl font-bold cursor-pointer">Upcoming Appointments</h2>
                        </div>
                        <div className="space-y-2 max-h-[25vh] overflow-y-auto custom-scrollbar pr-1">
                          {appointments?.length > 0 ? (
                            appointments.slice(0, 2).map((appointment, index) => (
                              <div
                                key={appointment.id}
                                className={`${appointment.color} rounded-xl cursor-pointer p-3 relative`}
                              >
                                <div className="absolute p-2 top-0 left-0 z-10 flex flex-col gap-1">
                                  {renderSidebarSpecialNoteIcon(appointment.specialNote, appointment.id)}
                                </div>
                                <div
                                  className="flex flex-col items-center justify-between gap-2 cursor-pointer"
                                  onClick={() => {
                                    handleAppointmentOptionsModal(appointment)
                                  }}
                                >
                                  <div className="flex items-center gap-2 ml-5 relative w-full justify-center">
                                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center relative">
                                      <img
                                        src={Avatar || "/placeholder.svg"}
                                        alt=""
                                        className="w-full h-full rounded-full"
                                      />
                                    </div>
                                    <div className="text-white text-left">
                                      <p className="font-semibold text-sm">{appointment.name}</p>
                                      <p className="text-xs flex gap-1 items-center opacity-80">
                                        <Clock size={14} />
                                        {appointment.time} | {appointment.date.split("|")[0]}
                                      </p>
                                      <p className="text-xs opacity-80 mt-1">
                                        {appointment.isTrial ? "Trial Session" : appointment.type}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleCheckIn(appointment.id)
                                      }}
                                      className={`px-3 py-1 text-xs font-medium rounded-lg ${
                                        appointment.isCheckedIn
                                          ? " border border-white/50 text-white bg-transparent"
                                          : "bg-black text-white"
                                      }`}
                                    >
                                      {appointment.isCheckedIn ? "Checked In" : "Check In"}
                                    </button>
                                    <div
                                      className="cursor-pointer rounded transition-colors"
                                      onClick={(e) => handleDumbbellClick(appointment, e)}
                                    >
                                      <Dumbbell size={16} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-white text-center text-sm">No appointments scheduled.</p>
                          )}
                        </div>
                        <div className="flex justify-center mt-2">
                          <Link to="/dashboard/appointments" className="text-sm text-white hover:underline">
                            See all
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Chart Widget */}
                    {widget.type === "chart" && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-lg md:text-xl font-bold cursor-pointer">Chart</h2>
                        </div>
                        <div className="p-4 bg-black rounded-xl">
                          <ChartWithLocalState
                            selectedMemberType={selectedMemberType}
                            setSelectedMemberType={setSelectedMemberType}
                            isChartDropdownOpen={isChartDropdownOpen}
                            setIsChartDropdownOpen={setIsChartDropdownOpen}
                            memberTypes={memberTypes}
                            chartOptions={chartOptions}
                            chartSeries={chartSeries}
                          />
                        </div>
                      </div>
                    )}

                    {/* Expiring Contracts Widget */}
                    {widget.type === "expiringContracts" && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="text-lg md:text-xl font-bold cursor-pointer">Expiring Contracts</h2>
                        </div>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                          {expiringContracts?.slice(0, 3).map((contract) => (
                            <Link to="/dashboard/contract" key={contract.id}>
                              <div className="p-3 bg-black rounded-lg hover:bg-zinc-900 mt-2 transition-colors">
                                <div className="flex justify-between items-start gap-2">
                                  <div className="min-w-0">
                                    <h3 className="text-sm font-medium truncate">{contract.title}</h3>
                                    <p className="text-xs mt-1 text-zinc-400">Expires: {contract.expiryDate}</p>
                                  </div>
                                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400 whitespace-nowrap">
                                    {contract.status}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="flex justify-center mt-3">
                          <Link to="/dashboard/contract" className="text-sm text-white hover:underline">
                            See all
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Bulletin Board Widget */}
                    {widget.type === "bulletinBoard" && (
                      <div className="space-y-3 p-4 rounded-xl bg-[#2F2F2F] h-auto flex flex-col">
                        <div className="flex justify-between items-center">
                          <h2 className="text-lg font-semibold">Bulletin Board</h2>
                        </div>
                        <div className="relative">
                          <select
                            value={sidebarBulletinFilter}
                            onChange={(e) => handleSidebarBulletinFilterChange(e.target.value)}
                            className="w-full p-2 bg-black rounded-xl text-white text-sm"
                          >
                            <option value="all">All Posts</option>
                            <option value="staff">Staff Only</option>
                            <option value="members">Members Only</option>
                          </select>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 mt-2">
                          <div className="space-y-2">
                            {getSidebarFilteredBulletinPosts()
                              ?.slice(0, 2)
                              .map((post) => (
                                <div key={post.id} className="p-3 bg-black rounded-xl">
                                  <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-sm">{post.title}</h3>
                                  </div>
                                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{post.content}</p>
                                  <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-zinc-500 capitalize">{post.category}</span>
                                    <span className="text-xs text-zinc-500">{post.date}</span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Staff Check-in Widget */}
                    {widget.type === "staffCheckIn" && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-lg md:text-xl font-bold cursor-pointer">Staff login</h2>
                        </div>
                        <div className="bg-black rounded-xl p-4">
                          <StaffCheckInWidget />
                        </div>
                      </div>
                    )}
                  </RightSidebarWidget>
                ))}
            </>
          )}
        </div>
      </aside>

      {/* Special Note Modal for Sidebar */}
      {isSidebarSpecialNoteModalOpen && selectedSidebarAppointmentForNote && (
        <SpecialNoteEditModal
          isOpen={isSidebarSpecialNoteModalOpen}
          onClose={() => {
            setIsSidebarSpecialNoteModalOpen(false)
            setSelectedSidebarAppointmentForNote(null)
          }}
          appointment={selectedSidebarAppointmentForNote}
          onSave={handleSaveSidebarSpecialNote}
        />
      )}

      {/* View Management Modal for Widgets Tab */}
      <ViewManagementModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        savedViews={savedViews}
        setSavedViews={setSavedViews}
        currentView={currentView}
        setCurrentView={setCurrentView}
        sidebarWidgets={rightSidebarWidgets}
        setSidebarWidgets={() => {}} // This might need to be adjusted based on your implementation
      />
    </>
  )
}

export default SidebarAreaSelling
