"use client"

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react"
import { Link } from "react-router-dom"
import {
  X,
  Plus,
  ArrowUp,
  ArrowDown,
  Clock,
  ExternalLink,
  MoreVertical,
  Bell,
  Settings,
  CheckCircle,
  AlertTriangle,
  Edit,
  Check,
  ShoppingBasket,
  Minus,
  Trash2,
  Search,
  UserPlus,
} from "lucide-react"
import { toast } from "react-hot-toast"
import Image10 from "../../../public/image10.png"

const SidebarWidgetSelectionModal = ({ isOpen, onClose, onSelectWidget, canAddWidget }) => {
  if (!isOpen) return null
  const availableWidgets = [
    {
      id: "communications",
      name: "Communications",
      description: "View recent messages and communications",
      icon: "💬",
    },
    {
      id: "todo",
      name: "TO-DO",
      description: "Manage your tasks and to-do items",
      icon: "✅",
    },
    {
      id: "birthday",
      name: "Birthdays",
      description: "Upcoming member birthdays",
      icon: "🎂",
    },
    {
      id: "websiteLinks",
      name: "Website Links",
      description: "Quick access to important websites",
      icon: "🔗",
    },
  ]
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
      <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Add Sidebar Widget</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-700 rounded-lg text-white">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {availableWidgets.map((widget) => (
            <div
              key={widget.id}
              className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                canAddWidget(widget.id)
                  ? "border-zinc-700 hover:border-blue-500 hover:bg-blue-500/10"
                  : "border-zinc-800 bg-zinc-900/50 cursor-not-allowed opacity-50"
              }`}
              onClick={() => canAddWidget(widget.id) && onSelectWidget(widget.id)}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{widget.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-white">{widget.name}</h4>
                  <p className="text-xs text-zinc-400 mt-1">{widget.description}</p>
                  {!canAddWidget(widget.id) && <p className="text-xs text-red-400 mt-1">Already added</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    title: "New Member Registration",
    message: "John Doe has registered for a premium membership",
    time: "2 minutes ago",
    type: "success",
    icon: CheckCircle,
    color: "text-green-400",
  },
  {
    id: 2,
    title: "Payment Reminder",
    message: "3 members have overdue payments",
    time: "15 minutes ago",
    type: "warning",
    icon: AlertTriangle,
    color: "text-yellow-400",
  },
]

const WebsiteLinkModal = ({ link, onClose, customLinks, setCustomLinks }) => {
  const [title, setTitle] = useState(link?.title?.trim() || "")
  const [url, setUrl] = useState(link?.url?.trim() || "")
  const handleSave = () => {
    if (!title.trim() || !url.trim()) return
    if (link?.id) {
      // Update existing link
      setCustomLinks((currentLinks) =>
        currentLinks.map((l) => (l.id === link.id ? { ...l, title: title.trim(), url: url.trim() } : l)),
      )
    } else {
      // Add new link
      const newLink = {
        id: `link${Date.now()}`,
        url: url.trim(),
        title: title.trim(),
      }
      setCustomLinks((prev) => [...prev, newLink])
    }
    onClose()
    toast.success(link?.id ? "Link updated successfully" : "Link added successfully")
  }
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70]">
      <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Website Link</h2>
            <button onClick={onClose} className="p-2 hover:bg-zinc-700 rounded-lg text-white">
              <X size={16} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-black rounded-xl text-sm outline-none text-white"
                placeholder="Enter title"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-3 bg-black rounded-xl text-sm outline-none text-white"
                placeholder="https://example.com"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-6">
            <button onClick={onClose} className="px-4 py-2 text-sm rounded-xl hover:bg-zinc-700 text-white">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || !url.trim()}
              className={`px-4 py-2 text-sm rounded-xl ${
                !title.trim() || !url.trim() ? "bg-blue-600/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SidebarAreaSelling({
  isOpen,
  onClose,
  communications,
  todos,
  birthdays,
  customLinks,
  setCustomLinks,
  redirectToCommunication,
  redirectToTodos,
  toggleDropdown,
  openDropdownIndex,
  setEditingLink,
  isEditing,
  // Shopping cart props
  cart = [],
  updateQuantity,
  removeFromCart,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  discount,
  setDiscount,
  selectedVat,
  setSelectedVat,
  selectedMember,
  setSelectedMember,
  memberSearchQuery,
  setMemberSearchQuery,
  showMemberResults,
  setShowMemberResults,
  members = [],
  sellWithoutMember,
  setSellWithoutMember,
  setIsTempMemberModalOpen,
  filteredMembers = [],
  selectMember,
  subtotal = 0,
  discountValue = 0,
  discountAmount = 0,
  afterDiscount = 0,
  vatAmount = 0,
  total = 0,
  handleCheckout,
}) {
  const [activeTab, setActiveTab] = useState("shopping")
  const [sidebarWidgets, setSidebarWidgets] = useState([
    { id: "communications", type: "communications", position: 0 },
    { id: "todo", type: "todo", position: 1 },
    { id: "birthday", type: "birthday", position: 2 },
    { id: "websiteLinks", type: "websiteLinks", position: 3 },
  ])
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false)
  const [editingLinkLocal, setEditingLinkLocal] = useState(null)
  const [isSidebarEditing, setIsSidebarEditing] = useState(false)
  const toggleSidebarEditing = () => {
    setIsSidebarEditing(!isSidebarEditing)
  }
  const moveSidebarWidget = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= sidebarWidgets.length) return
    const newWidgets = [...sidebarWidgets]
    const [movedWidget] = newWidgets.splice(fromIndex, 1)
    newWidgets.splice(toIndex, 0, movedWidget)
    setSidebarWidgets(newWidgets.map((w, i) => ({ ...w, position: i })))
  }
  const removeSidebarWidget = (id) => {
    setSidebarWidgets((currentWidgets) => currentWidgets.filter((w) => w.id !== id))
    toast.success("Widget removed successfully")
  }
  const handleAddWidget = (widgetType) => {
    const newWidget = {
      id: `sidebarWidget${Date.now()}`,
      type: widgetType,
      position: sidebarWidgets.length,
    }
    setSidebarWidgets((currentWidgets) => [...currentWidgets, newWidget])
    setIsWidgetModalOpen(false)
    toast.success(`${widgetType} widget has been added to sidebar`)
  }
  const canAddWidget = (widgetType) => {
    return !sidebarWidgets.some((widget) => widget.type === widgetType)
  }
  const addCustomLink = () => {
    setEditingLinkLocal({})
  }
  const removeCustomLink = (id) => {
    setCustomLinks((currentLinks) => currentLinks.filter((link) => link.id !== id))
    toast.success("Link removed successfully")
  }
  const moveCustomLink = (id, direction) => {
    setCustomLinks((currentLinks) => {
      const index = currentLinks.findIndex((link) => link.id === id)
      if ((direction === "up" && index === 0) || (direction === "down" && index === currentLinks.length - 1)) {
        return currentLinks
      }
      const newLinks = [...currentLinks]
      const swap = direction === "up" ? index - 1 : index + 1
      ;[newLinks[index], newLinks[swap]] = [newLinks[swap], newLinks[index]]
      return newLinks
    })
  }
  // Sidebar Widget Component with full edit functionality
  const SidebarWidget = ({ id, children, index, isEditing }) => {
    return (
      <div className="relative mb-6">
        {isEditing && (
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <button
              onClick={() => moveSidebarWidget(index, index - 1)}
              className="p-1.5 bg-gray-800 rounded hover:bg-gray-700 text-white"
              disabled={index === 0}
              title="Move Up"
            >
              <ArrowUp size={12} />
            </button>
            <button
              onClick={() => moveSidebarWidget(index, index + 1)}
              className="p-1.5 bg-gray-800 rounded hover:bg-gray-700 text-white"
              disabled={index === sidebarWidgets.length - 1}
              title="Move Down"
            >
              <ArrowDown size={12} />
            </button>
            <button
              onClick={() => removeSidebarWidget(id)}
              className="p-1.5 bg-gray-800 rounded hover:bg-gray-700 text-white"
              title="Remove Widget"
            >
              <X size={12} />
            </button>
          </div>
        )}
        {children}
      </div>
    )
  }
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}
      <aside
        className={`
          fixed top-0 right-0 h-full w-full sm:w-96 lg:w-[30%] bg-[#181818] border-l border-gray-700 z-50
          transform transition-transform duration-500 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-4 md:p-5 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Select View</h2>
            <div className="flex items-center gap-2">
              {activeTab === "widgets" && (
                <button
                  onClick={() => setIsWidgetModalOpen(true)}
                  className="p-2 bg-black text-white hover:bg-zinc-900 rounded-lg text-sm cursor-pointer"
                  title="Add Widget"
                >
                  <Plus size={16} />
                </button>
              )}
              {activeTab === "widgets" && (
                <button
                  onClick={toggleSidebarEditing}
                  className={`p-2 ${
                    isSidebarEditing ? "bg-blue-600 text-white" : "text-zinc-400 hover:bg-zinc-800"
                  } rounded-lg flex items-center gap-1`}
                  title="Toggle Edit Mode"
                >
                  {isSidebarEditing ? <Check size={16} /> : <Edit size={16} />}
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:bg-zinc-700 rounded-xl md:hidden"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          {/* Updated Tab Navigation with Shopping Tab */}
          <div className="flex mb-4 bg-black rounded-xl p-1">
            <button
              onClick={() => setActiveTab("shopping")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "shopping" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              <ShoppingBasket size={16} className="inline mr-2" /> Shopping
              {cart.length > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("widgets")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "widgets" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Settings size={16} className="inline mr-2" /> Widgets
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "notifications" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Bell size={16} className="inline mr-2" /> Notifications
            </button>
          </div>
          {/* Widgets Tab */}
          {activeTab === "widgets" && (
            <div>
              {sidebarWidgets
                .sort((a, b) => a.position - b.position)
                .map((widget, index) => (
                  <SidebarWidget key={widget.id} id={widget.id} index={index} isEditing={isSidebarEditing}>
                    {widget.type === "communications" && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-lg md:text-xl font-bold cursor-pointer text-white">Communications</h2>
                        </div>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            {communications.slice(0, 2).map((comm) => (
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
                                    <h3 className="text-sm text-white">{comm.name}</h3>
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
                    {widget.type === "todo" && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-lg md:text-xl font-bold cursor-pointer text-white">TO-DO</h2>
                        </div>
                        <div className="space-y-3">
                          {todos.slice(0, 2).map((todo) => (
                            <div
                              onClick={redirectToTodos}
                              key={todo.id}
                              className="p-2 cursor-pointer bg-black rounded-xl flex items-center justify-between"
                            >
                              <div>
                                <h3 className="font-semibold text-sm text-white">{todo.title}</h3>
                                <p className="text-xs text-zinc-400">{todo.description}</p>
                              </div>
                              <button className="px-3 py-1.5 flex justify-center items-center gap-2 bg-blue-600 text-white rounded-xl text-xs">
                                <img src={Image10 || "/placeholder.svg"} alt="" className="w-4 h-4" />
                                {todo.assignee}
                              </button>
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
                    {widget.type === "birthday" && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-lg md:text-xl font-bold cursor-pointer text-white">Upcoming Birthday</h2>
                        </div>
                        <div className="space-y-2">
                          {birthdays.slice(0, 2).map((birthday) => (
                            <div
                              key={birthday.id}
                              className="p-2 cursor-pointer bg-black rounded-xl flex items-center gap-2"
                            >
                              <div>
                                <img
                                  src={birthday.avatar || "/placeholder.svg"}
                                  className="h-8 w-8 rounded-full"
                                  alt=""
                                />
                              </div>
                              <div>
                                <h3 className="font-semibold text-sm text-white">{birthday.name}</h3>
                                <p className="text-xs text-zinc-400">{birthday.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {widget.type === "websiteLinks" && (
                      <div className="mb-6">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg md:text-xl font-bold cursor-pointer text-white">Website Links</h2>
                          </div>
                          <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                            <div className="space-y-3">
                              {customLinks.map((link, linkIndex) => (
                                <div key={link.id} className="p-1.5 bg-black rounded-xl relative">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <h3 className="text-sm font-medium text-white">{link.title}</h3>
                                      <p className="text-xs mt-1 text-zinc-400">{link.url}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() =>
                                          window.open(
                                            link.url.startsWith("http") ? link.url : `https://${link.url}`,
                                            "_blank",
                                          )
                                        }
                                        className="p-2 hover:bg-zinc-700 rounded-lg text-white"
                                      >
                                        <ExternalLink size={16} />
                                      </button>
                                      {!isSidebarEditing && (
                                        <div className="relative">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              toggleDropdown(`sidebar-link-${link.id}`)
                                            }}
                                            className="p-2 hover:bg-zinc-700 rounded-lg text-white"
                                          >
                                            <MoreVertical size={16} />
                                          </button>
                                          {openDropdownIndex === `sidebar-link-${link.id}` && (
                                            <div className="absolute right-0 top-full mt-1 w-32 bg-zinc-800 rounded-lg shadow-lg z-50 py-1">
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  setEditingLinkLocal(link)
                                                  toggleDropdown(null)
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-700 text-white"
                                              >
                                                Edit
                                              </button>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  removeCustomLink(link.id)
                                                  toggleDropdown(null)
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-700 text-red-400"
                                              >
                                                Remove
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  {isSidebarEditing && (
                                    <div className="absolute top-2 right-2 z-10 flex gap-2">
                                      <button
                                        onClick={() => moveCustomLink(link.id, "up")}
                                        className="p-1 bg-gray-800 rounded hover:bg-gray-700 text-white"
                                        disabled={linkIndex === 0}
                                        title="Move Up"
                                      >
                                        <ArrowUp size={12} />
                                      </button>
                                      <button
                                        onClick={() => moveCustomLink(link.id, "down")}
                                        className="p-1 bg-gray-800 rounded hover:bg-gray-700 text-white"
                                        disabled={linkIndex === customLinks.length - 1}
                                        title="Move Down"
                                      >
                                        <ArrowDown size={16} />
                                      </button>
                                      <button
                                        onClick={() => removeCustomLink(link.id)}
                                        className="p-1 bg-gray-800 rounded hover:bg-gray-700 text-white"
                                        title="Remove Link"
                                      >
                                        <X size={12} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={addCustomLink}
                            className="w-full p-2 bg-black rounded-xl text-sm text-zinc-400 text-left hover:bg-zinc-900"
                          >
                            Add website link...
                          </button>
                        </div>
                      </div>
                    )}
                  </SidebarWidget>
                ))}
            </div>
          )}
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
                        setSelectedMember("")
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
                          selectedMember &&
                          members.find((m) => m.id === selectedMember)?.type !== "Temporary Member"
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
                      ) : selectedMember ? (
                        <div>
                          <span className="text-green-400">
                            Member: {members.find((m) => m.id === selectedMember)?.name}
                          </span>
                          <div className="text-xs text-zinc-400 mt-1">
                            Type: {members.find((m) => m.id === selectedMember)?.type}
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
          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Recent Notifications</h3>
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                  {mockNotifications.length}
                </span>
              </div>
              <div className="space-y-3">
                {mockNotifications.map((notification) => {
                  const IconComponent = notification.icon
                  return (
                    <div key={notification.id} className="p-3 bg-black rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className={`${notification.color} mt-1`}>
                          <IconComponent size={18} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-white">{notification.title}</h4>
                          <p className="text-xs text-zinc-400 mt-1">{notification.message}</p>
                          <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
                            <Clock size={12} />
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </aside>
      {/* Sidebar Widget Selection Modal */}
      <SidebarWidgetSelectionModal
        isOpen={isWidgetModalOpen}
        onClose={() => setIsWidgetModalOpen(false)}
        onSelectWidget={handleAddWidget}
        canAddWidget={canAddWidget}
      />
      {/* Website Link Modal */}
      {editingLinkLocal && (
        <WebsiteLinkModal
          link={editingLinkLocal}
          onClose={() => setEditingLinkLocal(null)}
          customLinks={customLinks}
          setCustomLinks={setCustomLinks}
        />
      )}
    </>
  )
}
